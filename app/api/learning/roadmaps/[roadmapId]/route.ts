import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { getMemberProfileId } from "@/lib/member-profile.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ roadmapId: string }> };
type RoadmapRow = {
  id: string;
  title: string;
  primary_path: string;
  total_weeks: number;
  total_hours: number;
  generated_plan: unknown;
  completed_phases: number[];
  created_at: string;
  updated_at: string;
};

async function getRoadmap(profileId: string, roadmapId: string): Promise<RoadmapRow | null> {
  const url = supabaseRestUrl("member_personalized_roadmaps");
  url.search = new URLSearchParams({
    select: "id,title,primary_path,total_weeks,total_hours,generated_plan,completed_phases,created_at,updated_at",
    id: `eq.${roadmapId}`,
    profile_id: `eq.${profileId}`,
    limit: "1",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Roadmap lookup failed");
  const rows = await response.json() as RoadmapRow[];
  return rows[0] ?? null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to view this roadmap" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "member-roadmap-read", identity: userId, limit: 60, windowSeconds: 60 });
  if (limited) return limited;
  const { roadmapId } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roadmapId)) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const roadmap = await getRoadmap(profileId, roadmapId);
    return roadmap ? NextResponse.json({ roadmap }) : NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Roadmap is temporarily unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to update this roadmap" }, { status: 401 });
  const limited = await enforceApiRateLimit(request, { scope: "member-roadmap-update", identity: userId, limit: 30, windowSeconds: 60 });
  if (limited) return limited;
  const { roadmapId } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roadmapId)) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2_000) return NextResponse.json({ error: "Progress update is too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid progress update" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid progress update" }, { status: 400 });
  const completed = (body as Record<string, unknown>).completedPhases;
  if (!Array.isArray(completed) || completed.length > 12 || !completed.every((phase) => Number.isInteger(phase) && Number(phase) >= 1 && Number(phase) <= 12)) {
    return NextResponse.json({ error: "Invalid phase progress" }, { status: 400 });
  }
  try {
    const profileId = await getMemberProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const roadmap = await getRoadmap(profileId, roadmapId);
    if (!roadmap) return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    const phaseNumbers = new Set((roadmap.generated_plan as { phases?: Array<{ number?: unknown }> } | null)?.phases?.map((phase) => phase.number).filter((number): number is number => Number.isInteger(number)) ?? []);
    const normalized = [...new Set(completed as number[])].sort((a, b) => a - b);
    if (normalized.some((phase) => !phaseNumbers.has(phase))) return NextResponse.json({ error: "Invalid phase progress" }, { status: 400 });
    const url = supabaseRestUrl("member_personalized_roadmaps");
    url.search = new URLSearchParams({ id: `eq.${roadmapId}`, profile_id: `eq.${profileId}` }).toString();
    const response = await supabaseRequest(url, {
      method: "PATCH",
      headers: { "content-type": "application/json", prefer: "return=minimal" },
      body: JSON.stringify({ completed_phases: normalized, updated_at: new Date().toISOString() }),
    });
    if (!response.ok) return NextResponse.json({ error: "Roadmap progress could not be saved" }, { status: 503 });
    return NextResponse.json({ success: true, completedPhases: normalized });
  } catch {
    return NextResponse.json({ error: "Roadmap progress could not be saved" }, { status: 503 });
  }
}
