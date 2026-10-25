/**
 * Mindflare Arena — Pure Aura Math & Gamification Core
 * Safe for both Server (API routes) and Client (React components)
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
    symbol: "I",
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
    symbol: "II",
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
    symbol: "III",
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
    symbol: "IV",
    badgeAsset: "/images/badges/leetcode_50_days_2026.webp",
    titleColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    barColor: "bg-blue-400",
    description: "Crushing advanced graph, number theory, and combinatorics.",
  },
  {
    id: "ultra_chad",
    name: "Ultra Chad",
    minAura: 10000,
    maxAura: 17499,
    symbol: "V",
    badgeAsset: "/images/badges/leetcode_100_days_2026.webp",
    titleColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    barColor: "bg-purple-400",
    description: "Dominating hardest problems and posting contest editorials.",
  },
  {
    id: "alpha_supreme",
    name: "Alpha Supreme",
    minAura: 17500,
    maxAura: 29999,
    symbol: "VI",
    badgeAsset: "/images/badges/codechef_contest_bronze.svg",
    titleColor: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    barColor: "bg-yellow-400",
    description: "Grandmaster speed and deep algorithmic intuition.",
  },
  {
    id: "sigma_eternal",
    name: "Sigma Eternal",
    minAura: 30000,
    maxAura: 49999,
    symbol: "VII",
    badgeAsset: "/images/badges/codechef_problem_bronze.svg",
    titleColor: "text-orange-400",
    borderColor: "border-orange-500/40",
    barColor: "bg-orange-400",
    description: "Legendary mastery across all dynamic programming and flow topics.",
  },
  {
    id: "final_boss",
    name: "Final Boss",
    minAura: 50000,
    maxAura: null,
    symbol: "VIII",
    badgeAsset: "/images/badges/leetcode_100_days_2026.webp",
    titleColor: "text-red-400",
    borderColor: "border-red-500/40",
    barColor: "bg-red-400",
    description: "Apex predator of the arena. Unrivaled algorithmic power.",
  },
];

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
