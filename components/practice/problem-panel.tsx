"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Lightbulb,
  BarChart3,
  PenSquare,
  MessageSquare,
  ExternalLink,
  Tag,
  Briefcase,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { PracticeProblem } from "@/lib/practice-data";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";
import { LanguageIcon } from "@/components/dsa/language-icons";

interface ProblemPanelProps {
  problem: PracticeProblem;
}

export function ProblemPanel({ problem }: ProblemPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "problem" | "solution" | "submissions" | "notes" | "discussion"
  >("problem");

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [showCompanies, setShowCompanies] = useState(false);
  const [expandedHints, setExpandedHints] = useState<Record<number, boolean>>({});
  const [notesText, setNotesText] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);
  const [notesError, setNotesError] = useState("");
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesLoadedFor, setNotesLoadedFor] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab !== "notes" || notesLoadedFor === problem.id) return;
    let cancelled = false;
    setNotesLoading(true);
    setNotesError("");
    fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load notes");
        if (!cancelled) {
          setNotesText(typeof data.content === "string" ? data.content : "");
          setNotesLoadedFor(problem.id);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setNotesError(error instanceof Error ? error.message : "Could not load notes");
      })
      .finally(() => {
        if (!cancelled) setNotesLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab, notesLoadedFor, problem.id]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleHint = (idx: number) => {
    setExpandedHints((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSaveNotes = async () => {
    setNotesError("");
    try {
      const response = await fetch(`/api/practice/${encodeURIComponent(problem.id)}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: notesText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save notes");
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (error) {
      setNotesError(error instanceof Error ? error.message : "Could not save notes");
    }
  };

  return (
    <div className="h-full flex flex-col bg-black text-zinc-200 border-r border-white/10 overflow-hidden">
      {/* Top Tab Bar */}
      <div className="h-10 border-b border-white/10 bg-[#08080a] flex items-center px-2 gap-1 flex-shrink-0 select-none">
        <button
          onClick={() => setActiveTab("problem")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
            activeTab === "problem"
              ? "bg-white/10 text-white border-b-2 border-[#FF1018] shadow-xs"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Problem</span>
        </button>

        <button
          onClick={() => setActiveTab("solution")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
            activeTab === "solution"
              ? "bg-white/10 text-white border-b-2 border-[#FF1018] shadow-xs"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
          <span>Solution</span>
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
            activeTab === "submissions"
              ? "bg-white/10 text-white border-b-2 border-[#FF1018] shadow-xs"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Submissions</span>
        </button>

        <button
          onClick={() => setActiveTab("notes")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
            activeTab === "notes"
              ? "bg-white/10 text-white border-b-2 border-[#FF1018] shadow-xs"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <PenSquare className="h-3.5 w-3.5 text-purple-400" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => setActiveTab("discussion")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
            activeTab === "discussion"
              ? "bg-white/10 text-white border-b-2 border-[#FF1018] shadow-xs"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
          <span>Discussion</span>
        </button>
      </div>

      {/* Tab Body Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar text-sm bg-black">
        {activeTab === "problem" && (
          <div className="space-y-4 max-w-2xl">
            {/* Title & External Link */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {problem.title}
              </h1>

              {problem.externalLink && (
                <SimpleTooltip content="View on LeetCode">
                  <a
                    href={problem.externalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-500 hover:text-amber-400 transition-colors p-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </SimpleTooltip>
              )}
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border ${
                problem.difficulty.toLowerCase() === "easy"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : problem.difficulty.toLowerCase() === "medium"
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}>
                {problem.difficulty}
              </span>

              {/* Topics dropdown toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowTopics(!showTopics)}
                  className="flex items-center gap-1 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Tag className="h-3 w-3 text-zinc-400" />
                  <span>Topics</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400 ml-0.5" />
                </button>

                {showTopics && (
                  <div className="absolute left-0 top-8 z-30 flex flex-wrap gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl min-w-[200px]">
                    {problem.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200 border border-zinc-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Companies dropdown toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowCompanies(!showCompanies)}
                  className="flex items-center gap-1 rounded-md bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Briefcase className="h-3 w-3 text-zinc-400" />
                  <span>Companies</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400 ml-0.5" />
                </button>

                {showCompanies && (
                  <div className="absolute left-0 top-8 z-30 flex flex-wrap gap-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl min-w-[220px]">
                    {problem.companies.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-200 border border-zinc-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="text-zinc-300 text-sm leading-relaxed space-y-3 pt-1">
              <p>
                Given an integer array{" "}
                <code className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-200 font-mono text-xs border border-zinc-700/60">
                  nums
                </code>
                , move all{" "}
                <code className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-zinc-200 font-mono text-xs border border-zinc-700/60">
                  0
                </code>
                &apos;s to the end of it while maintaining the relative order of the
                non-zero elements.
              </p>

              <p>
                <strong className="font-semibold text-white">Note</strong> that
                you must do this in-place without making a copy of the array.
              </p>
            </div>

            {/* Examples with Visualizer Arrays */}
            <div className="space-y-4 pt-2">
              {problem.examples.map((ex) => (
                <div key={ex.id} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Example {ex.id}:
                  </h3>

                  <div className="rounded-xl border border-zinc-800/90 bg-[#121214] p-3.5 space-y-3.5 shadow-xs">
                    {/* Input Block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-sky-950/70 border border-sky-800/60 px-1.5 py-0.5 text-[11px] font-bold text-sky-400">
                            Input
                          </span>
                          <span className="font-mono text-zinc-300 font-medium">
                            {ex.inputName} = {ex.inputValue}
                          </span>
                        </div>

                        <SimpleTooltip content="Copy input">
                          <button
                            onClick={() =>
                              handleCopy(ex.inputValue, `in-${ex.id}`)
                            }
                            className="p-1 text-zinc-500 hover:text-zinc-200 rounded transition-colors"
                          >
                            {copiedId === `in-${ex.id}` ? (
                              <Check className="h-3.5 w-3.5 text-cyan-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </SimpleTooltip>
                      </div>

                      {/* Visual Array Cells for Input */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {ex.inputArray.map((val, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-1 flex-shrink-0"
                          >
                            <span className="text-[10px] font-mono text-zinc-500">
                              {idx}
                            </span>
                            <div className="w-9 h-8 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-mono text-xs font-semibold text-zinc-200 shadow-inner">
                              {val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Output Block */}
                    <div className="space-y-2 pt-1 border-t border-white/5">
                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-white/10 border border-white/15 px-1.5 py-0.5 text-[11px] font-bold text-white">
                            Output
                          </span>
                          <span className="font-mono text-zinc-300 font-medium">
                            {ex.outputValue}
                          </span>
                        </div>

                        <SimpleTooltip content="Copy output">
                          <button
                            onClick={() =>
                              handleCopy(ex.outputValue, `out-${ex.id}`)
                            }
                            className="p-1 text-zinc-500 hover:text-white rounded transition-colors"
                          >
                            {copiedId === `out-${ex.id}` ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </SimpleTooltip>
                      </div>

                      {/* Visual Array Cells for Output */}
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {ex.outputArray.map((val, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-1 flex-shrink-0"
                          >
                            <span className="text-[10px] font-mono text-zinc-500">
                              {idx}
                            </span>
                            <div className="w-9 h-8 rounded-lg bg-[#08080a] border border-white/10 flex items-center justify-center font-mono text-xs font-semibold text-white shadow-inner">
                              {val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Constraints:
              </h3>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-zinc-300 font-mono">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Follow up */}
            {problem.followUp && (
              <div className="pt-2 text-xs text-zinc-300">
                <span className="font-semibold text-white">Follow up:</span>{" "}
                {problem.followUp}
              </div>
            )}

            {/* Hints Accordion */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="pt-3 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Hints:
                </h3>
                {problem.hints.map((hint, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-800 bg-zinc-900/60 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleHint(i)}
                      className="w-full px-3 py-2 text-xs font-semibold text-left text-zinc-300 hover:text-white flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                        <span>Hint {i + 1}</span>
                      </div>
                      {expandedHints[i] ? (
                        <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                      )}
                    </button>
                    {expandedHints[i] && (
                      <div className="px-3 pb-2.5 pt-1 text-xs text-zinc-400 border-t border-zinc-800/60">
                        {hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Solution Tab */}
        {activeTab === "solution" && (
          <div className="space-y-5 max-w-2xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                {problem.solution.approach}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                  Time: {problem.solution.timeComplexity}
                </span>
                <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-xs font-semibold text-zinc-300">
                  Space: {problem.solution.spaceComplexity}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#08080a] p-4 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" /> Intuition
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {problem.solution.intuition}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-200">
                Detailed Walkthrough
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {problem.solution.explanation}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-black p-3 space-y-2">
              <div className="text-xs font-bold text-zinc-400 font-mono flex items-center gap-1.5">
                <LanguageIcon language="cpp" className="w-3.5 h-3.5" />
                <span>C++ Implementation:</span>
              </div>
              <pre className="text-xs font-mono text-zinc-200 overflow-x-auto p-3 bg-[#08080a] border border-white/5 rounded-lg">
                {problem.solution.code.cpp}
              </pre>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-base font-bold text-white">Your Submissions</h2>
            <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
              <div className="p-3.5 bg-zinc-900/60 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#38BDF8] font-bold">Accepted</span>
                    <span className="text-zinc-400 font-mono flex items-center gap-1">
                      • <LanguageIcon language="cpp" className="w-3 h-3" /> C++
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    Just now • Runtime: 2 ms (Beats 94.2%)
                  </div>
                </div>
                <div className="text-right font-mono text-zinc-400 text-xs">
                  19.4 MB
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">My Notes</h2>
              <button
                onClick={handleSaveNotes}
                disabled={notesLoading || notesLoadedFor !== problem.id}
                className="px-3 py-1 rounded bg-[#FF1018] hover:bg-[#E00E15] text-white font-semibold text-xs transition-colors"
              >
                {notesSaved ? "Saved!" : "Save Notes"}
              </button>
            </div>
            {notesError && <p role="status" className="text-xs text-red-400">{notesError}</p>}
            {notesLoading && <p className="text-xs text-zinc-500">Loading notes…</p>}
            <textarea
              value={notesText}
              onChange={(e) => { setNotesText(e.target.value); setNotesSaved(false); }}
              placeholder={`Write your personal notes for ${problem.title}...`}
              className="w-full h-48 rounded-xl border border-white/10 bg-black p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 font-mono leading-relaxed resize-none"
            />
          </div>
        )}

        {/* Discussion Tab */}
        {activeTab === "discussion" && (
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-base font-bold text-white">Discussion (34)</h2>
            <div className="rounded-xl border border-zinc-800 p-3.5 bg-zinc-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-200">
                  Super clean O(n) two-pointer with visual explanation
                </span>
                <span className="text-[10px] text-zinc-500">12 hours ago</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Rather than thinking of &apos;moving zeroes to the end&apos;,
                always think of &apos;swapping non-zeroes forward&apos;. That way
                zeroes naturally drift to the tail.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
