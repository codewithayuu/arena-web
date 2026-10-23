import assert from "node:assert/strict";
import test from "node:test";
import { completeContestAdmission, ContestSubmissionError, getContestSubmissionHistory, getPublicContestStandings, recoverContestPairingAdmission, requireMatchingPairingAdmission, runContestPublicSamplesOnServer, submitContestSource } from "@/lib/contest-submissions";

test("pairing admission must match the Clerk-authenticated browser receipt", () => {
  const local = {
    session_id: "33333333-3333-4333-8333-333333333333",
    lease_token: "l".repeat(64),
    device_id: "44444444-4444-4444-8444-444444444444",
    device_epoch: 2,
    expires_at: "2099-10-17T12:00:00Z",
    policy_digest: "a".repeat(64),
    policy_revision: 3,
    replayed: false,
  };
  const authenticated = { ...local, contest_id: "22222222-2222-4222-8222-222222222222", replayed: true };
  assert.equal(
    requireMatchingPairingAdmission("22222222-2222-4222-8222-222222222222", local, authenticated).session_id,
    local.session_id,
  );
  for (const mismatch of [
    { ...authenticated, session_id: "55555555-5555-4555-8555-555555555555" },
    { ...authenticated, device_id: "66666666-6666-4666-8666-666666666666" },
    { ...authenticated, lease_token: "x".repeat(64) },
    { ...authenticated, contest_id: "77777777-7777-4777-8777-777777777777" },
  ]) {
    assert.throws(
      () => requireMatchingPairingAdmission("22222222-2222-4222-8222-222222222222", local, mismatch),
      (error: unknown) => error instanceof ContestSubmissionError && error.code === "PAIRING_ACCOUNT_MISMATCH",
    );
  }
});

test("pairing admission recovery is authenticated and policy bound", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const requestId = "11111111-1111-4111-8111-111111111111";
  const contestId = "22222222-2222-4222-8222-222222222222";
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({
      contest_id: contestId,
      session_id: "33333333-3333-4333-8333-333333333333",
      lease_token: "l".repeat(64),
      device_id: "44444444-4444-4444-8444-444444444444",
      device_epoch: 2,
      expires_at: "2099-10-17T12:00:00Z",
      policy_digest: "a".repeat(64),
      policy_revision: 3,
      replayed: true,
    });
  };
  try {
    const admission = await recoverContestPairingAdmission({
      requestId,
      contestId,
      accessToken: "clerk-session-token",
      policyRevision: 3,
      policyDigest: "a".repeat(64),
    });
    assert.equal(requestUrl, `https://gateway.example/v1/runtime/pairing/${requestId}/admission`);
    assert.equal(requestInit?.method, "GET");
    assert.equal(requestInit?.cache, "no-store");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), "Bearer clerk-session-token");
    assert.equal(headers.get("x-mindflare-client"), "web");
    assert.equal(admission.contest_id, contestId);
    assert.equal(admission.policy_revision, 3);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

test("public standings use the gateway projection and retain only safe score rows", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "22222222-2222-4222-8222-222222222222";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json(publicStandingsFixture(contestId));
  };
  try {
    const standings = await getPublicContestStandings(contestId);
    assert.equal(requestUrl, `https://gateway.example/v1/contests/${contestId}/standings`);
    assert.equal(requestInit?.method, "GET");
    assert.equal(requestInit?.cache, "no-store");
    assert.equal(requestInit?.redirect, "error");
    assert.equal(requestInit?.credentials, "omit");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), null);
    assert.equal(standings.scoring.preset, "codeforces_dynamic");
    assert.equal(standings.rows[0].points, 2_450);
    assert.equal(standings.rows[0].hidden_activity, true);
    assert.deepEqual(standings.rows[0].problems["11111111-1111-4111-8111-111111111111"], {
      solved: true,
      points: 2_450,
      penalty_minutes: null,
      best_score_achieved_at_seconds: 300,
    });
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

