"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Search, X, ArrowRight, CornerDownLeft } from "@/components/animate-ui/icons";
import SmoothButton from "@/components/smoothui/smooth-button";
import Kbd from "@/components/smoothui/kbd";
import Badge from "@/components/smoothui/badge";
import {
  ALL_TOPICS,
  EnrichedTopic,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";
import { ImportanceStars, DifficultyCircle } from "./icons";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (topicId: string) => void;
}

export function SearchModal({ isOpen, onClose, onSelectTopic }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuse.js Indexing setup
  const searchableTopics = useMemo(() => {
    return ALL_TOPICS.map((t) => ({
      ...t,
      searchableText: `${t.topic_title} ${t.category_title} ${t.sub_category_title}`.toLowerCase(),
    }));
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(searchableTopics, {
      keys: [
        { name: "topic_title", weight: 0.8 },
        { name: "sub_category_title", weight: 0.2 },
        { name: "category_title", weight: 0.1 },
        { name: "searchableText", weight: 0.05 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1,
      ignoreLocation: true,
    });
  }, [searchableTopics]);

  // Compute results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Return top 8 popular/must-know topics when query is empty
      return searchableTopics
        .filter((t) => t.importance === 3 && t.difficulty <= 1)
        .slice(0, 8);
    }

    const fuseResults = fuse.search(q);
    const matched = fuseResults.map((r) => r.item);

    // Boost exact / starts-with matches to top
    return matched.sort((a, b) => {
      const aTitle = a.topic_title.toLowerCase();
      const bTitle = b.topic_title.toLowerCase();
      const aStarts = aTitle.startsWith(q);
      const bStarts = bTitle.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    }).slice(0, 15);
  }, [query, fuse, searchableTopics]);

  // Keyboard shortcut '/' to open, 'Escape' to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 transition-opacity animate-in fade-in-50"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black text-white shadow-2xl z-10 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3.5">
          <Search className="w-5 h-5 text-white/40 mr-3 shrink-0" animateOnHover />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics (e.g. Binary Search, DFS, Segment Tree)..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/40 focus:outline-none"
          />
          {query && (
            <SmoothButton
              variant="ghost"
              size="icon-sm"
              onClick={() => setQuery("")}
              className="text-white/40 hover:text-white mr-1"
            >
              <X className="w-4 h-4" animateOnHover />
            </SmoothButton>
          )}
          <Kbd className="hidden sm:inline-flex bg-white/5 border-white/10 text-white/50 text-[10px]">
            ESC
          </Kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/40">
              No topics found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                  Suggested Topics
                </div>
              )}
              {results.map((topic) => {
                const diffColor = getTopicDifficultyColor(topic.difficulty);
                const diffTitle = getTopicDifficultyTitle(topic.difficulty);

                return (
                  <Link
                    key={topic.topic_id}
                    href={`/topic-list/${topic.topic_id}`}
                    onClick={() => {
                      if (onSelectTopic) onSelectTopic(topic.topic_id);
                      onClose();
                    }}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.04] hover:border-white/10 border border-transparent"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <DifficultyCircle
                        difficulty={topic.difficulty}
                        color={diffColor}
                        size={16}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#f4f3fc] group-hover:text-[#ff5466] transition-colors truncate">
                            {topic.topic_number ? `${topic.topic_number}. ` : ""}{topic.topic_title}
                          </span>
                          <ImportanceStars importance={topic.importance} />
                        </div>
                        <div className="text-[11px] text-white/50 truncate">
                          {topic.category_title} &rsaquo; {topic.sub_category_title}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        style={{ color: diffColor }}
                        className="text-[11px] font-mono font-medium hidden sm:inline"
                      >
                        {diffTitle}
                      </span>
                      <CornerDownLeft className="w-3.5 h-3.5 text-white/30 group-hover:text-[#ff5466] transition-colors" animateOnHover />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] text-white/40">
          <span>{results.length} topics found</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
