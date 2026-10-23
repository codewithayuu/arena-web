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
// Merge Intervals (merge-intervals)
// ==========================================

const MergeIntervalsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def merge(self, intervals: list[list[int]]) -> list[list[int]]:\n        work = [iv[:] for iv in intervals]\n\n        merged = True\n        while merged:\n            merged = False\n            i = 0\n            while i < len(work):\n                j = i + 1\n                while j < len(work):\n                    # Check if intervals i and j overlap\n                    if work[i][0] <= work[j][1] and work[j][0] <= work[i][1]:\n                        # Merge j into i\n                        work[i][0] = min(work[i][0], work[j][0])\n                        work[i][1] = max(work[i][1], work[j][1])\n                        work.pop(j)\n                        merged = True\n                    else:\n                        j += 1\n                i += 1\n\n        return work",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        2
      ],
      "copy_work": [
        3
      ],
      "start_pass": [
        6,
        7
      ],
      "check_pair": [
        13
      ],
      "merge_pair": [
        15,
        16,
        17,
        18
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "overlaps": [
        13
      ],
      "pass_repeats": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[][] merge(int[][] intervals) {\n        List<int[]> list = new ArrayList<>();\n        for (int[] interval : intervals) {\n            list.add(interval.clone());\n        }\n\n        boolean merged = true;\n        while (merged) {\n            merged = false;\n            for (int i = 0; i < list.size() && !merged; i++) {\n                for (int j = i + 1; j < list.size() && !merged; j++) {\n                    // Check if intervals i and j overlap\n                    if (list.get(i)[0] <= list.get(j)[1] && list.get(j)[0] <= list.get(i)[1]) {\n                        // Merge j into i\n                        list.get(i)[0] = Math.min(list.get(i)[0], list.get(j)[0]);\n                        list.get(i)[1] = Math.max(list.get(i)[1], list.get(j)[1]);\n                        list.remove(j);\n                        merged = true;\n                    }\n                }\n            }\n        }\n\n        return list.toArray(new int[list.size()][]);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        2
      ],
      "copy_work": [
        3,
        5
      ],
      "start_pass": [
        9,
        10
      ],
      "check_pair": [
        14
      ],
      "merge_pair": [
        16,
        17,
        18,
        19
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "overlaps": [
        14
      ],
      "pass_repeats": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        vector<vector<int>> work(intervals.begin(), intervals.end());\n\n        bool merged = true;\n        while (merged) {\n            merged = false;\n            for (int i = 0; i < work.size() && !merged; i++) {\n                for (int j = i + 1; j < work.size() && !merged; j++) {\n                    // Check if intervals i and j overlap\n                    if (work[i][0] <= work[j][1] && work[j][0] <= work[i][1]) {\n                        // Merge j into i\n                        work[i][0] = min(work[i][0], work[j][0]);\n                        work[i][1] = max(work[i][1], work[j][1]);\n                        work.erase(work.begin() + j);\n                        merged = true;\n                    }\n                }\n            }\n        }\n\n        return work;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "invalid_input": [
        3
      ],
      "copy_work": [
        4
      ],
      "start_pass": [
        7,
        8
      ],
      "check_pair": [
        12
      ],
      "merge_pair": [
        14,
        15,
        16,
        17
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "overlaps": [
        12
      ],
      "pass_repeats": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[][] Merge(int[][] intervals) {\n        List<int[]> list = new List<int[]>();\n        foreach (var iv in intervals) {\n            list.Add((int[])iv.Clone());\n        }\n\n        bool merged = true;\n        while (merged) {\n            merged = false;\n            for (int i = 0; i < list.Count && !merged; i++) {\n                for (int j = i + 1; j < list.Count && !merged; j++) {\n                    // Check if intervals i and j overlap\n                    if (list[i][0] <= list[j][1] && list[j][0] <= list[i][1]) {\n                        // Merge j into i\n                        list[i][0] = Math.Min(list[i][0], list[j][0]);\n                        list[i][1] = Math.Max(list[i][1], list[j][1]);\n                        list.RemoveAt(j);\n                        merged = true;\n                    }\n                }\n            }\n        }\n\n        return list.ToArray();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        2
      ],
      "copy_work": [
        3,
        5
      ],
      "start_pass": [
        9,
        10
      ],
      "check_pair": [
        14
      ],
      "merge_pair": [
        16,
        17,
        18,
        19
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "overlaps": [
        14
      ],
      "pass_repeats": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func merge(intervals [][]int) [][]int {\n    work := make([][]int, len(intervals))\n    for i, iv := range intervals {\n        work[i] = []int{iv[0], iv[1]}\n    }\n\n    merged := true\n    for merged {\n        merged = false\n        for i := 0; i < len(work) && !merged; i++ {\n            for j := i + 1; j < len(work) && !merged; j++ {\n                // Check if intervals i and j overlap\n                if work[i][0] <= work[j][1] && work[j][0] <= work[i][1] {\n                    // Merge j into i\n                    if work[j][0] < work[i][0] {\n                        work[i][0] = work[j][0]\n                    }\n                    if work[j][1] > work[i][1] {\n                        work[i][1] = work[j][1]\n                    }\n                    work = append(work[:j], work[j+1:]...)\n                    merged = true\n                }\n            }\n        }\n    }\n\n    return work\n}",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        1
      ],
      "copy_work": [
        2,
        4
      ],
      "start_pass": [
        8,
        9
      ],
      "check_pair": [
        13
      ],
      "merge_pair": [
        16,
        19,
        21,
        22
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "overlaps": [
        13
      ],
      "pass_repeats": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var merge = function(intervals) {\n    var work = intervals.map(function(iv) { return [iv[0], iv[1]]; });\n\n    var merged = true;\n    while (merged) {\n        merged = false;\n        for (var i = 0; i < work.length && !merged; i++) {\n            for (var j = i + 1; j < work.length && !merged; j++) {\n                // Check if intervals i and j overlap\n                if (work[i][0] <= work[j][1] && work[j][0] <= work[i][1]) {\n                    // Merge j into i\n                    work[i][0] = Math.min(work[i][0], work[j][0]);\n                    work[i][1] = Math.max(work[i][1], work[j][1]);\n                    work.splice(j, 1);\n                    merged = true;\n                }\n            }\n        }\n    }\n\n    return work;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        1
      ],
      "copy_work": [
        2
      ],
      "start_pass": [
        5,
        6
      ],
      "check_pair": [
        10
      ],
      "merge_pair": [
        12,
        13,
        14,
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "overlaps": [
        10
      ],
      "pass_repeats": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function merge(intervals: number[][]): number[][] {\n    const work: number[][] = intervals.map(iv => [iv[0], iv[1]]);\n\n    let merged = true;\n    while (merged) {\n        merged = false;\n        for (let i = 0; i < work.length && !merged; i++) {\n            for (let j = i + 1; j < work.length && !merged; j++) {\n                // Check if intervals i and j overlap\n                if (work[i][0] <= work[j][1] && work[j][0] <= work[i][1]) {\n                    // Merge j into i\n                    work[i][0] = Math.min(work[i][0], work[j][0]);\n                    work[i][1] = Math.max(work[i][1], work[j][1]);\n                    work.splice(j, 1);\n                    merged = true;\n                }\n            }\n        }\n    }\n\n    return work;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        1
      ],
      "copy_work": [
        2
      ],
      "start_pass": [
        5,
        6
      ],
      "check_pair": [
        10
      ],
      "merge_pair": [
        12,
        13,
        14,
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "overlaps": [
        10
      ],
      "pass_repeats": [
        5
      ]
    }
  }
};

const MergeIntervalsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard overlapping",
    "value": {
      "intervals": [
        [
          1,
          3
        ],
        [
          2,
          6
        ],
        [
          8,
          10
        ],
        [
          15,
          18
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Adjacent intervals",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          4,
          5
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No overlap",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          6
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Complete overlap",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          2,
          3
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single interval",
    "value": {
      "intervals": [
        [
          1,
          5
        ]
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Unsorted input",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          0,
          4
        ],
        [
          2,
          3
        ],
        [
          4,
          5
        ],
        [
          2,
          4
        ]
      ]
    }
  }
];

function generateMergeIntervalsSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),r=new StepRecorder({intervals:t,result:void 0,i:void 0,current:void 0,last_merged:void 0},{});if(0===t.length)return r.record("invalid_input","Invalid input"),r.getSteps();t.forEach((e,t)=>{r.add_new_visual(`input_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),r.record("-","Start: Merge overlapping intervals"),t.sort((e,t)=>e[0]-t[0]),r.update_variable("intervals",t),t.forEach((e,t)=>{r.update_visual(`input_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),r.record("sort_intervals",`Sort intervals by start time: ${JSON.stringify(t)}`);let i=[t[0]];r.update_variable("result",i),r.update_variable("last_merged",t[0]),r.add_new_visual("result_0",{type:"range",start:t[0][0],end:t[0][1],label:`[${t[0][0]},${t[0][1]}]`,state:"active"}),r.add_new_visual("last_merged_indicator",{type:"range",start:t[0][0],end:t[0][1],label:"last_merged"}),r.update_visual("input_0",{type:"range",start:t[0][0],end:t[0][1],label:`[${t[0][0]},${t[0][1]}]`,state:"inactive"}),r.record("initialize_result",`Initialize result with first interval: [${t[0][0]},${t[0][1]}]`);for(let e=1;e<t.length;e++){r.add_conditional("for_loop",!0),r.update_variable("i",e);let a=t[e];r.update_variable("current",a),r.update_visual(`input_${e}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"active"});let l=i[i.length-1];r.update_variable("last_merged",l),r.update_visual("last_merged_indicator",{type:"range",start:l[0],end:l[1],label:"last_merged"}),r.record("check_interval",`Check interval ${e}: [${a[0]},${a[1]}]`),a[0]<=l[1]?(r.add_conditional("overlaps",!0),l[1]=Math.max(l[1],a[1]),r.update_variable("last_merged",l),r.update_variable("result",i),r.update_visual(`result_${i.length-1}`,{type:"range",start:l[0],end:l[1],label:`[${l[0]},${l[1]}]`}),r.update_visual("last_merged_indicator",{type:"range",start:l[0],end:l[1],label:"last_merged"}),r.update_visual(`input_${e}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"inactive"}),r.record("merge_intervals",`Overlaps! Merge into [${l[0]},${l[1]}]`)):(r.add_conditional("overlaps",!1),r.add_conditional("no_overlap",!0),i.push(a),r.update_variable("result",i),r.update_variable("last_merged",a),r.update_visual(`input_${e}`,{type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`,state:"inactive"}),r.update_visual(`result_${i.length-2}`,{type:"range",start:i[i.length-2][0],end:i[i.length-2][1],label:`[${i[i.length-2][0]},${i[i.length-2][1]}]`}),r.add_new_visual(`result_${i.length-1}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`}),r.update_visual("last_merged_indicator",{type:"range",start:a[0],end:a[1],label:"last_merged"}),r.record("add_interval",`No overlap. Add [${a[0]},${a[1]}] to result`))}return r.add_conditional("for_loop",!1),r.update_visual(`input_${t.length-1}`,{type:"range",start:t[t.length-1][0],end:t[t.length-1][1],label:`[${t[t.length-1][0]},${t[t.length-1][1]}]`,state:"inactive"}),r.update_visual(`result_${i.length-1}`,{type:"range",start:i[i.length-1][0],end:i[i.length-1][1],label:`[${i[i.length-1][0]},${i[i.length-1][1]}]`,state:void 0}),r.delete_visual("i"),r.delete_visual("last_merged_indicator"),r.record("complete",`Merged intervals: ${JSON.stringify(i)}`),r.getSteps()
}

export function MergeIntervalsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeIntervalsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeIntervalsSteps(e) as any[];
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
      title="Merge Intervals"
      slug="merge-intervals"
      approaches={approaches}
      presets={MergeIntervalsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert Interval (insert-interval)
// ==========================================

const InsertIntervalTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:\n        result = []\n        i = 0\n        n = len(intervals)\n\n        # Phase 1: Add intervals that come before newInterval\n        while i < n and intervals[i][1] < newInterval[0]:\n            result.append(intervals[i])\n            i += 1\n\n        # Phase 2: Merge overlapping intervals with newInterval\n        while i < n and intervals[i][0] <= newInterval[1]:\n            newInterval[0] = min(newInterval[0], intervals[i][0])\n            newInterval[1] = max(newInterval[1], intervals[i][1])\n            i += 1\n        result.append(newInterval)\n\n        # Phase 3: Add intervals that come after newInterval\n        while i < n:\n            result.append(intervals[i])\n            i += 1\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_before": [
        9,
        10
      ],
      "merge_overlap": [
        14,
        15,
        16
      ],
      "add_merged": [
        17
      ],
      "add_after": [
        21,
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_before": [
        8
      ],
      "while_overlap": [
        13
      ],
      "while_after": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        List<int[]> result = new ArrayList<>();\n        int i = 0;\n        int n = intervals.length;\n\n        // Phase 1: Add intervals that come before newInterval\n        while (i < n && intervals[i][1] < newInterval[0]) {\n            result.add(intervals[i]);\n            i++;\n        }\n\n        // Phase 2: Merge overlapping intervals with newInterval\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        result.add(newInterval);\n\n        // Phase 3: Add intervals that come after newInterval\n        while (i < n) {\n            result.add(intervals[i]);\n            i++;\n        }\n\n        return result.toArray(new int[result.size()][]);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_before": [
        9,
        10
      ],
      "merge_overlap": [
        15,
        16,
        17
      ],
      "add_merged": [
        19
      ],
      "add_after": [
        23,
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_before": [
        8
      ],
      "while_overlap": [
        14
      ],
      "while_after": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n        vector<vector<int>> result;\n        int i = 0;\n        int n = intervals.size();\n\n        // Phase 1: Add intervals that come before newInterval\n        while (i < n && intervals[i][1] < newInterval[0]) {\n            result.push_back(intervals[i]);\n            i++;\n        }\n\n        // Phase 2: Merge overlapping intervals with newInterval\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = min(newInterval[0], intervals[i][0]);\n            newInterval[1] = max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        result.push_back(newInterval);\n\n        // Phase 3: Add intervals that come after newInterval\n        while (i < n) {\n            result.push_back(intervals[i]);\n            i++;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "add_before": [
        10,
        11
      ],
      "merge_overlap": [
        16,
        17,
        18
      ],
      "add_merged": [
        20
      ],
      "add_after": [
        24,
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "while_before": [
        9
      ],
      "while_overlap": [
        15
      ],
      "while_after": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[][] Insert(int[][] intervals, int[] newInterval) {\n        var result = new List<int[]>();\n        int i = 0;\n        int n = intervals.Length;\n\n        // Phase 1: Add intervals that come before newInterval\n        while (i < n && intervals[i][1] < newInterval[0]) {\n            result.Add(intervals[i]);\n            i++;\n        }\n\n        // Phase 2: Merge overlapping intervals with newInterval\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = Math.Min(newInterval[0], intervals[i][0]);\n            newInterval[1] = Math.Max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        result.Add(newInterval);\n\n        // Phase 3: Add intervals that come after newInterval\n        while (i < n) {\n            result.Add(intervals[i]);\n            i++;\n        }\n\n        return result.ToArray();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_before": [
        9,
        10
      ],
      "merge_overlap": [
        15,
        16,
        17
      ],
      "add_merged": [
        19
      ],
      "add_after": [
        23,
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_before": [
        8
      ],
      "while_overlap": [
        14
      ],
      "while_after": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insert(intervals [][]int, newInterval []int) [][]int {\n    result := [][]int{}\n    i := 0\n    n := len(intervals)\n\n    // Phase 1: Add intervals that come before newInterval\n    for i < n && intervals[i][1] < newInterval[0] {\n        result = append(result, intervals[i])\n        i++\n    }\n\n    // Phase 2: Merge overlapping intervals with newInterval\n    for i < n && intervals[i][0] <= newInterval[1] {\n        if intervals[i][0] < newInterval[0] {\n            newInterval[0] = intervals[i][0]\n        }\n        if intervals[i][1] > newInterval[1] {\n            newInterval[1] = intervals[i][1]\n        }\n        i++\n    }\n    result = append(result, newInterval)\n\n    // Phase 3: Add intervals that come after newInterval\n    for i < n {\n        result = append(result, intervals[i])\n        i++\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "add_before": [
        8,
        9
      ],
      "merge_overlap": [
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "add_merged": [
        22
      ],
      "add_after": [
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "while_before": [
        7
      ],
      "while_overlap": [
        13
      ],
      "while_after": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var insert = function(intervals, newInterval) {\n    var result = [];\n    var i = 0;\n    var n = intervals.length;\n\n    // Phase 1: Add intervals that come before newInterval\n    while (i < n && intervals[i][1] < newInterval[0]) {\n        result.push(intervals[i]);\n        i++;\n    }\n\n    // Phase 2: Merge overlapping intervals with newInterval\n    while (i < n && intervals[i][0] <= newInterval[1]) {\n        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n        i++;\n    }\n    result.push(newInterval);\n\n    // Phase 3: Add intervals that come after newInterval\n    while (i < n) {\n        result.push(intervals[i]);\n        i++;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "add_before": [
        8,
        9
      ],
      "merge_overlap": [
        14,
        15,
        16
      ],
      "add_merged": [
        18
      ],
      "add_after": [
        22,
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_before": [
        7
      ],
      "while_overlap": [
        13
      ],
      "while_after": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insert(intervals: number[][], newInterval: number[]): number[][] {\n    const result: number[][] = [];\n    let i = 0;\n    const n = intervals.length;\n\n    // Phase 1: Add intervals that come before newInterval\n    while (i < n && intervals[i][1] < newInterval[0]) {\n        result.push(intervals[i]);\n        i++;\n    }\n\n    // Phase 2: Merge overlapping intervals with newInterval\n    while (i < n && intervals[i][0] <= newInterval[1]) {\n        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n        i++;\n    }\n    result.push(newInterval);\n\n    // Phase 3: Add intervals that come after newInterval\n    while (i < n) {\n        result.push(intervals[i]);\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "add_before": [
        8,
        9
      ],
      "merge_overlap": [
        14,
        15,
        16
      ],
      "add_merged": [
        18
      ],
      "add_after": [
        22,
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_before": [
        7
      ],
      "while_overlap": [
        13
      ],
      "while_after": [
        21
      ]
    }
  }
};

const InsertIntervalPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Insert with merge",
    "value": {
      "intervals": [
        [
          1,
          3
        ],
        [
          6,
          9
        ]
      ],
      "newIntervalStart": 2,
      "newIntervalEnd": 5
    }
  },
  {
    "id": "ex2",
    "label": "Multiple merges",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          3,
          5
        ],
        [
          6,
          7
        ],
        [
          8,
          10
        ],
        [
          12,
          16
        ]
      ],
      "newIntervalStart": 4,
      "newIntervalEnd": 8
    }
  },
  {
    "id": "ex3",
    "label": "Insert at end",
    "value": {
      "intervals": [
        [
          1,
          5
        ]
      ],
      "newIntervalStart": 6,
      "newIntervalEnd": 8
    }
  },
  {
    "id": "ex4",
    "label": "Empty intervals",
    "value": {
      "intervals": [],
      "newIntervalStart": 5,
      "newIntervalEnd": 7
    }
  }
];

function generateInsertIntervalSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),a=[e.newIntervalStart,e.newIntervalEnd],r=new StepRecorder({mode:"scan",intervals:t,newInterval:a,result:void 0,i:void 0},{});if(t.forEach((e,t)=>{r.add_new_visual(`input_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),r.add_new_visual("new_interval",{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"active"}),r.record("-",`Insert interval [${a[0]},${a[1]}] into sorted intervals`),0===t.length){let e=[a];return r.update_variable("result",e),r.add_new_visual("result_0",{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`}),r.record("add_merged",`Add new interval [${a[0]},${a[1]}] to result`),r.record("complete",`Final result: ${JSON.stringify(e)}`),r.getSteps()}let l=[],i=0,s=t.length;for(r.update_variable("i",i),r.update_variable("result",l),r.record("initialize","Start processing intervals");i<s&&t[i][1]<a[0];)r.update_variable("i",i),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"active"}),r.add_conditional("while_before",!0),r.record("add_before",`Interval [${t[i][0]},${t[i][1]}] ends before new interval starts, add to result`),l.push(t[i]),r.update_variable("result",l),r.add_new_visual(`result_${l.length-1}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`}),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"inactive"}),i++;r.add_conditional("while_before",!1);for(;i<s&&t[i][0]<=a[1];)r.update_variable("i",i),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"active"}),r.add_conditional("while_overlap",!0),r.record("merge_overlap",`Interval [${t[i][0]},${t[i][1]}] overlaps with new interval, merge them`),a[0]=Math.min(a[0],t[i][0]),a[1]=Math.max(a[1],t[i][1]),r.update_variable("newInterval",a),r.update_visual("new_interval",{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"active"}),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"inactive"}),i++;for(r.add_conditional("while_overlap",!1),l.push(a),r.update_variable("result",l),r.add_new_visual(`result_${l.length-1}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`}),r.update_visual("new_interval",{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"inactive"}),r.record("add_merged",`Add merged interval [${a[0]},${a[1]}] to result`);i<s;)r.update_variable("i",i),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"active"}),r.add_conditional("while_after",!0),r.record("add_after",`Interval [${t[i][0]},${t[i][1]}] starts after new interval, add to result`),l.push(t[i]),r.update_variable("result",l),r.add_new_visual(`result_${l.length-1}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`}),r.update_visual(`input_${i}`,{type:"range",start:t[i][0],end:t[i][1],label:`[${t[i][0]},${t[i][1]}]`,state:"inactive"}),i++;r.add_conditional("while_after",!1);for(let e=0;e<t.length;e++)r.update_visual(`input_${e}`,{type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`,state:"inactive"});return r.record("complete",`Final result: ${JSON.stringify(l)}`),r.getSteps()
}

export function InsertIntervalProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertIntervalTemplates,
      generateSteps: (e: any) => {
        const recorded = generateInsertIntervalSteps(e) as any[];
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
      title="Insert Interval"
      slug="insert-interval"
      approaches={approaches}
      presets={InsertIntervalPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Number of Arrows to Burst Balloons (minimum-number-of-arrows-to-burst-balloons)
// ==========================================

const MinimumNumberOfArrowsToBurstBalloonsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findMinArrowShots(self, points: list[list[int]]) -> int:\n        # Sort by end point\n        points.sort(key=lambda x: x[1])\n\n        arrows = 1\n        arrow_pos = points[0][1]\n\n        for i in range(1, len(points)):\n            # If this balloon starts after the current arrow position,\n            # it needs a new arrow\n            if points[i][0] > arrow_pos:\n                arrows += 1\n                arrow_pos = points[i][1]\n\n        return arrows",
    "lineMap": {
      "-": [
        2
      ],
      "sort_balloons": [
        4
      ],
      "shoot_first_arrow": [
        6,
        7
      ],
      "check_balloon": [
        9,
        12
      ],
      "burst_with_existing": [
        12
      ],
      "shoot_new_arrow": [
        13,
        14
      ],
      "complete": [
        16
      ],
      "empty_input": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "needs_new_arrow": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int findMinArrowShots(int[][] points) {\n        // Sort by end point using Integer.compare to avoid overflow\n        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));\n\n        int arrows = 1;\n        int arrowPos = points[0][1];\n\n        for (int i = 1; i < points.length; i++) {\n            // If this balloon starts after the current arrow position,\n            // it needs a new arrow\n            if (points[i][0] > arrowPos) {\n                arrows++;\n                arrowPos = points[i][1];\n            }\n        }\n\n        return arrows;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_balloons": [
        4
      ],
      "shoot_first_arrow": [
        6,
        7
      ],
      "check_balloon": [
        9,
        12
      ],
      "burst_with_existing": [
        12
      ],
      "shoot_new_arrow": [
        13,
        14
      ],
      "complete": [
        18
      ],
      "empty_input": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "needs_new_arrow": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int findMinArrowShots(vector<vector<int>>& points) {\n        // Sort by end point\n        sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[1] < b[1];\n        });\n\n        int arrows = 1;\n        int arrowPos = points[0][1];\n\n        for (int i = 1; i < points.size(); i++) {\n            // If this balloon starts after the current arrow position,\n            // it needs a new arrow\n            if (points[i][0] > arrowPos) {\n                arrows++;\n                arrowPos = points[i][1];\n            }\n        }\n\n        return arrows;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "sort_balloons": [
        5,
        6,
        7
      ],
      "shoot_first_arrow": [
        9,
        10
      ],
      "check_balloon": [
        12,
        15
      ],
      "burst_with_existing": [
        15
      ],
      "shoot_new_arrow": [
        16,
        17
      ],
      "complete": [
        21
      ],
      "empty_input": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "needs_new_arrow": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FindMinArrowShots(int[][] points) {\n        // Sort by end point\n        Array.Sort(points, (a, b) => a[1].CompareTo(b[1]));\n\n        int arrows = 1;\n        int arrowPos = points[0][1];\n\n        for (int i = 1; i < points.Length; i++) {\n            // If this balloon starts after the current arrow position,\n            // it needs a new arrow\n            if (points[i][0] > arrowPos) {\n                arrows++;\n                arrowPos = points[i][1];\n            }\n        }\n\n        return arrows;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_balloons": [
        4
      ],
      "shoot_first_arrow": [
        6,
        7
      ],
      "check_balloon": [
        9,
        12
      ],
      "burst_with_existing": [
        12
      ],
      "shoot_new_arrow": [
        13,
        14
      ],
      "complete": [
        18
      ],
      "empty_input": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "needs_new_arrow": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMinArrowShots(points [][]int) int {\n    // Sort by end point\n    sort.Slice(points, func(i, j int) bool {\n        return points[i][1] < points[j][1]\n    })\n\n    arrows := 1\n    arrowPos := points[0][1]\n\n    for i := 1; i < len(points); i++ {\n        // If this balloon starts after the current arrow position,\n        // it needs a new arrow\n        if points[i][0] > arrowPos {\n            arrows++\n            arrowPos = points[i][1]\n        }\n    }\n\n    return arrows\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_balloons": [
        3,
        4,
        5
      ],
      "shoot_first_arrow": [
        7,
        8
      ],
      "check_balloon": [
        10,
        13
      ],
      "burst_with_existing": [
        13
      ],
      "shoot_new_arrow": [
        14,
        15
      ],
      "complete": [
        19
      ],
      "empty_input": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "needs_new_arrow": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findMinArrowShots = function(points) {\n    // Sort by end point\n    points.sort(function(a, b) { return a[1] - b[1]; });\n\n    var arrows = 1;\n    var arrowPos = points[0][1];\n\n    for (var i = 1; i < points.length; i++) {\n        // If this balloon starts after the current arrow position,\n        // it needs a new arrow\n        if (points[i][0] > arrowPos) {\n            arrows++;\n            arrowPos = points[i][1];\n        }\n    }\n\n    return arrows;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort_balloons": [
        3
      ],
      "shoot_first_arrow": [
        5,
        6
      ],
      "check_balloon": [
        8,
        11
      ],
      "burst_with_existing": [
        11
      ],
      "shoot_new_arrow": [
        12,
        13
      ],
      "complete": [
        17
      ],
      "empty_input": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "needs_new_arrow": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMinArrowShots(points: number[][]): number {\n    // Sort by end point\n    points.sort((a, b) => a[1] - b[1]);\n\n    let arrows = 1;\n    let arrowPos = points[0][1];\n\n    for (let i = 1; i < points.length; i++) {\n        // If this balloon starts after the current arrow position,\n        // it needs a new arrow\n        if (points[i][0] > arrowPos) {\n            arrows++;\n            arrowPos = points[i][1];\n        }\n    }\n\n    return arrows;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_balloons": [
        3
      ],
      "shoot_first_arrow": [
        5,
        6
      ],
      "check_balloon": [
        8,
        11
      ],
      "burst_with_existing": [
        11
      ],
      "shoot_new_arrow": [
        12,
        13
      ],
      "complete": [
        17
      ],
      "empty_input": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "needs_new_arrow": [
        11
      ]
    }
  }
};

const MinimumNumberOfArrowsToBurstBalloonsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "points": [
        [
          10,
          16
        ],
        [
          2,
          8
        ],
        [
          1,
          6
        ],
        [
          7,
          12
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "No overlap",
    "value": {
      "points": [
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          6
        ],
        [
          7,
          8
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All overlapping",
    "value": {
      "points": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ],
        [
          4,
          5
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Nested balloons",
    "value": {
      "points": [
        [
          1,
          10
        ],
        [
          2,
          9
        ],
        [
          3,
          8
        ],
        [
          4,
          7
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Complex case",
    "value": {
      "points": [
        [
          3,
          9
        ],
        [
          7,
          12
        ],
        [
          3,
          8
        ],
        [
          6,
          8
        ],
        [
          9,
          10
        ],
        [
          2,
          9
        ]
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Single balloon",
    "value": {
      "points": [
        [
          1,
          2
        ]
      ]
    }
  }
];

function generateMinimumNumberOfArrowsToBurstBalloonsSteps(t: any): any[] {
  
let e=[...t.points].map(t=>[...t]),o=new StepRecorder({mode:"byStart",points:e,arrows:void 0,i:void 0,current_end:void 0,current_balloon:void 0},{});if(e.forEach((t,e)=>{o.add_new_visual(`balloon_${e}`,{type:"range",start:t[0],end:t[1],label:`[${t[0]},${t[1]}]`})}),o.record("-","Start: Find minimum arrows to burst all balloons"),0===e.length)return o.update_variable("arrows",0),o.record("empty_input","No balloons to burst"),o.getSteps();let n=(t,r)=>{o.update_visual(`balloon_${t}`,{type:"range",start:e[t][0],end:e[t][1],label:`[${e[t][0]},${e[t][1]}]`,state:r})};e.sort((t,e)=>t[0]-e[0]),o.update_variable("points",e),e.forEach((t,e)=>n(e)),o.record("sort_balloons",`Sort balloons by start position: ${JSON.stringify(e)}`);let a=1,i=e[0][1];o.update_variable("arrows",a),o.update_variable("current_end",i),n(0,"burst"),o.add_new_visual("arrow_0",{type:"pointer",position:i,label:"\uD83C\uDFAF"}),o.record("shoot_first_arrow",`Shoot arrow at position ${i} (bursts first balloon)`);for(let t=1;t<e.length;t++){let r=e[t];if(o.add_conditional("for_loop",!0),o.update_variable("i",t),o.update_variable("current_balloon",r),n(t,"active"),o.record("check_balloon",`Check balloon ${t}: [${r[0]},${r[1]}]`),r[0]>i){a++,i=r[1],o.add_conditional("needs_new_arrow",!0),o.update_variable("arrows",a),o.update_variable("current_end",i),o.add_new_visual(`arrow_${a-1}`,{type:"pointer",position:i,label:"\uD83C\uDFAF",state:"active"}),n(t,"burst"),o.record("shoot_new_arrow",`Starts after ${i}, no overlap. Shoot a new arrow at ${i}`);continue}o.add_conditional("needs_new_arrow",!1);let s=r[1]<i;s&&(i=r[1],o.update_variable("current_end",i),o.update_visual(`arrow_${a-1}`,{type:"pointer",position:i,label:"\uD83C\uDFAF",state:"active"})),n(t,"burst"),o.record(s?"shrink_end":"keep_end",s?`Overlaps, and ends earlier. Pull the arrow back to ${i}`:`Overlaps, and ends later. The arrow stays at ${i}`)}return o.add_conditional("for_loop",!1),o.update_visual(`arrow_${a-1}`,{type:"pointer",position:i,label:"\uD83C\uDFAF",state:void 0}),o.record("complete",`Minimum arrows needed: ${a}`),o.getSteps()
}

export function MinimumNumberOfArrowsToBurstBalloonsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumNumberOfArrowsToBurstBalloonsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMinimumNumberOfArrowsToBurstBalloonsSteps(t) as any[];
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
      title="Minimum Number of Arrows to Burst Balloons"
      slug="minimum-number-of-arrows-to-burst-balloons"
      approaches={approaches}
      presets={MinimumNumberOfArrowsToBurstBalloonsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Non-overlapping Intervals (non-overlapping-intervals)
// ==========================================

const NonOverlappingIntervalsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:\n        # Sort by end time\n        intervals.sort(key=lambda x: x[1])\n\n        kept = 1\n        prev_end = intervals[0][1]\n\n        for i in range(1, len(intervals)):\n            if intervals[i][0] >= prev_end:\n                # No overlap: keep this interval\n                kept += 1\n                prev_end = intervals[i][1]\n            # Overlap: skip (do nothing)\n\n        return len(intervals) - kept",
    "lineMap": {
      "-": [
        2
      ],
      "empty_input": [
        2
      ],
      "sort_intervals": [
        4
      ],
      "initialize": [
        6,
        7
      ],
      "check_interval": [
        9
      ],
      "remove_interval": [
        14
      ],
      "keep_interval": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "overlaps": [
        14
      ],
      "no_overlap": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        // Sort by end time\n        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);\n\n        int kept = 1;\n        int prevEnd = intervals[0][1];\n\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] >= prevEnd) {\n                // No overlap: keep this interval\n                kept++;\n                prevEnd = intervals[i][1];\n            }\n            // Overlap: skip (do nothing)\n        }\n\n        return intervals.length - kept;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_input": [
        2
      ],
      "sort_intervals": [
        4
      ],
      "initialize": [
        6,
        7
      ],
      "check_interval": [
        9
      ],
      "remove_interval": [
        15
      ],
      "keep_interval": [
        12,
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "overlaps": [
        15
      ],
      "no_overlap": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n        // Sort by end time\n        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[1] < b[1];\n        });\n\n        int kept = 1;\n        int prevEnd = intervals[0][1];\n\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] >= prevEnd) {\n                // No overlap: keep this interval\n                kept++;\n                prevEnd = intervals[i][1];\n            }\n            // Overlap: skip (do nothing)\n        }\n\n        return intervals.size() - kept;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "empty_input": [
        3
      ],
      "sort_intervals": [
        5,
        6,
        7
      ],
      "initialize": [
        9,
        10
      ],
      "check_interval": [
        12
      ],
      "remove_interval": [
        18
      ],
      "keep_interval": [
        15,
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "overlaps": [
        18
      ],
      "no_overlap": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int EraseOverlapIntervals(int[][] intervals) {\n        // Sort by end time\n        Array.Sort(intervals, (a, b) => a[1] - b[1]);\n\n        int kept = 1;\n        int prevEnd = intervals[0][1];\n\n        for (int i = 1; i < intervals.Length; i++) {\n            if (intervals[i][0] >= prevEnd) {\n                // No overlap: keep this interval\n                kept++;\n                prevEnd = intervals[i][1];\n            }\n            // Overlap: skip (do nothing)\n        }\n\n        return intervals.Length - kept;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_input": [
        2
      ],
      "sort_intervals": [
        4
      ],
      "initialize": [
        6,
        7
      ],
      "check_interval": [
        9
      ],
      "remove_interval": [
        15
      ],
      "keep_interval": [
        12,
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "overlaps": [
        15
      ],
      "no_overlap": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func eraseOverlapIntervals(intervals [][]int) int {\n    // Sort by end time\n    sort.Slice(intervals, func(i, j int) bool {\n        return intervals[i][1] < intervals[j][1]\n    })\n\n    kept := 1\n    prevEnd := intervals[0][1]\n\n    for i := 1; i < len(intervals); i++ {\n        if intervals[i][0] >= prevEnd {\n            // No overlap: keep this interval\n            kept++\n            prevEnd = intervals[i][1]\n        }\n        // Overlap: skip (do nothing)\n    }\n\n    return len(intervals) - kept\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty_input": [
        1
      ],
      "sort_intervals": [
        3,
        4,
        5
      ],
      "initialize": [
        7,
        8
      ],
      "check_interval": [
        10
      ],
      "remove_interval": [
        16
      ],
      "keep_interval": [
        13,
        14
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "overlaps": [
        16
      ],
      "no_overlap": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var eraseOverlapIntervals = function(intervals) {\n    // Sort by end time\n    intervals.sort((a, b) => a[1] - b[1]);\n\n    var kept = 1;\n    var prevEnd = intervals[0][1];\n\n    for (var i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] >= prevEnd) {\n            // No overlap: keep this interval\n            kept++;\n            prevEnd = intervals[i][1];\n        }\n        // Overlap: skip (do nothing)\n    }\n\n    return intervals.length - kept;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "empty_input": [
        1
      ],
      "sort_intervals": [
        3
      ],
      "initialize": [
        5,
        6
      ],
      "check_interval": [
        8
      ],
      "remove_interval": [
        14
      ],
      "keep_interval": [
        11,
        12
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "overlaps": [
        14
      ],
      "no_overlap": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function eraseOverlapIntervals(intervals: number[][]): number {\n    // Sort by end time\n    intervals.sort((a, b) => a[1] - b[1]);\n\n    let kept = 1;\n    let prevEnd = intervals[0][1];\n\n    for (let i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] >= prevEnd) {\n            // No overlap: keep this interval\n            kept++;\n            prevEnd = intervals[i][1];\n        }\n        // Overlap: skip (do nothing)\n    }\n\n    return intervals.length - kept;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "empty_input": [
        1
      ],
      "sort_intervals": [
        3
      ],
      "initialize": [
        5,
        6
      ],
      "check_interval": [
        8
      ],
      "remove_interval": [
        14
      ],
      "keep_interval": [
        11,
        12
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "overlaps": [
        14
      ],
      "no_overlap": [
        9
      ]
    }
  }
};

const NonOverlappingIntervalsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard overlapping",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ],
        [
          1,
          3
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All same intervals",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          1,
          2
        ],
        [
          1,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No overlap",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          2,
          3
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Large interval",
    "value": {
      "intervals": [
        [
          1,
          100
        ],
        [
          11,
          22
        ],
        [
          1,
          11
        ],
        [
          2,
          12
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Chain overlapping",
    "value": {
      "intervals": [
        [
          0,
          2
        ],
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          5
        ],
        [
          4,
          6
        ]
      ]
    }
  }
];

function generateNonOverlappingIntervalsSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),r=new StepRecorder({intervals:t,count:void 0,end:void 0,i:void 0,current:void 0},{});if(0===t.length)return r.record("empty_input","No intervals provided"),r.getSteps();let n=(e,r)=>{let a={type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`};return r&&(a.state=r),a};t.forEach((e,t)=>{r.add_new_visual(`input_${t}`,n(t))}),r.record("-","Find minimum number of intervals to remove for non-overlapping set"),t.sort((e,t)=>e[0]-t[0]||e[1]-t[1]),r.update_variable("intervals",t),t.forEach((e,t)=>{r.update_visual(`input_${t}`,n(t))}),r.record("sort_intervals",`Sort intervals by start time: ${JSON.stringify(t)}`);let i=0,l=t[0][1],s=0;r.update_variable("count",i),r.update_variable("end",l),r.update_visual("input_0",n(0,"kept")),r.add_new_visual("end_marker",{type:"pointer",position:l,label:`prevEnd=${l}`}),r.record("initialize",`Keep first interval, set prevEnd = ${l}, removals = ${i}`);for(let e=1;e<t.length;e++){r.update_variable("i",e);let a=t[e];r.update_variable("current",a),r.update_visual(`input_${e}`,n(e,"active")),r.add_conditional("for_loop",!0),r.record("check_interval",`Check interval [${a[0]},${a[1]}]`),a[0]<l?(r.add_conditional("overlaps",!0),i++,r.update_variable("count",i),a[1]<l?(r.update_visual(`input_${s}`,n(s,"inactive")),r.update_visual(`input_${e}`,n(e,"kept")),l=a[1],s=e,r.update_variable("end",l),r.update_visual("end_marker",{type:"pointer",position:l,label:`prevEnd=${l}`}),r.record("remove_interval",`Overlaps! [${a[0]},${a[1]}] ends first, so drop the earlier interval. prevEnd = ${l}, removals = ${i}`)):(r.update_visual(`input_${e}`,n(e,"inactive")),r.record("remove_interval",`Overlaps! Remove interval [${a[0]},${a[1]}]. prevEnd stays ${l}, removals = ${i}`))):(r.add_conditional("overlaps",!1),r.add_conditional("no_overlap",!0),l=a[1],s=e,r.update_variable("end",l),r.update_visual(`input_${e}`,n(e,"kept")),r.update_visual("end_marker",{type:"pointer",position:l,label:`prevEnd=${l}`}),r.record("keep_interval",`No overlap! Keep interval [${a[0]},${a[1]}]. Update prevEnd = ${l}`))}return r.add_conditional("for_loop",!1),r.delete_visual("end_marker"),r.record("complete",`Minimum intervals to remove: ${i}`),r.getSteps()
}

export function NonOverlappingIntervalsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NonOverlappingIntervalsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNonOverlappingIntervalsSteps(e) as any[];
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
      title="Non-overlapping Intervals"
      slug="non-overlapping-intervals"
      approaches={approaches}
      presets={NonOverlappingIntervalsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Kth Smallest Element in Sorted Matrix (kth-smallest-element-in-a-sorted-matrix)
// ==========================================

const KthSmallestElementInASortedMatrixTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def kthSmallest(self, matrix: list[list[int]], k: int) -> int:\n        n = len(matrix)\n        low = matrix[0][0]\n        high = matrix[n - 1][n - 1]\n\n        while low < high:\n            mid = low + (high - low) // 2\n            count = self.count_less_or_equal(matrix, mid, n)\n\n            if count >= k:\n                high = mid\n            else:\n                low = mid + 1\n\n        return low\n\n    # Count elements <= target using staircase traversal\n    def count_less_or_equal(self, matrix: list[list[int]], target: int, n: int) -> int:\n        count = 0\n        row = n - 1\n        col = 0\n\n        while row >= 0 and col < n:\n            if matrix[row][col] <= target:\n                # Entire column above this element qualifies\n                count += row + 1\n                col += 1\n            else:\n                row -= 1\n\n        return count",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "init_count": [
        20,
        21,
        22
      ],
      "count_column": [
        25,
        27,
        28
      ],
      "move_up": [
        30
      ],
      "counted": [
        32
      ],
      "adjust_high": [
        12
      ],
      "adjust_low": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "while_count": [
        24
      ],
      "count_check_inner": [
        25
      ],
      "move_up": [
        29
      ],
      "count_check": [
        11
      ],
      "adjust_low": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int kthSmallest(int[][] matrix, int k) {\n        int n = matrix.length;\n        int low = matrix[0][0];\n        int high = matrix[n - 1][n - 1];\n\n        while (low < high) {\n            int mid = low + (high - low) / 2;\n            int count = countLessOrEqual(matrix, mid, n);\n\n            if (count >= k) {\n                high = mid;\n            } else {\n                low = mid + 1;\n            }\n        }\n\n        return low;\n    }\n\n    // Count elements <= target using staircase traversal\n    private int countLessOrEqual(int[][] matrix, int target, int n) {\n        int count = 0;\n        int row = n - 1;\n        int col = 0;\n\n        while (row >= 0 && col < n) {\n            if (matrix[row][col] <= target) {\n                // Entire column above this element qualifies\n                count += row + 1;\n                col++;\n            } else {\n                row--;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "init_count": [
        23,
        24,
        25
      ],
      "count_column": [
        28,
        30,
        31
      ],
      "move_up": [
        33
      ],
      "counted": [
        37
      ],
      "adjust_high": [
        12
      ],
      "adjust_low": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "while_count": [
        27
      ],
      "count_check_inner": [
        28
      ],
      "move_up": [
        32
      ],
      "count_check": [
        11
      ],
      "adjust_low": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int kthSmallest(vector<vector<int>>& matrix, int k) {\n        int n = matrix.size();\n        int low = matrix[0][0];\n        int high = matrix[n - 1][n - 1];\n\n        while (low < high) {\n            int mid = low + (high - low) / 2;\n            int count = countLessOrEqual(matrix, mid, n);\n\n            if (count >= k) {\n                high = mid;\n            } else {\n                low = mid + 1;\n            }\n        }\n\n        return low;\n    }\n\nprivate:\n    // Count elements <= target using staircase traversal\n    int countLessOrEqual(vector<vector<int>>& matrix, int target, int n) {\n        int count = 0;\n        int row = n - 1;\n        int col = 0;\n\n        while (row >= 0 && col < n) {\n            if (matrix[row][col] <= target) {\n                // Entire column above this element qualifies\n                count += row + 1;\n                col++;\n            } else {\n                row--;\n            }\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "initialize": [
        5,
        6
      ],
      "calculate_mid": [
        9
      ],
      "init_count": [
        25,
        26,
        27
      ],
      "count_column": [
        30,
        32,
        33
      ],
      "move_up": [
        35
      ],
      "counted": [
        39
      ],
      "adjust_high": [
        13
      ],
      "adjust_low": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "while_count": [
        29
      ],
      "count_check_inner": [
        30
      ],
      "move_up": [
        34
      ],
      "count_check": [
        12
      ],
      "adjust_low": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int KthSmallest(int[][] matrix, int k) {\n        int n = matrix.Length;\n        int low = matrix[0][0];\n        int high = matrix[n - 1][n - 1];\n\n        while (low < high) {\n            int mid = low + (high - low) / 2;\n            int count = CountLessOrEqual(matrix, mid, n);\n\n            if (count >= k) {\n                high = mid;\n            } else {\n                low = mid + 1;\n            }\n        }\n\n        return low;\n    }\n\n    // Count elements <= target using staircase traversal\n    private int CountLessOrEqual(int[][] matrix, int target, int n) {\n        int count = 0;\n        int row = n - 1;\n        int col = 0;\n\n        while (row >= 0 && col < n) {\n            if (matrix[row][col] <= target) {\n                // Entire column above this element qualifies\n                count += row + 1;\n                col++;\n            } else {\n                row--;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "initialize": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "init_count": [
        23,
        24,
        25
      ],
      "count_column": [
        28,
        30,
        31
      ],
      "move_up": [
        33
      ],
      "counted": [
        37
      ],
      "adjust_high": [
        12
      ],
      "adjust_low": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "while_count": [
        27
      ],
      "count_check_inner": [
        28
      ],
      "move_up": [
        32
      ],
      "count_check": [
        11
      ],
      "adjust_low": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func kthSmallest(matrix [][]int, k int) int {\n    n := len(matrix)\n    low := matrix[0][0]\n    high := matrix[n-1][n-1]\n\n    for low < high {\n        mid := low + (high-low)/2\n        count := countLessOrEqual(matrix, mid, n)\n\n        if count >= k {\n            high = mid\n        } else {\n            low = mid + 1\n        }\n    }\n\n    return low\n}\n\n// Count elements <= target using staircase traversal\nfunc countLessOrEqual(matrix [][]int, target int, n int) int {\n    count := 0\n    row := n - 1\n    col := 0\n\n    for row >= 0 && col < n {\n        if matrix[row][col] <= target {\n            // Entire column above this element qualifies\n            count += row + 1\n            col++\n        } else {\n            row--\n        }\n    }\n\n    return count\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "init_count": [
        22,
        23,
        24
      ],
      "count_column": [
        27,
        29,
        30
      ],
      "move_up": [
        32
      ],
      "counted": [
        36
      ],
      "adjust_high": [
        11
      ],
      "adjust_low": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "while_count": [
        26
      ],
      "count_check_inner": [
        27
      ],
      "move_up": [
        31
      ],
      "count_check": [
        10
      ],
      "adjust_low": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var kthSmallest = function(matrix, k) {\n    var n = matrix.length;\n    var low = matrix[0][0];\n    var high = matrix[n - 1][n - 1];\n\n    while (low < high) {\n        var mid = low + Math.floor((high - low) / 2);\n        var count = countLessOrEqual(matrix, mid, n);\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n};\n\n// Count elements <= target using staircase traversal\nfunction countLessOrEqual(matrix, target, n) {\n    var count = 0;\n    var row = n - 1;\n    var col = 0;\n\n    while (row >= 0 && col < n) {\n        if (matrix[row][col] <= target) {\n            // Entire column above this element qualifies\n            count += row + 1;\n            col++;\n        } else {\n            row--;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "init_count": [
        22,
        23,
        24
      ],
      "count_column": [
        27,
        29,
        30
      ],
      "move_up": [
        32
      ],
      "counted": [
        36
      ],
      "adjust_high": [
        11
      ],
      "adjust_low": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "while_count": [
        26
      ],
      "count_check_inner": [
        27
      ],
      "move_up": [
        31
      ],
      "count_check": [
        10
      ],
      "adjust_low": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function kthSmallest(matrix: number[][], k: number): number {\n    const n = matrix.length;\n    let low = matrix[0][0];\n    let high = matrix[n - 1][n - 1];\n\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        const count = countLessOrEqual(matrix, mid, n);\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}\n\n// Count elements <= target using staircase traversal\nfunction countLessOrEqual(matrix: number[][], target: number, n: number): number {\n    let count = 0;\n    let row = n - 1;\n    let col = 0;\n\n    while (row >= 0 && col < n) {\n        if (matrix[row][col] <= target) {\n            // Entire column above this element qualifies\n            count += row + 1;\n            col++;\n        } else {\n            row--;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "init_count": [
        22,
        23,
        24
      ],
      "count_column": [
        27,
        29,
        30
      ],
      "move_up": [
        32
      ],
      "counted": [
        36
      ],
      "adjust_high": [
        11
      ],
      "adjust_low": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "while_count": [
        26
      ],
      "count_check_inner": [
        27
      ],
      "move_up": [
        31
      ],
      "count_check": [
        10
      ],
      "adjust_low": [
        12
      ]
    }
  }
};

const KthSmallestElementInASortedMatrixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (3x3, k=8)",
    "value": {
      "matrix": [
        [
          1,
          5,
          9
        ],
        [
          10,
          11,
          13
        ],
        [
          12,
          13,
          15
        ]
      ],
      "k": 8
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (2x2, k=2)",
    "value": {
      "matrix": [
        [
          1,
          2
        ],
        [
          1,
          3
        ]
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "4x4 matrix (k=5)",
    "value": {
      "matrix": [
        [
          1,
          3,
          5,
          7
        ],
        [
          2,
          4,
          6,
          8
        ],
        [
          3,
          5,
          7,
          9
        ],
        [
          4,
          6,
          8,
          10
        ]
      ],
      "k": 5
    }
  },
  {
    "id": "ex4",
    "label": "5x5 matrix (k=13)",
    "value": {
      "matrix": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        [
          6,
          7,
          8,
          9,
          10
        ],
        [
          11,
          12,
          13,
          14,
          15
        ],
        [
          16,
          17,
          18,
          19,
          20
        ],
        [
          21,
          22,
          23,
          24,
          25
        ]
      ],
      "k": 13
    }
  },
  {
    "id": "ex5",
    "label": "Single element",
    "value": {
      "matrix": [
        [
          1
        ]
      ],
      "k": 1
    }
  }
];

function generateKthSmallestElementInASortedMatrixSteps(e: any): any[] {
  
let t=e.matrix,a=e.k,n=t.length,l={};for(let e=0;e<n;e++)for(let a=0;a<n;a++)l[`elem_${e}_${a}`]={type:"matrixElement",value:t[e][a],row:e,col:a};let r=new StepRecorder({mode:"sort",n,k:a,visited:0,listCount:0,pushedKey:null},l);r.record("start","Flatten every cell into one list, sort it, then read index k - 1");let o=[];for(let e=0;e<n;e++)for(let a=0;a<n;a++){let i=`card_${o.length}`,n=o.length;o.push({value:t[e][a],r:e,c:a,key:i}),r.update_visual(i,{type:"arrayElement",value:t[e][a],position:n,zone:"list",slot:n,r:e,c:a}),r.update_variable("i",e),r.update_variable("j",a),r.update_variable("visited",o.length),r.update_variable("listCount",o.length),r.update_variable("pushedKey",i),r.record("flatten_push",`Append matrix[${e}][${a}] = ${t[e][a]}`)}let s=[...o].sort((e,t)=>e.value-t.value||e.r-t.r||e.c-t.c);s.forEach((e,t)=>{r.update_visual(e.key,{type:"arrayElement",value:e.value,position:t,zone:"list",slot:t,r:e.r,c:e.c})}),r.delete_variable("i"),r.delete_variable("j"),r.update_variable("pushedKey",null),r.record("sort_list",`Sort all ${o.length} values ascending`);let u=Math.min(Math.max(a-1,0),s.length-1);return r.update_variable("resultSlot",u),r.update_variable("result",s[u].value),r.record("complete",`elements[k - 1] = elements[${u}] = ${s[u].value}`),r.getSteps()
}

export function KthSmallestElementInASortedMatrixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KthSmallestElementInASortedMatrixTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKthSmallestElementInASortedMatrixSteps(e) as any[];
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
      title="Kth Smallest Element in Sorted Matrix"
      slug="kth-smallest-element-in-a-sorted-matrix"
      approaches={approaches}
      presets={KthSmallestElementInASortedMatrixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Number of Events That Can Be Attended (maximum-number-of-events-that-can-be-attended)
// ==========================================

const MaximumNumberOfEventsThatCanBeAttendedTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxEvents(self, events: list[list[int]]) -> int:\n        # Sort events by start day\n        events.sort()\n\n        heap = []  # Min-heap of end days\n        i = 0\n        count = 0\n        n = len(events)\n\n        # Find the last day we need to check\n        max_day = max(event[1] for event in events)\n\n        for day in range(1, max_day + 1):\n            # Add all events starting today\n            while i < n and events[i][0] == day:\n                heapq.heappush(heap, events[i][1])\n                i += 1\n\n            # Remove expired events\n            while heap and heap[0] < day:\n                heapq.heappop(heap)\n\n            # Attend the event ending soonest\n            if heap:\n                heapq.heappop(heap)\n                count += 1\n\n        return count",
    "lineMap": {
      "-": [
        2
      ],
      "sort_events": [
        4
      ],
      "initialize": [
        6,
        7,
        8,
        9,
        12
      ],
      "advance_day": [
        14
      ],
      "add_event": [
        16,
        17,
        18
      ],
      "expire_event": [
        21,
        22
      ],
      "attend_event": [
        25,
        26,
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        14
      ],
      "add_to_heap": [
        16
      ],
      "remove_expired": [
        21
      ],
      "attend_event": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxEvents(int[][] events) {\n        // Sort events by start day\n        Arrays.sort(events, (a, b) -> a[0] - b[0]);\n\n        // Min-heap stores end days of active events\n        PriorityQueue<Integer> heap = new PriorityQueue<>();\n        int i = 0;\n        int count = 0;\n        int n = events.length;\n\n        // Find the last day we need to check\n        int maxDay = 0;\n        for (int[] event : events) {\n            maxDay = Math.max(maxDay, event[1]);\n        }\n\n        for (int day = 1; day <= maxDay; day++) {\n            // Add all events starting today\n            while (i < n && events[i][0] == day) {\n                heap.offer(events[i][1]);\n                i++;\n            }\n\n            // Remove expired events\n            while (!heap.isEmpty() && heap.peek() < day) {\n                heap.poll();\n            }\n\n            // Attend the event ending soonest\n            if (!heap.isEmpty()) {\n                heap.poll();\n                count++;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_events": [
        4
      ],
      "initialize": [
        7,
        8,
        9,
        10,
        13
      ],
      "advance_day": [
        18
      ],
      "add_event": [
        20,
        21,
        22
      ],
      "expire_event": [
        26,
        27
      ],
      "attend_event": [
        31,
        32,
        33
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        18
      ],
      "add_to_heap": [
        20
      ],
      "remove_expired": [
        26
      ],
      "attend_event": [
        31
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxEvents(vector<vector<int>>& events) {\n        // Sort events by start day\n        sort(events.begin(), events.end());\n\n        // Min-heap of end days\n        priority_queue<int, vector<int>, greater<int>> heap;\n        int i = 0;\n        int count = 0;\n        int n = events.size();\n\n        // Find the last day we need to check\n        int maxDay = 0;\n        for (auto& event : events) {\n            maxDay = max(maxDay, event[1]);\n        }\n\n        for (int day = 1; day <= maxDay; day++) {\n            // Add all events starting today\n            while (i < n && events[i][0] == day) {\n                heap.push(events[i][1]);\n                i++;\n            }\n\n            // Remove expired events\n            while (!heap.empty() && heap.top() < day) {\n                heap.pop();\n            }\n\n            // Attend the event ending soonest\n            if (!heap.empty()) {\n                heap.pop();\n                count++;\n            }\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "sort_events": [
        5
      ],
      "initialize": [
        8,
        9,
        10,
        11,
        14
      ],
      "advance_day": [
        19
      ],
      "add_event": [
        21,
        22,
        23
      ],
      "expire_event": [
        27,
        28
      ],
      "attend_event": [
        32,
        33,
        34
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        19
      ],
      "add_to_heap": [
        21
      ],
      "remove_expired": [
        27
      ],
      "attend_event": [
        32
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxEvents(int[][] events) {\n        // Sort events by start day\n        Array.Sort(events, (a, b) => a[0] - b[0]);\n\n        // Min-heap of end days\n        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();\n        int i = 0;\n        int count = 0;\n        int n = events.Length;\n\n        // Find the last day we need to check\n        int maxDay = 0;\n        foreach (int[] ev in events) {\n            maxDay = Math.Max(maxDay, ev[1]);\n        }\n\n        for (int day = 1; day <= maxDay; day++) {\n            // Add all events starting today\n            while (i < n && events[i][0] == day) {\n                heap.Enqueue(events[i][1], events[i][1]);\n                i++;\n            }\n\n            // Remove expired events\n            while (heap.Count > 0 && heap.Peek() < day) {\n                heap.Dequeue();\n            }\n\n            // Attend the event ending soonest\n            if (heap.Count > 0) {\n                heap.Dequeue();\n                count++;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_events": [
        4
      ],
      "initialize": [
        7,
        8,
        9,
        10,
        13
      ],
      "advance_day": [
        18
      ],
      "add_event": [
        20,
        21,
        22
      ],
      "expire_event": [
        26,
        27
      ],
      "attend_event": [
        31,
        32,
        33
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        18
      ],
      "add_to_heap": [
        20
      ],
      "remove_expired": [
        26
      ],
      "attend_event": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxEvents(events [][]int) int {\n    // Sort events by start day\n    sort.Slice(events, func(i, j int) bool {\n        return events[i][0] < events[j][0]\n    })\n\n    // Min-heap of end days\n    h := &IntHeap{}\n    heap.Init(h)\n    i := 0\n    count := 0\n    n := len(events)\n\n    // Find the last day we need to check\n    maxDay := 0\n    for _, event := range events {\n        if event[1] > maxDay {\n            maxDay = event[1]\n        }\n    }\n\n    for day := 1; day <= maxDay; day++ {\n        // Add all events starting today\n        for i < n && events[i][0] == day {\n            heap.Push(h, events[i][1])\n            i++\n        }\n\n        // Remove expired events\n        for h.Len() > 0 && (*h)[0] < day {\n            heap.Pop(h)\n        }\n\n        // Attend the event ending soonest\n        if h.Len() > 0 {\n            heap.Pop(h)\n            count++\n        }\n    }\n\n    return count\n}\n\ntype IntHeap []int\n\nfunc (h IntHeap) Len() int           { return len(h) }\nfunc (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }\nfunc (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *IntHeap) Push(x interface{}) { *h = append(*h, x.(int)) }\nfunc (h *IntHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_events": [
        3,
        4,
        5
      ],
      "initialize": [
        8,
        10,
        11,
        12,
        15
      ],
      "advance_day": [
        22
      ],
      "add_event": [
        24,
        25,
        26
      ],
      "expire_event": [
        30,
        31
      ],
      "attend_event": [
        35,
        36,
        37
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        22
      ],
      "add_to_heap": [
        24
      ],
      "remove_expired": [
        30
      ],
      "attend_event": [
        35
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxEvents = function(events) {\n    // Sort events by start day\n    events.sort((a, b) => a[0] - b[0]);\n\n    // Simple min-heap implementation using array\n    var heap = [];\n    var i = 0;\n    var count = 0;\n    var n = events.length;\n\n    // Find the last day we need to check\n    var maxDay = 0;\n    for (var e of events) {\n        maxDay = Math.max(maxDay, e[1]);\n    }\n\n    // Min-heap helper functions\n    function heapPush(val) {\n        heap.push(val);\n        var idx = heap.length - 1;\n        while (idx > 0) {\n            var parent = Math.floor((idx - 1) / 2);\n            if (heap[parent] > heap[idx]) {\n                [heap[parent], heap[idx]] = [heap[idx], heap[parent]];\n                idx = parent;\n            } else break;\n        }\n    }\n\n    function heapPop() {\n        var top = heap[0];\n        var last = heap.pop();\n        if (heap.length > 0) {\n            heap[0] = last;\n            var idx = 0;\n            while (true) {\n                var left = 2 * idx + 1, right = 2 * idx + 2, smallest = idx;\n                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n                if (smallest !== idx) {\n                    [heap[smallest], heap[idx]] = [heap[idx], heap[smallest]];\n                    idx = smallest;\n                } else break;\n            }\n        }\n        return top;\n    }\n\n    for (var day = 1; day <= maxDay; day++) {\n        // Add all events starting today\n        while (i < n && events[i][0] === day) {\n            heapPush(events[i][1]);\n            i++;\n        }\n\n        // Remove expired events\n        while (heap.length > 0 && heap[0] < day) {\n            heapPop();\n        }\n\n        // Attend the event ending soonest\n        if (heap.length > 0) {\n            heapPop();\n            count++;\n        }\n    }\n\n    return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort_events": [
        3
      ],
      "initialize": [
        6,
        7,
        8,
        9,
        12
      ],
      "advance_day": [
        49
      ],
      "add_event": [
        51,
        52,
        53
      ],
      "expire_event": [
        57,
        58
      ],
      "attend_event": [
        62,
        63,
        64
      ],
      "complete": [
        68
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        49
      ],
      "add_to_heap": [
        51
      ],
      "remove_expired": [
        57
      ],
      "attend_event": [
        62
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxEvents(events: number[][]): number {\n    // Sort events by start day\n    events.sort((a, b) => a[0] - b[0]);\n\n    // Simple min-heap implementation\n    const heap: number[] = [];\n    let i = 0;\n    let count = 0;\n    const n = events.length;\n\n    // Find the last day we need to check\n    let maxDay = 0;\n    for (const event of events) {\n        maxDay = Math.max(maxDay, event[1]);\n    }\n\n    function heapPush(val: number): void {\n        heap.push(val);\n        let idx = heap.length - 1;\n        while (idx > 0) {\n            const parent = Math.floor((idx - 1) / 2);\n            if (heap[parent] > heap[idx]) {\n                [heap[parent], heap[idx]] = [heap[idx], heap[parent]];\n                idx = parent;\n            } else break;\n        }\n    }\n\n    function heapPop(): number {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let idx = 0;\n            while (true) {\n                const left = 2 * idx + 1, right = 2 * idx + 2;\n                let smallest = idx;\n                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n                if (smallest !== idx) {\n                    [heap[smallest], heap[idx]] = [heap[idx], heap[smallest]];\n                    idx = smallest;\n                } else break;\n            }\n        }\n        return top;\n    }\n\n    for (let day = 1; day <= maxDay; day++) {\n        // Add all events starting today\n        while (i < n && events[i][0] === day) {\n            heapPush(events[i][1]);\n            i++;\n        }\n\n        // Remove expired events\n        while (heap.length > 0 && heap[0] < day) {\n            heapPop();\n        }\n\n        // Attend the event ending soonest\n        if (heap.length > 0) {\n            heapPop();\n            count++;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_events": [
        3
      ],
      "initialize": [
        6,
        7,
        8,
        9,
        12
      ],
      "advance_day": [
        49
      ],
      "add_event": [
        51,
        52,
        53
      ],
      "expire_event": [
        57,
        58
      ],
      "attend_event": [
        62,
        63,
        64
      ],
      "complete": [
        68
      ]
    },
    "conditionalMap": {
      "for_day_loop": [
        49
      ],
      "add_to_heap": [
        51
      ],
      "remove_expired": [
        57
      ],
      "attend_event": [
        62
      ]
    }
  }
};

const MaximumNumberOfEventsThatCanBeAttendedPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Sequential",
    "value": {
      "events": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "With duplicate",
    "value": {
      "events": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          3,
          4
        ],
        [
          1,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "LeetCode Example",
    "value": {
      "events": [
        [
          1,
          4
        ],
        [
          4,
          4
        ],
        [
          2,
          2
        ],
        [
          3,
          4
        ],
        [
          1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All same day",
    "value": {
      "events": [
        [
          1,
          1
        ],
        [
          1,
          1
        ],
        [
          1,
          1
        ]
      ]
    }
  }
];

function generateMaximumNumberOfEventsThatCanBeAttendedSteps(e: any): any[] {
  
let t=[...e.events].map(e=>[...e]),a=new StepRecorder({events:t,day:void 0,i:void 0,count:void 0,heap:void 0},{});if(0===t.length)return a.record("complete","No events to attend"),a.getSteps();t.forEach((e,t)=>{a.add_new_visual(`event_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),a.record("-","Find the maximum number of events that can be attended");let i=t.map((e,t)=>({start:e[0],end:e[1],originalIdx:t}));i.sort((e,t)=>e.start-t.start);let r=i.map(e=>[e.start,e.end]);a.update_variable("events",r),a.record("sort_events","Sort events by start day");let s=new Map(i.map(e=>[e.originalIdx,e])),d=0,o=0,l=[],p=Math.max(...t.map(e=>e[1]));a.update_variable("count",d),a.update_variable("i",o),a.update_variable("heap",[]),a.add_new_visual("day_marker",{type:"pointer",position:0,label:"day=0"}),a.record("initialize",`count=0, i=0, heap=[], maxDay=${p}`);let v=e=>{l.push(e),l.sort((e,t)=>e[0]-t[0])},h=()=>l.shift();for(let e=1;e<=p;e++){for(a.update_variable("day",e),a.update_visual("day_marker",{type:"pointer",position:e,label:`day=${e}`}),a.add_conditional("for_day_loop",!0),a.record("advance_day",`Starting day ${e}`);o<i.length&&i[o].start<=e;){let e=i[o];v([e.end,e.originalIdx]),o++,a.update_variable("i",o),a.update_variable("heap",l.map(e=>e[0])),a.update_visual(`event_${e.originalIdx}`,{type:"range",start:e.start,end:e.end,label:`[${e.start},${e.end}]`,state:"in_heap"}),a.add_conditional("add_to_heap",!0),a.record("add_event",`Add event [${e.start},${e.end}] to heap (ends day ${e.end})`)}for(;l.length>0&&l[0][0]<e;){let e=h(),t=s.get(e[1]);a.update_variable("heap",l.map(e=>e[0])),a.update_visual(`event_${e[1]}`,{type:"range",start:t.start,end:t.end,label:`[${t.start},${t.end}]`,state:"expired"}),a.add_conditional("remove_expired",!0),a.record("expire_event",`Remove expired event [${t.start},${t.end}]`)}if(l.length>0){let t=h(),n=s.get(t[1]);d++,a.update_variable("count",d),a.update_variable("heap",l.map(e=>e[0])),a.update_visual(`event_${t[1]}`,{type:"range",start:n.start,end:n.end,label:`[${n.start},${n.end}]`,state:"attended"}),a.add_conditional("attend_event",!0),a.record("attend_event",`Attend event [${n.start},${n.end}] on day ${e}. Count=${d}`)}}return a.add_conditional("for_day_loop",!1),a.delete_visual("day_marker"),a.record("complete",`Maximum events attended: ${d}`),a.getSteps()
}

export function MaximumNumberOfEventsThatCanBeAttendedProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumNumberOfEventsThatCanBeAttendedTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumNumberOfEventsThatCanBeAttendedSteps(e) as any[];
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
      title="Maximum Number of Events That Can Be Attended"
      slug="maximum-number-of-events-that-can-be-attended"
      approaches={approaches}
      presets={MaximumNumberOfEventsThatCanBeAttendedPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Avoid Flood in The City (avoid-flood-in-the-city)
// ==========================================

const AvoidFloodInTheCityTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def avoidFlood(self, rains: List[int]) -> List[int]:\n        n = len(rains)\n        ans = [0] * n\n        lake_day = {}\n        dry_days = []\n\n        for i in range(n):\n            if rains[i] == 0:\n                dry_days.append(i)\n                ans[i] = 1  # placeholder\n            else:\n                lake = rains[i]\n                if lake in lake_day:\n                    # Lake is full, find a dry day after previous rain\n                    prev_day = lake_day[lake]\n                    found = -1\n                    for j in range(len(dry_days)):\n                        if dry_days[j] > prev_day:\n                            found = j\n                            break\n                    if found == -1:\n                        return []\n                    dry_day = dry_days.pop(found)\n                    ans[dry_day] = lake\n                lake_day[lake] = i\n                ans[i] = -1\n        return ans",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "dry_day_found": [
        10,
        11
      ],
      "scan_dry_days": [
        18,
        19
      ],
      "no_dry_day_flood": [
        22,
        23
      ],
      "assign_drain": [
        24,
        25
      ],
      "record_lake": [
        26,
        27
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "lake_already_full": [
        14
      ],
      "found_dry": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] avoidFlood(int[] rains) {\n        int n = rains.length;\n        int[] ans = new int[n];\n        Map<Integer, Integer> lakeDay = new HashMap<>();\n        List<Integer> dryDays = new ArrayList<>();\n\n        for (int i = 0; i < n; i++) {\n            if (rains[i] == 0) {\n                dryDays.add(i);\n                ans[i] = 1; // placeholder, will be overwritten if used\n            } else {\n                int lake = rains[i];\n                if (lakeDay.containsKey(lake)) {\n                    // Lake is full, find a dry day after previous rain\n                    int prevDay = lakeDay.get(lake);\n                    int found = -1;\n                    for (int j = 0; j < dryDays.size(); j++) {\n                        if (dryDays.get(j) > prevDay) {\n                            found = j;\n                            break;\n                        }\n                    }\n                    if (found == -1) {\n                        return new int[0]; // impossible\n                    }\n                    int dryDay = dryDays.remove(found);\n                    ans[dryDay] = lake;\n                }\n                lakeDay.put(lake, i);\n                ans[i] = -1;\n            }\n        }\n        return ans;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "dry_day_found": [
        10,
        11
      ],
      "scan_dry_days": [
        18,
        19
      ],
      "no_dry_day_flood": [
        24,
        25
      ],
      "assign_drain": [
        27,
        28
      ],
      "record_lake": [
        30,
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "lake_already_full": [
        14
      ],
      "found_dry": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> avoidFlood(vector<int>& rains) {\n        int n = rains.size();\n        vector<int> ans(n, 0);\n        unordered_map<int, int> lakeDay;\n        vector<int> dryDays;\n\n        for (int i = 0; i < n; i++) {\n            if (rains[i] == 0) {\n                dryDays.push_back(i);\n                ans[i] = 1; // placeholder\n            } else {\n                int lake = rains[i];\n                if (lakeDay.count(lake)) {\n                    // Lake is full, find a dry day after previous rain\n                    int prevDay = lakeDay[lake];\n                    int found = -1;\n                    for (int j = 0; j < (int)dryDays.size(); j++) {\n                        if (dryDays[j] > prevDay) {\n                            found = j;\n                            break;\n                        }\n                    }\n                    if (found == -1) {\n                        return {};\n                    }\n                    int dryDay = dryDays[found];\n                    dryDays.erase(dryDays.begin() + found);\n                    ans[dryDay] = lake;\n                }\n                lakeDay[lake] = i;\n                ans[i] = -1;\n            }\n        }\n        return ans;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        5,
        6,
        7
      ],
      "dry_day_found": [
        11,
        12
      ],
      "scan_dry_days": [
        19,
        20
      ],
      "no_dry_day_flood": [
        25,
        26
      ],
      "assign_drain": [
        28,
        29,
        30
      ],
      "record_lake": [
        32,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "lake_already_full": [
        15
      ],
      "found_dry": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] AvoidFlood(int[] rains) {\n        int n = rains.Length;\n        int[] ans = new int[n];\n        Dictionary<int, int> lakeDay = new Dictionary<int, int>();\n        List<int> dryDays = new List<int>();\n\n        for (int i = 0; i < n; i++) {\n            if (rains[i] == 0) {\n                dryDays.Add(i);\n                ans[i] = 1; // placeholder\n            } else {\n                int lake = rains[i];\n                if (lakeDay.ContainsKey(lake)) {\n                    // Lake is full, find a dry day after previous rain\n                    int prevDay = lakeDay[lake];\n                    int found = -1;\n                    for (int j = 0; j < dryDays.Count; j++) {\n                        if (dryDays[j] > prevDay) {\n                            found = j;\n                            break;\n                        }\n                    }\n                    if (found == -1) {\n                        return new int[0];\n                    }\n                    int dryDay = dryDays[found];\n                    dryDays.RemoveAt(found);\n                    ans[dryDay] = lake;\n                }\n                lakeDay[lake] = i;\n                ans[i] = -1;\n            }\n        }\n        return ans;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "dry_day_found": [
        10,
        11
      ],
      "scan_dry_days": [
        18,
        19
      ],
      "no_dry_day_flood": [
        24,
        25
      ],
      "assign_drain": [
        27,
        28,
        29
      ],
      "record_lake": [
        31,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "lake_already_full": [
        14
      ],
      "found_dry": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func avoidFlood(rains []int) []int {\n    n := len(rains)\n    ans := make([]int, n)\n    lakeDay := make(map[int]int)\n    dryDays := []int{}\n\n    for i := 0; i < n; i++ {\n        if rains[i] == 0 {\n            dryDays = append(dryDays, i)\n            ans[i] = 1 // placeholder\n        } else {\n            lake := rains[i]\n            if prevDay, ok := lakeDay[lake]; ok {\n                // Lake is full, find a dry day after previous rain\n                found := -1\n                for j := 0; j < len(dryDays); j++ {\n                    if dryDays[j] > prevDay {\n                        found = j\n                        break\n                    }\n                }\n                if found == -1 {\n                    return []int{}\n                }\n                dryDay := dryDays[found]\n                dryDays = append(dryDays[:found], dryDays[found+1:]...)\n                ans[dryDay] = lake\n            }\n            lakeDay[lake] = i\n            ans[i] = -1\n        }\n    }\n    return ans\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "dry_day_found": [
        9,
        10
      ],
      "scan_dry_days": [
        16,
        17
      ],
      "no_dry_day_flood": [
        22,
        23
      ],
      "assign_drain": [
        25,
        27
      ],
      "record_lake": [
        29,
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "lake_already_full": [
        13
      ],
      "found_dry": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var avoidFlood = function (rains) {\n  var n = rains.length;\n  var ans = new Array(n).fill(0);\n  var lakeDay = new Map();\n  var dryDays = [];\n\n  for (var i = 0; i < n; i++) {\n    if (rains[i] === 0) {\n      dryDays.push(i);\n      ans[i] = 1; // placeholder\n    } else {\n      var lake = rains[i];\n      if (lakeDay.has(lake)) {\n        // Lake is full, find a dry day after previous rain\n        var prevDay = lakeDay.get(lake);\n        var found = -1;\n        for (var j = 0; j < dryDays.length; j++) {\n          if (dryDays[j] > prevDay) {\n            found = j;\n            break;\n          }\n        }\n        if (found === -1) {\n          return [];\n        }\n        var dryDay = dryDays.splice(found, 1)[0];\n        ans[dryDay] = lake;\n      }\n      lakeDay.set(lake, i);\n      ans[i] = -1;\n    }\n  }\n  return ans;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "dry_day_found": [
        9,
        10
      ],
      "scan_dry_days": [
        17,
        18
      ],
      "no_dry_day_flood": [
        23,
        24
      ],
      "assign_drain": [
        26,
        27
      ],
      "record_lake": [
        29,
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "lake_already_full": [
        13
      ],
      "found_dry": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function avoidFlood(rains: number[]): number[] {\n    const n = rains.length;\n    const ans: number[] = new Array(n).fill(0);\n    const lakeDay = new Map<number, number>();\n    const dryDays: number[] = [];\n\n    for (let i = 0; i < n; i++) {\n        if (rains[i] === 0) {\n            dryDays.push(i);\n            ans[i] = 1; // placeholder\n        } else {\n            const lake = rains[i];\n            if (lakeDay.has(lake)) {\n                // Lake is full, find a dry day after previous rain\n                const prevDay = lakeDay.get(lake)!;\n                let found = -1;\n                for (let j = 0; j < dryDays.length; j++) {\n                    if (dryDays[j] > prevDay) {\n                        found = j;\n                        break;\n                    }\n                }\n                if (found === -1) {\n                    return [];\n                }\n                const dryDay = dryDays.splice(found, 1)[0];\n                ans[dryDay] = lake;\n            }\n            lakeDay.set(lake, i);\n            ans[i] = -1;\n        }\n    }\n    return ans;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "dry_day_found": [
        9,
        10
      ],
      "scan_dry_days": [
        17,
        18
      ],
      "no_dry_day_flood": [
        23,
        24
      ],
      "assign_drain": [
        26,
        27
      ],
      "record_lake": [
        29,
        30
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "lake_already_full": [
        13
      ],
      "found_dry": [
        18
      ]
    }
  }
};

const AvoidFloodInTheCityPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "rains": [
        1,
        2,
        0,
        0,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "rains": [
        1,
        2,
        0,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple drain",
    "value": {
      "rains": [
        69,
        0,
        0,
        69
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Multiple drains",
    "value": {
      "rains": [
        1,
        0,
        2,
        0,
        2,
        1
      ]
    }
  }
];

function generateAvoidFloodInTheCitySteps(e: any): any[] {
  
let a=[...e.rains],n=a.length,t=a.reduce((e,a,n)=>(e[`day_${n}`]={type:"arrayElement",value:a,position:n},e),{}),l=new StepRecorder({},t);l.record("-","Start: Drain whichever full lake rains again soonest");let r=Array(n).fill("?"),s=Array(n).fill(n),d={};l.add_new_variable("ansArr",r),l.add_new_variable("nextRain",s),l.add_new_variable("phase","back"),l.record("precompute","Walk backwards to record, for each rain day, when that lake rains next");for(let e=n-1;e>=0;e--)l.add_conditional("back_is_rain",a[e]>0),l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_variable("i",e),a[e]>0?(s[e]=d[a[e]]??n,d[a[e]]=e,l.update_variable("nextRain",s),l.record("scan_back",s[e]<n?`Lake ${a[e]} rains again on day ${s[e]}: nextRain[${e}] = ${s[e]}`:`Lake ${a[e]} never rains again: nextRain[${e}] = ${n}`)):l.record("scan_back",`Day ${e}: no rain, nothing to record`);let o=[],f=[];l.update_variable("phase","forward"),l.add_new_variable("heap",o),l.add_new_variable("full",f),l.delete_visual("ptr_i"),l.record("init_heap","Now walk forwards with an empty heap of full lakes");let y=e=>{o.push(e),o.sort((e,a)=>e[0]-a[0])};for(let e=0;e<n;e++)if(l.add_conditional("is_rain",a[e]>0),l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_variable("i",e),a[e]>0){let i=a[e];if(l.update_variable("lake",i),l.add_conditional("is_full",f.includes(i)),l.record("rain_day",`Day ${e}: rain fills lake ${i}`),f.includes(i))return r[e]="X",l.update_variable("ansArr",r),l.update_variable("floodDay",e),l.delete_visual("ptr_i"),l.record("already_full",`Lake ${i} is still full from an earlier rain. Flood! Return []`),l.getSteps();f.push(i),r[e]=-1,l.add_conditional("has_next",s[e]<n),s[e]<n&&y([s[e],i]),l.update_variable("full",f),l.update_variable("heap",o),l.update_variable("ansArr",r),l.record("fill_lake",s[e]<n?`Lake ${i} is full and rains again on day ${s[e]}. Push it on the heap`:`Lake ${i} is full but never rains again, so it never needs draining`),l.delete_variable("lake")}else if(0===o.length)l.add_conditional("heap_empty",!0),r[e]=1,l.update_variable("ansArr",r),l.record("no_full_lake",`Day ${e}: no full lake rains again, so ans[${e}] = 1`);else{l.add_conditional("heap_empty",!1);let[a,n]=o.shift();f.splice(f.indexOf(n),1),r[e]=n,l.update_variable("heap",o),l.update_variable("full",f),l.update_variable("ansArr",r),l.update_variable("drained",n),l.record("drain_lake",`Lake ${n} rains again on day ${a}, the soonest of any full lake. Drain it today`),l.delete_variable("drained")}return l.delete_visual("ptr_i"),l.add_new_variable("result",r),l.record("complete",`No lake flooded. Return [${r.join(", ")}]`),l.getSteps()
}

export function AvoidFloodInTheCityProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AvoidFloodInTheCityTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAvoidFloodInTheCitySteps(e) as any[];
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
      title="Avoid Flood in The City"
      slug="avoid-flood-in-the-city"
      approaches={approaches}
      presets={AvoidFloodInTheCityPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Car Pooling (car-pooling)
// ==========================================

const CarPoolingTemplates = {
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean carPooling(int[][] trips, int capacity) {\n        // Create events: (location, passengerChange)\n        List<int[]> events = new ArrayList<>();\n        for (int[] trip : trips) {\n            events.add(new int[]{trip[1], trip[0]});   // pick-up\n            events.add(new int[]{trip[2], -trip[0]});   // drop-off\n        }\n\n        // Sort by location, then by passenger change (drop-offs before pick-ups)\n        events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n        int currentPassengers = 0;\n        for (int[] event : events) {\n            currentPassengers += event[1];\n            if (currentPassengers > capacity) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_events": [
        4,
        5,
        6,
        7
      ],
      "sort_events": [
        11
      ],
      "process_event": [
        14,
        15
      ],
      "check_capacity": [
        16
      ],
      "exceed": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        14
      ],
      "exceeds_capacity": [
        16
      ]
    }
  },
  "python": {
    "language": "python",
    "code": "class Solution:\n    def carPooling(self, trips: list[list[int]], capacity: int) -> bool:\n        # Create events: (location, passenger_change)\n        events = []\n        for num_passengers, start, end in trips:\n            events.append((start, num_passengers))    # pick-up\n            events.append((end, -num_passengers))      # drop-off\n\n        # Sort by location, then by passenger change (drop-offs before pick-ups)\n        events.sort()\n\n        current_passengers = 0\n        for location, change in events:\n            current_passengers += change\n            if current_passengers > capacity:\n                return False\n        return True",
    "lineMap": {
      "-": [
        2
      ],
      "create_events": [
        4,
        5,
        6,
        7
      ],
      "sort_events": [
        10
      ],
      "process_event": [
        13,
        14
      ],
      "check_capacity": [
        15
      ],
      "exceed": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "exceeds_capacity": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool carPooling(vector<vector<int>>& trips, int capacity) {\n        // Create events: (location, passengerChange)\n        vector<pair<int, int>> events;\n        for (auto& trip : trips) {\n            events.push_back({trip[1], trip[0]});    // pick-up\n            events.push_back({trip[2], -trip[0]});    // drop-off\n        }\n\n        // Sort by location, then by passenger change (drop-offs before pick-ups)\n        sort(events.begin(), events.end());\n\n        int currentPassengers = 0;\n        for (auto& event : events) {\n            currentPassengers += event.second;\n            if (currentPassengers > capacity) {\n                return false;\n            }\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "create_events": [
        5,
        6,
        7,
        8
      ],
      "sort_events": [
        12
      ],
      "process_event": [
        15,
        16
      ],
      "check_capacity": [
        17
      ],
      "exceed": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        15
      ],
      "exceeds_capacity": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var carPooling = function(trips, capacity) {\n    // Create events: [location, passengerChange]\n    const events = [];\n    for (const trip of trips) {\n        events.push([trip[1], trip[0]]);    // pick-up\n        events.push([trip[2], -trip[0]]);    // drop-off\n    }\n\n    // Sort by location, then by passenger change (drop-offs before pick-ups)\n    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n    let currentPassengers = 0;\n    for (const event of events) {\n        currentPassengers += event[1];\n        if (currentPassengers > capacity) {\n            return false;\n        }\n    }\n    return true;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "create_events": [
        3,
        4,
        5,
        6
      ],
      "sort_events": [
        10
      ],
      "process_event": [
        13,
        14
      ],
      "check_capacity": [
        15
      ],
      "exceed": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "exceeds_capacity": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function carPooling(trips: number[][], capacity: number): boolean {\n    // Create events: [location, passengerChange]\n    const events: number[][] = [];\n    for (const trip of trips) {\n        events.push([trip[1], trip[0]]);    // pick-up\n        events.push([trip[2], -trip[0]]);    // drop-off\n    }\n\n    // Sort by location, then by passenger change (drop-offs before pick-ups)\n    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n    let currentPassengers = 0;\n    for (const event of events) {\n        currentPassengers += event[1];\n        if (currentPassengers > capacity) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_events": [
        3,
        4,
        5,
        6
      ],
      "sort_events": [
        10
      ],
      "process_event": [
        13,
        14
      ],
      "check_capacity": [
        15
      ],
      "exceed": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "exceeds_capacity": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func carPooling(trips [][]int, capacity int) bool {\n    // Create events: [location, passengerChange]\n    events := make([][2]int, 0, len(trips)*2)\n    for _, trip := range trips {\n        events = append(events, [2]int{trip[1], trip[0]})    // pick-up\n        events = append(events, [2]int{trip[2], -trip[0]})   // drop-off\n    }\n\n    // Sort by location, then by passenger change (drop-offs before pick-ups)\n    sort.Slice(events, func(i, j int) bool {\n        if events[i][0] != events[j][0] {\n            return events[i][0] < events[j][0]\n        }\n        return events[i][1] < events[j][1]\n    })\n\n    currentPassengers := 0\n    for _, event := range events {\n        currentPassengers += event[1]\n        if currentPassengers > capacity {\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_events": [
        3,
        4,
        5,
        6
      ],
      "sort_events": [
        10,
        11,
        12,
        14
      ],
      "process_event": [
        18,
        19
      ],
      "check_capacity": [
        20
      ],
      "exceed": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        18
      ],
      "exceeds_capacity": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool CarPooling(int[][] trips, int capacity) {\n        // Create events: (location, passengerChange)\n        var events = new List<int[]>();\n        foreach (var trip in trips) {\n            events.Add(new int[]{trip[1], trip[0]});    // pick-up\n            events.Add(new int[]{trip[2], -trip[0]});    // drop-off\n        }\n\n        // Sort by location, then by passenger change (drop-offs before pick-ups)\n        events.Sort((a, b) => a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n        int currentPassengers = 0;\n        foreach (var ev in events) {\n            currentPassengers += ev[1];\n            if (currentPassengers > capacity) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_events": [
        4,
        5,
        6,
        7
      ],
      "sort_events": [
        11
      ],
      "process_event": [
        14,
        15
      ],
      "check_capacity": [
        16
      ],
      "exceed": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        14
      ],
      "exceeds_capacity": [
        16
      ]
    }
  }
};

const CarPoolingPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Exceeds capacity",
    "value": {
      "trips": [
        [
          2,
          1,
          5
        ],
        [
          3,
          3,
          7
        ]
      ],
      "capacity": 4
    }
  },
  {
    "id": "ex2",
    "label": "Just fits",
    "value": {
      "trips": [
        [
          2,
          1,
          5
        ],
        [
          3,
          3,
          7
        ]
      ],
      "capacity": 5
    }
  },
  {
    "id": "ex3",
    "label": "Sequential (fits)",
    "value": {
      "trips": [
        [
          2,
          1,
          5
        ],
        [
          3,
          5,
          7
        ]
      ],
      "capacity": 3
    }
  },
  {
    "id": "ex4",
    "label": "Multiple trips",
    "value": {
      "trips": [
        [
          3,
          2,
          7
        ],
        [
          3,
          7,
          9
        ],
        [
          8,
          3,
          9
        ]
      ],
      "capacity": 11
    }
  },
  {
    "id": "ex5",
    "label": "Single trip",
    "value": {
      "trips": [
        [
          1,
          1,
          2
        ]
      ],
      "capacity": 1
    }
  }
];

function generateCarPoolingSteps(e: any): any[] {
  
let t=[...e.trips].map(e=>[...e]),a=e.capacity,i=new StepRecorder({trips:t,capacity:a,delta:void 0,loc:void 0,currentPassengers:void 0,j:void 0,return:void 0},{}),n=(e,a)=>{let r={type:"range",start:t[e][1],end:t[e][2],label:`+${t[e][0]}`};return a&&(r.state=a),r};t.forEach((e,t)=>{i.add_new_visual(`trip_${t}`,n(t))}),i.add_new_visual("meta_passengers",{type:"metadata",value:0,label:"Passengers"}),i.add_new_visual("meta_capacity",{type:"metadata",value:a,label:"Capacity"}),i.add_new_visual("meta_result",{type:"metadata",value:"...",label:"Result"}),i.record("-","Start: Determine if all passengers can be picked up without exceeding capacity");let s=t.length>0?Math.max(...t.map(e=>e[2])):0,o=Array(s+1).fill(0);i.update_variable("delta",[...o]),i.record("init_delta",`Create the difference array (slots 0 to ${s})`);for(let e=0;e<t.length;e++){let[a,r,s]=t[e];i.add_conditional("build_loop",!0),i.update_variable("j",e),o[r]+=a,o[s]-=a,i.update_variable("delta",[...o]),i.update_visual(`trip_${e}`,n(e,"active")),i.record("mark_trip",`Trip [${r},${s}): delta[${r}] += ${a}, delta[${s}] -= ${a}`),i.update_visual(`trip_${e}`,n(e))}i.add_conditional("build_loop",!1);let c=0;i.update_variable("currentPassengers",c),i.update_variable("j",void 0);for(let e=0;e<=s;e++){if(i.add_conditional("sweep_loop",!0),c+=o[e],i.update_variable("loc",e),i.update_variable("currentPassengers",c),t.forEach((t,a)=>{i.update_visual(`trip_${a}`,n(a,t[1]<=e&&e<t[2]?"active":void 0))}),i.update_visual("meta_passengers",{type:"metadata",value:c,label:"Passengers"}),i.record("sweep",`Location ${e}: add delta[${e}] = ${o[e]}. Current = ${c}`),c>a)return i.add_conditional("exceeds_capacity",!0),i.update_visual("meta_result",{type:"metadata",value:"false",label:"Result"}),i.update_variable("return",!1),i.record("exceed",`${c} > capacity ${a} at location ${e}. Return false`),i.getSteps();i.add_conditional("exceeds_capacity",!1),i.record("check_capacity",`${c} <= capacity ${a}. OK`)}return i.add_conditional("sweep_loop",!1),i.update_variable("loc",void 0),i.update_visual("meta_result",{type:"metadata",value:"true",label:"Result"}),i.update_variable("return",!0),i.record("complete",`No location exceeds capacity (the running sum is zero past location ${s}). Return true`),i.getSteps()
}

export function CarPoolingProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CarPoolingTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCarPoolingSteps(e) as any[];
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
      title="Car Pooling"
      slug="car-pooling"
      approaches={approaches}
      presets={CarPoolingPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Heaters (heaters)
// ==========================================

const HeatersTemplates = {
  "python": {
    "language": "python",
    "code": "def findRadius(houses, heaters):\n    heaters.sort()\n    result = 0\n\n    for house in houses:\n        left, right = 0, len(heaters) - 1\n        idx = len(heaters)\n\n        while left <= right:\n            mid = left + (right - left) // 2\n\n            if heaters[mid] < house:\n                left = mid + 1\n            else:\n                idx = mid\n                right = mid - 1\n\n        left_dist = house - heaters[idx - 1] if idx > 0 else float('inf')\n        right_dist = heaters[idx] - house if idx < len(heaters) else float('inf')\n        closest_dist = min(left_dist, right_dist)\n        result = max(result, closest_dist)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        18,
        19,
        20
      ],
      "update_result": [
        21
      ],
      "final_result": [
        23
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findRadius(int[] houses, int[] heaters) {\n    Arrays.sort(heaters);\n    int result = 0;\n\n    for (int house : houses) {\n        int left = 0, right = heaters.length - 1;\n        int idx = heaters.length;\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n\n            if (heaters[mid] < house) {\n                left = mid + 1;\n            } else {\n                idx = mid;\n                right = mid - 1;\n            }\n        }\n\n        int leftDist = idx > 0 ? house - heaters[idx - 1] : Integer.MAX_VALUE;\n        int rightDist = idx < heaters.length ? heaters[idx] - house : Integer.MAX_VALUE;\n        int closestDist = Math.min(leftDist, rightDist);\n        result = Math.max(result, closestDist);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22
      ],
      "update_result": [
        23
      ],
      "final_result": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findRadius(vector<int>& houses, vector<int>& heaters) {\n    sort(heaters.begin(), heaters.end());\n    int result = 0;\n\n    for (int house : houses) {\n        int left = 0, right = heaters.size() - 1;\n        int idx = heaters.size();\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n\n            if (heaters[mid] < house) {\n                left = mid + 1;\n            } else {\n                idx = mid;\n                right = mid - 1;\n            }\n        }\n\n        int leftDist = idx > 0 ? house - heaters[idx - 1] : INT_MAX;\n        int rightDist = idx < heaters.size() ? heaters[idx] - house : INT_MAX;\n        int closestDist = min(leftDist, rightDist);\n        result = max(result, closestDist);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22
      ],
      "update_result": [
        23
      ],
      "final_result": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindRadius(int[] houses, int[] heaters) {\n    Array.Sort(heaters);\n    int result = 0;\n\n    foreach (int house in houses) {\n        int left = 0, right = heaters.Length - 1;\n        int idx = heaters.Length;\n\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n\n            if (heaters[mid] < house) {\n                left = mid + 1;\n            } else {\n                idx = mid;\n                right = mid - 1;\n            }\n        }\n\n        int leftDist = idx > 0 ? house - heaters[idx - 1] : int.MaxValue;\n        int rightDist = idx < heaters.Length ? heaters[idx] - house : int.MaxValue;\n        int closestDist = Math.Min(leftDist, rightDist);\n        result = Math.Max(result, closestDist);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22
      ],
      "update_result": [
        23
      ],
      "final_result": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findRadius(houses []int, heaters []int) int {\n    sort.Ints(heaters)\n    result := 0\n\n    for _, house := range houses {\n        left, right := 0, len(heaters)-1\n        idx := len(heaters)\n\n        for left <= right {\n            mid := left + (right - left) / 2\n\n            if heaters[mid] < house {\n                left = mid + 1\n            } else {\n                idx = mid\n                right = mid - 1\n            }\n        }\n\n        leftDist := math.MaxInt32\n        if idx > 0 {\n            leftDist = house - heaters[idx-1]\n        }\n        rightDist := math.MaxInt32\n        if idx < len(heaters) {\n            rightDist = heaters[idx] - house\n        }\n        closestDist := min(leftDist, rightDist)\n        result = max(result, closestDist)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22,
        24,
        25,
        26,
        28
      ],
      "update_result": [
        29
      ],
      "final_result": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findRadius(houses, heaters) {\n    heaters.sort((a, b) => a - b);\n    let result = 0;\n\n    for (const house of houses) {\n        let left = 0, right = heaters.length - 1;\n        let idx = heaters.length;\n\n        while (left <= right) {\n            const mid = Math.floor(left + (right - left) / 2);\n\n            if (heaters[mid] < house) {\n                left = mid + 1;\n            } else {\n                idx = mid;\n                right = mid - 1;\n            }\n        }\n\n        const leftDist = idx > 0 ? house - heaters[idx - 1] : Infinity;\n        const rightDist = idx < heaters.length ? heaters[idx] - house : Infinity;\n        const closestDist = Math.min(leftDist, rightDist);\n        result = Math.max(result, closestDist);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22
      ],
      "update_result": [
        23
      ],
      "final_result": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findRadius(houses: number[], heaters: number[]): number {\n    heaters.sort((a, b) => a - b);\n    let result = 0;\n\n    for (const house of houses) {\n        let left = 0, right = heaters.length - 1;\n        let idx = heaters.length;\n\n        while (left <= right) {\n            const mid = Math.floor(left + (right - left) / 2);\n\n            if (heaters[mid] < house) {\n                left = mid + 1;\n            } else {\n                idx = mid;\n                right = mid - 1;\n            }\n        }\n\n        const leftDist = idx > 0 ? house - heaters[idx - 1] : Infinity;\n        const rightDist = idx < heaters.length ? heaters[idx] - house : Infinity;\n        const closestDist = Math.min(leftDist, rightDist);\n        result = Math.max(result, closestDist);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_heaters": [
        2
      ],
      "select_house": [
        5
      ],
      "binary_search": [
        6,
        7
      ],
      "calculate_mid": [
        10
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15,
        16
      ],
      "compute_distances": [
        20,
        21,
        22
      ],
      "update_result": [
        23
      ],
      "final_result": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ]
    }
  }
};

const HeatersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "houses": [
        1,
        2,
        3
      ],
      "heaters": [
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple heaters",
    "value": {
      "houses": [
        1,
        2,
        3,
        4
      ],
      "heaters": [
        1,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Far apart",
    "value": {
      "houses": [
        1,
        5
      ],
      "heaters": [
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Exact coverage",
    "value": {
      "houses": [
        1,
        2,
        3,
        4,
        5
      ],
      "heaters": [
        1,
        3,
        5
      ]
    }
  }
];

function generateHeatersSteps(e: any): any[] {
  
let t=[...e.houses],a=[...e.heaters].sort((e,t)=>e-t),i={};t.forEach((e,t)=>{i[`house_${t}`]={type:"arrayElement",value:e,position:t}}),e.heaters.forEach((e,t)=>{i[`heater_${t}`]={type:"arrayElement",value:e,position:t}});let r=new StepRecorder({},i);r.record("-","Start: Find minimum radius so every house is covered by at least one heater"),a.forEach((e,t)=>{r.update_visual(`heater_${t}`,{type:"arrayElement",value:e,position:t})});for(let t=a.length;t<e.heaters.length;t++)r.delete_visual(`heater_${t}`);r.record("sort_heaters",`Sort heaters: [${a.join(", ")}]`);let l=0;r.add_new_visual("meta_result",{type:"metadata",value:`result = ${l}`});for(let e=0;e<t.length;e++){let s=t[e];for(let a=0;a<t.length;a++)r.update_visual(`house_${a}`,{type:"arrayElement",value:t[a],position:a,state:a===e?"highlight":a<e?"active":void 0});for(let e=0;e<a.length;e++)r.update_visual(`heater_${e}`,{type:"arrayElement",value:a[e],position:e,state:void 0});0===e?r.add_new_visual("ptr_current_house",{type:"pointer",position:e,label:"house"}):r.update_visual("ptr_current_house",{type:"pointer",position:e,label:"house"}),r.record("select_house",`Process house ${s}`);let i=0,n=a.length-1;0===e?(r.add_new_visual("ptr_left",{type:"pointer",position:i,label:"left"}),r.add_new_visual("ptr_right",{type:"pointer",position:n,label:"right"})):(r.update_visual("ptr_left",{type:"pointer",position:i,label:"left"}),r.update_visual("ptr_right",{type:"pointer",position:n,label:"right"})),r.record("binary_search",`Binary search for house ${s} in heaters`);let o=a.length;for(;i<=n;){r.add_conditional("while_loop",!0);let e=i+Math.floor((n-i)/2);if(r.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),r.update_visual(`heater_${e}`,{type:"arrayElement",value:a[e],position:e,state:"highlight"}),r.record("calculate_mid",`mid = ${e}, heaters[mid] = ${a[e]}`),a[e]<s){i=e+1,r.update_visual("ptr_left",{type:"pointer",position:i,label:"left"});for(let t=0;t<=e;t++)r.update_visual(`heater_${t}`,{type:"arrayElement",value:a[t],position:t,state:"inactive"});r.delete_visual("ptr_mid"),r.record("search_right",`heaters[${e}] = ${a[e]} < ${s}, search right: left = ${i}`)}else{o=e,n=e-1,r.update_visual("ptr_right",{type:"pointer",position:n,label:"right"});for(let t=e+1;t<a.length;t++)r.update_visual(`heater_${t}`,{type:"arrayElement",value:a[t],position:t,state:"inactive"});r.delete_visual("ptr_mid"),r.record("search_left",`heaters[${e}] = ${a[e]} >= ${s}, search left: right = ${n}, idx = ${e}`)}}r.add_conditional("while_loop",!1),r.delete_visual("ptr_left"),r.delete_visual("ptr_right");let h=o>0?s-a[o-1]:1/0,u=o<a.length?a[o]-s:1/0,d=Math.min(h,u);for(let e=0;e<a.length;e++){let t;o<a.length&&e===o&&u<=h?t="active":o>0&&e===o-1&&h<u&&(t="active"),r.update_visual(`heater_${e}`,{type:"arrayElement",value:a[e],position:e,state:t})}let c=h===1/0?"∞":String(h),p=u===1/0?"∞":String(u);r.add_new_visual("meta_distances",{type:"metadata",value:`leftDist = ${c}, rightDist = ${p}, closestDist = ${d}`}),r.record("compute_distances",`leftDist = ${c}, rightDist = ${p}, closestDist = ${d}`);let f=l;l=Math.max(l,d),r.update_visual("meta_result",{type:"metadata",value:`result = ${l}`}),r.delete_visual("meta_distances"),r.record("update_result",`result = max(${f}, ${d}) = ${l}`)}for(let e=0;e<t.length;e++)r.update_visual(`house_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});for(let e=0;e<a.length;e++)r.update_visual(`heater_${e}`,{type:"arrayElement",value:a[e],position:e,state:"active"});return r.delete_visual("ptr_current_house"),r.record("final_result",`Minimum radius = ${l}`),r.getSteps()
}

export function HeatersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HeatersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateHeatersSteps(e) as any[];
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
      title="Heaters"
      slug="heaters"
      approaches={approaches}
      presets={HeatersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Interval List Intersections (interval-list-intersections)
// ==========================================

const IntervalListIntersectionsTemplates = {
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {\n        List<int[]> result = new ArrayList<>();\n        int i = 0, j = 0;\n\n        while (i < firstList.length && j < secondList.length) {\n            // Find the overlap boundaries\n            int lo = Math.max(firstList[i][0], secondList[j][0]);\n            int hi = Math.min(firstList[i][1], secondList[j][1]);\n\n            if (lo <= hi) {\n                result.add(new int[]{lo, hi});\n            }\n\n            // Advance the pointer whose interval ends first\n            if (firstList[i][1] < secondList[j][1]) {\n                i++;\n            } else {\n                j++;\n            }\n        }\n        return result.toArray(new int[result.size()][]);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compare": [
        8,
        9
      ],
      "intersect": [
        12
      ],
      "no_intersect": [
        11
      ],
      "advance_i": [
        17
      ],
      "advance_j": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "has_intersection": [
        11
      ],
      "advance_check": [
        16
      ]
    }
  },
  "python": {
    "language": "python",
    "code": "class Solution:\n    def intervalIntersection(self, firstList: list[list[int]], secondList: list[list[int]]) -> list[list[int]]:\n        result = []\n        i, j = 0, 0\n\n        while i < len(firstList) and j < len(secondList):\n            # Find the overlap boundaries\n            lo = max(firstList[i][0], secondList[j][0])\n            hi = min(firstList[i][1], secondList[j][1])\n\n            if lo <= hi:\n                result.append([lo, hi])\n\n            # Advance the pointer whose interval ends first\n            if firstList[i][1] < secondList[j][1]:\n                i += 1\n            else:\n                j += 1\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "compare": [
        8,
        9
      ],
      "intersect": [
        12
      ],
      "no_intersect": [
        11
      ],
      "advance_i": [
        16
      ],
      "advance_j": [
        18
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "has_intersection": [
        11
      ],
      "advance_check": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {\n        vector<vector<int>> result;\n        int i = 0, j = 0;\n\n        while (i < firstList.size() && j < secondList.size()) {\n            // Find the overlap boundaries\n            int lo = max(firstList[i][0], secondList[j][0]);\n            int hi = min(firstList[i][1], secondList[j][1]);\n\n            if (lo <= hi) {\n                result.push_back({lo, hi});\n            }\n\n            // Advance the pointer whose interval ends first\n            if (firstList[i][1] < secondList[j][1]) {\n                i++;\n            } else {\n                j++;\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "compare": [
        9,
        10
      ],
      "intersect": [
        13
      ],
      "no_intersect": [
        12
      ],
      "advance_i": [
        18
      ],
      "advance_j": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "has_intersection": [
        12
      ],
      "advance_check": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var intervalIntersection = function(firstList, secondList) {\n    var result = [];\n    var i = 0, j = 0;\n\n    while (i < firstList.length && j < secondList.length) {\n        // Find the overlap boundaries\n        var lo = Math.max(firstList[i][0], secondList[j][0]);\n        var hi = Math.min(firstList[i][1], secondList[j][1]);\n\n        if (lo <= hi) {\n            result.push([lo, hi]);\n        }\n\n        // Advance the pointer whose interval ends first\n        if (firstList[i][1] < secondList[j][1]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        7,
        8
      ],
      "intersect": [
        11
      ],
      "no_intersect": [
        10
      ],
      "advance_i": [
        16
      ],
      "advance_j": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "has_intersection": [
        10
      ],
      "advance_check": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function intervalIntersection(firstList: number[][], secondList: number[][]): number[][] {\n    const result: number[][] = [];\n    let i = 0, j = 0;\n\n    while (i < firstList.length && j < secondList.length) {\n        // Find the overlap boundaries\n        const lo = Math.max(firstList[i][0], secondList[j][0]);\n        const hi = Math.min(firstList[i][1], secondList[j][1]);\n\n        if (lo <= hi) {\n            result.push([lo, hi]);\n        }\n\n        // Advance the pointer whose interval ends first\n        if (firstList[i][1] < secondList[j][1]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        7,
        8
      ],
      "intersect": [
        11
      ],
      "no_intersect": [
        10
      ],
      "advance_i": [
        16
      ],
      "advance_j": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "has_intersection": [
        10
      ],
      "advance_check": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func intervalIntersection(firstList [][]int, secondList [][]int) [][]int {\n    result := [][]int{}\n    i, j := 0, 0\n\n    for i < len(firstList) && j < len(secondList) {\n        // Find the overlap boundaries\n        lo := max(firstList[i][0], secondList[j][0])\n        hi := min(firstList[i][1], secondList[j][1])\n\n        if lo <= hi {\n            result = append(result, []int{lo, hi})\n        }\n\n        // Advance the pointer whose interval ends first\n        if firstList[i][1] < secondList[j][1] {\n            i++\n        } else {\n            j++\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compare": [
        7,
        8
      ],
      "intersect": [
        11
      ],
      "no_intersect": [
        10
      ],
      "advance_i": [
        16
      ],
      "advance_j": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "has_intersection": [
        10
      ],
      "advance_check": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[][] IntervalIntersection(int[][] firstList, int[][] secondList) {\n        List<int[]> result = new List<int[]>();\n        int i = 0, j = 0;\n\n        while (i < firstList.Length && j < secondList.Length) {\n            // Find the overlap boundaries\n            int lo = Math.Max(firstList[i][0], secondList[j][0]);\n            int hi = Math.Min(firstList[i][1], secondList[j][1]);\n\n            if (lo <= hi) {\n                result.Add(new int[]{lo, hi});\n            }\n\n            // Advance the pointer whose interval ends first\n            if (firstList[i][1] < secondList[j][1]) {\n                i++;\n            } else {\n                j++;\n            }\n        }\n        return result.ToArray();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compare": [
        8,
        9
      ],
      "intersect": [
        12
      ],
      "no_intersect": [
        11
      ],
      "advance_i": [
        17
      ],
      "advance_j": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "has_intersection": [
        11
      ],
      "advance_check": [
        16
      ]
    }
  }
};

const IntervalListIntersectionsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "firstList": [
        [
          0,
          2
        ],
        [
          5,
          10
        ],
        [
          13,
          23
        ],
        [
          24,
          25
        ]
      ],
      "secondList": [
        [
          1,
          5
        ],
        [
          8,
          12
        ],
        [
          15,
          24
        ],
        [
          25,
          26
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "One empty",
    "value": {
      "firstList": [
        [
          1,
          3
        ],
        [
          5,
          9
        ]
      ],
      "secondList": []
    }
  },
  {
    "id": "ex3",
    "label": "Single overlap",
    "value": {
      "firstList": [
        [
          1,
          7
        ]
      ],
      "secondList": [
        [
          3,
          10
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All overlap",
    "value": {
      "firstList": [
        [
          1,
          3
        ],
        [
          5,
          7
        ]
      ],
      "secondList": [
        [
          2,
          4
        ],
        [
          6,
          8
        ]
      ]
    }
  }
];

function generateIntervalListIntersectionsSteps(t: any): any[] {
  
let e=[...t.firstList].map(t=>[...t]),i=[...t.secondList].map(t=>[...t]),s=new StepRecorder({firstList:e,secondList:i,result:void 0,i:void 0,j:void 0,lo:void 0,hi:void 0},{});if(e.forEach((t,e)=>{s.add_new_visual(`first_${e}`,{type:"range",start:t[0],end:t[1],label:`[${t[0]},${t[1]}]`})}),i.forEach((t,e)=>{s.add_new_visual(`second_${e}`,{type:"range",start:t[0],end:t[1],label:`[${t[0]},${t[1]}]`})}),s.record("-","Start: Find intersections of two interval lists"),0===e.length||0===i.length)return s.update_variable("result",[]),s.record("complete","One list is empty, no intersections possible. Result: []"),s.getSteps();let r=[],a=0,o=0;for(s.update_variable("result",r),s.update_variable("i",a),s.update_variable("j",o);a<e.length&&o<i.length;){s.add_conditional("while_loop",!0),s.update_visual(`first_${a}`,{type:"range",start:e[a][0],end:e[a][1],label:`[${e[a][0]},${e[a][1]}]`,state:"active"}),s.update_visual(`second_${o}`,{type:"range",start:i[o][0],end:i[o][1],label:`[${i[o][0]},${i[o][1]}]`,state:"active"});let t=Math.max(e[a][0],i[o][0]),n=Math.min(e[a][1],i[o][1]);s.update_variable("lo",t),s.update_variable("hi",n),s.record("compare",`Compare firstList[${a}]=[${e[a][0]},${e[a][1]}] and secondList[${o}]=[${i[o][0]},${i[o][1]}]: lo=max(${e[a][0]},${i[o][0]})=${t}, hi=min(${e[a][1]},${i[o][1]})=${n}`),t<=n?(s.add_conditional("has_intersection",!0),r.push([t,n]),s.update_variable("result",r),s.add_new_visual(`result_${r.length-1}`,{type:"range",start:t,end:n,label:`[${t},${n}]`,state:"active"}),s.record("intersect",`lo(${t}) <= hi(${n}), intersection found! Add [${t},${n}] to result`)):(s.add_conditional("has_intersection",!1),s.record("no_intersect",`lo(${t}) > hi(${n}), no intersection`)),e[a][1]<i[o][1]?(s.add_conditional("advance_check",!0),s.update_visual(`first_${a}`,{type:"range",start:e[a][0],end:e[a][1],label:`[${e[a][0]},${e[a][1]}]`,state:"inactive"}),s.update_visual(`second_${o}`,{type:"range",start:i[o][0],end:i[o][1],label:`[${i[o][0]},${i[o][1]}]`}),a++,s.update_variable("i",a),s.record("advance_i",`firstList[${a-1}] ends first (${e[a-1][1]} < ${i[o][1]}), advance i to ${a}`)):(s.add_conditional("advance_check",!1),s.update_visual(`second_${o}`,{type:"range",start:i[o][0],end:i[o][1],label:`[${i[o][0]},${i[o][1]}]`,state:"inactive"}),s.update_visual(`first_${a}`,{type:"range",start:e[a][0],end:e[a][1],label:`[${e[a][0]},${e[a][1]}]`}),o++,s.update_variable("j",o),s.record("advance_j",`secondList[${o-1}] ends first or equal (${i[o-1][1]} <= ${e[a][1]}), advance j to ${o}`))}s.add_conditional("while_loop",!1);for(let t=0;t<e.length;t++)s.update_visual(`first_${t}`,{type:"range",start:e[t][0],end:e[t][1],label:`[${e[t][0]},${e[t][1]}]`,state:"inactive"});for(let t=0;t<i.length;t++)s.update_visual(`second_${t}`,{type:"range",start:i[t][0],end:i[t][1],label:`[${i[t][0]},${i[t][1]}]`,state:"inactive"});for(let t=0;t<r.length;t++)s.update_visual(`result_${t}`,{type:"range",start:r[t][0],end:r[t][1],label:`[${r[t][0]},${r[t][1]}]`});return s.update_variable("lo",void 0),s.update_variable("hi",void 0),s.record("complete",`Intersections: ${JSON.stringify(r)}`),s.getSteps()
}

export function IntervalListIntersectionsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IntervalListIntersectionsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateIntervalListIntersectionsSteps(t) as any[];
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
      title="Interval List Intersections"
      slug="interval-list-intersections"
      approaches={approaches}
      presets={IntervalListIntersectionsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Meeting Rooms (meeting-rooms)
// ==========================================

const MeetingRoomsTemplates = {
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean canAttendMeetings(int[][] intervals) {\n        // Sort meetings by start time\n        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n\n        // Check consecutive meetings for overlap\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < intervals[i - 1][1]) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        7
      ],
      "overlap": [
        9
      ],
      "no_overlap": [
        7
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "overlap_check": [
        8
      ]
    }
  },
  "python": {
    "language": "python",
    "code": "class Solution:\n    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:\n        # Sort meetings by start time\n        intervals.sort(key=lambda x: x[0])\n\n        # Check consecutive meetings for overlap\n        for i in range(1, len(intervals)):\n            if intervals[i][0] < intervals[i - 1][1]:\n                return False\n        return True",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        7
      ],
      "overlap": [
        9
      ],
      "no_overlap": [
        7
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "overlap_check": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool canAttendMeetings(vector<vector<int>>& intervals) {\n        // Sort meetings by start time\n        sort(intervals.begin(), intervals.end());\n\n        // Check consecutive meetings for overlap\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] < intervals[i - 1][1]) {\n                return false;\n            }\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "sort": [
        5
      ],
      "check": [
        8
      ],
      "overlap": [
        10
      ],
      "no_overlap": [
        8
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "overlap_check": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var canAttendMeetings = function(intervals) {\n    // Sort meetings by start time\n    intervals.sort((a, b) => a[0] - b[0]);\n\n    // Check consecutive meetings for overlap\n    for (let i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] < intervals[i - 1][1]) {\n            return false;\n        }\n    }\n    return true;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "check": [
        6
      ],
      "overlap": [
        8
      ],
      "no_overlap": [
        6
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "overlap_check": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canAttendMeetings(intervals: number[][]): boolean {\n    // Sort meetings by start time\n    intervals.sort((a, b) => a[0] - b[0]);\n\n    // Check consecutive meetings for overlap\n    for (let i = 1; i < intervals.length; i++) {\n        if (intervals[i][0] < intervals[i - 1][1]) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "check": [
        6
      ],
      "overlap": [
        8
      ],
      "no_overlap": [
        6
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "overlap_check": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canAttendMeetings(intervals [][]int) bool {\n    // Sort meetings by start time\n    sort.Slice(intervals, func(i, j int) bool {\n        return intervals[i][0] < intervals[j][0]\n    })\n\n    // Check consecutive meetings for overlap\n    for i := 1; i < len(intervals); i++ {\n        if intervals[i][0] < intervals[i-1][1] {\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3,
        4,
        5
      ],
      "check": [
        8
      ],
      "overlap": [
        10
      ],
      "no_overlap": [
        8
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "overlap_check": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool CanAttendMeetings(int[][] intervals) {\n        // Sort meetings by start time\n        Array.Sort(intervals, (a, b) => a[0] - b[0]);\n\n        // Check consecutive meetings for overlap\n        for (int i = 1; i < intervals.Length; i++) {\n            if (intervals[i][0] < intervals[i - 1][1]) {\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        7
      ],
      "overlap": [
        9
      ],
      "no_overlap": [
        7
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "overlap_check": [
        8
      ]
    }
  }
};

const MeetingRoomsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Has overlap",
    "value": {
      "intervals": [
        [
          0,
          30
        ],
        [
          5,
          10
        ],
        [
          15,
          20
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "No overlap",
    "value": {
      "intervals": [
        [
          7,
          10
        ],
        [
          2,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Adjacent (no overlap)",
    "value": {
      "intervals": [
        [
          1,
          5
        ],
        [
          5,
          10
        ],
        [
          10,
          15
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Overlap at start",
    "value": {
      "intervals": [
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          5,
          7
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single meeting",
    "value": {
      "intervals": [
        [
          1,
          2
        ]
      ]
    }
  }
];

function generateMeetingRoomsSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),a=new StepRecorder({intervals:t,i:void 0,canAttend:void 0},{});if(0===t.length)return a.add_new_visual("result",{type:"metadata",value:!0}),a.record("complete","No meetings, can attend all (vacuously true)"),a.getSteps();if(t.forEach((e,t)=>{a.add_new_visual(`input_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),a.record("-","Start: Check if a person can attend all meetings"),t.sort((e,t)=>e[0]-t[0]),a.update_variable("intervals",t),t.forEach((e,t)=>{a.update_visual(`input_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),a.record("sort",`Sort intervals by start time: ${JSON.stringify(t)}`),1===t.length)return a.update_visual("input_0",{type:"range",start:t[0][0],end:t[0][1],label:`[${t[0][0]},${t[0][1]}]`,state:"visited"}),a.update_variable("canAttend",!0),a.add_new_visual("result",{type:"metadata",value:!0}),a.record("complete","Only one meeting. Can attend all meetings. Return true."),a.getSteps();for(let e=1;e<t.length;e++){if(a.add_conditional("for_loop",!0),a.update_variable("i",e),a.update_visual(`input_${e-1}`,{type:"range",start:t[e-1][0],end:t[e-1][1],label:`[${t[e-1][0]},${t[e-1][1]}]`,state:"active"}),a.update_visual(`input_${e}`,{type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`,state:"active"}),a.record("check",`Compare meetings ${e-1} and ${e}: does [${t[e][0]},${t[e][1]}] start before [${t[e-1][0]},${t[e-1][1]}] ends?`),t[e][0]<t[e-1][1])return a.add_conditional("overlap_check",!0),a.update_visual(`input_${e-1}`,{type:"range",start:t[e-1][0],end:t[e-1][1],label:`[${t[e-1][0]},${t[e-1][1]}]`,state:"overlap"}),a.update_visual(`input_${e}`,{type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`,state:"overlap"}),a.update_variable("canAttend",!1),a.add_new_visual("result",{type:"metadata",value:!1}),a.record("overlap",`Overlap! Meeting ${e} starts at ${t[e][0]}, before meeting ${e-1} ends at ${t[e-1][1]}. Return false.`),a.getSteps();a.add_conditional("overlap_check",!1),a.update_visual(`input_${e-1}`,{type:"range",start:t[e-1][0],end:t[e-1][1],label:`[${t[e-1][0]},${t[e-1][1]}]`,state:"visited"}),a.record("no_overlap",`No overlap: meeting ${e} starts at ${t[e][0]}, after meeting ${e-1} ends at ${t[e-1][1]}. Continue.`)}return a.add_conditional("for_loop",!1),a.update_visual(`input_${t.length-1}`,{type:"range",start:t[t.length-1][0],end:t[t.length-1][1],label:`[${t[t.length-1][0]},${t[t.length-1][1]}]`,state:"visited"}),a.update_variable("canAttend",!0),a.add_new_visual("result",{type:"metadata",value:!0}),a.record("complete","No overlaps found. Can attend all meetings. Return true."),a.getSteps()
}

export function MeetingRoomsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MeetingRoomsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMeetingRoomsSteps(e) as any[];
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
      title="Meeting Rooms"
      slug="meeting-rooms"
      approaches={approaches}
      presets={MeetingRoomsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Meeting Rooms II (meeting-rooms-ii)
// ==========================================

const MeetingRoomsIiTemplates = {
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int minMeetingRooms(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n\n        // Sort by start time\n        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n\n        // Min-heap to track end times of ongoing meetings\n        PriorityQueue<Integer> heap = new PriorityQueue<>();\n        heap.offer(intervals[0][1]);\n\n        for (int i = 1; i < intervals.length; i++) {\n            // If the earliest-ending meeting is done, reuse that room\n            if (intervals[i][0] >= heap.peek()) {\n                heap.poll();\n            }\n            // Allocate a room (new or reused) for this meeting\n            heap.offer(intervals[i][1]);\n        }\n        return heap.size();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        3
      ],
      "sort": [
        6
      ],
      "init_heap": [
        9,
        10
      ],
      "check_reuse": [
        14
      ],
      "reuse_room": [
        15
      ],
      "allocate": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "can_reuse": [
        14
      ]
    }
  },
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minMeetingRooms(self, intervals: list[list[int]]) -> int:\n        if not intervals:\n            return 0\n\n        # Sort by start time\n        intervals.sort(key=lambda x: x[0])\n\n        # Min-heap to track end times of ongoing meetings\n        heap = [intervals[0][1]]\n\n        for i in range(1, len(intervals)):\n            # If the earliest-ending meeting is done, reuse that room\n            if intervals[i][0] >= heap[0]:\n                heapq.heappop(heap)\n            # Allocate a room (new or reused) for this meeting\n            heapq.heappush(heap, intervals[i][1])\n\n        return len(heap)",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        3,
        4
      ],
      "sort": [
        7
      ],
      "init_heap": [
        10
      ],
      "check_reuse": [
        14
      ],
      "reuse_room": [
        15
      ],
      "allocate": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "can_reuse": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int minMeetingRooms(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return 0;\n\n        // Sort by start time\n        sort(intervals.begin(), intervals.end());\n\n        // Min-heap to track end times of ongoing meetings\n        priority_queue<int, vector<int>, greater<int>> heap;\n        heap.push(intervals[0][1]);\n\n        for (int i = 1; i < intervals.size(); i++) {\n            // If the earliest-ending meeting is done, reuse that room\n            if (intervals[i][0] >= heap.top()) {\n                heap.pop();\n            }\n            // Allocate a room (new or reused) for this meeting\n            heap.push(intervals[i][1]);\n        }\n        return heap.size();\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "invalid_input": [
        4
      ],
      "sort": [
        7
      ],
      "init_heap": [
        10,
        11
      ],
      "check_reuse": [
        15
      ],
      "reuse_room": [
        16
      ],
      "allocate": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "can_reuse": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minMeetingRooms = function (intervals) {\n  if (intervals.length === 0) return 0;\n\n  // Sort by start time\n  intervals.sort((a, b) => a[0] - b[0]);\n\n  // Use a sorted array to simulate a min-heap of end times\n  const endTimes = [intervals[0][1]];\n\n  const insertSorted = (arr, val) => {\n    let lo = 0, hi = arr.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (arr[mid] < val) lo = mid + 1;\n      else hi = mid;\n    }\n    arr.splice(lo, 0, val);\n  };\n\n  for (let i = 1; i < intervals.length; i++) {\n    // If the earliest-ending meeting is done, reuse that room\n    if (intervals[i][0] >= endTimes[0]) {\n      endTimes.shift();\n    }\n    // Allocate a room (new or reused) for this meeting\n    insertSorted(endTimes, intervals[i][1]);\n  }\n  return endTimes.length;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        2
      ],
      "sort": [
        5
      ],
      "init_heap": [
        8
      ],
      "check_reuse": [
        22
      ],
      "reuse_room": [
        23
      ],
      "allocate": [
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        20
      ],
      "can_reuse": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minMeetingRooms(intervals: number[][]): number {\n    if (intervals.length === 0) return 0;\n\n    // Sort by start time\n    intervals.sort((a, b) => a[0] - b[0]);\n\n    // Use a sorted array to simulate a min-heap of end times\n    const endTimes: number[] = [intervals[0][1]];\n\n    const insertSorted = (arr: number[], val: number): void => {\n        let lo = 0, hi = arr.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (arr[mid] < val) lo = mid + 1;\n            else hi = mid;\n        }\n        arr.splice(lo, 0, val);\n    };\n\n    for (let i = 1; i < intervals.length; i++) {\n        // If the earliest-ending meeting is done, reuse that room\n        if (intervals[i][0] >= endTimes[0]) {\n            endTimes.shift();\n        }\n        // Allocate a room (new or reused) for this meeting\n        insertSorted(endTimes, intervals[i][1]);\n    }\n    return endTimes.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        2
      ],
      "sort": [
        5
      ],
      "init_heap": [
        8
      ],
      "check_reuse": [
        22
      ],
      "reuse_room": [
        23
      ],
      "allocate": [
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        20
      ],
      "can_reuse": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minMeetingRooms(intervals [][]int) int {\n    if len(intervals) == 0 {\n        return 0\n    }\n\n    // Sort by start time\n    sort.Slice(intervals, func(i, j int) bool {\n        return intervals[i][0] < intervals[j][0]\n    })\n\n    // Min-heap to track end times of ongoing meetings\n    h := &IntHeap{intervals[0][1]}\n    heap.Init(h)\n\n    for i := 1; i < len(intervals); i++ {\n        // If the earliest-ending meeting is done, reuse that room\n        if intervals[i][0] >= (*h)[0] {\n            heap.Pop(h)\n        }\n        // Allocate a room (new or reused) for this meeting\n        heap.Push(h, intervals[i][1])\n    }\n    return h.Len()\n}\n\ntype IntHeap []int\nfunc (h IntHeap) Len() int            { return len(h) }\nfunc (h IntHeap) Less(i, j int) bool  { return h[i] < h[j] }\nfunc (h IntHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }\nfunc (h *IntHeap) Push(x interface{}) { *h = append(*h, x.(int)) }\nfunc (h *IntHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "invalid_input": [
        2,
        3
      ],
      "sort": [
        7,
        8,
        9
      ],
      "init_heap": [
        12,
        13
      ],
      "check_reuse": [
        17
      ],
      "reuse_room": [
        18
      ],
      "allocate": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        15
      ],
      "can_reuse": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MinMeetingRooms(int[][] intervals) {\n        if (intervals.Length == 0) return 0;\n\n        // Sort by start time\n        Array.Sort(intervals, (a, b) => a[0] - b[0]);\n\n        // Min-heap to track end times of ongoing meetings\n        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();\n        heap.Enqueue(intervals[0][1], intervals[0][1]);\n\n        for (int i = 1; i < intervals.Length; i++) {\n            // If the earliest-ending meeting is done, reuse that room\n            if (intervals[i][0] >= heap.Peek()) {\n                heap.Dequeue();\n            }\n            // Allocate a room (new or reused) for this meeting\n            heap.Enqueue(intervals[i][1], intervals[i][1]);\n        }\n        return heap.Count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "invalid_input": [
        3
      ],
      "sort": [
        6
      ],
      "init_heap": [
        9,
        10
      ],
      "check_reuse": [
        14
      ],
      "reuse_room": [
        15
      ],
      "allocate": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "can_reuse": [
        14
      ]
    }
  }
};

const MeetingRoomsIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (2 rooms)",
    "value": {
      "intervals": [
        [
          0,
          30
        ],
        [
          5,
          10
        ],
        [
          15,
          20
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "No overlap (1 room)",
    "value": {
      "intervals": [
        [
          7,
          10
        ],
        [
          2,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Sequential (1 room)",
    "value": {
      "intervals": [
        [
          0,
          5
        ],
        [
          5,
          10
        ],
        [
          10,
          15
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All overlap (4 rooms)",
    "value": {
      "intervals": [
        [
          1,
          5
        ],
        [
          2,
          6
        ],
        [
          3,
          7
        ],
        [
          4,
          8
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Partial overlap (2 rooms)",
    "value": {
      "intervals": [
        [
          1,
          3
        ],
        [
          2,
          4
        ],
        [
          3,
          5
        ]
      ]
    }
  }
];

function generateMeetingRoomsIiSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),n=new StepRecorder({intervals:t,starts:void 0,ends:void 0,startPtr:void 0,endPtr:void 0,rooms:void 0},{});if(0===t.length)return n.record("invalid_input","Invalid input"),n.getSteps();let r=(e,n)=>{let i={type:"range",start:t[e][0],end:t[e][1],label:`[${t[e][0]},${t[e][1]}]`};return n&&(i.state=n),i};t.forEach((e,t)=>{n.add_new_visual(`interval_${t}`,r(t))}),n.record("-","Start: find the minimum number of rooms for all meetings");let a=t.length,o=t.map(e=>e[0]).sort((e,t)=>e-t),l=t.map(e=>e[1]).sort((e,t)=>e-t);n.update_variable("starts",[...o]),n.update_variable("ends",[...l]),n.record("build_arrays","Sort the start and end times separately");let s=0,d=0;n.update_variable("rooms",s),n.update_variable("endPtr",d),n.record("initialize","rooms = 0, endPtr = 0");let m=[],c=e=>{t.forEach((t,i)=>{let a=m.includes(i)?"occupied":void 0!==e&&i===e?"active":void 0;n.update_visual(`interval_${i}`,r(i,a))})};for(let e=0;e<a;e++){n.add_conditional("for_loop",!0),n.update_variable("startPtr",e);let i=t.findIndex((t,n)=>t[0]===o[e]&&!m.includes(n));if(c(i),n.record("compare",`Compare start ${o[e]} with the next end ${l[d]}`),o[e]<l[d])n.add_conditional("needs_room",!0),s++,i>=0&&m.push(i),n.update_variable("rooms",s),c(),n.record("new_room",`${o[e]} < ${l[d]}: the meeting starts before the next one ends, open a room. Rooms = ${s}`);else{n.add_conditional("needs_room",!1);let r=m.findIndex(e=>t[e][1]===l[d]);r>=0&&m.splice(r,1),i>=0&&m.push(i),d++,n.update_variable("endPtr",d),c(),n.record("free_room",`${o[e]} >= ${l[d-1]}: a meeting has ended, reuse its room. Rooms stays ${s}`)}}return n.add_conditional("for_loop",!1),n.update_variable("startPtr",void 0),n.record("complete",`Done! Minimum rooms needed = ${s}`),n.getSteps()
}

export function MeetingRoomsIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MeetingRoomsIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMeetingRoomsIiSteps(e) as any[];
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
      title="Meeting Rooms II"
      slug="meeting-rooms-ii"
      approaches={approaches}
      presets={MeetingRoomsIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Meeting Rooms III (meeting-rooms-iii)
// ==========================================

const MeetingRoomsIiiTemplates = {
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int mostBooked(int n, int[][] meetings) {\n        Arrays.sort(meetings, (a, b) -> a[0] - b[0]);\n        int[] count = new int[n];\n\n        // Available rooms: min-heap by room number\n        PriorityQueue<Integer> available = new PriorityQueue<>();\n        for (int i = 0; i < n; i++) available.offer(i);\n\n        // Busy rooms: min-heap by (endTime, roomNumber)\n        PriorityQueue<long[]> busy = new PriorityQueue<>(\n            (a, b) -> a[0] != b[0] ? Long.compare(a[0], b[0]) : Long.compare(a[1], b[1])\n        );\n\n        for (int[] meeting : meetings) {\n            long start = meeting[0], end = meeting[1];\n\n            // Free up rooms that have finished by this meeting's start\n            while (!busy.isEmpty() && busy.peek()[0] <= start) {\n                available.offer((int) busy.poll()[1]);\n            }\n\n            if (!available.isEmpty()) {\n                // Assign to lowest-numbered free room\n                int room = available.poll();\n                busy.offer(new long[]{end, room});\n                count[room]++;\n            } else {\n                // No free room: delay until earliest room frees\n                long[] earliest = busy.poll();\n                long newEnd = earliest[0] + (end - start);\n                int room = (int) earliest[1];\n                busy.offer(new long[]{newEnd, room});\n                count[room]++;\n            }\n        }\n\n        int result = 0;\n        for (int i = 1; i < n; i++) {\n            if (count[i] > count[result]) result = i;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_meetings": [
        3
      ],
      "initialize": [
        4,
        7,
        8,
        11
      ],
      "process_meeting": [
        15,
        16
      ],
      "free_room": [
        19,
        20
      ],
      "assign_available": [
        25,
        26,
        27
      ],
      "assign_delayed": [
        30,
        31,
        32,
        33,
        34
      ],
      "complete": [
        38,
        39,
        42
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        15
      ],
      "free_rooms": [
        19
      ],
      "room_available": [
        23
      ]
    }
  },
  "python": {
    "language": "python",
    "code": "class Solution:\n    def mostBooked(self, n: int, meetings: list[list[int]]) -> int:\n        meetings.sort(key=lambda m: m[0])  # stable: ties keep input order\n        count = [0] * n\n\n        # Available rooms: min-heap by room number\n        available = list(range(n))\n        heapq.heapify(available)\n\n        # Busy rooms: min-heap by (end_time, room_number)\n        busy = []\n\n        for start, end in meetings:\n            # Free up rooms that have finished by this meeting's start\n            while busy and busy[0][0] <= start:\n                _, room = heapq.heappop(busy)\n                heapq.heappush(available, room)\n\n            if available:\n                # Assign to lowest-numbered free room\n                room = heapq.heappop(available)\n                heapq.heappush(busy, (end, room))\n                count[room] += 1\n            else:\n                # No free room: delay until earliest room frees\n                earliest_end, room = heapq.heappop(busy)\n                new_end = earliest_end + (end - start)\n                heapq.heappush(busy, (new_end, room))\n                count[room] += 1\n\n        return count.index(max(count))",
    "lineMap": {
      "-": [
        2
      ],
      "sort_meetings": [
        3
      ],
      "initialize": [
        4,
        7,
        8,
        11
      ],
      "process_meeting": [
        13
      ],
      "free_room": [
        15,
        16,
        17
      ],
      "assign_available": [
        21,
        22,
        23
      ],
      "assign_delayed": [
        26,
        27,
        28,
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        13
      ],
      "free_rooms": [
        15
      ],
      "room_available": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int mostBooked(int n, vector<vector<int>>& meetings) {\n        // Stable sort by start time so ties keep their input order\n        stable_sort(meetings.begin(), meetings.end(),\n                    [](const vector<int>& a, const vector<int>& b) { return a[0] < b[0]; });\n        vector<int> count(n, 0);\n\n        // Available rooms: min-heap by room number\n        priority_queue<int, vector<int>, greater<int>> available;\n        for (int i = 0; i < n; i++) available.push(i);\n\n        // Busy rooms: min-heap by (endTime, roomNumber)\n        priority_queue<pair<long long, int>, vector<pair<long long, int>>,\n                       greater<pair<long long, int>>> busy;\n\n        for (auto& meeting : meetings) {\n            long long start = meeting[0], end = meeting[1];\n\n            // Free up rooms that have finished\n            while (!busy.empty() && busy.top().first <= start) {\n                available.push(busy.top().second);\n                busy.pop();\n            }\n\n            if (!available.empty()) {\n                int room = available.top();\n                available.pop();\n                busy.push({end, room});\n                count[room]++;\n            } else {\n                auto [earliestEnd, room] = busy.top();\n                busy.pop();\n                long long newEnd = earliestEnd + (end - start);\n                busy.push({newEnd, room});\n                count[room]++;\n            }\n        }\n\n        return max_element(count.begin(), count.end()) - count.begin();\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "sort_meetings": [
        5,
        6
      ],
      "initialize": [
        7,
        10,
        11,
        14
      ],
      "process_meeting": [
        17,
        18
      ],
      "free_room": [
        21,
        22,
        23
      ],
      "assign_available": [
        27,
        28,
        29,
        30
      ],
      "assign_delayed": [
        32,
        33,
        34,
        35,
        36
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        17
      ],
      "free_rooms": [
        21
      ],
      "room_available": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var mostBooked = function (n, meetings) {\n    meetings.sort((a, b) => a[0] - b[0]);\n    const count = new Array(n).fill(0);\n\n    // Available rooms heap (by room number)\n    const available = [];\n    for (let i = 0; i < n; i++) heapPush(available, i, (a, b) => a - b);\n\n    // Busy rooms heap (by [endTime, roomNumber])\n    const busy = [];\n    const busyCmp = (a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];\n\n    for (const [start, end] of meetings) {\n        // Free up rooms that have finished\n        while (busy.length > 0 && busy[0][0] <= start) {\n            const [, room] = heapPop(busy, busyCmp);\n            heapPush(available, room, (a, b) => a - b);\n        }\n\n        if (available.length > 0) {\n            const room = heapPop(available, (a, b) => a - b);\n            heapPush(busy, [end, room], busyCmp);\n            count[room]++;\n        } else {\n            const [earliestEnd, room] = heapPop(busy, busyCmp);\n            const newEnd = earliestEnd + (end - start);\n            heapPush(busy, [newEnd, room], busyCmp);\n            count[room]++;\n        }\n    }\n\n    let result = 0;\n    for (let i = 1; i < n; i++) {\n        if (count[i] > count[result]) result = i;\n    }\n    return result;\n};\n\nfunction heapPush(heap, val, cmp) {\n    heap.push(val);\n    let i = heap.length - 1;\n    while (i > 0) {\n        const parent = (i - 1) >> 1;\n        if (cmp(heap[i], heap[parent]) < 0) {\n            [heap[i], heap[parent]] = [heap[parent], heap[i]];\n            i = parent;\n        } else break;\n    }\n}\n\nfunction heapPop(heap, cmp) {\n    const top = heap[0];\n    const last = heap.pop();\n    if (heap.length > 0) {\n        heap[0] = last;\n        let i = 0;\n        while (true) {\n            let smallest = i;\n            const left = 2 * i + 1, right = 2 * i + 2;\n            if (left < heap.length && cmp(heap[left], heap[smallest]) < 0) smallest = left;\n            if (right < heap.length && cmp(heap[right], heap[smallest]) < 0) smallest = right;\n            if (smallest !== i) {\n                [heap[i], heap[smallest]] = [heap[smallest], heap[i]];\n                i = smallest;\n            } else break;\n        }\n    }\n    return top;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_meetings": [
        2
      ],
      "initialize": [
        3,
        6,
        7,
        10
      ],
      "process_meeting": [
        13
      ],
      "free_room": [
        15,
        16,
        17
      ],
      "assign_available": [
        21,
        22,
        23
      ],
      "assign_delayed": [
        25,
        26,
        27,
        28
      ],
      "complete": [
        32,
        33,
        36
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        13
      ],
      "free_rooms": [
        15
      ],
      "room_available": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mostBooked(n: number, meetings: number[][]): number {\n    meetings.sort((a, b) => a[0] - b[0]);\n    const count: number[] = new Array(n).fill(0);\n\n    const available: number[] = [];\n    for (let i = 0; i < n; i++) heapPush(available, i, (a, b) => a - b);\n\n    const busy: number[][] = [];\n    const busyCmp = (a: number[], b: number[]) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];\n\n    for (const [start, end] of meetings) {\n        while (busy.length > 0 && busy[0][0] <= start) {\n            const [, room] = heapPop(busy, busyCmp);\n            heapPush(available, room, (a, b) => a - b);\n        }\n\n        if (available.length > 0) {\n            const room = heapPop(available, (a, b) => a - b);\n            heapPush(busy, [end, room], busyCmp);\n            count[room]++;\n        } else {\n            const [earliestEnd, room] = heapPop(busy, busyCmp);\n            const newEnd = earliestEnd + (end - start);\n            heapPush(busy, [newEnd, room], busyCmp);\n            count[room]++;\n        }\n    }\n\n    let result = 0;\n    for (let i = 1; i < n; i++) {\n        if (count[i] > count[result]) result = i;\n    }\n    return result;\n}\n\nfunction heapPush<T>(heap: T[], val: T, cmp: (a: T, b: T) => number): void {\n    heap.push(val);\n    let i = heap.length - 1;\n    while (i > 0) {\n        const parent = (i - 1) >> 1;\n        if (cmp(heap[i], heap[parent]) < 0) {\n            [heap[i], heap[parent]] = [heap[parent], heap[i]];\n            i = parent;\n        } else break;\n    }\n}\n\nfunction heapPop<T>(heap: T[], cmp: (a: T, b: T) => number): T {\n    const top = heap[0];\n    const last = heap.pop()!;\n    if (heap.length > 0) {\n        heap[0] = last;\n        let i = 0;\n        while (true) {\n            let smallest = i;\n            const left = 2 * i + 1, right = 2 * i + 2;\n            if (left < heap.length && cmp(heap[left], heap[smallest]) < 0) smallest = left;\n            if (right < heap.length && cmp(heap[right], heap[smallest]) < 0) smallest = right;\n            if (smallest !== i) {\n                [heap[i], heap[smallest]] = [heap[smallest], heap[i]];\n                i = smallest;\n            } else break;\n        }\n    }\n    return top;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_meetings": [
        2
      ],
      "initialize": [
        3,
        5,
        6,
        8
      ],
      "process_meeting": [
        11
      ],
      "free_room": [
        12,
        13,
        14
      ],
      "assign_available": [
        18,
        19,
        20
      ],
      "assign_delayed": [
        22,
        23,
        24,
        25
      ],
      "complete": [
        29,
        30,
        33
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        11
      ],
      "free_rooms": [
        12
      ],
      "room_available": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mostBooked(n int, meetings [][]int) int {\n    // Stable sort by start time so ties keep their input order\n    sort.SliceStable(meetings, func(i, j int) bool {\n        return meetings[i][0] < meetings[j][0]\n    })\n    count := make([]int, n)\n\n    // Available rooms: min-heap by room number\n    avail := &IntHeap{}\n    for i := 0; i < n; i++ {\n        heap.Push(avail, i)\n    }\n\n    // Busy rooms: min-heap by (endTime, roomNumber)\n    busyH := &BusyHeap{}\n\n    for _, meeting := range meetings {\n        start, end := int64(meeting[0]), int64(meeting[1])\n\n        // Free up rooms that have finished\n        for busyH.Len() > 0 && (*busyH)[0][0] <= start {\n            room := int(heap.Pop(busyH).([2]int64)[1])\n            heap.Push(avail, room)\n        }\n\n        if avail.Len() > 0 {\n            room := heap.Pop(avail).(int)\n            heap.Push(busyH, [2]int64{end, int64(room)})\n            count[room]++\n        } else {\n            earliest := heap.Pop(busyH).([2]int64)\n            room := int(earliest[1])\n            newEnd := earliest[0] + (end - start)\n            heap.Push(busyH, [2]int64{newEnd, int64(room)})\n            count[room]++\n        }\n    }\n\n    result := 0\n    for i := 1; i < n; i++ {\n        if count[i] > count[result] {\n            result = i\n        }\n    }\n    return result\n}\n\ntype IntHeap []int\nfunc (h IntHeap) Len() int            { return len(h) }\nfunc (h IntHeap) Less(i, j int) bool   { return h[i] < h[j] }\nfunc (h IntHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *IntHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *IntHeap) Pop() interface{} {\n    old := *h\n    val := old[len(old)-1]\n    *h = old[:len(old)-1]\n    return val\n}\n\ntype BusyHeap [][2]int64\nfunc (h BusyHeap) Len() int            { return len(h) }\nfunc (h BusyHeap) Less(i, j int) bool {\n    if h[i][0] != h[j][0] { return h[i][0] < h[j][0] }\n    return h[i][1] < h[j][1]\n}\nfunc (h BusyHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }\nfunc (h *BusyHeap) Push(x interface{}) { *h = append(*h, x.([2]int64)) }\nfunc (h *BusyHeap) Pop() interface{} {\n    old := *h\n    val := old[len(old)-1]\n    *h = old[:len(old)-1]\n    return val\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_meetings": [
        3,
        4
      ],
      "initialize": [
        6,
        9,
        10,
        15
      ],
      "process_meeting": [
        17,
        18
      ],
      "free_room": [
        21,
        22,
        23
      ],
      "assign_available": [
        27,
        28,
        29
      ],
      "assign_delayed": [
        31,
        32,
        33,
        34,
        35
      ],
      "complete": [
        39,
        40,
        45
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        17
      ],
      "free_rooms": [
        21
      ],
      "room_available": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MostBooked(int n, int[][] meetings) {\n        // OrderBy is stable, so ties keep their input order\n        meetings = meetings.OrderBy(m => m[0]).ToArray();\n        int[] count = new int[n];\n\n        // Available rooms: min-heap by room number\n        PriorityQueue<int, int> available = new();\n        for (int i = 0; i < n; i++) available.Enqueue(i, i);\n\n        // Busy rooms: min-heap by (endTime, roomNumber)\n        PriorityQueue<int, (long endTime, int room)> busy = new();\n\n        foreach (var meeting in meetings) {\n            long start = meeting[0], end = meeting[1];\n\n            // Free up rooms that have finished\n            while (busy.Count > 0 && busy.TryPeek(out _, out var top) && top.endTime <= start) {\n                busy.Dequeue();\n                available.Enqueue(top.room, top.room);\n            }\n\n            if (available.Count > 0) {\n                int room = available.Dequeue();\n                busy.Enqueue(room, (end, room));\n                count[room]++;\n            } else {\n                busy.TryPeek(out _, out var earliest);\n                busy.Dequeue();\n                long newEnd = earliest.endTime + (end - start);\n                busy.Enqueue(earliest.room, (newEnd, earliest.room));\n                count[earliest.room]++;\n            }\n        }\n\n        int result = 0;\n        for (int i = 1; i < n; i++) {\n            if (count[i] > count[result]) result = i;\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort_meetings": [
        4
      ],
      "initialize": [
        5,
        8,
        9,
        12
      ],
      "process_meeting": [
        14,
        15
      ],
      "free_room": [
        18,
        19,
        20
      ],
      "assign_available": [
        24,
        25,
        26
      ],
      "assign_delayed": [
        28,
        29,
        30,
        31,
        32
      ],
      "complete": [
        36,
        37,
        40
      ]
    },
    "conditionalMap": {
      "for_meeting_loop": [
        14
      ],
      "free_rooms": [
        18
      ],
      "room_available": [
        23
      ]
    }
  }
};

const MeetingRoomsIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "n": 2,
      "meetings": [
        [
          0,
          10
        ],
        [
          1,
          5
        ],
        [
          2,
          7
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Three rooms",
    "value": {
      "n": 3,
      "meetings": [
        [
          1,
          20
        ],
        [
          2,
          10
        ],
        [
          3,
          5
        ],
        [
          4,
          9
        ],
        [
          6,
          8
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All delayed",
    "value": {
      "n": 2,
      "meetings": [
        [
          0,
          5
        ],
        [
          0,
          5
        ],
        [
          1,
          6
        ],
        [
          1,
          6
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "LeetCode Example",
    "value": {
      "n": 4,
      "meetings": [
        [
          18,
          19
        ],
        [
          3,
          12
        ],
        [
          17,
          19
        ],
        [
          2,
          13
        ],
        [
          7,
          10
        ]
      ]
    }
  }
];

function generateMeetingRoomsIiiSteps(e: any): any[] {
  
let t=e.n,o=[...e.meetings].map(e=>[...e]),i=new StepRecorder({n:t,meetings:o},{});if(0===o.length)return i.record("complete","No meetings to schedule"),i.getSteps();for(let e=0;e<t;e++)i.add_new_visual(`count_${e}`,{type:"arrayElement",value:0,position:e,label:`Room ${e}`});o.forEach((e,t)=>{i.add_new_visual(`meeting_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),i.add_new_visual("available_rooms",{type:"metadata",value:Array.from({length:t},(e,t)=>t),label:"available"}),i.add_new_visual("busy_heap",{type:"metadata",value:[],label:"busy"}),i.record("-","Find the room that held the most meetings");let n=o.map((e,t)=>({start:e[0],end:e[1],origIdx:t}));n.sort((e,t)=>e.start-t.start);let r=n.map(e=>[e.start,e.end]);i.update_variable("meetings",r),i.record("sort_meetings","Sort meetings by start time");let s=Array(t).fill(0),l=new Set;for(let e=0;e<t;e++)l.add(e);let m=[],u=e=>{m.push(e),m.sort((e,t)=>e[0]!==t[0]?e[0]-t[0]:e[1]-t[1])},d=()=>m.shift(),p=new Map,c=new Map;function b(){return Array.from(l).sort((e,t)=>e-t)}function h(){return m.map(e=>`(end=${e[0]},room=${e[1]})`)}i.update_visual("available_rooms",{type:"metadata",value:b(),label:"available"}),i.update_visual("busy_heap",{type:"metadata",value:[],label:"busy"}),i.record("initialize",`Initialize: ${t} available rooms, empty busy heap, count array all zeros`);for(let e=0;e<n.length;e++){let o=n[e],a=o.start,r=o.end,g=r-a,f=o.origIdx;for(i.update_visual(`meeting_${f}`,{type:"range",start:a,end:r,label:`[${a},${r}]`,state:"active"}),i.add_conditional("for_meeting_loop",!0),i.record("process_meeting",`Process meeting [${a},${r}]`);m.length>0&&m[0][0]<=a;){let e=d(),t=e[1];l.add(t),i.update_visual("available_rooms",{type:"metadata",value:b(),label:"available"}),i.update_visual("busy_heap",{type:"metadata",value:h(),label:"busy"}),i.add_conditional("free_rooms",!0),i.record("free_room",`Room ${t} is now free (ended at ${e[0]})`)}if(l.size>0){let e=Math.min(...l);l.delete(e),u([r,e]),s[e]++,p.set(f,e),c.set(f,[a,r]),i.update_visual(`count_${e}`,{type:"arrayElement",value:s[e],position:e,label:`Room ${e}`,state:"assigned"}),i.update_visual(`meeting_${f}`,{type:"range",start:a,end:r,label:`[${a},${r}] R${e}`,state:"assigned"}),i.update_visual("available_rooms",{type:"metadata",value:b(),label:"available"}),i.update_visual("busy_heap",{type:"metadata",value:h(),label:"busy"}),i.add_conditional("room_available",!0),i.record("assign_available",`Assign meeting [${a},${r}] to Room ${e}. Count[${e}]=${s[e]}`)}else{let e=d(),t=e[1],o=e[0]+g;u([o,t]),s[t]++,p.set(f,t),c.set(f,[e[0],o]),i.update_visual(`count_${t}`,{type:"arrayElement",value:s[t],position:t,label:`Room ${t}`,state:"assigned"}),i.update_visual(`meeting_${f}`,{type:"range",start:e[0],end:o,label:`[${a},${r}] R${t} (delayed)`,state:"delayed"}),i.update_visual("available_rooms",{type:"metadata",value:b(),label:"available"}),i.update_visual("busy_heap",{type:"metadata",value:h(),label:"busy"}),i.add_conditional("room_available",!1),i.record("assign_delayed",`No free room. Delay meeting [${a},${r}] to Room ${t} at time ${e[0]}. Count[${t}]=${s[t]}`)}for(let e=0;e<t;e++)i.update_visual(`count_${e}`,{type:"arrayElement",value:s[e],position:e,label:`Room ${e}`})}let g=0;for(let e=1;e<t;e++)s[e]>s[g]&&(g=e);return i.update_visual(`count_${g}`,{type:"arrayElement",value:s[g],position:g,label:`Room ${g}`,state:"result"}),i.add_conditional("for_meeting_loop",!1),i.record("complete",`Room ${g} held the most meetings: ${s[g]}`),i.getSteps()
}

export function MeetingRoomsIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MeetingRoomsIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMeetingRoomsIiiSteps(e) as any[];
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
      title="Meeting Rooms III"
      slug="meeting-rooms-iii"
      approaches={approaches}
      presets={MeetingRoomsIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Meeting Scheduler (meeting-scheduler)
// ==========================================

const MeetingSchedulerTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minAvailableDuration(self, slots1: list[list[int]], slots2: list[list[int]], duration: int) -> list[int]:\n        # Min-heap ordered by start time\n        heap = []\n\n        # Add slots that are long enough to host a meeting\n        for slot in slots1:\n            if slot[1] - slot[0] >= duration:\n                heapq.heappush(heap, (slot[0], slot[1]))\n        for slot in slots2:\n            if slot[1] - slot[0] >= duration:\n                heapq.heappush(heap, (slot[0], slot[1]))\n\n        if not heap:\n            return []\n\n        prev = heapq.heappop(heap)\n\n        while heap:\n            curr = heapq.heappop(heap)\n            # Check if the overlap is long enough\n            if prev[1] >= curr[0] + duration:\n                return [curr[0], curr[0] + duration]\n            prev = curr\n\n        return []",
    "lineMap": {
      "-": [
        2
      ],
      "filter_add1": [
        7,
        8,
        9
      ],
      "filter_add2": [
        10,
        11,
        12
      ],
      "heap_empty": [
        14,
        15
      ],
      "init_prev": [
        17
      ],
      "pull_curr": [
        20
      ],
      "check_overlap": [
        22
      ],
      "found": [
        23
      ],
      "update_prev": [
        24
      ],
      "not_found": [
        26
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        19
      ],
      "overlap_check": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> minAvailableDuration(int[][] slots1, int[][] slots2, int duration) {\n        // Min-heap ordered by start time\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n\n        // Add slots that are long enough to host a meeting\n        for (int[] slot : slots1) {\n            if (slot[1] - slot[0] >= duration) heap.offer(slot);\n        }\n        for (int[] slot : slots2) {\n            if (slot[1] - slot[0] >= duration) heap.offer(slot);\n        }\n\n        if (heap.isEmpty()) return List.of();\n\n        int[] prev = heap.poll();\n\n        while (!heap.isEmpty()) {\n            int[] curr = heap.poll();\n            // Check if the overlap is long enough\n            if (prev[1] >= curr[0] + duration) {\n                return List.of(curr[0], curr[0] + duration);\n            }\n            prev = curr;\n        }\n\n        return List.of();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "filter_add1": [
        7,
        8
      ],
      "filter_add2": [
        10,
        11
      ],
      "heap_empty": [
        14
      ],
      "init_prev": [
        16
      ],
      "pull_curr": [
        19
      ],
      "check_overlap": [
        21
      ],
      "found": [
        22
      ],
      "update_prev": [
        24
      ],
      "not_found": [
        27
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "while_loop": [
        18
      ],
      "overlap_check": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> minAvailableDuration(vector<vector<int>>& slots1, vector<vector<int>>& slots2, int duration) {\n        // Min-heap ordered by start time\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> heap;\n\n        // Add slots that are long enough to host a meeting\n        for (auto& slot : slots1) {\n            if (slot[1] - slot[0] >= duration) heap.push({slot[0], slot[1]});\n        }\n        for (auto& slot : slots2) {\n            if (slot[1] - slot[0] >= duration) heap.push({slot[0], slot[1]});\n        }\n\n        if (heap.empty()) return {};\n\n        auto prev = heap.top(); heap.pop();\n\n        while (!heap.empty()) {\n            auto curr = heap.top(); heap.pop();\n            // Check if the overlap is long enough\n            if (prev.second >= curr.first + duration) {\n                return {curr.first, curr.first + duration};\n            }\n            prev = curr;\n        }\n\n        return {};\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "filter_add1": [
        8,
        9
      ],
      "filter_add2": [
        11,
        12
      ],
      "heap_empty": [
        15
      ],
      "init_prev": [
        17
      ],
      "pull_curr": [
        20
      ],
      "check_overlap": [
        22
      ],
      "found": [
        23
      ],
      "update_prev": [
        25
      ],
      "not_found": [
        28
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        19
      ],
      "overlap_check": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> MinAvailableDuration(int[][] slots1, int[][] slots2, int duration) {\n        // Min-heap ordered by start time\n        var heap = new PriorityQueue<int[], int>();\n\n        // Add slots that are long enough to host a meeting\n        foreach (var slot in slots1) {\n            if (slot[1] - slot[0] >= duration) heap.Enqueue(slot, slot[0]);\n        }\n        foreach (var slot in slots2) {\n            if (slot[1] - slot[0] >= duration) heap.Enqueue(slot, slot[0]);\n        }\n\n        if (heap.Count == 0) return new List<int>();\n\n        var prev = heap.Dequeue();\n\n        while (heap.Count > 0) {\n            var curr = heap.Dequeue();\n            // Check if the overlap is long enough\n            if (prev[1] >= curr[0] + duration) {\n                return new List<int> { curr[0], curr[0] + duration };\n            }\n            prev = curr;\n        }\n\n        return new List<int>();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "filter_add1": [
        7,
        8
      ],
      "filter_add2": [
        10,
        11
      ],
      "heap_empty": [
        14
      ],
      "init_prev": [
        16
      ],
      "pull_curr": [
        19
      ],
      "check_overlap": [
        21
      ],
      "found": [
        22
      ],
      "update_prev": [
        24
      ],
      "not_found": [
        27
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "while_loop": [
        18
      ],
      "overlap_check": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minAvailableDuration(slots1 [][]int, slots2 [][]int, duration int) []int {\n    // Collect all slots long enough, then sort by start time\n    all := make([][]int, 0)\n    for _, slot := range slots1 {\n        if slot[1]-slot[0] >= duration {\n            all = append(all, slot)\n        }\n    }\n    for _, slot := range slots2 {\n        if slot[1]-slot[0] >= duration {\n            all = append(all, slot)\n        }\n    }\n\n    sort.Slice(all, func(a, b int) bool { return all[a][0] < all[b][0] })\n\n    for k := 1; k < len(all); k++ {\n        prev := all[k-1]\n        curr := all[k]\n        // Check if the overlap is long enough\n        if prev[1] >= curr[0]+duration {\n            return []int{curr[0], curr[0] + duration}\n        }\n    }\n\n    return []int{}\n}",
    "lineMap": {
      "-": [
        1
      ],
      "filter_add1": [
        4,
        5,
        6
      ],
      "filter_add2": [
        9,
        10,
        11
      ],
      "heap_empty": [
        26
      ],
      "init_prev": [
        18
      ],
      "pull_curr": [
        19
      ],
      "check_overlap": [
        21
      ],
      "found": [
        22
      ],
      "update_prev": [
        17
      ],
      "not_found": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        17
      ],
      "overlap_check": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minAvailableDuration = function (slots1, slots2, duration) {\n  // Collect all slots long enough, then sort by start time\n  const all = [];\n  for (const slot of slots1) {\n    if (slot[1] - slot[0] >= duration) all.push(slot);\n  }\n  for (const slot of slots2) {\n    if (slot[1] - slot[0] >= duration) all.push(slot);\n  }\n\n  all.sort((a, b) => a[0] - b[0]);\n\n  for (let k = 1; k < all.length; k++) {\n    const prev = all[k - 1];\n    const curr = all[k];\n    // Check if the overlap is long enough\n    if (prev[1] >= curr[0] + duration) {\n      return [curr[0], curr[0] + duration];\n    }\n  }\n\n  return [];\n};",
    "lineMap": {
      "-": [
        1
      ],
      "filter_add1": [
        4,
        5
      ],
      "filter_add2": [
        7,
        8
      ],
      "heap_empty": [
        22
      ],
      "init_prev": [
        14
      ],
      "pull_curr": [
        15
      ],
      "check_overlap": [
        17
      ],
      "found": [
        18
      ],
      "update_prev": [
        13
      ],
      "not_found": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "overlap_check": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minAvailableDuration(slots1: number[][], slots2: number[][], duration: number): number[] {\n    // Collect all slots long enough, then sort by start time\n    const all: number[][] = [];\n    for (const slot of slots1) {\n        if (slot[1] - slot[0] >= duration) all.push(slot);\n    }\n    for (const slot of slots2) {\n        if (slot[1] - slot[0] >= duration) all.push(slot);\n    }\n\n    all.sort((a, b) => a[0] - b[0]);\n\n    for (let k = 1; k < all.length; k++) {\n        const prev = all[k - 1];\n        const curr = all[k];\n        // Check if the overlap is long enough\n        if (prev[1] >= curr[0] + duration) {\n            return [curr[0], curr[0] + duration];\n        }\n    }\n\n    return [];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "filter_add1": [
        4,
        5
      ],
      "filter_add2": [
        7,
        8
      ],
      "heap_empty": [
        22
      ],
      "init_prev": [
        14
      ],
      "pull_curr": [
        15
      ],
      "check_overlap": [
        17
      ],
      "found": [
        18
      ],
      "update_prev": [
        13
      ],
      "not_found": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        13
      ],
      "overlap_check": [
        17
      ]
    }
  }
};

const MeetingSchedulerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "slots1": [
        [
          10,
          50
        ],
        [
          60,
          120
        ],
        [
          140,
          210
        ]
      ],
      "slots2": [
        [
          0,
          15
        ],
        [
          60,
          70
        ]
      ],
      "duration": 8
    }
  },
  {
    "id": "ex2",
    "label": "No valid slot",
    "value": {
      "slots1": [
        [
          10,
          50
        ],
        [
          60,
          120
        ]
      ],
      "slots2": [
        [
          0,
          15
        ],
        [
          60,
          70
        ]
      ],
      "duration": 12
    }
  },
  {
    "id": "ex3",
    "label": "Single overlap",
    "value": {
      "slots1": [
        [
          1,
          10
        ]
      ],
      "slots2": [
        [
          2,
          8
        ]
      ],
      "duration": 5
    }
  },
  {
    "id": "ex4",
    "label": "Large overlap",
    "value": {
      "slots1": [
        [
          0,
          100
        ]
      ],
      "slots2": [
        [
          50,
          150
        ]
      ],
      "duration": 30
    }
  }
];

function generateMeetingSchedulerSteps(t: any): any[] {
  
let e=t.slots1.map(t=>[...t]),o=t.slots2.map(t=>[...t]),a=t.duration,l=new StepRecorder({mode:"heap"},{}),i=(t,r,a)=>{let i=1===t?e[r]:o[r];l.update_visual(`slot${t}_${r}`,{type:"range",start:i[0],end:i[1],label:`[${i[0]},${i[1]}]`,state:a})};e.forEach((t,e)=>{l.add_new_visual(`slot1_${e}`,{type:"range",start:t[0],end:t[1],label:`[${t[0]},${t[1]}]`})}),o.forEach((t,e)=>{l.add_new_visual(`slot2_${e}`,{type:"range",start:t[0],end:t[1],label:`[${t[0]},${t[1]}]`})}),l.record("-",`Find the earliest common slot that fits a meeting of duration ${a}`);let s=[],n=()=>s.shift(),p=()=>{s.forEach((t,e)=>{l.update_visual(`hchip_${t.person}_${t.idx}`,{type:"arrayElement",value:`[${t.s},${t.e}]`,position:e})})},d=(t,e)=>{t.forEach((t,o)=>{if(t[1]-t[0]>=a){var r;r={s:t[0],e:t[1],person:e,idx:o},s.push(r),s.sort((t,e)=>t.s-e.s||t.e-e.e),l.add_new_visual(`hchip_${e}_${o}`,{type:"arrayElement",value:`[${t[0]},${t[1]}]`,position:0})}else i(e,o,"short")}),p()};if(d(e,1),l.record("filter_add1",`Person 1: keep slots at least ${a} long, push them into a min-heap by start time`),d(o,2),l.record("filter_add2",`Person 2: keep slots at least ${a} long, push them into the heap`),0===s.length)return l.record("heap_empty","Heap is empty, no slot is long enough"),l.record("complete","Done! No common meeting slot available"),l.getSteps();let u=n();for(l.delete_visual(`hchip_${u.person}_${u.idx}`),p(),i(u.person,u.idx,"prev"),l.record("init_prev",`Pop the earliest slot [${u.s},${u.e}] (person ${u.person}) as prev`);s.length>0;){l.add_conditional("while_loop",!0);let t=n();l.delete_visual(`hchip_${t.person}_${t.idx}`),p(),i(t.person,t.idx,"curr"),l.record("pull_curr",`Pop the next slot [${t.s},${t.e}] (person ${t.person}) as curr`);let e=t.s+a;if(u.e>=e)return l.add_conditional("overlap_check",!0),l.record("check_overlap",`Overlap check: prev end ${u.e} >= curr start ${t.s} + duration ${a} = ${e}? Yes, it fits!`),l.add_new_visual("result_slot",{type:"range",start:t.s,end:e,label:`[${t.s},${e}]`,state:"found"}),i(u.person,u.idx,"matched"),i(t.person,t.idx,"matched"),l.record("found",`Schedule the meeting at [${t.s},${e}]`),l.record("complete",`Done! Earliest common slot: [${t.s},${e}]`),l.getSteps();l.add_conditional("overlap_check",!1),l.record("check_overlap",`Overlap check: prev end ${u.e} >= curr start ${t.s} + duration ${a} = ${e}? No, too small`),i(u.person,u.idx,"used"),i((u=t).person,u.idx,"prev"),l.record("update_prev",`Keep the later slot: prev = [${u.s},${u.e}], discard the earlier one`)}return l.add_conditional("while_loop",!1),i(u.person,u.idx,"used"),l.record("not_found","Heap exhausted, no pair of slots fits the meeting"),l.record("complete","Done! No common meeting slot available"),l.getSteps()
}

export function MeetingSchedulerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MeetingSchedulerTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMeetingSchedulerSteps(t) as any[];
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
      title="Meeting Scheduler"
      slug="meeting-scheduler"
      approaches={approaches}
      presets={MeetingSchedulerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Interval to Include Each Query (minimum-interval-to-include-each-query)
// ==========================================

const MinimumIntervalToIncludeEachQueryTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minInterval(self, intervals: list[list[int]], queries: list[int]) -> list[int]:\n        result = []\n\n        for q in queries:\n            min_size = float('inf')\n            for left, right in intervals:\n                # Check if query falls within this interval\n                if left <= q <= right:\n                    size = right - left + 1\n                    min_size = min(min_size, size)\n            result.append(-1 if min_size == float('inf') else min_size)\n\n        return result",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "process_query": [
        5,
        6
      ],
      "check_interval": [
        7,
        8
      ],
      "inside": [
        9,
        10,
        11
      ],
      "outside": [
        9
      ],
      "record_answer": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "q_loop": [
        5
      ],
      "iv_loop": [
        7
      ],
      "if_inside": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] minInterval(int[][] intervals, int[] queries) {\n        int[] result = new int[queries.length];\n\n        for (int j = 0; j < queries.length; j++) {\n            int minSize = Integer.MAX_VALUE;\n            for (int[] interval : intervals) {\n                // Check if query falls within this interval\n                if (interval[0] <= queries[j] && queries[j] <= interval[1]) {\n                    int size = interval[1] - interval[0] + 1;\n                    minSize = Math.min(minSize, size);\n                }\n            }\n            result[j] = (minSize == Integer.MAX_VALUE) ? -1 : minSize;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "process_query": [
        5,
        6
      ],
      "check_interval": [
        7,
        8
      ],
      "inside": [
        9,
        10,
        11
      ],
      "outside": [
        9
      ],
      "record_answer": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "q_loop": [
        5
      ],
      "iv_loop": [
        7
      ],
      "if_inside": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> minInterval(vector<vector<int>>& intervals, vector<int>& queries) {\n        vector<int> result(queries.size());\n\n        for (int j = 0; j < queries.size(); j++) {\n            int minSize = INT_MAX;\n            for (auto& interval : intervals) {\n                // Check if query falls within this interval\n                if (interval[0] <= queries[j] && queries[j] <= interval[1]) {\n                    int size = interval[1] - interval[0] + 1;\n                    minSize = min(minSize, size);\n                }\n            }\n            result[j] = (minSize == INT_MAX) ? -1 : minSize;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "process_query": [
        6,
        7
      ],
      "check_interval": [
        8,
        9
      ],
      "inside": [
        10,
        11,
        12
      ],
      "outside": [
        10
      ],
      "record_answer": [
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "q_loop": [
        6
      ],
      "iv_loop": [
        8
      ],
      "if_inside": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] MinInterval(int[][] intervals, int[] queries) {\n        int[] result = new int[queries.Length];\n\n        for (int j = 0; j < queries.Length; j++) {\n            int minSize = int.MaxValue;\n            foreach (var interval in intervals) {\n                // Check if query falls within this interval\n                if (interval[0] <= queries[j] && queries[j] <= interval[1]) {\n                    int size = interval[1] - interval[0] + 1;\n                    minSize = Math.Min(minSize, size);\n                }\n            }\n            result[j] = (minSize == int.MaxValue) ? -1 : minSize;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "process_query": [
        5,
        6
      ],
      "check_interval": [
        7,
        8
      ],
      "inside": [
        9,
        10,
        11
      ],
      "outside": [
        9
      ],
      "record_answer": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "q_loop": [
        5
      ],
      "iv_loop": [
        7
      ],
      "if_inside": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minInterval(intervals [][]int, queries []int) []int {\n    result := make([]int, len(queries))\n\n    for j, q := range queries {\n        minSize := math.MaxInt32\n        for _, interval := range intervals {\n            // Check if query falls within this interval\n            if interval[0] <= q && q <= interval[1] {\n                size := interval[1] - interval[0] + 1\n                if size < minSize {\n                    minSize = size\n                }\n            }\n        }\n        if minSize == math.MaxInt32 {\n            result[j] = -1\n        } else {\n            result[j] = minSize\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "process_query": [
        4,
        5
      ],
      "check_interval": [
        6,
        7
      ],
      "inside": [
        8,
        9,
        10,
        11,
        12
      ],
      "outside": [
        8
      ],
      "record_answer": [
        15,
        16,
        17,
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "q_loop": [
        4
      ],
      "iv_loop": [
        6
      ],
      "if_inside": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minInterval = function(intervals, queries) {\n    var result = new Array(queries.length);\n\n    for (var j = 0; j < queries.length; j++) {\n        var minSize = Infinity;\n        for (var i = 0; i < intervals.length; i++) {\n            // Check if query falls within this interval\n            if (intervals[i][0] <= queries[j] && queries[j] <= intervals[i][1]) {\n                var size = intervals[i][1] - intervals[i][0] + 1;\n                minSize = Math.min(minSize, size);\n            }\n        }\n        result[j] = (minSize === Infinity) ? -1 : minSize;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "process_query": [
        4,
        5
      ],
      "check_interval": [
        6,
        7
      ],
      "inside": [
        8,
        9,
        10
      ],
      "outside": [
        8
      ],
      "record_answer": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "q_loop": [
        4
      ],
      "iv_loop": [
        6
      ],
      "if_inside": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minInterval(intervals: number[][], queries: number[]): number[] {\n    const result: number[] = new Array(queries.length);\n\n    for (let j = 0; j < queries.length; j++) {\n        let minSize = Infinity;\n        for (const interval of intervals) {\n            // Check if query falls within this interval\n            if (interval[0] <= queries[j] && queries[j] <= interval[1]) {\n                const size = interval[1] - interval[0] + 1;\n                minSize = Math.min(minSize, size);\n            }\n        }\n        result[j] = (minSize === Infinity) ? -1 : minSize;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "process_query": [
        4,
        5
      ],
      "check_interval": [
        6,
        7
      ],
      "inside": [
        8,
        9,
        10
      ],
      "outside": [
        8
      ],
      "record_answer": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "q_loop": [
        4
      ],
      "iv_loop": [
        6
      ],
      "if_inside": [
        8
      ]
    }
  }
};

const MinimumIntervalToIncludeEachQueryPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          2,
          4
        ],
        [
          3,
          6
        ],
        [
          4,
          4
        ]
      ],
      "queries": [
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "intervals": [
        [
          2,
          3
        ],
        [
          2,
          5
        ],
        [
          1,
          8
        ]
      ],
      "queries": [
        2,
        3,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No match",
    "value": {
      "intervals": [
        [
          3,
          5
        ],
        [
          7,
          9
        ]
      ],
      "queries": [
        1,
        6,
        10
      ]
    }
  }
];

function generateMinimumIntervalToIncludeEachQuerySteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),i=[...e.queries],n=new StepRecorder({},{});t.forEach((e,t)=>{n.add_new_visual(`interval_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),i.forEach((e,t)=>{n.add_new_visual(`query_${t}`,{type:"arrayElement",value:e,position:t,label:`q[${t}]`})}),i.forEach((e,t)=>{n.add_new_visual(`result_${t}`,{type:"arrayElement",value:"?",position:t,label:`r[${t}]`})}),n.record("-","Find the smallest interval containing each query");let a=t.map((e,t)=>({left:e[0],right:e[1],origIdx:t}));a.sort((e,t)=>e.left-t.left),n.record("sort_intervals",`Sort intervals by left endpoint: [${a.map(e=>`[${e.left},${e.right}]`).join(", ")}]. As queries grow, intervals become eligible left to right and each is added exactly once.`);let l=[...new Set(i)].sort((e,t)=>e-t);n.record("sort_queries",`Sort the unique query values: [${l.join(", ")}]. Duplicates are answered once and reused.`);let s=[],o=0;n.record("init","Initialize a min-heap ordered by interval size, and interval pointer i=0");let u=e=>{s.push(e),s.sort((e,t)=>e.size-t.size)},p=()=>s.shift(),h=()=>{s.forEach((e,t)=>{n.update_visual(`hchip_${e.origIdx}`,{type:"arrayElement",value:`(${e.size},${e.right})`,position:t})})},d=new Map,c=!1;for(let e of l){i.forEach((t,i)=>{t===e&&n.update_visual(`query_${i}`,{type:"arrayElement",value:t,position:i,label:`q[${i}]`,state:"active"})}),c?n.update_visual("ptr_query",{type:"pointer",position:e,label:"q"}):(n.add_new_visual("ptr_query",{type:"pointer",position:e,label:"q"}),c=!0),n.update_variable("q",e);let t=i.filter(t=>t===e).length;for(n.record("process_query",`Process query q=${e}${t>1?` (answers ${t} duplicate queries at once)`:""}`);o<a.length&&a[o].left<=e;){let t=a[o],i=t.right-t.left+1;u({size:i,right:t.right,origIdx:t.origIdx}),o++,n.update_visual(`interval_${t.origIdx}`,{type:"range",start:t.left,end:t.right,label:`[${t.left},${t.right}]`,state:"active"}),h(),n.update_visual(`hchip_${t.origIdx}`,{type:"arrayElement",value:`(${i},${t.right})`,position:s.findIndex(e=>e.origIdx===t.origIdx),state:"entering"}),n.update_variable("left",t.left),n.update_variable("right",t.right),n.update_variable("size",i),n.record("push_interval",`Interval [${t.left},${t.right}] starts at or before q=${e}: push (size=${i}) onto the heap`),n.update_visual(`hchip_${t.origIdx}`,{type:"arrayElement",value:`(${i},${t.right})`,position:s.findIndex(e=>e.origIdx===t.origIdx)})}for(;s.length>0&&s[0].right<e;){let t=p(),i=a.find(e=>e.origIdx===t.origIdx);i&&n.update_visual(`interval_${t.origIdx}`,{type:"range",start:i.left,end:i.right,label:`[${i.left},${i.right}]`,state:"expired"}),n.update_visual(`hchip_${t.origIdx}`,{type:"arrayElement",value:`(${t.size},${t.right})`,position:-1,state:"exiting"}),h(),n.update_variable("popSize",t.size),n.update_variable("popRight",t.right),n.update_variable("popIdx",t.origIdx),n.record("pop_expired",`Heap top (size=${t.size}, right=${t.right}) ends before q=${e}: it can never contain this or any later query, discard it`),n.delete_visual(`hchip_${t.origIdx}`)}let r=s.length>0?s[0].size:-1;d.set(e,r);let l=s.length>0?a.find(e=>e.origIdx===s[0].origIdx):void 0;l&&n.update_visual(`interval_${l.origIdx}`,{type:"range",start:l.left,end:l.right,label:`[${l.left},${l.right}]`,state:"best"}),n.update_variable("answer",r),n.add_conditional("heap_nonempty",s.length>0),n.record("record_answer",`Answer for q=${e}: ${-1===r?"-1 (no remaining interval contains it)":`${r}, the size of the smallest interval on the heap that contains q`}`),l&&n.update_visual(`interval_${l.origIdx}`,{type:"range",start:l.left,end:l.right,label:`[${l.left},${l.right}]`,state:"active"}),i.forEach((t,i)=>{t===e&&n.update_visual(`query_${i}`,{type:"arrayElement",value:t,position:i,label:`q[${i}]`,state:"answered"})})}n.delete_visual("ptr_query");let v=[];for(let e=0;e<i.length;e++){let t=d.get(i[e]);v.push(t),n.update_visual(`result_${e}`,{type:"arrayElement",value:t,position:e,label:`r[${e}]`,state:"active"}),n.update_variable("j",e),n.update_variable("qv",i[e]),n.update_variable("ans",t),n.record("build_result",`result[${e}] = queryMap[${i[e]}] = ${t}`)}return n.record("complete",`Result: [${v.join(", ")}]`),n.getSteps()
}

export function MinimumIntervalToIncludeEachQueryProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumIntervalToIncludeEachQueryTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumIntervalToIncludeEachQuerySteps(e) as any[];
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
      title="Minimum Interval to Include Each Query"
      slug="minimum-interval-to-include-each-query"
      approaches={approaches}
      presets={MinimumIntervalToIncludeEachQueryPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// My Calendar I (my-calendar-i)
// ==========================================

const MyCalendarITemplates = {
  "python": {
    "language": "python",
    "code": "from sortedcontainers import SortedList\n\nclass MyCalendar:\n    def __init__(self):\n        self.bookings = SortedList()\n\n    def book(self, start: int, end: int) -> bool:\n        idx = self.bookings.bisect_right((start, end))\n        # Check left neighbor: does its end exceed our start?\n        if idx > 0 and self.bookings[idx - 1][1] > start:\n            return False\n        # Check right neighbor: does our end exceed its start?\n        if idx < len(self.bookings) and end > self.bookings[idx][0]:\n            return False\n        self.bookings.add((start, end))\n        return True",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        7
      ],
      "find_pos": [
        8
      ],
      "check_left": [
        10
      ],
      "left_overlap": [
        11
      ],
      "check_right": [
        13
      ],
      "right_overlap": [
        14
      ],
      "insert": [
        15
      ],
      "return_true": [
        16
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "left_bad": [
        10
      ],
      "right_bad": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyCalendar {\n    private TreeMap<Integer, Integer> bookings;\n\n    public MyCalendar() {\n        bookings = new TreeMap<>();\n    }\n\n    public boolean book(int start, int end) {\n        // Find the event starting at or just before 'start'\n        Map.Entry<Integer, Integer> floor = bookings.floorEntry(start);\n        if (floor != null && floor.getValue() > start) {\n            return false;\n        }\n        // Find the event starting at or just after 'start'\n        Map.Entry<Integer, Integer> ceiling = bookings.ceilingEntry(start);\n        if (ceiling != null && end > ceiling.getKey()) {\n            return false;\n        }\n        bookings.put(start, end);\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        8
      ],
      "find_pos": [
        10
      ],
      "check_left": [
        11
      ],
      "left_overlap": [
        12
      ],
      "check_right": [
        15,
        16
      ],
      "right_overlap": [
        17
      ],
      "insert": [
        19
      ],
      "return_true": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "left_bad": [
        11
      ],
      "right_bad": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyCalendar {\n    private List<int[]> bookings;\n\n    public MyCalendar() {\n        bookings = new List<int[]>();\n    }\n\n    public bool Book(int start, int end) {\n        // Binary search for insertion index by start time\n        int lo = 0, hi = bookings.Count;\n        while (lo < hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (bookings[mid][0] < start) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        // Check left neighbor: does its end exceed our start?\n        if (lo > 0 && bookings[lo - 1][1] > start) {\n            return false;\n        }\n        // Check right neighbor: does our end exceed its start?\n        if (lo < bookings.Count && end > bookings[lo][0]) {\n            return false;\n        }\n        bookings.Insert(lo, new int[]{start, end});\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        8
      ],
      "find_pos": [
        10,
        11,
        12,
        13,
        14,
        15,
        16
      ],
      "check_left": [
        20
      ],
      "left_overlap": [
        21
      ],
      "check_right": [
        24
      ],
      "right_overlap": [
        25
      ],
      "insert": [
        27
      ],
      "return_true": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "left_bad": [
        20
      ],
      "right_bad": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyCalendar {\n    map<int, int> bookings;\n\npublic:\n    MyCalendar() {}\n\n    bool book(int start, int end) {\n        // Find the first event starting at or after 'start'\n        auto it = bookings.lower_bound(start);\n        // Check right neighbor: does our end exceed its start?\n        if (it != bookings.end() && end > it->first) {\n            return false;\n        }\n        // Check left neighbor: does its end exceed our start?\n        if (it != bookings.begin()) {\n            auto prevIt = prev(it);\n            if (prevIt->second > start) {\n                return false;\n            }\n        }\n        bookings[start] = end;\n        return true;\n    }\n};",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        7
      ],
      "find_pos": [
        9
      ],
      "check_left": [
        15,
        16,
        17
      ],
      "left_overlap": [
        18
      ],
      "check_right": [
        11
      ],
      "right_overlap": [
        12
      ],
      "insert": [
        21
      ],
      "return_true": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "left_bad": [
        17
      ],
      "right_bad": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MyCalendar struct {\n    starts []int\n    ends   []int\n}\n\nfunc Constructor() MyCalendar {\n    return MyCalendar{}\n}\n\nfunc (mc *MyCalendar) Book(start int, end int) bool {\n    // Binary search for insertion index\n    lo, hi := 0, len(mc.starts)\n    for lo < hi {\n        mid := lo + (hi-lo)/2\n        if mc.starts[mid] < start {\n            lo = mid + 1\n        } else {\n            hi = mid\n        }\n    }\n    // Check left neighbor: does its end exceed our start?\n    if lo > 0 && mc.ends[lo-1] > start {\n        return false\n    }\n    // Check right neighbor: does our end exceed its start?\n    if lo < len(mc.starts) && end > mc.starts[lo] {\n        return false\n    }\n    // Insert at position lo (maintaining sorted order)\n    mc.starts = append(mc.starts, 0)\n    mc.ends = append(mc.ends, 0)\n    copy(mc.starts[lo+1:], mc.starts[lo:])\n    copy(mc.ends[lo+1:], mc.ends[lo:])\n    mc.starts[lo] = start\n    mc.ends[lo] = end\n    return true\n}",
    "lineMap": {
      "init": [
        7
      ],
      "start_book": [
        10
      ],
      "find_pos": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "check_left": [
        22
      ],
      "left_overlap": [
        23
      ],
      "check_right": [
        26
      ],
      "right_overlap": [
        27
      ],
      "insert": [
        30,
        31,
        32,
        33,
        34,
        35
      ],
      "return_true": [
        36
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "left_bad": [
        22
      ],
      "right_bad": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyCalendar = function() {\n    this.starts = [];\n    this.ends = [];\n};\n\nMyCalendar.prototype.book = function(start, end) {\n    // Binary search for insertion index\n    let lo = 0, hi = this.starts.length;\n    while (lo < hi) {\n        const mid = (lo + hi) >> 1;\n        if (this.starts[mid] < start) {\n            lo = mid + 1;\n        } else {\n            hi = mid;\n        }\n    }\n    // Check left neighbor: does its end exceed our start?\n    if (lo > 0 && this.ends[lo - 1] > start) {\n        return false;\n    }\n    // Check right neighbor: does our end exceed its start?\n    if (lo < this.starts.length && end > this.starts[lo]) {\n        return false;\n    }\n    this.starts.splice(lo, 0, start);\n    this.ends.splice(lo, 0, end);\n    return true;\n};",
    "lineMap": {
      "init": [
        2
      ],
      "start_book": [
        6
      ],
      "find_pos": [
        8,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "check_left": [
        18
      ],
      "left_overlap": [
        19
      ],
      "check_right": [
        22
      ],
      "right_overlap": [
        23
      ],
      "insert": [
        25,
        26
      ],
      "return_true": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "left_bad": [
        18
      ],
      "right_bad": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyCalendar {\n    private starts: number[];\n    private ends: number[];\n\n    constructor() {\n        this.starts = [];\n        this.ends = [];\n    }\n\n    book(start: number, end: number): boolean {\n        // Binary search for insertion index\n        let lo = 0, hi = this.starts.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (this.starts[mid] < start) {\n                lo = mid + 1;\n            } else {\n                hi = mid;\n            }\n        }\n        // Check left neighbor: does its end exceed our start?\n        if (lo > 0 && this.ends[lo - 1] > start) {\n            return false;\n        }\n        // Check right neighbor: does our end exceed its start?\n        if (lo < this.starts.length && end > this.starts[lo]) {\n            return false;\n        }\n        this.starts.splice(lo, 0, start);\n        this.ends.splice(lo, 0, end);\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        6
      ],
      "start_book": [
        10
      ],
      "find_pos": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "check_left": [
        22
      ],
      "left_overlap": [
        23
      ],
      "check_right": [
        26
      ],
      "right_overlap": [
        27
      ],
      "insert": [
        29,
        30
      ],
      "return_true": [
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "left_bad": [
        22
      ],
      "right_bad": [
        26
      ]
    }
  }
};

const MyCalendarIPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "MyCalendar",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          15,
          25
        ],
        [
          20,
          30
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "No Overlaps",
    "value": {
      "operations": [
        "MyCalendar",
        "book",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          25,
          35
        ],
        [
          40,
          50
        ],
        [
          0,
          5
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Adjacent",
    "value": {
      "operations": [
        "MyCalendar",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          20,
          30
        ],
        [
          30,
          40
        ]
      ]
    }
  }
];

function generateMyCalendarISteps(e: any): any[] {
  
let t=(0,n.createMyCalendarScene)(),{recorder:r,bookings:o,states:i}=t;for(let{start:a,end:s}of(t.setTimeRange((0,n.bookCalls)(e)),r.record("init","Start with an empty ordered map of bookings"),(0,n.bookCalls)(e))){t.setOperation(`book(${a}, ${s})`),t.setResult(""),t.setAttempt({start:a,end:s}),t.clearStates(),t.setMarkers([]),r.record("start_book",`book(${a}, ${s})`);let e=0;for(;e<o.length&&o[e].start<=a;)e++;let l=e>0?o[e-1]:null,d=e<o.length?o[e]:null,c=[{index:e,label:"pos"}];t.setMarkers(c),r.record("find_pos",l?`Floor entry [${l.start}, ${l.end}] sits at index ${e-1}`:`No booking starts at or before ${a}`),l&&t.setState(e-1,n.BAR_STATE.comparing);let h=null!==l&&l.end>a;if(r.set_conditionals([{key:"left_bad",result:h}]),r.record("check_left",l?`Left [${l.start}, ${l.end}]: ${l.end} > ${a}? ${h}`:"No left neighbour"),h){t.setState(e-1,n.BAR_STATE.conflict),t.setResult("false"),r.record("left_overlap","Overlaps the left neighbour, return false");continue}t.clearStates(),d&&t.setState(e,n.BAR_STATE.comparing);let u=null!==d&&s>d.start;if(r.set_conditionals([{key:"right_bad",result:u}]),r.record("check_right",d?`Right [${d.start}, ${d.end}]: ${s} > ${d.start}? ${u}`:"No right neighbour"),u){t.setState(e,n.BAR_STATE.conflict),t.setResult("false"),r.record("right_overlap","Overlaps the right neighbour, return false");continue}o.splice(e,0,{start:a,end:s}),i.splice(e,0,n.BAR_STATE.added),t.setAttempt(null),t.setMarkers([]),t.sync(),r.record("insert",`Store [${a}, ${s}] at index ${e}`),t.setResult("true"),r.record("return_true",`book(${a}, ${s}) returned true`)}return t.setOperation(""),t.setResult(""),t.setAttempt(null),t.setMarkers([]),t.clearStates(),r.record("complete",`Complete! ${o.length} bookings held`),r.getSteps()
}

export function MyCalendarIProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MyCalendarITemplates,
      generateSteps: (e: any) => {
        const recorded = generateMyCalendarISteps(e) as any[];
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
      title="My Calendar I"
      slug="my-calendar-i"
      approaches={approaches}
      presets={MyCalendarIPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// My Calendar II (my-calendar-ii)
// ==========================================

const MyCalendarIiTemplates = {
  "python": {
    "language": "python",
    "code": "class MyCalendarTwo:\n    def __init__(self):\n        self.timeline = {}\n\n    def book(self, start: int, end: int) -> bool:\n        # Tentatively add the new booking\n        self.timeline[start] = self.timeline.get(start, 0) + 1\n        self.timeline[end] = self.timeline.get(end, 0) - 1\n\n        # Sweep through time points in sorted order\n        count = 0\n        for time in sorted(self.timeline):\n            count += self.timeline[time]\n            if count >= 3:\n                # Undo the addition\n                self.timeline[start] -= 1\n                if self.timeline[start] == 0:\n                    del self.timeline[start]\n                self.timeline[end] += 1\n                if self.timeline[end] == 0:\n                    del self.timeline[end]\n                return False\n        return True",
    "lineMap": {
      "init": [
        3
      ],
      "start_book": [
        5
      ],
      "add_start": [
        7
      ],
      "add_end": [
        8
      ],
      "sweep_init": [
        11
      ],
      "sweep_step": [
        12,
        13
      ],
      "check_triple": [
        14
      ],
      "undo_start": [
        16,
        17,
        18
      ],
      "undo_end": [
        19,
        20,
        21
      ],
      "reject": [
        22
      ],
      "return_true": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_triple": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyCalendarTwo {\n    TreeMap<Integer, Integer> timeline;\n\n    public MyCalendarTwo() {\n        timeline = new TreeMap<>();\n    }\n\n    public boolean book(int start, int end) {\n        // Tentatively add the new booking\n        timeline.merge(start, 1, Integer::sum);\n        timeline.merge(end, -1, Integer::sum);\n\n        // Sweep to check if any point reaches 3 active events\n        int count = 0;\n        for (int delta : timeline.values()) {\n            count += delta;\n            if (count >= 3) {\n                // Undo the addition\n                timeline.merge(start, -1, Integer::sum);\n                timeline.merge(end, 1, Integer::sum);\n                // Clean up zero entries\n                if (timeline.get(start) == 0) timeline.remove(start);\n                if (timeline.get(end) == 0) timeline.remove(end);\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        8
      ],
      "add_start": [
        10
      ],
      "add_end": [
        11
      ],
      "sweep_init": [
        14
      ],
      "sweep_step": [
        15,
        16
      ],
      "check_triple": [
        17
      ],
      "undo_start": [
        19,
        22
      ],
      "undo_end": [
        20,
        23
      ],
      "reject": [
        24
      ],
      "return_true": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_triple": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyCalendarTwo {\n    SortedDictionary<int, int> timeline;\n\n    public MyCalendarTwo() {\n        timeline = new SortedDictionary<int, int>();\n    }\n\n    public bool Book(int start, int end) {\n        // Tentatively add the new booking\n        if (!timeline.ContainsKey(start)) timeline[start] = 0;\n        timeline[start]++;\n        if (!timeline.ContainsKey(end)) timeline[end] = 0;\n        timeline[end]--;\n\n        // Sweep to check if any point reaches 3 active events\n        int count = 0;\n        foreach (var delta in timeline.Values) {\n            count += delta;\n            if (count >= 3) {\n                // Undo the addition\n                timeline[start]--;\n                if (timeline[start] == 0) timeline.Remove(start);\n                timeline[end]++;\n                if (timeline[end] == 0) timeline.Remove(end);\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        8
      ],
      "add_start": [
        10,
        11
      ],
      "add_end": [
        12,
        13
      ],
      "sweep_init": [
        16
      ],
      "sweep_step": [
        17,
        18
      ],
      "check_triple": [
        19
      ],
      "undo_start": [
        21,
        22
      ],
      "undo_end": [
        23,
        24
      ],
      "reject": [
        25
      ],
      "return_true": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_triple": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyCalendarTwo {\n    map<int, int> timeline;\n\npublic:\n    MyCalendarTwo() {}\n\n    bool book(int start, int end) {\n        // Tentatively add the new booking\n        timeline[start]++;\n        timeline[end]--;\n\n        // Sweep to check if any point reaches 3 active events\n        int count = 0;\n        for (auto& [time, delta] : timeline) {\n            count += delta;\n            if (count >= 3) {\n                // Undo the addition\n                timeline[start]--;\n                timeline[end]++;\n                if (timeline[start] == 0) timeline.erase(start);\n                if (timeline[end] == 0) timeline.erase(end);\n                return false;\n            }\n        }\n        return true;\n    }\n};",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        7
      ],
      "add_start": [
        9
      ],
      "add_end": [
        10
      ],
      "sweep_init": [
        13
      ],
      "sweep_step": [
        14,
        15
      ],
      "check_triple": [
        16
      ],
      "undo_start": [
        18,
        20
      ],
      "undo_end": [
        19,
        21
      ],
      "reject": [
        22
      ],
      "return_true": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_triple": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MyCalendarTwo struct {\n    keys   []int\n    deltas map[int]int\n}\n\nfunc Constructor() MyCalendarTwo {\n    return MyCalendarTwo{\n        keys:   []int{},\n        deltas: map[int]int{},\n    }\n}\n\nfunc (c *MyCalendarTwo) insertKey(key int) {\n    if _, exists := c.deltas[key]; exists {\n        return\n    }\n    // Insert key in sorted order\n    i := sort.SearchInts(c.keys, key)\n    c.keys = append(c.keys, 0)\n    copy(c.keys[i+1:], c.keys[i:])\n    c.keys[i] = key\n}\n\nfunc (c *MyCalendarTwo) removeKeyIfZero(key int) {\n    if c.deltas[key] == 0 {\n        delete(c.deltas, key)\n        i := sort.SearchInts(c.keys, key)\n        c.keys = append(c.keys[:i], c.keys[i+1:]...)\n    }\n}\n\nfunc (c *MyCalendarTwo) Book(start int, end int) bool {\n    // Tentatively add the new booking\n    c.insertKey(start)\n    c.insertKey(end)\n    c.deltas[start]++\n    c.deltas[end]--\n\n    // Sweep to check if any point reaches 3 active events\n    count := 0\n    for _, key := range c.keys {\n        count += c.deltas[key]\n        if count >= 3 {\n            // Undo the addition\n            c.deltas[start]--\n            c.deltas[end]++\n            c.removeKeyIfZero(start)\n            c.removeKeyIfZero(end)\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "init": [
        8,
        9
      ],
      "start_book": [
        32
      ],
      "add_start": [
        34,
        36
      ],
      "add_end": [
        35,
        37
      ],
      "sweep_init": [
        40
      ],
      "sweep_step": [
        41,
        42
      ],
      "check_triple": [
        43
      ],
      "undo_start": [
        45,
        47
      ],
      "undo_end": [
        46,
        48
      ],
      "reject": [
        49
      ],
      "return_true": [
        52
      ],
      "complete": [
        52
      ]
    },
    "conditionalMap": {
      "is_triple": [
        43
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyCalendarTwo = function () {\n  this.timeline = new Map();\n};\n\nMyCalendarTwo.prototype.book = function (start, end) {\n  // Tentatively add the new booking\n  this.timeline.set(start, (this.timeline.get(start) || 0) + 1);\n  this.timeline.set(end, (this.timeline.get(end) || 0) - 1);\n\n  // Sort keys and sweep to check if any point reaches 3 active events\n  const sortedKeys = [...this.timeline.keys()].sort((a, b) => a - b);\n  let count = 0;\n  for (const key of sortedKeys) {\n    count += this.timeline.get(key);\n    if (count >= 3) {\n      // Undo the addition\n      this.timeline.set(start, this.timeline.get(start) - 1);\n      if (this.timeline.get(start) === 0) this.timeline.delete(start);\n      this.timeline.set(end, this.timeline.get(end) + 1);\n      if (this.timeline.get(end) === 0) this.timeline.delete(end);\n      return false;\n    }\n  }\n  return true;\n};",
    "lineMap": {
      "init": [
        2
      ],
      "start_book": [
        5
      ],
      "add_start": [
        7
      ],
      "add_end": [
        8
      ],
      "sweep_init": [
        11,
        12
      ],
      "sweep_step": [
        13,
        14
      ],
      "check_triple": [
        15
      ],
      "undo_start": [
        17,
        18
      ],
      "undo_end": [
        19,
        20
      ],
      "reject": [
        21
      ],
      "return_true": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_triple": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyCalendarTwo {\n    private timeline: Map<number, number>;\n\n    constructor() {\n        this.timeline = new Map();\n    }\n\n    book(start: number, end: number): boolean {\n        // Tentatively add the new booking\n        this.timeline.set(start, (this.timeline.get(start) || 0) + 1);\n        this.timeline.set(end, (this.timeline.get(end) || 0) - 1);\n\n        // Sort keys and sweep to check if any point reaches 3 active events\n        const sortedKeys = [...this.timeline.keys()].sort((a, b) => a - b);\n        let count = 0;\n        for (const key of sortedKeys) {\n            count += this.timeline.get(key)!;\n            if (count >= 3) {\n                // Undo the addition\n                this.timeline.set(start, this.timeline.get(start)! - 1);\n                if (this.timeline.get(start) === 0) this.timeline.delete(start);\n                this.timeline.set(end, this.timeline.get(end)! + 1);\n                if (this.timeline.get(end) === 0) this.timeline.delete(end);\n                return false;\n            }\n        }\n        return true;\n    }\n}",
    "lineMap": {
      "init": [
        5
      ],
      "start_book": [
        8
      ],
      "add_start": [
        10
      ],
      "add_end": [
        11
      ],
      "sweep_init": [
        14,
        15
      ],
      "sweep_step": [
        16,
        17
      ],
      "check_triple": [
        18
      ],
      "undo_start": [
        20,
        21
      ],
      "undo_end": [
        22,
        23
      ],
      "reject": [
        24
      ],
      "return_true": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_triple": [
        18
      ]
    }
  }
};

const MyCalendarIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example",
    "value": {
      "operations": [
        "MyCalendarTwo",
        "book",
        "book",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          50,
          60
        ],
        [
          10,
          40
        ],
        [
          5,
          15
        ],
        [
          5,
          10
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Triple Booking",
    "value": {
      "operations": [
        "MyCalendarTwo",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          15,
          25
        ],
        [
          12,
          22
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Pass",
    "value": {
      "operations": [
        "MyCalendarTwo",
        "book",
        "book",
        "book",
        "book"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          20,
          30
        ],
        [
          10,
          20
        ],
        [
          30,
          40
        ]
      ]
    }
  }
];

function generateMyCalendarIiSteps(e: any): any[] {
  
let t=(0,o.createMyCalendarTwoScene)(),{recorder:n}=t,a=new Map,r=[],i=()=>[...a.keys()].sort((e,t)=>e-t),l=(e,n)=>{let l=i().map(t=>({time:t,delta:a.get(t),state:t===n?o.BAR_STATE.conflict:t===e?o.BAR_STATE.comparing:o.BAR_STATE.booked}));t.setTimeline(l),t.setBookings(r)};for(let{start:s,end:d}of(t.setTimeRange((0,o.bookCalls)(e)),l(),n.record("init","Start with an empty timeline of deltas"),(0,o.bookCalls)(e))){t.setOperation(`book(${s}, ${d})`),t.setResult(""),t.setAttempt({start:s,end:d}),t.setSweep(null),l(),n.record("start_book",`book(${s}, ${d})`),a.set(s,(a.get(s)??0)+1),l(s),n.record("add_start",`timeline[${s}] = ${a.get(s)}`),a.set(d,(a.get(d)??0)-1),l(d),n.record("add_end",`timeline[${d}] = ${a.get(d)}`);let e=0;t.setSweep({index:-1,count:e}),l(),n.record("sweep_init","count = 0");let o=i(),u=-1;for(let r=0;r<o.length;r++){let i=o[r];e+=a.get(i),t.setSweep({index:r,count:e}),l(i),n.record("sweep_step",`time ${i}, delta ${a.get(i)}, count = ${e}`);let s=e>=3;if(n.set_conditionals([{key:"is_triple",result:s}]),n.record("check_triple",`count ${e} >= 3: ${s}`),s){u=i;break}}if(-1!==u){a.set(s,a.get(s)-1),0===a.get(s)&&a.delete(s),l(s,u),n.record("undo_start",`Undo the +1 at ${s}`),a.set(d,a.get(d)+1),0===a.get(d)&&a.delete(d),l(d,u),n.record("undo_end",`Undo the -1 at ${d}`),t.setSweep(null),l(void 0,u),t.setResult("false"),n.record("reject",`Triple booking at ${u}, return false`);continue}r.push({start:s,end:d}),t.setAttempt(null),t.setSweep(null),l(),t.setResult("true"),n.record("return_true",`book(${s}, ${d}) returned true`)}return t.setOperation(""),t.setResult(""),t.setAttempt(null),t.setSweep(null),l(),n.record("complete",`Complete! ${r.length} bookings held`),n.getSteps()
}

export function MyCalendarIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MyCalendarIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMyCalendarIiSteps(e) as any[];
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
      title="My Calendar II"
      slug="my-calendar-ii"
      approaches={approaches}
      presets={MyCalendarIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Covered Intervals (remove-covered-intervals)
// ==========================================

const RemoveCoveredIntervalsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def removeCoveredIntervals(self, intervals: list[list[int]]) -> int:\n        # Sort by start ascending; if starts are equal, sort by end descending\n        intervals.sort(key=lambda x: (x[0], -x[1]))\n\n        max_end = 0\n        count = 0\n\n        for _, end in intervals:\n            # If current end exceeds max_end, this interval is not covered\n            if end > max_end:\n                count += 1\n                max_end = end\n        return count",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        9,
        11
      ],
      "not_covered": [
        12,
        13
      ],
      "covered": [
        11
      ],
      "complete": [
        14
      ],
      "empty_input": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "is_not_covered": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int removeCoveredIntervals(int[][] intervals) {\n        // Sort by start ascending; if starts are equal, sort by end descending\n        Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);\n\n        int maxEnd = 0;\n        int count = 0;\n\n        for (int[] interval : intervals) {\n            // If current end exceeds maxEnd, this interval is not covered\n            if (interval[1] > maxEnd) {\n                count++;\n                maxEnd = interval[1];\n            }\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        9,
        11
      ],
      "not_covered": [
        12,
        13
      ],
      "covered": [
        11
      ],
      "complete": [
        16
      ],
      "empty_input": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "is_not_covered": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int removeCoveredIntervals(vector<vector<int>>& intervals) {\n        // Sort by start ascending; if starts are equal, sort by end descending\n        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[0] != b[0] ? a[0] < b[0] : a[1] > b[1];\n        });\n\n        int maxEnd = 0;\n        int count = 0;\n\n        for (const auto& interval : intervals) {\n            // If current end exceeds maxEnd, this interval is not covered\n            if (interval[1] > maxEnd) {\n                count++;\n                maxEnd = interval[1];\n            }\n        }\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "sort": [
        5,
        6,
        7
      ],
      "check": [
        12,
        14
      ],
      "not_covered": [
        15,
        16
      ],
      "covered": [
        14
      ],
      "complete": [
        19
      ],
      "empty_input": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "is_not_covered": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int RemoveCoveredIntervals(int[][] intervals) {\n        // Sort by start ascending; if starts are equal, sort by end descending\n        Array.Sort(intervals, (a, b) => a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);\n\n        int maxEnd = 0;\n        int count = 0;\n\n        foreach (var interval in intervals) {\n            // If current end exceeds maxEnd, this interval is not covered\n            if (interval[1] > maxEnd) {\n                count++;\n                maxEnd = interval[1];\n            }\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "sort": [
        4
      ],
      "check": [
        9,
        11
      ],
      "not_covered": [
        12,
        13
      ],
      "covered": [
        11
      ],
      "complete": [
        16
      ],
      "empty_input": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "is_not_covered": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeCoveredIntervals(intervals [][]int) int {\n    // Sort by start ascending; if starts are equal, sort by end descending\n    sort.Slice(intervals, func(i, j int) bool {\n        if intervals[i][0] != intervals[j][0] {\n            return intervals[i][0] < intervals[j][0]\n        }\n        return intervals[i][1] > intervals[j][1]\n    })\n\n    maxEnd := 0\n    count := 0\n\n    for _, interval := range intervals {\n        // If current end exceeds maxEnd, this interval is not covered\n        if interval[1] > maxEnd {\n            count++\n            maxEnd = interval[1]\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "check": [
        13,
        15
      ],
      "not_covered": [
        16,
        17
      ],
      "covered": [
        15
      ],
      "complete": [
        20
      ],
      "empty_input": [
        20
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "is_not_covered": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var removeCoveredIntervals = function (intervals) {\n  // Sort by start ascending; if starts are equal, sort by end descending\n  intervals.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]));\n\n  let maxEnd = 0;\n  let count = 0;\n\n  for (const [start, end] of intervals) {\n    // If current end exceeds maxEnd, this interval is not covered\n    if (end > maxEnd) {\n      count++;\n      maxEnd = end;\n    }\n  }\n  return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "check": [
        8,
        10
      ],
      "not_covered": [
        11,
        12
      ],
      "covered": [
        10
      ],
      "complete": [
        15
      ],
      "empty_input": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "is_not_covered": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeCoveredIntervals(intervals: number[][]): number {\n    // Sort by start ascending; if starts are equal, sort by end descending\n    intervals.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]));\n\n    let maxEnd = 0;\n    let count = 0;\n\n    for (const [start, end] of intervals) {\n        // If current end exceeds maxEnd, this interval is not covered\n        if (end > maxEnd) {\n            count++;\n            maxEnd = end;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        3
      ],
      "check": [
        8,
        10
      ],
      "not_covered": [
        11,
        12
      ],
      "covered": [
        10
      ],
      "complete": [
        15
      ],
      "empty_input": [
        15
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "is_not_covered": [
        10
      ]
    }
  }
};

const RemoveCoveredIntervalsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          3,
          6
        ],
        [
          2,
          8
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple covered",
    "value": {
      "intervals": [
        [
          1,
          4
        ],
        [
          2,
          3
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Same start",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          1,
          4
        ],
        [
          3,
          4
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "None covered",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          6
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Multiple covered",
    "value": {
      "intervals": [
        [
          1,
          10
        ],
        [
          2,
          5
        ],
        [
          3,
          7
        ],
        [
          4,
          6
        ]
      ]
    }
  }
];

function generateRemoveCoveredIntervalsSteps(e: any): any[] {
  
let t=[...e.intervals].map(e=>[...e]),n=new StepRecorder({mode:"greedy",intervals:t,maxEnd:void 0,count:void 0,i:void 0},{});if(0===t.length)return n.record("empty_input","No intervals provided"),n.getSteps();t.forEach((e,t)=>{n.add_new_visual(`interval_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),n.record("-","Start: Remove intervals covered by another interval"),t.sort((e,t)=>e[0]!==t[0]?e[0]-t[0]:t[1]-e[1]),n.update_variable("intervals",t),t.forEach((e,t)=>{n.update_visual(`interval_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}]`})}),n.record("sort",`Sort by start ascending, end descending: ${JSON.stringify(t)}`);let r=0,i=0;n.update_variable("maxEnd",r),n.update_variable("count",i),n.add_new_visual("meta_maxEnd",{type:"metadata",value:r,label:"maxEnd"}),n.add_new_visual("meta_count",{type:"metadata",value:i,label:"count"});for(let e=0;e<t.length;e++){n.update_variable("i",e);let a=t[e];n.update_visual(`interval_${e}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"active"}),n.add_conditional("for_loop",!0),n.record("check",`Check interval [${a[0]},${a[1]}]: end=${a[1]} vs maxEnd=${r}`),a[1]>r?(n.add_conditional("is_not_covered",!0),i++,r=a[1],n.update_variable("count",i),n.update_variable("maxEnd",r),n.update_visual(`interval_${e}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"kept"}),n.update_visual("meta_maxEnd",{type:"metadata",value:r,label:"maxEnd"}),n.update_visual("meta_count",{type:"metadata",value:i,label:"count"}),n.record("not_covered",`Not covered! end=${a[1]} > maxEnd. Update maxEnd=${r}, count=${i}`)):(n.add_conditional("is_not_covered",!1),n.update_visual(`interval_${e}`,{type:"range",start:a[0],end:a[1],label:`[${a[0]},${a[1]}]`,state:"covered"}),n.record("covered",`Covered! end=${a[1]} <= maxEnd=${r}. Skip this interval`))}return n.add_conditional("for_loop",!1),n.update_visual("meta_maxEnd",{type:"metadata",value:r,label:"maxEnd"}),n.update_visual("meta_count",{type:"metadata",value:i,label:"count"}),n.record("complete",`Remaining intervals: ${i}`),n.getSteps()
}

export function RemoveCoveredIntervalsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveCoveredIntervalsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveCoveredIntervalsSteps(e) as any[];
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
      title="Remove Covered Intervals"
      slug="remove-covered-intervals"
      approaches={approaches}
      presets={RemoveCoveredIntervalsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Set Intersection Size At Least Two (set-intersection-size-at-least-two)
// ==========================================

const SetIntersectionSizeAtLeastTwoTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def intersectionSizeTwo(self, intervals: list[list[int]]) -> int:\n        # Sort by right endpoint ascending, then by left endpoint descending for ties\n        intervals.sort(key=lambda x: (x[1], -x[0]))\n\n        count = 0\n        p1 = -1  # second largest chosen number\n        p2 = -1  # largest chosen number\n\n        for start, end in intervals:\n            if start <= p1:\n                # Both p1 and p2 are inside this interval\n                continue\n            elif start <= p2:\n                # Only p2 is inside, add one number at right end\n                p1 = p2\n                p2 = end\n                count += 1\n            else:\n                # Neither is inside, add two numbers\n                p1 = end - 1\n                p2 = end\n                count += 2\n\n        return count",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_intervals": [
        3,
        4
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "interval_loop": [
        10
      ],
      "both_covered": [
        11,
        12,
        13
      ],
      "one_covered": [
        14,
        15,
        16,
        17,
        18
      ],
      "none_covered": [
        19,
        20,
        21,
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        10
      ],
      "both_covered": [
        11
      ],
      "one_covered": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int intersectionSizeTwo(int[][] intervals) {\n        // Sort by right endpoint ascending, then by left endpoint descending for ties\n        Arrays.sort(intervals, (a, b) -> a[1] != b[1] ? a[1] - b[1] : b[0] - a[0]);\n\n        int count = 0;\n        int p1 = -1; // second largest chosen number\n        int p2 = -1; // largest chosen number\n\n        for (int[] interval : intervals) {\n            int start = interval[0], end = interval[1];\n\n            if (start <= p1) {\n                // Both p1 and p2 are inside this interval, already covered\n                continue;\n            } else if (start <= p2) {\n                // Only p2 is inside, need one more number at the right end\n                p1 = p2;\n                p2 = end;\n                count++;\n            } else {\n                // Neither is inside, need two new numbers\n                p1 = end - 1;\n                p2 = end;\n                count += 2;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_intervals": [
        3,
        4
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "interval_loop": [
        10,
        11
      ],
      "both_covered": [
        13,
        14,
        15
      ],
      "one_covered": [
        16,
        17,
        18,
        19,
        20
      ],
      "none_covered": [
        21,
        22,
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        10
      ],
      "both_covered": [
        13
      ],
      "one_covered": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int intersectionSizeTwo(vector<vector<int>>& intervals) {\n        // Sort by right endpoint ascending, then by left endpoint descending for ties\n        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[1] != b[1] ? a[1] < b[1] : a[0] > b[0];\n        });\n\n        int count = 0;\n        int p1 = -1; // second largest chosen number\n        int p2 = -1; // largest chosen number\n\n        for (auto& interval : intervals) {\n            int start = interval[0], end = interval[1];\n\n            if (start <= p1) {\n                continue;\n            } else if (start <= p2) {\n                p1 = p2;\n                p2 = end;\n                count++;\n            } else {\n                p1 = end - 1;\n                p2 = end;\n                count += 2;\n            }\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "sort_intervals": [
        4,
        5,
        6,
        7
      ],
      "initialize": [
        9,
        10,
        11
      ],
      "interval_loop": [
        13,
        14
      ],
      "both_covered": [
        16,
        17
      ],
      "one_covered": [
        18,
        19,
        20,
        21
      ],
      "none_covered": [
        22,
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        13
      ],
      "both_covered": [
        16
      ],
      "one_covered": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int IntersectionSizeTwo(int[][] intervals) {\n        // Sort by right endpoint ascending, then by left endpoint descending for ties\n        Array.Sort(intervals, (a, b) => a[1] != b[1] ? a[1] - b[1] : b[0] - a[0]);\n\n        int count = 0;\n        int p1 = -1; // second largest chosen number\n        int p2 = -1; // largest chosen number\n\n        foreach (var interval in intervals) {\n            int start = interval[0], end = interval[1];\n\n            if (start <= p1) {\n                continue;\n            } else if (start <= p2) {\n                p1 = p2;\n                p2 = end;\n                count++;\n            } else {\n                p1 = end - 1;\n                p2 = end;\n                count += 2;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_intervals": [
        3,
        4
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "interval_loop": [
        10,
        11
      ],
      "both_covered": [
        13,
        14
      ],
      "one_covered": [
        15,
        16,
        17,
        18
      ],
      "none_covered": [
        19,
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        10
      ],
      "both_covered": [
        13
      ],
      "one_covered": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func intersectionSizeTwo(intervals [][]int) int {\n    sort.Slice(intervals, func(i, j int) bool {\n        if intervals[i][1] != intervals[j][1] {\n            return intervals[i][1] < intervals[j][1]\n        }\n        return intervals[i][0] > intervals[j][0]\n    })\n\n    count := 0\n    p1 := -1 // second largest chosen number\n    p2 := -1 // largest chosen number\n\n    for _, interval := range intervals {\n        start, end := interval[0], interval[1]\n\n        if start <= p1 {\n            continue\n        } else if start <= p2 {\n            p1 = p2\n            p2 = end\n            count++\n        } else {\n            p1 = end - 1\n            p2 = end\n            count += 2\n        }\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_intervals": [
        2,
        3,
        4,
        6,
        7
      ],
      "initialize": [
        9,
        10,
        11
      ],
      "interval_loop": [
        13,
        14
      ],
      "both_covered": [
        16,
        17
      ],
      "one_covered": [
        18,
        19,
        20,
        21
      ],
      "none_covered": [
        22,
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        13
      ],
      "both_covered": [
        16
      ],
      "one_covered": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var intersectionSizeTwo = function(intervals) {\n    // Sort by right endpoint ascending, then by left endpoint descending for ties\n    intervals.sort((a, b) => a[1] !== b[1] ? a[1] - b[1] : b[0] - a[0]);\n\n    let count = 0;\n    let p1 = -1; // second largest chosen number\n    let p2 = -1; // largest chosen number\n\n    for (const [start, end] of intervals) {\n        if (start <= p1) {\n            continue;\n        } else if (start <= p2) {\n            p1 = p2;\n            p2 = end;\n            count++;\n        } else {\n            p1 = end - 1;\n            p2 = end;\n            count += 2;\n        }\n    }\n\n    return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort_intervals": [
        2,
        3
      ],
      "initialize": [
        5,
        6,
        7
      ],
      "interval_loop": [
        9
      ],
      "both_covered": [
        10,
        11
      ],
      "one_covered": [
        12,
        13,
        14,
        15
      ],
      "none_covered": [
        16,
        17,
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        9
      ],
      "both_covered": [
        10
      ],
      "one_covered": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function intersectionSizeTwo(intervals: number[][]): number {\n    // Sort by right endpoint ascending, then by left endpoint descending for ties\n    intervals.sort((a, b) => a[1] !== b[1] ? a[1] - b[1] : b[0] - a[0]);\n\n    let count = 0;\n    let p1 = -1; // second largest chosen number\n    let p2 = -1; // largest chosen number\n\n    for (const [start, end] of intervals) {\n        if (start <= p1) {\n            continue;\n        } else if (start <= p2) {\n            p1 = p2;\n            p2 = end;\n            count++;\n        } else {\n            p1 = end - 1;\n            p2 = end;\n            count += 2;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort_intervals": [
        2,
        3
      ],
      "initialize": [
        5,
        6,
        7
      ],
      "interval_loop": [
        9
      ],
      "both_covered": [
        10,
        11
      ],
      "one_covered": [
        12,
        13,
        14,
        15
      ],
      "none_covered": [
        16,
        17,
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "interval_loop": [
        9
      ],
      "both_covered": [
        10
      ],
      "one_covered": [
        12
      ]
    }
  }
};

const SetIntersectionSizeAtLeastTwoPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "intervals": [
        [
          1,
          3
        ],
        [
          1,
          4
        ],
        [
          2,
          5
        ],
        [
          3,
          5
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          2,
          4
        ],
        [
          4,
          5
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Nested",
    "value": {
      "intervals": [
        [
          1,
          5
        ],
        [
          2,
          3
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Disjoint",
    "value": {
      "intervals": [
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          6
        ]
      ]
    }
  }
];

function generateSetIntersectionSizeAtLeastTwoSteps(e: any): any[] {
  function r(e,t){let n=0,i=e.length;for(;n<i;){let r=n+i>>1;e[r]<t?n=r+1:i=r}return n}
let t=e.intervals.map(e=>[...e]),n=t.length,l=t.map((e,t)=>[e[0],e[1],t]).sort((e,t)=>e[1]!==t[1]?e[1]-t[1]:t[0]-e[0]).map(e=>e[2]),s=l.map(e=>t[e]),a={};s.forEach(([e,t],n)=>{a[`iv_${n}`]={type:"arrayElement",value:e,label:String(t),position:l[n]}});let o=new StepRecorder({},a);o.record("-","Start: pick the fewest points so every interval holds at least 2 of them"),s.forEach(([e,t],n)=>{o.update_visual(`iv_${n}`,{type:"arrayElement",value:e,label:String(t),position:n})}),o.record("sort_intervals","Sort by right endpoint ascending (ties: left endpoint descending)");let c=[];o.add_new_variable("picks",c),o.record("initialize","Start with an empty set of chosen numbers");let d=()=>{o.delete_variable("newPicks"),o.delete_variable("val")};for(let e=0;e<n;e++){let[t,n]=s[e];o.add_conditional("interval_loop",!0);let i=r(c,t),l=function(e,t){let n=0,i=e.length;for(;n<i;){let r=n+i>>1;e[r]<=t?n=r+1:i=r}return n}(c,n),a=l-i;o.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),o.update_variable("i",e),o.update_variable("start",t),o.update_variable("end",n),o.update_variable("lo",i),o.update_variable("hi",l),o.update_variable("cnt",a),d(),o.record("count_inside",`Interval [${t}, ${n}] already holds ${a} chosen number${1===a?"":"s"}`);for(let e=a;e<2;e++){o.add_conditional("fill_loop",!0);let t=n-(1-e),i=r(c,t),l=i<c.length&&c[i]===t;if(o.update_variable("val",t),o.add_conditional("not_present",!l),l){d(),o.update_variable("val",t),o.record("skip_val",`${t} is already chosen, so nothing to insert`);continue}c.splice(i,0,t),o.update_variable("picks",c),o.update_variable("newPicks",[t]),o.record("add_val",`Add ${t} to the set. |S| = ${c.length}`)}o.add_conditional("fill_loop",!1)}return o.add_conditional("interval_loop",!1),o.delete_visual("ptr_i"),d(),o.add_new_variable("result",c.length),o.record("complete",`Minimum intersection size = ${c.length}`),o.getSteps()
}

export function SetIntersectionSizeAtLeastTwoProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SetIntersectionSizeAtLeastTwoTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSetIntersectionSizeAtLeastTwoSteps(e) as any[];
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
      title="Set Intersection Size At Least Two"
      slug="set-intersection-size-at-least-two"
      approaches={approaches}
      presets={SetIntersectionSizeAtLeastTwoPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
