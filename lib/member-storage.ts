/** Browser caches are isolated by Clerk identity to avoid cross-account state bleed. */
export function memberStorageKey(key: string, clerkUserId?: string | null): string {
  return clerkUserId ? `mindflare_member:${clerkUserId}:${key}` : key;
}
