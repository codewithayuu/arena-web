"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { X, Calendar, ExternalLink, Sparkles, BookOpen, CircleCheck } from "@/components/animate-ui/icons";
import HeatMap from "@uiw/react-heat-map";
import Select from "@/components/smoothui/select";
import Switch from "@/components/smoothui/switch";
import SmoothButton from "@/components/smoothui/smooth-button";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { DifficultyCircle, ImportanceStars } from "@/components/topic-list/icons";
import {
  ALL_TOPICS,
  PROBLEMS,
  getTopicById,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";
import { cn } from "@/lib/utils";
import { loadTopicListState } from "@/lib/topic-list-client";
import { memberStorageKey } from "@/lib/member-storage";

interface HeatmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedTopics?: string[];
}

interface ActivityEntry {
  count: number;
  topics?: string[];
  problems?: string[];
}

interface HoveredCellState {
  x: number;
  y: number;
  date: string;
  formattedDate: string;
  count: number;
  unit: string;
  verb: string;
}

interface SelectedDayState {
  date: string;
  formattedDate: string;
  count: number;
  items: string[];
}

// 5-tier color palette matching YouKn0wWho Academy
const PANEL_COLORS: Record<number, string> = {
  0: "#2a3038", // dark charcoal slate (empty)
  1: "#a1aa6d", // soft olive
  2: "#8cc665", // spring green
  3: "#44a340", // emerald green
  4: "#1e6823", // deep forest green
};

// Date formatter: "14 Oct 2026"
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.replace(/\//g, "-").split("-").map((p) => parseInt(p, 10));
  if (parts.length < 3) return dateStr;
  const [y, m, d] = parts;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayPadded = String(d).padStart(2, "0");
  return `${dayPadded} ${months[(m || 1) - 1]} ${y}`;
}

