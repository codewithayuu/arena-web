"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Code,
  Briefcase,
  ArrowRight,
  CircleCheck,
  Terminal,
  Flame,
  Sparkles,
} from "@/components/animate-ui/icons";
import SpotlightCard from "@/components/SpotlightCard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TooltipProvider, SimpleTooltip } from "@/components/animate-ui/tooltip";

interface PracticeTrack {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  difficultyRange: string;
  description: string;
  topics: string[];
  actionLabel: string;
  stats: string;
}

const PRACTICE_TRACKS: PracticeTrack[] = [
  {
    id: "topic-list",
    title: "Curriculum Topic List",
    href: "/topic-list",
    icon: BookOpen,
    badge: "Core Curriculum",
    difficultyRange: "Very Easy to Very Hard",
    description:
      "Structured competitive programming and CS curriculum with 576+ topics across 32 categories, practice flags, importance tiers, and activity heatmap.",
    topics: ["Basic Programming", "Data Structures", "Dynamic Programming", "Graph Theory"],
    actionLabel: "Explore Topic List",
    stats: "576 Topics • 32 Categories • Activity Heatmap",
  },
  {
    id: "dsa-patterns",
    title: "DSA Patterns",
    href: "/practice/dsa-patterns",
    icon: Code,
    badge: "Algorithmic Intuition",
    difficultyRange: "Easy to Hard",
    description:
      "Master the 25 core algorithmic patterns tested in technical interviews. Build intuition across Sliding Window, Two Pointers, Monotonic Stack, Backtracking, and DP.",
    topics: ["Sliding Window", "Two Pointers", "Monotonic Stack", "DP & Trees"],
    actionLabel: "Start DSA Practice",
    stats: "25+ Patterns • 150+ Problems • AlgoMaster Sheets",
  },
  {
    id: "company-archives",
    title: "Company-Wise Archives",
    href: "/practice/company/google",
    icon: Briefcase,
    badge: "Targeted Prep",
    difficultyRange: "FAANG+ Curated",
    description:
      "Real interview problem collections asked in technical screens at Google, Meta, Amazon, Microsoft, Netflix, Apple, and Uber with LeetCode frequency rankings.",
    topics: ["Google", "Meta", "Amazon", "Microsoft", "Uber", "Apple"],
    actionLabel: "View Company Sets",
    stats: "Frequency Ranked • Direct LeetCode",
  },
];

