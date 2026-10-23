import "server-only";

import { getSupabaseProfileId } from "@/lib/supabase-rest.server";

export async function resolveTopicListProfile(clerkUserId: string): Promise<string | null> {
  return getSupabaseProfileId(clerkUserId);
}

export function topicListError() {
  return Response.json({ error: "Topic-list data is temporarily unavailable" }, { status: 503 });
}
