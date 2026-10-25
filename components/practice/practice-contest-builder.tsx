"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";

type PracticeProblem = {
  id: string;
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  topics: string[];
  leetcodeUrl: string;
};
type RecentSession = { id: string; name: string; question_count: number; timer_minutes: number; created_at: string };
type Stage = 1 | 2 | 3;

const surface = "border border-white/10 bg-[#111114]";
const field = "w-full border border-white/10 bg-[#09090b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e83040]";
const outlineButton = "border border-white/15 bg-[#111114] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-45";

export function PracticeContestBuilder() {
  const [catalog, setCatalog] = useState<PracticeProblem[]>([]);
  const [sessions, setSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Stage>(1);
  const [name, setName] = useState("Practice set");
  const [questionCount, setQuestionCount] = useState(5);
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCatalog = fetch("/api/practice/contest-catalog", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("Problem catalog unavailable");
      return response.json() as Promise<{ problems: PracticeProblem[] }>;
    });
    const loadSessions = fetch("/api/practice/contest-sessions", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return { sessions: [] as RecentSession[] };
      return response.json() as Promise<{ sessions: RecentSession[] }>;
    });
    void loadSessions.then((result) => { if (active) setSessions(result.sessions); }).catch(() => undefined);
    void loadCatalog.then((result) => { if (active) setCatalog(result.problems); })
      .catch((reason: unknown) => { if (active) setError(reason instanceof Error ? reason.message : "Could not load the problem catalog"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const availableTopics = useMemo(() => [...new Set(catalog.flatMap((problem) => problem.topics))].sort(), [catalog]);
  const candidates = useMemo(() => catalog.filter((problem) => {
    if (difficulties.length && !difficulties.includes(problem.difficulty)) return false;
    if (topics.length && !problem.topics.some((topic) => topics.includes(topic))) return false;
    return true;
  }), [catalog, difficulties, topics]);

  const toggle = (values: string[], value: string, setter: (next: string[]) => void) => {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  const createSession = async () => {
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/practice/contest-sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, questionCount, timerMinutes, difficulties, topics }),
      });
      const result = await response.json() as { session?: { id: string }; error?: string };
      if (!response.ok || !result.session?.id) throw new Error(result.error || "Could not create practice set");
      window.location.assign(`/practice/contest-session/${result.session.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create practice set");
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08080a] px-4 pb-16 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/practice/dsa-patterns" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft size={16} aria-hidden="true" /> Practice
        </Link>
        <div className="mt-7 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#e83040]">Practice</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Build a practice contest</h1>
          </div>
          <p className="max-w-xs text-sm text-zinc-400">Personal practice only. No ranking.</p>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className={`${surface} p-5 sm:p-7`} aria-labelledby="builder-heading">
            <div className="flex items-center justify-between gap-4">
              <h2 id="builder-heading" className="text-lg font-semibold">{step === 1 ? "Choose problems" : step === 2 ? "Review the pool" : "Set the session"}</h2>
              <span className="text-sm tabular-nums text-zinc-400">0{step} / 03</span>
            </div>
            <div className="mt-4 h-px bg-white/10" aria-hidden="true">
              <div className="h-px bg-[#e83040] transition-[width]" style={{ width: `${step / 3 * 100}%` }} />
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center text-sm text-zinc-400"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading problems</div>
            ) : error && catalog.length === 0 ? (
              <div role="alert" className="mt-6 border border-red-500/30 bg-[#151012] p-4 text-sm text-red-200">{error}</div>
            ) : step === 1 ? (
              <div className="mt-6 space-y-7">
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">Difficulty</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["Easy", "Medium", "Hard"] as const).map((difficulty) => {
                      const selected = difficulties.includes(difficulty);
                      return <button key={difficulty} type="button" aria-pressed={selected} onClick={() => toggle(difficulties, difficulty, setDifficulties)} className={`${outlineButton} ${selected ? "border-[#e83040]" : ""}`}>
                        <span className="mr-2 inline-block h-3 w-3 border border-current align-[-1px]">{selected ? <span className="block h-full w-full bg-[#e83040]" /> : null}</span>{difficulty}
                      </button>;
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-300">Topics</h3>
                  <div className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    {availableTopics.slice(0, 24).map((topic) => {
                      const selected = topics.includes(topic);
                      return <label key={topic} className="flex min-h-9 cursor-pointer items-center gap-3 border-b border-white/5 py-2 text-sm text-zinc-300">
                        <input type="checkbox" checked={selected} onChange={() => toggle(topics, topic, setTopics)} className="h-4 w-4 accent-[#e83040]" />
                        <span>{topic}</span>
                      </label>;
                    })}
                  </div>
                </div>
                <p className="text-sm text-zinc-400">{candidates.length} matching problems</p>
              </div>
            ) : step === 2 ? (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-zinc-400"><span>Available pool</span><span>{candidates.length}</span></div>
                <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
                  {candidates.slice(0, 8).map((problem) => <div key={problem.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{problem.title}</p><p className="mt-1 text-xs text-zinc-500">{problem.category} · {problem.topics.slice(0, 2).join(", ")}</p></div>
                    <span className="shrink-0 text-xs text-zinc-400">{problem.difficulty}</span>
                  </div>)}
                </div>
                {candidates.length > 8 ? <p className="mt-3 text-xs text-zinc-500">Showing 8 of {candidates.length}</p> : null}
                {candidates.length === 0 ? <p className="py-12 text-center text-sm text-zinc-400">No problems match these filters.</p> : null}
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <label className="block text-sm font-medium text-zinc-300">Name<input className={`${field} mt-2`} value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-zinc-300">Problems<input className={`${field} mt-2`} type="number" min={1} max={Math.min(30, candidates.length)} value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} /></label>
                  <label className="block text-sm font-medium text-zinc-300">Time limit<select className={`${field} mt-2`} value={timerMinutes} onChange={(event) => setTimerMinutes(Number(event.target.value))}>
                    {[0, 30, 45, 60, 90, 120, 180, 240].map((minutes) => <option key={minutes} value={minutes}>{minutes === 0 ? "No limit" : `${minutes} minutes`}</option>)}
                  </select></label>
                </div>
                <p className="flex items-center gap-2 text-sm text-zinc-400"><Clock3 size={15} aria-hidden="true" />{questionCount} problems · {timerMinutes === 0 ? "no timer" : `${timerMinutes} minutes`}</p>
              </div>
            )}

            {error && catalog.length > 0 ? <p role="alert" className="mt-5 text-sm text-red-300">{error}</p> : null}
            <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
              {step > 1 ? <button type="button" className={outlineButton} disabled={creating} onClick={() => setStep((step - 1) as Stage)}><ArrowLeft size={15} className="mr-2 inline" />Back</button> : <span />}
              {step < 3 ? <button type="button" className="inline-flex items-center border border-[#e83040] bg-[#e83040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ca2635] disabled:opacity-40" disabled={loading || candidates.length === 0} onClick={() => { setError(""); setStep((step + 1) as Stage); }}>
                Continue <ArrowRight size={15} className="ml-2" />
              </button> : <button type="button" className="inline-flex items-center border border-[#e83040] bg-[#e83040] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ca2635] disabled:opacity-40" disabled={creating || !name.trim() || questionCount < 1 || questionCount > Math.min(30, candidates.length)} onClick={() => void createSession()}>
                {creating ? <LoaderCircle size={15} className="mr-2 animate-spin" /> : <Sparkles size={15} className="mr-2" />}Create set
              </button>}
            </div>
          </section>

          <aside className="space-y-5">
            <div className={`${surface} p-5`}>
              <h2 className="text-sm font-semibold">Your sessions</h2>
              {sessions.length ? <div className="mt-3 divide-y divide-white/10">
                {sessions.slice(0, 5).map((session) => <Link key={session.id} href={`/practice/contest-session/${session.id}`} className="block py-3 first:pt-0 last:pb-0">
                  <span className="block truncate text-sm text-zinc-200">{session.name}</span><span className="mt-1 block text-xs text-zinc-500">{session.question_count} problems · {session.timer_minutes ? `${session.timer_minutes} min` : "untimed"}</span>
                </Link>)}
              </div> : <p className="mt-3 text-sm text-zinc-500">No saved sessions.</p>}
            </div>
            <div className={`${surface} p-5`}>
              <div className="flex items-center gap-2 text-sm font-medium"><RotateCcw size={15} className="text-zinc-400" /> Practice, at your pace</div>
              <p className="mt-2 text-xs leading-5 text-zinc-500">This does not affect contest standings.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
