import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";
import type { LearningNote } from "@/lib/learning-notes-client";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseReadAll, supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function invalid(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "cache-control": "no-store" } });
}

async function parseBody(request: NextRequest): Promise<unknown | NextResponse> {
  try {
    const raw = await request.text();
    if (raw.length > 25_000) return invalid("Note is too large", 413);
    return JSON.parse(raw) as unknown;
  } catch {
    return invalid("Invalid JSON body");
  }
}

function parseNote(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const input = body as Record<string, unknown>;
  if (
    typeof input.lessonKey !== "string" || !isValidLearningProgressKey(input.lessonKey) || !input.lessonKey.startsWith("lesson:dsa:") ||
    typeof input.title !== "string" || input.title.trim().length < 1 || input.title.trim().length > 120 ||
    typeof input.notebookName !== "string" || input.notebookName.trim().length < 1 || input.notebookName.trim().length > 80 ||
    typeof input.content !== "string" || input.content.length > 20_000
  ) return null;
  return {
    lesson_key: input.lessonKey,
    title: input.title.trim(),
    notebook_name: input.notebookName.trim(),
    content: input.content,
  };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return invalid("Sign in to access your notebook", 401);
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return invalid("Profile is still being provisioned", 404);
    const url = supabaseRestUrl("learning_notes");
    url.search = new URLSearchParams({
      select: "id,notebook_name,lesson_key,title,content,created_at,updated_at",
      profile_id: `eq.${profileId}`,
      order: "updated_at.desc,id.asc",
      limit: "500",
    }).toString();
    const notes = await supabaseReadAll<LearningNote>(url, 500);
    return NextResponse.json({ notes }, { headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return invalid("Sign in to save notes", 401);
  const rateLimit = await enforceApiRateLimit(request, { scope: "learning-note-write", identity: userId, limit: 60, windowSeconds: 60 });
  if (rateLimit) return rateLimit;
  const body = await parseBody(request);
  if (body instanceof NextResponse) return body;
  const note = parseNote(body);
  if (!note) return invalid("Invalid note");
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return invalid("Profile is still being provisioned", 404);
    const url = supabaseRestUrl("learning_notes");
    const response = await supabaseRequest(url, {
      method: "POST",
      headers: { "content-type": "application/json", prefer: "return=representation" },
      body: JSON.stringify({ ...note, profile_id: profileId }),
    });
    if (!response.ok) throw new Error("Note insert failed");
    const [created] = await response.json() as LearningNote[];
    if (!created) throw new Error("Note insert returned no row");
    return NextResponse.json({ note: created }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch {
    return topicListError();
  }
}
