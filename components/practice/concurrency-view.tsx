'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Tags,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { CONCURRENCY_PROBLEMS } from '@/lib/concurrency-problems';
import { PracticeSidebar } from './practice-sidebar';
import Select from '@/components/smoothui/select';

export function ConcurrencyView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [sortField, setSortField] = useState<'index' | 'title' | 'difficulty'>('index');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isCategoryCollapsed, setIsCategoryCollapsed] = useState(false);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    CONCURRENCY_PROBLEMS.forEach((p) => p.topics.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, []);

  const filteredProblems = useMemo(() => {
    let list = CONCURRENCY_PROBLEMS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDiff =
        selectedDifficulty === 'All' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      const matchTopic =
        selectedTopic === 'All' || p.topics.includes(selectedTopic);

      return matchSearch && matchDiff && matchTopic;
    });

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'index') {
        const idxA = CONCURRENCY_PROBLEMS.findIndex((p) => p.id === a.id);
        const idxB = CONCURRENCY_PROBLEMS.findIndex((p) => p.id === b.id);
        comparison = idxA - idxB;
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        comparison = order[a.difficulty] - order[b.difficulty];
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [searchQuery, selectedDifficulty, selectedTopic, sortField, sortDirection]);

  const toggleSort = (field: 'index' | 'title' | 'difficulty') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] bg-black text-[#F4F3FC]">
      <PracticeSidebar activeTab="concurrency" />

      <main className="min-w-0 flex-1 pt-32 md:pt-28 pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Centered Section Header above problem table */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018] animate-pulse" />
            Multithreading &amp; Synchronization
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
            Concurrency Practice
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Master synchronization primitives, mutexes, semaphores, barriers, and deadlock prevention. Solve classic concurrency challenges with real thread synchronization logic.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-zinc-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-white font-bold">{CONCURRENCY_PROBLEMS.length}</span> Concurrency Problems
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="text-white font-bold">{allTopics.length}</span> Primitives &amp; Topics
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              Thread-Safe Code Verification
            </span>
          </div>
        </div>

        {/* Top Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concurrency problems and topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0a0c] border border-white/10 rounded-xl text-sm text-[#F4F3FC] placeholder:text-slate-500 focus:outline-none focus:border-[#e83040]/60 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[140px] shrink-0">
              <Select
                value={selectedDifficulty}
                onValueChange={setSelectedDifficulty}
                options={[
                  { value: "All", label: "All difficulty" },
                  { value: "Easy", label: "Easy" },
                  { value: "Medium", label: "Medium" },
                  { value: "Hard", label: "Hard" },
                ]}
                placeholder="All difficulty"
                size="sm"
              />
            </div>

            <div className="w-[160px] shrink-0">
              <Select
                value={selectedTopic}
                onValueChange={setSelectedTopic}
                options={[
                  { value: "All", label: "All topics" },
                  ...allTopics.map((topic) => ({ value: topic, label: topic })),
                ]}
                placeholder="All topics"
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        {/* Table Container */}
        <div className="rounded-2xl border border-white/10 bg-black overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="[&_tr]:border-b border-white/10 bg-black">
                <tr className="border-b border-white/10 text-muted-foreground/80 text-xs uppercase font-medium tracking-wide">
                  <th
                    onClick={() => toggleSort('index')}
                    className="py-3 px-4 w-14 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>#</span>
                      {sortField === 'index' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[#ff5466]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[#ff5466]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('title')}
                    className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Problem</span>
                      {sortField === 'title' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[#ff5466]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[#ff5466]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 w-[40%]">
                    <div className="flex items-center gap-1.5">
                      <span>Topics</span>
                      <Tags className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('difficulty')}
                    className="py-3 px-4 w-28 cursor-pointer hover:text-white transition-colors text-right sm:text-left"
                  >
                    <div className="flex items-center justify-end sm:justify-start gap-1.5">
                      <span>Difficulty</span>
                      {sortField === 'difficulty' ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5 text-[#ff5466]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-[#ff5466]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] bg-black">
                <tr
                  onClick={() => setIsCategoryCollapsed(!isCategoryCollapsed)}
                  className="bg-black border-b border-white/10 cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
                >
                  <td colSpan={3} className="py-3 px-4">
                    <div className="flex items-center gap-2 font-medium text-sm text-[#F4F3FC]">
                      {isCategoryCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Thread Synchronization & Coordination</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-muted-foreground font-medium">
                    {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
                  </td>
                </tr>

                {!isCategoryCollapsed &&
                  filteredProblems.map((problem, idx) => {
                    const originalIndex =
                      CONCURRENCY_PROBLEMS.findIndex((p) => p.id === problem.id) + 1;

                    return (
                      <tr
                        key={problem.id}
                        className="transition-colors hover:bg-white/[0.035] group"
                      >
                        <td className="py-3.5 px-4 text-muted-foreground font-mono text-xs">
                          {originalIndex}
                        </td>

                        <td className="py-3.5 px-4 font-medium">
                          <Link
                            href={`/practice/dsa/${problem.slug}?list=concurrency`}
                            className="text-[#f4f3fc] hover:text-[#ff5466] hover:underline transition-colors flex items-center gap-1.5"
                          >
                            <span>{problem.title}</span>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {problem.topics.map((topic) => (
                              <button
                                key={topic}
                                type="button"
                                onClick={() => setSelectedTopic(topic)}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60 transition-colors"
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-right sm:text-left">
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
                      </tr>
                    );
                  })}

                {!isCategoryCollapsed && filteredProblems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-zinc-500">
                      No problems match your current search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
