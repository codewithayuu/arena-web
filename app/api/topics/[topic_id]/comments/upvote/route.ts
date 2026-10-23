import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { upvoteComment } from "@/lib/topic-comments-db";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";

interface RouteParams {
  params: Promise<{
    topic_id: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Sign in to vote" }, { status: 401 });
    const rateLimit = await enforceApiRateLimit(req, {
      scope: "topic-comment-vote",
      identity: userId,
      limit: 30,
      windowSeconds: 60,
    });
    if (rateLimit) return rateLimit;
    const { topic_id } = await params;
    const raw = await req.text();
    if (raw.length > 2000) return NextResponse.json({ error: "Request is too large" }, { status: 413 });
    const body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid vote body" }, { status: 400 });
    }
    const { comment_id, voted } = body;

    if (!topic_id || typeof comment_id !== "string" || comment_id.length > 100 || typeof voted !== "boolean") {
      return NextResponse.json({ error: "Missing topic_id or comment_id" }, { status: 400 });
    }

    const result = await upvoteComment(topic_id, comment_id, userId, voted);
    if (!result.success) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    return NextResponse.json(
      { error: "Votes are temporarily unavailable" },
      { status: 503 }
    );
  }
}
