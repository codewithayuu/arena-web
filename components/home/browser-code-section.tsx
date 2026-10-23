"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Play, Terminal, ArrowRight, CheckCircle2, RotateCcw, Copy, Check } from "lucide-react";
import { SpecularButton } from "@/components/reactbits/specular-button";

const MonacoCodeEditor = dynamic(
  () => import("@/components/practice/monaco-code-editor").then((module) => module.MonacoCodeEditor),
  { ssr: false, loading: () => <div className="h-full bg-[#1E1E1E]" aria-label="Loading code editor" /> },
);

const CODE_SAMPLES: Record<string, { filename: string; code: string }> = {
  cpp: {
    filename: "solution.cpp",
    code: `// Move Zeroes - Two Pointer Pattern
#include <vector>
#include <iostream>
using namespace std;

void moveZeroes(vector<int>& nums) {
    int insertPos = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (nums[i] != 0) {
            swap(nums[insertPos++], nums[i]);
        }
    }
}

int main() {
    vector<int> nums = {0, 1, 0, 3, 12};
    moveZeroes(nums);
    cout << "Processed array: [ ";
    for (int x : nums) cout << x << " ";
    cout << "]" << endl;
    return 0;
}`,
  },
  python: {
    filename: "solution.py",
    code: `# Move Zeroes - Two Pointer Pattern
def move_zeroes(nums: list[int]) -> None:
    insert_pos = 0
    for i in range(len(nums)):
        if nums[i] != 0:
            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]
            insert_pos += 1

nums = [0, 1, 0, 3, 12]
move_zeroes(nums)
print(f"Processed array: {nums}")
`,
  },
  java: {
    filename: "Solution.java",
    code: `// Move Zeroes - Two Pointer Pattern
public class Solution {
    public static void moveZeroes(int[] nums) {
        int insertPos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                int temp = nums[insertPos];
                nums[insertPos++] = nums[i];
                nums[i] = temp;
            }
        }
    }
}
`,
  },
  javascript: {
    filename: "solution.js",
    code: `// Move Zeroes - Two Pointer Pattern
function moveZeroes(nums) {
    let insertPos = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
            insertPos++;
        }
    }
    return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));
`,
  },
};

export function BrowserCodeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [loadEditor, setLoadEditor] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("cpp");
  const [editorCode, setEditorCode] = useState<string>(CODE_SAMPLES.cpp.code);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || loadEditor) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadEditor(true);
        observer.disconnect();
      }
    }, { rootMargin: "500px 0px" });
    observer.observe(section);
    return () => observer.disconnect();
  }, [loadEditor]);

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
    setEditorCode(CODE_SAMPLES[lang].code);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section ref={sectionRef} className="w-full py-24 md:py-32 lg:py-36 relative overflow-hidden bg-transparent">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#FF1018]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center max-w-6xl mx-auto">
          {/* Left Column: Text & Features (Text on Left!) */}
          <div className="md:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF1018]/10 border border-[#FF1018]/30">
              <Terminal className="w-3.5 h-3.5 text-[#FF1018]" />
              <span className="text-xs font-bold tracking-wider uppercase text-[#FF3B41]">
                EDITOR PREVIEW
              </span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F4F3FC] tracking-tight leading-tight">
                Edit Sample Code in Your Browser
              </h2>
            </div>

            <p className="text-base text-[#94a3b8] leading-relaxed">
              Edit and copy sample code in this editor preview. Code execution is not configured here; use the practice workspace to run supported languages with the local runtime.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>Editable sample code in C++, Python, Java, and JavaScript</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8] flex-shrink-0 mt-0.5" />
                <span>Copy a sample and run it in the practice workspace</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#FF1018] flex-shrink-0 mt-0.5" />
                <span>Practice checks use the paired local runtime and are unofficial</span>
              </div>
            </div>

            {/* Specular Button CTA */}
            <div className="pt-3">
              <Link href="/practice/dsa-patterns">
                <SpecularButton
                  size="md"
                  radius={14}
                  lineColor="#FF3B41"
                  tint="#FF1018"
                  tintOpacity={0.16}
                  glow={1.4}
                >
                  <span>Open Practice Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </SpecularButton>
              </Link>
            </div>
          </div>

          {/* Right Column: In-Browser Monaco IDE Component (Editor on Right!) */}
          <div className="md:col-span-7">
            <div className="rounded-2xl bg-[#14141F] border border-[#1E1E2E] shadow-2xl overflow-hidden">
              {/* Top IDE Toolbar */}
              <div className="px-4 py-2.5 bg-[#10101A] border-b border-[#1E1E2E] flex flex-wrap items-center justify-between gap-3">
                {/* Left: Window Controls + Language Selector Tabs */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 pr-2 border-r border-[#1E1E2E]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF1018]/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  {/* Language Pills */}
                  <div className="flex items-center gap-1">
                    {(["cpp", "python", "java", "javascript"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => handleLangChange(lang)}
                        className={`px-2 py-0.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
                          activeLang === lang
                            ? "bg-[#1E1E2E] text-[#38BDF8] border border-[#0E7490]/40"
                            : "text-zinc-400 hover:text-white hover:bg-[#1E1E2E]/40"
                        }`}
                      >
                        {lang === "cpp" ? "C++" : lang === "javascript" ? "JS" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Filename + Action Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-500 hidden sm:inline-block mr-2">
                    {CODE_SAMPLES[activeLang].filename}
                  </span>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-[#14141F] hover:bg-[#1E1E2E] text-zinc-400 hover:text-white border border-[#1E1E2E] transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    disabled
                    aria-label="Code execution is unavailable in this editor preview"
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-semibold shadow-xs cursor-not-allowed"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Runner unavailable</span>
                  </button>
                </div>
              </div>

              {/* Monaco Editor Component */}
              <div className="h-[250px] sm:h-[280px] bg-[#1E1E1E]">
                {loadEditor ? (
                  <MonacoCodeEditor
                    language={activeLang}
                    value={editorCode}
                    onChange={(val) => setEditorCode(val || "")}
                    height="100%"
                  />
                ) : <div className="h-full bg-[#1E1E1E]" aria-label="Code editor loads when this section is near view" />}
              </div>

              {/* Terminal Output Area */}
              <div className="border-t border-[#1E1E2E] bg-[#09090E] p-3.5 text-xs font-mono">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#1E1E2E]/60 text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-[#38BDF8]" />
                    <span className="font-semibold text-zinc-300">Terminal Output</span>
                  </div>
                </div>

                <div className="py-1 text-zinc-500 text-[11px]">
                  Execution is unavailable in this preview. <Link href="/practice/dsa-patterns" className="text-[#FF3B41] font-semibold underline">Open the practice workspace</Link> to run supported code locally.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
