import { syncAccountMutation } from "@/lib/account-sync-queue";

export interface TopicListState {
  favorites: Array<{ item_type: "topic" | "problem"; item_key: string }>;
  progress: Array<{ item_key: string; status: "started" | "completed" | "skipped" | "not_started"; updated_at: string }>;
  activity: Array<{ activity_date: string; event_type: "visit" | "topic_completed" | "problem_solved"; item_key: string }>;
  checkins: Array<{ checkin_date: string; points_awarded: number }>;
  userClaps: number;
  totalClaps: number;
}

let statePromise: Promise<TopicListState | null> | null = null;
let lastStateTime = 0;
let cachedState: TopicListState | null = null;

export async function loadTopicListState(): Promise<TopicListState | null> {
  const now = Date.now();
  if (cachedState && now - lastStateTime < 10_000) {
    return cachedState;
  }
  if (statePromise) return statePromise;

  statePromise = (async () => {
    try {
      const response = await fetch("/api/topic-list/state", { cache: "no-store" });
      if (!response.ok) return null;
      cachedState = (await response.json()) as TopicListState;
      lastStateTime = Date.now();
      return cachedState;
    } catch {
      return null;
    } finally {
      statePromise = null;
    }
  })();

  return statePromise;
}

export async function setTopicFavorite(
  itemType: "topic" | "problem",
  itemKey: string,
  favorite: boolean,
  userId?: string | null,
): Promise<boolean> {
  return syncAccountMutation({
    key: `favorite:${itemType}:${itemKey}`,
    path: "/api/topic-list/favorites",
    method: "PUT",
    body: { itemType, itemKey, favorite },
  }, userId);
}

export async function recordTopicActivity(
  eventType: "visit" | "topic_completed" | "problem_solved",
  itemKey: string,
  active = true,
  userId?: string | null,
): Promise<boolean> {
  return syncAccountMutation({
    key: `activity:${eventType}:${itemKey}`,
    path: "/api/topic-list/activity",
    method: "POST",
    body: { eventType, itemKey, active },
  }, userId);
}

