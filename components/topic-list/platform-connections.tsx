"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Check, ExternalLink, LoaderCircle, Unlink } from "lucide-react";
import { MEMBER_CONNECTION_PLATFORMS, type MemberConnectionPlatform } from "@/lib/member-platforms";
import { PlatformIcon } from "./platform-icons";
import { PlatformVerificationModal } from "@/components/profile/platform-verification-modal";

const PLATFORM_NAMES: Record<MemberConnectionPlatform, string> = {
  codeforces: "Codeforces",
  leetcode: "LeetCode",
  codechef: "CodeChef",
  atcoder: "AtCoder",
  hackerrank: "HackerRank",
};

const PROFILE_URLS: Record<MemberConnectionPlatform, (handle: string) => string> = {
  codeforces: (handle) => `https://codeforces.com/profile/${encodeURIComponent(handle)}`,
  leetcode: (handle) => `https://leetcode.com/u/${encodeURIComponent(handle)}/`,
  codechef: (handle) => `https://www.codechef.com/users/${encodeURIComponent(handle)}`,
  atcoder: (handle) => `https://atcoder.jp/users/${encodeURIComponent(handle)}`,
  hackerrank: (handle) => `https://www.hackerrank.com/profile/${encodeURIComponent(handle)}`,
};

interface SavedAccount {
  platform: MemberConnectionPlatform;
  handle: string;
  verified_at: string | null;
  total_questions_solved?: number | null;
  current_rating?: number | null;
}

interface VerificationSelection {
  platform: MemberConnectionPlatform;
  handle: string;
}

export function PlatformConnections() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [drafts, setDrafts] = useState<Partial<Record<MemberConnectionPlatform, string>>>({});
  const [selection, setSelection] = useState<VerificationSelection | null>(null);
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState<MemberConnectionPlatform | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    if (!isSignedIn) {
      setAccounts([]);
      setLoading(false);
      return;
    }
    setAccounts([]);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/profile/me", { cache: "no-store" });
      if (!response.ok) throw new Error("Connected profiles could not be loaded.");
      const data = await response.json() as { platforms?: Array<Record<string, unknown>> };
      const saved = (Array.isArray(data.platforms) ? data.platforms : []).flatMap((row) => {
        if (typeof row.platform !== "string" || !MEMBER_CONNECTION_PLATFORMS.includes(row.platform as MemberConnectionPlatform) || typeof row.handle !== "string" || typeof row.verified_at !== "string") return [];
        return [{
          platform: row.platform as MemberConnectionPlatform,
          handle: row.handle,
          verified_at: row.verified_at,
          total_questions_solved: typeof row.total_questions_solved === "number" ? row.total_questions_solved : null,
          current_rating: typeof row.current_rating === "number" ? row.current_rating : null,
        }];
      });
      setAccounts(saved);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Connected profiles could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isLoaded) void loadAccounts();
  }, [isLoaded, user?.id, loadAccounts]);

  const disconnect = async (platform: MemberConnectionPlatform) => {
    setDisconnecting(platform);
    setError(null);
    try {
      const response = await fetch(`/api/profile/platforms?platform=${encodeURIComponent(platform)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not disconnect this profile. Try again.");
      setAccounts((current) => current.filter((account) => account.platform !== platform));
    } catch (disconnectError) {
      setError(disconnectError instanceof Error ? disconnectError.message : "Could not disconnect this profile.");
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <section aria-labelledby="platform-connections-title" className="space-y-2 border-t border-white/10 pt-3">
      <div className="flex items-center justify-between gap-3">
        <h3 id="platform-connections-title" className="text-xs font-bold text-zinc-200">Verified profiles</h3>
        {loading && <LoaderCircle aria-label="Loading connected profiles" className="h-3.5 w-3.5 animate-spin text-zinc-400" />}
      </div>

      {!isLoaded ? (
        <p role="status" className="text-xs text-zinc-400">Loading account status…</p>
      ) : !isSignedIn ? (
        <p className="text-xs leading-5 text-zinc-400">
          <Link href="/sign-in?redirect_url=%2Ftopic-list" className="text-white underline underline-offset-4">Sign in</Link> to verify and save your coding profiles.
        </p>
      ) : (
        <div className="space-y-2">
          {MEMBER_CONNECTION_PLATFORMS.map((platform) => {
            const name = PLATFORM_NAMES[platform];
            const account = accounts.find((item) => item.platform === platform);
            return (
              <div key={platform} className="rounded-lg border border-white/10 bg-[#0a0a0c] p-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-black text-zinc-200">
                    <PlatformIcon platform={platform} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    {account ? (
                      <>
                        <a href={PROFILE_URLS[platform](account.handle)} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 text-xs font-semibold text-white hover:underline">
                          <span className="truncate">{account.handle}</span><ExternalLink className="h-3 w-3 shrink-0 text-zinc-400" />
                        </a>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-emerald-400">
                          <Check className="h-3 w-3" /> Ownership verified
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-zinc-200">{name}</p>
                        <p className="mt-0.5 text-[10px] text-zinc-500">Not connected</p>
                      </>
                    )}
                  </div>
                  {account ? (
                    <button type="button" onClick={() => void disconnect(platform)} disabled={disconnecting !== null} aria-label={`Disconnect ${name}`} className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/10 bg-black text-zinc-400 hover:text-white disabled:opacity-50">
                      {disconnecting === platform ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Unlink className="h-3.5 w-3.5" />}
                    </button>
                  ) : null}
                </div>
                {!account && (
                  <form
                    className="mt-2 flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const handle = (drafts[platform] ?? "").trim();
                      if (handle) setSelection({ platform, handle });
                    }}
                  >
                    <input
                      aria-label={`${name} username`}
                      autoComplete="off"
                      value={drafts[platform] ?? ""}
                      onChange={(event) => setDrafts((current) => ({ ...current, [platform]: event.target.value }))}
                      placeholder={`${name} username`}
                      className="min-w-0 flex-1 rounded border border-white/10 bg-black px-2 py-1.5 text-xs text-white placeholder:text-zinc-600 focus:border-white/30 focus:outline-none"
                    />
                    <button type="submit" disabled={!drafts[platform]?.trim()} className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-zinc-100 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                      Verify
                    </button>
                  </form>
                )}
              </div>
            );
          })}
          {error && <p role="alert" className="text-xs text-red-400">{error}</p>}
          <p className="text-[10px] leading-4 text-zinc-500">Verification uses a temporary code in a public profile field. You can remove the code after verification.</p>
        </div>
      )}

      {selection && (
        <PlatformVerificationModal
          isOpen
          onClose={() => setSelection(null)}
          platform={selection.platform}
          platformName={PLATFORM_NAMES[selection.platform]}
          handle={selection.handle}
          onVerificationSuccess={() => { void loadAccounts(); }}
        />
      )}
    </section>
  );
}
