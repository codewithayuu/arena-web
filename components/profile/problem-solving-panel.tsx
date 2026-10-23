"use client";

import React, { useState, useMemo } from "react";
import { UserProfileData, PlatformProfile } from "@/lib/profile-data";
import {
  TrendingUp,
  Info,
  CreditCard,
  Share2,
} from "lucide-react";
import {
  CircleCheck,
  Flame,
  Award,
  Layers,
  ExternalLink,
  ChevronRight,
  Calendar,
  Sparkles,
  Trophy,
  Check,
  Code,
} from "@/components/animate-ui/icons";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { getPlatformIconPath, VerifiedSealBadge } from "./verified-badge";
import SmoothButton from "@/components/smoothui/smooth-button";
import { ContestRatingApexChart } from "./contest-rating-apex-chart";
import { ProblemSolvingVelocityApexChart } from "./problem-solving-velocity-apex-chart";

interface ProblemSolvingPanelProps {
  profile: UserProfileData;
  onOpenConnect: () => void;
}

const HIDDEN_PROFILE_STAT_KEYS = new Set([
  "activityByDay", "activityKind", "activityHistoryTruncated", "activityWindowDays", "badges",
  "contestHistory", "currentRating", "difficultyStats", "languages", "publicActivityByDay", "publicActivityAvailable",
  "publicActivityEventLimit", "publicActivityWindowDays", "topRepos", "topicDistribution",
  "totalQuestionsSolved",
]);

function visiblePlatformMetrics(stats: Record<string, unknown> | undefined): Array<[string, string | number]> {
  if (!stats) return [];
  return Object.entries(stats).flatMap(([key, value]) => {
    if (key === "acceptedByLanguage" && Array.isArray(value)) {
      const summary = value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        return typeof row.language === "string" && typeof row.accepted === "number" ? [`${row.language}: ${row.accepted}`] : [];
      }).join(", ");
      return summary ? [["Accepted by language", summary] as [string, string]] : [];
    }
    if (HIDDEN_PROFILE_STAT_KEYS.has(key) || typeof value === "boolean" || value === null || value === undefined) return [];
    if (typeof value !== "string" && typeof value !== "number") return [];
    if (typeof value === "number" && !Number.isFinite(value)) return [];
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
    return [[label, value] as [string, string | number]];
  }).slice(0, 8);
}

