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
// Contiguous Array (contiguous-array)
// ==========================================

const ContiguousArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findMaxLength(nums):\n    # Map stores first occurrence of each prefix sum\n    prefix_map = {0: -1}  # handle subarrays starting from index 0\n    prefix_sum = 0\n    max_len = 0\n\n    for i, num in enumerate(nums):\n        # Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefix_sum += 1 if num == 1 else -1\n\n        if prefix_sum in prefix_map:\n            max_len = max(max_len, i - prefix_map[prefix_sum])\n        else:\n            prefix_map[prefix_sum] = i\n\n    return max_len",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "update_sum": [
        9
      ],
      "check_sum": [
        11
      ],
      "update_max_length": [
        12
      ],
      "store_sum": [
        14
      ],
      "return_result": [
        16
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        11
      ],
      "sum_found_shorter": [
        11
      ],
      "sum_found_longer": [
        11,
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findMaxLength(int[] nums) {\n    // Map stores first occurrence of each prefix sum\n    Map<Integer, Integer> map = new HashMap<>();\n    map.put(0, -1); // handle subarrays starting from index 0\n    int prefixSum = 0;\n    int maxLen = 0;\n\n    for (int i = 0; i < nums.length; i++) {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefixSum += (nums[i] == 1) ? 1 : -1;\n\n        if (map.containsKey(prefixSum)) {\n            maxLen = Math.max(maxLen, i - map.get(prefixSum));\n        } else {\n            map.put(prefixSum, i);\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_sum": [
        10
      ],
      "check_sum": [
        12
      ],
      "update_max_length": [
        13
      ],
      "store_sum": [
        15
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        12
      ],
      "sum_found_shorter": [
        12
      ],
      "sum_found_longer": [
        12,
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findMaxLength(vector<int>& nums) {\n    // Map stores first occurrence of each prefix sum\n    unordered_map<int, int> map;\n    map[0] = -1; // handle subarrays starting from index 0\n    int prefixSum = 0;\n    int maxLen = 0;\n\n    for (int i = 0; i < nums.size(); i++) {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefixSum += (nums[i] == 1) ? 1 : -1;\n\n        if (map.count(prefixSum)) {\n            maxLen = max(maxLen, i - map[prefixSum]);\n        } else {\n            map[prefixSum] = i;\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_sum": [
        10
      ],
      "check_sum": [
        12
      ],
      "update_max_length": [
        13
      ],
      "store_sum": [
        15
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        12
      ],
      "sum_found_shorter": [
        12
      ],
      "sum_found_longer": [
        12,
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindMaxLength(int[] nums) {\n    // Map stores first occurrence of each prefix sum\n    var map = new Dictionary<int, int>();\n    map[0] = -1; // handle subarrays starting from index 0\n    int prefixSum = 0;\n    int maxLen = 0;\n\n    for (int i = 0; i < nums.Length; i++) {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefixSum += (nums[i] == 1) ? 1 : -1;\n\n        if (map.ContainsKey(prefixSum)) {\n            maxLen = Math.Max(maxLen, i - map[prefixSum]);\n        } else {\n            map[prefixSum] = i;\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_sum": [
        10
      ],
      "check_sum": [
        12
      ],
      "update_max_length": [
        13
      ],
      "store_sum": [
        15
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        12
      ],
      "sum_found_shorter": [
        12
      ],
      "sum_found_longer": [
        12,
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaxLength(nums []int) int {\n    // Map stores first occurrence of each prefix sum\n    prefixMap := map[int]int{0: -1} // handle subarrays starting from index 0\n    prefixSum := 0\n    maxLen := 0\n\n    for i, num := range nums {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        if num == 1 {\n            prefixSum++\n        } else {\n            prefixSum--\n        }\n\n        if idx, found := prefixMap[prefixSum]; found {\n            if i-idx > maxLen {\n                maxLen = i - idx\n            }\n        } else {\n            prefixMap[prefixSum] = i\n        }\n    }\n    return maxLen\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "update_sum": [
        9,
        10,
        11,
        12
      ],
      "check_sum": [
        15
      ],
      "update_max_length": [
        16,
        17
      ],
      "store_sum": [
        20
      ],
      "return_result": [
        23
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        15
      ],
      "sum_found_shorter": [
        15
      ],
      "sum_found_longer": [
        15,
        16,
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findMaxLength(nums) {\n    // Map stores first occurrence of each prefix sum\n    const map = new Map();\n    map.set(0, -1); // handle subarrays starting from index 0\n    let prefixSum = 0;\n    let maxLen = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefixSum += nums[i] === 1 ? 1 : -1;\n\n        if (map.has(prefixSum)) {\n            maxLen = Math.max(maxLen, i - map.get(prefixSum));\n        } else {\n            map.set(prefixSum, i);\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_sum": [
        10
      ],
      "check_sum": [
        12
      ],
      "update_max_length": [
        13
      ],
      "store_sum": [
        15
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        12
      ],
      "sum_found_shorter": [
        12
      ],
      "sum_found_longer": [
        12,
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaxLength(nums: number[]): number {\n    // Map stores first occurrence of each prefix sum\n    const map = new Map<number, number>();\n    map.set(0, -1); // handle subarrays starting from index 0\n    let prefixSum = 0;\n    let maxLen = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        // Treat 0 as -1: equal 0s and 1s means sum = 0\n        prefixSum += nums[i] === 1 ? 1 : -1;\n\n        if (map.has(prefixSum)) {\n            maxLen = Math.max(maxLen, i - map.get(prefixSum)!);\n        } else {\n            map.set(prefixSum, i);\n        }\n    }\n    return maxLen;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5,
        6
      ],
      "update_sum": [
        10
      ],
      "check_sum": [
        12
      ],
      "update_max_length": [
        13
      ],
      "store_sum": [
        15
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "sum_not_found": [
        12
      ],
      "sum_found_shorter": [
        12
      ],
      "sum_found_longer": [
        12,
        13
      ]
    }
  }
};

const ContiguousArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        0,
        1,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Alternating",
    "value": {
      "nums": [
        0,
        1,
        0,
        1,
        0,
        1,
        0,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Full Balance",
    "value": {
      "nums": [
        0,
        1,
        1,
        0,
        1,
        1,
        0,
        0
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Mostly Ones",
    "value": {
      "nums": [
        1,
        1,
        1,
        0,
        1
      ]
    }
  }
];

function generateContiguousArraySteps(e: any): any[] {
  let t=[...e.nums],n=t.length,a={};t.forEach((e,t)=>{a[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let r=new StepRecorder({nums:t,maxLen:0,i:-1,j:-1,zeros:0,ones:0,curr:0,isNewMax:!1,bestStart:-1,bestEnd:-1,hit:!1},{...a}),l=(e,t)=>`${e} ${1===e?"zero":"zeros"}, ${t} ${1===t?"one":"ones"}`;r.record("-","Start: find the longest subarray with equal 0s and 1s"),r.record("initialize","Initialize maxLen = 0");let s=0,o=-1,u=-1;for(let e=0;e<n;e++){let i=0,a=0;for(let d=e;d<n;d++){let n=0===t[d];n?i++:a++;let c=i===a,m=d-e+1,f=c&&m>s;r.update_variable("i",e),r.update_variable("j",d),r.update_variable("zeros",i),r.update_variable("ones",a),r.update_variable("curr",t[d]),r.update_variable("hit",c),r.update_variable("isNewMax",f),r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.update_visual("ptr_j",{type:"pointer",position:d,label:"j"}),r.add_conditional("is_zero",n),r.add_conditional("is_balanced",c),c?(f&&(s=m,o=e,u=d,r.update_variable("maxLen",s),r.update_variable("bestStart",o),r.update_variable("bestEnd",u)),r.record("balanced",f?`Window [${e}..${d}]: ${l(i,a)}, length ${m}, new maxLen = ${s}`:`Window [${e}..${d}]: ${l(i,a)}, length ${m}, does not beat ${s}`)):r.record("extend",`Window [${e}..${d}]: ${l(i,a)}, counts differ so it is not balanced`)}}return r.delete_visual("ptr_i"),r.delete_visual("ptr_j"),r.record("complete",s>0?`Return maxLen = ${s}, the window nums[${o}..${u}]`:"Return maxLen = 0, no balanced subarray"),r.getSteps()
}

export function ContiguousArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContiguousArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContiguousArraySteps(e) as any[];
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
      title="Contiguous Array"
      slug="contiguous-array"
      approaches={approaches}
      presets={ContiguousArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Continuous Subarray Sum (continuous-subarray-sum)
// ==========================================

const ContinuousSubarraySumTemplates = {
  "python": {
    "language": "python",
    "code": "def checkSubarraySum(nums, k):\n    # Map: remainder -> earliest index where this remainder was seen\n    remainder_index = {0: -1}\n    prefix_sum = 0\n\n    for i, num in enumerate(nums):\n        prefix_sum += num\n        remainder = prefix_sum % k\n\n        if remainder in remainder_index:\n            # Same remainder seen before, check if subarray length >= 2\n            if i - remainder_index[remainder] >= 2:\n                return True\n        else:\n            # Only store the first occurrence to maximize subarray length\n            remainder_index[remainder] = i\n\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "add_curr": [
        7,
        8
      ],
      "check_remainder": [
        10
      ],
      "found_valid_subarray": [
        12,
        13
      ],
      "return_found": [
        13
      ],
      "store_remainder": [
        16
      ],
      "return_result": [
        18
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        10
      ],
      "remainder_found_invalid": [
        10,
        12
      ],
      "remainder_found_valid": [
        10,
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean checkSubarraySum(int[] nums, int k) {\n    // Map: remainder -> earliest index where this remainder was seen\n    HashMap<Integer, Integer> remainderIndex = new HashMap<>();\n    // Handle subarrays starting from index 0\n    remainderIndex.put(0, -1);\n    long prefixSum = 0;\n\n    for (int i = 0; i < nums.length; i++) {\n        prefixSum += nums[i];\n        int remainder = (int) (prefixSum % k);\n\n        if (remainderIndex.containsKey(remainder)) {\n            // Same remainder seen before, check if subarray length >= 2\n            if (i - remainderIndex.get(remainder) >= 2) {\n                return true;\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex.put(remainder, i);\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        9,
        10
      ],
      "check_remainder": [
        12
      ],
      "found_valid_subarray": [
        14,
        15
      ],
      "return_found": [
        15
      ],
      "store_remainder": [
        19
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        12
      ],
      "remainder_found_invalid": [
        12,
        14
      ],
      "remainder_found_valid": [
        12,
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool checkSubarraySum(vector<int>& nums, int k) {\n    // Map: remainder -> earliest index where this remainder was seen\n    unordered_map<int, int> remainderIndex;\n    // Handle subarrays starting from index 0\n    remainderIndex[0] = -1;\n    long long prefixSum = 0;\n    int n = nums.size();\n\n    for (int i = 0; i < n; i++) {\n        prefixSum += nums[i];\n        int remainder = (int) (prefixSum % k);\n\n        if (remainderIndex.count(remainder)) {\n            // Same remainder seen before, check if subarray length >= 2\n            if (i - remainderIndex[remainder] >= 2) {\n                return true;\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex[remainder] = i;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        10,
        11
      ],
      "check_remainder": [
        13
      ],
      "found_valid_subarray": [
        15,
        16
      ],
      "return_found": [
        16
      ],
      "store_remainder": [
        20
      ],
      "return_result": [
        23
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        13
      ],
      "remainder_found_invalid": [
        13,
        15
      ],
      "remainder_found_valid": [
        13,
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool CheckSubarraySum(int[] nums, int k) {\n    // Map: remainder -> earliest index where this remainder was seen\n    var remainderIndex = new Dictionary<int, int>();\n    // Handle subarrays starting from index 0\n    remainderIndex[0] = -1;\n    long prefixSum = 0;\n\n    for (int i = 0; i < nums.Length; i++) {\n        prefixSum += nums[i];\n        int remainder = (int) (prefixSum % k);\n\n        if (remainderIndex.ContainsKey(remainder)) {\n            // Same remainder seen before, check if subarray length >= 2\n            if (i - remainderIndex[remainder] >= 2) {\n                return true;\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex[remainder] = i;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        9,
        10
      ],
      "check_remainder": [
        12
      ],
      "found_valid_subarray": [
        14,
        15
      ],
      "return_found": [
        15
      ],
      "store_remainder": [
        19
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        12
      ],
      "remainder_found_invalid": [
        12,
        14
      ],
      "remainder_found_valid": [
        12,
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func checkSubarraySum(nums []int, k int) bool {\n    // Map: remainder -> earliest index where this remainder was seen\n    remainderIndex := map[int]int{0: -1}\n    prefixSum := 0\n\n    for i, num := range nums {\n        prefixSum += num\n        remainder := prefixSum % k\n\n        if prevIndex, exists := remainderIndex[remainder]; exists {\n            // Same remainder seen before, check if subarray length >= 2\n            if i - prevIndex >= 2 {\n                return true\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex[remainder] = i\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4
      ],
      "add_curr": [
        7,
        8
      ],
      "check_remainder": [
        10
      ],
      "found_valid_subarray": [
        12,
        13
      ],
      "return_found": [
        13
      ],
      "store_remainder": [
        17
      ],
      "return_result": [
        20
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        10
      ],
      "remainder_found_invalid": [
        10,
        12
      ],
      "remainder_found_valid": [
        10,
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function checkSubarraySum(nums, k) {\n    // Map: remainder -> earliest index where this remainder was seen\n    const remainderIndex = new Map();\n    // Handle subarrays starting from index 0\n    remainderIndex.set(0, -1);\n    let prefixSum = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        prefixSum += nums[i];\n        const remainder = prefixSum % k;\n\n        if (remainderIndex.has(remainder)) {\n            // Same remainder seen before, check if subarray length >= 2\n            if (i - remainderIndex.get(remainder) >= 2) {\n                return true;\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex.set(remainder, i);\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        9,
        10
      ],
      "check_remainder": [
        12
      ],
      "found_valid_subarray": [
        14,
        15
      ],
      "return_found": [
        15
      ],
      "store_remainder": [
        19
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        12
      ],
      "remainder_found_invalid": [
        12,
        14
      ],
      "remainder_found_valid": [
        12,
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function checkSubarraySum(nums: number[], k: number): boolean {\n    // Map: remainder -> earliest index where this remainder was seen\n    const remainderIndex = new Map<number, number>();\n    // Handle subarrays starting from index 0\n    remainderIndex.set(0, -1);\n    let prefixSum = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        prefixSum += nums[i];\n        const remainder = prefixSum % k;\n\n        if (remainderIndex.has(remainder)) {\n            // Same remainder seen before, check if subarray length >= 2\n            if (i - remainderIndex.get(remainder)! >= 2) {\n                return true;\n            }\n        } else {\n            // Only store the first occurrence to maximize subarray length\n            remainderIndex.set(remainder, i);\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        9,
        10
      ],
      "check_remainder": [
        12
      ],
      "found_valid_subarray": [
        14,
        15
      ],
      "return_found": [
        15
      ],
      "store_remainder": [
        19
      ],
      "return_result": [
        22
      ]
    },
    "conditionalMap": {
      "remainder_not_found": [
        12
      ],
      "remainder_found_invalid": [
        12,
        14
      ],
      "remainder_found_valid": [
        12,
        14
      ]
    }
  }
};

const ContinuousSubarraySumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        23,
        2,
        4,
        6,
        7
      ],
      "k": 6
    }
  },
  {
    "id": "ex2",
    "label": "Full Array",
    "value": {
      "nums": [
        23,
        2,
        6,
        4,
        7
      ],
      "k": 6
    }
  },
  {
    "id": "ex3",
    "label": "No Match",
    "value": {
      "nums": [
        23,
        2,
        6,
        4,
        7
      ],
      "k": 13
    }
  },
  {
    "id": "ex4",
    "label": "Two Zeros",
    "value": {
      "nums": [
        1,
        0,
        0,
        4
      ],
      "k": 5
    }
  }
];

function generateContinuousSubarraySumSteps(e: any): any[] {
  let n=e.nums,r=e.k,i=n.reduce((e,n,r)=>(e[`elem_${r}`]={type:"arrayElement",value:n,position:r},e),{}),a=0,l=!1,s={0:-1},d=[],u=new StepRecorder({nums:n,k:r},{...i});u.record("-","Start: find a subarray of length >= 2 whose sum is a multiple of k"),u.add_new_variable("sum",0),u.add_new_variable("found",l),u.add_new_variable("map",{...s}),u.add_new_variable("i",-1),u.add_new_variable("prev",0),u.add_new_variable("hitState",""),u.add_new_variable("prevIdx",-2),u.add_new_variable("stored",!1),u.add_new_variable("rangeStart",-1),u.add_new_variable("rangeEnd",-1),u.add_new_variable("rangeSum",0),u.record("initialize","Initialize prefixSum = 0, remainderIndex = {0: -1} (remainder 0 before the array starts)");for(let e=0;e<n.length;e++){let t=n[e],i=a;a+=t,d.push(a);let o=a%r;u.update_variable("i",e),u.update_variable("prev",i),u.update_variable("sum",a),u.update_variable("curr",t),u.update_variable("remainder",o),u.update_variable("hitState",""),u.update_visual("curr",{type:"pointer",position:e,label:"curr"}),u.record("add_curr",`prefixSum = ${i} + ${t} = ${a}, remainder = ${a} mod ${r} = ${o}`);let c=s[o],m=void 0!==c;if(m){if(e-c>=2){l=!0;let n=c+1,t=d[e]-(c>=0?d[c]:0);u.add_conditional("remainder_found_valid",!0),u.update_variable("found",l),u.update_variable("hitState","valid"),u.update_variable("prevIdx",c),u.update_variable("rangeStart",n),u.update_variable("rangeEnd",e),u.update_variable("rangeSum",t),u.record("found_valid_subarray",`Remainder ${o} seen at index ${c}: nums[${n}..${e}] sums to ${t}, a multiple of ${r}`);break}u.add_conditional("remainder_found_invalid",!1),u.update_variable("hitState","short"),u.update_variable("prevIdx",c),u.record("check_remainder",`Remainder ${o} seen at index ${c}, but length ${e-c} < 2`)}else u.add_conditional("remainder_not_found",!1),u.update_variable("hitState","miss"),u.record("check_remainder",`Remainder ${o} not seen before`);let f=!m;f&&(s[o]=e,u.update_variable("map",{...s})),u.update_variable("stored",f),u.record("store_remainder",f?`Store first occurrence: remainderIndex[${o}] = ${e}`:`Keep remainderIndex[${o}] = ${c}, the earliest index wins`)}return l?u.record("return_found","Return true, a valid subarray exists"):(u.delete_variable("curr"),u.delete_variable("remainder"),u.delete_visual("curr"),u.record("return_result","Return false, no subarray of length >= 2 sums to a multiple of k")),u.getSteps()
}

export function ContinuousSubarraySumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContinuousSubarraySumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContinuousSubarraySumSteps(e) as any[];
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
      title="Continuous Subarray Sum"
      slug="continuous-subarray-sum"
      approaches={approaches}
      presets={ContinuousSubarraySumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subarray Sum Equals K (subarray-sum-equals-k)
// ==========================================

const SubarraySumEqualsKTemplates = {
  "python": {
    "language": "python",
    "code": "def subarraySum(nums, k):\n    count = 0\n    prefix_sum = 0\n    # Map from prefix sum value to how many times we've seen it\n    prefix_count = {0: 1}  # Empty prefix (sum = 0) seen once\n\n    for num in nums:\n        prefix_sum += num\n        # How many earlier prefix sums form a valid subarray ending here?\n        count += prefix_count.get(prefix_sum - k, 0)\n        prefix_count[prefix_sum] = prefix_count.get(prefix_sum, 0) + 1\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "add_curr": [
        8
      ],
      "found_target": [
        10
      ],
      "increment_count": [
        10
      ],
      "update_hashmap": [
        11
      ],
      "return_count": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int subarraySum(int[] nums, int k) {\n    int count = 0;\n    int prefixSum = 0;\n    // Map from prefix sum value to how many times we've seen it\n    HashMap<Integer, Integer> prefixCount = new HashMap<>();\n    prefixCount.put(0, 1); // Empty prefix (sum = 0) seen once\n\n    for (int num : nums) {\n        prefixSum += num;\n        // How many earlier prefix sums form a valid subarray ending here?\n        count += prefixCount.getOrDefault(prefixSum - k, 0);\n        prefixCount.put(prefixSum, prefixCount.getOrDefault(prefixSum, 0) + 1);\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5,
        6
      ],
      "add_curr": [
        9
      ],
      "found_target": [
        11
      ],
      "increment_count": [
        11
      ],
      "update_hashmap": [
        12
      ],
      "return_count": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int subarraySum(vector<int>& nums, int k) {\n    int count = 0;\n    int prefixSum = 0;\n    // Map from prefix sum value to how many times we've seen it\n    unordered_map<int, int> prefixCount;\n    prefixCount[0] = 1; // Empty prefix (sum = 0) seen once\n\n    for (int num : nums) {\n        prefixSum += num;\n        // How many earlier prefix sums form a valid subarray ending here?\n        if (prefixCount.count(prefixSum - k)) {\n            count += prefixCount[prefixSum - k];\n        }\n        prefixCount[prefixSum]++;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5,
        6
      ],
      "add_curr": [
        9
      ],
      "found_target": [
        11
      ],
      "increment_count": [
        12
      ],
      "update_hashmap": [
        14
      ],
      "return_count": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SubarraySum(int[] nums, int k) {\n    int count = 0;\n    int prefixSum = 0;\n    // Map from prefix sum value to how many times we've seen it\n    Dictionary<int, int> prefixCount = new Dictionary<int, int>();\n    prefixCount[0] = 1; // Empty prefix (sum = 0) seen once\n\n    foreach (int num in nums) {\n        prefixSum += num;\n        // How many earlier prefix sums form a valid subarray ending here?\n        if (prefixCount.ContainsKey(prefixSum - k)) {\n            count += prefixCount[prefixSum - k];\n        }\n        prefixCount[prefixSum] = prefixCount.GetValueOrDefault(prefixSum, 0) + 1;\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5,
        6
      ],
      "add_curr": [
        9
      ],
      "found_target": [
        11
      ],
      "increment_count": [
        12
      ],
      "update_hashmap": [
        14
      ],
      "return_count": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subarraySum(nums []int, k int) int {\n    count := 0\n    prefixSum := 0\n    // Map from prefix sum value to how many times we've seen it\n    prefixCount := map[int]int{0: 1} // Empty prefix (sum = 0) seen once\n\n    for _, num := range nums {\n        prefixSum += num\n        // How many earlier prefix sums form a valid subarray ending here?\n        if freq, ok := prefixCount[prefixSum-k]; ok {\n            count += freq\n        }\n        prefixCount[prefixSum]++\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5
      ],
      "add_curr": [
        8
      ],
      "found_target": [
        10
      ],
      "increment_count": [
        11
      ],
      "update_hashmap": [
        13
      ],
      "return_count": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function subarraySum(nums, k) {\n  let count = 0\n  let prefixSum = 0\n  // Map from prefix sum value to how many times we've seen it\n  const prefixCount = new Map()\n  prefixCount.set(0, 1) // Empty prefix (sum = 0) seen once\n\n  for (const num of nums) {\n    prefixSum += num\n    // How many earlier prefix sums form a valid subarray ending here?\n    count += prefixCount.get(prefixSum - k) || 0\n    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1)\n  }\n  return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5,
        6
      ],
      "add_curr": [
        9
      ],
      "found_target": [
        11
      ],
      "increment_count": [
        11
      ],
      "update_hashmap": [
        12
      ],
      "return_count": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subarraySum(nums: number[], k: number): number {\n  let count = 0\n  let prefixSum = 0\n  // Map from prefix sum value to how many times we've seen it\n  const prefixCount = new Map<number, number>()\n  prefixCount.set(0, 1) // Empty prefix (sum = 0) seen once\n\n  for (const num of nums) {\n    prefixSum += num\n    // How many earlier prefix sums form a valid subarray ending here?\n    count += prefixCount.get(prefixSum - k) || 0\n    prefixCount.set(prefixSum, (prefixCount.get(prefixSum) || 0) + 1)\n  }\n  return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        5,
        6
      ],
      "add_curr": [
        9
      ],
      "found_target": [
        11
      ],
      "increment_count": [
        11
      ],
      "update_hashmap": [
        12
      ],
      "return_count": [
        14
      ]
    }
  }
};

const SubarraySumEqualsKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        1,
        1,
        1
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "With Negatives",
    "value": {
      "nums": [
        3,
        4,
        7,
        -2,
        2,
        1,
        4,
        2
      ],
      "k": 7
    }
  },
  {
    "id": "ex3",
    "label": "All Zeroes",
    "value": {
      "nums": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "k": 0
    }
  }
];

function generateSubarraySumEqualsKSteps(e: any): any[] {
  let t=e.nums,n=e.k,r=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),a=0,l=0,s={0:1},u={0:-1},o=new StepRecorder({nums:t,k:n},{...r});o.record("-","Start: count subarrays whose sum equals k"),o.add_new_variable("sum",0),o.add_new_variable("count",l),o.add_new_variable("map",{...s}),o.add_new_variable("i",-1),o.add_new_variable("prev",0),o.add_new_variable("hit",!1),o.add_new_variable("matches",0),o.add_new_variable("oldCount",0),o.add_new_variable("rangeStart",-1),o.add_new_variable("rangeEnd",-1),o.record("initialize","Initialize prefixSum = 0, count = 0, prefixCount = {0: 1} (empty prefix seen once)");for(let e=0;e<t.length;e++){let i=t[e],r=a,c=(a+=i)-n;if(o.update_variable("i",e),o.update_variable("prev",r),o.update_variable("sum",a),o.update_variable("curr",i),o.update_variable("target",c),o.update_visual("curr",{type:"pointer",position:e,label:"curr"}),o.record("add_curr",`prefixSum = ${r} + ${i} = ${a}, look for prefixSum - k = ${c}`),void 0!==s[c]){let t=s[c],n=u[c]+1,i=e,r=l;l+=t,o.update_variable("hit",!0),o.update_variable("matches",t),o.update_variable("oldCount",r),o.update_variable("count",l),o.update_variable("rangeStart",n),o.update_variable("rangeEnd",i),o.record("increment_count",`prefixCount has ${c}: ${t} ${1===t?"subarray ends":"subarrays end"} here, count = ${r} + ${t} = ${l}`)}else o.update_variable("hit",!1),o.record("found_target",`prefixSum - k = ${c} has not been seen, so nothing is added here`);s[a]=(s[a]||0)+1,u[a]=e,o.update_variable("map",{...s}),o.update_variable("rangeStart",-1),o.update_variable("rangeEnd",-1),o.record("update_hashmap",`Record this prefix: prefixCount[${a}] = ${s[a]}`)}return o.delete_variable("curr"),o.delete_variable("target"),o.delete_visual("curr"),o.record("return_count",`Return count = ${l}`),o.getSteps()
}

export function SubarraySumEqualsKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubarraySumEqualsKTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSubarraySumEqualsKSteps(e) as any[];
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
      title="Subarray Sum Equals K"
      slug="subarray-sum-equals-k"
      approaches={approaches}
      presets={SubarraySumEqualsKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subarray Sum Divisible by K (subarray-sums-divisible-by-k)
// ==========================================

const SubarraySumsDivisibleByKTemplates = {
  "python": {
    "language": "python",
    "code": "def subarraysDivByK(nums, k):\n    # Map to count occurrences of each remainder\n    remainder_count = {0: 1}  # empty prefix has remainder 0\n    prefix_sum = 0\n    count = 0\n\n    for num in nums:\n        prefix_sum += num\n        # Python's % already returns non-negative for positive k\n        remainder = prefix_sum % k\n\n        # Each previous prefix sum with the same remainder forms a valid subarray\n        count += remainder_count.get(remainder, 0)\n        remainder_count[remainder] = remainder_count.get(remainder, 0) + 1\n\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_curr": [
        8,
        10
      ],
      "check_remainder": [
        13
      ],
      "increment_count": [
        13
      ],
      "update_hashmap": [
        14
      ],
      "return_count": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int subarraysDivByK(int[] nums, int k) {\n    // Map to count occurrences of each remainder\n    Map<Integer, Integer> remainderCount = new HashMap<>();\n    remainderCount.put(0, 1); // empty prefix has remainder 0\n\n    int prefixSum = 0;\n    int count = 0;\n\n    for (int num : nums) {\n        prefixSum += num;\n        // Normalize remainder to handle negative prefix sums\n        int remainder = ((prefixSum % k) + k) % k;\n\n        // Each previous prefix sum with the same remainder forms a valid subarray\n        count += remainderCount.getOrDefault(remainder, 0);\n        remainderCount.put(remainder, remainderCount.getOrDefault(remainder, 0) + 1);\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        6,
        7
      ],
      "add_curr": [
        10,
        12
      ],
      "check_remainder": [
        15
      ],
      "increment_count": [
        15
      ],
      "update_hashmap": [
        16
      ],
      "return_count": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int subarraysDivByK(vector<int>& nums, int k) {\n    // Map to count occurrences of each remainder\n    unordered_map<int, int> remainderCount;\n    remainderCount[0] = 1; // empty prefix has remainder 0\n\n    int prefixSum = 0;\n    int count = 0;\n\n    for (int num : nums) {\n        prefixSum += num;\n        // Normalize remainder to handle negative prefix sums\n        int remainder = ((prefixSum % k) + k) % k;\n\n        // Each previous prefix sum with the same remainder forms a valid subarray\n        count += remainderCount[remainder];\n        remainderCount[remainder]++;\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        6,
        7
      ],
      "add_curr": [
        10,
        12
      ],
      "check_remainder": [
        15
      ],
      "increment_count": [
        15
      ],
      "update_hashmap": [
        16
      ],
      "return_count": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SubarraysDivByK(int[] nums, int k) {\n    // Map to count occurrences of each remainder\n    var remainderCount = new Dictionary<int, int> { { 0, 1 } };\n\n    int prefixSum = 0;\n    int count = 0;\n\n    foreach (int num in nums) {\n        prefixSum += num;\n        // Normalize remainder to handle negative prefix sums\n        int remainder = ((prefixSum % k) + k) % k;\n\n        // Each previous prefix sum with the same remainder forms a valid subarray\n        if (remainderCount.ContainsKey(remainder)) {\n            count += remainderCount[remainder];\n            remainderCount[remainder]++;\n        } else {\n            remainderCount[remainder] = 1;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        5,
        6
      ],
      "add_curr": [
        9,
        11
      ],
      "check_remainder": [
        14
      ],
      "increment_count": [
        15
      ],
      "update_hashmap": [
        16,
        17,
        18
      ],
      "return_count": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subarraysDivByK(nums []int, k int) int {\n    // Map to count occurrences of each remainder\n    remainderCount := map[int]int{0: 1} // empty prefix has remainder 0\n    prefixSum := 0\n    count := 0\n\n    for _, num := range nums {\n        prefixSum += num\n        // Normalize remainder to handle negative prefix sums\n        remainder := ((prefixSum % k) + k) % k\n\n        // Each previous prefix sum with the same remainder forms a valid subarray\n        count += remainderCount[remainder]\n        remainderCount[remainder]++\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_curr": [
        8,
        10
      ],
      "check_remainder": [
        13
      ],
      "increment_count": [
        13
      ],
      "update_hashmap": [
        14
      ],
      "return_count": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function subarraysDivByK(nums, k) {\n  // Map to count occurrences of each remainder\n  const remainderCount = new Map([[0, 1]]) // empty prefix has remainder 0\n  let prefixSum = 0\n  let count = 0\n\n  for (const num of nums) {\n    prefixSum += num\n    // Normalize remainder to handle negative prefix sums\n    const remainder = ((prefixSum % k) + k) % k\n\n    // Each previous prefix sum with the same remainder forms a valid subarray\n    const prev = remainderCount.get(remainder) || 0\n    count += prev\n    remainderCount.set(remainder, prev + 1)\n  }\n\n  return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_curr": [
        8,
        10
      ],
      "check_remainder": [
        13
      ],
      "increment_count": [
        14
      ],
      "update_hashmap": [
        15
      ],
      "return_count": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subarraysDivByK(nums: number[], k: number): number {\n  // Map to count occurrences of each remainder\n  const remainderCount = new Map<number, number>([[0, 1]]) // empty prefix has remainder 0\n  let prefixSum = 0\n  let count = 0\n\n  for (const num of nums) {\n    prefixSum += num\n    // Normalize remainder to handle negative prefix sums\n    const remainder = ((prefixSum % k) + k) % k\n\n    // Each previous prefix sum with the same remainder forms a valid subarray\n    const prev = remainderCount.get(remainder) || 0\n    count += prev\n    remainderCount.set(remainder, prev + 1)\n  }\n\n  return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "add_curr": [
        8,
        10
      ],
      "check_remainder": [
        13
      ],
      "increment_count": [
        14
      ],
      "update_hashmap": [
        15
      ],
      "return_count": [
        18
      ]
    }
  }
};

const SubarraySumsDivisibleByKPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        4,
        5,
        0,
        -2,
        -3,
        1
      ],
      "k": 5
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
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
    "id": "ex3",
    "label": "All Multiples",
    "value": {
      "nums": [
        7,
        -7,
        14,
        -14,
        21
      ],
      "k": 7
    }
  }
];

function generateSubarraySumsDivisibleByKSteps(e: any): any[] {
  let t=e.nums,n=e.k,r=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),a=0,l=0,s={0:1},o={0:-1},u=new StepRecorder({nums:t,k:n},{...r});u.record("-","Start: count subarrays whose sum is divisible by k"),u.add_new_variable("sum",0),u.add_new_variable("count",l),u.add_new_variable("map",{...s}),u.add_new_variable("i",-1),u.add_new_variable("prev",0),u.add_new_variable("hit",!1),u.add_new_variable("matches",0),u.add_new_variable("oldCount",0),u.add_new_variable("rangeStart",-1),u.add_new_variable("rangeEnd",-1),u.record("initialize","Initialize prefixSum = 0, count = 0, remainderCount = {0: 1} (empty prefix has remainder 0)");for(let e=0;e<t.length;e++){let i=t[e],r=a,d=((a+=i)%n+n)%n;if(u.update_variable("i",e),u.update_variable("prev",r),u.update_variable("sum",a),u.update_variable("curr",i),u.update_variable("remainder",d),u.update_visual("curr",{type:"pointer",position:e,label:"curr"}),u.record("add_curr",`prefixSum = ${r} + ${i} = ${a}, remainder = ${a} mod ${n} = ${d}`),void 0!==s[d]){let t=s[d],n=o[d]+1,i=e,r=l;l+=t,u.update_variable("hit",!0),u.update_variable("matches",t),u.update_variable("oldCount",r),u.update_variable("count",l),u.update_variable("rangeStart",n),u.update_variable("rangeEnd",i),u.record("increment_count",`Remainder ${d} seen before: ${t} ${1===t?"subarray ends":"subarrays end"} here, count = ${r} + ${t} = ${l}`)}else u.update_variable("hit",!1),u.record("check_remainder",`Remainder ${d} not seen before, no subarray ends here`);s[d]=(s[d]||0)+1,o[d]=e,u.update_variable("map",{...s}),u.update_variable("rangeStart",-1),u.update_variable("rangeEnd",-1),u.record("update_hashmap",`Record this remainder: remainderCount[${d}] = ${s[d]}`)}return u.delete_variable("curr"),u.delete_variable("remainder"),u.delete_visual("curr"),u.record("return_count",`Return count = ${l}`),u.getSteps()
}

export function SubarraySumsDivisibleByKProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubarraySumsDivisibleByKTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSubarraySumsDivisibleByKSteps(e) as any[];
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
      title="Subarray Sum Divisible by K"
      slug="subarray-sums-divisible-by-k"
      approaches={approaches}
      presets={SubarraySumsDivisibleByKPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Running Sum of 1d Array (running-sum-of-1d-array)
// ==========================================

const RunningSumOf1dArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def runningSum(nums):\n    n = len(nums)\n    result = [0] * n\n\n    result[0] = nums[0]\n    for i in range(1, n):\n        # Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i]\n\n    return result",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] runningSum(int[] nums) {\n    int n = nums.length;\n    int[] result = new int[n];\n\n    result[0] = nums[0];\n    for (int i = 1; i < n; i++) {\n        // Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> runningSum(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> result(n);\n\n    result[0] = nums[0];\n    for (int i = 1; i < n; i++) {\n        // Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] RunningSum(int[] nums) {\n    int n = nums.Length;\n    int[] result = new int[n];\n\n    result[0] = nums[0];\n    for (int i = 1; i < n; i++) {\n        // Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func runningSum(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n\n    result[0] = nums[0]\n    for i := 1; i < n; i++ {\n        // Each running sum builds on the previous one\n        result[i] = result[i-1] + nums[i]\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function runningSum(nums) {\n    var n = nums.length;\n    var result = new Array(n);\n\n    result[0] = nums[0];\n    for (var i = 1; i < n; i++) {\n        // Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function runningSum(nums: number[]): number[] {\n    const n = nums.length;\n    const result = new Array(n);\n\n    result[0] = nums[0];\n    for (let i = 1; i < n; i++) {\n        // Each running sum builds on the previous one\n        result[i] = result[i - 1] + nums[i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        3,
        5
      ],
      "add": [
        6,
        8
      ],
      "write": [
        8
      ],
      "complete": [
        11
      ]
    }
  }
};

