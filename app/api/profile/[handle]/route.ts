import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseRequest, supabaseRestUrl, supabaseRpcUrl } from "@/lib/supabase-rest.server";
import { prepareProfileViewCount } from "@/lib/profile-view-cookie.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { userId } = await auth();
  const { handle } = await params;
  if (!/^[A-Za-z0-9_.-]{1,80}$/.test(handle)) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  try {
    const profileUrl = supabaseRestUrl("profiles");
    profileUrl.search = new URLSearchParams({
      select: "id,handle,display_name,clerk_user_id",
      handle: `eq.${handle}`,
      limit: "1",
    }).toString();
    const profileResponse = await supabaseRequest(profileUrl, { method: "GET" });
    if (!profileResponse.ok) throw new Error("Profile lookup failed");
    const profiles = (await profileResponse.json()) as Array<{ id: string; handle: string; display_name: string; clerk_user_id: string | null }>;
    const profile = profiles[0];
    if (!profile || profile.handle.startsWith("deleted_")) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const detailsUrl = supabaseRestUrl("profile_details");
    detailsUrl.search = new URLSearchParams({
      select: "first_name,second_name,bio,country,college,degree,branch,image_url,year_of_graduation,job_preference",
      profile_id: `eq.${profile.id}`,
      limit: "1",
    }).toString();
    const detailsResponse = await supabaseRequest(detailsUrl, { method: "GET" });
    if (!detailsResponse.ok) throw new Error("Profile details lookup failed");
    const details = ((await detailsResponse.json()) as Array<Record<string, unknown>>)[0] ?? {
      first_name: "",
      second_name: "",
      bio: "",
      country: "",
      college: "",
      degree: "",
      branch: "",
      image_url: "",
      year_of_graduation: 0,
      job_preference: 0,
    };
    const platformsUrl = supabaseRestUrl("profile_platform_accounts");
    platformsUrl.search = new URLSearchParams({
      select: "platform,handle,total_questions_solved,current_rating,max_rating,rank,verified_at,last_synced_at,profile_stats",
      profile_id: `eq.${profile.id}`,
      order: "platform.asc",
    }).toString();
    const platformsResponse = await supabaseRequest(platformsUrl, { method: "GET" });
    if (!platformsResponse.ok) throw new Error("Profile platforms lookup failed");
    const isOwner = Boolean(userId && profile.clerk_user_id === userId);
    const viewAttempt = isOwner ? { shouldCount: false } : prepareProfileViewCount(request, profile.id);
    let profileViews: number | null = null;
    let viewRecorded = false;
    try {
      if (viewAttempt.shouldCount) {
        const incrementResponse = await supabaseRequest(supabaseRpcUrl("increment_profile_view_count"), {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ target_profile_id: profile.id }),
        });
        if (incrementResponse.ok) {
          const count = await incrementResponse.json() as number | string;
          const parsed = typeof count === "number" ? count : Number(count);
          if (Number.isSafeInteger(parsed) && parsed >= 0) {
            profileViews = parsed;
            viewRecorded = true;
          }
        }
      }
      if (profileViews === null) {
        const countUrl = supabaseRestUrl("profile_view_counts");
        countUrl.search = new URLSearchParams({
          select: "view_count",
          profile_id: `eq.${profile.id}`,
          limit: "1",
        }).toString();
        const countResponse = await supabaseRequest(countUrl, { method: "GET" });
        if (countResponse.ok) {
          const rows = await countResponse.json() as Array<{ view_count: number | string }>;
          const parsed = rows[0] ? Number(rows[0].view_count) : 0;
          if (Number.isSafeInteger(parsed) && parsed >= 0) profileViews = parsed;
        }
      }
    } catch {
      // View counting is ancillary; profile content still loads if its migration is pending.
    }

    const response = NextResponse.json({
      profile: {
        handle: profile.handle,
        display_name: [details.first_name, details.second_name].filter(Boolean).join(" ") || profile.display_name,
        views: profileViews,
      },
      details,
      platforms: await platformsResponse.json(),
      isOwner,
    });
    if (viewAttempt.cookie && viewRecorded) {
      response.cookies.set(viewAttempt.cookie.name, viewAttempt.cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: viewAttempt.cookie.maxAge,
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "Profile service is temporarily unavailable" }, { status: 503 });
  }
}
