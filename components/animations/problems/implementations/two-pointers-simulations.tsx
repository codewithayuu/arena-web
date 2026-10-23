// @ts-nocheck
"use client";

import React from "react";
import {
  ProblemViewerShell,
  ProblemApproach,
  ProblemStep,
} from "../problem-viewer-shell";
import { PresetOption } from "../input-presets-panel";
import { ArrayVisualizer, VisualArrayElement, VisualPointer } from "../array-visualizer";
import { StepRecorder, RecursiveStepRecorder } from "../recorder";

function elementsFromVisualState(visualState: Record<string, any>): {
  elements: VisualArrayElement[];
  pointers: VisualPointer[];
} {
  const elements: VisualArrayElement[] = [];
  const pointers: VisualPointer[] = [];

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char" || item.type === "stateElement" || item.type === "bar") {
      elements.push({
        value: item.value ?? "",
        position: item.position ?? (typeof item.col === "number" ? item.col : 0),
        state: item.state || "idle",
      });
    } else if (item.type === "pointer") {
      pointers.push({
        position: item.position ?? 0,
        label: item.label || "",
        color: item.color,
      });
    }
  }

  elements.sort((a, b) => a.position - b.position);
  return { elements, pointers };
}

function formatGenericInput(input: any): string {
  if (!input) return "";
  const parts: string[] = [];
  for (const k in input) {
    const val = input[k];
    if (typeof val === "string") {
      parts.push(`${k} = "${val}"`);
    } else if (Array.isArray(val)) {
      if (val.length > 0 && Array.isArray(val[0])) {
        parts.push(`${k} = [${val.map((inner: any) => `[${inner.join(", ")}]`).join(", ")}]`);
      } else {
        parts.push(`${k} = [${val.join(", ")}]`);
      }
    } else {
      parts.push(`${k} = ${val}`);
    }
  }
  return parts.join(", ");
}

// ==========================================
// Merge Sorted Array (merge-sorted-array)
// ==========================================

const MergeSortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def merge(nums1, m, nums2, n):\n    i = m - 1      # Pointer to end of valid nums1\n    j = n - 1      # Pointer to end of nums2\n    k = m + n - 1  # Pointer to end of nums1 (write position)\n\n    # Merge from the back, placing the larger element first\n    while i >= 0 and j >= 0:\n        if nums1[i] > nums2[j]:\n            nums1[k] = nums1[i]\n            i -= 1\n        else:\n            nums1[k] = nums2[j]\n            j -= 1\n        k -= 1\n\n    # Copy remaining elements from nums2 (if any)\n    while j >= 0:\n        nums1[k] = nums2[j]\n        j -= 1\n        k -= 1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        14
      ],
      "copy_remaining": [
        17,
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void merge(int[] nums1, int m, int[] nums2, int n) {\n    int i = m - 1;     // Pointer to end of valid nums1\n    int j = n - 1;     // Pointer to end of nums2\n    int k = m + n - 1; // Pointer to end of nums1 (write position)\n\n    // Merge from the back, placing the larger element first\n    while (i >= 0 && j >= 0) {\n        if (nums1[i] > nums2[j]) {\n            nums1[k] = nums1[i];\n            i--;\n        } else {\n            nums1[k] = nums2[j];\n            j--;\n        }\n        k--;\n    }\n\n    // Copy remaining elements from nums2 (if any)\n    while (j >= 0) {\n        nums1[k] = nums2[j];\n        j--;\n        k--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n    int i = m - 1;     // Pointer to end of valid nums1\n    int j = n - 1;     // Pointer to end of nums2\n    int k = m + n - 1; // Pointer to end of nums1 (write position)\n\n    // Merge from the back, placing the larger element first\n    while (i >= 0 && j >= 0) {\n        if (nums1[i] > nums2[j]) {\n            nums1[k] = nums1[i];\n            i--;\n        } else {\n            nums1[k] = nums2[j];\n            j--;\n        }\n        k--;\n    }\n\n    // Copy remaining elements from nums2 (if any)\n    while (j >= 0) {\n        nums1[k] = nums2[j];\n        j--;\n        k--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void Merge(int[] nums1, int m, int[] nums2, int n) {\n    int i = m - 1;     // Pointer to end of valid nums1\n    int j = n - 1;     // Pointer to end of nums2\n    int k = m + n - 1; // Pointer to end of nums1 (write position)\n\n    // Merge from the back, placing the larger element first\n    while (i >= 0 && j >= 0) {\n        if (nums1[i] > nums2[j]) {\n            nums1[k] = nums1[i];\n            i--;\n        } else {\n            nums1[k] = nums2[j];\n            j--;\n        }\n        k--;\n    }\n\n    // Copy remaining elements from nums2 (if any)\n    while (j >= 0) {\n        nums1[k] = nums2[j];\n        j--;\n        k--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func merge(nums1 []int, m int, nums2 []int, n int) {\n    i := m - 1     // Pointer to end of valid nums1\n    j := n - 1     // Pointer to end of nums2\n    k := m + n - 1 // Pointer to end of nums1 (write position)\n\n    // Merge from the back, placing the larger element first\n    for i >= 0 && j >= 0 {\n        if nums1[i] > nums2[j] {\n            nums1[k] = nums1[i]\n            i--\n        } else {\n            nums1[k] = nums2[j]\n            j--\n        }\n        k--\n    }\n\n    // Copy remaining elements from nums2 (if any)\n    for j >= 0 {\n        nums1[k] = nums2[j]\n        j--\n        k--\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function merge(nums1, m, nums2, n) {\n  let i = m - 1 // Pointer to end of valid nums1\n  let j = n - 1 // Pointer to end of nums2\n  let k = m + n - 1 // Pointer to end of nums1 (write position)\n\n  // Merge from the back, placing the larger element first\n  while (i >= 0 && j >= 0) {\n    if (nums1[i] > nums2[j]) {\n      nums1[k] = nums1[i]\n      i--\n    } else {\n      nums1[k] = nums2[j]\n      j--\n    }\n    k--\n  }\n\n  // Copy remaining elements from nums2 (if any)\n  while (j >= 0) {\n    nums1[k] = nums2[j]\n    j--\n    k--\n  }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function merge(nums1: number[], m: number, nums2: number[], n: number): void {\n  let i = m - 1 // Pointer to end of valid nums1\n  let j = n - 1 // Pointer to end of nums2\n  let k = m + n - 1 // Pointer to end of nums1 (write position)\n\n  // Merge from the back, placing the larger element first\n  while (i >= 0 && j >= 0) {\n    if (nums1[i] > nums2[j]) {\n      nums1[k] = nums1[i]\n      i--\n    } else {\n      nums1[k] = nums2[j]\n      j--\n    }\n    k--\n  }\n\n  // Copy remaining elements from nums2 (if any)\n  while (j >= 0) {\n    nums1[k] = nums2[j]\n    j--\n    k--\n  }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "compare": [
        7,
        8
      ],
      "place_nums1": [
        9,
        10
      ],
      "move_p1": [
        10
      ],
      "place_nums2": [
        12,
        13
      ],
      "move_p2": [
        13
      ],
      "move_p": [
        15
      ],
      "copy_remaining": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "comparison": [
        8
      ],
      "has_remaining": [
        19
      ]
    }
  }
};

const MergeSortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums1": [
        1,
        2,
        3,
        0,
        0,
        0
      ],
      "nums2": [
        2,
        5,
        6
      ],
      "m": 3,
      "n": 3
    }
  },
  {
    "id": "ex2",
    "label": "All nums2 smaller",
    "value": {
      "nums1": [
        4,
        5,
        6,
        0,
        0,
        0
      ],
      "nums2": [
        1,
        2,
        3
      ],
      "m": 3,
      "n": 3
    }
  },
  {
    "id": "ex3",
    "label": "All nums2 larger",
    "value": {
      "nums1": [
        1,
        2,
        3,
        0,
        0,
        0
      ],
      "nums2": [
        4,
        5,
        6
      ],
      "m": 3,
      "n": 3
    }
  }
];

function generateMergeSortedArraySteps(e: any): any[] {
  let n=Array.isArray(e?.nums1)?e.nums1.map(Number):[],t=Array.isArray(e?.nums2)?e.nums2.map(Number):[],r=(e,n)=>{let t=Math.floor(Number(e));return Number.isFinite(t)&&t>0?Math.min(t,n):0},a=r(e?.m,n.length),s=r(e?.n,t.length),o=n.slice(0,a),l=t.slice(0,s),m=o.map((e,n)=>({key:`n1_a${n}`,value:e})),u=new StepRecorder({nums1:[...o],nums2:[...l],m:a,n:s},{}),p=e=>{m.forEach((n,t)=>{let i=e?.(n.key);u.update_visual(n.key,{type:"arrayElement",value:n.value,position:t,...i&&{state:i}})})},c=(e,n=-1)=>{l.forEach((t,i)=>{let r=i===n?"active":i<e?"dim":void 0;u.update_visual(`n2_${i}`,{type:"arrayElement",value:t,position:i,...r&&{state:r}})})};p(),c(0),u.record("-",`Start: nums1 holds ${a} value${1===a?"":"s"} and ${s} free slot${1===s?"":"s"} at the end`);for(let e=0;e<s;e++)m.push({key:`n1_b${e}`,value:l[e]}),u.update_variable("i",e),u.add_conditional("copy_loop",!0),p(n=>n===`n1_b${e}`?"active":void 0),c(e,e),u.record("copy_element",`nums1[${a} + ${e}] = nums2[${e}] = ${l[e]}`);s>0&&u.add_conditional("copy_loop",!1),u.delete_variable("i"),u.update_variable("nums1",m.map(e=>e.value)),p(),c(s),u.record("before_sort",s>0?`nums1 now holds all ${a+s} values, but the two halves are interleaved out of order`:`nums1 already holds all ${a} values`);let d=m.map((e,n)=>({cell:e,slot:n}));d.sort((e,n)=>e.cell.value-n.cell.value||e.slot-n.slot);let g=d.map(e=>e.cell);return m.length=0,m.push(...g),u.update_variable("nums1",m.map(e=>e.value)),p(),u.record("sort",`Sort the whole array: [${m.map(e=>e.value).join(", ")}]`),p(()=>"sorted"),u.update_variable("result",m.map(e=>e.value)),u.record("complete",`Merge complete: [${m.map(e=>e.value).join(", ")}]`),u.getSteps()
}

export function MergeSortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeSortedArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeSortedArraySteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Merge Sorted Array"
      slug="merge-sorted-array"
      approaches={approaches}
      presets={MergeSortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Two Sum II - Input Array Is Sorted (two-sum-ii-input-array-is-sorted)
// ==========================================

const TwoSumIiInputArrayIsSortedTemplates = {
  "python": {
    "language": "python",
    "code": "def twoSum(numbers, target):\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        current_sum = numbers[left] + numbers[right]\n        if current_sum == target:\n            return [left + 1, right + 1]  # 1-indexed\n        elif current_sum < target:\n            left += 1   # need a larger sum\n        else:\n            right -= 1  # need a smaller sum\n    return [-1, -1]",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] twoSum(int[] numbers, int target) {\n    int left = 0, right = numbers.length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) {\n            return new int[]{left + 1, right + 1}; // 1-indexed\n        } else if (sum < target) {\n            left++;  // need a larger sum\n        } else {\n            right--; // need a smaller sum\n        }\n    }\n    return new int[]{-1, -1};\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> twoSum(vector<int>& numbers, int target) {\n    int left = 0, right = numbers.size() - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) {\n            return {left + 1, right + 1}; // 1-indexed\n        } else if (sum < target) {\n            left++;  // need a larger sum\n        } else {\n            right--; // need a smaller sum\n        }\n    }\n    return {-1, -1};\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] TwoSum(int[] numbers, int target) {\n    int left = 0, right = numbers.Length - 1;\n    while (left < right) {\n        int sum = numbers[left] + numbers[right];\n        if (sum == target) {\n            return new int[]{left + 1, right + 1}; // 1-indexed\n        } else if (sum < target) {\n            left++;  // need a larger sum\n        } else {\n            right--; // need a smaller sum\n        }\n    }\n    return new int[]{-1, -1};\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func twoSum(numbers []int, target int) []int {\n    left, right := 0, len(numbers)-1\n    for left < right {\n        sum := numbers[left] + numbers[right]\n        if sum == target {\n            return []int{left + 1, right + 1} // 1-indexed\n        } else if sum < target {\n            left++  // need a larger sum\n        } else {\n            right-- // need a smaller sum\n        }\n    }\n    return []int{-1, -1}\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function twoSum(numbers, target) {\n    let left = 0, right = numbers.length - 1;\n    while (left < right) {\n        const sum = numbers[left] + numbers[right];\n        if (sum === target) {\n            return [left + 1, right + 1]; // 1-indexed\n        } else if (sum < target) {\n            left++;  // need a larger sum\n        } else {\n            right--; // need a smaller sum\n        }\n    }\n    return [-1, -1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function twoSum(numbers: number[], target: number): number[] {\n    let left = 0, right = numbers.length - 1;\n    while (left < right) {\n        const sum = numbers[left] + numbers[right];\n        if (sum === target) {\n            return [left + 1, right + 1]; // 1-indexed\n        } else if (sum < target) {\n            left++;  // need a larger sum\n        } else {\n            right--; // need a smaller sum\n        }\n    }\n    return [-1, -1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_sum": [
        4
      ],
      "found_result": [
        6
      ],
      "move_left": [
        8
      ],
      "move_right": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_equal": [
        5
      ],
      "is_less": [
        7
      ]
    }
  }
};

const TwoSumIiInputArrayIsSortedPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "numbers": [
        2,
        7,
        11,
        15
      ],
      "target": 9
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "numbers": [
        0,
        -1,
        2,
        3,
        4
      ],
      "target": 6
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "numbers": [
        1,
        2,
        3,
        4,
        5,
        6,
        15
      ],
      "target": 11
    }
  },
  {
    "id": "ex4",
    "label": "Not found",
    "value": {
      "numbers": [
        2,
        3,
        4,
        5,
        6,
        15
      ],
      "target": 13
    }
  }
];

function generateTwoSumIiInputArrayIsSortedSteps(e: any): any[] {
  let t=[...e.numbers],i=e.target,r=t.length,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({numbers:t,target:i},{...a});l.record("-","Start of algorithm");let s=0,u=r-1;l.add_new_variable("left",s),l.add_new_variable("right",u),l.add_new_variable("target",i),l.add_new_variable("sum",null),l.add_new_variable("result",null),l.update_visual("pointer_left",{type:"pointer",position:s,label:"left"}),l.update_visual("pointer_right",{type:"pointer",position:u,label:"right"}),l.record("initialize",`Initialize: left=0, right=${r-1}, target=${i}`);let o=!1;for(;s<u;){let e=t[s]+t[u];l.update_variable("sum",e),l.record("calculate_sum",`Calculate: sum = numbers[${s}] + numbers[${u}] = ${t[s]} + ${t[u]} = ${e}`);let n=e===i;if(l.add_conditional("is_equal",n),n){o=!0,l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),l.update_visual(`elem_${u}`,{type:"arrayElement",value:t[u],position:u,state:"active"});let i=[s+1,u+1];l.update_variable("result",i),l.record("found_result",`Found! sum = ${e} = target. Return [${i[0]}, ${i[1]}]`);break}let r=e<i;l.add_conditional("is_less",r),r?(s++,l.update_variable("left",s),l.update_visual("pointer_left",{type:"pointer",position:s,label:"left"}),l.record("move_left",`sum = ${e} < target, move left to ${s}`)):(u--,l.update_variable("right",u),l.update_visual("pointer_right",{type:"pointer",position:u,label:"right"}),l.record("move_right",`sum = ${e} > target, move right to ${u}`))}return l.delete_visual("pointer_left"),l.delete_visual("pointer_right"),o||l.record("complete","No solution found, return [-1, -1]"),l.getSteps()
}

export function TwoSumIiInputArrayIsSortedProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TwoSumIiInputArrayIsSortedTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTwoSumIiInputArrayIsSortedSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Two Sum II - Input Array Is Sorted"
      slug="two-sum-ii-input-array-is-sorted"
      approaches={approaches}
      presets={TwoSumIiInputArrayIsSortedPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Container with Most Water (container-with-most-water)
// ==========================================

const ContainerWithMostWaterTemplates = {
  "python": {
    "language": "python",
    "code": "def maxArea(height):\n    left = 0\n    right = len(height) - 1\n    max_area = 0\n\n    while left < right:\n        # Area = width * height of shorter line\n        width = right - left\n        h = min(height[left], height[right])\n        max_area = max(max_area, width * h)\n\n        # Move the pointer at the shorter line\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n\n    return max_area",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        18
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxArea(int[] height) {\n    int left = 0;\n    int right = height.length - 1;\n    int maxArea = 0;\n\n    while (left < right) {\n        // Area = width * height of shorter line\n        int width = right - left;\n        int h = Math.min(height[left], height[right]);\n        maxArea = Math.max(maxArea, width * h);\n\n        // Move the pointer at the shorter line\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxArea(vector<int>& height) {\n    int left = 0;\n    int right = height.size() - 1;\n    int maxArea = 0;\n\n    while (left < right) {\n        // Area = width * height of shorter line\n        int width = right - left;\n        int h = min(height[left], height[right]);\n        maxArea = max(maxArea, width * h);\n\n        // Move the pointer at the shorter line\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxArea(int[] height) {\n    int left = 0;\n    int right = height.Length - 1;\n    int maxArea = 0;\n\n    while (left < right) {\n        // Area = width * height of shorter line\n        int width = right - left;\n        int h = Math.Min(height[left], height[right]);\n        maxArea = Math.Max(maxArea, width * h);\n\n        // Move the pointer at the shorter line\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxArea(height []int) int {\n    left := 0\n    right := len(height) - 1\n    maxArea := 0\n\n    for left < right {\n        // Area = width * height of shorter line\n        width := right - left\n        h := min(height[left], height[right])\n        area := width * h\n        if area > maxArea {\n            maxArea = area\n        }\n\n        // Move the pointer at the shorter line\n        if height[left] < height[right] {\n            left++\n        } else {\n            right--\n        }\n    }\n\n    return maxArea\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10,
        11,
        12
      ],
      "update_max": [
        12
      ],
      "move_left": [
        17
      ],
      "move_right": [
        19
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        23
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        16
      ],
      "right_is_shorter": [
        16
      ],
      "left_is_not_shorter": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxArea(height) {\n    let left = 0;\n    let right = height.length - 1;\n    let maxArea = 0;\n\n    while (left < right) {\n        // Area = width * height of shorter line\n        const width = right - left;\n        const h = Math.min(height[left], height[right]);\n        maxArea = Math.max(maxArea, width * h);\n\n        // Move the pointer at the shorter line\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxArea(height: number[]): number {\n    let left = 0;\n    let right = height.length - 1;\n    let maxArea = 0;\n\n    while (left < right) {\n        // Area = width * height of shorter line\n        const width = right - left;\n        const h = Math.min(height[left], height[right]);\n        maxArea = Math.max(maxArea, width * h);\n\n        // Move the pointer at the shorter line\n        if (height[left] < height[right]) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n\n    return maxArea;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_area": [
        8,
        9,
        10
      ],
      "update_max": [
        10
      ],
      "move_left": [
        14
      ],
      "move_right": [
        16
      ],
      "pointers_moved": [
        6
      ],
      "return": [
        20
      ]
    },
    "conditionalMap": {
      "left_is_shorter": [
        13
      ],
      "right_is_shorter": [
        13
      ],
      "left_is_not_shorter": [
        13
      ]
    }
  }
};

const ContainerWithMostWaterPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "heights": [
        1,
        8,
        6,
        2,
        5,
        4,
        8,
        3,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Equal heights",
    "value": {
      "heights": [
        1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Valley shape",
    "value": {
      "heights": [
        4,
        3,
        2,
        1,
        4
      ]
    }
  }
];

function generateContainerWithMostWaterSteps(e: any): any[] {
  let t=Array.isArray(e?.heights)?e.heights.map(Number):[],a=t.length,r={};t.forEach((e,t)=>{r[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let l=new StepRecorder({heights:[...t],n:a,max_area:0,pairs:0},{...r});if(l.record("-","Start: measure every pair of walls"),a<2)return l.update_visual("maxAreaLabel",{type:"metadata",value:"max_area: 0"}),l.record("complete","Fewer than two walls, so no container can hold water: max_area = 0"),l.getSteps();let n=0,h=-1,o=-1,s=0,u=()=>{h>=0&&l.update_visual("max",{type:"range",start:h,end:o,label:"max"}),l.update_visual("maxAreaLabel",{type:"metadata",value:`max_area: ${n}`})};l.update_visual("left",{type:"pointer",position:0,label:"i"}),l.update_visual("right",{type:"pointer",position:1,label:"j"}),u(),l.record("initialize","Initialize max_area = 0");for(let e=0;e<a-1;e++){l.update_variable("i",e),l.update_variable("j",e+1),l.update_visual("left",{type:"pointer",position:e,label:"i"}),l.update_visual("right",{type:"pointer",position:e+1,label:"j"}),l.add_conditional("outer_loop",!0),u(),l.record("pick_left",`Fix the left wall at ${e} (height ${t[e]}) and try every wall to its right`);for(let i=e+1;i<a;i++){let a=i-e,r=Math.min(t[e],t[i]),d=a*r,c=d>n;s++,l.update_variable("j",i),l.update_variable("width",a),l.update_variable("height",r),l.update_variable("current_area",d),l.update_variable("pairs",s),l.update_visual("right",{type:"pointer",position:i,label:"j"}),l.add_conditional("is_new_max",c),u(),l.record("check_pair",`Walls ${e} and ${i}: width ${a} x height min(${t[e]}, ${t[i]}) = ${r}, area = ${d}`),c?(n=d,h=e,o=i,u(),l.update_variable("max_area",n),l.record("update_max",`Area ${d} beats the previous best: max_area = ${n}`)):(u(),l.record("keep_max",`Area ${d} does not beat max_area = ${n}`))}}return l.delete_visual("left"),l.delete_visual("right"),l.delete_variable("width"),l.delete_variable("height"),l.add_conditional("outer_loop",!1),u(),l.record("complete",n>0?`All ${s} pairs measured: walls ${h} and ${o} hold the most, max_area = ${n}`:`All ${s} pairs measured and none hold water: max_area = 0`),l.getSteps()
}

export function ContainerWithMostWaterProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContainerWithMostWaterTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContainerWithMostWaterSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Container with Most Water"
      slug="container-with-most-water"
      approaches={approaches}
      presets={ContainerWithMostWaterPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// 3Sum (3Sum)
// ==========================================

const ThreeSumTemplates = {
  "python": {
    "language": "python",
    "code": "def threeSum(nums):\n    result = []\n    nums.sort()\n    n = len(nums)\n\n    for i in range(n - 2):\n        # No three positive numbers can sum to zero\n        if nums[i] > 0:\n            break\n\n        # Skip duplicate values for the first element\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n\n        left, right = i + 1, n - 1\n\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n\n            if total < 0:\n                left += 1\n            elif total > 0:\n                right -= 1\n            else:\n                result.append([nums[i], nums[left], nums[right]])\n                # Skip duplicates for both pointers\n                while left < right and nums[left] == nums[left + 1]:\n                    left += 1\n                while left < right and nums[right] == nums[right - 1]:\n                    right -= 1\n                left += 1\n                right -= 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        12
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        15
      ],
      "calculate_sum": [
        18
      ],
      "found_triplet": [
        25
      ],
      "skip_duplicate_left": [
        27
      ],
      "skip_duplicate_right": [
        29
      ],
      "move_both": [
        31,
        32
      ],
      "move_left": [
        21
      ],
      "move_right": [
        23
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        12
      ],
      "is_less": [
        20
      ],
      "is_greater": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> threeSum(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    Arrays.sort(nums);\n    int n = nums.length;\n\n    for (int i = 0; i < n - 2; i++) {\n        // No three positive numbers can sum to zero\n        if (nums[i] > 0) break;\n\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        int left = i + 1, right = n - 1;\n\n        while (left < right) {\n            int sum = nums[i] + nums[left] + nums[right];\n\n            if (sum < 0) {\n                left++;\n            } else if (sum > 0) {\n                right--;\n            } else {\n                result.add(Arrays.asList(nums[i], nums[left], nums[right]));\n                // Skip duplicates for both pointers\n                while (left < right && nums[left] == nums[left + 1]) left++;\n                while (left < right && nums[right] == nums[right - 1]) right--;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        13
      ],
      "calculate_sum": [
        16
      ],
      "found_triplet": [
        23
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        26
      ],
      "move_both": [
        27,
        28
      ],
      "move_left": [
        19
      ],
      "move_right": [
        21
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "is_less": [
        18
      ],
      "is_greater": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> threeSum(vector<int>& nums) {\n    vector<vector<int>> result;\n    sort(nums.begin(), nums.end());\n    int n = nums.size();\n\n    for (int i = 0; i < n - 2; i++) {\n        // No three positive numbers can sum to zero\n        if (nums[i] > 0) break;\n\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        int left = i + 1, right = n - 1;\n\n        while (left < right) {\n            int sum = nums[i] + nums[left] + nums[right];\n\n            if (sum < 0) {\n                left++;\n            } else if (sum > 0) {\n                right--;\n            } else {\n                result.push_back({nums[i], nums[left], nums[right]});\n                // Skip duplicates for both pointers\n                while (left < right && nums[left] == nums[left + 1]) left++;\n                while (left < right && nums[right] == nums[right - 1]) right--;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        13
      ],
      "calculate_sum": [
        16
      ],
      "found_triplet": [
        23
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        26
      ],
      "move_both": [
        27,
        28
      ],
      "move_left": [
        19
      ],
      "move_right": [
        21
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "is_less": [
        18
      ],
      "is_greater": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> ThreeSum(int[] nums) {\n    var result = new List<IList<int>>();\n    Array.Sort(nums);\n    int n = nums.Length;\n\n    for (int i = 0; i < n - 2; i++) {\n        // No three positive numbers can sum to zero\n        if (nums[i] > 0) break;\n\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        int left = i + 1, right = n - 1;\n\n        while (left < right) {\n            int sum = nums[i] + nums[left] + nums[right];\n\n            if (sum < 0) {\n                left++;\n            } else if (sum > 0) {\n                right--;\n            } else {\n                result.Add(new List<int> { nums[i], nums[left], nums[right] });\n                // Skip duplicates for both pointers\n                while (left < right && nums[left] == nums[left + 1]) left++;\n                while (left < right && nums[right] == nums[right - 1]) right--;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        13
      ],
      "calculate_sum": [
        16
      ],
      "found_triplet": [
        23
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        26
      ],
      "move_both": [
        27,
        28
      ],
      "move_left": [
        19
      ],
      "move_right": [
        21
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "is_less": [
        18
      ],
      "is_greater": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func threeSum(nums []int) [][]int {\n    result := [][]int{}\n    sort.Ints(nums)\n    n := len(nums)\n\n    for i := 0; i < n-2; i++ {\n        // No three positive numbers can sum to zero\n        if nums[i] > 0 {\n            break\n        }\n\n        // Skip duplicate values for the first element\n        if i > 0 && nums[i] == nums[i-1] {\n            continue\n        }\n\n        left, right := i+1, n-1\n\n        for left < right {\n            sum := nums[i] + nums[left] + nums[right]\n\n            if sum < 0 {\n                left++\n            } else if sum > 0 {\n                right--\n            } else {\n                result = append(result, []int{nums[i], nums[left], nums[right]})\n                // Skip duplicates for both pointers\n                for left < right && nums[left] == nums[left+1] {\n                    left++\n                }\n                for left < right && nums[right] == nums[right-1] {\n                    right--\n                }\n                left++\n                right--\n            }\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        13
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        17
      ],
      "calculate_sum": [
        20
      ],
      "found_triplet": [
        27
      ],
      "skip_duplicate_left": [
        29
      ],
      "skip_duplicate_right": [
        32
      ],
      "move_both": [
        35,
        36
      ],
      "move_left": [
        23
      ],
      "move_right": [
        25
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        13
      ],
      "is_less": [
        22
      ],
      "is_greater": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function threeSum(nums) {\n    const result = [];\n    nums.sort((a, b) => a - b);\n    const n = nums.length;\n\n    for (let i = 0; i < n - 2; i++) {\n        // No three positive numbers can sum to zero\n        if (nums[i] > 0) break;\n\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n        let left = i + 1, right = n - 1;\n\n        while (left < right) {\n            const sum = nums[i] + nums[left] + nums[right];\n\n            if (sum < 0) {\n                left++;\n            } else if (sum > 0) {\n                right--;\n            } else {\n                result.push([nums[i], nums[left], nums[right]]);\n                // Skip duplicates for both pointers\n                while (left < right && nums[left] === nums[left + 1]) left++;\n                while (left < right && nums[right] === nums[right - 1]) right--;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        13
      ],
      "calculate_sum": [
        16
      ],
      "found_triplet": [
        23
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        26
      ],
      "move_both": [
        27,
        28
      ],
      "move_left": [
        19
      ],
      "move_right": [
        21
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "is_less": [
        18
      ],
      "is_greater": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function threeSum(nums: number[]): number[][] {\n    const result: number[][] = [];\n    nums.sort((a, b) => a - b);\n    const n = nums.length;\n\n    for (let i = 0; i < n - 2; i++) {\n        // No three positive numbers can sum to zero\n        if (nums[i] > 0) break;\n\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n        let left = i + 1, right = n - 1;\n\n        while (left < right) {\n            const sum = nums[i] + nums[left] + nums[right];\n\n            if (sum < 0) {\n                left++;\n            } else if (sum > 0) {\n                right--;\n            } else {\n                result.push([nums[i], nums[left], nums[right]]);\n                // Skip duplicates for both pointers\n                while (left < right && nums[left] === nums[left + 1]) left++;\n                while (left < right && nums[right] === nums[right - 1]) right--;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "prune_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "set_i": [
        6
      ],
      "initialize_pointers": [
        13
      ],
      "calculate_sum": [
        16
      ],
      "found_triplet": [
        23
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        26
      ],
      "move_both": [
        27,
        28
      ],
      "move_left": [
        19
      ],
      "move_right": [
        21
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ],
      "skip_duplicate_i": [
        11
      ],
      "is_less": [
        18
      ],
      "is_greater": [
        20
      ]
    }
  }
};

const ThreeSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        -1,
        0,
        1,
        2,
        -1,
        -4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        0,
        0,
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        -2,
        0,
        1,
        1,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "No solution",
    "value": {
      "nums": [
        0,
        1,
        1
      ]
    }
  }
];

function generateThreeSumSteps(e: any): any[] {
  let t=[...Array.isArray(e?.nums)?e.nums.map(Number):[]].sort((e,t)=>e-t),i=t.length,r={};t.forEach((e,t)=>{r[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let s=new StepRecorder({nums:[...t],n:i,seen:[],result:[]},{...r});if(s.record("-","Start: sort so repeated values sit together"),i<3)return s.record("complete","Fewer than three numbers, so no triplet exists"),s.getSteps();let l=[],u=[],a=new Set,o=[],p=(e,n,r)=>{for(let n=0;n<i;n++){let i;n<(e??0)&&(i="skipped"),o.includes(n)&&(i="highlight"),u.includes(n)&&(i="matched"),r?.includes(n)&&(i="matched"),s.update_visual(`elem_${n}`,{type:"arrayElement",value:t[n],position:n,...i?{state:i}:{}})}};p(),s.record("sort",`Sorted: [${t.join(", ")}]`);for(let e=0;e<i-2;e++){let n=e>0&&t[e]===t[e-1];if(s.update_variable("i",e),s.add_conditional("is_dup_i",n),n){s.update_visual("pointer_i",{type:"pointer",position:e,label:"i"}),p(e),s.record("skip_duplicate_i",`nums[${e}] = ${t[e]} repeats nums[${e-1}], skip it`);continue}a=new Set,o=[];let r=-t[e];s.update_variable("target",r),s.update_variable("seen",[]),s.update_visual("pointer_i",{type:"pointer",position:e,label:"i"}),s.update_visual("pointer_j",{type:"pointer",position:e+1,label:"j"}),p(e),s.record("pick_i",`Fix i = ${e} (${t[e]}), so the other two must sum to ${r}`);for(let n=e+1;n<i;n++){let m=r-t[n],c=a.has(m);if(s.update_variable("j",n),s.update_variable("complement",m),s.update_visual("pointer_j",{type:"pointer",position:n,label:"j"}),s.add_conditional("complement_found",c),p(e,n),s.record("check_complement",`Need ${r} - ${t[n]} = ${m}: `+(c?"already seen":"not seen yet")),c){let r=[t[e],m,t[n]];l.push(r);let a=o.filter(e=>t[e]===m).pop();for(u.push(e,n),void 0!==a&&u.push(a),s.update_variable("result",l.map(e=>[...e])),p(e,n,void 0===a?[e,n]:[e,n,a]),s.record("found_triplet",`Record [${r.join(", ")}]`);n+1<i&&t[n]===t[n+1];)n++,s.update_variable("j",n),s.update_visual("pointer_j",{type:"pointer",position:n,label:"j"}),p(e,n),s.record("skip_duplicate_j",`nums[${n}] repeats the third value, skip it`)}a.add(t[n]),o.push(n),s.update_variable("seen",Array.from(a)),p(e,n),s.record("add_seen",`Add ${t[n]} to seen`)}}return s.delete_visual("pointer_i"),s.delete_visual("pointer_j"),p(),s.record("complete",`Found ${l.length} triplet${1===l.length?"":"s"}`),s.getSteps()
}

export function ThreeSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ThreeSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateThreeSumSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="3Sum"
      slug="3Sum"
      approaches={approaches}
      presets={ThreeSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// 4Sum (4Sum)
// ==========================================

const FourSumTemplates = {
  "python": {
    "language": "python",
    "code": "def fourSum(nums, target):\n    result = []\n    n = len(nums)\n    nums.sort()\n\n    for i in range(n - 3):\n        # Skip duplicate values for the first element\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n\n        for j in range(i + 1, n - 2):\n            # Skip duplicate values for the second element\n            if j > i + 1 and nums[j] == nums[j - 1]:\n                continue\n\n            left = j + 1\n            right = n - 1\n\n            while left < right:\n                total = nums[i] + nums[j] + nums[left] + nums[right]\n\n                if total == target:\n                    result.append([nums[i], nums[j], nums[left], nums[right]])\n\n                    # Skip duplicates on the left pointer\n                    while left < right and nums[left] == nums[left + 1]:\n                        left += 1\n                    # Skip duplicates on the right pointer\n                    while left < right and nums[right] == nums[right - 1]:\n                        right -= 1\n\n                    left += 1\n                    right -= 1\n                elif total < target:\n                    left += 1\n                else:\n                    right -= 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        13
      ],
      "set_j": [
        11
      ],
      "initialize_pointers": [
        16,
        17
      ],
      "calculate_sum": [
        20
      ],
      "found_quad": [
        23
      ],
      "skip_duplicate_left": [
        26
      ],
      "skip_duplicate_right": [
        29
      ],
      "move_both": [
        32,
        33
      ],
      "move_left": [
        35
      ],
      "move_right": [
        37
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        13
      ],
      "is_equal": [
        22
      ],
      "is_less": [
        34
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> fourSum(int[] nums, int target) {\n    List<List<Integer>> result = new ArrayList<>();\n    int n = nums.length;\n    Arrays.sort(nums);\n\n    for (int i = 0; i < n - 3; i++) {\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        for (int j = i + 1; j < n - 2; j++) {\n            // Skip duplicate values for the second element\n            if (j > i + 1 && nums[j] == nums[j - 1]) continue;\n\n            int left = j + 1;\n            int right = n - 1;\n\n            while (left < right) {\n                // Use long to avoid integer overflow\n                long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];\n\n                if (sum == target) {\n                    result.add(Arrays.asList(nums[i], nums[j], nums[left], nums[right]));\n\n                    // Skip duplicates on the left pointer\n                    while (left < right && nums[left] == nums[left + 1]) left++;\n                    // Skip duplicates on the right pointer\n                    while (left < right && nums[right] == nums[right - 1]) right--;\n\n                    left++;\n                    right--;\n                } else if (sum < target) {\n                    left++;\n                } else {\n                    right--;\n                }\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        12
      ],
      "set_j": [
        10
      ],
      "initialize_pointers": [
        14,
        15
      ],
      "calculate_sum": [
        19
      ],
      "found_quad": [
        22
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        27
      ],
      "move_both": [
        29,
        30
      ],
      "move_left": [
        32
      ],
      "move_right": [
        34
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        12
      ],
      "is_equal": [
        21
      ],
      "is_less": [
        31
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> fourSum(vector<int>& nums, int target) {\n    vector<vector<int>> result;\n    int n = nums.size();\n    sort(nums.begin(), nums.end());\n\n    for (int i = 0; i < n - 3; i++) {\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        for (int j = i + 1; j < n - 2; j++) {\n            // Skip duplicate values for the second element\n            if (j > i + 1 && nums[j] == nums[j - 1]) continue;\n\n            int left = j + 1;\n            int right = n - 1;\n\n            while (left < right) {\n                // Use long long to avoid integer overflow\n                long long sum = (long long) nums[i] + nums[j] + nums[left] + nums[right];\n\n                if (sum == target) {\n                    result.push_back({nums[i], nums[j], nums[left], nums[right]});\n\n                    // Skip duplicates on the left pointer\n                    while (left < right && nums[left] == nums[left + 1]) left++;\n                    // Skip duplicates on the right pointer\n                    while (left < right && nums[right] == nums[right - 1]) right--;\n\n                    left++;\n                    right--;\n                } else if (sum < target) {\n                    left++;\n                } else {\n                    right--;\n                }\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        12
      ],
      "set_j": [
        10
      ],
      "initialize_pointers": [
        14,
        15
      ],
      "calculate_sum": [
        19
      ],
      "found_quad": [
        22
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        27
      ],
      "move_both": [
        29,
        30
      ],
      "move_left": [
        32
      ],
      "move_right": [
        34
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        12
      ],
      "is_equal": [
        21
      ],
      "is_less": [
        31
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> FourSum(int[] nums, int target) {\n    IList<IList<int>> result = new List<IList<int>>();\n    int n = nums.Length;\n    Array.Sort(nums);\n\n    for (int i = 0; i < n - 3; i++) {\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n        for (int j = i + 1; j < n - 2; j++) {\n            // Skip duplicate values for the second element\n            if (j > i + 1 && nums[j] == nums[j - 1]) continue;\n\n            int left = j + 1;\n            int right = n - 1;\n\n            while (left < right) {\n                // Use long to avoid integer overflow\n                long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];\n\n                if (sum == target) {\n                    result.Add(new List<int> { nums[i], nums[j], nums[left], nums[right] });\n\n                    // Skip duplicates on the left pointer\n                    while (left < right && nums[left] == nums[left + 1]) left++;\n                    // Skip duplicates on the right pointer\n                    while (left < right && nums[right] == nums[right - 1]) right--;\n\n                    left++;\n                    right--;\n                } else if (sum < target) {\n                    left++;\n                } else {\n                    right--;\n                }\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        12
      ],
      "set_j": [
        10
      ],
      "initialize_pointers": [
        14,
        15
      ],
      "calculate_sum": [
        19
      ],
      "found_quad": [
        22
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        27
      ],
      "move_both": [
        29,
        30
      ],
      "move_left": [
        32
      ],
      "move_right": [
        34
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        12
      ],
      "is_equal": [
        21
      ],
      "is_less": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func fourSum(nums []int, target int) [][]int {\n    var result [][]int\n    n := len(nums)\n    sort.Ints(nums)\n\n    for i := 0; i < n-3; i++ {\n        // Skip duplicate values for the first element\n        if i > 0 && nums[i] == nums[i-1] {\n            continue\n        }\n\n        for j := i + 1; j < n-2; j++ {\n            // Skip duplicate values for the second element\n            if j > i+1 && nums[j] == nums[j-1] {\n                continue\n            }\n\n            left := j + 1\n            right := n - 1\n\n            for left < right {\n                // Use int64 to avoid integer overflow\n                sum := int64(nums[i]) + int64(nums[j]) + int64(nums[left]) + int64(nums[right])\n\n                if sum == int64(target) {\n                    result = append(result, []int{nums[i], nums[j], nums[left], nums[right]})\n\n                    // Skip duplicates on the left pointer\n                    for left < right && nums[left] == nums[left+1] {\n                        left++\n                    }\n                    // Skip duplicates on the right pointer\n                    for left < right && nums[right] == nums[right-1] {\n                        right--\n                    }\n\n                    left++\n                    right--\n                } else if sum < int64(target) {\n                    left++\n                } else {\n                    right--\n                }\n            }\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        14
      ],
      "set_j": [
        12
      ],
      "initialize_pointers": [
        18,
        19
      ],
      "calculate_sum": [
        23
      ],
      "found_quad": [
        26
      ],
      "skip_duplicate_left": [
        29
      ],
      "skip_duplicate_right": [
        33
      ],
      "move_both": [
        37,
        38
      ],
      "move_left": [
        40
      ],
      "move_right": [
        42
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        14
      ],
      "is_equal": [
        25
      ],
      "is_less": [
        39
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function fourSum(nums, target) {\n  const result = [];\n  const n = nums.length;\n  nums.sort((a, b) => a - b);\n\n  for (let i = 0; i < n - 3; i++) {\n    // Skip duplicate values for the first element\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n    for (let j = i + 1; j < n - 2; j++) {\n      // Skip duplicate values for the second element\n      if (j > i + 1 && nums[j] === nums[j - 1]) continue;\n\n      let left = j + 1;\n      let right = n - 1;\n\n      while (left < right) {\n        // JavaScript numbers are exact up to 2^53, so 4 * 10^9 is safe\n        const sum = nums[i] + nums[j] + nums[left] + nums[right];\n\n        if (sum === target) {\n          result.push([nums[i], nums[j], nums[left], nums[right]]);\n\n          // Skip duplicates on the left pointer\n          while (left < right && nums[left] === nums[left + 1]) left++;\n          // Skip duplicates on the right pointer\n          while (left < right && nums[right] === nums[right - 1]) right--;\n\n          left++;\n          right--;\n        } else if (sum < target) {\n          left++;\n        } else {\n          right--;\n        }\n      }\n    }\n  }\n\n  return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        12
      ],
      "set_j": [
        10
      ],
      "initialize_pointers": [
        14,
        15
      ],
      "calculate_sum": [
        19
      ],
      "found_quad": [
        22
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        27
      ],
      "move_both": [
        29,
        30
      ],
      "move_left": [
        32
      ],
      "move_right": [
        34
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        12
      ],
      "is_equal": [
        21
      ],
      "is_less": [
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function fourSum(nums: number[], target: number): number[][] {\n    const result: number[][] = [];\n    const n = nums.length;\n    nums.sort((a, b) => a - b);\n\n    for (let i = 0; i < n - 3; i++) {\n        // Skip duplicate values for the first element\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n        for (let j = i + 1; j < n - 2; j++) {\n            // Skip duplicate values for the second element\n            if (j > i + 1 && nums[j] === nums[j - 1]) continue;\n\n            let left = j + 1;\n            let right = n - 1;\n\n            while (left < right) {\n                // Numbers are exact up to 2^53, so 4 * 10^9 is safe\n                const sum = nums[i] + nums[j] + nums[left] + nums[right];\n\n                if (sum === target) {\n                    result.push([nums[i], nums[j], nums[left], nums[right]]);\n\n                    // Skip duplicates on the left pointer\n                    while (left < right && nums[left] === nums[left + 1]) left++;\n                    // Skip duplicates on the right pointer\n                    while (left < right && nums[right] === nums[right - 1]) right--;\n\n                    left++;\n                    right--;\n                } else if (sum < target) {\n                    left++;\n                } else {\n                    right--;\n                }\n            }\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        4
      ],
      "skip_duplicate_i": [
        8
      ],
      "set_i": [
        6
      ],
      "skip_duplicate_j": [
        12
      ],
      "set_j": [
        10
      ],
      "initialize_pointers": [
        14,
        15
      ],
      "calculate_sum": [
        19
      ],
      "found_quad": [
        22
      ],
      "skip_duplicate_left": [
        25
      ],
      "skip_duplicate_right": [
        27
      ],
      "move_both": [
        29,
        30
      ],
      "move_left": [
        32
      ],
      "move_right": [
        34
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "skip_duplicate_i": [
        8
      ],
      "skip_duplicate_j": [
        12
      ],
      "is_equal": [
        21
      ],
      "is_less": [
        31
      ]
    }
  }
};

const FourSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        0,
        -1,
        0,
        -2,
        2
      ],
      "target": 0
    }
  },
  {
    "id": "ex2",
    "label": "All duplicates",
    "value": {
      "nums": [
        2,
        2,
        2,
        2,
        2
      ],
      "target": 8
    }
  },
  {
    "id": "ex3",
    "label": "Single quadruplet",
    "value": {
      "nums": [
        -3,
        -1,
        0,
        2,
        4,
        5
      ],
      "target": 0
    }
  },
  {
    "id": "ex4",
    "label": "No solution",
    "value": {
      "nums": [
        1,
        0,
        -1,
        0,
        -2,
        2
      ],
      "target": 50
    }
  }
];

function generateFourSumSteps(t: any): any[] {
  let e=Array.isArray(t?.nums)?t.nums.map(Number):[],i=Number(t?.target??0);e.sort((t,e)=>t-e);let s=e.length,r=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),u=new StepRecorder({nums:e,target:i},{...r}),l=[],a=new Set;u.record("-",`Find every quadruplet summing to ${i} (array is sorted)`),u.add_new_variable("sum",null),u.add_new_variable("result",l),u.record("init","Try every choice of four indices");for(let t=0;t<s-3;t++){u.update_variable("i",t),u.update_visual("pointer_i",{type:"pointer",position:t,label:"i"}),u.record("pick_i",`Fix i = ${t}, nums[i] = ${e[t]}`);for(let n=t+1;n<s-2;n++){u.update_variable("j",n),u.update_visual("pointer_j",{type:"pointer",position:n,label:"j"}),u.record("pick_j",`Fix j = ${n}, nums[j] = ${e[n]}`);for(let r=n+1;r<s-1;r++){u.update_variable("k",r),u.update_visual("pointer_k",{type:"pointer",position:r,label:"k"}),u.record("pick_k",`Fix k = ${r}, nums[k] = ${e[r]}`);for(let o=r+1;o<s;o++){let s=e[t]+e[n]+e[r]+e[o];u.update_variable("l",o),u.update_variable("sum",s),u.update_visual("pointer_l",{type:"pointer",position:o,label:"l"});let m=s===i;if(u.add_conditional("is_target",m),u.record("check_quad",`nums[${t}] + nums[${n}] + nums[${r}] + nums[${o}] = ${e[t]} + ${e[n]} + ${e[r]} + ${e[o]} = ${s}`),m){let i=[e[t],e[n],e[r],e[o]],s=i.join(",");a.has(s)||(a.add(s),l.push(i),u.update_variable("result",l.map(t=>[...t]))),u.record("found_quad",`Found quadruplet: [${i.join(", ")}]`)}}}}}return u.delete_visual("pointer_i"),u.delete_visual("pointer_j"),u.delete_visual("pointer_k"),u.delete_visual("pointer_l"),u.delete_variable("sum"),u.record("complete",`Complete: found ${l.length} quadruplet(s)`),u.getSteps()
}

export function FourSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FourSumTemplates,
      generateSteps: (t: any) => {
        const recorded = generateFourSumSteps(t) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="4Sum"
      slug="4Sum"
      approaches={approaches}
      presets={FourSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Trapping Rain Water (trapping-rain-water)
// ==========================================

const TrappingRainWaterTemplates = {
  "python": {
    "language": "python",
    "code": "def trap(height):\n    left, right = 0, len(height) - 1\n    left_max, right_max = 0, 0\n    total_water = 0\n\n    while left < right:\n        if height[left] < height[right]:\n            # Left side is the bottleneck\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                total_water += left_max - height[left]\n            left += 1\n        else:\n            # Right side is the bottleneck\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                total_water += right_max - height[right]\n            right -= 1\n\n    return total_water",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_left": [
        6
      ],
      "update_left_max": [
        10
      ],
      "add_water_left": [
        12
      ],
      "move_left_pointer": [
        13
      ],
      "check_right": [
        6
      ],
      "update_right_max": [
        17
      ],
      "add_water_right": [
        19
      ],
      "move_right_pointer": [
        20
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "while_condition": [
        6
      ],
      "right_is_higher": [
        7
      ],
      "right_is_lower": [
        7
      ],
      "new_left_max": [
        9
      ],
      "new_water_left_max": [
        11
      ],
      "new_right_max": [
        16
      ],
      "new_water_right_max": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int trap(int[] height) {\n    int left = 0, right = height.length - 1;\n    int leftMax = 0, rightMax = 0;\n    int totalWater = 0;\n\n    while (left < right) {\n        if (height[left] < height[right]) {\n            // Left side is the bottleneck\n            if (height[left] >= leftMax) {\n                leftMax = height[left];\n            } else {\n                totalWater += leftMax - height[left];\n            }\n            left++;\n        } else {\n            // Right side is the bottleneck\n            if (height[right] >= rightMax) {\n                rightMax = height[right];\n            } else {\n                totalWater += rightMax - height[right];\n            }\n            right--;\n        }\n    }\n\n    return totalWater;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_left": [
        6
      ],
      "update_left_max": [
        10
      ],
      "add_water_left": [
        12
      ],
      "move_left_pointer": [
        14
      ],
      "check_right": [
        6
      ],
      "update_right_max": [
        18
      ],
      "add_water_right": [
        20
      ],
      "move_right_pointer": [
        22
      ],
      "return": [
        26
      ]
    },
    "conditionalMap": {
      "while_condition": [
        6
      ],
      "right_is_higher": [
        7
      ],
      "right_is_lower": [
        7
      ],
      "new_left_max": [
        9
      ],
      "new_water_left_max": [
        11
      ],
      "new_right_max": [
        17
      ],
      "new_water_right_max": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int trap(vector<int>& height) {\n    int left = 0, right = height.size() - 1;\n    int leftMax = 0, rightMax = 0;\n    int totalWater = 0;\n\n    while (left < right) {\n        if (height[left] < height[right]) {\n            // Left side is the bottleneck\n            if (height[left] >= leftMax) {\n                leftMax = height[left];\n            } else {\n                totalWater += leftMax - height[left];\n            }\n            left++;\n        } else {\n            // Right side is the bottleneck\n            if (height[right] >= rightMax) {\n                rightMax = height[right];\n            } else {\n                totalWater += rightMax - height[right];\n            }\n            right--;\n        }\n    }\n\n    return totalWater;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_left": [
        6
      ],
      "update_left_max": [
        10
      ],
      "add_water_left": [
        12
      ],
      "move_left_pointer": [
        14
      ],
      "check_right": [
        6
      ],
      "update_right_max": [
        18
      ],
      "add_water_right": [
        20
      ],
      "move_right_pointer": [
        22
      ],
      "return": [
        26
      ]
    },
    "conditionalMap": {
      "while_condition": [
        6
      ],
      "right_is_higher": [
        7
      ],
      "right_is_lower": [
        7
      ],
      "new_left_max": [
        9
      ],
      "new_water_left_max": [
        11
      ],
      "new_right_max": [
        17
      ],
      "new_water_right_max": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Trap(int[] height) {\n    int left = 0, right = height.Length - 1;\n    int leftMax = 0, rightMax = 0;\n    int totalWater = 0;\n\n    while (left < right) {\n        if (height[left] < height[right]) {\n            // Left side is the bottleneck\n            if (height[left] >= leftMax) {\n                leftMax = height[left];\n            } else {\n                totalWater += leftMax - height[left];\n            }\n            left++;\n        } else {\n            // Right side is the bottleneck\n            if (height[right] >= rightMax) {\n                rightMax = height[right];\n            } else {\n                totalWater += rightMax - height[right];\n            }\n            right--;\n        }\n    }\n\n    return totalWater;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_left": [
        6
      ],
      "update_left_max": [
        10
      ],
      "add_water_left": [
        12
      ],
      "move_left_pointer": [
        14
      ],
      "check_right": [
        6
      ],
      "update_right_max": [
        18
      ],
      "add_water_right": [
        20
      ],
      "move_right_pointer": [
        22
      ],
      "return": [
        26
      ]
    },
    "conditionalMap": {
      "while_condition": [
        6
      ],
      "right_is_higher": [
        7
      ],
      "right_is_lower": [
        7
      ],
      "new_left_max": [
        9
      ],
      "new_water_left_max": [
        11
      ],
      "new_right_max": [
        17
      ],
      "new_water_right_max": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func trap(height []int) int {\n    left, right := 0, len(height)-1\n    leftMax, rightMax := 0, 0\n    totalWater := 0\n\n    for left < right {\n        if height[left] < height[right] {\n            // Left side is the bottleneck\n            if height[left] >= leftMax {\n                leftMax = height[left]\n            } else {\n                totalWater += leftMax - height[left]\n            }\n            left++\n        } else {\n            // Right side is the bottleneck\n            if height[right] >= rightMax {\n                rightMax = height[right]\n            } else {\n                totalWater += rightMax - height[right]\n            }\n            right--\n        }\n    }\n\n    return totalWater\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_left": [
        6
      ],
      "update_left_max": [
        10
      ],
      "add_water_left": [
        12
      ],
      "move_left_pointer": [
        14
      ],
      "check_right": [
        6
      ],
      "update_right_max": [
        18
      ],
      "add_water_right": [
        20
      ],
      "move_right_pointer": [
        22
      ],
      "return": [
        26
      ]
    },
    "conditionalMap": {
      "while_condition": [
        6
      ],
      "right_is_higher": [
        7
      ],
      "right_is_lower": [
        7
      ],
      "new_left_max": [
        9
      ],
      "new_water_left_max": [
        11
      ],
      "new_right_max": [
        17
      ],
      "new_water_right_max": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function trap(height) {\n  let left = 0,\n    right = height.length - 1\n  let leftMax = 0,\n    rightMax = 0\n  let totalWater = 0\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      // Left side is the bottleneck\n      if (height[left] >= leftMax) {\n        leftMax = height[left]\n      } else {\n        totalWater += leftMax - height[left]\n      }\n      left++\n    } else {\n      // Right side is the bottleneck\n      if (height[right] >= rightMax) {\n        rightMax = height[right]\n      } else {\n        totalWater += rightMax - height[right]\n      }\n      right--\n    }\n  }\n\n  return totalWater\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_left": [
        8
      ],
      "update_left_max": [
        12
      ],
      "add_water_left": [
        14
      ],
      "move_left_pointer": [
        16
      ],
      "check_right": [
        8
      ],
      "update_right_max": [
        20
      ],
      "add_water_right": [
        22
      ],
      "move_right_pointer": [
        24
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_condition": [
        8
      ],
      "right_is_higher": [
        9
      ],
      "right_is_lower": [
        9
      ],
      "new_left_max": [
        11
      ],
      "new_water_left_max": [
        13
      ],
      "new_right_max": [
        19
      ],
      "new_water_right_max": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function trap(height: number[]): number {\n  let left = 0,\n    right = height.length - 1\n  let leftMax = 0,\n    rightMax = 0\n  let totalWater = 0\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      // Left side is the bottleneck\n      if (height[left] >= leftMax) {\n        leftMax = height[left]\n      } else {\n        totalWater += leftMax - height[left]\n      }\n      left++\n    } else {\n      // Right side is the bottleneck\n      if (height[right] >= rightMax) {\n        rightMax = height[right]\n      } else {\n        totalWater += rightMax - height[right]\n      }\n      right--\n    }\n  }\n\n  return totalWater\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6
      ],
      "check_left": [
        8
      ],
      "update_left_max": [
        12
      ],
      "add_water_left": [
        14
      ],
      "move_left_pointer": [
        16
      ],
      "check_right": [
        8
      ],
      "update_right_max": [
        20
      ],
      "add_water_right": [
        22
      ],
      "move_right_pointer": [
        24
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "while_condition": [
        8
      ],
      "right_is_higher": [
        9
      ],
      "right_is_lower": [
        9
      ],
      "new_left_max": [
        11
      ],
      "new_water_left_max": [
        13
      ],
      "new_right_max": [
        19
      ],
      "new_water_right_max": [
        21
      ]
    }
  }
};

const TrappingRainWaterPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "heights": [
        0,
        1,
        0,
        2,
        1,
        0,
        1,
        3,
        2,
        1,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Deep valley",
    "value": {
      "heights": [
        4,
        2,
        0,
        3,
        2,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Rising peaks",
    "value": {
      "heights": [
        3,
        0,
        2,
        0,
        4
      ]
    }
  }
];

function generateTrappingRainWaterSteps(t: any): any[] {
  let e=Array.isArray(t?.heights)?t.heights:[],i=e.length,r={};e.forEach((t,e)=>{r[`elem_${e}`]={type:"arrayElement",value:t,position:e}});let l=new StepRecorder({heights:e,i:void 0,top:void 0,left_wall:void 0,distance:void 0,bounded_height:void 0,water:0},{...r});if(l.record("start","Start: fill water in horizontal slabs"),0===i)return l.record("complete","Empty input - 0 units trapped"),l.getSteps();let n=[],h=Array(i).fill(0),o=0,s=()=>{n.forEach((t,e)=>{l.update_visual(`stack_${t}`,{type:"stackElement",value:`${t}`,position:e,state:"active"})})};for(let t=0;t<i;t++){for(l.update_variable("i",t),l.update_visual("i",{type:"pointer",position:t,label:"i"}),l.add_conditional("for_i",!0),l.record("visit_bar",`Bar ${t} (height ${e[t]})`);n.length>0&&e[t]>e[n[n.length-1]];){l.add_conditional("while_shorter",!0);let i=n.pop();if(l.delete_visual(`stack_${i}`),l.update_variable("top",i),l.record("pop_top",`Bar ${t} is taller than bar ${i} - pop it and see what it holds`),0===n.length){l.add_conditional("has_left_wall",!1),l.record("no_left_wall",`Nothing left of bar ${i} to hold water - stop this slab`);break}l.add_conditional("has_left_wall",!0);let a=n[n.length-1],r=t-a-1,s=Math.min(e[t],e[a])-e[i],g=r*s;if(l.update_variable("left_wall",a),l.update_variable("distance",r),l.update_variable("bounded_height",s),g>0){o+=g,l.update_variable("water",o);for(let e=a+1;e<t;e++)h[e]+=s,l.update_visual(`water_${e}`,{type:"arrayElement",value:h[e],position:e});l.record("fill_slab",`Slab between bars ${a} and ${t}: ${r} wide x ${s} high = ${g}`)}else l.record("flat_slab",`Bars ${a} and ${t} are level with bar ${i} - no depth to fill`)}l.add_conditional("while_shorter",!1),n.push(t),s(),l.update_variable("top",void 0),l.update_variable("left_wall",void 0),l.update_variable("distance",void 0),l.update_variable("bounded_height",void 0),l.record("push_bar",`Push bar ${t} - it may hold water for a later bar`)}return l.add_conditional("for_i",!1),l.update_variable("i",void 0),l.delete_visual("i"),l.record("complete",`${o} unit${1===o?"":"s"} trapped`),l.getSteps()
}

export function TrappingRainWaterProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TrappingRainWaterTemplates,
      generateSteps: (t: any) => {
        const recorded = generateTrappingRainWaterSteps(t) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Trapping Rain Water"
      slug="trapping-rain-water"
      approaches={approaches}
      presets={TrappingRainWaterPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Backspace String Compare (backspace-string-compare)
// ==========================================

const BackspaceStringCompareTemplates = {
  "python": {
    "language": "python",
    "code": "def backspaceCompare(s, t):\n    i = len(s) - 1\n    j = len(t) - 1\n    skip_s = 0\n    skip_t = 0\n\n    while i >= 0 or j >= 0:\n        # Find the next valid character in s\n        while i >= 0:\n            if s[i] == '#':\n                skip_s += 1\n                i -= 1\n            elif skip_s > 0:\n                skip_s -= 1\n                i -= 1\n            else:\n                break\n\n        # Find the next valid character in t\n        while j >= 0:\n            if t[j] == '#':\n                skip_t += 1\n                j -= 1\n            elif skip_t > 0:\n                skip_t -= 1\n                j -= 1\n            else:\n                break\n\n        # Compare the two valid characters\n        if i >= 0 and j >= 0:\n            if s[i] != t[j]:\n                return False\n        elif i >= 0 or j >= 0:\n            # One string has characters left, the other doesn't\n            return False\n\n        i -= 1\n        j -= 1\n\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "s_hash": [
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "s_skip": [
        13
      ],
      "s_valid": [
        9
      ],
      "t_hash": [
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "t_skip": [
        24
      ],
      "t_valid": [
        20
      ],
      "match": [
        32
      ],
      "mismatch": [
        32
      ],
      "one_remaining": [
        34
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        10
      ],
      "s_skip_gt_0": [
        13
      ],
      "t_is_hash": [
        21
      ],
      "t_skip_gt_0": [
        24
      ],
      "both_valid": [
        31
      ],
      "chars_not_equal": [
        32
      ],
      "one_remaining": [
        34
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean backspaceCompare(String s, String t) {\n        int i = s.length() - 1;\n        int j = t.length() - 1;\n        int skipS = 0;\n        int skipT = 0;\n\n        while (i >= 0 || j >= 0) {\n            // Find the next valid character in s\n            while (i >= 0) {\n                if (s.charAt(i) == '#') {\n                    skipS++;\n                    i--;\n                } else if (skipS > 0) {\n                    skipS--;\n                    i--;\n                } else {\n                    break;\n                }\n            }\n\n            // Find the next valid character in t\n            while (j >= 0) {\n                if (t.charAt(j) == '#') {\n                    skipT++;\n                    j--;\n                } else if (skipT > 0) {\n                    skipT--;\n                    j--;\n                } else {\n                    break;\n                }\n            }\n\n            // Compare the two valid characters\n            if (i >= 0 && j >= 0) {\n                if (s.charAt(i) != t.charAt(j)) {\n                    return false;\n                }\n            } else if (i >= 0 || j >= 0) {\n                // One string has characters left, the other doesn't\n                return false;\n            }\n\n            i--;\n            j--;\n        }\n\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5,
        6
      ],
      "s_hash": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "s_skip": [
        14
      ],
      "s_valid": [
        10
      ],
      "t_hash": [
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31
      ],
      "t_skip": [
        27
      ],
      "t_valid": [
        23
      ],
      "match": [
        37
      ],
      "mismatch": [
        37
      ],
      "one_remaining": [
        40
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        11
      ],
      "s_skip_gt_0": [
        14
      ],
      "t_is_hash": [
        24
      ],
      "t_skip_gt_0": [
        27
      ],
      "both_valid": [
        36
      ],
      "chars_not_equal": [
        37
      ],
      "one_remaining": [
        40
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool backspaceCompare(string s, string t) {\n        int i = s.length() - 1;\n        int j = t.length() - 1;\n        int skipS = 0;\n        int skipT = 0;\n\n        while (i >= 0 || j >= 0) {\n            // Find the next valid character in s\n            while (i >= 0) {\n                if (s[i] == '#') {\n                    skipS++;\n                    i--;\n                } else if (skipS > 0) {\n                    skipS--;\n                    i--;\n                } else {\n                    break;\n                }\n            }\n\n            // Find the next valid character in t\n            while (j >= 0) {\n                if (t[j] == '#') {\n                    skipT++;\n                    j--;\n                } else if (skipT > 0) {\n                    skipT--;\n                    j--;\n                } else {\n                    break;\n                }\n            }\n\n            // Compare the two valid characters\n            if (i >= 0 && j >= 0) {\n                if (s[i] != t[j]) {\n                    return false;\n                }\n            } else if (i >= 0 || j >= 0) {\n                // One string has characters left, the other doesn't\n                return false;\n            }\n\n            i--;\n            j--;\n        }\n\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5,
        6,
        7
      ],
      "s_hash": [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "s_skip": [
        15
      ],
      "s_valid": [
        11
      ],
      "t_hash": [
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "t_skip": [
        28
      ],
      "t_valid": [
        24
      ],
      "match": [
        38
      ],
      "mismatch": [
        38
      ],
      "one_remaining": [
        41
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        12
      ],
      "s_skip_gt_0": [
        15
      ],
      "t_is_hash": [
        25
      ],
      "t_skip_gt_0": [
        28
      ],
      "both_valid": [
        37
      ],
      "chars_not_equal": [
        38
      ],
      "one_remaining": [
        41
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool BackspaceCompare(string s, string t) {\n        int i = s.Length - 1;\n        int j = t.Length - 1;\n        int skipS = 0;\n        int skipT = 0;\n\n        while (i >= 0 || j >= 0) {\n            // Find the next valid character in s\n            while (i >= 0) {\n                if (s[i] == '#') {\n                    skipS++;\n                    i--;\n                } else if (skipS > 0) {\n                    skipS--;\n                    i--;\n                } else {\n                    break;\n                }\n            }\n\n            // Find the next valid character in t\n            while (j >= 0) {\n                if (t[j] == '#') {\n                    skipT++;\n                    j--;\n                } else if (skipT > 0) {\n                    skipT--;\n                    j--;\n                } else {\n                    break;\n                }\n            }\n\n            // Compare the two valid characters\n            if (i >= 0 && j >= 0) {\n                if (s[i] != t[j]) {\n                    return false;\n                }\n            } else if (i >= 0 || j >= 0) {\n                // One string has characters left, the other doesn't\n                return false;\n            }\n\n            i--;\n            j--;\n        }\n\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5,
        6
      ],
      "s_hash": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "s_skip": [
        14
      ],
      "s_valid": [
        10
      ],
      "t_hash": [
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31
      ],
      "t_skip": [
        27
      ],
      "t_valid": [
        23
      ],
      "match": [
        37
      ],
      "mismatch": [
        37
      ],
      "one_remaining": [
        40
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        11
      ],
      "s_skip_gt_0": [
        14
      ],
      "t_is_hash": [
        24
      ],
      "t_skip_gt_0": [
        27
      ],
      "both_valid": [
        36
      ],
      "chars_not_equal": [
        37
      ],
      "one_remaining": [
        40
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func backspaceCompare(s string, t string) bool {\n    i := len(s) - 1\n    j := len(t) - 1\n    skipS := 0\n    skipT := 0\n\n    for i >= 0 || j >= 0 {\n        // Find the next valid character in s\n        for i >= 0 {\n            if s[i] == '#' {\n                skipS++\n                i--\n            } else if skipS > 0 {\n                skipS--\n                i--\n            } else {\n                break\n            }\n        }\n\n        // Find the next valid character in t\n        for j >= 0 {\n            if t[j] == '#' {\n                skipT++\n                j--\n            } else if skipT > 0 {\n                skipT--\n                j--\n            } else {\n                break\n            }\n        }\n\n        // Compare the two valid characters\n        if i >= 0 && j >= 0 {\n            if s[i] != t[j] {\n                return false\n            }\n        } else if i >= 0 || j >= 0 {\n            // One string has characters left, the other doesn't\n            return false\n        }\n\n        i--\n        j--\n    }\n\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "s_hash": [
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "s_skip": [
        13
      ],
      "s_valid": [
        9
      ],
      "t_hash": [
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "t_skip": [
        26
      ],
      "t_valid": [
        22
      ],
      "match": [
        36
      ],
      "mismatch": [
        36
      ],
      "one_remaining": [
        39
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        10
      ],
      "s_skip_gt_0": [
        13
      ],
      "t_is_hash": [
        23
      ],
      "t_skip_gt_0": [
        26
      ],
      "both_valid": [
        35
      ],
      "chars_not_equal": [
        36
      ],
      "one_remaining": [
        39
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function backspaceCompare(s, t) {\n  let i = s.length - 1;\n  let j = t.length - 1;\n  let skipS = 0;\n  let skipT = 0;\n\n  while (i >= 0 || j >= 0) {\n    // Find the next valid character in s\n    while (i >= 0) {\n      if (s[i] === \"#\") {\n        skipS++;\n        i--;\n      } else if (skipS > 0) {\n        skipS--;\n        i--;\n      } else {\n        break;\n      }\n    }\n\n    // Find the next valid character in t\n    while (j >= 0) {\n      if (t[j] === \"#\") {\n        skipT++;\n        j--;\n      } else if (skipT > 0) {\n        skipT--;\n        j--;\n      } else {\n        break;\n      }\n    }\n\n    // Compare the two valid characters\n    if (i >= 0 && j >= 0) {\n      if (s[i] !== t[j]) {\n        return false;\n      }\n    } else if (i >= 0 || j >= 0) {\n      // One string has characters left, the other doesn't\n      return false;\n    }\n\n    i--;\n    j--;\n  }\n\n  return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "s_hash": [
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "s_skip": [
        13
      ],
      "s_valid": [
        9
      ],
      "t_hash": [
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "t_skip": [
        26
      ],
      "t_valid": [
        22
      ],
      "match": [
        36
      ],
      "mismatch": [
        36
      ],
      "one_remaining": [
        39
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        10
      ],
      "s_skip_gt_0": [
        13
      ],
      "t_is_hash": [
        23
      ],
      "t_skip_gt_0": [
        26
      ],
      "both_valid": [
        35
      ],
      "chars_not_equal": [
        36
      ],
      "one_remaining": [
        39
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function backspaceCompare(s: string, t: string): boolean {\n    let i = s.length - 1;\n    let j = t.length - 1;\n    let skipS = 0;\n    let skipT = 0;\n\n    while (i >= 0 || j >= 0) {\n        // Find the next valid character in s\n        while (i >= 0) {\n            if (s[i] === '#') {\n                skipS++;\n                i--;\n            } else if (skipS > 0) {\n                skipS--;\n                i--;\n            } else {\n                break;\n            }\n        }\n\n        // Find the next valid character in t\n        while (j >= 0) {\n            if (t[j] === '#') {\n                skipT++;\n                j--;\n            } else if (skipT > 0) {\n                skipT--;\n                j--;\n            } else {\n                break;\n            }\n        }\n\n        // Compare the two valid characters\n        if (i >= 0 && j >= 0) {\n            if (s[i] !== t[j]) {\n                return false;\n            }\n        } else if (i >= 0 || j >= 0) {\n            // One string has characters left, the other doesn't\n            return false;\n        }\n\n        i--;\n        j--;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "s_hash": [
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "s_skip": [
        13
      ],
      "s_valid": [
        9
      ],
      "t_hash": [
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "t_skip": [
        26
      ],
      "t_valid": [
        22
      ],
      "match": [
        36
      ],
      "mismatch": [
        36
      ],
      "one_remaining": [
        39
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "s_is_hash": [
        10
      ],
      "s_skip_gt_0": [
        13
      ],
      "t_is_hash": [
        23
      ],
      "t_skip_gt_0": [
        26
      ],
      "both_valid": [
        35
      ],
      "chars_not_equal": [
        36
      ],
      "one_remaining": [
        39
      ]
    }
  }
};

const BackspaceStringComparePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "ab#c",
      "t": "ad#c"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "ab##",
      "t": "c#d#"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "a#c",
      "t": "b"
    }
  }
];

function generateBackspaceStringCompareSteps(e: any): any[] {
  let r=e=>{let t=[];for(let i of e)'#'===i?t.pop():t.push(i);return t.join('')};
let t=e.s,i=e.t,s=r(t),n=r(i),l={};for(let e=0;e<t.length;e++)l[`bar_s_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<i.length;e++)l[`bar_t_${e}`]={type:"arrayElement",value:i[e],position:e};let c=new StepRecorder({s:t,t:i,reducedS:s,reducedT:n},{...l}),o=e=>c.update_variable("exprParts",e);c.record("-",`Reduce "${t}" and "${i}" with backspaces, then compare`),c.update_variable("phase","init"),c.record("init","Build each string's reduced form, then compare");let d=(e,t)=>{if(t.length>0){let i=t.length-1;c.update_visual(`red_${e}_${i}`,{type:"arrayElement",value:t[i],position:i})}},h=(e,t,i)=>{c.update_variable("phase",i),c.update_visual(`read_${e}`,{type:"pointer",position:0,label:"s"===e?"i":"j"});let a=[];for(let i=0;i<t.length;i++)if(c.update_visual(`read_${e}`,{type:"pointer",position:i,label:"s"===e?"i":"j"}),"#"===t[i])if(c.add_conditional("is_hash",!0),a.length>0){let t=a.length-1,r=a.pop();c.update_visual(`red_${e}_${t}`,{type:"arrayElement",value:r,position:t,state:"popped"}),o([{t:`${e}[${i}] = `,c:"muted"},{t:"'#'",c:"yellow"},{t:"  →  backspace erases ",c:"muted"},{t:`'${r}'`,c:"red"}]),c.record("erase",`${e}[${i}] = '#': backspace erases '${r}'`),c.delete_visual(`red_${e}_${t}`)}else o([{t:`${e}[${i}] = `,c:"muted"},{t:"'#'",c:"yellow"},{t:"  →  nothing to erase",c:"muted"}]),c.record("erase",`${e}[${i}] = '#': nothing to erase`);else{c.add_conditional("is_hash",!1),d(e,a);let r=a.length;a.push(t[i]),c.update_visual(`red_${e}_${r}`,{type:"arrayElement",value:t[i],position:r,state:"new"}),o([{t:`${e}[${i}] = `,c:"muted"},{t:`'${t[i]}'`,c:"s"===e?"cyan":"yellow"},{t:"  →  keep it",c:"muted"}]),c.record("keep",`${e}[${i}] = '${t[i]}': keep it`)}d(e,a),c.delete_visual(`read_${e}`)};h("s",t,"buildS"),h("t",i,"buildT"),c.update_variable("phase","compare");let p=s.length,u=n.length,g=Math.max(p,u);for(let e=0;e<g;e++){if(c.update_variable("cmpIdx",e),e>=p||e>=u){let t=e>=p?"t":"s",i=("s"===t?s:n)[e];return c.update_visual(`red_${t}_${e}`,{type:"arrayElement",value:i,position:e,state:"bad"}),c.update_variable("verdict","length_diff"),o([]),c.record("length_diff",`reduced lengths differ (${p} vs ${u}): return false`),c.getSteps()}if(s[e]!==n[e])return c.update_visual(`red_s_${e}`,{type:"arrayElement",value:s[e],position:e,state:"bad"}),c.update_visual(`red_t_${e}`,{type:"arrayElement",value:n[e],position:e,state:"bad"}),c.update_variable("verdict","mismatch"),o([]),c.record("mismatch",`'${s[e]}' != '${n[e]}': return false`),c.getSteps();c.update_visual(`red_s_${e}`,{type:"arrayElement",value:s[e],position:e,state:"matched"}),c.update_visual(`red_t_${e}`,{type:"arrayElement",value:n[e],position:e,state:"matched"}),o([{t:`'${s[e]}'`,c:"green"},{t:" == ",c:"muted"},{t:`'${n[e]}'`,c:"green"}]),c.record("compare_char",`reduced[${e}]: '${s[e]}' == '${n[e]}'`)}return c.update_variable("verdict","equal"),o([]),c.record("complete",`Both reduce to "${s}": return true`),c.getSteps()
}

export function BackspaceStringCompareProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BackspaceStringCompareTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBackspaceStringCompareSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Backspace String Compare"
      slug="backspace-string-compare"
      approaches={approaches}
      presets={BackspaceStringComparePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Duplicates from Sorted Array II (remove-duplicates-from-sorted-array-ii)
// ==========================================

const RemoveDuplicatesFromSortedArrayIiTemplates = {
  "python": {
    "language": "python",
    "code": "def removeDuplicates(nums: List[int]) -> int:\n    if len(nums) <= 2:\n        return len(nums)\n\n    # First two elements are always valid\n    write_pos = 2\n\n    for i in range(2, len(nums)):\n        # Compare with element two positions back in result\n        if nums[i] != nums[write_pos - 2]:\n            nums[write_pos] = nums[i]\n            write_pos += 1\n\n    return write_pos",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6
      ],
      "check_element": [
        8
      ],
      "copy_and_advance": [
        11,
        12
      ],
      "skip": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int removeDuplicates(int[] nums) {\n    if (nums.length <= 2) return nums.length;\n\n    // First two elements are always valid\n    int writePos = 2;\n\n    for (int i = 2; i < nums.length; i++) {\n        // Compare with element two positions back in result\n        if (nums[i] != nums[writePos - 2]) {\n            nums[writePos] = nums[i];\n            writePos++;\n        }\n    }\n\n    return writePos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        7
      ],
      "copy_and_advance": [
        10,
        11
      ],
      "skip": [
        9
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int removeDuplicates(vector<int>& nums) {\n    if (nums.size() <= 2) return nums.size();\n\n    // First two elements are always valid\n    int writePos = 2;\n\n    for (int i = 2; i < nums.size(); i++) {\n        // Compare with element two positions back in result\n        if (nums[i] != nums[writePos - 2]) {\n            nums[writePos] = nums[i];\n            writePos++;\n        }\n    }\n\n    return writePos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        7
      ],
      "copy_and_advance": [
        10,
        11
      ],
      "skip": [
        9
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int RemoveDuplicates(int[] nums) {\n    if (nums.Length <= 2) return nums.Length;\n\n    // First two elements are always valid\n    int writePos = 2;\n\n    for (int i = 2; i < nums.Length; i++) {\n        // Compare with element two positions back in result\n        if (nums[i] != nums[writePos - 2]) {\n            nums[writePos] = nums[i];\n            writePos++;\n        }\n    }\n\n    return writePos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        7
      ],
      "copy_and_advance": [
        10,
        11
      ],
      "skip": [
        9
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeDuplicates(nums []int) int {\n    if len(nums) <= 2 {\n        return len(nums)\n    }\n\n    // First two elements are always valid\n    writePos := 2\n\n    for i := 2; i < len(nums); i++ {\n        // Compare with element two positions back in result\n        if nums[i] != nums[writePos-2] {\n            nums[writePos] = nums[i]\n            writePos++\n        }\n    }\n\n    return writePos\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        7
      ],
      "check_element": [
        9
      ],
      "copy_and_advance": [
        12,
        13
      ],
      "skip": [
        11
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var removeDuplicates = function(nums) {\n    if (nums.length <= 2) return nums.length;\n\n    // First two elements are always valid\n    var writePos = 2;\n\n    for (var i = 2; i < nums.length; i++) {\n        // Compare with element two positions back in result\n        if (nums[i] !== nums[writePos - 2]) {\n            nums[writePos] = nums[i];\n            writePos++;\n        }\n    }\n\n    return writePos;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        7
      ],
      "copy_and_advance": [
        10,
        11
      ],
      "skip": [
        9
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeDuplicates(nums: number[]): number {\n    if (nums.length <= 2) return nums.length;\n\n    // First two elements are always valid\n    let writePos = 2;\n\n    for (let i = 2; i < nums.length; i++) {\n        // Compare with element two positions back in result\n        if (nums[i] !== nums[writePos - 2]) {\n            nums[writePos] = nums[i];\n            writePos++;\n        }\n    }\n\n    return writePos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        7
      ],
      "copy_and_advance": [
        10,
        11
      ],
      "skip": [
        9
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_allowed": [
        9
      ]
    }
  }
};

const RemoveDuplicatesFromSortedArrayIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        1,
        1,
        2,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        0,
        0,
        1,
        1,
        1,
        1,
        2,
        3,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "nums": [
        1,
        1,
        1,
        1
      ]
    }
  }
];

function generateRemoveDuplicatesFromSortedArrayIiSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=(e,n,r)=>{let i={};for(let l=0;l<t.length;l++){let s;l===n?s="active":l===r?s="reading":l<e&&(s="placed"),i[`elem_${l}`]={type:"arrayElement",value:t[l],position:l,...s&&{state:s}}}return i},i=(e,t,r=-1,i=-1)=>{for(let[l,s]of Object.entries(n(t,r,i)))e.update_visual(l,s)},l=new StepRecorder({nums:[...t]},{...n(0,-1,-1)});if(l.record("-","Start of algorithm"),t.length<=2)return l.add_new_variable("writePos",t.length),l.add_new_variable("result",t.length),i(l,t.length),l.record("complete",`Array has ${t.length} elements, return ${t.length}`),l.getSteps();let s=1,a=1;l.add_new_variable("writePos",s),l.add_new_variable("count",a),l.update_visual("writePos",{type:"pointer",position:s,label:"writePos"}),i(l,s),l.record("initialize","Initialize writePos = 1 and count = 1 for the first element");for(let e=1;e<t.length;e++){let n=t[e]===t[e-1];l.update_variable("i",e),l.update_visual("i",{type:"pointer",position:e,label:"i"}),l.add_conditional("is_repeat",n),i(l,s,e,e-1),l.record("compare",n?`nums[${e}] = ${t[e]} repeats nums[${e-1}]`:`nums[${e}] = ${t[e]} starts a new run`),a=n?a+1:1,l.update_variable("count",a),i(l,s,e,e-1),l.record(n?"bump_count":"reset_count",n?`Same value again, count = ${a}`:`New value, count back to ${a}`);let r=a<=2;l.add_conditional("is_allowed",r),r?(t[s]=t[e],s++,l.update_variable("nums",[...t]),l.update_variable("writePos",s),l.update_visual("writePos",{type:"pointer",position:Math.min(s,t.length-1),label:"writePos"}),i(l,s,e),l.record("keep",`count = ${a} is within two, write ${t[e]} to index ${s-1}`)):(i(l,s,e),l.record("skip",`count = ${a} is a third copy, skip it`))}return l.add_new_variable("result",s),l.delete_visual("i"),l.delete_visual("writePos"),i(l,s),l.record("complete",`Return writePos = ${s}`),l.getSteps()
}

export function RemoveDuplicatesFromSortedArrayIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveDuplicatesFromSortedArrayIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveDuplicatesFromSortedArrayIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Remove Duplicates from Sorted Array II"
      slug="remove-duplicates-from-sorted-array-ii"
      approaches={approaches}
      presets={RemoveDuplicatesFromSortedArrayIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse String (reverse-string)
// ==========================================

const ReverseStringTemplates = {
  "python": {
    "language": "python",
    "code": "def reverseString(s: list[str]) -> None:\n    left = 0\n    right = len(s) - 1\n\n    while left < right:\n        # Swap characters at the two pointers\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7
      ],
      "move": [
        8,
        9
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void reverseString(char[] s) {\n    int left = 0;\n    int right = s.length - 1;\n\n    while (left < right) {\n        // Swap characters at the two pointers\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7,
        8,
        9
      ],
      "move": [
        10,
        11
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void reverseString(vector<char>& s) {\n    int left = 0;\n    int right = s.size() - 1;\n\n    while (left < right) {\n        // Swap characters at the two pointers\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7,
        8,
        9
      ],
      "move": [
        10,
        11
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void ReverseString(char[] s) {\n    int left = 0;\n    int right = s.Length - 1;\n\n    while (left < right) {\n        // Swap characters at the two pointers\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7,
        8,
        9
      ],
      "move": [
        10,
        11
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseString(s []byte) {\n    left := 0\n    right := len(s) - 1\n\n    for left < right {\n        // Swap characters at the two pointers\n        s[left], s[right] = s[right], s[left]\n        left++\n        right--\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7
      ],
      "move": [
        8,
        9
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseString = function(s) {\n    let left = 0;\n    let right = s.length - 1;\n\n    while (left < right) {\n        // Swap characters at the two pointers\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7
      ],
      "move": [
        8,
        9
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseString(s: string[]): void {\n    let left = 0;\n    let right = s.length - 1;\n\n    while (left < right) {\n        // Swap characters at the two pointers\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compare": [
        5
      ],
      "swap": [
        7
      ],
      "move": [
        8,
        9
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "while_check": [
        5
      ]
    }
  }
};

const ReverseStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "hello",
    "value": {
      "s": "hello"
    }
  },
  {
    "id": "ex2",
    "label": "HannaH",
    "value": {
      "s": "HannaH"
    }
  },
  {
    "id": "ex3",
    "label": "ABCD",
    "value": {
      "s": "ABCD"
    }
  }
];

function generateReverseStringSteps(e: any): any[] {
  let t=Array.from(String(e?.s??"")),r=t.length,n=[],a=new Set,l=()=>{let e={};for(let i=0;i<r;i++)e[`char_${i}`]={type:"arrayElement",value:t[i],position:i,...a.has(i)&&{state:"complete"}};return e},s=new StepRecorder({s:t.join("")},{...l(),meta_stack:{type:"metadata",value:[]}}),o=(e,t)=>{for(let[e,t]of Object.entries(l()))s.update_visual(e,t);e>=0&&e<r?s.update_visual("ptr_left",{type:"pointer",position:e,label:"left"}):s.delete_visual("ptr_left"),t>=0&&t<r?s.update_visual("ptr_right",{type:"pointer",position:t,label:"right"}):s.delete_visual("ptr_right"),s.update_visual("meta_stack",{type:"metadata",value:n.map(e=>({...e}))})};s.record("-",`Start: reverse "${t.join("")}" by recursion`);let c=(e,r)=>{let i={left:e,right:r,state:"open"};if(n.push(i),s.update_variable("left",e),s.update_variable("right",r),o(e,r),s.record("call",`helper(${e}, ${r}) starts, ${n.length} call${1===n.length?"":"s"} on the stack`),e>=r){i.state="base",e===r&&a.add(e),s.add_conditional("base_check",!0),o(e,r),s.record("base_case",e===r?`left and right meet at ${e}, so '${t[e]}' stays where it is`:"left has passed right, so there is nothing left to swap"),n.pop();return}s.add_conditional("base_check",!1);let l=t[e];t[e]=t[r],t[r]=l,a.add(e),a.add(r),s.update_variable("s",t.join("")),o(e,r),s.record("swap",`Swap s[${e}] and s[${r}], now '${t[e]}' and '${t[r]}'`),o(e,r),s.record("recurse",`Hand the pair inside to helper(${e+1}, ${r-1})`),c(e+1,r-1),s.update_variable("left",e),s.update_variable("right",r),o(e,r),s.record("return",`helper(${e}, ${r}) is done and leaves the stack`),n.pop()};return c(0,r-1),o(-1,-1),s.record("complete",`Done, s is now "${t.join("")}"`),s.getSteps()
}

export function ReverseStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseStringSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Reverse String"
      slug="reverse-string"
      approaches={approaches}
      presets={ReverseStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Squares of a Sorted Array (squares-of-a-sorted-array)
// ==========================================

const SquaresOfASortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def sortedSquares(nums):\n    n = len(nums)\n    result = [0] * n\n    left = 0\n    right = n - 1\n\n    # Fill result from back to front with the larger square\n    for pos in range(n - 1, -1, -1):\n        left_sq = nums[left] * nums[left]\n        right_sq = nums[right] * nums[right]\n\n        if left_sq > right_sq:\n            result[pos] = left_sq\n            left += 1\n        else:\n            result[pos] = right_sq\n            right -= 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] sortedSquares(int[] nums) {\n    int n = nums.length;\n    int[] result = new int[n];\n    int left = 0;\n    int right = n - 1;\n\n    // Fill result from back to front with the larger square\n    for (int pos = n - 1; pos >= 0; pos--) {\n        int leftSq = nums[left] * nums[left];\n        int rightSq = nums[right] * nums[right];\n\n        if (leftSq > rightSq) {\n            result[pos] = leftSq;\n            left++;\n        } else {\n            result[pos] = rightSq;\n            right--;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> sortedSquares(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> result(n);\n    int left = 0;\n    int right = n - 1;\n\n    // Fill result from back to front with the larger square\n    for (int pos = n - 1; pos >= 0; pos--) {\n        int leftSq = nums[left] * nums[left];\n        int rightSq = nums[right] * nums[right];\n\n        if (leftSq > rightSq) {\n            result[pos] = leftSq;\n            left++;\n        } else {\n            result[pos] = rightSq;\n            right--;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] SortedSquares(int[] nums) {\n    int n = nums.Length;\n    int[] result = new int[n];\n    int left = 0;\n    int right = n - 1;\n\n    // Fill result from back to front with the larger square\n    for (int pos = n - 1; pos >= 0; pos--) {\n        int leftSq = nums[left] * nums[left];\n        int rightSq = nums[right] * nums[right];\n\n        if (leftSq > rightSq) {\n            result[pos] = leftSq;\n            left++;\n        } else {\n            result[pos] = rightSq;\n            right--;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sortedSquares(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n    left := 0\n    right := n - 1\n\n    // Fill result from back to front with the larger square\n    for pos := n - 1; pos >= 0; pos-- {\n        leftSq := nums[left] * nums[left]\n        rightSq := nums[right] * nums[right]\n\n        if leftSq > rightSq {\n            result[pos] = leftSq\n            left++\n        } else {\n            result[pos] = rightSq\n            right--\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function sortedSquares(nums) {\n    const n = nums.length;\n    const result = new Array(n);\n    let left = 0;\n    let right = n - 1;\n\n    // Fill result from back to front with the larger square\n    for (let pos = n - 1; pos >= 0; pos--) {\n        const leftSq = nums[left] * nums[left];\n        const rightSq = nums[right] * nums[right];\n\n        if (leftSq > rightSq) {\n            result[pos] = leftSq;\n            left++;\n        } else {\n            result[pos] = rightSq;\n            right--;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortedSquares(nums: number[]): number[] {\n    const n = nums.length;\n    const result = new Array<number>(n);\n    let left = 0;\n    let right = n - 1;\n\n    // Fill result from back to front with the larger square\n    for (let pos = n - 1; pos >= 0; pos--) {\n        const leftSq = nums[left] * nums[left];\n        const rightSq = nums[right] * nums[right];\n\n        if (leftSq > rightSq) {\n            result[pos] = leftSq;\n            left++;\n        } else {\n            result[pos] = rightSq;\n            right--;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "compute_squares": [
        9,
        10
      ],
      "place_left": [
        13,
        14
      ],
      "place_right": [
        16,
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "left_greater": [
        12
      ]
    }
  }
};

const SquaresOfASortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        -4,
        -1,
        0,
        3,
        10
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        -7,
        -3,
        2,
        3,
        11
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Negative",
    "value": {
      "nums": [
        -5,
        -3,
        -2,
        -1
      ]
    }
  }
];

function generateSquaresOfASortedArraySteps(e: any): any[] {
  let t=[...e.nums],r=t.length,l={};for(let e=0;e<r;e++)l[`bar_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<r;e++)l[`res_${e}`]={type:"arrayElement",value:"",position:e,state:"inactive"};let i=new StepRecorder({nums:t},{...l});i.record("-",`Start: Compute squares of sorted array [${t.join(", ")}]`);let a=0,s=r-1,o=Array(r);i.add_new_variable("left",a),i.add_new_variable("right",s),i.add_new_variable("pos",r-1),i.add_new_visual("ptr_left",{type:"pointer",position:a,label:"left"}),i.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),i.add_new_visual("ptr_pos",{type:"pointer",position:r-1,label:"pos"}),i.record("init",`Initialize: left=0, right=${r-1}, pos=${r-1}`);for(let e=r-1;e>=0;e--){let r=t[a]*t[a],n=t[s]*t[s];i.update_variable("pos",e),i.update_visual("ptr_pos",{type:"pointer",position:e,label:"pos"}),i.update_visual(`bar_${a}`,{type:"arrayElement",value:t[a],position:a,state:"highlight"}),i.update_visual(`bar_${s}`,{type:"arrayElement",value:t[s],position:s,state:"highlight"}),i.add_new_variable("leftSq",r),i.add_new_variable("rightSq",n),i.record("compute_squares",`Compare: nums[${a}]\xb2=${r} vs nums[${s}]\xb2=${n}`);let l=r>n;i.add_conditional("left_greater",l),l?(o[e]=r,i.update_visual(`res_${e}`,{type:"arrayElement",value:r,position:e,state:"result"}),i.update_visual(`bar_${a}`,{type:"arrayElement",value:t[a],position:a,state:"active"}),a!==s&&i.update_visual(`bar_${s}`,{type:"arrayElement",value:t[s],position:s}),i.record("place_left",`leftSq(${r}) > rightSq(${n}): place ${r} at result[${e}], left++`),a++,i.update_variable("left",a),i.update_visual("ptr_left",{type:"pointer",position:a,label:"left"})):(o[e]=n,i.update_visual(`res_${e}`,{type:"arrayElement",value:n,position:e,state:"result"}),i.update_visual(`bar_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),a!==s&&i.update_visual(`bar_${a}`,{type:"arrayElement",value:t[a],position:a}),i.record("place_right",`rightSq(${n}) >= leftSq(${r}): place ${n} at result[${e}], right--`),s--,i.update_variable("right",s),i.update_visual("ptr_right",{type:"pointer",position:s,label:"right"}))}return i.delete_visual("ptr_left"),i.delete_visual("ptr_right"),i.delete_visual("ptr_pos"),i.record("complete",`Done: result = [${o.join(", ")}]`),i.getSteps()
}

export function SquaresOfASortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SquaresOfASortedArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSquaresOfASortedArraySteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Squares of a Sorted Array"
      slug="squares-of-a-sorted-array"
      approaches={approaches}
      presets={SquaresOfASortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Merge Strings Alternately (merge-strings-alternately)
// ==========================================

const MergeStringsAlternatelyTemplates = {
  "python": {
    "language": "python",
    "code": "def mergeAlternately(word1, word2):\n    result = []\n    max_len = max(len(word1), len(word2))\n\n    for i in range(max_len):\n        # Add from word1 if characters remain\n        if i < len(word1):\n            result.append(word1[i])\n        # Add from word2 if characters remain\n        if i < len(word2):\n            result.append(word2[i])\n\n    return ''.join(result)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        11
      ],
      "skip_w2": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String mergeAlternately(String word1, String word2) {\n    StringBuilder result = new StringBuilder();\n    int maxLen = Math.max(word1.length(), word2.length());\n\n    for (int i = 0; i < maxLen; i++) {\n        // Add from word1 if characters remain\n        if (i < word1.length()) {\n            result.append(word1.charAt(i));\n        }\n        // Add from word2 if characters remain\n        if (i < word2.length()) {\n            result.append(word2.charAt(i));\n        }\n    }\n\n    return result.toString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        12
      ],
      "skip_w2": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string mergeAlternately(string word1, string word2) {\n    string result;\n    int maxLen = max(word1.size(), word2.size());\n\n    for (int i = 0; i < maxLen; i++) {\n        // Add from word1 if characters remain\n        if (i < word1.size()) {\n            result += word1[i];\n        }\n        // Add from word2 if characters remain\n        if (i < word2.size()) {\n            result += word2[i];\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        12
      ],
      "skip_w2": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string MergeAlternately(string word1, string word2) {\n    var result = new StringBuilder();\n    int maxLen = Math.Max(word1.Length, word2.Length);\n\n    for (int i = 0; i < maxLen; i++) {\n        // Add from word1 if characters remain\n        if (i < word1.Length) {\n            result.Append(word1[i]);\n        }\n        // Add from word2 if characters remain\n        if (i < word2.Length) {\n            result.Append(word2[i]);\n        }\n    }\n\n    return result.ToString();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        12
      ],
      "skip_w2": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mergeAlternately(word1 string, word2 string) string {\n    var result []byte\n    maxLen := len(word1)\n    if len(word2) > maxLen {\n        maxLen = len(word2)\n    }\n\n    for i := 0; i < maxLen; i++ {\n        // Add from word1 if characters remain\n        if i < len(word1) {\n            result = append(result, word1[i])\n        }\n        // Add from word2 if characters remain\n        if i < len(word2) {\n            result = append(result, word2[i])\n        }\n    }\n\n    return string(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        11
      ],
      "skip_w1": [
        10
      ],
      "append_w2": [
        15
      ],
      "skip_w2": [
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_w1": [
        10
      ],
      "check_w2": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mergeAlternately(word1, word2) {\n  let result = [];\n  let maxLen = Math.max(word1.length, word2.length);\n\n  for (let i = 0; i < maxLen; i++) {\n    // Add from word1 if characters remain\n    if (i < word1.length) {\n      result.push(word1[i]);\n    }\n    // Add from word2 if characters remain\n    if (i < word2.length) {\n      result.push(word2[i]);\n    }\n  }\n\n  return result.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        12
      ],
      "skip_w2": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mergeAlternately(word1: string, word2: string): string {\n    let result: string[] = [];\n    let maxLen = Math.max(word1.length, word2.length);\n\n    for (let i = 0; i < maxLen; i++) {\n        // Add from word1 if characters remain\n        if (i < word1.length) {\n            result.push(word1[i]);\n        }\n        // Add from word2 if characters remain\n        if (i < word2.length) {\n            result.push(word2[i]);\n        }\n    }\n\n    return result.join(\"\");\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "append_w1": [
        8
      ],
      "skip_w1": [
        7
      ],
      "append_w2": [
        12
      ],
      "skip_w2": [
        11
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "check_w1": [
        7
      ],
      "check_w2": [
        11
      ]
    }
  }
};

const MergeStringsAlternatelyPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "word1": "abc",
      "word2": "pqr"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "word1": "ab",
      "word2": "pqrs"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "word1": "abcd",
      "word2": "pq"
    }
  }
];

function generateMergeStringsAlternatelySteps(e: any): any[] {
  let t=e.word1,r=e.word2,a=t.length,n=r.length,l=Math.max(a,n),o={};for(let e=0;e<a;e++)o[`w1_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<n;e++)o[`w2_${e}`]={type:"arrayElement",value:r[e],position:e};let d=new StepRecorder({word1:t,word2:r},{...o}),s=e=>d.update_variable("exprParts",e);d.record("-",`Merge "${t}" and "${r}" by alternating characters`),d.add_new_variable("i",0),d.add_new_variable("result",""),d.add_new_visual("ptr_i1",{type:"pointer",position:0,label:"i"}),d.add_new_visual("ptr_i2",{type:"pointer",position:0,label:"i"}),s([{t:"maxLen = max(",c:"muted"},{t:String(a),c:"cyan"},{t:", ",c:"muted"},{t:String(n),c:"yellow"},{t:") = ",c:"muted"},{t:String(l),c:"plain"}]),d.record("init",`result = "", take one char from each word per round, ${l} rounds`);let p="",c=0;for(let e=0;e<l;e++){if(d.update_variable("i",e),e<a&&d.update_visual("ptr_i1",{type:"pointer",position:e,label:"i"}),e<n&&d.update_visual("ptr_i2",{type:"pointer",position:e,label:"i"}),e<a){d.add_conditional("check_w1",!0);let r=t[e],i=p;p+=r,d.update_variable("result",p),d.update_visual(`w1_${e}`,{type:"arrayElement",value:r,position:e,state:"active"}),d.add_new_visual(`res_${c}`,{type:"arrayElement",value:r,position:c,state:"from_w1"}),d.update_variable("srcWord",1),d.update_variable("srcCol",e),d.update_variable("destSlot",c),s([{t:"result = ",c:"muted"},{t:`"${i}"`,c:"muted"},{t:" + ",c:"muted"},{t:`'${r}'`,c:"cyan"},{t:"  →  ",c:"muted"},{t:`"${p}"`,c:"plain"}]),d.record("append_w1",`word1[${e}] = '${r}' → result = "${p}"`),d.update_visual(`w1_${e}`,{type:"arrayElement",value:r,position:e,state:"used"}),d.delete_variable("srcWord"),d.delete_variable("srcCol"),d.delete_variable("destSlot"),c++}else d.add_conditional("check_w1",!1),e===a&&d.update_visual("ptr_i1",{type:"pointer",position:a-1,label:"i",state:"exiting"}),d.update_variable("skipWord",1),s([{t:`i = ${e}`,c:"plain"},{t:" ≥ ",c:"muted"},{t:`len(word1) = ${a}`,c:"cyan"},{t:"  →  word1 is used up, skip it",c:"yellow"}]),d.record("skip_w1",`i = ${e} ≥ ${a}: word1 has no more characters`),e===a&&d.delete_visual("ptr_i1"),d.delete_variable("skipWord");if(e<n){d.add_conditional("check_w2",!0);let t=r[e],i=p;p+=t,d.update_variable("result",p),d.update_visual(`w2_${e}`,{type:"arrayElement",value:t,position:e,state:"picked"}),d.add_new_visual(`res_${c}`,{type:"arrayElement",value:t,position:c,state:"from_w2"}),d.update_variable("srcWord",2),d.update_variable("srcCol",e),d.update_variable("destSlot",c),s([{t:"result = ",c:"muted"},{t:`"${i}"`,c:"muted"},{t:" + ",c:"muted"},{t:`'${t}'`,c:"yellow"},{t:"  →  ",c:"muted"},{t:`"${p}"`,c:"plain"}]),d.record("append_w2",`word2[${e}] = '${t}' → result = "${p}"`),d.update_visual(`w2_${e}`,{type:"arrayElement",value:t,position:e,state:"used"}),d.delete_variable("srcWord"),d.delete_variable("srcCol"),d.delete_variable("destSlot"),c++}else d.add_conditional("check_w2",!1),e===n&&d.update_visual("ptr_i2",{type:"pointer",position:n-1,label:"i",state:"exiting"}),d.update_variable("skipWord",2),s([{t:`i = ${e}`,c:"plain"},{t:" ≥ ",c:"muted"},{t:`len(word2) = ${n}`,c:"yellow"},{t:"  →  word2 is used up, skip it",c:"yellow"}]),d.record("skip_w2",`i = ${e} ≥ ${n}: word2 has no more characters`),e===n&&d.delete_visual("ptr_i2"),d.delete_variable("skipWord")}let u=d.get_visual("ptr_i1");u&&d.update_visual("ptr_i1",{...u,state:"exiting"});let w=d.get_visual("ptr_i2");return w&&d.update_visual("ptr_i2",{...w,state:"exiting"}),d.update_variable("done",!0),d.update_variable("answer",p),s([]),d.record("complete",`Merged: "${p}"`),d.getSteps()
}

export function MergeStringsAlternatelyProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeStringsAlternatelyTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeStringsAlternatelySteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Merge Strings Alternately"
      slug="merge-strings-alternately"
      approaches={approaches}
      presets={MergeStringsAlternatelyPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Palindrome II (valid-palindrome-ii)
// ==========================================

const ValidPalindromeIiTemplates = {
  "python": {
    "language": "python",
    "code": "def validPalindrome(s: str) -> bool:\n    left = 0\n    right = len(s) - 1\n\n    while left < right:\n        if s[left] != s[right]:\n            # Mismatch: try skipping left or right character\n            return isPalindrome(s, left + 1, right) or isPalindrome(s, left, right - 1)\n        left += 1\n        right -= 1\n\n    return True\n\ndef isPalindrome(s, left, right):\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    # No mismatch found, already a palindrome\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        5
      ],
      "match": [
        9,
        10
      ],
      "mismatch": [
        8
      ],
      "try_skip_left": [
        14
      ],
      "try_skip_right": [
        14
      ],
      "sub_compare": [
        15
      ],
      "sub_match": [
        18,
        19
      ],
      "sub_mismatch": [
        17
      ],
      "sub_complete": [
        21
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "char_equal": [
        6
      ],
      "sub_char_equal": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean validPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) {\n            // Mismatch: try skipping left or right character\n            return isPalindrome(s, left + 1, right)\n                || isPalindrome(s, left, right - 1);\n        }\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nprivate boolean isPalindrome(String s, int left, int right) {\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    // No mismatch found, already a palindrome\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool validPalindrome(string s) {\n    int left = 0, right = s.length() - 1;\n\n    while (left < right) {\n        if (s[left] != s[right]) {\n            // Mismatch: try skipping left or right character\n            return isPalindrome(s, left + 1, right)\n                || isPalindrome(s, left, right - 1);\n        }\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nbool isPalindrome(const string& s, int left, int right) {\n    while (left < right) {\n        if (s[left] != s[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    // No mismatch found, already a palindrome\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool ValidPalindrome(string s) {\n    int left = 0, right = s.Length - 1;\n\n    while (left < right) {\n        if (s[left] != s[right]) {\n            // Mismatch: try skipping left or right character\n            return IsPalindrome(s, left + 1, right)\n                || IsPalindrome(s, left, right - 1);\n        }\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nprivate bool IsPalindrome(string s, int left, int right) {\n    while (left < right) {\n        if (s[left] != s[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    // No mismatch found, already a palindrome\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func validPalindrome(s string) bool {\n    left, right := 0, len(s)-1\n\n    for left < right {\n        if s[left] != s[right] {\n            // Mismatch: try skipping left or right character\n            return isPalindrome(s, left+1, right) ||\n                isPalindrome(s, left, right-1)\n        }\n        left++\n        right--\n    }\n\n    return true\n}\n\nfunc isPalindrome(s string, left, right int) bool {\n    for left < right {\n        if s[left] != s[right] {\n            return false\n        }\n        left++\n        right--\n    }\n    // No mismatch found, already a palindrome\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var validPalindrome = function(s) {\n    let left = 0, right = s.length - 1;\n\n    while (left < right) {\n        if (s[left] !== s[right]) {\n            // Mismatch: try skipping left or right character\n            return isPalindrome(s, left + 1, right)\n                || isPalindrome(s, left, right - 1);\n        }\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nfunction isPalindrome(s, left, right) {\n    while (left < right) {\n        if (s[left] !== s[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    // No mismatch found, already a palindrome\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function validPalindrome(s: string): boolean {\n    let left = 0, right = s.length - 1;\n\n    while (left < right) {\n        if (s[left] !== s[right]) {\n            // Mismatch: try skipping left or right character\n            return isPalindrome(s, left + 1, right)\n                || isPalindrome(s, left, right - 1);\n        }\n        left++;\n        right--;\n    }\n\n    return true;\n}\n\nfunction isPalindrome(s: string, left: number, right: number): boolean {\n    while (left < right) {\n        if (s[left] !== s[right]) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    // No mismatch found, already a palindrome\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        4
      ],
      "match": [
        10,
        11
      ],
      "mismatch": [
        7,
        8
      ],
      "try_skip_left": [
        17
      ],
      "try_skip_right": [
        17
      ],
      "sub_compare": [
        18
      ],
      "sub_match": [
        22,
        23
      ],
      "sub_mismatch": [
        20
      ],
      "sub_complete": [
        26
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "char_equal": [
        5
      ],
      "sub_char_equal": [
        19
      ]
    }
  }
};

const ValidPalindromeIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Skip one",
    "value": {
      "s": "abca"
    }
  },
  {
    "id": "ex2",
    "label": "Already palindrome",
    "value": {
      "s": "aba"
    }
  },
  {
    "id": "ex3",
    "label": "Not possible",
    "value": {
      "s": "abc"
    }
  },
  {
    "id": "ex4",
    "label": "Skip one (longer)",
    "value": {
      "s": "abcbda"
    }
  }
];

function generateValidPalindromeIiSteps(e: any): any[] {
  let t=String(e?.s??""),a=t.length,r=0,l=(e,i)=>{let r={};for(let l=0;l<a;l++){let a=l===e?"muted":i?"matched":void 0;r[`char_${l}`]={type:"arrayElement",value:t[l],position:l,...a&&{state:a}}}return r},s=new StepRecorder({s:t},{...l(-1,!1),meta_probe:{type:"metadata",value:null},meta_compares:{type:"metadata",value:0},meta_verdict:{type:"metadata",value:null}}),n=(e,t,a,i,l,n)=>{let o=Array.from(e,(t,r)=>r===n||n>=0&&r===e.length-1-n?"mismatch":r<l||r>=e.length-l?"matched":r===a||r===i?"active":"");s.update_visual("meta_probe",{type:"metadata",value:{text:e,removed:t,i:a,j:i,states:o}}),s.update_visual("meta_compares",{type:"metadata",value:r})},o=(e,t=!1)=>{for(let[a,i]of Object.entries(l(e,t)))s.update_visual(a,i)};s.record("-",`Start: can "${t}" become a palindrome by removing at most one character?`);let u=(e,t)=>{let a=0,i=e.length-1,l=0;for(;a<i;){let o=e[a]===e[i];if(r++,s.add_conditional("chars_equal",!o),n(e,t,a,i,l,o?-1:a),s.record("compare",`Check '${e[a]}' against '${e[i]}'${o?", same":", different"}`),!o)return s.record("sub_mismatch",`'${e[a]}' and '${e[i]}' differ, this one is not a palindrome`),!1;l++,a++,i--}return n(e,t,-1,-1,l,-1),s.record("sub_palindrome",`"${e}" reads the same both ways`),!0};if(s.update_variable("candidate",t),n(t,-1,-1,-1,0,-1),s.record("check_original","First try the string as it is, with nothing removed"),u(t,-1))return s.add_conditional("original_is_pal",!0),s.update_variable("result",!0),s.update_visual("meta_verdict",{type:"metadata",value:!0}),o(-1,!0),s.record("original_ok",`"${t}" is already a palindrome, so nothing has to be removed`),s.getSteps();s.add_conditional("original_is_pal",!1);for(let e=0;e<a;e++){let a=t.slice(0,e)+t.slice(e+1);if(s.update_variable("i",e),s.update_variable("candidate",a),o(e),n(a,e,-1,-1,0,-1),s.record("remove_char",`Remove s[${e}] = '${t[e]}' and check "${a}"`),u(a,e))return s.add_conditional("candidate_is_pal",!0),s.update_variable("result",!0),s.update_visual("meta_verdict",{type:"metadata",value:!0}),o(e,!0),s.record("candidate_ok",`Removing '${t[e]}' leaves a palindrome, so the answer is true`),s.getSteps();s.add_conditional("candidate_is_pal",!1)}return s.update_variable("result",!1),s.update_visual("meta_verdict",{type:"metadata",value:!1}),o(-1),n(t,-1,-1,-1,0,-1),s.record("reject",`No single removal leaves a palindrome, after ${r} character comparisons`),s.getSteps()
}

export function ValidPalindromeIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidPalindromeIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidPalindromeIiSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Valid Palindrome II"
      slug="valid-palindrome-ii"
      approaches={approaches}
      presets={ValidPalindromeIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Next Permutation (next-permutation)
// ==========================================

const NextPermutationTemplates = {
  "python": {
    "language": "python",
    "code": "def nextPermutation(nums: list[int]) -> None:\n    perms = []\n    generatePerms(nums[:], 0, perms)\n\n    # Sort permutations lexicographically\n    perms.sort()\n\n    # Find current and return next\n    for i in range(len(perms)):\n        if perms[i] == nums:\n            next_perm = perms[(i + 1) % len(perms)]\n            for j in range(len(nums)):\n                nums[j] = next_perm[j]\n            return\n\ndef generatePerms(arr: list[int], start: int, result: list[list[int]]) -> None:\n    if start == len(arr):\n        result.append(arr[:])\n        return\n    # Skip duplicate values at this level to avoid duplicate permutations\n    seen = set()\n    for i in range(start, len(arr)):\n        if arr[i] in seen:\n            continue\n        seen.add(arr[i])\n        arr[start], arr[i] = arr[i], arr[start]\n        generatePerms(arr, start + 1, result)\n        arr[start], arr[i] = arr[i], arr[start]",
    "lineMap": {
      "-": [
        1
      ],
      "generate_start": [
        3,
        6
      ],
      "check_perm": [
        9,
        10
      ],
      "skip_ahead": [
        9
      ],
      "found_current": [
        10
      ],
      "take_next": [
        11,
        12,
        13
      ],
      "wrap_around": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_match": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public void nextPermutation(int[] nums) {\n        List<int[]> perms = new ArrayList<>();\n        generatePerms(nums.clone(), 0, perms);\n\n        // Sort permutations lexicographically\n        perms.sort((a, b) -> {\n            for (int i = 0; i < a.length; i++) {\n                if (a[i] != b[i]) return a[i] - b[i];\n            }\n            return 0;\n        });\n\n        // Find current and return next\n        for (int i = 0; i < perms.size(); i++) {\n            if (Arrays.equals(perms.get(i), nums)) {\n                int[] next = perms.get((i + 1) % perms.size());\n                for (int j = 0; j < nums.length; j++) {\n                    nums[j] = next[j];\n                }\n                return;\n            }\n        }\n    }\n\n    private void generatePerms(int[] arr, int start, List<int[]> result) {\n        if (start == arr.length) {\n            result.add(arr.clone());\n            return;\n        }\n        // Skip duplicate values at this level to avoid duplicate permutations\n        Set<Integer> seen = new HashSet<>();\n        for (int i = start; i < arr.length; i++) {\n            if (!seen.add(arr[i])) continue;\n            int temp = arr[start];\n            arr[start] = arr[i];\n            arr[i] = temp;\n            generatePerms(arr, start + 1, result);\n            temp = arr[start];\n            arr[start] = arr[i];\n            arr[i] = temp;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "generate_start": [
        4,
        7
      ],
      "check_perm": [
        15,
        16
      ],
      "skip_ahead": [
        15
      ],
      "found_current": [
        16
      ],
      "take_next": [
        17,
        18,
        19
      ],
      "wrap_around": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_match": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    void nextPermutation(vector<int>& nums) {\n        vector<vector<int>> perms;\n        vector<int> arr = nums;\n        generatePerms(arr, 0, perms);\n\n        // Sort permutations lexicographically\n        sort(perms.begin(), perms.end());\n\n        // Find current and return next\n        for (int i = 0; i < (int)perms.size(); i++) {\n            if (perms[i] == nums) {\n                nums = perms[(i + 1) % perms.size()];\n                return;\n            }\n        }\n    }\n\nprivate:\n    void generatePerms(vector<int>& arr, int start, vector<vector<int>>& result) {\n        if (start == (int)arr.size()) {\n            result.push_back(arr);\n            return;\n        }\n        // Skip duplicate values at this level to avoid duplicate permutations\n        unordered_set<int> seen;\n        for (int i = start; i < (int)arr.size(); i++) {\n            if (seen.count(arr[i])) continue;\n            seen.insert(arr[i]);\n            swap(arr[start], arr[i]);\n            generatePerms(arr, start + 1, result);\n            swap(arr[start], arr[i]);\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "generate_start": [
        6,
        9
      ],
      "check_perm": [
        12,
        13
      ],
      "skip_ahead": [
        12
      ],
      "found_current": [
        13
      ],
      "take_next": [
        14
      ],
      "wrap_around": [
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_match": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public void NextPermutation(int[] nums) {\n        var perms = new List<int[]>();\n        GeneratePerms(nums.ToArray(), 0, perms);\n\n        // Sort permutations lexicographically\n        perms.Sort((a, b) => {\n            for (int i = 0; i < a.Length; i++) {\n                if (a[i] != b[i]) return a[i] - b[i];\n            }\n            return 0;\n        });\n\n        // Find current and return next\n        for (int i = 0; i < perms.Count; i++) {\n            if (perms[i].SequenceEqual(nums)) {\n                int[] next = perms[(i + 1) % perms.Count];\n                for (int j = 0; j < nums.Length; j++) {\n                    nums[j] = next[j];\n                }\n                return;\n            }\n        }\n    }\n\n    private void GeneratePerms(int[] arr, int start, List<int[]> result) {\n        if (start == arr.Length) {\n            result.Add(arr.ToArray());\n            return;\n        }\n        // Skip duplicate values at this level to avoid duplicate permutations\n        var seen = new HashSet<int>();\n        for (int i = start; i < arr.Length; i++) {\n            if (!seen.Add(arr[i])) continue;\n            int temp = arr[start];\n            arr[start] = arr[i];\n            arr[i] = temp;\n            GeneratePerms(arr, start + 1, result);\n            temp = arr[start];\n            arr[start] = arr[i];\n            arr[i] = temp;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "generate_start": [
        4,
        7
      ],
      "check_perm": [
        15,
        16
      ],
      "skip_ahead": [
        15
      ],
      "found_current": [
        16
      ],
      "take_next": [
        17,
        18,
        19
      ],
      "wrap_around": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_match": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nextPermutation(nums []int) {\n    perms := [][]int{}\n    temp := make([]int, len(nums))\n    copy(temp, nums)\n    generatePerms(temp, 0, &perms)\n\n    // Sort permutations lexicographically\n    sort.Slice(perms, func(i, j int) bool {\n        for k := 0; k < len(perms[i]); k++ {\n            if perms[i][k] != perms[j][k] {\n                return perms[i][k] < perms[j][k]\n            }\n        }\n        return false\n    })\n\n    // Find current and return next\n    for i := 0; i < len(perms); i++ {\n        if equal(perms[i], nums) {\n            next := perms[(i+1)%len(perms)]\n            copy(nums, next)\n            return\n        }\n    }\n}\n\nfunc generatePerms(arr []int, start int, result *[][]int) {\n    if start == len(arr) {\n        temp := make([]int, len(arr))\n        copy(temp, arr)\n        *result = append(*result, temp)\n        return\n    }\n    // Skip duplicate values at this level to avoid duplicate permutations\n    seen := map[int]bool{}\n    for i := start; i < len(arr); i++ {\n        if seen[arr[i]] {\n            continue\n        }\n        seen[arr[i]] = true\n        arr[start], arr[i] = arr[i], arr[start]\n        generatePerms(arr, start+1, result)\n        arr[start], arr[i] = arr[i], arr[start]\n    }\n}\n\nfunc equal(a, b []int) bool {\n    for i := range a {\n        if a[i] != b[i] {\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "generate_start": [
        5,
        8
      ],
      "check_perm": [
        18,
        19
      ],
      "skip_ahead": [
        18
      ],
      "found_current": [
        19
      ],
      "take_next": [
        20,
        21
      ],
      "wrap_around": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_match": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var nextPermutation = function(nums) {\n    var perms = [];\n    generatePerms(nums.slice(), 0, perms);\n\n    // Sort permutations lexicographically\n    perms.sort(function(a, b) {\n        for (var i = 0; i < a.length; i++) {\n            if (a[i] !== b[i]) return a[i] - b[i];\n        }\n        return 0;\n    });\n\n    // Find current and return next\n    for (var i = 0; i < perms.length; i++) {\n        if (perms[i].every(function(val, idx) { return val === nums[idx]; })) {\n            var next = perms[(i + 1) % perms.length];\n            for (var j = 0; j < nums.length; j++) {\n                nums[j] = next[j];\n            }\n            return;\n        }\n    }\n};\n\nfunction generatePerms(arr, start, result) {\n    if (start === arr.length) {\n        result.push(arr.slice());\n        return;\n    }\n    // Skip duplicate values at this level to avoid duplicate permutations\n    var seen = new Set();\n    for (var i = start; i < arr.length; i++) {\n        if (seen.has(arr[i])) continue;\n        seen.add(arr[i]);\n        var temp = arr[start];\n        arr[start] = arr[i];\n        arr[i] = temp;\n        generatePerms(arr, start + 1, result);\n        temp = arr[start];\n        arr[start] = arr[i];\n        arr[i] = temp;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "generate_start": [
        3,
        6
      ],
      "check_perm": [
        14,
        15
      ],
      "skip_ahead": [
        14
      ],
      "found_current": [
        15
      ],
      "take_next": [
        16,
        17,
        18
      ],
      "wrap_around": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_match": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nextPermutation(nums: number[]): void {\n    const perms: number[][] = [];\n    generatePerms(nums.slice(), 0, perms);\n\n    // Sort permutations lexicographically\n    perms.sort((a, b) => {\n        for (let i = 0; i < a.length; i++) {\n            if (a[i] !== b[i]) return a[i] - b[i];\n        }\n        return 0;\n    });\n\n    // Find current and return next\n    for (let i = 0; i < perms.length; i++) {\n        if (perms[i].every((val, idx) => val === nums[idx])) {\n            const next = perms[(i + 1) % perms.length];\n            for (let j = 0; j < nums.length; j++) {\n                nums[j] = next[j];\n            }\n            return;\n        }\n    }\n}\n\nfunction generatePerms(arr: number[], start: number, result: number[][]): void {\n    if (start === arr.length) {\n        result.push(arr.slice());\n        return;\n    }\n    // Skip duplicate values at this level to avoid duplicate permutations\n    const seen = new Set<number>();\n    for (let i = start; i < arr.length; i++) {\n        if (seen.has(arr[i])) continue;\n        seen.add(arr[i]);\n        const temp = arr[start];\n        arr[start] = arr[i];\n        arr[i] = temp;\n        generatePerms(arr, start + 1, result);\n        const tempBack = arr[start];\n        arr[start] = arr[i];\n        arr[i] = tempBack;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "generate_start": [
        3,
        6
      ],
      "check_perm": [
        14,
        15
      ],
      "skip_ahead": [
        14
      ],
      "found_current": [
        15
      ],
      "take_next": [
        16,
        17,
        18
      ],
      "wrap_around": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_match": [
        15
      ]
    }
  }
};

const NextPermutationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Descending",
    "value": {
      "nums": [
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Duplicates",
    "value": {
      "nums": [
        1,
        1,
        5
      ]
    }
  }
];

function generateNextPermutationSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.length,n=[];{let e=[...t],r=t=>{if(t===i)return void n.push([...e]);let a=new Set;for(let n=t;n<i;n++)a.has(e[n])||(a.add(e[n]),[e[t],e[n]]=[e[n],e[t]],r(t+1),[e[t],e[n]]=[e[n],e[t]])};r(0)}n.sort((e,t)=>{for(let i=0;i<e.length;i++)if(e[i]!==t[i])return e[i]-t[i];return 0});let a=n.length,s=Math.max(0,n.findIndex(e=>e.every((e,i)=>e===t[i]))),l=s===a-1,o=n[(s+1)%a],u=(e,t)=>{let i={};return e.forEach((e,r)=>{i[`elem_${r}`]={type:"arrayElement",value:e,position:r,...t&&{state:t}}}),i},p=(e,t,i)=>{for(let[r,n]of Object.entries(u(t,i)))e.update_visual(r,n)},c=new StepRecorder({nums:[...t],total:a},{...u(t),meta_reference:{type:"metadata",value:[...t]},meta_checked:{type:"metadata",value:0},meta_total:{type:"metadata",value:a},meta_stages:{type:"metadata",value:["active","pending","pending"]},meta_flash:{type:"metadata",value:null}});c.record("-","Start: every permutation of nums, in order, holds the answer"),c.add_new_variable("perms",a),c.update_visual("meta_stages",{type:"metadata",value:["done","active","pending"]}),p(c,n[0]),c.record("generate_start",`Generate all ${a} permutation${1===a?"":"s"} by swapping, sort them into increasing order, then walk them`);let d=[];if(a<=24)for(let e=0;e<=s;e++)d.push(e);else{let e=new Set;for(let t=0;t<Math.min(4,s+1);t++)e.add(t);for(let t=Math.max(0,s-3);t<=s;t++)e.add(t);d.push(...[...e].sort((e,t)=>e-t))}let m=-1;for(let e of d){let t=e-m-1;t>0&&(c.update_visual("meta_checked",{type:"metadata",value:e}),c.update_visual("meta_flash",{type:"metadata",value:"skip"}),p(c,n[e],"skipped"),c.record("skip_ahead",`${t} permutation${1===t?"":"s"} in between are all smaller than nums, keep walking`)),m=e;let i=e===s;c.update_variable("k",e),c.update_visual("meta_checked",{type:"metadata",value:e+1}),c.update_visual("meta_flash",{type:"metadata",value:i?"match":null}),c.add_conditional("is_match",i),i?(c.update_visual("meta_stages",{type:"metadata",value:["done","done","active"]}),p(c,n[e],"match"),c.record("found_current",`Permutation #${e+1} is nums itself`)):(p(c,n[e]),c.record("check_perm",`Permutation #${e+1} is [${n[e].join(", ")}], still smaller than nums`))}return c.add_new_variable("result",[...o]),c.update_visual("meta_checked",{type:"metadata",value:s+1}),c.update_visual("meta_flash",{type:"metadata",value:"answer"}),p(c,o,"answer"),l?c.record("wrap_around",`nums is the last permutation, so wrap around to the first: [${o.join(", ")}]`):c.record("take_next",`The permutation right after nums is [${o.join(", ")}]`),c.update_variable("nums",[...o]),c.update_visual("meta_stages",{type:"metadata",value:["done","done","done"]}),p(c,o,"answer"),c.record("complete",`Next permutation: [${o.join(", ")}]`),c.getSteps()
}

export function NextPermutationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NextPermutationTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNextPermutationSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { elements, pointers } = elementsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <ArrayVisualizer elements={elements} pointers={pointers} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Next Permutation"
      slug="next-permutation"
      approaches={approaches}
      presets={NextPermutationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
