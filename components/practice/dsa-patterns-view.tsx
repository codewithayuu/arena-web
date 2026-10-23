'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  RotateCcw,
  Shuffle,
  ExternalLink,
  Check,
  FileCode2,
  PlayCircle,
  FileEdit,
  Star,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import { PracticeSidebar } from './practice-sidebar';
import { DSA_PATTERNS, PatternCategory, PatternProblem } from '@/lib/dsa-patterns-dataset';
import { TooltipProvider, SimpleTooltip } from '@/components/animate-ui/tooltip';
import Select from '@/components/smoothui/select';
import { loadTopicListState, recordTopicActivity, setTopicFavorite } from '@/lib/topic-list-client';
import { saveLearningProgress } from '@/lib/learning-progress-client';

type TabId = 'am_600' | 'am_300' | 'am_150' | 'am_75';

interface RoadmapTab {
  id: TabId;
  emoji: string;
  label: string;
  mobileLabel: string;
  duration: string;
  total: number;
  badge?: string;
}

const ROADMAP_TABS: RoadmapTab[] = [
  {
    id: 'am_600',
    emoji: '🎓',
    label: 'Mindflare 600',
    mobileLabel: '600',
    duration: '6+ Months',
    total: 600,
    badge: 'New',
  },
  {
    id: 'am_300',
    emoji: '🏆',
    label: 'Mindflare 300',
    mobileLabel: '300',
    duration: '3+ Months',
    total: 300,
  },
  {
    id: 'am_150',
    emoji: '💪',
    label: 'Mindflare 150',
    mobileLabel: '150',
    duration: '1-3 Months',
    total: 150,
  },
  {
    id: 'am_75',
    emoji: '⚡',
    label: 'Mindflare 75',
    mobileLabel: '75',
    duration: '<1 Month',
    total: 75,
  },
];

