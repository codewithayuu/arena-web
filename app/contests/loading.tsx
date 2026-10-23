import React from "react";
import { Phantom } from "@/components/ui/phantom";

export default function ContestsLoading() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-150">
      {/* Contests Hero Skeleton */}
      <Phantom loading={true} className="w-full mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-lg bg-white/[0.08]" />
            <div className="h-4 w-80 max-w-full rounded-md bg-white/[0.04]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-36 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </Phantom>

      {/* Featured Arena Banner Skeleton */}
      <Phantom loading={true} className="rounded-2xl border border-white/[0.08] bg-[#0c0c0e]/80 p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="h-6 w-28 rounded-full bg-white/[0.08]" />
            <div className="h-9 w-3/4 rounded-lg bg-white/[0.09]" />
            <div className="h-4 w-full rounded bg-white/[0.04]" />
            <div className="flex gap-4 pt-2">
              <div className="h-4 w-32 rounded bg-white/[0.05]" />
              <div className="h-4 w-28 rounded bg-white/[0.05]" />
            </div>
          </div>
          <div className="h-12 w-44 rounded-full bg-white/[0.1]" />
        </div>
      </Phantom>

      {/* Upcoming & Past Contests Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Phantom
            key={i}
            loading={true}
            className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-20 rounded-full bg-white/[0.06]" />
              <div className="h-4 w-16 rounded bg-white/[0.04]" />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-44 rounded bg-white/[0.08]" />
              <div className="h-4 w-full rounded bg-white/[0.04]" />
            </div>
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.04]">
              <div className="h-4 w-20 rounded bg-white/[0.04]" />
              <div className="h-8 w-24 rounded-full bg-white/[0.06]" />
            </div>
          </Phantom>
        ))}
      </div>
    </div>
  );
}
