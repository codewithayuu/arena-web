import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { getMemberProfileId } from "@/lib/member-profile.server";
import { generatePersonalizedRoadmap, parsePersonalizedRoadmapAnswers } from "@/lib/personalized-roadmap";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unavailable() {
  return NextResponse.json({ error: "Roadmaps are temporarily unavailable" }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view saved roadmaps" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "member-roadmaps-read", identity: userId, limit: 60, windowSeconds: 60 });
  if (limited) return limited;
  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("member_personalized_roadmaps");
    url.search = new URLSearchParams({
      select: "id,title,primary_path,total_weeks,total_hours,completed_phases,created_at,updated_at",
      profile_id: `eq.${profileId}`,
      order: "updated_at.desc",
      limit: "20",
    }).toString();
    const response = await supabaseRequest(url, { method: "GET" });
    if (!response.ok) return unavailable();
    return NextResponse.json({ roadmaps: await response.json() });
  } catch {
    return unavailable();
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save a roadmap" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "member-roadmaps-create", identity: userId, limit: 8, windowSeconds: 60 });
  if (limited) return limited;
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_000) return NextResponse.json({ error: "Roadmap answers are too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid roadmap answers" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid roadmap answers" }, { status: 400 });
  const answers = parsePersonalizedRoadmapAnswers((body as Record<string, unknown>).answers);
  if (!answers) return NextResponse.json({ error: "Complete each roadmap question before saving" }, { status: 400 });
  const plan = generatePersonalizedRoadmap(answers);
  const suppliedTitle = (body as Record<string, unknown>).title;
  const title = typeof suppliedTitle === "string" ? suppliedTitle.trim().replace(/\s+/g, " ") : plan.title;
  if (title.length < 1 || title.length > 100) return NextResponse.json({ error: "Roadmap name must be 1 to 100 characters" }, { status: 400 });

  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("member_personalized_roadmaps");
    const response = await supabaseRequest(url, {
      method: "POST",
      headers: { "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify({
        profile_id: profileId,
        title,
        primary_path: plan.primaryPath,
        total_weeks: plan.totalWeeks,
        total_hours: plan.totalHours,
        quiz_answers: answers,
        generated_plan: plan,
      }),
    });
    if (!response.ok) return unavailable();
    const rows = await response.json() as Array<{ id: string; created_at: string; updated_at: string }>;
    const roadmap = rows[0];
    if (!roadmap?.id) return unavailable();
    return NextResponse.json({ roadmap: { id: roadmap.id, title, plan, completedPhases: [], createdAt: roadmap.created_at, updatedAt: roadmap.updated_at } }, { status: 201 });
  } catch {
    return unavailable();
  }
}
