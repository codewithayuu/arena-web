"use client";

import React, { useEffect, useState, type ReactNode, type CSSProperties } from "react";

// Ensure custom element is dynamically imported only in browser environment
let isPhantomRegistered = false;
export function registerPhantomUi(): void {
  if (typeof window !== "undefined" && !isPhantomRegistered) {
    isPhantomRegistered = true;
    import("@aejkatappaja/phantom-ui").catch((err) => {
      console.warn("Failed to load @aejkatappaja/phantom-ui:", err);
      isPhantomRegistered = false;
    });
  }
}

export interface PhantomProps {
  loading?: boolean;
  shimmerColor?: string;
  backgroundColor?: string;
  duration?: number;
  fallbackRadius?: number;
  animation?: "shimmer" | "pulse" | "breathe" | "solid";
  mode?: "skeleton" | "overlay";
  stagger?: number;
  reveal?: number;
  count?: number;
  countGap?: number;
  loadingLabel?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * AMOLED-themed Phantom UI wrapper.
 * Uses @aejkatappaja/phantom-ui structure-aware skeleton loader.
 * Matches Mindflare Arena's pitch black / charcoal palette with subtle grayish shimmer.
 */
export function Phantom({
  loading = false,
  shimmerColor = "rgba(255, 255, 255, 0.12)",
  backgroundColor = "rgba(255, 255, 255, 0.05)",
  duration = 1.6,
  fallbackRadius = 8,
  animation = "shimmer",
  mode = "skeleton",
  stagger = 0.04,
  reveal = 0.15,
  count = 1,
  countGap = 0,
  loadingLabel = "Loading content...",
  className,
  style,
  children,
}: PhantomProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    registerPhantomUi();
    setMounted(true);
  }, []);

  return (
    <phantom-ui
      loading={loading}
      shimmer-color={shimmerColor}
      background-color={backgroundColor}
      duration={duration}
      fallback-radius={fallbackRadius}
      animation={animation}
      mode={mode}
      stagger={stagger}
      reveal={reveal}
      count={count}
      count-gap={countGap}
      loading-label={loadingLabel}
      class={className}
      style={{
        display: "block",
        ...style,
      }}
    >
      {children}
    </phantom-ui>
  );
}

/**
 * Pre-structured AMOLED Skeleton Card shell for instantaneous layout during loading.
 */
export function PhantomCardSkeleton({
  lines = 3,
  hasImage = false,
  className = "",
}: {
  lines?: number;
  hasImage?: boolean;
  className?: string;
}) {
  return (
    <Phantom loading={true} className={`rounded-xl border border-white/[0.08] bg-[#0c0c0e]/80 p-5 ${className}`}>
      <div className="flex flex-col gap-3.5">
        {hasImage && (
          <div className="h-40 w-full rounded-lg bg-white/[0.04]" />
        )}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/[0.06]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded-md bg-white/[0.08]" />
            <div className="h-3 w-1/2 rounded-md bg-white/[0.04]" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 rounded-md bg-white/[0.05]"
              style={{ width: i === lines - 1 ? "60%" : "100%" }}
            />
          ))}
        </div>
      </div>
    </Phantom>
  );
}

/**
 * Universal AMOLED Page Skeleton Loader for Next.js app/loading.tsx
 */
export function PhantomPageSkeleton() {
  return (
    <div className="relative min-h-[85vh] w-full px-4 sm:px-8 lg:px-12 pt-28 pb-16 max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Hero / Header Skeleton */}
      <Phantom loading={true} className="w-full">
        <div className="flex flex-col items-center text-center gap-4 py-8 max-w-3xl mx-auto">
          <div className="h-6 w-36 rounded-full bg-white/[0.08]" />
          <div className="h-12 w-3/4 rounded-xl bg-white/[0.08]" />
          <div className="h-5 w-2/3 rounded-lg bg-white/[0.04]" />
          <div className="flex gap-4 pt-4">
            <div className="h-11 w-36 rounded-full bg-white/[0.09]" />
            <div className="h-11 w-36 rounded-full bg-white/[0.04]" />
          </div>
        </div>
      </Phantom>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <PhantomCardSkeleton key={i} lines={3} />
        ))}
      </div>
    </div>
  );
}
