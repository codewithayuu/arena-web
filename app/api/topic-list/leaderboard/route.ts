import { NextRequest, NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/topic-list-data";
import { AURA_CONSTANTS } from "@/lib/aura-core";
import { getValidLearningProgressKeys } from "@/lib/learning-progress-catalog.server";
import { supabaseRequest, supabaseRpcUrl } from "@/lib/supabase-rest.server";
import { enforceApiRateLimit, rateLimitClientIdentity } from "@/lib/api-rate-limit.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  handle: string | null;
  display_name: string | null;
  active_days: number | string;
  completions: number | string;
  aura: number | string;
  score: number | string;
};

export async function GET(request: NextRequest) {
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "topic-list-leaderboard",
    identity: rateLimitClientIdentity(request),
    limit: 60,
    windowSeconds: 60,
  });
  if (rateLimit) return rateLimit;
  try {
    const sortParam = request.nextUrl.searchParams.get("sort");
    const sort = sortParam === "active_days" || sortParam === "completions" || sortParam === "aura" ? sortParam : "score";
    const categoryTopicIds = CATEGORIES.map((category) => category.sub_categories.flatMap((sub) => sub.topics.map((topic) => topic.topic_id)));
    const response = await supabaseRequest(supabaseRpcUrl("get_topic_list_leaderboard"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        p_sort: sort,
        p_category_topic_ids: categoryTopicIds,
        p_aura_constants: AURA_CONSTANTS,
        p_valid_item_keys: getValidLearningProgressKeys(),
      }),
    });
    if (!response.ok) throw new Error("Leaderboard query failed");
    const rows = await response.json() as LeaderboardEntry[];
    const entries = rows.map((row) => ({
      ...row,
      active_days: Number(row.active_days) || 0,
      completions: Number(row.completions) || 0,
      aura: Number(row.aura) || 0,
      score: Number(row.score) || 0,
    }));
    return NextResponse.json({ sort, entries }, {
      headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ error: "Leaderboard is temporarily unavailable" }, { status: 503 });
  }
}
