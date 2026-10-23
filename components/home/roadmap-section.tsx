"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Map,
  ArrowRight,
  Download,
  Code2,
  Terminal,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { SpecularButton } from "@/components/reactbits/specular-button";

type TrackKey = "web" | "cp" | "app";

interface RoadmapStep {
  step: string;
  title: string;
  category: string;
  desc: string;
  badge?: "start" | "end" | "core";
}

interface TrackData {
  id: TrackKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  pdfUrl: string;
  pdfFilename: string;
  steps: RoadmapStep[];
}

const TRACKS: Record<TrackKey, TrackData> = {
  web: {
    id: "web",
    label: "Web Development",
    icon: Code2,
    tagline: "HTML/CSS fundamentals to full-stack Next.js and cloud deployment.",
    pdfUrl: "/roadmaps/Mindflare-Web-Developer-Roadmap.pdf",
    pdfFilename: "Mindflare-Web-Developer-Roadmap.pdf",
    steps: [
      {
        step: "01",
        title: "HTML5 & Semantics",
        category: "Markup",
        desc: "Semantic tags, forms, SEO, and web accessibility.",
        badge: "start",
      },
      {
        step: "02",
        title: "CSS3 & Tailwind",
        category: "Styling",
        desc: "Flexbox, CSS Grid, and responsive UI design.",
        badge: "core",
      },
      {
        step: "03",
        title: "JavaScript (ES6+)",
        category: "Scripting",
        desc: "Event loop, Promises, async/await, and DOM.",
        badge: "core",
      },
      {
        step: "04",
        title: "Node.js & Express",
        category: "Backend",
        desc: "REST APIs, middleware, and auth tokens.",
        badge: "core",
      },
      {
        step: "05",
        title: "React.js",
        category: "UI Arch",
        desc: "Components, hooks, Virtual DOM, and state.",
        badge: "core",
      },
      {
        step: "06",
        title: "PostgreSQL & Prisma",
        category: "Database",
        desc: "Relational schemas, SQL queries, and ORM.",
        badge: "core",
      },
      {
        step: "07",
        title: "Next.js App Router",
        category: "Full Stack",
        desc: "Server components, SSR, and Server Actions.",
        badge: "core",
      },
      {
        step: "08",
        title: "Docker & Auth",
        category: "DevOps",
        desc: "Containers, JWT/OAuth, and env security.",
        badge: "core",
      },
      {
        step: "09",
        title: "Production Scale",
        category: "Cloud",
        desc: "CI/CD pipelines, caching, and edge hosting.",
        badge: "end",
      },
    ],
  },
  cp: {
    id: "cp",
    label: "Competitive Programming",
    icon: Terminal,
    tagline: "From pointer fundamentals to segment trees and ICPC grandmaster tiers.",
    pdfUrl: "/roadmaps/Competitive-Programming-Syllabus.pdf",
    pdfFilename: "Mindflare-Competitive-Programming-Syllabus.pdf",
    steps: [
      {
        step: "01",
        title: "C++ & STL",
        category: "Language",
        desc: "Fast I/O, vectors, maps, and Big-O asymptotics.",
        badge: "start",
      },
      {
        step: "02",
        title: "Number Theory",
        category: "Discrete Math",
        desc: "GCD, prime sieves, modular inverse, and Fermat.",
        badge: "core",
      },
      {
        step: "03",
        title: "Binary Search",
        category: "Search Space",
        desc: "Lower/upper bound and search on answer.",
        badge: "core",
      },
      {
        step: "04",
        title: "Two Pointers & Window",
        category: "Pointers",
        desc: "Subarray sums, invariants, and deques.",
        badge: "core",
      },
      {
        step: "05",
        title: "Greedy & Sorting",
        category: "Constructive",
        desc: "Interval scheduling and custom comparators.",
        badge: "core",
      },
      {
        step: "06",
        title: "Trees & Graphs",
        category: "Graph Theory",
        desc: "BFS, DFS, Dijkstra, Topo Sort, and DSU.",
        badge: "core",
      },
      {
        step: "07",
        title: "Dynamic Programming",
        category: "Optimization",
        desc: "1D/2D memoization, knapsack, and bitmasks.",
        badge: "core",
      },
      {
        step: "08",
        title: "Segment Trees & BIT",
        category: "Range Queries",
        desc: "Point/range updates and lazy propagation.",
        badge: "core",
      },
      {
        step: "09",
        title: "ICPC Grandmaster",
        category: "Elite Contests",
        desc: "Tree DP, Heavy-Light decomp, and flows.",
        badge: "end",
      },
    ],
  },
  app: {
    id: "app",
    label: "App Development",
    icon: Smartphone,
    tagline: "Build fluid, cross-platform mobile apps with native capabilities.",
    pdfUrl: "/roadmaps/Mindflare-Web-Developer-Roadmap.pdf",
    pdfFilename: "Mindflare-Mobile-App-Roadmap.pdf",
    steps: [
      {
        step: "01",
        title: "Dart / Kotlin Basics",
        category: "Syntax",
        desc: "OOP fundamentals, async tasks, and types.",
        badge: "start",
      },
      {
        step: "02",
        title: "Widget Layouts",
        category: "UI Tree",
        desc: "Constraints, flex containers, and themes.",
        badge: "core",
      },
      {
        step: "03",
        title: "State Management",
        category: "Reactive",
        desc: "Bloc, Provider, Riverpod, or Zustand.",
        badge: "core",
      },
      {
        step: "04",
        title: "REST & GraphQL",
        category: "Networking",
        desc: "Async HTTP, serialization, and intercepts.",
        badge: "core",
      },
      {
        step: "05",
        title: "Offline SQLite",
        category: "Storage",
        desc: "Room DB, SQLite, MMKV, and cache sync.",
        badge: "core",
      },
      {
        step: "06",
        title: "Native Device APIs",
        category: "Hardware",
        desc: "Camera, GPS geolocation, and biometrics.",
        badge: "core",
      },
      {
        step: "07",
        title: "Push Notifications",
        category: "Cloud Messaging",
        desc: "FCM, APNs, background workers, and links.",
        badge: "core",
      },
      {
        step: "08",
        title: "CI/CD & Testing",
        category: "Automation",
        desc: "Fastlane, widget tests, and TestFlight.",
        badge: "core",
      },
      {
        step: "09",
        title: "Store Publishing",
        category: "Production",
        desc: "Play Console, App Store, and analytics.",
        badge: "end",
      },
    ],
  },
};

