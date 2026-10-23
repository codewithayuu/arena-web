import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getTopicComments, addTopicComment } from "@/lib/topic-comments-db";
import { enforceApiRateLimit, rateLimitClientIdentity } from "@/lib/api-rate-limit.server";

interface RouteParams {
  params: Promise<{
    topic_id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const rateLimit = await enforceApiRateLimit(req, {
      scope: "topic-comments-read",
      identity: rateLimitClientIdentity(req),
      limit: 60,
      windowSeconds: 60,
    });
    if (rateLimit) return rateLimit;
    const { topic_id } = await params;
    if (!topic_id) {
      return NextResponse.json({ error: "Missing topic_id" }, { status: 400 });
    }
    const { userId } = await auth();
    const rawOffset = Number(req.nextUrl.searchParams.get("offset") ?? 0);
    if (!Number.isInteger(rawOffset) || rawOffset < 0 || rawOffset > 100_000) {
      return NextResponse.json({ error: "Invalid comment cursor" }, { status: 400 });
    }
    const result = await getTopicComments(topic_id, userId ?? undefined, rawOffset);
    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { error: "Comments are temporarily unavailable" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
    const rateLimit = await enforceApiRateLimit(req, {
      scope: "topic-comments-write",
      identity: userId,
      limit: 5,
      windowSeconds: 60,
    });
    if (rateLimit) return rateLimit;

    const { topic_id } = await params;
    if (!topic_id) {
      return NextResponse.json({ error: "Missing topic_id" }, { status: 400 });
    }

    const raw = await req.text();
    if (raw.length > 26000) return NextResponse.json({ error: "Comment is too large" }, { status: 413 });
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid comment body" }, { status: 400 });
    }
    const { content, parent_id, code_snippet } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Comment content cannot be empty" }, { status: 400 });
    }
    if (content.length > 12000 || (code_snippet != null && (typeof code_snippet !== "string" || code_snippet.length > 12000))) {
      return NextResponse.json({ error: "Comment or code snippet is too large" }, { status: 413 });
    }
    if (parent_id != null && (typeof parent_id !== "string" || parent_id.length > 100)) {
      return NextResponse.json({ error: "Invalid parent comment" }, { status: 400 });
    }
    const user = await currentUser();
    if (!user || user.id !== userId) return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
    const authorName = (user.fullName || user.username || "Member").slice(0, 120);

    const created = await addTopicComment(topic_id, {
      userId,
      author_name: authorName,
      author_handle: (user.username || "member").slice(0, 120),
      author_avatar: user.imageUrl,
      content,
      parent_id,
      code_snippet,
    });

    if (!created) return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });

    return NextResponse.json({ success: true, comment: created }, { status: 201 });
  } catch (error: any) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    return NextResponse.json(
      { error: "Comments are temporarily unavailable" },
      { status: 503 }
    );
  }
}
