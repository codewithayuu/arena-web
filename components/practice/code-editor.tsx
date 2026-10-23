"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  AlignLeft,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Settings,
  Plus,
  X,
} from "lucide-react";
import { PracticeProblem } from "@/lib/practice-data";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { LanguageIcon } from "@/components/dsa/language-icons";

interface CodeEditorProps {
  problem: PracticeProblem;
  language: string;
  onLanguageChange: (lang: string) => void;
  code: string;
  onCodeChange: (newCode: string) => void;
}

const LANGUAGES = [
  { id: "cpp", name: "C++", label: "C++" },
  { id: "python", name: "Python", label: "Python 3" },
  { id: "java", name: "Java", label: "Java" },
  { id: "javascript", name: "JavaScript", label: "JavaScript" },
  { id: "typescript", name: "TypeScript", label: "TypeScript" },
  { id: "go", name: "Go", label: "Go" },
  { id: "csharp", name: "C#", label: "C#" },
];

export function CodeEditor({
  problem,
  language,
  onLanguageChange,
  code,
  onCodeChange,
}: CodeEditorProps) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tabs, setTabs] = useState<string[]>(["Solution 1"]);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [tabCodes, setTabCodes] = useState<Record<number, string>>({
    0: code,
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync initial code
  useEffect(() => {
    setTabCodes((prev) => ({
      ...prev,
      [activeTabIdx]: code,
    }));
  }, [code, activeTabIdx]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    const starter = problem.starterCode[language] || "";
    onCodeChange(starter);
    setTabCodes((prev) => ({ ...prev, [activeTabIdx]: starter }));
  };

  const addTab = () => {
    const newIdx = tabs.length;
    const newTitle = `Solution ${newIdx + 1}`;
    setTabs([...tabs, newTitle]);
    setTabCodes((prev) => ({
      ...prev,
      [newIdx]: problem.starterCode[language] || "",
    }));
    setActiveTabIdx(newIdx);
    onCodeChange(problem.starterCode[language] || "");
  };

  const handleSelectTab = (idx: number) => {
    setActiveTabIdx(idx);
    const existing = tabCodes[idx] ?? (problem.starterCode[language] || "");
    onCodeChange(existing);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const spaces = "    ";
      const newCode =
        target.value.substring(0, start) +
        spaces +
        target.value.substring(end);
      onCodeChange(newCode);
      setTabCodes((prev) => ({ ...prev, [activeTabIdx]: newCode }));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  const lineCount = Math.max(12, code.split("\n").length);
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  const currentLangObj =
    LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div className="h-full flex flex-col bg-[#0b0b0c] text-zinc-200 overflow-hidden select-none">
      {/* Editor Top Bar */}
      <div className="h-10 border-b border-white/10 bg-[#08080a] flex items-center justify-between px-3 flex-shrink-0">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <LanguageIcon language={currentLangObj.id} className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium">
              {currentLangObj.label}
            </span>
            <ChevronDown className="h-3 w-3 text-zinc-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute left-0 top-8 z-40 w-40 rounded-xl bg-[#08080a] border border-white/10 shadow-xl overflow-hidden p-1 space-y-0.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onLanguageChange(lang.id);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-xs text-left rounded-lg transition-colors flex items-center justify-between ${
                    language === lang.id
                      ? "bg-red-500/10 text-white font-semibold"
                      : "text-zinc-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <LanguageIcon language={lang.id} className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang.name}</span>
                  </div>
                  {language === lang.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF1018]" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex items-center gap-1">
          <SimpleTooltip content="Reset code to starter template">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Copy code">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Format code">
            <button
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
          </SimpleTooltip>

          <SimpleTooltip content="Editor Settings">
            <button
              className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      {/* Solution Tabs Row */}
      <div className="h-8 border-b border-white/10 bg-[#08080a] flex items-center px-2 gap-1 flex-shrink-0">
        {tabs.map((tabTitle, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectTab(idx)}
            className={`flex items-center gap-2 px-3 py-1 rounded-t-md text-xs font-medium cursor-pointer transition-colors border-b-2 ${
              activeTabIdx === idx
                ? "bg-white/10 text-white border-[#FF1018] font-semibold"
                : "text-zinc-400 hover:text-zinc-200 border-transparent hover:bg-white/5"
            }`}
          >
            <span>{tabTitle}</span>
          </div>
        ))}

        <SimpleTooltip content="Add another solution tab">
          <button
            onClick={addTab}
            className="p-1 text-zinc-500 hover:text-white rounded hover:bg-white/10 transition-colors ml-1"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 relative overflow-hidden flex bg-black">
        {/* Line Numbers Gutter */}
        <div className="w-10 sm:w-12 py-3 bg-black border-r border-white/5 text-right pr-2 text-zinc-600 font-mono text-xs select-none leading-relaxed flex-shrink-0">
          {lines.map((num) => (
            <div key={num} className="h-5 flex items-center justify-end">
              {num}
            </div>
          ))}
        </div>

        {/* Textarea Code Input */}
        <div className="flex-1 relative overflow-auto custom-scrollbar">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onCodeChange(e.target.value);
              setTabCodes((prev) => ({
                ...prev,
                [activeTabIdx]: e.target.value,
              }));
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className="w-full h-full min-h-[300px] p-3 bg-transparent text-white font-mono text-xs sm:text-[13px] leading-relaxed resize-none focus:outline-none selection:bg-red-500/30 selection:text-white whitespace-pre tab-4"
            style={{ tabSize: 4 }}
          />
        </div>
      </div>
    </div>
  );
}
