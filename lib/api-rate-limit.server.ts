import "server-only";

import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest, supabaseRpcUrl } from "@/lib/supabase-rest.server";

type RateLimitOptions = {
  scope: string;
  identity: string;
  limit: number;
  windowSeconds: number;
};

const memBuckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Uses a Supabase RPC so limits are shared across serverless instances.
 * Falls back to an in-memory rate limiter when Supabase is not configured (e.g. local dev).
 * The raw Clerk ID or client IP is never persisted in the rate-limit table.
 */
export async function enforceApiRateLimit(
  request: NextRequest,
  { scope, identity, limit, windowSeconds }: RateLimitOptions,
): Promise<NextResponse | null> {
  const bucketKey = createHash("sha256").update(`${scope}\0${identity}`).digest("hex");

  if (!process.env.SUPABASE_URL) {
    const now = Math.floor(Date.now() / 1000);
    const existing = memBuckets.get(bucketKey);
    if (!existing || now >= existing.resetAt) {
      memBuckets.set(bucketKey, { count: 1, resetAt: now + windowSeconds });
      return null;
    }
    if (existing.count >= limit) {
      const retryAfter = Math.max(1, existing.resetAt - now);
      return NextResponse.json(
        { error: "Too many requests. Please wait before trying again." },
        {
          status: 429,
          headers: {
            "cache-control": "no-store",
            "retry-after": String(retryAfter),
          },
        },
      );
    }
    existing.count += 1;
    return null;
  }
  try {
    const response = await supabaseRequest(supabaseRpcUrl("consume_web_api_rate_limit"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        p_bucket_key: bucketKey,
        p_max_requests: limit,
        p_window_seconds: windowSeconds,
      }),
    });
    if (!response.ok) throw new Error("Rate-limit store unavailable");
    const allowed = await response.json() as unknown;
    if (typeof allowed !== "boolean") throw new Error("Invalid rate-limit response");
    if (allowed) return null;

    const now = Math.floor(Date.now() / 1000);
    const retryAfter = windowSeconds - (now % windowSeconds);
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "cache-control": "no-store",
          "retry-after": String(retryAfter),
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Request protection is temporarily unavailable. Please retry shortly." },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

export function rateLimitClientIdentity(request: NextRequest): string {
  // On Vercel, x-real-ip is set by the platform. Use the first forwarded value
  // for reverse proxies that provide only the standard forwarded chain.
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp && realIp.length <= 128) return `ip:${realIp}`;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  if (forwarded && forwarded.length <= 128) return `ip:${forwarded}`;
  return "ip:unavailable";
}
