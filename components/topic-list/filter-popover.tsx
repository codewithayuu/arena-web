"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, ChevronDown, RefreshCw } from "@/components/animate-ui/icons";
import SmoothButton from "@/components/smoothui/smooth-button";
import Select from "@/components/smoothui/select";
import Badge from "@/components/smoothui/badge";
import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All Difficulty Levels" },
  { value: "0", label: "Level 0 (Very Easy)" },
  { value: "1", label: "Level 1 (Easy)" },
  { value: "2", label: "Level 2 (Medium)" },
  { value: "3", label: "Level 3 (Hard)" },
  { value: "4", label: "Level 4 (Very Hard)" },
];

const IMPORTANCE_OPTIONS = [
  { value: "", label: "All Importance Levels" },
  { value: "1", label: "Priority 1 (Nice to know)" },
  { value: "2", label: "Priority 2 (Should know)" },
  { value: "3", label: "Priority 3 (Must know)" },
];

const COMPLETION_OPTIONS = [
  { value: "", label: "All Topics" },
  { value: "completed", label: "Completed Topics" },
  { value: "incomplete", label: "Incomplete Topics" },
  { value: "practicing", label: "Currently Practicing" },
  { value: "skipped", label: "Skipped Topics" },
];

interface FilterPopoverProps {
  difficulty: string;
  setDifficulty: (val: string) => void;
  importance: string;
  setImportance: (val: string) => void;
  completion: string;
  setCompletion: (val: string) => void;
  onReset: () => void;
}

export function FilterPopover({
  difficulty,
  setDifficulty,
  importance,
  setImportance,
  completion,
  setCompletion,
  onReset,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const activeCount = [difficulty, importance, completion].filter(
    (v) => v !== ""
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest('[role="listbox"]') ||
        target.closest('[role="option"]') ||
        target.closest("[data-smoothui-select-portal]")
      ) {
        return;
      }
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border transition-colors shadow-sm cursor-pointer",
          activeCount > 0
            ? "border-[#FF1018] bg-[#FF1018]/15 text-[#FF1018]"
            : "border-white/10 bg-black hover:border-white/20 hover:bg-white/[0.04] text-[#F4F3FC]"
        )}
      >
        <Filter className="w-3.5 h-3.5" animateOnHover />
        <span>Filter</span>
        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#FF1018] text-[10px] font-bold text-white ml-0.5">
            {activeCount}
          </span>
        )}
        <ChevronDown className="w-3 h-3 ml-0.5 opacity-60" animateOnHover />
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-black p-4 shadow-2xl z-40 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold text-white tracking-wide uppercase">
              Filter Topics
            </span>
            {activeCount > 0 && (
              <SmoothButton
                variant="ghost"
                color="destructive"
                size="xs"
                onClick={onReset}
                className="gap-1 text-[11px] font-medium h-auto p-1"
              >
                <RefreshCw className="w-3 h-3" animateOnHover />
                Reset
              </SmoothButton>
            )}
          </div>

          <div className="mt-3.5 space-y-3.5">
            {/* Difficulty Select */}
            <div>
              <label className="block text-[11px] font-medium text-white/60 mb-1.5">
                Difficulty
              </label>
              <Select
                value={difficulty}
                onValueChange={setDifficulty}
                options={DIFFICULTY_OPTIONS}
                placeholder="All Difficulty Levels"
                size="sm"
              />
            </div>

            {/* Importance Select */}
            <div>
              <label className="block text-[11px] font-medium text-white/60 mb-1.5">
                Importance
              </label>
              <Select
                value={importance}
                onValueChange={setImportance}
                options={IMPORTANCE_OPTIONS}
                placeholder="All Importance Levels"
                size="sm"
              />
            </div>

            {/* Completion Status Select */}
            <div>
              <label className="block text-[11px] font-medium text-white/60 mb-1.5">
                Completion Status
              </label>
              <Select
                value={completion}
                onValueChange={setCompletion}
                options={COMPLETION_OPTIONS}
                placeholder="All Topics"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
