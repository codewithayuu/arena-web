"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  parseParticipantContestMetadata,
  type ParticipantContestMetadata,
} from "@/lib/contest-metadata";
import { getServerCountdownRemainingSeconds } from "@/lib/contest-clock";

const MAX_RESPONSE_BYTES = 16 * 1024;
const REFRESH_INTERVAL_MS = 30_000;

type RefreshError = "unauthorized" | "not_found" | "unavailable" | null;

export function ContestScheduleClock({
  contestId,
  initialMetadata,
}: {
  contestId: string;
  initialMetadata: ParticipantContestMetadata;
}) {
  const [metadata, setMetadata] = useState(initialMetadata);
  const [fresh, setFresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [online, setOnline] = useState(true);
  const [refreshError, setRefreshError] = useState<RefreshError>(null);
  const [clockAnchor, setClockAnchor] = useState<{ serverMs: number; performanceMs: number } | null>(null);
  const [performanceMs, setPerformanceMs] = useState(0);
  const requestInFlight = useRef(false);
  const boundaryRefreshKey = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setRefreshing(true);
    setFresh(false);
    setRefreshError(null);
    try {
      const response = await fetch(`/api/contests/${contestId}/metadata`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) {
        await response.body?.cancel();
        setRefreshError(response.status === 401 ? "unauthorized"
          : response.status === 404 ? "not_found" : "unavailable");
        return;
      }
      const value = await boundedJson(response);
      const current = parseParticipantContestMetadata(value, contestId);
      if (!current || response.headers.get("x-mindflare-server-time") !== current.server_time) {
        setRefreshError("unavailable");
        return;
      }
      setMetadata(current);
      setClockAnchor({ serverMs: Date.parse(current.server_time), performanceMs: performance.now() });
      setFresh(true);
      setRefreshError(null);
    } catch {
      setRefreshError("unavailable");
    } finally {
      requestInFlight.current = false;
      setRefreshing(false);
    }
  }, [contestId]);

  useEffect(() => {
    setMetadata(initialMetadata);
    setFresh(true);
    setClockAnchor({ serverMs: Date.parse(initialMetadata.server_time), performanceMs: performance.now() });
  }, [contestId, initialMetadata]);

  useEffect(() => {
    setOnline(navigator.onLine);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, REFRESH_INTERVAL_MS);
    const tick = window.setInterval(() => setPerformanceMs(performance.now()), 1000);
    const handleOnline = () => {
      setOnline(true);
      void refresh();
    };
    const handleOffline = () => {
      setOnline(false);
      setFresh(false);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);
    void refresh();
    return () => {
      window.clearInterval(timer);
      window.clearInterval(tick);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refresh]);

  const target = countdownTarget(metadata);
  const targetMs = target ? Date.parse(target.at) : Number.NaN;
  const remainingSeconds = getServerCountdownRemainingSeconds(
    clockAnchor?.serverMs ?? Number.NaN,
    clockAnchor?.performanceMs ?? Number.NaN,
    performanceMs,
    targetMs,
  );

  useEffect(() => {
    if (!fresh || !target || remainingSeconds !== 0) return;
    const key = `${metadata.phase}:${target.at}`;
    if (boundaryRefreshKey.current === key) return;
    boundaryRefreshKey.current = key;
    void refresh();
  }, [fresh, metadata.phase, refresh, remainingSeconds, target]);

  const statusLabel = !online
    ? "Offline. The displayed metadata is stale."
    : fresh
      ? `Current server snapshot: ${metadata.server_time}`
      : refreshError === "unauthorized"
        ? "Your sign-in expired. Sign in again to refresh contest status."
        : refreshError === "not_found"
          ? "The server no longer publishes this contest."
          : refreshing
            ? "Checking the current contest status with the server…"
            : "The latest server status could not be confirmed. The displayed metadata is stale.";

  const eligibilityLabel = fresh
    ? eligibilityLabelFor(metadata.eligibility.status)
    : "Not available until the server status refreshes.";

  return (
    <section id="contest-schedule" className="my-4 scroll-mt-6 rounded-lg border border-white/10 bg-black/20 p-4" aria-labelledby="contest-metadata-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id="contest-metadata-heading" className="text-sm font-semibold">Contest status</h3>
          <p className="mt-1 text-xs text-zinc-400" role="status" aria-live="polite">{statusLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={refreshing}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
        >
          {refreshing ? "Refreshing…" : "Refresh status"}
        </button>
      </div>

      <dl className="mt-4 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
        <div><dt className="text-xs text-zinc-400">Server schedule phase</dt><dd>{phaseLabel(metadata.phase)} · lifecycle {metadata.lifecycle_state}</dd></div>
        <div><dt className="text-xs text-zinc-400">Your registration</dt><dd>{metadata.registration.status ?? "Not registered"}</dd></div>
        <div><dt className="text-xs text-zinc-400">Registration window</dt><dd>{metadata.registration.open ? "Open" : metadata.registration.enabled ? "Closed" : "Not enabled"}</dd></div>
        <div><dt className="text-xs text-zinc-400">Preflight status preview</dt><dd>{eligibilityLabel}</dd></div>
        <div><dt className="text-xs text-zinc-400">Scheduled start (UTC)</dt><dd>{metadata.starts_at}</dd></div>
        <div><dt className="text-xs text-zinc-400">Scheduled end (UTC)</dt><dd>{metadata.ends_at}</dd></div>
        {metadata.registration.kind === "team" && (
          <div><dt className="text-xs text-zinc-400">Your team registration</dt><dd>{metadata.registration.team_size ?? 0} registered · minimum {metadata.registration.team_min_size ?? "unavailable"}</dd></div>
        )}
      </dl>

      <div className="mt-4 rounded-md border border-white/10 px-3 py-2 text-sm text-zinc-300" role="timer">
        {target && remainingSeconds !== null
          ? remainingSeconds === 0
            ? fresh ? "Time boundary reached; refreshing the server phase…" : "Time boundary passed; refresh to confirm the server phase."
            : `${target.label} ${formatDuration(remainingSeconds)}`
          : "No schedule countdown is available for this phase."}
      </div>
      <p className="mt-3 text-xs text-zinc-400">
        The phase and eligibility preview come from PostgreSQL server time. The countdown is an approximate display based on a monotonic timer. A preflight preview does not admit you; the gateway checks current eligibility, pairing, policy, and required platform controls again.
      </p>
    </section>
  );
}

