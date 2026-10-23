import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { resolveTopicListProfile } from "@/lib/topic-list-server.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { SUPPORTED_VERIFICATION_PLATFORMS, type SupportedVerificationPlatform } from "@/lib/platform-verification";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to disconnect a platform" }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "platform-disconnect",
    identity: userId,
    limit: 10,
    windowSeconds: 15 * 60,
  });
  if (rateLimit) return rateLimit;
  const platform = request.nextUrl.searchParams.get("platform");
  if (!SUPPORTED_VERIFICATION_PLATFORMS.includes(platform as SupportedVerificationPlatform)) {
    return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
  }
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("profile_platform_accounts");
    url.search = new URLSearchParams({ profile_id: `eq.${profileId}`, platform: `eq.${platform}` }).toString();
    const response = await supabaseRequest(url, { method: "DELETE", headers: { prefer: "return=minimal" } });
    if (!response.ok) return NextResponse.json({ error: "Could not disconnect the platform" }, { status: 503 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Profile service is temporarily unavailable" }, { status: 503 });
  }
}
