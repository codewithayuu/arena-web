import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const topicIdPattern = /^[A-Za-z0-9_.:-]{1,160}$/;

async function readStats(topicIds: string[]) {
  const url = supabaseRestUrl("topic_list_community_stats");
  url.search = new URLSearchParams({
    select: "topic_id,practicing_count,completed_count,favourite_count",
    topic_id: `in.(${topicIds.join(",")})`,
    limit: String(topicIds.length),
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Community stats unavailable");
  const rows = await response.json() as Array<{
    topic_id: string;
    practicing_count: number;
    completed_count: number;
    favourite_count: number;
  }>;
  const stats = Object.fromEntries(topicIds.map((id) => [id, {
    practicing_count: 0,
    completed_count: 0,
    favourite_count: 0,
  }]));
  for (const row of rows) {
    stats[row.topic_id] = {
      practicing_count: Number(row.practicing_count) || 0,
      completed_count: Number(row.completed_count) || 0,
      favourite_count: Number(row.favourite_count) || 0,
    };
  }
  return stats;
}

export async function GET(request: NextRequest) {
  const topicId = request.nextUrl.searchParams.get("topicId");
  if (!topicId || !topicIdPattern.test(topicId)) {
    return NextResponse.json({ error: "A valid topic id is required" }, { status: 400 });
  }
  try {
    const stats = await readStats([topicId]);
    return NextResponse.json(stats[topicId]);
  } catch {
    return NextResponse.json({ error: "Community stats are temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const input = body as { topicIds?: unknown } | null;
  if (!input || !Array.isArray(input.topicIds) || input.topicIds.length < 1 || input.topicIds.length > 500 ||
    input.topicIds.some((id) => typeof id !== "string" || !topicIdPattern.test(id))) {
    return NextResponse.json({ error: "Provide between 1 and 500 valid topic IDs" }, { status: 400 });
  }
  try {
    const ids = [...new Set(input.topicIds as string[])];
    return NextResponse.json({ stats: await readStats(ids) });
  } catch {
    return NextResponse.json({ error: "Community stats are temporarily unavailable" }, { status: 503 });
  }
}
