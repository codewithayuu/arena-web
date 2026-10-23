export type ContestSubmissionInput = {
  session_id: string;
  lease_token: string;
  device_id: string;
  device_epoch: number;
  problem_id: string;
  language: "cpp17" | "cpp20" | "java" | "python" | "javascript";
  source: string;
};

export type ContestAdmissionLease = {
  session_id: string;
  lease_token: string;
  device_id: string;
  device_epoch: number;
  expires_at: string;
  policy_digest: string;
  policy_revision: number;
  replayed: boolean;
};

export type ContestCompletionReceipt = {
  session_id: string;
  completed_at: string;
  completed: true;
  replayed: boolean;
};

export type ContestSubmissionReceipt = {
  submission_id: string;
  status: "queued" | "compiling" | "running" | "judged" | "internal_error";
  accepted_at: string;
  source_sha256: string;
  idempotency_key: string;
};

export type ContestSubmissionStatus = ContestSubmissionReceipt & {
  status: "queued" | "judging" | "judged" | "internal_error";
  verdict: "AC" | "WA" | "CE" | "RE" | "TLE" | "MLE" | "OLE" | "CANCELED" | null;
  score: number | null;
  reason: "ACCEPTED_OUTPUT_MATCH" | "WRONG_ANSWER" | "COMPILE_FAILED" | "RUNTIME_ERROR" |
    "TIME_LIMIT" | "MEMORY_LIMIT" | "OUTPUT_LIMIT" | "CANCELED" | null;
};

export type ContestSubmissionHistoryItem = {
  submission_id: string;
  problem_id: string;
  language: ContestSubmissionInput["language"];
  accepted_at: string;
  source_sha256: string;
  idempotency_key: string;
};

export type ContestSubmissionHistoryCursor = { accepted_at: string; submission_id: string };
export type ContestSubmissionHistoryPage = {
  items: ContestSubmissionHistoryItem[];
  next_cursor: ContestSubmissionHistoryCursor | null;
};

export type ParticipantContestProblem = {
  problem_id: string;
  ordinal: number;
  title: string;
  statement_markdown: string;
  public_samples: Array<{ input: string; output: string }>;
  assets?: Array<{ path: string; media_type: string; sha256: string }>;
};

export type ContestSampleRunResult = {
  stdout: string;
  stderr: string;
  exit_code: number | null;
  compile_exit_code: number | null;
  sample_matches: boolean;
  duration_ms: number;
};

export type ContestStandingRow = {
  rank: number;
  participant: string;
  solved: number;
  points: number;
  penalty_minutes: number;
  hidden_activity: boolean;
  problems: Record<string, ContestProblemStanding>;
};

export type ContestProblemStanding = {
  solved: boolean;
  points: number;
  penalty_minutes: number | null;
  best_score_achieved_at_seconds: number | null;
};

export type PublicContestStandings = {
  state: "active" | "paused" | "finalizing" | "review" | "published" | "archived";
  scoring: { preset: "points" | "icpc" | "codeforces_dynamic"; version: string };
  rows: ContestStandingRow[];
};

export class ContestSubmissionError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code);
    this.name = "ContestSubmissionError";
  }
}

/** Read only the gateway's public, freeze-masked standings projection. The
 * gateway remains authoritative for ranking, scoring and freeze visibility. */
