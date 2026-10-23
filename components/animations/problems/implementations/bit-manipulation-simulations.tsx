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
    if (item.type === "arrayElement" || item.type === "element" || item.type === "bit") {
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
    if (Array.isArray(val)) {
      parts.push(`${k} = [${val.join(", ")}]`);
    } else {
      parts.push(`${k} = ${val}`);
    }
  }
  return parts.join(", ");
}

// ==========================================
// Single Number (single-number)
// ==========================================

const SingleNumberTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        result = 0\n        for num in nums:\n            result ^= num  # pairs cancel out, single number remains\n        return result",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        3
      ],
      "check": [
        4
      ],
      "xor": [
        5
      ],
      "final": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int singleNumber(int[] nums) {\n        int result = 0;\n        for (int num : nums) {\n            result ^= num; // pairs cancel out, single number remains\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        3
      ],
      "check": [
        4
      ],
      "xor": [
        5
      ],
      "final": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int result = 0;\n        for (int num : nums) {\n            result ^= num; // pairs cancel out, single number remains\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "initialize": [
        4
      ],
      "check": [
        5
      ],
      "xor": [
        6
      ],
      "final": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int SingleNumber(int[] nums) {\n        int result = 0;\n        foreach (int num in nums) {\n            result ^= num; // pairs cancel out, single number remains\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        3
      ],
      "check": [
        4
      ],
      "xor": [
        5
      ],
      "final": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func singleNumber(nums []int) int {\n    result := 0\n    for _, num := range nums {\n        result ^= num // pairs cancel out, single number remains\n    }\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        3
      ],
      "xor": [
        4
      ],
      "final": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var singleNumber = function(nums) {\n    var result = 0;\n    for (var i = 0; i < nums.length; i++) {\n        result ^= nums[i]; // pairs cancel out, single number remains\n    }\n    return result;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        3
      ],
      "xor": [
        4
      ],
      "final": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function singleNumber(nums: number[]): number {\n    let result = 0;\n    for (const num of nums) {\n        result ^= num; // pairs cancel out, single number remains\n    }\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        3
      ],
      "xor": [
        4
      ],
      "final": [
        6
      ]
    }
  }
};

const SingleNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        2,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        4,
        1,
        2,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Example 4",
    "value": {
      "nums": [
        9,
        1,
        9,
        1,
        8,
        8,
        6
      ]
    }
  }
];

function generateSingleNumberSteps(e: any): any[] {
  let t=[...e.nums],n=t.length,l=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),r=new StepRecorder({nums:[...t],n,result:0},{...l});r.record("start","Every number appears twice except one. XOR all numbers: pairs cancel to 0, leaving the single number");let a=0;r.add_new_variable("result",a),r.update_visual("ptr_i",{type:"pointer",position:0,label:"i"}),r.record("initialize","Initialize result = 0 (the XOR identity)");let s={};for(let e=0;e<n;e++){let n=t[e],i=a;r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.add_new_variable("i",e),r.add_new_variable("currentNum",n),r.add_new_variable("previousResult",i),r.record("check",`Examine nums[${e}] = ${n}`),a^=n,r.update_variable("result",a);let l=s[n];void 0!==l?(delete s[n],r.add_new_variable("cancelPartner",l),r.update_visual(`elem_${l}`,{type:"arrayElement",value:t[l],position:l,state:"cancelled"}),r.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"cancelled"}),r.record("xor",`${i} ^ ${n} = ${a}. The pair of ${n}s cancels out`),r.delete_variable("cancelPartner")):(s[n]=e,r.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"kept"}),r.record("xor",`${i} ^ ${n} = ${a}`)),r.delete_variable("currentNum"),r.delete_variable("previousResult")}r.delete_visual("ptr_i"),r.delete_variable("i");let o=s[a];return void 0!==o&&r.update_visual(`elem_${o}`,{type:"arrayElement",value:a,position:o,state:"answer"}),r.record("final",`Every pair cancelled. The single number is ${a}`),r.getSteps()
}

export function SingleNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SingleNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSingleNumberSteps(e) as any[];
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
      title="Single Number"
      slug="single-number"
      approaches={approaches}
      presets={SingleNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Counting Bits (counting-bits)
// ==========================================

const CountingBitsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def countBits(self, n: int) -> list[int]:\n        ans = [0] * (n + 1)\n        for i in range(1, n + 1):\n            # Clear lowest set bit and add 1 for the bit we removed\n            ans[i] = ans[i & (i - 1)] + 1\n        return ans",
    "lineMap": {
      "start": [
        2
      ],
      "init": [
        3
      ],
      "compute": [
        6
      ],
      "assign": [
        6
      ],
      "final": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] countBits(int n) {\n        int[] ans = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            // Clear lowest set bit and add 1 for the bit we removed\n            ans[i] = ans[i & (i - 1)] + 1;\n        }\n        return ans;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init": [
        3
      ],
      "compute": [
        6
      ],
      "assign": [
        6
      ],
      "final": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> countBits(int n) {\n        vector<int> ans(n + 1, 0);\n        for (int i = 1; i <= n; i++) {\n            // Clear lowest set bit and add 1 for the bit we removed\n            ans[i] = ans[i & (i - 1)] + 1;\n        }\n        return ans;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "init": [
        4
      ],
      "compute": [
        7
      ],
      "assign": [
        7
      ],
      "final": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] CountBits(int n) {\n        int[] ans = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            // Clear lowest set bit and add 1 for the bit we removed\n            ans[i] = ans[i & (i - 1)] + 1;\n        }\n        return ans;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init": [
        3
      ],
      "compute": [
        6
      ],
      "assign": [
        6
      ],
      "final": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countBits(n int) []int {\n    ans := make([]int, n+1)\n    for i := 1; i <= n; i++ {\n        // Clear lowest set bit and add 1 for the bit we removed\n        ans[i] = ans[i&(i-1)] + 1\n    }\n    return ans\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "compute": [
        5
      ],
      "assign": [
        5
      ],
      "final": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var countBits = function(n) {\n    const ans = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        // Clear lowest set bit and add 1 for the bit we removed\n        ans[i] = ans[i & (i - 1)] + 1;\n    }\n    return ans;\n};",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "compute": [
        5
      ],
      "assign": [
        5
      ],
      "final": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countBits(n: number): number[] {\n    const ans: number[] = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        // Clear lowest set bit and add 1 for the bit we removed\n        ans[i] = ans[i & (i - 1)] + 1;\n    }\n    return ans;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "compute": [
        5
      ],
      "assign": [
        5
      ],
      "final": [
        7
      ]
    }
  }
};

const CountingBitsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "n": 2
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "n": 10
    }
  }
];

