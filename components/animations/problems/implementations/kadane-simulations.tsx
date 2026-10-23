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
// Maximum Subarray (maximum-subarray)
// ==========================================

const MaximumSubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def maxSubArray(nums):\n    current_sum = nums[0]\n    max_sum = nums[0]\n\n    for i in range(1, len(nums)):\n        # Either extend the previous subarray or start a new one here\n        current_sum = max(nums[i], current_sum + nums[i])\n        max_sum = max(max_sum, current_sum)\n\n    return max_sum",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxSubArray(int[] nums) {\n    int currentSum = nums[0];\n    int maxSum = nums[0];\n\n    for (int i = 1; i < nums.length; i++) {\n        // Either extend the previous subarray or start a new one here\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxSubArray(vector<int>& nums) {\n    int currentSum = nums[0];\n    int maxSum = nums[0];\n\n    for (int i = 1; i < nums.size(); i++) {\n        // Either extend the previous subarray or start a new one here\n        currentSum = max(nums[i], currentSum + nums[i]);\n        maxSum = max(maxSum, currentSum);\n    }\n\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxSubArray(int[] nums) {\n    int currentSum = nums[0];\n    int maxSum = nums[0];\n\n    for (int i = 1; i < nums.Length; i++) {\n        // Either extend the previous subarray or start a new one here\n        currentSum = Math.Max(nums[i], currentSum + nums[i]);\n        maxSum = Math.Max(maxSum, currentSum);\n    }\n\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxSubArray(nums []int) int {\n    currentSum := nums[0]\n    maxSum := nums[0]\n\n    for i := 1; i < len(nums); i++ {\n        // Either extend the previous subarray or start a new one here\n        if currentSum+nums[i] > nums[i] {\n            currentSum = currentSum + nums[i]\n        } else {\n            currentSum = nums[i]\n        }\n        if currentSum > maxSum {\n            maxSum = currentSum\n        }\n    }\n\n    return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7,
        8,
        9,
        10
      ],
      "extend_subarray": [
        7,
        8,
        9,
        10
      ],
      "update_max": [
        12,
        13
      ],
      "keep_max": [
        12,
        13
      ],
      "complete": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxSubArray(nums) {\n  let currentSum = nums[0]\n  let maxSum = nums[0]\n\n  for (let i = 1; i < nums.length; i++) {\n    // Either extend the previous subarray or start a new one here\n    currentSum = Math.max(nums[i], currentSum + nums[i])\n    maxSum = Math.max(maxSum, currentSum)\n  }\n\n  return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxSubArray(nums: number[]): number {\n  let currentSum = nums[0]\n  let maxSum = nums[0]\n\n  for (let i = 1; i < nums.length; i++) {\n    // Either extend the previous subarray or start a new one here\n    currentSum = Math.max(nums[i], currentSum + nums[i])\n    maxSum = Math.max(maxSum, currentSum)\n  }\n\n  return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "start_new": [
        7
      ],
      "extend_subarray": [
        7
      ],
      "update_max": [
        8
      ],
      "keep_max": [
        8
      ],
      "complete": [
        11
      ]
    }
  }
};

const MaximumSubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        -2,
        1,
        -3,
        4,
        -1,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Mostly Positive",
    "value": {
      "nums": [
        5,
        4,
        -1,
        7,
        8
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Negative",
    "value": {
      "nums": [
        -3,
        -1,
        -4,
        -2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Element",
    "value": {
      "nums": [
        1
      ]
    }
  }
];

function generateMaximumSubarraySteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),n=t[0],a=t[0],s=0,l=0,u=0,m=new StepRecorder({nums:t},{...i});if(m.record("-","Start of algorithm"),0===t.length)return m.record("complete","Array is empty, nothing to sum"),m.getSteps();m.add_new_variable("current_sum",a),m.add_new_variable("max_sum",n),m.add_new_variable("i",0),m.add_new_variable("currentStart",s),m.add_new_variable("maxStart",l),m.add_new_variable("maxEnd",u),m.record("initialize",`Seed both sums with the first element: current_sum = max_sum = ${t[0]}`);for(let e=1;e<t.length;e++){let i=t[e],r=a;m.update_variable("i",e),m.update_variable("prevSum",r),m.update_variable("addVal",i),m.update_visual("curr",{type:"pointer",position:e,label:"i"}),a<0?(m.update_variable("droppedStart",s),m.update_variable("droppedEnd",e-1),a=i,s=e,m.update_variable("current_sum",a),m.update_variable("currentStart",s),m.record("start_new",`current_sum ${r} < 0, drop it and start fresh: current_sum = nums[${e}] = ${i}`)):(a+=i,m.update_variable("current_sum",a),m.record("extend_subarray",`current_sum ${r} >= 0, extend the run: current_sum = ${r} + ${i<0?`(${i})`:i} = ${a}`));let o=a>n;m.update_variable("prevBest",n),o?(n=a,l=s,u=e,m.update_variable("max_sum",n),m.update_variable("maxStart",l),m.update_variable("maxEnd",u),m.record("update_max",`current_sum ${a} > max_sum, new best window [${l}..${u}] with sum ${n}`)):m.record("keep_max",`current_sum ${a} <= max_sum ${n}, keep the current best`)}return m.delete_visual("curr"),m.record("complete",`Maximum subarray sum: ${n} (window [${l}..${u}])`),m.getSteps()
}

