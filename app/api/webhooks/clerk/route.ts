import { clerkClient } from "@clerk/nextjs/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { deleteMemberWebData } from "@/lib/topic-comments-db";
import { parseSignupProfileMetadata } from "@/lib/signup-profile";
import { syncSignupProfileDetails } from "@/lib/signup-profile-sync.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_WEBHOOK_BYTES = 256 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function profileUuid(clerkUserId: string, legacyProfileId?: string | null): string {
  if (legacyProfileId && UUID_PATTERN.test(legacyProfileId)) return legacyProfileId.toLowerCase();
  const bytes = createHash("sha256")
    .update("mindflare.clerk-profile.v1\0", "utf8")
    .update(clerkUserId, "utf8")
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function sanitizeHandle(username: string | null | undefined): string | null {
  if (typeof username !== "string") return null;
  const cleaned = username.trim();
  if (!/^[A-Za-z0-9_.-]{1,80}$/.test(cleaned)) return null;
  return cleaned;
}

function profileHandle(clerkUserId: string, username?: string | null): string {
  const custom = sanitizeHandle(username);
  if (custom) return custom;
  return `user_${createHash("sha256").update(clerkUserId).digest("hex").slice(0, 24)}`;
}

function displayName(data: {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
}): string {
  const name = [data.first_name, data.last_name]
    .filter((part): part is string => typeof part === "string")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .slice(0, 120);
  if (name) return name;
  const username = typeof data.username === "string" ? data.username.trim() : "";
  return (username || "Arena learner").slice(0, 120);
}

function supabaseProfilesUrl(): URL {
  const raw = process.env.SUPABASE_URL;
  if (!raw) throw new Error("profile database is not configured");
  const base = new URL(raw);
  if (
    base.protocol !== "https:" ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    !["", "/"].includes(base.pathname)
  ) {
    throw new Error("profile database configuration is invalid");
  }
  base.pathname = "/rest/v1/profiles";
  base.search = "?on_conflict=clerk_user_id";
  return base;
}

function supabaseDeleteWebDataUrl(): URL {
  const profilesUrl = supabaseProfilesUrl();
  profilesUrl.pathname = "/rest/v1/rpc/delete_clerk_web_data";
  profilesUrl.search = "";
  return profilesUrl;
}

function userRateLimitKeys(clerkUserId: string): string[] {
  return ["topic-comments-write", "topic-comment-vote", "platform-verification", "topic-list-clap"]
    .map((scope) => createHash("sha256").update(`${scope}\0${clerkUserId}`).digest("hex"));
}

async function boundedWebhookRequest(request: NextRequest): Promise<NextRequest | null> {
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_WEBHOOK_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new NextRequest(request.url, {
    method: "POST",
    headers: request.headers,
    body: Buffer.concat(chunks.map((chunk) => Buffer.from(chunk)), total),
  });
}

