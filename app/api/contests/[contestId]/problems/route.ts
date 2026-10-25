import { NextRequest, NextResponse } from "next/server";
import { getContestById } from "@/lib/contest-registry";
import { CONTEST_ID } from "@/lib/contest-entry-server";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ contestId: string }> }
) {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE !== "true") {
    return NextResponse.json({ code: "ADMITTED_PROBLEM_ACCESS_REQUIRED" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  const { contestId } = await params;
  if (!CONTEST_ID.test(contestId)) {
    return NextResponse.json({ error: "Invalid contest ID" }, { status: 400 });
  }

  const contest = await getContestById(contestId);
  if (!contest) {
    return NextResponse.json({ error: "Contest not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    contest_id: contest.contest_id,
    name: contest.name,
    problems: contest.problems.map((p) => ({
      problem_id: p.problem_id,
      ordinal: p.ordinal,
      title: p.title,
      statement_markdown: p.statement_markdown,
      public_samples: p.public_samples,
      time_limit_ms: p.time_limit_ms,
      memory_limit_mb: p.memory_limit_mb,
    })),
  });
}
