import React from "react";

interface VerifiedSealBadgeProps {
  className?: string;
  size?: number;
}

/**
 * Codolio's exact Phosphor SealCheckIcon (Fill weight)
 * Scalloped starburst / rosette with embedded checkmark
 */
export function VerifiedSealBadge({ className = "w-5 h-5 text-emerald-400 shrink-0", size }: VerifiedSealBadgeProps) {
  return (
    <svg
      viewBox="0 0 256 256"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-label="Verified Profile"
    >
      <path d="M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.56-1.47-7.63-5.37-11.57-9.14C146.28,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.56-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.72,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-52.2,6.84-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  );
}

/**
 * Returns the local high-fidelity Codolio platform icon URL
 */
export function getPlatformIconPath(platform: string): string {
  const p = platform.toLowerCase().trim();
  switch (p) {
    case "leetcode":
      return "/images/platform-icons/leetcode.png";
    case "codeforces":
      return "/images/platform-icons/codeforces.png";
    case "codechef":
      return "/images/platform-icons/codechef.webp";
    case "geeksforgeeks":
    case "gfg":
      return "/images/platform-icons/gfg.png";
    case "codestudio":
    case "codingninjas":
      return "/images/platform-icons/codestudio.webp";
    case "atcoder":
      return "/images/platform-icons/atcoder.webp";
    case "hackerrank":
      return "/images/platform-icons/hackerrank.png";
    case "github":
      return "/images/platform-icons/github.png";
    case "linkedin":
      return "/images/platform-icons/linkedin.png";
    case "twitter":
      return "/images/platform-icons/twitter.png";
    case "website":
      return "/images/platform-icons/website.webp";
    case "codolio":
      return "/images/platform-icons/codolio.svg";
    default:
      return "/images/platform-icons/codolio.svg";
  }
}
