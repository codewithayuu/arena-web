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

  // Keep request bodies comfortably below the API's 200-item/50 KB limits.
  const batchSize = 100;
  const orderedItems = [...items].sort((left, right) => left.key.localeCompare(right.key));
  let allSaved = true;

  for (let offset = 0; offset < orderedItems.length; offset += batchSize) {
    const batch = orderedItems.slice(offset, offset + batchSize);
    const saved = await syncAccountMutation({
      key: `learning-progress:${batch.map((item) => item.key).sort().join(",")}`,
      path: "/api/learning/progress",
      method: "PUT",
      body: { items: batch },
    }, userId);
    if (!saved) allSaved = false;
  }

  return allSaved;
}