export async function POST(request: NextRequest) {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_WEBHOOK_BYTES)) {
    return new NextResponse("Webhook payload too large", { status: 413 });
  }
  if (request.headers.get("content-encoding") && request.headers.get("content-encoding") !== "identity") {
    return new NextResponse("Compressed webhook payloads are unsupported", { status: 415 });
  }

  let verificationRequest: NextRequest | null;
  try {
    verificationRequest = await boundedWebhookRequest(request);
  } catch {
    return new NextResponse("Webhook body could not be read", { status: 400 });
  }
  if (!verificationRequest) {
    return new NextResponse("Webhook payload too large or empty", { status: 413 });
  }

  let event;
  try {
    event = await verifyWebhook(verificationRequest);
  } catch {
    return new NextResponse("Webhook signature verification failed", { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated" && event.type !== "user.deleted") {
    return new NextResponse(null, { status: 204 });
  }

  const data = event.data;
  const clerkId = typeof data.id === "string" ? data.id : "";
  if (!/^user_[A-Za-z0-9_-]{1,250}$/.test(clerkId)) {
    return new NextResponse("Invalid Clerk user identity", { status: 400 });
  }
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return new NextResponse("Profile synchronization is unavailable", { status: 503 });
  }

  let url: URL;
  try {
    url = supabaseProfilesUrl();
  } catch {
    return new NextResponse("Profile synchronization is unavailable", { status: 503 });
  }
  try {
    const headers = {
      apikey: serviceKey,
      authorization: `Bearer ${serviceKey}`,
      "content-type": "application/json",
    };
    if (event.type === "user.deleted") {
      // Clean Neon first. Both operations are idempotent, so Clerk retries can
      // safely finish the Supabase cleanup if either store is temporarily down.
      await deleteMemberWebData(clerkId);
      const deletionResponse = await fetch(supabaseDeleteWebDataUrl(), {
        method: "POST",
        headers,
        body: JSON.stringify({
          p_clerk_user_id: clerkId,
          p_profile_id: profileUuid(clerkId, data.external_id),
          p_profile_handle: profileHandle(clerkId),
          p_rate_limit_keys: userRateLimitKeys(clerkId),
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (!deletionResponse.ok) return new NextResponse("Member data deletion failed", { status: 503 });
      return new NextResponse(null, { status: 204 });
    }
    const userData = event.data;
    const profile = {
      id: profileUuid(clerkId, userData.external_id),
      clerk_user_id: clerkId,
      handle: profileHandle(clerkId, typeof userData.username === "string" ? userData.username : undefined),
      display_name: displayName(userData),
    };
    const createResponse = await fetch(url, {
      method: "POST",
      headers: {
        ...headers,
        prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(profile),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!createResponse.ok) {
      return new NextResponse("Profile synchronization failed", { status: 503 });
    }
    const updateUrl = new URL(url);
    const legacyProfileId =
      data.external_id && UUID_PATTERN.test(data.external_id) ? data.external_id.toLowerCase() : null;
    updateUrl.search = new URLSearchParams(
      legacyProfileId
        ? { id: `eq.${legacyProfileId}` }
        : { clerk_user_id: `eq.${clerkId}` },
    ).toString();
    const patchBody: Record<string, string> = {
      clerk_user_id: clerkId,
      display_name: profile.display_name,
    };
    const customHandle = sanitizeHandle(typeof userData.username === "string" ? userData.username : undefined);
    if (customHandle) {
      patchBody.handle = customHandle;
    }
    const updateResponse = await fetch(updateUrl, {
      method: "PATCH",
      headers: { ...headers, prefer: "return=minimal" },
      body: JSON.stringify(patchBody),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!updateResponse.ok) {
      return new NextResponse("Profile synchronization failed", { status: 503 });
    }

    const rawUnsafeMetadata = (userData as typeof userData & { unsafe_metadata?: unknown }).unsafe_metadata;
    const unsafeMetadata = rawUnsafeMetadata && typeof rawUnsafeMetadata === "object" && !Array.isArray(rawUnsafeMetadata)
      ? rawUnsafeMetadata as Record<string, unknown>
      : null;
    const hasSignupProfilePayload = Boolean(
      unsafeMetadata &&
      Object.prototype.hasOwnProperty.call(unsafeMetadata, "mindflareSignupProfile") &&
      unsafeMetadata.mindflareSignupProfile !== null,
    );
    const signupProfile = parseSignupProfileMetadata(unsafeMetadata?.mindflareSignupProfile);
    if (signupProfile) {
      await syncSignupProfileDetails(profile.id, signupProfile);
      const updateHandleUrl = new URL(url);
      updateHandleUrl.search = new URLSearchParams({ id: `eq.${profile.id}` }).toString();
      await fetch(updateHandleUrl, {
        method: "PATCH",
        headers: { ...headers, prefer: "return=minimal" },
        body: JSON.stringify({ handle: signupProfile.username }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      }).catch(() => {});
    }
    if (hasSignupProfilePayload) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(clerkId, {
        unsafeMetadata: { mindflareSignupProfile: null },
      });
    }
  } catch {
    return new NextResponse("Profile synchronization unavailable", { status: 503 });
  }

  return new NextResponse(null, { status: 204 });
}
