"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, ArrowRight, ChevronDown, Check, Sparkles } from "lucide-react";
import {
  ANIMATION_SECTIONS,
  ANIMATIONS_PAGE_META,
  AnimationSection,
  AnimationCard,
} from "@/lib/dsa-animations-data";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";

export function DsaConceptsGallery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Filter sections and cards based on search and selected category
  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return ANIMATION_SECTIONS.map((section) => {
      // If a specific category is selected and it doesn't match, return null
      if (selectedCategory !== "all" && section.category !== selectedCategory) {
        return null;
      }

      // Filter cards by search query
      const matchingCards = section.cards.filter((card) => {
        if (!q) return true;
        return (
          card.title.toLowerCase().includes(q) ||
          card.slug.toLowerCase().includes(q) ||
          section.category.toLowerCase().includes(q)
        );
      });

      if (matchingCards.length === 0) return null;

      return {
        ...section,
        count: matchingCards.length,
        cards: matchingCards,
      };
    }).filter(Boolean) as AnimationSection[];
  }, [searchQuery, selectedCategory]);

  const totalVisible = useMemo(() => {
    return filteredSections.reduce((acc, s) => acc + s.cards.length, 0);
  }, [filteredSections]);

  return (
    <div className="min-h-screen bg-transparent text-foreground relative z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        {/* Back Link */}
        <Link
          href="/animations"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          All categories
        </Link>

        {/* Hero Section */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ background: "#14b8a6" }}
            />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl md:text-4xl">
              {ANIMATIONS_PAGE_META.title}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {ANIMATIONS_PAGE_META.subtitle}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative max-w-md flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${ANIMATIONS_PAGE_META.totalAnimations} animations...`}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative sm:w-64">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <span className="truncate">
                {selectedCategory === "all"
                  ? "All Categories"
                  : selectedCategory}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-full max-h-72 overflow-y-auto rounded-md border border-border bg-popover text-popover-foreground shadow-lg py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs sm:text-sm text-left hover:bg-muted transition-colors ${
                      selectedCategory === "all" ? "font-semibold text-emerald-500" : ""
                    }`}
                  >
                    <span>All Categories</span>
                    {selectedCategory === "all" && <Check className="h-4 w-4" />}
                  </button>
                  <div className="my-1 border-t border-border" />
                  {ANIMATION_SECTIONS.map((sec) => (
                    <button
                      key={sec.category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(sec.category);
                        setIsDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-xs sm:text-sm text-left hover:bg-muted transition-colors ${
                        selectedCategory === sec.category
                          ? "font-semibold text-[#67E8F9]"
                          : ""
                      }`}
                    >
                      <span className="truncate">{sec.category}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {sec.cards.length}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search Results Summary (when filtered) */}
        {(searchQuery || selectedCategory !== "all") && (
          <div className="mb-6 flex items-center justify-between text-xs sm:text-sm text-muted-foreground border-b border-border/40 pb-3">
            <span>
              Showing <strong className="text-foreground">{totalVisible}</strong> of{" "}
              {ANIMATIONS_PAGE_META.totalAnimations} animations
            </span>
            {(searchQuery || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-[#67E8F9] hover:underline font-medium text-xs"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* Empty State */}
        {filteredSections.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/20">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h3 className="text-base font-semibold text-foreground mb-1">
              No animations found
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
              We couldn&apos;t find any DSA animations matching &ldquo;{searchQuery}&rdquo;.
            </p>
            <SmoothButton
              type="button"
              size="xs"
              variant="solid"
              color="accent"
              className="gap-1.5 font-semibold text-xs bg-[#F87157] text-white hover:bg-[#E24A2B]"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear Search
            </SmoothButton>
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-10">
          {filteredSections.map((section) => (
            <section
              key={section.category}
              className="scroll-mt-20"
              id={section.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              style={{ contentVisibility: "auto", containIntrinsicSize: "0 220px" }}
            >
              {/* Category Header */}
              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className="h-4 w-1 rounded-full shrink-0"
                  style={{ background: section.accent || "#67E8F9" }}
                />
                <h2 className="text-lg font-semibold tracking-tight text-[#F4F3FC]">
                  {section.category}
                </h2>
                <Badge variant="outline" size="sm" className="text-xs text-zinc-400 font-normal border-white/10 bg-black">
                  {section.count}
                </Badge>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.cards.map((card) => (
                  <Link
                    key={card.slug}
                    href={card.href}
                    className="group block w-full min-w-0 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#FF1018]"
                  >
                    <div
                      className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-black px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-white/20 hover:bg-white/[0.02]"
                      style={{ ["--accent" as any]: section.accent || "#67E8F9" }}
                    >
                      {/* Left: Dot & Title */}
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ background: section.accent || "#67E8F9" }}
                        />
                        <span className="truncate text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {card.title}
                        </span>
                      </div>

                      {/* Right: Arrow Right */}
                      <div className="flex shrink-0 items-center gap-1">
                        <ArrowRight className="h-4 w-4 text-slate-500 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#F87157]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
