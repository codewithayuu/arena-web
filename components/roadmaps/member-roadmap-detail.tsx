"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, LoaderCircle } from "lucide-react";
import type { PersonalizedRoadmap } from "@/lib/personalized-roadmap";

type RoadmapRecord = {
  id: string;
  title: string;
  primary_path: string;
  total_weeks: number;
  total_hours: number;
  generated_plan: PersonalizedRoadmap;
  completed_phases: number[];
};

export function MemberRoadmapDetail({ roadmapId }: { roadmapId: string }) {
  const [roadmap, setRoadmap] = useState<RoadmapRecord | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingPhase, setSavingPhase] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/learning/roadmaps/${encodeURIComponent(roadmapId)}`, { cache: "no-store" }).then(async (response) => {
      const result = await response.json() as { roadmap?: RoadmapRecord; error?: string };
      if (!response.ok || !result.roadmap) throw new Error(result.error || "Roadmap not found");
      if (active) { setRoadmap(result.roadmap); setCompleted(result.roadmap.completed_phases ?? []); }
    }).catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Roadmap unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [roadmapId]);

  const togglePhase = async (phaseNumber: number) => {
    const previous = completed;
    const next = previous.includes(phaseNumber) ? previous.filter((number) => number !== phaseNumber) : [...previous, phaseNumber].sort((a, b) => a - b);
    setCompleted(next);
    setSavingPhase(phaseNumber);
    setError("");
    try {
      const response = await fetch(`/api/learning/roadmaps/${encodeURIComponent(roadmapId)}`, {
        method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ completedPhases: next }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Progress could not be saved");
    } catch (reason) {
      setCompleted(previous);
      setError(reason instanceof Error ? reason.message : "Progress could not be saved");
    } finally {
      setSavingPhase(null);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/roadmaps/my" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Saved roadmaps</Link>
        {loading ? <div className="flex min-h-56 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading</div> : error && !roadmap ? <p role="alert" className="mt-6 border border-border bg-card p-4 text-sm text-card-foreground">{error}</p> : roadmap ? <>
          <header className="mt-7 border-b border-border pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{roadmap.generated_plan.primaryPath}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{roadmap.title}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{roadmap.generated_plan.profile}</p>
            <div className="mt-5 flex gap-6 text-sm text-muted-foreground"><span>{roadmap.total_weeks} weeks</span><span>{roadmap.total_hours.toLocaleString()} study hours</span><span>{completed.length}/{roadmap.generated_plan.phases.length} phases complete</span></div>
          </header>
          {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
          <div className="mt-6 space-y-4">
            {roadmap.generated_plan.phases.map((phase) => {
              const isComplete = completed.includes(phase.number);
              return <section key={phase.number} className="border border-border bg-card p-5 text-card-foreground sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-xs text-muted-foreground">Phase {String(phase.number).padStart(2, "0")} · {phase.duration}</p><h2 className="mt-2 text-lg font-semibold">{phase.title}</h2></div>
                  <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={isComplete} disabled={savingPhase !== null} onChange={() => void togglePhase(phase.number)} className="h-4 w-4 accent-primary" />Done</label>
                </div>
                <p className="mt-4 text-sm text-foreground">{phase.milestone}</p>
                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">{phase.topics.map((topic) => <li key={topic} className="border-l border-border pl-3">{topic}</li>)}</ul>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm text-muted-foreground"><span>{phase.hours.toLocaleString()} hours</span><Link href={phase.href} className="inline-flex items-center gap-2 text-foreground hover:text-primary">Open learning <ArrowUpRight size={14} /></Link></div>
              </section>;
            })}
          </div>
        </> : null}
      </div>
    </main>
  );
}
