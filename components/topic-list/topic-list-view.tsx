"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { TopicOverlayLoading } from "@/components/ui/visual-loading";
import {
  CATEGORIES,
  ALL_TOPICS,
  USEFUL_LINKS,
  EnrichedTopic,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";
import { FilterPopover } from "./filter-popover";
import { CategoryAccordion } from "./category-accordion";
import { StatsDock } from "./stats-dock";
import { TopicListSidebar } from "./topic-list-sidebar";
import { emitAuraSync } from "@/lib/aura-system";
import { loadTopicListState, recordTopicActivity, setTopicFavorite, type TopicListState } from "@/lib/topic-list-client";
import { saveLearningProgress } from "@/lib/learning-progress-client";
import {
  Blocks,
  Briefcase,
  Search,
  ChevronDown,
  ExternalLink,
  X,
} from "@/components/animate-ui/icons";
import { FaChartLine } from "react-icons/fa";
import { TbCompass } from "react-icons/tb";
import { HamburgerIcon } from "@chakra-ui/icons";
import { motion, AnimatePresence } from "motion/react";
import SmoothButton from "@/components/smoothui/smooth-button";
import Kbd from "@/components/smoothui/kbd";
import { TooltipProvider, SimpleTooltip } from "@/components/animate-ui/tooltip";
import Badge from "@/components/smoothui/badge";
import { ClapButton } from "./clap-button";
import { cn } from "@/lib/utils";
import { usePersistedState, usePersistedSet } from "@/hooks/use-persisted-state";
import { memberStorageKey } from "@/lib/member-storage";

function updateLocalCompletionActivity(localKey: (key: string) => string, topicId: string, active: boolean) {
  try {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "/");
    const raw = localStorage.getItem(localKey("mindflare_topic_activity"));
    const activity = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    const existing = activity[today];
    const previousCount = typeof existing === "number"
      ? existing
      : existing && typeof existing === "object" && "count" in existing && typeof existing.count === "number"
        ? existing.count
        : 0;
    const previousTopics = existing && typeof existing === "object" && "topics" in existing && Array.isArray(existing.topics)
      ? existing.topics.filter((value): value is string => typeof value === "string")
      : [];
    if (active) {
      if (previousTopics.includes(topicId)) return;
      const topics = [...previousTopics, topicId];
      activity[today] = { count: previousCount + 1, topics };
    } else {
      if (!previousTopics.includes(topicId)) return;
      const topics = previousTopics.filter((id) => id !== topicId);
      activity[today] = { count: Math.max(0, previousCount - 1), topics };
    }
    localStorage.setItem(localKey("mindflare_topic_activity"), JSON.stringify(activity));
    emitAuraSync();
  } catch {
    // Cloud activity remains authoritative when the browser cache is unavailable.
  }
}

const ModulesModal = dynamic(() =>
  import("./modules-modal").then((module) => module.ModulesModal),
  { loading: () => <TopicOverlayLoading label="topic modules" kind="modules" /> },
);
const SearchModal = dynamic(() =>
  import("./search-modal").then((module) => module.SearchModal),
  { loading: () => <TopicOverlayLoading label="topic search" kind="search" /> },
);
const TopicHeatmapModal = dynamic(() =>
  import("./heatmap-modal").then((module) => module.TopicHeatmapModal),
  { loading: () => <TopicOverlayLoading label="activity heatmap" kind="heatmap" /> },
);
const AuraModal = dynamic(() =>
  import("./aura-modal").then((module) => module.AuraModal),
  { loading: () => <TopicOverlayLoading label="Aura progress" kind="aura" /> },
);

