"use client";

import React, { useRef } from "react";

interface GlowDefsProps {
  prefix: string;
  colors: [string, string][];
  shadowOpacity?: number;
}

export function GlowDefs({ prefix, colors, shadowOpacity = 0.5 }: GlowDefsProps) {
  const ref = useRef<SVGDefsElement>(null);

  return (
    <defs ref={ref}>
      <filter
        id={`${prefix}-shadow`}
        x="-40%"
        y="-40%"
        width="180%"
        height="180%"
      >
        <feDropShadow
          dx="0"
          dy="3"
          stdDeviation="4"
          floodColor="#000000"
          floodOpacity={shadowOpacity}
        />
      </filter>
      {colors.map(([name]) => (
        <filter
          key={name}
          id={`${prefix}-glow-${name}`}
          filterUnits="userSpaceOnUse"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          {/* Clean vector pass-through: completely removes fuzzy neon blur halos */}
          <feMerge>
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      ))}
    </defs>
  );
}
