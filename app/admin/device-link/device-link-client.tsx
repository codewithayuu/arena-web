"use client";

import { SignIn, useAuth, useReverification } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import SmoothButton from "@/components/smoothui/smooth-button";
import { PageLoading } from "@/components/ui/page-loading";

function validHandoff(state: string, callback: string): boolean {
  if (!/^[A-Za-z0-9_-]{32,128}$/.test(state)) return false;
  try {
    const url = new URL(callback);
    return url.protocol === "http:" && url.hostname === "127.0.0.1" &&
      Number(url.port) >= 1024 && Number(url.port) <= 65535 &&
      url.pathname === "/clerk-session" && !url.username && !url.password &&
      !url.search && !url.hash;
  } catch {
    return false;
  }
}

export function DeviceLinkClient({ state, callback }: { state: string; callback: string }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState("Ready to connect this browser session to Admin Companion.");
  const [connected, setConnected] = useState(false);
  const active = useRef(true);
  const handoffBusy = useRef(false);
  const requireFreshMfa = useReverification(async () => {
    const response = await fetch("/api/admin/device-link/reauth", {
      method: "POST",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    return response;
  });

  useEffect(() => () => { active.current = false; }, []);

  async function sendSession() {
    if (handoffBusy.current) return false;
    handoffBusy.current = true;
    try {
      if (!validHandoff(state, callback)) {
        throw new Error("This desktop sign-in request is invalid or expired. Start again in Admin Companion.");
      }
      const verification = await requireFreshMfa();
      if (!(verification instanceof Response) || !verification.ok) {
        throw new Error("Complete fresh multi-factor verification before connecting.");
      }
      const sessionToken = await getToken({ skipCache: true });
      if (!sessionToken) throw new Error("Mindflare did not provide a session token. Sign in again.");
      const response = await fetch(callback, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, session_token: sessionToken }),
      });
      if (!response.ok) {
        throw new Error("Admin Companion did not accept the session. Restart the sign-in from the desktop app.");
      }
      return true;
    } finally {
      handoffBusy.current = false;
    }
  }

  async function connect() {
    setStatus("Checking fresh multi-factor sign-in…");
    try {
      if (await sendSession()) {
        setConnected(true);
        setStatus("Connected. Keep this tab open while Admin Companion is using the session.");
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Sign-in could not be completed.");
    }
  }

  useEffect(() => {
    if (!connected || !isLoaded || !isSignedIn) return;
    const timer = window.setInterval(() => {
      if (!active.current || handoffBusy.current) return;
      void sendSession().catch(() => {
        setConnected(false);
        setStatus("Session refresh needs fresh MFA. Select Connect again to verify.");
      });
    }, 20_000);
    return () => window.clearInterval(timer);
  // sendSession closes over current auth hooks; a new token is requested every interval.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, isLoaded, isSignedIn, state, callback]);

  if (!isLoaded) return <PageLoading variant="device-link" label="secure desktop sign-in" />;
  if (!isSignedIn) {
    return <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#08090c] p-6 text-white">
      <p className="max-w-md text-center text-sm text-zinc-300">Sign in to Mindflare to connect the desktop Admin Companion. Administrative tools stay in the desktop app.</p>
      <SignIn forceRedirectUrl={typeof window === "undefined" ? "/admin/device-link" : window.location.href} />
    </main>;
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#08090c] px-6 py-12 text-white">
    <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111318] p-8 shadow-2xl">
      <div className="mb-7 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e3313d] font-bold">M</span>
        <div><div className="text-xs font-semibold tracking-[0.18em] text-zinc-100">MINDFLARE ARENA</div><div className="mt-1 text-xs text-zinc-500">DESKTOP ADMIN COMPANION</div></div>
      </div>
      <h1 className="text-2xl font-semibold">Connect desktop session</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-400">This one-purpose page passes a short-lived, MFA-verified Clerk session to the Admin Companion on this computer. Contest controls and participant information remain in the desktop app.</p>
      <SmoothButton
        type="button"
        size="lg"
        variant="solid"
        color="accent"
        onClick={() => void connect()}
        className="mt-7 font-semibold text-sm"
      >
        {connected ? "Refresh secure connection" : "Verify MFA and connect"}
      </SmoothButton>
      <p role="status" aria-live="polite" className="mt-5 text-sm text-zinc-300">{status}</p>
      <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-zinc-500">If this request was unexpected, close this tab and cancel sign-in in Admin Companion. This page does not show or operate the admin dashboard.</p>
    </section>
  </main>;
}
