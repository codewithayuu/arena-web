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
    if (
      item.type === "arrayElement" ||
      item.type === "element" ||
      item.type === "char" ||
      item.type === "stateElement" ||
      item.type === "node" ||
      item.type === "cell" ||
      item.type === "stackElement" ||
      item.type === "bar" ||
      item.type === "token" ||
      item.type === "heapNode" ||
      item.type === "card"
    ) {
      elements.push({
        value: item.value ?? item.char ?? item.height ?? item.val ?? "",
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
// Search Insert Position (search-insert-position)
// ==========================================

const SearchInsertPositionTemplates = {
  "python": {
    "language": "python",
    "code": "def searchInsert(nums, target):\n    left = 0\n    right = len(nums)\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n\n    return left",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int searchInsert(int[] nums, int target) {\n    int left = 0;\n    int right = nums.length;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int searchInsert(vector<int>& nums, int target) {\n    int left = 0;\n    int right = nums.size();\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SearchInsert(int[] nums, int target) {\n    int left = 0;\n    int right = nums.Length;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func searchInsert(nums []int, target int) int {\n    left := 0\n    right := len(nums)\n\n    for left < right {\n        mid := left + (right-left)/2\n\n        if nums[mid] < target {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n\n    return left\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function searchInsert(nums, target) {\n    let left = 0;\n    let right = nums.length;\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function searchInsert(nums: number[], target: number): number {\n    let left = 0;\n    let right = nums.length;\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "search_right": [
        8,
        9
      ],
      "search_left": [
        10,
        11
      ],
      "not_found_return": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "target_less_than_mid": [
        10
      ]
    }
  }
};

const SearchInsertPositionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Insert middle",
    "value": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 2
    }
  },
  {
    "id": "ex2",
    "label": "Insert end",
    "value": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 7
    }
  },
  {
    "id": "ex3",
    "label": "Insert beginning",
    "value": {
      "nums": [
        1,
        3,
        5,
        6
      ],
      "target": 0
    }
  },
  {
    "id": "ex4",
    "label": "Single element",
    "value": {
      "nums": [
        1
      ],
      "target": 1
    }
  }
];

function generateSearchInsertPositionSteps(e: any): any[] {
  

let t=[...e.nums],n=e.target,i=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=new StepRecorder({nums:t,target:n,left:void 0,right:void 0,mid:void 0,result:void 0},{...i});l.record("-",`Start: Search for insertion position of target ${n}`);let a=0,s=t.length;for(l.update_variable("left",a),l.update_variable("right",s),l.add_new_visual("ptr_left",{type:"pointer",position:a,label:"left"}),l.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),l.record("initialize",`Initialize left = 0, right = ${t.length}`);a<s;){l.add_conditional("while_loop",!0);let e=a+Math.floor((s-a)/2);if(l.update_variable("mid",e),l.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),l.record("calculate_mid",`Calculate mid = ${e}, nums[mid] = ${t[e]}`),t[e]<n){l.add_conditional("target_less_than_mid",!1),a=e+1,l.update_variable("left",a),l.update_visual("ptr_left",{type:"pointer",position:a,label:"left"});for(let e=0;e<t.length;e++){let n=e>=a&&e<s;l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:n?void 0:"inactive"})}l.delete_visual("ptr_mid"),l.record("search_right",`nums[mid] (${t[e]}) < target ${n}. Search right: left = ${a}`)}else{l.add_conditional("target_less_than_mid",!0),s=e,l.update_variable("right",s),l.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let n=e>=a&&e<s;l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:n?void 0:"inactive"})}l.delete_visual("ptr_mid"),l.record("search_left",`nums[mid] (${t[e]}) >= target ${n}. Keep mid as a candidate: right = ${s}`)}}l.add_conditional("while_loop",!1),l.update_variable("result",a),l.add_new_visual("ptr_insert",{type:"pointer",position:a,label:"insert"});for(let e=0;e<t.length;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:e===a?"active":void 0});let o=a<t.length&&t[a]===n;return l.record("not_found_return",o?`left = ${a} is the first index where nums[i] >= ${n}, and nums[${a}] = ${n}`:`Target not found. Insert at position ${a}`),l.getSteps()
}

export function SearchInsertPositionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchInsertPositionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSearchInsertPositionSteps(e) as any[];
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
      title="Search Insert Position"
      slug="search-insert-position"
      approaches={approaches}
      presets={SearchInsertPositionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Search in Rotated Sorted Array (search-in-rotated-sorted-array)
// ==========================================

const SearchInRotatedSortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] == target:\n            return mid\n\n        if nums[left] <= nums[mid]:\n            if target >= nums[left] and target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if target > nums[mid] and target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        11
      ],
      "search_left": [
        13
      ],
      "search_right_from_left": [
        15
      ],
      "right_half_sorted": [
        16
      ],
      "search_right": [
        18
      ],
      "search_left_from_right": [
        20
      ],
      "not_found": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        11
      ],
      "search_right": [
        14
      ],
      "should_search_right": [
        16
      ],
      "target_in_left": [
        12
      ],
      "target_in_right": [
        17
      ],
      "move_right": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int search(int[] nums, int target) {\n    int left = 0;\n    int right = nums.length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int search(vector<int>& nums, int target) {\n    int left = 0;\n    int right = nums.size() - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Search(int[] nums, int target) {\n    int left = 0;\n    int right = nums.Length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func search(nums []int, target int) int {\n    left := 0\n    right := len(nums) - 1\n\n    for left <= right {\n        mid := left + (right - left) / 2\n\n        if nums[mid] == target {\n            return mid\n        }\n\n        if nums[left] <= nums[mid] {\n            if nums[left] <= target && target < nums[mid] {\n                right = mid - 1\n            } else {\n                left = mid + 1\n            }\n        } else {\n            if nums[mid] < target && target <= nums[right] {\n                left = mid + 1\n            } else {\n                right = mid - 1\n            }\n        }\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] === target) {\n            return mid;\n        }\n\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function search(nums: number[], target: number): number {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] === target) {\n            return mid;\n        }\n\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (nums[mid] < target && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "left_half_sorted": [
        12
      ],
      "search_left": [
        14
      ],
      "search_right_from_left": [
        16
      ],
      "right_half_sorted": [
        18
      ],
      "search_right": [
        20
      ],
      "search_left_from_right": [
        22
      ],
      "not_found": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "left_sorted": [
        12
      ],
      "search_right": [
        15
      ],
      "should_search_right": [
        18
      ],
      "target_in_left": [
        13
      ],
      "target_in_right": [
        19
      ],
      "move_right": [
        21
      ]
    }
  }
};

const SearchInRotatedSortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        4,
        5,
        6,
        7,
        0,
        1,
        2
      ],
      "target": 0
    }
  },
  {
    "id": "ex2",
    "label": "Not found",
    "value": {
      "nums": [
        4,
        5,
        6,
        7,
        0,
        1,
        2
      ],
      "target": 3
    }
  },
  {
    "id": "ex3",
    "label": "No rotation",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "target": 3
    }
  },
  {
    "id": "ex4",
    "label": "Single element",
    "value": {
      "nums": [
        1
      ],
      "target": 1
    }
  },
  {
    "id": "ex5",
    "label": "Target at end",
    "value": {
      "nums": [
        5,
        1,
        2,
        3,
        4
      ],
      "target": 4
    }
  }
];

function generateSearchInRotatedSortedArraySteps(t: any): any[] {
  

let e=[...t.nums],i=t.target,a=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),n=new StepRecorder({nums:e,target:i,left:void 0,right:void 0,mid:void 0},{...a});n.record("-",`Start: Search for target ${i} in rotated sorted array`);let l=0,s=e.length-1;n.update_variable("left",l),n.update_variable("right",s),n.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),n.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let t=l;t<=s;t++)n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t});for(n.record("initialize",`Initialize left = 0, right = ${e.length-1}`);l<=s;){n.add_conditional("while_loop",!0);let t=Math.floor((l+s)/2);if(n.update_variable("mid",t),n.add_new_visual("ptr_mid",{type:"pointer",position:t,label:"mid"}),n.record("calculate_mid",`Calculate mid = ${t}, nums[mid] = ${e[t]}`),e[t]===i)return n.add_conditional("found_target",!0),n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"active"}),n.delete_visual("ptr_right"),n.delete_visual("ptr_left"),n.record("found",`Found target ${i} at index ${t}`),n.getSteps();if(n.add_conditional("found_target",!1),e[l]<=e[t])if(n.add_conditional("left_sorted",!0),n.record("left_half_sorted",`Left half is sorted: nums[${l}] (${e[l]}) <= nums[${t}] (${e[t]})`),e[l]<=i&&i<e[t]){n.add_conditional("target_in_left",!0),s=t-1,n.update_variable("right",s),n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let t=0;t<e.length;t++){let i=t>=l&&t<=s;n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}n.record("search_left",`Target in left half range. Search left: right = ${s}`)}else{n.add_conditional("target_in_left",!1),n.add_conditional("search_right",!0),l=t+1,n.update_variable("left",l),n.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let t=0;t<e.length;t++){let i=t>=l&&t<=s;n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}n.record("search_right_from_left",`Target not in left half. Search right: left = ${l}`)}else if(n.add_conditional("left_sorted",!1),n.add_conditional("should_search_right",!0),n.record("right_half_sorted",`Right half is sorted: nums[${l}] (${e[l]}) > nums[${t}] (${e[t]})`),e[t]<i&&i<=e[s]){n.add_conditional("target_in_right",!0),l=t+1,n.update_variable("left",l),n.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let t=0;t<e.length;t++){let i=t>=l&&t<=s;n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}n.record("search_right",`Target in right half range. Search right: left = ${l}`)}else{n.add_conditional("move_right",!0),n.add_conditional("target_in_right",!1),s=t-1,n.update_variable("right",s),n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let t=0;t<e.length;t++){let i=t>=l&&t<=s;n.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}n.record("search_left_from_right",`Target not in right half. Search left: right = ${s}`)}}return n.delete_visual("ptr_mid"),n.delete_visual("ptr_right"),n.delete_visual("ptr_left"),n.add_conditional("while_loop",!1),n.record("not_found",`Target ${i} not found in array. Return -1`),n.getSteps()
}

export function SearchInRotatedSortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchInRotatedSortedArrayTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSearchInRotatedSortedArraySteps(t) as any[];
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
      title="Search in Rotated Sorted Array"
      slug="search-in-rotated-sorted-array"
      approaches={approaches}
      presets={SearchInRotatedSortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Peak Element (find-peak-element)
// ==========================================

const FindPeakElementTemplates = {
  "python": {
    "language": "python",
    "code": "def findPeakElement(nums):\n    left = 0\n    right = len(nums) - 1\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] < nums[mid + 1]:\n            left = mid + 1\n        else:\n            right = mid\n\n    return left",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findPeakElement(int[] nums) {\n    int left = 0;\n    int right = nums.length - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < nums[mid + 1]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findPeakElement(vector<int>& nums) {\n    int left = 0;\n    int right = nums.size() - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < nums[mid + 1]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindPeakElement(int[] nums) {\n    int left = 0;\n    int right = nums.Length - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] < nums[mid + 1]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findPeakElement(nums []int) int {\n    left := 0\n    right := len(nums) - 1\n\n    for left < right {\n        mid := left + (right - left) / 2\n\n        if nums[mid] < nums[mid + 1] {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n\n    return left\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findPeakElement(nums) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] < nums[mid + 1]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findPeakElement(nums: number[]): number {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] < nums[mid + 1]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_next": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_peak": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "compare_neighbors": [
        8
      ]
    }
  }
};

const FindPeakElementPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        2,
        3,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        2,
        1,
        3,
        5,
        6,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Ascending",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Descending",
    "value": {
      "nums": [
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
    "label": "Single element",
    "value": {
      "nums": [
        1
      ]
    }
  }
];

function generateFindPeakElementSteps(e: any): any[] {
  

let t=[...e.nums],n=t.reduce((e,t,n)=>(e[`elem_${n}`]={type:"arrayElement",value:t,position:n},e),{}),r=new StepRecorder({nums:t,left:void 0,right:void 0,mid:void 0,result:void 0},{...n});r.record("-","Start: Find a peak element in the array");let l=0,a=t.length-1;for(r.update_variable("left",l),r.update_variable("right",a),r.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),r.add_new_visual("ptr_right",{type:"pointer",position:a,label:"right"}),r.record("initialize",`Initialize left = 0, right = ${t.length-1}`);l<a;){r.add_conditional("while_loop",!0);let e=Math.floor((l+a)/2);if(r.update_variable("mid",e),r.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),r.record("calculate_mid",`Calculate mid = ${e}, nums[mid] = ${t[e]}`),t[e]<t[e+1]){r.add_conditional("compare_neighbors",!0),r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"}),r.update_visual(`elem_${e+1}`,{type:"arrayElement",value:t[e+1],position:e+1,state:"active"}),r.record("compare_mid_next",`nums[mid] (${t[e]}) < nums[mid+1] (${t[e+1]}). Peak is on the right`),l=e+1,r.update_variable("left",l),r.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let e=0;e<t.length;e++){let n=e>=l&&e<=a;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:n?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_right",`Move to right half: left = ${l}`)}else{r.add_conditional("compare_neighbors",!1),r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),r.update_visual(`elem_${e+1}`,{type:"arrayElement",value:t[e+1],position:e+1,state:"inactive"}),r.record("compare_mid_next",`nums[mid] (${t[e]}) >= nums[mid+1] (${t[e+1]}). Peak is on the left or at mid`),a=e,r.update_variable("right",a),r.update_visual("ptr_right",{type:"pointer",position:a,label:"right"});for(let e=0;e<t.length;e++){let n=e>=l&&e<=a;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:n?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_left",`Move to left half: right = ${a}`)}}r.add_conditional("while_loop",!1),r.update_variable("result",l),r.update_visual(`elem_${l}`,{type:"arrayElement",value:t[l],position:l,state:"active"}),r.delete_visual("ptr_right"),r.delete_visual("ptr_left");for(let e=0;e<t.length;e++)e!==l&&r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});return r.record("found_peak",`Found peak element ${t[l]} at index ${l}`),r.getSteps()
}

export function FindPeakElementProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindPeakElementTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindPeakElementSteps(e) as any[];
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
      title="Find Peak Element"
      slug="find-peak-element"
      approaches={approaches}
      presets={FindPeakElementPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Minimum in Rotated Sorted Array (find-minimum-in-rotated-sorted-array)
// ==========================================

const FindMinimumInRotatedSortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findMin(nums):\n    left = 0\n    right = len(nums) - 1\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        else:\n            right = mid\n\n    return nums[left]",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findMin(int[] nums) {\n    int left = 0;\n    int right = nums.length - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] > nums[right]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return nums[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findMin(vector<int>& nums) {\n    int left = 0;\n    int right = nums.size() - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] > nums[right]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return nums[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindMin(int[] nums) {\n    int left = 0;\n    int right = nums.Length - 1;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] > nums[right]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return nums[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMin(nums []int) int {\n    left := 0\n    right := len(nums) - 1\n\n    for left < right {\n        mid := left + (right - left) / 2\n\n        if nums[mid] > nums[right] {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n\n    return nums[left]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findMin(nums) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] > nums[right]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return nums[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMin(nums: number[]): number {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] > nums[right]) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return nums[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "compare_mid_right": [
        8
      ],
      "search_right": [
        9
      ],
      "search_left": [
        11
      ],
      "found_minimum": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "mid_greater_than_right": [
        8
      ]
    }
  }
};

const FindMinimumInRotatedSortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
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
    "label": "Example 2",
    "value": {
      "nums": [
        4,
        5,
        6,
        7,
        0,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No rotation",
    "value": {
      "nums": [
        11,
        13,
        15,
        17
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Two elements",
    "value": {
      "nums": [
        2,
        1
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single element",
    "value": {
      "nums": [
        1
      ]
    }
  }
];

function generateFindMinimumInRotatedSortedArraySteps(e: any): any[] {
  

let t=[...e.nums],i=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({nums:t,left:void 0,right:void 0,mid:void 0,result:void 0},{...i});r.record("-","Start: Find minimum element in rotated sorted array");let l=0,a=t.length-1;for(r.update_variable("left",l),r.update_variable("right",a),r.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),r.add_new_visual("ptr_right",{type:"pointer",position:a,label:"right"}),r.record("initialize",`Initialize left = 0, right = ${t.length-1}`);l<a;){r.add_conditional("while_loop",!0);let e=Math.floor((l+a)/2);if(r.update_variable("mid",e),r.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),r.record("calculate_mid",`Calculate mid = ${e}, nums[mid] = ${t[e]}`),t[e]>t[a]){r.add_conditional("mid_greater_than_right",!0),r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"}),r.update_visual(`elem_${a}`,{type:"arrayElement",value:t[a],position:a,state:"active"}),r.record("compare_mid_right",`nums[mid] (${t[e]}) > nums[right] (${t[a]}). Minimum is in right half`),l=e+1,r.update_variable("left",l),r.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=a;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_right",`Search right half: left = ${l}`)}else{r.add_conditional("mid_greater_than_right",!1),r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),r.update_visual(`elem_${a}`,{type:"arrayElement",value:t[a],position:a,state:"inactive"}),r.record("compare_mid_right",`nums[mid] (${t[e]}) <= nums[right] (${t[a]}). Minimum is in left half or at mid`),a=e,r.update_variable("right",a),r.update_visual("ptr_right",{type:"pointer",position:a,label:"right"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=a;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_left",`Search left half including mid: right = ${a}`)}}r.add_conditional("while_loop",!1),r.update_variable("result",t[l]),r.update_visual(`elem_${l}`,{type:"arrayElement",value:t[l],position:l,state:"active"}),r.delete_visual("ptr_right"),r.delete_visual("ptr_left");for(let e=0;e<t.length;e++)e!==l&&r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});return r.record("found_minimum",`Found minimum element ${t[l]} at index ${l}`),r.getSteps()
}

export function FindMinimumInRotatedSortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindMinimumInRotatedSortedArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindMinimumInRotatedSortedArraySteps(e) as any[];
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
      title="Find Minimum in Rotated Sorted Array"
      slug="find-minimum-in-rotated-sorted-array"
      approaches={approaches}
      presets={FindMinimumInRotatedSortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Search in 2D Matrix (search-a-2d-matrix)
// ==========================================

const SearchA2dMatrixTemplates = {
  "python": {
    "language": "python",
    "code": "def searchMatrix(matrix, target):\n    m, n = len(matrix), len(matrix[0])\n    left, right = 0, m * n\n\n    while left < right:\n        mid = left + (right - left) // 2\n        row = mid // n\n        col = mid % n\n\n        if matrix[row][col] == target:\n            return True\n        elif matrix[row][col] < target:\n            left = mid + 1\n        else:\n            right = mid\n\n    return False",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "loop_start": [
        5
      ],
      "calculate_mid": [
        6,
        7,
        8
      ],
      "found": [
        11
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        10
      ],
      "search_left": [
        14
      ],
      "less_than_target": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean searchMatrix(int[][] matrix, int target) {\n    int m = matrix.length;\n    int n = matrix[0].length;\n    int left = 0;\n    int right = m * n;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int row = mid / n;\n        int col = mid % n;\n\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    int m = matrix.size();\n    int n = matrix[0].size();\n    int left = 0;\n    int right = m * n;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int row = mid / n;\n        int col = mid % n;\n\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool SearchMatrix(int[][] matrix, int target) {\n    int m = matrix.Length;\n    int n = matrix[0].Length;\n    int left = 0;\n    int right = m * n;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int row = mid / n;\n        int col = mid % n;\n\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func searchMatrix(matrix [][]int, target int) bool {\n    m := len(matrix)\n    n := len(matrix[0])\n    left := 0\n    right := m*n\n\n    for left < right {\n        mid := left + (right - left) / 2\n        row := mid / n\n        col := mid % n\n\n        if matrix[row][col] == target {\n            return true\n        } else if matrix[row][col] < target {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n\n    return false\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function searchMatrix(matrix, target) {\n    const m = matrix.length;\n    const n = matrix[0].length;\n    let left = 0;\n    let right = m * n;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        const row = Math.floor(mid / n);\n        const col = mid % n;\n\n        if (matrix[row][col] === target) {\n            return true;\n        } else if (matrix[row][col] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function searchMatrix(matrix: number[][], target: number): boolean {\n    const m = matrix.length;\n    const n = matrix[0].length;\n    let left = 0;\n    let right = m * n;\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        const row = Math.floor(mid / n);\n        const col = mid % n;\n\n        if (matrix[row][col] === target) {\n            return true;\n        } else if (matrix[row][col] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "initialize": [
        2,
        3,
        4,
        5
      ],
      "loop_start": [
        7
      ],
      "calculate_mid": [
        8,
        9,
        10
      ],
      "found": [
        13
      ],
      "search_right": [
        14,
        15
      ],
      "search_left": [
        17
      ],
      "not_found": [
        21
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "found_target": [
        12
      ],
      "search_left": [
        16
      ],
      "less_than_target": [
        14
      ]
    }
  }
};

const SearchA2dMatrixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (found)",
    "value": {
      "matrix": [
        [
          1,
          3,
          5,
          7
        ],
        [
          10,
          11,
          16,
          20
        ],
        [
          23,
          30,
          34,
          60
        ]
      ],
      "target": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (not found)",
    "value": {
      "matrix": [
        [
          1,
          3,
          5,
          7
        ],
        [
          10,
          11,
          16,
          20
        ],
        [
          23,
          30,
          34,
          60
        ]
      ],
      "target": 13
    }
  },
  {
    "id": "ex3",
    "label": "Larger matrix",
    "value": {
      "matrix": [
        [
          1,
          3,
          5,
          7,
          9
        ],
        [
          10,
          12,
          14,
          16,
          18
        ],
        [
          20,
          22,
          24,
          26,
          28
        ],
        [
          30,
          32,
          34,
          36,
          38
        ]
      ],
      "target": 26
    }
  },
  {
    "id": "ex4",
    "label": "Single element (found)",
    "value": {
      "matrix": [
        [
          1
        ]
      ],
      "target": 1
    }
  },
  {
    "id": "ex5",
    "label": "Single element (not found)",
    "value": {
      "matrix": [
        [
          1
        ]
      ],
      "target": 2
    }
  }
];

function generateSearchA2dMatrixSteps(t: any): any[] {
  

let e=t.matrix,r=t.target;if(!e||0===e.length||0===e[0].length)return[];let i=e.length,n=e[0].length,l={};for(let t=0;t<i;t++)for(let r=0;r<n;r++)l[`cell_${t}_${r}`]={type:"matrixElement",value:e[t][r],row:t,col:r,state:"default"};let o=new StepRecorder({matrix:e,target:r,m:void 0,n:void 0,left:void 0,right:void 0,mid:void 0,row:void 0,col:void 0},{...l});o.record("start","Start: Binary search on 2D matrix");let s=0,d=i*n;o.update_variable("left",s),o.update_variable("right",d),o.update_variable("m",i),o.update_variable("n",n),o.add_new_visual("ptr_left",{type:"pointer",position:s,label:"left"}),o.add_new_visual("ptr_right",{type:"pointer",position:d,label:"right"}),o.record("initialize","Initialize left=0, right=m*n");let c=new Set;for(;s<d;){o.add_conditional("while_loop",!0);let t=s+Math.floor((d-s)/2),a=Math.floor(t/n),i=t%n;o.update_variable("mid",t),o.update_variable("row",a),o.update_variable("col",i),o.update_visual("ptr_mid",{type:"pointer",position:t,label:"mid"}),o.record("calculate_mid",`Calculate mid=${t}, convert to position [${a}][${i}]`);let l=e[a][i];if(l===r)return o.add_conditional("found_target",!0),o.update_visual(`cell_${a}_${i}`,{type:"matrixElement",value:e[a][i],row:a,col:i,state:"found"}),o.delete_visual("ptr_mid"),o.delete_visual("ptr_right"),o.delete_visual("ptr_left"),o.record("found",`Found target ${r} at position [${a}][${i}]`),o.getSteps();if(o.add_conditional("found_target",!1),l<r){o.add_conditional("less_than_target",!0);for(let r=s;r<=t;r++){let t=Math.floor(r/n),a=r%n,i=`cell_${t}_${a}`;c.add(i),o.update_visual(i,{type:"matrixElement",value:e[t][a],row:t,col:a,state:"eliminated"})}s=t+1,o.update_variable("left",s),o.update_visual("ptr_left",{type:"pointer",position:s,label:"left"}),o.record("search_right",`Value ${l} < ${r}, search right half (left=${s})`)}else{o.add_conditional("less_than_target",!1);for(let r=t;r<d;r++){let t=Math.floor(r/n),a=r%n,i=`cell_${t}_${a}`;c.add(i),o.update_visual(i,{type:"matrixElement",value:e[t][a],row:t,col:a,state:"eliminated"})}d=t,o.update_variable("right",d),o.update_visual("ptr_right",{type:"pointer",position:d,label:"right"}),o.add_conditional("search_left",!0),o.record("search_left",`Value ${l} > ${r}, search left half (right=${d})`)}}return o.add_conditional("while_loop",!1),o.delete_visual("ptr_mid"),o.record("not_found",`Target ${r} not found in matrix`),o.getSteps()
}

export function SearchA2dMatrixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchA2dMatrixTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSearchA2dMatrixSteps(t) as any[];
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
      title="Search in 2D Matrix"
      slug="search-a-2d-matrix"
      approaches={approaches}
      presets={SearchA2dMatrixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Binary Search (binary-search)
// ==========================================

const BinarySearchTemplates = {
  "python": {
    "language": "python",
    "code": "def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] == target:\n            return mid\n\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        11,
        12
      ],
      "search_left": [
        14
      ],
      "not_found": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int search(int[] nums, int target) {\n    int left = 0;\n    int right = nums.length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int search(vector<int>& nums, int target) {\n    int left = 0;\n    int right = nums.size() - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int Search(int[] nums, int target) {\n    int left = 0;\n    int right = nums.Length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return mid;\n        }\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func search(nums []int, target int) int {\n    left := 0\n    right := len(nums) - 1\n\n    for left <= right {\n        mid := left + (right - left) / 2\n\n        if nums[mid] == target {\n            return mid\n        }\n\n        if nums[mid] < target {\n            left = mid + 1\n        } else {\n            right = mid - 1\n        }\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (nums[mid] === target) {\n            return mid;\n        }\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function search(nums: number[], target: number): number {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (nums[mid] === target) {\n            return mid;\n        }\n\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "search_right": [
        12,
        13
      ],
      "search_left": [
        15
      ],
      "not_found": [
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "target_less_than_mid": [
        14
      ]
    }
  }
};

const BinarySearchPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Target found",
    "value": {
      "nums": [
        -1,
        0,
        3,
        5,
        9,
        12
      ],
      "target": 9
    }
  },
  {
    "id": "ex2",
    "label": "Target not found",
    "value": {
      "nums": [
        -1,
        0,
        3,
        5,
        9,
        12
      ],
      "target": 2
    }
  },
  {
    "id": "ex3",
    "label": "Single element found",
    "value": {
      "nums": [
        5
      ],
      "target": 5
    }
  },
  {
    "id": "ex4",
    "label": "First element",
    "value": {
      "nums": [
        1,
        3,
        5,
        7,
        9
      ],
      "target": 1
    }
  }
];

function generateBinarySearchSteps(e: any): any[] {
  

let t=[...e.nums],i=e.target,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({nums:t,target:i,left:void 0,right:void 0,mid:void 0,result:void 0},{...a});r.record("-",`Start: Search for target ${i} in the array`);let l=0,s=t.length-1;for(r.update_variable("left",l),r.update_variable("right",s),r.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),r.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),r.record("initialize",`Initialize left = 0, right = ${t.length-1}`);l<=s;){r.add_conditional("while_loop",!0);let e=l+Math.floor((s-l)/2);if(r.update_variable("mid",e),r.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),r.record("calculate_mid",`Calculate mid = ${e}, nums[mid] = ${t[e]}`),t[e]===i)return r.add_conditional("found_target",!0),r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),r.update_variable("result",e),r.delete_visual("ptr_mid"),r.delete_visual("ptr_right"),r.delete_visual("ptr_left"),r.record("found",`Found target ${i} at index ${e}`),r.getSteps();if(r.add_conditional("found_target",!1),t[e]<i){r.add_conditional("target_less_than_mid",!1),l=e+1,r.update_variable("left",l),r.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_right",`Target ${i} > nums[mid] (${t[e]}). Search right: left = ${l}`)}else{r.add_conditional("target_less_than_mid",!0),s=e-1,r.update_variable("right",s),r.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}r.delete_visual("ptr_mid"),r.record("search_left",`Target ${i} < nums[mid] (${t[e]}). Search left: right = ${s}`)}}r.add_conditional("while_loop",!1),r.update_variable("result",-1);for(let e=0;e<t.length;e++)r.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:void 0});return r.record("not_found",`Target ${i} not found in the array. Return -1`),r.getSteps()
}

export function BinarySearchProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BinarySearchTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBinarySearchSteps(e) as any[];
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
      title="Binary Search"
      slug="binary-search"
      approaches={approaches}
      presets={BinarySearchPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Capacity To Ship Packages Within D Days (capacity-to-ship-packages-within-d-days)
// ==========================================

const CapacityToShipPackagesWithinDDaysTemplates = {
  "python": {
    "language": "python",
    "code": "def shipWithinDays(weights, days):\n    left = max(weights)\n    right = sum(weights)\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        days_needed = 1\n        current_load = 0\n\n        for w in weights:\n            if current_load + w > mid:\n                days_needed += 1\n                current_load = 0\n            current_load += w\n\n        if days_needed <= days:\n            right = mid\n        else:\n            left = mid + 1\n\n    return left",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "init_feasibility": [
        8,
        9
      ],
      "add_package": [
        15
      ],
      "new_day": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        17,
        18
      ],
      "feasible_no": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "for_loop": [
        11
      ],
      "exceeds_capacity": [
        12
      ],
      "feasible": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int shipWithinDays(int[] weights, int days) {\n    int left = 0, right = 0;\n    for (int w : weights) {\n        left = Math.max(left, w);\n        right += w;\n    }\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        int daysNeeded = 1;\n        int currentLoad = 0;\n\n        for (int w : weights) {\n            if (currentLoad + w > mid) {\n                daysNeeded++;\n                currentLoad = 0;\n            }\n            currentLoad += w;\n        }\n\n        if (daysNeeded <= days) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4,
        5
      ],
      "calculate_mid": [
        9
      ],
      "init_feasibility": [
        11,
        12
      ],
      "add_package": [
        19
      ],
      "new_day": [
        15,
        16,
        17
      ],
      "feasible_yes": [
        22,
        23
      ],
      "feasible_no": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "for_loop": [
        14
      ],
      "exceeds_capacity": [
        15
      ],
      "feasible": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int shipWithinDays(vector<int>& weights, int days) {\n    int left = *max_element(weights.begin(), weights.end());\n    int right = accumulate(weights.begin(), weights.end(), 0);\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        int daysNeeded = 1;\n        int currentLoad = 0;\n\n        for (int w : weights) {\n            if (currentLoad + w > mid) {\n                daysNeeded++;\n                currentLoad = 0;\n            }\n            currentLoad += w;\n        }\n\n        if (daysNeeded <= days) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "init_feasibility": [
        8,
        9
      ],
      "add_package": [
        16
      ],
      "new_day": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        19,
        20
      ],
      "feasible_no": [
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "for_loop": [
        11
      ],
      "exceeds_capacity": [
        12
      ],
      "feasible": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int ShipWithinDays(int[] weights, int days) {\n    int left = weights.Max();\n    int right = weights.Sum();\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        int daysNeeded = 1;\n        int currentLoad = 0;\n\n        foreach (int w in weights) {\n            if (currentLoad + w > mid) {\n                daysNeeded++;\n                currentLoad = 0;\n            }\n            currentLoad += w;\n        }\n\n        if (daysNeeded <= days) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "init_feasibility": [
        8,
        9
      ],
      "add_package": [
        16
      ],
      "new_day": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        19,
        20
      ],
      "feasible_no": [
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "for_loop": [
        11
      ],
      "exceeds_capacity": [
        12
      ],
      "feasible": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func shipWithinDays(weights []int, days int) int {\n    left, right := 0, 0\n    for _, w := range weights {\n        if w > left {\n            left = w\n        }\n        right += w\n    }\n\n    for left < right {\n        mid := left + (right - left) / 2\n\n        daysNeeded := 1\n        currentLoad := 0\n\n        for _, w := range weights {\n            if currentLoad + w > mid {\n                daysNeeded++\n                currentLoad = 0\n            }\n            currentLoad += w\n        }\n\n        if daysNeeded <= days {\n            right = mid\n        } else {\n            left = mid + 1\n        }\n    }\n\n    return left\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "calculate_mid": [
        11
      ],
      "init_feasibility": [
        13,
        14
      ],
      "add_package": [
        21
      ],
      "new_day": [
        17,
        18,
        19
      ],
      "feasible_yes": [
        24,
        25
      ],
      "feasible_no": [
        26,
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "for_loop": [
        16
      ],
      "exceeds_capacity": [
        17
      ],
      "feasible": [
        24
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function shipWithinDays(weights, days) {\n    let left = Math.max(...weights);\n    let right = weights.reduce((a, b) => a + b, 0);\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        let daysNeeded = 1;\n        let currentLoad = 0;\n\n        for (const w of weights) {\n            if (currentLoad + w > mid) {\n                daysNeeded++;\n                currentLoad = 0;\n            }\n            currentLoad += w;\n        }\n\n        if (daysNeeded <= days) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "init_feasibility": [
        8,
        9
      ],
      "add_package": [
        16
      ],
      "new_day": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        19,
        20
      ],
      "feasible_no": [
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "for_loop": [
        11
      ],
      "exceeds_capacity": [
        12
      ],
      "feasible": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function shipWithinDays(weights: number[], days: number): number {\n    let left = Math.max(...weights);\n    let right = weights.reduce((a, b) => a + b, 0);\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        let daysNeeded = 1;\n        let currentLoad = 0;\n\n        for (const w of weights) {\n            if (currentLoad + w > mid) {\n                daysNeeded++;\n                currentLoad = 0;\n            }\n            currentLoad += w;\n        }\n\n        if (daysNeeded <= days) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "init_feasibility": [
        8,
        9
      ],
      "add_package": [
        16
      ],
      "new_day": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        19,
        20
      ],
      "feasible_no": [
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "for_loop": [
        11
      ],
      "exceeds_capacity": [
        12
      ],
      "feasible": [
        19
      ]
    }
  }
};

const CapacityToShipPackagesWithinDDaysPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "weights": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ],
      "days": 5
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "weights": [
        3,
        2,
        2,
        4,
        1,
        4
      ],
      "days": 3
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "weights": [
        1,
        2,
        3,
        1,
        1
      ],
      "days": 4
    }
  },
  {
    "id": "ex4",
    "label": "Equal weights",
    "value": {
      "weights": [
        5,
        5,
        5,
        5,
        5
      ],
      "days": 3
    }
  },
  {
    "id": "ex5",
    "label": "Heavy first",
    "value": {
      "weights": [
        10,
        1,
        1,
        1,
        1
      ],
      "days": 2
    }
  }
];

function generateCapacityToShipPackagesWithinDDaysSteps(e: any): any[] {
  

let t=[...e.weights],a=e.days,n=t.reduce((e,t,a)=>(e[`elem_${a}`]={type:"arrayElement",value:t,position:a},e),{}),l=new StepRecorder({weights:t,days:a,left:void 0,right:void 0,mid:void 0,daysNeeded:void 0,currentLoad:void 0},{...n,meta_capacity:{type:"metadata",value:"?"},meta_days_needed:{type:"metadata",value:"?"},meta_result:{type:"metadata",value:""}});l.record("-",`Ship packages ${JSON.stringify(t)} within ${a} days`);let r=0,s=0;for(let e of t)r=Math.max(r,e),s+=e;for(l.update_variable("left",r),l.update_variable("right",s),l.update_visual("meta_capacity",{type:"metadata",value:`Range: [${r}, ${s}]`}),l.record("init_bounds",`Initialize left = max(weights) = ${r}, right = sum(weights) = ${s}`);r<s;){l.add_conditional("while_loop",!0);let e=r+Math.floor((s-r)/2);l.update_variable("mid",e),l.update_visual("meta_capacity",{type:"metadata",value:`Testing capacity: ${e}`}),l.record("calculate_mid",`Calculate mid = ${e}`);let i=1,n=0;l.update_variable("daysNeeded",i),l.update_variable("currentLoad",n),l.update_visual("meta_days_needed",{type:"metadata",value:`Days: ${i}/${a}`});for(let e=0;e<t.length;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});l.record("init_feasibility","Start feasibility check: daysNeeded = 1, currentLoad = 0");let d=0;for(let r=0;r<t.length;r++){if(l.add_conditional("for_loop",!0),l.update_visual(`elem_${r}`,{type:"arrayElement",value:t[r],position:r,state:"highlight"}),n+t[r]>e){l.add_conditional("exceeds_capacity",!0);for(let e=d;e<r;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});i++,n=0,d=r,l.update_variable("daysNeeded",i),l.update_variable("currentLoad",n),l.update_visual("meta_days_needed",{type:"metadata",value:`Days: ${i}/${a}`}),l.record("new_day",`Load ${n} + ${t[r]} > ${e}. Start new day ${i}`)}else l.add_conditional("exceeds_capacity",!1);n+=t[r],l.update_variable("currentLoad",n),l.update_visual(`elem_${r}`,{type:"arrayElement",value:t[r],position:r,state:"highlight"}),l.record("add_package",`Add weight ${t[r]}, currentLoad = ${n}`)}for(let e=d;e<t.length;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});l.add_conditional("for_loop",!1),i<=a?(l.add_conditional("feasible",!0),l.update_visual("meta_result",{type:"metadata",value:`${i} <= ${a}: Feasible`}),s=e,l.update_variable("right",s),l.record("feasible_yes",`daysNeeded ${i} <= ${a}. Feasible! Set right = ${e}`)):(l.add_conditional("feasible",!1),l.update_visual("meta_result",{type:"metadata",value:`${i} > ${a}: Not feasible`}),r=e+1,l.update_variable("left",r),l.record("feasible_no",`daysNeeded ${i} > ${a}. Not feasible. Set left = ${e+1}`))}l.add_conditional("while_loop",!1);for(let e=0;e<t.length;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});return l.update_visual("meta_capacity",{type:"metadata",value:`Answer: ${r}`}),l.update_visual("meta_result",{type:"metadata",value:`Minimum capacity = ${r}`}),l.update_visual("meta_days_needed",{type:"metadata",value:""}),l.record("complete",`Minimum ship capacity = ${r}`),l.getSteps()
}

export function CapacityToShipPackagesWithinDDaysProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CapacityToShipPackagesWithinDDaysTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCapacityToShipPackagesWithinDDaysSteps(e) as any[];
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
      title="Capacity To Ship Packages Within D Days"
      slug="capacity-to-ship-packages-within-d-days"
      approaches={approaches}
      presets={CapacityToShipPackagesWithinDDaysPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find First and Last Position of Element in Sorted Array (find-first-and-last-position-of-element-in-sorted-array)
// ==========================================

const FindFirstAndLastPositionOfElementInSortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def searchRange(nums, target):\n    first = lower_bound(nums, target)\n    if first == len(nums) or nums[first] != target:\n        return [-1, -1]\n    last = upper_bound(nums, target) - 1\n    return [first, last]\n\ndef lower_bound(nums, target):\n    left = 0\n    right = len(nums)\n    while left < right:\n        mid = left + (right - left) // 2\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left\n\ndef upper_bound(nums, target):\n    left = 0\n    right = len(nums)\n    while left < right:\n        mid = left + (right - left) // 2\n        if nums[mid] <= target:\n            left = mid + 1\n        else:\n            right = mid\n    return left",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        9,
        10
      ],
      "lower_mid": [
        12
      ],
      "lower_left": [
        14
      ],
      "lower_right": [
        16
      ],
      "lower_done": [
        17
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        20,
        21
      ],
      "upper_mid": [
        23
      ],
      "upper_left": [
        25
      ],
      "upper_right": [
        27
      ],
      "upper_done": [
        28
      ],
      "result": [
        6
      ]
    },
    "conditionalMap": {
      "lower_while": [
        11
      ],
      "lower_compare": [
        13
      ],
      "upper_while": [
        22
      ],
      "upper_compare": [
        24
      ],
      "target_exists": [
        3
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] searchRange(int[] nums, int target) {\n    int first = lowerBound(nums, target);\n    if (first == nums.length || nums[first] != target) {\n        return new int[]{-1, -1};\n    }\n    int last = upperBound(nums, target) - 1;\n    return new int[]{first, last};\n}\n\nprivate int lowerBound(int[] nums, int target) {\n    int left = 0;\n    int right = nums.length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}\n\nprivate int upperBound(int[] nums, int target) {\n    int left = 0;\n    int right = nums.length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] <= target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> searchRange(vector<int>& nums, int target) {\n    int first = lowerBound(nums, target);\n    if (first == nums.size() || nums[first] != target) {\n        return {-1, -1};\n    }\n    int last = upperBound(nums, target) - 1;\n    return {first, last};\n}\n\nint lowerBound(vector<int>& nums, int target) {\n    int left = 0;\n    int right = nums.size();\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}\n\nint upperBound(vector<int>& nums, int target) {\n    int left = 0;\n    int right = nums.size();\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] <= target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] SearchRange(int[] nums, int target) {\n    int first = LowerBound(nums, target);\n    if (first == nums.Length || nums[first] != target) {\n        return new int[]{-1, -1};\n    }\n    int last = UpperBound(nums, target) - 1;\n    return new int[]{first, last};\n}\n\nprivate int LowerBound(int[] nums, int target) {\n    int left = 0;\n    int right = nums.Length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}\n\nprivate int UpperBound(int[] nums, int target) {\n    int left = 0;\n    int right = nums.Length;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] <= target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func searchRange(nums []int, target int) []int {\n    first := lowerBound(nums, target)\n    if first == len(nums) || nums[first] != target {\n        return []int{-1, -1}\n    }\n    last := upperBound(nums, target) - 1\n    return []int{first, last}\n}\n\nfunc lowerBound(nums []int, target int) int {\n    left := 0\n    right := len(nums)\n    for left < right {\n        mid := left + (right-left) / 2\n        if nums[mid] < target {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n    return left\n}\n\nfunc upperBound(nums []int, target int) int {\n    left := 0\n    right := len(nums)\n    for left < right {\n        mid := left + (right-left) / 2\n        if nums[mid] <= target {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n    return left\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function searchRange(nums, target) {\n    const first = lowerBound(nums, target);\n    if (first === nums.length || nums[first] !== target) {\n        return [-1, -1];\n    }\n    const last = upperBound(nums, target) - 1;\n    return [first, last];\n}\n\nfunction lowerBound(nums, target) {\n    let left = 0;\n    let right = nums.length;\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}\n\nfunction upperBound(nums, target) {\n    let left = 0;\n    let right = nums.length;\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (nums[mid] <= target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function searchRange(nums: number[], target: number): number[] {\n    const first = lowerBound(nums, target);\n    if (first === nums.length || nums[first] !== target) {\n        return [-1, -1];\n    }\n    const last = upperBound(nums, target) - 1;\n    return [first, last];\n}\n\nfunction lowerBound(nums: number[], target: number): number {\n    let left = 0;\n    let right = nums.length;\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (nums[mid] < target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}\n\nfunction upperBound(nums: number[], target: number): number {\n    let left = 0;\n    let right = nums.length;\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        if (nums[mid] <= target) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lower": [
        11,
        12
      ],
      "lower_mid": [
        14
      ],
      "lower_left": [
        16
      ],
      "lower_right": [
        18
      ],
      "lower_done": [
        21
      ],
      "target_not_found": [
        3,
        4
      ],
      "init_upper": [
        25,
        26
      ],
      "upper_mid": [
        28
      ],
      "upper_left": [
        30
      ],
      "upper_right": [
        32
      ],
      "upper_done": [
        35
      ],
      "result": [
        7
      ]
    },
    "conditionalMap": {
      "lower_while": [
        13
      ],
      "lower_compare": [
        15
      ],
      "upper_while": [
        27
      ],
      "upper_compare": [
        29
      ],
      "target_exists": [
        3
      ]
    }
  }
};

const FindFirstAndLastPositionOfElementInSortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Target in middle",
    "value": {
      "nums": [
        5,
        7,
        7,
        8,
        8,
        10
      ],
      "target": 8
    }
  },
  {
    "id": "ex2",
    "label": "Target not found",
    "value": {
      "nums": [
        5,
        7,
        7,
        8,
        8,
        10
      ],
      "target": 6
    }
  },
  {
    "id": "ex3",
    "label": "Single occurrence",
    "value": {
      "nums": [
        1,
        3,
        5,
        7,
        9
      ],
      "target": 5
    }
  },
  {
    "id": "ex4",
    "label": "All same",
    "value": {
      "nums": [
        2,
        2,
        2,
        2
      ],
      "target": 2
    }
  }
];

function generateFindFirstAndLastPositionOfElementInSortedArraySteps(t: any): any[] {
  

let e=[...t.nums],i=t.target,n=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),a=new StepRecorder({},{...n,meta_phase:{type:"metadata",value:""}});a.record("-",`Start: Find first and last position of target ${i} in the sorted array`),a.update_visual("meta_phase",{type:"metadata",value:"Phase 1: Lower Bound"});let l=0,s=e.length;for(a.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),a.add_new_visual("ptr_right",{type:"pointer",position:Math.min(s,e.length-1),label:"right"}),a.record("init_lower",`Phase 1, Lower Bound: Initialize left = 0, right = ${e.length}`);l<s;){a.add_conditional("lower_while",!0);let t=Math.floor((l+s)/2);if(a.add_new_visual("ptr_mid",{type:"pointer",position:t,label:"mid"}),a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"highlight"}),a.record("lower_mid",`Calculate mid = ${t}, nums[mid] = ${e[t]}`),e[t]<i){a.add_conditional("lower_compare",!0),l=t+1,a.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let t=0;t<e.length;t++){let i=t>=l&&t<s;a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("lower_left",`nums[mid] (${e[t]}) < target (${i}). Move left = ${l}`)}else{a.add_conditional("lower_compare",!1),s=t,a.update_visual("ptr_right",{type:"pointer",position:Math.min(s,e.length-1),label:"right"});for(let t=0;t<e.length;t++){let i=t>=l&&t<s;a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("lower_right",`nums[mid] (${e[t]}) >= target (${i}). Move right = ${t}`)}}a.add_conditional("lower_while",!1);let o=l;a.delete_visual("ptr_left"),a.delete_visual("ptr_right");for(let t=0;t<e.length;t++)a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:void 0});if(a.record("lower_done",`Lower bound found: first = ${o}`),o>=e.length||e[o]!==i)return a.add_conditional("target_exists",!1),a.update_visual("meta_phase",{type:"metadata",value:"Result: Not Found"}),a.record("target_not_found",`Target ${i} not found in the array. Return [-1, -1]`),a.getSteps();a.add_conditional("target_exists",!0),a.update_visual(`elem_${o}`,{type:"arrayElement",value:e[o],position:o,state:"active"}),a.record("target_not_found",`Target found at index ${o}. Proceed to find last position.`),a.update_visual("meta_phase",{type:"metadata",value:"Phase 2: Upper Bound"});for(let t=0;t<e.length;t++)a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:void 0});for(l=0,s=e.length,a.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),a.add_new_visual("ptr_right",{type:"pointer",position:Math.min(s,e.length-1),label:"right"}),a.record("init_upper",`Phase 2, Upper Bound: Initialize left = 0, right = ${e.length}`);l<s;){a.add_conditional("upper_while",!0);let t=Math.floor((l+s)/2);if(a.add_new_visual("ptr_mid",{type:"pointer",position:t,label:"mid"}),a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"highlight"}),a.record("upper_mid",`Calculate mid = ${t}, nums[mid] = ${e[t]}`),e[t]<=i){a.add_conditional("upper_compare",!0),l=t+1,a.update_visual("ptr_left",{type:"pointer",position:Math.min(l,e.length-1),label:"left"});for(let t=0;t<e.length;t++){let i=t>=l&&t<s;a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("upper_left",`nums[mid] (${e[t]}) <= target (${i}). Move left = ${l}`)}else{a.add_conditional("upper_compare",!1),s=t,a.update_visual("ptr_right",{type:"pointer",position:Math.min(s,e.length-1),label:"right"});for(let t=0;t<e.length;t++){let i=t>=l&&t<s;a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("upper_right",`nums[mid] (${e[t]}) > target (${i}). Move right = ${t}`)}}a.add_conditional("upper_while",!1);let u=l-1;a.delete_visual("ptr_left"),a.delete_visual("ptr_right"),a.record("upper_done",`Upper bound found: last = ${u}`),a.update_visual("meta_phase",{type:"metadata",value:`Result: [${o}, ${u}]`});for(let t=0;t<e.length;t++)a.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:t>=o&&t<=u?"active":void 0});return a.record("result",`Target ${i} found at range [${o}, ${u}]`),a.getSteps()
}

export function FindFirstAndLastPositionOfElementInSortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindFirstAndLastPositionOfElementInSortedArrayTemplates,
      generateSteps: (t: any) => {
        const recorded = generateFindFirstAndLastPositionOfElementInSortedArraySteps(t) as any[];
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
      title="Find First and Last Position of Element in Sorted Array"
      slug="find-first-and-last-position-of-element-in-sorted-array"
      approaches={approaches}
      presets={FindFirstAndLastPositionOfElementInSortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find First Occurrence (find-the-index-of-the-first-occurrence-in-a-string)
// ==========================================

const FindTheIndexOfTheFirstOccurrenceInAStringTemplates = {
  "python": {
    "language": "python",
    "code": "def strStr(haystack: str, needle: str) -> int:\n    n, m = len(haystack), len(needle)\n    # Build the LPS (Longest Prefix Suffix) array\n    lps = buildLPS(needle, m)\n    i, j = 0, 0\n\n    while i < n:\n        if haystack[i] == needle[j]:\n            i += 1\n            j += 1\n\n        if j == m:\n            # Found a match starting at index i - m\n            return i - m\n        elif i < n and haystack[i] != needle[j]:\n            if j > 0:\n                # Fall back using LPS instead of restarting\n                j = lps[j - 1]\n            else:\n                i += 1\n\n    return -1\n\ndef buildLPS(needle, m):\n    lps = [0] * m\n    length = 0\n    i = 1\n\n    while i < m:\n        if needle[i] == needle[length]:\n            length += 1\n            lps[i] = length\n            i += 1\n        else:\n            if length > 0:\n                # Fall back to previous LPS value\n                length = lps[length - 1]\n            else:\n                lps[i] = 0\n                # No fallback possible, advance haystack pointer\n                i += 1\n\n    return lps",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        24,
        25,
        26,
        27
      ],
      "lps_match": [
        30,
        31,
        32,
        33
      ],
      "lps_fallback": [
        35,
        37
      ],
      "lps_zero": [
        38,
        39,
        41
      ],
      "init_search": [
        2,
        4,
        5
      ],
      "search_match": [
        8,
        9,
        10
      ],
      "search_found": [
        12,
        14
      ],
      "search_fallback": [
        16,
        18
      ],
      "search_advance": [
        19,
        20
      ],
      "not_found": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        30
      ],
      "search_char_match": [
        8
      ],
      "j_equals_m": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int strStr(String haystack, String needle) {\n    int n = haystack.length();\n    int m = needle.length();\n    // Build the LPS (Longest Prefix Suffix) array\n    int[] lps = buildLPS(needle, m);\n    int i = 0, j = 0;\n\n    while (i < n) {\n        if (haystack.charAt(i) == needle.charAt(j)) {\n            i++;\n            j++;\n        }\n\n        if (j == m) {\n            // Found a match starting at index i - m\n            return i - m;\n        } else if (i < n && haystack.charAt(i) != needle.charAt(j)) {\n            if (j > 0) {\n                // Fall back using LPS instead of restarting\n                j = lps[j - 1];\n            } else {\n                i++;\n            }\n        }\n    }\n\n    return -1;\n}\n\nprivate int[] buildLPS(String needle, int m) {\n    int[] lps = new int[m];\n    int length = 0;\n    int i = 1;\n\n    while (i < m) {\n        if (needle.charAt(i) == needle.charAt(length)) {\n            length++;\n            lps[i] = length;\n            i++;\n        } else {\n            if (length > 0) {\n                // Fall back to previous LPS value\n                length = lps[length - 1];\n            } else {\n                lps[i] = 0;\n                // No fallback possible, advance haystack pointer\n                i++;\n            }\n        }\n    }\n\n    return lps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int strStr(string haystack, string needle) {\n    int n = haystack.length();\n    int m = needle.length();\n    // Build the LPS (Longest Prefix Suffix) array\n    vector<int> lps = buildLPS(needle, m);\n    int i = 0, j = 0;\n\n    while (i < n) {\n        if (haystack[i] == needle[j]) {\n            i++;\n            j++;\n        }\n\n        if (j == m) {\n            // Found a match starting at index i - m\n            return i - m;\n        } else if (i < n && haystack[i] != needle[j]) {\n            if (j > 0) {\n                // Fall back using LPS instead of restarting\n                j = lps[j - 1];\n            } else {\n                i++;\n            }\n        }\n    }\n\n    return -1;\n}\n\nvector<int> buildLPS(string needle, int m) {\n    vector<int> lps(m, 0);\n    int length = 0;\n    int i = 1;\n\n    while (i < m) {\n        if (needle[i] == needle[length]) {\n            length++;\n            lps[i] = length;\n            i++;\n        } else {\n            if (length > 0) {\n                // Fall back to previous LPS value\n                length = lps[length - 1];\n            } else {\n                lps[i] = 0;\n                // No fallback possible, advance haystack pointer\n                i++;\n            }\n        }\n    }\n\n    return lps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int StrStr(string haystack, string needle) {\n    int n = haystack.Length;\n    int m = needle.Length;\n    // Build the LPS (Longest Prefix Suffix) array\n    int[] lps = BuildLPS(needle, m);\n    int i = 0, j = 0;\n\n    while (i < n) {\n        if (haystack[i] == needle[j]) {\n            i++;\n            j++;\n        }\n\n        if (j == m) {\n            // Found a match starting at index i - m\n            return i - m;\n        } else if (i < n && haystack[i] != needle[j]) {\n            if (j > 0) {\n                // Fall back using LPS instead of restarting\n                j = lps[j - 1];\n            } else {\n                i++;\n            }\n        }\n    }\n\n    return -1;\n}\n\nprivate int[] BuildLPS(string needle, int m) {\n    int[] lps = new int[m];\n    int length = 0;\n    int i = 1;\n\n    while (i < m) {\n        if (needle[i] == needle[length]) {\n            length++;\n            lps[i] = length;\n            i++;\n        } else {\n            if (length > 0) {\n                // Fall back to previous LPS value\n                length = lps[length - 1];\n            } else {\n                lps[i] = 0;\n                // No fallback possible, advance haystack pointer\n                i++;\n            }\n        }\n    }\n\n    return lps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func strStr(haystack string, needle string) int {\n    n := len(haystack)\n    m := len(needle)\n    // Build the LPS (Longest Prefix Suffix) array\n    lps := buildLPS(needle, m)\n    i, j := 0, 0\n\n    for i < n {\n        if haystack[i] == needle[j] {\n            i++\n            j++\n        }\n\n        if j == m {\n            // Found a match starting at index i - m\n            return i - m\n        } else if i < n && haystack[i] != needle[j] {\n            if j > 0 {\n                // Fall back using LPS instead of restarting\n                j = lps[j-1]\n            } else {\n                i++\n            }\n        }\n    }\n\n    return -1\n}\n\nfunc buildLPS(needle string, m int) []int {\n    lps := make([]int, m)\n    length := 0\n    i := 1\n\n    for i < m {\n        if needle[i] == needle[length] {\n            length++\n            lps[i] = length\n            i++\n        } else {\n            if length > 0 {\n                // Fall back to previous LPS value\n                length = lps[length-1]\n            } else {\n                lps[i] = 0\n                // No fallback possible, advance haystack pointer\n                i++\n            }\n        }\n    }\n\n    return lps\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var strStr = function(haystack, needle) {\n    const n = haystack.length;\n    const m = needle.length;\n    // Build the LPS (Longest Prefix Suffix) array\n    const lps = buildLPS(needle, m);\n    let i = 0, j = 0;\n\n    while (i < n) {\n        if (haystack[i] === needle[j]) {\n            i++;\n            j++;\n        }\n\n        if (j === m) {\n            // Found a match starting at index i - m\n            return i - m;\n        } else if (i < n && haystack[i] !== needle[j]) {\n            if (j > 0) {\n                // Fall back using LPS instead of restarting\n                j = lps[j - 1];\n            } else {\n                i++;\n            }\n        }\n    }\n\n    return -1;\n}\n\nfunction buildLPS(needle, m) {\n    const lps = new Array(m).fill(0);\n    let length = 0;\n    let i = 1;\n\n    while (i < m) {\n        if (needle[i] === needle[length]) {\n            length++;\n            lps[i] = length;\n            i++;\n        } else {\n            if (length > 0) {\n                // Fall back to previous LPS value\n                length = lps[length - 1];\n            } else {\n                lps[i] = 0;\n                // No fallback possible, advance haystack pointer\n                i++;\n            }\n        }\n    }\n\n    return lps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function strStr(haystack: string, needle: string): number {\n    const n = haystack.length;\n    const m = needle.length;\n    // Build the LPS (Longest Prefix Suffix) array\n    const lps = buildLPS(needle, m);\n    let i = 0, j = 0;\n\n    while (i < n) {\n        if (haystack[i] === needle[j]) {\n            i++;\n            j++;\n        }\n\n        if (j === m) {\n            // Found a match starting at index i - m\n            return i - m;\n        } else if (i < n && haystack[i] !== needle[j]) {\n            if (j > 0) {\n                // Fall back using LPS instead of restarting\n                j = lps[j - 1];\n            } else {\n                i++;\n            }\n        }\n    }\n\n    return -1;\n}\n\nfunction buildLPS(needle: string, m: number): number[] {\n    const lps = new Array(m).fill(0);\n    let length = 0;\n    let i = 1;\n\n    while (i < m) {\n        if (needle[i] === needle[length]) {\n            length++;\n            lps[i] = length;\n            i++;\n        } else {\n            if (length > 0) {\n                // Fall back to previous LPS value\n                length = lps[length - 1];\n            } else {\n                lps[i] = 0;\n                // No fallback possible, advance haystack pointer\n                i++;\n            }\n        }\n    }\n\n    return lps;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_lps": [
        30,
        31,
        32,
        33
      ],
      "lps_match": [
        36,
        37,
        38,
        39
      ],
      "lps_fallback": [
        41,
        43
      ],
      "lps_zero": [
        44,
        45,
        47
      ],
      "init_search": [
        2,
        3,
        5,
        6
      ],
      "search_match": [
        9,
        10,
        11
      ],
      "search_found": [
        14,
        16
      ],
      "search_fallback": [
        18,
        20
      ],
      "search_advance": [
        21,
        22
      ],
      "not_found": [
        27
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "lps_char_match": [
        36
      ],
      "search_char_match": [
        9
      ],
      "j_equals_m": [
        14
      ]
    }
  }
};

const FindTheIndexOfTheFirstOccurrenceInAStringPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Found (start)",
    "value": {
      "haystack": "sadbutsad",
      "needle": "sad"
    }
  },
  {
    "id": "ex2",
    "label": "Not found",
    "value": {
      "haystack": "leetcode",
      "needle": "leeto"
    }
  },
  {
    "id": "ex3",
    "label": "KMP fallback",
    "value": {
      "haystack": "aabaabaaf",
      "needle": "aabaaf"
    }
  },
  {
    "id": "ex4",
    "label": "Partial match",
    "value": {
      "haystack": "abcabcabd",
      "needle": "abcabd"
    }
  }
];

function generateFindTheIndexOfTheFirstOccurrenceInAStringSteps(e: any): any[] {
  

let t=e.haystack,a=e.needle,n=t.length,l=a.length,r={};for(let e=0;e<l;e++)r[`needle_${e}`]={type:"arrayElement",value:a[e],position:e};for(let e=0;e<l;e++)r[`lps_${e}`]={type:"arrayElement",value:0,position:e};let s=new StepRecorder({haystack:t,needle:a},r);s.record("-",`Start: Find first occurrence of "${a}" in "${t}" using KMP algorithm.`);let o=Array(l).fill(0),h=0,d=1;for(s.add_new_variable("phase","Building LPS"),s.add_new_variable("length",h),s.add_new_variable("i_lps",d),l>1&&(s.add_new_visual("ptr_length",{type:"pointer",position:0,label:"length"}),s.add_new_visual("ptr_i_lps",{type:"pointer",position:1,label:"i"})),s.record("init_lps",`Initialize LPS array of size ${l}. Set length=0, i=1.`);d<l;){s.update_visual(`needle_${d}`,{type:"arrayElement",value:a[d],position:d,state:"comparing"}),s.update_visual(`needle_${h}`,{type:"arrayElement",value:a[h],position:h,state:"comparing"});let e=a[d]===a[h];if(s.add_conditional("lps_char_match",e),e){h++,o[d]=h,s.update_variable("length",h),s.update_visual(`lps_${d}`,{type:"arrayElement",value:h,position:d,state:"active"}),s.update_visual(`needle_${d}`,{type:"arrayElement",value:a[d],position:d,state:"active"}),s.update_visual(`needle_${h-1}`,{type:"arrayElement",value:a[h-1],position:h-1,state:"active"}),d++,s.update_variable("i_lps",d),d<l?s.update_visual("ptr_i_lps",{type:"pointer",position:d,label:"i"}):s.delete_visual("ptr_i_lps"),s.update_visual("ptr_length",{type:"pointer",position:h,label:"length"}),s.record("lps_match",`Match: needle[${d-1}]='${a[d-1]}' == needle[${h-1}]='${a[h-1]}'. Set lps[${d-1}]=${h}, length=${h}, i=${d}.`);for(let e=0;e<l;e++){let t=s.get_visual(`needle_${e}`);t&&"comparing"===t.state&&s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e})}}else if(h>0){s.update_visual(`needle_${d}`,{type:"arrayElement",value:a[d],position:d,state:"mismatch"}),s.update_visual(`needle_${h}`,{type:"arrayElement",value:a[h],position:h,state:"mismatch"});let e=h;h=o[h-1],s.update_variable("length",h),s.update_visual("ptr_length",{type:"pointer",position:h,label:"length"}),s.record("lps_fallback",`Mismatch: needle[${d}]='${a[d]}' != needle[${e}]='${a[e]}'. Fallback: length = lps[${e-1}] = ${h}.`);for(let e=0;e<l;e++){let t=s.get_visual(`needle_${e}`);t&&("comparing"===t.state||"mismatch"===t.state)&&s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e})}}else s.update_visual(`needle_${d}`,{type:"arrayElement",value:a[d],position:d,state:"mismatch"}),o[d]=0,s.update_visual(`lps_${d}`,{type:"arrayElement",value:0,position:d}),d++,s.update_variable("i_lps",d),d<l?s.update_visual("ptr_i_lps",{type:"pointer",position:d,label:"i"}):s.delete_visual("ptr_i_lps"),s.record("lps_zero",`Mismatch and length=0. Set lps[${d-1}]=0, advance i to ${d}.`),s.update_visual(`needle_${d-1}`,{type:"arrayElement",value:a[d-1],position:d-1})}s.delete_visual("ptr_length"),s.delete_visual("ptr_i_lps");for(let e=0;e<l;e++)s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e});for(let e=0;e<n;e++)s.add_new_visual(`haystack_${e}`,{type:"arrayElement",value:t[e],position:e});d=0;let c=0;for(s.update_variable("phase","Searching"),s.delete_variable("length"),s.delete_variable("i_lps"),s.add_new_variable("i",d),s.add_new_variable("j",c),s.add_new_variable("result",-1),s.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),s.add_new_visual("ptr_j",{type:"pointer",position:0,label:"j"}),s.record("init_search",`LPS built: [${o.join(", ")}]. Now search haystack with i=0, j=0.`);d<n;){s.update_visual(`haystack_${d}`,{type:"arrayElement",value:t[d],position:d,state:"comparing"}),s.update_visual(`needle_${c}`,{type:"arrayElement",value:a[c],position:c,state:"comparing"});let e=t[d]===a[c];s.add_conditional("search_char_match",e),e&&(s.update_visual(`haystack_${d}`,{type:"arrayElement",value:t[d],position:d,state:"match"}),s.update_visual(`needle_${c}`,{type:"arrayElement",value:a[c],position:c,state:"match"}),d++,c++,s.update_variable("i",d),s.update_variable("j",c),d<n?s.update_visual("ptr_i",{type:"pointer",position:d,label:"i"}):s.delete_visual("ptr_i"),c<l?s.update_visual("ptr_j",{type:"pointer",position:c,label:"j"}):s.delete_visual("ptr_j"),s.record("search_match",`Match: haystack[${d-1}]='${t[d-1]}' == needle[${c-1}]='${a[c-1]}'. Advance i=${d}, j=${c}.`));let i=c===l;if(s.add_conditional("j_equals_m",i),i){let e=d-l;s.update_variable("result",e);for(let a=e;a<e+l;a++)s.update_visual(`haystack_${a}`,{type:"arrayElement",value:t[a],position:a,state:"active"});for(let e=0;e<l;e++)s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e,state:"active"});return s.delete_visual("ptr_i"),s.delete_visual("ptr_j"),s.record("search_found",`Found! j == m (${l}). Needle found at index ${e} (i - m = ${d} - ${l}).`),s.record("complete",`Done! Return ${e}. "${a}" first appears at index ${e} in "${t}".`),s.getSteps()}if(d<n&&t[d]!==a[c])if(s.update_visual(`haystack_${d}`,{type:"arrayElement",value:t[d],position:d,state:"mismatch"}),c<l&&s.update_visual(`needle_${c}`,{type:"arrayElement",value:a[c],position:c,state:"mismatch"}),c>0){let e=c;c=o[c-1],s.update_variable("j",c);for(let e=0;e<l;e++)s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e,state:e<c?"match":void 0});s.update_visual("ptr_j",{type:"pointer",position:c,label:"j"}),s.record("search_fallback",`Mismatch: haystack[${d}]='${t[d]}' != needle[${e}]='${a[e]}'. Use LPS: j = lps[${e-1}] = ${c}.`),s.update_visual(`haystack_${d}`,{type:"arrayElement",value:t[d],position:d})}else s.update_visual(`haystack_${d}`,{type:"arrayElement",value:t[d],position:d,state:"mismatch"}),c<l&&s.update_visual(`needle_${c}`,{type:"arrayElement",value:a[c],position:c,state:"mismatch"}),d++,s.update_variable("i",d),d<n?s.update_visual("ptr_i",{type:"pointer",position:d,label:"i"}):s.delete_visual("ptr_i"),s.record("search_advance",`Mismatch and j=0. Advance i to ${d}.`),d-1<n&&s.update_visual(`haystack_${d-1}`,{type:"arrayElement",value:t[d-1],position:d-1}),c<l&&s.update_visual(`needle_${c}`,{type:"arrayElement",value:a[c],position:c})}s.update_variable("result",-1),s.delete_visual("ptr_i"),s.delete_visual("ptr_j");for(let e=0;e<n;e++)s.update_visual(`haystack_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});for(let e=0;e<l;e++)s.update_visual(`needle_${e}`,{type:"arrayElement",value:a[e],position:e,state:"inactive"});return s.record("not_found",`Needle "${a}" not found in haystack "${t}".`),s.record("complete",`Done! Return -1. "${a}" does not appear in "${t}".`),s.getSteps()
}

export function FindTheIndexOfTheFirstOccurrenceInAStringProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindTheIndexOfTheFirstOccurrenceInAStringTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindTheIndexOfTheFirstOccurrenceInAStringSteps(e) as any[];
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
      title="Find First Occurrence"
      slug="find-the-index-of-the-first-occurrence-in-a-string"
      approaches={approaches}
      presets={FindTheIndexOfTheFirstOccurrenceInAStringPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find in Mountain Array (find-in-mountain-array)
// ==========================================

const FindInMountainArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findInMountainArray(target, mountain_arr):\n    n = mountain_arr.length()\n    cache = {}\n\n    def get_val(i):\n        if i not in cache:\n            cache[i] = mountain_arr.get(i)\n        return cache[i]\n\n    # Phase 1: Find peak\n    left, right = 0, n - 1\n    while left < right:\n        mid = left + (right - left) // 2\n        if get_val(mid) < get_val(mid + 1):\n            left = mid + 1\n        else:\n            right = mid\n    peak = left\n\n    # Phase 2: Search ascending [0, peak]\n    left, right = 0, peak\n    while left <= right:\n        mid = left + (right - left) // 2\n        val = get_val(mid)\n        if val == target:\n            return mid\n        elif val < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    # Phase 3: Search descending [peak, n-1]\n    left, right = peak, n - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        val = get_val(mid)\n        if val == target:\n            return mid\n        elif val > target:\n            left = mid + 1\n        else:\n            right = mid - 1\n\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        11
      ],
      "p1_calc_mid": [
        13
      ],
      "p1_go_right": [
        15
      ],
      "p1_go_left": [
        17
      ],
      "p1_found_peak": [
        18
      ],
      "p2_init": [
        21
      ],
      "p2_calc_mid": [
        23,
        24
      ],
      "p2_go_right": [
        28
      ],
      "p2_go_left": [
        30
      ],
      "p2_not_found": [
        22
      ],
      "p3_init": [
        33
      ],
      "p3_calc_mid": [
        35,
        36
      ],
      "p3_go_right": [
        40
      ],
      "p3_go_left": [
        42
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "p1_while": [
        12
      ],
      "p1_ascending": [
        14
      ],
      "p2_while": [
        22
      ],
      "p2_found": [
        25
      ],
      "p2_less": [
        27
      ],
      "p3_while": [
        34
      ],
      "p3_found": [
        37
      ],
      "p3_greater": [
        39
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findInMountainArray(int target, MountainArray mountainArr) {\n    int n = mountainArr.length();\n    Map<Integer, Integer> cache = new HashMap<>();\n\n    // Phase 1: Find peak\n    int left = 0, right = n - 1;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int midVal = getVal(mid, mountainArr, cache);\n        int midNext = getVal(mid + 1, mountainArr, cache);\n        if (midVal < midNext) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    int peak = left;\n\n    // Phase 2: Search ascending [0, peak]\n    left = 0; right = peak;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = getVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left = peak; right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = getVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val > target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        6
      ],
      "p1_calc_mid": [
        8,
        9,
        10
      ],
      "p1_go_right": [
        12
      ],
      "p1_go_left": [
        14
      ],
      "p1_found_peak": [
        17
      ],
      "p2_init": [
        20
      ],
      "p2_calc_mid": [
        22,
        23
      ],
      "p2_go_right": [
        27
      ],
      "p2_go_left": [
        29
      ],
      "p2_not_found": [
        21
      ],
      "p3_init": [
        34
      ],
      "p3_calc_mid": [
        36,
        37
      ],
      "p3_go_right": [
        41
      ],
      "p3_go_left": [
        43
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "p1_while": [
        7
      ],
      "p1_ascending": [
        11
      ],
      "p2_while": [
        21
      ],
      "p2_found": [
        24
      ],
      "p2_less": [
        26
      ],
      "p3_while": [
        35
      ],
      "p3_found": [
        38
      ],
      "p3_greater": [
        40
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findInMountainArray(int target, MountainArray &mountainArr) {\n    int n = mountainArr.length();\n    unordered_map<int, int> cache;\n\n    // Phase 1: Find peak\n    int left = 0, right = n - 1;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int midVal = getVal(mid, mountainArr, cache);\n        int midNext = getVal(mid + 1, mountainArr, cache);\n        if (midVal < midNext) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    int peak = left;\n\n    // Phase 2: Search ascending [0, peak]\n    left = 0; right = peak;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = getVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left = peak; right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = getVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val > target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        6
      ],
      "p1_calc_mid": [
        8,
        9,
        10
      ],
      "p1_go_right": [
        12
      ],
      "p1_go_left": [
        14
      ],
      "p1_found_peak": [
        17
      ],
      "p2_init": [
        20
      ],
      "p2_calc_mid": [
        22,
        23
      ],
      "p2_go_right": [
        27
      ],
      "p2_go_left": [
        29
      ],
      "p2_not_found": [
        21
      ],
      "p3_init": [
        34
      ],
      "p3_calc_mid": [
        36,
        37
      ],
      "p3_go_right": [
        41
      ],
      "p3_go_left": [
        43
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "p1_while": [
        7
      ],
      "p1_ascending": [
        11
      ],
      "p2_while": [
        21
      ],
      "p2_found": [
        24
      ],
      "p2_less": [
        26
      ],
      "p3_while": [
        35
      ],
      "p3_found": [
        38
      ],
      "p3_greater": [
        40
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindInMountainArray(int target, MountainArray mountainArr) {\n    int n = mountainArr.Length();\n    var cache = new Dictionary<int, int>();\n\n    // Phase 1: Find peak\n    int left = 0, right = n - 1;\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        int midVal = GetVal(mid, mountainArr, cache);\n        int midNext = GetVal(mid + 1, mountainArr, cache);\n        if (midVal < midNext) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    int peak = left;\n\n    // Phase 2: Search ascending [0, peak]\n    left = 0; right = peak;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = GetVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left = peak; right = n - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        int val = GetVal(mid, mountainArr, cache);\n        if (val == target) {\n            return mid;\n        } else if (val > target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        6
      ],
      "p1_calc_mid": [
        8,
        9,
        10
      ],
      "p1_go_right": [
        12
      ],
      "p1_go_left": [
        14
      ],
      "p1_found_peak": [
        17
      ],
      "p2_init": [
        20
      ],
      "p2_calc_mid": [
        22,
        23
      ],
      "p2_go_right": [
        27
      ],
      "p2_go_left": [
        29
      ],
      "p2_not_found": [
        21
      ],
      "p3_init": [
        34
      ],
      "p3_calc_mid": [
        36,
        37
      ],
      "p3_go_right": [
        41
      ],
      "p3_go_left": [
        43
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "p1_while": [
        7
      ],
      "p1_ascending": [
        11
      ],
      "p2_while": [
        21
      ],
      "p2_found": [
        24
      ],
      "p2_less": [
        26
      ],
      "p3_while": [
        35
      ],
      "p3_found": [
        38
      ],
      "p3_greater": [
        40
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findInMountainArray(target int, mountainArr *MountainArray) int {\n    n := mountainArr.length()\n    cache := map[int]int{}\n\n    // Phase 1: Find peak\n    left, right := 0, n-1\n    for left < right {\n        mid := left + (right-left)/2\n        midVal := getVal(mid, mountainArr, cache)\n        midNext := getVal(mid+1, mountainArr, cache)\n        if midVal < midNext {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n    peak := left\n\n    // Phase 2: Search ascending [0, peak]\n    left, right = 0, peak\n    for left <= right {\n        mid := left + (right-left)/2\n        val := getVal(mid, mountainArr, cache)\n        if val == target {\n            return mid\n        } else if val < target {\n            left = mid + 1\n        } else {\n            right = mid - 1\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left, right = peak, n-1\n    for left <= right {\n        mid := left + (right-left)/2\n        val := getVal(mid, mountainArr, cache)\n        if val == target {\n            return mid\n        } else if val > target {\n            left = mid + 1\n        } else {\n            right = mid - 1\n        }\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        6
      ],
      "p1_calc_mid": [
        8,
        9,
        10
      ],
      "p1_go_right": [
        12
      ],
      "p1_go_left": [
        14
      ],
      "p1_found_peak": [
        17
      ],
      "p2_init": [
        20
      ],
      "p2_calc_mid": [
        22,
        23
      ],
      "p2_go_right": [
        27
      ],
      "p2_go_left": [
        29
      ],
      "p2_not_found": [
        21
      ],
      "p3_init": [
        34
      ],
      "p3_calc_mid": [
        36,
        37
      ],
      "p3_go_right": [
        41
      ],
      "p3_go_left": [
        43
      ],
      "complete": [
        47
      ]
    },
    "conditionalMap": {
      "p1_while": [
        7
      ],
      "p1_ascending": [
        11
      ],
      "p2_while": [
        21
      ],
      "p2_found": [
        24
      ],
      "p2_less": [
        26
      ],
      "p3_while": [
        35
      ],
      "p3_found": [
        38
      ],
      "p3_greater": [
        40
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findInMountainArray = function(target, mountainArr) {\n    const n = mountainArr.length();\n    const cache = new Map();\n\n    const getVal = (i) => {\n        if (!cache.has(i)) cache.set(i, mountainArr.get(i));\n        return cache.get(i);\n    };\n\n    // Phase 1: Find peak\n    let left = 0, right = n - 1;\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (get_val(mid) < get_val(mid + 1)) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    const peak = left;\n\n    // Phase 2: Search ascending [0, peak]\n    left = 0; right = peak;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const val = get_val(mid);\n        if (val === target) {\n            return mid;\n        } else if (val < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left = peak; right = n - 1;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const val = get_val(mid);\n        if (val === target) {\n            return mid;\n        } else if (val > target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        11
      ],
      "p1_calc_mid": [
        13
      ],
      "p1_go_right": [
        15
      ],
      "p1_go_left": [
        17
      ],
      "p1_found_peak": [
        20
      ],
      "p2_init": [
        23
      ],
      "p2_calc_mid": [
        25,
        26
      ],
      "p2_go_right": [
        30
      ],
      "p2_go_left": [
        32
      ],
      "p2_not_found": [
        24
      ],
      "p3_init": [
        37
      ],
      "p3_calc_mid": [
        39,
        40
      ],
      "p3_go_right": [
        44
      ],
      "p3_go_left": [
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "p1_while": [
        12
      ],
      "p1_ascending": [
        14
      ],
      "p2_while": [
        24
      ],
      "p2_found": [
        27
      ],
      "p2_less": [
        29
      ],
      "p3_while": [
        38
      ],
      "p3_found": [
        41
      ],
      "p3_greater": [
        43
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findInMountainArray(target: number, mountainArr: MountainArray): number {\n    const n = mountainArr.length();\n    const cache = new Map<number, number>();\n\n    const getVal = (i: number): number => {\n        if (!cache.has(i)) cache.set(i, mountainArr.get(i));\n        return cache.get(i)!;\n    };\n\n    // Phase 1: Find peak\n    let left = 0, right = n - 1;\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (get_val(mid) < get_val(mid + 1)) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n    const peak = left;\n\n    // Phase 2: Search ascending [0, peak]\n    left = 0; right = peak;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const val = get_val(mid);\n        if (val === target) {\n            return mid;\n        } else if (val < target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    // Phase 3: Search descending [peak, n-1]\n    left = peak; right = n - 1;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const val = get_val(mid);\n        if (val === target) {\n            return mid;\n        } else if (val > target) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "p1_init": [
        11
      ],
      "p1_calc_mid": [
        13
      ],
      "p1_go_right": [
        15
      ],
      "p1_go_left": [
        17
      ],
      "p1_found_peak": [
        20
      ],
      "p2_init": [
        23
      ],
      "p2_calc_mid": [
        25,
        26
      ],
      "p2_go_right": [
        30
      ],
      "p2_go_left": [
        32
      ],
      "p2_not_found": [
        24
      ],
      "p3_init": [
        37
      ],
      "p3_calc_mid": [
        39,
        40
      ],
      "p3_go_right": [
        44
      ],
      "p3_go_left": [
        46
      ],
      "complete": [
        50
      ]
    },
    "conditionalMap": {
      "p1_while": [
        12
      ],
      "p1_ascending": [
        14
      ],
      "p2_while": [
        24
      ],
      "p2_found": [
        27
      ],
      "p2_less": [
        29
      ],
      "p3_while": [
        38
      ],
      "p3_found": [
        41
      ],
      "p3_greater": [
        43
      ]
    }
  }
};

const FindInMountainArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Found in descending",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        6,
        4,
        2
      ],
      "target": 6
    }
  },
  {
    "id": "ex2",
    "label": "Found in ascending",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        6,
        4,
        2
      ],
      "target": 3
    }
  },
  {
    "id": "ex3",
    "label": "Not found",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        6,
        4,
        2
      ],
      "target": 8
    }
  },
  {
    "id": "ex4",
    "label": "Small mountain",
    "value": {
      "arr": [
        0,
        5,
        3,
        1
      ],
      "target": 1
    }
  },
  {
    "id": "ex5",
    "label": "Both halves",
    "value": {
      "arr": [
        1,
        2,
        3,
        5,
        3
      ],
      "target": 3
    }
  },
  {
    "id": "ex6",
    "label": "Minimum mountain",
    "value": {
      "arr": [
        1,
        5,
        2
      ],
      "target": 2
    }
  }
];

function generateFindInMountainArraySteps(e: any): any[] {
  

let t=[...e.arr],i=e.target,n=t.length,r=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({arr:t,target:i,left:void 0,right:void 0,mid:void 0,peak:void 0,phase:"Find Peak"},{...r,metadata_phase:{type:"metadata",value:"Find Peak"}});l.record("-",`Start: Find target ${i} in mountain array`);let o=new Map;function d(e){return o.set(e,t[e]),t[e]}function p(e,i,a){for(let r=0;r<n;r++){let n=r>=e&&r<=i;l.update_visual(`elem_${r}`,{type:"arrayElement",value:t[r],position:r,state:void 0!==a&&r===a?"highlight":n?void 0:"inactive"})}}l.update_variable("phase","Find Peak");let g=0,s=n-1;for(l.update_variable("left",g),l.update_variable("right",s),l.add_new_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),p(g,s),l.record("p1_init",`Phase 1: Find peak. Initialize left = 0, right = ${n-1}`);g<s;){l.add_conditional("p1_while",!0);let e=Math.floor(g+(s-g)/2);l.update_variable("mid",e),l.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"});let t=d(e),i=d(e+1);l.record("p1_calc_mid",`mid = ${e}, arr[${e}] = ${t}, arr[${e+1}] = ${i}`),t<i?(l.add_conditional("p1_ascending",!0),g=e+1,l.update_variable("left",g),l.update_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.delete_visual("ptr_mid"),p(g,s),l.record("p1_go_right",`arr[${e}] < arr[${e+1}], peak is to the right. left = ${g}`)):(l.add_conditional("p1_ascending",!1),s=e,l.update_variable("right",s),l.update_visual("ptr_right",{type:"pointer",position:s,label:"right"}),l.delete_visual("ptr_mid"),p(g,s),l.record("p1_go_left",`arr[${e}] >= arr[${e+1}], peak is to the left. right = ${e}`))}l.add_conditional("p1_while",!1);let _=g;for(l.update_variable("peak",_),l.delete_visual("ptr_mid"),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.update_visual(`elem_${_}`,{type:"arrayElement",value:t[_],position:_,state:"highlight"}),l.record("p1_found_peak",`Peak found at index ${_}, value = ${t[_]}`),l.update_variable("phase","Search Ascending"),l.update_visual("metadata_phase",{type:"metadata",value:"Search Ascending [0.."+_+"]"}),g=0,s=_,l.update_variable("left",g),l.update_variable("right",s),l.update_variable("mid",void 0),l.add_new_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),p(g,s,_),l.record("p2_init",`Phase 2: Search ascending half [0..${_}] for target ${i}`);g<=s;){l.add_conditional("p2_while",!0);let e=Math.floor(g+(s-g)/2),a=d(e);if(l.update_variable("mid",e),l.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),l.record("p2_calc_mid",`mid = ${e}, arr[${e}] = ${a}`),a===i)return l.add_conditional("p2_found",!0),l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.delete_visual("ptr_mid"),l.record("complete",`Found target ${i} at index ${e}`),l.getSteps();l.add_conditional("p2_found",!1),a<i?(l.add_conditional("p2_less",!0),g=e+1,l.update_variable("left",g),l.update_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.delete_visual("ptr_mid"),p(g,s,_),l.record("p2_go_right",`arr[${e}] < target, search right. left = ${g}`)):(l.add_conditional("p2_less",!1),s=e-1,l.update_variable("right",s),l.update_visual("ptr_right",{type:"pointer",position:s,label:"right"}),l.delete_visual("ptr_mid"),p(g,s,_),l.record("p2_go_left",`arr[${e}] > target, search left. right = ${s}`))}for(l.add_conditional("p2_while",!1),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.delete_visual("ptr_mid"),l.record("p2_not_found",`Target ${i} not found in ascending half`),l.update_variable("phase","Search Descending"),l.update_visual("metadata_phase",{type:"metadata",value:"Search Descending ["+_+".."+(n-1)+"]"}),g=_,s=n-1,l.update_variable("left",g),l.update_variable("right",s),l.update_variable("mid",void 0),l.add_new_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),p(g,s,_),l.record("p3_init",`Phase 3: Search descending half [${_}..${n-1}] for target ${i}`);g<=s;){l.add_conditional("p3_while",!0);let e=Math.floor(g+(s-g)/2),a=d(e);if(l.update_variable("mid",e),l.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),l.record("p3_calc_mid",`mid = ${e}, arr[${e}] = ${a}`),a===i)return l.add_conditional("p3_found",!0),l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.delete_visual("ptr_mid"),l.record("complete",`Found target ${i} at index ${e}`),l.getSteps();l.add_conditional("p3_found",!1),a>i?(l.add_conditional("p3_greater",!0),g=e+1,l.update_variable("left",g),l.update_visual("ptr_left",{type:"pointer",position:g,label:"left"}),l.delete_visual("ptr_mid"),p(g,s,_),l.record("p3_go_right",`arr[${e}] > target (descending), search right. left = ${g}`)):(l.add_conditional("p3_greater",!1),s=e-1,l.update_variable("right",s),l.update_visual("ptr_right",{type:"pointer",position:s,label:"right"}),l.delete_visual("ptr_mid"),p(g,s,_),l.record("p3_go_left",`arr[${e}] < target (descending), search left. right = ${s}`))}return l.add_conditional("p3_while",!1),l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.delete_visual("ptr_mid"),l.record("complete",`Target ${i} not found in mountain array. Return -1`),l.getSteps()
}

export function FindInMountainArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindInMountainArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindInMountainArraySteps(e) as any[];
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
      title="Find in Mountain Array"
      slug="find-in-mountain-array"
      approaches={approaches}
      presets={FindInMountainArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find K Closest Elements (find-k-closest-elements)
// ==========================================

const FindKClosestElementsTemplates = {
  "python": {
    "language": "python",
    "code": "def findClosestElements(arr, k, x):\n    left = 0\n    right = len(arr) - k\n\n    while left < right:\n        mid = left + (right - left) // 2\n\n        if x - arr[mid] > arr[mid + k] - x:\n            left = mid + 1\n        else:\n            right = mid\n\n    return arr[left:left + k]",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> findClosestElements(int[] arr, int k, int x) {\n    int left = 0;\n    int right = arr.length - k;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (x - arr[mid] > arr[mid + k] - x) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    List<Integer> result = new ArrayList<>();\n    for (int i = left; i < left + k; i++) {\n        result.add(arr[i]);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15,
        16,
        17,
        18,
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findClosestElements(vector<int>& arr, int k, int x) {\n    int left = 0;\n    int right = arr.size() - k;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (x - arr[mid] > arr[mid + k] - x) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return vector<int>(\n        arr.begin() + left,\n        arr.begin() + left + k\n    );\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15,
        16,
        17,
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> FindClosestElements(int[] arr, int k, int x) {\n    int left = 0;\n    int right = arr.Length - k;\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n\n        if (x - arr[mid] > arr[mid + k] - x) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    var result = new List<int>();\n    for (int i = left; i < left + k; i++) {\n        result.Add(arr[i]);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15,
        16,
        17,
        18,
        19
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findClosestElements(arr []int, k int, x int) []int {\n    left := 0\n    right := len(arr) - k\n\n    for left < right {\n        mid := left + (right - left) / 2\n\n        if x - arr[mid] > arr[mid + k] - x {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n\n    return arr[left : left + k]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findClosestElements(arr, k, x) {\n    let left = 0;\n    let right = arr.length - k;\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (x - arr[mid] > arr[mid + k] - x) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return arr.slice(left, left + k);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findClosestElements(arr: number[], k: number, x: number): number[] {\n    let left = 0;\n    let right = arr.length - k;\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (x - arr[mid] > arr[mid + k] - x) {\n            left = mid + 1;\n        } else {\n            right = mid;\n        }\n    }\n\n    return arr.slice(left, left + k);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "move_right": [
        9
      ],
      "move_left": [
        11
      ],
      "result": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "left_farther": [
        8
      ]
    }
  }
};

const FindKClosestElementsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 4,
      "x": 3
    }
  },
  {
    "id": "ex2",
    "label": "Left edge",
    "value": {
      "arr": [
        1,
        2,
        3,
        4,
        5
      ],
      "k": 2,
      "x": -1
    }
  },
  {
    "id": "ex3",
    "label": "Right edge",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        9
      ],
      "k": 3,
      "x": 10
    }
  },
  {
    "id": "ex4",
    "label": "Larger array",
    "value": {
      "arr": [
        1,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "k": 4,
      "x": 4
    }
  }
];

function generateFindKClosestElementsSteps(e: any): any[] {
  

let t=[...e.arr],i=e.k,a=e.x,l=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),n=new StepRecorder({},{...l,meta_x:{type:"metadata",value:a}});n.record("-",`Start: Find ${i} closest elements to x = ${a} in the sorted array`);let s=0,o=t.length-i;for(n.add_new_visual("ptr_left",{type:"pointer",position:s,label:"left"}),n.add_new_visual("ptr_right",{type:"pointer",position:o,label:"right"}),n.add_new_visual("range_window",{type:"range",start:s,end:s+i-1}),n.record("initialize",`Initialize left = 0, right = ${t.length} - ${i} = ${o}`);s<o;){n.add_conditional("while_loop",!0);let e=s+Math.floor((o-s)/2);n.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),n.update_visual("range_window",{type:"range",start:e,end:e+i-1}),n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"}),e+i<t.length&&n.update_visual(`elem_${e+i}`,{type:"arrayElement",value:t[e+i],position:e+i,state:"highlight"});let r=a-t[e],l=t[e+i]-a;if(n.add_new_visual("meta_comparison",{type:"metadata",value:`x - arr[${e}] = ${r}  vs  arr[${e+i}] - x = ${l}`}),n.record("calculate_mid",`mid = ${s} + (${o} - ${s}) / 2 = ${e}`),r>l){n.add_conditional("left_farther",!0),n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"}),e+i<t.length&&n.update_visual(`elem_${e+i}`,{type:"arrayElement",value:t[e+i],position:e+i,state:void 0}),s=e+1,n.update_visual("ptr_left",{type:"pointer",position:s,label:"left"}),n.delete_visual("ptr_mid");for(let e=0;e<s;e++)n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});n.update_visual("range_window",{type:"range",start:s,end:s+i-1}),n.delete_visual("meta_comparison"),n.record("move_right",`x - arr[${e}] (${r}) > arr[${e+i}] - x (${l}), move left to ${s}`)}else{n.add_conditional("left_farther",!1),n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:void 0}),e+i<t.length&&n.update_visual(`elem_${e+i}`,{type:"arrayElement",value:t[e+i],position:e+i,state:"inactive"}),o=e,n.update_visual("ptr_right",{type:"pointer",position:o,label:"right"}),n.delete_visual("ptr_mid");for(let e=o+i;e<t.length;e++)n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});n.update_visual("range_window",{type:"range",start:o,end:o+i-1}),n.delete_visual("meta_comparison"),n.record("move_left",`x - arr[${e}] (${r}) <= arr[${e+i}] - x (${l}), move right to ${o}`)}}n.add_conditional("while_loop",!1),n.delete_visual("ptr_left"),n.delete_visual("ptr_right"),n.get_visual("ptr_mid")&&n.delete_visual("ptr_mid"),n.delete_visual("meta_comparison"),n.update_visual("range_window",{type:"range",start:s,end:s+i-1});for(let e=0;e<t.length;e++){let r=e>=s&&e<s+i;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:r?"active":"inactive"})}let d=t.slice(s,s+i);return n.record("result",`Result: [${d.join(", ")}], the ${i} closest elements to x = ${a}`),n.getSteps()
}

export function FindKClosestElementsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindKClosestElementsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindKClosestElementsSteps(e) as any[];
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
      title="Find K Closest Elements"
      slug="find-k-closest-elements"
      approaches={approaches}
      presets={FindKClosestElementsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find K-th Smallest Pair Distance (find-k-th-smallest-pair-distance)
// ==========================================

const FindKThSmallestPairDistanceTemplates = {
  "python": {
    "language": "python",
    "code": "def smallestDistancePair(nums, k):\n    nums.sort()\n    n = len(nums)\n    low = 0\n    high = nums[n - 1] - nums[0]\n\n    while low < high:\n        mid = low + (high - low) // 2\n        count = 0\n        left = 0\n\n        for right in range(n):\n            while nums[right] - nums[left] > mid:\n                left += 1\n            count += right - left\n\n        if count >= k:\n            high = mid\n        else:\n            low = mid + 1\n\n    return low",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        15
      ],
      "shrink_high": [
        18
      ],
      "increase_low": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        17
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int smallestDistancePair(int[] nums, int k) {\n    Arrays.sort(nums);\n    int n = nums.length;\n    int low = 0;\n    int high = nums[n - 1] - nums[0];\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 0;\n        int left = 0;\n\n        for (int right = 0; right < n; right++) {\n            while (nums[right] - nums[left] > mid) {\n                left++;\n            }\n            count += right - left;\n        }\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int smallestDistancePair(vector<int>& nums, int k) {\n    sort(nums.begin(), nums.end());\n    int n = nums.size();\n    int low = 0;\n    int high = nums[n - 1] - nums[0];\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 0;\n        int left = 0;\n\n        for (int right = 0; right < n; right++) {\n            while (nums[right] - nums[left] > mid) {\n                left++;\n            }\n            count += right - left;\n        }\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SmallestDistancePair(int[] nums, int k) {\n    Array.Sort(nums);\n    int n = nums.Length;\n    int low = 0;\n    int high = nums[n - 1] - nums[0];\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 0;\n        int left = 0;\n\n        for (int right = 0; right < n; right++) {\n            while (nums[right] - nums[left] > mid) {\n                left++;\n            }\n            count += right - left;\n        }\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func smallestDistancePair(nums []int, k int) int {\n    sort.Ints(nums)\n    n := len(nums)\n    low := 0\n    high := nums[n-1] - nums[0]\n\n    for low < high {\n        mid := low + (high-low)/2\n        count := 0\n        left := 0\n\n        for right := 0; right < n; right++ {\n            for nums[right]-nums[left] > mid {\n                left++\n            }\n            count += right - left\n        }\n\n        if count >= k {\n            high = mid\n        } else {\n            low = mid + 1\n        }\n    }\n\n    return low\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function smallestDistancePair(nums, k) {\n    nums.sort((a, b) => a - b);\n    const n = nums.length;\n    let low = 0;\n    let high = nums[n - 1] - nums[0];\n\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let count = 0;\n        let left = 0;\n\n        for (let right = 0; right < n; right++) {\n            while (nums[right] - nums[left] > mid) {\n                left++;\n            }\n            count += right - left;\n        }\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function smallestDistancePair(nums: number[], k: number): number {\n    nums.sort((a, b) => a - b);\n    const n = nums.length;\n    let low = 0;\n    let high = nums[n - 1] - nums[0];\n\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let count = 0;\n        let left = 0;\n\n        for (let right = 0; right < n; right++) {\n            while (nums[right] - nums[left] > mid) {\n                left++;\n            }\n            count += right - left;\n        }\n\n        if (count >= k) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "sort": [
        2
      ],
      "init_bounds": [
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "init_count": [
        9,
        10
      ],
      "for_right": [
        12
      ],
      "advance_left": [
        13,
        14
      ],
      "add_pairs": [
        16
      ],
      "shrink_high": [
        20
      ],
      "increase_low": [
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_low_high": [
        7
      ],
      "while_dist": [
        13
      ],
      "count_ge_k": [
        19
      ]
    }
  }
};

const FindKThSmallestPairDistancePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        3,
        1
      ],
      "k": 1
    }
  },
  {
    "id": "ex2",
    "label": "All same",
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
    "id": "ex3",
    "label": "Example 2",
    "value": {
      "nums": [
        1,
        6,
        1
      ],
      "k": 3
    }
  },
  {
    "id": "ex4",
    "label": "Sorted 4",
    "value": {
      "nums": [
        1,
        3,
        5,
        7
      ],
      "k": 3
    }
  },
  {
    "id": "ex5",
    "label": "5 elements",
    "value": {
      "nums": [
        2,
        4,
        7,
        9,
        10
      ],
      "k": 5
    }
  }
];

function generateFindKThSmallestPairDistanceSteps(t: any): any[] {
  

let e=[...t.nums].sort((t,e)=>t-e),i=t.k,a=e.length,s=e.reduce((t,e,i)=>(t[`elem_${i}`]={type:"arrayElement",value:e,position:i},t),{}),l=new StepRecorder({nums:e,k:i,low:void 0,high:void 0,mid:void 0,count:void 0,left:void 0},{...s,meta_info:{type:"metadata",value:`k = ${i}`}});l.record("-",`Start: Find the ${i}-th smallest pair distance in sorted array`),l.record("sort",`Sort array: [${e.join(", ")}]`);let r=0,o=e[a-1]-e[0];for(l.update_variable("low",r),l.update_variable("high",o),l.update_visual("meta_info",{type:"metadata",value:`k = ${i}, Search range: [${r}, ${o}]`}),l.record("init_bounds",`Initialize low = 0, high = ${e[a-1]} - ${e[0]} = ${o}`);r<o;){l.add_conditional("while_low_high",!0);let t=r+Math.floor((o-r)/2);l.update_variable("mid",t),l.update_visual("meta_info",{type:"metadata",value:`k = ${i}, Testing distance mid = ${t}`}),l.record("calc_mid",`Calculate mid = ${r} + floor((${o} - ${r}) / 2) = ${t}`);let n=0,s=0;l.update_variable("count",n),l.update_variable("left",s),l.add_new_visual("ptr_left",{type:"pointer",position:s,label:"left"}),l.record("init_count",`Count pairs with distance <= ${t}: count = 0, left = 0`);for(let r=0;r<a;r++){for(let t=0;t<a;t++)t===r?l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"highlight"}):t>=s&&t<r?l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"active"}):l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t});for(l.add_new_visual("ptr_right",{type:"pointer",position:r,label:"right"}),l.record("for_right",`right = ${r}, nums[right] = ${e[r]}`);e[r]-e[s]>t;)l.add_conditional("while_dist",!0),l.update_visual(`elem_${s}`,{type:"arrayElement",value:e[s],position:s,state:"inactive"}),s++,l.update_variable("left",s),l.update_visual("ptr_left",{type:"pointer",position:s,label:"left"}),l.record("advance_left",`nums[${r}] - nums[${s-1}] = ${e[r]-e[s-1]} > ${t}, advance left to ${s}`);e[r]-e[s]<=t&&l.add_conditional("while_dist",!1);let o=r-s;n+=o,l.update_variable("count",n);for(let t=0;t<a;t++)t===r?l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"highlight"}):t>=s&&t<r?l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:"active"}):l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t,state:t<s?"inactive":void 0});l.update_visual("meta_info",{type:"metadata",value:`k = ${i}, mid = ${t}, count = ${n}`}),l.record("add_pairs",`Pairs ending at right: ${r} - ${s} = ${o}. Total count = ${n}`),l.delete_visual("ptr_right")}l.delete_visual("ptr_left");for(let t=0;t<a;t++)l.update_visual(`elem_${t}`,{type:"arrayElement",value:e[t],position:t});n>=i?(l.add_conditional("count_ge_k",!0),o=t,l.update_variable("high",o),l.update_visual("meta_info",{type:"metadata",value:`k = ${i}, count ${n} >= k, high = ${o}`}),l.record("shrink_high",`count (${n}) >= k (${i}), set high = mid = ${t}`)):(l.add_conditional("count_ge_k",!1),r=t+1,l.update_variable("low",r),l.update_visual("meta_info",{type:"metadata",value:`k = ${i}, count ${n} < k, low = ${r}`}),l.record("increase_low",`count (${n}) < k (${i}), set low = mid + 1 = ${r}`))}return l.add_conditional("while_low_high",!1),l.update_visual("meta_info",{type:"metadata",value:`Answer: ${r}`}),l.record("complete",`low == high == ${r}. The ${i}-th smallest pair distance is ${r}`),l.getSteps()
}

export function FindKThSmallestPairDistanceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindKThSmallestPairDistanceTemplates,
      generateSteps: (t: any) => {
        const recorded = generateFindKThSmallestPairDistanceSteps(t) as any[];
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
      title="Find K-th Smallest Pair Distance"
      slug="find-k-th-smallest-pair-distance"
      approaches={approaches}
      presets={FindKThSmallestPairDistancePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find Smallest Letter Greater Than Target (find-smallest-letter-greater-than-target)
// ==========================================

const FindSmallestLetterGreaterThanTargetTemplates = {
  "python": {
    "language": "python",
    "code": "def nextGreatestLetter(letters, target):\n    left = 0\n    right = len(letters) - 1\n    result = 0\n\n    while left <= right:\n        mid = left + (right - left) // 2\n\n        if letters[mid] > target:\n            result = mid\n            right = mid - 1\n        else:\n            left = mid + 1\n\n    return letters[result]",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public char nextGreatestLetter(char[] letters, char target) {\n    int left = 0;\n    int right = letters.length - 1;\n    int result = 0;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (letters[mid] > target) {\n            result = mid;\n            right = mid - 1;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return letters[result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "char nextGreatestLetter(vector<char>& letters, char target) {\n    int left = 0;\n    int right = letters.size() - 1;\n    int result = 0;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (letters[mid] > target) {\n            result = mid;\n            right = mid - 1;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return letters[result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public char NextGreatestLetter(char[] letters, char target) {\n    int left = 0;\n    int right = letters.Length - 1;\n    int result = 0;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (letters[mid] > target) {\n            result = mid;\n            right = mid - 1;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return letters[result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func nextGreatestLetter(letters []byte, target byte) byte {\n    left := 0\n    right := len(letters) - 1\n    result := 0\n\n    for left <= right {\n        mid := left + (right - left) / 2\n\n        if letters[mid] > target {\n            result = mid\n            right = mid - 1\n        } else {\n            left = mid + 1\n        }\n    }\n\n    return letters[result]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function nextGreatestLetter(letters, target) {\n    let left = 0;\n    let right = letters.length - 1;\n    let result = 0;\n\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (letters[mid] > target) {\n            result = mid;\n            right = mid - 1;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return letters[result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function nextGreatestLetter(letters: string[], target: string): string {\n    let left = 0;\n    let right = letters.length - 1;\n    let result = 0;\n\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n\n        if (letters[mid] > target) {\n            result = mid;\n            right = mid - 1;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return letters[result];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "calculate_mid": [
        7
      ],
      "found_candidate": [
        9,
        10
      ],
      "search_left": [
        11
      ],
      "search_right": [
        13
      ],
      "return_result": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "mid_greater_than_target": [
        9
      ]
    }
  }
};

const FindSmallestLetterGreaterThanTargetPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "letters": [
        "c",
        "f",
        "j"
      ],
      "target": "a"
    }
  },
  {
    "id": "ex2",
    "label": "Wrap around",
    "value": {
      "letters": [
        "c",
        "f",
        "j"
      ],
      "target": "j"
    }
  },
  {
    "id": "ex3",
    "label": "Middle",
    "value": {
      "letters": [
        "a",
        "b",
        "d",
        "f",
        "h"
      ],
      "target": "d"
    }
  },
  {
    "id": "ex4",
    "label": "All same",
    "value": {
      "letters": [
        "c",
        "c",
        "c"
      ],
      "target": "a"
    }
  }
];

function generateFindSmallestLetterGreaterThanTargetSteps(e: any): any[] {
  

let t=[...e.letters],r=e.target,i=t.reduce((e,t,r)=>(e[`elem_${r}`]={type:"arrayElement",value:`'${t}'`,position:r},e),{}),n=new StepRecorder({},{...i,meta_target:{type:"metadata",value:r}});n.record("-",`Start: Find smallest letter greater than target '${r}'`);let a=0,s=t.length-1,o=0;for(n.add_new_visual("ptr_left",{type:"pointer",position:a,label:"left"}),n.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"}),n.add_new_visual("ptr_result",{type:"pointer",position:o,label:"result"}),n.record("initialize",`Initialize left = 0, right = ${s}, result = 0`);a<=s;){n.add_conditional("while_loop",!0);let e=a+Math.floor((s-a)/2);if(n.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),n.record("calculate_mid",`Calculate mid = ${e}, letters[mid] = '${t[e]}'`),t[e]>r){n.add_conditional("mid_greater_than_target",!0),o=e,n.update_visual(`elem_${e}`,{type:"arrayElement",value:`'${t[e]}'`,position:e,state:"active"}),n.update_visual("ptr_result",{type:"pointer",position:o,label:"result"}),n.record("found_candidate",`letters[mid] '${t[e]}' > target '${r}'. Save result = ${e}, search left`),s=e-1,n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let r=e>=a&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:`'${t[e]}'`,position:e,state:r?void 0:e===o?"active":"inactive"})}n.delete_visual("ptr_mid"),n.record("search_left",`Search left: right = ${s}`)}else{n.add_conditional("mid_greater_than_target",!1),a=e+1,n.update_visual("ptr_left",{type:"pointer",position:a,label:"left"});for(let e=0;e<t.length;e++){let r=e>=a&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:`'${t[e]}'`,position:e,state:r?void 0:e===o?"active":"inactive"})}n.delete_visual("ptr_mid"),n.record("search_right",`letters[mid] '${t[e]}' <= target '${r}'. Search right: left = ${a}`)}}n.add_conditional("while_loop",!1);for(let e=0;e<t.length;e++)n.update_visual(`elem_${e}`,{type:"arrayElement",value:`'${t[e]}'`,position:e,state:e===o?"active":"inactive"});return n.delete_visual("ptr_left"),n.delete_visual("ptr_right"),n.update_visual("ptr_result",{type:"pointer",position:o,label:"result"}),n.record("return_result",`Return letters[${o}] = '${t[o]}'`),n.getSteps()
}

export function FindSmallestLetterGreaterThanTargetProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindSmallestLetterGreaterThanTargetTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindSmallestLetterGreaterThanTargetSteps(e) as any[];
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
      title="Find Smallest Letter Greater Than Target"
      slug="find-smallest-letter-greater-than-target"
      approaches={approaches}
      presets={FindSmallestLetterGreaterThanTargetPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// First Bad Version (first-bad-version)
// ==========================================

const FirstBadVersionTemplates = {
  "python": {
    "language": "python",
    "code": "def firstBadVersion(n):\n    low = 1\n    high = n\n    while low < high:\n        mid = low + (high - low) // 2\n        if isBadVersion(mid):\n            high = mid\n        else:\n            low = mid + 1\n    return low",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        10
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int firstBadVersion(int n) {\n    int low = 1;\n    int high = n;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (isBadVersion(mid)) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int firstBadVersion(int n) {\n    int low = 1;\n    int high = n;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (isBadVersion(mid)) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FirstBadVersion(int n) {\n    int low = 1;\n    int high = n;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (IsBadVersion(mid)) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func firstBadVersion(n int) int {\n    low := 1\n    high := n\n    for low < high {\n        mid := low + (high - low) / 2\n        if isBadVersion(mid) {\n            high = mid\n        } else {\n            low = mid + 1\n        }\n    }\n    return low\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function firstBadVersion(n) {\n    let low = 1;\n    let high = n;\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        if (isBadVersion(mid)) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function firstBadVersion(n: number): number {\n    let low = 1;\n    let high = n;\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        if (isBadVersion(mid)) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5
      ],
      "check_bad": [
        6
      ],
      "move_high": [
        7
      ],
      "move_low": [
        9
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "is_bad": [
        6
      ]
    }
  }
};

const FirstBadVersionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "n": 8,
      "firstBad": 5
    }
  },
  {
    "id": "ex2",
    "label": "First is bad",
    "value": {
      "n": 6,
      "firstBad": 1
    }
  },
  {
    "id": "ex3",
    "label": "Last is bad",
    "value": {
      "n": 7,
      "firstBad": 7
    }
  },
  {
    "id": "ex4",
    "label": "Small",
    "value": {
      "n": 3,
      "firstBad": 2
    }
  }
];

function generateFirstBadVersionSteps(e: any): any[] {
  

let t=e.n,i=e.firstBad,l=e=>e>=i,r={};for(let e=0;e<t;e++)r[`elem_${e}`]={type:"arrayElement",value:e+1,position:e};let a=new StepRecorder({n:t,firstBad:i,low:void 0,high:void 0,mid:void 0},{...r});a.record("-",`Start: Find the first bad version among versions 1 to ${t}`);let o=1,s=t;for(a.update_variable("low",o),a.update_variable("high",s),a.add_new_visual("ptr_low",{type:"pointer",position:o-1,label:"low"}),a.add_new_visual("ptr_high",{type:"pointer",position:s-1,label:"high"}),a.record("initialize",`Initialize low = 1, high = ${t}`);o<s;){a.add_conditional("while_loop",!0);let e=o+Math.floor((s-o)/2);a.update_variable("mid",e),a.add_new_visual("ptr_mid",{type:"pointer",position:e-1,label:"mid"}),a.update_visual(`elem_${e-1}`,{type:"arrayElement",value:e,position:e-1,state:"highlight"}),a.record("calculate_mid",`Calculate mid = ${e}`);let i=l(e);if(a.add_conditional("is_bad",i),a.record("check_bad",`isBadVersion(${e}) = ${i}`),i){s=e,a.update_variable("high",s),a.update_visual("ptr_high",{type:"pointer",position:s-1,label:"high"});for(let e=0;e<t;e++){let t=e+1,i=t>=o&&t<=s;a.update_visual(`elem_${e}`,{type:"arrayElement",value:t,position:e,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("move_high",`isBadVersion(${e}) = true. Set high = ${s}`)}else{o=e+1,a.update_variable("low",o),a.update_visual("ptr_low",{type:"pointer",position:o-1,label:"low"});for(let e=0;e<t;e++){let t=e+1,i=t>=o&&t<=s;a.update_visual(`elem_${e}`,{type:"arrayElement",value:t,position:e,state:i?void 0:"inactive"})}a.delete_visual("ptr_mid"),a.record("move_low",`isBadVersion(${e}) = false. Set low = ${o}`)}}a.add_conditional("while_loop",!1);for(let e=0;e<t;e++){let t=e+1;a.update_visual(`elem_${e}`,{type:"arrayElement",value:t,position:e,state:t===o?"active":"inactive"})}return a.delete_visual("ptr_high"),a.delete_visual("ptr_low"),a.add_new_visual("ptr_result",{type:"pointer",position:o-1,label:"result"}),a.record("found",`First bad version is ${o}`),a.getSteps()
}

export function FirstBadVersionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FirstBadVersionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFirstBadVersionSteps(e) as any[];
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
      title="First Bad Version"
      slug="first-bad-version"
      approaches={approaches}
      presets={FirstBadVersionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Guess Number Higher or Lower (guess-number-higher-or-lower)
// ==========================================

const GuessNumberHigherOrLowerTemplates = {
  "python": {
    "language": "python",
    "code": "def guessNumber(n):\n    low = 1\n    high = n\n\n    while low <= high:\n        mid = low + (high - low) // 2\n        result = guess(mid)\n\n        if result == 0:\n            return mid\n        elif result == -1:\n            high = mid - 1\n        else:\n            low = mid + 1\n\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int guessNumber(int n) {\n    int low = 1;\n    int high = n;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int result = guess(mid);\n\n        if (result == 0) {\n            return mid;\n        } else if (result == -1) {\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int guessNumber(int n) {\n    int low = 1;\n    int high = n;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int result = guess(mid);\n\n        if (result == 0) {\n            return mid;\n        } else if (result == -1) {\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int GuessNumber(int n) {\n    int low = 1;\n    int high = n;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int result = guess(mid);\n\n        if (result == 0) {\n            return mid;\n        } else if (result == -1) {\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func guessNumber(n int) int {\n    low := 1\n    high := n\n\n    for low <= high {\n        mid := low + (high - low) / 2\n        result := guess(mid)\n\n        if result == 0 {\n            return mid\n        } else if result == -1 {\n            high = mid - 1\n        } else {\n            low = mid + 1\n        }\n    }\n\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function guessNumber(n) {\n    let low = 1;\n    let high = n;\n\n    while (low <= high) {\n        const mid = low + Math.floor((high - low) / 2);\n        const result = guess(mid);\n\n        if (result === 0) {\n            return mid;\n        } else if (result === -1) {\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function guessNumber(n: number): number {\n    let low = 1;\n    let high = n;\n\n    while (low <= high) {\n        const mid = low + Math.floor((high - low) / 2);\n        const result = guess(mid);\n\n        if (result === 0) {\n            return mid;\n        } else if (result === -1) {\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "guess_result": [
        7
      ],
      "found": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "guess_zero": [
        9
      ],
      "guess_negative": [
        11
      ]
    }
  }
};

const GuessNumberHigherOrLowerPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "n": 10,
      "pick": 6
    }
  },
  {
    "id": "ex2",
    "label": "Pick is 1",
    "value": {
      "n": 8,
      "pick": 1
    }
  },
  {
    "id": "ex3",
    "label": "Pick is n",
    "value": {
      "n": 7,
      "pick": 7
    }
  },
  {
    "id": "ex4",
    "label": "Small range",
    "value": {
      "n": 3,
      "pick": 2
    }
  }
];

function generateGuessNumberHigherOrLowerSteps(e: any): any[] {
  

let t=e.n,i=e.pick,r={};for(let e=0;e<t;e++)r[`elem_${e}`]={type:"arrayElement",value:e+1,position:e};let l=new StepRecorder({n:t,pick:i,low:void 0,high:void 0,mid:void 0,result:void 0},{...r});l.record("-",`Start: Guess the number picked between 1 and ${t}`);let a=0,s=t-1;for(l.update_variable("low",a+1),l.update_variable("high",s+1),l.add_new_visual("ptr_low",{type:"pointer",position:a,label:"low"}),l.add_new_visual("ptr_high",{type:"pointer",position:s,label:"high"}),l.record("initialize",`Initialize low = 1, high = ${t}`);a<=s;){l.add_conditional("while_loop",!0);let e=Math.floor(a+(s-a)/2),n=e+1;l.update_variable("mid",n),l.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),l.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"highlight"}),l.record("calculate_mid",`Calculate mid = ${n}`);let r=n===i?0:n>i?-1:1,o="";if(o=0===r?"Correct!":-1===r?"Too high!":"Too low!",l.add_new_visual("meta_guess",{type:"metadata",value:o}),l.record("guess_result",`guess(${n}) = ${r}. ${o}`),0===r)return l.add_conditional("guess_zero",!0),l.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"active"}),l.update_variable("result",n),l.delete_visual("ptr_mid"),l.delete_visual("ptr_low"),l.delete_visual("ptr_high"),l.record("found",`guess(${n}) = 0. Found the number: ${n}`),l.getSteps();if(l.add_conditional("guess_zero",!1),-1===r){l.add_conditional("guess_negative",!0),s=e-1,l.update_variable("high",s+1),l.update_visual("ptr_high",{type:"pointer",position:s,label:"high"});for(let e=0;e<t;e++){let t=e>=a&&e<=s;l.update_visual(`elem_${e}`,{type:"arrayElement",value:e+1,position:e,state:t?void 0:"inactive"})}l.delete_visual("ptr_mid"),l.record("search_left",`guess(${n}) = -1. Pick is lower. high = ${s+1}`)}else{l.add_conditional("guess_negative",!1),a=e+1,l.update_variable("low",a+1),l.update_visual("ptr_low",{type:"pointer",position:a,label:"low"});for(let e=0;e<t;e++){let t=e>=a&&e<=s;l.update_visual(`elem_${e}`,{type:"arrayElement",value:e+1,position:e,state:t?void 0:"inactive"})}l.delete_visual("ptr_mid"),l.record("search_right",`guess(${n}) = 1. Pick is higher. low = ${a+1}`)}}return l.add_conditional("while_loop",!1),l.update_variable("result",-1),l.record("complete","Number not found (should not happen with valid input)"),l.getSteps()
}

export function GuessNumberHigherOrLowerProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GuessNumberHigherOrLowerTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGuessNumberHigherOrLowerSteps(e) as any[];
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
      title="Guess Number Higher or Lower"
      slug="guess-number-higher-or-lower"
      approaches={approaches}
      presets={GuessNumberHigherOrLowerPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Koko Eating Bananas (koko-eating-bananas)
// ==========================================

const KokoEatingBananasTemplates = {
  "python": {
    "language": "python",
    "code": "def minEatingSpeed(piles, h):\n    left = 1\n    right = max(piles)\n\n    while left < right:\n        mid = left + (right - left) // 2\n        total_hours = 0\n\n        for pile in piles:\n            total_hours += (pile + mid - 1) // mid\n\n        if total_hours <= h:\n            right = mid\n        else:\n            left = mid + 1\n\n    return left",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "calculate_hours": [
        9,
        10
      ],
      "feasible_yes": [
        12,
        13
      ],
      "feasible_no": [
        14,
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "feasible": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int minEatingSpeed(int[] piles, int h) {\n    int left = 1;\n    int right = 0;\n    for (int pile : piles) {\n        right = Math.max(right, pile);\n    }\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        long totalHours = 0;\n\n        for (int pile : piles) {\n            totalHours += (pile + mid - 1) / mid;\n        }\n\n        if (totalHours <= h) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
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
      "calculate_mid": [
        9
      ],
      "calculate_hours": [
        12,
        13,
        14
      ],
      "feasible_yes": [
        16,
        17
      ],
      "feasible_no": [
        18,
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "feasible": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int minEatingSpeed(vector<int>& piles, int h) {\n    int left = 1;\n    int right = *max_element(piles.begin(), piles.end());\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        long totalHours = 0;\n\n        for (int pile : piles) {\n            totalHours += (pile + mid - 1) / mid;\n        }\n\n        if (totalHours <= h) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "calculate_hours": [
        9,
        10,
        11
      ],
      "feasible_yes": [
        13,
        14
      ],
      "feasible_no": [
        15,
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "feasible": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MinEatingSpeed(int[] piles, int h) {\n    int left = 1;\n    int right = piles.Max();\n\n    while (left < right) {\n        int mid = left + (right - left) / 2;\n        long totalHours = 0;\n\n        foreach (int pile in piles) {\n            totalHours += (pile + mid - 1) / mid;\n        }\n\n        if (totalHours <= h) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "calculate_hours": [
        9,
        10,
        11
      ],
      "feasible_yes": [
        13,
        14
      ],
      "feasible_no": [
        15,
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "feasible": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minEatingSpeed(piles []int, h int) int {\n    left := 1\n    right := 0\n    for _, pile := range piles {\n        if pile > right {\n            right = pile\n        }\n    }\n\n    for left < right {\n        mid := left + (right - left) / 2\n        totalHours := 0\n\n        for _, pile := range piles {\n            totalHours += (pile + mid - 1) / mid\n        }\n\n        if totalHours <= h {\n            right = mid\n        } else {\n            left = mid + 1\n        }\n    }\n\n    return left\n}",
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
        7,
        8
      ],
      "calculate_mid": [
        11
      ],
      "calculate_hours": [
        14,
        15,
        16
      ],
      "feasible_yes": [
        18,
        19
      ],
      "feasible_no": [
        20,
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "feasible": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minEatingSpeed(piles, h) {\n    let left = 1;\n    let right = Math.max(...piles);\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        let totalHours = 0;\n\n        for (const pile of piles) {\n            totalHours += Math.ceil(pile / mid);\n        }\n\n        if (totalHours <= h) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "calculate_hours": [
        9,
        10,
        11
      ],
      "feasible_yes": [
        13,
        14
      ],
      "feasible_no": [
        15,
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "feasible": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minEatingSpeed(piles: number[], h: number): number {\n    let left = 1;\n    let right = Math.max(...piles);\n\n    while (left < right) {\n        const mid = Math.floor(left + (right - left) / 2);\n        let totalHours = 0;\n\n        for (const pile of piles) {\n            totalHours += Math.ceil(pile / mid);\n        }\n\n        if (totalHours <= h) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "calculate_hours": [
        9,
        10,
        11
      ],
      "feasible_yes": [
        13,
        14
      ],
      "feasible_no": [
        15,
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "feasible": [
        13
      ]
    }
  }
};

const KokoEatingBananasPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "piles": [
        3,
        6,
        7,
        11
      ],
      "h": 8
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "piles": [
        30,
        11,
        23,
        4,
        20
      ],
      "h": 5
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "piles": [
        30,
        11,
        23,
        4,
        20
      ],
      "h": 6
    }
  },
  {
    "id": "ex4",
    "label": "Min speed",
    "value": {
      "piles": [
        1,
        1,
        1,
        1
      ],
      "h": 4
    }
  },
  {
    "id": "ex5",
    "label": "Small piles",
    "value": {
      "piles": [
        2,
        3,
        5,
        8
      ],
      "h": 10
    }
  }
];

function generateKokoEatingBananasSteps(e: any): any[] {
  

let t=[...e.piles],a=e.h,l=t.reduce((e,t,a)=>(e[`pile_${a}`]={type:"arrayElement",value:t,position:a},e),{}),n=new StepRecorder({piles:t,h:a,left:void 0,right:void 0,mid:void 0,totalHours:void 0},{...l,meta_info:{type:"metadata",value:`h = ${a}`}});n.record("-",`Start: Find minimum eating speed k for ${t.length} piles with h = ${a} hours`);let r=1,o=Math.max(...t);for(n.update_variable("left",r),n.update_variable("right",o),n.update_visual("meta_range",{type:"metadata",value:`Search range: [${r}, ${o}]`}),n.record("initialize",`Initialize left = 1, right = max(piles) = ${o}`);r<o;){n.add_conditional("while_loop",!0);let e=Math.floor(r+(o-r)/2);n.update_variable("mid",e),n.update_visual("meta_range",{type:"metadata",value:`Search range: [${r}, ${o}], speed = ${e}`});for(let e=0;e<t.length;e++)n.delete_visual(`hours_${e}`);n.delete_visual("meta_total"),n.record("calculate_mid",`Calculate mid speed = ${e}`);let i=0;for(let a=0;a<t.length;a++){let l=Math.ceil(t[a]/e);i+=l;for(let e=0;e<t.length;e++)e===a?(n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),n.update_visual(`hours_${e}`,{type:"metadata",value:`${l}h`})):e<a?n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"}):n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e});n.update_variable("totalHours",i),n.update_visual("meta_total",{type:"metadata",value:`totalHours = ${i}`}),n.record("calculate_hours",`Pile ${a}: ceil(${t[a]} / ${e}) = ${l} hours. Total = ${i}`)}if(i<=a){n.add_conditional("feasible",!0);for(let e=0;e<t.length;e++)n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});n.update_visual("meta_total",{type:"metadata",value:`totalHours = ${i} <= h = ${a} ✓`}),n.record("feasible_yes",`totalHours (${i}) <= h (${a}). Speed ${e} works! Set right = ${e}`),o=e,n.update_variable("right",o)}else{n.add_conditional("feasible",!1);for(let e=0;e<t.length;e++)n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});n.update_visual("meta_total",{type:"metadata",value:`totalHours = ${i} > h = ${a} ✗`}),n.record("feasible_no",`totalHours (${i}) > h (${a}). Too slow! Set left = ${e+1}`),r=e+1,n.update_variable("left",r)}for(let e=0;e<t.length;e++)n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e}),n.delete_visual(`hours_${e}`);n.delete_visual("meta_total"),n.update_visual("meta_range",{type:"metadata",value:`Search range: [${r}, ${o}]`})}n.add_conditional("while_loop",!1);for(let e=0;e<t.length;e++){let a=Math.ceil(t[e]/r);n.update_visual(`pile_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),n.update_visual(`hours_${e}`,{type:"metadata",value:`${a}h`})}let s=t.reduce((e,t)=>e+Math.ceil(t/r),0);return n.update_visual("meta_range",{type:"metadata",value:`Minimum speed = ${r}`}),n.update_visual("meta_total",{type:"metadata",value:`totalHours = ${s} <= h = ${a} ✓`}),n.record("complete",`Minimum eating speed is ${r} bananas/hour`),n.getSteps()
}

