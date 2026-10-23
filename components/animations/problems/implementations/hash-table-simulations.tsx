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
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char" || item.type === "stateElement") {
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
// Ransom Note (ransom-note)
// ==========================================

const RansomNoteTemplates = {
  "python": {
    "language": "python",
    "code": "def canConstruct(ransomNote, magazine):\n    count = [0] * 26\n    # Count available characters in magazine\n    for c in magazine:\n        count[ord(c) - ord('a')] += 1\n    # Check if ransom note can be formed\n    for c in ransomNote:\n        count[ord(c) - ord('a')] -= 1\n        if count[ord(c) - ord('a')] < 0:\n            return False\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        7
      ],
      "check_char": [
        7
      ],
      "use_char_step": [
        8
      ],
      "use_char": [
        8
      ],
      "char_not_available": [
        9
      ],
      "return_false": [
        10
      ],
      "return_true": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean canConstruct(String ransomNote, String magazine) {\n    int[] count = new int[26];\n    // Count available characters in magazine\n    for (char c : magazine.toCharArray()) {\n        count[c - 'a']++;\n    }\n    // Check if ransom note can be formed\n    for (char c : ransomNote.toCharArray()) {\n        count[c - 'a']--;\n        if (count[c - 'a'] < 0) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool canConstruct(string ransomNote, string magazine) {\n    int count[26] = {0};\n    // Count available characters in magazine\n    for (char c : magazine) {\n        count[c - 'a']++;\n    }\n    // Check if ransom note can be formed\n    for (char c : ransomNote) {\n        count[c - 'a']--;\n        if (count[c - 'a'] < 0) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool CanConstruct(string ransomNote, string magazine) {\n    int[] count = new int[26];\n    // Count available characters in magazine\n    foreach (char c in magazine) {\n        count[c - 'a']++;\n    }\n    // Check if ransom note can be formed\n    foreach (char c in ransomNote) {\n        count[c - 'a']--;\n        if (count[c - 'a'] < 0) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func canConstruct(ransomNote string, magazine string) bool {\n    count := [26]int{}\n    // Count available characters in magazine\n    for _, c := range magazine {\n        count[c-'a']++\n    }\n    // Check if ransom note can be formed\n    for _, c := range ransomNote {\n        count[c-'a']--\n        if count[c-'a'] < 0 {\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function canConstruct(ransomNote, magazine) {\n    const count = new Array(26).fill(0);\n    // Count available characters in magazine\n    for (const c of magazine) {\n        count[c.charCodeAt(0) - 97]++;\n    }\n    // Check if ransom note can be formed\n    for (const c of ransomNote) {\n        count[c.charCodeAt(0) - 97]--;\n        if (count[c.charCodeAt(0) - 97] < 0) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function canConstruct(ransomNote: string, magazine: string): boolean {\n    const count: number[] = new Array(26).fill(0);\n    // Count available characters in magazine\n    for (const c of magazine) {\n        count[c.charCodeAt(0) - 97]++;\n    }\n    // Check if ransom note can be formed\n    for (const c of ransomNote) {\n        count[c.charCodeAt(0) - 97]--;\n        if (count[c.charCodeAt(0) - 97] < 0) {\n            return false;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_map": [
        2
      ],
      "add_to_map": [
        4,
        5
      ],
      "map_complete": [
        8
      ],
      "check_char": [
        8
      ],
      "use_char_step": [
        9
      ],
      "use_char": [
        9
      ],
      "char_not_available": [
        10
      ],
      "return_false": [
        11
      ],
      "return_true": [
        14
      ]
    }
  }
};

const RansomNotePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Can build",
    "value": {
      "ransomNote": "cat",
      "magazine": "attack"
    }
  },
  {
    "id": "ex2",
    "label": "Not enough",
    "value": {
      "ransomNote": "aa",
      "magazine": "ab"
    }
  },
  {
    "id": "ex3",
    "label": "Missing letter",
    "value": {
      "ransomNote": "abz",
      "magazine": "aabbcc"
    }
  },
  {
    "id": "ex4",
    "label": "Exact match",
    "value": {
      "ransomNote": "aa",
      "magazine": "aab"
    }
  }
];

function generateRansomNoteSteps(e: any): any[] {
  let{ransomNote:t,magazine:a}=e,r=[...t].sort(),i=[...a].sort(),l={};for(let e=0;e<i.length;e++)l[`magazine_${e}`]={type:"arrayElement",value:i[e],position:e,state:"standard"};for(let e=0;e<r.length;e++)l[`ransom_${e}`]={type:"arrayElement",value:r[e],position:e,state:"standard"};l.ptr_mag={type:"pointer",position:0,state:"hidden",label:"i"},l.ptr_ran={type:"pointer",position:0,state:"hidden",label:"j"};let o=new StepRecorder({ransomNote:r.join(""),magazine:i.join(""),i:-1,j:-1,ch:null,magCh:null,isMatch:null,result:null},l),s=e=>{Object.entries(e).forEach(([e,t])=>o.update_variable(e,t))},c=(e,t,a,n)=>{o.update_visual(e,{type:"pointer",position:t,state:a,label:n})},h=(e,t)=>{o.update_visual(`magazine_${e}`,{type:"arrayElement",value:i[e],position:e,state:t})},u=(e,t)=>{o.update_visual(`ransom_${e}`,{type:"arrayElement",value:r[e],position:e,state:t})};o.record("-","Sort both strings, then walk them together with two pointers"),s({i:0,j:0}),o.record("init","Both sorted. i scans the magazine, j the note");let d=0;for(let e=0;e<r.length;e++){let t=r[e];for(c("ptr_ran",e,"active","j"),s({j:e,ch:t}),o.record("need_char",`Need '${t}' from the sorted note`);d<i.length&&i[d]<t;)c("ptr_mag",d,"active","i"),s({i:d,magCh:i[d],isMatch:!1}),h(d,"skipped"),o.record("advance_mag",`magazine[${d}] = '${i[d]}' < '${t}', skip it`),d++;if(d>=i.length||i[d]!==t)return d<i.length?c("ptr_mag",d,"active","i"):c("ptr_mag",0,"hidden","i"),s({i:d,magCh:d<i.length?i[d]:null,isMatch:!1,result:!1}),u(e,"failed"),o.record("mismatch",d>=i.length?`magazine is exhausted, no '${t}' left`:`magazine[${d}] = '${i[d]}' > '${t}', so no '${t}' is available`),o.record("return_false","Return false"),o.getSteps();c("ptr_mag",d,"active","i"),s({i:d,magCh:t,isMatch:!0}),h(d,"used"),u(e,"matched"),o.record("match",`magazine[${d}] = '${t}' matches, use it`),d++}return c("ptr_mag",0,"hidden","i"),c("ptr_ran",0,"hidden","j"),s({i:-1,j:-1,ch:null,magCh:null,result:!0}),o.record("return_true","Every note letter was matched: return true"),o.getSteps()
}

