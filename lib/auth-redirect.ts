const AUTH_PATHS = ["/sign-in", "/sign-up", "/login", "/sso-callback"];

export function safePostAuthUrl(requested: string | null | undefined, origin: string): string {
  if (!requested) return "/";
  try {
    const target = new URL(requested, origin);
    if (target.origin !== new URL(origin).origin) return "/";
    if (AUTH_PATHS.some((path) => target.pathname === path || target.pathname.startsWith(`${path}/`))) return "/";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}

export function buildAuthModeHref(mode: "login" | "signup", returnTo: string): string {
  const path = mode === "login" ? "/sign-in" : "/sign-up";
  const safeReturnTo = safePostAuthUrl(returnTo, "https://mindflare.invalid");
  return safeReturnTo === "/" ? path : `${path}?redirect_url=${encodeURIComponent(safeReturnTo)}`;
}
