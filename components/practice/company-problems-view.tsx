'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Building2,
  Search,
  Check,
  FileCode2,
  PlayCircle,
  FilePenLine,
  Star,
  Tag,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  ExternalLink,
  ChevronDown,
  Flame,
  TrendingUp,
} from 'lucide-react';
import Popover from '@/components/smoothui/popover';
import { motion } from 'motion/react';
import { AnimatePagination } from '@/components/animate-ui/pagination';
import { TooltipProvider, SimpleTooltip } from '@/components/animate-ui/tooltip';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { loadTopicListState, recordTopicActivity, setTopicFavorite } from '@/lib/topic-list-client';
import { saveLearningProgress } from '@/lib/learning-progress-client';
import {
  COMPANIES,
  CompanyInfo,
  CompanyProblem,
  getCompanyBySlug,
  getCompanyProblems,
} from '@/lib/company-problems-data';

interface CompanyProblemsViewProps {
  currentCompanySlug: string;
  initialProblems?: CompanyProblem[];
}

export function CompanyProblemsView({
  currentCompanySlug,
  initialProblems,
}: CompanyProblemsViewProps) {
  const { isSignedIn } = useUser();
  // Find active company
  const activeCompany: CompanyInfo = useMemo(() => {
    return getCompanyBySlug(currentCompanySlug) || COMPANIES[0];
  }, [currentCompanySlug]);

  // Problems for active company (from server props or fallback)
  const allProblems = useMemo(() => {
    if (initialProblems && initialProblems.length > 0) {
      return initialProblems;
    }
    return getCompanyProblems(activeCompany.slug);
  }, [initialProblems, activeCompany.slug]);

  // Search states
  const [companySearch, setCompanySearch] = useState('');
  const [problemSearch, setProblemSearch] = useState('');

  // Toggles & Filters (persisted across refresh)
  const [showTopics, setShowTopics] = usePersistedState<boolean>('company_problems_show_topics', false);
  const [selectedDifficulty, setSelectedDifficulty] = usePersistedState<'All' | 'Easy' | 'Medium' | 'Hard'>('company_problems_selected_difficulty', 'All');
  const [selectedStatus, setSelectedStatus] = usePersistedState<'All' | 'Solved' | 'Unsolved'>('company_problems_selected_status', 'All');
  const [selectedTopic, setSelectedTopic] = usePersistedState<string | null>('company_problems_selected_topic', null);
  const [showFilterDropdown, setShowFilterDropdown] = usePersistedState<boolean>('company_problems_filter_dropdown_open', false);
  const filterDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showFilterDropdown, setShowFilterDropdown]);

  // Animate UI Pagination: 70 problems per page
  const PROBLEMS_PER_PAGE = 70;
  const [currentPage, setCurrentPage] = useState(1);
  const tableTopRef = React.useRef<HTMLDivElement>(null);

  // Sorting (persisted across refresh)
  const [sortField, setSortField] = usePersistedState<'difficulty' | 'frequency' | null>('company_problems_sort_field', null);
  const [sortDirection, setSortDirection] = usePersistedState<'asc' | 'desc'>('company_problems_sort_direction', 'desc');

  // Persistence (LocalStorage)
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
  const [starredMap, setStarredMap] = useState<Record<string, boolean>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});

  // Active Modals
  const [activeSolutionProblem, setActiveSolutionProblem] = useState<CompanyProblem | null>(null);
  const [activeNoteProblem, setActiveNoteProblem] = useState<CompanyProblem | null>(null);
  const [activeVideoProblem, setActiveVideoProblem] = useState<CompanyProblem | null>(null);
  const [currentNoteText, setCurrentNoteText] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('company_problems_completed');
      if (savedCompleted) setCompletedMap(JSON.parse(savedCompleted));
      const savedStarred = localStorage.getItem('company_problems_starred');
      if (savedStarred) setStarredMap(JSON.parse(savedStarred));
      const savedNotes = localStorage.getItem('company_problems_notes');
      if (savedNotes) setNotesMap(JSON.parse(savedNotes));
    } catch {}
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;
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
    return () => { cancelled = true; };
  }, [isSignedIn]);

  // Reset pagination to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [problemSearch, selectedDifficulty, selectedStatus, selectedTopic, activeCompany.slug]);

  const toggleCompleted = (id: string) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      void saveLearningProgress([{ key: `problem:${id}`, status: next[id] ? 'completed' : 'not_started' }]);
      void recordTopicActivity('problem_solved', id, next[id]);
      try {
        localStorage.setItem('company_problems_completed', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleStarred = (id: string) => {
    setStarredMap((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      void setTopicFavorite('problem', id, next[id]);
      try {
        localStorage.setItem('company_problems_starred', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleOpenNote = (problem: CompanyProblem) => {
    setActiveNoteProblem(problem);
    setCurrentNoteText(notesMap[problem.id] || '');
    setNoteError(null);
    if (!isSignedIn) return;
    void fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(response.status === 401 ? 'Sign in to load saved notes.' : 'Could not load saved notes.');
        const data = await response.json() as { content?: string };
        setNotesMap((current) => ({ ...current, [problem.id]: data.content ?? '' }));
        setCurrentNoteText(data.content ?? '');
      })
      .catch((error) => setNoteError(error instanceof Error ? error.message : 'Could not load saved notes.'));
  };

  const handleSaveNote = async () => {
    if (!activeNoteProblem || noteSaving) return;
    setNoteSaving(true);
    setNoteError(null);
    try {
      if (isSignedIn) {
        const response = await fetch(`/api/practice/${encodeURIComponent(activeNoteProblem.id)}/notes`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ content: currentNoteText }),
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(data.error || 'Could not save note.');
        }
      }
      const next = { ...notesMap, [activeNoteProblem.id]: currentNoteText };
      setNotesMap(next);
      try {
        localStorage.setItem('company_problems_notes', JSON.stringify(next));
      } catch {}
      setActiveNoteProblem(null);
    } catch (error) {
      setNoteError(error instanceof Error ? error.message : 'Could not save note.');
    } finally {
      setNoteSaving(false);
    }
  };

  // Filter companies list
  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) return COMPANIES;
    const q = companySearch.toLowerCase();
    return COMPANIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [companySearch]);

  // Filter and sort problems
  const displayedProblems = useMemo(() => {
    let list = allProblems.filter((p) => {
      const q = problemSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.leetcodeId && p.leetcodeId.toString().includes(q)) ||
        p.topics.some((t) => t.toLowerCase().includes(q));

      const matchDiff =
        selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

      const isSolved = !!completedMap[p.id];
      const matchStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Solved' && isSolved) ||
        (selectedStatus === 'Unsolved' && !isSolved);

      const matchTopic =
        !selectedTopic || p.topics.includes(selectedTopic);

      return matchSearch && matchDiff && matchStatus && matchTopic;
    });

    if (sortField) {
      list.sort((a, b) => {
        let comparison = 0;
        if (sortField === 'difficulty') {
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          comparison = order[a.difficulty] - order[b.difficulty];
        } else if (sortField === 'frequency') {
          const aFreq = a.freqPercentage ?? a.frequency * 20;
          const bFreq = b.freqPercentage ?? b.frequency * 20;
          comparison = aFreq - bFreq;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return list;
  }, [
    allProblems,
    problemSearch,
    selectedDifficulty,
    selectedStatus,
    selectedTopic,
    completedMap,
    sortField,
    sortDirection,
  ]);

  // Compute total pages
  const totalPages = Math.max(1, Math.ceil(displayedProblems.length / PROBLEMS_PER_PAGE));

  // Slice for the 70 problems of current page
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * PROBLEMS_PER_PAGE;
    return displayedProblems.slice(startIndex, startIndex + PROBLEMS_PER_PAGE);
  }, [displayedProblems, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (tableTopRef.current) {
      const yOffset = -90;
      const element = tableTopRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Count solved
  const solvedCount = useMemo(() => {
    return allProblems.filter((p) => completedMap[p.id]).length;
  }, [allProblems, completedMap]);

  const toggleSort = (field: 'difficulty' | 'frequency') => {
    if (sortField === field) {
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <TooltipProvider delayDuration={400} disableHoverableContent>
      <div className="container mx-auto max-w-7xl py-6 px-4">
      {/* Centered Section Header above problem table */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] animate-pulse" />
          <Building2 className="w-3.5 h-3.5 text-[#FF1018]" />
          Company-Wise Preparation
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
          Company-Wise DSA Problems
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Practice problems frequently asked at top tech companies
        </p>
      </div>

      {/* 2-Column Workspace Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Column: Sticky Company Directory Sidebar */}
        <aside className="w-full md:w-56 shrink-0 md:sticky md:top-20">
          <div className="rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 bg-black flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Companies</span>
              <span className="ml-auto text-xs font-mono text-muted-foreground">
                ({filteredCompanies.length})
              </span>
            </div>

            {/* Search Input */}
            <div className="p-2.5 border-b border-white/10 bg-black">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#e83040]/50 focus:border-[#e83040]/60 transition-colors"
                />
              </div>
            </div>

            {/* Company List */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto divide-y divide-white/[0.06] bg-black scrollbar-thin">
              {filteredCompanies.map((company) => {
                const isActive = company.slug.toLowerCase() === activeCompany.slug.toLowerCase();

                return (
                  <Link
                    key={company.slug}
                    href={`/practice/company/${company.slug}`}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition-all ${
                      isActive
                        ? 'bg-[#e83040]/20 text-[#ff5466] font-semibold border-l-2 border-[#e83040] shadow-[inset_0_0_16px_rgba(232,48,64,0.15)]'
                        : 'text-foreground/85 hover:bg-white/[0.06] hover:text-white border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Exact Brand SVG from Algomaster */}
                      <div
                        className="w-4 h-4 shrink-0 flex items-center justify-center [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:shrink-0"
                        dangerouslySetInnerHTML={{ __html: company.svg }}
                      />
                      <span className="truncate">{company.name}</span>
                    </div>

                    <span className="text-xs text-muted-foreground/80 tabular-nums ml-2 font-mono">
                      {company.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Column: Problem Table Workspace */}
        <div className="flex-1 min-w-0 w-full">
          {/* Top Control Bar matching Algomaster */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 rounded-2xl border border-white/10 bg-black px-4 py-3 shadow-xl">
            {/* Active Company Brand */}
            <div className="hidden sm:flex items-center gap-2.5 mr-1 shrink-0">
              <div
                className="w-5 h-5 shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5"
                dangerouslySetInnerHTML={{ __html: activeCompany.svg }}
              />
              <span className="text-sm font-semibold leading-tight text-foreground">
                {activeCompany.name}
              </span>
            </div>

            {/* Problem Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search problems by name, number, or topic..."
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#0a0a0c] border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#e83040]/50 focus:border-[#e83040]/60 transition-colors"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Show Topics Toggle */}
              <SimpleTooltip content={showTopics ? 'Hide Topics' : 'Show Topics'}>
                <button
                  type="button"
                  onClick={() => setShowTopics(!showTopics)}
                  className={`inline-flex items-center justify-center whitespace-nowrap text-xs font-medium border rounded-xl px-3 py-2 gap-1.5 shrink-0 transition-all ${
                    showTopics
                      ? 'bg-[#e83040]/15 border-[#e83040]/50 text-[#ff5466] shadow-[0_0_12px_rgba(232,48,64,0.15)]'
                      : 'border-white/10 bg-black hover:bg-white/[0.06] text-foreground'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{showTopics ? 'Hide Topics' : 'Show Topics'}</span>
                </button>
              </SimpleTooltip>

              {/* Filters Dropdown */}
              <div className="relative" ref={filterDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-medium border border-white/10 bg-black hover:bg-white/[0.06] text-foreground h-9 px-3 gap-1.5 shrink-0 transition-all ${
                    selectedDifficulty !== 'All' || selectedStatus !== 'All' || selectedTopic
                      ? 'border-[#e83040]/60 text-[#ff5466] bg-[#e83040]/10'
                      : ''
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Filters</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-black p-4 shadow-2xl z-40 space-y-3.5 text-foreground">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Difficulty
                      </label>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                          <button
                            key={diff}
                            type="button"
                            onClick={() => setSelectedDifficulty(diff)}
                            className={`px-2 py-1 rounded text-center transition-colors ${
                              selectedDifficulty === diff
                                ? 'bg-[#e83040] text-white font-medium'
                                : 'bg-[#0a0a0c] hover:bg-white/[0.06] text-foreground border border-white/10'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        Status
                      </label>
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        {(['All', 'Solved', 'Unsolved'] as const).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setSelectedStatus(status)}
                            className={`px-2 py-1 rounded text-center transition-colors ${
                              selectedStatus === status
                                ? 'bg-[#e83040] text-white font-medium'
                                : 'bg-[#0a0a0c] hover:bg-white/[0.06] text-foreground border border-white/10'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedTopic && (
                      <div className="pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setSelectedTopic(null)}
                          className="w-full text-left text-xs text-[#e83040] hover:underline"
                        >
                          Clear topic filter ({selectedTopic})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Problem Count & Solved Fraction */}
              <SimpleTooltip content={`${solvedCount} solved / ${allProblems.length} total problems`}>
                <div className="inline-flex flex-col items-center justify-center font-mono border border-white/10 bg-black text-foreground h-9 rounded-xl px-2.5 min-w-[46px] shrink-0 select-none cursor-default">
                  <span className="text-[11px] font-bold text-white leading-none">
                    {solvedCount}
                  </span>
                  <div className="w-full h-px bg-white/20 my-[2px]" />
                  <span className="text-[10px] font-medium text-zinc-400 leading-none">
                    {allProblems.length}
                  </span>
                </div>
              </SimpleTooltip>
            </div>
          </div>

          {/* Active Topic Filter Badge if any */}
          {selectedTopic && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-muted-foreground/80">Filtered by topic:</span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-[#e83040]/15 text-[#ff5466] border border-[#e83040]/30 font-medium">
                {selectedTopic}
                <button
                  type="button"
                  onClick={() => setSelectedTopic(null)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3 ml-1" />
                </button>
              </span>
            </div>
          )}

          {/* Table Card */}
          <div ref={tableTopRef} className="rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden p-5">
            {/* Desktop Table View */}
            <div className="hidden md:block relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b border-white/10 bg-black">
                  <tr className="border-b border-white/10 text-muted-foreground/80 text-xs uppercase font-medium tracking-wide">
                    <th className="h-10 px-4 text-left w-[50px]">Status</th>
                    <th className="h-10 px-4 text-left">Problem</th>
                    <th className="h-10 px-4 text-center w-[120px]">
                      <button
                        type="button"
                        onClick={() => toggleSort('difficulty')}
                        className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer mx-auto transition-colors"
                      >
                        Difficulty
                        {sortField === 'difficulty' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-[#e83040]" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-[#e83040]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </button>
                    </th>
                    <th className="h-10 px-4 text-center w-[120px]">
                      <button
                        type="button"
                        onClick={() => toggleSort('frequency')}
                        className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer mx-auto transition-colors"
                      >
                        Frequency
                        {sortField === 'frequency' ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3 h-3 text-[#e83040]" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-[#e83040]" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-40" />
                        )}
                      </button>
                    </th>
                    <th className="h-10 px-4 text-center w-[90px]">LeetCode</th>
                    <th className="h-10 px-4 text-center w-[100px]">Solution</th>
                    <th className="h-10 px-4 text-center w-[100px]">Actions</th>
                  </tr>
                </thead>
                <motion.tbody
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="divide-y divide-white/[0.06] bg-black"
                >
                  {displayedProblems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                        No problems match your current search and filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedProblems.map((problem) => {
                      const isCompleted = !!completedMap[problem.id];
                      const isStarred = !!starredMap[problem.id];
                      const hasNote = !!notesMap[problem.id];

                      return (
                        <tr
                          key={problem.id}
                          className="transition-colors hover:bg-white/[0.035] group"
                        >
                          {/* Status Checkbox */}
                          <td className="p-4 align-middle">
                            <SimpleTooltip content={isCompleted ? 'Completed! Click to unmark' : 'Mark as completed'}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCompleted(problem.id);
                                }}
                                aria-label={isCompleted ? 'Completed! Click to unmark' : 'Mark as completed'}
                                className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-all duration-75 border ${
                                  isCompleted
                                    ? 'border-[#10b981] bg-[#10b981] text-black shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                                    : 'border-white/25 hover:border-emerald-400/80 bg-zinc-900/60 text-transparent'
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 stroke-[3.5] stroke-black text-black transition-none ${
                                    isCompleted ? 'opacity-100' : 'opacity-0'
                                  }`}
                                />
                              </button>
                            </SimpleTooltip>
                          </td>

                          {/* Problem Title & Topics */}
                          <td className="p-4 align-middle">
                            <div>
                              <div className="flex items-center gap-2">
                                <a
                                  href={problem.leetcodeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-[#f4f3fc] hover:text-[#ff5466] transition-colors font-medium text-sm md:text-base ${
                                    isCompleted ? 'line-through opacity-60' : ''
                                  }`}
                                >
                                  {problem.title}
                                </a>
                              </div>

                              {/* Topic Badges matching Algomaster (Clickable to filter!) */}
                              {showTopics && problem.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {problem.topics.map((t) => (
                                    <SimpleTooltip key={t} content={`Filter by ${t}`}>
                                      <button
                                        type="button"
                                        onClick={() => setSelectedTopic(t === selectedTopic ? null : t)}
                                        className={`border text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                                          selectedTopic === t
                                            ? 'border-[#e83040] bg-[#e83040]/15 text-[#e83040]'
                                            : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500/60'
                                        }`}
                                      >
                                        {t}
                                      </button>
                                    </SimpleTooltip>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Difficulty */}
                          <td className="p-4 align-middle text-center">
                            <span
                              className={`font-semibold text-sm ${
                                problem.difficulty === 'Easy'
                                  ? 'text-teal-400 dark:text-emerald-400'
                                  : problem.difficulty === 'Medium'
                                  ? 'text-amber-400'
                                  : 'text-rose-500'
                              }`}
                            >
                              {problem.difficulty}
                            </span>
                          </td>

                          {/* Frequency 5-Bar Pill Indicator with Smooth UI Popover Graph */}
                          <td className="p-4 align-middle text-center">
                            <div className="flex justify-center">
                              <FrequencyGraphPopover
                                problem={problem}
                                companyName={activeCompany.name}
                              />
                            </div>
                          </td>

                          {/* LeetCode Icon */}
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

                          {/* Solution & Video Icons */}
                          <td className="p-4 align-middle text-center">
                            <div className="flex items-center justify-center gap-1">
                              <SimpleTooltip content="View Solution">
                                <button
                                  type="button"
                                  onClick={() => setActiveSolutionProblem(problem)}
                                  className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-black hover:bg-accent transition-colors"
                                >
                                  <FileCode2 className="w-4 h-4" />
                                </button>
                              </SimpleTooltip>
                              <SimpleTooltip content="Watch Video">
                                <button
                                  type="button"
                                  onClick={() => setActiveVideoProblem(problem)}
                                  className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-black hover:bg-accent transition-colors"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                </button>
                              </SimpleTooltip>
                            </div>
                          </td>

                          {/* Actions (Notes & Star) */}
                          <td className="p-4 align-middle text-center">
                            <div className="flex items-center justify-center gap-1">
                              <SimpleTooltip content="Edit Note">
                                <button
                                  type="button"
                                  onClick={() => handleOpenNote(problem)}
                                  className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                    hasNote
                                      ? 'text-[#e83040] hover:bg-accent hover:text-black'
                                      : 'text-muted-foreground hover:text-black hover:bg-accent'
                                  }`}
                                >
                                  <FilePenLine className="w-4 h-4" />
                                </button>
                              </SimpleTooltip>
                              <SimpleTooltip content={isStarred ? 'Unstar' : 'Star problem'}>
                                <button
                                  type="button"
                                  onClick={() => toggleStarred(problem.id)}
                                  className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                                    isStarred
                                      ? 'text-amber-400 hover:text-black hover:bg-accent'
                                      : 'text-muted-foreground hover:text-black hover:bg-accent'
                                  }`}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      isStarred ? 'fill-amber-400 text-amber-400' : ''
                                    }`}
                                  />
                                </button>
                              </SimpleTooltip>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </motion.tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <motion.div
              key={currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="md:hidden space-y-3"
            >
              {paginatedProblems.map((problem) => {
                const isCompleted = !!completedMap[problem.id];
                const isStarred = !!starredMap[problem.id];

                return (
                  <div
                    key={problem.id}
                    className="border border-white/10 rounded-xl p-3.5 bg-black hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <SimpleTooltip content={isCompleted ? 'Completed! Click to unmark' : 'Mark as completed'}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCompleted(problem.id);
                          }}
                          aria-label={isCompleted ? 'Completed! Click to unmark' : 'Mark as completed'}
                          className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 cursor-pointer active:scale-90 transition-all duration-75 border ${
                            isCompleted
                              ? 'border-[#10b981] bg-[#10b981] text-black shadow-[0_0_8px_rgba(16,185,129,0.35)]'
                              : 'border-white/25 hover:border-emerald-400/80 bg-zinc-900/60 text-transparent'
                          }`}
                        >
                          <Check
                            className={`w-3.5 h-3.5 stroke-[3.5] stroke-black text-black transition-none ${
                              isCompleted ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </button>
                      </SimpleTooltip>

                      <div className="flex items-center gap-1.5 truncate flex-1">
                        <a
                          href={problem.leetcodeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-[#f4f3fc] hover:text-[#ff5466] text-sm font-medium truncate transition-colors ${
                            isCompleted ? 'line-through opacity-60' : ''
                          }`}
                        >
                          {problem.title}
                        </a>
                      </div>

                      <span
                        className={`text-xs font-semibold shrink-0 ${
                          problem.difficulty === 'Easy'
                            ? 'text-emerald-400'
                            : problem.difficulty === 'Medium'
                            ? 'text-amber-400'
                            : 'text-rose-500'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {showTopics && problem.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {problem.topics.map((t) => (
                          <span
                            key={t}
                            className="border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-medium px-1.5 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground/80 pt-2 border-t border-white/[0.06]">
                      <FrequencyGraphPopover
                        problem={problem}
                        companyName={activeCompany.name}
                      />

                      <div className="flex items-center gap-2">
                        <SimpleTooltip content="View Solution">
                          <button
                            type="button"
                            onClick={() => setActiveSolutionProblem(problem)}
                            className="hover:text-blue-400"
                          >
                            <FileCode2 className="w-4 h-4" />
                          </button>
                        </SimpleTooltip>
                        <SimpleTooltip content="Edit Note">
                          <button
                            type="button"
                            onClick={() => handleOpenNote(problem)}
                            className="hover:text-foreground"
                          >
                            <FilePenLine className="w-4 h-4" />
                          </button>
                        </SimpleTooltip>
                        <SimpleTooltip content={isStarred ? 'Unstar' : 'Star problem'}>
                          <button
                            type="button"
                            onClick={() => toggleStarred(problem.id)}
                            className={isStarred ? 'text-amber-400' : 'hover:text-amber-400'}
                          >
                            <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400' : ''}`} />
                          </button>
                        </SimpleTooltip>
                      </div>
                    </div>
                  </div>
                );
              })}

            </motion.div>

            {/* Animate UI Pagination Component */}
            <AnimatePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={displayedProblems.length}
              pageSize={PROBLEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Solution Modal */}
      {activeSolutionProblem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => setActiveSolutionProblem(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Solution: {activeSolutionProblem.leetcodeId ? `#${activeSolutionProblem.leetcodeId} ` : ''}
              {activeSolutionProblem.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {activeSolutionProblem.difficulty} &bull; Topics: {activeSolutionProblem.topics.join(', ')}
            </p>
            <div className="bg-black/40 border border-white/[0.08] rounded-xl p-4 font-mono text-xs text-foreground/90 overflow-x-auto max-h-60 mb-4">
              <p className="text-emerald-400">{'// Optimal approach'}</p>
              <p>Time Complexity: O(N) or O(N log N)</p>
              <p>Space Complexity: O(1) or O(N)</p>
              <p className="mt-2 text-slate-400">
                Full editorial and interactive compiler available on Mindflare Arena.
              </p>
            </div>
            <div className="flex justify-between items-center">
              <a
                href={activeSolutionProblem.leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Discuss on LeetCode <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setActiveSolutionProblem(null)}
                className="px-4 py-1.5 rounded-xl bg-[#e83040] hover:bg-[#e83040]/90 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {activeNoteProblem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95">
            <button
              onClick={() => setActiveNoteProblem(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Notes: {activeNoteProblem.leetcodeId ? `#${activeNoteProblem.leetcodeId} ` : ''}
              {activeNoteProblem.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {isSignedIn ? 'Notes sync to your account.' : 'Notes are saved on this device. Sign in to sync them across devices.'} Write down your insights, edge cases, and time/space complexity.
            </p>
            <textarea
              rows={6}
              value={currentNoteText}
              onChange={(e) => setCurrentNoteText(e.target.value)}
              placeholder="e.g. Remember to handle negative numbers and 0 target..."
              className="w-full p-3 bg-black/30 border border-white/[0.08] rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#e83040]/50 focus:border-[#e83040]/60 mb-4 transition-colors"
            />
            {noteError && <p role="alert" className="mb-3 text-xs text-rose-300">{noteError}</p>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveNoteProblem(null)}
                className="px-4 py-1.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.05] text-foreground text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={noteSaving}
                className="px-4 py-1.5 rounded-xl bg-[#e83040] hover:bg-[#e83040]/90 text-white text-xs font-medium transition-colors"
              >
                {noteSaving ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideoProblem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-black border border-white/10 rounded-2xl max-md w-full p-6 shadow-2xl relative animate-in fade-in-50 zoom-in-95 text-center">
            <button
              onClick={() => setActiveVideoProblem(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-full bg-[#e83040]/10 text-[#e83040] mx-auto flex items-center justify-center mb-3">
              <PlayCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">
              Video Walkthrough: {activeVideoProblem.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Interactive video solutions and walkthroughs are available on Mindflare Arena.
            </p>
            <button
              onClick={() => setActiveVideoProblem(null)}
              className="px-5 py-2 rounded-xl bg-[#e83040] hover:bg-[#e83040]/90 text-white text-xs font-medium transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
}

/**
 * Frequency Breakdown Popover powered by Smooth UI Popover
 * Displays exact percentage score, 4-timeframe bar trend chart, and acceptance rate
 */
function FrequencyGraphPopover({
  problem,
  companyName,
}: {
  problem: CompanyProblem;
  companyName: string;
}) {
  const tf = problem.timeframes || {
    thirtyDays: 0,
    threeMonths: 0,
    sixMonths: 0,
    allTime: problem.freqPercentage || 50,
  };

  const maxVal = Math.max(tf.thirtyDays, tf.threeMonths, tf.sixMonths, tf.allTime, 10);

  return (
    <Popover
      side="left"
      align="center"
      className="w-72 p-4 bg-black border border-white/10 shadow-2xl rounded-2xl z-50 text-foreground"
      trigger={
        <button
          type="button"
          className="flex items-center gap-[2px] p-1 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer group/freq"
          aria-label="Interview frequency breakdown"
        >
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={`h-[10px] w-[6px] rounded-[2px] transition-all group-hover/freq:scale-105 ${
                bar <= problem.frequency
                  ? 'bg-orange-400 group-hover/freq:bg-orange-300'
                  : 'bg-white/[0.08]'
              }`}
            />
          ))}
        </button>
      }
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              {companyName} Recency
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
              {problem.freqPercentage ?? 50}% Freq
            </span>
          </div>
          <h4 className="text-sm font-semibold text-foreground truncate mt-1">
            {problem.leetcodeId ? `#${problem.leetcodeId} ` : ''}
            {problem.title}
          </h4>
        </div>

        {/* Mini Frequency Bar Graph */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-orange-400" /> Interview Frequency
            </span>
            <span className="text-[10px] font-mono">Score %</span>
          </div>
          <div className="grid grid-cols-4 gap-2 items-end h-20 pt-3 px-2 bg-black/30 rounded-xl border border-white/[0.08]">
            {/* 30 Days Bar */}
            <div className="flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                {tf.thirtyDays > 0 ? `${tf.thirtyDays}%` : '-'}
              </span>
              <div
                className="w-full max-w-[24px] rounded-t-sm bg-gradient-to-t from-orange-500 to-[#e83040] transition-all duration-300"
                style={{
                  height: `${tf.thirtyDays > 0 ? Math.max((tf.thirtyDays / maxVal) * 100, 12) : 4}%`,
                  opacity: tf.thirtyDays > 0 ? 1 : 0.25,
                }}
              />
              <span className="text-[10px] font-medium text-foreground">30d</span>
            </div>

            {/* 3 Months Bar */}
            <div className="flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                {tf.threeMonths > 0 ? `${tf.threeMonths}%` : '-'}
              </span>
              <div
                className="w-full max-w-[24px] rounded-t-sm bg-gradient-to-t from-orange-500 to-[#e83040] transition-all duration-300"
                style={{
                  height: `${tf.threeMonths > 0 ? Math.max((tf.threeMonths / maxVal) * 100, 12) : 4}%`,
                  opacity: tf.threeMonths > 0 ? 1 : 0.25,
                }}
              />
              <span className="text-[10px] font-medium text-foreground">3m</span>
            </div>

            {/* 6 Months Bar */}
            <div className="flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                {tf.sixMonths > 0 ? `${tf.sixMonths}%` : '-'}
              </span>
              <div
                className="w-full max-w-[24px] rounded-t-sm bg-gradient-to-t from-orange-500 to-[#e83040] transition-all duration-300"
                style={{
                  height: `${tf.sixMonths > 0 ? Math.max((tf.sixMonths / maxVal) * 100, 12) : 4}%`,
                  opacity: tf.sixMonths > 0 ? 1 : 0.25,
                }}
              />
              <span className="text-[10px] font-medium text-foreground">6m</span>
            </div>

            {/* All Time Bar */}
            <div className="flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">
                {tf.allTime > 0 ? `${tf.allTime}%` : '-'}
              </span>
              <div
                className="w-full max-w-[24px] rounded-t-sm bg-gradient-to-t from-amber-500 to-orange-400 transition-all duration-300"
                style={{
                  height: `${tf.allTime > 0 ? Math.max((tf.allTime / maxVal) * 100, 12) : 4}%`,
                  opacity: tf.allTime > 0 ? 1 : 0.25,
                }}
              />
              <span className="text-[10px] font-medium text-foreground">All</span>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.08]">
          <span className="text-muted-foreground">Acceptance Rate</span>
          <span className="font-mono font-medium text-foreground">
            {problem.acceptanceRate || '52.4%'}
          </span>
        </div>

        {/* Recency Badge */}
        {tf.thirtyDays > 0 ? (
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
            <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Asked in {companyName} in the last 30 days</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
            <span>📌 High-frequency core question</span>
          </div>
        )}
      </div>
    </Popover>
  );
}