export function MaximumSubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumSubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumSubarraySteps(e) as any[];
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
      title="Maximum Subarray"
      slug="maximum-subarray"
      approaches={approaches}
      presets={MaximumSubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Product Subarray (maximum-product-subarray)
// ==========================================

const MaximumProductSubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def maxProduct(nums):\n    max_so_far = nums[0]\n    min_so_far = nums[0]\n    result = nums[0]\n\n    for i in range(1, len(nums)):\n        # Compute both before updating to avoid stale values\n        temp_max = max(nums[i], max_so_far * nums[i], min_so_far * nums[i])\n        temp_min = min(nums[i], max_so_far * nums[i], min_so_far * nums[i])\n\n        max_so_far = temp_max\n        min_so_far = temp_min\n        result = max(result, max_so_far)\n\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxProduct(int[] nums) {\n    int maxSoFar = nums[0];\n    int minSoFar = nums[0];\n    int result = nums[0];\n\n    for (int i = 1; i < nums.length; i++) {\n        // Compute both before updating to avoid stale values\n        int tempMax = Math.max(nums[i], Math.max(maxSoFar * nums[i], minSoFar * nums[i]));\n        int tempMin = Math.min(nums[i], Math.min(maxSoFar * nums[i], minSoFar * nums[i]));\n\n        maxSoFar = tempMax;\n        minSoFar = tempMin;\n        result = Math.max(result, maxSoFar);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxProduct(vector<int>& nums) {\n    int maxSoFar = nums[0];\n    int minSoFar = nums[0];\n    int result = nums[0];\n\n    for (int i = 1; i < nums.size(); i++) {\n        // Compute both before updating to avoid stale values\n        int tempMax = max({nums[i], maxSoFar * nums[i], minSoFar * nums[i]});\n        int tempMin = min({nums[i], maxSoFar * nums[i], minSoFar * nums[i]});\n\n        maxSoFar = tempMax;\n        minSoFar = tempMin;\n        result = max(result, maxSoFar);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxProduct(int[] nums) {\n    int maxSoFar = nums[0];\n    int minSoFar = nums[0];\n    int result = nums[0];\n\n    for (int i = 1; i < nums.Length; i++) {\n        // Compute both before updating to avoid stale values\n        int tempMax = Math.Max(nums[i], Math.Max(maxSoFar * nums[i], minSoFar * nums[i]));\n        int tempMin = Math.Min(nums[i], Math.Min(maxSoFar * nums[i], minSoFar * nums[i]));\n\n        maxSoFar = tempMax;\n        minSoFar = tempMin;\n        result = Math.Max(result, maxSoFar);\n    }\n\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxProduct(nums []int) int {\n    maxSoFar := nums[0]\n    minSoFar := nums[0]\n    result := nums[0]\n\n    for i := 1; i < len(nums); i++ {\n        // Compute both before updating to avoid stale values\n        tempMax := max(nums[i], max(maxSoFar*nums[i], minSoFar*nums[i]))\n        tempMin := min(nums[i], min(maxSoFar*nums[i], minSoFar*nums[i]))\n\n        maxSoFar = tempMax\n        minSoFar = tempMin\n        result = max(result, maxSoFar)\n    }\n\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxProduct(nums) {\n  let maxSoFar = nums[0]\n  let minSoFar = nums[0]\n  let result = nums[0]\n\n  for (let i = 1; i < nums.length; i++) {\n    // Compute both before updating to avoid stale values\n    const tempMax = Math.max(nums[i], maxSoFar * nums[i], minSoFar * nums[i])\n    const tempMin = Math.min(nums[i], maxSoFar * nums[i], minSoFar * nums[i])\n\n    maxSoFar = tempMax\n    minSoFar = tempMin\n    result = Math.max(result, maxSoFar)\n  }\n\n  return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxProduct(nums: number[]): number {\n  let maxSoFar: number = nums[0]\n  let minSoFar: number = nums[0]\n  let result: number = nums[0]\n\n  for (let i = 1; i < nums.length; i++) {\n    // Compute both before updating to avoid stale values\n    const tempMax: number = Math.max(nums[i], maxSoFar * nums[i], minSoFar * nums[i])\n    const tempMin: number = Math.min(nums[i], maxSoFar * nums[i], minSoFar * nums[i])\n\n    maxSoFar = tempMax\n    minSoFar = tempMin\n    result = Math.max(result, maxSoFar)\n  }\n\n  return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_max": [
        8
      ],
      "calculate_min": [
        9
      ],
      "update_result": [
        13
      ],
      "keep_result": [
        13
      ],
      "final_result": [
        16
      ]
    }
  }
};

const MaximumProductSubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        2,
        3,
        -2,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Negative Pairs",
    "value": {
      "nums": [
        2,
        -5,
        -2,
        -4,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Two Negatives",
    "value": {
      "nums": [
        -3,
        -4
      ]
    }
  },
  {
    "id": "ex4",
    "label": "With Zero",
    "value": {
      "nums": [
        -2,
        0,
        -1
      ]
    }
  }
];

function generateMaximumProductSubarraySteps(e: any): any[] {
  let r=e=>e<0?`(${e})`:`${e}`;
let t=[...e.nums],i=t.length,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=t[0],s=t[0],u=t[0],o=0,m=0,d=0,x=0,c=new StepRecorder({nums:t},{...a});c.record("start","Track both the max and min running products, a negative number can flip the min into the max"),c.add_new_variable("result",l),c.add_new_variable("maxSoFar",s),c.add_new_variable("minSoFar",u),c.add_new_variable("i",0),c.add_new_variable("curMaxStart",o),c.add_new_variable("curMinStart",m),c.add_new_variable("bestStart",d),c.add_new_variable("bestEnd",x),c.record("initialize",`Seed everything with the first element: result = maxSoFar = minSoFar = ${t[0]}`);for(let e=1;e<i;e++){let i,n,a=t[e],f=s,p=u,h=o,g=m,b=f*a,j=p*a;c.update_variable("i",e),c.update_variable("num",a),c.update_variable("prevMax",f),c.update_variable("prevMin",p),c.update_variable("extMax",b),c.update_variable("flipMax",j),c.update_visual("curr",{type:"pointer",position:e,label:"i"}),s=Math.max(a,b,j),0===a?(i="zero",o=e):s===b?i="extend":s===j?(i="flip",o=g):(i="fresh",o=e),c.update_variable("maxSoFar",s),c.update_variable("maxSrc",i),c.update_variable("curMaxStart",o),c.record("calculate_max",`tempMax = max(${r(a)}, ${f} \xd7 ${r(a)}, ${p} \xd7 ${r(a)}) = ${s}`+("flip"===i?", the min run flips positive":"zero"===i?", zero resets the run":"fresh"===i?`, start fresh at index ${e}`:"")),u=Math.min(a,b,j),0===a?(n="zero",m=e):u===j?(n="extend",m=g):u===b?(n="flipmax",m=h):(n="fresh",m=e),c.update_variable("minSoFar",u),c.update_variable("minSrc",n),c.update_variable("curMinStart",m),c.record("calculate_min",`tempMin = min(${r(a)}, ${f} \xd7 ${r(a)}, ${p} \xd7 ${r(a)}) = ${u}`+("flipmax"===n?", the max run flips negative":"zero"===n?", zero resets the run":"fresh"===n?`, start fresh at index ${e}`:""));let y=l,v=s>l;v&&(l=s,d=o,x=e),c.update_variable("prevResult",y),c.update_variable("result",l),c.update_variable("newResult",v),c.update_variable("bestStart",d),c.update_variable("bestEnd",x),v?c.record("update_result",`New best: result = max(${y}, ${s}) = ${l} (window [${d}..${x}])`):c.record("keep_result",`result = max(${l}, ${s}) = ${l}, keep the current best`)}return c.delete_visual("curr"),c.record("final_result",`Maximum product subarray: ${l} (window [${d}..${x}])`),c.getSteps()
}

