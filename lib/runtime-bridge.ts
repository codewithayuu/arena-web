"use client";

import type { ParticipantContestProblem } from "@/lib/contest-submissions";

export type RuntimeStatus = {
  protocol_version: number;
  version: string;
  paired: boolean;
  /** Present on current launchers; older protocol-compatible launchers omit it. */
  shutdown_requested?: boolean;
  capabilities: Array<{ language: string; available: boolean; sandbox: string; reason: string | null; toolchain_version: string | null }>;
};

export type RuntimeSession = {
  sessionToken: string;
  purpose: "practice" | "contest";
  contestId: string | null;
  expiresAt: string;
};

export type RuntimeConnectionPhase = "starting" | "pairing";

export type RuntimePairingChallenge = {
  requestId: string;
  purpose: "practice" | "contest";
  contestId: string | null;
  launchUri: string;
  expiresAt: string;
};

export type AdmissionHandoff = {
  challenge_id: string;
  policy_revision: number;
  policy_digest: string;
  device_id: string;
  idempotency_key: string;
};

export type LauncherPairingBinding = {
  challenge_sha256: string;
  device_id: string;
  device_public_key: string;
};

export type ContestAdmission = {
  contest_id: string;
  session_id: string;
  lease_token: string;
  device_id: string;
  device_epoch: number;
  expires_at: string;
  policy_digest: string;
  policy_revision: number;
  replayed: boolean;
};

export type LocalExecutionResult = {
  execution_id: string;
  mode: "PRACTICE_LOCAL" | "CONTEST_SAMPLE_LOCAL";
  verification: "LOCAL_UNVERIFIED";
  official: false;
  stdout: string;
  stderr: string;
  exit_code: number | null;
  /** Optional for compatibility with older launcher builds. */
  compile_exit_code?: number | null;
  duration_ms: number;
  peak_memory_bytes?: number;
  practice_cases?: Array<{
    name: string;
    passed: boolean;
    stdout: string;
    stderr: string;
    exit_code: number | null;
    duration_ms: number;
  }>;
  practice_manifest_version?: number;
  practice_pack_id?: string;
  practice_checker?: LocalPracticeChecker;
};

export type ContestLocalRunContext = {
  problemId: string;
  contestPolicy: {
    policy: Record<string, unknown>;
    sha256: string;
    signature: string;
    key_id: string;
    algorithm: string;
  };
};

/** Compare visible-sample output without requiring compiler status from older launchers. */
export function localExecutionMatchesSample(result: LocalExecutionResult, expectedOutput: string): boolean {
  return (result.compile_exit_code == null || result.compile_exit_code === 0) &&
    result.exit_code === 0 && result.stdout === expectedOutput;
}

export type LocalPracticeCase = {
  name: string;
  stdin: string;
  expected_stdout: string;
};

export type LocalPracticeChecker =
  | { kind: "exact_bytes_v1" }
  | { kind: "json_value_v1" }
  | { kind: "unordered_json_array_v1" }
  | { kind: "float_tolerance_v1"; absolute_tolerance: number; relative_tolerance: number };

export type LocalPracticeManifest = {
  schema_version: 1;
  pack_id: string;
  problem_id: string;
  problem_revision: string;
  checker: LocalPracticeChecker;
  cases: LocalPracticeCase[];
};

const RUNTIME = "http://127.0.0.1:48731";
const MAX_RESPONSE_BYTES = 8192;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class RuntimeBridgeError extends Error {
  constructor(readonly code: string, message: string) {
    super(message);
    this.name = "RuntimeBridgeError";
  }
}

const CONTEST_SAMPLE_FALLBACK_CODES = new Set([
  "PAIRING_EXPIRED",
  "RUNTIME_UNAVAILABLE",
  "RUNTIME_VERSION_UNSUPPORTED",
  "SANDBOX_UNAVAILABLE",
  "TOOLCHAIN_MISSING",
]);

/** A valid server admission can run public samples even when local pairing or
 * sandbox execution is unavailable. This never applies to official Submit. */
export function isContestSampleFallbackEligible(error: unknown): boolean {
  return error instanceof RuntimeBridgeError && CONTEST_SAMPLE_FALLBACK_CODES.has(error.code);
}

