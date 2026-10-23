import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to sync activity" }, { status: 401 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2000) return NextResponse.json({ error: "Activity update is too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const input = body as { eventType?: unknown; itemKey?: unknown; active?: unknown };
  const allowed = ["visit", "topic_completed", "problem_solved"];
  if (
    !input || typeof input !== "object" || !allowed.includes(String(input.eventType)) ||
    typeof input.itemKey !== "string" || input.itemKey.length > 160 ||
    typeof input.active !== "boolean"
  ) return NextResponse.json({ error: "Invalid activity update" }, { status: 400 });
  if (input.eventType === "visit" && input.itemKey !== "topic-list") {
    return NextResponse.json({ error: "Invalid visit activity" }, { status: 400 });
  }
  if (input.eventType !== "visit" && !/^[A-Za-z0-9_.:-]{1,160}$/.test(input.itemKey)) {
    return NextResponse.json({ error: "Invalid activity item" }, { status: 400 });
  }
  if (input.eventType === "topic_completed" && !isValidLearningProgressKey(`topic:${input.itemKey}`)) {
    return NextResponse.json({ error: "Unknown topic activity item" }, { status: 404 });
  }
  if (input.eventType === "problem_solved" && !isValidLearningProgressKey(`problem:${input.itemKey}`)) {
    return NextResponse.json({ error: "Unknown problem activity item" }, { status: 404 });
  }

  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("topic_list_activity");
    const insertUrl = supabaseRestUrl("topic_list_activity");
    insertUrl.search = "on_conflict=profile_id%2Cactivity_date%2Cevent_type%2Citem_key";
    const today = new Date().toISOString().slice(0, 10);
    url.search = new URLSearchParams({
      profile_id: `eq.${profileId}`,
      activity_date: `eq.${today}`,
      event_type: `eq.${input.eventType}`,
      item_key: `eq.${input.itemKey}`,
    }).toString();
    const response = input.active
      ? await supabaseRequest(insertUrl, {
          method: "POST",
          headers: { "content-type": "application/json", prefer: "resolution=ignore-duplicates,return=minimal" },
          body: JSON.stringify({
            profile_id: profileId,
            activity_date: today,
            event_type: input.eventType,
            item_key: input.itemKey,
          }),
        })
      : await supabaseRequest(url, { method: "DELETE", headers: { prefer: "return=minimal" } });
    if (!response.ok) return topicListError();
    return NextResponse.json({ success: true });
  } catch {
    return topicListError();
  }
}
