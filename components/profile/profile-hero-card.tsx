"use client";

import React from "react";
import { UserProfileData } from "@/lib/profile-data";
import {
  GraduationCap,
  MapPin,
  Share2,
  UserCog,
  Eye,
  CreditCard,
  ExternalLink,
  Code2,
  Globe,
} from "lucide-react";
import { Link as LinkIcon } from "@/components/animate-ui/icons";
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

  // Extract social links from github or connected accounts
  const githubAccount = platforms.find((p) => p.platform === "github");
  const githubUrl = githubAccount?.profileUrl || (profile.github.githubProfile ? `https://github.com/${profile.github.githubProfile}` : undefined);
  const linkedinAccount = platforms.find((p) => (p.platform as string) === "linkedin");
  const twitterAccount = platforms.find((p) => (p.platform as string) === "twitter");

  return (
    <aside className="w-full md:w-[320px] shrink-0 space-y-4 font-poppins">
      {/* 1. Main User Identity Card — Solid AMOLED Black (Codolio 1:1) */}
      <div className="rounded-xl border border-white/10 bg-black p-5 shadow-sm">
        {/* Top Header Row: Views count & Verified badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Eye className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-medium text-zinc-300">
              {profileViews === null ? "Views unavailable" : `${profileViews} views`}
            </span>
          </div>

          {isVerified && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <VerifiedSealBadge className="w-4 h-4 text-emerald-400" />
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Avatar & User Names */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3 group">
            <div className="w-24 h-24 rounded-full p-1 bg-black border border-white/15 shadow-sm overflow-hidden">
              <img
                src={personalDetails.imageUrl || "/images/mindflare_m_logo.svg"}
                alt={fullName}
                className="w-full h-full object-cover rounded-full bg-zinc-900"
              />
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={onOpenEdit}
                className="absolute bottom-0 right-0 p-1.5 rounded-full bg-zinc-900 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white transition-all shadow-md cursor-pointer"
                title="Edit Profile"
              >
                <UserCog className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <h1 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{fullName}</span>
            {isVerified && (
              <SimpleTooltip content="Verified Developer">
                <span className="inline-flex items-center shrink-0">
                  <VerifiedSealBadge className="w-4 h-4 text-emerald-400" />
                </span>
              </SimpleTooltip>
            )}
          </h1>

          <p className="text-xs font-medium text-zinc-400 mt-0.5 mb-2">
            @{username}
          </p>

          {/* User Bio */}
          {personalDetails.bio && (
            <p className="text-xs text-zinc-300 leading-relaxed text-center px-2 py-1 my-2 bg-zinc-900/60 border border-white/5 rounded-lg">
              "{personalDetails.bio}"
            </p>
          )}
        </div>

        {/* User Academic & Location Details */}
        <div className="space-y-2 border-t border-white/10 pt-3.5 text-xs text-zinc-300">
          {personalDetails.college && (
            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-white line-clamp-1">
                  {personalDetails.college}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {personalDetails.degree && personalDetails.branch
                    ? `${personalDetails.degree} in ${personalDetails.branch}`
                    : personalDetails.branch || personalDetails.degree || "Student"}
                  {personalDetails.yearOfGraduation ? ` (${personalDetails.yearOfGraduation})` : ""}
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

        {/* Social Links Row */}
        <div className="flex items-center justify-center gap-2 border-t border-white/10 mt-3 pt-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
              title="GitHub Profile"
            >
              <img src="/images/platform-icons/github.png" alt="GitHub" className="w-4 h-4 object-contain" />
            </a>
          )}
          {linkedinAccount?.profileUrl && (
            <a
              href={linkedinAccount.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
              title="LinkedIn Profile"
            >
              <img src="/images/platform-icons/linkedin.png" alt="LinkedIn" className="w-4 h-4 object-contain" />
            </a>
          )}
          {twitterAccount?.profileUrl && (
            <a
              href={twitterAccount.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
              title="Twitter Profile"
            >
              <img src="/images/platform-icons/twitter.png" alt="Twitter" className="w-4 h-4 object-contain" />
            </a>
          )}
          <button
            type="button"
            onClick={onOpenShareModal}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all"
            title="Share Profile"
          >
            <Globe className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-2">
          {canEdit && (
            <button
              type="button"
              onClick={onOpenConnect}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#ff1018] hover:bg-[#e00e15] text-white font-semibold text-xs transition-colors shadow-sm cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Connect &amp; Sync Accounts</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onOpenCardModal}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              <span>Scorecard</span>
            </button>

            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform Accounts Sidebar List — Solid AMOLED Black (Codolio 1:1) */}
      <div className="rounded-xl border border-white/10 bg-black shadow-sm overflow-hidden divide-y divide-white/10">
        {/* Header */}
        <div className="p-3 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#ff1018]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Problem Solving Stats
            </span>
          </div>
          <span className="text-xs font-bold text-zinc-300">
            ({profile.totalQuestionsSolved ?? "—"})
          </span>
        </div>

        {/* Platform Rows */}
        <div className="p-2 space-y-1 bg-black">
          {platforms.map((p) => {
            const iconPath = getPlatformIconPath(p.platform);

            return (
              <a
                key={p.platform}
                href={p.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={iconPath}
                    alt={p.name}
                    className="w-4 h-4 object-contain shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-semibold text-white group-hover:text-red-400 transition-colors flex items-center gap-1">
                      <span>{p.name}</span>
                      {p.isVerified && <VerifiedSealBadge className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">
                      {p.isConnected ? `@${p.userName}` : "Not Connected"}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <div className="font-bold text-white text-xs font-sans">
                    {(p.totalQuestionsSolved ?? 0) > 0 ? (
                      <span className="inline-flex items-baseline gap-1">
                        <span>{p.totalQuestionsSolved}</span>
                        <span className="text-[10px] font-normal text-zinc-400">Solved</span>
                      </span>
                    ) : p.currentRating ? (
                      <span className="inline-flex items-baseline gap-1">
                        <span className="text-[10px] font-normal text-zinc-400">Rating</span>
                        <span>{p.currentRating}</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </div>
                  {p.currentRating !== undefined && (p.totalQuestionsSolved ?? 0) > 0 && (
                    <div className="text-[10px] text-emerald-400 font-semibold">
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
