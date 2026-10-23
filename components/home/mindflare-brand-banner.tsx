'use client';

import React from 'react';
import { StrokeText } from '@/components/StrokeText';

export function MindflareBrandBanner() {
  return (
    <section className="relative w-full pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden flex flex-col items-center justify-center text-center select-none border-t border-white/[0.04]">
      {/* Ambient Crimson Caustic Bloom behind the massive brand mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(255,16,24,0.18)_0%,transparent_70%)] blur-[120px] -z-10"
      />

      <div className="w-full max-w-[1300px] px-4 sm:px-8 lg:px-12 flex flex-col items-center justify-center">
        <StrokeText
          text="MindFlare"
          strokeColor={(_char, index) => (index < 4 ? '#ffffff' : '#FF1018')}
          fillColor={(_char, index) => (index < 4 ? '#ffffff' : '#FF1018')}
          strokeStyle="solid"
          strokeWidth={2.4}
          dashLength={10}
          drawDuration={1.6}
          fillDelay={0.05}
          stagger={0.035}
          ease="power3.out"
          trigger="scroll"
          fillMode="wipe"
          wipeFrom="bottom"
          fontSize={220}
          fontWeight={900}
          letterSpacing={-8}
          marching={false}
          hoverRedraw={true}
          shadow={false}
          fontFamily='var(--font-sans), system-ui, -apple-system, sans-serif'
          style={{ '--stroke-text-width': '100%' } as React.CSSProperties}
          className="w-full drop-shadow-[0_0_50px_rgba(255,16,24,0.35)]"
        />
        <p className="mt-6 text-xs sm:text-sm font-mono tracking-[0.25em] uppercase text-zinc-500">
          Where Algorithms Spark Intuition
        </p>
      </div>
    </section>
  );
}
