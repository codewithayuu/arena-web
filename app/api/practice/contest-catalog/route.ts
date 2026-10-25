import { NextResponse } from "next/server";
import { PRACTICE_PROBLEMS } from "@/lib/practice-problems";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const problems = PRACTICE_PROBLEMS.map((problem) => ({
    id: problem.id,
    slug: problem.slug,
    title: problem.title,
    difficulty: problem.difficulty,
    category: problem.category,
    topics: problem.topics.slice(0, 8),
    leetcodeUrl: problem.leetcodeUrl,
  }));
  return NextResponse.json({ problems }, { headers: { "cache-control": "public, max-age=300, stale-while-revalidate=600" } });
}
