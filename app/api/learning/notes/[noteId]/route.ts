import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ noteId: string }> };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function invalid(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "cache-control": "no-store" } });
}

async function getOwner(userId: string) {
  return resolveTopicListProfile(userId);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return invalid("Sign in to update notes", 401);
  const rateLimit = await enforceApiRateLimit(request, { scope: "learning-note-write", identity: userId, limit: 60, windowSeconds: 60 });
  if (rateLimit) return rateLimit;
  const { noteId } = await context.params;
  if (!UUID.test(noteId)) return invalid("Invalid note identifier");
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 25_000) return invalid("Note is too large", 413);
    input = JSON.parse(raw);
  } catch {
    return invalid("Invalid JSON body");
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) return invalid("Invalid note");
  const body = input as Record<string, unknown>;
  const updates: Record<string, string> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length < 1 || body.title.trim().length > 120) return invalid("Invalid note title");
    updates.title = body.title.trim();
  }
  if (body.notebookName !== undefined) {
    if (typeof body.notebookName !== "string" || body.notebookName.trim().length < 1 || body.notebookName.trim().length > 80) return invalid("Invalid notebook name");
    updates.notebook_name = body.notebookName.trim();
  }
  if (body.content !== undefined) {
    if (typeof body.content !== "string" || body.content.length > 20_000) return invalid("Invalid note content");
    updates.content = body.content;
  }
  if (body.lessonKey !== undefined) {
    if (typeof body.lessonKey !== "string" || !isValidLearningProgressKey(body.lessonKey) || !body.lessonKey.startsWith("lesson:dsa:")) return invalid("Invalid lesson");
    updates.lesson_key = body.lessonKey;
  }
  if (Object.keys(updates).length === 1) return invalid("No note changes provided");

  try {
    const profileId = await getOwner(userId);
    if (!profileId) return invalid("Profile is still being provisioned", 404);
    const url = supabaseRestUrl("learning_notes");
    url.search = new URLSearchParams({
      id: `eq.${noteId}`,
      profile_id: `eq.${profileId}`,
      select: "id,notebook_name,lesson_key,title,content,created_at,updated_at",
    }).toString();
    const response = await supabaseRequest(url, {
      method: "PATCH",
      headers: { "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Note update failed");
    const [note] = await response.json() as Array<Record<string, unknown>>;
    if (!note) return invalid("Note not found", 404);
    return NextResponse.json({ note }, { headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { userId } = await auth();
  if (!userId) return invalid("Sign in to delete notes", 401);
  const rateLimit = await enforceApiRateLimit(request, { scope: "learning-note-write", identity: userId, limit: 60, windowSeconds: 60 });
  if (rateLimit) return rateLimit;
  const { noteId } = await context.params;
  if (!UUID.test(noteId)) return invalid("Invalid note identifier");
  try {
    const profileId = await getOwner(userId);
    if (!profileId) return invalid("Profile is still being provisioned", 404);
    const url = supabaseRestUrl("learning_notes");
    url.search = new URLSearchParams({ id: `eq.${noteId}`, profile_id: `eq.${profileId}` }).toString();
    const response = await supabaseRequest(url, { method: "DELETE", headers: { prefer: "return=representation" } });
    if (!response.ok) throw new Error("Note deletion failed");
    const deleted = await response.json() as unknown[];
    if (deleted.length === 0) return invalid("Note not found", 404);
    return NextResponse.json({ success: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}
