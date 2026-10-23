import { useEffect, useState, useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { CATEGORIES, Category } from "./topic-list-data";
import { memberStorageKey } from "./member-storage";

/**
 * Mindflare Arena — Aura Point & Gamification Engine (Renderer Instance 2)
 * 
 * Fully replicates the authentic YouKn0wWho Academy Aura Points & Badges system:
 * - Practicing/Started Topic: +16 Aura
 * - Completed Topic: +96 Aura
 * - Solved Problem: +32 Aura
 * - Category Badges (Bronze 35% -> +256, Silver 60% -> +512, Gold 90% -> +1024)
 * - Codeforces Max Rating: 2 Aura per rating point
 * - Daily Login & Streak: 25 base + (5 * streak) Aura
 * 
 * 8 Authentic Ranks:
 * - NPC (0 - 499)
 * - Chad (500 - 2,499)
 * - Mega Chad (2,500 - 4,999)
 * - Giga Chad (5,000 - 9,999)
 * - Ultra Chad (10,000 - 17,499)
 * - Alpha Supreme (17,500 - 29,999)
 * - Sigma Eternal (30,000 - 49,999)
 * - Final Boss (50,000+)
 */

export const AURA_CONSTANTS = {
  TOPIC_STARTED_POINTS: 16,
  TOPIC_COMPLETED_POINTS: 96,
  PROBLEM_SOLVED_POINTS: 32,
  CF_RATING_MULTIPLIER: 2,
  DAILY_BASE_POINTS: 25,
  DAILY_STREAK_BONUS_POINTS: 5,
  CATEGORY_BRONZE_PERCENT: 35,
  CATEGORY_BRONZE_POINTS: 256,
  CATEGORY_SILVER_PERCENT: 60,
  CATEGORY_SILVER_POINTS: 512,
  CATEGORY_GOLD_PERCENT: 90,
  CATEGORY_GOLD_POINTS: 1024,
} as const;

export type AuraTierId =
  | "npc"
  | "chad"
  | "mega_chad"
  | "giga_chad"
  | "ultra_chad"
  | "alpha_supreme"
  | "sigma_eternal"
  | "final_boss";

export interface AuraTier {
  id: AuraTierId;
  name: string;
  minAura: number;
  maxAura: number | null;
  symbol: string;
  badgeAsset: string;
  titleColor: string;
  borderColor: string;
  barColor: string;
  description: string;
}

export const AURA_TIERS: AuraTier[] = [
  {
    id: "npc",
    name: "NPC",
    minAura: 0,
    maxAura: 499,
    symbol: "👻",
    badgeAsset: "/images/badges/codestudio_specialist.svg",
    titleColor: "text-zinc-400",
    borderColor: "border-zinc-800",
    barColor: "bg-zinc-400",
    description: "Spawned into the arena. Solving your first fundamentals.",
  },
  {
    id: "chad",
    name: "Chad",
    minAura: 500,
    maxAura: 2499,
    symbol: "😎",
    badgeAsset: "/images/badges/codechef_contest_bronze.svg",
    titleColor: "text-sky-400",
    borderColor: "border-sky-500/30",
    barColor: "bg-sky-400",
    description: "Consistent problem solver building algorithmic momentum.",
  },
  {
    id: "mega_chad",
    name: "Mega Chad",
    minAura: 2500,
    maxAura: 4999,
    symbol: "💪",
    badgeAsset: "/images/badges/codechef_problem_bronze.svg",
    titleColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    barColor: "bg-emerald-400",
    description: "Recognizing core patterns and executing cleanly.",
  },
  {
    id: "giga_chad",
    name: "Giga Chad",
    minAura: 5000,
    maxAura: 9999,
    symbol: "🦾",
    badgeAsset: "/images/badges/codestudio_achiever.svg",
    titleColor: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    barColor: "bg-indigo-400",
    description: "Feared in contests. Crushing intermediate/hard topics.",
  },
  {
    id: "ultra_chad",
    name: "Ultra Chad",
    minAura: 10000,
    maxAura: 17499,
    symbol: "🦁",
    badgeAsset: "/images/badges/codestudio_master.svg",
    titleColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    barColor: "bg-purple-400",
    description: "Mastery of advanced graphs, mathematics, and complex DP.",
  },
  {
    id: "alpha_supreme",
    name: "Alpha Supreme",
    minAura: 17500,
    maxAura: 29999,
    symbol: "🦅",
    badgeAsset: "/images/badges/leetcode_knight.png",
    titleColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    barColor: "bg-amber-400",
    description: "Dominating online judges with high rating and deep coverage.",
  },
  {
    id: "sigma_eternal",
    name: "Sigma Eternal",
    minAura: 30000,
    maxAura: 49999,
    symbol: "👾",
    badgeAsset: "/images/badges/leetcode_guardian.png",
    titleColor: "text-[#ff1018]",
    borderColor: "border-[#ff1018]/40",
    barColor: "bg-[#ff1018]",
    description: "Ascended into competitive programming elite status.",
  },
  {
    id: "final_boss",
    name: "Final Boss",
    minAura: 50000,
    maxAura: null,
    symbol: "🗿",
    badgeAsset: "/images/badges/leetcode_100_days_2026.webp",
    titleColor: "text-yellow-400",
    borderColor: "border-yellow-500/40",
    barColor: "bg-yellow-400",
    description: "Apex predator of the arena. Unrivaled algorithmic power.",
  },
];

export interface CategoryProgress {
  categoryId: string;
  categoryTitle: string;
  totalTopics: number;
  completedTopics: number;
  percentage: number;
  bronzeUnlocked: boolean;
  silverUnlocked: boolean;
  goldUnlocked: boolean;
  earnedAura: number;
  badgeCount: number;
  nextMilestone: {
    tier: "Bronze" | "Silver" | "Gold";
    requiredPercent: number;
    requiredCount: number;
    points: number;
    remaining: number;
  } | null;
}

export interface CodeforcesProfile {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  avatar?: string;
  lastSyncedAt: string;
}

export interface DailyStreakState {
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
  lastCheckInDate: string | null; // "YYYY-MM-DD"
  totalStreakAura: number;
}

export interface AuraBreakdown {
  topicsPracticing: {
    count: number;
    unitPoints: number;
    totalPoints: number;
  };
  topicsCompleted: {
    count: number;
    unitPoints: number;
    totalPoints: number;
  };
  problemsSolved: {
    count: number;
    unitPoints: number;
    totalPoints: number;
  };
  categoryBadges: {
    bronzeCount: number;
    silverCount: number;
    goldCount: number;
    totalBadges: number;
    totalPoints: number;
    categories: CategoryProgress[];
  };
  codeforces: {
    handle: string | null;
    rating: number;
    maxRating: number;
    rank: string;
    maxRank: string;
    avatar?: string;
    auraEarned: number;
    isConnected: boolean;
    lastSyncedAt: string | null;
  };
  dailyStreak: {
    currentStreak: number;
    bestStreak: number;
    totalCheckIns: number;
    lastCheckInDate: string | null;
    canClaimToday: boolean;
    todayReward: number;
    totalStreakAura: number;
  };
  totalAura: number;
  currentTier: AuraTier;
  nextTier: AuraTier | null;
  pointsToNextTier: number;
  tierProgressPercent: number;
}

// Storage keys
export const STORAGE_KEYS = {
  COMPLETED_TOPICS: "youknowwho_completed_topics",
  PRACTICING_TOPICS: "youknowwho_practicing_topics",
  SOLVED_PROBLEMS: "youknowwho_solved_problems",
  CODEFORCES_PROFILE: "mindflare_aura_codeforces",
  DAILY_STREAK: "mindflare_aura_daily_streak",
} as const;

// Custom Event for multi-instance broadcast
export const AURA_SYNC_EVENT = "mindflare:aura-sync";

export function emitAuraSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(AURA_SYNC_EVENT));
  }
}

