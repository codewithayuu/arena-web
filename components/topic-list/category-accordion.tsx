"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Link as LinkIcon,
  ArrowUpDown,
  Check,
  Info,
} from "@/components/animate-ui/icons";
import { Category, EnrichedTopic } from "@/lib/topic-list-data";
import { TopicTableRow } from "./topic-table-row";
import { TablerNumbersIcon } from "./tabler-numbers";
import Badge from "@/components/smoothui/badge";
import SmoothButton from "@/components/smoothui/smooth-button";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { cn } from "@/lib/utils";
import { usePersistedSet } from "@/hooks/use-persisted-state";

interface CategoryAccordionProps {
  category: Category;
  topics: EnrichedTopic[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  completedTopics: string[];
  practicingTopics: string[];
  favouriteTopics: string[];
  skippedTopics: string[];
  communityTopicStats: Record<string, { practicing_count: number; completed_count: number; favourite_count: number }>;
  onToggleComplete: (topicId: string) => void;
  onTogglePractice: (topicId: string) => void;
  onToggleFavourite: (topicId: string) => void;
  onToggleSkip: (topicId: string) => void;
  onBatchCompleteSubcategory: (topicIds: string[]) => void;
}

export function CategoryAccordion({
  category,
  topics,
  isExpanded,
  onToggleExpand,
  completedTopics,
  practicingTopics,
  favouriteTopics,
  skippedTopics,
  communityTopicStats,
  onToggleComplete,
  onTogglePractice,
  onToggleFavourite,
  onToggleSkip,
  onBatchCompleteSubcategory,
}: CategoryAccordionProps) {
  const [sortedSubCats, setSortedSubCats] = usePersistedSet("topic_list_sorted_subcats", []);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Filter topics belonging to this category
  const categoryTopics = topics.filter((t) => t.category_id === category.category_id);
  const totalCount = categoryTopics.length;
  const completedCount = categoryTopics.filter((t) =>
    completedTopics.includes(t.topic_id)
  ).length;

  const toggleSortSubCat = (subId: string) => {
    setSortedSubCats((prev) => {
      const next = new Set(prev);
      if (next.has(subId)) next.delete(subId);
      else next.add(subId);
      return next;
    });
  };

  const copyLink = (path: string, label: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopiedLink(label);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  if (totalCount === 0) return null;

  return (
    <div
      id={category.category_id}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden mb-4 ${
        isExpanded
          ? "border-white/15 bg-black shadow-xl"
          : "border-white/10 bg-black hover:border-white/20"
      }`}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: isExpanded ? "0 600px" : "0 72px",
      }}
    >
      {/* Category Accordion Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left transition-colors cursor-pointer select-none hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[15px] sm:text-[16px] font-semibold tracking-tight text-white/90 hover:text-white transition-colors truncate">
            {category.category_title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-xs text-zinc-400 shrink-0 font-normal select-none">
            <span
              className={cn(
                "inline-block text-center",
                completedCount < 10 ? "w-[10px]" : completedCount < 100 ? "w-[20px]" : "w-[30px]",
                completedCount > 0 ? "text-white font-medium" : "text-zinc-400"
              )}
            >
              {completedCount}
            </span>
            <span> / {totalCount}</span>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isExpanded ? "rotate-180 text-blue-400" : "text-zinc-400"
            )}
            animateOnHover
          />
        </div>
      </button>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="border-t border-white/10 px-5 sm:px-6 py-5 bg-black space-y-6">
          {/* Category Top Section: Copy Link & Description */}
          <div className="space-y-1.5 pb-1">
            <div>
              <SmoothButton
                variant="ghost"
                size="xs"
                onClick={() =>
                  copyLink(`/topic-list#${category.category_id}`, category.category_title)
                }
                className="gap-1.5 text-xs text-gray-400 hover:text-white p-1 h-auto font-normal"
              >
                <LinkIcon className="w-3.5 h-3.5 text-gray-400" animateOnHover />
                <span>
                  {copiedLink === category.category_title
                    ? "Link copied!"
                    : `Copy Link to ${category.category_title}`}
                </span>
              </SmoothButton>
            </div>

            {category.category_desc && (
              <p className="text-xs text-gray-400 max-w-3xl leading-relaxed">
                <Info className="w-3 h-3 inline mr-1.5 text-sky-400" />{category.category_desc}
              </p>
            )}
          </div>

          {/* Subcategories List */}
          {category.sub_categories.map((sub) => {
            let subTopics = categoryTopics.filter(
              (t) => t.sub_category_id === sub.sub_category_id
            );
            if (subTopics.length === 0) return null;

            if (sortedSubCats.has(sub.sub_category_id)) {
              subTopics = [...subTopics].sort(
                (a, b) =>
                  (communityTopicStats[b.topic_id]?.completed_count ?? 0) -
                  (communityTopicStats[a.topic_id]?.completed_count ?? 0)
              );
            }

            const allSubCompleted = subTopics.every((t) =>
              completedTopics.includes(t.topic_id)
            );

            return (
              <div
                key={sub.sub_category_id}
                id={`${category.category_id}_${sub.sub_category_id}`}
                className="space-y-2 pt-1"
              >
                {/* Subcategory Header: 🔗 Title ⬜ ⬍ */}
                <div className="flex items-center gap-2">
                  <SimpleTooltip content="Copy link to subcategory">
                    <button
                      type="button"
                      onClick={() =>
                        copyLink(
                          `/topic-list#${category.category_id}_${sub.sub_category_id}`,
                          sub.sub_category_title
                        )
                      }
                      className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-gray-400" animateOnHover />
                    </button>
                  </SimpleTooltip>

                  <h3 className="text-[13px] sm:text-sm font-semibold tracking-tight text-white">
                    {sub.sub_category_title}
                  </h3>

                  {/* Batch Complete Small Checkbox */}
                  <SimpleTooltip
                    content={
                      allSubCompleted
                        ? "All topics completed in this subcategory"
                        : "Mark all topics in subcategory as completed"
                    }
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBatchCompleteSubcategory(subTopics.map((t) => t.topic_id));
                      }}
                      className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all duration-75 cursor-pointer ml-0.5 ${
                        allSubCompleted
                          ? "border-[#10b981] bg-[#10b981] text-black shadow-[0_0_6px_rgba(16,185,129,0.35)]"
                          : "border-white/20 bg-black/40 hover:border-white/40"
                      }`}
                    >
                      {allSubCompleted && (
                        <Check className="w-2.5 h-2.5 stroke-[3.5] stroke-black text-black" />
                      )}
                    </button>
                  </SimpleTooltip>

                  {/* Up/Down Sort Button */}
                  <SimpleTooltip
                    content={
                      sortedSubCats.has(sub.sub_category_id)
                        ? "Curriculum sequence order (click to sort by completion count)"
                        : "Sort numerically by user completion count"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => toggleSortSubCat(sub.sub_category_id)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer border ${
                        sortedSubCats.has(sub.sub_category_id)
                          ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                          : "border-white/10 bg-black/40 text-gray-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <TablerNumbersIcon className="w-3 h-3 text-zinc-400" />
                      <ArrowUpDown className="w-2.5 h-2.5" animateOnHover />
                    </button>
                  </SimpleTooltip>
                </div>

                {/* Subcategory Description (e.g., 💡 Learning C++ is recommended.) */}
                {sub.sub_category_desc && (
                  <p className="text-xs text-gray-400 pl-0.5">
                    <Info className="w-3 h-3 inline mr-1.5 text-sky-400" />{sub.sub_category_desc}
                  </p>
                )}

                {/* Subcategory Table (NO THEAD ROW - pure AMOLED topics list matching company/google) */}
                <div
                  role="list"
                  className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/10 bg-black shadow-md"
                >
                  {subTopics.map((topic) => (
                    <TopicTableRow
                      key={topic.topic_id}
                      topic={topic}
                      isCompleted={completedTopics.includes(topic.topic_id)}
                      isPracticing={practicingTopics.includes(topic.topic_id)}
                      isFavourite={favouriteTopics.includes(topic.topic_id)}
                      isSkipped={skippedTopics.includes(topic.topic_id)}
                      completionCount={communityTopicStats[topic.topic_id]?.completed_count}
                      onToggleComplete={onToggleComplete}
                      onTogglePractice={onTogglePractice}
                      onToggleFavourite={onToggleFavourite}
                      onToggleSkip={onToggleSkip}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
