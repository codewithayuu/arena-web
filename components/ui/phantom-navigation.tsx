"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { registerPhantomUi } from "./phantom";

/**
 * Global Navigation Route Transition Bar
 * Mounts in RootLayout to provide immediate visual feedback on page switches
 * while the new page components and data hydrate.
 */
export function PhantomNavigationIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    // Eagerly register Web Component on initial load
    registerPhantomUi();
  }, []);

  // When pathname or searchParams change, navigation has completed
  useEffect(() => {
    setNavigating(false);
  }, [pathname, searchParams]);

  // Intercept internal link clicks to trigger instant visual transition
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, hash anchors, new tabs, and modifier keys
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("#") ||
        target.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const currentPath = window.location.pathname + window.location.search;
      if (href !== currentPath) {
        setNavigating(true);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!navigating) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none overflow-hidden bg-black/40"
    >
      <div className="h-full w-full bg-gradient-to-r from-transparent via-[#FF1018] to-[#FF4D52] animate-[shimmer-horizontal_1.2s_linear_infinite] shadow-[0_0_8px_rgba(255,16,24,0.7)]" />
    </div>
  );
}