export function MaximumProductSubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumProductSubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumProductSubarraySteps(e) as any[];
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
      title="Maximum Product Subarray"
      slug="maximum-product-subarray"
      approaches={approaches}
      presets={MaximumProductSubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Best Sightseeing Pair (best-sightseeing-pair)
// ==========================================

const BestSightseeingPairTemplates = {
  "python": {
    "language": "python",
    "code": "def maxScoreSightseeingPair(values):\n    # Best values[i] + i seen so far\n    max_left_score = values[0] + 0\n    max_score = 0\n\n    for j in range(1, len(values)):\n        # Best score using current j and the best left partner\n        max_score = max(max_score, max_left_score + values[j] - j)\n        # Update best left partner for future j's\n        max_left_score = max(max_left_score, values[j] + j)\n\n    return max_score",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxScoreSightseeingPair(int[] values) {\n    // Best values[i] + i seen so far\n    int maxLeftScore = values[0] + 0;\n    int maxScore = 0;\n\n    for (int j = 1; j < values.length; j++) {\n        // Best score using current j and the best left partner\n        maxScore = Math.max(maxScore, maxLeftScore + values[j] - j);\n        // Update best left partner for future j's\n        maxLeftScore = Math.max(maxLeftScore, values[j] + j);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxScoreSightseeingPair(vector<int>& values) {\n    // Best values[i] + i seen so far\n    int maxLeftScore = values[0] + 0;\n    int maxScore = 0;\n\n    for (int j = 1; j < values.size(); j++) {\n        // Best score using current j and the best left partner\n        maxScore = max(maxScore, maxLeftScore + values[j] - j);\n        // Update best left partner for future j's\n        maxLeftScore = max(maxLeftScore, values[j] + j);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxScoreSightseeingPair(int[] values) {\n    // Best values[i] + i seen so far\n    int maxLeftScore = values[0] + 0;\n    int maxScore = 0;\n\n    for (int j = 1; j < values.Length; j++) {\n        // Best score using current j and the best left partner\n        maxScore = Math.Max(maxScore, maxLeftScore + values[j] - j);\n        // Update best left partner for future j's\n        maxLeftScore = Math.Max(maxLeftScore, values[j] + j);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxScoreSightseeingPair(values []int) int {\n    // Best values[i] + i seen so far\n    maxLeftScore := values[0] + 0\n    maxScore := 0\n\n    for j := 1; j < len(values); j++ {\n        // Best score using current j and the best left partner\n        score := maxLeftScore + values[j] - j\n        if score > maxScore {\n            maxScore = score\n        }\n        // Update best left partner for future j's\n        left := values[j] + j\n        if left > maxLeftScore {\n            maxLeftScore = left\n        }\n    }\n\n    return maxScore\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        10
      ],
      "keep_result": [
        9
      ],
      "update_max_left": [
        13,
        14,
        15
      ],
      "final_result": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxScoreSightseeingPair(values) {\n    // Best values[i] + i seen so far\n    let maxLeftScore = values[0] + 0;\n    let maxScore = 0;\n\n    for (let j = 1; j < values.length; j++) {\n        // Best score using current j and the best left partner\n        maxScore = Math.max(maxScore, maxLeftScore + values[j] - j);\n        // Update best left partner for future j's\n        maxLeftScore = Math.max(maxLeftScore, values[j] + j);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxScoreSightseeingPair(values: number[]): number {\n    // Best values[i] + i seen so far\n    let maxLeftScore = values[0] + 0;\n    let maxScore = 0;\n\n    for (let j = 1; j < values.length; j++) {\n        // Best score using current j and the best left partner\n        maxScore = Math.max(maxScore, maxLeftScore + values[j] - j);\n        // Update best left partner for future j's\n        maxLeftScore = Math.max(maxLeftScore, values[j] + j);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_score": [
        8
      ],
      "update_result": [
        8
      ],
      "keep_result": [
        8
      ],
      "update_max_left": [
        10
      ],
      "final_result": [
        13
      ]
    }
  }
};

const BestSightseeingPairPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "values": [
        8,
        1,
        5,
        2,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Increasing",
    "value": {
      "values": [
        1,
        3,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Multiple Peaks",
    "value": {
      "values": [
        5,
        7,
        2,
        8,
        4
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Complex",
    "value": {
      "values": [
        2,
        7,
        3,
        1,
        9,
        3
      ]
    }
  }
];

function generateBestSightseeingPairSteps(e: any): any[] {
  let t=[...e.values],a=t.length,r=t.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),l=new StepRecorder({values:t},{...r});l.record("start","Score = values[i] + values[j] + i - j. Split it: (values[i] + i) + (values[j] - j), and carry the best left part forward.");let n=t[0],s=0,o=0,c=0,u=0;l.add_new_variable("maxLeftScore",n),l.add_new_variable("maxScore",s),l.add_new_variable("j",0),l.add_new_variable("bestI",o),l.add_new_variable("bestPairI",c),l.add_new_variable("bestPairJ",u),l.update_visual("ptr_i",{type:"pointer",position:0,label:"i"}),l.record("initialize",`The first spot is the only left candidate: maxLeftScore = values[0] + 0 = ${n}`);for(let e=1;e<a;e++){let a=t[e],i=a-e,r=n+i;l.update_variable("j",e),l.update_variable("vj",a),l.update_variable("rightComp",i),l.update_variable("score",r),l.update_visual("ptr_j",{type:"pointer",position:e,label:"j"}),l.record("calculate_score",`Pair (${o}, ${e}): score = maxLeftScore + (values[${e}] - ${e}) = ${n} + ${i<0?`(${i})`:i} = ${r}`);let d=s,f=r>s;f&&(s=r,c=o,u=e),l.update_variable("prevResult",d),l.update_variable("maxScore",s),l.update_variable("newBest",f),l.update_variable("bestPairI",c),l.update_variable("bestPairJ",u),f?l.record("update_result",`New best pair (${c}, ${u}): maxScore = max(${d}, ${r}) = ${s}`):l.record("keep_result",`score ${r} <= maxScore ${s}, keep the current best pair (${c}, ${u})`);let p=n,x=a+e,h=x>n;h&&(n=x,o=e,l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"})),l.update_variable("prevMaxLeft",p),l.update_variable("leftComp",x),l.update_variable("maxLeftScore",n),l.update_variable("movedLeft",h),l.update_variable("bestI",o),l.record("update_max_left",`maxLeftScore = max(${p}, values[${e}] + ${e} = ${x}) = ${n}`+(h?`, the left spot moves to index ${e}`:`, the left spot stays at index ${o}`))}return l.delete_visual("ptr_j"),l.delete_visual("ptr_i"),l.record("final_result",`Best sightseeing pair (${c}, ${u}): ${t[c]} + ${t[u]} + ${c} - ${u} = ${s}`),l.getSteps()
}

export function BestSightseeingPairProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BestSightseeingPairTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBestSightseeingPairSteps(e) as any[];
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
      title="Best Sightseeing Pair"
      slug="best-sightseeing-pair"
      approaches={approaches}
      presets={BestSightseeingPairPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Absolute Sum of Any Subarray (maximum-absolute-sum-of-any-subarray)
// ==========================================

const MaximumAbsoluteSumOfAnySubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def maxAbsoluteSum(nums):\n    max_sum = 0\n    min_sum = 0\n    current_max = 0\n    current_min = 0\n\n    for num in nums:\n        # Standard Kadane's: track max subarray sum\n        current_max = max(num, current_max + num)\n        max_sum = max(max_sum, current_max)\n\n        # Inverted Kadane's: track min subarray sum\n        current_min = min(num, current_min + num)\n        min_sum = min(min_sum, current_min)\n\n    return max(max_sum, abs(min_sum))",
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
      "kadane_max": [
        9,
        10
      ],
      "kadane_min": [
        13,
        14
      ],
      "result": [
        16
      ],
      "complete": [
        16
      ],
      "complete_abs": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        10
      ],
      "is_new_min": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxAbsoluteSum(int[] nums) {\n    int maxSum = 0, minSum = 0;\n    int currentMax = 0, currentMin = 0;\n\n    for (int num : nums) {\n        // Standard Kadane's: track max subarray sum\n        currentMax = Math.max(num, currentMax + num);\n        maxSum = Math.max(maxSum, currentMax);\n\n        // Inverted Kadane's: track min subarray sum\n        currentMin = Math.min(num, currentMin + num);\n        minSum = Math.min(minSum, currentMin);\n    }\n\n    return Math.max(maxSum, Math.abs(minSum));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8
      ],
      "kadane_min": [
        11,
        12
      ],
      "result": [
        15
      ],
      "complete": [
        15
      ],
      "complete_abs": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        8
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxAbsoluteSum(vector<int>& nums) {\n    int maxSum = 0, minSum = 0;\n    int currentMax = 0, currentMin = 0;\n\n    for (int num : nums) {\n        // Standard Kadane's: track max subarray sum\n        currentMax = max(num, currentMax + num);\n        maxSum = max(maxSum, currentMax);\n\n        // Inverted Kadane's: track min subarray sum\n        currentMin = min(num, currentMin + num);\n        minSum = min(minSum, currentMin);\n    }\n\n    return max(maxSum, abs(minSum));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8
      ],
      "kadane_min": [
        11,
        12
      ],
      "result": [
        15
      ],
      "complete": [
        15
      ],
      "complete_abs": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        8
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxAbsoluteSum(int[] nums) {\n    int maxSum = 0, minSum = 0;\n    int currentMax = 0, currentMin = 0;\n\n    foreach (int num in nums) {\n        // Standard Kadane's: track max subarray sum\n        currentMax = Math.Max(num, currentMax + num);\n        maxSum = Math.Max(maxSum, currentMax);\n\n        // Inverted Kadane's: track min subarray sum\n        currentMin = Math.Min(num, currentMin + num);\n        minSum = Math.Min(minSum, currentMin);\n    }\n\n    return Math.Max(maxSum, Math.Abs(minSum));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8
      ],
      "kadane_min": [
        11,
        12
      ],
      "result": [
        15
      ],
      "complete": [
        15
      ],
      "complete_abs": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        8
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxAbsoluteSum(nums []int) int {\n    maxSum, minSum := 0, 0\n    currentMax, currentMin := 0, 0\n\n    for _, num := range nums {\n        // Standard Kadane's: track max subarray sum\n        if num > currentMax+num {\n            currentMax = num\n        } else {\n            currentMax = currentMax + num\n        }\n        if currentMax > maxSum {\n            maxSum = currentMax\n        }\n\n        // Inverted Kadane's: track min subarray sum\n        if num < currentMin+num {\n            currentMin = num\n        } else {\n            currentMin = currentMin + num\n        }\n        if currentMin < minSum {\n            minSum = currentMin\n        }\n    }\n\n    if maxSum > -minSum {\n        return maxSum\n    }\n    return -minSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "kadane_min": [
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "result": [
        27,
        28,
        29,
        30
      ],
      "complete": [
        27,
        28,
        29,
        30
      ],
      "complete_abs": [
        27,
        28,
        29,
        30
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ],
      "is_new_min": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxAbsoluteSum(nums) {\n    let maxSum = 0, minSum = 0;\n    let currentMax = 0, currentMin = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        // Standard Kadane's: track max subarray sum\n        currentMax = Math.max(nums[i], currentMax + nums[i]);\n        maxSum = Math.max(maxSum, currentMax);\n\n        // Inverted Kadane's: track min subarray sum\n        currentMin = Math.min(nums[i], currentMin + nums[i]);\n        minSum = Math.min(minSum, currentMin);\n    }\n\n    return Math.max(maxSum, Math.abs(minSum));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8
      ],
      "kadane_min": [
        11,
        12
      ],
      "result": [
        15
      ],
      "complete": [
        15
      ],
      "complete_abs": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        8
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxAbsoluteSum(nums: number[]): number {\n    let maxSum = 0, minSum = 0;\n    let currentMax = 0, currentMin = 0;\n\n    for (const num of nums) {\n        // Standard Kadane's: track max subarray sum\n        currentMax = Math.max(num, currentMax + num);\n        maxSum = Math.max(maxSum, currentMax);\n\n        // Inverted Kadane's: track min subarray sum\n        currentMin = Math.min(num, currentMin + num);\n        minSum = Math.min(minSum, currentMin);\n    }\n\n    return Math.max(maxSum, Math.abs(minSum));\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "kadane_max": [
        7,
        8
      ],
      "kadane_min": [
        11,
        12
      ],
      "result": [
        15
      ],
      "complete": [
        15
      ],
      "complete_abs": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        8
      ],
      "is_new_min": [
        12
      ]
    }
  }
};

const MaximumAbsoluteSumOfAnySubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        1,
        -3,
        2,
        3,
        -4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Negative Wins",
    "value": {
      "nums": [
        2,
        -5,
        1,
        -4,
        3,
        -2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Positive",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  }
];

function generateMaximumAbsoluteSumOfAnySubarraySteps(e: any): any[] {
  let a=e=>e<0?`(${e})`:`${e}`;
let t=[...e.nums],n=t.length,r=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=0,s=0,u=0,m=0,o=-1,x=-1,c=0,d=-1,f=-1,p=0,h=new StepRecorder({nums:t},{...r});h.record("-","Start of algorithm"),h.add_new_variable("currentMax",u),h.add_new_variable("maxSum",l),h.add_new_variable("currentMin",m),h.add_new_variable("minSum",s),h.add_new_variable("maxStart",o),h.add_new_variable("maxEnd",x),h.add_new_variable("minStart",d),h.add_new_variable("minEnd",f),h.record("init","Start both running sums and both bests at 0 (the empty subarray)");for(let e=0;e<n;e++){let n=t[e];h.update_variable("i",e),h.update_variable("num",n),h.update_visual("curr",{type:"pointer",position:e,label:"i"});let i=u,r=u+n;n>r?(u=n,c=e):u=r;let b=u>l;b&&(l=u,o=c,x=e),h.update_variable("prevCurrentMax",i),h.update_variable("extendMax",r),h.update_variable("currentMax",u),h.update_variable("curMaxStart",c),h.update_variable("maxSum",l),h.update_variable("maxStart",o),h.update_variable("maxEnd",x),h.update_variable("newMax",b),h.add_conditional("is_new_max",b),h.record("kadane_max",`currentMax = max(${a(n)}, ${i} + ${a(n)}) = ${u}`+(b?`, new best window [${o}..${x}] with maxSum = ${l}`:`, maxSum stays ${l}`));let g=m,S=m+n;n<S?(m=n,p=e):m=S;let y=m<s;y&&(s=m,d=p,f=e),h.update_variable("prevCurrentMin",g),h.update_variable("extendMin",S),h.update_variable("currentMin",m),h.update_variable("curMinStart",p),h.update_variable("minSum",s),h.update_variable("minStart",d),h.update_variable("minEnd",f),h.update_variable("newMin",y),h.add_conditional("is_new_min",y),h.record("kadane_min",`currentMin = min(${a(n)}, ${g} + ${a(n)}) = ${m}`+(y?`, new min window [${d}..${f}] with minSum = ${s}`:`, minSum stays ${s}`))}h.delete_visual("curr");let b=Math.abs(s),g=Math.max(l,b),S=b>l?"min":"max";return h.update_variable("absMin",b),h.update_variable("answer",g),h.update_variable("winner",S),h.record("result",`max(maxSum ${l}, |minSum ${a(s)}| = ${b}) = ${g}`+("min"===S?", the most negative window wins by absolute value":", the max window wins")),h.record("min"===S?"complete_abs":"complete",`Maximum absolute sum of any subarray: ${g}`),h.getSteps()
}

export function MaximumAbsoluteSumOfAnySubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumAbsoluteSumOfAnySubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumAbsoluteSumOfAnySubarraySteps(e) as any[];
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
      title="Maximum Absolute Sum of Any Subarray"
      slug="maximum-absolute-sum-of-any-subarray"
      approaches={approaches}
      presets={MaximumAbsoluteSumOfAnySubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Subarray Sum with One Deletion (maximum-subarray-sum-with-one-deletion)
// ==========================================

const MaximumSubarraySumWithOneDeletionTemplates = {
  "python": {
    "language": "python",
    "code": "def maximumSum(arr):\n    n = len(arr)\n    no_delete = arr[0]\n    one_delete = 0\n    max_sum = arr[0]\n\n    for i in range(1, n):\n        # Update one_delete BEFORE no_delete (depends on previous no_delete)\n        one_delete = max(no_delete, one_delete + arr[i])\n        no_delete = max(arr[i], no_delete + arr[i])\n        max_sum = max(max_sum, no_delete, one_delete)\n\n    return max_sum",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maximumSum(int[] arr) {\n    int n = arr.length;\n    int noDelete = arr[0];\n    int oneDelete = 0;\n    int maxSum = arr[0];\n\n    for (int i = 1; i < n; i++) {\n        // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n        oneDelete = Math.max(noDelete, oneDelete + arr[i]);\n        noDelete = Math.max(arr[i], noDelete + arr[i]);\n        maxSum = Math.max(maxSum, Math.max(noDelete, oneDelete));\n    }\n\n    return maxSum;\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maximumSum(vector<int>& arr) {\n    int n = arr.size();\n    int noDelete = arr[0];\n    int oneDelete = 0;\n    int maxSum = arr[0];\n\n    for (int i = 1; i < n; i++) {\n        // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n        oneDelete = max(noDelete, oneDelete + arr[i]);\n        noDelete = max(arr[i], noDelete + arr[i]);\n        maxSum = max(maxSum, max(noDelete, oneDelete));\n    }\n\n    return maxSum;\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaximumSum(int[] arr) {\n    int n = arr.Length;\n    int noDelete = arr[0];\n    int oneDelete = 0;\n    int maxSum = arr[0];\n\n    for (int i = 1; i < n; i++) {\n        // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n        oneDelete = Math.Max(noDelete, oneDelete + arr[i]);\n        noDelete = Math.Max(arr[i], noDelete + arr[i]);\n        maxSum = Math.Max(maxSum, Math.Max(noDelete, oneDelete));\n    }\n\n    return maxSum;\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumSum(arr []int) int {\n    n := len(arr)\n    noDelete := arr[0]\n    oneDelete := 0\n    maxSum := arr[0]\n\n    for i := 1; i < n; i++ {\n        // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n        oneDelete = max(noDelete, oneDelete+arr[i])\n        noDelete = max(arr[i], noDelete+arr[i])\n        maxSum = max(maxSum, max(noDelete, oneDelete))\n    }\n\n    return maxSum\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maximumSum(arr) {\n  const n = arr.length;\n  let noDelete = arr[0];\n  let oneDelete = 0;\n  let maxSum = arr[0];\n\n  for (let i = 1; i < n; i++) {\n    // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n    oneDelete = Math.max(noDelete, oneDelete + arr[i]);\n    noDelete = Math.max(arr[i], noDelete + arr[i]);\n    maxSum = Math.max(maxSum, noDelete, oneDelete);\n  }\n\n  return maxSum;\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumSum(arr: number[]): number {\n    const n = arr.length;\n    let noDelete = arr[0];\n    let oneDelete = 0;\n    let maxSum = arr[0];\n\n    for (let i = 1; i < n; i++) {\n        // Update oneDelete BEFORE noDelete (depends on previous noDelete)\n        oneDelete = Math.max(noDelete, oneDelete + arr[i]);\n        noDelete = Math.max(arr[i], noDelete + arr[i]);\n        maxSum = Math.max(maxSum, noDelete, oneDelete);\n    }\n\n    return maxSum;\n}",
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
      "update_one_delete": [
        9
      ],
      "update_no_delete": [
        10
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ]
    }
  }
};

const MaximumSubarraySumWithOneDeletionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "arr": [
        1,
        -2,
        0,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Delete the Dip",
    "value": {
      "arr": [
        3,
        -2,
        4,
        -5,
        6
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Positive",
    "value": {
      "arr": [
        5,
        4,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Negative",
    "value": {
      "arr": [
        -1,
        -1,
        -1,
        -1
      ]
    }
  }
];

function generateMaximumSubarraySumWithOneDeletionSteps(e: any): any[] {
  let n=e=>e<0?`(${e})`:`${e}`;
let t=[...e.arr],a=t.length,i=t.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),l=new StepRecorder({arr:t},{...i});l.record("-","Start of algorithm");let o=t[0],s=0,d=t[0],u=0,m=0,c=0,x=0,p=0,f=-1;l.add_new_variable("noDelete",o),l.add_new_variable("oneDelete",s),l.add_new_variable("maxSum",d),l.add_new_variable("i",0),l.add_new_variable("ndStart",u),l.add_new_variable("ndEnd",0),l.add_new_variable("odStart",m),l.add_new_variable("odEnd",0),l.add_new_variable("delIdx",c),l.add_new_variable("bestStart",x),l.add_new_variable("bestEnd",p),l.add_new_variable("bestDel",f),l.record("init",`Seed noDelete = maxSum = arr[0] = ${t[0]}; oneDelete = 0 (window [0..0] with arr[0] deleted is empty)`);for(let e=1;e<a;e++){let a=t[e],r=o,i=s,h=u;l.update_variable("i",e),l.update_variable("num",a),l.update_visual("curr",{type:"pointer",position:e,label:"i"});let b=i+a,g=r>b;g?(s=r,m=h,c=e):s=b,l.update_variable("prevNoDelete",r),l.update_variable("prevOneDelete",i),l.update_variable("opt1",r),l.update_variable("opt2",b),l.update_variable("deleteCurrent",g),l.update_variable("oneDelete",s),l.update_variable("odStart",m),l.update_variable("odEnd",e),l.update_variable("delIdx",c),l.record("update_one_delete",`oneDelete = max(noDelete ${n(r)}, oneDelete + arr[${e}] = ${n(b)}) = ${s}`+(g?`, delete arr[${e}] = ${n(a)}`:", keep the earlier deletion"));let y=r+a,w=a>y;o=w?a:y,w&&(u=e),l.update_variable("extendSum",y),l.update_variable("restart",w),l.update_variable("noDelete",o),l.update_variable("ndStart",u),l.update_variable("ndEnd",e),l.record("update_no_delete",`noDelete = max(arr[${e}] = ${n(a)}, noDelete + arr[${e}] = ${n(y)}) = ${o}`+(w?`, start fresh at index ${e}`:""));let _=d,S=Math.max(o,s),j=S>d;l.add_conditional("is_new_max",j),j&&(d=S,o>=s?(x=u,p=e,f=-1):(x=m,p=e,f=c)),l.update_variable("prevMaxSum",_),l.update_variable("maxSum",d),l.update_variable("newMax",j),l.update_variable("bestStart",x),l.update_variable("bestEnd",p),l.update_variable("bestDel",f),l.record("update_max",j?`New best: maxSum = max(${_}, ${o}, ${s}) = ${d}`+(f>=0?` (window [${x}..${p}] minus arr[${f}])`:` (window [${x}..${p}])`):`maxSum ${d} >= max(noDelete ${o}, oneDelete ${s}), keep the current best`)}return l.delete_visual("curr"),l.record("complete",`Maximum subarray sum with at most one deletion: ${d}`+(f>=0?` (window [${x}..${p}] minus arr[${f}])`:` (window [${x}..${p}], nothing deleted)`)),l.getSteps()
}

export function MaximumSubarraySumWithOneDeletionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumSubarraySumWithOneDeletionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumSubarraySumWithOneDeletionSteps(e) as any[];
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
      title="Maximum Subarray Sum with One Deletion"
      slug="maximum-subarray-sum-with-one-deletion"
      approaches={approaches}
      presets={MaximumSubarraySumWithOneDeletionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Sum Circular Subarray (maximum-sum-circular-subarray)
// ==========================================

const MaximumSumCircularSubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def maxSubarraySumCircular(nums):\n    current_max, max_sum = 0, nums[0]\n    current_min, min_sum = 0, nums[0]\n    total_sum = 0\n\n    for num in nums:\n        # Kadane's for maximum subarray\n        current_max = max(current_max + num, num)\n        max_sum = max(max_sum, current_max)\n\n        # Kadane's for minimum subarray\n        current_min = min(current_min + num, num)\n        min_sum = min(min_sum, current_min)\n\n        total_sum += num\n\n    # If all negative, return the least negative element\n    if max_sum < 0:\n        return max_sum\n\n    return max(max_sum, total_sum - min_sum)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "kadane_max": [
        8,
        9
      ],
      "kadane_min": [
        12,
        13
      ],
      "update_total": [
        15
      ],
      "check_all_negative": [
        18
      ],
      "result_negative": [
        18,
        19
      ],
      "complete_negative": [
        18,
        19
      ],
      "result": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        9
      ],
      "is_new_min": [
        13
      ],
      "all_negative": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxSubarraySumCircular(int[] nums) {\n    int currentMax = 0, maxSum = nums[0];\n    int currentMin = 0, minSum = nums[0];\n    int totalSum = 0;\n\n    for (int num : nums) {\n        // Kadane's for maximum subarray\n        currentMax = Math.max(currentMax + num, num);\n        maxSum = Math.max(maxSum, currentMax);\n\n        // Kadane's for minimum subarray\n        currentMin = Math.min(currentMin + num, num);\n        minSum = Math.min(minSum, currentMin);\n\n        totalSum += num;\n    }\n\n    // If all elements are negative, maxSum is the answer\n    // (totalSum - minSum would give 0, which is an empty subarray)\n    if (maxSum < 0) return maxSum;\n\n    return Math.max(maxSum, totalSum - minSum);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "kadane_max": [
        8,
        9
      ],
      "kadane_min": [
        12,
        13
      ],
      "update_total": [
        15
      ],
      "check_all_negative": [
        20
      ],
      "result_negative": [
        20
      ],
      "complete_negative": [
        20
      ],
      "result": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        9
      ],
      "is_new_min": [
        13
      ],
      "all_negative": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxSubarraySumCircular(vector<int>& nums) {\n    int currentMax = 0, maxSum = nums[0];\n    int currentMin = 0, minSum = nums[0];\n    int totalSum = 0;\n\n    for (int num : nums) {\n        // Kadane's for maximum subarray\n        currentMax = max(currentMax + num, num);\n        maxSum = max(maxSum, currentMax);\n\n        // Kadane's for minimum subarray\n        currentMin = min(currentMin + num, num);\n        minSum = min(minSum, currentMin);\n\n        totalSum += num;\n    }\n\n    // If all negative, return the least negative element\n    if (maxSum < 0) return maxSum;\n\n    return max(maxSum, totalSum - minSum);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "kadane_max": [
        8,
        9
      ],
      "kadane_min": [
        12,
        13
      ],
      "update_total": [
        15
      ],
      "check_all_negative": [
        19
      ],
      "result_negative": [
        19
      ],
      "complete_negative": [
        19
      ],
      "result": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        9
      ],
      "is_new_min": [
        13
      ],
      "all_negative": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxSubarraySumCircular(int[] nums) {\n    int currentMax = 0, maxSum = nums[0];\n    int currentMin = 0, minSum = nums[0];\n    int totalSum = 0;\n\n    foreach (int num in nums) {\n        // Kadane's for maximum subarray\n        currentMax = Math.Max(currentMax + num, num);\n        maxSum = Math.Max(maxSum, currentMax);\n\n        // Kadane's for minimum subarray\n        currentMin = Math.Min(currentMin + num, num);\n        minSum = Math.Min(minSum, currentMin);\n\n        totalSum += num;\n    }\n\n    // If all negative, return the least negative element\n    if (maxSum < 0) return maxSum;\n\n    return Math.Max(maxSum, totalSum - minSum);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "kadane_max": [
        8,
        9
      ],
      "kadane_min": [
        12,
        13
      ],
      "update_total": [
        15
      ],
      "check_all_negative": [
        19
      ],
      "result_negative": [
        19
      ],
      "complete_negative": [
        19
      ],
      "result": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        9
      ],
      "is_new_min": [
        13
      ],
      "all_negative": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxSubarraySumCircular(nums []int) int {\n    currentMax, maxSum := 0, nums[0]\n    currentMin, minSum := 0, nums[0]\n    totalSum := 0\n\n    for _, num := range nums {\n        // Kadane's for maximum subarray\n        if currentMax+num > num {\n            currentMax = currentMax + num\n        } else {\n            currentMax = num\n        }\n        if currentMax > maxSum {\n            maxSum = currentMax\n        }\n\n        // Kadane's for minimum subarray\n        if currentMin+num < num {\n            currentMin = currentMin + num\n        } else {\n            currentMin = num\n        }\n        if currentMin < minSum {\n            minSum = currentMin\n        }\n\n        totalSum += num\n    }\n\n    // If all negative, return the least negative element\n    if maxSum < 0 {\n        return maxSum\n    }\n\n    if totalSum-minSum > maxSum {\n        return totalSum - minSum\n    }\n    return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "kadane_max": [
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "kadane_min": [
        18,
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "update_total": [
        27
      ],
      "check_all_negative": [
        31
      ],
      "result_negative": [
        31,
        32
      ],
      "complete_negative": [
        31,
        32
      ],
      "result": [
        35,
        36,
        37,
        38
      ],
      "complete": [
        35,
        36,
        37,
        38
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ],
      "is_new_min": [
        23
      ],
      "all_negative": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxSubarraySumCircular(nums) {\n  let currentMax = 0,\n    maxSum = nums[0]\n  let currentMin = 0,\n    minSum = nums[0]\n  let totalSum = 0\n\n  for (const num of nums) {\n    // Kadane's for maximum subarray\n    currentMax = Math.max(currentMax + num, num)\n    maxSum = Math.max(maxSum, currentMax)\n\n    // Kadane's for minimum subarray\n    currentMin = Math.min(currentMin + num, num)\n    minSum = Math.min(minSum, currentMin)\n\n    totalSum += num\n  }\n\n  // If all negative, return the least negative element\n  if (maxSum < 0) return maxSum\n\n  return Math.max(maxSum, totalSum - minSum)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "kadane_max": [
        10,
        11
      ],
      "kadane_min": [
        14,
        15
      ],
      "update_total": [
        17
      ],
      "check_all_negative": [
        21
      ],
      "result_negative": [
        21
      ],
      "complete_negative": [
        21
      ],
      "result": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ],
      "is_new_min": [
        15
      ],
      "all_negative": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxSubarraySumCircular(nums: number[]): number {\n  let currentMax = 0,\n    maxSum = nums[0]\n  let currentMin = 0,\n    minSum = nums[0]\n  let totalSum = 0\n\n  for (const num of nums) {\n    // Kadane's for maximum subarray\n    currentMax = Math.max(currentMax + num, num)\n    maxSum = Math.max(maxSum, currentMax)\n\n    // Kadane's for minimum subarray\n    currentMin = Math.min(currentMin + num, num)\n    minSum = Math.min(minSum, currentMin)\n\n    totalSum += num\n  }\n\n  // If all negative, return the least negative element\n  if (maxSum < 0) return maxSum\n\n  return Math.max(maxSum, totalSum - minSum)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "kadane_max": [
        10,
        11
      ],
      "kadane_min": [
        14,
        15
      ],
      "update_total": [
        17
      ],
      "check_all_negative": [
        21
      ],
      "result_negative": [
        21
      ],
      "complete_negative": [
        21
      ],
      "result": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        11
      ],
      "is_new_min": [
        15
      ],
      "all_negative": [
        21
      ]
    }
  }
};

const MaximumSumCircularSubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        1,
        -2,
        3,
        -2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Wrap Wins",
    "value": {
      "nums": [
        5,
        -3,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Negative",
    "value": {
      "nums": [
        -3,
        -2,
        -3
      ]
    }
  }
];

function generateMaximumSumCircularSubarraySteps(e: any): any[] {
  let r=e=>e<0?`(${e})`:`${e}`;
let t=[...e.nums],n=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),i=0,l=t[0],u=0,m=t[0],s=0,o=0,c=0,d=0,x=0,h=0,p=0,f=new StepRecorder({nums:t},{...n});f.record("-","Start of algorithm"),f.add_new_variable("currentMax",i),f.add_new_variable("maxSum",l),f.add_new_variable("currentMin",u),f.add_new_variable("minSum",m),f.add_new_variable("totalSum",s),f.add_new_variable("maxStart",o),f.add_new_variable("maxEnd",c),f.add_new_variable("minStart",x),f.add_new_variable("minEnd",h),f.record("init",`Seed maxSum = minSum = nums[0] = ${t[0]}; running sums and totalSum start at 0`);for(let e=0;e<t.length;e++){let n=t[e];f.update_variable("i",e),f.update_variable("num",n),f.update_visual("curr",{type:"pointer",position:e,label:"i"});let a=i,g=i+n;n>g?(i=n,d=e):i=g;let S=i>l,b=l;S&&(l=i,o=d,c=e),f.update_variable("prevCurrentMax",a),f.update_variable("extendMax",g),f.update_variable("currentMax",i),f.update_variable("curMaxStart",d),f.update_variable("prevMaxSum",b),f.update_variable("maxSum",l),f.update_variable("maxStart",o),f.update_variable("maxEnd",c),f.update_variable("newMax",S),f.add_conditional("is_new_max",S),f.record("kadane_max",`currentMax = max(${a} + ${r(n)}, ${r(n)}) = ${i}`+(S?`, new best window [${o}..${c}] with maxSum = ${l}`:`, maxSum stays ${l}`));let y=u,_=u+n;n<_?(u=n,p=e):u=_;let v=u<m,M=m;v&&(m=u,x=p,h=e),f.update_variable("prevCurrentMin",y),f.update_variable("extendMin",_),f.update_variable("currentMin",u),f.update_variable("curMinStart",p),f.update_variable("prevMinSum",M),f.update_variable("minSum",m),f.update_variable("minStart",x),f.update_variable("minEnd",h),f.update_variable("newMin",v),f.add_conditional("is_new_min",v),f.record("kadane_min",`currentMin = min(${y} + ${r(n)}, ${r(n)}) = ${u}`+(v?`, new min window [${x}..${h}] with minSum = ${m}`:`, minSum stays ${m}`));let j=s;s+=n,f.update_variable("prevTotal",j),f.update_variable("totalSum",s),f.record("update_total",`totalSum = ${j} + ${r(n)} = ${s}`)}f.delete_visual("curr");let g=l<0,S=s-m,b=g?l:Math.max(l,S),y=g?"negative":S>l?"circular":"linear";return f.update_variable("allNegative",g),f.update_variable("circularSum",S),f.update_variable("answer",b),f.update_variable("winner",y),f.add_conditional("all_negative",g),f.record("check_all_negative",g?`maxSum ${l} < 0, every element is negative, the wrap would be empty`:`maxSum ${l} >= 0, compare the straight window with the wrap-around window`),g?f.record("result_negative",`Return maxSum = ${l}`):f.record("result",`max(maxSum ${l}, totalSum ${s} - minSum ${r(m)} = ${S}) = ${b}`+("circular"===y?", the wrap-around window wins":", the straight window wins")),f.record(g?"complete_negative":"complete",`Maximum circular subarray sum: ${b}`),f.getSteps()
}

export function MaximumSumCircularSubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumSumCircularSubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumSumCircularSubarraySteps(e) as any[];
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
      title="Maximum Sum Circular Subarray"
      slug="maximum-sum-circular-subarray"
      approaches={approaches}
      presets={MaximumSumCircularSubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
