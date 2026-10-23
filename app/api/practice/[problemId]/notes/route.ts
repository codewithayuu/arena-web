import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getProblemNote, saveProblemNote } from "@/lib/topic-comments-db";

interface RouteParams {
  params: Promise<{ problemId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to access your notes" }, { status: 401 });
  const { problemId } = await params;
  if (!problemId || problemId.length > 160) return NextResponse.json({ error: "Invalid problem" }, { status: 400 });

  try {
    return NextResponse.json({ content: await getProblemNote(userId, problemId) });
  } catch {
    return NextResponse.json({ error: "Notes are temporarily unavailable" }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save your notes" }, { status: 401 });
  const { problemId } = await params;
  if (!problemId || problemId.length > 160) return NextResponse.json({ error: "Invalid problem" }, { status: 400 });

  try {
    const raw = await request.text();
    if (raw.length > 31_000) return NextResponse.json({ error: "Notes are too large" }, { status: 413 });
    const body = JSON.parse(raw) as { content?: unknown };
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid notes body" }, { status: 400 });
    if (typeof body.content !== "string") return NextResponse.json({ error: "Notes must be text" }, { status: 400 });
    if (body.content.length > 30_000) return NextResponse.json({ error: "Notes are too large" }, { status: 413 });
    await saveProblemNote(userId, problemId, body.content);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    return NextResponse.json({ error: "Notes are temporarily unavailable" }, { status: 503 });
  }
}
