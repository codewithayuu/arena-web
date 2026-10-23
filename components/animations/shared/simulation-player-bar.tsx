"use client";

import React, { useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { SimulationPlayer } from "./use-simulation-playback";
import SmoothButton from "@/components/smoothui/smooth-button";
import Select from "@/components/smoothui/select";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface SimulationPlayerBarProps {
  player: SimulationPlayer;
  onRun: () => void;
  runLabel?: string;
  runDisabled?: boolean;
  className?: string;
  status?: string;
  statusText?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export function SimulationPlayerBar({
  player,
  onRun,
  runDisabled = false,
  className = "",
  status,
  statusText,
  isFullscreen,
  onToggleFullscreen,
}: SimulationPlayerBarProps) {
  const {
    isPlaying,
    armed,
    index,
    total,
    speed,
    setSpeed,
    pause,
    resume,
    start,
    next,
    prev,
    seek,
  } = player;

  const maxStep = Math.max(0, total - 1);
  const currentIndex = Math.max(0, Math.min(index >= 0 ? index : 0, maxStep));
  const progressPercent = maxStep > 0 ? (currentIndex / maxStep) * 100 : 0;
  const currentExplanation = status || statusText;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (!armed) {
          onRun();
        } else if (isPlaying) {
          pause();
        } else if (index >= total - 1) {
          start();
        } else {
          resume();
        }
      } else if (e.key === "ArrowRight" || e.key === "]") {
        e.preventDefault();
        if (armed && index < total - 1) {
          next();
        }
      } else if (e.key === "ArrowLeft" || e.key === "[") {
        e.preventDefault();
        if (armed && index > 0) {
          prev();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [armed, isPlaying, index, total, onRun, pause, resume, start, next, prev]);

  const handlePlayToggle = useCallback(() => {
    if (!armed) {
      onRun();
    } else if (isPlaying) {
      pause();
    } else if (index >= total - 1) {
      start();
    } else {
      resume();
    }
  }, [armed, isPlaying, index, total, onRun, pause, start, resume]);

  return (
    <div className="w-full space-y-3">
      {/* Step Explanation Banner matching right-angled-triangle */}
      {currentExplanation && (
        <div
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/10 bg-black text-xs font-mono text-zinc-200 select-none shadow-xl relative overflow-hidden"
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        >
          {/* Crimson Accent Left Strip */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF1018] rounded-l" />

          <span className="font-bold text-[#FF3B41] shrink-0">Step:</span>
          <span className="leading-relaxed line-clamp-2">
            {currentExplanation}
          </span>
        </div>
      )}

      {/* Main Transport Player Bar */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-black text-white select-none shadow-xl ${className}`}
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        {/* Play / Pause Button (No run button) */}
        <SmoothButton
          type="button"
          size="icon-sm"
          variant="solid"
          className="bg-[#FF1018] text-white hover:bg-[#E00C14] shadow-md shadow-[#FF1018]/25 shrink-0"
          onClick={handlePlayToggle}
          disabled={runDisabled}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 fill-current ml-0.5" />
          )}
        </SmoothButton>

        {/* Step Backward Button */}
        <SimpleTooltip content="Previous step (Shortcut: [ or ←)">
          <SmoothButton
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={prev}
            disabled={!armed || index <= 0}
            className="border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </SmoothButton>
        </SimpleTooltip>

        {/* Step Forward Button */}
        <SimpleTooltip content="Next step (Shortcut: ] or →)">
          <SmoothButton
            type="button"
            size="icon-sm"
            variant="outline"
            onClick={next}
            disabled={!armed || index >= maxStep}
            className="border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 shrink-0"
          >
            <ChevronRight className="h-4 w-4" />
          </SmoothButton>
        </SimpleTooltip>

        {/* Scrubber Timeline */}
        <div className="relative flex-1 flex items-center h-6 mx-2 cursor-pointer group">
          <input
            type="range"
            min={0}
            max={maxStep}
            value={currentIndex}
            onChange={(e) => {
              if (!armed) onRun();
              seek(Number(e.target.value));
            }}
            className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
          />
          {/* Track Background */}
          <div className="w-full h-1.5 rounded-full bg-white/10 relative overflow-hidden">
            {/* Active Progress Bar */}
            <div
              className="h-full bg-[#FF1018] rounded-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Scrubber Knob */}
          <div
            className="absolute h-3.5 w-3.5 rounded-full bg-[#FF1018] shadow-md border border-white pointer-events-none -translate-x-1/2 transition-all duration-75"
            style={{ left: `${progressPercent}%` }}
          />
        </div>

        {/* Step Counter */}
        <div className="text-xs text-zinc-400 font-mono tabular-nums shrink-0">
          <span className="text-white font-bold">{armed ? currentIndex : 0}</span> / <span>{maxStep}</span>
        </div>

        {/* Speed Dropdown Pill */}
        <div className="w-[78px] shrink-0">
          <Select
            value={String(speed)}
            onValueChange={(val) => setSpeed(Number(val))}
            options={SPEEDS.map((s) => ({
              value: String(s),
              label: `${s}x`,
            }))}
            size="sm"
            className="h-7 text-xs font-semibold rounded-lg bg-black border-white/10 text-white"
          />
        </div>

        {/* Fullscreen Button */}
        {onToggleFullscreen && (
          <SimpleTooltip content={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
            <SmoothButton
              type="button"
              size="icon-sm"
              variant="outline"
              onClick={onToggleFullscreen}
              className="border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] shrink-0"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </SmoothButton>
          </SimpleTooltip>
        )}
      </div>
    </div>
  );
}