export async function getPublicContestStandings(contestId: string): Promise<PublicContestStandings> {
  if (!isUuid(contestId)) throw new ContestSubmissionError(400, "INVALID_CONTEST_ID");
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/contests/${contestId}/standings`, url), {
      method: "GET", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: { Accept: "application/json" },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(7000),
    });
    const payload = await boundedJson(response, 2 * 1024 * 1024);
    if (response.status !== 200 || !isPublicContestStandings(payload, contestId)) {
      if (response.status === 200) throw new ContestSubmissionError(502, "INVALID_AUTHORITY_RESPONSE");
      throw gatewayError(response.status, payload);
    }
    const body = payload as Record<string, unknown>;
    const standings = body.standings as Record<string, unknown>;
    return {
      state: body.state as PublicContestStandings["state"],
      scoring: standings.scoring as PublicContestStandings["scoring"],
      rows: (standings.rows as Record<string, unknown>[]).map((row) => ({
        rank: row.rank as number,
        participant: row.participant as string,
        solved: row.solved as number,
        points: row.points as number,
        penalty_minutes: row.penalty_minutes as number,
        hidden_activity: row.hidden_activity as boolean,
        problems: Object.fromEntries(Object.entries(row.problems as Record<string, Record<string, unknown>>)
          .map(([problemId, problem]) => [problemId, {
            solved: problem.solved as boolean,
            points: problem.points as number,
            penalty_minutes: problem.penalty_minutes as number | null,
            best_score_achieved_at_seconds: problem.best_score_achieved_at_seconds as number | null,
          }])),
      })),
    };
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/** Fetch problem statements and public samples only after verifying the
 * current server-owned lease. The response contains no judge package data. */
export async function getAdmittedContestProblems(args: {
  contestId: string;
  accessToken: string;
  admission: ContestAdmissionLease;
}): Promise<ParticipantContestProblem[]> {
  if (!isUuid(args.contestId) || !args.accessToken || !isUuid(args.admission.session_id) ||
      !isUuid(args.admission.device_id) || !Number.isSafeInteger(args.admission.device_epoch) ||
      args.admission.device_epoch < 1 || args.admission.lease_token.length < 32 ||
      args.admission.lease_token.length > 4096 || /\s/.test(args.admission.lease_token)) {
    throw new ContestSubmissionError(400, "INVALID_ADMISSION");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/contests/${args.contestId}/problems`, url), {
      method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: args.admission.session_id,
        lease_token: args.admission.lease_token,
        device_id: args.admission.device_id,
        device_epoch: args.admission.device_epoch,
      }),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(7000),
    });
    const payload = await boundedJson(response, 2 * 1024 * 1024);
    if (response.status !== 200) throw gatewayError(response.status, payload);
    const body = asRecord(payload);
    if (!body || !onlyKeys(body, ["contest_id", "items"]) ||
        typeof body.contest_id !== "string" || body.contest_id.toLowerCase() !== args.contestId.toLowerCase() ||
        !Array.isArray(body.items) || body.items.length > 256 || !body.items.every(isParticipantProblem)) {
      throw new ContestSubmissionError(502, "INVALID_AUTHORITY_RESPONSE");
    }
    return body.items as ParticipantContestProblem[];
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256 = /^[a-f0-9]{64}$/;
const VERDICTS = new Set(["AC", "WA", "CE", "RE", "TLE", "MLE", "OLE", "CANCELED"]);
const REASONS = new Set([
  "ACCEPTED_OUTPUT_MATCH", "WRONG_ANSWER", "COMPILE_FAILED", "RUNTIME_ERROR",
  "TIME_LIMIT", "MEMORY_LIMIT", "OUTPUT_LIMIT", "CANCELED",
]);
const MAX_RESPONSE_BYTES = 64 * 1024;

/** Create once for a submission attempt and reuse unchanged for network retries. */
export function newContestIdempotencyKey(): string {
  return crypto.randomUUID();
}

/** Recover the lease created when the installed native launcher completed the
 * exact one-use pairing challenge. Gateway identity and row binding checks are
 * authoritative; browser-supplied Origin alone never creates admission. */
