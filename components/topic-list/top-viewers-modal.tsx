"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { FaFire } from "react-icons/fa";
import { ModalPortal } from "./modal-portal";

interface TopViewersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserStreak: number;
  currentUserViews: number;
}

export function TopViewersModal({
  isOpen,
  onClose,
  currentUserStreak,
  currentUserViews,
}: TopViewersModalProps) {
  const [entries, setEntries] = useState<Array<{ handle: string; display_name: string; active_days: number; completions: number; aura: number; score: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sort, setSort] = useState<"score" | "active_days" | "completions" | "aura">("score");

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    void fetch(`/api/topic-list/leaderboard?sort=${sort}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Leaderboard is unavailable");
        if (!cancelled) setEntries(Array.isArray(data.entries) ? data.entries : []);
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Leaderboard is unavailable");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [isOpen, sort]);

  if (!isOpen) return null;

  return (
    <ModalPortal isOpen={isOpen}>
    <div className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto overscroll-contain p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        aria-labelledby="top-viewers-title"
        aria-modal="true"
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-[#0e0e13] px-5 pb-5 sm:px-6 sm:pb-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <div className="sticky top-0 z-10 -mx-5 mb-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13] px-5 pt-5 pb-3 sm:-mx-6 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400">
              <FaFire className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight" id="top-viewers-title">Most Active Learners</h3>
              <p className="text-[11px] text-zinc-400">Each measure is normalized to its current top value, then weighted equally.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Top Viewers modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="mb-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
          <span>Sort leaderboard</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-lg border border-white/10 bg-black px-2.5 py-1.5 text-zinc-200 outline-none focus:border-rose-500/60">
            <option value="score">Mixed score</option>
            <option value="active_days">Active days</option>
            <option value="completions">Completions</option>
            <option value="aura">Aura</option>
          </select>
        </label>

        <div className="rounded-xl border border-white/10 bg-black/40 p-4 text-xs">
          <div className="font-semibold text-white">Your account</div>
          <div className="mt-2 flex items-center justify-between text-zinc-300">
            <span className="flex items-center gap-1.5"><FaFire className="text-orange-400" /> Current streak</span>
            <span className="font-mono">{currentUserStreak} days</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-zinc-300">
            <span>Active days</span>
            <span className="font-mono">{currentUserViews}</span>
          </div>
        </div>
        <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs">
          {loading ? <p className="py-5 text-center text-zinc-400">Loading rankings…</p> : null}
          {!loading && loadError ? <p role="alert" className="py-5 text-center text-rose-300">{loadError}</p> : null}
          {!loading && !loadError && entries.length === 0 ? <p className="py-5 text-center text-zinc-400">No recorded activity yet.</p> : null}
          {!loading && !loadError && entries.map((entry, index) => (
            <div key={entry.handle} className="border-b border-white/5 py-2.5 last:border-0">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0"><span className="mr-2 text-zinc-500">{index + 1}.</span><span className="font-medium text-zinc-200">{entry.display_name || entry.handle}</span><span className="ml-2 text-zinc-500">@{entry.handle}</span></div>
                <span className="shrink-0 font-mono font-semibold text-emerald-300">{sort === "score" ? `${entry.score.toFixed(1)} pts` : entry[sort]}</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 pl-5 text-[10px] text-zinc-500">
                <span>{entry.active_days} active days</span><span>{entry.completions} completions</span><span>{entry.aura.toLocaleString()} Aura</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
