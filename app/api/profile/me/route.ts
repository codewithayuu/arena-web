import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ensureClerkProfileData } from "@/lib/clerk-profile.server";
import { getProfileContestHistory } from "@/lib/profile-contest-history.server";
import { supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";
import type { SupportedVerificationPlatform } from "@/lib/platform-verification";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PlatformRow = {
  platform: SupportedVerificationPlatform;
  handle: string;
  total_questions_solved: number | null;
  current_rating: number | null;
  max_rating: number | null;
  rank: string | null;
  verified_at: string;
  last_synced_at: string | null;
  profile_stats: Record<string, unknown>;
};

function responseError() {
  return NextResponse.json({ error: "Profile service is temporarily unavailable" }, { status: 503 });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to access your profile" }, { status: 401 });

  try {
    const identity = await currentUser();
    if (!identity || identity.id !== userId) {
      return NextResponse.json({ error: "Your Clerk session could not be confirmed" }, { status: 401 });
    }
    const { profile, details } = await ensureClerkProfileData(identity);
    const platformsUrl = supabaseRestUrl("profile_platform_accounts");
    platformsUrl.search = new URLSearchParams({
      select: "platform,handle,total_questions_solved,current_rating,max_rating,rank,verified_at,last_synced_at,profile_stats",
      profile_id: `eq.${profile.id}`,
      order: "platform.asc",
    }).toString();
    const [platformsResponse, contestHistory] = await Promise.all([
      supabaseRequest(platformsUrl, { method: "GET" }),
      getProfileContestHistory(profile.id, profile.handle),
    ]);
    if (!platformsResponse.ok) return responseError();
    const platforms = (await platformsResponse.json()) as PlatformRow[];
    let profileViews: number | null = null;
    try {
      const viewsUrl = supabaseRestUrl("profile_view_counts");
      viewsUrl.search = new URLSearchParams({ select: "view_count", profile_id: `eq.${profile.id}`, limit: "1" }).toString();
      const viewsResponse = await supabaseRequest(viewsUrl, { method: "GET" });
      if (viewsResponse.ok) {
        const viewRows = await viewsResponse.json() as Array<{ view_count: number | string }>;
        const count = viewRows[0] ? Number(viewRows[0].view_count) : 0;
        if (Number.isSafeInteger(count) && count >= 0) profileViews = count;
      }
    } catch {
      // Profile views are optional until the profile-view migration is applied.
    }
    return NextResponse.json({
      profile: {
        id: profile.id,
        handle: profile.handle,
        display_name: [details.first_name, details.second_name].filter(Boolean).join(" ") || profile.display_name,
        views: profileViews,
      },
      details,
      platforms,
      arenaContests: contestHistory.items,
      arenaContestHistoryStatus: contestHistory.status,
    });
  } catch {
    return responseError();
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to update your profile" }, { status: 401 });

  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 12_000) return NextResponse.json({ error: "Profile details are too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid profile details" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const firstName = input.firstName;
  const secondName = input.secondName;
  const details = input.details;
  if (
    typeof firstName !== "string" || firstName.trim().length < 1 || firstName.trim().length > 80 ||
    typeof secondName !== "string" || secondName.trim().length > 80 ||
    !details || typeof details !== "object" || Array.isArray(details)
  ) {
    return NextResponse.json({ error: "Invalid profile details" }, { status: 400 });
  }
  const source = details as Record<string, unknown>;
  const textLimits: Record<string, number> = {
    bio: 500, country: 100, college: 200, degree: 120, branch: 120, imageUrl: 2048,
  };
  const clean: Record<string, string | number> = {};
  for (const [key, max] of Object.entries(textLimits)) {
    const value = source[key];
    if (typeof value !== "string" || value.trim().length > max) {
      return NextResponse.json({ error: `Invalid ${key}` }, { status: 400 });
    }
    clean[key] = value.trim();
  }
  const imageUrl = clean.imageUrl as string;
  if (imageUrl) {
    try {
      if (new URL(imageUrl).protocol !== "https:") throw new Error("invalid image url");
    } catch {
      return NextResponse.json({ error: "Profile image URL must use HTTPS" }, { status: 400 });
    }
  }
  const year = source.yearOfGraduation;
  const preference = source.jobPreference;
  if (!Number.isInteger(year) || (year as number) < 0 || (year as number) > 2200) {
    return NextResponse.json({ error: "Invalid graduation year" }, { status: 400 });
  }
  if (!Number.isInteger(preference) || (preference as number) < 0 || (preference as number) > 10) {
    return NextResponse.json({ error: "Invalid job preference" }, { status: 400 });
  }

  try {
    const identity = await currentUser();
    if (!identity || identity.id !== userId) {
      return NextResponse.json({ error: "Your Clerk session could not be confirmed" }, { status: 401 });
    }
    const { profile } = await ensureClerkProfileData(identity);
    const detailsUrl = supabaseRestUrl("profile_details");
    detailsUrl.search = "on_conflict=profile_id";
    const detailsResponse = await supabaseRequest(detailsUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        profile_id: profile.id,
        first_name: firstName.trim(),
        second_name: secondName.trim(),
        bio: clean.bio,
        country: clean.country,
        college: clean.college,
        degree: clean.degree,
        branch: clean.branch,
        image_url: imageUrl,
        year_of_graduation: year,
        job_preference: preference,
        updated_at: new Date().toISOString(),
      }),
    });
    if (!detailsResponse.ok) return responseError();
    return NextResponse.json({ success: true });
  } catch {
    return responseError();
  }
}
