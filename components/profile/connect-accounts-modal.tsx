"use client";

import React, { useEffect, useState } from "react";
import { UserProfileData, PlatformProfile } from "@/lib/profile-data";
import SmoothButton from "@/components/smoothui/smooth-button";
import {
  X,
  Check,
  ExternalLink,
  ChevronRight,
  Code,
  Flame,
  User,
  Layers,
  ArrowLeft,
  CircleCheck,
} from "@/components/animate-ui/icons";
import { Trash2, AlertCircle, Shield } from "lucide-react";
import { getPlatformIconPath, VerifiedSealBadge } from "./verified-badge";
import { PlatformVerificationModal } from "./platform-verification-modal";

interface ConnectAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onUpdatePlatforms: (updatedPlatforms: PlatformProfile[]) => void;
}

interface PlatformItemConfig {
  key: PlatformProfile["platform"];
  name: string;
  category: "development" | "problemSolving";
  urlPrefix: string;
  placeholder: string;
  color: string;
}

const ALL_PLATFORMS_CONFIG: PlatformItemConfig[] = [
  {
    key: "github",
    name: "Github",
    category: "development",
    urlPrefix: "https://github.com/",
    placeholder: "https://github.com/username",
    color: "#ffffff",
  },
  {
    key: "leetcode",
    name: "LeetCode",
    category: "problemSolving",
    urlPrefix: "https://leetcode.com/u/",
    placeholder: "https://leetcode.com/u/ayu_cp",
    color: "#f59e0b",
  },
  {
    key: "codestudio",
    name: "CodeStudio",
    category: "problemSolving",
    urlPrefix: "https://www.naukri.com/code360/profile/",
    placeholder: "https://www.naukri.com/code360/profile/ayussh",
    color: "#f97316",
  },
  {
    key: "geeksforgeeks",
    name: "GeeksForGeeks",
    category: "problemSolving",
    urlPrefix: "https://www.geeksforgeeks.org/user/",
    placeholder: "https://www.geeksforgeeks.org/user/johndoe",
    color: "#10b981",
  },
  {
    key: "interviewbit",
    name: "InterviewBit",
    category: "problemSolving",
    urlPrefix: "https://www.interviewbit.com/profile/",
    placeholder: "https://www.interviewbit.com/profile/johndoe",
    color: "#38bdf8",
  },
  {
    key: "codechef",
    name: "CodeChef",
    category: "problemSolving",
    urlPrefix: "https://www.codechef.com/users/",
    placeholder: "https://www.codechef.com/users/johndoe",
    color: "#8b5cf6",
  },
  {
    key: "codeforces",
    name: "CodeForces",
    category: "problemSolving",
    urlPrefix: "https://codeforces.com/profile/",
    placeholder: "https://codeforces.com/profile/johndoe",
    color: "#ef4444",
  },
  {
    key: "hackerrank",
    name: "HackerRank",
    category: "problemSolving",
    urlPrefix: "https://www.hackerrank.com/profile/",
    placeholder: "https://www.hackerrank.com/profile/johndoe",
    color: "#10b981",
  },
  {
    key: "atcoder",
    name: "AtCoder",
    category: "problemSolving",
    urlPrefix: "https://atcoder.jp/users/",
    placeholder: "https://atcoder.jp/users/johndoe",
    color: "#94a3b8",
  },
];

