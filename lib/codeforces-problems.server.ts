import "server-only";

import { unstable_cache } from "next/cache";

const CODEFORCES_API_URL = "https://codeforces.com/api/problemset.problems?lang=en";
const CACHE_SECONDS = 60 * 60;

export type CodeforcesProblem = {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating: number | null;
  tags: string[];
  solvedCount: number;
  url: string;
};

export type CodeforcesProblemFilters = {
  search: string;
  minRating: number | null;
  maxRating: number | null;
  tags: string[];
  sort: "rating-asc" | "rating-desc" | "popular" | "newest";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validContestId(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}

function validIndex(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9]+$/.test(value);
}

async function loadCodeforcesProblemset(): Promise<CodeforcesProblem[]> {
  const response = await fetch(CODEFORCES_API_URL, {
    headers: {
      accept: "application/json",
      "user-agent": "Mindflare Arena practice catalog (https://www.mindflare.tech)",
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("Codeforces problem catalog request failed");

  const payload: unknown = await response.json();
  if (!isRecord(payload) || payload.status !== "OK" || !isRecord(payload.result)) {
    throw new Error("Codeforces problem catalog response was invalid");
  }

  const rawProblems = payload.result.problems;
  const rawStatistics = payload.result.problemStatistics;
  if (!Array.isArray(rawProblems) || !Array.isArray(rawStatistics)) {
    throw new Error("Codeforces problem catalog response was incomplete");
  }

  const solvedCounts = new Map<string, number>();
  for (const item of rawStatistics) {
    if (!isRecord(item) || !validContestId(item.contestId) || !validIndex(item.index)) continue;
    const count = item.solvedCount;
    if (Number.isSafeInteger(count) && Number(count) >= 0) {
      solvedCounts.set(`${item.contestId}:${item.index}`, Number(count));
    }
  }

  const problems: CodeforcesProblem[] = [];
  for (const item of rawProblems) {
    if (!isRecord(item) || item.type !== "PROGRAMMING") continue;
    if (!validContestId(item.contestId) || !validIndex(item.index)) continue;
    if (typeof item.name !== "string" || item.name.trim().length === 0 || item.name.length > 300) continue;

    const id = `${item.contestId}:${item.index}`;
    const rating = Number.isSafeInteger(item.rating) && Number(item.rating) > 0
      ? Number(item.rating)
      : null;
    const tags = Array.isArray(item.tags)
      ? item.tags.filter((tag): tag is string => typeof tag === "string" && tag.length <= 80).slice(0, 30)
      : [];

    problems.push({
      id,
      contestId: item.contestId,
      index: item.index,
      name: item.name.trim(),
      rating,
      tags,
      solvedCount: solvedCounts.get(id) ?? 0,
      url: `https://codeforces.com/problemset/problem/${item.contestId}/${encodeURIComponent(item.index)}`,
    });
  }

  if (problems.length === 0) throw new Error("Codeforces problem catalog contained no usable problems");
  return problems;
}

const getCachedCodeforcesProblemset = unstable_cache(
  loadCodeforcesProblemset,
  ["codeforces-problemset-v1"],
  { revalidate: CACHE_SECONDS, tags: ["codeforces-problemset"] },
);

export function normalizeCodeforcesFilters(value: {
  search?: unknown;
  minRating?: unknown;
  maxRating?: unknown;
  tags?: unknown;
  sort?: unknown;
}): CodeforcesProblemFilters | null {
  if (value.search !== undefined && typeof value.search !== "string") return null;
  const search = typeof value.search === "string" ? value.search.trim() : "";
  if (search.length > 100) return null;

  const parseRating = (rating: unknown): number | null | undefined => {
    if (rating === null || rating === undefined || rating === "") return null;
    const parsed = typeof rating === "number" ? rating : Number(rating);
    if (!Number.isInteger(parsed) || parsed < 800 || parsed > 4000) return undefined;
    return parsed;
  };
  const minRating = parseRating(value.minRating);
  const maxRating = parseRating(value.maxRating);
  if (minRating === undefined || maxRating === undefined) return null;
  if (minRating !== null && maxRating !== null && minRating > maxRating) return null;

  const rawTags = value.tags === undefined || value.tags === null ? [] : value.tags;
  if (!Array.isArray(rawTags)) return null;
  if (rawTags.length > 20 || !rawTags.every((tag) => typeof tag === "string")) return null;
  const tags = [...new Set(rawTags.map((tag) => tag.trim().toLowerCase()))];
  if (tags.some((tag) => tag.length === 0 || tag.length > 80 || !/^[a-z0-9 -]+$/.test(tag))) return null;

  const allowedSorts = ["rating-asc", "rating-desc", "popular", "newest"] as const;
  const sort = value.sort === undefined ? "rating-asc" : value.sort;
  if (!allowedSorts.includes(sort as typeof allowedSorts[number])) return null;

  return { search, minRating, maxRating, tags, sort: sort as CodeforcesProblemFilters["sort"] };
}

export async function getCodeforcesProblems(): Promise<CodeforcesProblem[]> {
  return getCachedCodeforcesProblemset();
}

export function filterCodeforcesProblems(
  problems: CodeforcesProblem[],
  filters: CodeforcesProblemFilters,
): CodeforcesProblem[] {
  const query = filters.search.toLocaleLowerCase();
  const requiredTags = new Set(filters.tags);
  const filtered = problems.filter((problem) => {
    const searchTarget = `${problem.name} ${problem.tags.join(" ")}`.toLocaleLowerCase();
    if (query && !searchTarget.includes(query)) return false;
    if (filters.minRating !== null || filters.maxRating !== null) {
      if (problem.rating === null) return false;
      if (filters.minRating !== null && problem.rating < filters.minRating) return false;
      if (filters.maxRating !== null && problem.rating > filters.maxRating) return false;
    }
    if ([...requiredTags].some((tag) => !problem.tags.some((item) => item.toLowerCase() === tag))) return false;
    return true;
  });

  filtered.sort((left, right) => {
    if (filters.sort === "popular") return right.solvedCount - left.solvedCount || (left.rating ?? Infinity) - (right.rating ?? Infinity);
    if (filters.sort === "newest") return right.contestId - left.contestId || left.index.localeCompare(right.index, undefined, { numeric: true });
    if (filters.sort === "rating-desc") return (right.rating ?? -1) - (left.rating ?? -1) || right.contestId - left.contestId;
    return (left.rating ?? Infinity) - (right.rating ?? Infinity) || left.contestId - right.contestId;
  });
  return filtered;
}

export function getCodeforcesTagOptions(problems: CodeforcesProblem[]): string[] {
  const frequencies = new Map<string, number>();
  for (const problem of problems) {
    for (const tag of problem.tags) frequencies.set(tag, (frequencies.get(tag) ?? 0) + 1);
  }
  return [...frequencies.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 80)
    .map(([tag]) => tag);
}
