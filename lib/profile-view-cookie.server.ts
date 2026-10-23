import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "mf_profile_views_today";
const MAX_PROFILE_IDS = 60;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function signingKey(): string | null {
  return process.env.PROFILE_VIEW_COOKIE_SECRET || process.env.CLERK_SECRET_KEY || null;
}

function signature(payload: string, key: string): string {
  return createHmac("sha256", key).update(payload).digest("base64url");
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseSeenIds(request: NextRequest, key: string): Set<string> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return new Set();
  const [encodedPayload, suppliedSignature, extra] = token.split(".");
  if (!encodedPayload || !suppliedSignature || extra) return new Set();

  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
  } catch {
    return new Set();
  }
  const expected = Buffer.from(signature(payload, key));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return new Set();

  const [day, rawIds, extraPart] = payload.split("|");
  if (day !== getToday() || rawIds === undefined || extraPart !== undefined) return new Set();
  return new Set(rawIds.split(",").filter((id) => UUID_PATTERN.test(id)).slice(0, MAX_PROFILE_IDS));
}

function maxAgeUntilTomorrow(): number {
  const now = new Date();
  const tomorrowUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.max(1, Math.floor((tomorrowUtc - now.getTime()) / 1000));
}

export function prepareProfileViewCount(request: NextRequest, profileId: string): {
  shouldCount: boolean;
  cookie?: { name: string; value: string; maxAge: number };
} {
  const key = signingKey();
  if (!key || !UUID_PATTERN.test(profileId)) return { shouldCount: false };

  const seenIds = parseSeenIds(request, key);
  if (seenIds.has(profileId) || seenIds.size >= MAX_PROFILE_IDS) return { shouldCount: false };
  seenIds.add(profileId);
  const payload = `${getToday()}|${[...seenIds].join(",")}`;
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const value = `${encodedPayload}.${signature(payload, key)}`;
  return {
    shouldCount: true,
    cookie: { name: COOKIE_NAME, value, maxAge: maxAgeUntilTomorrow() },
  };
}
