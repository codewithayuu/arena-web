"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Network,
  Cpu,
  Sigma,
} from "lucide-react";
import { SpecularButton } from "@/components/reactbits/specular-button";

export function TopicListShowcaseSection() {
  const featuredCategories = [
    {
      title: "Algorithmic Paradigms",
      icon: Sparkles,
      topics: ["Two Pointers", "Sliding Window", "Binary Search", "Divide & Conquer"],
      tier: "Core Foundation",
      tierColor: "text-[#38BDF8] bg-[#0E7490]/15 border-[#0E7490]/35",
    },
    {
      title: "Trees & Advanced Graphs",
      icon: Network,
      topics: ["Segment Trees", "Fenwick (BIT)", "Binary Lifting", "Dijkstra"],
      tier: "Intermediate to Hard",
      tierColor: "text-amber-400 bg-amber-500/15 border-amber-500/35",
    },
    {
      title: "Dynamic Programming",
      icon: Cpu,
      topics: ["Knapsack & Subsets", "Digit DP", "Bitmask DP", "Tree DP"],
      tier: "High-Yield FAANG",
      tierColor: "text-[#FF3B41] bg-[#FF1018]/15 border-[#FF1018]/35",
    },
    {
      title: "Strings & Advanced Math",
      icon: Sigma,
      topics: ["Trie & KMP", "Z-Algorithm", "Modular Arithmetic", "Sieve"],
      tier: "ICPC Grandmaster",
      tierColor: "text-purple-400 bg-purple-500/15 border-purple-500/35",
    },
  ];

  return (
    <section className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Subtle top divider with obsidian gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent" />

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#FF1018]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* LEFT COLUMN: Standing Image tilted 18 degrees facing the content on the right */}
          <div className="md:col-span-5 flex justify-center items-center order-2 md:order-1">
            <div className="relative group [perspective:1200px] w-full max-w-[380px]">
              {/* Ground reflection shadow */}
              <div
                aria-hidden="true"
                className="absolute -bottom-6 inset-x-8 h-8 bg-[#FF1018]/15 rounded-full blur-xl pointer-events-none transition-all duration-500 group-hover:bg-[#FF1018]/25"
              />

              {/* 3D Standing Image Frame – tilted +18deg rotateY so its face turns toward the content on the right */}
              <div
                className="relative rounded-2xl overflow-hidden border border-[#1E1E2E] group-hover:border-[#FF1018]/50 bg-black transition-all duration-500 ease-out shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_30px_-5px_rgba(255,16,24,0.22)] [transform:rotateY(18deg)_rotateX(2deg)] group-hover:[transform:rotateY(10deg)_rotateX(1deg)_scale(1.02)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Image Container with 4:5 aspect ratio */}
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="/images/ultimate-list.png"
                    alt="The Ultimate Topic List Knowledge Graph"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, 400px"
                    priority
                  />
                  {/* Subtle glass sheen gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/5 pointer-events-none" />
                </div>

                {/* Subtle bottom edge reflection */}
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF1018]/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Content (Badge, Heading, Description, Categories, CTA) */}
          <div className="md:col-span-7 space-y-8 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/25">
              <BookOpen className="w-3.5 h-3.5 text-[#FF1018]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
                COMPREHENSIVE KNOWLEDGE GRAPH
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
                The Ultimate Topic List
              </h2>
              <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-xl">
                A structured catalog of 576+ competitive programming and CS topics across 32 categories. Each topic is mapped with difficulty tiers, practice problems, and study notes.
              </p>
            </div>

            {/* Topic Category Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {featuredCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-[#09090E] border border-[#1E1E2E] hover:border-[#FF1018]/30 transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#FF1018]" />
                        <h4 className="text-xs font-bold text-white">
                          {cat.title}
                        </h4>
                      </div>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${cat.tierColor}`}
                      >
                        {cat.tier}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {cat.topics.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#000000] border border-[#1E1E2E] text-zinc-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Specular Button CTA */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link href="/topic-list">
                <SpecularButton
                  size="md"
                  radius={14}
                  lineColor="#FF3B41"
                  tint="#FF1018"
                  tintOpacity={0.16}
                  glow={1.2}
                >
                  <span>Explore 576+ Topics</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SpecularButton>
              </Link>

              <span className="text-xs text-zinc-500 font-mono">
                32 Categories • Activity Heatmap
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
