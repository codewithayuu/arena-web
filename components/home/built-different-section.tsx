"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  Eye,
  Target,
  Terminal,
  Compass,
  ArrowRight,
} from "lucide-react";
import { FlipCard } from "@/components/reactbits/flip-card";
import { SpecularButton } from "@/components/reactbits/specular-button";

export function BuiltDifferentSection() {
  const differentiators = [
    {
      icon: Eye,
      title: "Visual Intuition First",
      desc: "Pointer movements and memory state changes animated step-by-step.",
    },
    {
      icon: Target,
      title: "70+ Core Patterns",
      desc: "Master the algorithmic invariants behind 95% of technical interviews.",
    },
    {
      icon: Terminal,
      title: "In-Browser Monaco IDE",
      desc: "Instant compilation in C++, Python, Java & JS with test evaluation.",
    },
    {
      icon: Compass,
      title: "Milestone-Driven Roadmaps",
      desc: "Structured paths curated by ICPC medalists and FAANG engineers.",
    },
  ];

  const frontContent = (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[20px]">
      <Image
        src="/images/memoization.png"
        alt="Mindflare DSA Patterns Visual"
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 420px"
        priority
      />
    </div>
  );

  const backContent = (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-[20px]">
      <Image
        src="/images/Time-complexity.png"
        alt="Mindflare System Design Architecture"
        fill
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, 420px"
      />
    </div>
  );

  return (
    <section className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Subtle top divider with obsidian gradient */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1E1E2E] to-transparent" />

      {/* Note: Red background glow removed completely per user instructions */}

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column: Clean Minimalist Copy & Feature Grid */}
          <div className="md:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/25">
              <Sparkles className="w-3.5 h-3.5 text-[#FF1018]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
                BUILT DIFFERENT
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
                What Makes MindFlare Best
              </h2>
              <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed max-w-xl">
                Most platforms teach through rote problem repetition. MindFlare
                cultivates mental models, pattern recognition reflexes, and deep
                algorithmic intuition.
              </p>
            </div>

            {/* Differentiators Grid with Dim Reddish Hover Glow */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {differentiators.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#09090E] border border-[#1E1E2E] transition-all duration-300 hover:border-[#FF1018]/45 hover:shadow-[0_0_18px_-4px_rgba(255,16,24,0.22)] flex flex-col gap-1.5 cursor-default group/card"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#000000] border border-[#1E1E2E] group-hover/card:border-[#FF1018]/40 flex items-center justify-center text-[#FF1018] transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover/card:text-[#FF3B41] transition-colors">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#94a3b8] leading-relaxed pl-9">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link href="/practice/dsa-patterns">
                <SpecularButton
                  size="md"
                  radius={14}
                  lineColor="#FF3B41"
                  tint="#FF1018"
                  tintOpacity={0.16}
                  glow={1.2}
                >
                  <span>Explore DSA Patterns</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SpecularButton>
              </Link>
            </div>
          </div>

          {/* Right Column: Textless Image-Only Flip Card with Dim Reddish Hover Glow */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group rounded-[22px] transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(255,16,24,0.28)]">
              <FlipCard
                front={frontContent}
                back={backContent}
                width={350}
                height={450}
                radius={20}
                background="#000000"
                color="#F4F3FC"
                glare={true}
                tilt={true}
                glareOpacity={0.16}
                shadow={false}
                ariaLabel="Mindflare Visual Preview Card"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
