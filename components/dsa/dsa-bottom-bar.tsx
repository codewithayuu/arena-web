"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Star,
  CircleCheck,
  Expand,
  ChevronLeft,
  ChevronRight,
  Minimize,
} from "lucide-react";
import { getAdjacentLessons } from "@/lib/dsa-curriculum";
import { loadLearningProgress, saveLearningProgress } from "@/lib/learning-progress-client";
import { loadLearningBookmarks, setLearningBookmark } from "@/lib/learning-bookmarks-client";
import { LessonNotebook } from "@/components/dsa/lesson-notebook";

import SmoothButton from "@/components/smoothui/smooth-button";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface DsaBottomBarProps {
  currentSlug: string;
  bookMode?: boolean;
}

export function DsaBottomBar({ currentSlug, bookMode = false }: DsaBottomBarProps) {
  const { prev, next } = getAdjacentLessons(currentSlug);
  const { isLoaded, isSignedIn, user } = useUser();
  const userId = user?.id ?? null;
  const [isStarred, setIsStarred] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressKey = `lesson:dsa:${currentSlug}`;
  const localBookmarkKey = `mindflare_learning_bookmarks:${userId ?? "guest"}`;
  const localCompletionKey = `mindflare_learning_progress:${userId ?? "guest"}:${progressKey}`;

  useEffect(() => {
    if (!isLoaded) return;
    setIsCompleted(false);
    try { setIsCompleted(localStorage.getItem(localCompletionKey) === "completed"); } catch { /* storage can be unavailable */ }
    if (!isSignedIn) return;
    let cancelled = false;
    void loadLearningProgress().then((progress) => {
      if (!progress || cancelled) return;
      const completed = progress[progressKey] === "completed";
      setIsCompleted(completed);
      try { localStorage.setItem(localCompletionKey, completed ? "completed" : "not_started"); } catch { /* account state stays available */ }
    });
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, localCompletionKey, progressKey]);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    setIsStarred(false);
    if (isSignedIn) {
      void loadLearningBookmarks().then((keys) => {
        if (!cancelled && keys) setIsStarred(keys.includes(progressKey));
      });
    } else {
      try {
        const keys = JSON.parse(localStorage.getItem(localBookmarkKey) ?? "[]") as unknown;
        setIsStarred(Array.isArray(keys) && keys.includes(progressKey));
      } catch { setIsStarred(false); }
    }
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn, localBookmarkKey, progressKey]);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleCompleted = () => {
    const next = !isCompleted;
    setIsCompleted(next);
    try { localStorage.setItem(localCompletionKey, next ? "completed" : "not_started"); } catch { /* account state remains available */ }
    if (isSignedIn) void saveLearningProgress([{ key: progressKey, status: next ? "completed" : "not_started" }], userId);
  };

  const toggleStarred = () => {
    const next = !isStarred;
    setIsStarred(next);
    if (isSignedIn) {
      void setLearningBookmark(progressKey, next, userId);
      return;
    }
    try {
      const previous = JSON.parse(localStorage.getItem(localBookmarkKey) ?? "[]") as unknown;
      const keys = new Set(Array.isArray(previous) ? previous.filter((key): key is string => typeof key === "string") : []);
      if (next) keys.add(progressKey);
      else keys.delete(progressKey);
      localStorage.setItem(localBookmarkKey, JSON.stringify([...keys]));
    } catch { /* this page remains usable if browser storage is disabled */ }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // Browser policy can reject fullscreen; the control remains available for a later attempt.
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border shadow-lg z-[60]">
      <div className="relative w-full py-1.5 sm:py-2 px-3 sm:px-4">
        {/* Left Side: Join Discord */}
        <div className="hidden xl:flex absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 items-center">
          <SimpleTooltip content="Join Discord">
            <a
              href="https://discord.gg/ZnwywQJ2Cx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2 rounded-md hover:bg-muted/50"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 fill-current text-[#5865F2]"
                viewBox="0 0 24 24"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418Z" />
              </svg>
              <span>Join Discord</span>
            </a>
          </SimpleTooltip>
        </div>

        {/* Center: Prev/Next Links & Action Buttons */}
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-1 sm:justify-center sm:gap-3">
          {/* Previous Lesson Link */}
          {prev ? (
            <SimpleTooltip content={`Previous: ${prev.title}`}>
              <SmoothButton
                asChild
                size="xs"
                variant="outline"
                className="min-h-10 shrink-0 gap-1 px-2 font-medium sm:px-3"
              >
                <Link href={prev.href} aria-label={`Previous lesson: ${prev.title}`}>
                  <ChevronLeft className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="sm:hidden">Prev</span>
                  <span className="hidden max-w-[130px] truncate sm:inline">
                    {prev.title}
                  </span>
                </Link>
              </SmoothButton>
            </SimpleTooltip>
          ) : (
            <div className="w-8 sm:w-20" />
          )}

          {/* Action Tools in Center */}
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-2">
            <SmoothButton
              type="button"
              size="xs"
              variant={isStarred ? "soft" : "ghost"}
              color={isStarred ? "amber" : "neutral"}
              onClick={toggleStarred}
              aria-label={isStarred ? "Remove lesson bookmark" : "Bookmark lesson"}
              aria-pressed={isStarred}
              className="min-h-10 min-w-10 gap-1 sm:gap-1.5"
            >
              <Star
                className={`h-3.5 w-3.5 ${isStarred ? "fill-current text-amber-500" : ""}`}
              />
              <span className="hidden sm:inline">Star</span>
            </SmoothButton>

            <SmoothButton
              type="button"
              size="xs"
              variant={isCompleted ? "soft" : "ghost"}
              color={isCompleted ? "accent" : "neutral"}
              onClick={toggleCompleted}
              aria-label={isCompleted ? "Mark lesson incomplete" : "Mark lesson complete"}
              aria-pressed={isCompleted}
              className="min-h-10 min-w-10 gap-1 sm:gap-1.5"
            >
              <CircleCheck
                className={`h-3.5 w-3.5 ${isCompleted ? "fill-current text-cyan-400" : ""}`}
              />
              <span className="hidden sm:inline">Complete</span>
            </SmoothButton>

            <LessonNotebook
              currentSlug={currentSlug}
              bookMode={bookMode}
              responsiveMoreMenu
              mobileMoreAction={(
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  aria-pressed={isFullscreen}
                  className="flex min-h-10 w-full items-center gap-1.5 rounded-md px-3 text-left text-sm text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
                  <span>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</span>
                </button>
              )}
              onBookModeChange={(enabled) => {
                const path = `/learn/dsa/${currentSlug}`;
                window.location.href = enabled ? `${path}?book=1` : path;
              }}
            />

            <SimpleTooltip content={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
              <SmoothButton
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={() => void toggleFullscreen()}
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                aria-pressed={isFullscreen}
                className="hidden min-h-10 min-w-10 text-muted-foreground hover:text-foreground md:inline-flex"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
              </SmoothButton>
            </SimpleTooltip>
          </div>

          {/* Next Lesson Link */}
          {next ? (
            <SimpleTooltip content={`Next: ${next.title}`}>
              <SmoothButton
                asChild
                size="xs"
                variant="outline"
                className="min-h-10 shrink-0 gap-1 px-2 font-medium sm:px-3"
              >
                <Link href={next.href} aria-label={`Next lesson: ${next.title}`}>
                  <span className="sm:hidden">Next</span>
                  <span className="hidden max-w-[130px] truncate sm:inline">
                    {next.title}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                </Link>
              </SmoothButton>
            </SimpleTooltip>
          ) : (
            <div className="w-8 sm:w-20" />
          )}
        </div>

      </div>
    </div>
  );
}