/**
 * Returns current tier based on total aura points
 */
export function getAuraTier(totalAura: number): {
  currentTier: AuraTier;
  nextTier: AuraTier | null;
  pointsToNextTier: number;
  tierProgressPercent: number;
} {
  let currentTier = AURA_TIERS[0];
  let nextTier: AuraTier | null = AURA_TIERS[1];

  for (let i = 0; i < AURA_TIERS.length; i++) {
    const tier = AURA_TIERS[i];
    if (totalAura >= tier.minAura) {
      currentTier = tier;
      nextTier = i < AURA_TIERS.length - 1 ? AURA_TIERS[i + 1] : null;
    }
  }

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      pointsToNextTier: 0,
      tierProgressPercent: 100,
    };
  }

  const rangeSpan = nextTier.minAura - currentTier.minAura;
  const earnedInRange = Math.max(0, totalAura - currentTier.minAura);
  const pointsToNextTier = Math.max(0, nextTier.minAura - totalAura);
  const tierProgressPercent = Math.min(
    100,
    Math.round((earnedInRange / rangeSpan) * 100)
  );

  return {
    currentTier,
    nextTier,
    pointsToNextTier,
    tierProgressPercent,
  };
}

/**
 * Authentic YouKn0wWho level calculation:
 * - 0 completed topics = Level 0
 * - 1 to 55 completed topics = Triangular progression: Level 1 (1 topic), Level 2 (3 topics), Level 3 (6 topics)...
 *   Formula: Math.floor((-1 + Math.sqrt(1 + 8 * t)) / 2)
 * - >55 completed topics: 10 + Math.floor((t - 55) / 10)
 */
