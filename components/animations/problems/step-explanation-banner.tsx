"use client";

import React from "react";

interface StepExplanationBannerProps {
  explanation: string;
  className?: string;
}

export function StepExplanationBanner({
  explanation,
  className = "",
}: StepExplanationBannerProps) {
  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border border-white/10 bg-black text-xs font-mono text-zinc-200 select-none shadow-xl relative overflow-hidden ${className}`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Crimson Accent Left Strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF1018] rounded-l" />

      <span className="font-bold text-[#FF3B41] shrink-0">Step:</span>
      <span className="leading-relaxed line-clamp-2">
        {explanation || "Initializing problem simulation..."}
      </span>
    </div>
  );
}