export function KokoEatingBananasProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KokoEatingBananasTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKokoEatingBananasSteps(e) as any[];
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
      title="Koko Eating Bananas"
      slug="koko-eating-bananas"
      approaches={approaches}
      presets={KokoEatingBananasPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Magnetic Force Between Two Balls (magnetic-force-between-two-balls)
// ==========================================

const MagneticForceBetweenTwoBallsTemplates = {
  "python": {
    "language": "python",
    "code": "def maxDistance(position, m):\n    position.sort()\n    low = 1\n    high = position[-1] - position[0]\n    result = 1\n\n    while low <= high:\n        mid = low + (high - low) // 2\n        count = 1\n        last_placed = position[0]\n\n        for i in range(1, len(position)):\n            if position[i] - last_placed >= mid:\n                count += 1\n                last_placed = position[i]\n                if count == m:\n                    break\n\n        if count >= m:\n            result = mid\n            low = mid + 1\n        else:\n            high = mid - 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5
      ],
      "calc_mid": [
        8
      ],
      "place_first": [
        9,
        10
      ],
      "check_pos": [
        12
      ],
      "place_ball": [
        14,
        15
      ],
      "all_placed": [
        16,
        17
      ],
      "skip_pos": [
        12
      ],
      "not_enough": [
        12
      ],
      "update_low": [
        20,
        21
      ],
      "update_high": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_loop": [
        7
      ],
      "can_place": [
        13
      ],
      "enough_balls": [
        16
      ],
      "feasible": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxDistance(int[] position, int m) {\n    Arrays.sort(position);\n    int n = position.length;\n    int low = 1;\n    int high = position[n - 1] - position[0];\n    int result = 1;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int count = 1;\n        int lastPlaced = position[0];\n\n        for (int i = 1; i < n; i++) {\n            if (position[i] - lastPlaced >= mid) {\n                count++;\n                lastPlaced = position[i];\n                if (count == m) break;\n            }\n        }\n\n        if (count >= m) {\n            result = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        22,
        23
      ],
      "update_high": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxDistance(vector<int>& position, int m) {\n    sort(position.begin(), position.end());\n    int n = position.size();\n    int low = 1;\n    int high = position[n - 1] - position[0];\n    int result = 1;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int count = 1;\n        int lastPlaced = position[0];\n\n        for (int i = 1; i < n; i++) {\n            if (position[i] - lastPlaced >= mid) {\n                count++;\n                lastPlaced = position[i];\n                if (count == m) break;\n            }\n        }\n\n        if (count >= m) {\n            result = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        22,
        23
      ],
      "update_high": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxDistance(int[] position, int m) {\n    Array.Sort(position);\n    int n = position.Length;\n    int low = 1;\n    int high = position[n - 1] - position[0];\n    int result = 1;\n\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int count = 1;\n        int lastPlaced = position[0];\n\n        for (int i = 1; i < n; i++) {\n            if (position[i] - lastPlaced >= mid) {\n                count++;\n                lastPlaced = position[i];\n                if (count == m) break;\n            }\n        }\n\n        if (count >= m) {\n            result = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        22,
        23
      ],
      "update_high": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxDistance(position []int, m int) int {\n    sort.Ints(position)\n    n := len(position)\n    low := 1\n    high := position[n-1] - position[0]\n    result := 1\n\n    for low <= high {\n        mid := low + (high-low)/2\n        count := 1\n        lastPlaced := position[0]\n\n        for i := 1; i < n; i++ {\n            if position[i]-lastPlaced >= mid {\n                count++\n                lastPlaced = position[i]\n                if count == m {\n                    break\n                }\n            }\n        }\n\n        if count >= m {\n            result = mid\n            low = mid + 1\n        } else {\n            high = mid - 1\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17,
        18
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        24,
        25
      ],
      "update_high": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxDistance(position, m) {\n    position.sort((a, b) => a - b);\n    const n = position.length;\n    let low = 1;\n    let high = position[n - 1] - position[0];\n    let result = 1;\n\n    while (low <= high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let count = 1;\n        let lastPlaced = position[0];\n\n        for (let i = 1; i < n; i++) {\n            if (position[i] - lastPlaced >= mid) {\n                count++;\n                lastPlaced = position[i];\n                if (count === m) break;\n            }\n        }\n\n        if (count >= m) {\n            result = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        22,
        23
      ],
      "update_high": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxDistance(position: number[], m: number): number {\n    position.sort((a, b) => a - b);\n    const n = position.length;\n    let low = 1;\n    let high = position[n - 1] - position[0];\n    let result = 1;\n\n    while (low <= high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let count = 1;\n        let lastPlaced = position[0];\n\n        for (let i = 1; i < n; i++) {\n            if (position[i] - lastPlaced >= mid) {\n                count++;\n                lastPlaced = position[i];\n                if (count === m) break;\n            }\n        }\n\n        if (count >= m) {\n            result = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bs": [
        2,
        3,
        4,
        5,
        6
      ],
      "calc_mid": [
        9
      ],
      "place_first": [
        10,
        11
      ],
      "check_pos": [
        13
      ],
      "place_ball": [
        15,
        16
      ],
      "all_placed": [
        17
      ],
      "skip_pos": [
        13
      ],
      "not_enough": [
        13
      ],
      "update_low": [
        22,
        23
      ],
      "update_high": [
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "can_place": [
        14
      ],
      "enough_balls": [
        17
      ],
      "feasible": [
        21
      ]
    }
  }
};

const MagneticForceBetweenTwoBallsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "position": [
        1,
        2,
        3,
        4,
        7
      ],
      "m": 3
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "position": [
        5,
        4,
        3,
        2,
        1,
        1000000000
      ],
      "m": 2
    }
  },
  {
    "id": "ex3",
    "label": "Spread out",
    "value": {
      "position": [
        1,
        2,
        8,
        4,
        9
      ],
      "m": 3
    }
  },
  {
    "id": "ex4",
    "label": "Evenly spaced",
    "value": {
      "position": [
        1,
        3,
        5,
        7,
        9,
        11
      ],
      "m": 4
    }
  },
  {
    "id": "ex5",
    "label": "Multiples of 10",
    "value": {
      "position": [
        10,
        20,
        30,
        40,
        50
      ],
      "m": 3
    }
  }
];

function generateMagneticForceBetweenTwoBallsSteps(e: any): any[] {
  

let t=[...e.position].sort((e,t)=>e-t),i=e.m,n=t.length,o=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({position:t,m:i,low:void 0,high:void 0,mid:void 0,result:void 0,count:void 0,lastPlaced:void 0},{...o,meta_info:{type:"metadata",value:""}});l.record("-",`Sort positions: [${t.join(", ")}]. Place ${i} balls to maximize minimum distance.`);let s=1,r=t[n-1]-t[0],c=1;for(l.update_variable("low",s),l.update_variable("high",r),l.update_variable("result",c),l.update_visual("meta_info",{type:"metadata",value:`Binary search on answer: low=${s}, high=${r}`}),l.record("init_bs",`Initialize binary search: low = ${s}, high = ${r}, result = ${c}`);s<=r;){l.add_conditional("while_loop",!0);let e=s+Math.floor((r-s)/2);l.update_variable("mid",e),l.update_visual("meta_info",{type:"metadata",value:`Testing minimum distance: mid = ${e}`}),l.record("calc_mid",`Calculate mid = ${s} + (${r} - ${s}) / 2 = ${e}`);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});let a=1,o=t[0];l.update_variable("count",a),l.update_variable("lastPlaced",o),l.update_visual("elem_0",{type:"arrayElement",value:t[0],position:0,state:"active"}),l.update_visual("meta_info",{type:"metadata",value:`Place ball 1 at position ${t[0]}. count=${a}`}),l.record("place_first",`Place first ball at position[0] = ${t[0]}. count = ${a}`);let d=!1;for(let s=1;s<n;s++)if(l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"highlight"}),l.update_visual("meta_info",{type:"metadata",value:`Check position[${s}]=${t[s]}: distance from last=${t[s]-o}, need>=${e}`}),l.record("check_pos",`Check position[${s}] = ${t[s]}. Distance from last placed (${o}) = ${t[s]-o}`),t[s]-o>=e){l.add_conditional("can_place",!0);let n=t[s]-o;if(a++,o=t[s],l.update_variable("count",a),l.update_variable("lastPlaced",o),l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),l.update_visual("meta_info",{type:"metadata",value:`Distance ${n} >= ${e}. Place ball ${a} at ${t[s]}. count=${a}`}),l.record("place_ball",`Distance ${n} >= ${e}. Place ball ${a} at position ${t[s]}.`),a===i){d=!0,l.add_conditional("enough_balls",!0),l.update_visual("meta_info",{type:"metadata",value:`Placed all ${i} balls! Minimum distance ${e} is feasible.`}),l.record("all_placed",`All ${i} balls placed. Minimum distance ${e} is feasible.`);break}}else l.add_conditional("can_place",!1),l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"inactive"}),l.record("skip_pos",`Distance ${t[s]-o} < ${e}. Skip position ${t[s]}.`);!d&&a<i&&(l.add_conditional("enough_balls",!1),l.update_visual("meta_info",{type:"metadata",value:`Only placed ${a}/${i} balls. Distance ${e} too large.`}),l.record("not_enough",`Could only place ${a} out of ${i} balls. Distance ${e} is too large.`)),a>=i?(l.add_conditional("feasible",!0),c=e,s=e+1,l.update_variable("result",c),l.update_variable("low",s),l.update_visual("meta_info",{type:"metadata",value:`Feasible! result=${c}, search larger: low=${s}`}),l.record("update_low",`Feasible. Update result = ${c}, low = ${s}. Try larger distance.`)):(l.add_conditional("feasible",!1),r=e-1,l.update_variable("high",r),l.update_visual("meta_info",{type:"metadata",value:`Not feasible. Search smaller: high=${r}`}),l.record("update_high",`Not feasible. Update high = ${r}. Try smaller distance.`))}l.add_conditional("while_loop",!1);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});return l.update_visual("meta_info",{type:"metadata",value:`Maximum minimum distance = ${c}`}),l.record("complete",`Maximum minimum magnetic force = ${c}`),l.getSteps()
}

export function MagneticForceBetweenTwoBallsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MagneticForceBetweenTwoBallsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMagneticForceBetweenTwoBallsSteps(e) as any[];
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
      title="Magnetic Force Between Two Balls"
      slug="magnetic-force-between-two-balls"
      approaches={approaches}
      presets={MagneticForceBetweenTwoBallsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Minimum Number of Days to Make m Bouquets (minimum-number-of-days-to-make-m-bouquets)
// ==========================================

const MinimumNumberOfDaysToMakeMBouquetsTemplates = {
  "python": {
    "language": "python",
    "code": "def minDays(bloomDay, m, k):\n    n = len(bloomDay)\n    if m * k > n:\n        return -1\n    low = min(bloomDay)\n    high = max(bloomDay)\n\n    while low < high:\n        mid = low + (high - low) // 2\n        bouquets = 0\n        consecutive = 0\n        for bloom in bloomDay:\n            if bloom <= mid:\n                consecutive += 1\n                if consecutive == k:\n                    bouquets += 1\n                    consecutive = 0\n            else:\n                consecutive = 0\n        if bouquets >= m:\n            high = mid\n        else:\n            low = mid + 1\n\n    return low",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3,
        4
      ],
      "possible": [
        3
      ],
      "init_range": [
        5,
        6
      ],
      "calculate_mid": [
        9
      ],
      "start_scan": [
        10,
        11
      ],
      "bloom_yes": [
        13,
        14
      ],
      "bouquet_made": [
        15,
        16,
        17
      ],
      "bloom_no": [
        18,
        19
      ],
      "search_left": [
        20,
        21
      ],
      "search_right": [
        22,
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        8
      ],
      "bloom_check": [
        13
      ],
      "bouquet_formed": [
        15
      ],
      "enough_bouquets": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int minDays(int[] bloomDay, int m, int k) {\n    int n = bloomDay.length;\n    if ((long) m * k > n) return -1;\n    int low = Integer.MAX_VALUE;\n    int high = Integer.MIN_VALUE;\n    for (int day : bloomDay) {\n        low = Math.min(low, day);\n        high = Math.max(high, day);\n    }\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0;\n        int consecutive = 0;\n        for (int bloom : bloomDay) {\n            if (bloom <= mid) {\n                consecutive++;\n                if (consecutive == k) {\n                    bouquets++;\n                    consecutive = 0;\n                }\n            } else {\n                consecutive = 0;\n            }\n        }\n        if (bouquets >= m) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3
      ],
      "possible": [
        3
      ],
      "init_range": [
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "calculate_mid": [
        12
      ],
      "start_scan": [
        13,
        14
      ],
      "bloom_yes": [
        16,
        17
      ],
      "bouquet_made": [
        18,
        19,
        20
      ],
      "bloom_no": [
        22,
        23
      ],
      "search_left": [
        26,
        27
      ],
      "search_right": [
        28,
        29
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        11
      ],
      "bloom_check": [
        16
      ],
      "bouquet_formed": [
        18
      ],
      "enough_bouquets": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int minDays(vector<int>& bloomDay, int m, int k) {\n    int n = bloomDay.size();\n    if ((long long) m * k > n) return -1;\n    int low = *min_element(bloomDay.begin(), bloomDay.end());\n    int high = *max_element(bloomDay.begin(), bloomDay.end());\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0;\n        int consecutive = 0;\n        for (int bloom : bloomDay) {\n            if (bloom <= mid) {\n                consecutive++;\n                if (consecutive == k) {\n                    bouquets++;\n                    consecutive = 0;\n                }\n            } else {\n                consecutive = 0;\n            }\n        }\n        if (bouquets >= m) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3
      ],
      "possible": [
        3
      ],
      "init_range": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "start_scan": [
        9,
        10
      ],
      "bloom_yes": [
        12,
        13
      ],
      "bouquet_made": [
        14,
        15,
        16
      ],
      "bloom_no": [
        18,
        19
      ],
      "search_left": [
        22,
        23
      ],
      "search_right": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        7
      ],
      "bloom_check": [
        12
      ],
      "bouquet_formed": [
        14
      ],
      "enough_bouquets": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MinDays(int[] bloomDay, int m, int k) {\n    int n = bloomDay.Length;\n    if ((long) m * k > n) return -1;\n    int low = bloomDay.Min();\n    int high = bloomDay.Max();\n\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0;\n        int consecutive = 0;\n        foreach (int bloom in bloomDay) {\n            if (bloom <= mid) {\n                consecutive++;\n                if (consecutive == k) {\n                    bouquets++;\n                    consecutive = 0;\n                }\n            } else {\n                consecutive = 0;\n            }\n        }\n        if (bouquets >= m) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3
      ],
      "possible": [
        3
      ],
      "init_range": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "start_scan": [
        9,
        10
      ],
      "bloom_yes": [
        12,
        13
      ],
      "bouquet_made": [
        14,
        15,
        16
      ],
      "bloom_no": [
        18,
        19
      ],
      "search_left": [
        22,
        23
      ],
      "search_right": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        7
      ],
      "bloom_check": [
        12
      ],
      "bouquet_formed": [
        14
      ],
      "enough_bouquets": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minDays(bloomDay []int, m int, k int) int {\n    n := len(bloomDay)\n    if m * k > n {\n        return -1\n    }\n    low, high := bloomDay[0], bloomDay[0]\n    for _, d := range bloomDay {\n        if d < low { low = d }\n        if d > high { high = d }\n    }\n\n    for low < high {\n        mid := low + (high - low) / 2\n        bouquets := 0\n        consecutive := 0\n        for _, bloom := range bloomDay {\n            if bloom <= mid {\n                consecutive++\n                if consecutive == k {\n                    bouquets++\n                    consecutive = 0\n                }\n            } else {\n                consecutive = 0\n            }\n        }\n        if bouquets >= m {\n            high = mid\n        } else {\n            low = mid + 1\n        }\n    }\n\n    return low\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3,
        4
      ],
      "possible": [
        3
      ],
      "init_range": [
        6,
        7,
        8,
        9,
        10
      ],
      "calculate_mid": [
        13
      ],
      "start_scan": [
        14,
        15
      ],
      "bloom_yes": [
        17,
        18
      ],
      "bouquet_made": [
        19,
        20,
        21
      ],
      "bloom_no": [
        23,
        24
      ],
      "search_left": [
        27,
        28
      ],
      "search_right": [
        29,
        30
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        12
      ],
      "bloom_check": [
        17
      ],
      "bouquet_formed": [
        19
      ],
      "enough_bouquets": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function minDays(bloomDay, m, k) {\n    const n = bloomDay.length;\n    if (m * k > n) return -1;\n    let low = Math.min(...bloomDay);\n    let high = Math.max(...bloomDay);\n\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let bouquets = 0;\n        let consecutive = 0;\n        for (const bloom of bloomDay) {\n            if (bloom <= mid) {\n                consecutive++;\n                if (consecutive === k) {\n                    bouquets++;\n                    consecutive = 0;\n                }\n            } else {\n                consecutive = 0;\n            }\n        }\n        if (bouquets >= m) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3
      ],
      "possible": [
        3
      ],
      "init_range": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "start_scan": [
        9,
        10
      ],
      "bloom_yes": [
        12,
        13
      ],
      "bouquet_made": [
        14,
        15,
        16
      ],
      "bloom_no": [
        18,
        19
      ],
      "search_left": [
        22,
        23
      ],
      "search_right": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        7
      ],
      "bloom_check": [
        12
      ],
      "bouquet_formed": [
        14
      ],
      "enough_bouquets": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minDays(bloomDay: number[], m: number, k: number): number {\n    const n = bloomDay.length;\n    if (m * k > n) return -1;\n    let low = Math.min(...bloomDay);\n    let high = Math.max(...bloomDay);\n\n    while (low < high) {\n        const mid = low + Math.floor((high - low) / 2);\n        let bouquets = 0;\n        let consecutive = 0;\n        for (const bloom of bloomDay) {\n            if (bloom <= mid) {\n                consecutive++;\n                if (consecutive === k) {\n                    bouquets++;\n                    consecutive = 0;\n                }\n            } else {\n                consecutive = 0;\n            }\n        }\n        if (bouquets >= m) {\n            high = mid;\n        } else {\n            low = mid + 1;\n        }\n    }\n\n    return low;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "impossible": [
        3
      ],
      "possible": [
        3
      ],
      "init_range": [
        4,
        5
      ],
      "calculate_mid": [
        8
      ],
      "start_scan": [
        9,
        10
      ],
      "bloom_yes": [
        12,
        13
      ],
      "bouquet_made": [
        14,
        15,
        16
      ],
      "bloom_no": [
        18,
        19
      ],
      "search_left": [
        22,
        23
      ],
      "search_right": [
        24,
        25
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "impossible_check": [
        3
      ],
      "while_loop": [
        7
      ],
      "bloom_check": [
        12
      ],
      "bouquet_formed": [
        14
      ],
      "enough_bouquets": [
        22
      ]
    }
  }
};

