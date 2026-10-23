import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/topic-list-data";
import { resolveTopicListProfile, topicListError } from "@/lib/topic-list-server.server";
import { supabaseReadAll, supabaseRestUrl } from "@/lib/supabase-rest.server";
import { AURA_CONSTANTS } from "@/lib/aura-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProgressRow = { item_key: string; status: "started" | "completed" | "not_started" };
type CheckinRow = { checkin_date: string; points_awarded: number };

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to load Aura" }, { status: 401 });
  try {
    const profileId = await resolveTopicListProfile(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const progressUrl = supabaseRestUrl("learning_progress");
    progressUrl.search = new URLSearchParams({ select: "item_key,status", profile_id: `eq.${profileId}`, order: "item_key.asc" }).toString();
    const checkinsUrl = supabaseRestUrl("topic_list_checkins");
    checkinsUrl.search = new URLSearchParams({ select: "checkin_date,points_awarded", profile_id: `eq.${profileId}`, order: "checkin_date.asc" }).toString();
    const [progress, checkins] = await Promise.all([
      supabaseReadAll<ProgressRow>(progressUrl),
      supabaseReadAll<CheckinRow>(checkinsUrl),
    ]);

    const completedTopicIds = progress.filter((item) => item.item_key.startsWith("topic:") && item.status === "completed").map((item) => item.item_key.slice(6));
    const practicingTopicIds = progress.filter((item) => item.item_key.startsWith("topic:") && item.status === "started").map((item) => item.item_key.slice(6));
    const solvedProblemIds = progress.filter((item) => item.item_key.startsWith("problem:") && item.status === "completed").map((item) => item.item_key.slice(8));
    const completed = new Set(completedTopicIds);
    let categoryAura = 0;
    for (const category of CATEGORIES) {
      const ids = category.sub_categories.flatMap((sub) => sub.topics.map((topic) => topic.topic_id));
      if (!ids.length) continue;
      const percent = Math.round((ids.filter((id) => completed.has(id)).length / ids.length) * 100);
      if (percent >= AURA_CONSTANTS.CATEGORY_BRONZE_PERCENT) categoryAura += AURA_CONSTANTS.CATEGORY_BRONZE_POINTS;
      if (percent >= AURA_CONSTANTS.CATEGORY_SILVER_PERCENT) categoryAura += AURA_CONSTANTS.CATEGORY_SILVER_POINTS;
      if (percent >= AURA_CONSTANTS.CATEGORY_GOLD_PERCENT) categoryAura += AURA_CONSTANTS.CATEGORY_GOLD_POINTS;
    }

    const dates = [...new Set(checkins.map((row) => row.checkin_date.slice(0, 10)))].sort();
    const today = new Date().toISOString().slice(0, 10);
    const yesterdayDate = new Date();
    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);
    const yesterday = yesterdayDate.toISOString().slice(0, 10);
    let currentStreak = 0;
    let cursor = new Date(`${(dates.includes(today) ? today : yesterday)}T00:00:00.000Z`);
    while (dates.includes(cursor.toISOString().slice(0, 10))) {
      currentStreak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    let bestStreak = 0;
    let run = 0;
    let previous: number | null = null;
    for (const date of dates) {
      const stamp = Date.parse(`${date}T00:00:00.000Z`);
      run = previous !== null && stamp - previous === 86_400_000 ? run + 1 : 1;
      previous = stamp;
      bestStreak = Math.max(bestStreak, run);
    }
    const lastCheckInDate = dates.at(-1) ?? null;
    const totalStreakAura = checkins.reduce((sum, row) => sum + Number(row.points_awarded || 0), 0);
    const totalAura =
      completedTopicIds.length * AURA_CONSTANTS.TOPIC_COMPLETED_POINTS +
      practicingTopicIds.filter((id) => !completed.has(id)).length * AURA_CONSTANTS.TOPIC_STARTED_POINTS +
      solvedProblemIds.length * AURA_CONSTANTS.PROBLEM_SOLVED_POINTS +
      categoryAura + totalStreakAura;

    return NextResponse.json({
      completedTopicIds,
      practicingTopicIds,
      solvedProblemIds,
      dailyStreak: {
        currentStreak,
        bestStreak,
        totalCheckIns: dates.length,
        lastCheckInDate,
        totalStreakAura,
      },
      totalAura,
    });
  } catch {
    return topicListError();
  }
}
