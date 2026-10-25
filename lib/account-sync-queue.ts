"use client";

type SyncFailure = {
  status: number | null;
  message: string;
  occurredAt: number;
};

type SyncJob = {
  key: string;
  path: string;
  method: "POST" | "PUT";
  body: unknown;
  queuedAt?: number;
  lastFailure?: SyncFailure;
};

export interface AccountSyncQueueStatus {
  pendingCount: number;
  failedCount: number;
  latestFailure: SyncFailure | null;
}

const EVENT_NAME = "mindflare-account-sync-change";
const PROGRESS_BATCH_SIZE = 100;
let activeUserId: string | null = null;
let retrying = false;
let lastQueuedAt = Date.now();
const confirmedVersions = new Map<string, number>();

function storageKey(userId: string) {
  return `mindflare_account_sync_queue:${userId}`;
}

function nextQueuedAt(userId?: string) {
  const highestPersistedVersion = userId
    ? readQueue(userId).reduce((highest, job) => Math.max(highest, job.queuedAt ?? 0), 0)
    : 0;
  lastQueuedAt = Math.max(Date.now(), lastQueuedAt + 1, highestPersistedVersion + 1);
  return lastQueuedAt;
}

function readQueue(userId = activeUserId): SyncJob[] {
  if (!userId || typeof window === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(userId)) ?? "[]");
    return Array.isArray(value) ? value as SyncJob[] : [];
  } catch {
    return [];
  }
}

function writeQueue(userId: string, jobs: SyncJob[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(jobs));
  } catch {
    // Keep the current page state; storage failures must not discard the source mutation.
  }
  if (userId === activeUserId) window.dispatchEvent(new Event(EVENT_NAME));
}

export function setAccountSyncUser(userId: string | null) {
  activeUserId = userId;
  if (userId) void retryPendingAccountSync();
}

export function getAccountSyncQueueStatus(): AccountSyncQueueStatus {
  const jobs = readQueue();
  let latestFailure: SyncFailure | null = null;
  let failedCount = 0;

  for (const job of jobs) {
    const failure = job.lastFailure;
    if (!failure || typeof failure.message !== "string") continue;
    failedCount += 1;
    if (!latestFailure || failure.occurredAt >= latestFailure.occurredAt) latestFailure = failure;
  }

  return { pendingCount: jobs.length, failedCount, latestFailure };
}

export function subscribeAccountSync(listener: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}

function isSameLogicalJob(left: SyncJob, right: SyncJob) {
  return left.key === right.key && left.path === right.path && left.method === right.method;
}

function logicalJobId(userId: string, job: SyncJob) {
  return JSON.stringify([userId, job.path, job.method, job.key]);
}

function rememberConfirmedVersion(userId: string, job: SyncJob) {
  const id = logicalJobId(userId, job);
  const queuedAt = job.queuedAt ?? 0;
  confirmedVersions.set(id, Math.max(confirmedVersions.get(id) ?? 0, queuedAt));
}

function hasSameBody(left: SyncJob, right: SyncJob) {
  try {
    return JSON.stringify(left.body) === JSON.stringify(right.body);
  } catch {
    return false;
  }
}

function isSameJobVersion(left: SyncJob, right: SyncJob) {
  if (!isSameLogicalJob(left, right) || !hasSameBody(left, right)) return false;
  return left.queuedAt === undefined || right.queuedAt === undefined || left.queuedAt === right.queuedAt;
}

function retainForRetry(job: SyncJob, userId: string) {
  if ((job.queuedAt ?? 0) <= (confirmedVersions.get(logicalJobId(userId, job)) ?? -1)) return;

  const queue = readQueue(userId);
  const sameLogicalJobs = queue.filter((item) => isSameLogicalJob(item, job));
  if (sameLogicalJobs.some((item) => (item.queuedAt ?? 0) > (job.queuedAt ?? 0))) return;

  writeQueue(userId, [
    ...queue.filter((item) => !isSameLogicalJob(item, job)),
    job,
  ]);
}

function markRetryFailure(userId: string, job: SyncJob, failure: SyncFailure) {
  const queue = readQueue(userId);
  let matched = false;
  const updated = queue.map((item) => {
    if (!isSameJobVersion(item, job)) return item;
    matched = true;
    return { ...item, lastFailure: failure };
  });
  if (matched) writeQueue(userId, updated);
  else retainForRetry({ ...job, lastFailure: failure }, userId);
}

function removeConfirmedJobVersion(userId: string, job: SyncJob) {
  rememberConfirmedVersion(userId, job);
  writeQueue(userId, readQueue(userId).filter((item) => !isSameJobVersion(item, job)));
}

