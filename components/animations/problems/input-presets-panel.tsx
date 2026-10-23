"use client";

import React, { useState } from "react";
import { Check, Edit3, ChevronUp, ChevronDown } from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

export interface PresetOption<T = any> {
  id: string;
  label: string;
  value: T;
  displayText?: string;
}

interface InputPresetsPanelProps<T = any> {
  presets: PresetOption<T>[];
  activePresetId: string;
  onSelectPreset: (preset: PresetOption<T>) => void;
  formattedDisplay: string;
  className?: string;
}

export function InputPresetsPanel({
  presets,
  activePresetId,
  onSelectPreset,
  formattedDisplay,
  className = "",
}: InputPresetsPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-black p-3 space-y-2 select-none shadow-xl ${className}`}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Header with Title and Collapse chevron */}
      <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold px-0.5">
        <span>Input</span>
        <SimpleTooltip content={isCollapsed ? "Expand Input" : "Collapse Input"}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>
        </SimpleTooltip>
      </div>

      {!isCollapsed && (
        <>
          {/* Preset Pills Row with Custom button */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {presets.map((preset) => {
              const isActive = preset.id === activePresetId;
              const isCustom = preset.id === "custom";

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    isActive
                      ? "bg-[#FF1018] text-white border-[#FF1018] shadow-md shadow-[#FF1018]/25 font-bold"
                      : "bg-white/[0.04] text-zinc-300 border-white/10 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {isActive && !isCustom && <Check className="h-3 w-3 text-white stroke-[3]" />}
                  {isCustom && <Edit3 className="h-3 w-3" />}
                  <span>{preset.label}</span>
                </button>
              );
            })}

            {/* Custom Button */}
            {!presets.some((p) => p.id === "custom") && (
              <button
                onClick={() => setShowCustomModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-white/10 bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] ml-auto transition-colors"
              >
                <Edit3 className="h-3 w-3" />
                <span>Custom</span>
              </button>
            )}
          </div>

          {/* Formatted Input Display Box */}
          <div className="px-3 py-2 rounded-xl bg-black border border-white/10 text-xs font-mono text-zinc-200 overflow-x-auto whitespace-pre">
            {formattedDisplay}
          </div>
        </>
      )}
    </div>
  );
}