export const calculateUserLevel = (t: number): number => {
  if (t === 0) return 0;
  if (t <= 55) return Math.floor((-1 + Math.sqrt(1 + 8 * t)) / 2);
  return 10 + Math.floor((t - 55) / 10);
};

export const getTopicsForNextLevel = (t: number): number => {
  const level = calculateUserLevel(t);
  if (level < 10) {
    return Math.max(0, ((level + 1) * (level + 2)) / 2 - t);
  }
  return Math.max(0, 55 + (level - 10) * 10 + 10 - t);
};

/**
 * Evaluates category badges for each of the 11 categories
 */
export function evaluateCategoryBadges(
  completedTopicIds: string[],
  categories: Category[] = CATEGORIES
): {
  categories: CategoryProgress[];
  bronzeCount: number;
  silverCount: number;
  goldCount: number;
  totalBadges: number;
  totalPoints: number;
} {
  const completedSet = new Set(completedTopicIds);

  let bronzeCount = 0;
  let silverCount = 0;
  let goldCount = 0;
  let totalPoints = 0;

  const results: CategoryProgress[] = categories.map((cat) => {
    const catTopicIds: string[] = [];
    cat.sub_categories.forEach((sc) => {
      sc.topics.forEach((t) => catTopicIds.push(t.topic_id));
    });

    const totalTopics = catTopicIds.length;
    const completedCount = catTopicIds.filter((id) => completedSet.has(id)).length;
    const percentage = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    const bronzeUnlocked = percentage >= AURA_CONSTANTS.CATEGORY_BRONZE_PERCENT;
    const silverUnlocked = percentage >= AURA_CONSTANTS.CATEGORY_SILVER_PERCENT;
    const goldUnlocked = percentage >= AURA_CONSTANTS.CATEGORY_GOLD_PERCENT;

    let earnedAura = 0;
    let badgeCount = 0;

    if (bronzeUnlocked) {
      earnedAura += AURA_CONSTANTS.CATEGORY_BRONZE_POINTS;
      bronzeCount++;
      badgeCount++;
    }
    if (silverUnlocked) {
      earnedAura += AURA_CONSTANTS.CATEGORY_SILVER_POINTS;
      silverCount++;
      badgeCount++;
    }
    if (goldUnlocked) {
      earnedAura += AURA_CONSTANTS.CATEGORY_GOLD_POINTS;
      goldCount++;
      badgeCount++;
    }

    totalPoints += earnedAura;

    let nextMilestone: CategoryProgress["nextMilestone"] = null;
    if (!bronzeUnlocked) {
      const neededCount = Math.ceil((AURA_CONSTANTS.CATEGORY_BRONZE_PERCENT / 100) * totalTopics);
      nextMilestone = {
        tier: "Bronze",
        requiredPercent: AURA_CONSTANTS.CATEGORY_BRONZE_PERCENT,
        requiredCount: neededCount,
        points: AURA_CONSTANTS.CATEGORY_BRONZE_POINTS,
        remaining: Math.max(0, neededCount - completedCount),
      };
    } else if (!silverUnlocked) {
      const neededCount = Math.ceil((AURA_CONSTANTS.CATEGORY_SILVER_PERCENT / 100) * totalTopics);
      nextMilestone = {
        tier: "Silver",
        requiredPercent: AURA_CONSTANTS.CATEGORY_SILVER_PERCENT,
        requiredCount: neededCount,
        points: AURA_CONSTANTS.CATEGORY_SILVER_POINTS,
        remaining: Math.max(0, neededCount - completedCount),
      };
    } else if (!goldUnlocked) {
      const neededCount = Math.ceil((AURA_CONSTANTS.CATEGORY_GOLD_PERCENT / 100) * totalTopics);
      nextMilestone = {
        tier: "Gold",
        requiredPercent: AURA_CONSTANTS.CATEGORY_GOLD_PERCENT,
        requiredCount: neededCount,
        points: AURA_CONSTANTS.CATEGORY_GOLD_POINTS,
        remaining: Math.max(0, neededCount - completedCount),
      };
    }

    return {
      categoryId: cat.category_id,
      categoryTitle: cat.category_title,
      totalTopics,
      completedTopics: completedCount,
      percentage,
      bronzeUnlocked,
      silverUnlocked,
      goldUnlocked,
      earnedAura,
      badgeCount,
      nextMilestone,
    };
  });

  return {
    categories: results,
    bronzeCount,
    silverCount,
    goldCount,
    totalBadges: bronzeCount + silverCount + goldCount,
    totalPoints,
  };
}

