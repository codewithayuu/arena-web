import assert from "node:assert/strict";
import test from "node:test";
import { dispatchContestLaunchIntent, validateContestLaunchIntent } from "./contest-launch-intent";

const contestId = "11111111-1111-4111-8111-111111111111";
const requestId = "22222222-2222-4222-8222-222222222222";
const now = Date.parse("2026-10-17T12:00:00.000Z");

function response(overrides: Record<string, unknown> = {}) {
  return {
    request_id: requestId,
    contest_id: contestId,
    launch_uri: `mindflare://contest/start?request_id=${requestId}`,
    expires_at: new Date(now + 60_000).toISOString(),
    ...overrides,
  };
}

test("accepts only a fresh server intent for the exact contest and launcher URI", () => {
  assert.deepEqual(validateContestLaunchIntent(response(), contestId, now), {
    requestId,
    launchUri: `mindflare://contest/start?request_id=${requestId}`,
    expiresAt: now + 60_000,
  });
  assert.equal(validateContestLaunchIntent(response({ contest_id: "33333333-3333-4333-8333-333333333333" }), contestId, now), null);
  assert.equal(validateContestLaunchIntent(response({ launch_uri: "https://attacker.example" }), contestId, now), null);
  assert.equal(validateContestLaunchIntent(response({ expires_at: new Date(now).toISOString() }), contestId, now), null);
});

test("external launch dispatch runs synchronously only while the intent is fresh", () => {
  const intent = validateContestLaunchIntent(response(), contestId, now);
  assert.ok(intent);
  const dispatched: string[] = [];
  assert.equal(dispatchContestLaunchIntent(intent, now, (uri) => dispatched.push(uri)), true);
  assert.deepEqual(dispatched, [intent.launchUri]);
  assert.equal(dispatchContestLaunchIntent(intent, intent.expiresAt, (uri) => dispatched.push(uri)), false);
  assert.equal(dispatched.length, 1);
});
