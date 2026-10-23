const USER_AGENT = "MindflareArena/1.0";
const REQUEST_TIMEOUT_MS = 12_000;
const lastRequestAt = new Map();
const originQueues = new Map();

function fetchUpstream(url, options) {
  const origin = new URL(url).origin;
  const interval = origin === "https://atcoder.jp" || origin === "https://kenkoooo.com" ? 1100 : 0;
  const previous = originQueues.get(origin) ?? Promise.resolve();
  const current = previous.then(async () => {
    const wait = Math.max(0, (lastRequestAt.get(origin) ?? 0) + interval - Date.now());
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    lastRequestAt.set(origin, Date.now());
    return fetch(url, options);
  });
  originQueues.set(origin, current.then(() => undefined, () => undefined));
  return current;
}

async function readJson(url, options = {}) {
  const response = await fetchUpstream(url, {
    ...options,
    headers: { "user-agent": USER_AGENT, accept: "application/json", ...options.headers },
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (response.status === 404) throw new Error("Profile not found");
  if (!response.ok) throw new Error(`Profile provider returned ${response.status}`);
  return response.json();
}

async function readHtml(url) {
  const response = await fetchUpstream(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html,application/xhtml+xml" },
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (response.status === 404) throw new Error("Profile not found");
  if (!response.ok) throw new Error(`Profile provider returned ${response.status}`);
  return response.text();
}

function finiteCount(value) {
  if (typeof value === "string") value = Number(value.replaceAll(",", ""));
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : undefined;
}

function firstNumericKey(value, keys) {
  if (!value || typeof value !== "object") return undefined;
  for (const key of keys) {
    const result = finiteCount(value[key]);
    if (result !== undefined) return result;
  }
  for (const child of Object.values(value)) {
    const result = firstNumericKey(child, keys);
    if (result !== undefined) return result;
  }
  return undefined;
}

function metric(text, labels) {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const before = new RegExp(`${escaped}[^\\d]{0,80}([\\d,]+)`, "i").exec(text);
    const after = new RegExp("([\\d,]+)[^a-z]{0,32}" + escaped, "i").exec(text);
    const found = finiteCount(before?.[1] ?? after?.[1]);
    if (found !== undefined) return found;
  }
  return undefined;
}

function htmlSummary(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function fromHtml(platform, html) {
  const text = htmlSummary(html);
  const embedded = [];
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/(?:ld\+json|json)["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { embedded.push(JSON.parse(match[1])); } catch { /* ignore unrelated or malformed page metadata */ }
  }
  for (const match of html.matchAll(/<script\b[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { embedded.push(JSON.parse(match[1])); } catch { /* ignore unrelated or malformed page metadata */ }
  }
  let drupalSettings = null;
  const drupalMatch = /jQuery\.extend\(Drupal\.settings,\s*(\{[\s\S]*?\})\s*\);/.exec(html);
  if (drupalMatch) {
    try { drupalSettings = JSON.parse(drupalMatch[1]); } catch { /* CodeChef may change its embedded settings format */ }
  }
  const solvedLabels = ["problems solved", "questions solved", "total solved", "solved problems"];
  const ratingLabels = ["current rating", "contest rating", "rating"];
  const maxRatingLabels = ["highest rating", "max rating", "maximum rating"];
  const solved = metric(text, solvedLabels) ?? firstNumericKey(embedded, ["totalProblemsSolved", "totalSolved", "problemsSolved", "solvedCount"]);
  let rating = metric(text, ratingLabels) ?? firstNumericKey(embedded, ["currentRating", "rating", "ratingNumber"]);
  let maxRating = metric(text, maxRatingLabels) ?? firstNumericKey(embedded, ["maxRating", "highestRating", "maximumRating"]);
  const rank = metric(text, ["global rank", "rank"] ) ?? firstNumericKey(embedded, ["globalRank", "rank"]);
  const scalarStats = {
    ...(solved === undefined ? {} : { totalQuestionsSolved: solved }),
    ...(rating === undefined ? {} : { currentRating: rating }),
    ...(maxRating === undefined ? {} : { maxRating }),
    ...(rank === undefined ? {} : { rank }),
    ...(() => {
      const count = metric(text, ["contests participated", "contests attended", "contests played"]) ?? firstNumericKey(embedded, ["contestsParticipated", "attendedContestsCount", "contestCount"]);
      return count === undefined ? {} : { contestCount: count };
    })(),
    ...(() => {
      const count = metric(text, ["submissions", "total submissions"]) ?? firstNumericKey(embedded, ["totalSubmissions", "submissionCount"]);
      return count === undefined ? {} : { totalSubmissions: count };
    })(),
    ...(() => {
      const count = metric(text, ["active days", "days active"]) ?? firstNumericKey(embedded, ["totalActiveDays", "activeDays"]);
      return count === undefined ? {} : { totalActiveDays: count };
    })(),
    ...(() => {
      const count = metric(text, ["streak", "longest streak"]) ?? firstNumericKey(embedded, ["maxStreak", "longestStreak", "streak"]);
      return count === undefined ? {} : { maxStreak: count };
    })(),
    ...(() => {
      const count = metric(text, ["stars"]) ?? firstNumericKey(embedded, ["stars", "ratingStars"]);
      return count === undefined ? {} : { stars: count };
    })(),
    ...(() => {
      const score = metric(text, ["coding score", "score", "reputation", "points"]) ?? firstNumericKey(embedded, ["codingScore", "score", "reputation", "points"]);
      return score === undefined ? {} : { score };
    })(),
  };
  if (platform === "codechef") {
    const ratingMarkup = /class=["'][^"']*rating-number[^"']*["'][^>]*>\s*([\d,]+)/i.exec(html);
    rating = finiteCount(ratingMarkup?.[1]) ?? rating;
    const maxMarkup = /(?:highest\s+rating|max(?:imum)?\s+rating)[^\d]{0,80}([\d,]+)/i.exec(text);
    maxRating = finiteCount(maxMarkup?.[1]) ?? maxRating;
  }
  if (rating !== undefined) scalarStats.currentRating = rating;
  if (maxRating !== undefined) scalarStats.maxRating = maxRating;
  let contestHistory = [];
  if (platform === "codechef") {
    const ratingRows = drupalSettings?.date_versus_rating?.all;
    if (Array.isArray(ratingRows)) {
      let previousRating;
      contestHistory = ratingRows.flatMap((item) => {
        if (!item || item.code === "RATING_SHIFT_TO_ELO_RATING_CODE") return [];
        const itemRating = finiteCount(item.rating);
        const itemRank = finiteCount(item.rank);
        const contestDate = Math.floor(new Date(item.end_date).getTime() / 1000);
        if (itemRating === undefined || itemRank === undefined || !Number.isFinite(contestDate)) return [];
        const current = {
          contestName: String(item.name ?? "CodeChef rated contest").slice(0, 160),
          rating: itemRating,
          rank: itemRank,
          contestDate,
          ...(previousRating === undefined ? {} : { ratingChange: itemRating - previousRating }),
        };
        previousRating = itemRating;
        return [current];
      });
      scalarStats.contestCount = contestHistory.length;
    }
  }
  return {
    verificationText: `${html} ${text}`,
    stats: { ...scalarStats, ...(rank === undefined ? {} : { rank: `#${rank}` }) },
    profileStats: { ...scalarStats, ...(contestHistory.length ? { contestHistory } : {}) },
  };
}

async function codeforces(handle) {
  const info = await readJson(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
  const user = info.status === "OK" ? info.result?.[0] : null;
  if (!user) throw new Error("Profile not found");
  const submissions = await readJson(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=10000`);
  if (submissions.status !== "OK" || !Array.isArray(submissions.result)) throw new Error("Profile submissions are unavailable");
  const solved = new Set();
  const activityByDay = {};
  const topicDistribution = {};
  for (const item of submissions.result) {
    if (Number.isFinite(item.creationTimeSeconds)) {
      const day = new Date(item.creationTimeSeconds * 1000).toISOString().slice(0, 10);
      activityByDay[day] = (activityByDay[day] ?? 0) + 1;
    }
    if (item.verdict === "OK" && item.problem?.contestId && item.problem?.index) {
      const problemKey = `${item.problem.contestId}_${item.problem.index}`;
      if (solved.has(problemKey)) continue;
      solved.add(problemKey);
      for (const tag of item.problem.tags ?? []) topicDistribution[tag] = (topicDistribution[tag] ?? 0) + 1;
    }
  }
  const ratingChanges = await readJson(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`);
  const contests = (ratingChanges.status === "OK" && Array.isArray(ratingChanges.result) ? ratingChanges.result : []).map((item) => ({
    contestName: String(item.contestName ?? `Codeforces ${item.contestId ?? "contest"}`).slice(0, 160),
    rating: Math.max(0, Math.round(item.newRating)),
    rank: Math.max(0, Math.round(item.rank)),
    contestDate: Math.max(0, Math.round(item.ratingUpdateTimeSeconds)),
    ratingChange: Math.round(item.newRating - item.oldRating),
  })).filter((item) => Number.isFinite(item.rating) && Number.isFinite(item.rank) && Number.isFinite(item.contestDate));
  const stats = {
    ...(Number.isFinite(user.rating) ? { currentRating: Math.round(user.rating) } : {}),
    ...(Number.isFinite(user.maxRating) ? { maxRating: Math.round(user.maxRating) } : {}),
    ...(typeof user.rank === "string" ? { rank: user.rank } : {}),
    totalQuestionsSolved: solved.size,
  };
  return {
    verificationText: [user.firstName, user.lastName, user.organization, user.city].filter(Boolean).join(" "),
    stats,
    profileStats: { ...stats, activityByDay, totalActiveDays: Object.keys(activityByDay).length, topicDistribution, contestHistory: contests },
  };
}

async function leetcode(handle) {
  const payload = await readJson("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: `query Profile($username: String!) { matchedUser(username: $username) { username profile { aboutMe realName } submitStatsGlobal { acSubmissionNum { difficulty count } } userCalendar { submissionCalendar totalActiveDays streak } tagProblemCounts { advanced { tagName problemsSolved } intermediate { tagName problemsSolved } fundamental { tagName problemsSolved } } badges { id name shortName displayName icon creationDate category } } userContestRanking(username: $username) { rating globalRanking } userContestRankingHistory(username: $username) { attended rating ranking contest { title startTime } } }`,
      variables: { username: handle },
    }),
  });
  const user = payload.data?.matchedUser;
  if (!user || user.username?.toLowerCase() !== handle.toLowerCase()) throw new Error("Profile not found");
  const solvedStats = user.submitStatsGlobal?.acSubmissionNum ?? [];
  const solved = finiteCount(solvedStats.find((item) => item.difficulty === "All")?.count);
  const difficultyStats = Object.fromEntries(["Easy", "Medium", "Hard"].flatMap((difficulty) => {
    const count = finiteCount(solvedStats.find((item) => item.difficulty === difficulty)?.count);
    return count === undefined ? [] : [[difficulty.toLowerCase(), count]];
  }));
  const ranking = payload.data?.userContestRanking;
  const calendar = user.userCalendar ?? {};
  let calendarValues = {};
  try {
    const parsed = typeof calendar.submissionCalendar === "string" ? JSON.parse(calendar.submissionCalendar) : calendar.submissionCalendar;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) calendarValues = parsed;
  } catch { /* omit malformed provider calendar data */ }
  const activityByDay = Object.fromEntries(Object.entries(calendarValues).flatMap(([timestamp, count]) => {
    const epoch = Number(timestamp);
    const value = finiteCount(count);
    if (!Number.isFinite(epoch) || value === undefined) return [];
    return [[new Date(epoch * 1000).toISOString().slice(0, 10), value]];
  }));
  const topicDistribution = {};
  for (const group of Object.values(user.tagProblemCounts ?? {})) {
    if (!Array.isArray(group)) continue;
    for (const item of group) {
      const name = typeof item.tagName === "string" ? item.tagName : "";
      const count = finiteCount(item.problemsSolved);
      if (name && count !== undefined) topicDistribution[name] = (topicDistribution[name] ?? 0) + count;
    }
  }
  const contestHistory = (payload.data?.userContestRankingHistory ?? []).filter((item) => item?.attended && Number.isFinite(item.rating) && Number.isFinite(item.contest?.startTime)).map((item) => ({
    contestName: String(item.contest.title ?? "LeetCode contest").slice(0, 160),
    rating: Math.max(0, Math.round(item.rating)),
    rank: Math.max(0, Math.round(item.ranking ?? 0)),
    contestDate: Math.max(0, Math.round(item.contest.startTime)),
  })).filter((item) => item.rank > 0);
  const badges = (user.badges ?? []).flatMap((badge) => {
    const name = String(badge.displayName ?? badge.name ?? badge.shortName ?? "").trim();
    if (!name) return [];
    return [{ id: String(badge.id ?? badge.shortName ?? name).slice(0, 120), badgeName: name.slice(0, 120), icon: typeof badge.icon === "string" ? badge.icon.slice(0, 2048) : undefined, dateEarned: typeof badge.creationDate === "string" ? badge.creationDate : undefined, category: typeof badge.category === "string" ? badge.category.slice(0, 80) : undefined }];
  });
  const stats = {
    ...(solved === undefined ? {} : { totalQuestionsSolved: solved }),
    ...(Number.isFinite(ranking?.rating) ? { currentRating: Math.round(ranking.rating) } : {}),
    ...(Number.isFinite(ranking?.globalRanking) ? { rank: `#${ranking.globalRanking}` } : {}),
  };
  return {
    verificationText: `${user.profile?.aboutMe ?? ""} ${user.profile?.realName ?? ""}`,
    stats,
    profileStats: {
      ...stats,
      ...(Object.keys(difficultyStats).length ? { difficultyStats } : {}),
      activityByDay,
      totalActiveDays: finiteCount(calendar.totalActiveDays),
      currentStreak: finiteCount(calendar.streak),
      topicDistribution,
      contestHistory,
      badges,
    },
  };
}

async function geeksforgeeks(handle) {
  const url = new URL("https://authapi.geeksforgeeks.org/api-get/user-profile-info/");
  url.search = new URLSearchParams({ handle, article_count: "false", redirect: "false" }).toString();
  const payload = await readJson(url, {
    headers: { origin: "https://www.geeksforgeeks.org", referer: "https://www.geeksforgeeks.org/" },
  });
  const data = payload.data ?? payload;
  if (!data || payload.status === "failed") throw new Error("Profile not found");
  const solved = firstNumericKey(data, ["totalProblemsSolved", "total_problems_solved"]);
  const solvedStats = data.solvedStats ?? data.solved_stats;
  const difficultyStats = {};
  for (const key of ["school", "basic", "easy", "medium", "hard"]) {
    const count = finiteCount(solvedStats?.[key]);
    if (count !== undefined) difficultyStats[key] = count;
  }
  const codingScore = firstNumericKey(data, ["codingScore", "coding_score"]);
  const instituteRank = firstNumericKey(data, ["instituteRank", "institute_rank"]);
  const articlesPublished = firstNumericKey(data, ["articlesPublished", "articles_published", "articleCount"]);
  const stats = {
    ...(solved === undefined ? {} : { totalQuestionsSolved: solved }),
    ...(codingScore === undefined ? {} : { score: codingScore }),
    ...(instituteRank === undefined ? {} : { instituteRank }),
    ...(articlesPublished === undefined ? {} : { articlesPublished }),
  };
  let activityByDay = {};
  let solvedProblemsWithDates = 0;
  try {
    const submissions = await readJson("https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://www.geeksforgeeks.org", referer: "https://www.geeksforgeeks.org/" },
      body: JSON.stringify({ handle, requestType: "", year: "", month: "" }),
    });
    const result = submissions.result ?? submissions.data?.result ?? submissions.data;
    const rows = Array.isArray(result) ? result : [];
    for (const item of rows) {
      const rawTime = item.user_subtime ?? item.userSubtime ?? item.solvedAt;
      const numericTime = Number(rawTime);
      const timestamp = Number.isFinite(numericTime) && numericTime > 0
        ? (numericTime > 10_000_000_000 ? numericTime : numericTime * 1000)
        : typeof rawTime === "string" ? Date.parse(rawTime) : Number.NaN;
      if (!Number.isFinite(timestamp)) continue;
      const day = new Date(timestamp).toISOString().slice(0, 10);
      activityByDay[day] = (activityByDay[day] ?? 0) + 1;
      solvedProblemsWithDates += 1;
    }
  } catch {
    // The public profile summary remains useful even if GFG's practice API is unavailable.
  }
  return {
    verificationText: JSON.stringify(data),
    stats,
    profileStats: {
      ...stats,
      ...(Object.keys(difficultyStats).length ? { difficultyStats } : {}),
      activityByDay,
      ...(Object.keys(activityByDay).length ? { totalActiveDays: Object.keys(activityByDay).length } : {}),
      activityKind: "solved-problems-by-day",
      solvedProblemsWithDates,
    },
  };
}

async function atcoder(handle, { includeExtended = true } = {}) {
  const profileHtml = await readHtml(`https://atcoder.jp/users/${encodeURIComponent(handle)}`);
  const history = await readJson(`https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`);
  if (!Array.isArray(history)) throw new Error("AtCoder rating history is unavailable");
  const rated = history.filter((item) => Number.isFinite(item.NewRating));
  const latest = rated.at(-1)?.NewRating;
  const peak = rated.reduce((best, item) => Math.max(best, item.NewRating), 0);
  const stats = {
    ...(Number.isFinite(latest) ? { currentRating: Math.round(latest) } : {}),
    ...(peak > 0 ? { maxRating: Math.round(peak) } : {}),
  };
  const contestHistory = rated.map((item) => ({
    contestName: String(item.ContestName ?? "AtCoder rated contest").slice(0, 160),
    rating: Math.max(0, Math.round(item.NewRating)),
    rank: finiteCount(item.Place) ?? 0,
    contestDate: Math.floor(new Date(item.EndTime).getTime() / 1000),
  })).filter((item) => item.rank > 0 && Number.isFinite(item.contestDate));

  const [acceptedRank, streakRank, languageRanks] = includeExtended ? await Promise.all([
    readJson(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${encodeURIComponent(handle)}`).catch(() => null),
    readJson(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/streak_rank?user=${encodeURIComponent(handle)}`).catch(() => null),
    readJson(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/language_rank?user=${encodeURIComponent(handle)}`).catch(() => null),
  ]) : [null, null, null];
  const solved = finiteCount(acceptedRank?.count);
  if (solved !== undefined) stats.totalQuestionsSolved = solved;

  const activityByDay = {};
  let submissionsFetched = 0;
  let activityHistoryTruncated = false;
  const activityStart = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;
  let fromSecond = activityStart;
  const maxPages = includeExtended ? 12 : 0;
  for (let page = 0; page < maxPages; page += 1) {
    const submissions = await readJson(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${encodeURIComponent(handle)}&from_second=${fromSecond}`).catch(() => null);
    if (!Array.isArray(submissions)) break;
    submissionsFetched += submissions.length;
    for (const submission of submissions) {
      if (!Number.isFinite(submission.epoch_second)) continue;
      const date = new Date(submission.epoch_second * 1000).toISOString().slice(0, 10);
      activityByDay[date] = (activityByDay[date] ?? 0) + 1;
    }
    if (submissions.length < 500) break;
    const latestSecond = submissions.reduce((latest, item) => Math.max(latest, Number(item.epoch_second) || 0), fromSecond - 1);
    if (latestSecond < fromSecond) break;
    fromSecond = latestSecond + 1;
    if (page === maxPages - 1) activityHistoryTruncated = true;
  }
  const acceptedByLanguage = Array.isArray(languageRanks)
    ? languageRanks.flatMap((item) => {
      const language = typeof item.language === "string" ? item.language : "";
      const count = finiteCount(item.count);
      const rank = finiteCount(item.rank);
      return language && count !== undefined ? [{ language, accepted: count, ...(rank === undefined ? {} : { rank }) }] : [];
    })
    : [];
  const atcoderStats = {
    ...stats,
    ...(solved === undefined ? {} : { totalQuestionsSolved: solved }),
    ...(finiteCount(streakRank?.count) === undefined ? {} : { maxStreak: finiteCount(streakRank?.count) }),
    ratedContests: rated.length,
    contestHistory,
    ...(includeExtended ? {
      acceptedByLanguage,
      submissionsFetched,
      totalActiveDays: Object.keys(activityByDay).length,
      activityWindowDays: 365,
      activityHistoryTruncated,
      activityByDay,
    } : {}),
  };
  return { verificationText: `${profileHtml} ${htmlSummary(profileHtml)}`, stats, profileStats: atcoderStats };
}

async function github(handle) {
  const headers = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
  const user = await readJson(`https://api.github.com/users/${encodeURIComponent(handle)}`, { headers });
  let repos = [];
  try {
    const result = await readJson(`https://api.github.com/users/${encodeURIComponent(handle)}/repos?type=owner&sort=updated&per_page=100`, { headers });
    if (Array.isArray(result)) repos = result;
  } catch { /* ownership verification needs only the public user profile */ }
  let events = [];
  let eventsAvailable = false;
  const eventPages = process.env.GITHUB_TOKEN ? 3 : 1;
  for (let page = 1; page <= eventPages; page += 1) {
    try {
      const result = await readJson(`https://api.github.com/users/${encodeURIComponent(handle)}/events/public?per_page=100&page=${page}`, { headers });
      if (!Array.isArray(result)) break;
      eventsAvailable = true;
      events.push(...result);
      if (result.length < 100) break;
    } catch {
      break;
    }
  }
  const activityByDay = {};
  let publicPushes = 0;
  let publicPullRequests = 0;
  let publicIssues = 0;
  let publicCommits = 0;
  for (const event of events) {
    if (typeof event.created_at === "string") {
      const day = event.created_at.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}$/.test(day)) activityByDay[day] = (activityByDay[day] ?? 0) + 1;
    }
    if (event.type === "PushEvent") {
      publicPushes += 1;
      publicCommits += finiteCount(event.payload?.size) ?? (Array.isArray(event.payload?.commits) ? event.payload.commits.length : 0);
    } else if (event.type === "PullRequestEvent") publicPullRequests += 1;
    else if (event.type === "IssuesEvent") publicIssues += 1;
  }
  const languages = {};
  for (const repo of repos) {
    if (repo.fork) continue;
    if (typeof repo.language === "string") languages[repo.language] = (languages[repo.language] ?? 0) + 1;
  }
  const ownedRepos = repos.filter((repo) => !repo.fork).sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0));
  const topRepos = ownedRepos.slice(0, 8).map((repo) => ({
    name: String(repo.name ?? "").slice(0, 100),
    description: String(repo.description ?? "").slice(0, 300),
    language: String(repo.language ?? "Other").slice(0, 80),
    stars: finiteCount(repo.stargazers_count) ?? 0,
    forks: finiteCount(repo.forks_count) ?? 0,
    url: String(repo.html_url ?? ""),
  }));
  const stats = {
    publicRepos: finiteCount(user.public_repos) ?? 0,
    followers: finiteCount(user.followers) ?? 0,
    following: finiteCount(user.following) ?? 0,
    totalStars: ownedRepos.reduce((sum, repo) => sum + (finiteCount(repo.stargazers_count) ?? 0), 0),
    sampledRepositories: repos.length,
    recentPublicEvents: events.length,
    publicActivityAvailable: eventsAvailable,
    recentPublicPushes: publicPushes,
    recentPublicCommits: publicCommits,
    recentPublicPullRequests: publicPullRequests,
    recentPublicIssues: publicIssues,
    recentPublicActiveDays: Object.keys(activityByDay).length,
    publicActivityByDay: activityByDay,
    publicActivityWindowDays: 30,
    publicActivityEventLimit: eventPages * 100,
    languages,
    topRepos,
  };
  return { verificationText: `${user.name ?? ""} ${user.bio ?? ""}`, stats: {}, profileStats: stats };
}

const htmlProfiles = {
  codechef: (handle) => `https://www.codechef.com/users/${encodeURIComponent(handle)}`,
  codestudio: (handle) => `https://www.naukri.com/code360/profile/${encodeURIComponent(handle)}`,
  interviewbit: (handle) => `https://www.interviewbit.com/profile/${encodeURIComponent(handle)}/`,
  hackerrank: (handle) => `https://www.hackerrank.com/profile/${encodeURIComponent(handle)}`,
};

export async function fetchPlatformProfile(platform, handle, options = {}) {
  if (platform === "codeforces") return codeforces(handle);
  if (platform === "leetcode") return leetcode(handle);
  if (platform === "geeksforgeeks") return geeksforgeeks(handle);
  if (platform === "atcoder") return atcoder(handle, options);
  if (platform === "github") return github(handle);
  const profileUrl = htmlProfiles[platform];
  if (!profileUrl) throw new Error("Unsupported profile platform");
  const html = await readHtml(profileUrl(handle));
  if (/profile not found|user does not exist|page not found|404 - not found/i.test(htmlSummary(html))) {
    throw new Error("Profile not found");
  }
  return fromHtml(platform, html);
}
