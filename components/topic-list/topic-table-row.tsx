"use client";

import React from "react";
import Link from "next/link";
import { SkipForward } from "lucide-react";
import { Check, Flag, User } from "@/components/animate-ui/icons";
import {
  EnrichedTopic,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
  getTopicImportanceLabel,
} from "@/lib/topic-list-data";
import {
  ImportanceStars,
  DifficultyCircle,
} from "./icons";
import PulseHeart from "@/components/PulseHeart";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

interface TopicTableRowProps {
  topic: EnrichedTopic;
  isCompleted: boolean;
  isPracticing: boolean;
  isFavourite: boolean;
  isSkipped: boolean;
  completionCount?: number;
  onToggleComplete: (topicId: string) => void;
  onTogglePractice: (topicId: string) => void;
  onToggleFavourite: (topicId: string) => void;
  onToggleSkip: (topicId: string) => void;
}

function TopicTableRowComponent({
  topic,
  isCompleted,
  isPracticing,
  isFavourite,
  isSkipped,
  completionCount,
  onToggleComplete,
  onTogglePractice,
  onToggleFavourite,
  onToggleSkip,
}: TopicTableRowProps) {
  const diffColor = getTopicDifficultyColor(topic.difficulty);
  const diffTitle = getTopicDifficultyTitle(topic.difficulty);
  const impLabel = getTopicImportanceLabel(topic.importance);
  return (
    <tr
      id={topic.topic_id}
      className={`group transition-colors hover:bg-white/[0.035] ${
        isCompleted
          ? "bg-white/[0.01]"
          : isSkipped
          ? "bg-amber-500/[0.035] hover:bg-amber-500/[0.06]"
          : isPracticing
          ? "bg-blue-500/[0.08] hover:bg-blue-500/[0.12]"
          : ""
      }`}
    >
      {/* 1. Practice Flag Button */}
      <td className="w-10 sm:w-12 min-w-[40px] sm:min-w-[48px] px-2 sm:px-3 py-3 text-center align-middle shrink-0">
        <SimpleTooltip
          content={
            isCompleted
              ? "Topic completed"
              : isPracticing
              ? "Currently practicing — Click to remove"
              : "Click to start practicing this topic"
          }
        >
          <button
            type="button"
            onClick={() => onTogglePractice(topic.topic_id)}
            disabled={isCompleted}
            className={`w-7 h-7 mx-auto rounded-md border flex items-center justify-center transition-all cursor-pointer ${
              isPracticing
                ? "border-cyan-500 bg-cyan-500/20 text-[#00e5ff]"
                : isCompleted
                ? "border-transparent text-gray-700 opacity-20 cursor-not-allowed"
                : "border-white/10 bg-black/40 text-gray-400 hover:border-white/30 hover:text-white"
            }`}
          >
            <Flag className="w-3.5 h-3.5" animateOnHover />
          </button>
        </SimpleTooltip>
      </td>

      {/* Explicit skipped state */}
      <td className="w-10 min-w-[40px] px-1 py-3 text-center align-middle shrink-0">
        <SimpleTooltip content={isSkipped ? "Remove from skipped topics" : "Skip this topic for now"}>
          <button
            type="button"
            onClick={() => onToggleSkip(topic.topic_id)}
            aria-label={isSkipped ? `Remove ${topic.topic_title} from skipped topics` : `Skip ${topic.topic_title}`}
            aria-pressed={isSkipped}
            className={`mx-auto flex h-7 w-7 items-center justify-center rounded border transition-colors ${isSkipped ? "border-amber-500/60 bg-black text-amber-300" : "border-white/10 bg-black text-zinc-500 hover:border-white/25 hover:text-white"}`}
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </SimpleTooltip>
      </td>

      {/* 2. Completion Checkbox Button */}
      <td className="w-10 sm:w-12 min-w-[40px] sm:min-w-[48px] px-2 sm:px-3 py-3 text-center align-middle shrink-0">
        <SimpleTooltip
          content={isCompleted ? "Completed! Click to unmark" : "Mark as completed"}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(topic.topic_id);
            }}
            aria-label={isCompleted ? "Completed! Click to unmark" : "Mark as completed"}
            className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 transition-all duration-75 border mx-auto cursor-pointer active:scale-90 ${
              isCompleted
                ? "border-[#10b981] bg-[#10b981] text-black shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                : "border-white/25 hover:border-emerald-400/80 bg-zinc-900/60 text-transparent"
            }`}
          >
            <Check
              className={`w-3.5 h-3.5 stroke-[3.5] stroke-black text-black transition-none ${
                isCompleted ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>
        </SimpleTooltip>
      </td>

      {/* 3. Number, Topic Title, and Bookmark PulseHeart */}
      <td className="px-3 sm:px-4 py-3 align-middle min-w-[180px]">
        <div className="flex items-center justify-between gap-3 min-w-0 pr-1">
          <Link
            href={`/topic-list/${topic.topic_id}`}
            className={`font-medium text-sm sm:text-base transition-colors hover:underline break-words whitespace-normal leading-snug flex-1 min-w-0 pr-2 ${
              isCompleted
                ? "line-through opacity-60 text-muted-foreground"
                : "text-[#f4f3fc] hover:text-[#ff5466]"
            }`}
          >
            {topic.topic_number}. {topic.topic_title}
          </Link>

          {/* Favourite PulseHeart Button */}
          <SimpleTooltip
            content={isFavourite ? "Remove from favourites" : "Add to favourites"}
          >
            <div className="shrink-0 flex items-center justify-center">
              <PulseHeart
                liked={isFavourite}
                onChange={() => onToggleFavourite(topic.topic_id)}
                showCount={false}
                icon="star"
                idleOutline
                size={18}
                corner={14}
                likedColor="#facc15"
                idleColor="#8b8b93"
                pillColor="#000000"
                textColor="#f5f5f5"
                duration={380}
                dotSize={0.15}
                overshoot={3}
                beat={2.5}
                rollDuration={350}
                label={isFavourite ? "Remove from favourites" : "Add to favourites"}
                className="shrink-0"
              />
            </div>
          </SimpleTooltip>
        </div>
      </td>

      {/* 4. Importance Stars Capsule */}
      <td className="w-16 sm:w-20 min-w-[64px] sm:min-w-[80px] px-2 py-3 text-center align-middle shrink-0">
        <div className="flex justify-center">
          <SimpleTooltip content={impLabel}>
            <div className="inline-flex items-center justify-center gap-0.5 px-2 py-1 rounded border border-white/10 bg-white/[0.04] cursor-pointer">
              <ImportanceStars importance={topic.importance} />
            </div>
          </SimpleTooltip>
        </div>
      </td>

      {/* 5. Difficulty Circle Column */}
      <td className="w-12 sm:w-16 min-w-[48px] sm:min-w-[64px] px-2 py-3 text-center align-middle shrink-0">
        <div className="flex justify-center">
          <SimpleTooltip content={`Difficulty: Level ${topic.difficulty} (${diffTitle})`}>
            <div className="cursor-pointer">
              <DifficultyCircle
                difficulty={topic.difficulty}
                color={diffColor}
                size={18}
              />
            </div>
          </SimpleTooltip>
        </div>
      </td>

      {/* Community completion count */}
      <td className="w-24 sm:w-28 min-w-[96px] sm:min-w-[112px] px-3 py-3 text-right align-middle shrink-0">
        <SimpleTooltip content={completionCount === undefined ? "Community completion count unavailable." : `${completionCount.toLocaleString()} users completed this topic.`}>
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-blue-500/30 hover:scale-105 hover:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] transition-all duration-200 cursor-pointer active:scale-95">
              <div className="w-4 h-4 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <User className="w-2.5 h-2.5 text-sky-400" />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-sky-400 tracking-tight tabular-nums font-sans">
                {completionCount === undefined ? "—" : completionCount.toLocaleString()}
              </span>
            </div>
          </div>
        </SimpleTooltip>
      </td>
    </tr>
  );
}

export const TopicTableRow = React.memo(TopicTableRowComponent);

