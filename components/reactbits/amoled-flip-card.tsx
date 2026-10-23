'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { FlipCard } from './flip-card';

interface AmoledFlipCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  badge: string;
  backTitle: string;
  backSubtitle: string;
  backPoints: string[];
  ctaText?: string;
  ctaHref?: string;
  width?: number;
  height?: number;
  className?: string;
}

export function AmoledFlipCard({
  imageSrc,
  imageAlt,
  title,
  badge,
  backTitle,
  backSubtitle,
  backPoints,
  ctaText,
  ctaHref,
  width = 340,
  height = 430,
  className = '',
}: AmoledFlipCardProps) {
  const front = (
    <div className="relative w-full h-full flex flex-col justify-between p-5 bg-[#050508] text-[#F4F3FC] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FF1018]/15 border border-[#FF1018]/40 text-[#FF3B41]">
          {badge}
        </span>
        <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-mono">
          <RotateCw className="w-3 h-3 text-[#38BDF8]" />
          <span>Flip Card</span>
        </div>
      </div>

      {/* Center Image Container */}
      <div className="relative flex-1 my-3 rounded-xl overflow-hidden border border-[#1E1E2E] bg-black">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-85" />
      </div>

      {/* Bottom Title & Flip hint */}
      <div className="z-10 pt-1 flex items-end justify-between">
        <div>
          <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
          <p className="text-xs text-zinc-400">Interactive AMOLED Preview</p>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#38BDF8] flex items-center gap-1">
          <span>Tap to flip</span>
          <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  );

  const back = (
    <div className="relative w-full h-full flex flex-col justify-between p-6 bg-[#07070C] text-[#F4F3FC] select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF1018]" />
          <span className="text-xs font-mono font-bold text-[#FF3B41] uppercase tracking-wider">
            {badge} Insights
          </span>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">Back view</span>
      </div>

      {/* Middle Content */}
      <div className="my-auto space-y-4">
        <div>
          <h4 className="text-lg font-extrabold text-white">{backTitle}</h4>
          <p className="text-xs text-[#38BDF8] font-mono mt-0.5">{backSubtitle}</p>
        </div>

        <div className="space-y-2.5">
          {backPoints.map((pt, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
              <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{pt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-[#1E1E2E] flex items-center justify-between text-xs">
        <span className="text-zinc-500 font-mono">Mindflare Standard</span>
        {ctaText && ctaHref ? (
          <span className="text-xs font-bold text-[#FF1018] group-hover:underline flex items-center gap-1">
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-zinc-400">Click to flip back ↺</span>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <FlipCard
        front={front}
        back={back}
        width={width}
        height={height}
        radius={22}
        background="#050508"
        color="#F4F3FC"
        glare={true}
        tilt={true}
        glareOpacity={0.25}
        shadow={true}
        shadowColor="#000000"
        shadowOpacity={0.8}
        ariaLabel={title}
      />
    </div>
  );
}
