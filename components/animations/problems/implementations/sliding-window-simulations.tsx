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
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char" || item.type === "stateElement" || item.type === "bar" || item.type === "cell") {
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
// Maximum Average Subarray I (maximum-average-subarray-i)
// ==========================================

const MaximumAverageSubarrayITemplates = {
  "python": {
    "language": "python",
    "code": "def findMaxAverage(nums, k):\n    # Compute sum of the first window\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n\n    # Slide the window: add new element, remove old element\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, window_sum)\n\n    return max_sum / k",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        3
      ],
      "init_max": [
        4
      ],
      "slide_window": [
        7,
        8
      ],
      "update_max": [
        9
      ],
      "keep_max": [
        9
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public double findMaxAverage(int[] nums, int k) {\n    // Compute sum of the first window\n    int windowSum = 0;\n    for (int i = 0; i < k; i++) {\n        windowSum += nums[i];\n    }\n\n    int maxSum = windowSum;\n\n    // Slide the window: add new element, remove old element\n    for (int i = k; i < nums.length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n\n    return (double) maxSum / k;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "double findMaxAverage(vector<int>& nums, int k) {\n    // Compute sum of the first window\n    int windowSum = 0;\n    for (int i = 0; i < k; i++) {\n        windowSum += nums[i];\n    }\n\n    int maxSum = windowSum;\n\n    // Slide the window: add new element, remove old element\n    for (int i = k; i < (int)nums.size(); i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = max(maxSum, windowSum);\n    }\n\n    return (double)maxSum / k;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public double FindMaxAverage(int[] nums, int k) {\n    // Compute sum of the first window\n    int windowSum = 0;\n    for (int i = 0; i < k; i++) {\n        windowSum += nums[i];\n    }\n\n    int maxSum = windowSum;\n\n    // Slide the window: add new element, remove old element\n    for (int i = k; i < nums.Length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.Max(maxSum, windowSum);\n    }\n\n    return (double)maxSum / k;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaxAverage(nums []int, k int) float64 {\n    // Compute sum of the first window\n    windowSum := 0\n    for i := 0; i < k; i++ {\n        windowSum += nums[i]\n    }\n\n    maxSum := windowSum\n\n    // Slide the window: add new element, remove old element\n    for i := k; i < len(nums); i++ {\n        windowSum += nums[i] - nums[i-k]\n        if windowSum > maxSum {\n            maxSum = windowSum\n        }\n    }\n\n    return float64(maxSum) / float64(k)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        14
      ],
      "keep_max": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findMaxAverage(nums, k) {\n    // Compute sum of the first window\n    let windowSum = 0;\n    for (let i = 0; i < k; i++) {\n        windowSum += nums[i];\n    }\n\n    let maxSum = windowSum;\n\n    // Slide the window: add new element, remove old element\n    for (let i = k; i < nums.length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n\n    return maxSum / k;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaxAverage(nums: number[], k: number): number {\n    // Compute sum of the first window\n    let windowSum = 0;\n    for (let i = 0; i < k; i++) {\n        windowSum += nums[i];\n    }\n\n    let maxSum = windowSum;\n\n    // Slide the window: add new element, remove old element\n    for (let i = k; i < nums.length; i++) {\n        windowSum += nums[i] - nums[i - k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n\n    return maxSum / k;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "calculate_initial_sum": [
        4,
        5,
        6
      ],
      "init_max": [
        8
      ],
      "slide_window": [
        11,
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        13
      ]
    }
  }
};

const MaximumAverageSubarrayIPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        12,
        -5,
        -6,
        50,
        3
      ],
      "k": 4
    }
  },
  {
    "id": "ex2",
    "label": "Window size 1",
    "value": {
      "nums": [
        0,
        4,
        0,
        3,
        2
      ],
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "All negative",
    "value": {
      "nums": [
        -1,
        -2,
        -3,
        -4
      ],
      "k": 2
    }
  }
];

function generateMaximumAverageSubarrayISteps(e: any): any[] {
  let t=e.nums,i=e.k,a=t.length,l=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({nums:t,k:i},{...l});r.record("-","Start of algorithm"),r.add_new_variable("maxSum",null),r.record("initialize",`Check every window of size k = ${i}, keep the largest sum`);let s=-1/0,d=0,o=0,u=i-1;for(let e=0;e+i<=a;e++){let n=e+i-1,a=0;r.update_visual("currentWindow",{type:"range",start:e,end:n}),r.update_variable("i",e),r.update_variable("windowEnd",n);for(let i=e;i<=n;i++){let e=a;a+=t[i],r.update_variable("j",i),r.update_variable("prevSum",e),r.update_variable("addedVal",t[i]),r.update_variable("windowSum",a),r.record("accumulate",`Add nums[${i}] = ${t[i]}, windowSum = ${a}`)}if(0===e)d=(s=a)/i,o=e,u=n,r.add_new_variable("oldMaxSum",null),r.update_variable("maxSum",s),r.update_variable("maxAvg",d),r.update_variable("maxStart",o),r.update_variable("maxEnd",u),r.update_visual("maxWindow",{type:"range",start:o,end:u}),r.record("init_max",`First window is the best so far, maxAvg = ${s}/${i} = ${d.toFixed(2)}`);else{let t=a>s,l=s;r.add_conditional("is_new_max",t),r.update_variable("oldMaxSum",l),t?(d=(s=a)/i,o=e,u=n,r.update_variable("maxSum",s),r.update_variable("maxAvg",d),r.update_variable("maxStart",o),r.update_variable("maxEnd",u),r.update_visual("maxWindow",{type:"range",start:o,end:u}),r.record("update_max",`${a} > ${l}: new best window, maxAvg = ${d.toFixed(2)}`)):r.record("keep_max",`${a} <= ${s}: keep best window, maxAvg = ${d.toFixed(2)}`)}}return r.delete_variable("prevSum"),r.delete_variable("addedVal"),r.delete_variable("j"),r.delete_visual("currentWindow"),r.record("complete",`Maximum average = ${s}/${i} = ${d.toFixed(2)}, window [${o}..${u}]`),r.getSteps()
}

export function MaximumAverageSubarrayIProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumAverageSubarrayITemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumAverageSubarrayISteps(e) as any[];
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
      title="Maximum Average Subarray I"
      slug="maximum-average-subarray-i"
      approaches={approaches}
      presets={MaximumAverageSubarrayIPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Permutation in String (permutation-in-string)
// ==========================================

const PermutationInStringTemplates = {
  "python": {
    "language": "python",
    "code": "def checkInclusion(s1, s2):\n    n, m = len(s1), len(s2)\n    if n > m:\n        return False\n\n    s1_freq = [0] * 26\n    window_freq = [0] * 26\n\n    # Build frequency arrays for s1 and the first window\n    for i in range(n):\n        s1_freq[ord(s1[i]) - ord('a')] += 1\n        window_freq[ord(s2[i]) - ord('a')] += 1\n\n    if s1_freq == window_freq:\n        return True\n\n    # Slide the window across s2\n    for i in range(n, m):\n        window_freq[ord(s2[i]) - ord('a')] += 1         # Add new char\n        window_freq[ord(s2[i - n]) - ord('a')] -= 1     # Remove old char\n        if s1_freq == window_freq:\n            return True\n\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        10,
        11,
        12
      ],
      "check_match": [
        14,
        20
      ],
      "match_found": [
        14,
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20
      ]
    },
    "conditionalMap": {
      "is_match": [
        14,
        20
      ],
      "not_match": [
        14,
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean checkInclusion(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    if (n > m) return false;\n\n    int[] s1Freq = new int[26];\n    int[] windowFreq = new int[26];\n\n    // Build frequency arrays for s1 and the first window\n    for (int i = 0; i < n; i++) {\n        s1Freq[s1.charAt(i) - 'a']++;\n        windowFreq[s2.charAt(i) - 'a']++;\n    }\n\n    if (matches(s1Freq, windowFreq)) return true;\n\n    // Slide the window across s2\n    for (int i = n; i < m; i++) {\n        windowFreq[s2.charAt(i) - 'a']++;       // Add new char\n        windowFreq[s2.charAt(i - n) - 'a']--;   // Remove old char\n        if (matches(s1Freq, windowFreq)) return true;\n    }\n\n    return false;\n}\n\nprivate boolean matches(int[] a, int[] b) {\n    for (int i = 0; i < 26; i++) {\n        if (a[i] != b[i]) return false;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        9,
        10,
        11,
        12
      ],
      "check_match": [
        14,
        20
      ],
      "match_found": [
        14,
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20,
        23
      ]
    },
    "conditionalMap": {
      "is_match": [
        14,
        20
      ],
      "not_match": [
        14,
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool checkInclusion(string s1, string s2) {\n    int n = s1.size(), m = s2.size();\n    if (n > m) return false;\n\n    vector<int> s1Freq(26, 0), windowFreq(26, 0);\n\n    // Build frequency arrays for s1 and the first window\n    for (int i = 0; i < n; i++) {\n        s1Freq[s1[i] - 'a']++;\n        windowFreq[s2[i] - 'a']++;\n    }\n\n    if (s1Freq == windowFreq) return true;\n\n    // Slide the window across s2\n    for (int i = n; i < m; i++) {\n        windowFreq[s2[i] - 'a']++;           // Add new char\n        windowFreq[s2[i - n] - 'a']--;       // Remove old char\n        if (s1Freq == windowFreq) return true;\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        9,
        10,
        11
      ],
      "check_match": [
        20
      ],
      "match_found": [
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20,
        23
      ]
    },
    "conditionalMap": {
      "is_match": [
        20
      ],
      "not_match": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool CheckInclusion(string s1, string s2) {\n    int n = s1.Length, m = s2.Length;\n    if (n > m) return false;\n\n    int[] s1Freq = new int[26];\n    int[] windowFreq = new int[26];\n\n    // Build frequency arrays for s1 and the first window\n    for (int i = 0; i < n; i++) {\n        s1Freq[s1[i] - 'a']++;\n        windowFreq[s2[i] - 'a']++;\n    }\n\n    if (Matches(s1Freq, windowFreq)) return true;\n\n    // Slide the window across s2\n    for (int i = n; i < m; i++) {\n        windowFreq[s2[i] - 'a']++;           // Add new char\n        windowFreq[s2[i - n] - 'a']--;       // Remove old char\n        if (Matches(s1Freq, windowFreq)) return true;\n    }\n\n    return false;\n}\n\nprivate bool Matches(int[] a, int[] b) {\n    for (int i = 0; i < 26; i++) {\n        if (a[i] != b[i]) return false;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        9,
        10,
        11,
        12
      ],
      "check_match": [
        14,
        20
      ],
      "match_found": [
        14,
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20,
        23
      ]
    },
    "conditionalMap": {
      "is_match": [
        14,
        20
      ],
      "not_match": [
        14,
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func checkInclusion(s1 string, s2 string) bool {\n    n, m := len(s1), len(s2)\n    if n > m {\n        return false\n    }\n\n    var s1Freq, windowFreq [26]int\n\n    // Build frequency arrays for s1 and the first window\n    for i := 0; i < n; i++ {\n        s1Freq[s1[i]-'a']++\n        windowFreq[s2[i]-'a']++\n    }\n\n    if s1Freq == windowFreq {\n        return true\n    }\n\n    // Slide the window across s2\n    for i := n; i < m; i++ {\n        windowFreq[s2[i]-'a']++       // Add new char\n        windowFreq[s2[i-n]-'a']--     // Remove old char\n        if s1Freq == windowFreq {\n            return true\n        }\n    }\n\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        7
      ],
      "early_return": [
        4
      ],
      "build_initial_window": [
        10,
        11,
        12,
        13
      ],
      "check_match": [
        15,
        23
      ],
      "match_found": [
        16,
        24
      ],
      "slide_window": [
        21,
        22
      ],
      "final_check": [
        23,
        28
      ]
    },
    "conditionalMap": {
      "is_match": [
        15,
        23
      ],
      "not_match": [
        15,
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function checkInclusion(s1, s2) {\n  const n = s1.length,\n    m = s2.length;\n  if (n > m) return false;\n\n  const s1Freq = new Array(26).fill(0);\n  const windowFreq = new Array(26).fill(0);\n\n  // Build frequency arrays for s1 and the first window\n  for (let i = 0; i < n; i++) {\n    s1Freq[s1.charCodeAt(i) - 97]++;\n    windowFreq[s2.charCodeAt(i) - 97]++;\n  }\n\n  if (matches(s1Freq, windowFreq)) return true;\n\n  // Slide the window across s2\n  for (let i = n; i < m; i++) {\n    windowFreq[s2.charCodeAt(i) - 97]++;         // Add new char\n    windowFreq[s2.charCodeAt(i - n) - 97]--;     // Remove old char\n    if (matches(s1Freq, windowFreq)) return true;\n  }\n\n  return false;\n}\nfunction matches(a, b) {\n  for (let i = 0; i < 26; i++) {\n    if (a[i] !== b[i]) return false;\n  }\n  return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        10,
        11,
        12
      ],
      "check_match": [
        20
      ],
      "match_found": [
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20
      ]
    },
    "conditionalMap": {
      "is_match": [
        20
      ],
      "not_match": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function checkInclusion(s1: string, s2: string): boolean {\n    const n = s1.length, m = s2.length;\n    if (n > m) return false;\n\n    const s1Freq = new Array(26).fill(0);\n    const windowFreq = new Array(26).fill(0);\n\n    // Build frequency arrays for s1 and the first window\n    for (let i = 0; i < n; i++) {\n        s1Freq[s1.charCodeAt(i) - 97]++;\n        windowFreq[s2.charCodeAt(i) - 97]++;\n    }\n\n    if (matches(s1Freq, windowFreq)) return true;\n\n    // Slide the window across s2\n    for (let i = n; i < m; i++) {\n        windowFreq[s2.charCodeAt(i) - 97]++;         // Add new char\n        windowFreq[s2.charCodeAt(i - n) - 97]--;     // Remove old char\n        if (matches(s1Freq, windowFreq)) return true;\n    }\n\n    return false;\n}\n\nfunction matches(a: number[], b: number[]): boolean {\n    for (let i = 0; i < 26; i++) {\n        if (a[i] !== b[i]) return false;\n    }\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5,
        6
      ],
      "early_return": [
        3
      ],
      "build_initial_window": [
        9,
        10,
        11,
        12
      ],
      "check_match": [
        14,
        20
      ],
      "match_found": [
        14,
        20
      ],
      "slide_window": [
        18,
        19
      ],
      "final_check": [
        20,
        23
      ]
    },
    "conditionalMap": {
      "is_match": [
        14,
        20
      ],
      "not_match": [
        14,
        20
      ]
    }
  }
};

const PermutationInStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s1": "ab",
      "s2": "eidbaooo"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s1": "ab",
      "s2": "eidboaoo"
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s1": "abc",
      "s2": "bbbca"
    }
  },
  {
    "id": "ex4",
    "label": "No Match",
    "value": {
      "s1": "xyz",
      "s2": "abcdef"
    }
  }
];

