"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getPendingAccountSyncCount, retryPendingAccountSync, setAccountSyncUser, subscribeAccountSync } from "@/lib/account-sync-queue";

export function AccountSyncStatus() {
  const { user } = useUser();
  const userId = user?.id;
  const [pending, setPending] = useState(0);
  useEffect(() => {
    setAccountSyncUser(userId ?? null);
    const refresh = () => setPending(getPendingAccountSyncCount());
    refresh();
    return subscribeAccountSync(refresh);
  }, [userId]);

  if (!userId || pending === 0) return null;
  return (
    <div role="status" className="fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-500/30 bg-zinc-950/95 px-4 py-2 text-xs text-amber-100 shadow-xl">
      <span>{pending} update{pending === 1 ? " is" : "s are"} saved on this device and waiting to sync.</span>
      <button type="button" onClick={() => void retryPendingAccountSync()} className="font-semibold underline underline-offset-2">Retry</button>
    </div>
  );
}