function generateCountingBitsSteps(e: any): any[] {
  let t=e.n,n={};for(let e=0;e<=t;e++)n[`elem_${e}`]={type:"arrayElement",value:0,position:e};let r=new StepRecorder({n:t},{...n});r.record("start",`Count the 1-bits of every number from 0 to ${t}. Reuse earlier answers: ans[i] = ans[i & (i-1)] + 1`);let s=Array(t+1).fill(0);if(r.update_visual("elem_0",{type:"arrayElement",value:0,position:0,state:"done"}),r.record("init","Base case: ans[0] = 0 (zero has no 1-bits)"),0===t)return r.record("final",`Result: [${s.join(", ")}]`),r.getSteps();r.add_new_variable("i",1);for(let e=1;e<=t;e++){r.update_variable("i",e);let t=e&e-1,n=s[t];r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.update_visual("ptr_prev",{type:"pointer",position:t,label:"i&(i-1)"}),r.add_new_variable("prevIdx",t),r.add_new_variable("prevBits",n),r.record("compute",`i & (i-1) = ${e} & ${e-1} = ${t} drops the lowest set bit of ${e}, so ans[${e}] = ans[${t}] + 1`),s[e]=n+1,r.update_visual(`elem_${e}`,{type:"arrayElement",value:s[e],position:e,state:"done"}),r.record("assign",`ans[${e}] = ${n} + 1 = ${s[e]}`),r.delete_variable("prevIdx"),r.delete_variable("prevBits")}return r.delete_visual("ptr_i"),r.delete_visual("ptr_prev"),r.delete_variable("i"),r.record("final",`Every answer built from an earlier one. Result: [${s.join(", ")}]`),r.getSteps()
}

