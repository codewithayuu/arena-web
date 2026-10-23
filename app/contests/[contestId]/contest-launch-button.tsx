"use client";

import { useState } from "react";
import { dispatchContestLaunchIntent, validateContestLaunchIntent, type ContestLaunchIntent } from "@/lib/contest-launch-intent";

async function readIntent(response: Response): Promise<Record<string, unknown>> {
  if (!response.body) throw new Error("The server returned no launch response.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 4096) throw new Error("The launch response was too large.");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const value: unknown = JSON.parse(new TextDecoder().decode(new Uint8Array(chunks.flatMap((chunk) => [...chunk]))));
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("The server returned an invalid launch response.");
  }
  return value as Record<string, unknown>;
}

export function ContestLaunchButton({ contestId }: { contestId: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingIntent, setPendingIntent] = useState<ContestLaunchIntent | null>(null);

  async function launch() {
    if (busy) return;
    if (pendingIntent) {
      const dispatched = dispatchContestLaunchIntent(
        pendingIntent,
        Date.now(),
        (uri) => window.location.assign(uri),
      );
      setPendingIntent(null);
      setMessage(dispatched
        ? "Mindflare Launcher opened. Confirm the external app prompt if your browser displays one."
        : "This launch request expired. Click again to prepare a fresh request.");
      return;
    }

    setBusy(true);
    setMessage("Checking contest registration and launch window…");
    try {
      const response = await fetch(`/api/contests/${encodeURIComponent(contestId)}/launch-intent`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        redirect: "error",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(7000),
      });
      const intent = validateContestLaunchIntent(await readIntent(response), contestId);
      if (!response.ok || !intent) {
        throw new Error("The server could not authorize this contest launch. Check registration and the contest schedule.");
      }
      setPendingIntent(intent);
      setMessage("Launch authorized. Click Open Mindflare Launcher to continue; your browser may ask you to confirm the app launch.");
      setBusy(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Contest launch could not be authorized.");
      setBusy(false);
    }
  }

  return (
    <div id="contest-launch" className="mt-6 scroll-mt-6">
      <button type="button" onClick={() => void launch()} disabled={busy}
        className="inline-flex rounded-lg bg-red-600 px-5 py-3 font-semibold text-white disabled:cursor-wait disabled:opacity-60">
        {busy ? "Preparing launch…" : pendingIntent ? "Open Mindflare Launcher" : "Open in official Safe Exam Browser"}
      </button>
      {message && <p className="mt-3 text-sm text-zinc-300" role="status" aria-live="polite">{message}</p>}
    </div>
  );
}
