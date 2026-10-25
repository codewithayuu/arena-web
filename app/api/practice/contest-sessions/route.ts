import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import {
  filterCodeforcesProblems,
  getCodeforcesProblems,
  normalizeCodeforcesFilters,
  type CodeforcesProblem,
} from "@/lib/codeforces-problems.server";
import { getMemberProfileId } from "@/lib/member-profile.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PROBLEMS = 30;
const MAX_TIMER_MINUTES = 240;

function pickRandom<T>(items: T[], count: number): T[] {
  const pool = [...items];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapAt = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapAt]] = [pool[swapAt], pool[index]];
  }
  return pool.slice(0, count);
}

function unavailable() {
  return NextResponse.json({ error: "Practice sessions are temporarily unavailable" }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view practice sessions" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "practice-sessions-read", identity: userId, limit: 60, windowSeconds: 60 });
  if (limited) return limited;
  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("member_practice_sessions");
    url.search = new URLSearchParams({
      select: "id,name,question_count,timer_minutes,created_at",
      profile_id: `eq.${profileId}`,
      order: "created_at.desc",
      limit: "10",
    }).toString();
    const response = await supabaseRequest(url, { method: "GET" });
    if (!response.ok) return unavailable();
    return NextResponse.json({ sessions: await response.json() });
  } catch {
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to create a practice session" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "practice-sessions-create", identity: userId, limit: 10, windowSeconds: 60 });
  if (limited) return limited;

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 8_000) return NextResponse.json({ error: "Session settings are too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid session settings" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid session settings" }, { status: 400 });

  const value = body as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name.trim().replace(/\s+/g, " ") : "Practice set";
  const questionCount = value.questionCount;
  const timerMinutes = value.timerMinutes;
  if (name.length < 1 || name.length > 80) return NextResponse.json({ error: "Name must be 1 to 80 characters" }, { status: 400 });
  if (!Number.isInteger(questionCount) || Number(questionCount) < 1 || Number(questionCount) > MAX_PROBLEMS) {
    return NextResponse.json({ error: `Choose 1 to ${MAX_PROBLEMS} problems` }, { status: 400 });
  }
  if (!Number.isInteger(timerMinutes) || Number(timerMinutes) < 0 || Number(timerMinutes) > MAX_TIMER_MINUTES) {
    return NextResponse.json({ error: "Choose a timer from 0 to 240 minutes" }, { status: 400 });
  }

  const filters = normalizeCodeforcesFilters({
    search: value.search,
    minRating: value.minRating,
    maxRating: value.maxRating,
    tags: value.tags,
    sort: value.sort,
  });
  if (!filters) return NextResponse.json({ error: "Invalid Codeforces filters" }, { status: 400 });

  let chosen: CodeforcesProblem[];
  try {
    const catalog = await getCodeforcesProblems();
    const pool = filterCodeforcesProblems(catalog, filters);
    if (pool.length < Number(questionCount)) {
      return NextResponse.json({ error: `Only ${pool.length} problems match these filters` }, { status: 422 });
    }
    chosen = pickRandom(pool, Number(questionCount));
  } catch {
    return NextResponse.json({ error: "Codeforces problem catalog is temporarily unavailable" }, { status: 503 });
  }

  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("member_practice_sessions");
    const response = await supabaseRequest(url, {
      method: "POST",
      headers: { "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify({
        profile_id: profileId,
        name,
        question_count: Number(questionCount),
        timer_minutes: Number(timerMinutes),
        filters: {
          ...filters,
          snapshot: chosen,
        },
        problem_ids: chosen.map((problem) => problem.id),
      }),
    });
    if (!response.ok) return unavailable();
    const rows = await response.json() as Array<{ id: string; created_at: string }>;
    const session = rows[0];
    if (!session?.id) return unavailable();
    return NextResponse.json({
      session: {
        id: session.id,
        name,
        questionCount: chosen.length,
        timerMinutes: Number(timerMinutes),
        createdAt: session.created_at,
        problems: chosen,
      },
    }, { status: 201 });
  } catch {
    return unavailable();
  }
}