export async function recoverContestPairingAdmission(args: {
  requestId: string;
  contestId: string;
  accessToken: string;
  policyRevision: number;
  policyDigest: string;
}): Promise<ContestAdmissionLease & { contest_id: string }> {
  if (!isUuid(args.requestId) || !isUuid(args.contestId) || !args.accessToken ||
      !Number.isSafeInteger(args.policyRevision) || args.policyRevision < 1 || !SHA256.test(args.policyDigest)) {
    throw new ContestSubmissionError(400, "INVALID_ADMISSION_RECOVERY");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/runtime/pairing/${args.requestId}/admission`, url), {
      method: "GET", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: { Authorization: `Bearer ${args.accessToken}`, "X-Mindflare-Client": "web", Accept: "application/json" },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000),
    });
    const payload = asRecord(await boundedJson(response));
    if (response.status !== 200 || !payload ||
        !onlyKeys(payload, ["contest_id", "session_id", "lease_token", "device_id", "device_epoch", "expires_at", "policy_digest", "policy_revision", "replayed"]) ||
        typeof payload.contest_id !== "string" || payload.contest_id.toLowerCase() !== args.contestId.toLowerCase() ||
        !isUuid(payload.session_id) || !isUuid(payload.device_id) ||
        typeof payload.lease_token !== "string" || payload.lease_token.length < 32 || payload.lease_token.length > 4096 || /\s/.test(payload.lease_token) ||
        !Number.isSafeInteger(payload.device_epoch) || Number(payload.device_epoch) < 1 ||
        !isDateTime(payload.expires_at) || Date.parse(payload.expires_at) <= Date.now() ||
        payload.policy_digest !== args.policyDigest || payload.policy_revision !== args.policyRevision || typeof payload.replayed !== "boolean") {
      throw gatewayError(response.status, payload);
    }
    return payload as unknown as ContestAdmissionLease & { contest_id: string };
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/** Require the browser's Clerk-authenticated recovery receipt to be the same
 * lease already held by the paired launcher. The local response alone cannot
 * prove that the currently signed-in browser user created the pairing ticket.
 */
export function requireMatchingPairingAdmission(
  contestId: string,
  local: ContestAdmissionLease,
  authenticated: ContestAdmissionLease & { contest_id: string },
): ContestAdmissionLease & { contest_id: string } {
  if (!isUuid(contestId) || authenticated.contest_id.toLowerCase() !== contestId.toLowerCase() ||
      local.session_id !== authenticated.session_id || local.lease_token !== authenticated.lease_token ||
      local.device_id !== authenticated.device_id || local.device_epoch !== authenticated.device_epoch ||
      local.expires_at !== authenticated.expires_at || local.policy_digest !== authenticated.policy_digest ||
      local.policy_revision !== authenticated.policy_revision) {
    throw new ContestSubmissionError(403, "PAIRING_ACCOUNT_MISMATCH");
  }
  return authenticated;
}

/** Renew the server-owned lease while the authenticated exam website is open.
 * The gateway still validates the JWT, device epoch, lease digest, and contest state. */
export async function heartbeatContestAdmission(args: {
  contestId: string;
  accessToken: string;
  admission: ContestAdmissionLease;
}): Promise<ContestAdmissionLease> {
  const admission = args.admission;
  if (!isUuid(args.contestId) || !args.accessToken || !isUuid(admission.session_id) ||
      !isUuid(admission.device_id) || !Number.isSafeInteger(admission.device_epoch) || admission.device_epoch < 1 ||
      admission.lease_token.length < 32 || admission.lease_token.length > 4096 || /\s/.test(admission.lease_token)) {
    throw new ContestSubmissionError(400, "INVALID_ADMISSION");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/contests/${args.contestId}/heartbeat`, url), {
      method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: admission.session_id,
        lease_token: admission.lease_token,
        device_id: admission.device_id,
        device_epoch: admission.device_epoch,
      }),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000),
    });
    const payload = asRecord(await boundedJson(response));
    if (response.status !== 200 || !payload || !isUuid(payload.session_id) ||
        payload.session_id.toLowerCase() !== admission.session_id.toLowerCase() ||
        !isDateTime(payload.expires_at) || Date.parse(payload.expires_at) <= Date.now() ||
        payload.device_epoch !== admission.device_epoch || payload.lease_valid !== true) {
      throw gatewayError(response.status, payload);
    }
    return { ...admission, expires_at: payload.expires_at };
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/** End the server session with the authenticated exam identity. A lost
 * response can be retried with the same lease and returns the original time. */
