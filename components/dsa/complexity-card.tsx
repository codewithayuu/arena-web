'use client';

import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Activity } from 'lucide-react';
import SmoothButton from '@/components/smoothui/smooth-button';

interface ComplexityCardProps {
  children: React.ReactNode;
}

export function ComplexityCard({ children }: ComplexityCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="my-6 rounded-xl border border-[#d946ef] bg-[#0f0b18]/85 p-4 sm:p-5 shadow-lg shadow-fuchsia-950/20 transition-all duration-200">
        <div
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-between cursor-pointer select-none group"
        >
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-fuchsia-400 stroke-[2.5]" />
            <span className="text-[13px] font-bold tracking-wider uppercase text-fuchsia-400 font-sans">
              COMPLEXITY ANALYSIS
            </span>
          </div>
          <SmoothButton
            type="button"
            size="icon-sm"
            variant="ghost"
            className="text-fuchsia-400/80 group-hover:text-fuchsia-300 p-0.5"
            aria-label={isCollapsed ? 'Expand complexity analysis' : 'Collapse complexity analysis'}
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </SmoothButton>
        </div>

        {!isCollapsed && (
          <div className="mt-3 text-sm text-[#e6edf3] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_li]:text-sm [&_li]:text-[#c9d1d9] [&_li_p]:inline [&_li_p]:m-0 [&_strong]:text-white [&_strong]:font-bold [&_em]:text-white [&_code]:rounded [&_code]:bg-red-500/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-cyan-400 [&_code]:border [&_code]:border-red-500/20">
            {children}
          </div>
        )}
      </div>
  );
}
