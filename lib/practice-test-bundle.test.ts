import { signPracticeExecutionManifest } from "@/lib/practice-test-pack-signing.server";
import type { PracticeExecutionManifest } from "@/lib/practice-test-bundle-client";
import assert from "node:assert/strict";
import test from "node:test";
import { GET } from "@/app/api/practice/[problemId]/test-bundle/route";
import { getAllPracticeProblems } from "@/lib/practice-problems";
import {
  PRACTICE_TEST_CHECKERS,
  PRACTICE_TEST_PACKS,
} from "@/lib/practice-test-packs.server";
import {
  loadPracticeTestPack,
  validatePracticeTestPack,
} from "@/lib/practice-test-bundle-client";

// Synthetic key used only by this test module. Production still requires its own signer.
process.env.MINDFLARE_PRACTICE_PACK_SIGNER_KEY_ID = "practice-test-key";
process.env.MINDFLARE_PRACTICE_PACK_SIGNER_PRIVATE_SEED_BASE64 = Buffer.alloc(32, 7).toString("base64");

function signedFixture<T extends { pack_id: string; problem_id: string; problem_revision: string; checker: unknown; cases: Array<{ name: string; rawInput: unknown; expectedOutput: string }> }>(pack: T) {
  return {
    ...pack,
    execution_manifest: signPracticeExecutionManifest({
      schema_version: 1, pack_id: pack.pack_id, problem_id: pack.problem_id,
      problem_revision: pack.problem_revision, language: "cpp17",
      checker: pack.checker as PracticeExecutionManifest["checker"],
      cases: pack.cases.map(item => ({ name: item.name, stdin: String(item.rawInput), expected_stdout: item.expectedOutput })),
    }),
  };
}

test("practice catalog ships problem statements without test bundles", () => {
  const problems = getAllPracticeProblems();
  assert.ok(problems.length > 0);
  assert.ok(problems.every((problem) => !("testCases" in problem)));
  assert.equal(Object.keys(PRACTICE_TEST_PACKS).length, 26);
  for (const [problemId, cases] of Object.entries(PRACTICE_TEST_PACKS)) {
    assert.ok(cases.length > 0, `${problemId} should have public practice cases`);
    assert.equal(
      validatePracticeTestPack(signedFixture({
        schema_version: 1,
        pack_id: `${problemId}@catalog-v1`,
        problem_id: problemId,
        problem_revision: "catalog-v1",
        checker: PRACTICE_TEST_CHECKERS[problemId] ?? { kind: "json_value_v1" },
        cases,
      }), problemId).cases.length,
      cases.length,
    );
  }
});

test("test bundle route returns only versioned public practice cases", async () => {
  const response = await GET(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "move-zeroes" }),
  });
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control") ?? "", /public, max-age=300/);
  assert.equal(body.schema_version, 1);
  assert.equal(body.problem_id, "move-zeroes");
  assert.equal(body.checker.kind, "json_value_v1");
  assert.equal(body.cases.length, 7);
  assert.equal(body.cases[0].name, "Case 1");
});

test("test bundle route publishes the problem's floating point checker", async () => {
  const response = await GET(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "calculate-amdahls-law-speedup" }),
  });
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.deepEqual(body.checker, {
    kind: "float_tolerance_v1",
    absolute_tolerance: 0.005,
    relative_tolerance: 0,
  });
});

test("test bundle route rejects malformed and unknown problem ids", async () => {
  const malformed = await GET(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "../move-zeroes" }),
  });
  const missing = await GET(new Request("http://localhost"), {
    params: Promise.resolve({ problemId: "not-a-practice-pack" }),
  });
  assert.equal(malformed.status, 400);
  assert.equal(missing.status, 404);
});

test("client validates pack metadata and case bounds", () => {
  const pack = {
    schema_version: 1,
    pack_id: "valid-palindrome@catalog-v1",
    problem_id: "valid-palindrome",
    problem_revision: "catalog-v1",
    checker: { kind: "json_value_v1" },
    cases: [{ id: 1, name: "Case 1", input: '"aba"', rawInput: "aba", expectedOutput: "true" }],
  };
  assert.equal(validatePracticeTestPack(signedFixture(pack), "valid-palindrome").cases.length, 1);
  assert.throws(() => validatePracticeTestPack(signedFixture(pack), "other-problem"), /metadata/);
  assert.throws(
    () => validatePracticeTestPack({ ...pack, cases: Array(9).fill(pack.cases[0]) }, "valid-palindrome"),
    /metadata/,
  );
});

test("browser loader caches a validated per-problem bundle", async () => {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async (_input, init) => {
    requests += 1;
    assert.equal(init?.credentials, "omit");
    assert.equal(init?.cache, "default");
    return Response.json(signedFixture({
      schema_version: 1,
      pack_id: "loader-cache-test@catalog-v1",
      problem_id: "loader-cache-test",
      problem_revision: "catalog-v1",
      checker: { kind: "json_value_v1" },
      cases: [{ id: 1, name: "Case 1", input: "[]", rawInput: [], expectedOutput: "[]" }],
    }));
  };
  try {
    const first = await loadPracticeTestPack("loader-cache-test");
    const second = await loadPracticeTestPack("loader-cache-test");
    assert.strictEqual(first, second);
    assert.equal(requests, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
