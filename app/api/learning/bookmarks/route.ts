import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseReadAll, supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to load lesson bookmarks" }, { status: 401 });
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("learning_bookmarks");
    url.search = new URLSearchParams({ select: "lesson_key", profile_id: `eq.${profileId}` }).toString();
    const rows = await supabaseReadAll<{ lesson_key: string }>(url);
    return NextResponse.json({ lessonKeys: rows.map((row) => row.lesson_key) }, { headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save lesson bookmarks" }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, { scope: "learning-bookmark-write", identity: userId, limit: 60, windowSeconds: 60 });
  if (rateLimit) return rateLimit;
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 1000) return NextResponse.json({ error: "Bookmark update is too large" }, { status: 413 });
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return NextResponse.json({ error: "Invalid bookmark" }, { status: 400 });
  const body = input as { lessonKey?: unknown; bookmarked?: unknown };
  if (typeof body.lessonKey !== "string" || !isValidLearningProgressKey(body.lessonKey) || !body.lessonKey.startsWith("lesson:dsa:") || typeof body.bookmarked !== "boolean") {
    return NextResponse.json({ error: "Invalid bookmark" }, { status: 400 });
  }
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const key = supabaseRestUrl("learning_bookmarks");
    key.search = new URLSearchParams({ profile_id: `eq.${profileId}`, lesson_key: `eq.${body.lessonKey}` }).toString();
    const response = body.bookmarked
      ? await supabaseRequest(new URL(`${supabaseRestUrl("learning_bookmarks")}?on_conflict=profile_id%2Clesson_key`), {
          method: "POST",
          headers: { "content-type": "application/json", prefer: "resolution=ignore-duplicates,return=minimal" },
          body: JSON.stringify({ profile_id: profileId, lesson_key: body.lessonKey }),
        })
      : await supabaseRequest(key, { method: "DELETE", headers: { prefer: "return=minimal" } });
    if (!response.ok) throw new Error("Bookmark update failed");
    return NextResponse.json({ success: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}
