"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ParticipantContestSummary } from "@/lib/contest-metadata";

type RegistrationReceipt = {
  team_id?: string;
  invite_code?: string;
  team_name?: string;
};

async function responseJson(response: Response): Promise<Record<string, unknown>> {
  if (!response.body) throw new Error("No registration response was received.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 16 * 1024) throw new Error("The registration response was too large.");
      chunks.push(part.value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const value: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid registration response.");
  return value as Record<string, unknown>;
}

export function ContestRegistrationControls({ contest }: { contest: ParticipantContestSummary }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null);

  async function register(action: Record<string, string>) {
    if (busy) return;
    setBusy(true);
    setMessage("Confirming registration with contest authority…");
    try {
      const response = await fetch(`/api/contests/${encodeURIComponent(contest.contest_id)}/registration`, {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        redirect: "error",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(action),
        signal: AbortSignal.timeout(7000),
      });
      const value = await responseJson(response);
      if (!response.ok) {
        const code = typeof value.code === "string" ? value.code : "REGISTRATION_UNAVAILABLE";
        const messageForCode: Record<string, string> = {
          ALREADY_REGISTERED: "You are already registered. Refreshing your contest status…",
          REGISTRATION_CLOSED: "Registration is closed according to the contest server.",
          CONTEST_OR_TEAM_NOT_FOUND: "The contest or team could not be found.",
          INVALID_TEAM_INVITATION: "That team invitation is invalid or expired.",
          INVALID_REGISTRATION: "Check the team name and invitation details.",
          UNAUTHORIZED: "Your sign-in has expired. Sign in again before registering.",
        };
        setMessage(messageForCode[code] ?? "The contest authority could not confirm registration. Retry after checking your connection.");
        if (code === "ALREADY_REGISTERED") router.refresh();
        return;
      }
      if (value.status !== "registered") throw new Error("The contest authority returned no registration receipt.");
      if (action.kind === "create_team") {
        if (typeof value.team_id !== "string" || typeof value.invite_code !== "string" ||
            !/^[0-9a-f]{64}$/.test(value.invite_code)) throw new Error("The team invitation could not be verified.");
        setReceipt({
          team_id: value.team_id,
          invite_code: value.invite_code,
          team_name: typeof value.team_name === "string" ? value.team_name : teamName.trim(),
        });
      } else {
        setReceipt(null);
      }
      setMessage("Registration is confirmed by the contest server.");
      router.refresh();
    } catch {
      setMessage("Registration could not be confirmed. Refresh contest status before retrying; the server controls duplicates and the registration window.");
    } finally {
      setBusy(false);
    }
  }

  const alreadyRegistered = contest.registration.status === "registered";
  if (alreadyRegistered && !receipt) {
    return <p className="mt-3 rounded border border-emerald-400/25 bg-emerald-400/5 px-3 py-2 text-sm text-emerald-200" role="status">
      Registered{contest.registration.kind === "team" ? " as a team member" : " for this contest"}.
    </p>;
  }
  if ((!contest.registration.enabled || contest.registration.mode === null) && !receipt) {
    return <p className="mt-3 text-sm text-zinc-400">Registration is not enabled for this contest.</p>;
  }
  if (!contest.registration.open && !receipt) {
    return <p className="mt-3 text-sm text-zinc-400">Registration is closed according to the latest server snapshot.</p>;
  }

  return (
    <section className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4" aria-label="Contest registration">
      <h3 className="font-semibold">Register for this contest</h3>
      {alreadyRegistered ? <p className="mt-2 text-sm text-emerald-200">Team registration is confirmed. Share the one-time invitation below with your teammates.</p>
        : contest.registration.mode === "individual" ? (
        <button type="button" onClick={() => void register({ kind: "individual" })} disabled={busy}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Registering…" : "Register individually"}
        </button>
      ) : (
        <div className="mt-3 grid gap-4">
          <label className="grid gap-1 text-sm">Create a team
            <span className="flex flex-wrap gap-2">
              <input value={teamName} onChange={(event) => setTeamName(event.target.value)} maxLength={80}
                minLength={2} autoComplete="off" className="min-w-48 rounded border border-white/15 bg-zinc-950 px-3 py-2"
                placeholder="Team name" />
              <button type="button" onClick={() => void register({ kind: "create_team", name: teamName })}
                disabled={busy || teamName.trim().length < 2 || teamName.trim().length > 80}
                className="rounded border border-white/20 px-3 py-2 font-semibold disabled:opacity-50">
                {busy ? "Working…" : "Create team"}
              </button>
            </span>
          </label>
          <label className="grid gap-1 text-sm">Join a team with its invitation
            <span className="flex flex-wrap gap-2">
              <input value={teamId} onChange={(event) => setTeamId(event.target.value)} maxLength={36}
                autoComplete="off" spellCheck={false} className="min-w-56 rounded border border-white/15 bg-zinc-950 px-3 py-2 font-mono text-xs"
                placeholder="Team ID" />
              <input value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} maxLength={64}
                autoComplete="off" spellCheck={false} className="min-w-56 rounded border border-white/15 bg-zinc-950 px-3 py-2 font-mono text-xs"
                placeholder="64-character invite code" />
              <button type="button" onClick={() => void register({ kind: "join_team", team_id: teamId, invite_code: inviteCode })}
                disabled={busy || !/^[0-9a-f-]{36}$/i.test(teamId) || !/^[0-9a-f]{64}$/.test(inviteCode)}
                className="rounded border border-white/20 px-3 py-2 font-semibold disabled:opacity-50">
                Join team
              </button>
            </span>
          </label>
          <p className="text-xs text-zinc-400">Team membership and registration cutoffs are enforced using contest-server time.</p>
        </div>
      )}
      {receipt?.invite_code && <div className="mt-3 rounded border border-amber-300/30 p-3 text-sm text-amber-100" role="status">
        <p>Save this invitation now. It is shown only in this page session and is not stored by the browser.</p>
        <p className="mt-2">Team: {receipt.team_name} · ID <code className="break-all">{receipt.team_id}</code></p>
        <code className="mt-2 block break-all rounded bg-black/30 p-2">{receipt.invite_code}</code>
      </div>}
      {message && <p className="mt-3 text-sm text-zinc-300" role="status" aria-live="polite">{message}</p>}
    </section>
  );
}
