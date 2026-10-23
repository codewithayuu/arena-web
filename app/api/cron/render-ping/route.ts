import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hasSecret(request: NextRequest, secret: string): boolean {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const expectedBytes = Buffer.from(secret);
  const suppliedBytes = Buffer.from(supplied);
  return suppliedBytes.length === expectedBytes.length && timingSafeEqual(suppliedBytes, expectedBytes);
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const serviceUrl = process.env.RENDER_PROFILE_SERVICE_URL;
  if (!cronSecret || !serviceUrl) {
    return NextResponse.json({ ok: false, error: "Render ping is not configured" }, { status: 503 });
  }
  if (!hasSecret(request, cronSecret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const target = new URL(serviceUrl);
    if (target.protocol !== "https:") throw new Error("Render service URL must use HTTPS");
    const response = await fetch(new URL("/healthz", target), {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Render health check failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, renderStatus: response.status }, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Render service could not be reached" }, { status: 502 });
  }
}