export function RoadmapSection() {
  const [activeTrack, setActiveTrack] = useState<TrackKey>("web");
  const track = TRACKS[activeTrack];

  // 9 steps grouped into 3 rows:
  // Row 1: 1 -> 2 -> 3
  // Row 2: 6 <- 5 <- 4
  // Row 3: 7 -> 8 -> 9
  const row1 = track.steps.slice(0, 3);
  const step4 = track.steps[3];
  const step5 = track.steps[4];
  const step6 = track.steps[5];
  const row3 = track.steps.slice(6, 9);

  return (
    <section className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Subtle top divider with obsidian gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        {/* 2-Column Grid: Component on the LEFT, Content on the RIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Compact Roadmap Component (3 buttons + 9-box snake pattern) */}
          <div className="md:col-span-7 order-2 md:order-1">
            {/* 3 Buttons in 1 Line */}
            <div className="flex items-center justify-center md:justify-start mb-6">
              <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#09090E] border border-[#1E1E2E] shadow-lg overflow-x-auto max-w-full">
                {(["web", "cp", "app"] as const).map((key) => {
                  const item = TRACKS[key];
                  const Icon = item.icon;
                  const isActive = activeTrack === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveTrack(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#FF1018] text-white shadow-sm shadow-[#FF1018]/25 border border-[#FF3B41]"
                          : "text-zinc-400 hover:text-white hover:bg-[#14141F] border border-transparent"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop / Tablet Compact Snake Grid */}
            <div className="hidden sm:block space-y-3.5 bg-[#050508] p-4 sm:p-5 rounded-2xl border border-[#1E1E2E]">
              {/* Row 1: 1 -> 2 -> 3 */}
              <div className="grid grid-cols-3 gap-3 items-center relative">
                {row1.map((item, idx) => (
                  <div key={item.step} className="relative flex items-center">
                    <div className="w-full">
                      <CompactRoadmapBox step={item} />
                    </div>
                    {/* Horizontal Arrow Right */}
                    {idx < 2 && (
                      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-[#FF1018] pointer-events-none">
                        <span className="w-2.5 h-0.5 bg-[#FF1018]" />
                        <ChevronRight className="w-3.5 h-3.5 -ml-1 text-[#FF1018] stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical Connector: Row 1 to Row 2 (Right side: 3 -> 4) */}
              <div className="grid grid-cols-3 gap-3 pointer-events-none">
                <div className="col-start-3 flex justify-center py-0.5">
                  <div className="flex flex-col items-center text-[#FF1018]">
                    <span className="w-0.5 h-3 bg-[#FF1018]" />
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-[#FF1018] stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Row 2: 6 <- 5 <- 4 (Visual positions: Col 1 = 6, Col 2 = 5, Col 3 = 4) */}
              <div className="grid grid-cols-3 gap-3 items-center relative">
                {/* Col 1: Step 6 */}
                <div className="relative">
                  <CompactRoadmapBox step={step6} />
                </div>

                {/* Col 2: Step 5 with left arrow to Step 6 */}
                <div className="relative flex items-center">
                  <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-[#FF1018] pointer-events-none">
                    <ChevronLeft className="w-3.5 h-3.5 -mr-1 text-[#FF1018] stroke-[3]" />
                    <span className="w-2.5 h-0.5 bg-[#FF1018]" />
                  </div>
                  <div className="w-full">
                    <CompactRoadmapBox step={step5} />
                  </div>
                </div>

                {/* Col 3: Step 4 with left arrow to Step 5 */}
                <div className="relative flex items-center">
                  <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-[#FF1018] pointer-events-none">
                    <ChevronLeft className="w-3.5 h-3.5 -mr-1 text-[#FF1018] stroke-[3]" />
                    <span className="w-2.5 h-0.5 bg-[#FF1018]" />
                  </div>
                  <div className="w-full">
                    <CompactRoadmapBox step={step4} />
                  </div>
                </div>
              </div>

              {/* Vertical Connector: Row 2 to Row 3 (Left side: 6 -> 7) */}
              <div className="grid grid-cols-3 gap-3 pointer-events-none">
                <div className="col-start-1 flex justify-center py-0.5">
                  <div className="flex flex-col items-center text-[#FF1018]">
                    <span className="w-0.5 h-3 bg-[#FF1018]" />
                    <ChevronDown className="w-3.5 h-3.5 -mt-1 text-[#FF1018] stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Row 3: 7 -> 8 -> 9 */}
              <div className="grid grid-cols-3 gap-3 items-center relative">
                {row3.map((item, idx) => (
                  <div key={item.step} className="relative flex items-center">
                    <div className="w-full">
                      <CompactRoadmapBox step={item} />
                    </div>
                    {/* Horizontal Arrow Right */}
                    {idx < 2 && (
                      <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-[#FF1018] pointer-events-none">
                        <span className="w-2.5 h-0.5 bg-[#FF1018]" />
                        <ChevronRight className="w-3.5 h-3.5 -ml-1 text-[#FF1018] stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Stacked View */}
            <div className="sm:hidden space-y-3">
              {track.steps.map((item, idx) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="w-full">
                    <CompactRoadmapBox step={item} />
                  </div>
                  {idx < track.steps.length - 1 && (
                    <div className="py-1 text-[#FF1018]">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Copy, Benefits & CTAs */}
          <div className="md:col-span-5 space-y-6 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/25">
              <Map className="w-3.5 h-3.5 text-[#FF1018]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
                STRUCTURED ROADMAPS
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
                Finally, a clear path forward.
                <br />
                <span className="bg-gradient-to-r from-[#FF3B41] via-[#FF1018] to-[#CC0D13] bg-clip-text text-transparent">
                  No More Tutorial Hell.
                </span>
              </h2>

              <p className="text-base text-[#94a3b8] leading-relaxed">
                Stop jumping between 15 scattered YouTube playlists. Follow cohesive, milestone-driven roadmaps designed by ICPC medalists and senior engineers.
              </p>
            </div>

            {/* Differentiator Checklist */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>Logical prerequisite sequencing so you never hit a learning wall</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <span>Direct mapping to high-frequency LeetCode and system design questions</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>Downloadable high-resolution printable PDF roadmaps and checklists</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/roadmaps">
                <SpecularButton
                  size="md"
                  radius={14}
                  lineColor="#FF3B41"
                  tint="#FF1018"
                  tintOpacity={0.16}
                  glow={1.2}
                >
                  <span>Explore Roadmaps</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SpecularButton>
              </Link>

              <a
                href={track.pdfUrl}
                download={track.pdfFilename}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#09090E] hover:bg-[#14141F] text-[#F4F3FC] border border-[#1E1E2E] hover:border-[#FF1018]/40 font-semibold text-xs sm:text-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#FF1018]" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CompactRoadmapBox({ step }: { step: RoadmapStep }) {
  const isStart = step.badge === "start";
  const isEnd = step.badge === "end";

  return (
    <div
      className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-300 relative group bg-[#09090E] ${
        isStart
          ? "border-emerald-500/40 shadow-[0_0_15px_-6px_rgba(16,185,129,0.2)]"
          : isEnd
          ? "border-[#FF1018]/50 shadow-[0_0_18px_-6px_rgba(255,16,24,0.25)]"
          : "border-[#1E1E2E] hover:border-[#FF1018]/40 hover:shadow-[0_0_15px_-6px_rgba(255,16,24,0.2)]"
      }`}
    >
      {/* Top Header: Step Badge & Category */}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span
          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
            isStart
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
              : isEnd
              ? "bg-[#FF1018]/20 border border-[#FF1018]/40 text-[#FF3B41]"
              : "bg-[#14141F] border border-[#1E1E2E] text-zinc-400"
          }`}
        >
          {isStart ? "START" : isEnd ? "GOAL" : step.step}
        </span>

        <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[70px]">
          {step.category}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF3B41] transition-colors truncate">
        {step.title}
      </h4>

      {/* Detail */}
      <p className="text-[10px] sm:text-[11px] text-[#94a3b8] leading-snug line-clamp-1 mt-0.5">
        {step.desc}
      </p>
    </div>
  );
}
