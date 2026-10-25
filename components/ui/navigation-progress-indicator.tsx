"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** A thin progress cue for client navigation; route loaders provide page detail. */
export function NavigationProgressIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    setNavigating(false);
  }, [pathname, search]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest("a");
      if (!target || target.hasAttribute("download") || (target.target && target.target !== "_self")) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = target.getAttribute("href");
      if (!href) return;

      let destination: URL;
      try {
        destination = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (destination.origin !== window.location.origin) return;

      const currentPath = window.location.pathname + window.location.search;
      const nextPath = destination.pathname + destination.search;
      if (nextPath === currentPath) return;

      setNavigating(true);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setNavigating(false), 8000);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!navigating) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-[2.5px] overflow-hidden bg-black/40">
      <div className="h-full w-2/5 bg-gradient-to-r from-transparent via-[#ff1018] to-[#ff4d52] shadow-[0_0_8px_rgba(255,16,24,0.7)] motion-safe:animate-pulse motion-reduce:animate-none motion-reduce:w-full" />
    </div>
  );
}
