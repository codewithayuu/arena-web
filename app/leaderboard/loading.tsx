import React from "react";
import { Phantom } from "@/components/ui/phantom";

export default function LeaderboardLoading() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-150">
      {/* Leaderboard Header Skeleton */}
      <Phantom loading={true} className="w-full mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-white/[0.08]" />
            <div className="h-4 w-96 max-w-full rounded-md bg-white/[0.04]" />
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-full bg-white/[0.06]" />
            <div className="h-10 w-32 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </Phantom>

      {/* Top 3 Podium Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Phantom
            key={i}
            loading={true}
            className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-6 flex flex-col items-center text-center gap-3"
          >
            <div className="h-16 w-16 rounded-full bg-white/[0.08]" />
            <div className="h-5 w-32 rounded bg-white/[0.08]" />
            <div className="h-4 w-20 rounded bg-white/[0.04]" />
            <div className="h-7 w-24 rounded-full bg-white/[0.06] mt-2" />
          </Phantom>
        ))}
      </div>

      {/* Rankings Table Rows Skeleton */}
      <Phantom loading={true} className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-6 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] text-xs text-white/40">
          <div className="h-4 w-12 rounded bg-white/[0.04]" />
          <div className="h-4 w-40 rounded bg-white/[0.04]" />
          <div className="h-4 w-20 rounded bg-white/[0.04]" />
          <div className="h-4 w-24 rounded bg-white/[0.04]" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3 border-b border-white/[0.02]"
          >
            <div className="h-4 w-6 rounded bg-white/[0.05]" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/[0.06]" />
              <div className="h-4 w-32 rounded bg-white/[0.07]" />
            </div>
            <div className="h-4 w-16 rounded bg-white/[0.05]" />
            <div className="h-6 w-20 rounded-full bg-white/[0.05]" />
          </div>
        ))}
      </Phantom>
    </div>
  );
}
