"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, CheckCircle2, ChevronRight } from "lucide-react";
import { AM_300_PROBLEMS, PracticeProblemListItem } from "@/lib/practice-data";

interface ProblemListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
}

export function ProblemListDrawer({
  isOpen,
  onClose,
  currentSlug,
}: ProblemListDrawerProps) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<
    "all" | "Easy" | "Medium" | "Hard"
  >("all");

  const filtered = useMemo(() => {
    return AM_300_PROBLEMS.filter((p) => {
      const matchSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase());
      const matchDiff =
        difficultyFilter === "all" || p.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    });
  }, [search, difficultyFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#111113] border-r border-zinc-800 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Mindflare 300
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              300 Curated Problems for Top Tech Interviews
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-3 border-b border-[#1E1E2E] space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0B0B13] border border-[#1E1E2E] text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {(["all", "Easy", "Medium", "Hard"] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-colors ${
                  difficultyFilter === diff
                    ? "bg-[#1E1E2E] text-white border border-[#1E1E2E]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#1E1E2E]"
                }`}
              >
                {diff === "all" ? `All (${AM_300_PROBLEMS.length})` : diff}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1E1E2E] custom-scrollbar">
          {filtered.map((prob, i) => {
            const isCurrent = prob.slug === currentSlug;
            return (
              <Link
                key={prob.slug}
                href={`/practice/dsa/${prob.slug}?list=am-300`}
                onClick={onClose}
                className={`flex items-center justify-between p-3 text-xs transition-colors hover:bg-[#1E1E2E] ${
                  isCurrent ? "bg-[#0E7490]/15 text-[#38BDF8]" : "text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 font-mono text-[11px] text-zinc-500 text-right">
                    {i + 1}
                  </span>
                  <span
                    className={`truncate font-medium ${
                      isCurrent
                        ? "text-[#38BDF8] font-semibold"
                        : "text-zinc-200"
                    }`}
                  >
                    {prob.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      prob.difficulty === "Easy"
                        ? "text-[#38BDF8] bg-[#0E7490]/15 border border-[#0E7490]/35"
                        : prob.difficulty === "Medium"
                          ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                          : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
