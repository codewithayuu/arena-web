"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import {
  CodeViewerPanel,
  CodeTemplate,
  SupportedLanguage,
} from "./code-viewer-panel";
import { ProblemTransportBar } from "./problem-transport-bar";
import { StepExplanationBanner } from "./step-explanation-banner";
import { InputPresetsPanel, PresetOption } from "./input-presets-panel";
import SmoothButton from "@/components/smoothui/smooth-button";
import { TooltipProvider } from "@/components/animate-ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export interface ProblemApproach {
  id: string;
  label: string;
  templates: Partial<Record<SupportedLanguage, CodeTemplate>>;
  generateSteps: (input: any) => ProblemStep[];
  renderVisual: (step: ProblemStep, input: any) => React.ReactNode;
}

export interface ProblemStep {
  id: string; // key in lineMap
  explanation: string;
  variables?: Record<string, any>;
  data?: any;
}

interface ProblemViewerShellProps {
  title: string;
  slug: string;
  approaches: ProblemApproach[];
  presets: PresetOption[];
  formatInputDisplay: (input: any) => string;
}

export function ProblemViewerShell({
  title,
  slug,
  approaches,
  presets,
  formatInputDisplay,
}: ProblemViewerShellProps) {
  // State
  const [activeApproachId, setActiveApproachId] = useState(
    approaches[0]?.id || "",
  );
  const [activePreset, setActivePreset] = useState<PresetOption>(presets[0]);
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>("java");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeApproach =
    approaches.find((a) => a.id === activeApproachId) || approaches[0];

  // Generate steps based on active approach and preset
  const steps = React.useMemo(() => {
    if (!activeApproach) return [];
    return activeApproach.generateSteps(activePreset.value);
  }, [activeApproach, activePreset]);

  // Current step
  const currentStep = steps[currentIndex] ||
    steps[0] || { id: "-", explanation: "Ready" };

  // Sync bookmark from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dsa_problem_bookmarks");
      if (saved) {
        const set = new Set(JSON.parse(saved));
        setIsBookmarked(set.has(slug));
      }
    } catch {}
  }, [slug]);

  const toggleBookmark = () => {
    try {
      const saved = localStorage.getItem("dsa_problem_bookmarks");
      const set = new Set(saved ? JSON.parse(saved) : []);
      if (set.has(slug)) {
        set.delete(slug);
        setIsBookmarked(false);
      } else {
        set.add(slug);
        setIsBookmarked(true);
      }
      localStorage.setItem(
        "dsa_problem_bookmarks",
        JSON.stringify(Array.from(set)),
      );
    } catch {}
  };

  // Reset index when approach or preset changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
  }, [activeApproachId, activePreset]);

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.round(1200 / speed);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "[") {
        e.preventDefault();
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "]") {
        e.preventDefault();
        setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [steps.length]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div
        ref={containerRef}
        className="min-h-screen bg-transparent text-foreground flex flex-col selection:bg-[#FF1018]/30 selection:text-white relative z-10"
      >
        <Navbar />

        {/* Centered Contained Column */}
        <main className="flex-1 pt-24 sm:pt-28 pb-12 w-full lg:w-[88%] max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          {/* Top Header: Back Link + Title + Bookmark */}
          <div className="flex flex-col gap-2">
            <Link
              href="/animations/dsa"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors self-start"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to All Animations
            </Link>

            <div className="flex items-center justify-between gap-4 mt-0.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {title}
              </h1>
              <SmoothButton
                type="button"
                size="xs"
                variant={isBookmarked ? "solid" : "outline"}
                color={isBookmarked ? "accent" : "neutral"}
                onClick={toggleBookmark}
                className={`gap-1.5 font-semibold ${
                  isBookmarked
                    ? "bg-[#FF1018] text-white hover:bg-[#E00C14]"
                    : "border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Bookmark
                  className="h-3.5 w-3.5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
                <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </SmoothButton>
            </div>

            {/* Approach Switcher Tabs (if multiple approaches exist) */}
            {approaches.length > 1 && (
              <div className="flex justify-center mt-2">
                <div className="inline-flex items-center bg-black p-1 rounded-xl border border-white/10 shadow-lg">
                  {approaches.map((app) => (
                    <SmoothButton
                      key={app.id}
                      type="button"
                      size="xs"
                      variant={activeApproachId === app.id ? "solid" : "ghost"}
                      color={activeApproachId === app.id ? "neutral" : "neutral"}
                      onClick={() => setActiveApproachId(app.id)}
                      className={`font-bold text-xs ${
                        activeApproachId === app.id
                          ? "bg-white/[0.12] text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {app.label}
                    </SmoothButton>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Resizable Layout */}
          <div className="hidden md:block desktop:block w-full">
            <Group orientation="horizontal" className="w-full items-stretch">
              {/* Left Column: Code Viewer Panel */}
              <Panel
                defaultSize={44}
                minSize={28}
                maxSize={62}
                className="flex flex-col"
              >
                <div className="h-[530px] rounded-2xl border border-white/10 bg-black overflow-hidden flex flex-col shadow-2xl">
                  <CodeViewerPanel
                    templates={activeApproach?.templates || {}}
                    currentLanguage={currentLanguage}
                    onLanguageChange={setCurrentLanguage}
                    activeStepKey={currentStep.id}
                  />
                </div>
              </Panel>

              {/* Resizable Divider with 3 Dots */}
              <Separator className="relative w-3 mx-1 hover:bg-[#FF1018]/20 transition-colors group cursor-col-resize flex items-center justify-center">
                <div className="h-10 w-1.5 rounded-full bg-zinc-700/40 group-hover:bg-[#FF1018]/80 transition-colors flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                  <div className="h-1 w-1 rounded-full bg-zinc-400/60" />
                  <div className="h-1 w-1 rounded-full bg-zinc-400/60" />
                  <div className="h-1 w-1 rounded-full bg-zinc-400/60" />
                </div>
              </Separator>

              {/* Right Column: Input + Visualization + Step Explanation */}
              <Panel
                defaultSize={56}
                minSize={38}
                maxSize={72}
                className="flex flex-col"
              >
                <div className="h-[530px] flex flex-col justify-between gap-3">
                  {/* Input Presets */}
                  <InputPresetsPanel
                    presets={presets}
                    activePresetId={activePreset.id}
                    onSelectPreset={setActivePreset}
                    formattedDisplay={formatInputDisplay(activePreset.value)}
                  />

                  {/* Visualization Card */}
                  <div className="flex-1 min-h-[300px] rounded-2xl border border-white/10 bg-black p-4 flex items-center justify-center relative overflow-hidden shadow-2xl">
                    {activeApproach?.renderVisual(
                      currentStep,
                      activePreset.value,
                    )}
                  </div>

                  {/* Step Explanation Banner */}
                  <StepExplanationBanner explanation={currentStep.explanation} />
                </div>
              </Panel>
            </Group>
          </div>

          {/* Mobile / Tablet Stacked Layout */}
          <div className="md:hidden desktop:hidden flex flex-col gap-4">
            <div className="h-[400px] rounded-2xl border border-white/10 bg-black overflow-hidden flex flex-col shadow-2xl">
              <CodeViewerPanel
                templates={activeApproach?.templates || {}}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
                activeStepKey={currentStep.id}
              />
            </div>

            <div className="flex flex-col gap-3">
              <InputPresetsPanel
                presets={presets}
                activePresetId={activePreset.id}
                onSelectPreset={setActivePreset}
                formattedDisplay={formatInputDisplay(activePreset.value)}
              />

              <div className="h-[320px] rounded-2xl border border-white/10 bg-black p-4 flex items-center justify-center relative overflow-hidden shadow-2xl">
                {activeApproach?.renderVisual(currentStep, activePreset.value)}
              </div>

              <StepExplanationBanner explanation={currentStep.explanation} />
            </div>
          </div>

          {/* Bottom Transport Bar */}
          <div className="w-full mt-1">
            <ProblemTransportBar
              currentIndex={currentIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              onStepNext={() =>
                setCurrentIndex((i) => Math.min(steps.length - 1, i + 1))
              }
              onSeek={setCurrentIndex}
              onSpeedChange={setSpeed}
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
