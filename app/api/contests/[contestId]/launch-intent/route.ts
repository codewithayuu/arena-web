import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isIP } from "node:net";

const MAX_RESPONSE_BYTES = 4096;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

async function hasRequestBody(request: Request): Promise<boolean> {
  if (!request.body) return false;
  const reader = request.body.getReader();
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) return size > 0;
      size += part.value.byteLength;
      if (size > 256) return true;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ contestId: string }> }) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin ||
      (request.headers.has("content-length") && request.headers.get("content-length") !== "0")) {
    return NextResponse.json({ code: "ORIGIN_DENIED" }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  if (await hasRequestBody(request)) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const { contestId } = await params;
  if (!UUID.test(contestId)) {
    return NextResponse.json({ code: "INVALID_REQUEST" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const session = await auth();
  if (!session.userId) return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const token = await session.getToken();
  const gateway = gatewayOrigin();
  if (!token || !gateway) return NextResponse.json({ code: "LAUNCH_INTENT_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });

  try {
    const upstream = await fetch(new URL(`/v1/contests/${contestId}/launch-intent`, gateway), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Origin: origin, Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    const payload = await boundedJson(upstream);
    return NextResponse.json(payload, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ code: "LAUNCH_INTENT_UNAVAILABLE" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