export function ConnectAccountsModal({
  isOpen,
  onClose,
  profile,
  onUpdatePlatforms,
}: ConnectAccountsModalProps) {
  const [platformsState, setPlatformsState] = useState<PlatformProfile[]>(profile.platforms);
  const [platformActionError, setPlatformActionError] = useState<string | null>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<string>("platform");

  useEffect(() => {
    if (isOpen) {
      setPlatformsState(profile.platforms);
      setPlatformActionError(null);
    }
  }, [isOpen, profile.platforms]);

  // State to control the interactive 3-step verification modal
  const [activeVerification, setActiveVerification] = useState<{
    isOpen: boolean;
    platform: string;
    platformName: string;
    handle: string;
  }>({
    isOpen: false,
    platform: "",
    platformName: "",
    handle: "",
  });

  if (!isOpen) return null;

  // Helper to extract clean handle
  const cleanHandleString = (raw: string) => {
    return raw
      .trim()
      .replace(/^https?:\/\/(www\.)?leetcode\.com\/(u\/)?/, "")
      .replace(/^https?:\/\/(www\.)?codeforces\.com\/profile\//, "")
      .replace(/^https?:\/\/(www\.)?codechef\.com\/users\//, "")
      .replace(/^https?:\/\/(www\.)?atcoder\.jp\/users\//, "")
      .replace(/^https?:\/\/(www\.)?geeksforgeeks\.org\/user\//, "")
      .replace(/^https?:\/\/(www\.)?naukri\.com\/code360\/profile\//, "")
      .replace(/^https?:\/\/(www\.)?hackerrank\.com\/profile\//, "")
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .replace(/^https?:\/\/(www\.)?interviewbit\.com\/profile\//, "")
      .replace(/\/$/, "");
  };

  const getPlatformState = (key: string) => {
    return platformsState.find((p) => p.platform.toLowerCase() === key.toLowerCase());
  };

  const handleInputChange = (key: PlatformProfile["platform"], value: string) => {
    setPlatformsState((prev) => {
      const existing = prev.find((p) => p.platform.toLowerCase() === key.toLowerCase());
      if (existing) {
        return prev.map((p) =>
          p.platform.toLowerCase() === key.toLowerCase() ? { ...p, userName: value } : p
        );
      } else {
        const config = ALL_PLATFORMS_CONFIG.find((c) => c.key === key);
        return [
          ...prev,
          {
            platform: key,
            name: config?.name || key,
            userName: value,
            profileUrl: `${config?.urlPrefix || ""}${cleanHandleString(value)}`,
            totalQuestionsSolved: 0,
            color: config?.color || "#ffffff",
            isConnected: false,
            isVerified: false,
          },
        ];
      }
    });
  };

  const handleDisconnect = async (key: string) => {
    setPlatformActionError(null);
    const platform = getPlatformState(key);
    if (platform?.isVerified) {
      try {
        const response = await fetch(`/api/profile/platforms?platform=${encodeURIComponent(key)}`, { method: "DELETE" });
        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(data.error || "Could not disconnect this platform");
        }
      } catch (error) {
        setPlatformActionError(error instanceof Error ? error.message : "Could not disconnect this platform");
        return;
      }
    }
    const updated = platformsState.map((item) => item.platform.toLowerCase() === key.toLowerCase()
      ? { ...item, userName: "", isConnected: false, isVerified: false, totalQuestionsSolved: 0, currentRating: undefined, maxRating: undefined, rank: undefined, profileStats: undefined, lastSyncedAt: undefined }
      : item);
    setPlatformsState(updated);
    onUpdatePlatforms(updated);
  };

  const handleStartVerify = (key: string) => {
    const pState = getPlatformState(key);
    const rawVal = pState?.userName || "";
    const cleanHandle = cleanHandleString(rawVal);
    const config = ALL_PLATFORMS_CONFIG.find((c) => c.key === key);

    if (!cleanHandle) return;

    setActiveVerification({
      isOpen: true,
      platform: key,
      platformName: config?.name || key,
      handle: cleanHandle,
    });
  };

  const handleVerificationSuccess = (verifiedData: any) => {
    setPlatformsState((prev) => {
      const updated = prev.map((p) => {
        if (p.platform.toLowerCase() === verifiedData.platform.toLowerCase()) {
          return {
            ...p,
            userName: verifiedData.userName,
            isConnected: true,
            isVerified: true,
            totalQuestionsSolved: verifiedData.totalQuestionsSolved ?? p.totalQuestionsSolved,
            currentRating: verifiedData.currentRating ?? p.currentRating,
            maxRating: verifiedData.maxRating ?? p.maxRating,
            rank: verifiedData.rank ?? p.rank,
            profileStats: verifiedData.profileStats ?? p.profileStats,
            lastSyncedAt: verifiedData.lastSyncedAt ?? p.lastSyncedAt,
          };
        }
        return p;
      });
      onUpdatePlatforms(updated);
      return updated;
    });
  };

  const devPlatforms = ALL_PLATFORMS_CONFIG.filter((p) => p.category === "development");
  const psPlatforms = ALL_PLATFORMS_CONFIG.filter((p) => p.category === "problemSolving");

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div className="flex h-[680px] max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0f] text-white shadow-2xl md:flex-row">
          {/* ========================================================
              LEFT SIDEBAR (Matching Screenshot 1)
              ======================================================== */}
          <aside className="flex w-full shrink-0 flex-col justify-between border-b border-white/10 bg-[#09090c] p-3 md:w-56 md:border-b-0 md:border-r md:p-4">
            <div className="space-y-4">
              {/* Back to Profile Button */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer py-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Profile</span>
              </button>

              {/* Navigation Items */}
              <nav className="grid grid-cols-2 gap-1 pt-2 md:block md:space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("basic")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSidebarTab === "basic"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <User className="w-4 h-4 text-zinc-400" />
                  <span>Basic Info</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("details")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSidebarTab === "details"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span>Profile Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("platform")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSidebarTab === "platform"
                      ? "bg-white/15 text-white border border-white/10"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Code className="w-4 h-4 text-[#ff1018]" />
                  <span>Platform</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("visibility")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSidebarTab === "visibility"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Shield className="w-4 h-4 text-zinc-400" />
                  <span>Visibility</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSidebarTab("accounts")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeSidebarTab === "accounts"
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Flame className="w-4 h-4 text-zinc-400" />
                  <span>Accounts</span>
                </button>
              </nav>
            </div>

            <div className="hidden border-t border-white/10 pt-4 text-[10px] font-mono text-zinc-500 md:block">
              Mindflare Profile Sync v1.4
            </div>
          </aside>

          {/* ========================================================
              RIGHT CONTENT PANEL (Matching Screenshot 1)
              ======================================================== */}
          <main className="flex min-h-0 min-w-0 flex-1 flex-col justify-between overflow-y-auto p-3 no-scrollbar md:p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="pb-4 border-b border-white/10">
                <h1 className="text-xl font-black text-white tracking-tight">Platforms</h1>
                <p className="text-xs text-zinc-400 mt-0.5">
                  You can update and verify your platform details here.
                </p>
              </div>

              {/* 1. Development Section */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Development
                </h2>

                {devPlatforms.map((item) => {
                  const pState = getPlatformState(item.key);
                  const isConnected = !!pState?.isConnected;

                  return (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl border border-white/10 bg-[#08080a] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2.5 text-xs font-bold text-white">
                        <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        <span>{item.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                      </div>

                      <div className="flex items-center gap-2">
                        {isConnected ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>@{pState?.userName}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDisconnect(item.key)}
                              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-white/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <SmoothButton
                            variant="outline"
                            color="neutral"
                            size="sm"
                            onClick={() => handleStartVerify(item.key)}
                            className="rounded-lg border-white/15 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4"
                          >
                            Connect
                          </SmoothButton>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 2. Problem Solving Section */}
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Problem Solving
                </h2>

                <div className="space-y-2.5">
                  {psPlatforms.map((item) => {
                    const pState = getPlatformState(item.key);
                    const rawVal = pState?.userName || "";
                    const isVerified = !!pState?.isVerified;
                    const isConnected = !!pState?.isConnected;

                    return (
                      <div
                        key={item.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2 rounded-xl bg-[#08080a] border border-white/10 hover:border-white/20 transition-all"
                      >
                        {/* Platform Name and Icon */}
                        <div className="flex items-center gap-2.5 w-36 shrink-0 text-xs font-bold text-white">
                          <img
                            src={getPlatformIconPath(item.key)}
                            alt={item.name}
                            className="w-4 h-4 object-contain shrink-0"
                          />
                          <span className="truncate">{item.name}</span>
                          <ChevronRight className="w-3 h-3 text-zinc-500 shrink-0" />
                        </div>

                        {/* Input Box for URL / Handle */}
                        <div className="flex min-w-0 flex-1 flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={rawVal}
                            onChange={(e) => handleInputChange(item.key, e.target.value)}
                            placeholder={item.placeholder}
                            className="w-full min-w-0 flex-1 bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-[#ff1018]"
                          />

                          {/* Action Button: Verify or Submit */}
                          {isVerified ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                                <VerifiedSealBadge className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Verified</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDisconnect(item.key)}
                                title="Disconnect account"
                                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <SmoothButton
                              variant="solid"
                              color="destructive"
                              size="xs"
                              disabled={!rawVal.trim()}
                              onClick={() => handleStartVerify(item.key)}
                              className="shrink-0 self-end rounded-lg bg-zinc-800 hover:bg-[#ff1018] text-zinc-200 hover:text-white font-bold text-xs px-3.5 py-1.5 border border-white/10 hover:border-[#ff1018] transition-all cursor-pointer disabled:opacity-40 sm:self-auto"
                            >
                              Verify
                            </SmoothButton>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom FAQ footnote (from Screenshot 1) */}
              <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-[10px] shrink-0">
                  !
                </div>
                <span>
                  If you are getting this warning, please check the{" "}
                  <span className="text-amber-400 hover:underline cursor-pointer">FAQ</span> to know
                  why this happens and how to fix it.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            {platformActionError && <p role="alert" className="pt-3 text-xs text-rose-300">{platformActionError}</p>}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10 mt-6">
              <SmoothButton
                variant="outline"
                color="neutral"
                size="sm"
                onClick={onClose}
                className="rounded-xl border-white/10 bg-zinc-900 text-zinc-300 hover:text-white font-semibold text-xs"
              >
                Close
              </SmoothButton>
            </div>
          </main>
        </div>
      </div>

      {/* ========================================================
          INTERACTIVE 3-STEP VERIFICATION MODAL
          (Driven by Animate UI Tabs & Live Verification Worker)
          ======================================================== */}
      <PlatformVerificationModal
        isOpen={activeVerification.isOpen}
        onClose={() => setActiveVerification((prev) => ({ ...prev, isOpen: false }))}
        platform={activeVerification.platform}
        platformName={activeVerification.platformName}
        handle={activeVerification.handle}
        onVerificationSuccess={handleVerificationSuccess}
      />
    </>
  );
}
