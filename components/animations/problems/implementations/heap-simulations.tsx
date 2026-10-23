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
// Sort Characters By Frequency (sort-characters-by-frequency)
// ==========================================

const SortCharactersByFrequencyTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def frequencySort(self, s: str) -> str:\n        # Count frequency of each character\n        freq = {}\n        for c in s:\n            freq[c] = freq.get(c, 0) + 1\n\n        # Create buckets where index = frequency\n        buckets = [[] for _ in range(len(s) + 1)]\n        for char, count in freq.items():\n            buckets[count].append(char)\n\n        # Walk buckets from highest frequency to lowest\n        result = []\n        for i in range(len(s), 0, -1):\n            for char in buckets[i]:\n                result.append(char * i)\n        return \"\".join(result)",
    "lineMap": {
      "-": [
        2
      ],
      "count_start": [
        4
      ],
      "count_frequency": [
        5,
        6
      ],
      "init_buckets": [
        9
      ],
      "place_in_bucket": [
        10,
        11
      ],
      "scan_start": [
        14
      ],
      "scan_bucket": [
        15
      ],
      "append_to_result": [
        16,
        17
      ],
      "complete": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public String frequencySort(String s) {\n        // Count frequency of each character\n        Map<Character, Integer> freq = new HashMap<>();\n        for (char c : s.toCharArray()) {\n            freq.put(c, freq.getOrDefault(c, 0) + 1);\n        }\n\n        // Create buckets where index = frequency\n        List<List<Character>> buckets = new ArrayList<>();\n        for (int i = 0; i <= s.length(); i++) {\n            buckets.add(new ArrayList<>());\n        }\n        for (Map.Entry<Character, Integer> entry : freq.entrySet()) {\n            buckets.get(entry.getValue()).add(entry.getKey());\n        }\n\n        // Walk buckets from highest frequency to lowest\n        StringBuilder sb = new StringBuilder();\n        for (int i = s.length(); i >= 1; i--) {\n            for (char c : buckets.get(i)) {\n                for (int j = 0; j < i; j++) {\n                    sb.append(c);\n                }\n            }\n        }\n        return sb.toString();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_start": [
        4
      ],
      "count_frequency": [
        5,
        6,
        7
      ],
      "init_buckets": [
        10,
        11,
        12,
        13
      ],
      "place_in_bucket": [
        14,
        15,
        16
      ],
      "scan_start": [
        19
      ],
      "scan_bucket": [
        20
      ],
      "append_to_result": [
        21,
        22,
        23,
        24,
        25
      ],
      "complete": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    string frequencySort(string s) {\n        // Count frequency of each character\n        unordered_map<char, int> freq;\n        for (char c : s) {\n            freq[c]++;\n        }\n\n        // Create buckets where index = frequency\n        int n = s.size();\n        vector<vector<char>> buckets(n + 1);\n        for (auto& entry : freq) {\n            buckets[entry.second].push_back(entry.first);\n        }\n\n        // Walk buckets from highest frequency to lowest\n        string result;\n        for (int i = n; i >= 1; i--) {\n            for (char c : buckets[i]) {\n                result.append(i, c);\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "count_start": [
        5
      ],
      "count_frequency": [
        6,
        7,
        8
      ],
      "init_buckets": [
        11,
        12
      ],
      "place_in_bucket": [
        13,
        14,
        15
      ],
      "scan_start": [
        18
      ],
      "scan_bucket": [
        19
      ],
      "append_to_result": [
        20,
        21,
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var frequencySort = function (s) {\n  // Count frequency of each character\n  var freq = {};\n  for (var i = 0; i < s.length; i++) {\n    freq[s[i]] = (freq[s[i]] || 0) + 1;\n  }\n\n  // Create buckets where index = frequency\n  var buckets = new Array(s.length + 1);\n  for (var b = 0; b < buckets.length; b++) {\n    buckets[b] = [];\n  }\n  var chars = Object.keys(freq);\n  for (var j = 0; j < chars.length; j++) {\n    buckets[freq[chars[j]]].push(chars[j]);\n  }\n\n  // Walk buckets from highest frequency to lowest\n  var result = [];\n  for (var k = s.length; k >= 1; k--) {\n    for (var m = 0; m < buckets[k].length; m++) {\n      for (var r = 0; r < k; r++) {\n        result.push(buckets[k][m]);\n      }\n    }\n  }\n  return result.join(\"\");\n};",
    "lineMap": {
      "-": [
        1
      ],
      "count_start": [
        3
      ],
      "count_frequency": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10,
        11,
        12
      ],
      "place_in_bucket": [
        13,
        14,
        15,
        16
      ],
      "scan_start": [
        19
      ],
      "scan_bucket": [
        20
      ],
      "append_to_result": [
        21,
        22,
        23,
        24,
        25
      ],
      "complete": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function frequencySort(s: string): string {\n    // Count frequency of each character\n    const freq: Map<string, number> = new Map();\n    for (const c of s) {\n        freq.set(c, (freq.get(c) || 0) + 1);\n    }\n\n    // Create buckets where index = frequency\n    const buckets: string[][] = new Array(s.length + 1);\n    for (let i = 0; i < buckets.length; i++) {\n        buckets[i] = [];\n    }\n    for (const [ch, count] of freq) {\n        buckets[count].push(ch);\n    }\n\n    // Walk buckets from highest frequency to lowest\n    const result: string[] = [];\n    for (let i = s.length; i >= 1; i--) {\n        for (const ch of buckets[i]) {\n            for (let j = 0; j < i; j++) {\n                result.push(ch);\n            }\n        }\n    }\n    return result.join(\"\");\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_start": [
        3
      ],
      "count_frequency": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10,
        11,
        12
      ],
      "place_in_bucket": [
        13,
        14,
        15
      ],
      "scan_start": [
        18
      ],
      "scan_bucket": [
        19
      ],
      "append_to_result": [
        20,
        21,
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func frequencySort(s string) string {\n    // Count frequency of each character\n    freq := make(map[byte]int)\n    for i := 0; i < len(s); i++ {\n        freq[s[i]]++\n    }\n\n    // Create buckets where index = frequency\n    n := len(s)\n    buckets := make([][]byte, n+1)\n    for ch, count := range freq {\n        buckets[count] = append(buckets[count], ch)\n    }\n\n    // Walk buckets from highest frequency to lowest\n    result := make([]byte, 0, n)\n    for i := n; i >= 1; i-- {\n        for _, ch := range buckets[i] {\n            for j := 0; j < i; j++ {\n                result = append(result, ch)\n            }\n        }\n    }\n    return string(result)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_start": [
        3
      ],
      "count_frequency": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10
      ],
      "place_in_bucket": [
        11,
        12,
        13
      ],
      "scan_start": [
        16
      ],
      "scan_bucket": [
        17
      ],
      "append_to_result": [
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public string FrequencySort(string s) {\n        // Count frequency of each character\n        Dictionary<char, int> freq = new Dictionary<char, int>();\n        foreach (char c in s) {\n            if (freq.ContainsKey(c)) freq[c]++;\n            else freq[c] = 1;\n        }\n\n        // Create buckets where index = frequency\n        List<char>[] buckets = new List<char>[s.Length + 1];\n        for (int i = 0; i < buckets.Length; i++) {\n            buckets[i] = new List<char>();\n        }\n        foreach (var entry in freq) {\n            buckets[entry.Value].Add(entry.Key);\n        }\n\n        // Walk buckets from highest frequency to lowest\n        StringBuilder sb = new StringBuilder();\n        for (int i = s.Length; i >= 1; i--) {\n            foreach (char c in buckets[i]) {\n                sb.Append(c, i);\n            }\n        }\n        return sb.ToString();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "count_start": [
        4
      ],
      "count_frequency": [
        5,
        6,
        7,
        8
      ],
      "init_buckets": [
        11,
        12,
        13,
        14
      ],
      "place_in_bucket": [
        15,
        16,
        17
      ],
      "scan_start": [
        20
      ],
      "scan_bucket": [
        21
      ],
      "append_to_result": [
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    }
  }
};

const SortCharactersByFrequencyPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "tree"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "cccaaa"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "Aabb"
    }
  }
];

function generateSortCharactersByFrequencySteps(e: any): any[] {
  
let t=e.s??"",r=t.split(""),n={};r.forEach((e,t)=>{n[`char_${t}`]={type:"arrayElement",value:e,position:t,counted:!1}});let i=new StepRecorder({s:t,n:t.length,phase:"start",freqEntries:[]},n);i.record("-","Sort characters by frequency using bucket sort");let s=new Map,c=[],l=()=>c.map(e=>({char:e,count:s.get(e)}));i.update_variable("phase","count"),i.record("count_start","Phase 1: count how often each character appears");for(let e=0;e<r.length;e++){let t=r[e];i.update_visual(`char_${e}`,{type:"arrayElement",value:t,position:e,counted:!0,state:"active"}),i.update_visual("curr",{type:"pointer",position:e,label:"curr",state:"active"});let a=(s.get(t)??0)+1;s.has(t)||c.push(t),s.set(t,a),i.update_variable("freqEntries",l()),i.update_variable("activeChar",t),i.update_variable("activeCount",a),i.record("count_frequency",`'${t}' seen ${a} time${1===a?"":"s"}`),i.update_visual(`char_${e}`,{type:"arrayElement",value:t,position:e,counted:!0})}i.delete_visual("curr"),i.delete_variable("activeChar"),i.delete_variable("activeCount");let o=Array.from(new Set(s.values())).sort((e,t)=>t-e),u=new Map;for(let e of(o.forEach(e=>u.set(e,[])),i.update_variable("phase","bucket"),i.update_variable("laneFreqs",o),i.update_variable("maxFreq",o[0]??0),i.record("init_buckets","Phase 2: group characters into buckets indexed by frequency"),c)){let t=s.get(e),r=u.get(t);r.push(e);let a=r.length-1;i.update_visual(`bucket_${e}`,{type:"arrayElement",value:e,position:a,slot:a,freq:t,state:"sorted"}),i.update_variable("activeChar",e),i.update_variable("activeCount",t),i.record("place_in_bucket",`Place '${e}' into buckets[${t}]`)}i.delete_variable("activeChar"),i.delete_variable("activeCount");let h=e=>{u.get(e).forEach((t,r)=>{i.update_visual(`bucket_${t}`,{type:"arrayElement",value:t,position:r,slot:r,freq:e,state:"sorted"})})};i.update_variable("phase","scan"),i.update_variable("result",""),i.record("scan_start","Phase 3: walk the buckets from the highest frequency down to 1");let p=0,d="";for(let e of o)for(let t of(i.update_variable("scanFreq",e),i.record("scan_bucket",`buckets[${e}] holds every character seen ${e} time${1===e?"":"s"}`),[...u.get(e)])){u.set(e,u.get(e).filter(e=>e!==t)),i.delete_visual(`bucket_${t}`),h(e);for(let r=0;r<e;r++)i.update_visual(`result_${p}`,{type:"arrayElement",value:t,position:p,state:"sorted"}),p++;d+=t.repeat(e),i.update_variable("appendedChar",t),i.update_variable("appendedCount",e),i.update_variable("result",d),i.record("append_to_result",`Append '${t}' ${e} time${1===e?"":"s"} → "${d}"`)}return i.delete_variable("scanFreq"),i.delete_variable("appendedChar"),i.delete_variable("appendedCount"),i.update_variable("phase","done"),i.update_variable("result",d),i.record("complete",`Done — sorted string is "${d}"`),i.getSteps()
}

export function SortCharactersByFrequencyProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SortCharactersByFrequencyTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSortCharactersByFrequencySteps(e) as any[];
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
      title="Sort Characters By Frequency"
      slug="sort-characters-by-frequency"
      approaches={approaches}
      presets={SortCharactersByFrequencyPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Furthest Building You Can Reach (furthest-building-you-can-reach)
// ==========================================

const FurthestBuildingYouCanReachTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def furthestBuilding(self, heights: list[int], bricks: int, ladders: int) -> int:\n        # Min-heap tracks the climbs currently assigned to ladders\n        min_heap = []\n\n        for i in range(len(heights) - 1):\n            diff = heights[i + 1] - heights[i]\n\n            if diff <= 0:\n                continue\n\n            # Assign a ladder to this climb\n            heapq.heappush(min_heap, diff)\n\n            # If we've used more ladders than we have, convert the smallest to bricks\n            if len(min_heap) > ladders:\n                bricks -= heapq.heappop(min_heap)\n\n            # If bricks go negative, we can't proceed\n            if bricks < 0:\n                return i\n\n        return len(heights) - 1",
    "lineMap": {
      "init": [
        4
      ],
      "check_building": [
        6,
        7
      ],
      "no_climb": [
        9,
        10
      ],
      "assign_ladder": [
        13
      ],
      "check_ladders": [
        16
      ],
      "convert_bricks": [
        17
      ],
      "check_bricks": [
        20
      ],
      "stuck": [
        21
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "skip_climb": [
        9
      ],
      "over_ladders": [
        16
      ],
      "bricks_negative": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int furthestBuilding(int[] heights, int bricks, int ladders) {\n        // Min-heap tracks the climbs currently assigned to ladders\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n        for (int i = 0; i < heights.length - 1; i++) {\n            int diff = heights[i + 1] - heights[i];\n\n            if (diff <= 0) {\n                continue;\n            }\n\n            // Assign a ladder to this climb\n            minHeap.offer(diff);\n\n            // If we've used more ladders than we have, convert the smallest to bricks\n            if (minHeap.size() > ladders) {\n                bricks -= minHeap.poll();\n            }\n\n            // If bricks go negative, we can't proceed\n            if (bricks < 0) {\n                return i;\n            }\n        }\n\n        return heights.length - 1;\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "check_building": [
        6,
        7
      ],
      "no_climb": [
        9,
        10
      ],
      "assign_ladder": [
        14
      ],
      "check_ladders": [
        17
      ],
      "convert_bricks": [
        18
      ],
      "check_bricks": [
        22
      ],
      "stuck": [
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "skip_climb": [
        9
      ],
      "over_ladders": [
        17
      ],
      "bricks_negative": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FurthestBuilding(int[] heights, int bricks, int ladders) {\n        // Min-heap tracks the climbs currently assigned to ladders\n        PriorityQueue<int, int> minHeap = new PriorityQueue<int, int>();\n\n        for (int i = 0; i < heights.Length - 1; i++) {\n            int diff = heights[i + 1] - heights[i];\n\n            if (diff <= 0) {\n                continue;\n            }\n\n            // Assign a ladder to this climb\n            minHeap.Enqueue(diff, diff);\n\n            // If we've used more ladders than we have, convert the smallest to bricks\n            if (minHeap.Count > ladders) {\n                bricks -= minHeap.Dequeue();\n            }\n\n            // If bricks go negative, we can't proceed\n            if (bricks < 0) {\n                return i;\n            }\n        }\n\n        return heights.Length - 1;\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "check_building": [
        6,
        7
      ],
      "no_climb": [
        9,
        10
      ],
      "assign_ladder": [
        14
      ],
      "check_ladders": [
        17
      ],
      "convert_bricks": [
        18
      ],
      "check_bricks": [
        22
      ],
      "stuck": [
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "skip_climb": [
        9
      ],
      "over_ladders": [
        17
      ],
      "bricks_negative": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int furthestBuilding(vector<int>& heights, int bricks, int ladders) {\n        // Min-heap tracks the climbs currently assigned to ladders\n        priority_queue<int, vector<int>, greater<int>> minHeap;\n\n        for (int i = 0; i < (int)heights.size() - 1; i++) {\n            int diff = heights[i + 1] - heights[i];\n\n            if (diff <= 0) {\n                continue;\n            }\n\n            // Assign a ladder to this climb\n            minHeap.push(diff);\n\n            // If we've used more ladders than we have, convert the smallest to bricks\n            if ((int)minHeap.size() > ladders) {\n                bricks -= minHeap.top();\n                minHeap.pop();\n            }\n\n            // If bricks go negative, we can't proceed\n            if (bricks < 0) {\n                return i;\n            }\n        }\n\n        return heights.size() - 1;\n    }\n};",
    "lineMap": {
      "init": [
        5
      ],
      "check_building": [
        7,
        8
      ],
      "no_climb": [
        10,
        11
      ],
      "assign_ladder": [
        15
      ],
      "check_ladders": [
        18
      ],
      "convert_bricks": [
        19,
        20
      ],
      "check_bricks": [
        24
      ],
      "stuck": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "skip_climb": [
        10
      ],
      "over_ladders": [
        18
      ],
      "bricks_negative": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func furthestBuilding(heights []int, bricks int, ladders int) int {\n    // Min-heap tracks the climbs currently assigned to ladders\n    h := &MinHeap{}\n    heap.Init(h)\n\n    for i := 0; i < len(heights)-1; i++ {\n        diff := heights[i+1] - heights[i]\n\n        if diff <= 0 {\n            continue\n        }\n\n        // Assign a ladder to this climb\n        heap.Push(h, diff)\n\n        // If we've used more ladders than we have, convert the smallest to bricks\n        if h.Len() > ladders {\n            bricks -= heap.Pop(h).(int)\n        }\n\n        // If bricks go negative, we can't proceed\n        if bricks < 0 {\n            return i\n        }\n    }\n\n    return len(heights) - 1\n}\n\ntype MinHeap []int\n\nfunc (h MinHeap) Len() int           { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\n\nfunc (h *MinHeap) Push(x interface{}) {\n    *h = append(*h, x.(int))\n}\n\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "check_building": [
        6,
        7
      ],
      "no_climb": [
        9,
        10
      ],
      "assign_ladder": [
        14
      ],
      "check_ladders": [
        17
      ],
      "convert_bricks": [
        18
      ],
      "check_bricks": [
        22
      ],
      "stuck": [
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "skip_climb": [
        9
      ],
      "over_ladders": [
        17
      ],
      "bricks_negative": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var furthestBuilding = function(heights, bricks, ladders) {\n    // Manual min-heap implementation\n    const heap = [];\n    const heapPush = (val) => {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            let p = (i - 1) >> 1;\n            if (heap[p] <= heap[i]) break;\n            [heap[p], heap[i]] = [heap[i], heap[p]];\n            i = p;\n        }\n    };\n    const heapPop = () => {\n        const top = heap[0];\n        const last = heap.pop();\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                let s = i, l = 2 * i + 1, r = 2 * i + 2;\n                if (l < heap.length && heap[l] < heap[s]) s = l;\n                if (r < heap.length && heap[r] < heap[s]) s = r;\n                if (s === i) break;\n                [heap[s], heap[i]] = [heap[i], heap[s]];\n                i = s;\n            }\n        }\n        return top;\n    };\n\n    for (var i = 0; i < heights.length - 1; i++) {\n        var diff = heights[i + 1] - heights[i];\n\n        if (diff <= 0) {\n            continue;\n        }\n\n        // Assign a ladder to this climb\n        heapPush(diff);\n\n        // If we've used more ladders than we have, convert the smallest to bricks\n        if (heap.length > ladders) {\n            bricks -= heapPop();\n        }\n\n        // If bricks go negative, we can't proceed\n        if (bricks < 0) {\n            return i;\n        }\n    }\n\n    return heights.length - 1;\n};",
    "lineMap": {
      "init": [
        3
      ],
      "check_building": [
        32,
        33
      ],
      "no_climb": [
        35,
        36
      ],
      "assign_ladder": [
        40
      ],
      "check_ladders": [
        43
      ],
      "convert_bricks": [
        44
      ],
      "check_bricks": [
        48
      ],
      "stuck": [
        49
      ],
      "complete": [
        53
      ]
    },
    "conditionalMap": {
      "for_loop": [
        32
      ],
      "skip_climb": [
        35
      ],
      "over_ladders": [
        43
      ],
      "bricks_negative": [
        48
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function furthestBuilding(heights: number[], bricks: number, ladders: number): number {\n    // Manual min-heap implementation\n    const heap: number[] = [];\n    const heapPush = (val: number) => {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            let p = (i - 1) >> 1;\n            if (heap[p] <= heap[i]) break;\n            [heap[p], heap[i]] = [heap[i], heap[p]];\n            i = p;\n        }\n    };\n    const heapPop = (): number => {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                let s = i, l = 2 * i + 1, r = 2 * i + 2;\n                if (l < heap.length && heap[l] < heap[s]) s = l;\n                if (r < heap.length && heap[r] < heap[s]) s = r;\n                if (s === i) break;\n                [heap[s], heap[i]] = [heap[i], heap[s]];\n                i = s;\n            }\n        }\n        return top;\n    };\n\n    for (let i = 0; i < heights.length - 1; i++) {\n        const diff = heights[i + 1] - heights[i];\n\n        if (diff <= 0) {\n            continue;\n        }\n\n        // Assign a ladder to this climb\n        heapPush(diff);\n\n        // If we've used more ladders than we have, convert the smallest to bricks\n        if (heap.length > ladders) {\n            bricks -= heapPop();\n        }\n\n        // If bricks go negative, we can't proceed\n        if (bricks < 0) {\n            return i;\n        }\n    }\n\n    return heights.length - 1;\n}",
    "lineMap": {
      "init": [
        3
      ],
      "check_building": [
        32,
        33
      ],
      "no_climb": [
        35,
        36
      ],
      "assign_ladder": [
        40
      ],
      "check_ladders": [
        43
      ],
      "convert_bricks": [
        44
      ],
      "check_bricks": [
        48
      ],
      "stuck": [
        49
      ],
      "complete": [
        53
      ]
    },
    "conditionalMap": {
      "for_loop": [
        32
      ],
      "skip_climb": [
        35
      ],
      "over_ladders": [
        43
      ],
      "bricks_negative": [
        48
      ]
    }
  }
};

const FurthestBuildingYouCanReachPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "heights": [
        4,
        2,
        7,
        6,
        9,
        14,
        12
      ],
      "bricks": 5,
      "ladders": 1
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "heights": [
        4,
        12,
        2,
        7,
        3,
        18,
        20,
        3,
        19
      ],
      "bricks": 10,
      "ladders": 2
    }
  },
  {
    "id": "ex3",
    "label": "Only Bricks",
    "value": {
      "heights": [
        14,
        3,
        19,
        3
      ],
      "bricks": 17,
      "ladders": 0
    }
  }
];

function generateFurthestBuildingYouCanReachSteps(e: any): any[] {
  
let i=e.heights??[],t=e.bricks??0,r=e.ladders??0,n=(0,s.createFurthestBuildingScene)(e,"heap"),{recorder:l}=n,a=new s.ClimbHeap,d=t;n.setClimber(0),l.record("init",`Start: ${t} bricks, ${r} ladders, empty ladder heap`);for(let e=0;e<i.length-1;e++){let c=i[e+1]-i[e];l.set_conditionals([{key:"for_loop",result:!0}]),l.update_variable("i",e),l.update_variable("climb",c),n.setClimber(e),l.record("check_building",`At building ${e}: climb = ${i[e+1]} - ${i[e]} = ${c}`);let h=c<=0;if(l.set_conditionals([{key:"skip_climb",result:h}]),h){n.setClimber(e+1),l.record("no_climb",`No climb needed (${c} <= 0), walk across for free`);continue}a.push(c,e),n.setGap(e,c,s.PAY.ladder),n.setClimber(e+1),n.setSpent(t-d,a.size()),l.record("assign_ladder",`Assign a ladder to the climb of ${c}`);let o=a.size()>r;if(l.set_conditionals([{key:"over_ladders",result:o}]),l.record("check_ladders",`${a.size()} ladder climbs vs ${r} ladders: ${o}`),o){let[e,i]=a.pop();d-=e,n.setGap(i,e,s.PAY.bricks),n.setSpent(t-d,a.size()),l.update_variable("smallest",e),l.update_variable("swapGap",i),l.record("convert_bricks",`Pay the smallest climb (${e}) with bricks, ${d} left`)}let u=d<0;if(l.set_conditionals([{key:"bricks_negative",result:u}]),l.record("check_bricks",`bricks ${d} < 0: ${u}`),u)return n.setGap(e,c,s.PAY.fail),n.setClimber(e,"inactive"),l.update_variable("result",e),l.record("stuck",`Out of bricks, furthest building = ${e}`),n.steps()}let c=Math.max(0,i.length-1);return l.set_conditionals([{key:"for_loop",result:!1}]),l.update_variable("result",c),n.setClimber(c,"active"),l.record("complete",`Reached the last building! Furthest building = ${c}`),n.steps()
}

export function FurthestBuildingYouCanReachProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FurthestBuildingYouCanReachTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFurthestBuildingYouCanReachSteps(e) as any[];
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
      title="Furthest Building You Can Reach"
      slug="furthest-building-you-can-reach"
      approaches={approaches}
      presets={FurthestBuildingYouCanReachPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Top K Frequent Elements (top-k-frequent-elements)
// ==========================================

const TopKFrequentElementsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def topKFrequent(self, nums: list[int], k: int) -> list[int]:\n        # Count frequencies\n        freq = {}\n        for num in nums:\n            freq[num] = freq.get(num, 0) + 1\n\n        # Min-heap of size k (heapq is a min-heap by default)\n        heap = []\n        for num, count in freq.items():\n            heapq.heappush(heap, (count, num))\n            if len(heap) > k:\n                heapq.heappop(heap)\n\n        # Extract results\n        return [num for count, num in heap]",
    "lineMap": {
      "-": [
        2
      ],
      "build_freq_map": [
        4
      ],
      "count_frequency": [
        6
      ],
      "initialize_heap": [
        9
      ],
      "add_to_heap": [
        11
      ],
      "poll_from_heap": [
        13
      ],
      "extract_result": [
        16
      ],
      "extract_element": [
        16
      ],
      "return": [
        16
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        // Count frequencies\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int num : nums) {\n            freq.put(num, freq.getOrDefault(num, 0) + 1);\n        }\n\n        // Min-heap ordered by frequency\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>(\n            (a, b) -> freq.get(a) - freq.get(b)\n        );\n\n        // Maintain heap of size k\n        for (int num : freq.keySet()) {\n            minHeap.offer(num);\n            if (minHeap.size() > k) {\n                minHeap.poll();\n            }\n        }\n\n        // Extract results\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) {\n            result[i] = minHeap.poll();\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_freq_map": [
        4
      ],
      "count_frequency": [
        6
      ],
      "initialize_heap": [
        10,
        11,
        12
      ],
      "add_to_heap": [
        16
      ],
      "poll_from_heap": [
        18
      ],
      "extract_result": [
        23
      ],
      "extract_element": [
        25
      ],
      "return": [
        27
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        // Count frequencies\n        unordered_map<int, int> freq;\n        for (int num : nums) {\n            freq[num]++;\n        }\n\n        // Min-heap ordered by frequency (pair: frequency, element)\n        priority_queue<pair<int, int>, vector<pair<int, int>>,\n                       greater<pair<int, int>>> minHeap;\n\n        // Maintain heap of size k\n        for (auto& [num, count] : freq) {\n            minHeap.push({count, num});\n            if (minHeap.size() > (size_t)k) {\n                minHeap.pop();\n            }\n        }\n\n        // Extract results\n        vector<int> result;\n        while (!minHeap.empty()) {\n            result.push_back(minHeap.top().second);\n            minHeap.pop();\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "build_freq_map": [
        5
      ],
      "count_frequency": [
        7
      ],
      "initialize_heap": [
        11,
        12
      ],
      "add_to_heap": [
        16
      ],
      "poll_from_heap": [
        18
      ],
      "extract_result": [
        23
      ],
      "extract_element": [
        25,
        26
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var topKFrequent = function(nums, k) {\n    // Count frequencies\n    var freq = new Map();\n    for (var i = 0; i < nums.length; i++) {\n        freq.set(nums[i], (freq.get(nums[i]) || 0) + 1);\n    }\n\n    // Min-heap of [frequency, element], smallest frequency on top\n    var heap = [];\n    function up(i) {\n        while (i > 0) {\n            var p = (i - 1) >> 1;\n            if (heap[p][0] <= heap[i][0]) break;\n            var t = heap[p]; heap[p] = heap[i]; heap[i] = t;\n            i = p;\n        }\n    }\n    function down(i) {\n        var n = heap.length;\n        while (true) {\n            var l = 2 * i + 1, r = 2 * i + 2, s = i;\n            if (l < n && heap[l][0] < heap[s][0]) s = l;\n            if (r < n && heap[r][0] < heap[s][0]) s = r;\n            if (s === i) break;\n            var t = heap[s]; heap[s] = heap[i]; heap[i] = t;\n            i = s;\n        }\n    }\n\n    // Maintain heap of size k\n    freq.forEach(function(count, num) {\n        heap.push([count, num]);\n        up(heap.length - 1);\n        if (heap.length > k) {\n            heap[0] = heap[heap.length - 1];\n            heap.pop();\n            down(0);\n        }\n    });\n\n    // Extract results\n    var result = [];\n    for (var j = 0; j < heap.length; j++) {\n        result.push(heap[j][1]);\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq_map": [
        3
      ],
      "count_frequency": [
        5
      ],
      "initialize_heap": [
        9
      ],
      "add_to_heap": [
        32,
        33
      ],
      "poll_from_heap": [
        35,
        36,
        37
      ],
      "extract_result": [
        42
      ],
      "extract_element": [
        44
      ],
      "return": [
        46
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        34
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function topKFrequent(nums: number[], k: number): number[] {\n    // Count frequencies\n    const freq = new Map<number, number>();\n    for (const num of nums) {\n        freq.set(num, (freq.get(num) || 0) + 1);\n    }\n\n    // Min-heap of [frequency, element], smallest frequency on top\n    const heap: [number, number][] = [];\n    const up = (i: number): void => {\n        while (i > 0) {\n            const p = (i - 1) >> 1;\n            if (heap[p][0] <= heap[i][0]) break;\n            [heap[p], heap[i]] = [heap[i], heap[p]];\n            i = p;\n        }\n    };\n    const down = (i: number): void => {\n        const n = heap.length;\n        while (true) {\n            const l = 2 * i + 1, r = 2 * i + 2;\n            let s = i;\n            if (l < n && heap[l][0] < heap[s][0]) s = l;\n            if (r < n && heap[r][0] < heap[s][0]) s = r;\n            if (s === i) break;\n            [heap[s], heap[i]] = [heap[i], heap[s]];\n            i = s;\n        }\n    };\n\n    // Maintain heap of size k\n    freq.forEach((count, num) => {\n        heap.push([count, num]);\n        up(heap.length - 1);\n        if (heap.length > k) {\n            heap[0] = heap[heap.length - 1];\n            heap.pop();\n            down(0);\n        }\n    });\n\n    // Extract results\n    return heap.map(entry => entry[1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq_map": [
        3
      ],
      "count_frequency": [
        5
      ],
      "initialize_heap": [
        9
      ],
      "add_to_heap": [
        33,
        34
      ],
      "poll_from_heap": [
        36,
        37,
        38
      ],
      "extract_result": [
        43
      ],
      "extract_element": [
        43
      ],
      "return": [
        43
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        35
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func topKFrequent(nums []int, k int) []int {\n    // Count frequencies\n    freq := make(map[int]int)\n    for _, num := range nums {\n        freq[num]++\n    }\n\n    // Use a min-heap of size k\n    h := &minHeap{}\n    heap.Init(h)\n\n    for num, count := range freq {\n        heap.Push(h, [2]int{count, num})\n        if h.Len() > k {\n            heap.Pop(h)\n        }\n    }\n\n    // Extract results\n    result := make([]int, k)\n    for i := 0; i < k; i++ {\n        result[i] = heap.Pop(h).([2]int)[1]\n    }\n    return result\n}\n\ntype minHeap [][2]int\n\nfunc (h minHeap) Len() int            { return len(h) }\nfunc (h minHeap) Less(i, j int) bool   { return h[i][0] < h[j][0] }\nfunc (h minHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *minHeap) Push(x interface{})  { *h = append(*h, x.([2]int)) }\nfunc (h *minHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_freq_map": [
        3
      ],
      "count_frequency": [
        5
      ],
      "initialize_heap": [
        9,
        10
      ],
      "add_to_heap": [
        13
      ],
      "poll_from_heap": [
        15
      ],
      "extract_result": [
        20
      ],
      "extract_element": [
        22
      ],
      "return": [
        24
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] TopKFrequent(int[] nums, int k) {\n        // Count frequencies\n        var freq = new Dictionary<int, int>();\n        foreach (int num in nums) {\n            if (!freq.ContainsKey(num)) freq[num] = 0;\n            freq[num]++;\n        }\n\n        // Min-heap ordered by frequency\n        var minHeap = new PriorityQueue<int, int>();\n\n        // Maintain heap of size k\n        foreach (var entry in freq) {\n            minHeap.Enqueue(entry.Key, entry.Value);\n            if (minHeap.Count > k) {\n                minHeap.Dequeue();\n            }\n        }\n\n        // Extract results\n        int[] result = new int[k];\n        for (int i = 0; i < k; i++) {\n            result[i] = minHeap.Dequeue();\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_freq_map": [
        4
      ],
      "count_frequency": [
        6,
        7
      ],
      "initialize_heap": [
        11
      ],
      "add_to_heap": [
        15
      ],
      "poll_from_heap": [
        17
      ],
      "extract_result": [
        22
      ],
      "extract_element": [
        24
      ],
      "return": [
        26
      ]
    },
    "conditionalMap": {
      "check_heap_size": [
        16
      ]
    }
  }
};

const TopKFrequentElementsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        1,
        1,
        2,
        2,
        3
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        2
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        4,
        4,
        4,
        1,
        1,
        2,
        2,
        2,
        3
      ],
      "k": 2
    }
  }
];

function generateTopKFrequentElementsSteps(e: any): any[] {
  
let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=Math.max(0,Math.floor(Number(e?.k??0))||0),i=t.length,u={};t.forEach((e,t)=>{u[`elem_${t}`]={type:"arrayElement",value:e,position:t,state:"inactive"}});let a=new StepRecorder({k:n,arrayLength:i},u);if(a.record("-","Start: bucket each value by how often it occurs"),0===i||0===n)return a.record("return","Nothing to return"),a.getSteps();let l=new Map;a.record("build_freq_map","Build the frequency map");for(let e=0;e<i;e++){let n=t[e],r=(l.get(n)??0)+1;l.set(n,r),a.update_visual("curr",{type:"pointer",position:e,label:"curr",state:"active"}),a.update_visual(`map_${n}`,{type:"arrayElement",value:`${n}:${r}`,position:n,state:"sorted",label:`freq=${r}`}),a.record("count_frequency",`Count ${n}: now ${r}`)}a.delete_visual("curr"),a.update_variable("buckets",i),a.record("init_buckets",`Make buckets 1..${i}, since no value can appear more than ${i} times`);let s=Array.from({length:i+1},()=>[]);for(let[e,t]of l.entries()){let n=s[t].length;s[t].push(e),a.update_visual(`bucket_${t}_${n}`,{type:"arrayElement",value:e,position:n,state:"sorted"}),a.record("fill_bucket",`${e} occurs ${t} time${1===t?"":"s"}, drop it in bucket ${t}`)}let o=[],c=Math.min(n,l.size);for(let e=i;e>=1&&o.length<c;e--)if(0!==s[e].length){a.update_visual("bucket_scan",{type:"pointer",position:e,label:`bucket ${e}`}),a.record("scan_bucket",`Read bucket ${e} (highest remaining frequency)`);for(let t=0;t<s[e].length;t++){let n=s[e][t];o.push(n);let r=o.length===c;if(a.update_visual(`bucket_${e}_${t}`,{type:"arrayElement",value:n,position:t,state:"matched"}),a.update_visual(`result_${o.length-1}`,{type:"arrayElement",value:n,position:o.length-1,state:"result"}),a.update_variable("result",[...o]),a.add_conditional("is_full",r),a.record("take_element",`Take ${n} from bucket ${e}`+(r?` - that is all ${c}`:` (${o.length} of ${c})`)),r)break}}return a.delete_visual("bucket_scan"),a.record("return",`Return the top ${c}: [${o.join(", ")}]`),a.getSteps()
}

export function TopKFrequentElementsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TopKFrequentElementsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTopKFrequentElementsSteps(e) as any[];
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
      title="Top K Frequent Elements"
      slug="top-k-frequent-elements"
      approaches={approaches}
      presets={TopKFrequentElementsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Median from Data Stream (find-median-from-data-stream)
// ==========================================

const FindMedianFromDataStreamTemplates = {
  "python": {
    "language": "python",
    "code": "class MedianFinder:\n    def __init__(self):\n        # Max-heap for lower half (negate values since heapq is min-heap)\n        self.max_heap = []\n        # Min-heap for upper half\n        self.min_heap = []\n\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.max_heap, -num)\n        # Move largest of lower half to upper half\n        heapq.heappush(self.min_heap, -heapq.heappop(self.max_heap))\n        # Balance: max_heap can have at most 1 more element\n        if len(self.min_heap) > len(self.max_heap):\n            heapq.heappush(self.max_heap, -heapq.heappop(self.min_heap))\n\n    def findMedian(self) -> float:\n        if len(self.max_heap) > len(self.min_heap):\n            return -self.max_heap[0]\n        return (-self.max_heap[0] + self.min_heap[0]) / 2.0",
    "lineMap": {
      "init": [
        4,
        6
      ],
      "add_num": [
        8
      ],
      "push_max": [
        9
      ],
      "move_to_min": [
        11
      ],
      "balance_check": [
        13
      ],
      "move_to_max": [
        14
      ],
      "find_median": [
        16
      ],
      "median_check": [
        17
      ],
      "median_odd": [
        18
      ],
      "median_even": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        13
      ],
      "odd_count": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MedianFinder {\n    // Max-heap for the lower half\n    private PriorityQueue<Integer> maxHeap;\n    // Min-heap for the upper half\n    private PriorityQueue<Integer> minHeap;\n\n    public MedianFinder() {\n        maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n        minHeap = new PriorityQueue<>();\n    }\n\n    public void addNum(int num) {\n        maxHeap.offer(num);\n        // Ensure every element in maxHeap <= every element in minHeap\n        minHeap.offer(maxHeap.poll());\n        // Balance sizes: maxHeap can have at most 1 more than minHeap\n        if (minHeap.size() > maxHeap.size()) {\n            maxHeap.offer(minHeap.poll());\n        }\n    }\n\n    public double findMedian() {\n        if (maxHeap.size() > minHeap.size()) {\n            return maxHeap.peek();\n        }\n        return (maxHeap.peek() + minHeap.peek()) / 2.0;\n    }\n}",
    "lineMap": {
      "init": [
        8,
        9
      ],
      "add_num": [
        12
      ],
      "push_max": [
        13
      ],
      "move_to_min": [
        15
      ],
      "balance_check": [
        17
      ],
      "move_to_max": [
        18
      ],
      "find_median": [
        22
      ],
      "median_check": [
        23
      ],
      "median_odd": [
        24
      ],
      "median_even": [
        26
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        17
      ],
      "odd_count": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MedianFinder {\n    // Max-heap for the lower half\n    private PriorityQueue<int, int> maxHeap;\n    // Min-heap for the upper half\n    private PriorityQueue<int, int> minHeap;\n\n    public MedianFinder() {\n        maxHeap = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => b - a));\n        minHeap = new PriorityQueue<int, int>();\n    }\n\n    public void AddNum(int num) {\n        maxHeap.Enqueue(num, num);\n        // Move largest of lower half to upper half\n        int top = maxHeap.Dequeue();\n        minHeap.Enqueue(top, top);\n        // Balance sizes\n        if (minHeap.Count > maxHeap.Count) {\n            int minTop = minHeap.Dequeue();\n            maxHeap.Enqueue(minTop, minTop);\n        }\n    }\n\n    public double FindMedian() {\n        if (maxHeap.Count > minHeap.Count) {\n            return maxHeap.Peek();\n        }\n        return (maxHeap.Peek() + minHeap.Peek()) / 2.0;\n    }\n}",
    "lineMap": {
      "init": [
        8,
        9
      ],
      "add_num": [
        12
      ],
      "push_max": [
        13
      ],
      "move_to_min": [
        15,
        16
      ],
      "balance_check": [
        18
      ],
      "move_to_max": [
        19,
        20
      ],
      "find_median": [
        24
      ],
      "median_check": [
        25
      ],
      "median_odd": [
        26
      ],
      "median_even": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        18
      ],
      "odd_count": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MedianFinder {\n    // Max-heap for the lower half\n    priority_queue<int> maxHeap;\n    // Min-heap for the upper half\n    priority_queue<int, vector<int>, greater<int>> minHeap;\npublic:\n    MedianFinder() {}\n\n    void addNum(int num) {\n        maxHeap.push(num);\n        // Move largest of lower half to upper half\n        minHeap.push(maxHeap.top());\n        maxHeap.pop();\n        // Balance sizes\n        if (minHeap.size() > maxHeap.size()) {\n            maxHeap.push(minHeap.top());\n            minHeap.pop();\n        }\n    }\n\n    double findMedian() {\n        if (maxHeap.size() > minHeap.size()) {\n            return maxHeap.top();\n        }\n        return (maxHeap.top() + minHeap.top()) / 2.0;\n    }\n};",
    "lineMap": {
      "init": [
        3,
        5
      ],
      "add_num": [
        9
      ],
      "push_max": [
        10
      ],
      "move_to_min": [
        12,
        13
      ],
      "balance_check": [
        15
      ],
      "move_to_max": [
        16,
        17
      ],
      "find_median": [
        21
      ],
      "median_check": [
        22
      ],
      "median_odd": [
        23
      ],
      "median_even": [
        25
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        15
      ],
      "odd_count": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MaxHeap []int\nfunc (h MaxHeap) Len() int            { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool   { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    val := old[n-1]\n    *h = old[:n-1]\n    return val\n}\n\ntype MinHeap []int\nfunc (h MinHeap) Len() int            { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool   { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    val := old[n-1]\n    *h = old[:n-1]\n    return val\n}\n\ntype MedianFinder struct {\n    maxHeap *MaxHeap\n    minHeap *MinHeap\n}\n\nfunc Constructor() MedianFinder {\n    mx := &MaxHeap{}\n    mn := &MinHeap{}\n    heap.Init(mx)\n    heap.Init(mn)\n    return MedianFinder{maxHeap: mx, minHeap: mn}\n}\n\nfunc (mf *MedianFinder) AddNum(num int) {\n    heap.Push(mf.maxHeap, num)\n    heap.Push(mf.minHeap, heap.Pop(mf.maxHeap))\n    if mf.minHeap.Len() > mf.maxHeap.Len() {\n        heap.Push(mf.maxHeap, heap.Pop(mf.minHeap))\n    }\n}\n\nfunc (mf *MedianFinder) FindMedian() float64 {\n    if mf.maxHeap.Len() > mf.minHeap.Len() {\n        return float64((*mf.maxHeap)[0])\n    }\n    return float64((*mf.maxHeap)[0]+(*mf.minHeap)[0]) / 2.0\n}",
    "lineMap": {
      "init": [
        33,
        34
      ],
      "add_num": [
        40
      ],
      "push_max": [
        41
      ],
      "move_to_min": [
        42
      ],
      "balance_check": [
        43
      ],
      "move_to_max": [
        44
      ],
      "find_median": [
        48
      ],
      "median_check": [
        49
      ],
      "median_odd": [
        50
      ],
      "median_even": [
        52
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        43
      ],
      "odd_count": [
        49
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MedianFinder = function () {\n  // Using arrays with manual heapify for max-heap (negated) and min-heap\n  this.maxHeap = []; // stores negated values for max-heap behavior\n  this.minHeap = [];\n};\n\nMedianFinder.prototype.addNum = function (num) {\n  heapPush(this.maxHeap, -num);\n  heapPush(this.minHeap, -heapPop(this.maxHeap));\n  if (this.minHeap.length > this.maxHeap.length) {\n    heapPush(this.maxHeap, -heapPop(this.minHeap));\n  }\n};\n\nMedianFinder.prototype.findMedian = function () {\n  if (this.maxHeap.length > this.minHeap.length) {\n    return -this.maxHeap[0];\n  }\n  return (-this.maxHeap[0] + this.minHeap[0]) / 2;\n};\n\n// Min-heap helper functions\nfunction heapPush(heap, val) {\n  heap.push(val);\n  var i = heap.length - 1;\n  while (i > 0) {\n    var parent = Math.floor((i - 1) / 2);\n    if (heap[parent] <= heap[i]) break;\n    var temp = heap[parent];\n    heap[parent] = heap[i];\n    heap[i] = temp;\n    i = parent;\n  }\n}\n\nfunction heapPop(heap) {\n  var top = heap[0];\n  var last = heap.pop();\n  if (heap.length > 0) {\n    heap[0] = last;\n    var i = 0;\n    while (true) {\n      var left = 2 * i + 1;\n      var right = 2 * i + 2;\n      var smallest = i;\n      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n      if (smallest === i) break;\n      var temp = heap[i];\n      heap[i] = heap[smallest];\n      heap[smallest] = temp;\n      i = smallest;\n    }\n  }\n  return top;\n}",
    "lineMap": {
      "init": [
        3,
        4
      ],
      "add_num": [
        7
      ],
      "push_max": [
        8
      ],
      "move_to_min": [
        9
      ],
      "balance_check": [
        10
      ],
      "move_to_max": [
        11
      ],
      "find_median": [
        15
      ],
      "median_check": [
        16
      ],
      "median_odd": [
        17
      ],
      "median_even": [
        19
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        10
      ],
      "odd_count": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MedianFinder {\n    private maxHeap: number[]; // stores negated values\n    private minHeap: number[];\n\n    constructor() {\n        this.maxHeap = [];\n        this.minHeap = [];\n    }\n\n    addNum(num: number): void {\n        this.heapPush(this.maxHeap, -num);\n        this.heapPush(this.minHeap, -this.heapPop(this.maxHeap));\n        if (this.minHeap.length > this.maxHeap.length) {\n            this.heapPush(this.maxHeap, -this.heapPop(this.minHeap));\n        }\n    }\n\n    findMedian(): number {\n        if (this.maxHeap.length > this.minHeap.length) {\n            return -this.maxHeap[0];\n        }\n        return (-this.maxHeap[0] + this.minHeap[0]) / 2;\n    }\n\n    private heapPush(heap: number[], val: number): void {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (heap[parent] <= heap[i]) break;\n            [heap[parent], heap[i]] = [heap[i], heap[parent]];\n            i = parent;\n        }\n    }\n\n    private heapPop(heap: number[]): number {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                const left = 2 * i + 1;\n                const right = 2 * i + 2;\n                let smallest = i;\n                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n                if (smallest === i) break;\n                [heap[i], heap[smallest]] = [heap[smallest], heap[i]];\n                i = smallest;\n            }\n        }\n        return top;\n    }\n}",
    "lineMap": {
      "init": [
        6,
        7
      ],
      "add_num": [
        10
      ],
      "push_max": [
        11
      ],
      "move_to_min": [
        12
      ],
      "balance_check": [
        13
      ],
      "move_to_max": [
        14
      ],
      "find_median": [
        18
      ],
      "median_check": [
        19
      ],
      "median_odd": [
        20
      ],
      "median_even": [
        22
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "min_bigger": [
        13
      ],
      "odd_count": [
        19
      ]
    }
  }
};

const FindMedianFromDataStreamPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "numbers": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "numbers": [
        5,
        15,
        1,
        3,
        8,
        7,
        9,
        10,
        20,
        12
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "numbers": [
        10,
        5,
        13,
        4,
        16
      ]
    }
  }
];

function generateFindMedianFromDataStreamSteps(e: any): any[] {
  
let a=e.numbers??[],t=(0,n.createMedianScene)(e,"bucket"),{recorder:i}=t,l=new Map,r=0,d=()=>[...l.keys()].sort((e,a)=>e-a),o=(e,a)=>{d().forEach((a,t)=>{i.update_visual(`bucket_${a}`,{type:"arrayElement",value:a,position:t,zone:n.ZONE.bucket,slot:t,count:l.get(a),scanning:a===e})}),i.update_variable("cursorValue",e),i.update_variable("seen",a),i.update_variable("total",r)};o(null,null),i.record("init","One counter per value, nothing counted yet");let s=(e,a)=>{let t=0;for(let n of d())if(t+=l.get(n),a&&(o(n,t),i.update_variable("rank",e),i.record("rank_scan",`Bucket ${n} holds ${l.get(n)}, seen = ${t}, rank = ${e}`)),t>e)return n;return 0},p=0;for(let e=0;e<a.length;e++){let d=a[e];i.update_variable("i",e),i.update_variable("num",d),o(null,null),i.record("add_num",`addNum(${d})`),l.set(d,(l.get(d)??0)+1),r++,o(d,null),i.record("bump_count",`counts[${d}] = ${l.get(d)}, total = ${r}`),o(null,null),i.record("find_median","findMedian()");let u=r%2==1;if(i.set_conditionals([{key:"odd_count",result:u}]),i.record("median_check",u?`${r} is odd, one middle value`:`${r} is even, two middle values`),u)p=s(r>>1,!0),t.stampMedian(e,p),i.record("median_odd",`Value at rank ${r>>1} is ${(0,n.fmt)(p)}`);else{let a=s((r>>1)-1,!0),l=s(r>>1,!0);p=(a+l)/2,t.stampMedian(e,p),i.record("median_even",`Median = (${a} + ${l}) / 2 = ${(0,n.fmt)(p)}`)}}return o(null,null),i.update_variable("medianKey",null),i.update_variable("result",p),i.record("complete",`All ${a.length} numbers processed, final median = ${(0,n.fmt)(p)}`),t.steps()
}

export function FindMedianFromDataStreamProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindMedianFromDataStreamTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindMedianFromDataStreamSteps(e) as any[];
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
      title="Find Median from Data Stream"
      slug="find-median-from-data-stream"
      approaches={approaches}
      presets={FindMedianFromDataStreamPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// IPO (ipo)
// ==========================================

const IpoTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findMaximizedCapital(self, k: int, w: int, profits: list[int], capital: list[int]) -> int:\n        n = len(profits)\n        projects = sorted(zip(capital, profits))\n\n        max_heap = []  # Python heapq is min-heap, so negate profits\n        idx = 0\n\n        for _ in range(k):\n            # Push all newly affordable projects into the heap\n            while idx < n and projects[idx][0] <= w:\n                heapq.heappush(max_heap, -projects[idx][1])\n                idx += 1\n\n            if not max_heap:\n                break  # No affordable project\n            w += -heapq.heappop(max_heap)\n\n        return w",
    "lineMap": {
      "sort_projects": [
        3,
        4
      ],
      "init": [
        6,
        7
      ],
      "k_loop": [
        9
      ],
      "check_affordable": [
        11
      ],
      "add_to_heap": [
        12,
        13
      ],
      "heap_check": [
        15
      ],
      "take_project": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        9
      ],
      "affordable": [
        11
      ],
      "heap_empty": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {\n        int n = profits.length;\n        int[][] projects = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            projects[i][0] = capital[i];\n            projects[i][1] = profits[i];\n        }\n\n        // Sort by capital requirement ascending\n        Arrays.sort(projects, (a, b) -> a[0] - b[0]);\n\n        // Max-heap of profits\n        PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);\n        int idx = 0;\n\n        for (int round = 0; round < k; round++) {\n            // Push all newly affordable projects into the heap\n            while (idx < n && projects[idx][0] <= w) {\n                maxHeap.offer(projects[idx][1]);\n                idx++;\n            }\n\n            if (maxHeap.isEmpty()) break; // No affordable project\n            w += maxHeap.poll();\n        }\n\n        return w;\n    }\n}",
    "lineMap": {
      "sort_projects": [
        4,
        6,
        7,
        11
      ],
      "init": [
        14,
        15
      ],
      "k_loop": [
        17
      ],
      "check_affordable": [
        19
      ],
      "add_to_heap": [
        20,
        21
      ],
      "heap_check": [
        24
      ],
      "take_project": [
        25
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        17
      ],
      "affordable": [
        19
      ],
      "heap_empty": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FindMaximizedCapital(int k, int w, int[] profits, int[] capital) {\n        int n = profits.Length;\n        int[][] projects = new int[n][];\n        for (int i = 0; i < n; i++) {\n            projects[i] = new int[] { capital[i], profits[i] };\n        }\n\n        // Sort by capital requirement ascending\n        Array.Sort(projects, (a, b) => a[0] - b[0]);\n\n        // Max-heap using PriorityQueue with negated priorities\n        PriorityQueue<int, int> maxHeap = new PriorityQueue<int, int>();\n        int idx = 0;\n\n        for (int round = 0; round < k; round++) {\n            // Push all newly affordable projects into the heap\n            while (idx < n && projects[idx][0] <= w) {\n                maxHeap.Enqueue(projects[idx][1], -projects[idx][1]);\n                idx++;\n            }\n\n            if (maxHeap.Count == 0) break; // No affordable project\n            w += maxHeap.Dequeue();\n        }\n\n        return w;\n    }\n}",
    "lineMap": {
      "sort_projects": [
        4,
        6,
        10
      ],
      "init": [
        13,
        14
      ],
      "k_loop": [
        16
      ],
      "check_affordable": [
        18
      ],
      "add_to_heap": [
        19,
        20
      ],
      "heap_check": [
        23
      ],
      "take_project": [
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        16
      ],
      "affordable": [
        18
      ],
      "heap_empty": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {\n        int n = profits.size();\n        vector<pair<int, int>> projects(n);\n        for (int i = 0; i < n; i++) {\n            projects[i] = {capital[i], profits[i]};\n        }\n\n        // Sort by capital requirement ascending\n        sort(projects.begin(), projects.end());\n\n        // Max-heap of profits\n        priority_queue<int> maxHeap;\n        int idx = 0;\n\n        for (int round = 0; round < k; round++) {\n            // Push all newly affordable projects into the heap\n            while (idx < n && projects[idx].first <= w) {\n                maxHeap.push(projects[idx].second);\n                idx++;\n            }\n\n            if (maxHeap.empty()) break; // No affordable project\n            w += maxHeap.top();\n            maxHeap.pop();\n        }\n\n        return w;\n    }\n};",
    "lineMap": {
      "sort_projects": [
        5,
        7,
        11
      ],
      "init": [
        14,
        15
      ],
      "k_loop": [
        17
      ],
      "check_affordable": [
        19
      ],
      "add_to_heap": [
        20,
        21
      ],
      "heap_check": [
        24
      ],
      "take_project": [
        25,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        17
      ],
      "affordable": [
        19
      ],
      "heap_empty": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaximizedCapital(k int, w int, profits []int, capital []int) int {\n    n := len(profits)\n    projects := make([][2]int, n)\n    for i := 0; i < n; i++ {\n        projects[i] = [2]int{capital[i], profits[i]}\n    }\n\n    // Sort by capital requirement ascending\n    sort.Slice(projects, func(i, j int) bool {\n        return projects[i][0] < projects[j][0]\n    })\n\n    // Max-heap of profits\n    h := &MaxHeap{}\n    heap.Init(h)\n    idx := 0\n\n    for round := 0; round < k; round++ {\n        // Push all newly affordable projects into the heap\n        for idx < n && projects[idx][0] <= w {\n            heap.Push(h, projects[idx][1])\n            idx++\n        }\n\n        if h.Len() == 0 {\n            break // No affordable project\n        }\n        w += heap.Pop(h).(int)\n    }\n\n    return w\n}\n\ntype MaxHeap []int\n\nfunc (h MaxHeap) Len() int            { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool   { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "sort_projects": [
        3,
        5,
        9
      ],
      "init": [
        14,
        15,
        16
      ],
      "k_loop": [
        18
      ],
      "check_affordable": [
        20
      ],
      "add_to_heap": [
        21,
        22
      ],
      "heap_check": [
        25
      ],
      "take_project": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        18
      ],
      "affordable": [
        20
      ],
      "heap_empty": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findMaximizedCapital = function(k, w, profits, capital) {\n    var n = profits.length;\n    var projects = [];\n    for (var i = 0; i < n; i++) {\n        projects.push([capital[i], profits[i]]);\n    }\n\n    // Sort by capital requirement ascending\n    projects.sort(function(a, b) { return a[0] - b[0]; });\n\n    // Max-heap of profits (manual implementation)\n    var heap = [];\n    var idx = 0;\n\n    function heapPush(val) {\n        heap.push(val);\n        var i = heap.length - 1;\n        while (i > 0) {\n            var parent = (i - 1) >> 1;\n            if (heap[parent] >= heap[i]) break;\n            var tmp = heap[parent]; heap[parent] = heap[i]; heap[i] = tmp;\n            i = parent;\n        }\n    }\n\n    function heapPop() {\n        var top = heap[0];\n        var last = heap.pop();\n        if (heap.length > 0) {\n            heap[0] = last;\n            var i = 0;\n            while (true) {\n                var largest = i;\n                var left = 2 * i + 1, right = 2 * i + 2;\n                if (left < heap.length && heap[left] > heap[largest]) largest = left;\n                if (right < heap.length && heap[right] > heap[largest]) largest = right;\n                if (largest === i) break;\n                var tmp = heap[i]; heap[i] = heap[largest]; heap[largest] = tmp;\n                i = largest;\n            }\n        }\n        return top;\n    }\n\n    for (var round = 0; round < k; round++) {\n        // Push all newly affordable projects into the heap\n        while (idx < n && projects[idx][0] <= w) {\n            heapPush(projects[idx][1]);\n            idx++;\n        }\n\n        if (heap.length === 0) break; // No affordable project\n        w += heapPop();\n    }\n\n    return w;\n};",
    "lineMap": {
      "sort_projects": [
        3,
        5,
        9
      ],
      "init": [
        12,
        13
      ],
      "k_loop": [
        45
      ],
      "check_affordable": [
        47
      ],
      "add_to_heap": [
        48,
        49
      ],
      "heap_check": [
        52
      ],
      "take_project": [
        53
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        45
      ],
      "affordable": [
        47
      ],
      "heap_empty": [
        52
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaximizedCapital(k: number, w: number, profits: number[], capital: number[]): number {\n    const n = profits.length;\n    const projects: number[][] = [];\n    for (let i = 0; i < n; i++) {\n        projects.push([capital[i], profits[i]]);\n    }\n\n    // Sort by capital requirement ascending\n    projects.sort((a, b) => a[0] - b[0]);\n\n    // Max-heap of profits (manual implementation)\n    const heap: number[] = [];\n    let idx = 0;\n\n    function heapPush(val: number): void {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            const parent = (i - 1) >> 1;\n            if (heap[parent] >= heap[i]) break;\n            [heap[parent], heap[i]] = [heap[i], heap[parent]];\n            i = parent;\n        }\n    }\n\n    function heapPop(): number {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                let largest = i;\n                const left = 2 * i + 1, right = 2 * i + 2;\n                if (left < heap.length && heap[left] > heap[largest]) largest = left;\n                if (right < heap.length && heap[right] > heap[largest]) largest = right;\n                if (largest === i) break;\n                [heap[i], heap[largest]] = [heap[largest], heap[i]];\n                i = largest;\n            }\n        }\n        return top;\n    }\n\n    for (let round = 0; round < k; round++) {\n        // Push all newly affordable projects into the heap\n        while (idx < n && projects[idx][0] <= w) {\n            heapPush(projects[idx][1]);\n            idx++;\n        }\n\n        if (heap.length === 0) break; // No affordable project\n        w += heapPop();\n    }\n\n    return w;\n}",
    "lineMap": {
      "sort_projects": [
        3,
        5,
        9
      ],
      "init": [
        12,
        13
      ],
      "k_loop": [
        45
      ],
      "check_affordable": [
        47
      ],
      "add_to_heap": [
        48,
        49
      ],
      "heap_check": [
        52
      ],
      "take_project": [
        53
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "more_rounds": [
        45
      ],
      "affordable": [
        47
      ],
      "heap_empty": [
        52
      ]
    }
  }
};

const IpoPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "k": 2,
      "w": 0,
      "profits": [
        1,
        2,
        3
      ],
      "capital": [
        0,
        1,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "k": 3,
      "w": 0,
      "profits": [
        1,
        2,
        3
      ],
      "capital": [
        0,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "k": 2,
      "w": 1,
      "profits": [
        1,
        2,
        3,
        4
      ],
      "capital": [
        0,
        1,
        2,
        3
      ]
    }
  }
];

function generateIpoSteps(e: any): any[] {
  
let t=e.k??0,i=e.profits??[],r=e.capital??[],n=i.length,o=(0,a.createIpoScene)(e,"heap"),{recorder:l}=o,s=r.map((e,t)=>[e,i[t],t]);s.sort((e,t)=>e[0]-t[0]||e[1]-t[1]),s.forEach(([e,t,i],r)=>o.seat(`proj_${i}`,t,a.ZONE.row,r)),l.record("sort_projects",`Sort ${n} projects by capital requirement`);let p=new a.ProfitMaxHeap,d=0,c=e.w??0,f=0;l.update_variable("picked",0),l.update_variable("heapSize",0),l.update_visual("ptr_i",{type:"pointer",position:0,label:"i"}),l.record("init",`Empty heap, capital w = ${c}, up to k = ${t} picks`);for(let e=0;e<t;e++){for(l.set_conditionals([{key:"more_rounds",result:!0}]),l.update_variable("round",e+1),l.record("k_loop",`Round ${e+1} of ${t}`);;){let e=d<n&&s[d][0]<=c;if(l.set_conditionals([{key:"affordable",result:e}]),l.record("check_affordable",e?`Project (capital ${s[d][0]}, profit ${s[d][1]}) is affordable`:`Nothing further is affordable at w = ${c}`),!e)break;let[t,i,a]=s[d];p.push(i,a,`proj_${a}`),o.seatHeap(p.items()),d++,l.update_variable("i",d),l.update_variable("addedKey",`proj_${a}`),l.update_variable("addedCap",t),l.update_variable("addedProfit",i),l.update_visual("ptr_i",{type:"pointer",position:d,label:"i"}),l.record("add_to_heap",`Profit ${i} joins the heap`)}let i=0===p.size();if(l.set_conditionals([{key:"heap_empty",result:i}]),l.record("heap_check",i?`No affordable project left, stop at w = ${c}`:`${p.size()} project(s) waiting in the heap`),i)break;let[r,,u]=p.pop();o.seatHeap(p.items());let h=c;c+=r,f++,o.seat(u,r,a.ZONE.done,f-1),l.update_variable("w",c),l.update_variable("wBefore",h),l.update_variable("takenKey",u),l.update_variable("takenProfit",r),l.update_variable("picked",f),l.record("take_project",`Fund it: w = ${h} + ${r} = ${c}`)}return l.set_conditionals([{key:"more_rounds",result:!1}]),l.update_variable("result",c),l.record("complete",`Funded ${f} projects. Final maximized capital: ${c}`),o.steps()
}

export function IpoProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IpoTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIpoSteps(e) as any[];
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
      title="IPO"
      slug="ipo"
      approaches={approaches}
      presets={IpoPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// K Closest Points to Origin (k-closest-points-to-origin)
// ==========================================

const KClosestPointsToOriginTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:\n        # Python's heapq is a min-heap, so negate distances for max-heap behavior\n        max_heap = []\n\n        for x, y in points:\n            dist = -(x * x + y * y)  # Negate for max-heap\n            if len(max_heap) < k:\n                heapq.heappush(max_heap, (dist, x, y))\n            elif dist > max_heap[0][0]:\n                heapq.heapreplace(max_heap, (dist, x, y))\n\n        return [[x, y] for (_, x, y) in max_heap]",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4
      ],
      "check_point": [
        7
      ],
      "add_to_heap": [
        9
      ],
      "heap_full": [
        10
      ],
      "replace_max": [
        11
      ],
      "skip_point": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "heap_has_room": [
        8
      ],
      "heap_replace_max": [
        10
      ],
      "closer_than_max": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        // Max-heap ordered by squared distance (farthest on top)\n        PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) ->\n            (b[0] * b[0] + b[1] * b[1]) - (a[0] * a[0] + a[1] * a[1])\n        );\n\n        for (int[] point : points) {\n            int dist = point[0] * point[0] + point[1] * point[1];\n            if (maxHeap.size() < k) {\n                // Heap not full yet, add the point\n                maxHeap.offer(point);\n            } else {\n                int[] farthest = maxHeap.peek();\n                int maxDist = farthest[0] * farthest[0] + farthest[1] * farthest[1];\n                if (dist < maxDist) {\n                    // Closer than the farthest kept point, replace it\n                    maxHeap.poll();\n                    maxHeap.offer(point);\n                }\n            }\n        }\n\n        int[][] result = new int[k][2];\n        for (int i = 0; i < k; i++) {\n            result[i] = maxHeap.poll();\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_point": [
        9
      ],
      "add_to_heap": [
        12
      ],
      "heap_full": [
        14,
        15
      ],
      "replace_max": [
        18,
        19
      ],
      "skip_point": [
        16
      ],
      "complete": [
        24,
        25,
        26,
        27,
        28
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "heap_has_room": [
        10
      ],
      "heap_replace_max": [
        13
      ],
      "closer_than_max": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n        // Max-heap: largest distance on top\n        auto cmp = [](const vector<int>& a, const vector<int>& b) {\n            return (a[0] * a[0] + a[1] * a[1]) < (b[0] * b[0] + b[1] * b[1]);\n        };\n        priority_queue<vector<int>, vector<vector<int>>, decltype(cmp)> maxHeap(cmp);\n\n        for (auto& point : points) {\n            int dist = point[0] * point[0] + point[1] * point[1];\n            if ((int)maxHeap.size() < k) {\n                // Heap not full yet, add the point\n                maxHeap.push(point);\n            } else {\n                const vector<int>& farthest = maxHeap.top();\n                int maxDist = farthest[0] * farthest[0] + farthest[1] * farthest[1];\n                if (dist < maxDist) {\n                    // Closer than the farthest kept point, replace it\n                    maxHeap.pop();\n                    maxHeap.push(point);\n                }\n            }\n        }\n\n        vector<vector<int>> result;\n        while (!maxHeap.empty()) {\n            result.push_back(maxHeap.top());\n            maxHeap.pop();\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        5,
        6,
        7,
        8
      ],
      "check_point": [
        11
      ],
      "add_to_heap": [
        14
      ],
      "heap_full": [
        16,
        17
      ],
      "replace_max": [
        20,
        21
      ],
      "skip_point": [
        18
      ],
      "complete": [
        26,
        27,
        28,
        29,
        30,
        31
      ]
    },
    "conditionalMap": {
      "for_loop": [
        10
      ],
      "heap_has_room": [
        12
      ],
      "heap_replace_max": [
        15
      ],
      "closer_than_max": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[][] KClosest(int[][] points, int k) {\n        // Max-heap: farthest point on top\n        PriorityQueue<int[], int> maxHeap = new PriorityQueue<int[], int>(\n            Comparer<int>.Create((a, b) => b - a)\n        );\n\n        foreach (int[] point in points) {\n            int dist = point[0] * point[0] + point[1] * point[1];\n            if (maxHeap.Count < k) {\n                // Heap not full yet, add the point\n                maxHeap.Enqueue(point, dist);\n            } else {\n                maxHeap.TryPeek(out _, out int maxDist);\n                if (dist < maxDist) {\n                    // Closer than the farthest kept point, replace it\n                    maxHeap.Dequeue();\n                    maxHeap.Enqueue(point, dist);\n                }\n            }\n        }\n\n        int[][] result = new int[k][];\n        for (int i = 0; i < k; i++) {\n            result[i] = maxHeap.Dequeue();\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        4,
        5,
        6
      ],
      "check_point": [
        9
      ],
      "add_to_heap": [
        12
      ],
      "heap_full": [
        14
      ],
      "replace_max": [
        17,
        18
      ],
      "skip_point": [
        15
      ],
      "complete": [
        23,
        24,
        25,
        26,
        27
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "heap_has_room": [
        10
      ],
      "heap_replace_max": [
        13
      ],
      "closer_than_max": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func kClosest(points [][]int, k int) [][]int {\n    // Use a max-heap via sort interface\n    h := &maxHeap{}\n    heap.Init(h)\n\n    for _, point := range points {\n        dist := point[0]*point[0] + point[1]*point[1]\n        if h.Len() < k {\n            // Heap not full yet, add the point\n            heap.Push(h, point)\n        } else {\n            farthest := (*h)[0]\n            maxDist := farthest[0]*farthest[0] + farthest[1]*farthest[1]\n            if dist < maxDist {\n                // Closer than the farthest kept point, replace it\n                heap.Pop(h)\n                heap.Push(h, point)\n            }\n        }\n    }\n\n    result := make([][]int, k)\n    for i := 0; i < k; i++ {\n        result[i] = heap.Pop(h).([]int)\n    }\n    return result\n}\n\ntype maxHeap [][]int\n\nfunc (h maxHeap) Len() int { return len(h) }\nfunc (h maxHeap) Less(i, j int) bool {\n    return h[i][0]*h[i][0]+h[i][1]*h[i][1] > h[j][0]*h[j][0]+h[j][1]*h[j][1]\n}\nfunc (h maxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }\nfunc (h *maxHeap) Push(x interface{}) { *h = append(*h, x.([]int)) }\nfunc (h *maxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "check_point": [
        7
      ],
      "add_to_heap": [
        10
      ],
      "heap_full": [
        12,
        13
      ],
      "replace_max": [
        16,
        17
      ],
      "skip_point": [
        14
      ],
      "complete": [
        22,
        23,
        24,
        25,
        26
      ]
    },
    "conditionalMap": {
      "for_loop": [
        6
      ],
      "heap_has_room": [
        8
      ],
      "heap_replace_max": [
        11
      ],
      "closer_than_max": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var kClosest = function(points, k) {\n    // Max-heap of [distance, x, y], farthest point on top\n    var heap = [];\n    function up(i) {\n        while (i > 0) {\n            var p = (i - 1) >> 1;\n            if (heap[p][0] >= heap[i][0]) break;\n            var t = heap[p]; heap[p] = heap[i]; heap[i] = t;\n            i = p;\n        }\n    }\n    function down(i) {\n        var n = heap.length;\n        while (true) {\n            var l = 2 * i + 1, r = 2 * i + 2, m = i;\n            if (l < n && heap[l][0] > heap[m][0]) m = l;\n            if (r < n && heap[r][0] > heap[m][0]) m = r;\n            if (m === i) break;\n            var t = heap[m]; heap[m] = heap[i]; heap[i] = t;\n            i = m;\n        }\n    }\n\n    for (var i = 0; i < points.length; i++) {\n        var x = points[i][0], y = points[i][1];\n        var dist = x * x + y * y;\n        if (heap.length < k) {\n            // Heap not full yet, add the point\n            heap.push([dist, x, y]);\n            up(heap.length - 1);\n        } else if (dist < heap[0][0]) {\n            // Closer than the farthest kept point, replace it\n            heap[0] = [dist, x, y];\n            down(0);\n        }\n    }\n\n    var result = [];\n    for (var j = 0; j < heap.length; j++) {\n        result.push([heap[j][1], heap[j][2]]);\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "check_point": [
        26
      ],
      "add_to_heap": [
        29,
        30
      ],
      "heap_full": [
        31
      ],
      "replace_max": [
        33,
        34
      ],
      "skip_point": [
        31
      ],
      "complete": [
        38,
        39,
        40,
        41,
        42
      ]
    },
    "conditionalMap": {
      "for_loop": [
        24
      ],
      "heap_has_room": [
        27
      ],
      "heap_replace_max": [
        31
      ],
      "closer_than_max": [
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function kClosest(points: number[][], k: number): number[][] {\n    // Max-heap of [distance, x, y], farthest point on top\n    const heap: [number, number, number][] = [];\n    const up = (i: number): void => {\n        while (i > 0) {\n            const p = (i - 1) >> 1;\n            if (heap[p][0] >= heap[i][0]) break;\n            [heap[p], heap[i]] = [heap[i], heap[p]];\n            i = p;\n        }\n    };\n    const down = (i: number): void => {\n        const n = heap.length;\n        while (true) {\n            const l = 2 * i + 1, r = 2 * i + 2;\n            let m = i;\n            if (l < n && heap[l][0] > heap[m][0]) m = l;\n            if (r < n && heap[r][0] > heap[m][0]) m = r;\n            if (m === i) break;\n            [heap[m], heap[i]] = [heap[i], heap[m]];\n            i = m;\n        }\n    };\n\n    for (const [x, y] of points) {\n        const dist = x * x + y * y;\n        if (heap.length < k) {\n            // Heap not full yet, add the point\n            heap.push([dist, x, y]);\n            up(heap.length - 1);\n        } else if (dist < heap[0][0]) {\n            // Closer than the farthest kept point, replace it\n            heap[0] = [dist, x, y];\n            down(0);\n        }\n    }\n\n    return heap.map(entry => [entry[1], entry[2]]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "check_point": [
        26
      ],
      "add_to_heap": [
        29,
        30
      ],
      "heap_full": [
        31
      ],
      "replace_max": [
        33,
        34
      ],
      "skip_point": [
        31
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "for_loop": [
        25
      ],
      "heap_has_room": [
        27
      ],
      "heap_replace_max": [
        31
      ],
      "closer_than_max": [
        31
      ]
    }
  }
};

const KClosestPointsToOriginPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small (k=2)",
    "value": {
      "points": [
        [
          1,
          3
        ],
        [
          -2,
          2
        ],
        [
          5,
          8
        ],
        [
          0,
          1
        ],
        [
          -3,
          -1
        ]
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Medium (k=3)",
    "value": {
      "points": [
        [
          3,
          3
        ],
        [
          5,
          -1
        ],
        [
          -2,
          4
        ],
        [
          1,
          1
        ],
        [
          -4,
          -3
        ],
        [
          2,
          -2
        ]
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Two points (k=1)",
    "value": {
      "points": [
        [
          1,
          3
        ],
        [
          -2,
          2
        ]
      ],
      "k": 1
    }
  },
  {
    "id": "ex4",
    "label": "Equal distance",
    "value": {
      "points": [
        [
          0,
          1
        ],
        [
          1,
          0
        ]
      ],
      "k": 2
    }
  }
];

function generateKClosestPointsToOriginSteps(t: any): any[] {
  
let e=t.points,i=t.k,a=t=>t[0]*t[0]+t[1]*t[1],o=t=>Math.round(10*Math.sqrt(a(t)))/10,r={};e.forEach((t,e)=>{let[i,n]=t;r[`point_${e}`]={type:"point2D",x:i,y:n,distance:o(t),index:e,label:`[${i},${n}]`,state:"default"},r[`slot_${e}`]={type:"arrayElement",value:a(t),position:e,x:i,y:n,state:"default"}});let s=new StepRecorder({mode:"sort",k:i,n:e.length},{...r});s.record("-",`Find the ${i} closest of ${e.length} points to the origin`);let p=(t,i,n)=>{let[o,r]=e[t];s.update_visual(`slot_${t}`,{type:"arrayElement",value:a(e[t]),position:i,x:o,y:r,state:n})},l=e.map((t,e)=>({idx:e,d:a(t)})).sort((t,e)=>t.d-e.d||t.idx-e.idx);l.forEach((t,e)=>p(t.idx,e,"default")),s.record("sort_points",`Sort all ${e.length} points by squared distance: [${l.map(t=>t.d).join(", ")}]`);let d=l.slice(0,i);return d.forEach((t,i)=>{p(t.idx,i,"result");let[n,a]=e[t.idx];s.update_visual(`point_${t.idx}`,{type:"point2D",x:n,y:a,distance:o(e[t.idx]),index:t.idx,label:`[${n},${a}]`,state:"result"})}),s.update_variable("result",d.map(t=>t.idx)),s.record("take_k",`Take the first ${i}: the ${i} closest points`),s.record("complete",`Closest ${i}: ${d.map(t=>`[${e[t.idx].join(",")}]`).join(", ")}`),s.getSteps()
}

export function KClosestPointsToOriginProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KClosestPointsToOriginTemplates,
      generateSteps: (t: any) => {
        const recorded = generateKClosestPointsToOriginSteps(t) as any[];
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
      title="K Closest Points to Origin"
      slug="k-closest-points-to-origin"
      approaches={approaches}
      presets={KClosestPointsToOriginPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find K Pairs with Smallest Sums (find-k-pairs-with-smallest-sums)
// ==========================================

const FindKPairsWithSmallestSumsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def kSmallestPairs(self, nums1: list[int], nums2: list[int], k: int) -> list[list[int]]:\n        result = []\n        heap = []\n\n        # Seed heap with first column for each row\n        for i in range(min(k, len(nums1))):\n            heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))\n\n        while heap and len(result) < k:\n            total, i, j = heapq.heappop(heap)\n            result.append([nums1[i], nums2[j]])\n\n            # Push the next pair in the same row\n            if j + 1 < len(nums2):\n                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "seed_push": [
        7,
        8
      ],
      "extract_start": [
        10
      ],
      "poll": [
        11
      ],
      "add_to_result": [
        12
      ],
      "no_next": [
        15
      ],
      "push_next": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_next": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {\n        List<List<Integer>> result = new ArrayList<>();\n        // Min-heap: [sum, index in nums1, index in nums2]\n        // Compare, don't subtract: a sum can be 2*10^9, so a[0] - b[0] can overflow int.\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));\n\n        // Seed heap with first column for each row\n        for (int i = 0; i < Math.min(k, nums1.length); i++) {\n            heap.offer(new int[]{nums1[i] + nums2[0], i, 0});\n        }\n\n        while (!heap.isEmpty() && result.size() < k) {\n            int[] top = heap.poll();\n            int i = top[1];\n            int j = top[2];\n            List<Integer> pair = new ArrayList<>();\n            pair.add(nums1[i]);\n            pair.add(nums2[j]);\n            result.add(pair);\n\n            // Push the next pair in the same row\n            if (j + 1 < nums2.length) {\n                heap.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});\n            }\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "seed_push": [
        9,
        10
      ],
      "extract_start": [
        13
      ],
      "poll": [
        14,
        15,
        16
      ],
      "add_to_result": [
        17,
        18,
        19,
        20
      ],
      "no_next": [
        23
      ],
      "push_next": [
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "has_next": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {\n        vector<vector<int>> result;\n        // Min-heap: {sum, index in nums1, index in nums2}\n        priority_queue<tuple<int, int, int>, vector<tuple<int, int, int>>, greater<>> heap;\n\n        // Seed heap with first column for each row\n        for (int i = 0; i < min(k, (int)nums1.size()); i++) {\n            heap.push({nums1[i] + nums2[0], i, 0});\n        }\n\n        while (!heap.empty() && (int)result.size() < k) {\n            auto [sum, i, j] = heap.top();\n            heap.pop();\n            result.push_back({nums1[i], nums2[j]});\n\n            // Push the next pair in the same row\n            if (j + 1 < (int)nums2.size()) {\n                heap.push({nums1[i] + nums2[j + 1], i, j + 1});\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "seed_push": [
        9,
        10
      ],
      "extract_start": [
        13
      ],
      "poll": [
        14,
        15
      ],
      "add_to_result": [
        16
      ],
      "no_next": [
        19
      ],
      "push_next": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_next": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<IList<int>> KSmallestPairs(int[] nums1, int[] nums2, int k) {\n        IList<IList<int>> result = new List<IList<int>>();\n        // Min-heap: (sum, index in nums1, index in nums2)\n        var heap = new PriorityQueue<int[], int>();\n\n        // Seed heap with first column for each row\n        for (int i = 0; i < Math.Min(k, nums1.Length); i++) {\n            heap.Enqueue(new int[]{i, 0}, nums1[i] + nums2[0]);\n        }\n\n        while (heap.Count > 0 && result.Count < k) {\n            int[] top = heap.Dequeue();\n            int i = top[0];\n            int j = top[1];\n            result.Add(new List<int>{nums1[i], nums2[j]});\n\n            // Push the next pair in the same row\n            if (j + 1 < nums2.Length) {\n                heap.Enqueue(new int[]{i, j + 1}, nums1[i] + nums2[j + 1]);\n            }\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "seed_push": [
        8,
        9
      ],
      "extract_start": [
        12
      ],
      "poll": [
        13,
        14,
        15
      ],
      "add_to_result": [
        16
      ],
      "no_next": [
        19
      ],
      "push_next": [
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "has_next": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func kSmallestPairs(nums1 []int, nums2 []int, k int) [][]int {\n    result := [][]int{}\n    h := &minHeap{}\n    heap.Init(h)\n\n    // Seed heap with first column for each row\n    limit := k\n    if len(nums1) < limit {\n        limit = len(nums1)\n    }\n    for i := 0; i < limit; i++ {\n        heap.Push(h, [3]int{nums1[i] + nums2[0], i, 0})\n    }\n\n    for h.Len() > 0 && len(result) < k {\n        top := heap.Pop(h).([3]int)\n        i, j := top[1], top[2]\n        result = append(result, []int{nums1[i], nums2[j]})\n\n        // Push the next pair in the same row\n        if j+1 < len(nums2) {\n            heap.Push(h, [3]int{nums1[i] + nums2[j+1], i, j + 1})\n        }\n    }\n    return result\n}\n\ntype minHeap [][3]int\n\nfunc (h minHeap) Len() int            { return len(h) }\nfunc (h minHeap) Less(a, b int) bool   { return h[a][0] < h[b][0] }\nfunc (h minHeap) Swap(a, b int)        { h[a], h[b] = h[b], h[a] }\nfunc (h *minHeap) Push(x interface{})  { *h = append(*h, x.([3]int)) }\nfunc (h *minHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "seed_push": [
        11,
        12
      ],
      "extract_start": [
        15
      ],
      "poll": [
        16,
        17
      ],
      "add_to_result": [
        18
      ],
      "no_next": [
        21
      ],
      "push_next": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "has_next": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var kSmallestPairs = function(nums1, nums2, k) {\n    var result = [];\n    // Simple min-heap using array with manual sift operations\n    var heap = [];\n\n    function siftUp(i) {\n        while (i > 0) {\n            var parent = Math.floor((i - 1) / 2);\n            if (heap[parent][0] > heap[i][0]) {\n                var temp = heap[parent];\n                heap[parent] = heap[i];\n                heap[i] = temp;\n                i = parent;\n            } else break;\n        }\n    }\n\n    function siftDown(i) {\n        var n = heap.length;\n        while (2 * i + 1 < n) {\n            var smallest = i;\n            var left = 2 * i + 1;\n            var right = 2 * i + 2;\n            if (left < n && heap[left][0] < heap[smallest][0]) smallest = left;\n            if (right < n && heap[right][0] < heap[smallest][0]) smallest = right;\n            if (smallest !== i) {\n                var temp = heap[smallest];\n                heap[smallest] = heap[i];\n                heap[i] = temp;\n                i = smallest;\n            } else break;\n        }\n    }\n\n    function push(val) { heap.push(val); siftUp(heap.length - 1); }\n    function pop() {\n        var top = heap[0];\n        heap[0] = heap[heap.length - 1];\n        heap.pop();\n        if (heap.length > 0) siftDown(0);\n        return top;\n    }\n\n    // Seed heap with first column for each row\n    for (var i = 0; i < Math.min(k, nums1.length); i++) {\n        push([nums1[i] + nums2[0], i, 0]);\n    }\n\n    while (heap.length > 0 && result.length < k) {\n        var top = pop();\n        var idx1 = top[1];\n        var idx2 = top[2];\n        result.push([nums1[idx1], nums2[idx2]]);\n\n        // Push the next pair in the same row\n        if (idx2 + 1 < nums2.length) {\n            push([nums1[idx1] + nums2[idx2 + 1], idx1, idx2 + 1]);\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "seed_push": [
        45,
        46
      ],
      "extract_start": [
        49
      ],
      "poll": [
        50,
        51,
        52
      ],
      "add_to_result": [
        53
      ],
      "no_next": [
        56
      ],
      "push_next": [
        57
      ],
      "complete": [
        60
      ]
    },
    "conditionalMap": {
      "has_next": [
        56
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {\n    const result: number[][] = [];\n    const heap: number[][] = [];\n\n    function siftUp(i: number): void {\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (heap[parent][0] > heap[i][0]) {\n                [heap[parent], heap[i]] = [heap[i], heap[parent]];\n                i = parent;\n            } else break;\n        }\n    }\n\n    function siftDown(i: number): void {\n        const n = heap.length;\n        while (2 * i + 1 < n) {\n            let smallest = i;\n            const left = 2 * i + 1;\n            const right = 2 * i + 2;\n            if (left < n && heap[left][0] < heap[smallest][0]) smallest = left;\n            if (right < n && heap[right][0] < heap[smallest][0]) smallest = right;\n            if (smallest !== i) {\n                [heap[smallest], heap[i]] = [heap[i], heap[smallest]];\n                i = smallest;\n            } else break;\n        }\n    }\n\n    function push(val: number[]): void { heap.push(val); siftUp(heap.length - 1); }\n    function pop(): number[] {\n        const top = heap[0];\n        heap[0] = heap[heap.length - 1];\n        heap.pop();\n        if (heap.length > 0) siftDown(0);\n        return top;\n    }\n\n    // Seed heap with first column for each row\n    for (let i = 0; i < Math.min(k, nums1.length); i++) {\n        push([nums1[i] + nums2[0], i, 0]);\n    }\n\n    while (heap.length > 0 && result.length < k) {\n        const top = pop();\n        const idx1 = top[1];\n        const idx2 = top[2];\n        result.push([nums1[idx1], nums2[idx2]]);\n\n        // Push the next pair in the same row\n        if (idx2 + 1 < nums2.length) {\n            push([nums1[idx1] + nums2[idx2 + 1], idx1, idx2 + 1]);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "seed_push": [
        40,
        41
      ],
      "extract_start": [
        44
      ],
      "poll": [
        45,
        46,
        47
      ],
      "add_to_result": [
        48
      ],
      "no_next": [
        51
      ],
      "push_next": [
        52
      ],
      "complete": [
        55
      ]
    },
    "conditionalMap": {
      "has_next": [
        51
      ]
    }
  }
};

const FindKPairsWithSmallestSumsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums1": [
        1,
        7,
        11
      ],
      "nums2": [
        2,
        4,
        6
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums1": [
        1,
        1,
        2
      ],
      "nums2": [
        1,
        2,
        3
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums1": [
        1,
        2,
        4,
        5,
        6
      ],
      "nums2": [
        3,
        5,
        7,
        9
      ],
      "k": 5
    }
  }
];

function generateFindKPairsWithSmallestSumsSteps(e: any): any[] {
  class l{less(e,t){return e.sum!==t.sum?e.sum<t.sum:e.i!==t.i?e.i<t.i:e.j<t.j}push(e){this.heap.push(e);let t=this.heap.length-1;for(;t>0;){let e=Math.floor((t-1)/2);if(!this.less(this.heap[t],this.heap[e]))break;[this.heap[t],this.heap[e]]=[this.heap[e],this.heap[t]],t=e}}pop(){if(0===this.heap.length)return;let e=this.heap[0],t=this.heap.pop();if(this.heap.length>0){this.heap[0]=t;let e=0;for(;;){let t=e,i=2*e+1,a=2*e+2;if(i<this.heap.length&&this.less(this.heap[i],this.heap[t])&&(t=i),a<this.heap.length&&this.less(this.heap[a],this.heap[t])&&(t=a),t===e)break;[this.heap[e],this.heap[t]]=[this.heap[t],this.heap[e]],e=t}}return e}size(){return this.heap.length}isEmpty(){return 0===this.heap.length}items(){return[...this.heap]}constructor(){this.heap=[]}}
let{nums1:t,nums2:i,k:n}=e,s={};t.forEach((e,t)=>{s[`nums1_${t}`]={type:"arrayElement",value:e,position:t}}),i.forEach((e,t)=>{s[`nums2_${t}`]={type:"arrayElement",value:e,position:t}});let r=new StepRecorder({mode:"heap",k:n,found:0,heapSize:0,pushedKey:null,poppedKey:null},s);if(r.record("-",`Find the ${n} pairs (a, b) with the smallest sums, one value from each sorted array`),0===t.length||0===i.length||0===n)return r.update_variable("resultText","[]"),r.record("complete","Empty input, so the result is empty"),r.getSteps();let u=new l,o=0,p=()=>{u.items().forEach((e,a)=>{r.update_visual(e.key,{type:"arrayElement",value:e.sum,position:a,zone:"heap",slot:a,a:t[e.i],b:i[e.j]})})},h=Math.min(t.length,n);for(let e=0;e<h;e++){let a=`pair_${o++}`,l=t[e]+i[0];u.push({sum:l,i:e,j:0,key:a}),p(),r.update_variable("heapSize",u.size()),r.update_variable("i",e),r.update_variable("j",0),r.update_variable("a",t[e]),r.update_variable("b",i[0]),r.update_variable("sum",l),r.update_variable("pushedKey",a),r.update_variable("poppedKey",null),r.record("seed_push",`Seed the heap with pair (${t[e]}, ${i[0]}), sum ${l}`)}r.update_variable("pushedKey",null),r.record("extract_start",`Heap holds ${h} candidate pairs, pop the smallest sum ${n} times`);let d=[];for(;d.length<n&&!u.isEmpty();){let e=u.pop(),a=t[e.i],l=i[e.j];if(r.update_visual(e.key,{type:"arrayElement",value:e.sum,position:0,zone:"hold",slot:0,a,b:l}),p(),r.update_variable("heapSize",u.size()),r.update_variable("i",e.i),r.update_variable("j",e.j),r.update_variable("a",a),r.update_variable("b",l),r.update_variable("sum",e.sum),r.update_variable("poppedKey",e.key),r.update_variable("pushedKey",null),r.record("poll",`Pop the smallest sum ${e.sum}: pair (${a}, ${l})`),d.push([a,l]),r.update_visual(e.key,{type:"arrayElement",value:e.sum,position:d.length-1,zone:"res",slot:d.length-1,a,b:l}),r.update_variable("found",d.length),r.record("add_to_result",`Add (${a}, ${l}) to the result, ${d.length} of ${n} found`),e.j+1<i.length){let l=e.j+1,n=t[e.i]+i[l],s=`pair_${o++}`;u.push({sum:n,i:e.i,j:l,key:s}),p(),r.update_variable("heapSize",u.size()),r.update_variable("j",l),r.update_variable("b",i[l]),r.update_variable("sum",n),r.update_variable("pushedKey",s),r.update_variable("poppedKey",null),r.add_conditional("has_next",!0),r.record("push_next",`Advance the row: push (${a}, ${i[l]}), sum ${n}`)}else r.update_variable("pushedKey",null),r.update_variable("poppedKey",null),r.add_conditional("has_next",!1),r.record("no_next",`(${a}, ${l}) used the last value of nums2, nothing to push`)}return r.update_variable("pushedKey",null),r.update_variable("poppedKey",null),r.update_variable("resultText",`[${d.map(([e,t])=>`(${e},${t})`).join(" ")}]`),r.record("complete",d.length===n?`All ${n} smallest pairs extracted`:`Heap exhausted after ${d.length} pairs, fewer than ${n} exist`),r.getSteps()
}

export function FindKPairsWithSmallestSumsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindKPairsWithSmallestSumsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindKPairsWithSmallestSumsSteps(e) as any[];
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
      title="Find K Pairs with Smallest Sums"
      slug="find-k-pairs-with-smallest-sums"
      approaches={approaches}
      presets={FindKPairsWithSmallestSumsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Merge k Sorted Lists (merge-k-sorted-lists)
// ==========================================

const MergeKSortedListsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def mergeKLists(self, lists: list[Optional[ListNode]]) -> Optional[ListNode]:\n        heap = []\n        # Push head of each non-empty list (use index as tiebreaker)\n        for i, node in enumerate(lists):\n            if node:\n                heapq.heappush(heap, (node.val, i, node))\n\n        dummy = ListNode(0)\n        current = dummy\n\n        while heap:\n            # Pop the smallest node\n            val, idx, smallest = heapq.heappop(heap)\n            current.next = smallest\n            current = current.next\n\n            # Push the next node from the same list\n            if smallest.next:\n                heapq.heappush(heap, (smallest.next.val, idx, smallest.next))\n\n        return dummy.next",
    "lineMap": {
      "-": [
        2
      ],
      "initialize_heap": [
        3
      ],
      "add_to_heap": [
        6,
        7
      ],
      "create_dummy": [
        9,
        10
      ],
      "poll_from_heap": [
        14
      ],
      "add_to_result": [
        15,
        16
      ],
      "no_next": [
        19
      ],
      "add_next_to_heap": [
        20
      ],
      "return": [
        22
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        6
      ],
      "main_loop": [
        12
      ],
      "next_exists": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Min-heap ordered by node value\n        PriorityQueue<ListNode> heap = new PriorityQueue<>(\n            (a, b) -> a.val - b.val\n        );\n\n        // Push the head of each non-empty list\n        for (ListNode node : lists) {\n            if (node != null) {\n                heap.offer(node);\n            }\n        }\n\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n\n        while (!heap.isEmpty()) {\n            // Pop the smallest node\n            ListNode smallest = heap.poll();\n            current.next = smallest;\n            current = current.next;\n\n            // Push the next node from the same list\n            if (smallest.next != null) {\n                heap.offer(smallest.next);\n            }\n        }\n\n        return dummy.next;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize_heap": [
        4,
        5,
        6
      ],
      "add_to_heap": [
        10,
        11
      ],
      "create_dummy": [
        15,
        16
      ],
      "poll_from_heap": [
        20
      ],
      "add_to_result": [
        21,
        22
      ],
      "no_next": [
        25
      ],
      "add_next_to_heap": [
        26
      ],
      "return": [
        30
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        10
      ],
      "main_loop": [
        18
      ],
      "next_exists": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Min-heap ordered by node value\n        auto cmp = [](ListNode* a, ListNode* b) {\n            return a->val > b->val;\n        };\n        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);\n\n        // Push head of each non-empty list\n        for (ListNode* node : lists) {\n            if (node != nullptr) {\n                heap.push(node);\n            }\n        }\n\n        ListNode dummy(0);\n        ListNode* current = &dummy;\n\n        while (!heap.empty()) {\n            // Pop the smallest node\n            ListNode* smallest = heap.top();\n            heap.pop();\n            current->next = smallest;\n            current = current->next;\n\n            // Push the next node from the same list\n            if (smallest->next != nullptr) {\n                heap.push(smallest->next);\n            }\n        }\n\n        return dummy.next;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize_heap": [
        5,
        6,
        7,
        8
      ],
      "add_to_heap": [
        12,
        13
      ],
      "create_dummy": [
        17,
        18
      ],
      "poll_from_heap": [
        22,
        23
      ],
      "add_to_result": [
        24,
        25
      ],
      "no_next": [
        28
      ],
      "add_next_to_heap": [
        29
      ],
      "return": [
        33
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        12
      ],
      "main_loop": [
        20
      ],
      "next_exists": [
        28
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public ListNode MergeKLists(ListNode[] lists) {\n        // Min-heap ordered by node value\n        PriorityQueue<ListNode, int> heap = new PriorityQueue<ListNode, int>();\n\n        // Push head of each non-empty list\n        foreach (ListNode node in lists) {\n            if (node != null) {\n                heap.Enqueue(node, node.val);\n            }\n        }\n\n        ListNode dummy = new ListNode(0);\n        ListNode current = dummy;\n\n        while (heap.Count > 0) {\n            // Pop the smallest node\n            ListNode smallest = heap.Dequeue();\n            current.next = smallest;\n            current = current.next;\n\n            // Push the next node from the same list\n            if (smallest.next != null) {\n                heap.Enqueue(smallest.next, smallest.next.val);\n            }\n        }\n\n        return dummy.next;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize_heap": [
        4
      ],
      "add_to_heap": [
        8,
        9
      ],
      "create_dummy": [
        13,
        14
      ],
      "poll_from_heap": [
        18
      ],
      "add_to_result": [
        19,
        20
      ],
      "no_next": [
        23
      ],
      "add_next_to_heap": [
        24
      ],
      "return": [
        28
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        8
      ],
      "main_loop": [
        16
      ],
      "next_exists": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MinHeap []*ListNode\n\nfunc (h MinHeap) Len() int            { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool   { return h[i].Val < h[j].Val }\nfunc (h MinHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{})  { *h = append(*h, x.(*ListNode)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    node := old[n-1]\n    *h = old[:n-1]\n    return node\n}\n\nfunc mergeKLists(lists []*ListNode) *ListNode {\n    h := &MinHeap{}\n    heap.Init(h)\n\n    // Push head of each non-empty list\n    for _, node := range lists {\n        if node != nil {\n            heap.Push(h, node)\n        }\n    }\n\n    dummy := &ListNode{}\n    current := dummy\n\n    for h.Len() > 0 {\n        // Pop the smallest node\n        smallest := heap.Pop(h).(*ListNode)\n        current.Next = smallest\n        current = current.Next\n\n        // Push the next node from the same list\n        if smallest.Next != nil {\n            heap.Push(h, smallest.Next)\n        }\n    }\n\n    return dummy.Next\n}",
    "lineMap": {
      "-": [
        15
      ],
      "initialize_heap": [
        16,
        17
      ],
      "add_to_heap": [
        21,
        22
      ],
      "create_dummy": [
        26,
        27
      ],
      "poll_from_heap": [
        31
      ],
      "add_to_result": [
        32,
        33
      ],
      "no_next": [
        36
      ],
      "add_next_to_heap": [
        37
      ],
      "return": [
        41
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        21
      ],
      "main_loop": [
        29
      ],
      "next_exists": [
        36
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var mergeKLists = function (lists) {\n  // Simple min-heap implementation\n  var heap = [];\n\n  function heapPush(node) {\n    heap.push(node);\n    var i = heap.length - 1;\n    while (i > 0) {\n      var parent = Math.floor((i - 1) / 2);\n      if (heap[parent].val > heap[i].val) {\n        var temp = heap[parent];\n        heap[parent] = heap[i];\n        heap[i] = temp;\n        i = parent;\n      } else {\n        break;\n      }\n    }\n  }\n\n  function heapPop() {\n    var min = heap[0];\n    var last = heap.pop();\n    if (heap.length > 0) {\n      heap[0] = last;\n      var i = 0;\n      while (true) {\n        var left = 2 * i + 1;\n        var right = 2 * i + 2;\n        var smallest = i;\n        if (left < heap.length && heap[left].val < heap[smallest].val) {\n          smallest = left;\n        }\n        if (right < heap.length && heap[right].val < heap[smallest].val) {\n          smallest = right;\n        }\n        if (smallest !== i) {\n          var temp = heap[i];\n          heap[i] = heap[smallest];\n          heap[smallest] = temp;\n          i = smallest;\n        } else {\n          break;\n        }\n      }\n    }\n    return min;\n  }\n\n  // Push head of each non-empty list\n  for (var i = 0; i < lists.length; i++) {\n    if (lists[i] !== null) {\n      heapPush(lists[i]);\n    }\n  }\n\n  var dummy = new ListNode(0);\n  var current = dummy;\n\n  while (heap.length > 0) {\n    var smallest = heapPop();\n    current.next = smallest;\n    current = current.next;\n\n    if (smallest.next !== null) {\n      heapPush(smallest.next);\n    }\n  }\n\n  return dummy.next;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_heap": [
        3
      ],
      "add_to_heap": [
        52,
        53
      ],
      "create_dummy": [
        57,
        58
      ],
      "poll_from_heap": [
        61
      ],
      "add_to_result": [
        62,
        63
      ],
      "no_next": [
        65
      ],
      "add_next_to_heap": [
        66
      ],
      "return": [
        70
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        52
      ],
      "main_loop": [
        60
      ],
      "next_exists": [
        65
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n    // Simple min-heap implementation\n    const heap: ListNode[] = [];\n\n    function heapPush(node: ListNode): void {\n        heap.push(node);\n        let i = heap.length - 1;\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (heap[parent].val > heap[i].val) {\n                [heap[parent], heap[i]] = [heap[i], heap[parent]];\n                i = parent;\n            } else {\n                break;\n            }\n        }\n    }\n\n    function heapPop(): ListNode {\n        const min = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                const left = 2 * i + 1;\n                const right = 2 * i + 2;\n                let smallest = i;\n                if (left < heap.length && heap[left].val < heap[smallest].val) {\n                    smallest = left;\n                }\n                if (right < heap.length && heap[right].val < heap[smallest].val) {\n                    smallest = right;\n                }\n                if (smallest !== i) {\n                    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];\n                    i = smallest;\n                } else {\n                    break;\n                }\n            }\n        }\n        return min;\n    }\n\n    // Push head of each non-empty list\n    for (const node of lists) {\n        if (node !== null) {\n            heapPush(node);\n        }\n    }\n\n    const dummy = new ListNode(0);\n    let current = dummy;\n\n    while (heap.length > 0) {\n        const smallest = heapPop();\n        current.next = smallest;\n        current = current.next;\n\n        if (smallest.next !== null) {\n            heapPush(smallest.next);\n        }\n    }\n\n    return dummy.next;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_heap": [
        3
      ],
      "add_to_heap": [
        48,
        49
      ],
      "create_dummy": [
        53,
        54
      ],
      "poll_from_heap": [
        57
      ],
      "add_to_result": [
        58,
        59
      ],
      "no_next": [
        61
      ],
      "add_next_to_heap": [
        62
      ],
      "return": [
        66
      ]
    },
    "conditionalMap": {
      "add_head_check": [
        48
      ],
      "main_loop": [
        56
      ],
      "next_exists": [
        61
      ]
    }
  }
};

const MergeKSortedListsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "lists": [
        [
          1,
          4,
          5
        ],
        [
          1,
          3,
          4
        ],
        [
          2,
          6
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "lists": [
        [
          1,
          2,
          3
        ],
        [
          4,
          5,
          6
        ],
        [
          7,
          8,
          9
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "lists": [
        [
          1
        ],
        [
          0
        ]
      ]
    }
  }
];

function generateMergeKSortedListsSteps(e: any): any[] {
  
let t=e.lists,l=t.length,a={};t.forEach((e,t)=>{e.forEach((e,l)=>{a[`list${t}_node_${l}`]={type:"arrayElement",value:e,position:l,row:t,state:"pending"}})});let s=new StepRecorder({mode:"dc",k:l,size:l,round:0,merged:0,pushedKey:null,poppedKey:null},a),n=new Map;t.forEach((e,t)=>e.forEach((e,l)=>n.set(`${t}_${l}`,{row:t,position:l})));let r=(e,t,l,i)=>{n.set(`${e.listIdx}_${e.nodeIdx}`,{row:t,position:l}),s.update_visual(`list${e.listIdx}_node_${e.nodeIdx}`,{type:"arrayElement",value:e.val,position:l,row:t,state:i})};s.record("-","Merge the lists in pairs, halving how many are left each round");let o=t.map((e,t)=>e.map((e,l)=>({val:e,listIdx:t,nodeIdx:l})));if(0===o.length)return s.update_variable("resultText","[]"),s.record("return","No lists to merge"),s.getSteps();let d=0,u=[],p=null,c=()=>{p&&(p.nodes.forEach((e,t)=>r(e,p.dest,t,"pending")),u.forEach(e=>s.delete_visual(e)),u=[],s.update_variable("merged",0),p=null)},h=e=>{let t,l=`card_${d++}`,i=u.length;u.push(l),s.update_visual(l,{type:"arrayElement",value:e.val,position:i,zone:"res",slot:i,listIdx:e.listIdx,nodeIdx:e.nodeIdx});let a=(t=n.get(`${e.listIdx}_${e.nodeIdx}`),r(e,t.row,t.position,"consumed"),t);s.update_variable("merged",u.length),s.update_variable("val",e.val),s.update_variable("listIdx",e.listIdx),s.update_variable("pushedKey",l),s.update_variable("pushSrcRow",a.row),s.update_variable("pushSrcCol",a.position)},m=0;for(;o.length>1;){m++,s.add_conditional("size_check",!0),s.update_variable("round",m),s.update_variable("size",o.length),s.update_variable("pushedKey",null),s.record("round_start",`Round ${m}: ${o.length} lists left, merge them in pairs`);let e=[];for(let t=0;t<o.length;t+=2){let l=e.length;if(t+1>=o.length){c(),s.add_conditional("pair_check",!1),s.update_variable("pairA",t),s.delete_variable("pairB"),s.update_variable("pushedKey",null),s.record("carry_forward",`List ${t} has no partner, it carries forward`),e.push(o[t]),p={dest:l,nodes:o[t]};continue}c();let i=o[t],a=o[t+1];s.add_conditional("pair_check",!0),s.update_variable("pairA",t),s.update_variable("pairB",t+1),s.update_variable("pushedKey",null),s.record("pair_lists",`Merge list ${t} with list ${t+1}`);let n=[],r=0,d=0;for(;r<i.length&&d<a.length;)if(s.add_conditional("merge_loop",!0),i[r].val<=a[d].val){let e=i[r++];n.push(e),h(e),s.add_conditional("cmp_check",!0),s.record("merge_pick_l1",`${e.val} <= ${a[d].val}, take it from list ${t}`)}else{let e=a[d++];n.push(e),h(e),s.add_conditional("cmp_check",!1),s.record("merge_pick_l2",`${i[r].val} > ${e.val}, take it from list ${t+1}`)}let u=r<i.length?t:t+1,m=r<i.length?i.slice(r):a.slice(d);m.forEach(e=>{n.push(e),h(e)}),s.add_conditional("merge_loop",!1),s.update_variable("pushedKey",null),s.record("merge_tail",m.length>0?`Attach the rest of list ${u} (${m.map(e=>e.val).join(", ")})`:"Both lists are used up, nothing left to attach"),e.push(n),p={dest:l,nodes:n}}c(),o=e,s.update_variable("size",o.length),s.delete_variable("pairA"),s.delete_variable("pairB"),s.record("round_done",`Round ${m} done, ${o.length} list${1===o.length?"":"s"} left`)}return s.add_conditional("size_check",!1),s.update_variable("pushedKey",null),s.update_variable("resultText",`[${o[0].map(e=>e.val).join(", ")}]`),s.record("return","One list left, the merge is complete"),s.getSteps()
}

export function MergeKSortedListsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeKSortedListsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMergeKSortedListsSteps(e) as any[];
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
      title="Merge k Sorted Lists"
      slug="merge-k-sorted-lists"
      approaches={approaches}
      presets={MergeKSortedListsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// All O'one Data Structure (all-oone-data-structure)
// ==========================================

const AllOoneDataStructureTemplates = {
  "python": {
    "language": "python",
    "code": "class Node:\n    def __init__(self, count):\n        self.count = count\n        self.keys = set()\n        self.prev = None\n        self.next = None\n\nclass AllOne:\n    def __init__(self):\n        # Sentinel nodes to avoid null checks\n        self.head = Node(0)\n        self.tail = Node(float('inf'))\n        self.head.next = self.tail\n        self.tail.prev = self.head\n        self.key_to_node = {}\n\n    def _insert_after(self, prev_node, count):\n        # Insert a new node right after prev_node\n        new_node = Node(count)\n        new_node.prev = prev_node\n        new_node.next = prev_node.next\n        prev_node.next.prev = new_node\n        prev_node.next = new_node\n        return new_node\n\n    def _remove_node(self, node):\n        # Remove a node from the linked list\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def inc(self, key: str) -> None:\n        if key not in self.key_to_node:\n            # New key, needs to go into count-1 bucket\n            first_node = self.head.next\n            if first_node.count != 1:\n                first_node = self._insert_after(self.head, 1)\n            first_node.keys.add(key)\n            self.key_to_node[key] = first_node\n        else:\n            # Existing key, move from count c to count c+1\n            curr = self.key_to_node[key]\n            new_count = curr.count + 1\n            next_node = curr.next\n            if next_node.count != new_count:\n                next_node = self._insert_after(curr, new_count)\n            next_node.keys.add(key)\n            self.key_to_node[key] = next_node\n            # Remove from old bucket\n            curr.keys.remove(key)\n            if not curr.keys:\n                self._remove_node(curr)\n\n    def dec(self, key: str) -> None:\n        curr = self.key_to_node[key]\n        new_count = curr.count - 1\n\n        if new_count == 0:\n            # Remove the key entirely\n            del self.key_to_node[key]\n        else:\n            # Move to count c-1 bucket\n            prev_node = curr.prev\n            if prev_node.count != new_count:\n                prev_node = self._insert_after(curr.prev, new_count)\n            prev_node.keys.add(key)\n            self.key_to_node[key] = prev_node\n\n        # Remove from old bucket\n        curr.keys.remove(key)\n        if not curr.keys:\n            self._remove_node(curr)\n\n    def getMaxKey(self) -> str:\n        if self.tail.prev == self.head:\n            return \"\"\n        return next(iter(self.tail.prev.keys))\n\n    def getMinKey(self) -> str:\n        if self.head.next == self.tail:\n            return \"\"\n        return next(iter(self.head.next.keys))",
    "lineMap": {
      "-": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "start_inc": [
        31
      ],
      "check_key_inc": [
        32
      ],
      "new_key": [
        33,
        34
      ],
      "create_bucket": [
        35,
        36
      ],
      "add_to_bucket": [
        37
      ],
      "update_map": [
        38
      ],
      "existing_key": [
        40,
        41,
        42
      ],
      "create_next_bucket": [
        43,
        44,
        45
      ],
      "move_to_next": [
        46
      ],
      "update_map_inc": [
        47
      ],
      "remove_from_old": [
        48,
        49
      ],
      "cleanup_bucket": [
        50,
        51
      ],
      "inc_done": [
        51
      ],
      "start_dec": [
        53
      ],
      "check_key_dec": [
        54,
        55
      ],
      "decrement_to_zero": [
        57,
        58
      ],
      "remove_key": [
        59
      ],
      "create_prev_bucket": [
        61,
        62,
        63,
        64
      ],
      "move_to_prev": [
        65
      ],
      "update_map_dec": [
        66
      ],
      "remove_from_old_dec": [
        68,
        69
      ],
      "cleanup_bucket_dec": [
        70,
        71
      ],
      "dec_done": [
        71
      ],
      "start_getmax": [
        73
      ],
      "read_max": [
        74,
        75,
        76
      ],
      "getmax_done": [
        76
      ],
      "start_getmin": [
        78
      ],
      "read_min": [
        79,
        80,
        81
      ],
      "getmin_done": [
        81
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        32
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class AllOne {\n    // Each node holds a count and all keys with that count\n    class Node {\n        int count;\n        Set<String> keys;\n        Node prev, next;\n        Node(int count) {\n            this.count = count;\n            this.keys = new LinkedHashSet<>();\n        }\n    }\n\n    Node head, tail;\n    Map<String, Node> keyToNode;\n\n    public AllOne() {\n        // Sentinel nodes to avoid null checks\n        head = new Node(0);\n        tail = new Node(Integer.MAX_VALUE);\n        head.next = tail;\n        tail.prev = head;\n        keyToNode = new HashMap<>();\n    }\n\n    // Insert a new node right after the given node\n    private Node insertAfter(Node prevNode, int count) {\n        Node newNode = new Node(count);\n        newNode.prev = prevNode;\n        newNode.next = prevNode.next;\n        prevNode.next.prev = newNode;\n        prevNode.next = newNode;\n        return newNode;\n    }\n\n    // Remove a node from the linked list\n    private void removeNode(Node node) {\n        node.prev.next = node.next;\n        node.next.prev = node.prev;\n    }\n\n    public void inc(String key) {\n        if (!keyToNode.containsKey(key)) {\n            // New key, needs to go into count-1 bucket\n            Node firstNode = head.next;\n            if (firstNode.count != 1) {\n                firstNode = insertAfter(head, 1);\n            }\n            firstNode.keys.add(key);\n            keyToNode.put(key, firstNode);\n        } else {\n            // Existing key, move from count c to count c+1\n            Node curr = keyToNode.get(key);\n            int newCount = curr.count + 1;\n            Node nextNode = curr.next;\n            if (nextNode.count != newCount) {\n                nextNode = insertAfter(curr, newCount);\n            }\n            nextNode.keys.add(key);\n            keyToNode.put(key, nextNode);\n            // Remove from old bucket\n            curr.keys.remove(key);\n            if (curr.keys.isEmpty()) {\n                removeNode(curr);\n            }\n        }\n    }\n\n    public void dec(String key) {\n        Node curr = keyToNode.get(key);\n        int newCount = curr.count - 1;\n\n        if (newCount == 0) {\n            // Remove the key entirely\n            keyToNode.remove(key);\n        } else {\n            // Move to count c-1 bucket\n            Node prevNode = curr.prev;\n            if (prevNode.count != newCount) {\n                prevNode = insertAfter(curr.prev, newCount);\n            }\n            prevNode.keys.add(key);\n            keyToNode.put(key, prevNode);\n        }\n\n        // Remove from old bucket\n        curr.keys.remove(key);\n        if (curr.keys.isEmpty()) {\n            removeNode(curr);\n        }\n    }\n\n    public String getMaxKey() {\n        if (tail.prev == head) return \"\";\n        return tail.prev.keys.iterator().next();\n    }\n\n    public String getMinKey() {\n        if (head.next == tail) return \"\";\n        return head.next.keys.iterator().next();\n    }\n}",
    "lineMap": {
      "-": [
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23
      ],
      "start_inc": [
        41
      ],
      "check_key_inc": [
        42
      ],
      "new_key": [
        43,
        44
      ],
      "create_bucket": [
        45,
        46,
        47
      ],
      "add_to_bucket": [
        48
      ],
      "update_map": [
        49
      ],
      "existing_key": [
        51,
        52,
        53,
        54
      ],
      "create_next_bucket": [
        55,
        56,
        57
      ],
      "move_to_next": [
        58
      ],
      "update_map_inc": [
        59
      ],
      "remove_from_old": [
        60,
        61
      ],
      "cleanup_bucket": [
        62,
        63,
        64
      ],
      "inc_done": [
        65
      ],
      "start_dec": [
        68
      ],
      "check_key_dec": [
        69,
        70
      ],
      "decrement_to_zero": [
        72,
        73,
        74
      ],
      "remove_key": [
        74
      ],
      "create_prev_bucket": [
        76,
        77,
        78,
        79,
        80
      ],
      "move_to_prev": [
        81
      ],
      "update_map_dec": [
        82
      ],
      "remove_from_old_dec": [
        85,
        86
      ],
      "cleanup_bucket_dec": [
        87,
        88,
        89
      ],
      "dec_done": [
        89
      ],
      "start_getmax": [
        92
      ],
      "read_max": [
        93,
        94
      ],
      "getmax_done": [
        94
      ],
      "start_getmin": [
        97
      ],
      "read_min": [
        98,
        99
      ],
      "getmin_done": [
        99
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        42
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class AllOne {\n    struct Node {\n        int count;\n        unordered_set<string> keys;\n        Node* prev;\n        Node* next;\n        Node(int c) : count(c), prev(nullptr), next(nullptr) {}\n    };\n\n    Node* head;\n    Node* tail;\n    unordered_map<string, Node*> keyToNode;\n\n    // Insert a new node right after prevNode\n    Node* insertAfter(Node* prevNode, int count) {\n        Node* newNode = new Node(count);\n        newNode->prev = prevNode;\n        newNode->next = prevNode->next;\n        prevNode->next->prev = newNode;\n        prevNode->next = newNode;\n        return newNode;\n    }\n\n    // Remove a node from the linked list\n    void removeNode(Node* node) {\n        node->prev->next = node->next;\n        node->next->prev = node->prev;\n        delete node;\n    }\n\npublic:\n    AllOne() {\n        // Sentinel nodes to avoid null checks\n        head = new Node(0);\n        tail = new Node(INT_MAX);\n        head->next = tail;\n        tail->prev = head;\n    }\n\n    void inc(string key) {\n        if (keyToNode.find(key) == keyToNode.end()) {\n            // New key, needs to go into count-1 bucket\n            Node* firstNode = head->next;\n            if (firstNode->count != 1) {\n                firstNode = insertAfter(head, 1);\n            }\n            firstNode->keys.insert(key);\n            keyToNode[key] = firstNode;\n        } else {\n            // Existing key, move from count c to count c+1\n            Node* curr = keyToNode[key];\n            int newCount = curr->count + 1;\n            Node* nextNode = curr->next;\n            if (nextNode->count != newCount) {\n                nextNode = insertAfter(curr, newCount);\n            }\n            nextNode->keys.insert(key);\n            keyToNode[key] = nextNode;\n            // Remove from old bucket\n            curr->keys.erase(key);\n            if (curr->keys.empty()) {\n                removeNode(curr);\n            }\n        }\n    }\n\n    void dec(string key) {\n        Node* curr = keyToNode[key];\n        int newCount = curr->count - 1;\n\n        if (newCount == 0) {\n            // Remove the key entirely\n            keyToNode.erase(key);\n        } else {\n            // Move to count c-1 bucket\n            Node* prevNode = curr->prev;\n            if (prevNode->count != newCount) {\n                prevNode = insertAfter(curr->prev, newCount);\n            }\n            prevNode->keys.insert(key);\n            keyToNode[key] = prevNode;\n        }\n\n        // Remove from old bucket\n        curr->keys.erase(key);\n        if (curr->keys.empty()) {\n            removeNode(curr);\n        }\n    }\n\n    string getMaxKey() {\n        if (tail->prev == head) return \"\";\n        return *(tail->prev->keys.begin());\n    }\n\n    string getMinKey() {\n        if (head->next == tail) return \"\";\n        return *(head->next->keys.begin());\n    }\n};",
    "lineMap": {
      "-": [
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ],
      "start_inc": [
        40
      ],
      "check_key_inc": [
        41
      ],
      "new_key": [
        42,
        43
      ],
      "create_bucket": [
        44,
        45,
        46
      ],
      "add_to_bucket": [
        47
      ],
      "update_map": [
        48
      ],
      "existing_key": [
        50,
        51,
        52,
        53
      ],
      "create_next_bucket": [
        54,
        55,
        56
      ],
      "move_to_next": [
        57
      ],
      "update_map_inc": [
        58
      ],
      "remove_from_old": [
        59,
        60
      ],
      "cleanup_bucket": [
        61,
        62,
        63
      ],
      "inc_done": [
        64
      ],
      "start_dec": [
        67
      ],
      "check_key_dec": [
        68,
        69
      ],
      "decrement_to_zero": [
        71,
        72,
        73
      ],
      "remove_key": [
        73
      ],
      "create_prev_bucket": [
        75,
        76,
        77,
        78,
        79
      ],
      "move_to_prev": [
        80
      ],
      "update_map_dec": [
        81
      ],
      "remove_from_old_dec": [
        84,
        85
      ],
      "cleanup_bucket_dec": [
        86,
        87,
        88
      ],
      "dec_done": [
        88
      ],
      "start_getmax": [
        91
      ],
      "read_max": [
        92,
        93
      ],
      "getmax_done": [
        93
      ],
      "start_getmin": [
        96
      ],
      "read_min": [
        97,
        98
      ],
      "getmin_done": [
        98
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        41
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class AllOne {\n    class Node {\n        public int Count;\n        public HashSet<string> Keys;\n        public Node Prev, Next;\n        public Node(int count) {\n            Count = count;\n            Keys = new HashSet<string>();\n        }\n    }\n\n    Node head, tail;\n    Dictionary<string, Node> keyToNode;\n\n    public AllOne() {\n        // Sentinel nodes to avoid null checks\n        head = new Node(0);\n        tail = new Node(int.MaxValue);\n        head.Next = tail;\n        tail.Prev = head;\n        keyToNode = new Dictionary<string, Node>();\n    }\n\n    // Insert a new node right after prevNode\n    Node InsertAfter(Node prevNode, int count) {\n        Node newNode = new Node(count);\n        newNode.Prev = prevNode;\n        newNode.Next = prevNode.Next;\n        prevNode.Next.Prev = newNode;\n        prevNode.Next = newNode;\n        return newNode;\n    }\n\n    // Remove a node from the linked list\n    void RemoveNode(Node node) {\n        node.Prev.Next = node.Next;\n        node.Next.Prev = node.Prev;\n    }\n\n    public void Inc(string key) {\n        if (!keyToNode.ContainsKey(key)) {\n            // New key, needs to go into count-1 bucket\n            Node firstNode = head.Next;\n            if (firstNode.Count != 1) {\n                firstNode = InsertAfter(head, 1);\n            }\n            firstNode.Keys.Add(key);\n            keyToNode[key] = firstNode;\n        } else {\n            // Existing key, move from count c to count c+1\n            Node curr = keyToNode[key];\n            int newCount = curr.Count + 1;\n            Node nextNode = curr.Next;\n            if (nextNode.Count != newCount) {\n                nextNode = InsertAfter(curr, newCount);\n            }\n            nextNode.Keys.Add(key);\n            keyToNode[key] = nextNode;\n            // Remove from old bucket\n            curr.Keys.Remove(key);\n            if (curr.Keys.Count == 0) {\n                RemoveNode(curr);\n            }\n        }\n    }\n\n    public void Dec(string key) {\n        Node curr = keyToNode[key];\n        int newCount = curr.Count - 1;\n\n        if (newCount == 0) {\n            // Remove the key entirely\n            keyToNode.Remove(key);\n        } else {\n            // Move to count c-1 bucket\n            Node prevNode = curr.Prev;\n            if (prevNode.Count != newCount) {\n                prevNode = InsertAfter(curr.Prev, newCount);\n            }\n            prevNode.Keys.Add(key);\n            keyToNode[key] = prevNode;\n        }\n\n        // Remove from old bucket\n        curr.Keys.Remove(key);\n        if (curr.Keys.Count == 0) {\n            RemoveNode(curr);\n        }\n    }\n\n    public string GetMaxKey() {\n        if (tail.Prev == head) return \"\";\n        var enumerator = tail.Prev.Keys.GetEnumerator();\n        enumerator.MoveNext();\n        return enumerator.Current;\n    }\n\n    public string GetMinKey() {\n        if (head.Next == tail) return \"\";\n        var enumerator = head.Next.Keys.GetEnumerator();\n        enumerator.MoveNext();\n        return enumerator.Current;\n    }\n}",
    "lineMap": {
      "-": [
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "start_inc": [
        40
      ],
      "check_key_inc": [
        41
      ],
      "new_key": [
        42,
        43
      ],
      "create_bucket": [
        44,
        45,
        46
      ],
      "add_to_bucket": [
        47
      ],
      "update_map": [
        48
      ],
      "existing_key": [
        50,
        51,
        52,
        53
      ],
      "create_next_bucket": [
        54,
        55,
        56
      ],
      "move_to_next": [
        57
      ],
      "update_map_inc": [
        58
      ],
      "remove_from_old": [
        59,
        60
      ],
      "cleanup_bucket": [
        61,
        62,
        63
      ],
      "inc_done": [
        64
      ],
      "start_dec": [
        67
      ],
      "check_key_dec": [
        68,
        69
      ],
      "decrement_to_zero": [
        71,
        72,
        73
      ],
      "remove_key": [
        73
      ],
      "create_prev_bucket": [
        75,
        76,
        77,
        78,
        79
      ],
      "move_to_prev": [
        80
      ],
      "update_map_dec": [
        81
      ],
      "remove_from_old_dec": [
        84,
        85
      ],
      "cleanup_bucket_dec": [
        86,
        87,
        88
      ],
      "dec_done": [
        88
      ],
      "start_getmax": [
        91
      ],
      "read_max": [
        92,
        93,
        94,
        95
      ],
      "getmax_done": [
        95
      ],
      "start_getmin": [
        98
      ],
      "read_min": [
        99,
        100,
        101,
        102
      ],
      "getmin_done": [
        102
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        41
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Node struct {\n    count int\n    keys  map[string]bool\n    prev  *Node\n    next  *Node\n}\n\ntype AllOne struct {\n    head      *Node\n    tail      *Node\n    keyToNode map[string]*Node\n}\n\nfunc Constructor() AllOne {\n    // Sentinel nodes to avoid nil checks\n    head := &Node{count: 0, keys: make(map[string]bool)}\n    tail := &Node{count: 1<<31 - 1, keys: make(map[string]bool)}\n    head.next = tail\n    tail.prev = head\n    return AllOne{head: head, tail: tail, keyToNode: make(map[string]*Node)}\n}\n\n// Insert a new node right after prevNode\nfunc insertAfter(prevNode *Node, count int) *Node {\n    newNode := &Node{count: count, keys: make(map[string]bool)}\n    newNode.prev = prevNode\n    newNode.next = prevNode.next\n    prevNode.next.prev = newNode\n    prevNode.next = newNode\n    return newNode\n}\n\n// Remove a node from the linked list\nfunc removeNode(node *Node) {\n    node.prev.next = node.next\n    node.next.prev = node.prev\n}\n\nfunc (a *AllOne) Inc(key string) {\n    if _, exists := a.keyToNode[key]; !exists {\n        // New key, needs to go into count-1 bucket\n        firstNode := a.head.next\n        if firstNode.count != 1 {\n            firstNode = insertAfter(a.head, 1)\n        }\n        firstNode.keys[key] = true\n        a.keyToNode[key] = firstNode\n    } else {\n        // Existing key, move from count c to count c+1\n        curr := a.keyToNode[key]\n        newCount := curr.count + 1\n        nextNode := curr.next\n        if nextNode.count != newCount {\n            nextNode = insertAfter(curr, newCount)\n        }\n        nextNode.keys[key] = true\n        a.keyToNode[key] = nextNode\n        // Remove from old bucket\n        delete(curr.keys, key)\n        if len(curr.keys) == 0 {\n            removeNode(curr)\n        }\n    }\n}\n\nfunc (a *AllOne) Dec(key string) {\n    curr := a.keyToNode[key]\n    newCount := curr.count - 1\n\n    if newCount == 0 {\n        // Remove the key entirely\n        delete(a.keyToNode, key)\n    } else {\n        // Move to count c-1 bucket\n        prevNode := curr.prev\n        if prevNode.count != newCount {\n            prevNode = insertAfter(curr.prev, newCount)\n        }\n        prevNode.keys[key] = true\n        a.keyToNode[key] = prevNode\n    }\n\n    // Remove from old bucket\n    delete(curr.keys, key)\n    if len(curr.keys) == 0 {\n        removeNode(curr)\n    }\n}\n\nfunc (a *AllOne) GetMaxKey() string {\n    if a.tail.prev == a.head {\n        return \"\"\n    }\n    for key := range a.tail.prev.keys {\n        return key\n    }\n    return \"\"\n}\n\nfunc (a *AllOne) GetMinKey() string {\n    if a.head.next == a.tail {\n        return \"\"\n    }\n    for key := range a.head.next.keys {\n        return key\n    }\n    return \"\"\n}",
    "lineMap": {
      "-": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "start_inc": [
        39
      ],
      "check_key_inc": [
        40
      ],
      "new_key": [
        41,
        42
      ],
      "create_bucket": [
        43,
        44,
        45
      ],
      "add_to_bucket": [
        46
      ],
      "update_map": [
        47
      ],
      "existing_key": [
        49,
        50,
        51,
        52
      ],
      "create_next_bucket": [
        53,
        54,
        55
      ],
      "move_to_next": [
        56
      ],
      "update_map_inc": [
        57
      ],
      "remove_from_old": [
        58,
        59
      ],
      "cleanup_bucket": [
        60,
        61,
        62
      ],
      "inc_done": [
        63
      ],
      "start_dec": [
        66
      ],
      "check_key_dec": [
        67,
        68
      ],
      "decrement_to_zero": [
        70,
        71,
        72
      ],
      "remove_key": [
        72
      ],
      "create_prev_bucket": [
        74,
        75,
        76,
        77,
        78
      ],
      "move_to_prev": [
        79
      ],
      "update_map_dec": [
        80
      ],
      "remove_from_old_dec": [
        83,
        84
      ],
      "cleanup_bucket_dec": [
        85,
        86,
        87
      ],
      "dec_done": [
        87
      ],
      "start_getmax": [
        90
      ],
      "read_max": [
        91,
        92,
        93,
        94,
        95
      ],
      "getmax_done": [
        95
      ],
      "start_getmin": [
        100
      ],
      "read_min": [
        101,
        102,
        103,
        104,
        105
      ],
      "getmin_done": [
        105
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        40
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var AllOne = function() {\n    // Node constructor\n    function createNode(count) {\n        return { count: count, keys: new Set(), prev: null, next: null };\n    }\n    // Sentinel nodes to avoid null checks\n    this.head = createNode(0);\n    this.tail = createNode(Infinity);\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n    this.keyToNode = new Map();\n};\n\n// Insert a new node right after prevNode\nfunction insertAfter(prevNode, count) {\n    var newNode = { count: count, keys: new Set(), prev: prevNode, next: prevNode.next };\n    prevNode.next.prev = newNode;\n    prevNode.next = newNode;\n    return newNode;\n}\n\n// Remove a node from the linked list\nfunction removeNode(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n}\n\nAllOne.prototype.inc = function(key) {\n    if (!this.keyToNode.has(key)) {\n        // New key, needs to go into count-1 bucket\n        var firstNode = this.head.next;\n        if (firstNode.count !== 1) {\n            firstNode = insertAfter(this.head, 1);\n        }\n        firstNode.keys.add(key);\n        this.keyToNode.set(key, firstNode);\n    } else {\n        // Existing key, move from count c to count c+1\n        var curr = this.keyToNode.get(key);\n        var newCount = curr.count + 1;\n        var nextNode = curr.next;\n        if (nextNode.count !== newCount) {\n            nextNode = insertAfter(curr, newCount);\n        }\n        nextNode.keys.add(key);\n        this.keyToNode.set(key, nextNode);\n        // Remove from old bucket\n        curr.keys.delete(key);\n        if (curr.keys.size === 0) {\n            removeNode(curr);\n        }\n    }\n};\n\nAllOne.prototype.dec = function(key) {\n    var curr = this.keyToNode.get(key);\n    var newCount = curr.count - 1;\n\n    if (newCount === 0) {\n        // Remove the key entirely\n        this.keyToNode.delete(key);\n    } else {\n        // Move to count c-1 bucket\n        var prevNode = curr.prev;\n        if (prevNode.count !== newCount) {\n            prevNode = insertAfter(curr.prev, newCount);\n        }\n        prevNode.keys.add(key);\n        this.keyToNode.set(key, prevNode);\n    }\n\n    // Remove from old bucket\n    curr.keys.delete(key);\n    if (curr.keys.size === 0) {\n        removeNode(curr);\n    }\n};\n\nAllOne.prototype.getMaxKey = function() {\n    if (this.tail.prev === this.head) return \"\";\n    return this.tail.prev.keys.values().next().value;\n};\n\nAllOne.prototype.getMinKey = function() {\n    if (this.head.next === this.tail) return \"\";\n    return this.head.next.keys.values().next().value;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "start_inc": [
        28
      ],
      "check_key_inc": [
        29
      ],
      "new_key": [
        30,
        31
      ],
      "create_bucket": [
        32,
        33,
        34
      ],
      "add_to_bucket": [
        35
      ],
      "update_map": [
        36
      ],
      "existing_key": [
        38,
        39,
        40,
        41
      ],
      "create_next_bucket": [
        42,
        43,
        44
      ],
      "move_to_next": [
        45
      ],
      "update_map_inc": [
        46
      ],
      "remove_from_old": [
        47,
        48
      ],
      "cleanup_bucket": [
        49,
        50,
        51
      ],
      "inc_done": [
        52
      ],
      "start_dec": [
        55
      ],
      "check_key_dec": [
        56,
        57
      ],
      "decrement_to_zero": [
        59,
        60,
        61
      ],
      "remove_key": [
        61
      ],
      "create_prev_bucket": [
        63,
        64,
        65,
        66,
        67
      ],
      "move_to_prev": [
        68
      ],
      "update_map_dec": [
        69
      ],
      "remove_from_old_dec": [
        72,
        73
      ],
      "cleanup_bucket_dec": [
        74,
        75,
        76
      ],
      "dec_done": [
        76
      ],
      "start_getmax": [
        79
      ],
      "read_max": [
        80,
        81
      ],
      "getmax_done": [
        81
      ],
      "start_getmin": [
        84
      ],
      "read_min": [
        85,
        86
      ],
      "getmin_done": [
        86
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        29
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class ListNode {\n    count: number;\n    keys: Set<string>;\n    prev: ListNode | null;\n    next: ListNode | null;\n    constructor(count: number) {\n        this.count = count;\n        this.keys = new Set();\n        this.prev = null;\n        this.next = null;\n    }\n}\n\nclass AllOne {\n    head: ListNode;\n    tail: ListNode;\n    keyToNode: Map<string, ListNode>;\n\n    constructor() {\n        // Sentinel nodes to avoid null checks\n        this.head = new ListNode(0);\n        this.tail = new ListNode(Infinity);\n        this.head.next = this.tail;\n        this.tail.prev = this.head;\n        this.keyToNode = new Map();\n    }\n\n    // Insert a new node right after prevNode\n    private insertAfter(prevNode: ListNode, count: number): ListNode {\n        const newNode = new ListNode(count);\n        newNode.prev = prevNode;\n        newNode.next = prevNode.next;\n        prevNode.next!.prev = newNode;\n        prevNode.next = newNode;\n        return newNode;\n    }\n\n    // Remove a node from the linked list\n    private removeNode(node: ListNode): void {\n        node.prev!.next = node.next;\n        node.next!.prev = node.prev;\n    }\n\n    inc(key: string): void {\n        if (!this.keyToNode.has(key)) {\n            // New key, needs to go into count-1 bucket\n            let firstNode = this.head.next!;\n            if (firstNode.count !== 1) {\n                firstNode = this.insertAfter(this.head, 1);\n            }\n            firstNode.keys.add(key);\n            this.keyToNode.set(key, firstNode);\n        } else {\n            // Existing key, move from count c to count c+1\n            const curr = this.keyToNode.get(key)!;\n            const newCount = curr.count + 1;\n            let nextNode = curr.next!;\n            if (nextNode.count !== newCount) {\n                nextNode = this.insertAfter(curr, newCount);\n            }\n            nextNode.keys.add(key);\n            this.keyToNode.set(key, nextNode);\n            // Remove from old bucket\n            curr.keys.delete(key);\n            if (curr.keys.size === 0) {\n                this.removeNode(curr);\n            }\n        }\n    }\n\n    dec(key: string): void {\n        const curr = this.keyToNode.get(key)!;\n        const newCount = curr.count - 1;\n\n        if (newCount === 0) {\n            // Remove the key entirely\n            this.keyToNode.delete(key);\n        } else {\n            // Move to count c-1 bucket\n            let prevNode = curr.prev!;\n            if (prevNode.count !== newCount) {\n                prevNode = this.insertAfter(curr.prev!, newCount);\n            }\n            prevNode.keys.add(key);\n            this.keyToNode.set(key, prevNode);\n        }\n\n        // Remove from old bucket\n        curr.keys.delete(key);\n        if (curr.keys.size === 0) {\n            this.removeNode(curr);\n        }\n    }\n\n    getMaxKey(): string {\n        if (this.tail.prev === this.head) return \"\";\n        return this.tail.prev!.keys.values().next().value;\n    }\n\n    getMinKey(): string {\n        if (this.head.next === this.tail) return \"\";\n        return this.head.next!.keys.values().next().value;\n    }\n}",
    "lineMap": {
      "-": [
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26
      ],
      "start_inc": [
        44
      ],
      "check_key_inc": [
        45
      ],
      "new_key": [
        46,
        47
      ],
      "create_bucket": [
        48,
        49,
        50
      ],
      "add_to_bucket": [
        51
      ],
      "update_map": [
        52
      ],
      "existing_key": [
        54,
        55,
        56,
        57
      ],
      "create_next_bucket": [
        58,
        59,
        60
      ],
      "move_to_next": [
        61
      ],
      "update_map_inc": [
        62
      ],
      "remove_from_old": [
        63,
        64
      ],
      "cleanup_bucket": [
        65,
        66,
        67
      ],
      "inc_done": [
        68
      ],
      "start_dec": [
        71
      ],
      "check_key_dec": [
        72,
        73
      ],
      "decrement_to_zero": [
        75,
        76,
        77
      ],
      "remove_key": [
        77
      ],
      "create_prev_bucket": [
        79,
        80,
        81,
        82,
        83
      ],
      "move_to_prev": [
        84
      ],
      "update_map_dec": [
        85
      ],
      "remove_from_old_dec": [
        88,
        89
      ],
      "cleanup_bucket_dec": [
        90,
        91,
        92
      ],
      "dec_done": [
        92
      ],
      "start_getmax": [
        95
      ],
      "read_max": [
        96,
        97
      ],
      "getmax_done": [
        97
      ],
      "start_getmin": [
        100
      ],
      "read_min": [
        101,
        102
      ],
      "getmin_done": [
        102
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key_inc": [
        45
      ]
    }
  }
};

const AllOoneDataStructurePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "AllOne",
        "inc",
        "inc",
        "inc",
        "inc",
        "inc",
        "dec",
        "getMaxKey",
        "getMinKey"
      ],
      "values": [
        null,
        "a",
        "b",
        "b",
        "a",
        "a",
        "b",
        null,
        null
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        "AllOne",
        "inc",
        "inc",
        "inc",
        "dec",
        "getMaxKey",
        "getMinKey"
      ],
      "values": [
        null,
        "hello",
        "hello",
        "world",
        "hello",
        null,
        null
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "operations": [
        "AllOne",
        "inc",
        "inc",
        "inc",
        "inc",
        "dec",
        "dec",
        "getMaxKey",
        "getMinKey"
      ],
      "values": [
        null,
        "a",
        "a",
        "b",
        "b",
        "a",
        "b",
        null,
        null
      ]
    }
  }
];

function generateAllOoneDataStructureSteps(e: any): any[] {
  
let t=e.operations||[],n=e.values||[],r=new StepRecorder({operation:"",result:""},{}),i=[],a=new Map,c=new Map;function d(e,t,n){for(let e of Object.keys(r.getCurrentVisuals()))r.delete_visual(e);let o=[],c=0;for(;-1!==c;)o.push(c),c=i[c].next;for(let e=0;e<o.length;e++){let n=o[e],a=i[n],c=0===a.count?"HEAD (0)":a.count===1/0?"TAIL (∞)":`Count: ${a.count}`,d=0===a.count||a.count===1/0?"":`{${Array.from(a.keys).join(", ")}}`,s="standard";(0===a.count||a.count===1/0)&&(s="muted"),void 0!==t&&a.count===t&&(s="highlight"),r.add_new_visual(`bucket_${n}`,{type:"metadata",value:{count:c,keys:d,order:e},state:s})}for(let[t,n]of Array.from(a.entries()).sort((e,t)=>e[0].localeCompare(t[0]))){let o="standard";e===t&&(o="active"),r.add_new_visual(`keymap_${t}`,{type:"metadata",value:{key:t,count:n},state:o})}void 0!==n&&r.add_new_visual("meta_result",{type:"metadata",value:n,state:"active"})}function s(e,t){let n=i.length,o=i[e].next;return i.push({count:t,keys:new Set,prev:e,next:o}),i[e].next=n,-1!==o&&(i[o].prev=n),c.set(t,n),n}function u(e){let t=i[e].prev,n=i[e].next;i[t].next=n,-1!==n&&(i[n].prev=t),c.delete(i[e].count)}i.push({count:0,keys:new Set,prev:-1,next:1}),i.push({count:1/0,keys:new Set,prev:0,next:-1}),c.set(0,0),c.set(1/0,1),r.update_variable("mode","buckets"),d(),r.record("-","Initialize AllOne data structure with head and tail sentinels");for(let e=0;e<t.length;e++){let o=t[e],l=n[e];if("AllOne"!==o){if("inc"===o&&l){r.update_variable("operation",`inc("${l}")`),r.update_variable("result",""),d(l),r.record("start_inc",`Start inc("${l}")`);let e=a.has(l);if(r.add_conditional("check_key_inc",!e),d(l),r.record("check_key_inc",e?`Key "${l}" exists with count ${a.get(l)}`:`Key "${l}" is new`),e){let e=a.get(l),t=e+1;d(l,e),r.record("existing_key",`Key "${l}" exists at count=${e}, moving to count=${t}`);let n=c.get(t),o=c.get(e);void 0===n&&(n=s(o,t),d(l,t),r.record("create_next_bucket",`Create new bucket with count=${t}`)),i[n].keys.add(l),a.set(l,t),d(l,t),r.record("move_to_next",`Moved "${l}" to count=${t} bucket`),i[o].keys.delete(l),d(l,t),r.record("remove_from_old",`Removed "${l}" from count=${e} bucket`),0===i[o].keys.size&&(u(o),d(l,t),r.record("cleanup_bucket",`Removed empty count=${e} bucket`)),d(l,t),r.record("update_map_inc",`Updated keyToNode map: "${l}" -> count ${t}`)}else{d(l),r.record("new_key",`Key "${l}" is new, add to count=1 bucket`);let e=c.get(1);void 0===e&&(e=s(0,1),d(l,1),r.record("create_bucket","Create new bucket with count=1 after head")),i[e].keys.add(l),a.set(l,1),d(l,1),r.record("add_to_bucket",`Added "${l}" to count=1 bucket`),d(l,1),r.record("update_map",`Updated keyToNode map: "${l}" -> count 1`)}d(),r.update_variable("result","null"),r.record("inc_done",`inc("${l}") complete`)}else if("dec"===o&&l){r.update_variable("operation",`dec("${l}")`),r.update_variable("result",""),d(l),r.record("start_dec",`Start dec("${l}")`);let e=a.get(l),t=e-1;d(l,e),r.record("check_key_dec",`Key "${l}" has count=${e}, decrementing to ${t}`);let n=c.get(e);if(0===t)d(l,e),r.record("decrement_to_zero",`Count becomes 0, removing key "${l}" entirely`),a.delete(l),d(void 0,e),r.record("remove_key",`Removed "${l}" from keyToNode map`);else{let e=c.get(t);void 0===e&&(e=s(i[n].prev,t),d(l,t),r.record("create_prev_bucket",`Create new bucket with count=${t}`)),i[e].keys.add(l),a.set(l,t),d(l,t),r.record("move_to_prev",`Moved "${l}" to count=${t} bucket`),d(l,t),r.record("update_map_dec",`Updated keyToNode map: "${l}" -> count ${t}`)}i[n].keys.delete(l),d(l),r.record("remove_from_old_dec",`Removed "${l}" from count=${e} bucket`),0===i[n].keys.size&&(u(n),d(l),r.record("cleanup_bucket_dec",`Removed empty count=${e} bucket`)),d(),r.update_variable("result","null"),r.record("dec_done",`dec("${l}") complete`)}else if("getMaxKey"===o){r.update_variable("operation","getMaxKey()"),r.update_variable("result",""),d(),r.record("start_getmax","Start getMaxKey()");let e=i[1].prev;if(0===e)d(void 0,void 0,'""'),r.update_variable("result",'""'),r.record("read_max","No keys exist, return empty string");else{let t=i[e],n=Array.from(t.keys)[0];d(n,t.count,`"${n}"`),r.update_variable("result",`"${n}"`),r.record("read_max",`Max count bucket has count=${t.count}, return "${n}"`)}d(),r.record("getmax_done","getMaxKey() complete")}else if("getMinKey"===o){r.update_variable("operation","getMinKey()"),r.update_variable("result",""),d(),r.record("start_getmin","Start getMinKey()");let e=i[0].next;if(1===e)d(void 0,void 0,'""'),r.update_variable("result",'""'),r.record("read_min","No keys exist, return empty string");else{let t=i[e],n=Array.from(t.keys)[0];d(n,t.count,`"${n}"`),r.update_variable("result",`"${n}"`),r.record("read_min",`Min count bucket has count=${t.count}, return "${n}"`)}d(),r.record("getmin_done","getMinKey() complete")}}}return d(),r.record("complete","All operations completed"),r.getSteps()
}

export function AllOoneDataStructureProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AllOoneDataStructureTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAllOoneDataStructureSteps(e) as any[];
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
      title="All O'one Data Structure"
      slug="all-oone-data-structure"
      approaches={approaches}
      presets={AllOoneDataStructurePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Employee Free Time (employee-free-time)
// ==========================================

const EmployeeFreeTimeTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def employeeFreeTime(self, schedule: '[[Interval]]') -> '[Interval]':\n        # Min-heap: (start, end, employee index, interval index)\n        heap = []\n        for i, emp in enumerate(schedule):\n            iv = emp[0]\n            heapq.heappush(heap, (iv.start, iv.end, i, 0))\n\n        result = []\n        # Extract first to initialize prevEnd\n        start, end, emp_idx, iv_idx = heapq.heappop(heap)\n        prev_end = end\n        if iv_idx + 1 < len(schedule[emp_idx]):\n            nxt = schedule[emp_idx][iv_idx + 1]\n            heapq.heappush(heap, (nxt.start, nxt.end, emp_idx, iv_idx + 1))\n\n        while heap:\n            start, end, emp_idx, iv_idx = heapq.heappop(heap)\n            # Gap found\n            if start > prev_end:\n                result.append(Interval(prev_end, start))\n            prev_end = max(prev_end, end)\n\n            # Push next interval from same employee\n            if iv_idx + 1 < len(schedule[emp_idx]):\n                nxt = schedule[emp_idx][iv_idx + 1]\n                heapq.heappush(heap, (nxt.start, nxt.end, emp_idx, iv_idx + 1))\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        4,
        5,
        6,
        7
      ],
      "poll_first": [
        11
      ],
      "init_prev_end": [
        12
      ],
      "push_next": [
        13,
        14,
        15
      ],
      "no_more_first": [
        13
      ],
      "poll": [
        18
      ],
      "check_gap": [
        20
      ],
      "gap_found": [
        21
      ],
      "update_prev_end": [
        22
      ],
      "push_employee_next": [
        25,
        26,
        27
      ],
      "no_more_intervals": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "check_gap": [
        20
      ],
      "first_has_next": [
        13
      ],
      "has_next": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {\n        // Min-heap: (start, end, employee index, interval index)\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n\n        // Push first interval from each employee\n        for (int i = 0; i < schedule.size(); i++) {\n            Interval iv = schedule.get(i).get(0);\n            heap.offer(new int[]{iv.start, iv.end, i, 0});\n        }\n\n        List<Interval> result = new ArrayList<>();\n        int[] first = heap.poll();\n        int prevEnd = first[1];\n        // Push next interval from this employee if it exists\n        if (first[3] + 1 < schedule.get(first[2]).size()) {\n            Interval next = schedule.get(first[2]).get(first[3] + 1);\n            heap.offer(new int[]{next.start, next.end, first[2], first[3] + 1});\n        }\n\n        while (!heap.isEmpty()) {\n            int[] curr = heap.poll();\n            // Gap found\n            if (curr[0] > prevEnd) {\n                result.add(new Interval(prevEnd, curr[0]));\n            }\n            prevEnd = Math.max(prevEnd, curr[1]);\n\n            // Push next interval from same employee\n            int empIdx = curr[2];\n            int ivIdx = curr[3];\n            if (ivIdx + 1 < schedule.get(empIdx).size()) {\n                Interval next = schedule.get(empIdx).get(ivIdx + 1);\n                heap.offer(new int[]{next.start, next.end, empIdx, ivIdx + 1});\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        4,
        7,
        8,
        9
      ],
      "poll_first": [
        13
      ],
      "init_prev_end": [
        14
      ],
      "push_next": [
        16,
        17,
        18
      ],
      "no_more_first": [
        16
      ],
      "poll": [
        22
      ],
      "check_gap": [
        24
      ],
      "gap_found": [
        25
      ],
      "update_prev_end": [
        27
      ],
      "push_employee_next": [
        32,
        33,
        34
      ],
      "no_more_intervals": [
        32
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "check_gap": [
        24
      ],
      "first_has_next": [
        16
      ],
      "has_next": [
        32
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<Interval> employeeFreeTime(vector<vector<Interval>> schedule) {\n        // Min-heap: (start, end, employee index, interval index)\n        auto cmp = [](const array<int,4>& a, const array<int,4>& b) {\n            return a[0] > b[0];\n        };\n        priority_queue<array<int,4>, vector<array<int,4>>, decltype(cmp)> heap(cmp);\n\n        // Push first interval from each employee\n        for (int i = 0; i < schedule.size(); i++) {\n            heap.push({schedule[i][0].start, schedule[i][0].end, i, 0});\n        }\n\n        vector<Interval> result;\n        auto first = heap.top(); heap.pop();\n        int prevEnd = first[1];\n        if (first[3] + 1 < (int)schedule[first[2]].size()) {\n            auto& nxt = schedule[first[2]][first[3] + 1];\n            heap.push({nxt.start, nxt.end, first[2], first[3] + 1});\n        }\n\n        while (!heap.empty()) {\n            auto curr = heap.top(); heap.pop();\n            // Gap found\n            if (curr[0] > prevEnd) {\n                result.push_back(Interval(prevEnd, curr[0]));\n            }\n            prevEnd = max(prevEnd, curr[1]);\n\n            // Push next interval from same employee\n            int empIdx = curr[2], ivIdx = curr[3];\n            if (ivIdx + 1 < (int)schedule[empIdx].size()) {\n                auto& nxt = schedule[empIdx][ivIdx + 1];\n                heap.push({nxt.start, nxt.end, empIdx, ivIdx + 1});\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_heap": [
        8,
        11,
        12
      ],
      "poll_first": [
        16
      ],
      "init_prev_end": [
        17
      ],
      "push_next": [
        18,
        19,
        20
      ],
      "no_more_first": [
        18
      ],
      "poll": [
        24
      ],
      "check_gap": [
        26
      ],
      "gap_found": [
        27
      ],
      "update_prev_end": [
        29
      ],
      "push_employee_next": [
        33,
        34,
        35
      ],
      "no_more_intervals": [
        33
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "check_gap": [
        26
      ],
      "first_has_next": [
        18
      ],
      "has_next": [
        33
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<Interval> EmployeeFreeTime(IList<IList<Interval>> schedule) {\n        // Min-heap using PriorityQueue: (start, end, empIdx, ivIdx)\n        var heap = new PriorityQueue<int[], int>();\n\n        // Push first interval from each employee\n        for (int i = 0; i < schedule.Count; i++) {\n            var iv = schedule[i][0];\n            heap.Enqueue(new int[]{iv.start, iv.end, i, 0}, iv.start);\n        }\n\n        var result = new List<Interval>();\n        var first = heap.Dequeue();\n        int prevEnd = first[1];\n        if (first[3] + 1 < schedule[first[2]].Count) {\n            var nxt = schedule[first[2]][first[3] + 1];\n            heap.Enqueue(new int[]{nxt.start, nxt.end, first[2], first[3] + 1}, nxt.start);\n        }\n\n        while (heap.Count > 0) {\n            var curr = heap.Dequeue();\n            // Gap found\n            if (curr[0] > prevEnd) {\n                result.Add(new Interval(prevEnd, curr[0]));\n            }\n            prevEnd = Math.Max(prevEnd, curr[1]);\n\n            // Push next interval from same employee\n            int empIdx = curr[2], ivIdx = curr[3];\n            if (ivIdx + 1 < schedule[empIdx].Count) {\n                var nxt = schedule[empIdx][ivIdx + 1];\n                heap.Enqueue(new int[]{nxt.start, nxt.end, empIdx, ivIdx + 1}, nxt.start);\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        4,
        7,
        8,
        9
      ],
      "poll_first": [
        13
      ],
      "init_prev_end": [
        14
      ],
      "push_next": [
        15,
        16,
        17
      ],
      "no_more_first": [
        15
      ],
      "poll": [
        21
      ],
      "check_gap": [
        23
      ],
      "gap_found": [
        24
      ],
      "update_prev_end": [
        26
      ],
      "push_employee_next": [
        30,
        31,
        32
      ],
      "no_more_intervals": [
        30
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "check_gap": [
        23
      ],
      "first_has_next": [
        15
      ],
      "has_next": [
        30
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func employeeFreeTime(schedule [][]*Interval) []*Interval {\n    // Min-heap entry: [start, end, empIdx, ivIdx]\n    h := &MinHeap{}\n    heap.Init(h)\n\n    // Push first interval from each employee\n    for i, emp := range schedule {\n        heap.Push(h, [4]int{emp[0].Start, emp[0].End, i, 0})\n    }\n\n    result := []*Interval{}\n    first := heap.Pop(h).([4]int)\n    prevEnd := first[1]\n    if first[3]+1 < len(schedule[first[2]]) {\n        nxt := schedule[first[2]][first[3]+1]\n        heap.Push(h, [4]int{nxt.Start, nxt.End, first[2], first[3] + 1})\n    }\n\n    for h.Len() > 0 {\n        curr := heap.Pop(h).([4]int)\n        // Gap found\n        if curr[0] > prevEnd {\n            result = append(result, &Interval{Start: prevEnd, End: curr[0]})\n        }\n        if curr[1] > prevEnd {\n            prevEnd = curr[1]\n        }\n\n        // Push next interval from same employee\n        empIdx, ivIdx := curr[2], curr[3]\n        if ivIdx+1 < len(schedule[empIdx]) {\n            nxt := schedule[empIdx][ivIdx+1]\n            heap.Push(h, [4]int{nxt.Start, nxt.End, empIdx, ivIdx + 1})\n        }\n    }\n\n    return result\n}\n\n// MinHeap implements heap.Interface for [4]int entries sorted by start time\ntype MinHeap [][4]int\n\nfunc (h MinHeap) Len() int            { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool  { return h[i][0] < h[j][0] }\nfunc (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{}) { *h = append(*h, x.([4]int)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        3,
        4,
        7,
        8
      ],
      "poll_first": [
        12
      ],
      "init_prev_end": [
        13
      ],
      "push_next": [
        14,
        15,
        16
      ],
      "no_more_first": [
        14
      ],
      "poll": [
        20
      ],
      "check_gap": [
        22
      ],
      "gap_found": [
        23
      ],
      "update_prev_end": [
        25,
        26
      ],
      "push_employee_next": [
        31,
        32,
        33
      ],
      "no_more_intervals": [
        31
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "check_gap": [
        22
      ],
      "first_has_next": [
        14
      ],
      "has_next": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var employeeFreeTime = function (schedule) {\n  // Binary min-heap keyed by start time (entries: [start, end, empIdx, ivIdx])\n  const heap = [];\n  const swap = (i, j) => { [heap[i], heap[j]] = [heap[j], heap[i]]; };\n  const push = (item) => {\n    heap.push(item);\n    let i = heap.length - 1;\n    while (i > 0) {\n      const p = (i - 1) >> 1;\n      if (heap[p][0] <= heap[i][0]) break;\n      swap(i, p);\n      i = p;\n    }\n  };\n  const pop = () => {\n    const top = heap[0];\n    const last = heap.pop();\n    if (heap.length > 0) {\n      heap[0] = last;\n      let i = 0;\n      while (true) {\n        const l = 2 * i + 1, r = 2 * i + 2;\n        let smallest = i;\n        if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;\n        if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;\n        if (smallest === i) break;\n        swap(i, smallest);\n        i = smallest;\n      }\n    }\n    return top;\n  };\n\n  // Seed with the first interval of each employee\n  for (let i = 0; i < schedule.length; i++) {\n    const iv = schedule[i][0];\n    push([iv.start, iv.end, i, 0]);\n  }\n\n  const result = [];\n  const first = pop();\n  let prevEnd = first[1];\n  if (first[3] + 1 < schedule[first[2]].length) {\n    const nxt = schedule[first[2]][first[3] + 1];\n    push([nxt.start, nxt.end, first[2], first[3] + 1]);\n  }\n\n  while (heap.length > 0) {\n    const curr = pop();\n    // Gap found between prevEnd and this start\n    if (curr[0] > prevEnd) {\n      result.push(new Interval(prevEnd, curr[0]));\n    }\n    prevEnd = Math.max(prevEnd, curr[1]);\n\n    // Push next interval from the same employee\n    const empIdx = curr[2], ivIdx = curr[3];\n    if (ivIdx + 1 < schedule[empIdx].length) {\n      const nxt = schedule[empIdx][ivIdx + 1];\n      push([nxt.start, nxt.end, empIdx, ivIdx + 1]);\n    }\n  }\n\n  return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        3,
        35,
        36,
        37
      ],
      "poll_first": [
        41
      ],
      "init_prev_end": [
        42
      ],
      "push_next": [
        43,
        44,
        45
      ],
      "no_more_first": [
        43
      ],
      "poll": [
        49
      ],
      "check_gap": [
        51
      ],
      "gap_found": [
        52
      ],
      "update_prev_end": [
        54
      ],
      "push_employee_next": [
        58,
        59,
        60
      ],
      "no_more_intervals": [
        58
      ],
      "complete": [
        64
      ]
    },
    "conditionalMap": {
      "check_gap": [
        51
      ],
      "first_has_next": [
        43
      ],
      "has_next": [
        58
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function employeeFreeTime(schedule: Interval[][]): Interval[] {\n    // Binary min-heap keyed by start time (entries: [start, end, empIdx, ivIdx])\n    const heap: number[][] = [];\n    const swap = (i: number, j: number) => { [heap[i], heap[j]] = [heap[j], heap[i]]; };\n    const push = (item: number[]) => {\n        heap.push(item);\n        let i = heap.length - 1;\n        while (i > 0) {\n            const p = (i - 1) >> 1;\n            if (heap[p][0] <= heap[i][0]) break;\n            swap(i, p);\n            i = p;\n        }\n    };\n    const pop = (): number[] => {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                const l = 2 * i + 1, r = 2 * i + 2;\n                let smallest = i;\n                if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;\n                if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;\n                if (smallest === i) break;\n                swap(i, smallest);\n                i = smallest;\n            }\n        }\n        return top;\n    };\n\n    // Seed with the first interval of each employee\n    for (let i = 0; i < schedule.length; i++) {\n        const iv = schedule[i][0];\n        push([iv.start, iv.end, i, 0]);\n    }\n\n    const result: Interval[] = [];\n    const first = pop();\n    let prevEnd = first[1];\n    if (first[3] + 1 < schedule[first[2]].length) {\n        const nxt = schedule[first[2]][first[3] + 1];\n        push([nxt.start, nxt.end, first[2], first[3] + 1]);\n    }\n\n    while (heap.length > 0) {\n        const curr = pop();\n        // Gap found between prevEnd and this start\n        if (curr[0] > prevEnd) {\n            result.push(new Interval(prevEnd, curr[0]));\n        }\n        prevEnd = Math.max(prevEnd, curr[1]);\n\n        // Push next interval from the same employee\n        const empIdx = curr[2], ivIdx = curr[3];\n        if (ivIdx + 1 < schedule[empIdx].length) {\n            const nxt = schedule[empIdx][ivIdx + 1];\n            push([nxt.start, nxt.end, empIdx, ivIdx + 1]);\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        3,
        35,
        36,
        37
      ],
      "poll_first": [
        41
      ],
      "init_prev_end": [
        42
      ],
      "push_next": [
        43,
        44,
        45
      ],
      "no_more_first": [
        43
      ],
      "poll": [
        49
      ],
      "check_gap": [
        51
      ],
      "gap_found": [
        52
      ],
      "update_prev_end": [
        54
      ],
      "push_employee_next": [
        58,
        59,
        60
      ],
      "no_more_intervals": [
        58
      ],
      "complete": [
        64
      ]
    },
    "conditionalMap": {
      "check_gap": [
        51
      ],
      "first_has_next": [
        43
      ],
      "has_next": [
        58
      ]
    }
  }
};

const EmployeeFreeTimePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "schedule": [
        [
          [
            1,
            2
          ],
          [
            5,
            6
          ]
        ],
        [
          [
            1,
            3
          ]
        ],
        [
          [
            4,
            10
          ]
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "schedule": [
        [
          [
            1,
            3
          ],
          [
            6,
            7
          ]
        ],
        [
          [
            2,
            4
          ]
        ],
        [
          [
            2,
            5
          ],
          [
            9,
            12
          ]
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No free time",
    "value": {
      "schedule": [
        [
          [
            1,
            10
          ]
        ],
        [
          [
            1,
            10
          ]
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Multiple gaps",
    "value": {
      "schedule": [
        [
          [
            1,
            2
          ],
          [
            3,
            4
          ],
          [
            7,
            8
          ]
        ],
        [
          [
            5,
            6
          ],
          [
            9,
            10
          ]
        ]
      ]
    }
  }
];

function generateEmployeeFreeTimeSteps(e: any): any[] {
  
let t=e.schedule.map(e=>e.map(e=>[...e])),a=t.length,n=new StepRecorder({stripLabel:"events (time, +/-1)"},{});if(0===a)return n.record("-","No employees"),n.record("complete","No free time to find"),n.getSteps();let i=(e,t)=>`emp_${e}_iv_${t}`,l=(e,a,r)=>({type:"range",start:t[e][a][0],end:t[e][a][1],label:`[${t[e][a][0]},${t[e][a][1]}]`,state:r});t.forEach((e,t)=>{e.forEach((e,a)=>n.add_new_visual(i(t,a),l(t,a)))}),n.record("-","Find the common free time by sweeping start and end events");let s=[];t.forEach((e,t)=>e.forEach((e,a)=>{s.push({time:e[0],type:1,e:t,i:a}),s.push({time:e[1],type:-1,e:t,i:a})}));let p=e=>`hchip_${e.e}_${e.i}${e.type>0?"s":"e"}`,o=e=>`${e.time}:${e.type>0?"+1":"-1"}`;s.forEach((e,t)=>{n.add_new_visual(p(e),{type:"arrayElement",position:t,value:o(e),state:"entering"})}),n.record("create_events",`Create ${s.length} events from the intervals`),s.sort((e,t)=>e.time-t.time||e.type-t.type),s.forEach((e,t)=>{n.update_visual(p(e),{type:"arrayElement",position:t,value:o(e)})}),n.record("sort_events","Sort by time, ends before starts at the same time");let d=0,c=-1,u=0;for(let e of(n.update_variable("active",d),n.record("init_sweep","active = 0, gapStart = -1"),s))n.add_conditional("for_loop",!0),d+=e.type,n.update_variable("active",d),n.update_variable("stripLabel",`events (active = ${d})`),n.update_visual(i(e.e,e.i),l(e.e,e.i,e.type>0?"active":"visited")),n.record("process_event",`${e.type>0?"Start":"End"} at ${e.time}: active = ${d}`),n.add_conditional("is_zero",0===d),0===d&&(c=e.time,n.update_variable("gapStart",c),n.record("gap_start",`Everyone is free from ${c}`)),n.add_conditional("gap_open",d>0&&-1!==c),d>0&&-1!==c&&(n.add_conditional("has_width",e.time>c),e.time>c&&(n.add_new_visual(`gap_${u}`,{type:"range",start:c,end:e.time,label:`[${c},${e.time}]`,state:"gap"}),u++,n.update_variable("prevEnd",c),n.update_variable("currStart",e.time),n.record("gap_found",`Free time found: [${c},${e.time}]`)),c=-1,n.update_variable("gapStart",c),n.record("close_gap","Someone is busy again, reset gapStart"));return n.add_conditional("for_loop",!1),n.update_variable("stripLabel","events (time, +/-1)"),n.record("complete",u>0?`Found ${u} free-time interval${1===u?"":"s"}`:"No common free time"),n.getSteps()
}

export function EmployeeFreeTimeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: EmployeeFreeTimeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateEmployeeFreeTimeSteps(e) as any[];
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
      title="Employee Free Time"
      slug="employee-free-time"
      approaches={approaches}
      presets={EmployeeFreeTimePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Kth Largest Element in a Stream (kth-largest-element-in-a-stream)
// ==========================================

const KthLargestElementInAStreamTemplates = {
  "python": {
    "language": "python",
    "code": "class KthLargest:\n    def __init__(self, k: int, nums: list[int]):\n        self.k = k\n        self.min_heap = []\n\n        # Add all initial elements, keep only k largest\n        for num in nums:\n            heapq.heappush(self.min_heap, num)\n            if len(self.min_heap) > k:\n                heapq.heappop(self.min_heap)\n\n    def add(self, val: int) -> int:\n        heapq.heappush(self.min_heap, val)\n        # If heap exceeds size k, remove the smallest\n        if len(self.min_heap) > self.k:\n            heapq.heappop(self.min_heap)\n        # The root is the kth largest element\n        return self.min_heap[0]",
    "lineMap": {
      "-": [
        2
      ],
      "init_add": [
        7,
        8
      ],
      "init_remove": [
        10
      ],
      "add_val": [
        13
      ],
      "add_remove": [
        16
      ],
      "return_peek": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        9
      ],
      "check_size_add": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class KthLargest {\n    private PriorityQueue<Integer> minHeap;\n    private int k;\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        minHeap = new PriorityQueue<>();\n\n        // Add all initial elements to the heap\n        for (int num : nums) {\n            minHeap.offer(num);\n            // Keep only the k largest elements\n            if (minHeap.size() > k) {\n                minHeap.poll();\n            }\n        }\n    }\n\n    public int add(int val) {\n        minHeap.offer(val);\n        // If heap exceeds size k, remove the smallest\n        if (minHeap.size() > k) {\n            minHeap.poll();\n        }\n        // The root is the kth largest element\n        return minHeap.peek();\n    }\n}",
    "lineMap": {
      "-": [
        5
      ],
      "init_add": [
        10,
        11
      ],
      "init_remove": [
        14
      ],
      "add_val": [
        20
      ],
      "add_remove": [
        23
      ],
      "return_peek": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        13
      ],
      "check_size_add": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class KthLargest {\npublic:\n    int k;\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n\n    KthLargest(int k, vector<int>& nums) {\n        this->k = k;\n        // Add all initial elements, keep only k largest\n        for (int num : nums) {\n            minHeap.push(num);\n            if ((int)minHeap.size() > k) {\n                minHeap.pop();\n            }\n        }\n    }\n\n    int add(int val) {\n        minHeap.push(val);\n        // If heap exceeds size k, remove the smallest\n        if ((int)minHeap.size() > k) {\n            minHeap.pop();\n        }\n        // The root is the kth largest element\n        return minHeap.top();\n    }\n};",
    "lineMap": {
      "-": [
        6
      ],
      "init_add": [
        9,
        10
      ],
      "init_remove": [
        12
      ],
      "add_val": [
        18
      ],
      "add_remove": [
        21
      ],
      "return_peek": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        11
      ],
      "check_size_add": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class KthLargest {\n    private PriorityQueue<int, int> minHeap;\n    private int k;\n\n    public KthLargest(int k, int[] nums) {\n        this.k = k;\n        minHeap = new PriorityQueue<int, int>();\n\n        // Add all initial elements, keep only k largest\n        foreach (int num in nums) {\n            minHeap.Enqueue(num, num);\n            if (minHeap.Count > k) {\n                minHeap.Dequeue();\n            }\n        }\n    }\n\n    public int Add(int val) {\n        minHeap.Enqueue(val, val);\n        // If heap exceeds size k, remove the smallest\n        if (minHeap.Count > k) {\n            minHeap.Dequeue();\n        }\n        // The root is the kth largest element\n        return minHeap.Peek();\n    }\n}",
    "lineMap": {
      "-": [
        5
      ],
      "init_add": [
        10,
        11
      ],
      "init_remove": [
        13
      ],
      "add_val": [
        19
      ],
      "add_remove": [
        22
      ],
      "return_peek": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        12
      ],
      "check_size_add": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type KthLargest struct {\n    k    int\n    heap MinHeap\n}\n\ntype MinHeap []int\n\nfunc (h MinHeap) Len() int            { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool   { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}\n\nfunc Constructor(k int, nums []int) KthLargest {\n    kl := KthLargest{k: k, heap: MinHeap{}}\n    heap.Init(&kl.heap)\n\n    // Add all initial elements, keep only k largest\n    for _, num := range nums {\n        heap.Push(&kl.heap, num)\n        if kl.heap.Len() > k {\n            heap.Pop(&kl.heap)\n        }\n    }\n    return kl\n}\n\nfunc (this *KthLargest) Add(val int) int {\n    heap.Push(&this.heap, val)\n    // If heap exceeds size k, remove the smallest\n    if this.heap.Len() > this.k {\n        heap.Pop(&this.heap)\n    }\n    // The root is the kth largest element\n    return this.heap[0]\n}",
    "lineMap": {
      "-": [
        20
      ],
      "init_add": [
        25,
        26
      ],
      "init_remove": [
        28
      ],
      "add_val": [
        35
      ],
      "add_remove": [
        38
      ],
      "return_peek": [
        41
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        27
      ],
      "check_size_add": [
        37
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var KthLargest = function(k, nums) {\n    this.k = k;\n    this.heap = [];\n\n    // Add all initial elements, keep only k largest\n    for (var i = 0; i < nums.length; i++) {\n        this.heapPush(nums[i]);\n        if (this.heap.length > k) {\n            this.heapPop();\n        }\n    }\n};\n\nKthLargest.prototype.add = function(val) {\n    this.heapPush(val);\n    // If heap exceeds size k, remove the smallest\n    if (this.heap.length > this.k) {\n        this.heapPop();\n    }\n    // The root is the kth largest element\n    return this.heap[0];\n};\n\n// Min-heap helper: push value and bubble up\nKthLargest.prototype.heapPush = function(val) {\n    this.heap.push(val);\n    var i = this.heap.length - 1;\n    while (i > 0) {\n        var parent = Math.floor((i - 1) / 2);\n        if (this.heap[parent] <= this.heap[i]) break;\n        var temp = this.heap[parent];\n        this.heap[parent] = this.heap[i];\n        this.heap[i] = temp;\n        i = parent;\n    }\n};\n\n// Min-heap helper: pop root and sift down\nKthLargest.prototype.heapPop = function() {\n    var top = this.heap[0];\n    var last = this.heap.pop();\n    if (this.heap.length > 0) {\n        this.heap[0] = last;\n        var i = 0;\n        while (true) {\n            var left = 2 * i + 1;\n            var right = 2 * i + 2;\n            var smallest = i;\n            if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;\n            if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;\n            if (smallest === i) break;\n            var temp = this.heap[i];\n            this.heap[i] = this.heap[smallest];\n            this.heap[smallest] = temp;\n            i = smallest;\n        }\n    }\n    return top;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_add": [
        6,
        7
      ],
      "init_remove": [
        9
      ],
      "add_val": [
        15
      ],
      "add_remove": [
        18
      ],
      "return_peek": [
        21
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        8
      ],
      "check_size_add": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class KthLargest {\n    private k: number;\n    private heap: number[];\n\n    constructor(k: number, nums: number[]) {\n        this.k = k;\n        this.heap = [];\n\n        // Add all initial elements, keep only k largest\n        for (const num of nums) {\n            this.heapPush(num);\n            if (this.heap.length > k) {\n                this.heapPop();\n            }\n        }\n    }\n\n    add(val: number): number {\n        this.heapPush(val);\n        // If heap exceeds size k, remove the smallest\n        if (this.heap.length > this.k) {\n            this.heapPop();\n        }\n        // The root is the kth largest element\n        return this.heap[0];\n    }\n\n    // Min-heap helper: push value and bubble up\n    private heapPush(val: number): void {\n        this.heap.push(val);\n        let i = this.heap.length - 1;\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (this.heap[parent] <= this.heap[i]) break;\n            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];\n            i = parent;\n        }\n    }\n\n    // Min-heap helper: pop root and sift down\n    private heapPop(): number {\n        const top = this.heap[0];\n        const last = this.heap.pop()!;\n        if (this.heap.length > 0) {\n            this.heap[0] = last;\n            let i = 0;\n            while (true) {\n                const left = 2 * i + 1;\n                const right = 2 * i + 2;\n                let smallest = i;\n                if (left < this.heap.length && this.heap[left] < this.heap[smallest]) smallest = left;\n                if (right < this.heap.length && this.heap[right] < this.heap[smallest]) smallest = right;\n                if (smallest === i) break;\n                [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];\n                i = smallest;\n            }\n        }\n        return top;\n    }\n}",
    "lineMap": {
      "-": [
        5
      ],
      "init_add": [
        10,
        11
      ],
      "init_remove": [
        13
      ],
      "add_val": [
        19
      ],
      "add_remove": [
        22
      ],
      "return_peek": [
        25
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_size_init": [
        12
      ],
      "check_size_add": [
        21
      ]
    }
  }
};

const KthLargestElementInAStreamPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        4,
        5,
        8,
        2
      ],
      "k": 3,
      "addCalls": [
        3,
        5,
        10,
        9,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "k=1",
    "value": {
      "nums": [
        1
      ],
      "k": 1,
      "addCalls": [
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Duplicates",
    "value": {
      "nums": [
        7,
        7,
        7,
        7,
        8,
        3
      ],
      "k": 4,
      "addCalls": [
        2,
        10,
        9,
        9
      ]
    }
  }
];

function generateKthLargestElementInAStreamSteps(e: any): any[] {
  class s{push(e,t){this.heap.push([e,t]),this.bubbleUp(this.heap.length-1)}pop(){if(0===this.heap.length)return;if(1===this.heap.length)return this.heap.pop();let e=this.heap[0];return this.heap[0]=this.heap.pop(),this.bubbleDown(0),e}peek(){return this.heap.length>0?this.heap[0]:void 0}size(){return this.heap.length}getArray(){return[...this.heap]}bubbleUp(e){for(;e>0;){let t=Math.floor((e-1)/2);if(this.heap[e][0]>=this.heap[t][0])break;[this.heap[e],this.heap[t]]=[this.heap[t],this.heap[e]],e=t}}bubbleDown(e){for(;;){let t=e,a=2*e+1,i=2*e+2;if(a<this.heap.length&&this.heap[a][0]<this.heap[t][0]&&(t=a),i<this.heap.length&&this.heap[i][0]<this.heap[t][0]&&(t=i),t===e)break;[this.heap[e],this.heap[t]]=[this.heap[t],this.heap[e]],e=t}}constructor(){this.heap=[]}}
let t=[...e.nums],a=e.k,r=[...e.addCalls],l={};t.forEach((e,t)=>{l[`elem_${t}`]={type:"arrayElement",value:e,position:t,fontSize:18}}),r.forEach((e,t)=>{l[`add_${t}`]={type:"arrayElement",value:e,position:t,fontSize:18}});let o=new s,h=0,p=new StepRecorder({mode:"heap",k:a,kthLargest:null},{...l}),d=()=>(0,n.bj)(o.getArray(),"heap_elem_"),u=()=>{let e=d(),t=new Set(Object.keys(e));for(let e=0;e<h;e++){let a=`heap_elem_${e}`;t.has(a)||p.delete_visual(a)}for(let[t,a]of Object.entries(e))p.update_visual(t,a)};p.record("-",`Start: Initialize KthLargest with k=${a} and nums=[${t.join(",")}]`);for(let e=0;e<t.length;e++){let i=t[e];p.update_visual(`elem_${e}`,{type:"arrayElement",value:i,position:e,state:"active",fontSize:18});let n=`${h++}`;for(let[e,t]of(o.push(i,n),Object.entries(d())))p.update_visual(e,t);if(p.record("init_add",`Constructor: Add ${i} to heap (size: ${o.size()})`),o.size()>a){p.add_conditional("check_size_init",!0);let[e]=o.pop();u(),p.record("init_remove",`Size ${o.size()+1} > ${a}, remove min=${e} (size: ${o.size()})`)}else p.add_conditional("check_size_init",!1);p.update_visual(`elem_${e}`,{type:"arrayElement",value:i,position:e,state:"sorted",fontSize:18})}let c=[];for(let e=0;e<r.length;e++){let t=r[e];p.update_visual(`add_${e}`,{type:"arrayElement",value:t,position:e,state:"active",fontSize:18});let i=`${h++}`;for(let[e,a]of(o.push(t,i),Object.entries(d())))p.update_visual(e,a);if(p.record("add_val",`add(${t}): Push ${t} onto heap (size: ${o.size()})`),o.size()>a){p.add_conditional("check_size_add",!0);let[e]=o.pop();u(),p.record("add_remove",`Size ${o.size()+1} > ${a}, remove min=${e} (size: ${o.size()})`)}else p.add_conditional("check_size_add",!1);let n=o.peek()[0];c.push(n);let s=d();for(let[e,t]of Object.entries(s))t.parent||p.update_visual(e,{...t,state:"active"});for(let[t,a]of(p.update_visual(`ret_${e}`,{type:"arrayElement",value:n,position:e,state:"entering",fontSize:18}),p.update_variable("kthLargest",n),p.record("return_peek",`Return heap top = kth largest = ${n}`),Object.entries(s)))p.update_visual(t,a);p.update_visual(`ret_${e}`,{type:"arrayElement",value:n,position:e,state:"sorted",fontSize:18}),p.update_visual(`add_${e}`,{type:"arrayElement",value:t,position:e,state:"sorted",fontSize:18})}return p.record("complete",`Done. Returns: [${c.join(", ")}]`),p.getSteps()
}

export function KthLargestElementInAStreamProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KthLargestElementInAStreamTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKthLargestElementInAStreamSteps(e) as any[];
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
      title="Kth Largest Element in a Stream"
      slug="kth-largest-element-in-a-stream"
      approaches={approaches}
      presets={KthLargestElementInAStreamPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find the Kth Largest Integer in the Array (find-the-kth-largest-integer-in-the-array)
// ==========================================

const FindTheKthLargestIntegerInTheArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def kth_largest_number(nums, k):\n    target = len(nums) - k\n    return quick_select(nums, 0, len(nums) - 1, target)\n\ndef quick_select(nums, left, right, target):\n    if left == right:\n        return nums[left]\n\n    pivot_idx = left + (right - left) // 2\n    pivot = nums[pivot_idx]\n    lo, hi, mid = left, right, left\n\n    while mid <= hi:\n        cmp = compare(nums[mid], pivot)\n        if cmp < 0:\n            nums[lo], nums[mid] = nums[mid], nums[lo]\n            lo += 1; mid += 1\n        elif cmp > 0:\n            nums[mid], nums[hi] = nums[hi], nums[mid]\n            hi -= 1\n        else:\n            mid += 1\n\n    if target < lo:\n        return quick_select(nums, left, lo - 1, target)\n    elif target > hi:\n        return quick_select(nums, hi + 1, right, target)\n    else:\n        return nums[target]",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        6,
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        24
      ],
      "recurse_left": [
        25
      ],
      "recurse_right": [
        27
      ],
      "found": [
        29
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        24
      ]
    },
    "recursiveCode": "def compare(a, b):\n    if len(a) != len(b):\n        return len(a) - len(b)\n    if a < b:\n        return -1\n    if a > b:\n        return 1\n    return 0",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ]
    },
    "recursiveConditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public String kthLargestNumber(String[] nums, int k) {\n    int target = nums.length - k;\n    return quickSelect(nums, 0, nums.length - 1, target);\n}\n\nString quickSelect(String[] nums, int left, int right, int target) {\n    if (left == right) return nums[left];\n\n    int pivotIdx = left + (right - left) / 2;\n    String pivot = nums[pivotIdx];\n    int lo = left, hi = right, mid = left;\n\n    while (mid <= hi) {\n        int cmp = compare(nums[mid], pivot);\n        if (cmp < 0) {\n            swap(nums, lo, mid);\n            lo++; mid++;\n        } else if (cmp > 0) {\n            swap(nums, mid, hi);\n            hi--;\n        } else {\n            mid++;\n        }\n    }\n\n    if (target < lo) return quickSelect(nums, left, lo - 1, target);\n    else if (target > hi) return quickSelect(nums, hi + 1, right, target);\n    else return nums[target];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        26
      ],
      "recurse_left": [
        26
      ],
      "recurse_right": [
        27
      ],
      "found": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        26
      ]
    },
    "recursiveCode": "int compare(String a, String b) {\n    if (a.length() != b.length())\n        return a.length() - b.length();\n    return a.compareTo(b);\n}\n\nvoid swap(String[] nums, int i, int j) {\n    String temp = nums[i];\n    nums[i] = nums[j];\n    nums[j] = temp;\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4
      ]
    },
    "recursiveConditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "string kthLargestNumber(vector<string>& nums, int k) {\n    int target = nums.size() - k;\n    return quickSelect(nums, 0, nums.size() - 1, target);\n}\n\nstring quickSelect(vector<string>& nums, int left, int right, int target) {\n    if (left == right) return nums[left];\n\n    int pivotIdx = left + (right - left) / 2;\n    string pivot = nums[pivotIdx];\n    int lo = left, hi = right, mid = left;\n\n    while (mid <= hi) {\n        int cmp = compare(nums[mid], pivot);\n        if (cmp < 0) {\n            swap(nums[lo], nums[mid]);\n            lo++; mid++;\n        } else if (cmp > 0) {\n            swap(nums[mid], nums[hi]);\n            hi--;\n        } else {\n            mid++;\n        }\n    }\n\n    if (target < lo) return quickSelect(nums, left, lo - 1, target);\n    else if (target > hi) return quickSelect(nums, hi + 1, right, target);\n    else return nums[target];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        26
      ],
      "recurse_left": [
        26
      ],
      "recurse_right": [
        27
      ],
      "found": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        26
      ]
    },
    "recursiveCode": "int compare(const string& a, const string& b) {\n    if (a.size() != b.size())\n        return a.size() - b.size();\n    return a.compare(b);\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4
      ]
    },
    "recursiveConditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public string KthLargestNumber(string[] nums, int k) {\n    int target = nums.Length - k;\n    return QuickSelect(nums, 0, nums.Length - 1, target);\n}\n\nstring QuickSelect(string[] nums, int left, int right, int target) {\n    if (left == right) return nums[left];\n\n    int pivotIdx = left + (right - left) / 2;\n    string pivot = nums[pivotIdx];\n    int lo = left, hi = right, mid = left;\n\n    while (mid <= hi) {\n        int cmp = Compare(nums[mid], pivot);\n        if (cmp < 0) {\n            (nums[lo], nums[mid]) = (nums[mid], nums[lo]);\n            lo++; mid++;\n        } else if (cmp > 0) {\n            (nums[mid], nums[hi]) = (nums[hi], nums[mid]);\n            hi--;\n        } else {\n            mid++;\n        }\n    }\n\n    if (target < lo) return QuickSelect(nums, left, lo - 1, target);\n    else if (target > hi) return QuickSelect(nums, hi + 1, right, target);\n    else return nums[target];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        26
      ],
      "recurse_left": [
        26
      ],
      "recurse_right": [
        27
      ],
      "found": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        26
      ]
    },
    "recursiveCode": "int Compare(string a, string b) {\n    if (a.Length != b.Length)\n        return a.Length - b.Length;\n    return string.Compare(a, b, StringComparison.Ordinal);\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4
      ]
    },
    "recursiveConditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func kthLargestNumber(nums []string, k int) string {\n    target := len(nums) - k\n    return quickSelect(nums, 0, len(nums)-1, target)\n}\n\nfunc quickSelect(nums []string, left, right, target int) string {\n    if left == right {\n        return nums[left]\n    }\n\n    pivotIdx := left + (right-left)/2\n    pivot := nums[pivotIdx]\n    lo, hi, mid := left, right, left\n\n    for mid <= hi {\n        cmp := compare(nums[mid], pivot)\n        if cmp < 0 {\n            nums[lo], nums[mid] = nums[mid], nums[lo]\n            lo++; mid++\n        } else if cmp > 0 {\n            nums[mid], nums[hi] = nums[hi], nums[mid]\n            hi--\n        } else {\n            mid++\n        }\n    }\n\n    if target < lo {\n        return quickSelect(nums, left, lo-1, target)\n    } else if target > hi {\n        return quickSelect(nums, hi+1, right, target)\n    }\n    return nums[target]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7,
        8
      ],
      "pick_pivot": [
        11,
        12
      ],
      "init_partition": [
        13
      ],
      "compare_mid": [
        15,
        16,
        17
      ],
      "swap_lo": [
        18,
        19
      ],
      "swap_hi": [
        21,
        22
      ],
      "advance_mid": [
        24
      ],
      "check_target": [
        28
      ],
      "recurse_left": [
        29
      ],
      "recurse_right": [
        31
      ],
      "found": [
        33
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        17
      ],
      "check_target": [
        28
      ]
    },
    "recursiveCode": "func compare(a, b string) int {\n    if len(a) != len(b) {\n        return len(a) - len(b)\n    }\n    if a < b {\n        return -1\n    }\n    if a > b {\n        return 1\n    }\n    return 0\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        5,
        6,
        8,
        9
      ]
    },
    "recursiveConditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function kthLargestNumber(nums, k) {\n    const target = nums.length - k;\n    return quickSelect(nums, 0, nums.length - 1, target);\n}\n\nfunction quickSelect(nums, left, right, target) {\n    if (left === right) return nums[left];\n\n    const pivotIdx = left + Math.floor((right - left) / 2);\n    const pivot = nums[pivotIdx];\n    let lo = left, hi = right, mid = left;\n\n    while (mid <= hi) {\n        const cmp = compare(nums[mid], pivot);\n        if (cmp < 0) {\n            [nums[lo], nums[mid]] = [nums[mid], nums[lo]];\n            lo++; mid++;\n        } else if (cmp > 0) {\n            [nums[mid], nums[hi]] = [nums[hi], nums[mid]];\n            hi--;\n        } else {\n            mid++;\n        }\n    }\n\n    if (target < lo) return quickSelect(nums, left, lo - 1, target);\n    else if (target > hi) return quickSelect(nums, hi + 1, right, target);\n    else return nums[target];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        26
      ],
      "recurse_left": [
        26
      ],
      "recurse_right": [
        27
      ],
      "found": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        26
      ]
    },
    "recursiveCode": "function compare(a, b) {\n    if (a.length !== b.length)\n        return a.length - b.length;\n    if (a < b) return -1;\n    if (a > b) return 1;\n    return 0;\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4,
        5
      ]
    },
    "recursiveConditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function kthLargestNumber(nums: string[], k: number): string {\n    const target = nums.length - k;\n    return quickSelect(nums, 0, nums.length - 1, target);\n}\n\nfunction quickSelect(nums: string[], left: number, right: number, target: number): string {\n    if (left === right) return nums[left];\n\n    const pivotIdx = left + Math.floor((right - left) / 2);\n    const pivot = nums[pivotIdx];\n    let lo = left, hi = right, mid = left;\n\n    while (mid <= hi) {\n        const cmp = compare(nums[mid], pivot);\n        if (cmp < 0) {\n            [nums[lo], nums[mid]] = [nums[mid], nums[lo]];\n            lo++; mid++;\n        } else if (cmp > 0) {\n            [nums[mid], nums[hi]] = [nums[hi], nums[mid]];\n            hi--;\n        } else {\n            mid++;\n        }\n    }\n\n    if (target < lo) return quickSelect(nums, left, lo - 1, target);\n    else if (target > hi) return quickSelect(nums, hi + 1, right, target);\n    else return nums[target];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "calc_target": [
        2,
        3
      ],
      "base_case": [
        7
      ],
      "pick_pivot": [
        9,
        10
      ],
      "init_partition": [
        11
      ],
      "compare_mid": [
        13,
        14,
        15
      ],
      "swap_lo": [
        16,
        17
      ],
      "swap_hi": [
        19,
        20
      ],
      "advance_mid": [
        22
      ],
      "check_target": [
        26
      ],
      "recurse_left": [
        26
      ],
      "recurse_right": [
        27
      ],
      "found": [
        28
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "compare_mid": [
        15
      ],
      "check_target": [
        26
      ]
    },
    "recursiveCode": "function compare(a: string, b: string): number {\n    if (a.length !== b.length)\n        return a.length - b.length;\n    if (a < b) return -1;\n    if (a > b) return 1;\n    return 0;\n}",
    "recursiveLineMap": {
      "compare_mid": [
        1,
        2,
        3,
        4,
        5
      ]
    },
    "recursiveConditionalMap": {}
  }
};

const FindTheKthLargestIntegerInTheArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        "3",
        "6",
        "7",
        "10"
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Medium",
    "value": {
      "nums": [
        "2",
        "21",
        "12",
        "1"
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Large Numbers",
    "value": {
      "nums": [
        "543",
        "123",
        "765",
        "432",
        "876"
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "Same Length",
    "value": {
      "nums": [
        "3",
        "5",
        "1",
        "9",
        "7",
        "4"
      ],
      "k": 3
    }
  },
  {
    "id": "ex5",
    "label": "Single",
    "value": {
      "nums": [
        "42"
      ],
      "k": 1
    }
  }
];

function generateFindTheKthLargestIntegerInTheArraySteps(e: any): any[] {
  
let t=[...e.nums],i=e.k,a=t.length,l=t.map(e=>parseInt(e,10)),s={};for(let e=0;e<a;e++)s[`bar_${e}`]={type:"arrayElement",value:l[e],position:e,label:t[e]};let o=t.map((e,t)=>t),u=new RecursiveStepRecorder({nums:[...t],k:i,n:a},{...s});u.pushCallFrame({k:i},"kthLargestNumber"),u.record("-",`Start: Find the ${i}${1===i?"st":2===i?"nd":3===i?"rd":"th"} largest integer in the array`);let c=a-i;if(u.update_frame_variable("targetIndex",c),u.update_visual("meta_target",{type:"metadata",value:`target index = ${c}`}),u.record("calc_target",`Calculate target index = n - k = ${a} - ${i} = ${c}. The ${i}${1===i?"st":2===i?"nd":3===i?"rd":"th"} largest is at index ${c} in sorted order`),1===a)return u.update_visual("bar_0",{type:"arrayElement",value:l[0],position:0,label:t[0],state:"found"}),u.update_visual("meta_result",{type:"metadata",value:`Result: ${t[0]}`}),u.record("complete",`Array has only one element. Result: ${t[0]}`),u.popCallFrame(),u.getSteps();let d=function e(t,i,r,a,l,s,o){let u;if(s.pushCallFrame({left:r,right:a,target:l},"quickSelect"),s.update_visual("range_active",{type:"range",start:r,end:a,label:`search [${r}..${a}]`,state:"active"}),r===a){let e=o.indexOf(r);return s.update_visual(`bar_${e}`,{type:"arrayElement",value:i[r],position:r,label:t[r],state:"found"}),s.record("base_case",`Base case: single element at index ${r} = "${t[r]}"`),s.delete_visual("range_active"),s.popCallFrame(),t[r]}s.record("base_case",`Subarray [${r}..${a}] has ${a-r+1} elements`);let c=r+Math.floor((a-r)/2),d=t[c],p=i[c];s.update_frame_variable("pivotIdx",c),s.update_frame_variable("pivot",d);let m=o.indexOf(c);s.update_visual(`bar_${m}`,{type:"arrayElement",value:p,position:c,label:d,state:"pivot"}),s.update_visual("meta_pivot",{type:"metadata",value:`pivot = "${d}"`}),s.record("pick_pivot",`Pick pivot at index ${c}: "${d}"`);let h=r,g=a,f=r;for(s.update_frame_variable("lo",h),s.update_frame_variable("hi",g),s.update_frame_variable("mid",f),s.update_visual("ptr_lo",{type:"pointer",position:h,label:"lo"}),s.update_visual("ptr_mid",{type:"pointer",position:f,label:"mid"}),s.update_visual("ptr_hi",{type:"pointer",position:g,label:"hi"}),s.record("init_partition",`Initialize 3-way partition: lo=${h}, mid=${f}, hi=${g}`);f<=g;){var v;let e=(v=t[f],v.length!==d.length?v.length-d.length:v<d?-1:+(v>d)),l=o.indexOf(f);if(s.update_visual(`bar_${l}`,{type:"arrayElement",value:i[f],position:f,label:t[f],state:"active"}),s.add_conditional("compare_mid",e<0),s.record("compare_mid",`Compare nums[${f}] = "${t[f]}" with pivot "${d}": ${e<0?"less":e>0?"greater":"equal"}`),e<0){n(t,i,h,f,o,s);let e=o.indexOf(h);s.update_visual(`bar_${e}`,{type:"arrayElement",value:i[h],position:h,label:t[h],state:"less"}),s.record("swap_lo",`"${t[h]}" < pivot: swap positions ${h} and ${f}, advance lo and mid`),h++,f++,s.update_frame_variable("lo",h),s.update_frame_variable("mid",f),s.update_visual("ptr_lo",{type:"pointer",position:h,label:"lo"}),s.update_visual("ptr_mid",{type:"pointer",position:f,label:"mid"})}else if(e>0){n(t,i,f,g,o,s);let e=o.indexOf(g);s.update_visual(`bar_${e}`,{type:"arrayElement",value:i[g],position:g,label:t[g],state:"greater"}),s.record("swap_hi",`"${t[f]}" > pivot: swap positions ${f} and ${g}, decrement hi`),g--,s.update_frame_variable("hi",g),s.update_visual("ptr_hi",{type:"pointer",position:g,label:"hi"})}else{let e=o.indexOf(f);s.update_visual(`bar_${e}`,{type:"arrayElement",value:i[f],position:f,label:t[f],state:"equal"}),s.record("advance_mid",`"${t[f]}" == pivot: advance mid`),f++,s.update_frame_variable("mid",f),s.update_visual("ptr_mid",{type:"pointer",position:f,label:"mid"})}for(let e=r;e<h;e++){let r=o.indexOf(e);s.update_visual(`bar_${r}`,{type:"arrayElement",value:i[e],position:e,label:t[e],state:"less"})}for(let e=h;e<f;e++){let r=o.indexOf(e);s.update_visual(`bar_${r}`,{type:"arrayElement",value:i[e],position:e,label:t[e],state:"equal"})}for(let e=g+1;e<=a;e++){let r=o.indexOf(e);s.update_visual(`bar_${r}`,{type:"arrayElement",value:i[e],position:e,label:t[e],state:"greater"})}}h>r&&s.update_visual("range_less",{type:"range",start:r,end:h-1,label:"< pivot",state:"less"}),s.update_visual("range_equal",{type:"range",start:h,end:g,label:"= pivot",state:"equal"}),g<a&&s.update_visual("range_greater",{type:"range",start:g+1,end:a,label:"> pivot",state:"greater"}),s.add_conditional("check_target",l<h),s.record("check_target",`Partition done: less=[${r}..${h-1}], equal=[${h}..${g}], greater=[${g+1}..${a}]. Target=${l}`),s.delete_visual("range_less"),s.delete_visual("range_equal"),s.delete_visual("range_greater"),s.delete_visual("range_active"),s.delete_visual("ptr_lo"),s.delete_visual("ptr_mid"),s.delete_visual("ptr_hi"),s.delete_visual("meta_pivot");for(let e=r;e<=a;e++){let r=o.indexOf(e);s.update_visual(`bar_${r}`,{type:"arrayElement",value:i[e],position:e,label:t[e]})}if(l<h)s.record("recurse_left",`Target ${l} < lo ${h}: recurse on left partition [${r}..${h-1}]`),s.update_global_variable("nums",[...t]),u=e(t,i,r,h-1,l,s,o);else if(l>g)s.record("recurse_right",`Target ${l} > hi ${g}: recurse on right partition [${g+1}..${a}]`),s.update_global_variable("nums",[...t]),u=e(t,i,g+1,a,l,s,o);else{u=t[l];let e=o.indexOf(l);s.update_visual(`bar_${e}`,{type:"arrayElement",value:i[l],position:l,label:t[l],state:"found"}),s.record("found",`Target ${l} is in equal zone [${h}..${g}]. Found: "${u}"`)}return s.popCallFrame(),u}(t,l,0,a-1,c,u,o);for(let e=0;e<a;e++){let i=o.indexOf(e),r=e===c?"found":void 0;u.update_visual(`bar_${i}`,{type:"arrayElement",value:l[e],position:e,label:t[e],state:r})}return u.update_visual("meta_result",{type:"metadata",value:`Result: ${d}`}),u.update_global_variable("nums",[...t]),u.record("complete",`Quickselect complete! The ${i}${1===i?"st":2===i?"nd":3===i?"rd":"th"} largest integer is "${d}"`),u.popCallFrame(),u.getSteps()
}

export function FindTheKthLargestIntegerInTheArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheKthLargestIntegerInTheArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheKthLargestIntegerInTheArraySteps(e) as any[];
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
      title="Find the Kth Largest Integer in the Array"
      slug="find-the-kth-largest-integer-in-the-array"
      approaches={approaches}
      presets={FindTheKthLargestIntegerInTheArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Last Stone Weight (last-stone-weight)
// ==========================================

const LastStoneWeightTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def lastStoneWeight(self, stones: list[int]) -> int:\n        # Negate values to simulate max-heap with Python's min-heap\n        heap = [-s for s in stones]\n        heapq.heapify(heap)\n\n        while len(heap) > 1:\n            y = -heapq.heappop(heap)\n            x = -heapq.heappop(heap)\n            if y != x:\n                heapq.heappush(heap, -(y - x))\n\n        return -heap[0] if heap else 0",
    "lineMap": {
      "init": [
        4
      ],
      "build_heap": [
        5
      ],
      "extract_y": [
        8
      ],
      "extract_x": [
        9
      ],
      "stones_equal": [
        10
      ],
      "push_diff": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_equal": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int lastStoneWeight(int[] stones) {\n        // Max-heap using reverse comparator\n        PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());\n        for (int s : stones) {\n            heap.offer(s);\n        }\n\n        while (heap.size() > 1) {\n            int y = heap.poll();\n            int x = heap.poll();\n            if (y != x) {\n                heap.offer(y - x);\n            }\n        }\n\n        return heap.isEmpty() ? 0 : heap.peek();\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "build_heap": [
        5,
        6
      ],
      "extract_y": [
        10
      ],
      "extract_x": [
        11
      ],
      "stones_equal": [
        12
      ],
      "push_diff": [
        13
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_equal": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int LastStoneWeight(int[] stones) {\n        // C# PriorityQueue is a min-heap, so negate values\n        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();\n        foreach (int s in stones) {\n            heap.Enqueue(s, -s);\n        }\n\n        while (heap.Count > 1) {\n            int y = heap.Dequeue();\n            int x = heap.Dequeue();\n            if (y != x) {\n                int diff = y - x;\n                heap.Enqueue(diff, -diff);\n            }\n        }\n\n        return heap.Count == 0 ? 0 : heap.Peek();\n    }\n}",
    "lineMap": {
      "init": [
        4
      ],
      "build_heap": [
        5,
        6
      ],
      "extract_y": [
        10
      ],
      "extract_x": [
        11
      ],
      "stones_equal": [
        12
      ],
      "push_diff": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_equal": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int lastStoneWeight(vector<int>& stones) {\n        // Max-heap is the default for priority_queue in C++\n        priority_queue<int> heap(stones.begin(), stones.end());\n\n        while (heap.size() > 1) {\n            int y = heap.top(); heap.pop();\n            int x = heap.top(); heap.pop();\n            if (y != x) {\n                heap.push(y - x);\n            }\n        }\n\n        return heap.empty() ? 0 : heap.top();\n    }\n};",
    "lineMap": {
      "init": [
        5
      ],
      "build_heap": [
        5
      ],
      "extract_y": [
        8
      ],
      "extract_x": [
        9
      ],
      "stones_equal": [
        10
      ],
      "push_diff": [
        11
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_equal": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lastStoneWeight(stones []int) int {\n    h := &MaxHeap{}\n    heap.Init(h)\n    for _, s := range stones {\n        heap.Push(h, s)\n    }\n\n    for h.Len() > 1 {\n        y := heap.Pop(h).(int)\n        x := heap.Pop(h).(int)\n        if y != x {\n            heap.Push(h, y-x)\n        }\n    }\n\n    if h.Len() == 0 {\n        return 0\n    }\n    return heap.Pop(h).(int)\n}\n\ntype MaxHeap []int\n\nfunc (h MaxHeap) Len() int            { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool   { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "init": [
        2,
        3
      ],
      "build_heap": [
        4,
        5
      ],
      "extract_y": [
        9
      ],
      "extract_x": [
        10
      ],
      "stones_equal": [
        11
      ],
      "push_diff": [
        12
      ],
      "complete": [
        16,
        17,
        18,
        19
      ]
    },
    "conditionalMap": {
      "check_equal": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "// JS has no built-in heap, so use a binary max-heap on an array.\nclass MaxHeap {\n    constructor() { this.data = []; }\n    size() { return this.data.length; }\n    push(val) {\n        const d = this.data;\n        d.push(val);\n        let i = d.length - 1;\n        while (i > 0) {\n            const parent = (i - 1) >> 1;\n            if (d[parent] >= d[i]) break;\n            [d[parent], d[i]] = [d[i], d[parent]];\n            i = parent;\n        }\n    }\n    pop() {\n        const d = this.data;\n        const top = d[0];\n        const last = d.pop();\n        if (d.length > 0) {\n            d[0] = last;\n            let i = 0;\n            const n = d.length;\n            while (true) {\n                const l = 2 * i + 1, r = 2 * i + 2;\n                let largest = i;\n                if (l < n && d[l] > d[largest]) largest = l;\n                if (r < n && d[r] > d[largest]) largest = r;\n                if (largest === i) break;\n                [d[largest], d[i]] = [d[i], d[largest]];\n                i = largest;\n            }\n        }\n        return top;\n    }\n}\n\nvar lastStoneWeight = function(stones) {\n    const heap = new MaxHeap();\n    for (const s of stones) heap.push(s);\n\n    while (heap.size() > 1) {\n        const y = heap.pop();\n        const x = heap.pop();\n        if (y !== x) {\n            heap.push(y - x);\n        }\n    }\n\n    return heap.size() === 0 ? 0 : heap.pop();\n};",
    "lineMap": {
      "init": [
        39
      ],
      "build_heap": [
        40
      ],
      "extract_y": [
        43
      ],
      "extract_x": [
        44
      ],
      "stones_equal": [
        45
      ],
      "push_diff": [
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "check_equal": [
        45
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "// TS has no built-in heap, so use a binary max-heap on an array.\nclass MaxHeap {\n    private data: number[] = [];\n    size(): number { return this.data.length; }\n    push(val: number): void {\n        const d = this.data;\n        d.push(val);\n        let i = d.length - 1;\n        while (i > 0) {\n            const parent = (i - 1) >> 1;\n            if (d[parent] >= d[i]) break;\n            [d[parent], d[i]] = [d[i], d[parent]];\n            i = parent;\n        }\n    }\n    pop(): number {\n        const d = this.data;\n        const top = d[0];\n        const last = d.pop()!;\n        if (d.length > 0) {\n            d[0] = last;\n            let i = 0;\n            const n = d.length;\n            while (true) {\n                const l = 2 * i + 1, r = 2 * i + 2;\n                let largest = i;\n                if (l < n && d[l] > d[largest]) largest = l;\n                if (r < n && d[r] > d[largest]) largest = r;\n                if (largest === i) break;\n                [d[largest], d[i]] = [d[i], d[largest]];\n                i = largest;\n            }\n        }\n        return top;\n    }\n}\n\nfunction lastStoneWeight(stones: number[]): number {\n    const heap = new MaxHeap();\n    for (const s of stones) heap.push(s);\n\n    while (heap.size() > 1) {\n        const y = heap.pop();\n        const x = heap.pop();\n        if (y !== x) {\n            heap.push(y - x);\n        }\n    }\n\n    return heap.size() === 0 ? 0 : heap.pop();\n}",
    "lineMap": {
      "init": [
        39
      ],
      "build_heap": [
        40
      ],
      "extract_y": [
        43
      ],
      "extract_x": [
        44
      ],
      "stones_equal": [
        45
      ],
      "push_diff": [
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "check_equal": [
        45
      ]
    }
  }
};

const LastStoneWeightPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "stones": [
        2,
        7,
        4,
        1,
        8,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Single Stone",
    "value": {
      "stones": [
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Pairs Cancel",
    "value": {
      "stones": [
        3,
        3,
        6,
        6
      ]
    }
  }
];

function generateLastStoneWeightSteps(e: any): any[] {
  
let t=[...e.stones??[]],{scene:n,initial:a}=(0,i.createStoneScene)(t),{recorder:s}=n;s.record("init",`Start: stones = [${t.join(", ")}]`);let l=new i.StoneHeap;a.forEach(e=>l.push(e)),n.reseat(l.toArray(),i.ZONE.heap),s.update_variable("stonesLeft",l.size()),s.record("build_heap",l.size()>0?`Build a max-heap: the heaviest stone (${l.peek()[0]}) sits at the root`:"Build a max-heap: no stones to add");let r=0;for(;l.size()>1;){r++,s.update_variable("round",r);let[e,t]=l.pop();n.seat(t,i.ZONE.holdY,-1,e),n.reseat(l.toArray(),i.ZONE.heap),s.add_new_variable("y",e),s.update_variable("yKey",n.key(t)),s.update_variable("stonesLeft",l.size()+1),s.record("extract_y",`Extract the heaviest stone: y = ${e}`);let[a,o]=l.pop();if(n.seat(o,i.ZONE.holdX,-2,a),n.reseat(l.toArray(),i.ZONE.heap),s.add_new_variable("x",a),s.update_variable("xKey",n.key(o)),s.update_variable("stonesLeft",l.size()+2),s.record("extract_x",`Extract the next heaviest: x = ${a}`),n.drop(t),n.drop(o),e!==a){s.add_conditional("check_equal",!1);let t=e-a,r=n.nextId();l.push([t,r]),n.reseat(l.toArray(),i.ZONE.heap),s.update_variable("diff",t),s.update_variable("diffKey",n.key(r)),s.update_variable("stonesLeft",l.size()),s.record("push_diff",`y != x, push y - x = ${e} - ${a} = ${t} back`)}else s.add_conditional("check_equal",!0),s.update_variable("stonesLeft",l.size()),s.record("stones_equal",`y == x, both stones (${e}) destroyed`)}let o=0===l.size()?0:l.peek()[0];return s.delete_variable("y"),s.delete_variable("x"),s.add_new_variable("result",o),s.update_variable("stonesLeft",l.size()),n.reseat(l.toArray(),i.ZONE.heap),s.record("complete",o>0?`Done: last stone weight = ${o}`:"Done: all stones destroyed, return 0"),s.getSteps()
}

export function LastStoneWeightProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LastStoneWeightTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLastStoneWeightSteps(e) as any[];
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
      title="Last Stone Weight"
      slug="last-stone-weight"
      approaches={approaches}
      presets={LastStoneWeightPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// LFU Cache (lfu-cache)
// ==========================================

const LfuCacheTemplates = {
  "python": {
    "language": "python",
    "code": "class Node:\n    def __init__(self, key: int, value: int):\n        self.key = key\n        self.value = value\n        self.freq = 1\n        self.prev = None\n        self.next = None\n\nclass DLinkedList:\n    def __init__(self):\n        self.head = Node(0, 0)  # sentinel head\n        self.tail = Node(0, 0)  # sentinel tail\n        self.head.next = self.tail\n        self.tail.prev = self.head\n        self.size = 0\n\n    def add_to_tail(self, node: Node):\n        # Add to tail (most recently used position)\n        node.prev = self.tail.prev\n        node.next = self.tail\n        self.tail.prev.next = node\n        self.tail.prev = node\n        self.size += 1\n\n    def remove(self, node: Node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n        self.size -= 1\n\n    def remove_head(self) -> Node:\n        # Remove and return least recently used node\n        if self.size == 0:\n            return None\n        first = self.head.next\n        self.remove(first)\n        return first\n\n    def is_empty(self) -> bool:\n        return self.size == 0\n\nclass LFUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.min_freq = 0\n        self.key_to_node = {}\n        self.freq_to_list = {}\n\n    def get(self, key: int) -> int:\n        if key not in self.key_to_node:\n            return -1\n        node = self.key_to_node[key]\n        self._promote(node)\n        return node.value\n\n    def put(self, key: int, value: int) -> None:\n        if self.capacity == 0:\n            return\n        if key in self.key_to_node:\n            node = self.key_to_node[key]\n            node.value = value\n            self._promote(node)\n            return\n        # Evict if at capacity\n        if len(self.key_to_node) == self.capacity:\n            min_list = self.freq_to_list[self.min_freq]\n            evicted = min_list.remove_head()\n            del self.key_to_node[evicted.key]\n        # Insert new node\n        new_node = Node(key, value)\n        self.key_to_node[key] = new_node\n        if 1 not in self.freq_to_list:\n            self.freq_to_list[1] = DLinkedList()\n        self.freq_to_list[1].add_to_tail(new_node)\n        self.min_freq = 1\n\n    def _promote(self, node: Node):\n        old_freq = node.freq\n        old_list = self.freq_to_list[old_freq]\n        old_list.remove(node)\n        # If old list is now empty and was the min freq, bump min_freq\n        if old_list.is_empty() and self.min_freq == old_freq:\n            self.min_freq += 1\n        node.freq += 1\n        if node.freq not in self.freq_to_list:\n            self.freq_to_list[node.freq] = DLinkedList()\n        self.freq_to_list[node.freq].add_to_tail(node)",
    "lineMap": {
      "-": [
        43,
        44,
        45,
        46
      ],
      "get_start": [
        48
      ],
      "get_check": [
        49
      ],
      "get_miss": [
        50
      ],
      "get_done": [
        51,
        53
      ],
      "put_start": [
        55
      ],
      "put_exists": [
        58
      ],
      "put_update": [
        59,
        60,
        61
      ],
      "put_capacity": [
        64
      ],
      "put_evict": [
        65,
        66,
        67
      ],
      "put_create": [
        69,
        70
      ],
      "put_add_freq1": [
        71,
        72,
        73
      ],
      "put_set_minfreq": [
        74
      ],
      "put_zero": [
        56,
        57
      ],
      "put_done": [
        62
      ],
      "put_inserted": [
        74
      ],
      "promote_remove": [
        76,
        77,
        78,
        79
      ],
      "promote_minfreq": [
        81,
        82
      ],
      "promote_incr": [
        83
      ],
      "promote_add": [
        84,
        85,
        86
      ],
      "complete": [
        86
      ]
    },
    "conditionalMap": {
      "get_has": [
        49
      ],
      "put_has": [
        58
      ],
      "put_full": [
        64
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class LFUCache {\n    // Doubly linked list node\n    private class Node {\n        int key, value, freq;\n        Node prev, next;\n        Node(int key, int value) {\n            this.key = key;\n            this.value = value;\n            this.freq = 1;\n        }\n    }\n\n    // Doubly linked list with sentinel head/tail for O(1) add/remove\n    private class DLinkedList {\n        Node head, tail;\n        int size;\n        DLinkedList() {\n            head = new Node(0, 0);\n            tail = new Node(0, 0);\n            head.next = tail;\n            tail.prev = head;\n            size = 0;\n        }\n        // Add node to tail (most recently used position)\n        void addToTail(Node node) {\n            node.prev = tail.prev;\n            node.next = tail;\n            tail.prev.next = node;\n            tail.prev = node;\n            size++;\n        }\n        // Remove a specific node\n        void remove(Node node) {\n            node.prev.next = node.next;\n            node.next.prev = node.prev;\n            size--;\n        }\n        // Remove and return the head node (least recently used)\n        Node removeHead() {\n            if (size == 0) return null;\n            Node first = head.next;\n            remove(first);\n            return first;\n        }\n        boolean isEmpty() { return size == 0; }\n    }\n\n    int capacity, minFreq;\n    HashMap<Integer, Node> keyToNode;\n    HashMap<Integer, DLinkedList> freqToList;\n\n    public LFUCache(int capacity) {\n        this.capacity = capacity;\n        this.minFreq = 0;\n        this.keyToNode = new HashMap<>();\n        this.freqToList = new HashMap<>();\n    }\n\n    public int get(int key) {\n        if (!keyToNode.containsKey(key)) return -1;\n        Node node = keyToNode.get(key);\n        promoteNode(node);\n        return node.value;\n    }\n\n    public void put(int key, int value) {\n        if (capacity == 0) return;\n        if (keyToNode.containsKey(key)) {\n            Node node = keyToNode.get(key);\n            node.value = value;\n            promoteNode(node);\n            return;\n        }\n        // Evict if at capacity\n        if (keyToNode.size() == capacity) {\n            DLinkedList minList = freqToList.get(minFreq);\n            Node evicted = minList.removeHead();\n            keyToNode.remove(evicted.key);\n        }\n        // Insert new node\n        Node newNode = new Node(key, value);\n        keyToNode.put(key, newNode);\n        freqToList.computeIfAbsent(1, k -> new DLinkedList()).addToTail(newNode);\n        minFreq = 1;\n    }\n\n    // Move node from current freq list to freq+1 list\n    private void promoteNode(Node node) {\n        int oldFreq = node.freq;\n        DLinkedList oldList = freqToList.get(oldFreq);\n        oldList.remove(node);\n        // If old list is now empty and was the min freq, bump minFreq\n        if (oldList.isEmpty() && minFreq == oldFreq) {\n            minFreq++;\n        }\n        node.freq++;\n        freqToList.computeIfAbsent(node.freq, k -> new DLinkedList()).addToTail(node);\n    }\n}",
    "lineMap": {
      "-": [
        54,
        55,
        56
      ],
      "get_start": [
        59
      ],
      "get_check": [
        60
      ],
      "get_miss": [
        60
      ],
      "get_done": [
        61,
        63
      ],
      "put_start": [
        66
      ],
      "put_exists": [
        68
      ],
      "put_update": [
        69,
        70,
        71
      ],
      "put_capacity": [
        75
      ],
      "put_evict": [
        76,
        77,
        78
      ],
      "put_create": [
        81,
        82
      ],
      "put_add_freq1": [
        83
      ],
      "put_set_minfreq": [
        84
      ],
      "put_zero": [
        67
      ],
      "put_done": [
        72
      ],
      "put_inserted": [
        84
      ],
      "promote_remove": [
        88,
        89,
        90,
        91
      ],
      "promote_minfreq": [
        93,
        94
      ],
      "promote_incr": [
        96
      ],
      "promote_add": [
        97
      ],
      "complete": [
        98
      ]
    },
    "conditionalMap": {
      "get_has": [
        60
      ],
      "put_has": [
        68
      ],
      "put_full": [
        75
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class LFUCache {\n    struct Node {\n        int key, value, freq;\n        Node* prev;\n        Node* next;\n        Node(int k, int v) : key(k), value(v), freq(1), prev(nullptr), next(nullptr) {}\n    };\n\n    struct DLinkedList {\n        Node* head;\n        Node* tail;\n        int size;\n        DLinkedList() : size(0) {\n            head = new Node(0, 0);\n            tail = new Node(0, 0);\n            head->next = tail;\n            tail->prev = head;\n        }\n        void addToTail(Node* node) {\n            node->prev = tail->prev;\n            node->next = tail;\n            tail->prev->next = node;\n            tail->prev = node;\n            size++;\n        }\n        void remove(Node* node) {\n            node->prev->next = node->next;\n            node->next->prev = node->prev;\n            size--;\n        }\n        Node* removeHead() {\n            if (size == 0) return nullptr;\n            Node* first = head->next;\n            remove(first);\n            return first;\n        }\n        bool isEmpty() { return size == 0; }\n    };\n\n    int capacity, minFreq;\n    unordered_map<int, Node*> keyToNode;\n    unordered_map<int, DLinkedList*> freqToList;\n\n    void promote(Node* node) {\n        int oldFreq = node->freq;\n        DLinkedList* oldList = freqToList[oldFreq];\n        oldList->remove(node);\n        if (oldList->isEmpty() && minFreq == oldFreq) {\n            minFreq++;\n        }\n        node->freq++;\n        if (!freqToList.count(node->freq)) {\n            freqToList[node->freq] = new DLinkedList();\n        }\n        freqToList[node->freq]->addToTail(node);\n    }\n\npublic:\n    LFUCache(int capacity) : capacity(capacity), minFreq(0) {}\n\n    int get(int key) {\n        if (!keyToNode.count(key)) return -1;\n        Node* node = keyToNode[key];\n        promote(node);\n        return node->value;\n    }\n\n    void put(int key, int value) {\n        if (capacity == 0) return;\n        if (keyToNode.count(key)) {\n            Node* node = keyToNode[key];\n            node->value = value;\n            promote(node);\n            return;\n        }\n        // Evict if at capacity\n        if ((int)keyToNode.size() == capacity) {\n            DLinkedList* minList = freqToList[minFreq];\n            Node* evicted = minList->removeHead();\n            keyToNode.erase(evicted->key);\n            delete evicted;\n        }\n        // Insert new node\n        Node* newNode = new Node(key, value);\n        keyToNode[key] = newNode;\n        if (!freqToList.count(1)) {\n            freqToList[1] = new DLinkedList();\n        }\n        freqToList[1]->addToTail(newNode);\n        minFreq = 1;\n    }\n};",
    "lineMap": {
      "-": [
        59
      ],
      "get_start": [
        61
      ],
      "get_check": [
        62
      ],
      "get_miss": [
        62
      ],
      "get_done": [
        63,
        65
      ],
      "put_start": [
        68
      ],
      "put_exists": [
        70
      ],
      "put_update": [
        71,
        72,
        73
      ],
      "put_capacity": [
        77
      ],
      "put_evict": [
        78,
        79,
        80,
        81
      ],
      "put_create": [
        84,
        85
      ],
      "put_add_freq1": [
        86,
        87,
        89
      ],
      "put_set_minfreq": [
        90
      ],
      "put_zero": [
        69
      ],
      "put_done": [
        74
      ],
      "put_inserted": [
        90
      ],
      "promote_remove": [
        44,
        45,
        46,
        47
      ],
      "promote_minfreq": [
        48,
        49
      ],
      "promote_incr": [
        51
      ],
      "promote_add": [
        52,
        53,
        55
      ],
      "complete": [
        91
      ]
    },
    "conditionalMap": {
      "get_has": [
        62
      ],
      "put_has": [
        70
      ],
      "put_full": [
        77
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class LFUCache {\n    private class Node {\n        public int Key, Value, Freq;\n        public Node Prev, Next;\n        public Node(int key, int value) {\n            Key = key; Value = value; Freq = 1;\n        }\n    }\n\n    private class DLinkedList {\n        public Node Head, Tail;\n        public int Size;\n        public DLinkedList() {\n            Head = new Node(0, 0);\n            Tail = new Node(0, 0);\n            Head.Next = Tail;\n            Tail.Prev = Head;\n            Size = 0;\n        }\n        public void AddToTail(Node node) {\n            node.Prev = Tail.Prev;\n            node.Next = Tail;\n            Tail.Prev.Next = node;\n            Tail.Prev = node;\n            Size++;\n        }\n        public void Remove(Node node) {\n            node.Prev.Next = node.Next;\n            node.Next.Prev = node.Prev;\n            Size--;\n        }\n        public Node RemoveHead() {\n            if (Size == 0) return null;\n            Node first = Head.Next;\n            Remove(first);\n            return first;\n        }\n        public bool IsEmpty() => Size == 0;\n    }\n\n    int capacity, minFreq;\n    Dictionary<int, Node> keyToNode;\n    Dictionary<int, DLinkedList> freqToList;\n\n    public LFUCache(int capacity) {\n        this.capacity = capacity;\n        minFreq = 0;\n        keyToNode = new Dictionary<int, Node>();\n        freqToList = new Dictionary<int, DLinkedList>();\n    }\n\n    public int Get(int key) {\n        if (!keyToNode.ContainsKey(key)) return -1;\n        var node = keyToNode[key];\n        Promote(node);\n        return node.Value;\n    }\n\n    public void Put(int key, int value) {\n        if (capacity == 0) return;\n        if (keyToNode.ContainsKey(key)) {\n            var node = keyToNode[key];\n            node.Value = value;\n            Promote(node);\n            return;\n        }\n        if (keyToNode.Count == capacity) {\n            var minList = freqToList[minFreq];\n            var evicted = minList.RemoveHead();\n            keyToNode.Remove(evicted.Key);\n        }\n        var newNode = new Node(key, value);\n        keyToNode[key] = newNode;\n        if (!freqToList.ContainsKey(1))\n            freqToList[1] = new DLinkedList();\n        freqToList[1].AddToTail(newNode);\n        minFreq = 1;\n    }\n\n    private void Promote(Node node) {\n        int oldFreq = node.Freq;\n        var oldList = freqToList[oldFreq];\n        oldList.Remove(node);\n        if (oldList.IsEmpty() && minFreq == oldFreq) minFreq++;\n        node.Freq++;\n        if (!freqToList.ContainsKey(node.Freq))\n            freqToList[node.Freq] = new DLinkedList();\n        freqToList[node.Freq].AddToTail(node);\n    }\n}",
    "lineMap": {
      "-": [
        47,
        48,
        49
      ],
      "get_start": [
        52
      ],
      "get_check": [
        53
      ],
      "get_miss": [
        53
      ],
      "get_done": [
        54,
        56
      ],
      "put_start": [
        59
      ],
      "put_exists": [
        61
      ],
      "put_update": [
        62,
        63,
        64
      ],
      "put_capacity": [
        67
      ],
      "put_evict": [
        68,
        69,
        70
      ],
      "put_create": [
        72,
        73
      ],
      "put_add_freq1": [
        74,
        75,
        76
      ],
      "put_set_minfreq": [
        77
      ],
      "put_zero": [
        60
      ],
      "put_done": [
        65
      ],
      "put_inserted": [
        77
      ],
      "promote_remove": [
        80,
        81,
        82,
        83
      ],
      "promote_minfreq": [
        84
      ],
      "promote_incr": [
        85
      ],
      "promote_add": [
        86,
        87,
        88
      ],
      "complete": [
        89
      ]
    },
    "conditionalMap": {
      "get_has": [
        53
      ],
      "put_has": [
        61
      ],
      "put_full": [
        67
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Node struct {\n    key, value, freq int\n    prev, next       *Node\n}\n\ntype DLinkedList struct {\n    head, tail *Node\n    size       int\n}\n\nfunc newDLinkedList() *DLinkedList {\n    head := &Node{}\n    tail := &Node{}\n    head.next = tail\n    tail.prev = head\n    return &DLinkedList{head: head, tail: tail}\n}\n\nfunc (dl *DLinkedList) addToTail(node *Node) {\n    node.prev = dl.tail.prev\n    node.next = dl.tail\n    dl.tail.prev.next = node\n    dl.tail.prev = node\n    dl.size++\n}\n\nfunc (dl *DLinkedList) remove(node *Node) {\n    node.prev.next = node.next\n    node.next.prev = node.prev\n    dl.size--\n}\n\nfunc (dl *DLinkedList) removeHead() *Node {\n    if dl.size == 0 {\n        return nil\n    }\n    first := dl.head.next\n    dl.remove(first)\n    return first\n}\n\nfunc (dl *DLinkedList) isEmpty() bool { return dl.size == 0 }\n\ntype LFUCache struct {\n    capacity, minFreq int\n    keyToNode         map[int]*Node\n    freqToList        map[int]*DLinkedList\n}\n\nfunc Constructor(capacity int) LFUCache {\n    return LFUCache{\n        capacity:   capacity,\n        keyToNode:  make(map[int]*Node),\n        freqToList: make(map[int]*DLinkedList),\n    }\n}\n\nfunc (c *LFUCache) promote(node *Node) {\n    oldFreq := node.freq\n    oldList := c.freqToList[oldFreq]\n    oldList.remove(node)\n    if oldList.isEmpty() && c.minFreq == oldFreq {\n        c.minFreq++\n    }\n    node.freq++\n    if _, ok := c.freqToList[node.freq]; !ok {\n        c.freqToList[node.freq] = newDLinkedList()\n    }\n    c.freqToList[node.freq].addToTail(node)\n}\n\nfunc (c *LFUCache) Get(key int) int {\n    node, ok := c.keyToNode[key]\n    if !ok {\n        return -1\n    }\n    c.promote(node)\n    return node.value\n}\n\nfunc (c *LFUCache) Put(key int, value int) {\n    if c.capacity == 0 {\n        return\n    }\n    if node, ok := c.keyToNode[key]; ok {\n        node.value = value\n        c.promote(node)\n        return\n    }\n    // Evict if at capacity\n    if len(c.keyToNode) == c.capacity {\n        minList := c.freqToList[c.minFreq]\n        evicted := minList.removeHead()\n        delete(c.keyToNode, evicted.key)\n    }\n    // Insert new node\n    newNode := &Node{key: key, value: value, freq: 1}\n    c.keyToNode[key] = newNode\n    if _, ok := c.freqToList[1]; !ok {\n        c.freqToList[1] = newDLinkedList()\n    }\n    c.freqToList[1].addToTail(newNode)\n    c.minFreq = 1\n}",
    "lineMap": {
      "-": [
        53,
        54
      ],
      "get_start": [
        72
      ],
      "get_check": [
        74
      ],
      "get_miss": [
        75
      ],
      "get_done": [
        77,
        78
      ],
      "put_start": [
        81
      ],
      "put_exists": [
        85
      ],
      "put_update": [
        86,
        87
      ],
      "put_capacity": [
        91
      ],
      "put_evict": [
        92,
        93,
        94
      ],
      "put_create": [
        97,
        98
      ],
      "put_add_freq1": [
        99,
        100,
        102
      ],
      "put_set_minfreq": [
        103
      ],
      "put_zero": [
        82,
        83
      ],
      "put_done": [
        88
      ],
      "put_inserted": [
        103
      ],
      "promote_remove": [
        58,
        59,
        60,
        61
      ],
      "promote_minfreq": [
        62,
        63
      ],
      "promote_incr": [
        65
      ],
      "promote_add": [
        66,
        67,
        69
      ],
      "complete": [
        104
      ]
    },
    "conditionalMap": {
      "get_has": [
        74
      ],
      "put_has": [
        85
      ],
      "put_full": [
        91
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var LFUCache = function(capacity) {\n    this.capacity = capacity;\n    this.minFreq = 0;\n    this.keyToNode = new Map();\n    this.freqToList = new Map();\n};\n\n// Node constructor\nfunction Node(key, value) {\n    this.key = key;\n    this.value = value;\n    this.freq = 1;\n    this.prev = null;\n    this.next = null;\n}\n\n// Doubly linked list with sentinel nodes\nfunction DLinkedList() {\n    this.head = new Node(0, 0);\n    this.tail = new Node(0, 0);\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n    this.size = 0;\n}\n\nDLinkedList.prototype.addToTail = function(node) {\n    node.prev = this.tail.prev;\n    node.next = this.tail;\n    this.tail.prev.next = node;\n    this.tail.prev = node;\n    this.size++;\n};\n\nDLinkedList.prototype.remove = function(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n    this.size--;\n};\n\nDLinkedList.prototype.removeHead = function() {\n    if (this.size === 0) return null;\n    const first = this.head.next;\n    this.remove(first);\n    return first;\n};\n\nDLinkedList.prototype.isEmpty = function() {\n    return this.size === 0;\n};\n\nLFUCache.prototype._promote = function(node) {\n    const oldFreq = node.freq;\n    const oldList = this.freqToList.get(oldFreq);\n    oldList.remove(node);\n    if (oldList.isEmpty() && this.minFreq === oldFreq) {\n        this.minFreq++;\n    }\n    node.freq++;\n    if (!this.freqToList.has(node.freq)) {\n        this.freqToList.set(node.freq, new DLinkedList());\n    }\n    this.freqToList.get(node.freq).addToTail(node);\n};\n\nLFUCache.prototype.get = function(key) {\n    if (!this.keyToNode.has(key)) return -1;\n    const node = this.keyToNode.get(key);\n    this._promote(node);\n    return node.value;\n};\n\nLFUCache.prototype.put = function(key, value) {\n    if (this.capacity === 0) return;\n    if (this.keyToNode.has(key)) {\n        const node = this.keyToNode.get(key);\n        node.value = value;\n        this._promote(node);\n        return;\n    }\n    // Evict if at capacity\n    if (this.keyToNode.size === this.capacity) {\n        const minList = this.freqToList.get(this.minFreq);\n        const evicted = minList.removeHead();\n        this.keyToNode.delete(evicted.key);\n    }\n    // Insert new node\n    const newNode = new Node(key, value);\n    this.keyToNode.set(key, newNode);\n    if (!this.freqToList.has(1)) {\n        this.freqToList.set(1, new DLinkedList());\n    }\n    this.freqToList.get(1).addToTail(newNode);\n    this.minFreq = 1;\n};",
    "lineMap": {
      "-": [
        3,
        4,
        5
      ],
      "get_start": [
        65
      ],
      "get_check": [
        66
      ],
      "get_miss": [
        66
      ],
      "get_done": [
        67,
        69
      ],
      "put_start": [
        72
      ],
      "put_exists": [
        74
      ],
      "put_update": [
        75,
        76,
        77
      ],
      "put_capacity": [
        81
      ],
      "put_evict": [
        82,
        83,
        84
      ],
      "put_create": [
        87,
        88
      ],
      "put_add_freq1": [
        89,
        90,
        92
      ],
      "put_set_minfreq": [
        93
      ],
      "put_zero": [
        73
      ],
      "put_done": [
        78
      ],
      "put_inserted": [
        93
      ],
      "promote_remove": [
        51,
        52,
        53,
        54
      ],
      "promote_minfreq": [
        55,
        56
      ],
      "promote_incr": [
        58
      ],
      "promote_add": [
        59,
        60,
        62
      ],
      "complete": [
        93
      ]
    },
    "conditionalMap": {
      "get_has": [
        66
      ],
      "put_has": [
        74
      ],
      "put_full": [
        81
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class DLLNode {\n    key: number;\n    value: number;\n    freq: number;\n    prev: DLLNode | null;\n    next: DLLNode | null;\n    constructor(key: number, value: number) {\n        this.key = key;\n        this.value = value;\n        this.freq = 1;\n        this.prev = null;\n        this.next = null;\n    }\n}\n\nclass DoublyLinkedList {\n    head: DLLNode;\n    tail: DLLNode;\n    size: number;\n    constructor() {\n        this.head = new DLLNode(0, 0);\n        this.tail = new DLLNode(0, 0);\n        this.head.next = this.tail;\n        this.tail.prev = this.head;\n        this.size = 0;\n    }\n    addToTail(node: DLLNode): void {\n        node.prev = this.tail.prev;\n        node.next = this.tail;\n        this.tail.prev!.next = node;\n        this.tail.prev = node;\n        this.size++;\n    }\n    remove(node: DLLNode): void {\n        node.prev!.next = node.next;\n        node.next!.prev = node.prev;\n        this.size--;\n    }\n    removeHead(): DLLNode | null {\n        if (this.size === 0) return null;\n        const first = this.head.next!;\n        this.remove(first);\n        return first;\n    }\n    isEmpty(): boolean { return this.size === 0; }\n}\n\nclass LFUCache {\n    private capacity: number;\n    private minFreq: number;\n    private keyToNode: Map<number, DLLNode>;\n    private freqToList: Map<number, DoublyLinkedList>;\n\n    constructor(capacity: number) {\n        this.capacity = capacity;\n        this.minFreq = 0;\n        this.keyToNode = new Map();\n        this.freqToList = new Map();\n    }\n\n    private promote(node: DLLNode): void {\n        const oldFreq = node.freq;\n        const oldList = this.freqToList.get(oldFreq)!;\n        oldList.remove(node);\n        if (oldList.isEmpty() && this.minFreq === oldFreq) {\n            this.minFreq++;\n        }\n        node.freq++;\n        if (!this.freqToList.has(node.freq)) {\n            this.freqToList.set(node.freq, new DoublyLinkedList());\n        }\n        this.freqToList.get(node.freq)!.addToTail(node);\n    }\n\n    get(key: number): number {\n        if (!this.keyToNode.has(key)) return -1;\n        const node = this.keyToNode.get(key)!;\n        this.promote(node);\n        return node.value;\n    }\n\n    put(key: number, value: number): void {\n        if (this.capacity === 0) return;\n        if (this.keyToNode.has(key)) {\n            const node = this.keyToNode.get(key)!;\n            node.value = value;\n            this.promote(node);\n            return;\n        }\n        // Evict if at capacity\n        if (this.keyToNode.size === this.capacity) {\n            const minList = this.freqToList.get(this.minFreq)!;\n            const evicted = minList.removeHead()!;\n            this.keyToNode.delete(evicted.key);\n        }\n        // Insert new node\n        const newNode = new DLLNode(key, value);\n        this.keyToNode.set(key, newNode);\n        if (!this.freqToList.has(1)) {\n            this.freqToList.set(1, new DoublyLinkedList());\n        }\n        this.freqToList.get(1)!.addToTail(newNode);\n        this.minFreq = 1;\n    }\n}",
    "lineMap": {
      "-": [
        56,
        57,
        58
      ],
      "get_start": [
        75
      ],
      "get_check": [
        76
      ],
      "get_miss": [
        76
      ],
      "get_done": [
        77,
        79
      ],
      "put_start": [
        82
      ],
      "put_exists": [
        84
      ],
      "put_update": [
        85,
        86,
        87
      ],
      "put_capacity": [
        91
      ],
      "put_evict": [
        92,
        93,
        94
      ],
      "put_create": [
        97,
        98
      ],
      "put_add_freq1": [
        99,
        100,
        102
      ],
      "put_set_minfreq": [
        103
      ],
      "put_zero": [
        83
      ],
      "put_done": [
        88
      ],
      "put_inserted": [
        103
      ],
      "promote_remove": [
        61,
        62,
        63,
        64
      ],
      "promote_minfreq": [
        65,
        66
      ],
      "promote_incr": [
        68
      ],
      "promote_add": [
        69,
        70,
        72
      ],
      "complete": [
        104
      ]
    },
    "conditionalMap": {
      "get_has": [
        76
      ],
      "put_has": [
        84
      ],
      "put_full": [
        91
      ]
    }
  }
};

const LfuCachePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "LFUCache",
        "put",
        "put",
        "get",
        "put",
        "get",
        "get",
        "put",
        "get",
        "get",
        "get"
      ],
      "values": [
        2,
        [
          1,
          1
        ],
        [
          2,
          2
        ],
        [
          1
        ],
        [
          3,
          3
        ],
        [
          2
        ],
        [
          3
        ],
        [
          4,
          4
        ],
        [
          1
        ],
        [
          3
        ],
        [
          4
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Eviction",
    "value": {
      "operations": [
        "LFUCache",
        "put",
        "put",
        "put",
        "get",
        "get",
        "put",
        "get"
      ],
      "values": [
        2,
        [
          1,
          10
        ],
        [
          2,
          20
        ],
        [
          3,
          30
        ],
        [
          1
        ],
        [
          2
        ],
        [
          4,
          40
        ],
        [
          1
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Capacity 1",
    "value": {
      "operations": [
        "LFUCache",
        "put",
        "get",
        "put",
        "get",
        "get"
      ],
      "values": [
        1,
        [
          1,
          1
        ],
        [
          1
        ],
        [
          2,
          2
        ],
        [
          1
        ],
        [
          2
        ]
      ]
    }
  }
];

function generateLfuCacheSteps(e: any): any[] {
  
let t=e.operations||[],i=e.values||[],n=0,r=[];for(let e=0;e<t.length;e++){let a=t[e],s=i[e];"LFUCache"===a?n=Array.isArray(s)?s[0]:s??0:"get"===a?r.push({kind:"get",key:Array.isArray(s)?s[0]:s}):"put"===a&&r.push({kind:"put",key:s[0],val:s[1]})}let s=new Map,l=new Map,o=new Map,p=0,d=e=>{let t=l.get(e),i=o.get(t);i.splice(i.indexOf(e),1),0===i.length&&p===t&&(p=t+1),l.set(e,t+1),o.has(t+1)||o.set(t+1,[]),o.get(t+1).push(e)},c=r.map(e=>{if("get"===e.kind)return s.has(e.key)?(d(e.key),String(s.get(e.key))):"-1";if(0===n)return null;if(s.has(e.key))return s.set(e.key,e.val),d(e.key),null;if(s.size===n){let e=o.get(p).shift();s.delete(e),l.delete(e)}return s.set(e.key,e.val),l.set(e.key,1),o.has(1)||o.set(1,[]),o.get(1).push(e.key),p=1,null}),u=new Map,h=new Map,f=new Map,m=0,y=r.map(e=>"get"===e.kind?`get(${e.key})`:`put(${e.key}, ${e.val})`),_=new StepRecorder({ops:y,opResults:c,opIdx:-1,capacity:n,minFreq:0,size:0,maxFreq:1},{}),v=["kind","key","val","exists","freq","newFreq","atCapacity","evictKey","evictVal","result"],k=()=>{for(let e of v)_.delete_variable(e)},g=()=>{let e;_.update_variable("minFreq",m),_.update_variable("size",u.size),_.update_variable("maxFreq",(e=1,h.forEach(t=>{t>e&&(e=t)}),e))},x=()=>{f.forEach((e,t)=>{e.forEach((e,i)=>{_.update_visual(`node_${e}`,{type:"matrixElement",value:u.get(e),label:String(e),row:i,col:t})})})},q=e=>{let t=h.get(e),i=f.get(t);_.record("promote_remove",`Remove ${e} from the freq ${t} bucket`),i.splice(i.indexOf(e),1),x(),0===i.length&&m===t&&(m=t+1,_.update_variable("newMinFreq",m),g(),_.record("promote_minfreq",`The freq ${t} bucket is now empty and was the min, so minFreq = ${m}`),_.delete_variable("newMinFreq")),_.update_variable("newFreq",t+1),_.record("promote_incr",`Bump ${e}'s frequency: ${t} → ${t+1}`),h.set(e,t+1),f.has(t+1)||f.set(t+1,[]),f.get(t+1).push(e),g(),x(),_.record("promote_add",`Append ${e} to the tail of the freq ${t+1} bucket (most recently used)`)};g(),_.record("-",`LFU Cache (capacity ${n}): frequency buckets + a minFreq pointer for O(1) eviction of the least-frequently, least-recently used key.`);for(let e=0;e<r.length;e++){let t=r[e];if(k(),_.update_variable("opIdx",e),_.update_variable("kind",t.kind),_.update_variable("key",t.key),void 0!==t.val&&_.update_variable("val",t.val),g(),x(),"get"===t.kind){_.record("get_start",`Operation: get(${t.key})`);let e=u.has(t.key);_.add_conditional("get_has",e),_.update_variable("exists",e),_.record("get_check",`Is ${t.key} in the cache? ${e?"yes":"no"}`),e?(_.update_variable("freq",h.get(t.key)),q(t.key),_.update_variable("result",String(u.get(t.key))),_.record("get_done",`Return ${t.key}'s value ${u.get(t.key)}`)):(_.update_variable("result","-1"),_.record("get_miss",`${t.key} is not cached, return -1`))}else{let{key:e,val:i}=t;if(_.record("put_start",`Operation: put(${e}, ${i})`),0===n){_.record("put_zero","Capacity is 0, nothing to store");continue}let a=u.has(e);if(_.add_conditional("put_has",a),_.update_variable("exists",a),_.record("put_exists",`Is ${e} already in the cache? ${a?"yes":"no"}`),a)u.set(e,i),_.update_variable("freq",h.get(e)),x(),_.record("put_update",`Update ${e}'s value to ${i}`),q(e),_.record("put_done",`put(${e}, ${i}) done (updated)`);else{let t=u.size>=n;if(_.add_conditional("put_full",t),_.update_variable("atCapacity",t),_.record("put_capacity",`Cache size ${u.size} ${t?"=":"<"} capacity ${n}${t?", must evict":", room to spare"}`),t){let e=f.get(m)||[],t=e[0];void 0!==t&&(_.update_variable("evictKey",t),_.update_variable("evictVal",u.get(t)),_.record("put_evict",`Evict the LRU key of the minFreq (${m}) bucket: key ${t}`),e.shift(),u.delete(t),h.delete(t),_.delete_visual(`node_${t}`),g(),x())}u.set(e,i),h.set(e,1),_.update_variable("freq",1),g(),x(),_.record("put_create",`Create node key=${e}, value=${i}, freq=1`),f.has(1)||f.set(1,[]),f.get(1).push(e),x(),_.record("put_add_freq1",`Add ${e} to the freq 1 bucket`),m=1,g(),_.record("put_set_minfreq","A brand-new key has freq 1, so minFreq = 1"),_.record("put_inserted",`put(${e}, ${i}) done (inserted)`)}}}return k(),_.update_variable("opIdx",r.length),g(),x(),_.record("complete","All operations complete"),_.getSteps()
}

export function LfuCacheProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LfuCacheTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLfuCacheSteps(e) as any[];
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
      title="LFU Cache"
      slug="lfu-cache"
      approaches={approaches}
      presets={LfuCachePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Performance of a Team (maximum-performance-of-a-team)
// ==========================================

const MaximumPerformanceOfATeamTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxPerformance(self, n: int, speed: list[int], efficiency: list[int], k: int) -> int:\n        MOD = 10**9 + 7\n\n        # Pair engineers and sort by efficiency descending\n        engineers = sorted(zip(efficiency, speed), reverse=True)\n\n        heap = []\n        speed_sum = 0\n        max_perf = 0\n\n        for curr_eff, curr_speed in engineers:\n            # Add current engineer's speed\n            heapq.heappush(heap, curr_speed)\n            speed_sum += curr_speed\n\n            # If team exceeds k, remove the slowest engineer\n            if len(heap) > k:\n                speed_sum -= heapq.heappop(heap)\n\n            # Current engineer has the minimum efficiency in the team\n            max_perf = max(max_perf, speed_sum * curr_eff)\n\n        return max_perf % MOD",
    "lineMap": {
      "sort_engineers": [
        6
      ],
      "init": [
        8,
        9,
        10
      ],
      "next_engineer": [
        12
      ],
      "add_speed": [
        14,
        15
      ],
      "check_team_size": [
        18
      ],
      "remove_slowest": [
        19
      ],
      "compute_performance": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "over_k": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxPerformance(int n, int[] speed, int[] efficiency, int k) {\n        int MOD = 1000000007;\n\n        // Pair engineers and sort by efficiency descending\n        int[][] engineers = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            engineers[i][0] = efficiency[i];\n            engineers[i][1] = speed[i];\n        }\n        Arrays.sort(engineers, (a, b) -> b[0] - a[0]);\n\n        // Min-heap to track the k largest speeds\n        PriorityQueue<Integer> heap = new PriorityQueue<>();\n        long speedSum = 0;\n        long maxPerf = 0;\n\n        for (int[] eng : engineers) {\n            int currEff = eng[0];\n            int currSpeed = eng[1];\n\n            // Add current engineer's speed\n            heap.offer(currSpeed);\n            speedSum += currSpeed;\n\n            // If team exceeds k, remove the slowest engineer\n            if (heap.size() > k) {\n                speedSum -= heap.poll();\n            }\n\n            // Current engineer has the minimum efficiency in the team\n            long perf = speedSum * currEff;\n            maxPerf = Math.max(maxPerf, perf);\n        }\n\n        return (int)(maxPerf % MOD);\n    }\n}",
    "lineMap": {
      "sort_engineers": [
        6,
        8,
        9,
        11
      ],
      "init": [
        14,
        15,
        16
      ],
      "next_engineer": [
        18,
        19,
        20
      ],
      "add_speed": [
        23,
        24
      ],
      "check_team_size": [
        27
      ],
      "remove_slowest": [
        28
      ],
      "compute_performance": [
        32,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "over_k": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxPerformance(int n, int[] speed, int[] efficiency, int k) {\n        int MOD = 1000000007;\n\n        // Pair engineers and sort by efficiency descending\n        int[][] engineers = new int[n][];\n        for (int i = 0; i < n; i++) {\n            engineers[i] = new int[] { efficiency[i], speed[i] };\n        }\n        Array.Sort(engineers, (a, b) => b[0] - a[0]);\n\n        // Min-heap to track the k largest speeds\n        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();\n        long speedSum = 0;\n        long maxPerf = 0;\n\n        foreach (var eng in engineers) {\n            int currEff = eng[0];\n            int currSpeed = eng[1];\n\n            // Add current engineer's speed\n            heap.Enqueue(currSpeed, currSpeed);\n            speedSum += currSpeed;\n\n            // If team exceeds k, remove the slowest engineer\n            if (heap.Count > k) {\n                speedSum -= heap.Dequeue();\n            }\n\n            // Current engineer has the minimum efficiency in the team\n            long perf = speedSum * (long)currEff;\n            maxPerf = Math.Max(maxPerf, perf);\n        }\n\n        return (int)(maxPerf % MOD);\n    }\n}",
    "lineMap": {
      "sort_engineers": [
        6,
        8,
        10
      ],
      "init": [
        13,
        14,
        15
      ],
      "next_engineer": [
        17,
        18,
        19
      ],
      "add_speed": [
        22,
        23
      ],
      "check_team_size": [
        26
      ],
      "remove_slowest": [
        27
      ],
      "compute_performance": [
        31,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "over_k": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxPerformance(int n, vector<int>& speed, vector<int>& efficiency, int k) {\n        int MOD = 1000000007;\n\n        // Pair engineers and sort by efficiency descending\n        vector<pair<int, int>> engineers(n);\n        for (int i = 0; i < n; i++) {\n            engineers[i] = {efficiency[i], speed[i]};\n        }\n        sort(engineers.begin(), engineers.end(), greater<pair<int, int>>());\n\n        // Min-heap to track the k largest speeds\n        priority_queue<int, vector<int>, greater<int>> heap;\n        long long speedSum = 0;\n        long long maxPerf = 0;\n\n        for (auto& [currEff, currSpeed] : engineers) {\n            // Add current engineer's speed\n            heap.push(currSpeed);\n            speedSum += currSpeed;\n\n            // If team exceeds k, remove the slowest engineer\n            if ((int)heap.size() > k) {\n                speedSum -= heap.top();\n                heap.pop();\n            }\n\n            // Current engineer has the minimum efficiency in the team\n            long long perf = speedSum * currEff;\n            maxPerf = max(maxPerf, perf);\n        }\n\n        return (int)(maxPerf % MOD);\n    }\n};",
    "lineMap": {
      "sort_engineers": [
        7,
        9,
        11
      ],
      "init": [
        14,
        15,
        16
      ],
      "next_engineer": [
        18
      ],
      "add_speed": [
        20,
        21
      ],
      "check_team_size": [
        24
      ],
      "remove_slowest": [
        25,
        26
      ],
      "compute_performance": [
        30,
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "over_k": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxPerformance(n int, speed []int, efficiency []int, k int) int {\n    MOD := 1000000007\n\n    // Pair engineers and sort by efficiency descending\n    type engineer struct {\n        eff, spd int\n    }\n    engineers := make([]engineer, n)\n    for i := 0; i < n; i++ {\n        engineers[i] = engineer{efficiency[i], speed[i]}\n    }\n    sort.Slice(engineers, func(i, j int) bool {\n        return engineers[i].eff > engineers[j].eff\n    })\n\n    // Min-heap to track the k largest speeds\n    h := &minHeap{}\n    heap.Init(h)\n    speedSum := int64(0)\n    maxPerf := int64(0)\n\n    for _, eng := range engineers {\n        // Add current engineer's speed\n        heap.Push(h, eng.spd)\n        speedSum += int64(eng.spd)\n\n        // If team exceeds k, remove the slowest engineer\n        if h.Len() > k {\n            speedSum -= int64(heap.Pop(h).(int))\n        }\n\n        // Current engineer has the minimum efficiency in the team\n        perf := speedSum * int64(eng.eff)\n        if perf > maxPerf {\n            maxPerf = perf\n        }\n    }\n\n    return int(maxPerf % int64(MOD))\n}\n\ntype minHeap []int\nfunc (h minHeap) Len() int            { return len(h) }\nfunc (h minHeap) Less(i, j int) bool   { return h[i] < h[j] }\nfunc (h minHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *minHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *minHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "sort_engineers": [
        8,
        10,
        12
      ],
      "init": [
        17,
        18,
        19,
        20
      ],
      "next_engineer": [
        22
      ],
      "add_speed": [
        24,
        25
      ],
      "check_team_size": [
        28
      ],
      "remove_slowest": [
        29
      ],
      "compute_performance": [
        33,
        34,
        35
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "over_k": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxPerformance = function(n, speed, efficiency, k) {\n    const MOD = 1000000007n;\n\n    // Pair engineers and sort by efficiency descending\n    const engineers = [];\n    for (let i = 0; i < n; i++) {\n        engineers.push([efficiency[i], speed[i]]);\n    }\n    engineers.sort((a, b) => b[0] - a[0]);\n\n    // Min-heap to track the k largest speeds\n    const heap = new MinHeap();\n    let speedSum = 0n;\n    let maxPerf = 0n;\n\n    for (const [currEff, currSpeed] of engineers) {\n        // Add current engineer's speed\n        heap.push(currSpeed);\n        speedSum += BigInt(currSpeed);\n\n        // If team exceeds k, remove the slowest engineer\n        if (heap.size() > k) {\n            speedSum -= BigInt(heap.pop());\n        }\n\n        // Current engineer has the minimum efficiency in the team\n        const perf = speedSum * BigInt(currEff);\n        if (perf > maxPerf) maxPerf = perf;\n    }\n\n    return Number(maxPerf % MOD);\n};\n\nclass MinHeap {\n    constructor() { this.data = []; }\n    size() { return this.data.length; }\n    push(val) {\n        this.data.push(val);\n        let i = this.data.length - 1;\n        while (i > 0) {\n            const parent = (i - 1) >> 1;\n            if (this.data[parent] <= this.data[i]) break;\n            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];\n            i = parent;\n        }\n    }\n    pop() {\n        const top = this.data[0];\n        const last = this.data.pop();\n        if (this.data.length > 0) {\n            this.data[0] = last;\n            let i = 0;\n            while (true) {\n                let smallest = i;\n                const left = 2 * i + 1, right = 2 * i + 2;\n                if (left < this.data.length && this.data[left] < this.data[smallest]) smallest = left;\n                if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;\n                if (smallest === i) break;\n                [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];\n                i = smallest;\n            }\n        }\n        return top;\n    }\n}",
    "lineMap": {
      "sort_engineers": [
        5,
        7,
        9
      ],
      "init": [
        12,
        13,
        14
      ],
      "next_engineer": [
        16
      ],
      "add_speed": [
        18,
        19
      ],
      "check_team_size": [
        22
      ],
      "remove_slowest": [
        23
      ],
      "compute_performance": [
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "over_k": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxPerformance(n: number, speed: number[], efficiency: number[], k: number): number {\n    const MOD = 1000000007n;\n\n    // Pair engineers and sort by efficiency descending\n    const engineers: [number, number][] = [];\n    for (let i = 0; i < n; i++) {\n        engineers.push([efficiency[i], speed[i]]);\n    }\n    engineers.sort((a, b) => b[0] - a[0]);\n\n    // Min-heap to track the k largest speeds\n    const heap = new MinHeap();\n    let speedSum = 0n;\n    let maxPerf = 0n;\n\n    for (const [currEff, currSpeed] of engineers) {\n        // Add current engineer's speed\n        heap.push(currSpeed);\n        speedSum += BigInt(currSpeed);\n\n        // If team exceeds k, remove the slowest engineer\n        if (heap.size() > k) {\n            speedSum -= BigInt(heap.pop());\n        }\n\n        // Current engineer has the minimum efficiency in the team\n        const perf = speedSum * BigInt(currEff);\n        if (perf > maxPerf) maxPerf = perf;\n    }\n\n    return Number(maxPerf % MOD);\n}\n\nclass MinHeap {\n    private data: number[] = [];\n    size(): number { return this.data.length; }\n    push(val: number): void {\n        this.data.push(val);\n        let i = this.data.length - 1;\n        while (i > 0) {\n            const parent = (i - 1) >> 1;\n            if (this.data[parent] <= this.data[i]) break;\n            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];\n            i = parent;\n        }\n    }\n    pop(): number {\n        const top = this.data[0];\n        const last = this.data.pop()!;\n        if (this.data.length > 0) {\n            this.data[0] = last;\n            let i = 0;\n            while (true) {\n                let smallest = i;\n                const left = 2 * i + 1, right = 2 * i + 2;\n                if (left < this.data.length && this.data[left] < this.data[smallest]) smallest = left;\n                if (right < this.data.length && this.data[right] < this.data[smallest]) smallest = right;\n                if (smallest === i) break;\n                [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];\n                i = smallest;\n            }\n        }\n        return top;\n    }\n}",
    "lineMap": {
      "sort_engineers": [
        5,
        7,
        9
      ],
      "init": [
        12,
        13,
        14
      ],
      "next_engineer": [
        16
      ],
      "add_speed": [
        18,
        19
      ],
      "check_team_size": [
        22
      ],
      "remove_slowest": [
        23
      ],
      "compute_performance": [
        27,
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "over_k": [
        22
      ]
    }
  }
};

const MaximumPerformanceOfATeamPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "speed": [
        2,
        10,
        3,
        1,
        5,
        8
      ],
      "efficiency": [
        5,
        4,
        3,
        9,
        7,
        2
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "k=3",
    "value": {
      "speed": [
        2,
        10,
        3,
        1,
        5,
        8
      ],
      "efficiency": [
        5,
        4,
        3,
        9,
        7,
        2
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "speed": [
        2,
        8,
        2
      ],
      "efficiency": [
        2,
        7,
        1
      ],
      "k": 2
    }
  }
];

function generateMaximumPerformanceOfATeamSteps(e: any): any[] {
  
let t=e.speed??[],n=e.k??1,r=t.length,a=(0,i.createPerformanceScene)(e,"heap"),{recorder:s,writeEng:l}=a,c=(0,i.sortedEngineers)(e),o=new Map;c.forEach(([,,e],t)=>o.set(e,t));for(let e=0;e<r;e++)l(e,e);s.record("sort_engineers",`Sort by efficiency descending: [${c.map(e=>`(eff=${e[0]}, spd=${e[1]})`).join(", ")}]`);for(let e=0;e<r;e++)l(e,o.get(e));let f=new i.SpeedMinHeap,d=0,p=0,u=[];s.record("init",`Empty heap, speedSum = 0, maxPerf = 0, k = ${n}`);for(let e=0;e<r;e++){let[t,i,r]=c[e];s.update_variable("round",e+1),s.update_variable("curIdx",r),s.update_variable("curEff",t),s.update_variable("curSpd",i),l(r,e,{engState:"current"}),s.record("next_engineer",`E${r}: eff ${t}, spd ${i}`),l(r,e,{inTeam:!0}),f.push(i,r),d+=i,s.update_variable("speedSum",d),s.record("add_speed",`E${r} joins, speedSum = ${d}`);let a=f.size()>n;if(s.set_conditionals([{key:"over_k",result:a}]),s.record("check_team_size",a?`Team of ${f.size()} exceeds k = ${n}`:`Team of ${f.size()} is within k = ${n}`),a){let[e,t]=f.pop();d-=e,l(t,o.get(t),{inTeam:!1}),s.update_variable("evictedIdx",t),s.update_variable("evictedSpd",e),s.update_variable("speedSum",d),s.record("remove_slowest",`Drop the slowest E${t} (spd ${e}), speedSum = ${d}`)}let m=d*t,h=m>p;h&&(p=m),u.push(m),l(r,e,{engState:"done"}),s.update_variable("perf",m),s.update_variable("improved",h),s.update_variable("maxPerf",p),s.update_variable("perfHistory",[...u]),s.record("compute_performance",`perf = ${d} x ${t} = ${m}${h?", new best":`, best stays ${p}`}`)}return s.update_variable("result",p%i.MOD),s.record("complete",`Done: maxPerf = ${p}, return ${p%i.MOD}`),a.steps()
}

export function MaximumPerformanceOfATeamProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumPerformanceOfATeamTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumPerformanceOfATeamSteps(e) as any[];
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
      title="Maximum Performance of a Team"
      slug="maximum-performance-of-a-team"
      approaches={approaches}
      presets={MaximumPerformanceOfATeamPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Cost to Connect Sticks (minimum-cost-to-connect-sticks)
// ==========================================

const MinimumCostToConnectSticksTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def connectSticks(self, sticks: list[int]) -> int:\n        # Build min-heap from all stick lengths\n        heapq.heapify(sticks)\n        total_cost = 0\n        # Merge until one stick remains\n        while len(sticks) > 1:\n            first = heapq.heappop(sticks)\n            second = heapq.heappop(sticks)\n            cost = first + second\n            total_cost += cost\n            heapq.heappush(sticks, cost)\n        return total_cost",
    "lineMap": {
      "build_heap": [
        4
      ],
      "init": [
        5
      ],
      "loop": [
        7
      ],
      "extract_first": [
        8
      ],
      "extract_second": [
        9
      ],
      "compute_cost": [
        10,
        11
      ],
      "push_merged": [
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int connectSticks(int[] sticks) {\n        // Build min-heap from all stick lengths\n        PriorityQueue<Integer> heap = new PriorityQueue<>();\n        for (int s : sticks) {\n            heap.offer(s);\n        }\n        int totalCost = 0;\n        // Merge until one stick remains\n        while (heap.size() > 1) {\n            int first = heap.poll();\n            int second = heap.poll();\n            int cost = first + second;\n            totalCost += cost;\n            heap.offer(cost);\n        }\n        return totalCost;\n    }\n}",
    "lineMap": {
      "build_heap": [
        4,
        5,
        6
      ],
      "init": [
        8
      ],
      "loop": [
        10
      ],
      "extract_first": [
        11
      ],
      "extract_second": [
        12
      ],
      "compute_cost": [
        13,
        14
      ],
      "push_merged": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int ConnectSticks(int[] sticks) {\n        // Build min-heap using PriorityQueue\n        PriorityQueue<int, int> heap = new PriorityQueue<int, int>();\n        foreach (int s in sticks) {\n            heap.Enqueue(s, s);\n        }\n        int totalCost = 0;\n        // Merge until one stick remains\n        while (heap.Count > 1) {\n            int first = heap.Dequeue();\n            int second = heap.Dequeue();\n            int cost = first + second;\n            totalCost += cost;\n            heap.Enqueue(cost, cost);\n        }\n        return totalCost;\n    }\n}",
    "lineMap": {
      "build_heap": [
        4,
        5,
        6
      ],
      "init": [
        8
      ],
      "loop": [
        10
      ],
      "extract_first": [
        11
      ],
      "extract_second": [
        12
      ],
      "compute_cost": [
        13,
        14
      ],
      "push_merged": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int connectSticks(vector<int>& sticks) {\n        // Build min-heap (C++ priority_queue is max-heap by default, use greater<>)\n        priority_queue<int, vector<int>, greater<int>> heap(sticks.begin(), sticks.end());\n        int totalCost = 0;\n        // Merge until one stick remains\n        while (heap.size() > 1) {\n            int first = heap.top(); heap.pop();\n            int second = heap.top(); heap.pop();\n            int cost = first + second;\n            totalCost += cost;\n            heap.push(cost);\n        }\n        return totalCost;\n    }\n};",
    "lineMap": {
      "build_heap": [
        5
      ],
      "init": [
        6
      ],
      "loop": [
        8
      ],
      "extract_first": [
        9
      ],
      "extract_second": [
        10
      ],
      "compute_cost": [
        11,
        12
      ],
      "push_merged": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func connectSticks(sticks []int) int {\n    // Build min-heap\n    h := &IntHeap{}\n    for _, s := range sticks {\n        heap.Push(h, s)\n    }\n    heap.Init(h)\n    totalCost := 0\n    // Merge until one stick remains\n    for h.Len() > 1 {\n        first := heap.Pop(h).(int)\n        second := heap.Pop(h).(int)\n        cost := first + second\n        totalCost += cost\n        heap.Push(h, cost)\n    }\n    return totalCost\n}\n\n// IntHeap implements heap.Interface for a min-heap of ints\ntype IntHeap []int\nfunc (h IntHeap) Len() int           { return len(h) }\nfunc (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }\nfunc (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *IntHeap) Push(x interface{}) { *h = append(*h, x.(int)) }\nfunc (h *IntHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "build_heap": [
        3,
        4,
        5,
        7
      ],
      "init": [
        8
      ],
      "loop": [
        10
      ],
      "extract_first": [
        11
      ],
      "extract_second": [
        12
      ],
      "compute_cost": [
        13,
        14
      ],
      "push_merged": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var connectSticks = function(sticks) {\n    // MinHeap helper\n    const heap = [];\n    const push = (val) => {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            let parent = (i - 1) >> 1;\n            if (heap[parent] <= heap[i]) break;\n            [heap[parent], heap[i]] = [heap[i], heap[parent]];\n            i = parent;\n        }\n    };\n    const pop = () => {\n        const top = heap[0];\n        const last = heap.pop();\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                let smallest = i, left = 2 * i + 1, right = 2 * i + 2;\n                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n                if (smallest === i) break;\n                [heap[smallest], heap[i]] = [heap[i], heap[smallest]];\n                i = smallest;\n            }\n        }\n        return top;\n    };\n    // Build min-heap\n    for (const s of sticks) push(s);\n    let totalCost = 0;\n    // Merge until one stick remains\n    while (heap.length > 1) {\n        let first = pop();\n        let second = pop();\n        let cost = first + second;\n        totalCost += cost;\n        push(cost);\n    }\n    return totalCost;\n};",
    "lineMap": {
      "build_heap": [
        32
      ],
      "init": [
        33
      ],
      "loop": [
        35
      ],
      "extract_first": [
        36
      ],
      "extract_second": [
        37
      ],
      "compute_cost": [
        38,
        39
      ],
      "push_merged": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        35
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function connectSticks(sticks: number[]): number {\n    // MinHeap helper\n    const heap: number[] = [];\n    const push = (val: number) => {\n        heap.push(val);\n        let i = heap.length - 1;\n        while (i > 0) {\n            let parent = (i - 1) >> 1;\n            if (heap[parent] <= heap[i]) break;\n            [heap[parent], heap[i]] = [heap[i], heap[parent]];\n            i = parent;\n        }\n    };\n    const pop = (): number => {\n        const top = heap[0];\n        const last = heap.pop()!;\n        if (heap.length > 0) {\n            heap[0] = last;\n            let i = 0;\n            while (true) {\n                let smallest = i, left = 2 * i + 1, right = 2 * i + 2;\n                if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n                if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n                if (smallest === i) break;\n                [heap[smallest], heap[i]] = [heap[i], heap[smallest]];\n                i = smallest;\n            }\n        }\n        return top;\n    };\n    // Build min-heap\n    for (const s of sticks) push(s);\n    let totalCost = 0;\n    // Merge until one stick remains\n    while (heap.length > 1) {\n        let first = pop();\n        let second = pop();\n        let cost = first + second;\n        totalCost += cost;\n        push(cost);\n    }\n    return totalCost;\n}",
    "lineMap": {
      "build_heap": [
        32
      ],
      "init": [
        33
      ],
      "loop": [
        35
      ],
      "extract_first": [
        36
      ],
      "extract_second": [
        37
      ],
      "compute_cost": [
        38,
        39
      ],
      "push_merged": [
        40
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "more_sticks": [
        35
      ]
    }
  }
};

const MinimumCostToConnectSticksPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "sticks": [
        2,
        4,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "sticks": [
        1,
        8,
        3,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Stick",
    "value": {
      "sticks": [
        5
      ]
    }
  }
];

function generateMinimumCostToConnectSticksSteps(t: any): any[] {
  
let e=[...t.sticks??[]],{scene:s,initial:n}=(0,i.createStickScene)(e),{recorder:a}=s,o=[...n],l=0;a.update_variable("totalCost",l),a.record("init","totalCost = 0");let r=0;for(;o.length>1;){r++,a.update_variable("round",r),a.set_conditionals([{key:"more_sticks",result:!0}]),a.record("loop",`${o.length} sticks left, keep merging`),o.sort((t,e)=>t[0]-e[0]),s.reseat(o,i.ZONE.list),a.update_variable("sticksLeft",o.length),a.record("sort",`Sort: [${o.map(([t])=>t).join(", ")}]`);let[t,e]=o.shift();s.seat(e,i.ZONE.holdA,-1,t),s.reseat(o,i.ZONE.list),a.update_variable("first",t),a.update_variable("firstKey",s.key(e)),a.update_variable("sticksLeft",o.length+1),a.record("extract_first",`Take the front stick: first = ${t}`);let[n,c]=o.shift();s.seat(c,i.ZONE.holdB,-2,n),s.reseat(o,i.ZONE.list),a.update_variable("second",n),a.update_variable("secondKey",s.key(c)),a.update_variable("sticksLeft",o.length+2),a.record("extract_second",`Take the next stick: second = ${n}`);let p=t+n;l+=p,s.seat(e,i.ZONE.joinA,-1,t),s.seat(c,i.ZONE.joinB,-2,n),a.update_variable("cost",p),a.update_variable("totalCost",l),a.record("compute_cost",`Connect them: cost = ${t} + ${n} = ${p}, totalCost = ${l}`),s.drop(e),s.drop(c);let h=s.nextId();o.push([p,h]),s.reseat(o,i.ZONE.list),a.update_variable("mergedKey",s.key(h)),a.update_variable("sticksLeft",o.length),a.record("push_merged",`Append the merged stick (${p}) to the end`),a.delete_variable("first"),a.delete_variable("second"),a.delete_variable("cost")}return a.set_conditionals([{key:"more_sticks",result:!1}]),a.add_new_variable("result",l),a.record("complete",`Done: totalCost = ${l}`),a.getSteps()
}

export function MinimumCostToConnectSticksProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumCostToConnectSticksTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMinimumCostToConnectSticksSteps(t) as any[];
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
      title="Minimum Cost to Connect Sticks"
      slug="minimum-cost-to-connect-sticks"
      approaches={approaches}
      presets={MinimumCostToConnectSticksPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Cost to Hire K Workers (minimum-cost-to-hire-k-workers)
// ==========================================

const MinimumCostToHireKWorkersTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def mincostToHireWorkers(self, quality: list[int], wage: list[int], k: int) -> float:\n        n = len(quality)\n        min_cost = float('inf')\n\n        def backtrack(start, combo):\n            nonlocal min_cost\n            if len(combo) == k:\n                max_ratio = max(wage[i] / quality[i] for i in combo)\n                total_quality = sum(quality[i] for i in combo)\n                min_cost = min(min_cost, max_ratio * total_quality)\n                return\n            for i in range(start, n):\n                combo.append(i)\n                backtrack(i + 1, combo)\n                combo.pop()\n\n        backtrack(0, [])\n        return min_cost",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "pick_worker": [
        13,
        14,
        15
      ],
      "evaluate_combo": [
        9,
        10,
        11
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "combo_full": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {\n        int n = quality.length;\n        double minCost = Double.MAX_VALUE;\n        List<Integer> combo = new ArrayList<>();\n        return findMin(quality, wage, k, n, 0, combo, Double.MAX_VALUE);\n    }\n\n    private double findMin(int[] quality, int[] wage, int k, int n,\n                           int start, List<Integer> combo, double minCost) {\n        if (combo.size() == k) {\n            double maxRatio = 0;\n            int totalQuality = 0;\n            for (int idx : combo) {\n                maxRatio = Math.max(maxRatio, (double) wage[idx] / quality[idx]);\n                totalQuality += quality[idx];\n            }\n            return Math.min(minCost, maxRatio * totalQuality);\n        }\n        for (int i = start; i < n; i++) {\n            combo.add(i);\n            minCost = findMin(quality, wage, k, n, i + 1, combo, minCost);\n            combo.remove(combo.size() - 1);\n        }\n        return minCost;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4
      ],
      "pick_worker": [
        20,
        21,
        22
      ],
      "evaluate_combo": [
        15,
        16,
        18
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "combo_full": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {\n        int n = quality.size();\n        double minCost = DBL_MAX;\n        vector<int> combo;\n        backtrack(quality, wage, k, n, 0, combo, minCost);\n        return minCost;\n    }\n\n    void backtrack(vector<int>& quality, vector<int>& wage, int k, int n,\n                   int start, vector<int>& combo, double& minCost) {\n        if ((int)combo.size() == k) {\n            double maxRatio = 0;\n            int totalQuality = 0;\n            for (int idx : combo) {\n                maxRatio = max(maxRatio, (double)wage[idx] / quality[idx]);\n                totalQuality += quality[idx];\n            }\n            minCost = min(minCost, maxRatio * totalQuality);\n            return;\n        }\n        for (int i = start; i < n; i++) {\n            combo.push_back(i);\n            backtrack(quality, wage, k, n, i + 1, combo, minCost);\n            combo.pop_back();\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5
      ],
      "pick_worker": [
        23,
        24,
        25
      ],
      "evaluate_combo": [
        17,
        18,
        20
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {
      "combo_full": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private double minCost;\n\n    public double MincostToHireWorkers(int[] quality, int[] wage, int k) {\n        minCost = double.MaxValue;\n        Backtrack(quality, wage, k, 0, new List<int>());\n        return minCost;\n    }\n\n    private void Backtrack(int[] quality, int[] wage, int k,\n                           int start, List<int> combo) {\n        if (combo.Count == k) {\n            double maxRatio = 0;\n            int totalQuality = 0;\n            foreach (int idx in combo) {\n                maxRatio = Math.Max(maxRatio, (double)wage[idx] / quality[idx]);\n                totalQuality += quality[idx];\n            }\n            minCost = Math.Min(minCost, maxRatio * totalQuality);\n            return;\n        }\n        for (int i = start; i < quality.Length; i++) {\n            combo.Add(i);\n            Backtrack(quality, wage, k, i + 1, combo);\n            combo.RemoveAt(combo.Count - 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "initialize": [
        5
      ],
      "pick_worker": [
        22,
        23,
        24
      ],
      "evaluate_combo": [
        16,
        17,
        19
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "combo_full": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mincostToHireWorkers(quality []int, wage []int, k int) float64 {\n    n := len(quality)\n    minCost := math.MaxFloat64\n\n    var backtrack func(start int, combo []int)\n    backtrack = func(start int, combo []int) {\n        if len(combo) == k {\n            maxRatio := 0.0\n            totalQuality := 0\n            for _, idx := range combo {\n                ratio := float64(wage[idx]) / float64(quality[idx])\n                if ratio > maxRatio {\n                    maxRatio = ratio\n                }\n                totalQuality += quality[idx]\n            }\n            cost := maxRatio * float64(totalQuality)\n            if cost < minCost {\n                minCost = cost\n            }\n            return\n        }\n        for i := start; i < n; i++ {\n            backtrack(i+1, append(combo, i))\n        }\n    }\n\n    backtrack(0, []int{})\n    return minCost\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "pick_worker": [
        23,
        24
      ],
      "evaluate_combo": [
        13,
        15,
        17,
        19
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "combo_full": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var mincostToHireWorkers = function (quality, wage, k) {\n  const n = quality.length;\n  let minCost = Infinity;\n\n  const backtrack = (start, combo) => {\n    if (combo.length === k) {\n      let maxRatio = 0;\n      let totalQuality = 0;\n      for (const idx of combo) {\n        maxRatio = Math.max(maxRatio, wage[idx] / quality[idx]);\n        totalQuality += quality[idx];\n      }\n      minCost = Math.min(minCost, maxRatio * totalQuality);\n      return;\n    }\n    for (let i = start; i < n; i++) {\n      combo.push(i);\n      backtrack(i + 1, combo);\n      combo.pop();\n    }\n  };\n\n  backtrack(0, []);\n  return minCost;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "pick_worker": [
        16,
        17,
        18
      ],
      "evaluate_combo": [
        10,
        11,
        13
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "combo_full": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mincostToHireWorkers(quality: number[], wage: number[], k: number): number {\n    const n = quality.length;\n    let minCost = Infinity;\n\n    const backtrack = (start: number, combo: number[]): void => {\n        if (combo.length === k) {\n            let maxRatio = 0;\n            let totalQuality = 0;\n            for (const idx of combo) {\n                maxRatio = Math.max(maxRatio, wage[idx] / quality[idx]);\n                totalQuality += quality[idx];\n            }\n            minCost = Math.min(minCost, maxRatio * totalQuality);\n            return;\n        }\n        for (let i = start; i < n; i++) {\n            combo.push(i);\n            backtrack(i + 1, combo);\n            combo.pop();\n        }\n    };\n\n    backtrack(0, []);\n    return minCost;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "pick_worker": [
        16,
        17,
        18
      ],
      "evaluate_combo": [
        10,
        11,
        13
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "combo_full": [
        6
      ]
    }
  }
};

const MinimumCostToHireKWorkersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "quality": [
        10,
        20,
        5
      ],
      "wage": [
        70,
        50,
        30
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "quality": [
        3,
        1,
        10,
        10,
        1
      ],
      "wage": [
        4,
        8,
        2,
        2,
        7
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Equal workers",
    "value": {
      "quality": [
        5,
        5
      ],
      "wage": [
        10,
        10
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "Small k=2",
    "value": {
      "quality": [
        4,
        8,
        2
      ],
      "wage": [
        10,
        20,
        8
      ],
      "k": 2
    }
  }
];

function generateMinimumCostToHireKWorkersSteps(e: any): any[] {
  
let t=[...e.quality],i=[...e.wage],l=e.k,n=t.length,o=Array.from({length:n},(e,t)=>t).sort((e,a)=>i[e]/t[e]-i[a]/t[a]||e-a),r={};o.forEach((e,a)=>{r[`worker_${a}`]={type:"arrayElement",value:t[e],label:String(i[e]),position:e}});let s=new StepRecorder({k:l,n},r);s.record("-",`Start: Hire exactly ${l} workers as cheaply as possible`),o.forEach((e,a)=>{s.update_visual(`worker_${a}`,{type:"arrayElement",value:t[e],label:String(i[e]),position:a})}),s.record("sort_by_ratio","Sort workers by wage/quality: the captain's rate prices the whole team");let u=0,c=1/0,d=[];s.add_new_variable("qualitySum",0),s.add_new_variable("team",d),s.record("initialize","Initialize maxHeap = [], qualitySum = 0, minCost = ∞");let m=e=>parseFloat(e.toFixed(2));for(let e=0;e<n;e++){let a=o[e],n=t[a],r=i[a],h=r/n;if(s.add_conditional("worker_loop",!0),d.push(e),u+=n,s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.update_variable("i",e),s.update_variable("q",n),s.update_variable("w",r),s.update_variable("ratio",m(h)),s.update_variable("qualitySum",u),s.update_variable("team",d),s.delete_variable("evictedPos"),s.delete_variable("cost"),s.record("add_to_heap",`Worker with rate ${m(h)} joins: quality ${n} enters the heap, qualitySum = ${u}`),d.length>l){s.add_conditional("heap_exceeds_k",!0);let e=0;for(let i=1;i<d.length;i++)t[o[d[i]]]>t[o[d[e]]]&&(e=i);let i=d[e],a=t[o[i]];d.splice(e,1),u-=a,s.update_variable("qualitySum",u),s.update_variable("team",d),s.update_variable("evictedPos",i),s.update_variable("evictedQ",a),s.record("remove_max_quality",`Team is over ${l}: evict the largest quality ${a}, qualitySum = ${u}`)}else s.add_conditional("heap_exceeds_k",!1);if(d.length===l){let t=h*u,i=t<c,a=c;i&&(c=t),s.update_variable("cost",m(t)),s.update_variable("newMin",i),s.update_variable("prevMin",a===1/0?"∞":m(a)),s.update_variable("minCost",m(c)),i&&(s.update_variable("bestTeam",d),s.update_variable("bestCaptain",e)),s.record("compute_cost",`cost = rate ${m(h)} \xd7 qualitySum ${u} = ${m(t)}${i?" → new minimum!":` ≥ minCost ${m(c)}, keep it`}`)}}return s.add_conditional("worker_loop",!1),s.delete_visual("ptr_i"),s.delete_variable("evictedPos"),s.delete_variable("cost"),s.add_new_variable("result",m(c)),s.record("complete",`Minimum cost to hire ${l} workers = ${m(c)}`),s.getSteps()
}

export function MinimumCostToHireKWorkersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumCostToHireKWorkersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumCostToHireKWorkersSteps(e) as any[];
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
      title="Minimum Cost to Hire K Workers"
      slug="minimum-cost-to-hire-k-workers"
      approaches={approaches}
      presets={MinimumCostToHireKWorkersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Number of Refueling Stops (minimum-number-of-refueling-stops)
// ==========================================

const MinimumNumberOfRefuelingStopsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minRefuelStops(self, target: int, startFuel: int, stations: list[list[int]]) -> int:\n        # Max-heap (negate values since heapq is a min-heap)\n        max_heap = []\n        fuel = startFuel\n        stops = 0\n        prev = 0\n\n        for i in range(len(stations) + 1):\n            # Current waypoint: next station or target\n            curr_pos = stations[i][0] if i < len(stations) else target\n            fuel -= (curr_pos - prev)\n\n            # If we can't reach this waypoint, use fuel from best passed stations\n            while fuel < 0 and max_heap:\n                fuel += -heapq.heappop(max_heap)\n                stops += 1\n\n            # If still can't reach, it's impossible\n            if fuel < 0:\n                return -1\n\n            # Add this station's fuel to the heap (skip for target sentinel)\n            if i < len(stations):\n                heapq.heappush(max_heap, -stations[i][1])\n            prev = curr_pos\n\n        return stops",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6,
        7
      ],
      "consume_fuel": [
        9,
        10,
        11,
        12
      ],
      "refuel_from_heap": [
        14,
        15,
        16,
        17
      ],
      "impossible": [
        19,
        20,
        21
      ],
      "push_station": [
        23,
        24,
        25,
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        15
      ],
      "still_short": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int minRefuelStops(int target, int startFuel, int[][] stations) {\n        // Max-heap to store fuel values of stations we've passed\n        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n        int fuel = startFuel;\n        int stops = 0;\n        int prev = 0;\n\n        for (int i = 0; i <= stations.length; i++) {\n            // Current waypoint: next station or target\n            int currPos = (i < stations.length) ? stations[i][0] : target;\n            fuel -= (currPos - prev);\n\n            // If we can't reach this waypoint, use fuel from best passed stations\n            while (fuel < 0 && !maxHeap.isEmpty()) {\n                fuel += maxHeap.poll();\n                stops++;\n            }\n\n            // If still can't reach, it's impossible\n            if (fuel < 0) return -1;\n\n            // Add this station's fuel to the heap (skip for target sentinel)\n            if (i < stations.length) {\n                maxHeap.offer(stations[i][1]);\n            }\n            prev = currPos;\n        }\n\n        return stops;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6,
        7
      ],
      "consume_fuel": [
        9,
        10,
        11,
        12
      ],
      "refuel_from_heap": [
        14,
        15,
        16,
        17,
        18
      ],
      "impossible": [
        20,
        21
      ],
      "push_station": [
        23,
        24,
        25,
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        15
      ],
      "still_short": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int minRefuelStops(int target, int startFuel, vector<vector<int>>& stations) {\n        // Max-heap to store fuel values of stations we've passed\n        priority_queue<int> maxHeap;\n        int fuel = startFuel;\n        int stops = 0;\n        int prev = 0;\n\n        for (int i = 0; i <= (int)stations.size(); i++) {\n            // Current waypoint: next station or target\n            int currPos = (i < (int)stations.size()) ? stations[i][0] : target;\n            fuel -= (currPos - prev);\n\n            // If we can't reach this waypoint, use fuel from best passed stations\n            while (fuel < 0 && !maxHeap.empty()) {\n                fuel += maxHeap.top();\n                maxHeap.pop();\n                stops++;\n            }\n\n            // If still can't reach, it's impossible\n            if (fuel < 0) return -1;\n\n            // Add this station's fuel to the heap (skip for target sentinel)\n            if (i < (int)stations.size()) {\n                maxHeap.push(stations[i][1]);\n            }\n            prev = currPos;\n        }\n\n        return stops;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "initialize": [
        4,
        5,
        6,
        7,
        8
      ],
      "consume_fuel": [
        10,
        11,
        12,
        13
      ],
      "refuel_from_heap": [
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "impossible": [
        22,
        23
      ],
      "push_station": [
        25,
        26,
        27,
        28,
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        16
      ],
      "still_short": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MinRefuelStops(int target, int startFuel, int[][] stations) {\n        // Max-heap to store fuel values of stations we've passed\n        PriorityQueue<int, int> maxHeap = new PriorityQueue<int, int>(\n            Comparer<int>.Create((a, b) => b.CompareTo(a))\n        );\n        int fuel = startFuel;\n        int stops = 0;\n        int prev = 0;\n\n        for (int i = 0; i <= stations.Length; i++) {\n            // Current waypoint: next station or target\n            int currPos = (i < stations.Length) ? stations[i][0] : target;\n            fuel -= (currPos - prev);\n\n            // If we can't reach this waypoint, use fuel from best passed stations\n            while (fuel < 0 && maxHeap.Count > 0) {\n                fuel += maxHeap.Dequeue();\n                stops++;\n            }\n\n            // If still can't reach, it's impossible\n            if (fuel < 0) return -1;\n\n            // Add this station's fuel to the heap (skip for target sentinel)\n            if (i < stations.Length) {\n                maxHeap.Enqueue(stations[i][1], stations[i][1]);\n            }\n            prev = currPos;\n        }\n\n        return stops;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "initialize": [
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "consume_fuel": [
        11,
        12,
        13,
        14
      ],
      "refuel_from_heap": [
        16,
        17,
        18,
        19,
        20
      ],
      "impossible": [
        22,
        23
      ],
      "push_station": [
        25,
        26,
        27,
        28,
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        17
      ],
      "still_short": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minRefuelStops(target int, startFuel int, stations [][]int) int {\n    // Max-heap to store fuel values of stations we've passed\n    h := &MaxHeap{}\n    heap.Init(h)\n    fuel := startFuel\n    stops := 0\n    prev := 0\n\n    for i := 0; i <= len(stations); i++ {\n        // Current waypoint: next station or target\n        currPos := target\n        if i < len(stations) {\n            currPos = stations[i][0]\n        }\n        fuel -= (currPos - prev)\n\n        // If we can't reach this waypoint, use fuel from best passed stations\n        for fuel < 0 && h.Len() > 0 {\n            fuel += heap.Pop(h).(int)\n            stops++\n        }\n\n        // If still can't reach, it's impossible\n        if fuel < 0 {\n            return -1\n        }\n\n        // Add this station's fuel to the heap (skip for target sentinel)\n        if i < len(stations) {\n            heap.Push(h, stations[i][1])\n        }\n        prev = currPos\n    }\n\n    return stops\n}\n\ntype MaxHeap []int\n\nfunc (h MaxHeap) Len() int            { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool   { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "consume_fuel": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "refuel_from_heap": [
        17,
        18,
        19,
        20,
        21
      ],
      "impossible": [
        23,
        24,
        25,
        26
      ],
      "push_station": [
        28,
        29,
        30,
        31,
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        18
      ],
      "still_short": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minRefuelStops = function (target, startFuel, stations) {\n  // Max-heap implemented with array\n  const maxHeap = [];\n\n  const heapPush = (val) => {\n    maxHeap.push(val);\n    let i = maxHeap.length - 1;\n    while (i > 0) {\n      const parent = Math.floor((i - 1) / 2);\n      if (maxHeap[parent] >= maxHeap[i]) break;\n      [maxHeap[parent], maxHeap[i]] = [maxHeap[i], maxHeap[parent]];\n      i = parent;\n    }\n  };\n\n  const heapPop = () => {\n    const top = maxHeap[0];\n    const last = maxHeap.pop();\n    if (maxHeap.length > 0) {\n      maxHeap[0] = last;\n      let i = 0;\n      while (true) {\n        let largest = i;\n        const left = 2 * i + 1;\n        const right = 2 * i + 2;\n        if (left < maxHeap.length && maxHeap[left] > maxHeap[largest]) largest = left;\n        if (right < maxHeap.length && maxHeap[right] > maxHeap[largest]) largest = right;\n        if (largest === i) break;\n        [maxHeap[i], maxHeap[largest]] = [maxHeap[largest], maxHeap[i]];\n        i = largest;\n      }\n    }\n    return top;\n  };\n\n  let fuel = startFuel;\n  let stops = 0;\n  let prev = 0;\n\n  for (let i = 0; i <= stations.length; i++) {\n    const currPos = i < stations.length ? stations[i][0] : target;\n    fuel -= currPos - prev;\n\n    // If we can't reach this waypoint, use fuel from best passed stations\n    while (fuel < 0 && maxHeap.length > 0) {\n      fuel += heapPop();\n      stops++;\n    }\n\n    // If still can't reach, it's impossible\n    if (fuel < 0) return -1;\n\n    // Add this station's fuel to the heap (skip for target sentinel)\n    if (i < stations.length) {\n      heapPush(stations[i][1]);\n    }\n    prev = currPos;\n  }\n\n  return stops;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "initialize": [
        36,
        37,
        38
      ],
      "consume_fuel": [
        40,
        41,
        42
      ],
      "refuel_from_heap": [
        44,
        45,
        46,
        47,
        48
      ],
      "impossible": [
        50,
        51
      ],
      "push_station": [
        53,
        54,
        55,
        56,
        57
      ],
      "complete": [
        60
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        45
      ],
      "still_short": [
        51
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minRefuelStops(target: number, startFuel: number, stations: number[][]): number {\n    // Max-heap implemented with array\n    const maxHeap: number[] = [];\n\n    const heapPush = (val: number): void => {\n        maxHeap.push(val);\n        let i = maxHeap.length - 1;\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (maxHeap[parent] >= maxHeap[i]) break;\n            [maxHeap[parent], maxHeap[i]] = [maxHeap[i], maxHeap[parent]];\n            i = parent;\n        }\n    };\n\n    const heapPop = (): number => {\n        const top = maxHeap[0];\n        const last = maxHeap.pop()!;\n        if (maxHeap.length > 0) {\n            maxHeap[0] = last;\n            let i = 0;\n            while (true) {\n                let largest = i;\n                const left = 2 * i + 1;\n                const right = 2 * i + 2;\n                if (left < maxHeap.length && maxHeap[left] > maxHeap[largest]) largest = left;\n                if (right < maxHeap.length && maxHeap[right] > maxHeap[largest]) largest = right;\n                if (largest === i) break;\n                [maxHeap[i], maxHeap[largest]] = [maxHeap[largest], maxHeap[i]];\n                i = largest;\n            }\n        }\n        return top;\n    };\n\n    let fuel = startFuel;\n    let stops = 0;\n    let prev = 0;\n\n    for (let i = 0; i <= stations.length; i++) {\n        const currPos = i < stations.length ? stations[i][0] : target;\n        fuel -= currPos - prev;\n\n        // If we can't reach this waypoint, use fuel from best passed stations\n        while (fuel < 0 && maxHeap.length > 0) {\n            fuel += heapPop();\n            stops++;\n        }\n\n        // If still can't reach, it's impossible\n        if (fuel < 0) return -1;\n\n        // Add this station's fuel to the heap (skip for target sentinel)\n        if (i < stations.length) {\n            heapPush(stations[i][1]);\n        }\n        prev = currPos;\n    }\n\n    return stops;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "initialize": [
        36,
        37,
        38
      ],
      "consume_fuel": [
        40,
        41,
        42
      ],
      "refuel_from_heap": [
        44,
        45,
        46,
        47,
        48
      ],
      "impossible": [
        50,
        51
      ],
      "push_station": [
        53,
        54,
        55,
        56,
        57
      ],
      "complete": [
        60
      ]
    },
    "conditionalMap": {
      "need_refuel": [
        45
      ],
      "still_short": [
        51
      ]
    }
  }
};

const MinimumNumberOfRefuelingStopsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "target": 100,
      "startFuel": 10,
      "stations": [
        [
          10,
          60
        ],
        [
          20,
          30
        ],
        [
          30,
          30
        ],
        [
          60,
          40
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Impossible",
    "value": {
      "target": 100,
      "startFuel": 1,
      "stations": [
        [
          10,
          100
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Already there",
    "value": {
      "target": 1,
      "startFuel": 1,
      "stations": []
    }
  },
  {
    "id": "ex4",
    "label": "Two stations",
    "value": {
      "target": 100,
      "startFuel": 50,
      "stations": [
        [
          25,
          25
        ],
        [
          50,
          50
        ]
      ]
    }
  }
];

function generateMinimumNumberOfRefuelingStopsSteps(t: any): any[] {
  
let e=t.target,a=t.startFuel,s=t.stations.map(t=>[...t]),n=s.length,r=new StepRecorder({target:e,startFuel:a,stationsList:s},{});r.update_variable("mode","dp"),r.record("-",`Start: Reach position ${e} with the fewest refueling stops`);let o=Array(n+1).fill(0);o[0]=a,r.update_variable("dp",[...o]),r.update_variable("dpK",-1),r.update_variable("dpNext",-1),r.record("init_dp",`dp[k] = farthest position reachable with exactly k stops. dp[0] = ${a}`);for(let t=0;t<n;t++){let[e,a]=s[t];r.update_variable("i",t),r.update_variable("stationPos",e),r.update_variable("stationFuel",a),r.update_variable("dpK",-1),r.update_variable("dpNext",-1),r.record("pick_station",`Station ${t} sits at ${e} and holds ${a} fuel`);for(let i=t;i>=0;i--){let s=o[i]>=e;if(r.update_variable("dpK",i),r.update_variable("dpNext",-1),r.add_conditional("can_reach_station",s),r.record("relax",s?`dp[${i}] = ${o[i]} reaches station ${t} at ${e}`:`dp[${i}] = ${o[i]} falls short of station ${t} at ${e}`),s){let t=o[i]+a,e=o[i+1];o[i+1]=Math.max(e,t),r.update_variable("dp",[...o]),r.update_variable("dpNext",i+1),r.update_variable("candidate",t),r.record("update_dp",t>e?`dp[${i+1}] = max(${e}, ${o[i]} + ${a}) = ${o[i+1]}`:`dp[${i+1}] stays ${e}, better than ${t}`)}}}r.delete_variable("i"),r.delete_variable("stationPos"),r.delete_variable("stationFuel"),r.delete_variable("candidate"),r.update_variable("dpNext",-1);for(let t=0;t<=n;t++){let a=o[t]>=e;if(r.update_variable("dpK",t),r.add_conditional("dp_reaches_target",a),r.record("scan_answer",a?`dp[${t}] = ${o[t]} reaches the target ${e}`:`dp[${t}] = ${o[t]} falls short of the target ${e}`),a)return r.update_variable("dpK",t),r.add_new_variable("verdict",!0),r.add_new_variable("result",t),r.record("return_k",`${t} ${1===t?"stop":"stops"} is the smallest k that reaches the target`),r.getSteps()}return r.update_variable("dpK",-1),r.add_new_variable("verdict",!1),r.add_new_variable("result",-1),r.record("return_fail",`No number of stops reaches ${e}. The target is unreachable: return -1`),r.getSteps()
}

export function MinimumNumberOfRefuelingStopsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumNumberOfRefuelingStopsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMinimumNumberOfRefuelingStopsSteps(t) as any[];
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
      title="Minimum Number of Refueling Stops"
      slug="minimum-number-of-refueling-stops"
      approaches={approaches}
      presets={MinimumNumberOfRefuelingStopsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Process Tasks Using Servers (process-tasks-using-servers)
// ==========================================

const ProcessTasksUsingServersTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def assignTasks(self, servers: list[int], tasks: list[int]) -> list[int]:\n        import heapq\n\n        n = len(servers)\n        m = len(tasks)\n        ans = [0] * m\n\n        # Free heap: (weight, index)\n        free = [(servers[i], i) for i in range(n)]\n        heapq.heapify(free)\n\n        # Busy heap: (finishTime, weight, index)\n        busy = []\n\n        for j in range(m):\n            time = j\n\n            # If no free server, fast-forward to the earliest finish time\n            if not free:\n                time = busy[0][0]\n\n            # Move all servers that finish by 'time' back to free heap\n            while busy and busy[0][0] <= time:\n                finish, weight, idx = heapq.heappop(busy)\n                heapq.heappush(free, (weight, idx))\n\n            # Assign the lightest free server\n            weight, idx = heapq.heappop(free)\n            ans[j] = idx\n            heapq.heappush(busy, (time + tasks[j], weight, idx))\n\n        return ans",
    "lineMap": {
      "init": [
        5,
        6,
        7
      ],
      "init_free_heap": [
        10,
        11
      ],
      "check_task": [
        16,
        17
      ],
      "check_free_empty": [
        20
      ],
      "fast_forward": [
        21
      ],
      "release_servers": [
        24,
        25,
        26
      ],
      "assign_server": [
        29,
        30,
        31
      ],
      "complete": [
        33
      ],
      "init_busy_heap": [
        14
      ]
    },
    "conditionalMap": {
      "free_empty": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] assignTasks(int[] servers, int[] tasks) {\n        int n = servers.length;\n        int m = tasks.length;\n        int[] ans = new int[m];\n\n        // Free heap: (weight, index)\n        PriorityQueue<int[]> free = new PriorityQueue<>((a, b) ->\n            a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n        // Busy heap: (finishTime, weight, index)\n        PriorityQueue<long[]> busy = new PriorityQueue<>((a, b) ->\n            a[0] != b[0] ? Long.compare(a[0], b[0]) :\n            a[1] != b[1] ? Long.compare(a[1], b[1]) : Long.compare(a[2], b[2]));\n\n        for (int i = 0; i < n; i++) {\n            free.offer(new int[]{servers[i], i});\n        }\n\n        for (int j = 0; j < m; j++) {\n            long time = j;\n\n            // If no free server, fast-forward to the earliest finish time\n            if (free.isEmpty()) {\n                time = busy.peek()[0];\n            }\n\n            // Move all servers that finish by 'time' back to free heap\n            while (!busy.isEmpty() && busy.peek()[0] <= time) {\n                long[] done = busy.poll();\n                free.offer(new int[]{(int) done[1], (int) done[2]});\n            }\n\n            // Assign the lightest free server\n            int[] server = free.poll();\n            ans[j] = server[1];\n            busy.offer(new long[]{time + tasks[j], server[0], server[1]});\n        }\n\n        return ans;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4,
        5
      ],
      "init_free_heap": [
        8,
        17
      ],
      "check_task": [
        20,
        21
      ],
      "check_free_empty": [
        24
      ],
      "fast_forward": [
        25
      ],
      "release_servers": [
        29,
        30,
        31
      ],
      "assign_server": [
        35,
        36,
        37
      ],
      "complete": [
        40
      ],
      "init_busy_heap": [
        12
      ]
    },
    "conditionalMap": {
      "free_empty": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] AssignTasks(int[] servers, int[] tasks) {\n        int n = servers.Length;\n        int m = tasks.Length;\n        int[] ans = new int[m];\n\n        // Free heap: (weight, index)\n        PriorityQueue<int[], int[]> free = new(Comparer<int[]>.Create((a, b) =>\n            a[0] != b[0] ? a[0].CompareTo(b[0]) : a[1].CompareTo(b[1])));\n\n        // Busy heap: (finishTime, weight, index)\n        PriorityQueue<long[], long[]> busy = new(Comparer<long[]>.Create((a, b) =>\n            a[0] != b[0] ? a[0].CompareTo(b[0]) :\n            a[1] != b[1] ? a[1].CompareTo(b[1]) : a[2].CompareTo(b[2])));\n\n        for (int i = 0; i < n; i++) {\n            int[] entry = new int[] { servers[i], i };\n            free.Enqueue(entry, entry);\n        }\n\n        for (int j = 0; j < m; j++) {\n            long time = j;\n\n            // If no free server, fast-forward to the earliest finish time\n            if (free.Count == 0) {\n                busy.TryPeek(out long[] top, out _);\n                time = top[0];\n            }\n\n            // Move all servers that finish by 'time' back to free heap\n            while (busy.Count > 0) {\n                busy.TryPeek(out long[] top, out _);\n                if (top[0] > time) break;\n                busy.Dequeue();\n                int[] entry = new int[] { (int)top[1], (int)top[2] };\n                free.Enqueue(entry, entry);\n            }\n\n            // Assign the lightest free server\n            int[] server = free.Dequeue();\n            ans[j] = server[1];\n            long[] busyEntry = new long[] { time + tasks[j], server[0], server[1] };\n            busy.Enqueue(busyEntry, busyEntry);\n        }\n\n        return ans;\n    }\n}",
    "lineMap": {
      "init": [
        3,
        4,
        5
      ],
      "init_free_heap": [
        8,
        18
      ],
      "check_task": [
        21,
        22
      ],
      "check_free_empty": [
        25
      ],
      "fast_forward": [
        27
      ],
      "release_servers": [
        31,
        34,
        36
      ],
      "assign_server": [
        40,
        41,
        43
      ],
      "complete": [
        46
      ],
      "init_busy_heap": [
        12
      ]
    },
    "conditionalMap": {
      "free_empty": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> assignTasks(vector<int>& servers, vector<int>& tasks) {\n        int n = servers.size();\n        int m = tasks.size();\n        vector<int> ans(m);\n\n        // Free heap: (weight, index) - min heap\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> free;\n\n        // Busy heap: (finishTime, weight, index) - min heap\n        priority_queue<tuple<long long,int,int>,\n                       vector<tuple<long long,int,int>>,\n                       greater<>> busy;\n\n        for (int i = 0; i < n; i++) {\n            free.push({servers[i], i});\n        }\n\n        for (int j = 0; j < m; j++) {\n            long long time = j;\n\n            // If no free server, fast-forward to the earliest finish time\n            if (free.empty()) {\n                time = get<0>(busy.top());\n            }\n\n            // Move all servers that finish by 'time' back to free heap\n            while (!busy.empty() && get<0>(busy.top()) <= time) {\n                auto [ft, w, idx] = busy.top();\n                busy.pop();\n                free.push({w, idx});\n            }\n\n            // Assign the lightest free server\n            auto [w, idx] = free.top();\n            free.pop();\n            ans[j] = idx;\n            busy.push({time + tasks[j], w, idx});\n        }\n\n        return ans;\n    }\n};",
    "lineMap": {
      "init": [
        4,
        5,
        6
      ],
      "init_free_heap": [
        9,
        17
      ],
      "check_task": [
        20,
        21
      ],
      "check_free_empty": [
        24
      ],
      "fast_forward": [
        25
      ],
      "release_servers": [
        29,
        31,
        32
      ],
      "assign_server": [
        37,
        38,
        39
      ],
      "complete": [
        42
      ],
      "init_busy_heap": [
        12
      ]
    },
    "conditionalMap": {
      "free_empty": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func assignTasks(servers []int, tasks []int) []int {\n    n := len(servers)\n    m := len(tasks)\n    ans := make([]int, m)\n\n    // Free heap: sorted by (weight, index)\n    freeHeap := &FreeHeap{}\n    for i := 0; i < n; i++ {\n        heap.Push(freeHeap, [2]int{servers[i], i})\n    }\n\n    // Busy heap: sorted by (finishTime, weight, index)\n    busyHeap := &BusyHeap{}\n\n    for j := 0; j < m; j++ {\n        time := int64(j)\n\n        // If no free server, fast-forward to earliest finish\n        if freeHeap.Len() == 0 {\n            time = (*busyHeap)[0][0]\n        }\n\n        // Move finished servers back to free heap\n        for busyHeap.Len() > 0 && (*busyHeap)[0][0] <= time {\n            done := heap.Pop(busyHeap).([3]int64)\n            heap.Push(freeHeap, [2]int{int(done[1]), int(done[2])})\n        }\n\n        // Assign the lightest free server\n        server := heap.Pop(freeHeap).([2]int)\n        ans[j] = server[1]\n        heap.Push(busyHeap, [3]int64{time + int64(tasks[j]), int64(server[0]), int64(server[1])})\n    }\n\n    return ans\n}\n\ntype FreeHeap [][2]int\nfunc (h FreeHeap) Len() int { return len(h) }\nfunc (h FreeHeap) Less(i, j int) bool {\n    if h[i][0] != h[j][0] { return h[i][0] < h[j][0] }\n    return h[i][1] < h[j][1]\n}\nfunc (h FreeHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }\nfunc (h *FreeHeap) Push(x interface{}) { *h = append(*h, x.([2]int)) }\nfunc (h *FreeHeap) Pop() interface{} {\n    old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x\n}\n\ntype BusyHeap [][3]int64\nfunc (h BusyHeap) Len() int { return len(h) }\nfunc (h BusyHeap) Less(i, j int) bool {\n    if h[i][0] != h[j][0] { return h[i][0] < h[j][0] }\n    if h[i][1] != h[j][1] { return h[i][1] < h[j][1] }\n    return h[i][2] < h[j][2]\n}\nfunc (h BusyHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }\nfunc (h *BusyHeap) Push(x interface{}) { *h = append(*h, x.([3]int64)) }\nfunc (h *BusyHeap) Pop() interface{} {\n    old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x\n}",
    "lineMap": {
      "init": [
        2,
        3,
        4
      ],
      "init_free_heap": [
        7,
        9
      ],
      "check_task": [
        15,
        16
      ],
      "check_free_empty": [
        19
      ],
      "fast_forward": [
        20
      ],
      "release_servers": [
        24,
        25,
        26
      ],
      "assign_server": [
        30,
        31,
        32
      ],
      "complete": [
        35
      ],
      "init_busy_heap": [
        13
      ]
    },
    "conditionalMap": {
      "free_empty": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var assignTasks = function(servers, tasks) {\n    var n = servers.length;\n    var m = tasks.length;\n    var ans = new Array(m);\n\n    // MinHeap implementation\n    function MinHeap(cmp) {\n        this.data = [];\n        this.cmp = cmp;\n    }\n    MinHeap.prototype.push = function(val) {\n        this.data.push(val);\n        var i = this.data.length - 1;\n        while (i > 0) {\n            var p = (i - 1) >> 1;\n            if (this.cmp(this.data[i], this.data[p]) < 0) {\n                var tmp = this.data[i]; this.data[i] = this.data[p]; this.data[p] = tmp;\n                i = p;\n            } else break;\n        }\n    };\n    MinHeap.prototype.pop = function() {\n        var top = this.data[0];\n        var last = this.data.pop();\n        if (this.data.length > 0) {\n            this.data[0] = last;\n            var i = 0;\n            while (true) {\n                var l = 2*i+1, r = 2*i+2, smallest = i;\n                if (l < this.data.length && this.cmp(this.data[l], this.data[smallest]) < 0) smallest = l;\n                if (r < this.data.length && this.cmp(this.data[r], this.data[smallest]) < 0) smallest = r;\n                if (smallest !== i) {\n                    var tmp = this.data[i]; this.data[i] = this.data[smallest]; this.data[smallest] = tmp;\n                    i = smallest;\n                } else break;\n            }\n        }\n        return top;\n    };\n    MinHeap.prototype.peek = function() { return this.data[0]; };\n    MinHeap.prototype.size = function() { return this.data.length; };\n\n    // Free heap: [weight, index]\n    var free = new MinHeap(function(a, b) {\n        return a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1];\n    });\n    for (var i = 0; i < n; i++) free.push([servers[i], i]);\n\n    // Busy heap: [finishTime, weight, index]\n    var busy = new MinHeap(function(a, b) {\n        return a[0] !== b[0] ? a[0] - b[0] : a[1] !== b[1] ? a[1] - b[1] : a[2] - b[2];\n    });\n\n    for (var j = 0; j < m; j++) {\n        var time = j;\n\n        // If no free server, fast-forward\n        if (free.size() === 0) {\n            time = busy.peek()[0];\n        }\n\n        // Move finished servers back to free\n        while (busy.size() > 0 && busy.peek()[0] <= time) {\n            var done = busy.pop();\n            free.push([done[1], done[2]]);\n        }\n\n        // Assign the lightest free server\n        var server = free.pop();\n        ans[j] = server[1];\n        busy.push([time + tasks[j], server[0], server[1]]);\n    }\n\n    return ans;\n};",
    "lineMap": {
      "init": [
        2,
        3,
        4
      ],
      "init_free_heap": [
        44,
        47
      ],
      "check_task": [
        54,
        55
      ],
      "check_free_empty": [
        58
      ],
      "fast_forward": [
        59
      ],
      "release_servers": [
        63,
        64,
        65
      ],
      "assign_server": [
        69,
        70,
        71
      ],
      "complete": [
        74
      ],
      "init_busy_heap": [
        50
      ]
    },
    "conditionalMap": {
      "free_empty": [
        58
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function assignTasks(servers: number[], tasks: number[]): number[] {\n    const n = servers.length;\n    const m = tasks.length;\n    const ans: number[] = new Array(m);\n\n    class MinHeap<T> {\n        data: T[] = [];\n        constructor(private cmp: (a: T, b: T) => number) {}\n        push(val: T) {\n            this.data.push(val);\n            let i = this.data.length - 1;\n            while (i > 0) {\n                const p = (i - 1) >> 1;\n                if (this.cmp(this.data[i], this.data[p]) < 0) {\n                    [this.data[i], this.data[p]] = [this.data[p], this.data[i]];\n                    i = p;\n                } else break;\n            }\n        }\n        pop(): T {\n            const top = this.data[0];\n            const last = this.data.pop()!;\n            if (this.data.length > 0) {\n                this.data[0] = last;\n                let i = 0;\n                while (true) {\n                    let l = 2*i+1, r = 2*i+2, s = i;\n                    if (l < this.data.length && this.cmp(this.data[l], this.data[s]) < 0) s = l;\n                    if (r < this.data.length && this.cmp(this.data[r], this.data[s]) < 0) s = r;\n                    if (s !== i) {\n                        [this.data[i], this.data[s]] = [this.data[s], this.data[i]];\n                        i = s;\n                    } else break;\n                }\n            }\n            return top;\n        }\n        peek(): T { return this.data[0]; }\n        size(): number { return this.data.length; }\n    }\n\n    // Free heap: [weight, index]\n    const free = new MinHeap<number[]>((a, b) =>\n        a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n    for (let i = 0; i < n; i++) free.push([servers[i], i]);\n\n    // Busy heap: [finishTime, weight, index]\n    const busy = new MinHeap<number[]>((a, b) =>\n        a[0] !== b[0] ? a[0] - b[0] : a[1] !== b[1] ? a[1] - b[1] : a[2] - b[2]);\n\n    for (let j = 0; j < m; j++) {\n        let time = j;\n\n        // If no free server, fast-forward\n        if (free.size() === 0) {\n            time = busy.peek()[0];\n        }\n\n        // Move finished servers back to free\n        while (busy.size() > 0 && busy.peek()[0] <= time) {\n            const done = busy.pop();\n            free.push([done[1], done[2]]);\n        }\n\n        // Assign the lightest free server\n        const server = free.pop();\n        ans[j] = server[1];\n        busy.push([time + tasks[j], server[0], server[1]]);\n    }\n\n    return ans;\n}",
    "lineMap": {
      "init": [
        2,
        3,
        4
      ],
      "init_free_heap": [
        43,
        45
      ],
      "check_task": [
        51,
        52
      ],
      "check_free_empty": [
        55
      ],
      "fast_forward": [
        56
      ],
      "release_servers": [
        60,
        61,
        62
      ],
      "assign_server": [
        66,
        67,
        68
      ],
      "complete": [
        71
      ],
      "init_busy_heap": [
        48
      ]
    },
    "conditionalMap": {
      "free_empty": [
        55
      ]
    }
  }
};

const ProcessTasksUsingServersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "servers": [
        3,
        3,
        2
      ],
      "tasks": [
        1,
        2,
        3,
        2,
        1,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "servers": [
        5,
        1,
        4,
        3,
        2
      ],
      "tasks": [
        2,
        1,
        2,
        4,
        5,
        2,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "servers": [
        1,
        2
      ],
      "tasks": [
        3,
        3
      ]
    }
  }
];

function generateProcessTasksUsingServersSteps(e: any): any[] {
  
let t=e.servers??[],s=e.tasks??[],i=t.length,n=s.length,a=[],l=(0,r.createProcessTasksScene)(e,"heaps"),{recorder:o,writeTask:h,writeServer:f}=l;o.record("init",`${i} servers, ${n} tasks, ans not filled yet`);let p=new r.FreeHeap,u=new r.BusyHeap;for(let e=0;e<i;e++)p.push(t[e],e),f(e,{srvState:r.SRV_STATE.free});o.record("init_free_heap",`All ${i} servers start free, ordered by (weight, index)`),o.record("init_busy_heap","Busy heap starts empty");for(let e=0;e<n;e++){h(e,{taskState:r.TASK_STATE.current}),o.update_visual("ptr_j",{type:"pointer",position:e,label:"j",state:"active"}),o.update_variable("j",e),o.update_variable("taskDur",s[e]),o.update_variable("ans",[...a]);let t=e;o.update_variable("time",t),o.record("check_task",`Task ${e} (duration ${s[e]}) arrives at t = ${e}`);let i=p.isEmpty();o.set_conditionals([{key:"free_empty",result:i}]),o.record("check_free_empty",i?"No server is free right now":"At least one server is free"),i&&(t=u.peek()[0],o.update_variable("time",t),o.record("fast_forward",`Fast-forward time to t = ${t} (earliest release)`));let n=[];for(;!u.isEmpty()&&u.peek()[0]<=t;){let[,e,t]=u.pop();p.push(e,t),f(t,{srvState:r.SRV_STATE.free}),n.push(t)}o.update_variable("released",n.map(e=>`S${e}`).join(", ")),o.record("release_servers",n.length>0?`${n.map(e=>`S${e}`).join(", ")} finished by t = ${t}, back to free`:`Nothing has finished by t = ${t}`);let[l,c]=p.pop(),d=t+s[e];a.push(c),u.push(d,l,c),f(c,{srvState:r.SRV_STATE.busy,until:d}),h(e,{taskState:r.TASK_STATE.done,assigned:c}),o.update_variable("assignedIdx",c),o.update_variable("assignedWeight",l),o.update_variable("busyUntil",d),o.update_variable("ans",[...a]),o.record("assign_server",`S${c} (w = ${l}) takes task ${e}, busy until t = ${d}`)}return o.delete_visual("ptr_j"),o.record("complete",`Done: ans = [${a.join(", ")}]`),l.steps()
}

export function ProcessTasksUsingServersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ProcessTasksUsingServersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateProcessTasksUsingServersSteps(e) as any[];
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
      title="Process Tasks Using Servers"
      slug="process-tasks-using-servers"
      approaches={approaches}
      presets={ProcessTasksUsingServersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Single-Threaded CPU (single-threaded-cpu)
// ==========================================

const SingleThreadedCpuTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def getOrder(self, tasks: list[list[int]]) -> list[int]:\n        # Store (enqueueTime, processingTime, originalIndex) and sort\n        sorted_tasks = sorted(\n            [(enqueue, proc, idx) for idx, (enqueue, proc) in enumerate(tasks)]\n        )\n\n        result = []\n        heap = []  # Min-heap of (processingTime, originalIndex)\n        i = 0\n        n = len(tasks)\n        current_time = 0\n\n        while len(result) < n:\n            # Push all tasks that have arrived by current_time\n            while i < n and sorted_tasks[i][0] <= current_time:\n                enqueue, proc, idx = sorted_tasks[i]\n                heapq.heappush(heap, (proc, idx))\n                i += 1\n\n            if not heap:\n                # No available tasks, jump to next arrival\n                current_time = sorted_tasks[i][0]\n                while i < n and sorted_tasks[i][0] <= current_time:\n                    enqueue, proc, idx = sorted_tasks[i]\n                    heapq.heappush(heap, (proc, idx))\n                    i += 1\n\n            # Process the task with shortest processing time\n            proc_time, original_idx = heapq.heappop(heap)\n            result.append(original_idx)\n            current_time += proc_time\n\n        return result",
    "lineMap": {
      "sort_tasks": [
        4,
        5
      ],
      "init": [
        8,
        9,
        10,
        11,
        12
      ],
      "loop": [
        14
      ],
      "enqueue_tasks": [
        16,
        17,
        18,
        19
      ],
      "check_idle": [
        21
      ],
      "idle_jump": [
        23,
        24,
        25,
        26,
        27
      ],
      "process_task": [
        30,
        31,
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        14
      ],
      "heap_empty": [
        21
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] getOrder(int[][] tasks) {\n        int n = tasks.length;\n        // Store (enqueueTime, processingTime, originalIndex)\n        int[][] sorted = new int[n][3];\n        for (int i = 0; i < n; i++) {\n            sorted[i] = new int[]{tasks[i][0], tasks[i][1], i};\n        }\n        // Sort by enqueue time\n        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));\n\n        // Min-heap: order by (processingTime, originalIndex)\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> {\n            if (a[1] != b[1]) return Integer.compare(a[1], b[1]);\n            return Integer.compare(a[2], b[2]);\n        });\n\n        int[] result = new int[n];\n        int resultIdx = 0;\n        int i = 0;\n        long currentTime = 0;\n\n        while (resultIdx < n) {\n            // Push all tasks that have arrived by currentTime\n            while (i < n && sorted[i][0] <= currentTime) {\n                heap.offer(sorted[i]);\n                i++;\n            }\n\n            if (heap.isEmpty()) {\n                // No available tasks, jump to next arrival\n                currentTime = sorted[i][0];\n                while (i < n && sorted[i][0] <= currentTime) {\n                    heap.offer(sorted[i]);\n                    i++;\n                }\n            }\n\n            // Process the task with shortest processing time\n            int[] task = heap.poll();\n            result[resultIdx++] = task[2];\n            currentTime += task[1];\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "sort_tasks": [
        5,
        7,
        10
      ],
      "init": [
        18,
        19,
        20,
        21
      ],
      "loop": [
        23
      ],
      "enqueue_tasks": [
        25,
        26,
        27
      ],
      "check_idle": [
        30
      ],
      "idle_jump": [
        32,
        33,
        34,
        35
      ],
      "process_task": [
        40,
        41,
        42
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        23
      ],
      "heap_empty": [
        30
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] GetOrder(int[][] tasks) {\n        int n = tasks.Length;\n        var sorted = new int[n][];\n        for (int i = 0; i < n; i++) {\n            sorted[i] = new int[] { tasks[i][0], tasks[i][1], i };\n        }\n        Array.Sort(sorted, (a, b) => a[0].CompareTo(b[0]));\n\n        // Min-heap: order by (processingTime, originalIndex)\n        var heap = new PriorityQueue<int[], (int proc, int idx)>();\n\n        int[] result = new int[n];\n        int resultIdx = 0;\n        int ptr = 0;\n        long currentTime = 0;\n\n        while (resultIdx < n) {\n            while (ptr < n && sorted[ptr][0] <= currentTime) {\n                heap.Enqueue(sorted[ptr], (sorted[ptr][1], sorted[ptr][2]));\n                ptr++;\n            }\n\n            if (heap.Count == 0) {\n                currentTime = sorted[ptr][0];\n                while (ptr < n && sorted[ptr][0] <= currentTime) {\n                    heap.Enqueue(sorted[ptr], (sorted[ptr][1], sorted[ptr][2]));\n                    ptr++;\n                }\n            }\n\n            int[] task = heap.Dequeue();\n            result[resultIdx++] = task[2];\n            currentTime += task[1];\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "sort_tasks": [
        4,
        6,
        8
      ],
      "init": [
        13,
        14,
        15,
        16
      ],
      "loop": [
        18
      ],
      "enqueue_tasks": [
        19,
        20,
        21
      ],
      "check_idle": [
        24
      ],
      "idle_jump": [
        25,
        26,
        27,
        28
      ],
      "process_task": [
        32,
        33,
        34
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        18
      ],
      "heap_empty": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> getOrder(vector<vector<int>>& tasks) {\n        int n = tasks.size();\n        vector<array<int, 3>> sorted(n);\n        for (int i = 0; i < n; i++) {\n            sorted[i] = {tasks[i][0], tasks[i][1], i};\n        }\n        sort(sorted.begin(), sorted.end());\n\n        // Min-heap: (processingTime, originalIndex)\n        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> heap;\n\n        vector<int> result;\n        int i = 0;\n        long long currentTime = 0;\n\n        while ((int)result.size() < n) {\n            while (i < n && sorted[i][0] <= currentTime) {\n                heap.push({sorted[i][1], sorted[i][2]});\n                i++;\n            }\n\n            if (heap.empty()) {\n                currentTime = sorted[i][0];\n                while (i < n && sorted[i][0] <= currentTime) {\n                    heap.push({sorted[i][1], sorted[i][2]});\n                    i++;\n                }\n            }\n\n            auto [procTime, origIdx] = heap.top();\n            heap.pop();\n            result.push_back(origIdx);\n            currentTime += procTime;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "sort_tasks": [
        5,
        7,
        9
      ],
      "init": [
        12,
        14,
        15,
        16
      ],
      "loop": [
        18
      ],
      "enqueue_tasks": [
        19,
        20,
        21
      ],
      "check_idle": [
        24
      ],
      "idle_jump": [
        25,
        26,
        27,
        28
      ],
      "process_task": [
        32,
        33,
        34,
        35
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        18
      ],
      "heap_empty": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type task struct {\n    enqueue, proc, idx int\n}\n\nfunc getOrder(tasks [][]int) []int {\n    n := len(tasks)\n    sorted := make([]task, n)\n    for i := 0; i < n; i++ {\n        sorted[i] = task{tasks[i][0], tasks[i][1], i}\n    }\n    sort.Slice(sorted, func(a, b int) bool {\n        return sorted[a].enqueue < sorted[b].enqueue\n    })\n\n    h := &taskHeap{}\n    heap.Init(h)\n\n    result := make([]int, 0, n)\n    i := 0\n    currentTime := int64(0)\n\n    for len(result) < n {\n        for i < n && int64(sorted[i].enqueue) <= currentTime {\n            heap.Push(h, sorted[i])\n            i++\n        }\n\n        if h.Len() == 0 {\n            currentTime = int64(sorted[i].enqueue)\n            for i < n && int64(sorted[i].enqueue) <= currentTime {\n                heap.Push(h, sorted[i])\n                i++\n            }\n        }\n\n        t := heap.Pop(h).(task)\n        result = append(result, t.idx)\n        currentTime += int64(t.proc)\n    }\n\n    return result\n}\n\ntype taskHeap []task\n\nfunc (h taskHeap) Len() int { return len(h) }\nfunc (h taskHeap) Less(i, j int) bool {\n    if h[i].proc != h[j].proc {\n        return h[i].proc < h[j].proc\n    }\n    return h[i].idx < h[j].idx\n}\nfunc (h taskHeap) Swap(i, j int) { h[i], h[j] = h[j], h[i] }\nfunc (h *taskHeap) Push(x interface{}) {\n    *h = append(*h, x.(task))\n}\nfunc (h *taskHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}",
    "lineMap": {
      "sort_tasks": [
        7,
        9,
        11
      ],
      "init": [
        15,
        16,
        18,
        19,
        20
      ],
      "loop": [
        22
      ],
      "enqueue_tasks": [
        23,
        24,
        25
      ],
      "check_idle": [
        28
      ],
      "idle_jump": [
        29,
        30,
        31,
        32
      ],
      "process_task": [
        36,
        37,
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        22
      ],
      "heap_empty": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var getOrder = function(tasks) {\n    var n = tasks.length;\n    var sorted = tasks.map(function(t, i) { return [t[0], t[1], i]; });\n    sorted.sort(function(a, b) { return a[0] - b[0]; });\n\n    var heap = new MinHeap();\n    var result = [];\n    var i = 0;\n    var currentTime = 0;\n\n    while (result.length < n) {\n        while (i < n && sorted[i][0] <= currentTime) {\n            heap.push([sorted[i][1], sorted[i][2]]);\n            i++;\n        }\n\n        if (heap.size() === 0) {\n            currentTime = sorted[i][0];\n            while (i < n && sorted[i][0] <= currentTime) {\n                heap.push([sorted[i][1], sorted[i][2]]);\n                i++;\n            }\n        }\n\n        var task = heap.pop();\n        result.push(task[1]);\n        currentTime += task[0];\n    }\n\n    return result;\n};\n\nfunction MinHeap() {\n    this.data = [];\n}\nMinHeap.prototype.size = function() { return this.data.length; };\nMinHeap.prototype.push = function(val) {\n    this.data.push(val);\n    this._bubbleUp(this.data.length - 1);\n};\nMinHeap.prototype.pop = function() {\n    var top = this.data[0];\n    var last = this.data.pop();\n    if (this.data.length > 0) {\n        this.data[0] = last;\n        this._sinkDown(0);\n    }\n    return top;\n};\nMinHeap.prototype._compare = function(i, j) {\n    if (this.data[i][0] !== this.data[j][0]) return this.data[i][0] - this.data[j][0];\n    return this.data[i][1] - this.data[j][1];\n};\nMinHeap.prototype._bubbleUp = function(idx) {\n    while (idx > 0) {\n        var parent = (idx - 1) >> 1;\n        if (this._compare(idx, parent) < 0) {\n            var tmp = this.data[parent];\n            this.data[parent] = this.data[idx];\n            this.data[idx] = tmp;\n            idx = parent;\n        } else break;\n    }\n};\nMinHeap.prototype._sinkDown = function(idx) {\n    var length = this.data.length;\n    while (true) {\n        var smallest = idx;\n        var left = 2 * idx + 1;\n        var right = 2 * idx + 2;\n        if (left < length && this._compare(left, smallest) < 0) smallest = left;\n        if (right < length && this._compare(right, smallest) < 0) smallest = right;\n        if (smallest !== idx) {\n            var tmp = this.data[smallest];\n            this.data[smallest] = this.data[idx];\n            this.data[idx] = tmp;\n            idx = smallest;\n        } else break;\n    }\n};",
    "lineMap": {
      "sort_tasks": [
        3,
        4
      ],
      "init": [
        6,
        7,
        8,
        9
      ],
      "loop": [
        11
      ],
      "enqueue_tasks": [
        12,
        13,
        14
      ],
      "check_idle": [
        17
      ],
      "idle_jump": [
        18,
        19,
        20,
        21
      ],
      "process_task": [
        25,
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        11
      ],
      "heap_empty": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getOrder(tasks: number[][]): number[] {\n    const n = tasks.length;\n    const sorted = tasks.map((t, i) => [t[0], t[1], i]);\n    sorted.sort((a, b) => a[0] - b[0]);\n\n    const heap = new MinHeap();\n    const result: number[] = [];\n    let i = 0;\n    let currentTime = 0;\n\n    while (result.length < n) {\n        while (i < n && sorted[i][0] <= currentTime) {\n            heap.push([sorted[i][1], sorted[i][2]]);\n            i++;\n        }\n\n        if (heap.size() === 0) {\n            currentTime = sorted[i][0];\n            while (i < n && sorted[i][0] <= currentTime) {\n                heap.push([sorted[i][1], sorted[i][2]]);\n                i++;\n            }\n        }\n\n        const task = heap.pop();\n        result.push(task[1]);\n        currentTime += task[0];\n    }\n\n    return result;\n}\n\nclass MinHeap {\n    private data: number[][] = [];\n    size(): number { return this.data.length; }\n    push(val: number[]): void {\n        this.data.push(val);\n        this.bubbleUp(this.data.length - 1);\n    }\n    pop(): number[] {\n        const top = this.data[0];\n        const last = this.data.pop()!;\n        if (this.data.length > 0) {\n            this.data[0] = last;\n            this.sinkDown(0);\n        }\n        return top;\n    }\n    private compare(i: number, j: number): number {\n        if (this.data[i][0] !== this.data[j][0]) return this.data[i][0] - this.data[j][0];\n        return this.data[i][1] - this.data[j][1];\n    }\n    private bubbleUp(idx: number): void {\n        while (idx > 0) {\n            const parent = (idx - 1) >> 1;\n            if (this.compare(idx, parent) < 0) {\n                [this.data[parent], this.data[idx]] = [this.data[idx], this.data[parent]];\n                idx = parent;\n            } else break;\n        }\n    }\n    private sinkDown(idx: number): void {\n        const length = this.data.length;\n        while (true) {\n            let smallest = idx;\n            const left = 2 * idx + 1;\n            const right = 2 * idx + 2;\n            if (left < length && this.compare(left, smallest) < 0) smallest = left;\n            if (right < length && this.compare(right, smallest) < 0) smallest = right;\n            if (smallest !== idx) {\n                [this.data[smallest], this.data[idx]] = [this.data[idx], this.data[smallest]];\n                idx = smallest;\n            } else break;\n        }\n    }\n}",
    "lineMap": {
      "sort_tasks": [
        3,
        4
      ],
      "init": [
        6,
        7,
        8,
        9
      ],
      "loop": [
        11
      ],
      "enqueue_tasks": [
        12,
        13,
        14
      ],
      "check_idle": [
        17
      ],
      "idle_jump": [
        18,
        19,
        20,
        21
      ],
      "process_task": [
        25,
        26,
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "more_tasks": [
        11
      ],
      "heap_empty": [
        17
      ]
    }
  }
};

const SingleThreadedCpuPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "enqueueTimes": [
        1,
        2,
        3,
        4
      ],
      "processingTimes": [
        2,
        4,
        2,
        1
      ],
      "tasks": [
        [
          1,
          2
        ],
        [
          2,
          4
        ],
        [
          3,
          2
        ],
        [
          4,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Same Enqueue",
    "value": {
      "enqueueTimes": [
        7,
        7,
        7,
        7,
        7
      ],
      "processingTimes": [
        10,
        12,
        5,
        4,
        2
      ],
      "tasks": [
        [
          7,
          10
        ],
        [
          7,
          12
        ],
        [
          7,
          5
        ],
        [
          7,
          4
        ],
        [
          7,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "enqueueTimes": [
        5,
        7,
        9,
        6,
        5
      ],
      "processingTimes": [
        2,
        2,
        4,
        3,
        10
      ],
      "tasks": [
        [
          5,
          2
        ],
        [
          7,
          2
        ],
        [
          9,
          4
        ],
        [
          6,
          3
        ],
        [
          5,
          10
        ]
      ]
    }
  }
];

function generateSingleThreadedCpuSteps(e: any): any[] {
  
let t=(0,i.readTasks)(e),s=t.length,r=t.map((e,t)=>[e[0],e[1],t]);r.sort((e,t)=>e[0]-t[0]||e[2]-t[2]);let n=new Map;r.forEach(([,,e],t)=>n.set(e,t));let a=(0,i.createCpuScene)(t,"heap",e=>n.get(e)??e),{recorder:l,writeTask:o}=a;for(let e=0;e<s;e++)o(e,{taskState:i.TASK_STATE.future});l.record("sort_tasks","Sort tasks by enqueue time");let d=new i.TaskMinHeap,u=[],c=0,p=0;for(l.record("init",`Empty heap, t = 0, ${s} tasks to schedule`);u.length<s;){l.set_conditionals([{key:"more_tasks",result:!0}]),l.record("loop",`${u.length} of ${s} scheduled, keep going`);let e=[];for(;p<s&&r[p][0]<=c;){let[t,s,n]=r[p];d.push(t,s,n),o(n,{taskState:i.TASK_STATE.ready}),e.push(n),p++}l.update_variable("arrived",e.map(e=>`T${e}`).join(", ")),l.record("enqueue_tasks",e.length>0?`${e.map(e=>`T${e}`).join(", ")} arrived by t = ${c}`:`Nothing new has arrived by t = ${c}`);let t=d.isEmpty();if(l.set_conditionals([{key:"heap_empty",result:t}]),l.record("check_idle",t?"No ready task, the CPU is idle":"A ready task is waiting"),t){let e=c;c=r[p][0];let t=[];for(;p<s&&r[p][0]<=c;){let[e,s,n]=r[p];d.push(e,s,n),o(n,{taskState:i.TASK_STATE.ready}),t.push(n),p++}l.update_variable("time",c),l.update_variable("jumpFrom",e),l.update_variable("jumpTo",c),l.update_variable("arrived",t.map(e=>`T${e}`).join(", ")),l.record("idle_jump",`Jump t from ${e} to ${c}`)}let[,n,a]=d.pop(),h=c;c+=n,u.push(a),o(a,{taskState:i.TASK_STATE.done,start:h,end:c,order:u.length-1}),l.update_variable("time",c),l.update_variable("poppedIdx",a),l.update_variable("poppedProc",n),l.update_variable("result",[...u]),l.record("process_task",`Run T${a} (shortest proc = ${n}) from t = ${h} to t = ${c}`)}return l.set_conditionals([{key:"more_tasks",result:!1}]),l.record("complete",`Done. Order: [${u.join(", ")}]`),a.steps()
}

export function SingleThreadedCpuProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SingleThreadedCpuTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSingleThreadedCpuSteps(e) as any[];
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
      title="Single-Threaded CPU"
      slug="single-threaded-cpu"
      approaches={approaches}
      presets={SingleThreadedCpuPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// The Skyline Problem (the-skyline-problem)
// ==========================================

const TheSkylineProblemTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def getSkyline(self, buildings: list[list[int]]) -> list[list[int]]:\n        # Collect all critical x-coordinates\n        x_set = set()\n        for left, right, height in buildings:\n            x_set.add(left)\n            x_set.add(right)\n\n        result = []\n        prev_height = 0\n\n        # At each critical x, find the max height\n        for x in sorted(x_set):\n            max_height = 0\n            for left, right, height in buildings:\n                # Building covers x if left <= x < right\n                if left <= x < right:\n                    max_height = max(max_height, height)\n            if max_height != prev_height:\n                result.append([x, max_height])\n                prev_height = max_height\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "collect_x": [
        3,
        4,
        5,
        6,
        7
      ],
      "scan_x": [
        9,
        10,
        12,
        13,
        14
      ],
      "check_building": [
        15,
        16,
        17
      ],
      "covers": [
        17,
        18
      ],
      "skips": [
        17
      ],
      "add_point": [
        19,
        20,
        21
      ],
      "no_change": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "x_loop": [
        13
      ],
      "b_loop": [
        15
      ],
      "if_covers": [
        17
      ],
      "if_changed": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<List<Integer>> getSkyline(int[][] buildings) {\n        // Collect all critical x-coordinates\n        TreeSet<Integer> xSet = new TreeSet<>();\n        for (int[] b : buildings) {\n            xSet.add(b[0]);\n            xSet.add(b[1]);\n        }\n\n        List<List<Integer>> result = new ArrayList<>();\n        int prevHeight = 0;\n\n        // At each critical x, find the max height\n        for (int x : xSet) {\n            int maxHeight = 0;\n            for (int[] b : buildings) {\n                // Building covers x if left <= x < right\n                if (b[0] <= x && x < b[1]) {\n                    maxHeight = Math.max(maxHeight, b[2]);\n                }\n            }\n            if (maxHeight != prevHeight) {\n                result.add(List.of(x, maxHeight));\n                prevHeight = maxHeight;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "collect_x": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "scan_x": [
        10,
        11,
        13,
        14,
        15
      ],
      "check_building": [
        16,
        17,
        18
      ],
      "covers": [
        18,
        19
      ],
      "skips": [
        18
      ],
      "add_point": [
        22,
        23,
        24
      ],
      "no_change": [
        22
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "x_loop": [
        14
      ],
      "b_loop": [
        16
      ],
      "if_covers": [
        18
      ],
      "if_changed": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<vector<int>> getSkyline(vector<vector<int>>& buildings) {\n        // Collect all critical x-coordinates\n        set<int> xSet;\n        for (auto& b : buildings) {\n            xSet.insert(b[0]);\n            xSet.insert(b[1]);\n        }\n\n        vector<vector<int>> result;\n        int prevHeight = 0;\n\n        // At each critical x, find the max height\n        for (int x : xSet) {\n            int maxHeight = 0;\n            for (auto& b : buildings) {\n                if (b[0] <= x && x < b[1]) {\n                    maxHeight = max(maxHeight, b[2]);\n                }\n            }\n            if (maxHeight != prevHeight) {\n                result.push_back({x, maxHeight});\n                prevHeight = maxHeight;\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "collect_x": [
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "scan_x": [
        11,
        12,
        14,
        15,
        16
      ],
      "check_building": [
        17,
        18
      ],
      "covers": [
        18,
        19
      ],
      "skips": [
        18
      ],
      "add_point": [
        22,
        23,
        24
      ],
      "no_change": [
        22
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "x_loop": [
        15
      ],
      "b_loop": [
        17
      ],
      "if_covers": [
        18
      ],
      "if_changed": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<IList<int>> GetSkyline(int[][] buildings) {\n        // Collect all critical x-coordinates\n        SortedSet<int> xSet = new SortedSet<int>();\n        foreach (var b in buildings) {\n            xSet.Add(b[0]);\n            xSet.Add(b[1]);\n        }\n\n        IList<IList<int>> result = new List<IList<int>>();\n        int prevHeight = 0;\n\n        // At each critical x, find the max height\n        foreach (int x in xSet) {\n            int maxHeight = 0;\n            foreach (var b in buildings) {\n                if (b[0] <= x && x < b[1]) {\n                    maxHeight = Math.Max(maxHeight, b[2]);\n                }\n            }\n            if (maxHeight != prevHeight) {\n                result.Add(new List<int> { x, maxHeight });\n                prevHeight = maxHeight;\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "collect_x": [
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "scan_x": [
        10,
        11,
        13,
        14,
        15
      ],
      "check_building": [
        16,
        17
      ],
      "covers": [
        17,
        18
      ],
      "skips": [
        17
      ],
      "add_point": [
        21,
        22,
        23
      ],
      "no_change": [
        21
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "x_loop": [
        14
      ],
      "b_loop": [
        16
      ],
      "if_covers": [
        17
      ],
      "if_changed": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getSkyline(buildings [][]int) [][]int {\n    // Collect all critical x-coordinates\n    xMap := make(map[int]bool)\n    for _, b := range buildings {\n        xMap[b[0]] = true\n        xMap[b[1]] = true\n    }\n\n    xCoords := make([]int, 0, len(xMap))\n    for x := range xMap {\n        xCoords = append(xCoords, x)\n    }\n    sort.Ints(xCoords)\n\n    result := [][]int{}\n    prevHeight := 0\n\n    // At each critical x, find the max height\n    for _, x := range xCoords {\n        maxHeight := 0\n        for _, b := range buildings {\n            if b[0] <= x && x < b[1] {\n                if b[2] > maxHeight {\n                    maxHeight = b[2]\n                }\n            }\n        }\n        if maxHeight != prevHeight {\n            result = append(result, []int{x, maxHeight})\n            prevHeight = maxHeight\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "collect_x": [
        2,
        3,
        4,
        5,
        6,
        7,
        9,
        10,
        11,
        12,
        13
      ],
      "scan_x": [
        15,
        16,
        18,
        19,
        20
      ],
      "check_building": [
        21,
        22
      ],
      "covers": [
        22,
        23,
        24,
        25
      ],
      "skips": [
        22
      ],
      "add_point": [
        28,
        29,
        30,
        31
      ],
      "no_change": [
        28
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "x_loop": [
        19
      ],
      "b_loop": [
        21
      ],
      "if_covers": [
        22
      ],
      "if_changed": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var getSkyline = function(buildings) {\n    // Collect all critical x-coordinates\n    var xSet = new Set();\n    for (var b of buildings) {\n        xSet.add(b[0]);\n        xSet.add(b[1]);\n    }\n\n    var xCoords = Array.from(xSet).sort(function(a, b) { return a - b; });\n    var result = [];\n    var prevHeight = 0;\n\n    // At each critical x, find the max height\n    for (var x of xCoords) {\n        var maxHeight = 0;\n        for (var b of buildings) {\n            if (b[0] <= x && x < b[1]) {\n                maxHeight = Math.max(maxHeight, b[2]);\n            }\n        }\n        if (maxHeight !== prevHeight) {\n            result.push([x, maxHeight]);\n            prevHeight = maxHeight;\n        }\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "collect_x": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "scan_x": [
        9,
        10,
        11,
        13,
        14,
        15
      ],
      "check_building": [
        16,
        17
      ],
      "covers": [
        17,
        18
      ],
      "skips": [
        17
      ],
      "add_point": [
        21,
        22,
        23
      ],
      "no_change": [
        21
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "x_loop": [
        14
      ],
      "b_loop": [
        16
      ],
      "if_covers": [
        17
      ],
      "if_changed": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getSkyline(buildings: number[][]): number[][] {\n    // Collect all critical x-coordinates\n    const xSet = new Set<number>();\n    for (const b of buildings) {\n        xSet.add(b[0]);\n        xSet.add(b[1]);\n    }\n\n    const xCoords = Array.from(xSet).sort((a, b) => a - b);\n    const result: number[][] = [];\n    let prevHeight = 0;\n\n    // At each critical x, find the max height\n    for (const x of xCoords) {\n        let maxHeight = 0;\n        for (const b of buildings) {\n            if (b[0] <= x && x < b[1]) {\n                maxHeight = Math.max(maxHeight, b[2]);\n            }\n        }\n        if (maxHeight !== prevHeight) {\n            result.push([x, maxHeight]);\n            prevHeight = maxHeight;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "collect_x": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "scan_x": [
        9,
        10,
        11,
        13,
        14,
        15
      ],
      "check_building": [
        16,
        17
      ],
      "covers": [
        17,
        18
      ],
      "skips": [
        17
      ],
      "add_point": [
        21,
        22,
        23
      ],
      "no_change": [
        21
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "x_loop": [
        14
      ],
      "b_loop": [
        16
      ],
      "if_covers": [
        17
      ],
      "if_changed": [
        21
      ]
    }
  }
};

const TheSkylineProblemPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "buildings": [
        [
          2,
          9,
          10
        ],
        [
          3,
          7,
          15
        ],
        [
          5,
          12,
          12
        ],
        [
          15,
          20,
          10
        ],
        [
          19,
          24,
          8
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "buildings": [
        [
          0,
          2,
          3
        ],
        [
          2,
          5,
          3
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single",
    "value": {
      "buildings": [
        [
          1,
          5,
          10
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Nested",
    "value": {
      "buildings": [
        [
          1,
          10,
          5
        ],
        [
          2,
          8,
          8
        ],
        [
          3,
          6,
          12
        ]
      ]
    }
  }
];

function generateTheSkylineProblemSteps(e: any): any[] {
  
let t=e.buildings.map(e=>[...e]),i=new StepRecorder({},{});if(0===t.length)return i.record("complete","No buildings provided"),i.getSteps();t.forEach((e,t)=>{i.add_new_visual(`building_${t}`,{type:"range",start:e[0],end:e[1],label:`h=${e[2]}`})}),i.add_new_visual("meta_event",{type:"metadata",value:""}),i.add_new_visual("meta_heightmap",{type:"metadata",value:{entries:[[0,1]]}}),i.add_new_visual("meta_prevmax",{type:"metadata",value:0}),i.add_new_visual("meta_currentmax",{type:"metadata",value:0}),i.record("-","Find the skyline outline from building silhouettes");let n=[];for(let e=0;e<t.length;e++){let[i,a,r]=t[e];n.push([i,-r,e]),n.push([a,r,e])}i.update_visual("meta_event",{type:"metadata",value:`Created ${n.length} events from ${t.length} buildings`}),i.record("create_events",`Create start/end events for each building: ${n.length} events total`),n.sort((e,t)=>e[0]!==t[0]?e[0]-t[0]:e[1]-t[1]),i.update_visual("meta_event",{type:"metadata",value:"Events sorted by x-coordinate"}),i.record("sort_events","Sort events by x-coordinate, then by height (starts before ends at same x)");let s=new Map;s.set(0,1),i.update_visual("meta_heightmap",{type:"metadata",value:{entries:l(s)}}),i.record("init_height_map","Initialize the height map with ground level {0: 1}, prevMax = 0, and an empty result list");let o=[],h=0;i.add_new_visual("sweep_line",{type:"pointer",position:n.length>0?n[0][0]:0,label:`x=${n.length>0?n[0][0]:0}`});for(let e=0;e<n.length;e++){let[a,d,g]=n[e];i.update_visual("sweep_line",{type:"pointer",position:a,label:`x=${a}`});let u=d<0,c=Math.abs(d);if(t.forEach((e,t)=>{let a=i.get_visual(`building_${t}`);"result"!==(a&&"state"in a?a.state:void 0)&&i.update_visual(`building_${t}`,{type:"range",start:e[0],end:e[1],label:`h=${e[2]}`,state:t===g?"active":void 0})}),i.update_visual("meta_event",{type:"metadata",value:u?`Start event: building ${g} opens at x=${a}, height=${c}`:`End event: building ${g} closes at x=${a}, height=${c}`}),i.update_visual("meta_heightmap",{type:"metadata",value:{entries:l(s)}}),i.record("process_event",`Sweep to x=${a}: ${u?"start":"end"} of building with height ${c}`),u){let e=s.get(c)||0;s.set(c,e+1),i.update_visual("meta_heightmap",{type:"metadata",value:{entries:l(s),lastOp:{op:"add",h:c}}}),i.add_conditional("is_start",!0),i.record("start_event",`Add height ${c} to the height map${e>0?` (now ${e+1} active buildings at this height)`:""}: ${r(s)}`)}else{let e=s.get(c);1===e?s.delete(c):s.set(c,e-1),i.update_visual("meta_heightmap",{type:"metadata",value:{entries:l(s),lastOp:{op:"remove",h:c}}}),i.add_conditional("is_start",!1),i.record("end_event",1===e?`Remove height ${c} from the height map entirely, no building at that height remains: ${r(s)}`:`Decrement height ${c}'s count to ${e-1}, another building still holds it: ${r(s)}`)}let p=Math.max(...s.keys());i.update_visual("meta_currentmax",{type:"metadata",value:p}),i.record("check_max",`Current max height = ${p}, previous max = ${h}`),p!==h?(o.push([a,p]),h=p,i.add_new_visual(`result_${o.length-1}`,{type:"arrayElement",value:`[${a},${p}]`,position:o.length-1,state:"result"}),i.update_visual("meta_prevmax",{type:"metadata",value:h}),i.update_visual("meta_event",{type:"metadata",value:`Max changed! Added [${a}, ${p}] to result`}),i.add_conditional("max_changed",!0),i.record("add_result",`Max height changed to ${p}. Add key point [${a}, ${p}] to result`)):(i.update_visual("meta_event",{type:"metadata",value:`Current max ${p} equals prevMax ${h}, no key point added`}),i.add_conditional("max_changed",!1),i.record("no_change",`Max height ${p} unchanged. No key point added`))}return t.forEach((e,t)=>{i.update_visual(`building_${t}`,{type:"range",start:e[0],end:e[1],label:`h=${e[2]}`})}),i.delete_visual("sweep_line"),i.update_visual("meta_heightmap",{type:"metadata",value:{entries:l(s)}}),i.update_visual("meta_event",{type:"metadata",value:`Skyline has ${o.length} key points`}),i.record("complete",`Done! Skyline outline: [${o.map(e=>`[${e[0]},${e[1]}]`).join(", ")}]`),i.getSteps()
}

export function TheSkylineProblemProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TheSkylineProblemTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTheSkylineProblemSteps(e) as any[];
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
      title="The Skyline Problem"
      slug="the-skyline-problem"
      approaches={approaches}
      presets={TheSkylineProblemPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sliding Window Median (sliding-window-median)
// ==========================================

const SlidingWindowMedianTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def medianSlidingWindow(self, nums: list[int], k: int) -> list[float]:\n        # Max-heap for smaller half (negate values since heapq is min-heap)\n        small = []\n        # Min-heap for larger half\n        large = []\n        delayed = defaultdict(int)\n        n = len(nums)\n        result = []\n\n        def prune_heap(heap, is_max_heap):\n            while heap:\n                val = -heap[0] if is_max_heap else heap[0]\n                if delayed.get(val, 0) > 0:\n                    heapq.heappop(heap)\n                    delayed[val] -= 1\n                    if delayed[val] == 0:\n                        del delayed[val]\n                else:\n                    break\n\n        def get_median():\n            if k % 2 == 1:\n                return float(-small[0])\n            return (-small[0] + large[0]) / 2.0\n\n        # Build initial window\n        for i in range(k):\n            heapq.heappush(small, -nums[i])\n        # Balance: move top half from small to large\n        for _ in range(k // 2):\n            heapq.heappush(large, -heapq.heappop(small))\n\n        result.append(get_median())\n\n        for i in range(k, n):\n            outgoing = nums[i - k]\n            incoming = nums[i]\n\n            # Mark outgoing for lazy deletion\n            delayed[outgoing] += 1\n\n            # Determine which heap the outgoing element belongs to\n            balance = 0\n            if outgoing <= -small[0]:\n                balance -= 1\n            else:\n                balance += 1\n\n            # Add incoming to appropriate heap\n            if small and incoming <= -small[0]:\n                heapq.heappush(small, -incoming)\n                balance += 1\n            else:\n                heapq.heappush(large, incoming)\n                balance -= 1\n\n            # Rebalance\n            if balance > 0:\n                heapq.heappush(large, -heapq.heappop(small))\n            elif balance < 0:\n                heapq.heappush(small, -heapq.heappop(large))\n\n            # Prune tops of both heaps\n            prune_heap(small, True)\n            prune_heap(large, False)\n\n            result.append(get_median())\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "build_initial": [
        28,
        29
      ],
      "split_half": [
        31,
        32
      ],
      "compute_median": [
        34
      ],
      "mark_outgoing": [
        37,
        38,
        41,
        44,
        45,
        46,
        47,
        48
      ],
      "insert_incoming": [
        51,
        52,
        53,
        54,
        55,
        56
      ],
      "rebalance": [
        59,
        60,
        61,
        62
      ],
      "compute_median_loop": [
        65,
        66,
        68
      ],
      "complete": [
        70
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public double[] medianSlidingWindow(int[] nums, int k) {\n        // Max-heap for smaller half (negate values to use min-heap as max-heap)\n        PriorityQueue<Long> small = new PriorityQueue<>(Collections.reverseOrder());\n        // Min-heap for larger half\n        PriorityQueue<Long> large = new PriorityQueue<>();\n        Map<Long, Integer> delayed = new HashMap<>();\n        int n = nums.length;\n        double[] result = new double[n - k + 1];\n\n        // Build initial window\n        for (int i = 0; i < k; i++) {\n            small.offer((long) nums[i]);\n        }\n        // Balance: move top half from small to large\n        for (int i = 0; i < k / 2; i++) {\n            large.offer(small.poll());\n        }\n\n        result[0] = getMedian(small, large, k);\n\n        for (int i = k; i < n; i++) {\n            long outgoing = nums[i - k];\n            long incoming = nums[i];\n\n            // Mark outgoing for lazy deletion\n            delayed.merge(outgoing, 1, Integer::sum);\n\n            // Determine which heap the outgoing element belongs to\n            int balance = 0;\n            if (outgoing <= small.peek()) {\n                balance--;\n            } else {\n                balance++;\n            }\n\n            // Add incoming to appropriate heap\n            if (!small.isEmpty() && incoming <= small.peek()) {\n                small.offer(incoming);\n                balance++;\n            } else {\n                large.offer(incoming);\n                balance--;\n            }\n\n            // Rebalance\n            if (balance > 0) {\n                large.offer(small.poll());\n            } else if (balance < 0) {\n                small.offer(large.poll());\n            }\n\n            // Prune tops of both heaps\n            pruneHeap(small, delayed);\n            pruneHeap(large, delayed);\n\n            result[i - k + 1] = getMedian(small, large, k);\n        }\n        return result;\n    }\n\n    private void pruneHeap(PriorityQueue<Long> heap, Map<Long, Integer> delayed) {\n        while (!heap.isEmpty() && delayed.containsKey(heap.peek())) {\n            long val = heap.poll();\n            int count = delayed.get(val);\n            if (count == 1) {\n                delayed.remove(val);\n            } else {\n                delayed.put(val, count - 1);\n            }\n        }\n    }\n\n    private double getMedian(PriorityQueue<Long> small, PriorityQueue<Long> large, int k) {\n        if (k % 2 == 1) {\n            return small.peek();\n        }\n        return small.peek() / 2.0 + large.peek() / 2.0;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_initial": [
        12,
        13
      ],
      "split_half": [
        16,
        17
      ],
      "compute_median": [
        20
      ],
      "mark_outgoing": [
        23,
        24,
        27,
        30,
        31,
        32,
        33,
        34,
        35
      ],
      "insert_incoming": [
        38,
        39,
        40,
        41,
        42,
        43,
        44
      ],
      "rebalance": [
        47,
        48,
        49,
        50,
        51
      ],
      "compute_median_loop": [
        54,
        55,
        57
      ],
      "complete": [
        59
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<double> medianSlidingWindow(vector<int>& nums, int k) {\n        // Max-heap for smaller half\n        priority_queue<int> small;\n        // Min-heap for larger half\n        priority_queue<int, vector<int>, greater<int>> large;\n        unordered_map<int, int> delayed;\n        int n = nums.size();\n        vector<double> result;\n\n        // Build initial window\n        for (int i = 0; i < k; i++) {\n            small.push(nums[i]);\n        }\n        // Balance: move top half from small to large\n        for (int i = 0; i < k / 2; i++) {\n            large.push(small.top());\n            small.pop();\n        }\n\n        result.push_back(getMedian(small, large, k));\n\n        for (int i = k; i < n; i++) {\n            int outgoing = nums[i - k];\n            int incoming = nums[i];\n\n            // Mark outgoing for lazy deletion\n            delayed[outgoing]++;\n\n            // Determine which heap the outgoing element belongs to\n            int balance = 0;\n            if (outgoing <= small.top()) {\n                balance--;\n            } else {\n                balance++;\n            }\n\n            // Add incoming to appropriate heap\n            if (!small.empty() && incoming <= small.top()) {\n                small.push(incoming);\n                balance++;\n            } else {\n                large.push(incoming);\n                balance--;\n            }\n\n            // Rebalance\n            if (balance > 0) {\n                large.push(small.top());\n                small.pop();\n            } else if (balance < 0) {\n                small.push(large.top());\n                large.pop();\n            }\n\n            // Prune tops of both heaps\n            pruneHeap(small, delayed);\n            pruneHeap(large, delayed);\n\n            result.push_back(getMedian(small, large, k));\n        }\n        return result;\n    }\n\nprivate:\n    // Works for both heap types since only top(), pop(), and empty() are used\n    template <typename Heap>\n    void pruneHeap(Heap& heap, unordered_map<int, int>& delayed) {\n        while (!heap.empty() && delayed.count(heap.top())) {\n            int val = heap.top();\n            heap.pop();\n            if (--delayed[val] == 0) {\n                delayed.erase(val);\n            }\n        }\n    }\n\n    double getMedian(priority_queue<int>& small,\n                     priority_queue<int, vector<int>, greater<int>>& large, int k) {\n        if (k % 2 == 1) {\n            return small.top();\n        }\n        return small.top() / 2.0 + large.top() / 2.0;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "build_initial": [
        13,
        14
      ],
      "split_half": [
        17,
        18,
        19
      ],
      "compute_median": [
        22
      ],
      "mark_outgoing": [
        25,
        26,
        29,
        32,
        33,
        34,
        35,
        36,
        37
      ],
      "insert_incoming": [
        40,
        41,
        42,
        43,
        44,
        45,
        46
      ],
      "rebalance": [
        49,
        50,
        51,
        52,
        53,
        54,
        55
      ],
      "compute_median_loop": [
        58,
        59,
        61
      ],
      "complete": [
        63
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public double[] MedianSlidingWindow(int[] nums, int k) {\n        // Max-heap for smaller half (reverse comparer)\n        PriorityQueue<int, int> small = new PriorityQueue<int, int>(Comparer<int>.Create((a, b) => b.CompareTo(a)));\n        // Min-heap for larger half\n        PriorityQueue<int, int> large = new PriorityQueue<int, int>();\n        Dictionary<int, int> delayed = new Dictionary<int, int>();\n        int n = nums.Length;\n        double[] result = new double[n - k + 1];\n\n        // Build initial window\n        for (int i = 0; i < k; i++) {\n            small.Enqueue(nums[i], nums[i]);\n        }\n        // Balance: move top half from small to large\n        for (int i = 0; i < k / 2; i++) {\n            int top = small.Dequeue();\n            large.Enqueue(top, top);\n        }\n\n        result[0] = GetMedian(small, large, k);\n\n        for (int i = k; i < n; i++) {\n            int outgoing = nums[i - k];\n            int incoming = nums[i];\n\n            // Mark outgoing for lazy deletion\n            delayed[outgoing] = delayed.GetValueOrDefault(outgoing) + 1;\n\n            // Determine which heap the outgoing element belongs to\n            int balance = 0;\n            if (outgoing <= small.Peek()) {\n                balance--;\n            } else {\n                balance++;\n            }\n\n            // Add incoming to appropriate heap\n            if (small.Count > 0 && incoming <= small.Peek()) {\n                small.Enqueue(incoming, incoming);\n                balance++;\n            } else {\n                large.Enqueue(incoming, incoming);\n                balance--;\n            }\n\n            // Rebalance\n            if (balance > 0) {\n                int top = small.Dequeue();\n                large.Enqueue(top, top);\n            } else if (balance < 0) {\n                int top = large.Dequeue();\n                small.Enqueue(top, top);\n            }\n\n            // Prune tops of both heaps\n            PruneHeap(small, delayed);\n            PruneHeap(large, delayed);\n\n            result[i - k + 1] = GetMedian(small, large, k);\n        }\n        return result;\n    }\n\n    private void PruneHeap(PriorityQueue<int, int> heap, Dictionary<int, int> delayed) {\n        while (heap.Count > 0 && delayed.ContainsKey(heap.Peek())) {\n            int val = heap.Dequeue();\n            if (delayed[val] == 1) {\n                delayed.Remove(val);\n            } else {\n                delayed[val]--;\n            }\n        }\n    }\n\n    private double GetMedian(PriorityQueue<int, int> small, PriorityQueue<int, int> large, int k) {\n        if (k % 2 == 1) {\n            return small.Peek();\n        }\n        return small.Peek() / 2.0 + large.Peek() / 2.0;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "build_initial": [
        12,
        13
      ],
      "split_half": [
        16,
        17,
        18
      ],
      "compute_median": [
        21
      ],
      "mark_outgoing": [
        24,
        25,
        28,
        31,
        32,
        33,
        34,
        35,
        36
      ],
      "insert_incoming": [
        39,
        40,
        41,
        42,
        43,
        44,
        45
      ],
      "rebalance": [
        48,
        49,
        50,
        51,
        52,
        53,
        54
      ],
      "compute_median_loop": [
        57,
        58,
        60
      ],
      "complete": [
        62
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MaxHeap []int\nfunc (h MaxHeap) Len() int            { return len(h) }\nfunc (h MaxHeap) Less(i, j int) bool   { return h[i] > h[j] }\nfunc (h MaxHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MaxHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MaxHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    val := old[n-1]\n    *h = old[:n-1]\n    return val\n}\n\ntype MinHeap []int\nfunc (h MinHeap) Len() int            { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool   { return h[i] < h[j] }\nfunc (h MinHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{})  { *h = append(*h, x.(int)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    val := old[n-1]\n    *h = old[:n-1]\n    return val\n}\n\nfunc medianSlidingWindow(nums []int, k int) []float64 {\n    // Max-heap for smaller half\n    small := &MaxHeap{}\n    // Min-heap for larger half\n    large := &MinHeap{}\n    delayed := make(map[int]int)\n    n := len(nums)\n    result := make([]float64, 0, n-k+1)\n\n    // Build initial window\n    for i := 0; i < k; i++ {\n        heap.Push(small, nums[i])\n    }\n    // Balance: move top half from small to large\n    for i := 0; i < k/2; i++ {\n        heap.Push(large, heap.Pop(small))\n    }\n\n    result = append(result, getMedian(small, large, k))\n\n    for i := k; i < n; i++ {\n        outgoing := nums[i-k]\n        incoming := nums[i]\n\n        // Mark outgoing for lazy deletion\n        delayed[outgoing]++\n\n        // Determine which heap the outgoing element belongs to\n        balance := 0\n        if outgoing <= (*small)[0] {\n            balance--\n        } else {\n            balance++\n        }\n\n        // Add incoming to appropriate heap\n        if small.Len() > 0 && incoming <= (*small)[0] {\n            heap.Push(small, incoming)\n            balance++\n        } else {\n            heap.Push(large, incoming)\n            balance--\n        }\n\n        // Rebalance\n        if balance > 0 {\n            heap.Push(large, heap.Pop(small))\n        } else if balance < 0 {\n            heap.Push(small, heap.Pop(large))\n        }\n\n        // Prune tops of both heaps\n        pruneMax(small, delayed)\n        pruneMin(large, delayed)\n\n        result = append(result, getMedian(small, large, k))\n    }\n    return result\n}\n\nfunc pruneMax(h *MaxHeap, delayed map[int]int) {\n    for h.Len() > 0 && delayed[(*h)[0]] > 0 {\n        val := heap.Pop(h).(int)\n        delayed[val]--\n        if delayed[val] == 0 {\n            delete(delayed, val)\n        }\n    }\n}\n\nfunc pruneMin(h *MinHeap, delayed map[int]int) {\n    for h.Len() > 0 && delayed[(*h)[0]] > 0 {\n        val := heap.Pop(h).(int)\n        delayed[val]--\n        if delayed[val] == 0 {\n            delete(delayed, val)\n        }\n    }\n}\n\nfunc getMedian(small *MaxHeap, large *MinHeap, k int) float64 {\n    if k%2 == 1 {\n        return float64((*small)[0])\n    }\n    return float64((*small)[0])/2.0 + float64((*large)[0])/2.0\n}",
    "lineMap": {
      "-": [
        27
      ],
      "build_initial": [
        37,
        38
      ],
      "split_half": [
        41,
        42
      ],
      "compute_median": [
        45
      ],
      "mark_outgoing": [
        48,
        49,
        52,
        55,
        56,
        57,
        58,
        59,
        60
      ],
      "insert_incoming": [
        63,
        64,
        65,
        66,
        67,
        68,
        69
      ],
      "rebalance": [
        72,
        73,
        74,
        75,
        76
      ],
      "compute_median_loop": [
        79,
        80,
        82
      ],
      "complete": [
        84
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var medianSlidingWindow = function(nums, k) {\n    // Max-heap for smaller half (negate values, heap helpers are min-heap)\n    var small = [];\n    // Min-heap for larger half\n    var large = [];\n    var delayed = new Map();\n    var n = nums.length;\n    var result = [];\n\n    // Build initial window\n    for (var i = 0; i < k; i++) {\n        heapPush(small, -nums[i]);\n    }\n    // Balance: move top half from small to large\n    for (var j = 0; j < Math.floor(k / 2); j++) {\n        heapPush(large, -heapPop(small));\n    }\n\n    result.push(getMedian(small, large, k));\n\n    for (var i = k; i < n; i++) {\n        var outgoing = nums[i - k];\n        var incoming = nums[i];\n\n        // Mark outgoing for lazy deletion\n        delayed.set(outgoing, (delayed.get(outgoing) || 0) + 1);\n\n        // Determine which heap the outgoing element belongs to\n        var balance = 0;\n        if (outgoing <= -small[0]) {\n            balance--;\n        } else {\n            balance++;\n        }\n\n        // Add incoming to appropriate heap\n        if (small.length > 0 && incoming <= -small[0]) {\n            heapPush(small, -incoming);\n            balance++;\n        } else {\n            heapPush(large, incoming);\n            balance--;\n        }\n\n        // Rebalance\n        if (balance > 0) {\n            heapPush(large, -heapPop(small));\n        } else if (balance < 0) {\n            heapPush(small, -heapPop(large));\n        }\n\n        // Prune tops of both heaps\n        pruneHeap(small, delayed, true);\n        pruneHeap(large, delayed, false);\n\n        result.push(getMedian(small, large, k));\n    }\n    return result;\n};\n\nfunction pruneHeap(heap, delayed, isMaxHeap) {\n    while (heap.length > 0) {\n        var val = isMaxHeap ? -heap[0] : heap[0];\n        if (!delayed.has(val)) break;\n        heapPop(heap);\n        if (delayed.get(val) === 1) {\n            delayed.delete(val);\n        } else {\n            delayed.set(val, delayed.get(val) - 1);\n        }\n    }\n}\n\nfunction getMedian(small, large, k) {\n    if (k % 2 === 1) {\n        return -small[0];\n    }\n    return -small[0] / 2.0 + large[0] / 2.0;\n}\n\n// Min-heap helper functions\nfunction heapPush(heap, val) {\n    heap.push(val);\n    var i = heap.length - 1;\n    while (i > 0) {\n        var parent = Math.floor((i - 1) / 2);\n        if (heap[parent] <= heap[i]) break;\n        var temp = heap[parent];\n        heap[parent] = heap[i];\n        heap[i] = temp;\n        i = parent;\n    }\n}\n\nfunction heapPop(heap) {\n    var top = heap[0];\n    var last = heap.pop();\n    if (heap.length > 0) {\n        heap[0] = last;\n        var i = 0;\n        while (true) {\n            var left = 2 * i + 1;\n            var right = 2 * i + 2;\n            var smallest = i;\n            if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n            if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n            if (smallest === i) break;\n            var temp = heap[i];\n            heap[i] = heap[smallest];\n            heap[smallest] = temp;\n            i = smallest;\n        }\n    }\n    return top;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_initial": [
        11,
        12
      ],
      "split_half": [
        15,
        16
      ],
      "compute_median": [
        19
      ],
      "mark_outgoing": [
        22,
        23,
        26,
        29,
        30,
        31,
        32,
        33,
        34
      ],
      "insert_incoming": [
        37,
        38,
        39,
        40,
        41,
        42,
        43
      ],
      "rebalance": [
        46,
        47,
        48,
        49,
        50
      ],
      "compute_median_loop": [
        53,
        54,
        56
      ],
      "complete": [
        58
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function medianSlidingWindow(nums: number[], k: number): number[] {\n    // Max-heap for smaller half (negate values, heap helpers are min-heap)\n    const small: number[] = [];\n    // Min-heap for larger half\n    const large: number[] = [];\n    const delayed = new Map<number, number>();\n    const n = nums.length;\n    const result: number[] = [];\n\n    // Build initial window\n    for (let i = 0; i < k; i++) {\n        heapPush(small, -nums[i]);\n    }\n    // Balance: move top half from small to large\n    for (let i = 0; i < Math.floor(k / 2); i++) {\n        heapPush(large, -heapPop(small));\n    }\n\n    result.push(getMedian(small, large, k));\n\n    for (let i = k; i < n; i++) {\n        const outgoing = nums[i - k];\n        const incoming = nums[i];\n\n        // Mark outgoing for lazy deletion\n        delayed.set(outgoing, (delayed.get(outgoing) ?? 0) + 1);\n\n        // Determine which heap the outgoing element belongs to\n        let balance = 0;\n        if (outgoing <= -small[0]) {\n            balance--;\n        } else {\n            balance++;\n        }\n\n        // Add incoming to appropriate heap\n        if (small.length > 0 && incoming <= -small[0]) {\n            heapPush(small, -incoming);\n            balance++;\n        } else {\n            heapPush(large, incoming);\n            balance--;\n        }\n\n        // Rebalance\n        if (balance > 0) {\n            heapPush(large, -heapPop(small));\n        } else if (balance < 0) {\n            heapPush(small, -heapPop(large));\n        }\n\n        // Prune tops of both heaps\n        pruneHeap(small, delayed, true);\n        pruneHeap(large, delayed, false);\n\n        result.push(getMedian(small, large, k));\n    }\n    return result;\n}\n\nfunction pruneHeap(heap: number[], delayed: Map<number, number>, isMaxHeap: boolean): void {\n    while (heap.length > 0) {\n        const val = isMaxHeap ? -heap[0] : heap[0];\n        if (!delayed.has(val)) break;\n        heapPop(heap);\n        if (delayed.get(val) === 1) {\n            delayed.delete(val);\n        } else {\n            delayed.set(val, delayed.get(val)! - 1);\n        }\n    }\n}\n\nfunction getMedian(small: number[], large: number[], k: number): number {\n    if (k % 2 === 1) {\n        return -small[0];\n    }\n    return -small[0] / 2.0 + large[0] / 2.0;\n}\n\n// Min-heap helper functions\nfunction heapPush(heap: number[], val: number): void {\n    heap.push(val);\n    let i = heap.length - 1;\n    while (i > 0) {\n        const parent = Math.floor((i - 1) / 2);\n        if (heap[parent] <= heap[i]) break;\n        [heap[parent], heap[i]] = [heap[i], heap[parent]];\n        i = parent;\n    }\n}\n\nfunction heapPop(heap: number[]): number {\n    const top = heap[0];\n    const last = heap.pop()!;\n    if (heap.length > 0) {\n        heap[0] = last;\n        let i = 0;\n        while (true) {\n            const left = 2 * i + 1;\n            const right = 2 * i + 2;\n            let smallest = i;\n            if (left < heap.length && heap[left] < heap[smallest]) smallest = left;\n            if (right < heap.length && heap[right] < heap[smallest]) smallest = right;\n            if (smallest === i) break;\n            [heap[i], heap[smallest]] = [heap[smallest], heap[i]];\n            i = smallest;\n        }\n    }\n    return top;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_initial": [
        11,
        12
      ],
      "split_half": [
        15,
        16
      ],
      "compute_median": [
        19
      ],
      "mark_outgoing": [
        22,
        23,
        26,
        29,
        30,
        31,
        32,
        33,
        34
      ],
      "insert_incoming": [
        37,
        38,
        39,
        40,
        41,
        42,
        43
      ],
      "rebalance": [
        46,
        47,
        48,
        49,
        50
      ],
      "compute_median_loop": [
        53,
        54,
        56
      ],
      "complete": [
        58
      ]
    }
  }
};

const SlidingWindowMedianPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        3,
        -1,
        -3,
        5,
        3,
        6,
        7
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        2,
        3,
        1,
        4,
        2
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Small k=2",
    "value": {
      "nums": [
        1,
        4,
        2,
        3
      ],
      "k": 2
    }
  }
];

function generateSlidingWindowMedianSteps(e: any): any[] {
  class n{constructor(e){this.above=e,this.heap=[]}push(e,a){this.heap.push([e,a]),this.bubbleUp(this.heap.length-1)}pop(){if(0===this.heap.length)return;if(1===this.heap.length)return this.heap.pop();let e=this.heap[0];return this.heap[0]=this.heap.pop(),this.bubbleDown(0),e}peek(){return this.heap[0]}size(){return this.heap.length}items(){return this.heap}has(e){return this.heap.some(([,a])=>a===e)}removeByKey(e){let a=this.heap.findIndex(([,a])=>a===e);if(-1===a)return;let t=this.heap[a],l=this.heap.pop();return a<this.heap.length&&(this.heap[a]=l,this.bubbleUp(a),this.bubbleDown(a)),t}bubbleUp(e){for(;e>0;){let a=Math.floor((e-1)/2);if(!this.above(this.heap[e][0],this.heap[a][0]))break;[this.heap[e],this.heap[a]]=[this.heap[a],this.heap[e]],e=a}}bubbleDown(e){for(;;){let a=e,t=2*e+1,l=2*e+2;if(t<this.heap.length&&this.above(this.heap[t][0],this.heap[a][0])&&(a=t),l<this.heap.length&&this.above(this.heap[l][0],this.heap[a][0])&&(a=l),a===e)break;[this.heap[e],this.heap[a]]=[this.heap[a],this.heap[e]],e=a}}}let i=e=>Number.isInteger(e)?`${e}`:e.toFixed(1);
let a=e.nums,t=e.k,r=a.length,o=a.reduce((e,a,t)=>(e[`elem_${t}`]={type:"arrayElement",value:a,position:t},e),{}),s=new StepRecorder({k:t,n:r},{...o});s.record("-",`Start: slide a window of k = ${t} over nums, tracking each window's median`);let p=new n((e,a)=>e>a),u=new n((e,a)=>e<a),h=()=>{p.items().forEach(([e,a],t)=>{s.update_visual(a,{type:"arrayElement",value:e,position:t,zone:"max",slot:t})}),u.items().forEach(([e,a],t)=>{s.update_visual(a,{type:"arrayElement",value:e,position:t,zone:"min",slot:t})}),s.update_variable("maxSize",p.size()),s.update_variable("minSize",u.size()),s.update_variable("maxTop",p.peek()?.[0]??null),s.update_variable("minTop",u.peek()?.[0]??null)};for(let e=0;e<t;e++)p.push(a[e],`card_${e}`);h(),s.update_variable("left",0),s.update_variable("right",t-1),s.record("build_initial",`First window [0..${t-1}]: push all ${t} values into the max-heap`);let d=[];for(let e=0;e<Math.floor(t/2);e++){let[e,a]=p.pop();u.push(e,a),d.push(a)}h(),s.update_variable("movedKeys",d),s.record("split_half",`Move the ${Math.floor(t/2)} largest into the min-heap → balanced halves`);let m=(e,a)=>{let t=p.size()>u.size()?p.peek()[0]:(p.peek()[0]+u.peek()[0])/2,l=p.size()>u.size();return s.update_variable("median",t),s.update_variable("medianOdd",l),s.update_variable("medianKey",`result_${e}`),s.update_variable("windowIndex",e),s.update_visual(`result_${e}`,{type:"arrayElement",value:t,position:e,zone:"median",slot:e}),s.record(a,l?`Median = top of max-heap = ${i(t)}`:`Median = (${p.peek()[0]} + ${u.peek()[0]}) / 2 = ${i(t)}`),t},c=[m(0,"compute_median")];for(let e=t;e<r;e++){let l=e-t+1,n=e-t,i=`card_${n}`,r=a[n],o=a[e],d=p.has(i)?"max":"min";("max"===d?p:u).removeByKey(i),s.delete_visual(i),h(),s.update_variable("outIdx",n),s.update_variable("outVal",r),s.update_variable("outSide",d),s.record("mark_outgoing",`Slide: nums[${n}] = ${r} leaves the window → remove it from the ${"max"===d?"max":"min"}-heap`);let g=p.peek()?.[0]??null,f=p.size()>0&&o<=g;if((f?p:u).push(o,`card_${e}`),h(),s.update_variable("left",l),s.update_variable("right",e),s.update_variable("inIdx",e),s.update_variable("inVal",o),s.update_variable("cmpTop",g),s.update_variable("inSide",f?"max":"min"),s.record("insert_incoming",null===g?`nums[${e}] = ${o} enters the window → lower half is empty, add to max-heap`:f?`nums[${e}] = ${o} enters the window → ${o} ≤ ${g}, add to max-heap`:`nums[${e}] = ${o} enters the window → ${o} > ${g}, add to min-heap`),p.size()>u.size()+1){let[e,a]=p.pop();u.push(e,a),h(),s.update_variable("movedKey",a),s.update_variable("movedVal",e),s.update_variable("movedTo","min"),s.record("rebalance",`Lower half too big → move its top ${e} to the min-heap`)}else if(u.size()>p.size()){let[e,a]=u.pop();p.push(e,a),h(),s.update_variable("movedKey",a),s.update_variable("movedVal",e),s.update_variable("movedTo","max"),s.record("rebalance",`Upper half bigger → move its top ${e} to the max-heap`)}c.push(m(l,"compute_median_loop"))}return s.update_variable("medianKey",null),s.update_variable("result",c),s.record("complete",`Done: medians = [${c.map(i).join(", ")}]`),s.getSteps()
}

export function SlidingWindowMedianProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SlidingWindowMedianTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSlidingWindowMedianSteps(e) as any[];
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
      title="Sliding Window Median"
      slug="sliding-window-median"
      approaches={approaches}
      presets={SlidingWindowMedianPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Smallest Range Covering Elements from K Lists (smallest-range-covering-elements-from-k-lists)
// ==========================================

const SmallestRangeCoveringElementsFromKListsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def smallestRange(self, nums: list[list[int]]) -> list[int]:\n        k = len(nums)\n        # Min-heap: (value, listIndex, elementIndex)\n        heap = []\n        current_max = float('-inf')\n\n        # Initialize heap with first element from each list\n        for i in range(k):\n            heapq.heappush(heap, (nums[i][0], i, 0))\n            current_max = max(current_max, nums[i][0])\n\n        result = [heap[0][0], current_max]\n\n        while True:\n            value, list_idx, elem_idx = heapq.heappop(heap)\n\n            # Check if current range is better\n            if (current_max - value < result[1] - result[0] or\n                (current_max - value == result[1] - result[0] and value < result[0])):\n                result = [value, current_max]\n\n            # If this list is exhausted, stop\n            if elem_idx + 1 >= len(nums[list_idx]):\n                break\n\n            # Push next element from the same list\n            next_val = nums[list_idx][elem_idx + 1]\n            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))\n            current_max = max(current_max, next_val)\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        5,
        6
      ],
      "seed_front": [
        10,
        11
      ],
      "init_best": [
        13
      ],
      "pop_min": [
        16
      ],
      "update_best": [
        19,
        20,
        21
      ],
      "check_range": [
        19,
        20
      ],
      "list_exhausted": [
        24,
        25
      ],
      "push_next": [
        28,
        29,
        30
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        15
      ],
      "update_best": [
        19
      ],
      "list_exhausted": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] smallestRange(List<List<Integer>> nums) {\n        int k = nums.size();\n        // Min-heap: [value, listIndex, elementIndex]\n        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        int currentMax = Integer.MIN_VALUE;\n\n        // Initialize heap with first element from each list\n        for (int i = 0; i < k; i++) {\n            heap.offer(new int[]{nums.get(i).get(0), i, 0});\n            currentMax = Math.max(currentMax, nums.get(i).get(0));\n        }\n\n        int[] result = {heap.peek()[0], currentMax};\n\n        while (true) {\n            int[] min = heap.poll();\n            int value = min[0], listIdx = min[1], elemIdx = min[2];\n\n            // Check if current range is better\n            if (currentMax - value < result[1] - result[0] ||\n                (currentMax - value == result[1] - result[0] && value < result[0])) {\n                result[0] = value;\n                result[1] = currentMax;\n            }\n\n            // If this list is exhausted, stop\n            if (elemIdx + 1 >= nums.get(listIdx).size()) {\n                break;\n            }\n\n            // Push next element from the same list\n            int nextVal = nums.get(listIdx).get(elemIdx + 1);\n            heap.offer(new int[]{nextVal, listIdx, elemIdx + 1});\n            currentMax = Math.max(currentMax, nextVal);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        5,
        6
      ],
      "seed_front": [
        10,
        11
      ],
      "init_best": [
        14
      ],
      "pop_min": [
        17,
        18
      ],
      "update_best": [
        21,
        22,
        23,
        24
      ],
      "check_range": [
        21,
        22
      ],
      "list_exhausted": [
        28,
        29
      ],
      "push_next": [
        33,
        34,
        35
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        16
      ],
      "update_best": [
        21
      ],
      "list_exhausted": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> smallestRange(vector<vector<int>>& nums) {\n        int k = nums.size();\n        // Min-heap: {value, listIndex, elementIndex}\n        priority_queue<tuple<int,int,int>, vector<tuple<int,int,int>>, greater<>> heap;\n        int currentMax = INT_MIN;\n\n        // Initialize heap with first element from each list\n        for (int i = 0; i < k; i++) {\n            heap.push({nums[i][0], i, 0});\n            currentMax = max(currentMax, nums[i][0]);\n        }\n\n        vector<int> result = {get<0>(heap.top()), currentMax};\n\n        while (true) {\n            auto [value, listIdx, elemIdx] = heap.top();\n            heap.pop();\n\n            // Check if current range is better\n            if (currentMax - value < result[1] - result[0] ||\n                (currentMax - value == result[1] - result[0] && value < result[0])) {\n                result = {value, currentMax};\n            }\n\n            // If this list is exhausted, stop\n            if (elemIdx + 1 >= (int)nums[listIdx].size()) {\n                break;\n            }\n\n            // Push next element from the same list\n            int nextVal = nums[listIdx][elemIdx + 1];\n            heap.push({nextVal, listIdx, elemIdx + 1});\n            currentMax = max(currentMax, nextVal);\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_heap": [
        6,
        7
      ],
      "seed_front": [
        11,
        12
      ],
      "init_best": [
        15
      ],
      "pop_min": [
        18,
        19
      ],
      "update_best": [
        22,
        23,
        24
      ],
      "check_range": [
        22,
        23
      ],
      "list_exhausted": [
        28,
        29
      ],
      "push_next": [
        33,
        34,
        35
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        17
      ],
      "update_best": [
        22
      ],
      "list_exhausted": [
        28
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] SmallestRange(IList<IList<int>> nums) {\n        int k = nums.Count;\n        // Min-heap: (value, listIndex, elementIndex)\n        var heap = new PriorityQueue<int[], int>();\n        int currentMax = int.MinValue;\n\n        // Initialize heap with first element from each list\n        for (int i = 0; i < k; i++) {\n            heap.Enqueue(new int[]{nums[i][0], i, 0}, nums[i][0]);\n            currentMax = Math.Max(currentMax, nums[i][0]);\n        }\n\n        int[] result = {heap.Peek()[0], currentMax};\n\n        while (true) {\n            int[] min = heap.Dequeue();\n            int value = min[0], listIdx = min[1], elemIdx = min[2];\n\n            // Check if current range is better\n            if (currentMax - value < result[1] - result[0] ||\n                (currentMax - value == result[1] - result[0] && value < result[0])) {\n                result = new int[]{value, currentMax};\n            }\n\n            // If this list is exhausted, stop\n            if (elemIdx + 1 >= nums[listIdx].Count) {\n                break;\n            }\n\n            // Push next element from the same list\n            int nextVal = nums[listIdx][elemIdx + 1];\n            heap.Enqueue(new int[]{nextVal, listIdx, elemIdx + 1}, nextVal);\n            currentMax = Math.Max(currentMax, nextVal);\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_heap": [
        5,
        6
      ],
      "seed_front": [
        10,
        11
      ],
      "init_best": [
        14
      ],
      "pop_min": [
        17,
        18
      ],
      "update_best": [
        21,
        22,
        23
      ],
      "check_range": [
        21,
        22
      ],
      "list_exhausted": [
        27,
        28
      ],
      "push_next": [
        32,
        33,
        34
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "while_loop": [
        16
      ],
      "update_best": [
        21
      ],
      "list_exhausted": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func smallestRange(nums [][]int) []int {\n    k := len(nums)\n\n    // Min-heap item: [value, listIndex, elementIndex]\n    h := &minHeap{}\n    heap.Init(h)\n    currentMax := math.MinInt32\n\n    // Initialize heap with first element from each list\n    for i := 0; i < k; i++ {\n        heap.Push(h, [3]int{nums[i][0], i, 0})\n        if nums[i][0] > currentMax {\n            currentMax = nums[i][0]\n        }\n    }\n\n    result := []int{(*h)[0][0], currentMax}\n\n    for {\n        min := heap.Pop(h).([3]int)\n        value, listIdx, elemIdx := min[0], min[1], min[2]\n\n        if currentMax-value < result[1]-result[0] ||\n            (currentMax-value == result[1]-result[0] && value < result[0]) {\n            result = []int{value, currentMax}\n        }\n\n        if elemIdx+1 >= len(nums[listIdx]) {\n            break\n        }\n\n        nextVal := nums[listIdx][elemIdx+1]\n        heap.Push(h, [3]int{nextVal, listIdx, elemIdx + 1})\n        if nextVal > currentMax {\n            currentMax = nextVal\n        }\n    }\n\n    return result\n}\n\ntype minHeap [][3]int\n\nfunc (h minHeap) Len() int            { return len(h) }\nfunc (h minHeap) Less(i, j int) bool   { return h[i][0] < h[j][0] }\nfunc (h minHeap) Swap(i, j int)        { h[i], h[j] = h[j], h[i] }\nfunc (h *minHeap) Push(x interface{})  { *h = append(*h, x.([3]int)) }\nfunc (h *minHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    item := old[n-1]\n    *h = old[:n-1]\n    return item\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        5,
        7
      ],
      "seed_front": [
        11,
        12,
        13
      ],
      "init_best": [
        17
      ],
      "pop_min": [
        20,
        21
      ],
      "update_best": [
        23,
        24,
        25
      ],
      "check_range": [
        23,
        24
      ],
      "list_exhausted": [
        28,
        29
      ],
      "push_next": [
        32,
        33,
        34,
        35
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "while_loop": [
        19
      ],
      "update_best": [
        23
      ],
      "list_exhausted": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var smallestRange = function(nums) {\n    var k = nums.length;\n    var heap = [];\n    var currentMax = -Infinity;\n\n    function swap(i, j) { var t = heap[i]; heap[i] = heap[j]; heap[j] = t; }\n    function siftUp(i) {\n        while (i > 0) {\n            var parent = Math.floor((i - 1) / 2);\n            if (heap[parent][0] > heap[i][0]) { swap(parent, i); i = parent; }\n            else break;\n        }\n    }\n    function siftDown(i) {\n        while (2 * i + 1 < heap.length) {\n            var left = 2 * i + 1, right = 2 * i + 2, smallest = i;\n            if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;\n            if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;\n            if (smallest !== i) { swap(i, smallest); i = smallest; }\n            else break;\n        }\n    }\n    function push(item) { heap.push(item); siftUp(heap.length - 1); }\n    function pop() { var top = heap[0]; heap[0] = heap[heap.length - 1]; heap.pop(); if (heap.length > 0) siftDown(0); return top; }\n\n    // Initialize heap with first element from each list\n    for (var i = 0; i < k; i++) {\n        push([nums[i][0], i, 0]);\n        currentMax = Math.max(currentMax, nums[i][0]);\n    }\n\n    var result = [heap[0][0], currentMax];\n\n    while (true) {\n        var min = pop();\n        var value = min[0], listIdx = min[1], elemIdx = min[2];\n\n        if (currentMax - value < result[1] - result[0] ||\n            (currentMax - value === result[1] - result[0] && value < result[0])) {\n            result = [value, currentMax];\n        }\n\n        if (elemIdx + 1 >= nums[listIdx].length) break;\n\n        var nextVal = nums[listIdx][elemIdx + 1];\n        push([nextVal, listIdx, elemIdx + 1]);\n        currentMax = Math.max(currentMax, nextVal);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        3,
        4
      ],
      "seed_front": [
        28,
        29
      ],
      "init_best": [
        32
      ],
      "pop_min": [
        35,
        36
      ],
      "update_best": [
        38,
        39,
        40
      ],
      "check_range": [
        38,
        39
      ],
      "list_exhausted": [
        43
      ],
      "push_next": [
        45,
        46,
        47
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "while_loop": [
        34
      ],
      "update_best": [
        38
      ],
      "list_exhausted": [
        43
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function smallestRange(nums: number[][]): number[] {\n    const k = nums.length;\n    const heap: number[][] = [];\n    let currentMax = -Infinity;\n\n    function swap(i: number, j: number): void { const t = heap[i]; heap[i] = heap[j]; heap[j] = t; }\n    function siftUp(i: number): void {\n        while (i > 0) {\n            const parent = Math.floor((i - 1) / 2);\n            if (heap[parent][0] > heap[i][0]) { swap(parent, i); i = parent; }\n            else break;\n        }\n    }\n    function siftDown(i: number): void {\n        while (2 * i + 1 < heap.length) {\n            const left = 2 * i + 1, right = 2 * i + 2;\n            let smallest = i;\n            if (left < heap.length && heap[left][0] < heap[smallest][0]) smallest = left;\n            if (right < heap.length && heap[right][0] < heap[smallest][0]) smallest = right;\n            if (smallest !== i) { swap(i, smallest); i = smallest; }\n            else break;\n        }\n    }\n    function push(item: number[]): void { heap.push(item); siftUp(heap.length - 1); }\n    function pop(): number[] { const top = heap[0]; heap[0] = heap[heap.length - 1]; heap.pop(); if (heap.length > 0) siftDown(0); return top; }\n\n    // Initialize heap with first element from each list\n    for (let i = 0; i < k; i++) {\n        push([nums[i][0], i, 0]);\n        currentMax = Math.max(currentMax, nums[i][0]);\n    }\n\n    let result: number[] = [heap[0][0], currentMax];\n\n    while (true) {\n        const min = pop();\n        const [value, listIdx, elemIdx] = min;\n\n        if (currentMax - value < result[1] - result[0] ||\n            (currentMax - value === result[1] - result[0] && value < result[0])) {\n            result = [value, currentMax];\n        }\n\n        if (elemIdx + 1 >= nums[listIdx].length) break;\n\n        const nextVal = nums[listIdx][elemIdx + 1];\n        push([nextVal, listIdx, elemIdx + 1]);\n        currentMax = Math.max(currentMax, nextVal);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_heap": [
        3,
        4
      ],
      "seed_front": [
        29,
        30
      ],
      "init_best": [
        33
      ],
      "pop_min": [
        36,
        37
      ],
      "update_best": [
        39,
        40,
        41
      ],
      "check_range": [
        39,
        40
      ],
      "list_exhausted": [
        44
      ],
      "push_next": [
        46,
        47,
        48
      ],
      "complete": [
        51
      ]
    },
    "conditionalMap": {
      "while_loop": [
        35
      ],
      "update_best": [
        39
      ],
      "list_exhausted": [
        44
      ]
    }
  }
};

const SmallestRangeCoveringElementsFromKListsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        [
          4,
          10,
          15,
          24,
          26
        ],
        [
          0,
          9,
          12,
          20
        ],
        [
          5,
          18,
          22,
          30
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Identical",
    "value": {
      "nums": [
        [
          1,
          2,
          3
        ],
        [
          1,
          2,
          3
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
    "label": "Evenly spaced",
    "value": {
      "nums": [
        [
          1,
          5,
          9
        ],
        [
          4,
          8,
          12
        ],
        [
          3,
          7,
          11
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Small",
    "value": {
      "nums": [
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
          6
        ]
      ]
    }
  }
];

function generateSmallestRangeCoveringElementsFromKListsSteps(e: any): any[] {
  
let t=(e.nums??[]).map(e=>[...e]),n=t.length,i=new StepRecorder({mode:"heap",k:n},{});if(0===n||t.some(e=>0===e.length))return i.record("complete","Every list must be non-empty"),i.getSteps();for(let e=0;e<n;e++)for(let n=0;n<t[e].length;n++)i.add_new_visual(`list_${e}_elem_${n}`,{type:"arrayElement",value:t[e][n],position:n,row:e,state:"pending"});i.record("-","Find the smallest range [lo, hi] that contains at least one number from every list");let r=[],a=e=>{r.push(e),r.sort((e,t)=>e[0]-t[0]||e[1]-t[1])},s=()=>r.shift(),o=Array(n).fill(0),u=-1/0;i.update_variable("heapSize",0),i.record("init_heap","Create an empty min-heap");for(let e=0;e<n;e++)a([t[e][0],e,0]),u=Math.max(u,t[e][0]),i.update_visual(`list_${e}_elem_0`,{type:"arrayElement",value:t[e][0],position:0,row:e,state:"infront"}),i.update_variable("heapSize",r.length),i.update_variable("curHi",u),i.update_variable("minListIdx",r[0][1]),i.update_variable("pushedVal",t[e][0]),i.update_variable("pushedListIdx",e),i.record("seed_front",`Push L${e}'s first value ${t[e][0]}; max so far = ${u}`);let d=r[0][0],c=u,h=o.map((e,t)=>`list_${t}_elem_${e}`);for(i.update_variable("curLo",r[0][0]),i.update_variable("curHi",u),i.update_variable("bestLo",d),i.update_variable("bestHi",c),i.record("init_best",`Window [${r[0][0]}, ${u}] covers every list, width ${u-r[0][0]}`);;){let[e,n,l]=s();i.update_visual(`list_${n}_elem_${l}`,{type:"arrayElement",value:e,position:l,row:n,state:"infront"}),i.update_variable("curLo",e),i.update_variable("curHi",u),i.update_variable("minListIdx",n),i.update_variable("poppedVal",e),i.update_variable("poppedListIdx",n),i.update_variable("heapSize",r.length),i.add_conditional("while_loop",!0),i.record("pop_min",`Pop the smallest, ${e} from L${n}. Window [${e}, ${u}], width ${u-e}`);let m=u-e,p=c-d;if(m<p||m===p&&e<d?(d=e,c=u,h=o.map((e,t)=>`list_${t}_elem_${e}`),i.update_variable("bestLo",d),i.update_variable("bestHi",c),i.update_variable("improved",!0),i.add_conditional("update_best",!0),i.record("update_best",`New smallest range [${d}, ${c}], width ${c-d}`)):(i.update_variable("improved",!1),i.add_conditional("update_best",!1),i.record("check_range",`Width ${m} is not smaller than the best ${p}, keep [${d}, ${c}]`)),i.update_visual(`list_${n}_elem_${l}`,{type:"arrayElement",value:e,position:l,row:n,state:"consumed"}),l+1>=t[n].length){i.add_conditional("list_exhausted",!0),i.update_variable("exhaustedListIdx",n),i.record("list_exhausted",`L${n} has no next element, no window can cover it anymore. Stop.`);break}let f=t[n][l+1];a([f,n,l+1]),o[n]=l+1,u=Math.max(u,f),i.update_visual(`list_${n}_elem_${l+1}`,{type:"arrayElement",value:f,position:l+1,row:n,state:"infront"}),i.update_variable("curLo",r[0][0]),i.update_variable("curHi",u),i.update_variable("minListIdx",r[0][1]),i.update_variable("pushedVal",f),i.update_variable("pushedListIdx",n),i.update_variable("heapSize",r.length),i.add_conditional("list_exhausted",!1),i.record("push_next",`Advance L${n}: push ${f}; max so far = ${u}. New window [${r[0][0]}, ${u}]`)}return h.forEach(e=>{let t=i.get_visual(e);t&&"arrayElement"===t.type&&i.update_visual(e,{type:"arrayElement",value:t.value,position:t.position,row:t.row,state:"best"})}),i.update_variable("curLo",d),i.update_variable("curHi",c),i.add_conditional("while_loop",!1),i.record("complete",`Smallest range = [${d}, ${c}], width ${c-d}`),i.getSteps()
}

export function SmallestRangeCoveringElementsFromKListsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SmallestRangeCoveringElementsFromKListsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSmallestRangeCoveringElementsFromKListsSteps(e) as any[];
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
      title="Smallest Range Covering Elements from K Lists"
      slug="smallest-range-covering-elements-from-k-lists"
      approaches={approaches}
      presets={SmallestRangeCoveringElementsFromKListsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Stock Price Fluctuation (stock-price-fluctuation)
// ==========================================

const StockPriceFluctuationTemplates = {
  "python": {
    "language": "python",
    "code": "class StockPrice:\n    def __init__(self):\n        self.price_map = {}\n        self.latest_timestamp = 0\n        # SortedList maintains prices in sorted order\n        from sortedcontainers import SortedList\n        self.sorted_prices = SortedList()\n\n    def update(self, timestamp: int, price: int) -> None:\n        # If correcting an existing timestamp, remove old price\n        if timestamp in self.price_map:\n            old_price = self.price_map[timestamp]\n            self.sorted_prices.remove(old_price)\n        # Update the price and add new price to sorted structure\n        self.price_map[timestamp] = price\n        self.sorted_prices.add(price)\n        self.latest_timestamp = max(self.latest_timestamp, timestamp)\n\n    def current(self) -> int:\n        return self.price_map[self.latest_timestamp]\n\n    def maximum(self) -> int:\n        return self.sorted_prices[-1]\n\n    def minimum(self) -> int:\n        return self.sorted_prices[0]",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        3,
        4,
        7
      ],
      "start_update": [
        9
      ],
      "check_old": [
        11
      ],
      "remove_old": [
        12,
        13
      ],
      "set_price": [
        15
      ],
      "add_price": [
        16
      ],
      "set_latest": [
        17
      ],
      "start_current": [
        19
      ],
      "return_current": [
        20
      ],
      "start_maximum": [
        22
      ],
      "return_maximum": [
        23
      ],
      "start_minimum": [
        25
      ],
      "return_minimum": [
        26
      ]
    },
    "conditionalMap": {
      "has_old": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class StockPrice {\n    private Map<Integer, Integer> priceMap;\n    private TreeMap<Integer, Integer> priceCount;\n    private int latestTimestamp;\n\n    public StockPrice() {\n        priceMap = new HashMap<>();\n        priceCount = new TreeMap<>();\n        latestTimestamp = 0;\n    }\n\n    public void update(int timestamp, int price) {\n        // If correcting an existing timestamp, remove old price from counts\n        if (priceMap.containsKey(timestamp)) {\n            int oldPrice = priceMap.get(timestamp);\n            int count = priceCount.get(oldPrice);\n            if (count == 1) {\n                priceCount.remove(oldPrice);\n            } else {\n                priceCount.put(oldPrice, count - 1);\n            }\n        }\n        // Update the price and add new price to counts\n        priceMap.put(timestamp, price);\n        priceCount.merge(price, 1, Integer::sum);\n        latestTimestamp = Math.max(latestTimestamp, timestamp);\n    }\n\n    public int current() {\n        return priceMap.get(latestTimestamp);\n    }\n\n    public int maximum() {\n        return priceCount.lastKey();\n    }\n\n    public int minimum() {\n        return priceCount.firstKey();\n    }\n}",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        7,
        8,
        9
      ],
      "start_update": [
        12
      ],
      "check_old": [
        14
      ],
      "remove_old": [
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "set_price": [
        24
      ],
      "add_price": [
        25
      ],
      "set_latest": [
        26
      ],
      "start_current": [
        29
      ],
      "return_current": [
        30
      ],
      "start_maximum": [
        33
      ],
      "return_maximum": [
        34
      ],
      "start_minimum": [
        37
      ],
      "return_minimum": [
        38
      ]
    },
    "conditionalMap": {
      "has_old": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class StockPrice {\n    private Dictionary<int, int> priceMap;\n    private SortedDictionary<int, int> priceCount;\n    private int latestTimestamp;\n\n    public StockPrice() {\n        priceMap = new Dictionary<int, int>();\n        priceCount = new SortedDictionary<int, int>();\n        latestTimestamp = 0;\n    }\n\n    public void Update(int timestamp, int price) {\n        // If correcting an existing timestamp, remove old price from counts\n        if (priceMap.ContainsKey(timestamp)) {\n            int oldPrice = priceMap[timestamp];\n            priceCount[oldPrice]--;\n            if (priceCount[oldPrice] == 0) {\n                priceCount.Remove(oldPrice);\n            }\n        }\n        // Update the price and add new price to counts\n        priceMap[timestamp] = price;\n        if (!priceCount.ContainsKey(price)) priceCount[price] = 0;\n        priceCount[price]++;\n        latestTimestamp = Math.Max(latestTimestamp, timestamp);\n    }\n\n    public int Current() {\n        return priceMap[latestTimestamp];\n    }\n\n    public int Maximum() {\n        return priceCount.Last().Key;\n    }\n\n    public int Minimum() {\n        return priceCount.First().Key;\n    }\n}",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        7,
        8,
        9
      ],
      "start_update": [
        12
      ],
      "check_old": [
        14
      ],
      "remove_old": [
        15,
        16,
        17,
        18
      ],
      "set_price": [
        22
      ],
      "add_price": [
        23,
        24
      ],
      "set_latest": [
        25
      ],
      "start_current": [
        28
      ],
      "return_current": [
        29
      ],
      "start_maximum": [
        32
      ],
      "return_maximum": [
        33
      ],
      "start_minimum": [
        36
      ],
      "return_minimum": [
        37
      ]
    },
    "conditionalMap": {
      "has_old": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class StockPrice {\n    unordered_map<int, int> priceMap;\n    map<int, int> priceCount; // sorted map: price -> frequency\n    int latestTimestamp = 0;\n\npublic:\n    StockPrice() {}\n\n    void update(int timestamp, int price) {\n        // If correcting an existing timestamp, remove old price from counts\n        if (priceMap.count(timestamp)) {\n            int oldPrice = priceMap[timestamp];\n            if (--priceCount[oldPrice] == 0) {\n                priceCount.erase(oldPrice);\n            }\n        }\n        // Update the price and add new price to counts\n        priceMap[timestamp] = price;\n        priceCount[price]++;\n        latestTimestamp = max(latestTimestamp, timestamp);\n    }\n\n    int current() {\n        return priceMap[latestTimestamp];\n    }\n\n    int maximum() {\n        return priceCount.rbegin()->first;\n    }\n\n    int minimum() {\n        return priceCount.begin()->first;\n    }\n};",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        7
      ],
      "start_update": [
        9
      ],
      "check_old": [
        11
      ],
      "remove_old": [
        12,
        13,
        14
      ],
      "set_price": [
        18
      ],
      "add_price": [
        19
      ],
      "set_latest": [
        20
      ],
      "start_current": [
        23
      ],
      "return_current": [
        24
      ],
      "start_maximum": [
        27
      ],
      "return_maximum": [
        28
      ],
      "start_minimum": [
        31
      ],
      "return_minimum": [
        32
      ]
    },
    "conditionalMap": {
      "has_old": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type StockPrice struct {\n    priceMap       map[int]int\n    latestTimestamp int\n    priceCount     map[int]int\n    sortedPrices   []int\n}\n\nfunc Constructor() StockPrice {\n    return StockPrice{\n        priceMap:   make(map[int]int),\n        priceCount: make(map[int]int),\n    }\n}\n\nfunc (sp *StockPrice) addPrice(price int) {\n    sp.priceCount[price]++\n    if sp.priceCount[price] == 1 {\n        idx := sort.SearchInts(sp.sortedPrices, price)\n        sp.sortedPrices = append(sp.sortedPrices, 0)\n        copy(sp.sortedPrices[idx+1:], sp.sortedPrices[idx:])\n        sp.sortedPrices[idx] = price\n    }\n}\n\nfunc (sp *StockPrice) removePrice(price int) {\n    sp.priceCount[price]--\n    if sp.priceCount[price] == 0 {\n        delete(sp.priceCount, price)\n        idx := sort.SearchInts(sp.sortedPrices, price)\n        sp.sortedPrices = append(sp.sortedPrices[:idx], sp.sortedPrices[idx+1:]...)\n    }\n}\n\nfunc (sp *StockPrice) Update(timestamp int, price int) {\n    if oldPrice, exists := sp.priceMap[timestamp]; exists {\n        sp.removePrice(oldPrice)\n    }\n    sp.priceMap[timestamp] = price\n    sp.addPrice(price)\n    if timestamp > sp.latestTimestamp {\n        sp.latestTimestamp = timestamp\n    }\n}\n\nfunc (sp *StockPrice) Current() int {\n    return sp.priceMap[sp.latestTimestamp]\n}\n\nfunc (sp *StockPrice) Maximum() int {\n    return sp.sortedPrices[len(sp.sortedPrices)-1]\n}\n\nfunc (sp *StockPrice) Minimum() int {\n    return sp.sortedPrices[0]\n}",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        10,
        11
      ],
      "start_update": [
        34
      ],
      "check_old": [
        35
      ],
      "remove_old": [
        36
      ],
      "set_price": [
        38
      ],
      "add_price": [
        39
      ],
      "set_latest": [
        40,
        41
      ],
      "start_current": [
        45
      ],
      "return_current": [
        46
      ],
      "start_maximum": [
        49
      ],
      "return_maximum": [
        50
      ],
      "start_minimum": [
        53
      ],
      "return_minimum": [
        54
      ]
    },
    "conditionalMap": {
      "has_old": [
        35
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var StockPrice = function () {\n  this.priceMap = new Map();\n  this.latestTimestamp = 0;\n  this.sortedPrices = [];\n  this.priceCount = new Map();\n};\n\nStockPrice.prototype._addPrice = function (price) {\n  const count = (this.priceCount.get(price) || 0) + 1;\n  this.priceCount.set(price, count);\n  if (count === 1) {\n    let lo = 0, hi = this.sortedPrices.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (this.sortedPrices[mid] < price) lo = mid + 1;\n      else hi = mid;\n    }\n    this.sortedPrices.splice(lo, 0, price);\n  }\n};\n\nStockPrice.prototype._removePrice = function (price) {\n  const count = this.priceCount.get(price) - 1;\n  if (count === 0) {\n    this.priceCount.delete(price);\n    let lo = 0, hi = this.sortedPrices.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (this.sortedPrices[mid] < price) lo = mid + 1;\n      else hi = mid;\n    }\n    this.sortedPrices.splice(lo, 1);\n  } else {\n    this.priceCount.set(price, count);\n  }\n};\n\nStockPrice.prototype.update = function (timestamp, price) {\n  if (this.priceMap.has(timestamp)) {\n    this._removePrice(this.priceMap.get(timestamp));\n  }\n  this.priceMap.set(timestamp, price);\n  this._addPrice(price);\n  this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);\n};\n\nStockPrice.prototype.current = function () {\n  return this.priceMap.get(this.latestTimestamp);\n};\n\nStockPrice.prototype.maximum = function () {\n  return this.sortedPrices[this.sortedPrices.length - 1];\n};\n\nStockPrice.prototype.minimum = function () {\n  return this.sortedPrices[0];\n};",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "start_update": [
        38
      ],
      "check_old": [
        39
      ],
      "remove_old": [
        40
      ],
      "set_price": [
        42
      ],
      "add_price": [
        43
      ],
      "set_latest": [
        44
      ],
      "start_current": [
        47
      ],
      "return_current": [
        48
      ],
      "start_maximum": [
        51
      ],
      "return_maximum": [
        52
      ],
      "start_minimum": [
        55
      ],
      "return_minimum": [
        56
      ]
    },
    "conditionalMap": {
      "has_old": [
        39
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class StockPrice {\n    private priceMap: Map<number, number>;\n    private latestTimestamp: number;\n    private sortedPrices: number[];\n    private priceCount: Map<number, number>;\n\n    constructor() {\n        this.priceMap = new Map();\n        this.latestTimestamp = 0;\n        this.sortedPrices = [];\n        this.priceCount = new Map();\n    }\n\n    private addPrice(price: number): void {\n        const count = (this.priceCount.get(price) || 0) + 1;\n        this.priceCount.set(price, count);\n        if (count === 1) {\n            let lo = 0, hi = this.sortedPrices.length;\n            while (lo < hi) {\n                const mid = (lo + hi) >> 1;\n                if (this.sortedPrices[mid] < price) lo = mid + 1;\n                else hi = mid;\n            }\n            this.sortedPrices.splice(lo, 0, price);\n        }\n    }\n\n    private removePrice(price: number): void {\n        const count = this.priceCount.get(price)! - 1;\n        if (count === 0) {\n            this.priceCount.delete(price);\n            let lo = 0, hi = this.sortedPrices.length;\n            while (lo < hi) {\n                const mid = (lo + hi) >> 1;\n                if (this.sortedPrices[mid] < price) lo = mid + 1;\n                else hi = mid;\n            }\n            this.sortedPrices.splice(lo, 1);\n        } else {\n            this.priceCount.set(price, count);\n        }\n    }\n\n    update(timestamp: number, price: number): void {\n        if (this.priceMap.has(timestamp)) {\n            this.removePrice(this.priceMap.get(timestamp)!);\n        }\n        this.priceMap.set(timestamp, price);\n        this.addPrice(price);\n        this.latestTimestamp = Math.max(this.latestTimestamp, timestamp);\n    }\n\n    current(): number {\n        return this.priceMap.get(this.latestTimestamp)!;\n    }\n\n    maximum(): number {\n        return this.sortedPrices[this.sortedPrices.length - 1];\n    }\n\n    minimum(): number {\n        return this.sortedPrices[0];\n    }\n}",
    "lineMap": {
      "complete": [
        1
      ],
      "init": [
        8,
        9,
        10,
        11
      ],
      "start_update": [
        44
      ],
      "check_old": [
        45
      ],
      "remove_old": [
        46
      ],
      "set_price": [
        48
      ],
      "add_price": [
        49
      ],
      "set_latest": [
        50
      ],
      "start_current": [
        53
      ],
      "return_current": [
        54
      ],
      "start_maximum": [
        57
      ],
      "return_maximum": [
        58
      ],
      "start_minimum": [
        61
      ],
      "return_minimum": [
        62
      ]
    },
    "conditionalMap": {
      "has_old": [
        45
      ]
    }
  }
};

const StockPriceFluctuationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "StockPrice",
        "update",
        "update",
        "current",
        "maximum",
        "update",
        "minimum"
      ],
      "values": [
        null,
        [
          1,
          10
        ],
        [
          2,
          5
        ],
        null,
        null,
        [
          1,
          3
        ],
        null
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Updates",
    "value": {
      "operations": [
        "StockPrice",
        "update",
        "update",
        "update",
        "update",
        "current",
        "maximum",
        "minimum"
      ],
      "values": [
        null,
        [
          1,
          10
        ],
        [
          2,
          5
        ],
        [
          1,
          3
        ],
        [
          2,
          8
        ],
        null,
        null,
        null
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Stock",
    "value": {
      "operations": [
        "StockPrice",
        "update",
        "current",
        "maximum",
        "minimum"
      ],
      "values": [
        null,
        [
          1,
          100
        ],
        null,
        null,
        null
      ]
    }
  }
];

function generateStockPriceFluctuationSteps(e: any): any[] {
  
let t=(0,a.createStockPriceScene)(),{recorder:i}=t,r=new Map,s=new Map,n=0,p=()=>[...s.keys()].sort((e,t)=>e-t),m=(e,i=a.CELL_STATE.active,n,m=a.CELL_STATE.active)=>{t.setEntries([...r.keys()].sort((e,t)=>e-t).map(t=>({timestamp:t,price:r.get(t),state:t===e?i:a.CELL_STATE.idle}))),t.setPrices(p().map(e=>({price:e,count:s.get(e),state:e===n?m:a.CELL_STATE.idle})))};for(let c of(m(),i.record("init","Start with an empty price map and an empty sorted multiset"),(0,a.stockOps)(e))){if("update"===c.kind){let e=c.timestamp,p=c.price;t.setOperation(`update(${e}, ${p})`),t.setResult(""),m(),i.record("start_update",`update(${e}, ${p})`);let l=r.has(e);if(i.set_conditionals([{key:"has_old",result:l}]),m(l?e:void 0),i.record("check_old",l?`Timestamp ${e} already holds ${r.get(e)}`:`Timestamp ${e} is new`),l){let t=r.get(e),n=s.get(t);1===n?s.delete(t):s.set(t,n-1),m(e,a.CELL_STATE.stale,t,a.CELL_STATE.stale),i.record("remove_old",1===n?`Dropped price ${t}`:`Price ${t} count ${n} to ${n-1}`)}r.set(e,p),m(e),i.record("set_price",`priceMap[${e}] = ${p}`),s.set(p,(s.get(p)??0)+1),m(e,a.CELL_STATE.active,p),i.record("add_price",`Price ${p} count is ${s.get(p)}`),n=Math.max(n,e),t.setLatest(n),m(e),i.record("set_latest",`latestTimestamp = ${n}`);continue}if(0===r.size)continue;if(t.setOperation(`${c.kind}()`),t.setResult(""),m(),i.record(`start_${c.kind}`,`${c.kind}()`),"current"===c.kind){let e=r.get(n);m(n,a.CELL_STATE.answer),t.setResult(String(e)),i.record("return_current",`priceMap[${n}] = ${e}`);continue}let e=p(),l="maximum"===c.kind?e[e.length-1]:e[0];m(void 0,a.CELL_STATE.active,l,a.CELL_STATE.answer),t.setResult(String(l)),i.record(`return_${c.kind}`,`${"maximum"===c.kind?"Last":"First"} key is ${l}`)}return t.setOperation(""),t.setResult(""),m(),i.record("complete",`Complete! ${r.size} timestamps recorded`),i.getSteps()
}

export function StockPriceFluctuationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: StockPriceFluctuationTemplates,
      generateSteps: (e: any) => {
        const recorded = generateStockPriceFluctuationSteps(e) as any[];
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
      title="Stock Price Fluctuation"
      slug="stock-price-fluctuation"
      approaches={approaches}
      presets={StockPriceFluctuationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Task Scheduler (task-scheduler)
// ==========================================

const TaskSchedulerTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def leastInterval(self, tasks: list[str], n: int) -> int:\n        freq = [0] * 26\n        for task in tasks:\n            freq[ord(task) - ord('A')] += 1\n\n        # Find the maximum frequency\n        max_freq = max(freq)\n\n        # Count how many tasks share the maximum frequency\n        max_count = freq.count(max_freq)\n\n        # Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n        formula_result = (max_freq - 1) * (n + 1) + max_count\n\n        # Answer is at least the total number of tasks\n        return max(len(tasks), formula_result)",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "count_freq": [
        4,
        5
      ],
      "find_max": [
        7,
        8
      ],
      "init_max_count": [
        10,
        11
      ],
      "count_max": [
        11
      ],
      "compute_formula": [
        13,
        14
      ],
      "complete": [
        16,
        17
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int leastInterval(char[] tasks, int n) {\n        int[] freq = new int[26];\n        for (char task : tasks) {\n            freq[task - 'A']++;\n        }\n\n        // Find the maximum frequency\n        int maxFreq = 0;\n        for (int f : freq) {\n            maxFreq = Math.max(maxFreq, f);\n        }\n\n        // Count how many tasks share the maximum frequency\n        int maxCount = 0;\n        for (int f : freq) {\n            if (f == maxFreq) maxCount++;\n        }\n\n        // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n        int formulaResult = (maxFreq - 1) * (n + 1) + maxCount;\n\n        // Answer is at least the total number of tasks\n        return Math.max(tasks.length, formulaResult);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "count_freq": [
        4,
        5
      ],
      "find_max": [
        8,
        9,
        10,
        11
      ],
      "init_max_count": [
        14,
        15
      ],
      "count_max": [
        16,
        17
      ],
      "compute_formula": [
        20,
        21
      ],
      "complete": [
        23,
        24
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int leastInterval(vector<char>& tasks, int n) {\n        vector<int> freq(26, 0);\n        for (char task : tasks) {\n            freq[task - 'A']++;\n        }\n\n        // Find the maximum frequency\n        int maxFreq = *max_element(freq.begin(), freq.end());\n\n        // Count how many tasks share the maximum frequency\n        int maxCount = 0;\n        for (int f : freq) {\n            if (f == maxFreq) maxCount++;\n        }\n\n        // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n        int formulaResult = (maxFreq - 1) * (n + 1) + maxCount;\n\n        // Answer is at least the total number of tasks\n        return max((int)tasks.size(), formulaResult);\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "count_freq": [
        5,
        6
      ],
      "find_max": [
        9,
        10
      ],
      "init_max_count": [
        12,
        13
      ],
      "count_max": [
        14,
        15
      ],
      "compute_formula": [
        18,
        19
      ],
      "complete": [
        21,
        22
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int LeastInterval(char[] tasks, int n) {\n        int[] freq = new int[26];\n        foreach (char task in tasks) {\n            freq[task - 'A']++;\n        }\n\n        // Find the maximum frequency\n        int maxFreq = freq.Max();\n\n        // Count how many tasks share the maximum frequency\n        int maxCount = 0;\n        foreach (int f in freq) {\n            if (f == maxFreq) maxCount++;\n        }\n\n        // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n        int formulaResult = (maxFreq - 1) * (n + 1) + maxCount;\n\n        // Answer is at least the total number of tasks\n        return Math.Max(tasks.Length, formulaResult);\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "count_freq": [
        4,
        5
      ],
      "find_max": [
        8,
        9
      ],
      "init_max_count": [
        11,
        12
      ],
      "count_max": [
        13,
        14
      ],
      "compute_formula": [
        17,
        18
      ],
      "complete": [
        20,
        21
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func leastInterval(tasks []byte, n int) int {\n    freq := make([]int, 26)\n    for _, task := range tasks {\n        freq[task-'A']++\n    }\n\n    // Find the maximum frequency\n    maxFreq := 0\n    for _, f := range freq {\n        if f > maxFreq {\n            maxFreq = f\n        }\n    }\n\n    // Count how many tasks share the maximum frequency\n    maxCount := 0\n    for _, f := range freq {\n        if f == maxFreq {\n            maxCount++\n        }\n    }\n\n    // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n    formulaResult := (maxFreq-1)*(n+1) + maxCount\n\n    // Answer is at least the total number of tasks\n    if len(tasks) > formulaResult {\n        return len(tasks)\n    }\n    return formulaResult\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_freq": [
        3,
        4
      ],
      "find_max": [
        7,
        8,
        9,
        10,
        11
      ],
      "init_max_count": [
        15,
        16
      ],
      "count_max": [
        17,
        18,
        19
      ],
      "compute_formula": [
        23,
        24
      ],
      "complete": [
        26,
        27,
        28,
        30
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var leastInterval = function (tasks, n) {\n  const freq = new Array(26).fill(0);\n  for (const task of tasks) {\n    freq[task.charCodeAt(0) - 65]++;\n  }\n\n  // Find the maximum frequency\n  const maxFreq = Math.max(...freq);\n\n  // Count how many tasks share the maximum frequency\n  let maxCount = 0;\n  for (const f of freq) {\n    if (f === maxFreq) maxCount++;\n  }\n\n  // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n  const formulaResult = (maxFreq - 1) * (n + 1) + maxCount;\n\n  // Answer is at least the total number of tasks\n  return Math.max(tasks.length, formulaResult);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "count_freq": [
        3,
        4
      ],
      "find_max": [
        7,
        8
      ],
      "init_max_count": [
        10,
        11
      ],
      "count_max": [
        12,
        13
      ],
      "compute_formula": [
        16,
        17
      ],
      "complete": [
        19,
        20
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function leastInterval(tasks: string[], n: number): number {\n    const freq: number[] = new Array(26).fill(0);\n    for (const task of tasks) {\n        freq[task.charCodeAt(0) - 65]++;\n    }\n\n    // Find the maximum frequency\n    const maxFreq = Math.max(...freq);\n\n    // Count how many tasks share the maximum frequency\n    let maxCount = 0;\n    for (const f of freq) {\n        if (f === maxFreq) maxCount++;\n    }\n\n    // Formula: (maxFreq - 1) blocks of size (n + 1) + final block of maxCount\n    const formulaResult = (maxFreq - 1) * (n + 1) + maxCount;\n\n    // Answer is at least the total number of tasks\n    return Math.max(tasks.length, formulaResult);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "count_freq": [
        3,
        4
      ],
      "find_max": [
        7,
        8
      ],
      "init_max_count": [
        10,
        11
      ],
      "count_max": [
        12,
        13
      ],
      "compute_formula": [
        16,
        17
      ],
      "complete": [
        19,
        20
      ]
    },
    "conditionalMap": {
      "check_max_count": [
        13
      ]
    }
  }
};

const TaskSchedulerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "tasks": [
        "A",
        "A",
        "A",
        "B",
        "B",
        "B"
      ],
      "n": 2
    }
  },
  {
    "id": "ex2",
    "label": "No cooldown",
    "value": {
      "tasks": [
        "A",
        "A",
        "A",
        "B",
        "B",
        "B"
      ],
      "n": 0
    }
  },
  {
    "id": "ex3",
    "label": "3 tasks",
    "value": {
      "tasks": [
        "A",
        "A",
        "A",
        "A",
        "B",
        "B",
        "C",
        "C"
      ],
      "n": 2
    }
  },
  {
    "id": "ex4",
    "label": "Balanced",
    "value": {
      "tasks": [
        "A",
        "B",
        "C",
        "A",
        "B",
        "C"
      ],
      "n": 2
    }
  }
];

function generateTaskSchedulerSteps(e: any): any[] {
  
let t=[...e.tasks],n=e.n,l={};t.forEach((e,t)=>{l[`task_${t}`]={type:"arrayElement",value:e,position:t}});let i=new StepRecorder({n,tasksLen:t.length},l);i.record("-","Start: Find minimum intervals to run all tasks with cooldown n");let r={};i.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"});for(let e=0;e<t.length;e++){let n=t[e];r[n]=(r[n]||0)+1,i.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),i.update_variable("i",e),i.update_variable("taskChar",n),i.update_variable("countOfChar",r[n]),i.update_variable("counts",r),i.record("count_freq",`Count task '${n}': freq['${n}'] = ${r[n]}`)}i.delete_visual("ptr_i");let o=Object.keys(r).sort();i.delete_variable("i"),i.delete_variable("taskChar"),i.delete_variable("countOfChar");let s=Math.max(0,...o.map(e=>r[e]));i.add_new_variable("maxFreq",s),i.record("find_max",`Frequency count complete: ${o.map(e=>`${e}=${r[e]}`).join(", ")}. maxFreq = ${s}`);let u=0;for(let e of(i.add_new_variable("maxCount",u),i.record("init_max_count","Initialize maxCount = 0"),o)){let t=r[e],n=t===s;i.add_conditional("check_max_count",n),n&&u++,i.update_variable("letter",e),i.update_variable("f",t),i.update_variable("isMax",n),i.update_variable("maxCount",u),i.record("count_max",`Task '${e}' freq ${t} ${n?"== maxFreq, maxCount++":"!= maxFreq"} → maxCount = ${u}`)}i.delete_variable("letter"),i.delete_variable("f"),i.delete_variable("isMax");let c=(s-1)*(n+1)+u;i.add_new_variable("formulaResult",c),i.record("compute_formula",`formulaResult = (${s} − 1) \xd7 (${n} + 1) + ${u} = ${c}`);let d=Math.max(t.length,c);return i.add_new_variable("result",d),i.record("complete",`Result = max(${t.length}, ${c}) = ${d}`),i.getSteps()
}

export function TaskSchedulerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TaskSchedulerTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTaskSchedulerSteps(e) as any[];
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
      title="Task Scheduler"
      slug="task-scheduler"
      approaches={approaches}
      presets={TaskSchedulerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Top K Frequent Words (top-k-frequent-words)
// ==========================================

const TopKFrequentWordsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def topKFrequent(self, words: list[str], k: int) -> list[str]:\n        # Count frequencies\n        freq = {}\n        for word in words:\n            freq[word] = freq.get(word, 0) + 1\n\n        # Create buckets where index = frequency\n        n = len(words)\n        buckets = [[] for _ in range(n + 1)]\n        for word, count in freq.items():\n            buckets[count].append(word)\n\n        # Sort each bucket alphabetically\n        for bucket in buckets:\n            bucket.sort()\n\n        # Collect top k words from highest frequency bucket down\n        result = []\n        for i in range(n, -1, -1):\n            for word in buckets[i]:\n                result.append(word)\n                if len(result) == k:\n                    return result\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "init_freq": [
        4
      ],
      "count_freq": [
        5,
        6
      ],
      "init_buckets": [
        9,
        10
      ],
      "place_in_bucket": [
        11,
        12
      ],
      "sort_bucket": [
        15,
        16
      ],
      "buckets_sorted": [
        15,
        16
      ],
      "scan_bucket": [
        20
      ],
      "collect_word": [
        21,
        22
      ],
      "complete": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<String> topKFrequent(String[] words, int k) {\n        // Count frequencies\n        Map<String, Integer> freq = new HashMap<>();\n        for (String word : words) {\n            freq.put(word, freq.getOrDefault(word, 0) + 1);\n        }\n\n        // Create buckets where index = frequency\n        List<String>[] buckets = new List[words.length + 1];\n        for (int i = 0; i < buckets.length; i++) {\n            buckets[i] = new ArrayList<>();\n        }\n        for (Map.Entry<String, Integer> entry : freq.entrySet()) {\n            buckets[entry.getValue()].add(entry.getKey());\n        }\n\n        // Sort each bucket alphabetically\n        for (List<String> bucket : buckets) {\n            Collections.sort(bucket);\n        }\n\n        // Collect top k words from highest frequency bucket down\n        List<String> result = new ArrayList<>();\n        for (int i = buckets.length - 1; i >= 0 && result.size() < k; i--) {\n            for (String word : buckets[i]) {\n                result.add(word);\n                if (result.size() == k) return result;\n            }\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_freq": [
        4
      ],
      "count_freq": [
        5,
        6,
        7
      ],
      "init_buckets": [
        10,
        11,
        12,
        13
      ],
      "place_in_bucket": [
        14,
        15,
        16
      ],
      "sort_bucket": [
        19,
        20,
        21
      ],
      "buckets_sorted": [
        19,
        20,
        21
      ],
      "scan_bucket": [
        25
      ],
      "collect_word": [
        26,
        27
      ],
      "complete": [
        31
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<string> topKFrequent(vector<string>& words, int k) {\n        // Count frequencies\n        unordered_map<string, int> freq;\n        for (auto& word : words) {\n            freq[word]++;\n        }\n\n        // Create buckets where index = frequency\n        int n = words.size();\n        vector<vector<string>> buckets(n + 1);\n        for (auto& [word, count] : freq) {\n            buckets[count].push_back(word);\n        }\n\n        // Sort each bucket alphabetically\n        for (auto& bucket : buckets) {\n            sort(bucket.begin(), bucket.end());\n        }\n\n        // Collect top k words from highest frequency bucket down\n        vector<string> result;\n        for (int i = n; i >= 0 && (int)result.size() < k; i--) {\n            for (auto& word : buckets[i]) {\n                result.push_back(word);\n                if ((int)result.size() == k) return result;\n            }\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_freq": [
        5
      ],
      "count_freq": [
        6,
        7,
        8
      ],
      "init_buckets": [
        11,
        12
      ],
      "place_in_bucket": [
        13,
        14,
        15
      ],
      "sort_bucket": [
        18,
        19,
        20
      ],
      "buckets_sorted": [
        18,
        19,
        20
      ],
      "scan_bucket": [
        24
      ],
      "collect_word": [
        25,
        26
      ],
      "complete": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var topKFrequent = function(words, k) {\n    // Count frequencies\n    var freq = new Map();\n    for (var i = 0; i < words.length; i++) {\n        freq.set(words[i], (freq.get(words[i]) || 0) + 1);\n    }\n\n    // Create buckets where index = frequency\n    var n = words.length;\n    var buckets = new Array(n + 1);\n    for (var j = 0; j <= n; j++) {\n        buckets[j] = [];\n    }\n    freq.forEach(function(count, word) {\n        buckets[count].push(word);\n    });\n\n    // Sort each bucket alphabetically\n    for (var b = 0; b <= n; b++) {\n        buckets[b].sort();\n    }\n\n    // Collect top k words from highest frequency bucket down\n    var result = [];\n    for (var idx = n; idx >= 0 && result.length < k; idx--) {\n        for (var w = 0; w < buckets[idx].length; w++) {\n            result.push(buckets[idx][w]);\n            if (result.length === k) return result;\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_freq": [
        3
      ],
      "count_freq": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10,
        11,
        12,
        13
      ],
      "place_in_bucket": [
        14,
        15,
        16
      ],
      "sort_bucket": [
        19,
        20,
        21
      ],
      "buckets_sorted": [
        19,
        20,
        21
      ],
      "scan_bucket": [
        25
      ],
      "collect_word": [
        26,
        27
      ],
      "complete": [
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function topKFrequent(words: string[], k: number): string[] {\n    // Count frequencies\n    const freq = new Map<string, number>();\n    for (const word of words) {\n        freq.set(word, (freq.get(word) || 0) + 1);\n    }\n\n    // Create buckets where index = frequency\n    const n = words.length;\n    const buckets: string[][] = new Array(n + 1);\n    for (let i = 0; i <= n; i++) {\n        buckets[i] = [];\n    }\n    freq.forEach((count, word) => {\n        buckets[count].push(word);\n    });\n\n    // Sort each bucket alphabetically\n    for (const bucket of buckets) {\n        bucket.sort();\n    }\n\n    // Collect top k words from highest frequency bucket down\n    const result: string[] = [];\n    for (let i = n; i >= 0 && result.length < k; i--) {\n        for (const word of buckets[i]) {\n            result.push(word);\n            if (result.length === k) return result;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_freq": [
        3
      ],
      "count_freq": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10,
        11,
        12,
        13
      ],
      "place_in_bucket": [
        14,
        15,
        16
      ],
      "sort_bucket": [
        19,
        20,
        21
      ],
      "buckets_sorted": [
        19,
        20,
        21
      ],
      "scan_bucket": [
        25
      ],
      "collect_word": [
        26,
        27
      ],
      "complete": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func topKFrequent(words []string, k int) []string {\n    // Count frequencies\n    freq := make(map[string]int)\n    for _, word := range words {\n        freq[word]++\n    }\n\n    // Create buckets where index = frequency\n    n := len(words)\n    buckets := make([][]string, n+1)\n    for i := range buckets {\n        buckets[i] = []string{}\n    }\n    for word, count := range freq {\n        buckets[count] = append(buckets[count], word)\n    }\n\n    // Sort each bucket alphabetically\n    for i := range buckets {\n        sort.Strings(buckets[i])\n    }\n\n    // Collect top k words from highest frequency bucket down\n    result := make([]string, 0, k)\n    for i := n; i >= 0 && len(result) < k; i-- {\n        for _, word := range buckets[i] {\n            result = append(result, word)\n            if len(result) == k {\n                return result\n            }\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_freq": [
        3
      ],
      "count_freq": [
        4,
        5,
        6
      ],
      "init_buckets": [
        9,
        10,
        11,
        12,
        13
      ],
      "place_in_bucket": [
        14,
        15,
        16
      ],
      "sort_bucket": [
        19,
        20,
        21
      ],
      "buckets_sorted": [
        19,
        20,
        21
      ],
      "scan_bucket": [
        25
      ],
      "collect_word": [
        26,
        27
      ],
      "complete": [
        33
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<string> TopKFrequent(string[] words, int k) {\n        // Count frequencies\n        var freq = new Dictionary<string, int>();\n        foreach (string word in words) {\n            if (!freq.ContainsKey(word)) freq[word] = 0;\n            freq[word]++;\n        }\n\n        // Create buckets where index = frequency\n        var buckets = new List<string>[words.Length + 1];\n        for (int i = 0; i < buckets.Length; i++) {\n            buckets[i] = new List<string>();\n        }\n        foreach (var entry in freq) {\n            buckets[entry.Value].Add(entry.Key);\n        }\n\n        // Sort each bucket alphabetically\n        foreach (var bucket in buckets) {\n            bucket.Sort();\n        }\n\n        // Collect top k words from highest frequency bucket down\n        var result = new List<string>();\n        for (int i = buckets.Length - 1; i >= 0 && result.Count < k; i--) {\n            foreach (string word in buckets[i]) {\n                result.Add(word);\n                if (result.Count == k) return result;\n            }\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_freq": [
        4
      ],
      "count_freq": [
        5,
        6,
        7,
        8
      ],
      "init_buckets": [
        11,
        12,
        13,
        14
      ],
      "place_in_bucket": [
        15,
        16,
        17
      ],
      "sort_bucket": [
        20,
        21,
        22
      ],
      "buckets_sorted": [
        20,
        21,
        22
      ],
      "scan_bucket": [
        26
      ],
      "collect_word": [
        27,
        28
      ],
      "complete": [
        32
      ]
    }
  }
};

const TopKFrequentWordsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "words": [
        "i",
        "love",
        "leetcode",
        "i",
        "love",
        "coding"
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Larger",
    "value": {
      "words": [
        "the",
        "day",
        "is",
        "sunny",
        "the",
        "the",
        "the",
        "sunny",
        "is",
        "is"
      ],
      "k": 4
    }
  }
];

function generateTopKFrequentWordsSteps(e: any): any[] {
  
let t=e.words??[],r=e.k??0,a=t.length,s={};t.forEach((e,t)=>{s[`word_${t}`]={type:"arrayElement",value:e,position:t,counted:!1}});let i=new StepRecorder({k:r,n:a,phase:"start",freqEntries:[]},s);i.record("-","Find the k most frequent words using bucket sort");let o=new Map,l=[],d=()=>l.map(e=>({word:e,count:o.get(e)}));i.update_variable("phase","count"),i.record("init_freq","Phase 1: count how often each word appears");for(let e=0;e<a;e++){let r=t[e];i.update_visual(`word_${e}`,{type:"arrayElement",value:r,position:e,counted:!0,state:"active"}),i.update_visual("curr",{type:"pointer",position:e,label:"i",state:"active"});let n=(o.get(r)??0)+1;o.has(r)||l.push(r),o.set(r,n),i.update_variable("freqEntries",d()),i.update_variable("activeWord",r),i.update_variable("activeCount",n),i.record("count_freq",`'${r}' seen ${n} time${1===n?"":"s"}`),i.update_visual(`word_${e}`,{type:"arrayElement",value:r,position:e,counted:!0})}i.delete_visual("curr"),i.delete_variable("activeWord"),i.delete_variable("activeCount");let u=Array.from(new Set(o.values())).sort((e,t)=>t-e),c=new Map;for(let[e,t]of(u.forEach(e=>c.set(e,[])),i.update_variable("phase","bucket"),i.update_variable("laneFreqs",u),i.update_variable("maxFreq",u[0]??0),i.record("init_buckets","Phase 2: group words into buckets indexed by frequency"),o.entries())){let r=c.get(t);r.push(e);let n=r.length-1;i.update_visual(`bucket_${e}`,{type:"arrayElement",value:e,position:n,slot:n,freq:t,state:"sorted"}),i.update_variable("activeWord",e),i.update_variable("activeCount",t),i.record("place_in_bucket",`Place '${e}' into bucket[${t}]`)}i.delete_variable("activeWord"),i.delete_variable("activeCount");let p=e=>{c.get(e).forEach((t,r)=>{i.update_visual(`bucket_${t}`,{type:"arrayElement",value:t,position:r,slot:r,freq:e,state:"sorted"})})};for(let e of(i.update_variable("phase","sort"),u)){let t=c.get(e);t.length>1&&(t.sort(),i.update_variable("sortFreq",e),p(e),i.record("sort_bucket",`Sort bucket[${e}] alphabetically: [${t.join(", ")}]`))}i.delete_variable("sortFreq"),i.record("buckets_sorted","Every bucket is sorted alphabetically"),i.update_variable("phase","scan"),i.update_variable("result",[]);let h=[],f=0;for(let e of u){if(h.length>=r)break;let t=c.get(e);if(0!==t.length)for(let n of(i.update_variable("scanFreq",e),i.record("scan_bucket",`Scan bucket[${e}] — words with frequency ${e}`),[...t])){if(h.length>=r)break;h.push(n),c.set(e,c.get(e).filter(e=>e!==n)),i.delete_visual(`bucket_${n}`),p(e),i.update_visual(`result_${f}`,{type:"arrayElement",value:n,position:f,state:"sorted"}),i.update_variable("collectedWord",n),i.update_variable("result",[...h]),i.record("collect_word",`Collect '${n}' → result[${f}]`),f++}}return i.delete_variable("scanFreq"),i.delete_variable("collectedWord"),i.update_variable("phase","done"),i.update_variable("result",[...h]),i.record("complete",`Top ${r} frequent words: [${h.join(", ")}]`),i.getSteps()
}

export function TopKFrequentWordsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TopKFrequentWordsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTopKFrequentWordsSteps(e) as any[];
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
      title="Top K Frequent Words"
      slug="top-k-frequent-words"
      approaches={approaches}
      presets={TopKFrequentWordsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Two Best Non-Overlapping Events (two-best-non-overlapping-events)
// ==========================================

const TwoBestNonOverlappingEventsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxTwoEvents(self, events: list[list[int]]) -> int:\n        # Create time points: (time, type, value)\n        # type 0 = end (value becomes available), type 1 = start\n        points = []\n\n        for start, end, value in events:\n            points.append((start, 1, value))      # start\n            points.append((end + 1, 0, value))     # end (available at endTime+1)\n\n        # Sort by time, then by type (end before start at same time)\n        points.sort()\n\n        answer = 0\n        max_prev_value = 0\n\n        for time, ptype, value in points:\n            if ptype == 0:\n                # End entry: this event's value is now available\n                max_prev_value = max(max_prev_value, value)\n            else:\n                # Start entry: try pairing with best previous event\n                answer = max(answer, value + max_prev_value)\n\n        return answer",
    "lineMap": {
      "-": [
        2
      ],
      "create_points": [
        7,
        8,
        9,
        12
      ],
      "initialize": [
        14,
        15
      ],
      "process_end": [
        18,
        19,
        20
      ],
      "process_start": [
        21,
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_end": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxTwoEvents(int[][] events) {\n        // Create time points: (time, type, value)\n        // type 0 = end (value becomes available), type 1 = start\n        int n = events.length;\n        int[][] points = new int[2 * n][3];\n\n        for (int i = 0; i < n; i++) {\n            points[2 * i] = new int[]{events[i][0], 1, events[i][2]};     // start\n            points[2 * i + 1] = new int[]{events[i][1] + 1, 0, events[i][2]}; // end (available at endTime+1)\n        }\n\n        // Sort by time, then by type (end before start at same time)\n        Arrays.sort(points, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n        int answer = 0;\n        int maxPrevValue = 0;\n\n        for (int[] point : points) {\n            if (point[1] == 0) {\n                // End entry: this event's value is now available\n                maxPrevValue = Math.max(maxPrevValue, point[2]);\n            } else {\n                // Start entry: try pairing with best previous event\n                answer = Math.max(answer, point[2] + maxPrevValue);\n            }\n        }\n\n        return answer;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_points": [
        8,
        9,
        10,
        14
      ],
      "initialize": [
        16,
        17
      ],
      "process_end": [
        20,
        21,
        22
      ],
      "process_start": [
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_end": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxTwoEvents(vector<vector<int>>& events) {\n        // Create time points: (time, type, value)\n        // type 0 = end (value becomes available), type 1 = start\n        vector<array<int, 3>> points;\n\n        for (auto& e : events) {\n            points.push_back({e[0], 1, e[2]});      // start\n            points.push_back({e[1] + 1, 0, e[2]});   // end (available at endTime+1)\n        }\n\n        // Sort by time, then by type (end before start at same time)\n        sort(points.begin(), points.end());\n\n        int answer = 0;\n        int maxPrevValue = 0;\n\n        for (auto& point : points) {\n            if (point[1] == 0) {\n                // End entry: this event's value is now available\n                maxPrevValue = max(maxPrevValue, point[2]);\n            } else {\n                // Start entry: try pairing with best previous event\n                answer = max(answer, point[2] + maxPrevValue);\n            }\n        }\n\n        return answer;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "create_points": [
        8,
        9,
        10,
        14
      ],
      "initialize": [
        16,
        17
      ],
      "process_end": [
        20,
        21,
        22
      ],
      "process_start": [
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_end": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxTwoEvents(int[][] events) {\n        // Create time points: (time, type, value)\n        // type 0 = end (value becomes available), type 1 = start\n        int n = events.Length;\n        int[][] points = new int[2 * n][];\n\n        for (int i = 0; i < n; i++) {\n            points[2 * i] = new int[] { events[i][0], 1, events[i][2] };       // start\n            points[2 * i + 1] = new int[] { events[i][1] + 1, 0, events[i][2] }; // end\n        }\n\n        // Sort by time, then by type (end before start at same time)\n        Array.Sort(points, (a, b) => a[0] != b[0] ? a[0].CompareTo(b[0]) : a[1].CompareTo(b[1]));\n\n        int answer = 0;\n        int maxPrevValue = 0;\n\n        foreach (var point in points) {\n            if (point[1] == 0) {\n                // End entry: this event's value is now available\n                maxPrevValue = Math.Max(maxPrevValue, point[2]);\n            } else {\n                // Start entry: try pairing with best previous event\n                answer = Math.Max(answer, point[2] + maxPrevValue);\n            }\n        }\n\n        return answer;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "create_points": [
        8,
        9,
        10,
        14
      ],
      "initialize": [
        16,
        17
      ],
      "process_end": [
        20,
        21,
        22
      ],
      "process_start": [
        23,
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_end": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxTwoEvents(events [][]int) int {\n    // Create time points: [time, type, value]\n    // type 0 = end (value becomes available), type 1 = start\n    points := make([][3]int, 0, 2*len(events))\n\n    for _, e := range events {\n        points = append(points, [3]int{e[0], 1, e[2]})     // start\n        points = append(points, [3]int{e[1] + 1, 0, e[2]}) // end\n    }\n\n    // Sort by time, then by type (end before start at same time)\n    sort.Slice(points, func(i, j int) bool {\n        if points[i][0] != points[j][0] {\n            return points[i][0] < points[j][0]\n        }\n        return points[i][1] < points[j][1]\n    })\n\n    answer := 0\n    maxPrevValue := 0\n\n    for _, point := range points {\n        if point[1] == 0 {\n            // End entry: this event's value is now available\n            if point[2] > maxPrevValue {\n                maxPrevValue = point[2]\n            }\n        } else {\n            // Start entry: try pairing with best previous event\n            total := point[2] + maxPrevValue\n            if total > answer {\n                answer = total\n            }\n        }\n    }\n\n    return answer\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_points": [
        6,
        7,
        8,
        12
      ],
      "initialize": [
        19,
        20
      ],
      "process_end": [
        23,
        24,
        25,
        26
      ],
      "process_start": [
        28,
        29,
        30,
        31,
        32
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "is_end": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxTwoEvents = function (events) {\n  // Create time points: [time, type, value]\n  // type 0 = end (value becomes available), type 1 = start\n  let points = [];\n\n  for (let [start, end, value] of events) {\n    points.push([start, 1, value]); // start\n    points.push([end + 1, 0, value]); // end (available at endTime+1)\n  }\n\n  // Sort by time, then by type (end before start at same time)\n  points.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));\n\n  let answer = 0;\n  let maxPrevValue = 0;\n\n  for (let [time, type, value] of points) {\n    if (type === 0) {\n      // End entry: this event's value is now available\n      maxPrevValue = Math.max(maxPrevValue, value);\n    } else {\n      // Start entry: try pairing with best previous event\n      answer = Math.max(answer, value + maxPrevValue);\n    }\n  }\n\n  return answer;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "create_points": [
        6,
        7,
        8,
        12
      ],
      "initialize": [
        14,
        15
      ],
      "process_end": [
        18,
        19,
        20
      ],
      "process_start": [
        21,
        22,
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_end": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxTwoEvents(events: number[][]): number {\n    // Create time points: [time, type, value]\n    // type 0 = end (value becomes available), type 1 = start\n    let points: number[][] = [];\n\n    for (let [start, end, value] of events) {\n        points.push([start, 1, value]);       // start\n        points.push([end + 1, 0, value]);     // end (available at endTime+1)\n    }\n\n    // Sort by time, then by type (end before start at same time)\n    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);\n\n    let answer = 0;\n    let maxPrevValue = 0;\n\n    for (let [time, type, value] of points) {\n        if (type === 0) {\n            // End entry: this event's value is now available\n            maxPrevValue = Math.max(maxPrevValue, value);\n        } else {\n            // Start entry: try pairing with best previous event\n            answer = Math.max(answer, value + maxPrevValue);\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "create_points": [
        6,
        7,
        8,
        12
      ],
      "initialize": [
        14,
        15
      ],
      "process_end": [
        18,
        19,
        20
      ],
      "process_start": [
        21,
        22,
        23
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_end": [
        18
      ]
    }
  }
};

const TwoBestNonOverlappingEventsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "events": [
        [
          1,
          3,
          2
        ],
        [
          4,
          5,
          2
        ],
        [
          2,
          4,
          3
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Non-overlapping",
    "value": {
      "events": [
        [
          1,
          2,
          4
        ],
        [
          3,
          4,
          3
        ],
        [
          2,
          3,
          1
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Large values",
    "value": {
      "events": [
        [
          1,
          3,
          4
        ],
        [
          3,
          5,
          2
        ],
        [
          4,
          6,
          3
        ],
        [
          1,
          2,
          5
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Mixed overlap",
    "value": {
      "events": [
        [
          1,
          5,
          3
        ],
        [
          1,
          5,
          1
        ],
        [
          6,
          6,
          5
        ],
        [
          2,
          3,
          1
        ]
      ]
    }
  }
];

function generateTwoBestNonOverlappingEventsSteps(e: any): any[] {
  
let t=[...e.events].map(e=>[...e]),a=new StepRecorder({mode:"sweep",events:t,maxPrevValue:void 0,answer:void 0},{});if(0===t.length)return a.record("complete","No events to process"),a.getSteps();t.forEach((e,t)=>{a.add_new_visual(`event_${t}`,{type:"range",start:e[0],end:e[1],label:`[${e[0]},${e[1]}] val=${e[2]}`})}),a.record("-","Find the maximum sum of values of two non-overlapping events");let i=t.length,r=[];for(let e=0;e<i;e++)r.push([t[e][0],1,t[e][2],e]),r.push([t[e][1]+1,0,t[e][2],e]);r.sort((e,t)=>e[0]!==t[0]?e[0]-t[0]:e[1]-t[1]);let s=r.map(e=>`(t=${e[0]},${0===e[1]?"end":"start"},v=${e[2]})`);a.add_new_visual("points_meta",{type:"metadata",value:`Points: ${s.join(", ")}`}),a.record("create_points",`Created ${r.length} time points and sorted them`);let o=0,l=0;a.update_variable("answer",o),a.update_variable("maxPrevValue",l),a.add_new_visual("answer_meta",{type:"metadata",value:`answer = ${o}`}),a.add_new_visual("maxPrev_meta",{type:"metadata",value:`maxPrevValue = ${l}`}),a.record("initialize","Initialize answer = 0, maxPrevValue = 0");for(let e=0;e<r.length;e++){let[n,i,s,p]=r[e];if(a.update_visual(`event_${p}`,{type:"range",start:t[p][0],end:t[p][1],label:`[${t[p][0]},${t[p][1]}] val=${t[p][2]}`,state:"active"}),a.get_visual("sweep_pointer")?a.update_visual("sweep_pointer",{type:"pointer",position:n,label:`t=${n}`}):a.add_new_visual("sweep_pointer",{type:"pointer",position:n,label:`t=${n}`}),a.update_visual("current_point_meta",{type:"metadata",value:`Current: (time=${n}, ${0===i?"end":"start"}, value=${s})`}),0===i){let e=l;l=Math.max(l,s),a.update_variable("maxPrevValue",l),a.update_visual("maxPrev_meta",{type:"metadata",value:`maxPrevValue = ${l}`}),a.update_visual(`event_${p}`,{type:"range",start:t[p][0],end:t[p][1],label:`[${t[p][0]},${t[p][1]}] val=${t[p][2]}`,state:"processed_end"}),a.add_conditional("is_end",!0),a.record("process_end",`End point: value ${s} now available. maxPrevValue = max(${e}, ${s}) = ${l}`)}else{let e=s+l,n=o;e>o&&(o=e),a.update_variable("answer",o),a.update_visual("answer_meta",{type:"metadata",value:`answer = ${o}`}),a.add_conditional("is_end",!1),a.record("process_start",`Start point: candidate = ${s} + ${l} = ${e}. answer = max(${n}, ${e}) = ${o}`),a.update_visual(`event_${p}`,{type:"range",start:t[p][0],end:t[p][1],label:`[${t[p][0]},${t[p][1]}] val=${t[p][2]}`})}}return a.delete_visual("sweep_pointer"),a.delete_visual("current_point_meta"),a.delete_visual("points_meta"),a.update_visual("answer_meta",{type:"metadata",value:`answer = ${o}`}),a.update_visual("maxPrev_meta",{type:"metadata",value:`maxPrevValue = ${l}`}),a.record("complete",`Maximum sum of two non-overlapping events: ${o}`),a.getSteps()
}

export function TwoBestNonOverlappingEventsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TwoBestNonOverlappingEventsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTwoBestNonOverlappingEventsSteps(e) as any[];
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
      title="Two Best Non-Overlapping Events"
      slug="two-best-non-overlapping-events"
      approaches={approaches}
      presets={TwoBestNonOverlappingEventsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