// Date formatter with weekday: "Wednesday, 14 Oct 2026"
function formatFullDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.replace(/\//g, "-").split("-").map((p) => parseInt(p, 10));
  if (parts.length < 3) return dateStr;
  const [y, m, d] = parts;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Streak computation algorithm matching YouKn0wWho Academy
function computeStreaks(activityMap: Record<string, ActivityEntry | number>) {
  let maxStreak = 0;
  let currentStreak = 0;
  let lastDate: Date | null = null;

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const entries = Object.entries(activityMap)
    .map(([dateKey, val]) => {
      const count = typeof val === "number" ? val : val?.count || 0;
      const dateIso = dateKey.replace(/\//g, "-");
      return { date: dateIso, count };
    })
    .filter((e) => e.count > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  entries.forEach((e) => {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);

    if (lastDate) {
      const diffDays = Math.round((d.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    lastDate = d;
    if (currentStreak > maxStreak) {
      maxStreak = currentStreak;
    }
  });

  if (lastDate) {
    const lastIso = (lastDate as Date).toISOString().split("T")[0];
    if (lastIso !== todayStr && lastIso !== yesterdayStr) {
      currentStreak = 0;
    }
  } else {
    currentStreak = 0;
  }

  return { maxStreak, currentStreak };
}

export function TopicHeatmapModal({
  isOpen,
  onClose,
  completedTopics = [],
}: HeatmapModalProps) {
  const { isLoaded, user } = useUser();
  const localKey = useCallback((key: string) => memberStorageKey(key, user?.id), [user?.id]);
  const [timeRange, setTimeRange] = useState<string>("recent");
  // isProblemsMode = false means "Topics", true means "Problems"
  const [isProblemsMode, setIsProblemsMode] = useState<boolean>(false);
  const [topicActivity, setTopicActivity] = useState<Record<string, ActivityEntry | number>>({});
  const [problemActivity, setProblemActivity] = useState<Record<string, ActivityEntry | number>>({});

  // Floating tooltip & Day detail modal states
  const [hoveredCell, setHoveredCell] = useState<HoveredCellState | null>(null);
  const [selectedDay, setSelectedDay] = useState<SelectedDayState | null>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedDay) {
          setSelectedDay(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, selectedDay]);

  // Load activity from localStorage
  useEffect(() => {
    if (!isLoaded || !isOpen) return;

    try {
      const savedTopicAct = localStorage.getItem(localKey("mindflare_topic_activity"));
      if (savedTopicAct) {
        setTopicActivity(JSON.parse(savedTopicAct));
      } else if (completedTopics.length > 0) {
        // Populate today with existing completed topics so heatmap reflects current progress
        const todayKey = new Date().toISOString().split("T")[0].replace(/-/g, "/");
        const initialMap: Record<string, ActivityEntry> = {
          [todayKey]: {
            count: completedTopics.length,
            topics: completedTopics,
          },
        };
        setTopicActivity(initialMap);
        localStorage.setItem(localKey("mindflare_topic_activity"), JSON.stringify(initialMap));
      } else {
        setTopicActivity({});
      }

      const savedProbAct = localStorage.getItem(localKey("mindflare_problem_activity"));
      if (savedProbAct) {
        setProblemActivity(JSON.parse(savedProbAct));
      } else {
        setProblemActivity({});
      }
    } catch {
      // ignore JSON errors
    }
    let cancelled = false;
    void loadTopicListState().then((accountState) => {
      if (!accountState || cancelled) return;
      const topics: Record<string, ActivityEntry> = {};
      const problems: Record<string, ActivityEntry> = {};
      for (const event of accountState.activity) {
        const day = event.activity_date.slice(0, 10).replace(/-/g, "/");
        if (event.event_type === "topic_completed") {
          const entry = topics[day] ?? { count: 0, topics: [] };
          if (!entry.topics!.includes(event.item_key)) entry.topics!.push(event.item_key);
          entry.count = entry.topics!.length;
          topics[day] = entry;
        }
        if (event.event_type === "problem_solved") {
          const entry = problems[day] ?? { count: 0, problems: [] };
          if (!entry.problems!.includes(event.item_key)) entry.problems!.push(event.item_key);
          entry.count = entry.problems!.length;
          problems[day] = entry;
        }
      }
      if (cancelled) return;
      setTopicActivity(topics);
      setProblemActivity(problems);
      try {
        localStorage.setItem(localKey("mindflare_topic_activity"), JSON.stringify(topics));
        localStorage.setItem(localKey("mindflare_problem_activity"), JSON.stringify(problems));
      } catch {
        // Server activity remains the account source of truth.
      }
    });
    return () => { cancelled = true; };
  }, [isLoaded, isOpen, completedTopics, localKey]);

  // Account activity history is retained from 2024 onward.
  const timeRangeOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: Math.max(0, currentYear - 2023) }, (_, i) => ({
      value: String(currentYear - i),
      label: String(currentYear - i),
    }));
    return [{ value: "recent", label: "Recent" }, ...years];
  }, []);

  const activeActivityMap = isProblemsMode ? problemActivity : topicActivity;

  // Compute streaks
  const { currentStreak, maxStreak } = useMemo(() => {
    return computeStreaks(activeActivityMap);
  }, [activeActivityMap]);

  // Determine date ranges based on timeRange selector
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    if (timeRange === "recent") {
      const past = new Date(today);
      past.setDate(today.getDate() - 364);
      return { startDate: past, endDate: today };
    }
    const year = parseInt(timeRange, 10) || today.getFullYear();
    return {
      startDate: new Date(year, 0, 1),
      endDate: new Date(year, 11, 31),
    };
  }, [timeRange]);

  // Format activity data for HeatMap component
  const heatmapValues = useMemo(() => {
    return Object.entries(activeActivityMap).map(([date, val]) => {
      const count = typeof val === "number" ? val : val?.count || 0;
      return {
        date: date.replace(/-/g, "/"),
        count,
      };
    });
  }, [activeActivityMap]);

  // Items for the selected day topic popup
  const dayItems = useMemo(() => {
    if (!selectedDay) return [];

    if (!isProblemsMode) {
      // Topics mode
      let topicIds = selectedDay.items || [];
      // Fallback: If items array is empty but count matches completedTopics on today
      if (topicIds.length === 0 && completedTopics.length > 0) {
        const todayStr = new Date().toISOString().split("T")[0].replace(/-/g, "/");
        if (selectedDay.date.replace(/-/g, "/") === todayStr) {
          topicIds = completedTopics;
        }
      }

      return topicIds
        .map((tid) => {
          const topic = getTopicById(tid);
          if (!topic) return null;
          return {
            id: topic.topic_id,
            title: topic.topic_title,
            subtitle: `${topic.category_title} • ${topic.sub_category_title}`,
            difficulty: topic.difficulty,
            difficultyTitle: getTopicDifficultyTitle(topic.difficulty),
            difficultyColor: getTopicDifficultyColor(topic.difficulty),
            importance: topic.importance,
            actionUrl: `/topic-list/${topic.topic_id}`,
          };
        })
        .filter(Boolean);
    } else {
      // Problems mode
      const problemIds = selectedDay.items || [];
      return problemIds
        .map((pid) => {
          const prob = PROBLEMS[pid];
          if (!prob) return null;
          return {
            id: prob.problem_id,
            title: prob.problem_title,
            subtitle: prob.problem_url ? new URL(prob.problem_url).hostname : "Online Judge",
            difficulty: prob.difficulty,
            difficultyTitle: `Diff ${prob.difficulty}`,
            difficultyColor: "#38bdf8",
            importance: 1,
            actionUrl: prob.problem_url,
          };
        })
        .filter(Boolean);
    }
  }, [selectedDay, isProblemsMode, completedTopics]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dark AMOLED Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Heatmap Dialog Card */}
      <div className="relative w-full max-w-[940px] rounded-2xl border border-white/10 bg-[#0e0e12] p-5 sm:p-7 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-emerald-400 shrink-0" animateOnHover />
              <span>{isProblemsMode ? "Problem Heatmap" : "Topic Heatmap"}</span>
            </h2>
            <p className="text-xs text-white/50 mt-1 leading-relaxed">
              {isProblemsMode
                ? "Shows the frequency of problems solved for each day."
                : "Shows the frequency of topics completed for each day."}
            </p>
          </div>

          {/* Controls Group & Close Button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Grouped Controls Pill */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 shadow-sm">
              {/* Range Select */}
              <div className="w-28">
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                  options={timeRangeOptions}
                  size="sm"
                  className="h-7 text-xs bg-black/60 border-white/10 text-white"
                />
              </div>

              {/* Topics / Problems Switch Toggle */}
              <div className="flex items-center gap-2 px-1.5">
                <button
                  type="button"
                  id="label-topics"
                  className={cn(
                    "text-xs font-semibold cursor-pointer transition-colors select-none",
                    !isProblemsMode ? "text-white" : "text-white/40 hover:text-white/70"
                  )}
                  onClick={() => setIsProblemsMode(false)}
                >
                  Topics
                </button>
                <Switch
                  id="heatmap-mode-switch"
                  checked={isProblemsMode}
                  onCheckedChange={setIsProblemsMode}
                  aria-label="Toggle between Topics and Problems mode"
                />
                <button
                  type="button"
                  id="label-problems"
                  className={cn(
                    "text-xs font-semibold cursor-pointer transition-colors select-none",
                    isProblemsMode ? "text-white" : "text-white/40 hover:text-white/70"
                  )}
                  onClick={() => setIsProblemsMode(true)}
                >
                  Problems
                </button>
              </div>
            </div>

            {/* Circular Close Button matching YouKn0wWho Academy */}
            <SimpleTooltip content="Close Heatmap Modal">
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" animateOnHover />
              </button>
            </SimpleTooltip>
          </div>
        </div>

        {/* Center Streak Indicators */}
        <div className="flex justify-center items-center gap-4 my-5 sm:my-6">
          {/* Current Streak */}
          <div className="w-32 sm:w-36 py-3 px-4 rounded-xl border border-white/10 bg-[#14141c]/80 text-center shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              CURRENT STREAK
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#38bdf8] font-mono my-0.5">
              {currentStreak}
            </div>
            <div className="text-[11px] text-white/40 font-medium">
              {currentStreak === 1 ? "Day" : "Days"}
            </div>
          </div>

          {/* Max Streak */}
          <div className="w-32 sm:w-36 py-3 px-4 rounded-xl border border-white/10 bg-[#14141c]/80 text-center shadow-inner">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
              MAX STREAK
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#4ade80] font-mono my-0.5">
              {maxStreak}
            </div>
            <div className="text-[11px] text-white/40 font-medium">
              {maxStreak === 1 ? "Day" : "Days"}
            </div>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="rounded-xl border border-white/10 bg-[#14141a]/60 p-4 sm:p-5 overflow-x-auto shadow-inner relative">
          <div className="min-w-[760px] flex justify-center">
            <HeatMap
              value={heatmapValues}
              startDate={startDate}
              endDate={endDate}
              rectSize={12}
              space={3}
              rectProps={{ rx: 2 }}
              weekLabels={false}
              monthPlacement="top"
              legendCellSize={0}
              panelColors={PANEL_COLORS}
              className="w-full text-white/60 text-[11px] select-none"
              rectRender={(props, data) => {
                const count = data.count || 0;
                const unit = isProblemsMode
                  ? count === 1
                    ? "problem"
                    : "problems"
                  : count === 1
                  ? "topic"
                  : "topics";
                const verb = isProblemsMode ? "solved" : "completed";
                const formattedDate = formatDisplayDate(data.date);

                // Compute level (0 to 4)
                const level = count === 0 ? 0 : Math.min(Math.ceil(count / 2), 4);
                const cellFill = PANEL_COLORS[level] || PANEL_COLORS[0];

                return (
                  <rect
                    {...props}
                    fill={cellFill}
                    className="cursor-pointer transition-all duration-150 hover:stroke-white/80 hover:stroke-[1.5px] hover:opacity-90"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                        date: data.date,
                        formattedDate,
                        count,
                        unit,
                        verb,
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => {
                      const rawEntry =
                        activeActivityMap[data.date] ||
                        activeActivityMap[data.date.replace(/\//g, "-")];
                      const items =
                        rawEntry && typeof rawEntry === "object"
                          ? isProblemsMode
                            ? rawEntry.problems || []
                            : rawEntry.topics || []
                          : [];

                      setSelectedDay({
                        date: data.date,
                        formattedDate: formatFullDate(data.date),
                        count,
                        items,
                      });
                    }}
                  />
                );
              }}
            />
          </div>

          {/* Custom Legend matching YouKn0wWho Academy (Less [5 colors] More) */}
          <div className="flex items-center justify-end gap-1.5 text-xs text-white/50 mt-3 pt-2 font-medium">
            <span className="mr-1">Less</span>
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#2a3038] border border-white/10" />
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#a1aa6d] border border-white/10" />
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#8cc665] border border-white/10" />
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#44a340] border border-white/10" />
            <span className="w-3.5 h-3.5 rounded-[2px] bg-[#1e6823] border border-white/10" />
            <span className="ml-1">More</span>
          </div>
        </div>
      </div>

      {/* Floating Animated Charcoal Tooltip (Zero Native OS Popup) */}
      {hoveredCell && (
        <div
          className="fixed pointer-events-none z-[110] -translate-x-1/2 -translate-y-full mb-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#141419] text-white text-xs font-medium shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 whitespace-nowrap"
          style={{
            left: hoveredCell.x,
            top: hoveredCell.y - 8,
          }}
        >
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              hoveredCell.count > 0 ? "bg-emerald-400 animate-pulse" : "bg-white/30"
            )}
          />
          <span>
            {hoveredCell.count > 0
              ? `${hoveredCell.count} ${hoveredCell.unit} ${hoveredCell.verb} on ${hoveredCell.formattedDate}`
              : `0 ${hoveredCell.unit} ${hoveredCell.verb} on this day`}
          </span>
          {/* Micro arrow pointing down to the day square */}
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#141419] border-r border-b border-white/10 rotate-45" />
        </div>
      )}

      {/* Day Detail Topic Popup Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedDay(null)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e0e12] p-5 sm:p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400">
                  <Calendar className="w-5 h-5" animateOnHover />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedDay.formattedDate}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    {selectedDay.count}{" "}
                    {isProblemsMode
                      ? selectedDay.count === 1
                        ? "problem solved"
                        : "problems solved"
                      : selectedDay.count === 1
                      ? "topic completed"
                      : "topics completed"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" animateOnHover />
              </button>
            </div>

            {/* Topics / Problems List */}
            <div className="mt-4 max-h-[340px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {dayItems.length > 0 ? (
                dayItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      {!isProblemsMode ? (
                        <DifficultyCircle
                          difficulty={item.difficulty}
                          color={item.difficultyColor}
                          size={18}
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center text-[10px] text-blue-300 shrink-0">
                          ✓
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-white/40 flex items-center gap-2 mt-0.5">
                          <span className="truncate">{item.subtitle}</span>
                          {!isProblemsMode && (
                            <>
                              <span>•</span>
                              <ImportanceStars importance={item.importance} />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {item.actionUrl && (
                      <Link
                        href={item.actionUrl}
                        className="shrink-0 text-xs text-blue-400 hover:text-blue-300 font-medium px-2.5 py-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" animateOnHover />
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-white/30 mb-3">
                    <BookOpen className="w-6 h-6" animateOnHover />
                  </div>
                  <p className="text-sm font-medium text-white/70">
                    No {isProblemsMode ? "problems solved" : "topics completed"} on this day
                  </p>
                  <p className="text-xs text-white/40 mt-1 max-w-xs mx-auto">
                    Keep practicing daily to build and maintain your consistency streak!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <SmoothButton
                size="sm"
                variant="outline"
                onClick={() => setSelectedDay(null)}
                className="border-white/10 text-white/80 hover:text-white"
              >
                Close
              </SmoothButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
