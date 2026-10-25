import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { getMemberProfileId } from "@/lib/member-profile.server";
import { PRACTICE_PROBLEMS } from "@/lib/practice-problems";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ sessionId: string }> };

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
    const problems = row.problem_ids.map((id) => {
      const item = PRACTICE_PROBLEMS.find((problem) => problem.id === id);
      return item ? { id: item.id, slug: item.slug, title: item.title, difficulty: item.difficulty, category: item.category, topics: item.topics.slice(0, 8), leetcodeUrl: item.leetcodeUrl } : null;
    }).filter((item) => item !== null);
    return NextResponse.json({ session: { id: row.id, name: row.name, questionCount: row.question_count, timerMinutes: row.timer_minutes, filters: row.filters, createdAt: row.created_at, problems } });
  } catch {
    return NextResponse.json({ error: "Practice session is temporarily unavailable" }, { status: 503 });
  }
}
