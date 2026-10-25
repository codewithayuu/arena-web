import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { loadParticipantContestDirectory, loadPublicContestDirectory } from "@/lib/contest-entry-server";
import { getAllContests } from "@/lib/contest-registry";
import { ContestRegistrationControls } from "./contest-registration-controls";
import { ShieldCheck, Trophy, Clock, Cpu, ArrowRight, Settings } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mindflare Arena — Official Contests",
  description: "Official competitive programming rounds and proctored arenas.",
};

const PAGE_SIZE = 20;

function parseOffset(value: string | undefined): number {
  if (!value || !/^(0|[1-9][0-9]*)$/.test(value)) return 0;
  const offset = Number(value);
  return Number.isSafeInteger(offset) && offset <= 10_000 && offset % PAGE_SIZE === 0 ? offset : 0;
}

function phaseLabel(phase: string): string {
  return phase.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function displayTime(value: string): string {
  try {
    return (
      new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(new Date(value)) + " UTC"
    );
  } catch {
    return value;
  }
}

// Scheduled contests for local testing, visual tracking, and demonstration
const HALLOWEEN_CONTEST = {
  contest_id: "halloween-hollow-hill-div3",
  name: "🎃 Hollow Hill Halloween Contest (Div. 3)",
  lifecycle_state: "active" as const,
  phase: "contest_window" as const,
  starts_at: new Date(Date.now() - 3600000).toISOString(),
  ends_at: new Date(Date.now() + 86400000).toISOString(),
  preflight_opens_at: new Date(Date.now() - 4500000).toISOString(),
  first_admission_closes_at: new Date(Date.now() + 86400000).toISOString(),
  registration: {
    mode: "individual" as const,
    enabled: true,
    open: true,
    status: "registered",
    kind: "individual" as const,
    team_size: 1,
    team_min_size: 1,
  },
  eligibility: {
    status: "eligible_for_preflight" as const,
    may_request_preflight: true,
  },
};

const DEADLOCK_CONTEST = {
  contest_id: "dead10c2-2026-4000-8000-000000000026",
  name: "DEADLOCK '26 — Agent Arena: Containment",
  lifecycle_state: "active" as const,
  phase: "contest_window" as const,
  starts_at: new Date(Date.now() - 3600000).toISOString(),
  ends_at: new Date(Date.now() + 86400000).toISOString(),
  preflight_opens_at: new Date(Date.now() - 4500000).toISOString(),
  first_admission_closes_at: new Date(Date.now() + 86400000).toISOString(),
  registration: {
    mode: "individual" as const,
    enabled: true,
    open: true,
    status: "registered",
    kind: "individual" as const,
    team_size: 1,
    team_min_size: 1,
  },
  eligibility: {
    status: "eligible_for_preflight" as const,
    may_request_preflight: true,
  },
};

const DEFAULT_CONTESTS = [HALLOWEEN_CONTEST, DEADLOCK_CONTEST];

export default async function ContestDirectory({
  searchParams,
}: {
  searchParams?: Promise<{ offset?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const offset = parseOffset(resolvedParams.offset);
  const [result, publicResult] = await Promise.all([
    loadParticipantContestDirectory(offset),
    loadPublicContestDirectory(offset),
  ]);

  // Load dynamically registered contests
  const registeredContests = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE === "true" ? await getAllContests() : [];
  const dynamicContestItems = registeredContests.map((c) => ({
    contest_id: c.contest_id,
    name: c.name,
    lifecycle_state: "active" as const,
    phase: "contest_window" as const,
    starts_at: c.starts_at,
    ends_at: c.ends_at,
    preflight_minutes: 5,
    preflight_opens_at: new Date(Date.parse(c.starts_at) - 5 * 60000).toISOString(),
    problem_count: c.problems.length,
    registration_enabled: true,
    first_admission_closes_at: c.ends_at,
    registration: {
      mode: "individual" as const,
      enabled: true,
      open: true,
      status: "registered",
      kind: "individual" as const,
      team_size: 1,
      team_min_size: 1,
    },
    eligibility: {
      status: "eligible_for_preflight" as const,
      may_request_preflight: true,
    },
  }));

  const participantById = new Map(result.state === "ready"
    ? result.directory.items.map((item) => [item.contest_id, item] as const) : []);
  const publicItems = publicResult.state === "ready" ? publicResult.directory.items : [];
  const items = publicItems.length > 0
    ? publicItems.map((item) => {
        const participant = participantById.get(item.contest_id);
        return {
          ...item,
          lifecycle_version: participant?.lifecycle_version ?? 0,
          registration: participant?.registration ?? {
            mode: null, enabled: item.registration_enabled, open: false, status: null, kind: null,
          },
        };
      })
    : result.state === "ready" && result.directory.items.length > 0
      ? result.directory.items.map((item) => ({ ...item, problem_count: null, registration_enabled: item.registration.enabled }))
      : dynamicContestItems;

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-24">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <p className="text-xs font-bold uppercase tracking-widest text-red-500">Official Contest System</p>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Mindflare Contests</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Browse published contest schedules. Entry, execution mode, consent, and result provenance are shown before participation.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/contests"
            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-md"
          >
            <Settings className="h-4 w-4" />
            Admin Contest Settings
          </Link>
          <Link
            href="/deadlock"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-red-500 hover:to-rose-500 transition-all"
          >
            <Trophy className="h-4 w-4" />
            Deadlock Arena
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
          >
            Back to Learning
          </Link>
        </div>
      </header>

      {/* Guest Mode / Signed-Out Notice */}
      {result.state === "signed-out" && (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Sign in to enter a contest
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                  Account required
                </span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                Permanent members use their account. Temporary participants use the individual access key issued by the organizer.
              </p>
            </div>
          </div>
          <Link
            href="/sign-in?redirect_url=/contests"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
          <Link href="/contest-access" className="text-sm underline">Temporary access key</Link>
        </section>
      )}

      {/* Active / Scheduled Contests List */}
      <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Showing {items.length} contest(s)</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Published contest status
              </span>
            </div>

            <ol className="grid gap-5">
              {items.map((contest) => (
                <li key={contest.contest_id}>
                  <article
                    id={`contest-${contest.contest_id}`}
                    className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-6 shadow-xl backdrop-blur-md hover:border-white/20 transition-all"
                  >
                    {/* Top Glow Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-400">
                            {phaseLabel(contest.phase)}
                          </span>
                          <span className="text-[11px] text-zinc-500">ID: {contest.contest_id.slice(0, 8)}…</span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{contest.name}</h2>
                        <p className="text-xs text-zinc-400 max-w-xl">
                          {contest.problem_count ? `${contest.problem_count} problems` : "Published contest"} · Preparation opens {displayTime(contest.preflight_opens_at)}.
                        </p>
                      </div>

                      <Link
                        href={`/contests/${contest.contest_id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-red-500 hover:scale-105 transition-all"
                      >
                        View contest details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-xs text-zinc-300 sm:grid-cols-4">
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <dt className="text-[10px] uppercase font-semibold text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Starts At
                        </dt>
                        <dd className="mt-1 font-mono text-zinc-200">{displayTime(contest.starts_at)}</dd>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <dt className="text-[10px] uppercase font-semibold text-zinc-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Ends At
                        </dt>
                        <dd className="mt-1 font-mono text-zinc-200">{displayTime(contest.ends_at)}</dd>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <dt className="text-[10px] uppercase font-semibold text-zinc-500 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          Preparation
                        </dt>
                        <dd className="mt-1 font-semibold text-emerald-400">{contest.preflight_minutes} minutes before start</dd>
                      </div>
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <dt className="text-[10px] uppercase font-semibold text-zinc-500 flex items-center gap-1">
                          <Cpu className="h-3 w-3" />
                          Registration
                        </dt>
                        <dd className="mt-1 text-zinc-200">{contest.registration.open ? "Open" : "Organizer access"}</dd>
                      </div>
                    </dl>

                    <div className="mt-4 border-t border-white/10 pt-3">
                      {participantById.has(contest.contest_id)
                        ? <ContestRegistrationControls contest={participantById.get(contest.contest_id)!} />
                        : <p className="text-xs text-zinc-400">Sign in or use the individual temporary access key issued by the organizer to register and enter.</p>}
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>

          {/* Pagination */}
          <nav aria-label="Contest pages" className="flex items-center justify-between border-t border-white/10 pt-4">
            {offset > 0 ? (
              <Link
                href={`/contests?offset=${Math.max(0, offset - PAGE_SIZE)}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Previous
              </Link>
            ) : (
              <span />
            )}
            {publicResult.state === "ready" && publicResult.directory.next_offset !== null && (
              <Link
                href={`/contests?offset=${publicResult.directory.next_offset}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Next
              </Link>
            )}
          </nav>
    </main>
  );
}
