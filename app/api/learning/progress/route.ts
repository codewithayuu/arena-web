import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { isValidLearningProgressKey } from "@/lib/learning-progress-catalog.server";
import { supabaseReadAll, supabaseRequest, supabaseRestUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProgressItem {
  item_key: string;
  status: "started" | "completed" | "skipped" | "not_started";
  updated_at: string;
  completed_at: string | null;
}

async function getProfileId(clerkUserId: string): Promise<string | null> {
  const url = supabaseRestUrl("profiles");
  url.search = new URLSearchParams({
    select: "id",
    clerk_user_id: `eq.${clerkUserId}`,
    limit: "1",
  }).toString();
  const response = await supabaseRequest(url, { method: "GET" });
  if (!response.ok) throw new Error("Profile lookup failed");
  const rows = (await response.json()) as Array<{ id: string }>;
  return rows[0]?.id ?? null;
}

function unavailable() {
  return NextResponse.json({ error: "Learning progress is temporarily unavailable" }, { status: 503 });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to access learning progress" }, { status: 401 });
  try {
    const profileId = await getProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const url = supabaseRestUrl("learning_progress");
    url.search = new URLSearchParams({
      select: "item_key,status,updated_at,completed_at",
      profile_id: `eq.${profileId}`,
      order: "updated_at.desc,item_key.asc",
    }).toString();
    const items = await supabaseReadAll<ProgressItem>(url);
    return NextResponse.json({ items: items.filter((item) => isValidLearningProgressKey(item.item_key)) });
  } catch {
    return unavailable();
  }
}

export async function PUT(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to save learning progress" }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "learning-progress-write",
    identity: userId,
    limit: 60,
    windowSeconds: 60,
  });
  if (rateLimit) return rateLimit;
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 50_000) return NextResponse.json({ error: "Progress update is too large" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid progress update" }, { status: 400 });
  }
  const items = (body as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length < 1 || items.length > 200) {
    return NextResponse.json({ error: "Progress update must contain 1 to 200 items" }, { status: 400 });
  }
  const keys = new Set<string>();
  const parsed: Array<{ item_key: string; status: "started" | "completed" | "skipped" | "not_started" }> = [];
  for (const item of items) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return NextResponse.json({ error: "Invalid progress item" }, { status: 400 });
    }
    const value = item as { key?: unknown; status?: unknown };
    if (
      typeof value.key !== "string" || value.key.trim().length < 1 || value.key.trim().length > 160 ||
      (value.status !== "started" && value.status !== "completed" && value.status !== "skipped" && value.status !== "not_started")
    ) {
      return NextResponse.json({ error: "Invalid progress item" }, { status: 400 });
    }
    const key = value.key.trim();
    if (!isValidLearningProgressKey(key)) {
      return NextResponse.json({ error: "Unknown learning progress item" }, { status: 400 });
    }
    if (value.status === "skipped" && !key.startsWith("topic:")) {
      return NextResponse.json({ error: "Only topics can be marked skipped" }, { status: 400 });
    }
    if (keys.has(key)) return NextResponse.json({ error: "Duplicate progress item" }, { status: 400 });
    keys.add(key);
    parsed.push({ item_key: key, status: value.status });
  }

  try {
    const profileId = await getProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    const now = new Date().toISOString();
    const url = supabaseRestUrl("learning_progress");
    url.search = "on_conflict=profile_id%2Citem_key";
    const response = await supabaseRequest(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(parsed.map((item) => ({
        profile_id: profileId,
        item_key: item.item_key,
        status: item.status,
        updated_at: now,
        completed_at: item.status === "completed" ? now : null,
      }))),
    });
    if (!response.ok) return unavailable();
    return NextResponse.json({ success: true });
  } catch {
    return unavailable();
  }
}
