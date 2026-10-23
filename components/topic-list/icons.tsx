"use client";

import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// Exact Modules Grid icon from YouKn0wWho Academy (MdViewModule)
export function ModulesIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M14.67 5v6.5H9.33V5h5.34zm1 6.5H21V5h-5.33v6.5zm-1 7.5v-6.5H9.33V19h5.34zm1-6.5V19H21v-6.5h-5.33zm-7.34 0H3V19h5.33v-6.5zm0-1V5H3v6.5h5.33z" />
    </svg>
  );
}

// Exact Interview Topics briefcase icon from YouKn0wWho Academy (MdWork)
export function InterviewIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
    </svg>
  );
}

// Exact Filter icon from YouKn0wWho Academy (MdFilterList)
export function FilterIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  );
}

// Exact Sun icon from YouKn0wWho Academy (MdLightMode)
export function SunIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06a.996.996 0 000 1.41c.39.39 1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.02-.39-1.41 0z" />
    </svg>
  );
}

// Exact Moon icon from YouKn0wWho Academy (MdDarkMode)
export function MoonIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}

// Exact Search icon (LuSearch)
export function SearchIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// Exact Chain Link icon (LuLink) matching original subcategory header
export function ChainLinkIcon({ className = "w-3.5 h-3.5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// User Silhouette Icon for Completion Pill
export function UserPillIcon({ className = "w-3 h-3", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

// Exact Copy icon (LuCopy)
export function CopyIcon({ className = "w-3.5 h-3.5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

// Exact Sort icon (LuArrowUpDown)
export function SortIcon({ className = "w-3.5 h-3.5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="m3 16 4 4 4-4" />
      <path d="M7 20V4" />
      <path d="m21 8-4-4-4 4" />
      <path d="M17 4v16" />
    </svg>
  );
}

// Exact Practice Flag icon (idle vs active from YouKn0wWho)
export function PracticeFlagIcon({
  active = false,
  className = "w-3.5 h-3.5",
  size,
  ...props
}: IconProps & { active?: boolean }) {
  if (active) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size || "1em"}
        height={size || "1em"}
        className={`animate-[flagWave_0.4s_ease-in-out] ${className}`}
        {...props}
      >
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

// Exact Checkmark icon (completed state)
export function CheckmarkIcon({ className = "w-3.5 h-3.5", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={`animate-[checkmarkPop_0.3s_ease-in-out] ${className}`}
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Exact Heart Favorite Bookmark icon
export function HeartIcon({
  filled = false,
  className = "w-3.5 h-3.5",
  size,
  ...props
}: IconProps & { filled?: boolean }) {
  if (filled) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size || "1em"}
        height={size || "1em"}
        className={className}
        {...props}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

// Exact Difficulty Pie/Circle Indicator
export function DifficultyCircle({
  difficulty,
  color,
  size = 18,
}: {
  difficulty: number;
  color: string;
  size?: number;
}) {
  const percentage = Math.min(100, Math.max(20, ((difficulty + 1) / 5) * 100));

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="relative rounded-full border border-white/20 bg-white/10 overflow-hidden shrink-0 transition-transform duration-200 hover:scale-125"
    >
      <div
        style={{
          height: `${percentage}%`,
          backgroundColor: color,
        }}
        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
      />
    </div>
  );
}

// Exact Importance Stars Indicator (★☆☆, ★★☆, ★★★)
export function ImportanceStars({ importance }: { importance: number }) {
  const stars = Math.min(3, Math.max(1, importance || 1));
  return (
    <div
      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded border border-white/10 bg-white/5 transition-all hover:scale-105"
    >
      {[1, 2, 3].map((s) => (
        <span
          key={s}
          className={`text-[9px] leading-none ${
            s <= stars ? "text-amber-400 drop-shadow-[0_0_2px_rgba(245,158,11,0.5)]" : "text-white/20"
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Exact Clap Icon
export function ClapIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <span role="img" aria-label="clap" className="inline-block select-none transform-gpu transition-transform active:scale-125">
      👏
    </span>
  );
}

// GitHub Icon
export function GitHubIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Discord Icon
export function DiscordIcon({ className = "w-4 h-4", size, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size || "1em"}
      height={size || "1em"}
      className={className}
      {...props}
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

// Stylized YouKn0wWho Geometric Logo Monogram
export function BrandMonogramLogo({ className = "w-6 h-6", size }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      className={className}
    >
      <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2.5" className="text-white/80" />
      <path
        d="M11 11L18 20L25 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#e8263d]"
      />
      <path
        d="M18 20V26"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-[#e8263d]"
      />
      <circle cx="18" cy="20" r="2" fill="currentColor" className="text-white" />
    </svg>
  );
}
