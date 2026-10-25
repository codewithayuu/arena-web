'use client';

import React, { useState } from 'react';
import {
  Play,
  Send,
  Tag,
  Building2,
  Expand,
  Copy,
  Check,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import SmoothButton from '@/components/smoothui/smooth-button';
import Badge from '@/components/smoothui/badge';
import Select from '@/components/smoothui/select';
import { LanguageIcon } from '@/components/dsa/language-icons';
import { SimpleTooltip } from '@/components/animate-ui/tooltip';

const STARTER_CODES: Record<string, string> = {
  Java: `class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int totalWater = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    totalWater += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    totalWater += rightMax - height[right];
                }
                right--;
            }
        }
        return totalWater;
    }
}`,
  Python: `class Solution:
    def trap(self, height: list[int]) -> int:
        if not height:
            return 0
        left, right = 0, len(height) - 1
        left_max, right_max = height[left], height[right]
        water = 0

        while left < right:
            if left_max < right_max:
                left += 1
                left_max = max(left_max, height[left])
                water += left_max - height[left]
            else:
                right -= 1
                right_max = max(right_max, height[right])
                water += right_max - height[right]

        return water`,
  'C++': `class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        if (n == 0) return 0;
        int left = 0, right = n - 1;
        int leftMax = 0, rightMax = 0, water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};`,
  JavaScript: `var trap = function(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }
    return water;
};`,
};

const TEST_CASES = [
  { id: 1, label: 'Case 1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
  { id: 2, label: 'Case 2', input: '[4,2,0,3,2,5]', expected: '9' },
  { id: 3, label: 'Case 3', input: '[3,0,2,0,4]', expected: '7' },
  { id: 4, label: 'Case 4', input: '[0,2,0]', expected: '0' },
  { id: 5, label: 'Case 5', input: '[5,4,1,2]', expected: '1' },
];

export function CodeCompiler() {
  const [selectedLanguage, setSelectedLanguage] = useState<'Java' | 'Python' | 'C++' | 'JavaScript'>('Java');
  const [code, setCode] = useState<string>(STARTER_CODES.Java);
  const [activeTab, setActiveTab] = useState<'testcases' | 'output' | 'feedback'>('testcases');
  const [selectedCaseId, setSelectedCaseId] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'accepted' | 'evaluating';
    runtime: string;
    memory: string;
    output: string;
    passed: boolean;
  } | null>(null);

  // Hints state
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  const handleLanguageChange = (lang: 'Java' | 'Python' | 'C++' | 'JavaScript') => {
    setSelectedLanguage(lang);
    setCode(STARTER_CODES[lang] || '');
  };

  const copyInput = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHint = (num: number) => {
    setOpenHints((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const handleRun = () => {
    setIsRunning(true);
    setActiveTab('output');
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'accepted',
        runtime: '1 ms',
        memory: '42.4 MB',
        output: '6',
        passed: true,
      });
    }, 600);
  };

  const selectedCase = TEST_CASES.find((c) => c.id === selectedCaseId) || TEST_CASES[0];

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-card overflow-hidden shadow-lg">
      {/* Problem Header */}
      <div className="p-4 sm:p-5 border-b border-border space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Trapping Rain Water
            </h3>
            <Badge variant="destructive" size="sm">
              Hard
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <SimpleTooltip content="Fullscreen">
              <SmoothButton
                size="icon-sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                <Expand className="w-4 h-4" />
              </SmoothButton>
            </SimpleTooltip>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Tag className="w-3 h-3" />
            <span>Topics: Array, Two Pointers, Dynamic Programming, Stack</span>
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Building2 className="w-3 h-3" />
            <span>Companies: Amazon, Google, Meta, Microsoft</span>
          </button>
        </div>

        {/* Problem Statement */}
        <div className="pt-2 text-sm text-foreground/90 space-y-3 leading-relaxed">
          <p>
            Given <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary font-semibold">n</code> non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.
          </p>

          {/* Example 1 */}
          <div className="rounded-lg border border-border/80 bg-background/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground uppercase tracking-wider">Example 1</span>
              <SmoothButton
                size="xs"
                variant="ghost"
                onClick={() => copyInput('[0,1,0,2,1,0,1,3,2,1,2,1]')}
                className="gap-1 text-muted-foreground hover:text-foreground h-auto py-1 px-2"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy input'}</span>
              </SmoothButton>
            </div>
            <div className="text-xs font-mono bg-muted/40 p-2.5 rounded-md border border-border/40 space-y-1">
              <div><strong className="text-muted-foreground font-sans">Input:</strong> height = [0,1,0,2,1,0,1,3,2,1,2,1]</div>
              <div><strong className="text-muted-foreground font-sans">Output:</strong> 6</div>
              <div className="text-muted-foreground font-sans pt-1">
                <strong>Explanation:</strong> The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Header */}
      <div className="flex flex-col items-stretch justify-between gap-2 border-b border-border bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Code Editor</span>
        </div>

        {/* Language selector */}
        <div className="w-full min-w-0 sm:w-[180px] sm:shrink-0">
          <Select
            value={selectedLanguage}
            onValueChange={(val) => handleLanguageChange(val as any)}
            options={[
              { value: "Java", label: "Java (OpenJDK 17)" },
              { value: "Python", label: "Python (3.11)" },
              { value: "C++", label: "C++ (GCC 12)" },
              { value: "JavaScript", label: "JavaScript (Node 20)" },
            ]}
            size="sm"
            className="h-8 text-xs font-medium"
          />
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative bg-zinc-950 text-zinc-100 font-mono text-xs">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full bg-transparent p-4 font-mono text-xs leading-relaxed outline-none resize-none border-none text-zinc-200 selection:bg-primary/30"
        />
      </div>

      {/* Console & Test Runner Bar */}
      <div className="border-t border-border bg-background">
        {/* Tab Row & Action Buttons */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <SmoothButton
              size="xs"
              variant={activeTab === 'testcases' ? 'soft' : 'ghost'}
              onClick={() => setActiveTab('testcases')}
              className={activeTab === 'testcases' ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}
            >
              Test Cases
            </SmoothButton>
            <SmoothButton
              size="xs"
              variant={activeTab === 'output' ? 'soft' : 'ghost'}
              onClick={() => setActiveTab('output')}
              className={activeTab === 'output' ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}
            >
              Output
            </SmoothButton>
            <SmoothButton
              size="xs"
              variant={activeTab === 'feedback' ? 'soft' : 'ghost'}
              onClick={() => setActiveTab('feedback')}
              className={activeTab === 'feedback' ? 'font-semibold' : 'text-muted-foreground hover:text-foreground'}
            >
              Feedback
            </SmoothButton>
          </div>

          <div className="flex items-center gap-2">
            <SmoothButton
              type="button"
              size="sm"
              variant="outline"
              color="neutral"
              onClick={handleRun}
              disabled={isRunning}
              loading={isRunning}
              className="gap-1.5 font-bold shadow-sm border-[#1E1E2E] bg-[#14141F] text-slate-200 hover:bg-[#1E1E2E] hover:text-white"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Run</span>
            </SmoothButton>
            <SmoothButton
              type="button"
              size="sm"
              variant="solid"
              color="accent"
              onClick={handleRun}
              disabled={isRunning}
              loading={isRunning}
              className="gap-1.5 font-bold shadow-sm bg-[#FF1018] text-white hover:bg-[#E00E15]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit</span>
            </SmoothButton>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 text-xs">
          {activeTab === 'testcases' && (
            <div className="space-y-3">
              {/* Test Case Selection Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {TEST_CASES.map((tc) => (
                  <button
                    key={tc.id}
                    onClick={() => setSelectedCaseId(tc.id)}
                    className={`px-3 py-1 rounded-md font-medium text-xs whitespace-nowrap transition-colors ${
                      selectedCaseId === tc.id
                        ? 'bg-primary/15 text-primary border border-primary/30 font-semibold'
                        : 'bg-muted/60 text-muted-foreground hover:bg-muted border border-transparent'
                    }`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>

              {/* Selected Test Case Inputs */}
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium">height =</span>
                  <div className="font-mono bg-background p-2 rounded border border-border/60 text-foreground">
                    {selectedCase.input}
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground font-medium">Expected Output:</span>
                  <div className="font-mono bg-background p-2 rounded border border-border/60 text-foreground">
                    {selectedCase.expected}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'output' && (
            <div className="space-y-3">
              {executionResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accepted</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
                    <span>Runtime: <strong className="text-foreground">{executionResult.runtime}</strong></span>
                    <span>Memory: <strong className="text-foreground">{executionResult.memory}</strong></span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 font-mono space-y-1">
                    <div className="text-muted-foreground">Your Output: <span className="text-foreground font-bold">{executionResult.output}</span></div>
                    <div className="text-muted-foreground">Expected: <span className="text-foreground font-bold">6</span></div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  Click &quot;Run&quot; or &quot;Submit&quot; to test your code against all test cases.
                </div>
              )}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="py-4 text-xs text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Time Complexity: O(n)</p>
              <p>Two-pointer approach traverses each element at most once.</p>
              <p className="font-medium text-foreground pt-1">Space Complexity: O(1)</p>
              <p>Only constant extra space used for pointers and max tracking variables.</p>
            </div>
          )}
        </div>
      </div>

      {/* Hints Accordion */}
      <div className="border-t border-border p-4 bg-muted/10 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Need a hint?
        </h4>

        {/* Hint 1 */}
        <div className="rounded-lg border border-border bg-background overflow-hidden">
          <button
            type="button"
            onClick={() => toggleHint(1)}
            className="flex items-center justify-between w-full p-3 text-xs font-semibold hover:bg-muted/40 transition-colors text-left"
          >
            <span>Hint 1: Basic concept</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                openHints[1] ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openHints[1] && (
            <div className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
              For every index <code className="text-primary font-mono">i</code>, the trapped water is equal to <code className="text-primary font-mono">min(left_max[i], right_max[i]) - height[i]</code> (if positive).
            </div>
          )}
        </div>

        {/* Hint 2 */}
        <div className="rounded-lg border border-border bg-background overflow-hidden">
          <button
            type="button"
            onClick={() => toggleHint(2)}
            className="flex items-center justify-between w-full p-3 text-xs font-semibold hover:bg-muted/40 transition-colors text-left"
          >
            <span>Hint 2: Precomputation</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                openHints[2] ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openHints[2] && (
            <div className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
              Can we precalculate the left maximum and right maximum for all bars using prefix and suffix maximum arrays? This gives an O(n) time and O(n) space solution.
            </div>
          )}
        </div>

        {/* Hint 3 */}
        <div className="rounded-lg border border-border bg-background overflow-hidden">
          <button
            type="button"
            onClick={() => toggleHint(3)}
            className="flex items-center justify-between w-full p-3 text-xs font-semibold hover:bg-muted/40 transition-colors text-left"
          >
            <span>Hint 3: Optimal O(1) Space</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                openHints[3] ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openHints[3] && (
            <div className="p-3 pt-0 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
              Notice that we only need the smaller of the two bounds. Using two pointers starting at both ends (<code className="text-primary font-mono">left=0, right=n-1</code>), we can always advance the pointer with the smaller height, achieving O(1) space!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
