import assert from "node:assert/strict";
import test from "node:test";
import { watchContestHeartbeat } from "@/lib/contest-heartbeat";
import { ContestSubmissionError, type ContestAdmissionLease } from "@/lib/contest-submissions";

const lease: ContestAdmissionLease = {
  session_id: "original-session", lease_token: "synthetic-lease", device_id: "original-device",
  device_epoch: 2, expires_at: "2099-01-01T00:00:00Z", policy_digest: "a".repeat(64),
  policy_revision: 1, replayed: false,
};
function harness(renew: () => Promise<ContestAdmissionLease>) {
  let tick = () => {};
  let cancelled = 0;
  const events: Array<string | ContestAdmissionLease> = [];
  const stop = watchContestHeartbeat({ renew,
    onRenewed: value => events.push(value),
    onUnavailable: () => events.push("unavailable"),
    onRejected: () => events.push("rejected"),
    onCompleted: () => events.push("completed"),
  }, callback => { tick = callback; return () => { cancelled++; }; });
  return { events, stop, tick: async () => { tick(); await new Promise(setImmediate); },
    cancellationCount: () => cancelled };
}

test("a transient failure retries the original lease without inventing expiry or admission", async () => {
  let calls = 0;
  const h = harness(async () => {
    calls++;
    if (calls === 1) throw new ContestSubmissionError(503, "CONTEST_AUTHORITY_UNAVAILABLE");
    return lease;
  });
  await h.tick();
  assert.deepEqual(h.events, ["unavailable"]);
  assert.equal(h.cancellationCount(), 0);
  await h.tick();
  assert.deepEqual(h.events, ["unavailable", lease]);
  assert.equal(calls, 2);
  h.stop();
});

test("network and rate-limit errors remain paused/retryable, not completed or revoked", async () => {
  for (const error of [new Error("offline"), new ContestSubmissionError(429, "RATE_LIMITED"),
    new ContestSubmissionError(503, "CONTEST_COMPLETED")]) {
    const h = harness(async () => { throw error; });
    await h.tick();
    assert.deepEqual(h.events, ["unavailable"]);
    assert.equal(h.cancellationCount(), 0);
    h.stop();
  }
});

test("only the exact authoritative completed response triggers terminal completion once", async () => {
  let calls = 0;
  const h = harness(async () => { calls++; throw new ContestSubmissionError(410, "CONTEST_COMPLETED"); });
  await h.tick();
  await h.tick();
  assert.deepEqual(h.events, ["completed"]);
  assert.equal(calls, 1);
  assert.equal(h.cancellationCount(), 1);
});

test("expired or revoked authorization stops renewal and never silently readmits", async () => {
  for (const [status, code] of [[401, "INVALID_TOKEN"], [403, "FORBIDDEN"], [410, "UNKNOWN"]] as const) {
    let calls = 0;
    const h = harness(async () => { calls++; throw new ContestSubmissionError(status, code); });
    await h.tick();
    await h.tick();
    assert.deepEqual(h.events, ["rejected"]);
    assert.equal(calls, 1);
    assert.equal(h.cancellationCount(), 1);
  }
});

test("slow renewals never overlap and stale results cannot restore a stopped view", async () => {
  let resolve: (value: ContestAdmissionLease) => void = () => {};
  const pending = new Promise<ContestAdmissionLease>(done => { resolve = done; });
  let calls = 0;
  const h = harness(() => { calls++; return pending; });
  await h.tick();
  await h.tick();
  assert.equal(calls, 1);
  h.stop();
  resolve(lease);
  await h.tick();
  assert.deepEqual(h.events, []);
});

test("a rejected in-flight renewal cannot complete or revoke a stopped view", async () => {
  let reject: (error: Error) => void = () => {};
  const pending = new Promise<ContestAdmissionLease>((_done, fail) => { reject = fail; });
  const h = harness(() => pending);
  await h.tick();
  h.stop();
  reject(new ContestSubmissionError(410, "CONTEST_COMPLETED"));
  await h.tick();
  assert.deepEqual(h.events, []);
});
