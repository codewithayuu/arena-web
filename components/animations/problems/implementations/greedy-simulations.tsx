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

const _treeHelper848569 = {
  Gu: function(e) {
    if (!e || 0 === e.length) return [];
    let t = [], r = [0], l = 0;
    for (; l < e.length && r.length > 0; ) {
      let n = r.shift(), i = e[l++];
      for (; t.length <= n; ) t.push(null);
      t[n] = i, null !== i && (r.push(2 * n + 1), r.push(2 * n + 2));
    }
    return t;
  },
  kU: function(e) {
    return null == e ? null : "Node(" + (e ? e.value : "") + ")";
  },
  E4: function(e, t) {
    function r(r, l) {
      let n = e.get(r);
      n && t.update_visual("node_" + r, {
        type: "binaryTreeNode",
        value: n.value,
        parent: void 0 !== n.parent ? ("node_" + n.parent) : void 0,
        isLeftChild: n.isLeftChild,
        state: l
      });
    }
    return {
      updateNodeState: r,
      setNodeStateExclusive: function(l, n, i) {
        let a = t.getCurrentVisuals();
        e.forEach((e, t) => {
          if (t !== l) {
            let e = a["node_" + t];
            e && e.state === n && r(t, i);
          }
        }), r(l, n);
      },
      resetNodesWithState: function(l, n) {
        let i = t.getCurrentVisuals();
        e.forEach((e, t) => {
          let a = i["node_" + t];
          a && a.state === l && r(t, n);
        });
      }
    };
  }
};
let n = _treeHelper848569;
let Gu = _treeHelper848569.Gu;
let kU = _treeHelper848569.kU;
let E4 = _treeHelper848569.E4;