/**
 * Calculates complete Aura breakdown
 */
export function calculateAuraBreakdown({
  completedTopicIds,
  practicingTopicIds,
  solvedProblemIds,
  cfProfile,
  dailyStreak,
}: {
  completedTopicIds: string[];
  practicingTopicIds: string[];
  solvedProblemIds: string[];
  cfProfile: CodeforcesProfile | null;
  dailyStreak: DailyStreakState;
}): AuraBreakdown {
  // Topics: avoid double counting if a topic is both completed and practicing
  const completedCount = completedTopicIds.length;
  const practicingCount = practicingTopicIds.filter(
    (id) => !completedTopicIds.includes(id)
  ).length;

  const topicsCompletedPoints = completedCount * AURA_CONSTANTS.TOPIC_COMPLETED_POINTS;
  const topicsPracticingPoints = practicingCount * AURA_CONSTANTS.TOPIC_STARTED_POINTS;

  // Solved problems
  const solvedCount = solvedProblemIds.length;
  const problemsPoints = solvedCount * AURA_CONSTANTS.PROBLEM_SOLVED_POINTS;

  // Category badges
  const categoryBadges = evaluateCategoryBadges(completedTopicIds);

  // Codeforces max rating aura calculation (2x multiplier)
  const cfAuraEarned = (cfProfile?.maxRating || 0) * AURA_CONSTANTS.CF_RATING_MULTIPLIER;

  // Daily streak
  const todayStr = new Date().toISOString().split("T")[0];
  const canClaimToday = dailyStreak.lastCheckInDate !== todayStr;
  const todayReward =
    AURA_CONSTANTS.DAILY_BASE_POINTS +
    (dailyStreak.currentStreak + (canClaimToday ? 1 : 0)) * AURA_CONSTANTS.DAILY_STREAK_BONUS_POINTS;

  // Total Aura sum
  const totalAura =
    topicsCompletedPoints +
    topicsPracticingPoints +
    problemsPoints +
    categoryBadges.totalPoints +
    cfAuraEarned +
    (dailyStreak.totalStreakAura || 0);

  const { currentTier, nextTier, pointsToNextTier, tierProgressPercent } =
    getAuraTier(totalAura);

  return {
    topicsPracticing: {
      count: practicingCount,
      unitPoints: AURA_CONSTANTS.TOPIC_STARTED_POINTS,
      totalPoints: topicsPracticingPoints,
    },
    topicsCompleted: {
      count: completedCount,
      unitPoints: AURA_CONSTANTS.TOPIC_COMPLETED_POINTS,
      totalPoints: topicsCompletedPoints,
    },
    problemsSolved: {
      count: solvedCount,
      unitPoints: AURA_CONSTANTS.PROBLEM_SOLVED_POINTS,
      totalPoints: problemsPoints,
    },
    categoryBadges,
    codeforces: {
      handle: cfProfile?.handle || null,
      rating: cfProfile?.rating || 0,
      maxRating: cfProfile?.maxRating || 0,
      rank: cfProfile?.rank || "unrated",
      maxRank: cfProfile?.maxRank || "unrated",
      avatar: cfProfile?.avatar,
      auraEarned: cfAuraEarned,
      isConnected: !!cfProfile,
      lastSyncedAt: cfProfile?.lastSyncedAt || null,
    },
    dailyStreak: {
      currentStreak: dailyStreak.currentStreak,
      bestStreak: dailyStreak.bestStreak,
      totalCheckIns: dailyStreak.totalCheckIns,
      lastCheckInDate: dailyStreak.lastCheckInDate,
      canClaimToday,
      todayReward,
      totalStreakAura: dailyStreak.totalStreakAura || 0,
    },
    totalAura,
    currentTier,
    nextTier,
    pointsToNextTier,
    tierProgressPercent,
  };
}