function countdownTarget(metadata: ParticipantContestMetadata): { at: string; label: string } | null {
  switch (metadata.phase) {
    case "upcoming": return { at: metadata.preflight_opens_at, label: "Preflight opens in" };
    case "preflight": return { at: metadata.starts_at, label: "Scheduled start in" };
    case "admission_grace": return { at: metadata.first_admission_closes_at, label: "First admission closes in" };
    case "contest_window": return { at: metadata.ends_at, label: "Scheduled end in" };
    default: return null;
  }
}

function phaseLabel(phase: ParticipantContestMetadata["phase"]): string {
  switch (phase) {
    case "upcoming": return "Upcoming";
    case "preflight": return "Preflight";
    case "admission_grace": return "First admission window";
    case "contest_window": return "Contest window";
    case "ended": return "Ended";
    case "paused": return "Paused";
    case "finalizing": return "Finalizing";
    case "review": return "Under review";
    case "published": return "Results published";
    case "archived": return "Archived";
  }
}

function eligibilityLabelFor(status: ParticipantContestMetadata["eligibility"]["status"]): string {
  switch (status) {
    case "registration_required": return "Registration required";
    case "registration_inactive": return "Registration is inactive";
    case "admin_reentry_required": return "Admin-approved reentry required";
    case "contest_not_admitting": return "The contest is not accepting first entry";
    case "preflight_not_open": return "Preflight has not opened";
    case "admission_window_closed": return "The first admission window has closed";
    case "team_incomplete": return "Your team has not met its registered minimum";
    case "eligible_for_preflight": return "You may request preflight; admission is not granted";
  }
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  return [hours, minutes, remainder].map((part) => String(part).padStart(2, "0")).join(":");
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw new Error("Missing metadata response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_RESPONSE_BYTES) throw new Error("Metadata response too large");
      chunks.push(next.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
}
