"use client";

import React, { useState } from "react";
import { UserProfileData } from "@/lib/profile-data";
import { CreditCard, Share2 } from "lucide-react";
import { Award, Sparkles, Download, Check, ExternalLink } from "@/components/animate-ui/icons";
import SmoothButton from "@/components/smoothui/smooth-button";
import { VerifiedSealBadge, getPlatformIconPath } from "./verified-badge";

interface BadgesAndCardPanelProps {
  profile: UserProfileData;
}

export function BadgesAndCardPanel({ profile }: BadgesAndCardPanelProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Holographic Developer Card Section */}
      <div className="rounded-2xl border border-white/10 bg-black p-6 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Information */}
        <div className="space-y-3 max-w-md">
          <div className="flex items-center gap-2 text-xs font-bold text-[#ff4452] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#ff1018]" />
            <span>Digital Developer Identity</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Mindflare Arena Scorecard
          </h2>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Your scorecard summarizes verified, provider-reported stats from the coding accounts you connect.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <SmoothButton
              variant="outline"
              color="neutral"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="rounded-xl border-white/10 bg-[#141418] hover:bg-[#202026] text-zinc-200 hover:text-white font-semibold text-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{isFlipped ? "Flip to Front" : "Flip to Back"}</span>
            </SmoothButton>

            <SmoothButton
              variant="outline"
              color="neutral"
              size="sm"
              onClick={handleCopyLink}
              className="rounded-xl border-white/10 bg-[#141418] hover:bg-[#202026] text-zinc-200 hover:text-white font-semibold text-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied!" : "Share Scorecard"}</span>
            </SmoothButton>
          </div>
        </div>

        {/* Right 3D Interactive Card */}
        <div className="w-full max-w-[340px] perspective-[1000px]">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-[200px] rounded-2xl relative transition-transform duration-700 transform-gpu cursor-pointer select-none ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of Card */}
            <div
              className={`absolute inset-0 rounded-2xl p-5 border border-zinc-700/80 bg-gradient-to-br from-[#1c1c24] via-[#121218] to-[#0a0a0d] shadow-2xl flex flex-col justify-between overflow-hidden ${
                isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              {/* Official Codolio Grid Background Pattern */}
              <img
                src="/images/badges/grid.svg"
                alt="Grid Pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />

              {/* Card Holographic Ambient Sheen */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff1018]/25 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#ff1018] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#ff1018]/30">
                    M
                  </div>
                  <span className="text-xs font-black tracking-wider text-white">MINDFLARE ARENA</span>
                </div>
                {profile.isVerified && <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                  <VerifiedSealBadge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED</span>
                </div>}
              </div>

              {/* Middle User Info */}
              <div className="relative z-10 flex items-center gap-3 my-auto">
                <img
                  src={profile.personalDetails.imageUrl || "/images/mindflare_m_logo.svg"}
                  alt={profile.firstName}
                  className="w-12 h-12 rounded-full border border-zinc-600 bg-zinc-900 object-cover shadow-md"
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 truncate">
                    <span>{profile.firstName} {profile.secondName}</span>
                    {profile.isVerified && <VerifiedSealBadge className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400 truncate">@{profile.username}</p>
                  <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">{profile.personalDetails.college}</p>
                </div>
              </div>

              {/* Bottom Tags */}
              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-zinc-800 text-[10px] font-mono">
                <div className="text-zinc-400">
                  SOLVED: <span className="font-bold text-white tabular-nums">{profile.totalQuestionsSolved ?? "—"}</span>
                </div>
                <div className="text-zinc-400">
                  ACTIVE: <span className="font-bold text-white tabular-nums">{profile.totalActiveDays || "—"}</span><span className="text-zinc-400 font-sans">d</span>
                </div>
                <div className="text-zinc-400">
                  TIER: <span className="font-bold text-[#facc15]">Specialist</span>
                </div>
              </div>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute inset-0 rounded-2xl p-5 border border-zinc-700/80 bg-gradient-to-br from-[#15151c] to-[#09090c] shadow-2xl flex flex-col justify-between overflow-hidden ${
                !isFlipped ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
              style={{ transform: "rotateY(180deg)" }}
            >
              {/* Official Codolio Grid Background Pattern */}
              <img
                src="/images/badges/grid.svg"
                alt="Grid Pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
              />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider">Top Skills & Tags</span>
                <span className="text-[10px] font-mono text-zinc-400">7 PLATFORMS</span>
              </div>

              <div className="relative z-10 flex flex-wrap gap-1.5 my-auto">
                {profile.problemSolvingTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-[#1c1c24] border border-zinc-700 text-xs font-mono font-bold text-zinc-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="relative z-10 pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center justify-between">
                <span>Codolio Protocol Verified</span>
                <span>ID: {profile.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Earned Badges Grid */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Earned Badges & Achievements
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Official medals awarded by LeetCode, CodeChef, and CodeStudio</p>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-300">
            {profile.badges.length} Badges
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {profile.badges.length === 0 && <p className="col-span-full rounded-xl border border-white/10 bg-[#0a0a0c] p-5 text-center text-sm text-zinc-400">No badge data is available from the connected providers yet.</p>}
          {profile.badges.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-xl border border-white/10 bg-[#0a0a0c] flex flex-col items-center text-center hover:border-white/20 transition-all group relative overflow-hidden"
            >
              <div className="w-14 h-14 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-2.5 p-1.5 group-hover:scale-110 transition-transform">
                {b.icon ? (
                  <img src={b.icon} alt={b.badgeName} className="w-full h-full object-contain drop-shadow" />
                ) : (
                  <Award className="w-7 h-7 text-amber-400" />
                )}
              </div>
              <span className="text-xs font-bold text-white line-clamp-1">{b.badgeName}</span>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400 font-mono">
                <img
                  src={getPlatformIconPath(b.platform)}
                  alt={b.platform}
                  className="w-3 h-3 object-contain shrink-0"
                />
                <span>{b.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
