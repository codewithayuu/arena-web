import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseReadAll, supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckinRow { checkin_date: string; points_awarded: number }

function summarize(rows: CheckinRow[]) {
  const dates = [...new Set(rows.map((row) => row.checkin_date.slice(0, 10)))].sort();
  const today = new Date().toISOString().slice(0, 10);
  const yesterdayDate = new Date();
  yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
  const yesterday = yesterdayDate.toISOString().slice(0, 10);
  let current = 0;
  const start = dates.includes(today) ? today : yesterday;
  let cursor = new Date(`${start}T00:00:00.000Z`);
  while (dates.includes(cursor.toISOString().slice(0, 10))) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  let best = 0;
  let run = 0;
  let prior: string | null = null;
  for (const date of dates) {
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (prior) {
      const previous = new Date(`${prior}T00:00:00.000Z`);
      if (parsed.getTime() - previous.getTime() === 86_400_000) run += 1;
      else run = 1;
    } else run = 1;
    prior = date;
    best = Math.max(best, run);
  }
  return {
    dates,
    currentStreak: current,
    bestStreak: best,
    totalCheckins: dates.length,
    claimedToday: dates.includes(today),
    totalPoints: rows.reduce((sum, row) => sum + Number(row.points_awarded || 0), 0),
  };
}

async function checkins(profileId: string): Promise<CheckinRow[]> {
  const url = supabaseRestUrl("topic_list_checkins");
  url.search = new URLSearchParams({
    select: "checkin_date,points_awarded",
    profile_id: `eq.${profileId}`,
    order: "checkin_date.asc",
  }).toString();
  return supabaseReadAll<CheckinRow>(url);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to access check-ins" }, { status: 401 });
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    return NextResponse.json(summarize(await checkins(profileId)));
  } catch {
    return topicListError();
  }
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to claim a check-in" }, { status: 401 });
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const response = await supabaseRequest(supabaseRestUrl("rpc/claim_topic_list_checkin"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ p_profile_id: profileId }),
    });
    if (!response.ok) return topicListError();
    const rows = (await response.json()) as Array<{
      claimed: boolean;
      current_streak: number;
      best_streak: number;
      total_checkins: number;
      points_awarded: number;
    }>;
    const row = rows[0];
    return NextResponse.json({
      success: Boolean(row?.claimed),
      currentStreak: Number(row?.current_streak ?? 0),
      bestStreak: Number(row?.best_streak ?? 0),
      totalCheckins: Number(row?.total_checkins ?? 0),
      pointsAwarded: Number(row?.points_awarded ?? 0),
    });
  } catch {
    return topicListError();
  }
}
