import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { getCodeforcesProblems, type CodeforcesProblem } from "@/lib/codeforces-problems.server";
import { getMemberProfileId } from "@/lib/member-profile.server";
import { PRACTICE_PROBLEMS } from "@/lib/practice-problems";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ sessionId: string }> };
type SessionProblem = {
  id: string;
  title: string;
  rating: number | null;
  tags: string[];
  url: string;
  source: "Codeforces" | "Mindflare";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function codeforcesFallback(id: string): SessionProblem | null {
  const match = /^(\d+):([A-Za-z0-9]+)$/.exec(id);
  if (!match) return null;
  const contestId = Number(match[1]);
  const index = match[2];
  return {
    id,
    title: `Codeforces ${contestId}${index}`,
    rating: null,
    tags: [],
    url: `https://codeforces.com/problemset/problem/${contestId}/${encodeURIComponent(index)}`,
    source: "Codeforces",
  };
}

function snapshotProblem(value: unknown, expectedId: string): SessionProblem | null {
  if (!isRecord(value) || value.id !== expectedId) return null;
  const contestId = Number(value.contestId);
  const index = typeof value.index === "string" ? value.index : "";
  if (!Number.isSafeInteger(contestId) || contestId < 1 || !/^[A-Za-z0-9]+$/.test(index)) return null;
  const tags = Array.isArray(value.tags) ? value.tags.filter((tag): tag is string => typeof tag === "string").slice(0, 30) : [];
  const rating = Number.isSafeInteger(value.rating) && Number(value.rating) > 0 ? Number(value.rating) : null;
  return {
    id: expectedId,
    title: typeof value.name === "string" && value.name.length <= 300 ? value.name : `Codeforces ${contestId}${index}`,
    rating,
    tags,
    url: `https://codeforces.com/problemset/problem/${contestId}/${encodeURIComponent(index)}`,
    source: "Codeforces",
  };
}

function codeforcesProblem(problem: CodeforcesProblem): SessionProblem {
  return { id: problem.id, title: problem.name, rating: problem.rating, tags: problem.tags, url: problem.url, source: "Codeforces" };
}

function legacyProblem(id: string): SessionProblem | null {
  const problem = PRACTICE_PROBLEMS.find((item) => item.id === id);
  return problem ? {
    id: problem.id,
    title: problem.title,
    rating: null,
    tags: problem.topics.slice(0, 8),
    url: problem.leetcodeUrl,
    source: "Mindflare",
  } : null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view this practice session" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "practice-session-read", identity: userId, limit: 60, windowSeconds: 60 });
  if (limited) return limited;
  const { sessionId } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
    return NextResponse.json({ error: "Practice session not found" }, { status: 404 });
  }
  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("member_practice_sessions");
    url.search = new URLSearchParams({
      select: "id,name,question_count,timer_minutes,filters,problem_ids,created_at",
      id: `eq.${sessionId}`,
      profile_id: `eq.${profileId}`,
      limit: "1",
    }).toString();
    const response = await supabaseRequest(url, { method: "GET" });
    if (!response.ok) return NextResponse.json({ error: "Practice session is temporarily unavailable" }, { status: 503 });
    const rows = await response.json() as Array<{
      id: string; name: string; question_count: number; timer_minutes: number; filters: unknown; problem_ids: unknown; created_at: string;
    }>;
    const row = rows[0];
    if (!row || !Array.isArray(row.problem_ids) || !row.problem_ids.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "Practice session not found" }, { status: 404 });
    }

    const snapshots = new Map<string, SessionProblem>();
    if (isRecord(row.filters) && Array.isArray(row.filters.snapshot)) {
      for (const value of row.filters.snapshot) {
        if (!isRecord(value) || typeof value.id !== "string") continue;
        const snapshot = snapshotProblem(value, value.id);
        if (snapshot) snapshots.set(snapshot.id, snapshot);
      }
    }

    const missingCodeforcesIds = row.problem_ids.filter((id) => /^\d+:[A-Za-z0-9]+$/.test(id) && !snapshots.has(id));
    let currentCodeforces = new Map<string, SessionProblem>();
    if (missingCodeforcesIds.length) {
      try {
        const problems = await getCodeforcesProblems();
        currentCodeforces = new Map(problems.map((problem) => [problem.id, codeforcesProblem(problem)]));
      } catch {
        // Saved IDs still resolve to a direct Codeforces URL when the upstream catalog is unavailable.
      }
    }

    const problems = row.problem_ids.map((id) =>
      snapshots.get(id) ?? currentCodeforces.get(id) ?? legacyProblem(id) ?? codeforcesFallback(id),
    ).filter((item): item is SessionProblem => item !== null);

    return NextResponse.json({ session: {
      id: row.id,
      name: row.name,
      questionCount: row.question_count,
      timerMinutes: row.timer_minutes,
      filters: row.filters,
      createdAt: row.created_at,
      problems,
    } });
  } catch {
    return NextResponse.json({ error: "Practice session is temporarily unavailable" }, { status: 503 });
  }
}
