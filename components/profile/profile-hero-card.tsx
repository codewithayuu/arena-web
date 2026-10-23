"use client";

import React from "react";
import { UserProfileData } from "@/lib/profile-data";
import SmoothButton from "@/components/smoothui/smooth-button";
import {
  GraduationCap,
  MapPin,
  Share2,
  UserCog,
  Eye,
  CreditCard,
  Code2,
} from "lucide-react";
import {
  Flame,
  Trophy,
  Link as LinkIcon,
  ChevronRight,
  ExternalLink,
  Code,
} from "@/components/animate-ui/icons";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { VerifiedSealBadge, getPlatformIconPath } from "./verified-badge";

interface ProfileHeroCardProps {
  profile: UserProfileData;
  canEdit: boolean;
  onOpenEdit: () => void;
  onOpenConnect: () => void;
  onOpenCardModal: () => void;
  onOpenShareModal: () => void;
}

export function ProfileHeroCard({
  profile,
  canEdit,
  onOpenEdit,
  onOpenConnect,
  onOpenCardModal,
  onOpenShareModal,
}: ProfileHeroCardProps) {
  const { firstName, secondName, username, isVerified, profileViews, personalDetails, platforms } = profile;
  const fullName = `${firstName} ${secondName}`.trim() || username;

  return (
    <aside className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-4">
      {/* 1. Main User Identity Card - AMOLED Solid Opaque */}
      <div className="rounded-2xl border border-white/10 bg-black p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle Brand Red Glow Accent */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-48 h-20 bg-[#ff1018]/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-300">{profileViews === null ? "Views not tracked" : `${profileViews} views`}</span>
          </div>

          {isVerified && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <VerifiedSealBadge className="w-4 h-4 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Avatar & Names */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-3 group">
            <div className="w-24 h-24 rounded-full p-1 bg-black border-2 border-white/15 shadow-xl overflow-hidden">
              <img
                src={personalDetails.imageUrl || "/images/mindflare_m_logo.svg"}
                alt={fullName}
                className="w-full h-full object-cover rounded-full bg-[#121216]"
              />
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#16161b] border border-white/20 hover:border-white text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
                title="Edit Profile"
              >
                <UserCog className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <h1 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{fullName}</span>
            {isVerified && (
              <SimpleTooltip content="Verified Developer (Codolio Certified)">
                <span className="inline-flex items-center shrink-0">
                  <VerifiedSealBadge className="w-5 h-5 text-emerald-400" />
                </span>
              </SimpleTooltip>
            )}
          </h1>

          {/* Clean Handle Typography */}
          <p className="text-xs font-mono font-medium text-amber-300/90 mt-1 mb-3">
            @{username}
          </p>

          {/* Bio Box */}
          {personalDetails.bio && (
            <p className="text-xs text-zinc-300 leading-relaxed mb-4 px-3 py-2.5 text-center bg-[#0d0d12] border border-white/10 rounded-xl">
              "{personalDetails.bio}"
            </p>
          )}
        </div>

        {/* Key Info Details */}
        <div className="space-y-2.5 border-t border-white/10 pt-3.5 text-xs text-zinc-300 relative z-10">
          {personalDetails.college && (
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-[#ff1018] shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-white line-clamp-1">{personalDetails.college}</span>
                <span className="text-[11px] text-zinc-400">
                  {personalDetails.degree} in {personalDetails.branch} ({personalDetails.yearOfGraduation})
                </span>
              </div>
            </div>
          )}

          {personalDetails.country && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>{personalDetails.country}</span>
            </div>
          )}
        </div>

        {/* Quick Highlights Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/10 text-center relative z-10">
          <div className="p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
              <Code className="w-3.5 h-3.5 text-[#ff1018]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Solved</span>
            </div>
            <div className="text-xl font-black text-white font-mono tabular-nums">{profile.totalQuestionsSolved ?? "—"}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-[#ff1018]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Active</span>
            </div>
            <div className="text-xl font-black text-white font-mono tabular-nums inline-flex items-baseline justify-center gap-0.5">
              <span>{profile.totalActiveDays || "—"}</span>
              <span className="text-xs font-normal text-zinc-400 font-sans">d</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0a0a0c] border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex items-center justify-center gap-1 text-zinc-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Contests</span>
            </div>
            <div className="text-xl font-black text-white font-mono tabular-nums">{profile.contests.length}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2 relative z-10">
          {canEdit && <SmoothButton
            variant="solid"
            color="destructive"
            size="sm"
            onClick={onOpenConnect}
            className="w-full rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-xs shadow-md shadow-[#ff1018]/20"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Connect & Sync Accounts</span>
          </SmoothButton>}

          <div className="grid grid-cols-2 gap-2">
            <SmoothButton
              variant="outline"
              color="neutral"
              size="sm"
              onClick={onOpenCardModal}
              className="w-full rounded-xl border-white/10 bg-[#141418] hover:bg-[#202026] text-zinc-200 hover:text-white font-semibold text-xs shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Scorecard</span>
            </SmoothButton>

            <SmoothButton
              variant="outline"
              color="neutral"
              size="sm"
              onClick={onOpenShareModal}
              className="w-full rounded-xl border-white/10 bg-[#141418] hover:bg-[#202026] text-zinc-200 hover:text-white font-semibold text-xs shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Share</span>
            </SmoothButton>
          </div>
        </div>
      </div>

      {/* 2. Platform Navigation List Card — Matching Codolio Inspiration Sidebar */}
      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl overflow-hidden divide-y divide-white/10">
        {/* Active Problem Solving Section Header */}
        <div className="p-3 bg-[#0a0a0c] border-l-4 border-[#ff1018] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-[#ff1018]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Problem Solving Stats
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-zinc-300">
            ({profile.totalQuestionsSolved ?? "—"})
          </span>
        </div>

        {/* Platform Rows List */}
        <div className="p-2 space-y-1 bg-black">
          {platforms.map((p) => {
            const iconPath = getPlatformIconPath(p.platform);

            return (
              <a
                key={p.platform}
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#0a0a0c] border border-transparent hover:border-white/10 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={iconPath}
                    alt={p.name}
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-white group-hover:text-[#ff4452] transition-colors flex items-center gap-1">
                      <span>{p.name}</span>
                      {p.isVerified && <VerifiedSealBadge className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 truncate">
                      {p.isConnected ? `@${p.userName}` : "Not Connected"}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <div className="font-mono font-bold text-white text-xs">
                  {(p.totalQuestionsSolved ?? 0) > 0 ? (
                      <span className="inline-flex items-baseline gap-1">
                        <span>{p.totalQuestionsSolved}</span>
                        <span className="text-[10px] font-normal text-zinc-400 font-sans">Solved</span>
                      </span>
                    ) : p.currentRating ? (
                      <span className="inline-flex items-baseline gap-1">
                        <span className="text-[10px] font-normal text-zinc-400 font-sans">Rating</span>
                        <span>{p.currentRating}</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                  {p.currentRating !== undefined && (p.totalQuestionsSolved ?? 0) > 0 && (
                    <div className="text-[10px] font-mono text-emerald-400 font-semibold">
                      Rating: {p.currentRating}
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
