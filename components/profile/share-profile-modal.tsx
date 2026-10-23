"use client";

import React, { useState } from "react";
import SmoothButton from "@/components/smoothui/smooth-button";
import { Copy, Share2 } from "lucide-react";
import { X, Check } from "@/components/animate-ui/icons";

import { UserProfileData } from "@/lib/profile-data";

interface ShareProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  profile?: UserProfileData;
}

export function ShareProfileModal({ isOpen, onClose, username, profile }: ShareProfileModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const targetUser = username || profile?.username || "profile";
  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/profile/${encodeURIComponent(targetUser)}`
    : `https://arena.mindflare.org/profile/${targetUser}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `Check out my competitive programming portfolio on Mindflare Arena!`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#ff1018]" />
            <span>Share Profile</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Share your verified Mindflare CP scorecard across technical networks:
        </p>

        {/* Copy Link Input */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={profileUrl}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
          />
          <SmoothButton
            variant="solid"
            color="destructive"
            size="sm"
            onClick={handleCopy}
            className="rounded-xl bg-[#ff1018] hover:bg-[#e00e15] text-white font-bold text-xs shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </SmoothButton>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-800 bg-[#141418] hover:border-blue-500/50 hover:bg-blue-500/10 text-xs font-bold text-white transition-all"
          >
            <svg className="w-4 h-4 fill-[#0077b5]" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-zinc-800 bg-[#141418] hover:border-zinc-600 hover:bg-zinc-800 text-xs font-bold text-white transition-all"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Twitter / X</span>
          </a>
        </div>
      </div>
    </div>
  );
}
