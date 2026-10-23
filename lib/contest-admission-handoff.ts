import type { AdmissionHandoff } from "./runtime-bridge";

const KEY_PREFIX = "mindflare:contest-admission-pending:v1:";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SHA256 = /^[a-f0-9]{64}$/;

export interface ContestHandoffStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type ContestHandoffPolicy = { revision: number; digest: string };

function storageKey(contestId: string): string {
  return `${KEY_PREFIX}${contestId}`;
}

/** Stores replay metadata only; the admission lease token is never persisted. */
export function storeContestAdmissionHandoff(
  storage: ContestHandoffStorage | null,
  contestId: string,
  handoff: AdmissionHandoff,
  now = Date.now(),
): boolean {
  if (!storage || !isUuid(contestId) || !validHandoff(handoff) || !Number.isSafeInteger(now)) return false;
  try {
    storage.setItem(storageKey(contestId), JSON.stringify({ handoff, createdAt: now }));
    return true;
  } catch {
    return false;
  }
}

/** The gateway decides whether this exact idempotent request still has an active lease. */
export function loadContestAdmissionHandoff(
  storage: ContestHandoffStorage | null,
  contestId: string,
  policy: ContestHandoffPolicy,
  now = Date.now(),
): AdmissionHandoff | null {
  if (!storage || !isUuid(contestId) || !Number.isSafeInteger(policy.revision) ||
      policy.revision < 1 || !SHA256.test(policy.digest)) return null;
  let raw: string | null;
  try {
    raw = storage.getItem(storageKey(contestId));
  } catch {
    return null;
  }
  if (!raw) return null;
  try {
    const stored = JSON.parse(raw) as { handoff?: unknown; createdAt?: unknown };
    const value = stored.handoff;
    if (validHandoff(value) && value.policy_revision === policy.revision &&
        value.policy_digest === policy.digest && Number.isSafeInteger(stored.createdAt) &&
        Number(stored.createdAt) <= now) return value;
  } catch { /* discard malformed tab-local state */ }
  clearContestAdmissionHandoff(storage, contestId);
  return null;
}

export function clearContestAdmissionHandoff(
  storage: ContestHandoffStorage | null,
  contestId: string,
): void {
  if (!storage || !isUuid(contestId)) return;
  try {
    storage.removeItem(storageKey(contestId));
  } catch {
    // Storage can be disabled by the browser or SEB profile policy.
  }
}

function validHandoff(value: unknown): value is AdmissionHandoff {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  if (Object.keys(value).sort().join(",") !==
      "challenge_id,device_id,idempotency_key,policy_digest,policy_revision") return false;
  const handoff = value as Partial<AdmissionHandoff>;
  return isUuid(handoff.challenge_id) && isUuid(handoff.device_id) &&
    isUuid(handoff.idempotency_key) && Number.isSafeInteger(handoff.policy_revision) &&
    Number(handoff.policy_revision) > 0 && typeof handoff.policy_digest === "string" &&
    SHA256.test(handoff.policy_digest);
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID.test(value) &&
    !/^0{8}-0{4}-0{4}-0{4}-0{12}$/i.test(value);
}
