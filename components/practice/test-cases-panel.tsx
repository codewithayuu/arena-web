"use client";

import React, { useState } from "react";
import {
  Terminal,
  Code2,
  Sparkles,
  Zap,
  Play,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from "lucide-react";
import { PracticeProblem, TestCase } from "@/lib/practice-data";

interface TestCasesPanelProps {
  problem: PracticeProblem;
  userCode: string;
}

export function TestCasesPanel({ problem, userCode }: TestCasesPanelProps) {
  const [activeTab, setActiveTab] = useState<"cases" | "output" | "feedback">(
    "cases"
  );
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [customInputs, setCustomInputs] = useState<Record<number, string>>({});
  const [runStatus, setRunStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<boolean>(false);

  const currentCase = problem.testCases[selectedCaseIdx] || problem.testCases[0];
  const inputValue = customInputs[selectedCaseIdx] ?? currentCase.input;

  // Parse input array for visualization
  const parsedArray = React.useMemo(() => {
    try {
      const arr = JSON.parse(inputValue);
      if (Array.isArray(arr)) return arr;
    } catch {
      // ignore
    }
    return currentCase.parsedInput;
  }, [inputValue, currentCase.parsedInput]);

  // Simulate Move Zeroes execution
  const simulatedOutput = React.useMemo(() => {
    const copy = [...parsedArray];
    let insertPos = 0;
    for (let i = 0; i < copy.length; i++) {
      if (copy[i] !== 0) {
        const temp = copy[insertPos];
        copy[insertPos] = copy[i];
        copy[i] = temp;
        insertPos++;
      }
    }
    return copy;
  }, [parsedArray]);

  const handleRun = () => {
    setRunStatus("running");
    setActiveTab("output");
    setTimeout(() => {
      setRunStatus("success");
    }, 400);
  };

  const handleEvaluate = () => {
    setEvaluating(true);
    setActiveTab("feedback");
    setTimeout(() => {
      setEvaluating(false);
      setEvalResult(true);
    }, 500);
  };

  const handleSubmit = () => {
    setRunStatus("running");
    setActiveTab("output");
    setTimeout(() => {
      setRunStatus("success");
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-black text-zinc-200 border-t border-white/10 overflow-hidden select-none">
      {/* Top Action & Navigation Bar */}
      <div className="h-11 border-b border-white/10 bg-[#08080a] flex items-center justify-between px-3 flex-shrink-0">
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("cases")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "cases"
                ? "bg-white/10 text-white border-b-2 border-[#FF1018]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Test Cases</span>
          </button>

          <button
            onClick={() => setActiveTab("output")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "output"
                ? "bg-white/10 text-white border-b-2 border-[#FF1018]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === "feedback"
                ? "bg-white/10 text-white border-b-2 border-[#FF1018]"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Feedback</span>
          </button>
        </div>

        {/* Right Runner Buttons: Evaluate, Run, Submit */}
        <div className="flex items-center gap-2">
          {/* Evaluate (Amber) */}
          <button
            onClick={handleEvaluate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white font-semibold text-xs border border-white/10 transition-colors shadow-xs cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Evaluate</span>
          </button>

          {/* Run (Red Action Only) */}
          <button
            onClick={handleRun}
            disabled={runStatus === "running"}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
            <span>{runStatus === "running" ? "Running..." : "Run"}</span>
          </button>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF1018] hover:bg-[#E00E15] text-white font-semibold text-xs transition-colors shadow-lg shadow-red-500/25 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Panel Body Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar text-xs bg-black">
        {activeTab === "cases" && (
          <div className="space-y-3.5">
            {/* Case Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {problem.testCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCaseIdx === idx
                      ? "border border-white/20 bg-white/10 text-white shadow-xs"
                      : "border border-white/5 bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Case {tc.id}
                </button>
              ))}
            </div>

            {/* Input Parameter Label & Visualize Button */}
            <div className="flex items-center justify-between text-zinc-400 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-zinc-500 tracking-wider">
                  INPUT
                </span>

                <button
                  onClick={() => setShowVisualizer(!showVisualizer)}
                  className="flex items-center gap-1 rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-zinc-300 hover:text-white transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  <span>Visualize</span>
                </button>
              </div>

              <span className="font-mono text-zinc-500 text-[11px]">
                nums: array
              </span>
            </div>

            {/* Editable Input Field */}
            <div className="rounded-xl border border-white/10 bg-[#08080a] p-2.5">
              <input
                type="text"
                value={inputValue}
                onChange={(e) =>
                  setCustomInputs({
                    ...customInputs,
                    [selectedCaseIdx]: e.target.value,
                  })
                }
                className="w-full bg-transparent font-mono text-zinc-200 text-xs focus:outline-none"
              />
            </div>

            {/* Interactive Array Visualizer */}
            {showVisualizer && (
              <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-2">
                <div className="text-[10px] uppercase font-bold text-zinc-500 font-mono">
                  Array Elements:
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {parsedArray.map((val: number, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-1 flex-shrink-0"
                    >
                      <span className="text-[10px] font-mono text-zinc-500">
                        {idx}
                      </span>
                      <div
                        className={`w-9 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-semibold shadow-inner transition-colors ${
                          val === 0
                            ? "bg-white/[0.03] border border-white/10 text-zinc-500"
                            : "bg-red-500/15 border border-red-500/40 text-red-400 shadow-[0_0_8px_rgba(255,16,24,0.2)]"
                        }`}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Output Tab */}
        {activeTab === "output" && (
          <div className="space-y-4">
            {runStatus === "running" ? (
              <div className="py-8 text-center text-zinc-400 space-y-2">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-[#FF1018] border-t-transparent rounded-full" />
                <p className="text-xs">Executing test cases...</p>
              </div>
            ) : runStatus === "success" ? (
              <div className="space-y-3.5">
                {/* Result header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">
                      Accepted
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
                    <span>
                      Runtime:{" "}
                      <strong className="text-zinc-200">2 ms</strong>
                    </span>
                    <span>
                      Memory:{" "}
                      <strong className="text-zinc-200">19.4 MB</strong>
                    </span>
                  </div>
                </div>

                {/* Test case comparison */}
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">
                      Input
                    </div>
                    <div className="font-mono text-zinc-200">{inputValue}</div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase font-mono">
                      Your Output
                    </div>
                    <div className="font-mono text-zinc-200">
                      {JSON.stringify(simulatedOutput)}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-1.5">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase font-mono">
                      Expected Output
                    </div>
                    <div className="font-mono text-zinc-200">
                      {currentCase.output}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500">
                Click <strong className="text-white">Run</strong> to execute your code against test cases.
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            {evaluating ? (
              <div className="py-8 text-center text-zinc-400 space-y-2">
                <div className="animate-spin inline-block w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full" />
                <p className="text-xs">Evaluating approach and complexity...</p>
              </div>
            ) : evalResult ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      Optimal Evaluation Score: 10/10
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px]">
                      Optimal Solution
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Your code correctly utilizes the in-place two-pointer technique. Non-zero values are shifted forward while zeroes drift to the tail without requiring duplicate array allocations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-1">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold font-mono">
                      Time Complexity
                    </div>
                    <div className="font-mono font-bold text-zinc-200">
                      O(n) - Linear
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#08080a] p-3 space-y-1">
                    <div className="text-[10px] text-zinc-500 uppercase font-bold font-mono">
                      Space Complexity
                    </div>
                    <div className="font-mono font-bold text-zinc-200">
                      O(1) - Constant
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500">
                Click <strong className="text-amber-400">Evaluate</strong> to receive real-time AI critique and complexity evaluation.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
