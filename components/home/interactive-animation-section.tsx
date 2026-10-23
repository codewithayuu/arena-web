"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Sparkles, ArrowRight, Eye, Code2, CheckCircle2 } from "lucide-react";
import { SpecularButton } from "@/components/reactbits/specular-button";

interface Step {
  nums: number[];
  i: number;
  insertPos: number;
  action: string;
  codeHighlight: number;
}

const STEPS: Step[] = [
  {
    nums: [0, 1, 0, 3, 12],
    i: 0,
    insertPos: 0,
    action: "Initial state. Pointer i = 0 (scanner), insertPos = 0 (next non-zero placement index).",
    codeHighlight: 1,
  },
  {
    nums: [0, 1, 0, 3, 12],
    i: 0,
    insertPos: 0,
    action: "nums[0] is 0. Skip swapping. Advance scanner i to 1.",
    codeHighlight: 2,
  },
  {
    nums: [1, 0, 0, 3, 12],
    i: 1,
    insertPos: 1,
    action: "nums[1] = 1 (non-zero!). Swap nums[insertPos] (0) with nums[1] (1). Increment insertPos to 1.",
    codeHighlight: 3,
  },
  {
    nums: [1, 0, 0, 3, 12],
    i: 2,
    insertPos: 1,
    action: "nums[2] is 0. Skip swapping. Advance scanner i to 3.",
    codeHighlight: 2,
  },
  {
    nums: [1, 3, 0, 0, 12],
    i: 3,
    insertPos: 2,
    action: "nums[3] = 3 (non-zero!). Swap nums[1] (0) with nums[3] (3). Increment insertPos to 2.",
    codeHighlight: 3,
  },
  {
    nums: [1, 3, 12, 0, 0],
    i: 4,
    insertPos: 3,
    action: "nums[4] = 12 (non-zero!). Swap nums[2] (0) with nums[4] (12). Increment insertPos to 3.",
    codeHighlight: 3,
  },
  {
    nums: [1, 3, 12, 0, 0],
    i: 5,
    insertPos: 3,
    action: "Scanner reached end of array. All non-zeroes preserved in order, zeroes pushed to back! ✅",
    codeHighlight: 4,
  },
];

