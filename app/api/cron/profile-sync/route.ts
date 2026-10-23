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
  const serviceSecret = process.env.PROFILE_SYNC_SERVICE_SECRET;
  if (!cronSecret || !serviceUrl || !serviceSecret) {
    return NextResponse.json({ ok: false, error: "Profile sync is not configured" }, { status: 503 });
  }
  if (!hasSecret(request, cronSecret)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const target = new URL(serviceUrl);
    if (target.protocol !== "https:") throw new Error("Render service URL must use HTTPS");
    const response = await fetch(new URL("/internal/profile-sync", target), {
      method: "POST",
      headers: { authorization: `Bearer ${serviceSecret}` },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Render did not accept the profile sync" }, { status: 502 });
    }
    const result = await response.json().catch(() => ({}));
    return NextResponse.json({ ok: true, ...result }, {
      headers: { "cache-control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Render profile sync could not be reached" }, { status: 502 });
  }
}
