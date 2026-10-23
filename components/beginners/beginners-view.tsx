"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  TrackMeta,
  ChapterData,
  Lecture,
  POTDProblem,
  SystemDesignQuestion,
  AIConcept,
  CompanyMeta,
} from "@/lib/beginners-data";
import {
  Play,
  Check,
  CircleCheck,
  Clock,
  Search,
  Calendar,
  Flame,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Star,
  ArrowRight,
  X,
  Filter,
  Code,
  Terminal,
  Layers,
  CircuitBoard,
  Binary,
  Briefcase,
  Trophy,
  Sparkles,
} from "@/components/animate-ui/icons";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";
import Kbd from "@/components/smoothui/kbd";
import { TooltipProvider, SimpleTooltip } from "@/components/animate-ui/tooltip";
import {
  loadLearningProgress,
  saveLearningProgress,
  type LearningStatus,
} from "@/lib/learning-progress-client";
import { memberStorageKey } from "@/lib/member-storage";
import { cn } from "@/lib/utils";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-3 mt-5 text-lg sm:text-xl font-bold text-white tracking-tight first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2.5 mt-4 text-base sm:text-lg font-bold text-white tracking-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3.5 text-sm sm:text-base font-semibold text-white tracking-tight">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 mt-3 text-xs sm:text-sm font-semibold text-white">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="my-2.5 text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => (
    <em className="text-zinc-200 italic">
      {children}
    </em>
  ),
  ul: ({ children }) => (
    <ul className="my-3 space-y-1.5 pl-5 list-disc marker:text-[#FF1018] text-xs sm:text-sm text-zinc-300 leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-3 space-y-1.5 pl-5 list-decimal marker:text-zinc-400 text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-zinc-300 leading-relaxed">
      {children}
    </li>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded-md border border-white/10 bg-black px-1.5 py-0.5 font-mono text-[0.88em] text-red-300 font-medium">
          {children}
        </code>
      );
    }
    return (
      <code className={cn("block font-mono text-xs text-zinc-200", className)}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-3.5 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-black p-4 text-xs font-mono text-zinc-200 shadow-inner">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-3.5 max-w-full overflow-x-auto rounded-xl border border-white/10 bg-black">
      <table className="min-w-full border-collapse text-left text-xs sm:text-sm divide-y divide-white/10">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[#121218] text-white font-semibold">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 font-semibold text-white text-xs uppercase tracking-wider border-b border-white/10">
      {children}
    </th>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-white/[0.08] text-zinc-300">
      {children}
    </tbody>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-xs text-zinc-300 align-top">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-[#FF1018] bg-black pl-3.5 py-2 text-xs sm:text-sm text-zinc-300 rounded-r-lg">
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-4 border-white/10" />
  ),
};

interface BeginnersViewProps {
  stats: Record<string, number>;
  tracks: TrackMeta[];
  initialPOTD: POTDProblem[];
  systemDesignQuestions: SystemDesignQuestion[];
  aiConcepts: AIConcept[];
  companies: CompanyMeta[];
}

type ActiveTab = "tracks" | "potd" | "system-design" | "ai-concepts" | "companies";

