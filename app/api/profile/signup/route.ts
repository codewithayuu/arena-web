import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ensureClerkProfileData } from "@/lib/clerk-profile.server";
import { parseSignupProfileMetadata } from "@/lib/signup-profile";
import { syncSignupProfileDetails } from "@/lib/signup-profile-sync.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function temporaryFailure() {
  return NextResponse.json({ error: "Profile sync is temporarily unavailable" }, { status: 503 });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save your profile" }, { status: 401 });

  try {
    const identity = await currentUser();
    if (!identity || identity.id !== userId) {
      return NextResponse.json({ error: "Your Clerk session could not be confirmed" }, { status: 401 });
    }
    const { profile } = await ensureClerkProfileData(identity);
    const unsafeMetadata = identity.unsafeMetadata as Record<string, unknown> | undefined;
    const signupProfile = parseSignupProfileMetadata(unsafeMetadata?.mindflareSignupProfile);

    if (signupProfile) {
      await syncSignupProfileDetails(profile.id, signupProfile);
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        unsafeMetadata: { mindflareSignupProfile: null },
      });
      return NextResponse.json({ success: true });
    }

    // The signed webhook may have completed and cleared the handoff before this
    // fast-path request arrived. Confirm its one-time sync marker before success.
    const detailsUrl = supabaseRestUrl("profile_details");
    detailsUrl.search = new URLSearchParams({
      select: "signup_profile_synced_at",
      profile_id: `eq.${profile.id}`,
      limit: "1",
    }).toString();
    const detailsResponse = await supabaseRequest(detailsUrl, { method: "GET" });
    if (!detailsResponse.ok) return temporaryFailure();
    const details = await detailsResponse.json() as Array<{ signup_profile_synced_at: string | null }>;
    if (details[0]?.signup_profile_synced_at) return NextResponse.json({ success: true });
    return NextResponse.json({ error: "Signup profile details are not available to sync" }, { status: 409 });
  } catch {
    return temporaryFailure();
  }
}
