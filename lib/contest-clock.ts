export type ContestClockState =
  | { phase: "upcoming" | "active"; remainingSeconds: number }
  | { phase: "ended" | "unavailable"; remainingSeconds: 0 };

export function getContestPhaseLabel(phase: ContestClockState["phase"] | null): string {
  switch (phase) {
    case "upcoming": return "Upcoming";
    case "active": return "Live";
    case "ended": return "Ended";
    case "unavailable": return "Schedule unavailable";
    default: return "Checking schedule";
  }
}

/** Display-only schedule estimate. Admission and submission remain server-authoritative. */
export function getContestClockState(
  estimatedServerNowMs: number,
  startsAtMs: number,
  endsAtMs: number,
): ContestClockState {
  if (![estimatedServerNowMs, startsAtMs, endsAtMs].every(Number.isFinite) || endsAtMs <= startsAtMs) {
    return { phase: "unavailable", remainingSeconds: 0 };
  }
  if (estimatedServerNowMs < startsAtMs) {
    return { phase: "upcoming", remainingSeconds: Math.ceil((startsAtMs - estimatedServerNowMs) / 1000) };
  }
  if (estimatedServerNowMs < endsAtMs) {
    return { phase: "active", remainingSeconds: Math.ceil((endsAtMs - estimatedServerNowMs) / 1000) };
  }
  return { phase: "ended", remainingSeconds: 0 };
}

/**
 * Compute a display countdown from a server-time snapshot and a monotonic
 * performance-clock anchor. This intentionally does not read Date.now(): the
 * browser clock may be wrong or adjusted while the contest page is open.
 */
export function getServerCountdownRemainingSeconds(
  serverTimeMs: number,
  performanceAnchorMs: number,
  currentPerformanceMs: number,
  targetTimeMs: number,
): number | null {
  if (![serverTimeMs, performanceAnchorMs, currentPerformanceMs, targetTimeMs].every(Number.isFinite)) {
    return null;
  }
  const elapsedMs = Math.max(0, currentPerformanceMs - performanceAnchorMs);
  const estimatedServerNowMs = serverTimeMs + elapsedMs;
  return Math.max(0, Math.ceil((targetTimeMs - estimatedServerNowMs) / 1000));
}
