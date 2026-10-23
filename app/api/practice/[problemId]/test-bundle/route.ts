import {
  PRACTICE_TEST_CHECKERS,
  PRACTICE_TEST_PACKS,
  type PracticeTestCase,
} from "@/lib/practice-test-packs.server";
import {
  canonicalizeResult,
  makePracticeStdin,
  parseExpectedOutput,
  type PracticeLanguage,
} from "@/lib/practice-run-adapters";
import type {
  PracticeExecutionManifest,
  PracticeRuntimeLanguage,
} from "@/lib/practice-test-bundle-client";
import { signPracticeExecutionManifest } from "@/lib/practice-test-pack-signing.server";

const PROBLEM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGUAGE_MAP: Record<PracticeRuntimeLanguage, PracticeLanguage> = {
  cpp17: "C++",
  java: "Java",
  python: "Python",
  javascript: "JavaScript",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ problemId: string }> },
) {
  const { problemId } = await params;
  if (!PROBLEM_ID_PATTERN.test(problemId)) {
    return Response.json({ error: "Invalid practice problem id." }, { status: 400 });
  }
  const requestedLanguage = new URL(request.url).searchParams.get("language") ?? "cpp17";
  if (!Object.hasOwn(LANGUAGE_MAP, requestedLanguage)) {
    return Response.json({ error: "Unsupported practice language." }, { status: 400 });
  }

  const cases = PRACTICE_TEST_PACKS[problemId];
  if (!cases) {
    return Response.json({ error: "Practice test bundle not found." }, { status: 404 });
  }

  const checker = PRACTICE_TEST_CHECKERS[problemId] ?? { kind: "json_value_v1" as const };
  const problem = { id: problemId, title: problemId };
  let executionManifest: PracticeExecutionManifest;
  let signedExecutionManifest;
  try {
    executionManifest = {
      schema_version: 1,
      pack_id: `${problemId}@catalog-v1`,
      problem_id: problemId,
      problem_revision: "catalog-v1",
      language: requestedLanguage as PracticeRuntimeLanguage,
      checker,
      cases: (cases as PracticeTestCase[]).map((testCase) => ({
        name: testCase.name,
        stdin: makePracticeStdin(problem, testCase.rawInput),
        expected_stdout: `${canonicalizeResult(parseExpectedOutput(testCase))}\n`,
      })),
    };
    signedExecutionManifest = signPracticeExecutionManifest(executionManifest);
  } catch {
    return Response.json(
      { error: "A trusted practice-pack signature is not available." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json(
    {
      schema_version: 1,
      pack_id: `${problemId}@catalog-v1`,
      problem_id: problemId,
      problem_revision: "catalog-v1",
      checker,
      cases,
      execution_manifest: signedExecutionManifest,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
        "Content-Type": "application/json; charset=utf-8",
      },
    },
  );
}
