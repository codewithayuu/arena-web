"use client";

import React, { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { MdCalendarToday } from "react-icons/md";
import { FaFire, FaTrophy, FaEye } from "react-icons/fa";

interface CheckInCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  totalViews: number;
  totalDays: number;
  visitedDates: string[]; // array of "YYYY-MM-DD"
}

export function CheckInCalendarModal({
  isOpen,
  onClose,
  currentStreak,
  longestStreak,
  totalViews,
  totalDays,
  visitedDates,
}: CheckInCalendarModalProps) {
  // Calendar Navigation State
  // Default to today's month & year
  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => {
    const y = today.getUTCFullYear();
    const m = String(today.getUTCMonth() + 1).padStart(2, "0");
    const d = String(today.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [today]);

  const [viewYear, setViewYear] = useState<number>(today.getUTCFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getUTCMonth()); // 0-indexed: 0 = Jan, 9 = Oct

  // Month navigation handlers
  const handlePrevYear = () => setViewYear((y) => y - 1);
  const handleNextYear = () => setViewYear((y) => y + 1);

  const handlePrevMonth = () => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const handleNextMonth = () => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  // Month name
  const monthName = useMemo(() => {
    const d = new Date(Date.UTC(viewYear, viewMonth, 1));
    return d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  }, [viewYear, viewMonth]);

  // Compute calendar days (Monday-first)
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1));
    const lastDayOfMonth = new Date(Date.UTC(viewYear, viewMonth + 1, 0));
    const daysInCurrentMonth = lastDayOfMonth.getUTCDate();

    // Monday-first weekday: Monday=0, Tuesday=1, ..., Sunday=6
    const startWeekday = (firstDayOfMonth.getUTCDay() + 6) % 7;

    const cells: Array<{
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isVisited: boolean;
      isToday: boolean;
      isPast: boolean;
      isFuture: boolean;
    }> = [];

    // 1. Padding days from previous month
    const daysInPrevMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(Date.UTC(viewYear, viewMonth - 1, dayNum));
      const y = prevDate.getUTCFullYear();
      const m = String(prevDate.getUTCMonth() + 1).padStart(2, "0");
      const d = String(dayNum).padStart(2, "0");
      const key = `${y}-${m}-${d}`;

      cells.push({
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isVisited: visitedDates.includes(key),
        isToday: key === todayKey,
        isPast: key < todayKey,
        isFuture: key > todayKey,
      });
    }

    // 2. Days of current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const y = viewYear;
      const m = String(viewMonth + 1).padStart(2, "0");
      const dayStr = String(d).padStart(2, "0");
      const key = `${y}-${m}-${dayStr}`;

      cells.push({
        dateKey: key,
        dayNumber: d,
        isCurrentMonth: true,
        isVisited: visitedDates.includes(key),
        isToday: key === todayKey,
        isPast: key < todayKey,
        isFuture: key > todayKey,
      });
    }

    // 3. Padding days for next month to complete the 7-column rows
    const totalCellsSoFar = cells.length;
    const remainingToCompleteWeek = (7 - (totalCellsSoFar % 7)) % 7;
    // Always show at least 35 or 42 cells like full month view
    const targetTotal = totalCellsSoFar + remainingToCompleteWeek <= 35 ? 35 : 42;
    const totalToAdd = targetTotal - totalCellsSoFar;

    for (let i = 1; i <= totalToAdd; i++) {
      const nextDate = new Date(Date.UTC(viewYear, viewMonth + 1, i));
      const y = nextDate.getUTCFullYear();
      const m = String(nextDate.getUTCMonth() + 1).padStart(2, "0");
      const d = String(i).padStart(2, "0");
      const key = `${y}-${m}-${d}`;

      cells.push({
        dateKey: key,
        dayNumber: i,
        isCurrentMonth: false,
        isVisited: visitedDates.includes(key),
        isToday: key === todayKey,
        isPast: key < todayKey,
        isFuture: key > todayKey,
      });
    }

    return cells;
  }, [viewYear, viewMonth, visitedDates, todayKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-[560px] rounded-3xl border border-white/10 bg-[#0e0e13] p-5 sm:p-7 shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <MdCalendarToday className="w-5 h-5 text-zinc-300" />
            <h3 className="text-lg font-bold text-white tracking-tight">Check-in Calendar</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Check-in Calendar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informative Descriptions */}
        <div className="space-y-2 mt-1 text-xs text-zinc-400 leading-relaxed">
          <p>
            Signed-in activity dates use UTC. Your streak counts consecutive active days, and missing a day resets it.{" "}
            <strong className="text-amber-400 font-semibold">
              Visiting a page records activity; claim the daily Aura reward separately in the Aura panel.
            </strong>
          </p>
          <p>
            Check-in reward points are granted once per UTC day after an authenticated claim. Device-only visit history
            is not an account check-in or an Aura reward.
          </p>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-4 mb-5">
          {/* 1. Current Streak */}
          <div className="rounded-xl border border-amber-500/25 bg-[#1b1510] p-2.5 sm:p-3 text-center flex flex-col justify-between">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-500">
              <FaFire className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">Current Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-500 my-1">
              {currentStreak}
            </div>
            <div className="text-[11px] text-zinc-400">day{currentStreak === 1 ? "" : "s"}</div>
          </div>

          {/* 2. Longest Streak */}
          <div className="rounded-xl border border-yellow-500/25 bg-[#1c1910] p-2.5 sm:p-3 text-center flex flex-col justify-between">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-yellow-500">
              <FaTrophy className="w-3 h-3 text-yellow-500 shrink-0" />
              <span className="truncate">Longest Streak</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-yellow-500 my-1">
              {longestStreak}
            </div>
            <div className="text-[11px] text-zinc-400">day{longestStreak === 1 ? "" : "s"}</div>
          </div>

          {/* 3. Total Views */}
          <div className="rounded-xl border border-sky-500/25 bg-[#0e1822] p-2.5 sm:p-3 text-center flex flex-col justify-between">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-400">
              <FaEye className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate">Total Views</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-sky-400 my-1">
              {totalViews}
            </div>
            <div className="text-[11px] text-zinc-400">views</div>
          </div>

          {/* 4. Total Days */}
          <div className="rounded-xl border border-purple-500/25 bg-[#171224] p-2.5 sm:p-3 text-center flex flex-col justify-between">
            <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-purple-400">
              <MdCalendarToday className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">Total Days</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400 my-1">
              {totalDays}
            </div>
            <div className="text-[11px] text-zinc-400">days</div>
          </div>
        </div>

        {/* Month Navigation Header */}
        <div className="flex items-center justify-between max-w-xs mx-auto mb-3 px-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevYear}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-mono"
              title="Previous Year"
            >
              &laquo;
            </button>
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-mono"
              title="Previous Month"
            >
              &lsaquo;
            </button>
          </div>

          <span className="text-sm sm:text-base font-bold text-white tracking-wide">
            {monthName} {viewYear}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-mono"
              title="Next Month"
            >
              &rsaquo;
            </button>
            <button
              type="button"
              onClick={handleNextYear}
              className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-mono"
              title="Next Year"
            >
              &raquo;
            </button>
          </div>
        </div>

        {/* Weekday Row Header (Monday to Sunday) */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((dayName) => (
            <div key={dayName} className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-y-2.5 gap-x-1 sm:gap-x-2 text-center">
          {calendarCells.map((cell, idx) => {
            // Styling rules matching Screenshot 2:
            // 1. Visited day: Solid teal/green circle (#25a27e)
            // 2. Past not visited day: Solid soft red/coral circle (#eb5959)
            // 3. Today: Ring highlight (blue/sky outline)
            // 4. Future day: Plain text (no colored circle)
            let circleClass = "";

            if (cell.isVisited) {
              circleClass = "bg-[#25a27e] text-white shadow-sm";
            } else if (cell.isPast) {
              circleClass = "bg-[#eb5959] text-white shadow-sm";
            } else if (cell.isToday) {
              circleClass = "border-2 border-sky-400 text-sky-400 bg-sky-500/10";
            } else {
              circleClass = "text-zinc-500 hover:text-zinc-400";
            }

            // Today indicator: blue/sky outline ring
            const todayRing = cell.isToday ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0e0e13]" : "";

            return (
              <div key={idx} className="flex items-center justify-center">
                <span
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-semibold text-xs sm:text-[13px] transition-all select-none ${circleClass} ${todayRing}`}
                >
                  {cell.dayNumber}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 sm:gap-7 mt-5 pt-3.5 border-t border-white/10 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#25a27e]" />
            <span>Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#eb5959]" />
            <span>Not visited</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded border-2 border-sky-400" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