function generatePermutationInStringSteps(e: any): any[] {
  let t=e.s1,i=e.s2,n=t.length;i.length;let a=t.split("").reduce((e,t,i)=>(e[`s1_${i}`]={type:"arrayElement",value:t,position:i},e),{}),s=i.split("").reduce((e,t,i)=>(e[`s2_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({s1:t,s2:i},{...a,...s});l.record("-","Start of algorithm");let d=function(e){let t=1;for(let i=2;i<=e;i++)t*=i;return t}(n);l.add_new_variable("matches",null),l.update_variable("total",d),l.update_variable("tried",[]),l.record("init",`Generate all ${d} permutation${1===d?"":"s"} of "${t}", search each in s2`);let o=t.split(""),c=[],h=0,u=!1,f=e=>{if(e===o.length){var t=o.join("");let e=i.indexOf(t);if(e>=0){let i=h>=16;return c.push({perm:t,found:!0}),l.update_variable("perm",t),l.update_variable("permNum",h+1),l.update_variable("foundAt",e),l.update_variable("matchStart",e),l.update_variable("matchEnd",e+n-1),l.update_variable("tried",[...c]),l.update_variable("skipped",i),l.update_variable("matches",!0),l.add_conditional("is_substring",!0),l.record("found",`"${t}" is a substring of s2 at [${e}..${e+n-1}]: return true`),u=!0,!0}return h<16&&(c.push({perm:t,found:!1}),h++,l.update_variable("perm",t),l.update_variable("permNum",h),l.update_variable("foundAt",-1),l.update_variable("tried",[...c]),l.add_conditional("is_substring",!1),l.record("check_perm",`"${t}" is not a substring of s2`)),!1}for(let t=e;t<o.length;t++){let i=o[e];o[e]=o[t],o[t]=i;let r=f(e+1);if(o[t]=o[e],o[e]=i,r)return!0}return!1};if(f(0),!u){let e=d>h;l.update_variable("matches",!1),l.update_variable("truncated",e),l.delete_variable("perm"),l.delete_variable("foundAt"),l.record("complete",`Checked all ${d} permutations, none is a substring of s2: return false`)}return l.getSteps()
}

export function PermutationInStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PermutationInStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePermutationInStringSteps(e) as any[];
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
      title="Permutation in String"
      slug="permutation-in-string"
      approaches={approaches}
      presets={PermutationInStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find All Anagrams in a String (find-all-anagrams-in-a-string)
// ==========================================

const FindAllAnagramsInAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def findAnagrams(s, p):\n    result = []\n    p_len = len(p)\n    s_len = len(s)\n    if s_len < p_len:\n        return result\n\n    sorted_p = sorted(p)\n\n    for i in range(s_len - p_len + 1):\n        window = sorted(s[i:i + p_len])\n        if window == sorted_p:\n            result.append(i)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        6
      ],
      "sort_p": [
        8
      ],
      "take_window": [
        11
      ],
      "sort_window": [
        11
      ],
      "no_match": [
        12
      ],
      "match": [
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_equal": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> findAnagrams(String s, String p) {\n    List<Integer> result = new ArrayList<>();\n    int pLen = p.length();\n    int sLen = s.length();\n    if (sLen < pLen) return result;\n\n    char[] sortedP = p.toCharArray();\n    Arrays.sort(sortedP);\n\n    for (int i = 0; i <= sLen - pLen; i++) {\n        char[] window = s.substring(i, i + pLen).toCharArray();\n        Arrays.sort(window);\n        if (Arrays.equals(window, sortedP)) {\n            result.add(i);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        5
      ],
      "sort_p": [
        8
      ],
      "take_window": [
        11
      ],
      "sort_window": [
        12
      ],
      "no_match": [
        13
      ],
      "match": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_equal": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findAnagrams(string s, string p) {\n    vector<int> result;\n    int pLen = p.length();\n    int sLen = s.length();\n    if (sLen < pLen) return result;\n\n    string sortedP = p;\n    sort(sortedP.begin(), sortedP.end());\n\n    for (int i = 0; i <= sLen - pLen; i++) {\n        string window = s.substr(i, pLen);\n        sort(window.begin(), window.end());\n        if (window == sortedP) {\n            result.push_back(i);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        5
      ],
      "sort_p": [
        8
      ],
      "take_window": [
        11
      ],
      "sort_window": [
        12
      ],
      "no_match": [
        13
      ],
      "match": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_equal": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> FindAnagrams(string s, string p) {\n    List<int> result = new List<int>();\n    int pLen = p.Length;\n    int sLen = s.Length;\n    if (sLen < pLen) return result;\n\n    char[] sortedP = p.ToCharArray();\n    Array.Sort(sortedP);\n\n    for (int i = 0; i <= sLen - pLen; i++) {\n        char[] window = s.Substring(i, pLen).ToCharArray();\n        Array.Sort(window);\n        if (Enumerable.SequenceEqual(window, sortedP)) {\n            result.Add(i);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        5
      ],
      "sort_p": [
        8
      ],
      "take_window": [
        11
      ],
      "sort_window": [
        12
      ],
      "no_match": [
        13
      ],
      "match": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_equal": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findAnagrams(s string, p string) []int {\n    result := []int{}\n    pLen := len(p)\n    sLen := len(s)\n    if sLen < pLen {\n        return result\n    }\n\n    sortedP := []byte(p)\n    sort.Slice(sortedP, func(i, j int) bool { return sortedP[i] < sortedP[j] })\n\n    for i := 0; i <= sLen-pLen; i++ {\n        window := []byte(s[i : i+pLen])\n        sort.Slice(window, func(a, b int) bool { return window[a] < window[b] })\n        if string(window) == string(sortedP) {\n            result = append(result, i)\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        6
      ],
      "sort_p": [
        9,
        10
      ],
      "take_window": [
        13
      ],
      "sort_window": [
        14
      ],
      "no_match": [
        15
      ],
      "match": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_equal": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findAnagrams(s, p) {\n    const result = [];\n    const pLen = p.length;\n    const sLen = s.length;\n    if (sLen < pLen) return result;\n\n    const sortedP = p.split('').sort().join('');\n\n    for (let i = 0; i <= sLen - pLen; i++) {\n        const window = s.substring(i, i + pLen).split('').sort().join('');\n        if (window === sortedP) {\n            result.push(i);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        5
      ],
      "sort_p": [
        7
      ],
      "take_window": [
        10
      ],
      "sort_window": [
        10
      ],
      "no_match": [
        11
      ],
      "match": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_equal": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findAnagrams(s: string, p: string): number[] {\n    const result: number[] = [];\n    const pLen = p.length;\n    const sLen = s.length;\n    if (sLen < pLen) return result;\n\n    const sortedP = p.split('').sort().join('');\n\n    for (let i = 0; i <= sLen - pLen; i++) {\n        const window = s.substring(i, i + pLen).split('').sort().join('');\n        if (window === sortedP) {\n            result.push(i);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "early_return": [
        5
      ],
      "sort_p": [
        7
      ],
      "take_window": [
        10
      ],
      "sort_window": [
        10
      ],
      "no_match": [
        11
      ],
      "match": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_equal": [
        11
      ]
    }
  }
};

const FindAllAnagramsInAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "cbaebabacd",
      "p": "abc"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "abab",
      "p": "ab"
    }
  },
  {
    "id": "ex3",
    "label": "Repeating",
    "value": {
      "s": "aaaaaaa",
      "p": "aaa"
    }
  }
];

function generateFindAllAnagramsInAStringSteps(e: any): any[] {
  let t="string"==typeof e?.s?e.s:"",n="string"==typeof e?.p?e.p:"",r=t.length,a=n.length,l=n.split("").reduce((e,t,n)=>(e[`p_${n}`]={type:"arrayElement",value:t,position:n},e),{}),o=t.split("").reduce((e,t,n)=>(e[`s_${n}`]={type:"arrayElement",value:t,position:n},e),{}),s=new StepRecorder({s:t,p:n},{...l,...o});if(s.record("-","Start of algorithm"),a>r)return s.add_new_variable("result",[]),s.record("early_return","p is longer than s, return empty list"),s.getSteps();let d=[];s.add_new_variable("result",[]),s.add_new_variable("pCount",{}),s.add_new_variable("sCount",{}),s.record("initialize","Initialize empty counts and result list");let u={},c={};for(let e=0;e<a;e++)u[n[e]]=(u[n[e]]||0)+1,c[t[e]]=(c[t[e]]||0)+1,s.update_variable("i",e),s.update_variable("pChar",n[e]),s.update_variable("sChar",t[e]),s.update_variable("pCount",{...u}),s.update_variable("sCount",{...c}),s.update_visual("window",{type:"range",start:0,end:e}),s.record("build_initial_window",`Count p[${e}] = '${n[e]}' and s[${e}] = '${t[e]}'`);let h=()=>{for(let e in u)if(u[e]!==(c[e]||0))return!1;for(let e in c)if(!(e in u))return!1;return!0};s.delete_variable("pChar"),s.delete_variable("sChar");for(let e=0;e<=r-a;e++){let n=h();if(s.update_variable("i",e),s.add_conditional(n?"is_anagram":"not_anagram",n),n?(d.push(e),s.update_variable("result",[...d]),s.update_variable("foundIdx",e),s.record("check_window",`sCount == pCount, anagram found at index ${e}`),s.delete_variable("foundIdx")):s.record("check_window",`sCount != pCount, window [${e}..${e+a-1}] is not an anagram`),e+a<r){let n=e+a;c[t[e]]--,0===c[t[e]]&&delete c[t[e]],c[t[n]]=(c[t[n]]||0)+1,s.update_variable("sCount",{...c}),s.update_variable("removedIdx",e),s.update_variable("removedChar",t[e]),s.update_variable("addedIdx",n),s.update_variable("addedChar",t[n]),s.update_visual("window",{type:"range",start:e+1,end:n}),s.record("slide_window",`Slide right: drop '${t[e]}', add '${t[n]}'`),s.delete_variable("removedIdx"),s.delete_variable("removedChar"),s.delete_variable("addedIdx"),s.delete_variable("addedChar")}}return s.delete_visual("window"),s.record("complete",d.length>0?`Found ${d.length} anagram${1===d.length?"":"s"}: [${d.join(", ")}]`:"No anagrams found"),s.getSteps()
}

export function FindAllAnagramsInAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindAllAnagramsInAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindAllAnagramsInAStringSteps(e) as any[];
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
      title="Find All Anagrams in a String"
      slug="find-all-anagrams-in-a-string"
      approaches={approaches}
      presets={FindAllAnagramsInAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Size Subarray Sum (minimum-size-subarray-sum)
// ==========================================

const MinimumSizeSubarraySumTemplates = {
  "python": {
    "language": "python",
    "code": "def minSubArrayLen(target, nums):\n    n = len(nums)\n    left = 0\n    current_sum = 0\n    min_len = n + 1\n\n    for right in range(n):\n        current_sum += nums[right]\n\n        # Shrink window while sum meets the target\n        while current_sum >= target:\n            min_len = min(min_len, right - left + 1)\n            current_sum -= nums[left]\n            left += 1\n\n    return 0 if min_len == n + 1 else min_len",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int minSubArrayLen(int target, int[] nums) {\n    int n = nums.length;\n    int left = 0;\n    int currentSum = 0;\n    int minLen = n + 1;\n\n    for (int right = 0; right < n; right++) {\n        currentSum += nums[right];\n\n        // Shrink window while sum meets the target\n        while (currentSum >= target) {\n            minLen = Math.min(minLen, right - left + 1);\n            currentSum -= nums[left];\n            left++;\n        }\n    }\n\n    return minLen == n + 1 ? 0 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int minSubArrayLen(int target, vector<int>& nums) {\n    int n = nums.size();\n    int left = 0;\n    int currentSum = 0;\n    int minLen = n + 1;\n\n    for (int right = 0; right < n; right++) {\n        currentSum += nums[right];\n\n        // Shrink window while sum meets the target\n        while (currentSum >= target) {\n            minLen = min(minLen, right - left + 1);\n            currentSum -= nums[left];\n            left++;\n        }\n    }\n\n    return minLen == n + 1 ? 0 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MinSubArrayLen(int target, int[] nums) {\n    int n = nums.Length;\n    int left = 0;\n    int currentSum = 0;\n    int minLen = n + 1;\n\n    for (int right = 0; right < n; right++) {\n        currentSum += nums[right];\n\n        // Shrink window while sum meets the target\n        while (currentSum >= target) {\n            minLen = Math.Min(minLen, right - left + 1);\n            currentSum -= nums[left];\n            left++;\n        }\n    }\n\n    return minLen == n + 1 ? 0 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minSubArrayLen(target int, nums []int) int {\n    n := len(nums)\n    left := 0\n    currentSum := 0\n    minLen := n + 1\n\n    for right := 0; right < n; right++ {\n        currentSum += nums[right]\n\n        // Shrink window while sum meets the target\n        for currentSum >= target {\n            if right-left+1 < minLen {\n                minLen = right - left + 1\n            }\n            currentSum -= nums[left]\n            left++\n        }\n    }\n\n    if minLen == n+1 {\n        return 0\n    }\n    return minLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12,
        13
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        15,
        16
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minSubArrayLen(target, nums) {\n  const n = nums.length\n  let left = 0\n  let currentSum = 0\n  let minLen = n + 1\n\n  for (let right = 0; right < n; right++) {\n    currentSum += nums[right]\n\n    // Shrink window while sum meets the target\n    while (currentSum >= target) {\n      minLen = Math.min(minLen, right - left + 1)\n      currentSum -= nums[left]\n      left++\n    }\n  }\n\n  return minLen === n + 1 ? 0 : minLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minSubArrayLen(target: number, nums: number[]): number {\n  const n = nums.length\n  let left = 0\n  let currentSum = 0\n  let minLen = n + 1\n\n  for (let right = 0; right < n; right++) {\n    currentSum += nums[right]\n\n    // Shrink window while sum meets the target\n    while (currentSum >= target) {\n      minLen = Math.min(minLen, right - left + 1)\n      currentSum -= nums[left]\n      left++\n    }\n  }\n\n  return minLen === n + 1 ? 0 : minLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "expand_window": [
        7
      ],
      "add_to_sum": [
        8
      ],
      "check_sum": [
        11
      ],
      "update_min": [
        12
      ],
      "keep_min": [
        12
      ],
      "shrink_window": [
        13,
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "sum_valid": [
        11
      ],
      "is_new_min": [
        12
      ]
    }
  }
};

const MinimumSizeSubarraySumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        2,
        3,
        1,
        2,
        4,
        3
      ],
      "target": 7
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        4,
        4
      ],
      "target": 4
    }
  },
  {
    "id": "ex3",
    "label": "No solution",
    "value": {
      "nums": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "target": 11
    }
  },
  {
    "id": "ex4",
    "label": "Mid array",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "target": 11
    }
  }
];

function generateMinimumSizeSubarraySumSteps(e: any): any[] {
  let n=e.nums,i=e.target,r=n.reduce((e,n,i)=>(e[`elem_${i}`]={type:"arrayElement",value:n,position:i},e),{}),l=1/0,a=-1,s=-1,o=0,d=0,u=new StepRecorder({nums:n,target:i},{...r}),m=(e,i)=>{n.forEach((n,t)=>{let r;t<o?r="outside":t===i&&t<=e&&(r="checking"),u.update_visual(`elem_${t}`,{type:"arrayElement",value:n,position:t,...r?{state:r}:{}})})},c=()=>{a>=0&&u.update_visual("minRange",{type:"range",start:a,end:s,label:"minLen"})},h=e=>`[${n.slice(o,e+1).join(",")}]`;u.record("-","Start of algorithm"),u.add_new_variable("target",i),u.add_new_variable("minLen",null),u.add_new_variable("left",o),u.add_new_variable("currentSum",d),u.add_new_variable("sum_ok",!1),u.update_visual("left",{type:"pointer",position:o,label:"left"}),u.record("initialize",`Initialize minLen = ∞, left = 0, currentSum = 0 with target = ${i}`);for(let e=0;e<n.length;e++){let t=n[e];for(u.update_variable("right",e),u.update_variable("prev_sum",d),u.update_variable("added_val",t),u.update_variable("removed_val",null),u.update_variable("sum_ok",!1),u.update_visual("right",{type:"pointer",position:e,label:"right"}),m(e,e),u.record("expand_window",`Expand the window to include nums[${e}] = ${t}`),d+=t,u.update_variable("currentSum",d),u.update_variable("sum_ok",d>=i),u.record("add_to_sum",`Add ${t} to the sum, currentSum is now ${d}`);d>=i;){u.add_conditional("sum_valid",!0);let t=e-o+1,r=t<l;u.add_conditional("is_new_min",r),u.update_variable("window_size",t),u.update_variable("old_min_len",l===1/0?null:l),r?(l=t,a=o,s=e,u.update_variable("minLen",l),c(),u.record("update_min",`Window ${h(e)} sums to ${d} with size ${t}, new best: minLen = ${l}`)):u.record("keep_min",`Window ${h(e)} has size ${t}, not smaller than minLen ${l}`);let p=n[o];u.update_variable("prev_sum",d),d-=p,o++,u.update_variable("left",o),u.update_variable("currentSum",d),u.update_variable("added_val",null),u.update_variable("removed_val",p),u.update_variable("sum_ok",d>=i),u.update_visual("left",{type:"pointer",position:o,label:"left"}),m(e,e),u.add_conditional("sum_valid",d>=i),u.add_conditional("is_new_min",!1),u.record("shrink_window",`Shrink: drop nums[${o-1}] = ${p}, currentSum is now ${d}`)}u.add_conditional("sum_valid",!1),u.add_conditional("is_new_min",!1),u.update_variable("added_val",null),u.update_variable("removed_val",null),u.record("check_sum",`currentSum ${d} is below target ${i}, expand the window`)}let p=l===1/0?0:l;return u.update_variable("minLen",p),u.update_variable("added_val",null),u.update_variable("removed_val",null),u.update_variable("sum_ok",!1),u.delete_visual("left"),u.delete_visual("right"),n.forEach((e,n)=>{let i=a>=0&&n>=a&&n<=s;u.update_visual(`elem_${n}`,{type:"arrayElement",value:e,position:n,state:i?"in_min":"outside"})}),c(),u.record("complete",a>=0?`Minimum subarray with sum >= ${i} has length ${p}`:`No subarray reaches target ${i}, return 0`),u.getSteps()
}

export function MinimumSizeSubarraySumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumSizeSubarraySumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumSizeSubarraySumSteps(e) as any[];
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
      title="Minimum Size Subarray Sum"
      slug="minimum-size-subarray-sum"
      approaches={approaches}
      presets={MinimumSizeSubarraySumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Consecutive Ones III (max-consecutive-ones-iii)
// ==========================================

const MaxConsecutiveOnesIiiTemplates = {
  "python": {
    "language": "python",
    "code": "def longestOnes(nums, k):\n    left = 0\n    zero_count = 0\n    max_len = 0\n\n    for right in range(len(nums)):\n        if nums[right] == 0:\n            zero_count += 1\n        # Shrink window until we have at most k zeros\n        while zero_count > k:\n            if nums[left] == 0:\n                zero_count -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        10
      ],
      "remove_zero": [
        11,
        12
      ],
      "update_max": [
        14
      ],
      "keep_max": [
        14
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        10
      ],
      "is_new_max": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestOnes(int[] nums, int k) {\n    int left = 0;\n    int zeroCount = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < nums.length; right++) {\n        if (nums[right] == 0) {\n            zeroCount++;\n        }\n        // Shrink window until we have at most k zeros\n        while (zeroCount > k) {\n            if (nums[left] == 0) {\n                zeroCount--;\n            }\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestOnes(vector<int>& nums, int k) {\n    int left = 0;\n    int zeroCount = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < nums.size(); right++) {\n        if (nums[right] == 0) {\n            zeroCount++;\n        }\n        // Shrink window until we have at most k zeros\n        while (zeroCount > k) {\n            if (nums[left] == 0) {\n                zeroCount--;\n            }\n            left++;\n        }\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestOnes(int[] nums, int k) {\n    int left = 0;\n    int zeroCount = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < nums.Length; right++) {\n        if (nums[right] == 0) {\n            zeroCount++;\n        }\n        // Shrink window until we have at most k zeros\n        while (zeroCount > k) {\n            if (nums[left] == 0) {\n                zeroCount--;\n            }\n            left++;\n        }\n        maxLen = Math.Max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestOnes(nums []int, k int) int {\n    left := 0\n    zeroCount := 0\n    maxLen := 0\n\n    for right := 0; right < len(nums); right++ {\n        if nums[right] == 0 {\n            zeroCount++\n        }\n        // Shrink window until we have at most k zeros\n        for zeroCount > k {\n            if nums[left] == 0 {\n                zeroCount--\n            }\n            left++\n        }\n        if right - left + 1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        18
      ],
      "keep_max": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestOnes(nums, k) {\n    let left = 0;\n    let zeroCount = 0;\n    let maxLen = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        if (nums[right] === 0) {\n            zeroCount++;\n        }\n        // Shrink window until we have at most k zeros\n        while (zeroCount > k) {\n            if (nums[left] === 0) {\n                zeroCount--;\n            }\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestOnes(nums: number[], k: number): number {\n    let left = 0;\n    let zeroCount = 0;\n    let maxLen = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        if (nums[right] === 0) {\n            zeroCount++;\n        }\n        // Shrink window until we have at most k zeros\n        while (zeroCount > k) {\n            if (nums[left] === 0) {\n                zeroCount--;\n            }\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "expand_window": [
        6
      ],
      "check_zero": [
        7
      ],
      "add_zero": [
        8
      ],
      "shrink_window": [
        11
      ],
      "remove_zero": [
        12,
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ],
      "too_many_zeros": [
        11
      ],
      "is_new_max": [
        17
      ]
    }
  }
};

const MaxConsecutiveOnesIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        1,
        1,
        0,
        0,
        0,
        1,
        1,
        1,
        1,
        0
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        0,
        0,
        1,
        1,
        0,
        0,
        1,
        1,
        1,
        0,
        1,
        1
      ],
      "k": 3
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
        1
      ],
      "k": 0
    }
  },
  {
    "id": "ex4",
    "label": "All zeros",
    "value": {
      "nums": [
        0,
        0,
        0,
        0
      ],
      "k": 2
    }
  }
];

function generateMaxConsecutiveOnesIiiSteps(e: any): any[] {
  let t=e.nums,n=e.k,a=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),r=0,l=-1,o=-1,s=0,d=new StepRecorder({nums:t,k:n},{...a}),u=(e,n)=>{t.forEach((t,i)=>{let a;i<s?a="outside":i>e?a=void 0:i===n?a="checking":0===t&&(a="zero_used"),d.update_visual(`elem_${i}`,{type:"arrayElement",value:t,position:i,...a?{state:a}:{}})})},c=()=>{l>=0&&d.update_visual("maxRange",{type:"range",start:l,end:o,label:"maxLen"})};for(d.record("-","Start of algorithm"),d.add_new_variable("k",n),d.add_new_variable("maxLen",r),d.add_new_variable("left",s),d.add_new_variable("zerosCount",0),d.add_new_variable("invalid",!1),d.record("initialize",`Initialize maxLen = 0, try every start with k = ${n}`),s=0;s<t.length;s++){let e=0;d.update_variable("left",s),d.update_variable("zerosCount",0),d.update_visual("left",{type:"pointer",position:s,label:"left"});for(let i=s;i<t.length;i++){let a=t[i];d.update_variable("right",i),d.update_variable("added_val",a),d.update_variable("invalid",!1),d.update_visual("right",{type:"pointer",position:i,label:"right"}),u(i,i),d.record("expand_window",`Extend the window from ${s} to include nums[${i}] = ${a}`);let h=0===a;if(d.add_conditional("is_zero",h),h){let t=++e>n;if(d.update_variable("zerosCount",e),d.update_variable("invalid",t),u(i),d.record("add_zero",t?`Zero at index ${i} needs a flip, zerosCount = ${e} > k = ${n}, stop this start`:`Zero at index ${i} uses a flip, zerosCount = ${e} of k = ${n}`),t)break}else d.record("check_zero",`One at index ${i} keeps the streak, zerosCount stays ${e}`);let m=i-s+1,p=m>r;d.add_conditional("is_new_max",p),d.update_variable("window_size",m),d.update_variable("old_max_len",r),u(i),p?(r=m,l=s,o=i,d.update_variable("maxLen",r),c(),d.record("update_max",`Window [${s}..${i}] has size ${m}, new best: maxLen = ${r}`)):d.record("keep_max",`Window size ${m} does not beat maxLen = ${r}`)}}return d.update_variable("invalid",!1),d.delete_visual("left"),d.delete_visual("right"),t.forEach((e,t)=>{let n=l>=0&&t>=l&&t<=o;d.update_visual(`elem_${t}`,{type:"arrayElement",value:e,position:t,state:n?"in_max":"outside"})}),c(),d.record("complete",`Longest run of ones after flipping at most ${n} zeros has length ${r}`),d.getSteps()
}

export function MaxConsecutiveOnesIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxConsecutiveOnesIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxConsecutiveOnesIiiSteps(e) as any[];
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
      title="Max Consecutive Ones III"
      slug="max-consecutive-ones-iii"
      approaches={approaches}
      presets={MaxConsecutiveOnesIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Substring Without Repeating Characters (longest-substring-without-repeating-characters)
// ==========================================

const LongestSubstringWithoutRepeatingCharactersTemplates = {
  "python": {
    "language": "python",
    "code": "def lengthOfLongestSubstring(s):\n    window = set()\n    left = 0\n    max_len = 0\n\n    for right in range(len(s)):\n        # Shrink window until duplicate is removed\n        while s[right] in window:\n            window.remove(s[left])\n            left += 1\n        window.add(s[right])\n        max_len = max(max_len, right - left + 1)\n\n    return max_len",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        11
      ],
      "update_max": [
        12
      ],
      "keep_max": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int lengthOfLongestSubstring(String s) {\n    HashSet<Character> window = new HashSet<>();\n    int left = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < s.length(); right++) {\n        // Shrink window until duplicate is removed\n        while (window.contains(s.charAt(right))) {\n            window.remove(s.charAt(left));\n            left++;\n        }\n        window.add(s.charAt(right));\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int lengthOfLongestSubstring(string s) {\n    unordered_set<char> window;\n    int left = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < s.size(); right++) {\n        // Shrink window until duplicate is removed\n        while (window.count(s[right])) {\n            window.erase(s[left]);\n            left++;\n        }\n        window.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LengthOfLongestSubstring(string s) {\n    HashSet<char> window = new HashSet<char>();\n    int left = 0;\n    int maxLen = 0;\n\n    for (int right = 0; right < s.Length; right++) {\n        // Shrink window until duplicate is removed\n        while (window.Contains(s[right])) {\n            window.Remove(s[left]);\n            left++;\n        }\n        window.Add(s[right]);\n        maxLen = Math.Max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lengthOfLongestSubstring(s string) int {\n    window := make(map[byte]bool)\n    left := 0\n    maxLen := 0\n\n    for right := 0; right < len(s); right++ {\n        // Shrink window until duplicate is removed\n        for window[s[right]] {\n            delete(window, s[left])\n            left++\n        }\n        window[s[right]] = true\n        if right-left+1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        14
      ],
      "keep_max": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function lengthOfLongestSubstring(s) {\n  const window = new Set();\n  let left = 0;\n  let maxLen = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    // Shrink window until duplicate is removed\n    while (window.has(s[right])) {\n      window.delete(s[left]);\n      left++;\n    }\n    window.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n\n  return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lengthOfLongestSubstring(s: string): number {\n    const window = new Set<string>();\n    let left = 0;\n    let maxLen = 0;\n\n    for (let right = 0; right < s.length; right++) {\n        // Shrink window until duplicate is removed\n        while (window.has(s[right])) {\n            window.delete(s[left]);\n            left++;\n        }\n        window.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "check_char": [
        6
      ],
      "remove_char": [
        9
      ],
      "move_left": [
        10
      ],
      "add_char": [
        12
      ],
      "update_max": [
        13
      ],
      "keep_max": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "has_duplicate": [
        8
      ],
      "is_new_max": [
        13
      ]
    }
  }
};

const LongestSubstringWithoutRepeatingCharactersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s": "abcabcbb"
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s": "bbbbb"
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "s": "pwwkew"
    }
  }
];

function generateLongestSubstringWithoutRepeatingCharactersSteps(e: any): any[] {
  let t="string"==typeof e?.s?e.s:"",a=t.split(""),n=a.length,r={};a.forEach((e,t)=>{r[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let l=0,s=0,o=-1,d=0,c=new StepRecorder({s:t,max_len:0,left:0,char_set:[]},{...r}),h=(e={})=>{a.forEach((t,a)=>{let i;a===e.duplicate?i="duplicate":a===e.checking?i="checking":a<d&&(i="outside"),c.update_visual(`elem_${a}`,{type:"arrayElement",value:t,position:a,...i?{state:i}:{}})})},u=()=>{o>=0&&c.update_visual("maxRange",{type:"range",start:s,end:o,label:"max_len"})};if(c.record("-","Start of algorithm"),c.record("initialize","Try every starting index and extend while characters stay unique"),0===n)return c.record("complete","Empty string - longest substring has length 0"),c.getSteps();for(d=0;d<n;d++){let e=new Set;c.update_variable("left",d),c.update_variable("char_set",[]),c.update_visual("left",{type:"pointer",position:d,label:"left"}),c.update_visual("right",{type:"pointer",position:d,label:"right"}),c.add_conditional("for_start",!0),h({checking:d}),u(),c.record("start_window",`Start a fresh window at index ${d} ('${a[d]}')`);for(let t=d;t<n;t++){let i=a[t],n=e.has(i);if(c.update_variable("right",t),c.update_visual("right",{type:"pointer",position:t,label:"right"}),n){let e=a.indexOf(i,d);c.update_variable("dup_char",i),c.add_conditional("is_duplicate",!0),h({checking:t,duplicate:e}),u(),c.record("duplicate_found",`'${i}' already appears in this window - stop and restart from ${d+1}`);break}e.add(i),c.add_conditional("is_duplicate",!1),c.update_variable("char_set",Array.from(e)),c.update_variable("added_char",i),c.update_variable("dup_char",null),h({checking:t}),u(),c.record("extend",`'${i}' is new - window is "${a.slice(d,t+1).join("")}"`);let r=t-d+1,p=r>l;c.add_conditional("is_new_max",p),p?(l=r,s=d,o=t,c.update_variable("max_len",l),u(),c.record("update_max",`Length ${r} beats the previous best - max_len = ${l}`)):(u(),c.record("keep_max",`Length ${r} does not beat max_len = ${l}`))}}return c.add_conditional("for_start",!1),d=0,c.delete_visual("left"),c.delete_visual("right"),c.update_variable("added_char",null),c.update_variable("dup_char",null),a.forEach((e,t)=>{let a=t>=s&&t<=o;c.update_visual(`elem_${t}`,{type:"arrayElement",value:e,position:t,state:a?"in_max":"outside"})}),u(),c.record("complete",`Longest substring without repeating characters has length ${l}`),c.getSteps()
}

export function LongestSubstringWithoutRepeatingCharactersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestSubstringWithoutRepeatingCharactersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestSubstringWithoutRepeatingCharactersSteps(e) as any[];
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
      title="Longest Substring Without Repeating Characters"
      slug="longest-substring-without-repeating-characters"
      approaches={approaches}
      presets={LongestSubstringWithoutRepeatingCharactersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Window Substring (minimum-window-substring)
// ==========================================

const MinimumWindowSubstringTemplates = {
  "python": {
    "language": "python",
    "code": "def minWindow(s, t):\n    if len(t) > len(s):\n        return \"\"\n\n    # Frequency map for t\n    t_count = {}\n    for c in t:\n        t_count[c] = t_count.get(c, 0) + 1\n\n    required = len(t_count)  # Distinct chars in t that must be satisfied\n    formed = 0               # Distinct chars currently meeting required freq\n    window_count = {}\n\n    best_start, best_len = 0, float('inf')\n    left = 0\n\n    for right in range(len(s)):\n        c = s[right]\n        window_count[c] = window_count.get(c, 0) + 1\n\n        # Check if this character's frequency requirement is now met\n        if c in t_count and window_count[c] == t_count[c]:\n            formed += 1\n\n        # Shrink the window from the left while it remains valid\n        while formed == required:\n            if right - left + 1 < best_len:\n                best_start = left\n                best_len = right - left + 1\n\n            left_char = s[left]\n            window_count[left_char] -= 1\n            if left_char in t_count and window_count[left_char] < t_count[left_char]:\n                formed -= 1\n            left += 1\n\n    return \"\" if best_len == float('inf') else s[best_start:best_start + best_len]",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        8,
        10,
        11,
        12,
        14,
        15
      ],
      "expand_window": [
        17,
        18,
        19
      ],
      "char_satisfied": [
        23
      ],
      "update_min": [
        27,
        28,
        29
      ],
      "keep_min": [
        27
      ],
      "contract_window": [
        31,
        32
      ],
      "char_unsatisfied": [
        34
      ],
      "complete_with_valid_window": [
        37
      ],
      "move_left": [
        35
      ],
      "complete_with_invalid_window": [
        37
      ]
    },
    "conditionalMap": {
      "for_loop": [
        17
      ],
      "char_satisfied": [
        22
      ],
      "window_valid": [
        26
      ],
      "is_smaller_window": [
        27
      ],
      "char_unsatisfied": [
        33
      ],
      "complete_with_valid_window": [
        37
      ],
      "complete_with_invalid_window": [
        37
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String minWindow(String s, String t) {\n    int m = s.length(), n = t.length();\n    if (n > m) return \"\";\n\n    // Frequency map for t\n    Map<Character, Integer> tCount = new HashMap<>();\n    for (char c : t.toCharArray()) {\n        tCount.merge(c, 1, Integer::sum);\n    }\n\n    int required = tCount.size(); // Distinct chars in t that must be satisfied\n    int formed = 0;               // Distinct chars currently meeting required freq\n    Map<Character, Integer> windowCount = new HashMap<>();\n\n    int bestStart = 0, bestLen = Integer.MAX_VALUE;\n    int left = 0;\n\n    for (int right = 0; right < m; right++) {\n        char c = s.charAt(right);\n        windowCount.merge(c, 1, Integer::sum);\n\n        // Check if this character's frequency requirement is now met\n        if (tCount.containsKey(c) && windowCount.get(c).intValue() == tCount.get(c).intValue()) {\n            formed++;\n        }\n\n        // Shrink the window from the left while it remains valid\n        while (formed == required) {\n            if (right - left + 1 < bestLen) {\n                bestStart = left;\n                bestLen = right - left + 1;\n            }\n            char leftChar = s.charAt(left);\n            windowCount.merge(leftChar, -1, Integer::sum);\n            if (tCount.containsKey(leftChar) && windowCount.get(leftChar) < tCount.get(leftChar)) {\n                formed--;\n            }\n            left++;\n        }\n    }\n    return bestLen == Integer.MAX_VALUE ? \"\" : s.substring(bestStart, bestStart + bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        8,
        9,
        11,
        12,
        13,
        15,
        16
      ],
      "expand_window": [
        18,
        19,
        20
      ],
      "char_satisfied": [
        24
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "keep_min": [
        29
      ],
      "contract_window": [
        33,
        34
      ],
      "char_unsatisfied": [
        36
      ],
      "complete_with_valid_window": [
        41
      ],
      "move_left": [
        38
      ],
      "complete_with_invalid_window": [
        41
      ]
    },
    "conditionalMap": {
      "for_loop": [
        18
      ],
      "char_satisfied": [
        23
      ],
      "window_valid": [
        28
      ],
      "is_smaller_window": [
        29
      ],
      "char_unsatisfied": [
        35
      ],
      "complete_with_valid_window": [
        41
      ],
      "complete_with_invalid_window": [
        41
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string minWindow(string s, string t) {\n    int m = s.size(), n = t.size();\n    if (n > m) return \"\";\n\n    // Frequency map for t\n    unordered_map<char, int> tCount;\n    for (char c : t) tCount[c]++;\n\n    int required = tCount.size(); // Distinct chars in t that must be satisfied\n    int formed = 0;               // Distinct chars currently meeting required freq\n    unordered_map<char, int> windowCount;\n\n    int bestStart = 0, bestLen = INT_MAX;\n    int left = 0;\n\n    for (int right = 0; right < m; right++) {\n        char c = s[right];\n        windowCount[c]++;\n\n        // Check if this character's frequency requirement is now met\n        if (tCount.count(c) && windowCount[c] == tCount[c]) {\n            formed++;\n        }\n\n        // Shrink the window from the left while it remains valid\n        while (formed == required) {\n            if (right - left + 1 < bestLen) {\n                bestStart = left;\n                bestLen = right - left + 1;\n            }\n            char leftChar = s[left];\n            windowCount[leftChar]--;\n            if (tCount.count(leftChar) && windowCount[leftChar] < tCount[leftChar]) {\n                formed--;\n            }\n            left++;\n        }\n    }\n    return bestLen == INT_MAX ? \"\" : s.substr(bestStart, bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        9,
        10,
        11,
        13,
        14
      ],
      "expand_window": [
        16,
        17,
        18
      ],
      "char_satisfied": [
        22
      ],
      "update_min": [
        27,
        28,
        29
      ],
      "keep_min": [
        27
      ],
      "contract_window": [
        31,
        32
      ],
      "char_unsatisfied": [
        34
      ],
      "complete_with_valid_window": [
        39
      ],
      "move_left": [
        36
      ],
      "complete_with_invalid_window": [
        39
      ]
    },
    "conditionalMap": {
      "for_loop": [
        16
      ],
      "char_satisfied": [
        21
      ],
      "window_valid": [
        26
      ],
      "is_smaller_window": [
        27
      ],
      "char_unsatisfied": [
        33
      ],
      "complete_with_valid_window": [
        39
      ],
      "complete_with_invalid_window": [
        39
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string MinWindow(string s, string t) {\n    int m = s.Length, n = t.Length;\n    if (n > m) return \"\";\n\n    // Frequency map for t\n    var tCount = new Dictionary<char, int>();\n    foreach (char c in t) {\n        tCount[c] = tCount.GetValueOrDefault(c) + 1;\n    }\n\n    int required = tCount.Count; // Distinct chars in t that must be satisfied\n    int formed = 0;              // Distinct chars currently meeting required freq\n    var windowCount = new Dictionary<char, int>();\n\n    int bestStart = 0, bestLen = int.MaxValue;\n    int left = 0;\n\n    for (int right = 0; right < m; right++) {\n        char c = s[right];\n        windowCount[c] = windowCount.GetValueOrDefault(c) + 1;\n\n        // Check if this character's frequency requirement is now met\n        if (tCount.ContainsKey(c) && windowCount[c] == tCount[c]) {\n            formed++;\n        }\n\n        // Shrink the window from the left while it remains valid\n        while (formed == required) {\n            if (right - left + 1 < bestLen) {\n                bestStart = left;\n                bestLen = right - left + 1;\n            }\n            char leftChar = s[left];\n            windowCount[leftChar]--;\n            if (tCount.ContainsKey(leftChar) && windowCount[leftChar] < tCount[leftChar]) {\n                formed--;\n            }\n            left++;\n        }\n    }\n    return bestLen == int.MaxValue ? \"\" : s.Substring(bestStart, bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        8,
        9,
        11,
        12,
        13,
        15,
        16
      ],
      "expand_window": [
        18,
        19,
        20
      ],
      "char_satisfied": [
        24
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "keep_min": [
        29
      ],
      "contract_window": [
        33,
        34
      ],
      "char_unsatisfied": [
        36
      ],
      "complete_with_valid_window": [
        41
      ],
      "move_left": [
        38
      ],
      "complete_with_invalid_window": [
        41
      ]
    },
    "conditionalMap": {
      "for_loop": [
        18
      ],
      "char_satisfied": [
        23
      ],
      "window_valid": [
        28
      ],
      "is_smaller_window": [
        29
      ],
      "char_unsatisfied": [
        35
      ],
      "complete_with_valid_window": [
        41
      ],
      "complete_with_invalid_window": [
        41
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minWindow(s string, t string) string {\n    m, n := len(s), len(t)\n    if n > m {\n        return \"\"\n    }\n\n    // Frequency map for t\n    tCount := make(map[byte]int)\n    for i := 0; i < n; i++ {\n        tCount[t[i]]++\n    }\n\n    required := len(tCount) // Distinct chars in t that must be satisfied\n    formed := 0             // Distinct chars currently meeting required freq\n    windowCount := make(map[byte]int)\n\n    bestStart, bestLen := 0, m+1\n    left := 0\n\n    for right := 0; right < m; right++ {\n        c := s[right]\n        windowCount[c]++\n\n        // Check if this character's frequency requirement is now met\n        if cnt, ok := tCount[c]; ok && windowCount[c] == cnt {\n            formed++\n        }\n\n        // Shrink the window from the left while it remains valid\n        for formed == required {\n            if right-left+1 < bestLen {\n                bestStart = left\n                bestLen = right - left + 1\n            }\n            leftChar := s[left]\n            windowCount[leftChar]--\n            if cnt, ok := tCount[leftChar]; ok && windowCount[leftChar] < cnt {\n                formed--\n            }\n            left++\n        }\n    }\n    if bestLen > m {\n        return \"\"\n    }\n    return s[bestStart : bestStart+bestLen]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        8,
        9,
        10,
        13,
        14,
        15,
        17,
        18
      ],
      "expand_window": [
        20,
        21,
        22
      ],
      "char_satisfied": [
        26
      ],
      "update_min": [
        31,
        32,
        33
      ],
      "keep_min": [
        31
      ],
      "contract_window": [
        35,
        36
      ],
      "char_unsatisfied": [
        38
      ],
      "complete_with_valid_window": [
        46
      ],
      "move_left": [
        40
      ],
      "complete_with_invalid_window": [
        44
      ]
    },
    "conditionalMap": {
      "for_loop": [
        20
      ],
      "char_satisfied": [
        25
      ],
      "window_valid": [
        30
      ],
      "is_smaller_window": [
        31
      ],
      "char_unsatisfied": [
        37
      ],
      "complete_with_valid_window": [
        43
      ],
      "complete_with_invalid_window": [
        43
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minWindow(s, t) {\n    const m = s.length, n = t.length;\n    if (n > m) return \"\";\n\n    // Frequency map for t\n    const tCount = new Map();\n    for (const c of t) {\n        tCount.set(c, (tCount.get(c) || 0) + 1);\n    }\n\n    const required = tCount.size; // Distinct chars in t that must be satisfied\n    let formed = 0;               // Distinct chars currently meeting required freq\n    const windowCount = new Map();\n\n    let bestStart = 0, bestLen = Infinity;\n    let left = 0;\n\n    for (let right = 0; right < m; right++) {\n        const c = s[right];\n        windowCount.set(c, (windowCount.get(c) || 0) + 1);\n\n        // Check if this character's frequency requirement is now met\n        if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) {\n            formed++;\n        }\n\n        // Shrink the window from the left while it remains valid\n        while (formed === required) {\n            if (right - left + 1 < bestLen) {\n                bestStart = left;\n                bestLen = right - left + 1;\n            }\n            const leftChar = s[left];\n            windowCount.set(leftChar, windowCount.get(leftChar) - 1);\n            if (tCount.has(leftChar) && windowCount.get(leftChar) < tCount.get(leftChar)) {\n                formed--;\n            }\n            left++;\n        }\n    }\n    return bestLen === Infinity ? \"\" : s.substring(bestStart, bestStart + bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        8,
        9,
        11,
        12,
        13,
        15,
        16
      ],
      "expand_window": [
        18,
        19,
        20
      ],
      "char_satisfied": [
        24
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "keep_min": [
        29
      ],
      "contract_window": [
        33,
        34
      ],
      "char_unsatisfied": [
        36
      ],
      "complete_with_valid_window": [
        41
      ],
      "move_left": [
        38
      ],
      "complete_with_invalid_window": [
        41
      ]
    },
    "conditionalMap": {
      "for_loop": [
        18
      ],
      "char_satisfied": [
        23
      ],
      "window_valid": [
        28
      ],
      "is_smaller_window": [
        29
      ],
      "char_unsatisfied": [
        35
      ],
      "complete_with_valid_window": [
        41
      ],
      "complete_with_invalid_window": [
        41
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minWindow(s: string, t: string): string {\n    const m = s.length, n = t.length;\n    if (n > m) return \"\";\n\n    // Frequency map for t\n    const tCount = new Map<string, number>();\n    for (const c of t) {\n        tCount.set(c, (tCount.get(c) || 0) + 1);\n    }\n\n    const required = tCount.size; // Distinct chars in t that must be satisfied\n    let formed = 0;               // Distinct chars currently meeting required freq\n    const windowCount = new Map<string, number>();\n\n    let bestStart = 0, bestLen = Infinity;\n    let left = 0;\n\n    for (let right = 0; right < m; right++) {\n        const c = s[right];\n        windowCount.set(c, (windowCount.get(c) || 0) + 1);\n\n        // Check if this character's frequency requirement is now met\n        if (tCount.has(c) && windowCount.get(c) === tCount.get(c)) {\n            formed++;\n        }\n\n        // Shrink the window from the left while it remains valid\n        while (formed === required) {\n            if (right - left + 1 < bestLen) {\n                bestStart = left;\n                bestLen = right - left + 1;\n            }\n            const leftChar = s[left];\n            windowCount.set(leftChar, windowCount.get(leftChar)! - 1);\n            if (tCount.has(leftChar) && windowCount.get(leftChar)! < tCount.get(leftChar)!) {\n                formed--;\n            }\n            left++;\n        }\n    }\n    return bestLen === Infinity ? \"\" : s.substring(bestStart, bestStart + bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        6,
        7,
        8,
        9,
        11,
        12,
        13,
        15,
        16
      ],
      "expand_window": [
        18,
        19,
        20
      ],
      "char_satisfied": [
        24
      ],
      "update_min": [
        29,
        30,
        31
      ],
      "keep_min": [
        29
      ],
      "contract_window": [
        33,
        34
      ],
      "char_unsatisfied": [
        36
      ],
      "complete_with_valid_window": [
        41
      ],
      "move_left": [
        38
      ],
      "complete_with_invalid_window": [
        41
      ]
    },
    "conditionalMap": {
      "for_loop": [
        18
      ],
      "char_satisfied": [
        23
      ],
      "window_valid": [
        28
      ],
      "is_smaller_window": [
        29
      ],
      "char_unsatisfied": [
        35
      ],
      "complete_with_valid_window": [
        41
      ],
      "complete_with_invalid_window": [
        41
      ]
    }
  }
};

const MinimumWindowSubstringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s": "ADOBECODEBANC",
      "t": "ABC"
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s": "ZZYXXCCBBAABC",
      "t": "ABC"
    }
  },
  {
    "id": "ex3",
    "label": "Repeated",
    "value": {
      "s": "AABABCB",
      "t": "AAB"
    }
  },
  {
    "id": "ex4",
    "label": "No Window",
    "value": {
      "s": "AB",
      "t": "ABC"
    }
  }
];

function generateMinimumWindowSubstringSteps(t: any): any[] {
  let e=t.s,i=t.t,r=e.split(""),l=r.length,a=r.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),o={};for(let t of i)o[t]=(o[t]||0)+1;let s=Object.keys(o).length,d=new StepRecorder({s:e,t:i},{...a}),c=0,f=-1,h={},u=1/0,w=0,_=()=>{for(let t=0;t<l;t++){let e;if(t<c)e="outside";else if(t<=f){let i=r[t];e=void 0!==o[i]?(h[i]||0)>=o[i]?"target_sat":"target_def":"filler"}d.update_visual(`elem_${t}`,{type:"arrayElement",value:r[t],position:t,...e?{state:e}:{}})}};d.record("-","Start of algorithm"),d.add_new_variable("target_map",{...o}),d.add_new_variable("min_len","∞"),d.add_new_variable("left",c),d.add_new_variable("window_map",{}),d.add_new_variable("formed",0),d.add_new_variable("required",s),d.add_new_variable("covering",!1),d.update_visual("left",{type:"pointer",position:c,label:"left"}),d.record("initialize",`Target "${i}" needs ${s} distinct character${1===s?"":"s"}; check every start`);let m=()=>{u!==1/0&&d.update_visual("minWindow",{type:"range",start:w,end:w+u-1,label:"min"})};for(c=0;c<l;c++){h={};let t=0;f=c-1,d.update_variable("left",c),d.update_variable("window_map",{}),d.update_variable("formed",0),d.update_variable("covering",!1),d.update_visual("left",{type:"pointer",position:c,label:"left"});for(let n=c;n<l;n++){let l=r[n];f=n,h[l]=(h[l]||0)+1,d.update_variable("right",n),d.update_variable("char",l),d.update_variable("window_map",{...h}),d.update_variable("covering",t===s),d.update_visual("right",{type:"pointer",position:n,label:"right"}),_(),m(),d.record("expand_window",`right = ${n}: include '${l}'`),o[l]&&h[l]===o[l]&&t++;let a=n-c+1>=i.length,p=a&&t===s;if(d.update_variable("formed",t),d.update_variable("covering",p),d.add_conditional("window_covers",p),_(),m(),d.record("window_covers",p?`window "${e.substring(c,n+1)}" contains every character of "${i}"`:a?`window "${e.substring(c,n+1)}" is long enough but still missing characters of "${i}"`:`window is shorter than "${i}", it cannot cover it yet`),p){let t=n-c+1,r=t<u;d.add_conditional("is_smaller_window",r),r?(u=t,w=c,d.update_variable("min_len",u),d.update_variable("covering",!0),d.update_visual("minWindow",{type:"range",start:w,end:w+u-1,label:"min"}),_(),d.record("update_min",`window covers "${i}", size ${t} < min: new best "${e.substring(c,n+1)}"`)):(_(),m(),d.record("keep_min",`window size ${t} ≥ min ${u}: keep best`));break}}}if(d.delete_visual("left"),d.delete_visual("right"),d.update_variable("right",l-1),d.delete_variable("char"),u===1/0){for(let t=0;t<l;t++)d.update_visual(`elem_${t}`,{type:"arrayElement",value:r[t],position:t});d.update_variable("min_len","∞"),d.record("complete_with_invalid_window",`No window contains all of "${i}"`)}else{for(let t=0;t<l;t++){let e=t>=w&&t<=w+u-1;d.update_visual(`elem_${t}`,{type:"arrayElement",value:r[t],position:t,...e?{state:"in_max"}:{}})}d.update_variable("min_len",u),d.update_visual("minWindow",{type:"range",start:w,end:w+u-1,label:"min"}),d.record("complete_with_valid_window",`Minimum window = "${e.substring(w,w+u)}" (length ${u})`)}return d.getSteps()
}

export function MinimumWindowSubstringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumWindowSubstringTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMinimumWindowSubstringSteps(t) as any[];
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
      title="Minimum Window Substring"
      slug="minimum-window-substring"
      approaches={approaches}
      presets={MinimumWindowSubstringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Continuous Subarrays (continuous-subarrays)
// ==========================================

const ContinuousSubarraysTemplates = {
  "python": {
    "language": "python",
    "code": "def continuousSubarrays(nums):\n    count = 0\n    for i in range(len(nums)):\n        lo = hi = nums[i]\n        for j in range(i, len(nums)):\n            lo = min(lo, nums[j])\n            hi = max(hi, nums[j])\n            if hi - lo > 2:\n                break\n            count += 1\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public long continuousSubarrays(int[] nums) {\n    long count = 0;\n    for (int i = 0; i < nums.length; i++) {\n        int lo = nums[i], hi = nums[i];\n        for (int j = i; j < nums.length; j++) {\n            lo = Math.min(lo, nums[j]);\n            hi = Math.max(hi, nums[j]);\n            if (hi - lo > 2) {\n                break;\n            }\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "long long continuousSubarrays(vector<int>& nums) {\n    long long count = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        int lo = nums[i], hi = nums[i];\n        for (int j = i; j < nums.size(); j++) {\n            lo = min(lo, nums[j]);\n            hi = max(hi, nums[j]);\n            if (hi - lo > 2) {\n                break;\n            }\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public long ContinuousSubarrays(int[] nums) {\n    long count = 0;\n    for (int i = 0; i < nums.Length; i++) {\n        int lo = nums[i], hi = nums[i];\n        for (int j = i; j < nums.Length; j++) {\n            lo = Math.Min(lo, nums[j]);\n            hi = Math.Max(hi, nums[j]);\n            if (hi - lo > 2) {\n                break;\n            }\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func continuousSubarrays(nums []int) int64 {\n    var count int64\n    for i := 0; i < len(nums); i++ {\n        lo, hi := nums[i], nums[i]\n        for j := i; j < len(nums); j++ {\n            lo = min(lo, nums[j])\n            hi = max(hi, nums[j])\n            if hi-lo > 2 {\n                break\n            }\n            count++\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function continuousSubarrays(nums) {\n    let count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let lo = nums[i], hi = nums[i];\n        for (let j = i; j < nums.length; j++) {\n            lo = Math.min(lo, nums[j]);\n            hi = Math.max(hi, nums[j]);\n            if (hi - lo > 2) {\n                break;\n            }\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function continuousSubarrays(nums: number[]): number {\n    let count = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let lo = nums[i], hi = nums[i];\n        for (let j = i; j < nums.length; j++) {\n            lo = Math.min(lo, nums[j]);\n            hi = Math.max(hi, nums[j]);\n            if (hi - lo > 2) {\n                break;\n            }\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_window": [
        4
      ],
      "extend": [
        6,
        7
      ],
      "break_out": [
        9
      ],
      "count_it": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "spread_ok": [
        8
      ]
    }
  }
};

const ContinuousSubarraysPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        5,
        4,
        2,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Longer",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5,
        3,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Tight",
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

function generateContinuousSubarraysSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,l=new StepRecorder({}),a=0,r=(e,n,i={},r)=>{for(let[e,n]of(l.update_variable("nums",t),l.update_variable("count",a),Object.entries(i)))l.update_variable(e,n);void 0!==r&&l.add_conditional("spread_ok",r),l.record(e,n)};r("-","Start: try every start index and stretch it while max - min stays within 2",{i:-1,j:-1,lo:null,hi:null,spread:null,result:null});for(let e=0;e<n;e++){r("start_window",`Start at i = ${e}, value ${t[e]}`,{i:e,j:e,lo:t[e],hi:t[e],spread:0,added:null,broke:!1});let i=t[e],l=t[e];for(let o=e;o<n;o++){i=Math.min(i,t[o]);let n=(l=Math.max(l,t[o]))-i,u=n<=2;if(r("extend",`Extend to j = ${o}: min ${i}, max ${l}, spread ${n}`,{i:e,j:o,lo:i,hi:l,spread:n,added:null,broke:!1},u),!u){r("break_out",`Spread ${n} is more than 2, so no longer start-${e} window can work`,{i:e,j:o,lo:i,hi:l,spread:n,broke:!0});break}a++,r("count_it",`[${e}..${o}] is continuous, count = ${a}`,{i:e,j:o,lo:i,hi:l,spread:n,added:1,broke:!1})}}return r("complete",`Total continuous subarrays = ${a}`,{i:-1,j:-1,lo:null,hi:null,spread:null,added:null,broke:!1,result:a}),l.getSteps()
}

export function ContinuousSubarraysProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContinuousSubarraysTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContinuousSubarraysSteps(e) as any[];
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
      title="Continuous Subarrays"
      slug="continuous-subarrays"
      approaches={approaches}
      presets={ContinuousSubarraysPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Number of Nice Subarrays (count-number-of-nice-subarrays)
// ==========================================

const CountNumberOfNiceSubarraysTemplates = {
  "python": {
    "language": "python",
    "code": "def numberOfSubarrays(nums, k):\n    def at_most(k):\n        left = 0\n        count = 0\n\n        for right in range(len(nums)):\n            # Consume an odd number from our budget\n            if nums[right] % 2 != 0:\n                k -= 1\n            # Shrink window until we have at most k odd numbers\n            while k < 0:\n                if nums[left] % 2 != 0:\n                    k += 1\n                left += 1\n            # All subarrays ending at right, starting from left to right, are valid\n            count += right - left + 1\n\n        return count\n\n    return at_most(k) - at_most(k - 1)",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4
      ],
      "expand": [
        6
      ],
      "check_odd": [
        8,
        9
      ],
      "shrink": [
        12,
        13
      ],
      "move_left": [
        14
      ],
      "add_count": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_odd": [
        8
      ],
      "k_negative": [
        11
      ],
      "left_is_odd": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int numberOfSubarrays(int[] nums, int k) {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nprivate int atMost(int[] nums, int k) {\n    int left = 0;\n    int count = 0;\n\n    for (int right = 0; right < nums.length; right++) {\n        // Consume an odd number from our budget\n        if (nums[right] % 2 != 0) {\n            k--;\n        }\n        // Shrink window until we have at most k odd numbers\n        while (k < 0) {\n            if (nums[left] % 2 != 0) {\n                k++;\n            }\n            left++;\n        }\n        // All subarrays ending at right, starting from left to right, are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7
      ],
      "expand": [
        9
      ],
      "check_odd": [
        11,
        12
      ],
      "shrink": [
        16,
        17
      ],
      "move_left": [
        19
      ],
      "add_count": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_odd": [
        11
      ],
      "k_negative": [
        15
      ],
      "left_is_odd": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int numberOfSubarrays(vector<int>& nums, int k) {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nint atMost(vector<int>& nums, int k) {\n    int left = 0;\n    int count = 0;\n\n    for (int right = 0; right < nums.size(); right++) {\n        // Consume an odd number from our budget\n        if (nums[right] % 2 != 0) {\n            k--;\n        }\n        // Shrink window until we have at most k odd numbers\n        while (k < 0) {\n            if (nums[left] % 2 != 0) {\n                k++;\n            }\n            left++;\n        }\n        // All subarrays ending at right, starting from left to right, are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7
      ],
      "expand": [
        9
      ],
      "check_odd": [
        11,
        12
      ],
      "shrink": [
        16,
        17
      ],
      "move_left": [
        19
      ],
      "add_count": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_odd": [
        11
      ],
      "k_negative": [
        15
      ],
      "left_is_odd": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int NumberOfSubarrays(int[] nums, int k) {\n    return AtMost(nums, k) - AtMost(nums, k - 1);\n}\n\nprivate int AtMost(int[] nums, int k) {\n    int left = 0;\n    int count = 0;\n\n    for (int right = 0; right < nums.Length; right++) {\n        // Consume an odd number from our budget\n        if (nums[right] % 2 != 0) {\n            k--;\n        }\n        // Shrink window until we have at most k odd numbers\n        while (k < 0) {\n            if (nums[left] % 2 != 0) {\n                k++;\n            }\n            left++;\n        }\n        // All subarrays ending at right, starting from left to right, are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7
      ],
      "expand": [
        9
      ],
      "check_odd": [
        11,
        12
      ],
      "shrink": [
        16,
        17
      ],
      "move_left": [
        19
      ],
      "add_count": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_odd": [
        11
      ],
      "k_negative": [
        15
      ],
      "left_is_odd": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numberOfSubarrays(nums []int, k int) int {\n    return atMost(nums, k) - atMost(nums, k - 1)\n}\n\nfunc atMost(nums []int, k int) int {\n    left := 0\n    count := 0\n\n    for right := 0; right < len(nums); right++ {\n        // Consume an odd number from our budget\n        if nums[right] % 2 != 0 {\n            k--\n        }\n        // Shrink window until we have at most k odd numbers\n        for k < 0 {\n            if nums[left] % 2 != 0 {\n                k++\n            }\n            left++\n        }\n        // All subarrays ending at right, starting from left to right, are valid\n        count += right - left + 1\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7
      ],
      "expand": [
        9
      ],
      "check_odd": [
        11,
        12
      ],
      "shrink": [
        16,
        17
      ],
      "move_left": [
        19
      ],
      "add_count": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_odd": [
        11
      ],
      "k_negative": [
        15
      ],
      "left_is_odd": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numberOfSubarrays(nums, k) {\n  return atMost(nums, k) - atMost(nums, k - 1);\n}\nfunction atMost(nums, k) {\n  let left = 0;\n  let count = 0;\n\n  for (let right = 0; right < nums.length; right++) {\n    // Consume an odd number from our budget\n    if (nums[right] % 2 !== 0) {\n      k--;\n    }\n    // Shrink window until we have at most k odd numbers\n    while (k < 0) {\n      if (nums[left] % 2 !== 0) {\n        k++;\n      }\n      left++;\n    }\n    // All subarrays ending at right, starting from left to right, are valid\n    count += right - left + 1;\n  }\n\n  return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6
      ],
      "expand": [
        8
      ],
      "check_odd": [
        10,
        11
      ],
      "shrink": [
        15,
        16
      ],
      "move_left": [
        18
      ],
      "add_count": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_odd": [
        10
      ],
      "k_negative": [
        14
      ],
      "left_is_odd": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numberOfSubarrays(nums: number[], k: number): number {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nfunction atMost(nums: number[], k: number): number {\n    let left = 0;\n    let count = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        // Consume an odd number from our budget\n        if (nums[right] % 2 !== 0) {\n            k--;\n        }\n        // Shrink window until we have at most k odd numbers\n        while (k < 0) {\n            if (nums[left] % 2 !== 0) {\n                k++;\n            }\n            left++;\n        }\n        // All subarrays ending at right, starting from left to right, are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7
      ],
      "expand": [
        9
      ],
      "check_odd": [
        11,
        12
      ],
      "shrink": [
        16,
        17
      ],
      "move_left": [
        19
      ],
      "add_count": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_odd": [
        11
      ],
      "k_negative": [
        15
      ],
      "left_is_odd": [
        16
      ]
    }
  }
};

const CountNumberOfNiceSubarraysPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        1,
        2,
        1,
        1
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "All Even",
    "value": {
      "nums": [
        2,
        4,
        6
      ],
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Example 2",
    "value": {
      "nums": [
        2,
        2,
        2,
        1,
        2,
        2,
        1,
        2,
        2,
        2
      ],
      "k": 2
    }
  }
];

function generateCountNumberOfNiceSubarraysSteps(e: any): any[] {
  let t=e.nums,n=e.k,r=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),a=0,l=0,d={0:1},o={0:-1},s=new StepRecorder({nums:t,k:n},{...r});s.record("-","Start: count subarrays with exactly k odd numbers"),s.add_new_variable("oddSoFar",0),s.add_new_variable("count",l),s.add_new_variable("map",{...d}),s.add_new_variable("i",-1),s.add_new_variable("prev",0),s.add_new_variable("hit",!1),s.add_new_variable("matches",0),s.add_new_variable("oldCount",0),s.add_new_variable("rangeStart",-1),s.add_new_variable("rangeEnd",-1),s.record("initialize","Initialize oddSoFar = 0, count = 0, map = {0: 1} (empty prefix seen once)");for(let e=0;e<t.length;e++){let i=t[e],r=i%2!=0,u=a,c=(a+=+!!r)-n;if(s.update_variable("i",e),s.update_variable("prev",u),s.update_variable("oddSoFar",a),s.update_variable("curr",i),s.update_variable("curr_odd",r),s.update_variable("target",c),s.update_visual("curr",{type:"pointer",position:e,label:"curr"}),s.record("add_curr",`${i} is ${r?"odd":"even"}, oddSoFar = ${u} + ${+!!r} = ${a}, look for target = oddSoFar - k = ${c}`),void 0!==d[c]){let t=d[c],n=o[c]+1,i=e,r=l;l+=t,s.add_conditional("target_in_map",!0),s.update_variable("hit",!0),s.update_variable("matches",t),s.update_variable("oldCount",r),s.update_variable("count",l),s.update_variable("rangeStart",n),s.update_variable("rangeEnd",i),s.record("increment_count",`map has ${c}: ${t} ${1===t?"subarray ends":"subarrays end"} here, count = ${r} + ${t} = ${l}`)}else s.add_conditional("target_not_in_map",!1),s.update_variable("hit",!1),s.record("found_target",`target ${c} is not in the map, no subarray ends here`);d[a]=(d[a]||0)+1,o[a]=e,s.update_variable("map",{...d}),s.update_variable("rangeStart",-1),s.update_variable("rangeEnd",-1),s.record("update_hashmap",`Record this prefix: map[${a}] = ${d[a]}`)}return s.delete_variable("curr"),s.delete_variable("target"),s.delete_visual("curr"),s.record("return_count",`Return count = ${l}`),s.getSteps()
}

export function CountNumberOfNiceSubarraysProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountNumberOfNiceSubarraysTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountNumberOfNiceSubarraysSteps(e) as any[];
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
      title="Count Number of Nice Subarrays"
      slug="count-number-of-nice-subarrays"
      approaches={approaches}
      presets={CountNumberOfNiceSubarraysPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Subarrays With Fixed Bounds (count-subarrays-with-fixed-bounds)
// ==========================================

const CountSubarraysWithFixedBoundsTemplates = {
  "python": {
    "language": "python",
    "code": "def countSubarrays(nums, minK, maxK):\n    count = 0\n    last_min = -1  # Last index where nums[i] == minK\n    last_max = -1  # Last index where nums[i] == maxK\n    last_bad = -1  # Last index where nums[i] is out of [minK, maxK]\n\n    for i, num in enumerate(nums):\n        # Update position trackers\n        if num < minK or num > maxK:\n            last_bad = i\n        if num == minK:\n            last_min = i\n        if num == maxK:\n            last_max = i\n\n        # Count valid subarrays ending at i\n        valid_start = min(last_min, last_max) - last_bad\n        if valid_start > 0:\n            count += valid_start\n\n    return count",
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
      "classify": [
        9,
        10,
        11,
        12,
        13
      ],
      "add_count": [
        18,
        19
      ],
      "no_count": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        11
      ],
      "is_max": [
        13
      ],
      "valid_start_positive": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public long countSubarrays(int[] nums, int minK, int maxK) {\n    long count = 0;\n    int lastMin = -1;  // Last index where nums[i] == minK\n    int lastMax = -1;  // Last index where nums[i] == maxK\n    int lastBad = -1;  // Last index where nums[i] is out of [minK, maxK]\n\n    for (int i = 0; i < nums.length; i++) {\n        // Update position trackers\n        if (nums[i] < minK || nums[i] > maxK) {\n            lastBad = i;\n        }\n        if (nums[i] == minK) {\n            lastMin = i;\n        }\n        if (nums[i] == maxK) {\n            lastMax = i;\n        }\n\n        // Count valid subarrays ending at i\n        int validStart = Math.min(lastMin, lastMax) - lastBad;\n        if (validStart > 0) {\n            count += validStart;\n        }\n    }\n\n    return count;\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "long long countSubarrays(vector<int>& nums, int minK, int maxK) {\n    long long count = 0;\n    int lastMin = -1;  // Last index where nums[i] == minK\n    int lastMax = -1;  // Last index where nums[i] == maxK\n    int lastBad = -1;  // Last index where nums[i] is out of [minK, maxK]\n\n    for (int i = 0; i < (int)nums.size(); i++) {\n        // Update position trackers\n        if (nums[i] < minK || nums[i] > maxK) {\n            lastBad = i;\n        }\n        if (nums[i] == minK) {\n            lastMin = i;\n        }\n        if (nums[i] == maxK) {\n            lastMax = i;\n        }\n\n        // Count valid subarrays ending at i\n        int validStart = min(lastMin, lastMax) - lastBad;\n        if (validStart > 0) {\n            count += validStart;\n        }\n    }\n\n    return count;\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public long CountSubarrays(int[] nums, int minK, int maxK) {\n    long count = 0;\n    int lastMin = -1;  // Last index where nums[i] == minK\n    int lastMax = -1;  // Last index where nums[i] == maxK\n    int lastBad = -1;  // Last index where nums[i] is out of [minK, maxK]\n\n    for (int i = 0; i < nums.Length; i++) {\n        // Update position trackers\n        if (nums[i] < minK || nums[i] > maxK) {\n            lastBad = i;\n        }\n        if (nums[i] == minK) {\n            lastMin = i;\n        }\n        if (nums[i] == maxK) {\n            lastMax = i;\n        }\n\n        // Count valid subarrays ending at i\n        int validStart = Math.Min(lastMin, lastMax) - lastBad;\n        if (validStart > 0) {\n            count += validStart;\n        }\n    }\n\n    return count;\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countSubarrays(nums []int, minK int, maxK int) int64 {\n    var count int64\n    lastMin := -1  // Last index where nums[i] == minK\n    lastMax := -1  // Last index where nums[i] == maxK\n    lastBad := -1  // Last index where nums[i] is out of [minK, maxK]\n\n    for i, num := range nums {\n        // Update position trackers\n        if num < minK || num > maxK {\n            lastBad = i\n        }\n        if num == minK {\n            lastMin = i\n        }\n        if num == maxK {\n            lastMax = i\n        }\n\n        // Count valid subarrays ending at i\n        validStart := min(lastMin, lastMax) - lastBad\n        if validStart > 0 {\n            count += int64(validStart)\n        }\n    }\n\n    return count\n}\n\nfunc min(a, b int) int {\n    if a < b {\n        return a\n    }\n    return b\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function countSubarrays(nums, minK, maxK) {\n  let count = 0;\n  let lastMin = -1; // Last index where nums[i] == minK\n  let lastMax = -1; // Last index where nums[i] == maxK\n  let lastBad = -1; // Last index where nums[i] is out of [minK, maxK]\n\n  for (let i = 0; i < nums.length; i++) {\n    // Update position trackers\n    if (nums[i] < minK || nums[i] > maxK) {\n      lastBad = i;\n    }\n    if (nums[i] === minK) {\n      lastMin = i;\n    }\n    if (nums[i] === maxK) {\n      lastMax = i;\n    }\n\n    // Count valid subarrays ending at i\n    const validStart = Math.min(lastMin, lastMax) - lastBad;\n    if (validStart > 0) {\n      count += validStart;\n    }\n  }\n\n  return count;\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countSubarrays(nums: number[], minK: number, maxK: number): number {\n    let count = 0;\n    let lastMin = -1;  // Last index where nums[i] == minK\n    let lastMax = -1;  // Last index where nums[i] == maxK\n    let lastBad = -1;  // Last index where nums[i] is out of [minK, maxK]\n\n    for (let i = 0; i < nums.length; i++) {\n        // Update position trackers\n        if (nums[i] < minK || nums[i] > maxK) {\n            lastBad = i;\n        }\n        if (nums[i] === minK) {\n            lastMin = i;\n        }\n        if (nums[i] === maxK) {\n            lastMax = i;\n        }\n\n        // Count valid subarrays ending at i\n        const validStart = Math.min(lastMin, lastMax) - lastBad;\n        if (validStart > 0) {\n            count += validStart;\n        }\n    }\n\n    return count;\n}",
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
      "classify": [
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "add_count": [
        21,
        22
      ],
      "no_count": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_bad": [
        9
      ],
      "is_min": [
        12
      ],
      "is_max": [
        15
      ],
      "valid_start_positive": [
        21
      ]
    }
  }
};

const CountSubarraysWithFixedBoundsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        3,
        5,
        2,
        7,
        5
      ],
      "minK": 1,
      "maxK": 5
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        1,
        1,
        1
      ],
      "minK": 1,
      "maxK": 1
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        3,
        1,
        4,
        1,
        5
      ],
      "minK": 1,
      "maxK": 5
    }
  }
];

function generateCountSubarraysWithFixedBoundsSteps(t: any): any[] {
  let a=t=>t<0?`(${t})`:`${t}`;
let e=[...t.nums],n=t.minK,r=t.maxK,l=e.length,s=e.reduce((t,e,n)=>(t[`bar_${n}`]={type:"arrayElement",value:e,position:n},t),{}),o=new StepRecorder({nums:[...e],minK:n,maxK:r},{...s}),u=t=>o.update_variable("exprParts",t);o.record("-",`Count subarrays whose min is ${n} and max is ${r}`);let d=0,c=-1,m=-1,x=-1;o.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),o.add_new_visual("ptr_lastMin",{type:"pointer",position:-.5,label:"lastMin"}),o.add_new_visual("ptr_lastMax",{type:"pointer",position:-.5,label:"lastMax"}),o.add_new_visual("ptr_lastBad",{type:"pointer",position:-.5,label:"lastBad"});let p=(t,e)=>{o.update_variable("count",d),o.update_variable("lastMin",c),o.update_variable("lastMax",m),o.update_variable("lastBad",x),o.update_visual("ptr_lastMin",{type:"pointer",position:c<0?-.5:c,label:"lastMin"}),o.update_visual("ptr_lastMax",{type:"pointer",position:m<0?-.5:m,label:"lastMax"}),o.update_visual("ptr_lastBad",{type:"pointer",position:x<0?-.5:x,label:"lastBad"}),o.record(t,e)};u([{t:"lastMin = lastMax = lastBad = -1",c:"muted"},{t:"   nothing seen yet",c:"muted"}]),p("init","count = 0, lastMin = lastMax = lastBad = -1");for(let t=0;t<l;t++){o.update_visual("ptr_i",{type:"pointer",position:t,label:"i"}),o.update_variable("i",t);let i=e[t]<n||e[t]>r,l=e[t]===n,s=e[t]===r;o.add_conditional("is_bad",i),o.add_conditional("is_min",l),o.add_conditional("is_max",s),i?(x=t,u([{t:`nums[${t}] = ${e[t]}`,c:"red"},{t:e[t]<n?"  <  minK":"  >  maxK",c:"muted"},{t:`  →  lastBad = ${t}`,c:"red"}]),p("classify",`nums[${t}] = ${e[t]} is out of [${n}, ${r}]: lastBad = ${t}`)):l&&s?(c=t,m=t,u([{t:`nums[${t}] = ${e[t]}`,c:"green"},{t:"  == minK == maxK",c:"muted"},{t:`  →  lastMin = lastMax = ${t}`,c:"green"}]),p("classify",`nums[${t}] = ${e[t]} is both minK and maxK`)):l?(c=t,u([{t:`nums[${t}] = ${e[t]}`,c:"cyan"},{t:"  == minK",c:"muted"},{t:`  →  lastMin = ${t}`,c:"cyan"}]),p("classify",`nums[${t}] = ${e[t]} == minK: lastMin = ${t}`)):s?(m=t,u([{t:`nums[${t}] = ${e[t]}`,c:"yellow"},{t:"  == maxK",c:"muted"},{t:`  →  lastMax = ${t}`,c:"yellow"}]),p("classify",`nums[${t}] = ${e[t]} == maxK: lastMax = ${t}`)):(u([{t:`nums[${t}] = ${e[t]}`,c:"plain"},{t:"  in range, not min or max",c:"muted"}]),p("classify",`nums[${t}] = ${e[t]} is in range but not minK or maxK`));let f=Math.min(c,m),h=f-x,g=h>0;o.add_conditional("valid_start_positive",g),g?(d+=h,o.update_variable("bandLo",x+1),o.update_variable("bandHi",f),u([{t:"min(",c:"muted"},{t:String(c),c:"cyan"},{t:", ",c:"muted"},{t:String(m),c:"yellow"},{t:") - ",c:"muted"},{t:a(x),c:"red"},{t:" = ",c:"muted"},{t:String(h),c:"green"},{t:"  →  count += ",c:"muted"},{t:String(h),c:"green"}]),p("add_count",`${h} valid start${1===h?"":"s"}: count = ${d}`),o.delete_variable("bandLo"),o.delete_variable("bandHi")):(u([{t:"min(",c:"muted"},{t:String(c),c:"cyan"},{t:", ",c:"muted"},{t:String(m),c:"yellow"},{t:") - ",c:"muted"},{t:a(x),c:"red"},{t:" = ",c:"muted"},{t:String(h),c:"yellow"},{t:" ≤ 0  →  no subarray ends here",c:"muted"}]),p("no_count",`validStart = ${h} <= 0: nothing to add`))}return o.update_visual("ptr_i",{type:"pointer",position:l-1,label:"i",state:"exiting"}),o.update_visual("ptr_lastMin",{type:"pointer",position:c<0?-.5:c,label:"lastMin",state:"exiting"}),o.update_visual("ptr_lastMax",{type:"pointer",position:m<0?-.5:m,label:"lastMax",state:"exiting"}),o.update_visual("ptr_lastBad",{type:"pointer",position:x<0?-.5:x,label:"lastBad",state:"exiting"}),o.update_variable("done",!0),u([]),o.update_variable("count",d),o.record("complete",`Return ${d} fixed-bound subarrays`),o.getSteps()
}

export function CountSubarraysWithFixedBoundsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountSubarraysWithFixedBoundsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateCountSubarraysWithFixedBoundsSteps(t) as any[];
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
      title="Count Subarrays With Fixed Bounds"
      slug="count-subarrays-with-fixed-bounds"
      approaches={approaches}
      presets={CountSubarraysWithFixedBoundsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Frequency of the Most Frequent Element (frequency-of-the-most-frequent-element)
// ==========================================

const FrequencyOfTheMostFrequentElementTemplates = {
  "python": {
    "language": "python",
    "code": "def maxFrequency(nums, k):\n    nums.sort()\n    left = 0\n    max_freq = 0\n    window_sum = 0\n\n    for right in range(len(nums)):\n        window_sum += nums[right]\n\n        # Shrink window if cost exceeds budget\n        while nums[right] * (right - left + 1) - window_sum > k:\n            window_sum -= nums[left]\n            left += 1\n\n        max_freq = max(max_freq, right - left + 1)\n\n    return max_freq",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        15
      ],
      "keep_max": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxFrequency(int[] nums, int k) {\n    Arrays.sort(nums);\n    int left = 0;\n    int maxFreq = 0;\n    long windowSum = 0;\n\n    for (int right = 0; right < nums.length; right++) {\n        windowSum += nums[right];\n\n        // Shrink window if cost exceeds budget\n        while ((long) nums[right] * (right - left + 1) - windowSum > k) {\n            windowSum -= nums[left];\n            left++;\n        }\n\n        maxFreq = Math.max(maxFreq, right - left + 1);\n    }\n\n    return maxFreq;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxFrequency(vector<int>& nums, int k) {\n    sort(nums.begin(), nums.end());\n    int left = 0;\n    int maxFreq = 0;\n    long long windowSum = 0;\n\n    for (int right = 0; right < nums.size(); right++) {\n        windowSum += nums[right];\n\n        // Shrink window if cost exceeds budget\n        while ((long long)nums[right] * (right - left + 1) - windowSum > k) {\n            windowSum -= nums[left];\n            left++;\n        }\n\n        maxFreq = max(maxFreq, right - left + 1);\n    }\n\n    return maxFreq;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxFrequency(int[] nums, int k) {\n    Array.Sort(nums);\n    int left = 0;\n    int maxFreq = 0;\n    long windowSum = 0;\n\n    for (int right = 0; right < nums.Length; right++) {\n        windowSum += nums[right];\n\n        // Shrink window if cost exceeds budget\n        while ((long)nums[right] * (right - left + 1) - windowSum > k) {\n            windowSum -= nums[left];\n            left++;\n        }\n\n        maxFreq = Math.Max(maxFreq, right - left + 1);\n    }\n\n    return maxFreq;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxFrequency(nums []int, k int) int {\n    sort.Ints(nums)\n    left := 0\n    maxFreq := 0\n    windowSum := 0\n\n    for right := 0; right < len(nums); right++ {\n        windowSum += nums[right]\n\n        // Shrink window if cost exceeds budget\n        for nums[right]*(right-left+1)-windowSum > k {\n            windowSum -= nums[left]\n            left++\n        }\n\n        if right-left+1 > maxFreq {\n            maxFreq = right - left + 1\n        }\n    }\n\n    return maxFreq\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxFrequency(nums, k) {\n  nums.sort((a, b) => a - b);\n  let left = 0;\n  let maxFreq = 0;\n  let windowSum = 0;\n\n  for (let right = 0; right < nums.length; right++) {\n    windowSum += nums[right];\n\n    // Shrink window if cost exceeds budget\n    while (nums[right] * (right - left + 1) - windowSum > k) {\n      windowSum -= nums[left];\n      left++;\n    }\n\n    maxFreq = Math.max(maxFreq, right - left + 1);\n  }\n\n  return maxFreq;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxFrequency(nums: number[], k: number): number {\n    nums.sort((a, b) => a - b);\n    let left = 0;\n    let maxFreq = 0;\n    let windowSum = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        windowSum += nums[right];\n\n        // Shrink window if cost exceeds budget\n        while (nums[right] * (right - left + 1) - windowSum > k) {\n            windowSum -= nums[left];\n            left++;\n        }\n\n        maxFreq = Math.max(maxFreq, right - left + 1);\n    }\n\n    return maxFreq;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "expand": [
        7,
        8
      ],
      "check_cost": [
        11
      ],
      "shrink": [
        12
      ],
      "move_left": [
        13
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "cost_exceeds": [
        11
      ],
      "is_new_max": [
        16
      ]
    }
  }
};

const FrequencyOfTheMostFrequentElementPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        4
      ],
      "k": 5
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        4,
        8,
        13
      ],
      "k": 5
    }
  },
  {
    "id": "ex3",
    "label": "Unsorted",
    "value": {
      "nums": [
        3,
        9,
        6
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "Longer",
    "value": {
      "nums": [
        9,
        4,
        8,
        2,
        4,
        6,
        4
      ],
      "k": 6
    }
  }
];

function generateFrequencyOfTheMostFrequentElementSteps(e: any): any[] {
  let t=[...e.nums],i=e.k,r=t.length,l=new StepRecorder({nums:[...t],k:i},{});for(let e=0;e<r;e++)l.add_new_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});l.add_new_variable("k",i),l.record("-","Start of algorithm");let a=t.map((e,t)=>({val:e,idx:t})).sort((e,t)=>e.val-t.val||e.idx-t.idx),s=a.map(e=>e.val);a.forEach((e,t)=>{l.update_visual(`elem_${e.idx}`,{type:"arrayElement",value:e.val,position:t})}),l.update_variable("nums",[...s]),l.record("sort","Sort the array in ascending order");let o=e=>`elem_${a[e].idx}`,d=(e,t,i=-1)=>{for(let n=0;n<r;n++){let r=n===i?"checking":n<e||n>t?"outside":void 0;l.update_visual(o(n),{type:"arrayElement",value:s[n],position:n,...r?{state:r}:{}})}},c=1,x=0,u=r>0?0:-1;l.add_new_variable("maxFreq",c),l.add_new_variable("cost",0),l.add_new_variable("count",1),l.record("init","Initialize maxFreq = 1, then extend left from every index");let h=()=>{u>=0&&l.update_visual("maxRange",{type:"range",start:x,end:u,label:"maxFreq"})};for(let e=1;e<r;e++){let t=0,n=1,r=s[e];l.update_variable("right",e),l.update_variable("target",r),l.update_variable("cost",t),l.update_variable("count",n),l.update_variable("invalid",!1),l.update_visual("right",{type:"pointer",position:e,label:"right"}),l.update_visual("left",{type:"pointer",position:e,label:"left"});for(let a=e-1;a>=0;a--){let o=r-s[a];t+=o,l.update_variable("left",a),l.update_variable("addedVal",o),l.update_variable("cost",t),l.update_variable("invalid",!1),l.update_visual("left",{type:"pointer",position:a,label:"left"}),d(a,e,a),h(),l.record("expand",`Include nums[${a}] = ${s[a]}: pay ${r} − ${s[a]} = ${o}, cost = ${t}`);let c=t>i;if(l.update_variable("invalid",c),l.add_conditional("cost_exceeds",c),d(c?a+1:a,e),h(),l.record("check_cost",`cost = ${t} ${c?`> k = ${i}: too expensive, stop extending left`:`≤ k = ${i}: nums[${a}] fits, count = ${n+1}`}`),c)break;n++,l.update_variable("count",n)}let a=n>c;l.add_conditional("is_new_max",a),a?(c=n,x=e-n+1,u=e,l.update_variable("maxFreq",c),l.update_variable("bestStart",x),l.update_variable("bestEnd",u),l.update_visual("maxRange",{type:"range",start:x,end:u,label:"maxFreq"}),l.record("update_max",`count ${n} > maxFreq: new best window [${x}..${e}], maxFreq = ${c}`)):(h(),l.record("keep_max",`count ${n} ≤ maxFreq: keep best, maxFreq = ${c}`))}l.delete_visual("left"),l.delete_visual("right");for(let e=0;e<r;e++)l.update_visual(o(e),{type:"arrayElement",value:s[e],position:e});return h(),l.record("complete",`Maximum frequency = ${c}`),l.getSteps()
}

export function FrequencyOfTheMostFrequentElementProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FrequencyOfTheMostFrequentElementTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFrequencyOfTheMostFrequentElementSteps(e) as any[];
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
      title="Frequency of the Most Frequent Element"
      slug="frequency-of-the-most-frequent-element"
      approaches={approaches}
      presets={FrequencyOfTheMostFrequentElementPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Fruit Into Baskets (fruit-into-baskets)
// ==========================================

const FruitIntoBasketsTemplates = {
  "python": {
    "language": "python",
    "code": "def totalFruit(fruits):\n    n = len(fruits)\n    if n <= 2:\n        return n\n\n    left = 0\n    max_fruits = 0\n    second_type_start = 0\n    type_a = fruits[0]\n    type_b = -1\n\n    for right in range(n):\n        # If this is a third type, evict the older type\n        if fruits[right] != type_a and fruits[right] != type_b:\n            if type_b != -1:\n                # Move left to where the second-to-last block started\n                left = second_type_start\n            type_a = fruits[right - 1] if right > 0 else fruits[right]\n            type_b = fruits[right]\n\n        # If this fruit differs from the previous one, a new block starts\n        if right > 0 and fruits[right] != fruits[right - 1]:\n            second_type_start = right\n\n        max_fruits = max(max_fruits, right - left + 1)\n\n    return max_fruits",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6,
        7,
        8,
        9,
        10
      ],
      "expand": [
        12
      ],
      "check_third_type": [
        14
      ],
      "evict_type": [
        15,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        22
      ],
      "update_second_start": [
        23
      ],
      "update_max": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        14
      ],
      "is_new_block": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int totalFruit(int[] fruits) {\n    int n = fruits.length;\n    if (n <= 2) return n;\n\n    int left = 0;\n    int maxFruits = 0;\n    int secondTypeStart = 0;\n    int typeA = fruits[0];\n    int typeB = -1;\n\n    for (int right = 0; right < n; right++) {\n        // If this is a third type, evict the older type\n        if (fruits[right] != typeA && fruits[right] != typeB) {\n            if (typeB != -1) {\n                // Move left to where the second-to-last block started\n                left = secondTypeStart;\n            }\n            typeA = (right > 0) ? fruits[right - 1] : fruits[right];\n            typeB = fruits[right];\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if (right > 0 && fruits[right] != fruits[right - 1]) {\n            secondTypeStart = right;\n        }\n\n        maxFruits = Math.max(maxFruits, right - left + 1);\n    }\n\n    return maxFruits;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "check_third_type": [
        13
      ],
      "evict_type": [
        14,
        16,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        23
      ],
      "update_second_start": [
        24
      ],
      "update_max": [
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        13
      ],
      "is_new_block": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int totalFruit(vector<int>& fruits) {\n    int n = fruits.size();\n    if (n <= 2) return n;\n\n    int left = 0;\n    int maxFruits = 0;\n    int secondTypeStart = 0;\n    int typeA = fruits[0];\n    int typeB = -1;\n\n    for (int right = 0; right < n; right++) {\n        // If this is a third type, evict the older type\n        if (fruits[right] != typeA && fruits[right] != typeB) {\n            if (typeB != -1) {\n                left = secondTypeStart;\n            }\n            typeA = (right > 0) ? fruits[right - 1] : fruits[right];\n            typeB = fruits[right];\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if (right > 0 && fruits[right] != fruits[right - 1]) {\n            secondTypeStart = right;\n        }\n\n        maxFruits = max(maxFruits, right - left + 1);\n    }\n\n    return maxFruits;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "check_third_type": [
        13
      ],
      "evict_type": [
        14,
        15,
        16,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        22
      ],
      "update_second_start": [
        24
      ],
      "update_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        13
      ],
      "is_new_block": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int TotalFruit(int[] fruits) {\n    int n = fruits.Length;\n    if (n <= 2) return n;\n\n    int left = 0;\n    int maxFruits = 0;\n    int secondTypeStart = 0;\n    int typeA = fruits[0];\n    int typeB = -1;\n\n    for (int right = 0; right < n; right++) {\n        // If this is a third type, evict the older type\n        if (fruits[right] != typeA && fruits[right] != typeB) {\n            if (typeB != -1) {\n                left = secondTypeStart;\n            }\n            typeA = (right > 0) ? fruits[right - 1] : fruits[right];\n            typeB = fruits[right];\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if (right > 0 && fruits[right] != fruits[right - 1]) {\n            secondTypeStart = right;\n        }\n\n        maxFruits = Math.Max(maxFruits, right - left + 1);\n    }\n\n    return maxFruits;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "check_third_type": [
        13
      ],
      "evict_type": [
        14,
        15,
        16,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        22
      ],
      "update_second_start": [
        24
      ],
      "update_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        13
      ],
      "is_new_block": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func totalFruit(fruits []int) int {\n    n := len(fruits)\n    if n <= 2 {\n        return n\n    }\n\n    left := 0\n    maxFruits := 0\n    secondTypeStart := 0\n    typeA := fruits[0]\n    typeB := -1\n\n    for right := 0; right < n; right++ {\n        // If this is a third type, evict the older type\n        if fruits[right] != typeA && fruits[right] != typeB {\n            if typeB != -1 {\n                left = secondTypeStart\n            }\n            if right > 0 {\n                typeA = fruits[right-1]\n            } else {\n                typeA = fruits[right]\n            }\n            typeB = fruits[right]\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if right > 0 && fruits[right] != fruits[right-1] {\n            secondTypeStart = right\n        }\n\n        windowSize := right - left + 1\n        if windowSize > maxFruits {\n            maxFruits = windowSize\n        }\n    }\n\n    return maxFruits\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        7,
        8,
        9,
        10,
        11
      ],
      "expand": [
        13
      ],
      "check_third_type": [
        15
      ],
      "evict_type": [
        16,
        17,
        18
      ],
      "update_types": [
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "check_new_block": [
        28
      ],
      "update_second_start": [
        29
      ],
      "update_max": [
        32,
        33,
        34
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        15
      ],
      "is_new_block": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function totalFruit(fruits) {\n    const n = fruits.length;\n    if (n <= 2) return n;\n\n    let left = 0;\n    let maxFruits = 0;\n    let secondTypeStart = 0;\n    let typeA = fruits[0];\n    let typeB = -1;\n\n    for (let right = 0; right < n; right++) {\n        // If this is a third type, evict the older type\n        if (fruits[right] !== typeA && fruits[right] !== typeB) {\n            if (typeB !== -1) {\n                left = secondTypeStart;\n            }\n            typeA = (right > 0) ? fruits[right - 1] : fruits[right];\n            typeB = fruits[right];\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if (right > 0 && fruits[right] !== fruits[right - 1]) {\n            secondTypeStart = right;\n        }\n\n        maxFruits = Math.max(maxFruits, right - left + 1);\n    }\n\n    return maxFruits;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "check_third_type": [
        13
      ],
      "evict_type": [
        14,
        15,
        16,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        22
      ],
      "update_second_start": [
        24
      ],
      "update_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        13
      ],
      "is_new_block": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function totalFruit(fruits: number[]): number {\n    const n = fruits.length;\n    if (n <= 2) return n;\n\n    let left = 0;\n    let maxFruits = 0;\n    let secondTypeStart = 0;\n    let typeA = fruits[0];\n    let typeB = -1;\n\n    for (let right = 0; right < n; right++) {\n        // If this is a third type, evict the older type\n        if (fruits[right] !== typeA && fruits[right] !== typeB) {\n            if (typeB !== -1) {\n                left = secondTypeStart;\n            }\n            typeA = (right > 0) ? fruits[right - 1] : fruits[right];\n            typeB = fruits[right];\n        }\n\n        // If this fruit differs from the previous one, a new block starts\n        if (right > 0 && fruits[right] !== fruits[right - 1]) {\n            secondTypeStart = right;\n        }\n\n        maxFruits = Math.max(maxFruits, right - left + 1);\n    }\n\n    return maxFruits;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "check_third_type": [
        13
      ],
      "evict_type": [
        14,
        15,
        16,
        17
      ],
      "update_types": [
        18,
        19
      ],
      "check_new_block": [
        22
      ],
      "update_second_start": [
        24
      ],
      "update_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "is_third_type": [
        13
      ],
      "is_new_block": [
        22
      ]
    }
  }
};

const FruitIntoBasketsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "fruits": [
        1,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "fruits": [
        0,
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "fruits": [
        1,
        2,
        3,
        2,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Longer",
    "value": {
      "fruits": [
        3,
        3,
        3,
        1,
        2,
        1,
        1,
        2,
        3,
        3,
        4
      ]
    }
  }
];

function generateFruitIntoBasketsSteps(t: any): any[] {
  let e=t.fruits,i=e.length,a=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),n=new StepRecorder({fruits:e},{...a}),l=0,s=-1,o=-1,u=0,d=0,p=-1,c=(t,i,r=!1)=>{e.forEach((e,a)=>{let u;u=a<l?"outside":a>t?void 0:a===i?r?"intruder":"checking":e===s?"type_a":e===o?"type_b":"checking",n.update_visual(`elem_${a}`,{type:"arrayElement",value:e,position:a,...u?{state:u}:{}})}),n.update_variable("invalid",r)},h=()=>{p>=0&&n.update_visual("bestWindow",{type:"range",start:d,end:p,label:"best",state:"matched"})};for(n.record("-","Start of algorithm"),n.add_new_variable("left",l),n.add_new_variable("maxFruits",u),n.add_new_variable("typeA",s),n.add_new_variable("typeB",o),n.add_new_variable("invalid",!1),n.record("init","Initialize maxFruits = 0, try every start with two empty baskets"),l=0;l<i;l++){s=-1,o=-1,n.update_variable("left",l),n.update_variable("typeA",s),n.update_variable("typeB",o),n.update_visual("left",{type:"pointer",position:l,label:"left"});for(let t=l;t<i;t++){let i=e[t];n.update_variable("right",t),n.update_variable("added_val",i),n.update_visual("right",{type:"pointer",position:t,label:"right"}),c(t,t),n.record("expand",`Pick fruits[${t}] = ${i}`);let r=-1!==s&&-1!==o&&i!==s&&i!==o;if(n.add_conditional("is_third_type",r),r){c(t,t,!0),n.record("third_type",`${i} is a third type, baskets already hold ${s} and ${o}: restart from index ${l+1}`);break}i!==s&&-1===s?s=i:i!==s&&-1===o&&(o=i),n.update_variable("typeA",s),n.update_variable("typeB",o),c(t),n.record("add_fruit",`${i} fits, baskets hold A = ${s}${-1===o?"":` and B = ${o}`}`);let a=t-l+1,f=u;n.update_variable("window_size",a),n.update_variable("old_max",f),u=Math.max(u,a),n.update_variable("maxFruits",u),a>=u&&(d=l,p=t),h(),c(t),n.record("update_max",a>f?`Window [${l}..${t}] holds ${a} fruits, new best: maxFruits = ${u}`:`Window holds ${a} fruits, maxFruits stays ${u}`)}}return n.update_variable("invalid",!1),n.delete_visual("left"),n.delete_visual("right"),e.forEach((t,e)=>{let i=p>=0&&e>=d&&e<=p;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t,position:e,state:i?"in_max":"outside"})}),h(),n.record("complete",`Maximum fruits collected from two types: ${u}`),n.getSteps()
}

export function FruitIntoBasketsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FruitIntoBasketsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateFruitIntoBasketsSteps(t) as any[];
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
      title="Fruit Into Baskets"
      slug="fruit-into-baskets"
      approaches={approaches}
      presets={FruitIntoBasketsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Repeating Character Replacement (longest-repeating-character-replacement)
// ==========================================

const LongestRepeatingCharacterReplacementTemplates = {
  "python": {
    "language": "python",
    "code": "def characterReplacement(s, k):\n    freq = [0] * 26\n    left = 0\n    max_freq = 0\n    max_len = 0\n\n    for right in range(len(s)):\n        idx = ord(s[right]) - ord('A')\n        freq[idx] += 1\n        # Only update max_freq upward, never decrease it\n        max_freq = max(max_freq, freq[idx])\n\n        # If window is invalid, slide it forward by one\n        if (right - left + 1) - max_freq > k:\n            freq[ord(s[left]) - ord('A')] -= 1\n            left += 1\n\n        max_len = max(max_len, right - left + 1)\n\n    return max_len",
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
      "expand": [
        7
      ],
      "update_freq": [
        9
      ],
      "update_max_freq": [
        11
      ],
      "check_valid": [
        14
      ],
      "shrink": [
        15,
        16
      ],
      "update_result": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int characterReplacement(String s, int k) {\n    int[] freq = new int[26];\n    int left = 0, maxFreq = 0, maxLen = 0;\n\n    for (int right = 0; right < s.length(); right++) {\n        freq[s.charAt(right) - 'A']++;\n        // Only update maxFreq upward, never decrease it\n        maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);\n\n        // If window is invalid, slide it forward by one\n        if ((right - left + 1) - maxFreq > k) {\n            freq[s.charAt(left) - 'A']--;\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        8
      ],
      "check_valid": [
        11
      ],
      "shrink": [
        12,
        13
      ],
      "update_result": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int characterReplacement(string s, int k) {\n    int freq[26] = {};\n    int left = 0, maxFreq = 0, maxLen = 0;\n\n    for (int right = 0; right < s.size(); right++) {\n        freq[s[right] - 'A']++;\n        // Only update maxFreq upward, never decrease it\n        maxFreq = max(maxFreq, freq[s[right] - 'A']);\n\n        // If window is invalid, slide it forward by one\n        if ((right - left + 1) - maxFreq > k) {\n            freq[s[left] - 'A']--;\n            left++;\n        }\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        8
      ],
      "check_valid": [
        11
      ],
      "shrink": [
        12,
        13
      ],
      "update_result": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int CharacterReplacement(string s, int k) {\n    int[] freq = new int[26];\n    int left = 0, maxFreq = 0, maxLen = 0;\n\n    for (int right = 0; right < s.Length; right++) {\n        freq[s[right] - 'A']++;\n        // Only update maxFreq upward, never decrease it\n        maxFreq = Math.Max(maxFreq, freq[s[right] - 'A']);\n\n        // If window is invalid, slide it forward by one\n        if ((right - left + 1) - maxFreq > k) {\n            freq[s[left] - 'A']--;\n            left++;\n        }\n        maxLen = Math.Max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        8
      ],
      "check_valid": [
        11
      ],
      "shrink": [
        12,
        13
      ],
      "update_result": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func characterReplacement(s string, k int) int {\n    freq := [26]int{}\n    left, maxFreq, maxLen := 0, 0, 0\n\n    for right := 0; right < len(s); right++ {\n        idx := s[right] - 'A'\n        freq[idx]++\n        // Only update maxFreq upward, never decrease it\n        if freq[idx] > maxFreq {\n            maxFreq = freq[idx]\n        }\n\n        // If window is invalid, slide it forward by one\n        if (right-left+1)-maxFreq > k {\n            freq[s[left]-'A']--\n            left++\n        }\n        if right-left+1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        9,
        10
      ],
      "check_valid": [
        14
      ],
      "shrink": [
        15,
        16
      ],
      "update_result": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function characterReplacement(s, k) {\n    const freq = new Array(26).fill(0);\n    let left = 0, maxFreq = 0, maxLen = 0;\n\n    for (let right = 0; right < s.length; right++) {\n        const idx = s.charCodeAt(right) - 65;\n        freq[idx]++;\n        // Only update maxFreq upward, never decrease it\n        maxFreq = Math.max(maxFreq, freq[idx]);\n\n        // If window is invalid, slide it forward by one\n        if ((right - left + 1) - maxFreq > k) {\n            freq[s.charCodeAt(left) - 65]--;\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        9
      ],
      "check_valid": [
        12
      ],
      "shrink": [
        13,
        14
      ],
      "update_result": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function characterReplacement(s: string, k: number): number {\n    const freq = new Array(26).fill(0);\n    let left = 0, maxFreq = 0, maxLen = 0;\n\n    for (let right = 0; right < s.length; right++) {\n        const idx = s.charCodeAt(right) - 65;\n        freq[idx]++;\n        // Only update maxFreq upward, never decrease it\n        maxFreq = Math.max(maxFreq, freq[idx]);\n\n        // If window is invalid, slide it forward by one\n        if ((right - left + 1) - maxFreq > k) {\n            freq[s.charCodeAt(left) - 65]--;\n            left++;\n        }\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "expand": [
        5,
        6
      ],
      "update_freq": [
        6
      ],
      "update_max_freq": [
        9
      ],
      "check_valid": [
        12
      ],
      "shrink": [
        13,
        14
      ],
      "update_result": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_invalid": [
        12
      ]
    }
  }
};

const LongestRepeatingCharacterReplacementPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "ABAB",
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "AABABBA",
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "s": "AAAA",
      "k": 0
    }
  },
  {
    "id": "ex4",
    "label": "All Different",
    "value": {
      "s": "ABCDE",
      "k": 2
    }
  }
];

function generateLongestRepeatingCharacterReplacementSteps(e: any): any[] {
  let t=e.s,a=e.k,n=t.split(""),r=n.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),l=new StepRecorder({s:t,k:a},{...r}),d={},s=0,o=0,c=0,h=0,p=-1,x=()=>Object.fromEntries(Object.entries(d).filter(([,e])=>e>0)),f=(e,t)=>{let a=(e=>{let t={},a="",i=0;for(let r=s;r<=e;r++)t[n[r]]=(t[n[r]]||0)+1,t[n[r]]>i&&(i=t[n[r]],a=n[r]);return a})(e);n.forEach((i,n)=>{let r;r=n<s?"outside":n>e?void 0:n===t?"checking":i===a?"dominant":"replace",l.update_visual(`elem_${n}`,{type:"arrayElement",value:i,position:n,...r?{state:r}:{}})})},u=()=>{p>=0&&l.update_visual("bestRange",{type:"range",start:h,end:p,label:"best"})},m=e=>`"${n.slice(s,e+1).join("")}"`;l.record("-","Start of algorithm"),l.add_new_variable("left",s),l.add_new_variable("maxFreq",o),l.add_new_variable("maxLen",c),l.add_new_variable("freq",x()),l.update_visual("left",{type:"pointer",position:s,label:"left"}),l.record("init",`Initialize left = 0, maxFreq = 0, maxLen = 0 with k = ${a}`);for(let e=0;e<n.length;e++){let t=n[e];d[t]=(d[t]||0)+1,l.update_variable("right",e),l.update_variable("freq",x()),l.update_variable("added_char",t),l.update_variable("removed_char",null),l.update_variable("invalid",!1),l.update_visual("right",{type:"pointer",position:e,label:"right"}),f(e,e),u(),l.record("expand",`Expand the window to include '${t}' at index ${e}`),l.record("update_freq",`freq['${t}'] is now ${d[t]}`);let i=o,r=(o=Math.max(o,d[t]))>i;l.update_variable("maxFreq",o),l.update_variable("max_freq_changed",r),l.record("update_max_freq",r?`maxFreq updated to ${o}, '${t}' now repeats most`:`maxFreq stays ${o}`);let g=e-s+1,_=g-o,v=_>a;if(l.update_variable("windowSize",g),l.update_variable("replacements",_),l.update_variable("invalid",v),l.add_conditional("is_invalid",v),f(e),u(),l.record("check_valid",`Window ${m(e)} needs ${_} replacement${1===_?"":"s"} (${g} - maxFreq ${o}), `+(v?`${_} > k = ${a}, the window is invalid`:`${_} <= k = ${a}, the window is valid`)),v){let t=n[s];d[t]--,s++,l.update_variable("left",s),l.update_variable("freq",x()),l.update_variable("added_char",null),l.update_variable("removed_char",t),l.update_variable("invalid",!1),l.update_variable("windowSize",e-s+1),l.update_variable("replacements",e-s+1-o),l.update_visual("left",{type:"pointer",position:s,label:"left"}),f(e),u(),l.record("shrink",`Shrink: drop '${t}' at index ${s-1}, left moves to ${s}`)}let q=e-s+1,b=c;l.update_variable("old_max_len",b),q>c?(c=q,h=s,p=e,l.update_variable("maxLen",c),u(),l.record("update_result",`New best: maxLen = ${c}, window ${m(e)}`)):(l.update_variable("maxLen",c),l.record("update_result",`maxLen stays ${c}`))}return l.update_variable("added_char",null),l.update_variable("removed_char",null),l.update_variable("invalid",!1),l.delete_visual("left"),l.delete_visual("right"),n.forEach((e,t)=>{let a=t>=h&&t<=p;l.update_visual(`elem_${t}`,{type:"arrayElement",value:e,position:t,state:a?"in_max":"outside"})}),u(),l.record("complete",`Longest run after at most ${a} replacements has length ${c}`),l.getSteps()
}

export function LongestRepeatingCharacterReplacementProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestRepeatingCharacterReplacementTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestRepeatingCharacterReplacementSteps(e) as any[];
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
      title="Longest Repeating Character Replacement"
      slug="longest-repeating-character-replacement"
      approaches={approaches}
      presets={LongestRepeatingCharacterReplacementPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Substring With At Least K Repeating Characters (longest-substring-with-at-least-k-repeating-characters)
// ==========================================

const LongestSubstringWithAtLeastKRepeatingCharactersTemplates = {
  "python": {
    "language": "python",
    "code": "def longestSubstring(s, k):\n    n = len(s)\n    max_len = 0\n\n    # Count total unique characters in the string\n    max_unique = len(set(s))\n\n    # Try each possible number of unique characters\n    for t in range(1, max_unique + 1):\n        freq = [0] * 26\n        left = 0\n        unique = 0       # Count of unique chars in window\n        at_least_k = 0   # Count of chars with freq >= k\n\n        for right in range(n):\n            r_idx = ord(s[right]) - ord('a')\n            if freq[r_idx] == 0:\n                unique += 1\n            freq[r_idx] += 1\n            if freq[r_idx] == k:\n                at_least_k += 1\n\n            # Shrink window if too many unique characters\n            while unique > t:\n                l_idx = ord(s[left]) - ord('a')\n                if freq[l_idx] == k:\n                    at_least_k -= 1\n                freq[l_idx] -= 1\n                if freq[l_idx] == 0:\n                    unique -= 1\n                left += 1\n\n            # Check if all unique chars meet the k threshold\n            if unique == t and at_least_k == t:\n                max_len = max(max_len, right - left + 1)\n\n    return max_len",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6
      ],
      "new_target": [
        9,
        10,
        11,
        12,
        13
      ],
      "expand": [
        15,
        16
      ],
      "update_freq": [
        17,
        18,
        19,
        20,
        21
      ],
      "check_unique": [
        24
      ],
      "shrink_freq": [
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "move_left": [
        31
      ],
      "check_valid": [
        34
      ],
      "update_max": [
        35
      ],
      "keep_max": [
        35
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        24
      ],
      "is_valid": [
        34
      ],
      "is_new_max": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestSubstring(String s, int k) {\n    int n = s.length();\n    int maxLen = 0;\n\n    // Count total unique characters in the string\n    int maxUnique = 0;\n    boolean[] seen = new boolean[26];\n    for (char c : s.toCharArray()) {\n        if (!seen[c - 'a']) {\n            seen[c - 'a'] = true;\n            maxUnique++;\n        }\n    }\n\n    // Try each possible number of unique characters\n    for (int t = 1; t <= maxUnique; t++) {\n        int[] freq = new int[26];\n        int left = 0;\n        int unique = 0;      // Count of unique chars in window\n        int atLeastK = 0;    // Count of chars with freq >= k\n\n        for (int right = 0; right < n; right++) {\n            int rIdx = s.charAt(right) - 'a';\n            if (freq[rIdx] == 0) unique++;\n            freq[rIdx]++;\n            if (freq[rIdx] == k) atLeastK++;\n\n            // Shrink window if too many unique characters\n            while (unique > t) {\n                int lIdx = s.charAt(left) - 'a';\n                if (freq[lIdx] == k) atLeastK--;\n                freq[lIdx]--;\n                if (freq[lIdx] == 0) unique--;\n                left++;\n            }\n\n            // Check if all unique chars in window meet the k threshold\n            if (unique == t && atLeastK == t) {\n                maxLen = Math.max(maxLen, right - left + 1);\n            }\n        }\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "new_target": [
        16,
        17,
        18,
        19,
        20
      ],
      "expand": [
        22,
        23
      ],
      "update_freq": [
        24,
        25,
        26
      ],
      "check_unique": [
        29
      ],
      "shrink_freq": [
        30,
        31,
        32,
        33
      ],
      "move_left": [
        34
      ],
      "check_valid": [
        38
      ],
      "update_max": [
        39
      ],
      "keep_max": [
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        29
      ],
      "is_valid": [
        38
      ],
      "is_new_max": [
        39
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestSubstring(string s, int k) {\n    int n = s.size();\n    int maxLen = 0;\n\n    // Count total unique characters in the string\n    int maxUnique = 0;\n    bool seen[26] = {false};\n    for (char c : s) {\n        if (!seen[c - 'a']) {\n            seen[c - 'a'] = true;\n            maxUnique++;\n        }\n    }\n\n    // Try each possible number of unique characters\n    for (int t = 1; t <= maxUnique; t++) {\n        int freq[26] = {0};\n        int left = 0;\n        int unique = 0;      // Count of unique chars in window\n        int atLeastK = 0;    // Count of chars with freq >= k\n\n        for (int right = 0; right < n; right++) {\n            int rIdx = s[right] - 'a';\n            if (freq[rIdx] == 0) unique++;\n            freq[rIdx]++;\n            if (freq[rIdx] == k) atLeastK++;\n\n            // Shrink window if too many unique characters\n            while (unique > t) {\n                int lIdx = s[left] - 'a';\n                if (freq[lIdx] == k) atLeastK--;\n                freq[lIdx]--;\n                if (freq[lIdx] == 0) unique--;\n                left++;\n            }\n\n            // Check if all unique chars in window meet the k threshold\n            if (unique == t && atLeastK == t) {\n                maxLen = max(maxLen, right - left + 1);\n            }\n        }\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "new_target": [
        16,
        17,
        18,
        19,
        20
      ],
      "expand": [
        22,
        23
      ],
      "update_freq": [
        24,
        25,
        26
      ],
      "check_unique": [
        29
      ],
      "shrink_freq": [
        30,
        31,
        32,
        33
      ],
      "move_left": [
        34
      ],
      "check_valid": [
        38
      ],
      "update_max": [
        39
      ],
      "keep_max": [
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        29
      ],
      "is_valid": [
        38
      ],
      "is_new_max": [
        39
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestSubstring(string s, int k) {\n    int n = s.Length;\n    int maxLen = 0;\n\n    // Count total unique characters in the string\n    int maxUnique = 0;\n    bool[] seen = new bool[26];\n    foreach (char c in s) {\n        if (!seen[c - 'a']) {\n            seen[c - 'a'] = true;\n            maxUnique++;\n        }\n    }\n\n    // Try each possible number of unique characters\n    for (int t = 1; t <= maxUnique; t++) {\n        int[] freq = new int[26];\n        int left = 0;\n        int unique = 0;      // Count of unique chars in window\n        int atLeastK = 0;    // Count of chars with freq >= k\n\n        for (int right = 0; right < n; right++) {\n            int rIdx = s[right] - 'a';\n            if (freq[rIdx] == 0) unique++;\n            freq[rIdx]++;\n            if (freq[rIdx] == k) atLeastK++;\n\n            // Shrink window if too many unique characters\n            while (unique > t) {\n                int lIdx = s[left] - 'a';\n                if (freq[lIdx] == k) atLeastK--;\n                freq[lIdx]--;\n                if (freq[lIdx] == 0) unique--;\n                left++;\n            }\n\n            // Check if all unique chars in window meet the k threshold\n            if (unique == t && atLeastK == t) {\n                maxLen = Math.Max(maxLen, right - left + 1);\n            }\n        }\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "new_target": [
        16,
        17,
        18,
        19,
        20
      ],
      "expand": [
        22,
        23
      ],
      "update_freq": [
        24,
        25,
        26
      ],
      "check_unique": [
        29
      ],
      "shrink_freq": [
        30,
        31,
        32,
        33
      ],
      "move_left": [
        34
      ],
      "check_valid": [
        38
      ],
      "update_max": [
        39
      ],
      "keep_max": [
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        29
      ],
      "is_valid": [
        38
      ],
      "is_new_max": [
        39
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestSubstring(s string, k int) int {\n    n := len(s)\n    maxLen := 0\n\n    // Count total unique characters in the string\n    seen := [26]bool{}\n    maxUnique := 0\n    for _, c := range s {\n        if !seen[c-'a'] {\n            seen[c-'a'] = true\n            maxUnique++\n        }\n    }\n\n    // Try each possible number of unique characters\n    for t := 1; t <= maxUnique; t++ {\n        freq := [26]int{}\n        left := 0\n        unique := 0      // Count of unique chars in window\n        atLeastK := 0    // Count of chars with freq >= k\n\n        for right := 0; right < n; right++ {\n            rIdx := s[right] - 'a'\n            if freq[rIdx] == 0 {\n                unique++\n            }\n            freq[rIdx]++\n            if freq[rIdx] == k {\n                atLeastK++\n            }\n\n            // Shrink window if too many unique characters\n            for unique > t {\n                lIdx := s[left] - 'a'\n                if freq[lIdx] == k {\n                    atLeastK--\n                }\n                freq[lIdx]--\n                if freq[lIdx] == 0 {\n                    unique--\n                }\n                left++\n            }\n\n            // Check if all unique chars in window meet the k threshold\n            if unique == t && atLeastK == t {\n                if right-left+1 > maxLen {\n                    maxLen = right - left + 1\n                }\n            }\n        }\n    }\n\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "new_target": [
        16,
        17,
        18,
        19,
        20
      ],
      "expand": [
        22,
        23
      ],
      "update_freq": [
        24,
        25,
        26,
        27,
        28,
        29,
        30
      ],
      "check_unique": [
        33
      ],
      "shrink_freq": [
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41
      ],
      "move_left": [
        42
      ],
      "check_valid": [
        46
      ],
      "update_max": [
        47,
        48
      ],
      "keep_max": [
        47
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        33
      ],
      "is_valid": [
        46
      ],
      "is_new_max": [
        47
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestSubstring(s, k) {\n  let n = s.length;\n  let maxLen = 0;\n\n  // Count total unique characters in the string\n  let maxUnique = new Set(s).size;\n\n  // Try each possible number of unique characters\n  for (let t = 1; t <= maxUnique; t++) {\n    let freq = new Array(26).fill(0);\n    let left = 0;\n    let unique = 0; // Count of unique chars in window\n    let atLeastK = 0; // Count of chars with freq >= k\n\n    for (let right = 0; right < n; right++) {\n      let rIdx = s.charCodeAt(right) - 97;\n      if (freq[rIdx] === 0) unique++;\n      freq[rIdx]++;\n      if (freq[rIdx] === k) atLeastK++;\n\n      // Shrink window if too many unique characters\n      while (unique > t) {\n        let lIdx = s.charCodeAt(left) - 97;\n        if (freq[lIdx] === k) atLeastK--;\n        freq[lIdx]--;\n        if (freq[lIdx] === 0) unique--;\n        left++;\n      }\n\n      // Check if all unique chars in window meet the k threshold\n      if (unique === t && atLeastK === t) {\n        maxLen = Math.max(maxLen, right - left + 1);\n      }\n    }\n  }\n\n  return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6
      ],
      "new_target": [
        9,
        10,
        11,
        12,
        13
      ],
      "expand": [
        15,
        16
      ],
      "update_freq": [
        17,
        18,
        19
      ],
      "check_unique": [
        22
      ],
      "shrink_freq": [
        23,
        24,
        25,
        26
      ],
      "move_left": [
        27
      ],
      "check_valid": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        32
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        22
      ],
      "is_valid": [
        31
      ],
      "is_new_max": [
        32
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestSubstring(s: string, k: number): number {\n    let n = s.length;\n    let maxLen = 0;\n\n    // Count total unique characters in the string\n    let maxUnique = new Set(s).size;\n\n    // Try each possible number of unique characters\n    for (let t = 1; t <= maxUnique; t++) {\n        let freq = new Array(26).fill(0);\n        let left = 0;\n        let unique = 0;      // Count of unique chars in window\n        let atLeastK = 0;    // Count of chars with freq >= k\n\n        for (let right = 0; right < n; right++) {\n            let rIdx = s.charCodeAt(right) - 97;\n            if (freq[rIdx] === 0) unique++;\n            freq[rIdx]++;\n            if (freq[rIdx] === k) atLeastK++;\n\n            // Shrink window if too many unique characters\n            while (unique > t) {\n                let lIdx = s.charCodeAt(left) - 97;\n                if (freq[lIdx] === k) atLeastK--;\n                freq[lIdx]--;\n                if (freq[lIdx] === 0) unique--;\n                left++;\n            }\n\n            // Check if all unique chars in window meet the k threshold\n            if (unique === t && atLeastK === t) {\n                maxLen = Math.max(maxLen, right - left + 1);\n            }\n        }\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6
      ],
      "new_target": [
        9,
        10,
        11,
        12,
        13
      ],
      "expand": [
        15,
        16
      ],
      "update_freq": [
        17,
        18,
        19
      ],
      "check_unique": [
        22
      ],
      "shrink_freq": [
        23,
        24,
        25,
        26
      ],
      "move_left": [
        27
      ],
      "check_valid": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        32
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "too_many_unique": [
        22
      ],
      "is_valid": [
        31
      ],
      "is_new_max": [
        32
      ]
    }
  }
};

const LongestSubstringWithAtLeastKRepeatingCharactersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s": "aaabb",
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s": "ababbc",
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "s": "bbaaacbd",
      "k": 3
    }
  }
];

function generateLongestSubstringWithAtLeastKRepeatingCharactersSteps(e: any): any[] {
  let t=e.s,i=e.k,a=t.length,r=t.split(""),l=r.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),s=new StepRecorder({s:t,k:i},{...l}),d=0,c=-1,o={},u=0,h=0,f=-1,x=()=>{for(let e=0;e<a;e++){let t;e<d?t="outside":e<=c&&(t=(o[r[e]]||0)>=i?"satisfied":"deficient"),s.update_visual(`elem_${e}`,{type:"arrayElement",value:r[e],position:e,...t?{state:t}:{}})}};s.record("-","Start of algorithm"),s.add_new_variable("max_len",u),s.add_new_variable("k",i),s.add_new_variable("freq",{}),s.add_new_variable("deficient",0),s.update_visual("left",{type:"pointer",position:d,label:"left"}),s.record("init","maxLen = 0. Check every substring: valid when every char appears ≥ k times");let p=()=>{f>=0&&s.update_visual("maxRange",{type:"range",start:h,end:f,label:"max_len"})};for(d=0;d<a;d++){o={};let e=0;c=d-1,s.update_variable("left",d),s.update_variable("freq",{}),s.update_variable("deficient",0),s.update_variable("valid",!1),s.update_visual("left",{type:"pointer",position:d,label:"left"});for(let n=d;n<a;n++){let a=r[n];c=n,s.update_variable("right",n),s.update_variable("added_char",a),s.update_variable("valid",!1),s.update_visual("right",{type:"pointer",position:n,label:"right"}),x(),p(),s.record("expand",`Extend from ${d}: include s[${n}] = '${a}'`),!o[a]&&e++,o[a]=(o[a]||0)+1,o[a]===i&&e--,s.update_variable("freq",{...o}),s.update_variable("added_count",o[a]),s.update_variable("deficient",e),x(),p(),s.record("update_freq",o[a]===i?`freq['${a}'] = ${o[a]} reaches k, deficient = ${e}`:`freq['${a}'] = ${o[a]}, deficient chars = ${e}`);let l=0===e;if(s.update_variable("valid",l),s.add_conditional("is_valid",l),x(),p(),s.record("check_valid",l?`no deficient chars: window [${d}..${n}] is valid`:`${e} char${1===e?"":"s"} still below k: not valid`),l){let e=n-d+1,i=e>u,a=u;s.update_variable("window_size",e),s.update_variable("old_max",a),s.add_conditional("is_new_max",i),i?(u=e,h=d,f=n,s.update_variable("max_len",u),s.update_visual("maxRange",{type:"range",start:h,end:f,label:"max_len"}),x(),s.record("update_max",`window size ${e} > ${a}: new best "${t.substring(d,n+1)}", maxLen = ${u}`)):(x(),p(),s.record("keep_max",`window size ${e} ≤ ${u}: keep best`))}}}s.delete_visual("left"),s.delete_visual("right");for(let e=0;e<a;e++){let t=f>=0&&e>=h&&e<=f;s.update_visual(`elem_${e}`,{type:"arrayElement",value:r[e],position:e,...t?{state:"in_max"}:{}})}return p(),s.record("complete",`Longest substring with every character appearing ≥ ${i} times = ${u}`),s.getSteps()
}

export function LongestSubstringWithAtLeastKRepeatingCharactersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestSubstringWithAtLeastKRepeatingCharactersTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestSubstringWithAtLeastKRepeatingCharactersSteps(e) as any[];
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
      title="Longest Substring With At Least K Repeating Characters"
      slug="longest-substring-with-at-least-k-repeating-characters"
      approaches={approaches}
      presets={LongestSubstringWithAtLeastKRepeatingCharactersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Substring With At Most K Distinct Characters (longest-substring-with-at-most-k-distinct-characters)
// ==========================================

const LongestSubstringWithAtMostKDistinctCharactersTemplates = {
  "python": {
    "language": "python",
    "code": "def lengthOfLongestSubstringKDistinct(s, k):\n    n = len(s)\n    if k == 0:\n        return 0\n\n    char_count = {}\n    left = 0\n    max_length = 0\n\n    for right in range(n):\n        # Expand window: add the right character\n        right_char = s[right]\n        char_count[right_char] = char_count.get(right_char, 0) + 1\n\n        # Shrink window until we have at most k distinct characters\n        while len(char_count) > k:\n            left_char = s[left]\n            char_count[left_char] -= 1\n            if char_count[left_char] == 0:\n                del char_count[left_char]\n            left += 1\n\n        # Update the maximum length\n        max_length = max(max_length, right - left + 1)\n\n    return max_length",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6,
        7,
        8
      ],
      "expand": [
        10,
        12
      ],
      "add_char": [
        13
      ],
      "check_distinct": [
        16
      ],
      "shrink": [
        17,
        18,
        19,
        20
      ],
      "move_left": [
        21
      ],
      "update_max": [
        24
      ],
      "keep_max": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_max": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int lengthOfLongestSubstringKDistinct(String s, int k) {\n    int n = s.length();\n    if (k == 0) return 0;\n\n    Map<Character, Integer> charCount = new HashMap<>();\n    int left = 0;\n    int maxLength = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Expand window: add the right character\n        char rightChar = s.charAt(right);\n        charCount.put(rightChar, charCount.getOrDefault(rightChar, 0) + 1);\n\n        // Shrink window until we have at most k distinct characters\n        while (charCount.size() > k) {\n            char leftChar = s.charAt(left);\n            charCount.put(leftChar, charCount.get(leftChar) - 1);\n            if (charCount.get(leftChar) == 0) {\n                charCount.remove(leftChar);\n            }\n            left++;\n        }\n\n        // Update the maximum length\n        maxLength = Math.max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "expand": [
        9,
        11
      ],
      "add_char": [
        12
      ],
      "check_distinct": [
        15
      ],
      "shrink": [
        16,
        17,
        18,
        19
      ],
      "move_left": [
        21
      ],
      "update_max": [
        25
      ],
      "keep_max": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        15
      ],
      "is_new_max": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int lengthOfLongestSubstringKDistinct(string s, int k) {\n    int n = s.size();\n    if (k == 0) return 0;\n\n    unordered_map<char, int> charCount;\n    int left = 0;\n    int maxLength = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Expand window: add the right character\n        charCount[s[right]]++;\n\n        // Shrink window until we have at most k distinct characters\n        while ((int)charCount.size() > k) {\n            charCount[s[left]]--;\n            if (charCount[s[left]] == 0) {\n                charCount.erase(s[left]);\n            }\n            left++;\n        }\n\n        // Update the maximum length\n        maxLength = max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "expand": [
        9
      ],
      "add_char": [
        11
      ],
      "check_distinct": [
        14
      ],
      "shrink": [
        15,
        16,
        17
      ],
      "move_left": [
        19
      ],
      "update_max": [
        23
      ],
      "keep_max": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        14
      ],
      "is_new_max": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LengthOfLongestSubstringKDistinct(string s, int k) {\n    int n = s.Length;\n    if (k == 0) return 0;\n\n    Dictionary<char, int> charCount = new Dictionary<char, int>();\n    int left = 0;\n    int maxLength = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Expand window: add the right character\n        char rightChar = s[right];\n        if (charCount.ContainsKey(rightChar))\n            charCount[rightChar]++;\n        else\n            charCount[rightChar] = 1;\n\n        // Shrink window until we have at most k distinct characters\n        while (charCount.Count > k) {\n            char leftChar = s[left];\n            charCount[leftChar]--;\n            if (charCount[leftChar] == 0) {\n                charCount.Remove(leftChar);\n            }\n            left++;\n        }\n\n        // Update the maximum length\n        maxLength = Math.Max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "expand": [
        9,
        11
      ],
      "add_char": [
        15
      ],
      "check_distinct": [
        18
      ],
      "shrink": [
        19,
        20,
        21,
        22
      ],
      "move_left": [
        24
      ],
      "update_max": [
        28
      ],
      "keep_max": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        18
      ],
      "is_new_max": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lengthOfLongestSubstringKDistinct(s string, k int) int {\n    n := len(s)\n    if k == 0 {\n        return 0\n    }\n\n    charCount := make(map[byte]int)\n    left := 0\n    maxLength := 0\n\n    for right := 0; right < n; right++ {\n        // Expand window: add the right character\n        charCount[s[right]]++\n\n        // Shrink window until we have at most k distinct characters\n        for len(charCount) > k {\n            charCount[s[left]]--\n            if charCount[s[left]] == 0 {\n                delete(charCount, s[left])\n            }\n            left++\n        }\n\n        // Update the maximum length\n        if right-left+1 > maxLength {\n            maxLength = right - left + 1\n        }\n    }\n    return maxLength\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "add_char": [
        13
      ],
      "check_distinct": [
        16
      ],
      "shrink": [
        17,
        18,
        19
      ],
      "move_left": [
        21
      ],
      "update_max": [
        26
      ],
      "keep_max": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_max": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function lengthOfLongestSubstringKDistinct(s, k) {\n  let n = s.length;\n  if (k === 0) return 0;\n\n  let charCount = new Map();\n  let left = 0;\n  let maxLength = 0;\n\n  for (let right = 0; right < n; right++) {\n    // Expand window: add the right character\n    let rightChar = s[right];\n    charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);\n\n    // Shrink window until we have at most k distinct characters\n    while (charCount.size > k) {\n      let leftChar = s[left];\n      charCount.set(leftChar, charCount.get(leftChar) - 1);\n      if (charCount.get(leftChar) === 0) {\n        charCount.delete(leftChar);\n      }\n      left++;\n    }\n\n    // Update the maximum length\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  return maxLength;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "expand": [
        9
      ],
      "add_char": [
        12
      ],
      "check_distinct": [
        15
      ],
      "shrink": [
        17,
        18,
        19
      ],
      "move_left": [
        21
      ],
      "update_max": [
        25
      ],
      "keep_max": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        15
      ],
      "is_new_max": [
        25
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lengthOfLongestSubstringKDistinct(s: string, k: number): number {\n    let n = s.length;\n    if (k === 0) return 0;\n\n    let charCount = new Map<string, number>();\n    let left = 0;\n    let maxLength = 0;\n\n    for (let right = 0; right < n; right++) {\n        // Expand window: add the right character\n        let rightChar = s[right];\n        charCount.set(rightChar, (charCount.get(rightChar) || 0) + 1);\n\n        // Shrink window until we have at most k distinct characters\n        while (charCount.size > k) {\n            let leftChar = s[left];\n            charCount.set(leftChar, charCount.get(leftChar)! - 1);\n            if (charCount.get(leftChar) === 0) {\n                charCount.delete(leftChar);\n            }\n            left++;\n        }\n\n        // Update the maximum length\n        maxLength = Math.max(maxLength, right - left + 1);\n    }\n    return maxLength;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "expand": [
        9
      ],
      "add_char": [
        12
      ],
      "check_distinct": [
        15
      ],
      "shrink": [
        17,
        18,
        19
      ],
      "move_left": [
        21
      ],
      "update_max": [
        25
      ],
      "keep_max": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        15
      ],
      "is_new_max": [
        25
      ]
    }
  }
};

const LongestSubstringWithAtMostKDistinctCharactersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s": "eceba",
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s": "aa",
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "s": "abaccc",
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "k = 3",
    "value": {
      "s": "abcadcacacaca",
      "k": 3
    }
  }
];

function generateLongestSubstringWithAtMostKDistinctCharactersSteps(t: any): any[] {
  let e=t.s,i=t.k,a=e.split(""),r=a.length,l=a.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),s=new StepRecorder({s:e,k:i},{...l});s.record("-","Start of algorithm");let d=0,c=0,o=0,h=-1,x=()=>{for(let t=0;t<r;t++){let e=t<d?"outside":void 0;s.update_visual(`elem_${t}`,{type:"arrayElement",value:a[t],position:t,...e?{state:e}:{}})}};s.add_new_variable("maxLength",c),s.add_new_variable("left",d),s.add_new_variable("k",i),s.add_new_variable("char_count",{}),s.add_new_variable("mode","brute"),s.update_visual("left",{type:"pointer",position:d,label:"left"}),s.record("init","Initialize maxLength = 0, try every start");let u=()=>{h>=0&&s.update_visual("maxRange",{type:"range",start:o,end:h,label:"maxLength"})};for(d=0;d<r;d++){let t=new Map;s.update_variable("left",d),s.update_variable("char_count",{}),s.update_visual("left",{type:"pointer",position:d,label:"left"});for(let e=d;e<r;e++){let n=a[e];s.update_variable("right",e),s.update_variable("added_char",n),s.update_variable("distinct",t.size),s.update_variable("invalid",!1),s.update_variable("next_start",d+1),s.update_visual("right",{type:"pointer",position:e,label:"right"}),x(),u(),s.record("expand",`Extend from ${d}: include s[${e}] = '${n}'`),t.set(n,(t.get(n)||0)+1);let r=t.size;s.update_variable("char_count",Object.fromEntries(t)),s.update_variable("distinct",r),s.update_variable("added_count",t.get(n)),x(),u(),s.record("add_char",`charCount['${n}'] = ${t.get(n)}`);let l=r>i;if(s.update_variable("invalid",l),s.add_conditional("too_many_distinct",l),x(),u(),s.record("check_distinct",l?`distinct = ${r} > k = ${i}: skip this start`:`distinct = ${r} ≤ k = ${i}: window is valid`),l)break;let p=e-d+1,m=p>c,g=c;s.update_variable("window_size",p),s.update_variable("old_max",g),s.add_conditional("is_new_max",m),m?(c=p,o=d,h=e,s.update_variable("maxLength",c),s.update_visual("maxRange",{type:"range",start:o,end:h,label:"maxLength"}),x(),s.record("update_max",`window size ${p} > ${g}: new best [${o}..${h}], maxLength = ${c}`)):(x(),u(),s.record("keep_max",`window size ${p} ≤ ${c}: keep best, maxLength = ${c}`))}}s.delete_visual("left"),s.delete_visual("right");for(let t=0;t<r;t++){let e=h>=0&&t>=o&&t<=h;s.update_visual(`elem_${t}`,{type:"arrayElement",value:a[t],position:t,...e?{state:"in_max"}:{}})}return u(),s.record("complete",`Longest substring with at most ${i} distinct characters = ${c}`),s.getSteps()
}

export function LongestSubstringWithAtMostKDistinctCharactersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestSubstringWithAtMostKDistinctCharactersTemplates,
      generateSteps: (t: any) => {
        const recorded = generateLongestSubstringWithAtMostKDistinctCharactersSteps(t) as any[];
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
      title="Longest Substring With At Most K Distinct Characters"
      slug="longest-substring-with-at-most-k-distinct-characters"
      approaches={approaches}
      presets={LongestSubstringWithAtMostKDistinctCharactersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Substring With At Most Two Distinct Characters (longest-substring-with-at-most-two-distinct-characters)
// ==========================================

const LongestSubstringWithAtMostTwoDistinctCharactersTemplates = {
  "python": {
    "language": "python",
    "code": "def lengthOfLongestSubstringTwoDistinct(s):\n    n = len(s)\n    left = 0\n    max_len = 0\n    last_seen = {}\n\n    for right in range(n):\n        # Record the last occurrence of this character\n        last_seen[s[right]] = right\n\n        # If we have more than 2 distinct characters, shrink\n        if len(last_seen) > 2:\n            # Find the character with the earliest last occurrence\n            min_char = min(last_seen, key=last_seen.get)\n            # Jump left past the last occurrence of that character\n            left = last_seen[min_char] + 1\n            del last_seen[min_char]\n\n        max_len = max(max_len, right - left + 1)\n\n    return max_len",
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
      "expand": [
        7
      ],
      "update_last_seen": [
        9
      ],
      "check_distinct": [
        12
      ],
      "find_min": [
        14
      ],
      "evict": [
        17
      ],
      "move_left": [
        16
      ],
      "update_max": [
        19
      ],
      "keep_max": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        12
      ],
      "is_new_max": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int lengthOfLongestSubstringTwoDistinct(String s) {\n    int n = s.length();\n    int left = 0, maxLen = 0;\n    Map<Character, Integer> lastSeen = new HashMap<>();\n\n    for (int right = 0; right < n; right++) {\n        // Record the last occurrence of this character\n        lastSeen.put(s.charAt(right), right);\n\n        // If we have more than 2 distinct characters, shrink\n        if (lastSeen.size() > 2) {\n            // Find the character with the earliest last occurrence\n            int minIdx = Integer.MAX_VALUE;\n            char minChar = ' ';\n            for (Map.Entry<Character, Integer> entry : lastSeen.entrySet()) {\n                if (entry.getValue() < minIdx) {\n                    minIdx = entry.getValue();\n                    minChar = entry.getKey();\n                }\n            }\n            // Jump left past the last occurrence of that character\n            lastSeen.remove(minChar);\n            left = minIdx + 1;\n        }\n\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "expand": [
        6
      ],
      "update_last_seen": [
        8
      ],
      "check_distinct": [
        11
      ],
      "find_min": [
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "evict": [
        22
      ],
      "move_left": [
        23
      ],
      "update_max": [
        26
      ],
      "keep_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        11
      ],
      "is_new_max": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int lengthOfLongestSubstringTwoDistinct(string s) {\n    int n = s.size();\n    int left = 0, maxLen = 0;\n    unordered_map<char, int> lastSeen;\n\n    for (int right = 0; right < n; right++) {\n        // Record the last occurrence of this character\n        lastSeen[s[right]] = right;\n\n        // If we have more than 2 distinct characters, shrink\n        if (lastSeen.size() > 2) {\n            // Find the character with the earliest last occurrence\n            int minIdx = INT_MAX;\n            char minChar = ' ';\n            for (auto& [ch, idx] : lastSeen) {\n                if (idx < minIdx) {\n                    minIdx = idx;\n                    minChar = ch;\n                }\n            }\n            // Jump left past the last occurrence of that character\n            lastSeen.erase(minChar);\n            left = minIdx + 1;\n        }\n\n        maxLen = max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "expand": [
        6
      ],
      "update_last_seen": [
        8
      ],
      "check_distinct": [
        11
      ],
      "find_min": [
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "evict": [
        22
      ],
      "move_left": [
        23
      ],
      "update_max": [
        26
      ],
      "keep_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        11
      ],
      "is_new_max": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LengthOfLongestSubstringTwoDistinct(string s) {\n    int n = s.Length;\n    int left = 0, maxLen = 0;\n    Dictionary<char, int> lastSeen = new Dictionary<char, int>();\n\n    for (int right = 0; right < n; right++) {\n        // Record the last occurrence of this character\n        lastSeen[s[right]] = right;\n\n        // If we have more than 2 distinct characters, shrink\n        if (lastSeen.Count > 2) {\n            // Find the character with the earliest last occurrence\n            int minIdx = int.MaxValue;\n            char minChar = ' ';\n            foreach (var entry in lastSeen) {\n                if (entry.Value < minIdx) {\n                    minIdx = entry.Value;\n                    minChar = entry.Key;\n                }\n            }\n            // Jump left past the last occurrence of that character\n            lastSeen.Remove(minChar);\n            left = minIdx + 1;\n        }\n\n        maxLen = Math.Max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "expand": [
        6
      ],
      "update_last_seen": [
        8
      ],
      "check_distinct": [
        11
      ],
      "find_min": [
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "evict": [
        22
      ],
      "move_left": [
        23
      ],
      "update_max": [
        26
      ],
      "keep_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        11
      ],
      "is_new_max": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func lengthOfLongestSubstringTwoDistinct(s string) int {\n    n := len(s)\n    left := 0\n    maxLen := 0\n    lastSeen := make(map[byte]int)\n\n    for right := 0; right < n; right++ {\n        // Record the last occurrence of this character\n        lastSeen[s[right]] = right\n\n        // If we have more than 2 distinct characters, shrink\n        if len(lastSeen) > 2 {\n            // Find the character with the earliest last occurrence\n            minIdx := n\n            var minChar byte\n            for ch, idx := range lastSeen {\n                if idx < minIdx {\n                    minIdx = idx\n                    minChar = ch\n                }\n            }\n            // Jump left past the last occurrence of that character\n            delete(lastSeen, minChar)\n            left = minIdx + 1\n        }\n\n        if right-left+1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n\n    return maxLen\n}",
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
      "expand": [
        7
      ],
      "update_last_seen": [
        9
      ],
      "check_distinct": [
        12
      ],
      "find_min": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "evict": [
        23
      ],
      "move_left": [
        24
      ],
      "update_max": [
        28
      ],
      "keep_max": [
        27
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        12
      ],
      "is_new_max": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function lengthOfLongestSubstringTwoDistinct(s) {\n  const n = s.length;\n  let left = 0,\n    maxLen = 0;\n  const lastSeen = new Map();\n\n  for (let right = 0; right < n; right++) {\n    // Record the last occurrence of this character\n    lastSeen.set(s[right], right);\n\n    // If we have more than 2 distinct characters, shrink\n    if (lastSeen.size > 2) {\n      // Find the character with the earliest last occurrence\n      let minIdx = Infinity;\n      let minChar = \"\";\n      for (const [ch, idx] of lastSeen) {\n        if (idx < minIdx) {\n          minIdx = idx;\n          minChar = ch;\n        }\n      }\n      // Jump left past the last occurrence of that character\n      lastSeen.delete(minChar);\n      left = minIdx + 1;\n    }\n\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n\n  return maxLen;\n}",
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
      "expand": [
        7
      ],
      "update_last_seen": [
        9
      ],
      "check_distinct": [
        12
      ],
      "find_min": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "evict": [
        23
      ],
      "move_left": [
        24
      ],
      "update_max": [
        27
      ],
      "keep_max": [
        27
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        12
      ],
      "is_new_max": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function lengthOfLongestSubstringTwoDistinct(s: string): number {\n    const n = s.length;\n    let left = 0, maxLen = 0;\n    const lastSeen = new Map<string, number>();\n\n    for (let right = 0; right < n; right++) {\n        // Record the last occurrence of this character\n        lastSeen.set(s[right], right);\n\n        // If we have more than 2 distinct characters, shrink\n        if (lastSeen.size > 2) {\n            // Find the character with the earliest last occurrence\n            let minIdx = Infinity;\n            let minChar = \"\";\n            for (const [ch, idx] of lastSeen) {\n                if (idx < minIdx) {\n                    minIdx = idx;\n                    minChar = ch;\n                }\n            }\n            // Jump left past the last occurrence of that character\n            lastSeen.delete(minChar);\n            left = minIdx + 1;\n        }\n\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "expand": [
        6
      ],
      "update_last_seen": [
        8
      ],
      "check_distinct": [
        11
      ],
      "find_min": [
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "evict": [
        22
      ],
      "move_left": [
        23
      ],
      "update_max": [
        26
      ],
      "keep_max": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        11
      ],
      "is_new_max": [
        26
      ]
    }
  }
};

const LongestSubstringWithAtMostTwoDistinctCharactersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s": "eceba"
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s": "ccaabbb"
    }
  },
  {
    "id": "ex3",
    "label": "All Distinct",
    "value": {
      "s": "abcabcabc"
    }
  }
];

function generateLongestSubstringWithAtMostTwoDistinctCharactersSteps(t: any): any[] {
  let e=t.s,i=e.split(""),a=i.length,r=i.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),l=new StepRecorder({s:e},{...r});l.record("-","Start of algorithm");let s=0,c=0,o=0,d=-1,h=-1,u=new Map,x=null,p=null,m=t=>{t!==x&&t!==p&&(null===x?x=t:null===p&&(p=t))},f=()=>{for(let t=0;t<a;t++){let e;if(t<s)e="outside";else if(t<=h){let n=i[t];e=n===x?"type_a":n===p?"type_b":"intruder"}l.update_visual(`elem_${t}`,{type:"arrayElement",value:i[t],position:t,...e?{state:e}:{}})}};l.add_new_variable("max_len",c),l.add_new_variable("left",s),l.add_new_variable("counts",{}),l.update_visual("left",{type:"pointer",position:s,label:"left"}),l.record("init","Initialize maxLen = 0, left = 0, count map = {}");let g=()=>{d>=0&&l.update_visual("maxRange",{type:"range",start:o,end:d,label:"max_len"})};for(let t=0;t<a;t++){let e=i[t];h=t,m(e),u.set(e,(u.get(e)||0)+1);let n=u.size;for(l.update_variable("right",t),l.update_variable("added_char",e),l.update_variable("counts",Object.fromEntries(u)),l.update_variable("distinct",n),l.update_variable("invalid",n>2),l.update_visual("right",{type:"pointer",position:t,label:"right"}),f(),g(),l.record("expand",`Include s[${t}] = '${e}', count['${e}'] = ${u.get(e)}`),l.add_conditional("too_many_distinct",n>2),f(),g(),l.record("check_distinct",n>2?`${n} distinct chars > 2: shrink from the left`:`${n} distinct char${1===n?"":"s"} ≤ 2: window is valid`);n>2;){let t=i[s];u.set(t,(u.get(t)||0)-1);let a=0===u.get(t);a&&(u.delete(t),t===x?x=null:t===p&&(p=null),m(e)),s++,n=u.size,l.update_variable("removed_char",t),l.update_variable("removed_gone",a),l.update_variable("counts",Object.fromEntries(u)),l.update_variable("left",s),l.update_variable("distinct",n),l.update_variable("invalid",n>2),l.update_visual("left",{type:"pointer",position:s,label:"left"}),f(),g(),l.add_conditional("too_many_distinct",n>2),l.record("shrink",a?`Drop '${t}', its count hit 0 so it leaves the map`:`Drop '${t}', count['${t}'] = ${u.get(t)}`)}let a=t-s+1,r=a>c,_=c;l.update_variable("window_size",a),l.update_variable("old_max",_),l.add_conditional("is_new_max",r),r?(c=a,o=s,d=t,l.update_variable("max_len",c),l.update_visual("maxRange",{type:"range",start:o,end:d,label:"max_len"}),f(),l.record("update_max",`window size ${a} > ${_}: new best [${o}..${d}], maxLen = ${c}`)):(f(),g(),l.record("keep_max",`window size ${a} ≤ ${c}: keep best, maxLen = ${c}`))}l.delete_visual("left"),l.delete_visual("right");for(let t=0;t<a;t++){let e=d>=0&&t>=o&&t<=d;l.update_visual(`elem_${t}`,{type:"arrayElement",value:i[t],position:t,...e?{state:"in_max"}:{}})}return g(),l.record("complete",`Longest substring with at most two distinct characters = ${c}`),l.getSteps()
}

export function LongestSubstringWithAtMostTwoDistinctCharactersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestSubstringWithAtMostTwoDistinctCharactersTemplates,
      generateSteps: (t: any) => {
        const recorded = generateLongestSubstringWithAtMostTwoDistinctCharactersSteps(t) as any[];
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
      title="Longest Substring With At Most Two Distinct Characters"
      slug="longest-substring-with-at-most-two-distinct-characters"
      approaches={approaches}
      presets={LongestSubstringWithAtMostTwoDistinctCharactersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Number of Vowels in a Substring of Given Length (maximum-number-of-vowels-in-a-substring-of-given-length)
// ==========================================

const MaximumNumberOfVowelsInASubstringOfGivenLengthTemplates = {
  "python": {
    "language": "python",
    "code": "def maxVowels(s, k):\n    vowels = set(\"aeiou\")\n\n    # Count vowels in the first window\n    current_count = sum(1 for c in s[:k] if c in vowels)\n    max_vowels = current_count\n\n    # Slide the window across the rest of the string\n    for i in range(k, len(s)):\n        # Remove outgoing character, add incoming character\n        if s[i - k] in vowels:\n            current_count -= 1\n        if s[i] in vowels:\n            current_count += 1\n        max_vowels = max(max_vowels, current_count)\n\n    return max_vowels",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        5
      ],
      "init_max": [
        6
      ],
      "slide_window": [
        11,
        12,
        13
      ],
      "update_max": [
        15
      ],
      "keep_max": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        5
      ],
      "is_vowel_remove": [
        11
      ],
      "is_vowel_add": [
        13
      ],
      "is_new_max": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxVowels(String s, int k) {\n    // Quick vowel lookup using a boolean array\n    boolean[] isVowel = new boolean[128];\n    isVowel['a'] = isVowel['e'] = isVowel['i'] = isVowel['o'] = isVowel['u'] = true;\n\n    // Count vowels in the first window\n    int currentCount = 0;\n    for (int i = 0; i < k; i++) {\n        if (isVowel[s.charAt(i)]) {\n            currentCount++;\n        }\n    }\n\n    int maxVowels = currentCount;\n\n    // Slide the window across the rest of the string\n    for (int i = k; i < s.length(); i++) {\n        // Remove outgoing character, add incoming character\n        if (isVowel[s.charAt(i - k)]) currentCount--;\n        if (isVowel[s.charAt(i)]) currentCount++;\n        maxVowels = Math.max(maxVowels, currentCount);\n    }\n\n    return maxVowels;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "init_max": [
        14
      ],
      "slide_window": [
        19,
        20
      ],
      "update_max": [
        21
      ],
      "keep_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        9
      ],
      "is_vowel_remove": [
        19
      ],
      "is_vowel_add": [
        20
      ],
      "is_new_max": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxVowels(string s, int k) {\n    // Quick vowel lookup using a boolean array\n    bool isVowel[128] = {};\n    isVowel['a'] = isVowel['e'] = isVowel['i'] = isVowel['o'] = isVowel['u'] = true;\n\n    // Count vowels in the first window\n    int currentCount = 0;\n    for (int i = 0; i < k; i++) {\n        if (isVowel[s[i]]) currentCount++;\n    }\n\n    int maxVowels = currentCount;\n\n    // Slide the window across the rest of the string\n    for (int i = k; i < (int)s.size(); i++) {\n        // Remove outgoing character, add incoming character\n        if (isVowel[s[i - k]]) currentCount--;\n        if (isVowel[s[i]]) currentCount++;\n        maxVowels = max(maxVowels, currentCount);\n    }\n\n    return maxVowels;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9
      ],
      "init_max": [
        12
      ],
      "slide_window": [
        17,
        18
      ],
      "update_max": [
        19
      ],
      "keep_max": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        9
      ],
      "is_vowel_remove": [
        17
      ],
      "is_vowel_add": [
        18
      ],
      "is_new_max": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxVowels(string s, int k) {\n    // Quick vowel lookup using a boolean array\n    bool[] isVowel = new bool[128];\n    isVowel['a'] = isVowel['e'] = isVowel['i'] = isVowel['o'] = isVowel['u'] = true;\n\n    // Count vowels in the first window\n    int currentCount = 0;\n    for (int i = 0; i < k; i++) {\n        if (isVowel[s[i]]) currentCount++;\n    }\n\n    int maxVowels = currentCount;\n\n    // Slide the window across the rest of the string\n    for (int i = k; i < s.Length; i++) {\n        // Remove outgoing character, add incoming character\n        if (isVowel[s[i - k]]) currentCount--;\n        if (isVowel[s[i]]) currentCount++;\n        maxVowels = Math.Max(maxVowels, currentCount);\n    }\n\n    return maxVowels;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9
      ],
      "init_max": [
        12
      ],
      "slide_window": [
        17,
        18
      ],
      "update_max": [
        19
      ],
      "keep_max": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        9
      ],
      "is_vowel_remove": [
        17
      ],
      "is_vowel_add": [
        18
      ],
      "is_new_max": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxVowels(s string, k int) int {\n    // Quick vowel lookup using a boolean array\n    isVowel := [128]bool{}\n    isVowel['a'] = true\n    isVowel['e'] = true\n    isVowel['i'] = true\n    isVowel['o'] = true\n    isVowel['u'] = true\n\n    // Count vowels in the first window\n    currentCount := 0\n    for i := 0; i < k; i++ {\n        if isVowel[s[i]] {\n            currentCount++\n        }\n    }\n\n    maxV := currentCount\n\n    // Slide the window across the rest of the string\n    for i := k; i < len(s); i++ {\n        // Remove outgoing character, add incoming character\n        if isVowel[s[i-k]] {\n            currentCount--\n        }\n        if isVowel[s[i]] {\n            currentCount++\n        }\n        if currentCount > maxV {\n            maxV = currentCount\n        }\n    }\n\n    return maxV\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        11,
        12,
        13,
        14
      ],
      "init_max": [
        18
      ],
      "slide_window": [
        23,
        24,
        25,
        26,
        27
      ],
      "update_max": [
        30
      ],
      "keep_max": [
        29
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        13
      ],
      "is_vowel_remove": [
        23
      ],
      "is_vowel_add": [
        26
      ],
      "is_new_max": [
        29
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxVowels(s, k) {\n    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n\n    // Count vowels in the first window\n    let currentCount = 0;\n    for (let i = 0; i < k; i++) {\n        if (vowels.has(s[i])) currentCount++;\n    }\n\n    let maxV = currentCount;\n\n    // Slide the window across the rest of the string\n    for (let i = k; i < s.length; i++) {\n        // Remove outgoing character, add incoming character\n        if (vowels.has(s[i - k])) currentCount--;\n        if (vowels.has(s[i])) currentCount++;\n        maxV = Math.max(maxV, currentCount);\n    }\n\n    return maxV;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        5,
        6,
        7
      ],
      "init_max": [
        10
      ],
      "slide_window": [
        15,
        16
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        7
      ],
      "is_vowel_remove": [
        15
      ],
      "is_vowel_add": [
        16
      ],
      "is_new_max": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxVowels(s: string, k: number): number {\n    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);\n\n    // Count vowels in the first window\n    let currentCount = 0;\n    for (let i = 0; i < k; i++) {\n        if (vowels.has(s[i])) currentCount++;\n    }\n\n    let maxV = currentCount;\n\n    // Slide the window across the rest of the string\n    for (let i = k; i < s.length; i++) {\n        // Remove outgoing character, add incoming character\n        if (vowels.has(s[i - k])) currentCount--;\n        if (vowels.has(s[i])) currentCount++;\n        maxV = Math.max(maxV, currentCount);\n    }\n\n    return maxV;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        5,
        6,
        7
      ],
      "init_max": [
        10
      ],
      "slide_window": [
        15,
        16
      ],
      "update_max": [
        17
      ],
      "keep_max": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_vowel_init": [
        7
      ],
      "is_vowel_remove": [
        15
      ],
      "is_vowel_add": [
        16
      ],
      "is_new_max": [
        17
      ]
    }
  }
};

const MaximumNumberOfVowelsInASubstringOfGivenLengthPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "abciiidef",
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "aeiou",
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "leetcode",
      "k": 3
    }
  },
  {
    "id": "ex4",
    "label": "No Vowels",
    "value": {
      "s": "rhythms",
      "k": 4
    }
  }
];

function generateMaximumNumberOfVowelsInASubstringOfGivenLengthSteps(e: any): any[] {
  let l=new Set(['a','e','i','o','u']);
let t=e.s,i=e.k,a=t.length,r=t.split("").reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),s=new StepRecorder({s:t,k:i},{...r});s.record("-",`Find max vowels in any substring of length ${i}`);let o=0;s.add_new_variable("currentCount",0);for(let e=0;e<i;e++){let i=t[e],n=l.has(i),a=o;n&&o++,s.update_variable("i",e),s.update_variable("char",i),s.update_variable("charIsVowel",n),s.update_variable("prevCount",a),s.update_variable("currentCount",o),s.update_visual("currentWindow",{type:"range",start:0,end:e}),s.add_conditional("is_vowel_init",n),s.record("init_window",n?`'${i}' is a vowel, currentCount = ${o}`:`'${i}' is not a vowel, currentCount stays ${o}`)}s.delete_variable("char"),s.delete_variable("charIsVowel"),s.delete_variable("prevCount");let d=o,c=0,u=i-1;s.add_new_variable("maxVowels",d),s.add_new_variable("maxStart",c),s.add_new_variable("maxEnd",u),s.update_visual("maxWindow",{type:"range",start:c,end:u}),s.record("init_max",`First window is the best so far, maxVowels = ${d}`);for(let e=i;e<a;e++){let n=e-i,a=t[n],r=l.has(a),x=t[e],h=l.has(x),m=o;r&&o--,h&&o++,s.update_variable("i",e),s.update_variable("prevCount",m),s.update_variable("removedIdx",n),s.update_variable("removedChar",a),s.update_variable("removedIsVowel",r),s.update_variable("addedChar",x),s.update_variable("addedIsVowel",h),s.update_variable("currentCount",o),s.update_visual("currentWindow",{type:"range",start:n+1,end:e}),s.add_conditional("is_vowel_remove",r),s.add_conditional("is_vowel_add",h),s.record("slide_window",`Slide right: drop '${a}'${r?" (vowel)":""}, add '${x}'${h?" (vowel)":""}, currentCount = ${o}`);let w=o>d,f=d;s.add_conditional("is_new_max",w),s.update_variable("oldMax",f),w?(d=o,c=n+1,u=e,s.update_variable("maxVowels",d),s.update_variable("maxStart",c),s.update_variable("maxEnd",u),s.update_visual("maxWindow",{type:"range",start:c,end:u}),s.record("update_max",`${o} > ${f}: new best window, maxVowels = ${d}`)):s.record("keep_max",`${o} <= ${d}: keep best window, maxVowels = ${d}`)}return s.delete_variable("prevCount"),s.delete_variable("removedIdx"),s.delete_variable("removedChar"),s.delete_variable("removedIsVowel"),s.delete_variable("addedChar"),s.delete_variable("addedIsVowel"),s.delete_visual("currentWindow"),s.record("complete",`Maximum vowels in any substring of length ${i} = ${d}, window [${c}..${u}]`),s.getSteps()
}

export function MaximumNumberOfVowelsInASubstringOfGivenLengthProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumNumberOfVowelsInASubstringOfGivenLengthTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumNumberOfVowelsInASubstringOfGivenLengthSteps(e) as any[];
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
      title="Maximum Number of Vowels in a Substring of Given Length"
      slug="maximum-number-of-vowels-in-a-substring-of-given-length"
      approaches={approaches}
      presets={MaximumNumberOfVowelsInASubstringOfGivenLengthPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Points You Can Obtain from Cards (maximum-points-you-can-obtain-from-cards)
// ==========================================

const MaximumPointsYouCanObtainFromCardsTemplates = {
  "python": {
    "language": "python",
    "code": "def maxScore(cardPoints, k):\n    n = len(cardPoints)\n\n    # Start by taking all k cards from the left\n    current_sum = sum(cardPoints[:k])\n    max_score = current_sum\n\n    # Swap one left card for one right card at a time\n    for i in range(1, k + 1):\n        current_sum -= cardPoints[k - i]    # Remove from left\n        current_sum += cardPoints[n - i]    # Add from right\n        max_score = max(max_score, current_sum)\n\n    return max_score",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5,
        6
      ],
      "take_left": [
        5,
        6
      ],
      "init_max": [
        6
      ],
      "swap_remove": [
        9,
        10
      ],
      "swap_add": [
        11
      ],
      "update_max": [
        12
      ],
      "keep_max": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxScore(int[] cardPoints, int k) {\n    int n = cardPoints.length;\n\n    // Start by taking all k cards from the left\n    int currentSum = 0;\n    for (int i = 0; i < k; i++) {\n        currentSum += cardPoints[i];\n    }\n\n    int maxScore = currentSum;\n\n    // Swap one left card for one right card at a time\n    for (int i = 1; i <= k; i++) {\n        currentSum -= cardPoints[k - i];    // Remove from left\n        currentSum += cardPoints[n - i];    // Add from right\n        maxScore = Math.max(maxScore, currentSum);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxScore(vector<int>& cardPoints, int k) {\n    int n = cardPoints.size();\n\n    // Start by taking all k cards from the left\n    int currentSum = 0;\n    for (int i = 0; i < k; i++) {\n        currentSum += cardPoints[i];\n    }\n\n    int maxScore = currentSum;\n\n    // Swap one left card for one right card at a time\n    for (int i = 1; i <= k; i++) {\n        currentSum -= cardPoints[k - i];    // Remove from left\n        currentSum += cardPoints[n - i];    // Add from right\n        maxScore = max(maxScore, currentSum);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxScore(int[] cardPoints, int k) {\n    int n = cardPoints.Length;\n\n    // Start by taking all k cards from the left\n    int currentSum = 0;\n    for (int i = 0; i < k; i++) {\n        currentSum += cardPoints[i];\n    }\n\n    int maxScore = currentSum;\n\n    // Swap one left card for one right card at a time\n    for (int i = 1; i <= k; i++) {\n        currentSum -= cardPoints[k - i];    // Remove from left\n        currentSum += cardPoints[n - i];    // Add from right\n        maxScore = Math.Max(maxScore, currentSum);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxScore(cardPoints []int, k int) int {\n    n := len(cardPoints)\n\n    // Start by taking all k cards from the left\n    currentSum := 0\n    for i := 0; i < k; i++ {\n        currentSum += cardPoints[i]\n    }\n\n    maxScore := currentSum\n\n    // Swap one left card for one right card at a time\n    for i := 1; i <= k; i++ {\n        currentSum -= cardPoints[k-i]  // Remove from left\n        currentSum += cardPoints[n-i]  // Add from right\n        if currentSum > maxScore {\n            maxScore = currentSum\n        }\n    }\n\n    return maxScore\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16,
        17
      ],
      "keep_max": [
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxScore(cardPoints, k) {\n  let n = cardPoints.length;\n\n  // Start by taking all k cards from the left\n  let currentSum = 0;\n  for (let i = 0; i < k; i++) {\n    currentSum += cardPoints[i];\n  }\n\n  let maxScore = currentSum;\n\n  // Swap one left card for one right card at a time\n  for (let i = 1; i <= k; i++) {\n    currentSum -= cardPoints[k - i]; // Remove from left\n    currentSum += cardPoints[n - i]; // Add from right\n    maxScore = Math.max(maxScore, currentSum);\n  }\n\n  return maxScore;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxScore(cardPoints: number[], k: number): number {\n    let n = cardPoints.length;\n\n    // Start by taking all k cards from the left\n    let currentSum = 0;\n    for (let i = 0; i < k; i++) {\n        currentSum += cardPoints[i];\n    }\n\n    let maxScore = currentSum;\n\n    // Swap one left card for one right card at a time\n    for (let i = 1; i <= k; i++) {\n        currentSum -= cardPoints[k - i];    // Remove from left\n        currentSum += cardPoints[n - i];    // Add from right\n        maxScore = Math.max(maxScore, currentSum);\n    }\n\n    return maxScore;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        5
      ],
      "take_left": [
        6,
        7
      ],
      "init_max": [
        10
      ],
      "swap_remove": [
        13,
        14
      ],
      "swap_add": [
        15
      ],
      "update_max": [
        16
      ],
      "keep_max": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_max": [
        16
      ]
    }
  }
};

const MaximumPointsYouCanObtainFromCardsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "cardPoints": [
        1,
        2,
        3,
        4,
        5,
        6,
        1
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "cardPoints": [
        2,
        2,
        2
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Take All",
    "value": {
      "cardPoints": [
        9,
        7,
        7,
        9,
        7,
        7,
        9
      ],
      "k": 7
    }
  },
  {
    "id": "ex4",
    "label": "Edge Case",
    "value": {
      "cardPoints": [
        1,
        1000,
        1
      ],
      "k": 1
    }
  }
];

function generateMaximumPointsYouCanObtainFromCardsSteps(e: any): any[] {
  let t=[...e.cardPoints],i=e.k,r=t.length,a=r-i,l=t.reduce((e,t)=>e+t,0),o=t.reduce((e,t,i)=>(e[`element_${i}`]={type:"arrayElement",value:t,position:i},e),{}),s=new StepRecorder({cardPoints:t,k:i,n:r,total:l,windowSize:a},{...o}),d=(e,i,n={})=>{t.forEach((t,r)=>{let a;a=r===n.entering?"entering":r===n.leaving?"leaving":r>=e&&r<=i?"window":"kept",s.update_visual(`element_${r}`,{type:"arrayElement",value:t,position:r,...a?{state:a}:{}})}),s.update_variable("win_lo",e),s.update_variable("win_hi",i)};if(s.record("-","Start: the cards you leave form one window of size n - k"),s.add_new_variable("windowSum",0),s.add_new_variable("minWindow",0),s.add_new_variable("answer",0),s.add_new_variable("best_lo",0),s.add_new_variable("best_hi",a-1),s.record("init",`total = ${l}, leftover window size = n - k = ${a}`),0===a)return s.update_variable("answer",l),t.forEach((e,t)=>{s.update_visual(`element_${t}`,{type:"arrayElement",value:e,position:t,state:"in_max"})}),s.record("take_all",`k = n, so take every card: answer = total = ${l}`),s.record("complete",`Maximum score from ${i} cards: ${l}`),s.getSteps();let c=0;for(let e=0;e<a;e++)c+=t[e];let m=c,u=0,h=a-1;s.update_variable("windowSum",c),s.update_variable("minWindow",m),s.update_variable("answer",l-m),d(0,a-1),s.record("first_window",`First window [0..${a-1}] sums to ${c}, minWindow = ${m}`);for(let e=a;e<r;e++){let i=e-a+1,n=e,r=c;s.update_variable("prev_sum",r),s.update_variable("added_val",t[e]),s.update_variable("removed_val",t[e-a]),c+=t[e]-t[e-a],s.update_variable("windowSum",c),d(i,n,{entering:n,leaving:i-1}),s.record("slide",`Slide right: +${t[e]} -${t[e-a]}, window [${i}..${n}] sums to ${c}`),s.update_variable("old_min",m);let o=c<m;s.add_conditional("is_new_min",o),o?(m=c,u=i,h=n,s.update_variable("minWindow",m),s.update_variable("answer",l-m),s.update_variable("best_lo",u),s.update_variable("best_hi",h),d(i,n),s.record("update_min",`windowSum ${c} < minWindow, new minWindow = ${m}, answer = ${l} - ${m} = ${l-m}`)):(d(i,n),s.record("keep_min",`windowSum ${c} does not beat minWindow ${m}`))}return t.forEach((e,t)=>{let i=t<u||t>h;s.update_visual(`element_${t}`,{type:"arrayElement",value:e,position:t,state:i?"in_max":"outside"})}),s.update_variable("answer",l-m),s.record("complete",`Maximum score = total - minWindow = ${l} - ${m} = ${l-m}`),s.getSteps()
}

export function MaximumPointsYouCanObtainFromCardsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumPointsYouCanObtainFromCardsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumPointsYouCanObtainFromCardsSteps(e) as any[];
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
      title="Maximum Points You Can Obtain from Cards"
      slug="maximum-points-you-can-obtain-from-cards"
      approaches={approaches}
      presets={MaximumPointsYouCanObtainFromCardsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Sum of Distinct Subarrays With Length K (maximum-sum-of-distinct-subarrays-with-length-k)
// ==========================================

const MaximumSumOfDistinctSubarraysWithLengthKTemplates = {
  "python": {
    "language": "python",
    "code": "def maximumSubarraySum(nums, k):\n    freq = {}\n    window_sum = 0\n    max_sum = 0\n\n    # Build the first window of size k\n    for i in range(k):\n        freq[nums[i]] = freq.get(nums[i], 0) + 1\n        window_sum += nums[i]\n    # Check if the first window has all distinct elements\n    if len(freq) == k:\n        max_sum = window_sum\n\n    # Slide the window across the rest of the array\n    for i in range(k, len(nums)):\n        # Add the new element entering the window\n        freq[nums[i]] = freq.get(nums[i], 0) + 1\n        window_sum += nums[i]\n\n        # Remove the element leaving the window\n        out_val = nums[i - k]\n        freq[out_val] -= 1\n        if freq[out_val] == 0:\n            del freq[out_val]\n        window_sum -= out_val\n\n        # Window is valid only when all k elements are distinct\n        if len(freq) == k:\n            max_sum = max(max_sum, window_sum)\n\n    return max_sum",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9
      ],
      "check_first_window": [
        11,
        12
      ],
      "slide_add": [
        17,
        18
      ],
      "slide_remove": [
        21,
        22,
        23,
        24,
        25
      ],
      "check_distinct": [
        28
      ],
      "update_max": [
        29
      ],
      "keep_max": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        11,
        28
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public long maximumSubarraySum(int[] nums, int k) {\n    Map<Integer, Integer> freq = new HashMap<>();\n    long windowSum = 0;\n    long maxSum = 0;\n\n    // Build the first window of size k\n    for (int i = 0; i < k; i++) {\n        freq.merge(nums[i], 1, Integer::sum);\n        windowSum += nums[i];\n    }\n    // Check if the first window has all distinct elements\n    if (freq.size() == k) {\n        maxSum = windowSum;\n    }\n\n    // Slide the window across the rest of the array\n    for (int i = k; i < nums.length; i++) {\n        // Add the new element entering the window\n        freq.merge(nums[i], 1, Integer::sum);\n        windowSum += nums[i];\n\n        // Remove the element leaving the window\n        int outVal = nums[i - k];\n        freq.merge(outVal, -1, Integer::sum);\n        if (freq.get(outVal) == 0) {\n            freq.remove(outVal);\n        }\n        windowSum -= outVal;\n\n        // Window is valid only when all k elements are distinct\n        if (freq.size() == k) {\n            maxSum = Math.max(maxSum, windowSum);\n        }\n    }\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "long long maximumSubarraySum(vector<int>& nums, int k) {\n    unordered_map<int, int> freq;\n    long long windowSum = 0;\n    long long maxSum = 0;\n\n    // Build the first window of size k\n    for (int i = 0; i < k; i++) {\n        freq[nums[i]]++;\n        windowSum += nums[i];\n    }\n    // Check if the first window has all distinct elements\n    if ((int)freq.size() == k) {\n        maxSum = windowSum;\n    }\n\n    // Slide the window across the rest of the array\n    for (int i = k; i < (int)nums.size(); i++) {\n        // Add the new element entering the window\n        freq[nums[i]]++;\n        windowSum += nums[i];\n\n        // Remove the element leaving the window\n        int outVal = nums[i - k];\n        freq[outVal]--;\n        if (freq[outVal] == 0) {\n            freq.erase(outVal);\n        }\n        windowSum -= outVal;\n\n        // Window is valid only when all k elements are distinct\n        if ((int)freq.size() == k) {\n            maxSum = max(maxSum, windowSum);\n        }\n    }\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public long MaximumSubarraySum(int[] nums, int k) {\n    var freq = new Dictionary<int, int>();\n    long windowSum = 0;\n    long maxSum = 0;\n\n    // Build the first window of size k\n    for (int i = 0; i < k; i++) {\n        freq[nums[i]] = freq.GetValueOrDefault(nums[i], 0) + 1;\n        windowSum += nums[i];\n    }\n    // Check if the first window has all distinct elements\n    if (freq.Count == k) {\n        maxSum = windowSum;\n    }\n\n    // Slide the window across the rest of the array\n    for (int i = k; i < nums.Length; i++) {\n        // Add the new element entering the window\n        freq[nums[i]] = freq.GetValueOrDefault(nums[i], 0) + 1;\n        windowSum += nums[i];\n\n        // Remove the element leaving the window\n        int outVal = nums[i - k];\n        freq[outVal]--;\n        if (freq[outVal] == 0) {\n            freq.Remove(outVal);\n        }\n        windowSum -= outVal;\n\n        // Window is valid only when all k elements are distinct\n        if (freq.Count == k) {\n            maxSum = Math.Max(maxSum, windowSum);\n        }\n    }\n    return maxSum;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumSubarraySum(nums []int, k int) int64 {\n    freq := make(map[int]int)\n    var windowSum int64 = 0\n    var maxSum int64 = 0\n\n    // Build the first window of size k\n    for i := 0; i < k; i++ {\n        freq[nums[i]]++\n        windowSum += int64(nums[i])\n    }\n    // Check if the first window has all distinct elements\n    if len(freq) == k {\n        maxSum = windowSum\n    }\n\n    // Slide the window across the rest of the array\n    for i := k; i < len(nums); i++ {\n        // Add the new element entering the window\n        freq[nums[i]]++\n        windowSum += int64(nums[i])\n\n        // Remove the element leaving the window\n        outVal := nums[i-k]\n        freq[outVal]--\n        if freq[outVal] == 0 {\n            delete(freq, outVal)\n        }\n        windowSum -= int64(outVal)\n\n        // Window is valid only when all k elements are distinct\n        if len(freq) == k {\n            if windowSum > maxSum {\n                maxSum = windowSum\n            }\n        }\n    }\n    return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        33
      ],
      "keep_max": [
        32
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maximumSubarraySum(nums, k) {\n  const freq = new Map()\n  let windowSum = 0\n  let maxSum = 0\n\n  // Build the first window of size k\n  for (let i = 0; i < k; i++) {\n    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)\n    windowSum += nums[i]\n  }\n  // Check if the first window has all distinct elements\n  if (freq.size === k) {\n    maxSum = windowSum\n  }\n\n  // Slide the window across the rest of the array\n  for (let i = k; i < nums.length; i++) {\n    // Add the new element entering the window\n    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)\n    windowSum += nums[i]\n\n    // Remove the element leaving the window\n    const outVal = nums[i - k]\n    freq.set(outVal, freq.get(outVal) - 1)\n    if (freq.get(outVal) === 0) {\n      freq.delete(outVal)\n    }\n    windowSum -= outVal\n\n    // Window is valid only when all k elements are distinct\n    if (freq.size === k) {\n      maxSum = Math.max(maxSum, windowSum)\n    }\n  }\n  return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumSubarraySum(nums: number[], k: number): number {\n  const freq = new Map<number, number>()\n  let windowSum = 0\n  let maxSum = 0\n\n  // Build the first window of size k\n  for (let i = 0; i < k; i++) {\n    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)\n    windowSum += nums[i]\n  }\n  // Check if the first window has all distinct elements\n  if (freq.size === k) {\n    maxSum = windowSum\n  }\n\n  // Slide the window across the rest of the array\n  for (let i = k; i < nums.length; i++) {\n    // Add the new element entering the window\n    freq.set(nums[i], (freq.get(nums[i]) || 0) + 1)\n    windowSum += nums[i]\n\n    // Remove the element leaving the window\n    const outVal = nums[i - k]\n    freq.set(outVal, freq.get(outVal)! - 1)\n    if (freq.get(outVal) === 0) {\n      freq.delete(outVal)\n    }\n    windowSum -= outVal\n\n    // Window is valid only when all k elements are distinct\n    if (freq.size === k) {\n      maxSum = Math.max(maxSum, windowSum)\n    }\n  }\n  return maxSum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_window": [
        7,
        8,
        9,
        10
      ],
      "check_first_window": [
        12,
        13,
        14
      ],
      "slide_add": [
        19,
        20
      ],
      "slide_remove": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "check_distinct": [
        31
      ],
      "update_max": [
        32
      ],
      "keep_max": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "all_distinct": [
        12,
        31
      ]
    }
  }
};

const MaximumSumOfDistinctSubarraysWithLengthKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        5,
        4,
        2,
        9,
        9,
        9
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "All Same",
    "value": {
      "nums": [
        4,
        4,
        4
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "All Distinct",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 3
    }
  },
  {
    "id": "ex4",
    "label": "Duplicates Then Distinct",
    "value": {
      "nums": [
        9,
        9,
        9,
        1,
        2,
        3
      ],
      "k": 3
    }
  }
];

function generateMaximumSumOfDistinctSubarraysWithLengthKSteps(e: any): any[] {
  let t=e.nums,i=e.k,l=t.length,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({nums:t,k:i},{...a});r.record("-","Start of algorithm");let s=0,d=-1,o=-1;r.add_new_variable("windowSum",0),r.add_new_variable("maxSum",0),r.record("init",`Check every window of size k = ${i}, keep the largest distinct-window sum`);let u=e=>{let t={};return e.forEach((e,i)=>{t[String(i)]=e}),t};for(let e=0;e+i<=l;e++){let n=e+i-1,l=new Map,a=0;r.update_variable("windowStart",e),r.update_variable("windowEnd",n),r.update_visual("currentWindow",{type:"range",start:e,end:n});for(let i=e;i<=n;i++){let e=a,n=t[i];l.set(n,(l.get(n)||0)+1),a+=n,r.update_variable("i",i),r.update_variable("addVal",n),r.update_variable("prevSum",e),r.update_variable("windowSum",a),r.update_variable("freq",u(l)),r.update_variable("distinctCount",l.size),r.record("accumulate",`Add nums[${i}] = ${n}, windowSum = ${a}${(l.get(n)||0)>1?" (duplicate)":""}`)}let m=l.size===i;if(r.update_variable("distinctCount",l.size),r.update_variable("isDistinct",m),r.add_conditional("all_distinct",m),r.delete_variable("addVal"),m){let t=a>s,l=s;r.update_variable("oldMax",l),t?(s=a,d=e,o=n,r.update_variable("maxSum",s),r.update_variable("bestStart",d),r.update_variable("bestEnd",o),r.update_visual("maxWindow",{type:"range",start:d,end:o}),r.record("update_max",`All ${i} distinct and ${a} > ${l}: new best window, maxSum = ${s}`)):r.record("keep_max",`All ${i} distinct but ${a} <= ${s}: keep best window`)}else r.record("skip_window",`Only ${l.size} distinct of ${i} needed, skip this window`)}return r.delete_variable("prevSum"),r.delete_variable("addVal"),r.delete_variable("i"),r.delete_visual("currentWindow"),r.record("complete",d>=0?`Maximum sum of a distinct subarray = ${s}, window [${d}..${o}]`:`No window of length ${i} has all distinct elements, maxSum = 0`),r.getSteps()
}

export function MaximumSumOfDistinctSubarraysWithLengthKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumSumOfDistinctSubarraysWithLengthKTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumSumOfDistinctSubarraysWithLengthKSteps(e) as any[];
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
      title="Maximum Sum of Distinct Subarrays With Length K"
      slug="maximum-sum-of-distinct-subarrays-with-length-k"
      approaches={approaches}
      presets={MaximumSumOfDistinctSubarraysWithLengthKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Window Subsequence (minimum-window-subsequence)
// ==========================================

const MinimumWindowSubsequenceTemplates = {
  "python": {
    "language": "python",
    "code": "def minWindow(s1, s2):\n    n, m = len(s1), len(s2)\n    best_start, best_len = -1, n + 1\n    i = 0\n\n    while i < n:\n        # Forward pass: match all characters of s2\n        j = 0\n        while i < n and j < m:\n            if s1[i] == s2[j]:\n                j += 1\n            i += 1\n        if j < m:\n            break  # No more valid windows\n\n        # i is now one past the right endpoint\n        right = i - 1\n\n        # Backward pass: tighten the left endpoint\n        j = m - 1\n        while j >= 0:\n            if s1[right] == s2[j]:\n                j -= 1\n            right -= 1\n        left = right + 1\n\n        # Update best window\n        window_len = (i - 1) - left + 1\n        if window_len < best_len:\n            best_len = window_len\n            best_start = left\n\n        # Continue search from left + 1\n        i = left + 1\n\n    return \"\" if best_start == -1 else s1[best_start:best_start + best_len]",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        12
      ],
      "forward_done": [
        17
      ],
      "no_more_windows": [
        13,
        14
      ],
      "backward_start": [
        20,
        21
      ],
      "backward_match": [
        22,
        23
      ],
      "backward_advance": [
        22,
        24
      ],
      "backward_done": [
        25,
        28
      ],
      "update_best": [
        29,
        30,
        31
      ],
      "keep_best": [
        29
      ],
      "next_search": [
        34
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        13
      ],
      "is_shorter": [
        29
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public String minWindow(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int bestStart = -1, bestLen = n + 1;\n    int i = 0;\n\n    while (i < n) {\n        // Forward pass: match all characters of s2\n        int j = 0;\n        while (i < n && j < m) {\n            if (s1.charAt(i) == s2.charAt(j)) {\n                j++;\n            }\n            i++;\n        }\n        if (j < m) break; // No more valid windows\n\n        // i is now one past the right endpoint\n        int right = i - 1;\n\n        // Backward pass: tighten the left endpoint\n        j = m - 1;\n        while (j >= 0) {\n            if (s1.charAt(right) == s2.charAt(j)) {\n                j--;\n            }\n            right--;\n        }\n        int left = right + 1;\n\n        // Update best window\n        int windowLen = (i - 1) - left + 1;\n        if (windowLen < bestLen) {\n            bestLen = windowLen;\n            bestStart = left;\n        }\n\n        // Continue search from left + 1\n        i = left + 1;\n    }\n\n    return bestStart == -1 ? \"\" : s1.substring(bestStart, bestStart + bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        13
      ],
      "forward_done": [
        18
      ],
      "no_more_windows": [
        15
      ],
      "backward_start": [
        21,
        22
      ],
      "backward_match": [
        23,
        24
      ],
      "backward_advance": [
        23,
        26
      ],
      "backward_done": [
        28,
        31
      ],
      "update_best": [
        32,
        33,
        34
      ],
      "keep_best": [
        32
      ],
      "next_search": [
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        15
      ],
      "is_shorter": [
        32
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "string minWindow(string s1, string s2) {\n    int n = s1.size(), m = s2.size();\n    int bestStart = -1, bestLen = n + 1;\n    int i = 0;\n\n    while (i < n) {\n        // Forward pass: match all characters of s2\n        int j = 0;\n        while (i < n && j < m) {\n            if (s1[i] == s2[j]) {\n                j++;\n            }\n            i++;\n        }\n        if (j < m) break; // No more valid windows\n\n        // i is now one past the right endpoint\n        int right = i - 1;\n\n        // Backward pass: tighten the left endpoint\n        j = m - 1;\n        while (j >= 0) {\n            if (s1[right] == s2[j]) {\n                j--;\n            }\n            right--;\n        }\n        int left = right + 1;\n\n        // Update best window\n        int windowLen = (i - 1) - left + 1;\n        if (windowLen < bestLen) {\n            bestLen = windowLen;\n            bestStart = left;\n        }\n\n        // Continue search from left + 1\n        i = left + 1;\n    }\n\n    return bestStart == -1 ? \"\" : s1.substr(bestStart, bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        13
      ],
      "forward_done": [
        18
      ],
      "no_more_windows": [
        15
      ],
      "backward_start": [
        21,
        22
      ],
      "backward_match": [
        23,
        24
      ],
      "backward_advance": [
        23,
        26
      ],
      "backward_done": [
        28,
        31
      ],
      "update_best": [
        32,
        33,
        34
      ],
      "keep_best": [
        32
      ],
      "next_search": [
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        15
      ],
      "is_shorter": [
        32
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public string MinWindow(string s1, string s2) {\n    int n = s1.Length, m = s2.Length;\n    int bestStart = -1, bestLen = n + 1;\n    int i = 0;\n\n    while (i < n) {\n        // Forward pass: match all characters of s2\n        int j = 0;\n        while (i < n && j < m) {\n            if (s1[i] == s2[j]) {\n                j++;\n            }\n            i++;\n        }\n        if (j < m) break; // No more valid windows\n\n        // i is now one past the right endpoint\n        int right = i - 1;\n\n        // Backward pass: tighten the left endpoint\n        j = m - 1;\n        while (j >= 0) {\n            if (s1[right] == s2[j]) {\n                j--;\n            }\n            right--;\n        }\n        int left = right + 1;\n\n        // Update best window\n        int windowLen = (i - 1) - left + 1;\n        if (windowLen < bestLen) {\n            bestLen = windowLen;\n            bestStart = left;\n        }\n\n        // Continue search from left + 1\n        i = left + 1;\n    }\n\n    return bestStart == -1 ? \"\" : s1.Substring(bestStart, bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        13
      ],
      "forward_done": [
        18
      ],
      "no_more_windows": [
        15
      ],
      "backward_start": [
        21,
        22
      ],
      "backward_match": [
        23,
        24
      ],
      "backward_advance": [
        23,
        26
      ],
      "backward_done": [
        28,
        31
      ],
      "update_best": [
        32,
        33,
        34
      ],
      "keep_best": [
        32
      ],
      "next_search": [
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        15
      ],
      "is_shorter": [
        32
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minWindow(s1 string, s2 string) string {\n    n, m := len(s1), len(s2)\n    bestStart, bestLen := -1, n+1\n    i := 0\n\n    for i < n {\n        // Forward pass: match all characters of s2\n        j := 0\n        for i < n && j < m {\n            if s1[i] == s2[j] {\n                j++\n            }\n            i++\n        }\n        if j < m {\n            break // No more valid windows\n        }\n\n        // i is now one past the right endpoint\n        right := i - 1\n\n        // Backward pass: tighten the left endpoint\n        j = m - 1\n        for j >= 0 {\n            if s1[right] == s2[j] {\n                j--\n            }\n            right--\n        }\n        left := right + 1\n\n        // Update best window\n        windowLen := (i - 1) - left + 1\n        if windowLen < bestLen {\n            bestLen = windowLen\n            bestStart = left\n        }\n\n        // Continue search from left + 1\n        i = left + 1\n    }\n\n    if bestStart == -1 {\n        return \"\"\n    }\n    return s1[bestStart : bestStart+bestLen]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        13
      ],
      "forward_done": [
        20
      ],
      "no_more_windows": [
        15,
        16
      ],
      "backward_start": [
        23,
        24
      ],
      "backward_match": [
        25,
        26
      ],
      "backward_advance": [
        25,
        28
      ],
      "backward_done": [
        30,
        33
      ],
      "update_best": [
        34,
        35,
        36
      ],
      "keep_best": [
        34
      ],
      "next_search": [
        40
      ],
      "complete": [
        43,
        44,
        46
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        15
      ],
      "is_shorter": [
        34
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minWindow(s1, s2) {\n  const n = s1.length,\n    m = s2.length;\n  let bestStart = -1,\n    bestLen = n + 1;\n  let i = 0;\n\n  while (i < n) {\n    // Forward pass: match all characters of s2\n    let j = 0;\n    while (i < n && j < m) {\n      if (s1[i] === s2[j]) {\n        j++;\n      }\n      i++;\n    }\n    if (j < m) break; // No more valid windows\n\n    // i is now one past the right endpoint\n    let right = i - 1;\n\n    // Backward pass: tighten the left endpoint\n    j = m - 1;\n    while (j >= 0) {\n      if (s1[right] === s2[j]) {\n        j--;\n      }\n      right--;\n    }\n    const left = right + 1;\n\n    // Update best window\n    const windowLen = i - 1 - left + 1;\n    if (windowLen < bestLen) {\n      bestLen = windowLen;\n      bestStart = left;\n    }\n\n    // Continue search from left + 1\n    i = left + 1;\n  }\n\n  return bestStart === -1 ? \"\" : s1.substring(bestStart, bestStart + bestLen);\n}",
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
      "forward_start": [
        8,
        10
      ],
      "forward_match": [
        12,
        13
      ],
      "forward_advance": [
        12,
        15
      ],
      "forward_done": [
        20
      ],
      "no_more_windows": [
        17
      ],
      "backward_start": [
        23,
        24
      ],
      "backward_match": [
        25,
        26
      ],
      "backward_advance": [
        25,
        28
      ],
      "backward_done": [
        30,
        33
      ],
      "update_best": [
        34,
        35,
        36
      ],
      "keep_best": [
        34
      ],
      "next_search": [
        40
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "chars_match": [
        12
      ],
      "all_matched": [
        17
      ],
      "is_shorter": [
        34
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minWindow(s1: string, s2: string): string {\n    const n = s1.length, m = s2.length;\n    let bestStart = -1, bestLen = n + 1;\n    let i = 0;\n\n    while (i < n) {\n        // Forward pass: match all characters of s2\n        let j = 0;\n        while (i < n && j < m) {\n            if (s1[i] === s2[j]) {\n                j++;\n            }\n            i++;\n        }\n        if (j < m) break; // No more valid windows\n\n        // i is now one past the right endpoint\n        let right = i - 1;\n\n        // Backward pass: tighten the left endpoint\n        j = m - 1;\n        while (j >= 0) {\n            if (s1[right] === s2[j]) {\n                j--;\n            }\n            right--;\n        }\n        const left = right + 1;\n\n        // Update best window\n        const windowLen = (i - 1) - left + 1;\n        if (windowLen < bestLen) {\n            bestLen = windowLen;\n            bestStart = left;\n        }\n\n        // Continue search from left + 1\n        i = left + 1;\n    }\n\n    return bestStart === -1 ? \"\" : s1.substring(bestStart, bestStart + bestLen);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "forward_start": [
        6,
        8
      ],
      "forward_match": [
        10,
        11
      ],
      "forward_advance": [
        10,
        13
      ],
      "forward_done": [
        18
      ],
      "no_more_windows": [
        15
      ],
      "backward_start": [
        21,
        22
      ],
      "backward_match": [
        23,
        24
      ],
      "backward_advance": [
        23,
        26
      ],
      "backward_done": [
        28,
        31
      ],
      "update_best": [
        32,
        33,
        34
      ],
      "keep_best": [
        32
      ],
      "next_search": [
        38
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "chars_match": [
        10
      ],
      "all_matched": [
        15
      ],
      "is_shorter": [
        32
      ]
    }
  }
};

const MinimumWindowSubsequencePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "s1": "abcdebdde",
      "s2": "bde"
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "s1": "fgrqsqsnodw",
      "s2": "gw"
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "s1": "abcdef",
      "s2": "bf"
    }
  },
  {
    "id": "ex4",
    "label": "No Window",
    "value": {
      "s1": "abcdef",
      "s2": "afz"
    }
  }
];

function generateMinimumWindowSubsequenceSteps(e: any): any[] {
  let t=e.s1,i=e.s2,a=t.length,s=i.length,r={};for(let e=0;e<a;e++)for(let t=0;t<s;t++)r[`cell_${e}_${t}`]={type:"matrixElement",value:-1,row:e,col:t};let l=new StepRecorder({s1:t,s2:i,n:a,m:s},r),o=Array.from({length:a},()=>Array(s).fill(-1)),d=a+1,c=-1,p=-1,h=()=>{l.update_variable("bestLen",-1===c?"∞":d),l.update_variable("best_start",c),l.update_variable("best_end",p)};l.record("-","Start of algorithm"),l.add_new_variable("bestLen","∞"),l.add_new_variable("best_start",-1),l.add_new_variable("best_end",-1),l.record("init","dp[i][j] = earliest start index of a window ending at or before s1[i] that covers s2[0..j]; every entry starts at -1");for(let e=0;e<a;e++)for(let n=0;n<s;n++){let a=t[e]===i[n],s=-1,r=-1;a?0===n?o[e][n]=e:e>0&&-1!==o[e-1][n-1]&&(s=e-1,r=n-1,o[e][n]=o[e-1][n-1]):e>0&&(s=e-1,r=n,o[e][n]=o[e-1][n]),l.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:o[e][n],row:e,col:n,...a&&0===n?{state:"base"}:{}}),l.update_variable("cur_i",e),l.update_variable("cur_j",n),l.update_variable("src_i",s),l.update_variable("src_j",r),l.update_variable("ch1",t[e]),l.update_variable("ch2",i[n]),l.add_conditional("chars_match",a),h(),a&&0===n?l.record("base_case",`s1[${e}] = '${t[e]}' = s2[0]: a window can start here, dp[${e}][0] = ${e}`):l.record(a?"fill_match":"fill_nomatch",a?`s1[${e}] = '${t[e]}' = s2[${n}]: extend the diagonal, dp[${e}][${n}] = ${o[e][n]}`:`s1[${e}] = '${t[e]}' ≠ s2[${n}] = '${i[n]}': carry down, dp[${e}][${n}] = ${o[e][n]}`)}for(let e=0;e<a;e++){if(0===s||-1===o[e][s-1])continue;let i=o[e][s-1],n=e-i+1,a=n<d;l.update_variable("cur_i",e),l.update_variable("cur_j",s-1),l.update_variable("src_i",-1),l.update_variable("src_j",-1),l.update_variable("cand_start",i),l.update_variable("cand_end",e),l.update_variable("windowLen",n),l.add_conditional("is_shorter",a),a?(d=n,c=i,p=e,h(),l.record("update_best",`last column: window s1[${i}..${e}] length ${n} < best: new best "${t.substring(i,e+1)}"`)):(h(),l.record("keep_best",`last column: window length ${n} ≥ best ${d}: keep best`))}return l.update_variable("cur_i",-1),l.update_variable("cur_j",-1),h(),-1===c?(l.update_variable("bestLen","∞"),l.record("complete",`No window of s1 contains "${i}" as a subsequence`)):(l.update_visual(`cell_${p}_${s-1}`,{type:"matrixElement",value:c,row:p,col:s-1,state:"best_cell"}),l.update_variable("bestLen",d),l.record("complete",`Minimum window subsequence = "${t.substring(c,c+d)}" (length ${d})`)),l.getSteps()
}

export function MinimumWindowSubsequenceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumWindowSubsequenceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumWindowSubsequenceSteps(e) as any[];
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
      title="Minimum Window Subsequence"
      slug="minimum-window-subsequence"
      approaches={approaches}
      presets={MinimumWindowSubsequencePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Partition Array Such That Maximum Difference Is K (partition-array-max-difference-k)
// ==========================================

const PartitionArrayMaxDifferenceKTemplates = {
  "python": {
    "language": "python",
    "code": "def partitionArray(nums, k):\n    nums.sort()\n    partitions = 1\n    group_min = nums[0]\n    for i in range(1, len(nums)):\n        if nums[i] - group_min > k:\n            partitions += 1\n            group_min = nums[i]\n    return partitions",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int partitionArray(int[] nums, int k) {\n    Arrays.sort(nums);\n    int partitions = 1;\n    int groupMin = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] - groupMin > k) {\n            partitions++;\n            groupMin = nums[i];\n        }\n    }\n    return partitions;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int partitionArray(vector<int>& nums, int k) {\n    sort(nums.begin(), nums.end());\n    int partitions = 1;\n    int groupMin = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        if (nums[i] - groupMin > k) {\n            partitions++;\n            groupMin = nums[i];\n        }\n    }\n    return partitions;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int PartitionArray(int[] nums, int k) {\n    Array.Sort(nums);\n    int partitions = 1;\n    int groupMin = nums[0];\n    for (int i = 1; i < nums.Length; i++) {\n        if (nums[i] - groupMin > k) {\n            partitions++;\n            groupMin = nums[i];\n        }\n    }\n    return partitions;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func partitionArray(nums []int, k int) int {\n    sort.Ints(nums)\n    partitions := 1\n    groupMin := nums[0]\n    for i := 1; i < len(nums); i++ {\n        if nums[i] - groupMin > k {\n            partitions++\n            groupMin = nums[i]\n        }\n    }\n    return partitions\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var partitionArray = function(nums, k) {\n    nums.sort((a, b) => a - b);\n    let partitions = 1;\n    let groupMin = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] - groupMin > k) {\n            partitions++;\n            groupMin = nums[i];\n        }\n    }\n    return partitions;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function partitionArray(nums: number[], k: number): number {\n    nums.sort((a, b) => a - b);\n    let partitions = 1;\n    let groupMin = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        if (nums[i] - groupMin > k) {\n            partitions++;\n            groupMin = nums[i];\n        }\n    }\n    return partitions;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init": [
        3,
        4
      ],
      "iterate": [
        5
      ],
      "check_diff": [
        6
      ],
      "new_group": [
        7,
        8
      ],
      "same_group": [
        5
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_diff": [
        6
      ]
    }
  }
};

const PartitionArrayMaxDifferenceKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        3,
        6,
        1,
        2,
        5
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
        2,
        3
      ],
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Larger",
    "value": {
      "nums": [
        2,
        2,
        4,
        5,
        7,
        8,
        10
      ],
      "k": 3
    }
  }
];

function generatePartitionArrayMaxDifferenceKSteps(e: any): any[] {
  let t=[...e.nums],r=e.k,i=[...t].sort((e,t)=>e-t),a=i.length,s=new StepRecorder({}),l=(e,t)=>{for(let[n,i]of(s.update_variable("nums",e),s.update_variable("k",r),Object.entries(t)))s.update_variable(n,i)},o=()=>{for(let e of["segments","groupCount","allValid","attemptNum","searched"])s.delete_variable(e)};o(),l(t,{}),s.record("-",`Sort, then try every grouping. Keep each group's max − min ≤ ${r}.`),l(i,{}),s.record("sort",`Sort the array: [${i.join(", ")}].`);let u=e=>{let t=[0,...e,a],n=[];for(let e=0;e<t.length-1;e++){let a=t[e],s=t[e+1]-1,l=i[s]-i[a];n.push({start:a,end:s,diff:l,valid:l<=r})}return n},d=0,p=0,c=null,f=0,m=0;for(let e=1;e<=a;e++){let t=[],n=o=>{if(t.length===e-1){d++;let n=u([...t]),a=n.every(e=>e.valid);return p<7&&(l(i,{segments:n.map(e=>({...e})),groupCount:e,attemptNum:d}),s.record("try",`Try ${e} group${e>1?"s":""}: split into ${n.map(e=>`[${i.slice(e.start,e.end+1).join(",")}]`).join(" ")}.`),l(i,{segments:n.map(e=>({...e})),groupCount:e,allValid:a,attemptNum:d}),s.record("check",a?`Every group has range ≤ ${r}: ${e} groups works!`:`A group exceeds ${r}, this split is invalid.`),p++),!!a&&(c=n,f=e,m=d,!0)}for(let r=o;r<=a-1-(e-1-t.length)+1;r++){if(t.push(r),n(r+1))return!0;t.pop()}return!1};if(n(1))break}return!(m<=p)&&c&&(o(),l(i,{searched:d}),s.record("searching",`Checked ${d} grouping(s)... the fewest valid groups is ${f}.`),l(i,{segments:c.map(e=>({...e})),groupCount:f,attemptNum:m}),s.record("try",`The winning split uses ${f} group(s).`),l(i,{segments:c.map(e=>({...e})),groupCount:f,allValid:!0,attemptNum:m}),s.record("check",`Every group has range ≤ ${r}: ${f} groups works!`)),o(),l(i,{segments:c?c.map(e=>({...e})):[],groupCount:f,result:f}),s.record("found",`Fewest groups = ${f}.`),l(i,{segments:c?c.map(e=>({...e})):[],groupCount:f,result:f}),s.record("complete",`Done! The array needs ${f} group${f>1?"s":""}.`),s.getSteps()
}

export function PartitionArrayMaxDifferenceKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PartitionArrayMaxDifferenceKTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePartitionArrayMaxDifferenceKSteps(e) as any[];
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
      title="Partition Array Such That Maximum Difference Is K"
      slug="partition-array-max-difference-k"
      approaches={approaches}
      presets={PartitionArrayMaxDifferenceKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subarray Product Less Than K (subarray-product-less-than-k)
// ==========================================

const SubarrayProductLessThanKTemplates = {
  "python": {
    "language": "python",
    "code": "def numSubarrayProductLessThanK(nums, k):\n    if k <= 1:\n        return 0\n    count = 0\n    product = 1\n    left = 0\n\n    for right in range(len(nums)):\n        product *= nums[right]\n\n        # Shrink window until product is below k\n        while product >= k:\n            product //= nums[left]\n            left += 1\n\n        # All subarrays ending at right with start >= left are valid\n        count += right - left + 1\n\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        4,
        5,
        6
      ],
      "check_k": [
        2,
        3
      ],
      "expand": [
        8
      ],
      "multiply": [
        9
      ],
      "check_product": [
        12
      ],
      "divide": [
        13
      ],
      "shrink": [
        14
      ],
      "add_count": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int numSubarrayProductLessThanK(int[] nums, int k) {\n    if (k <= 1) return 0;\n    int count = 0;\n    int product = 1;\n    int left = 0;\n\n    for (int right = 0; right < nums.length; right++) {\n        product *= nums[right];\n\n        // Shrink window until product is below k\n        while (product >= k) {\n            product /= nums[left];\n            left++;\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4,
        5
      ],
      "check_k": [
        2
      ],
      "expand": [
        7
      ],
      "multiply": [
        8
      ],
      "check_product": [
        11
      ],
      "divide": [
        12
      ],
      "shrink": [
        13
      ],
      "add_count": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int numSubarrayProductLessThanK(vector<int>& nums, int k) {\n    if (k <= 1) return 0;\n    int count = 0;\n    int product = 1;\n    int left = 0;\n\n    for (int right = 0; right < nums.size(); right++) {\n        product *= nums[right];\n\n        // Shrink window until product is below k\n        while (product >= k) {\n            product /= nums[left];\n            left++;\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4,
        5
      ],
      "check_k": [
        2
      ],
      "expand": [
        7
      ],
      "multiply": [
        8
      ],
      "check_product": [
        11
      ],
      "divide": [
        12
      ],
      "shrink": [
        13
      ],
      "add_count": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int NumSubarrayProductLessThanK(int[] nums, int k) {\n    if (k <= 1) return 0;\n    int count = 0;\n    int product = 1;\n    int left = 0;\n\n    for (int right = 0; right < nums.Length; right++) {\n        product *= nums[right];\n\n        // Shrink window until product is below k\n        while (product >= k) {\n            product /= nums[left];\n            left++;\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4,
        5
      ],
      "check_k": [
        2
      ],
      "expand": [
        7
      ],
      "multiply": [
        8
      ],
      "check_product": [
        11
      ],
      "divide": [
        12
      ],
      "shrink": [
        13
      ],
      "add_count": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numSubarrayProductLessThanK(nums []int, k int) int {\n    if k <= 1 {\n        return 0\n    }\n    count := 0\n    product := 1\n    left := 0\n\n    for right := 0; right < len(nums); right++ {\n        product *= nums[right]\n\n        // Shrink window until product is below k\n        for product >= k {\n            product /= nums[left]\n            left++\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6,
        7
      ],
      "check_k": [
        2,
        3
      ],
      "expand": [
        9
      ],
      "multiply": [
        10
      ],
      "check_product": [
        13
      ],
      "divide": [
        14
      ],
      "shrink": [
        15
      ],
      "add_count": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function numSubarrayProductLessThanK(nums, k) {\n    if (k <= 1) return 0;\n    let count = 0;\n    let product = 1;\n    let left = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        product *= nums[right];\n\n        // Shrink window until product is below k\n        while (product >= k) {\n            product /= nums[left];\n            left++;\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4,
        5
      ],
      "check_k": [
        2
      ],
      "expand": [
        7
      ],
      "multiply": [
        8
      ],
      "check_product": [
        11
      ],
      "divide": [
        12
      ],
      "shrink": [
        13
      ],
      "add_count": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numSubarrayProductLessThanK(nums: number[], k: number): number {\n    if (k <= 1) return 0;\n    let count = 0;\n    let product = 1;\n    let left = 0;\n\n    for (let right = 0; right < nums.length; right++) {\n        product *= nums[right];\n\n        // Shrink window until product is below k\n        while (product >= k) {\n            product /= nums[left];\n            left++;\n        }\n\n        // All subarrays ending at right with start >= left are valid\n        count += right - left + 1;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4,
        5
      ],
      "check_k": [
        2
      ],
      "expand": [
        7
      ],
      "multiply": [
        8
      ],
      "check_product": [
        11
      ],
      "divide": [
        12
      ],
      "shrink": [
        13
      ],
      "add_count": [
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "k_too_small": [
        2
      ],
      "product_too_large": [
        11
      ]
    }
  }
};

const SubarrayProductLessThanKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        10,
        5,
        2,
        6
      ],
      "k": 100
    }
  },
  {
    "id": "ex2",
    "label": "k = 0",
    "value": {
      "nums": [
        1,
        2,
        3
      ],
      "k": 0
    }
  },
  {
    "id": "ex3",
    "label": "All Ones",
    "value": {
      "nums": [
        1,
        1,
        1,
        1
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "Longer",
    "value": {
      "nums": [
        10,
        9,
        10,
        4,
        3,
        8,
        3,
        3,
        6,
        2,
        10,
        10
      ],
      "k": 19
    }
  }
];

function generateSubarrayProductLessThanKSteps(t: any): any[] {
  let e=t.nums,n=t.k,r=e.length,l=e.reduce((t,e,n)=>(t[`elem_${n}`]={type:"arrayElement",value:e,position:n},t),{}),a=new StepRecorder({nums:e,k:n},{...l});if(a.record("-","Start of algorithm"),n<=1)return a.add_new_variable("k",n),a.add_new_variable("count",0),a.add_conditional("k_too_small",!0),a.record("check_k",`k = ${n} ≤ 1: a product of positive integers is always ≥ 1, so no subarray qualifies. Return 0.`),a.add_conditional("k_too_small",!0),a.record("complete","Result: count = 0"),a.getSteps();let o=0,d=1,u=0;a.add_new_variable("k",n),a.add_new_variable("count",o),a.add_new_variable("product",d),a.add_new_variable("left",u),a.update_visual("left",{type:"pointer",position:u,label:"left"}),a.add_conditional("k_too_small",!1),a.record("init","Initialize count = 0, product = 1, left = 0");let s=(t=-1,n=-1)=>{for(let i=0;i<r;i++){let r=i===t?"checking":i===n?"dropping":i<u?"outside":void 0;a.update_visual(`elem_${i}`,{type:"arrayElement",value:e[i],position:i,...r?{state:r}:{}})}};for(let t=0;t<r;t++){a.update_variable("right",t),a.update_visual("right",{type:"pointer",position:t,label:"right"}),a.update_variable("added_val",e[t]),a.update_variable("invalid",!1),s(t),a.add_conditional("k_too_small",!1),a.add_conditional("product_too_large",!1),a.record("expand",`Move right to index ${t}: nums[${t}] = ${e[t]} joins the window`);let i=d;for(d*=e[t],a.update_variable("old_product",i),a.update_variable("product",d),a.update_variable("invalid",d>=n),a.add_conditional("k_too_small",!1),a.add_conditional("product_too_large",!1),a.record("multiply",`product = ${i} \xd7 ${e[t]} = ${d}`);d>=n;){a.update_variable("invalid",!0),s(-1,u),a.add_conditional("product_too_large",!0),a.record("check_product",`product = ${d} ≥ k = ${n}: window is invalid, shrink from the left`);let t=e[u],i=d;d/=t,a.update_variable("old_product",i),a.update_variable("removed_val",t),a.update_variable("product",d),a.add_conditional("product_too_large",!0),a.record("divide",`product = ${i} \xf7 ${t} = ${d}`),u++,a.update_variable("left",u),a.update_visual("left",{type:"pointer",position:u,label:"left"}),a.update_variable("invalid",d>=n),s(),a.add_conditional("product_too_large",d>=n),a.record("shrink",`left = ${u}, product = ${d} ${d>=n?"≥":"<"} k = ${n}`)}let r=t-u+1,l=o;o+=r,a.update_variable("old_count",l),a.update_variable("subarraysAdded",r),a.update_variable("count",o),a.update_variable("invalid",!1),s(),a.add_conditional("k_too_small",!1),a.add_conditional("product_too_large",!1),a.record("add_count",`count += (${t} - ${u} + 1) = ${r} subarrays ending at ${t}, count = ${o}`)}a.delete_visual("left"),a.delete_visual("right");for(let t=0;t<r;t++)a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t});return a.add_conditional("k_too_small",!1),a.add_conditional("product_too_large",!1),a.record("complete",`Result: count = ${o}`),a.getSteps()
}

export function SubarrayProductLessThanKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubarrayProductLessThanKTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSubarrayProductLessThanKSteps(t) as any[];
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
      title="Subarray Product Less Than K"
      slug="subarray-product-less-than-k"
      approaches={approaches}
      presets={SubarrayProductLessThanKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subarrays with K Different Integers (subarrays-with-k-different-integers)
// ==========================================

const SubarraysWithKDifferentIntegersTemplates = {
  "python": {
    "language": "python",
    "code": "def subarraysWithKDistinct(nums, k):\n    def at_most(k):\n        freq = {}\n        left = 0\n        result = 0\n\n        for right in range(len(nums)):\n            # Add nums[right] to window\n            val = nums[right]\n            freq[val] = freq.get(val, 0) + 1\n\n            # Shrink window if too many distinct values\n            while len(freq) > k:\n                freq[nums[left]] -= 1\n                if freq[nums[left]] == 0:\n                    del freq[nums[left]]\n                left += 1\n\n            # All subarrays ending at right with left boundary >= left are valid\n            result += right - left + 1\n\n        return result\n\n    return at_most(k) - at_most(k - 1)",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        3,
        4,
        5
      ],
      "expand": [
        7
      ],
      "add_to_freq": [
        9,
        10
      ],
      "check_distinct": [
        13
      ],
      "remove_from_freq": [
        14,
        15,
        16
      ],
      "move_left": [
        17
      ],
      "count_subarrays": [
        20
      ],
      "pass_end": [
        22
      ],
      "compute_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        13
      ],
      "is_new_element": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int subarraysWithKDistinct(int[] nums, int k) {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nprivate int atMost(int[] nums, int k) {\n    int n = nums.length;\n    int[] freq = new int[n + 1]; // values are in [1, n]\n    int left = 0, distinct = 0, result = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Add nums[right] to window\n        if (freq[nums[right]] == 0) distinct++;\n        freq[nums[right]]++;\n\n        // Shrink window if too many distinct values\n        while (distinct > k) {\n            freq[nums[left]]--;\n            if (freq[nums[left]] == 0) distinct--;\n            left++;\n        }\n\n        // All subarrays [left..right], [left+1..right], ..., [right..right] are valid\n        result += right - left + 1;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        6,
        7,
        8
      ],
      "expand": [
        10
      ],
      "add_to_freq": [
        12,
        13
      ],
      "check_distinct": [
        16
      ],
      "remove_from_freq": [
        17,
        18
      ],
      "move_left": [
        19
      ],
      "count_subarrays": [
        23
      ],
      "pass_end": [
        26
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_element": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int subarraysWithKDistinct(vector<int>& nums, int k) {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nint atMost(vector<int>& nums, int k) {\n    int n = nums.size();\n    vector<int> freq(n + 1, 0); // values are in [1, n]\n    int left = 0, distinct = 0, result = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Add nums[right] to window\n        if (freq[nums[right]] == 0) distinct++;\n        freq[nums[right]]++;\n\n        // Shrink window if too many distinct values\n        while (distinct > k) {\n            freq[nums[left]]--;\n            if (freq[nums[left]] == 0) distinct--;\n            left++;\n        }\n\n        // All subarrays ending at right starting from left to right are valid\n        result += right - left + 1;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        6,
        7,
        8
      ],
      "expand": [
        10
      ],
      "add_to_freq": [
        12,
        13
      ],
      "check_distinct": [
        16
      ],
      "remove_from_freq": [
        17,
        18
      ],
      "move_left": [
        19
      ],
      "count_subarrays": [
        23
      ],
      "pass_end": [
        26
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_element": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SubarraysWithKDistinct(int[] nums, int k) {\n    return AtMost(nums, k) - AtMost(nums, k - 1);\n}\n\nprivate int AtMost(int[] nums, int k) {\n    int n = nums.Length;\n    int[] freq = new int[n + 1]; // values are in [1, n]\n    int left = 0, distinct = 0, result = 0;\n\n    for (int right = 0; right < n; right++) {\n        // Add nums[right] to window\n        if (freq[nums[right]] == 0) distinct++;\n        freq[nums[right]]++;\n\n        // Shrink window if too many distinct values\n        while (distinct > k) {\n            freq[nums[left]]--;\n            if (freq[nums[left]] == 0) distinct--;\n            left++;\n        }\n\n        // Count all valid subarrays ending at right\n        result += right - left + 1;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        6,
        7,
        8
      ],
      "expand": [
        10
      ],
      "add_to_freq": [
        12,
        13
      ],
      "check_distinct": [
        16
      ],
      "remove_from_freq": [
        17,
        18
      ],
      "move_left": [
        19
      ],
      "count_subarrays": [
        23
      ],
      "pass_end": [
        26
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_element": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subarraysWithKDistinct(nums []int, k int) int {\n    return atMost(nums, k) - atMost(nums, k-1)\n}\n\nfunc atMost(nums []int, k int) int {\n    n := len(nums)\n    freq := make([]int, n+1) // values are in [1, n]\n    left, distinct, result := 0, 0, 0\n\n    for right := 0; right < n; right++ {\n        // Add nums[right] to window\n        if freq[nums[right]] == 0 {\n            distinct++\n        }\n        freq[nums[right]]++\n\n        // Shrink window if too many distinct values\n        for distinct > k {\n            freq[nums[left]]--\n            if freq[nums[left]] == 0 {\n                distinct--\n            }\n            left++\n        }\n\n        // Count all valid subarrays ending at right\n        result += right - left + 1\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        6,
        7,
        8
      ],
      "expand": [
        10
      ],
      "add_to_freq": [
        12,
        13,
        15
      ],
      "check_distinct": [
        18
      ],
      "remove_from_freq": [
        19,
        20,
        21
      ],
      "move_left": [
        23
      ],
      "count_subarrays": [
        27
      ],
      "pass_end": [
        30
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        18
      ],
      "is_new_element": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function subarraysWithKDistinct(nums, k) {\n  return atMost(nums, k) - atMost(nums, k - 1);\n}\nfunction atMost(nums, k) {\n  const n = nums.length;\n  const freq = new Array(n + 1).fill(0); // values are in [1, n]\n  let left = 0,\n    distinct = 0,\n    result = 0;\n\n  for (let right = 0; right < n; right++) {\n    // Add nums[right] to window\n    if (freq[nums[right]] === 0) distinct++;\n    freq[nums[right]]++;\n\n    // Shrink window if too many distinct values\n    while (distinct > k) {\n      freq[nums[left]]--;\n      if (freq[nums[left]] === 0) distinct--;\n      left++;\n    }\n\n    // Count all valid subarrays ending at right\n    result += right - left + 1;\n  }\n\n  return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        5,
        6,
        7,
        8,
        9
      ],
      "expand": [
        11
      ],
      "add_to_freq": [
        13,
        14
      ],
      "check_distinct": [
        17
      ],
      "remove_from_freq": [
        18,
        19
      ],
      "move_left": [
        20
      ],
      "count_subarrays": [
        24
      ],
      "pass_end": [
        27
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        17
      ],
      "is_new_element": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subarraysWithKDistinct(nums: number[], k: number): number {\n    return atMost(nums, k) - atMost(nums, k - 1);\n}\n\nfunction atMost(nums: number[], k: number): number {\n    const n = nums.length;\n    const freq: number[] = new Array(n + 1).fill(0); // values are in [1, n]\n    let left = 0, distinct = 0, result = 0;\n\n    for (let right = 0; right < n; right++) {\n        // Add nums[right] to window\n        if (freq[nums[right]] === 0) distinct++;\n        freq[nums[right]]++;\n\n        // Shrink window if too many distinct values\n        while (distinct > k) {\n            freq[nums[left]]--;\n            if (freq[nums[left]] === 0) distinct--;\n            left++;\n        }\n\n        // Count all valid subarrays ending at right\n        result += right - left + 1;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pass_start": [
        6,
        7,
        8
      ],
      "expand": [
        10
      ],
      "add_to_freq": [
        12,
        13
      ],
      "check_distinct": [
        16
      ],
      "remove_from_freq": [
        17,
        18
      ],
      "move_left": [
        19
      ],
      "count_subarrays": [
        23
      ],
      "pass_end": [
        26
      ],
      "compute_result": [
        2
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "too_many_distinct": [
        16
      ],
      "is_new_element": [
        12
      ]
    }
  }
};

const SubarraysWithKDifferentIntegersPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        1,
        2,
        3
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        2,
        1,
        3,
        4
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Repeats",
    "value": {
      "nums": [
        2,
        1,
        1,
        1,
        2
      ],
      "k": 2
    }
  },
  {
    "id": "ex4",
    "label": "k = 3",
    "value": {
      "nums": [
        1,
        2,
        3
      ],
      "k": 3
    }
  }
];

function generateSubarraysWithKDifferentIntegersSteps(t: any): any[] {
  let e=t.nums,i=t.k,r=e.length,l=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),s=new StepRecorder({nums:e,k:i},{...l}),a=(t,i,n=-1)=>{for(let i=0;i<r;i++){let r;i===n?r="dropping":i<t&&(r="outside"),s.update_visual(`elem_${i}`,{type:"arrayElement",value:e[i],position:i,...r?{state:r}:{}})}};s.record("-","Start of algorithm");let o=(t,i,n)=>{let l=0,o=0,d=0,c=new Map;s.update_variable("left",l),s.update_variable("distinct",o),s.update_variable("result",d),s.update_variable("freq",Object.fromEntries(c)),s.update_variable("contribution",0),s.update_variable("counting",!1),s.update_variable("invalid",!1),s.update_variable("passIndex",i),s.update_variable("cap",t),s.update_variable("pass",`atMost(${t})`),void 0!==n&&s.update_variable("atMostK",n),s.update_visual("left",{type:"pointer",position:l,label:"left"}),s.delete_visual("right"),a(l,-1),s.record("pass_start",`Pass ${i}: count subarrays with at most ${t} distinct integer${1===t?"":"s"}`);for(let i=0;i<r;i++){let n=e[i];s.update_variable("right",i),s.update_variable("added_val",n),s.update_variable("counting",!1),s.update_visual("right",{type:"pointer",position:i,label:"right"}),a(l,i),s.record("expand",`right = ${i}: include ${n}`);let r=c.get(n)||0,u=0===r;u&&o++,c.set(n,r+1),s.update_variable("freq",Object.fromEntries(c)),s.update_variable("distinct",o),s.add_conditional("is_new_element",u),a(l,i),s.record("add_to_freq",u?`${n} is new: distinct = ${o}`:`freq[${n}] = ${c.get(n)}, distinct stays ${o}`);let f=o>t;for(s.update_variable("invalid",f),s.add_conditional("too_many_distinct",f),a(l,i),s.record("check_distinct",f?`distinct = ${o} > ${t}: shrink from the left`:`distinct = ${o} ≤ ${t}: window is valid`);o>t;){let n=e[l];c.set(n,c.get(n)-1);let r=0===c.get(n);r&&(o--,c.delete(n)),s.update_variable("freq",Object.fromEntries(c)),s.update_variable("distinct",o),s.update_variable("drop_val",n),s.update_variable("invalid",o>t),a(l,i,l),s.record("remove_from_freq",r?`${n} count hits 0: remove it, distinct = ${o}`:`freq[${n}] = ${c.get(n)}`),l++,s.update_variable("left",l),s.update_variable("invalid",o>t),s.update_visual("left",{type:"pointer",position:l,label:"left"}),a(l,i),s.record("move_left",`left advances to ${l}`)}let h=i-l+1,p=d;d+=h,s.update_variable("result",d),s.update_variable("old_result",p),s.update_variable("contribution",h),s.update_variable("counting",!0),s.update_variable("invalid",!1),a(l,i),s.record("count_subarrays",`+${h} subarrays end at ${i}, result = ${d}`)}return s.update_variable("result",d),s.update_variable("counting",!1),1===i?s.update_variable("atMostK",d):s.update_variable("atMostKMinus1",d),s.delete_visual("left"),s.delete_visual("right"),s.delete_variable("contribution"),a(0,-1),s.record("pass_end",`Pass ${i} done: atMost(${t}) = ${d}`),d},d=o(i,1),c=o(i-1,2,d),u=d-c;return s.update_variable("passIndex",3),s.update_variable("atMostK",d),s.update_variable("atMostKMinus1",c),s.update_variable("answer",u),s.delete_variable("pass"),s.delete_variable("distinct"),s.delete_variable("result"),s.delete_variable("freq"),s.delete_variable("left"),s.record("compute_result",`atMost(${i}) − atMost(${i-1}) = ${d} − ${c} = ${u}`),s.record("complete",`Subarrays with exactly ${i} different integers = ${u}`),s.getSteps()
}

export function SubarraysWithKDifferentIntegersProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubarraysWithKDifferentIntegersTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSubarraysWithKDifferentIntegersSteps(t) as any[];
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
      title="Subarrays with K Different Integers"
      slug="subarrays-with-k-different-integers"
      approaches={approaches}
      presets={SubarraysWithKDifferentIntegersPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Substring With Concatenation of All Words (substring-with-concatenation-of-all-words)
// ==========================================

const SubstringWithConcatenationOfAllWordsTemplates = {
  "python": {
    "language": "python",
    "code": "def findSubstring(s, words):\n    result = []\n    w = len(words[0])\n    m = len(words)\n    total_len = m * w\n    if len(s) < total_len:\n        return result\n\n    # Build target frequency map\n    target = {}\n    for word in words:\n        target[word] = target.get(word, 0) + 1\n    distinct_words = len(target)\n\n    # Try each starting offset\n    for k in range(w):\n        seen = {}\n        match_count = 0\n        left = k\n\n        right = k\n        while right + w <= len(s):\n            right_word = s[right:right + w]\n\n            # Add right word to window\n            if right_word in target:\n                seen[right_word] = seen.get(right_word, 0) + 1\n                if seen[right_word] == target[right_word]:\n                    match_count += 1\n                elif seen[right_word] == target[right_word] + 1:\n                    match_count -= 1\n\n            # Shrink window if it exceeds m words\n            if right - left >= total_len:\n                left_word = s[left:left + w]\n                if left_word in target:\n                    if seen[left_word] == target[left_word]:\n                        match_count -= 1\n                    seen[left_word] -= 1\n                    if seen[left_word] == target[left_word]:\n                        match_count += 1\n                left += w\n\n            if match_count == distinct_words:\n                result.append(left)\n\n            right += w\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        7,
        10,
        11,
        12,
        13
      ],
      "new_offset": [
        16,
        17,
        18,
        19,
        21
      ],
      "extract_word": [
        23
      ],
      "check_target": [
        26,
        27
      ],
      "add_match": [
        28,
        29
      ],
      "over_count": [
        30,
        31
      ],
      "check_window_size": [
        34,
        35
      ],
      "remove_left_word": [
        36,
        39
      ],
      "lose_match": [
        37,
        38
      ],
      "restore_match": [
        40,
        41
      ],
      "move_left": [
        42
      ],
      "found_match": [
        44,
        45
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        26
      ],
      "window_too_large": [
        34
      ],
      "all_matched": [
        44
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> findSubstring(String s, String[] words) {\n    List<Integer> result = new ArrayList<>();\n    int w = words[0].length();\n    int m = words.length;\n    int totalLen = m * w;\n    if (s.length() < totalLen) return result;\n\n    // Build target frequency map\n    Map<String, Integer> target = new HashMap<>();\n    for (String word : words) {\n        target.merge(word, 1, Integer::sum);\n    }\n    int distinctWords = target.size();\n\n    // Try each starting offset\n    for (int k = 0; k < w; k++) {\n        Map<String, Integer> seen = new HashMap<>();\n        int matchCount = 0;\n        int left = k;\n\n        for (int right = k; right + w <= s.length(); right += w) {\n            String rightWord = s.substring(right, right + w);\n\n            // Add right word to window\n            if (target.containsKey(rightWord)) {\n                int count = seen.merge(rightWord, 1, Integer::sum);\n                if (count == target.get(rightWord)) matchCount++;\n                else if (count == target.get(rightWord) + 1) matchCount--;\n            }\n\n            // Shrink window if it exceeds m words\n            if (right - left >= totalLen) {\n                String leftWord = s.substring(left, left + w);\n                if (target.containsKey(leftWord)) {\n                    int count = seen.get(leftWord);\n                    if (count == target.get(leftWord)) matchCount--;\n                    seen.put(leftWord, count - 1);\n                    if (count - 1 == target.get(leftWord)) matchCount++;\n                }\n                left += w;\n            }\n\n            if (matchCount == distinctWords) result.add(left);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        9,
        10,
        11,
        12,
        13
      ],
      "new_offset": [
        16,
        17,
        18,
        19
      ],
      "extract_word": [
        22
      ],
      "check_target": [
        25,
        26
      ],
      "add_match": [
        27
      ],
      "over_count": [
        28
      ],
      "check_window_size": [
        32,
        33
      ],
      "remove_left_word": [
        34,
        37
      ],
      "lose_match": [
        35,
        36
      ],
      "restore_match": [
        38
      ],
      "move_left": [
        40
      ],
      "found_match": [
        43
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        25
      ],
      "window_too_large": [
        32
      ],
      "all_matched": [
        43
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findSubstring(string s, vector<string>& words) {\n    vector<int> result;\n    int w = words[0].size();\n    int m = words.size();\n    int totalLen = m * w;\n    if ((int)s.size() < totalLen) return result;\n\n    // Build target frequency map\n    unordered_map<string, int> target;\n    for (auto& word : words) target[word]++;\n    int distinctWords = target.size();\n\n    // Try each starting offset\n    for (int k = 0; k < w; k++) {\n        unordered_map<string, int> seen;\n        int matchCount = 0;\n        int left = k;\n\n        for (int right = k; right + w <= (int)s.size(); right += w) {\n            string rightWord = s.substr(right, w);\n\n            // Add right word to window\n            if (target.count(rightWord)) {\n                seen[rightWord]++;\n                if (seen[rightWord] == target[rightWord]) matchCount++;\n                else if (seen[rightWord] == target[rightWord] + 1) matchCount--;\n            }\n\n            // Shrink window if it exceeds m words\n            if (right - left >= totalLen) {\n                string leftWord = s.substr(left, w);\n                if (target.count(leftWord)) {\n                    if (seen[leftWord] == target[leftWord]) matchCount--;\n                    seen[leftWord]--;\n                    if (seen[leftWord] == target[leftWord]) matchCount++;\n                }\n                left += w;\n            }\n\n            if (matchCount == distinctWords) result.push_back(left);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        9,
        10,
        11
      ],
      "new_offset": [
        14,
        15,
        16,
        17
      ],
      "extract_word": [
        20
      ],
      "check_target": [
        23,
        24
      ],
      "add_match": [
        25
      ],
      "over_count": [
        26
      ],
      "check_window_size": [
        30,
        31
      ],
      "remove_left_word": [
        32,
        34
      ],
      "lose_match": [
        33
      ],
      "restore_match": [
        35
      ],
      "move_left": [
        37
      ],
      "found_match": [
        40
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        23
      ],
      "window_too_large": [
        30
      ],
      "all_matched": [
        40
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> FindSubstring(string s, string[] words) {\n    var result = new List<int>();\n    int w = words[0].Length;\n    int m = words.Length;\n    int totalLen = m * w;\n    if (s.Length < totalLen) return result;\n\n    // Build target frequency map\n    var target = new Dictionary<string, int>();\n    foreach (var word in words) {\n        if (!target.ContainsKey(word)) target[word] = 0;\n        target[word]++;\n    }\n    int distinctWords = target.Count;\n\n    // Try each starting offset\n    for (int k = 0; k < w; k++) {\n        var seen = new Dictionary<string, int>();\n        int matchCount = 0;\n        int left = k;\n\n        for (int right = k; right + w <= s.Length; right += w) {\n            string rightWord = s.Substring(right, w);\n\n            // Add right word to window\n            if (target.ContainsKey(rightWord)) {\n                if (!seen.ContainsKey(rightWord)) seen[rightWord] = 0;\n                seen[rightWord]++;\n                if (seen[rightWord] == target[rightWord]) matchCount++;\n                else if (seen[rightWord] == target[rightWord] + 1) matchCount--;\n            }\n\n            // Shrink window if it exceeds m words\n            if (right - left >= totalLen) {\n                string leftWord = s.Substring(left, w);\n                if (target.ContainsKey(leftWord)) {\n                    if (seen[leftWord] == target[leftWord]) matchCount--;\n                    seen[leftWord]--;\n                    if (seen[leftWord] == target[leftWord]) matchCount++;\n                }\n                left += w;\n            }\n\n            if (matchCount == distinctWords) result.Add(left);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        9,
        10,
        11,
        12,
        13,
        14
      ],
      "new_offset": [
        17,
        18,
        19,
        20
      ],
      "extract_word": [
        23
      ],
      "check_target": [
        26,
        27,
        28
      ],
      "add_match": [
        29
      ],
      "over_count": [
        30
      ],
      "check_window_size": [
        34,
        35
      ],
      "remove_left_word": [
        36,
        38
      ],
      "lose_match": [
        37
      ],
      "restore_match": [
        39
      ],
      "move_left": [
        41
      ],
      "found_match": [
        44
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        26
      ],
      "window_too_large": [
        34
      ],
      "all_matched": [
        44
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findSubstring(s string, words []string) []int {\n    result := []int{}\n    w := len(words[0])\n    m := len(words)\n    totalLen := m * w\n    if len(s) < totalLen {\n        return result\n    }\n\n    // Build target frequency map\n    target := map[string]int{}\n    for _, word := range words {\n        target[word]++\n    }\n    distinctWords := len(target)\n\n    // Try each starting offset\n    for k := 0; k < w; k++ {\n        seen := map[string]int{}\n        matchCount := 0\n        left := k\n\n        for right := k; right+w <= len(s); right += w {\n            rightWord := s[right : right+w]\n\n            // Add right word to window\n            if _, ok := target[rightWord]; ok {\n                seen[rightWord]++\n                if seen[rightWord] == target[rightWord] {\n                    matchCount++\n                } else if seen[rightWord] == target[rightWord]+1 {\n                    matchCount--\n                }\n            }\n\n            // Shrink window if it exceeds m words\n            if right-left >= totalLen {\n                leftWord := s[left : left+w]\n                if _, ok := target[leftWord]; ok {\n                    if seen[leftWord] == target[leftWord] {\n                        matchCount--\n                    }\n                    seen[leftWord]--\n                    if seen[leftWord] == target[leftWord] {\n                        matchCount++\n                    }\n                }\n                left += w\n            }\n\n            if matchCount == distinctWords {\n                result = append(result, left)\n            }\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        11,
        12,
        13,
        14,
        15
      ],
      "new_offset": [
        18,
        19,
        20,
        21
      ],
      "extract_word": [
        24
      ],
      "check_target": [
        27,
        28
      ],
      "add_match": [
        29
      ],
      "over_count": [
        31
      ],
      "check_window_size": [
        37,
        38
      ],
      "remove_left_word": [
        39,
        43
      ],
      "lose_match": [
        40
      ],
      "restore_match": [
        44
      ],
      "move_left": [
        48
      ],
      "found_match": [
        51
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        27
      ],
      "window_too_large": [
        37
      ],
      "all_matched": [
        51
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findSubstring(s, words) {\n    const result = [];\n    const w = words[0].length;\n    const m = words.length;\n    const totalLen = m * w;\n    if (s.length < totalLen) return result;\n\n    // Build target frequency map\n    const target = new Map();\n    for (const word of words) {\n        target.set(word, (target.get(word) || 0) + 1);\n    }\n    const distinctWords = target.size;\n\n    // Try each starting offset\n    for (let k = 0; k < w; k++) {\n        const seen = new Map();\n        let matchCount = 0;\n        let left = k;\n\n        for (let right = k; right + w <= s.length; right += w) {\n            const rightWord = s.substring(right, right + w);\n\n            // Add right word to window\n            if (target.has(rightWord)) {\n                const count = (seen.get(rightWord) || 0) + 1;\n                seen.set(rightWord, count);\n                if (count === target.get(rightWord)) matchCount++;\n                else if (count === target.get(rightWord) + 1) matchCount--;\n            }\n\n            // Shrink window if it exceeds m words\n            if (right - left >= totalLen) {\n                const leftWord = s.substring(left, left + w);\n                if (target.has(leftWord)) {\n                    const count = seen.get(leftWord);\n                    if (count === target.get(leftWord)) matchCount--;\n                    seen.set(leftWord, count - 1);\n                    if (count - 1 === target.get(leftWord)) matchCount++;\n                }\n                left += w;\n            }\n\n            if (matchCount === distinctWords) result.push(left);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        9,
        10,
        11,
        12,
        13
      ],
      "new_offset": [
        16,
        17,
        18,
        19
      ],
      "extract_word": [
        22
      ],
      "check_target": [
        25,
        26,
        27
      ],
      "add_match": [
        28
      ],
      "over_count": [
        29
      ],
      "check_window_size": [
        33,
        34
      ],
      "remove_left_word": [
        35,
        36,
        38
      ],
      "lose_match": [
        37
      ],
      "restore_match": [
        39
      ],
      "move_left": [
        41
      ],
      "found_match": [
        44
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        25
      ],
      "window_too_large": [
        33
      ],
      "all_matched": [
        44
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findSubstring(s: string, words: string[]): number[] {\n    const result: number[] = [];\n    const w = words[0].length;\n    const m = words.length;\n    const totalLen = m * w;\n    if (s.length < totalLen) return result;\n\n    // Build target frequency map\n    const target = new Map<string, number>();\n    for (const word of words) {\n        target.set(word, (target.get(word) || 0) + 1);\n    }\n    const distinctWords = target.size;\n\n    // Try each starting offset\n    for (let k = 0; k < w; k++) {\n        const seen = new Map<string, number>();\n        let matchCount = 0;\n        let left = k;\n\n        for (let right = k; right + w <= s.length; right += w) {\n            const rightWord = s.substring(right, right + w);\n\n            // Add right word to window\n            if (target.has(rightWord)) {\n                const count = (seen.get(rightWord) || 0) + 1;\n                seen.set(rightWord, count);\n                if (count === target.get(rightWord)) matchCount++;\n                else if (count === target.get(rightWord)! + 1) matchCount--;\n            }\n\n            // Shrink window if it exceeds m words\n            if (right - left >= totalLen) {\n                const leftWord = s.substring(left, left + w);\n                if (target.has(leftWord)) {\n                    const count = seen.get(leftWord)!;\n                    if (count === target.get(leftWord)) matchCount--;\n                    seen.set(leftWord, count - 1);\n                    if (count - 1 === target.get(leftWord)) matchCount++;\n                }\n                left += w;\n            }\n\n            if (matchCount === distinctWords) result.push(left);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        9,
        10,
        11,
        12,
        13
      ],
      "new_offset": [
        16,
        17,
        18,
        19
      ],
      "extract_word": [
        22
      ],
      "check_target": [
        25,
        26,
        27
      ],
      "add_match": [
        28
      ],
      "over_count": [
        29
      ],
      "check_window_size": [
        33,
        34
      ],
      "remove_left_word": [
        35,
        36,
        38
      ],
      "lose_match": [
        37
      ],
      "restore_match": [
        39
      ],
      "move_left": [
        41
      ],
      "found_match": [
        44
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "is_target_word": [
        25
      ],
      "window_too_large": [
        33
      ],
      "all_matched": [
        44
      ]
    }
  }
};

const SubstringWithConcatenationOfAllWordsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "s": "barfoothefoobarman",
      "words": [
        "foo",
        "bar"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "s": "wordgoodgoodgoodbestword",
      "words": [
        "word",
        "good",
        "best"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "s": "barfoofoobarthefoobarman",
      "words": [
        "bar",
        "foo",
        "the"
      ]
    }
  }
];

function generateSubstringWithConcatenationOfAllWordsSteps(t: any): any[] {
  let e=t.s,r=t.words,i=r[0].length,l=r.length,o=l*i,a=e.length,s=e.split("").reduce((t,e,r)=>(t[`elem_${r}`]={type:"arrayElement",value:e,position:r},t),{}),d=new StepRecorder({s:e,words:r},{...s});d.record("-","Start of algorithm");let c={};for(let t of r)c[t]=(c[t]||0)+1;let h=Object.keys(c).length;d.add_new_variable("w",i),d.add_new_variable("m",l),d.add_new_variable("totalLen",o),d.add_new_variable("target",{...c}),d.add_new_variable("distinctWords",h),d.add_new_variable("result",[]),d.record("init",`Word length w = ${i}, ${l} words, window span = ${o}`);let u=[];for(let t=0;t<i;t++){let r={},n=0,s=t;d.update_variable("offset",t),d.update_variable("matchCount",0),d.update_variable("seen",{}),d.update_variable("left",s),d.delete_visual("currentWindow"),d.record("new_offset",`Start offset ${t}: scan word-aligned positions ${t}, ${t+i}, ${t+2*i}, ...`);for(let g=t;g+i<=a;g+=i){let t=e.substring(g,g+i);d.update_variable("right",g),d.update_variable("rightWord",t),d.update_visual("currentWindow",{type:"range",start:s,end:g+i-1}),d.record("extract_word",`Extract word s[${g}..${g+i-1}] = "${t}"`);let a=void 0!==c[t];if(d.update_variable("isTargetWord",a),d.add_conditional("is_target_word",a),a){r[t]=(r[t]||0)+1;let e=r[t];d.update_variable("seen",{...r}),e===c[t]?(n++,d.update_variable("matchCount",n),d.record("add_match",`"${t}" reaches its target count, matched ${n}/${h} words`)):e===c[t]+1?(n--,d.update_variable("matchCount",n),d.record("over_count",`"${t}" now exceeds its target count, matched ${n}/${h} words`)):d.record("check_target",`"${t}" is a target word, seen ${e} of ${c[t]} needed`)}else d.record("check_target",`"${t}" is not a target word`);let f=g-s>=o;if(d.add_conditional("window_too_large",f),f){let t=e.substring(s,s+i);if(d.update_variable("leftWord",t),d.update_variable("dropLeft",s),d.record("check_window_size",`Window holds ${l+1} words, drop the left word "${t}"`),void 0!==c[t]){let e=r[t];e===c[t]&&(n--,d.update_variable("matchCount",n),d.record("lose_match",`Dropping "${t}" breaks its match, matched ${n}/${h} words`)),r[t]=e-1,d.update_variable("seen",{...r}),e-1===c[t]&&(n++,d.update_variable("matchCount",n),d.record("restore_match",`"${t}" is back to its target count, matched ${n}/${h} words`)),d.record("remove_left_word",`Removed one "${t}", seen ${r[t]} of ${c[t]} needed`)}else d.record("remove_left_word",`"${t}" is not a target word, just slide past it`);s+=i,d.update_variable("left",s),d.update_visual("currentWindow",{type:"range",start:s,end:g+i-1}),d.record("move_left",`Move left to position ${s}`),d.delete_variable("dropLeft"),d.delete_variable("leftWord")}let w=n===h;d.add_conditional("all_matched",w),w&&(u.push(s),d.update_variable("result",[...u]),d.record("found_match",`All ${h} words matched, add index ${s}, result = [${u.join(", ")}]`))}}return d.delete_variable("offset"),d.delete_variable("rightWord"),d.delete_variable("isTargetWord"),d.delete_variable("left"),d.delete_variable("right"),d.delete_variable("matchCount"),d.delete_variable("seen"),d.delete_visual("currentWindow"),d.record("complete",u.length>0?`Found ${u.length} concatenation${1===u.length?"":"s"}: [${u.join(", ")}]`:"No concatenation of all words found"),d.getSteps()
}

export function SubstringWithConcatenationOfAllWordsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubstringWithConcatenationOfAllWordsTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSubstringWithConcatenationOfAllWordsSteps(t) as any[];
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
      title="Substring With Concatenation of All Words"
      slug="substring-with-concatenation-of-all-words"
      approaches={approaches}
      presets={SubstringWithConcatenationOfAllWordsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit)
// ==========================================

const LongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitTemplates = {
  "python": {
    "language": "python",
    "code": "def longestSubarray(nums, limit):\n    maxLen = 0\n    left = 0\n    maxDeque = []\n    minDeque = []\n\n    for right in range(len(nums)):\n        while maxDeque and nums[maxDeque[-1]] <= nums[right]:\n            maxDeque.pop()\n        maxDeque.append(right)\n\n        while minDeque and nums[minDeque[-1]] >= nums[right]:\n            minDeque.pop()\n        minDeque.append(right)\n\n        while nums[maxDeque[0]] - nums[minDeque[0]] > limit:\n            left += 1\n            if maxDeque[0] < left:\n                maxDeque.pop(0)\n            if minDeque[0] < left:\n                minDeque.pop(0)\n\n        maxLen = max(maxLen, right - left + 1)\n\n    return maxLen",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        10
      ],
      "maintain_min_deque": [
        12
      ],
      "pop_min_back": [
        13
      ],
      "push_min": [
        14
      ],
      "check_spread": [
        16
      ],
      "shrink_window": [
        17
      ],
      "pop_max_front": [
        19
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "check_spread": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int longestSubarray(int[] nums, int limit) {\n    int maxLen = 0;\n    int left = 0;\n    Deque<Integer> maxDeque = new ArrayDeque<>();\n    Deque<Integer> minDeque = new ArrayDeque<>();\n\n    for (int right = 0; right < nums.length; right++) {\n        while (!maxDeque.isEmpty() && nums[maxDeque.peekLast()] <= nums[right]) {\n            maxDeque.pollLast();\n        }\n        maxDeque.offerLast(right);\n\n        while (!minDeque.isEmpty() && nums[minDeque.peekLast()] >= nums[right]) {\n            minDeque.pollLast();\n        }\n        minDeque.offerLast(right);\n\n        while (nums[maxDeque.peekFirst()] - nums[minDeque.peekFirst()] > limit) {\n            left++;\n            if (maxDeque.peekFirst() < left) maxDeque.pollFirst();\n            if (minDeque.peekFirst() < left) minDeque.pollFirst();\n        }\n\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int longestSubarray(vector<int>& nums, int limit) {\n    int maxLen = 0;\n    int left = 0;\n    deque<int> maxDeque;\n    deque<int> minDeque;\n\n    for (int right = 0; right < nums.size(); right++) {\n        while (!maxDeque.empty() && nums[maxDeque.back()] <= nums[right]) {\n            maxDeque.pop_back();\n        }\n        maxDeque.push_back(right);\n\n        while (!minDeque.empty() && nums[minDeque.back()] >= nums[right]) {\n            minDeque.pop_back();\n        }\n        minDeque.push_back(right);\n\n        while (nums[maxDeque.front()] - nums[minDeque.front()] > limit) {\n            left++;\n            if (maxDeque.front() < left) maxDeque.pop_front();\n            if (minDeque.front() < left) minDeque.pop_front();\n        }\n\n        maxLen = max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int LongestSubarray(int[] nums, int limit) {\n    int maxLen = 0;\n    int left = 0;\n    LinkedList<int> maxDeque = new LinkedList<int>();\n    LinkedList<int> minDeque = new LinkedList<int>();\n\n    for (int right = 0; right < nums.Length; right++) {\n        while (maxDeque.Count > 0 && nums[maxDeque.Last.Value] <= nums[right]) {\n            maxDeque.RemoveLast();\n        }\n        maxDeque.AddLast(right);\n\n        while (minDeque.Count > 0 && nums[minDeque.Last.Value] >= nums[right]) {\n            minDeque.RemoveLast();\n        }\n        minDeque.AddLast(right);\n\n        while (nums[maxDeque.First.Value] - nums[minDeque.First.Value] > limit) {\n            left++;\n            if (maxDeque.First.Value < left) maxDeque.RemoveFirst();\n            if (minDeque.First.Value < left) minDeque.RemoveFirst();\n        }\n\n        maxLen = Math.Max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestSubarray(nums []int, limit int) int {\n    maxLen := 0\n    left := 0\n    maxDeque := []int{}\n    minDeque := []int{}\n\n    for right := 0; right < len(nums); right++ {\n        for len(maxDeque) > 0 && nums[maxDeque[len(maxDeque)-1]] <= nums[right] {\n            maxDeque = maxDeque[:len(maxDeque)-1]\n        }\n        maxDeque = append(maxDeque, right)\n\n        for len(minDeque) > 0 && nums[minDeque[len(minDeque)-1]] >= nums[right] {\n            minDeque = minDeque[:len(minDeque)-1]\n        }\n        minDeque = append(minDeque, right)\n\n        for nums[maxDeque[0]] - nums[minDeque[0]] > limit {\n            left++\n            if maxDeque[0] < left { maxDeque = maxDeque[1:] }\n            if minDeque[0] < left { minDeque = minDeque[1:] }\n        }\n\n        if right - left + 1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24,
        25
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function longestSubarray(nums, limit) {\n    let maxLen = 0;\n    let left = 0;\n    const maxDeque = [];\n    const minDeque = [];\n\n    for (let right = 0; right < nums.length; right++) {\n        while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {\n            maxDeque.pop();\n        }\n        maxDeque.push(right);\n\n        while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {\n            minDeque.pop();\n        }\n        minDeque.push(right);\n\n        while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {\n            left++;\n            if (maxDeque[0] < left) maxDeque.shift();\n            if (minDeque[0] < left) minDeque.shift();\n        }\n\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestSubarray(nums: number[], limit: number): number {\n    let maxLen = 0;\n    let left = 0;\n    const maxDeque: number[] = [];\n    const minDeque: number[] = [];\n\n    for (let right = 0; right < nums.length; right++) {\n        while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {\n            maxDeque.pop();\n        }\n        maxDeque.push(right);\n\n        while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {\n            minDeque.pop();\n        }\n        minDeque.push(right);\n\n        while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {\n            left++;\n            if (maxDeque[0] < left) maxDeque.shift();\n            if (minDeque[0] < left) minDeque.shift();\n        }\n\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "expand_right": [
        7
      ],
      "maintain_max_deque": [
        8
      ],
      "pop_max_back": [
        9
      ],
      "push_max": [
        11
      ],
      "maintain_min_deque": [
        13
      ],
      "pop_min_back": [
        14
      ],
      "push_min": [
        16
      ],
      "check_spread": [
        18
      ],
      "shrink_window": [
        19
      ],
      "pop_max_front": [
        20
      ],
      "pop_min_front": [
        21
      ],
      "update_max_len": [
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "check_spread": [
        18
      ]
    }
  }
};

const LongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        8,
        2,
        4,
        7
      ],
      "limit": 4
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        10,
        1,
        2,
        4,
        7,
        2
      ],
      "limit": 5
    }
  },
  {
    "id": "ex3",
    "label": "Limit = 0",
    "value": {
      "nums": [
        4,
        2,
        2,
        2,
        4,
        4,
        2,
        2
      ],
      "limit": 0
    }
  }
];

function generateLongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitSteps(e: any): any[] {
  let t=e.nums,n=e.limit,a=t.length,r=new StepRecorder({}),l=0,s=0,o=0,u=e=>{for(let[i,a]of(r.update_variable("nums",t),r.update_variable("limit",n),r.update_variable("maxLen",l),r.update_variable("bestLo",s),r.update_variable("bestHi",o),Object.entries(e)))r.update_variable(i,a)},m=()=>{for(let e of["i","j","curMax","curMin","curMaxIdx","curMinIdx","spread","valid","isNewMax"])r.delete_variable(e)};m(),u({}),r.record("-",`Brute force: try every start, extend while |max - min| <= ${n}.`);for(let e=0;e<a;e++){let i=t[e],m=t[e],d=e,c=e;for(let h=e;h<a;h++){t[h]>i&&(i=t[h],d=h),t[h]<m&&(m=t[h],c=h);let a=i-m,x=a<=n,p=h-e+1,f=x&&p>l;if(f&&(l=p,s=e,o=h),u({i:e,j:h,curMax:i,curMin:m,curMaxIdx:d,curMinIdx:c,spread:a,valid:x,isNewMax:f}),r.record(h===e?"pick_start":"extend",h===e?`Start a new subarray at index ${e} (nums[${e}] = ${t[e]}).`:x?`Extend to index ${h}: spread = ${i} − ${m} = ${a} <= ${n}${f?`, new maxLen = ${l}`:""}.`:`Extend to index ${h}: spread = ${i} − ${m} = ${a} > ${n}, stop this start.`),!x)break}}return m(),u({result:l}),r.record("complete",`Done! Longest subarray length = ${l}.`),r.getSteps()
}

export function LongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitSteps(e) as any[];
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
      title="Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit"
      slug="longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit"
      approaches={approaches}
      presets={LongestContinuousSubarrayWithAbsoluteDiffLessThanOrEqualToLimitPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Turbulent Subarray (longest-turbulent-subarray)
// ==========================================

const LongestTurbulentSubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def maxTurbulenceSize(arr):\n    n = len(arr)\n    inc = 1  # length of turbulent subarray ending with an up move\n    dec = 1  # length of turbulent subarray ending with a down move\n    max_len = 1\n\n    for i in range(1, n):\n        if arr[i] > arr[i - 1]:\n            # Up move: extends a subarray that ended with down\n            inc = dec + 1\n            dec = 1\n        elif arr[i] < arr[i - 1]:\n            # Down move: extends a subarray that ended with up\n            dec = inc + 1\n            inc = 1\n        else:\n            # Equal: breaks any turbulent subarray\n            inc = 1\n            dec = 1\n        max_len = max(max_len, inc, dec)\n\n    return max_len",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxTurbulenceSize(int[] arr) {\n    int n = arr.length;\n    int inc = 1; // length of turbulent subarray ending with an up move\n    int dec = 1; // length of turbulent subarray ending with a down move\n    int maxLen = 1;\n\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > arr[i - 1]) {\n            // Up move: extends a subarray that ended with down\n            inc = dec + 1;\n            dec = 1;\n        } else if (arr[i] < arr[i - 1]) {\n            // Down move: extends a subarray that ended with up\n            dec = inc + 1;\n            inc = 1;\n        } else {\n            // Equal: breaks any turbulent subarray\n            inc = 1;\n            dec = 1;\n        }\n        maxLen = Math.max(maxLen, Math.max(inc, dec));\n    }\n\n    return maxLen;\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxTurbulenceSize(vector<int>& arr) {\n    int n = arr.size();\n    int inc = 1; // length of turbulent subarray ending with an up move\n    int dec = 1; // length of turbulent subarray ending with a down move\n    int maxLen = 1;\n\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > arr[i - 1]) {\n            // Up move: extends a subarray that ended with down\n            inc = dec + 1;\n            dec = 1;\n        } else if (arr[i] < arr[i - 1]) {\n            // Down move: extends a subarray that ended with up\n            dec = inc + 1;\n            inc = 1;\n        } else {\n            // Equal: breaks any turbulent subarray\n            inc = 1;\n            dec = 1;\n        }\n        maxLen = max(maxLen, max(inc, dec));\n    }\n\n    return maxLen;\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxTurbulenceSize(int[] arr) {\n    int n = arr.Length;\n    int inc = 1; // length of turbulent subarray ending with an up move\n    int dec = 1; // length of turbulent subarray ending with a down move\n    int maxLen = 1;\n\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > arr[i - 1]) {\n            // Up move: extends a subarray that ended with down\n            inc = dec + 1;\n            dec = 1;\n        } else if (arr[i] < arr[i - 1]) {\n            // Down move: extends a subarray that ended with up\n            dec = inc + 1;\n            inc = 1;\n        } else {\n            // Equal: breaks any turbulent subarray\n            inc = 1;\n            dec = 1;\n        }\n        maxLen = Math.Max(maxLen, Math.Max(inc, dec));\n    }\n\n    return maxLen;\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxTurbulenceSize(arr []int) int {\n    n := len(arr)\n    inc := 1 // length of turbulent subarray ending with an up move\n    dec := 1 // length of turbulent subarray ending with a down move\n    maxLen := 1\n\n    for i := 1; i < n; i++ {\n        if arr[i] > arr[i-1] {\n            // Up move: extends a subarray that ended with down\n            inc = dec + 1\n            dec = 1\n        } else if arr[i] < arr[i-1] {\n            // Down move: extends a subarray that ended with up\n            dec = inc + 1\n            inc = 1\n        } else {\n            // Equal: breaks any turbulent subarray\n            inc = 1\n            dec = 1\n        }\n        if inc > maxLen {\n            maxLen = inc\n        }\n        if dec > maxLen {\n            maxLen = dec\n        }\n    }\n\n    return maxLen\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
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
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxTurbulenceSize(arr) {\n  const n = arr.length;\n  let inc = 1; // length of turbulent subarray ending with an up move\n  let dec = 1; // length of turbulent subarray ending with a down move\n  let maxLen = 1;\n\n  for (let i = 1; i < n; i++) {\n    if (arr[i] > arr[i - 1]) {\n      // Up move: extends a subarray that ended with down\n      inc = dec + 1;\n      dec = 1;\n    } else if (arr[i] < arr[i - 1]) {\n      // Down move: extends a subarray that ended with up\n      dec = inc + 1;\n      inc = 1;\n    } else {\n      // Equal: breaks any turbulent subarray\n      inc = 1;\n      dec = 1;\n    }\n    maxLen = Math.max(maxLen, inc, dec);\n  }\n\n  return maxLen;\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxTurbulenceSize(arr: number[]): number {\n    const n = arr.length;\n    let inc = 1; // length of turbulent subarray ending with an up move\n    let dec = 1; // length of turbulent subarray ending with a down move\n    let maxLen = 1;\n\n    for (let i = 1; i < n; i++) {\n        if (arr[i] > arr[i - 1]) {\n            // Up move: extends a subarray that ended with down\n            inc = dec + 1;\n            dec = 1;\n        } else if (arr[i] < arr[i - 1]) {\n            // Down move: extends a subarray that ended with up\n            dec = inc + 1;\n            inc = 1;\n        } else {\n            // Equal: breaks any turbulent subarray\n            inc = 1;\n            dec = 1;\n        }\n        maxLen = Math.max(maxLen, inc, dec);\n    }\n\n    return maxLen;\n}",
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
      "up_move": [
        8,
        9,
        10,
        11
      ],
      "down_move": [
        12,
        13,
        14,
        15
      ],
      "equal": [
        16,
        17,
        18,
        19
      ],
      "update_max": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_greater": [
        8
      ],
      "is_less": [
        12
      ],
      "is_equal": [
        16
      ]
    }
  }
};

const LongestTurbulentSubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "arr": [
        9,
        4,
        2,
        10,
        7,
        8,
        8,
        1,
        9
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Full Zigzag",
    "value": {
      "arr": [
        1,
        5,
        2,
        6,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Monotone",
    "value": {
      "arr": [
        4,
        8,
        12,
        16
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Equal",
    "value": {
      "arr": [
        100,
        100,
        100
      ]
    }
  }
];

function generateLongestTurbulentSubarraySteps(e: any): any[] {
  let t=[...e.arr],n=t.length,a=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),i=new StepRecorder({arr:t,i:-1,j:-1,curLen:1,curEnd:-1,sign:0,maxLen:1,newMax:!1,bestStart:0,bestEnd:0,reason:""},{...a});i.record("-","A turbulent run strictly alternates rising and falling. From each start, extend while it keeps alternating.");let l=1,s=0,o=0;for(let e=0;e<n;e++){let r=0,a=1,u=e;for(let d=e+1;d<n;d++){let n=t[d]>t[d-1]?1:t[d]<t[d-1]?-1:0,c=0!==n&&n!==r;if(i.update_variable("i",e),i.update_variable("j",d),i.update_variable("sign",n),i.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),i.update_visual("ptr_j",{type:"pointer",position:d,label:"j"}),!c){i.update_variable("curEnd",u),i.update_variable("curLen",a),i.update_variable("reason",0===n?"equal":"same"),i.record(0===n?"break_equal":"break_same",0===n?`arr[${d}] = arr[${d-1}] = ${t[d]}: equal breaks the run, stop at [${e}..${u}]`:`arr[${d}] continues the ${n>0?"rising":"falling"} direction, not alternating: stop at [${e}..${u}]`);break}a+=1,u=d,r=n;let p=a>l;p&&(l=a,s=e,o=d),i.update_variable("curEnd",u),i.update_variable("curLen",a),i.update_variable("maxLen",l),i.update_variable("newMax",p),i.update_variable("bestStart",s),i.update_variable("bestEnd",o),i.record("extend",`arr[${d}] ${n>0?">":"<"} arr[${d-1}], alternates: run [${e}..${d}] length ${a}`+(p?`, new best = ${l}`:`, best stays ${l}`))}}return i.delete_visual("ptr_i"),i.delete_visual("ptr_j"),i.record("complete",`Longest turbulent subarray length: ${l} (window [${s}..${o}])`),i.getSteps()
}

export function LongestTurbulentSubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestTurbulentSubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestTurbulentSubarraySteps(e) as any[];
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
      title="Longest Turbulent Subarray"
      slug="longest-turbulent-subarray"
      approaches={approaches}
      presets={LongestTurbulentSubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Shortest Subarray with Sum at Least K (shortest-subarray-with-sum-at-least-k)
// ==========================================

const ShortestSubarrayWithSumAtLeastKTemplates = {
  "python": {
    "language": "python",
    "code": "def shortestSubarray(self, nums, k):\n    n = len(nums)\n    prefix = [0] * (n + 1)\n    for i in range(n):\n        prefix[i + 1] = prefix[i] + nums[i]\n    min_len = float('inf')\n    deque = collections.deque()\n    for j in range(n + 1):\n        while deque and prefix[j] - prefix[deque[0]] >= k:\n            min_len = min(min_len, j - deque.popleft())\n        while deque and prefix[j] <= prefix[deque[-1]]:\n            deque.pop()\n        deque.append(j)\n    return -1 if min_len == float('inf') else min_len",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        10
      ],
      "check_back": [
        11
      ],
      "pop_back": [
        12
      ],
      "push_deque": [
        13
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int shortestSubarray(int[] nums, int k) {\n    int n = nums.length;\n    long[] prefix = new long[n + 1];\n    for (int i = 0; i < n; i++)\n        prefix[i + 1] = prefix[i] + nums[i];\n    int minLen = Integer.MAX_VALUE;\n    Deque<Integer> deque = new ArrayDeque<>();\n    for (int j = 0; j <= n; j++) {\n        while (!deque.isEmpty() && prefix[j] - prefix[deque.peekFirst()] >= k) {\n            minLen = Math.min(minLen, j - deque.pollFirst());\n        }\n        while (!deque.isEmpty() && prefix[j] <= prefix[deque.peekLast()]) {\n            deque.pollLast();\n        }\n        deque.addLast(j);\n    }\n    return minLen == Integer.MAX_VALUE ? -1 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        10
      ],
      "check_back": [
        12
      ],
      "pop_back": [
        13
      ],
      "push_deque": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int shortestSubarray(vector<int>& nums, int k) {\n    int n = nums.size();\n    vector<long long> prefix(n + 1, 0);\n    for (int i = 0; i < n; i++)\n        prefix[i + 1] = prefix[i] + nums[i];\n    int minLen = INT_MAX;\n    deque<int> dq;\n    for (int j = 0; j <= n; j++) {\n        while (!dq.empty() && prefix[j] - prefix[dq.front()] >= k) {\n            minLen = min(minLen, j - dq.front());\n            dq.pop_front();\n        }\n        while (!dq.empty() && prefix[j] <= prefix[dq.back()]) {\n            dq.pop_back();\n        }\n        dq.push_back(j);\n    }\n    return minLen == INT_MAX ? -1 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        11
      ],
      "check_back": [
        13
      ],
      "pop_back": [
        14
      ],
      "push_deque": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int ShortestSubarray(int[] nums, int k) {\n    int n = nums.Length;\n    long[] prefix = new long[n + 1];\n    for (int i = 0; i < n; i++)\n        prefix[i + 1] = prefix[i] + nums[i];\n    int minLen = int.MaxValue;\n    var deque = new LinkedList<int>();\n    for (int j = 0; j <= n; j++) {\n        while (deque.Count > 0 && prefix[j] - prefix[deque.First.Value] >= k) {\n            minLen = Math.Min(minLen, j - deque.First.Value);\n            deque.RemoveFirst();\n        }\n        while (deque.Count > 0 && prefix[j] <= prefix[deque.Last.Value]) {\n            deque.RemoveLast();\n        }\n        deque.AddLast(j);\n    }\n    return minLen == int.MaxValue ? -1 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        11
      ],
      "check_back": [
        13
      ],
      "pop_back": [
        14
      ],
      "push_deque": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func shortestSubarray(nums []int, k int) int {\n    n := len(nums)\n    prefix := make([]int64, n+1)\n    for i := 0; i < n; i++ {\n        prefix[i+1] = prefix[i] + int64(nums[i])\n    }\n    minLen := math.MaxInt32\n    deque := []int{}\n    for j := 0; j <= n; j++ {\n        for len(deque) > 0 && prefix[j]-prefix[deque[0]] >= int64(k) {\n            if j-deque[0] < minLen {\n                minLen = j - deque[0]\n            }\n            deque = deque[1:]\n        }\n        for len(deque) > 0 && prefix[j] <= prefix[deque[len(deque)-1]] {\n            deque = deque[:len(deque)-1]\n        }\n        deque = append(deque, j)\n    }\n    if minLen == math.MaxInt32 {\n        return -1\n    }\n    return minLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        9
      ],
      "check_valid": [
        10
      ],
      "update_min": [
        11,
        12
      ],
      "pop_front": [
        14
      ],
      "check_back": [
        16
      ],
      "pop_back": [
        17
      ],
      "push_deque": [
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "check_valid": [
        10
      ],
      "check_back": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var shortestSubarray = function(nums, k) {\n    const n = nums.length;\n    const prefix = new Array(n + 1).fill(0);\n    for (let i = 0; i < n; i++)\n        prefix[i + 1] = prefix[i] + nums[i];\n    let minLen = Infinity;\n    const deque = [];\n    for (let j = 0; j <= n; j++) {\n        while (deque.length > 0 && prefix[j] - prefix[deque[0]] >= k) {\n            minLen = Math.min(minLen, j - deque.shift());\n        }\n        while (deque.length > 0 && prefix[j] <= prefix[deque[deque.length - 1]]) {\n            deque.pop();\n        }\n        deque.push(j);\n    }\n    return minLen === Infinity ? -1 : minLen;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        10
      ],
      "check_back": [
        12
      ],
      "pop_back": [
        13
      ],
      "push_deque": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function shortestSubarray(nums: number[], k: number): number {\n    const n = nums.length;\n    const prefix = new Array(n + 1).fill(0);\n    for (let i = 0; i < n; i++)\n        prefix[i + 1] = prefix[i] + nums[i];\n    let minLen = Infinity;\n    const deque: number[] = [];\n    for (let j = 0; j <= n; j++) {\n        while (deque.length > 0 && prefix[j] - prefix[deque[0]] >= k) {\n            minLen = Math.min(minLen, j - deque.shift()!);\n        }\n        while (deque.length > 0 && prefix[j] <= prefix[deque[deque.length - 1]]) {\n            deque.pop();\n        }\n        deque.push(j);\n    }\n    return minLen === Infinity ? -1 : minLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3
      ],
      "calc_prefix": [
        4,
        5
      ],
      "iterate": [
        8
      ],
      "check_valid": [
        9
      ],
      "update_min": [
        10
      ],
      "pop_front": [
        10
      ],
      "check_back": [
        12
      ],
      "pop_back": [
        13
      ],
      "push_deque": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_valid": [
        9
      ],
      "check_back": [
        12
      ]
    }
  }
};

const ShortestSubarrayWithSumAtLeastKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        2,
        -1,
        2
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1
      ],
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "Negative",
    "value": {
      "nums": [
        84,
        -37,
        32,
        40,
        95
      ],
      "k": 167
    }
  }
];

function generateShortestSubarrayWithSumAtLeastKSteps(e: any): any[] {
  let t=e.nums,n=e.k,r=t.length,a={};for(let e=0;e<r;e++)a[`num_${e}`]={type:"arrayElement",value:t[e],position:e};let l=new StepRecorder({},a);l.add_new_visual("meta_k",{type:"metadata",value:`k = ${n}`}),l.add_new_visual("meta_min",{type:"metadata",value:"minLength = ∞"}),l.record("-",`Find shortest subarray with sum ≥ ${n}. nums = [${t}]`);let s=Array(r+1).fill(0);for(let e=0;e<r+1;e++)l.add_new_visual(`prefix_${e}`,{type:"arrayElement",value:0,position:e});l.record("build_prefix",`Initialize prefix sum array of length ${r+1} with all zeros`);for(let e=0;e<r;e++)s[e+1]=s[e]+t[e],l.update_visual(`num_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"}),l.update_visual(`prefix_${e+1}`,{type:"arrayElement",value:s[e+1],position:e+1,state:"active"}),e>0&&l.update_visual(`num_${e-1}`,{type:"arrayElement",value:t[e-1],position:e-1}),e>0&&l.update_visual(`prefix_${e}`,{type:"arrayElement",value:s[e],position:e}),l.record("calc_prefix",`prefix[${e+1}] = prefix[${e}] + nums[${e}] = ${s[e+1]}`);r>0&&(l.update_visual(`num_${r-1}`,{type:"arrayElement",value:t[r-1],position:r-1}),l.update_visual(`prefix_${r}`,{type:"arrayElement",value:s[r],position:r}));let o=1/0,u=[],d=()=>{for(let e=0;e<=r;e++)l.delete_visual(`queue_${e}`);u.forEach((e,t)=>{l.add_new_visual(`queue_${t}`,{type:"queueElement",value:e,position:t,label:`p[${e}]=${s[e]}`})})};for(let e=0;e<=r;e++){l.update_visual(`prefix_${e}`,{type:"arrayElement",value:s[e],position:e,state:"highlight"}),e>0&&l.update_visual(`prefix_${e-1}`,{type:"arrayElement",value:s[e-1],position:e-1}),l.add_new_visual("ptr_j",{type:"pointer",position:e,label:"j"}),l.record("iterate",`j = ${e}, prefix[${e}] = ${s[e]}. Process deque.`);let i=!1;for(;u.length>0&&s[e]-s[u[0]]>=n;){i=!0;let a=u[0],c=s[e]-s[a];l.add_conditional("check_valid",!0);for(let n=a;n<e&&n<r;n++)l.update_visual(`num_${n}`,{type:"arrayElement",value:t[n],position:n,state:"active"});l.record("check_valid",`prefix[${e}] - prefix[${a}] = ${c} ≥ ${n}. Valid subarray [${a}..${e-1}], length ${e-a}.`);let p=e-a;p<o&&(o=p,l.update_visual("meta_min",{type:"metadata",value:`minLength = ${o}`})),l.record("update_min",`minLength = min(${o}, ${p}) = ${o}`),u.shift(),d();for(let n=a;n<e&&n<r;n++)l.update_visual(`num_${n}`,{type:"arrayElement",value:t[n],position:n});l.record("pop_front",`Pop ${a} from front of deque`)}if(u.length>0){l.add_conditional("check_valid",!1);let t=u[0],i=s[e]-s[t];l.record("check_valid",`prefix[${e}] - prefix[${t}] = ${i} < ${n}. Stop popping front.`)}else i||(l.add_conditional("check_valid",!1),l.record("check_valid","Deque is empty. No front to check."));let a=!1;for(;u.length>0&&s[e]<=s[u[u.length-1]];){a=!0;let t=u[u.length-1];l.add_conditional("check_back",!0),l.record("check_back",`prefix[${e}] = ${s[e]} ≤ prefix[${t}] = ${s[t]}. Remove ${t} from back.`),u.pop(),d(),l.record("pop_back",`Pop ${t} from back of deque`)}if(u.length>0){l.add_conditional("check_back",!1);let t=u[u.length-1];l.record("check_back",`prefix[${e}] = ${s[e]} > prefix[${t}] = ${s[t]}. Stop popping back.`)}else a||(l.add_conditional("check_back",!1),l.record("check_back","Deque is empty. No back to check."));u.push(e),d(),l.record("push_deque",`Push ${e} onto deque. Deque = [${u}]`)}l.update_visual(`prefix_${r}`,{type:"arrayElement",value:s[r],position:r}),l.delete_visual("ptr_j");for(let e=0;e<=r;e++)l.delete_visual(`queue_${e}`);let c=o===1/0?-1:o;return l.update_visual("meta_min",{type:"metadata",value:`Result = ${c}`}),l.record("complete",`Done! Shortest subarray with sum ≥ ${n} has length ${c}.`),l.getSteps()
}

export function ShortestSubarrayWithSumAtLeastKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ShortestSubarrayWithSumAtLeastKTemplates,
      generateSteps: (e: any) => {
        const recorded = generateShortestSubarrayWithSumAtLeastKSteps(e) as any[];
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
      title="Shortest Subarray with Sum at Least K"
      slug="shortest-subarray-with-sum-at-least-k"
      approaches={approaches}
      presets={ShortestSubarrayWithSumAtLeastKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
