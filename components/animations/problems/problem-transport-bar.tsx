"use client";

import React from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, ChevronDown } from "lucide-react";

import SmoothButton from "@/components/smoothui/smooth-button";
import Select from "@/components/smoothui/select";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface ProblemTransportBarProps {
  currentIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlayPause: () => void;
  onStepPrev: () => void;
  onStepNext: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export function ProblemTransportBar({
  currentIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepPrev,
  onStepNext,
  onSeek,
  onSpeedChange,
  isFullscreen,
  onToggleFullscreen,
  className = "",
}: ProblemTransportBarProps) {
  const maxStep = Math.max(0, totalSteps - 1);
  const progressPercent = maxStep > 0 ? (currentIndex / maxStep) * 100 : 0;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/10 bg-black text-white select-none shadow-xl ${className}`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Play / Pause Button */}
      <SmoothButton
        type="button"
        size="icon-sm"
        variant="solid"
        className="bg-[#FF1018] text-white hover:bg-[#E00C14] shadow-md shadow-[#FF1018]/25"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
      </SmoothButton>

      {/* Step Backward Button */}
      <SimpleTooltip content="Previous step (Shortcut: [)">
        <SmoothButton
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onStepPrev}
          disabled={currentIndex <= 0}
          className="border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </SmoothButton>
      </SimpleTooltip>

      {/* Step Forward Button */}
      <SimpleTooltip content="Next step (Shortcut: ])">
        <SmoothButton
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={onStepNext}
          disabled={currentIndex >= maxStep}
          className="border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30"
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
          onChange={(e) => onSeek(Number(e.target.value))}
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
        <span className="text-white font-bold">{currentIndex}</span> / <span>{maxStep}</span>
      </div>

      {/* Speed Dropdown */}
      <div className="w-[78px] shrink-0">
        <Select
          value={String(speed)}
          onValueChange={(val) => onSpeedChange(Number(val))}
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
  );
}