async function readJson(response: Response, maxBytes = MAX_RESPONSE_BYTES): Promise<unknown> {
  if (!response.body) throw new RuntimeBridgeError("INVALID_RESPONSE", "Runtime returned no response body.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBytes) throw new RuntimeBridgeError("INVALID_RESPONSE", "Runtime response was too large.");
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch (error) {
    if (error instanceof RuntimeBridgeError) throw error;
    throw new RuntimeBridgeError("INVALID_RESPONSE", "Runtime response could not be read.");
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function onlyKeys(value: Record<string, unknown>, allowed: string[]): boolean {
  return Object.keys(value).every((key) => allowed.includes(key));
}

function practiceCheckerMatches(value: unknown, expected: LocalPracticeChecker): boolean {
  const checker = object(value);
  if (!checker || checker.kind !== expected.kind) return false;
  if (expected.kind !== "float_tolerance_v1") return true;
  return checker.absolute_tolerance === expected.absolute_tolerance &&
    checker.relative_tolerance === expected.relative_tolerance;
}

export async function getRuntimeStatus(): Promise<RuntimeStatus | null> {
  try {
    const response = await fetch(`${RUNTIME}/v1/health`, {
      method: "GET", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      signal: AbortSignal.timeout(1200),
    });
    if (!response.ok) return null;
    const value = object(await readJson(response));
    if (!value || value.protocol_version !== 1 || typeof value.version !== "string" ||
        typeof value.paired !== "boolean" ||
        (value.shutdown_requested !== undefined && typeof value.shutdown_requested !== "boolean") ||
        !Array.isArray(value.capabilities)) return null;
    return value as RuntimeStatus;
  } catch {
    return null;
  }
}

/** Bootstrap only, never login/admission. Invoke directly from a user gesture. */
export async function startRuntimeOnUserAction(): Promise<void> {
  window.location.assign("mindflare://practice");
  const deadline=Date.now()+15_000;
  while (Date.now()<deadline) {
    if (await getRuntimeStatus()) return;
    await new Promise(resolve=>window.setTimeout(resolve,250));
  }
  throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE","Open the installed launcher, allow local-network access if prompted, then retry Connect.");
}

/** Prepare the server challenge before opening the OS URL scheme. Call this
 * from the first Connect action, then ask the user to click Open Launcher.
 * The second direct click is required so browsers preserve external-protocol
 * user activation after the asynchronous challenge request. */
export async function prepareRuntimePairingChallenge(
  purpose: "practice" | "contest",
  contestId?: string,
  admissionHandoff?: AdmissionHandoff,
  preparedBinding?: LauncherPairingBinding,
  launchRequestId?: string,
): Promise<RuntimePairingChallenge> {
  if (purpose === "contest" && (!contestId || !UUID.test(contestId))) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "A valid contest ID is required to pair contest mode.");
  }
  if (purpose === "contest" && (!launchRequestId || !UUID.test(launchRequestId))) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "A verified launcher contest reference is required to pair contest mode.");
  }
  if (purpose === "practice" && contestId !== undefined) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Practice pairing cannot include a contest ID.");
  }
  if (purpose === "practice" && launchRequestId !== undefined) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Practice pairing cannot include a contest launch reference.");
  }
  if (admissionHandoff && (purpose !== "contest" || !UUID.test(admissionHandoff.challenge_id) ||
      !UUID.test(admissionHandoff.device_id) || !UUID.test(admissionHandoff.idempotency_key) ||
      !Number.isSafeInteger(admissionHandoff.policy_revision) || admissionHandoff.policy_revision < 1 ||
      !/^[a-f0-9]{64}$/.test(admissionHandoff.policy_digest))) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Contest admission handoff is invalid.");
  }

  const binding = preparedBinding ?? await getLauncherPairingBinding();
  if (typeof binding.challenge_sha256 !== "string" || !/^[a-f0-9]{64}$/.test(binding.challenge_sha256) ||
      typeof binding.device_id !== "string" || !UUID.test(binding.device_id) ||
      /^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(binding.device_id) ||
      typeof binding.device_public_key !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(binding.device_public_key)) {
    throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE", "The launcher pairing binding is invalid. Retry browser pairing.");
  }
  const launcherBinding: LauncherPairingBinding = {
    challenge_sha256: binding.challenge_sha256,
    device_id: binding.device_id,
    device_public_key: binding.device_public_key,
  };
  if (admissionHandoff && admissionHandoff.device_id !== launcherBinding.device_id) {
    throw new RuntimeBridgeError("PAIRING_DEVICE_MISMATCH", "Contest preflight and launcher pairing refer to different devices. Retry readiness on this launcher.");
  }
  const challengeResponse = await fetch("/api/runtime/pairing/challenge", {
    method: "POST", credentials: "same-origin", cache: "no-store", redirect: "error",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(purpose === "contest"
      ? { purpose, contest_id: contestId, launch_request_id: launchRequestId, launcher_binding:launcherBinding, ...(admissionHandoff ? { admission_handoff: admissionHandoff } : {}) }
      : { purpose, launcher_binding:launcherBinding }),
    signal: AbortSignal.timeout(7000),
  }).catch(() => { throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE", "Mindflare could not create a launcher pairing request."); });
  const challenge = object(await readJson(challengeResponse).catch(() => null));
  if (!challengeResponse.ok) {
    if (challenge?.code === "LAUNCH_INTENT_EXPIRED") {
      throw new RuntimeBridgeError("LAUNCH_INTENT_EXPIRED", "This one-use launcher authorization expired. Exit SEB and start a fresh launcher handoff from the contest page.");
    }
    throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE", "Mindflare could not create a valid launcher pairing request.");
  }
  if (!challenge || typeof challenge.request_id !== "string" || !UUID.test(challenge.request_id) ||
      challenge.purpose !== purpose || (purpose === "contest" && challenge.contest_id !== contestId) || typeof challenge.launch_uri !== "string" ||
      challenge.launch_uri !== `mindflare://connect?request_id=${challenge.request_id}`) {
    throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE", "Mindflare could not create a valid launcher pairing request.");
  }
  const expiry = typeof challenge.expires_at === "string" ? Date.parse(challenge.expires_at) : NaN;
  if (!Number.isFinite(expiry) || expiry <= Date.now() || expiry > Date.now() + 120_000) {
    throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE", "Mindflare returned an expired or invalid pairing request.");
  }
  return {
    requestId: challenge.request_id,
    purpose,
    contestId: purpose === "contest" ? contestId! : null,
    launchUri: challenge.launch_uri,
    expiresAt: new Date(expiry).toISOString(),
  };
}

/** Read the launcher's one-time challenge commitment and OS-protected device key.
 * The browser may bind a handoff to these public values, but cannot redeem it. */
export async function getLauncherPairingBinding(): Promise<LauncherPairingBinding> {
  const bindingResponse = await fetch(`${RUNTIME}/v1/session/pairing-binding`, {
    method:"POST",mode:"cors",credentials:"omit",cache:"no-store",redirect:"error",
    headers:{"Content-Type":"application/json",Accept:"application/json"},body:"{}",signal:AbortSignal.timeout(3000),
  }).catch(()=>{throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE","Start Mindflare Launcher before preparing a new connection.");});
  const binding=object(await readJson(bindingResponse).catch(()=>null));
  if (!bindingResponse.ok || !binding || Object.keys(binding).length!==3 ||
      typeof binding.challenge_sha256!=="string" || !/^[a-f0-9]{64}$/.test(binding.challenge_sha256) ||
      typeof binding.device_id!=="string" || !UUID.test(binding.device_id) ||
      /^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(binding.device_id) ||
      typeof binding.device_public_key!=="string" || !/^[A-Za-z0-9_-]{43}$/.test(binding.device_public_key)) {
    throw new RuntimeBridgeError("RUNTIME_PAIRING_UNAVAILABLE","The launcher could not prepare a valid device-bound challenge. Retry browser pairing.");
  }
  return { challenge_sha256: binding.challenge_sha256, device_id: binding.device_id, device_public_key: binding.device_public_key };
}

/** Call directly from a deliberate user click. URL dispatch happens
 * synchronously before the first await, preserving browser user activation. */
export async function completeRuntimePairingOnUserAction(
  challenge: RuntimePairingChallenge,
  onPhase?: (phase: RuntimeConnectionPhase) => void,
): Promise<RuntimeSession> {
  return completeRuntimePairing(challenge, onPhase, true);
}

/** Pair from a contest page after its launch intent has already started the
 * launcher/runtime. This avoids asking SEB to dispatch a second custom URL. */
export async function completeRuntimePairingWithRunningLauncher(
  challenge: RuntimePairingChallenge,
  onPhase?: (phase: RuntimeConnectionPhase) => void,
): Promise<RuntimeSession> {
  return completeRuntimePairing(challenge, onPhase, false);
}

async function completeRuntimePairing(
  challenge: RuntimePairingChallenge,
  onPhase: ((phase: RuntimeConnectionPhase) => void) | undefined,
  dispatchLauncher: boolean,
): Promise<RuntimeSession> {
  if (!UUID.test(challenge.requestId) ||
      (challenge.purpose === "contest" && (!challenge.contestId || !UUID.test(challenge.contestId))) ||
      challenge.launchUri !== `mindflare://connect?request_id=${challenge.requestId}` ||
      !Number.isFinite(Date.parse(challenge.expiresAt)) || Date.parse(challenge.expiresAt) <= Date.now()) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "The launcher pairing request is invalid or expired. Prepare a new connection.");
  }

  if (dispatchLauncher) window.location.assign(challenge.launchUri);

  onPhase?.("starting");
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${RUNTIME}/v1/session/pair`, {
        method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ request_id: challenge.requestId }),
        signal: AbortSignal.timeout(1500),
      });
      if (response.status === 425) {
        await response.body?.cancel();
        onPhase?.("pairing");
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        continue;
      }
      const paired = object(await readJson(response));
      if (!response.ok || !paired || paired.paired !== true || typeof paired.session_token !== "string" ||
          !/^[A-Za-z0-9_-]{43}$/.test(paired.session_token) || paired.purpose !== challenge.purpose ||
          (challenge.purpose === "contest" && paired.contest_id !== challenge.contestId) || typeof paired.expires_at !== "string") {
        throw new RuntimeBridgeError("PAIRING_EXPIRED", "The launcher pairing expired or did not match this page.");
      }
      return {
        sessionToken: paired.session_token,
        purpose: challenge.purpose,
        contestId: challenge.purpose === "contest" ? challenge.contestId : null,
        expiresAt: paired.expires_at,
      };
    } catch (error) {
      if (error instanceof RuntimeBridgeError) throw error;
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
  }
  throw new RuntimeBridgeError(
    "RUNTIME_UNAVAILABLE",
    "Mindflare Launcher did not respond. Confirm it is installed, allow browser access to local network devices if prompted, then retry.",
  );
}

/** Retrieve a server-issued contest lease through the authenticated local
 * pairing session. The token remains in caller memory and is never persisted. */
export async function getContestAdmission(session: RuntimeSession): Promise<ContestAdmission> {
  if (session.purpose !== "contest" || !session.contestId || !UUID.test(session.contestId) ||
      Date.parse(session.expiresAt) <= Date.now()) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "Reconnect to the contest runtime before continuing.");
  }
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/session/admission`, {
      method: "GET", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "Could not retrieve the paired contest admission.");
  }
  const value = object(await readJson(response, 16 * 1024).catch(() => null));
  if (!response.ok || !value || value.contest_id !== session.contestId ||
      typeof value.session_id !== "string" || !UUID.test(value.session_id) ||
      typeof value.lease_token !== "string" || value.lease_token.length < 32 || value.lease_token.length > 4096 ||
      /\s/.test(value.lease_token) || typeof value.device_id !== "string" || !UUID.test(value.device_id) ||
      !Number.isSafeInteger(value.device_epoch) || Number(value.device_epoch) < 1 ||
      typeof value.expires_at !== "string" || !Number.isFinite(Date.parse(value.expires_at)) || Date.parse(value.expires_at) <= Date.now() ||
      typeof value.policy_digest !== "string" || !/^[a-f0-9]{64}$/.test(value.policy_digest) ||
      !Number.isSafeInteger(value.policy_revision) || Number(value.policy_revision) < 1 ||
      typeof value.replayed !== "boolean") {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "The local runtime returned no valid server admission.");
  }
  return value as ContestAdmission;
}

