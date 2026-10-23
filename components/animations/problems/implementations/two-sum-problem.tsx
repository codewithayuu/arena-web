"use client";

import React from "react";
import {
  ProblemViewerShell,
  ProblemApproach,
  ProblemStep,
} from "../problem-viewer-shell";
import { PresetOption } from "../input-presets-panel";
import { ArrayVisualizer, VisualArrayElement, VisualPointer } from "../array-visualizer";

// ==========================================
// 1. CODE TEMPLATES (7 LANGUAGES)
// ==========================================

const BRUTE_FORCE_TEMPLATES = {
  python: {
    language: "python",
    code: `def twoSum(nums, target):
    # Check every pair of elements
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    lineMap: { "-": [1], pick_i: [3], check_pair: [4, 5], return_result: [6], complete: [7] },
  },
  java: {
    language: "java",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Check every pair of elements
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
    lineMap: { "-": [2], pick_i: [4], check_pair: [5, 6], return_result: [7], complete: [11] },
  },
  cpp: {
    language: "cpp",
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Check every pair of elements
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};`,
    lineMap: { "-": [3], pick_i: [5], check_pair: [6, 7], return_result: [8], complete: [12] },
  },
  csharp: {
    language: "csharp",
    code: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // Check every pair of elements
        for (int i = 0; i < nums.Length; i++) {
            for (int j = i + 1; j < nums.Length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}`,
    lineMap: { "-": [2], pick_i: [4], check_pair: [5, 6], return_result: [7], complete: [11] },
  },
  go: {
    language: "go",
    code: `func twoSum(nums []int, target int) []int {
    // Check every pair of elements
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i] + nums[j] == target {
                return []int{i, j}
            }
        }
    }
    return []int{}
}`,
    lineMap: { "-": [1], pick_i: [3], check_pair: [4, 5], return_result: [6], complete: [10] },
  },
  javascript: {
    language: "javascript",
    code: `function twoSum(nums, target) {
    // Check every pair of elements
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
    lineMap: { "-": [1], pick_i: [3], check_pair: [4, 5], return_result: [6], complete: [10] },
  },
  typescript: {
    language: "typescript",
    code: `function twoSum(nums: number[], target: number): number[] {
    // Check every pair of elements
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
    lineMap: { "-": [1], pick_i: [3], check_pair: [4, 5], return_result: [6], complete: [10] },
  },
};

const ONE_PASS_TEMPLATES = {
  python: {
    language: "python",
    code: `def twoSum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        # Check if complement was seen before
        if complement in seen:
            return [seen[complement], i]

        # Store current value and its index
        seen[num] = i

    return []`,
    lineMap: { "-": [1], init_map: [2], check_map: [4, 8], return_result: [9], put_map: [12], complete: [14] },
  },
  java: {
    language: "java",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            // Check if complement was seen before
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }

            // Store current value and its index
            map.put(nums[i], i);
        }

        return new int[]{};
    }
}`,
    lineMap: { "-": [2], init_map: [3], check_map: [5, 9], return_result: [10], put_map: [14], complete: [17] },
  },
  cpp: {
    language: "cpp",
    code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;

        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];

            // Check if complement was seen before
            if (map.count(complement)) {
                return {map[complement], i};
            }

            // Store current value and its index
            map[nums[i]] = i;
        }

        return {};
    }
};`,
    lineMap: { "-": [3], init_map: [4], check_map: [6, 10], return_result: [11], put_map: [15], complete: [18] },
  },
  csharp: {
    language: "csharp",
    code: `public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> map = new Dictionary<int, int>();

        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];

            // Check if complement was seen before
            if (map.ContainsKey(complement)) {
                return new int[]{map[complement], i};
            }

            // Store current value and its index
            map[nums[i]] = i;
        }

        return new int[]{};
    }
}`,
    lineMap: { "-": [2], init_map: [3], check_map: [5, 9], return_result: [10], put_map: [14], complete: [17] },
  },
  go: {
    language: "go",
    code: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)

    for i, num := range nums {
        complement := target - num

        // Check if complement was seen before
        if idx, ok := seen[complement]; ok {
            return []int{idx, i}
        }

        // Store current value and its index
        seen[num] = i
    }

    return []int{}
}`,
    lineMap: { "-": [1], init_map: [2], check_map: [4, 8], return_result: [9], put_map: [13], complete: [16] },
  },
  javascript: {
    language: "javascript",
    code: `function twoSum(nums, target) {
    const seen = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if complement was seen before
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }

        // Store current value and its index
        seen.set(nums[i], i);
    }

    return [];
}`,
    lineMap: { "-": [1], init_map: [2], check_map: [4, 8], return_result: [9], put_map: [13], complete: [16] },
  },
  typescript: {
    language: "typescript",
    code: `function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // Check if complement was seen before
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }

        // Store current value and its index
        seen.set(nums[i], i);
    }

    return [];
}`,
    lineMap: { "-": [1], init_map: [2], check_map: [4, 8], return_result: [9], put_map: [13], complete: [16] },
  },
};

