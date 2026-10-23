"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  Trophy,
  Flame,
  Award,
  CircleCheck,
  Sparkles,
  Calendar,
  Code,
  ExternalLink,
  RefreshCw,
  User,
  ArrowRight,
  BookOpen,
  Star,
  X,
  Activity,
  Check,
} from "@/components/animate-ui/icons";
import SmoothButton from "@/components/smoothui/smooth-button";
import { TablerNumbersIcon } from "./tabler-numbers";
import {
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/smoothui/progress";
import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "@/components/smoothui/tabs";
import {
  AURA_TIERS,
  AURA_CONSTANTS,
  AuraBreakdown,
  CategoryProgress,
  useAuraEngine,
} from "@/lib/aura-system";
import { cn } from "@/lib/utils";

interface AuraModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = "overview" | "codeforces" | "badges" | "streak" | "tiers";

// Authentic Vector Category Medals (Bronze, Silver, Gold)
function CategoryMilestoneMedal({
  tier,
  unlocked,
  size = 36,
}: {
  tier: "Bronze" | "Silver" | "Gold";
  unlocked: boolean;
  size?: number;
}) {
  if (tier === "Bronze") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transition-all duration-300", !unlocked && "opacity-25 grayscale")}
      >
        <circle cx="20" cy="20" r="18" fill="#181410" stroke={unlocked ? "#d97706" : "#44403c"} strokeWidth="2" />
        <circle cx="20" cy="20" r="14" fill="#2d1f14" />
        <path
          d="M20 10L22.5 16.5H29.5L24 20.5L26 27L20 23L14 27L16 20.5L10.5 16.5H17.5L20 10Z"
          fill={unlocked ? "#f59e0b" : "#78716c"}
        />
      </svg>
    );
  }

  if (tier === "Silver") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("transition-all duration-300", !unlocked && "opacity-25 grayscale")}
      >
        <circle cx="20" cy="20" r="18" fill="#13171c" stroke={unlocked ? "#94a3b8" : "#44403c"} strokeWidth="2" />
        <circle cx="20" cy="20" r="14" fill="#1e293b" />
        <path
          d="M20 10L22.5 16.5H29.5L24 20.5L26 27L20 23L14 27L16 20.5L10.5 16.5H17.5L20 10Z"
          fill={unlocked ? "#e2e8f0" : "#64748b"}
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-300", !unlocked && "opacity-25 grayscale")}
    >
      <circle cx="20" cy="20" r="18" fill="#1c1808" stroke={unlocked ? "#eab308" : "#44403c"} strokeWidth="2" />
      <circle cx="20" cy="20" r="14" fill="#362908" />
      <path
        d="M20 10L22.5 16.5H29.5L24 20.5L26 27L20 23L14 27L16 20.5L10.5 16.5H17.5L20 10Z"
        fill={unlocked ? "#facc15" : "#713f12"}
      />
    </svg>
  );
}

