import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContestStatement } from "@/components/contest/contest-statement";
import polygonImportedProblem from "@/components/contest/fixtures/mrc-2026-the-bat-arsenal.json";
import {
  completeRuntimePairingOnUserAction,
  completeRuntimePairingWithRunningLauncher,
  confirmLocalContestCompletion,
  getLocalContestProblems,
  isContestSampleFallbackEligible,
  localExecutionMatchesSample,
  prepareRuntimePairingChallenge,
  recoverLocalCacheCleanup,
  RuntimeBridgeError,
  runLocalInput,
} from "@/lib/runtime-bridge";

const contestRunContext = {
  problemId: "00000000-0000-4000-8000-000000000099",
  contestPolicy: {
    policy: {},
    sha256: "a".repeat(64),
    signature: "A".repeat(88),
    key_id: "test-key",
    algorithm: "Ed25519",
  },
};
const launchReference = "00000000-0000-4000-8000-000000000030";

test("definitive launcher-session rejection requests browser re-pair while transient outages remain retryable", async () => {
  const originalFetch = globalThis.fetch;
  const contestId = "00000000-0000-4000-8000-000000000020";
  const session = {
    sessionToken: "a".repeat(43),
    purpose: "contest" as const,
    contestId,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
  try {
    for (const status of [401, 403]) {
      globalThis.fetch = async () => new Response(null, { status });
      await assert.rejects(
        () => getLocalContestProblems(session, contestId),
        (error: unknown) => error instanceof RuntimeBridgeError && error.code === "PAIRING_EXPIRED",
      );
    }
    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(
      () => getLocalContestProblems(session, contestId),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "RUNTIME_UNAVAILABLE",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("the imported Polygon TeX statement and visible sample survive launcher DTO validation and render", async () => {
  const originalFetch = globalThis.fetch;
  const contestId = "00000000-0000-4000-8000-000000000020";
  const problemId = "00000000-0000-4000-8000-000000000099";
  const statementMarkdown = polygonImportedProblem.statement_markdown_lines.join("\n");
  const sample = polygonImportedProblem.public_samples[0];
  const responseBody = {
    contest_id: contestId,
    source_polygon_sha256: "a".repeat(64),
    problems: [{
      slug: polygonImportedProblem.slug,
      problem_id: problemId,
      ordinal: 1,
      title: polygonImportedProblem.title,
      statement_markdown: statementMarkdown,
      assets: [],
      samples: [{ index: sample.index, input: sample.input, output: sample.output }],
      time_limit_ms: 2000,
      memory_limit_bytes: 268_435_456,
    }],
  };
  const session = {
    sessionToken: "a".repeat(43),
    purpose: "contest" as const,
    contestId,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };

  globalThis.fetch = async (input, init) => {
    if (String(input) === "http://127.0.0.1:48731/v1/session/prepare-content") {
      assert.equal(init?.method, "POST");
      assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${session.sessionToken}`);
      return new Response(null, { status: 204 });
    }
    assert.equal(String(input), `http://127.0.0.1:48731/v1/localhost/contests/${contestId}/problems`);
    assert.equal(init?.method, "GET");
    assert.equal(init?.credentials, "omit");
    assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${session.sessionToken}`);
    return Response.json(responseBody, { headers: { "cache-control": "no-store" } });
  };

  try {
    const [problem] = await getLocalContestProblems(session, contestId);
    assert.equal(problem.problem_id, problemId);
    assert.equal(problem.title, polygonImportedProblem.title);
    assert.deepEqual(problem.public_samples, [{ input: sample.input, output: sample.output }]);
    assert.match(problem.statement_markdown, /exactly \$P\$ shadow monsters/);

    const html = renderToStaticMarkup(createElement(ContestStatement, {
      markdown: problem.statement_markdown,
    }));
    assert.match(html, /class="katex"/);
    assert.match(html, /aria-label="Problem statement"/);
    assert.match(html, /Batman is perched on a gargoyle/);
    assert.doesNotMatch(html, /<script|dangerouslySetInnerHTML/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("contest public-sample fallback covers expired local pairing without covering user/code errors", () => {
  assert.equal(isContestSampleFallbackEligible(new RuntimeBridgeError("PAIRING_EXPIRED", "expired")), true);
  assert.equal(isContestSampleFallbackEligible(new RuntimeBridgeError("SANDBOX_UNAVAILABLE", "sandbox")), true);
  assert.equal(isContestSampleFallbackEligible(new RuntimeBridgeError("EXECUTION_CANCELLED", "cancelled")), false);
  assert.equal(isContestSampleFallbackEligible(new RuntimeBridgeError("INVALID_REQUEST", "bad source")), false);
  assert.equal(isContestSampleFallbackEligible(new Error("unknown")), false);
});

test("pairing challenge is prepared separately from launcher dispatch", async () => {
  const originalFetch = globalThis.fetch;
  const requestBodies: Array<Record<string, unknown>> = [];
  const requestId = "00000000-0000-4000-8000-000000000001";
  const binding={challenge_sha256:"a".repeat(64),device_id:"00000000-0000-4000-8000-000000000011",device_public_key:"A".repeat(43)};
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/v1/session/pairing-binding")) {
      assert.equal(init?.credentials,"omit");
      assert.equal(init?.body,"{}");
      return Response.json(binding,{status:201});
    }
    requestBodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return Response.json({
      request_id: requestId,
      purpose: "practice",
      contest_id: null,
      launch_uri: `mindflare://connect?request_id=${requestId}`,
      expires_at: new Date(Date.now() + 120_000).toISOString(),
    });
  };

  try {
    const challenge = await prepareRuntimePairingChallenge("practice");
    assert.equal(challenge.requestId, requestId);
    assert.equal(challenge.launchUri, `mindflare://connect?request_id=${requestId}`);
    assert.deepEqual(requestBodies, [{ purpose: "practice",launcher_binding:binding }]);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("invalid launcher commitment cannot reach authenticated ticket issuance", async () => {
  const original=globalThis.fetch;const paths:string[]=[];
  globalThis.fetch=async input=>{paths.push(String(input));return Response.json({challenge_sha256:"wrong",device_id:"00000000-0000-4000-8000-000000000011",device_public_key:"A".repeat(43)});};
  try {
    await assert.rejects(()=>prepareRuntimePairingChallenge("practice"),/valid device-bound challenge/);
    assert.deepEqual(paths,["http://127.0.0.1:48731/v1/session/pairing-binding"]);
  } finally {globalThis.fetch=original;}
});

test("launcher ticket issuance requires the OS-protected Ed25519 public-key binding", async () => {
  const original = globalThis.fetch;
  const paths: string[] = [];
  globalThis.fetch = async input => {
    paths.push(String(input));
    return Response.json({ challenge_sha256: "a".repeat(64), device_id: "00000000-0000-4000-8000-000000000011" });
  };
  try {
    await assert.rejects(() => prepareRuntimePairingChallenge("practice"), /valid device-bound challenge/);
    assert.deepEqual(paths, ["http://127.0.0.1:48731/v1/session/pairing-binding"]);
  } finally {
    globalThis.fetch = original;
  }
});

test("contest pairing rejects an admission handoff bound to a different device", async () => {
  const original = globalThis.fetch;
  const paths: string[] = [];
  const launcherDevice = "00000000-0000-4000-8000-000000000011";
  globalThis.fetch = async (input) => {
    paths.push(String(input));
    return Response.json({ challenge_sha256: "a".repeat(64), device_id: launcherDevice, device_public_key: "A".repeat(43) });
  };
  try {
    await assert.rejects(
      () => prepareRuntimePairingChallenge("contest", "00000000-0000-4000-8000-000000000020", {
        challenge_id: "00000000-0000-4000-8000-000000000021",
        policy_revision: 1,
        policy_digest: "b".repeat(64),
        device_id: "00000000-0000-4000-8000-000000000012",
        idempotency_key: "00000000-0000-4000-8000-000000000022",
      }, undefined, launchReference),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "PAIRING_DEVICE_MISMATCH",
    );
    assert.deepEqual(paths, ["http://127.0.0.1:48731/v1/session/pairing-binding"]);
  } finally {
    globalThis.fetch = original;
  }
});

test("contest pairing requires the consumed launcher reference and binds it into the Clerk-authenticated challenge", async () => {
  const original = globalThis.fetch;
  const requestBodies: Array<Record<string, unknown>> = [];
  const requestId = "00000000-0000-4000-8000-000000000031";
  const binding = {
    challenge_sha256: "a".repeat(64),
    device_id: "00000000-0000-4000-8000-000000000011",
    device_public_key: "A".repeat(43),
  };
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/v1/session/pairing-binding")) return Response.json(binding);
    requestBodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
    return Response.json({
      request_id: requestId,
      purpose: "contest",
      contest_id: "00000000-0000-4000-8000-000000000020",
      launch_uri: `mindflare://connect?request_id=${requestId}`,
      expires_at: new Date(Date.now() + 90_000).toISOString(),
    });
  };
  try {
    await assert.rejects(
      () => prepareRuntimePairingChallenge("contest", "00000000-0000-4000-8000-000000000020"),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "INVALID_REQUEST",
    );
    assert.equal(requestBodies.length, 0);
    await prepareRuntimePairingChallenge("contest", "00000000-0000-4000-8000-000000000020", undefined, binding, launchReference);
    assert.deepEqual(requestBodies, [{
      purpose: "contest",
      contest_id: "00000000-0000-4000-8000-000000000020",
      launch_request_id: launchReference,
      launcher_binding: binding,
    }]);
  } finally {
    globalThis.fetch = original;
  }
});

test("expired contest launcher authorization surfaces the recovery-specific error", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ code: "LAUNCH_INTENT_EXPIRED" }, { status: 410 });
  try {
    await assert.rejects(
      () => prepareRuntimePairingChallenge("contest", "00000000-0000-4000-8000-000000000020", undefined, {
        challenge_sha256: "a".repeat(64),
        device_id: "00000000-0000-4000-8000-000000000011",
        device_public_key: "A".repeat(43),
      }, launchReference),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "LAUNCH_INTENT_EXPIRED",
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("direct user action dispatches launcher URI before local pairing polling", async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const order: string[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { assign: (url: string) => order.push(`launch:${url}`) },
      setTimeout,
    },
  });
  globalThis.fetch = async (input) => {
    order.push(`fetch:${String(input)}`);
    return Response.json({
      paired: true,
      session_token: "c".repeat(43),
      purpose: "practice",
      contest_id: null,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    });
  };
  const requestId = "00000000-0000-4000-8000-000000000002";

  try {
    const session = await completeRuntimePairingOnUserAction({
      requestId,
      purpose: "practice",
      contestId: null,
      launchUri: `mindflare://connect?request_id=${requestId}`,
      expiresAt: new Date(Date.now() + 120_000).toISOString(),
    });
    assert.match(order[0] ?? "", /^launch:mindflare:\/\/connect\?/);
    assert.match(order[1] ?? "", /^fetch:http:\/\/127\.0\.0\.1:48731\/v1\/session\/pair$/);
    assert.equal(session.purpose, "practice");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("running contest launcher pairs in place without dispatching another OS URI", async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const order: string[] = [];
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { assign: (url: string) => order.push(`launch:${url}`) },
      setTimeout,
    },
  });
  globalThis.fetch = async (input) => {
    order.push(`fetch:${String(input)}`);
    return Response.json({
      paired: true,
      session_token: "e".repeat(43),
      purpose: "contest",
      contest_id: "00000000-0000-4000-8000-000000000005",
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    }, { status: 201 });
  };
  const requestId = "00000000-0000-4000-8000-000000000006";
  const contestId = "00000000-0000-4000-8000-000000000005";

  try {
    const session = await completeRuntimePairingWithRunningLauncher({
      requestId,
      purpose: "contest",
      contestId,
      launchUri: `mindflare://connect?request_id=${requestId}`,
      expiresAt: new Date(Date.now() + 120_000).toISOString(),
    });
    assert.equal(order.length, 1);
    assert.match(order[0] ?? "", /^fetch:http:\/\/127\.0\.0\.1:48731\/v1\/session\/pair$/);
    assert.equal(session.purpose, "contest");
    assert.equal(session.contestId, contestId);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("launcher pairing retries a pending handoff before accepting the local session", async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const order: string[] = [];
  let pairAttempts = 0;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { assign: (url: string) => order.push(`launch:${url}`) },
      setTimeout: (callback: TimerHandler) => {
        if (typeof callback === "function") queueMicrotask(callback as () => void);
        return 1;
      },
    },
  });
  globalThis.fetch = async (input) => {
    order.push(`fetch:${String(input)}`);
    pairAttempts += 1;
    if (pairAttempts === 1) {
      return Response.json({ code: "PAIRING_PENDING" }, { status: 425 });
    }
    return Response.json({
      paired: true,
      session_token: "d".repeat(43),
      purpose: "practice",
      contest_id: null,
      expires_at: new Date(Date.now() + 60_000).toISOString(),
    }, { status: 201 });
  };
  const requestId = "00000000-0000-4000-8000-000000000003";

  try {
    const phases: string[] = [];
    const session = await completeRuntimePairingOnUserAction({
      requestId,
      purpose: "practice",
      contestId: null,
      launchUri: `mindflare://connect?request_id=${requestId}`,
      expiresAt: new Date(Date.now() + 120_000).toISOString(),
    }, (phase) => phases.push(phase));
    assert.equal(pairAttempts, 2);
    assert.match(order[0] ?? "", /^launch:mindflare:\/\/connect\?/);
    assert.deepEqual(phases, ["starting", "pairing"]);
    assert.equal(session.sessionToken, "d".repeat(43));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("launcher silence is reported as unavailable with install and local-network recovery guidance", async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalNow = Date.now;
  let fakeNow = originalNow();
  const startedAt = fakeNow;
  Date.now = () => fakeNow;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: { assign: () => undefined },
      setTimeout: (callback: TimerHandler, delay?: number) => {
        fakeNow += Number(delay ?? 0);
        if (typeof callback === "function") queueMicrotask(callback as () => void);
        return 1;
      },
    },
  });
  globalThis.fetch = async () => { throw new Error("launcher did not answer"); };
  const requestId = "00000000-0000-4000-8000-000000000004";

  try {
    await assert.rejects(
      completeRuntimePairingOnUserAction({
        requestId,
        purpose: "practice",
        contestId: null,
        launchUri: `mindflare://connect?request_id=${requestId}`,
        expiresAt: new Date(fakeNow + 60_000).toISOString(),
      }),
      (error: unknown) => error instanceof RuntimeBridgeError &&
        error.code === "RUNTIME_UNAVAILABLE" &&
        /installed/.test(error.message) && /local network/.test(error.message),
    );
    assert.ok(fakeNow >= startedAt + 15_000);
  } finally {
    Date.now = originalNow;
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("run timeout best-effort cancels the paired local execution", async () => {
  const originalFetch = globalThis.fetch;
  const calls: string[] = [];
  const session = {
    sessionToken: "a".repeat(43),
    purpose: "contest" as const,
    contestId: "00000000-0000-4000-8000-000000000098",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
  const executionId = "00000000-0000-4000-8000-000000000001";

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push(`${init?.method ?? "GET"} ${url}`);
    if (url.endsWith("/v1/health")) {
      return Response.json({
        protocol_version: 1,
        version: "test",
        paired: true,
        capabilities: [{ language: "cpp17", available: true, sandbox: "test", reason: null, toolchain_version: "1" }],
      });
    }
    if (url.endsWith("/v1/execution/run")) throw new Error("simulated response timeout");
    if (url.endsWith("/v1/execution/cancel")) {
      return Response.json({ execution_id: executionId, cancellation_requested: true });
    }
    throw new Error(`Unexpected runtime request: ${url}`);
  };

  try {
    await assert.rejects(
      runLocalInput(session, "int main() {}", "cpp17", "", executionId, undefined, contestRunContext),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "RUNTIME_UNAVAILABLE",
    );
    assert.ok(calls.some((call) => call.includes("/v1/execution/cancel")));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("custom input uses only the paired local execution API in all four languages", async () => {
  const originalFetch = globalThis.fetch;
  const session = { sessionToken: "e".repeat(43), purpose: "contest" as const,
    contestId: "00000000-0000-4000-8000-000000000010", expiresAt: new Date(Date.now() + 60_000).toISOString() };
  const executionId = "00000000-0000-4000-8000-000000000011";
  let language = "cpp17";
  let stdin = "";
  let executions = 0;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    assert.ok(url.startsWith("http://127.0.0.1:48731/"));
    if (url.endsWith("/v1/health")) return Response.json({ protocol_version: 1, version: "test", paired: true,
      capabilities: [{ language, available: true, sandbox: "test", reason: null, toolchain_version: "1" }] });
    assert.equal(url, "http://127.0.0.1:48731/v1/execution/run");
    assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${session.sessionToken}`);
    assert.equal(init?.credentials, "omit");
    const body = JSON.parse(String(init?.body));
    assert.equal(body.stdin, stdin);
    assert.equal(body.language, language);
    assert.equal(body.mode, "CONTEST_SAMPLE_LOCAL");
    assert.equal(body.test_bundle_id, null);
    assert.equal(body.problem_id, contestRunContext.problemId);
    assert.deepEqual(body.contest_policy, contestRunContext.contestPolicy);
    executions += 1;
    return Response.json({ execution_id: executionId, mode: body.mode, verification: "LOCAL_UNVERIFIED",
      official: false, stdout: "output", stderr: "", exit_code: 0, duration_ms: 2 });
  };
  try {
    for (language of ["cpp17", "java", "python", "javascript"]) {
      for (stdin of ["", "custom 😀 input\n", "x".repeat(64 * 1024)]) {
        const result = await runLocalInput(session, "synthetic source", language, stdin, executionId, undefined, contestRunContext);
        assert.equal(result.official, false);
        assert.equal(result.verification, "LOCAL_UNVERIFIED");
      }
    }
    assert.equal(executions, 12);
  } finally { globalThis.fetch = originalFetch; }
});

test("UTF-8 source and input bounds reject before contacting the launcher", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new Error("must not contact runtime"); };
  const session = { sessionToken: "e".repeat(43), purpose: "contest" as const,
    contestId: "00000000-0000-4000-8000-000000000010", expiresAt: new Date(Date.now() + 60_000).toISOString() };
  try {
    for (const [source, stdin] of [["source", "😀".repeat(16 * 1024 + 1)], ["界".repeat(90_000), ""]]) {
      await assert.rejects(() => runLocalInput(session, source, "python", stdin),
        (error: unknown) => error instanceof RuntimeBridgeError && error.code === "INVALID_REQUEST");
    }
    assert.equal(calls, 0);
  } finally { globalThis.fetch = originalFetch; }
});

test("older launcher sample-run responses without compiler status remain valid", async () => {
  const originalFetch = globalThis.fetch;
  const session = {
    sessionToken: "e".repeat(43),
    purpose: "contest" as const,
    contestId: "00000000-0000-4000-8000-000000000010",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
  const executionId = "00000000-0000-4000-8000-000000000011";
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.endsWith("/v1/health")) {
      return Response.json({
        protocol_version: 1,
        version: "legacy-test",
        paired: true,
        capabilities: [{ language: "cpp17", available: true, sandbox: "test", reason: null, toolchain_version: "1" }],
      });
    }
    if (url.endsWith("/v1/execution/run")) {
      return Response.json({
        execution_id: executionId,
        mode: "CONTEST_SAMPLE_LOCAL",
        verification: "LOCAL_UNVERIFIED",
        official: false,
        stdout: "ok\n",
        stderr: "",
        exit_code: 0,
        duration_ms: 4,
      });
    }
    throw new Error(`Unexpected runtime request: ${url}`);
  };

  try {
    const result = await runLocalInput(session, "int main() {}", "cpp17", "", executionId, undefined, contestRunContext);
    assert.equal(result.stdout, "ok\n");
    assert.equal(result.compile_exit_code, undefined);
    assert.equal(localExecutionMatchesSample(result, "ok\n"), true);
    assert.equal(localExecutionMatchesSample(result, "different\n"), false);
    assert.equal(localExecutionMatchesSample({ ...result, compile_exit_code: 1 }, "ok\n"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("cleanup recovery never transfers Clerk credentials to the paired launcher", async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return Response.json({ recovered_count: 2, deferred_count: 1 });
  };
  try {
    const result = await recoverLocalCacheCleanup({
      sessionToken: "p".repeat(43),
      purpose: "contest",
      contestId: "00000000-0000-4000-8000-000000000101",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
    });
    assert.equal(requestUrl, "http://127.0.0.1:48731/v1/session/cache-cleanup/recover");
    const headers = new Headers(requestInit?.headers);
    assert.equal(headers.get("Authorization"), `Bearer ${"p".repeat(43)}`);
    assert.equal(headers.get("X-Mindflare-Auth-Token"), null);
    assert.equal(requestInit?.body, "{}");
    assert.deepEqual(result, { recoveredCount: 2, deferredCount: 1 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("contest completion reaches only the paired launcher and requires its terminal confirmation", async () => {
  const originalFetch = globalThis.fetch;
  const session = {
    sessionToken: "c".repeat(43),
    purpose: "contest" as const,
    contestId: "00000000-0000-4000-8000-000000000151",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(null, { status: 204 });
  };
  try {
    await confirmLocalContestCompletion(session, session.contestId!);
    assert.equal(requestUrl, `http://127.0.0.1:48731/v1/localhost/contests/${session.contestId}/completed`);
    assert.equal(requestInit?.method, "POST");
    assert.equal(new Headers(requestInit?.headers).get("Authorization"), `Bearer ${session.sessionToken}`);
    assert.equal(requestInit?.body, undefined);
    assert.equal(requestInit?.cache, "no-store");

    globalThis.fetch = async () => new Response(null, { status: 409 });
    await assert.rejects(
      () => confirmLocalContestCompletion(session, session.contestId!),
      (error: unknown) => error instanceof RuntimeBridgeError && error.code === "CONTEST_COMPLETION_PENDING",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("practice cases are submitted as one local practice-only execution", async () => {
  const originalFetch = globalThis.fetch;
  const receivedBodies: Array<Record<string, unknown>> = [];
  const session = {
    sessionToken: "b".repeat(43),
    purpose: "practice" as const,
    contestId: null,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
  const executionId = "00000000-0000-4000-8000-000000000002";
  const manifest = {
    schema_version: 1 as const,
    pack_id: "move-zeroes@catalog-v1",
    problem_id: "move-zeroes",
    problem_revision: "catalog-v1",
    checker: { kind: "json_value_v1" as const },
    cases: [{ name: "Case 1", stdin: "[1]\n", expected_stdout: "[1]\n" }],
  };

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url.endsWith("/v1/health")) {
      return Response.json({
        protocol_version: 1,
        version: "test",
        paired: true,
        capabilities: [{ language: "cpp17", available: true, sandbox: "test", reason: null, toolchain_version: "1" }],
      });
    }
    if (url.endsWith("/v1/execution/practice")) {
      receivedBodies.push(JSON.parse(String(init?.body)) as Record<string, unknown>);
      return Response.json({
        execution_id: executionId,
        mode: "PRACTICE_LOCAL",
        verification: "LOCAL_UNVERIFIED",
        official: false,
        stdout: "",
        stderr: "",
        exit_code: null,
        compile_exit_code: 0,
        duration_ms: 7,
        practice_manifest_version: 1,
        practice_pack_id: manifest.pack_id,
        practice_checker: manifest.checker,
        practice_cases: [{ name: "Case 1", passed: true, stdout: "[1]\n", stderr: "", exit_code: 0, duration_ms: 7 }],
      });
    }
    throw new Error(`Unexpected runtime request: ${url}`);
  };

  try {
    const result = await runLocalInput(session, "int main() {}", "cpp17", "", executionId, manifest);
    assert.deepEqual(receivedBodies[0]?.practice_manifest, manifest);
    assert.equal(result.practice_cases?.[0].passed, true);
    assert.equal(result.compile_exit_code, 0);
    assert.equal(result.official, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