export function InteractiveAnimationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") {
      setIsSectionVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsSectionVisible(entry.isIntersecting);
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isSectionVisible || prefersReducedMotion) setIsPlaying(false);
  }, [isSectionVisible, prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying || !isSectionVisible || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, isSectionVisible, prefersReducedMotion]);

  const step = STEPS[currentStepIndex];

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <section ref={sectionRef} className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FF1018]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Text & Value Proposition (Text on Left!) */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/30">
              <Eye className="w-3.5 h-3.5 text-[#FF1018]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
                WE TEACH BY ANIMATIONS
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
                The why, not just the what.
                <br />
                <span className="bg-gradient-to-r from-[#FF3B41] via-[#FF1018] to-[#CC0D13] bg-clip-text text-transparent">
                  You&apos;ll Actually Understand It.
                </span>
              </h2>
            </div>

            <p className="text-base text-[#94a3b8] leading-relaxed">
              Most platforms give you dry solution code and leave you wondering how someone came up with it.
              We break down the algorithmic invariants through interactive step-by-step visual animations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>See pointers move, windows expand, and arrays partition live</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <span>Active code line highlighting syncs with visual memory states</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>Gain the mental reflex to re-derive patterns on live whiteboards</span>
              </div>
            </div>

            {/* Specular Button CTA */}
            <div className="pt-3">
              <Link href="/practice/dsa-patterns">
                <SpecularButton
                  size="md"
                  radius={14}
                  lineColor="#FF3B41"
                  tint="#FF1018"
                  tintOpacity={0.16}
                  glow={1.4}
                >
                  <span>Browse 70+ Visual Animations</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SpecularButton>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Visualizer Card (Visualizer on Right!) */}
          <div className="md:col-span-7">
            <div className="rounded-2xl bg-[#14141F] border border-[#1E1E2E] shadow-2xl overflow-hidden">
              {/* Top Control Header */}
              <div className="px-5 py-3 border-b border-[#1E1E2E] bg-[#10101A] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF1018]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono font-medium text-white ml-1">
                    Pattern 01: Two Pointers (In-Place Partitioning)
                  </span>
                </div>

                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#0E7490]/15 border border-[#0E7490]/35 text-[#38BDF8]">
                  Step {currentStepIndex + 1} of {STEPS.length}
                </span>
              </div>

              {/* Interactive Simulation Stage */}
              <div className="p-5 sm:p-6 space-y-6 bg-[#0B0B13]/60">
                {/* Visual Pointer Legend */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#FF1018]" />
                    <span className="text-zinc-300">
                      <strong className="text-white">insertPos</strong> (Write)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-[#38BDF8]" />
                    <span className="text-zinc-300">
                      <strong className="text-white">i</strong> (Scanner)
                    </span>
                  </div>
                </div>

                {/* Interactive Array Elements */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-2 overflow-x-auto">
                  {step.nums.map((val, idx) => {
                    const isScanner = step.i === idx;
                    const isInsert = step.insertPos === idx;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5">
                        <div className="h-5 flex items-center justify-center">
                          {isScanner && (
                            <div className="flex flex-col items-center animate-bounce">
                              <span className="text-[10px] font-mono font-bold text-[#38BDF8]">i</span>
                              <span className="text-[#38BDF8] text-[10px]">▼</span>
                            </div>
                          )}
                        </div>

                        <div
                          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-sm sm:text-lg font-bold font-mono transition-all duration-300 ${
                            isScanner && isInsert
                              ? "bg-gradient-to-br from-[#FF1018]/30 to-[#38BDF8]/30 border-2 border-[#FF1018] text-white shadow-lg"
                              : isScanner
                              ? "bg-[#38BDF8]/15 border-2 border-[#38BDF8] text-[#38BDF8] shadow-md shadow-[#38BDF8]/20"
                              : isInsert
                              ? "bg-[#FF1018]/15 border-2 border-[#FF1018] text-[#FF3B41] shadow-md shadow-[#FF1018]/20"
                              : "bg-[#14141F] border border-[#1E1E2E] text-zinc-300"
                          }`}
                        >
                          {val}
                        </div>

                        <div className="h-5 flex items-center justify-center">
                          {isInsert && (
                            <div className="flex flex-col items-center">
                              <span className="text-[#FF1018] text-[10px]">▲</span>
                              <span className="text-[9px] font-mono font-bold text-[#FF1018]">pos</span>
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-zinc-500">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                {/* Invariant Explanation Box */}
                <div className="p-3.5 rounded-xl bg-[#14141F] border border-[#1E1E2E] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[#F4F3FC] leading-relaxed">
                    {step.action}
                  </p>
                </div>

                {/* Algorithm Code Snippet */}
                <div className="p-3 rounded-xl bg-[#09090E] border border-[#1E1E2E] font-mono text-xs text-zinc-300 space-y-1">
                  <div className="text-zinc-500 pb-1 flex items-center gap-1.5 text-[11px]">
                    <Code2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>MoveZeroes.cpp</span>
                  </div>
                  <div className={step.codeHighlight === 1 ? "text-white bg-[#1E1E2E]/80 px-2 py-0.5 rounded" : "px-2 py-0.5"}>
                    <span className="text-[#38BDF8]">int</span> insertPos = <span className="text-amber-400">0</span>;
                  </div>
                  <div className={step.codeHighlight === 2 ? "text-white bg-[#1E1E2E]/80 px-2 py-0.5 rounded" : "px-2 py-0.5"}>
                    <span className="text-[#FF3B41]">for</span> (<span className="text-[#38BDF8]">int</span> i = <span className="text-amber-400">0</span>; i &lt; n; i++) &#123;
                  </div>
                  <div className={step.codeHighlight === 3 ? "text-white bg-[#FF1018]/20 border-l-2 border-[#FF1018] px-2 py-0.5 rounded" : "px-2 py-0.5"}>
                    &nbsp;&nbsp;<span className="text-[#FF3B41]">if</span> (nums[i] != <span className="text-amber-400">0</span>) swap(nums[insertPos++], nums[i]);
                  </div>
                  <div className="px-2 py-0.5">&#125;</div>
                </div>

                {/* Simulation Controls Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E1E2E]/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStepIndex === 0}
                      className="p-2 rounded-lg bg-[#14141F] hover:bg-[#1E1E2E] text-zinc-300 hover:text-white border border-[#1E1E2E] disabled:opacity-40 transition-colors cursor-pointer"
                      title="Previous Step"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      disabled={prefersReducedMotion}
                      title={prefersReducedMotion ? "Autoplay is disabled by your reduced motion preference" : undefined}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FF1018] hover:bg-[#E00E15] text-white text-xs font-semibold shadow-md transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={currentStepIndex >= STEPS.length - 1}
                      className="p-2 rounded-lg bg-[#14141F] hover:bg-[#1E1E2E] text-zinc-300 hover:text-white border border-[#1E1E2E] disabled:opacity-40 transition-colors cursor-pointer"
                      title="Next Step"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-2 rounded-lg bg-[#14141F] hover:bg-[#1E1E2E] text-zinc-400 hover:text-zinc-200 border border-[#1E1E2E] transition-colors cursor-pointer"
                      title="Reset"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-[11px] font-mono text-[#38BDF8]">
                    Time $O(n)$ | Space $O(1)$
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