const RunningSumOf1dArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Basic",
    "value": {
      "nums": [
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Ones",
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
    "id": "ex3",
    "label": "Mixed",
    "value": {
      "nums": [
        3,
        1,
        2,
        10,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "With Negatives",
    "value": {
      "nums": [
        5,
        -2,
        3,
        -8,
        4
      ]
    }
  }
];

function generateRunningSumOf1dArraySteps(e: any): any[] {
  let t=[...e.nums],n=t.length,r={};t.forEach((e,t)=>{r[`input_${t}`]={type:"arrayElement",value:e,position:t,state:"readonly"},r[`res_${t}`]={type:"arrayElement",value:"",position:t}});let l=new StepRecorder({phase:"start",i:-1,j:-1,total:0,addVal:0},r);l.record("-","Start: recompute each result[i] by summing nums[0..i] from scratch");for(let e=0;e<n;e++){l.update_variable("phase","scan"),l.update_variable("i",e),l.update_variable("j",-1),l.update_variable("total",0),l.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),l.delete_visual("ptr_j"),l.record("start_i",`Compute result[${e}]: reset sum to 0, rescan nums[0..${e}]`);let n=0;for(let i=0;i<=e;i++)n+=t[i],l.update_variable("phase","scan"),l.update_variable("j",i),l.update_variable("addVal",t[i]),l.update_variable("total",n),l.update_visual("ptr_j",{type:"pointer",position:i,label:"j"}),l.record("add",`sum += nums[${i}] = ${t[i]}, sum is now ${n}`);l.update_variable("phase","write"),l.update_visual(`res_${e}`,{type:"arrayElement",value:n,position:e}),l.record("write",`Write ${n} into result[${e}]`)}return l.update_variable("phase","done"),l.delete_visual("ptr_i"),l.delete_visual("ptr_j"),l.record("complete","Done: every result[i] holds the sum of nums[0..i]"),l.getSteps()
}

export function RunningSumOf1dArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RunningSumOf1dArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRunningSumOf1dArraySteps(e) as any[];
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
      title="Running Sum of 1d Array"
      slug="running-sum-of-1d-array"
      approaches={approaches}
      presets={RunningSumOf1dArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Pivot Index (find-pivot-index)
// ==========================================

const FindPivotIndexTemplates = {
  "python": {
    "language": "python",
    "code": "def pivotIndex(nums):\n    total_sum = sum(nums)\n\n    left_sum = 0\n    for i in range(len(nums)):\n        # Right sum is everything except left_sum and nums[i]\n        right_sum = total_sum - left_sum - nums[i]\n        if left_sum == right_sum:\n            return i\n        left_sum += nums[i]\n\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2
      ],
      "check_pivot": [
        7,
        8
      ],
      "found": [
        9
      ],
      "complete_found": [
        9
      ],
      "update_left": [
        10
      ],
      "not_found": [
        12
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int pivotIndex(int[] nums) {\n    int totalSum = 0;\n    for (int num : nums) {\n        totalSum += num;\n    }\n\n    int leftSum = 0;\n    for (int i = 0; i < nums.length; i++) {\n        // Right sum is everything except leftSum and nums[i]\n        int rightSum = totalSum - leftSum - nums[i];\n        if (leftSum == rightSum) {\n            return i;\n        }\n        leftSum += nums[i];\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int pivotIndex(vector<int>& nums) {\n    int totalSum = 0;\n    for (int num : nums) {\n        totalSum += num;\n    }\n\n    int leftSum = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        // Right sum is everything except leftSum and nums[i]\n        int rightSum = totalSum - leftSum - nums[i];\n        if (leftSum == rightSum) {\n            return i;\n        }\n        leftSum += nums[i];\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int PivotIndex(int[] nums) {\n    int totalSum = 0;\n    foreach (int num in nums) {\n        totalSum += num;\n    }\n\n    int leftSum = 0;\n    for (int i = 0; i < nums.Length; i++) {\n        // Right sum is everything except leftSum and nums[i]\n        int rightSum = totalSum - leftSum - nums[i];\n        if (leftSum == rightSum) {\n            return i;\n        }\n        leftSum += nums[i];\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func pivotIndex(nums []int) int {\n    totalSum := 0\n    for _, num := range nums {\n        totalSum += num\n    }\n\n    leftSum := 0\n    for i := 0; i < len(nums); i++ {\n        // Right sum is everything except leftSum and nums[i]\n        rightSum := totalSum - leftSum - nums[i]\n        if leftSum == rightSum {\n            return i\n        }\n        leftSum += nums[i]\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function pivotIndex(nums) {\n    var totalSum = 0;\n    for (var i = 0; i < nums.length; i++) {\n        totalSum += nums[i];\n    }\n\n    var leftSum = 0;\n    for (var i = 0; i < nums.length; i++) {\n        // Right sum is everything except leftSum and nums[i]\n        var rightSum = totalSum - leftSum - nums[i];\n        if (leftSum === rightSum) {\n            return i;\n        }\n        leftSum += nums[i];\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function pivotIndex(nums: number[]): number {\n    let totalSum = 0;\n    for (const num of nums) {\n        totalSum += num;\n    }\n\n    let leftSum = 0;\n    for (let i = 0; i < nums.length; i++) {\n        // Right sum is everything except leftSum and nums[i]\n        const rightSum = totalSum - leftSum - nums[i];\n        if (leftSum === rightSum) {\n            return i;\n        }\n        leftSum += nums[i];\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3,
        4,
        5
      ],
      "check_pivot": [
        10,
        11
      ],
      "found": [
        12
      ],
      "complete_found": [
        12
      ],
      "update_left": [
        14
      ],
      "not_found": [
        17
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_pivot": [
        11
      ]
    }
  }
};

const FindPivotIndexPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        1,
        7,
        3,
        6,
        5,
        6
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Pivot at Start",
    "value": {
      "nums": [
        2,
        1,
        -1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No Pivot",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Ones",
    "value": {
      "nums": [
        1,
        1,
        1,
        1,
        1,
        1
      ]
    }
  }
];

function generateFindPivotIndexSteps(e: any): any[] {
  let t=[...e.nums],i=t.length,l=t.reduce((e,t)=>e+t,0),r={};t.forEach((e,t)=>{r[`bar_${t}`]={type:"arrayElement",value:e,position:t,state:"readonly"}});let o=new StepRecorder({phase:"start",i:-1,leftSum:0,rightSum:0,totalSum:l,addVal:0,newLeft:0,pivot:-2},r);o.record("-","Start: find the index where the sums on both sides are equal"),o.update_variable("phase","total"),o.record("compute_total",`Compute totalSum = ${l}`);let a=0;for(let e=0;e<i;e++){let i=l-a-t[e],n=a===i;if(o.update_variable("phase","check"),o.update_variable("i",e),o.update_variable("leftSum",a),o.update_variable("rightSum",i),o.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),o.add_conditional("check_pivot",n),o.record("check_pivot",`Check i = ${e}: leftSum (${a}) vs rightSum (${i})${n?": equal!":": not equal"}`),n)return o.update_variable("phase","found"),o.record("found",`Pivot found at index ${e}: leftSum = rightSum = ${a}`),o.update_variable("phase","done"),o.update_variable("pivot",e),o.record("complete_found",`Return ${e}, the pivot index`),o.getSteps();o.update_variable("phase","absorb"),o.update_variable("addVal",t[e]),o.update_variable("newLeft",a+t[e]),a+=t[e],o.record("update_left",`Move on: leftSum absorbs nums[${e}], leftSum = ${a}`)}return o.update_variable("phase","nofind"),o.delete_visual("ptr_i"),o.record("not_found","No index balances the array: leftSum never equals rightSum"),o.update_variable("phase","done"),o.update_variable("pivot",-1),o.record("complete","Return -1, no pivot index exists"),o.getSteps()
}

export function FindPivotIndexProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindPivotIndexTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindPivotIndexSteps(e) as any[];
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
      title="Find Pivot Index"
      slug="find-pivot-index"
      approaches={approaches}
      presets={FindPivotIndexPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Population Year (maximum-population-year)
// ==========================================

const MaximumPopulationYearTemplates = {
  "python": {
    "language": "python",
    "code": "def maximumPopulation(logs):\n    delta = [0] * 101  # years 1950 to 2050\n\n    # Record birth and death events\n    for birth, death in logs:\n        delta[birth - 1950] += 1\n        delta[death - 1950] -= 1\n\n    # Sweep to find the year with maximum population\n    max_pop = 0\n    running_sum = 0\n    result_year = 1950\n\n    for i in range(101):\n        running_sum += delta[i]\n        if running_sum > max_pop:\n            max_pop = running_sum\n            result_year = 1950 + i\n\n    return result_year",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        14,
        15
      ],
      "new_max": [
        17,
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maximumPopulation(int[][] logs) {\n    int[] delta = new int[101]; // years 1950 to 2050\n\n    // Record birth and death events\n    for (int[] log : logs) {\n        delta[log[0] - 1950]++;\n        delta[log[1] - 1950]--;\n    }\n\n    // Sweep to find the year with maximum population\n    int maxPop = 0;\n    int runningSum = 0;\n    int resultYear = 1950;\n\n    for (int i = 0; i < 101; i++) {\n        runningSum += delta[i];\n        if (runningSum > maxPop) {\n            maxPop = runningSum;\n            resultYear = 1950 + i;\n        }\n    }\n\n    return resultYear;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maximumPopulation(vector<vector<int>>& logs) {\n    int delta[101] = {0}; // years 1950 to 2050\n\n    // Record birth and death events\n    for (auto& log : logs) {\n        delta[log[0] - 1950]++;\n        delta[log[1] - 1950]--;\n    }\n\n    // Sweep to find the year with maximum population\n    int maxPop = 0;\n    int runningSum = 0;\n    int resultYear = 1950;\n\n    for (int i = 0; i < 101; i++) {\n        runningSum += delta[i];\n        if (runningSum > maxPop) {\n            maxPop = runningSum;\n            resultYear = 1950 + i;\n        }\n    }\n\n    return resultYear;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaximumPopulation(int[][] logs) {\n    int[] delta = new int[101]; // years 1950 to 2050\n\n    // Record birth and death events\n    foreach (int[] log in logs) {\n        delta[log[0] - 1950]++;\n        delta[log[1] - 1950]--;\n    }\n\n    // Sweep to find the year with maximum population\n    int maxPop = 0;\n    int runningSum = 0;\n    int resultYear = 1950;\n\n    for (int i = 0; i < 101; i++) {\n        runningSum += delta[i];\n        if (runningSum > maxPop) {\n            maxPop = runningSum;\n            resultYear = 1950 + i;\n        }\n    }\n\n    return resultYear;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumPopulation(logs [][]int) int {\n    delta := make([]int, 101) // years 1950 to 2050\n\n    // Record birth and death events\n    for _, log := range logs {\n        delta[log[0]-1950]++\n        delta[log[1]-1950]--\n    }\n\n    // Sweep to find the year with maximum population\n    maxPop := 0\n    runningSum := 0\n    resultYear := 1950\n\n    for i := 0; i < 101; i++ {\n        runningSum += delta[i]\n        if runningSum > maxPop {\n            maxPop = runningSum\n            resultYear = 1950 + i\n        }\n    }\n\n    return resultYear\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maximumPopulation(logs) {\n    var delta = new Array(101).fill(0); // years 1950 to 2050\n\n    // Record birth and death events\n    for (var i = 0; i < logs.length; i++) {\n        delta[logs[i][0] - 1950]++;\n        delta[logs[i][1] - 1950]--;\n    }\n\n    // Sweep to find the year with maximum population\n    var maxPop = 0;\n    var runningSum = 0;\n    var resultYear = 1950;\n\n    for (var j = 0; j < 101; j++) {\n        runningSum += delta[j];\n        if (runningSum > maxPop) {\n            maxPop = runningSum;\n            resultYear = 1950 + j;\n        }\n    }\n\n    return resultYear;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumPopulation(logs: number[][]): number {\n    const delta = new Array(101).fill(0); // years 1950 to 2050\n\n    // Record birth and death events\n    for (const log of logs) {\n        delta[log[0] - 1950]++;\n        delta[log[1] - 1950]--;\n    }\n\n    // Sweep to find the year with maximum population\n    let maxPop = 0;\n    let runningSum = 0;\n    let resultYear = 1950;\n\n    for (let i = 0; i < 101; i++) {\n        runningSum += delta[i];\n        if (runningSum > maxPop) {\n            maxPop = runningSum;\n            resultYear = 1950 + i;\n        }\n    }\n\n    return resultYear;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_event": [
        6,
        7
      ],
      "sweep": [
        15,
        16
      ],
      "new_max": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "sweep_check": [
        17
      ]
    }
  }
};

const MaximumPopulationYearPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "No Overlap",
    "value": {
      "logs": [
        [
          1993,
          1999
        ],
        [
          2000,
          2010
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Chained",
    "value": {
      "logs": [
        [
          1950,
          1961
        ],
        [
          1960,
          1971
        ],
        [
          1970,
          1981
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Stacked",
    "value": {
      "logs": [
        [
          1960,
          1975
        ],
        [
          1962,
          1980
        ],
        [
          1964,
          1970
        ],
        [
          1966,
          1972
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Back to Back",
    "value": {
      "logs": [
        [
          1950,
          1951
        ],
        [
          1951,
          1952
        ],
        [
          1952,
          1953
        ]
      ]
    }
  }
];

function generateMaximumPopulationYearSteps(e: any): any[] {
  let t=e.logs.map(e=>[...e]),a=new StepRecorder({phase:"start",logs:t,minYear:1950,maxYear:2050,year:1950,pop:0,maxPop:0,bestYear:0,isNewMax:!1,resultYear:0,resultPop:0},{});a.record("-",`Start: ${t.length} ${1===t.length?"person":"people"}, check every year from 1950 to 2050`);let l=0,i=0;for(let e=1950;e<=2050;e++){let r=0;for(let[a,l]of t)a<=e&&e<l&&r++;let n=r>l;if(a.update_variable("phase","check"),a.update_variable("year",e),a.update_variable("pop",r),a.update_variable("isNewMax",n),a.add_conditional("check_max",n),n){let t=l;l=r,i=e,a.update_variable("maxPop",l),a.update_variable("bestYear",i),a.record("new_max",`Year ${e}: ${r} alive, new maximum (was ${t})`)}else a.record("check_year",0===l?`Year ${e}: ${r} alive, no maximum yet`:`Year ${e}: ${r} alive, max stays ${l} @ ${i}`)}return a.update_variable("phase","done"),a.update_variable("resultYear",i),a.update_variable("resultPop",l),a.record("complete",`Return ${i}: earliest year with maximum population ${l}`),a.getSteps()
}

export function MaximumPopulationYearProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumPopulationYearTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaximumPopulationYearSteps(e) as any[];
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
      title="Maximum Population Year"
      slug="maximum-population-year"
      approaches={approaches}
      presets={MaximumPopulationYearPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Addition (range-addition)
// ==========================================

const RangeAdditionTemplates = {
  "python": {
    "language": "python",
    "code": "def getModifiedArray(length, updates):\n    diff = [0] * length\n\n    # Record each update as two events in the difference array\n    for start, end, inc in updates:\n        diff[start] += inc\n        if end + 1 < length:\n            diff[end + 1] -= inc\n\n    # Compute prefix sum to get the final values\n    for i in range(1, length):\n        diff[i] += diff[i - 1]\n\n    return diff",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        6
      ],
      "apply_end": [
        7,
        8
      ],
      "prefix_sum": [
        11,
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_end": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] getModifiedArray(int length, int[][] updates) {\n    int[] diff = new int[length];\n\n    // Record each update as two events in the difference array\n    for (int[] update : updates) {\n        int start = update[0];\n        int end = update[1];\n        int inc = update[2];\n\n        diff[start] += inc;\n        if (end + 1 < length) {\n            diff[end + 1] -= inc;\n        }\n    }\n\n    // Compute prefix sum to get the final values\n    for (int i = 1; i < length; i++) {\n        diff[i] += diff[i - 1];\n    }\n\n    return diff;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        10
      ],
      "apply_end": [
        11,
        12
      ],
      "prefix_sum": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_end": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> getModifiedArray(int length, vector<vector<int>>& updates) {\n    vector<int> diff(length, 0);\n\n    // Record each update as two events in the difference array\n    for (auto& update : updates) {\n        int start = update[0];\n        int end = update[1];\n        int inc = update[2];\n\n        diff[start] += inc;\n        if (end + 1 < length) {\n            diff[end + 1] -= inc;\n        }\n    }\n\n    // Compute prefix sum to get the final values\n    for (int i = 1; i < length; i++) {\n        diff[i] += diff[i - 1];\n    }\n\n    return diff;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        10
      ],
      "apply_end": [
        11,
        12
      ],
      "prefix_sum": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_end": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] GetModifiedArray(int length, int[][] updates) {\n    int[] diff = new int[length];\n\n    // Record each update as two events in the difference array\n    foreach (int[] update in updates) {\n        int start = update[0];\n        int end = update[1];\n        int inc = update[2];\n\n        diff[start] += inc;\n        if (end + 1 < length) {\n            diff[end + 1] -= inc;\n        }\n    }\n\n    // Compute prefix sum to get the final values\n    for (int i = 1; i < length; i++) {\n        diff[i] += diff[i - 1];\n    }\n\n    return diff;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        10
      ],
      "apply_end": [
        11,
        12
      ],
      "prefix_sum": [
        17,
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "check_end": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getModifiedArray(length int, updates [][]int) []int {\n    diff := make([]int, length)\n\n    // Record each update as two events in the difference array\n    for _, update := range updates {\n        start, end, inc := update[0], update[1], update[2]\n\n        diff[start] += inc\n        if end+1 < length {\n            diff[end+1] -= inc\n        }\n    }\n\n    // Compute prefix sum to get the final values\n    for i := 1; i < length; i++ {\n        diff[i] += diff[i-1]\n    }\n\n    return diff\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        8
      ],
      "apply_end": [
        9,
        10
      ],
      "prefix_sum": [
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_end": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function getModifiedArray(length, updates) {\n  const diff = new Array(length).fill(0);\n\n  // Record each update as two events in the difference array\n  for (const [start, end, inc] of updates) {\n    diff[start] += inc;\n    if (end + 1 < length) {\n      diff[end + 1] -= inc;\n    }\n  }\n\n  // Compute prefix sum to get the final values\n  for (let i = 1; i < length; i++) {\n    diff[i] += diff[i - 1];\n  }\n\n  return diff;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        6
      ],
      "apply_end": [
        7,
        8
      ],
      "prefix_sum": [
        13,
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_end": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getModifiedArray(length: number, updates: number[][]): number[] {\n    const diff: number[] = new Array(length).fill(0);\n\n    // Record each update as two events in the difference array\n    for (const [start, end, inc] of updates) {\n        diff[start] += inc;\n        if (end + 1 < length) {\n            diff[end + 1] -= inc;\n        }\n    }\n\n    // Compute prefix sum to get the final values\n    for (let i = 1; i < length; i++) {\n        diff[i] += diff[i - 1];\n    }\n\n    return diff;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "apply_start": [
        6
      ],
      "apply_end": [
        7,
        8
      ],
      "prefix_sum": [
        13,
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "check_end": [
        7
      ]
    }
  }
};

const RangeAdditionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "length": 5,
      "updates": [
        [
          1,
          3,
          2
        ],
        [
          2,
          4,
          3
        ],
        [
          0,
          2,
          -2
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Overlapping",
    "value": {
      "length": 6,
      "updates": [
        [
          1,
          3,
          1
        ],
        [
          2,
          5,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Cascade",
    "value": {
      "length": 4,
      "updates": [
        [
          0,
          1,
          5
        ],
        [
          1,
          2,
          3
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

function generateRangeAdditionSteps(e: any): any[] {
  let t=e.length,i=e.updates.map(e=>[...e]),n=Array(t).fill(0),r={};for(let e=0;e<t;e++)r[`res_${e}`]={type:"arrayElement",value:0,position:e};let l=new StepRecorder({phase:"start",updates:i,length:t,u:-1,j:-1,start:-1,end:-1,inc:0,oldVal:0,newVal:0,result:[]},r);l.record("-",`Start: arr of ${t} zeros, ${i.length} range ${1===i.length?"update":"updates"} to apply`),l.record("initialize","Initialize result to all zeros");for(let e=0;e<i.length;e++){let[t,a,r]=i[e];for(let i=t;i<=a;i++){let d=n[i];n[i]+=r,l.update_variable("phase","add"),l.update_variable("u",e),l.update_variable("j",i),l.update_variable("start",t),l.update_variable("end",a),l.update_variable("inc",r),l.update_variable("oldVal",d),l.update_variable("newVal",n[i]),l.update_visual("ptr_j",{type:"pointer",position:i,label:"i"}),l.update_visual(`res_${i}`,{type:"arrayElement",value:n[i],position:i}),l.record("add",`Update ${e+1} [${t}, ${a}, ${r>0?"+":""}${r}]: arr[${i}] ${r>=0?"+":"-"}= ${Math.abs(r)} = ${n[i]}`)}}return l.update_variable("phase","done"),l.update_variable("result",[...n]),l.delete_visual("ptr_j"),l.record("complete",`Done: result = [${n.join(", ")}]`),l.getSteps()
}

export function RangeAdditionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeAdditionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeAdditionSteps(e) as any[];
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
      title="Range Addition"
      slug="range-addition"
      approaches={approaches}
      presets={RangeAdditionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Matrix Block Sum (matrix-block-sum)
// ==========================================

const MatrixBlockSumTemplates = {
  "python": {
    "language": "python",
    "code": "def matrixBlockSum(mat, k):\n    m, n = len(mat), len(mat[0])\n\n    # Build prefix sum matrix with an extra row and column of zeros\n    prefix = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m):\n        for j in range(n):\n            prefix[i + 1][j + 1] = (mat[i][j] + prefix[i][j + 1]\n                                     + prefix[i + 1][j] - prefix[i][j])\n\n    # Compute block sum for each cell using inclusion-exclusion\n    answer = [[0] * n for _ in range(m)]\n    for i in range(m):\n        for j in range(n):\n            r1 = max(0, i - k)\n            r2 = min(m - 1, i + k)\n            c1 = max(0, j - k)\n            c2 = min(n - 1, j + k)\n            answer[i][j] = (prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                            - prefix[r2 + 1][c1] + prefix[r1][c1])\n\n    return answer",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "compute_block": [
        15,
        16,
        17,
        18,
        19,
        20
      ],
      "complete": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] matrixBlockSum(int[][] mat, int k) {\n    int m = mat.length, n = mat[0].length;\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    int[][] prefix = new int[m + 1][n + 1];\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1]\n                                    + prefix[i + 1][j] - prefix[i][j];\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    int[][] answer = new int[m][n];\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            int r1 = Math.max(0, i - k);\n            int r2 = Math.min(m - 1, i + k);\n            int c1 = Math.max(0, j - k);\n            int c2 = Math.min(n - 1, j + k);\n            answer[i][j] = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                           - prefix[r2 + 1][c1] + prefix[r1][c1];\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "compute_block": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> matrixBlockSum(vector<vector<int>>& mat, int k) {\n    int m = mat.size(), n = mat[0].size();\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    vector<vector<int>> prefix(m + 1, vector<int>(n + 1, 0));\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1]\n                                    + prefix[i + 1][j] - prefix[i][j];\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    vector<vector<int>> answer(m, vector<int>(n, 0));\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            int r1 = max(0, i - k);\n            int r2 = min(m - 1, i + k);\n            int c1 = max(0, j - k);\n            int c2 = min(n - 1, j + k);\n            answer[i][j] = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                           - prefix[r2 + 1][c1] + prefix[r1][c1];\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "compute_block": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] MatrixBlockSum(int[][] mat, int k) {\n    int m = mat.Length, n = mat[0].Length;\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    int[][] prefix = new int[m + 1][];\n    for (int i = 0; i <= m; i++) {\n        prefix[i] = new int[n + 1];\n    }\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1]\n                                    + prefix[i + 1][j] - prefix[i][j];\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    int[][] answer = new int[m][];\n    for (int i = 0; i < m; i++) {\n        answer[i] = new int[n];\n        for (int j = 0; j < n; j++) {\n            int r1 = Math.Max(0, i - k);\n            int r2 = Math.Min(m - 1, i + k);\n            int c1 = Math.Max(0, j - k);\n            int c2 = Math.Min(n - 1, j + k);\n            answer[i][j] = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                           - prefix[r2 + 1][c1] + prefix[r1][c1];\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        11,
        12
      ],
      "compute_block": [
        21,
        22,
        23,
        24,
        25,
        26
      ],
      "complete": [
        30
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func matrixBlockSum(mat [][]int, k int) [][]int {\n    m, n := len(mat), len(mat[0])\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    prefix := make([][]int, m+1)\n    for i := range prefix {\n        prefix[i] = make([]int, n+1)\n    }\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            prefix[i+1][j+1] = mat[i][j] + prefix[i][j+1] +\n                                prefix[i+1][j] - prefix[i][j]\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    answer := make([][]int, m)\n    for i := 0; i < m; i++ {\n        answer[i] = make([]int, n)\n        for j := 0; j < n; j++ {\n            r1 := max(0, i-k)\n            r2 := min(m-1, i+k)\n            c1 := max(0, j-k)\n            c2 := min(n-1, j+k)\n            answer[i][j] = prefix[r2+1][c2+1] - prefix[r1][c2+1] -\n                           prefix[r2+1][c1] + prefix[r1][c1]\n        }\n    }\n\n    return answer\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        11,
        12
      ],
      "compute_block": [
        21,
        22,
        23,
        24,
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
    "code": "function matrixBlockSum(mat, k) {\n    var m = mat.length, n = mat[0].length;\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    var prefix = Array.from({length: m + 1}, function() { return new Array(n + 1).fill(0); });\n    for (var i = 0; i < m; i++) {\n        for (var j = 0; j < n; j++) {\n            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1]\n                                    + prefix[i + 1][j] - prefix[i][j];\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    var answer = Array.from({length: m}, function() { return new Array(n).fill(0); });\n    for (var i = 0; i < m; i++) {\n        for (var j = 0; j < n; j++) {\n            var r1 = Math.max(0, i - k);\n            var r2 = Math.min(m - 1, i + k);\n            var c1 = Math.max(0, j - k);\n            var c2 = Math.min(n - 1, j + k);\n            answer[i][j] = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                           - prefix[r2 + 1][c1] + prefix[r1][c1];\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "compute_block": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function matrixBlockSum(mat: number[][], k: number): number[][] {\n    const m = mat.length, n = mat[0].length;\n\n    // Build prefix sum matrix with an extra row and column of zeros\n    const prefix: number[][] = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            prefix[i + 1][j + 1] = mat[i][j] + prefix[i][j + 1]\n                                    + prefix[i + 1][j] - prefix[i][j];\n        }\n    }\n\n    // Compute block sum for each cell using inclusion-exclusion\n    const answer: number[][] = Array.from({length: m}, () => new Array(n).fill(0));\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            const r1 = Math.max(0, i - k);\n            const r2 = Math.min(m - 1, i + k);\n            const c1 = Math.max(0, j - k);\n            const c2 = Math.min(n - 1, j + k);\n            answer[i][j] = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1]\n                           - prefix[r2 + 1][c1] + prefix[r1][c1];\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "compute_block": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    }
  }
};

const MatrixBlockSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3x3, k=1",
    "value": {
      "mat": [
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
      ],
      "k": 1
    }
  },
  {
    "id": "ex2",
    "label": "3x3, k=2",
    "value": {
      "mat": [
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
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "3x4, k=1",
    "value": {
      "mat": [
        [
          1,
          2,
          3,
          4
        ],
        [
          5,
          6,
          7,
          8
        ],
        [
          9,
          10,
          11,
          12
        ]
      ],
      "k": 1
    }
  },
  {
    "id": "ex4",
    "label": "2x2, k=1",
    "value": {
      "mat": [
        [
          1,
          1
        ],
        [
          1,
          1
        ]
      ],
      "k": 1
    }
  }
];

function generateMatrixBlockSumSteps(e: any): any[] {
  let t=e.mat.map(e=>[...e]),i=e.k,n=t.length,a=t[0].length,l=Array.from({length:n},()=>Array(a).fill(0)),o={};for(let e=0;e<n;e++)for(let i=0;i<a;i++)o[`mat_${e}_${i}`]={type:"matrixElement",value:t[e][i],row:e,col:i},o[`ans_${e}_${i}`]={type:"matrixElement",value:"",row:e,col:i};let s=new StepRecorder({phase:"start",k:i,i:-1,j:-1,r1:0,c1:0,r2:0,c2:0,ansVal:0},o);s.record("-",`Start: for each cell, add up its clamped k = ${i} block one cell at a time`);for(let e=0;e<n;e++)for(let r=0;r<a;r++){let o=Math.max(0,e-i),c=Math.min(n-1,e+i),m=Math.max(0,r-i),u=Math.min(a-1,r+i),f=0;for(let e=o;e<=c;e++)for(let i=m;i<=u;i++)f+=t[e][i];l[e][r]=f,s.update_variable("phase","block"),s.update_variable("i",e),s.update_variable("j",r),s.update_variable("r1",o),s.update_variable("c1",m),s.update_variable("r2",c),s.update_variable("c2",u),s.update_variable("ansVal",f),s.update_visual(`ans_${e}_${r}`,{type:"matrixElement",value:f,row:e,col:r}),s.record("compute_block",`answer[${e}][${r}] = sum of mat[${o}..${c}][${m}..${u}] = ${f}`)}return s.update_variable("phase","done"),s.record("complete","Done: every cell holds the sum of its k-block"),s.getSteps()
}

export function MatrixBlockSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MatrixBlockSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMatrixBlockSumSteps(e) as any[];
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
      title="Matrix Block Sum"
      slug="matrix-block-sum"
      approaches={approaches}
      presets={MatrixBlockSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