export function CountingBitsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountingBitsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountingBitsSteps(e) as any[];
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
      title="Counting Bits"
      slug="counting-bits"
      approaches={approaches}
      presets={CountingBitsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Single Number III (single-number-iii)
// ==========================================

const SingleNumberIiiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def singleNumber(self, nums: list[int]) -> list[int]:\n        # XOR all elements to get x ^ y\n        xor_all = 0\n        for num in nums:\n            xor_all ^= num\n\n        # Isolate the rightmost set bit (where x and y differ)\n        diff_bit = xor_all & (-xor_all)\n\n        # XOR only the elements with diff_bit set\n        x = 0\n        for num in nums:\n            if num & diff_bit:\n                x ^= num\n\n        # The other unique number is xor_all ^ x\n        return [x, xor_all ^ x]",
    "lineMap": {
      "start": [
        2
      ],
      "phase1_start": [
        4
      ],
      "phase1_xor": [
        6
      ],
      "phase1_complete": [
        6
      ],
      "find_bit": [
        9
      ],
      "phase2_start": [
        12
      ],
      "phase2_group": [
        14
      ],
      "phase2_if": [
        14
      ],
      "phase2_if_xor": [
        15
      ],
      "phase2_else": [
        13
      ],
      "derive": [
        18
      ],
      "final": [
        18
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] singleNumber(int[] nums) {\n        // XOR all elements to get x ^ y\n        int xorAll = 0;\n        for (int num : nums) {\n            xorAll ^= num;\n        }\n\n        // Isolate the rightmost set bit (where x and y differ)\n        int diffBit = xorAll & (-xorAll);\n\n        // XOR only the elements with diffBit set\n        int x = 0;\n        for (int num : nums) {\n            if ((num & diffBit) != 0) {\n                x ^= num;\n            }\n        }\n\n        // The other unique number is xorAll ^ x\n        return new int[]{x, xorAll ^ x};\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "phase1_start": [
        4
      ],
      "phase1_xor": [
        6
      ],
      "phase1_complete": [
        6
      ],
      "find_bit": [
        10
      ],
      "phase2_start": [
        13
      ],
      "phase2_group": [
        15
      ],
      "phase2_if": [
        15
      ],
      "phase2_if_xor": [
        16
      ],
      "phase2_else": [
        14
      ],
      "derive": [
        21
      ],
      "final": [
        21
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> singleNumber(vector<int>& nums) {\n        // XOR all elements to get x ^ y\n        long long xorAll = 0;\n        for (int num : nums) {\n            xorAll ^= num;\n        }\n\n        // Isolate the rightmost set bit (where x and y differ)\n        // Use long long to avoid overflow when xorAll is INT_MIN\n        long long diffBit = xorAll & (-xorAll);\n\n        // XOR only the elements with diffBit set\n        int x = 0;\n        for (int num : nums) {\n            if (num & diffBit) {\n                x ^= num;\n            }\n        }\n\n        // The other unique number is xorAll ^ x\n        return {x, (int)(xorAll ^ x)};\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "phase1_start": [
        5
      ],
      "phase1_xor": [
        7
      ],
      "phase1_complete": [
        7
      ],
      "find_bit": [
        12
      ],
      "phase2_start": [
        15
      ],
      "phase2_group": [
        17
      ],
      "phase2_if": [
        17
      ],
      "phase2_if_xor": [
        18
      ],
      "phase2_else": [
        16
      ],
      "derive": [
        23
      ],
      "final": [
        23
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] SingleNumber(int[] nums) {\n        // XOR all elements to get x ^ y\n        int xorAll = 0;\n        foreach (int num in nums) {\n            xorAll ^= num;\n        }\n\n        // Isolate the rightmost set bit (where x and y differ)\n        // Use long to avoid overflow when xorAll is INT_MIN\n        long diffBit = (long)xorAll & -(long)xorAll;\n\n        // XOR only the elements with diffBit set\n        int x = 0;\n        foreach (int num in nums) {\n            if ((num & diffBit) != 0) {\n                x ^= num;\n            }\n        }\n\n        // The other unique number is xorAll ^ x\n        return new int[] { x, xorAll ^ x };\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "phase1_start": [
        4
      ],
      "phase1_xor": [
        6
      ],
      "phase1_complete": [
        6
      ],
      "find_bit": [
        11
      ],
      "phase2_start": [
        14
      ],
      "phase2_group": [
        16
      ],
      "phase2_if": [
        16
      ],
      "phase2_if_xor": [
        17
      ],
      "phase2_else": [
        15
      ],
      "derive": [
        22
      ],
      "final": [
        22
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func singleNumber(nums []int) []int {\n    // XOR all elements to get x ^ y\n    xorAll := 0\n    for _, num := range nums {\n        xorAll ^= num\n    }\n\n    // Isolate the rightmost set bit (where x and y differ)\n    diffBit := xorAll & (-xorAll)\n\n    // XOR only the elements with diffBit set\n    x := 0\n    for _, num := range nums {\n        if num&diffBit != 0 {\n            x ^= num\n        }\n    }\n\n    // The other unique number is xorAll ^ x\n    return []int{x, xorAll ^ x}\n}",
    "lineMap": {
      "start": [
        1
      ],
      "phase1_start": [
        3
      ],
      "phase1_xor": [
        5
      ],
      "phase1_complete": [
        5
      ],
      "find_bit": [
        9
      ],
      "phase2_start": [
        12
      ],
      "phase2_group": [
        14
      ],
      "phase2_if": [
        14
      ],
      "phase2_if_xor": [
        15
      ],
      "phase2_else": [
        13
      ],
      "derive": [
        20
      ],
      "final": [
        20
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var singleNumber = function (nums) {\n  // XOR all elements to get x ^ y\n  let xorAll = 0\n  for (const num of nums) {\n    xorAll ^= num\n  }\n\n  // Isolate the rightmost set bit (where x and y differ)\n  const diffBit = xorAll & -xorAll\n\n  // XOR only the elements with diffBit set\n  let x = 0\n  for (const num of nums) {\n    if (num & diffBit) {\n      x ^= num\n    }\n  }\n\n  // The other unique number is xorAll ^ x\n  return [x, xorAll ^ x]\n}",
    "lineMap": {
      "start": [
        1
      ],
      "phase1_start": [
        3
      ],
      "phase1_xor": [
        5
      ],
      "phase1_complete": [
        5
      ],
      "find_bit": [
        9
      ],
      "phase2_start": [
        12
      ],
      "phase2_group": [
        14
      ],
      "phase2_if": [
        14
      ],
      "phase2_if_xor": [
        15
      ],
      "phase2_else": [
        13
      ],
      "derive": [
        20
      ],
      "final": [
        20
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function singleNumber(nums: number[]): number[] {\n  // XOR all elements to get x ^ y\n  let xorAll = 0\n  for (const num of nums) {\n    xorAll ^= num\n  }\n\n  // Isolate the rightmost set bit (where x and y differ)\n  const diffBit = xorAll & -xorAll\n\n  // XOR only the elements with diffBit set\n  let x = 0\n  for (const num of nums) {\n    if (num & diffBit) {\n      x ^= num\n    }\n  }\n\n  // The other unique number is xorAll ^ x\n  return [x, xorAll ^ x]\n}",
    "lineMap": {
      "start": [
        1
      ],
      "phase1_start": [
        3
      ],
      "phase1_xor": [
        5
      ],
      "phase1_complete": [
        5
      ],
      "find_bit": [
        9
      ],
      "phase2_start": [
        12
      ],
      "phase2_group": [
        14
      ],
      "phase2_if": [
        14
      ],
      "phase2_if_xor": [
        15
      ],
      "phase2_else": [
        13
      ],
      "derive": [
        20
      ],
      "final": [
        20
      ]
    },
    "conditionalMap": {
      "group_check_if": [
        14
      ]
    }
  }
};

const SingleNumberIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        2,
        1,
        3,
        2,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        0,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        5,
        5,
        8,
        8,
        9,
        3
      ]
    }
  }
];

function generateSingleNumberIiiSteps(e: any): any[] {
  let t=[...e.nums],l=t.length,n=t.reduce((e,t,l)=>(e[`elem_${l}`]={type:"arrayElement",value:t,position:l},e),{}),r=new StepRecorder({},{...n});r.record("start","Two numbers appear once, everything else twice. XOR everything, then use a bit where the two answers differ to isolate one of them");let a=0;r.add_new_variable("xorAll",a),r.update_visual("ptr_i",{type:"pointer",position:0,label:"i"}),r.record("phase1_start","Phase 1: XOR all elements. Pairs cancel, leaving xorAll = x ^ y");let s={};for(let e=0;e<l;e++){let l=t[e],i=a;r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.add_new_variable("i",e),r.add_new_variable("currentNum",l),r.add_new_variable("previousXor",i),a^=l,r.update_variable("xorAll",a);let n=s[l];void 0!==n?(delete s[l],r.add_new_variable("cancelPartner",n),r.update_visual(`elem_${n}`,{type:"arrayElement",value:t[n],position:n,state:"cancelled"}),r.update_visual(`elem_${e}`,{type:"arrayElement",value:l,position:e,state:"cancelled"}),r.record("phase1_xor",`${i} ^ ${l} = ${a}. The pair of ${l}s cancels out`),r.delete_variable("cancelPartner")):(s[l]=e,r.update_visual(`elem_${e}`,{type:"arrayElement",value:l,position:e,state:"kept"}),r.record("phase1_xor",`${i} ^ ${l} = ${a}`)),r.delete_variable("currentNum"),r.delete_variable("previousXor")}r.delete_visual("ptr_i"),r.delete_variable("i"),r.record("phase1_complete",`xorAll = x ^ y = ${a}. The two survivors differ wherever xorAll has a 1-bit`);let o=a&-a;r.add_new_variable("diffBit",o),r.record("find_bit",`diffBit = xorAll & -xorAll = ${a} & ${-a} = ${o}: the rightmost bit where the two answers differ`);let u=0;r.add_new_variable("x",u),r.record("phase2_start",`Phase 2: XOR only the elements with diffBit = ${o} set. Their pairs still cancel, so the group collapses to one singleton`);for(let e=0;e<l;e++)r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});r.update_visual("ptr_i",{type:"pointer",position:0,label:"i"});for(let e=0;e<l;e++){let l=t[e],i=l&o,n=+(0!==i),a=u;r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.add_new_variable("i",e),r.add_new_variable("currentNum",l),r.add_new_variable("bitResult",i),r.add_new_variable("group",n),r.add_new_variable("previousX",a),r.record("phase2_group",`(${l} & ${o}) = ${i}: ${0===i?"bit not set, skip it":"bit set, fold it into x"}`),0!==i?(r.add_conditional("group_check_if",!0),r.update_visual(`elem_${e}`,{type:"arrayElement",value:l,position:e,state:"group1"}),r.record("phase2_if",`Bit set: ${l} belongs to the group we XOR`),u^=l,r.update_variable("x",u),r.record("phase2_if_xor",`x = ${a} ^ ${l} = ${u}`)):(r.add_conditional("group_check_if",!1),r.update_visual(`elem_${e}`,{type:"arrayElement",value:l,position:e,state:"group0"}),r.record("phase2_else",`Bit not set: ${l} is skipped, it belongs to the other group`)),r.delete_variable("currentNum"),r.delete_variable("bitResult"),r.delete_variable("group"),r.delete_variable("previousX")}r.delete_visual("ptr_i"),r.delete_variable("i");let d=a^u;r.add_new_variable("y",d),r.record("derive",`The other singleton is xorAll ^ x = ${a} ^ ${u} = ${d}, so no second pass is needed`);let h=t.indexOf(u),p=t.indexOf(d);for(let e=0;e<l;e++)r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:e===h?"answer1":e===p?"answer0":"cancelled"});return r.record("final",`The two numbers that appear once are ${u} and ${d}`),r.getSteps()
}

export function SingleNumberIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SingleNumberIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSingleNumberIiiSteps(e) as any[];
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
      title="Single Number III"
      slug="single-number-iii"
      approaches={approaches}
      presets={SingleNumberIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Hamming Distance (hamming-distance)
// ==========================================

const HammingDistanceTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def hammingDistance(self, x: int, y: int) -> int:\n        xor = x ^ y\n        count = 0\n\n        # Each iteration clears the lowest set bit\n        while xor:\n            xor = xor & (xor - 1)\n            count += 1\n\n        return count",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "compute_xor": [
        3
      ],
      "highlight_diff": [
        3,
        4
      ],
      "count_bit": [
        7
      ],
      "bit_cleared": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int hammingDistance(int x, int y) {\n        int xor = x ^ y;\n        int count = 0;\n\n        // Each iteration clears the lowest set bit\n        while (xor != 0) {\n            xor = xor & (xor - 1);\n            count++;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "compute_xor": [
        3
      ],
      "highlight_diff": [
        3,
        4
      ],
      "count_bit": [
        7
      ],
      "bit_cleared": [
        8,
        9
      ],
      "complete": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int hammingDistance(int x, int y) {\n        int xorVal = x ^ y;\n        int count = 0;\n\n        // Each iteration clears the lowest set bit\n        while (xorVal != 0) {\n            xorVal = xorVal & (xorVal - 1);\n            count++;\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "show_inputs": [
        3
      ],
      "compute_xor": [
        4
      ],
      "highlight_diff": [
        4,
        5
      ],
      "count_bit": [
        8
      ],
      "bit_cleared": [
        9,
        10
      ],
      "complete": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int HammingDistance(int x, int y) {\n        int xor = x ^ y;\n        int count = 0;\n\n        // Each iteration clears the lowest set bit\n        while (xor != 0) {\n            xor = xor & (xor - 1);\n            count++;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "compute_xor": [
        3
      ],
      "highlight_diff": [
        3,
        4
      ],
      "count_bit": [
        7
      ],
      "bit_cleared": [
        8,
        9
      ],
      "complete": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func hammingDistance(x int, y int) int {\n    xor := x ^ y\n    count := 0\n\n    // Each iteration clears the lowest set bit\n    for xor != 0 {\n        xor = xor & (xor - 1)\n        count++\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "compute_xor": [
        2
      ],
      "highlight_diff": [
        2,
        3
      ],
      "count_bit": [
        6
      ],
      "bit_cleared": [
        7,
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var hammingDistance = function(x, y) {\n    var xor = x ^ y;\n    var count = 0;\n\n    // Each iteration clears the lowest set bit\n    while (xor !== 0) {\n        xor = xor & (xor - 1);\n        count++;\n    }\n\n    return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "compute_xor": [
        2
      ],
      "highlight_diff": [
        2,
        3
      ],
      "count_bit": [
        6
      ],
      "bit_cleared": [
        7,
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function hammingDistance(x: number, y: number): number {\n    let xor = x ^ y;\n    let count = 0;\n\n    // Each iteration clears the lowest set bit\n    while (xor !== 0) {\n        xor = xor & (xor - 1);\n        count++;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "compute_xor": [
        2
      ],
      "highlight_diff": [
        2,
        3
      ],
      "count_bit": [
        6
      ],
      "bit_cleared": [
        7,
        8
      ],
      "complete": [
        11
      ]
    }
  }
};

const HammingDistancePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "x": 1,
      "y": 4
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "x": 3,
      "y": 1
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "x": 93,
      "y": 73
    }
  }
];

function generateHammingDistanceSteps(e: any): any[] {
  let t=e.x,i=e.y;function r(e){let t=[];for(let i=7;i>=0;i--)t.push(e>>i&1);return t}let n=r(t),l=r(i),o={};for(let e=0;e<8;e++)o[`x_bit_${e}`]={type:"arrayElement",value:n[e],position:e},o[`y_bit_${e}`]={type:"arrayElement",value:l[e],position:e};o.meta_x={type:"metadata",value:t},o.meta_y={type:"metadata",value:i},o.meta_xor={type:"metadata",value:""},o.meta_count={type:"metadata",value:0},o.meta_phase={type:"metadata",value:"init"};let s=new StepRecorder({},o);s.record("-",`Compute Hamming distance between ${t} and ${i}`),s.update_visual("meta_phase",{type:"metadata",value:"show_inputs"}),s.record("show_inputs",`x = ${t} (${n.join("")})₂, y = ${i} (${l.join("")})₂`);let u=t^i,c=r(u);for(let e=0;e<8;e++)o[`xor_bit_${e}`]={type:"arrayElement",value:c[e],position:e},s.add_new_visual(`xor_bit_${e}`,{type:"arrayElement",value:c[e],position:e});s.update_visual("meta_xor",{type:"metadata",value:u}),s.update_visual("meta_phase",{type:"metadata",value:"compute_xor"}),s.record("compute_xor",`x ^ y = ${t} ^ ${i} = ${u} (${c.join("")})₂`);for(let e=0;e<8;e++)n[e]!==l[e]?(s.update_visual(`x_bit_${e}`,{type:"arrayElement",value:n[e],position:e,state:"active"}),s.update_visual(`y_bit_${e}`,{type:"arrayElement",value:l[e],position:e,state:"active"}),s.update_visual(`xor_bit_${e}`,{type:"arrayElement",value:c[e],position:e,state:"active"})):(s.update_visual(`x_bit_${e}`,{type:"arrayElement",value:n[e],position:e}),s.update_visual(`y_bit_${e}`,{type:"arrayElement",value:l[e],position:e}),s.update_visual(`xor_bit_${e}`,{type:"arrayElement",value:c[e],position:e}));s.update_visual("meta_phase",{type:"metadata",value:"highlight_diff"}),s.record("highlight_diff","Bits where x and y differ are 1 in XOR result. Count of 1s = Hamming distance");let d=u,p=0;for(let e=0;e<8;e++)s.update_visual(`x_bit_${e}`,{type:"arrayElement",value:n[e],position:e,state:"muted"}),s.update_visual(`y_bit_${e}`,{type:"arrayElement",value:l[e],position:e,state:"muted"}),s.update_visual(`xor_bit_${e}`,{type:"arrayElement",value:c[e],position:e});for(;0!==d;){let e=r(d),t=-1;for(let i=7;i>=0;i--)if(1===e[i]){t=i;break}for(let i=0;i<8;i++)i===t?s.update_visual(`xor_bit_${i}`,{type:"arrayElement",value:e[i],position:i,state:"highlight"}):1===e[i]?s.update_visual(`xor_bit_${i}`,{type:"arrayElement",value:e[i],position:i}):s.update_visual(`xor_bit_${i}`,{type:"arrayElement",value:e[i],position:i,state:"muted"});s.update_visual("meta_phase",{type:"metadata",value:"count_bit"}),s.record("count_bit",`xor = ${d} (${e.join("")})₂, found a set bit, count++`),d&=d-1,p++;let i=r(d);for(let e=0;e<8;e++)1===i[e]?s.update_visual(`xor_bit_${e}`,{type:"arrayElement",value:i[e],position:e}):s.update_visual(`xor_bit_${e}`,{type:"arrayElement",value:i[e],position:e,state:"muted"});s.update_visual("meta_count",{type:"metadata",value:p}),s.update_visual("meta_phase",{type:"metadata",value:"bit_cleared"}),s.record("bit_cleared",`xor & (xor-1) = ${d} (${i.join("")})₂, count = ${p}`)}return s.update_visual("meta_phase",{type:"metadata",value:"complete"}),s.record("complete",`Hamming distance between ${t} and ${i} is ${p}`),s.getSteps()
}

