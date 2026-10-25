"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, LoaderCircle } from "lucide-react";

type Session = {
  id: string;
  name: string;
  questionCount: number;
  timerMinutes: number;
  createdAt: string;
  problems: Array<{ id: string; slug: string; title: string; difficulty: string; category: string; topics: string[]; leetcodeUrl: string }>;
};

export function PracticeContestSession({ sessionId }: { sessionId: string }) {
  const [session, setSession] = useState<Session | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch(`/api/practice/contest-sessions/${encodeURIComponent(sessionId)}`, { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json() as { session?: Session; error?: string };
        if (!response.ok || !result.session) throw new Error(result.error || "Session unavailable");
        if (active) setSession(result.session);
      })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Session unavailable"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [sessionId]);

  useEffect(() => {
    if (!session || session.timerMinutes <= 0) return;
    const update = () => {
      const end = new Date(session.createdAt).getTime() + session.timerMinutes * 60_000;
      setRemaining(Math.max(0, Math.ceil((end - Date.now()) / 1000)));
    };
    update();
    const handle = window.setInterval(update, 1000);
    return () => window.clearInterval(handle);
  }, [session]);

  const time = remaining === null ? "" : `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;
  return (
    <main className="min-h-screen bg-[#08080a] px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Link href="/practice/contest-builder" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} /> Practice sets</Link>
        {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-zinc-400"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading session</div> : error ? <p role="alert" className="mt-8 border border-white/10 bg-[#111114] p-5 text-sm text-zinc-300">{error}</p> : session ? <>
          <header className="mt-7 border-b border-white/10 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#e83040]">Practice session</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{session.name}</h1>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
              <span>{session.questionCount} problems</span>
              <span className="inline-flex items-center gap-2"><Clock3 size={15} />{session.timerMinutes ? (remaining === 0 ? "Time elapsed" : time || `${session.timerMinutes} min`) : "Untimed"}</span>
            </div>
          </header>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {session.problems.map((problem, index) => <article key={problem.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 gap-4"><span className="w-7 shrink-0 pt-0.5 text-sm tabular-nums text-zinc-500">{String(index + 1).padStart(2, "0")}</span><div className="min-w-0"><h2 className="truncate text-base font-medium">{problem.title}</h2><p className="mt-1 text-sm text-zinc-500">{problem.category} · {problem.difficulty}</p></div></div>
              <Link href={`/practice/dsa/${encodeURIComponent(problem.slug)}`} className="inline-flex shrink-0 items-center justify-center gap-2 border border-white/15 px-4 py-2 text-sm text-white hover:border-white/40">Open problem <ArrowUpRight size={15} /></Link>
            </article>)}
          </div>
          <p className="mt-4 text-xs text-zinc-500">Practice timer only. This session is not ranked.</p>
        </> : null}
      </div>
    </main>
  );
}
