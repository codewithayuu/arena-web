"use client";

import { PlatformConnections } from "./platform-connections";
import {
  FaMedal,
  FaBolt,
  FaChartLine,
  FaCode,
  FaTrophy,
  FaStar,
  FaEye,
} from "react-icons/fa";
import {
  MdViewModule,
  MdCalendarViewMonth,
} from "react-icons/md";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { ALL_TOPICS } from "@/lib/topic-list-data";
import {
  useAuraEngine,
  calculateUserLevel,
  getTopicsForNextLevel,
  AURA_TIERS,
} from "@/lib/aura-system";

function InfoIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="11" />
      <line x1="11.959" x2="11.959" y1="11" y2="17" />
      <circle cx="11.959" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface AuthenticStatsGridProps {
  completedTopics: string[];
  totalProblemsCount?: number;
  onOpenTopicGrid?: () => void;
  onOpenHeatmap?: () => void;
  onOpenAuraModal?: () => void;
}

export function AuthenticStatsGrid({
  completedTopics,
  totalProblemsCount = 3888,
  onOpenTopicGrid,
  onOpenHeatmap,
  onOpenAuraModal,
}: AuthenticStatsGridProps) {
  const { breakdown } = useAuraEngine();
  const totalTopicsCount = ALL_TOPICS.length;
  const completedCount = completedTopics.length;
  const progressPercentage = Math.round((completedCount / totalTopicsCount) * 100);

  // Level and tier calculations use the topic-list progress model.
  const userLevel = calculateUserLevel(completedCount);
  const topicsRemaining = getTopicsForNextLevel(completedCount);
  const totalStepForLevel = userLevel < 10 ? userLevel + 1 : 10;
  const completedInLevel = totalStepForLevel - topicsRemaining;
  const totalDots = Math.min(totalStepForLevel, 10);

  const {
    totalAura,
    currentTier,
    nextTier,
    pointsToNextTier,
    tierProgressPercent,
    categoryBadges,
    problemsSolved,
  } = breakdown;

  // Rank is unavailable until backed by server-authoritative member data.
  const userRank: string | null = null;

  return (
    <div className="space-y-3 text-white">
      {/* 8-Card Solid AMOLED Grid (2 Columns x 4 Rows) */}
      {/* Strictly NO ugly colour translucent boxes - Solid #0a0a0c with subtle borders */}
      <div className="grid grid-cols-2 gap-2">
        {/* 1. TIER Card */}
        <div
          onClick={onOpenAuraModal}
          className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaMedal className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Tier
              </span>
            </div>
            <SimpleTooltip
              content={
                <div className="text-xs space-y-1 p-1 max-w-xs">
                  <div className="font-bold text-white mb-1">Achievement Tier</div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                    Earn Aura by completing topics, solving problems, and contest ratings.
                  </div>
                  <div className="pt-1 border-t border-white/10 text-[10px] text-zinc-400 space-y-0.5">
                    {AURA_TIERS.map((t) => (
                      <div key={t.id} className="flex justify-between">
                        <span>{t.symbol} {t.name}</span>
                        <span className="font-mono text-zinc-300">{t.minAura.toLocaleString()}+</span>
                      </div>
                    ))}
                  </div>
                </div>
              }
              side="top"
              delayDuration={150}
            >
              <button
                type="button"
                className="text-zinc-500 hover:text-white transition-colors cursor-help p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAuraModal?.();
                }}
              >
                <InfoIcon className="w-3 h-3" />
              </button>
            </SimpleTooltip>
          </div>

          <div className="mt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base leading-none">{currentTier.symbol}</span>
              <span className="text-sm font-bold text-sky-400 font-sans tracking-tight">
                {currentTier.name}
              </span>
            </div>

            {/* Small Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(5, tierProgressPercent)}%` }}
              />
            </div>

            {/* Subtitle */}
            <div className="text-[10px] text-sky-400/90 font-medium mt-1 truncate">
              {nextTier ? `${pointsToNextTier.toLocaleString()} Aura to next tier!` : "Apex Tier Reached!"}
            </div>
          </div>
        </div>

        {/* 2. LEVEL Card */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaBolt className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Level
              </span>
            </div>
            <SimpleTooltip
              content={
                <div className="text-xs p-1 max-w-xs space-y-1">
                  <div className="font-bold text-white">Progression Level</div>
                  <div className="text-[11px] text-zinc-300 leading-relaxed">
                    Earned by completing topics. Levels 1-10 require increasing topics, then every 10 topics = 1 level.
                  </div>
                  <div className="pt-1 text-[10px] text-purple-300 font-mono">
                    Currently Level {userLevel}. {topicsRemaining} more to reach Level {userLevel + 1}!
                  </div>
                </div>
              }
              side="top"
              delayDuration={150}
            >
              <button type="button" className="text-zinc-500 hover:text-white transition-colors cursor-help p-0.5">
                <InfoIcon className="w-3 h-3" />
              </button>
            </SimpleTooltip>
          </div>

          <div className="mt-0.5">
            <div className="text-xl font-bold font-sans text-white leading-tight">
              {userLevel}
            </div>

            {/* Dots step indicator */}
            <div className="flex items-center gap-1 mt-1.5">
              {Array.from({ length: totalDots }).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx < completedInLevel
                      ? "bg-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.5)]"
                      : "bg-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Subtitle */}
            <div className="text-[10px] text-purple-400 font-medium mt-1 truncate">
              {completedInLevel} of {totalStepForLevel} to next level!
            </div>
          </div>
        </div>

        {/* 3. TOPICS Card */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaChartLine className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Topics
              </span>
            </div>
            <SimpleTooltip content="Click to view topic distribution" side="top" delayDuration={150}>
              <button
                type="button"
                onClick={onOpenTopicGrid}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-0.5"
              >
                <FaEye className="w-3 h-3" />
              </button>
            </SimpleTooltip>
          </div>

          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-sans text-white leading-tight">
              {completedCount}
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              of {totalTopicsCount}
            </span>
          </div>
        </div>

        {/* 4. PROBLEMS Card */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaCode className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Problems
              </span>
            </div>
          </div>

          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-sans text-white leading-tight">
              {problemsSolved.count}
            </span>
            <span className="text-xs text-zinc-400 font-sans">
              of {totalProblemsCount}
            </span>
          </div>
        </div>

        {/* 5. AURA Card */}
        <div
          onClick={onOpenAuraModal}
          className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaStar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Aura
              </span>
            </div>
            <SimpleTooltip content="Click to view Aura Farming breakdown" side="top" delayDuration={150}>
              <button
                type="button"
                className="text-zinc-500 hover:text-white transition-colors cursor-help p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAuraModal?.();
                }}
              >
                <InfoIcon className="w-3 h-3" />
              </button>
            </SimpleTooltip>
          </div>

          <div className="mt-1">
            <div className="text-xl font-bold font-sans text-white leading-tight group-hover:text-amber-400 transition-colors">
              {totalAura.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 6. RANK Card */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaTrophy className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Rank
              </span>
            </div>
          </div>

          <div className="mt-1">
            <div className="text-xl font-bold font-sans text-white leading-tight">
              {userRank ? `#${userRank}` : "—"}
            </div>
          </div>
        </div>

        {/* 7. BADGES Card */}
        <div
          onClick={onOpenAuraModal}
          className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaMedal className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Badges
              </span>
            </div>
            <SimpleTooltip content="Click to view all available badges" side="top" delayDuration={150}>
              <button
                type="button"
                className="text-zinc-500 hover:text-white transition-colors cursor-help p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAuraModal?.();
                }}
              >
                <InfoIcon className="w-3 h-3" />
              </button>
            </SimpleTooltip>
          </div>

          <div className="mt-1">
            {categoryBadges.totalBadges > 0 ? (
              <div className="flex items-center gap-1 text-sm font-bold font-sans text-white">
                <span>🎖️ {categoryBadges.totalBadges}</span>
              </div>
            ) : (
              <div className="text-xl font-bold font-sans text-zinc-500 leading-tight">
                —
              </div>
            )}
          </div>
        </div>

        {/* 8. PROGRESS Card */}
        <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-2.5 shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <FaChartLine className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Progress
              </span>
            </div>
          </div>

          <div className="mt-1">
            <div className="text-xl font-bold font-sans text-white leading-tight">
              {progressPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: [ Topic Grid ] & [ Heatmap ] */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={onOpenTopicGrid}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-[#0a0a0c] hover:bg-white/[0.06] hover:border-white/20 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <MdViewModule className="w-4 h-4 text-zinc-400" />
          <span>Topic Grid</span>
        </button>

        <button
          type="button"
          onClick={onOpenHeatmap}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/10 bg-[#0a0a0c] hover:bg-white/[0.06] hover:border-white/20 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <MdCalendarViewMonth className="w-4 h-4 text-zinc-400" />
          <span>Heatmap</span>
        </button>
      </div>

      <PlatformConnections />
    </div>
  );
}
