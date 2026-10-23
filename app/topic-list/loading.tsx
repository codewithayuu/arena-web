import React from "react";
import { Phantom } from "@/components/ui/phantom";

export default function TopicListLoading() {
  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-150">
      {/* Top Header & Search Skeleton */}
      <Phantom loading={true} className="w-full mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-white/[0.08]" />
            <div className="h-4 w-96 max-w-full rounded-md bg-white/[0.04]" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-full bg-white/[0.06]" />
            <div className="h-10 w-28 rounded-full bg-white/[0.06]" />
            <div className="h-10 w-10 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </Phantom>

      {/* Categories & Topics Accordion Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main List */}
        <div className="lg:col-span-3 space-y-4">
          {Array.from({ length: 4 }).map((_, catIdx) => (
            <Phantom key={catIdx} loading={true} className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.08]" />
                  <div className="h-5 w-48 rounded-md bg-white/[0.08]" />
                </div>
                <div className="h-5 w-16 rounded-full bg-white/[0.05]" />
              </div>

              {/* Topic Rows */}
              <div className="pt-3 space-y-2.5">
                {Array.from({ length: 3 }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.03]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded bg-white/[0.05]" />
                      <div className="h-4 w-44 rounded bg-white/[0.07]" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-14 rounded-full bg-white/[0.05]" />
                      <div className="h-6 w-12 rounded-full bg-white/[0.04]" />
                    </div>
                  </div>
                ))}
              </div>
            </Phantom>
          ))}
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block space-y-6">
          <Phantom loading={true} className="rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-5 space-y-4">
            <div className="h-5 w-32 rounded bg-white/[0.08]" />
            <div className="h-24 w-full rounded-lg bg-white/[0.04]" />
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full rounded bg-white/[0.04]" />
              <div className="h-3.5 w-3/4 rounded bg-white/[0.04]" />
            </div>
          </Phantom>
        </div>
      </div>
    </div>
  );
}
