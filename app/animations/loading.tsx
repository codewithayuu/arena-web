import React from "react";
import { Phantom } from "@/components/ui/phantom";

export default function AnimationsLoading() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-150">
      {/* Animations Header Skeleton */}
      <Phantom loading={true} className="w-full mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="h-8 w-72 rounded-lg bg-white/[0.08]" />
            <div className="h-4 w-80 max-w-full rounded-md bg-white/[0.04]" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 rounded-full bg-white/[0.06]" />
            <div className="h-9 w-28 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </Phantom>

      {/* Grid of Simulation Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Phantom
            key={i}
            loading={true}
            className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-5 space-y-4"
          >
            {/* Visualizer Canvas Preview Skeleton */}
            <div className="h-44 w-full rounded-lg bg-white/[0.03] border border-white/[0.04] flex items-center justify-center">
              <div className="h-10 w-10 rounded-full bg-white/[0.05]" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-5 w-40 rounded bg-white/[0.08]" />
                <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
              </div>
              <div className="h-3.5 w-full rounded bg-white/[0.04]" />
              <div className="h-3.5 w-2/3 rounded bg-white/[0.04]" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <div className="h-4 w-20 rounded bg-white/[0.04]" />
              <div className="h-7 w-20 rounded-md bg-white/[0.06]" />
            </div>
          </Phantom>
        ))}
      </div>
    </div>
  );
}