export async function completeContestAdmission(args: {
  contestId: string;
  accessToken: string;
  admission: ContestAdmissionLease;
}): Promise<ContestCompletionReceipt> {
  const admission = args.admission;
  if (!isUuid(args.contestId) || !args.accessToken || !isUuid(admission.session_id) ||
      !isUuid(admission.device_id) || !Number.isSafeInteger(admission.device_epoch) || admission.device_epoch < 1 ||
      admission.lease_token.length < 32 || admission.lease_token.length > 4096 || /\s/.test(admission.lease_token)) {
    throw new ContestSubmissionError(400, "INVALID_ADMISSION");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/contests/${args.contestId}/complete`, url), {
      method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: admission.session_id,
        lease_token: admission.lease_token,
        device_id: admission.device_id,
        device_epoch: admission.device_epoch,
      }),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000),
    });
    const payload = asRecord(await boundedJson(response));
    if (response.status !== 200) throw gatewayError(response.status, payload);
    if (!payload || !onlyKeys(payload, ["session_id", "completed_at", "completed", "replayed"]) ||
        !isUuid(payload.session_id) || payload.session_id.toLowerCase() !== admission.session_id.toLowerCase() ||
        !isDateTime(payload.completed_at) || payload.completed !== true || typeof payload.replayed !== "boolean") {
      throw new ContestSubmissionError(502, "INVALID_AUTHORITY_RESPONSE");
    }
    return payload as ContestCompletionReceipt;
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/** Send source directly from the browser to the cloud gateway. No verdict is sent. */
export async function submitContestSource(args: {
  contestId: string;
  idempotencyKey: string;
  accessToken: string;
  submission: ContestSubmissionInput;
}): Promise<ContestSubmissionReceipt> {
  if (!isUuid(args.contestId) || !isUuid(args.idempotencyKey) || !args.accessToken ||
      !isUuid(args.submission.session_id) || !isUuid(args.submission.device_id) || !isUuid(args.submission.problem_id) ||
      !Number.isSafeInteger(args.submission.device_epoch) || args.submission.device_epoch < 1 ||
      args.submission.lease_token.length < 32 || args.submission.lease_token.length > 4096 ||
      /\s/.test(args.submission.lease_token) || args.submission.source.length === 0 ||
      args.submission.source.includes("\0") || new TextEncoder().encode(args.submission.source).byteLength > 200_000) {
    throw new ContestSubmissionError(400, "INVALID_SUBMISSION");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");

  try {
    const response = await fetch(new URL(`/v1/contests/${args.contestId}/submissions`, url), {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        "Idempotency-Key": args.idempotencyKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(args.submission),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    const payload = await boundedJson(response);
    if (response.status === 201 && isReceipt(payload, args.idempotencyKey)) return payload;
    throw gatewayError(response.status, payload);
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/** Fetches the most recent owner-scoped, source-free server submission history. */
export async function getContestSubmissionHistory(args: {
  contestId: string;
  accessToken: string;
  cursor?: ContestSubmissionHistoryCursor | null;
}): Promise<ContestSubmissionHistoryPage> {
  if (!isUuid(args.contestId) || !args.accessToken) {
    throw new ContestSubmissionError(400, "INVALID_CONTEST");
  }
  if (args.cursor && (!isUuid(args.cursor.submission_id) || !isDateTime(args.cursor.accepted_at))) {
    throw new ContestSubmissionError(400, "INVALID_HISTORY_CURSOR");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const historyUrl = new URL(`/v1/contests/${args.contestId}/submissions/history`, url);
    if (args.cursor) {
      historyUrl.searchParams.set("before_at", args.cursor.accepted_at);
      historyUrl.searchParams.set("before_id", args.cursor.submission_id);
    }
    const response = await fetch(historyUrl, {
      method: "GET", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        Accept: "application/json",
      },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(7000),
    });
    const payload = await boundedJson(response);
    const body = asRecord(payload);
    if (response.status !== 200 || !body || !onlyKeys(body, ["items", "next_cursor"]) ||
        !Array.isArray(body.items) || body.items.length > 50 || !body.items.every(isHistoryItem) ||
        !(body.next_cursor === null || isHistoryCursor(body.next_cursor))) {
      throw gatewayError(response.status, payload);
    }
    return body as unknown as ContestSubmissionHistoryPage;
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

/**
 * Fallback for platforms where the local sandbox cannot execute. The gateway
 * loads the selected problem's public samples from its own records and sends
 * source to a separate isolated worker; no official submission or verdict is
 * created by this path.
 */
export async function runContestPublicSamplesOnServer(args: {
  contestId: string;
  problemId: string;
  accessToken: string;
  admission: ContestAdmissionLease;
  language: ContestSubmissionInput["language"];
  source: string;
}): Promise<ContestSampleRunResult[]> {
  const { admission } = args;
  if (!isUuid(args.contestId) || !isUuid(args.problemId) || !args.accessToken ||
      !isUuid(admission.session_id) || !isUuid(admission.device_id) ||
      !Number.isSafeInteger(admission.device_epoch) || admission.device_epoch < 1 ||
      admission.lease_token.length < 32 || admission.lease_token.length > 4096 || /\s/.test(admission.lease_token) ||
      args.source.length === 0 || new TextEncoder().encode(args.source).byteLength > 192 * 1024 ||
      !["cpp17", "cpp20", "java", "python", "javascript"].includes(args.language)) {
    throw new ContestSubmissionError(400, "INVALID_SAMPLE_RUN");
  }
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "SAMPLE_RUNNER_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/contests/${args.contestId}/sample-run`, url), {
      method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "X-Mindflare-Client": "web",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        session_id: admission.session_id,
        lease_token: admission.lease_token,
        device_id: admission.device_id,
        device_epoch: admission.device_epoch,
        problem_id: args.problemId,
        language: args.language,
        source: args.source,
      }),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(35_000),
    });
    const payload = await boundedJson(response, 1_500 * 1024);
    const body = asRecord(payload);
    if (response.status !== 200 || !body || !onlyKeys(body, ["official", "cases"]) ||
        body.official !== false || !Array.isArray(body.cases) || body.cases.length < 1 || body.cases.length > 5 ||
        !body.cases.every(isContestSampleRunResult)) {
      throw gatewayError(response.status, payload);
    }
    return body.cases as ContestSampleRunResult[];
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "SAMPLE_RUNNER_UNAVAILABLE");
  }
}

