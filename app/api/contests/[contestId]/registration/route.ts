import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";

const NO_STORE = { "Cache-Control": "no-store" };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const INVITE = /^[0-9a-f]{64}$/;
const MAX_BODY_BYTES = 4096;
const MAX_RESPONSE_BYTES = 16 * 1024;

type RegistrationAction =
  | { kind: "individual" }
  | { kind: "create_team"; name: string }
  | { kind: "join_team"; team_id: string; invite_code: string };

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

async function readJsonBounded(body: ReadableStream<Uint8Array> | null, maximum: number): Promise<unknown> {
  if (!body) throw new Error("missing body");
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maximum) throw new Error("body too large");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
}

async function parseAction(request: Request): Promise<RegistrationAction | null> {
  if (request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() !== "application/json") return null;
  const length = request.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) return null;
  try {
    const value = await readJsonBounded(request.body, MAX_BODY_BYTES);
    if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
    const action = value as Record<string, unknown>;
    if (action.kind === "individual" && Object.keys(action).length === 1) return { kind: "individual" };
    if (action.kind === "create_team" && Object.keys(action).length === 2 &&
        typeof action.name === "string" && action.name.trim().length >= 2 &&
        action.name.trim().length <= 80 && !/[\u0000-\u001f\u007f]/.test(action.name)) {
      return { kind: "create_team", name: action.name.trim() };
    }
    if (action.kind === "join_team" && Object.keys(action).length === 3 &&
        typeof action.team_id === "string" && UUID.test(action.team_id) &&
        typeof action.invite_code === "string" && INVITE.test(action.invite_code)) {
      return { kind: "join_team", team_id: action.team_id.toLowerCase(), invite_code: action.invite_code };
    }
    return null;
  } catch {
    return null;
  }
}

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : null;
}

function safeReceipt(action: RegistrationAction, value: unknown): Record<string, unknown> | null {
  const receipt = object(value);
  if (!receipt || receipt.status !== "registered") return null;
  if (action.kind === "individual") {
    return UUID.test(String(receipt.contest_id)) && receipt.kind === "individual" &&
      typeof receipt.registered_at === "string" && Number.isFinite(Date.parse(receipt.registered_at))
      ? { contest_id: String(receipt.contest_id).toLowerCase(), kind: "individual", status: "registered", registered_at: receipt.registered_at }
      : null;
  }
  if (action.kind === "create_team") {
    return UUID.test(String(receipt.contest_id)) && UUID.test(String(receipt.team_id)) &&
      typeof receipt.team_name === "string" && receipt.team_name.length <= 80 &&
      typeof receipt.invite_code === "string" && INVITE.test(receipt.invite_code) &&
      Number.isInteger(receipt.team_size_limit) && (receipt.team_size_limit as number) >= 2 && (receipt.team_size_limit as number) <= 32 &&
      typeof receipt.membership_locks_at === "string" && Number.isFinite(Date.parse(receipt.membership_locks_at))
      ? {
          contest_id: String(receipt.contest_id).toLowerCase(),
          team_id: String(receipt.team_id).toLowerCase(),
          team_name: receipt.team_name,
          invite_code: receipt.invite_code,
          kind: "team",
          status: "registered",
          team_size_limit: receipt.team_size_limit,
          membership_locks_at: receipt.membership_locks_at,
        }
      : null;
  }
  return UUID.test(String(receipt.contest_id)) && UUID.test(String(receipt.team_id)) &&
    receipt.kind === "team" && Number.isInteger(receipt.member_count) &&
    typeof receipt.membership_locks_at === "string" && Number.isFinite(Date.parse(receipt.membership_locks_at))
    ? {
        contest_id: String(receipt.contest_id).toLowerCase(),
        team_id: String(receipt.team_id).toLowerCase(),
        kind: "team",
        status: "registered",
        member_count: receipt.member_count,
        membership_locks_at: receipt.membership_locks_at,
      }
    : null;
}

const GATEWAY_CODES = new Set([
  "INVALID_REGISTRATION", "UNAUTHORIZED", "REGISTRATION_AUTHORITY_UNAVAILABLE",
  "CONTEST_OR_TEAM_NOT_FOUND", "ALREADY_REGISTERED", "INVALID_TEAM_INVITATION",
  "REGISTRATION_CLOSED", "RATE_LIMITED",
]);

export async function POST(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return NextResponse.json({ code: "ORIGIN_DENIED" }, { status: 403, headers: NO_STORE });
  }
  const { contestId } = await params;
  if (!UUID.test(contestId)) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: NO_STORE });
  const action = await parseAction(request);
  if (!action) return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: NO_STORE });

  const session = await auth();
  if (!session.userId) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: NO_STORE });
  const token = await session.getToken();
  const gateway = gatewayOrigin();
  if (!token || !gateway) return NextResponse.json({ code: "REGISTRATION_UNAVAILABLE" }, { status: 503, headers: NO_STORE });

  const path = action.kind === "individual"
    ? `/v1/contests/${contestId}/registration/individual`
    : action.kind === "create_team"
      ? `/v1/contests/${contestId}/teams`
      : `/v1/contests/${contestId}/teams/${action.team_id}/join`;
  const body = action.kind === "individual" ? undefined
    : action.kind === "create_team" ? JSON.stringify({ name: action.name })
      : JSON.stringify({ invite_code: action.invite_code });

  try {
    const upstream = await fetch(new URL(path, gateway), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body } : {}),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(6000),
    });
    const payload = await readJsonBounded(upstream.body, MAX_RESPONSE_BYTES);
    if (!upstream.ok) {
      const code = object(payload)?.code;
      const status = [400, 401, 403, 404, 409, 429, 503].includes(upstream.status) ? upstream.status : 503;
      return NextResponse.json({ code: typeof code === "string" && GATEWAY_CODES.has(code) ? code : "REGISTRATION_UNAVAILABLE" }, { status, headers: NO_STORE });
    }
    const safe = upstream.status === 201 ? safeReceipt(action, payload) : null;
    return safe
      ? NextResponse.json(safe, { status: 201, headers: NO_STORE })
      : NextResponse.json({ code: "INVALID_AUTHORITY_RESPONSE" }, { status: 502, headers: NO_STORE });
  } catch {
    return NextResponse.json({ code: "REGISTRATION_UNAVAILABLE" }, { status: 503, headers: NO_STORE });
  }
}
