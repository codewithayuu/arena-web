"use client";

import React from "react";

export type PlatformType =
  | "codeforces"
  | "atcoder"
  | "cses"
  | "codechef"
  | "leetcode"
  | "spoj"
  | "hackerrank"
  | "yosupo"
  | "vjudge"
  | "toph"
  | "kattis"
  | "uva"
  | "other";

export interface PlatformInfo {
  type: PlatformType;
  name: string;
  color: string;
  hoverColorClass: string;
}

// Helper to determine platform info from URL
export function getPlatformInfo(url: string): PlatformInfo {
  const u = (url || "").toLowerCase();

  if (u.includes("codeforces.com") || u.includes("codeforces")) {
    return {
      type: "codeforces",
      name: "Codeforces",
      color: "#3182ce",
      hoverColorClass: "hover:text-[#3B82F6]",
    };
  }
  if (u.includes("atcoder.jp") || u.includes("atcoder")) {
    return {
      type: "atcoder",
      name: "AtCoder",
      color: "#00c49f",
      hoverColorClass: "hover:text-[#00c49f]",
    };
  }
  if (u.includes("cses.fi") || u.includes("cses")) {
    return {
      type: "cses",
      name: "CSES",
      color: "#e8263d",
      hoverColorClass: "hover:text-[#ef4444]",
    };
  }
  if (u.includes("codechef.com") || u.includes("codechef")) {
    return {
      type: "codechef",
      name: "CodeChef",
      color: "#dd6b20",
      hoverColorClass: "hover:text-[#f97316]",
    };
  }
  if (u.includes("leetcode.com") || u.includes("leetcode")) {
    return {
      type: "leetcode",
      name: "LeetCode",
      color: "#f59e0b",
      hoverColorClass: "hover:text-amber-500",
    };
  }
  if (u.includes("spoj.com") || u.includes("spoj")) {
    return {
      type: "spoj",
      name: "SPOJ",
      color: "#805ad5",
      hoverColorClass: "hover:text-[#a855f7]",
    };
  }
  if (u.includes("hackerrank.com") || u.includes("hackerrank")) {
    return {
      type: "hackerrank",
      name: "HackerRank",
      color: "#22c55e",
      hoverColorClass: "hover:text-[#22c55e]",
    };
  }
  if (
    u.includes("yosupo.jp") ||
    u.includes("library-checker") ||
    u.includes("librarychecker")
  ) {
    return {
      type: "yosupo",
      name: "Library Checker",
      color: "#38b2ac",
      hoverColorClass: "hover:text-[#06b6d4]",
    };
  }
  if (u.includes("toph.co") || u.includes("toph")) {
    return {
      type: "toph",
      name: "Toph",
      color: "#38bdf8",
      hoverColorClass: "hover:text-[#38bdf8]",
    };
  }
  if (u.includes("kattis.com") || u.includes("kattis")) {
    return {
      type: "kattis",
      name: "Kattis",
      color: "#60a5fa",
      hoverColorClass: "hover:text-[#60a5fa]",
    };
  }
  if (u.includes("vjudge.net") || u.includes("vjudge")) {
    return {
      type: "vjudge",
      name: "VJudge",
      color: "#d69e2e",
      hoverColorClass: "hover:text-[#eab308]",
    };
  }
  if (u.includes("uva") || u.includes("onlinejudge.org")) {
    return {
      type: "uva",
      name: "UVa Online Judge",
      color: "#94a3b8",
      hoverColorClass: "hover:text-white",
    };
  }

  return {
    type: "other",
    name: "Online Judge",
    color: "#718096",
    hoverColorClass: "hover:text-white",
  };
}

// Official Codeforces 3-Bars Icon
export function CodeforcesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-2A1.5 1.5 0 0 1 1 19.5V9a1.5 1.5 0 0 1 1.5-1.5h2zm7-6A1.5 1.5 0 0 1 13 3v16.5a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 8 19.5V3a1.5 1.5 0 0 1 1.5-1.5h2zm7 9a1.5 1.5 0 0 1 1.5 1.5v7.5A1.5 1.5 0 0 1 18.5 21h-2a1.5 1.5 0 0 1-1.5-1.5V12a1.5 1.5 0 0 1 1.5-1.5h2z" />
    </svg>
  );
}

// Official AtCoder Monogram / Geometric Triangle Icon
export function AtCoderIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2.5L2.2 19.8h4.8l5-8.8 5 8.8h4.8L12 2.5zm0 6.2l2.8 5.1H9.2L12 8.7z" />
    </svg>
  );
}

// Official CSES (Nordic Informatics Cube / Nodes)
export function CsesIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5l7.5 3.8L12 12 4.5 8.3 12 4.5zM4 9.8l7 3.5v7l-7-3.5V9.8zm9 10.5v-7l7-3.5v7l-7 3.5z" />
    </svg>
  );
}

// Official CodeChef Chef Hat Icon
export function CodeChefIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.06 6.74A4.99 4.99 0 0 0 12 2.5a5 5 0 0 0-6.06 4.24A4.5 4.5 0 0 0 2 11c0 2.22 1.6 4.07 3.73 4.43L6 19.5a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5l.27-4.07A4.5 4.5 0 0 0 22 11a4.5 4.5 0 0 0-3.94-4.26zM16 19H8v-2h8v2zm.5-4H7.5l-.26-1.5h9.52l-.26 1.5z" />
    </svg>
  );
}

// Official LeetCode Icon
export function LeetCodeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

// SPOJ (Sphere Online Judge) Icon
export function SpojIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  );
}

// HackerRank Stylized "H" Icon
export function HackerRankIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0a12 12 0 1 0 12 12A12.013 12.013 0 0 0 12 0zm1.75 16.5H11.5v-3.75h-3V16.5H6.25V7.5H8.5v3.75h3V7.5h2.25z" />
    </svg>
  );
}

// Library Checker / Yosupo Icon
export function LibraryCheckerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zm-3-2l-2.5-1.5L12 14V6h5v8z" />
    </svg>
  );
}

// VJudge (Virtual Judge) Icon
export function VJudgeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
    </svg>
  );
}

// Toph Icon
export function TophIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

// Kattis Cat Silhouette Icon
export function KattisIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4 21l3.5-.88A8.94 8.94 0 0 0 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-3 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3 5.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
    </svg>
  );
}

// UVa / Generic Online Judge Icon
export function JudgeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-12-3l3.5-3.5L8 8l1.4-1.4 4.9 4.9-4.9 4.9L8 15z" />
    </svg>
  );
}

// Main PlatformIcon Component
export function PlatformIcon({
  platform,
  className = "w-5 h-5",
}: {
  platform: PlatformType | string;
  className?: string;
}) {
  switch (platform) {
    case "codeforces":
      return <CodeforcesIcon className={className} />;
    case "atcoder":
      return <AtCoderIcon className={className} />;
    case "cses":
      return <CsesIcon className={className} />;
    case "codechef":
      return <CodeChefIcon className={className} />;
    case "leetcode":
      return <LeetCodeIcon className={className} />;
    case "spoj":
      return <SpojIcon className={className} />;
    case "hackerrank":
      return <HackerRankIcon className={className} />;
    case "yosupo":
      return <LibraryCheckerIcon className={className} />;
    case "vjudge":
      return <VJudgeIcon className={className} />;
    case "toph":
      return <TophIcon className={className} />;
    case "kattis":
      return <KattisIcon className={className} />;
    case "uva":
    case "other":
    default:
      return <JudgeIcon className={className} />;
  }
}
