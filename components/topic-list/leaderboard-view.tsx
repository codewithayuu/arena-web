"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trophy } from "lucide-react";

type SortKey = "score" | "active_days" | "completions" | "aura";
type LeaderboardEntry = {
  handle: string | null;
  display_name: string | null;
  active_days: number;
  completions: number;
  aura: number;
  score: number;
};

const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "score", label: "Mixed score" },
  { value: "active_days", label: "Active days" },
  { value: "completions", label: "Completions" },
  { value: "aura", label: "Aura" },
];

export function LeaderboardView() {
  const [sort, setSort] = useState<SortKey>("score");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    void fetch(`/api/topic-list/leaderboard?sort=${sort}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Leaderboard is unavailable.");
        if (!Array.isArray(data.entries)) throw new Error("Leaderboard returned an invalid response.");
        setEntries(data.entries as LeaderboardEntry[]);
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "Leaderboard is unavailable.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [sort, reloadToken]);

  return (
    <main className="min-h-screen bg-[#070709] px-4 py-10 text-white selection:bg-[#ff1018]/30 selection:text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/topic-list"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Topic List</span>
        </Link>

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 shadow-sm">
              <Trophy className="h-3.5 w-3.5" />
              Global Learner Rankings
            </div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Aura Leaderboard</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
              The default mixed score gives equal weight to active days, completed items, and Aura. Each measure is normalized to its current top value.
            </p>
          </div>

          <label className="flex items-center gap-3 text-xs text-zinc-400">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="rounded-lg border border-white/10 bg-[#101014] px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-rose-500/60"
            >
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl" aria-label="Learner rankings">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#0a0a0c] text-[10px] uppercase tracking-wider text-zinc-400">
                  <th scope="col" className="px-4 py-3.5 font-semibold">Rank</th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">Learner</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-semibold">Active days</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-semibold">Completions</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-semibold">Aura</th>
                  <th scope="col" className="px-4 py-3.5 text-right font-semibold">Mixed score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {loading && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">Loading learner rankings…</td></tr>
                )}
                {!loading && error && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center" role="alert">
                      <p className="text-rose-300">{error}</p>
                      <button type="button" onClick={() => setReloadToken((value) => value + 1)} className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white">
                        <RefreshCw className="h-3.5 w-3.5" /> Retry
                      </button>
                    </td>
                  </tr>
                )}
                {!loading && !error && entries.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-400">No learner activity has been recorded yet.</td></tr>
                )}
                {!loading && !error && entries.map((entry, index) => (
                  <tr key={entry.handle ?? `${entry.display_name}-${index}`} className="transition-colors hover:bg-white/[0.025]">
                    <td className="px-4 py-3.5 font-mono text-zinc-500">{index + 1}</td>
                    <td className="px-4 py-3.5 font-medium text-zinc-100">{entry.display_name || "Arena learner"}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-300">{entry.active_days.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-zinc-300">{entry.completions.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-emerald-300">{entry.aura.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold text-amber-300">{entry.score.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-white/10 px-4 py-3 text-[11px] text-zinc-500">
            Showing up to 20 learners. Rankings use account progress saved on the server.
          </div>
        </section>
      </div>
    </main>
  );
}