export function HammingDistanceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HammingDistanceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateHammingDistanceSteps(e) as any[];
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
      title="Hamming Distance"
      slug="hamming-distance"
      approaches={approaches}
      presets={HammingDistancePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of 1 Bits (number-of-1-bits)
// ==========================================

const NumberOf1BitsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def hammingWeight(self, n: int) -> int:\n        count = 0\n\n        while n:\n            # Clear the lowest set bit\n            n = n & (n - 1)\n            count += 1\n\n        return count",
    "lineMap": {
      "-": [
        2
      ],
      "check_loop": [
        5
      ],
      "and_operation": [
        7
      ],
      "increment": [
        8
      ],
      "complete": [
        10
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
    "code": "class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n\n        while (n != 0) {\n            // Clear the lowest set bit\n            n = n & (n - 1);\n            count++;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_loop": [
        5
      ],
      "and_operation": [
        7
      ],
      "increment": [
        8
      ],
      "complete": [
        11
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
    "code": "class Solution {\npublic:\n    int hammingWeight(int n) {\n        int count = 0;\n\n        while (n != 0) {\n            // Clear the lowest set bit\n            n = n & (n - 1);\n            count++;\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_loop": [
        6
      ],
      "and_operation": [
        8
      ],
      "increment": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "while_check": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int HammingWeight(int n) {\n        int count = 0;\n\n        while (n != 0) {\n            // Clear the lowest set bit\n            n = n & (n - 1);\n            count++;\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_loop": [
        5
      ],
      "and_operation": [
        7
      ],
      "increment": [
        8
      ],
      "complete": [
        11
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
    "code": "func hammingWeight(n int) int {\n    count := 0\n\n    for n != 0 {\n        // Clear the lowest set bit\n        n = n & (n - 1)\n        count++\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "and_operation": [
        6
      ],
      "increment": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var hammingWeight = function(n) {\n    let count = 0;\n\n    while (n !== 0) {\n        // Clear the lowest set bit\n        n = n & (n - 1);\n        count++;\n    }\n\n    return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "and_operation": [
        6
      ],
      "increment": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function hammingWeight(n: number): number {\n    let count = 0;\n\n    while (n !== 0) {\n        // Clear the lowest set bit\n        n = n & (n - 1);\n        count++;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_loop": [
        4
      ],
      "and_operation": [
        6
      ],
      "increment": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  }
};

const NumberOf1BitsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: 1011",
    "value": {
      "n": 11
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: 10000000",
    "value": {
      "n": 128
    }
  },
  {
    "id": "ex3",
    "label": "Example 3: 11111111",
    "value": {
      "n": 255
    }
  }
];

function generateNumberOf1BitsSteps(e: any): any[] {
  let t=e.n,n=e=>Array.from({length:8},(t,n)=>e>>7-n&1),i={};n(t).forEach((e,t)=>{i[`bit_${t}`]={type:"arrayElement",value:e,position:t}});let l=new StepRecorder({},i),a=t.toString(2).padStart(8,"0");l.record("-",`n = ${t} (${a}). Count the 1-bits: n & (n-1) clears the lowest set bit, so loop until n = 0`);let s=0;l.add_new_variable("count",s),l.add_new_variable("n",t);let o=(e,t)=>{n(e).forEach((e,n)=>{l.update_visual(`bit_${n}`,{type:"arrayElement",value:e,position:n,state:n===t?"cleared":void 0})})};for(;;){let e=0!==t;if(l.add_conditional("while_check",e),!e){o(0,-1),l.record("check_loop",`n = 0: no set bits remain. count = ${s}`);break}let n=t.toString(2).padStart(8,"0");o(t,-1),l.record("check_loop",`n = ${t} (${n}) is not 0, clear its lowest set bit`);let r=t-1,i=t&r,a=7-Math.log2(t&-t);l.update_visual(`bit_${a}`,{type:"arrayElement",value:1,position:a,state:"clearing"}),l.add_new_variable("nMinus1",r),l.add_new_variable("andResult",i),l.add_new_variable("clearedCol",a),l.record("and_operation",`n & (n-1) = ${t} & ${r} = ${i}: the lowest set bit vanishes`),t=i,s++,l.update_variable("n",t),l.update_variable("count",s),l.delete_variable("nMinus1"),l.delete_variable("andResult"),l.delete_variable("clearedCol"),o(t,a),l.record("increment",`One set bit cleared: count = ${s}`)}return l.record("complete",`n reached 0 after ${s} rounds. The number of 1-bits is ${s}`),l.getSteps()
}

export function NumberOf1BitsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOf1BitsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOf1BitsSteps(e) as any[];
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
      title="Number of 1 Bits"
      slug="number-of-1-bits"
      approaches={approaches}
      presets={NumberOf1BitsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Bits (reverse-bits)
// ==========================================

const ReverseBitsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reverseBits(self, n: int) -> int:\n        result = 0\n        for i in range(32):\n            # Shift result left to make room, then add last bit of n\n            result = (result << 1) | (n & 1)\n            # Move to next bit of n\n            n >>= 1\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "extract_bit": [
        6
      ],
      "shift_or": [
        6
      ],
      "shift_n": [
        8
      ],
      "complete": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int reverseBits(int n) {\n        int result = 0;\n        for (int i = 0; i < 32; i++) {\n            // Shift result left to make room, then add last bit of n\n            result = (result << 1) | (n & 1);\n            // Move to next bit of n\n            n >>= 1;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "extract_bit": [
        6
      ],
      "shift_or": [
        6
      ],
      "shift_n": [
        8
      ],
      "complete": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        uint32_t result = 0;\n        for (int i = 0; i < 32; i++) {\n            // Shift result left to make room, then add last bit of n\n            result = (result << 1) | (n & 1);\n            // Move to next bit of n\n            n >>= 1;\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4
      ],
      "extract_bit": [
        7
      ],
      "shift_or": [
        7
      ],
      "shift_n": [
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int ReverseBits(int n) {\n        int result = 0;\n        for (int i = 0; i < 32; i++) {\n            // Shift result left to make room, then add last bit of n\n            result = (result << 1) | (n & 1);\n            // Move to next bit of n\n            n = (int)((uint)n >> 1);\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "extract_bit": [
        6
      ],
      "shift_or": [
        6
      ],
      "shift_n": [
        8
      ],
      "complete": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reverseBits(n uint32) uint32 {\n    var result uint32\n    for i := 0; i < 32; i++ {\n        // Shift result left to make room, then add last bit of n\n        result = (result << 1) | (n & 1)\n        // Move to next bit of n\n        n >>= 1\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "extract_bit": [
        5
      ],
      "shift_or": [
        5
      ],
      "shift_n": [
        7
      ],
      "complete": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reverseBits = function(n) {\n    var result = 0;\n    for (var i = 0; i < 32; i++) {\n        // Shift result left to make room, then add last bit of n\n        result = (result << 1) | (n & 1);\n        // Move to next bit of n\n        n >>>= 1;\n    }\n    // Convert to unsigned 32-bit integer\n    return result >>> 0;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "extract_bit": [
        5
      ],
      "shift_or": [
        5
      ],
      "shift_n": [
        7
      ],
      "complete": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reverseBits(n: number): number {\n    let result = 0;\n    for (let i = 0; i < 32; i++) {\n        // Shift result left to make room, then add last bit of n\n        result = (result << 1) | (n & 1);\n        // Move to next bit of n\n        n >>>= 1;\n    }\n    // Convert to unsigned 32-bit integer\n    return result >>> 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "extract_bit": [
        5
      ],
      "shift_or": [
        5
      ],
      "shift_n": [
        7
      ],
      "complete": [
        10
      ]
    }
  }
};

const ReverseBitsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: 00101011",
    "value": {
      "n": 43
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: 00001101",
    "value": {
      "n": 13
    }
  },
  {
    "id": "ex3",
    "label": "Example 3: 10110111",
    "value": {
      "n": 183
    }
  }
];

function generateReverseBitsSteps(e: any): any[] {
  let t=e.n,r=[],i={};for(let e=0;e<8;e++){let n=t>>7-e&1;r.push(n),i[`in_bit_${e}`]={type:"arrayElement",value:n,position:e}}let l=new StepRecorder({},i),s=e=>e.toString(2).padStart(8,"0");l.record("-",`Reverse the 8 bits of n = ${t} (${s(t)}): pull bits off the right of n and push them onto the right of result`);let a=0,o=t;l.add_new_variable("input",t),l.add_new_variable("n",o),l.add_new_variable("result",a),l.record("init","Initialize result = 0");let u=[];for(let e=0;e<8;e++){let t=1&o,n=`in_bit_${7-e}`;l.update_visual(n,{type:"arrayElement",value:t,position:7,state:"extract"}),l.update_visual(`out_bit_${e}`,{type:"arrayElement",value:t,position:8}),l.add_new_variable("bit",t),l.record("extract_bit",`bit = n & 1 = ${o} & 1 = ${t}`),a=a<<1|t,l.update_variable("result",a),u.push(t);for(let t=0;t<e;t++)l.update_visual(`out_bit_${t}`,{type:"arrayElement",value:u[t],position:7-(e-t)});l.update_visual(`out_bit_${e}`,{type:"arrayElement",value:t,position:7,state:"fresh"}),l.record("shift_or",`result = (result << 1) | ${t} = ${a} (${s(a)})`),o>>=1,l.update_variable("n",o);for(let t=0;t<7-e;t++)l.update_visual(`in_bit_${t}`,{type:"arrayElement",value:r[t],position:t+e+1});l.update_visual(n,{type:"arrayElement",value:t,position:8}),l.update_visual(`out_bit_${e}`,{type:"arrayElement",value:t,position:7}),l.record("shift_n",`n >>= 1: n = ${o} (${s(o)})`),l.delete_variable("bit")}for(let e=0;e<8;e++)l.update_visual(`in_bit_${e}`,{type:"arrayElement",value:r[e],position:e,state:"faded"});return l.record("complete",`All 8 bits reversed: ${t} (${s(t)}) becomes ${a} (${s(a)})`),l.getSteps()
}

export function ReverseBitsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReverseBitsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReverseBitsSteps(e) as any[];
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
      title="Reverse Bits"
      slug="reverse-bits"
      approaches={approaches}
      presets={ReverseBitsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Single Number II (single-number-ii)
// ==========================================

const SingleNumberIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def singleNumber(self, nums: list[int]) -> int:\n        ones, twos = 0, 0\n\n        for num in nums:\n            # ones tracks bits seen once (mod 3)\n            # twos tracks bits seen twice (mod 3)\n            ones = (ones ^ num) & ~twos\n            twos = (twos ^ num) & ~ones\n\n        # After all elements, ones holds bits that appeared once (mod 3)\n        return ones",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "process_num": [
        5
      ],
      "update_ones": [
        8
      ],
      "update_twos": [
        9
      ],
      "complete": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int singleNumber(int[] nums) {\n        int ones = 0, twos = 0;\n\n        for (int num : nums) {\n            // ones tracks bits seen once (mod 3)\n            // twos tracks bits seen twice (mod 3)\n            ones = (ones ^ num) & ~twos;\n            twos = (twos ^ num) & ~ones;\n        }\n\n        // After all elements, ones holds bits that appeared once (mod 3)\n        return ones;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "process_num": [
        5
      ],
      "update_ones": [
        8
      ],
      "update_twos": [
        9
      ],
      "complete": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int ones = 0, twos = 0;\n\n        for (int num : nums) {\n            // ones tracks bits seen once (mod 3)\n            // twos tracks bits seen twice (mod 3)\n            ones = (ones ^ num) & ~twos;\n            twos = (twos ^ num) & ~ones;\n        }\n\n        // After all elements, ones holds bits that appeared once (mod 3)\n        return ones;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4
      ],
      "process_num": [
        6
      ],
      "update_ones": [
        9
      ],
      "update_twos": [
        10
      ],
      "complete": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int SingleNumber(int[] nums) {\n        int ones = 0, twos = 0;\n\n        foreach (int num in nums) {\n            // ones tracks bits seen once (mod 3)\n            // twos tracks bits seen twice (mod 3)\n            ones = (ones ^ num) & ~twos;\n            twos = (twos ^ num) & ~ones;\n        }\n\n        // After all elements, ones holds bits that appeared once (mod 3)\n        return ones;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "process_num": [
        5
      ],
      "update_ones": [
        8
      ],
      "update_twos": [
        9
      ],
      "complete": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func singleNumber(nums []int) int {\n    ones, twos := 0, 0\n\n    for _, num := range nums {\n        // ones tracks bits seen once (mod 3)\n        // twos tracks bits seen twice (mod 3)\n        ones = (ones ^ num) & ^twos\n        twos = (twos ^ num) & ^ones\n    }\n\n    // After all elements, ones holds bits that appeared once (mod 3)\n    return ones\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "process_num": [
        4
      ],
      "update_ones": [
        7
      ],
      "update_twos": [
        8
      ],
      "complete": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var singleNumber = function (nums) {\n  let ones = 0,\n    twos = 0;\n\n  for (const num of nums) {\n    // ones tracks bits seen once (mod 3)\n    // twos tracks bits seen twice (mod 3)\n    ones = (ones ^ num) & ~twos;\n    twos = (twos ^ num) & ~ones;\n  }\n\n  // After all elements, ones holds bits that appeared once (mod 3)\n  return ones;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "process_num": [
        5
      ],
      "update_ones": [
        8
      ],
      "update_twos": [
        9
      ],
      "complete": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function singleNumber(nums: number[]): number {\n    let ones: number = 0, twos: number = 0;\n\n    for (const num of nums) {\n        // ones tracks bits seen once (mod 3)\n        // twos tracks bits seen twice (mod 3)\n        ones = (ones ^ num) & ~twos;\n        twos = (twos ^ num) & ~ones;\n    }\n\n    // After all elements, ones holds bits that appeared once (mod 3)\n    return ones;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "process_num": [
        4
      ],
      "update_ones": [
        7
      ],
      "update_twos": [
        8
      ],
      "complete": [
        12
      ]
    }
  }
};

const SingleNumberIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        2,
        2,
        3,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        0,
        1,
        0,
        1,
        0,
        1,
        99
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        1,
        1,
        1,
        2
      ]
    }
  }
];

function generateSingleNumberIiSteps(e: any): any[] {
  let t=[...e.nums],n=t.length,i={};for(let e=0;e<n;e++)i[`elem_${e}`]={type:"arrayElement",value:t[e],position:e};let l=new StepRecorder({},{...i});l.record("-","Every number appears three times except one. Track bits seen once in ones and twice in twos: a third sighting erases the bit from both");let r=0,o=0;l.add_new_variable("ones",r),l.add_new_variable("twos",o),l.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),l.record("init","Initialize ones = 0, twos = 0");for(let e=0;e<n;e++){let n=t[e],s=r,i=o;l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.add_new_variable("i",e),l.add_new_variable("num",n),l.add_new_variable("prevOnes",s),l.add_new_variable("prevTwos",i),l.record("process_num",`Process nums[${e}] = ${n}`),r=(r^n)&~o,l.update_variable("ones",r),l.record("update_ones",`ones = (${s} ^ ${n}) & ~${i} = ${r}`),o=(o^n)&~r,l.update_variable("twos",o),l.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"done"}),l.record("update_twos",`twos = (${i} ^ ${n}) & ~${r} = ${o}`),l.delete_variable("num"),l.delete_variable("prevOnes"),l.delete_variable("prevTwos")}l.delete_visual("ptr_i"),l.delete_variable("i");let a=t.indexOf(r);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:e===a?"answer":"cancelled"});return l.record("complete",`Every bit seen three times cancelled out of ones. The single number is ${r}`),l.getSteps()
}