/** Read public contest content only from the paired launcher. The launcher
 * obtains and verifies the package itself; no grant or package URL is exposed
 * to this browser bridge. */
export async function getLocalContestProblems(
  session: RuntimeSession,
  contestId: string,
): Promise<ParticipantContestProblem[]> {
  if (session.purpose !== "contest" || session.contestId !== contestId || !UUID.test(contestId) ||
      !/^[A-Za-z0-9_-]{43}$/.test(session.sessionToken) || Date.parse(session.expiresAt) <= Date.now()) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "Reconnect to the admitted contest runtime.");
  }
  let response: Response;
  try {
    const prepared = await fetch(`${RUNTIME}/v1/session/prepare-content`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(90_000),
    });
    await prepared.body?.cancel();
    if (prepared.status !== 204) {
      throw new RuntimeBridgeError((prepared.status === 401 || prepared.status === 403) ? "PAIRING_EXPIRED" : "RUNTIME_UNAVAILABLE",
        "Verified content is still being prepared. Retain this pairing and retry.");
    }
    response = await fetch(`${RUNTIME}/v1/localhost/contests/${encodeURIComponent(contestId)}/problems`, {
      method: "GET", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof RuntimeBridgeError) throw error;
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "Could not retrieve verified contest content from the launcher.");
  }
  if (response.status === 401 || response.status === 403) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "The launcher no longer accepts this contest session. Reconnect from the signed-in contest page to pair again.");
  }
  if (response.status >= 500) {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "The launcher could not revalidate contest access. Retry when the contest authority is reachable.");
  }
  const value = object(await readJson(response, 8 * 1024 * 1024).catch(() => null));
  if (!response.ok || !value || !onlyKeys(value, ["contest_id", "source_polygon_sha256", "problems"]) ||
      value.contest_id !== contestId || typeof value.source_polygon_sha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(value.source_polygon_sha256) || !Array.isArray(value.problems) ||
      value.problems.length < 1 || value.problems.length > 256) {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned no valid public contest bundle.");
  }
  const problems: ParticipantContestProblem[] = [];
  for (let index = 0; index < value.problems.length; index += 1) {
    const problem = object(value.problems[index]);
    if (!problem || !onlyKeys(problem, ["slug", "problem_id", "ordinal", "title", "statement_markdown", "assets", "samples", "time_limit_ms", "memory_limit_bytes"]) ||
        typeof problem.slug !== "string" || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(problem.slug) ||
        typeof problem.problem_id !== "string" || !UUID.test(problem.problem_id) ||
        problem.ordinal !== index + 1 || typeof problem.title !== "string" || problem.title.length < 1 || problem.title.length > 200 ||
        typeof problem.statement_markdown !== "string" || new TextEncoder().encode(problem.statement_markdown).byteLength > 1_048_576 ||
        !Array.isArray(problem.samples) || problem.samples.length > 1000 || !Array.isArray(problem.assets) || problem.assets.length > 128) {
      throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned malformed public problem data.");
    }
    const samples = problem.samples.map((sample) => {
      const record = object(sample);
      if (!record || !onlyKeys(record, ["index", "input", "output"]) || !Number.isSafeInteger(record.index) ||
          typeof record.input !== "string" || new TextEncoder().encode(record.input).byteLength > 65_536 ||
          typeof record.output !== "string" || new TextEncoder().encode(record.output).byteLength > 65_536) {
        throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned malformed public samples.");
      }
      return { input: record.input, output: record.output };
    });
    const assets = problem.assets.map((asset) => {
      const record = object(asset);
      if (!record || !onlyKeys(record, ["path", "media_type", "sha256"]) || typeof record.path !== "string" ||
          !record.path.startsWith(`problems/${problem.slug}/assets/`) || record.path.length > 400 ||
          !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(String(record.media_type)) ||
          typeof record.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(record.sha256)) {
        throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned malformed public assets.");
      }
      return { path: record.path, media_type: String(record.media_type), sha256: record.sha256 };
    });
    problems.push({
      problem_id: problem.problem_id,
      ordinal: Number(problem.ordinal),
      title: problem.title,
      statement_markdown: problem.statement_markdown,
      public_samples: samples,
      assets,
    });
  }
  return problems;
}

