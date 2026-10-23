import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { topicListError } from "@/lib/topic-list-server.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const ids = (body as { problemIds?: unknown } | null)?.problemIds;
  if (!Array.isArray(ids) || ids.length > 500 || ids.some((id) => typeof id !== "string" || !/^[A-Za-z0-9_.:-]{1,160}$/.test(id))) {
    return NextResponse.json({ error: "Invalid problem IDs" }, { status: 400 });
  }
  if (ids.length === 0) return NextResponse.json({ stats: {} });
  try {
    const url = supabaseRestUrl("problem_community_stats");
    url.search = new URLSearchParams({
      select: "problem_id,solve_count,favorite_count",
      problem_id: `in.(${ids.join(",")})`,
      limit: "500",
    }).toString();
    const response = await supabaseRequest(url, { method: "GET" });
    if (!response.ok) return topicListError();
    const rows = await response.json() as Array<{ problem_id: string; solve_count: number; favorite_count: number }>;
    return NextResponse.json({ stats: Object.fromEntries(rows.map((row) => [row.problem_id, {
      solveCount: Number(row.solve_count) || 0,
      favoriteCount: Number(row.favorite_count) || 0,
    }])) });
  } catch {
    return topicListError();
  }
}
