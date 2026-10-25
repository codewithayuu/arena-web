"use client";

import { HandleSSOCallback } from "@clerk/nextjs";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { buildAuthModeHref, safePostAuthUrl } from "@/lib/auth-redirect";

function SSOCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = typeof window === "undefined" ? "https://mindflare.invalid" : window.location.origin;
  const redirectTo = safePostAuthUrl(searchParams.get("redirect_url"), origin);

  const navigate = (url: string) => {
    if (url.startsWith("http")) {
      window.location.href = url;
      return;
    }
    router.replace(url);
    router.refresh();
  };

  return (
    <HandleSSOCallback
      navigateToApp={({ decorateUrl }) => navigate(decorateUrl(redirectTo))}
      navigateToSignIn={() => router.replace(buildAuthModeHref("login", redirectTo))}
      navigateToSignUp={() => router.replace(buildAuthModeHref("signup", redirectTo))}
    />
  );
}

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <Suspense fallback={<p>Completing sign-in…</p>}>
        <SSOCallbackHandler />
      </Suspense>
    </div>
  );
}
