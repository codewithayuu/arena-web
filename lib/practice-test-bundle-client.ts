export interface PracticeTestCase {
  id: number;
  name: string;
  input: string;
  rawInput: unknown;
  expectedOutput: string;
}

export interface PracticeTestPack {
  schema_version: 1;
  pack_id: string;
  problem_id: string;
  problem_revision: string;
  checker: PracticeCheckerV1;
  cases: PracticeTestCase[];
  execution_manifest: SignedPracticeExecutionManifest;
}

export type PracticeCheckerV1 =
  | { kind: "exact_bytes_v1" }
  | { kind: "json_value_v1" }
  | { kind: "unordered_json_array_v1" }
  | {
      kind: "float_tolerance_v1";
      absolute_tolerance: number;
      relative_tolerance: number;
    };

export type PracticeRuntimeLanguage = "cpp17" | "java" | "python" | "javascript";

export interface PracticeExecutionManifest {
  schema_version: 1;
  pack_id: string;
  problem_id: string;
  problem_revision: string;
  language: PracticeRuntimeLanguage;
  checker: PracticeCheckerV1;
  cases: Array<{ name: string; stdin: string; expected_stdout: string }>;
}

export interface SignedPracticeExecutionManifest {
  key_id: string;
  signature: string;
  manifest: PracticeExecutionManifest;
}

const CACHE_TTL_MS = 5 * 60_000;
const CACHE_ENTRY_LIMIT = 16;
const MAX_PACK_BYTES = 48 * 1024;
const cache = new Map<string, { expiresAt: number; pack: PracticeTestPack }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateChecker(value: unknown): PracticeCheckerV1 {
  if (!isRecord(value)) throw new Error("Practice test bundle checker is invalid.");
  if (value.kind === "exact_bytes_v1") return { kind: "exact_bytes_v1" };
  if (value.kind === "json_value_v1") return { kind: "json_value_v1" };
  if (value.kind === "unordered_json_array_v1") return { kind: "unordered_json_array_v1" };
  if (
    value.kind === "float_tolerance_v1" &&
    typeof value.absolute_tolerance === "number" &&
    Number.isFinite(value.absolute_tolerance) &&
    value.absolute_tolerance >= 0 &&
    value.absolute_tolerance <= 1 &&
    typeof value.relative_tolerance === "number" &&
    Number.isFinite(value.relative_tolerance) &&
    value.relative_tolerance >= 0 &&
    value.relative_tolerance <= 1
  ) {
    return {
      kind: "float_tolerance_v1",
      absolute_tolerance: value.absolute_tolerance,
      relative_tolerance: value.relative_tolerance,
    };
  }
  throw new Error("Practice test bundle checker is unsupported or invalid.");
}

function sameChecker(left: PracticeCheckerV1, right: PracticeCheckerV1): boolean {
  if (left.kind !== right.kind) return false;
  if (left.kind !== "float_tolerance_v1" || right.kind !== "float_tolerance_v1") return true;
  return left.absolute_tolerance === right.absolute_tolerance &&
    left.relative_tolerance === right.relative_tolerance;
}

