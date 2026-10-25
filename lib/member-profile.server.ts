import "server-only";

import { getSupabaseProfileId } from "@/lib/supabase-rest.server";

export async function getMemberProfileId(clerkUserId: string): Promise<string | null> {
  return getSupabaseProfileId(clerkUserId);
}