export function ProblemSolvingPanel({ profile, onOpenConnect }: ProblemSolvingPanelProps) {
  const [selectedContestPlatform, setSelectedContestPlatform] = useState<string>("all");
  const [selectedBadgePlatform, setSelectedBadgePlatform] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [chartViewMode, setChartViewMode] = useState<"rating" | "velocity">("rating");

  // Compute aggregate difficulty stats
  let totalEasy = 0;
  let totalMedium = 0;
  let totalHard = 0;
  let totalBasic = 0;

  profile.platforms.forEach((p) => {
    if (p.difficultyStats) {
      totalEasy += p.difficultyStats.easy || 0;
      totalMedium += p.difficultyStats.medium || 0;
      totalHard += p.difficultyStats.hard || 0;
      totalBasic += (p.difficultyStats.basic || 0) + (p.difficultyStats.school || 0);
    }
  });

  const totalCalculated = totalEasy + totalMedium + totalHard + totalBasic || 1;
  const hasDifficultyData = profile.platforms.some((platform) => platform.difficultyStats !== undefined);
  const easyPct = Math.round((totalEasy / totalCalculated) * 100);
  const medPct = Math.round((totalMedium / totalCalculated) * 100);
  const hardPct = Math.round((totalHard / totalCalculated) * 100);

  // A calendar year view built from the synced per-platform activity records.
  const heatmapDays = useMemo(() => {
    const firstDay = Date.UTC(selectedYear, 0, 1);
    const start = firstDay - new Date(firstDay).getUTCDay() * 86_400_000;
    return Array.from({ length: 371 }, (_, index) => {
      const date = new Date(start + index * 86_400_000).toISOString().slice(0, 10);
      return [date, date.startsWith(`${selectedYear}-`) ? profile.submissionHeatmap[date] ?? 0 : 0] as const;
    });
  }, [profile.submissionHeatmap, selectedYear]);

  const totalActivityEvents = useMemo(() => {
    return Object.entries(profile.submissionHeatmap)
      .filter(([date]) => date.startsWith(`${selectedYear}-`))
      .reduce((total, [, count]) => total + count, 0);
  }, [profile.submissionHeatmap, selectedYear]);

  // Filtered contests for chart
  const contestPlatformConfigs: Record<string, { label: string; color: string }> = {
    leetcode: { label: "LeetCode", color: "#f59e0b" },
    codeforces: { label: "Codeforces", color: "#38bdf8" },
    codechef: { label: "CodeChef", color: "#f97316" },
    atcoder: { label: "AtCoder", color: "#94a3b8" },
  };

  const filteredContests = useMemo(() => {
    if (selectedContestPlatform === "all") return profile.contests;
    return profile.contests.filter((c) => c.platform === selectedContestPlatform);
  }, [profile.contests, selectedContestPlatform]);

  const sortedContests = useMemo(() => {
    return [...filteredContests].sort((a, b) => a.contestDate - b.contestDate);
  }, [filteredContests]);

  const minRating = Math.min(...sortedContests.map((c) => c.rating), 300);
  const maxRating = Math.max(...sortedContests.map((c) => c.rating), 1600);
  const ratingRange = maxRating - minRating || 1;

  const chartWidth = 680;
  const chartHeight = 220;
  const padX = 40;
  const padY = 25;

  const chartPoints = sortedContests.map((c, i) => {
    const x = padX + (i / Math.max(1, sortedContests.length - 1)) * (chartWidth - padX * 2);
    const y = chartHeight - padY - ((c.rating - minRating) / ratingRange) * (chartHeight - padY * 2);
    return { x, y, contest: c };
  });

  const chartPolyline = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Filtered badges
  const filteredBadges = useMemo(() => {
    if (selectedBadgePlatform === "all") return profile.badges;
    return profile.badges.filter((b) => b.platform.toLowerCase() === selectedBadgePlatform.toLowerCase());
  }, [profile.badges, selectedBadgePlatform]);

  // Topic distribution sorted
  const topTopics = useMemo(() => {
    return Object.entries(profile.topicDistribution).sort(([, a], [, b]) => b - a);
  }, [profile.topicDistribution]);

  const maxTopicCount = topTopics[0]?.[1] || 1;

  // Donut SVG parameters
  const donutSize = 150;
  const strokeWidth = 14;
  const radius = (donutSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const easyDash = (easyPct / 100) * circumference;
  const medDash = (medPct / 100) * circumference;
  const hardDash = (hardPct / 100) * circumference;
  const otherDash = Math.max(0, circumference - easyDash - medDash - hardDash);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* ========================================================
          1. TOP BANNER: Questions Solved, Active Days & Heatmap
          (Exact Codolio tE Layout: 2-col stats + 3-col calendar)
          ======================================================== */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left Stats Cards (2 Columns) */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            {/* Box 1: Questions Solved */}
            <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-4 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Code className="w-4 h-4 text-[#ff1018]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Questions Solved
                  </span>
                </div>
                <SimpleTooltip content="Total Questions calculated using data from all linked platforms">
                  <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
                </SimpleTooltip>
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-baseline gap-1.5 tabular-nums">
                  <span>{profile.totalQuestionsSolved ?? "—"}</span>
                  <span className="text-xs font-mono font-normal text-zinc-400">problems</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-emerald-400 mt-1 flex items-center gap-1">
                  <CircleCheck className="w-3 h-3" />
                  <span>Across {profile.platforms.length} linked platforms</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Provider-reported solved totals; platform counts may overlap</span>
            </div>

            {/* Box 2: Active Days */}
            <div className="rounded-xl border border-white/10 bg-[#0a0a0c] p-4 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Flame className="w-4 h-4 text-[#ff1018]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Active Days
                  </span>
                </div>
              </div>
              <div className="my-2">
                <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight flex items-baseline gap-1 tabular-nums">
                  <span>{profile.totalActiveDays || "—"}</span>
                  <span className="text-xs font-normal text-zinc-400 font-sans">d</span>
                </div>
                <div className="text-[11px] font-mono font-medium text-amber-400 mt-1 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>{profile.currentStreak === null ? "Streak unavailable" : `LeetCode current streak: ${profile.currentStreak}d`}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Distinct days found in synced activity history</span>
            </div>
          </div>

          {/* Right Heatmap Calendar (3 Columns) */}
          <div className="lg:col-span-3 rounded-xl border border-white/10 bg-[#0d0d12] p-4 flex flex-col justify-between overflow-hidden">
            {/* Calendar Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ff1018]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Coding Activity
                </span>
                <span className="text-[11px] font-mono font-semibold text-zinc-400">
                  ({totalActivityEvents.toLocaleString()} provider-reported events)
                </span>
              </div>

              {/* Year Toggle & Streaks */}
              <div className="flex items-center gap-1.5">
                {[new Date().getFullYear(), new Date().getFullYear() - 1].map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => setSelectedYear(year)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      selectedYear === year
                        ? "bg-[#ff1018] text-white"
                        : "bg-black text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar year contribution grid */}
            <div className="overflow-x-auto no-scrollbar py-3">
              <div className="flex gap-1 min-w-[560px]">
                {Array.from({ length: 53 }).map((_, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, rowIdx) => {
                      const dayIdx = colIdx * 7 + rowIdx;
                      const dayData = heatmapDays[dayIdx];
                      const count = dayData ? dayData[1] : 0;
                      const dateStr = dayData ? dayData[0] : "";

                      let bgClass = "bg-[#18181f]";
                      if (count > 0 && count <= 2) bgClass = "bg-emerald-950 border border-emerald-800 text-emerald-300";
                      else if (count > 2 && count <= 5) bgClass = "bg-emerald-700 text-emerald-100";
                      else if (count > 5) bgClass = "bg-emerald-400 text-black";

                      return (
                        <SimpleTooltip key={rowIdx} content={`${count} activity events on ${dateStr || "N/A"}`}>
                          <div
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] transition-transform hover:scale-125 cursor-pointer ${bgClass}`}
                          />
                        </SimpleTooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-zinc-500">Daily events combine submission histories from Codeforces, LeetCode, and AtCoder with solved-task dates from GeeksforGeeks. A problem active on multiple sites can contribute more than once.</p>

            {/* Calendar Footer Legend */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>LeetCode current streak: <strong>{profile.currentStreak === null ? "unavailable" : `${profile.currentStreak} days`}</strong></span>
              </span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                <div className="w-2.5 h-2.5 rounded-[2px] bg-[#18181f]" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950 border border-emerald-800" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-700" />
                <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MAIN STACKING: 55% Left Column + 45% Right Column
          (Exact Codolio Problem Solving Layout)
          ======================================================== */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* ==========================================
            LEFT COLUMN (55% Width)
            - 1. Contest Rating Chart (tF)
            - 2. Earned Badges Showcase (eJ)
            - 3. Topic Analysis Bars (tI)
            ========================================== */}
        <div className="w-full lg:w-[55%] flex flex-col gap-4">
          {/* Card 1: Contest Rating Progression Chart */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
            {/* Header with Platform Filters & View Toggle */}
            <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#ff1018]" />
                    <span>{chartViewMode === "rating" ? "Contest Rating Progression" : "Monthly Submission Velocity"}</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {chartViewMode === "rating"
                      ? "Interactive ApexChart with milestone annotations & peak markers"
                      : "Aggregated monthly problem solving pace & velocity peaks"}
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-[#0d0d12] border border-white/10 rounded-xl self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setChartViewMode("rating")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      chartViewMode === "rating"
                        ? "bg-[#ff1018] text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Rating Curve
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewMode("velocity")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      chartViewMode === "velocity"
                        ? "bg-[#ff1018] text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Velocity
                  </button>
                </div>
              </div>

              {/* Platform Filters (Shown in Rating view) */}
              {chartViewMode === "rating" && (
                <div className="flex flex-wrap items-center gap-1 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedContestPlatform("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedContestPlatform === "all"
                        ? "bg-[#ff1018] text-white"
                        : "bg-[#111116] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    All Platforms
                  </button>
                  {Object.entries(contestPlatformConfigs).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedContestPlatform(key)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedContestPlatform === key
                          ? "bg-[#16161c] text-white border border-white/20"
                          : "bg-[#111116] text-zinc-400 hover:text-white border border-white/10"
                      }`}
                    >
                      <img
                        src={getPlatformIconPath(key)}
                        alt={cfg.label}
                        className="w-3.5 h-3.5 object-contain shrink-0"
                      />
                      <span>{cfg.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ApexCharts Interactive Visualization */}
            <div className="w-full">
              {chartViewMode === "rating" ? (
                <ContestRatingApexChart
                  contests={profile.contests}
                  selectedPlatform={selectedContestPlatform}
                  height={270}
                  showAnnotations={true}
                />
              ) : (
                <ProblemSolvingVelocityApexChart
                  heatmap={profile.submissionHeatmap}
                  height={270}
                />
              )}
            </div>

            {/* Rating Highlights Footer */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs text-zinc-400 font-mono mt-2">
              <div className="p-2 rounded-xl bg-[#0d0d12] border border-white/10 flex items-center justify-between">
                <span>Provider peak ratings:</span>
                <span className="font-bold text-emerald-400 text-sm">{profile.platforms.filter((p) => typeof p.maxRating === "number").map((p) => `${p.name} ${p.maxRating}`).join(" · ") || "Unavailable"}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#0d0d12] border border-white/10 flex items-center justify-between">
                <span>Provider ranks:</span>
                <span className="font-bold text-amber-400 text-sm">{profile.platforms.filter((p) => p.rank !== undefined).map((p) => `${p.name} ${p.rank}`).join(" · ") || "Unavailable"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Earned Badges Showcase */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Earned Badges</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Official medals & ranking achievements</p>
              </div>

              {/* Platform Filters */}
              <div className="flex items-center gap-1">
                {["all", "LeetCode", "CodeChef", "CodeStudio"].map((pKey) => (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => setSelectedBadgePlatform(pKey)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedBadgePlatform.toLowerCase() === pKey.toLowerCase()
                        ? "bg-[#ff1018] text-white"
                        : "bg-[#111116] text-zinc-400 hover:text-white border border-white/10"
                    }`}
                  >
                    {pKey === "all" ? "All" : pKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {filteredBadges.length === 0 && <p className="col-span-full rounded-xl border border-white/10 bg-[#0d0d12] p-4 text-center text-xs text-zinc-400">No badge records are available for this provider filter.</p>}
              {filteredBadges.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl border border-white/10 bg-[#0d0d12] hover:border-white/20 hover:bg-[#121218] transition-all flex flex-col items-center text-center group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-xl bg-black border border-white/10 flex items-center justify-center p-1.5 mb-2 group-hover:scale-110 transition-transform">
                    {b.icon ? (
                      <img src={b.icon} alt={b.badgeName} className="w-full h-full object-contain drop-shadow" />
                    ) : (
                      <Award className="w-7 h-7 text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white line-clamp-1">{b.badgeName}</span>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400 font-mono">
                    <img
                      src={getPlatformIconPath(b.platform)}
                      alt={b.platform}
                      className="w-3 h-3 object-contain shrink-0"
                    />
                    <span>{b.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Topic Analysis */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ff1018]" />
                  <span>Topic Analysis</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Provider-reported topic totals; a problem can be counted on multiple sites</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {topTopics.length} Topics
              </span>
            </div>

            <div className="space-y-2.5">
              {topTopics.length === 0 && <p className="rounded-xl border border-white/10 bg-[#0d0d12] p-4 text-xs text-zinc-400">Topic history is unavailable from the connected providers.</p>}
              {topTopics.map(([topic, count]) => {
                const pct = Math.round((count / maxTopicCount) * 100);
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-zinc-200">{topic}</span>
                      <span className="font-bold text-white">{count} solved</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#18181f] overflow-hidden border border-white/10">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-gradient-to-r from-[#ff1018] to-red-400 rounded-full transition-all"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN (45% Width)
            - 1. Question Distribution Donut & Table (e8)
            - 2. Contest Rankings Cards (tb)
            - 3. Digital Arena Scorecard Preview
            ========================================== */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Card 1: Question Distribution Donut & Breakdown Table */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <CircleCheck className="w-4 h-4 text-[#ff1018]" />
                  <span>Question Distribution</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Provider-reported difficulty counts; totals may overlap between sites</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                ({profile.totalQuestionsSolved ?? "—"} Total)
              </span>
            </div>

            {/* Circular Donut Display */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
              <div className="relative flex items-center justify-center">
                <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke="#18181f"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Easy Arc */}
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke="#10b981"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${easyDash} ${circumference}`}
                    strokeDashoffset="0"
                  />
                  {/* Medium Arc */}
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${medDash} ${circumference}`}
                    strokeDashoffset={-easyDash}
                  />
                  {/* Hard Arc */}
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={`${hardDash} ${circumference}`}
                    strokeDashoffset={-(easyDash + medDash)}
                  />
                </svg>

                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black font-mono text-white leading-none">
                    {profile.totalQuestionsSolved ?? "—"}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
                    Solved
                  </span>
                </div>
              </div>

              {/* Difficulty Legend Badges */}
              <div className="space-y-2 w-full sm:w-48">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-xs hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Easy</span>
                  </div>
                  <span className="font-mono text-xs inline-flex items-baseline gap-1">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalEasy : "—"}</strong>
                    <span className="text-zinc-400 font-normal">({hasDifficultyData ? `${easyPct}%` : "unavailable"})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-xs hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Medium</span>
                  </div>
                  <span className="font-mono text-xs inline-flex items-baseline gap-1">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalMedium : "—"}</strong>
                    <span className="text-zinc-400 font-normal">({hasDifficultyData ? `${medPct}%` : "unavailable"})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 text-xs hover:border-white/20 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Hard</span>
                  </div>
                  <span className="font-mono text-xs inline-flex items-baseline gap-1">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalHard : "—"}</strong>
                    <span className="text-zinc-400 font-normal">({hasDifficultyData ? `${hardPct}%` : "unavailable"})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Difficulty Breakdown Table */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Platform Breakdown
              </div>

              <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#0d0d12]">
                {profile.platforms
                  .filter((p) => p.isConnected && ((p.totalQuestionsSolved ?? 0) > 0 || Object.keys(p.profileStats ?? {}).length > 0))
                  .map((p) => (
                    <div key={p.platform} className="p-2.5 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={getPlatformIconPath(p.platform)} alt={p.name} className="w-4 h-4 object-contain shrink-0" />
                          <span className="font-semibold text-white truncate">{p.name}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                          {p.difficultyStats && <span className="text-zinc-400 hidden sm:inline"><span className="text-emerald-400">{p.difficultyStats.easy}E</span> / <span className="text-amber-400">{p.difficultyStats.medium}M</span> / <span className="text-rose-400">{p.difficultyStats.hard}H</span></span>}
                          {(p.totalQuestionsSolved ?? 0) > 0 && <span className="font-bold text-white">{p.totalQuestionsSolved} Solved</span>}
                          {p.currentRating !== undefined && <span className="text-zinc-300">Rating {p.currentRating}</span>}
                          {p.totalQuestionsSolved === null && p.currentRating === undefined && <span className="text-zinc-500">Stats synced</span>}
                        </div>
                      </div>
                      {visiblePlatformMetrics(p.profileStats).length > 0 && <div className="mt-1 ml-6 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400">{visiblePlatformMetrics(p.profileStats).map(([label, value]) => <span key={label}>{label}: <strong className="text-zinc-200">{value}</strong></span>)}</div>}
                    </div>
                  ))}
                {profile.platforms.length === 0 && <p className="p-3 text-xs text-center text-zinc-400">No platform accounts are connected yet.</p>}
              </div>
            </div>
          </div>

          {/* Card 2: Contest Rankings */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#facc15]" />
                  <span>Contest Rankings</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Competitive ratings & division tiers</p>
              </div>
              <span className="text-xs font-mono font-bold text-zinc-400">
                {profile.contests.length} Contests
              </span>
            </div>

            <div className="space-y-2">
              {profile.platforms
                .filter((p) => p.currentRating !== undefined || p.rank)
                .map((p) => (
                  <div
                    key={p.platform}
                    className="p-3 rounded-xl border border-white/10 bg-[#0d0d12] flex items-center justify-between hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={getPlatformIconPath(p.platform)}
                        alt={p.name}
                        className="w-4 h-4 object-contain"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <span>{p.name}</span>
                          {p.isVerified && <VerifiedSealBadge className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {p.contestCount ? `${p.contestCount} Contests` : "Active"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-sm font-black text-white">
                        {p.currentRating !== undefined ? p.currentRating : p.rank}
                      </div>
                      {p.maxRating && (
                        <div className="text-[10px] text-zinc-400">
                          Max: <span className="text-[#38bdf8] font-bold">{p.maxRating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Card 3: Holographic Arena Scorecard Preview */}
          <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/10">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff1018]" />
                <span>Arena Scorecard</span>
              </span>
              <button
                type="button"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="text-[11px] font-bold text-[#ff4452] hover:underline cursor-pointer"
              >
                {isCardFlipped ? "Flip Front" : "Flip Back"} &rarr;
              </button>
            </div>

            {/* Interactive 3D Card */}
            <div className="perspective-[1000px] w-full my-2">
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className={`w-full h-[180px] rounded-xl relative transition-transform duration-700 transform-gpu cursor-pointer select-none ${
                  isCardFlipped ? "rotate-y-180" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front of Card */}
                <div
                  className={`absolute inset-0 rounded-xl p-4 border border-zinc-700 bg-gradient-to-br from-[#1c1c24] via-[#121218] to-[#0a0a0d] shadow-2xl flex flex-col justify-between overflow-hidden ${
                    isCardFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <img
                    src="/images/badges/grid.svg"
                    alt="Grid"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-black tracking-wider text-white">MINDFLARE ARENA</span>
                    {profile.isVerified && <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                      <VerifiedSealBadge className="w-3.5 h-3.5 text-emerald-400" />
                      <span>VERIFIED</span>
                    </span>}
                  </div>

                  <div className="relative z-10 flex items-center gap-2.5 my-auto">
                    <img
                      src={profile.personalDetails.imageUrl || "/images/mindflare_m_logo.svg"}
                      alt={profile.firstName}
                      className="w-10 h-10 rounded-full border border-zinc-600 object-cover"
                    />
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1">
                        <span>{profile.firstName} {profile.secondName}</span>
                        {profile.isVerified && <VerifiedSealBadge className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">@{profile.username}</div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] font-mono">
                    <span className="text-zinc-400">SOLVED: <strong className="text-white">{profile.totalQuestionsSolved ?? "—"}</strong></span>
                    <span className="text-zinc-400">ACTIVE: <strong className="text-[#38bdf8]">{profile.totalActiveDays === null ? "—" : `${profile.totalActiveDays}d`}</strong></span>
                    <span className="text-zinc-400">TIER: <strong className="text-[#facc15]">Unavailable</strong></span>
                  </div>
                </div>

                {/* Back of Card */}
                <div
                  className={`absolute inset-0 rounded-xl p-4 border border-zinc-700 bg-gradient-to-br from-[#15151c] to-[#09090c] shadow-2xl flex flex-col justify-between overflow-hidden ${
                    !isCardFlipped ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <img
                    src="/images/badges/grid.svg"
                    alt="Grid"
                    className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                  />
                  <div className="relative z-10 text-[11px] font-bold text-white uppercase tracking-wider">
                    Skills
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-1 my-auto">
                    {profile.problemSolvingTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#1c1c24] border border-zinc-700 text-[10px] font-mono font-bold text-zinc-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="relative z-10 text-[9px] text-zinc-500 font-mono">
                    Mindflare profile • ID: {profile.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Buttons */}
            <div className="flex gap-2 pt-2 border-t border-white/10 mt-2">
              <SmoothButton
                variant="outline"
                color="neutral"
                size="sm"
                onClick={handleCopyLink}
                className="w-full rounded-xl border-white/10 bg-[#141418] hover:bg-[#202026] text-zinc-200 hover:text-white font-semibold text-xs shadow-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Share Card"}</span>
              </SmoothButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
