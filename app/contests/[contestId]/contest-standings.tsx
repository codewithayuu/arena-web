"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ContestSubmissionError,
  getPublicContestStandings,
  type ParticipantContestProblem,
  type PublicContestStandings,
} from "@/lib/contest-submissions";
import {
  generateMockStandings,
  generateDynamicMockStandings,
  getMockSolvedProblemIds,
  isMockContestModeEnabled,
} from "@/lib/mock-contest-store";

const STANDINGS_PAGE_SIZE = 50;
const STANDINGS_REFRESH_INTERVAL_MS = 30_000;

export function ContestStandings({ contestId, participantLocal = false }: { contestId: string; participantLocal?: boolean }) {
  const [standings, setStandings] = useState<PublicContestStandings | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const requestInFlight = useRef(false);
  const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setMessage(null);

    // If local mock mode is enabled, load simulated live standings immediately
    if (isMockContestModeEnabled()) {
      const mockStandings = generateMockStandings(contestId, getMockSolvedProblemIds(contestId));
      setStandings(mockStandings);
      setLastConfirmedAt(new Date().toISOString());
      setLoading(false);
      requestInFlight.current = false;
      return;
    }

    try {
      setStandings(await getPublicContestStandings(contestId));
      setLastConfirmedAt(new Date().toISOString());
    } catch (error) {
      setMessage("Standings could not be refreshed. The last confirmed snapshot is shown; retry when the connection returns.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    void refresh();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible" && navigator.onLine) void refresh();
    };
    const timer = window.setInterval(refreshWhenVisible, STANDINGS_REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("online", refreshWhenVisible);
    window.addEventListener("mindflare_mock_submissions_changed", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("online", refreshWhenVisible);
      window.removeEventListener("mindflare_mock_submissions_changed", refresh);
    };
  }, [refresh]);

  const mockMode = isMockContestModeEnabled();
  const scoringLabel = standings?.scoring.preset === "codeforces_dynamic"
    ? "Codeforces Dynamic"
    : standings?.scoring.preset === "icpc" ? "ICPC" : "Points";
  const showPoints = standings?.scoring.preset !== "icpc";

  return (
    <section aria-labelledby="contest-standings-heading" className="mt-7 rounded-xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="contest-standings-heading" className="text-xl font-semibold">{mockMode ? "Development sample standings" : participantLocal ? "Client-reported standings" : "Official standings"}</h2>
          {standings && <p className="mt-1 text-sm text-zinc-400">{scoringLabel} · {standings.state}{lastConfirmedAt ? ` · updated ${new Date(lastConfirmedAt).toLocaleTimeString()}` : ""}</p>}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh standings"}
        </button>
      </div>

      {participantLocal && !mockMode && <p className="mt-3 text-sm text-amber-200">The contest service stores and scores verdicts reported by participant devices. It does not independently verify local verdicts.</p>}
      {standings?.scoring.preset === "codeforces_dynamic" && (
        <p className="mt-3 text-sm text-zinc-400">
          Points are recalculated from the contest service’s current solve counts, contest time, and wrong attempts{participantLocal ? ", using participant-reported verdicts." : "."}
        </p>
      )}
      {message && <p className="mt-4 text-sm text-amber-200" role="status">{message}</p>}
      {!message && loading && <p className="mt-4 text-sm text-zinc-400" role="status">Loading contest standings…</p>}
      {standings && standings.rows.length === 0 && (
        <p className="mt-4 text-sm text-zinc-400" role="status">{participantLocal ? "No participant-reported submissions are on the standings yet." : "No official submissions are on the standings yet."}</p>
      )}
      {standings && standings.rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <caption className="sr-only">Contest ranks and scores</caption>
            <thead>
              <tr className="border-b border-white/15 text-zinc-400">
                <th scope="col" className="px-3 py-2">Rank</th>
                <th scope="col" className="px-3 py-2">Participant</th>
                {showPoints && <th scope="col" className="px-3 py-2 text-right">Points</th>}
                <th scope="col" className="px-3 py-2 text-right">Solved</th>
                <th scope="col" className="px-3 py-2 text-right">Penalty (min)</th>
                <th scope="col" className="px-3 py-2">Activity</th>
              </tr>
            </thead>
            <tbody>
              {standings.rows.map((row, index) => (
                <tr key={`${row.rank}:${row.participant}:${index}`} className="border-b border-white/5 last:border-0">
                  <td className="px-3 py-3 font-semibold">{row.rank}</td>
                  <th scope="row" className="max-w-64 truncate px-3 py-3 font-medium">{row.participant}</th>
                  {showPoints && <td className="px-3 py-3 text-right tabular-nums">{row.points.toLocaleString()}</td>}
                  <td className="px-3 py-3 text-right tabular-nums">{row.solved}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{row.penalty_minutes}</td>
                  <td className="px-3 py-3 text-zinc-400">{row.hidden_activity ? "Updates hidden by freeze" : "Visible"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Render the gateway's freeze-masked problem cells beside labels from the
 * launcher's already-verified public bundle. Problem order and titles are
 * never inferred from client clock or opaque problem identifiers. */
export function ContestProblemStandings({
  contestId,
  problems,
  participantLocal = false,
}: {
  contestId: string;
  problems: ParticipantContestProblem[];
  participantLocal?: boolean;
}) {
  const [standings, setStandings] = useState<PublicContestStandings | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const requestInFlight = useRef(false);
  const [lastConfirmedAt, setLastConfirmedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setMessage(null);
    // If mock mode is enabled, supply dynamic mock problem standings
    if (isMockContestModeEnabled()) {
      const mockStandings = generateDynamicMockStandings(contestId, problems, getMockSolvedProblemIds(contestId));
      setStandings(mockStandings);
      setLastConfirmedAt(new Date().toISOString());
      setPage(0);
      setLoading(false);
      requestInFlight.current = false;
      return;
    }

    try {
      setStandings(await getPublicContestStandings(contestId));
      setLastConfirmedAt(new Date().toISOString());
      setPage(0);
    } catch {
      setMessage("Per-problem standings could not be refreshed. The last confirmed snapshot is shown; retry when the connection returns.");
    } finally {
      requestInFlight.current = false;
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    void refresh();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible" && navigator.onLine) void refresh();
    };
    const timer = window.setInterval(refreshWhenVisible, STANDINGS_REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("online", refreshWhenVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("online", refreshWhenVisible);
    };
  }, [refresh]);

  const orderedProblems = [...problems].sort((left, right) => left.ordinal - right.ordinal);
  const rows = standings?.rows ?? [];
  const pageCount = Math.max(1, Math.ceil(rows.length / STANDINGS_PAGE_SIZE));
  const visibleRows = rows.slice(page * STANDINGS_PAGE_SIZE, (page + 1) * STANDINGS_PAGE_SIZE);
  const firstVisible = rows.length ? page * STANDINGS_PAGE_SIZE + 1 : 0;
  const lastVisible = Math.min((page + 1) * STANDINGS_PAGE_SIZE, rows.length);

  return (
    <section aria-labelledby="contest-problem-standings-heading" className="mt-7 rounded-xl border border-white/10 bg-black/20 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 id="contest-problem-standings-heading" className="text-lg font-semibold">Per-problem standings</h4>
          {standings && <p className="mt-1 text-sm text-zinc-400">{standings.scoring.preset === "icpc" ? "ICPC" : standings.scoring.preset === "codeforces_dynamic" ? "Codeforces Dynamic" : "Points"} · {participantLocal ? "projection from client-reported verdicts" : "server projection"}{lastConfirmedAt ? ` · updated ${new Date(lastConfirmedAt).toLocaleTimeString()}` : ""}</p>}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Refreshing…" : "Refresh problem scores"}
        </button>
      </div>
      <p className="mt-3 text-sm text-zinc-400">
        Problem labels and order come from this admitted session’s verified public bundle. The gateway supplies all scores and applies contest freeze rules.
      </p>
      {message && <p className="mt-4 text-sm text-amber-200" role="status">{message}</p>}
      {!message && loading && <p className="mt-4 text-sm text-zinc-400" role="status">Loading problem scores…</p>}
      {standings && rows.length === 0 && (
        <p className="mt-4 text-sm text-zinc-400" role="status">{participantLocal ? "No participant-reported submissions are on the standings yet." : "No official submissions are on the standings yet."}</p>
      )}
      {standings && rows.length > 0 && (
        <>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <caption className="sr-only">Freeze-masked contest scores for each verified contest problem</caption>
              <thead>
                <tr className="border-b border-white/15 text-zinc-400">
                  <th scope="col" className="sticky left-0 bg-zinc-950 px-3 py-2">Rank</th>
                  <th scope="col" className="sticky left-12 bg-zinc-950 px-3 py-2">Participant</th>
                  {orderedProblems.map((problem) => (
                    <th key={problem.problem_id} scope="col" className="min-w-32 px-3 py-2 text-center">
                      <span className="block">{problem.ordinal}. {problem.title}</span>
                    </th>
                  ))}
                  <th scope="col" className="min-w-40 px-3 py-2">Activity</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row, index) => (
                  <tr key={`${row.rank}:${row.participant}:${page}:${index}`} className="border-b border-white/5 last:border-0">
                    <td className="sticky left-0 bg-zinc-950 px-3 py-3 font-semibold">{row.rank}</td>
                    <th scope="row" className="sticky left-12 max-w-64 truncate bg-zinc-950 px-3 py-3 font-medium">{row.participant}</th>
                    {orderedProblems.map((problem) => {
                      const cell = row.problems[problem.problem_id];
                      const value = standings.scoring.preset === "icpc"
                        ? cell?.solved ? `AC · ${cell.penalty_minutes ?? 0} min` : "—"
                        : cell && cell.points > 0 ? `${cell.points.toLocaleString()} pts` : "—";
                      return (
                        <td key={problem.problem_id} className="px-3 py-3 text-center tabular-nums" aria-label={`${problem.title}: ${value}`}>
                          {value}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-zinc-400">{row.hidden_activity ? "Updates hidden by freeze" : "Visible"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
            <p>Showing {firstVisible}–{lastVisible} of {rows.length} participants</p>
            {pageCount > 1 && (
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((current) => Math.max(0, current - 1))} disabled={page === 0}
                  className="rounded border border-white/20 px-3 py-1.5 disabled:opacity-50">Previous</button>
                <span aria-live="polite">Page {page + 1} of {pageCount}</span>
                <button type="button" onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} disabled={page + 1 >= pageCount}
                  className="rounded border border-white/20 px-3 py-1.5 disabled:opacity-50">Next</button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
