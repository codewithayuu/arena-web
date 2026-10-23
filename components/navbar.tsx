"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  X,
  Search,
  Sparkles,
  Code2,
  Workflow,
  ArrowRight,
  BookOpen,
  Film,
  Compass,
  Trophy,
  Flame,
  Clock,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
} from "lucide-react";
import { AccountMenu } from "./account-menu";

interface MegaItem {
  title: string;
  category: string;
  badge?: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient?: string;
}

const PRACTICE_ITEMS: MegaItem[] = [
  {
    title: "Topic-Wise Practice",
    category: "TOPICS",
    badge: "New",
    description: "Curated problem sets across Two Pointers, Trees, Graphs & Dynamic Programming.",
    href: "/topic-list",
    icon: Code2,
  },
  {
    title: "DSA Patterns",
    category: "TECHNIQUES",
    badge: "New",
    description: "Master 20+ core interview patterns with visual logic and mental models.",
    href: "/practice/dsa-patterns",
    icon: Sparkles,
  },
  {
    title: "Company Tracks",
    category: "INTERVIEWS",
    badge: "New",
    description: "Targeted problem banks for Google, Amazon, Meta, Microsoft & top engineering firms.",
    href: "/practice/company/google",
    icon: Workflow,
  },
];

const LEARN_ITEMS: MegaItem[] = [
  {
    title: "Beginners",
    category: "FOUNDATION",
    badge: "New",
    description: "Structured video tracks, daily POTD tracker, System Design outlines & company problem sheets.",
    href: "/learn/beginners",
    icon: GraduationCap,
  },
  {
    title: "DSA Interactive Course",
    category: "CURRICULUM",
    badge: "Free",
    description: "From beginner fundamentals to advanced competitive programming theory.",
    href: "/learn/dsa/course-introduction",
    icon: BookOpen,
  },
  {
    title: "Algorithm Visualizer",
    category: "ANIMATIONS",
    badge: "Interactive",
    description: "Step through sorting, graph traversals & tree rotations with real-time state.",
    href: "/animations",
    icon: Film,
  },
  {
    title: "Career & Tech Roadmaps",
    category: "CAREER",
    description: "Step-by-step guides for Frontend, Backend, DevOps & Software Engineering.",
    href: "/roadmaps",
    icon: Compass,
  },
  {
    title: "Topic List Directory",
    category: "INDEX",
    description: "Explore all data structures and algorithms grouped by Department curriculum.",
    href: "/topic-list",
    icon: Code2,
  },
];

const CONTEST_ITEMS: MegaItem[] = [
  {
    title: "Mindflare Arena Weekly",
    category: "OFFICIAL CONTEST",
    badge: "Live",
    description: "Timed 2-hour algorithmic competition with live leaderboards & rating changes.",
    href: "/contests",
    icon: Trophy,
  },
  {
    title: "Practice Sprints",
    category: "VIRTUAL RUNS",
    description: "Take past contests in virtual simulated test environments with full automated judge.",
    href: "/contests",
    icon: Clock,
  },
  {
    title: "Global Arena Leaderboard",
    category: "RANKINGS",
    description: "Department rankings, performance statistics & hall of fame.",
    href: "/leaderboard",
    icon: Flame,
  },
];

type ActiveTab = "practice" | "learn" | "contests" | null;
type MobileDrill = "practice" | "learn" | "contests" | null;

