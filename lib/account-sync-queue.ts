"use client";

type SyncJob = { key: string; path: string; method: "POST" | "PUT"; body: unknown };
const EVENT_NAME = "mindflare-account-sync-change";
let activeUserId: string | null = null;
let retrying = false;

function storageKey(userId: string) { return `mindflare_account_sync_queue:${userId}`; }

function readQueue(userId = activeUserId): SyncJob[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(userId)) ?? "[]");
    return Array.isArray(value) ? value as SyncJob[] : [];
  } catch { return []; }
}

function writeQueue(jobs: SyncJob[]) {
  if (!activeUserId || typeof window === "undefined") return;
  try { localStorage.setItem(storageKey(activeUserId), JSON.stringify(jobs)); } catch { /* keep current page state */ }
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function setAccountSyncUser(userId: string | null) {
  activeUserId = userId;
  if (userId) void retryPendingAccountSync();
}

export function getPendingAccountSyncCount() { return readQueue().length; }

export function subscribeAccountSync(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

function retainForRetry(job: SyncJob, userId: string) {
  const pending = readQueue(userId).filter((item) => item.key !== job.key);
  pending.push(job);
  if (userId === activeUserId) writeQueue(pending);
  else {
    try { localStorage.setItem(storageKey(userId), JSON.stringify(pending)); } catch { /* local page state remains */ }
  }
}

export async function syncAccountMutation(job: SyncJob, userId = activeUserId): Promise<boolean> {
  if (userId && activeUserId !== userId) {
    retainForRetry(job, userId);
    return false;
  }
  try {
    const response = await fetch(job.path, {
      method: job.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(job.body),
    });
    if (response.ok) {
      if (userId && userId === activeUserId) writeQueue(readQueue(userId).filter((pending) => pending.key !== job.key));
      return true;
    }
  } catch { /* the mutation is retained below for a later retry */ }

  if (userId) {
    retainForRetry(job, userId);
  }
  return false;
}

export async function retryPendingAccountSync() {
  const userId = activeUserId;
  if (!userId || retrying || typeof window === "undefined" || !navigator.onLine) return;
  retrying = true;
  try {
    for (const job of readQueue(userId)) {
      if (activeUserId !== userId) break;
      let ok = false;
      try {
        const response = await fetch(job.path, { method: job.method, headers: { "content-type": "application/json" }, body: JSON.stringify(job.body) });
        ok = response.ok;
      } catch { break; }
      if (!ok) break;
      writeQueue(readQueue(userId).filter((item) => item.key !== job.key));
    }
  } finally { retrying = false; }
}

if (typeof window !== "undefined") window.addEventListener("online", () => void retryPendingAccountSync());
