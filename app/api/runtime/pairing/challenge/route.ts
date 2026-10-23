import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";

const MAX_BODY_BYTES = 1024;
const MAX_RESPONSE_BYTES = 8192;
const PURPOSES = new Set(["practice", "contest"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256 = /^[a-f0-9]{64}$/;
const ED25519_PUBLIC_KEY = /^[A-Za-z0-9_-]{43}$/;

function gatewayOrigin(): URL | null {
  try {
    const url = new URL(process.env.MINDFLARE_GATEWAY_ORIGIN || "");
    const hostname = url.hostname.replace(/\.$/, "");
    if (url.protocol !== "https:" || !hostname || url.username || url.password ||
        url.pathname !== "/" || url.search || url.hash || hostname === "localhost" ||
        hostname.endsWith(".localhost") || hostname.startsWith("[") || hostname.includes("*") || isIP(hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw new Error("missing response");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_RESPONSE_BYTES) throw new Error("response too large");
      chunks.push(part.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

async function boundedRequestJson(request: Request): Promise<unknown> {
  if (!request.body) throw new Error("missing request body");
  const rawLength = request.headers.get("content-length");
  const declaredLength = rawLength === null ? null : Number(rawLength);
  if (rawLength !== null && (!/^(0|[1-9][0-9]*)$/.test(rawLength) || !Number.isSafeInteger(declaredLength) ||
      declaredLength! > MAX_BODY_BYTES)) {
    throw new Error("invalid request length");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_BODY_BYTES) throw new Error("request body too large");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }

  if (declaredLength !== null && size !== declaredLength) throw new Error("request length mismatch");
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ code: "ORIGIN_DENIED" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  let input: unknown;
  try {
    input = await boundedRequestJson(request);
  } catch {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const values = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : null;
  const binding=values?.launcher_binding && typeof values.launcher_binding==="object" && !Array.isArray(values.launcher_binding)
    ? values.launcher_binding as Record<string,unknown> : null;
  const validBinding=binding!==null && Object.keys(binding).length===3 && typeof binding.challenge_sha256==="string"
    && SHA256.test(binding.challenge_sha256) && typeof binding.device_id==="string" && UUID.test(binding.device_id)
    && typeof binding.device_public_key==="string" && ED25519_PUBLIC_KEY.test(binding.device_public_key);
  const handoff = values?.admission_handoff;
  const hasHandoff = values !== null && Object.hasOwn(values, "admission_handoff");
  const handoffRecord = handoff && typeof handoff === "object" && !Array.isArray(handoff)
    ? handoff as Record<string, unknown> : null;
  const validHandoff = handoffRecord !== null &&
    Object.keys(handoffRecord).length === 5 &&
    typeof handoffRecord.challenge_id === "string" && UUID.test(handoffRecord.challenge_id) &&
    typeof handoffRecord.device_id === "string" && UUID.test(handoffRecord.device_id) &&
    typeof handoffRecord.idempotency_key === "string" && UUID.test(handoffRecord.idempotency_key) &&
    Number.isSafeInteger(handoffRecord.policy_revision) && Number(handoffRecord.policy_revision) > 0 &&
    typeof handoffRecord.policy_digest === "string" && SHA256.test(handoffRecord.policy_digest);
  const validLaunchReference = typeof values?.launch_request_id === "string" && UUID.test(values.launch_request_id);
  const baseContextValid = values?.purpose === "practice"
    ? typeof values.purpose === "string" && Object.keys(values).length === 2
    : values?.purpose === "contest"
      ? typeof values.contest_id === "string" && UUID.test(values.contest_id) && validLaunchReference &&
        Object.keys(values).every((key) => ["purpose", "contest_id", "launch_request_id", "admission_handoff", "launcher_binding"].includes(key)) &&
        (!hasHandoff || validHandoff)
      : false;
  if (!values || !PURPOSES.has(values.purpose as string) || !baseContextValid || !validBinding) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const session = await auth();
  if (!session.userId) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const token = await session.getToken();
  const gateway = gatewayOrigin();
  if (!token || !gateway) return NextResponse.json({ code: "RUNTIME_PAIRING_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });

  try {
    const upstream = await fetch(new URL("/v1/runtime/pairing/challenge", gateway), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Origin: origin, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    if (!upstream.ok) {
      if (upstream.status === 410) {
        const failure = await boundedJson(upstream).catch(() => null);
        const code = failure && typeof failure === "object" && !Array.isArray(failure) &&
          (failure as Record<string, unknown>).code === "LAUNCH_INTENT_EXPIRED"
          ? "LAUNCH_INTENT_EXPIRED"
          : "RUNTIME_PAIRING_UNAVAILABLE";
        return NextResponse.json({ code }, {
          status: code === "LAUNCH_INTENT_EXPIRED" ? 410 : 503,
          headers: { "Cache-Control": "no-store" },
        });
      }
      await upstream.body?.cancel();
      return NextResponse.json({ code: upstream.status === 401 ? "UNAUTHORIZED" : "RUNTIME_PAIRING_UNAVAILABLE" }, {
        status: upstream.status === 401 ? 401 : upstream.status === 403 ? 403 : 503,
        headers: { "Cache-Control": "no-store" },
      });
    }
    const result = await boundedJson(upstream);
    return NextResponse.json(result, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ code: "RUNTIME_PAIRING_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
