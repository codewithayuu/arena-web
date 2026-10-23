"use client";

export type ContestPreflightChallenge = {
  challenge_id: string;
  challenge_nonce: string;
  contest_id: string;
  policy_revision: number;
  policy_digest: string;
  issued_at: string;
  expires_at: string;
};

export type ContestPreflightReceipt = {
  preflight_id: string;
  contest_id: string;
  policy_revision: number;
  policy_digest: string;
  challenge_id: string;
  recorded_at: string;
  admission_authorized: false;
  monitoring_consent_id: string | null;
  recording_consent_id: string | null;
  capability_report_id: string;
};

export class ContestPreflightError extends Error {
  constructor(readonly status: number, readonly code: string) {
    super(code);
    this.name = "ContestPreflightError";
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256 = /^[a-f0-9]{64}$/;
const SEMVER = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
const MAX_RESPONSE_BYTES = 32 * 1024;

/** Create a server challenge using the Clerk session active in official SEB. */
export async function issueContestPreflightChallenge(args: {
  contestId: string;
  accessToken: string;
  policyRevision: number;
  policyDigest: string;
}): Promise<ContestPreflightChallenge> {
  if (!isUuid(args.contestId) || !args.accessToken || !Number.isSafeInteger(args.policyRevision) ||
      args.policyRevision < 1 || !SHA256.test(args.policyDigest)) {
    throw new ContestPreflightError(400, "INVALID_PREFLIGHT");
  }
  const payload = asRecord(await requestGateway(args, "challenge", {
    policy_revision: args.policyRevision,
    policy_digest: args.policyDigest,
  }));
  if (!payload || !isUuid(payload.challenge_id) || typeof payload.challenge_nonce !== "string" ||
      !/^[A-Za-z0-9_-]{43,128}$/.test(payload.challenge_nonce) ||
      typeof payload.contest_id !== "string" || payload.contest_id.toLowerCase() !== args.contestId.toLowerCase() ||
      payload.policy_revision !== args.policyRevision || payload.policy_digest !== args.policyDigest ||
      !isDateTime(payload.issued_at) || !isDateTime(payload.expires_at) ||
      Date.parse(payload.expires_at) <= Date.now() || Date.parse(payload.expires_at) - Date.parse(payload.issued_at) > 5 * 60_000) {
    throw new ContestPreflightError(502, "INVALID_AUTHORITY_RESPONSE");
  }
  return payload as ContestPreflightChallenge;
}

/** Persist a truthful bounded capability report. This receipt is not admission. */
export async function consumeContestPreflight(args: {
  contestId: string;
  accessToken: string;
  challenge: ContestPreflightChallenge;
  appVersion: string;
  os: "windows";
  evidence?: Record<string, unknown>;
}): Promise<ContestPreflightReceipt> {
  const challenge = args.challenge;
  if (!isUuid(args.contestId) || !args.accessToken || !SEMVER.test(args.appVersion) || args.appVersion.length > 64 ||
      args.os !== "windows" || !isUuid(challenge.challenge_id) ||
      !/^[A-Za-z0-9_-]{43,128}$/.test(challenge.challenge_nonce) ||
      challenge.contest_id.toLowerCase() !== args.contestId.toLowerCase() ||
      !Number.isSafeInteger(challenge.policy_revision) || challenge.policy_revision < 1 || !SHA256.test(challenge.policy_digest) ||
      Date.parse(challenge.expires_at) <= Date.now()) {
    throw new ContestPreflightError(400, "INVALID_PREFLIGHT");
  }
  const payload = asRecord(await requestGateway(args, "consume", {
    app_version: args.appVersion,
    os: args.os,
    policy_revision: challenge.policy_revision,
    policy_digest: challenge.policy_digest,
    challenge_id: challenge.challenge_id,
    challenge_nonce: challenge.challenge_nonce,
    capabilities: {
      ...(args.evidence ? { official_seb_evidence: args.evidence } : {}),
      native_adapter: "unavailable",
      camera: false,
      microphone: false,
      screen_capture: false,
    },
  }));
  if (!payload || !isUuid(payload.preflight_id) || payload.preflight_id !== challenge.challenge_id ||
      typeof payload.contest_id !== "string" || payload.contest_id.toLowerCase() !== args.contestId.toLowerCase() ||
      payload.challenge_id !== challenge.challenge_id || payload.policy_revision !== challenge.policy_revision ||
      payload.policy_digest !== challenge.policy_digest || !isDateTime(payload.recorded_at) ||
      payload.admission_authorized !== false || !isNullableUuid(payload.monitoring_consent_id) ||
      !isNullableUuid(payload.recording_consent_id) || !isUuid(payload.capability_report_id)) {
    throw new ContestPreflightError(502, "INVALID_AUTHORITY_RESPONSE");
  }
  return payload as ContestPreflightReceipt;
}

async function requestGateway(args: { contestId: string; accessToken: string }, action: "challenge" | "consume", body: unknown): Promise<unknown> {
  const origin = gatewayOrigin();
  if (!origin) throw new ContestPreflightError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  const path = action === "challenge"
    ? `/v1/contests/${args.contestId}/preflight/challenge`
    : `/v1/contests/${args.contestId}/preflight`;
  try {
    const response = await fetch(new URL(path, origin), {
      method: "POST", mode: "cors", credentials: "omit", referrerPolicy: "no-referrer",
      headers: {
        Authorization: `Bearer ${args.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(7000),
    });
    const payload = await boundedJson(response);
    if ((action === "challenge" && response.status === 201) || (action === "consume" && response.status === 200)) return payload;
    const error = asRecord(payload);
    throw new ContestPreflightError(response.status, typeof error?.code === "string" && /^[A-Z0-9_]{1,80}$/.test(error.code)
      ? error.code : "PREFLIGHT_REJECTED");
  } catch (error) {
    if (error instanceof ContestPreflightError) throw error;
    throw new ContestPreflightError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
  }
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw new ContestPreflightError(502, "INVALID_AUTHORITY_RESPONSE");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > MAX_RESPONSE_BYTES) throw new ContestPreflightError(502, "INVALID_AUTHORITY_RESPONSE");
      chunks.push(next.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  try {
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } catch (error) {
    if (error instanceof ContestPreflightError) throw error;
    return null;
  }
}

function gatewayOrigin(): URL | null {
  try {
    const value = new URL(process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN || "");
    const hostname = value.hostname.toLowerCase().replace(/\.$/, "");
    const loopback = process.env.NODE_ENV !== "production" && ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
    if ((!loopback && value.protocol !== "https:") || (loopback && !["http:", "https:"].includes(value.protocol)) ||
        !hostname || value.username || value.password || value.pathname !== "/" || value.search || value.hash ||
        (!loopback && (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.startsWith("[") || /^\d+(\.\d+){3}$/.test(hostname)))) return null;
    return value;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}
function isUuid(value: unknown): value is string { return typeof value === "string" && UUID.test(value) && !/^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(value); }
function isNullableUuid(value: unknown): value is string | null { return value === null || isUuid(value); }
function isDateTime(value: unknown): value is string { return typeof value === "string" && Number.isFinite(Date.parse(value)); }
