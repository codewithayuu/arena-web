import { isBoundedContestSource } from "./contest-drafts";
import type { ContestSubmissionHistoryItem, ContestSubmissionInput } from "./contest-submissions";

/** Same browser-profile lifetime as editor drafts; never store auth/lease tokens. */
export type PendingContestSubmission = {
  idempotencyKey: string;
  sessionId: string;
  problemId: string;
  language: ContestSubmissionInput["language"];
  source: string;
};
type RecoveryStorage = Pick<Storage, "getItem" | "setItem">;
export type SubmissionRecovery =
  | { state: "ready"; pending: PendingContestSubmission | null }
  | { state: "unavailable" | "invalid"; pending: null };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LANGUAGES = new Set(["cpp17", "cpp20", "java", "python", "javascript"]);
const FIELDS = new Set(["idempotencyKey", "sessionId", "problemId", "language", "source"]);

export function readSubmissionRecovery(storage: RecoveryStorage | null, key: string): SubmissionRecovery {
  if (!storage) return { state: "unavailable", pending: null };
  try {
    const raw = storage.getItem(key);
    if (raw === null || raw === "null") return { state: "ready", pending: null };
    if (raw.length > 1_300_000) return { state: "invalid", pending: null };
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return { state: "invalid", pending: null };
    const record = value as Record<string, unknown>;
    if (Object.keys(record).length !== FIELDS.size || Object.keys(record).some((field) => !FIELDS.has(field)) ||
        ![record.idempotencyKey, record.sessionId, record.problemId].every((id) => typeof id === "string" && UUID.test(id)) ||
        typeof record.language !== "string" || !LANGUAGES.has(record.language) ||
        typeof record.source !== "string" || !record.source || record.source.includes("\0") || !isBoundedContestSource(record.source)) {
      return { state: "invalid", pending: null };
    }
    return { state: "ready", pending: record as PendingContestSubmission };
  } catch {
    // Do not erase an unreadable attempt and silently create a new retry key.
    return { state: "unavailable", pending: null };
  }
}

function serialize(attempt: PendingContestSubmission): string {
  return JSON.stringify({ idempotencyKey: attempt.idempotencyKey, sessionId: attempt.sessionId,
    problemId: attempt.problemId, language: attempt.language, source: attempt.source });
}

export function persistSubmissionAttempt(storage: RecoveryStorage | null, key: string, attempt: PendingContestSubmission): boolean {
  if (!storage) return false;
  try {
    const existing = readSubmissionRecovery(storage, key);
    if (existing.state !== "ready" || (existing.pending && serialize(existing.pending) !== serialize(attempt))) return false;
    const serialized = serialize(attempt);
    // Validate the exact credential-free representation before any network send.
    if (readSubmissionRecovery({ getItem: () => serialized, setItem: () => undefined }, key).state !== "ready") return false;
    storage.setItem(key, serialized);
    return storage.getItem(key) === serialized;
  } catch { return false; }
}

/** Only call after an authenticated server receipt, history match, or an
 * explicit not-accepted response. A transport error is never confirmation. */
export function clearConfirmedSubmission(storage: RecoveryStorage | null, key: string, attempt: PendingContestSubmission): boolean {
  if (!storage) return false;
  try {
    const current = readSubmissionRecovery(storage, key);
    if (current.state !== "ready") return false;
    if (!current.pending) return true;
    if (serialize(current.pending) !== serialize(attempt)) return false;
    storage.setItem(key, "null");
    return storage.getItem(key) === "null";
  } catch { return false; }
}

export async function findConfirmedSubmission(attempt: PendingContestSubmission, history: ContestSubmissionHistoryItem[]): Promise<ContestSubmissionHistoryItem | null> {
  const candidate = history.find((item) => item.idempotency_key === attempt.idempotencyKey &&
    item.problem_id === attempt.problemId && item.language === attempt.language);
  if (!candidate) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(attempt.source));
  const hex = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return candidate.source_sha256 === hex ? candidate : null;
}