function removeSupersededJobs(userId: string, confirmed: SyncJob) {
  rememberConfirmedVersion(userId, confirmed);
  writeQueue(userId, readQueue(userId).filter((item) =>
    !isSameLogicalJob(item, confirmed) || (item.queuedAt ?? 0) > (confirmed.queuedAt ?? 0)
  ));
}

function sanitizedErrorMessage(value: unknown) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 180);
}

async function responseFailure(response: Response): Promise<SyncFailure> {
  let message = "";
  try {
    const body = await response.clone().json() as { error?: unknown };
    message = sanitizedErrorMessage(body?.error);
  } catch {
    // The HTTP status remains useful for non-JSON error responses.
  }

  return {
    status: response.status,
    message: message || `The server returned HTTP ${response.status}.`,
    occurredAt: Date.now(),
  };
}

function networkFailure(): SyncFailure {
  return {
    status: null,
    message: "The server could not be reached. The update is still saved on this device.",
    occurredAt: Date.now(),
  };
}

function isLearningProgressItem(value: unknown): value is { key: string; status: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const item = value as { key?: unknown; status?: unknown };
  return typeof item.key === "string" && typeof item.status === "string";
}

function splitOversizedProgressJob(job: SyncJob): SyncJob[] | null {
  if (job.path !== "/api/learning/progress" || job.method !== "PUT") return null;
  if (!job.body || typeof job.body !== "object" || Array.isArray(job.body)) return null;

  const items = (job.body as { items?: unknown }).items;
  if (!Array.isArray(items) || items.length <= PROGRESS_BATCH_SIZE || !items.every(isLearningProgressItem)) return null;

  const baseQueuedAt = job.queuedAt ?? nextQueuedAt();
  const batches: SyncJob[] = [];
  for (let offset = 0; offset < items.length; offset += PROGRESS_BATCH_SIZE) {
    const batch = items.slice(offset, offset + PROGRESS_BATCH_SIZE) as Array<{ key: string; status: string }>;
    const keys = batch.map((item) => item.key).sort();
    batches.push({
      key: `learning-progress:${keys.join(",")}`,
      path: job.path,
      method: job.method,
      body: { items: batch },
      queuedAt: baseQueuedAt + (offset / PROGRESS_BATCH_SIZE) + 1,
    });
  }
  lastQueuedAt = Math.max(lastQueuedAt, batches[batches.length - 1]?.queuedAt ?? 0);
  return batches;
}

function migrateOversizedProgressJobs(userId: string) {
  const original = readQueue(userId);
  let changed = false;
  const migrated = original.flatMap((job) => {
    const batches = splitOversizedProgressJob(job);
    if (!batches) return [job];
    changed = true;
    return batches;
  });
  if (changed) writeQueue(userId, migrated);
  return migrated;
}

export async function syncAccountMutation(job: SyncJob, userId = activeUserId): Promise<boolean> {
  const queuedJob: SyncJob = { ...job, queuedAt: nextQueuedAt(userId ?? undefined) };
  if (userId && activeUserId !== userId) {
    retainForRetry(queuedJob, userId);
    return false;
  }

  try {
    const response = await fetch(job.path, {
      method: job.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(job.body),
    });
    if (response.ok) {
      if (userId) removeSupersededJobs(userId, queuedJob);
      return true;
    }
    if (userId) retainForRetry({ ...queuedJob, lastFailure: await responseFailure(response) }, userId);
  } catch {
    if (userId) retainForRetry({ ...queuedJob, lastFailure: networkFailure() }, userId);
  }

  return false;
}

export async function retryPendingAccountSync() {
  const userId = activeUserId;
  if (!userId || retrying || typeof window === "undefined" || !navigator.onLine) return;
  retrying = true;
  try {
    // Old clients could queue more items than the progress endpoint accepts.
    // Split those jobs in-place before retrying so no saved progress is dropped.
    for (const job of migrateOversizedProgressJobs(userId)) {
      if (activeUserId !== userId) break;

      let response: Response;
      try {
        response = await fetch(job.path, {
          method: job.method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(job.body),
        });
      } catch {
        markRetryFailure(userId, job, networkFailure());
        break;
      }

      if (response.ok) {
        removeConfirmedJobVersion(userId, job);
        continue;
      }

      // Keep this update and continue: an invalid record must not block
      // independent pending changes from reaching their endpoints.
      markRetryFailure(userId, job, await responseFailure(response));
    }
  } finally {
    retrying = false;
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => void retryPendingAccountSync());
}
