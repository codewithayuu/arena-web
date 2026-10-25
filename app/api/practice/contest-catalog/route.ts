import { NextRequest, NextResponse } from "next/server";
import {
  filterCodeforcesProblems,
  getCodeforcesProblems,
  getCodeforcesTagOptions,
  normalizeCodeforcesFilters,
} from "@/lib/codeforces-problems.server";

export const runtime = "nodejs";

const PAGE_SIZE = 30;

function seededPreview(items: ReturnType<typeof filterCodeforcesProblems>, seed: number) {
  const pool = [...items];
  let state = (seed % 2_147_483_646) + 1;
  const random = () => {
    state = (state * 48_271) % 2_147_483_647;
    return state / 2_147_483_647;
  };
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapAt = Math.floor(random() * (index + 1));
    [pool[index], pool[swapAt]] = [pool[swapAt], pool[index]];
  }
  return pool.slice(0, 8);
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? "1");
  const seed = Number(params.get("seed") ?? "1");
  if (!Number.isSafeInteger(page) || page < 1 || page > 10_000 || !Number.isSafeInteger(seed) || seed < 0 || seed > 2_147_483_647) {
    return NextResponse.json({ error: "Invalid catalog request" }, { status: 400 });
  }

  const filters = normalizeCodeforcesFilters({
    search: params.get("search") ?? "",
    minRating: params.get("minRating"),
    maxRating: params.get("maxRating"),
    tags: params.getAll("tag"),
    sort: params.get("sort") ?? "rating-asc",
  });
  if (!filters) return NextResponse.json({ error: "Invalid problem filters" }, { status: 400 });

  try {
    const problems = await getCodeforcesProblems();
    const matches = filterCodeforcesProblems(problems, filters);
    const start = (page - 1) * PAGE_SIZE;
    return NextResponse.json({
      source: "Codeforces",
      problems: matches.slice(start, start + PAGE_SIZE),
      preview: seededPreview(matches, seed),
      total: matches.length,
      page,
      pageSize: PAGE_SIZE,
      availableTags: getCodeforcesTagOptions(problems),
    }, { headers: { "cache-control": "public, max-age=0, s-maxage=60, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Codeforces problem catalog is temporarily unavailable" }, { status: 503 });
  }
}
