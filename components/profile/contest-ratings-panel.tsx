"use client";

import React, { useState } from "react";
import { UserProfileData, ContestHistoryItem } from "@/lib/profile-data";
import { TrendingUp } from "lucide-react";
import { Trophy, Award, Calendar, ExternalLink } from "@/components/animate-ui/icons";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { getPlatformIconPath } from "./verified-badge";
import { ContestRatingApexChart } from "./contest-rating-apex-chart";
import { ContestPerformanceDeltaApexChart } from "./contest-performance-delta-apex-chart";

interface ContestRatingsPanelProps {
  profile: UserProfileData;
}

export function ContestRatingsPanel({ profile }: ContestRatingsPanelProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  const platformsConfig: Record<string, { label: string; color: string }> = {
    codeforces: { label: "Codeforces", color: "#38bdf8" },
    leetcode: { label: "LeetCode", color: "#f59e0b" },
    codechef: { label: "CodeChef", color: "#f97316" },
    atcoder: { label: "AtCoder", color: "#94a3b8" },
  };

  const sortedContests = [...profile.contests].sort((a, b) => a.contestDate - b.contestDate);
  const bestContestRank = profile.contests.length ? Math.min(...profile.contests.map((contest) => contest.rank)) : null;

  return (
    <div className="space-y-6">
      {/* 1. Header Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <Trophy className="w-4 h-4 text-[#ff1018]" />
            <span>Total Contests</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 inline-flex items-baseline gap-1 tabular-nums">
            <span>{profile.contests.length}</span>
            <span className="text-xs font-normal text-zinc-400 font-sans">Rounds</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Rated contest records returned by connected providers</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Peak Ratings</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-0.5 inline-flex items-baseline gap-1 tabular-nums">
            <span className="text-emerald-400 text-base">{profile.platforms.filter((platform) => typeof platform.maxRating === "number").map((platform) => `${platform.name} ${platform.maxRating}`).join(" · ") || "—"}</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-0.5">Provider rating scales are listed separately</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-4 shadow-xl hover:border-white/20 transition-all">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Best Recorded Rank</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-0.5 tabular-nums">
            {bestContestRank === null ? "—" : `#${bestContestRank.toLocaleString()}`}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-0.5">{bestContestRank === null ? "No contest results" : "Best recorded contest placement"}</div>
        </div>
      </div>

      {/* 2. Interactive ApexCharts Rating Progression Timeline */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Contest Rating Progression
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Time-series history across official rated contests with milestone annotations</p>
          </div>

          {/* Platform Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedPlatform("all")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === "all"
                  ? "bg-[#ff1018] text-white"
                  : "bg-[#141418] text-zinc-400 hover:text-white"
              }`}
            >
              All Platforms
            </button>
            {Object.entries(platformsConfig).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPlatform(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedPlatform === key
                    ? "bg-[#18181f] text-white border border-zinc-700"
                    : "bg-[#141418] text-zinc-400 hover:text-white"
                }`}
              >
                <img
                  src={getPlatformIconPath(key)}
                  alt={config.label}
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
                <span>{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ApexChart Line Component with Annotations */}
        <div className="w-full">
          <ContestRatingApexChart
            contests={profile.contests}
            selectedPlatform={selectedPlatform}
            height={320}
            showAnnotations={true}
          />
        </div>
      </div>

      {/* 3. Rating Delta Gains & Drops Analytics (ApexCharts Bar) */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Rating Performance Deltas (+/-)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Rating jumps and drops recorded per contest</p>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-400">
            {profile.contests.filter((c) => c.ratingChange !== undefined).length} Rated Rounds
          </span>
        </div>

        <div className="w-full">
          <ContestPerformanceDeltaApexChart
            contests={profile.contests}
            height={240}
          />
        </div>
      </div>

      {/* 3. Recent Contests List */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
          Contest History ({sortedContests.length} Events)
        </h2>

        <div className="space-y-2">
          {sortedContests.length === 0 && <p className="rounded-xl border border-white/10 bg-[#0d0d12] p-5 text-center text-sm text-zinc-400">No contest history is available from the connected platforms yet. Sync linked accounts to load provider history.</p>}
          {sortedContests.map((c, i) => {
            const dateStr = new Date(c.contestDate * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const pConfig = platformsConfig[c.platform];

            return (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#0d0d12] hover:border-white/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={getPlatformIconPath(c.platform)}
                    alt={pConfig?.label || c.platform}
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">{c.contestName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {pConfig?.label} • {dateStr}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs font-bold font-mono text-white">
                      Rank #{c.rank}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">Rating: {c.rating}</div>
                  </div>

                  {c.ratingChange !== undefined && (
                    <span
                      className={`text-xs font-bold font-mono ${
                        c.ratingChange >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {c.ratingChange >= 0 ? `+${c.ratingChange}` : c.ratingChange}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