/** Tell the launcher to independently confirm the gateway's terminal session
 * state and perform its cache/key cleanup before the browser exits SEB. */
export async function confirmLocalContestCompletion(
  session: RuntimeSession,
  contestId: string,
): Promise<void> {
  if (session.purpose !== "contest" || session.contestId !== contestId || !UUID.test(contestId) ||
      !/^[A-Za-z0-9_-]{43}$/.test(session.sessionToken)) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "A matching paired contest session is required.");
  }
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/localhost/contests/${encodeURIComponent(contestId)}/completed`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}`, Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "The launcher could not confirm contest completion.");
  }
  if (response.status !== 204) {
    await response.body?.cancel();
    throw new RuntimeBridgeError("CONTEST_COMPLETION_PENDING", "The launcher has not confirmed terminal contest state.");
  }
}

/** After an authenticated re-pair, let the launcher submit only its queued,
 * device-signed cleanup metadata for historical sessions. Fresh pairing proof
 * travels directly launcher-to-gateway; no Clerk token enters localhost. */
export async function recoverLocalCacheCleanup(
  session: RuntimeSession,
): Promise<{ recoveredCount: number; deferredCount: number }> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(session.sessionToken) || Date.parse(session.expiresAt)<=Date.now()) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Cleanup recovery requires a paired runtime and a fresh browser re-pair.");
  }
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/session/cache-cleanup/recover`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: {
        Authorization: `Bearer ${session.sessionToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: "{}",
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "The launcher could not reach cleanup recovery.");
  }
  const value = object(await readJson(response, 16 * 1024).catch(() => null));
  if (!response.ok || !value || !onlyKeys(value, ["recovered_count", "deferred_count"]) ||
      !Number.isSafeInteger(value.recovered_count) || Number(value.recovered_count) < 0 ||
      !Number.isSafeInteger(value.deferred_count) || Number(value.deferred_count) < 0) {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned an invalid cleanup recovery receipt.");
  }
  return { recoveredCount: Number(value.recovered_count), deferredCount: Number(value.deferred_count) };
}