test("public standings reject wrong contests, admin views, and hidden metadata", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "22222222-2222-4222-8222-222222222222";
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  try {
    const base = publicStandingsFixture(contestId);
    const withHiddenMetadata = publicStandingsFixture(contestId);
    withHiddenMetadata.standings.rows[0] = {
      ...withHiddenMetadata.standings.rows[0],
      hidden_attempt_count: 4,
    } as typeof withHiddenMetadata.standings.rows[number];
    const payloads = [
      { ...base, contest_id: "33333333-3333-4333-8333-333333333333" },
      { ...base, view: "admin" },
      withHiddenMetadata,
    ];
    for (const payload of payloads) {
      globalThis.fetch = async () => Response.json(payload);
      await assert.rejects(
        getPublicContestStandings(contestId),
        (error: unknown) => error instanceof ContestSubmissionError && error.status === 502,
      );
    }
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

function publicStandingsFixture(contestId: string) {
  return {
    contest_id: contestId,
    contest_name: "Synthetic Contest",
    state: "active",
    view: "public",
    standings: {
      schema_version: 1,
      scoring: { preset: "codeforces_dynamic", version: "codeforces-dynamic-v1" },
      freeze_at_seconds: 7_200,
      rows: [{
        rank: 1,
        participant: "Synthetic Participant",
        solved: 1,
        points: 2_450,
        penalty_minutes: 0,
        hidden_activity: true,
        problems: {
          "11111111-1111-4111-8111-111111111111": {
            solved: true,
            points: 2_450,
            penalty_minutes: null,
            best_score_achieved_at_seconds: 300,
          },
        },
      }],
    },
  };
}

test("contest completion is authenticated, lease-bound, and server-timestamped", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "11111111-1111-4111-8111-111111111111";
  const sessionId = "22222222-2222-4222-8222-222222222222";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({
      session_id: sessionId,
      completed_at: "2026-10-17T12:00:00Z",
      completed: true,
      replayed: true,
    });
  };
  try {
    const receipt = await completeContestAdmission({
      contestId,
      accessToken: "clerk-session-token",
      admission: {
        session_id: sessionId,
        lease_token: "l".repeat(64),
        device_id: "33333333-3333-4333-8333-333333333333",
        device_epoch: 2,
        expires_at: "2026-10-17T12:01:00Z",
        policy_digest: "a".repeat(64),
        policy_revision: 1,
        replayed: false,
      },
    });
    assert.equal(requestUrl, `https://gateway.example/v1/contests/${contestId}/complete`);
    assert.equal(requestInit?.method, "POST");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), "Bearer clerk-session-token");
    assert.equal(headers.get("x-mindflare-client"), "web");
    const body = JSON.parse(String(requestInit?.body)) as Record<string, unknown>;
    assert.deepEqual(Object.keys(body).sort(), ["device_epoch", "device_id", "lease_token", "session_id"]);
    assert.equal("completed_at" in body, false);
    assert.equal(receipt.completed, true);
    assert.equal(receipt.replayed, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

test("contest history requests bounded source-free server records", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "11111111-1111-4111-8111-111111111111";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  let requests = 0;
  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    requests += 1;
    return Response.json(requests === 1 ? {
      items: [{
        submission_id: "22222222-2222-4222-8222-222222222222",
        problem_id: "33333333-3333-4333-8333-333333333333",
        language: "cpp17",
        accepted_at: "2026-10-17T12:00:00Z",
        source_sha256: "a".repeat(64),
        idempotency_key: "44444444-4444-4444-8444-444444444444",
      }],
      next_cursor: { accepted_at: "2026-10-17T12:00:00Z", submission_id: "22222222-2222-4222-8222-222222222222" },
    } : { items: [], next_cursor: null });
  };
  try {
    const history = await getContestSubmissionHistory({ contestId, accessToken: "clerk-session-token" });
    assert.equal(requestUrl, `https://gateway.example/v1/contests/${contestId}/submissions/history`);
    assert.equal(requestInit?.method, "GET");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), "Bearer clerk-session-token");
    assert.equal(history.items.length, 1);
    assert.equal(history.items[0]?.language, "cpp17");
    assert.equal("source" in (history.items[0] ?? {}), false);
    assert.ok(history.next_cursor);
    const older = await getContestSubmissionHistory({
      contestId,
      accessToken: "clerk-session-token",
      cursor: history.next_cursor,
    });
    const olderUrl = new URL(requestUrl);
    assert.equal(olderUrl.searchParams.get("before_at"), history.next_cursor.accepted_at);
    assert.equal(olderUrl.searchParams.get("before_id"), history.next_cursor.submission_id);
    assert.deepEqual(older.items, []);
    assert.equal(older.next_cursor, null);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

test("public-sample fallback calls its separate endpoint without claiming an official result", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "11111111-1111-4111-8111-111111111111";
  const problemId = "22222222-2222-4222-8222-222222222222";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;

  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({
      official: false,
      cases: [{ stdout: "42\n", stderr: "", exit_code: 0, compile_exit_code: 0, sample_matches: true, duration_ms: 17 }],
    });
  };

  try {
    const results = await runContestPublicSamplesOnServer({
      contestId,
      problemId,
      accessToken: "clerk-session-token",
      admission: {
        session_id: "33333333-3333-4333-8333-333333333333",
        lease_token: "l".repeat(64),
        device_id: "44444444-4444-4444-8444-444444444444",
        device_epoch: 3,
        expires_at: "2026-10-17T12:00:00Z",
        policy_digest: "a".repeat(64),
        policy_revision: 1,
        replayed: false,
      },
      language: "cpp20",
      source: "int main() {}",
    });

    assert.equal(requestUrl, `https://gateway.example/v1/contests/${contestId}/sample-run`);
    assert.equal(requestInit?.method, "POST");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), "Bearer clerk-session-token");
    const body = JSON.parse(String(requestInit?.body)) as Record<string, unknown>;
    assert.equal(body.problem_id, problemId);
    assert.equal(body.language, "cpp20");
    assert.equal(body.source, "int main() {}");
    assert.equal("expected_output" in body, false);
    assert.equal("verdict" in body, false);
    assert.equal("score" in body, false);
    assert.equal(results[0]?.sample_matches, true);
    assert.equal(results[0]?.duration_ms, 17);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});