export function TopicListView() {
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id ?? null;
  const localKey = useCallback((key: string) => memberStorageKey(key, userId), [userId]);
  // Persistence state
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [practicingTopics, setPracticingTopics] = useState<string[]>([]);
  const [skippedTopics, setSkippedTopics] = useState<string[]>([]);
  const [favouriteTopics, setFavouriteTopics] = useState<string[]>([]);
  const [favouriteProblems, setFavouriteProblems] = useState<string[]>([]);
  const [communityTopicStats, setCommunityTopicStats] = useState<Record<string, { practicing_count: number; completed_count: number; favourite_count: number }>>({});
  const [communityStatsUnavailable, setCommunityStatsUnavailable] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter state (persisted across refresh)
  const [showOnlyInterview, setShowOnlyInterview] = usePersistedState<boolean>(
    "topic_list_show_only_interview_topics",
    false
  );
  const [difficultyFilter, setDifficultyFilter] = usePersistedState<string>(
    "topic_list_difficulty_filter",
    ""
  );
  const [importanceFilter, setImportanceFilter] = usePersistedState<string>(
    "topic_list_importance_filter",
    ""
  );
  const [completionFilter, setCompletionFilter] = usePersistedState<string>(
    "topic_list_completion_filter",
    ""
  );

  // Modals state
  const [isModulesOpen, setIsModulesOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState<boolean>(false);
  const [isAuraModalOpen, setIsAuraModalOpen] = useState<boolean>(false);
  const [hasOpenedModules, setHasOpenedModules] = useState(false);
  const [hasOpenedSearch, setHasOpenedSearch] = useState(false);
  const [hasOpenedHeatmap, setHasOpenedHeatmap] = useState(false);
  const [hasOpenedAuraModal, setHasOpenedAuraModal] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isStatsDrawerOpen, setIsStatsDrawerOpen] = useState(false);

  // Lock body scroll when either mobile drawer is open
  useEffect(() => {
    if (isNavDrawerOpen || isStatsDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isNavDrawerOpen, isStatsDrawerOpen]);

  // Close drawers on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNavDrawerOpen(false);
        setIsStatsDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const [isUsefulLinksOpen, setIsUsefulLinksOpen] = usePersistedState<boolean>(
    "topic_list_useful_links_open",
    false
  );

  // Accordion expand/collapse tracking (persisted across refresh, defaults to first category c1)
  const [expandedCategories, setExpandedCategories] = usePersistedSet(
    "topic_list_expanded_categories",
    ["basics"]
  );

  // Clap counter state (infinite claps)
  const [claps, setClaps] = useState<number>(0);
  const [userClaps, setUserClaps] = useState<number>(0);

  // Toast banner for interview filter
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [accountStateConflict, setAccountStateConflict] = useState<TopicListState | null>(null);
  const [accountLoadError, setAccountLoadError] = useState(false);

  const refreshCommunityStats = useCallback(async (topicIds: string[]) => {
    const ids = [...new Set(topicIds)];
    if (ids.length === 0) return;
    try {
      const response = await fetch("/api/topic-list/community", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topicIds: ids }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Community totals unavailable");
      const body = await response.json() as { stats?: Record<string, { practicing_count: number; completed_count: number; favourite_count: number }> };
      if (!body.stats) throw new Error("Community totals unavailable");
      setCommunityTopicStats((current) => ({ ...current, ...body.stats }));
    } catch {
      setCommunityStatsUnavailable(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const chunks: string[][] = [];
        for (let index = 0; index < ALL_TOPICS.length; index += 500) {
          chunks.push(ALL_TOPICS.slice(index, index + 500).map((topic) => topic.topic_id));
        }
        const results = await Promise.all(chunks.map(async (topicIds) => {
          const response = await fetch("/api/topic-list/community", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ topicIds }),
            cache: "no-store",
          });
          if (!response.ok) throw new Error("Community totals unavailable");
          return (await response.json()) as { stats?: Record<string, { practicing_count: number; completed_count: number; favourite_count: number }> };
        }));
        if (cancelled) return;
        setCommunityTopicStats(Object.assign({}, ...results.map((result) => result.stats ?? {})));
        setCommunityStatsUnavailable(false);
      } catch {
        if (!cancelled) setCommunityStatsUnavailable(true);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const applyAccountState = useCallback((accountState: TopicListState, mergeBrowser: boolean) => {
    const cloudProgress = new Map(accountState.progress.map((item) => [item.item_key, item.status]));
    let completed = accountState.progress.filter((item) => item.item_key.startsWith("topic:") && item.status === "completed").map((item) => item.item_key.slice(6));
    let practicing = accountState.progress.filter((item) => item.item_key.startsWith("topic:") && item.status === "started").map((item) => item.item_key.slice(6));
    let skipped = accountState.progress.filter((item) => item.item_key.startsWith("topic:") && item.status === "skipped").map((item) => item.item_key.slice(6));
    let favorites = accountState.favorites;

    if (mergeBrowser) {
      try {
        const localCompleted = JSON.parse(localStorage.getItem(localKey("youknowwho_completed_topics")) ?? "[]") as string[];
        const localPracticing = JSON.parse(localStorage.getItem(localKey("youknowwho_practicing_topics")) ?? "[]") as string[];
        const localSkipped = JSON.parse(localStorage.getItem(localKey("mindflare_skipped_topics")) ?? "[]") as string[];
        const localTopicFavorites = JSON.parse(localStorage.getItem(localKey("youknowwho_favourite_topics")) ?? "[]") as string[];
        const localSolved = JSON.parse(localStorage.getItem(localKey("youknowwho_solved_problems")) ?? "[]") as string[];
        const localProblemFavorites = JSON.parse(localStorage.getItem(localKey("youknowwho_fav_problems")) ?? "[]") as string[];
        for (const id of localSkipped) cloudProgress.set(`topic:${id}`, "skipped");
        for (const id of localCompleted) cloudProgress.set(`topic:${id}`, "completed");
        for (const id of localPracticing) if (cloudProgress.get(`topic:${id}`) !== "completed") cloudProgress.set(`topic:${id}`, "started");
        for (const id of localSolved) cloudProgress.set(`problem:${id}`, "completed");
        completed = [...cloudProgress].filter(([key, status]) => key.startsWith("topic:") && status === "completed").map(([key]) => key.slice(6));
        practicing = [...cloudProgress].filter(([key, status]) => key.startsWith("topic:") && status === "started").map(([key]) => key.slice(6));
        skipped = [...cloudProgress].filter(([key, status]) => key.startsWith("topic:") && status === "skipped").map(([key]) => key.slice(6));
        const favoriteKeys = new Set(favorites.map((item) => `${item.item_type}:${item.item_key}`));
        for (const id of localTopicFavorites) favoriteKeys.add(`topic:${id}`);
        for (const id of localProblemFavorites) favoriteKeys.add(`problem:${id}`);
        favorites = [...favoriteKeys].map((key) => {
          const [item_type, ...parts] = key.split(":");
          return { item_type: item_type as "topic" | "problem", item_key: parts.join(":") };
        });
        void saveLearningProgress([...cloudProgress].filter(([, status]) => status !== "not_started").map(([key, status]) => ({ key, status })), userId);
        for (const favorite of favorites) void setTopicFavorite(favorite.item_type, favorite.item_key, true, userId);
      } catch { /* invalid local cache does not block cloud progress */ }
    }

    const topicFavorites = favorites.filter((item) => item.item_type === "topic").map((item) => item.item_key);
    const problemFavorites = favorites.filter((item) => item.item_type === "problem").map((item) => item.item_key);
    setFavouriteTopics(topicFavorites);
    setFavouriteProblems(problemFavorites);
    setClaps(accountState.totalClaps);
    setUserClaps(accountState.userClaps);
    setCompletedTopics(completed);
    setPracticingTopics(practicing);
    setSkippedTopics(skipped);
    try {
      localStorage.setItem(localKey("youknowwho_completed_topics"), JSON.stringify(completed));
      localStorage.setItem(localKey("youknowwho_practicing_topics"), JSON.stringify(practicing));
      localStorage.setItem(localKey("mindflare_skipped_topics"), JSON.stringify(skipped));
      localStorage.setItem(localKey("youknowwho_favourite_topics"), JSON.stringify(topicFavorites));
      localStorage.setItem(localKey("youknowwho_fav_problems"), JSON.stringify(problemFavorites));
      emitAuraSync();
    } catch { /* account data remains available from the API */ }
    setAccountStateConflict(null);
    setAccountLoadError(false);
  }, [localKey, userId]);

  // Load state from localStorage on client mount
  useEffect(() => {
    if (!isLoaded) return;
    setCompletedTopics([]);
    setPracticingTopics([]);
    setSkippedTopics([]);
    setFavouriteTopics([]);
    setFavouriteProblems([]);
    setAccountStateConflict(null);
    try {
      const savedCompleted = localStorage.getItem(localKey("youknowwho_completed_topics"));
      if (savedCompleted) setCompletedTopics(JSON.parse(savedCompleted));

      const savedPracticing = localStorage.getItem(localKey("youknowwho_practicing_topics"));
      if (savedPracticing) setPracticingTopics(JSON.parse(savedPracticing));

      const savedSkipped = localStorage.getItem(localKey("mindflare_skipped_topics"));
      if (savedSkipped) setSkippedTopics(JSON.parse(savedSkipped));

      const savedFavourites = localStorage.getItem(localKey("youknowwho_favourite_topics"));
      if (savedFavourites) setFavouriteTopics(JSON.parse(savedFavourites));
      const savedProblemFavourites = localStorage.getItem(localKey("youknowwho_fav_problems"));
      if (savedProblemFavourites) setFavouriteProblems(JSON.parse(savedProblemFavourites));
    } catch {
      // ignore localStorage errors
    }
    void fetch("/api/topic-list/claps", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json() as { totalClaps?: number };
        setClaps(Number(data.totalClaps) || 0);
      })
      .catch(() => undefined);
    let cancelled = false;
    void loadTopicListState().then((accountState) => {
      if (cancelled) return;
      if (!accountState) {
        setAccountLoadError(Boolean(isSignedIn));
        return;
      }
      setAccountLoadError(false);
      const cloud = new Map(accountState.progress.filter((item) => item.status !== "not_started").map((item) => [item.item_key, item.status]));
      const local = new Map<string, string>();
      let hasLocal = false;
      try {
        const completed = JSON.parse(localStorage.getItem(localKey("youknowwho_completed_topics")) ?? "[]") as string[];
        const practicing = JSON.parse(localStorage.getItem(localKey("youknowwho_practicing_topics")) ?? "[]") as string[];
        const skipped = JSON.parse(localStorage.getItem(localKey("mindflare_skipped_topics")) ?? "[]") as string[];
        const solved = JSON.parse(localStorage.getItem(localKey("youknowwho_solved_problems")) ?? "[]") as string[];
        const topicFavorites = JSON.parse(localStorage.getItem(localKey("youknowwho_favourite_topics")) ?? "[]") as string[];
        const problemFavorites = JSON.parse(localStorage.getItem(localKey("youknowwho_fav_problems")) ?? "[]") as string[];
        skipped.forEach((id) => local.set(`topic:${id}`, "skipped"));
        completed.forEach((id) => local.set(`topic:${id}`, "completed"));
        practicing.forEach((id) => { if (local.get(`topic:${id}`) !== "completed") local.set(`topic:${id}`, "started"); });
        solved.forEach((id) => local.set(`problem:${id}`, "completed"));
        hasLocal = local.size > 0 || topicFavorites.length > 0 || problemFavorites.length > 0;
        const sameProgress = local.size === cloud.size && [...local].every(([key, value]) => cloud.get(key) === value);
        const cloudFavorites = new Set(accountState.favorites.map((item) => `${item.item_type}:${item.item_key}`));
        const browserFavorites = new Set([
          ...topicFavorites.map((id) => `topic:${id}`),
          ...problemFavorites.map((id) => `problem:${id}`),
        ]);
        const sameFavorites = cloudFavorites.size === browserFavorites.size && [...cloudFavorites].every((key) => browserFavorites.has(key));
        if (hasLocal && (!sameProgress || !sameFavorites)) {
          setAccountStateConflict(accountState);
          return;
        }
      } catch { /* malformed browser cache is replaced with account state */ }
      applyAccountState(accountState, false);
    });
    return () => { cancelled = true; };
  }, [applyAccountState, isLoaded, isSignedIn, localKey]);

  // Handlers for topic status toggling
  const handleToggleComplete = useCallback((topicId: string) => {
    const isAdding = !completedTopics.includes(topicId);
    const nextCompleted = isAdding ? [...completedTopics, topicId] : completedTopics.filter((id) => id !== topicId);
    const nextPracticing = practicingTopics.filter((id) => id !== topicId);
    const nextSkipped = skippedTopics.filter((id) => id !== topicId);
    setCompletedTopics(nextCompleted);
    setPracticingTopics(nextPracticing);
    setSkippedTopics(nextSkipped);
    void saveLearningProgress([{ key: `topic:${topicId}`, status: isAdding ? "completed" : "not_started" }], userId)
      .then((saved) => { if (saved) void refreshCommunityStats([topicId]); });
    void recordTopicActivity("topic_completed", topicId, isAdding, userId);
    try {
      localStorage.setItem(localKey("youknowwho_completed_topics"), JSON.stringify(nextCompleted));
      localStorage.setItem(localKey("youknowwho_practicing_topics"), JSON.stringify(nextPracticing));
      localStorage.setItem(localKey("mindflare_skipped_topics"), JSON.stringify(nextSkipped));
      localStorage.setItem(localKey(`youknowwho_completed_${topicId}`), String(isAdding));
      localStorage.setItem(localKey(`youknowwho_practicing_${topicId}`), "false");
    } catch { /* account data remains available from the API */ }
    updateLocalCompletionActivity(localKey, topicId, isAdding);
  }, [completedTopics, localKey, practicingTopics, refreshCommunityStats, skippedTopics, userId]);

  const handleTogglePractice = useCallback((topicId: string) => {
    const isAdding = !practicingTopics.includes(topicId);
    const nextPracticing = isAdding ? [...practicingTopics, topicId] : practicingTopics.filter((id) => id !== topicId);
    const nextCompleted = completedTopics.filter((id) => id !== topicId);
    const nextSkipped = skippedTopics.filter((id) => id !== topicId);
    setPracticingTopics(nextPracticing);
    setCompletedTopics(nextCompleted);
    setSkippedTopics(nextSkipped);
    if (completedTopics.includes(topicId)) {
      void recordTopicActivity("topic_completed", topicId, false, userId);
      updateLocalCompletionActivity(localKey, topicId, false);
    }
    void saveLearningProgress([{ key: `topic:${topicId}`, status: isAdding ? "started" : "not_started" }], userId)
      .then((saved) => { if (saved && isAdding) void refreshCommunityStats([topicId]); });
    try {
      localStorage.setItem(localKey("youknowwho_practicing_topics"), JSON.stringify(nextPracticing));
      localStorage.setItem(localKey(`youknowwho_practicing_${topicId}`), String(isAdding));
      localStorage.setItem(localKey("youknowwho_completed_topics"), JSON.stringify(nextCompleted));
      localStorage.setItem(localKey(`youknowwho_completed_${topicId}`), "false");
      localStorage.setItem(localKey("mindflare_skipped_topics"), JSON.stringify(nextSkipped));
      emitAuraSync();
    } catch { /* account data remains available from the API */ }
  }, [completedTopics, localKey, practicingTopics, refreshCommunityStats, skippedTopics, userId]);

  const handleToggleSkip = useCallback((topicId: string) => {
    const isAdding = !skippedTopics.includes(topicId);
    const nextSkipped = isAdding ? [...skippedTopics, topicId] : skippedTopics.filter((id) => id !== topicId);
    const nextCompleted = completedTopics.filter((id) => id !== topicId);
    const nextPracticing = practicingTopics.filter((id) => id !== topicId);
    setSkippedTopics(nextSkipped);
    setCompletedTopics(nextCompleted);
    setPracticingTopics(nextPracticing);
    if (completedTopics.includes(topicId)) {
      void recordTopicActivity("topic_completed", topicId, false, userId);
      updateLocalCompletionActivity(localKey, topicId, false);
    }
    void saveLearningProgress([{ key: `topic:${topicId}`, status: isAdding ? "skipped" : "not_started" }], userId);
    try {
      localStorage.setItem(localKey("mindflare_skipped_topics"), JSON.stringify(nextSkipped));
      localStorage.setItem(localKey(`youknowwho_completed_${topicId}`), "false");
      localStorage.setItem(localKey(`youknowwho_practicing_${topicId}`), "false");
      localStorage.setItem(localKey("youknowwho_completed_topics"), JSON.stringify(nextCompleted));
      localStorage.setItem(localKey("youknowwho_practicing_topics"), JSON.stringify(nextPracticing));
      emitAuraSync();
    } catch { /* account data remains available from the API */ }
  }, [completedTopics, localKey, practicingTopics, skippedTopics, userId]);

  const handleToggleFavourite = useCallback((topicId: string) => {
    const isAdding = !favouriteTopics.includes(topicId);
    const next = isAdding ? [...favouriteTopics, topicId] : favouriteTopics.filter((id) => id !== topicId);
    setFavouriteTopics(next);
    void setTopicFavorite("topic", topicId, isAdding, userId)
      .then((saved) => { if (saved) void refreshCommunityStats([topicId]); });
    try { localStorage.setItem(localKey("youknowwho_favourite_topics"), JSON.stringify(next)); } catch { /* account API remains authoritative */ }
  }, [favouriteTopics, localKey, refreshCommunityStats, userId]);

  const handleBatchCompleteSubcategory = useCallback((topicIds: string[]) => {
    if (topicIds.length === 0) return;
    const allPresent = topicIds.every((id) => completedTopics.includes(id));
    const topicSet = new Set(topicIds);
    const nextCompleted = allPresent
      ? completedTopics.filter((id) => !topicSet.has(id))
      : [...new Set([...completedTopics, ...topicIds])];
    const nextPracticing = practicingTopics.filter((id) => !topicSet.has(id));
    const nextSkipped = skippedTopics.filter((id) => !topicSet.has(id));
    setCompletedTopics(nextCompleted);
    setPracticingTopics(nextPracticing);
    setSkippedTopics(nextSkipped);
    void saveLearningProgress(topicIds.map((id) => ({
      key: `topic:${id}`,
      status: allPresent ? "not_started" as const : "completed" as const,
    })), userId).then((saved) => { if (saved) void refreshCommunityStats(topicIds); });
    for (const id of topicIds) void recordTopicActivity("topic_completed", id, !allPresent, userId);
    try {
      localStorage.setItem(localKey("youknowwho_completed_topics"), JSON.stringify(nextCompleted));
      localStorage.setItem(localKey("youknowwho_practicing_topics"), JSON.stringify(nextPracticing));
      localStorage.setItem(localKey("mindflare_skipped_topics"), JSON.stringify(nextSkipped));
      for (const id of topicIds) {
        localStorage.setItem(localKey(`youknowwho_completed_${id}`), String(!allPresent));
        localStorage.setItem(localKey(`youknowwho_practicing_${id}`), "false");
      }
    } catch { /* account data remains available from the API */ }
    for (const id of topicIds) updateLocalCompletionActivity(localKey, id, !allPresent);
  }, [completedTopics, localKey, practicingTopics, refreshCommunityStats, skippedTopics, userId]);

  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setExpandedCategories((prev) => new Set([...prev, catId]));
  };

  // Keyboard shortcut listener for search modal ('/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setHasOpenedSearch(true);
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter buttons logic
  const handleInterviewToggle = () => {
    const next = !showOnlyInterview;
    setShowOnlyInterview(next);
    try {
      localStorage.setItem("topic_list_show_only_interview_topics", String(next));
    } catch {
      // ignore
    }
    if (next) {
      setToastMessage("Interview Mode Active — Showing only interview-focused topics");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const applyModuleFilter = (difficulty: string, importance: string) => {
    setIsModulesOpen(false);
    setDifficultyFilter(difficulty);
    setImportanceFilter(importance);
    try {
      localStorage.setItem("topic_list_difficulty_filter", difficulty);
      localStorage.setItem("topic_list_importance_filter", importance);
    } catch {
      // ignore
    }
    const diffTitle = getTopicDifficultyTitle(parseInt(difficulty, 10));
    setToastMessage(`Module Filter Applied: ${diffTitle} (Difficulty Level ${difficulty})`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDifficultyChange = (val: string) => {
    setDifficultyFilter(val);
    try {
      localStorage.setItem("topic_list_difficulty_filter", val);
    } catch {
      // ignore
    }
  };

  const handleImportanceChange = (val: string) => {
    setImportanceFilter(val);
    try {
      localStorage.setItem("topic_list_importance_filter", val);
    } catch {
      // ignore
    }
  };

  const handleCompletionChange = (val: string) => {
    setCompletionFilter(val);
    try {
      localStorage.setItem("topic_list_completion_filter", val);
    } catch {
      // ignore
    }
  };

  const resetAllFilters = () => {
    setDifficultyFilter("");
    setImportanceFilter("");
    setCompletionFilter("");
    setShowOnlyInterview(false);
    try {
      localStorage.removeItem("topic_list_difficulty_filter");
      localStorage.removeItem("topic_list_importance_filter");
      localStorage.removeItem("topic_list_completion_filter");
      localStorage.removeItem("topic_list_show_only_interview_topics");
    } catch {
      // ignore
    }
  };

  const handleClap = useCallback(async () => {
    if (!isSignedIn || userClaps >= 999) return false;
    try {
      const response = await fetch("/api/topic-list/claps", { method: "POST" });
      if (!response.ok) throw new Error("Could not save your clap. Please try again.");
      const result = await response.json() as { totalClaps?: number; userClapCount?: number };
      setClaps(Number(result.totalClaps) || 0);
      setUserClaps(Number(result.userClapCount) || 0);
      return true;
    } catch {
      setToastMessage("Could not save your clap. Please try again.");
      setTimeout(() => setToastMessage(null), 3000);
      return false;
    }
  }, [isSignedIn, userClaps]);

  // Filter topics based on active criteria
  const filteredTopics = useMemo(() => {
    return ALL_TOPICS.filter((t) => {
      if (showOnlyInterview && !t.is_interview_topic) return false;
      if (difficultyFilter !== "" && t.difficulty !== parseInt(difficultyFilter, 10)) {
        return false;
      }
      if (importanceFilter !== "" && t.importance !== parseInt(importanceFilter, 10)) {
        return false;
      }
      if (completionFilter === "completed" && !completedTopics.includes(t.topic_id)) {
        return false;
      }
      if (completionFilter === "incomplete" && completedTopics.includes(t.topic_id)) {
        return false;
      }
      if (completionFilter === "practicing" && !practicingTopics.includes(t.topic_id)) {
        return false;
      }
      if (completionFilter === "skipped" && !skippedTopics.includes(t.topic_id)) {
        return false;
      }
      return true;
    });
  }, [
    showOnlyInterview,
    difficultyFilter,
    importanceFilter,
    completionFilter,
    completedTopics,
    practicingTopics,
    skippedTopics,
  ]);

  const activeFiltersCount = [
    difficultyFilter,
    importanceFilter,
    completionFilter,
    showOnlyInterview ? "interview" : "",
  ].filter((v) => v !== "").length;

  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div className="min-h-full bg-transparent text-foreground selection:bg-[#FF1018]/30 selection:text-white">
        {accountStateConflict && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="progress-conflict-title">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111116] p-5 shadow-2xl">
              <h2 id="progress-conflict-title" className="text-lg font-semibold text-white">Choose which progress to keep</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">This browser has topic-list progress that differs from your account. Merge the browser progress into your account, or load the account progress only?</p>
              <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => applyAccountState(accountStateConflict, false)} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-zinc-200 hover:bg-white/5">Use account progress</button>
                <button type="button" onClick={() => applyAccountState(accountStateConflict, true)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500">Merge browser progress</button>
              </div>
            </div>
          </div>
        )}
        {accountLoadError && isSignedIn && (
          <div role="status" className="mx-auto mt-4 max-w-3xl border-l-2 border-amber-500 bg-[#101012] px-4 py-3 text-sm text-zinc-300">
            Your saved topic progress could not be loaded. Changes remain visible in this browser; refresh the page when your account connection is available.
          </div>
        )}
        {/* Main Container */}
        <div className="mx-auto max-w-[1720px] px-3 sm:px-6 py-6">
          {/* Mobile Dual-Hamburger Sticky Command Bar (xl:hidden) */}
          <div className="xl:hidden sticky top-[4.25rem] z-30 mb-5 flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-[#0a0a0c]/90 px-3 py-2.5 backdrop-blur-xl shadow-xl">
            {/* Left Hamburger: Navigation */}
            <button
              type="button"
              onClick={() => {
                setIsStatsDrawerOpen(false);
                setIsNavDrawerOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer shadow-sm"
              aria-label="Open Navigation menu"
            >
              <HamburgerIcon className="w-4 h-4 text-zinc-300" />
              <span>Navigation</span>
              <span className="font-mono text-[11px] text-zinc-400">
                (15)
              </span>
            </button>

            {/* Middle Indicator */}
            <div className="hidden xs:flex sm:flex items-center gap-2 text-xs font-medium text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff1018]" />
              <span className="text-zinc-300 font-semibold">The God List</span>
            </div>

            {/* Right Hamburger: Your Stats */}
            <button
              type="button"
              onClick={() => {
                setIsNavDrawerOpen(false);
                setIsStatsDrawerOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-black px-3.5 py-2 text-xs font-semibold text-white transition-all hover:bg-white/[0.06] hover:border-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer shadow-sm"
              aria-label="Open Your Stats menu"
            >
              <HamburgerIcon className="w-4 h-4 text-zinc-300" />
              <span>Your Stats</span>
            </button>
          </div>

          {/* 3-Column Layout: Left Navigation + Center God List + Right Your Stats */}
          <div className="flex flex-col xl:flex-row gap-6 xl:gap-6 2xl:gap-8 justify-center items-start">
            {/* Left Sidebar: Navigation (Desktop xl+) */}
            <aside className="hidden xl:block w-60 2xl:w-64 shrink-0 xl:sticky xl:top-24 self-start">
              <TopicListSidebar
                completedTopics={completedTopics}
                favouriteTopics={favouriteTopics}
                favouriteProblems={favouriteProblems}
                skippedTopics={skippedTopics}
                categories={CATEGORIES}
                activeCategoryId={activeCategory}
                onSelectCategory={handleSelectCategory}
                onOpenModules={() => { setHasOpenedModules(true); setIsModulesOpen(true); }}
                onOpenHeatmap={() => { setHasOpenedHeatmap(true); setIsHeatmapOpen(true); }}
                onOpenAuraModal={() => { setHasOpenedAuraModal(true); setIsAuraModalOpen(true); }}
                onToggleSkip={handleToggleSkip}
              />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 max-w-[880px] w-full">
              {/* Header Hero - Centered Centric UI */}
              <div className="mb-4 text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 mb-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff1018]" />
                  Curated Competitive Programming Track
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F4F3FC] mb-2 text-center">
                  The God List
                </h1>

                <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed text-center">
                  A comprehensive curriculum of competitive programming topics, tutorials, and problems curated across all difficulty levels.
                </p>
              </div>

              {/* Toast Notification */}
              {toastMessage && (
                <div className="mb-3.5 rounded-xl border border-blue-500/40 bg-blue-500/15 p-2.5 text-xs text-blue-300 text-center animate-in fade-in-50 duration-200">
                  {toastMessage}
                </div>
              )}

              {/* Action Bar / Controls Toolbar */}
              <div className="flex items-center gap-2.5 mb-5 flex-wrap">
                {/* Modules Button */}
                <button
                  type="button"
                  onClick={() => { setHasOpenedModules(true); setIsModulesOpen(true); }}
                  className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-[#F4F3FC] transition-colors shadow-sm cursor-pointer"
                >
                  <Blocks className="w-3.5 h-3.5 text-white/80" animateOnHover />
                  <span>Modules</span>
                </button>

                {/* Interview Topics Button */}
                <button
                  type="button"
                  onClick={handleInterviewToggle}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border transition-colors shadow-sm cursor-pointer",
                    showOnlyInterview
                      ? "border-[#FF1018] bg-[#FF1018]/15 text-[#FF1018]"
                      : "border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-[#F4F3FC]"
                  )}
                >
                  <Briefcase className="w-3.5 h-3.5" animateOnHover />
                  <span>Interview Topics</span>
                </button>

                {/* Filter Popover */}
                <FilterPopover
                  difficulty={difficultyFilter}
                  setDifficulty={handleDifficultyChange}
                  importance={importanceFilter}
                  setImportance={handleImportanceChange}
                  completion={completionFilter}
                  setCompletion={handleCompletionChange}
                  onReset={resetAllFilters}
                />

                {/* Clap Button (Between Filter and Search Topics) */}
                <ClapButton count={claps} onClap={handleClap} disabled={!isSignedIn || userClaps >= 999} />

                {/* Search Topics Trigger Input Box */}
                <div
                  onClick={() => { setHasOpenedSearch(true); setIsSearchOpen(true); }}
                  className="ml-auto flex items-center h-9 w-56 sm:w-64 rounded-xl border border-white/10 bg-black px-3.5 text-xs text-muted-foreground hover:border-white/20 hover:text-[#F4F3FC] transition-all cursor-pointer shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 mr-2 text-white/40 shrink-0" animateOnHover />
                  <span className="truncate">Search Topics...</span>
                  <Kbd className="ml-auto bg-white/10 border-white/15 text-gray-300 text-[10px]">/</Kbd>
                </div>
              </div>

              {/* Active Filters Summary Bar */}
              {activeFiltersCount > 0 && (
                <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white/80 shadow-md">
                  <span className="flex items-center gap-2">
                    <Badge variant="outline" size="sm" className="border-white/20 text-white/90 bg-white/[0.04]">
                      Filtered
                    </Badge>
                    <span>
                      {filteredTopics.length} of {ALL_TOPICS.length} topics shown
                    </span>
                  </span>
                  <SmoothButton
                    variant="link"
                    color="destructive"
                    size="xs"
                    onClick={resetAllFilters}
                    className="font-medium p-0 h-auto text-[#ff5466] hover:underline"
                  >
                    Reset all filters
                  </SmoothButton>
                </div>
              )}

              {/* 11 Category Accordions */}
              <div className="space-y-4">
                {CATEGORIES.map((category) => (
                  <CategoryAccordion
                    key={category.category_id}
                    category={category}
                    topics={filteredTopics}
                    isExpanded={expandedCategories.has(category.category_id)}
                    onToggleExpand={() => toggleCategoryExpand(category.category_id)}
                    completedTopics={completedTopics}
                    practicingTopics={practicingTopics}
                    favouriteTopics={favouriteTopics}
                    skippedTopics={skippedTopics}
                    communityTopicStats={communityTopicStats}
                    onToggleComplete={handleToggleComplete}
                    onTogglePractice={handleTogglePractice}
                    onToggleFavourite={handleToggleFavourite}
                    onToggleSkip={handleToggleSkip}
                    onBatchCompleteSubcategory={handleBatchCompleteSubcategory}
                  />
                ))}

                {/* Useful Links Accordion Section */}
                <div
                  id="useful_links"
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden mb-4 ${isUsefulLinksOpen
                      ? "border-white/15 bg-black shadow-xl"
                      : "border-white/10 bg-black hover:border-white/20"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsUsefulLinksOpen(!isUsefulLinksOpen)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left transition-colors cursor-pointer select-none hover:bg-white/[0.02]"
                  >
                    <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-white/90 hover:text-white transition-colors">
                      Useful Links
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-gray-400 font-normal">
                        {USEFUL_LINKS.length} links
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-gray-400 transition-transform duration-200",
                          isUsefulLinksOpen && "rotate-180 text-white"
                        )}
                        animateOnHover
                      />
                    </div>
                  </button>

                  {isUsefulLinksOpen && (
                    <div className="border-t border-white/10 px-5 sm:px-6 py-5 bg-black">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {USEFUL_LINKS.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0a0a0c] hover:border-white/25 hover:bg-white/[0.04] transition-all group"
                          >
                            <span className="text-xs text-white/80 group-hover:text-white line-clamp-1 pr-2">
                              {link.title}
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white shrink-0" animateOnHover />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>

            {/* Right Sidebar: Your Stats (Desktop xl+) */}
            <aside className="hidden xl:block w-72 2xl:w-80 shrink-0 xl:sticky xl:top-24 self-start">
              <StatsDock
                completedTopics={completedTopics}
                totalProblemsCount={3888}
                onOpenHeatmap={() => { setHasOpenedHeatmap(true); setIsHeatmapOpen(true); }}
                onOpenAuraModal={() => { setHasOpenedAuraModal(true); setIsAuraModalOpen(true); }}
              />
            </aside>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Left Slide-in) */}
        <AnimatePresence>
          {isNavDrawerOpen && (
            <div className="xl:hidden">
              {/* Backdrop */}
              <motion.div
                key="nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setIsNavDrawerOpen(false)}
                className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Left Drawer Panel */}
              <motion.aside
                key="nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation Menu"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 z-[60] w-[min(340px,calc(100vw-2.5rem))] bg-[#0a0a0c] border-r border-white/10 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header with Title + Close button */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/70">
                  <div className="flex items-center gap-2">
                    <TbCompass className="w-5 h-5 text-sky-400" />
                    <h2 className="text-sm font-bold text-white tracking-tight">Navigation</h2>
                    <span className="text-xs font-mono text-zinc-400">(15)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNavDrawerOpen(false)}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                  <TopicListSidebar
                    completedTopics={completedTopics}
                    favouriteTopics={favouriteTopics}
                    favouriteProblems={favouriteProblems}
                    skippedTopics={skippedTopics}
                    categories={CATEGORIES}
                    activeCategoryId={activeCategory}
                    onSelectCategory={(catId) => {
                      handleSelectCategory(catId);
                      setIsNavDrawerOpen(false);
                    }}
                    onOpenModules={() => {
                      setHasOpenedModules(true);
                      setIsModulesOpen(true);
                      setIsNavDrawerOpen(false);
                    }}
                    onOpenHeatmap={() => {
                      setHasOpenedHeatmap(true);
                      setIsHeatmapOpen(true);
                      setIsNavDrawerOpen(false);
                    }}
                    onOpenAuraModal={() => {
                      setHasOpenedAuraModal(true);
                      setIsAuraModalOpen(true);
                      setIsNavDrawerOpen(false);
                    }}
                    onToggleSkip={handleToggleSkip}
                    inDrawer
                    onItemClick={() => setIsNavDrawerOpen(false)}
                  />
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Mobile Stats Drawer (Right Slide-in) */}
        <AnimatePresence>
          {isStatsDrawerOpen && (
            <div className="xl:hidden">
              {/* Backdrop */}
              <motion.div
                key="stats-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => setIsStatsDrawerOpen(false)}
                className="fixed inset-0 z-[55] bg-black/80 backdrop-blur-sm"
                aria-hidden="true"
              />

              {/* Right Drawer Panel */}
              <motion.aside
                key="stats-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Your Stats Menu"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 right-0 z-[60] w-[min(380px,calc(100vw-1.5rem))] bg-[#0a0a0c] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
              >
                {/* Header with Title + Close button */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/70">
                  <div className="flex items-center gap-2">
                    <FaChartLine className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-sm font-bold text-white tracking-tight">Your Stats</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsStatsDrawerOpen(false)}
                    className="p-1.5 rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                    aria-label="Close stats"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Stats Content */}
                <div className="flex-1 overflow-y-auto p-3.5 scrollbar-thin">
                  <StatsDock
                    completedTopics={completedTopics}
                    totalProblemsCount={3888}
                    onOpenHeatmap={() => {
                      setHasOpenedHeatmap(true);
                      setIsHeatmapOpen(true);
                      setIsStatsDrawerOpen(false);
                    }}
                    onOpenAuraModal={() => {
                      setHasOpenedAuraModal(true);
                      setIsAuraModalOpen(true);
                      setIsStatsDrawerOpen(false);
                    }}
                    onActionClick={() => setIsStatsDrawerOpen(false)}
                  />
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Modules Modal */}
        {hasOpenedModules && (
          <ModulesModal
            isOpen={isModulesOpen}
            onClose={() => setIsModulesOpen(false)}
            applyModuleFilter={applyModuleFilter}
            completedTopicsList={completedTopics}
          />
        )}

        {/* Search Modal */}
        {hasOpenedSearch && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}

        {/* Heatmap Modal */}
        {hasOpenedHeatmap && (
          <TopicHeatmapModal
            isOpen={isHeatmapOpen}
            onClose={() => setIsHeatmapOpen(false)}
            completedTopics={completedTopics}
          />
        )}

        {/* Aura & Badges Gamification Modal */}
        {hasOpenedAuraModal && (
          <AuraModal
            isOpen={isAuraModalOpen}
            onClose={() => setIsAuraModalOpen(false)}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