export function Navbar() {
  const pathname = usePathname() || "/";
  const menuId = useId();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDrill, setMobileDrill] = useState<MobileDrill>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileDrill(null);
    setActiveTab(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setMobileDrill(null);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // High-performance throttled scroll listener (fires ONLY when crossing the 20px threshold)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openTab = (tab: ActiveTab) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveTab(tab);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setActiveTab(null);
    }, 180);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-300 ${isScrolled ? "header-scrolled" : ""
        }`}
      style={{
        "--hdr-s": isScrolled ? 1 : 0,
      } as React.CSSProperties}
    >
      {/* ─── 4-Tier Progressive Gradient Blur (GPU-Isolated) ─── */}
      <div
        className="header-bar pointer-events-none absolute inset-0 -bottom-6 overflow-hidden"
        style={{ contain: "strict", transform: "translateZ(0)" }}
        aria-hidden="true"
      >
        <div className="header-bar-blur header-bar-blur-1 absolute inset-0" />
        <div className="header-bar-blur header-bar-blur-2 absolute inset-0" />
        <div className="header-bar-blur header-bar-blur-3 absolute inset-0" />
        <div className="header-bar-blur header-bar-blur-4 absolute inset-0" />
      </div>

      {/* ─── 3-Column Mathematically Centered Grid Layout (Full Width, Extreme Left Logo) ─── */}
      <div className="relative w-full pl-3 sm:pl-4 lg:pl-5 pr-3.5 sm:pr-5 lg:pr-6 py-2.5 sm:py-3">
        <div className="flex justify-between md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-2.5 sm:gap-4 h-10">

          {/* 1. Left (col 1, justify-self-start): Mindflare Text Logo */}
          <div className="pointer-events-auto justify-self-start flex items-center overflow-visible h-10">
            <Link
              href="/"
              aria-label="Mindflare Home"
              className="flex items-center h-full group transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040] rounded-xl"
            >
              <Image
                src="/images/Logo-Text.svg"
                alt="Mindflare"
                width={172}
                height={30}
                priority
                className="h-[28px] sm:h-[30px] w-auto object-contain brightness-110 drop-shadow-[0_2px_14px_rgba(249,1,16,0.28)] transition-transform duration-200 group-hover:scale-105 origin-left"
              />
            </Link>
          </div>

          {/* 2. Center (Desktop): The 3 Floating Glass Islands */}
          <div
            className="pointer-events-auto hidden md:flex items-center gap-1.5 lg:gap-2.5 justify-self-center relative h-10"
            onMouseEnter={() => {
              if (closeTimerRef.current) {
                clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
              }
            }}
            onMouseLeave={scheduleClose}
          >
            {/* Primary Nav Pill with Collapsible Hover Tabs */}
            <nav
              aria-label="Primary navigation"
              className="glass-pill h-10 flex items-center gap-0.5 lg:gap-1 rounded-full px-1.5 lg:px-2 relative shrink-0"
            >
              <Link
                href="/"
                onMouseEnter={() => openTab(null)}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${pathname === "/" && !activeTab
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Home
              </Link>

              {/* Hover Tab 1: Practice */}
              <Link
                href="/practice"
                onMouseEnter={() => openTab("practice")}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${activeTab === "practice" || (pathname.startsWith("/practice") && !activeTab)
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Practice
              </Link>

              {/* Hover Tab 2: Learn */}
              <Link
                href="/learn/dsa/course-introduction"
                onMouseEnter={() => openTab("learn")}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${activeTab === "learn" || (pathname.startsWith("/learn") && !activeTab)
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Learn
              </Link>

              {/* Hover Tab 3: Contests */}
              <Link
                href="/contests"
                onMouseEnter={() => openTab("contests")}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${activeTab === "contests" || (pathname.startsWith("/contests") && !activeTab)
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Contests
              </Link>
            </nav>

            {/* Island 3: Secondary Ecosystem Pill */}
            <nav
              aria-label="Ecosystem navigation"
              className="glass-pill h-10 flex items-center gap-0.5 lg:gap-1 rounded-full px-1.5 lg:px-2 shrink-0"
            >
              <Link
                href="/courses"
                onMouseEnter={() => openTab(null)}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${pathname === "/courses" && !activeTab
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Courses
              </Link>
              <Link
                href="/roadmaps"
                onMouseEnter={() => openTab(null)}
                className={`h-8 flex items-center px-2.5 lg:px-3.5 text-xs lg:text-sm font-medium rounded-full transition-all duration-200 ${pathname === "/roadmaps" && !activeTab
                    ? "bg-white/[0.14] text-white shadow-inner"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.08]"
                  }`}
              >
                Roadmaps
              </Link>
            </nav>
          </div>

          {/* 3. Right: Desktop Account / Mobile Hamburger */}
          <div className="pointer-events-auto justify-self-end flex items-center gap-2 h-10">
            <div className="hidden md:flex items-center h-full">
              <AccountMenu size="desktop" variant="pill" />
            </div>

            {/* GetLayers Style Circular Mobile Hamburger Toggle */}
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={menuId}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid md:hidden h-10 w-10 place-items-center rounded-full glass-pill text-white transition-all hover:border-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e83040]"
            >
              {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        {/* ─── DESKTOP CENTRALLY ALIGNED MEGA-MENU DROPDOWN ─── */}
        <AnimatePresence>
          {activeTab && (
            <div
              className="fixed top-[4.25rem] left-1/2 -translate-x-1/2 w-[min(940px,calc(100vw-2.5rem))] pointer-events-auto z-40 hidden md:block"
              onMouseEnter={() => {
                if (closeTimerRef.current) {
                  clearTimeout(closeTimerRef.current);
                  closeTimerRef.current = null;
                }
              }}
              onMouseLeave={scheduleClose}
            >
              {/* Invisible Hover Bridge */}
              <div className="h-3 w-full" />

              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative glass-megamenu p-5 sm:p-6 text-white overflow-hidden"
              >
                {/* TAB 1: PRACTICE MEGA MENU */}
                {activeTab === "practice" && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {PRACTICE_ITEMS.map((card) => {
                        const IconComponent = card.icon;
                        return (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group relative flex gap-3.5 rounded-2xl p-3.5 transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.18] hover:shadow-xl hover:shadow-black/50"
                          >
                            <div
                              className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/[0.18] group-hover:scale-105 transition-all duration-200"
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                  {card.category}
                                </span>
                                {card.badge && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border border-white/20 bg-white/10 text-white">
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold tracking-tight text-white group-hover:text-red-400 transition-colors mt-0.5 truncate">
                                {card.title}
                              </h4>
                              <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {card.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Plus 500+ problems across all tiers. Updated weekly.
                      </span>
                      <Link
                        href="/practice"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-white font-medium transition-colors"
                      >
                        <span>Explore all practice</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 2: LEARN MEGA MENU */}
                {activeTab === "learn" && (
                  <div>
                    <div className="grid grid-cols-2 gap-3.5">
                      {LEARN_ITEMS.map((card) => {
                        const IconComponent = card.icon;
                        return (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group relative flex gap-3.5 rounded-2xl p-3.5 transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.18]"
                          >
                            <div
                              className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/[0.18] group-hover:scale-105 transition-all duration-200"
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                  {card.category}
                                </span>
                                {card.badge && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border border-white/20 bg-white/10 text-white">
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold tracking-tight text-white group-hover:text-red-400 transition-colors mt-0.5 truncate">
                                {card.title}
                              </h4>
                              <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {card.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Interactive, intuition-driven computer science syllabus.
                      </span>
                      <Link
                        href="/learn/dsa/course-introduction"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-white font-medium transition-colors"
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* TAB 3: CONTESTS MEGA MENU */}
                {activeTab === "contests" && (
                  <div>
                    <div className="grid grid-cols-3 gap-3.5">
                      {CONTEST_ITEMS.map((card) => {
                        const IconComponent = card.icon;
                        return (
                          <Link
                            key={card.title}
                            href={card.href}
                            className="group relative flex flex-col gap-2.5 rounded-2xl p-4 transition-all duration-200 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-white/[0.18]"
                          >
                            <div
                              className="h-10 w-10 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/[0.18] group-hover:scale-105 transition-all duration-200"
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                                  {card.category}
                                </span>
                                {card.badge && (
                                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border border-red-500/40 bg-red-500/20 text-red-300">
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-semibold tracking-tight text-white group-hover:text-red-400 transition-colors mt-0.5">
                                {card.title}
                              </h4>
                              <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {card.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                      <span className="text-zinc-400">
                        Official contests run on isolated judge sandboxes.
                      </span>
                      <Link
                        href="/contests"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-medium transition-colors"
                      >
                        <span>Enter Contests Arena</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ─── EXACT GETLAYERS MOBILE MENU (DRILL-DOWN REPLICA) ─── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Fullscreen Frosted Dark Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden pointer-events-auto"
                aria-hidden="true"
              />

              {/* Floating Glass Sheet Panel (Top-Right Anchored & Compact) */}
              <motion.div
                id={menuId}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile Navigation"
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "fixed",
                  top: "3.75rem",
                  right: "0.875rem",
                  left: "auto",
                }}
                className="w-[min(280px,calc(100vw-1.75rem))] max-h-[calc(100dvh-4.5rem)] z-50 overflow-hidden !rounded-2xl glass-megamenu p-2 sm:p-2.5 text-white md:hidden pointer-events-auto flex flex-col origin-top-right shadow-2xl border border-white/10"
              >
                {/* ─── LEVEL 0: ROOT MENU ─── */}
                {!mobileDrill && (
                  <motion.div
                    key="root"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.16 }}
                    className="flex flex-col h-full overflow-y-auto"
                  >
                    <ul className="grid gap-0.5">
                      <li>
                        <Link
                          href="/"
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium transition-all ${pathname === "/" ? "bg-white/[0.12] text-white" : "text-zinc-200 hover:bg-white/[0.06] hover:text-white"
                            }`}
                        >
                          <span>Home</span>
                        </Link>
                      </li>

                      {/* Drill-down trigger: Practice */}
                      <li>
                        <button
                          type="button"
                          onClick={() => setMobileDrill("practice")}
                          className="w-full flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Practice</span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                        </button>
                      </li>

                      {/* Drill-down trigger: Learn */}
                      <li>
                        <button
                          type="button"
                          onClick={() => setMobileDrill("learn")}
                          className="w-full flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Learn</span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                        </button>
                      </li>

                      {/* Drill-down trigger: Contests */}
                      <li>
                        <button
                          type="button"
                          onClick={() => setMobileDrill("contests")}
                          className="w-full flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Contests</span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
                        </button>
                      </li>

                      <li>
                        <Link
                          href="/courses"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Courses</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/roadmaps"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Roadmaps</span>
                        </Link>
                      </li>

                      <li>
                        <Link
                          href="/topic-list"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex h-9 items-center justify-between rounded-xl px-3 text-xs sm:text-[13px] font-medium text-zinc-200 hover:bg-white/[0.06] hover:text-white transition-all"
                        >
                          <span>Topic Directory</span>
                        </Link>
                      </li>
                    </ul>

                    {/* Mobile Bottom Account Section */}
                    <div className="mt-2.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between px-1">
                      <span className="text-[11px] text-zinc-400 font-medium">Your Account</span>
                      <AccountMenu size="mobile" variant="pill" />
                    </div>
                  </motion.div>
                )}

                {/* ─── LEVEL 1: PRACTICE DRILL-DOWN SUBMENU ─── */}
                {mobileDrill === "practice" && (
                  <motion.div
                    key="drill-practice"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.16 }}
                    className="flex flex-col h-full overflow-y-auto"
                  >
                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setMobileDrill(null)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white pb-2 mb-1.5 border-b border-white/[0.08] transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center">
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                      <span>Back</span>
                    </button>

                    <div className="grid gap-1.5 overflow-y-auto pr-0.5">
                      {PRACTICE_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all"
                          >
                            <div className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] transition-all">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                              <span className="text-[10px] text-zinc-400 line-clamp-1">{item.description}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08]">
                      <Link
                        href="/practice"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.08] text-white text-[11px] font-semibold hover:bg-white/[0.15] transition-colors"
                      >
                        <span>Explore all practice</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* ─── LEVEL 1: LEARN DRILL-DOWN SUBMENU ─── */}
                {mobileDrill === "learn" && (
                  <motion.div
                    key="drill-learn"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.16 }}
                    className="flex flex-col h-full overflow-y-auto"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileDrill(null)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white pb-2 mb-1.5 border-b border-white/[0.08] transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center">
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                      <span>Back</span>
                    </button>

                    <div className="grid gap-1.5 overflow-y-auto pr-0.5">
                      {LEARN_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all"
                          >
                            <div className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] transition-all">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                              <span className="text-[10px] text-zinc-400 line-clamp-1">{item.description}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08]">
                      <Link
                        href="/learn/beginners"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.08] text-white text-[11px] font-semibold hover:bg-white/[0.15] transition-colors"
                      >
                        <span>Start Learning</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* ─── LEVEL 1: CONTESTS DRILL-DOWN SUBMENU ─── */}
                {mobileDrill === "contests" && (
                  <motion.div
                    key="drill-contests"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.16 }}
                    className="flex flex-col h-full overflow-y-auto"
                  >
                    <button
                      type="button"
                      onClick={() => setMobileDrill(null)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 hover:text-white pb-2 mb-1.5 border-b border-white/[0.08] transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center">
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </div>
                      <span>Back</span>
                    </button>

                    <div className="grid gap-1.5 overflow-y-auto pr-0.5">
                      {CONTEST_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] transition-all"
                          >
                            <div className="h-7 w-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-zinc-300 group-hover:text-white group-hover:bg-white/[0.08] transition-all">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-semibold text-white truncate">{item.title}</span>
                              <span className="text-[10px] text-zinc-400 line-clamp-1">{item.description}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/[0.08]">
                      <Link
                        href="/contests"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-[11px] font-semibold hover:bg-red-500/30 transition-colors"
                      >
                        <span>Enter Contests Arena</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