export function SingleNumberIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SingleNumberIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSingleNumberIiSteps(e) as any[];
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
      title="Single Number II"
      slug="single-number-ii"
      approaches={approaches}
      presets={SingleNumberIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sum of Two Integers (sum-of-two-integers)
// ==========================================

const SumOfTwoIntegersTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def getSum(self, a: int, b: int) -> int:\n        # Python integers have arbitrary precision, so we need a 32-bit mask\n        MASK = 0xFFFFFFFF      # 32 bits of 1s\n        MAX_INT = 0x7FFFFFFF   # Maximum positive 32-bit integer\n\n        # Work within 32-bit space\n        a &= MASK\n        b &= MASK\n\n        while b != 0:\n            carry = ((a & b) << 1) & MASK  # Carry, masked to 32 bits\n            a = (a ^ b) & MASK             # Sum without carry, masked\n            b = carry\n\n        # If result exceeds MAX_INT, it's negative in 32-bit two's complement\n        return a if a <= MAX_INT else ~(a ^ MASK)",
    "lineMap": {
      "-": [
        2
      ],
      "show_values": [
        2
      ],
      "check_loop": [
        11
      ],
      "compute_carry": [
        12
      ],
      "compute_xor": [
        13
      ],
      "update_values": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_check": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int getSum(int a, int b) {\n        while (b != 0) {\n            int carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left\n            a = a ^ b;                 // Sum without carry: XOR\n            b = carry;                 // Process remaining carry in next iteration\n        }\n        return a;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_values": [
        2
      ],
      "check_loop": [
        3
      ],
      "compute_carry": [
        4
      ],
      "compute_xor": [
        5
      ],
      "update_values": [
        6
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "while_check": [
        3
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int getSum(int a, int b) {\n        // Work in unsigned: shifting a negative signed int left is undefined behavior in C++\n        unsigned int ua = a, ub = b;\n        while (ub != 0) {\n            unsigned int carry = (ua & ub) << 1;  // Carry: bits where both are 1, shifted left\n            ua = ua ^ ub;                          // Sum without carry: XOR\n            ub = carry;                            // Process remaining carry in next iteration\n        }\n        return static_cast<int>(ua);\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "show_values": [
        3
      ],
      "check_loop": [
        6
      ],
      "compute_carry": [
        7
      ],
      "compute_xor": [
        8
      ],
      "update_values": [
        9
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_check": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int GetSum(int a, int b) {\n        while (b != 0) {\n            int carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left\n            a = a ^ b;                 // Sum without carry: XOR\n            b = carry;                 // Process remaining carry in next iteration\n        }\n        return a;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_values": [
        2
      ],
      "check_loop": [
        3
      ],
      "compute_carry": [
        4
      ],
      "compute_xor": [
        5
      ],
      "update_values": [
        6
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "while_check": [
        3
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getSum(a int, b int) int {\n    for b != 0 {\n        carry := (a & b) << 1  // Carry: bits where both are 1, shifted left\n        a = a ^ b              // Sum without carry: XOR\n        b = carry              // Process remaining carry in next iteration\n    }\n    return a\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_values": [
        1
      ],
      "check_loop": [
        2
      ],
      "compute_carry": [
        3
      ],
      "compute_xor": [
        4
      ],
      "update_values": [
        5
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        2
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var getSum = function(a, b) {\n    while (b !== 0) {\n        var carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left\n        a = a ^ b;                 // Sum without carry: XOR\n        b = carry;                 // Process remaining carry in next iteration\n    }\n    return a;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "show_values": [
        1
      ],
      "check_loop": [
        2
      ],
      "compute_carry": [
        3
      ],
      "compute_xor": [
        4
      ],
      "update_values": [
        5
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        2
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getSum(a: number, b: number): number {\n    while (b !== 0) {\n        const carry = (a & b) << 1;  // Carry: bits where both are 1, shifted left\n        a = a ^ b;                   // Sum without carry: XOR\n        b = carry;                   // Process remaining carry in next iteration\n    }\n    return a;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_values": [
        1
      ],
      "check_loop": [
        2
      ],
      "compute_carry": [
        3
      ],
      "compute_xor": [
        4
      ],
      "update_values": [
        5
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        2
      ]
    }
  }
};

const SumOfTwoIntegersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "a": 1,
      "b": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "a": 2,
      "b": 3
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "a": 7,
      "b": 5
    }
  }
];

function generateSumOfTwoIntegersSteps(e: any): any[] {
  function i(e){return(e>>>0).toString(2).padStart(8,'0').slice(-8)}
let t=e.a,r=e.b,a=t,l=r,s=e=>Array.from({length:8},(t,r)=>e>>7-r&1),o={};s(t).forEach((e,t)=>{o[`a_bit_${t}`]={type:"arrayElement",value:e,position:t}}),s(r).forEach((e,t)=>{o[`b_bit_${t}`]={type:"arrayElement",value:e,position:t}});let c=new StepRecorder({},o);c.add_new_variable("a",t),c.add_new_variable("b",r),c.add_new_variable("carry",0),c.add_new_variable("origA",a),c.add_new_variable("origB",l),c.add_new_variable("iter",0),c.record("-",`Add ${t} + ${r} without the + operator: XOR adds each column without carry, AND shifted left is the carry. Repeat until the carry dies out`);let u=(e,t)=>{s(t).forEach((t,r)=>{c.update_visual(`${e}_bit_${r}`,{type:"arrayElement",value:t,position:r})})},d=0;for(;0!==r;){d++,c.update_variable("iter",d),c.record("show_values",`Round ${d}: a = ${t} (${i(t)}), b = ${r} (${i(r)})`),c.add_conditional("while_check",!0),c.record("check_loop",`b = ${r} is not 0: there is still carry to add in`);let e=(t&r)<<1&255;c.update_variable("carry",e),c.record("compute_carry",`carry = (a & b) << 1 = (${t} & ${r}) << 1 = ${t&r} << 1 = ${e}`);let n=t;t=(t^r)&255,c.add_new_variable("prevA",n),c.update_variable("a",t),u("a",t),c.record("compute_xor",`a = a ^ b = ${n} ^ ${r} = ${t}`),c.delete_variable("prevA"),r=e,c.update_variable("b",r),u("b",r),c.record("update_values",`b = carry = ${r} (${i(r)})`)}return c.add_conditional("while_check",!1),c.record("complete",`b = 0: no carry left. ${a} + ${l} = ${t}`),c.getSteps()
}

export function SumOfTwoIntegersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SumOfTwoIntegersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSumOfTwoIntegersSteps(e) as any[];
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
      title="Sum of Two Integers"
      slug="sum-of-two-integers"
      approaches={approaches}
      presets={SumOfTwoIntegersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Bitwise AND of Numbers Range (bitwise-and-of-numbers-range)
// ==========================================

const BitwiseAndOfNumbersRangeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def rangeBitwiseAnd(self, left: int, right: int) -> int:\n        # Clear the lowest set bit of right until right <= left\n        while right > left:\n            right = right & (right - 1)\n        # right now holds the common prefix\n        return right",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "check_loop": [
        4
      ],
      "clear_bit": [
        5
      ],
      "compute_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int rangeBitwiseAnd(int left, int right) {\n        // Clear the lowest set bit of right until right <= left\n        while (right > left) {\n            right = right & (right - 1);\n        }\n        // right now holds the common prefix\n        return right;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "check_loop": [
        4
      ],
      "clear_bit": [
        5
      ],
      "compute_result": [
        8
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int rangeBitwiseAnd(int left, int right) {\n        // Clear the lowest set bit of right until right <= left\n        while (right > left) {\n            right = right & (right - 1);\n        }\n        // right now holds the common prefix\n        return right;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "show_inputs": [
        3
      ],
      "check_loop": [
        5
      ],
      "clear_bit": [
        6
      ],
      "compute_result": [
        9
      ],
      "complete": [
        9
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
    "code": "public class Solution {\n    public int RangeBitwiseAnd(int left, int right) {\n        // Clear the lowest set bit of right until right <= left\n        while (right > left) {\n            right = right & (right - 1);\n        }\n        // right now holds the common prefix\n        return right;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "show_inputs": [
        2
      ],
      "check_loop": [
        4
      ],
      "clear_bit": [
        5
      ],
      "compute_result": [
        8
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "while_check": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rangeBitwiseAnd(left int, right int) int {\n    // Clear the lowest set bit of right until right <= left\n    for right > left {\n        right = right & (right - 1)\n    }\n    // right now holds the common prefix\n    return right\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "check_loop": [
        3
      ],
      "clear_bit": [
        4
      ],
      "compute_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        3
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var rangeBitwiseAnd = function(left, right) {\n    // Clear the lowest set bit of right until right <= left\n    while (right > left) {\n        right = right & (right - 1);\n    }\n    // right now holds the common prefix\n    return right;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "check_loop": [
        3
      ],
      "clear_bit": [
        4
      ],
      "compute_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        3
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rangeBitwiseAnd(left: number, right: number): number {\n    // Clear the lowest set bit of right until right <= left\n    while (right > left) {\n        right = right & (right - 1);\n    }\n    // right now holds the common prefix\n    return right;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "show_inputs": [
        1
      ],
      "check_loop": [
        3
      ],
      "clear_bit": [
        4
      ],
      "compute_result": [
        7
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "while_check": [
        3
      ]
    }
  }
};

const BitwiseAndOfNumbersRangePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "left": 5,
      "right": 7
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "left": 0,
      "right": 0
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "left": 12,
      "right": 15
    }
  }
];

function generateBitwiseAndOfNumbersRangeSteps(e: any): any[] {
  function n(e){return e.toString(2).padStart(8,'0')}
let t=e.left,r=e.right,l=r,s=e=>Array.from({length:8},(t,r)=>e>>7-r&1),a={};s(t).forEach((e,t)=>{a[`left_bit_${t}`]={type:"arrayElement",value:e,position:t}}),s(r).forEach((e,t)=>{a[`right_bit_${t}`]={type:"arrayElement",value:e,position:t}});let o=new StepRecorder({},a);for(o.add_new_variable("left",t),o.add_new_variable("right",r),o.add_new_variable("originalLeft",t),o.add_new_variable("originalRight",l),o.record("-",`AND every number from ${t} to ${r}: the differing low bits get wiped out, only the shared prefix survives`),o.record("show_inputs",`left = ${t} (${n(t)}), right = ${r} (${n(r)})`);r>t;){o.add_conditional("while_check",!0),o.record("check_loop",`right (${r}) > left (${t}): the range spans differing bits, clear the lowest set bit of right`);let e=r,i=r-1;r&=i;let l=7-Math.log2(e&-e);o.update_visual(`right_bit_${l}`,{type:"arrayElement",value:0,position:l,state:"cleared"}),o.update_variable("right",r),o.add_new_variable("prevRight",e),o.add_new_variable("rightMinus1",i),o.add_new_variable("clearedCol",l),o.record("clear_bit",`right = ${e} & ${i} = ${r} (${n(r)})`),o.delete_variable("prevRight"),o.delete_variable("rightMinus1"),o.delete_variable("clearedCol")}o.add_conditional("while_check",!1),o.record("check_loop",`right (${r}) <= left (${t}): every differing bit is gone, stop`);let c=r,u=n(t),d=n(l),h=0;for(;h<8&&u[h]===d[h];)h++;return s(c).forEach((e,t)=>{o.update_visual(`res_bit_${t}`,{type:"arrayElement",value:e,position:t})}),o.add_new_variable("result",c),o.add_new_variable("prefixLen",h),o.record("compute_result",`right now holds the common prefix: result = ${c} (${n(c)})`),o.record("complete",`AND of range [${t}, ${l}] = ${c}: only the shared prefix of ${t} and ${l} survives`),o.getSteps()
}

export function BitwiseAndOfNumbersRangeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BitwiseAndOfNumbersRangeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBitwiseAndOfNumbersRangeSteps(e) as any[];
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
      title="Bitwise AND of Numbers Range"
      slug="bitwise-and-of-numbers-range"
      approaches={approaches}
      presets={BitwiseAndOfNumbersRangePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
