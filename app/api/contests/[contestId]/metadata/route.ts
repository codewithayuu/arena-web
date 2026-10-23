import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { CONTEST_ID, fetchParticipantContestMetadata } from "@/lib/contest-entry-server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> },
) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ code: "ORIGIN_DENIED" }, { status: 403, headers: NO_STORE });
  }
  const { contestId } = await params;
  if (!CONTEST_ID.test(contestId)) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: NO_STORE });
  }

  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: NO_STORE });
  }
  const token = await session.getToken();
  if (!token) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: NO_STORE });
  }

  const result = await fetchParticipantContestMetadata(contestId, token);
  if (!result.metadata) {
    const status = [401, 403, 404, 429].includes(result.status) ? result.status : 503;
    const code = status === 401 ? "UNAUTHORIZED"
      : status === 403 ? "CONTEST_METADATA_DENIED"
        : status === 404 ? "CONTEST_METADATA_NOT_FOUND"
          : status === 429 ? "RATE_LIMITED" : "CONTEST_METADATA_UNAVAILABLE";
    return NextResponse.json({ code }, { status, headers: NO_STORE });
  }

  return NextResponse.json(result.metadata, {
    status: 200,
    headers: {
      ...NO_STORE,
      "X-Mindflare-Server-Time": result.metadata.server_time,
    },
  });
}
