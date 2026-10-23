"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Code2, Compass } from "lucide-react";
import { FuzzyText } from "./FuzzyText";

export function Fuzzy404View() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 max-w-4xl mx-auto w-full">
      {/* Signal Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#FF1018]/10 text-[#FF4D52] border border-[#FF1018]/25 mb-4 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] animate-pulse" />
        <span>SIGNAL LOST // ROUTE INACCESSIBLE</span>
      </div>

      {/* Animated Fuzzy 404 Display */}
      <div className="py-2 select-none flex items-center justify-center">
        <FuzzyText
          colorSplit={0}
          trigger="hover"
          direction="horizontal"
          baseIntensity={0.2}
          hoverIntensity={0.5}
          fuzzRange={30}
          sliceSize={1}
          fps={60}
          transitionDuration={0}
          intro={true}
          introDuration={1400}
          letterSpacing={0}
          enableHover={true}
          clickEffect={false}
          glitchMode={false}
          glitchInterval={2000}
          glitchDuration={200}
          color="#ffffff"
          fontSize="clamp(5rem, 16vw, 12rem)"
          fontWeight={900}
        >
          404
        </FuzzyText>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
        Page Not Found in the Arena
      </h1>

      <p className="text-zinc-400 max-w-lg mx-auto mb-10 text-sm sm:text-base leading-relaxed">
        The requested page does not exist, has been archived, or is inaccessible. 
        Return to the home hub or jump directly into practice.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 w-full max-w-md">
        <Link
          href="/"
          className="group flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FF1018] hover:bg-[#E00C14] text-white font-medium text-sm shadow-lg shadow-[#FF1018]/25 transition-all duration-200 active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Arena Home</span>
        </Link>

        <Link
          href="/practice"
          className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-sm backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
        >
          <Code2 className="w-4 h-4 text-zinc-400" />
          <span>Practice Arena</span>
        </Link>

        <Link
          href="/topic-list"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/5 hover:border-white/15 bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-zinc-200 font-medium text-xs transition-all duration-200"
        >
          <Compass className="w-3.5 h-3.5 text-zinc-500" />
          <span>Topic God List</span>
        </Link>
      </div>
    </main>
  );
}