test("contest submission sends source to the gateway without a client verdict", async () => {
  const originalFetch = globalThis.fetch;
  const originalOrigin = process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
  const contestId = "11111111-1111-4111-8111-111111111111";
  const problemId = "22222222-2222-4222-8222-222222222222";
  const sessionId = "33333333-3333-4333-8333-333333333333";
  const deviceId = "44444444-4444-4444-8444-444444444444";
  const idempotencyKey = "55555555-5555-4555-8555-555555555555";
  const source = "int main() { return 0; }";
  let requestUrl = "";
  let requestInit: RequestInit | undefined;

  process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = "https://gateway.example";
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({
      submission_id: "66666666-6666-4666-8666-666666666666",
      status: "queued",
      accepted_at: "2026-10-17T12:00:00Z",
      source_sha256: "a".repeat(64),
      idempotency_key: idempotencyKey,
    }, { status: 201 });
  };

  try {
    const receipt = await submitContestSource({
      contestId,
      idempotencyKey,
      accessToken: "clerk-session-token",
      submission: {
        session_id: sessionId,
        lease_token: "l".repeat(64),
        device_id: deviceId,
        device_epoch: 3,
        problem_id: problemId,
        language: "cpp17",
        source,
      },
    });

    assert.equal(requestUrl, `https://gateway.example/v1/contests/${contestId}/submissions`);
    assert.equal(requestInit?.method, "POST");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("authorization"), "Bearer clerk-session-token");
    assert.equal(headers.get("idempotency-key"), idempotencyKey);
    const body = JSON.parse(String(requestInit?.body)) as Record<string, unknown>;
    assert.equal(body.source, source);
    assert.equal(body.language, "cpp17");
    assert.equal("verdict" in body, false);
    assert.equal("official" in body, false);
    assert.equal(receipt.status, "queued");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalOrigin === undefined) delete process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN;
    else process.env.NEXT_PUBLIC_MINDFLARE_GATEWAY_ORIGIN = originalOrigin;
  }
});
