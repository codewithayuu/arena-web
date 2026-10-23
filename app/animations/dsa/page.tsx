"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Bookmark, ChevronDown, Sparkles } from "lucide-react";
import {
  DSA_PROBLEM_SECTIONS,
  ALL_DSA_PROBLEMS,
  DsaProblemCard,
} from "@/lib/dsa-problems-data";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";
import Select from "@/components/smoothui/select";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function DsaProblemAnimationsGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(
    new Set(),
  );
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dsa_problem_bookmarks");
      if (saved) {
        setBookmarkedSlugs(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  // Toggle bookmark
  const toggleBookmark = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      try {
        localStorage.setItem(
          "dsa_problem_bookmarks",
          JSON.stringify(Array.from(next)),
        );
      } catch {}
      return next;
    });
  };

  // Filter sections & problems
  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return DSA_PROBLEM_SECTIONS.map((section) => {
      // Check category filter
      if (selectedCategory !== "all" && section.category !== selectedCategory) {
        return { ...section, problems: [] };
      }

      const filteredProblems = section.problems.filter((problem) => {
        // Difficulty filter
        if (
          selectedDifficulty !== "all" &&
          problem.difficulty !== selectedDifficulty
        ) {
          return false;
        }

        // Bookmark filter
        if (showBookmarksOnly && !bookmarkedSlugs.has(problem.slug)) {
          return false;
        }

        // Search query filter
        if (query) {
          const matchTitle = problem.title.toLowerCase().includes(query);
          const matchDesc = problem.description.toLowerCase().includes(query);
          const matchSlug = problem.slug.toLowerCase().includes(query);
          const matchCat = problem.category.toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchSlug && !matchCat) {
            return false;
          }
        }

        return true;
      });

      return {
        ...section,
        problems: filteredProblems,
      };
    }).filter((section) => section.problems.length > 0);
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    showBookmarksOnly,
    bookmarkedSlugs,
  ]);

  const totalResults = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.problems.length, 0);
  }, [filteredSections]);

  const allCategories = useMemo(() => {
    return DSA_PROBLEM_SECTIONS.map((s) => s.category);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col relative z-10">
      <Navbar />

      {/* Top Banner / Header positioned below floating navbar */}
      <div className="border-b border-white/[0.08] bg-black/60 backdrop-blur-xl sticky top-0 z-20 pt-24 sm:pt-28 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  size="sm"
                  className="gap-1.5 font-semibold bg-[#FF1018]/10 text-[#FF3B41] border-[#FF1018]/25"
                >
                  <Sparkles className="h-3 w-3 text-[#FF1018]" />
                  646 Interactive Walkthroughs
                </Badge>
                <Link
                  href="/animations/dsa-concepts"
                  className="text-xs text-zinc-400 hover:text-white underline transition-colors"
                >
                  Switch to DSA Concepts (140)
                </Link>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
                Mindflare DSA Animations
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Step-by-step interactive visualizations paired with live
                multi-language code for 646 coding interview problems.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search algorithms, problems, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#FF1018] focus:border-[#FF1018] transition-all placeholder:text-zinc-500 shadow-sm"
              />
            </div>

            {/* Category Select */}
            <div className="w-full">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                options={[
                  { value: "all", label: `All Categories (${DSA_PROBLEM_SECTIONS.length})` },
                  ...allCategories.map((cat) => ({ value: cat, label: cat })),
                ]}
                placeholder={`All Categories (${DSA_PROBLEM_SECTIONS.length})`}
                className="bg-black border-white/10 text-white h-10 shadow-sm"
              />
            </div>

            {/* Difficulty Select & Bookmark Button */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Select
                  value={selectedDifficulty}
                  onValueChange={setSelectedDifficulty}
                  options={[
                    { value: "all", label: "All Difficulties" },
                    { value: "Easy", label: "Easy" },
                    { value: "Medium", label: "Medium" },
                    { value: "Hard", label: "Hard" },
                  ]}
                  placeholder="All Difficulties"
                  className="bg-black border-white/10 text-white h-10 shadow-sm"
                />
              </div>

              {/* Bookmark Toggle */}
              <SimpleTooltip content={showBookmarksOnly ? "Show all problems" : "Show bookmarked only"}>
                <SmoothButton
                  type="button"
                  size="icon"
                  variant={showBookmarksOnly ? "solid" : "outline"}
                  color={showBookmarksOnly ? "accent" : "neutral"}
                  onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                  className={showBookmarksOnly ? "bg-[#FF1018] text-white" : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.04]"}
                >
                  <Bookmark className="h-4 w-4" fill={showBookmarksOnly ? "currentColor" : "none"} />
                </SmoothButton>
              </SimpleTooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 flex-1 w-full">
        {filteredSections.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-zinc-300">
              No simulation problems found.
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              Try adjusting your search criteria or clear active filters.
            </p>
            <SmoothButton
              className="mt-4 bg-[#FF1018] text-white hover:bg-[#E00C14]"
              variant="solid"
              color="accent"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
                setShowBookmarksOnly(false);
              }}
            >
              Reset Filters
            </SmoothButton>
          </div>
        ) : (
          filteredSections.map((section) => (
            <section
              key={section.category}
              className="space-y-4"
              style={{ contentVisibility: "auto", containIntrinsicSize: "0 280px" }}
            >
              <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-2">
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {section.category}
                </h2>
                <span className="text-xs text-zinc-400 font-medium">
                  {section.problems.length}{" "}
                  {section.problems.length === 1 ? "problem" : "problems"}
                </span>
              </div>

              {/* 2-Column Responsive Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.problems.map((problem) => {
                  const isBookmarked = bookmarkedSlugs.has(problem.slug);

                  const difficultyBadgeClass =
                    problem.difficulty === "Easy"
                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
                      : problem.difficulty === "Medium"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/25"
                        : "text-[#FF3B41] bg-[#FF1018]/10 border-[#FF1018]/25";

                  return (
                    <Link
                      key={problem.slug}
                      href={`/animations/dsa/${problem.slug}`}
                      className="group relative rounded-2xl border border-white/10 bg-black p-6 hover:border-white/20 hover:bg-white/[0.02] hover:shadow-2xl transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Top Right Badges */}
                        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${difficultyBadgeClass}`}>
                            {problem.difficulty}
                          </span>
                          <SmoothButton
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={(e) => toggleBookmark(e, problem.slug)}
                            className="text-zinc-500 hover:text-white"
                            aria-label={
                              isBookmarked ? "Remove bookmark" : "Add bookmark"
                            }
                          >
                            <Bookmark
                              className="h-4 w-4"
                              fill={isBookmarked ? "currentColor" : "none"}
                            />
                          </SmoothButton>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-white group-hover:text-white transition-colors pr-28">
                          {problem.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                          {problem.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                        <span>{problem.category}</span>
                        <span className="font-semibold text-[#FF3B41] group-hover:underline">
                          View Interactive Simulation →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
