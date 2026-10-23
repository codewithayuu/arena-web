import { syncAccountMutation } from "@/lib/account-sync-queue";

export async function loadLearningBookmarks(): Promise<string[] | null> {
  try {
    const response = await fetch("/api/learning/bookmarks", { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json() as { lessonKeys?: unknown };
    return Array.isArray(payload.lessonKeys) ? payload.lessonKeys.filter((key): key is string => typeof key === "string") : null;
  } catch {
    return null;
  }
}

export function setLearningBookmark(lessonKey: string, bookmarked: boolean, userId?: string | null): Promise<boolean> {
  return syncAccountMutation({
    key: `learning-bookmark:${lessonKey}`,
    path: "/api/learning/bookmarks",
    method: "PUT",
    body: { lessonKey, bookmarked },
  }, userId);
}
