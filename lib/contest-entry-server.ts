import { auth } from "@clerk/nextjs/server";
import { isIP } from "node:net";
import {
  parseParticipantContestDirectory,
  parseParticipantContestMetadata,
  type ParticipantContestDirectory,
  type ParticipantContestMetadata,
} from "@/lib/contest-metadata";

const MAX_POLICY_BYTES = 256 * 1024;
const MAX_METADATA_BYTES = 16 * 1024;
const MAX_DIRECTORY_BYTES = 64 * 1024;
const PARTICIPANT_DIRECTORY_LIMIT = 20;
export const CONTEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ContestDetails = {
  startsAt: string;
  endsAt: string;
  revision: number;
  policyDigest: string;
  policyEnvelope: {
    policy: Record<string, unknown>;
    sha256: string;
    signature: string;
    key_id: string;
    algorithm: string;
  };
  languages: string[];
  notice: string | null;
  requiresLockdown: boolean;
  requiredCapture: string[];
};

export type ContestEntry =
  | { state: "signed-out" }
  | { state: "unavailable" }
  | { state: "published"; details: ContestDetails; metadata: ParticipantContestMetadata };

export type ParticipantContestDirectoryEntry =
  | { state: "signed-out" }
  | { state: "unavailable" }
  | { state: "ready"; directory: ParticipantContestDirectory };

function gatewayOrigin(): URL | null {
  try {
    const value = new URL(process.env.MINDFLARE_GATEWAY_ORIGIN || "");
    if (value.protocol !== "https:" || value.username || value.password ||
        value.pathname !== "/" || value.search || value.hash ||
        value.hostname.replace(/\.$/, "") === "localhost" || value.hostname.replace(/\.$/, "").endsWith(".localhost") ||
        value.hostname.startsWith("[") || value.hostname.includes("*") || isIP(value.hostname)) return null;
    return value;
  } catch {
    return null;
  }
}

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

// Display metadata only. This is not native policy verification or admission.
function detailsFromEnvelope(value: unknown, contestId: string): ContestDetails | null {
  const envelope = object(value);
  const policy = object(envelope?.policy);
  const languages = Array.isArray(policy?.languages) ? policy.languages : null;
  if (!policy || policy.contest_id !== contestId || !Number.isInteger(policy.policy_revision) ||
      typeof envelope?.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(envelope.sha256) ||
      typeof envelope.signature !== "string" || envelope.signature.length < 80 || envelope.signature.length > 128 ||
      /\s/.test(envelope.signature) || typeof envelope.key_id !== "string" || !/^[A-Za-z0-9._-]{1,64}$/.test(envelope.key_id) ||
      envelope.algorithm !== "Ed25519" ||
      Number(policy.policy_revision) < 1 || typeof policy.starts_at !== "string" ||
      typeof policy.ends_at !== "string" || !Number.isFinite(Date.parse(policy.starts_at)) ||
      !Number.isFinite(Date.parse(policy.ends_at)) || Date.parse(policy.ends_at) <= Date.parse(policy.starts_at) ||
      !languages || languages.length < 1 || languages.length > 5 ||
      new Set(languages).size !== languages.length ||
      !languages.every((language) => typeof language === "string" && ["cpp17", "cpp20", "java", "python", "javascript"].includes(language))) return null;
  const resourceMultipliers = policy.language_resource_multipliers;
  if (resourceMultipliers !== undefined) {
    const groups = object(resourceMultipliers);
    if (!groups || Object.keys(groups).some((key) => !["cpp", "java", "python", "javascript"].includes(key))) return null;
    for (const [group, raw] of Object.entries(groups)) {
      const configured = object(raw);
      const appliesTo = group === "cpp" ? ["cpp17", "cpp20"] : [group];
      if (!configured || !appliesTo.some((language) => languages.includes(language)) ||
          Object.keys(configured).some((key) => !["time_multiplier", "memory_multiplier"].includes(key))) return null;
      for (const key of ["time_multiplier", "memory_multiplier"]) {
        const multiplier = configured[key];
        if (multiplier !== undefined && (typeof multiplier !== "number" || !Number.isFinite(multiplier) || multiplier < 0.25 || multiplier > 4)) return null;
      }
    }
  }
  const integrity = object(policy.integrity);
  if (!integrity || ["lockdown", "webcam_required", "phone_detection", "microphone", "screen_monitoring",
    "record_video", "record_audio", "record_screen"].some((field) => typeof integrity[field] !== "boolean")) return null;
  const notice = object(integrity.participant_notice)?.body;
  if (notice != null && (typeof notice !== "string" || notice.length > 16_384)) return null;
  const requiredCapture = [
    ...((integrity.webcam_required === true || integrity.phone_detection === true || integrity.record_video === true) ? ["camera"] : []),
    ...((integrity.microphone === true || integrity.record_audio === true) ? ["microphone"] : []),
    ...((integrity.screen_monitoring === true || integrity.record_screen === true) ? ["screen"] : []),
  ];
  return {
    startsAt: policy.starts_at,
    endsAt: policy.ends_at,
    revision: Number(policy.policy_revision),
    policyDigest: envelope.sha256,
    policyEnvelope: value as ContestDetails["policyEnvelope"],
    languages: languages as string[],
    notice: typeof notice === "string" ? notice : null,
    requiresLockdown: integrity.lockdown === true,
    requiredCapture,
  };
}