function elementsFromVisualState(visualState: Record<string, any>): {
  elements: VisualArrayElement[];
  pointers: VisualPointer[];
} {
  const elements: VisualArrayElement[] = [];
  const pointers: VisualPointer[] = [];

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;
    if (
      item.type === "arrayElement" ||
      item.type === "element" ||
      item.type === "char" ||
      item.type === "stateElement" ||
      item.type === "node" ||
      item.type === "treeNode" ||
      item.type === "cell" ||
      item.type === "stackElement" ||
      item.type === "bar" ||
      item.type === "token" ||
      item.type === "heapNode" ||
      item.type === "interval" ||
      item.type === "card"
    ) {
      elements.push({
        value: item.value ?? item.char ?? item.height ?? item.val ?? (item.start !== undefined ? `[${item.start},${item.end}]` : ""),
        position: item.position ?? (typeof item.col === "number" ? item.col : (typeof item.index === "number" ? item.index : 0)),
        state: item.state || (item.isHighlighted ? "active" : item.isCurrent ? "current" : "idle"),
      });
    } else if (item.type === "pointer") {
      pointers.push({
        position: item.position ?? item.index ?? 0,
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
// Jump Game II (jump-game-ii)
// ==========================================

const JumpGameIiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def jump(self, nums: list[int]) -> int:\n        n = len(nums)\n        jumps = 0\n        current_end = 0\n        farthest = 0\n\n        # Process indices 0 to n-2; we don't need to jump from the last index\n        for i in range(n - 1):\n            farthest = max(farthest, i + nums[i])\n\n            # Reached the end of the current BFS level\n            if i == current_end:\n                jumps += 1\n                current_end = farthest\n\n                # Early exit if we can already reach the end\n                if current_end >= n - 1:\n                    break\n\n        return jumps",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_farthest": [
        9,
        10
      ],
      "keep_farthest": [
        9,
        10
      ],
      "make_jump": [
        13,
        14,
        15
      ],
      "early_exit": [
        18,
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "reached_boundary": [
        13
      ],
      "check_end": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int jump(int[] nums) {\n        int n = nums.length;\n        int jumps = 0;\n        int currentEnd = 0;\n        int farthest = 0;\n\n        // Process indices 0 to n-2; we don't need to jump from the last index\n        for (int i = 0; i < n - 1; i++) {\n            farthest = Math.max(farthest, i + nums[i]);\n\n            // Reached the end of the current BFS level\n            if (i == currentEnd) {\n                jumps++;\n                currentEnd = farthest;\n\n                // Early exit if we can already reach the end\n                if (currentEnd >= n - 1) {\n                    break;\n                }\n            }\n        }\n\n        return jumps;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_farthest": [
        9,
        10
      ],
      "keep_farthest": [
        9,
        10
      ],
      "make_jump": [
        13,
        14,
        15
      ],
      "early_exit": [
        18,
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "reached_boundary": [
        13
      ],
      "check_end": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int jump(vector<int>& nums) {\n        int n = nums.size();\n        int jumps = 0;\n        int currentEnd = 0;\n        int farthest = 0;\n\n        // Process indices 0 to n-2; we don't need to jump from the last index\n        for (int i = 0; i < n - 1; i++) {\n            farthest = max(farthest, i + nums[i]);\n\n            // Reached the end of the current BFS level\n            if (i == currentEnd) {\n                jumps++;\n                currentEnd = farthest;\n\n                // Early exit if we can already reach the end\n                if (currentEnd >= n - 1) {\n                    break;\n                }\n            }\n        }\n\n        return jumps;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "initialize": [
        4,
        5,
        6,
        7
      ],
      "update_farthest": [
        10,
        11
      ],
      "keep_farthest": [
        10,
        11
      ],
      "make_jump": [
        14,
        15,
        16
      ],
      "early_exit": [
        19,
        20
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "reached_boundary": [
        14
      ],
      "check_end": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int Jump(int[] nums) {\n        int n = nums.Length;\n        int jumps = 0;\n        int currentEnd = 0;\n        int farthest = 0;\n\n        // Process indices 0 to n-2; we don't need to jump from the last index\n        for (int i = 0; i < n - 1; i++) {\n            farthest = Math.Max(farthest, i + nums[i]);\n\n            // Reached the end of the current BFS level\n            if (i == currentEnd) {\n                jumps++;\n                currentEnd = farthest;\n\n                // Early exit if we can already reach the end\n                if (currentEnd >= n - 1) {\n                    break;\n                }\n            }\n        }\n\n        return jumps;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_farthest": [
        9,
        10
      ],
      "keep_farthest": [
        9,
        10
      ],
      "make_jump": [
        13,
        14,
        15
      ],
      "early_exit": [
        18,
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "reached_boundary": [
        13
      ],
      "check_end": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func jump(nums []int) int {\n    n := len(nums)\n    jumps := 0\n    currentEnd := 0\n    farthest := 0\n\n    // Process indices 0 to n-2; we don't need to jump from the last index\n    for i := 0; i < n-1; i++ {\n        if i+nums[i] > farthest {\n            farthest = i + nums[i]\n        }\n\n        // Reached the end of the current BFS level\n        if i == currentEnd {\n            jumps++\n            currentEnd = farthest\n\n            // Early exit if we can already reach the end\n            if currentEnd >= n-1 {\n                break\n            }\n        }\n    }\n\n    return jumps\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "update_farthest": [
        8,
        9,
        10
      ],
      "keep_farthest": [
        8,
        9
      ],
      "make_jump": [
        14,
        15,
        16
      ],
      "early_exit": [
        19,
        20
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "reached_boundary": [
        14
      ],
      "check_end": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var jump = function(nums) {\n    var n = nums.length;\n    var jumps = 0;\n    var currentEnd = 0;\n    var farthest = 0;\n\n    // Process indices 0 to n-2; we don't need to jump from the last index\n    for (var i = 0; i < n - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n\n        // Reached the end of the current BFS level\n        if (i === currentEnd) {\n            jumps++;\n            currentEnd = farthest;\n\n            // Early exit if we can already reach the end\n            if (currentEnd >= n - 1) {\n                break;\n            }\n        }\n    }\n\n    return jumps;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "update_farthest": [
        8,
        9
      ],
      "keep_farthest": [
        8,
        9
      ],
      "make_jump": [
        12,
        13,
        14
      ],
      "early_exit": [
        17,
        18
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "reached_boundary": [
        12
      ],
      "check_end": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function jump(nums: number[]): number {\n    const n = nums.length;\n    let jumps = 0;\n    let currentEnd = 0;\n    let farthest = 0;\n\n    // Process indices 0 to n-2; we don't need to jump from the last index\n    for (let i = 0; i < n - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n\n        // Reached the end of the current BFS level\n        if (i === currentEnd) {\n            jumps++;\n            currentEnd = farthest;\n\n            // Early exit if we can already reach the end\n            if (currentEnd >= n - 1) {\n                break;\n            }\n        }\n    }\n\n    return jumps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "update_farthest": [
        8,
        9
      ],
      "keep_farthest": [
        8,
        9
      ],
      "make_jump": [
        12,
        13,
        14
      ],
      "early_exit": [
        17,
        18
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "reached_boundary": [
        12
      ],
      "check_end": [
        17
      ]
    }
  }
};

const JumpGameIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        2,
        3,
        1,
        1,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "With zero",
    "value": {
      "nums": [
        2,
        3,
        0,
        1,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All ones",
    "value": {
      "nums": [
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single element",
    "value": {
      "nums": [
        0
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Large first jump",
    "value": {
      "nums": [
        5,
        1,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Increasing",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateJumpGameIiSteps(e: any): any[] {
  
let t=[...e.nums],n=t.length,a={};t.forEach((e,t)=>{a[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let l=new StepRecorder({},a);l.record("-","Start: Find minimum jumps to reach the last index");let r=Array(n).fill(1/0);r[0]=0;let s=e=>{l.update_visual(`dp_${e}`,{type:"arrayElement",value:r[e]===1/0?"∞":r[e],position:e})};for(let e=0;e<n;e++)s(e);l.add_new_variable("n",n),l.record("initialize","dp[0] = 0 and every other dp entry starts at ∞ (unreachable)");let o=()=>{l.delete_variable("j"),l.delete_variable("numVal"),l.delete_variable("reach"),l.delete_variable("dpJ"),l.delete_variable("cand")};for(let e=1;e<n;e++){l.add_conditional("outer_loop",!0),l.update_variable("i",e),l.update_variable("dpI",r[e]===1/0?"∞":r[e]),o(),l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.delete_visual("ptr_j"),l.record("target_start",`Compute dp[${e}]: check every earlier index that can jump to ${e}`);for(let n=0;n<e;n++){l.add_conditional("inner_loop",!0);let i=t[n],a=n+i,o=a>=e&&r[n]!==1/0;if(l.update_variable("j",n),l.update_variable("numVal",i),l.update_variable("reach",a),l.update_variable("dpJ",r[n]===1/0?"∞":r[n]),l.update_visual("ptr_j",{type:"pointer",position:n,label:"j"}),!o){l.add_conditional("can_jump",!1),l.delete_variable("cand"),l.record("no_reach",r[n]===1/0?`dp[${n}] is still ∞, so index ${n} cannot start a jump`:`${n} + ${i} = ${a} < ${e}. Index ${n} cannot reach ${e}.`);continue}l.add_conditional("can_jump",!0);let d=r[n]+1;l.update_variable("cand",d),d<r[e]?(r[e]=d,l.update_variable("dpI",r[e]),s(e),l.record("relax",`${n} + ${i} = ${a} ≥ ${e}. dp[${e}] = dp[${n}] + 1 = ${d}.`)):l.record("keep_dp",`${n} + ${i} = ${a} ≥ ${e}, but dp[${n}] + 1 = ${d} is no better than dp[${e}] = ${r[e]}`)}l.add_conditional("inner_loop",!1)}l.add_conditional("outer_loop",!1),l.delete_visual("ptr_i"),l.delete_visual("ptr_j"),o(),l.delete_variable("i");let d=r[n-1];return l.update_variable("answer",d===1/0?"∞":d),l.record("complete",d===1/0?`dp[${n-1}] is still ∞. The last index is unreachable.`:`dp[${n-1}] = ${d}. Reached the last index in ${d} jumps.`),l.getSteps()
}

export function JumpGameIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: JumpGameIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateJumpGameIiSteps(e) as any[];
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
      title="Jump Game II"
      slug="jump-game-ii"
      approaches={approaches}
      presets={JumpGameIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Gas Station (gas-station)
// ==========================================

const GasStationTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:\n        n = len(gas)\n\n        for i in range(n):\n            tank = 0\n            valid = True\n\n            # Simulate a full trip starting from station i\n            for j in range(n):\n                station = (i + j) % n\n                tank += gas[station] - cost[station]\n\n                if tank < 0:\n                    valid = False\n                    break\n\n            if valid:\n                return i\n\n        return -1",
    "lineMap": {
      "-": [
        2
      ],
      "start_attempt": [
        5,
        6,
        7
      ],
      "visit_station": [
        10,
        11,
        12
      ],
      "fail_attempt": [
        15,
        16
      ],
      "attempt_ok": [
        18,
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        14
      ],
      "is_valid": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        int n = gas.length;\n\n        for (int i = 0; i < n; i++) {\n            int tank = 0;\n            boolean valid = true;\n\n            // Simulate a full trip starting from station i\n            for (int j = 0; j < n; j++) {\n                int station = (i + j) % n;\n                tank += gas[station] - cost[station];\n\n                if (tank < 0) {\n                    valid = false;\n                    break;\n                }\n            }\n\n            if (valid) return i;\n        }\n\n        return -1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "start_attempt": [
        5,
        6,
        7
      ],
      "visit_station": [
        10,
        11,
        12
      ],
      "fail_attempt": [
        15,
        16
      ],
      "attempt_ok": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        14
      ],
      "is_valid": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        int n = gas.size();\n\n        for (int i = 0; i < n; i++) {\n            int tank = 0;\n            bool valid = true;\n\n            // Simulate a full trip starting from station i\n            for (int j = 0; j < n; j++) {\n                int station = (i + j) % n;\n                tank += gas[station] - cost[station];\n\n                if (tank < 0) {\n                    valid = false;\n                    break;\n                }\n            }\n\n            if (valid) return i;\n        }\n\n        return -1;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "start_attempt": [
        6,
        7,
        8
      ],
      "visit_station": [
        11,
        12,
        13
      ],
      "fail_attempt": [
        16,
        17
      ],
      "attempt_ok": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        15
      ],
      "is_valid": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int CanCompleteCircuit(int[] gas, int[] cost) {\n        int n = gas.Length;\n\n        for (int i = 0; i < n; i++) {\n            int tank = 0;\n            bool valid = true;\n\n            // Simulate a full trip starting from station i\n            for (int j = 0; j < n; j++) {\n                int station = (i + j) % n;\n                tank += gas[station] - cost[station];\n\n                if (tank < 0) {\n                    valid = false;\n                    break;\n                }\n            }\n\n            if (valid) return i;\n        }\n\n        return -1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "start_attempt": [
        5,
        6,
        7
      ],
      "visit_station": [
        10,
        11,
        12
      ],
      "fail_attempt": [
        15,
        16
      ],
      "attempt_ok": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        14
      ],
      "is_valid": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canCompleteCircuit(gas []int, cost []int) int {\n    n := len(gas)\n\n    for i := 0; i < n; i++ {\n        tank := 0\n        valid := true\n\n        // Simulate a full trip starting from station i\n        for j := 0; j < n; j++ {\n            station := (i + j) % n\n            tank += gas[station] - cost[station]\n\n            if tank < 0 {\n                valid = false\n                break\n            }\n        }\n\n        if valid {\n            return i\n        }\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_attempt": [
        4,
        5,
        6
      ],
      "visit_station": [
        9,
        10,
        11
      ],
      "fail_attempt": [
        14,
        15
      ],
      "attempt_ok": [
        19,
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        13
      ],
      "is_valid": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var canCompleteCircuit = function(gas, cost) {\n    var n = gas.length;\n\n    for (var i = 0; i < n; i++) {\n        var tank = 0;\n        var valid = true;\n\n        // Simulate a full trip starting from station i\n        for (var j = 0; j < n; j++) {\n            var station = (i + j) % n;\n            tank += gas[station] - cost[station];\n\n            if (tank < 0) {\n                valid = false;\n                break;\n            }\n        }\n\n        if (valid) return i;\n    }\n\n    return -1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "start_attempt": [
        4,
        5,
        6
      ],
      "visit_station": [
        9,
        10,
        11
      ],
      "fail_attempt": [
        14,
        15
      ],
      "attempt_ok": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        13
      ],
      "is_valid": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canCompleteCircuit(gas: number[], cost: number[]): number {\n    const n = gas.length;\n\n    for (let i = 0; i < n; i++) {\n        let tank = 0;\n        let valid = true;\n\n        // Simulate a full trip starting from station i\n        for (let j = 0; j < n; j++) {\n            const station = (i + j) % n;\n            tank += gas[station] - cost[station];\n\n            if (tank < 0) {\n                valid = false;\n                break;\n            }\n        }\n\n        if (valid) return i;\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_attempt": [
        4,
        5,
        6
      ],
      "visit_station": [
        9,
        10,
        11
      ],
      "fail_attempt": [
        14,
        15
      ],
      "attempt_ok": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "tank_negative": [
        13
      ],
      "is_valid": [
        19
      ]
    }
  }
};

const GasStationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "gas": [
        1,
        2,
        3,
        4,
        5
      ],
      "cost": [
        3,
        4,
        5,
        1,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Reset mid-way",
    "value": {
      "gas": [
        4,
        1,
        1,
        4,
        3
      ],
      "cost": [
        2,
        4,
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Impossible",
    "value": {
      "gas": [
        2,
        3,
        4
      ],
      "cost": [
        3,
        4,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Start at 0",
    "value": {
      "gas": [
        3,
        1,
        1
      ],
      "cost": [
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single station",
    "value": {
      "gas": [
        5
      ],
      "cost": [
        4
      ]
    }
  }
];

function generateGasStationSteps(t: any): any[] {
  
let e=[...t.gas],a=[...t.cost],n=e.length,r={};e.forEach((t,e)=>{r[`gas_${e}`]={type:"arrayElement",value:t,position:e}}),a.forEach((t,e)=>{r[`cost_${e}`]={type:"arrayElement",value:t,position:e}});let l=new StepRecorder({},r);l.record("-","Start: Find a starting station to complete the circuit");let s=0,o=0,c=0;l.add_new_variable("total_tank",s),l.add_new_variable("current_tank",o),l.add_new_variable("start",c),l.add_new_visual("ptr_start",{type:"pointer",position:0,label:"start"}),l.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),l.record("initialize","Initialize total_tank = 0, current_tank = 0, start = 0");for(let t=0;t<n;t++){l.add_conditional("for_loop",!0);let i=e[t]-a[t],r=o;if(s+=i,o+=i,l.update_visual("ptr_i",{type:"pointer",position:t,label:"i"}),l.update_variable("i",t),l.update_variable("gasVal",e[t]),l.update_variable("costVal",a[t]),l.update_variable("net",i),l.update_variable("prevCurrent",r),l.update_variable("total_tank",s),l.update_variable("current_tank",o),l.record("update_tanks",`Station ${t}: net = ${e[t]} − ${a[t]} = ${i}. current_tank = ${o}, total_tank = ${s}`),o<0){l.add_conditional("tank_negative",!0);let e=c,a=o;c=t+1,o=0,l.update_variable("resetFrom",e),l.update_variable("negCurrent",a),l.update_variable("start",c),l.update_variable("current_tank",o),c<n?l.update_visual("ptr_start",{type:"pointer",position:c,label:"start"}):l.delete_visual("ptr_start"),l.record("reset_start",`current_tank went negative. Stations ${e}–${t} cannot start the circuit. Reset start = ${c}, current_tank = 0`),l.delete_variable("resetFrom"),l.delete_variable("negCurrent")}else l.add_conditional("tank_negative",!1)}return l.add_conditional("for_loop",!1),l.delete_visual("ptr_i"),s>=0?(l.add_conditional("return",!0),l.add_new_variable("verdict",!0),l.add_new_variable("returnValue",c),l.record("return",`total_tank = ${s} ≥ 0, so a solution exists. Start at station ${c}`)):(l.delete_visual("ptr_start"),l.add_conditional("return",!1),l.add_new_variable("verdict",!1),l.add_new_variable("returnValue",-1),l.record("return",`total_tank = ${s} < 0. The circuit can never be completed. Return -1`)),l.getSteps()
}

export function GasStationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GasStationTemplates,
      generateSteps: (t: any) => {
        const recorded = generateGasStationSteps(t) as any[];
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
      title="Gas Station"
      slug="gas-station"
      approaches={approaches}
      presets={GasStationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Assign Cookies (assign-cookies)
// ==========================================

const AssignCookiesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findContentChildren(self, g: list[int], s: list[int]) -> int:\n        g.sort()\n        s.sort()\n        child_index = 0\n        cookie_index = 0\n\n        # Walk through both arrays with two pointers\n        while child_index < len(g) and cookie_index < len(s):\n            if s[cookie_index] >= g[child_index]:\n                # This cookie satisfies the current child\n                child_index += 1\n            # Move to the next cookie regardless\n            cookie_index += 1\n        return child_index",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort": [
        3,
        4
      ],
      "init_pointers": [
        5,
        6
      ],
      "compare": [
        8,
        9
      ],
      "satisfy": [
        10,
        11,
        12,
        13,
        14
      ],
      "skip": [
        13,
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "check_satisfy": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        Arrays.sort(g);\n        Arrays.sort(s);\n        int childIndex = 0;\n        int cookieIndex = 0;\n\n        // Walk through both arrays with two pointers\n        while (childIndex < g.length && cookieIndex < s.length) {\n            if (s[cookieIndex] >= g[childIndex]) {\n                // This cookie satisfies the current child\n                childIndex++;\n            }\n            // Move to the next cookie regardless\n            cookieIndex++;\n        }\n        return childIndex;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort": [
        3,
        4
      ],
      "init_pointers": [
        5,
        6
      ],
      "compare": [
        8,
        9
      ],
      "satisfy": [
        10,
        11,
        12,
        14,
        15
      ],
      "skip": [
        14,
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "check_satisfy": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int findContentChildren(vector<int>& g, vector<int>& s) {\n        sort(g.begin(), g.end());\n        sort(s.begin(), s.end());\n        int childIndex = 0;\n        int cookieIndex = 0;\n\n        // Walk through both arrays with two pointers\n        while (childIndex < (int)g.size() && cookieIndex < (int)s.size()) {\n            if (s[cookieIndex] >= g[childIndex]) {\n                // This cookie satisfies the current child\n                childIndex++;\n            }\n            // Move to the next cookie regardless\n            cookieIndex++;\n        }\n        return childIndex;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "sort": [
        4,
        5
      ],
      "init_pointers": [
        6,
        7
      ],
      "compare": [
        9,
        10
      ],
      "satisfy": [
        11,
        12,
        13,
        15,
        16
      ],
      "skip": [
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "check_satisfy": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FindContentChildren(int[] g, int[] s) {\n        Array.Sort(g);\n        Array.Sort(s);\n        int childIndex = 0;\n        int cookieIndex = 0;\n\n        // Walk through both arrays with two pointers\n        while (childIndex < g.Length && cookieIndex < s.Length) {\n            if (s[cookieIndex] >= g[childIndex]) {\n                // This cookie satisfies the current child\n                childIndex++;\n            }\n            // Move to the next cookie regardless\n            cookieIndex++;\n        }\n        return childIndex;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort": [
        3,
        4
      ],
      "init_pointers": [
        5,
        6
      ],
      "compare": [
        8,
        9
      ],
      "satisfy": [
        10,
        11,
        12,
        14,
        15
      ],
      "skip": [
        14,
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "check_satisfy": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findContentChildren(g []int, s []int) int {\n    sort.Ints(g)\n    sort.Ints(s)\n    childIndex := 0\n    cookieIndex := 0\n\n    // Walk through both arrays with two pointers\n    for childIndex < len(g) && cookieIndex < len(s) {\n        if s[cookieIndex] >= g[childIndex] {\n            // This cookie satisfies the current child\n            childIndex++\n        }\n        // Move to the next cookie regardless\n        cookieIndex++\n    }\n    return childIndex\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "init_pointers": [
        4,
        5
      ],
      "compare": [
        7,
        8
      ],
      "satisfy": [
        9,
        10,
        11,
        13,
        14
      ],
      "skip": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "check_satisfy": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findContentChildren = function(g, s) {\n    g.sort((a, b) => a - b);\n    s.sort((a, b) => a - b);\n    var childIndex = 0;\n    var cookieIndex = 0;\n\n    // Walk through both arrays with two pointers\n    while (childIndex < g.length && cookieIndex < s.length) {\n        if (s[cookieIndex] >= g[childIndex]) {\n            // This cookie satisfies the current child\n            childIndex++;\n        }\n        // Move to the next cookie regardless\n        cookieIndex++;\n    }\n    return childIndex;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "init_pointers": [
        4,
        5
      ],
      "compare": [
        7,
        8
      ],
      "satisfy": [
        9,
        10,
        11,
        13,
        14
      ],
      "skip": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "check_satisfy": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findContentChildren(g: number[], s: number[]): number {\n    g.sort((a, b) => a - b);\n    s.sort((a, b) => a - b);\n    let childIndex = 0;\n    let cookieIndex = 0;\n\n    // Walk through both arrays with two pointers\n    while (childIndex < g.length && cookieIndex < s.length) {\n        if (s[cookieIndex] >= g[childIndex]) {\n            // This cookie satisfies the current child\n            childIndex++;\n        }\n        // Move to the next cookie regardless\n        cookieIndex++;\n    }\n    return childIndex;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "init_pointers": [
        4,
        5
      ],
      "compare": [
        7,
        8
      ],
      "satisfy": [
        9,
        10,
        11,
        13,
        14
      ],
      "skip": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "check_satisfy": [
        9
      ]
    }
  }
};

const AssignCookiesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "g": [
        1,
        2,
        3
      ],
      "s": [
        1,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "g": [
        1,
        2
      ],
      "s": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Unsorted input",
    "value": {
      "g": [
        3,
        1,
        2
      ],
      "s": [
        1,
        3,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All satisfied",
    "value": {
      "g": [
        1,
        2,
        3,
        4,
        5
      ],
      "s": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex5",
    "label": "None satisfied",
    "value": {
      "g": [
        5,
        10,
        15
      ],
      "s": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Mixed",
    "value": {
      "g": [
        2,
        3,
        4
      ],
      "s": [
        1,
        3,
        5
      ]
    }
  }
];

function generateAssignCookiesSteps(e: any): any[] {
  function o(e){return e.map((e,t)=>[e,t]).sort((e,t)=>e[0]-t[0]||e[1]-t[1]).map(([,e])=>e)}
let t=[...e.g],i=[...e.s],l=o(t),s=o(i),a=l.map(e=>t[e]),r=s.map(e=>i[e]),d={};a.forEach((e,t)=>{d[`g_${t}`]={type:"arrayElement",value:e,position:l[t]}}),r.forEach((e,t)=>{d[`s_${t}`]={type:"arrayElement",value:e,position:s[t]}});let c=new StepRecorder({},d);c.record("-","Start: Assign cookies to maximize the number of content children"),a.forEach((e,t)=>{c.update_visual(`g_${t}`,{type:"arrayElement",value:e,position:t})}),r.forEach((e,t)=>{c.update_visual(`s_${t}`,{type:"arrayElement",value:e,position:t})}),c.record("sort","Sort both g[] (greed factors) and s[] (cookie sizes) in ascending order");let h=0,p=0,u=0,f=[],g=[];for(c.add_new_variable("childIndex",h),c.add_new_variable("cookieIndex",p),c.add_new_variable("content",u),c.add_new_variable("matches",f),c.add_new_variable("skipped",g),c.add_new_variable("initTokens",[{t:"childIndex = "},{t:"0",c:"cyan"},{t:", cookieIndex = "},{t:"0",c:"amber"}]),a.length>0&&c.add_new_visual("ptr_childIndex",{type:"pointer",position:0,label:"childIndex"}),r.length>0&&c.add_new_visual("ptr_cookieIndex",{type:"pointer",position:0,label:"cookieIndex"}),c.record("init_pointers","Initialize childIndex = 0, cookieIndex = 0"),c.delete_variable("initTokens");h<a.length&&p<r.length;){c.add_conditional("while_loop",!0);let e=a[h],t=r[p];c.update_variable("gVal",e),c.update_variable("sVal",t),c.delete_variable("matchedG"),c.delete_variable("matchedS"),c.delete_variable("skippedNow"),c.record("compare",`Compare: s[${p}] = ${t} vs g[${h}] = ${e}`),t>=e?(c.add_conditional("check_satisfy",!0),f.push([h,p]),u++,c.update_variable("matchedG",h),c.update_variable("matchedS",p),c.update_variable("matches",f),c.update_variable("content",u),h++,p++,c.update_variable("childIndex",h),c.update_variable("cookieIndex",p),h<a.length?c.update_visual("ptr_childIndex",{type:"pointer",position:h,label:"childIndex"}):c.delete_visual("ptr_childIndex"),p<r.length?c.update_visual("ptr_cookieIndex",{type:"pointer",position:p,label:"cookieIndex"}):c.delete_visual("ptr_cookieIndex"),c.record("satisfy",`Cookie ${t} ≥ greed ${e}. Child satisfied! Move both pointers.`)):(c.add_conditional("check_satisfy",!1),g.push(p),c.update_variable("skippedNow",p),c.update_variable("skipped",g),p++,c.update_variable("cookieIndex",p),p<r.length?c.update_visual("ptr_cookieIndex",{type:"pointer",position:p,label:"cookieIndex"}):c.delete_visual("ptr_cookieIndex"),c.record("skip",`Cookie ${t} < greed ${e}. Cookie too small, skip it.`))}return c.add_conditional("while_loop",!1),c.delete_visual("ptr_childIndex"),c.delete_visual("ptr_cookieIndex"),c.delete_variable("matchedG"),c.delete_variable("matchedS"),c.delete_variable("skippedNow"),c.record("complete",`Done! ${u} ${1===u?"child is":"children are"} content.`),c.getSteps()
}

export function AssignCookiesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AssignCookiesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAssignCookiesSteps(e) as any[];
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
      title="Assign Cookies"
      slug="assign-cookies"
      approaches={approaches}
      presets={AssignCookiesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Boats to Save People (boats-to-save-people)
// ==========================================

const BoatsToSavePeopleTemplates = {
  "python": {
    "language": "python",
    "code": "def numRescueBoats(people, limit):\n    # Sort to enable greedy pairing of lightest with heaviest\n    people.sort()\n    light, heavy = 0, len(people) - 1\n    boats = 0\n\n    while light <= heavy:\n        # Check if lightest and heaviest can share a boat\n        if people[light] + people[heavy] <= limit:\n            light += 1\n        # Heaviest always gets on this boat\n        heavy -= 1\n        boats += 1\n    return boats",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13
      ],
      "heavy_only": [
        12,
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int numRescueBoats(int[] people, int limit) {\n    // Sort to enable greedy pairing of lightest with heaviest\n    Arrays.sort(people);\n    int light = 0, heavy = people.length - 1;\n    int boats = 0;\n\n    while (light <= heavy) {\n        // Check if lightest and heaviest can share a boat\n        if (people[light] + people[heavy] <= limit) {\n            light++;\n        }\n        // Heaviest always gets on this boat\n        heavy--;\n        boats++;\n    }\n    return boats;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int numRescueBoats(vector<int>& people, int limit) {\n    // Sort to enable greedy pairing of lightest with heaviest\n    sort(people.begin(), people.end());\n    int light = 0, heavy = people.size() - 1;\n    int boats = 0;\n\n    while (light <= heavy) {\n        // Check if lightest and heaviest can share a boat\n        if (people[light] + people[heavy] <= limit) {\n            light++;\n        }\n        // Heaviest always gets on this boat\n        heavy--;\n        boats++;\n    }\n    return boats;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int NumRescueBoats(int[] people, int limit) {\n    // Sort to enable greedy pairing of lightest with heaviest\n    Array.Sort(people);\n    int light = 0, heavy = people.Length - 1;\n    int boats = 0;\n\n    while (light <= heavy) {\n        // Check if lightest and heaviest can share a boat\n        if (people[light] + people[heavy] <= limit) {\n            light++;\n        }\n        // Heaviest always gets on this boat\n        heavy--;\n        boats++;\n    }\n    return boats;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numRescueBoats(people []int, limit int) int {\n    // Sort to enable greedy pairing of lightest with heaviest\n    sort.Ints(people)\n    light, heavy := 0, len(people)-1\n    boats := 0\n\n    for light <= heavy {\n        // Check if lightest and heaviest can share a boat\n        if people[light]+people[heavy] <= limit {\n            light++\n        }\n        // Heaviest always gets on this boat\n        heavy--\n        boats++\n    }\n    return boats\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numRescueBoats(people, limit) {\n    // Sort to enable greedy pairing of lightest with heaviest\n    people.sort(function(a, b) { return a - b; });\n    let light = 0, heavy = people.length - 1;\n    let boats = 0;\n\n    while (light <= heavy) {\n        // Check if lightest and heaviest can share a boat\n        if (people[light] + people[heavy] <= limit) {\n            light++;\n        }\n        // Heaviest always gets on this boat\n        heavy--;\n        boats++;\n    }\n    return boats;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numRescueBoats(people: number[], limit: number): number {\n    // Sort to enable greedy pairing of lightest with heaviest\n    people.sort((a, b) => a - b);\n    let light = 0, heavy = people.length - 1;\n    let boats = 0;\n\n    while (light <= heavy) {\n        // Check if lightest and heaviest can share a boat\n        if (people[light] + people[heavy] <= limit) {\n            light++;\n        }\n        // Heaviest always gets on this boat\n        heavy--;\n        boats++;\n    }\n    return boats;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_pair": [
        9
      ],
      "pair_both": [
        10,
        11,
        12,
        13,
        14
      ],
      "heavy_only": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "can_pair": [
        9
      ]
    }
  }
};

const BoatsToSavePeoplePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "people": [
        1,
        2,
        2,
        3
      ],
      "limit": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "people": [
        3,
        2,
        2,
        1
      ],
      "limit": 3
    }
  },
  {
    "id": "ex3",
    "label": "No pairs",
    "value": {
      "people": [
        3,
        5,
        3,
        4
      ],
      "limit": 5
    }
  }
];

function generateBoatsToSavePeopleSteps(e: any): any[] {
  
let t=[...e.people],i=e.limit,l=t.length,n=t.map((e,t)=>({v:e,idx:t})).sort((e,t)=>e.v-t.v||e.idx-t.idx),r=n.map(e=>e.v),o=[];n.forEach((e,t)=>{o[e.idx]=t});let s=[];{let e=0,t=l-1;for(;e<=t;)e===t?(s.push([r[t]]),e++):r[e]+r[t]<=i?(s.push([r[e],r[t]]),e++):s.push([r[t]]),t--}let h={};for(let e=0;e<l;e++)h[`bar_${e}`]={type:"arrayElement",value:t[e],position:e};let p=new StepRecorder({limit:i,totalPeople:l,allBoats:s},{...h}),d=e=>p.update_variable("exprParts",e);p.record("-",`Save ${l} people with boats that hold 2 and carry at most ${i}`);for(let e=0;e<l;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:o[e]});d([{t:`sorted: [${r.join(", ")}]`,c:"muted"}]),p.update_variable("sorted",!0),p.record("sort",`Sort people: [${r.join(", ")}]`);let c=0,u=l-1,g=0,f=[];p.add_new_visual("ptr_light",{type:"pointer",position:0,label:"light"}),p.add_new_visual("ptr_heavy",{type:"pointer",position:u,label:"heavy"}),p.add_new_variable("boatsList",[]);let m=(e,t)=>{p.update_variable("light",c),p.update_variable("heavy",u),p.update_variable("boats",g),p.update_visual("ptr_light",{type:"pointer",position:c,label:"light"}),p.update_visual("ptr_heavy",{type:"pointer",position:u,label:"heavy"}),p.record(e,t)};for(d([{t:"light = 0",c:"cyan"},{t:", ",c:"muted"},{t:`heavy = ${u}`,c:"yellow"},{t:"   pair the lightest with the heaviest",c:"muted"}]),m("init",`light = 0, heavy = ${u}, boats = 0`);c<=u;){let e=r[c]+r[u],t=e<=i,a=c===u;p.update_variable("sum",e),p.update_variable("alone",a),p.add_conditional("can_pair",t),a?(d([{t:"one person left: ",c:"muted"},{t:String(r[u]),c:"yellow"},{t:" boards alone",c:"muted"}]),m("check_pair",`Only people[${u}] = ${r[u]} is left`)):(d([{t:String(r[c]),c:"cyan"},{t:" + ",c:"muted"},{t:String(r[u]),c:"yellow"},{t:" = ",c:"muted"},{t:String(e),c:t?"green":"red"},{t:t?" ≤ ":" > ",c:"muted"},{t:String(i),c:"yellow"},{t:t?"  →  both fit":"  →  heavy boards alone",c:t?"green":"red"}]),m("check_pair",`people[${c}] + people[${u}] = ${e} ${t?"<=":">"} ${i}`)),g++,a?(f.push([r[u]]),p.update_variable("boatsList",f),p.update_variable("boardSlots",[u]),d([{t:`boat ${g}: `,c:"muted"},{t:String(r[u]),c:"green"}]),m(t?"pair_both":"heavy_only",`Boat ${g} carries ${r[u]} alone`),t&&c++):t?(f.push([r[c],r[u]]),p.update_variable("boatsList",f),p.update_variable("boardSlots",[c,u]),d([{t:`boat ${g}: `,c:"muted"},{t:`${r[c]} + ${r[u]}`,c:"green"},{t:"   both pointers move in",c:"muted"}]),m("pair_both",`Boat ${g} carries ${r[c]} and ${r[u]}`),c++):(f.push([r[u]]),p.update_variable("boatsList",f),p.update_variable("boardSlots",[u]),d([{t:`boat ${g}: `,c:"muted"},{t:String(r[u]),c:"green"},{t:"   the light person waits",c:"muted"}]),m("heavy_only",`Boat ${g} carries ${r[u]} alone`)),u--,p.delete_variable("boardSlots")}return p.update_visual("ptr_light",{type:"pointer",position:Math.min(c,l-.5),label:"light",state:"exiting"}),p.update_visual("ptr_heavy",{type:"pointer",position:Math.max(u,0),label:"heavy",state:"exiting"}),p.update_variable("light",c),p.update_variable("heavy",u),p.update_variable("boats",g),p.update_variable("done",!0),d([]),p.record("complete",`Return ${g}: all ${l} people rescued`),p.getSteps()
}

export function BoatsToSavePeopleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BoatsToSavePeopleTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBoatsToSavePeopleSteps(e) as any[];
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
      title="Boats to Save People"
      slug="boats-to-save-people"
      approaches={approaches}
      presets={BoatsToSavePeoplePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Candy (candy)
// ==========================================

const CandyTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def candy(self, ratings: list[int]) -> int:\n        n = len(ratings)\n        candies = [1] * n\n\n        # Left-to-right: enforce left-neighbor constraint\n        for i in range(1, n):\n            if ratings[i] > ratings[i - 1]:\n                candies[i] = candies[i - 1] + 1\n\n        # Right-to-left: enforce right-neighbor constraint\n        for i in range(n - 2, -1, -1):\n            if ratings[i] > ratings[i + 1]:\n                candies[i] = max(candies[i], candies[i + 1] + 1)\n\n        return sum(candies)",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4
      ],
      "left_pass_increment": [
        8,
        9
      ],
      "left_pass_no_change": [
        8
      ],
      "right_pass_increment": [
        13,
        14
      ],
      "right_pass_keep": [
        13,
        14
      ],
      "right_pass_no_change": [
        13
      ],
      "compute_total": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "left_loop": [
        7
      ],
      "left_compare": [
        8
      ],
      "right_loop": [
        12
      ],
      "right_compare": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int candy(int[] ratings) {\n        int n = ratings.length;\n        int[] candies = new int[n];\n        Arrays.fill(candies, 1);\n\n        // Left-to-right: enforce left-neighbor constraint\n        for (int i = 1; i < n; i++) {\n            if (ratings[i] > ratings[i - 1]) {\n                candies[i] = candies[i - 1] + 1;\n            }\n        }\n\n        // Right-to-left: enforce right-neighbor constraint\n        for (int i = n - 2; i >= 0; i--) {\n            if (ratings[i] > ratings[i + 1]) {\n                candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n            }\n        }\n\n        int total = 0;\n        for (int c : candies) {\n            total += c;\n        }\n        return total;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "left_pass_increment": [
        9,
        10
      ],
      "left_pass_no_change": [
        9
      ],
      "right_pass_increment": [
        16,
        17
      ],
      "right_pass_keep": [
        16,
        17
      ],
      "right_pass_no_change": [
        16
      ],
      "compute_total": [
        21,
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "left_loop": [
        8
      ],
      "left_compare": [
        9
      ],
      "right_loop": [
        15
      ],
      "right_compare": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int candy(vector<int>& ratings) {\n        int n = ratings.size();\n        vector<int> candies(n, 1);\n\n        // Left-to-right: enforce left-neighbor constraint\n        for (int i = 1; i < n; i++) {\n            if (ratings[i] > ratings[i - 1]) {\n                candies[i] = candies[i - 1] + 1;\n            }\n        }\n\n        // Right-to-left: enforce right-neighbor constraint\n        for (int i = n - 2; i >= 0; i--) {\n            if (ratings[i] > ratings[i + 1]) {\n                candies[i] = max(candies[i], candies[i + 1] + 1);\n            }\n        }\n\n        int total = 0;\n        for (int c : candies) {\n            total += c;\n        }\n        return total;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "initialize": [
        4,
        5
      ],
      "left_pass_increment": [
        9,
        10
      ],
      "left_pass_no_change": [
        9
      ],
      "right_pass_increment": [
        16,
        17
      ],
      "right_pass_keep": [
        16,
        17
      ],
      "right_pass_no_change": [
        16
      ],
      "compute_total": [
        21,
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "left_loop": [
        8
      ],
      "left_compare": [
        9
      ],
      "right_loop": [
        15
      ],
      "right_compare": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int Candy(int[] ratings) {\n        int n = ratings.Length;\n        int[] candies = new int[n];\n        Array.Fill(candies, 1);\n\n        // Left-to-right: enforce left-neighbor constraint\n        for (int i = 1; i < n; i++) {\n            if (ratings[i] > ratings[i - 1]) {\n                candies[i] = candies[i - 1] + 1;\n            }\n        }\n\n        // Right-to-left: enforce right-neighbor constraint\n        for (int i = n - 2; i >= 0; i--) {\n            if (ratings[i] > ratings[i + 1]) {\n                candies[i] = Math.Max(candies[i], candies[i + 1] + 1);\n            }\n        }\n\n        int total = 0;\n        foreach (int c in candies) {\n            total += c;\n        }\n        return total;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "left_pass_increment": [
        9,
        10
      ],
      "left_pass_no_change": [
        9
      ],
      "right_pass_increment": [
        16,
        17
      ],
      "right_pass_keep": [
        16,
        17
      ],
      "right_pass_no_change": [
        16
      ],
      "compute_total": [
        21,
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "left_loop": [
        8
      ],
      "left_compare": [
        9
      ],
      "right_loop": [
        15
      ],
      "right_compare": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func candy(ratings []int) int {\n    n := len(ratings)\n    candies := make([]int, n)\n    for i := range candies {\n        candies[i] = 1\n    }\n\n    // Left-to-right: enforce left-neighbor constraint\n    for i := 1; i < n; i++ {\n        if ratings[i] > ratings[i-1] {\n            candies[i] = candies[i-1] + 1\n        }\n    }\n\n    // Right-to-left: enforce right-neighbor constraint\n    for i := n - 2; i >= 0; i-- {\n        if ratings[i] > ratings[i+1] && candies[i] <= candies[i+1] {\n            candies[i] = candies[i+1] + 1\n        }\n    }\n\n    total := 0\n    for _, c := range candies {\n        total += c\n    }\n    return total\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "left_pass_increment": [
        10,
        11
      ],
      "left_pass_no_change": [
        10
      ],
      "right_pass_increment": [
        17,
        18
      ],
      "right_pass_keep": [
        17
      ],
      "right_pass_no_change": [
        17
      ],
      "compute_total": [
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "left_loop": [
        9
      ],
      "left_compare": [
        10
      ],
      "right_loop": [
        16
      ],
      "right_compare": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var candy = function(ratings) {\n    var n = ratings.length;\n    var candies = new Array(n).fill(1);\n\n    // Left-to-right: enforce left-neighbor constraint\n    for (var i = 1; i < n; i++) {\n        if (ratings[i] > ratings[i - 1]) {\n            candies[i] = candies[i - 1] + 1;\n        }\n    }\n\n    // Right-to-left: enforce right-neighbor constraint\n    for (var i = n - 2; i >= 0; i--) {\n        if (ratings[i] > ratings[i + 1]) {\n            candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n        }\n    }\n\n    var total = 0;\n    for (var j = 0; j < n; j++) {\n        total += candies[j];\n    }\n    return total;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "left_pass_increment": [
        7,
        8
      ],
      "left_pass_no_change": [
        7
      ],
      "right_pass_increment": [
        14,
        15
      ],
      "right_pass_keep": [
        14,
        15
      ],
      "right_pass_no_change": [
        14
      ],
      "compute_total": [
        19,
        20,
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "left_loop": [
        6
      ],
      "left_compare": [
        7
      ],
      "right_loop": [
        13
      ],
      "right_compare": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function candy(ratings: number[]): number {\n    const n = ratings.length;\n    const candies = new Array(n).fill(1);\n\n    // Left-to-right: enforce left-neighbor constraint\n    for (let i = 1; i < n; i++) {\n        if (ratings[i] > ratings[i - 1]) {\n            candies[i] = candies[i - 1] + 1;\n        }\n    }\n\n    // Right-to-left: enforce right-neighbor constraint\n    for (let i = n - 2; i >= 0; i--) {\n        if (ratings[i] > ratings[i + 1]) {\n            candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n        }\n    }\n\n    let total = 0;\n    for (const c of candies) {\n        total += c;\n    }\n    return total;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "left_pass_increment": [
        7,
        8
      ],
      "left_pass_no_change": [
        7
      ],
      "right_pass_increment": [
        14,
        15
      ],
      "right_pass_keep": [
        14,
        15
      ],
      "right_pass_no_change": [
        14
      ],
      "compute_total": [
        19,
        20,
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "left_loop": [
        6
      ],
      "left_compare": [
        7
      ],
      "right_loop": [
        13
      ],
      "right_compare": [
        14
      ]
    }
  }
};

const CandyPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "ratings": [
        1,
        0,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "ratings": [
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Mountain",
    "value": {
      "ratings": [
        1,
        3,
        4,
        5,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Descending",
    "value": {
      "ratings": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Ascending",
    "value": {
      "ratings": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateCandySteps(e: any): any[] {
  
let t=[...e.ratings],i=t.length,a=t.reduce((e,t,i)=>(e[`rating_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({},a);l.record("-","Start: Hand out the fewest candies while respecting the ratings");let r=Array(i).fill(1);l.add_new_variable("candies",r),l.record("initialize","Every child starts with 1 candy");for(let e=1;e<i;e++){l.add_conditional("left_loop",!0);let i=t[e]>t[e-1];l.add_conditional("left_compare",i),l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_variable("i",e),l.update_variable("pass","left"),l.update_variable("rI",t[e]),l.update_variable("rN",t[e-1]),l.update_variable("candN",r[e-1]),i?(r[e]=r[e-1]+1,l.update_variable("candies",r),l.update_variable("candI",r[e]),l.record("left_pass_increment",`ratings[${e}] = ${t[e]} > ${t[e-1]} → candies[${e}] = ${r[e-1]} + 1 = ${r[e]}`)):(l.update_variable("candI",r[e]),l.record("left_pass_no_change",`ratings[${e}] = ${t[e]} ≤ ${t[e-1]} → candies[${e}] stays ${r[e]}`))}l.add_conditional("left_loop",!1);for(let e=i-2;e>=0;e--){l.add_conditional("right_loop",!0);let i=t[e]>t[e+1],n=r[e+1]+1,a=i&&n>r[e];if(l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_variable("i",e),l.update_variable("pass","right"),l.update_variable("rI",t[e]),l.update_variable("rN",t[e+1]),l.update_variable("candN",r[e+1]),l.update_variable("prevCand",r[e]),a){l.add_conditional("right_compare",!0);let i=r[e];r[e]=n,l.update_variable("candies",r),l.update_variable("candI",r[e]),l.update_variable("reason","raised"),l.record("right_pass_increment",`ratings[${e}] = ${t[e]} > ${t[e+1]} → candies[${e}] = max(${i}, ${n}) = ${r[e]}`)}else i?(l.update_variable("candI",r[e]),l.update_variable("reason","already_enough"),l.record("right_pass_keep",`ratings[${e}] > ratings[${e+1}] but candies[${e}] = ${r[e]} ≥ ${n} → keep`)):(l.add_conditional("right_compare",!1),l.update_variable("candI",r[e]),l.update_variable("reason","not_higher"),l.record("right_pass_no_change",`ratings[${e}] = ${t[e]} ≤ ${t[e+1]} → candies[${e}] stays ${r[e]}`))}l.add_conditional("right_loop",!1),l.delete_visual("ptr_i");let s=r.reduce((e,t)=>e+t,0);return l.update_variable("total",s),l.record("compute_total",`Sum all candies: ${r.join(" + ")} = ${s}`),l.add_new_variable("result",s),l.record("complete",`Minimum candies = ${s}`),l.getSteps()
}

export function CandyProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CandyTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCandySteps(e) as any[];
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
      title="Candy"
      slug="candy"
      approaches={approaches}
      presets={CandyPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Jump Game (jump-game)
// ==========================================

const JumpGameTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def canJump(self, nums: list[int]) -> bool:\n        max_reach = 0\n\n        for i in range(len(nums)):\n            # If current index is beyond our reach, we're stuck\n            if i > max_reach:\n                return False\n\n            # Extend our reach from the current position\n            max_reach = max(max_reach, i + nums[i])\n\n            # Early exit if we can already reach the end\n            if max_reach >= len(nums) - 1:\n                return True\n\n        return True",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "check_i": [
        6,
        7
      ],
      "unreachable": [
        8
      ],
      "update_maxReach": [
        10,
        11
      ],
      "keep_maxReach": [
        10,
        11
      ],
      "reached_end": [
        13,
        14
      ],
      "complete_true": [
        15
      ],
      "complete_false": [
        8
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "check_unreachable": [
        7
      ],
      "check_reached_end": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n\n        for (int i = 0; i < nums.length; i++) {\n            // If current index is beyond our reach, we're stuck\n            if (i > maxReach) return false;\n\n            // Extend our reach from the current position\n            maxReach = Math.max(maxReach, i + nums[i]);\n\n            // Early exit if we can already reach the end\n            if (maxReach >= nums.length - 1) return true;\n        }\n\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "check_i": [
        6,
        7
      ],
      "unreachable": [
        7
      ],
      "update_maxReach": [
        9,
        10
      ],
      "keep_maxReach": [
        9,
        10
      ],
      "reached_end": [
        12,
        13
      ],
      "complete_true": [
        13
      ],
      "complete_false": [
        7
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "check_unreachable": [
        7
      ],
      "check_reached_end": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int maxReach = 0;\n\n        for (int i = 0; i < nums.size(); i++) {\n            // If current index is beyond our reach, we're stuck\n            if (i > maxReach) return false;\n\n            // Extend our reach from the current position\n            maxReach = max(maxReach, i + nums[i]);\n\n            // Early exit if we can already reach the end\n            if (maxReach >= (int)nums.size() - 1) return true;\n        }\n\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4
      ],
      "check_i": [
        7,
        8
      ],
      "unreachable": [
        8
      ],
      "update_maxReach": [
        10,
        11
      ],
      "keep_maxReach": [
        10,
        11
      ],
      "reached_end": [
        13,
        14
      ],
      "complete_true": [
        14
      ],
      "complete_false": [
        8
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "check_unreachable": [
        8
      ],
      "check_reached_end": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool CanJump(int[] nums) {\n        int maxReach = 0;\n\n        for (int i = 0; i < nums.Length; i++) {\n            // If current index is beyond our reach, we're stuck\n            if (i > maxReach) return false;\n\n            // Extend our reach from the current position\n            maxReach = Math.Max(maxReach, i + nums[i]);\n\n            // Early exit if we can already reach the end\n            if (maxReach >= nums.Length - 1) return true;\n        }\n\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "check_i": [
        6,
        7
      ],
      "unreachable": [
        7
      ],
      "update_maxReach": [
        9,
        10
      ],
      "keep_maxReach": [
        9,
        10
      ],
      "reached_end": [
        12,
        13
      ],
      "complete_true": [
        13
      ],
      "complete_false": [
        7
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "check_unreachable": [
        7
      ],
      "check_reached_end": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canJump(nums []int) bool {\n    maxReach := 0\n\n    for i := 0; i < len(nums); i++ {\n        // If current index is beyond our reach, we're stuck\n        if i > maxReach {\n            return false\n        }\n\n        // Extend our reach from the current position\n        if i+nums[i] > maxReach {\n            maxReach = i + nums[i]\n        }\n\n        // Early exit if we can already reach the end\n        if maxReach >= len(nums)-1 {\n            return true\n        }\n    }\n\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "check_i": [
        5,
        6
      ],
      "unreachable": [
        7
      ],
      "update_maxReach": [
        10,
        11,
        12,
        13
      ],
      "keep_maxReach": [
        10,
        11,
        12,
        13
      ],
      "reached_end": [
        15,
        16
      ],
      "complete_true": [
        17
      ],
      "complete_false": [
        7
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "check_unreachable": [
        6
      ],
      "check_reached_end": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var canJump = function(nums) {\n    var maxReach = 0;\n\n    for (var i = 0; i < nums.length; i++) {\n        // If current index is beyond our reach, we're stuck\n        if (i > maxReach) return false;\n\n        // Extend our reach from the current position\n        maxReach = Math.max(maxReach, i + nums[i]);\n\n        // Early exit if we can already reach the end\n        if (maxReach >= nums.length - 1) return true;\n    }\n\n    return true;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "check_i": [
        5,
        6
      ],
      "unreachable": [
        6
      ],
      "update_maxReach": [
        8,
        9
      ],
      "keep_maxReach": [
        8,
        9
      ],
      "reached_end": [
        11,
        12
      ],
      "complete_true": [
        12
      ],
      "complete_false": [
        6
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "check_unreachable": [
        6
      ],
      "check_reached_end": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canJump(nums: number[]): boolean {\n    let maxReach = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        // If current index is beyond our reach, we're stuck\n        if (i > maxReach) return false;\n\n        // Extend our reach from the current position\n        maxReach = Math.max(maxReach, i + nums[i]);\n\n        // Early exit if we can already reach the end\n        if (maxReach >= nums.length - 1) return true;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "check_i": [
        5,
        6
      ],
      "unreachable": [
        6
      ],
      "update_maxReach": [
        8,
        9
      ],
      "keep_maxReach": [
        8,
        9
      ],
      "reached_end": [
        11,
        12
      ],
      "complete_true": [
        12
      ],
      "complete_false": [
        6
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        4
      ],
      "check_unreachable": [
        6
      ],
      "check_reached_end": [
        12
      ]
    }
  }
};

const JumpGamePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Can reach (true)",
    "value": {
      "nums": [
        2,
        3,
        1,
        1,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Can't reach (false)",
    "value": {
      "nums": [
        3,
        2,
        1,
        0,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single element",
    "value": {
      "nums": [
        0
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Just enough",
    "value": {
      "nums": [
        2,
        0,
        0
      ]
    }
  },
  {
    "id": "ex5",
    "label": "All ones",
    "value": {
      "nums": [
        1,
        1,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Large first jump",
    "value": {
      "nums": [
        5,
        0,
        0,
        0,
        0
      ]
    }
  }
];

function generateJumpGameSteps(e: any): any[] {
  
let a=[...e.nums],t=a.length,i=a.reduce((e,a,t)=>(e[`elem_${t}`]={type:"arrayElement",value:a,position:t},e),{}),l=new StepRecorder({},{...i});l.update_variable("mode","backward"),l.record("-","Start: walk backwards and drag the goal post left whenever an index can reach it.");let r=t-1;l.update_variable("goal",r),l.update_variable("n",t),l.add_new_visual("ptr_goal",{type:"pointer",position:r,label:"goal"}),l.record("init_goal",`The goal starts at the last index, ${r}. Anything that reaches it wins.`);for(let e=t-2;e>=0;e--){let t=e+a[e],n=t>=r;l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_variable("i",e),l.update_variable("numVal",a[e]),l.update_variable("cand",t),l.add_conditional("reaches_goal",n),l.record("probe",n?`${e} + ${a[e]} = ${t} >= goal ${r}, so index ${e} can reach the goal.`:`${e} + ${a[e]} = ${t} < goal ${r}, so index ${e} falls short. Leave the goal where it is.`),n&&(r=e,l.update_visual("ptr_goal",{type:"pointer",position:r,label:"goal"}),l.update_variable("goal",r),l.record("move_goal",`Move the goal back to ${r}. Reaching ${r} is now enough to finish.`))}let o=0===r;return l.delete_visual("ptr_i"),l.update_variable("verdict",o),l.add_conditional("goal_at_zero",o),l.record("result",o?"The goal walked all the way back to index 0, so the start reaches the end.":`The goal stalled at index ${r}, which index 0 cannot reach.`),l.delete_visual("ptr_goal"),l.record(o?"complete_true":"complete_false",o?"Can reach the last index. Return true.":"Cannot reach the last index. Return false."),l.getSteps()
}

export function JumpGameProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: JumpGameTemplates,
      generateSteps: (e: any) => {
        const recorded = generateJumpGameSteps(e) as any[];
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
      title="Jump Game"
      slug="jump-game"
      approaches={approaches}
      presets={JumpGamePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Jump Game VII (jump-game-vii)
// ==========================================

const JumpGameViiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def canReach(self, s: str, minJump: int, maxJump: int) -> bool:\n        n = len(s)\n        if s[n - 1] != '0':\n            return False\n\n        visited = [False] * n\n        visited[0] = True\n        queue = deque([0])\n\n        while queue:\n            i = queue.popleft()\n            for j in range(i + minJump, min(i + maxJump, n - 1) + 1):\n                if not visited[j] and s[j] == '0':\n                    if j == n - 1:\n                        return True\n                    visited[j] = True\n                    queue.append(j)\n\n        return False",
    "lineMap": {
      "-": [
        2
      ],
      "early_exit": [
        4,
        5
      ],
      "init": [
        7,
        8,
        9
      ],
      "pop_node": [
        11,
        12
      ],
      "mark_visited": [
        17,
        18
      ],
      "scan_j": [
        13,
        14
      ],
      "reach_end": [
        15,
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        4
      ],
      "can_visit": [
        14
      ],
      "is_end": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean canReach(String s, int minJump, int maxJump) {\n        int n = s.length();\n        if (s.charAt(n - 1) != '0') return false;\n\n        boolean[] visited = new boolean[n];\n        visited[0] = true;\n        Queue<Integer> queue = new LinkedList<>();\n        queue.offer(0);\n\n        while (!queue.isEmpty()) {\n            int i = queue.poll();\n            for (int j = i + minJump; j <= Math.min(i + maxJump, n - 1); j++) {\n                if (!visited[j] && s.charAt(j) == '0') {\n                    if (j == n - 1) return true;\n                    visited[j] = true;\n                    queue.offer(j);\n                }\n            }\n        }\n\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "early_exit": [
        4
      ],
      "init": [
        6,
        7,
        9
      ],
      "pop_node": [
        11,
        12
      ],
      "mark_visited": [
        16,
        17
      ],
      "scan_j": [
        13,
        14
      ],
      "reach_end": [
        15
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        4
      ],
      "can_visit": [
        14
      ],
      "is_end": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool canReach(string s, int minJump, int maxJump) {\n        int n = s.size();\n        if (s[n - 1] != '0') return false;\n\n        vector<bool> visited(n, false);\n        visited[0] = true;\n        queue<int> q;\n        q.push(0);\n\n        while (!q.empty()) {\n            int i = q.front();\n            q.pop();\n            for (int j = i + minJump; j <= min(i + maxJump, n - 1); j++) {\n                if (!visited[j] && s[j] == '0') {\n                    if (j == n - 1) return true;\n                    visited[j] = true;\n                    q.push(j);\n                }\n            }\n        }\n\n        return false;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "early_exit": [
        5
      ],
      "init": [
        7,
        8,
        10
      ],
      "pop_node": [
        12,
        13,
        14
      ],
      "mark_visited": [
        18,
        19
      ],
      "scan_j": [
        15,
        16
      ],
      "reach_end": [
        17
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        5
      ],
      "can_visit": [
        16
      ],
      "is_end": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool CanReach(string s, int minJump, int maxJump) {\n        int n = s.Length;\n        if (s[n - 1] != '0') return false;\n\n        bool[] visited = new bool[n];\n        visited[0] = true;\n        Queue<int> queue = new Queue<int>();\n        queue.Enqueue(0);\n\n        while (queue.Count > 0) {\n            int i = queue.Dequeue();\n            for (int j = i + minJump; j <= Math.Min(i + maxJump, n - 1); j++) {\n                if (!visited[j] && s[j] == '0') {\n                    if (j == n - 1) return true;\n                    visited[j] = true;\n                    queue.Enqueue(j);\n                }\n            }\n        }\n\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "early_exit": [
        4
      ],
      "init": [
        6,
        7,
        9
      ],
      "pop_node": [
        11,
        12
      ],
      "mark_visited": [
        16,
        17
      ],
      "scan_j": [
        13,
        14
      ],
      "reach_end": [
        15
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        4
      ],
      "can_visit": [
        14
      ],
      "is_end": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canReach(s string, minJump int, maxJump int) bool {\n    n := len(s)\n    if s[n-1] != '0' {\n        return false\n    }\n\n    visited := make([]bool, n)\n    visited[0] = true\n    queue := []int{0}\n\n    for len(queue) > 0 {\n        i := queue[0]\n        queue = queue[1:]\n        end := i + maxJump\n        if end > n-1 {\n            end = n - 1\n        }\n        for j := i + minJump; j <= end; j++ {\n            if !visited[j] && s[j] == '0' {\n                if j == n-1 {\n                    return true\n                }\n                visited[j] = true\n                queue = append(queue, j)\n            }\n        }\n    }\n\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_exit": [
        3,
        4
      ],
      "init": [
        7,
        8,
        9
      ],
      "pop_node": [
        11,
        12,
        13,
        14,
        16
      ],
      "mark_visited": [
        23,
        24
      ],
      "scan_j": [
        18,
        19
      ],
      "reach_end": [
        20,
        21
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        3
      ],
      "can_visit": [
        19
      ],
      "is_end": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var canReach = function(s, minJump, maxJump) {\n    const n = s.length;\n    if (s[n - 1] !== '0') return false;\n\n    const visited = new Array(n).fill(false);\n    visited[0] = true;\n    const queue = [0];\n    let front = 0;\n\n    while (front < queue.length) {\n        const i = queue[front++];\n        for (let j = i + minJump; j <= Math.min(i + maxJump, n - 1); j++) {\n            if (!visited[j] && s[j] === '0') {\n                if (j === n - 1) return true;\n                visited[j] = true;\n                queue.push(j);\n            }\n        }\n    }\n\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "early_exit": [
        3
      ],
      "init": [
        5,
        6,
        7,
        8
      ],
      "pop_node": [
        10,
        11
      ],
      "mark_visited": [
        15,
        16
      ],
      "scan_j": [
        12,
        13
      ],
      "reach_end": [
        14
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        3
      ],
      "can_visit": [
        13
      ],
      "is_end": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canReach(s: string, minJump: number, maxJump: number): boolean {\n    const n = s.length;\n    if (s[n - 1] !== '0') return false;\n\n    const visited: boolean[] = new Array(n).fill(false);\n    visited[0] = true;\n    const queue: number[] = [0];\n    let front = 0;\n\n    while (front < queue.length) {\n        const i = queue[front++];\n        for (let j = i + minJump; j <= Math.min(i + maxJump, n - 1); j++) {\n            if (!visited[j] && s[j] === '0') {\n                if (j === n - 1) return true;\n                visited[j] = true;\n                queue.push(j);\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_exit": [
        3
      ],
      "init": [
        5,
        6,
        7,
        8
      ],
      "pop_node": [
        10,
        11
      ],
      "mark_visited": [
        15,
        16
      ],
      "scan_j": [
        12,
        13
      ],
      "reach_end": [
        14
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "last_blocked": [
        3
      ],
      "can_visit": [
        13
      ],
      "is_end": [
        14
      ]
    }
  }
};

const JumpGameViiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "011010",
      "minJump": 2,
      "maxJump": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "01101110",
      "minJump": 2,
      "maxJump": 3
    }
  },
  {
    "id": "ex3",
    "label": "Min case",
    "value": {
      "s": "01",
      "minJump": 1,
      "maxJump": 1
    }
  },
  {
    "id": "ex4",
    "label": "All zeros",
    "value": {
      "s": "0000",
      "minJump": 1,
      "maxJump": 3
    }
  },
  {
    "id": "ex5",
    "label": "Long block",
    "value": {
      "s": "01111110",
      "minJump": 2,
      "maxJump": 6
    }
  }
];

function generateJumpGameViiSteps(e: any): any[] {
  
let t=e.s,a=e.minJump,n=e.maxJump,r=t.length,s={};for(let e=0;e<r;e++)s[`char_${e}`]={type:"arrayElement",value:t[e],position:e,state:"1"===t[e]?"inactive":void 0};for(let e=0;e<r;e++)s[`dp_${e}`]={type:"stateElement",value:"F",index:e,state:"1"===t[e]?"inactive":void 0};let l=new StepRecorder({},s);if(l.record("-","Start: Determine if we can reach index n-1 from index 0"),"0"!==t[r-1])return l.add_new_visual("meta_result",{type:"metadata",value:"false (last char is 1)"}),l.add_conditional("last_blocked",!0),l.record("early_exit","Last character is 1, cannot reach end. Return false."),l.getSteps();l.add_conditional("last_blocked",!1);let o=Array(r).fill(!1);o[0]=!0,l.update_visual("dp_0",{type:"stateElement",value:"T",index:0,state:"active"}),l.update_visual("char_0",{type:"arrayElement",value:t[0],position:0,state:"active"}),l.add_new_visual("meta_pre",{type:"metadata",value:"pre = 0"}),l.record("init_dp","Set dp[0] = true, pre = 0");let u=0;for(let e=1;e<r;e++){if(l.update_visual("ptr_j",{type:"pointer",position:e,label:"j"}),"1"!==t[e]&&l.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"}),l.add_conditional("for_loop",!0),l.record("loop_j",`j = ${e}, examining position ${e}`),e>1&&"1"!==t[e-1]&&!o[e-1]&&l.update_visual(`char_${e-1}`,{type:"arrayElement",value:t[e-1],position:e-1,state:void 0}),e>=a){l.add_conditional("check_min",!0);let t=e-a,i=+!!o[t];u+=i,l.update_visual("meta_pre",{type:"metadata",value:`pre = ${u}`});let r=Math.max(0,e-n),s=e-a;l.update_visual("range_window",{type:"range",start:r,end:s,label:"window"}),l.record("add_pre",`j(${e}) >= minJump(${a}): pre += dp[${t}](${i}) → pre = ${u}`)}else l.add_conditional("check_min",!1),l.record("skip_add",`j(${e}) < minJump(${a}), skip adding to pre`);if(e>n){l.add_conditional("check_max",!0);let t=e-n-1,i=+!!o[t];u-=i,l.update_visual("meta_pre",{type:"metadata",value:`pre = ${u}`});let r=e-n,s=e-a;l.update_visual("range_window",{type:"range",start:r,end:s,label:"window"}),l.record("sub_pre",`j(${e}) > maxJump(${n}): pre -= dp[${t}](${i}) → pre = ${u}`)}else l.add_conditional("check_max",!1);u>0&&"0"===t[e]?(l.add_conditional("check_dp",!0),o[e]=!0,l.update_visual(`dp_${e}`,{type:"stateElement",value:"T",index:e,state:"active"}),l.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),l.record("set_dp_true",`pre(${u}) > 0 and s[${e}] = '0' → dp[${e}] = true (reachable!)`)):(l.add_conditional("check_dp",!1),"1"===t[e]?l.record("skip_blocked",`s[${e}] = '1' → blocked, dp[${e}] stays false`):l.record("skip_unreachable",`pre = ${u}, no reachable source → dp[${e}] stays false`))}l.add_conditional("for_loop",!1),l.delete_visual("ptr_j"),l.delete_visual("range_window");let d=o[r-1];return l.update_visual("meta_pre",{type:"metadata",value:`Result: ${d}`}),d&&l.update_visual(`char_${r-1}`,{type:"arrayElement",value:t[r-1],position:r-1,state:"active"}),l.record("complete",`dp[${r-1}] = ${d}. ${d?"Can reach the end!":"Cannot reach the end."}`),l.getSteps()
}

export function JumpGameViiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: JumpGameViiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateJumpGameViiSteps(e) as any[];
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
      title="Jump Game VII"
      slug="jump-game-vii"
      approaches={approaches}
      presets={JumpGameViiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Happy String (longest-happy-string)
// ==========================================

const LongestHappyStringTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def longestDiverseString(self, a: int, b: int, c: int) -> str:\n        result = []\n        # Max-heap (negate counts since heapq is a min-heap)\n        heap = []\n        if a > 0: heapq.heappush(heap, (-a, 'a'))\n        if b > 0: heapq.heappush(heap, (-b, 'b'))\n        if c > 0: heapq.heappush(heap, (-c, 'c'))\n\n        while heap:\n            neg_count, ch = heapq.heappop(heap)\n            count = -neg_count\n\n            # If top character would create three in a row, use second\n            if len(result) >= 2 and result[-1] == ch and result[-2] == ch:\n                if not heap:\n                    break  # No alternative character\n                neg_count2, ch2 = heapq.heappop(heap)\n                result.append(ch2)\n                if neg_count2 + 1 < 0:  # Still has remaining count\n                    heapq.heappush(heap, (neg_count2 + 1, ch2))\n                heapq.heappush(heap, (neg_count, ch))  # Push top back\n            else:\n                result.append(ch)\n                if count - 1 > 0:\n                    heapq.heappush(heap, (-(count - 1), ch))\n\n        return \"\".join(result)",
    "lineMap": {
      "init": [
        3
      ],
      "build_heap": [
        5,
        6,
        7,
        8
      ],
      "loop": [
        10
      ],
      "pop_top": [
        11,
        12
      ],
      "check_consecutive": [
        15
      ],
      "no_alternative": [
        16,
        17
      ],
      "use_second": [
        18,
        19,
        20,
        21,
        22
      ],
      "append_char": [
        24,
        25,
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        15
      ],
      "no_alt": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String longestDiverseString(int a, int b, int c) {\n        StringBuilder result = new StringBuilder();\n        // Max-heap: [count, character]\n        PriorityQueue<int[]> heap = new PriorityQueue<>((x, y) -> y[0] - x[0]);\n\n        if (a > 0) heap.offer(new int[]{a, 'a'});\n        if (b > 0) heap.offer(new int[]{b, 'b'});\n        if (c > 0) heap.offer(new int[]{c, 'c'});\n\n        while (!heap.isEmpty()) {\n            int[] top = heap.poll();\n            int len = result.length();\n            char ch = (char) top[1];\n\n            // If top character would create three in a row, use second\n            if (len >= 2 && result.charAt(len - 1) == ch\n                         && result.charAt(len - 2) == ch) {\n                if (heap.isEmpty()) break; // No alternative character\n                int[] second = heap.poll();\n                result.append((char) second[1]);\n                second[0]--;\n                if (second[0] > 0) heap.offer(second);\n                heap.offer(top); // Push top back for later use\n            } else {\n                result.append(ch);\n                top[0]--;\n                if (top[0] > 0) heap.offer(top);\n            }\n        }\n        return result.toString();\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "build_heap": [
        5,
        7,
        8,
        9
      ],
      "loop": [
        11
      ],
      "pop_top": [
        12,
        13,
        14
      ],
      "check_consecutive": [
        17,
        18
      ],
      "no_alternative": [
        19
      ],
      "use_second": [
        20,
        21,
        22,
        23,
        24
      ],
      "append_char": [
        26,
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        17
      ],
      "no_alt": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string LongestDiverseString(int a, int b, int c) {\n        var result = new List<char>();\n        // Max-heap using PriorityQueue with negated priorities\n        var heap = new PriorityQueue<(int count, char ch), int>();\n\n        if (a > 0) heap.Enqueue((a, 'a'), -a);\n        if (b > 0) heap.Enqueue((b, 'b'), -b);\n        if (c > 0) heap.Enqueue((c, 'c'), -c);\n\n        while (heap.Count > 0) {\n            var top = heap.Dequeue();\n            int len = result.Count;\n\n            // If top character would create three in a row, use second\n            if (len >= 2 && result[len - 1] == top.ch && result[len - 2] == top.ch) {\n                if (heap.Count == 0) break;\n                var second = heap.Dequeue();\n                result.Add(second.ch);\n                if (second.count - 1 > 0)\n                    heap.Enqueue((second.count - 1, second.ch), -(second.count - 1));\n                heap.Enqueue(top, -top.count); // Push top back\n            } else {\n                result.Add(top.ch);\n                if (top.count - 1 > 0)\n                    heap.Enqueue((top.count - 1, top.ch), -(top.count - 1));\n            }\n        }\n        return new string(result.ToArray());\n    }\n}",
    "lineMap": {
      "init": [
        3
      ],
      "build_heap": [
        5,
        7,
        8,
        9
      ],
      "loop": [
        11
      ],
      "pop_top": [
        12,
        13
      ],
      "check_consecutive": [
        16
      ],
      "no_alternative": [
        17
      ],
      "use_second": [
        18,
        19,
        20,
        21,
        22
      ],
      "append_char": [
        24,
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        16
      ],
      "no_alt": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string longestDiverseString(int a, int b, int c) {\n        string result = \"\";\n        // Max-heap: {count, character}\n        priority_queue<pair<int, char>> heap;\n\n        if (a > 0) heap.push({a, 'a'});\n        if (b > 0) heap.push({b, 'b'});\n        if (c > 0) heap.push({c, 'c'});\n\n        while (!heap.empty()) {\n            auto [count, ch] = heap.top();\n            heap.pop();\n            int len = result.size();\n\n            // If top character would create three in a row, use second\n            if (len >= 2 && result[len - 1] == ch && result[len - 2] == ch) {\n                if (heap.empty()) break;\n                auto [count2, ch2] = heap.top();\n                heap.pop();\n                result += ch2;\n                if (count2 - 1 > 0) heap.push({count2 - 1, ch2});\n                heap.push({count, ch}); // Push top back\n            } else {\n                result += ch;\n                if (count - 1 > 0) heap.push({count - 1, ch});\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "init": [
        4
      ],
      "build_heap": [
        6,
        8,
        9,
        10
      ],
      "loop": [
        12
      ],
      "pop_top": [
        13,
        14,
        15
      ],
      "check_consecutive": [
        18
      ],
      "no_alternative": [
        19
      ],
      "use_second": [
        20,
        21,
        22,
        23,
        24
      ],
      "append_char": [
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        18
      ],
      "no_alt": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type pair struct {\n    count int\n    ch    byte\n}\n\ntype maxHeap []pair\n\nfunc (h maxHeap) Len() int            { return len(h) }\nfunc (h maxHeap) Less(i, j int) bool  { return h[i].count > h[j].count }\nfunc (h maxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }\nfunc (h *maxHeap) Push(x interface{}) { *h = append(*h, x.(pair)) }\nfunc (h *maxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}\n\nfunc longestDiverseString(a int, b int, c int) string {\n    result := []byte{}\n\n    h := &maxHeap{}\n    if a > 0 { heap.Push(h, pair{a, 'a'}) }\n    if b > 0 { heap.Push(h, pair{b, 'b'}) }\n    if c > 0 { heap.Push(h, pair{c, 'c'}) }\n\n    for h.Len() > 0 {\n        top := heap.Pop(h).(pair)\n        l := len(result)\n\n        // If the top character would create three in a row, use the second\n        if l >= 2 && result[l-1] == top.ch && result[l-2] == top.ch {\n            if h.Len() == 0 {\n                break\n            }\n            second := heap.Pop(h).(pair)\n            result = append(result, second.ch)\n            if second.count-1 > 0 {\n                heap.Push(h, pair{second.count - 1, second.ch})\n            }\n            heap.Push(h, top) // Push the top back for later use\n        } else {\n            result = append(result, top.ch)\n            if top.count-1 > 0 {\n                heap.Push(h, pair{top.count - 1, top.ch})\n            }\n        }\n    }\n    return string(result)\n}",
    "lineMap": {
      "init": [
        21
      ],
      "build_heap": [
        23,
        24,
        25,
        26
      ],
      "loop": [
        28
      ],
      "pop_top": [
        29,
        30
      ],
      "check_consecutive": [
        33
      ],
      "no_alternative": [
        34,
        35
      ],
      "use_second": [
        37,
        38,
        39,
        40,
        42
      ],
      "append_char": [
        44,
        45,
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        33
      ],
      "no_alt": [
        34
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestDiverseString = function(a, b, c) {\n    const result = [];\n    // Use sorted array as a max-heap for 3 elements\n    let pairs = [];\n    if (a > 0) pairs.push([a, 'a']);\n    if (b > 0) pairs.push([b, 'b']);\n    if (c > 0) pairs.push([c, 'c']);\n\n    while (pairs.length > 0) {\n        // Sort descending by count\n        pairs.sort((x, y) => y[0] - x[0]);\n\n        const len = result.length;\n        const ch = pairs[0][1];\n\n        // If the top character would create three in a row, use the second\n        if (len >= 2 && result[len - 1] === ch && result[len - 2] === ch) {\n            if (pairs.length < 2) break;\n            result.push(pairs[1][1]);\n            pairs[1][0]--;\n            if (pairs[1][0] === 0) pairs.splice(1, 1);\n        } else {\n            result.push(ch);\n            pairs[0][0]--;\n            if (pairs[0][0] === 0) pairs.splice(0, 1);\n        }\n    }\n    return result.join(\"\");\n};",
    "lineMap": {
      "init": [
        2
      ],
      "build_heap": [
        4,
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "pop_top": [
        11,
        13,
        14
      ],
      "check_consecutive": [
        17
      ],
      "no_alternative": [
        18
      ],
      "use_second": [
        19,
        20,
        21
      ],
      "append_char": [
        23,
        24,
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        17
      ],
      "no_alt": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestDiverseString(a: number, b: number, c: number): string {\n    const result: string[] = [];\n    // Use sorted array as a max-heap for 3 elements\n    let pairs: [number, string][] = [];\n    if (a > 0) pairs.push([a, 'a']);\n    if (b > 0) pairs.push([b, 'b']);\n    if (c > 0) pairs.push([c, 'c']);\n\n    while (pairs.length > 0) {\n        // Sort descending by count\n        pairs.sort((x, y) => y[0] - x[0]);\n\n        const len = result.length;\n        const ch = pairs[0][1];\n\n        // If the top character would create three in a row, use the second\n        if (len >= 2 && result[len - 1] === ch && result[len - 2] === ch) {\n            if (pairs.length < 2) break;\n            result.push(pairs[1][1]);\n            pairs[1][0]--;\n            if (pairs[1][0] === 0) pairs.splice(1, 1);\n        } else {\n            result.push(ch);\n            pairs[0][0]--;\n            if (pairs[0][0] === 0) pairs.splice(0, 1);\n        }\n    }\n    return result.join(\"\");\n}",
    "lineMap": {
      "init": [
        2
      ],
      "build_heap": [
        4,
        5,
        6,
        7
      ],
      "loop": [
        9
      ],
      "pop_top": [
        11,
        13,
        14
      ],
      "check_consecutive": [
        17
      ],
      "no_alternative": [
        18
      ],
      "use_second": [
        19,
        20,
        21
      ],
      "append_char": [
        23,
        24,
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_consecutive": [
        17
      ],
      "no_alt": [
        18
      ]
    }
  }
};

const LongestHappyStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "a": 1,
      "b": 1,
      "c": 7
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "a": 7,
      "b": 1,
      "c": 0
    }
  },
  {
    "id": "ex3",
    "label": "Balanced",
    "value": {
      "a": 2,
      "b": 2,
      "c": 1
    }
  }
];

function generateLongestHappyStringSteps(e: any): any[] {
  
let t=(0,i.createHappyScene)(e,"heap","count"),{recorder:n}=t,a="";t.setResult(a),n.record("init",`Start: a=${e.a}, b=${e.b}, c=${e.c}`);let r=new i.LetterMaxHeap;["a","b","c"].forEach(e=>{t.counts[e]>0&&r.push(t.counts[e],e.charCodeAt(0))}),n.record("build_heap","Build a max-heap of the remaining counts");let c=e=>{a+=e,t.setCount(e,t.counts[e]-1),t.setResult(a),n.update_variable("appendedChar",e),n.update_variable("appendedLeft",t.counts[e])};for(;r.size()>0;){n.record("loop",`${r.size()} letters still available`);let[e,t]=r.pop(),i=String.fromCharCode(t);n.update_variable("topChar",i),n.update_variable("topCount",e),n.update_variable("secondChar",""),n.record("pop_top",`Top of heap: '${i}' (${e} left)`);let s=a.length,l=s>=2&&a[s-1]===i&&a[s-2]===i;if(n.set_conditionals([{key:"is_consecutive",result:l}]),n.record("check_consecutive",l?`'${i}${i}' already at the end`:`'${i}' is safe to append`),l){let a=0===r.size();if(n.set_conditionals([{key:"no_alt",result:a}]),n.record("no_alternative",a?"No other letter left, stop here":"Another letter is available"),a)break;let[s,l]=r.pop(),o=String.fromCharCode(l);c(o),s-1>0&&r.push(s-1,l),r.push(e,t),n.update_variable("secondChar",o),n.record("use_second",`Append '${o}' instead and push '${i}' back`);continue}c(i),e-1>0&&r.push(e-1,t),n.record("append_char",`Append '${i}' (${e-1} left)`)}return t.setResult(a),n.update_variable("longest",a),n.record("complete",`Done: result = "${a}" (length ${a.length})`),t.steps()
}

export function LongestHappyStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestHappyStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestHappyStringSteps(e) as any[];
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
      title="Longest Happy String"
      slug="longest-happy-string"
      approaches={approaches}
      presets={LongestHappyStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Matrix Sum (maximum-matrix-sum)
// ==========================================

const MaximumMatrixSumTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxMatrixSum(self, matrix: list[list[int]]) -> int:\n        total_abs_sum = 0\n        min_abs_value = float('inf')\n        negative_count = 0\n\n        for row in matrix:\n            for value in row:\n                total_abs_sum += abs(value)\n                min_abs_value = min(min_abs_value, abs(value))\n                if value < 0:\n                    negative_count += 1\n\n        # If odd number of negatives, one element must stay negative\n        if negative_count % 2 != 0:\n            total_abs_sum -= 2 * min_abs_value\n\n        return total_abs_sum",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "scan_cell": [
        8,
        9,
        10
      ],
      "check_parity": [
        15
      ],
      "subtract_min": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_negative": [
        11
      ],
      "check_parity": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public long maxMatrixSum(int[][] matrix) {\n        long totalAbsSum = 0;\n        int minAbsValue = Integer.MAX_VALUE;\n        int negativeCount = 0;\n\n        for (int i = 0; i < matrix.length; i++) {\n            for (int j = 0; j < matrix[0].length; j++) {\n                int value = matrix[i][j];\n                totalAbsSum += Math.abs(value);\n                minAbsValue = Math.min(minAbsValue, Math.abs(value));\n                if (value < 0) {\n                    negativeCount++;\n                }\n            }\n        }\n\n        // If odd number of negatives, one element must stay negative\n        if (negativeCount % 2 != 0) {\n            totalAbsSum -= 2L * minAbsValue;\n        }\n\n        return totalAbsSum;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "scan_cell": [
        9,
        10,
        11
      ],
      "check_parity": [
        19
      ],
      "subtract_min": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_negative": [
        12
      ],
      "check_parity": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    long long maxMatrixSum(vector<vector<int>>& matrix) {\n        long long totalAbsSum = 0;\n        int minAbsValue = INT_MAX;\n        int negativeCount = 0;\n\n        for (int i = 0; i < matrix.size(); i++) {\n            for (int j = 0; j < matrix[0].size(); j++) {\n                int value = matrix[i][j];\n                totalAbsSum += abs(value);\n                minAbsValue = min(minAbsValue, abs(value));\n                if (value < 0) {\n                    negativeCount++;\n                }\n            }\n        }\n\n        // If odd number of negatives, one element must stay negative\n        if (negativeCount % 2 != 0) {\n            totalAbsSum -= 2LL * minAbsValue;\n        }\n\n        return totalAbsSum;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "scan_cell": [
        10,
        11,
        12
      ],
      "check_parity": [
        20
      ],
      "subtract_min": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_negative": [
        13
      ],
      "check_parity": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public long MaxMatrixSum(int[][] matrix) {\n        long totalAbsSum = 0;\n        int minAbsValue = int.MaxValue;\n        int negativeCount = 0;\n\n        for (int i = 0; i < matrix.Length; i++) {\n            for (int j = 0; j < matrix[0].Length; j++) {\n                int value = matrix[i][j];\n                totalAbsSum += Math.Abs(value);\n                minAbsValue = Math.Min(minAbsValue, Math.Abs(value));\n                if (value < 0) {\n                    negativeCount++;\n                }\n            }\n        }\n\n        // If odd number of negatives, one element must stay negative\n        if (negativeCount % 2 != 0) {\n            totalAbsSum -= 2L * minAbsValue;\n        }\n\n        return totalAbsSum;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "scan_cell": [
        9,
        10,
        11
      ],
      "check_parity": [
        19
      ],
      "subtract_min": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_negative": [
        12
      ],
      "check_parity": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxMatrixSum(matrix [][]int) int64 {\n    var totalAbsSum int64\n    minAbsValue := math.MaxInt32\n    negativeCount := 0\n\n    for i := 0; i < len(matrix); i++ {\n        for j := 0; j < len(matrix[0]); j++ {\n            value := matrix[i][j]\n            absValue := value\n            if absValue < 0 {\n                absValue = -absValue\n            }\n            totalAbsSum += int64(absValue)\n            if absValue < minAbsValue {\n                minAbsValue = absValue\n            }\n            if value < 0 {\n                negativeCount++\n            }\n        }\n    }\n\n    // If odd number of negatives, one element must stay negative\n    if negativeCount%2 != 0 {\n        totalAbsSum -= 2 * int64(minAbsValue)\n    }\n\n    return totalAbsSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_cell": [
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "check_parity": [
        24
      ],
      "subtract_min": [
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_negative": [
        17
      ],
      "check_parity": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxMatrixSum = function(matrix) {\n    var totalAbsSum = 0;\n    var minAbsValue = Infinity;\n    var negativeCount = 0;\n\n    for (var i = 0; i < matrix.length; i++) {\n        for (var j = 0; j < matrix[0].length; j++) {\n            var value = matrix[i][j];\n            totalAbsSum += Math.abs(value);\n            minAbsValue = Math.min(minAbsValue, Math.abs(value));\n            if (value < 0) {\n                negativeCount++;\n            }\n        }\n    }\n\n    // If odd number of negatives, one element must stay negative\n    if (negativeCount % 2 !== 0) {\n        totalAbsSum -= 2 * minAbsValue;\n    }\n\n    return totalAbsSum;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_cell": [
        8,
        9,
        10
      ],
      "check_parity": [
        18
      ],
      "subtract_min": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_negative": [
        11
      ],
      "check_parity": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxMatrixSum(matrix: number[][]): number {\n    let totalAbsSum = 0;\n    let minAbsValue = Infinity;\n    let negativeCount = 0;\n\n    for (let i = 0; i < matrix.length; i++) {\n        for (let j = 0; j < matrix[0].length; j++) {\n            const value = matrix[i][j];\n            totalAbsSum += Math.abs(value);\n            minAbsValue = Math.min(minAbsValue, Math.abs(value));\n            if (value < 0) {\n                negativeCount++;\n            }\n        }\n    }\n\n    // If odd number of negatives, one element must stay negative\n    if (negativeCount % 2 !== 0) {\n        totalAbsSum -= 2 * minAbsValue;\n    }\n\n    return totalAbsSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_cell": [
        8,
        9,
        10
      ],
      "check_parity": [
        18
      ],
      "subtract_min": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_negative": [
        11
      ],
      "check_parity": [
        18
      ]
    }
  }
};

const MaximumMatrixSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "2x2 Even neg",
    "value": {
      "matrix": [
        [
          1,
          -1
        ],
        [
          -1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "3x3 Mixed",
    "value": {
      "matrix": [
        [
          1,
          2,
          3
        ],
        [
          -1,
          -2,
          -3
        ],
        [
          1,
          2,
          3
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3x3 Odd neg",
    "value": {
      "matrix": [
        [
          -1,
          0,
          -1
        ],
        [
          -2,
          1,
          3
        ],
        [
          3,
          2,
          2
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "2x2 Mixed",
    "value": {
      "matrix": [
        [
          2,
          -3
        ],
        [
          -5,
          7
        ]
      ]
    }
  }
];

function generateMaximumMatrixSumSteps(e: any): any[] {
  
let t=e.matrix.map(e=>[...e]);if(0===t.length)return[];let a=t.length,n=t[0].length,l={};for(let e=0;e<a;e++)for(let a=0;a<n;a++)l[`cell_${e}_${a}`]={type:"matrixElement",value:t[e][a],row:e,col:a};let r=new StepRecorder({},l);r.record("-","Start: Flip adjacent pairs of signs to maximize the matrix sum");let s=0,o=1/0,u=0,m=-1,c=-1;r.add_new_variable("total",s),r.add_new_variable("neg",u),r.record("initialize","Initialize totalAbsSum = 0, minAbsValue = ∞, negativeCount = 0");for(let e=0;e<a;e++)for(let a=0;a<n;a++){let i=t[e][a],n=Math.abs(i),l=i<0,d=n<o;s+=n,d&&(o=n,m=e,c=a),l&&u++,r.add_conditional("is_negative",l),r.update_variable("i",e),r.update_variable("j",a),r.update_variable("value",i),r.update_variable("absVal",n),r.update_variable("total",s),r.update_variable("minAbs",o),r.update_variable("minR",m),r.update_variable("minC",c),r.update_variable("neg",u),r.update_variable("isNeg",l),r.update_variable("newMin",d),r.record("scan_cell",`Cell [${e}][${a}] = ${i}: total += |${i}| → ${s}`+(d?`, minAbs = ${o}`:"")+(l?`, negatives = ${u}`:""))}r.delete_variable("i"),r.delete_variable("j"),r.delete_variable("value"),r.delete_variable("absVal"),r.delete_variable("isNeg"),r.delete_variable("newMin");let d=u%2!=0;return r.add_conditional("check_parity",d),r.update_variable("odd",d),r.record("check_parity",d?`negativeCount = ${u} is odd → one minus sign must remain somewhere`:`negativeCount = ${u} is even → every negative cancels in pairs`),d&&(s-=2*o,r.update_variable("total",s),r.record("subtract_min",`Park the leftover minus on the smallest |value| = ${o}: total −= 2 \xd7 ${o} → ${s}`)),r.add_new_variable("result",s),r.record("complete",`Maximum matrix sum = ${s}`),r.getSteps()
}

export function MaximumMatrixSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumMatrixSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumMatrixSumSteps(e) as any[];
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
      title="Maximum Matrix Sum"
      slug="maximum-matrix-sum"
      approaches={approaches}
      presets={MaximumMatrixSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Deletions to Make Character Frequencies Unique (minimum-deletions-to-make-character-frequencies-unique)
// ==========================================

const MinimumDeletionsToMakeCharacterFrequenciesUniqueTemplates = {
  "python": {
    "language": "python",
    "code": "def minDeletions(s):\n    freq = [0] * 26\n    for c in s:\n        freq[ord(c) - ord('a')] += 1\n    freqs = [f for f in freq if f > 0]\n    result = float('inf')\n\n    def backtrack(idx, used, deletions):\n        nonlocal result\n        if deletions >= result:\n            return\n        if idx == len(freqs):\n            result = min(result, deletions)\n            return\n        original = freqs[idx]\n        for target in range(original, -1, -1):\n            if target == 0 or target not in used:\n                if target > 0:\n                    used.add(target)\n                backtrack(idx + 1, used, deletions + (original - target))\n                if target > 0:\n                    used.discard(target)\n\n    backtrack(0, set(), 0)\n    return result",
    "lineMap": {
      "-": [
        2
      ],
      "count_freq": [
        2
      ],
      "prune": [
        10
      ],
      "record_best": [
        13
      ],
      "enter": [
        15
      ],
      "taken": [
        17
      ],
      "accept": [
        19
      ],
      "undo": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "has_dup": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "int minDel;\n\npublic int minDeletions(String s) {\n    int[] freq = new int[26];\n    for (char c : s.toCharArray()) freq[c - 'a']++;\n    List<Integer> freqs = new ArrayList<>();\n    for (int f : freq) {\n        if (f > 0) freqs.add(f);\n    }\n    minDel = Integer.MAX_VALUE;\n    backtrack(freqs, 0, new HashSet<>(), 0);\n    return minDel;\n}\n\nprivate void backtrack(List<Integer> freqs, int idx, Set<Integer> used, int deletions) {\n    if (deletions >= minDel) return;\n    if (idx == freqs.size()) {\n        minDel = Math.min(minDel, deletions);\n        return;\n    }\n    int original = freqs.get(idx);\n    for (int target = original; target >= 0; target--) {\n        if (target == 0 || !used.contains(target)) {\n            if (target > 0) used.add(target);\n            backtrack(freqs, idx + 1, used, deletions + (original - target));\n            if (target > 0) used.remove(target);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "count_freq": [
        4
      ],
      "prune": [
        16
      ],
      "record_best": [
        18
      ],
      "enter": [
        21
      ],
      "taken": [
        23
      ],
      "accept": [
        24
      ],
      "undo": [
        26
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "has_dup": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int result;\n\nint minDeletions(string s) {\n    vector<int> freq(26, 0);\n    for (char c : s) freq[c - 'a']++;\n    vector<int> freqs;\n    for (int f : freq) {\n        if (f > 0) freqs.push_back(f);\n    }\n    result = INT_MAX;\n    unordered_set<int> used;\n    backtrack(freqs, 0, used, 0);\n    return result;\n}\n\nvoid backtrack(vector<int>& freqs, int idx, unordered_set<int>& used, int deletions) {\n    if (deletions >= result) return;\n    if (idx == (int)freqs.size()) {\n        result = min(result, deletions);\n        return;\n    }\n    int original = freqs[idx];\n    for (int target = original; target >= 0; target--) {\n        if (target == 0 || used.find(target) == used.end()) {\n            if (target > 0) used.insert(target);\n            backtrack(freqs, idx + 1, used, deletions + (original - target));\n            if (target > 0) used.erase(target);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "count_freq": [
        4
      ],
      "prune": [
        17
      ],
      "record_best": [
        19
      ],
      "enter": [
        22
      ],
      "taken": [
        24
      ],
      "accept": [
        25
      ],
      "undo": [
        27
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "has_dup": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "int result;\n\npublic int MinDeletions(string s) {\n    int[] freq = new int[26];\n    foreach (char c in s) freq[c - 'a']++;\n    List<int> freqs = new List<int>();\n    foreach (int f in freq) {\n        if (f > 0) freqs.Add(f);\n    }\n    result = int.MaxValue;\n    Backtrack(freqs, 0, new HashSet<int>(), 0);\n    return result;\n}\n\nprivate void Backtrack(List<int> freqs, int idx, HashSet<int> used, int deletions) {\n    if (deletions >= result) return;\n    if (idx == freqs.Count) {\n        result = Math.Min(result, deletions);\n        return;\n    }\n    int original = freqs[idx];\n    for (int target = original; target >= 0; target--) {\n        if (target == 0 || !used.Contains(target)) {\n            if (target > 0) used.Add(target);\n            Backtrack(freqs, idx + 1, used, deletions + (original - target));\n            if (target > 0) used.Remove(target);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "count_freq": [
        4
      ],
      "prune": [
        16
      ],
      "record_best": [
        18
      ],
      "enter": [
        21
      ],
      "taken": [
        23
      ],
      "accept": [
        24
      ],
      "undo": [
        26
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "has_dup": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minDeletions(s string) int {\n    freq := [26]int{}\n    for _, c := range s {\n        freq[c-'a']++\n    }\n    freqs := []int{}\n    for _, f := range freq {\n        if f > 0 {\n            freqs = append(freqs, f)\n        }\n    }\n    result := math.MaxInt32\n    used := map[int]bool{}\n    var backtrack func(idx, deletions int)\n    backtrack = func(idx, deletions int) {\n        if deletions >= result {\n            return\n        }\n        if idx == len(freqs) {\n            if deletions < result {\n                result = deletions\n            }\n            return\n        }\n        original := freqs[idx]\n        for target := original; target >= 0; target-- {\n            if target == 0 || !used[target] {\n                if target > 0 {\n                    used[target] = true\n                }\n                backtrack(idx+1, deletions+(original-target))\n                if target > 0 {\n                    delete(used, target)\n                }\n            }\n        }\n    }\n    backtrack(0, 0)\n    return result\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_freq": [
        2
      ],
      "prune": [
        16
      ],
      "record_best": [
        21
      ],
      "enter": [
        25
      ],
      "taken": [
        27
      ],
      "accept": [
        29
      ],
      "undo": [
        33
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "has_dup": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minDeletions(s) {\n    const freq = new Array(26).fill(0);\n    for (const c of s) freq[c.charCodeAt(0) - 97]++;\n    const freqs = freq.filter((f) => f > 0);\n    let result = Infinity;\n\n    function backtrack(idx, used, deletions) {\n        if (deletions >= result) return;\n        if (idx === freqs.length) {\n            result = Math.min(result, deletions);\n            return;\n        }\n        const original = freqs[idx];\n        for (let target = original; target >= 0; target--) {\n            if (target === 0 || !used.has(target)) {\n                if (target > 0) used.add(target);\n                backtrack(idx + 1, used, deletions + (original - target));\n                if (target > 0) used.delete(target);\n            }\n        }\n    }\n\n    backtrack(0, new Set(), 0);\n    return result;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_freq": [
        2
      ],
      "prune": [
        8
      ],
      "record_best": [
        10
      ],
      "enter": [
        13
      ],
      "taken": [
        15
      ],
      "accept": [
        16
      ],
      "undo": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_dup": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minDeletions(s: string): number {\n    const freq = new Array(26).fill(0);\n    for (const c of s) freq[c.charCodeAt(0) - 97]++;\n    const freqs: number[] = freq.filter((f: number) => f > 0);\n    let result = Infinity;\n\n    function backtrack(idx: number, used: Set<number>, deletions: number): void {\n        if (deletions >= result) return;\n        if (idx === freqs.length) {\n            result = Math.min(result, deletions);\n            return;\n        }\n        const original = freqs[idx];\n        for (let target = original; target >= 0; target--) {\n            if (target === 0 || !used.has(target)) {\n                if (target > 0) used.add(target);\n                backtrack(idx + 1, used, deletions + (original - target));\n                if (target > 0) used.delete(target);\n            }\n        }\n    }\n\n    backtrack(0, new Set(), 0);\n    return result;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_freq": [
        2
      ],
      "prune": [
        8
      ],
      "record_best": [
        10
      ],
      "enter": [
        13
      ],
      "taken": [
        15
      ],
      "accept": [
        16
      ],
      "undo": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "has_dup": [
        15
      ]
    }
  }
};

const MinimumDeletionsToMakeCharacterFrequenciesUniquePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "One Deletion",
    "value": {
      "s": "aab"
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Deletions",
    "value": {
      "s": "aaabbbcc"
    }
  },
  {
    "id": "ex3",
    "label": "Complex",
    "value": {
      "s": "ceabaacb"
    }
  }
];

function generateMinimumDeletionsToMakeCharacterFrequenciesUniqueSteps(e: any): any[] {
  
let{s:t}=e,r=new StepRecorder({},{}),n=Array(26).fill(0);for(let e=0;e<t.length;e++)n[t.charCodeAt(e)-97]++;let a=[];for(let e=0;e<26;e++)n[e]>0&&a.push({letter:String.fromCharCode(e+97),freq:n[e],orig:n[e],state:"pending"});let l=Math.max(1,...a.map(e=>e.orig)),s=new Set,o=0,c=()=>r.update_variable("bars",JSON.parse(JSON.stringify(a))),d=()=>r.update_variable("usedHeights",Array.from(s).sort((e,t)=>e-t)),f=()=>r.delete_variable("justShaved");r.update_variable("maxFreq",l),r.update_variable("deletions",0),r.update_variable("usedHeights",[]),c(),r.record("-","Delete letters until every frequency is different"),r.record("count_freq",`Count how many times each letter occurs in "${t}"`),r.record("init_set","Track which frequencies are already taken; deletions = 0");for(let e=0;e<a.length;e++){let t=a[e],i=t.freq;for(a.forEach((t,r)=>{"locked"!==t.state&&"deleted"!==t.state&&(t.state=r===e?"active":"pending")}),f(),r.update_variable("activeLetter",e),c(),d(),r.record("process_freq",`'${t.letter}' occurs ${i} time${1===i?"":"s"}`);i>0&&s.has(i);)r.add_conditional("check_used",!0),d(),r.record("check_used",`Frequency ${i} is already taken`),i--,o++,t.freq=i,t.state="shaving",r.update_variable("deletions",o),r.update_variable("justShaved",!0),c(),r.record("decrement",`Delete one '${t.letter}': frequency → ${i}, deletions = ${o}`),f();i>0?(r.add_conditional("check_used",!1),r.record("check_used",`Frequency ${i} is free`),s.add(i),t.freq=i,t.state="locked",c(),d(),r.record("add_to_set",`Keep '${t.letter}' at ${i}; mark ${i} as taken`)):(r.add_conditional("check_used",!1),r.record("check_used",`'${t.letter}' shaved down to 0`),t.freq=0,t.state="deleted",c(),r.record("skip_zero",`'${t.letter}' is fully deleted, nothing to mark`))}return f(),r.delete_variable("activeLetter"),r.update_variable("done",!0),r.update_variable("deletions",o),c(),d(),r.record("complete",`${o} deletion${1===o?"":"s"} makes every frequency unique`),r.getSteps()
}

export function MinimumDeletionsToMakeCharacterFrequenciesUniqueProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumDeletionsToMakeCharacterFrequenciesUniqueTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumDeletionsToMakeCharacterFrequenciesUniqueSteps(e) as any[];
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
      title="Minimum Deletions to Make Character Frequencies Unique"
      slug="minimum-deletions-to-make-character-frequencies-unique"
      approaches={approaches}
      presets={MinimumDeletionsToMakeCharacterFrequenciesUniquePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Partition Labels (partition-labels)
// ==========================================

const PartitionLabelsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def partitionLabels(self, s: str) -> list[int]:\n        # Precompute last occurrence of each character\n        last = {}\n        for i, ch in enumerate(s):\n            last[ch] = i\n\n        result = []\n        partition_start = 0\n        end = 0\n\n        for i, ch in enumerate(s):\n            # Extend partition end to the last occurrence of current char\n            end = max(end, last[ch])\n\n            # When i reaches end, all chars in this partition are contained\n            if i == end:\n                result.append(end - partition_start + 1)\n                partition_start = i + 1\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "build_last": [
        4,
        5,
        6
      ],
      "init": [
        8,
        9,
        10
      ],
      "scan_char": [
        12
      ],
      "extend_end": [
        14
      ],
      "partition_complete": [
        17,
        18,
        19
      ],
      "check_partition": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "is_partition_end": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> partitionLabels(String s) {\n        // Precompute last occurrence of each character\n        int[] last = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            last[s.charAt(i) - 'a'] = i;\n        }\n\n        List<Integer> result = new ArrayList<>();\n        int partitionStart = 0;\n        int end = 0;\n\n        for (int i = 0; i < s.length(); i++) {\n            // Extend partition end to the last occurrence of current char\n            end = Math.max(end, last[s.charAt(i) - 'a']);\n\n            // When i reaches end, all chars in this partition are contained\n            if (i == end) {\n                result.add(end - partitionStart + 1);\n                partitionStart = i + 1;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_last": [
        4,
        5,
        6
      ],
      "init": [
        9,
        10,
        11
      ],
      "scan_char": [
        13
      ],
      "extend_end": [
        15
      ],
      "partition_complete": [
        18,
        19,
        20
      ],
      "check_partition": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "is_partition_end": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> partitionLabels(string s) {\n        // Precompute last occurrence of each character\n        int last[26] = {0};\n        for (int i = 0; i < (int)s.size(); i++) {\n            last[s[i] - 'a'] = i;\n        }\n\n        vector<int> result;\n        int partitionStart = 0;\n        int end = 0;\n\n        for (int i = 0; i < (int)s.size(); i++) {\n            // Extend partition end to the last occurrence of current char\n            end = max(end, last[s[i] - 'a']);\n\n            // When i reaches end, all chars in this partition are contained\n            if (i == end) {\n                result.push_back(end - partitionStart + 1);\n                partitionStart = i + 1;\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "build_last": [
        5,
        6,
        7
      ],
      "init": [
        10,
        11,
        12
      ],
      "scan_char": [
        14
      ],
      "extend_end": [
        16
      ],
      "partition_complete": [
        19,
        20,
        21
      ],
      "check_partition": [
        19
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        14
      ],
      "is_partition_end": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> PartitionLabels(string s) {\n        // Precompute last occurrence of each character\n        int[] last = new int[26];\n        for (int i = 0; i < s.Length; i++) {\n            last[s[i] - 'a'] = i;\n        }\n\n        List<int> result = new List<int>();\n        int partitionStart = 0;\n        int end = 0;\n\n        for (int i = 0; i < s.Length; i++) {\n            // Extend partition end to the last occurrence of current char\n            end = Math.Max(end, last[s[i] - 'a']);\n\n            // When i reaches end, all chars in this partition are contained\n            if (i == end) {\n                result.Add(end - partitionStart + 1);\n                partitionStart = i + 1;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_last": [
        4,
        5,
        6
      ],
      "init": [
        9,
        10,
        11
      ],
      "scan_char": [
        13
      ],
      "extend_end": [
        15
      ],
      "partition_complete": [
        18,
        19,
        20
      ],
      "check_partition": [
        18
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "is_partition_end": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func partitionLabels(s string) []int {\n    // Precompute last occurrence of each character\n    last := [26]int{}\n    for i := 0; i < len(s); i++ {\n        last[s[i]-'a'] = i\n    }\n\n    result := []int{}\n    partitionStart := 0\n    end := 0\n\n    for i := 0; i < len(s); i++ {\n        // Extend partition end to the last occurrence of current char\n        if last[s[i]-'a'] > end {\n            end = last[s[i]-'a']\n        }\n\n        // When i reaches end, all chars in this partition are contained\n        if i == end {\n            result = append(result, end-partitionStart+1)\n            partitionStart = i + 1\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_last": [
        3,
        4,
        5
      ],
      "init": [
        8,
        9,
        10
      ],
      "scan_char": [
        12
      ],
      "extend_end": [
        14,
        15
      ],
      "partition_complete": [
        19,
        20,
        21
      ],
      "check_partition": [
        19
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "is_partition_end": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var partitionLabels = function(s) {\n    // Precompute last occurrence of each character\n    var last = new Array(26).fill(0);\n    for (var i = 0; i < s.length; i++) {\n        last[s.charCodeAt(i) - 97] = i;\n    }\n\n    var result = [];\n    var partitionStart = 0;\n    var end = 0;\n\n    for (var i = 0; i < s.length; i++) {\n        // Extend partition end to the last occurrence of current char\n        end = Math.max(end, last[s.charCodeAt(i) - 97]);\n\n        // When i reaches end, all chars in this partition are contained\n        if (i === end) {\n            result.push(end - partitionStart + 1);\n            partitionStart = i + 1;\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_last": [
        3,
        4,
        5
      ],
      "init": [
        8,
        9,
        10
      ],
      "scan_char": [
        12
      ],
      "extend_end": [
        14
      ],
      "partition_complete": [
        17,
        18,
        19
      ],
      "check_partition": [
        17
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "is_partition_end": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function partitionLabels(s: string): number[] {\n    // Precompute last occurrence of each character\n    const last: number[] = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        last[s.charCodeAt(i) - 97] = i;\n    }\n\n    const result: number[] = [];\n    let partitionStart = 0;\n    let end = 0;\n\n    for (let i = 0; i < s.length; i++) {\n        // Extend partition end to the last occurrence of current char\n        end = Math.max(end, last[s.charCodeAt(i) - 97]);\n\n        // When i reaches end, all chars in this partition are contained\n        if (i === end) {\n            result.push(end - partitionStart + 1);\n            partitionStart = i + 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_last": [
        3,
        4,
        5
      ],
      "init": [
        8,
        9,
        10
      ],
      "scan_char": [
        12
      ],
      "extend_end": [
        14
      ],
      "partition_complete": [
        17,
        18,
        19
      ],
      "check_partition": [
        17
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "is_partition_end": [
        17
      ]
    }
  }
};

const PartitionLabelsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "ababcbacadefegdehijhklij"
    }
  },
  {
    "id": "ex2",
    "label": "Compact",
    "value": {
      "s": "eccbbbbdec"
    }
  },
  {
    "id": "ex3",
    "label": "All unique",
    "value": {
      "s": "abcdef"
    }
  },
  {
    "id": "ex4",
    "label": "Single char",
    "value": {
      "s": "aaaa"
    }
  },
  {
    "id": "ex5",
    "label": "Small overlapping",
    "value": {
      "s": "abacbc"
    }
  }
];

function generatePartitionLabelsSteps(t: any): any[] {
  
let e=t.s,i=e.length,r=Array.from(e).reduce((t,e,i)=>(t[`char_${i}`]={type:"arrayElement",value:e,position:i},t),{}),n=new StepRecorder({mode:"greedy",s:e,last:void 0,partitionStart:void 0,end:void 0,i:void 0,result:void 0},{...r,meta_result:{type:"metadata",value:[]}});n.record("-","Start: Partition string so each letter appears in at most one part");let o=Array(26).fill(0);for(let t=0;t<i;t++)o[e.charCodeAt(t)-97]=t;let l={};for(let t=0;t<i;t++)l[e[t]]=o[e.charCodeAt(t)-97];n.update_variable("last",l),n.record("build_last","Build last occurrence map for each character");let s=0,c=0,d=[];n.update_variable("partitionStart",s),n.update_variable("end",c),n.update_variable("result",[...d]),n.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),n.add_new_visual("ptr_start",{type:"pointer",position:0,label:"start"}),n.add_new_visual("ptr_end",{type:"pointer",position:0,label:"end"}),n.record("init","Initialize partitionStart = 0, end = 0, result = []");let p=[];for(let t=0;t<i;t++){n.add_conditional("for_loop",!0),n.update_variable("i",t),n.update_visual("ptr_i",{type:"pointer",position:t,label:"i"}),n.update_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,state:"highlight"});let a=o[e.charCodeAt(t)-97];n.record("scan_char",`Look at s[${t}] = '${e[t]}', last occurrence at index ${a}`);let r=c;c=Math.max(c,a),n.update_variable("end",c),n.update_visual("ptr_end",{type:"pointer",position:c,label:"end"});for(let i=s;i<=c;i++)i===t?n.update_visual(`char_${i}`,{type:"arrayElement",value:e[i],position:i,state:"highlight"}):n.update_visual(`char_${i}`,{type:"arrayElement",value:e[i],position:i,state:"active"});if(c!==r?n.record("extend_end",`Update end = max(${r}, ${a}) = ${c}`):n.record("extend_end",`end stays at ${c} (max(${r}, ${a}) = ${c})`),t===c){n.add_conditional("is_partition_end",!0);let a=c-s+1;d.push(a),n.update_variable("result",[...d]),n.update_visual("meta_result",{type:"metadata",value:[...d]}),p.push({start:s,end:c});for(let t=s;t<=c;t++)n.update_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,state:"complete",partition:d.length-1});n.record("partition_complete",`i == end == ${c}. Partition [${s}..${c}] complete, size = ${a}. result = [${d.join(", ")}]`),s=t+1,n.update_variable("partitionStart",s),s<i&&n.update_visual("ptr_start",{type:"pointer",position:s,label:"start"})}else n.add_conditional("is_partition_end",!1),n.update_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,state:"active"}),n.record("check_partition",`i = ${t} != end = ${c}, partition not complete yet`)}return n.add_conditional("for_loop",!1),n.update_variable("return",[...d]),n.record("complete",`Done. Partition sizes: [${d.join(", ")}]`),n.getSteps()
}

export function PartitionLabelsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PartitionLabelsTemplates,
      generateSteps: (t: any) => {
        const recorded = generatePartitionLabelsSteps(t) as any[];
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
      title="Partition Labels"
      slug="partition-labels"
      approaches={approaches}
      presets={PartitionLabelsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Queue Reconstruction by Height (queue-reconstruction-by-height)
// ==========================================

const QueueReconstructionByHeightTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reconstructQueue(self, people: list[list[int]]) -> list[list[int]]:\n        # Sort by height ascending; if same height, by k descending\n        people.sort(key=lambda x: (x[0], -x[1]))\n\n        n = len(people)\n        tree = [0] * (4 * n)  # tree[node] = number of empty slots in node's range\n\n        def build(node, lo, hi):\n            if lo == hi:\n                tree[node] = 1\n                return\n            mid = (lo + hi) // 2\n            build(2 * node, lo, mid)\n            build(2 * node + 1, mid + 1, hi)\n            tree[node] = tree[2 * node] + tree[2 * node + 1]\n\n        # Returns index of the (k+1)th empty slot and marks it filled.\n        def assign(node, lo, hi, k):\n            tree[node] -= 1\n            if lo == hi:\n                return lo\n            mid = (lo + hi) // 2\n            if tree[2 * node] > k:\n                return assign(2 * node, lo, mid, k)\n            return assign(2 * node + 1, mid + 1, hi, k - tree[2 * node])\n\n        build(1, 0, n - 1)\n        result = [None] * n\n        for person in people:\n            idx = assign(1, 0, n - 1, person[1])\n            result[idx] = person\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        3,
        4
      ],
      "build_tree": [
        6,
        7
      ],
      "init_result": [
        28,
        29
      ],
      "pick_person": [
        30,
        31
      ],
      "descend": [
        19,
        20,
        21,
        22,
        23
      ],
      "descend_left": [
        24,
        25
      ],
      "descend_right": [
        26
      ],
      "place_person": [
        32
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        21
      ],
      "go_left": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int[] tree; // tree[node] = number of empty slots in node's range\n\n    public int[][] reconstructQueue(int[][] people) {\n        // Sort by height ascending; if same height, by k descending\n        Arrays.sort(people, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);\n\n        int n = people.length;\n        tree = new int[4 * n];\n        build(1, 0, n - 1);\n\n        int[][] result = new int[n][];\n        for (int[] person : people) {\n            // Find the (person[1]+1)th empty slot, fill it, mark it used\n            int idx = assign(1, 0, n - 1, person[1]);\n            result[idx] = person;\n        }\n        return result;\n    }\n\n    private void build(int node, int lo, int hi) {\n        if (lo == hi) { tree[node] = 1; return; }\n        int mid = (lo + hi) / 2;\n        build(2 * node, lo, mid);\n        build(2 * node + 1, mid + 1, hi);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n\n    // Returns the index of the (k+1)th empty slot and marks it filled.\n    private int assign(int node, int lo, int hi, int k) {\n        tree[node]--;\n        if (lo == hi) return lo;\n        int mid = (lo + hi) / 2;\n        // tree was already decremented; left child still holds its pre-decrement count\n        if (tree[2 * node] > k) {\n            return assign(2 * node, lo, mid, k);\n        }\n        return assign(2 * node + 1, mid + 1, hi, k - tree[2 * node]);\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "sort": [
        5,
        6
      ],
      "build_tree": [
        8,
        9,
        10
      ],
      "init_result": [
        12
      ],
      "pick_person": [
        13,
        14
      ],
      "descend": [
        30,
        31,
        32,
        33
      ],
      "descend_left": [
        34,
        35,
        36
      ],
      "descend_right": [
        38
      ],
      "place_person": [
        15,
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        32
      ],
      "go_left": [
        35
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\n    vector<int> tree; // tree[node] = number of empty slots in node's range\n\n    void build(int node, int lo, int hi) {\n        if (lo == hi) { tree[node] = 1; return; }\n        int mid = (lo + hi) / 2;\n        build(2 * node, lo, mid);\n        build(2 * node + 1, mid + 1, hi);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n\n    // Returns index of the (k+1)th empty slot and marks it filled.\n    int assign(int node, int lo, int hi, int k) {\n        tree[node]--;\n        if (lo == hi) return lo;\n        int mid = (lo + hi) / 2;\n        if (tree[2 * node] > k) return assign(2 * node, lo, mid, k);\n        return assign(2 * node + 1, mid + 1, hi, k - tree[2 * node]);\n    }\n\npublic:\n    vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {\n        // Sort by height ascending; if same height, by k descending\n        sort(people.begin(), people.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];\n        });\n\n        int n = people.size();\n        tree.assign(4 * n, 0);\n        build(1, 0, n - 1);\n\n        vector<vector<int>> result(n);\n        for (auto& person : people) {\n            int idx = assign(1, 0, n - 1, person[1]);\n            result[idx] = person;\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        22
      ],
      "sort": [
        23,
        24,
        25,
        26
      ],
      "build_tree": [
        28,
        29,
        30
      ],
      "init_result": [
        32,
        33
      ],
      "pick_person": [
        34
      ],
      "descend": [
        13,
        14,
        15,
        16
      ],
      "descend_left": [
        17
      ],
      "descend_right": [
        18
      ],
      "place_person": [
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        15
      ],
      "go_left": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[] tree; // tree[node] = number of empty slots in node's range\n\n    public int[][] ReconstructQueue(int[][] people) {\n        // Sort by height ascending; if same height, by k descending\n        Array.Sort(people, (a, b) => a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);\n\n        int n = people.Length;\n        tree = new int[4 * n];\n        Build(1, 0, n - 1);\n\n        int[][] result = new int[n][];\n        foreach (var person in people) {\n            int idx = Assign(1, 0, n - 1, person[1]);\n            result[idx] = person;\n        }\n        return result;\n    }\n\n    private void Build(int node, int lo, int hi) {\n        if (lo == hi) { tree[node] = 1; return; }\n        int mid = (lo + hi) / 2;\n        Build(2 * node, lo, mid);\n        Build(2 * node + 1, mid + 1, hi);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n\n    // Returns index of the (k+1)th empty slot and marks it filled.\n    private int Assign(int node, int lo, int hi, int k) {\n        tree[node]--;\n        if (lo == hi) return lo;\n        int mid = (lo + hi) / 2;\n        if (tree[2 * node] > k) return Assign(2 * node, lo, mid, k);\n        return Assign(2 * node + 1, mid + 1, hi, k - tree[2 * node]);\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "sort": [
        5,
        6
      ],
      "build_tree": [
        8,
        9,
        10
      ],
      "init_result": [
        12,
        13
      ],
      "pick_person": [
        14
      ],
      "descend": [
        29,
        30,
        31,
        32
      ],
      "descend_left": [
        33
      ],
      "descend_right": [
        34
      ],
      "place_person": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        31
      ],
      "go_left": [
        33
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reconstructQueue(people [][]int) [][]int {\n    // Sort by height ascending; if same height, by k descending\n    sort.Slice(people, func(i, j int) bool {\n        if people[i][0] == people[j][0] {\n            return people[i][1] > people[j][1]\n        }\n        return people[i][0] < people[j][0]\n    })\n\n    n := len(people)\n    tree := make([]int, 4*n) // tree[node] = number of empty slots in node's range\n\n    var build func(node, lo, hi int)\n    build = func(node, lo, hi int) {\n        if lo == hi {\n            tree[node] = 1\n            return\n        }\n        mid := (lo + hi) / 2\n        build(2*node, lo, mid)\n        build(2*node+1, mid+1, hi)\n        tree[node] = tree[2*node] + tree[2*node+1]\n    }\n\n    // Returns index of the (k+1)th empty slot and marks it filled.\n    var assign func(node, lo, hi, k int) int\n    assign = func(node, lo, hi, k int) int {\n        tree[node]--\n        if lo == hi {\n            return lo\n        }\n        mid := (lo + hi) / 2\n        if tree[2*node] > k {\n            return assign(2*node, lo, mid, k)\n        }\n        return assign(2*node+1, mid+1, hi, k-tree[2*node])\n    }\n\n    build(1, 0, n-1)\n    result := make([][]int, n)\n    for _, person := range people {\n        idx := assign(1, 0, n-1, person[1])\n        result[idx] = person\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "build_tree": [
        10,
        11
      ],
      "init_result": [
        39,
        40
      ],
      "pick_person": [
        41,
        42
      ],
      "descend": [
        27,
        28,
        29,
        30,
        31,
        32
      ],
      "descend_left": [
        33,
        34,
        35
      ],
      "descend_right": [
        36
      ],
      "place_person": [
        43
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        29
      ],
      "go_left": [
        33
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reconstructQueue = function(people) {\n    // Sort by height ascending; if same height, by k descending\n    people.sort(function(a, b) {\n        return a[0] === b[0] ? b[1] - a[1] : a[0] - b[0];\n    });\n\n    var n = people.length;\n    var tree = new Array(4 * n).fill(0); // tree[node] = empty slots in node's range\n\n    function build(node, lo, hi) {\n        if (lo === hi) { tree[node] = 1; return; }\n        var mid = (lo + hi) >> 1;\n        build(2 * node, lo, mid);\n        build(2 * node + 1, mid + 1, hi);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n\n    // Returns index of the (k+1)th empty slot and marks it filled.\n    function assign(node, lo, hi, k) {\n        tree[node]--;\n        if (lo === hi) return lo;\n        var mid = (lo + hi) >> 1;\n        if (tree[2 * node] > k) return assign(2 * node, lo, mid, k);\n        return assign(2 * node + 1, mid + 1, hi, k - tree[2 * node]);\n    }\n\n    build(1, 0, n - 1);\n    var result = new Array(n);\n    for (var i = 0; i < people.length; i++) {\n        var idx = assign(1, 0, n - 1, people[i][1]);\n        result[idx] = people[i];\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3,
        4,
        5
      ],
      "build_tree": [
        7,
        8
      ],
      "init_result": [
        27,
        28,
        29
      ],
      "pick_person": [
        30
      ],
      "descend": [
        19,
        20,
        21,
        22
      ],
      "descend_left": [
        23
      ],
      "descend_right": [
        24
      ],
      "place_person": [
        31
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        21
      ],
      "go_left": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reconstructQueue(people: number[][]): number[][] {\n    // Sort by height ascending; if same height, by k descending\n    people.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);\n\n    const n = people.length;\n    const tree = new Array(4 * n).fill(0); // tree[node] = empty slots in node's range\n\n    function build(node: number, lo: number, hi: number): void {\n        if (lo === hi) { tree[node] = 1; return; }\n        const mid = (lo + hi) >> 1;\n        build(2 * node, lo, mid);\n        build(2 * node + 1, mid + 1, hi);\n        tree[node] = tree[2 * node] + tree[2 * node + 1];\n    }\n\n    // Returns index of the (k+1)th empty slot and marks it filled.\n    function assign(node: number, lo: number, hi: number, k: number): number {\n        tree[node]--;\n        if (lo === hi) return lo;\n        const mid = (lo + hi) >> 1;\n        if (tree[2 * node] > k) return assign(2 * node, lo, mid, k);\n        return assign(2 * node + 1, mid + 1, hi, k - tree[2 * node]);\n    }\n\n    build(1, 0, n - 1);\n    const result: number[][] = new Array(n);\n    for (const person of people) {\n        const idx = assign(1, 0, n - 1, person[1]);\n        result[idx] = person;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2,
        3
      ],
      "build_tree": [
        5,
        6
      ],
      "init_result": [
        25,
        26,
        27
      ],
      "pick_person": [
        28
      ],
      "descend": [
        17,
        18,
        19,
        20
      ],
      "descend_left": [
        21
      ],
      "descend_right": [
        22
      ],
      "place_person": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "at_leaf": [
        19
      ],
      "go_left": [
        21
      ]
    }
  }
};

const QueueReconstructionByHeightPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "people": [
        [
          7,
          0
        ],
        [
          4,
          4
        ],
        [
          7,
          1
        ],
        [
          5,
          0
        ],
        [
          6,
          1
        ],
        [
          5,
          2
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "people": [
        [
          6,
          0
        ],
        [
          5,
          0
        ],
        [
          4,
          0
        ],
        [
          3,
          2
        ],
        [
          2,
          2
        ],
        [
          1,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Large",
    "value": {
      "people": [
        [
          3,
          0
        ],
        [
          6,
          0
        ],
        [
          7,
          0
        ],
        [
          5,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          3
        ],
        [
          6,
          2
        ],
        [
          2,
          7
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Small",
    "value": {
      "people": [
        [
          2,
          0
        ],
        [
          1,
          1
        ]
      ]
    }
  }
];

function generateQueueReconstructionByHeightSteps(e: any): any[] {
  
let t=e.people.map(e=>[...e]),r=t.length,n=t.map((e,t)=>[e[0],e[1],t]).sort((e,t)=>(e[0]===t[0]?t[1]-e[1]:e[0]-t[0])||e[2]-t[2]).map(([,,e])=>e),o=n.map(e=>t[e]),l={};o.forEach((e,t)=>{l[`person_${t}`]={type:"arrayElement",value:e[0],label:String(e[1]),position:n[t]}});let a=new StepRecorder({n:r},l);a.update_variable("mode","segtree"),a.record("-","Start: Reconstruct the queue from [height, k] pairs"),o.forEach((e,t)=>{a.update_visual(`person_${t}`,{type:"arrayElement",value:e[0],label:String(e[1]),position:t})}),a.update_variable("sortedList",o),a.record("sort","Sort by height ascending; for equal heights, larger k first");let s=Array(4*Math.max(r,1)).fill(0),u=(e,t,r)=>{if(t===r){s[e]=1;return}let i=Math.floor((t+r)/2);u(2*e,t,i),u(2*e+1,i+1,r),s[e]=s[2*e]+s[2*e+1]};r>0&&u(1,0,r-1);let d=Array(r).fill(!0);a.update_variable("emptySlots",[...d]),a.update_variable("treeRoot",s[1]??0),a.record("build_tree",`Build a segment tree over the ${r} slots. Every leaf counts as one empty slot, so the root holds ${s[1]??0}.`);let p=Array(r).fill(null);a.update_variable("resultArr",p),a.record("init_result",`Create an empty result queue with ${r} slots`);for(let e=0;e<r;e++){let t=o[e],i=t[0],n=t[1];a.update_variable("pi",e),a.update_variable("h",i),a.update_variable("k",n),a.delete_variable("placedJ"),a.delete_variable("lo"),a.delete_variable("hi"),a.delete_variable("kLeft"),a.delete_variable("leftEmpty"),a.record("pick_person",`Pick [${i},${n}]: everyone still unplaced is taller, so it wants the empty slot with exactly ${n} empties before it`);let l=1,u=0,c=r-1,h=n;for(;;){s[l]-=1;let e=u===c;if(a.update_variable("lo",u),a.update_variable("hi",c),a.update_variable("kLeft",h),a.add_conditional("at_leaf",e),a.record("descend",e?`The range has narrowed to slot ${u}. That is the slot to fill.`:`Range [${u}, ${c}] still holds ${s[l]} empty slots after this claim. Which half does it fall in?`),e)break;let t=Math.floor((u+c)/2),r=s[2*l],i=r>h;a.update_variable("leftEmpty",r),a.add_conditional("go_left",i),i?(a.record("descend_left",`The left half [${u}, ${t}] still has ${r} empty slots, more than the ${h} to skip, so the slot is in there.`),l*=2,c=t):(a.record("descend_right",`The left half only has ${r} empty slots, so skip all of them and look in [${t+1}, ${c}] for the ${h-r}th.`),l=2*l+1,u=t+1,h-=r)}p[u]=t,d[u]=!1,a.update_variable("placedJ",u),a.update_variable("resultArr",p),a.update_variable("emptySlots",[...d]),a.update_variable("treeRoot",s[1]??0),a.record("place_person",`Place [${i},${n}] at index ${u}, leaving ${s[1]??0} empty slots`)}return a.delete_variable("pi"),a.delete_variable("lo"),a.delete_variable("hi"),a.delete_variable("kLeft"),a.delete_variable("leftEmpty"),a.delete_variable("placedJ"),a.record("complete","Queue reconstruction complete!"),a.getSteps()
}

export function QueueReconstructionByHeightProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: QueueReconstructionByHeightTemplates,
      generateSteps: (e: any) => {
        const recorded = generateQueueReconstructionByHeightSteps(e) as any[];
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
      title="Queue Reconstruction by Height"
      slug="queue-reconstruction-by-height"
      approaches={approaches}
      presets={QueueReconstructionByHeightPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Split Array into Consecutive Subsequences (split-array-into-consecutive-subsequences)
// ==========================================

const SplitArrayIntoConsecutiveSubsequencesTemplates = {
  "python": {
    "language": "python",
    "code": "def isPossible(nums):\n    freq = {}\n    tails = {}\n\n    for num in nums:\n        freq[num] = freq.get(num, 0) + 1\n\n    for num in nums:\n        if freq.get(num, 0) == 0:\n            continue\n        if tails.get(num, 0) > 0:\n            tails[num] -= 1\n            tails[num + 1] = tails.get(num + 1, 0) + 1\n        elif freq.get(num + 1, 0) > 0 and freq.get(num + 2, 0) > 0:\n            freq[num + 1] -= 1\n            freq[num + 2] -= 1\n            tails[num + 3] = tails.get(num + 3, 0) + 1\n        else:\n            return False\n        freq[num] -= 1\n\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        5,
        6
      ],
      "process_loop": [
        8
      ],
      "skip_zero": [
        9,
        10
      ],
      "check_tails": [
        11
      ],
      "extend_seq": [
        12,
        13
      ],
      "check_new_seq": [
        14
      ],
      "start_new_seq": [
        15,
        16,
        17
      ],
      "cannot_split": [
        19
      ],
      "decrement_freq": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_tails": [
        11
      ],
      "check_new_seq": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isPossible(int[] nums) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    Map<Integer, Integer> tails = new HashMap<>();\n    for (int num : nums) {\n        freq.put(num, freq.getOrDefault(num, 0) + 1);\n    }\n    for (int num : nums) {\n        if (freq.get(num) == 0) continue;\n        if (tails.getOrDefault(num, 0) > 0) {\n            tails.put(num, tails.get(num) - 1);\n            tails.put(num + 1, tails.getOrDefault(num + 1, 0) + 1);\n        } else if (freq.getOrDefault(num + 1, 0) > 0\n                && freq.getOrDefault(num + 2, 0) > 0) {\n            freq.put(num + 1, freq.get(num + 1) - 1);\n            freq.put(num + 2, freq.get(num + 2) - 1);\n            tails.put(num + 3, tails.getOrDefault(num + 3, 0) + 1);\n        } else {\n            return false;\n        }\n        freq.put(num, freq.get(num) - 1);\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5,
        6
      ],
      "process_loop": [
        7
      ],
      "skip_zero": [
        8
      ],
      "check_tails": [
        9
      ],
      "extend_seq": [
        10,
        11
      ],
      "check_new_seq": [
        12,
        13
      ],
      "start_new_seq": [
        14,
        15,
        16
      ],
      "cannot_split": [
        18
      ],
      "decrement_freq": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_tails": [
        9
      ],
      "check_new_seq": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isPossible(vector<int>& nums) {\n    unordered_map<int, int> freq, tails;\n    for (int num : nums) {\n        freq[num]++;\n    }\n    for (int num : nums) {\n        if (freq[num] == 0) continue;\n        if (tails[num] > 0) {\n            tails[num]--;\n            tails[num + 1]++;\n        } else if (freq[num + 1] > 0\n                && freq[num + 2] > 0) {\n            freq[num + 1]--;\n            freq[num + 2]--;\n            tails[num + 3]++;\n        } else {\n            return false;\n        }\n        freq[num]--;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5
      ],
      "process_loop": [
        6
      ],
      "skip_zero": [
        7
      ],
      "check_tails": [
        8
      ],
      "extend_seq": [
        9,
        10
      ],
      "check_new_seq": [
        11,
        12
      ],
      "start_new_seq": [
        13,
        14,
        15
      ],
      "cannot_split": [
        17
      ],
      "decrement_freq": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_tails": [
        8
      ],
      "check_new_seq": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsPossible(int[] nums) {\n    var freq = new Dictionary<int, int>();\n    var tails = new Dictionary<int, int>();\n    foreach (int num in nums) {\n        freq[num] = freq.GetValueOrDefault(num, 0) + 1;\n    }\n    foreach (int num in nums) {\n        if (freq.GetValueOrDefault(num, 0) == 0) continue;\n        if (tails.GetValueOrDefault(num, 0) > 0) {\n            tails[num] = tails[num] - 1;\n            tails[num + 1] = tails.GetValueOrDefault(num + 1, 0) + 1;\n        } else if (freq.GetValueOrDefault(num + 1, 0) > 0\n                && freq.GetValueOrDefault(num + 2, 0) > 0) {\n            freq[num + 1] = freq[num + 1] - 1;\n            freq[num + 2] = freq[num + 2] - 1;\n            tails[num + 3] = tails.GetValueOrDefault(num + 3, 0) + 1;\n        } else {\n            return false;\n        }\n        freq[num] = freq[num] - 1;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5,
        6
      ],
      "process_loop": [
        7
      ],
      "skip_zero": [
        8
      ],
      "check_tails": [
        9
      ],
      "extend_seq": [
        10,
        11
      ],
      "check_new_seq": [
        12,
        13
      ],
      "start_new_seq": [
        14,
        15,
        16
      ],
      "cannot_split": [
        18
      ],
      "decrement_freq": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_tails": [
        9
      ],
      "check_new_seq": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isPossible(nums []int) bool {\n    freq := map[int]int{}\n    tails := map[int]int{}\n    for _, num := range nums {\n        freq[num]++\n    }\n    for _, num := range nums {\n        if freq[num] == 0 {\n            continue\n        }\n        if tails[num] > 0 {\n            tails[num]--\n            tails[num+1]++\n        } else if freq[num+1] > 0 && freq[num+2] > 0 {\n            freq[num+1]--\n            freq[num+2]--\n            tails[num+3]++\n        } else {\n            return false\n        }\n        freq[num]--\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5,
        6
      ],
      "process_loop": [
        7
      ],
      "skip_zero": [
        8,
        9,
        10
      ],
      "check_tails": [
        11
      ],
      "extend_seq": [
        12,
        13
      ],
      "check_new_seq": [
        14
      ],
      "start_new_seq": [
        15,
        16,
        17
      ],
      "cannot_split": [
        19
      ],
      "decrement_freq": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "check_tails": [
        11
      ],
      "check_new_seq": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isPossible(nums) {\n    const freq = new Map();\n    const tails = new Map();\n    for (const num of nums) {\n        freq.set(num, (freq.get(num) || 0) + 1);\n    }\n    for (const num of nums) {\n        if ((freq.get(num) || 0) === 0) continue;\n        if ((tails.get(num) || 0) > 0) {\n            tails.set(num, tails.get(num) - 1);\n            tails.set(num + 1, (tails.get(num + 1) || 0) + 1);\n        } else if ((freq.get(num + 1) || 0) > 0\n                && (freq.get(num + 2) || 0) > 0) {\n            freq.set(num + 1, freq.get(num + 1) - 1);\n            freq.set(num + 2, freq.get(num + 2) - 1);\n            tails.set(num + 3, (tails.get(num + 3) || 0) + 1);\n        } else {\n            return false;\n        }\n        freq.set(num, freq.get(num) - 1);\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5,
        6
      ],
      "process_loop": [
        7
      ],
      "skip_zero": [
        8
      ],
      "check_tails": [
        9
      ],
      "extend_seq": [
        10,
        11
      ],
      "check_new_seq": [
        12,
        13
      ],
      "start_new_seq": [
        14,
        15,
        16
      ],
      "cannot_split": [
        18
      ],
      "decrement_freq": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_tails": [
        9
      ],
      "check_new_seq": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isPossible(nums: number[]): boolean {\n    const freq = new Map<number, number>();\n    const tails = new Map<number, number>();\n    for (const num of nums) {\n        freq.set(num, (freq.get(num) || 0) + 1);\n    }\n    for (const num of nums) {\n        if ((freq.get(num) || 0) === 0) continue;\n        if ((tails.get(num) || 0) > 0) {\n            tails.set(num, tails.get(num)! - 1);\n            tails.set(num + 1, (tails.get(num + 1) || 0) + 1);\n        } else if ((freq.get(num + 1) || 0) > 0\n                && (freq.get(num + 2) || 0) > 0) {\n            freq.set(num + 1, freq.get(num + 1)! - 1);\n            freq.set(num + 2, freq.get(num + 2)! - 1);\n            tails.set(num + 3, (tails.get(num + 3) || 0) + 1);\n        } else {\n            return false;\n        }\n        freq.set(num, freq.get(num)! - 1);\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq": [
        2,
        3,
        4,
        5,
        6
      ],
      "process_loop": [
        7
      ],
      "skip_zero": [
        8
      ],
      "check_tails": [
        9
      ],
      "extend_seq": [
        10,
        11
      ],
      "check_new_seq": [
        12,
        13
      ],
      "start_new_seq": [
        14,
        15,
        16
      ],
      "cannot_split": [
        18
      ],
      "decrement_freq": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "check_tails": [
        9
      ],
      "check_new_seq": [
        12
      ]
    }
  }
};

const SplitArrayIntoConsecutiveSubsequencesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Can Split",
    "value": {
      "nums": [
        1,
        2,
        3,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Two Subsequences",
    "value": {
      "nums": [
        1,
        2,
        3,
        3,
        4,
        4,
        5,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Cannot Split",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        4,
        5
      ]
    }
  }
];

function generateSplitArrayIntoConsecutiveSubsequencesSteps(e: any): any[] {
  
let{nums:t}=e,n={};for(let e=0;e<t.length;e++)n[`elem_${e}`]={type:"arrayElement",value:t[e],position:e,state:"pending"};let a=new StepRecorder({},n),i=[],l=0,r=()=>i.forEach(e=>e.flash=null),u=()=>a.update_variable("chains",i),o=e=>{for(let n=0;n<t.length;n++){let t=a.get_visual(`elem_${n}`);a.update_visual(`elem_${n}`,{...t,state:n<e?"done":n===e?"active":"pending"})}},c=()=>a.delete_variable("justAdded");a.update_variable("phase","start"),a.update_variable("freqs",[]),a.record("-","Split into consecutive runs, each of length ≥ 3"),u(),a.record("init_list","Keep an explicit list of the open subsequences");for(let e=0;e<t.length;e++){let n=t[e];o(e),r(),c(),a.update_variable("i",e),a.update_variable("current",n),a.update_variable("phase","process"),u(),a.record("process_loop",`Take nums[${e}] = ${n}`);let s=-1;for(let e=0;e<i.length;e++)i[e].need===n&&(-1===s||i[e].nums.length<i[s].nums.length)&&(s=e);let h=-1!==s;if(a.add_conditional("check_extend",h),a.record("find_sub",h?`Shortest subsequence ending at ${n-1} is s${s+1}`:`No open subsequence ends at ${n-1}`),h)i[s].flash="extend",i[s].nums.push(n),i[s].need=n+1,a.update_variable("justAdded",n),u(),a.record("extend_sub",`Append ${n} to s${s+1}: now needs ${n+1}`);else{let e={id:l++,nums:[n],need:n+1,flash:"new"};i.push(e),a.update_variable("justAdded",n),u(),a.record("start_sub",`Start a new subsequence [${n}], now needs ${n+1}`)}let d=a.get_visual(`elem_${e}`);a.update_visual(`elem_${e}`,{...d,state:"done"})}o(t.length),r(),c(),a.update_variable("phase","validate"),u(),a.record("validate","Check that every subsequence has length ≥ 3");let h=i.findIndex(e=>e.nums.length<3),d=-1===h;return(a.add_conditional("check_short",!d),d)?(a.update_variable("phase","done"),a.update_variable("done",!0),a.update_variable("result",!0),u(),a.record("complete","Result: true — every subsequence has length ≥ 3"),a.record("return_result","Return true")):(a.record("too_short",`s${h+1} has length ${i[h].nums.length} < 3`),a.update_variable("phase","done"),a.update_variable("done",!0),a.update_variable("result",!1),u(),a.record("complete","Result: false — a subsequence is too short"),a.record("return_result","Return false")),a.getSteps()
}

export function SplitArrayIntoConsecutiveSubsequencesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SplitArrayIntoConsecutiveSubsequencesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSplitArrayIntoConsecutiveSubsequencesSteps(e) as any[];
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
      title="Split Array into Consecutive Subsequences"
      slug="split-array-into-consecutive-subsequences"
      approaches={approaches}
      presets={SplitArrayIntoConsecutiveSubsequencesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