const MinimumNumberOfDaysToMakeMBouquetsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "bloomDay": [
        1,
        10,
        3,
        10,
        2
      ],
      "m": 3,
      "k": 1
    }
  },
  {
    "id": "ex2",
    "label": "Impossible",
    "value": {
      "bloomDay": [
        1,
        10,
        3,
        10,
        2
      ],
      "m": 3,
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "bloomDay": [
        7,
        7,
        7,
        7,
        12,
        7,
        7
      ],
      "m": 2,
      "k": 3
    }
  },
  {
    "id": "ex4",
    "label": "Mixed days",
    "value": {
      "bloomDay": [
        1,
        2,
        4,
        9,
        3,
        4,
        1
      ],
      "m": 2,
      "k": 2
    }
  },
  {
    "id": "ex5",
    "label": "All same",
    "value": {
      "bloomDay": [
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "m": 2,
      "k": 3
    }
  }
];

function generateMinimumNumberOfDaysToMakeMBouquetsSteps(e: any): any[] {
  

let o=[...e.bloomDay],t=e.m,a=e.k,n=o.length,l=o.reduce((e,o,t)=>(e[`elem_${t}`]={type:"arrayElement",value:o,position:t},e),{}),s=new StepRecorder({bloomDay:o,m:t,k:a,low:void 0,high:void 0,mid:void 0,bouquets:void 0,consecutive:void 0,result:void 0},{...l,meta_info:{type:"metadata",value:`m = ${t}, k = ${a}`}});if(s.record("-",`Find minimum days to make ${t} bouquets of ${a} adjacent flowers`),t*a>n)return s.add_conditional("impossible_check",!0),s.update_variable("result",-1),s.record("impossible",`m * k = ${t*a} > n = ${n}. Not enough flowers. Return -1`),s.record("complete","Result: -1 (impossible)"),s.getSteps();s.add_conditional("impossible_check",!1),s.record("possible",`m * k = ${t*a} <= n = ${n}. Enough flowers, proceed with binary search`);let r=Math.min(...o),u=Math.max(...o);for(s.update_variable("low",r),s.update_variable("high",u),s.add_new_visual("meta_range",{type:"metadata",value:`Binary search range: [${r}, ${u}]`}),s.record("init_range",`Initialize low = ${r}, high = ${u} (min and max bloom days)`);r<u;){s.add_conditional("while_loop",!0);let e=r+Math.floor((u-r)/2);s.update_variable("mid",e),s.update_visual("meta_range",{type:"metadata",value:`Testing day ${e} | Range: [${r}, ${u}]`}),s.record("calculate_mid",`Calculate mid = ${e}. Can we make ${t} bouquets by day ${e}?`);let i=0,l=0;s.update_variable("bouquets",i),s.update_variable("consecutive",l);for(let e=0;e<n;e++)s.update_visual(`elem_${e}`,{type:"arrayElement",value:o[e],position:e});s.record("start_scan","Start scanning: bouquets = 0, consecutive = 0");for(let t=0;t<n;t++)if(s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[t],position:t,state:"highlight"}),s.add_new_visual("ptr_i",{type:"pointer",position:t,label:"i"}),o[t]<=e)if(s.add_conditional("bloom_check",!0),l++,s.update_variable("consecutive",l),s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[t],position:t,state:"active"}),l===a){s.add_conditional("bouquet_formed",!0),i++,s.update_variable("bouquets",i);for(let e=t-a+1;e<=t;e++)s.update_visual(`elem_${e}`,{type:"arrayElement",value:o[e],position:e,state:"sorted"});s.record("bouquet_made",`bloomDay[${t}] = ${o[t]} <= ${e}. Consecutive = ${a} -> Bouquet #${i} formed!`),l=0,s.update_variable("consecutive",l)}else s.add_conditional("bouquet_formed",!1),s.record("bloom_yes",`bloomDay[${t}] = ${o[t]} <= ${e}. Bloomed! Consecutive = ${l}`);else s.add_conditional("bloom_check",!1),l=0,s.update_variable("consecutive",l),s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[t],position:t,state:"inactive"}),s.record("bloom_no",`bloomDay[${t}] = ${o[t]} > ${e}. Not bloomed. Consecutive reset to 0`);s.delete_visual("ptr_i"),s.update_visual("meta_range",{type:"metadata",value:`Day ${e}: ${i} bouquets (need ${t})`}),i>=t?(s.add_conditional("enough_bouquets",!0),u=e,s.update_variable("high",u),s.record("search_left",`${i} >= ${t} bouquets. Enough! Try fewer days: high = ${u}`)):(s.add_conditional("enough_bouquets",!1),r=e+1,s.update_variable("low",r),s.record("search_right",`${i} < ${t} bouquets. Not enough. Need more days: low = ${r}`))}s.add_conditional("while_loop",!1),s.update_variable("result",r);for(let e=0;e<n;e++)s.update_visual(`elem_${e}`,{type:"arrayElement",value:o[e],position:e,state:o[e]<=r?"active":"inactive"});return s.update_visual("meta_range",{type:"metadata",value:`Answer: ${r} days`}),s.record("complete",`Binary search complete. Minimum days = ${r}`),s.getSteps()
}

export function MinimumNumberOfDaysToMakeMBouquetsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MinimumNumberOfDaysToMakeMBouquetsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMinimumNumberOfDaysToMakeMBouquetsSteps(e) as any[];
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
      title="Minimum Number of Days to Make m Bouquets"
      slug="minimum-number-of-days-to-make-m-bouquets"
      approaches={approaches}
      presets={MinimumNumberOfDaysToMakeMBouquetsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Most Profit Assigning Work (most-profit-assigning-work)
// ==========================================

const MostProfitAssigningWorkTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maxProfitAssignment(self, difficulty: list[int], profit: list[int], worker: list[int]) -> int:\n        # Pair and sort jobs by difficulty\n        jobs = sorted(zip(difficulty, profit))\n        # Sort workers by ability\n        worker.sort()\n\n        total_profit = 0\n        job_index = 0\n        best_profit = 0\n        n = len(jobs)\n\n        for ability in worker:\n            # Absorb all jobs this worker can handle\n            while job_index < n and jobs[job_index][0] <= ability:\n                best_profit = max(best_profit, jobs[job_index][1])\n                job_index += 1\n            total_profit += best_profit\n\n        return total_profit",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_jobs": [
        3,
        4
      ],
      "sort_workers": [
        5,
        6
      ],
      "initialize": [
        8,
        9,
        10,
        11
      ],
      "worker_loop": [
        13
      ],
      "update_best_profit": [
        14,
        15,
        16,
        17
      ],
      "assign_profit": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        13
      ],
      "advance_job": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxProfitAssignment(int[] difficulty, int[] profit, int[] worker) {\n        int n = difficulty.length;\n        int[][] jobs = new int[n][2];\n        for (int i = 0; i < n; i++) {\n            jobs[i][0] = difficulty[i];\n            jobs[i][1] = profit[i];\n        }\n        // Sort jobs by difficulty\n        Arrays.sort(jobs, (a, b) -> a[0] - b[0]);\n        // Sort workers by ability\n        Arrays.sort(worker);\n\n        int totalProfit = 0;\n        int jobIndex = 0;\n        int bestProfit = 0;\n\n        for (int ability : worker) {\n            // Absorb all jobs this worker can handle\n            while (jobIndex < n && jobs[jobIndex][0] <= ability) {\n                bestProfit = Math.max(bestProfit, jobs[jobIndex][1]);\n                jobIndex++;\n            }\n            totalProfit += bestProfit;\n        }\n        return totalProfit;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "sort_jobs": [
        4,
        5,
        6,
        7,
        9,
        10
      ],
      "sort_workers": [
        11,
        12
      ],
      "initialize": [
        14,
        15,
        16
      ],
      "worker_loop": [
        18
      ],
      "update_best_profit": [
        19,
        20,
        21,
        22
      ],
      "assign_profit": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        18
      ],
      "advance_job": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxProfitAssignment(vector<int>& difficulty, vector<int>& profit, vector<int>& worker) {\n        int n = difficulty.size();\n        vector<pair<int, int>> jobs(n);\n        for (int i = 0; i < n; i++) {\n            jobs[i] = {difficulty[i], profit[i]};\n        }\n        // Sort jobs by difficulty\n        sort(jobs.begin(), jobs.end());\n        // Sort workers by ability\n        sort(worker.begin(), worker.end());\n\n        int totalProfit = 0;\n        int jobIndex = 0;\n        int bestProfit = 0;\n\n        for (int ability : worker) {\n            // Absorb all jobs this worker can handle\n            while (jobIndex < n && jobs[jobIndex].first <= ability) {\n                bestProfit = max(bestProfit, jobs[jobIndex].second);\n                jobIndex++;\n            }\n            totalProfit += bestProfit;\n        }\n        return totalProfit;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3,
        4
      ],
      "sort_jobs": [
        5,
        6,
        7,
        9,
        10
      ],
      "sort_workers": [
        11,
        12
      ],
      "initialize": [
        14,
        15,
        16
      ],
      "worker_loop": [
        18
      ],
      "update_best_profit": [
        19,
        20,
        21,
        22
      ],
      "assign_profit": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        18
      ],
      "advance_job": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxProfitAssignment(int[] difficulty, int[] profit, int[] worker) {\n        int n = difficulty.Length;\n        int[][] jobs = new int[n][];\n        for (int i = 0; i < n; i++) {\n            jobs[i] = new int[] { difficulty[i], profit[i] };\n        }\n        // Sort jobs by difficulty\n        Array.Sort(jobs, (a, b) => a[0] - b[0]);\n        // Sort workers by ability\n        Array.Sort(worker);\n\n        int totalProfit = 0;\n        int jobIndex = 0;\n        int bestProfit = 0;\n\n        foreach (int ability in worker) {\n            // Absorb all jobs this worker can handle\n            while (jobIndex < n && jobs[jobIndex][0] <= ability) {\n                bestProfit = Math.Max(bestProfit, jobs[jobIndex][1]);\n                jobIndex++;\n            }\n            totalProfit += bestProfit;\n        }\n        return totalProfit;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "sort_jobs": [
        4,
        5,
        6,
        8,
        9
      ],
      "sort_workers": [
        10,
        11
      ],
      "initialize": [
        13,
        14,
        15
      ],
      "worker_loop": [
        17
      ],
      "update_best_profit": [
        18,
        19,
        20,
        21
      ],
      "assign_profit": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        17
      ],
      "advance_job": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxProfitAssignment(difficulty []int, profit []int, worker []int) int {\n    n := len(difficulty)\n    jobs := make([][2]int, n)\n    for i := 0; i < n; i++ {\n        jobs[i] = [2]int{difficulty[i], profit[i]}\n    }\n    // Sort jobs by difficulty\n    sort.Slice(jobs, func(i, j int) bool {\n        return jobs[i][0] < jobs[j][0]\n    })\n    // Sort workers by ability\n    sort.Ints(worker)\n\n    totalProfit := 0\n    jobIndex := 0\n    bestProfit := 0\n\n    for _, ability := range worker {\n        // Absorb all jobs this worker can handle\n        for jobIndex < n && jobs[jobIndex][0] <= ability {\n            if jobs[jobIndex][1] > bestProfit {\n                bestProfit = jobs[jobIndex][1]\n            }\n            jobIndex++\n        }\n        totalProfit += bestProfit\n    }\n    return totalProfit\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_jobs": [
        3,
        4,
        5,
        7,
        8,
        9,
        10
      ],
      "sort_workers": [
        11,
        12
      ],
      "initialize": [
        14,
        15,
        16
      ],
      "worker_loop": [
        18
      ],
      "update_best_profit": [
        19,
        20,
        21,
        22,
        24
      ],
      "assign_profit": [
        26
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        18
      ],
      "advance_job": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxProfitAssignment = function(difficulty, profit, worker) {\n    var n = difficulty.length;\n    var jobs = [];\n    for (var i = 0; i < n; i++) {\n        jobs.push([difficulty[i], profit[i]]);\n    }\n    // Sort jobs by difficulty\n    jobs.sort(function(a, b) { return a[0] - b[0]; });\n    // Sort workers by ability\n    worker.sort(function(a, b) { return a - b; });\n\n    var totalProfit = 0;\n    var jobIndex = 0;\n    var bestProfit = 0;\n\n    for (var j = 0; j < worker.length; j++) {\n        var ability = worker[j];\n        // Absorb all jobs this worker can handle\n        while (jobIndex < n && jobs[jobIndex][0] <= ability) {\n            bestProfit = Math.max(bestProfit, jobs[jobIndex][1]);\n            jobIndex++;\n        }\n        totalProfit += bestProfit;\n    }\n    return totalProfit;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_jobs": [
        3,
        4,
        5,
        7,
        8
      ],
      "sort_workers": [
        9,
        10
      ],
      "initialize": [
        12,
        13,
        14
      ],
      "worker_loop": [
        16,
        17
      ],
      "update_best_profit": [
        18,
        19,
        20,
        21
      ],
      "assign_profit": [
        23
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        16
      ],
      "advance_job": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxProfitAssignment(difficulty: number[], profit: number[], worker: number[]): number {\n    const n = difficulty.length;\n    const jobs: number[][] = [];\n    for (let i = 0; i < n; i++) {\n        jobs.push([difficulty[i], profit[i]]);\n    }\n    // Sort jobs by difficulty\n    jobs.sort((a, b) => a[0] - b[0]);\n    // Sort workers by ability\n    worker.sort((a, b) => a - b);\n\n    let totalProfit = 0;\n    let jobIndex = 0;\n    let bestProfit = 0;\n\n    for (const ability of worker) {\n        // Absorb all jobs this worker can handle\n        while (jobIndex < n && jobs[jobIndex][0] <= ability) {\n            bestProfit = Math.max(bestProfit, jobs[jobIndex][1]);\n            jobIndex++;\n        }\n        totalProfit += bestProfit;\n    }\n    return totalProfit;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "sort_jobs": [
        3,
        4,
        5,
        7,
        8
      ],
      "sort_workers": [
        9,
        10
      ],
      "initialize": [
        12,
        13,
        14
      ],
      "worker_loop": [
        16
      ],
      "update_best_profit": [
        17,
        18,
        19,
        20
      ],
      "assign_profit": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "worker_loop": [
        16
      ],
      "advance_job": [
        18
      ]
    }
  }
};

const MostProfitAssigningWorkPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "difficulty": [
        2,
        4,
        6,
        8,
        10
      ],
      "profit": [
        10,
        20,
        30,
        40,
        50
      ],
      "worker": [
        4,
        5,
        6,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "difficulty": [
        85,
        47,
        57
      ],
      "profit": [
        24,
        66,
        99
      ],
      "worker": [
        40,
        25,
        25
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Decreasing profit",
    "value": {
      "difficulty": [
        5,
        10,
        15
      ],
      "profit": [
        50,
        40,
        30
      ],
      "worker": [
        5,
        10
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single job",
    "value": {
      "difficulty": [
        3
      ],
      "profit": [
        100
      ],
      "worker": [
        1,
        5
      ]
    }
  }
];

function generateMostProfitAssigningWorkSteps(t: any): any[] {
  function r(t){return t.map((t,i)=>[t,i]).sort((t,i)=>t[0]-i[0]||t[1]-i[1]).map(([,t])=>t)}

let i=[...t.difficulty],e=[...t.profit],n=[...t.worker],l=i.length,a=r(i),s=a.map(t=>[i[t],e[t]]),f=r(n),d=f.map(t=>n[t]),b={};s.forEach(([t,i],e)=>{b[`job_${e}`]={type:"arrayElement",value:t,label:String(i),position:a[e]}}),d.forEach((t,i)=>{b[`worker_${i}`]={type:"arrayElement",value:t,position:f[i]}});let p=new StepRecorder({},b);p.record("-","Start: Give every worker the most profitable job they can handle"),s.forEach(([t,i],e)=>{p.update_visual(`job_${e}`,{type:"arrayElement",value:t,label:String(i),position:e})}),p.record("sort_jobs","Sort jobs by difficulty ascending"),d.forEach((t,i)=>{p.update_visual(`worker_${i}`,{type:"arrayElement",value:t,position:i})}),p.record("sort_workers","Sort workers by ability ascending");let c=0,u=0,h=0,x=-1,_=Array(d.length).fill(-1);p.add_new_variable("totalProfit",c),p.add_new_variable("jobIndex",u),p.add_new_variable("bestProfit",h),p.add_new_variable("bestJobIdx",x),p.add_new_variable("earnings",_),p.add_new_visual("ptr_j",{type:"pointer",position:0,label:"jobIdx"}),p.record("initialize","Initialize totalProfit = 0, jobIndex = 0, bestProfit = 0");for(let t=0;t<d.length;t++){let i=d[t];for(p.add_conditional("worker_loop",!0),p.update_visual("ptr_w",{type:"pointer",position:t,label:"w"}),p.update_variable("w",t),p.update_variable("ability",i),p.record("worker_loop",`Worker ${t} has ability ${i}: unlock every job with difficulty ≤ ${i}`);u<l&&s[u][0]<=i;){p.add_conditional("advance_job",!0);let[t,i]=s[u],e=h,o=i>h;o&&(h=i,x=u);let r=u;u++,p.update_variable("d",t),p.update_variable("p",i),p.update_variable("prevBest",e),p.update_variable("newBest",o),p.update_variable("scannedIdx",r),p.update_variable("bestProfit",h),p.update_variable("bestJobIdx",x),p.update_variable("jobIndex",u),u<l?p.update_visual("ptr_j",{type:"pointer",position:u,label:"jobIdx"}):p.delete_visual("ptr_j"),p.record("update_best_profit",`Job (d=${t}, p=${i}) is doable: bestProfit = max(${e}, ${i}) = ${h}`)}p.add_conditional("advance_job",!1),c+=h,_[t]=h,p.update_variable("totalProfit",c),p.update_variable("earnings",_),p.record("assign_profit",h>0?`Worker ${t} takes the best unlocked job: totalProfit += ${h} → ${c}`:`Worker ${t} cannot do any job: totalProfit += 0 → ${c}`)}return p.add_conditional("worker_loop",!1),p.delete_visual("ptr_w"),p.delete_visual("ptr_j"),p.delete_variable("d"),p.delete_variable("p"),p.delete_variable("scannedIdx"),p.add_new_variable("result",c),p.record("complete",`Total profit = ${c}`),p.getSteps()
}

export function MostProfitAssigningWorkProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MostProfitAssigningWorkTemplates,
      generateSteps: (t: any) => {
        const recorded = generateMostProfitAssigningWorkSteps(t) as any[];
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
      title="Most Profit Assigning Work"
      slug="most-profit-assigning-work"
      approaches={approaches}
      presets={MostProfitAssigningWorkPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Search a 2D Matrix II (search-a-2d-matrix-ii)
// ==========================================

const SearchA2dMatrixIiTemplates = {
  "python": {
    "language": "python",
    "code": "def searchMatrix(matrix, target):\n    rows, cols = len(matrix), len(matrix[0])\n    row, col = 0, cols - 1\n\n    while row < rows and col >= 0:\n        if matrix[row][col] == target:\n            return True\n        elif matrix[row][col] > target:\n            col -= 1\n        else:\n            row += 1\n\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean searchMatrix(int[][] matrix, int target) {\n    int rows = matrix.length, cols = matrix[0].length;\n    int row = 0, col = cols - 1;\n\n    while (row < rows && col >= 0) {\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] > target) {\n            col--;\n        } else {\n            row++;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    int rows = matrix.size(), cols = matrix[0].size();\n    int row = 0, col = cols - 1;\n\n    while (row < rows && col >= 0) {\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] > target) {\n            col--;\n        } else {\n            row++;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool SearchMatrix(int[][] matrix, int target) {\n    int rows = matrix.Length, cols = matrix[0].Length;\n    int row = 0, col = cols - 1;\n\n    while (row < rows && col >= 0) {\n        if (matrix[row][col] == target) {\n            return true;\n        } else if (matrix[row][col] > target) {\n            col--;\n        } else {\n            row++;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func searchMatrix(matrix [][]int, target int) bool {\n    rows, cols := len(matrix), len(matrix[0])\n    row, col := 0, cols-1\n\n    for row < rows && col >= 0 {\n        if matrix[row][col] == target {\n            return true\n        } else if matrix[row][col] > target {\n            col--\n        } else {\n            row++\n        }\n    }\n\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function searchMatrix(matrix, target) {\n    const rows = matrix.length, cols = matrix[0].length;\n    let row = 0, col = cols - 1;\n\n    while (row < rows && col >= 0) {\n        if (matrix[row][col] === target) {\n            return true;\n        } else if (matrix[row][col] > target) {\n            col--;\n        } else {\n            row++;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function searchMatrix(matrix: number[][], target: number): boolean {\n    const rows = matrix.length, cols = matrix[0].length;\n    let row = 0, col = cols - 1;\n\n    while (row < rows && col >= 0) {\n        if (matrix[row][col] === target) {\n            return true;\n        } else if (matrix[row][col] > target) {\n            col--;\n        } else {\n            row++;\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_current": [
        6
      ],
      "found": [
        7
      ],
      "move_left": [
        8,
        9
      ],
      "move_down": [
        10,
        11
      ],
      "not_found": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "equal_target": [
        6
      ],
      "greater_than_target": [
        8
      ]
    }
  }
};

const SearchA2dMatrixIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1 (found)",
    "value": {
      "matrix": [
        [
          1,
          4,
          7,
          11
        ],
        [
          2,
          5,
          8,
          12
        ],
        [
          3,
          6,
          9,
          16
        ],
        [
          10,
          13,
          14,
          17
        ]
      ],
      "target": 5
    }
  },
  {
    "id": "ex2",
    "label": "Example 2 (not found)",
    "value": {
      "matrix": [
        [
          1,
          4,
          7,
          11
        ],
        [
          2,
          5,
          8,
          12
        ],
        [
          3,
          6,
          9,
          16
        ],
        [
          10,
          13,
          14,
          17
        ]
      ],
      "target": 15
    }
  },
  {
    "id": "ex3",
    "label": "3x3 matrix (found)",
    "value": {
      "matrix": [
        [
          1,
          3,
          5
        ],
        [
          2,
          4,
          7
        ],
        [
          6,
          8,
          9
        ]
      ],
      "target": 8
    }
  },
  {
    "id": "ex4",
    "label": "Top-left corner",
    "value": {
      "matrix": [
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
      "target": 1
    }
  },
  {
    "id": "ex5",
    "label": "Not found (larger than all)",
    "value": {
      "matrix": [
        [
          1,
          4,
          7
        ],
        [
          2,
          5,
          8
        ],
        [
          3,
          6,
          9
        ],
        [
          10,
          13,
          14
        ]
      ],
      "target": 20
    }
  }
];

function generateSearchA2dMatrixIiSteps(e: any): any[] {
  

let t=e.matrix,r=e.target;if(!t||0===t.length||0===t[0].length)return[];let i=t.length,l=t[0].length,o={};for(let e=0;e<i;e++)for(let r=0;r<l;r++)o[`cell_${e}_${r}`]={type:"matrixElement",value:t[e][r],row:e,col:r,state:"default"};let n=new StepRecorder({matrix:t,target:r,rows:void 0,cols:void 0,row:void 0,col:void 0},{...o});n.record("-","Start: Staircase search on 2D matrix"),n.update_variable("rows",i),n.update_variable("cols",l);let c=0,s=l-1;for(n.update_variable("row",c),n.update_variable("col",s),n.add_new_visual("ptr_current",{type:"2DPointer",label:"row,col",row:c,col:s}),n.update_visual(`cell_${c}_${s}`,{type:"matrixElement",value:t[c][s],row:c,col:s,state:"active"}),n.record("initialize",`Initialize: row=0, col=${l-1} (top-right corner)`);c<i&&s>=0;){n.add_conditional("while_loop",!0);let e=t[c][s];if(n.update_visual(`cell_${c}_${s}`,{type:"matrixElement",value:e,row:c,col:s,state:"active"}),n.update_visual("ptr_current",{type:"2DPointer",label:"row,col",row:c,col:s}),n.record("check_current",`Check matrix[${c}][${s}] = ${e} vs target ${r}`),e===r)return n.add_conditional("equal_target",!0),n.update_visual(`cell_${c}_${s}`,{type:"matrixElement",value:e,row:c,col:s,state:"found"}),n.delete_visual("ptr_current"),n.record("found",`Found target ${r} at [${c}][${s}]`),n.record("complete",`Complete: Target ${r} found at [${c}][${s}]`),n.getSteps();if(n.add_conditional("equal_target",!1),e>r){n.add_conditional("greater_than_target",!0);for(let e=c;e<i;e++)n.update_visual(`cell_${e}_${s}`,{type:"matrixElement",value:t[e][s],row:e,col:s,state:"eliminated"});s--,n.update_variable("col",s),s>=0&&n.update_visual("ptr_current",{type:"2DPointer",label:"row,col",row:c,col:s}),n.record("move_left",`${e} > ${r}: eliminate column, col-- = ${s}`)}else{n.add_conditional("greater_than_target",!1);for(let e=0;e<=s;e++){let r=`cell_${c}_${e}`,a=n.get_visual(r);a&&"eliminated"!==a.state&&n.update_visual(r,{type:"matrixElement",value:t[c][e],row:c,col:e,state:"eliminated"})}c++,n.update_variable("row",c),c<i&&n.update_visual("ptr_current",{type:"2DPointer",label:"row,col",row:c,col:s}),n.record("move_down",`${e} < ${r}: eliminate row, row++ = ${c}`)}}return n.add_conditional("while_loop",!1),n.delete_visual("ptr_current"),n.record("not_found",`Target ${r} not found in matrix`),n.record("complete",`Complete: Target ${r} not found`),n.getSteps()
}

export function SearchA2dMatrixIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchA2dMatrixIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSearchA2dMatrixIiSteps(e) as any[];
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
      title="Search a 2D Matrix II"
      slug="search-a-2d-matrix-ii"
      approaches={approaches}
      presets={SearchA2dMatrixIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Search in Rotated Sorted Array II (search-in-rotated-sorted-array-ii)
// ==========================================

const SearchInRotatedSortedArrayIiTemplates = {
  "python": {
    "language": "python",
    "code": "def search(nums, target):\n    left = 0\n    right = len(nums) - 1\n\n    while left <= right:\n        mid = left + (right - left) // 2\n\n        if nums[mid] == target:\n            return True\n\n        if nums[left] == nums[mid] == nums[right]:\n            left += 1\n            right -= 1\n        elif nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "ambiguous": [
        11,
        12,
        13
      ],
      "left_sorted": [
        14
      ],
      "search_left": [
        16
      ],
      "search_right_from_left": [
        18
      ],
      "right_sorted": [
        19
      ],
      "search_right": [
        21
      ],
      "search_left_from_right": [
        23
      ],
      "not_found": [
        25
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "ambiguous_case": [
        11
      ],
      "left_half_sorted": [
        14
      ],
      "target_in_left": [
        15
      ],
      "target_in_right": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean search(int[] nums, int target) {\n    int left = 0, right = nums.length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return true;\n        }\n\n        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {\n            left++;\n            right--;\n        } else if (nums[left] <= nums[mid]) {\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        5
      ],
      "found": [
        7,
        8
      ],
      "ambiguous": [
        11,
        12,
        13
      ],
      "left_sorted": [
        14
      ],
      "search_left": [
        16
      ],
      "search_right_from_left": [
        18
      ],
      "right_sorted": [
        20
      ],
      "search_right": [
        22
      ],
      "search_left_from_right": [
        24
      ],
      "not_found": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "found_target": [
        7
      ],
      "ambiguous_case": [
        11
      ],
      "left_half_sorted": [
        14
      ],
      "target_in_left": [
        15
      ],
      "target_in_right": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool search(vector<int>& nums, int target) {\n    int left = 0, right = nums.size() - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return true;\n        }\n\n        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {\n            left++;\n            right--;\n        } else if (nums[left] <= nums[mid]) {\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        5
      ],
      "found": [
        7,
        8
      ],
      "ambiguous": [
        11,
        12,
        13
      ],
      "left_sorted": [
        14
      ],
      "search_left": [
        16
      ],
      "search_right_from_left": [
        18
      ],
      "right_sorted": [
        20
      ],
      "search_right": [
        22
      ],
      "search_left_from_right": [
        24
      ],
      "not_found": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "found_target": [
        7
      ],
      "ambiguous_case": [
        11
      ],
      "left_half_sorted": [
        14
      ],
      "target_in_left": [
        15
      ],
      "target_in_right": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool Search(int[] nums, int target) {\n    int left = 0, right = nums.Length - 1;\n\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n\n        if (nums[mid] == target) {\n            return true;\n        }\n\n        if (nums[left] == nums[mid] && nums[mid] == nums[right]) {\n            left++;\n            right--;\n        } else if (nums[left] <= nums[mid]) {\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        5
      ],
      "found": [
        7,
        8
      ],
      "ambiguous": [
        11,
        12,
        13
      ],
      "left_sorted": [
        14
      ],
      "search_left": [
        16
      ],
      "search_right_from_left": [
        18
      ],
      "right_sorted": [
        20
      ],
      "search_right": [
        22
      ],
      "search_left_from_right": [
        24
      ],
      "not_found": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "found_target": [
        7
      ],
      "ambiguous_case": [
        11
      ],
      "left_half_sorted": [
        14
      ],
      "target_in_left": [
        15
      ],
      "target_in_right": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func search(nums []int, target int) bool {\n    left := 0\n    right := len(nums) - 1\n\n    for left <= right {\n        mid := left + (right - left) / 2\n\n        if nums[mid] == target {\n            return true\n        }\n\n        if nums[left] == nums[mid] && nums[mid] == nums[right] {\n            left++\n            right--\n        } else if nums[left] <= nums[mid] {\n            if target >= nums[left] && target < nums[mid] {\n                right = mid - 1\n            } else {\n                left = mid + 1\n            }\n        } else {\n            if target > nums[mid] && target <= nums[right] {\n                left = mid + 1\n            } else {\n                right = mid - 1\n            }\n        }\n    }\n\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "ambiguous": [
        12,
        13,
        14
      ],
      "left_sorted": [
        15
      ],
      "search_left": [
        17
      ],
      "search_right_from_left": [
        19
      ],
      "right_sorted": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left_from_right": [
        25
      ],
      "not_found": [
        30
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "ambiguous_case": [
        12
      ],
      "left_half_sorted": [
        15
      ],
      "target_in_left": [
        16
      ],
      "target_in_right": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function search(nums, target) {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] === target) {\n            return true;\n        }\n\n        if (nums[left] === nums[mid] && nums[mid] === nums[right]) {\n            left++;\n            right--;\n        } else if (nums[left] <= nums[mid]) {\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "ambiguous": [
        12,
        13,
        14
      ],
      "left_sorted": [
        15
      ],
      "search_left": [
        17
      ],
      "search_right_from_left": [
        19
      ],
      "right_sorted": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left_from_right": [
        25
      ],
      "not_found": [
        30
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "ambiguous_case": [
        12
      ],
      "left_half_sorted": [
        15
      ],
      "target_in_left": [
        16
      ],
      "target_in_right": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function search(nums: number[], target: number): boolean {\n    let left = 0;\n    let right = nums.length - 1;\n\n    while (left <= right) {\n        const mid = Math.floor(left + (right - left) / 2);\n\n        if (nums[mid] === target) {\n            return true;\n        }\n\n        if (nums[left] === nums[mid] && nums[mid] === nums[right]) {\n            left++;\n            right--;\n        } else if (nums[left] <= nums[mid]) {\n            if (target >= nums[left] && target < nums[mid]) {\n                right = mid - 1;\n            } else {\n                left = mid + 1;\n            }\n        } else {\n            if (target > nums[mid] && target <= nums[right]) {\n                left = mid + 1;\n            } else {\n                right = mid - 1;\n            }\n        }\n    }\n\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "found": [
        8,
        9
      ],
      "ambiguous": [
        12,
        13,
        14
      ],
      "left_sorted": [
        15
      ],
      "search_left": [
        17
      ],
      "search_right_from_left": [
        19
      ],
      "right_sorted": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left_from_right": [
        25
      ],
      "not_found": [
        30
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "found_target": [
        8
      ],
      "ambiguous_case": [
        12
      ],
      "left_half_sorted": [
        15
      ],
      "target_in_left": [
        16
      ],
      "target_in_right": [
        22
      ]
    }
  }
};

const SearchInRotatedSortedArrayIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Found with duplicates",
    "value": {
      "nums": [
        2,
        5,
        6,
        0,
        0,
        1,
        2
      ],
      "target": 0
    }
  },
  {
    "id": "ex2",
    "label": "Not found",
    "value": {
      "nums": [
        2,
        5,
        6,
        0,
        0,
        1,
        2
      ],
      "target": 3
    }
  },
  {
    "id": "ex3",
    "label": "All duplicates",
    "value": {
      "nums": [
        1,
        1,
        1,
        1,
        1
      ],
      "target": 1
    }
  },
  {
    "id": "ex4",
    "label": "Ambiguous case",
    "value": {
      "nums": [
        1,
        0,
        1,
        1,
        1
      ],
      "target": 0
    }
  }
];

function generateSearchInRotatedSortedArrayIiSteps(e: any): any[] {
  

let t=[...e.nums],i=e.target,r=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),n=new StepRecorder({nums:t,target:i,left:void 0,right:void 0,mid:void 0},{...r});n.record("-",`Start: Search for target ${i} in rotated sorted array (with duplicates)`);let l=0,s=t.length-1;n.update_variable("left",l),n.update_variable("right",s),n.add_new_visual("ptr_left",{type:"pointer",position:l,label:"left"}),n.add_new_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=l;e<=s;e++)n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});for(n.record("initialize",`Initialize left = 0, right = ${t.length-1}`);l<=s;){n.add_conditional("while_loop",!0);let e=Math.floor(l+(s-l)/2);if(n.update_variable("mid",e),n.add_new_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),n.record("calculate_mid",`Calculate mid = ${e}, nums[mid] = ${t[e]}`),t[e]===i)return n.add_conditional("found_target",!0),n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),n.delete_visual("ptr_right"),n.delete_visual("ptr_left"),n.record("found",`Found target ${i} at index ${e}. Return true`),n.getSteps();if(n.add_conditional("found_target",!1),t[l]===t[e]&&t[e]===t[s]){n.add_conditional("ambiguous_case",!0),l++,s--,n.update_variable("left",l),n.update_variable("right",s),n.update_visual("ptr_left",{type:"pointer",position:l,label:"left"}),n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}n.record("ambiguous",`nums[left] == nums[mid] == nums[right] == ${t[e]}. Shrink both ends: left = ${l}, right = ${s}`);continue}if(n.add_conditional("ambiguous_case",!1),t[l]<=t[e])if(n.add_conditional("left_half_sorted",!0),n.record("left_sorted",`Left half is sorted: nums[${l}] (${t[l]}) <= nums[${e}] (${t[e]})`),t[l]<=i&&i<t[e]){n.add_conditional("target_in_left",!0),s=e-1,n.update_variable("right",s),n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}n.record("search_left",`Target in left half range. Search left: right = ${s}`)}else{n.add_conditional("target_in_left",!1),l=e+1,n.update_variable("left",l),n.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}n.record("search_right_from_left",`Target not in left half. Search right: left = ${l}`)}else if(n.add_conditional("left_half_sorted",!1),n.record("right_sorted",`Right half is sorted: nums[${l}] (${t[l]}) > nums[${e}] (${t[e]})`),t[e]<i&&i<=t[s]){n.add_conditional("target_in_right",!0),l=e+1,n.update_variable("left",l),n.update_visual("ptr_left",{type:"pointer",position:l,label:"left"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}n.record("search_right",`Target in right half range. Search right: left = ${l}`)}else{n.add_conditional("target_in_right",!1),s=e-1,n.update_variable("right",s),n.update_visual("ptr_right",{type:"pointer",position:s,label:"right"});for(let e=0;e<t.length;e++){let i=e>=l&&e<=s;n.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:i?void 0:"inactive"})}n.record("search_left_from_right",`Target not in right half. Search left: right = ${s}`)}}return n.delete_visual("ptr_mid"),n.delete_visual("ptr_right"),n.delete_visual("ptr_left"),n.add_conditional("while_loop",!1),n.record("not_found",`Target ${i} not found in array. Return false`),n.getSteps()
}

export function SearchInRotatedSortedArrayIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SearchInRotatedSortedArrayIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSearchInRotatedSortedArrayIiSteps(e) as any[];
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
      title="Search in Rotated Sorted Array II"
      slug="search-in-rotated-sorted-array-ii"
      approaches={approaches}
      presets={SearchInRotatedSortedArrayIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Snapshot Array (snapshot-array)
// ==========================================

const SnapshotArrayTemplates = {
  "python": {
    "language": "python",
    "code": "class SnapshotArray:\n    def __init__(self, length: int):\n        # Each index stores a list of [snap_id, value] pairs\n        self.history = [[[0, 0]] for _ in range(length)]\n        self.snap_count = 0\n\n    def set(self, index: int, val: int) -> None:\n        last = self.history[index][-1]\n        if last[0] == self.snap_count:\n            # Same snap_id, update in place\n            last[1] = val\n        else:\n            # New snap_id, append\n            self.history[index].append([self.snap_count, val])\n\n    def snap(self) -> int:\n        snap_id = self.snap_count\n        self.snap_count += 1\n        return snap_id\n\n    def get(self, index: int, snap_id: int) -> int:\n        hist = self.history[index]\n        # Binary search for the largest snap_id <= queried snap_id\n        lo, hi = 0, len(hist) - 1\n        while lo < hi:\n            mid = lo + (hi - lo + 1) // 2\n            if hist[mid][0] <= snap_id:\n                lo = mid\n            else:\n                hi = mid - 1\n        return hist[lo][1]",
    "lineMap": {
      "-": [
        4,
        5
      ],
      "set_check_snap": [
        7,
        8,
        9
      ],
      "set_update": [
        11
      ],
      "set_append": [
        14
      ],
      "snap_return": [
        17,
        18,
        19
      ],
      "binary_search_init": [
        21,
        22,
        24
      ],
      "binary_search_mid": [
        25,
        26,
        27
      ],
      "binary_search_left": [
        28
      ],
      "binary_search_right": [
        30
      ],
      "return_result": [
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        9
      ],
      "snap_leq": [
        27
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class SnapshotArray {\n    private List<int[]>[] history;\n    private int snapCount;\n\n    public SnapshotArray(int length) {\n        history = new ArrayList[length];\n        for (int i = 0; i < length; i++) {\n            history[i] = new ArrayList<>();\n            // Initial value: snap_id 0, value 0\n            history[i].add(new int[]{0, 0});\n        }\n        snapCount = 0;\n    }\n\n    public void set(int index, int val) {\n        List<int[]> list = history[index];\n        int[] last = list.get(list.size() - 1);\n        if (last[0] == snapCount) {\n            // Same snap_id, update in place\n            last[1] = val;\n        } else {\n            // New snap_id, append\n            list.add(new int[]{snapCount, val});\n        }\n    }\n\n    public int snap() {\n        return snapCount++;\n    }\n\n    public int get(int index, int snap_id) {\n        List<int[]> list = history[index];\n        // Binary search for the largest snap_id <= queried snap_id\n        int lo = 0, hi = list.size() - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo + 1) / 2;\n            if (list.get(mid)[0] <= snap_id) {\n                lo = mid;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return list.get(lo)[1];\n    }\n}",
    "lineMap": {
      "-": [
        10,
        12
      ],
      "set_check_snap": [
        15,
        16,
        17,
        18
      ],
      "set_update": [
        20
      ],
      "set_append": [
        23
      ],
      "snap_return": [
        27,
        28
      ],
      "binary_search_init": [
        31,
        32,
        34
      ],
      "binary_search_mid": [
        35,
        36,
        37
      ],
      "binary_search_left": [
        38
      ],
      "binary_search_right": [
        40
      ],
      "return_result": [
        43
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        18
      ],
      "snap_leq": [
        37
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class SnapshotArray {\n    vector<vector<pair<int,int>>> history;\n    int snapCount;\n\npublic:\n    SnapshotArray(int length) : snapCount(0) {\n        history.resize(length);\n        for (int i = 0; i < length; i++) {\n            // Initial value: snap_id 0, value 0\n            history[i].push_back({0, 0});\n        }\n    }\n\n    void set(int index, int val) {\n        auto& last = history[index].back();\n        if (last.first == snapCount) {\n            // Same snap_id, update in place\n            last.second = val;\n        } else {\n            // New snap_id, append\n            history[index].push_back({snapCount, val});\n        }\n    }\n\n    int snap() {\n        return snapCount++;\n    }\n\n    int get(int index, int snap_id) {\n        auto& hist = history[index];\n        // Binary search for the largest snap_id <= queried snap_id\n        int lo = 0, hi = hist.size() - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo + 1) / 2;\n            if (hist[mid].first <= snap_id) {\n                lo = mid;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return hist[lo].second;\n    }\n};",
    "lineMap": {
      "-": [
        6,
        10
      ],
      "set_check_snap": [
        14,
        15,
        16
      ],
      "set_update": [
        18
      ],
      "set_append": [
        21
      ],
      "snap_return": [
        25,
        26
      ],
      "binary_search_init": [
        29,
        30,
        32
      ],
      "binary_search_mid": [
        33,
        34,
        35
      ],
      "binary_search_left": [
        36
      ],
      "binary_search_right": [
        38
      ],
      "return_result": [
        41
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        16
      ],
      "snap_leq": [
        35
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class SnapshotArray {\n    private List<int[]>[] history;\n    private int snapCount;\n\n    public SnapshotArray(int length) {\n        history = new List<int[]>[length];\n        for (int i = 0; i < length; i++) {\n            history[i] = new List<int[]>();\n            // Initial value: snap_id 0, value 0\n            history[i].Add(new int[]{0, 0});\n        }\n        snapCount = 0;\n    }\n\n    public void Set(int index, int val) {\n        var list = history[index];\n        var last = list[list.Count - 1];\n        if (last[0] == snapCount) {\n            // Same snap_id, update in place\n            last[1] = val;\n        } else {\n            // New snap_id, append\n            list.Add(new int[]{snapCount, val});\n        }\n    }\n\n    public int Snap() {\n        return snapCount++;\n    }\n\n    public int Get(int index, int snapId) {\n        var list = history[index];\n        // Binary search for the largest snap_id <= queried snap_id\n        int lo = 0, hi = list.Count - 1;\n        while (lo < hi) {\n            int mid = lo + (hi - lo + 1) / 2;\n            if (list[mid][0] <= snapId) {\n                lo = mid;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return list[lo][1];\n    }\n}",
    "lineMap": {
      "-": [
        10,
        12
      ],
      "set_check_snap": [
        15,
        16,
        17,
        18
      ],
      "set_update": [
        20
      ],
      "set_append": [
        23
      ],
      "snap_return": [
        27,
        28
      ],
      "binary_search_init": [
        31,
        32,
        34
      ],
      "binary_search_mid": [
        35,
        36,
        37
      ],
      "binary_search_left": [
        38
      ],
      "binary_search_right": [
        40
      ],
      "return_result": [
        43
      ],
      "complete": [
        43
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        18
      ],
      "snap_leq": [
        37
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type SnapshotArray struct {\n    history   [][][2]int\n    snapCount int\n}\n\nfunc Constructor(length int) SnapshotArray {\n    history := make([][][2]int, length)\n    for i := 0; i < length; i++ {\n        // Initial value: snap_id 0, value 0\n        history[i] = [][2]int{{0, 0}}\n    }\n    return SnapshotArray{history: history, snapCount: 0}\n}\n\nfunc (sa *SnapshotArray) Set(index int, val int) {\n    list := sa.history[index]\n    last := &list[len(list)-1]\n    if last[0] == sa.snapCount {\n        // Same snap_id, update in place\n        last[1] = val\n    } else {\n        // New snap_id, append\n        sa.history[index] = append(sa.history[index], [2]int{sa.snapCount, val})\n    }\n}\n\nfunc (sa *SnapshotArray) Snap() int {\n    id := sa.snapCount\n    sa.snapCount++\n    return id\n}\n\nfunc (sa *SnapshotArray) Get(index int, snapId int) int {\n    hist := sa.history[index]\n    // Binary search for the largest snap_id <= queried snap_id\n    lo, hi := 0, len(hist)-1\n    for lo < hi {\n        mid := lo + (hi-lo+1)/2\n        if hist[mid][0] <= snapId {\n            lo = mid\n        } else {\n            hi = mid - 1\n        }\n    }\n    return hist[lo][1]\n}",
    "lineMap": {
      "-": [
        10,
        12
      ],
      "set_check_snap": [
        15,
        16,
        17,
        18
      ],
      "set_update": [
        20
      ],
      "set_append": [
        23
      ],
      "snap_return": [
        28,
        29,
        30
      ],
      "binary_search_init": [
        33,
        34,
        36
      ],
      "binary_search_mid": [
        37,
        38,
        39
      ],
      "binary_search_left": [
        40
      ],
      "binary_search_right": [
        42
      ],
      "return_result": [
        45
      ],
      "complete": [
        45
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        18
      ],
      "snap_leq": [
        39
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var SnapshotArray = function(length) {\n    this.history = new Array(length);\n    for (var i = 0; i < length; i++) {\n        // Initial value: snap_id 0, value 0\n        this.history[i] = [[0, 0]];\n    }\n    this.snapCount = 0;\n};\n\nSnapshotArray.prototype.set = function(index, val) {\n    var list = this.history[index];\n    var last = list[list.length - 1];\n    if (last[0] === this.snapCount) {\n        // Same snap_id, update in place\n        last[1] = val;\n    } else {\n        // New snap_id, append\n        list.push([this.snapCount, val]);\n    }\n};\n\nSnapshotArray.prototype.snap = function() {\n    return this.snapCount++;\n};\n\nSnapshotArray.prototype.get = function(index, snap_id) {\n    var list = this.history[index];\n    // Binary search for the largest snap_id <= queried snap_id\n    var lo = 0, hi = list.length - 1;\n    while (lo < hi) {\n        var mid = lo + Math.floor((hi - lo + 1) / 2);\n        if (list[mid][0] <= snap_id) {\n            lo = mid;\n        } else {\n            hi = mid - 1;\n        }\n    }\n    return list[lo][1];\n};",
    "lineMap": {
      "-": [
        5,
        7
      ],
      "set_check_snap": [
        10,
        11,
        12,
        13
      ],
      "set_update": [
        15
      ],
      "set_append": [
        18
      ],
      "snap_return": [
        22,
        23
      ],
      "binary_search_init": [
        26,
        27,
        29
      ],
      "binary_search_mid": [
        30,
        31,
        32
      ],
      "binary_search_left": [
        33
      ],
      "binary_search_right": [
        35
      ],
      "return_result": [
        38
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        13
      ],
      "snap_leq": [
        32
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class SnapshotArray {\n    private history: number[][][];\n    private snapCount: number;\n\n    constructor(length: number) {\n        this.history = new Array(length);\n        for (let i = 0; i < length; i++) {\n            // Initial value: snap_id 0, value 0\n            this.history[i] = [[0, 0]];\n        }\n        this.snapCount = 0;\n    }\n\n    set(index: number, val: number): void {\n        const list = this.history[index];\n        const last = list[list.length - 1];\n        if (last[0] === this.snapCount) {\n            // Same snap_id, update in place\n            last[1] = val;\n        } else {\n            // New snap_id, append\n            list.push([this.snapCount, val]);\n        }\n    }\n\n    snap(): number {\n        return this.snapCount++;\n    }\n\n    get(index: number, snap_id: number): number {\n        const list = this.history[index];\n        // Binary search for the largest snap_id <= queried snap_id\n        let lo = 0, hi = list.length - 1;\n        while (lo < hi) {\n            const mid = lo + Math.floor((hi - lo + 1) / 2);\n            if (list[mid][0] <= snap_id) {\n                lo = mid;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return list[lo][1];\n    }\n}",
    "lineMap": {
      "-": [
        9,
        11
      ],
      "set_check_snap": [
        14,
        15,
        16,
        17
      ],
      "set_update": [
        19
      ],
      "set_append": [
        22
      ],
      "snap_return": [
        26,
        27
      ],
      "binary_search_init": [
        30,
        31,
        33
      ],
      "binary_search_mid": [
        34,
        35,
        36
      ],
      "binary_search_left": [
        37
      ],
      "binary_search_right": [
        39
      ],
      "return_result": [
        42
      ],
      "complete": [
        42
      ]
    },
    "conditionalMap": {
      "same_snap_id": [
        17
      ],
      "snap_leq": [
        36
      ]
    }
  }
};

const SnapshotArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "length": 3,
      "operations": [
        "set(0,5)",
        "snap()",
        "set(0,6)",
        "get(0,0)",
        "set(1,10)",
        "snap()",
        "get(0,1)",
        "get(1,1)"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Snaps",
    "value": {
      "length": 2,
      "operations": [
        "set(0,1)",
        "snap()",
        "set(0,2)",
        "snap()",
        "set(0,3)",
        "snap()",
        "get(0,0)",
        "get(0,1)",
        "get(0,2)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Sparse",
    "value": {
      "length": 3,
      "operations": [
        "snap()",
        "set(2,5)",
        "snap()",
        "get(0,0)",
        "get(2,1)"
      ]
    }
  }
];

function generateSnapshotArraySteps(e: any): any[] {
  

let t=e.length||3,a=e.operations||[],s=new StepRecorder({},{}),i=[];for(let e=0;e<t;e++)i[e]=[[0,0]],s.add_new_visual(`hist_${e}_0`,{type:"arrayElement",value:"0:0",position:0,label:String(e)});let r=0,l=(e,t)=>{s.update_variable("op",e),s.update_variable("kind",t),s.update_variable("snapCount",r)};for(let e of(l("","init"),s.record("-",`Start: a SnapshotArray of length ${t}. Each index stores a history of (snap_id, value) pairs, starting as (0, 0). snapCount = 0.`),a))if(e.startsWith("set(")){let a=e.match(/set\((\d+),\s*(\d+)\)/);if(!a)continue;let n=parseInt(a[1]),o=parseInt(a[2]);if(n>=t)continue;let p=i[n],d=p[p.length-1],u=d[0]===r;if(l(`set(${n}, ${o})`,"set"),s.update_variable("index",n),s.update_variable("val",o),s.update_variable("lastSnap",d[0]),s.update_variable("lastVal",d[1]),s.update_variable("lastJ",p.length-1),s.add_conditional("same_snap_id",u),s.record("set_check_snap",`set(${n}, ${o}): the last entry of index ${n} is (${d[0]}, ${d[1]}). Is its snap_id ${d[0]} == snapCount ${r}?`),u)d[1]=o,s.update_visual(`hist_${n}_${p.length-1}`,{type:"arrayElement",value:`${d[0]}:${o}`,position:p.length-1,label:String(n)}),s.update_variable("j",p.length-1),s.record("set_update",`Same snap ${r}, nothing was snapped in between: overwrite the entry in place, (${d[0]}, ${o}).`);else{p.push([r,o]);let e=p.length-1;s.add_new_visual(`hist_${n}_${e}`,{type:"arrayElement",value:`${r}:${o}`,position:e,label:String(n)}),s.update_variable("j",e),s.record("set_append",`The last entry belongs to an older snap: append a new entry (${r}, ${o}) to index ${n}.`)}}else if("snap()"===e){let e=r;r++,l("snap()","snap"),s.update_variable("snapReturn",e),s.update_variable("lastJs",i.map(e=>e.length-1)),s.record("snap_return",`snap(): freeze the current state as snapshot ${e} and return ${e}. snapCount becomes ${r}. No data is copied.`)}else if(e.startsWith("get(")){let a=e.match(/get\((\d+),\s*(\d+)\)/);if(!a)continue;let n=parseInt(a[1]),r=parseInt(a[2]);if(n>=t)continue;let o=i[n],p=0,d=o.length-1;for(s.update_visual("ptr_lo",{type:"pointer",position:p,label:"lo"}),s.update_visual("ptr_hi",{type:"pointer",position:d,label:"hi"}),l(`get(${n}, ${r})`,"get"),s.update_variable("index",n),s.update_variable("snapId",r),s.update_variable("n",o.length),s.update_variable("lo",p),s.update_variable("hi",d),s.record("binary_search_init",`get(${n}, ${r}): index ${n} has ${o.length} entr${1===o.length?"y":"ies"}. Binary search for the largest snap_id <= ${r}: lo = 0, hi = ${d}.`);p<d;){let e=p+Math.floor((d-p+1)/2),t=o[e][0];s.update_visual("ptr_mid",{type:"pointer",position:e,label:"mid"}),s.update_variable("mid",e),s.update_variable("midSnap",t),s.add_conditional("snap_leq",t<=r),s.record("binary_search_mid",`mid = ${p} + (${d} - ${p} + 1) / 2 = ${e}. Is snap_id[${e}] = ${t} <= ${r}?`),t<=r?(p=e,s.update_visual("ptr_lo",{type:"pointer",position:p,label:"lo"}),s.update_variable("lo",p),s.record("binary_search_left",`${t} <= ${r}, entry ${e} is still a candidate. Keep it in range: lo = ${p}.`)):(d=e-1,s.update_visual("ptr_hi",{type:"pointer",position:d,label:"hi"}),s.update_variable("hi",d),s.record("binary_search_right",`${t} > ${r}, entry ${e} was written after the snapshot. Drop it: hi = ${d}.`))}s.delete_visual("ptr_lo"),s.delete_visual("ptr_hi"),s.delete_visual("ptr_mid"),s.update_variable("result",p),s.update_variable("resultSnap",o[p][0]),s.update_variable("resultVal",o[p][1]),s.record("return_result",`lo == hi == ${p}: the value at snapshot ${r} is from entry (${o[p][0]}, ${o[p][1]}). Return ${o[p][1]}.`)}return l("","done"),s.record("complete",`All operations processed. ${r} snapshot${1===r?" was":"s were"} taken.`),s.getSteps()
}

export function SnapshotArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SnapshotArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSnapshotArraySteps(e) as any[];
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
      title="Snapshot Array"
      slug="snapshot-array"
      approaches={approaches}
      presets={SnapshotArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Split Array Largest Sum (split-array-largest-sum)
// ==========================================

const SplitArrayLargestSumTemplates = {
  "python": {
    "language": "python",
    "code": "def splitArray(nums, k):\n    left = max(nums)\n    right = sum(nums)\n\n    while left < right:\n        mid = left + (right - left) // 2\n        if canSplit(nums, k, mid):\n            right = mid\n        else:\n            left = mid + 1\n\n    return left\n\ndef canSplit(nums, k, maxSum):\n    subarrays = 1\n    currentSum = 0\n\n    for num in nums:\n        currentSum += num\n        if currentSum > maxSum:\n            subarrays += 1\n            currentSum = num\n            if subarrays > k:\n                return False\n\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "start_scan": [
        15,
        16
      ],
      "add_to_subarray": [
        19
      ],
      "new_subarray": [
        21,
        22
      ],
      "too_many": [
        24
      ],
      "search_left": [
        8
      ],
      "search_right": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "can_split": [
        7
      ],
      "exceeds_mid": [
        20
      ],
      "too_many_subarrays": [
        23
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int splitArray(int[] nums, int k) {\n    int left = 0;\n    long right = 0;\n    for (int num : nums) {\n        left = Math.max(left, num);\n        right += num;\n    }\n\n    while (left < right) {\n        long mid = left + (right - left) / 2;\n        if (canSplit(nums, k, mid)) {\n            right = mid;\n        } else {\n            left = (int) mid + 1;\n        }\n    }\n\n    return left;\n}\n\nprivate boolean canSplit(int[] nums, int k, long maxSum) {\n    int subarrays = 1;\n    long currentSum = 0;\n\n    for (int num : nums) {\n        currentSum += num;\n        if (currentSum > maxSum) {\n            subarrays++;\n            currentSum = num;\n            if (subarrays > k) return false;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3,
        4,
        5,
        6
      ],
      "calculate_mid": [
        10
      ],
      "start_scan": [
        22,
        23
      ],
      "add_to_subarray": [
        26
      ],
      "new_subarray": [
        28,
        29
      ],
      "too_many": [
        30
      ],
      "search_left": [
        12
      ],
      "search_right": [
        14
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "can_split": [
        11
      ],
      "exceeds_mid": [
        27
      ],
      "too_many_subarrays": [
        30
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int splitArray(vector<int>& nums, int k) {\n    int left = *max_element(nums.begin(), nums.end());\n    long right = accumulate(nums.begin(), nums.end(), 0L);\n\n    while (left < right) {\n        long mid = left + (right - left) / 2;\n        if (canSplit(nums, k, mid)) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}\n\nbool canSplit(vector<int>& nums, int k, long maxSum) {\n    int subarrays = 1;\n    long currentSum = 0;\n\n    for (int num : nums) {\n        currentSum += num;\n        if (currentSum > maxSum) {\n            subarrays++;\n            currentSum = num;\n            if (subarrays > k) return false;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "start_scan": [
        18,
        19
      ],
      "add_to_subarray": [
        22
      ],
      "new_subarray": [
        24,
        25
      ],
      "too_many": [
        26
      ],
      "search_left": [
        8
      ],
      "search_right": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "can_split": [
        7
      ],
      "exceeds_mid": [
        23
      ],
      "too_many_subarrays": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int SplitArray(int[] nums, int k) {\n    int left = nums.Max();\n    long right = nums.Sum();\n\n    while (left < right) {\n        long mid = left + (right - left) / 2;\n        if (CanSplit(nums, k, mid)) {\n            right = mid;\n        } else {\n            left = (int)(mid + 1);\n        }\n    }\n\n    return left;\n}\n\nprivate bool CanSplit(int[] nums, int k, long maxSum) {\n    int subarrays = 1;\n    long currentSum = 0;\n\n    foreach (int num in nums) {\n        currentSum += num;\n        if (currentSum > maxSum) {\n            subarrays++;\n            currentSum = num;\n            if (subarrays > k) return false;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "start_scan": [
        18,
        19
      ],
      "add_to_subarray": [
        22
      ],
      "new_subarray": [
        24,
        25
      ],
      "too_many": [
        26
      ],
      "search_left": [
        8
      ],
      "search_right": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "can_split": [
        7
      ],
      "exceeds_mid": [
        23
      ],
      "too_many_subarrays": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func splitArray(nums []int, k int) int {\n    left := 0\n    right := 0\n    for _, num := range nums {\n        if num > left {\n            left = num\n        }\n        right += num\n    }\n\n    for left < right {\n        mid := left + (right-left)/2\n        if canSplit(nums, k, mid) {\n            right = mid\n        } else {\n            left = mid + 1\n        }\n    }\n\n    return left\n}\n\nfunc canSplit(nums []int, k int, maxSum int) bool {\n    subarrays := 1\n    currentSum := 0\n\n    for _, num := range nums {\n        currentSum += num\n        if currentSum > maxSum {\n            subarrays++\n            currentSum = num\n            if subarrays > k {\n                return false\n            }\n        }\n    }\n\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "calculate_mid": [
        12
      ],
      "start_scan": [
        24,
        25
      ],
      "add_to_subarray": [
        28
      ],
      "new_subarray": [
        30,
        31
      ],
      "too_many": [
        32,
        33
      ],
      "search_left": [
        14
      ],
      "search_right": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        11
      ],
      "can_split": [
        13
      ],
      "exceeds_mid": [
        29
      ],
      "too_many_subarrays": [
        32
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function splitArray(nums, k) {\n    let left = Math.max(...nums);\n    let right = nums.reduce((a, b) => a + b, 0);\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (canSplit(nums, k, mid)) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}\n\nfunction canSplit(nums, k, maxSum) {\n    let subarrays = 1;\n    let currentSum = 0;\n\n    for (const num of nums) {\n        currentSum += num;\n        if (currentSum > maxSum) {\n            subarrays++;\n            currentSum = num;\n            if (subarrays > k) return false;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "start_scan": [
        18,
        19
      ],
      "add_to_subarray": [
        22
      ],
      "new_subarray": [
        24,
        25
      ],
      "too_many": [
        26
      ],
      "search_left": [
        8
      ],
      "search_right": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "can_split": [
        7
      ],
      "exceeds_mid": [
        23
      ],
      "too_many_subarrays": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function splitArray(nums: number[], k: number): number {\n    let left = Math.max(...nums);\n    let right = nums.reduce((a, b) => a + b, 0);\n\n    while (left < right) {\n        const mid = left + Math.floor((right - left) / 2);\n        if (canSplit(nums, k, mid)) {\n            right = mid;\n        } else {\n            left = mid + 1;\n        }\n    }\n\n    return left;\n}\n\nfunction canSplit(nums: number[], k: number, maxSum: number): boolean {\n    let subarrays = 1;\n    let currentSum = 0;\n\n    for (const num of nums) {\n        currentSum += num;\n        if (currentSum > maxSum) {\n            subarrays++;\n            currentSum = num;\n            if (subarrays > k) return false;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_range": [
        2,
        3
      ],
      "calculate_mid": [
        6
      ],
      "start_scan": [
        18,
        19
      ],
      "add_to_subarray": [
        22
      ],
      "new_subarray": [
        24,
        25
      ],
      "too_many": [
        26
      ],
      "search_left": [
        8
      ],
      "search_right": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "can_split": [
        7
      ],
      "exceeds_mid": [
        23
      ],
      "too_many_subarrays": [
        26
      ]
    }
  }
};

const SplitArrayLargestSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        7,
        2,
        5,
        10,
        8
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
        3,
        4,
        5
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "k = n",
    "value": {
      "nums": [
        1,
        4,
        4
      ],
      "k": 3
    }
  },
  {
    "id": "ex4",
    "label": "6 elements",
    "value": {
      "nums": [
        10,
        5,
        13,
        4,
        8,
        4
      ],
      "k": 3
    }
  },
  {
    "id": "ex5",
    "label": "Small values",
    "value": {
      "nums": [
        2,
        3,
        1,
        1,
        1,
        1
      ],
      "k": 2
    }
  }
];

function generateSplitArrayLargestSumSteps(e: any): any[] {
  

let t=[...e.nums],i=e.k,n=t.length,a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=new StepRecorder({nums:t,k:i,left:void 0,right:void 0,mid:void 0,subarrays:void 0,currentSum:void 0,result:void 0},{...a,meta_info:{type:"metadata",value:`k = ${i} (max subarrays allowed)`}});l.record("-",`Split array into at most ${i} subarrays to minimize the largest subarray sum`);let s=0,u=0;for(let e=0;e<n;e++)s=Math.max(s,t[e]),u+=t[e];for(l.update_variable("left",s),l.update_variable("right",u),l.add_new_visual("meta_range",{type:"metadata",value:`Binary search range: [${s}, ${u}]`}),l.record("init_range",`Initialize left = ${s} (max element), right = ${u} (total sum)`);s<u;){l.add_conditional("while_loop",!0);let e=s+Math.floor((u-s)/2);l.update_variable("mid",e),l.update_visual("meta_range",{type:"metadata",value:`Testing maxSum = ${e} | Range: [${s}, ${u}]`}),l.record("calculate_mid",`Calculate mid = ${e}. Can we split into <= ${i} subarrays each with sum <= ${e}?`);let r=1,a=0;l.update_variable("subarrays",r),l.update_variable("currentSum",a);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e});l.add_new_visual("meta_scan",{type:"metadata",value:"Subarray 1: sum = 0"}),l.record("start_scan","Start feasibility check: subarrays = 1, currentSum = 0");let o=!0;for(let s=0;s<n;s++)if(l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"highlight"}),l.add_new_visual("ptr_i",{type:"pointer",position:s,label:"i"}),a+t[s]>e){l.add_conditional("exceeds_mid",!0);for(let e=0;e<s;e++){let i=l.get_visual(`elem_${e}`);i&&"active"===i.state&&l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"sorted"})}if(r++,a=t[s],l.update_variable("subarrays",r),l.update_variable("currentSum",a),l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),r>i){l.add_conditional("too_many_subarrays",!0),l.update_visual("meta_scan",{type:"metadata",value:`Subarray ${r}: sum = ${a} (exceeded k = ${i}!)`}),l.record("too_many",`Adding ${t[s]} exceeds ${e}. New subarray #${r} > k = ${i}. Not feasible!`),o=!1;break}l.add_conditional("too_many_subarrays",!1),l.update_visual("meta_scan",{type:"metadata",value:`Subarray ${r}: sum = ${a}`}),l.record("new_subarray",`Adding ${t[s]} would exceed ${e}. Start subarray #${r}, currentSum = ${t[s]}`)}else l.add_conditional("exceeds_mid",!1),a+=t[s],l.update_variable("currentSum",a),l.update_visual(`elem_${s}`,{type:"arrayElement",value:t[s],position:s,state:"active"}),l.update_visual("meta_scan",{type:"metadata",value:`Subarray ${r}: sum = ${a}`}),l.record("add_to_subarray",`Add nums[${s}] = ${t[s]}, currentSum = ${a} <= ${e}. Continue subarray #${r}`);if(l.delete_visual("ptr_i"),l.delete_visual("meta_scan"),o){l.add_conditional("can_split",!0);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"sorted"});l.update_visual("meta_range",{type:"metadata",value:`maxSum = ${e}: ${r} subarrays <= ${i}. Feasible!`}),u=e,l.update_variable("right",u),l.record("search_left",`Feasible with ${r} subarrays. Try smaller maxSum: right = ${u}`)}else{l.add_conditional("can_split",!1);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"inactive"});l.update_visual("meta_range",{type:"metadata",value:`maxSum = ${e}: needed > ${i} subarrays. Not feasible.`}),s=e+1,l.update_variable("left",s),l.record("search_right",`Not feasible. Need larger maxSum: left = ${s}`)}}l.add_conditional("while_loop",!1),l.update_variable("result",s);for(let e=0;e<n;e++)l.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});return l.update_visual("meta_range",{type:"metadata",value:`Answer: ${s} (minimized largest subarray sum)`}),l.record("complete",`Binary search complete. Minimum largest subarray sum = ${s}`),l.getSteps()
}

export function SplitArrayLargestSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SplitArrayLargestSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSplitArrayLargestSumSteps(e) as any[];
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
      title="Split Array Largest Sum"
      slug="split-array-largest-sum"
      approaches={approaches}
      presets={SplitArrayLargestSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Time Based Key-Value Store (time-based-key-value-store)
// ==========================================

const TimeBasedKeyValueStoreTemplates = {
  "python": {
    "language": "python",
    "code": "class TimeMap:\n    def __init__(self):\n        # Map each key to parallel lists of timestamps and values\n        self.times = {}\n        self.vals = {}\n\n    def set(self, key: str, value: str, timestamp: int) -> None:\n        if key not in self.times:\n            self.times[key] = []\n            self.vals[key] = []\n        self.times[key].append(timestamp)\n        self.vals[key].append(value)\n\n    def get(self, key: str, timestamp: int) -> str:\n        if key not in self.times:\n            return \"\"\n        ts = self.times[key]\n        vs = self.vals[key]\n\n        # Binary search for largest timestamp <= query timestamp\n        left, right, result = 0, len(ts) - 1, -1\n        while left <= right:\n            mid = (left + right) // 2\n            if ts[mid] <= timestamp:\n                result = mid    # Valid candidate, look for a larger one\n                left = mid + 1\n            else:\n                right = mid - 1 # Too large, search left half\n        return \"\" if result == -1 else vs[result]",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "set_append": [
        8,
        9,
        10,
        11,
        12
      ],
      "get_not_found": [
        15,
        16
      ],
      "binary_search_init": [
        20,
        21
      ],
      "binary_search_mid": [
        23
      ],
      "binary_search_left": [
        25,
        26
      ],
      "binary_search_right": [
        28
      ],
      "binary_search_found": [
        29
      ],
      "binary_search_miss": [
        29
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        15
      ],
      "mid_leq_timestamp": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class TimeMap {\n    // Map each key to parallel lists of timestamps and values\n    Map<String, List<Integer>> timeMap;\n    Map<String, List<String>> valMap;\n\n    public TimeMap() {\n        timeMap = new HashMap<>();\n        valMap = new HashMap<>();\n    }\n\n    public void set(String key, String value, int timestamp) {\n        timeMap.computeIfAbsent(key, k -> new ArrayList<>()).add(timestamp);\n        valMap.computeIfAbsent(key, k -> new ArrayList<>()).add(value);\n    }\n\n    public String get(String key, int timestamp) {\n        if (!timeMap.containsKey(key)) return \"\";\n        List<Integer> times = timeMap.get(key);\n        List<String> vals = valMap.get(key);\n\n        // Binary search for largest timestamp <= query timestamp\n        int left = 0, right = times.size() - 1, result = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (times.get(mid) <= timestamp) {\n                result = mid;    // This timestamp is valid, but there might be a larger one\n                left = mid + 1;\n            } else {\n                right = mid - 1; // This timestamp is too large\n            }\n        }\n        return result == -1 ? \"\" : vals.get(result);\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9
      ],
      "set_append": [
        12,
        13
      ],
      "get_not_found": [
        17
      ],
      "binary_search_init": [
        21,
        22
      ],
      "binary_search_mid": [
        24
      ],
      "binary_search_left": [
        26,
        27
      ],
      "binary_search_right": [
        29
      ],
      "binary_search_found": [
        32
      ],
      "binary_search_miss": [
        32
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        17
      ],
      "mid_leq_timestamp": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class TimeMap {\n    // Map each key to parallel vectors of timestamps and values\n    unordered_map<string, vector<int>> times;\n    unordered_map<string, vector<string>> vals;\npublic:\n    TimeMap() {}\n\n    void set(string key, string value, int timestamp) {\n        times[key].push_back(timestamp);\n        vals[key].push_back(value);\n    }\n\n    string get(string key, int timestamp) {\n        if (times.find(key) == times.end()) return \"\";\n        auto& ts = times[key];\n        auto& vs = vals[key];\n\n        // Binary search for largest timestamp <= query timestamp\n        int left = 0, right = ts.size() - 1, result = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (ts[mid] <= timestamp) {\n                result = mid;    // Valid candidate, look for a larger one\n                left = mid + 1;\n            } else {\n                right = mid - 1; // Too large, search left half\n            }\n        }\n        return result == -1 ? \"\" : vs[result];\n    }\n};",
    "lineMap": {
      "-": [
        2,
        3,
        4
      ],
      "set_append": [
        9,
        10
      ],
      "get_not_found": [
        14
      ],
      "binary_search_init": [
        18,
        19
      ],
      "binary_search_mid": [
        21
      ],
      "binary_search_left": [
        23,
        24
      ],
      "binary_search_right": [
        26
      ],
      "binary_search_found": [
        29
      ],
      "binary_search_miss": [
        29
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        14
      ],
      "mid_leq_timestamp": [
        22
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class TimeMap {\n    // Map each key to parallel lists of timestamps and values\n    Dictionary<string, List<int>> times;\n    Dictionary<string, List<string>> vals;\n\n    public TimeMap() {\n        times = new Dictionary<string, List<int>>();\n        vals = new Dictionary<string, List<string>>();\n    }\n\n    public void Set(string key, string value, int timestamp) {\n        if (!times.ContainsKey(key)) {\n            times[key] = new List<int>();\n            vals[key] = new List<string>();\n        }\n        times[key].Add(timestamp);\n        vals[key].Add(value);\n    }\n\n    public string Get(string key, int timestamp) {\n        if (!times.ContainsKey(key)) return \"\";\n        var ts = times[key];\n        var vs = vals[key];\n\n        // Binary search for largest timestamp <= query timestamp\n        int left = 0, right = ts.Count - 1, result = -1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (ts[mid] <= timestamp) {\n                result = mid;    // Valid candidate, look for a larger one\n                left = mid + 1;\n            } else {\n                right = mid - 1; // Too large, search left half\n            }\n        }\n        return result == -1 ? \"\" : vs[result];\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9
      ],
      "set_append": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "get_not_found": [
        21
      ],
      "binary_search_init": [
        25,
        26
      ],
      "binary_search_mid": [
        28
      ],
      "binary_search_left": [
        30,
        31
      ],
      "binary_search_right": [
        33
      ],
      "binary_search_found": [
        36
      ],
      "binary_search_miss": [
        36
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        21
      ],
      "mid_leq_timestamp": [
        29
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type TimeMap struct {\n    // Map each key to parallel slices of timestamps and values\n    times  map[string][]int\n    values map[string][]string\n}\n\nfunc Constructor() TimeMap {\n    return TimeMap{\n        times:  make(map[string][]int),\n        values: make(map[string][]string),\n    }\n}\n\nfunc (t *TimeMap) Set(key string, value string, timestamp int) {\n    t.times[key] = append(t.times[key], timestamp)\n    t.values[key] = append(t.values[key], value)\n}\n\nfunc (t *TimeMap) Get(key string, timestamp int) string {\n    ts, ok := t.times[key]\n    if !ok {\n        return \"\"\n    }\n    vs := t.values[key]\n\n    // Binary search for largest timestamp <= query timestamp\n    left, right, result := 0, len(ts)-1, -1\n    for left <= right {\n        mid := left + (right-left)/2\n        if ts[mid] <= timestamp {\n            result = mid    // Valid candidate, look for a larger one\n            left = mid + 1\n        } else {\n            right = mid - 1 // Too large, search left half\n        }\n    }\n    if result == -1 {\n        return \"\"\n    }\n    return vs[result]\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11,
        12
      ],
      "set_append": [
        15,
        16
      ],
      "get_not_found": [
        20,
        21,
        22
      ],
      "binary_search_init": [
        26,
        27
      ],
      "binary_search_mid": [
        29
      ],
      "binary_search_left": [
        31,
        32
      ],
      "binary_search_right": [
        34
      ],
      "binary_search_found": [
        40
      ],
      "binary_search_miss": [
        37,
        38
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        21
      ],
      "mid_leq_timestamp": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var TimeMap = function () {\n  // Map each key to parallel arrays of timestamps and values\n  this.times = new Map();\n  this.vals = new Map();\n};\n\nTimeMap.prototype.set = function (key, value, timestamp) {\n  if (!this.times.has(key)) {\n    this.times.set(key, []);\n    this.vals.set(key, []);\n  }\n  this.times.get(key).push(timestamp);\n  this.vals.get(key).push(value);\n};\n\nTimeMap.prototype.get = function (key, timestamp) {\n  if (!this.times.has(key)) return \"\";\n  const ts = this.times.get(key);\n  const vs = this.vals.get(key);\n\n  // Binary search for largest timestamp <= query timestamp\n  let left = 0,\n    right = ts.length - 1,\n    result = -1;\n  while (left <= right) {\n    const mid = (left + right) >> 1;\n    if (ts[mid] <= timestamp) {\n      result = mid; // Valid candidate, look for a larger one\n      left = mid + 1;\n    } else {\n      right = mid - 1; // Too large, search left half\n    }\n  }\n  return result === -1 ? \"\" : vs[result];\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "set_append": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "get_not_found": [
        17
      ],
      "binary_search_init": [
        21,
        22,
        23,
        24
      ],
      "binary_search_mid": [
        26
      ],
      "binary_search_left": [
        28,
        29
      ],
      "binary_search_right": [
        31
      ],
      "binary_search_found": [
        34
      ],
      "binary_search_miss": [
        34
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        17
      ],
      "mid_leq_timestamp": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class TimeMap {\n    // Map each key to parallel arrays of timestamps and values\n    private times: Map<string, number[]>;\n    private vals: Map<string, string[]>;\n\n    constructor() {\n        this.times = new Map();\n        this.vals = new Map();\n    }\n\n    set(key: string, value: string, timestamp: number): void {\n        if (!this.times.has(key)) {\n            this.times.set(key, []);\n            this.vals.set(key, []);\n        }\n        this.times.get(key)!.push(timestamp);\n        this.vals.get(key)!.push(value);\n    }\n\n    get(key: string, timestamp: number): string {\n        if (!this.times.has(key)) return \"\";\n        const ts = this.times.get(key)!;\n        const vs = this.vals.get(key)!;\n\n        // Binary search for largest timestamp <= query timestamp\n        let left = 0, right = ts.length - 1, result = -1;\n        while (left <= right) {\n            const mid = (left + right) >> 1;\n            if (ts[mid] <= timestamp) {\n                result = mid;    // Valid candidate, look for a larger one\n                left = mid + 1;\n            } else {\n                right = mid - 1; // Too large, search left half\n            }\n        }\n        return result === -1 ? \"\" : vs[result];\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7,
        8,
        9
      ],
      "set_append": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "get_not_found": [
        21
      ],
      "binary_search_init": [
        25,
        26
      ],
      "binary_search_mid": [
        28
      ],
      "binary_search_left": [
        30,
        31
      ],
      "binary_search_right": [
        33
      ],
      "binary_search_found": [
        36
      ],
      "binary_search_miss": [
        36
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "key_missing": [
        21
      ],
      "mid_leq_timestamp": [
        29
      ]
    }
  }
};

const TimeBasedKeyValueStorePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "set(foo,bar,1)",
        "get(foo,1)",
        "get(foo,3)",
        "set(foo,bar2,4)",
        "get(foo,4)",
        "get(foo,5)"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Keys",
    "value": {
      "operations": [
        "set(a,v1,1)",
        "set(b,v2,2)",
        "set(a,v3,3)",
        "get(a,2)",
        "get(b,3)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Edge Cases",
    "value": {
      "operations": [
        "get(foo,1)",
        "set(foo,bar,2)",
        "get(foo,1)",
        "get(foo,2)",
        "get(foo,3)"
      ]
    }
  }
];

function generateTimeBasedKeyValueStoreSteps(e: any): any[] {
  

let t=e.operations||[],a={},s=[],r=new StepRecorder({},{}),n=(e,t)=>{r.update_variable("op",e),r.update_variable("kind",t),r.update_variable("keys",s)};for(let e of(r.update_variable("mode","binarySearch"),n("","init"),r.record("-","Start: each key keeps its (timestamp, value) pairs in append order, so timestamps are sorted. get() binary searches for the newest timestamp <= t."),t)){let t=function(e){let t=e.match(/^set\((\w+),(\w+),(\d+)\)$/);if(t)return{type:"set",key:t[1],value:t[2],timestamp:parseInt(t[3])};let a=e.match(/^get\((\w+),(\d+)\)$/);if(a)return{type:"get",key:a[1],timestamp:parseInt(a[2])};throw Error(`Invalid operation: ${e}`)}(e);if("set"===t.type){let{key:e,value:i,timestamp:l}=t;a[e]||(a[e]=[],s.push(e));let o=a[e].length;a[e].push({t:l,v:i}),r.add_new_visual(`entry_${e}_${o}`,{type:"arrayElement",value:`${l}:${i}`,position:o,label:e}),n(`set("${e}", "${i}", ${l})`,"set"),r.update_variable("key",e),r.update_variable("t",l),r.update_variable("val",i),r.update_variable("idx",o),r.record("set_append",`set("${e}", "${i}", ${l}): append (${l}, "${i}") to store["${e}"].`)}else{let{key:e,timestamp:i}=t,s=e in a&&a[e].length>0;if(n(`get("${e}", ${i})`,"get"),r.update_variable("key",e),r.update_variable("t",i),!s){r.add_conditional("key_missing",!0),r.record("get_not_found",`get("${e}", ${i}): "${e}" is not in the store. Return "".`);continue}let l=a[e],o=0,p=l.length-1,m=-1;for(r.update_visual("ptr_left",{type:"pointer",position:o,label:"L"}),r.update_visual("ptr_right",{type:"pointer",position:p,label:"R"}),r.update_variable("n",l.length),r.update_variable("left",o),r.update_variable("right",p),r.update_variable("result",m),r.add_conditional("key_missing",!1),r.record("binary_search_init",`get("${e}", ${i}): "${e}" has ${l.length} entr${1===l.length?"y":"ies"}. Binary search for the largest timestamp <= ${i}: L = 0, R = ${p}.`);o<=p;){let e=o+Math.floor((p-o)/2),t=l[e].t;r.update_visual("ptr_mid",{type:"pointer",position:e,label:"M"}),r.update_variable("mid",e),r.update_variable("midTs",t),r.add_conditional("mid_leq_timestamp",t<=i),r.record("binary_search_mid",`mid = (${o} + ${p}) / 2 = ${e}. Is ts[${e}] = ${t} <= ${i}?`),t<=i?(m=e,o=e+1,r.update_visual("ptr_left",{type:"pointer",position:o,label:"L"}),r.update_variable("result",m),r.update_variable("resultVal",l[m].v),r.update_variable("left",o),r.record("binary_search_left",`${t} <= ${i}, entry ${e} is a valid answer. result = ${e}, keep searching newer: L = ${o}.`)):(p=e-1,r.update_visual("ptr_right",{type:"pointer",position:p,label:"R"}),r.update_variable("right",p),r.record("binary_search_right",`${t} > ${i}, entry ${e} is too new. Search older half: R = ${p}.`))}r.delete_visual("ptr_left"),r.delete_visual("ptr_right"),r.delete_visual("ptr_mid"),-1!==m?(r.update_variable("result",m),r.update_variable("resultVal",l[m].v),r.update_variable("resultTs",l[m].t),r.record("binary_search_found",`The largest timestamp <= ${i} is ts[${m}] = ${l[m].t}. Return "${l[m].v}".`)):r.record("binary_search_miss",`Every timestamp under "${e}" is > ${i}, so there is no valid entry. Return "".`)}}return n("","done"),r.record("complete","All operations processed."),r.getSteps()
}

export function TimeBasedKeyValueStoreProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TimeBasedKeyValueStoreTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTimeBasedKeyValueStoreSteps(e) as any[];
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
      title="Time Based Key-Value Store"
      slug="time-based-key-value-store"
      approaches={approaches}
      presets={TimeBasedKeyValueStorePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Perfect Square (valid-perfect-square)
// ==========================================

const ValidPerfectSquareTemplates = {
  "python": {
    "language": "python",
    "code": "def isPerfectSquare(num):\n    left = 1\n    right = num\n    while left <= right:\n        mid = left + (right - left) // 2\n        square = mid * mid\n        if square == num:\n            return True\n        if square < num:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "calculate_mid": [
        5,
        6
      ],
      "found": [
        7,
        8
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        13
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "square_equals_num": [
        7
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isPerfectSquare(int num) {\n    long left = 1, right = num;\n    while (left <= right) {\n        long mid = left + (right - left) / 2;\n        long square = mid * mid;\n        if (square == num) {\n            return true;\n        }\n        if (square < num) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isPerfectSquare(int num) {\n    long left = 1, right = num;\n    while (left <= right) {\n        long mid = left + (right - left) / 2;\n        long square = mid * mid;\n        if (square == num) {\n            return true;\n        }\n        if (square < num) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsPerfectSquare(int num) {\n    long left = 1, right = num;\n    while (left <= right) {\n        long mid = left + (right - left) / 2;\n        long square = mid * mid;\n        if (square == num) {\n            return true;\n        }\n        if (square < num) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isPerfectSquare(num int) bool {\n    left, right := 1, num\n    for left <= right {\n        mid := left + (right - left) / 2\n        square := mid * mid\n        if square == num {\n            return true\n        }\n        if square < num {\n            left = mid + 1\n        } else {\n            right = mid - 1\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isPerfectSquare(num) {\n    let left = 1, right = num;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const square = mid * mid;\n        if (square === num) {\n            return true;\n        }\n        if (square < num) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isPerfectSquare(num: number): boolean {\n    let left = 1, right = num;\n    while (left <= right) {\n        const mid = left + Math.floor((right - left) / 2);\n        const square = mid * mid;\n        if (square === num) {\n            return true;\n        }\n        if (square < num) {\n            left = mid + 1;\n        } else {\n            right = mid - 1;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "calculate_mid": [
        4,
        5
      ],
      "found": [
        6,
        7
      ],
      "search_right": [
        9,
        10
      ],
      "search_left": [
        11,
        12
      ],
      "not_found": [
        15
      ]
    },
    "conditionalMap": {
      "while_loop": [
        3
      ],
      "square_equals_num": [
        6
      ],
      "square_less_than_num": [
        9
      ]
    }
  }
};

const ValidPerfectSquarePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Perfect square (16)",
    "value": {
      "num": 16
    }
  },
  {
    "id": "ex2",
    "label": "Not perfect square (14)",
    "value": {
      "num": 14
    }
  },
  {
    "id": "ex3",
    "label": "Perfect square (1)",
    "value": {
      "num": 1
    }
  },
  {
    "id": "ex4",
    "label": "Large perfect square (49)",
    "value": {
      "num": 49
    }
  }
];

function generateValidPerfectSquareSteps(e: any): any[] {
  

let t=e.num,a=new StepRecorder({num:t,left:void 0,right:void 0,mid:void 0,square:void 0,result:void 0},{meta_num:{type:"metadata",value:t,label:"num"}});a.record("-",`Start: Check if ${t} is a perfect square`);let l=1,n=t;for(a.update_variable("left",l),a.update_variable("right",n),a.add_new_visual("box_left",{type:"arrayElement",value:l,position:0,label:"left"}),a.add_new_visual("box_mid",{type:"arrayElement",value:"?",position:1,label:"mid"}),a.add_new_visual("box_right",{type:"arrayElement",value:n,position:2,label:"right"}),a.add_new_visual("meta_square",{type:"metadata",value:"—",label:"mid\xb2"}),a.add_new_visual("meta_comparison",{type:"metadata",value:"—",label:"comparison"}),a.record("initialize",`Initialize left = 1, right = ${t}`);l<=n;){a.add_conditional("while_loop",!0);let e=l+Math.floor((n-l)/2),i=e*e;if(a.update_variable("mid",e),a.update_variable("square",i),a.update_visual("box_left",{type:"arrayElement",value:l,position:0,label:"left"}),a.update_visual("box_mid",{type:"arrayElement",value:e,position:1,label:"mid",state:"highlight"}),a.update_visual("box_right",{type:"arrayElement",value:n,position:2,label:"right"}),a.update_visual("meta_square",{type:"metadata",value:`${e} \u00D7 ${e} = ${i}`,label:"mid\xb2"}),a.update_visual("meta_comparison",{type:"metadata",value:"—",label:"comparison"}),a.record("calculate_mid",`Calculate mid = ${e}, square = ${e} \u00D7 ${e} = ${i}`),i===t)return a.add_conditional("square_equals_num",!0),a.update_visual("box_mid",{type:"arrayElement",value:e,position:1,label:"mid",state:"active"}),a.update_visual("meta_comparison",{type:"metadata",value:`${i} == ${t} \u2713`,label:"comparison",state:"active"}),a.update_variable("result",!0),a.record("found",`${i} == ${t}. ${t} is a perfect square! (${e} \u00D7 ${e})`),a.getSteps();a.add_conditional("square_equals_num",!1),i<t?(a.add_conditional("square_less_than_num",!0),l=e+1,a.update_variable("left",l),a.update_visual("box_mid",{type:"arrayElement",value:e,position:1,label:"mid",state:"muted"}),a.update_visual("meta_comparison",{type:"metadata",value:`${i} < ${t} \u2192 search right`,label:"comparison"}),a.update_visual("box_left",{type:"arrayElement",value:l,position:0,label:"left"}),a.record("search_right",`${i} < ${t}. Set left = mid + 1 = ${l}`)):(a.add_conditional("square_less_than_num",!1),n=e-1,a.update_variable("right",n),a.update_visual("box_mid",{type:"arrayElement",value:e,position:1,label:"mid",state:"muted"}),a.update_visual("meta_comparison",{type:"metadata",value:`${i} > ${t} \u2192 search left`,label:"comparison"}),a.update_visual("box_right",{type:"arrayElement",value:n,position:2,label:"right"}),a.record("search_left",`${i} > ${t}. Set right = mid - 1 = ${n}`))}return a.add_conditional("while_loop",!1),a.update_variable("result",!1),a.update_visual("box_left",{type:"arrayElement",value:l,position:0,label:"left",state:"muted"}),a.update_visual("box_mid",{type:"arrayElement",value:"—",position:1,label:"mid",state:"muted"}),a.update_visual("box_right",{type:"arrayElement",value:n,position:2,label:"right",state:"muted"}),a.update_visual("meta_comparison",{type:"metadata",value:"left > right → not a perfect square",label:"comparison",state:"muted"}),a.record("not_found",`left (${l}) > right (${n}). ${t} is not a perfect square.`),a.getSteps()
}

export function ValidPerfectSquareProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidPerfectSquareTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidPerfectSquareSteps(e) as any[];
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
      title="Valid Perfect Square"
      slug="valid-perfect-square"
      approaches={approaches}
      presets={ValidPerfectSquarePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Median of Two Sorted Arrays (median-of-two-sorted-arrays)
// ==========================================

const MedianOfTwoSortedArraysTemplates = {
  "python": {
    "language": "python",
    "code": "def findMedianSortedArrays(nums1, nums2):\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n\n    m, n = len(nums1), len(nums2)\n    left, right = 0, m\n    half = (m + n + 1) // 2\n\n    while left <= right:\n        i = left + (right - left) // 2\n        j = half - i\n\n        maxLeft1 = float('-inf') if i == 0 else nums1[i - 1]\n        minRight1 = float('inf') if i == m else nums1[i]\n        maxLeft2 = float('-inf') if j == 0 else nums2[j - 1]\n        minRight2 = float('inf') if j == n else nums2[j]\n\n        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:\n            if (m + n) % 2 == 1:\n                return max(maxLeft1, maxLeft2)\n            return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2\n        elif maxLeft1 > minRight2:\n            right = i - 1\n        else:\n            left = i + 1\n\n    return 0.0",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        5,
        6,
        7
      ],
      "calculate_partition": [
        10,
        11
      ],
      "get_boundaries": [
        13,
        14,
        15,
        16
      ],
      "return_median": [
        19,
        20,
        21
      ],
      "move_right_left": [
        23
      ],
      "move_left_right": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "valid_partition": [
        18
      ],
      "odd_total": [
        19
      ],
      "move_left": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    if (nums1.length > nums2.length) {\n        return findMedianSortedArrays(nums2, nums1);\n    }\n\n    int m = nums1.length, n = nums2.length;\n    int left = 0, right = m;\n    int half = (m + n + 1) / 2;\n\n    while (left <= right) {\n        int i = left + (right - left) / 2;\n        int j = half - i;\n\n        int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];\n        int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];\n        int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];\n        int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];\n\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 1) {\n                return Math.max(maxLeft1, maxLeft2);\n            }\n            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;\n        } else if (maxLeft1 > minRight2) {\n            right = i - 1;\n        } else {\n            left = i + 1;\n        }\n    }\n\n    return 0.0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17
      ],
      "return_median": [
        20,
        21,
        23
      ],
      "move_right_left": [
        25
      ],
      "move_left_right": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        19
      ],
      "odd_total": [
        20
      ],
      "move_left": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    if (nums1.size() > nums2.size()) {\n        return findMedianSortedArrays(nums2, nums1);\n    }\n\n    int m = nums1.size(), n = nums2.size();\n    int left = 0, right = m;\n    int half = (m + n + 1) / 2;\n\n    while (left <= right) {\n        int i = left + (right - left) / 2;\n        int j = half - i;\n\n        int maxLeft1 = (i == 0) ? INT_MIN : nums1[i - 1];\n        int minRight1 = (i == m) ? INT_MAX : nums1[i];\n        int maxLeft2 = (j == 0) ? INT_MIN : nums2[j - 1];\n        int minRight2 = (j == n) ? INT_MAX : nums2[j];\n\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 1) {\n                return max(maxLeft1, maxLeft2);\n            }\n            return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;\n        } else if (maxLeft1 > minRight2) {\n            right = i - 1;\n        } else {\n            left = i + 1;\n        }\n    }\n\n    return 0.0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17
      ],
      "return_median": [
        20,
        21,
        23
      ],
      "move_right_left": [
        25
      ],
      "move_left_right": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        19
      ],
      "odd_total": [
        20
      ],
      "move_left": [
        24
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public double FindMedianSortedArrays(int[] nums1, int[] nums2) {\n    if (nums1.Length > nums2.Length) {\n        return FindMedianSortedArrays(nums2, nums1);\n    }\n\n    int m = nums1.Length, n = nums2.Length;\n    int left = 0, right = m;\n    int half = (m + n + 1) / 2;\n\n    while (left <= right) {\n        int i = left + (right - left) / 2;\n        int j = half - i;\n\n        int maxLeft1 = (i == 0) ? int.MinValue : nums1[i - 1];\n        int minRight1 = (i == m) ? int.MaxValue : nums1[i];\n        int maxLeft2 = (j == 0) ? int.MinValue : nums2[j - 1];\n        int minRight2 = (j == n) ? int.MaxValue : nums2[j];\n\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 1) {\n                return Math.Max(maxLeft1, maxLeft2);\n            }\n            return (Math.Max(maxLeft1, maxLeft2) + Math.Min(minRight1, minRight2)) / 2.0;\n        } else if (maxLeft1 > minRight2) {\n            right = i - 1;\n        } else {\n            left = i + 1;\n        }\n    }\n\n    return 0.0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17
      ],
      "return_median": [
        20,
        21,
        23
      ],
      "move_right_left": [
        25
      ],
      "move_left_right": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        19
      ],
      "odd_total": [
        20
      ],
      "move_left": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {\n    if len(nums1) > len(nums2) {\n        return findMedianSortedArrays(nums2, nums1)\n    }\n\n    m, n := len(nums1), len(nums2)\n    left, right := 0, m\n    half := (m + n + 1) / 2\n\n    for left <= right {\n        i := left + (right - left) / 2\n        j := half - i\n\n        maxLeft1 := math.MinInt32\n        if i > 0 { maxLeft1 = nums1[i-1] }\n        minRight1 := math.MaxInt32\n        if i < m { minRight1 = nums1[i] }\n        maxLeft2 := math.MinInt32\n        if j > 0 { maxLeft2 = nums2[j-1] }\n        minRight2 := math.MaxInt32\n        if j < n { minRight2 = nums2[j] }\n\n        if maxLeft1 <= minRight2 && maxLeft2 <= minRight1 {\n            if (m+n)%2 == 1 {\n                return float64(max(maxLeft1, maxLeft2))\n            }\n            return float64(max(maxLeft1, maxLeft2)+min(minRight1, minRight2)) / 2.0\n        } else if maxLeft1 > minRight2 {\n            right = i - 1\n        } else {\n            left = i + 1\n        }\n    }\n\n    return 0.0\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21
      ],
      "return_median": [
        24,
        25,
        27
      ],
      "move_right_left": [
        29
      ],
      "move_left_right": [
        31
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        23
      ],
      "odd_total": [
        24
      ],
      "move_left": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findMedianSortedArrays(nums1, nums2) {\n    if (nums1.length > nums2.length) {\n        return findMedianSortedArrays(nums2, nums1);\n    }\n\n    const m = nums1.length, n = nums2.length;\n    let left = 0, right = m;\n    const half = Math.floor((m + n + 1) / 2);\n\n    while (left <= right) {\n        const i = Math.floor(left + (right - left) / 2);\n        const j = half - i;\n\n        const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n        const minRight1 = i === m ? Infinity : nums1[i];\n        const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n        const minRight2 = j === n ? Infinity : nums2[j];\n\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 === 1) {\n                return Math.max(maxLeft1, maxLeft2);\n            }\n            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n        } else if (maxLeft1 > minRight2) {\n            right = i - 1;\n        } else {\n            left = i + 1;\n        }\n    }\n\n    return 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17
      ],
      "return_median": [
        20,
        21,
        23
      ],
      "move_right_left": [
        25
      ],
      "move_left_right": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        19
      ],
      "odd_total": [
        20
      ],
      "move_left": [
        24
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n    if (nums1.length > nums2.length) {\n        return findMedianSortedArrays(nums2, nums1);\n    }\n\n    const m = nums1.length, n = nums2.length;\n    let left = 0, right = m;\n    const half = Math.floor((m + n + 1) / 2);\n\n    while (left <= right) {\n        const i = Math.floor(left + (right - left) / 2);\n        const j = half - i;\n\n        const maxLeft1 = i === 0 ? -Infinity : nums1[i - 1];\n        const minRight1 = i === m ? Infinity : nums1[i];\n        const maxLeft2 = j === 0 ? -Infinity : nums2[j - 1];\n        const minRight2 = j === n ? Infinity : nums2[j];\n\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 === 1) {\n                return Math.max(maxLeft1, maxLeft2);\n            }\n            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n        } else if (maxLeft1 > minRight2) {\n            right = i - 1;\n        } else {\n            left = i + 1;\n        }\n    }\n\n    return 0;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "swap": [
        2,
        3
      ],
      "initialize": [
        6,
        7,
        8
      ],
      "calculate_partition": [
        11,
        12
      ],
      "get_boundaries": [
        14,
        15,
        16,
        17
      ],
      "return_median": [
        20,
        21,
        23
      ],
      "move_right_left": [
        25
      ],
      "move_left_right": [
        27
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        10
      ],
      "valid_partition": [
        19
      ],
      "odd_total": [
        20
      ],
      "move_left": [
        24
      ]
    }
  }
};

const MedianOfTwoSortedArraysPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums1": [
        1,
        3,
        5
      ],
      "nums2": [
        2,
        4,
        6,
        8
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Even total",
    "value": {
      "nums1": [
        1,
        2
      ],
      "nums2": [
        3,
        4
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Odd total",
    "value": {
      "nums1": [
        1,
        3
      ],
      "nums2": [
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All zeros",
    "value": {
      "nums1": [
        0,
        0
      ],
      "nums2": [
        0,
        0
      ]
    }
  },
  {
    "id": "ex5",
    "label": "No overlap",
    "value": {
      "nums1": [
        1,
        2,
        3,
        4
      ],
      "nums2": [
        5,
        6
      ]
    }
  }
];

function generateMedianOfTwoSortedArraysSteps(e: any): any[] {
  

let t=[...e.nums1],n=[...e.nums2],a={};t.forEach((e,t)=>{a[`a_${t}`]={type:"arrayElement",value:e,position:t}}),n.forEach((e,t)=>{a[`b_${t}`]={type:"arrayElement",value:e,position:t}}),a.label_a={type:"metadata",value:"nums1"},a.label_b={type:"metadata",value:"nums2"};let l=new StepRecorder({nums1:t,nums2:n,left:void 0,right:void 0,i:void 0,j:void 0,maxLeft1:void 0,minRight1:void 0,maxLeft2:void 0,minRight2:void 0,median:void 0},a);if(l.record("-",`Find median of two sorted arrays: [${t}] and [${n}]`),t.length>n.length){let e=t;t=n,n=e,l.update_variable("nums1",t),l.update_variable("nums2",n);let i=Math.max(t.length,n.length);for(let e=0;e<i;e++)l.delete_visual(`a_${e}`),l.delete_visual(`b_${e}`);t.forEach((e,t)=>{l.add_new_visual(`a_${t}`,{type:"arrayElement",value:e,position:t})}),n.forEach((e,t)=>{l.add_new_visual(`b_${t}`,{type:"arrayElement",value:e,position:t})}),l.update_visual("label_a",{type:"metadata",value:"nums1 (swapped)"}),l.update_visual("label_b",{type:"metadata",value:"nums2 (swapped)"}),l.record("swap",`Swap arrays so nums1 is smaller. nums1=[${t}], nums2=[${n}]`)}let r=t.length,o=n.length,s=0,u=r,m=Math.floor((r+o+1)/2);for(l.update_variable("left",s),l.update_variable("right",u),l.add_new_visual("ptr_left",{type:"pointer",position:s,label:"left"}),l.add_new_visual("ptr_right",{type:"pointer",position:u,label:"right"}),l.record("initialize",`Initialize: m=${r}, n=${o}, left=0, right=${r}, half=${m}`);s<=u;){l.add_conditional("while_loop",!0);let e=Math.floor((s+u)/2),i=m-e;l.update_variable("i",e),l.update_variable("j",i);for(let n=0;n<r;n++)l.update_visual(`a_${n}`,{type:"arrayElement",value:t[n],position:n,state:n<e?"highlight":void 0});for(let e=0;e<o;e++)l.update_visual(`b_${e}`,{type:"arrayElement",value:n[e],position:e,state:e<i?"highlight":void 0});l.record("calculate_partition",`Partition: i=${e}, j=${i}. Left half has ${m} elements total.`);let a=0===e?-1/0:t[e-1],d=e===r?1/0:t[e],h=0===i?-1/0:n[i-1],c=i===o?1/0:n[i],f=a===-1/0?"-Inf":String(a),p=d===1/0?"+Inf":String(d),g=h===-1/0?"-Inf":String(h),_=c===1/0?"+Inf":String(c);if(l.update_variable("maxLeft1",a===-1/0?"-Inf":a),l.update_variable("minRight1",d===1/0?"+Inf":d),l.update_variable("maxLeft2",h===-1/0?"-Inf":h),l.update_variable("minRight2",c===1/0?"+Inf":c),e>0&&l.update_visual(`a_${e-1}`,{type:"arrayElement",value:t[e-1],position:e-1,state:"info",label:"maxL1"}),e<r&&l.update_visual(`a_${e}`,{type:"arrayElement",value:t[e],position:e,state:"reading",label:"minR1"}),i>0&&l.update_visual(`b_${i-1}`,{type:"arrayElement",value:n[i-1],position:i-1,state:"info",label:"maxL2"}),i<o&&l.update_visual(`b_${i}`,{type:"arrayElement",value:n[i],position:i,state:"reading",label:"minR2"}),l.record("get_boundaries",`Boundaries: maxLeft1=${f}, minRight1=${p}, maxLeft2=${g}, minRight2=${_}`),a<=c&&h<=d){let s;if(l.add_conditional("valid_partition",!0),(r+o)%2==1)l.add_conditional("odd_total",!0),s=Math.max(a,h),l.update_variable("median",s),a>=h&&e>0?l.update_visual(`a_${e-1}`,{type:"arrayElement",value:t[e-1],position:e-1,state:"active",label:"median"}):i>0&&l.update_visual(`b_${i-1}`,{type:"arrayElement",value:n[i-1],position:i-1,state:"active",label:"median"}),l.record("return_median",`Odd total length. Median = max(${f}, ${g}) = ${s}`);else{l.add_conditional("odd_total",!1);let u=Math.max(a,h),m=Math.min(d,c);s=(u+m)/2,l.update_variable("median",s),a>=h&&e>0?l.update_visual(`a_${e-1}`,{type:"arrayElement",value:t[e-1],position:e-1,state:"active",label:"median"}):i>0&&l.update_visual(`b_${i-1}`,{type:"arrayElement",value:n[i-1],position:i-1,state:"active",label:"median"}),d<=c&&e<r?l.update_visual(`a_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active",label:"median"}):i<o&&l.update_visual(`b_${i}`,{type:"arrayElement",value:n[i],position:i,state:"active",label:"median"}),l.record("return_median",`Even total length. Median = (${u} + ${m}) / 2 = ${s}`)}return l.delete_visual("ptr_left"),l.delete_visual("ptr_right"),l.record("complete",`Median of the two sorted arrays is ${s}`),l.getSteps()}a>c?(l.add_conditional("valid_partition",!1),l.add_conditional("move_left",!0),u=e-1,l.update_variable("right",u),l.update_visual("ptr_right",{type:"pointer",position:u,label:"right"}),l.record("move_right_left",`maxLeft1 (${f}) > minRight2 (${_}). Move right: right = ${u}`)):(l.add_conditional("valid_partition",!1),l.add_conditional("move_left",!1),s=e+1,l.update_variable("left",s),l.update_visual("ptr_left",{type:"pointer",position:s,label:"left"}),l.record("move_left_right",`maxLeft2 (${g}) > minRight1 (${p}). Move left: left = ${s}`))}return l.add_conditional("while_loop",!1),l.record("complete","No valid partition found."),l.getSteps()
}

export function MedianOfTwoSortedArraysProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MedianOfTwoSortedArraysTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMedianOfTwoSortedArraysSteps(e) as any[];
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
      title="Median of Two Sorted Arrays"
      slug="median-of-two-sorted-arrays"
      approaches={approaches}
      presets={MedianOfTwoSortedArraysPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Random Pick with Weight (random-pick-with-weight)
// ==========================================

const RandomPickWithWeightTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def __init__(self, w):\n        self.prefix_sum = []\n        running_sum = 0\n        for weight in w:\n            running_sum += weight\n            self.prefix_sum.append(running_sum)\n        self.total_weight = running_sum\n\n    def pickIndex(self):\n        target = random.randint(1, self.total_weight)\n        left = 0\n        right = len(self.prefix_sum)\n        while left < right:\n            mid = left + (right - left) // 2\n            if self.prefix_sum[mid] < target:\n                left = mid + 1\n            else:\n                right = mid\n        return left",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        3,
        4,
        5,
        6,
        7
      ],
      "show_total": [
        8
      ],
      "pick_target": [
        11
      ],
      "init_search": [
        12,
        13
      ],
      "calculate_mid": [
        15
      ],
      "search_right": [
        17
      ],
      "search_left": [
        19
      ],
      "found_index": [
        20
      ]
    },
    "conditionalMap": {
      "while_loop": [
        14
      ],
      "prefix_less_than_target": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int[] prefixSum;\n    private int totalWeight;\n    private Random random;\n\n    public Solution(int[] w) {\n        prefixSum = new int[w.length];\n        random = new Random();\n        prefixSum[0] = w[0];\n        for (int i = 1; i < w.length; i++) {\n            prefixSum[i] = prefixSum[i - 1] + w[i];\n        }\n        totalWeight = prefixSum[w.length - 1];\n    }\n\n    public int pickIndex() {\n        int target = random.nextInt(totalWeight) + 1;\n        int left = 0;\n        int right = prefixSum.length;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (prefixSum[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        9,
        10,
        11
      ],
      "show_total": [
        13
      ],
      "pick_target": [
        17
      ],
      "init_search": [
        18,
        19
      ],
      "calculate_mid": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left": [
        25
      ],
      "found_index": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        20
      ],
      "prefix_less_than_target": [
        22
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\n    vector<int> prefixSum;\n    int totalWeight;\n\npublic:\n    Solution(vector<int>& w) {\n        prefixSum.resize(w.size());\n        prefixSum[0] = w[0];\n        for (int i = 1; i < w.size(); i++) {\n            prefixSum[i] = prefixSum[i - 1] + w[i];\n        }\n        totalWeight = prefixSum.back();\n    }\n\n    int pickIndex() {\n        int target = rand() % totalWeight + 1;\n        int left = 0;\n        int right = prefixSum.size();\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (prefixSum[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return left;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9,
        10
      ],
      "show_total": [
        12
      ],
      "pick_target": [
        16
      ],
      "init_search": [
        17,
        18
      ],
      "calculate_mid": [
        20
      ],
      "search_right": [
        22
      ],
      "search_left": [
        24
      ],
      "found_index": [
        27
      ]
    },
    "conditionalMap": {
      "while_loop": [
        19
      ],
      "prefix_less_than_target": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[] prefixSum;\n    private int totalWeight;\n    private Random random;\n\n    public Solution(int[] w) {\n        prefixSum = new int[w.Length];\n        random = new Random();\n        prefixSum[0] = w[0];\n        for (int i = 1; i < w.Length; i++) {\n            prefixSum[i] = prefixSum[i - 1] + w[i];\n        }\n        totalWeight = prefixSum[w.Length - 1];\n    }\n\n    public int PickIndex() {\n        int target = random.Next(1, totalWeight + 1);\n        int left = 0;\n        int right = prefixSum.Length;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (prefixSum[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        9,
        10,
        11
      ],
      "show_total": [
        13
      ],
      "pick_target": [
        17
      ],
      "init_search": [
        18,
        19
      ],
      "calculate_mid": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left": [
        25
      ],
      "found_index": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        20
      ],
      "prefix_less_than_target": [
        22
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Solution struct {\n    prefixSum   []int\n    totalWeight int\n}\n\nfunc Constructor(w []int) Solution {\n    prefixSum := make([]int, len(w))\n    prefixSum[0] = w[0]\n    for i := 1; i < len(w); i++ {\n        prefixSum[i] = prefixSum[i-1] + w[i]\n    }\n    totalWeight := prefixSum[len(w)-1]\n    return Solution{prefixSum, totalWeight}\n}\n\nfunc (s *Solution) PickIndex() int {\n    target := rand.Intn(s.totalWeight) + 1\n    left := 0\n    right := len(s.prefixSum)\n    for left < right {\n        mid := left + (right-left) / 2\n        if s.prefixSum[mid] < target {\n            left = mid + 1\n        } else {\n            right = mid\n        }\n    }\n    return left\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9,
        10
      ],
      "show_total": [
        12
      ],
      "pick_target": [
        17
      ],
      "init_search": [
        18,
        19
      ],
      "calculate_mid": [
        21
      ],
      "search_right": [
        23
      ],
      "search_left": [
        25
      ],
      "found_index": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        20
      ],
      "prefix_less_than_target": [
        22
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class Solution {\n    constructor(w) {\n        this.prefixSum = new Array(w.length);\n        this.prefixSum[0] = w[0];\n        for (let i = 1; i < w.length; i++) {\n            this.prefixSum[i] = this.prefixSum[i - 1] + w[i];\n        }\n        this.totalWeight = this.prefixSum[w.length - 1];\n    }\n\n    pickIndex() {\n        const target = Math.floor(Math.random() * this.totalWeight) + 1;\n        let left = 0;\n        let right = this.prefixSum.length;\n        while (left < right) {\n            const mid = left + Math.floor((right - left) / 2);\n            if (this.prefixSum[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        4,
        5,
        6
      ],
      "show_total": [
        8
      ],
      "pick_target": [
        12
      ],
      "init_search": [
        13,
        14
      ],
      "calculate_mid": [
        16
      ],
      "search_right": [
        18
      ],
      "search_left": [
        20
      ],
      "found_index": [
        23
      ]
    },
    "conditionalMap": {
      "while_loop": [
        15
      ],
      "prefix_less_than_target": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class Solution {\n    private prefixSum: number[];\n    private totalWeight: number;\n\n    constructor(w: number[]) {\n        this.prefixSum = new Array(w.length);\n        this.prefixSum[0] = w[0];\n        for (let i = 1; i < w.length; i++) {\n            this.prefixSum[i] = this.prefixSum[i - 1] + w[i];\n        }\n        this.totalWeight = this.prefixSum[w.length - 1];\n    }\n\n    pickIndex(): number {\n        const target = Math.floor(Math.random() * this.totalWeight) + 1;\n        let left = 0;\n        let right = this.prefixSum.length;\n        while (left < right) {\n            const mid = left + Math.floor((right - left) / 2);\n            if (this.prefixSum[mid] < target) {\n                left = mid + 1;\n            } else {\n                right = mid;\n            }\n        }\n        return left;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        7,
        8,
        9
      ],
      "show_total": [
        11
      ],
      "pick_target": [
        15
      ],
      "init_search": [
        16,
        17
      ],
      "calculate_mid": [
        19
      ],
      "search_right": [
        21
      ],
      "search_left": [
        23
      ],
      "found_index": [
        26
      ]
    },
    "conditionalMap": {
      "while_loop": [
        18
      ],
      "prefix_less_than_target": [
        20
      ]
    }
  }
};

const RandomPickWithWeightPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "weights": [
        1,
        3,
        2,
        4
      ],
      "target": 7
    }
  },
  {
    "id": "ex2",
    "label": "Equal weights",
    "value": {
      "weights": [
        2,
        2,
        2,
        2
      ],
      "target": 5
    }
  },
  {
    "id": "ex3",
    "label": "Single weight",
    "value": {
      "weights": [
        5
      ],
      "target": 3
    }
  },
  {
    "id": "ex4",
    "label": "Large first",
    "value": {
      "weights": [
        10,
        1,
        1
      ],
      "target": 4
    }
  }
];

function generateRandomPickWithWeightSteps(e: any): any[] {
  

let t=[...e.weights],i=e.target,l=t.length,n=t.reduce((e,t)=>e+t,0),r=t.map(e=>e*l/n),o=Array(l).fill(null),s=Array(l).fill(-1),d=new StepRecorder({weights:t,n:l,W:n,scaled:[...r],prob:[...o],alias:[...s],small:[],large:[],s:void 0,l:void 0,column:void 0,coin:void 0,coinStays:void 0,result:void 0},{});d.record("-","Build the alias table with Vose's algorithm, then pick in O(1)"),d.record("scale",`Scale each weight by n / total = ${l} / ${n}. Every column now averages 1.`);let p=[],c=[];for(let e=0;e<l;e++)(r[e]<1?p:c).push(e);for(d.update_variable("small",[...p]),d.update_variable("large",[...c]),d.record("partition",`Split into small (scaled < 1) = [${p.join(", ")}] and large = [${c.join(", ")}]`);p.length>0&&c.length>0;){let e=p.pop(),t=c.pop();o[e]=r[e],s[e]=t,r[t]=r[t]-(1-r[e]);let i=r[t]<1;(i?p:c).push(t),d.update_variable("s",e),d.update_variable("l",t),d.update_variable("prob",[...o]),d.update_variable("alias",[...s]),d.update_variable("scaled",[...r]),d.update_variable("small",[...p]),d.update_variable("large",[...c]),d.add_conditional("pair_small",i),d.record("pair",`Column ${e}: prob = ${o[e].toFixed(2)}, alias = ${t}. Take ${(1-o[e]).toFixed(2)} from ${t}; ${t} is now ${i?"small":"still large"}.`)}for(let e of[...p,...c])o[e]=1,s[e]=e;d.update_variable("prob",[...o]),d.update_variable("alias",[...s]),d.update_variable("s",void 0),d.update_variable("l",void 0),d.record("finalize","Remaining columns are exactly full: prob = 1. Alias table is complete.");let u=(i-1)/n,h=u*l,f=Math.min(l-1,Math.floor(h)),g=h-Math.floor(h);d.update_variable("column",f),d.update_variable("coin",g),d.record("pick_target",`Pick: choose column = floor(${l} * ${u.toFixed(3)}) = ${f}, coin = ${g.toFixed(3)}`);let m=g<o[f],x=m?f:s[f];return d.update_variable("coinStays",m),d.add_conditional("coin_stays",m),d.record("coin_flip",`coin ${g.toFixed(3)} ${m?"<":">="} prob[${f}] = ${o[f].toFixed(2)} -> ${m?`stay at ${f}`:`jump to alias ${s[f]}`}`),d.update_variable("result",x),d.add_new_visual("meta_result",{type:"metadata",value:x}),d.record("found_index",`Picked index = ${x} (weight ${t[x]}).`),d.getSteps()
}

export function RandomPickWithWeightProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RandomPickWithWeightTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRandomPickWithWeightSteps(e) as any[];
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
      title="Random Pick with Weight"
      slug="random-pick-with-weight"
      approaches={approaches}
      presets={RandomPickWithWeightPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
