'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
} from 'lucide-react';
import {
  FaGraduationCap,
  FaRoute,
  FaListAlt,
  FaUser,
  FaGift,
  FaUsers,
  FaHeart,
  FaMix,
  FaTrophy,
  FaHandsHelping,
  FaChartLine,
  FaFire,
  FaGithub,
  FaSearch,
} from 'react-icons/fa';
import { MdSkipNext } from 'react-icons/md';
import { TbCompass } from 'react-icons/tb';
import { Category, ALL_TOPICS, PROBLEMS } from '@/lib/topic-list-data';
import { TablerNumbersIcon } from './tabler-numbers';

interface TopicListSidebarProps {
  completedTopics: string[];
  favouriteTopics: string[];
  favouriteProblems: string[];
  skippedTopics: string[];
  categories?: Category[];
  activeCategoryId?: string | null;
  onSelectCategory?: (categoryId: string) => void;
  onOpenModules?: () => void;
  onOpenHeatmap?: () => void;
  onOpenAuraModal?: () => void;
  onToggleSkip?: (topicId: string) => void;
  showCategories?: boolean;
}

export function TopicListSidebar({
  completedTopics,
  favouriteTopics,
  favouriteProblems,
  skippedTopics,
  categories = [],
  activeCategoryId,
  onSelectCategory,
  onOpenModules,
  onOpenHeatmap,
  onOpenAuraModal,
  onToggleSkip,
  showCategories = false,
}: TopicListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<
    'tour' | 'info' | 'wrapped' | 'skipped' | 'favourites-topics' | 'favourites-problems' | 'code-library' | null
  >(null);
  const [tourStep, setTourStep] = useState(0);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Compute category topic counts
  const categoryTopicCounts = useMemo(() => {
    const map: Record<string, number> = {};
    categories.forEach((cat) => {
      let count = 0;
      cat.sub_categories?.forEach((sub) => {
        count += sub.topics?.length || 0;
      });
      map[cat.category_id] = count;
    });
    return map;
  }, [categories]);

  // Total topics count
  const totalTopicsCount = ALL_TOPICS.length;

  // Category Icon Resolver
  // Category navigation marker.
  const CategoryDiamondIcon = ({ className = 'w-3.5 h-3.5 shrink-0' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
    </svg>
  );

  const getCategoryIcon = (_categoryId: string) => {
    return CategoryDiamondIcon;
  };

  // Navigation actions point to implemented routes or working page features.
  const menuSections = useMemo(() => {
    return [
      {
        sectionTitle: 'Getting Started',
        items: [
          {
            id: 'tour',
            label: 'Take a Tour',
            icon: FaGraduationCap,
            badge: (
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                NEW
              </span>
            ),
            onClick: () => {
              setTourStep(0);
              setActiveModal('tour');
            },
          },
          {
            id: 'learning-path',
            label: 'Learning Path',
            icon: FaRoute,
            badge: <span className="text-xs font-semibold text-zinc-400">Curriculum</span>,
            onClick: () => {
              if (onOpenModules) onOpenModules();
            },
          },
          {
            id: 'features-info',
            label: 'Features & Info',
            icon: FaListAlt,
            badge: <span className="text-xs font-semibold text-zinc-400">Guide</span>,
            onClick: () => setActiveModal('info'),
          },
        ],
      },
      {
        sectionTitle: 'Dashboard',
        items: [
          {
            id: 'profile',
            label: 'Profile',
            icon: FaUser,
            href: '/profile',
            badge: <span className="text-xs font-semibold text-zinc-400">Account</span>,
          },
          {
            id: 'wrapped',
            label: 'Progress Summary',
            icon: FaGift,
            badge: <span className="text-xs font-semibold text-zinc-400">Progress</span>,
            onClick: () => setActiveModal('wrapped'),
          },
          {
            id: 'teams',
            label: 'Teams & Contests',
            icon: FaUsers,
            href: '/contests',
            badge: <span className="text-xs font-semibold text-zinc-400">Arena</span>,
          },
          {
            id: 'skipped',
            label: 'Skipped Items',
            icon: MdSkipNext,
            badge: (
              <span className="text-sm font-mono font-bold text-zinc-200 tabular-nums">
                {skippedTopics.length}
              </span>
            ),
            onClick: () => setActiveModal('skipped'),
          },
          {
            id: 'favourite-topics',
            label: 'Favourite Topics',
            icon: FaHeart,
            badge: (
              <span className="text-sm font-mono font-bold text-[#ff5466] tabular-nums">
                {favouriteTopics.length}
              </span>
            ),
            onClick: () => setActiveModal('favourites-topics'),
          },
          {
            id: 'favourite-problems',
            label: 'Favourite Problems',
            icon: FaHeart,
            badge: <span className="text-sm font-mono font-bold text-[#ff5466] tabular-nums">{favouriteProblems.length}</span>,
            onClick: () => setActiveModal('favourites-problems'),
          },
        ],
      },
      {
        sectionTitle: 'Practice',
        items: [
          {
            id: 'mixed-practice',
            label: 'Mixed Practice',
            icon: FaMix,
            href: '/practice',
            badge: <span className="text-xs font-semibold text-emerald-400 font-mono">Arena</span>,
          },
        ],
      },
      {
        sectionTitle: 'Community',
        items: [
          {
            id: 'leaderboard',
            label: 'Leaderboard',
            icon: FaTrophy,
            href: '/leaderboard',
            badge: <span className="text-xs font-semibold text-amber-400 font-mono">Ranks</span>,
          },
          {
            id: 'contributions',
            label: 'Contributions',
            icon: FaHandsHelping,
            badge: <span className="text-xs font-semibold text-zinc-400">OSS</span>,
            onClick: () => {
              window.open('https://github.com/codewithayuu/arena', '_blank', 'noopener,noreferrer');
            },
          },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: FaChartLine,
            badge: <span className="text-xs font-semibold text-cyan-400 font-mono">Stats</span>,
            onClick: () => {
              if (onOpenHeatmap) onOpenHeatmap();
            },
          },
          {
            id: 'trending',
            label: 'Dynamic Programming',
            icon: FaFire,
            badge: (
              <span className="text-xs font-semibold text-zinc-400">Topic</span>
            ),
            onClick: () => {
              const el = document.getElementById('dynamic_programming');
              el?.scrollIntoView({ behavior: 'smooth' });
              if (onSelectCategory) onSelectCategory('dynamic_programming');
            },
          },
        ],
      },
      {
        sectionTitle: 'More',
        items: [
          {
            id: 'code-library',
            label: 'Code Library',
            icon: FaGithub,
            badge: <span className="text-xs font-semibold text-zinc-400">Templates</span>,
            onClick: () => setActiveModal('code-library'),
          },
        ],
      },
    ];
  }, [favouriteTopics.length, favouriteProblems.length, skippedTopics.length, onOpenModules, onOpenHeatmap, onSelectCategory]);

  // Filtered menu sections and categories based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return menuSections;
    const q = searchQuery.toLowerCase();
    return menuSections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [menuSections, searchQuery]);

  const totalVisibleItems = useMemo(() => {
    let count = 0;
    filteredSections.forEach((s) => (count += s.items.length));
    return count;
  }, [filteredSections]);

  const copyCode = (title: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTemplate(title);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  const problemFavoritesOpen = activeModal === 'favourites-problems';
  const favoriteEntries = problemFavoritesOpen
    ? favouriteProblems.map((problemId) => {
        const problem = PROBLEMS[problemId];
        const isLeetCodeSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(problemId);
        return {
          id: problemId,
          label: problem?.problem_title || (isLeetCodeSlug ? problemId.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) : problemId),
          href: problem?.problem_url || (isLeetCodeSlug ? `https://leetcode.com/problems/${encodeURIComponent(problemId)}/` : null),
          topicId: null as string | null,
        };
      })
    : favouriteTopics.map((topicId) => ({
        id: topicId,
        label: ALL_TOPICS.find((topic) => topic.topic_id === topicId)?.topic_title || topicId,
        href: null as string | null,
        topicId,
      }));

  return (
    <>
      <aside className="w-full md:w-60 desktop:w-60 shrink-0">
        <button
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-controls="topic-list-navigation-content"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="mb-2 flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black px-4 text-left shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 md:hidden desktop:hidden"
        >
          <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-foreground">
            <TbCompass className="h-4 w-4 shrink-0 text-sky-400" />
            <span>Topic list tools</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-xs font-mono text-zinc-300">
            {totalVisibleItems} tools
            <ChevronDown className={`h-4 w-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </span>
        </button>
        <div
          id="topic-list-navigation-content"
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block desktop:block rounded-2xl border border-white/10 bg-black shadow-xl overflow-hidden`}
        >
          {/* Header Bar */}
          <div className="hidden md:flex desktop:flex px-4 py-3 border-b border-white/10 bg-black items-center justify-between">
            <div className="flex items-center gap-2">
              <TbCompass className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-semibold text-foreground">Navigation</span>
            </div>
            <span className="text-xs sm:text-[13px] font-mono font-bold text-zinc-300">
              ({totalVisibleItems})
            </span>
          </div>

          {/* Search Input Bar */}
          <div className="p-2.5 border-b border-white/10 bg-black">
            <div className="relative">
              <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sky-500/50 focus:border-sky-500/60 transition-colors"
              />
            </div>
          </div>

          {/* Scrollable Navigation List */}
          <div className="max-h-[52vh] md:max-h-[calc(100vh-230px)] overflow-y-auto divide-y divide-white/[0.06] bg-black scrollbar-thin">
            {filteredSections.map((sec) => (
              <div key={sec.sectionTitle} className="py-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-white/[0.02]">
                  {sec.sectionTitle}
                </div>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const ItemIcon = item.icon;
                    const content = (
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ItemIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-white transition-colors" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );

                    if (item.href) {
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className="group flex items-center justify-between px-3.5 py-2 text-xs text-foreground/85 hover:bg-white/[0.06] hover:text-white border-l-2 border-transparent transition-all"
                        >
                          {content}
                          {item.badge}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onClick}
                        className="w-full group flex items-center justify-between px-3.5 py-2 text-xs text-foreground/85 hover:bg-white/[0.06] hover:text-white border-l-2 border-transparent transition-all cursor-pointer text-left"
                      >
                        {content}
                        {item.badge}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Tour Modal */}
      {activeModal === 'tour' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-[#e83040]/15 border border-[#e83040]/30 text-[#ff5466]">
                <FaGraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Topic List Quick Tour</h3>
                <p className="text-xs text-zinc-400">Step {tourStep + 1} of 4</p>
              </div>
            </div>

            <div className="py-3 text-sm text-zinc-300 leading-relaxed min-h-[110px]">
              {tourStep === 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-1.5">1. Structured 11-Category Curriculum</h4>
                  <p className="text-xs text-zinc-400">
                    Browse 576 topics grouped by category, with difficulty and importance shown for each topic. Prerequisites and linked problems are included where curated.
                  </p>
                </div>
              )}
              {tourStep === 1 && (
                <div>
                  <h4 className="font-semibold text-white mb-1.5">2. Learning Modules & Presets</h4>
                  <p className="text-xs text-zinc-400">
                    Use <strong>Modules</strong> to apply a difficulty and importance preset, or use the filters to choose those values yourself.
                  </p>
                </div>
              )}
              {tourStep === 2 && (
                <div>
                  <h4 className="font-semibold text-white mb-1.5">3. Progress Heatmap & Activity</h4>
                  <p className="text-xs text-zinc-400">
                    Mark topics as Completed or Practicing. Your daily study streak and completion velocity are tracked visually on the Activity Heatmap.
                  </p>
                </div>
              )}
              {tourStep === 3 && (
                <div>
                  <h4 className="font-semibold text-white mb-1.5">4. Fast Search & Shortcuts</h4>
                  <p className="text-xs text-zinc-400">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-white text-[11px]">/</kbd> anywhere on the page to search 576+ topics instantly, or use the left sidebar to navigate.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={tourStep === 0}
                onClick={() => setTourStep((s) => s - 1)}
                className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-zinc-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`w-2 h-2 rounded-full transition-all ${
                      tourStep === dot ? 'bg-[#ff5466] w-4' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              {tourStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setTourStep((s) => s + 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#e83040] text-white text-xs font-semibold hover:bg-[#d02434] transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#e83040] text-white text-xs font-semibold hover:bg-[#d02434] transition-colors"
                >
                  Got It
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Features & Info Modal */}
      {activeModal === 'info' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <FaListAlt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Curriculum Features & Guide</h3>
                <p className="text-xs text-zinc-400">Competitive Programming Topic List Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                <h4 className="font-semibold text-white mb-1">Difficulty Levels (0 to 4)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <span className="font-bold text-emerald-400">0 - Very Easy</span>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                    <span className="font-bold text-cyan-400">1 - Easy</span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                    <span className="font-bold text-amber-400">2 - Medium</span>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                    <span className="font-bold text-orange-400">3 - Hard</span>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
                    <span className="font-bold text-red-400">4 - Very Hard</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5">
                <h4 className="font-semibold text-white mb-1">Importance Tiers</h4>
                <ul className="space-y-1.5 mt-2">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">★★★ Must Know:</span> Highest priority topics for contest preparation.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-zinc-300 font-bold">★★☆ Should Know:</span> Recommended topics for broader contest practice.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-zinc-500 font-bold">★☆☆ Nice to Know:</span> Advanced niche algorithms for specialized problems.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wrapped Progress Modal */}
      {activeModal === 'wrapped' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-b from-[#160B1E] via-[#0B0B0F] to-[#0B0B0F] p-6 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <FaGift className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Your Learning Progress</h3>
                <p className="text-xs text-zinc-400">Saved topic-list activity</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 text-center">
                <span className="text-2xl font-mono font-extrabold text-white">{completedTopics.length}</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Topics Mastered</p>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 text-center">
                <span className="text-2xl font-mono font-extrabold text-emerald-400">
                  {Math.round((completedTopics.length / (totalTopicsCount || 1)) * 100)}%
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Curriculum Complete</p>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 text-center">
                <span className="text-2xl font-mono font-extrabold text-amber-400">{favouriteTopics.length}</span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Favourites Starred</p>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 text-center">
                <span className="text-2xl font-mono font-extrabold text-red-400">
                  {Math.max(0, totalTopicsCount - completedTopics.length)}
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">Topics Remaining</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full py-2 rounded-xl bg-[#e83040] text-white text-xs font-semibold hover:bg-[#d02434] transition-colors"
            >
              Keep Grinding
            </button>
          </div>
        </div>
      )}

      {/* Favourites Modal */}
      {(activeModal === 'favourites-topics' || activeModal === 'favourites-problems') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 shrink-0">
              <div className="p-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400">
                <FaHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{problemFavoritesOpen ? 'Favourite Problems' : 'Favourite Topics'}</h3>
                <p className="text-xs text-zinc-400">{favoriteEntries.length} {problemFavoritesOpen ? 'problems' : 'topics'} saved</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {favoriteEntries.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">
                  {problemFavoritesOpen ? 'No favourite problems saved yet.' : 'No favourite topics saved yet. Use the star beside a topic to save it here.'}
                </div>
              ) : (
                favoriteEntries.map((entry) => {
                  const className = "flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-white transition-colors hover:border-white/20 hover:bg-white/5";
                  const content = <><span className="min-w-0 truncate">{entry.label}</span><ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" /></>;
                  if (entry.topicId) return <Link key={entry.id} href={`/topic-list/${entry.topicId}`} onClick={() => setActiveModal(null)} className={className}>{content}</Link>;
                  if (entry.href && /^https?:\/\//i.test(entry.href)) return <a key={entry.id} href={entry.href} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>;
                  return <div key={entry.id} className={className}><span className="min-w-0 truncate">{entry.label}</span><span className="shrink-0 text-[10px] text-zinc-500">{entry.id}</span></div>;
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Skipped Items Modal */}
      {activeModal === 'skipped' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 shrink-0">
              <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <MdSkipNext className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Skipped Topics</h3>
                <p className="text-xs text-zinc-400">{skippedTopics.length} topics marked to revisit</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {skippedTopics.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400">No topics are currently marked as skipped.</div>
              ) : skippedTopics.map((topicId) => {
                  const topic = ALL_TOPICS.find((item) => item.topic_id === topicId);
                  if (!topic) return null;
                  return (
                    <div key={topic.topic_id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-2.5 text-xs">
                      <Link href={`/topic-list/${topic.topic_id}`} onClick={() => setActiveModal(null)} className="flex min-w-0 flex-1 items-center justify-between gap-3 group">
                        <span className="truncate font-medium text-white group-hover:text-amber-300">{topic.topic_title}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[10px] text-zinc-400">
                          <TablerNumbersIcon className="h-2.5 w-2.5 text-[#ff1018]" />
                          <span>Phase {topic.phase ?? 0}</span>
                        </span>
                      </Link>
                      <button type="button" onClick={() => onToggleSkip?.(topic.topic_id)} className="shrink-0 rounded border border-white/10 bg-black px-2 py-1 text-[10px] text-zinc-300 hover:text-white">
                        Restore
                      </button>
                    </div>
                  );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Code Library Modal */}
      {activeModal === 'code-library' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0B0F] p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 shrink-0">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <FaGithub className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Competitive Programming Code Library</h3>
                <p className="text-xs text-zinc-400">Standard boilerplate and essential algorithms</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin text-xs">
              {/* Template 1 */}
              <div className="rounded-xl border border-white/10 bg-black/60 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Fast I/O C++ Boilerplate</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        'fast-io',
                        `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // solution\n    return 0;\n}`
                      )
                    }
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                  >
                    {copiedTemplate === 'fast-io' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-zinc-300 bg-[#08080A] p-2.5 rounded-lg overflow-x-auto">
{`#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    return 0;
}`}
                </pre>
              </div>

              {/* Template 2 */}
              <div className="rounded-xl border border-white/10 bg-black/60 p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Disjoint Set Union (DSU)</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyCode(
                        'dsu',
                        `struct DSU {\n    vector<int> parent, size;\n    DSU(int n) : parent(n), size(n, 1) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int i) {\n        return parent[i] == i ? i : parent[i] = find(parent[i]);\n    }\n    bool unite(int i, int j) {\n        int root_i = find(i), root_j = find(j);\n        if (root_i != root_j) {\n            if (size[root_i] < size[root_j]) swap(root_i, root_j);\n            parent[root_j] = root_i;\n            size[root_i] += size[root_j];\n            return true;\n        }\n        return false;\n    }\n};`
                      )
                    }
                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors"
                  >
                    {copiedTemplate === 'dsu' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-zinc-300 bg-[#08080A] p-2.5 rounded-lg overflow-x-auto">
{`struct DSU {
    vector<int> parent, size;
    DSU(int n) : parent(n), size(n, 1) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int i) {
        return parent[i] == i ? i : parent[i] = find(parent[i]);
    }
    bool unite(int i, int j) {
        int r1 = find(i), r2 = find(j);
        if (r1 == r2) return false;
        if (size[r1] < size[r2]) swap(r1, r2);
        parent[r2] = r1; size[r1] += size[r2];
        return true;
    }
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