/** Poll the source-free owner-scoped status endpoint. */
export async function getContestSubmissionStatus(args: {
  submissionId: string;
  accessToken: string;
}): Promise<ContestSubmissionStatus> {
  if (!isUuid(args.submissionId) || !args.accessToken) throw new ContestSubmissionError(400, "INVALID_SUBMISSION_ID");
  const url = gatewayUrl();
  if (!url) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  try {
    const response = await fetch(new URL(`/v1/submissions/${args.submissionId}`, url), {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      headers: { Authorization: `Bearer ${args.accessToken}`, "X-Mindflare-Client": "web", Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5_000),
    });
    const payload = await boundedJson(response);
    if (response.status === 200 && isStatus(payload, args.submissionId)) return payload;
    throw gatewayError(response.status, payload);
  } catch (error) {
    if (error instanceof ContestSubmissionError) throw error;
    throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

async function boundedJson(response: Response, maxBytes = MAX_RESPONSE_BYTES): Promise<unknown> {
  if (!response.body) return null;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > maxBytes) throw new ContestSubmissionError(502, "INVALID_AUTHORITY_RESPONSE");
      chunks.push(next.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(concat(chunks, size))) as unknown;
  } catch {
    return null;
  }
}

function isPublicContestStandings(value: unknown, contestId: string): boolean {
  const body = asRecord(value);
  if (!body || !onlyKeys(body, [
    "contest_id", "contest_name", "state", "view", "published_revision", "snapshot_sha256",
    "signature", "standings", "standings_freeze_override",
  ]) || typeof body.contest_id !== "string" || body.contest_id.toLowerCase() !== contestId.toLowerCase() ||
      typeof body.contest_name !== "string" || body.contest_name.length > 160 || body.view !== "public" ||
      !["active", "paused", "finalizing", "review", "published", "archived"].includes(String(body.state)) ||
      (body.published_revision !== undefined && (!Number.isSafeInteger(body.published_revision) || Number(body.published_revision) < 1)) ||
      (body.snapshot_sha256 !== undefined && (typeof body.snapshot_sha256 !== "string" || !SHA256.test(body.snapshot_sha256))) ||
      (body.signature !== undefined && !isPublicStandingsSignature(body.signature)) ||
      (body.standings_freeze_override !== undefined && body.standings_freeze_override !== null)) {
    return false;
  }
  const standings = asRecord(body.standings);
  if (!standings || !onlyKeys(standings, ["schema_version", "scoring", "freeze_at_seconds", "rows"]) ||
      standings.schema_version !== 1 || !isPublicScoringPolicy(standings.scoring) ||
      (standings.freeze_at_seconds !== undefined && standings.freeze_at_seconds !== null &&
        (!Number.isSafeInteger(standings.freeze_at_seconds) || Number(standings.freeze_at_seconds) < 0)) ||
      !Array.isArray(standings.rows) || standings.rows.length > 10_000 ||
      !standings.rows.every(isPublicStandingRow)) {
    return false;
  }
  return true;
}

