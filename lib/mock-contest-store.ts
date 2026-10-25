"use client";

import { ParticipantContestProblem, PublicContestStandings } from "./contest-submissions";

export interface MockSubmissionRecord {
  submission_id: string;
  problem_id: string;
  problem_title: string;
  language: string;
  accepted_at: string;
  verdict: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT_EXCEEDED" | "COMPILATION_ERROR";
  runtime_ms: number;
  memory_mb: number;
  score: number;
  source: string;
}

const STORAGE_KEY_PREFIX = "mindflare_mock_contest_";

export function isMockContestModeEnabled(): boolean {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE !== "true") return false;
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("mindflare_mock_mode_flag");
  if (stored !== null) return stored === "true";
  return true;
}

export function setMockContestModeEnabled(enabled: boolean): void {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE !== "true") return;
  if (typeof window === "undefined") return;
  localStorage.setItem("mindflare_mock_mode_flag", enabled ? "true" : "false");
  window.dispatchEvent(new Event("mindflare_mock_mode_changed"));
}

export function getMockSubmissions(contestId: string): MockSubmissionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}submissions_${contestId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMockSubmission(contestId: string, submission: MockSubmissionRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getMockSubmissions(contestId);
    const updated = [submission, ...existing.filter((s) => s.submission_id !== submission.submission_id)].slice(0, 50);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}submissions_${contestId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event("mindflare_mock_submissions_changed"));
  } catch {
    // ignore
  }
}

export function getMockSolvedProblemIds(contestId: string): Set<string> {
  const submissions = getMockSubmissions(contestId);
  const solved = new Set<string>();
  for (const s of submissions) {
    if (s.verdict === "ACCEPTED") {
      solved.add(s.problem_id);
    }
  }
  return solved;
}

export function generateDynamicMockStandings(
  contestId: string,
  problems: ParticipantContestProblem[],
  currentSolvedIds: Set<string>
): PublicContestStandings {
  const userSolvedCount = currentSolvedIds.size;
  const userPoints = userSolvedCount * 100;
  const userPenalty = userSolvedCount * 14;

  const userProblemStatus: Record<string, { solved: boolean; points: number; penalty_minutes: number | null; best_score_achieved_at_seconds: number | null }> = {};
  for (const p of problems) {
    const isSolved = currentSolvedIds.has(p.problem_id);
    userProblemStatus[p.problem_id] = {
      solved: isSolved,
      points: isSolved ? 100 : 0,
      penalty_minutes: isSolved ? 12 : null,
      best_score_achieved_at_seconds: isSolved ? 720 : null,
    };
  }

  const rows = [
    {
      rank: 1,
      participant: "Grandmaster_Raven",
      solved: Math.min(problems.length, 6),
      points: Math.min(problems.length, 6) * 95,
      penalty_minutes: 45,
      hidden_activity: false,
      problems: {},
    },
    {
      rank: 2,
      participant: "Shadow_Compiler",
      solved: Math.min(problems.length, 5),
      points: Math.min(problems.length, 5) * 90,
      penalty_minutes: 58,
      hidden_activity: false,
      problems: {},
    },
    {
      rank: 3,
      participant: "You (Current Contestant)",
      solved: userSolvedCount,
      points: userPoints,
      penalty_minutes: userPenalty,
      hidden_activity: false,
      problems: userProblemStatus,
    },
    {
      rank: 4,
      participant: "Neon_Byte_Walker",
      solved: Math.min(problems.length, 3),
      points: Math.min(problems.length, 3) * 85,
      penalty_minutes: 84,
      hidden_activity: false,
      problems: {},
    },
    {
      rank: 5,
      participant: "Cyber_Phantom",
      solved: Math.min(problems.length, 2),
      points: Math.min(problems.length, 2) * 80,
      penalty_minutes: 92,
      hidden_activity: false,
      problems: {},
    },
  ];

  // Sort rows by points desc, then penalty asc
  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return a.penalty_minutes - b.penalty_minutes;
  });

  // Re-index ranks
  rows.forEach((r, idx) => {
    r.rank = idx + 1;
  });

  return {
    state: "active",
    scoring: {
      preset: "points",
      version: "1.0",
    },
    rows,
  };
}

export function generateMockStandings(contestId: string, currentSolvedIds: Set<string>): PublicContestStandings {
  return generateDynamicMockStandings(contestId, [], currentSolvedIds);
}
