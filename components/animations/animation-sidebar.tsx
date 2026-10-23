"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronRight, X, Sparkles, Check } from "lucide-react";
import { ANIMATION_SECTIONS, AnimationSection, AnimationCard } from "@/lib/dsa-animations-data";
import SmoothButton from "@/components/smoothui/smooth-button";

interface AnimationSidebarProps {
  currentSlug: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnimationSidebar({ currentSlug, isOpen, onClose }: AnimationSidebarProps) {
  const [filterQuery, setFilterQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const filteredSections = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return ANIMATION_SECTIONS;

    return ANIMATION_SECTIONS.map((section) => {
      const matchingCards = section.cards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q) ||
          section.category.toLowerCase().includes(q)
      );
      if (matchingCards.length === 0) return null;
      return {
        ...section,
        cards: matchingCards,
      };
    }).filter(Boolean) as AnimationSection[];
  }, [filterQuery]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden desktop:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        id="animation-index"
        aria-label="Animation index"
        aria-hidden={!isOpen}
        inert={!isOpen ? true : undefined}
        className={`fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-white/10 bg-black transition-transform duration-300 ease-in-out md:static md:translate-x-0 desktop:static desktop:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:hidden desktop:hidden"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 bg-black">
          <Link
            href="/animations/dsa-concepts"
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-white hover:text-[#FF1018] transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-[#FF1018]" />
            DSA Animations
          </Link>
          <SmoothButton
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
            className="text-zinc-400 hover:text-white md:hidden desktop:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </SmoothButton>
        </div>

        {/* Search Input */}
        <div className="p-3 border-b border-white/10 bg-black">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter 140 concepts..."
              className="h-8 w-full rounded-md border border-white/10 bg-black pl-8 pr-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#FF1018]"
            />
          </div>
        </div>

        {/* Scrollable List of Categories & Cards */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {filteredSections.map((section) => {
            const isCollapsed = !filterQuery && !!collapsedCategories[section.category];
            const hasActive = section.cards.some((c) => c.slug === currentSlug);

            return (
              <div key={section.category} className="space-y-1">
                {/* Category Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(section.category)}
                  className="flex w-full items-center justify-between px-2 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="h-2 w-1 rounded-full shrink-0"
                      style={{ background: section.accent || "#67E8F9" }}
                    />
                    <span className="truncate">{section.category}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-muted-foreground/80 font-normal">
                      {section.cards.length}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="h-3 w-3 opacity-60" />
                    ) : (
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    )}
                  </div>
                </button>

                {/* Cards List */}
                {!isCollapsed && (
                  <div className="pl-3 space-y-0.5 border-l border-border/40 ml-2 mt-1">
                    {section.cards.map((card) => {
                      const isActive = card.slug === currentSlug;
                      return (
                        <Link
                          key={card.slug}
                          href={card.href}
                          onClick={() => {
                            if (window.innerWidth < 768) onClose();
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            isActive
                              ? "bg-[#FF1018]/15 text-[#FF3B41] font-semibold"
                              : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          <span className="truncate">{card.title}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FF1018] shrink-0 ml-1.5" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
