'use client';

import React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Shuffle } from '@/components/Shuffle';

interface ContestComingSoonProps {
  text?: string;
  title?: string;
  badge?: string;
  contestId?: string;
  subtitle?: string;
}

export function ContestComingSoon({
  text = 'Coming soon',
  title,
  badge,
  contestId,
  subtitle,
}: ContestComingSoonProps) {
  return (
    <div className="isolate min-h-screen bg-[#08080a] text-white flex flex-col justify-between relative selection:bg-red-500/20 selection:text-white overflow-x-hidden">
      {/* Dynamic Mathematical Frosted Glass Atmosphere (Exact 6-Layer Mindflare Signature) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* 1. Overhead Luminous Zenith Bloom */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[650px] opacity-85"
          style={{
            background: `radial-gradient(
              ellipse 60% 45% at 50% 0%,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.08) 25%,
              rgba(255, 255, 255, 0.02) 55%,
              transparent 75%
            )`,
          }}
        />

        {/* 2. Soft Mindflare Red Accent Caustic Bloom */}
        <div
          className="absolute top-[25%] -left-[200px] w-[900px] h-[900px] opacity-40"
          style={{
            background: `radial-gradient(
              circle at 40% 40%,
              rgba(232, 48, 64, 0.18) 0%,
              rgba(232, 48, 64, 0.06) 35%,
              rgba(232, 48, 64, 0.01) 60%,
              transparent 75%
            )`,
          }}
        />

        {/* 3. Mid-Right Cool Atmospheric Diffuse Glow */}
        <div
          className="absolute top-[35%] -right-[250px] w-[1000px] h-[1000px] opacity-30"
          style={{
            background: `radial-gradient(
              circle at 60% 50%,
              rgba(255, 255, 255, 0.07) 0%,
              rgba(255, 255, 255, 0.02) 40%,
              transparent 70%
            )`,
          }}
        />

        {/* 4. Lower Ambient Foundation Bloom */}
        <div
          className="absolute bottom-[-10%] left-[20%] w-[1100px] h-[600px] opacity-25"
          style={{
            background: `radial-gradient(
              ellipse 70% 50% at 50% 60%,
              rgba(255, 255, 255, 0.05) 0%,
              rgba(255, 255, 255, 0.015) 50%,
              transparent 80%
            )`,
          }}
        />

        {/* 5. Mathematical Gaussian Vignette & Optical Depth Falloff */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 65% at 50% 40%, transparent 25%, rgba(8, 8, 10, 0.55) 70%, #08080a 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, transparent 35%, rgba(4, 4, 6, 0.75) 100%)
            `,
          }}
        />

        {/* 6. Physical Micro-Grain Tactile Layer */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Navbar />

      {/* Main Center Stage: ONLY Coming Soon with Shuffle */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center py-24 sm:py-32 scale-50 md:scale-100">
        <div className="w-full flex items-center justify-center select-none py-10">
          <Shuffle
            text={text}
            effect="slide"
            shuffleDirection="down"
            duration={0.9}
            animationMode="center"
            shuffleTimes={5}
            ease="expo.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={true}
            hoverRadius={120}
            motionBlur
            respectReducedMotion={true}
            maxDelay={0.45}
            scrambleCharset="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            loop
            loopDelay={2}
            color="#ffffff"
            accentColor="#e83040"
            className="text-white drop-shadow-[0_0_40px_rgba(232,48,64,0.35)]"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