export function RansomNoteProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RansomNoteTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRansomNoteSteps(e) as any[];
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
      title="Ransom Note"
      slug="ransom-note"
      approaches={approaches}
      presets={RansomNotePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Good Pairs (number-of-good-pairs)
// ==========================================

const NumberOfGoodPairsTemplates = {
  "python": {
    "language": "python",
    "code": "def numIdenticalPairs(nums):\n    freq = {}\n    count = 0\n\n    for num in nums:\n        if num in freq:\n            # Increment count by occurrences seen so far\n            count += freq[num]\n            # Increment occurrence count\n            freq[num] += 1\n        else:\n            # First occurrence\n            freq[num] = 1\n\n    return count",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "found_in_map": [
        6
      ],
      "add_pairs": [
        8
      ],
      "update_freq": [
        10
      ],
      "not_in_map": [
        13
      ],
      "add_to_map": [
        13
      ],
      "final": [
        15
      ]
    },
    "conditionalMap": {
      "map_check": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int numIdenticalPairs(int[] nums) {\n        int[] freq = new int[101];\n        int count = 0;\n\n        for (int num : nums) {\n            if (freq[num] > 0) {\n                // Increment count by occurrences seen so far\n                count += freq[num];\n                // Increment occurrence count\n                freq[num]++;\n            } else {\n                // First occurrence\n                freq[num] = 1;\n            }\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init": [
        3,
        4
      ],
      "found_in_map": [
        7
      ],
      "add_pairs": [
        9
      ],
      "update_freq": [
        11
      ],
      "not_in_map": [
        14
      ],
      "add_to_map": [
        14
      ],
      "final": [
        17
      ]
    },
    "conditionalMap": {
      "map_check": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int numIdenticalPairs(vector<int>& nums) {\n        int freq[101] = {0};\n        int count = 0;\n\n        for (int num : nums) {\n            if (freq[num] > 0) {\n                // Increment count by occurrences seen so far\n                count += freq[num];\n                // Increment occurrence count\n                freq[num]++;\n            } else {\n                // First occurrence\n                freq[num] = 1;\n            }\n        }\n        return count;\n    }\n};",
    "lineMap": {
      "start": [
        3
      ],
      "init": [
        4,
        5
      ],
      "found_in_map": [
        8
      ],
      "add_pairs": [
        10
      ],
      "update_freq": [
        12
      ],
      "not_in_map": [
        15
      ],
      "add_to_map": [
        15
      ],
      "final": [
        18
      ]
    },
    "conditionalMap": {
      "map_check": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int NumIdenticalPairs(int[] nums) {\n        int[] freq = new int[101];\n        int count = 0;\n\n        foreach (int num in nums) {\n            if (freq[num] > 0) {\n                // Increment count by occurrences seen so far\n                count += freq[num];\n                // Increment occurrence count\n                freq[num]++;\n            } else {\n                // First occurrence\n                freq[num] = 1;\n            }\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "start": [
        2
      ],
      "init": [
        3,
        4
      ],
      "found_in_map": [
        7
      ],
      "add_pairs": [
        9
      ],
      "update_freq": [
        11
      ],
      "not_in_map": [
        14
      ],
      "add_to_map": [
        14
      ],
      "final": [
        17
      ]
    },
    "conditionalMap": {
      "map_check": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numIdenticalPairs(nums []int) int {\n    freq := [101]int{}\n    count := 0\n\n    for _, num := range nums {\n        if freq[num] > 0 {\n            // Increment count by occurrences seen so far\n            count += freq[num]\n            // Increment occurrence count\n            freq[num]++\n        } else {\n            // First occurrence\n            freq[num] = 1\n        }\n    }\n    return count\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "found_in_map": [
        6
      ],
      "add_pairs": [
        8
      ],
      "update_freq": [
        10
      ],
      "not_in_map": [
        13
      ],
      "add_to_map": [
        13
      ],
      "final": [
        16
      ]
    },
    "conditionalMap": {
      "map_check": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numIdenticalPairs(nums) {\n    const freq = new Array(101).fill(0);\n    let count = 0;\n\n    for (const num of nums) {\n        if (freq[num] > 0) {\n            // Increment count by occurrences seen so far\n            count += freq[num];\n            // Increment occurrence count\n            freq[num]++;\n        } else {\n            // First occurrence\n            freq[num] = 1;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "found_in_map": [
        6
      ],
      "add_pairs": [
        8
      ],
      "update_freq": [
        10
      ],
      "not_in_map": [
        13
      ],
      "add_to_map": [
        13
      ],
      "final": [
        16
      ]
    },
    "conditionalMap": {
      "map_check": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numIdenticalPairs(nums: number[]): number {\n    const freq: number[] = new Array(101).fill(0);\n    let count = 0;\n\n    for (const num of nums) {\n        if (freq[num] > 0) {\n            // Increment count by occurrences seen so far\n            count += freq[num];\n            // Increment occurrence count\n            freq[num]++;\n        } else {\n            // First occurrence\n            freq[num] = 1;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "found_in_map": [
        6
      ],
      "add_pairs": [
        8
      ],
      "update_freq": [
        10
      ],
      "not_in_map": [
        13
      ],
      "add_to_map": [
        13
      ],
      "final": [
        16
      ]
    },
    "conditionalMap": {
      "map_check": [
        6
      ]
    }
  }
};

const NumberOfGoodPairsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        2,
        3,
        1,
        1,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  }
];

function generateNumberOfGoodPairsSteps(e: any): any[] {
  let t=[...e.nums],n=t.length,r={};for(let e=0;e<n;e++)r[`elem_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};r.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let a=new StepRecorder({nums:[...t],i:-1,num:null,count:0,freqOrder:[],prevIndices:[],pairsAdded:null,isFound:null,result:null},r),l=e=>{Object.entries(e).forEach(([e,t])=>a.update_variable(e,t))},s=(e,t)=>{a.update_visual("ptr_i",{type:"pointer",position:e,state:t,label:"i"})};a.record("start",'A pair (i, j) is "good" when nums[i] = nums[j] and i < j');let o=Array(101).fill(0),u=[],c=0,d=()=>u.map(e=>({value:e,count:o[e]}));l({count:0,freqOrder:[]}),a.record("init","count = 0, and an empty frequency map");for(let e=0;e<n;e++){let n=t[e],i=o[n],r=[];for(let i=0;i<e;i++)t[i]===n&&r.push(i);s(e,"active"),i>0?(l({i:e,num:n,isFound:!0,prevIndices:r,pairsAdded:i,freqOrder:d()}),a.add_conditional("map_check",!0),a.record("found_in_map",`${n} already appeared ${i} time${1===i?"":"s"}`),l({count:c+=i}),a.record("add_pairs",`+${i} good pair${1===i?"":"s"} → count = ${c}`),o[n]=i+1,l({freqOrder:d(),prevIndices:[],pairsAdded:null}),a.record("update_freq",`freq[${n}] = ${i+1}`)):(u.push(n),o[n]=1,l({i:e,num:n,isFound:!1,prevIndices:[],pairsAdded:null}),a.add_conditional("map_check",!1),a.record("not_in_map",`${n} seen for the first time`),l({freqOrder:d()}),a.record("add_to_map",`freq[${n}] = 1`)),a.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"complete"})}return s(0,"hidden"),l({i:-1,num:null,isFound:null,result:c}),a.record("final",`${c} good pair${1===c?"":"s"} total`),a.getSteps()
}

export function NumberOfGoodPairsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfGoodPairsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfGoodPairsSteps(e) as any[];
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
      title="Number of Good Pairs"
      slug="number-of-good-pairs"
      approaches={approaches}
      presets={NumberOfGoodPairsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Number of Balloons (maximum-number-of-balloons)
// ==========================================

const MaximumNumberOfBalloonsTemplates = {
  "python": {
    "language": "python",
    "code": "def maxNumberOfBalloons(text):\n    count = {}\n    for c in text:\n        count[c] = count.get(c, 0) + 1\n    result = count.get('b', 0)\n    result = min(result, count.get('a', 0))\n    result = min(result, count.get('l', 0) // 2)\n    result = min(result, count.get('o', 0) // 2)\n    result = min(result, count.get('n', 0))\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        5
      ],
      "check_a": [
        6
      ],
      "check_l": [
        7
      ],
      "check_o": [
        8
      ],
      "check_n": [
        9
      ],
      "return_result": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxNumberOfBalloons(String text) {\n    Map<Character, Integer> count = new HashMap<>();\n    for (char c : text.toCharArray()) {\n        count.merge(c, 1, Integer::sum);\n    }\n    int result = count.getOrDefault('b', 0);\n    result = Math.min(result, count.getOrDefault('a', 0));\n    result = Math.min(result, count.getOrDefault('l', 0) / 2);\n    result = Math.min(result, count.getOrDefault('o', 0) / 2);\n    result = Math.min(result, count.getOrDefault('n', 0));\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxNumberOfBalloons(string text) {\n    unordered_map<char, int> count;\n    for (char c : text) {\n        count[c]++;\n    }\n    int result = count['b'];\n    result = min(result, count['a']);\n    result = min(result, count['l'] / 2);\n    result = min(result, count['o'] / 2);\n    result = min(result, count['n']);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxNumberOfBalloons(string text) {\n    Dictionary<char, int> count = new Dictionary<char, int>();\n    foreach (char c in text) {\n        count[c] = count.GetValueOrDefault(c, 0) + 1;\n    }\n    int result = count.GetValueOrDefault('b', 0);\n    result = Math.Min(result, count.GetValueOrDefault('a', 0));\n    result = Math.Min(result, count.GetValueOrDefault('l', 0) / 2);\n    result = Math.Min(result, count.GetValueOrDefault('o', 0) / 2);\n    result = Math.Min(result, count.GetValueOrDefault('n', 0));\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxNumberOfBalloons(text string) int {\n    count := make(map[rune]int)\n    for _, c := range text {\n        count[c]++\n    }\n    result := count['b']\n    result = min(result, count['a'])\n    result = min(result, count['l']/2)\n    result = min(result, count['o']/2)\n    result = min(result, count['n'])\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxNumberOfBalloons(text) {\n    const count = {};\n    for (const c of text) {\n        count[c] = (count[c] || 0) + 1;\n    }\n    let result = count['b'] || 0;\n    result = Math.min(result, count['a'] || 0);\n    result = Math.min(result, Math.floor((count['l'] || 0) / 2));\n    result = Math.min(result, Math.floor((count['o'] || 0) / 2));\n    result = Math.min(result, count['n'] || 0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxNumberOfBalloons(text: string): number {\n    const count: Record<string, number> = {};\n    for (const c of text) {\n        count[c] = (count[c] || 0) + 1;\n    }\n    let result = count['b'] || 0;\n    result = Math.min(result, count['a'] || 0);\n    result = Math.min(result, Math.floor((count['l'] || 0) / 2));\n    result = Math.min(result, Math.floor((count['o'] || 0) / 2));\n    result = Math.min(result, count['n'] || 0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "check_b": [
        6
      ],
      "check_a": [
        7
      ],
      "check_l": [
        8
      ],
      "check_o": [
        9
      ],
      "check_n": [
        10
      ],
      "return_result": [
        11
      ]
    }
  }
};

const MaximumNumberOfBalloonsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "One balloon",
    "value": {
      "text": "nlaebolko"
    }
  },
  {
    "id": "ex2",
    "label": "Two balloons",
    "value": {
      "text": "balloonballoon"
    }
  },
  {
    "id": "ex3",
    "label": "'o' bottleneck",
    "value": {
      "text": "balloonballon"
    }
  },
  {
    "id": "ex4",
    "label": "None",
    "value": {
      "text": "leetcode"
    }
  }
];

function generateMaximumNumberOfBalloonsSteps(e: any): any[] {
  let r={b:1,a:1,l:2,o:2,n:1},a=['b','a','l','o','n'];
let{text:t}=e,n={};for(let e=0;e<t.length;e++)n[`text_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};n.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let i=new StepRecorder({text:t,i:-1,phase:null,c:null,isBalloon:null,counts:{b:0,a:0,l:0,o:0,n:0},needs:r,checkLetter:null,quotient:null,runningMin:null,result:null},n),o=e=>{Object.entries(e).forEach(([e,t])=>i.update_variable(e,t))},s=(e,t)=>{i.update_visual("ptr_i",{type:"pointer",position:e,state:t,label:"i"})};i.record("-",'How many times can you spell "balloon"? The scarcest letter caps it');let c={b:0,a:0,l:0,o:0,n:0};o({phase:"count"}),i.record("init_count","Count how many of each letter you have");for(let e=0;e<t.length;e++){let n=t[e],l=Object.prototype.hasOwnProperty.call(r,n);l&&(c[n]+=1),s(e,"active"),o({i:e,phase:"count",c:n,isBalloon:l,counts:{...c}}),i.record("count_loop",l?`count['${n}'] = ${c[n]}`:`'${n}' is not in "balloon", skip`)}s(0,"hidden"),o({i:-1,phase:"min",c:null,isBalloon:null,runningMin:null});let u=1/0;for(let e of a){let t=r[e],n=Math.floor(c[e]/t);u=Math.min(u,n),o({phase:"min",checkLetter:e,quotient:n,runningMin:u,result:u}),i.record(`check_${e}`,1===t?`'${e}': ${c[e]} → supplies ${n}`:`'${e}': ${c[e]} \xf7 ${t} → supplies ${n}`)}return o({phase:"min",checkLetter:null,result:u}),i.record("return_result",`Answer: ${u} balloon${1===u?"":"s"}`),i.getSteps()
}

export function MaximumNumberOfBalloonsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumNumberOfBalloonsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumNumberOfBalloonsSteps(e) as any[];
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
      title="Maximum Number of Balloons"
      slug="maximum-number-of-balloons"
      approaches={approaches}
      presets={MaximumNumberOfBalloonsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Contains Duplicate II (contains-duplicate-ii)
// ==========================================

const ContainsDuplicateIiTemplates = {
  "python": {
    "language": "python",
    "code": "def containsNearbyDuplicate(nums, k):\n    for i in range(len(nums)):\n        for j in range(max(0, i - k), i):\n            if nums[i] == nums[j]:\n                return True\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        3,
        4
      ],
      "found": [
        4
      ],
      "return_true": [
        5
      ],
      "return_false": [
        6
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        3
      ],
      "is_equal": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean containsNearbyDuplicate(int[] nums, int k) {\n    for (int i = 0; i < nums.length; i++) {\n        for (int j = Math.max(0, i - k); j < i; j++) {\n            if (nums[i] == nums[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        3,
        4
      ],
      "found": [
        4
      ],
      "return_true": [
        5
      ],
      "return_false": [
        9
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        3
      ],
      "is_equal": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool containsNearbyDuplicate(vector<int>& nums, int k) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        for (int j = max(0, i - k); j < i; j++) {\n            if (nums[i] == nums[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        3
      ],
      "compare": [
        4,
        5
      ],
      "found": [
        5
      ],
      "return_true": [
        6
      ],
      "return_false": [
        10
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        3
      ],
      "inner_loop": [
        4
      ],
      "is_equal": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool ContainsNearbyDuplicate(int[] nums, int k) {\n    for (int i = 0; i < nums.Length; i++) {\n        for (int j = Math.Max(0, i - k); j < i; j++) {\n            if (nums[i] == nums[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        3,
        4
      ],
      "found": [
        4
      ],
      "return_true": [
        5
      ],
      "return_false": [
        9
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        3
      ],
      "is_equal": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func containsNearbyDuplicate(nums []int, k int) bool {\n    for i := 0; i < len(nums); i++ {\n        start := i - k\n        if start < 0 {\n            start = 0\n        }\n        for j := start; j < i; j++ {\n            if nums[i] == nums[j] {\n                return true\n            }\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        7,
        8
      ],
      "found": [
        8
      ],
      "return_true": [
        9
      ],
      "return_false": [
        13
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        7
      ],
      "is_equal": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function containsNearbyDuplicate(nums, k) {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = Math.max(0, i - k); j < i; j++) {\n            if (nums[i] === nums[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        3,
        4
      ],
      "found": [
        4
      ],
      "return_true": [
        5
      ],
      "return_false": [
        9
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        3
      ],
      "is_equal": [
        4
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function containsNearbyDuplicate(nums: number[], k: number): boolean {\n    for (let i = 0; i < nums.length; i++) {\n        for (let j = Math.max(0, i - k); j < i; j++) {\n            if (nums[i] === nums[j]) {\n                return true;\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer": [
        2
      ],
      "compare": [
        3,
        4
      ],
      "found": [
        4
      ],
      "return_true": [
        5
      ],
      "return_false": [
        9
      ]
    },
    "conditionalMap": {
      "outer_loop": [
        2
      ],
      "inner_loop": [
        3
      ],
      "is_equal": [
        4
      ]
    }
  }
};

const ContainsDuplicateIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Within k",
    "value": {
      "nums": [
        1,
        2,
        3,
        1
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Too far",
    "value": {
      "nums": [
        1,
        2,
        3,
        1
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Adjacent",
    "value": {
      "nums": [
        1,
        0,
        1,
        1
      ],
      "k": 1
    }
  },
  {
    "id": "ex4",
    "label": "All distinct",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 2
    }
  }
];

function generateContainsDuplicateIiSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=Math.floor(Number(e?.k)),r=Number.isFinite(n)&&n>0?n:0,l=t.length,a={};t.forEach((e,t)=>{a[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let s=new StepRecorder({nums:[...t],k:r,i:-1,j:-1,comparisons:0,result:null},a);s.record("-",`Check every pair no more than k = ${r} apart, and stop at the first repeat`);let o=0;for(let e=0;e<l;e++){let n=Math.max(0,e-r);s.update_variable("i",e),s.update_variable("lo",n),s.update_variable("num",t[e]),s.delete_variable("other"),s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.delete_visual("ptr_j"),s.add_conditional("outer_loop",!0),s.record("outer",n<e?`Fix i = ${e} (value ${t[e]}) and look back at indices ${n} to ${e-1}`:`Fix i = ${e} (value ${t[e]}), no earlier index is within k of it`);for(let i=n;i<e;i++){let n=t[e]===t[i];if(o++,s.update_variable("j",i),s.update_variable("other",t[i]),s.update_variable("comparisons",o),s.update_visual("ptr_j",{type:"pointer",position:i,label:"j"}),s.add_conditional("inner_loop",!0),s.add_conditional("is_equal",n),n)return s.update_variable("match",!0),s.update_variable("result",!0),s.record("found",`nums[${i}] and nums[${e}] are both ${t[e]}, and ${e} - ${i} = ${e-i} is at most ${r}`),s.record("return_true","A duplicate lies within k, return true"),s.getSteps();s.update_variable("match",!1),s.record("compare",`nums[${i}] = ${t[i]} and nums[${e}] = ${t[e]} differ, keep looking`)}n<e&&s.add_conditional("inner_loop",!1)}return s.add_conditional("outer_loop",!1),s.delete_visual("ptr_i"),s.delete_visual("ptr_j"),s.delete_variable("other"),s.update_variable("result",!1),s.record("return_false",`No pair within ${r} repeats after ${o} comparison${1===o?"":"s"}, return false`),s.getSteps()
}

export function ContainsDuplicateIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContainsDuplicateIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContainsDuplicateIiSteps(e) as any[];
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
      title="Contains Duplicate II"
      slug="contains-duplicate-ii"
      approaches={approaches}
      presets={ContainsDuplicateIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Isomorphic Strings (isomorphic-strings)
// ==========================================

const IsomorphicStringsTemplates = {
  "python": {
    "language": "python",
    "code": "def isIsomorphic(s, t):\n    if len(s) != len(t):\n        return False\n    last_seen_s = {}\n    last_seen_t = {}\n    for i, (char_s, char_t) in enumerate(zip(s, t)):\n        if last_seen_s.get(char_s, -1) != last_seen_t.get(char_t, -1):\n            return False\n        last_seen_s[char_s] = i\n        last_seen_t[char_t] = i\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        6
      ],
      "compare_idx": [
        7
      ],
      "mismatch_idx": [
        8
      ],
      "update": [
        9,
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "idx_match": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isIsomorphic(String s, String t) {\n    if (s.length() != t.length()) return false;\n    int[] lastSeenS = new int[256];\n    int[] lastSeenT = new int[256];\n    Arrays.fill(lastSeenS, -1);\n    Arrays.fill(lastSeenT, -1);\n    for (int i = 0; i < s.length(); i++) {\n        char charS = s.charAt(i);\n        char charT = t.charAt(i);\n        if (lastSeenS[charS] != lastSeenT[charT]) {\n            return false;\n        }\n        lastSeenS[charS] = i;\n        lastSeenT[charT] = i;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        2
      ],
      "loop": [
        7,
        8,
        9
      ],
      "compare_idx": [
        10
      ],
      "mismatch_idx": [
        11
      ],
      "update": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "idx_match": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isIsomorphic(string s, string t) {\n    if (s.size() != t.size()) return false;\n    int lastSeenS[256], lastSeenT[256];\n    fill(lastSeenS, lastSeenS + 256, -1);\n    fill(lastSeenT, lastSeenT + 256, -1);\n    for (int i = 0; i < s.size(); i++) {\n        if (lastSeenS[(unsigned char)s[i]] != lastSeenT[(unsigned char)t[i]]) {\n            return false;\n        }\n        lastSeenS[(unsigned char)s[i]] = i;\n        lastSeenT[(unsigned char)t[i]] = i;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        2
      ],
      "loop": [
        6
      ],
      "compare_idx": [
        7
      ],
      "mismatch_idx": [
        8
      ],
      "update": [
        10,
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "idx_match": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsIsomorphic(string s, string t) {\n    if (s.Length != t.Length) return false;\n    int[] lastSeenS = new int[256];\n    int[] lastSeenT = new int[256];\n    Array.Fill(lastSeenS, -1);\n    Array.Fill(lastSeenT, -1);\n    for (int i = 0; i < s.Length; i++) {\n        char charS = s[i];\n        char charT = t[i];\n        if (lastSeenS[charS] != lastSeenT[charT]) {\n            return false;\n        }\n        lastSeenS[charS] = i;\n        lastSeenT[charT] = i;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        2
      ],
      "loop": [
        7,
        8,
        9
      ],
      "compare_idx": [
        10
      ],
      "mismatch_idx": [
        11
      ],
      "update": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "idx_match": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isIsomorphic(s string, t string) bool {\n    if len(s) != len(t) {\n        return false\n    }\n    var lastSeenS, lastSeenT [256]int\n    for i := range lastSeenS {\n        lastSeenS[i] = -1\n        lastSeenT[i] = -1\n    }\n    for i := 0; i < len(s); i++ {\n        if lastSeenS[s[i]] != lastSeenT[t[i]] {\n            return false\n        }\n        lastSeenS[s[i]] = i\n        lastSeenT[t[i]] = i\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        10
      ],
      "compare_idx": [
        11
      ],
      "mismatch_idx": [
        12
      ],
      "update": [
        14,
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "idx_match": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isIsomorphic(s, t) {\n    if (s.length !== t.length) return false;\n    const lastSeenS = new Array(256).fill(-1);\n    const lastSeenT = new Array(256).fill(-1);\n    for (let i = 0; i < s.length; i++) {\n        const codeS = s.charCodeAt(i);\n        const codeT = t.charCodeAt(i);\n        if (lastSeenS[codeS] !== lastSeenT[codeT]) {\n            return false;\n        }\n        lastSeenS[codeS] = i;\n        lastSeenT[codeT] = i;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        2
      ],
      "loop": [
        5,
        6,
        7
      ],
      "compare_idx": [
        8
      ],
      "mismatch_idx": [
        9
      ],
      "update": [
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "idx_match": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isIsomorphic(s: string, t: string): boolean {\n    if (s.length !== t.length) return false;\n    const lastSeenS = new Array<number>(256).fill(-1);\n    const lastSeenT = new Array<number>(256).fill(-1);\n    for (let i = 0; i < s.length; i++) {\n        const codeS = s.charCodeAt(i);\n        const codeT = t.charCodeAt(i);\n        if (lastSeenS[codeS] !== lastSeenT[codeT]) {\n            return false;\n        }\n        lastSeenS[codeS] = i;\n        lastSeenT[codeT] = i;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "length_check": [
        2
      ],
      "mismatch_len": [
        2
      ],
      "loop": [
        5,
        6,
        7
      ],
      "compare_idx": [
        8
      ],
      "mismatch_idx": [
        9
      ],
      "update": [
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "idx_match": [
        8
      ]
    }
  }
};

const IsomorphicStringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Isomorphic",
    "value": {
      "s": "egg",
      "t": "add"
    }
  },
  {
    "id": "ex2",
    "label": "s-side clash",
    "value": {
      "s": "foo",
      "t": "bar"
    }
  },
  {
    "id": "ex3",
    "label": "t-side clash",
    "value": {
      "s": "badc",
      "t": "baba"
    }
  },
  {
    "id": "ex4",
    "label": "Longer match",
    "value": {
      "s": "paper",
      "t": "title"
    }
  }
];

function generateIsomorphicStringsSteps(e: any): any[] {
  let{s:t,t:n}=e,r={};for(let e=0;e<t.length;e++)r[`s_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};for(let e=0;e<n.length;e++)r[`t_${e}`]={type:"arrayElement",value:n[e],position:e,state:"standard"};r.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let l=new StepRecorder({s:t,t:n,sLen:t.length,tLen:n.length,i:-1,cs:null,ct:null,prevS:null,prevT:null,match:null,conflict:null,result:null},r),a=e=>{Object.entries(e).forEach(([e,t])=>l.update_variable(e,t))},s=(e,t)=>{l.update_visual("ptr_i",{type:"pointer",position:e,state:t,label:"i"})};if(l.record("-","Compare where each character was last seen in s and in t"),t.length!==n.length)return a({conflict:"length",result:!1}),l.record("length_check",`Lengths differ: ${t.length} ≠ ${n.length}`),l.record("mismatch_len","Return false"),l.getSteps();l.record("length_check",`Lengths match: ${t.length} = ${n.length}`);let c=Array(256).fill(-1),h=Array(256).fill(-1);for(let e=0;e<t.length;e++){let i=t[e],r=n[e],o=c[i.charCodeAt(0)],d=h[r.charCodeAt(0)];s(e,"active"),a({i:e,cs:i,ct:r,prevS:o,prevT:d,match:null,conflict:null}),l.record("loop",`Column ${e}: '${i}' / '${r}'`);let p=o===d;if(l.add_conditional("idx_match",p),a({match:p,conflict:p?null:"idx"}),l.record("compare_idx",`last '${i}' in s = ${-1===o?"none":o}, last '${r}' in t = ${-1===d?"none":d}`),!p)return a({result:!1}),l.record("mismatch_idx",`Previous indices differ (${o} vs ${d}): not isomorphic`),l.getSteps();c[i.charCodeAt(0)]=e,h[r.charCodeAt(0)]=e,a({prevS:e,prevT:e}),l.record("update",`Remember '${i}' and '${r}' were last seen at index ${e}`)}return s(Math.max(0,t.length-1),"idle"),a({i:t.length,result:!0}),l.record("complete","Every column's last-seen indices agree: return true"),l.getSteps()
}

export function IsomorphicStringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IsomorphicStringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIsomorphicStringsSteps(e) as any[];
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
      title="Isomorphic Strings"
      slug="isomorphic-strings"
      approaches={approaches}
      presets={IsomorphicStringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Group Anagrams (group-anagrams)
// ==========================================

const GroupAnagramsTemplates = {
  "python": {
    "language": "python",
    "code": "def groupAnagrams(strs):\n    anagram_map = {}\n\n    for word in strs:\n        # Count character frequency\n        char_count = [0] * 26\n        for c in word:\n            char_count[ord(c) - ord('a')] += 1\n\n        # Build key based on character counts\n        key_parts = []\n        for i in range(26):\n            if char_count[i] > 0:\n                char = chr(i + ord('a'))\n                key_parts.append(f\"{char}:{char_count[i]}\")\n        key = ','.join(key_parts)\n\n        # Add word to group\n        if key not in anagram_map:\n            anagram_map[key] = []\n        anagram_map[key].append(word)\n\n    return list(anagram_map.values())",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        8
      ],
      "build_key": [
        11,
        16
      ],
      "create_group": [
        19,
        20
      ],
      "found_group": [
        19
      ],
      "add_to_group": [
        21
      ],
      "complete": [
        23
      ],
      "return_result": [
        23
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> anagramMap = new HashMap<>();\n\n    for (String word : strs) {\n        // Count character frequency\n        int[] charCount = new int[26];\n        for (char c : word.toCharArray()) {\n            charCount[c - 'a']++;\n        }\n\n        // Build key based on character counts\n        StringBuilder keyBuilder = new StringBuilder();\n        for (int i = 0; i < 26; i++) {\n            if (charCount[i] > 0) {\n                char ch = (char) (i + 'a');\n                keyBuilder.append(ch).append(\":\").append(charCount[i]).append(\",\");\n            }\n        }\n        String key = keyBuilder.toString();\n\n        // Add word to group\n        anagramMap.putIfAbsent(key, new ArrayList<>());\n        anagramMap.get(key).add(word);\n    }\n\n    return new ArrayList<>(anagramMap.values());\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "create_group": [
        22
      ],
      "found_group": [
        22
      ],
      "add_to_group": [
        23
      ],
      "complete": [
        26
      ],
      "return_result": [
        26
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> anagramMap;\n\n    for (const string& word : strs) {\n        // Count character frequency\n        int charCount[26] = {0};\n        for (char c : word) {\n            charCount[c - 'a']++;\n        }\n\n        // Build key based on character counts\n        string key;\n        for (int i = 0; i < 26; i++) {\n            if (charCount[i] > 0) {\n                char ch = 'a' + i;\n                key += ch;\n                key += \":\";\n                key += to_string(charCount[i]);\n                key += \",\";\n            }\n        }\n\n        // Add word to group\n        anagramMap[key].push_back(word);\n    }\n\n    vector<vector<string>> result;\n    for (auto& pair : anagramMap) {\n        result.push_back(pair.second);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "create_group": [
        25
      ],
      "found_group": [
        25
      ],
      "add_to_group": [
        25
      ],
      "complete": [
        31
      ],
      "return_result": [
        28,
        29,
        30,
        31
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<string>> GroupAnagrams(string[] strs) {\n    Dictionary<string, List<string>> anagramMap = new Dictionary<string, List<string>>();\n\n    foreach (string word in strs) {\n        // Count character frequency\n        int[] charCount = new int[26];\n        foreach (char c in word) {\n            charCount[c - 'a']++;\n        }\n\n        // Build key based on character counts\n        StringBuilder keyBuilder = new StringBuilder();\n        for (int i = 0; i < 26; i++) {\n            if (charCount[i] > 0) {\n                char ch = (char)(i + 'a');\n                keyBuilder.Append(ch).Append(\":\").Append(charCount[i]).Append(\",\");\n            }\n        }\n        string key = keyBuilder.ToString();\n\n        // Add word to group\n        if (!anagramMap.ContainsKey(key)) {\n            anagramMap[key] = new List<string>();\n        }\n        anagramMap[key].Add(word);\n    }\n\n    return new List<IList<string>>(anagramMap.Values);\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "create_group": [
        22,
        23
      ],
      "found_group": [
        22
      ],
      "add_to_group": [
        25
      ],
      "complete": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func groupAnagrams(strs []string) [][]string {\n    anagramMap := make(map[string][]string)\n\n    for _, word := range strs {\n        // Count character frequency\n        charCount := make([]int, 26)\n        for _, c := range word {\n            charCount[c - 'a']++\n        }\n\n        // Build key based on character counts\n        keyParts := []string{}\n        for i := 0; i < 26; i++ {\n            if charCount[i] > 0 {\n                char := string('a' + i)\n                keyParts = append(keyParts, fmt.Sprintf(\"%s:%d\", char, charCount[i]))\n            }\n        }\n        key := strings.Join(keyParts, \",\")\n\n        // Add word to group\n        anagramMap[key] = append(anagramMap[key], word)\n    }\n\n    result := [][]string{}\n    for _, group := range anagramMap {\n        result = append(result, group)\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "create_group": [
        22
      ],
      "found_group": [
        22
      ],
      "add_to_group": [
        22
      ],
      "complete": [
        29
      ],
      "return_result": [
        25,
        26,
        27,
        28
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function groupAnagrams(strs) {\n    const anagramMap = new Map();\n\n    for (const word of strs) {\n        // Count character frequency\n        const charCount = new Array(26).fill(0);\n        for (const c of word) {\n            charCount[c.charCodeAt(0) - 'a'.charCodeAt(0)]++;\n        }\n\n        // Build key based on character counts\n        const keyParts = [];\n        for (let i = 0; i < 26; i++) {\n            if (charCount[i] > 0) {\n                const char = String.fromCharCode(i + 'a'.charCodeAt(0));\n                keyParts.push(`${char}:${charCount[i]}`);\n            }\n        }\n        const key = keyParts.join(',');\n\n        // Add word to group\n        if (!anagramMap.has(key)) {\n            anagramMap.set(key, []);\n        }\n        anagramMap.get(key).push(word);\n    }\n\n    return Array.from(anagramMap.values());\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "create_group": [
        22,
        23
      ],
      "found_group": [
        22
      ],
      "add_to_group": [
        25
      ],
      "complete": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function groupAnagrams(strs: string[]): string[][] {\n    const anagramMap = new Map<string, string[]>();\n\n    for (const word of strs) {\n        // Count character frequency\n        const charCount: number[] = new Array(26).fill(0);\n        for (const c of word) {\n            charCount[c.charCodeAt(0) - 'a'.charCodeAt(0)]++;\n        }\n\n        // Build key based on character counts\n        const keyParts: string[] = [];\n        for (let i = 0; i < 26; i++) {\n            if (charCount[i] > 0) {\n                const char = String.fromCharCode(i + 'a'.charCodeAt(0));\n                keyParts.push(`${char}:${charCount[i]}`);\n            }\n        }\n        const key = keyParts.join(',');\n\n        // Add word to group\n        if (!anagramMap.has(key)) {\n            anagramMap.set(key, []);\n        }\n        anagramMap.get(key)!.push(word);\n    }\n\n    return Array.from(anagramMap.values());\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        2
      ],
      "process_word": [
        4
      ],
      "count_chars": [
        6,
        9
      ],
      "build_key": [
        12,
        13,
        14,
        15,
        16,
        17,
        18
      ],
      "create_group": [
        22,
        23
      ],
      "found_group": [
        22
      ],
      "add_to_group": [
        25
      ],
      "complete": [
        28
      ],
      "return_result": [
        28
      ]
    },
    "conditionalMap": {}
  }
};

const GroupAnagramsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "strs": [
        "eat",
        "tea",
        "tan",
        "ate",
        "nat",
        "bat"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "strs": [
        "abc",
        "bca",
        "cab",
        "xyz",
        "zyx",
        "yxz"
      ]
    }
  }
];

function generateGroupAnagramsSteps(e: any): any[] {
  let{strs:r}=e,t={};for(let e=0;e<r.length;e++)t[`word_${e}`]={type:"arrayElement",value:r[e],position:e,state:"pending"};let n=new StepRecorder({},t),s=()=>{n.delete_variable("activeWord"),n.delete_variable("signature"),n.delete_variable("sigKey"),n.delete_variable("matched"),n.delete_variable("justAddedWord")},o=[],i=new Map,l=()=>o.forEach(e=>e.flash=null),u=()=>n.update_variable("buckets",o);n.record("-","Start: group words that are anagrams of each other"),n.update_variable("buckets",o),n.record("init_map","Create an empty hash map: signature -> group of words");for(let e=0;e<r.length;e++){let t=r[e];for(let t=0;t<r.length;t++){let r=t<e?"done":t===e?"active":"pending",a=n.get_visual(`word_${t}`);n.update_visual(`word_${t}`,{...a,state:r})}l(),s(),n.update_variable("activeWord",e),u(),n.record("process_word",`Take the next word: "${t}"`);let a=Array(26).fill(0);for(let e=0;e<t.length;e++)a[t.charCodeAt(e)-97]++;let d=[];for(let e=0;e<26;e++)a[e]>0&&d.push({ch:String.fromCharCode(e+97),count:a[e]});let g=d.map(e=>`${e.ch}:${e.count}`).join(",");if(n.update_variable("activeWord",e),n.update_variable("signature",d),n.update_variable("sigKey",g),n.record("count_chars",`Count letters in "${t}"`),n.record("build_key",`Build its frequency signature: {${g}}`),i.has(g))l(),o[i.get(g)].flash="add",n.update_variable("matched",!0),u(),n.record("found_group","Seen this signature before: reuse its group");else{let e={key:g,sig:d,words:[],flash:"new"};i.set(g,o.length),o.push(e),n.update_variable("matched",!1),u(),n.record("create_group","New signature: start a fresh group")}l();let c=i.get(g);o[c].words.push(t),o[c].flash=1===o[c].words.length?"new":"add",n.update_variable("justAddedWord",t),u(),n.record("add_to_group",`Add "${t}" to its group`)}for(let e=0;e<r.length;e++){let r=n.get_visual(`word_${e}`);n.update_visual(`word_${e}`,{...r,state:"done"})}return l(),s(),n.update_variable("done",!0),u(),n.record("complete",`Done: ${o.length} anagram group${1===o.length?"":"s"} found`),n.record("return_result","Return the grouped words"),n.getSteps()
}

export function GroupAnagramsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GroupAnagramsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGroupAnagramsSteps(e) as any[];
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
      title="Group Anagrams"
      slug="group-anagrams"
      approaches={approaches}
      presets={GroupAnagramsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reorganize String (reorganize-string)
// ==========================================

const ReorganizeStringTemplates = {
  "python": {
    "language": "python",
    "code": "def reorganizeString(s):\n    freq = [0] * 26\n    for c in s:\n        freq[ord(c) - ord('a')] += 1\n    n = len(s)\n    # Check impossibility\n    if max(freq) > (n + 1) // 2:\n        return \"\"\n    # Sort characters by frequency descending\n    sorted_chars = sorted(range(26), key=lambda i: -freq[i])\n    # Fill result at even indices first, then odd\n    result = [''] * n\n    idx = 0\n    for i in sorted_chars:\n        count = freq[i]\n        while count > 0:\n            result[idx] = chr(i + ord('a'))\n            idx += 2\n            if idx >= n:\n                idx = 1\n            count -= 1\n    return ''.join(result)",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        7
      ],
      "impossible": [
        8
      ],
      "possible": [
        7
      ],
      "sort_freqs": [
        10
      ],
      "init_result": [
        12
      ],
      "place_char": [
        17
      ],
      "switch_odd": [
        19
      ],
      "complete": [
        22
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "check_possible": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String reorganizeString(String s) {\n    int[] freq = new int[26];\n    for (char c : s.toCharArray()) {\n        freq[c - 'a']++;\n    }\n    int n = s.length();\n    // Check impossibility\n    for (int f : freq) {\n        if (f > (n + 1) / 2) return \"\";\n    }\n    // Build sorted list of characters by frequency (descending)\n    List<int[]> sorted = new ArrayList<>();\n    for (int i = 0; i < 26; i++) {\n        if (freq[i] > 0) {\n            sorted.add(new int[]{freq[i], i});\n        }\n    }\n    sorted.sort((a, b) -> b[0] - a[0]);\n    // Fill result at even indices first, then odd\n    char[] result = new char[n];\n    int idx = 0;\n    for (int[] entry : sorted) {\n        int count = entry[0];\n        char c = (char) (entry[1] + 'a');\n        while (count-- > 0) {\n            result[idx] = c;\n            idx += 2;\n            if (idx >= n) idx = 1;\n        }\n    }\n    return new String(result);\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        9
      ],
      "impossible": [
        9
      ],
      "possible": [
        9
      ],
      "sort_freqs": [
        18
      ],
      "init_result": [
        20
      ],
      "place_char": [
        26
      ],
      "switch_odd": [
        28
      ],
      "complete": [
        31
      ],
      "return_result": [
        31
      ]
    },
    "conditionalMap": {
      "check_possible": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string reorganizeString(string s) {\n    int freq[26] = {};\n    for (char c : s) {\n        freq[c - 'a']++;\n    }\n    int n = s.size();\n    // Check impossibility\n    for (int f : freq) {\n        if (f > (n + 1) / 2) return \"\";\n    }\n    // Build sorted list of characters by frequency (descending)\n    vector<pair<int, int>> sorted;\n    for (int i = 0; i < 26; i++) {\n        if (freq[i] > 0) {\n            sorted.push_back({freq[i], i});\n        }\n    }\n    sort(sorted.begin(), sorted.end(), greater<>());\n    // Fill result at even indices first, then odd\n    string result(n, ' ');\n    int idx = 0;\n    for (auto& [count, ch] : sorted) {\n        int c = count;\n        while (c-- > 0) {\n            result[idx] = (char)(ch + 'a');\n            idx += 2;\n            if (idx >= n) idx = 1;\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        9
      ],
      "impossible": [
        9
      ],
      "possible": [
        9
      ],
      "sort_freqs": [
        18
      ],
      "init_result": [
        20
      ],
      "place_char": [
        25
      ],
      "switch_odd": [
        27
      ],
      "complete": [
        30
      ],
      "return_result": [
        30
      ]
    },
    "conditionalMap": {
      "check_possible": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string ReorganizeString(string s) {\n    int[] freq = new int[26];\n    foreach (char c in s) {\n        freq[c - 'a']++;\n    }\n    int n = s.Length;\n    // Check impossibility\n    foreach (int f in freq) {\n        if (f > (n + 1) / 2) return \"\";\n    }\n    // Build sorted list of characters by frequency (descending)\n    var sorted = new List<int[]>();\n    for (int i = 0; i < 26; i++) {\n        if (freq[i] > 0) {\n            sorted.Add(new int[] { freq[i], i });\n        }\n    }\n    sorted.Sort((a, b) => b[0] - a[0]);\n    // Fill result at even indices first, then odd\n    char[] result = new char[n];\n    int idx = 0;\n    foreach (var entry in sorted) {\n        int count = entry[0];\n        char c = (char)(entry[1] + 'a');\n        while (count-- > 0) {\n            result[idx] = c;\n            idx += 2;\n            if (idx >= n) idx = 1;\n        }\n    }\n    return new string(result);\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        9
      ],
      "impossible": [
        9
      ],
      "possible": [
        9
      ],
      "sort_freqs": [
        18
      ],
      "init_result": [
        20
      ],
      "place_char": [
        26
      ],
      "switch_odd": [
        28
      ],
      "complete": [
        31
      ],
      "return_result": [
        31
      ]
    },
    "conditionalMap": {
      "check_possible": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reorganizeString(s string) string {\n    freq := [26]int{}\n    for _, c := range s {\n        freq[c-'a']++\n    }\n    n := len(s)\n    // Check impossibility\n    for _, f := range freq {\n        if f > (n+1)/2 {\n            return \"\"\n        }\n    }\n    // Build sorted list of characters by frequency (descending)\n    type pair struct{ count, ch int }\n    sorted := []pair{}\n    for i := 0; i < 26; i++ {\n        if freq[i] > 0 {\n            sorted = append(sorted, pair{freq[i], i})\n        }\n    }\n    sort.Slice(sorted, func(i, j int) bool {\n        return sorted[i].count > sorted[j].count\n    })\n    // Fill result at even indices first, then odd\n    result := make([]byte, n)\n    idx := 0\n    for _, p := range sorted {\n        count := p.count\n        for count > 0 {\n            result[idx] = byte(p.ch + 'a')\n            idx += 2\n            if idx >= n {\n                idx = 1\n            }\n            count--\n        }\n    }\n    return string(result)\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        9
      ],
      "impossible": [
        10
      ],
      "possible": [
        9
      ],
      "sort_freqs": [
        21
      ],
      "init_result": [
        25
      ],
      "place_char": [
        30
      ],
      "switch_odd": [
        32
      ],
      "complete": [
        38
      ],
      "return_result": [
        38
      ]
    },
    "conditionalMap": {
      "check_possible": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function reorganizeString(s) {\n    const freq = new Array(26).fill(0);\n    for (const c of s) {\n        freq[c.charCodeAt(0) - 97]++;\n    }\n    const n = s.length;\n    // Check impossibility\n    if (Math.max(...freq) > Math.floor((n + 1) / 2)) return \"\";\n    // Build sorted list of characters by frequency (descending)\n    const sorted = [];\n    for (let i = 0; i < 26; i++) {\n        if (freq[i] > 0) sorted.push([freq[i], i]);\n    }\n    sorted.sort((a, b) => b[0] - a[0]);\n    // Fill result at even indices first, then odd\n    const result = new Array(n);\n    let idx = 0;\n    for (const [count, ch] of sorted) {\n        let c = count;\n        while (c-- > 0) {\n            result[idx] = String.fromCharCode(ch + 97);\n            idx += 2;\n            if (idx >= n) idx = 1;\n        }\n    }\n    return result.join(\"\");\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        8
      ],
      "impossible": [
        8
      ],
      "possible": [
        8
      ],
      "sort_freqs": [
        14
      ],
      "init_result": [
        16
      ],
      "place_char": [
        21
      ],
      "switch_odd": [
        23
      ],
      "complete": [
        26
      ],
      "return_result": [
        26
      ]
    },
    "conditionalMap": {
      "check_possible": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reorganizeString(s: string): string {\n    const freq = new Array(26).fill(0);\n    for (const c of s) {\n        freq[c.charCodeAt(0) - 97]++;\n    }\n    const n = s.length;\n    // Check impossibility\n    if (Math.max(...freq) > Math.floor((n + 1) / 2)) return \"\";\n    // Build sorted list of characters by frequency (descending)\n    const sorted: [number, number][] = [];\n    for (let i = 0; i < 26; i++) {\n        if (freq[i] > 0) sorted.push([freq[i], i]);\n    }\n    sorted.sort((a, b) => b[0] - a[0]);\n    // Fill result at even indices first, then odd\n    const result: string[] = new Array(n);\n    let idx = 0;\n    for (const [count, ch] of sorted) {\n        let c = count;\n        while (c-- > 0) {\n            result[idx] = String.fromCharCode(ch + 97);\n            idx += 2;\n            if (idx >= n) idx = 1;\n        }\n    }\n    return result.join(\"\");\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_count": [
        2
      ],
      "count_char": [
        3
      ],
      "update_count": [
        4
      ],
      "count_complete": [
        3
      ],
      "check_possible": [
        8
      ],
      "impossible": [
        8
      ],
      "possible": [
        8
      ],
      "sort_freqs": [
        14
      ],
      "init_result": [
        16
      ],
      "place_char": [
        21
      ],
      "switch_odd": [
        23
      ],
      "complete": [
        26
      ],
      "return_result": [
        26
      ]
    },
    "conditionalMap": {
      "check_possible": [
        8
      ]
    }
  }
};

const ReorganizeStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "aab"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (Impossible)",
    "value": {
      "s": "aaab"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "aabbcc"
    }
  }
];

function generateReorganizeStringSteps(e: any): any[] {
  let{s:t}=e,r=t.length,a=Math.ceil(r/2),n=e=>e.charCodeAt(0)-97,l={};for(let e=0;e<r;e++)l[`input_${e}`]={type:"arrayElement",value:t[e],position:e,state:"pending"};let o=new StepRecorder({},l),s=Array(26).fill(0),c=Array.from(new Set(t.split(""))).sort(),u=new Set,h=c.slice(),p=(e={})=>{let t=h.filter(e=>u.has(e)).map(t=>({ch:t,count:s[n(t)],state:e[t]??"normal"}));o.update_variable("freqs",t)},d=()=>{o.delete_variable("activeInput"),o.delete_variable("justPlaced"),o.delete_variable("placedChar")};o.update_variable("n",r),o.update_variable("limit",a),o.update_variable("phase","count"),o.update_variable("freqs",[]),o.record("-","Reorganize the string so no two adjacent characters match"),o.record("init_count","Count how many times each character occurs");for(let e=0;e<r;e++){let i=t[e];u.add(i),s[n(i)]++;for(let t=0;t<r;t++){let r=o.get_visual(`input_${t}`);o.update_visual(`input_${t}`,{...r,state:t<e?"done":t===e?"active":"pending"})}o.update_variable("activeInput",e),p({[i]:"count"}),o.record("count_char",`Read '${i}'`),p({[i]:"count"}),o.record("update_count",`count['${i}'] = ${s[n(i)]}`)}for(let e=0;e<r;e++){let t=o.get_visual(`input_${e}`);o.update_visual(`input_${e}`,{...t,state:"done"})}d(),p(),o.record("count_complete","All characters counted");let f=(h=c.slice().sort((e,t)=>s[n(t)]-s[n(e)]))[0],g=s[n(f)];o.update_variable("maxChar",f),o.update_variable("maxCount",g),p({[f]:"max"});let _=g<=a;if(o.update_variable("phase","feasible"),o.update_variable("possible",_),o.add_conditional("check_possible",!_),o.record("check_possible",`Is ${g} ≤ ⌈${r}/2⌉ = ${a}?`),!_)return o.update_variable("phase","impossible"),o.update_variable("impossible",!0),p({[f]:"impossible"}),o.record("impossible",`No: '${f}' can't be spread out, return ""`),o.getSteps();o.record("possible",`Yes: '${f}' fits, we can spread it out`),o.update_variable("phase","sort"),o.record("sort_freqs",`Sort characters by frequency: '${f}' (${g}) is the heaviest`);let m=Array(r).fill("_");for(let e=0;e<r;e++)o.update_visual(`result_${e}`,{type:"arrayElement",value:"_",position:e,state:"empty"});o.update_variable("phase","fill"),d(),o.record("init_result","Prepare an empty result of the same length");let x=0;for(let e of h)for(let t=0;t<s[n(e)];t++)x>=r&&(x=1,o.update_variable("phase","fill"),o.record("switch_odd","Even slots are full, continue at odd slots (1, 3, 5, …)")),m[x]=e,o.update_visual("index_pointer",{type:"pointer",position:x,label:"index"}),o.update_visual(`result_${x}`,{type:"arrayElement",value:e,position:x,state:"placing"}),o.update_variable("phase","fill"),o.update_variable("justPlaced",x),o.update_variable("placedChar",e),p({[e]:"place"}),o.record("place_char",`result[${x}] = '${e}'`),o.update_visual(`result_${x}`,{type:"arrayElement",value:e,position:x,state:"placed"}),x+=2;o.delete_visual("index_pointer"),d();for(let e=0;e<r;e++)o.update_visual(`result_${e}`,{type:"arrayElement",value:m[e],position:e,state:"done"});return o.update_variable("phase","done"),o.update_variable("done",!0),o.update_variable("resultStr",m.join("")),p(),o.record("complete",`Done: "${m.join("")}"`),o.record("return_result",`Return "${m.join("")}"`),o.getSteps()
}

export function ReorganizeStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReorganizeStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReorganizeStringSteps(e) as any[];
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
      title="Reorganize String"
      slug="reorganize-string"
      approaches={approaches}
      presets={ReorganizeStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Consecutive Sequence (longest-consecutive-sequence)
// ==========================================

const LongestConsecutiveSequenceTemplates = {
  "python": {
    "language": "python",
    "code": "def longestConsecutive(nums):\n    if not nums:\n        return 0\n\n    num_set = set(nums)\n    longest_streak = 0\n\n    for num in num_set:\n        # Check if num is the beginning of a sequence\n        if num - 1 not in num_set:\n            current_num = num\n            current_streak = 1\n\n            # Increment currentNum to count the length of sequence\n            while current_num + 1 in num_set:\n                current_num += 1\n                current_streak += 1\n\n            longest_streak = max(longest_streak, current_streak)\n\n    return longest_streak",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2,
        3
      ],
      "init_set": [
        5
      ],
      "add_to_set": [
        5
      ],
      "added": [
        5
      ],
      "set_complete": [
        5
      ],
      "init_longest": [
        6
      ],
      "check_num": [
        8
      ],
      "is_start": [
        10
      ],
      "not_start": [
        10
      ],
      "init_streak": [
        11,
        12
      ],
      "extend_sequence": [
        15,
        16,
        17
      ],
      "sequence_complete": [
        19
      ],
      "update_longest": [
        19
      ],
      "no_update": [
        19
      ],
      "complete": [
        21
      ],
      "return_result": [
        21
      ]
    },
    "conditionalMap": {
      "is_start": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestConsecutive(int[] nums) {\n    if (nums.length == 0) return 0;\n\n    Set<Integer> numSet = new HashSet<>();\n    for (int num : nums) {\n        numSet.add(num);\n    }\n\n    int longestStreak = 0;\n\n    for (int num : numSet) {\n        // Check if num is the beginning of a sequence\n        if (!numSet.contains(num - 1)) {\n            int currentNum = num;\n            int currentStreak = 1;\n\n            // Increment currentNum to count the length of sequence\n            while (numSet.contains(currentNum + 1)) {\n                currentNum++;\n                currentStreak++;\n            }\n\n            longestStreak = Math.max(longestStreak, currentStreak);\n        }\n    }\n    return longestStreak;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2
      ],
      "init_set": [
        4
      ],
      "add_to_set": [
        5
      ],
      "added": [
        6
      ],
      "set_complete": [
        6
      ],
      "init_longest": [
        9
      ],
      "check_num": [
        11
      ],
      "is_start": [
        13
      ],
      "not_start": [
        13
      ],
      "init_streak": [
        14,
        15
      ],
      "extend_sequence": [
        18,
        19,
        20
      ],
      "sequence_complete": [
        23
      ],
      "update_longest": [
        23
      ],
      "no_update": [
        23
      ],
      "complete": [
        26
      ],
      "return_result": [
        26
      ]
    },
    "conditionalMap": {
      "is_start": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestConsecutive(vector<int>& nums) {\n    if (nums.empty()) return 0;\n\n    unordered_set<int> numSet(nums.begin(), nums.end());\n    int longestStreak = 0;\n\n    for (int num : numSet) {\n        // Check if num is the beginning of a sequence\n        if (numSet.find(num - 1) == numSet.end()) {\n            int currentNum = num;\n            int currentStreak = 1;\n\n            // Increment currentNum to count the length of sequence\n            while (numSet.find(currentNum + 1) != numSet.end()) {\n                currentNum++;\n                currentStreak++;\n            }\n\n            longestStreak = max(longestStreak, currentStreak);\n        }\n    }\n    return longestStreak;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2
      ],
      "init_set": [
        4
      ],
      "add_to_set": [
        4
      ],
      "added": [
        4
      ],
      "set_complete": [
        4
      ],
      "init_longest": [
        5
      ],
      "check_num": [
        7
      ],
      "is_start": [
        9
      ],
      "not_start": [
        9
      ],
      "init_streak": [
        10,
        11
      ],
      "extend_sequence": [
        14,
        15,
        16
      ],
      "sequence_complete": [
        19
      ],
      "update_longest": [
        19
      ],
      "no_update": [
        19
      ],
      "complete": [
        22
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "is_start": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestConsecutive(int[] nums) {\n    if (nums.Length == 0) return 0;\n\n    HashSet<int> numSet = new HashSet<int>(nums);\n    int longestStreak = 0;\n\n    foreach (int num in numSet) {\n        // Check if num is the beginning of a sequence\n        if (!numSet.Contains(num - 1)) {\n            int currentNum = num;\n            int currentStreak = 1;\n\n            // Increment currentNum to count the length of sequence\n            while (numSet.Contains(currentNum + 1)) {\n                currentNum++;\n                currentStreak++;\n            }\n\n            longestStreak = Math.Max(longestStreak, currentStreak);\n        }\n    }\n    return longestStreak;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2
      ],
      "init_set": [
        4
      ],
      "add_to_set": [
        4
      ],
      "added": [
        4
      ],
      "set_complete": [
        4
      ],
      "init_longest": [
        5
      ],
      "check_num": [
        7
      ],
      "is_start": [
        9
      ],
      "not_start": [
        9
      ],
      "init_streak": [
        10,
        11
      ],
      "extend_sequence": [
        14,
        15,
        16
      ],
      "sequence_complete": [
        19
      ],
      "update_longest": [
        19
      ],
      "no_update": [
        19
      ],
      "complete": [
        22
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "is_start": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestConsecutive(nums []int) int {\n    if len(nums) == 0 {\n        return 0\n    }\n\n    numSet := make(map[int]bool)\n    for _, num := range nums {\n        numSet[num] = true\n    }\n\n    longestStreak := 0\n\n    for num := range numSet {\n        // Check if num is the beginning of a sequence\n        if !numSet[num-1] {\n            currentNum := num\n            currentStreak := 1\n\n            // Increment currentNum to count the length of sequence\n            for numSet[currentNum+1] {\n                currentNum++\n                currentStreak++\n            }\n\n            if currentStreak > longestStreak {\n                longestStreak = currentStreak\n            }\n        }\n    }\n    return longestStreak\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2,
        3
      ],
      "init_set": [
        6
      ],
      "add_to_set": [
        7
      ],
      "added": [
        8
      ],
      "set_complete": [
        8
      ],
      "init_longest": [
        11
      ],
      "check_num": [
        13
      ],
      "is_start": [
        15
      ],
      "not_start": [
        15
      ],
      "init_streak": [
        16,
        17
      ],
      "extend_sequence": [
        20,
        21,
        22
      ],
      "sequence_complete": [
        25,
        26
      ],
      "update_longest": [
        25,
        26
      ],
      "no_update": [
        25
      ],
      "complete": [
        30
      ],
      "return_result": [
        30
      ]
    },
    "conditionalMap": {
      "is_start": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestConsecutive(nums) {\n    if (nums.length === 0) return 0;\n\n    const numSet = new Set(nums);\n    let longestStreak = 0;\n\n    for (const num of numSet) {\n        // Check if num is the beginning of a sequence\n        if (!numSet.has(num - 1)) {\n            let currentNum = num;\n            let currentStreak = 1;\n\n            // Increment currentNum to count the length of sequence\n            while (numSet.has(currentNum + 1)) {\n                currentNum++;\n                currentStreak++;\n            }\n\n            longestStreak = Math.max(longestStreak, currentStreak);\n        }\n    }\n    return longestStreak;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2
      ],
      "init_set": [
        4
      ],
      "add_to_set": [
        4
      ],
      "added": [
        4
      ],
      "set_complete": [
        4
      ],
      "init_longest": [
        5
      ],
      "check_num": [
        7
      ],
      "is_start": [
        9
      ],
      "not_start": [
        9
      ],
      "init_streak": [
        10,
        11
      ],
      "extend_sequence": [
        14,
        15,
        16
      ],
      "sequence_complete": [
        19
      ],
      "update_longest": [
        19
      ],
      "no_update": [
        19
      ],
      "complete": [
        22
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "is_start": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestConsecutive(nums: number[]): number {\n    if (nums.length === 0) return 0;\n\n    const numSet = new Set(nums);\n    let longestStreak = 0;\n\n    for (const num of numSet) {\n        // Check if num is the beginning of a sequence\n        if (!numSet.has(num - 1)) {\n            let currentNum = num;\n            let currentStreak = 1;\n\n            // Increment currentNum to count the length of sequence\n            while (numSet.has(currentNum + 1)) {\n                currentNum++;\n                currentStreak++;\n            }\n\n            longestStreak = Math.max(longestStreak, currentStreak);\n        }\n    }\n    return longestStreak;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "empty_check": [
        2
      ],
      "init_set": [
        4
      ],
      "add_to_set": [
        4
      ],
      "added": [
        4
      ],
      "set_complete": [
        4
      ],
      "init_longest": [
        5
      ],
      "check_num": [
        7
      ],
      "is_start": [
        9
      ],
      "not_start": [
        9
      ],
      "init_streak": [
        10,
        11
      ],
      "extend_sequence": [
        14,
        15,
        16
      ],
      "sequence_complete": [
        19
      ],
      "update_longest": [
        19
      ],
      "no_update": [
        19
      ],
      "complete": [
        22
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "is_start": [
        9
      ]
    }
  }
};

const LongestConsecutiveSequencePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        100,
        4,
        200,
        1,
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
        3,
        7,
        2,
        5,
        8,
        4,
        6,
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
        9,
        1,
        4,
        7,
        3,
        2,
        8,
        5,
        6
      ]
    }
  }
];

function generateLongestConsecutiveSequenceSteps(e: any): any[] {
  let{nums:t}=e,n={};for(let e=0;e<t.length;e++)n[`nums_${e}`]={type:"arrayElement",value:t[e],position:e,state:"pending"};let a=new StepRecorder({},n),i=()=>{a.delete_variable("startIdx"),a.delete_variable("runLo"),a.delete_variable("runHi"),a.delete_variable("searchTarget"),a.delete_variable("foundIdx"),a.delete_variable("searching"),a.delete_variable("notFound"),a.delete_variable("currentStreak")};if(a.update_variable("phase","scan"),a.record("-","Find the longest run of consecutive integers"),0===t.length)return a.update_variable("done",!0),a.update_variable("resultLen",0),a.record("complete","Array is empty, longest = 0"),a.record("return_result","Return 0"),a.getSteps();let l=0;a.update_variable("longestStreak",0);for(let e=0;e<t.length;e++){let n=t[e];i();let r=n,u=1;for(a.update_variable("startIdx",e),a.update_variable("runLo",n),a.update_variable("runHi",r),a.update_variable("currentStreak",u),a.record("pick_start",`Start a run at ${n}`);;){let e=r+1,n=t.indexOf(e);if(a.update_variable("searchTarget",e),a.update_variable("searching",!0),a.add_conditional("check_next",-1!==n),-1!==n)r=e,u+=1,a.update_variable("foundIdx",n),a.update_variable("runHi",r),a.update_variable("currentStreak",u),a.delete_variable("searching"),a.record("extend_found",`Scan the array for ${e}: found it — extend, streak = ${u}`);else{a.update_variable("notFound",!0),a.delete_variable("foundIdx"),a.record("not_found",`Scan the array for ${e}: not found — this run ends`),a.delete_variable("searching"),a.delete_variable("notFound"),a.delete_variable("searchTarget");break}}u>l?(l=u,a.update_variable("longestStreak",l),a.update_variable("bestLo",n),a.update_variable("bestHi",r),a.record("update_longest",`New longest run: ${l}`)):a.record("no_update",`${u} ≤ ${l}, longest unchanged`)}return i(),a.update_variable("phase","done"),a.update_variable("done",!0),a.update_variable("resultLen",l),a.record("complete",`Longest consecutive run has length ${l}`),a.record("return_result",`Return ${l}`),a.getSteps()
}

export function LongestConsecutiveSequenceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestConsecutiveSequenceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestConsecutiveSequenceSteps(e) as any[];
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
      title="Longest Consecutive Sequence"
      slug="longest-consecutive-sequence"
      approaches={approaches}
      presets={LongestConsecutiveSequencePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Good Ways to Split a String (number-of-good-ways-to-split-a-string)
// ==========================================

const NumberOfGoodWaysToSplitAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def numSplits(s):\n    n = len(s)\n    count = 0\n    for i in range(1, n):\n        # Count distinct chars in left and right substrings\n        left = set(s[:i])\n        right = set(s[i:])\n        if len(left) == len(right):\n            count += 1\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6
      ],
      "count_right": [
        7
      ],
      "not_equal": [
        8
      ],
      "found_split": [
        8,
        9
      ],
      "complete": [
        10
      ],
      "return_result": [
        10
      ]
    },
    "conditionalMap": {
      "check_equal": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int numSplits(String s) {\n    int n = s.length();\n    int count = 0;\n    for (int i = 1; i < n; i++) {\n        // Count distinct chars in left and right substrings\n        Set<Character> left = new HashSet<>();\n        Set<Character> right = new HashSet<>();\n        for (int j = 0; j < i; j++) left.add(s.charAt(j));\n        for (int j = i; j < n; j++) right.add(s.charAt(j));\n        if (left.size() == right.size()) count++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6,
        8
      ],
      "count_right": [
        7,
        9
      ],
      "not_equal": [
        10
      ],
      "found_split": [
        10
      ],
      "complete": [
        12
      ],
      "return_result": [
        12
      ]
    },
    "conditionalMap": {
      "check_equal": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int numSplits(string s) {\n    int n = s.size();\n    int count = 0;\n    for (int i = 1; i < n; i++) {\n        // Count distinct chars in left and right substrings\n        set<char> left(s.begin(), s.begin() + i);\n        set<char> right(s.begin() + i, s.end());\n        if (left.size() == right.size()) count++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6
      ],
      "count_right": [
        7
      ],
      "not_equal": [
        8
      ],
      "found_split": [
        8
      ],
      "complete": [
        10
      ],
      "return_result": [
        10
      ]
    },
    "conditionalMap": {
      "check_equal": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int NumSplits(string s) {\n    int n = s.Length;\n    int count = 0;\n    for (int i = 1; i < n; i++) {\n        // Count distinct chars in left and right substrings\n        var left = new HashSet<char>(s.Substring(0, i));\n        var right = new HashSet<char>(s.Substring(i));\n        if (left.Count == right.Count) count++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6
      ],
      "count_right": [
        7
      ],
      "not_equal": [
        8
      ],
      "found_split": [
        8
      ],
      "complete": [
        10
      ],
      "return_result": [
        10
      ]
    },
    "conditionalMap": {
      "check_equal": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numSplits(s string) int {\n    n := len(s)\n    count := 0\n    for i := 1; i < n; i++ {\n        // Count distinct chars in left and right substrings\n        left := make(map[byte]bool)\n        right := make(map[byte]bool)\n        for j := 0; j < i; j++ {\n            left[s[j]] = true\n        }\n        for j := i; j < n; j++ {\n            right[s[j]] = true\n        }\n        if len(left) == len(right) {\n            count++\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6,
        8,
        9
      ],
      "count_right": [
        7,
        11,
        12
      ],
      "not_equal": [
        14
      ],
      "found_split": [
        14,
        15
      ],
      "complete": [
        18
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "check_equal": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numSplits(s) {\n    const n = s.length;\n    let count = 0;\n    for (let i = 1; i < n; i++) {\n        // Count distinct chars in left and right substrings\n        const left = new Set(s.slice(0, i));\n        const right = new Set(s.slice(i));\n        if (left.size === right.size) count++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6
      ],
      "count_right": [
        7
      ],
      "not_equal": [
        8
      ],
      "found_split": [
        8
      ],
      "complete": [
        10
      ],
      "return_result": [
        10
      ]
    },
    "conditionalMap": {
      "check_equal": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numSplits(s: string): number {\n    const n = s.length;\n    let count = 0;\n    for (let i = 1; i < n; i++) {\n        // Count distinct chars in left and right substrings\n        const left = new Set(s.slice(0, i));\n        const right = new Set(s.slice(i));\n        if (left.size === right.size) count++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_splits": [
        3
      ],
      "pick_split": [
        4
      ],
      "count_left": [
        6
      ],
      "count_right": [
        7
      ],
      "not_equal": [
        8
      ],
      "found_split": [
        8
      ],
      "complete": [
        10
      ],
      "return_result": [
        10
      ]
    },
    "conditionalMap": {
      "check_equal": [
        8
      ]
    }
  }
};

const NumberOfGoodWaysToSplitAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "aacaba"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "abcd"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "aaaaa"
    }
  }
];

function generateNumberOfGoodWaysToSplitAStringSteps(t: any): any[] {
  let{s:i}=t,e=i.length,r={};for(let t=0;t<e;t++)r[`char_${t}`]={type:"arrayElement",value:i[t],position:t,state:"pending"};let l=new StepRecorder({},r),s=[],a=(t,e)=>{let n=new Map;for(let r=t;r<=e;r++)n.set(i[r],(n.get(i[r])||0)+1);return Array.from(n.entries()).map(([t,i])=>({ch:t,count:i})).sort((t,i)=>t.ch.localeCompare(i.ch))},o=()=>{l.delete_variable("movedChar"),l.delete_variable("isGood")};l.update_variable("phase","build"),l.update_variable("splitIdx",-1),l.update_variable("goodSplits",0),l.update_variable("goodPositions",[]),l.update_variable("leftSet",[]),l.update_variable("rightSet",[]),l.update_variable("leftUnique",0),l.update_variable("rightUnique",0),l.record("-","A split is good when both halves have the same distinct-letter count");let c=0;l.record("init_splits","Try every split point, good splits = 0");for(let t=0;t<e-1;t++){o(),l.update_variable("phase","sweep"),l.update_variable("splitIdx",t),l.update_variable("leftSet",[]),l.update_variable("rightSet",[]),l.update_variable("leftUnique",0),l.update_variable("rightUnique",0),l.record("pick_split",`Split after index ${t}: left = s[0..${t}], right = s[${t+1}..${e-1}]`);let n=a(0,t);l.update_variable("leftSet",n),l.update_variable("leftUnique",n.length),l.update_variable("movedChar",i[t]),l.record("count_left",`Recount the left half: ${n.length} distinct letter${1===n.length?"":"s"}`);let r=a(t+1,e-1);l.update_variable("rightSet",r),l.update_variable("rightUnique",r.length),l.record("count_right",`Recount the right half: ${r.length} distinct letter${1===r.length?"":"s"}`);let u=n.length===r.length;l.update_variable("isGood",u),l.add_conditional("check_equal",u),u?(c++,s.push(t),l.update_variable("goodSplits",c),l.update_variable("goodPositions",[...s]),l.record("found_split",`${n.length} == ${r.length} — good split! total = ${c}`)):l.record("not_equal",`${n.length} ≠ ${r.length} — not a good split`)}return o(),l.update_variable("splitIdx",-2),l.update_variable("phase","done"),l.update_variable("done",!0),l.update_variable("result",c),l.record("complete",`Found ${c} good split${1===c?"":"s"}`),l.record("return_result",`Return ${c}`),l.getSteps()
}

export function NumberOfGoodWaysToSplitAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfGoodWaysToSplitAStringTemplates,
      generateSteps: (t: any) => {
        const recorded = generateNumberOfGoodWaysToSplitAStringSteps(t) as any[];
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
      title="Number of Good Ways to Split a String"
      slug="number-of-good-ways-to-split-a-string"
      approaches={approaches}
      presets={NumberOfGoodWaysToSplitAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Determine if Two Strings Are Close (determine-if-two-strings-are-close)
// ==========================================

const DetermineIfTwoStringsAreCloseTemplates = {
  "python": {
    "language": "python",
    "code": "def closeStrings(word1: str, word2: str) -> bool:\n    if len(word1) != len(word2):\n        return False\n\n    freq1 = [0] * 26\n    freq2 = [0] * 26\n\n    # Count character frequencies\n    for c in word1:\n        freq1[ord(c) - ord('a')] += 1\n\n    for c in word2:\n        freq2[ord(c) - ord('a')] += 1\n\n    # Check both strings have the same set of characters\n    for i in range(26):\n        if (freq1[i] == 0) != (freq2[i] == 0):\n            return False\n\n    # Sort frequency arrays and compare\n    freq1.sort()\n    freq2.sort()\n\n    return freq1 == freq2",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2,
        3
      ],
      "count_word1": [
        9,
        10
      ],
      "count_word2": [
        12,
        13
      ],
      "check_keys": [
        16,
        17
      ],
      "key_mismatch": [
        17,
        18
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        17
      ],
      "freq_equal": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean closeStrings(String word1, String word2) {\n    if (word1.length() != word2.length()) return false;\n\n    int[] freq1 = new int[26];\n    int[] freq2 = new int[26];\n\n    // Count character frequencies\n    for (char c : word1.toCharArray())\n        freq1[c - 'a']++;\n\n    for (char c : word2.toCharArray())\n        freq2[c - 'a']++;\n\n    // Check both strings have the same set of characters\n    for (int i = 0; i < 26; i++) {\n        if ((freq1[i] == 0) != (freq2[i] == 0))\n            return false;\n    }\n\n    // Sort frequency arrays and compare\n    Arrays.sort(freq1);\n    Arrays.sort(freq2);\n\n    return Arrays.equals(freq1, freq2);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "count_word1": [
        8,
        9
      ],
      "count_word2": [
        11,
        12
      ],
      "check_keys": [
        15,
        16
      ],
      "key_mismatch": [
        16,
        17
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        16
      ],
      "freq_equal": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool closeStrings(string word1, string word2) {\n    if (word1.length() != word2.length()) return false;\n\n    vector<int> freq1(26, 0);\n    vector<int> freq2(26, 0);\n\n    // Count character frequencies\n    for (char c : word1)\n        freq1[c - 'a']++;\n\n    for (char c : word2)\n        freq2[c - 'a']++;\n\n    // Check both strings have the same set of characters\n    for (int i = 0; i < 26; i++) {\n        if ((freq1[i] == 0) != (freq2[i] == 0))\n            return false;\n    }\n\n    // Sort frequency arrays and compare\n    sort(freq1.begin(), freq1.end());\n    sort(freq2.begin(), freq2.end());\n\n    return freq1 == freq2;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "count_word1": [
        8,
        9
      ],
      "count_word2": [
        11,
        12
      ],
      "check_keys": [
        15,
        16
      ],
      "key_mismatch": [
        16,
        17
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        16
      ],
      "freq_equal": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool CloseStrings(string word1, string word2) {\n    if (word1.Length != word2.Length) return false;\n\n    int[] freq1 = new int[26];\n    int[] freq2 = new int[26];\n\n    // Count character frequencies\n    foreach (char c in word1)\n        freq1[c - 'a']++;\n\n    foreach (char c in word2)\n        freq2[c - 'a']++;\n\n    // Check both strings have the same set of characters\n    for (int i = 0; i < 26; i++) {\n        if ((freq1[i] == 0) != (freq2[i] == 0))\n            return false;\n    }\n\n    // Sort frequency arrays and compare\n    Array.Sort(freq1);\n    Array.Sort(freq2);\n\n    return freq1.SequenceEqual(freq2);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "count_word1": [
        8,
        9
      ],
      "count_word2": [
        11,
        12
      ],
      "check_keys": [
        15,
        16
      ],
      "key_mismatch": [
        16,
        17
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        16
      ],
      "freq_equal": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func closeStrings(word1 string, word2 string) bool {\n    if len(word1) != len(word2) {\n        return false\n    }\n\n    freq1 := make([]int, 26)\n    freq2 := make([]int, 26)\n\n    // Count character frequencies\n    for _, c := range word1 {\n        freq1[c-'a']++\n    }\n\n    for _, c := range word2 {\n        freq2[c-'a']++\n    }\n\n    // Check both strings have the same set of characters\n    for i := 0; i < 26; i++ {\n        if (freq1[i] == 0) != (freq2[i] == 0) {\n            return false\n        }\n    }\n\n    // Sort frequency arrays and compare\n    sort.Ints(freq1)\n    sort.Ints(freq2)\n\n    for i := range freq1 {\n        if freq1[i] != freq2[i] {\n            return false\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2,
        3
      ],
      "count_word1": [
        10,
        11
      ],
      "count_word2": [
        14,
        15
      ],
      "check_keys": [
        19,
        20
      ],
      "key_mismatch": [
        20,
        21
      ],
      "sort_freqs": [
        26,
        27
      ],
      "compare_freqs": [
        29,
        30
      ],
      "freq_match": [
        34
      ],
      "freq_mismatch": [
        30,
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        20
      ],
      "freq_equal": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var closeStrings = function(word1, word2) {\n    if (word1.length !== word2.length) return false;\n\n    const freq1 = new Array(26).fill(0);\n    const freq2 = new Array(26).fill(0);\n\n    // Count character frequencies\n    for (const c of word1)\n        freq1[c.charCodeAt(0) - 97]++;\n\n    for (const c of word2)\n        freq2[c.charCodeAt(0) - 97]++;\n\n    // Check both strings have the same set of characters\n    for (let i = 0; i < 26; i++) {\n        if ((freq1[i] === 0) !== (freq2[i] === 0))\n            return false;\n    }\n\n    // Sort frequency arrays and compare\n    freq1.sort((a, b) => a - b);\n    freq2.sort((a, b) => a - b);\n\n    return freq1.every((v, i) => v === freq2[i]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "count_word1": [
        8,
        9
      ],
      "count_word2": [
        11,
        12
      ],
      "check_keys": [
        15,
        16
      ],
      "key_mismatch": [
        16,
        17
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        16
      ],
      "freq_equal": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function closeStrings(word1: string, word2: string): boolean {\n    if (word1.length !== word2.length) return false;\n\n    const freq1: number[] = new Array(26).fill(0);\n    const freq2: number[] = new Array(26).fill(0);\n\n    // Count character frequencies\n    for (const c of word1)\n        freq1[c.charCodeAt(0) - 97]++;\n\n    for (const c of word2)\n        freq2[c.charCodeAt(0) - 97]++;\n\n    // Check both strings have the same set of characters\n    for (let i = 0; i < 26; i++) {\n        if ((freq1[i] === 0) !== (freq2[i] === 0))\n            return false;\n    }\n\n    // Sort frequency arrays and compare\n    freq1.sort((a, b) => a - b);\n    freq2.sort((a, b) => a - b);\n\n    return freq1.every((v, i) => v === freq2[i]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "count_word1": [
        8,
        9
      ],
      "count_word2": [
        11,
        12
      ],
      "check_keys": [
        15,
        16
      ],
      "key_mismatch": [
        16,
        17
      ],
      "sort_freqs": [
        21,
        22
      ],
      "compare_freqs": [
        24
      ],
      "freq_match": [
        24
      ],
      "freq_mismatch": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "length_check": [
        2
      ],
      "key_check": [
        16
      ],
      "freq_equal": [
        24
      ]
    }
  }
};

const DetermineIfTwoStringsAreClosePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Close (swap)",
    "value": {
      "word1": "abc",
      "word2": "bca"
    }
  },
  {
    "id": "ex2",
    "label": "Diff length",
    "value": {
      "word1": "a",
      "word2": "aa"
    }
  },
  {
    "id": "ex3",
    "label": "Close (transform)",
    "value": {
      "word1": "cabbba",
      "word2": "abbccc"
    }
  },
  {
    "id": "ex4",
    "label": "Diff chars",
    "value": {
      "word1": "aabbcc",
      "word2": "aabbbz"
    }
  }
];

function generateDetermineIfTwoStringsAreCloseSteps(e: any): any[] {
  let t=e.word1,r=e.word2,n=new Set;for(let e of t)n.add(e);for(let e of r)n.add(e);let i=Array.from(n).sort(),o={};for(let e=0;e<t.length;e++)o[`w1_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<r.length;e++)o[`w2_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<i.length;e++)o[`freq1_${e}`]={type:"arrayElement",value:0,position:e,label:i[e]},o[`freq2_${e}`]={type:"arrayElement",value:0,position:e,label:i[e]};let l=new StepRecorder({word1:t,word2:r},o),s=[i.map(()=>0),i.map(()=>0)],c=[i.map((e,t)=>t),i.map((e,t)=>t)],h=(e,t,r)=>{l.update_visual(`freq${e}_${t}`,{type:"arrayElement",value:s[e-1][t],position:c[e-1][t],label:i[t],state:r})},d=(e,a,n)=>{let i=1===e?t:r;l.update_visual(`w${e}_${a}`,{type:"arrayElement",value:i[a],position:a,state:n})};if(l.record("-",`Start: check if "${t}" and "${r}" are close strings`),l.add_conditional("length_check",t.length===r.length),t.length!==r.length){for(let e=0;e<t.length;e++)d(1,e,"mismatch");for(let e=0;e<r.length;e++)d(2,e,"mismatch");return l.record("check_length",`Lengths differ: ${t.length} vs ${r.length}, swaps can never change length`),l.add_new_visual("verdict",{type:"metadata",value:!1}),l.record("complete","Return false: the strings are not close"),l.getSteps()}l.record("check_length",`Both words have length ${t.length}, continue`);let f=(e,t,r)=>{for(let a=0;a<t.length;a++){let n=t[a],o=i.indexOf(n);s[e-1][o]++,d(e,a,"checking"),h(e,o,"bump"),l.record(r,`Count word${e}[${a}] = '${n}': freq${e}['${n}'] = ${s[e-1][o]}`),d(e,a,"done"),h(e,o)}};f(1,t,"count_word1"),f(2,r,"count_word2");for(let e=0;e<i.length;e++){let t=s[0][e],r=s[1][e],a=0===t==(0===r);if(h(1,e,"checking"),h(2,e,"checking"),l.add_conditional("key_check",a),!a)return h(1,e,"mismatch"),h(2,e,"mismatch"),l.record("key_mismatch",`'${i[e]}' appears in only one word (${t} vs ${r}), swaps cannot create new letters`),l.add_new_visual("verdict",{type:"metadata",value:!1}),l.record("complete","Return false: the strings are not close"),l.getSteps();l.record("check_keys",`'${i[e]}' appears in both words (${t} and ${r}), character sets match so far`),h(1,e),h(2,e)}let u=e=>{let t=e.map((e,t)=>({v:e,i:t})).sort((e,t)=>e.v-t.v||e.i-t.i),r=Array(e.length).fill(0);return t.forEach(({i:e},t)=>r[e]=t),r};c[0]=u(s[0]),c[1]=u(s[1]);for(let e=0;e<i.length;e++)h(1,e),h(2,e);for(let e=0;e<t.length;e++)d(1,e,"dim");for(let e=0;e<r.length;e++)d(2,e,"dim");let g=[...s[0]].sort((e,t)=>e-t),m=[...s[1]].sort((e,t)=>e-t);l.record("sort_freqs",`Sort both frequency arrays: [${g.join(", ")}] and [${m.join(", ")}]`);for(let e=0;e<i.length;e++){let t=c[0].indexOf(e),r=c[1].indexOf(e),a=s[0][t]===s[1][r];if(l.add_conditional("freq_equal",a),!a)return h(1,t,"mismatch"),h(2,r,"mismatch"),l.record("freq_mismatch",`Sorted frequencies differ at index ${e}: ${s[0][t]} vs ${s[1][r]}`),l.add_new_visual("verdict",{type:"metadata",value:!1}),l.record("complete","Return false: the strings are not close"),l.getSteps();h(1,t,"done"),h(2,r,"done"),l.record("compare_freqs",`Sorted index ${e}: ${s[0][t]} equals ${s[1][r]}, match`)}for(let e=0;e<t.length;e++)d(1,e,"done");for(let e=0;e<r.length;e++)d(2,e,"done");return l.record("freq_match","Same letters and the same multiset of counts: the strings are close"),l.add_new_visual("verdict",{type:"metadata",value:!0}),l.record("complete",`Return true: "${t}" and "${r}" are close strings`),l.getSteps()
}

export function DetermineIfTwoStringsAreCloseProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DetermineIfTwoStringsAreCloseTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDetermineIfTwoStringsAreCloseSteps(e) as any[];
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
      title="Determine if Two Strings Are Close"
      slug="determine-if-two-strings-are-close"
      approaches={approaches}
      presets={DetermineIfTwoStringsAreClosePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Encode and Decode TinyURL (encode-and-decode-tinyurl)
// ==========================================

const EncodeAndDecodeTinyurlTemplates = {
  "python": {
    "language": "python",
    "code": "class Codec:\n    def __init__(self):\n        self.code2url = {}\n        self.url2code = {}\n        self.chars = string.ascii_letters + string.digits\n        self.prefix = \"http://tinyurl.com/\"\n\n    def _generate_key(self):\n        return ''.join(random.choice(self.chars) for _ in range(6))\n\n    def encode(self, longUrl):\n        if longUrl in self.url2code:\n            return self.prefix + self.url2code[longUrl]\n        key = self._generate_key()\n        while key in self.code2url:\n            key = self._generate_key()\n        self.code2url[key] = longUrl\n        self.url2code[longUrl] = key\n        return self.prefix + key\n\n    def decode(self, shortUrl):\n        key = shortUrl.replace(self.prefix, \"\")\n        return self.code2url[key]",
    "lineMap": {
      "-": [
        3
      ],
      "encode_start": [
        11
      ],
      "already_encoded": [
        12,
        13
      ],
      "generate_key": [
        14
      ],
      "check_collision": [
        15
      ],
      "regenerate": [
        16
      ],
      "store_mapping": [
        17
      ],
      "return_short": [
        19
      ],
      "decode_start": [
        21
      ],
      "extract_key": [
        22
      ],
      "lookup": [
        23
      ],
      "return_long": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "check_collision": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Codec {\n    private Map<String, String> code2url = new HashMap<>();\n    private Map<String, String> url2code = new HashMap<>();\n    private static final String CHARS =\n        \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n    private static final String PREFIX = \"http://tinyurl.com/\";\n    private Random random = new Random();\n\n    public String encode(String longUrl) {\n        if (url2code.containsKey(longUrl)) {\n            return PREFIX + url2code.get(longUrl);\n        }\n        String key = generateKey();\n        while (code2url.containsKey(key)) {\n            key = generateKey();\n        }\n        code2url.put(key, longUrl);\n        url2code.put(longUrl, key);\n        return PREFIX + key;\n    }\n\n    public String decode(String shortUrl) {\n        String key = shortUrl.replace(PREFIX, \"\");\n        return code2url.get(key);\n    }\n\n    private String generateKey() {\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < 6; i++) {\n            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));\n        }\n        return sb.toString();\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "encode_start": [
        9
      ],
      "already_encoded": [
        10,
        11
      ],
      "generate_key": [
        13
      ],
      "check_collision": [
        14
      ],
      "regenerate": [
        15
      ],
      "store_mapping": [
        17
      ],
      "return_short": [
        19
      ],
      "decode_start": [
        22
      ],
      "extract_key": [
        23
      ],
      "lookup": [
        24
      ],
      "return_long": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "check_collision": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Codec {\n    unordered_map<string, string> code2url;\n    unordered_map<string, string> url2code;\n    string chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n    string prefix = \"http://tinyurl.com/\";\n\n    string generateKey() {\n        string key;\n        for (int i = 0; i < 6; i++) {\n            key += chars[rand() % chars.size()];\n        }\n        return key;\n    }\npublic:\n    string encode(string longUrl) {\n        if (url2code.count(longUrl)) {\n            return prefix + url2code[longUrl];\n        }\n        string key = generateKey();\n        while (code2url.count(key)) {\n            key = generateKey();\n        }\n        code2url[key] = longUrl;\n        url2code[longUrl] = key;\n        return prefix + key;\n    }\n\n    string decode(string shortUrl) {\n        string key = shortUrl.substr(prefix.size());\n        return code2url[key];\n    }\n};",
    "lineMap": {
      "-": [
        2
      ],
      "encode_start": [
        15
      ],
      "already_encoded": [
        16,
        17
      ],
      "generate_key": [
        19
      ],
      "check_collision": [
        20
      ],
      "regenerate": [
        21
      ],
      "store_mapping": [
        23
      ],
      "return_short": [
        25
      ],
      "decode_start": [
        28
      ],
      "extract_key": [
        29
      ],
      "lookup": [
        30
      ],
      "return_long": [
        30
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "check_collision": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Codec {\n    private Dictionary<string, string> code2url = new Dictionary<string, string>();\n    private Dictionary<string, string> url2code = new Dictionary<string, string>();\n    private const string Chars =\n        \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n    private const string Prefix = \"http://tinyurl.com/\";\n    private Random random = new Random();\n\n    public string encode(string longUrl) {\n        if (url2code.ContainsKey(longUrl)) {\n            return Prefix + url2code[longUrl];\n        }\n        string key = GenerateKey();\n        while (code2url.ContainsKey(key)) {\n            key = GenerateKey();\n        }\n        code2url[key] = longUrl;\n        url2code[longUrl] = key;\n        return Prefix + key;\n    }\n\n    public string decode(string shortUrl) {\n        string key = shortUrl.Replace(Prefix, \"\");\n        return code2url[key];\n    }\n\n    private string GenerateKey() {\n        char[] key = new char[6];\n        for (int i = 0; i < 6; i++) {\n            key[i] = Chars[random.Next(Chars.Length)];\n        }\n        return new string(key);\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "encode_start": [
        9
      ],
      "already_encoded": [
        10,
        11
      ],
      "generate_key": [
        13
      ],
      "check_collision": [
        14
      ],
      "regenerate": [
        15
      ],
      "store_mapping": [
        17
      ],
      "return_short": [
        19
      ],
      "decode_start": [
        22
      ],
      "extract_key": [
        23
      ],
      "lookup": [
        24
      ],
      "return_long": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "check_collision": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Codec struct {\n    code2url map[string]string\n    url2code map[string]string\n}\n\nconst chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\"\nconst prefix = \"http://tinyurl.com/\"\n\nfunc Constructor() Codec {\n    return Codec{\n        code2url: make(map[string]string),\n        url2code: make(map[string]string),\n    }\n}\n\nfunc generateKey() string {\n    key := make([]byte, 6)\n    for i := range key {\n        key[i] = chars[rand.Intn(len(chars))]\n    }\n    return string(key)\n}\n\nfunc (c *Codec) encode(longUrl string) string {\n    if code, ok := c.url2code[longUrl]; ok {\n        return prefix + code\n    }\n    key := generateKey()\n    for _, exists := c.code2url[key]; exists; _, exists = c.code2url[key] {\n        key = generateKey()\n    }\n    c.code2url[key] = longUrl\n    c.url2code[longUrl] = key\n    return prefix + key\n}\n\nfunc (c *Codec) decode(shortUrl string) string {\n    key := strings.TrimPrefix(shortUrl, prefix)\n    return c.code2url[key]\n}",
    "lineMap": {
      "-": [
        2
      ],
      "encode_start": [
        24
      ],
      "already_encoded": [
        25,
        26
      ],
      "generate_key": [
        28
      ],
      "check_collision": [
        29
      ],
      "regenerate": [
        30
      ],
      "store_mapping": [
        32
      ],
      "return_short": [
        34
      ],
      "decode_start": [
        37
      ],
      "extract_key": [
        38
      ],
      "lookup": [
        39
      ],
      "return_long": [
        39
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "check_collision": [
        29
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class Codec {\n    constructor() {\n        this.code2url = new Map();\n        this.url2code = new Map();\n        this.chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n        this.prefix = \"http://tinyurl.com/\";\n    }\n\n    generateKey() {\n        let key = \"\";\n        for (let i = 0; i < 6; i++) {\n            key += this.chars[Math.floor(Math.random() * this.chars.length)];\n        }\n        return key;\n    }\n\n    encode(longUrl) {\n        if (this.url2code.has(longUrl)) {\n            return this.prefix + this.url2code.get(longUrl);\n        }\n        let key = this.generateKey();\n        while (this.code2url.has(key)) {\n            key = this.generateKey();\n        }\n        this.code2url.set(key, longUrl);\n        this.url2code.set(longUrl, key);\n        return this.prefix + key;\n    }\n\n    decode(shortUrl) {\n        const key = shortUrl.replace(this.prefix, \"\");\n        return this.code2url.get(key);\n    }\n}",
    "lineMap": {
      "-": [
        3
      ],
      "encode_start": [
        17
      ],
      "already_encoded": [
        18,
        19
      ],
      "generate_key": [
        21
      ],
      "check_collision": [
        22
      ],
      "regenerate": [
        23
      ],
      "store_mapping": [
        25
      ],
      "return_short": [
        27
      ],
      "decode_start": [
        30
      ],
      "extract_key": [
        31
      ],
      "lookup": [
        32
      ],
      "return_long": [
        32
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_collision": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class Codec {\n    constructor() {\n        this.code2url = new Map<string, string>();\n        this.url2code = new Map<string, string>();\n        this.chars = \"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789\";\n        this.prefix = \"http://tinyurl.com/\";\n    }\n\n    private generateKey(): string {\n        let key = \"\";\n        for (let i = 0; i < 6; i++) {\n            key += this.chars[Math.floor(Math.random() * this.chars.length)];\n        }\n        return key;\n    }\n\n    encode(longUrl: string): string {\n        if (this.url2code.has(longUrl)) {\n            return this.prefix + this.url2code.get(longUrl)!;\n        }\n        let key = this.generateKey();\n        while (this.code2url.has(key)) {\n            key = this.generateKey();\n        }\n        this.code2url.set(key, longUrl);\n        this.url2code.set(longUrl, key);\n        return this.prefix + key;\n    }\n\n    decode(shortUrl: string): string {\n        const key = shortUrl.replace(this.prefix, \"\");\n        return this.code2url.get(key)!;\n    }\n}",
    "lineMap": {
      "-": [
        3
      ],
      "encode_start": [
        17
      ],
      "already_encoded": [
        18,
        19
      ],
      "generate_key": [
        21
      ],
      "check_collision": [
        22
      ],
      "regenerate": [
        23
      ],
      "store_mapping": [
        25
      ],
      "return_short": [
        27
      ],
      "decode_start": [
        30
      ],
      "extract_key": [
        31
      ],
      "lookup": [
        32
      ],
      "return_long": [
        32
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "check_collision": [
        22
      ]
    }
  }
};

const EncodeAndDecodeTinyurlPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        [
          "encode",
          "https://example.com"
        ],
        [
          "encode",
          "https://google.com"
        ],
        [
          "decode",
          "0"
        ],
        [
          "decode",
          "1"
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        [
          "encode",
          "https://leetcode.com/problems"
        ],
        [
          "encode",
          "https://github.com"
        ],
        [
          "encode",
          "https://stackoverflow.com"
        ],
        [
          "decode",
          "0"
        ],
        [
          "decode",
          "2"
        ]
      ]
    }
  }
];

function generateEncodeAndDecodeTinyurlSteps(e: any): any[] {
  let n='http://tinyurl.com/';
let{operations:t}=e,r={};for(let e=0;e<t.length;e++){let[l,n]=t[e];r[`op_${e}`]={type:"arrayElement",value:`${l}(${n})`,position:e,state:"pending"}}let a=new StepRecorder({},r),o=()=>{a.delete_variable("mode"),a.delete_variable("phase"),a.delete_variable("longUrl"),a.delete_variable("shortUrl"),a.delete_variable("key"),a.delete_variable("keyBefore"),a.delete_variable("collision"),a.delete_variable("result")},i=new Map,s=[],c=new Map,d=[],h=()=>s.forEach(e=>e.flash=null),u=()=>a.update_variable("map",s),p=e=>{for(let r=0;r<t.length;r++){let t=r<e?"done":r===e?"active":"pending",l=a.get_visual(`op_${r}`);a.update_visual(`op_${r}`,{...l,state:t})}};a.update_variable("map",s),a.record("-","Codec keeps a hash map from a numeric key to the long URL");for(let e=0;e<t.length;e++){let[r,l]=t[e];if(p(e),h(),o(),"encode"===r){a.update_variable("mode","encode"),a.update_variable("phase","start"),a.update_variable("longUrl",l),u(),a.record("encode_start",`encode("${l}")`);let e=function(e){let t=0;for(let r=0;r<e.length;r++)t=(t+e.charCodeAt(r))%100;return t}(l);a.update_variable("phase","hash"),a.update_variable("key",e),a.record("compute_hash",`Hash the URL to a key: hash("${l}") = ${e}`);let t=i.has(e)&&i.get(e)!==l;if(a.update_variable("phase","check"),a.update_variable("collision",t),a.add_conditional("check_collision",t),a.record("check_collision",t?`Key ${e} is taken by a different URL: collision`:`Key ${e} is free`),t){let t=e;for(;i.has(e)&&i.get(e)!==l;)e++;a.update_variable("phase","collision"),a.update_variable("keyBefore",t),a.update_variable("key",e),a.record("collision_found",`Probe forward until free: key = ${e}`)}i.set(e,l),c.has(e)?s[c.get(e)]={key:e,url:l,flash:"store"}:(c.set(e,s.length),s.push({key:e,url:l,flash:"store"}));let r=`${n}${e}`;d.push(r),a.update_variable("phase","store"),a.update_variable("key",e),a.delete_variable("collision"),u(),a.record("store_mapping",`Store ${e} → "${l}"`),a.update_variable("phase","result"),a.update_variable("shortUrl",r),a.update_variable("result",r),a.record("return_short",`Return the short URL: ${r}`)}else{let e,t=parseInt(l);e=!isNaN(t)&&String(t)===l.trim()&&t<d.length?d[t]:l,a.update_variable("mode","decode"),a.update_variable("phase","start"),a.update_variable("shortUrl",e),u(),a.record("decode_start",`decode("${e}")`);let r=parseInt(e.replace(n,""));a.update_variable("phase","extract"),a.update_variable("key",r),a.record("extract_key",`Strip the prefix to get the key: ${r}`);let o=i.get(r)??"NOT FOUND";i.has(r)&&(s[c.get(r)].flash="lookup"),a.update_variable("phase","lookup"),u(),a.record("lookup",`Look up key ${r} in the map`),a.update_variable("phase","result"),a.update_variable("longUrl",o),a.update_variable("result",o),a.record("return_long",`Return the long URL: "${o}"`)}}for(let e=0;e<t.length;e++){let t=a.get_visual(`op_${e}`);a.update_visual(`op_${e}`,{...t,state:"done"})}return h(),o(),a.update_variable("done",!0),u(),a.record("complete",`Done: the map holds ${s.length} URL${1===s.length?"":"s"}`),a.getSteps()
}

export function EncodeAndDecodeTinyurlProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: EncodeAndDecodeTinyurlTemplates,
      generateSteps: (e: any) => {
        const recorded = generateEncodeAndDecodeTinyurlSteps(e) as any[];
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
      title="Encode and Decode TinyURL"
      slug="encode-and-decode-tinyurl"
      approaches={approaches}
      presets={EncodeAndDecodeTinyurlPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// First Unique Character in a String (first-unique-character-in-a-string)
// ==========================================

const FirstUniqueCharacterInAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def firstUniqChar(s):\n    count = [0] * 26\n    for ch in s:\n        count[ord(ch) - ord('a')] += 1\n    for i, ch in enumerate(s):\n        if count[ord(ch) - ord('a')] == 1:\n            return i\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        5
      ],
      "check_freq": [
        6
      ],
      "found": [
        7
      ],
      "not_found": [
        8
      ]
    },
    "conditionalMap": {
      "is_unique": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int firstUniqChar(String s) {\n    int[] count = new int[26];\n    for (int i = 0; i < s.length(); i++) {\n        count[s.charAt(i) - 'a']++;\n    }\n    for (int i = 0; i < s.length(); i++) {\n        if (count[s.charAt(i) - 'a'] == 1) return i;\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        7
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int firstUniqChar(string s) {\n    int count[26] = {0};\n    for (char ch : s) {\n        count[ch - 'a']++;\n    }\n    for (int i = 0; i < s.size(); i++) {\n        if (count[s[i] - 'a'] == 1) return i;\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        7
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FirstUniqChar(string s) {\n    int[] count = new int[26];\n    foreach (char ch in s) {\n        count[ch - 'a']++;\n    }\n    for (int i = 0; i < s.Length; i++) {\n        if (count[s[i] - 'a'] == 1) return i;\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        7
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func firstUniqChar(s string) int {\n    count := [26]int{}\n    for _, ch := range s {\n        count[ch-'a']++\n    }\n    for i, ch := range s {\n        if count[ch-'a'] == 1 {\n            return i\n        }\n    }\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        8
      ],
      "not_found": [
        11
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function firstUniqChar(s) {\n    const count = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n        count[s.charCodeAt(i) - 97]++;\n    }\n    for (let i = 0; i < s.length; i++) {\n        if (count[s.charCodeAt(i) - 97] === 1) return i;\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        7
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function firstUniqChar(s: string): number {\n    const count = new Array(26).fill(0);\n    for (const ch of s) {\n        count[ch.charCodeAt(0) - 97]++;\n    }\n    for (let i = 0; i < s.length; i++) {\n        if (count[s.charCodeAt(i) - 97] === 1) return i;\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2
      ],
      "count_loop": [
        3,
        4
      ],
      "scan_loop": [
        6
      ],
      "check_freq": [
        7
      ],
      "found": [
        7
      ],
      "not_found": [
        9
      ]
    },
    "conditionalMap": {
      "is_unique": [
        7
      ]
    }
  }
};

const FirstUniqueCharacterInAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "leetcode"
    }
  },
  {
    "id": "ex2",
    "label": "Later Unique",
    "value": {
      "s": "loveleetcode"
    }
  },
  {
    "id": "ex3",
    "label": "No Unique",
    "value": {
      "s": "aabb"
    }
  }
];

function generateFirstUniqueCharacterInAStringSteps(e: any): any[] {
  let{s:t}=e,n=t.length,r={};for(let e=0;e<n;e++)r[`char_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};r.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"},r.ptr_j={type:"pointer",position:0,state:"hidden",label:"j"};let l=new StepRecorder({s:t,i:-1,j:-1,curChar:null,isDup:null,unique:null,result:null},r),a=e=>{Object.entries(e).forEach(([e,t])=>l.update_variable(e,t))},u=(e,t,n,i)=>{l.update_visual(e,{type:"pointer",position:t,state:n,label:i})};l.record("-","For each character, scan the whole string for a duplicate");for(let e=0;e<n;e++){u("ptr_i",e,"active","i"),u("ptr_j",0,"hidden","j"),a({i:e,j:-1,curChar:t[e],isDup:null,unique:null}),l.record("select_i",`Fix i = ${e} ('${t[e]}'), look for a duplicate`);let i=!0;for(let r=0;r<n;r++){if(r===e)continue;let n=t[r]===t[e];if(u("ptr_j",r,"active","j"),a({j:r,isDup:n}),l.add_conditional("is_dup",n),l.record("compare",`s[${r}] = '${t[r]}' ${n?"==":"!="} s[${e}] = '${t[e]}'`),n){i=!1,a({unique:!1}),l.record("dup",`'${t[e]}' repeats at index ${r} — not unique`);break}}if(i)return a({unique:!0,result:e}),u("ptr_i",e,"idle","i"),u("ptr_j",0,"hidden","j"),l.record("unique_return",`'${t[e]}' has no duplicate: return ${e}`),l.getSteps()}return u("ptr_i",0,"hidden","i"),u("ptr_j",0,"hidden","j"),a({i:-1,j:-1,curChar:null,isDup:null,unique:null,result:-1}),l.record("not_found","No character is unique: return -1"),l.getSteps()
}

export function FirstUniqueCharacterInAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FirstUniqueCharacterInAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFirstUniqueCharacterInAStringSteps(e) as any[];
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
      title="First Unique Character in a String"
      slug="first-unique-character-in-a-string"
      approaches={approaches}
      presets={FirstUniqueCharacterInAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Group Shifted Strings (group-shifted-strings)
// ==========================================

const GroupShiftedStringsTemplates = {
  "python": {
    "language": "python",
    "code": "def groupStrings(strings):\n    groups = defaultdict(list)\n    for s in strings:\n        key = get_key(s)\n        groups[key].append(s)\n    return list(groups.values())\n\ndef get_key(s):\n    # Compute differences between consecutive characters\n    return tuple((ord(s[i]) - ord(s[i - 1])) % 26 for i in range(1, len(s)))",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        10
      ],
      "build_key": [
        4,
        10
      ],
      "check_group": [
        5
      ],
      "create_group": [
        5
      ],
      "add_to_group": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public List<List<String>> groupStrings(String[] strings) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strings) {\n        String key = getKey(s);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}\n\nprivate String getKey(String s) {\n    StringBuilder sb = new StringBuilder();\n    // Compute differences between consecutive characters\n    for (int i = 1; i < s.length(); i++) {\n        int diff = (s.charAt(i) - s.charAt(i - 1) + 26) % 26;\n        sb.append(diff).append(',');\n    }\n    return sb.toString();\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        13,
        14,
        15
      ],
      "build_key": [
        4,
        17
      ],
      "check_group": [
        5
      ],
      "create_group": [
        5
      ],
      "add_to_group": [
        5
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<string>> groupStrings(vector<string>& strings) {\n    unordered_map<string, vector<string>> groups;\n    for (const string& s : strings) {\n        string key = getKey(s);\n        groups[key].push_back(s);\n    }\n    vector<vector<string>> result;\n    for (auto& [key, group] : groups) {\n        result.push_back(move(group));\n    }\n    return result;\n}\n\nstring getKey(const string& s) {\n    string key;\n    // Compute differences between consecutive characters\n    for (int i = 1; i < s.size(); i++) {\n        int diff = (s[i] - s[i - 1] + 26) % 26;\n        key += to_string(diff) + \",\";\n    }\n    return key;\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        17,
        18,
        19
      ],
      "build_key": [
        4,
        21
      ],
      "check_group": [
        5
      ],
      "create_group": [
        5
      ],
      "add_to_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<string>> GroupStrings(string[] strings) {\n    var groups = new Dictionary<string, IList<string>>();\n    foreach (string s in strings) {\n        string key = GetKey(s);\n        if (!groups.ContainsKey(key)) {\n            groups[key] = new List<string>();\n        }\n        groups[key].Add(s);\n    }\n    return new List<IList<string>>(groups.Values);\n}\n\nprivate string GetKey(string s) {\n    var sb = new System.Text.StringBuilder();\n    // Compute differences between consecutive characters\n    for (int i = 1; i < s.Length; i++) {\n        int diff = (s[i] - s[i - 1] + 26) % 26;\n        sb.Append(diff).Append(',');\n    }\n    return sb.ToString();\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        16,
        17,
        18
      ],
      "build_key": [
        4,
        20
      ],
      "check_group": [
        5,
        6
      ],
      "create_group": [
        6
      ],
      "add_to_group": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func groupStrings(strings []string) [][]string {\n    groups := make(map[string][]string)\n    for _, s := range strings {\n        key := getKey(s)\n        groups[key] = append(groups[key], s)\n    }\n    result := make([][]string, 0, len(groups))\n    for _, group := range groups {\n        result = append(result, group)\n    }\n    return result\n}\n\nfunc getKey(s string) string {\n    key := \"\"\n    // Compute differences between consecutive characters\n    for i := 1; i < len(s); i++ {\n        diff := (int(s[i]) - int(s[i-1]) + 26) % 26\n        key += strconv.Itoa(diff) + \",\"\n    }\n    return key\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        17,
        18,
        19
      ],
      "build_key": [
        4,
        21
      ],
      "check_group": [
        5
      ],
      "create_group": [
        5
      ],
      "add_to_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "function groupStrings(strings) {\n    const groups = new Map();\n    for (const s of strings) {\n        const key = getKey(s);\n        if (!groups.has(key)) {\n            groups.set(key, []);\n        }\n        groups.get(key).push(s);\n    }\n    return Array.from(groups.values());\n}\n\nfunction getKey(s) {\n    const parts = [];\n    // Compute differences between consecutive characters\n    for (let i = 1; i < s.length; i++) {\n        const diff = (s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26;\n        parts.push(diff);\n    }\n    return parts.join(',');\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        16,
        17,
        18
      ],
      "build_key": [
        4,
        20
      ],
      "check_group": [
        5,
        6
      ],
      "create_group": [
        6
      ],
      "add_to_group": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function groupStrings(strings: string[]): string[][] {\n    const groups = new Map<string, string[]>();\n    for (const s of strings) {\n        const key = getKey(s);\n        if (!groups.has(key)) {\n            groups.set(key, []);\n        }\n        groups.get(key)!.push(s);\n    }\n    return Array.from(groups.values());\n}\n\nfunction getKey(s: string): string {\n    const parts: number[] = [];\n    // Compute differences between consecutive characters\n    for (let i = 1; i < s.length; i++) {\n        const diff = (s.charCodeAt(i) - s.charCodeAt(i - 1) + 26) % 26;\n        parts.push(diff);\n    }\n    return parts.join(',');\n}",
    "lineMap": {
      "-": [
        2
      ],
      "process_string": [
        3
      ],
      "compute_diff": [
        16,
        17,
        18
      ],
      "build_key": [
        4,
        20
      ],
      "check_group": [
        5,
        6
      ],
      "create_group": [
        6
      ],
      "add_to_group": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  }
};

const GroupShiftedStringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "strings": [
        "abc",
        "bcd",
        "acef",
        "xyz",
        "az",
        "ba",
        "a",
        "z"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Same Group",
    "value": {
      "strings": [
        "ab",
        "bc",
        "cd"
      ]
    }
  }
];

function generateGroupShiftedStringsSteps(e: any): any[] {
  let{strings:t}=e,r={};for(let e=0;e<t.length;e++)r[`word_${e}`]={type:"arrayElement",value:t[e],position:e,state:"pending"};let s=new StepRecorder({},r),n=()=>{s.delete_variable("activeWord"),s.delete_variable("diffChars"),s.delete_variable("diffs"),s.delete_variable("diffKey"),s.delete_variable("justAddedWord")},a=[],l=new Map,o=()=>a.forEach(e=>e.flash=null),g=()=>s.update_variable("buckets",a);s.update_variable("buckets",a),s.record("-","Group strings that are shifts of each other by their difference key");for(let e=0;e<t.length;e++){let r=t[e];for(let r=0;r<t.length;r++){let t=r<e?"done":r===e?"active":"pending",i=s.get_visual(`word_${r}`);s.update_visual(`word_${r}`,{...i,state:t})}o(),n(),s.update_variable("activeWord",e),s.update_variable("diffChars",r.split("")),g(),s.record("process_string",`Take the next string: "${r}"`);let i=[];for(let e=1;e<r.length;e++){let t=(r.charCodeAt(e)-r.charCodeAt(e-1)+26)%26;i.push(t)}let d=i.join(",");if(s.update_variable("activeWord",e),s.update_variable("diffChars",r.split("")),s.update_variable("diffs",i),s.record("compute_diff",`Difference between each pair of letters: [${i.join(", ")}]`),s.update_variable("diffKey",d),s.record("build_key",`Key = "${d||"(empty)"}"`),l.has(d))o(),a[l.get(d)].flash="add",g(),s.record("check_group","Seen this key before: reuse its group");else{let e={key:d,diffs:i,words:[],flash:"new"};l.set(d,a.length),a.push(e),g(),s.record("create_group","New key: start a fresh group")}o();let u=l.get(d);a[u].words.push(r),a[u].flash=1===a[u].words.length?"new":"add",s.update_variable("justAddedWord",r),g(),s.record("add_to_group",`Add "${r}" to its group`)}for(let e=0;e<t.length;e++){let t=s.get_visual(`word_${e}`);s.update_visual(`word_${e}`,{...t,state:"done"})}return o(),n(),s.update_variable("done",!0),g(),s.record("complete",`Done: ${a.length} shifted-string group${1===a.length?"":"s"} found`),s.getSteps()
}

export function GroupShiftedStringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GroupShiftedStringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGroupShiftedStringsSteps(e) as any[];
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
      title="Group Shifted Strings"
      slug="group-shifted-strings"
      approaches={approaches}
      presets={GroupShiftedStringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Happy Number (happy-number)
// ==========================================

const HappyNumberTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def isHappy(self, n: int) -> bool:\n        slow = n\n        fast = self.get_next(n)\n\n        # Fast moves two steps, slow moves one step\n        while fast != 1 and slow != fast:\n            slow = self.get_next(slow)\n            fast = self.get_next(self.get_next(fast))\n\n        return fast == 1\n\n    def get_next(self, n: int) -> int:\n        total = 0\n        while n > 0:\n            digit = n % 10\n            total += digit * digit\n            n //= 10\n        return total",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "compute_slow": [
        8
      ],
      "compute_fast": [
        9
      ],
      "check_equal": [
        7
      ],
      "found_one": [
        11
      ],
      "found_cycle": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean isHappy(int n) {\n        int slow = n;\n        int fast = getNext(n);\n\n        // Fast moves two steps, slow moves one step\n        while (fast != 1 && slow != fast) {\n            slow = getNext(slow);\n            fast = getNext(getNext(fast));\n        }\n\n        return fast == 1;\n    }\n\n    private int getNext(int n) {\n        int sum = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            sum += digit * digit;\n            n /= 10;\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "compute_slow": [
        8
      ],
      "compute_fast": [
        9
      ],
      "check_equal": [
        7
      ],
      "found_one": [
        12
      ],
      "found_cycle": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool isHappy(int n) {\n        int slow = n;\n        int fast = getNext(n);\n\n        // Fast moves two steps, slow moves one step\n        while (fast != 1 && slow != fast) {\n            slow = getNext(slow);\n            fast = getNext(getNext(fast));\n        }\n\n        return fast == 1;\n    }\n\nprivate:\n    int getNext(int n) {\n        int sum = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            sum += digit * digit;\n            n /= 10;\n        }\n        return sum;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5
      ],
      "compute_slow": [
        9
      ],
      "compute_fast": [
        10
      ],
      "check_equal": [
        8
      ],
      "found_one": [
        13
      ],
      "found_cycle": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IsHappy(int n) {\n        int slow = n;\n        int fast = GetNext(n);\n\n        // Fast moves two steps, slow moves one step\n        while (fast != 1 && slow != fast) {\n            slow = GetNext(slow);\n            fast = GetNext(GetNext(fast));\n        }\n\n        return fast == 1;\n    }\n\n    private int GetNext(int n) {\n        int sum = 0;\n        while (n > 0) {\n            int digit = n % 10;\n            sum += digit * digit;\n            n /= 10;\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "compute_slow": [
        8
      ],
      "compute_fast": [
        9
      ],
      "check_equal": [
        7
      ],
      "found_one": [
        12
      ],
      "found_cycle": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isHappy(n int) bool {\n    slow := n\n    fast := getNext(n)\n\n    // Fast moves two steps, slow moves one step\n    for fast != 1 && slow != fast {\n        slow = getNext(slow)\n        fast = getNext(getNext(fast))\n    }\n\n    return fast == 1\n}\n\nfunc getNext(n int) int {\n    sum := 0\n    for n > 0 {\n        digit := n % 10\n        sum += digit * digit\n        n /= 10\n    }\n    return sum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "compute_slow": [
        7
      ],
      "compute_fast": [
        8
      ],
      "check_equal": [
        6
      ],
      "found_one": [
        11
      ],
      "found_cycle": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isHappy = function(n) {\n    var slow = n;\n    var fast = getNext(n);\n\n    // Fast moves two steps, slow moves one step\n    while (fast !== 1 && slow !== fast) {\n        slow = getNext(slow);\n        fast = getNext(getNext(fast));\n    }\n\n    return fast === 1;\n};\n\nfunction getNext(n) {\n    var sum = 0;\n    while (n > 0) {\n        var digit = n % 10;\n        sum += digit * digit;\n        n = Math.floor(n / 10);\n    }\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "compute_slow": [
        7
      ],
      "compute_fast": [
        8
      ],
      "check_equal": [
        6
      ],
      "found_one": [
        11
      ],
      "found_cycle": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isHappy(n: number): boolean {\n    let slow = n;\n    let fast = getNext(n);\n\n    // Fast moves two steps, slow moves one step\n    while (fast !== 1 && slow !== fast) {\n        slow = getNext(slow);\n        fast = getNext(getNext(fast));\n    }\n\n    return fast === 1;\n}\n\nfunction getNext(n: number): number {\n    let sum = 0;\n    while (n > 0) {\n        const digit = n % 10;\n        sum += digit * digit;\n        n = Math.floor(n / 10);\n    }\n    return sum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "compute_slow": [
        7
      ],
      "compute_fast": [
        8
      ],
      "check_equal": [
        6
      ],
      "found_one": [
        11
      ],
      "found_cycle": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ]
    }
  }
};

const HappyNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Happy (19)",
    "value": {
      "n": 19
    }
  },
  {
    "id": "ex2",
    "label": "Unhappy (2)",
    "value": {
      "n": 2
    }
  },
  {
    "id": "ex3",
    "label": "Happy (7)",
    "value": {
      "n": 7
    }
  },
  {
    "id": "ex4",
    "label": "Unhappy (4)",
    "value": {
      "n": 4
    }
  }
];

function generateHappyNumberSteps(e: any): any[] {
  function i(e){let t=0;for(;e>0;){let n=e%10;t+=n*n,e=Math.floor(e/10)}return t}
let t=e.n,n=[t],o=new Set;o.add(t);let l=t,s=!1,r=-1;for(;;){let e=i(l);if(1===e){n.push(1),s=!0;break}if(o.has(e)){r=n.indexOf(e);break}o.add(e),n.push(e),l=e}let u=new Map;for(let e=0;e<n.length;e++)u.set(n[e],e);let p={};for(let e=0;e<n.length;e++)p[`node_${e}`]={type:"arrayElement",value:n[e],position:e};for(let e=0;e<n.length-1;e++)p[`arrow_${e}`]={type:"range",start:e,end:e+1};!s&&r>=0&&(p.arrow_cycle={type:"range",start:n.length-1,end:r,label:"cycle"});let d=i(t),c=u.get(d);p.ptr_slow={type:"pointer",position:0,label:"slow"},p.ptr_fast={type:"pointer",position:c,label:"fast"};let h=new StepRecorder({},p);h.record("-",`Start: Determine if ${t} is a happy number using Floyd's cycle detection`);let f=t,_=i(t),m=0,g=c;for(h.update_visual(`node_${m}`,{type:"arrayElement",value:n[m],position:m,state:"active"}),g!==m&&h.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"highlight"}),h.record("init",`Initialize slow = ${f}, fast = getNext(${t}) = ${_}`);1!==_&&f!==_;){h.add_conditional("while_loop",!0),h.update_visual(`node_${m}`,{type:"arrayElement",value:n[m],position:m,state:"visited"}),g!==m&&h.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"visited"});let e=f;f=i(f),m=u.get(f),h.update_visual("ptr_slow",{type:"pointer",position:m,label:"slow"}),h.update_visual(`node_${m}`,{type:"arrayElement",value:n[m],position:m,state:"active"}),h.record("compute_slow",`slow = getNext(${e}) = ${f}`);let t=_,a=i(_);g!==m&&h.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"visited"}),_=i(a),g=u.get(_),h.update_visual("ptr_fast",{type:"pointer",position:g,label:"fast"}),g!==m?h.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"highlight"}):h.update_visual(`node_${g}`,{type:"arrayElement",value:n[g],position:g,state:"error"}),h.record("compute_fast",`fast = getNext(getNext(${t})) = getNext(${a}) = ${_}`),1===_||f===_?(h.add_conditional("while_loop",!1),h.record("check_equal",1===_?"fast == 1, exit loop":`slow == fast == ${f}, cycle detected, exit loop`)):(h.add_conditional("while_loop",!0),h.record("check_equal","fast != 1 and slow != fast, continue loop"))}return 1===_?(h.update_visual(`node_${g}`,{type:"arrayElement",value:1,position:g,state:"sorted"}),h.record("found_one",`fast == 1: ${t} is a happy number!`)):(h.update_visual(`node_${m}`,{type:"arrayElement",value:n[m],position:m,state:"error"}),h.record("found_cycle",`slow == fast == ${f}: Cycle detected! ${t} is not a happy number`)),h.record("complete",`Result: ${s?`${t} is a happy number`:`${t} is not a happy number`}`),h.getSteps()
}

export function HappyNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HappyNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateHappyNumberSteps(e) as any[];
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
      title="Happy Number"
      slug="happy-number"
      approaches={approaches}
      presets={HappyNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Insert Delete GetRandom O(1) (insert-delete-getrandom-o1)
// ==========================================

const InsertDeleteGetrandomO1Templates = {
  "python": {
    "language": "python",
    "code": "class RandomizedSet:\n    def __init__(self):\n        self.list = []\n        self.val_to_index = {}\n\n    def insert(self, val: int) -> bool:\n        if val in self.val_to_index:\n            return False\n        # Append to end of list and record its index\n        self.val_to_index[val] = len(self.list)\n        self.list.append(val)\n        return True\n\n    def remove(self, val: int) -> bool:\n        if val not in self.val_to_index:\n            return False\n        # Swap target with last element, then pop last\n        idx = self.val_to_index[val]\n        last_val = self.list[-1]\n        self.list[idx] = last_val\n        self.val_to_index[last_val] = idx\n        self.list.pop()\n        del self.val_to_index[val]\n        return True\n\n    def getRandom(self) -> int:\n        return random.choice(self.list)",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "insert_start": [
        6
      ],
      "insert_check": [
        7
      ],
      "insert_exists": [
        8
      ],
      "insert_add_map": [
        10
      ],
      "insert_add_array": [
        11
      ],
      "insert_done": [
        12
      ],
      "remove_start": [
        14
      ],
      "remove_check": [
        15
      ],
      "remove_absent": [
        16
      ],
      "remove_get_index": [
        18,
        19
      ],
      "remove_swap": [
        20
      ],
      "remove_update_map": [
        21
      ],
      "remove_pop": [
        22
      ],
      "remove_delete_map": [
        23
      ],
      "remove_done": [
        24
      ],
      "random_start": [
        26
      ],
      "random_pick": [
        27
      ],
      "random_done": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "insert_has": [
        7
      ],
      "remove_has": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class RandomizedSet {\n    List<Integer> list;\n    Map<Integer, Integer> valToIndex;\n    Random rand;\n\n    public RandomizedSet() {\n        list = new ArrayList<>();\n        valToIndex = new HashMap<>();\n        rand = new Random();\n    }\n\n    public boolean insert(int val) {\n        if (valToIndex.containsKey(val)) return false;\n        // Append to end of list and record its index\n        valToIndex.put(val, list.size());\n        list.add(val);\n        return true;\n    }\n\n    public boolean remove(int val) {\n        if (!valToIndex.containsKey(val)) return false;\n        // Swap target with last element, then pop last\n        int idx = valToIndex.get(val);\n        int lastVal = list.get(list.size() - 1);\n        list.set(idx, lastVal);\n        valToIndex.put(lastVal, idx);\n        list.remove(list.size() - 1);\n        valToIndex.remove(val);\n        return true;\n    }\n\n    public int getRandom() {\n        return list.get(rand.nextInt(list.size()));\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8
      ],
      "insert_start": [
        12
      ],
      "insert_check": [
        13
      ],
      "insert_exists": [
        13
      ],
      "insert_add_map": [
        15
      ],
      "insert_add_array": [
        16
      ],
      "insert_done": [
        17
      ],
      "remove_start": [
        20
      ],
      "remove_check": [
        21
      ],
      "remove_absent": [
        21
      ],
      "remove_get_index": [
        23,
        24
      ],
      "remove_swap": [
        25
      ],
      "remove_update_map": [
        26
      ],
      "remove_pop": [
        27
      ],
      "remove_delete_map": [
        28
      ],
      "remove_done": [
        29
      ],
      "random_start": [
        32
      ],
      "random_pick": [
        33
      ],
      "random_done": [
        33
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "insert_has": [
        13
      ],
      "remove_has": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class RandomizedSet {\n    vector<int> list;\n    unordered_map<int, int> valToIndex;\n\npublic:\n    RandomizedSet() {}\n\n    bool insert(int val) {\n        if (valToIndex.count(val)) return false;\n        // Append to end of list and record its index\n        valToIndex[val] = list.size();\n        list.push_back(val);\n        return true;\n    }\n\n    bool remove(int val) {\n        if (!valToIndex.count(val)) return false;\n        // Swap target with last element, then pop last\n        int idx = valToIndex[val];\n        int lastVal = list.back();\n        list[idx] = lastVal;\n        valToIndex[lastVal] = idx;\n        list.pop_back();\n        valToIndex.erase(val);\n        return true;\n    }\n\n    int getRandom() {\n        return list[rand() % list.size()];\n    }\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "insert_start": [
        8
      ],
      "insert_check": [
        9
      ],
      "insert_exists": [
        9
      ],
      "insert_add_map": [
        11
      ],
      "insert_add_array": [
        12
      ],
      "insert_done": [
        13
      ],
      "remove_start": [
        16
      ],
      "remove_check": [
        17
      ],
      "remove_absent": [
        17
      ],
      "remove_get_index": [
        19,
        20
      ],
      "remove_swap": [
        21
      ],
      "remove_update_map": [
        22
      ],
      "remove_pop": [
        23
      ],
      "remove_delete_map": [
        24
      ],
      "remove_done": [
        25
      ],
      "random_start": [
        28
      ],
      "random_pick": [
        29
      ],
      "random_done": [
        29
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "insert_has": [
        9
      ],
      "remove_has": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class RandomizedSet {\n    List<int> list;\n    Dictionary<int, int> valToIndex;\n    Random rand;\n\n    public RandomizedSet() {\n        list = new List<int>();\n        valToIndex = new Dictionary<int, int>();\n        rand = new Random();\n    }\n\n    public bool Insert(int val) {\n        if (valToIndex.ContainsKey(val)) return false;\n        // Append to end of list and record its index\n        valToIndex[val] = list.Count;\n        list.Add(val);\n        return true;\n    }\n\n    public bool Remove(int val) {\n        if (!valToIndex.ContainsKey(val)) return false;\n        // Swap target with last element, then pop last\n        int idx = valToIndex[val];\n        int lastVal = list[list.Count - 1];\n        list[idx] = lastVal;\n        valToIndex[lastVal] = idx;\n        list.RemoveAt(list.Count - 1);\n        valToIndex.Remove(val);\n        return true;\n    }\n\n    public int GetRandom() {\n        return list[rand.Next(list.Count)];\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8
      ],
      "insert_start": [
        12
      ],
      "insert_check": [
        13
      ],
      "insert_exists": [
        13
      ],
      "insert_add_map": [
        15
      ],
      "insert_add_array": [
        16
      ],
      "insert_done": [
        17
      ],
      "remove_start": [
        20
      ],
      "remove_check": [
        21
      ],
      "remove_absent": [
        21
      ],
      "remove_get_index": [
        23,
        24
      ],
      "remove_swap": [
        25
      ],
      "remove_update_map": [
        26
      ],
      "remove_pop": [
        27
      ],
      "remove_delete_map": [
        28
      ],
      "remove_done": [
        29
      ],
      "random_start": [
        32
      ],
      "random_pick": [
        33
      ],
      "random_done": [
        33
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "insert_has": [
        13
      ],
      "remove_has": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type RandomizedSet struct {\n    list       []int\n    valToIndex map[int]int\n}\n\nfunc Constructor() RandomizedSet {\n    return RandomizedSet{\n        list:       []int{},\n        valToIndex: make(map[int]int),\n    }\n}\n\nfunc (rs *RandomizedSet) Insert(val int) bool {\n    if _, exists := rs.valToIndex[val]; exists {\n        return false\n    }\n    // Append to end of list and record its index\n    rs.valToIndex[val] = len(rs.list)\n    rs.list = append(rs.list, val)\n    return true\n}\n\nfunc (rs *RandomizedSet) Remove(val int) bool {\n    idx, exists := rs.valToIndex[val]\n    if !exists {\n        return false\n    }\n    // Swap target with last element, then pop last\n    lastVal := rs.list[len(rs.list)-1]\n    rs.list[idx] = lastVal\n    rs.valToIndex[lastVal] = idx\n    rs.list = rs.list[:len(rs.list)-1]\n    delete(rs.valToIndex, val)\n    return true\n}\n\nfunc (rs *RandomizedSet) GetRandom() int {\n    return rs.list[rand.Intn(len(rs.list))]\n}",
    "lineMap": {
      "-": [
        8,
        9
      ],
      "insert_start": [
        13
      ],
      "insert_check": [
        14
      ],
      "insert_exists": [
        15
      ],
      "insert_add_map": [
        18
      ],
      "insert_add_array": [
        19
      ],
      "insert_done": [
        20
      ],
      "remove_start": [
        23
      ],
      "remove_check": [
        24,
        25
      ],
      "remove_absent": [
        26
      ],
      "remove_get_index": [
        24,
        29
      ],
      "remove_swap": [
        30
      ],
      "remove_update_map": [
        31
      ],
      "remove_pop": [
        32
      ],
      "remove_delete_map": [
        33
      ],
      "remove_done": [
        34
      ],
      "random_start": [
        37
      ],
      "random_pick": [
        38
      ],
      "random_done": [
        38
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "insert_has": [
        14
      ],
      "remove_has": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var RandomizedSet = function () {\n  this.list = [];\n  this.valToIndex = new Map();\n};\n\nRandomizedSet.prototype.insert = function (val) {\n  if (this.valToIndex.has(val)) return false;\n  // Append to end of list and record its index\n  this.valToIndex.set(val, this.list.length);\n  this.list.push(val);\n  return true;\n};\n\nRandomizedSet.prototype.remove = function (val) {\n  if (!this.valToIndex.has(val)) return false;\n  // Swap target with last element, then pop last\n  var idx = this.valToIndex.get(val);\n  var lastVal = this.list[this.list.length - 1];\n  this.list[idx] = lastVal;\n  this.valToIndex.set(lastVal, idx);\n  this.list.pop();\n  this.valToIndex.delete(val);\n  return true;\n};\n\nRandomizedSet.prototype.getRandom = function () {\n  return this.list[Math.floor(Math.random() * this.list.length)];\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "insert_start": [
        6
      ],
      "insert_check": [
        7
      ],
      "insert_exists": [
        7
      ],
      "insert_add_map": [
        9
      ],
      "insert_add_array": [
        10
      ],
      "insert_done": [
        11
      ],
      "remove_start": [
        14
      ],
      "remove_check": [
        15
      ],
      "remove_absent": [
        15
      ],
      "remove_get_index": [
        17,
        18
      ],
      "remove_swap": [
        19
      ],
      "remove_update_map": [
        20
      ],
      "remove_pop": [
        21
      ],
      "remove_delete_map": [
        22
      ],
      "remove_done": [
        23
      ],
      "random_start": [
        26
      ],
      "random_pick": [
        27
      ],
      "random_done": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "insert_has": [
        7
      ],
      "remove_has": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class RandomizedSet {\n    private list: number[];\n    private valToIndex: Map<number, number>;\n\n    constructor() {\n        this.list = [];\n        this.valToIndex = new Map<number, number>();\n    }\n\n    insert(val: number): boolean {\n        if (this.valToIndex.has(val)) return false;\n        // Append to end of list and record its index\n        this.valToIndex.set(val, this.list.length);\n        this.list.push(val);\n        return true;\n    }\n\n    remove(val: number): boolean {\n        if (!this.valToIndex.has(val)) return false;\n        // Swap target with last element, then pop last\n        const idx = this.valToIndex.get(val)!;\n        const lastVal = this.list[this.list.length - 1];\n        this.list[idx] = lastVal;\n        this.valToIndex.set(lastVal, idx);\n        this.list.pop();\n        this.valToIndex.delete(val);\n        return true;\n    }\n\n    getRandom(): number {\n        return this.list[Math.floor(Math.random() * this.list.length)];\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "insert_start": [
        10
      ],
      "insert_check": [
        11
      ],
      "insert_exists": [
        11
      ],
      "insert_add_map": [
        13
      ],
      "insert_add_array": [
        14
      ],
      "insert_done": [
        15
      ],
      "remove_start": [
        18
      ],
      "remove_check": [
        19
      ],
      "remove_absent": [
        19
      ],
      "remove_get_index": [
        21,
        22
      ],
      "remove_swap": [
        23
      ],
      "remove_update_map": [
        24
      ],
      "remove_pop": [
        25
      ],
      "remove_delete_map": [
        26
      ],
      "remove_done": [
        27
      ],
      "random_start": [
        30
      ],
      "random_pick": [
        31
      ],
      "random_done": [
        31
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "insert_has": [
        11
      ],
      "remove_has": [
        19
      ]
    }
  }
};

const InsertDeleteGetrandomO1Presets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "operations": [
        "RandomizedSet",
        "insert",
        "insert",
        "remove",
        "insert",
        "getRandom",
        "remove"
      ],
      "values": [
        null,
        1,
        2,
        1,
        2,
        null,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "operations": [
        "RandomizedSet",
        "insert",
        "remove",
        "insert",
        "getRandom"
      ],
      "values": [
        null,
        1,
        2,
        2,
        null
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "operations": [
        "RandomizedSet",
        "insert",
        "insert",
        "insert",
        "remove",
        "insert",
        "getRandom",
        "getRandom"
      ],
      "values": [
        null,
        5,
        10,
        15,
        10,
        20,
        null,
        null
      ]
    }
  }
];

function generateInsertDeleteGetrandomO1Steps(e: any): any[] {
  let t=e.operations||[],r=e.values||[],n=[];for(let e=0;e<t.length;e++){let a=t[e];"RandomizedSet"!==a&&("insert"===a||"remove"===a?n.push({kind:a,val:r[e]??null}):"getRandom"===a&&n.push({kind:"getRandom",val:null}))}let l=e=>"getRandom"===e.kind?"getRandom()":`${e.kind}(${e.val})`,s=0;for(let e of n.map(l))for(let t=0;t<e.length;t++)s=31*s+e.charCodeAt(t)>>>0;let i=new Set,o=[],d=n.map(e=>{var t;if("insert"===e.kind)return i.has(e.val)?"false":(i.add(e.val),"true");if("remove"===e.kind)return i.has(e.val)?(i.delete(e.val),"true"):"false";let r=i.size>0?(t=i.size,(s=1664525*s+0x3c6ef35f>>>0)%t):-1;return o.push(r),r>=0?String([...i][r]):"-"}),m=new StepRecorder({},{}),c=[],u=(e,t)=>{m.update_variable("opIdx",e),m.update_variable("kind",t),m.update_variable("set",c)},p=()=>{m.update_variable("val",""),m.update_variable("exists",""),m.update_variable("scanned",[]),m.update_variable("randomIdx",-1),m.update_variable("result","")};m.update_variable("ops",n.map(l)),m.update_variable("opResults",d),u(-1,"init"),p(),m.record("-","RandomizedSet backed by a hash set: membership is O(1), but a random pick needs the whole set laid out first.");let h=0;for(let e=0;e<n.length;e++){let t=n[e];if("insert"===t.kind){let r=t.val,a=c.includes(r);if(u(e,"insert"),p(),m.update_variable("val",r),m.update_variable("exists",a),m.record("insert_start",`Operation: insert(${r})`),a){m.record("insert_exists",`${r} is already in the set, return false`);continue}c.push(r),m.update_variable("set",c),m.record("insert_add",`Add ${r} to the set and return true`)}else if("remove"===t.kind){let r=t.val,a=c.indexOf(r);if(u(e,"remove"),p(),m.update_variable("val",r),m.update_variable("exists",a>=0),m.record("remove_start",`Operation: remove(${r})`),a<0){m.record("remove_absent",`${r} is not in the set, return false`);continue}c.splice(a,1),m.update_variable("set",c),m.record("remove_erase",`Erase ${r} from the set and return true`)}else{u(e,"getRandom"),p(),m.record("random_start","Operation: getRandom()");let t=o[h++]??-1;if(t<0||0===c.length){m.update_variable("result","-"),m.record("random_materialize","The set is empty, there is nothing to lay out"),m.record("random_pick","No index to roll"),m.record("random_done","Return nothing");continue}m.update_variable("scanned",c),m.record("random_materialize",`Walk all ${c.length} element(s) into a list. Cost: O(${c.length}).`),m.update_variable("randomIdx",t),m.record("random_pick",`Roll a random index in [0, ${c.length-1}]: got ${t}`),m.update_variable("result",String(c[t])),m.record("random_done",`Return list[${t}] = ${c[t]}`)}}return u(n.length,"done"),p(),m.record("complete",`Done! ${c.length} element(s) in the set. Every getRandom paid O(n) to lay them out.`),m.getSteps()
}

export function InsertDeleteGetrandomO1ProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertDeleteGetrandomO1Templates,
      generateSteps: (e: any) => {
        const recorded = generateInsertDeleteGetrandomO1Steps(e) as any[];
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
      title="Insert Delete GetRandom O(1)"
      slug="insert-delete-getrandom-o1"
      approaches={approaches}
      presets={InsertDeleteGetrandomO1Presets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Palindrome (longest-palindrome)
// ==========================================

const LongestPalindromeTemplates = {
  "python": {
    "language": "python",
    "code": "def longestPalindrome(s: str) -> int:\n    odd_chars = set()\n    length = 0\n    for c in s:\n        if c in odd_chars:\n            # Pair completed, add 2 to length\n            odd_chars.remove(c)\n            length += 2\n        else:\n            # First of a potential pair\n            odd_chars.add(c)\n    # If any unpaired characters remain, one can go in the center\n    if odd_chars:\n        length += 1\n    return length",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        13
      ],
      "add_center": [
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestPalindrome(String s) {\n    Set<Character> oddChars = new HashSet<>();\n    int length = 0;\n    for (char c : s.toCharArray()) {\n        if (oddChars.contains(c)) {\n            // Pair completed, add 2 to length\n            oddChars.remove(c);\n            length += 2;\n        } else {\n            // First of a potential pair\n            oddChars.add(c);\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if (!oddChars.isEmpty()) {\n        length++;\n    }\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        15
      ],
      "add_center": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestPalindrome(string s) {\n    unordered_set<char> oddChars;\n    int length = 0;\n    for (char c : s) {\n        if (oddChars.count(c)) {\n            // Pair completed, add 2 to length\n            oddChars.erase(c);\n            length += 2;\n        } else {\n            // First of a potential pair\n            oddChars.insert(c);\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if (!oddChars.empty()) {\n        length++;\n    }\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        15
      ],
      "add_center": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestPalindrome(string s) {\n    var oddChars = new HashSet<char>();\n    int length = 0;\n    foreach (char c in s) {\n        if (oddChars.Contains(c)) {\n            // Pair completed, add 2 to length\n            oddChars.Remove(c);\n            length += 2;\n        } else {\n            // First of a potential pair\n            oddChars.Add(c);\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if (oddChars.Count > 0) {\n        length++;\n    }\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        15
      ],
      "add_center": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestPalindrome(s string) int {\n    oddChars := make(map[byte]bool)\n    length := 0\n    for i := 0; i < len(s); i++ {\n        c := s[i]\n        if oddChars[c] {\n            // Pair completed, add 2 to length\n            delete(oddChars, c)\n            length += 2\n        } else {\n            // First of a potential pair\n            oddChars[c] = true\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if len(oddChars) > 0 {\n        length++\n    }\n    return length\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5,
        6
      ],
      "pair_found": [
        8,
        9
      ],
      "add_to_set": [
        12
      ],
      "check_odd": [
        16
      ],
      "add_center": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "in_set": [
        6
      ],
      "set_empty": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestPalindrome = function(s) {\n    const oddChars = new Set();\n    let length = 0;\n    for (const c of s) {\n        if (oddChars.has(c)) {\n            // Pair completed, add 2 to length\n            oddChars.delete(c);\n            length += 2;\n        } else {\n            // First of a potential pair\n            oddChars.add(c);\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if (oddChars.size > 0) {\n        length++;\n    }\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        15
      ],
      "add_center": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestPalindrome(s: string): number {\n    const oddChars = new Set<string>();\n    let length = 0;\n    for (const c of s) {\n        if (oddChars.has(c)) {\n            // Pair completed, add 2 to length\n            oddChars.delete(c);\n            length += 2;\n        } else {\n            // First of a potential pair\n            oddChars.add(c);\n        }\n    }\n    // If any unpaired characters remain, one can go in the center\n    if (oddChars.size > 0) {\n        length++;\n    }\n    return length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_char": [
        4,
        5
      ],
      "pair_found": [
        7,
        8
      ],
      "add_to_set": [
        11
      ],
      "check_odd": [
        15
      ],
      "add_center": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "in_set": [
        5
      ],
      "set_empty": [
        15
      ]
    }
  }
};

const LongestPalindromePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (ans: 7)",
    "value": {
      "s": "abccccdd"
    }
  },
  {
    "id": "ex2",
    "label": "Single char (ans: 1)",
    "value": {
      "s": "a"
    }
  },
  {
    "id": "ex3",
    "label": "All pairs (ans: 6)",
    "value": {
      "s": "aabbcc"
    }
  }
];

function generateLongestPalindromeSteps(e: any): any[] {
  let t=e.s,a=t.length,i={};for(let e=0;e<a;e++)i[`char_${e}`]={type:"arrayElement",value:t[e],position:e};let l=new StepRecorder({s:t},i);l.record("-",`Start: find the length of the longest palindrome that can be built from "${t}"`);let r=[],s={},o=0;l.add_new_variable("length",o),l.add_new_variable("oddChars","{}"),l.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),l.add_new_visual("meta_length",{type:"metadata",value:o,label:"length"}),l.record("init","Initialize: length = 0, oddChars = {} (empty set)");let d=()=>r.length>0?`{${r.join(", ")}}`:"{}",c=()=>{r.forEach((e,t)=>{l.update_visual(`set_${e}`,{type:"stateElement",value:e,index:t,state:"inSet"})})};for(let e=0;e<a;e++){let a=t[e];l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.update_visual(`char_${e}`,{type:"arrayElement",value:a,position:e,state:"checking"});let n=void 0!==s[a];if(l.add_conditional("in_set",n),l.record("check_char",`Check s[${e}] = '${a}': is '${a}' already waiting in oddChars? ${n?"Yes":"No"}`),n){let t=s[a];delete s[a],r.splice(r.indexOf(a),1),o+=2,l.update_variable("length",o),l.update_variable("oddChars",d()),l.update_visual("meta_length",{type:"metadata",value:o,label:"length"}),l.update_visual(`char_${t}`,{type:"arrayElement",value:a,position:t,state:"matched"}),l.update_visual(`char_${e}`,{type:"arrayElement",value:a,position:e,state:"matched"}),l.add_new_visual(`pair_${t}_${e}`,{type:"range",start:t,end:e,label:"pair"}),l.delete_visual(`set_${a}`),c(),l.record("pair_found",`Pair! '${a}' at index ${t} and ${e}, remove it from the set, length += 2 = ${o}`)}else s[a]=e,r.push(a),l.update_variable("oddChars",d()),l.update_visual(`char_${e}`,{type:"arrayElement",value:a,position:e,state:"inSet"}),l.add_new_visual(`set_${a}`,{type:"stateElement",value:a,index:r.length-1,state:"inSet"}),l.record("add_to_set",`No pair yet: add '${a}' to oddChars = ${d()}`)}l.delete_visual("ptr_i");let h=0===r.length;if(l.add_conditional("set_empty",!h),l.record("check_odd",`Every character processed. Is oddChars empty? ${h?"Yes":`No, ${r.length} char(s) are left unpaired`}`),!h){o++,l.update_variable("length",o),l.update_visual("meta_length",{type:"metadata",value:o,label:"length"});let e=r[0];l.update_visual(`char_${s[e]}`,{type:"arrayElement",value:e,position:s[e],state:"matched"}),l.update_visual(`set_${e}`,{type:"stateElement",value:e,index:0,state:"matched"});for(let e=1;e<r.length;e++){let t=r[e];l.update_visual(`char_${s[t]}`,{type:"arrayElement",value:t,position:s[t],state:"dim"}),l.update_visual(`set_${t}`,{type:"stateElement",value:t,index:e,state:"dim"})}l.record("add_center",`oddChars is not empty: one odd char ('${e}') can sit in the center, length += 1 = ${o}`)}return l.record("complete",`Done! Longest palindrome length = ${o}`),l.getSteps()
}

export function LongestPalindromeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestPalindromeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestPalindromeSteps(e) as any[];
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
      title="Longest Palindrome"
      slug="longest-palindrome"
      approaches={approaches}
      presets={LongestPalindromePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Anagram (valid-anagram)
// ==========================================

const ValidAnagramTemplates = {
  "python": {
    "language": "python",
    "code": "def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n\n    count = [0] * 26\n\n    # Increment for s, decrement for t\n    for i in range(len(s)):\n        count[ord(s[i]) - ord('a')] += 1\n        count[ord(t[i]) - ord('a')] -= 1\n\n    # Check if all counts are zero\n    for c in count:\n        if c != 0:\n            return False\n\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        5
      ],
      "count_pair": [
        9,
        10
      ],
      "scan_done": [
        8
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n\n    int[] count = new int[26];\n\n    // Increment for s, decrement for t\n    for (int i = 0; i < s.length(); i++) {\n        count[s.charAt(i) - 'a']++;\n        count[t.charAt(i) - 'a']--;\n    }\n\n    // Check if all counts are zero\n    for (int c : count) {\n        if (c != 0) return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        4
      ],
      "count_pair": [
        8,
        9
      ],
      "scan_done": [
        7
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n\n    vector<int> count(26, 0);\n\n    // Increment for s, decrement for t\n    for (int i = 0; i < s.size(); i++) {\n        count[s[i] - 'a']++;\n        count[t[i] - 'a']--;\n    }\n\n    // Check if all counts are zero\n    for (int c : count) {\n        if (c != 0) return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        4
      ],
      "count_pair": [
        8,
        9
      ],
      "scan_done": [
        7
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsAnagram(string s, string t) {\n    if (s.Length != t.Length) return false;\n\n    int[] count = new int[26];\n\n    // Increment for s, decrement for t\n    for (int i = 0; i < s.Length; i++) {\n        count[s[i] - 'a']++;\n        count[t[i] - 'a']--;\n    }\n\n    // Check if all counts are zero\n    foreach (int c in count) {\n        if (c != 0) return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        4
      ],
      "count_pair": [
        8,
        9
      ],
      "scan_done": [
        7
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isAnagram(s string, t string) bool {\n    if len(s) != len(t) {\n        return false\n    }\n\n    count := make([]int, 26)\n\n    // Increment for s, decrement for t\n    for i := 0; i < len(s); i++ {\n        count[s[i]-'a']++\n        count[t[i]-'a']--\n    }\n\n    // Check if all counts are zero\n    for _, c := range count {\n        if c != 0 {\n            return false\n        }\n    }\n\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        6
      ],
      "count_pair": [
        10,
        11
      ],
      "scan_done": [
        9
      ],
      "check_zero": [
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var isAnagram = function(s, t) {\n    if (s.length !== t.length) return false;\n\n    const count = new Array(26).fill(0);\n\n    // Increment for s, decrement for t\n    for (let i = 0; i < s.length; i++) {\n        count[s.charCodeAt(i) - 97]++;\n        count[t.charCodeAt(i) - 97]--;\n    }\n\n    // Check if all counts are zero\n    for (const c of count) {\n        if (c !== 0) return false;\n    }\n\n    return true;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        4
      ],
      "count_pair": [
        8,
        9
      ],
      "scan_done": [
        7
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isAnagram(s: string, t: string): boolean {\n    if (s.length !== t.length) return false;\n\n    const count = new Array<number>(26).fill(0);\n\n    // Increment for s, decrement for t\n    for (let i = 0; i < s.length; i++) {\n        count[s.charCodeAt(i) - 97]++;\n        count[t.charCodeAt(i) - 97]--;\n    }\n\n    // Check if all counts are zero\n    for (const c of count) {\n        if (c !== 0) return false;\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_length": [
        2
      ],
      "init_count": [
        4
      ],
      "count_pair": [
        8,
        9
      ],
      "scan_done": [
        7
      ],
      "check_zero": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_length": [
        2
      ],
      "is_zero": [
        14
      ]
    }
  }
};

const ValidAnagramPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid 1",
    "value": {
      "s": "anagram",
      "t": "nagaram"
    }
  },
  {
    "id": "ex2",
    "label": "Invalid",
    "value": {
      "s": "rat",
      "t": "car"
    }
  },
  {
    "id": "ex3",
    "label": "Valid 2",
    "value": {
      "s": "listen",
      "t": "silent"
    }
  }
];

function generateValidAnagramSteps(t: any): any[] {
  let e=String(t?.s??""),n=String(t?.t??""),a=[],i={},o={},s={},l={},c=(t,e,n)=>{let r={};for(let a=0;a<e.length;a++){let i=n[a];r[`${t}_${a}`]={type:"arrayElement",value:e[a],position:a,...i&&{state:i}}}return r},h=new StepRecorder({s:e,t:n},{...c("s",e,s),...c("t",n,l),meta_counts:{type:"metadata",value:[]},verdict:{type:"metadata",value:null}}),u=(t,r)=>{for(let[t,r]of Object.entries({...c("s",e,s),...c("t",n,l)}))h.update_visual(t,r);h.update_visual("meta_counts",{type:"metadata",value:a.map(t=>({ch:t,count:i[t],state:o[t]??""}))}),t>=0?h.update_visual("ptr_s",{type:"pointer",position:t,label:"i"}):h.delete_visual("ptr_s"),r>=0?h.update_visual("ptr_t",{type:"pointer",position:r,label:"i"}):h.delete_visual("ptr_t")};h.record("-",`Start: check whether "${n}" is an anagram of "${e}"`);let d=e.length===n.length;if(h.add_conditional("check_length",!d),h.record("check_length",d?`Both strings have ${e.length} characters, so they could still be anagrams`:`s has ${e.length} characters and t has ${n.length}, so they cannot be anagrams`),!d)return h.add_new_variable("result",!1),h.update_visual("verdict",{type:"metadata",value:!1}),h.record("length_differs","Return false straight away"),h.getSteps();for(let t=0;t<e.length;t++){let n=e[t];for(let e of(void 0===i[n]&&(i[n]=0,a.push(n)),i[n]++,s[t]="complete",a))o[e]="";o[n]="active",h.update_variable("counts",a.map(t=>`${t}:${i[t]}`).join(" ")),u(t,-1),h.record("count_s",`'${n}' from s: its count is now ${i[n]}`)}for(let t of a)o[t]="";for(let t=0;t<n.length;t++){let e=n[t];for(let t of(void 0===i[e]&&(i[e]=0,a.push(e)),i[e]--,a))o[t]="";o[e]="active",l[t]="complete",h.update_variable("counts",a.map(t=>`${t}:${i[t]}`).join(" ")),u(-1,t),h.record("count_t",`'${e}' from t: its count drops to ${i[e]}`)}for(let t of a)o[t]="";for(let t of(u(-1,-1),h.record("scan_done","Both strings are folded into the same map"),a)){let r=0===i[t];for(let t of a)o[t]="spent"===o[t]?"spent":"";if(o[t]=r?"spent":"over",h.add_conditional("is_zero",r),u(-1,-1),h.record("check_zero",r?`'${t}' nets out to 0, so both strings used it equally often`:`'${t}' nets out to ${i[t]}, so the strings differ on it`),!r)return h.add_new_variable("result",!1),h.update_visual("verdict",{type:"metadata",value:!1}),u(-1,-1),h.record("complete",`Return false: "${n}" is not an anagram of "${e}"`),h.getSteps()}for(let t of(h.add_new_variable("result",!0),h.update_visual("verdict",{type:"metadata",value:!0}),a))o[t]="spent";return u(-1,-1),h.record("complete",`Every count fell to zero, so "${n}" is an anagram of "${e}"`),h.getSteps()
}

export function ValidAnagramProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidAnagramTemplates,
      generateSteps: (t: any) => {
        const recorded = generateValidAnagramSteps(t) as any[];
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
      title="Valid Anagram"
      slug="valid-anagram"
      approaches={approaches}
      presets={ValidAnagramPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Word Pattern (word-pattern)
// ==========================================

const WordPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def wordPattern(pattern, s):\n    words = s.split()\n    if len(pattern) != len(words):\n        return False\n    char_to_word = {}\n    word_to_char = {}\n    for c, word in zip(pattern, words):\n        # Check char -> word mapping\n        if c in char_to_word:\n            if char_to_word[c] != word:\n                return False\n        else:\n            char_to_word[c] = word\n        # Check word -> char mapping\n        if word in word_to_char:\n            if word_to_char[word] != c:\n                return False\n        else:\n            word_to_char[word] = c\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        4
      ],
      "loop": [
        7
      ],
      "check_char": [
        9,
        10
      ],
      "mismatch_char": [
        11
      ],
      "check_word": [
        15,
        16
      ],
      "mismatch_word": [
        17
      ],
      "bind": [
        13,
        19
      ],
      "complete": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean wordPattern(String pattern, String s) {\n    String[] words = s.split(\" \");\n    if (pattern.length() != words.length) return false;\n    Map<Character, String> charToWord = new HashMap<>();\n    Map<String, Character> wordToChar = new HashMap<>();\n    for (int i = 0; i < pattern.length(); i++) {\n        char c = pattern.charAt(i);\n        String word = words[i];\n        // Check char -> word mapping\n        if (charToWord.containsKey(c)) {\n            if (!charToWord.get(c).equals(word)) return false;\n        } else {\n            charToWord.put(c, word);\n        }\n        // Check word -> char mapping\n        if (wordToChar.containsKey(word)) {\n            if (wordToChar.get(word) != c) return false;\n        } else {\n            wordToChar.put(word, c);\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        6,
        7,
        8
      ],
      "check_char": [
        10,
        11
      ],
      "mismatch_char": [
        11
      ],
      "check_word": [
        16,
        17
      ],
      "mismatch_word": [
        17
      ],
      "bind": [
        13,
        19
      ],
      "complete": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool wordPattern(string pattern, string s) {\n    vector<string> words;\n    stringstream ss(s);\n    string word;\n    while (ss >> word) {\n        words.push_back(word);\n    }\n    if (pattern.size() != words.size()) return false;\n    unordered_map<char, string> charToWord;\n    unordered_map<string, char> wordToChar;\n    for (int i = 0; i < pattern.size(); i++) {\n        char c = pattern[i];\n        string& w = words[i];\n        // Check char -> word mapping\n        if (charToWord.count(c)) {\n            if (charToWord[c] != w) return false;\n        } else {\n            charToWord[c] = w;\n        }\n        // Check word -> char mapping\n        if (wordToChar.count(w)) {\n            if (wordToChar[w] != c) return false;\n        } else {\n            wordToChar[w] = c;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "length_check": [
        8
      ],
      "mismatch_len": [
        8
      ],
      "loop": [
        11,
        12,
        13
      ],
      "check_char": [
        15,
        16
      ],
      "mismatch_char": [
        16
      ],
      "check_word": [
        21,
        22
      ],
      "mismatch_word": [
        22
      ],
      "bind": [
        18,
        24
      ],
      "complete": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool WordPattern(string pattern, string s) {\n    string[] words = s.Split(' ');\n    if (pattern.Length != words.Length) return false;\n    Dictionary<char, string> charToWord = new Dictionary<char, string>();\n    Dictionary<string, char> wordToChar = new Dictionary<string, char>();\n    for (int i = 0; i < pattern.Length; i++) {\n        char c = pattern[i];\n        string word = words[i];\n        // Check char -> word mapping\n        if (charToWord.ContainsKey(c)) {\n            if (charToWord[c] != word) return false;\n        } else {\n            charToWord[c] = word;\n        }\n        // Check word -> char mapping\n        if (wordToChar.ContainsKey(word)) {\n            if (wordToChar[word] != c) return false;\n        } else {\n            wordToChar[word] = c;\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        6,
        7,
        8
      ],
      "check_char": [
        10,
        11
      ],
      "mismatch_char": [
        11
      ],
      "check_word": [
        16,
        17
      ],
      "mismatch_word": [
        17
      ],
      "bind": [
        13,
        19
      ],
      "complete": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func wordPattern(pattern string, s string) bool {\n    words := strings.Split(s, \" \")\n    if len(pattern) != len(words) {\n        return false\n    }\n    charToWord := make(map[byte]string)\n    wordToChar := make(map[string]byte)\n    for i := 0; i < len(pattern); i++ {\n        c := pattern[i]\n        word := words[i]\n        // Check char -> word mapping\n        if mapped, exists := charToWord[c]; exists {\n            if mapped != word {\n                return false\n            }\n        } else {\n            charToWord[c] = word\n        }\n        // Check word -> char mapping\n        if mapped, exists := wordToChar[word]; exists {\n            if mapped != c {\n                return false\n            }\n        } else {\n            wordToChar[word] = c\n        }\n    }\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        4
      ],
      "loop": [
        8,
        9,
        10
      ],
      "check_char": [
        12,
        13
      ],
      "mismatch_char": [
        14
      ],
      "check_word": [
        20,
        21
      ],
      "mismatch_word": [
        22
      ],
      "bind": [
        17,
        25
      ],
      "complete": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function wordPattern(pattern, s) {\n    const words = s.split(\" \");\n    if (pattern.length !== words.length) return false;\n    const charToWord = new Map();\n    const wordToChar = new Map();\n    for (let i = 0; i < pattern.length; i++) {\n        const c = pattern[i];\n        const word = words[i];\n        // Check char -> word mapping\n        if (charToWord.has(c)) {\n            if (charToWord.get(c) !== word) return false;\n        } else {\n            charToWord.set(c, word);\n        }\n        // Check word -> char mapping\n        if (wordToChar.has(word)) {\n            if (wordToChar.get(word) !== c) return false;\n        } else {\n            wordToChar.set(word, c);\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        6,
        7,
        8
      ],
      "check_char": [
        10,
        11
      ],
      "mismatch_char": [
        11
      ],
      "check_word": [
        16,
        17
      ],
      "mismatch_word": [
        17
      ],
      "bind": [
        13,
        19
      ],
      "complete": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function wordPattern(pattern: string, s: string): boolean {\n    const words = s.split(\" \");\n    if (pattern.length !== words.length) return false;\n    const charToWord = new Map<string, string>();\n    const wordToChar = new Map<string, string>();\n    for (let i = 0; i < pattern.length; i++) {\n        const c = pattern[i];\n        const word = words[i];\n        // Check char -> word mapping\n        if (charToWord.has(c)) {\n            if (charToWord.get(c) !== word) return false;\n        } else {\n            charToWord.set(c, word);\n        }\n        // Check word -> char mapping\n        if (wordToChar.has(word)) {\n            if (wordToChar.get(word) !== c) return false;\n        } else {\n            wordToChar.set(word, c);\n        }\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "split": [
        2
      ],
      "length_check": [
        3
      ],
      "mismatch_len": [
        3
      ],
      "loop": [
        6,
        7,
        8
      ],
      "check_char": [
        10,
        11
      ],
      "mismatch_char": [
        11
      ],
      "check_word": [
        16,
        17
      ],
      "mismatch_word": [
        17
      ],
      "bind": [
        13,
        19
      ],
      "complete": [
        22
      ]
    }
  }
};

const WordPatternPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Match",
    "value": {
      "pattern": "abba",
      "s": "dog cat cat dog"
    }
  },
  {
    "id": "ex2",
    "label": "Letter clash",
    "value": {
      "pattern": "abba",
      "s": "dog cat cat fish"
    }
  },
  {
    "id": "ex3",
    "label": "One letter, many words",
    "value": {
      "pattern": "aaaa",
      "s": "dog cat cat dog"
    }
  },
  {
    "id": "ex4",
    "label": "One word, many letters",
    "value": {
      "pattern": "abba",
      "s": "dog dog dog dog"
    }
  }
];

function generateWordPatternSteps(t: any): any[] {
  let{pattern:e,s:r}=t,i=r.length>0?r.split(" "):[],a={};for(let t=0;t<e.length;t++)a[`pat_${t}`]={type:"arrayElement",value:e[t],position:t,state:"standard"};for(let t=0;t<i.length;t++)a[`word_${t}`]={type:"arrayElement",value:i[t],position:t,state:"standard"};a.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let l=new StepRecorder({pattern:e,words:i,patLen:e.length,wordCount:i.length,i:-1,c:null,w:null,bindings:[],phase:null,conflict:null,conflictWith:null,newBinding:!1,result:null},a),s=t=>{Object.entries(t).forEach(([t,e])=>l.update_variable(t,e))},o=(t,e)=>{l.update_visual("ptr_i",{type:"pointer",position:t,state:e,label:"i"})};if(l.record("-","Each letter must map to exactly one word, and each word back to one letter"),l.record("split",`Split s into ${i.length} word${1===i.length?"":"s"}`),e.length!==i.length)return s({conflict:"length",result:!1}),l.record("length_check",`Lengths differ: ${e.length} ≠ ${i.length}`),l.record("mismatch_len","Return false"),l.getSteps();l.record("length_check",`Lengths match: ${e.length} = ${i.length}`);let c=new Map,d=new Map,h=[],p=()=>h.map(t=>({...t}));for(let t=0;t<e.length;t++){let r=e[t],n=i[t];o(t,"active"),s({i:t,c:r,w:n,phase:"loop",conflict:null,conflictWith:null}),l.record("loop",`Column ${t}: '${r}' ↔ "${n}"`);let a=c.has(r),f=c.get(r);if(a&&f!==n)return s({phase:"check_char",conflict:"char",conflictWith:f,result:!1}),l.record("check_char",`'${r}' is already bound to "${f}", not "${n}"`),l.record("mismatch_char","Return false"),l.getSteps();s({phase:"check_char",conflict:null}),l.record("check_char",a?`'${r}' already maps to "${n}"`:`'${r}' is a new letter`);let u=d.has(n),g=d.get(n);if(u&&g!==r)return s({phase:"check_word",conflict:"word",conflictWith:g,result:!1}),l.record("check_word",`"${n}" is already bound to '${g}', not '${r}'`),l.record("mismatch_word","Return false"),l.getSteps();s({phase:"check_word",conflict:null}),l.record("check_word",u?`"${n}" already maps to '${r}'`:`"${n}" is a new word`);let m=!a;m&&(c.set(r,n),d.set(n,r),h.push({char:r,word:n})),s({phase:"bind",bindings:p(),newBinding:m}),l.record("bind",m?`Bind '${r}' ⇄ "${n}"`:`'${r}' ⇄ "${n}" holds`)}return o(Math.max(0,e.length-1),"idle"),s({i:e.length,result:!0,phase:"complete"}),l.record("complete","Every letter and word agree: return true"),l.getSteps()
}

export function WordPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: WordPatternTemplates,
      generateSteps: (t: any) => {
        const recorded = generateWordPatternSteps(t) as any[];
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
      title="Word Pattern"
      slug="word-pattern"
      approaches={approaches}
      presets={WordPatternPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design HashMap (design-hashmap)
// ==========================================

const DesignHashmapTemplates = {
  "python": {
    "language": "python",
    "code": "class MyHashMap:\n    def __init__(self):\n        # The write-up uses 769; this demo shrinks it so the keys collide\n        self.size = 5\n        self.buckets = [None] * self.size\n\n    def _hash(self, key):\n        return key % self.size\n\n    def put(self, key, value):\n        bucket = self._hash(key)\n        curr = self.buckets[bucket]\n        while curr:\n            if curr.key == key:\n                curr.value = value\n                return\n            curr = curr.next\n        self.buckets[bucket] = ListNode(key, value, self.buckets[bucket])\n\n    def get(self, key):\n        bucket = self._hash(key)\n        curr = self.buckets[bucket]\n        while curr:\n            if curr.key == key:\n                return curr.value\n            curr = curr.next\n        return -1\n\n    def remove(self, key):\n        bucket = self._hash(key)\n        if self.buckets[bucket] and self.buckets[bucket].key == key:\n            self.buckets[bucket] = self.buckets[bucket].next\n            return\n        curr = self.buckets[bucket]\n        while curr and curr.next:\n            if curr.next.key == key:\n                curr.next = curr.next.next\n                return\n            curr = curr.next",
    "lineMap": {
      "-": [
        4
      ],
      "hash": [
        11
      ],
      "walk": [
        13
      ],
      "found_key": [
        14
      ],
      "update": [
        15
      ],
      "append": [
        18
      ],
      "get_result": [
        25
      ],
      "not_found": [
        27
      ],
      "remove_unlink": [
        37
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyHashMap {\n    // The write-up uses 769; this demo shrinks it so the keys collide\n    private static final int SIZE = 5;\n    private ListNode[] buckets;\n\n    private static class ListNode {\n        int key, value;\n        ListNode next;\n        ListNode(int key, int value, ListNode next) {\n            this.key = key;\n            this.value = value;\n            this.next = next;\n        }\n    }\n\n    public MyHashMap() {\n        buckets = new ListNode[SIZE];\n    }\n\n    private int hash(int key) {\n        return key % SIZE;\n    }\n\n    public void put(int key, int value) {\n        int bucket = hash(key);\n        ListNode curr = buckets[bucket];\n        while (curr != null) {\n            if (curr.key == key) {\n                curr.value = value;\n                return;\n            }\n            curr = curr.next;\n        }\n        buckets[bucket] = new ListNode(key, value, buckets[bucket]);\n    }\n\n    public int get(int key) {\n        int bucket = hash(key);\n        ListNode curr = buckets[bucket];\n        while (curr != null) {\n            if (curr.key == key) {\n                return curr.value;\n            }\n            curr = curr.next;\n        }\n        return -1;\n    }\n\n    public void remove(int key) {\n        int bucket = hash(key);\n        if (buckets[bucket] != null && buckets[bucket].key == key) {\n            buckets[bucket] = buckets[bucket].next;\n            return;\n        }\n        ListNode curr = buckets[bucket];\n        while (curr != null && curr.next != null) {\n            if (curr.next.key == key) {\n                curr.next = curr.next.next;\n                return;\n            }\n            curr = curr.next;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        3
      ],
      "hash": [
        25
      ],
      "walk": [
        27
      ],
      "found_key": [
        28
      ],
      "update": [
        29
      ],
      "append": [
        34
      ],
      "get_result": [
        42
      ],
      "not_found": [
        46
      ],
      "remove_unlink": [
        58
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyHashMap {\n    // The write-up uses 769; this demo shrinks it so the keys collide\n    static const int SIZE = 5;\n    struct ListNode {\n        int key, value;\n        ListNode* next;\n        ListNode(int k, int v, ListNode* n) : key(k), value(v), next(n) {}\n    };\n    ListNode* buckets[SIZE];\npublic:\n    MyHashMap() {\n        fill(buckets, buckets + SIZE, nullptr);\n    }\n\n    int hash(int key) {\n        return key % SIZE;\n    }\n\n    void put(int key, int value) {\n        int bucket = hash(key);\n        ListNode* curr = buckets[bucket];\n        while (curr) {\n            if (curr->key == key) {\n                curr->value = value;\n                return;\n            }\n            curr = curr->next;\n        }\n        buckets[bucket] = new ListNode(key, value, buckets[bucket]);\n    }\n\n    int get(int key) {\n        int bucket = hash(key);\n        ListNode* curr = buckets[bucket];\n        while (curr) {\n            if (curr->key == key) {\n                return curr->value;\n            }\n            curr = curr->next;\n        }\n        return -1;\n    }\n\n    void remove(int key) {\n        int bucket = hash(key);\n        if (buckets[bucket] && buckets[bucket]->key == key) {\n            buckets[bucket] = buckets[bucket]->next;\n            return;\n        }\n        ListNode* curr = buckets[bucket];\n        while (curr && curr->next) {\n            if (curr->next->key == key) {\n                curr->next = curr->next->next;\n                return;\n            }\n            curr = curr->next;\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "hash": [
        20
      ],
      "walk": [
        22
      ],
      "found_key": [
        23
      ],
      "update": [
        24
      ],
      "append": [
        29
      ],
      "get_result": [
        37
      ],
      "not_found": [
        41
      ],
      "remove_unlink": [
        53
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyHashMap {\n    // The write-up uses 769; this demo shrinks it so the keys collide\n    private const int SIZE = 5;\n    private ListNode[] buckets;\n\n    private class ListNode {\n        public int Key, Value;\n        public ListNode Next;\n        public ListNode(int key, int value, ListNode next) {\n            Key = key; Value = value; Next = next;\n        }\n    }\n\n    public MyHashMap() {\n        buckets = new ListNode[SIZE];\n    }\n\n    private int Hash(int key) {\n        return key % SIZE;\n    }\n\n    public void Put(int key, int value) {\n        int bucket = Hash(key);\n        ListNode curr = buckets[bucket];\n        while (curr != null) {\n            if (curr.Key == key) {\n                curr.Value = value;\n                return;\n            }\n            curr = curr.Next;\n        }\n        buckets[bucket] = new ListNode(key, value, buckets[bucket]);\n    }\n\n    public int Get(int key) {\n        int bucket = Hash(key);\n        ListNode curr = buckets[bucket];\n        while (curr != null) {\n            if (curr.Key == key) {\n                return curr.Value;\n            }\n            curr = curr.Next;\n        }\n        return -1;\n    }\n\n    public void Remove(int key) {\n        int bucket = Hash(key);\n        if (buckets[bucket] != null && buckets[bucket].Key == key) {\n            buckets[bucket] = buckets[bucket].Next;\n            return;\n        }\n        ListNode curr = buckets[bucket];\n        while (curr != null && curr.Next != null) {\n            if (curr.Next.Key == key) {\n                curr.Next = curr.Next.Next;\n                return;\n            }\n            curr = curr.Next;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        3
      ],
      "hash": [
        23
      ],
      "walk": [
        25
      ],
      "found_key": [
        26
      ],
      "update": [
        27
      ],
      "append": [
        32
      ],
      "get_result": [
        40
      ],
      "not_found": [
        44
      ],
      "remove_unlink": [
        56
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type ListNode struct {\n    key, value int\n    next       *ListNode\n}\n\ntype MyHashMap struct {\n    // The write-up uses 769; this demo shrinks it so the keys collide\n    buckets [5]*ListNode\n}\n\nfunc Constructor() MyHashMap {\n    return MyHashMap{}\n}\n\nfunc (m *MyHashMap) hash(key int) int {\n    return key % 5\n}\n\nfunc (m *MyHashMap) Put(key int, value int) {\n    bucket := m.hash(key)\n    curr := m.buckets[bucket]\n    for curr != nil {\n        if curr.key == key {\n            curr.value = value\n            return\n        }\n        curr = curr.next\n    }\n    m.buckets[bucket] = &ListNode{key, value, m.buckets[bucket]}\n}\n\nfunc (m *MyHashMap) Get(key int) int {\n    bucket := m.hash(key)\n    curr := m.buckets[bucket]\n    for curr != nil {\n        if curr.key == key {\n            return curr.value\n        }\n        curr = curr.next\n    }\n    return -1\n}\n\nfunc (m *MyHashMap) Remove(key int) {\n    bucket := m.hash(key)\n    if m.buckets[bucket] != nil && m.buckets[bucket].key == key {\n        m.buckets[bucket] = m.buckets[bucket].next\n        return\n    }\n    curr := m.buckets[bucket]\n    for curr != nil && curr.next != nil {\n        if curr.next.key == key {\n            curr.next = curr.next.next\n            return\n        }\n        curr = curr.next\n    }\n}",
    "lineMap": {
      "-": [
        8
      ],
      "hash": [
        20
      ],
      "walk": [
        22
      ],
      "found_key": [
        23
      ],
      "update": [
        24
      ],
      "append": [
        29
      ],
      "get_result": [
        37
      ],
      "not_found": [
        41
      ],
      "remove_unlink": [
        53
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class MyHashMap {\n    constructor() {\n        // The write-up uses 769; this demo shrinks it so the keys collide\n        this.size = 5;\n        this.buckets = new Array(this.size).fill(null);\n    }\n\n    _hash(key) {\n        return key % this.size;\n    }\n\n    put(key, value) {\n        const bucket = this._hash(key);\n        let curr = this.buckets[bucket];\n        while (curr !== null) {\n            if (curr.key === key) {\n                curr.value = value;\n                return;\n            }\n            curr = curr.next;\n        }\n        this.buckets[bucket] = { key: key, value: value, next: this.buckets[bucket] };\n    }\n\n    get(key) {\n        const bucket = this._hash(key);\n        let curr = this.buckets[bucket];\n        while (curr !== null) {\n            if (curr.key === key) {\n                return curr.value;\n            }\n            curr = curr.next;\n        }\n        return -1;\n    }\n\n    remove(key) {\n        const bucket = this._hash(key);\n        if (this.buckets[bucket] !== null && this.buckets[bucket].key === key) {\n            this.buckets[bucket] = this.buckets[bucket].next;\n            return;\n        }\n        let curr = this.buckets[bucket];\n        while (curr !== null && curr.next !== null) {\n            if (curr.next.key === key) {\n                curr.next = curr.next.next;\n                return;\n            }\n            curr = curr.next;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        4
      ],
      "hash": [
        13
      ],
      "walk": [
        15
      ],
      "found_key": [
        16
      ],
      "update": [
        17
      ],
      "append": [
        22
      ],
      "get_result": [
        30
      ],
      "not_found": [
        34
      ],
      "remove_unlink": [
        46
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class ListNode {\n    key: number;\n    value: number;\n    next: ListNode | null;\n    constructor(key: number, value: number, next: ListNode | null = null) {\n        this.key = key;\n        this.value = value;\n        this.next = next;\n    }\n}\n\nclass MyHashMap {\n    // The write-up uses 769; this demo shrinks it so the keys collide\n    private readonly SIZE = 5;\n    private buckets: (ListNode | null)[];\n\n    constructor() {\n        this.buckets = new Array(this.SIZE).fill(null);\n    }\n\n    private hash(key: number): number {\n        return key % this.SIZE;\n    }\n\n    put(key: number, value: number): void {\n        const bucket = this.hash(key);\n        let curr = this.buckets[bucket];\n        while (curr !== null) {\n            if (curr.key === key) {\n                curr.value = value;\n                return;\n            }\n            curr = curr.next;\n        }\n        this.buckets[bucket] = new ListNode(key, value, this.buckets[bucket]);\n    }\n\n    get(key: number): number {\n        const bucket = this.hash(key);\n        let curr = this.buckets[bucket];\n        while (curr !== null) {\n            if (curr.key === key) {\n                return curr.value;\n            }\n            curr = curr.next;\n        }\n        return -1;\n    }\n\n    remove(key: number): void {\n        const bucket = this.hash(key);\n        if (this.buckets[bucket] !== null && this.buckets[bucket]!.key === key) {\n            this.buckets[bucket] = this.buckets[bucket]!.next;\n            return;\n        }\n        let curr = this.buckets[bucket];\n        while (curr !== null && curr.next !== null) {\n            if (curr.next.key === key) {\n                curr.next = curr.next.next;\n                return;\n            }\n            curr = curr.next;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        14
      ],
      "hash": [
        26
      ],
      "walk": [
        28
      ],
      "found_key": [
        29
      ],
      "update": [
        30
      ],
      "append": [
        35
      ],
      "get_result": [
        43
      ],
      "not_found": [
        47
      ],
      "remove_unlink": [
        59
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "check_key": [
        29
      ]
    }
  }
};

const DesignHashmapPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Put, Get, Remove",
    "value": {
      "operations": [
        [
          "put",
          1,
          10
        ],
        [
          "put",
          2,
          20
        ],
        [
          "get",
          1
        ],
        [
          "put",
          12,
          30
        ],
        [
          "get",
          12
        ],
        [
          "remove",
          1
        ],
        [
          "get",
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Collision + Tombstone Reuse",
    "value": {
      "operations": [
        [
          "put",
          5,
          50
        ],
        [
          "put",
          16,
          60
        ],
        [
          "put",
          27,
          70
        ],
        [
          "get",
          27
        ],
        [
          "remove",
          16
        ],
        [
          "put",
          38,
          80
        ],
        [
          "get",
          38
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Update + Re-insert",
    "value": {
      "operations": [
        [
          "put",
          3,
          30
        ],
        [
          "put",
          3,
          99
        ],
        [
          "get",
          3
        ],
        [
          "remove",
          3
        ],
        [
          "get",
          3
        ],
        [
          "put",
          3,
          55
        ],
        [
          "get",
          3
        ]
      ]
    }
  }
];

function generateDesignHashmapSteps(e: any): any[] {
  let{operations:t}=e,n=Array.from({length:5},()=>[]),r=e=>e%5,s=t.map(e=>"put"===e[0]?`put(${e[1]},${e[2]})`:`${e[0]}(${e[1]})`),l=t.map(()=>null),a=new StepRecorder({ops:s,opResults:l,opIdx:-1,phase:null,key:null,val:null,h:null,curr:-1,matched:null,result:null,action:null,removed:null,buckets:n},{anchor:{type:"metadata",value:5}}),u=e=>{Object.entries(e).forEach(([e,t])=>a.update_variable(e,t))},o=()=>u({buckets:n});a.record("-","Separate chaining: 5 buckets, each holding a chain of key-value pairs");for(let e=0;e<t.length;e++){let i=t[e],d=i[0],c=i[1],h=s[e],k=r(c),p=n[k];if(u({opIdx:e,phase:d,key:c,val:"put"===d?i[2]:null,h:k,curr:-1,matched:null,result:null,action:null,removed:null}),a.record("-",`${h}`),a.record("hash",`hash(${c}) = ${c} % 5 = ${k}: use bucket ${k}`),"put"===d){let e=i[2],t=!1;for(let n=0;n<p.length;n++){u({curr:n}),a.record("walk",`Walk bucket ${k}: compare node ${n}`);let i=p[n].k===c;if(a.add_conditional("check_key",i),i){p[n].v=e,o(),u({matched:!0,action:"update"}),a.record("update",`Key ${c} already in the chain: overwrite its value with ${e}`),t=!0;break}u({matched:!1}),a.record("found_key",`Node holds key ${p[n].k}, not ${c}: keep walking`)}t||(p.unshift({k:c,v:e}),o(),u({curr:0,action:"append"}),a.record("append",`Key ${c} not in bucket ${k}: insert ${c}:${e} at the head of the chain`))}else if("get"===d){let t=!1;for(let n=0;n<p.length;n++){u({curr:n}),a.record("walk",`Walk bucket ${k}: compare node ${n}`);let i=p[n].k===c;if(a.add_conditional("check_key",i),i){u({matched:!0,result:p[n].v}),a.record("found_key",`Key ${c} found in bucket ${k}`),l[e]=p[n].v,u({opResults:l}),a.record("get_result",`${h} returns ${p[n].v}`),t=!0;break}u({matched:!1}),a.record("found_key",`Node holds key ${p[n].k}, not ${c}: keep walking`)}t||(u({matched:!1,result:-1}),a.record("not_found",`Chain in bucket ${k} exhausted: key ${c} is not in the map`),l[e]=-1,u({opResults:l}),a.record("get_result",`${h} returns -1`))}else if("remove"===d){let e=!1;for(let t=0;t<p.length;t++){u({curr:t}),a.record("walk",`Walk bucket ${k}: compare node ${t}`);let n=p[t].k===c;if(a.add_conditional("check_key",n),n){let n={k:p[t].k,v:p[t].v,at:t};p.splice(t,1),o(),u({matched:!0,action:"unlink",removed:n}),a.record("remove_unlink",`Key ${c} found: unlink its node from bucket ${k}`),e=!0;break}u({matched:!1}),a.record("found_key",`Node holds key ${p[t].k}, not ${c}: keep walking`)}e||(u({matched:!1}),a.record("not_found",`Chain in bucket ${k} exhausted: key ${c} is not in the map`))}u({curr:-1}),a.record("-",`${h} done`)}return u({opIdx:-1,curr:-1,phase:null}),a.record("complete","All operations complete"),a.getSteps()
}

export function DesignHashmapProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignHashmapTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignHashmapSteps(e) as any[];
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
      title="Design HashMap"
      slug="design-hashmap"
      approaches={approaches}
      presets={DesignHashmapPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Intersection of Two Arrays II (intersection-of-two-arrays-ii)
// ==========================================

const IntersectionOfTwoArraysIiTemplates = {
  "python": {
    "language": "python",
    "code": "def intersect(nums1, nums2):\n    nums1.sort()\n    nums2.sort()\n    i, j = 0, 0\n    result = []\n    while i < len(nums1) and j < len(nums2):\n        if nums1[i] == nums2[j]:\n            result.append(nums1[i])\n            i += 1\n            j += 1\n        elif nums1[i] < nums2[j]:\n            i += 1\n        else:\n            j += 1\n    return result",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] intersect(int[] nums1, int[] nums2) {\n    Arrays.sort(nums1);\n    Arrays.sort(nums2);\n    int i = 0, j = 0;\n    List<Integer> result = new ArrayList<>();\n    while (i < nums1.length && j < nums2.length) {\n        if (nums1[i] == nums2[j]) {\n            result.add(nums1[i]);\n            i++;\n            j++;\n        } else if (nums1[i] < nums2[j]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    int[] arr = new int[result.size()];\n    for (int k = 0; k < result.size(); k++) {\n        arr[k] = result.get(k);\n    }\n    return arr;\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {\n    sort(nums1.begin(), nums1.end());\n    sort(nums2.begin(), nums2.end());\n    int i = 0, j = 0;\n    vector<int> result;\n    while (i < nums1.size() && j < nums2.size()) {\n        if (nums1[i] == nums2[j]) {\n            result.push_back(nums1[i]);\n            i++;\n            j++;\n        } else if (nums1[i] < nums2[j]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result;\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] Intersect(int[] nums1, int[] nums2) {\n    Array.Sort(nums1);\n    Array.Sort(nums2);\n    int i = 0, j = 0;\n    List<int> result = new List<int>();\n    while (i < nums1.Length && j < nums2.Length) {\n        if (nums1[i] == nums2[j]) {\n            result.Add(nums1[i]);\n            i++;\n            j++;\n        } else if (nums1[i] < nums2[j]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result.ToArray();\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func intersect(nums1 []int, nums2 []int) []int {\n    sort.Ints(nums1)\n    sort.Ints(nums2)\n    i, j := 0, 0\n    result := []int{}\n    for i < len(nums1) && j < len(nums2) {\n        if nums1[i] == nums2[j] {\n            result = append(result, nums1[i])\n            i++\n            j++\n        } else if nums1[i] < nums2[j] {\n            i++\n        } else {\n            j++\n        }\n    }\n    return result\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function intersect(nums1, nums2) {\n    nums1.sort((a, b) => a - b);\n    nums2.sort((a, b) => a - b);\n    let i = 0, j = 0;\n    const result = [];\n    while (i < nums1.length && j < nums2.length) {\n        if (nums1[i] === nums2[j]) {\n            result.push(nums1[i]);\n            i++;\n            j++;\n        } else if (nums1[i] < nums2[j]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result;\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function intersect(nums1: number[], nums2: number[]): number[] {\n    nums1.sort((a, b) => a - b);\n    nums2.sort((a, b) => a - b);\n    let i = 0, j = 0;\n    const result: number[] = [];\n    while (i < nums1.length && j < nums2.length) {\n        if (nums1[i] === nums2[j]) {\n            result.push(nums1[i]);\n            i++;\n            j++;\n        } else if (nums1[i] < nums2[j]) {\n            i++;\n        } else {\n            j++;\n        }\n    }\n    return result;\n}",
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
      "loop": [
        6
      ],
      "compare": [
        7
      ],
      "equal_found": [
        8,
        9,
        10
      ],
      "advance_i": [
        12
      ],
      "advance_j": [
        14
      ],
      "loop_end": [
        6
      ],
      "complete": [
        17
      ]
    }
  }
};

const IntersectionOfTwoArraysIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums1": [
        1,
        2,
        2,
        1
      ],
      "nums2": [
        2,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Matches",
    "value": {
      "nums1": [
        4,
        9,
        5
      ],
      "nums2": [
        9,
        4,
        9,
        8,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No Intersection",
    "value": {
      "nums1": [
        1,
        2,
        3
      ],
      "nums2": [
        4,
        5,
        6
      ]
    }
  }
];

function generateIntersectionOfTwoArraysIiSteps(e: any): any[] {
  let t=[...e.nums1].sort((e,t)=>e-t),n=[...e.nums2].sort((e,t)=>e-t),r=t.length,l=n.length,s={};for(let e=0;e<r;e++)s[`arr1_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};for(let e=0;e<l;e++)s[`arr2_${e}`]={type:"arrayElement",value:n[e],position:e,state:"standard"};s.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"},s.ptr_j={type:"pointer",position:0,state:"hidden",label:"j"};let a=new StepRecorder({nums1:[...t],nums2:[...n],n1:r,n2:l,i:-1,j:-1,cmp:null,matchValue:null,result:[],done:!1},s),u=e=>{Object.entries(e).forEach(([e,t])=>a.update_variable(e,t))},o=(e,t,n,i)=>{a.update_visual(e,{type:"pointer",position:t,state:n,label:i})};a.record("-","Find shared values (with repeats) between the two arrays"),a.record("sort","Sort both arrays so a single forward walk finds every match");let c=0,d=0,m=[];for(o("ptr_i",0,"active","i"),o("ptr_j",0,"active","j"),u({i:0,j:0}),a.record("init_pointers","Start both pointers at index 0");c<r&&d<l;){o("ptr_i",c,"active","i"),o("ptr_j",d,"active","j"),u({i:c,j:d,cmp:null,matchValue:null}),a.record("loop","Walk while both pointers are in range");let e=t[c],i=n[d];e===i?(u({cmp:"eq"}),a.record("compare",`nums1[${c}] = ${e}  =  nums2[${d}] = ${i}`),m.push(e),u({matchValue:e,result:[...m]}),a.record("equal_found",`Match! Add ${e} to the result, advance both pointers`),c++,d++):e<i?(u({cmp:"lt"}),a.record("compare",`nums1[${c}] = ${e}  <  nums2[${d}] = ${i}`),a.record("advance_i",`${e} is smaller and can't match later, advance i`),c++):(u({cmp:"gt"}),a.record("compare",`nums1[${c}] = ${e}  >  nums2[${d}] = ${i}`),a.record("advance_j",`${i} is smaller and can't match later, advance j`),d++)}return o("ptr_i",Math.min(c,Math.max(0,r-1)),"hidden","i"),o("ptr_j",Math.min(d,Math.max(0,l-1)),"hidden","j"),u({i:c,j:d,cmp:null,done:!0}),a.record("loop_end","One array is exhausted, stop"),a.record("complete",`Intersection = [${m.join(", ")}] — ${m.length} common value${1===m.length?"":"s"}`),a.getSteps()
}

export function IntersectionOfTwoArraysIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IntersectionOfTwoArraysIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIntersectionOfTwoArraysIiSteps(e) as any[];
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
      title="Intersection of Two Arrays II"
      slug="intersection-of-two-arrays-ii"
      approaches={approaches}
      presets={IntersectionOfTwoArraysIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
