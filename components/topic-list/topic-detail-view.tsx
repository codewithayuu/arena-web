"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  EnrichedTopic,
  Problem,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";
import {
  getTopicResources,
  getTopicTemplates,
  getProblemExtraData,
  TopicResource,
  TopicTemplate,
} from "@/lib/topic-resources-data";
import { getPlatformInfo, PlatformIcon } from "./platform-icons";
import { emitAuraSync } from "@/lib/aura-system";
import { saveLearningProgress } from "@/lib/learning-progress-client";
import { loadTopicListState, recordTopicActivity, setTopicFavorite, type TopicListState } from "@/lib/topic-list-client";
import { memberStorageKey } from "@/lib/member-storage";
import Badge, { StatusDot } from "@/components/smoothui/badge";
import { TooltipProvider, SimpleTooltip } from "@/components/animate-ui/tooltip";
import { TopicCommentSection } from "./topic-comment-section";
import {
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Heart,
  HelpCircle,
  Info,
  MessageSquare,
  RotateCcw,
  Star,
  Tag,
  Video,
} from "lucide-react";

interface TopicDetailViewProps {
  topic: EnrichedTopic;
  initialProblems: Problem[];
}

export function TopicDetailView({ topic, initialProblems }: TopicDetailViewProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id ?? null;
  const localKey = useCallback((key: string) => memberStorageKey(key, userId), [userId]);
  // Solved problems storage
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  
  // Interactive Topic State Toggles
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFavourite, setIsFavourite] = useState<boolean>(false);
  const [communityCounts, setCommunityCounts] = useState({ practicing_count: 0, completed_count: 0, favourite_count: 0 });
  const [communityCountsLoaded, setCommunityCountsLoaded] = useState(false);
  const [communityOffsets, setCommunityOffsets] = useState({ practicing: 0, completed: 0, favorite: 0 });
  
  // Problem interactive favourites and tags expansion
  const [favouritedProblemIds, setFavouritedProblemIds] = useState<string[]>([]);
  const [problemStats, setProblemStats] = useState<Record<string, { solveCount: number; favoriteCount: number }>>({});
  const [problemStatsLoaded, setProblemStatsLoaded] = useState(false);
  const [problemSolveOffsets, setProblemSolveOffsets] = useState<Record<string, number>>({});
  const [problemFavoriteOffsets, setProblemFavoriteOffsets] = useState<Record<string, number>>({});
  const [expandedTagProblemIds, setExpandedTagProblemIds] = useState<string[]>([]);

  // Toolbar filters
  const [hideSolved, setHideSolved] = useState<boolean>(false);
  const [starredOnly, setStarredOnly] = useState<boolean>(false);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"order" | "solves" | "difficulty" | "fav" | "title">("order");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Suggest modal / toast message
  const [suggestionToast, setSuggestionToast] = useState<string | null>(null);
  const [accountStateConflict, setAccountStateConflict] = useState<TopicListState | null>(null);

  const refreshCommunityCounts = useCallback(async () => {
    try {
      const response = await fetch(`/api/topic-list/community?topicId=${encodeURIComponent(topic.topic_id)}`, { cache: "no-store" });
      if (!response.ok) return false;
      const data = await response.json() as { practicing_count: number; completed_count: number; favourite_count: number };
      setCommunityCounts(data);
      setCommunityOffsets({ practicing: 0, completed: 0, favorite: 0 });
      setCommunityCountsLoaded(true);
      return true;
    } catch {
      return false;
    }
  }, [topic.topic_id]);

  const refreshProblemStats = useCallback(async () => {
    const problemIds = initialProblems.map((problem) => problem.problem_id);
    if (problemIds.length === 0) {
      setProblemStats({});
      setProblemStatsLoaded(true);
      return true;
    }
    try {
      const batches: Record<string, { solveCount: number; favoriteCount: number }>[] = [];
      for (let index = 0; index < problemIds.length; index += 500) {
        const response = await fetch("/api/topic-list/community/problems", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ problemIds: problemIds.slice(index, index + 500) }),
          cache: "no-store",
        });
        if (!response.ok) return false;
        const data = await response.json() as { stats?: Record<string, { solveCount: number; favoriteCount: number }> };
        if (!data.stats) return false;
        batches.push(data.stats);
      }
      setProblemStats(Object.assign({}, ...batches));
      setProblemSolveOffsets({});
      setProblemFavoriteOffsets({});
      setProblemStatsLoaded(true);
      return true;
    } catch {
      return false;
    }
  }, [initialProblems]);

  // Load persistent user preferences
  useEffect(() => {
    if (!isLoaded) return;
    setSolvedProblemIds([]);
    setFavouritedProblemIds([]);
    setIsPracticing(false);
    setIsCompleted(false);
    setIsFavourite(false);
    setCommunityCountsLoaded(false);
    setProblemStatsLoaded(false);
    setCommunityOffsets({ practicing: 0, completed: 0, favorite: 0 });
    setProblemSolveOffsets({});
    setProblemFavoriteOffsets({});
    setAccountStateConflict(null);
    try {
      const savedSolved = localStorage.getItem(localKey("youknowwho_solved_problems"));
      if (savedSolved) setSolvedProblemIds(JSON.parse(savedSolved));

      const savedFavs = localStorage.getItem(localKey("youknowwho_fav_problems"));
      if (savedFavs) setFavouritedProblemIds(JSON.parse(savedFavs));

      const practicingKey = `youknowwho_practicing_${topic.topic_id}`;
      if (localStorage.getItem(localKey(practicingKey)) === "true") setIsPracticing(true);

      const completedKey = `youknowwho_completed_${topic.topic_id}`;
      if (localStorage.getItem(localKey(completedKey)) === "true") setIsCompleted(true);

      const favKey = `youknowwho_fav_${topic.topic_id}`;
      if (localStorage.getItem(localKey(favKey)) === "true") {
        setIsFavourite(true);
      }
    } catch {
      // ignore
    }
    let cancelled = false;
    void loadTopicListState().then((accountState) => {
      if (!accountState || cancelled) return;
      const progress = Object.fromEntries(accountState.progress.map((item) => [item.item_key, item.status]));
      const topicStatus = progress[`topic:${topic.topic_id}`];
      const solved = Object.entries(progress)
        .filter(([key, status]) => key.startsWith("problem:") && status === "completed")
        .map(([key]) => key.slice("problem:".length));
      let differs = false;
      try {
        const localTopicCompleted = localStorage.getItem(localKey(`youknowwho_completed_${topic.topic_id}`));
        const localTopicPracticing = localStorage.getItem(localKey(`youknowwho_practicing_${topic.topic_id}`));
        if (localTopicCompleted !== null || localTopicPracticing !== null) {
          const localStatus = localTopicCompleted === "true" ? "completed" : localTopicPracticing === "true" ? "started" : "not_started";
          differs ||= localStatus !== (topicStatus ?? "not_started");
        }
        const localSolvedRaw = localStorage.getItem(localKey("youknowwho_solved_problems"));
        if (localSolvedRaw !== null) {
          const localSolved = new Set(JSON.parse(localSolvedRaw) as string[]);
          const cloudSolved = new Set(solved);
          differs ||= localSolved.size !== cloudSolved.size || [...localSolved].some((id) => !cloudSolved.has(id));
        }
        const localTopicFavorite = localStorage.getItem(localKey(`youknowwho_fav_${topic.topic_id}`));
        if (localTopicFavorite !== null) differs ||= (localTopicFavorite === "true") !== accountState.favorites.some((item) => item.item_type === "topic" && item.item_key === topic.topic_id);
        const localProblemFavoritesRaw = localStorage.getItem(localKey("youknowwho_fav_problems"));
        if (localProblemFavoritesRaw !== null) {
          const localFavorites = new Set(JSON.parse(localProblemFavoritesRaw) as string[]);
          const cloudFavorites = new Set(accountState.favorites.filter((item) => item.item_type === "problem").map((item) => item.item_key));
          differs ||= localFavorites.size !== cloudFavorites.size || [...localFavorites].some((id) => !cloudFavorites.has(id));
        }
      } catch { /* malformed local state is ignored */ }
      if (differs) {
        setAccountStateConflict(accountState);
        return;
      }
      applyAccountState(accountState, false);
    });
    return () => { cancelled = true; };
    // applyAccountState uses the same topic/member identity captured here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, localKey, topic.topic_id, userId]);

  const applyAccountState = (accountState: TopicListState, mergeBrowser: boolean) => {
    const progress = Object.fromEntries(accountState.progress.map((item) => [item.item_key, item.status]));
    let topicStatus = progress[`topic:${topic.topic_id}`] ?? "not_started";
    let solved = Object.entries(progress).filter(([key, status]) => key.startsWith("problem:") && status === "completed").map(([key]) => key.slice(8));
    let topicFavorite = accountState.favorites.some((item) => item.item_type === "topic" && item.item_key === topic.topic_id);
    let problemFavorites = accountState.favorites.filter((item) => item.item_type === "problem").map((item) => item.item_key);
    if (mergeBrowser) {
      try {
        if (localStorage.getItem(localKey(`youknowwho_completed_${topic.topic_id}`)) === "true") topicStatus = "completed";
        else if (localStorage.getItem(localKey(`youknowwho_practicing_${topic.topic_id}`)) === "true" && topicStatus !== "completed") topicStatus = "started";
        solved = [...new Set([...solved, ...(JSON.parse(localStorage.getItem(localKey("youknowwho_solved_problems")) ?? "[]") as string[])])];
        topicFavorite ||= localStorage.getItem(localKey(`youknowwho_fav_${topic.topic_id}`)) === "true";
        problemFavorites = [...new Set([...problemFavorites, ...(JSON.parse(localStorage.getItem(localKey("youknowwho_fav_problems")) ?? "[]") as string[])])];
      } catch { /* keep cloud state when browser data is malformed */ }
      void saveLearningProgress([
        { key: `topic:${topic.topic_id}`, status: topicStatus as "started" | "completed" | "not_started" },
        ...solved.map((id) => ({ key: `problem:${id}`, status: "completed" as const })),
      ], userId);
      if (topicFavorite) void setTopicFavorite("topic", topic.topic_id, true, userId);
      for (const id of problemFavorites) void setTopicFavorite("problem", id, true, userId);
    }
    setIsCompleted(topicStatus === "completed");
    setIsPracticing(topicStatus === "started");
    setIsFavourite(topicFavorite);
    setSolvedProblemIds(solved);
    setFavouritedProblemIds(problemFavorites);
    try {
      localStorage.setItem(localKey(`youknowwho_completed_${topic.topic_id}`), String(topicStatus === "completed"));
      localStorage.setItem(localKey(`youknowwho_practicing_${topic.topic_id}`), String(topicStatus === "started"));
      localStorage.setItem(localKey(`youknowwho_fav_${topic.topic_id}`), String(topicFavorite));
      localStorage.setItem(localKey("youknowwho_solved_problems"), JSON.stringify(solved));
      localStorage.setItem(localKey("youknowwho_fav_problems"), JSON.stringify(problemFavorites));
      emitAuraSync();
    } catch { /* account data remains available from the API */ }
    setAccountStateConflict(null);
  };

  useEffect(() => {
    void refreshProblemStats();
  }, [refreshProblemStats]);

  useEffect(() => {
    void refreshCommunityCounts();
  }, [refreshCommunityCounts]);

  // Topic-level toggles
  const togglePractice = () => {
    const next = !isPracticing;
    setIsPracticing(next);
    if (isSignedIn) setCommunityOffsets((counts) => ({ ...counts, practicing: counts.practicing + (next ? 1 : -1) }));
    void saveLearningProgress([{ key: `topic:${topic.topic_id}`, status: next ? "started" : "not_started" }], userId)
      .then((saved) => { if (saved) void refreshCommunityCounts(); });
    try {
      localStorage.setItem(localKey(`youknowwho_practicing_${topic.topic_id}`), String(next));
    } catch {}
  };

  const toggleCompleted = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    if (isSignedIn) setCommunityOffsets((counts) => ({
      ...counts,
      completed: counts.completed + (next ? 1 : -1),
      practicing: counts.practicing + (next && isPracticing ? -1 : 0),
    }));
    void saveLearningProgress([{ key: `topic:${topic.topic_id}`, status: next ? "completed" : "not_started" }], userId)
      .then((saved) => { if (saved) void refreshCommunityCounts(); });
    void recordTopicActivity("topic_completed", topic.topic_id, next, userId);
    if (next) setIsPracticing(false);
    try {
      localStorage.setItem(localKey(`youknowwho_completed_${topic.topic_id}`), String(next));
      if (next) {
        setSuggestionToast("🎉 Topic marked as completed! Aura boosted.");
        setTimeout(() => setSuggestionToast(null), 3000);
      }
      emitAuraSync();
    } catch {}
  };

  const toggleFavouriteTopic = () => {
    const next = !isFavourite;
    setIsFavourite(next);
    if (isSignedIn) setCommunityOffsets((counts) => ({ ...counts, favorite: counts.favorite + (next ? 1 : -1) }));
    void setTopicFavorite("topic", topic.topic_id, next, userId)
      .then((saved) => { if (saved) void refreshCommunityCounts(); });
    try {
      localStorage.setItem(localKey(`youknowwho_fav_${topic.topic_id}`), String(next));
    } catch {}
  };

  // Problem solve toggle
  const toggleProblemSolved = (id: string) => {
    setSolvedProblemIds((prev) => {
      const isAdding = !prev.includes(id);
      const next = isAdding ? [...prev, id] : prev.filter((p) => p !== id);
      if (isSignedIn) setProblemSolveOffsets((offsets) => ({ ...offsets, [id]: (offsets[id] ?? 0) + (isAdding ? 1 : -1) }));
      void saveLearningProgress([{ key: `problem:${id}`, status: isAdding ? "completed" : "not_started" }], userId)
        .then((saved) => { if (saved) void refreshProblemStats(); });
      void recordTopicActivity("problem_solved", id, isAdding, userId);
      try {
        localStorage.setItem(localKey("youknowwho_solved_problems"), JSON.stringify(next));

        const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "/");
        const probRaw = localStorage.getItem(localKey("mindflare_problem_activity"));
        const probMap: Record<string, any> = probRaw ? JSON.parse(probRaw) : {};
        const existing = probMap[todayStr];
        const prevCount = typeof existing === "number" ? existing : existing?.count || 0;
        const prevProblems: string[] = Array.isArray(existing?.problems) ? existing.problems : [];
        if (isAdding) {
          probMap[todayStr] = {
            count: prevCount + 1,
            problems: prevProblems.includes(id) ? prevProblems : [...prevProblems, id],
          };
        } else {
          probMap[todayStr] = {
            count: Math.max(0, prevCount - 1),
            problems: prevProblems.filter((p) => p !== id),
          };
        }
        localStorage.setItem(localKey("mindflare_problem_activity"), JSON.stringify(probMap));
        emitAuraSync();
      } catch {}
      return next;
    });
  };

  // Problem favourite toggle
  const toggleProblemFav = (id: string) => {
    setFavouritedProblemIds((prev) => {
      const isAdding = !prev.includes(id);
      const next = isAdding ? [...prev, id] : prev.filter((p) => p !== id);
      if (isSignedIn) setProblemFavoriteOffsets((offsets) => ({ ...offsets, [id]: (offsets[id] ?? 0) + (isAdding ? 1 : -1) }));
      void setTopicFavorite("problem", id, isAdding, userId)
        .then((saved) => { if (saved) void refreshProblemStats(); });
      try {
        localStorage.setItem(localKey("youknowwho_fav_problems"), JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Toggle expanded tags
  const toggleTags = (id: string) => {
    setExpandedTagProblemIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Reset solved in this topic
  const handleResetSolved = () => {
    const currentTopicProblemIds = initialProblems.map((p) => p.problem_id);
    setSolvedProblemIds((prev) => {
      const next = prev.filter((id) => !currentTopicProblemIds.includes(id));
      if (isSignedIn) setProblemSolveOffsets((offsets) => {
        const updated = { ...offsets };
        for (const id of prev.filter((solvedId) => currentTopicProblemIds.includes(solvedId))) {
          updated[id] = (updated[id] ?? 0) - 1;
        }
        return updated;
      });
      void saveLearningProgress(currentTopicProblemIds.map((id) => ({ key: `problem:${id}`, status: "not_started" as const })), userId)
        .then((saved) => { if (saved) void refreshProblemStats(); });
      for (const id of currentTopicProblemIds) void recordTopicActivity("problem_solved", id, false, userId);
      try {
        localStorage.setItem(localKey("youknowwho_solved_problems"), JSON.stringify(next));
        emitAuraSync();
      } catch {}
      return next;
    });
  };

  // Sorting handlers
  const handleSort = (field: "order" | "solves" | "difficulty" | "fav" | "title") => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSortField(field);
      setSortDirection(field === "solves" ? "desc" : "asc");
    }
  };

  // Authentic Data lookups
  const resources: TopicResource[] = useMemo(
    () => getTopicResources(topic.topic_id, topic.topic_title),
    [topic.topic_id, topic.topic_title]
  );
  const templates: TopicTemplate[] = useMemo(
    () => getTopicTemplates(topic.topic_id),
    [topic.topic_id]
  );
  const communityStats = communityCounts;

  // Difficulty & Importance
  const diffTitle = getTopicDifficultyTitle(topic.difficulty).toUpperCase();

  // Filtered & Sorted Problems List
  const filteredProblems = useMemo(() => {
    const list = initialProblems.filter((p) => {
      const isSolved = solvedProblemIds.includes(p.problem_id);
      if (hideSolved && isSolved) return false;
      if (starredOnly && !p.is_starred) return false;
      if (sourceFilter !== "all") {
        const platform = getPlatformInfo(p.problem_url);
        if (platform.type !== sourceFilter) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.problem_title.toLowerCase().includes(q) ||
          p.problem_id.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      const extraA = getProblemExtraData(a.problem_id, a.difficulty);
      const extraB = getProblemExtraData(b.problem_id, b.difficulty);

      if (sortField === "solves") {
        const aCount = (problemStats[a.problem_id]?.solveCount ?? 0) + (problemSolveOffsets[a.problem_id] ?? 0);
        const bCount = (problemStats[b.problem_id]?.solveCount ?? 0) + (problemSolveOffsets[b.problem_id] ?? 0);
        return sortDirection === "asc" ? aCount - bCount : bCount - aCount;
      }
      if (sortField === "difficulty") {
        const aDiff = a.difficulty ?? 0;
        const bDiff = b.difficulty ?? 0;
        return sortDirection === "asc" ? aDiff - bDiff : bDiff - aDiff;
      }
      if (sortField === "fav") {
        const aFav = (problemStats[a.problem_id]?.favoriteCount ?? 0) + (problemFavoriteOffsets[a.problem_id] ?? 0);
        const bFav = (problemStats[b.problem_id]?.favoriteCount ?? 0) + (problemFavoriteOffsets[b.problem_id] ?? 0);
        return sortDirection === "asc" ? aFav - bFav : bFav - aFav;
      }
      if (sortField === "title") {
        return sortDirection === "asc"
          ? a.problem_title.localeCompare(b.problem_title)
          : b.problem_title.localeCompare(a.problem_title);
      }
      // default: original order
      return 0;
    });
  }, [
    initialProblems,
    hideSolved,
    starredOnly,
    sourceFilter,
    searchQuery,
    sortField,
    sortDirection,
    solvedProblemIds,
    problemStats,
    problemSolveOffsets,
    problemFavoriteOffsets,
  ]);

  // Statistics
  const totalCount = initialProblems.length;
  const solvedCount = initialProblems.filter((p) =>
    solvedProblemIds.includes(p.problem_id)
  ).length;
  const remainingCount = Math.max(0, totalCount - solvedCount);
  const progressPercent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  // Star counts for importance (1 to 3)
  const importanceStars = Math.max(1, Math.min(3, topic.importance || 1));

  return (
    <TooltipProvider delayDuration={300} disableHoverableContent>
      {accountStateConflict && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="detail-progress-conflict-title">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-5 shadow-2xl">
            <h2 id="detail-progress-conflict-title" className="text-lg font-semibold text-white">Choose which progress to keep</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">This browser has progress for this topic that differs from your account. Merge the browser progress into your account, or load the account progress only?</p>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => applyAccountState(accountStateConflict, false)} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">Use account progress</button>
              <button type="button" onClick={() => applyAccountState(accountStateConflict, true)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500">Merge browser progress</button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-full bg-transparent text-foreground selection:bg-[#FF1018]/30 selection:text-white pb-16 font-sans">
        <div className="mx-auto max-w-[1080px] px-3 sm:px-6 py-6">
          
          {/* Top Return Button */}
          <div className="mb-6">
            <Link
              href="/topic-list"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-[#F4F3FC] transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white/80" />
              <span>Go to Topic List</span>
            </Link>
          </div>

          {/* Centered Topic Hero Header */}
          <div className="text-center mb-6">
            {/* Technical Coding Interviews Applicability Pill */}
            {topic.is_interview_topic && (
              <div className="inline-block mb-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#0E7490]/15 text-[#38BDF8] border border-[#0E7490]/35 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span>This topic might be useful in Technical Coding Interviews</span>
                </div>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F3FC] mb-2.5 text-center">
              {topic.topic_title}
            </h1>


            {/* Topic Attributes Row: Difficulty, Importance, Tour, Theme */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-300 flex-wrap">
              {/* Difficulty */}
              <div className="inline-flex items-center gap-1.5">
                <SimpleTooltip content="Estimated difficulty of this topic">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
                </SimpleTooltip>
                <span className="text-zinc-400">Difficulty:</span>
                <Badge
                  variant="outline"
                  size="sm"
                  className="font-bold uppercase tracking-wider border-white/20 bg-black text-white"
                >
                  {diffTitle}
                </Badge>
              </div>

              {/* Importance */}
              <div className="inline-flex items-center gap-1.5">
                <SimpleTooltip content="How crucial this topic is for competitive programming">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" />
                </SimpleTooltip>
                <span className="text-zinc-400">Importance:</span>
                <div className="inline-flex items-center gap-0.5 text-[#ECC94B]">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < importanceStars ? "fill-[#ECC94B] text-[#ECC94B]" : "text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Take a Tour Link */}
              <button
                type="button"
                onClick={() => {
                  setSuggestionToast("Tip: Starred problems are essential must-solves!");
                  setTimeout(() => setSuggestionToast(null), 3000);
                }}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Take a Tour</span>
              </button>
            </div>
          </div>

          {/* Interactive User State & Community Proof Card */}
          <div className="max-w-[620px] mx-auto rounded-2xl border border-white/10 bg-black p-4 sm:p-5 shadow-xl mb-6 text-center">
            {/* Interactive User Actions */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 flex-wrap mb-3.5">
              {/* Start Practice Checkbox */}
              <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPracticing}
                  onChange={togglePractice}
                  className="w-4 h-4 rounded border-white/25 bg-zinc-900/60 text-sky-400 focus:ring-0 cursor-pointer accent-sky-500"
                />
                <span>Start Practice</span>
              </label>

              {/* Mark as Completed Checkbox */}
              <label className="inline-flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={toggleCompleted}
                  className="w-4 h-4 rounded border-white/25 bg-zinc-900/60 text-emerald-400 focus:ring-0 cursor-pointer accent-emerald-500"
                />
                <span>Mark as Completed</span>
              </label>

              {/* Add Favourite Button */}
              <button
                type="button"
                onClick={toggleFavouriteTopic}
                className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                  isFavourite ? "text-rose-400" : "text-zinc-300 hover:text-white"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavourite ? "fill-rose-500 text-rose-500" : "text-zinc-400"}`}
                />
                <span>{isFavourite ? "Favourited" : "Add Favourite"}</span>
              </button>
            </div>

            {/* Community Social Proof Badges */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs">
              {/* Currently Practicing */}
              <Badge
                variant="outline"
                size="md"
                className="gap-1.5 px-3 py-1 border-white/15 bg-black text-zinc-300 font-medium"
              >
                <StatusDot status="online" pulse size="sm" />
                <span>Currently Practicing: <strong className="text-white font-semibold">{communityCountsLoaded ? `${Math.max(0, communityStats.practicing_count + communityOffsets.practicing)} users` : "—"}</strong></span>
              </Badge>

              {/* Completed by */}
              <Badge
                variant="outline"
                size="md"
                className="gap-1.5 px-3 py-1 border-white/15 bg-black text-zinc-300 font-medium"
              >
                <StatusDot status="away" size="sm" />
                <span>Completed by: <strong className="text-white font-semibold">{communityCountsLoaded ? `${Math.max(0, communityStats.completed_count + communityOffsets.completed)} users` : "—"}</strong></span>
              </Badge>

              {/* Favourited by */}
              <Badge
                variant="outline"
                size="md"
                className="gap-1.5 px-3 py-1 border-white/15 bg-black text-zinc-300 font-medium"
              >
                <StatusDot status="busy" size="sm" />
                <span>Favourited by: <strong className="text-white font-semibold">{communityCountsLoaded ? `${Math.max(0, communityStats.favourite_count + communityOffsets.favorite)} users` : "—"}</strong></span>
              </Badge>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {suggestionToast && (
            <div className="max-w-[620px] mx-auto mb-5 p-3 rounded-lg border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 text-xs text-center flex items-center justify-center gap-2 shadow-lg animate-in fade-in duration-200">
              <span>{suggestionToast}</span>
            </div>
          )}

          {/* Guest Sign-in Alert Banner */}
          {!isSignedIn && <div className="rounded-2xl border border-white/10 bg-black p-3.5 sm:p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-base">👀</span>
              <span>You are not signed in. Please sign in to save your progress across devices.</span>
            </div>
            <Link
              href="/login"
              className="px-3.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors self-start sm:self-auto shrink-0 border border-white/10"
            >
              Sign in
            </Link>
          </div>}

          {/* ========================================================================= */}
          {/* SECTION 1: RESOURCES                                                      */}
          {/* ========================================================================= */}
          <section className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-base text-zinc-400">≡</span>
                <span>Resources</span>
              </h2>

            </div>

            <p className="text-xs text-zinc-400 mb-4">
              The resources are given in the recommended order of learning. Please at least go through the starred resources.
            </p>

            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="border-b border-white/10 bg-black text-zinc-400 uppercase text-[11px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">TAG</th>
                    <th className="py-2.5 px-4">TITLE</th>
                    <th className="py-2.5 px-4 text-right w-44">SOURCE/CREDIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] bg-black">
                  {resources.map((res) => (
                    <tr key={res.id} className="hover:bg-white/[0.03] transition-colors group">
                      {/* Tag Icon */}
                      <td className="py-3 px-3 text-center align-middle">
                        <Tag className="w-3.5 h-3.5 text-zinc-500 mx-auto" />
                      </td>

                      {/* Title & Star */}
                      <td className="py-3 px-4 align-middle">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          <span>{res.title}</span>
                          {res.type === "video" ? (
                            <Video className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          )}
                          {res.is_starred && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                          )}
                        </a>
                      </td>

                      {/* Source/Credit */}
                      <td className="py-3 px-4 text-right align-middle text-zinc-400 italic">
                        {res.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: TEMPLATES                                                      */}
          {/* ========================================================================= */}
          <section className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 mb-6 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-base text-zinc-400">&lt;/&gt;</span>
                <span>Templates</span>
              </h2>

            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Some example codes for this topic. These can be used as a reference to solve problems. It is strongly recommended to write your own templates.
            </p>

            {/* Templates Content or Empty State */}
            {templates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-black p-6 text-center text-xs text-zinc-500">
                No template codes available
              </div>
            ) : (
              <div className="space-y-3">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="rounded-lg border border-white/10 bg-black/50 p-4">
                    <h3 className="text-xs font-bold text-white mb-2">{tmpl.title}</h3>
                    {tmpl.code && (
                      <pre className="p-3 rounded bg-[#0a0a0c] border border-white/10 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                        <code>{tmpl.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: PROBLEMS                                                       */}
          {/* ========================================================================= */}
          <section className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 mb-6 shadow-xl">
            {/* Problems heading */}
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-base text-zinc-400">⬡</span>
                <span>Problems</span>
              </h2>

            </div>

            <p className="text-xs text-zinc-400 mb-4">
              The problems are given in the recommended order of solving. Please at least solve the starred problems.
            </p>

            {/* Toolbar Filters: Hide Solved, Starred Only, Solve Count Sort, All Sources, Connect Codeforces */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-5 pt-1">
              {/* Left Checkboxes */}
              <div className="flex items-center gap-4 text-xs">
                <label className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hideSolved}
                    onChange={(e) => setHideSolved(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/30 bg-black/60 text-[#3182ce] focus:ring-0 cursor-pointer accent-[#3182ce]"
                  />
                  <span>Hide Solved</span>
                </label>

                <label className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={starredOnly}
                    onChange={(e) => setStarredOnly(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-white/30 bg-black/60 text-amber-400 focus:ring-0 cursor-pointer accent-amber-400"
                  />
                  <span>Starred Only</span>
                </label>
              </div>

              {/* Right Action Buttons: Solve Count Sort, Sources, Connect Codeforces */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Solve Count Sort Button (WITHOUT 123 logo!) */}
                <button
                  type="button"
                  onClick={() => handleSort("solves")}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                    sortField === "solves"
                      ? "border-blue-500/50 bg-blue-500/15 text-blue-300"
                      : "border-white/10 bg-black text-[#F4F3FC] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Solve Count</span>
                  {sortField === "solves" && (
                    <span className="text-[10px]">{sortDirection === "desc" ? "↓" : "↑"}</span>
                  )}
                </button>

                {/* Sources Filter Dropdown */}
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="h-8 px-3 rounded-xl border border-white/10 bg-black text-xs text-[#F4F3FC] hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-pointer appearance-none pr-7 focus:outline-none"
                  >
                    <option value="all">🔍 All Sources</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="cses">CSES</option>
                    <option value="atcoder">AtCoder</option>
                    <option value="vjudge">VJudge</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Connect Codeforces Button */}
                <Link
                  href="/settings?tab=handles"
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl border border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-xs text-[#F4F3FC] transition-colors"
                >
                  <span>📊 Connect Codeforces</span>
                </Link>
              </div>
            </div>

            {/* 3-Box Statistics Banner: Solved, Remaining, Progress % */}
            <div className="rounded-xl border border-white/10 bg-black p-4 mb-5 grid grid-cols-3 divide-x divide-white/10 text-center">
              {/* Solved */}
              <div className="px-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#48bb78] tabular-nums">
                  {solvedCount}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">Solved</div>
              </div>

              {/* Remaining */}
              <div className="px-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#63b3ed] tabular-nums">
                  {remainingCount}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">Remaining</div>
              </div>

              {/* Progress */}
              <div className="px-3">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#b794f4] tabular-nums">
                  {progressPercent}%
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 font-medium">Progress</div>
              </div>
            </div>

            {/* Problems Data Table */}
            {filteredProblems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 bg-black p-8 text-center text-xs text-zinc-500">
                No problems match the current filters.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-black">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="border-b border-white/10 bg-black text-zinc-400 uppercase text-[11px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-2.5 px-2.5 w-10 text-center shrink-0">TAG</th>
                      <th className="py-2.5 px-2 w-10 text-center shrink-0">#</th>
                      <th className="py-2.5 px-3 w-14 text-center shrink-0">FAV</th>
                      <th className="py-2.5 px-4 min-w-[220px]">
                        <button
                          type="button"
                          onClick={() => handleSort("title")}
                          className="inline-flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                        >
                          <span>PROBLEM</span>
                          {sortField === "title" && (
                            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                          )}
                        </button>
                      </th>
                      <th className="py-2.5 px-3 w-24 text-center shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSort("difficulty")}
                          className="inline-flex items-center gap-1 mx-auto hover:text-white transition-colors cursor-pointer"
                        >
                          <span>Difficulty</span>
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </button>
                      </th>
                      <th className="py-2.5 px-3 w-24 text-right shrink-0">
                        {/* NO 123 logo! Simple text button */}
                        <button
                          type="button"
                          onClick={() => handleSort("solves")}
                          className="inline-flex items-center gap-1 ml-auto hover:text-white transition-colors cursor-pointer"
                        >
                          <span>SOLVE COUNT</span>
                          {sortField === "solves" && (
                            <span>{sortDirection === "desc" ? "↓" : "↑"}</span>
                          )}
                        </button>
                      </th>
                      <th className="py-2.5 px-3 w-20 text-center shrink-0">EDITORIAL</th>
                      <th className="py-2.5 px-3 w-24 text-center shrink-0">TAGS</th>
                      <th className="py-2.5 px-3 w-20 text-center shrink-0">SOURCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] bg-black">
                    {filteredProblems.map((problem, idx) => {
                      const isSolved = solvedProblemIds.includes(problem.problem_id);
                      const isProblemFav = favouritedProblemIds.includes(problem.problem_id);
                      const extra = getProblemExtraData(problem.problem_id, problem.difficulty);
                      const problemStat = problemStats[problem.problem_id];
                      const problemFavoriteCount = problemStatsLoaded
                        ? Math.max(0, (problemStat?.favoriteCount ?? 0) + (problemFavoriteOffsets[problem.problem_id] ?? 0))
                        : null;
                      const problemSolveCount = problemStatsLoaded
                        ? Math.max(0, (problemStat?.solveCount ?? 0) + (problemSolveOffsets[problem.problem_id] ?? 0))
                        : null;
                      const platform = getPlatformInfo(problem.problem_url);
                      const isTagsOpen = expandedTagProblemIds.includes(problem.problem_id);

                      // Authentic problem numbering (e.g. "1. Welcome for you with Conditions")
                      const problemNumber = idx + 1;
                      const rawTitle = problem.problem_title.replace(/^\d+[\.\s]+/, "");
                      const displayTitle = `${problemNumber}. ${rawTitle}`;

                      return (
                        <React.Fragment key={problem.problem_id}>
                          <tr
                            className={`hover:bg-white/[0.035] transition-colors group ${
                              isSolved ? "opacity-75 bg-white/[0.01]" : ""
                            }`}
                          >
                            {/* Column 1: TAG */}
                            <td className="py-3 px-2.5 text-center align-middle shrink-0">
                              <Tag className="w-3.5 h-3.5 text-zinc-500 mx-auto" />
                            </td>

                            {/* Column 2: Status Checkbox (#) */}
                            <td className="py-3 px-2 text-center align-middle shrink-0">
                              <SimpleTooltip content={isSolved ? "Solved! Click to unmark" : "Mark as solved"}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleProblemSolved(problem.problem_id);
                                  }}
                                  aria-label={isSolved ? "Mark unsolved" : "Mark solved"}
                                  className={`w-5 h-5 rounded-[4px] flex items-center justify-center mx-auto transition-all duration-75 border cursor-pointer active:scale-90 ${
                                    isSolved
                                      ? "border-[#10b981] bg-[#10b981] text-black shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                                      : "border-white/25 hover:border-emerald-400/80 bg-zinc-900/60 text-transparent"
                                  }`}
                                >
                                  <Check
                                    className={`w-3.5 h-3.5 stroke-[3.5] stroke-black text-black transition-none ${
                                      isSolved ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </button>
                              </SimpleTooltip>
                            </td>

                            {/* Column 3: FAV */}
                            <td className="py-3 px-3 text-center align-middle shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleProblemFav(problem.problem_id)}
                                className={`inline-flex items-center gap-1 text-[11px] font-mono transition-colors cursor-pointer ${
                                  isProblemFav ? "text-rose-400" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                <Heart
                                  className={`w-3.5 h-3.5 ${
                                    isProblemFav ? "fill-rose-500 text-rose-500" : "text-zinc-500"
                                  }`}
                                />
                                <span>{problemFavoriteCount ?? "—"}</span>
                              </button>
                            </td>

                            {/* Column 4: PROBLEM */}
                            <td className="py-3 px-4 align-middle min-w-[220px]">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <a
                                  href={problem.problem_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`font-medium transition-colors hover:text-blue-300 text-xs ${
                                    isSolved ? "line-through text-zinc-500" : "text-blue-400"
                                  }`}
                                >
                                  {displayTitle}
                                </a>

                                {/* Info Tooltip */}
                                <SimpleTooltip content={problem.problem_comments || "Practice problem from official contest sets."}>
                                  <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 shrink-0 cursor-pointer" />
                                </SimpleTooltip>

                                {/* Star indicator */}
                                {problem.is_starred && (
                                  <SimpleTooltip content="Key problem - recommended to solve!">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 cursor-pointer" />
                                  </SimpleTooltip>
                                )}
                              </div>
                            </td>

                            {/* Column 5: DIFFICULTY */}
                            <td className="py-3 px-3 text-center align-middle shrink-0">
                              <span
                                className={`font-semibold text-xs sm:text-sm ${
                                  extra.difficulty_label === "EASY"
                                    ? "text-teal-400 dark:text-emerald-400"
                                    : extra.difficulty_label === "MEDIUM"
                                    ? "text-amber-400"
                                    : "text-rose-500"
                                }`}
                              >
                                {extra.difficulty_label === "EASY"
                                  ? "Easy"
                                  : extra.difficulty_label === "MEDIUM"
                                  ? "Medium"
                                  : "Hard"}
                              </span>
                            </td>

                            {/* Column 6: SOLVE COUNT (NO 123 logo!) */}
                            <td className="py-3 px-3 text-right align-middle shrink-0">
                              <SimpleTooltip content={problemSolveCount === null ? "Problem statistics unavailable." : `${problemSolveCount} users marked this problem solved.`}>
                                <a
                                  href={problem.problem_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-400 hover:text-sky-300 font-medium text-xs font-mono tabular-nums transition-colors"
                                >
                                  {problemSolveCount ?? "—"}
                                </a>
                              </SimpleTooltip>
                            </td>

                            {/* Column 7: EDITORIAL */}
                            <td className="py-3 px-3 text-center align-middle shrink-0">
                              {problem.editorial_link ? (
                                <a href={problem.editorial_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 font-medium text-xs underline underline-offset-2 transition-colors">Editorial</a>
                              ) : <span className="text-zinc-600">—</span>}
                            </td>

                            {/* Column 8: TAGS Toggle */}
                            <td className="py-3 px-3 text-center align-middle shrink-0">
                              <button
                                type="button"
                                onClick={() => toggleTags(problem.problem_id)}
                                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {isTagsOpen ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    <span>Hide</span>
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    <span>Show</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Column 9: SOURCE (Keep Logo Instead of Text!) */}
                            <td className="py-3 px-3 text-center align-middle shrink-0">
                              <SimpleTooltip content={`Open on ${platform.name}`}>
                                <a
                                  href={problem.problem_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer ${platform.hoverColorClass}`}
                                  aria-label={`Open on ${platform.name}`}
                                >
                                  <PlatformIcon platform={platform.type} className="w-5 h-5 fill-current" />
                                </a>
                              </SimpleTooltip>
                            </td>
                          </tr>

                          {/* Expanded Tags Dropdown Row */}
                          {isTagsOpen && (
                            <tr className="bg-black border-b border-white/[0.06]">
                              <td colSpan={9} className="py-2.5 px-6">
                                <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-400">
                                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                                    Tags:
                                  </span>
                                  {(extra.tags || ["implementation", "basics"]).map((t) => (
                                    <Badge
                                      key={t}
                                      variant="outline"
                                      size="sm"
                                      className="font-mono text-[11px] border-white/15 bg-[#0a0a0c] text-zinc-300"
                                    >
                                      {t}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Solved Reset Option */}
            {solvedCount > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                <span>{solvedCount} of {totalCount} problems marked as solved.</span>
                <button
                  type="button"
                  onClick={handleResetSolved}
                  className="inline-flex items-center gap-1 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All in Topic</span>
                </button>
              </div>
            )}
          </section>

          {/* Database-Wired AMOLED Topic Discussions & Comments */}
          <TopicCommentSection topicId={topic.topic_id} topicTitle={topic.topic_title} />

        </div>
      </div>
    </TooltipProvider>
  );
}