export async function getLocalContestAsset(
  session: RuntimeSession,
  contestId: string,
  assetPath: string,
): Promise<Blob> {
  if (session.purpose !== "contest" || session.contestId !== contestId || !UUID.test(contestId) ||
      !assetPath.startsWith("problems/") || assetPath.length > 400 ||
      assetPath.split("/").some((part) => !part || part === "." || part === "..")) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "The contest asset path is invalid.");
  }
  const localPath = assetPath.slice("problems/".length).split("/").map(encodeURIComponent).join("/");
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/localhost/contests/${encodeURIComponent(contestId)}/assets/${localPath}`, {
      method: "GET", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}` }, signal: AbortSignal.timeout(10_000),
    });
  } catch {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "Could not retrieve this public contest asset from the launcher.");
  }
  const length = Number(response.headers.get("content-length") ?? 0);
  if (!response.ok || (length > 16 * 1024 * 1024)) {
    await response.body?.cancel();
    throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher did not authorize this public contest asset.");
  }
  if (!response.body) throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned an empty public asset.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16 * 1024 * 1024) {
        await reader.cancel();
        throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned an oversized public asset.");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const mediaType = response.headers.get("content-type") ?? "";
  const blob = new Blob(chunks, { type: mediaType });
  if (blob.size > 16 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(blob.type)) {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher returned an invalid public contest asset.");
  }
  return blob;
}