async function boundedJson(response: Response, maxBytes = MAX_POLICY_BYTES): Promise<unknown> {
  if (!response.body) throw new Error("Missing response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > maxBytes) throw new Error("Response too large");
      chunks.push(next.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

export async function fetchParticipantContestMetadata(
  contestId: string,
  token: string,
): Promise<{ metadata: ParticipantContestMetadata | null; status: number }> {
  if (!CONTEST_ID.test(contestId) || !token) return { metadata: null, status: 400 };
  const origin = gatewayOrigin();
  if (!origin) return { metadata: null, status: 503 };
  try {
    const response = await fetch(new URL(`/v1/contests/${contestId}/metadata`, origin), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return { metadata: null, status: response.status };
    }
    const metadata = parseParticipantContestMetadata(await boundedJson(response, MAX_METADATA_BYTES), contestId);
    if (!metadata || response.headers.get("x-mindflare-server-time") !== metadata.server_time) {
      return { metadata: null, status: 502 };
    }
    return { metadata, status: 200 };
  } catch {
    return { metadata: null, status: 503 };
  }
}

export async function loadParticipantContestDirectory(
  offset: number,
): Promise<ParticipantContestDirectoryEntry> {
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 10_000) return { state: "unavailable" };
  try {
    const session = await auth();
    if (!session.userId) return { state: "signed-out" };
    const token = await session.getToken();
    const origin = gatewayOrigin();
    if (!token || !origin) return { state: "unavailable" };
    const url = new URL("/v1/contests", origin);
    url.searchParams.set("limit", String(PARTICIPANT_DIRECTORY_LIMIT));
    url.searchParams.set("offset", String(offset));
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      await response.body?.cancel();
      return { state: response.status === 401 ? "signed-out" : "unavailable" };
    }
    const directory = parseParticipantContestDirectory(await boundedJson(response, MAX_DIRECTORY_BYTES));
    if (!directory || directory.limit !== PARTICIPANT_DIRECTORY_LIMIT || directory.offset !== offset ||
        response.headers.get("x-mindflare-server-time") !== directory.server_time) return { state: "unavailable" };
    return { state: "ready", directory };
  } catch {
    return { state: "unavailable" };
  }
}

export async function loadContestEntry(contestId: string): Promise<ContestEntry> {
  if (!CONTEST_ID.test(contestId)) return { state: "unavailable" };
  try {
    const session = await auth();
    if (!session.userId) return { state: "signed-out" };
    const origin = gatewayOrigin();
    if (!origin) return { state: "unavailable" };
    const token = await session.getToken();
    if (!token) return { state: "signed-out" };
    const [response, metadataResult] = await Promise.all([
      fetch(new URL(`/v1/contests/${contestId}/policy`, origin), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
      }),
      fetchParticipantContestMetadata(contestId, token),
    ]);
    if (!response.ok) {
      await response.body?.cancel();
      return { state: response.status === 401 ? "signed-out" : "unavailable" };
    }
    if (!metadataResult.metadata) {
      return { state: metadataResult.status === 401 ? "signed-out" : "unavailable" };
    }
    const details = detailsFromEnvelope(await boundedJson(response), contestId);
    return details ? { state: "published", details, metadata: metadataResult.metadata } : { state: "unavailable" };
  } catch {
    // Do not expose identity credentials, API payloads, URLs or raw exceptions.
    return { state: "unavailable" };
  }
}
