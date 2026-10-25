"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

type CodeforcesProblem = {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating: number | null;
  tags: string[];
  solvedCount: number;
  url: string;
};
type CatalogResult = {
  problems: CodeforcesProblem[];
  preview: CodeforcesProblem[];
  total: number;
  page: number;
  pageSize: number;
  availableTags: string[];
};
type RecentSession = { id: string; name: string; question_count: number; timer_minutes: number; created_at: string };
type Stage = 1 | 2 | 3;
type SortOrder = "rating-asc" | "rating-desc" | "popular" | "newest";

const surface = "border border-border bg-card text-card-foreground";
const field = "w-full border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";
const outlineButton = "border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45";
const PAGE_SIZE = 30;

export function PracticeContestBuilder() {
  const [catalog, setCatalog] = useState<CatalogResult>({ problems: [], preview: [], total: 0, page: 1, pageSize: PAGE_SIZE, availableTags: [] });
  const [sessions, setSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Stage>(1);
  const [name, setName] = useState("Practice set");
  const [questionCount, setQuestionCount] = useState(5);
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOrder>("rating-asc");
  const [page, setPage] = useState(1);
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(page), seed: String(shuffleSeed), sort });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (minRating) params.set("minRating", minRating);
    if (maxRating) params.set("maxRating", maxRating);
    tags.forEach((tag) => params.append("tag", tag));

    setLoading(true);
    setError("");
    void fetch(`/api/practice/contest-catalog?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as CatalogResult & { error?: string };
        if (!response.ok) throw new Error(result.error || "Could not load Codeforces problems");
        if (active) setCatalog(result);
      })
      .catch((reason: unknown) => {
        if (active && !controller.signal.aborted) {
          setCatalog((current) => ({ ...current, problems: [], total: 0 }));
          setError(reason instanceof Error ? reason.message : "Could not load Codeforces problems");
        }
      })
      .finally(() => { if (active) setLoading(false); });

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedSearch, minRating, maxRating, tags, sort, page, shuffleSeed]);

  useEffect(() => {
    let active = true;
    fetch("/api/practice/contest-sessions", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return { sessions: [] as RecentSession[] };
        return response.json() as Promise<{ sessions: RecentSession[] }>;
      })
      .then((result) => { if (active) setSessions(result.sessions); })
      .catch(() => undefined)
      .finally(() => { if (active) setSessionsLoading(false); });
    return () => { active = false; };
  }, []);

  const isSearchPending = search.trim() !== debouncedSearch;
  const maxPage = Math.max(1, Math.ceil(catalog.total / PAGE_SIZE));
  const canCreate = questionCount >= 1 && questionCount <= Math.min(30, catalog.total);
  const filterSummary = useMemo(() => {
    const parts = [];
    if (minRating || maxRating) parts.push(`${minRating || "Any"}–${maxRating || "Any"} rating`);
    if (tags.length) parts.push(`${tags.length} tag${tags.length === 1 ? "" : "s"}`);
    if (search.trim()) parts.push(`“${search.trim()}”`);
    return parts.length ? parts.join(" · ") : "All programming problems";
  }, [minRating, maxRating, tags.length, search]);

  const toggleTag = (tag: string) => {
    setPage(1);
    setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setMinRating("");
    setMaxRating("");
    setTags([]);
    setSort("rating-asc");
    setPage(1);
  };

  const createSession = async () => {
    setCreating(true);
    setError("");
    try {
      const response = await fetch("/api/practice/contest-sessions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          questionCount,
          timerMinutes,
          search: search.trim(),
          minRating: minRating || null,
          maxRating: maxRating || null,
          tags,
          sort,
        }),
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

  const proceed = () => {
    setError("");
    setStep((current) => Math.min(3, current + 1) as Stage);
  };

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link href="/practice/dsa-patterns" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} aria-hidden="true" /> Practice
        </Link>
        <div className="mt-7 flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Practice</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Build a practice contest</h1>
          </div>
          <p className="text-sm text-muted-foreground">Personal practice · Not ranked</p>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <section className={`${surface} p-5 sm:p-7`} aria-labelledby="builder-heading">
            <div className="flex items-center justify-between gap-4">
              <h2 id="builder-heading" className="text-lg font-semibold">{step === 1 ? "Choose problems" : step === 2 ? "Review the pool" : "Set the session"}</h2>
              <span className="text-sm tabular-nums text-muted-foreground">0{step} / 03</span>
            </div>
            <div className="mt-4 h-px bg-muted" aria-hidden="true">
              <div className="h-px bg-primary transition-[width]" style={{ width: `${step / 3 * 100}%` }} />
            </div>

            {step === 1 ? (
              <div className="mt-6 space-y-6">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="relative block">
                    <span className="sr-only">Search problems</span>
                    <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input className={`${field} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} maxLength={100} placeholder="Search names or tags" />
                  </label>
                  <label className="block text-sm text-muted-foreground">
                    <span className="sr-only">Sort problems</span>
                    <select className={field} value={sort} onChange={(event) => { setSort(event.target.value as SortOrder); setPage(1); }}>
                      <option value="rating-asc">Rating · low to high</option>
                      <option value="rating-desc">Rating · high to low</option>
                      <option value="popular">Most solved</option>
                      <option value="newest">Newest</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                  <label className="block text-sm font-medium text-foreground">Min rating
                    <input className={`${field} mt-2`} type="number" min={800} max={4000} step={100} value={minRating} onChange={(event) => { setMinRating(event.target.value); setPage(1); }} placeholder="Any" />
                  </label>
                  <label className="block text-sm font-medium text-foreground">Max rating
                    <input className={`${field} mt-2`} type="number" min={800} max={4000} step={100} value={maxRating} onChange={(event) => { setMaxRating(event.target.value); setPage(1); }} placeholder="Any" />
                  </label>
                  <button type="button" className={`${outlineButton} h-[42px]`} onClick={resetFilters}>Reset filters</button>
                </div>

                <details className="border-y border-border py-3">
                  <summary className="cursor-pointer text-sm font-medium text-foreground">Tags{tags.length ? ` · ${tags.length} selected` : ""}</summary>
                  <fieldset className="mt-3 max-h-56 overflow-y-auto">
                    <legend className="sr-only">Filter by Codeforces tags. Selected tags are all required.</legend>
                    <p className="mb-2 text-xs text-muted-foreground">All selected tags must match.</p>
                    {catalog.availableTags.length ? (
                      <div className="grid gap-x-5 gap-y-1 sm:grid-cols-2">
                        {catalog.availableTags.map((tag) => <label key={tag} className="flex min-h-9 cursor-pointer items-center gap-3 border-b border-border/60 py-2 text-sm text-muted-foreground">
                          <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} className="h-4 w-4 accent-primary" />
                          <span>{tag}</span>
                        </label>)}
                      </div>
                    ) : <p className="py-4 text-sm text-muted-foreground">Tags load with the problem catalog.</p>}
                  </fieldset>
                </details>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{loading || isSearchPending ? "Updating results…" : `${catalog.total.toLocaleString()} matching problems`}</span>
                  <span className="max-w-full truncate">{filterSummary}</span>
                </div>

                {error ? <div role="alert" className="border border-destructive bg-card p-4 text-sm text-destructive">{error}</div> : null}
                {!error && loading ? <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading Codeforces problems</div> : null}
                {!error && !loading && catalog.problems.length === 0 ? <div className="border-y border-border py-12 text-center text-sm text-muted-foreground">No problems match these filters.</div> : null}

                {!error && catalog.problems.length > 0 ? <div className="divide-y divide-border border-y border-border">
                  {catalog.problems.map((problem) => <article key={problem.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <a href={problem.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
                        <span className="truncate">{problem.name}</span><ExternalLink size={13} aria-hidden="true" className="shrink-0" />
                      </a>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{problem.tags.slice(0, 4).join(" · ") || "No tags"}</p>
                    </div>
                    <div className="shrink-0 text-right text-xs text-muted-foreground">
                      <p>{problem.rating === null ? "Unrated" : `Rating ${problem.rating}`}</p>
                      <p className="mt-1">{problem.solvedCount.toLocaleString()} solved</p>
                    </div>
                  </article>)}
                </div> : null}

                <div className="flex items-center justify-between gap-3">
                  <button type="button" className={outlineButton} disabled={page <= 1 || loading} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                    <ChevronLeft size={15} className="mr-1 inline" />Previous
                  </button>
                  <span className="text-xs tabular-nums text-muted-foreground">Page {page} of {maxPage}</span>
                  <button type="button" className={outlineButton} disabled={page >= maxPage || loading} onClick={() => setPage((current) => current + 1)}>
                    Next<ChevronRight size={15} className="ml-1 inline" />
                  </button>
                </div>
              </div>
            ) : step === 2 ? (
              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground"><p>{filterSummary}</p><p className="mt-1 tabular-nums">{catalog.total.toLocaleString()} matches</p></div>
                  <button type="button" className={outlineButton} disabled={loading} onClick={() => setShuffleSeed((current) => current + 1)}><RotateCcw size={14} className="mr-2 inline" />Shuffle sample</button>
                </div>
                {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
                <div className="mt-4 divide-y divide-border border-y border-border">
                  {catalog.preview.map((problem) => <div key={problem.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{problem.name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{problem.tags.slice(0, 3).join(" · ")}</p></div>
                    <span className="shrink-0 text-xs text-muted-foreground">{problem.rating === null ? "Unrated" : problem.rating}</span>
                  </div>)}
                </div>
                {catalog.total > catalog.preview.length ? <p className="mt-3 text-xs text-muted-foreground">Previewing {catalog.preview.length} of {catalog.total.toLocaleString()}</p> : null}
                <p className="mt-4 text-sm text-muted-foreground">Problems are selected at random when you create the set.</p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <label className="block text-sm font-medium text-foreground">Name<input className={`${field} mt-2`} value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-foreground">Problems<input className={`${field} mt-2`} type="number" min={1} max={Math.min(30, catalog.total)} value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} /></label>
                  <label className="block text-sm font-medium text-foreground">Time limit<select className={`${field} mt-2`} value={timerMinutes} onChange={(event) => setTimerMinutes(Number(event.target.value))}>
                    {[0, 30, 45, 60, 90, 120, 180, 240].map((minutes) => <option key={minutes} value={minutes}>{minutes === 0 ? "No limit" : `${minutes} minutes`}</option>)}
                  </select></label>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock3 size={15} aria-hidden="true" />{questionCount} problems · {timerMinutes === 0 ? "no timer" : `${timerMinutes} minutes`}</p>
                <p className="text-xs text-muted-foreground">Statements and judging open on Codeforces.</p>
                {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
              {step > 1 ? <button type="button" className={outlineButton} disabled={creating} onClick={() => setStep((current) => (current - 1) as Stage)}><ArrowLeft size={15} className="mr-2 inline" />Back</button> : <span />}
              {step < 3 ? <button type="button" className="inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40" disabled={loading || isSearchPending || catalog.total === 0 || Boolean(error)} onClick={proceed}>
                Continue <ArrowRight size={15} className="ml-2" />
              </button> : <button type="button" className="inline-flex items-center border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40" disabled={creating || loading || isSearchPending || Boolean(error) || !name.trim() || !canCreate} onClick={() => void createSession()}>
                {creating ? <LoaderCircle size={15} className="mr-2 animate-spin" /> : <Sparkles size={15} className="mr-2" />}Create set
              </button>}
            </div>
          </section>

          <aside className="space-y-5">
            <div className={`${surface} p-5`}>
              <h2 className="text-sm font-semibold">Your sessions</h2>
              {sessions.length ? <div className="mt-3 divide-y divide-border">
                {sessions.slice(0, 5).map((session) => <Link key={session.id} href={`/practice/contest-session/${session.id}`} className="block py-3 first:pt-0 last:pb-0">
                  <span className="block truncate text-sm text-foreground">{session.name}</span><span className="mt-1 block text-xs text-muted-foreground">{session.question_count} problems · {session.timer_minutes ? `${session.timer_minutes} min` : "untimed"}</span>
                </Link>)}
              </div> : <p className="mt-3 text-sm text-muted-foreground">{sessionsLoading ? "Loading" : "No saved sessions."}</p>}
            </div>
            <div className={`${surface} p-5`}>
              <div className="flex items-center gap-2 text-sm font-medium"><RotateCcw size={15} className="text-muted-foreground" />Practice, at your pace</div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Codeforces handles statements and judging.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