/** Execute one user-selected input through the paired local sandbox. This API
 * never accepts a local verdict or private test bundle. Contest requests are
 * scoped by the already paired contest session and return output only. */
export async function runLocalInput(
  session: RuntimeSession,
  source: string,
  language: string,
  stdin: string,
  executionId = crypto.randomUUID(),
  practiceManifest?: LocalPracticeManifest,
  contestContext?: ContestLocalRunContext,
): Promise<LocalExecutionResult> {
  if (Date.parse(session.expiresAt) <= Date.now()) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "Reconnect before running code.");
  }
  if (source.length === 0 || source.length > 256 * 1024 || stdin.length > 64 * 1024 ||
      new TextEncoder().encode(source).byteLength > 256 * 1024 ||
      new TextEncoder().encode(stdin).byteLength > 64 * 1024) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Source or input exceeds the local runtime limit.");
  }
  if (practiceManifest && (session.purpose !== "practice" || stdin !== "" ||
      practiceManifest.schema_version !== 1 ||
      !/^[a-z0-9._-]{1,64}$/.test(practiceManifest.problem_id) ||
      !/^[a-z0-9._-]{1,64}$/.test(practiceManifest.problem_revision) ||
      practiceManifest.pack_id !== `${practiceManifest.problem_id}@${practiceManifest.problem_revision}` ||
      practiceManifest.cases.length < 1 || practiceManifest.cases.length > 8 ||
      practiceManifest.cases.some((testCase) =>
        !testCase.name || testCase.name.length > 64 || testCase.stdin.length > 8 * 1024 ||
        testCase.expected_stdout.length > 8 * 1024) ||
      (practiceManifest.checker.kind === "float_tolerance_v1" &&
        (!Number.isFinite(practiceManifest.checker.absolute_tolerance) ||
          !Number.isFinite(practiceManifest.checker.relative_tolerance) ||
          practiceManifest.checker.absolute_tolerance < 0 || practiceManifest.checker.absolute_tolerance > 1 ||
          practiceManifest.checker.relative_tolerance < 0 || practiceManifest.checker.relative_tolerance > 1)))) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Practice test bundle is invalid for this session.");
  }
  if ((session.purpose === "contest" && (!contestContext || !UUID.test(contestContext.problemId) ||
      contestContext.contestPolicy.algorithm !== "Ed25519" ||
      !/^[a-f0-9]{64}$/.test(contestContext.contestPolicy.sha256) ||
      !/^[A-Za-z0-9._-]{1,64}$/.test(contestContext.contestPolicy.key_id) ||
      typeof contestContext.contestPolicy.signature !== "string" || contestContext.contestPolicy.signature.length < 80 ||
      contestContext.contestPolicy.signature.length > 128)) ||
      (session.purpose === "practice" && contestContext !== undefined) ||
      (practiceManifest && contestContext)) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Contest local Run requires the signed policy and selected problem from this session.");
  }
  let status = await getRuntimeStatus();
  let capability = status?.capabilities.find((entry) => entry.language === language);
  if (capability && !capability.available && capability.reason === "TOOLCHAIN_MISSING" && capability.toolchain_version) {
    await ensureLocalToolchain(session, language, capability.toolchain_version);
    status = await getRuntimeStatus();
    capability = status?.capabilities.find((entry) => entry.language === language);
  }
  if (!capability?.available || !capability.toolchain_version) {
    throw new RuntimeBridgeError(
      capability?.reason?.toUpperCase() ?? "TOOLCHAIN_MISSING",
      "A release-verified compiler profile and supported sandbox are unavailable on this device.",
    );
  }
  const mode = session.purpose === "practice" ? "PRACTICE_LOCAL" : "CONTEST_SAMPLE_LOCAL";
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}${practiceManifest ? "/v1/execution/practice" : "/v1/execution/run"}`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: {
        "Authorization": `Bearer ${session.sessionToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        protocol_version: 1,
        execution_id: executionId,
        mode,
        language,
        source,
        toolchain_version: capability.toolchain_version,
        stdin,
        ...(contestContext ? {
          problem_id: contestContext.problemId,
          contest_policy: contestContext.contestPolicy,
        } : {}),
        ...(practiceManifest ? { practice_manifest: practiceManifest } : {}),
        test_bundle_id: null,
      }),
      signal: AbortSignal.timeout(practiceManifest ? 120_000 : 300_000),
    });
  } catch {
    // A browser timeout can abandon the response while the sandbox is still
    // compiling or running. Ask the paired runtime to stop that execution so
    // an unreachable page does not leave work consuming local resources.
    await cancelLocalExecution(session, executionId).catch(() => undefined);
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "Could not reach the paired local runtime.");
  }
  if (practiceManifest && response.status === 404) {
    throw new RuntimeBridgeError("RUNTIME_VERSION_UNSUPPORTED", "Update Mindflare Launcher to run local practice test batches.");
  }
  const value = object(await readJson(response, 2 * 1024 * 1024));
  const durationMs = value?.duration_ms;
  if (!response.ok) {
    const code = typeof value?.code === "string" ? value.code : "LOCAL_EXECUTION_FAILED";
    const message = typeof value?.message === "string" ? value.message : "Local execution failed.";
    throw new RuntimeBridgeError(code, message);
  }
  if (!value || value.execution_id !== executionId || value.mode !== mode ||
      value.verification !== "LOCAL_UNVERIFIED" || value.official !== false ||
      typeof value.stdout !== "string" || typeof value.stderr !== "string" ||
      !(typeof value.exit_code === "number" || value.exit_code === null) ||
      !(value.compile_exit_code === undefined || value.compile_exit_code === null ||
        (typeof value.compile_exit_code === "number" && Number.isSafeInteger(value.compile_exit_code))) ||
      typeof durationMs !== "number" || !Number.isSafeInteger(durationMs) ||
      durationMs < 0 || durationMs > 300_000 ||
      !(value.peak_memory_bytes === undefined || value.peak_memory_bytes === null ||
        (typeof value.peak_memory_bytes === "number" && Number.isSafeInteger(value.peak_memory_bytes) && value.peak_memory_bytes >= 0))) {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "Local runtime returned an invalid execution result.");
  }
  if (practiceManifest && (!Array.isArray(value.practice_cases) || value.practice_cases.length !== practiceManifest.cases.length ||
      value.practice_cases.some((entry, index) => {
        const result = object(entry);
        return !result || result.name !== practiceManifest.cases[index].name || typeof result.passed !== "boolean" ||
          typeof result.stdout !== "string" || typeof result.stderr !== "string" ||
          !(typeof result.exit_code === "number" || result.exit_code === null) ||
          typeof result.duration_ms !== "number" ||
          !(result.peak_memory_bytes === undefined || result.peak_memory_bytes === null ||
            (typeof result.peak_memory_bytes === "number" && Number.isSafeInteger(result.peak_memory_bytes) && result.peak_memory_bytes >= 0));
      }) || value.practice_manifest_version !== practiceManifest.schema_version ||
      value.practice_pack_id !== practiceManifest.pack_id ||
      !practiceCheckerMatches(value.practice_checker, practiceManifest.checker))) {
    throw new RuntimeBridgeError("INVALID_RESPONSE", "Local runtime returned invalid practice case results.");
  }
  return value as LocalExecutionResult;
}