function isPublicScoringPolicy(value: unknown): boolean {
  const policy = asRecord(value);
  if (!policy || typeof policy.preset !== "string" || typeof policy.version !== "string") return false;
  if (policy.preset === "points") {
    return onlyKeys(policy, ["preset", "version"]) && policy.version === "points-v1";
  }
  if (policy.preset === "codeforces_dynamic") {
    return onlyKeys(policy, ["preset", "version"]) && policy.version === "codeforces-dynamic-v1";
  }
  return policy.preset === "icpc" && onlyKeys(policy, [
    "preset", "version", "wrong_attempt_penalty_minutes", "compilation_error_policy",
  ]) && policy.version === "icpc-v1" && Number.isSafeInteger(policy.wrong_attempt_penalty_minutes) &&
    Number(policy.wrong_attempt_penalty_minutes) >= 1 && Number(policy.wrong_attempt_penalty_minutes) <= 120 &&
    ["ignore", "count_as_incorrect"].includes(String(policy.compilation_error_policy));
}

function isPublicStandingRow(value: unknown): value is Record<string, unknown> {
  const row = asRecord(value);
  if (!row || !onlyKeys(row, ["rank", "participant", "solved", "points", "penalty_minutes", "hidden_activity", "problems"]) ||
      !isNonnegativeSafeInteger(row.rank) || row.rank < 1 || typeof row.participant !== "string" ||
      row.participant.length < 1 || row.participant.length > 160 || !isNonnegativeSafeInteger(row.solved) ||
      !isNonnegativeSafeInteger(row.points) || !isNonnegativeSafeInteger(row.penalty_minutes) ||
      typeof row.hidden_activity !== "boolean") {
    return false;
  }
  const problems = asRecord(row.problems);
  return !!problems && Object.keys(problems).length <= 256 && Object.entries(problems).every(([problemId, value]) => {
    const problem = asRecord(value);
    return isUuid(problemId) && !!problem && onlyKeys(problem, [
      "solved", "points", "penalty_minutes", "best_score_achieved_at_seconds",
    ]) && typeof problem.solved === "boolean" && isNonnegativeSafeInteger(problem.points) &&
      (problem.penalty_minutes === null || isNonnegativeSafeInteger(problem.penalty_minutes)) &&
      (problem.best_score_achieved_at_seconds === null ||
        isNonnegativeSafeInteger(problem.best_score_achieved_at_seconds));
  });
}

function isPublicStandingsSignature(value: unknown): boolean {
  const signature = asRecord(value);
  return !!signature && onlyKeys(signature, ["algorithm", "key_id", "value"]) &&
    signature.algorithm === "Ed25519" && typeof signature.key_id === "string" &&
    /^[A-Za-z0-9._-]{1,128}$/.test(signature.key_id) && typeof signature.value === "string" &&
    /^[A-Za-z0-9+/]{86}==$/.test(signature.value);
}

function isNonnegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isParticipantProblem(value: unknown): value is ParticipantContestProblem {
  const problem = asRecord(value);
  return !!problem && onlyKeys(problem, ["problem_id", "ordinal", "title", "statement_markdown", "public_samples"]) &&
    isUuid(problem.problem_id) && Number.isSafeInteger(problem.ordinal) && Number(problem.ordinal) >= 1 &&
    Number(problem.ordinal) <= 256 && typeof problem.title === "string" && problem.title.trim().length > 0 &&
    problem.title.length <= 200 && typeof problem.statement_markdown === "string" &&
    new TextEncoder().encode(problem.statement_markdown).byteLength <= 1_048_576 &&
    Array.isArray(problem.public_samples) && problem.public_samples.length <= 5 &&
    problem.public_samples.every((sample) => {
      const record = asRecord(sample);
      return !!record && onlyKeys(record, ["input", "output"]) &&
        typeof record.input === "string" && new TextEncoder().encode(record.input).byteLength <= 65_536 &&
        typeof record.output === "string" && new TextEncoder().encode(record.output).byteLength <= 65_536;
    });
}

function gatewayUrl(): URL | null {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN || "");
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const developmentLoopback = process.env.NODE_ENV !== "production" &&
      (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]");
    if ((!developmentLoopback && url.protocol !== "https:") || (developmentLoopback && !["http:", "https:"].includes(url.protocol)) ||
        !hostname || url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
        (!developmentLoopback && (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.startsWith("[") || /^\d+(\.\d+){3}$/.test(hostname)))) return null;
    return url;
  } catch {
    return null;
  }
}