// ==========================================
// 2. PRESETS
// ==========================================

interface TwoSumInput {
  nums: number[];
  target: number;
}

const PRESETS: PresetOption<TwoSumInput>[] = [
  {
    id: "ex1",
    label: "Example 1",
    value: { nums: [2, 7, 11, 15], target: 9 },
  },
  {
    id: "ex2",
    label: "Example 2",
    value: { nums: [3, 2, 4], target: 6 },
  },
  {
    id: "ex3",
    label: "Example 3",
    value: { nums: [3, 3], target: 6 },
  },
];

// ==========================================
// 3. STEP GENERATORS
// ==========================================

function generateBruteForceSteps(input: TwoSumInput): ProblemStep[] {
  const { nums, target } = input;
  const steps: ProblemStep[] = [];
  const n = nums.length;

  steps.push({
    id: "-",
    explanation: `Find two numbers that add up to target = ${target}`,
    variables: { i: -1, j: -1, comparisons: 0, target },
  });

  let comparisons = 0;
  for (let i = 0; i < n - 1; i++) {
    steps.push({
      id: "pick_i",
      explanation: `Fix i = ${i} (nums[${i}] = ${nums[i]}) and test it against later indices`,
      variables: { i, j: -1, comparisons, target },
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      const sum = nums[i] + nums[j];
      const isMatch = sum === target;

      steps.push({
        id: "check_pair",
        explanation: `nums[${i}] + nums[${j}] = ${nums[i]} + ${nums[j]} = ${sum}${
          isMatch ? " — matches the target!" : ` ≠ ${target}`
        }`,
        variables: { i, j, sum, comparisons, target, isMatch },
      });

      if (isMatch) {
        steps.push({
          id: "return_result",
          explanation: `Return [${i}, ${j}] (indices of ${nums[i]} and ${nums[j]})`,
          variables: { i, j, sum, comparisons, target, isMatch: true, result: [i, j] },
        });
        return steps;
      }
    }
  }

  steps.push({
    id: "complete",
    explanation: `All ${comparisons} pairs checked and none sum to ${target}: return []`,
    variables: { i: -1, j: -1, comparisons, target },
  });

  return steps;
}

function generateOnePassSteps(input: TwoSumInput): ProblemStep[] {
  const { nums, target } = input;
  const steps: ProblemStep[] = [];
  const n = nums.length;

  steps.push({
    id: "-",
    explanation: `Find two numbers that add up to target = ${target}`,
    variables: { i: -1, target },
    data: { map: [] },
  });

  steps.push({
    id: "init_map",
    explanation: "Initialize empty hash map: seen = {} (value → index)",
    variables: { i: -1, target },
    data: { map: [] },
  });

  const map = new Map<number, number>();
  const mapEntries: [number, number][] = [];

  for (let i = 0; i < n; i++) {
    const num = nums[i];
    const complement = target - num;

    if (map.has(complement)) {
      const prevIdx = map.get(complement)!;
      steps.push({
        id: "check_map",
        explanation: `complement = ${target} - ${num} = ${complement}: found in map at index ${prevIdx}!`,
        variables: { i, num, complement, target, found: true, result: [prevIdx, i] },
        data: { map: [...mapEntries], matchIdx: prevIdx },
      });

      steps.push({
        id: "return_result",
        explanation: `Return [${prevIdx}, ${i}]`,
        variables: { i, num, complement, target, found: true, result: [prevIdx, i] },
        data: { map: [...mapEntries], matchIdx: prevIdx },
      });
      return steps;
    }

    steps.push({
      id: "check_map",
      explanation: `complement = ${target} - ${num} = ${complement}: not in map yet`,
      variables: { i, num, complement, target, found: false },
      data: { map: [...mapEntries] },
    });

    map.set(num, i);
    mapEntries.push([num, i]);

    steps.push({
      id: "put_map",
      explanation: `Store current number in map: seen[${num}] = ${i}`,
      variables: { i, num, complement, target },
      data: { map: [...mapEntries] },
    });
  }

  steps.push({
    id: "complete",
    explanation: `No two numbers sum to ${target}: return []`,
    variables: { i: -1, target },
    data: { map: [...mapEntries] },
  });

  return steps;
}

// ==========================================
// 4. TWO SUM PROBLEM COMPONENT
// ==========================================

export function TwoSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "brute_force",
      label: "Brute Force",
      templates: BRUTE_FORCE_TEMPLATES,
      generateSteps: generateBruteForceSteps,
      renderVisual: (step: ProblemStep, input: TwoSumInput) => {
        const { nums, target } = input;
        const vars = step.variables || {};
        const { i = -1, j = -1, sum, comparisons = 0, isMatch = false, result } = vars;

        const elements: VisualArrayElement[] = nums.map((val, idx) => {
          let state: VisualArrayElement["state"] = "idle";
          if (result && (idx === result[0] || idx === result[1])) {
            state = "found";
          } else if (idx === i) {
            state = "active";
          } else if (idx === j) {
            state = isMatch ? "found" : "mismatch";
          }
          return { value: val, position: idx, state };
        });

        const pointers: VisualPointer[] = [];
        if (i >= 0 && i < nums.length) {
          pointers.push({ position: i, label: "i", color: "#00ceff" });
        }
        if (j >= 0 && j < nums.length) {
          pointers.push({ position: j, label: "j", color: "#ffa94d" });
        }

        const connectingArc: [number, number] | undefined =
          result && result.length === 2 ? [result[0], result[1]] : undefined;

        return (
          <ArrayVisualizer
            elements={elements}
            pointers={pointers}
            connectingArc={connectingArc}
            hudLeft={
              <text y={0} fill="#a1a1aa">
                target = <tspan fill="#ffd43b">{target}</tspan>
              </text>
            }
            hudRight={
              <text y={0} fill="#a1a1aa">
                pairs checked = <tspan fill="#f4f4f5">{comparisons}</tspan>
              </text>
            }
            centerEquation={
              step.id === "check_pair" && sum !== undefined ? (
                <text fill="#f4f4f5" fontSize={15} fontWeight={800}>
                  <tspan fill="#00ceff">{nums[i]}</tspan>
                  <tspan fill="#71717a"> + </tspan>
                  <tspan fill="#ffa94d">{nums[j]}</tspan>
                  <tspan fill="#71717a"> = </tspan>
                  <tspan fill={isMatch ? "#00d084" : "#f4f4f5"}>{sum}</tspan>
                  <tspan fill="#71717a" dx={16}>
                    {isMatch ? "= " : "≠ "}
                  </tspan>
                  <tspan fill={isMatch ? "#00d084" : "#ff8787"}>target {target}</tspan>
                </text>
              ) : result ? (
                <text fill="#00d084" fontSize={15} fontWeight={800}>
                  found solution: indices [{result[0]}, {result[1]}]
                </text>
              ) : null
            }
          />
        );
      },
    },
    {
      id: "one_pass",
      label: "Hash Map (One Pass)",
      templates: ONE_PASS_TEMPLATES,
      generateSteps: generateOnePassSteps,
      renderVisual: (step: ProblemStep, input: TwoSumInput) => {
        const { nums, target } = input;
        const vars = step.variables || {};
        const { i = -1, num, complement, found = false, result } = vars;
        const mapEntries: [number, number][] = step.data?.map || [];

        const elements: VisualArrayElement[] = nums.map((val, idx) => {
          let state: VisualArrayElement["state"] = "idle";
          if (result && (idx === result[0] || idx === result[1])) {
            state = "found";
          } else if (idx === i) {
            state = "active";
          }
          return { value: val, position: idx, state };
        });

        const pointers: VisualPointer[] = [];
        if (i >= 0 && i < nums.length) {
          pointers.push({ position: i, label: "i", color: "#00ceff" });
        }

        const connectingArc: [number, number] | undefined =
          result && result.length === 2 ? [result[0], result[1]] : undefined;

        return (
          <div className="w-full flex flex-col items-center">
            <ArrayVisualizer
              elements={elements}
              pointers={pointers}
              connectingArc={connectingArc}
              height={180}
              hudLeft={
                <text y={0} fill="#a1a1aa">
                  target = <tspan fill="#ffd43b">{target}</tspan>
                </text>
              }
              hudRight={
                <text y={0} fill="#a1a1aa">
                  map size = <tspan fill="#f4f4f5">{mapEntries.length}</tspan>
                </text>
              }
            />

            {/* Hash Map Table Visualizer */}
            <div className="w-full max-w-md mt-2 p-3 rounded-xl border border-white/10 bg-black text-xs font-mono shadow-md">
              <div className="flex items-center justify-between text-zinc-400 font-bold mb-2 pb-1 border-b border-white/10">
                <span>HASH MAP (val → idx)</span>
                <span>{mapEntries.length} items</span>
              </div>
              {mapEntries.length === 0 ? (
                <div className="text-zinc-600 text-center py-2">seen = {}</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {mapEntries.map(([v, idx]) => {
                    const isComplement = v === complement && (step.id === "check_map" || step.id === "return_result");
                    return (
                      <div
                        key={v}
                        className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
                          isComplement
                            ? "bg-[#86EFAC] text-[#09090b] border-[#86EFAC] shadow-sm"
                            : "bg-white/[0.04] text-zinc-300 border-white/10"
                        }`}
                      >
                        <span className={isComplement ? "text-[#09090b]" : "text-zinc-100"}>{v}</span>
                        <span className={isComplement ? "text-zinc-800" : "text-zinc-500"}>→</span>
                        <span className={isComplement ? "text-[#09090b]" : "text-amber-400"}>{idx}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Two Sum"
      slug="two-sum"
      approaches={approaches}
      presets={PRESETS}
      formatInputDisplay={(input: TwoSumInput) => `nums = [${input.nums.join(", ")}] , target = ${input.target}`}
    />
  );
}
