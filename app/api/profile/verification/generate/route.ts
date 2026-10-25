import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PLATFORM_CONFIGS } from "@/lib/platform-verification-config";
import {
  cleanPlatformHandle,
  createVerificationToken,
  newVerificationChallenge,
  SUPPORTED_VERIFICATION_PLATFORMS,
  type SupportedVerificationPlatform,
} from "@/lib/platform-verification";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { isMemberConnectionPlatform } from "@/lib/member-platforms";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ success: false, message: "Sign in to verify a profile." }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "platform-verification",
    identity: userId,
    limit: 10,
    windowSeconds: 15 * 60,
  });
  if (rateLimit) return rateLimit;
  try {
    const raw = await request.text();
    if (raw.length > 4000) return NextResponse.json({ success: false, message: "Request is too large." }, { status: 413 });
    const body = JSON.parse(raw) as { platform?: unknown; handle?: unknown } | null;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ success: false, message: "Invalid verification request." }, { status: 400 });
    }
    const platform = typeof body?.platform === "string" ? body.platform.toLowerCase().trim() : "";
    const rawHandle = typeof body?.handle === "string" ? body.handle : "";
    if (!SUPPORTED_VERIFICATION_PLATFORMS.includes(platform as SupportedVerificationPlatform)) {
      return NextResponse.json({ success: false, message: "Choose a supported coding platform." }, { status: 422 });
    }
    const platformKey = platform as SupportedVerificationPlatform;
    const handle = cleanPlatformHandle(platformKey, rawHandle);
    if (!handle || handle.length > 100 || !/^[A-Za-z0-9_.-]+$/.test(handle)) {
      return NextResponse.json({ success: false, message: "Enter a valid profile handle." }, { status: 400 });
    }
    const challenge = newVerificationChallenge(userId, platformKey, handle);
    const challengeToken = createVerificationToken(challenge);
    const config = PLATFORM_CONFIGS[platformKey];
    if (isMemberConnectionPlatform(platformKey)) {
      const profileId = await resolveTopicListProfile(userId);
      if (!profileId) return NextResponse.json({ success: false, message: "Your account profile is still being provisioned." }, { status: 404 });

      const expiredUrl = supabaseRestUrl("profile_platform_verification_challenges");
      expiredUrl.search = new URLSearchParams({ expires_at: `lt.${new Date().toISOString()}` }).toString();
      await supabaseRequest(expiredUrl, { method: "DELETE", headers: { prefer: "return=minimal" } });

      const challengeUrl = supabaseRestUrl("profile_platform_verification_challenges");
      const persisted = await supabaseRequest(challengeUrl, {
        method: "POST",
        headers: { "content-type": "application/json", prefer: "return=minimal" },
        body: JSON.stringify({
          nonce: challenge.nonce,
          profile_id: profileId,
          clerk_user_id: userId,
          platform: platformKey,
          handle,
          challenge_code: challenge.code,
          expires_at: new Date(challenge.expiresAt).toISOString(),
        }),
      });
      if (!persisted.ok) {
        return NextResponse.json(
          { success: false, message: "Verification storage is temporarily unavailable. Try again shortly." },
          { status: 503 }
        );
      }
    }
    return NextResponse.json({
      success: true,
      data: {
        platform: platformKey,
        platformName: config.name,
        handle,
        verificationCode: challenge.code,
        challengeToken,
        settingsUrl: config.settingsUrl,
        targetField: config.targetField,
        description: config.description,
        expiresInSeconds: 900,
      },
    });
  } catch (error) {
    const message = error instanceof Error && error.message === "Platform verification is not configured"
      ? error.message
      : "Could not create a verification challenge.";
    return NextResponse.json({ success: false, message }, { status: message.includes("not configured") ? 503 : 400 });
  }
}