export function AuraModal({ isOpen, onClose }: AuraModalProps) {
  const { isSignedIn } = useUser();
  const [claimPending, setClaimPending] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const {
    breakdown,
    connectCodeforces,
    disconnectCodeforces,
    claimDailyBonus,
  } = useAuraEngine();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [cfInputHandle, setCfInputHandle] = useState("");
  const [cfLoading, setCfLoading] = useState(false);
  const [cfError, setCfError] = useState<string | null>(null);
  const [cfSuccess, setCfSuccess] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    totalAura,
    currentTier,
    nextTier,
    pointsToNextTier,
    tierProgressPercent,
    topicsCompleted,
    topicsPracticing,
    problemsSolved,
    categoryBadges,
    codeforces,
    dailyStreak,
  } = breakdown;

  const handleConnectCf = async (handleToUse?: string) => {
    const handle = handleToUse || cfInputHandle;
    if (!handle.trim()) {
      setCfError("Please enter a valid Codeforces handle");
      return;
    }

    setCfLoading(true);
    setCfError(null);
    setCfSuccess(null);

    const result = await connectCodeforces(handle);
    setCfLoading(false);

    if (result.success) {
      setCfSuccess(`Loaded public stats for "${handle}". Ownership is unverified and these stats do not add Aura.`);
    } else {
      setCfError(result.message || "Failed to load the Codeforces profile");
    }
  };

  const handleClaimStreak = async () => {
    if (claimPending) return;
    setClaimPending(true);
    setClaimError(null);
    try {
      const res = await claimDailyBonus();
      if (!res.success) {
        setClaimError(isSignedIn ? "Could not claim today’s check-in. Please try again." : "Sign in to claim check-ins across devices.");
        return;
      }
      try {
        const { default: confetti } = await import("canvas-confetti");
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // A check-in remains successful even if the celebration chunk fails to load.
      }
    } finally {
      setClaimPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Window */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-[#050508] text-white shadow-2xl overflow-hidden">
        {/* Top Header / Tier Banner */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0a0a0c]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Authentic Emblem */}
              <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl border border-white/15 bg-black shrink-0 overflow-hidden shadow-lg">
                <Image
                  src={currentTier.badgeAsset}
                  alt={currentTier.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                    {currentTier.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black border border-white/15 text-zinc-300">
                    Tier Rank
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-medium">
                  {currentTier.description}
                </p>
              </div>
            </div>

            {/* Total Aura Counter & Close Button */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Total Aura
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#ff1018] font-mono tracking-tight">
                  {totalAura.toLocaleString()} <span className="text-xs font-normal text-zinc-400">PTS</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar to Next Tier */}
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-zinc-400 font-medium">
                {nextTier ? (
                  <>
                    <span className="text-white font-bold font-mono">
                      {pointsToNextTier.toLocaleString()} Aura
                    </span>{" "}
                    needed to reach{" "}
                    <span className="text-white font-bold">{nextTier.name}</span>
                  </>
                ) : (
                  <span className="text-yellow-400 font-bold">
                    Maximum Rank Reached (Final Boss)
                  </span>
                )}
              </span>
              <span className="font-mono font-bold text-zinc-300 text-xs">
                {tierProgressPercent}%
              </span>
            </div>
            <ProgressRoot value={tierProgressPercent} className="w-full">
              <ProgressTrack size="md" className="h-2 bg-black border border-white/10">
                <ProgressIndicator className="bg-gradient-to-r from-red-600 via-[#ff1018] to-red-500 shadow-[0_0_10px_rgba(255,16,24,0.5)]" />
              </ProgressTrack>
            </ProgressRoot>
          </div>
        </div>

        {/* Tab Navigation powered by SmoothUI Tabs */}
        <TabsRoot
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as TabKey)}
          className="flex-1 min-h-0 flex flex-col"
        >
          <div className="border-b border-white/10 bg-black px-5 pt-1">
            <TabsList
              variant="underline"
              className="gap-1 border-b-0 overflow-x-auto scrollbar-none"
            >
              {[
                { id: "overview", label: "Breakdown", icon: Activity },
                { id: "codeforces", label: "Codeforces Sync", icon: Code },
                { id: "badges", label: `Category Badges (${categoryBadges.totalBadges})`, icon: Award },
                { id: "streak", label: `Daily Streak (${dailyStreak.currentStreak}d)`, icon: Flame },
                { id: "tiers", label: "All 8 Ranks", icon: Trophy },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <TabsTab
                    key={tab.id}
                    value={tab.id}
                    className={cn(
                      "px-3.5 py-2.5 text-xs font-bold transition-all gap-2 cursor-pointer outline-none select-none rounded-none border-b-0 whitespace-nowrap",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-3.5 h-3.5 transition-colors",
                        isActive ? "text-[#ff1018]" : "text-zinc-400"
                      )}
                      animateOnHover
                    />
                    <span>{tab.label}</span>
                  </TabsTab>
                );
              })}
              <TabsIndicator className="bg-[#ff1018] shadow-[0_0_12px_rgba(255,16,24,0.6)] h-[2px]" />
            </TabsList>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* TAB 1: OVERVIEW BREAKDOWN */}
            <TabsPanel value="overview" animated className="pt-0 space-y-6 text-white focus-visible:ring-0">

            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Aura Points Ledger
                </h3>
                <span className="text-xs text-zinc-400">
                  Exact replication of authentic point criteria
                </span>
              </div>

              {/* Grid of point categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Completed Topics */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CircleCheck className="w-4 h-4 text-emerald-400" animateOnHover />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Topics Completed
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-emerald-400">
                      +{topicsCompleted.totalPoints.toLocaleString()} Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Awarded 96 Aura for every topic finished and checked off in the curriculum.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400 inline-flex items-center gap-1.5">
                      <TablerNumbersIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Formula</span>
                    </span>
                    <span className="font-mono text-zinc-200">
                      {topicsCompleted.count} topics &times; 96 pts
                    </span>
                  </div>
                </div>

                {/* 2. Topics Practicing */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-sky-400" animateOnHover />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Topics In-Progress
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-sky-400">
                      +{topicsPracticing.totalPoints.toLocaleString()} Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Awarded 16 Aura for initiating and actively learning curriculum topics.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400 inline-flex items-center gap-1.5">
                      <TablerNumbersIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Formula</span>
                    </span>
                    <span className="font-mono text-zinc-200">
                      {topicsPracticing.count} topics &times; 16 pts
                    </span>
                  </div>
                </div>

                {/* 3. Solved Problems */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-indigo-400" animateOnHover />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Problems Solved
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-indigo-400">
                      +{problemsSolved.totalPoints.toLocaleString()} Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Awarded 32 Aura for every competitive coding problem solved across topics.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400 inline-flex items-center gap-1.5">
                      <TablerNumbersIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Formula</span>
                    </span>
                    <span className="font-mono text-zinc-200">
                      {problemsSolved.count} problems &times; 32 pts
                    </span>
                  </div>
                </div>

                {/* 4. Category Badges */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-purple-400" animateOnHover />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Category Badges
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-purple-400">
                      +{categoryBadges.totalPoints.toLocaleString()} Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Awarded 256 for Bronze (35%), 512 for Silver (60%), and 1,024 for Gold (90%).
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400">Badges Earned</span>
                    <span className="font-mono text-zinc-200">
                      {categoryBadges.totalBadges} badges across 11 disciplines
                    </span>
                  </div>
                </div>

                {/* 5. Codeforces Rating */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="relative w-4 h-4 shrink-0">
                        <Image
                          src="/images/platform-icons/codeforces.png"
                          alt="Codeforces"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Codeforces Connection
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-red-400">
                      Not counted toward Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    Ratings from this local lookup are public profile data and are not ownership-verified, server-persisted, or counted toward Aura.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400">Public Handle</span>
                    <span className="font-mono text-zinc-200">
                      {codeforces.handle ? `${codeforces.handle} (${codeforces.maxRating} max)` : "Not linked"}
                    </span>
                  </div>
                </div>

                {/* 6. Daily Login Streak */}
                <div className="p-4 rounded-xl border border-white/10 bg-[#0a0a0c]">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" animateOnHover />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Daily Check-in & Streak
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono text-amber-400">
                      +{dailyStreak.totalStreakAura.toLocaleString()} Aura
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    25 base Aura daily + 5 additional Aura per consecutive streak day.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-zinc-400">Streak Status</span>
                    <span className="font-mono text-zinc-200">
                      {dailyStreak.currentStreak} days streak (Best: {dailyStreak.bestStreak}d)
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-4 rounded-xl border border-white/10 bg-black flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Aggregated Platform Aura</div>
                  <div className="text-[11px] text-zinc-400">All 6 channels computed authoritative by Instance 2</div>
                </div>
                <div className="text-2xl font-black font-mono text-[#ff1018]">
                  {totalAura.toLocaleString()}
                </div>
              </div>
            </div>
            </TabsPanel>

            {/* TAB 2: CODEFORCES SYNC */}
            <TabsPanel value="codeforces" animated className="pt-0 space-y-6 text-white focus-visible:ring-0">
              <div className="space-y-5">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black">
                <div className="relative w-10 h-10 shrink-0">
                  <Image
                    src="/images/platform-icons/codeforces.png"
                    alt="Codeforces"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Codeforces Rating Integration
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Look up public Codeforces ratings. Ownership verification and server-side persistence are required before a rating can affect Aura.
                  </p>
                </div>
              </div>

              {/* Connected Status Card */}
              {codeforces.isConnected ? (
                <div className="p-5 rounded-xl border border-white/10 bg-[#0a0a0c] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {codeforces.avatar ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
                          <Image
                            src={codeforces.avatar}
                            alt={codeforces.handle || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-black text-zinc-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white font-mono">
                            {codeforces.handle}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black border border-white/15 text-emerald-400">
                            Public · unverified
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 capitalize">
                          Rank: <span className="text-white font-semibold">{codeforces.rank}</span> &bull; Max:{" "}
                          <span className="text-white font-semibold">{codeforces.maxRank}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        Aura status
                      </div>
                      <div className="text-xl font-black font-mono text-emerald-400">
                        Not counted
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                    <div className="p-2.5 rounded-lg bg-black border border-white/10">
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Current Rating</div>
                      <div className="text-sm font-bold font-mono text-white mt-0.5">{codeforces.rating}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black border border-white/10">
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase">Max Rating</div>
                      <div className="text-sm font-bold font-mono text-white mt-0.5">{codeforces.maxRating}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black border border-white/10">
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase flex items-center justify-center gap-1">
                        <TablerNumbersIcon className="w-3 h-3 text-[#ff1018]" />
                        <span>Multiplier</span>
                      </div>
                      <div className="text-sm font-bold font-mono text-white mt-0.5">&times; 2 Aura</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-zinc-400">
                      Last looked up: {codeforces.lastSyncedAt ? new Date(codeforces.lastSyncedAt).toLocaleDateString() : "—"}
                    </span>
                    <button
                      onClick={disconnectCodeforces}
                      className="text-xs font-semibold text-red-400 hover:text-red-300 underline"
                    >
                      Unlink Handle
                    </button>
                  </div>
                </div>
              ) : (
                /* Connect Input Form */
                <div className="p-5 rounded-xl border border-white/10 bg-[#0a0a0c] space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Look up a public Codeforces handle
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="e.g. tourist, Petr, radewoosh"
                      value={cfInputHandle}
                      onChange={(e) => setCfInputHandle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConnectCf();
                      }}
                      className="flex-1 rounded-xl border border-white/15 bg-black px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff1018]"
                    />
                    <SmoothButton
                      variant="solid"
                      color="accent"
                      size="sm"
                      onClick={() => handleConnectCf()}
                      disabled={cfLoading}
                      className="rounded-xl px-4 text-xs font-bold"
                    >
                      {cfLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <>
                          <span>Look up public stats</span>
                          <ArrowRight className="w-3.5 h-3.5" animateOnHover />
                        </>
                      )}
                    </SmoothButton>
                  </div>

                  {cfError && (
                    <div className="p-3 rounded-lg border border-red-500/30 bg-black text-xs text-red-400 font-medium">
                      {cfError}
                    </div>
                  )}

                  {cfSuccess && (
                    <div className="p-3 rounded-lg border border-emerald-500/30 bg-black text-xs text-emerald-400 font-medium">
                      {cfSuccess}
                    </div>
                  )}

                  {/* Quick Demo Pre-set Handles */}
                  <div className="pt-3 border-t border-white/10">
                    <span className="text-[11px] text-zinc-400 block mb-2">
                      Try a public handle to preview its profile data:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["tourist", "Petr", "Benq", "ecnerwala"].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setCfInputHandle(preset);
                            handleConnectCf(preset);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-white/10 bg-black text-xs font-mono text-zinc-300 hover:text-white hover:border-white/25 transition-colors"
                        >
                          @{preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            </TabsPanel>

            {/* TAB 3: CATEGORY BADGES */}
            <TabsPanel value="badges" animated className="pt-0 space-y-6 text-white focus-visible:ring-0">
              <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                    Discipline Milestone Badges
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Progress through each of the 11 categories to unlock Bronze, Silver, and Gold badges.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono">
                    {categoryBadges.totalBadges} / 33 Badges
                  </div>
                  <div className="text-[11px] text-purple-400 font-semibold font-mono">
                    +{categoryBadges.totalPoints.toLocaleString()} Aura
                  </div>
                </div>
              </div>

              {/* Milestone Criteria Guide */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl border border-white/10 bg-black text-center">
                <div className="flex flex-col items-center gap-1">
                  <CategoryMilestoneMedal tier="Bronze" unlocked size={28} />
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Bronze (35%)</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">+256 Aura</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CategoryMilestoneMedal tier="Silver" unlocked size={28} />
                  <span className="text-[10px] font-bold text-slate-300 uppercase">Silver (60%)</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">+512 Aura</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <CategoryMilestoneMedal tier="Gold" unlocked size={28} />
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">Gold (90%)</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">+1,024 Aura</span>
                </div>
              </div>

              {/* 11 Categories List */}
              <div className="space-y-2.5">
                {categoryBadges.categories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    className="p-3.5 rounded-xl border border-white/10 bg-[#0a0a0c] hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {cat.categoryTitle}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            ({cat.completedTopics}/{cat.totalTopics} topics)
                          </span>
                        </div>
                      </div>

                      {/* 3 Medals */}
                      <div className="flex items-center gap-2">
                        <CategoryMilestoneMedal tier="Bronze" unlocked={cat.bronzeUnlocked} size={24} />
                        <CategoryMilestoneMedal tier="Silver" unlocked={cat.silverUnlocked} size={24} />
                        <CategoryMilestoneMedal tier="Gold" unlocked={cat.goldUnlocked} size={24} />
                        <span className="text-xs font-bold font-mono text-zinc-300 ml-2">
                          +{cat.earnedAura} pts
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <ProgressRoot value={cat.percentage} className="w-full">
                      <ProgressTrack size="sm" className="h-1.5 bg-black border border-white/10">
                        <ProgressIndicator
                          className={cn(
                            "shadow-[0_0_8px_rgba(255,16,24,0.35)]",
                            cat.percentage >= 90
                              ? "bg-gradient-to-r from-red-500 via-[#ff1018] to-red-400"
                              : cat.percentage >= 60
                              ? "bg-gradient-to-r from-red-600 to-[#ff1018]"
                              : cat.percentage >= 35
                              ? "bg-gradient-to-r from-red-700 to-red-600"
                              : "bg-red-950/70"
                          )}
                        />
                      </ProgressTrack>
                    </ProgressRoot>

                    {/* Next Milestone Note */}
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1.5">
                      <span>{cat.percentage}% completed</span>
                      {cat.nextMilestone ? (
                        <span>
                          {cat.nextMilestone.remaining} more topic
                          {cat.nextMilestone.remaining !== 1 ? "s" : ""} to unlock{" "}
                          <strong className="text-white">{cat.nextMilestone.tier}</strong> (+
                          {cat.nextMilestone.points} Aura)
                        </span>
                      ) : (
                        <span className="text-yellow-400 font-bold">
                          &starf; All Category Badges Unlocked!
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </TabsPanel>

            {/* TAB 4: DAILY STREAK */}
            <TabsPanel value="streak" animated className="pt-0 space-y-6 text-white focus-visible:ring-0">
              <div className="space-y-5">
              <div className="p-5 rounded-xl border border-white/10 bg-black text-center space-y-3">
                <div className="flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-[#0a0a0c]">
                    <Flame className="w-8 h-8 text-[#ff1018]" animateOnHover />
                  </div>
                </div>

                <h3 className="text-lg font-black text-white font-mono">
                  {dailyStreak.currentStreak} DAY STREAK
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Log in daily to keep your streak burning and claim compounding Aura points.
                  Formula: <strong>25 base + (5 &times; streak) Aura</strong> every day.
                </p>

                {claimError && <p role="alert" className="pt-2 text-xs text-rose-300">{claimError}</p>}

                <div className="pt-2">
                  <SmoothButton
                    variant="solid"
                    color="accent"
                    size="lg"
                    onClick={handleClaimStreak}
                    disabled={!dailyStreak.canClaimToday || claimPending || !isSignedIn}
                    className="rounded-xl px-6 font-bold text-xs"
                  >
                    {claimPending ? (
                      <><Sparkles className="w-4 h-4" /><span>Claiming…</span></>
                    ) : dailyStreak.canClaimToday ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Today&apos;s +{dailyStreak.todayReward} Aura</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Claimed Today (+{dailyStreak.todayReward} pts)</span>
                      </>
                    )}
                  </SmoothButton>
                </div>
              </div>

              {/* Streak Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-white/10 bg-[#0a0a0c] text-center">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Current Streak
                  </div>
                  <div className="text-xl font-black font-mono text-white mt-1">
                    {dailyStreak.currentStreak} <span className="text-xs font-normal text-zinc-400">days</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-[#0a0a0c] text-center">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Best Record
                  </div>
                  <div className="text-xl font-black font-mono text-white mt-1">
                    {dailyStreak.bestStreak} <span className="text-xs font-normal text-zinc-400">days</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-white/10 bg-[#0a0a0c] text-center">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Total Streak Aura
                  </div>
                  <div className="text-xl font-black font-mono text-amber-400 mt-1">
                    +{dailyStreak.totalStreakAura.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            </TabsPanel>

            {/* TAB 5: ALL 8 RANKS / TIERS */}
            <TabsPanel value="tiers" animated className="pt-0 space-y-6 text-white focus-visible:ring-0">
              <div className="space-y-3">
              <div className="pb-2 border-b border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  The 8 Authentic Ranks & Thresholds
                </h3>
                <p className="text-xs text-zinc-400">
                  Every tier reached represents tangible algorithmic prowess and dedication.
                </p>
              </div>

              <div className="space-y-2">
                {AURA_TIERS.map((tier) => {
                  const isCurrent = currentTier.id === tier.id;
                  const isPassed = totalAura >= tier.minAura;

                  return (
                    <div
                      key={tier.id}
                      className={cn(
                        "p-3.5 rounded-xl border transition-all flex items-center justify-between",
                        isCurrent
                          ? "border-[#ff1018] bg-black shadow-lg"
                          : isPassed
                          ? "border-white/10 bg-[#0a0a0c]"
                          : "border-white/5 bg-[#050508] opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black shrink-0 overflow-hidden">
                          <Image
                            src={tier.badgeAsset}
                            alt={tier.name}
                            width={30}
                            height={30}
                            className="object-contain"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs font-bold font-mono", tier.titleColor)}>
                              {tier.name.toUpperCase()}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#ff1018] text-white">
                                Current Rank
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {tier.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          {tier.minAura.toLocaleString()}
                          {tier.maxAura ? ` – ${tier.maxAura.toLocaleString()}` : "+"}
                        </div>
                        <div className="text-[10px] text-zinc-400 uppercase">
                          Aura Required
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </TabsPanel>
          </div>
        </TabsRoot>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0a0a0c] flex items-center justify-between text-xs">
          <span className="text-zinc-400">
            Current Tier: <strong className="text-white">{currentTier.name}</strong> &bull; Total:{" "}
            <strong className="text-[#ff1018] font-mono">{totalAura.toLocaleString()} Aura</strong>
          </span>
          <SmoothButton
            variant="outline"
            color="neutral"
            size="sm"
            onClick={onClose}
            className="rounded-xl border-white/10 bg-black text-white hover:bg-white/10 text-xs font-semibold"
          >
            Close
          </SmoothButton>
        </div>
      </div>
    </div>
  );
}
