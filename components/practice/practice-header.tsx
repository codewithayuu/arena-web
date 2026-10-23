"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Maximize2,
  Minimize2,
  User,
} from "lucide-react";
import { PracticeProblem, PracticeProblemListItem } from "@/lib/practice-data";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface PracticeHeaderProps {
  problem: PracticeProblem;
  nextProblem: PracticeProblemListItem | null;
  prevProblem: PracticeProblemListItem | null;
  onOpenProblemList: () => void;
  onRandomProblem: () => void;
}

export function PracticeHeader({
  problem,
  nextProblem,
  prevProblem,
  onOpenProblemList,
  onRandomProblem,
}: PracticeHeaderProps) {
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showTimerControls, setShowTimerControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="h-11 border-b border-border bg-background px-3 flex items-center justify-between text-zinc-300 select-none z-30 flex-shrink-0">
      {/* Left: Brand & Problem List Selector */}
      <div className="flex items-center gap-2">
        <SimpleTooltip content="Mindflare Home">
          <Link
            href="/"
            className="flex items-center transition-transform hover:opacity-90"
          >
            <img
              src="/images/mindflare_m_logo.svg"
              alt="Mindflare"
              className="h-6 w-auto object-contain"
            />
          </Link>
        </SimpleTooltip>

        <button
          onClick={onOpenProblemList}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-border text-xs font-semibold text-zinc-200 transition-colors shadow-xs"
        >
          <span>Mindflare 300</span>
          <ChevronDown className="h-3 w-3 text-zinc-400" />
        </button>
      </div>

      {/* Center: Problem Navigation (< 🔀 Next Problem >) */}
      <div className="flex items-center gap-1 sm:gap-2">
        {prevProblem ? (
          <SimpleTooltip content={`Previous: ${prevProblem.title}`}>
            <Link
              href={`/practice/dsa/${prevProblem.slug}?list=am-300`}
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </SimpleTooltip>
        ) : (
          <button
            disabled
            className="p-1.5 rounded-md text-zinc-600 cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <SimpleTooltip content="Random Problem">
          <button
            onClick={onRandomProblem}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            <Shuffle className="h-3.5 w-3.5" />
          </button>
        </SimpleTooltip>

        {nextProblem ? (
          <SimpleTooltip content={`Next: ${nextProblem.title}`}>
            <Link
              href={`/practice/dsa/${nextProblem.slug}?list=am-300`}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors max-w-[160px] sm:max-w-[200px] truncate"
            >
              <span className="truncate">{nextProblem.title}</span>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
            </Link>
          </SimpleTooltip>
        ) : (
          <span className="text-xs font-medium text-zinc-400 px-2">
            {problem.title}
          </span>
        )}
      </div>

      {/* Right: Timer & Profile */}
      <div className="flex items-center gap-2">
        {/* Stopwatch Timer */}
        <div className="relative">
          <SimpleTooltip content="Practice Timer">
            <div
              onClick={() => setShowTimerControls(!showTimerControls)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#14141F] border border-[#1E1E2E] text-xs font-mono text-zinc-300 cursor-pointer hover:bg-[#1E1E2E] transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{formatTimer(seconds)}</span>
            </div>
          </SimpleTooltip>

          {/* Timer Dropdown Controls */}
          {showTimerControls && (
            <div className="absolute right-0 top-9 w-40 p-2 rounded-lg bg-[#14141F] border border-[#1E1E2E] shadow-xl z-50 flex items-center justify-between">
              <SimpleTooltip content={isTimerRunning ? "Pause" : "Start"}>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1.5 rounded-md hover:bg-[#1E1E2E] text-zinc-300 hover:text-white"
                >
                  {isTimerRunning ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-[#38BDF8]" />
                  )}
                </button>
              </SimpleTooltip>
              <SimpleTooltip content="Reset">
                <button
                  onClick={() => setSeconds(0)}
                  className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </SimpleTooltip>
              <button
                onClick={() => setShowTimerControls(false)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Streak Flame */}
        <SimpleTooltip content="Daily Streak: 1">
          <div
            className="flex items-center gap-1 px-1.5 py-1 rounded-md text-orange-500 hover:bg-orange-500/10 transition-colors cursor-pointer"
          >
            <Flame className="h-4 w-4 fill-orange-500/20" />
            <span className="text-xs font-bold font-mono">1</span>
          </div>
        </SimpleTooltip>

        {/* Fullscreen Button */}
        <SimpleTooltip content={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </SimpleTooltip>
      </div>
    </header>
  );
}
