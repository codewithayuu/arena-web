import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseReadAll, supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to load account topic-list data" }, { status: 401 });
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const since = "2024-01-01";
    const queryUrl = (table: string, query: Record<string, string>) => {
      const url = supabaseRestUrl(table);
      url.search = new URLSearchParams(query).toString();
      return url;
    };
    const [favorites, progress, activity, claps, totals, checkins] = await Promise.all([
      supabaseReadAll<{ item_type: string; item_key: string }>(queryUrl("topic_favorites", { select: "item_type,item_key", profile_id: `eq.${profileId}`, order: "item_type.asc,item_key.asc" })),
      supabaseReadAll<{ item_key: string; status: string; updated_at: string }>(queryUrl("learning_progress", { select: "item_key,status,updated_at", profile_id: `eq.${profileId}`, order: "item_key.asc" })),
      supabaseReadAll<{ activity_date: string; event_type: string; item_key: string }>(queryUrl("topic_list_activity", { select: "activity_date,event_type,item_key", profile_id: `eq.${profileId}`, activity_date: `gte.${since}`, order: "activity_date.asc,event_type.asc,item_key.asc" })),
      supabaseRequest(queryUrl("topic_list_claps", { select: "clap_count", profile_id: `eq.${profileId}`, topic_key: "eq.topic-list", limit: "1" }), { method: "GET" }),
      supabaseRequest(queryUrl("topic_list_clap_totals", { select: "total_claps", topic_key: "eq.topic-list", limit: "1" }), { method: "GET" }),
      supabaseReadAll<{ checkin_date: string; points_awarded: number }>(queryUrl("topic_list_checkins", { select: "checkin_date,points_awarded", profile_id: `eq.${profileId}`, checkin_date: `gte.${since}`, order: "checkin_date.asc" })),
    ]);
    if (!claps.ok || !totals.ok) throw new Error("Clap stats unavailable");
    const clapRows = await claps.json() as Array<{ clap_count: number }>;
    const totalRows = await totals.json() as Array<{ total_claps: number }>;
    return NextResponse.json({
      favorites,
      progress,
      activity,
      checkins,
      userClaps: Number(clapRows[0]?.clap_count ?? 0),
      totalClaps: Number(totalRows[0]?.total_claps ?? 0),
    });
  } catch {
    return topicListError();
  }
}
