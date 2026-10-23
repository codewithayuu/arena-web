"use client";

import Link from "next/link";
import { ShieldCheck, Cpu, Terminal, ArrowUpRight, Trophy, Sparkles } from "lucide-react";

export function ArenaFeaturesBento() {
  return (
    <section className="relative w-full py-28 md:py-36 bg-transparent text-white border-t border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-16 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF3B41] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#FF1018]" />
            <span>Architecture &amp; Core Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Engineered For Pure Competition.
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Every submission is judged against strict time limits in isolated ephemeral sandboxes.
            No cheating, no slow page loads, no compromised state.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="group rounded-3xl border border-white/10 hover:border-white/20 bg-[#07080c] p-8 flex flex-col justify-between transition-all duration-300 hover:bg-zinc-950/80">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-[#FF1018]/10 border border-[#FF1018]/25 flex items-center justify-center text-[#FF3B41]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Sub-10ms Judge Sandbox
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Zero-allocation compiler wrappers and kernel-isolated VMs execute untrusted student C++, Rust, and Python code with nanosecond timer precision.
              </p>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>MEMORY ISOLATION</span>
              <span className="text-[#FF3B41]">ENFORCED</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group rounded-3xl border border-white/10 hover:border-white/20 bg-[#07080c] p-8 flex flex-col justify-between transition-all duration-300 hover:bg-zinc-950/80">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Verified Contest Integrity
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Browser-to-launcher pairing uses single-use challenge tickets bound to user sessions. Integrated with official Safe Exam Browser (SEB) observation.
              </p>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>CHALLENGE TOKENS</span>
              <span className="text-cyan-400">SECURE</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group rounded-3xl border border-white/10 hover:border-white/20 bg-[#07080c] p-8 flex flex-col justify-between transition-all duration-300 hover:bg-zinc-950/80">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Real-Time Elo Ratings
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Compete in timed peer matches, climb global rank tiers, and benchmark your algorithmic problem solving against verified competitive programmers.
              </p>
            </div>

            <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>LEADERBOARD</span>
              <span className="text-amber-400">LIVE</span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-zinc-950 via-[#0a0608] to-zinc-950 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to benchmark your algorithmic skills?
            </h4>
            <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
              Join hundreds of developers preparing for Google, Microsoft, and ICPC contests on Mindflare Arena.
            </p>
          </div>

          <Link
            href="/practice"
            className="group shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#FF1018] hover:bg-[#E00C14] text-white font-medium text-base shadow-xl shadow-[#FF1018]/25 transition-all duration-200 active:scale-[0.98]"
          >
            <span>Start Practicing Now</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
