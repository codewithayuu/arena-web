import React from 'react';

interface IntroCardProps {
  children: React.ReactNode;
  className?: string;
}

export function IntroCard({ children, className = '' }: IntroCardProps) {
  return (
    <div
      className={`rounded-lg border border-border/80 bg-card/40 text-card-foreground shadow-sm p-5 sm:p-6 mb-6 ${className}`}
    >
      <div className="text-sm sm:text-base text-foreground/90 leading-relaxed space-y-3 font-normal">
        {children}
      </div>
    </div>
  );
}
