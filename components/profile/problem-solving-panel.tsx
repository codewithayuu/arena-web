"use client";

import React, { useState, useMemo } from "react";
import { UserProfileData, PlatformProfile } from "@/lib/profile-data";
import {
  TrendingUp,
  Info,
  Calendar,
  Layers,
  Sparkles,
  Trophy,
  Award,
  CheckCircle2,
  Flame,
  Code2,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import HeatMap from "@uiw/react-heat-map";
import { getPlatformIconPath, VerifiedSealBadge } from "./verified-badge";
import { ContestRatingApexChart } from "./contest-rating-apex-chart";
import { ProblemSolvingVelocityApexChart } from "./problem-solving-velocity-apex-chart";

const ACTIVITY_PANEL_COLORS: Record<number, string> = {
  0: "#2a3038",
  1: "#a1aa6d",
  2: "#8cc665",
  3: "#44a340",
  4: "#1e6823",
};
const ACTIVITY_PANEL_COLOR_LEVELS = Object.values(ACTIVITY_PANEL_COLORS);

interface ProblemSolvingPanelProps {
  profile: UserProfileData;
  onOpenConnect: () => void;
  selectedPlatformFilter?: string;
}

export function ProblemSolvingPanel({
  profile,
  onOpenConnect,
  selectedPlatformFilter = "all",
}: ProblemSolvingPanelProps) {
  const [selectedContestPlatform, setSelectedContestPlatform] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [isAwardsModalOpen, setIsAwardsModalOpen] = useState<boolean>(false);
  const [selectedAwardsPlatform, setSelectedAwardsPlatform] = useState<string>("all");

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

  const totalCalculated = totalEasy + totalMedium + totalHard + totalBasic || (profile.totalQuestionsSolved ?? 0) || 1;
  const hasDifficultyData = profile.platforms.some((platform) => platform.difficultyStats !== undefined);
  const easyPct = Math.round((totalEasy / totalCalculated) * 100);
  const medPct = Math.round((totalMedium / totalCalculated) * 100);
  const hardPct = Math.round((totalHard / totalCalculated) * 100);

  // Use the same calendar heatmap library and palette as the topic-list activity view.
  const heatmapValues = useMemo(
    () =>
      Object.entries(profile.submissionHeatmap)
        .filter(([date, count]) => date.startsWith(String(selectedYear) + "-") && count > 0)
        .map(([date, count]) => ({ date: date.split("-").join("/"), count })),
    [profile.submissionHeatmap, selectedYear]
  );
  const heatmapRange = useMemo(
    () => ({
      startDate: new Date(selectedYear, 0, 1),
      endDate: new Date(selectedYear, 11, 31),
    }),
    [selectedYear]
  );
  const activityStreaks = useMemo(() => {
    const activityDays = Object.entries(profile.submissionHeatmap)
      .filter(
        ([date, count]) =>
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date) &&
          Number.isFinite(count) &&
          count > 0
      )
      .map(([date]) => Math.floor(Date.parse(date + "T00:00:00Z") / 86_400_000))
      .filter(Number.isFinite)
      .sort((left, right) => left - right);

    if (activityDays.length === 0) {
      return {
        currentStreak: profile.currentStreak,
        maxStreak: profile.maxStreak,
      };
    }

    let maxStreak = 0;
    let currentRun = 0;
    let previousDay: number | null = null;
    for (const day of activityDays) {
      currentRun = previousDay !== null && day === previousDay + 1 ? currentRun + 1 : 1;
      maxStreak = Math.max(maxStreak, currentRun);
      previousDay = day;
    }

    const now = new Date();
    const today = Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 86_400_000
    );
    const lastActiveDay = activityDays[activityDays.length - 1];

    return {
      currentStreak: lastActiveDay === today || lastActiveDay === today - 1 ? currentRun : 0,
      maxStreak,
    };
  }, [profile.currentStreak, profile.maxStreak, profile.submissionHeatmap]);

  const totalActivityEvents = useMemo(() => {
    return Object.entries(profile.submissionHeatmap)
      .filter(([date]) => date.startsWith(`${selectedYear}-`))
      .reduce((total, [, count]) => total + count, 0);
  }, [profile.submissionHeatmap, selectedYear]);

  // Contests
  const totalContests = profile.contests.length + profile.arenaContests.length;

  // Filtered contests for chart
  const contestPlatformConfigs: Record<string, { label: string }> = {
    leetcode: { label: "LeetCode" },
    codeforces: { label: "Codeforces" },
    codechef: { label: "CodeChef" },
    atcoder: { label: "AtCoder" },
  };

  // Badges
  const filteredBadges = useMemo(() => {
    if (selectedAwardsPlatform === "all") return profile.badges;
    return profile.badges.filter(
      (b) => b.platform.toLowerCase() === selectedAwardsPlatform.toLowerCase()
    );
  }, [profile.badges, selectedAwardsPlatform]);

  const pinnedBadges = useMemo(() => {
    return profile.badges.slice(0, 4);
  }, [profile.badges]);

  // Topic distribution sorted
  const topTopics = useMemo(() => {
    return Object.entries(profile.topicDistribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
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

  return (
    <div className="space-y-4 font-poppins">
      {/* ========================================================
          1. TOP BENTO ROW (5 Columns) — Solid AMOLED Black (Codolio 1:1)
          Questions Solved (1 col) + Active Days (1 col) + Heatmap (3 cols)
          ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Questions Solved */}
        <div className="col-span-1 rounded-xl border border-white/10 bg-black p-4 flex flex-col justify-between items-center text-center relative shadow-sm min-h-[170px]">
          <div className="absolute top-2.5 right-2.5">
            <SimpleTooltip content="Total questions solved across all linked platforms">
              <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </SimpleTooltip>
          </div>
          <div className="text-sm font-semibold text-zinc-400">
            Questions Solved
          </div>
          <div className="my-auto py-2">
            <span className="text-5xl font-extrabold font-sans text-white tracking-tight tabular-nums">
              {profile.totalQuestionsSolved ?? "—"}
            </span>
          </div>
          <div className="text-[11px] font-medium text-zinc-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Across {profile.platforms.length} linked platforms</span>
          </div>
        </div>

        {/* Card 2: Active Days */}
        <div className="col-span-1 rounded-xl border border-white/10 bg-black p-4 flex flex-col justify-between items-center text-center relative shadow-sm min-h-[170px]">
          <div className="absolute top-2.5 right-2.5">
            <SimpleTooltip content="Total active days calculated from synced activity history">
              <Info className="w-3.5 h-3.5 text-zinc-500 hover:text-white cursor-pointer transition-colors" />
            </SimpleTooltip>
          </div>
          <div className="text-sm font-semibold text-zinc-400">
            Active Days
          </div>
          <div className="my-auto py-2">
            <span className="text-5xl font-extrabold font-sans text-white tracking-tight tabular-nums">
              {profile.totalActiveDays ?? "—"}
            </span>
          </div>
          <div className="text-[11px] font-medium text-zinc-400 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-[#ff1018]" />
            <span>
              Current streak:{" "}
              <strong className="text-white">
                {activityStreaks.currentStreak == null ? "—" : activityStreaks.currentStreak + "d"}
              </strong>
            </span>
          </div>
        </div>

        {/* Card 3: Coding Activity Heatmap */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-black p-4 flex flex-col justify-between relative shadow-sm overflow-hidden min-h-[170px]">
          {/* Heatmap Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs font-semibold text-white">
                {totalActivityEvents.toLocaleString()} <span className="text-zinc-400 font-normal">Submissions in {selectedYear}</span>
              </span>
              <span className="text-xs text-zinc-400">
                Max Streak:{" "}
                <strong className="text-white font-bold">
                  {activityStreaks.maxStreak == null ? "—" : activityStreaks.maxStreak + "d"}
                </strong>
              </span>
              <span className="text-xs text-zinc-400">
                Current:{" "}
                <strong className="text-white font-bold">
                  {activityStreaks.currentStreak == null ? "—" : activityStreaks.currentStreak + "d"}
                </strong>
              </span>
            </div>

            {/* Year Toggle */}
            <div className="flex items-center gap-1">
              {[new Date().getFullYear(), new Date().getFullYear() - 1].map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    selectedYear === year
                      ? "bg-[#ff1018] text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Year Activity Heatmap */}
          <p className="mb-1 text-[10px] text-zinc-500 sm:hidden">
            Swipe or scroll horizontally to view the full year.
          </p>
          <div
            role="region"
            aria-label={selectedYear + " activity heatmap. Scroll horizontally to explore all months."}
            tabIndex={0}
            className="w-full overflow-x-auto overscroll-x-contain py-2.5 focus-visible:outline focus-visible:outline-1 focus-visible:outline-emerald-400"
          >
            <div className="min-w-[600px]">
              <HeatMap
                value={heatmapValues}
                startDate={heatmapRange.startDate}
                endDate={heatmapRange.endDate}
                rectSize={9}
                space={2}
                rectProps={{ rx: 2 }}
                weekLabels={false}
                monthPlacement="top"
                legendCellSize={0}
                panelColors={ACTIVITY_PANEL_COLORS}
                className="block w-full select-none text-zinc-400"
                aria-label={selectedYear + " coding activity heatmap with " + totalActivityEvents + " submissions"}
                role="img"
                rectRender={(props, data) => {
                  const count = data.count ?? 0;
                  const level = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4);
                  const date = data.date.split("/").join("-");
                  const label =
                    count + (count === 1 ? " submission on " : " submissions on ") + date;
                  return (
                    <rect
                      {...props}
                      fill={ACTIVITY_PANEL_COLOR_LEVELS[level] ?? ACTIVITY_PANEL_COLORS[0]}
                      rx={2}
                      // title={label}
                      aria-label={label}
                    />
                  );
                }}
              />
            </div>
          </div>

          {/* Legend Footer */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-1 text-[10px] text-zinc-400">
            <span className="text-[10px] text-zinc-500">Activity from connected platforms</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#2a3038] border border-white/10" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#a1aa6d] border border-white/10" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#8cc665] border border-white/10" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#44a340] border border-white/10" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[#1e6823] border border-white/10" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MIDDLE BENTO ROW (55% Left Column + 45% Right Column)
          Solid AMOLED Black (Codolio 1:1)
          ======================================================== */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* ====================================================
            LEFT 55% COLUMN:
            1. Contest Attended & Platform Ratings Summary
            2. Contest Rating Progression Curve (ApexCharts)
            3. Awards & Badges Showcase
            4. Topic Analysis Progress Bars
            ==================================================== */}
        <div className="w-full lg:w-[55%] flex flex-col gap-4">
          {/* Card 1: Contest Attended & Platform Ratings Summary */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Big Number Counter */}
              <div className="flex flex-col items-center justify-center text-center sm:px-6">
                <span className="text-sm font-semibold text-zinc-400">
                  Contest Attended
                </span>
                <span className="text-6xl font-extrabold font-sans text-white tracking-tight mt-1 tabular-nums">
                  {totalContests}
                </span>
              </div>

              {/* Platform Ratings List */}
              <div className="w-full flex-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 space-y-2">
                {profile.platforms
                  .filter((p) => p.isConnected && (p.currentRating || p.maxRating))
                  .map((p) => (
                    <div
                      key={p.platform}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={getPlatformIconPath(p.platform)}
                          alt={p.name}
                          className="w-4 h-4 object-contain shrink-0"
                        />
                        <span className="font-semibold text-white">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-400">
                          Rating: <strong className="text-white font-bold font-sans">{p.currentRating ?? "—"}</strong>
                        </span>
                        {p.maxRating && (
                          <span className="text-emerald-400 text-[11px]">
                            Peak: {p.maxRating}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                {profile.platforms.filter((p) => p.currentRating || p.maxRating).length === 0 && (
                  <p className="text-xs text-zinc-400 text-center py-2">
                    No competitive contest ratings synced yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Contest Rating Progression Chart */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex flex-col gap-3 mb-4 pb-3 border-b border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#ff1018]" />
                    <span>Contest Rating Progression</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Interactive rating trajectory across competitive contests
                  </p>
                </div>

                {/* Platform Filters */}
                <div className="flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSelectedContestPlatform("all")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedContestPlatform === "all"
                        ? "bg-[#ff1018] text-white"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    All
                  </button>
                  {Object.entries(contestPlatformConfigs).map(([key, cfg]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedContestPlatform(key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedContestPlatform === key
                          ? "bg-[#ff1018] text-white"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
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
              </div>
            </div>

            {/* Rating Progression ApexChart */}
            <div className="w-full">
              <ContestRatingApexChart
                contests={profile.contests}
                selectedPlatform={selectedContestPlatform}
                height={260}
                showAnnotations={true}
              />
            </div>
          </div>

          {/* Card 3: Awards & Badges Showcase */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-semibold text-zinc-400">
                  Awards
                </h3>
                <span className="text-xs font-bold text-zinc-500">
                  {profile.badges.length} Earned Medals &amp; Badges
                </span>
              </div>

              {profile.badges.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAwardsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 4 Pinned Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pinnedBadges.length === 0 && (
                <p className="col-span-full py-6 text-center text-xs text-zinc-400">
                  No badge records are synced yet. Connect LeetCode or CodeChef to display awards.
                </p>
              )}

              {pinnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700 transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform">
                    {badge.icon ? (
                      <img
                        src={badge.icon}
                        alt={badge.badgeName}
                        className="w-full h-full object-contain drop-shadow"
                      />
                    ) : (
                      <Award className="w-8 h-8 text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {badge.badgeName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans mt-0.5">
                    {badge.platform}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Topic Analysis */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#ff1018]" />
                <span>Topic Analysis</span>
              </h3>
              <span className="text-xs font-medium text-zinc-400">
                {topTopics.length} Focus Areas
              </span>
            </div>

            <div className="space-y-2.5">
              {topTopics.length === 0 && (
                <p className="text-xs text-zinc-400 py-3 text-center">
                  Topic breakdown unavailable from connected providers.
                </p>
              )}

              {topTopics.map(([topic, count]) => {
                const pct = Math.round((count / maxTopicCount) * 100);
                return (
                  <div key={topic} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="font-medium text-zinc-200">{topic}</span>
                      <span className="font-bold text-white">{count} solved</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-white/5">
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

        {/* ====================================================
            RIGHT 45% COLUMN:
            1. Question Distribution (Donut + Table)
            2. Monthly Submission Velocity
            ==================================================== */}
        <div className="flex-1 w-full flex flex-col gap-4">
          {/* Card 1: Question Distribution Donut & Table */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#ff1018]" />
                <span>Question Distribution</span>
              </h3>
              <span className="text-xs font-bold text-zinc-400">
                ({profile.totalQuestionsSolved ?? "—"} Total)
              </span>
            </div>

            {/* Concentric Donut Display */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              <div className="relative flex items-center justify-center shrink-0">
                <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                  <circle
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={radius}
                    stroke="#141418"
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

                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-bold font-sans text-white tabular-nums">
                    {profile.totalQuestionsSolved ?? "—"}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                    Solved
                  </span>
                </div>
              </div>

              {/* Easy / Med / Hard Metric Cards */}
              <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Easy</span>
                  </div>
                  <span className="font-sans text-xs">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalEasy : "—"}</strong>{" "}
                    <span className="text-zinc-400">({hasDifficultyData ? `${easyPct}%` : "—"})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Medium</span>
                  </div>
                  <span className="font-sans text-xs">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalMedium : "—"}</strong>{" "}
                    <span className="text-zinc-400">({hasDifficultyData ? `${medPct}%` : "—"})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-zinc-300 font-semibold">Hard</span>
                  </div>
                  <span className="font-sans text-xs">
                    <strong className="text-white font-bold">{hasDifficultyData ? totalHard : "—"}</strong>{" "}
                    <span className="text-zinc-400">({hasDifficultyData ? `${hardPct}%` : "—"})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Difficulty Breakdown Table */}
            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Platform Difficulty Breakdown
              </div>

              <div className="divide-y divide-white/5 border border-zinc-800/80 rounded-lg overflow-hidden bg-zinc-950">
                {profile.platforms
                  .filter((p) => p.isConnected && ((p.totalQuestionsSolved ?? 0) > 0 || p.difficultyStats))
                  .map((p) => (
                    <div key={p.platform} className="p-2.5 text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={getPlatformIconPath(p.platform)}
                          alt={p.name}
                          className="w-4 h-4 object-contain shrink-0"
                        />
                        <span className="font-semibold text-white truncate">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-3 font-sans text-[11px] shrink-0">
                        {p.difficultyStats && (
                          <span className="text-zinc-400 hidden sm:inline">
                            <span className="text-emerald-400">{p.difficultyStats.easy}E</span> /{" "}
                            <span className="text-amber-400">{p.difficultyStats.medium}M</span> /{" "}
                            <span className="text-rose-400">{p.difficultyStats.hard}H</span>
                          </span>
                        )}
                        {(p.totalQuestionsSolved ?? 0) > 0 && (
                          <span className="font-bold text-white">{p.totalQuestionsSolved} Solved</span>
                        )}
                      </div>
                    </div>
                  ))}

                {profile.platforms.filter((p) => (p.totalQuestionsSolved ?? 0) > 0 || p.difficultyStats).length === 0 && (
                  <p className="p-3 text-xs text-center text-zinc-400">
                    No platform difficulty stats are synced yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Submission Velocity */}
          <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#ff1018]" />
                  <span>Submission Velocity</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Monthly problem solving activity &amp; velocity peaks
                </p>
              </div>
            </div>

            <div className="w-full">
              <ProblemSolvingVelocityApexChart
                heatmap={profile.submissionHeatmap}
                height={260}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. FULL AWARDS / BADGES MODAL (Codolio eX Modal)
          ======================================================== */}
      {isAwardsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-black border border-zinc-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  All Earned Awards ({profile.badges.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAwardsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Filters */}
            <div className="flex items-center gap-1.5 p-3 border-b border-zinc-800/80 overflow-x-auto no-scrollbar">
              {["all", "LeetCode", "CodeChef", "CodeStudio"].map((pKey) => (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => setSelectedAwardsPlatform(pKey)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedAwardsPlatform.toLowerCase() === pKey.toLowerCase()
                      ? "bg-[#ff1018] text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  {pKey === "all" ? "All Platforms" : pKey}
                </button>
              ))}
            </div>

            {/* Badges List */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredBadges.length === 0 && (
                <p className="col-span-full py-8 text-center text-xs text-zinc-400">
                  No awards found for this platform.
                </p>
              )}

              {filteredBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 flex flex-col items-center text-center group hover:border-zinc-700 transition-all"
                >
                  <div className="w-16 h-16 rounded-xl bg-black border border-zinc-800 flex items-center justify-center p-2 mb-2 group-hover:scale-105 transition-transform">
                    {badge.icon ? (
                      <img
                        src={badge.icon}
                        alt={badge.badgeName}
                        className="w-full h-full object-contain drop-shadow"
                      />
                    ) : (
                      <Award className="w-8 h-8 text-amber-400" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {badge.badgeName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-sans mt-0.5">
                    {badge.platform}
                  </span>
                  {badge.dateEarned && (
                    <span className="text-[9px] text-zinc-500 font-mono mt-1">
                      {badge.dateEarned}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