export default function PracticeHubPage() {
  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div className="isolate min-h-screen bg-[#08080a] text-white flex flex-col relative selection:bg-red-500/20 selection:text-white overflow-x-hidden">
        {/* Dynamic Mathematical Frosted Glass Atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          {/* 1. Overhead Luminous Zenith Bloom (White frosted glass refraction) */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] opacity-85"
            style={{
              background: `radial-gradient(
                ellipse 60% 45% at 50% 0%,
                rgba(255, 255, 255, 0.16) 0%,
                rgba(255, 255, 255, 0.08) 25%,
                rgba(255, 255, 255, 0.02) 55%,
                transparent 75%
              )`,
            }}
          />

          {/* 2. Soft Mindflare Red Accent Caustic Bloom (Subsurface Scattering on left edge) */}
          <div
            className="absolute top-[18%] -left-[200px] w-[900px] h-[900px] opacity-35"
            style={{
              background: `radial-gradient(
                circle at 40% 40%,
                rgba(232, 48, 64, 0.15) 0%,
                rgba(232, 48, 64, 0.05) 35%,
                rgba(232, 48, 64, 0.01) 60%,
                transparent 75%
              )`,
            }}
          />

          {/* 3. Mid-Right Cool Atmospheric Diffuse Glow */}
          <div
            className="absolute top-[42%] -right-[250px] w-[1000px] h-[1000px] opacity-30"
            style={{
              background: `radial-gradient(
                circle at 60% 50%,
                rgba(255, 255, 255, 0.07) 0%,
                rgba(255, 255, 255, 0.02) 40%,
                transparent 70%
              )`,
            }}
          />

          {/* 4. Lower Ambient Foundation Bloom */}
          <div
            className="absolute bottom-[-10%] left-[20%] w-[1100px] h-[600px] opacity-25"
            style={{
              background: `radial-gradient(
                ellipse 70% 50% at 50% 60%,
                rgba(255, 255, 255, 0.05) 0%,
                rgba(255, 255, 255, 0.015) 50%,
                transparent 80%
              )`,
            }}
          />

          {/* 5. Mathematical Gaussian Vignette & Optical Depth Falloff */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 90% 65% at 50% 25%, transparent 25%, rgba(8, 8, 10, 0.45) 65%, #08080a 100%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 35%, rgba(4, 4, 6, 0.75) 100%)
              `,
            }}
          />

          {/* 6. Physical Micro-Grain Tactile Layer (Zero-GPU, pure SVG turbulence) */}
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <Navbar />

        {/* Main Container positioned safely below floating navbar */}
        <main className="relative z-10 flex-1 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Page Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Interactive Engineering Practice
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Practice Engineering Tracks
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Choose your focus area — from structured curriculum topics and algorithmic patterns to FAANG+ company archives.
            </p>

            {/* Highlights strip with animate-ui icons and clean typography */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs sm:text-sm text-zinc-400">
              <span className="flex items-center gap-2">
                <CircleCheck size={16} className="w-4 h-4 text-emerald-400" />
                <span>3 Master Tracks</span>
              </span>
              <span className="text-zinc-700" aria-hidden="true">•</span>
              <span className="flex items-center gap-2">
                <Terminal size={16} className="w-4 h-4 text-blue-400" />
                <span>Interactive Monaco Editor</span>
              </span>
              <span className="text-zinc-700" aria-hidden="true">•</span>
              <span className="flex items-center gap-2">
                <Flame size={16} className="w-4 h-4 text-red-500" />
                <span>Automated Test Evaluation</span>
              </span>
            </div>
          </div>

          {/* 3 Track Boxes Grid powered by SpotlightCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRACTICE_TRACKS.map((track) => {
              const Icon = track.icon;

              return (
                <SpotlightCard
                  key={track.id}
                  theme="dark"
                  spotlightColor="#e83040"
                  intensity={0.25}
                  spotlightSize={380}
                  softness={0.85}
                  shape="circle"
                  borderGlow={0.6}
                  proximity={90}
                  smoothing={0.3}
                  flare
                  className="h-full flex flex-col justify-between items-center text-center p-6 sm:p-7 rounded-2xl border border-white/10 bg-black/65 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 group"
                >
                  <div className="flex flex-col items-center text-center w-full">
                    {/* Centered Animated Icon */}
                    <div className="w-12 h-12 rounded-2xl border border-white/10 bg-black/80 flex items-center justify-center text-white/80 group-hover:text-red-500 group-hover:border-red-500/40 transition-all mb-4 shadow-sm">
                      <Icon size={24} className="w-6 h-6" />
                    </div>

                    {/* Badge / Category Title - Clean typography, no translucent pills */}
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-red-500 mb-1.5">
                      {track.badge}
                    </span>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">
                      {track.title}
                    </h2>

                    {/* Stats & Scope */}
                    <p className="text-xs font-mono text-zinc-400 mb-4">
                      {track.stats}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5 max-w-sm">
                      {track.description}
                    </p>

                    {/* Topics - Clean centered typography with dot separators */}
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-6 text-xs text-zinc-400">
                      {track.topics.map((t, idx) => (
                        <span key={t} className="inline-flex items-center">
                          <span className="text-zinc-300 font-medium">{t}</span>
                          {idx < track.topics.length - 1 && (
                            <span className="text-zinc-600 ml-2" aria-hidden="true">•</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Centered Bottom Action Area */}
                  <div className="w-full pt-4 border-t border-white/10">
                    <SimpleTooltip content={`Open ${track.title}`}>
                      <Link
                        href={track.href}
                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-red-500/20 active:translate-y-0.5 cursor-pointer"
                      >
                        <span>{track.actionLabel}</span>
                        <ArrowRight size={16} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </SimpleTooltip>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Quick Link to Roadmaps powered by SpotlightCard */}
          <SpotlightCard
            theme="dark"
            spotlightColor="#e83040"
            intensity={0.2}
            spotlightSize={500}
            softness={0.9}
            shape="beam"
            borderGlow={0.5}
            className="mt-12 rounded-2xl border border-white/10 bg-black/65 backdrop-blur-md p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
          >
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 uppercase tracking-wider">
                <Sparkles size={14} className="w-3.5 h-3.5" />
                <span>Structured Curriculum</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Explore Engineering Career &amp; Skill Roadmaps
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                Download complete guides and 16-week study roadmaps for DSA, System Design, Concurrency, and Low-Level Design.
              </p>
            </div>

            <SimpleTooltip content="Browse all engineering roadmaps">
              <Link
                href="/roadmaps"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs sm:text-sm font-semibold transition-all shadow-sm active:translate-y-0.5"
              >
                <span>View Roadmaps</span>
                <ArrowRight size={16} className="w-4 h-4" />
              </Link>
            </SimpleTooltip>
          </SpotlightCard>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
}