/**
 * Hook to manage reactive Aura Engine (Renderer Instance 2)
 */
export function useAuraEngine() {
  const { isSignedIn, user } = useUser();
  const localKey = useCallback((key: string) => memberStorageKey(key, user?.id), [user?.id]);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [practicingTopicIds, setPracticingTopicIds] = useState<string[]>([]);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);
  const [cfProfile, setCfProfile] = useState<CodeforcesProfile | null>(null);
  const [dailyStreak, setDailyStreak] = useState<DailyStreakState>({
    currentStreak: 0,
    bestStreak: 0,
    totalCheckIns: 0,
    lastCheckInDate: null,
    totalStreakAura: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [authoritativeTotalAura, setAuthoritativeTotalAura] = useState<number | null>(null);

  // Read state from localStorage
  const loadState = useCallback(() => {
    if (typeof window === "undefined") return;
    setCompletedTopicIds([]);
    setPracticingTopicIds([]);
    setSolvedProblemIds([]);
    setCfProfile(null);
    setDailyStreak({
      currentStreak: 0,
      bestStreak: 0,
      totalCheckIns: 0,
      lastCheckInDate: null,
      totalStreakAura: 0,
    });
    setAuthoritativeTotalAura(null);
    setIsLoading(true);

    try {
      // Completed topics
      const rawCompleted = localStorage.getItem(localKey(STORAGE_KEYS.COMPLETED_TOPICS));
      if (rawCompleted) setCompletedTopicIds(JSON.parse(rawCompleted));

      // Practicing topics
      const rawPracticing = localStorage.getItem(localKey(STORAGE_KEYS.PRACTICING_TOPICS));
      if (rawPracticing) setPracticingTopicIds(JSON.parse(rawPracticing));

      // Solved problems
      const rawSolved = localStorage.getItem(localKey(STORAGE_KEYS.SOLVED_PROBLEMS));
      if (rawSolved) setSolvedProblemIds(JSON.parse(rawSolved));

      // Codeforces
      const rawCf = localStorage.getItem(localKey(STORAGE_KEYS.CODEFORCES_PROFILE));
      if (rawCf) setCfProfile(JSON.parse(rawCf));

      // Daily streak
      const rawStreak = localStorage.getItem(localKey(STORAGE_KEYS.DAILY_STREAK));
      if (rawStreak) {
        setDailyStreak(JSON.parse(rawStreak));
      } else {
        // No check-in reward or streak exists until the member claims one.
        const initialStreak: DailyStreakState = {
          currentStreak: 0,
          bestStreak: 0,
          totalCheckIns: 0,
          lastCheckInDate: null,
          totalStreakAura: 0,
        };
        localStorage.setItem(localKey(STORAGE_KEYS.DAILY_STREAK), JSON.stringify(initialStreak));
        setDailyStreak(initialStreak);
      }
    } catch {
      // ignore parse errors
    } finally {
      if (!isSignedIn) setIsLoading(false);
    }
    if (isSignedIn) {
      setIsLoading(true);
      void fetch("/api/topic-list/aura", { cache: "no-store" })
        .then(async (response) => {
          if (!response.ok) return;
          const data = await response.json();
          setCompletedTopicIds(Array.isArray(data.completedTopicIds) ? data.completedTopicIds : []);
          setPracticingTopicIds(Array.isArray(data.practicingTopicIds) ? data.practicingTopicIds : []);
          setSolvedProblemIds(Array.isArray(data.solvedProblemIds) ? data.solvedProblemIds : []);
          setAuthoritativeTotalAura(Number(data.totalAura) || 0);
          const next: DailyStreakState = {
            currentStreak: Number(data.dailyStreak?.currentStreak) || 0,
            bestStreak: Number(data.dailyStreak?.bestStreak) || 0,
            totalCheckIns: Number(data.dailyStreak?.totalCheckIns) || 0,
            lastCheckInDate: data.dailyStreak?.lastCheckInDate || null,
            totalStreakAura: Number(data.dailyStreak?.totalStreakAura) || 0,
          };
          setDailyStreak(next);
          localStorage.setItem(localKey(STORAGE_KEYS.DAILY_STREAK), JSON.stringify(next));
        })
        .catch(() => undefined)
        .finally(() => setIsLoading(false));
    }
  }, [isSignedIn, localKey]);

  useEffect(() => {
    loadState();

    const handleSync = () => loadState();
    window.addEventListener(AURA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(AURA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [loadState]);

  // Look up a public Codeforces handle locally; this does not verify ownership.
  const connectCodeforces = useCallback(async (handle: string): Promise<{ success: boolean; message?: string }> => {
    if (!handle || !handle.trim()) {
      return { success: false, message: "Please provide a valid Codeforces handle" };
    }

    try {
      const res = await fetch(`/api/aura/codeforces?handle=${encodeURIComponent(handle.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, message: data.error || "Failed to find Codeforces user" };
      }

      const user = data.data;
      const profile: CodeforcesProfile = {
        handle: user.handle,
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
        maxRank: user.maxRank,
        avatar: user.avatar,
        lastSyncedAt: new Date().toISOString(),
      };

      localStorage.setItem(localKey(STORAGE_KEYS.CODEFORCES_PROFILE), JSON.stringify(profile));
      setCfProfile(profile);
      emitAuraSync();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.message || "Network error loading Codeforces profile" };
    }
  }, [localKey]);

  // Disconnect Codeforces
  const disconnectCodeforces = useCallback(() => {
    try {
      localStorage.removeItem(localKey(STORAGE_KEYS.CODEFORCES_PROFILE));
      setCfProfile(null);
      emitAuraSync();
    } catch {
      // ignore
    }
  }, [localKey]);

  // Claim Daily Streak Bonus
  const claimDailyBonus = useCallback(async (): Promise<{ success: boolean; pointsAwarded: number }> => {
    if (!isSignedIn) return { success: false, pointsAwarded: 0 };
    try {
      const response = await fetch("/api/topic-list/checkin", { method: "POST" });
      if (!response.ok) return { success: false, pointsAwarded: 0 };
      const result = await response.json();
      const summaryResponse = await fetch("/api/topic-list/checkin", { cache: "no-store" });
      const summary = summaryResponse.ok ? await summaryResponse.json() : result;
      const nextState: DailyStreakState = {
        currentStreak: Number(summary.currentStreak) || 0,
        bestStreak: Number(summary.bestStreak) || 0,
        totalCheckIns: Number(summary.totalCheckins) || 0,
        lastCheckInDate: summary.dates?.at(-1) || new Date().toISOString().slice(0, 10),
        totalStreakAura: Number(summary.totalPoints) || dailyStreak.totalStreakAura,
      };
      setDailyStreak(nextState);
      localStorage.setItem(localKey(STORAGE_KEYS.DAILY_STREAK), JSON.stringify(nextState));
      emitAuraSync();
      return { success: Boolean(result.success), pointsAwarded: Number(result.pointsAwarded) || 0 };
    } catch {
      return { success: false, pointsAwarded: 0 };
    }
  }, [dailyStreak.totalStreakAura, isSignedIn, localKey]);

  // Calculate full reactive breakdown
  const breakdown = useMemo(() => {
    const calculated = calculateAuraBreakdown({
      completedTopicIds,
      practicingTopicIds,
      solvedProblemIds,
      cfProfile,
      dailyStreak,
    });
    if (!isSignedIn || authoritativeTotalAura === null) return calculated;
    return {
      ...calculated,
      totalAura: authoritativeTotalAura,
      ...getAuraTier(authoritativeTotalAura),
    };
  }, [
    completedTopicIds,
    practicingTopicIds,
    solvedProblemIds,
    cfProfile,
    dailyStreak,
    isSignedIn,
    authoritativeTotalAura,
  ]);

  return {
    breakdown,
    isLoading,
    connectCodeforces,
    disconnectCodeforces,
    claimDailyBonus,
    refreshAura: loadState,
  };
}