function formatSeconds(sec: number): string {
  if (!sec) return "0m";
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function BeginnersView({
  stats,
  tracks,
  initialPOTD,
  systemDesignQuestions,
  aiConcepts,
  companies,
}: BeginnersViewProps) {
  const { isSignedIn, user } = useUser();
  const userId = user?.id ?? null;
  const localKey = useCallback((key: string) => memberStorageKey(key, userId), [userId]);

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<ActiveTab>("tracks");

  // Track & Chapter selection
  const [selectedTrackSlug, setSelectedTrackSlug] = useState<string>("dsa");
  const [expandedChapterSlug, setExpandedChapterSlug] = useState<string | null>("arrays");
  const [chapterLectures, setChapterLectures] = useState<Record<string, ChapterData>>({});
  const [loadingChapter, setLoadingChapter] = useState<boolean>(false);

  // Video Player Modal state
  const [activeVideo, setActiveVideo] = useState<{
    videoId: string;
    title: string;
    githubUrl?: string | null;
    problemUrl?: string | null;
    difficulty?: string | null;
    progressKey: string;
  } | null>(null);

  // System Design Modal state
  const [activeSDQuestion, setActiveSDQuestion] = useState<SystemDesignQuestion | null>(null);
  const [loadingSDDetail, setLoadingSDDetail] = useState(false);

  // AI Concepts expanded items & filters
  const [expandedConceptSlug, setExpandedConceptSlug] = useState<string | null>(null);
  const [conceptSearch, setConceptSearch] = useState("");
  const [selectedConceptTopic, setSelectedConceptTopic] = useState<string>("all");
  const [copiedConceptSlug, setCopiedConceptSlug] = useState<string | null>(null);

  // Company Sheets search & sheet modal
  const [companySearch, setCompanySearch] = useState("");
  const [activeCompanySheet, setActiveCompanySheet] = useState<{
    company: CompanyMeta;
    problems: any[];
  } | null>(null);
  const [loadingCompanySheet, setLoadingCompanySheet] = useState(false);

  // POTD filter & pagination state
  const [potdSearch, setPotdSearch] = useState("");
  const [potdFilterDiff, setPotdFilterDiff] = useState<string>("all");
  const [potdList, setPotdList] = useState<POTDProblem[]>(initialPOTD);

  // Progress state: Map of progressKey -> "completed" | "started" | "not_started"
  const [progressMap, setProgressMap] = useState<Record<string, LearningStatus>>({});

  // Global search input
  const [globalSearch, setGlobalSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Load progress from API or localStorage
  useEffect(() => {
    let cancelled = false;
    const fetchProgress = async () => {
      // 1. Load local fallback first
      try {
        const raw = localStorage.getItem(localKey("beginners_progress"));
        if (raw) {
          setProgressMap(JSON.parse(raw));
        }
      } catch {
        // ignore
      }

      // 2. Load cloud progress if authenticated
      if (isSignedIn) {
        const cloud = await loadLearningProgress();
        if (cloud && !cancelled) {
          setProgressMap((prev) => ({ ...prev, ...cloud }));
          try {
            localStorage.setItem(localKey("beginners_progress"), JSON.stringify({ ...cloud }));
          } catch {
            // ignore
          }
        }
      }
    };
    void fetchProgress();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, localKey]);

  // Load selected chapter lectures
  const loadChapter = useCallback(
    async (trackSlug: string, chapterSlug: string) => {
      const cacheKey = `${trackSlug}:${chapterSlug}`;
      if (chapterLectures[cacheKey]) {
        return;
      }
      setLoadingChapter(true);
      try {
        const res = await fetch(
          `/api/beginners?type=chapter&track=${encodeURIComponent(trackSlug)}&chapter=${encodeURIComponent(chapterSlug)}`
        );
        if (res.ok) {
          const data = (await res.json()) as ChapterData;
          setChapterLectures((prev) => ({ ...prev, [cacheKey]: data }));
        }
      } catch (err) {
        console.error("Failed to fetch chapter:", err);
      } finally {
        setLoadingChapter(false);
      }
    },
    [chapterLectures]
  );

  // Load initial chapter on mount
  useEffect(() => {
    void loadChapter(selectedTrackSlug, "arrays");
  }, [loadChapter, selectedTrackSlug]);

  // Toggle chapter expansion
  const handleToggleChapter = (chapterSlug: string) => {
    if (expandedChapterSlug === chapterSlug) {
      setExpandedChapterSlug(null);
    } else {
      setExpandedChapterSlug(chapterSlug);
      void loadChapter(selectedTrackSlug, chapterSlug);
    }
  };

  // Toggle item completion
  const handleToggleCompletion = useCallback(
    async (progressKey: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const current = progressMap[progressKey] === "completed";
      const nextStatus: LearningStatus = current ? "not_started" : "completed";
      const updated = { ...progressMap, [progressKey]: nextStatus };
      setProgressMap(updated);

      try {
        localStorage.setItem(localKey("beginners_progress"), JSON.stringify(updated));
      } catch {
        // ignore
      }

      if (isSignedIn) {
        await saveLearningProgress([{ key: progressKey, status: nextStatus }], userId);
      }
    },
    [isSignedIn, localKey, progressMap, userId]
  );

  // Load SD question details for modal
  const handleOpenSDDetail = async (slug: string) => {
    setLoadingSDDetail(true);
    try {
      const res = await fetch(`/api/beginners?type=sd-detail&slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const full = await res.json();
        setActiveSDQuestion(full);
      }
    } catch {
      // ignore
    } finally {
      setLoadingSDDetail(false);
    }
  };

  // Load company problem sheet
  const handleOpenCompanySheet = async (company: CompanyMeta) => {
    setLoadingCompanySheet(true);
    try {
      const res = await fetch(`/api/beginners?type=company-sheet&slug=${encodeURIComponent(company.slug)}`);
      if (res.ok) {
        const sheet = await res.json();
        setActiveCompanySheet({ company, problems: sheet.problems ?? [] });
      }
    } catch {
      // ignore
    } finally {
      setLoadingCompanySheet(false);
    }
  };

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return companies.slice(0, 48);
    const q = companySearch.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(q) || c.slug.includes(q)).slice(0, 48);
  }, [companies, companySearch]);

  // Topic categories for AI Concepts
  const conceptTopics = useMemo(() => {
    const set = new Set<string>();
    aiConcepts.forEach((c) => {
      if (c.topic) set.add(c.topic);
    });
    return Array.from(set);
  }, [aiConcepts]);

  // Filtered AI Concepts
  const filteredConcepts = useMemo(() => {
    return aiConcepts.filter((c) => {
      if (selectedConceptTopic !== "all" && c.topic !== selectedConceptTopic) {
        return false;
      }
      if (!conceptSearch.trim()) return true;
      const q = conceptSearch.toLowerCase();
      const matchesQ = c.question.toLowerCase().includes(q);
      const matchesA = c.answer.toLowerCase().includes(q);
      const matchesTag = c.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesQ || matchesA || matchesTag;
    });
  }, [aiConcepts, selectedConceptTopic, conceptSearch]);

  // Filtered POTD problems
  const filteredPOTD = useMemo(() => {
    return potdList.filter((p) => {
      if (potdFilterDiff !== "all" && p.difficulty !== potdFilterDiff) return false;
      if (!potdSearch.trim()) return true;
      const q = potdSearch.toLowerCase();
      return (
        p.problemName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        String(p.problemNumber).includes(q) ||
        p.topicTags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [potdFilterDiff, potdList, potdSearch]);

  // Filter out any empty or "other" track
  const validTracks = useMemo(() => {
    return tracks.filter((t) => t.slug !== "other" && (t.chapterCount ?? 0) > 0);
  }, [tracks]);

  // Current track metadata
  const currentTrack = useMemo(() => {
    return validTracks.find((t) => t.slug === selectedTrackSlug) ?? validTracks[0];
  }, [selectedTrackSlug, validTracks]);

  // Selected chapter lectures data
  const currentChapterData = useMemo(() => {
    if (!expandedChapterSlug) return null;
    return chapterLectures[`${selectedTrackSlug}:${expandedChapterSlug}`] ?? null;
  }, [chapterLectures, expandedChapterSlug, selectedTrackSlug]);

  // Compute track completion percentage
  const trackStats = useMemo(() => {
    let completedCount = 0;
    Object.keys(progressMap).forEach((k) => {
      if (k.startsWith(`lecture:${selectedTrackSlug}:`) && progressMap[k] === "completed") {
        completedCount++;
      }
    });
    const total = currentTrack?.lectureCount || 1;
    const percent = Math.min(100, Math.round((completedCount / total) * 100));
    return { completedCount, total, percent };
  }, [currentTrack?.lectureCount, progressMap, selectedTrackSlug]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="relative min-h-screen bg-transparent text-foreground pb-24 selection:bg-[#FF1018]/30 selection:text-white">
        {/* Main Centered Container */}
        <div className="mx-auto max-w-[1560px] px-3.5 sm:px-6 lg:px-8 pt-24 sm:pt-28">
          {/* Header Hero Section */}
          <div className="mb-8 text-center flex flex-col items-center">
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-black border border-white/15 text-[#F4F3FC] mb-3 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] animate-pulse" />
              <span>FOUNDATION // STRUCTURED VIDEO CURRICULUM</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2.5">
              Beginners Learning Hub
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mx-auto mb-6">
              Full structured video courses, daily POTD problem vaults, high-level and low-level system design blueprints, and company-wise interview frequency sheets.
            </p>

            {/* Platform Headline Metrics Dock */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 w-full max-w-4xl mx-auto">
              <div className="rounded-2xl border border-white/10 bg-black p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {stats.lectures?.toLocaleString() ?? "1,820"}
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  Lectures
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {stats.hours?.toLocaleString() ?? "739"}h
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  Runtime
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {stats.chapters?.toLocaleString() ?? "41"}
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  Chapters
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  {stats.potd?.toLocaleString() ?? "1,124"}
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  POTD Solved
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-black p-3.5 flex flex-col items-center justify-center text-center shadow-md">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tracking-tight">
                  428
                </span>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                  Companies
                </span>
              </div>
            </div>
          </div>

          {/* Hub Navigation Tabs Bar */}
          <div className="flex items-center justify-center mb-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-black border border-white/10 shadow-lg">
              <button
                type="button"
                onClick={() => setActiveTab("tracks")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "tracks"
                    ? "bg-[#FF1018] text-white shadow-md shadow-[#FF1018]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Binary className="w-4 h-4" />
                <span>Course Tracks</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("potd")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "potd"
                    ? "bg-[#FF1018] text-white shadow-md shadow-[#FF1018]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Calendar className="w-4 h-4" />
                <span>Daily POTD</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("system-design")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "system-design"
                    ? "bg-[#FF1018] text-white shadow-md shadow-[#FF1018]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <CircuitBoard className="w-4 h-4" />
                <span>System Design</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ai-concepts")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "ai-concepts"
                    ? "bg-[#FF1018] text-white shadow-md shadow-[#FF1018]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Terminal className="w-4 h-4" />
                <span>AI Concepts</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("companies")}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                  activeTab === "companies"
                    ? "bg-[#FF1018] text-white shadow-md shadow-[#FF1018]/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Briefcase className="w-4 h-4" />
                <span>Company Sheets</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: COURSE TRACKS & VIDEO LECTURES                                     */}
          {/* ========================================================================= */}
          {activeTab === "tracks" && (
            <div className="space-y-6">
              {/* Track Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {validTracks.map((t) => {
                  const isSelected = t.slug === selectedTrackSlug;
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => {
                        setSelectedTrackSlug(t.slug);
                        const firstCh = t.chapters[0]?.slug ?? null;
                        setExpandedChapterSlug(firstCh);
                        if (firstCh) void loadChapter(t.slug, firstCh);
                      }}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between",
                        isSelected
                          ? "border-[#FF1018] bg-[#FF1018]/10 shadow-lg shadow-[#FF1018]/10"
                          : "border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white tracking-tight">{t.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-[#FF1018]" />}
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                        <span>{t.chapterCount} chapters</span>
                        <span>•</span>
                        <span>{t.lectureCount} lectures</span>
                        <span>•</span>
                        <span>{formatSeconds(t.totalSec)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Track Detail & Chapter List */}
              <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {currentTrack.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                      {currentTrack.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs text-zinc-400">Track Progress</span>
                      <p className="text-sm font-bold font-mono text-white">
                        {trackStats.completedCount} / {trackStats.total} lectures ({trackStats.percent}%)
                      </p>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#FF1018] transition-all duration-300"
                        style={{ width: `${trackStats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter Accordions */}
                <div className="space-y-3">
                  {currentTrack.chapters.map((ch, idx) => {
                    const isExpanded = expandedChapterSlug === ch.slug;
                    const cacheKey = `${selectedTrackSlug}:${ch.slug}`;
                    const chData = chapterLectures[cacheKey];

                    return (
                      <div
                        key={ch.slug}
                        className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden transition-all duration-200"
                      >
                        {/* Chapter Header Trigger */}
                        <button
                          type="button"
                          onClick={() => handleToggleChapter(ch.slug)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center font-mono text-xs font-bold text-zinc-400 shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">
                                {ch.name}
                              </h3>
                              <span className="text-xs text-zinc-500 font-mono">
                                {chData ? `${chData.totalLectures} lectures • ${chData.chapter.estimatedHours}h` : "Click to view lectures"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 text-zinc-400 transition-transform duration-200",
                                isExpanded && "rotate-180 text-white"
                              )}
                            />
                          </div>
                        </button>

                        {/* Chapter Lectures Body */}
                        {isExpanded && (
                          <div className="p-4 pt-1 border-t border-white/10 bg-black/60 space-y-2">
                            {loadingChapter && !chData ? (
                              <div className="py-8 text-center text-xs font-mono text-zinc-500">
                                Loading chapter curriculum...
                              </div>
                            ) : chData && chData.lectures.length > 0 ? (
                              chData.lectures.map((lec) => {
                                const progressKey = `lecture:${selectedTrackSlug}:${lec._id}`;
                                const isCompleted = progressMap[progressKey] === "completed";

                                return (
                                  <div
                                    key={lec._id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.08] bg-black hover:border-white/20 transition-all duration-150"
                                  >
                                    {/* Left: Info */}
                                    <div className="flex items-start gap-3 min-w-0">
                                      <button
                                        type="button"
                                        onClick={(e) => handleToggleCompletion(progressKey, e)}
                                        aria-label="Toggle completed"
                                        className={cn(
                                          "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer",
                                          isCompleted
                                            ? "border-[#FF1018] bg-[#FF1018] text-white"
                                            : "border-white/20 bg-black hover:border-white/40 text-transparent"
                                        )}
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>

                                      <div className="min-w-0">
                                        <p
                                          className={cn(
                                            "text-xs sm:text-sm font-medium text-white leading-snug line-clamp-1",
                                            isCompleted && "line-through text-zinc-500"
                                          )}
                                        >
                                          {lec.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                          <span className="text-[10px] font-mono text-zinc-400">
                                            {formatSeconds(lec.durationSec)}
                                          </span>

                                          {lec.difficulty && (
                                            <Badge
                                              variant="outline"
                                              size="sm"
                                              className={cn(
                                                "text-[9px] uppercase font-bold px-1.5 py-0 border",
                                                lec.difficulty === "easy" && "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                                                lec.difficulty === "medium" && "border-amber-500/30 text-amber-400 bg-amber-500/10",
                                                lec.difficulty === "hard" && "border-rose-500/30 text-rose-400 bg-rose-500/10"
                                              )}
                                            >
                                              {lec.difficulty}
                                            </Badge>
                                          )}

                                          <Badge
                                            variant="outline"
                                            size="sm"
                                            className="text-[9px] uppercase font-semibold border border-white/10 text-zinc-400 bg-black"
                                          >
                                            {lec.section}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                      {/* Watch Video Button */}
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setActiveVideo({
                                            videoId: lec.videoId,
                                            title: lec.title,
                                            githubUrl: lec.githubUrl,
                                            problemUrl: lec.problemUrl,
                                            difficulty: lec.difficulty,
                                            progressKey,
                                          })
                                        }
                                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-[#FF1018] hover:bg-[#E00C14] text-white shadow-sm transition-all cursor-pointer"
                                      >
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>Watch</span>
                                      </button>

                                      {/* Code Link */}
                                      {lec.githubUrl && (
                                        <a
                                          href={lec.githubUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 bg-black text-zinc-300 hover:text-white transition-all"
                                        >
                                          <Code className="w-3.5 h-3.5" />
                                          <span>Code</span>
                                        </a>
                                      )}

                                      {/* Problem Link */}
                                      {lec.problemUrl && (
                                        <a
                                          href={lec.problemUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 bg-black text-zinc-300 hover:text-white transition-all"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5" />
                                          <span>Solve</span>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="py-6 text-center text-xs text-zinc-500">
                                No lectures in this chapter.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DAILY POTD TRACKER                                                 */}
          {/* ========================================================================= */}
          {activeTab === "potd" && (
            <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 shadow-xl">
              {/* POTD Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Daily Problem of the Day (POTD)
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Complete archive of {potdList.length} daily LeetCode problems solved with full intuition and proof videos.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Difficulty Filter */}
                  <select
                    value={potdFilterDiff}
                    onChange={(e) => setPotdFilterDiff(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-white/10 bg-black text-xs font-medium text-zinc-300 focus:outline-none focus:border-white/30"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  {/* Search */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      value={potdSearch}
                      onChange={(e) => setPotdSearch(e.target.value)}
                      placeholder="Search POTD..."
                      className="h-9 pl-8 pr-3 w-48 sm:w-60 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* POTD Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredPOTD.slice(0, 40).map((potd) => {
                  const progressKey = `potd:${potd._id}`;
                  const isCompleted = progressMap[progressKey] === "completed";

                  return (
                    <div
                      key={potd._id}
                      className="rounded-xl border border-white/[0.08] bg-[#0d0d12] p-4 flex flex-col justify-between hover:border-white/20 transition-all duration-150"
                    >
                      <div>
                        {/* Top: Date & Difficulty */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-mono text-zinc-500">{potd.dayDate}</span>
                          <Badge
                            variant="outline"
                            size="sm"
                            className={cn(
                              "text-[9px] uppercase font-bold border px-1.5 py-0",
                              potd.difficulty === "easy" && "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                              potd.difficulty === "medium" && "border-amber-500/30 text-amber-400 bg-amber-500/10",
                              potd.difficulty === "hard" && "border-rose-500/30 text-rose-400 bg-rose-500/10"
                            )}
                          >
                            {potd.difficulty}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h4
                          className={cn(
                            "text-sm font-semibold text-white tracking-tight mb-2 line-clamp-1",
                            isCompleted && "line-through text-zinc-500"
                          )}
                        >
                          {potd.problemNumber ? `${potd.problemNumber}. ` : ""}
                          {potd.problemName || potd.title}
                        </h4>

                        {/* Tags */}
                        {potd.topicTags && potd.topicTags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mb-4">
                            {potd.topicTags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/5 bg-black text-zinc-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Toolbar */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleCompletion(progressKey, e)}
                          className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <span
                            className={cn(
                              "w-4 h-4 rounded border flex items-center justify-center transition-all",
                              isCompleted
                                ? "border-[#FF1018] bg-[#FF1018] text-white"
                                : "border-white/20 bg-black"
                            )}
                          >
                            {isCompleted && <Check className="w-3 h-3" />}
                          </span>
                          <span>{isCompleted ? "Solved" : "Mark Solved"}</span>
                        </button>

                        {/* Watch & Solve buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveVideo({
                                videoId: potd.videoId,
                                title: potd.problemName || potd.title,
                                githubUrl: potd.githubUrl,
                                problemUrl: potd.problemUrl,
                                difficulty: potd.difficulty,
                                progressKey,
                              })
                            }
                            className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold bg-[#FF1018] text-white hover:bg-[#E00C14] transition-all cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Video</span>
                          </button>

                          {potd.problemUrl && (
                            <a
                              href={potd.problemUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 h-7 px-2 rounded-lg text-xs font-medium border border-white/10 hover:border-white/20 bg-black text-zinc-400 hover:text-white transition-all"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>LeetCode</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SYSTEM DESIGN (HLD & LLD)                                          */}
          {/* ========================================================================= */}
          {activeTab === "system-design" && (
            <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 shadow-xl">
              <div className="mb-6 pb-5 border-b border-white/10">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  System Design Architectural Practice (HLD & LLD)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  62 industry case studies with full functional constraints, scale math, rubric scoring, and architectural reference diagrams.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systemDesignQuestions.map((sd) => {
                  return (
                    <div
                      key={sd.slug}
                      className="rounded-xl border border-white/10 bg-[#0d0d12] p-5 flex flex-col justify-between hover:border-white/25 transition-all duration-200"
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="outline"
                            size="sm"
                            className={cn(
                              "text-[10px] font-bold uppercase border px-2 py-0.5",
                              sd.type === "HLD" ? "border-sky-500/30 text-sky-400 bg-sky-500/10" : "border-purple-500/30 text-purple-400 bg-purple-500/10"
                            )}
                          >
                            {sd.type}
                          </Badge>

                          <span className="text-[11px] font-mono text-zinc-500">
                            ~{sd.estimatedMinutes} mins
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white tracking-tight mb-2">
                          {sd.title}
                        </h3>

                        {/* Companies */}
                        {sd.companies && sd.companies.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mb-3">
                            {sd.companies.slice(0, 3).map((comp) => (
                              <span
                                key={comp}
                                className="text-[10px] px-2 py-0.5 rounded-md border border-white/10 bg-black text-zinc-300 font-medium"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Action */}
                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between mt-3">
                        <span className="text-[11px] font-mono text-zinc-500">{sd.level}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenSDDetail(sd.slug)}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white transition-all cursor-pointer"
                        >
                          <span>View Blueprint</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: AI & LLM CONCEPTS                                                 */}
          {/* ========================================================================= */}
          {activeTab === "ai-concepts" && (
            <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    AI & LLM Technical Interview Concepts
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    25 deep-dive questions, embeddings architectures, vector search algorithms, and interview gotchas.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={conceptSearch}
                    onChange={(e) => setConceptSearch(e.target.value)}
                    placeholder="Search 25 AI concepts..."
                    className="h-9 pl-8 pr-3 w-56 sm:w-64 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              {/* Topic Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedConceptTopic("all")}
                  className={cn(
                    "h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0",
                    selectedConceptTopic === "all"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "bg-black border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                  )}
                >
                  All Topics ({aiConcepts.length})
                </button>
                {conceptTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedConceptTopic(topic)}
                    className={cn(
                      "h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer shrink-0",
                      selectedConceptTopic === topic
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "bg-black border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Concepts Accordion List */}
              <div className="space-y-3">
                {filteredConcepts.map((concept, idx) => {
                  const isExpanded = expandedConceptSlug === concept.slug;
                  return (
                    <div
                      key={concept.slug}
                      className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden transition-all duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedConceptSlug(isExpanded ? null : concept.slug)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.03] transition-colors cursor-pointer gap-3"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="w-6 h-6 rounded-md bg-black border border-white/10 flex items-center justify-center font-mono text-xs text-zinc-400 shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
                            {concept.question}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {concept.topic && (
                            <span className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-black text-zinc-400">
                              {concept.topic}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-zinc-400 transition-transform duration-200",
                              isExpanded && "rotate-180 text-white"
                            )}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-5 sm:p-6 border-t border-white/10 bg-black text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {concept.answer}
                          </Markdown>

                          {/* Footer Meta & Actions */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-5 border-t border-white/[0.08]">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {concept.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-[#0d0d12] text-zinc-400"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(
                                  `Q: ${concept.question}\n\n${concept.answer}`
                                );
                                setCopiedConceptSlug(concept.slug);
                                setTimeout(() => setCopiedConceptSlug(null), 2000);
                              }}
                              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold border border-white/10 hover:border-white/20 bg-[#0d0d12] text-zinc-300 hover:text-white transition-all cursor-pointer"
                            >
                              {copiedConceptSlug === concept.slug ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>Copy Notes</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredConcepts.length === 0 && (
                  <div className="py-12 text-center text-xs font-mono text-zinc-500 border border-white/10 rounded-xl bg-[#0d0d12]">
                    No concepts found matching your query.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: COMPANY PROBLEM SHEETS                                             */}
          {/* ========================================================================= */}
          {activeTab === "companies" && (
            <div className="rounded-2xl border border-white/10 bg-black p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Company-Wise Interview Problem Sheets
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Problem frequency rankings across {companies.length} top tech engineering employers.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={companySearch}
                    onChange={(e) => setCompanySearch(e.target.value)}
                    placeholder="Search 428 companies..."
                    className="h-9 pl-8 pr-3 w-48 sm:w-64 rounded-xl border border-white/10 bg-black text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredCompanies.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => handleOpenCompanySheet(c)}
                    className="rounded-xl border border-white/10 bg-[#0d0d12] hover:border-white/25 hover:bg-white/[0.04] p-3.5 text-left transition-all duration-150 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight line-clamp-1 mb-1">
                        {c.name}
                      </h4>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {c.problems} problems
                      </span>
                    </div>
                    <span className="text-[10px] text-[#FF1018] font-semibold mt-2.5 inline-flex items-center gap-1">
                      <span>View Sheet</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* AMOLED VIDEO PLAYER MODAL                                                  */}
        {/* ========================================================================= */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in-50 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0d0d12] p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                <div className="min-w-0 pr-4">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                    {activeVideo.title}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    YouTube ID: {activeVideo.videoId}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shrink-0 mb-4 shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleCompletion(activeVideo.progressKey)}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                    progressMap[activeVideo.progressKey] === "completed"
                      ? "border border-[#FF1018] bg-[#FF1018] text-white"
                      : "border border-white/20 bg-black text-zinc-300 hover:text-white hover:border-white/40"
                  )}
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {progressMap[activeVideo.progressKey] === "completed"
                      ? "Completed"
                      : "Mark Completed"}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  {activeVideo.githubUrl && (
                    <a
                      href={activeVideo.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold border border-white/10 hover:border-white/25 bg-black text-zinc-200 hover:text-white transition-all"
                    >
                      <Code className="w-4 h-4" />
                      <span>GitHub Solution</span>
                    </a>
                  )}

                  {activeVideo.problemUrl && (
                    <a
                      href={activeVideo.problemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl text-xs font-semibold bg-[#FF1018] hover:bg-[#E00C14] text-white transition-all shadow-md"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Solve Problem</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* AMOLED SYSTEM DESIGN BLUEPRINT MODAL                                       */}
        {/* ========================================================================= */}
        {activeSDQuestion && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in-50 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0d0d12] p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" size="sm" className="text-[10px] font-bold uppercase border px-2 py-0.5">
                      {activeSDQuestion.type}
                    </Badge>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeSDQuestion.level} • ~{activeSDQuestion.estimatedMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeSDQuestion.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSDQuestion(null)}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Blueprint Sections */}
              <div className="space-y-6 text-xs sm:text-sm text-zinc-300">
                {/* Problem Statement */}
                {activeSDQuestion.problemStatement && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Problem Statement
                    </h4>
                    <div className="p-4 rounded-xl border border-white/10 bg-black text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {activeSDQuestion.problemStatement}
                      </Markdown>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {activeSDQuestion.functionalReqs && activeSDQuestion.functionalReqs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Functional Requirements
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
                      {activeSDQuestion.functionalReqs.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSDQuestion.nonFunctionalReqs && activeSDQuestion.nonFunctionalReqs.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Non-Functional Requirements
                    </h4>
                    <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
                      {activeSDQuestion.nonFunctionalReqs.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scale Calculations */}
                {activeSDQuestion.scaleHints && activeSDQuestion.scaleHints.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Scale & Capacity Math
                    </h4>
                    <div className="p-3 rounded-xl border border-white/10 bg-black font-mono text-xs text-zinc-400 space-y-1">
                      {activeSDQuestion.scaleHints.map((hint, i) => (
                        <p key={i}>• {hint}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reference Outline */}
                {activeSDQuestion.referenceOutline && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">
                      Architectural Blueprint
                    </h4>
                    <div className="p-4 rounded-xl border border-white/10 bg-black text-xs text-zinc-300 leading-relaxed font-sans">
                      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {activeSDQuestion.referenceOutline}
                      </Markdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* AMOLED COMPANY SHEET MODAL                                                 */}
        {/* ========================================================================= */}
        {activeCompanySheet && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in-50 duration-200"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-4xl rounded-2xl border border-white/15 bg-[#0d0d12] p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10 shrink-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeCompanySheet.company.name} Problem Bank
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    {activeCompanySheet.company.problems} total problems • Top interview frequency
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCompanySheet(null)}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Problems Table / List */}
              <div className="space-y-2">
                {activeCompanySheet.problems.map((p, idx) => (
                  <div
                    key={p.problemSlug || idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-black hover:border-white/20 transition-all text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center font-mono text-zinc-400 shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-white tracking-tight truncate">
                        {p.problemTitle || p.problemSlug}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {p.frequency && (
                        <span className="font-mono text-[11px] text-zinc-500">
                          Freq: {Number(p.frequency).toFixed(1)}
                        </span>
                      )}
                      <a
                        href={`https://leetcode.com/problems/${p.problemSlug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white transition-all text-[11px] font-semibold"
                      >
                        <span>Solve</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
