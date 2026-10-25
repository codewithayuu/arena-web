"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Trophy, User, Briefcase, Code } from "@/components/animate-ui/icons";
import { TechText } from "@/components/TechText/TechText";
import { TrueFocus } from "@/components/TrueFocus/TrueFocus";

export function HeroElite() {
  return (
    <section className="relative w-full pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden bg-transparent text-white">
      {/* Ambient Crimson Glow (Soft radial illumination behind content) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(255,16,24,0.12)_0%,transparent_70%)] blur-[120px] transform-gpu will-change-transform"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col items-center text-center">
        {/* Subtle Category Lead */}
        <div className="flex items-center gap-2 mb-6 text-xs font-mono tracking-widest text-[#FF3B41] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] motion-safe:animate-pulse" />
          <span>The Algorithmic Society of MAIT</span>
        </div>

        {/* Display Headline with TechText Interactive Matrix */}
        <div className="w-full max-w-5xl h-[240px] sm:h-[300px] md:h-[360px] lg:h-[420px] relative select-none">
          <h1 className="sr-only">Where Complex Algorithms Transform Into Pure Intuition</h1>
          <TechText
            text={"Where Complex\nAlgorithms Transform\nInto Pure Intuition"}
            fontWeight={800}
            fontSize={84}
            lineHeight={1.12}
            letterSpacing={0}
            color="#ffffff"
            accentColor="#FF1018"
            highlightWords={["Pure", "Intuition"]}
            highlightColor="#FF1018"
            highlightBoxColor="#ffffff"
            align="center"
            reveal="letter"
            dashLength={4}
            dashGap={2}
            specks={16}
            intro="none"
            clickKick={true}
            draggable={true}
            bounce={0.75}
            sweep={true}
            speed={1}
            guides={false}
            labels={false}
            fontFamily='"Plus Jakarta Sans", system-ui, -apple-system, sans-serif'
          />
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-lg sm:text-xl md:text-2xl text-zinc-400 font-normal max-w-3xl leading-relaxed">
          The collaborative campus arena for mastering data structures, algorithms, and real-time contest battles.
          Built for society members with curated problem banks and peer competition.
        </p>

        {/* Dual CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/learn/beginners"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FF1018] hover:bg-[#E00C14] text-white font-medium text-base shadow-lg shadow-[#FF1018]/25 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>

          <Link
            href="/topic-list"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-base backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
          >
            <Code className="w-4 h-4 text-zinc-400" />
            <span>Explore Curriculum</span>
          </Link>
        </div>

        {/* Society Capabilities Row with TrueFocus HUD Tracking */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] w-full max-w-6xl text-left">
          <TrueFocus
            focusStyle="brackets"
            easing="spring"
            order="sequential"
            blurAmount={0}
            focusScale={1.02}
            unfocusedOpacity={0.65}
            borderColor="#FF1018"
            glowColor="rgba(255, 16, 24, 0.45)"
            cornerSize={14}
            borderWidth={2}
            frameGap={8}
            animationDuration={0.4}
            pauseBetweenAnimations={1.6}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full"
            items={[
              {
                id: "society-members",
                className: "p-2 rounded-lg",
                content: (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
                      <User className="w-3.5 h-3.5 text-[#FF3B41]" />
                      <span>Society Cohort</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">100+ Members</div>
                    <p className="text-xs text-zinc-500">Peer campus developers</p>
                  </div>
                ),
              },
              {
                id: "curated-problems",
                className: "p-2 rounded-lg",
                content: (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Curated Bank</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">12,000+ Problems</div>
                    <p className="text-xs text-zinc-500">Patterns &amp; company sheets</p>
                  </div>
                ),
              },
              {
                id: "weekly-arena",
                className: "p-2 rounded-lg",
                content: (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Weekly Arena</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">Sunday Sprints</div>
                    <p className="text-xs text-zinc-500">Intra-society battles</p>
                  </div>
                ),
              },
              {
                id: "placement-ready",
                className: "p-2 rounded-lg",
                content: (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono uppercase">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Career Tracks</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">Placement Ready</div>
                    <p className="text-xs text-zinc-500">DSA to System Design</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
