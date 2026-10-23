import { fetchPlatformProfile } from "../lib/profile-platform-providers.mjs";

const DAY_MS = 24 * 60 * 60 * 1000;
const BATCH_SIZE = 1000;
const MAX_ACCOUNTS_PER_RUN = 500;
const CONCURRENCY = 1;

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    "content-type": "application/json",
    ...extra,
  };
}

async function supabase(path, init = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: supabaseHeaders(init.headers),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    const body = (await response.text()).slice(0, 500);
    throw new Error(`Supabase request failed (${response.status}): ${body}`);
  }
  return response;
}

async function loadDueAccounts() {
  const cutoff = new Date(Date.now() - DAY_MS).toISOString();
  const accounts = [];
  for (let offset = 0; ; offset += BATCH_SIZE) {
    const query = new URLSearchParams({
      select: "profile_id,platform,handle",
      or: `(sync_attempted_at.is.null,sync_attempted_at.lt.${cutoff})`,
      order: "profile_id.asc,platform.asc",
      limit: String(BATCH_SIZE),
      offset: String(offset),
    });
    const response = await supabase(`profile_platform_accounts?${query}`);
    const page = await response.json();
    if (!Array.isArray(page)) throw new Error("Supabase returned an invalid profile account list");
    accounts.push(...page);
    if (page.length < BATCH_SIZE || accounts.length >= MAX_ACCOUNTS_PER_RUN) break;
  }
  return accounts.slice(0, MAX_ACCOUNTS_PER_RUN);
}

async function saveAttempt(account, providerProfile, errorMessage) {
  const now = new Date().toISOString();
  const filter = new URLSearchParams({
    profile_id: `eq.${account.profile_id}`,
    platform: `eq.${account.platform}`,
  });
  await supabase(`profile_platform_accounts?${filter}`, {
    method: "PATCH",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify({
      ...(providerProfile?.stats?.totalQuestionsSolved === undefined ? {} : { total_questions_solved: providerProfile.stats.totalQuestionsSolved }),
      ...(providerProfile?.stats?.currentRating === undefined ? {} : { current_rating: providerProfile.stats.currentRating }),
      ...(providerProfile?.stats?.maxRating === undefined ? {} : { max_rating: providerProfile.stats.maxRating }),
      ...(providerProfile?.stats?.rank === undefined ? {} : { rank: String(providerProfile.stats.rank).slice(0, 100) }),
      ...(providerProfile?.profileStats && Object.keys(providerProfile.profileStats).length ? { profile_stats: providerProfile.profileStats } : {}),
      sync_attempted_at: now,
      ...(providerProfile ? { last_synced_at: now, sync_error: null } : { sync_error: errorMessage.slice(0, 200) }),
      updated_at: now,
    }),
  });
}

async function syncAccount(account) {
  try {
    if (!/^[A-Za-z0-9_.-]{1,100}$/.test(account.handle)) throw new Error("Stored platform handle is invalid");
    const providerProfile = await fetchPlatformProfile(account.platform, account.handle, { includeExtended: true });
    await saveAttempt(account, providerProfile, "");
    console.info(`Profile stats refreshed (${account.platform})`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Profile provider unavailable";
    try {
      await saveAttempt(account, null, message);
    } catch (saveError) {
      console.error(`Could not persist sync status (${account.platform})`, saveError);
    }
    console.warn(`Profile stats refresh failed (${account.platform}): ${message}`);
    return false;
  }
}

const accounts = await loadDueAccounts();
let succeeded = 0;
let failed = 0;
for (let index = 0; index < accounts.length; index += CONCURRENCY) {
  const group = accounts.slice(index, index + CONCURRENCY);
  const results = await Promise.all(group.map(syncAccount));
  succeeded += results.filter(Boolean).length;
  failed += results.filter((result) => !result).length;
}

console.info(`Profile stats sync complete: ${succeeded} refreshed, ${failed} failed, ${accounts.length} attempted`);
if (accounts.length === MAX_ACCOUNTS_PER_RUN) {
  console.warn("Profile stats sync reached its per-run limit; remaining accounts will be picked up by a later run.");
}
if (failed > 0) process.exitCode = 1;