export function validatePracticeTestPack(
  value: unknown,
  requestedProblemId: string,
  requestedLanguage: PracticeRuntimeLanguage = "cpp17",
): PracticeTestPack {
  if (!isRecord(value) || value.schema_version !== 1) {
    throw new Error("Practice test bundle has an unsupported schema.");
  }
  if (
    value.problem_id !== requestedProblemId ||
    value.problem_revision !== "catalog-v1" ||
    value.pack_id !== `${requestedProblemId}@catalog-v1` ||
    !isRecord(value.checker) ||
    !Array.isArray(value.cases) ||
    value.cases.length === 0 ||
    value.cases.length > 8
  ) {
    throw new Error("Practice test bundle metadata is invalid.");
  }
  const checker = validateChecker(value.checker);

  const ids = new Set<number>();
  let byteLength = 0;
  const cases = value.cases.map((item): PracticeTestCase => {
    if (
      !isRecord(item) ||
      !Number.isSafeInteger(item.id) ||
      (item.id as number) < 1 ||
      typeof item.name !== "string" ||
      item.name.length === 0 ||
      item.name.length > 80 ||
      typeof item.input !== "string" ||
      item.input.length > 8 * 1024 ||
      typeof item.expectedOutput !== "string" ||
      item.expectedOutput.length > 8 * 1024
    ) {
      throw new Error("Practice test bundle contains an invalid case.");
    }
    if (ids.has(item.id as number)) {
      throw new Error("Practice test bundle contains duplicate case ids.");
    }
    ids.add(item.id as number);
    let rawInputJson: string;
    try {
      rawInputJson = JSON.stringify(item.rawInput);
    } catch {
      throw new Error("Practice test bundle contains invalid input data.");
    }
    if (rawInputJson === undefined) {
      throw new Error("Practice test bundle contains invalid input data.");
    }
    byteLength += new TextEncoder().encode(
      `${item.input}${rawInputJson}${item.expectedOutput}`,
    ).byteLength;
    return {
      id: item.id as number,
      name: item.name,
      input: item.input,
      rawInput: item.rawInput,
      expectedOutput: item.expectedOutput,
    };
  });
  if (byteLength > MAX_PACK_BYTES) {
    throw new Error("Practice test bundle exceeds the supported size.");
  }

  const signed = value.execution_manifest;
  if (
    !isRecord(signed) ||
    typeof signed.key_id !== "string" || !/^[A-Za-z0-9._-]{1,64}$/.test(signed.key_id) ||
    typeof signed.signature !== "string" || !/^[A-Za-z0-9+/]{86}==$/.test(signed.signature) ||
    !isRecord(signed.manifest)
  ) {
    throw new Error("Practice execution pack is not signed or has an invalid envelope.");
  }
  const manifest = signed.manifest;
  if (
    manifest.schema_version !== 1 ||
    manifest.pack_id !== value.pack_id ||
    manifest.problem_id !== requestedProblemId ||
    manifest.problem_revision !== value.problem_revision ||
    manifest.language !== requestedLanguage ||
    !Array.isArray(manifest.cases) || manifest.cases.length !== cases.length ||
    !sameChecker(checker, validateChecker(manifest.checker))
  ) {
    throw new Error("Signed practice execution pack metadata does not match the requested bundle.");
  }
  let executionBytes = 0;
  const executionCases = manifest.cases.map((item, index) => {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" || item.name !== cases[index]?.name || item.name.length > 80 ||
      typeof item.stdin !== "string" || item.stdin.length > 8 * 1024 ||
      typeof item.expected_stdout !== "string" || item.expected_stdout.length > 8 * 1024
    ) {
      throw new Error("Signed practice execution pack contains an invalid case.");
    }
    executionBytes += new TextEncoder().encode(`${item.name}${item.stdin}${item.expected_stdout}`).byteLength;
    return { name: item.name, stdin: item.stdin, expected_stdout: item.expected_stdout };
  });
  if (executionBytes > MAX_PACK_BYTES) {
    throw new Error("Signed practice execution pack exceeds the supported size.");
  }

  return {
    schema_version: 1,
    pack_id: value.pack_id as string,
    problem_id: value.problem_id as string,
    problem_revision: value.problem_revision as string,
    checker,
    cases,
    execution_manifest: {
      key_id: signed.key_id,
      signature: signed.signature,
      manifest: {
        schema_version: 1,
        pack_id: manifest.pack_id as string,
        problem_id: manifest.problem_id as string,
        problem_revision: manifest.problem_revision as string,
        language: requestedLanguage,
        checker: validateChecker(manifest.checker),
        cases: executionCases,
      },
    },
  };
}

export async function loadPracticeTestPack(
  problemId: string,
  signal?: AbortSignal,
  language: PracticeRuntimeLanguage = "cpp17",
): Promise<PracticeTestPack> {
  const cacheKey = `${problemId}:${language}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.pack;
  if (cached) cache.delete(cacheKey);

  const response = await fetch(
    `/api/practice/${encodeURIComponent(problemId)}/test-bundle?language=${language}`,
    { method: "GET", credentials: "omit", cache: "default", signal },
  );
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? "This practice problem has no local test bundle."
        : `Could not load practice tests (HTTP ${response.status}).`,
    );
  }
  const pack = validatePracticeTestPack(await response.json(), problemId, language);
  cache.delete(cacheKey);
  cache.set(cacheKey, { pack, expiresAt: Date.now() + CACHE_TTL_MS });
  while (cache.size > CACHE_ENTRY_LIMIT) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }
  return pack;
}
