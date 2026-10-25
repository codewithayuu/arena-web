"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";

type RoadmapSummary = {
  id: string;
  title: string;
  primary_path: string;
  total_weeks: number;
  total_hours: number;
  completed_phases: number[];
  created_at: string;
  updated_at: string;
};

export function MemberRoadmaps() {
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/learning/roadmaps", { cache: "no-store" }).then(async (response) => {
      const result = await response.json() as { roadmaps?: RoadmapSummary[]; error?: string };
      if (!response.ok) throw new Error(result.error || "Roadmaps are unavailable");
      if (active) setRoadmaps(result.roadmaps ?? []);
    }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Roadmaps are unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <main className="min-h-screen bg-[#08080a] px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/roadmaps" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Roadmaps</Link>
        <div className="mt-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-[#e83040]">Your learning</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Saved roadmaps</h1></div>
          <Link href="/roadmaps/create" className="inline-flex items-center justify-center gap-2 border border-[#e83040] bg-[#e83040] px-4 py-2.5 text-sm font-semibold hover:bg-[#ca2635]">Create roadmap <ArrowRight size={15} /></Link>
        </div>
        {loading ? <div className="flex min-h-56 items-center justify-center text-sm text-zinc-400"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading</div> : error ? <p role="alert" className="mt-6 border border-white/10 bg-[#111114] p-4 text-sm text-zinc-300">{error}</p> : roadmaps.length === 0 ? <div className="mt-6 border border-white/10 bg-[#111114] p-6"><p className="text-sm text-zinc-300">No saved roadmaps.</p><Link href="/roadmaps/create" className="mt-4 inline-flex items-center gap-2 text-sm text-white underline decoration-[#e83040] underline-offset-4">Create one <ArrowRight size={15} /></Link></div> : <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {roadmaps.map((roadmap) => <Link key={roadmap.id} href={`/roadmaps/my/${roadmap.id}`} className="flex items-center justify-between gap-4 py-5 hover:bg-white/[0.02]">
            <div><h2 className="text-base font-medium">{roadmap.title}</h2><p className="mt-1 text-sm text-zinc-500">{roadmap.primary_path} · {roadmap.total_weeks} weeks · {roadmap.completed_phases?.length ?? 0} phases complete</p></div><ArrowRight size={17} className="shrink-0 text-zinc-500" />
          </Link>)}
        </div>}
      </div>
    </main>
  );
}
