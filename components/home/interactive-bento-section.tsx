"use client";

import dynamic from "next/dynamic";
import { Activity, GitFork, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// Dynamically import the heavy algorithmic simulations with lightweight skeletons
const TrappingRainWaterSimulation = dynamic(
  () =>
    import("@/components/animations/dsa/array-simulations-part1").then(
      (m) => m.TrappingRainWaterSimulation
    ),
  { ssr: false, loading: () => <SimulationLoadingCard title="Trapping Rain Water" /> }
);

const BinarySearchTreeSimulation = dynamic(
  () =>
    import("@/components/animations/dsa/trees-heaps-simulations").then(
      (m) => m.BinarySearchTreeSimulation
    ),
  { ssr: false, loading: () => <SimulationLoadingCard title="Binary Search Tree" /> }
);

function SimulationLoadingCard({ title }: { title: string }) {
  return (
    <div className="w-full h-72 rounded-2xl bg-zinc-950/40 border border-white/5 animate-pulse flex flex-col items-center justify-center p-6 text-zinc-600">
      <div className="h-6 w-32 bg-white/5 rounded-md mb-2" />
      <span className="text-xs font-mono">Loading {title}...</span>
    </div>
  );
}

export function InteractiveBentoSection() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-transparent text-white overflow-hidden">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-40 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(255,16,24,0.08)_0%,transparent_70%)] blur-[140px] transform-gpu will-change-transform"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1/4 -right-40 w-[550px] h-[550px] bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-[140px] transform-gpu will-change-transform"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF3B41] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1018]" />
              <span>Interactive Algorithmic Engine</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Don’t Just Read Solutions.{" "}
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                Run Them Live.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed pt-1">
              Interact directly with live algorithms before writing a single line of code.
              Observe state transitions, inspect invariants, and build permanent algorithmic intuition.
            </p>
          </div>

          <Link
            href="/practice"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span>Explore All 350+ Live Simulators</span>
            <ArrowRight className="w-4 h-4 text-[#FF3B41] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 
          Bento Grid Layout:
          - Desktop (>=1000px): Clean 2-column bento grid.
          - Mobile (<1000px): Silky-smooth horizontal touch snap-carousel.
        */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 overflow-x-auto lg:overflow-visible snap-x snap-proximity -mx-4 px-4 lg:mx-0 lg:px-0">
          
          {/* Bento Card 1: Trapping Rain Water */}
          <div className="snap-center shrink-0 w-[92vw] sm:w-[85vw] lg:w-auto rounded-3xl border border-white/10 hover:border-white/20 bg-[#07080c] p-6 sm:p-8 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-mono text-cyan-400">
                  <Activity className="w-4 h-4" />
                  <span className="uppercase tracking-wider">Two Pointers · Valley Physics</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-white/[0.04]">
                  O(n) Time · O(1) Space
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Trapping Rain Water Simulation
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Watch physical rainfall calculate left and right bounding elevations, settling into valleys in real time.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/60 overflow-hidden">
              <TrappingRainWaterSimulation />
            </div>
          </div>

          {/* Bento Card 2: Binary Search Tree */}
          <div className="snap-center shrink-0 w-[92vw] sm:w-[85vw] lg:w-auto rounded-3xl border border-white/10 hover:border-white/20 bg-[#07080c] p-6 sm:p-8 transition-all duration-300 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400">
                  <GitFork className="w-4 h-4" />
                  <span className="uppercase tracking-wider">Trees &amp; Heaps · Invariant</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 px-2 py-0.5 rounded bg-white/[0.04]">
                  O(h) Time · Recursive
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Binary Search Tree Traversal
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Toggle between searching target 35 and inserting node 40. Inspect real-time Left/Right decision branching.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/60 overflow-hidden">
              <BinarySearchTreeSimulation />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
