"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function ManifestoSection() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-transparent text-white border-t border-white/[0.06] overflow-hidden">
      {/* Subtle center glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[radial-gradient(circle,rgba(255,16,24,0.12)_0%,transparent_70%)] blur-[140px]"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 text-center flex flex-col items-center space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF3B41] uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#FF1018]" />
          <span>Our Core Philosophy</span>
        </div>

        <blockquote className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.2] max-w-4xl">
          “We believe competitive programming shouldn’t be about endless rote memorization. 
          We built Mindflare Arena to turn difficult algorithmic problems into{" "}
          <span className="bg-gradient-to-r from-[#FF4D52] via-[#FF1018] to-[#CC0D13] bg-clip-text text-transparent">
            crystal-clear intuition
          </span>{" "}
          and verified engineering mastery.”
        </blockquote>

        <p className="text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
          From binary search trees and two-pointer intervals to complex dynamic programming matrices — 
          every simulator, every test case, and every contest submission is crafted to help you see the underlying pattern.
        </p>

        <div className="pt-4">
          <Link
            href="/practice/dsa-patterns"
            className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <span>Read the DSA Pattern Architecture</span>
            <ArrowRight className="w-4 h-4 text-[#FF3B41] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
