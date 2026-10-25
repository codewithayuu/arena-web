"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getAccountSyncQueueStatus,
  retryPendingAccountSync,
  setAccountSyncUser,
  subscribeAccountSync,
  type AccountSyncQueueStatus,
} from "@/lib/account-sync-queue";

const EMPTY_STATUS: AccountSyncQueueStatus = { pendingCount: 0, failedCount: 0, latestFailure: null };

export function AccountSyncStatus() {
  const { user } = useUser();
  const userId = user?.id;
  const [queueStatus, setQueueStatus] = useState(EMPTY_STATUS);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    setAccountSyncUser(userId ?? null);
    const refresh = () => setQueueStatus(getAccountSyncQueueStatus());
    refresh();
    return subscribeAccountSync(refresh);
  }, [userId]);

  async function retry() {
    setRetrying(true);
    try {
      await retryPendingAccountSync();
    } finally {
      setRetrying(false);
      setQueueStatus(getAccountSyncQueueStatus());
    }
  }

  const { pendingCount, failedCount, latestFailure } = queueStatus;
  if (!userId || pendingCount === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 items-start justify-between gap-4 rounded-2xl border border-amber-500/30 bg-zinc-950/95 px-4 py-3 text-xs text-amber-100 shadow-xl sm:items-center"
    >
      <div className="min-w-0 space-y-1">
        <p>
          {failedCount > 0
            ? `${pendingCount} update${pendingCount === 1 ? " is" : "s are"} still saved on this device; ${failedCount} could not sync.`
            : `${pendingCount} update${pendingCount === 1 ? " is" : "s are"} saved on this device and waiting to sync.`}
        </p>
        {latestFailure && (
          <p className="break-words text-amber-200/80">
            {latestFailure.message}
            {latestFailure.status !== null && ` (HTTP ${latestFailure.status})`}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => void retry()}
        disabled={retrying}
        className="shrink-0 rounded px-1 font-semibold underline underline-offset-2 disabled:cursor-wait disabled:opacity-60"
      >
        {retrying ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
