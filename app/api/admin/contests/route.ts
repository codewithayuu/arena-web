import { NextResponse } from "next/server";
import { getAllContests } from "@/lib/contest-registry";
import { adminGatewayRequest } from "@/lib/contest-admin.server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_LOCAL_CONTEST_MODE !== "true") {
    return adminGatewayRequest("/v1/admin/contests?limit=50&offset=0");
  }
  try {
    const contests = await getAllContests();
    return NextResponse.json({
      success: true,
      contests: contests.map((c) => ({
        contest_id: c.contest_id,
        name: c.name,
        description: c.description,
        problem_count: c.problems.length,
        starts_at: c.starts_at,
        ends_at: c.ends_at,
        languages: c.languages,
        mock_mode: c.mock_mode,
        proctoring: c.proctoring,
        created_at: c.created_at,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load contests" },
      { status: 500 }
    );
  }
}
