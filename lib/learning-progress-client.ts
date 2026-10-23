import { syncAccountMutation } from "@/lib/account-sync-queue";

export type LearningStatus = "started" | "completed" | "skipped" | "not_started";

export interface LearningProgressItem {
  key: string;
  status: LearningStatus;
}

export async function loadLearningProgress(): Promise<Record<string, LearningStatus> | null> {
  try {
    const response = await fetch("/api/learning/progress", { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json() as { items?: Array<{ item_key: string; status: LearningStatus }> };
    if (!Array.isArray(data.items)) return null;
    return Object.fromEntries(data.items.map((item) => [item.item_key, item.status]));
  } catch {
    return null;
  }
}

export async function saveLearningProgress(items: LearningProgressItem[], userId?: string | null): Promise<boolean> {
  if (!items.length) return true;
  return syncAccountMutation({
    key: `learning-progress:${items.map((item) => item.key).sort().join(",")}`,
    path: "/api/learning/progress",
    method: "PUT",
    body: { items },
  }, userId);
}