function gatewayError(status: number, value: unknown): ContestSubmissionError {
  const body = asRecord(value);
  const code = typeof body?.code === "string" && /^[A-Z0-9_]{1,80}$/.test(body.code)
    ? body.code
    : status >= 500 ? "CONTEST_AUTHORITY_UNAVAILABLE" : "SUBMISSION_REJECTED";
  return new ContestSubmissionError(status, code);
}

function isReceipt(value: unknown, idempotencyKey: string): value is ContestSubmissionReceipt {
  const receipt = asRecord(value);
  return !!receipt && onlyKeys(receipt, ["submission_id", "status", "accepted_at", "source_sha256", "idempotency_key", "verdict", "score"]) &&
    isUuid(receipt.submission_id) && ["queued", "compiling", "running", "judged", "internal_error"].includes(String(receipt.status)) &&
    isDateTime(receipt.accepted_at) && typeof receipt.source_sha256 === "string" && SHA256.test(receipt.source_sha256) &&
    typeof receipt.idempotency_key === "string" && receipt.idempotency_key.toLowerCase() === idempotencyKey.toLowerCase() &&
    (receipt.verdict === undefined || receipt.verdict === null || (typeof receipt.verdict === "string" && VERDICTS.has(receipt.verdict))) &&
    (receipt.score === undefined || receipt.score === null || (typeof receipt.score === "number" && Number.isFinite(receipt.score) && receipt.score >= 0));
}

function isContestSampleRunResult(value: unknown): value is ContestSampleRunResult {
  const result = asRecord(value);
  const durationMs = result?.duration_ms;
  return !!result && onlyKeys(result, ["stdout", "stderr", "exit_code", "compile_exit_code", "sample_matches", "duration_ms"]) &&
    typeof result.stdout === "string" && new TextEncoder().encode(result.stdout).byteLength <= 128 * 1024 &&
    typeof result.stderr === "string" && new TextEncoder().encode(result.stderr).byteLength <= 128 * 1024 &&
    (typeof result.exit_code === "number" || result.exit_code === null) &&
    (typeof result.compile_exit_code === "number" || result.compile_exit_code === null) &&
    typeof durationMs === "number" && Number.isSafeInteger(durationMs) &&
    durationMs >= 0 && durationMs <= 30_000 &&
    typeof result.sample_matches === "boolean";
}

function isStatus(value: unknown, submissionId: string): value is ContestSubmissionStatus {
  const status = asRecord(value);
  return !!status && onlyKeys(status, ["submission_id", "status", "accepted_at", "source_sha256", "idempotency_key", "verdict", "score", "reason"]) &&
    typeof status.submission_id === "string" && status.submission_id.toLowerCase() === submissionId.toLowerCase() &&
    ["queued", "judging", "judged", "internal_error"].includes(String(status.status)) && isDateTime(status.accepted_at) &&
    typeof status.source_sha256 === "string" && SHA256.test(status.source_sha256) && isUuid(status.idempotency_key) &&
    (status.verdict === null || (typeof status.verdict === "string" && VERDICTS.has(status.verdict))) &&
    (status.score === null || (typeof status.score === "number" && Number.isFinite(status.score) && status.score >= 0)) &&
    (status.reason === null || (typeof status.reason === "string" && REASONS.has(status.reason)));
}

function isHistoryItem(value: unknown): value is ContestSubmissionHistoryItem {
  const item = asRecord(value);
  return !!item && onlyKeys(item, [
    "submission_id", "problem_id", "language", "accepted_at", "source_sha256", "idempotency_key",
  ]) && isUuid(item.submission_id) && isUuid(item.problem_id) &&
    ["cpp17", "cpp20", "java", "python", "javascript"].includes(String(item.language)) &&
    isDateTime(item.accepted_at) && typeof item.source_sha256 === "string" && SHA256.test(item.source_sha256) &&
    isUuid(item.idempotency_key);
}

function isHistoryCursor(value: unknown): value is ContestSubmissionHistoryCursor {
  const cursor = asRecord(value);
  return !!cursor && onlyKeys(cursor, ["accepted_at", "submission_id"]) &&
    isDateTime(cursor.accepted_at) && isUuid(cursor.submission_id);
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value) && !/^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(value);
}

function isDateTime(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function onlyKeys(record: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(record).every((key) => keys.includes(key));
}

function concat(chunks: Uint8Array[], size: number): Uint8Array {
  const result = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}
