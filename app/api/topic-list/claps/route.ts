import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const url = supabaseRestUrl("topic_list_clap_totals");
    url.search = new URLSearchParams({ select: "total_claps", topic_key: "eq.topic-list", limit: "1" }).toString();
    const response = await supabaseRequest(url, { method: "GET" });
    if (!response.ok) return topicListError();
    const rows = await response.json() as Array<{ total_claps: number }>;
    return NextResponse.json({ totalClaps: Number(rows[0]?.total_claps ?? 0) });
  } catch {
    return topicListError();
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to clap" }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "topic-list-clap",
    identity: userId,
    limit: 30,
    windowSeconds: 60,
  });
  if (rateLimit) return rateLimit;
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const response = await supabaseRequest(supabaseRestUrl("rpc/increment_topic_list_clap"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ p_profile_id: profileId, p_topic_key: "topic-list" }),
    });
    if (!response.ok) return topicListError();
    const rows = (await response.json()) as Array<{ user_clap_count: number; total_claps: number }>;
    return NextResponse.json({
      userClapCount: Number(rows[0]?.user_clap_count ?? 0),
      totalClaps: Number(rows[0]?.total_claps ?? 0),
    });
  } catch {
    return topicListError();
  }
}
