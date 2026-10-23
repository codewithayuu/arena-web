import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PLATFORM_CONFIGS } from "@/lib/platform-verification-config";
import { fetchPlatformProfile } from "@/lib/profile-platform-providers.mjs";
import { verifyVerificationToken } from "@/lib/platform-verification";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl, supabaseRpcUrl } from "@/lib/supabase-rest.server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { isMemberConnectionPlatform } from "@/lib/member-platforms";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ success: false, verified: false, message: "Sign in to verify a profile." }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "platform-verification",
    identity: userId,
    limit: 10,
    windowSeconds: 15 * 60,
  });
  if (rateLimit) return rateLimit;

  try {
    const raw = await request.text();
    if (raw.length > 8000) return NextResponse.json({ success: false, verified: false, message: "Request is too large." }, { status: 413 });
    const body = JSON.parse(raw) as { challengeToken?: unknown };
    if (typeof body.challengeToken !== "string" || body.challengeToken.length > 4000) {
      return NextResponse.json({ success: false, verified: false, message: "A valid verification challenge is required." }, { status: 400 });
    }
    const challenge = verifyVerificationToken(body.challengeToken);
    if (!challenge || challenge.userId !== userId) {
      return NextResponse.json({ success: false, verified: false, message: "Verification challenge is invalid or expired. Start again." }, { status: 401 });
    }

    let providerProfile;
    try {
      // Keep verification responsive; the Render sync fills in long AtCoder histories.
      providerProfile = await fetchPlatformProfile(challenge.platform, challenge.handle, { includeExtended: false });
    } catch (error) {
      if (error instanceof Error && error.message === "Profile not found") {
        return NextResponse.json({ success: false, verified: false, errorType: "PROFILE_NOT_FOUND", message: `That ${PLATFORM_CONFIGS[challenge.platform].name} profile could not be found or is private.` }, { status: 422 });
      }
      return NextResponse.json({ success: false, verified: false, message: `${PLATFORM_CONFIGS[challenge.platform].name} is temporarily unavailable. Try again later.` }, { status: 503 });
    }
    if (!providerProfile.verificationText.toLowerCase().includes(challenge.code.toLowerCase())) {
      return NextResponse.json({
        success: false,
        verified: false,
        errorType: "CODE_NOT_FOUND",
        message: `The verification code was not found in the public ${PLATFORM_CONFIGS[challenge.platform].name} profile. Check the profile and try again.`,
      }, { status: 200 });
    }
    const totalQuestionsSolved = providerProfile.stats.totalQuestionsSolved;
    const currentRating = providerProfile.stats.currentRating;
    const maxRating = providerProfile.stats.maxRating;
    const rank = providerProfile.stats.rank;

    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ success: false, verified: false, message: "Your account profile is still being provisioned." }, { status: 404 });
    if (isMemberConnectionPlatform(challenge.platform)) {
      const saved = await supabaseRequest(supabaseRpcUrl("complete_profile_platform_verification"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          p_nonce: challenge.nonce,
          p_clerk_user_id: userId,
          p_profile_id: profileId,
          p_platform: challenge.platform,
          p_handle: challenge.handle,
          p_challenge_code: challenge.code,
          p_total_questions_solved: totalQuestionsSolved ?? null,
          p_current_rating: currentRating === undefined ? null : Math.round(currentRating),
          p_max_rating: maxRating === undefined ? null : Math.round(maxRating),
          p_rank: rank ?? null,
          p_profile_stats: providerProfile.profileStats,
          p_verified_at: new Date().toISOString(),
        }),
      });
      if (!saved.ok) {
        const message = await saved.text().catch(() => "");
        if (message.includes("platform_handle_already_linked")) {
          return NextResponse.json({ success: false, verified: false, message: "That platform profile is already connected to another account." }, { status: 409 });
        }
        if (message.includes("verification_challenge_invalid_or_used")) {
          return NextResponse.json({ success: false, verified: false, message: "This verification code has expired or was already used. Start a new verification." }, { status: 401 });
        }
        return topicListError();
      }
    } else {
    const platformUrl = supabaseRestUrl("profile_platform_accounts");
    platformUrl.search = "on_conflict=profile_id%2Cplatform";
    const saved = await supabaseRequest(platformUrl, {
      method: "POST",
      headers: { "content-type": "application/json", prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        profile_id: profileId,
        platform: challenge.platform,
        handle: challenge.handle,
        total_questions_solved: totalQuestionsSolved ?? null,
        current_rating: currentRating === undefined ? null : Math.round(currentRating),
        max_rating: maxRating === undefined ? null : Math.round(maxRating),
        rank: rank ?? null,
        profile_stats: providerProfile.profileStats,
        verified_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString(),
        // Leave the account due so the background sync can fetch extended public stats.
        sync_attempted_at: null,
        sync_error: null,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!saved.ok) {
      return topicListError();
    }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: `Your ${PLATFORM_CONFIGS[challenge.platform].name} profile has been verified.`,
      data: {
        platform: challenge.platform,
        userName: challenge.handle,
        isConnected: true,
        isVerified: true,
        ...(totalQuestionsSolved === undefined ? {} : { totalQuestionsSolved }),
        ...(currentRating === undefined ? {} : { currentRating }),
        ...(maxRating === undefined ? {} : { maxRating }),
        ...(rank === undefined ? {} : { rank }),
        profileStats: providerProfile.profileStats,
        lastSyncedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ success: false, verified: false, message: "Invalid JSON request." }, { status: 400 });
    return NextResponse.json({ success: false, verified: false, message: "Verification provider could not be reached. Try again later." }, { status: 503 });
  }
}
