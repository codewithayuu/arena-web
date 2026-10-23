import React from "react";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Send,
  HeartHandshake,
  ExternalLink,
  Users,
  MessageCircle,
} from "lucide-react";

export function CommunityView() {
  return (
    <div className="space-y-6">
      {/* Intro Paragraphs */}
      <div className="space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
        <p>
          Learning DSA gets easier (and more fun) when you’re not doing it
          alone.
        </p>
        <p>
          Mindflare has an active community across a few places, and you can
          join in wherever you prefer. Here are the best ways to participate:
        </p>
      </div>

      {/* Community Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Discord Card */}
        <div className="p-5 rounded-xl border border-[#5865F2]/30 bg-[#5865F2]/5 hover:bg-[#5865F2]/10 transition-colors flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#5865F2] font-bold text-base">
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z" />
                </svg>
                <span>Discord Community</span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#5865F2]/20 text-[#5865F2]">
                Active Chat
              </span>
            </div>
            <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
              This is the best place for real-time discussions, help, and peer
              learning. Introduce yourself, share what you’re working on, and
              jump into ongoing conversations.
            </p>
          </div>

          <div>
            <a
              href="https://discord.gg/ZnwywQJ2Cx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#5865F2] text-white text-xs font-semibold hover:bg-[#5865F2]/90 transition-colors shadow-xs"
            >
              <span>Join our Discord</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Participation Methods List */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-lg font-bold text-foreground">
          More Ways to Engage
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-border bg-background flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary mt-0.5">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">
                Join the discussion on each lesson
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every topic has a comment section at the bottom. Ask questions,
                share your takeaways, and reply to others. If a comment helped
                you, leave a like so more people find it.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-background flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted text-primary mt-0.5">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-foreground">
                Share feedback
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                We are working hard to improve the content every day. If
                something feels unclear, missing, or could be better, your
                feedback helps us make Mindflare the best place to learn
                software engineering and prepare for interviews.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 text-base font-semibold text-foreground">
        See you inside! 🚀
      </div>
    </div>
  );
}
