import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save favorites" }, { status: 401 });
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1000) return NextResponse.json({ error: "Favorite update is too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const input = body as { itemType?: unknown; itemKey?: unknown; favorite?: unknown };
  if (
    !input || typeof input !== "object" ||
    (input.itemType !== "topic" && input.itemType !== "problem") ||
    typeof input.itemKey !== "string" || !/^[A-Za-z0-9_.:-]{1,160}$/.test(input.itemKey) ||
    typeof input.favorite !== "boolean"
  ) return NextResponse.json({ error: "Invalid favorite update" }, { status: 400 });
  if (!isValidLearningProgressKey(`${input.itemType}:${input.itemKey}`)) {
    return NextResponse.json({ error: "Unknown favorite item" }, { status: 404 });
  }

  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("topic_favorites");
    url.search = new URLSearchParams({
      profile_id: `eq.${profileId}`,
      item_type: `eq.${input.itemType}`,
      item_key: `eq.${input.itemKey}`,
    }).toString();
    const insertUrl = supabaseRestUrl("topic_favorites");
    insertUrl.search = "on_conflict=profile_id%2Citem_type%2Citem_key";
    const response = input.favorite
      ? await supabaseRequest(insertUrl, {
          method: "POST",
          headers: { "content-type": "application/json", prefer: "resolution=ignore-duplicates,return=minimal" },
          body: JSON.stringify({ profile_id: profileId, item_type: input.itemType, item_key: input.itemKey }),
        })
      : await supabaseRequest(url, { method: "DELETE", headers: { prefer: "return=minimal" } });
    if (!response.ok) return topicListError();
    return NextResponse.json({ success: true });
  } catch {
    return topicListError();
  }
}
