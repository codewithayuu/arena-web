"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { AuthenticStatsGrid } from "./authentic-stats-grid";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { FaChartLine } from "react-icons/fa";
import { CheckInCalendarModal } from "./check-in-calendar-modal";
import { TopViewersModal } from "./top-viewers-modal";
import { loadTopicListState, recordTopicActivity } from "@/lib/topic-list-client";
import { cn } from "@/lib/utils";

interface StatsDockProps {
  completedTopics: string[];
  totalProblemsCount?: number;
  onOpenHeatmap?: () => void;
  onOpenAuraModal?: () => void;
  className?: string;
  onActionClick?: () => void;
}

export function StatsDock({
  completedTopics,
  totalProblemsCount = 3888,
  onOpenHeatmap,
  onOpenAuraModal,
  className,
  onActionClick,
}: StatsDockProps) {
  const { isSignedIn } = useUser();
  // Visit Streak State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTopViewersOpen, setIsTopViewersOpen] = useState(false);
  const [visitedDates, setVisitedDates] = useState<string[]>([]);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [usingAccountData, setUsingAccountData] = useState(false);

  // Initialize and track visits persistently
  useEffect(() => {
    try {
      const today = new Date();
      const todayKey = today.toISOString().slice(0, 10);

      // 1. Total views tracking
      const storedViews = localStorage.getItem("mindflare_total_views");
      const parsedViews = storedViews ? parseInt(storedViews, 10) : 0;
      const views = Number.isFinite(parsedViews) && parsedViews >= 0 ? parsedViews + 1 : 1;
      localStorage.setItem("mindflare_total_views", String(views));
      setTotalViews(views);

      // 2. Visited dates tracking
      const storedDates = localStorage.getItem("mindflare_visited_dates");
      let dates: string[] = storedDates ? JSON.parse(storedDates) : [];

      // Ensure today is marked as visited
      if (!dates.includes(todayKey)) {
        dates.push(todayKey);
      }
      dates.sort();
      localStorage.setItem("mindflare_visited_dates", JSON.stringify(dates));
      setVisitedDates(dates);

      // Device-only activity uses the same UTC, strict-consecutive rule as account activity.
      let streak = 0;
      const checkDate = new Date(today);
      checkDate.setUTCHours(0, 0, 0, 0);
      const yesterday = new Date(checkDate);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      if (!dates.includes(todayKey)) checkDate.setTime(yesterday.getTime());
      while (true) {
        const dayKey = checkDate.toISOString().slice(0, 10);
        if (!dates.includes(dayKey)) break;
        streak += 1;
        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
      }

      setCurrentStreak(streak);

      // Derive the best streak from the date set so an older local grace-day value is not trusted.
      let best = 0;
      let run = 0;
      let previousDate: number | null = null;
      for (const date of [...new Set(dates)].sort()) {
        const stamp = Date.parse(`${date}T00:00:00.000Z`);
        run = previousDate !== null && stamp - previousDate === 86_400_000 ? run + 1 : 1;
        previousDate = stamp;
        best = Math.max(best, run);
      }
      localStorage.setItem("mindflare_best_streak", String(best));
      setBestStreak(best);
    } catch {
      // Fallback
    }
    if (!isSignedIn) return;
    let cancelled = false;
    void (async () => {
      await recordTopicActivity("visit", "topic-list");
      const accountState = await loadTopicListState();
      if (!accountState || cancelled) return;
      const dates = [...new Set([
        ...accountState.activity.map((item) => item.activity_date.slice(0, 10)),
        ...accountState.checkins.map((item) => item.checkin_date.slice(0, 10)),
      ])].sort();
      const today = new Date().toISOString().slice(0, 10);
      const yesterdayDate = new Date();
      yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
      let activeStreak = 0;
      let cursor = new Date(`${(dates.includes(today) ? today : yesterdayDate.toISOString().slice(0, 10))}T00:00:00.000Z`);
      while (dates.includes(cursor.toISOString().slice(0, 10))) {
        activeStreak += 1;
        cursor.setUTCDate(cursor.getUTCDate() - 1);
      }
      let best = 0;
      let run = 0;
      let previous: number | null = null;
      for (const date of dates) {
        const stamp = Date.parse(`${date}T00:00:00.000Z`);
        run = previous !== null && stamp - previous === 86_400_000 ? run + 1 : 1;
        previous = stamp;
        best = Math.max(best, run);
      }
      if (cancelled) return;
      setUsingAccountData(true);
      setVisitedDates(dates);
      setTotalViews(dates.length);
      setCurrentStreak(activeStreak);
      setBestStreak(best);
    })();
    return () => { cancelled = true; };
  }, [isSignedIn]);

  return (
    <div className={cn("w-full space-y-3.5 text-white", className)}>
      {/* 1. Authentic Stats Section */}
      <div className="rounded-2xl border border-white/10 bg-black p-3.5 shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <FaChartLine className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold tracking-tight text-white">
              {usingAccountData ? "Your Stats · account" : "Your Stats · this device"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              onOpenAuraModal?.();
              onActionClick?.();
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Aura Ledger <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>
        </div>

        {/* Authentic 8-card grid without ugly translucent boxes */}
        <AuthenticStatsGrid
          completedTopics={completedTopics}
          totalProblemsCount={totalProblemsCount}
          onOpenTopicGrid={() => {
            onOpenAuraModal?.();
            onActionClick?.();
          }}
          onOpenHeatmap={() => {
            onOpenHeatmap?.();
            onActionClick?.();
          }}
          onOpenAuraModal={() => {
            onOpenAuraModal?.();
            onActionClick?.();
          }}
        />
      </div>

      {/* 2. Visit Streak Section */}
      <div className="rounded-2xl border border-white/10 bg-black p-3.5 shadow-xl">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold tracking-tight text-white">
              {usingAccountData ? "Learning Streak" : "Visit Streak · this device"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsTopViewersOpen(true);
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            Top Viewers <ArrowRight className="w-3 h-3 text-zinc-400" />
          </button>
        </div>

        {/* 4-Card 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Current */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0a0a0c] border border-white/10">
            <span className="text-xs font-semibold text-sky-400">Current</span>
            <span className="text-xs font-bold text-white font-sans">
              {currentStreak} day{currentStreak === 1 ? "" : "s"}
            </span>
          </div>

          {/* Best */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0a0a0c] border border-white/10">
            <span className="text-xs font-semibold text-sky-400">Best</span>
            <span className="text-xs font-bold text-white font-sans">
              {bestStreak} day{bestStreak === 1 ? "" : "s"}
            </span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0a0a0c] border border-white/10">
            <span className="text-xs font-semibold text-sky-400">{usingAccountData ? "Active days" : "Local total"}</span>
            <span className="text-xs font-bold text-white font-sans">
              {usingAccountData ? `${visitedDates.length} days` : `${totalViews} views`}
            </span>
          </div>

          {/* View Calendar Button */}
          <button
            type="button"
            onClick={() => {
              setIsCalendarOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0a0a0c] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all text-xs font-medium text-zinc-200 hover:text-white cursor-pointer shadow-sm"
          >
            <Calendar className="w-3.5 h-3.5 text-zinc-300" />
            <span>View Calendar</span>
          </button>
        </div>
      </div>

      {/* Check-in Calendar Modal */}
      <CheckInCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentStreak={currentStreak}
        longestStreak={bestStreak}
        totalViews={totalViews}
        totalDays={visitedDates.length}
        visitedDates={visitedDates}
      />

      {/* Top Viewers Modal */}
      <TopViewersModal
        isOpen={isTopViewersOpen}
        onClose={() => setIsTopViewersOpen(false)}
        currentUserStreak={currentStreak}
        currentUserViews={totalViews}
      />
    </div>
  );
}
