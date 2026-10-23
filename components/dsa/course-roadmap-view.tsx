'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  List,
  Workflow,
  ChevronsUpDown,
  ChevronRight,
  FileText,
  FilePlay,
  CodeXml,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { DSA_CURRICULUM, DsaModule, DsaLesson } from '@/lib/dsa-curriculum';
import { MODULE_ICONS } from '@/lib/dsa-module-icons';
import SmoothButton from '@/components/smoothui/smooth-button';
import Badge from '@/components/smoothui/badge';

export function CourseRoadmapView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    Welcome: true,
    'Coding Interview Strategy': true,
  });

  const totalSections = DSA_CURRICULUM.length;
  const totalChapters = useMemo(
    () => DSA_CURRICULUM.reduce((acc, m) => acc + m.items.length, 0),
    []
  );

  const allExpanded = useMemo(() => {
    return DSA_CURRICULUM.every((m) => expandedModules[m.title]);
  }, [expandedModules]);

  const toggleAll = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    DSA_CURRICULUM.forEach((m) => {
      updated[m.title] = nextState;
    });
    setExpandedModules(updated);
  };

  const toggleModule = (title: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filtered curriculum based on search query
  const filteredCurriculum = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return DSA_CURRICULUM.map((module) => {
      const moduleMatch = module.title.toLowerCase().includes(q);

      const filteredItems = module.items.filter((item) => {
        return q === '' || moduleMatch || item.title.toLowerCase().includes(q);
      });

      return {
        ...module,
        items: filteredItems,
        matchesQuery: moduleMatch || filteredItems.length > 0,
      };
    }).filter((m) => q === '' || m.matchesQuery);
  }, [searchQuery]);

  return (
    <div className="my-6 rounded-xl border border-border bg-card dark:bg-background overflow-hidden shadow-sm">
      {/* Header Statistics Card */}
      <div className="border-b border-border bg-muted/40 dark:bg-muted/10 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              DSA Learning Path
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Structured sequence covering pattern recognition, algorithms, and 600+ interview questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="gap-1.5 font-semibold text-muted-foreground shadow-xs">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>{totalSections} sections</span>
            </Badge>
            <Badge variant="outline" size="sm" className="gap-1.5 font-semibold text-muted-foreground shadow-xs">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <span>{totalChapters} chapters</span>
            </Badge>
          </div>
        </div>

        {/* Course Progress Indicator */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Course Progress
            </span>
            <span className="font-mono tabular-nums font-semibold text-foreground">
              0% (0/{totalChapters} completed)
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-black via-red-500 to-black h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.35)]"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Toolbar: Search & View Toggle */}
      <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-3 sm:px-6">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chapters and sections..."
            aria-label="Search chapters and sections"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-9 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* List / Tree view toggle */}
        <div className="inline-flex flex-shrink-0 items-center rounded-md border border-border bg-background p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={`inline-flex h-7 items-center gap-1.5 rounded px-2.5 text-xs font-medium transition-colors ${
              viewMode === 'tree'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tree</span>
          </button>
        </div>
      </div>

      {/* Curriculum Summary & Expand All Button */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2.5 sm:px-6">
        <span className="text-xs font-semibold text-muted-foreground">
          Curriculum &bull; {totalChapters} Lessons
        </span>

        <SmoothButton
          type="button"
          size="xs"
          variant="ghost"
          onClick={toggleAll}
          className="gap-1.5 text-muted-foreground hover:text-foreground font-medium"
        >
          <ChevronsUpDown className="h-3.5 w-3.5" />
          <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
        </SmoothButton>
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        <div className="divide-y divide-border">
          {filteredCurriculum.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No sections or chapters match &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredCurriculum.map((module, idx) => {
              const isExpanded =
                searchQuery.trim() !== '' || !!expandedModules[module.title];
              const icon = MODULE_ICONS[module.title];

              return (
                <div key={module.title} className="group/section">
                  {/* Module Header Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleModule(module.title)}
                    className="flex w-full items-center gap-3 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/40 sm:px-5"
                  >
                    <span
                      className={`flex-shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isExpanded ? 'rotate-90 text-primary' : ''
                      }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {icon || <Layers className="h-4 w-4" />}
                    </span>

                    <span className="hidden w-6 flex-shrink-0 text-xs font-mono font-medium tabular-nums text-muted-foreground sm:inline">
                      {idx + 1}
                    </span>

                    <span className="min-w-0 flex-1 truncate font-semibold text-sm sm:text-base text-foreground">
                      {module.title}
                    </span>

                    <div className="ml-auto flex flex-shrink-0 items-center gap-2">
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {module.items.length}{' '}
                        {module.items.length === 1 ? 'lesson' : 'lessons'}
                      </span>
                    </div>
                  </button>

                  {/* Module Lessons List */}
                  {isExpanded && (
                    <div className="bg-background/50 divide-y divide-border/40 pl-6 sm:pl-12 pr-4 sm:pr-6 py-1">
                      {module.items.map((lesson) => {
                        const isCode = lesson.iconType === 'code';
                        const isVideo =
                          lesson.iconType === 'video' ||
                          lesson.title.toLowerCase().includes('video');
                        const codeColor =
                          lesson.difficulty === 'hard'
                            ? 'text-red-500'
                            : lesson.difficulty === 'medium'
                            ? 'text-orange-500'
                            : 'text-red-500';

                        return (
                          <Link
                            key={lesson.slug}
                            href={lesson.href}
                            className="group/lesson flex items-center justify-between gap-3 py-2.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {isCode ? (
                                <CodeXml
                                  className={`h-3.5 w-3.5 flex-shrink-0 ${codeColor}`}
                                />
                              ) : isVideo ? (
                                <FilePlay className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground group-hover/lesson:text-primary transition-colors" />
                              ) : lesson.iconType === 'custom' ? (
                                <CodeXml className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                              ) : (
                                <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground group-hover/lesson:text-primary transition-colors" />
                              )}
                              <span className="truncate group-hover/lesson:translate-x-0.5 transition-transform font-medium">
                                {lesson.title}
                              </span>
                            </div>
                          </Link>
                      );
                    })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* Tree View */
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-xs text-muted-foreground">
            A visual overview of the learning roadmap hierarchy from fundamentals to advanced algorithmic topics:
          </p>

          <div className="relative border-l-2 border-primary/30 pl-4 sm:pl-6 space-y-6 ml-2">
            {filteredCurriculum.map((module, mIdx) => (
              <div key={module.title} className="relative">
                <span className="absolute -left-[23px] sm:-left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20" />

                <div className="rounded-lg border border-border bg-background p-3.5 sm:p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                      <span className="text-primary font-mono text-xs">
                        Stage {mIdx + 1}:
                      </span>
                      <span>{module.title}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {module.items.length} items
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {module.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border/70 bg-muted/30 hover:bg-muted text-foreground hover:border-primary/50 transition-colors"
                      >
                        <span>{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
