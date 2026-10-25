import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTEST_ID, loadContestEntry, ContestEntry } from "@/lib/contest-entry-server";
import { getContestById } from "@/lib/contest-registry";
import { ContestRuntimePairing } from "./runtime-pairing";
import { ContestLaunchButton } from "./contest-launch-button";
import { ContestScheduleClock } from "./contest-schedule-clock";
import { ContestStandings } from "./contest-standings";
import { ShieldCheck, Terminal, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mindflare Arena — Examination & Proctoring",
  referrer: "no-referrer" as const,
};

async function getDynamicFallbackEntry(contestId: string): Promise<ContestEntry> {
  const now = Date.now();
  const dynamicContest = await getContestById(contestId);
  const contestName = dynamicContest?.name || "Mindflare Examination Arena";
  const languages = dynamicContest?.languages || ["cpp17", "cpp20", "java", "python", "javascript"];
  const startsAt = dynamicContest?.starts_at || new Date(now - 3600000).toISOString();
  const endsAt = dynamicContest?.ends_at || new Date(now + 86400000).toISOString();
  const admissionClosesAt = new Date(Math.min(Date.parse(startsAt) + 900000, Date.parse(endsAt))).toISOString();

  const notice = dynamicContest?.description ||
    "Development preview only. This page does not establish contest admission, collect camera evidence, or create an official result.";

  return {
    state: "published",
    details: {
      startsAt,
      endsAt,
      revision: 1,
      policyDigest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      policyEnvelope: {
        policy: {
          contest_id: contestId,
          policy_revision: 1,
          starts_at: startsAt,
          ends_at: endsAt,
          languages,
          integrity: {
            lockdown: false,
            webcam_required: false,
            phone_detection: false,
            microphone: false,
            screen_monitoring: false,
            record_video: false,
            record_audio: false,
            record_screen: false,
          },
        },
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        signature: "sample_ed25519_signature_for_local_development_testing_only_abcdefghijklmnopqrstuvwxyz1234567890",
        key_id: "mindflare-dev-key",
        algorithm: "Ed25519",
      },
      languages,
      notice,
      requiresLockdown: false,
      requiredCapture: [],
    },
    metadata: {
      contest_id: contestId,
      name: contestName,
      lifecycle_state: "active",
      lifecycle_version: 1,
      phase: "contest_window",
      starts_at: startsAt,
      ends_at: endsAt,
      preflight_minutes: 5,
      preflight_opens_at: new Date(Date.parse(startsAt) - 5 * 60000).toISOString(),
      first_admission_closes_at: admissionClosesAt,
      late_join_grace_seconds: 900,
      server_time: new Date().toISOString(),
      registration: {
        mode: "individual",
        enabled: true,
        open: true,
        status: "registered",
        kind: "individual",
        team_size: 1,
        team_min_size: 1,
      },
      eligibility: {
        status: "eligible_for_preflight",
        may_request_preflight: true,
      },
    },
  };
}

export default async function ExaminationEntry({
  params,
  searchParams,
}: {
  params: Promise<{ contestId: string }>;
  searchParams?: Promise<{ launch_request_id?: string | string[] }>;
}) {
  const { contestId: input } = await params;
  const contestId = input.toLowerCase();
  if (!CONTEST_ID.test(contestId)) notFound();

  const launchReference = (await searchParams)?.launch_request_id;
  if (launchReference !== undefined && (typeof launchReference !== "string" || !CONTEST_ID.test(launchReference))) {
    notFound();
  }
  const launchRequestId = typeof launchReference === "string" ? launchReference.toLowerCase() : null;

  let entry = await loadContestEntry(contestId);
  const isGuestMode = entry.state === "signed-out" || entry.state === "unavailable";

  // Allow entering without sign in: in local dev, testing, or guest mode, provide dynamic contest entry
  if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE === "true" &&
      (entry.state === "unavailable" || entry.state === "signed-out")) {
    entry = await getDynamicFallbackEntry(contestId);
  }

  const path = `/contests/${contestId}`;
  const signInPath = launchRequestId
    ? `${path}/sign-in?launch_request_id=${encodeURIComponent(launchRequestId)}`
    : `${path}/sign-in`;

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-8 px-6 py-16">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg text-white font-black text-xl">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-red-400">
                Contest workspace
              </p>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
              {entry.state === "published" ? entry.metadata.name : "Examination Entry"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contests"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Contest Directory
          </Link>
        </div>
      </header>

      {entry.state === "published" ? (
        <div className="space-y-6">
          {/* Guest Examination Mode Alert (When Entered Without Sign-In) */}
          {isGuestMode && (
            <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    Development preview only
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                      Not an official contest
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                    This local preview does not establish contest admission, collect camera evidence, or create an official result. Sign in to check published contest access.
                  </p>
                </div>
              </div>
              <Link
                href={signInPath}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </section>
          )}

          {/* Contest Clock and Launch Controls */}
          <ContestScheduleClock contestId={contestId} initialMetadata={entry.metadata} />

          {/* Participant Notice */}
          {entry.details.notice && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-red-400" />
                Participant Policy & Consent Notice
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {entry.details.notice}
              </p>
            </div>
          )}

          {/* Launcher Handoff Button (when launchRequestId is not present) */}
          {!launchRequestId && (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-5">
              <ContestLaunchButton contestId={contestId} />
            </div>
          )}

          {/* Core Runtime Pairing & Proctoring Environment */}
          <ContestRuntimePairing
            contestId={contestId}
            launchRequestId={launchRequestId}
            policy={{
              revision: entry.details.revision,
              digest: entry.details.policyDigest,
              policyEnvelope: entry.details.policyEnvelope,
              requiresLockdown: entry.details.requiresLockdown,
              requiredCapture: entry.details.requiredCapture,
              languages: entry.details.languages,
            }}
          />

          {/* Standings */}
          <ContestStandings key={contestId} contestId={contestId}
            participantLocal={entry.details.policyEnvelope.policy.execution_mode === "participant_local"} />
        </div>
      ) : entry.state === "signed-out" ? (
        <section className="rounded-xl border border-white/15 p-6">
          <h2 className="text-lg font-semibold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-zinc-400">Your account and contest eligibility are checked before admission.</p>
          <div className="mt-4 flex gap-4"><Link href={signInPath} className="underline">Member sign-in</Link><Link href="/contest-access" className="underline">Temporary access key</Link></div>
        </section>
      ) : (
        <section aria-labelledby="unavailable-heading" className="rounded-2xl border border-white/10 bg-zinc-950/80 p-8 text-center shadow-xl backdrop-blur-md">
          <h2 id="unavailable-heading" className="text-lg font-bold text-white">Examination Unavailable</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Contest details could not be confirmed. Please verify your registration or contact your contest organizer.
          </p>
          <div className="mt-4">
            <Link className="inline-block rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/10" href={path}>
              Retry Contest Details
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 pt-6 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-4">
        <p>Mindflare Arena · Safe Exam Browser Environment · Unmodified Official SEB</p>
        <Link className="font-semibold text-zinc-400 hover:text-white underline underline-offset-4" href={`${path}/seb-exit`}>
          Return to Learning
        </Link>
      </footer>
    </main>
  );
}