export function DsaPatternsView() {
  const [activeTab, setActiveTab] = useState<TabId>('am_300');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Medium' | 'Hard'>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<'all' | 'high'>('all');
  const [starredOnly, setStarredOnly] = useState(false);
  const [sortOption, setSortOption] = useState<'default' | 'difficulty' | 'frequency'>('default');
  const [hideSolved, setHideSolved] = useState(false);
  const [showFiltersPopover, setShowFiltersPopover] = useState(false);
  const [showSortPopover, setShowSortPopover] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [highlightedProblemId, setHighlightedProblemId] = useState<string | null>(null);

  const filtersPopoverRef = useRef<HTMLDivElement>(null);
  const sortPopoverRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedTab = localStorage.getItem('dsa_patterns_active_tab') as TabId;
      if (savedTab && ['am_600', 'am_300', 'am_150', 'am_75'].includes(savedTab)) {
        setActiveTab(savedTab);
      }
      const savedCompleted = localStorage.getItem('dsa_patterns_completed');
      if (savedCompleted) setCompletedMap(JSON.parse(savedCompleted));
      const savedStarred = localStorage.getItem('dsa_patterns_starred');
      if (savedStarred) setStarredMap(JSON.parse(savedStarred));
      const savedCollapsed = localStorage.getItem('dsa_patterns_collapsed');
      if (savedCollapsed) setCollapsedCategories(JSON.parse(savedCollapsed));
    } catch { }

    let cancelled = false;
    void loadTopicListState().then((accountState) => {
      if (!accountState || cancelled) return;
      setCompletedMap(Object.fromEntries(accountState.progress
        .filter((item) => item.item_key.startsWith('problem:'))
        .map((item) => [item.item_key.slice('problem:'.length), item.status === 'completed'])));
      setStarredMap(Object.fromEntries(accountState.favorites
        .filter((item) => item.item_type === 'problem')
        .map((item) => [item.item_key, true])));
    });

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('[role="listbox"]') ||
        target?.closest('[role="option"]') ||
        target?.closest('[data-smoothui-select-portal]')
      ) {
        return;
      }
      if (filtersPopoverRef.current && !filtersPopoverRef.current.contains(e.target as Node)) {
        setShowFiltersPopover(false);
      }
      if (sortPopoverRef.current && !sortPopoverRef.current.contains(e.target as Node)) {
        setShowSortPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    try {
      localStorage.setItem('dsa_patterns_active_tab', tabId);
    } catch { }
  };

  const toggleCompleted = (id: string) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      void saveLearningProgress([{ key: `problem:${id}`, status: next[id] ? 'completed' : 'not_started' }]);
      void recordTopicActivity('problem_solved', id, next[id]);
      try {
        localStorage.setItem('dsa_patterns_completed', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const toggleStarred = (id: string) => {
    setStarredMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      void setTopicFavorite('problem', id, next[id]);
      try {
        localStorage.setItem('dsa_patterns_starred', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const toggleCategory = (slug: string) => {
    setCollapsedCategories((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem('dsa_patterns_collapsed', JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const toggleExpandAll = () => {
    const anyOpen = DSA_PATTERNS.some((cat) => !collapsedCategories[cat.slug]);
    const nextState: Record<string, boolean> = {};
    DSA_PATTERNS.forEach((cat) => {
      nextState[cat.slug] = anyOpen;
    });
    setCollapsedCategories(nextState);
    try {
      localStorage.setItem('dsa_patterns_collapsed', JSON.stringify(nextState));
    } catch { }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDifficultyFilter('all');
    setFrequencyFilter('all');
    setStarredOnly(false);
    setSortOption('default');
    setHideSolved(false);
  };

  // Filter problems for active tab and active filters
  const currentTabInfo = ROADMAP_TABS.find((t) => t.id === activeTab) || ROADMAP_TABS[1];

  // Base list of all problems in current tab
  const allProblemsInTab = useMemo(() => {
    const problems: PatternProblem[] = [];
    DSA_PATTERNS.forEach((cat) => {
      cat.problems.forEach((p) => {
        if (p.lists.includes(activeTab)) {
          problems.push(p);
        }
      });
    });
    return problems;
  }, [activeTab]);

  // Overall statistics for active tab
  const totalInTab = allProblemsInTab.length;
  const completedInTab = allProblemsInTab.filter((p) => completedMap[p.id]).length;
  const progressPercent = totalInTab > 0 ? Math.round((completedInTab / totalInTab) * 100) : 0;

  const easyProblems = allProblemsInTab.filter((p) => p.difficulty === 'Easy');
  const easySolved = easyProblems.filter((p) => completedMap[p.id]).length;
  const easyPercent = easyProblems.length > 0 ? Math.round((easySolved / easyProblems.length) * 100) : 0;

  const medProblems = allProblemsInTab.filter((p) => p.difficulty === 'Medium');
  const medSolved = medProblems.filter((p) => completedMap[p.id]).length;
  const medPercent = medProblems.length > 0 ? Math.round((medSolved / medProblems.length) * 100) : 0;

  const hardProblems = allProblemsInTab.filter((p) => p.difficulty === 'Hard');
  const hardSolved = hardProblems.filter((p) => completedMap[p.id]).length;
  const hardPercent = hardProblems.length > 0 ? Math.round((hardSolved / hardProblems.length) * 100) : 0;

  // Filtered categories and problems
  const filteredCategories = useMemo(() => {
    return DSA_PATTERNS.map((cat) => {
      // Filter problems belonging to active tab first
      let problems = cat.problems.filter((p) => p.lists.includes(activeTab));

      // Apply Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        problems = problems.filter((p) => p.title.toLowerCase().includes(q));
      }

      // Apply Status filter or hide solved toggle
      if (hideSolved || statusFilter === 'unsolved') {
        problems = problems.filter((p) => !completedMap[p.id]);
      } else if (statusFilter === 'solved') {
        problems = problems.filter((p) => !!completedMap[p.id]);
      }

      // Apply Difficulty filter
      if (difficultyFilter !== 'all') {
        problems = problems.filter((p) => p.difficulty === difficultyFilter);
      }

      // Apply Frequency filter
      if (frequencyFilter === 'high') {
        problems = problems.filter((p) => p.frequency >= 4);
      }

      // Apply Starred filter
      if (starredOnly) {
        problems = problems.filter((p) => !!starredMap[p.id]);
      }

      // Apply Sorting
      if (sortOption === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        problems = [...problems].sort((a, b) => order[a.difficulty] - order[b.difficulty]);
      } else if (sortOption === 'frequency') {
        problems = [...problems].sort((a, b) => b.frequency - a.frequency);
      }

      return {
        ...cat,
        problems,
      };
    }).filter((cat) => cat.problems.length > 0);
  }, [
    activeTab,
    searchQuery,
    statusFilter,
    difficultyFilter,
    frequencyFilter,
    starredOnly,
    sortOption,
    hideSolved,
    completedMap,
    starredMap,
  ]);

  // All visible problems currently rendered
  const visibleProblems = useMemo(() => {
    return filteredCategories.flatMap((c) => c.problems);
  }, [filteredCategories]);

  const unsolvedInTab = allProblemsInTab.filter((p) => !completedMap[p.id]);
  const starredInTab = allProblemsInTab.filter((p) => starredMap[p.id]);

  // Pick random problem handler
  const handlePickRandom = (type: 'unsolved' | 'starred' | 'any') => {
    let pool: PatternProblem[] = [];
    if (type === 'unsolved') pool = unsolvedInTab;
    else if (type === 'starred') pool = starredInTab;
    else pool = allProblemsInTab;

    if (pool.length === 0) return;
    const randomProblem = pool[Math.floor(Math.random() * pool.length)];

    // Ensure category is uncollapsed
    const parentCategory = DSA_PATTERNS.find((cat) =>
      cat.problems.some((p) => p.id === randomProblem.id)
    );
    if (parentCategory) {
      setCollapsedCategories((prev) => ({ ...prev, [parentCategory.slug]: false }));
    }

    setHighlightedProblemId(randomProblem.id);

    // Scroll to element
    setTimeout(() => {
      const el = document.getElementById(`problem-row-${randomProblem.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);

    // Remove highlight after 4 seconds
    setTimeout(() => {
      setHighlightedProblemId(null);
    }, 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div className="flex min-h-[calc(100vh-60px)] bg-transparent text-foreground">
        {/* Left Icon Sidebar */}
        <PracticeSidebar activeTab="patterns" />

        {/* Main Content Area */}
        <main className="min-w-0 flex-1 w-full overflow-x-hidden">
          <div className="container mx-auto max-w-6xl pt-32 md:pt-28 pb-12 px-4 sm:px-6">
            {/* Centered Section Header above problem table */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] animate-pulse" />
                Algorithmic Intuition &amp; Patterns
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F4F3FC] mb-2">
                Data Structure &amp; Algorithm Patterns
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Master the core algorithmic templates tested in technical interviews. Grouped by intuition and mechanics so you recognize patterns instantly under interview pressure.
              </p>
            </div>

            {/* ========================================================= */}
            {/* 1. CURATED ROADMAP TABS (Radix Segmented Navigation)      */}
            {/* ========================================================= */}
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="items-center justify-center rounded-md bg-muted text-muted-foreground flex w-full h-auto mb-6 sm:mb-8 p-0 overflow-hidden border border-border/40"
            >
              {ROADMAP_TABS.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                return (
                  <React.Fragment key={tab.id}>
                    {idx > 0 && (
                      <div className="w-px bg-border/60 self-stretch my-2 shrink-0" />
                    )}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                      whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors
                      flex-1 relative flex flex-row items-center justify-center gap-2 min-h-[3.25rem] py-2 px-2 sm:px-3
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                      ${isActive
                          ? 'bg-background text-foreground shadow-sm border-b-2 border-primary font-semibold'
                          : 'hover:bg-muted/80 hover:text-foreground'
                        }
                    `}
                    >
                      {tab.badge && (
                        <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold leading-none px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {tab.badge}
                        </span>
                      )}
                      <span className="text-xl sm:text-2xl shrink-0">{tab.emoji}</span>
                      <span className="flex flex-col items-center">
                        <span className="md:hidden font-medium text-xs sm:text-sm text-center leading-tight">
                          {tab.mobileLabel}
                        </span>
                        <span className="hidden md:block font-medium text-sm lg:text-base text-center leading-tight">
                          {tab.label}
                        </span>
                        <span className="hidden md:block text-xs text-muted-foreground text-center mt-0.5">
                          ({tab.duration})
                        </span>
                      </span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {/* ========================================================= */}
            {/* 2. CONTROLS & PROGRESS OVERVIEW (2-Column Grid)           */}
            {/* ========================================================= */}
            <div className="flex flex-col md:flex-row items-stretch gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Left Column: Description + Search Toolbar + Random Picker */}
              <div className="flex-grow flex flex-col gap-3">
                {/* Roadmap Subtitle Description */}
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">Master DSA Patterns</span>: Practice{' '}
                  {currentTabInfo.total} curated coding interview problems organized by patterns.
                  Ideal for {currentTabInfo.duration} of preparation time.
                </p>

                {/* Toolbar Box: Search, Filters, Sort, Expand, Hide, Reset */}
                <div className="rounded-lg border border-border/60 bg-card px-4 py-3 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 w-full">
                    {/* Search Input */}
                    <div className="relative w-full sm:flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search problems..."
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                      />
                    </div>

                    {/* Filters Button & Popover */}
                    <div className="relative" ref={filtersPopoverRef}>
                      <button
                        type="button"
                        onClick={() => setShowFiltersPopover((prev) => !prev)}
                        className={`
                        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                        ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground
                        h-10 px-3.5 py-2 gap-2 shrink-0
                        ${showFiltersPopover || statusFilter !== 'all' || difficultyFilter !== 'all' || frequencyFilter !== 'all' || starredOnly ? 'border-primary text-primary' : ''}
                      `}
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                      </button>

                      {showFiltersPopover && (
                        <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-black p-4 text-foreground shadow-2xl outline-none">
                          <div className="space-y-3.5">
                            <div>
                              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Status
                              </label>
                              <Select
                                value={statusFilter}
                                onValueChange={(val) => setStatusFilter(val as any)}
                                options={[
                                  { value: "all", label: "All" },
                                  { value: "unsolved", label: "Unsolved only" },
                                  { value: "solved", label: "Solved only" },
                                ]}
                                placeholder="All"
                                size="sm"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Difficulty
                              </label>
                              <Select
                                value={difficultyFilter}
                                onValueChange={(val) => setDifficultyFilter(val as any)}
                                options={[
                                  { value: "all", label: "All Difficulties" },
                                  { value: "Easy", label: "Easy" },
                                  { value: "Medium", label: "Medium" },
                                  { value: "Hard", label: "Hard" },
                                ]}
                                placeholder="All Difficulties"
                                size="sm"
                              />
                            </div>

                            <div>
                              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                                Frequency
                              </label>
                              <Select
                                value={frequencyFilter}
                                onValueChange={(val) => setFrequencyFilter(val as any)}
                                options={[
                                  { value: "all", label: "All Frequencies" },
                                  { value: "high", label: "High Frequency (4-5)" },
                                ]}
                                placeholder="All Frequencies"
                                size="sm"
                              />
                            </div>

                            <div className="pt-1 flex items-center justify-between">
                              <span className="text-xs font-medium">Starred only</span>
                              <input
                                type="checkbox"
                                checked={starredOnly}
                                onChange={(e) => setStarredOnly(e.target.checked)}
                                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sort Button & Popover */}
                    <div className="relative" ref={sortPopoverRef}>
                      <button
                        type="button"
                        onClick={() => setShowSortPopover((prev) => !prev)}
                        className={`
                        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                        ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground
                        h-10 px-3.5 py-2 gap-2 shrink-0
                        ${sortOption !== 'default' ? 'border-primary text-primary' : ''}
                      `}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        <span>Sort</span>
                      </button>

                      {showSortPopover && (
                        <div className="absolute right-0 top-12 z-50 w-44 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-xl outline-none">
                          <button
                            type="button"
                            onClick={() => {
                              setSortOption('default');
                              setShowSortPopover(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${sortOption === 'default' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                              }`}
                          >
                            Default Order
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortOption('difficulty');
                              setShowSortPopover(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${sortOption === 'difficulty' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                              }`}
                          >
                            Sort by Difficulty
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSortOption('frequency');
                              setShowSortPopover(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${sortOption === 'frequency' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted'
                              }`}
                          >
                            Sort by Frequency
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Expand / Collapse All Toggle */}
                    <SimpleTooltip content="Expand or collapse all patterns">
                      <button
                        type="button"
                        onClick={toggleExpandAll}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 shrink-0"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                    </SimpleTooltip>

                    {/* Hide / Show Solved Toggle */}
                    <SimpleTooltip content={hideSolved ? 'Show solved problems' : 'Hide solved problems'}>
                      <button
                        type="button"
                        onClick={() => setHideSolved((prev) => !prev)}
                        className={`
                        inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
                        ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground
                        h-10 w-10 shrink-0
                        ${hideSolved ? 'border-primary text-primary' : ''}
                      `}
                      >
                        {hideSolved ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </button>
                    </SimpleTooltip>

                    {/* Reset Filters */}
                    <SimpleTooltip content="Reset all filters">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 shrink-0"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </SimpleTooltip>
                  </div>
                </div>

                {/* Random problem picker */}
                <div className="w-full flex-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border/60 bg-card px-4 py-2.5 shadow-sm">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <Shuffle className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium">Pick Random Problem:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handlePickRandom('unsolved')}
                        className="inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1 rounded border border-border/80 bg-background hover:bg-muted hover:text-foreground transition-colors"
                      >
                        Unsolved ({unsolvedInTab.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePickRandom('starred')}
                        className="inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1 rounded border border-border/80 bg-background hover:bg-muted hover:text-foreground transition-colors"
                      >
                        Starred ({starredInTab.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePickRandom('any')}
                        className="inline-flex items-center justify-center text-xs font-semibold px-2.5 py-1 rounded border border-border/80 bg-background hover:bg-muted hover:text-foreground transition-colors"
                      >
                        Any ({totalInTab})
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Progress Card */}
              <div className="w-full md:w-80 rounded-lg border border-border/60 bg-card text-card-foreground shadow-sm flex-shrink-0">
                <div className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">Progress</p>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {completedInTab} / {totalInTab} solved
                      </p>
                    </div>
                    {/* Overall progress bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden mb-4">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* 3 Difficulty breakdown bars */}
                  <div className="flex flex-col gap-2.5 justify-evenly">
                    {/* Easy */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-emerald-400">Easy</span>
                        <span className="text-muted-foreground tabular-nums">
                          {easySolved} / {easyProblems.length}{' '}
                          <span className="ml-1 text-slate-400">({easyPercent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${easyPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Medium */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-amber-400">Medium</span>
                        <span className="text-muted-foreground tabular-nums">
                          {medSolved} / {medProblems.length}{' '}
                          <span className="ml-1 text-slate-400">({medPercent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${medPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Hard */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-rose-400">Hard</span>
                        <span className="text-muted-foreground tabular-nums">
                          {hardSolved} / {hardProblems.length}{' '}
                          <span className="ml-1 text-slate-400">({hardPercent}%)</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${hardPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* 3. PATTERN ACCORDION CARDS & PROBLEM TABLES               */}
            {/* ========================================================= */}
            <div className="space-y-4">
              {filteredCategories.length === 0 ? (
                <div className="rounded-lg border border-border/60 bg-card p-12 text-center text-muted-foreground">
                  <p className="text-base font-medium mb-1">No problems match your filters</p>
                  <p className="text-xs">Try clearing your search query or resetting filters.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredCategories.map((cat) => {
                  const isCollapsed = !!collapsedCategories[cat.slug];
                  const catProblems = cat.problems;
                  const catTotal = catProblems.length;
                  const catSolved = catProblems.filter((p) => completedMap[p.id]).length;
                  const catPercent = catTotal > 0 ? (catSolved / catTotal) * 100 : 0;

                  return (
                    <div
                      key={cat.slug}
                      className="rounded-2xl border border-white/10 bg-black shadow-xl w-full overflow-hidden transition-all"
                    >
                      {/* Pattern Card Header */}
                      <div
                        onClick={() => toggleCategory(cat.slug)}
                        className="flex items-center justify-between px-5 sm:px-6 py-4 cursor-pointer hover:bg-white/[0.03] transition-colors select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground transition-transform"
                          >
                            {isCollapsed ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronUp className="w-5 h-5" />
                            )}
                          </button>
                          <h3 className="tracking-tight text-xl md:text-2xl font-bold truncate flex items-center gap-2">
                            <span>{cat.category}</span>
                            {cat.learnUrl && (
                              <SimpleTooltip content="Learn pattern concept">
                                <a
                                  href={cat.learnUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-[#ff5466] transition-colors inline-flex items-center"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </SimpleTooltip>
                            )}
                          </h3>
                        </div>

                        {/* Pattern Mini Progress Indicator */}
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs sm:text-sm font-semibold tabular-nums text-muted-foreground">
                            {catSolved} / {catTotal}
                          </span>
                          <div className="w-20 sm:w-28 bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${catPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Problems Table */}
                      {!isCollapsed && (
                        <div className="overflow-x-auto border-t border-white/10 bg-black">
                          <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b border-white/10 bg-black">
                              <tr className="border-b border-white/10 text-muted-foreground/80 text-xs uppercase font-medium tracking-wide">
                                <th className="h-10 px-4 text-center w-[60px]">Status</th>
                                <th className="h-10 px-4 text-left">Problem</th>
                                <th className="h-10 px-4 text-center w-[120px]">Difficulty</th>
                                <th className="h-10 px-4 text-center w-[120px]">Frequency</th>
                                <th className="h-10 px-4 text-center w-[90px]">LeetCode</th>
                                <th className="h-10 px-4 text-center w-[100px]">Solution</th>
                                <th className="h-10 px-4 text-center w-[100px]">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] bg-black">
                              {catProblems.map((problem) => {
                                const isDone = !!completedMap[problem.id];
                                const isStarred = !!starredMap[problem.id];
                                const isHighlighted = highlightedProblemId === problem.id;

                                return (
                                  <tr
                                    id={`problem-row-${problem.id}`}
                                    key={problem.id}
                                    className={`
                                    transition-colors hover:bg-white/[0.035] group
                                    ${isHighlighted ? 'bg-white/[0.06] ring-1 ring-[#e83040]' : ''}
                                  `}
                                  >
                                    {/* Status Checkbox */}
                                    <td className="p-4 align-middle text-center">
                                      <SimpleTooltip content={isDone ? 'Completed! Click to unmark' : 'Mark as completed'}>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCompleted(problem.id);
                                          }}
                                          aria-label={isDone ? 'Completed! Click to unmark' : 'Mark as completed'}
                                          className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-all duration-75 border mx-auto ${isDone
                                              ? 'border-[#10b981] bg-[#10b981] text-black shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                                              : 'border-white/25 hover:border-emerald-400/80 bg-zinc-900/60 text-transparent'
                                            }`}
                                        >
                                          <Check
                                            className={`w-3.5 h-3.5 stroke-[3.5] stroke-black text-black transition-none ${isDone ? 'opacity-100' : 'opacity-0'
                                              }`}
                                          />
                                        </button>
                                      </SimpleTooltip>
                                    </td>

                                    {/* Problem Title */}
                                    <td className="p-4 align-middle font-medium">
                                      <div className="flex items-center gap-2">
                                        <Link
                                          href={`/practice/dsa/${problem.slug}?list=${activeTab}`}
                                          className={`text-[#f4f3fc] hover:text-[#ff5466] transition-colors font-medium text-sm md:text-base ${isDone ? 'line-through opacity-60' : ''
                                            }`}
                                        >
                                          {problem.title}
                                        </Link>
                                      </div>
                                    </td>

                                    {/* Difficulty */}
                                    <td className="p-4 align-middle text-center">
                                      <span
                                        className={`font-semibold text-sm ${problem.difficulty === 'Easy'
                                            ? 'text-teal-400 dark:text-emerald-400'
                                            : problem.difficulty === 'Medium'
                                              ? 'text-amber-400'
                                              : 'text-rose-500'
                                          }`}
                                      >
                                        {problem.difficulty}
                                      </span>
                                    </td>

                                    {/* Frequency Indicator (5 Bars) */}
                                    <td className="p-4 align-middle text-center">
                                      <div className="flex justify-center">
                                        <SimpleTooltip content={`Frequency: ${problem.frequency}/5`}>
                                          <div className="flex items-center justify-center gap-[3px] cursor-pointer">
                                            {[1, 2, 3, 4, 5].map((bar) => (
                                              <div
                                                key={bar}
                                                className={`h-3.5 w-1.5 rounded-[2px] transition-colors ${bar <= problem.frequency
                                                    ? 'bg-amber-400'
                                                    : 'bg-white/10'
                                                  }`}
                                              />
                                            ))}
                                          </div>
                                        </SimpleTooltip>
                                      </div>
                                    </td>

                                    {/* LeetCode External Link */}
                                    <td className="p-4 align-middle text-center">
                                      <SimpleTooltip content="Open on LeetCode">
                                        <a
                                          href={problem.leetcodeUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex justify-center text-muted-foreground hover:text-orange-500 transition-colors"
                                        >
                                          <svg
                                            className="w-5 h-5 fill-current"
                                            viewBox="0 0 24 24"
                                          >
                                            <path d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z" />
                                          </svg>
                                        </a>
                                      </SimpleTooltip>
                                    </td>

                                    {/* Solution Buttons: Code & Video */}
                                    <td className="p-4 align-middle text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <SimpleTooltip content="View Solution">
                                          <Link
                                            href={`/practice/dsa/${problem.slug}?list=${activeTab}&tab=solution`}
                                            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-black hover:bg-accent transition-colors"
                                          >
                                            <FileCode2 className="w-4 h-4" />
                                          </Link>
                                        </SimpleTooltip>
                                        <SimpleTooltip content="Watch Video">
                                          <Link
                                            href={`/practice/dsa/${problem.slug}?list=${activeTab}&tab=video`}
                                            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-black hover:bg-accent transition-colors"
                                          >
                                            <PlayCircle className="w-4 h-4" />
                                          </Link>
                                        </SimpleTooltip>
                                      </div>
                                    </td>

                                    {/* Actions: Notes & Star Bookmark */}
                                    <td className="p-4 align-middle text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <SimpleTooltip content="Personal Notes">
                                          <Link
                                            href={`/practice/dsa/${problem.slug}?list=${activeTab}&tab=notes`}
                                            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-black hover:bg-accent transition-colors"
                                          >
                                            <FileEdit className="w-4 h-4" />
                                          </Link>
                                        </SimpleTooltip>
                                        <SimpleTooltip content={isStarred ? 'Unstar problem' : 'Star problem'}>
                                          <button
                                            type="button"
                                            onClick={() => toggleStarred(problem.id)}
                                            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${isStarred
                                                ? 'text-amber-400 hover:bg-accent hover:text-black'
                                                : 'text-muted-foreground hover:text-black hover:bg-accent'
                                              }`}
                                          >
                                            <Star
                                              className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`}
                                            />
                                          </button>
                                        </SimpleTooltip>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Floating Scroll to Top button */}
            {showScrollTop && (
              <SimpleTooltip content="Scroll to top" side="left">
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="fixed bottom-6 right-6 p-2.5 rounded-full bg-card border border-border text-foreground shadow-lg hover:bg-muted transition-all z-40"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </SimpleTooltip>
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
