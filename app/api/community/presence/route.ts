import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { enforceApiRateLimit } from "@/lib/api-rate-limit.server";
import { getSupabaseProfileId, supabaseRequest, supabaseRestUrl, supabaseRpcUrl } from "@/lib/supabase-rest.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE_WINDOW_MS = 2 * 60 * 1000;
const RETENTION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const RETENTION_CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
const MAX_ACTIVE_MEMBERS = 100;
let lastRetentionCleanupAttempt = 0;

async function cleanupExpiredPresence() {
  const now = Date.now();
  if (now - lastRetentionCleanupAttempt < RETENTION_CLEANUP_INTERVAL_MS) return;
  lastRetentionCleanupAttempt = now;
  const expiredPresenceUrl = supabaseRestUrl("member_presence");
  expiredPresenceUrl.search = new URLSearchParams({
    last_seen_at: `lt.${new Date(now - RETENTION_WINDOW_MS).toISOString()}`,
  }).toString();
  await supabaseRequest(expiredPresenceUrl, { method: "DELETE", headers: { prefer: "return=minimal" } });
}

interface ActiveMemberRow {
  active_count: number | string;
  handle: string;
  display_name: string;
  image_url: string;
}

export async function GET() {
  if (!process.env.SUPABASE_URL) {
    return NextResponse.json({ users: [], count: 0 }, { headers: { "cache-control": "public, s-maxage=15, stale-while-revalidate=15" } });
  }
  try {
    const cutoff = new Date(Date.now() - ACTIVE_WINDOW_MS).toISOString();
    const presenceResponse = await supabaseRequest(supabaseRpcUrl("list_active_member_presence"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ p_since: cutoff, p_limit: MAX_ACTIVE_MEMBERS }),
    });
    if (!presenceResponse.ok) throw new Error("Presence query failed");
    const rows = await presenceResponse.json() as ActiveMemberRow[];
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ users: [], count: 0 }, { headers: { "cache-control": "public, s-maxage=15, stale-while-revalidate=15" } });
    }
    const users = rows.map((row) => ({
      id: row.handle,
      name: (row.display_name.trim() || row.handle).slice(0, 80),
      imageUrl: row.image_url.slice(0, 2048),
    }));
    return NextResponse.json(
      { users, count: Number(rows[0].active_count) || users.length },
      { headers: { "cache-control": "public, s-maxage=15, stale-while-revalidate=15" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Presence is temporarily unavailable" },
      { status: 503, headers: { "cache-control": "no-store" } },
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to publish presence" }, { status: 401 });
  const rateLimit = await enforceApiRateLimit(request, {
    scope: "member-presence-heartbeat",
    identity: userId,
    limit: 20,
    windowSeconds: 60,
  });
  if (rateLimit) return rateLimit;

  try {
    const profileId = await getSupabaseProfileId(userId);
    if (!profileId) return NextResponse.json({ error: "Profile is still being provisioned" }, { status: 404 });
    // Opportunistically prune long-expired rows during real member activity;
    // this keeps presence cleanup bounded without a continuously running job.
    try {
      await cleanupExpiredPresence();
    } catch {
      // Heartbeats can still succeed if best-effort stale-row cleanup is unavailable.
    }
    const url = supabaseRestUrl("member_presence");
    url.search = "on_conflict=profile_id";
    const response = await supabaseRequest(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ profile_id: profileId, last_seen_at: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error("Presence write failed");
    return NextResponse.json({ success: true }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Presence is temporarily unavailable" }, { status: 503 });
  }
}
