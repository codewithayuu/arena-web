"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PracticeProblem,
  AM_300_PROBLEMS,
  getAdjacentPracticeProblems,
} from "@/lib/practice-data";
import { PracticeHeader } from "./practice-header";
import { ProblemPanel } from "./problem-panel";
import { CodeEditor } from "./code-editor";
import { TestCasesPanel } from "./test-cases-panel";
import { ProblemListDrawer } from "./problem-list-drawer";

interface PracticeWorkspaceProps {
  problem: PracticeProblem;
}

export function PracticeWorkspace({ problem }: PracticeWorkspaceProps) {
  const router = useRouter();

  // Drawers
  const [problemListOpen, setProblemListOpen] = useState(false);

  // Split pane dimensions (percentages)
  const [leftWidthPercent, setLeftWidthPercent] = useState(46);
  const [editorHeightPercent, setEditorHeightPercent] = useState(62);

  // Language & Code state
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(problem.starterCode["cpp"] || "");

  // Update code when language changes
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang] || "");
  };

  // Nav adjacent
  const { prev: prevProblem, next: nextProblem } =
    getAdjacentPracticeProblems(problem.slug);

  // Random problem handler
  const handleRandomProblem = () => {
    const remaining = AM_300_PROBLEMS.filter((p) => p.slug !== problem.slug);
    const randomPick =
      remaining[Math.floor(Math.random() * remaining.length)] ||
      AM_300_PROBLEMS[0];
    router.push(`/practice/dsa/${randomPick.slug}?list=am-300`);
  };

  // Horizontal resizing (Left/Right panels)
  const handleHorizontalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const newLeft = (moveEvent.clientX / windowWidth) * 100;
      if (newLeft >= 25 && newLeft <= 75) {
        setLeftWidthPercent(newLeft);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // Vertical resizing (Editor vs TestCases)
  const handleVerticalMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startPercent = editorHeightPercent;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const containerHeight = window.innerHeight - 48; // minus header
      const deltaPercent = (deltaY / containerHeight) * 100;
      const newHeight = startPercent + deltaPercent;
      if (newHeight >= 30 && newHeight <= 80) {
        setEditorHeightPercent(newHeight);
      }
    };
    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Top Header */}
      <PracticeHeader
        problem={problem}
        nextProblem={nextProblem}
        prevProblem={prevProblem}
        onOpenProblemList={() => setProblemListOpen(true)}
        onRandomProblem={handleRandomProblem}
      />

      {/* Main Split Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Problem Details Panel */}
        <div
          style={{ width: `${leftWidthPercent}%` }}
          className="h-full flex-shrink-0 flex flex-col overflow-hidden"
        >
          <ProblemPanel problem={problem} />
        </div>

        {/* Resizable Divider (Vertical) */}
        <div
          onMouseDown={handleHorizontalMouseDown}
          className="w-1.5 hover:w-2 bg-[#0B0B13] hover:bg-[#1E1E2E] cursor-col-resize transition-all duration-150 flex items-center justify-center group z-20 flex-shrink-0 select-none border-x border-[#1E1E2E]"
        >
          <div className="w-0.5 h-8 bg-zinc-600 rounded-full group-hover:bg-[#38BDF8]" />
        </div>

        {/* Right: Code Editor & Test Cases */}
        <div
          style={{ width: `${100 - leftWidthPercent}%` }}
          className="h-full flex-1 flex flex-col overflow-hidden bg-background"
        >
          {/* Top of Right: Code Editor */}
          <div
            style={{ height: `${editorHeightPercent}%` }}
            className="flex-shrink-0 flex flex-col overflow-hidden"
          >
            <CodeEditor
              problem={problem}
              language={language}
              onLanguageChange={handleLanguageChange}
              code={code}
              onCodeChange={setCode}
            />
          </div>

          {/* Resizable Divider (Horizontal) */}
          <div
            onMouseDown={handleVerticalMouseDown}
            className="h-1.5 hover:h-2 bg-[#0B0B13] hover:bg-[#1E1E2E] cursor-row-resize transition-all duration-150 flex items-center justify-center group z-20 flex-shrink-0 select-none border-y border-[#1E1E2E]"
          >
            <div className="h-0.5 w-8 bg-zinc-600 rounded-full group-hover:bg-[#38BDF8]" />
          </div>

          {/* Bottom of Right: Test Cases & Execution Runner */}
          <div
            style={{ height: `${100 - editorHeightPercent}%` }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TestCasesPanel problem={problem} userCode={code} />
          </div>
        </div>
      </div>

      {/* Slide-over Drawers */}
      <ProblemListDrawer
        isOpen={problemListOpen}
        onClose={() => setProblemListOpen(false)}
        currentSlug={problem.slug}
      />

    </div>
  );
}
