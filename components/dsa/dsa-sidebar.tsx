"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Award,
  FileText,
  FilePlay,
  PlayCircle,
  CodeXml,
  Menu,
  X,
  Layers,
} from "lucide-react";
import {
  getCourseCurriculum,
  getCourseTitle,
  CourseModule,
  CourseLesson,
} from "@/lib/curriculum-data";
import { getModuleIcon } from "@/lib/dsa-module-icons";
import { useOptionalDsaSidebar } from "@/components/dsa/dsa-sidebar-context";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface DsaSidebarProps {
  course?: string;
  activeSlug?: string;
}

function renderLessonIcon(lesson: CourseLesson, isActive: boolean) {
  if (lesson.iconType === "code") {
    const diff = lesson.difficulty?.toLowerCase();
    const colorClass =
      diff === "hard" || diff === "advanced"
        ? "text-red-500"
        : diff === "medium" || diff === "intermediate"
          ? "text-orange-500"
          : "text-red-500";

    return (
      <CodeXml
        className={`w-4 h-4 transition-colors ${colorClass}`}
        aria-hidden="true"
      />
    );
  }

  if (
    lesson.iconType === "video" ||
    lesson.title.toLowerCase().includes("video")
  ) {
    return (
      <FilePlay
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-cyan-400" : "text-muted-foreground"
        }`}
        aria-hidden="true"
      />
    );
  }

  if (lesson.iconType === "custom") {
    return (
      <CodeXml
        className={`w-4 h-4 transition-colors ${
          isActive ? "text-cyan-400" : "text-red-500"
        }`}
        aria-hidden="true"
      />
    );
  }

  return (
    <FileText
      className={`w-4 h-4 transition-colors ${
        isActive ? "text-cyan-400" : "text-muted-foreground"
      }`}
      aria-hidden="true"
    />
  );
}

export function DsaSidebar({ course, activeSlug }: DsaSidebarProps) {
  const pathname = usePathname();
  const currentCourse =
    course ||
    (pathname?.startsWith("/learn/") ? pathname.split("/")[2] : "dsa");
  const currentSlug =
    activeSlug || pathname?.split("/").pop() || "course-introduction";

  const curriculum = useMemo(
    () => getCourseCurriculum(currentCourse),
    [currentCourse],
  );
  const courseTitle = useMemo(
    () => getCourseTitle(currentCourse),
    [currentCourse],
  );
  const totalLessons = useMemo(
    () => curriculum.reduce((acc, m) => acc + m.total, 0),
    [curriculum],
  );

  const sidebarContext = useOptionalDsaSidebar();
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isCollapsed = sidebarContext
    ? sidebarContext.isCollapsed
    : localCollapsed;
  const setIsCollapsed = sidebarContext
    ? sidebarContext.setIsCollapsed
    : setLocalCollapsed;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Find which module contains currentSlug
  const initialExpandedModules = useMemo(() => {
    const state: Record<string, boolean> = {};
    curriculum.forEach((mod: CourseModule) => {
      const hasCurrent = mod.items.some(
        (item: CourseLesson) => item.slug === currentSlug,
      );
      state[mod.title] = hasCurrent;
    });
    // If none matched, expand the first one
    if (!Object.values(state).some(Boolean) && curriculum.length > 0) {
      state[curriculum[0].title] = true;
    }
    return state;
  }, [curriculum, currentSlug]);

  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >(initialExpandedModules);

  // Auto-expand module when currentSlug or curriculum changes
  useEffect(() => {
    curriculum.forEach((mod: CourseModule) => {
      if (mod.items.some((item: CourseLesson) => item.slug === currentSlug)) {
        setExpandedModules((prev) => ({ ...prev, [mod.title]: true }));
      }
    });
  }, [curriculum, currentSlug]);

  const toggleModule = (title: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filter modules and lessons based on searchQuery
  const filteredCurriculum = useMemo(() => {
    if (!searchQuery.trim()) return curriculum;
    const q = searchQuery.toLowerCase().trim();

    return curriculum
      .map((mod: CourseModule) => {
        const moduleMatch = mod.title.toLowerCase().includes(q);
        const matchingItems = mod.items.filter(
          (item: CourseLesson) =>
            !item.isLabel &&
            (item.title.toLowerCase().includes(q) ||
              (item.subsection && item.subsection.toLowerCase().includes(q))),
        );
        if (moduleMatch || matchingItems.length > 0) {
          return {
            ...mod,
            items: moduleMatch ? mod.items : matchingItems,
          };
        }
        return null;
      })
      .filter(Boolean) as CourseModule[];
  }, [curriculum, searchQuery]);

  return (
    <>
      {/* Mobile Drawer Trigger (Floating on small screens) */}
      <div className="md:hidden desktop:hidden fixed bottom-16 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-background border border-border shadow-xl text-sm font-medium text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle curriculum menu"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
          <span>Course Menu</span>
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden desktop:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Collapsed Narrow Icon Rail for Desktop */}
      {isCollapsed && (
        <aside
          aria-label="Collapsed course menu"
          className="hidden md:flex desktop:flex fixed left-2 top-20 bottom-14 z-30 flex-col gap-1 bg-background/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg p-2 h-[calc(100vh-8.5rem)] overflow-y-auto w-14 items-center [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-thumb]:rounded-full [scrollbar-width:thin] [scrollbar-color:rgb(220_220_220/0.5)_transparent] dark:[scrollbar-color:rgb(30_30_30/0.5)_transparent]"
        >
          {/* Expand Button */}
          <SimpleTooltip content="Expand menu" side="right">
            <SmoothButton
              size="icon"
              variant="outline"
              onClick={() => setIsCollapsed(false)}
              aria-label="Expand course menu"
              className="w-10 h-10 mb-1 text-muted-foreground hover:text-foreground shrink-0"
            >
              <ChevronRight className="w-5 h-5 text-foreground/70" />
            </SmoothButton>
          </SimpleTooltip>

          {/* Module Icons */}
          {curriculum.map((mod: CourseModule) => {
            const hasActiveLesson = mod.items.some(
              (item: CourseLesson) => item.slug === currentSlug,
            );
            return (
              <SimpleTooltip key={mod.title} content={mod.title} side="right">
                <button
                  type="button"
                  onClick={() => {
                    setIsCollapsed(false);
                    setExpandedModules((prev) => ({
                      ...prev,
                      [mod.title]: true,
                    }));
                  }}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group/icon flex-shrink-0 ${
                    hasActiveLesson
                      ? "bg-primary/10 ring-1 ring-primary/30 shadow-sm text-primary"
                      : "hover:bg-muted/60 hover:scale-[1.05] hover:ring-1 hover:ring-border/80 text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label={mod.title}
                >
                  {getModuleIcon(mod.title)}
                  {hasActiveLesson && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
                  )}
                </button>
              </SimpleTooltip>
            );
          })}
        </aside>
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-20 bottom-14 z-50 transition-all duration-300 ease-in-out ${
          isCollapsed
            ? "-translate-x-full opacity-0 pointer-events-none xl:w-0"
            : "translate-x-0 opacity-100"
        } ${
          mobileOpen
            ? "left-0 right-0 max-w-sm sm:max-w-md w-full px-2"
            : "left-2 w-[min(290px,38vw)] hidden md:block desktop:block"
        }`}
      >
        <nav className="relative h-full z-40 transition-all duration-300 ease-in-out overflow-visible">
          {/* Desktop Collapse Button on right rail */}
          <SimpleTooltip content="Collapse menu" side="left">
            <SmoothButton
              size="icon-sm"
              variant="outline"
              onClick={() => setIsCollapsed(true)}
              aria-label="Collapse course menu"
              className="hidden md:flex desktop:flex absolute -right-3.5 top-4 rounded-full bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border shadow-md z-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </SmoothButton>
          </SimpleTooltip>

          <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm border border-border/60 rounded-xl shadow-xl overflow-hidden pointer-events-auto">
            {/* Mobile close button */}
            <SmoothButton
              size="icon-sm"
              variant="ghost"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="md:hidden desktop:hidden absolute right-3 top-3 text-muted-foreground hover:text-foreground z-20"
            >
              <X className="w-4 h-4" />
            </SmoothButton>

            {/* Sidebar Header */}
            <div className="p-4 pb-2 pr-8 border-b border-border/40">
              <Link
                href="/learn/dsa"
                className="mb-2.5 -ml-1 flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground w-fit"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Courses</span>
              </Link>

              <div>
                <h2 className="text-[17px] font-bold tracking-tight text-foreground leading-snug">
                  {courseTitle}
                </h2>
              </div>

              {/* Progress Summary */}
              <div className="mt-3.5 pb-1">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="text-2xl font-bold tabular-nums text-foreground leading-none">
                    0
                    <span className="text-sm font-semibold text-muted-foreground ml-0.5">
                      %
                    </span>
                  </span>
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 px-2 py-0.5 text-xs font-semibold text-muted-foreground/70 bg-muted/40 cursor-default"
                  >
                    <Award className="h-3 w-3 flex-shrink-0" />
                    <span>Certificate</span>
                  </Badge>
                  <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                    0
                    <span className="text-muted-foreground/60">
                      /{totalLessons}
                    </span>
                  </span>
                </div>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-black via-red-500 to-black h-full w-[1%] transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.35)]" />
                </div>
              </div>
            </div>

            {/* Grip handle indicator on right rail */}
            <div className="hidden md:flex desktop:flex absolute top-1/2 -right-1.5 -translate-y-1/2 w-3.5 h-8 rounded-full border border-border/80 bg-background/95 items-center justify-center shadow-sm text-muted-foreground/60 select-none pointer-events-none z-10">
              <span className="text-[9px] font-mono leading-none tracking-tighter">
                ⋮⋮
              </span>
            </div>

            {/* Search Bar & Filter */}
            <div className="p-3 border-b border-border/30">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chapters..."
                    className="w-full pl-9 pr-8 h-10 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.1)] transition-all duration-200"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Modules Accordion List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-sm">
              {filteredCurriculum.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No chapters found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredCurriculum.map((module: CourseModule) => {
                  const isExpanded =
                    searchQuery.trim().length > 0 ||
                    !!expandedModules[module.title];
                  const hasActiveLesson = module.items.some(
                    (item: CourseLesson) => item.slug === currentSlug,
                  );

                  return (
                    <div
                      key={module.title}
                      className="group/module rounded-lg overflow-hidden"
                    >
                      {/* Module Header Button */}
                      <button
                        onClick={() => toggleModule(module.title)}
                        className={`flex items-center justify-between w-full pl-3 pr-2.5 py-2.5 rounded-md text-sm font-semibold transition-colors duration-200 text-left ${
                          hasActiveLesson
                            ? "text-foreground bg-muted/40"
                            : "text-foreground/90 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center flex-shrink-0 text-muted-foreground group-hover/module:text-foreground transition-colors">
                            {getModuleIcon(module.title) || (
                              <Layers className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="truncate leading-tight font-semibold text-foreground text-[14px]">
                            {module.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                          {/* Circular Progress & Fraction */}
                          <div className="flex items-center -space-x-0.5">
                            <svg
                              className="w-3.5 h-3.5 -rotate-90 flex-shrink-0 block"
                              viewBox="0 0 16 16"
                            >
                              <circle
                                cx="8"
                                cy="8"
                                r="6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-muted/60"
                              />
                            </svg>
                            <span className="text-[11px] tabular-nums text-muted-foreground/80 font-medium text-right min-w-[2.25rem]">
                              {module.progress}
                            </span>
                          </div>

                          {/* Chevron */}
                          <ChevronDown
                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Lesson Items */}
                      {isExpanded && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-border/30 pl-4 py-1">
                          {module.items.map(
                            (lesson: CourseLesson, itemIdx: number) => {
                              if (lesson.isLabel) {
                                return (
                                  <div
                                    key={`label-${itemIdx}`}
                                    className="pt-2.5 pb-1 first:pt-1 flex items-center gap-2"
                                  >
                                    <span
                                      className="text-xs sm:text-[13px] font-semibold capitalize tracking-wide"
                                      style={{ color: "#10b981" }}
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>
                                );
                              }

                              const isActive = lesson.slug === currentSlug;
                              const prevLesson = module.items[itemIdx - 1];
                              const showSubsection =
                                lesson.subsection &&
                                (!prevLesson ||
                                  prevLesson.subsection !== lesson.subsection);

                              return (
                                <React.Fragment
                                  key={lesson.slug || `lesson-${itemIdx}`}
                                >
                                  {showSubsection && (
                                    <div className="pt-2.5 pb-1 first:pt-1 flex items-center gap-2">
                                      <span
                                        className="text-xs sm:text-[13px] font-semibold capitalize tracking-wide"
                                        style={{ color: "#10b981" }}
                                      >
                                        {lesson.subsection}
                                      </span>
                                    </div>
                                  )}

                                  <Link
                                    href={lesson.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`group/chapter relative flex items-center gap-2.5 px-2 py-2 rounded-md text-[13px] transition-all duration-200 ${
                                      isActive
                                        ? "bg-red-500/[0.08] text-cyan-400 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:translate-x-0.5"
                                    }`}
                                  >
                                    {isActive && (
                                      <span
                                        aria-hidden="true"
                                        className="absolute left-0 top-1 bottom-1 rounded-r-full bg-red-500 transition-[width,opacity] duration-200 w-[3px] opacity-100"
                                      />
                                    )}
                                    <div
                                      className={`relative flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                        isActive ? "bg-red-500/10" : ""
                                      }`}
                                    >
                                      {renderLessonIcon(lesson, isActive)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <span
                                          className={`leading-snug break-words whitespace-normal truncate ${
                                            isActive
                                              ? "font-semibold text-cyan-400"
                                              : "font-medium text-muted-foreground group-hover/chapter:text-foreground"
                                          }`}
                                        >
                                          {lesson.title}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                </React.Fragment>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