async function ensureLocalToolchain(session: RuntimeSession, language: string, version: string): Promise<void> {
  if (Date.parse(session.expiresAt) <= Date.now() || !/^[a-z0-9_-]{1,32}$/.test(language) ||
      !/^[A-Za-z0-9._-]{1,64}$/.test(version)) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "Reconnect before installing a toolchain.");
  }
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/toolchains/ensure`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: {
        Authorization: `Bearer ${session.sessionToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ language, toolchain_version: version }),
      signal: AbortSignal.timeout(300_000),
    });
  } catch {
    throw new RuntimeBridgeError("TOOLCHAIN_MISSING", "The signed toolchain could not be downloaded. No code was run.");
  }
  const value = object(await readJson(response));
  if (!response.ok || !value || value.language !== language || value.toolchain_version !== version || value.available !== true) {
    const code = typeof value?.code === "string" && /^[A-Z0-9_]{1,80}$/.test(value.code) ? value.code : "TOOLCHAIN_MISSING";
    throw new RuntimeBridgeError(code, "The release-pinned signed toolchain could not be installed. No code was run.");
  }
}

export async function cancelLocalExecution(session: RuntimeSession, executionId: string): Promise<void> {
  if (Date.parse(session.expiresAt) <= Date.now() || !UUID.test(executionId)) {
    throw new RuntimeBridgeError("PAIRING_EXPIRED", "Reconnect before cancelling this run.");
  }
  let response: Response;
  try {
    response = await fetch(`${RUNTIME}/v1/execution/cancel`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: {
        "Authorization": `Bearer ${session.sessionToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ execution_id: executionId }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "Could not reach the local runtime to cancel this run.");
  }
  const value = object(await readJson(response));
  if (!response.ok || value?.execution_id !== executionId || value.cancellation_requested !== true) {
    const code = typeof value?.code === "string" ? value.code : "CANCEL_FAILED";
    const message = typeof value?.message === "string" ? value.message : "Local run could not be cancelled.";
    throw new RuntimeBridgeError(code, message);
  }
}

/** Guarded loopback report. Its device signature authenticates the source,
 * not the truth of the observed host state. The gateway performs verification. */
export async function getLocalPreflightEvidence(session: RuntimeSession, challenge: {
  challenge_id: string; challenge_nonce: string; contest_id: string;
  policy_revision: number; policy_digest: string;
}): Promise<Record<string, unknown>> {
  if (session.purpose !== "contest" || session.contestId !== challenge.contest_id ||
      Date.parse(session.expiresAt) <= Date.now()) {
    throw new RuntimeBridgeError("INVALID_REQUEST", "Pair this contest before requesting preflight observations.");
  }
  try {
    const response = await fetch(`${RUNTIME}/v1/session/preflight-evidence`, {
      method: "POST", mode: "cors", credentials: "omit", cache: "no-store", redirect: "error",
      headers: { Authorization: `Bearer ${session.sessionToken}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ challenge_id: challenge.challenge_id, challenge_nonce: challenge.challenge_nonce,
        contest_id: challenge.contest_id, policy_revision: challenge.policy_revision, policy_sha256: challenge.policy_digest }),
      signal: AbortSignal.timeout(7000),
    });
    if (response.status === 404) {
      await response.body?.cancel();
      throw new RuntimeBridgeError("RUNTIME_VERSION_UNSUPPORTED", "Update Mindflare Launcher to a release that supports signed preflight observations, then pair again.");
    }
    const evidence = object(await readJson(response, 16 * 1024));
    if (!response.ok || !evidence || evidence.algorithm !== "Ed25519" || typeof evidence.signature !== "string") {
      throw new RuntimeBridgeError("INVALID_RESPONSE", "The launcher did not produce a supported signed observation.");
    }
    return evidence;
  } catch (error) {
    if (error instanceof RuntimeBridgeError) throw error;
    throw new RuntimeBridgeError("RUNTIME_UNAVAILABLE", "The launcher's preflight observation is unavailable.");
  }
}
