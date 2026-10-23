"use client";

import React from "react";
import { Sparkles, CircleCheck, X } from "@/components/animate-ui/icons";
import SmoothButton from "@/components/smoothui/smooth-button";
import Badge from "@/components/smoothui/badge";
import {
  ProgressRoot,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/smoothui/progress";
import {
  MODULES_LIST,
  ALL_TOPICS,
  ModulePreset,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
} from "@/lib/topic-list-data";

interface ModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyModuleFilter: (difficulty: string, importance: string) => void;
  completedTopicsList: string[];
}

export function ModulesModal({
  isOpen,
  onClose,
  applyModuleFilter,
  completedTopicsList,
}: ModulesModalProps) {
  if (!isOpen) return null;

  // Calculate statistics for each module
  const getModuleStats = (diff: string, imp: string) => {
    const diffNum = parseInt(diff, 10);
    const impNum = parseInt(imp, 10);

    const matching = ALL_TOPICS.filter(
      (t) => t.difficulty === diffNum && t.importance === impNum
    );
    const total = matching.length;
    const completed = matching.filter((t) =>
      completedTopicsList.includes(t.topic_id)
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  };

  const handleSelect = (module: ModulePreset) => {
    applyModuleFilter(module.difficulty, module.importance);
    onClose();
  };

  const handleReset = () => {
    applyModuleFilter("", "");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 transition-opacity animate-in fade-in-50"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-black text-white shadow-2xl z-10 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e8263d]" animateOnHover />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Choose a Module
              </h2>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed">
              Select a suitable module for you to filter topics by difficulty and importance based on your current Codeforces rating or your current knowledge level.
            </p>
            <SmoothButton
              variant="link"
              color="accent"
              size="xs"
              onClick={handleReset}
              className="mt-3 p-0 h-auto font-semibold"
            >
              ← View All Topics (Clear Filter)
            </SmoothButton>
          </div>

          <SmoothButton
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" animateOnHover />
          </SmoothButton>
        </div>

        {/* Modules Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {MODULES_LIST.map((mod) => {
              const { total, completed, percentage } = getModuleStats(
                mod.difficulty,
                mod.importance
              );
              const diffNum = parseInt(mod.difficulty, 10);
              const color = getTopicDifficultyColor(diffNum);
              const diffTitle = getTopicDifficultyTitle(diffNum);

              return (
                <div
                  key={mod.name}
                  onClick={() => handleSelect(mod)}
                  className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-[#0a0a0c] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.04] hover:shadow-lg cursor-pointer"
                >
                  {/* Top Bar: Title & Difficulty Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-[#ff5466] transition-colors">
                        {mod.name}
                      </h3>
                      <Badge
                        variant="outline"
                        size="sm"
                        style={{
                          backgroundColor: `${color}15`,
                          color: color,
                          borderColor: `${color}40`,
                        }}
                        className="text-[10px] font-semibold shrink-0"
                      >
                        {diffTitle}
                      </Badge>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed mb-4 line-clamp-2">
                      {mod.description}
                    </p>
                  </div>

                  {/* Bottom: Progress Bar & Count */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                      <span className="text-white/50">Progress</span>
                      <span className="font-semibold text-white/80">
                        {completed} / {total} ({percentage}%)
                      </span>
                    </div>

                    <ProgressRoot value={percentage} className="w-full">
                      <ProgressTrack size="sm" className="h-1.5 bg-black border border-white/10">
                        <ProgressIndicator
                          className={
                            percentage === 100
                              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.35)]"
                              : "bg-gradient-to-r from-red-600 to-[#ff1018] shadow-[0_0_8px_rgba(255,16,24,0.35)]"
                          }
                        />
                      </ProgressTrack>
                    </ProgressRoot>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
