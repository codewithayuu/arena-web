import assert from "node:assert/strict";
import test from "node:test";
import {
  clearConfirmedSubmission, findConfirmedSubmission, persistSubmissionAttempt,
  readSubmissionRecovery, type PendingContestSubmission,
} from "./contest-submission-recovery";

const attempt: PendingContestSubmission = {
  idempotencyKey: "11111111-1111-4111-8111-111111111111",
  sessionId: "22222222-2222-4222-8222-222222222222",
  problemId: "33333333-3333-4333-8333-333333333333",
  language: "python", source: "print('hello')\n",
};
class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

test("reload recovers exact pending source/key/session without credentials and isolates storage scopes", () => {
  const storage = new MemoryStorage();
  assert.equal(persistSubmissionAttempt(storage, "user1:contest1", { ...attempt, lease_token: "never persist" } as PendingContestSubmission), true);
  assert.deepEqual(readSubmissionRecovery(storage, "user1:contest1"), { state: "ready", pending: attempt });
  assert.deepEqual(readSubmissionRecovery(storage, "user2:contest1"), { state: "ready", pending: null });
  assert.deepEqual(readSubmissionRecovery(storage, "user1:contest2"), { state: "ready", pending: null });
  assert.ok(!storage.getItem("user1:contest1")!.includes("never persist"));
});

test("an unresolved key cannot be silently replaced by a different attempt or session", () => {
  const storage = new MemoryStorage();
  assert.equal(persistSubmissionAttempt(storage, "scope", attempt), true);
  for (const different of [{ ...attempt, source: "different" }, { ...attempt, language: "java" as const },
    { ...attempt, sessionId: attempt.problemId }, { ...attempt, idempotencyKey: attempt.problemId }]) {
    assert.equal(persistSubmissionAttempt(storage, "scope", different), false);
    assert.equal(clearConfirmedSubmission(storage, "scope", different), false);
  }
  assert.deepEqual(readSubmissionRecovery(storage, "scope").pending, attempt);
  assert.equal(persistSubmissionAttempt(storage, "scope", attempt), true);
});

test("receipt confirmation clears only the exact original attempt and permits the next attempt", () => {
  const storage = new MemoryStorage();
  persistSubmissionAttempt(storage, "scope", attempt);
  assert.equal(clearConfirmedSubmission(storage, "scope", attempt), true);
  assert.deepEqual(readSubmissionRecovery(storage, "scope"), { state: "ready", pending: null });
  assert.equal(persistSubmissionAttempt(storage, "scope", { ...attempt, idempotencyKey: attempt.problemId }), true);
});

test("invalid/oversized recovery data is not overwritten or treated as an empty journal", () => {
  const storage = new MemoryStorage();
  for (const value of ["[]", "{}", "not json", "x".repeat(1_300_001),
    JSON.stringify({ ...attempt, language: "shell" }), JSON.stringify({ ...attempt, source: "\0" }),
    JSON.stringify({ ...attempt, source: "é".repeat(100_001) }),
    JSON.stringify({ ...attempt, lease_token: "forbidden" })]) {
    storage.setItem("scope", value);
    assert.notEqual(readSubmissionRecovery(storage, "scope").state, "ready");
    assert.equal(persistSubmissionAttempt(storage, "scope", attempt), false);
    assert.equal(clearConfirmedSubmission(storage, "scope", attempt), false);
    assert.equal(storage.getItem("scope"), value);
  }
});

test("storage denial, quota and failed readback never claim persistence or cleanup", () => {
  assert.equal(persistSubmissionAttempt(null, "scope", attempt), false);
  assert.equal(clearConfirmedSubmission(null, "scope", attempt), false);
  const denied = { getItem: () => { throw Error("denied"); }, setItem: () => { throw Error("quota"); } };
  assert.equal(readSubmissionRecovery(denied, "scope").state, "unavailable");
  assert.equal(persistSubmissionAttempt(denied, "scope", attempt), false);
  const ignoredWrite = { getItem: () => null, setItem: () => undefined };
  assert.equal(persistSubmissionAttempt(ignoredWrite, "scope", attempt), false);
  const storage = new MemoryStorage();
  persistSubmissionAttempt(storage, "scope", attempt);
  storage.setItem = () => { throw Error("quota"); };
  assert.equal(clearConfirmedSubmission(storage, "scope", attempt), false);
  assert.deepEqual(readSubmissionRecovery(storage, "scope").pending, attempt);
});

test("all four languages and the maximum escaped UTF-8 source round-trip", () => {
  for (const language of ["cpp17", "java", "python", "javascript"] as const) {
    const storage = new MemoryStorage();
    const pending = { ...attempt, language, source: "\u0001".repeat(200_000) };
    assert.equal(persistSubmissionAttempt(storage, "scope", pending), true);
    assert.deepEqual(readSubmissionRecovery(storage, "scope").pending, pending);
  }
});

test("history reconciliation requires matching key, problem, language and exact source hash", async () => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(attempt.source));
  const hash = Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
  const receipt = { submission_id: attempt.problemId, problem_id: attempt.problemId,
    idempotency_key: attempt.idempotencyKey, language: attempt.language,
    source_sha256: hash, accepted_at: "2026-10-19T12:00:00Z" };
  assert.deepEqual(await findConfirmedSubmission(attempt, [receipt]), receipt);
  assert.equal(await findConfirmedSubmission(attempt, []), null);
  for (const mismatch of [{ ...receipt, source_sha256: "f".repeat(64) },
    { ...receipt, problem_id: attempt.sessionId }, { ...receipt, idempotency_key: attempt.sessionId },
    { ...receipt, language: "java" as const }]) {
    assert.equal(await findConfirmedSubmission(attempt, [mismatch]), null);
  }
});
