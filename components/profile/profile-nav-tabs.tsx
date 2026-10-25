"use client";

import React from "react";
import { Code, GitPullRequest, User, Trophy, Award } from "lucide-react";
import { getPlatformIconPath } from "./verified-badge";

export type ProfileTabKey =
  | "problemSolving"
  | "contests"
  | "development"
  | "badgesCard"
  | "about";

interface ProfileNavTabsProps {
  activeTab: ProfileTabKey;
  onSelectTab: (tab: ProfileTabKey) => void;
  selectedPlatform?: string;
  onSelectPlatform?: (platform: string) => void;
  platforms?: Array<{ platform: string; name: string }>;
  solvedCount?: number;
  contestsCount?: number;
  contributionsCount?: number;
  badgesCount?: number;
}

export function ProfileNavTabs({
  activeTab,
  onSelectTab,
  selectedPlatform = "all",
  onSelectPlatform,
  platforms = [],
}: ProfileNavTabsProps) {
  const mainTabs: Array<{ id: ProfileTabKey; label: string; icon: React.ReactNode }> = [
    {
      id: "problemSolving",
      label: "Problem Solving",
      icon: <Code className="w-4 h-4 shrink-0" />,
    },
    {
      id: "development",
      label: "Development",
      icon: <GitPullRequest className="w-4 h-4 shrink-0" />,
    },
    {
      id: "about",
      label: "About",
      icon: <User className="w-4 h-4 shrink-0" />,
    },
  ];

  // Common competitive platforms for filter chips
  const filterPlatforms = [
    { id: "all", name: "All Platforms" },
    { id: "leetcode", name: "LeetCode" },
    { id: "codeforces", name: "Codeforces" },
    { id: "codechef", name: "CodeChef" },
    { id: "geeksforgeeks", name: "GeeksforGeeks" },
    { id: "hackerrank", name: "HackerRank" },
    { id: "atcoder", name: "AtCoder" },
  ];

  return (
    <div className="w-full space-y-3 font-poppins">
      {/* 1. Main Navigation Tabs (Codolio 1:1 Rounded Pill Segment) */}
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-black border border-white/10 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                  isActive
                    ? "bg-[#ff1018] text-white shadow-md shadow-[#ff1018]/25"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick jump for Contests & Badges if visited via direct link */}
        <div className="hidden lg:flex items-center gap-1 pr-2">
          <button
            type="button"
            onClick={() => onSelectTab("contests")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "contests"
                ? "bg-[#ff1018] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Contest Curve
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("badgesCard")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "badgesCard"
                ? "bg-[#ff1018] text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Scorecard
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Platform Filter Chips (Visible when in Problem Solving) */}
      {activeTab === "problemSolving" && onSelectPlatform && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterPlatforms.map((p) => {
            const isSelected = selectedPlatform.toLowerCase() === p.id.toLowerCase();
            const iconPath = p.id !== "all" ? getPlatformIconPath(p.id) : null;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer select-none whitespace-nowrap border ${
                  isSelected
                    ? "bg-[#ff1018] border-[#ff1018] text-white shadow-sm"
                    : "bg-black border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-zinc-900"
                }`}
              >
                {iconPath && (
                  <img
                    src={iconPath}
                    alt={p.name}
                    className="w-3.5 h-3.5 object-contain shrink-0"
                  />
                )}
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
