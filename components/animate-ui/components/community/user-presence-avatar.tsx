"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { UsersRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ActiveMember {
  id: string;
  name: string;
  imageUrl: string;
}

interface PresenceResponse {
  users: ActiveMember[];
  count: number;
}

type PresenceState = "loading" | "ready" | "stale" | "unavailable";

const PRESENCE_REFRESH_MS = 45_000;

export function UserPresenceAvatar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser();
  const [presence, setPresence] = useState<PresenceResponse>({ users: [], count: 0 });
  const [status, setStatus] = useState<PresenceState>("loading");
  const [expanded, setExpanded] = useState(false);

  const loadPresence = useCallback(async () => {
    try {
      const response = await fetch("/api/community/presence", { cache: "no-store" });
      if (!response.ok) throw new Error("Presence request failed");
      const payload = await response.json() as PresenceResponse;
      const users = Array.isArray(payload.users) ? payload.users : [];
      setPresence({ users, count: Number.isFinite(payload.count) ? payload.count : users.length });
      setStatus("ready");
    } catch {
      setStatus((current) => current === "ready" ? "stale" : "unavailable");
    }
  }, []);

  const publishHeartbeat = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      await fetch("/api/community/presence", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: "{}",
        keepalive: true,
      });
    } catch {
      // Presence naturally expires if the heartbeat cannot reach the server.
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (!isLoaded || pathname !== "/") return;
    let active = true;
    const refresh = async () => {
      await publishHeartbeat();
      if (active) await loadPresence();
    };
    void refresh();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, PRESENCE_REFRESH_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [isLoaded, pathname, user?.id, publishHeartbeat, loadPresence]);

  if (pathname !== "/") return null;

  const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  const label = status === "unavailable"
    ? "Active members unavailable"
    : `${presence.count} active ${presence.count === 1 ? "member" : "members"}`;

  return (
    <div
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-3 z-[45] sm:left-5"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setExpanded(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setExpanded(false);
      }}
      onFocus={() => setExpanded(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setExpanded(false);
      }}
    >
      {expanded && (
        <section
          aria-label="Active members"
          className="absolute bottom-[calc(100%+0.65rem)] left-0 w-60 overflow-hidden rounded-2xl border border-zinc-700 bg-[#08080b] shadow-[0_18px_55px_rgba(0,0,0,0.8)]"
        >
          <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {status === "stale" ? "Last updated · reconnecting" : "Active across Mindflare"}
              </p>
            </div>
            <span className="font-mono text-sm tabular-nums text-emerald-400">{presence.count}</span>
          </header>
          {status === "loading" ? (
            <p className="px-4 py-4 text-xs text-zinc-400">Checking active members…</p>
          ) : status === "unavailable" ? (
            <p className="px-4 py-4 text-xs leading-relaxed text-zinc-400">Live presence could not be loaded. Try again in a moment.</p>
          ) : presence.users.length === 0 ? (
            <p className="px-4 py-4 text-xs text-zinc-400">No members are active right now.</p>
          ) : (
            <ul className="max-h-40 divide-y divide-zinc-900 overflow-y-auto">
              {presence.users.slice(0, 4).map((member) => (
                <li key={member.id} className="flex items-center gap-3 px-4 py-2.5">
                  {member.imageUrl ? (
                    // The URL is supplied by the member's public profile image field.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.imageUrl} alt="" className="h-8 w-8 rounded-full border border-zinc-700 bg-zinc-900 object-cover" />
                  ) : (
                    <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-zinc-700 bg-zinc-900 text-[10px] font-semibold text-zinc-300">
                      {initials(member.name)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-200">{member.name}</span>
                  <span aria-label="Active" className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
                </li>
              ))}
              {presence.count > 4 && (
                <li className="px-4 py-2 text-[11px] text-zinc-500">And {presence.count - 4} more active</li>
              )}
            </ul>
          )}
        </section>
      )}
      <button
        type="button"
        aria-label={`${label}. ${expanded ? "Hide" : "Show"} active members`}
        aria-expanded={expanded}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") setExpanded((current) => !current);
        }}
        onClick={(event) => {
          if (event.detail === 0) setExpanded((current) => !current);
        }}
        className="grid h-11 w-11 place-items-center rounded-full border border-zinc-700 bg-[#08080b] text-zinc-200 shadow-[0_8px_28px_rgba(0,0,0,0.65)] transition-colors hover:border-zinc-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040]"
      >
        <UsersRound className="h-[18px] w-[18px]" aria-hidden="true" />
        <span aria-hidden="true" className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#08080b] ${status === "unavailable" ? "bg-zinc-500" : "bg-emerald-400"}`} />
      </button>
    </div>
  );
}
