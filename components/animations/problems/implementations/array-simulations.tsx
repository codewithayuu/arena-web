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
    if (item.type === "arrayElement" || item.type === "element") {
      elements.push({
        value: item.value,
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
// Move Zeroes (move-zeroes)
// ==========================================

const MoveZeroesTemplates = {
  "python": {
    "language": "python",
    "code": "def moveZeroes(nums: List[int]) -> None:\n    insert_pos = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            # Only swap when the element isn't already in position\n            if i != insert_pos:\n                nums[insert_pos] = nums[i]\n                nums[i] = 0\n            insert_pos += 1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void moveZeroes(int[] nums) {\n    int insertPos = 0;\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] != 0) {\n            // Only swap when the element isn't already in position\n            if (i != insertPos) {\n                nums[insertPos] = nums[i];\n                nums[i] = 0;\n            }\n            insertPos++;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void moveZeroes(vector<int>& nums) {\n    int insertPos = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        if (nums[i] != 0) {\n            // Only swap when the element isn't already in position\n            if (i != insertPos) {\n                nums[insertPos] = nums[i];\n                nums[i] = 0;\n            }\n            insertPos++;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void MoveZeroes(int[] nums) {\n    int insertPos = 0;\n    for (int i = 0; i < nums.Length; i++) {\n        if (nums[i] != 0) {\n            // Only swap when the element isn't already in position\n            if (i != insertPos) {\n                nums[insertPos] = nums[i];\n                nums[i] = 0;\n            }\n            insertPos++;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func moveZeroes(nums []int) {\n    insertPos := 0\n    for i := 0; i < len(nums); i++ {\n        if nums[i] != 0 {\n            // Only swap when the element isn't already in position\n            if i != insertPos {\n                nums[insertPos] = nums[i]\n                nums[i] = 0\n            }\n            insertPos++\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var moveZeroes = function(nums) {\n    var insertPos = 0;\n    for (var i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            // Only swap when the element isn't already in position\n            if (i !== insertPos) {\n                nums[insertPos] = nums[i];\n                nums[i] = 0;\n            }\n            insertPos++;\n        }\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function moveZeroes(nums: number[]): void {\n    let insertPos = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            // Only swap when the element isn't already in position\n            if (i !== insertPos) {\n                nums[insertPos] = nums[i];\n                nums[i] = 0;\n            }\n            insertPos++;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check_element": [
        3
      ],
      "swap": [
        7,
        8
      ],
      "increment_write": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_non_zero": [
        4
      ],
      "is_not_same_pos": [
        6
      ]
    }
  }
};

const MoveZeroesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        2,
        1,
        0,
        0,
        4,
        0,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        0,
        1,
        0,
        3,
        12
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        0,
        0,
        1
      ]
    }
  }
];

function generateMoveZeroesSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,s=(e,i,s,r)=>{let o={};for(let l=0;l<n;l++){let n;n=r&&(l===r[0]||l===r[1])?"swapping":l===s?"reading":l<e?"placed":l<i?"stale":"idle",o[`elem_${l}`]={type:"arrayElement",value:t[l],position:l,state:n}}return o},r=(e,t,n,i,r=null)=>{for(let[o,l]of Object.entries(s(t,n,i,r)))e.update_visual(o,l)},o=new StepRecorder({nums:[...t]},{...s(0,0,-1,null)});o.record("-","Start of algorithm");let l=0;o.add_new_variable("insertPos",l),n>0&&o.update_visual("insertPos",{type:"pointer",position:l,label:"insertPos"}),o.record("initialize","Initialize insertPos to 0");for(let e=0;e<n;e++){let i=0!==t[e];if(o.add_new_variable("i",e),o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.add_conditional("is_non_zero",i),r(o,l,e,e),o.record("check_element",`Check nums[${e}] = ${t[e]}`),i){let i=t[e],s=t[l];[t[l],t[e]]=[t[e],t[l]],o.update_variable("nums",[...t]),r(o,l,e+1,-1,[l,e]),o.record("swap",l===e?`nums[${e}] = ${i} is already in place, swap with itself`:`Swap nums[${l}] (${s}) with nums[${e}] (${i})`),l++,o.update_variable("insertPos",l),o.update_visual("insertPos",{type:"pointer",position:Math.min(l,Math.max(n-1,0)),label:"insertPos"}),r(o,l,e+1,-1),o.record("advance",`Advance insertPos to ${l}`)}}return o.delete_visual("i"),o.delete_visual("insertPos"),r(o,l,n,-1),o.record("complete","All zeros moved to the end"),o.getSteps()
}

export function MoveZeroesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MoveZeroesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMoveZeroesSteps(e) as any[];
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
      title="Move Zeroes"
      slug="move-zeroes"
      approaches={approaches}
      presets={MoveZeroesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Majority Element (majority-element)
// ==========================================

const MajorityElementTemplates = {
  "python": {
    "language": "python",
    "code": "def majorityElement(nums: List[int]) -> int:\n    n = len(nums)\n    for i in range(n):\n        candidate = nums[i]\n        count = 0\n        for j in range(n):\n            if nums[j] == candidate:\n                count += 1\n        if count > n // 2:\n            return candidate\n    return -1",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int majorityElement(int[] nums) {\n    int n = nums.length;\n    for (int i = 0; i < n; i++) {\n        int candidate = nums[i];\n        int count = 0;\n        for (int j = 0; j < n; j++) {\n            if (nums[j] == candidate) {\n                count++;\n            }\n        }\n        if (count > n / 2) {\n            return candidate;\n        }\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int majorityElement(vector<int>& nums) {\n    int n = nums.size();\n    for (int i = 0; i < n; i++) {\n        int candidate = nums[i];\n        int count = 0;\n        for (int j = 0; j < n; j++) {\n            if (nums[j] == candidate) {\n                count++;\n            }\n        }\n        if (count > n / 2) {\n            return candidate;\n        }\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MajorityElement(int[] nums) {\n    int n = nums.Length;\n    for (int i = 0; i < n; i++) {\n        int candidate = nums[i];\n        int count = 0;\n        for (int j = 0; j < n; j++) {\n            if (nums[j] == candidate) {\n                count++;\n            }\n        }\n        if (count > n / 2) {\n            return candidate;\n        }\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func majorityElement(nums []int) int {\n    n := len(nums)\n    for i := 0; i < n; i++ {\n        candidate := nums[i]\n        count := 0\n        for j := 0; j < n; j++ {\n            if nums[j] == candidate {\n                count++\n            }\n        }\n        if count > n/2 {\n            return candidate\n        }\n    }\n    return -1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var majorityElement = function(nums) {\n    var n = nums.length;\n    for (var i = 0; i < n; i++) {\n        var candidate = nums[i];\n        var count = 0;\n        for (var j = 0; j < n; j++) {\n            if (nums[j] === candidate) {\n                count++;\n            }\n        }\n        if (count > n / 2) {\n            return candidate;\n        }\n    }\n    return -1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function majorityElement(nums: number[]): number {\n    const n = nums.length;\n    for (let i = 0; i < n; i++) {\n        const candidate = nums[i];\n        let count = 0;\n        for (let j = 0; j < n; j++) {\n            if (nums[j] === candidate) {\n                count++;\n            }\n        }\n        if (count > n / 2) {\n            return candidate;\n        }\n    }\n    return -1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "pick_candidate": [
        4,
        5
      ],
      "scan_element": [
        6
      ],
      "check_majority": [
        11
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_match": [
        7
      ],
      "is_majority": [
        11
      ]
    }
  }
};

const MajorityElementPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "arr": [
        2,
        2,
        1,
        1,
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Majority at Start",
    "value": {
      "arr": [
        5,
        5,
        5,
        5,
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Majority at End",
    "value": {
      "arr": [
        1,
        2,
        3,
        7,
        7,
        7,
        7
      ]
    }
  }
];

function generateMajorityElementSteps(e: any): any[] {
  let t=Array.isArray(e?.arr)?[...e.arr]:[],a=t.length,i=t[0],l=1,r=0,o=t.reduce((e,t,a)=>(e[`element_${a}`]={type:"arrayElement",value:t,position:a},e),{}),u=new StepRecorder({arr:t,n:a,candidate:i,count:l,i:void 0},{...o,meta_candidate:{type:"metadata",value:i},meta_count:{type:"metadata",value:l},meta_flash:{type:"metadata",value:null}}),s=(e,n)=>{for(let l=0;l<a;l++){let a;l===n?a="active":l<r?a="discarded":l<=e&&(a=t[l]===i?l===r?"crown":"votedFor":"votedAgainst"),u.update_visual(`element_${l}`,{type:"arrayElement",value:t[l],position:l,...a&&{state:a}})}};u.record("-","Start: Find the majority element using Boyer-Moore Voting Algorithm"),s(0),u.update_visual("meta_flash",{type:"metadata",value:"new"}),u.record("init_candidate",`Initialize: candidate = ${i}, count = ${l}`);for(let e=1;e<a;e++)u.update_variable("i",e),u.update_visual("i",{type:"pointer",position:e,label:"i"}),u.update_visual("meta_flash",{type:"metadata",value:null}),s(e-1,e),u.record("check_element",`Check element at index ${e}: arr[${e}] = ${t[e]}`),0===l?(i=t[e],l=1,r=e,u.update_variable("candidate",i),u.update_variable("count",l),u.update_visual("meta_candidate",{type:"metadata",value:i}),u.update_visual("meta_count",{type:"metadata",value:l}),u.update_visual("meta_flash",{type:"metadata",value:"new"}),s(e),u.record("new_candidate",`Count is 0: discard the cancelled prefix, new candidate = ${i}`)):t[e]===i?(l++,u.update_variable("count",l),u.update_visual("meta_count",{type:"metadata",value:l}),u.update_visual("meta_flash",{type:"metadata",value:"up"}),s(e),u.add_conditional("match",!0),u.record("increment_count",`arr[${e}] = ${t[e]} matches candidate ${i}, increment count to ${l}`)):(l--,u.update_variable("count",l),u.update_visual("meta_count",{type:"metadata",value:l}),u.update_visual("meta_flash",{type:"metadata",value:"down"}),s(e),u.add_conditional("match",!1),u.record("decrement_count",`arr[${e}] = ${t[e]} differs from candidate ${i}, decrement count to ${l}`));u.delete_visual("i");for(let e=0;e<a;e++)u.update_visual(`element_${e}`,{type:"arrayElement",value:t[e],position:e,state:t[e]===i?"majority":"faded"});return u.update_visual("meta_flash",{type:"metadata",value:"result"}),u.record("complete",`Complete: The majority element is ${i}`),u.getSteps()
}

export function MajorityElementProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MajorityElementTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMajorityElementSteps(e) as any[];
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
      title="Majority Element"
      slug="majority-element"
      approaches={approaches}
      presets={MajorityElementPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Duplicates from Sorted Array (remove-duplicates-from-sorted-array)
// ==========================================

const RemoveDuplicatesFromSortedArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def removeDuplicates(nums: List[int]) -> int:\n    if not nums:\n        return 0\n\n    insert_pos = 1\n\n    for i in range(1, len(nums)):\n        # Found a new unique value, place it at insert_pos\n        if nums[i] != nums[insert_pos - 1]:\n            nums[insert_pos] = nums[i]\n            insert_pos += 1\n\n    return insert_pos",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        5
      ],
      "check_element": [
        9
      ],
      "copy_element": [
        10
      ],
      "advance": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_unique": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int removeDuplicates(int[] nums) {\n    if (nums.length == 0) return 0;\n\n    int insertPos = 1;\n\n    for (int i = 1; i < nums.length; i++) {\n        // Found a new unique value, place it at insertPos\n        if (nums[i] != nums[insertPos - 1]) {\n            nums[insertPos] = nums[i];\n            insertPos++;\n        }\n    }\n\n    return insertPos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4
      ],
      "check_element": [
        8
      ],
      "copy_element": [
        9
      ],
      "advance": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_unique": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int removeDuplicates(vector<int>& nums) {\n    if (nums.empty()) return 0;\n\n    int insertPos = 1;\n\n    for (int i = 1; i < nums.size(); i++) {\n        // Found a new unique value, place it at insertPos\n        if (nums[i] != nums[insertPos - 1]) {\n            nums[insertPos] = nums[i];\n            insertPos++;\n        }\n    }\n\n    return insertPos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4
      ],
      "check_element": [
        8
      ],
      "copy_element": [
        9
      ],
      "advance": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_unique": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int RemoveDuplicates(int[] nums) {\n    if (nums.Length == 0) return 0;\n\n    int insertPos = 1;\n\n    for (int i = 1; i < nums.Length; i++) {\n        // Found a new unique value, place it at insertPos\n        if (nums[i] != nums[insertPos - 1]) {\n            nums[insertPos] = nums[i];\n            insertPos++;\n        }\n    }\n\n    return insertPos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4
      ],
      "check_element": [
        8
      ],
      "copy_element": [
        9
      ],
      "advance": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_unique": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeDuplicates(nums []int) int {\n    if len(nums) == 0 {\n        return 0\n    }\n\n    insertPos := 1\n\n    for i := 1; i < len(nums); i++ {\n        // Found a new unique value, place it at insertPos\n        if nums[i] != nums[insertPos-1] {\n            nums[insertPos] = nums[i]\n            insertPos++\n        }\n    }\n\n    return insertPos\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        6
      ],
      "check_element": [
        10
      ],
      "copy_element": [
        11
      ],
      "advance": [
        12
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_unique": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var removeDuplicates = function(nums) {\n    if (nums.length === 0) return 0;\n\n    var insertPos = 1;\n\n    for (var i = 1; i < nums.length; i++) {\n        // Found a new unique value, place it at insertPos\n        if (nums[i] !== nums[insertPos - 1]) {\n            nums[insertPos] = nums[i];\n            insertPos++;\n        }\n    }\n\n    return insertPos;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4
      ],
      "check_element": [
        8
      ],
      "copy_element": [
        9
      ],
      "advance": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_unique": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeDuplicates(nums: number[]): number {\n    if (nums.length === 0) return 0;\n\n    let insertPos = 1;\n\n    for (let i = 1; i < nums.length; i++) {\n        // Found a new unique value, place it at insertPos\n        if (nums[i] !== nums[insertPos - 1]) {\n            nums[insertPos] = nums[i];\n            insertPos++;\n        }\n    }\n\n    return insertPos;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        4
      ],
      "check_element": [
        8
      ],
      "copy_element": [
        9
      ],
      "advance": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_unique": [
        8
      ]
    }
  }
};

const RemoveDuplicatesFromSortedArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        0,
        0,
        1,
        1,
        1,
        2,
        2,
        3,
        3,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Duplicates",
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
    "label": "No Duplicates",
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

function generateRemoveDuplicatesFromSortedArraySteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,r=[],s=[],l=(e,i)=>{let r={};for(let s=0;s<n;s++){let n;s===i?n="active":s<e?n="placed":i>=0&&s<i&&(n="dim"),r[`elem_${s}`]={type:"arrayElement",value:t[s],position:s,...n&&{state:n}}}return r},a=(e,t,n,i,r)=>{let s;for(let[a,o]of Object.entries({...l(n,i),...(s={},t.forEach((e,t)=>{s[`seen_${t}`]={type:"arrayElement",value:e,position:t,state:t===r?"active":"placed"}}),s)}))e.update_visual(a,o)},o=new StepRecorder({nums:[...t]},{...l(0,-1),meta_phase:{type:"metadata",value:"seen"}});o.record("-","Start of algorithm"),o.add_new_variable("seen",[]),o.record("initialize","Create an empty set");for(let e=0;e<n;e++){let n=t[e],i=!r.includes(n);o.update_variable("readPos",e),o.update_visual("readPos",{type:"pointer",position:e,label:"readPos"}),o.add_conditional("is_new",i),a(o,r,0,e,i?-1:r.indexOf(n)),o.record("check_element",i?`nums[${e}] = ${n} is not in the set yet`:`nums[${e}] = ${n} is already in the set, adding it changes nothing`),i&&(r.push(n),o.update_variable("seen",[...r]),a(o,r,0,e,r.length-1),o.record("add_to_set",`Add ${n} to the set`))}o.delete_visual("readPos"),o.update_variable("readPos",void 0),s=[...r],o.add_new_variable("unique",[...s]),o.update_visual("meta_phase",{type:"metadata",value:"unique"}),a(o,s,0,-1,-1),o.record("build_list",`Copy the ${s.length} set values into a list`),s.sort((e,t)=>e-t),o.update_variable("unique",[...s]),a(o,s,0,-1,-1),o.record("sort_unique","A set gives no ordering guarantee, so sort the list before writing it back");for(let e=0;e<s.length;e++)t[e]=s[e],o.update_variable("i",e),o.update_variable("nums",[...t]),o.update_visual("i",{type:"pointer",position:e,label:"i"}),a(o,s,e+1,-1,e),o.record("write_back",`Write unique[${e}] = ${s[e]} to nums[${e}]`);return o.add_new_variable("result",s.length),o.delete_visual("i"),a(o,s,s.length,-1,-1),o.record("complete",`Found ${s.length} unique elements`),o.getSteps()
}

export function RemoveDuplicatesFromSortedArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveDuplicatesFromSortedArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveDuplicatesFromSortedArraySteps(e) as any[];
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
      title="Remove Duplicates from Sorted Array"
      slug="remove-duplicates-from-sorted-array"
      approaches={approaches}
      presets={RemoveDuplicatesFromSortedArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Best Time to Buy and Sell Stock (best-time-to-buy-and-sell-stock)
// ==========================================

const BestTimeToBuyAndSellStockTemplates = {
  "python": {
    "language": "python",
    "code": "def maxProfit(prices: list[int]) -> int:\n    min_price = prices[0]\n    max_profit = 0\n\n    for i in range(1, len(prices)):\n        # Update the lowest price seen so far\n        if prices[i] < min_price:\n            min_price = prices[i]\n        else:\n            # Check if selling today gives a better profit\n            profit = prices[i] - min_price\n            if profit > max_profit:\n                max_profit = profit\n\n    return max_profit",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "update_min": [
        7,
        8
      ],
      "update_profit": [
        11,
        12,
        13
      ],
      "skip": [
        11,
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        7
      ],
      "is_better_profit": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = prices[0];\n        int maxProfit = 0;\n\n        for (int i = 1; i < prices.length; i++) {\n            // Update the lowest price seen so far\n            if (prices[i] < minPrice) {\n                minPrice = prices[i];\n            } else {\n                // Check if selling today gives a better profit\n                int profit = prices[i] - minPrice;\n                if (profit > maxProfit) {\n                    maxProfit = profit;\n                }\n            }\n        }\n\n        return maxProfit;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "check_price": [
        6
      ],
      "update_min": [
        8,
        9
      ],
      "update_profit": [
        12,
        13,
        14
      ],
      "skip": [
        12,
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        8
      ],
      "is_better_profit": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = prices[0];\n        int maxProfit = 0;\n\n        for (int i = 1; i < prices.size(); i++) {\n            // Update the lowest price seen so far\n            if (prices[i] < minPrice) {\n                minPrice = prices[i];\n            } else {\n                // Check if selling today gives a better profit\n                int profit = prices[i] - minPrice;\n                if (profit > maxProfit) {\n                    maxProfit = profit;\n                }\n            }\n        }\n\n        return maxProfit;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5
      ],
      "check_price": [
        7
      ],
      "update_min": [
        9,
        10
      ],
      "update_profit": [
        13,
        14,
        15
      ],
      "skip": [
        13,
        14
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        9
      ],
      "is_better_profit": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxProfit(int[] prices) {\n        int minPrice = prices[0];\n        int maxProfit = 0;\n\n        for (int i = 1; i < prices.Length; i++) {\n            // Update the lowest price seen so far\n            if (prices[i] < minPrice) {\n                minPrice = prices[i];\n            } else {\n                // Check if selling today gives a better profit\n                int profit = prices[i] - minPrice;\n                if (profit > maxProfit) {\n                    maxProfit = profit;\n                }\n            }\n        }\n\n        return maxProfit;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "check_price": [
        6
      ],
      "update_min": [
        8,
        9
      ],
      "update_profit": [
        12,
        13,
        14
      ],
      "skip": [
        12,
        13
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        8
      ],
      "is_better_profit": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxProfit(prices []int) int {\n    minPrice := prices[0]\n    maxProfit := 0\n\n    for i := 1; i < len(prices); i++ {\n        // Update the lowest price seen so far\n        if prices[i] < minPrice {\n            minPrice = prices[i]\n        } else {\n            // Check if selling today gives a better profit\n            profit := prices[i] - minPrice\n            if profit > maxProfit {\n                maxProfit = profit\n            }\n        }\n    }\n\n    return maxProfit\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "update_min": [
        7,
        8
      ],
      "update_profit": [
        11,
        12,
        13
      ],
      "skip": [
        11,
        12
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        7
      ],
      "is_better_profit": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxProfit = function(prices) {\n    var minPrice = prices[0];\n    var maxProfit = 0;\n\n    for (var i = 1; i < prices.length; i++) {\n        // Update the lowest price seen so far\n        if (prices[i] < minPrice) {\n            minPrice = prices[i];\n        } else {\n            // Check if selling today gives a better profit\n            var profit = prices[i] - minPrice;\n            if (profit > maxProfit) {\n                maxProfit = profit;\n            }\n        }\n    }\n\n    return maxProfit;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "update_min": [
        7,
        8
      ],
      "update_profit": [
        11,
        12,
        13
      ],
      "skip": [
        11,
        12
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        7
      ],
      "is_better_profit": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxProfit(prices: number[]): number {\n    let minPrice = prices[0];\n    let maxProfit = 0;\n\n    for (let i = 1; i < prices.length; i++) {\n        // Update the lowest price seen so far\n        if (prices[i] < minPrice) {\n            minPrice = prices[i];\n        } else {\n            // Check if selling today gives a better profit\n            let profit = prices[i] - minPrice;\n            if (profit > maxProfit) {\n                maxProfit = profit;\n            }\n        }\n    }\n\n    return maxProfit;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "check_price": [
        5
      ],
      "update_min": [
        7,
        8
      ],
      "update_profit": [
        11,
        12,
        13
      ],
      "skip": [
        11,
        12
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_new_min": [
        7
      ],
      "is_better_profit": [
        12
      ]
    }
  }
};

const BestTimeToBuyAndSellStockPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "prices": [
        7,
        1,
        5,
        3,
        6,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "prices": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "prices": [
        7,
        6,
        4,
        3,
        1
      ]
    }
  }
];

function generateBestTimeToBuyAndSellStockSteps(e: any): any[] {
  let t=Array.isArray(e?.prices)?e.prices.map(Number):[],i=t.length,a=0,l=0,n=-1,o=-1,s=-1,p={};t.forEach((e,t)=>{p[`element_${t}`]={type:"arrayElement",value:e,position:t}});for(let e=1;e<i;e++)p[`diff_${e}`]={type:"arrayElement",value:t[e]-t[e-1],position:e};let u=new StepRecorder({prices:[...t],n:i,current:0,best:0},{...p,meta_current:{type:"metadata",value:0},meta_bestProfit:{type:"metadata",value:0},meta_flash:{type:"metadata",value:null},meta_run:{type:"metadata",value:{buy:-1,sell:-1}},meta_bestPair:{type:"metadata",value:{buy:-1,sell:-1}}}),c=(e,r=!1)=>{for(let a=0;a<i;a++){let i;r?a===o?i="buy":a===s&&(i="sell"):a===e?i="active":a===n?i="min":a===s&&(i="sell"),u.update_visual(`element_${a}`,{type:"arrayElement",value:t[a],position:a,...i?{state:i}:{}})}for(let a=1;a<i;a++){let i=!r&&n>=0&&void 0!==e&&a>n&&a<=e,l=r&&o>=0&&a>o&&a<=s;u.update_visual(`diff_${a}`,{type:"arrayElement",value:t[a]-t[a-1],position:a,...a===e?{state:"active"}:l?{state:"best"}:i?{state:"run"}:{}})}};if(u.record("-","Start: read the prices as daily gains and losses"),i<2)return u.update_visual("meta_flash",{type:"metadata",value:"result"}),u.record("complete","Fewer than two days, so no transaction is possible: profit = 0"),u.getSteps();c(),u.record("init","Initialize: current = 0, best = 0");for(let e=1;e<i;e++){let i=t[e]-t[e-1],r=a+i,p=r>0;u.update_variable("i",e),u.update_variable("diff",i),n<0&&(n=e-1),u.update_visual("i_pointer",{type:"pointer",position:e,label:"i"}),u.update_visual("meta_flash",{type:"metadata",value:null}),u.update_visual("meta_run",{type:"metadata",value:{buy:n,sell:e}}),u.add_conditional("is_positive_run",p),c(e),u.record("check_diff",`Day ${e}: diff = ${t[e]} - ${t[e-1]} = ${i>=0?"+":""}${i}`),p?(a=r,u.update_variable("current",a),u.update_visual("meta_current",{type:"metadata",value:a}),u.update_visual("meta_flash",{type:"metadata",value:"run"}),u.update_visual("meta_run",{type:"metadata",value:{buy:n,sell:e}}),c(e),u.record("extend_run",`Holding still pays: current = ${a} (bought on day ${n})`)):(a=0,n=-1,u.update_variable("current",a),u.update_visual("meta_current",{type:"metadata",value:0}),u.update_visual("meta_flash",{type:"metadata",value:"reset"}),u.update_visual("meta_run",{type:"metadata",value:{buy:-1,sell:-1}}),c(e),u.record("reset_run",`Run has gone to ${r}, so drop it: current = 0, buy later instead`));let d=a>l;u.add_conditional("is_new_best",d),d?(l=a,o=n,s=e,u.update_variable("best",l),u.update_visual("meta_bestProfit",{type:"metadata",value:l}),u.update_visual("meta_bestPair",{type:"metadata",value:{buy:o,sell:s}}),u.update_visual("meta_flash",{type:"metadata",value:"best"}),c(e),u.record("update_best",`current = ${a} beats the record: best = ${l}`)):(u.update_visual("meta_flash",{type:"metadata",value:"skip"}),c(e),u.record("keep_best",`current = ${a} does not beat best = ${l}`))}return u.delete_visual("i_pointer"),u.update_visual("meta_flash",{type:"metadata",value:"result"}),c(void 0,!0),u.record("complete",l>0?`Largest run of gains is buy day ${o} to sell day ${s}: maximum profit = ${l}`:"Every stretch of days loses money, so never buy: profit = 0"),u.getSteps()
}

export function BestTimeToBuyAndSellStockProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BestTimeToBuyAndSellStockTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBestTimeToBuyAndSellStockSteps(e) as any[];
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
      title="Best Time to Buy and Sell Stock"
      slug="best-time-to-buy-and-sell-stock"
      approaches={approaches}
      presets={BestTimeToBuyAndSellStockPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rotate Array (rotate-array)
// ==========================================

const RotateArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def rotate(nums: List[int], k: int) -> None:\n    n = len(nums)\n    k = k % n\n\n    def reverse(left: int, right: int) -> None:\n        while left < right:\n            nums[left], nums[right] = nums[right], nums[left]\n            left += 1\n            right -= 1\n\n    # Three reversals to achieve rotation\n    reverse(0, n - 1)\n    reverse(0, k - 1)\n    reverse(k, n - 1)",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        12
      ],
      "reverse_all": [
        5,
        6,
        7,
        8,
        9
      ],
      "reverse_all_complete": [
        12
      ],
      "reverse_first_start": [
        13
      ],
      "reverse_first": [
        5,
        6,
        7,
        8,
        9
      ],
      "reverse_first_complete": [
        13
      ],
      "reverse_rest_start": [
        14
      ],
      "reverse_rest": [
        5,
        6,
        7,
        8,
        9
      ],
      "reverse_rest_complete": [
        14
      ],
      "swap": [
        7
      ],
      "move_pointers": [
        8,
        9
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public void rotate(int[] nums, int k) {\n    int n = nums.length;\n    k = k % n;\n\n    // Three reversals to achieve rotation\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n}\n\nprivate void reverse(int[] nums, int left, int right) {\n    while (left < right) {\n        int temp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13,
        14,
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "void rotate(vector<int>& nums, int k) {\n    int n = nums.size();\n    k = k % n;\n\n    // Three reversals to achieve rotation\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n}\n\nvoid reverse(vector<int>& nums, int left, int right) {\n    while (left < right) {\n        int temp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13,
        14,
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var rotate = function(nums, k) {\n    var n = nums.length;\n    k = k % n;\n\n    // Three reversals to achieve rotation\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n};\n\nfunction reverse(nums, left, right) {\n    while (left < right) {\n        var temp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13,
        14,
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function rotate(nums: number[], k: number): void {\n    const n = nums.length;\n    k = k % n;\n\n    // Three reversals to achieve rotation\n    reverse(nums, 0, n - 1);\n    reverse(nums, 0, k - 1);\n    reverse(nums, k, n - 1);\n}\n\nfunction reverse(nums: number[], left: number, right: number): void {\n    while (left < right) {\n        const temp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13,
        14,
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public void Rotate(int[] nums, int k) {\n    int n = nums.Length;\n    k = k % n;\n\n    // Three reversals to achieve rotation\n    Reverse(nums, 0, n - 1);\n    Reverse(nums, 0, k - 1);\n    Reverse(nums, k, n - 1);\n}\n\nprivate void Reverse(int[] nums, int left, int right) {\n    while (left < right) {\n        int temp = nums[left];\n        nums[left] = nums[right];\n        nums[right] = temp;\n        left++;\n        right--;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13,
        14,
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func rotate(nums []int, k int) {\n    n := len(nums)\n    k = k % n\n\n    // Three reversals to achieve rotation\n    reverse(nums, 0, n-1)\n    reverse(nums, 0, k-1)\n    reverse(nums, k, n-1)\n}\n\nfunc reverse(nums []int, left int, right int) {\n    for left < right {\n        nums[left], nums[right] = nums[right], nums[left]\n        left++\n        right--\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "reverse_all_start": [
        6
      ],
      "reverse_all": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "reverse_all_complete": [
        6
      ],
      "reverse_first_start": [
        7
      ],
      "reverse_first": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "reverse_first_complete": [
        7
      ],
      "reverse_rest_start": [
        8
      ],
      "reverse_rest": [
        11,
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "reverse_rest_complete": [
        8
      ],
      "swap": [
        13
      ],
      "move_pointers": [
        14,
        15
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {}
  }
};

const RotateArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "k": 3
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        -1,
        -100,
        3,
        99
      ],
      "k": 2
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        1,
        2
      ],
      "k": 3
    }
  }
];

function generateRotateArraySteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],r=t.length,a=Math.floor(Number(e?.k??0))||0,i=r>0?(a%r+r)%r:0,s=t.map((e,t)=>t),l=(e,t,n)=>{for(let a=0;a<r;a++){let r=n?.(a);e.update_visual(`elem_${s[a]}`,{type:"arrayElement",value:t[a],position:a,...r&&{state:r}})}},o=t.reduce((e,t,r)=>(e[`elem_${r}`]={type:"arrayElement",value:t,position:r},e),{}),u=new StepRecorder({nums:[...t],n:r,k:i},{...o,meta_done:{type:"metadata",value:0}});u.record("-",`Start: rotate right by ${i}, one step at a time`);for(let e=0;e<i;e++){l(u,t,e=>e===r-1?"flying":void 0),u.record("pick_last",`Round ${e+1}: take the last value ${t[r-1]} out`);let n=t[r-1];for(let e=r-1;e>0;e--)t[e]=t[e-1];t[0]=n;let a=s[r-1];for(let e=r-1;e>0;e--)s[e]=s[e-1];s[0]=a,u.update_variable("nums",[...t]),u.update_visual("meta_done",{type:"metadata",value:e+1}),l(u,t),u.record("rotate_one",`Shift every value one slot right and wrap ${n} to the front: [${t.join(", ")}]`)}return l(u,t,()=>"complete"),u.record("complete",`Complete: array rotated right by ${i}`),u.getSteps()
}

export function RotateArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RotateArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRotateArraySteps(e) as any[];
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
      title="Rotate Array"
      slug="rotate-array"
      approaches={approaches}
      presets={RotateArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Product of Array Except Self (product-of-array-except-self)
// ==========================================

const ProductOfArrayExceptSelfTemplates = {
  "python": {
    "language": "python",
    "code": "def productExceptSelf(nums: list[int]) -> list[int]:\n    n = len(nums)\n    result = [0] * n\n\n    for i in range(n):\n        product = 1\n        for j in range(n):\n            if j != i:\n                product *= nums[j]\n        result[i] = product\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "start_outer": [
        6
      ],
      "skip_self": [
        8
      ],
      "multiply": [
        9
      ],
      "write_output": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "skip_self": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] result = new int[n];\n\n        for (int i = 0; i < n; i++) {\n            int product = 1;\n            for (int j = 0; j < n; j++) {\n                if (j != i) {\n                    product *= nums[j];\n                }\n            }\n            result[i] = product;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "start_outer": [
        7
      ],
      "skip_self": [
        9
      ],
      "multiply": [
        10
      ],
      "write_output": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "skip_self": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> result(n);\n\n        for (int i = 0; i < n; i++) {\n            int product = 1;\n            for (int j = 0; j < n; j++) {\n                if (j != i) {\n                    product *= nums[j];\n                }\n            }\n            result[i] = product;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "start_outer": [
        8
      ],
      "skip_self": [
        10
      ],
      "multiply": [
        11
      ],
      "write_output": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "skip_self": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] ProductExceptSelf(int[] nums) {\n        int n = nums.Length;\n        int[] result = new int[n];\n\n        for (int i = 0; i < n; i++) {\n            int product = 1;\n            for (int j = 0; j < n; j++) {\n                if (j != i) {\n                    product *= nums[j];\n                }\n            }\n            result[i] = product;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "start_outer": [
        7
      ],
      "skip_self": [
        9
      ],
      "multiply": [
        10
      ],
      "write_output": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "skip_self": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func productExceptSelf(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n\n    for i := 0; i < n; i++ {\n        product := 1\n        for j := 0; j < n; j++ {\n            if j != i {\n                product *= nums[j]\n            }\n        }\n        result[i] = product\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_outer": [
        6
      ],
      "skip_self": [
        8
      ],
      "multiply": [
        9
      ],
      "write_output": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "skip_self": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var productExceptSelf = function(nums) {\n    const n = nums.length;\n    const result = new Array(n);\n\n    for (let i = 0; i < n; i++) {\n        let product = 1;\n        for (let j = 0; j < n; j++) {\n            if (j !== i) {\n                product *= nums[j];\n            }\n        }\n        result[i] = product;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "start_outer": [
        6
      ],
      "skip_self": [
        8
      ],
      "multiply": [
        9
      ],
      "write_output": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "skip_self": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function productExceptSelf(nums: number[]): number[] {\n    const n = nums.length;\n    const result: number[] = new Array(n);\n\n    for (let i = 0; i < n; i++) {\n        let product = 1;\n        for (let j = 0; j < n; j++) {\n            if (j !== i) {\n                product *= nums[j];\n            }\n        }\n        result[i] = product;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_outer": [
        6
      ],
      "skip_self": [
        8
      ],
      "multiply": [
        9
      ],
      "write_output": [
        12
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "skip_self": [
        8
      ]
    }
  }
};

const ProductOfArrayExceptSelfPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
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
    "label": "Input 2",
    "value": {
      "nums": [
        -1,
        1,
        0,
        -3,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        2,
        3,
        4,
        5
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
        1
      ]
    }
  }
];

function generateProductOfArrayExceptSelfSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.length,r=Array(i),l=0,u=(e,n)=>{let r={};for(let l=0;l<i;l++){let i=l===e?"self":l===n?"scan":"readonly";r[`input_${l}`]={type:"arrayElement",value:t[l],position:l,state:i}}return r},s=(e,t)=>{let n={};for(let l=0;l<i;l++){let i=void 0!==r[l];n[`output_${l}`]={type:"arrayElement",value:i?r[l]:"",position:l,state:t&&i?"complete":l===e?"target":i?"filled":"pending"}}return n},a=new StepRecorder({nums:[...t],n:i},{...u(-1,-1),...s(-1,!1),meta_product:{type:"metadata",value:null},meta_mults:{type:"metadata",value:0}}),o=(e,t,i,n,r=!1)=>{for(let[i,n]of Object.entries(u(e,t)))a.update_visual(i,n);for(let[e,t]of Object.entries(s(i,r)))a.update_visual(e,t);e>=0?a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}):a.delete_visual("ptr_i"),t>=0?a.update_visual("ptr_j",{type:"pointer",position:t,label:"j"}):a.delete_visual("ptr_j"),a.update_visual("meta_product",{type:"metadata",value:n}),a.update_visual("meta_mults",{type:"metadata",value:l})};a.record("-","Start: Calculate product of array except self");for(let e=0;e<i;e++){let n=1;a.update_variable("i",e),a.update_variable("product",n),o(e,-1,e,n),a.record("start_outer",`Index ${e}: start a fresh product of 1`);for(let r=0;r<i;r++){if(a.update_variable("j",r),e===r){a.add_conditional("skip_self",!0),o(e,r,e,n),a.record("skip_self",`j = ${r} is the index itself, so nums[${r}] is left out`);continue}let i=n;n*=t[r],l++,a.add_conditional("skip_self",!1),a.update_variable("product",n),o(e,r,e,n),a.record("multiply",`product = ${i} \xd7 nums[${r}] (${t[r]}) = ${n}`)}r[e]=n,o(e,-1,e,n),a.record("write_output",`output[${e}] = ${n}`)}return a.update_variable("i",void 0),a.update_variable("j",void 0),o(-1,-1,-1,null,!0),a.record("complete",`Complete: ${l} multiplications to fill ${i} slot${1===i?"":"s"}`),a.getSteps()
}

export function ProductOfArrayExceptSelfProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ProductOfArrayExceptSelfTemplates,
      generateSteps: (e: any) => {
        const recorded = generateProductOfArrayExceptSelfSteps(e) as any[];
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
      title="Product of Array Except Self"
      slug="product-of-array-except-self"
      approaches={approaches}
      presets={ProductOfArrayExceptSelfPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Best Time to Buy and Sell Stock II (best-time-to-buy-and-sell-stock-ii)
// ==========================================

const BestTimeToBuyAndSellStockIiTemplates = {
  "python": {
    "language": "python",
    "code": "def maxProfit(prices: list[int]) -> int:\n    def solve(day, holding):\n        # Base case: no more days to trade\n        if day == len(prices):\n            return 0\n\n        if holding:\n            # Either sell today or skip\n            sell = prices[day] + solve(day + 1, False)\n            skip = solve(day + 1, True)\n            return max(sell, skip)\n        else:\n            # Either buy today or skip\n            buy = -prices[day] + solve(day + 1, True)\n            skip = solve(day + 1, False)\n            return max(buy, skip)\n\n    return solve(0, False)",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        18
      ],
      "base_case": [
        5
      ],
      "call": [
        9,
        10,
        14,
        15
      ],
      "explore_subtree": [
        9,
        10,
        14,
        15
      ],
      "return_best": [
        11,
        16
      ]
    },
    "conditionalMap": {
      "is_holding": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maxProfit(int[] prices) {\n        return solve(prices, 0, false);\n    }\n\n    private int solve(int[] prices, int day, boolean holding) {\n        // Base case: no more days to trade\n        if (day == prices.length) return 0;\n\n        if (holding) {\n            // Either sell today or skip\n            int sell = prices[day] + solve(prices, day + 1, false);\n            int skip = solve(prices, day + 1, true);\n            return Math.max(sell, skip);\n        } else {\n            // Either buy today or skip\n            int buy = -prices[day] + solve(prices, day + 1, true);\n            int skip = solve(prices, day + 1, false);\n            return Math.max(buy, skip);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "complete": [
        3
      ],
      "base_case": [
        8
      ],
      "call": [
        12,
        13,
        17,
        18
      ],
      "explore_subtree": [
        12,
        13,
        17,
        18
      ],
      "return_best": [
        14,
        19
      ]
    },
    "conditionalMap": {
      "is_holding": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return solve(prices, 0, false);\n    }\n\nprivate:\n    int solve(vector<int>& prices, int day, bool holding) {\n        // Base case: no more days to trade\n        if (day == prices.size()) return 0;\n\n        if (holding) {\n            // Either sell today or skip\n            int sell = prices[day] + solve(prices, day + 1, false);\n            int skip = solve(prices, day + 1, true);\n            return max(sell, skip);\n        } else {\n            // Either buy today or skip\n            int buy = -prices[day] + solve(prices, day + 1, true);\n            int skip = solve(prices, day + 1, false);\n            return max(buy, skip);\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "complete": [
        4
      ],
      "base_case": [
        10
      ],
      "call": [
        14,
        15,
        19,
        20
      ],
      "explore_subtree": [
        14,
        15,
        19,
        20
      ],
      "return_best": [
        16,
        21
      ]
    },
    "conditionalMap": {
      "is_holding": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaxProfit(int[] prices) {\n        return Solve(prices, 0, false);\n    }\n\n    private int Solve(int[] prices, int day, bool holding) {\n        // Base case: no more days to trade\n        if (day == prices.Length) return 0;\n\n        if (holding) {\n            // Either sell today or skip\n            int sell = prices[day] + Solve(prices, day + 1, false);\n            int skip = Solve(prices, day + 1, true);\n            return Math.Max(sell, skip);\n        } else {\n            // Either buy today or skip\n            int buy = -prices[day] + Solve(prices, day + 1, true);\n            int skip = Solve(prices, day + 1, false);\n            return Math.Max(buy, skip);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "complete": [
        3
      ],
      "base_case": [
        8
      ],
      "call": [
        12,
        13,
        17,
        18
      ],
      "explore_subtree": [
        12,
        13,
        17,
        18
      ],
      "return_best": [
        14,
        19
      ]
    },
    "conditionalMap": {
      "is_holding": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxProfit(prices []int) int {\n    return solve(prices, 0, false)\n}\n\nfunc solve(prices []int, day int, holding bool) int {\n    // Base case: no more days to trade\n    if day == len(prices) {\n        return 0\n    }\n\n    if holding {\n        // Either sell today or skip\n        sell := prices[day] + solve(prices, day+1, false)\n        skip := solve(prices, day+1, true)\n        if sell > skip {\n            return sell\n        }\n        return skip\n    }\n\n    // Either buy today or skip\n    buy := -prices[day] + solve(prices, day+1, true)\n    skip := solve(prices, day+1, false)\n    if buy > skip {\n        return buy\n    }\n    return skip\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ],
      "base_case": [
        8
      ],
      "call": [
        13,
        14,
        22,
        23
      ],
      "explore_subtree": [
        13,
        14,
        22,
        23
      ],
      "return_best": [
        16,
        18,
        25,
        27
      ]
    },
    "conditionalMap": {
      "is_holding": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maxProfit = function(prices) {\n    function solve(day, holding) {\n        // Base case: no more days to trade\n        if (day === prices.length) return 0;\n\n        if (holding) {\n            // Either sell today or skip\n            let sell = prices[day] + solve(day + 1, false);\n            let skip = solve(day + 1, true);\n            return Math.max(sell, skip);\n        } else {\n            // Either buy today or skip\n            let buy = -prices[day] + solve(day + 1, true);\n            let skip = solve(day + 1, false);\n            return Math.max(buy, skip);\n        }\n    }\n\n    return solve(0, false);\n};",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        19
      ],
      "base_case": [
        4
      ],
      "call": [
        8,
        9,
        13,
        14
      ],
      "explore_subtree": [
        8,
        9,
        13,
        14
      ],
      "return_best": [
        10,
        15
      ]
    },
    "conditionalMap": {
      "is_holding": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxProfit(prices: number[]): number {\n    function solve(day: number, holding: boolean): number {\n        // Base case: no more days to trade\n        if (day === prices.length) return 0;\n\n        if (holding) {\n            // Either sell today or skip\n            let sell = prices[day] + solve(day + 1, false);\n            let skip = solve(day + 1, true);\n            return Math.max(sell, skip);\n        } else {\n            // Either buy today or skip\n            let buy = -prices[day] + solve(day + 1, true);\n            let skip = solve(day + 1, false);\n            return Math.max(buy, skip);\n        }\n    }\n\n    return solve(0, false);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        19
      ],
      "base_case": [
        4
      ],
      "call": [
        8,
        9,
        13,
        14
      ],
      "explore_subtree": [
        8,
        9,
        13,
        14
      ],
      "return_best": [
        10,
        15
      ]
    },
    "conditionalMap": {
      "is_holding": [
        6
      ]
    }
  }
};

const BestTimeToBuyAndSellStockIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "prices": [
        7,
        1,
        5,
        3,
        6,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "prices": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "prices": [
        7,
        6,
        4,
        3,
        1
      ]
    }
  }
];

function generateBestTimeToBuyAndSellStockIiSteps(e: any): any[] {
  let i=[...e.prices],t=i.length,a=0,n=[],r=i.reduce((e,i,t)=>(e[`elem_${t}`]={type:"arrayElement",value:i,position:t},e),{}),o=new StepRecorder({prices:i,maxProfit:void 0,i:void 0},{...r,meta_maxProfit:{type:"metadata",value:0},meta_captured:{type:"metadata",value:[]},meta_flash:{type:"metadata",value:null}}),s=e=>{for(let l=0;l<t;l++)o.update_visual(`elem_${l}`,{type:"arrayElement",value:i[l],position:l,...e[l]&&{state:e[l]}})};o.record("-","Start of algorithm"),o.update_variable("maxProfit",a),o.record("initialize","Initialize maxProfit to 0");for(let e=1;e<t;e++)if(o.update_variable("i",e),o.update_visual("prev",{type:"pointer",position:e-1,label:"i-1"}),o.update_visual("curr",{type:"pointer",position:e,label:"i"}),o.update_visual("meta_flash",{type:"metadata",value:null}),s({[e-1]:"prev",[e]:"active"}),o.record("check_price",`Compare prices[${e}] (${i[e]}) with prices[${e-1}] (${i[e-1]})`),i[e]>i[e-1]){let t=i[e]-i[e-1];a+=t,n.push(e),o.update_variable("maxProfit",a),o.update_visual("meta_maxProfit",{type:"metadata",value:a}),o.update_visual("meta_captured",{type:"metadata",value:[...n]}),o.update_visual("meta_flash",{type:"metadata",value:"profit"}),s({[e-1]:"gain",[e]:"gain"}),o.add_conditional("price_increased",!0),o.record("add_profit",`Price increased! Buy at ${i[e-1]}, sell at ${i[e]}, bank profit of ${t}`)}else o.update_visual("meta_flash",{type:"metadata",value:"skip"}),o.add_conditional("price_increased",!1),o.record("skip","Price didn't increase, skip");return o.delete_visual("prev"),o.delete_visual("curr"),s({}),o.update_visual("meta_flash",{type:"metadata",value:"result"}),o.record("complete",`Maximum profit: ${a}`),o.getSteps()
}

export function BestTimeToBuyAndSellStockIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BestTimeToBuyAndSellStockIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBestTimeToBuyAndSellStockIiSteps(e) as any[];
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
      title="Best Time to Buy and Sell Stock II"
      slug="best-time-to-buy-and-sell-stock-ii"
      approaches={approaches}
      presets={BestTimeToBuyAndSellStockIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Zero-Filled Subarrays (number-of-zero-filled-subarrays)
// ==========================================

const NumberOfZeroFilledSubarraysTemplates = {
  "python": {
    "language": "python",
    "code": "def zeroFilledSubarray(nums: list[int]) -> int:\n    count = 0\n\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            continue\n        # Extend right while we see zeros\n        j = i\n        while j < len(nums) and nums[j] == 0:\n            count += 1\n            j += 1\n\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "start_window": [
        4,
        8
      ],
      "stop_window": [
        9
      ],
      "count_subarray": [
        10,
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_zero": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public long zeroFilledSubarray(int[] nums) {\n        long count = 0;\n\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) continue;\n            // Extend right while we see zeros\n            for (int j = i; j < nums.length && nums[j] == 0; j++) {\n                count++;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "start_window": [
        5
      ],
      "stop_window": [
        8
      ],
      "count_subarray": [
        9
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_zero": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    long long zeroFilledSubarray(vector<int>& nums) {\n        long long count = 0;\n\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums[i] != 0) continue;\n            // Extend right while we see zeros\n            for (int j = i; j < nums.size() && nums[j] == 0; j++) {\n                count++;\n            }\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4
      ],
      "start_window": [
        6
      ],
      "stop_window": [
        9
      ],
      "count_subarray": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_zero": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public long ZeroFilledSubarray(int[] nums) {\n        long count = 0;\n\n        for (int i = 0; i < nums.Length; i++) {\n            if (nums[i] != 0) continue;\n            // Extend right while we see zeros\n            for (int j = i; j < nums.Length && nums[j] == 0; j++) {\n                count++;\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "start_window": [
        5
      ],
      "stop_window": [
        8
      ],
      "count_subarray": [
        9
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_zero": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func zeroFilledSubarray(nums []int) int64 {\n    var count int64\n\n    for i := 0; i < len(nums); i++ {\n        if nums[i] != 0 {\n            continue\n        }\n        // Extend right while we see zeros\n        for j := i; j < len(nums) && nums[j] == 0; j++ {\n            count++\n        }\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "start_window": [
        4
      ],
      "stop_window": [
        9
      ],
      "count_subarray": [
        10
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_zero": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var zeroFilledSubarray = function(nums) {\n    let count = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) continue;\n        // Extend right while we see zeros\n        for (let j = i; j < nums.length && nums[j] === 0; j++) {\n            count++;\n        }\n    }\n\n    return count;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "start_window": [
        4
      ],
      "stop_window": [
        7
      ],
      "count_subarray": [
        8
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function zeroFilledSubarray(nums: number[]): number {\n    let count = 0;\n\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) continue;\n        // Extend right while we see zeros\n        for (let j = i; j < nums.length && nums[j] === 0; j++) {\n            count++;\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "start_window": [
        4
      ],
      "stop_window": [
        7
      ],
      "count_subarray": [
        8
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_zero": [
        7
      ]
    }
  }
};

const NumberOfZeroFilledSubarraysPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Multiple Runs",
    "value": {
      "nums": [
        1,
        0,
        0,
        2,
        0,
        0,
        0,
        3,
        0,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Zeros",
    "value": {
      "nums": [
        0,
        0,
        0,
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No Zeros",
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
    "label": "Alternating",
    "value": {
      "nums": [
        0,
        1,
        0,
        1,
        0
      ]
    }
  }
];

function generateNumberOfZeroFilledSubarraysSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,a=0,r=({start:e,windowEnd:i,cursor:a,blocked:r,final:l})=>{let o={};for(let s=0;s<n;s++){let n;l?n=0===t[s]?"counted":"faded":null!=r&&s===r?n="blocked":null!=e&&null!=i&&s>=e&&s<=i?n="window":null!=a&&s===a?n="active":null!=e&&s<e&&(n="faded"),o[`element_${s}`]={type:"arrayElement",value:t[s],position:s,...n&&{state:n}}}return o},l=(e,t)=>{for(let[n,i]of Object.entries(r(t)))e.update_visual(n,i)},o=new StepRecorder({nums:[...t],n,result:0},{...r({}),meta_found:{type:"metadata",value:0},meta_result:{type:"metadata",value:0},meta_window:{type:"metadata",value:null},meta_flash:{type:"metadata",value:null}});o.record("-","Start: count every subarray made only of zeros"),o.update_variable("result",a),o.record("init","Initialize result = 0");for(let e=0;e<n;e++){let i=0;o.update_variable("i",e),o.update_variable("j",e),o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.update_visual("j",{type:"pointer",position:e,label:"j"}),o.update_visual("meta_found",{type:"metadata",value:0}),o.update_visual("meta_window",{type:"metadata",value:null}),o.update_visual("meta_flash",{type:"metadata",value:null}),l(o,{start:e,cursor:e}),o.record("start_window",`Try every subarray that starts at index ${e}`);let r=e;for(;r<n&&0===t[r];)a++,i++,o.update_variable("j",r),o.update_variable("result",a),o.update_visual("j",{type:"pointer",position:r,label:"j"}),o.update_visual("meta_found",{type:"metadata",value:i}),o.update_visual("meta_result",{type:"metadata",value:a}),o.update_visual("meta_window",{type:"metadata",value:{start:e,end:r}}),o.update_visual("meta_flash",{type:"metadata",value:"count"}),o.add_conditional("is_zero",!0),l(o,{start:e,windowEnd:r}),o.record("count_subarray",`nums[${e}..${r}] is all zeros, so count it. result = ${a}`),r++;let s=r<n?r:null;o.update_variable("j",r),null!=s?o.update_visual("j",{type:"pointer",position:s,label:"j"}):o.delete_visual("j"),o.update_visual("meta_window",{type:"metadata",value:null}),o.update_visual("meta_flash",{type:"metadata",value:"stop"}),o.add_conditional("is_zero",!1),l(o,{start:e,windowEnd:r-1>=e?r-1:void 0,blocked:s}),o.record("stop_window",null!=s?`nums[${s}] = ${t[s]} is not zero, so the walk from ${e} stops here`:`The array ends, so the walk from ${e} stops here`)}return o.delete_visual("i"),o.delete_visual("j"),o.delete_variable("i"),o.delete_variable("j"),o.update_visual("meta_found",{type:"metadata",value:0}),o.update_visual("meta_window",{type:"metadata",value:null}),o.update_visual("meta_flash",{type:"metadata",value:"result"}),l(o,{final:!0}),o.record("complete",`Complete: Total zero-filled subarrays = ${a}`),o.getSteps()
}

export function NumberOfZeroFilledSubarraysProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfZeroFilledSubarraysTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfZeroFilledSubarraysSteps(e) as any[];
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
      title="Number of Zero-Filled Subarrays"
      slug="number-of-zero-filled-subarrays"
      approaches={approaches}
      presets={NumberOfZeroFilledSubarraysPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Increasing Triplet Subsequence (increasing-triplet-subsequence)
// ==========================================

const IncreasingTripletSubsequenceTemplates = {
  "python": {
    "language": "python",
    "code": "def increasingTriplet(nums: list[int]) -> bool:\n    n = len(nums)\n    for i in range(n - 2):\n        for j in range(i + 1, n - 1):\n            if nums[j] > nums[i]:\n                for k in range(j + 1, n):\n                    if nums[k] > nums[j]:\n                        return True\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "check_pair": [
        5
      ],
      "check_k": [
        7
      ],
      "return_true": [
        8
      ],
      "return_false": [
        9
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        5
      ],
      "found_third": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean increasingTriplet(int[] nums) {\n        int n = nums.length;\n        for (int i = 0; i < n - 2; i++) {\n            for (int j = i + 1; j < n - 1; j++) {\n                if (nums[j] > nums[i]) {\n                    for (int k = j + 1; k < n; k++) {\n                        if (nums[k] > nums[j]) {\n                            return true;\n                        }\n                    }\n                }\n            }\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_pair": [
        6
      ],
      "check_k": [
        8
      ],
      "return_true": [
        9
      ],
      "return_false": [
        15
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        6
      ],
      "found_third": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool increasingTriplet(vector<int>& nums) {\n        int n = nums.size();\n        for (int i = 0; i < n - 2; i++) {\n            for (int j = i + 1; j < n - 1; j++) {\n                if (nums[j] > nums[i]) {\n                    for (int k = j + 1; k < n; k++) {\n                        if (nums[k] > nums[j]) {\n                            return true;\n                        }\n                    }\n                }\n            }\n        }\n        return false;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "check_pair": [
        7
      ],
      "check_k": [
        9
      ],
      "return_true": [
        10
      ],
      "return_false": [
        16
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        7
      ],
      "found_third": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool IncreasingTriplet(int[] nums) {\n        int n = nums.Length;\n        for (int i = 0; i < n - 2; i++) {\n            for (int j = i + 1; j < n - 1; j++) {\n                if (nums[j] > nums[i]) {\n                    for (int k = j + 1; k < n; k++) {\n                        if (nums[k] > nums[j]) {\n                            return true;\n                        }\n                    }\n                }\n            }\n        }\n        return false;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "check_pair": [
        6
      ],
      "check_k": [
        8
      ],
      "return_true": [
        9
      ],
      "return_false": [
        15
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        6
      ],
      "found_third": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func increasingTriplet(nums []int) bool {\n    n := len(nums)\n    for i := 0; i < n-2; i++ {\n        for j := i + 1; j < n-1; j++ {\n            if nums[j] > nums[i] {\n                for k := j + 1; k < n; k++ {\n                    if nums[k] > nums[j] {\n                        return true\n                    }\n                }\n            }\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_pair": [
        5
      ],
      "check_k": [
        7
      ],
      "return_true": [
        8
      ],
      "return_false": [
        14
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        5
      ],
      "found_third": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var increasingTriplet = function(nums) {\n    var n = nums.length;\n    for (var i = 0; i < n - 2; i++) {\n        for (var j = i + 1; j < n - 1; j++) {\n            if (nums[j] > nums[i]) {\n                for (var k = j + 1; k < n; k++) {\n                    if (nums[k] > nums[j]) {\n                        return true;\n                    }\n                }\n            }\n        }\n    }\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "check_pair": [
        5
      ],
      "check_k": [
        7
      ],
      "return_true": [
        8
      ],
      "return_false": [
        14
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        5
      ],
      "found_third": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function increasingTriplet(nums: number[]): boolean {\n    var n = nums.length;\n    for (var i = 0; i < n - 2; i++) {\n        for (var j = i + 1; j < n - 1; j++) {\n            if (nums[j] > nums[i]) {\n                for (var k = j + 1; k < n; k++) {\n                    if (nums[k] > nums[j]) {\n                        return true;\n                    }\n                }\n            }\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_pair": [
        5
      ],
      "check_k": [
        7
      ],
      "return_true": [
        8
      ],
      "return_false": [
        14
      ]
    },
    "conditionalMap": {
      "pair_increasing": [
        5
      ],
      "found_third": [
        7
      ]
    }
  }
};

const IncreasingTripletSubsequencePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "All Increasing",
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
    "id": "ex2",
    "label": "All Decreasing",
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
    "id": "ex3",
    "label": "Triplet Exists",
    "value": {
      "nums": [
        2,
        1,
        5,
        0,
        4,
        6
      ]
    }
  },
  {
    "id": "ex4",
    "label": "No Triplet",
    "value": {
      "nums": [
        7,
        5,
        0,
        6,
        5,
        3
      ]
    }
  }
];

function generateIncreasingTripletSubsequenceSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.length,r=(e,n,r,a=!1)=>{let l={};for(let s=0;s<i;s++){let i;a&&(s===e||s===n||s===r)?i="matched":s===r?i="active":s===n?i="reading":s===e&&(i="anchor"),l[`elem_${s}`]={type:"arrayElement",value:t[s],position:s,...i&&{state:i}}}return l},a=(e,t,i,n,a=!1)=>{for(let[l,s]of Object.entries(r(t,i,n,a)))e.update_visual(l,s)},l=new StepRecorder({nums:[...t],n:i},{...r(-1,-1,-1)});l.record("-","Start: try every i < j < k");for(let e=0;e<i-2;e++){l.update_variable("i",e),l.update_visual("i",{type:"pointer",position:e,label:"i"});for(let n=e+1;n<i-1;n++){let r=t[n]>t[e];if(l.update_variable("j",n),l.update_visual("j",{type:"pointer",position:n,label:"j"}),l.delete_visual("k"),l.update_variable("k",void 0),l.add_conditional("pair_increasing",r),a(l,e,n,-1),l.record("check_pair",r?`nums[${n}] = ${t[n]} > nums[${e}] = ${t[e]}, so look for a third`:`nums[${n}] = ${t[n]} does not beat nums[${e}] = ${t[e]}, move j`),r)for(let r=n+1;r<i;r++){let i=t[r]>t[n];if(l.update_variable("k",r),l.update_visual("k",{type:"pointer",position:r,label:"k"}),l.add_conditional("found_third",i),a(l,e,n,r,i),l.record("check_k",i?`nums[${r}] = ${t[r]} > nums[${n}] = ${t[n]}, the triplet is complete`:`nums[${r}] = ${t[r]} does not beat nums[${n}] = ${t[n]}, move k`),i)return l.add_new_variable("result",!0),a(l,e,n,r,!0),l.record("return_true",`Found ${t[e]} < ${t[n]} < ${t[r]} at indices ${e} < ${n} < ${r}`),l.getSteps()}}}return l.add_new_variable("result",!1),l.delete_visual("i"),l.delete_visual("j"),l.delete_visual("k"),a(l,-1,-1,-1),l.record("return_false","No i < j < k with increasing values exists"),l.getSteps()
}

export function IncreasingTripletSubsequenceProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IncreasingTripletSubsequenceTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIncreasingTripletSubsequenceSteps(e) as any[];
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
      title="Increasing Triplet Subsequence"
      slug="increasing-triplet-subsequence"
      approaches={approaches}
      presets={IncreasingTripletSubsequencePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// First Missing Positive (first-missing-positive)
// ==========================================

const FirstMissingPositiveTemplates = {
  "python": {
    "language": "python",
    "code": "def firstMissingPositive(nums: list[int]) -> int:\n    # Store all numbers in a set for O(1) lookup\n    seen = set(nums)\n\n    # Check 1, 2, 3, ... until we find one that's missing\n    for i in range(1, len(nums) + 2):\n        if i not in seen:\n            return i\n\n    return len(nums) + 1",
    "lineMap": {
      "-": [
        1
      ],
      "add_to_set": [
        3
      ],
      "set_done": [
        6
      ],
      "probe": [
        7
      ],
      "found": [
        8
      ]
    },
    "conditionalMap": {
      "in_set": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int firstMissingPositive(int[] nums) {\n        // Store all numbers in a hash set for O(1) lookup\n        Set<Integer> seen = new HashSet<>();\n        for (int num : nums) {\n            seen.add(num);\n        }\n\n        // Check 1, 2, 3, ... until we find one that's missing\n        for (int i = 1; i <= nums.length + 1; i++) {\n            if (!seen.contains(i)) {\n                return i;\n            }\n        }\n\n        return nums.length + 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "add_to_set": [
        6
      ],
      "set_done": [
        10
      ],
      "probe": [
        11
      ],
      "found": [
        12
      ]
    },
    "conditionalMap": {
      "in_set": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        // Store all numbers in a hash set for O(1) lookup\n        unordered_set<int> seen(nums.begin(), nums.end());\n\n        // Check 1, 2, 3, ... until we find one that's missing\n        for (int i = 1; i <= (int)nums.size() + 1; i++) {\n            if (seen.find(i) == seen.end()) {\n                return i;\n            }\n        }\n\n        return nums.size() + 1;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "add_to_set": [
        5
      ],
      "set_done": [
        8
      ],
      "probe": [
        9
      ],
      "found": [
        10
      ]
    },
    "conditionalMap": {
      "in_set": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int FirstMissingPositive(int[] nums) {\n        // Store all numbers in a hash set for O(1) lookup\n        HashSet<int> seen = new HashSet<int>(nums);\n\n        // Check 1, 2, 3, ... until we find one that's missing\n        for (int i = 1; i <= nums.Length + 1; i++) {\n            if (!seen.Contains(i)) {\n                return i;\n            }\n        }\n\n        return nums.Length + 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "add_to_set": [
        4
      ],
      "set_done": [
        7
      ],
      "probe": [
        8
      ],
      "found": [
        9
      ]
    },
    "conditionalMap": {
      "in_set": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func firstMissingPositive(nums []int) int {\n    // Store all numbers in a map for O(1) lookup\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        seen[num] = true\n    }\n\n    // Check 1, 2, 3, ... until we find one that's missing\n    for i := 1; i <= len(nums)+1; i++ {\n        if !seen[i] {\n            return i\n        }\n    }\n\n    return len(nums) + 1\n}",
    "lineMap": {
      "-": [
        1
      ],
      "add_to_set": [
        5
      ],
      "set_done": [
        9
      ],
      "probe": [
        10
      ],
      "found": [
        11
      ]
    },
    "conditionalMap": {
      "in_set": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var firstMissingPositive = function(nums) {\n    // Store all numbers in a set for O(1) lookup\n    const seen = new Set(nums);\n\n    // Check 1, 2, 3, ... until we find one that's missing\n    for (let i = 1; i <= nums.length + 1; i++) {\n        if (!seen.has(i)) {\n            return i;\n        }\n    }\n\n    return nums.length + 1;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "add_to_set": [
        3
      ],
      "set_done": [
        6
      ],
      "probe": [
        7
      ],
      "found": [
        8
      ]
    },
    "conditionalMap": {
      "in_set": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function firstMissingPositive(nums: number[]): number {\n    // Store all numbers in a set for O(1) lookup\n    const seen: Set<number> = new Set(nums);\n\n    // Check 1, 2, 3, ... until we find one that's missing\n    for (let i = 1; i <= nums.length + 1; i++) {\n        if (!seen.has(i)) {\n            return i;\n        }\n    }\n\n    return nums.length + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "add_to_set": [
        3
      ],
      "set_done": [
        6
      ],
      "probe": [
        7
      ],
      "found": [
        8
      ]
    },
    "conditionalMap": {
      "in_set": [
        7
      ]
    }
  }
};

const FirstMissingPositivePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        2,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        3,
        4,
        -1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        7,
        8,
        9,
        11,
        12
      ]
    }
  }
];

function generateFirstMissingPositiveSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.length,s=t.map((e,t)=>t),a=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),r=new StepRecorder({nums:[...t],n:i},{...a,meta_stages:{type:"metadata",value:["active","pending"]},meta_answer:{type:"metadata",value:null},meta_flash:{type:"metadata",value:null}}),l=e=>{r.update_visual("meta_stages",{type:"metadata",value:e})},o=(e,n)=>{for(let a=0;a<i;a++){let l;n&&n.includes(a)||(a===e?l="active":t[a]===a+1?l="home":(t[a]<=0||t[a]>i)&&(l="dead"),r.update_visual(`elem_${s[a]}`,{type:"arrayElement",value:t[a],position:a,...l&&{state:l}}))}};o(),r.record("start","Start: Place each positive integer in its correct position using cyclic sort");let u=0;for(r.add_new_variable("i",u),r.update_visual("ptr_i",{type:"pointer",position:u,label:"i"}),r.record("initialize","Initialize pointer i=0 to start cyclic sort");u<i;){let e=t[u],n=e-1;if(o(u),r.record("check",`Check nums[${u}]=${e}`),e>0&&e<=i&&t[n]!==e){r.add_conditional("swap_needed",!0),r.record("swap_condition",`${e} should be at index ${n}, swap needed`);let i=s[u],a=s[n];o(void 0,[u,n]),r.update_visual(`elem_${i}`,{type:"arrayElement",value:t[u],position:n,state:"swapping"}),r.update_visual(`elem_${a}`,{type:"arrayElement",value:t[n],position:u,state:"swapping"}),r.record("swap",`Swap: nums[${u}] ↔ nums[${n}]`),[t[u],t[n]]=[t[n],t[u]],[s[u],s[n]]=[s[n],s[u]],r.update_variable("nums",[...t]),o(u)}else r.add_conditional("swap_needed",!1),e<=0||e>i?r.record("skip_out_of_range",`${e} is out of range [1, ${i}], skip`):r.record("skip_already_placed",`${e} is already at correct position`),u++,r.update_variable("i",u),u<i&&(r.update_visual("ptr_i",{type:"pointer",position:u,label:"i"}),o(),r.record("move_pointer",`Move pointer i to ${u}`))}r.delete_visual("ptr_i"),r.delete_variable("i"),l(["done","active"]),o(),r.record("sort_complete","Cyclic sort complete. Now find first missing positive"),u=0,r.add_new_variable("i",u),r.update_visual("ptr_i",{type:"pointer",position:u,label:"i"}),r.record("find_start","Start searching for first missing positive");let c=!1;for(u=0;u<i;u++){if(r.update_variable("i",u),r.update_visual("ptr_i",{type:"pointer",position:u,label:"i"}),o(u),r.record("check_position",`Check if nums[${u}]=${t[u]} equals ${u+1}`),t[u]!==u+1){r.add_conditional("is_missing",!0),o(void 0,[u]),r.update_visual(`elem_${s[u]}`,{type:"arrayElement",value:t[u],position:u,state:"missingSpot"}),r.update_visual("meta_answer",{type:"metadata",value:u+1}),r.update_visual("meta_flash",{type:"metadata",value:"found"}),l(["done","done"]),r.record("found",`nums[${u}]=${t[u]} ≠ ${u+1}, first missing positive is ${u+1}`),c=!0;break}r.add_conditional("is_missing",!1),o(),r.record("continue_search",`nums[${u}]=${t[u]} equals ${u+1}, continue search`)}return c||(r.delete_visual("ptr_i"),r.delete_variable("i"),r.update_visual("meta_answer",{type:"metadata",value:i+1}),r.update_visual("meta_flash",{type:"metadata",value:"found"}),l(["done","done"]),r.record("all_present",`All numbers 1 to ${i} are present. First missing positive is ${i+1}`)),r.getSteps()
}

export function FirstMissingPositiveProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FirstMissingPositiveTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFirstMissingPositiveSteps(e) as any[];
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
      title="First Missing Positive"
      slug="first-missing-positive"
      approaches={approaches}
      presets={FirstMissingPositivePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Apple Redistribution into Boxes (apple-redistribution-into-boxes)
// ==========================================

const AppleRedistributionIntoBoxesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def minimumBoxes(self, apple: list[int], capacity: list[int]) -> int:\n        total_apples = sum(apple)\n\n        # Sort capacity in descending order\n        capacity.sort(reverse=True)\n\n        current_capacity = 0\n        for i, cap in enumerate(capacity):\n            current_capacity += cap\n            if current_capacity >= total_apples:\n                return i + 1  # i is 0-indexed, so boxes used = i + 1\n\n        return len(capacity)",
    "lineMap": {
      "-": [
        2
      ],
      "compute_total": [
        3
      ],
      "sort": [
        5,
        6
      ],
      "init_vars": [
        8
      ],
      "add_capacity": [
        9,
        10
      ],
      "found": [
        11
      ],
      "not_enough": [
        11
      ],
      "complete_found": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "check_enough": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int minimumBoxes(int[] apple, int[] capacity) {\n        int totalApples = 0;\n        for (int a : apple) totalApples += a;\n\n        // Sort capacity in ascending order, then iterate from the end\n        Arrays.sort(capacity);\n\n        int boxes = 0;\n        int currentCapacity = 0;\n\n        // Pick largest boxes first (iterate from right to left)\n        for (int i = capacity.length - 1; i >= 0; i--) {\n            currentCapacity += capacity[i];\n            boxes++;\n            if (currentCapacity >= totalApples) return boxes;\n        }\n        return boxes;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compute_total": [
        3,
        4
      ],
      "sort": [
        6,
        7
      ],
      "init_vars": [
        9,
        10
      ],
      "add_capacity": [
        12,
        13,
        14,
        15
      ],
      "found": [
        16
      ],
      "not_enough": [
        16
      ],
      "complete_found": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        13
      ],
      "check_enough": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int minimumBoxes(vector<int>& apple, vector<int>& capacity) {\n        int totalApples = 0;\n        for (int a : apple) totalApples += a;\n\n        // Sort in descending order\n        sort(capacity.begin(), capacity.end(), greater<int>());\n\n        int m = capacity.size();\n        int currentCapacity = 0;\n        for (int i = 0; i < m; i++) {\n            currentCapacity += capacity[i];\n            if (currentCapacity >= totalApples) return i + 1;\n        }\n        return m;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "compute_total": [
        4,
        5
      ],
      "sort": [
        7,
        8
      ],
      "init_vars": [
        10,
        11
      ],
      "add_capacity": [
        12,
        13
      ],
      "found": [
        14
      ],
      "not_enough": [
        14
      ],
      "complete_found": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "check_enough": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MinimumBoxes(int[] apple, int[] capacity) {\n        int totalApples = 0;\n        foreach (int a in apple) totalApples += a;\n\n        // Sort ascending, then iterate from the end for descending\n        Array.Sort(capacity);\n\n        int boxes = 0;\n        int currentCapacity = 0;\n\n        for (int i = capacity.Length - 1; i >= 0; i--) {\n            currentCapacity += capacity[i];\n            boxes++;\n            if (currentCapacity >= totalApples) return boxes;\n        }\n        return boxes;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compute_total": [
        3,
        4
      ],
      "sort": [
        6,
        7
      ],
      "init_vars": [
        9,
        10
      ],
      "add_capacity": [
        12,
        13,
        14
      ],
      "found": [
        15
      ],
      "not_enough": [
        15
      ],
      "complete_found": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "for_loop": [
        12
      ],
      "check_enough": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func minimumBoxes(apple []int, capacity []int) int {\n    totalApples := 0\n    for _, a := range apple {\n        totalApples += a\n    }\n\n    // Sort in ascending order\n    sort.Ints(capacity)\n\n    currentCapacity := 0\n    boxes := 0\n\n    // Pick largest boxes first (iterate from right to left)\n    for i := len(capacity) - 1; i >= 0; i-- {\n        currentCapacity += capacity[i]\n        boxes++\n        if currentCapacity >= totalApples {\n            return boxes\n        }\n    }\n    return boxes\n}",
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
      "sort": [
        7,
        8
      ],
      "init_vars": [
        10,
        11
      ],
      "add_capacity": [
        13,
        14,
        15,
        16
      ],
      "found": [
        17
      ],
      "not_enough": [
        17
      ],
      "complete_found": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        14
      ],
      "check_enough": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var minimumBoxes = function(apple, capacity) {\n    var totalApples = 0;\n    for (var i = 0; i < apple.length; i++) totalApples += apple[i];\n\n    // Sort descending (numeric comparator required)\n    capacity.sort(function(a, b) { return b - a; });\n\n    var currentCapacity = 0;\n    for (var j = 0; j < capacity.length; j++) {\n        currentCapacity += capacity[j];\n        if (currentCapacity >= totalApples) return j + 1;\n    }\n    return capacity.length;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3
      ],
      "sort": [
        5,
        6
      ],
      "init_vars": [
        8
      ],
      "add_capacity": [
        9,
        10
      ],
      "found": [
        11
      ],
      "not_enough": [
        11
      ],
      "complete_found": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "check_enough": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function minimumBoxes(apple: number[], capacity: number[]): number {\n    let totalApples = 0;\n    for (const a of apple) totalApples += a;\n\n    // Sort descending\n    capacity.sort((a, b) => b - a);\n\n    let currentCapacity = 0;\n    for (let i = 0; i < capacity.length; i++) {\n        currentCapacity += capacity[i];\n        if (currentCapacity >= totalApples) return i + 1;\n    }\n    return capacity.length;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_total": [
        2,
        3
      ],
      "sort": [
        5,
        6
      ],
      "init_vars": [
        8
      ],
      "add_capacity": [
        9,
        10
      ],
      "found": [
        11
      ],
      "not_enough": [
        11
      ],
      "complete_found": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "for_loop": [
        9
      ],
      "check_enough": [
        11
      ]
    }
  }
};

const AppleRedistributionIntoBoxesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "apple": [
        1,
        3,
        2
      ],
      "capacity": [
        4,
        3,
        1,
        5,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "apple": [
        5,
        5,
        5
      ],
      "capacity": [
        2,
        4,
        2,
        7
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single apple pack",
    "value": {
      "apple": [
        3
      ],
      "capacity": [
        5,
        3
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Fewer boxes",
    "value": {
      "apple": [
        2,
        2,
        2,
        2
      ],
      "capacity": [
        3,
        5,
        4
      ]
    }
  }
];

function generateAppleRedistributionIntoBoxesSteps(e: any): any[] {
  let t=[...e.apple],i=[...e.capacity],n=i.map((e,t)=>[e,t]).sort((e,t)=>t[0]-e[0]||e[1]-t[1]).map(([,e])=>e),r=n.map(e=>i[e]),l={};t.forEach((e,t)=>{l[`apple_${t}`]={type:"arrayElement",value:e,position:t}}),r.forEach((e,t)=>{l[`cap_${t}`]={type:"arrayElement",value:e,position:n[t]}});let o=new StepRecorder({},l);o.update_variable("mode","greedy"),o.record("-","Start: Find the minimum number of boxes that hold all apples");let s=t.reduce((e,t)=>e+t,0);o.add_new_variable("totalApples",s),o.record("compute_total",`Sum all apple packs: totalApples = ${s}`),r.forEach((e,t)=>{o.update_visual(`cap_${t}`,{type:"arrayElement",value:e,position:t})}),o.record("sort",`Order the boxes largest first: [${r.join(", ")}]`);let c=0,p=0;o.add_new_variable("boxes",c),o.add_new_variable("currentCapacity",p),r.length>0&&o.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),o.record("init_vars","Initialize boxes = 0, currentCapacity = 0");for(let e=0;e<r.length;e++){o.add_conditional("for_loop",!0);let t=r[e],i=p;if(p+=t,c++,o.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),o.update_variable("i",e),o.update_variable("capVal",t),o.update_variable("prevCap",i),o.update_variable("currentCapacity",p),o.update_variable("boxes",c),o.record("add_capacity",`Take box with capacity ${t}: currentCapacity = ${i} + ${t} = ${p}, boxes = ${c}`),p>=s)return o.add_conditional("check_enough",!0),o.record("found",`currentCapacity (${p}) ≥ totalApples (${s}). ${c} ${1===c?"box is":"boxes are"} enough!`),o.delete_visual("ptr_i"),o.record("complete_found",`Done! Minimum boxes needed: ${c}`),o.getSteps();o.add_conditional("check_enough",!1),o.record("not_enough",`currentCapacity (${p}) < totalApples (${s}). Need more boxes`)}return o.add_conditional("for_loop",!1),o.delete_visual("ptr_i"),o.record("complete",`Used all ${c} boxes`),o.getSteps()
}

export function AppleRedistributionIntoBoxesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: AppleRedistributionIntoBoxesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateAppleRedistributionIntoBoxesSteps(e) as any[];
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
      title="Apple Redistribution into Boxes"
      slug="apple-redistribution-into-boxes"
      approaches={approaches}
      presets={AppleRedistributionIntoBoxesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Contains Duplicate (contains-duplicate)
// ==========================================

const ContainsDuplicateTemplates = {
  "python": {
    "language": "python",
    "code": "def containsDuplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        4
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        6
      ],
      "no_duplicate": [
        7
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        7
      ]
    },
    "conditionalMap": {
      "check_set": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean containsDuplicate(int[] nums) {\n    HashSet<Integer> seen = new HashSet<>();\n    for (int num : nums) {\n        if (!seen.add(num)) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        4
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        4
      ],
      "no_duplicate": [
        8
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        8
      ]
    },
    "conditionalMap": {
      "check_set": [
        4
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool containsDuplicate(vector<int>& nums) {\n    unordered_set<int> seen;\n    for (int num : nums) {\n        // If insertion fails, element already exists\n        if (!seen.insert(num).second) return true;\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        5
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        5
      ],
      "no_duplicate": [
        7
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        7
      ]
    },
    "conditionalMap": {
      "check_set": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool ContainsDuplicate(int[] nums) {\n    HashSet<int> seen = new HashSet<int>();\n    foreach (int num in nums) {\n        if (!seen.Add(num)) {\n            return true;\n        }\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        4
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        4
      ],
      "no_duplicate": [
        8
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        8
      ]
    },
    "conditionalMap": {
      "check_set": [
        4
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func containsDuplicate(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, num := range nums {\n        if seen[num] {\n            return true\n        }\n        seen[num] = true\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        4
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        7
      ],
      "no_duplicate": [
        9
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        9
      ]
    },
    "conditionalMap": {
      "check_set": [
        4
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (let i = 0; i < nums.length; i++) {\n        // If already in the set, we found a duplicate\n        if (seen.has(nums[i])) return true;\n        seen.add(nums[i]);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        5
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        6
      ],
      "no_duplicate": [
        8
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        8
      ]
    },
    "conditionalMap": {
      "check_set": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function containsDuplicate(nums: number[]): boolean {\n    const seen = new Set<number>();\n    for (const num of nums) {\n        if (seen.has(num)) {\n            return true;\n        }\n        seen.add(num);\n    }\n    return false;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_set": [
        2
      ],
      "loop": [
        3
      ],
      "check_set": [
        4
      ],
      "found_duplicate": [
        5
      ],
      "add_to_set": [
        7
      ],
      "no_duplicate": [
        9
      ],
      "complete_true": [
        5
      ],
      "complete_false": [
        9
      ]
    },
    "conditionalMap": {
      "check_set": [
        4
      ]
    }
  }
};

const ContainsDuplicatePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Has Duplicate",
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
    "label": "No Duplicate",
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
    "id": "ex3",
    "label": "Immediate Duplicate",
    "value": {
      "nums": [
        3,
        3
      ]
    }
  }
];

function generateContainsDuplicateSteps(e: any): any[] {
  let t=[...e.nums].sort((e,t)=>e-t),n=t.length,l={};for(let e=0;e<n;e++)l[`elem_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};l.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let r=new StepRecorder({nums:t,i:-1,a:null,b:null,isEqual:null,result:null},l),a=e=>{Object.entries(e).forEach(([e,t])=>r.update_variable(e,t))},s=(e,t)=>{r.update_visual("ptr_i",{type:"pointer",position:e,state:t,label:"i"})};r.record("-","Sort the array so any duplicates land next to each other"),a({i:-1}),r.record("init","Sorted. Now check each element against its neighbor");for(let e=0;e<n-1;e++){let n=t[e]===t[e+1];if(s(e,"active"),a({i:e,a:t[e],b:t[e+1],isEqual:n}),r.add_conditional("is_equal",n),r.record("compare_adjacent",`nums[${e}] = ${t[e]} ${n?"==":"!="} nums[${e+1}] = ${t[e+1]}`),n)return a({result:!0}),r.record("found_dup",`Neighbors ${t[e]} and ${t[e+1]} match: duplicate found`),r.record("complete_true",`Result: true (${t[e]} appears twice)`),r.getSteps()}return s(Math.max(0,n-1),"idle"),a({i:-1,a:null,b:null,isEqual:null,result:!1}),r.record("no_dup","No two neighbors are equal"),r.record("complete_false","Result: false (all elements are unique)"),r.getSteps()
}

export function ContainsDuplicateProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContainsDuplicateTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContainsDuplicateSteps(e) as any[];
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
      title="Contains Duplicate"
      slug="contains-duplicate"
      approaches={approaches}
      presets={ContainsDuplicatePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Contains Duplicate III (contains-duplicate-iii)
// ==========================================

const ContainsDuplicateIiiTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def containsNearbyAlmostDuplicate(self, nums: list[int], indexDiff: int, valueDiff: int) -> bool:\n        if valueDiff < 0:\n            return False\n\n        w = valueDiff + 1\n        buckets = {}\n\n        for i in range(len(nums)):\n            # Python's // operator does floor division natively\n            bucket_id = nums[i] // w\n\n            # Same bucket means values are within valueDiff\n            if bucket_id in buckets:\n                return True\n\n            # Check left neighbor bucket\n            if bucket_id - 1 in buckets and abs(nums[i] - buckets[bucket_id - 1]) <= valueDiff:\n                return True\n\n            # Check right neighbor bucket\n            if bucket_id + 1 in buckets and abs(nums[i] - buckets[bucket_id + 1]) <= valueDiff:\n                return True\n\n            buckets[bucket_id] = nums[i]\n\n            # Slide the window: remove element that's now out of range\n            if i >= indexDiff:\n                old_bucket = nums[i - indexDiff] // w\n                del buckets[old_bucket]\n\n        return False",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        6,
        7
      ],
      "compute_bucket": [
        9,
        10,
        11
      ],
      "found_same_bucket": [
        14,
        15
      ],
      "check_left": [
        18,
        19
      ],
      "check_right": [
        22,
        23
      ],
      "insert_bucket": [
        25
      ],
      "remove_old": [
        28,
        29,
        30
      ],
      "complete": [
        32
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean containsNearbyAlmostDuplicate(int[] nums, int indexDiff, int valueDiff) {\n        if (valueDiff < 0) return false;\n        long w = (long) valueDiff + 1;\n        HashMap<Long, Long> buckets = new HashMap<>();\n\n        for (int i = 0; i < nums.length; i++) {\n            long bucketId = getBucketId(nums[i], w);\n\n            // Same bucket means values are within valueDiff\n            if (buckets.containsKey(bucketId)) return true;\n\n            // Check left neighbor bucket\n            if (buckets.containsKey(bucketId - 1) &&\n                Math.abs(nums[i] - buckets.get(bucketId - 1)) <= valueDiff) {\n                return true;\n            }\n\n            // Check right neighbor bucket\n            if (buckets.containsKey(bucketId + 1) &&\n                Math.abs(nums[i] - buckets.get(bucketId + 1)) <= valueDiff) {\n                return true;\n            }\n\n            buckets.put(bucketId, (long) nums[i]);\n\n            // Slide the window: remove element that's now out of range\n            if (i >= indexDiff) {\n                long oldBucket = getBucketId(nums[i - indexDiff], w);\n                buckets.remove(oldBucket);\n            }\n        }\n        return false;\n    }\n\n    // Floor division to handle negatives correctly\n    private long getBucketId(long num, long w) {\n        return num >= 0 ? num / w : (num + 1) / w - 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        4,
        5
      ],
      "compute_bucket": [
        7,
        8
      ],
      "found_same_bucket": [
        11
      ],
      "check_left": [
        14,
        15,
        16,
        17
      ],
      "check_right": [
        20,
        21,
        22,
        23
      ],
      "insert_bucket": [
        25
      ],
      "remove_old": [
        28,
        29,
        30,
        31
      ],
      "complete": [
        33
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool containsNearbyAlmostDuplicate(vector<int>& nums, int indexDiff, int valueDiff) {\n        if (valueDiff < 0) return false;\n        long long w = (long long) valueDiff + 1;\n        unordered_map<long long, long long> buckets;\n\n        for (int i = 0; i < (int) nums.size(); i++) {\n            long long bucketId = getBucketId(nums[i], w);\n\n            // Same bucket means values are within valueDiff\n            if (buckets.count(bucketId)) return true;\n\n            // Check left neighbor bucket\n            if (buckets.count(bucketId - 1) &&\n                abs(nums[i] - buckets[bucketId - 1]) <= valueDiff) {\n                return true;\n            }\n\n            // Check right neighbor bucket\n            if (buckets.count(bucketId + 1) &&\n                abs(nums[i] - buckets[bucketId + 1]) <= valueDiff) {\n                return true;\n            }\n\n            buckets[bucketId] = nums[i];\n\n            // Slide the window: remove element that's now out of range\n            if (i >= indexDiff) {\n                long long oldBucket = getBucketId(nums[i - indexDiff], w);\n                buckets.erase(oldBucket);\n            }\n        }\n        return false;\n    }\n\nprivate:\n    // Floor division to handle negatives correctly\n    long long getBucketId(long long num, long long w) {\n        return num >= 0 ? num / w : (num + 1) / w - 1;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        5,
        6
      ],
      "compute_bucket": [
        8,
        9
      ],
      "found_same_bucket": [
        12
      ],
      "check_left": [
        15,
        16,
        17,
        18
      ],
      "check_right": [
        21,
        22,
        23,
        24
      ],
      "insert_bucket": [
        26
      ],
      "remove_old": [
        29,
        30,
        31,
        32
      ],
      "complete": [
        34
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var containsNearbyAlmostDuplicate = function(nums, indexDiff, valueDiff) {\n    if (valueDiff < 0) return false;\n    var w = valueDiff + 1;\n    var buckets = new Map();\n\n    for (var i = 0; i < nums.length; i++) {\n        var bucketId = getBucketId(nums[i], w);\n\n        // Same bucket means values are within valueDiff\n        if (buckets.has(bucketId)) return true;\n\n        // Check left neighbor bucket\n        if (buckets.has(bucketId - 1) &&\n            Math.abs(nums[i] - buckets.get(bucketId - 1)) <= valueDiff) {\n            return true;\n        }\n\n        // Check right neighbor bucket\n        if (buckets.has(bucketId + 1) &&\n            Math.abs(nums[i] - buckets.get(bucketId + 1)) <= valueDiff) {\n            return true;\n        }\n\n        buckets.set(bucketId, nums[i]);\n\n        // Slide the window: remove element that's now out of range\n        if (i >= indexDiff) {\n            var oldBucket = getBucketId(nums[i - indexDiff], w);\n            buckets.delete(oldBucket);\n        }\n    }\n    return false;\n};\n\n// Math.floor on real division is true floor division, including for negatives\nfunction getBucketId(num, w) {\n    return Math.floor(num / w);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4
      ],
      "compute_bucket": [
        6,
        7
      ],
      "found_same_bucket": [
        10
      ],
      "check_left": [
        13,
        14,
        15,
        16
      ],
      "check_right": [
        19,
        20,
        21,
        22
      ],
      "insert_bucket": [
        24
      ],
      "remove_old": [
        27,
        28,
        29,
        30
      ],
      "complete": [
        32
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function containsNearbyAlmostDuplicate(nums: number[], indexDiff: number, valueDiff: number): boolean {\n    if (valueDiff < 0) return false;\n    const w = valueDiff + 1;\n    const buckets = new Map<number, number>();\n\n    for (let i = 0; i < nums.length; i++) {\n        const bucketId = getBucketIdHelper(nums[i], w);\n\n        // Same bucket means values are within valueDiff\n        if (buckets.has(bucketId)) return true;\n\n        // Check left neighbor bucket\n        if (buckets.has(bucketId - 1) &&\n            Math.abs(nums[i] - buckets.get(bucketId - 1)!) <= valueDiff) {\n            return true;\n        }\n\n        // Check right neighbor bucket\n        if (buckets.has(bucketId + 1) &&\n            Math.abs(nums[i] - buckets.get(bucketId + 1)!) <= valueDiff) {\n            return true;\n        }\n\n        buckets.set(bucketId, nums[i]);\n\n        // Slide the window: remove element that's now out of range\n        if (i >= indexDiff) {\n            const oldBucket = getBucketIdHelper(nums[i - indexDiff], w);\n            buckets.delete(oldBucket);\n        }\n    }\n    return false;\n}\n\n// Math.floor on real division is true floor division, including for negatives\nfunction getBucketIdHelper(num: number, w: number): number {\n    return Math.floor(num / w);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3,
        4
      ],
      "compute_bucket": [
        6,
        7
      ],
      "found_same_bucket": [
        10
      ],
      "check_left": [
        13,
        14,
        15,
        16
      ],
      "check_right": [
        19,
        20,
        21,
        22
      ],
      "insert_bucket": [
        24
      ],
      "remove_old": [
        27,
        28,
        29,
        30
      ],
      "complete": [
        32
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func containsNearbyAlmostDuplicate(nums []int, indexDiff int, valueDiff int) bool {\n    if valueDiff < 0 {\n        return false\n    }\n    w := valueDiff + 1\n    buckets := make(map[int]int)\n\n    for i := 0; i < len(nums); i++ {\n        bucketId := getBucketId(nums[i], w)\n\n        // Same bucket means values are within valueDiff\n        if _, ok := buckets[bucketId]; ok {\n            return true\n        }\n\n        // Check left neighbor bucket\n        if val, ok := buckets[bucketId-1]; ok {\n            if abs(nums[i]-val) <= valueDiff {\n                return true\n            }\n        }\n\n        // Check right neighbor bucket\n        if val, ok := buckets[bucketId+1]; ok {\n            if abs(nums[i]-val) <= valueDiff {\n                return true\n            }\n        }\n\n        buckets[bucketId] = nums[i]\n\n        // Slide the window: remove element that's now out of range\n        if i >= indexDiff {\n            oldBucket := getBucketId(nums[i-indexDiff], w)\n            delete(buckets, oldBucket)\n        }\n    }\n    return false\n}\n\n// Floor division to handle negatives correctly\nfunc getBucketId(num int, w int) int {\n    if num >= 0 {\n        return num / w\n    }\n    return (num+1)/w - 1\n}\n\nfunc abs(x int) int {\n    if x < 0 {\n        return -x\n    }\n    return x\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5,
        6
      ],
      "compute_bucket": [
        8,
        9
      ],
      "found_same_bucket": [
        12,
        13,
        14
      ],
      "check_left": [
        17,
        18,
        19,
        20,
        21
      ],
      "check_right": [
        24,
        25,
        26,
        27,
        28
      ],
      "insert_bucket": [
        30
      ],
      "remove_old": [
        33,
        34,
        35,
        36
      ],
      "complete": [
        38
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool ContainsNearbyAlmostDuplicate(int[] nums, int indexDiff, int valueDiff) {\n        if (valueDiff < 0) return false;\n        long w = (long) valueDiff + 1;\n        Dictionary<long, long> buckets = new Dictionary<long, long>();\n\n        for (int i = 0; i < nums.Length; i++) {\n            long bucketId = GetBucketId(nums[i], w);\n\n            // Same bucket means values are within valueDiff\n            if (buckets.ContainsKey(bucketId)) return true;\n\n            // Check left neighbor bucket\n            if (buckets.ContainsKey(bucketId - 1) &&\n                Math.Abs(nums[i] - buckets[bucketId - 1]) <= valueDiff) {\n                return true;\n            }\n\n            // Check right neighbor bucket\n            if (buckets.ContainsKey(bucketId + 1) &&\n                Math.Abs(nums[i] - buckets[bucketId + 1]) <= valueDiff) {\n                return true;\n            }\n\n            buckets[bucketId] = nums[i];\n\n            // Slide the window: remove element that's now out of range\n            if (i >= indexDiff) {\n                long oldBucket = GetBucketId(nums[i - indexDiff], w);\n                buckets.Remove(oldBucket);\n            }\n        }\n        return false;\n    }\n\n    private long GetBucketId(long num, long w) {\n        return num >= 0 ? num / w : (num + 1) / w - 1;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        4,
        5
      ],
      "compute_bucket": [
        7,
        8
      ],
      "found_same_bucket": [
        11
      ],
      "check_left": [
        14,
        15,
        16,
        17
      ],
      "check_right": [
        20,
        21,
        22,
        23
      ],
      "insert_bucket": [
        25
      ],
      "remove_old": [
        28,
        29,
        30,
        31
      ],
      "complete": [
        33
      ]
    }
  }
};

const ContainsDuplicateIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Found (same value)",
    "value": {
      "nums": [
        1,
        2,
        3,
        1
      ],
      "indexDiff": 3,
      "valueDiff": 0
    }
  },
  {
    "id": "ex2",
    "label": "Not found",
    "value": {
      "nums": [
        1,
        5,
        9,
        1,
        5,
        9
      ],
      "indexDiff": 2,
      "valueDiff": 3
    }
  }
];

function generateContainsDuplicateIiiSteps(e: any): any[] {
  const l = (e, t) => Math.floor(e / t);
let t=e.nums??[],i=e.indexDiff,a=e.valueDiff,r={};t.forEach((e,t)=>{r[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let s=new StepRecorder({nums:t,indexDiff:i,valueDiff:a,phase:"start",found:!1},r);if(s.record("-","Find a near-duplicate: |i−j| ≤ indexDiff and |nums[i]−nums[j]| ≤ valueDiff"),a<0)return s.update_variable("phase","done"),s.record("complete","valueDiff < 0 → return false"),s.getSteps();let u=a+1,o=new Map,c=new Map,d=()=>[...o.keys()].sort((e,t)=>e-t).map(e=>({id:e,value:o.get(e),idx:c.get(e)}));s.update_variable("phase","scan"),s.update_variable("w",u),s.update_variable("bucketList",d()),s.record("init",`Bucket width w = valueDiff + 1 = ${u}  →  same bucket means |diff| ≤ ${a}`);for(let e=0;e<t.length;e++){let n=t[e],r=l(n,u),f=Math.max(0,e-i);if(s.update_variable("i",e),s.update_variable("curVal",n),s.update_variable("curBucket",r),s.update_variable("windowStart",f),s.update_variable("check","compute"),s.delete_variable("checkBucket"),s.delete_variable("neighborVal"),s.delete_variable("diff"),s.delete_variable("match"),s.delete_variable("removed"),s.record("compute_bucket",`nums[${e}] = ${n}  →  bucket B${r}`),o.has(r)){let t=o.get(r),i=c.get(r);return s.update_variable("found",!0),s.update_variable("match",{bucket:r,value:t,idx:i,diff:Math.abs(n-t)}),s.record("found_same_bucket",`B${r} already holds ${t} → same bucket, |${n}−${t}| ≤ ${a}`),s.update_variable("phase","done"),s.record("complete",`Return true — near-duplicate (nums[${e}] and nums[${i}])`),s.getSteps()}if(o.has(r-1)){let t=o.get(r-1),i=c.get(r-1),l=Math.abs(n-t);if(s.update_variable("check","left"),s.update_variable("checkBucket",r-1),s.update_variable("neighborVal",t),s.update_variable("diff",l),l<=a&&(s.update_variable("found",!0),s.update_variable("match",{bucket:r-1,value:t,idx:i,diff:l})),s.record("check_left",`left B${r-1} = ${t}: |${n}−${t}| = ${l} ${l<=a?"≤":">"} ${a}`),l<=a)return s.update_variable("phase","done"),s.record("complete",`Return true — near-duplicate (nums[${e}] and nums[${i}])`),s.getSteps()}if(o.has(r+1)){let t=o.get(r+1),i=c.get(r+1),l=Math.abs(n-t);if(s.update_variable("check","right"),s.update_variable("checkBucket",r+1),s.update_variable("neighborVal",t),s.update_variable("diff",l),l<=a&&(s.update_variable("found",!0),s.update_variable("match",{bucket:r+1,value:t,idx:i,diff:l})),s.record("check_right",`right B${r+1} = ${t}: |${n}−${t}| = ${l} ${l<=a?"≤":">"} ${a}`),l<=a)return s.update_variable("phase","done"),s.record("complete",`Return true — near-duplicate (nums[${e}] and nums[${i}])`),s.getSteps()}if(o.set(r,n),c.set(r,e),s.update_variable("check","insert"),s.delete_variable("checkBucket"),s.delete_variable("neighborVal"),s.delete_variable("diff"),s.update_variable("bucketList",d()),s.record("insert_bucket",`Insert ${n} into bucket B${r}`),e>=i){let n=e-i,a=t[n],r=l(a,u);o.delete(r),c.delete(r),s.update_variable("check","remove"),s.update_variable("removed",{idx:n,value:a,bucket:r}),s.update_variable("windowStart",Math.max(0,e+1-i)),s.update_variable("bucketList",d()),s.record("remove_old",`Slide window: drop nums[${n}] = ${a} from B${r}`)}}return s.update_variable("phase","done"),s.delete_variable("i"),s.delete_variable("curVal"),s.delete_variable("curBucket"),s.delete_variable("check"),s.record("complete","No near-duplicate found → return false"),s.getSteps()
}

export function ContainsDuplicateIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ContainsDuplicateIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateContainsDuplicateIiiSteps(e) as any[];
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
      title="Contains Duplicate III"
      slug="contains-duplicate-iii"
      approaches={approaches}
      presets={ContainsDuplicateIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count Binary Substrings (count-binary-substrings)
// ==========================================

const CountBinarySubstringsTemplates = {
  "python": {
    "language": "python",
    "code": "def countBinarySubstrings(s):\n    prev_group_size = 0\n    curr_group_size = 1\n    count = 0\n    for i in range(1, len(s)):\n        if s[i] == s[i - 1]:\n            curr_group_size += 1\n        else:\n            prev_group_size = curr_group_size\n            curr_group_size = 1\n        if prev_group_size >= curr_group_size:\n            count += 1\n    return count",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        11,
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int countBinarySubstrings(String s) {\n    int prevGroupSize = 0;\n    int currGroupSize = 1;\n    int count = 0;\n    for (int i = 1; i < s.length(); i++) {\n        if (s.charAt(i) == s.charAt(i - 1)) {\n            currGroupSize++;\n        } else {\n            prevGroupSize = currGroupSize;\n            currGroupSize = 1;\n        }\n        if (prevGroupSize >= currGroupSize) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int countBinarySubstrings(string s) {\n    int prevGroupSize = 0;\n    int currGroupSize = 1;\n    int count = 0;\n    for (int i = 1; i < s.size(); i++) {\n        if (s[i] == s[i - 1]) {\n            currGroupSize++;\n        } else {\n            prevGroupSize = currGroupSize;\n            currGroupSize = 1;\n        }\n        if (prevGroupSize >= currGroupSize) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int CountBinarySubstrings(string s) {\n    int prevGroupSize = 0;\n    int currGroupSize = 1;\n    int count = 0;\n    for (int i = 1; i < s.Length; i++) {\n        if (s[i] == s[i - 1]) {\n            currGroupSize++;\n        } else {\n            prevGroupSize = currGroupSize;\n            currGroupSize = 1;\n        }\n        if (prevGroupSize >= currGroupSize) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countBinarySubstrings(s string) int {\n    prevGroupSize := 0\n    currGroupSize := 1\n    count := 0\n    for i := 1; i < len(s); i++ {\n        if s[i] == s[i-1] {\n            currGroupSize++\n        } else {\n            prevGroupSize = currGroupSize\n            currGroupSize = 1\n        }\n        if prevGroupSize >= currGroupSize {\n            count++\n        }\n    }\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function countBinarySubstrings(s) {\n    let prevGroupSize = 0;\n    let currGroupSize = 1;\n    let count = 0;\n    for (let i = 1; i < s.length; i++) {\n        if (s[i] === s[i - 1]) {\n            currGroupSize++;\n        } else {\n            prevGroupSize = currGroupSize;\n            currGroupSize = 1;\n        }\n        if (prevGroupSize >= currGroupSize) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countBinarySubstrings(s: string): number {\n    let prevGroupSize = 0;\n    let currGroupSize = 1;\n    let count = 0;\n    for (let i = 1; i < s.length; i++) {\n        if (s[i] === s[i - 1]) {\n            currGroupSize++;\n        } else {\n            prevGroupSize = currGroupSize;\n            currGroupSize = 1;\n        }\n        if (prevGroupSize >= currGroupSize) {\n            count++;\n        }\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "extend": [
        6,
        7
      ],
      "new_group": [
        9,
        10
      ],
      "count_inc": [
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "same_char": [
        6
      ],
      "pair_check": [
        12
      ]
    }
  }
};

const CountBinarySubstringsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "00110011",
    "value": {
      "s": "00110011"
    }
  },
  {
    "id": "ex2",
    "label": "10101",
    "value": {
      "s": "10101"
    }
  },
  {
    "id": "ex3",
    "label": "00110",
    "value": {
      "s": "00110"
    }
  }
];

function generateCountBinarySubstringsSteps(e: any): any[] {
  let t=e.s,i=t.length,r={};for(let e=0;e<i;e++)r[`char_${e}`]={type:"arrayElement",value:t[e],position:e};let a=new StepRecorder({s:t},{...r}),l=e=>a.update_variable("exprParts",e),o=e=>e.map(e=>e.size);a.record("-",`Count substrings of "${t}" with equal runs of 0s and 1s`);let s=[];a.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),a.update_variable("phase","build"),a.update_variable("groups",[]),a.update_variable("i",0),l([{t:"groups = []",c:"cyan"},{t:"   walk the string run by run",c:"muted"}]),a.record("init","Split into groups of consecutive equal chars");let c=0;for(;c<i;){a.add_conditional("outer_while",!0);let e=t[c],n={start:c,end:c,size:0};for(s.push(n),a.update_visual("ptr_i",{type:"pointer",position:c,label:"i"}),a.update_variable("i",c),a.update_variable("ch",e),a.update_variable("groupSize",0),a.update_variable("groups",s.map(e=>({...e}))),l([{t:`ch = '${e}'`,c:"cyan"},{t:"   open a run at ",c:"muted"},{t:`i = ${c}`,c:"cyan"},{t:"   groupSize = 0",c:"muted"}]),a.record("start_group",`Open a run of '${e}' at index ${c}`);c<i&&t[c]===e;)a.add_conditional("same_char",!0),n.size++,n.end=c,c++,a.update_visual("ptr_i",{type:"pointer",position:Math.min(c,i-1),label:"i"}),a.update_variable("i",c),a.update_variable("groupSize",n.size),a.update_variable("groups",s.map(e=>({...e}))),l([{t:`s[${c-1}] = '${e}'`,c:"cyan"},{t:"   run continues, groupSize = ",c:"muted"},{t:String(n.size),c:"cyan"}]),a.record("extend",`s[${c-1}] continues the run: groupSize = ${n.size}`);a.add_conditional("same_char",!1),a.update_variable("groups",s.map(e=>({...e})));let r=c>=i?"end of string":`s[${c}] = '${t[c]}' differs`;l([{t:`${r}`,c:"yellow"},{t:"  →  groups = ",c:"muted"},{t:`[${o(s).join(", ")}]`,c:"cyan"}]),a.record("close_group",`Run of '${e}' ends at size ${n.size}: groups = [${o(s).join(", ")}]`)}a.add_conditional("outer_while",!1),a.delete_variable("ch"),a.delete_variable("groupSize"),a.update_visual("ptr_i",{type:"pointer",position:i-1,label:"i",state:"exiting"}),a.update_variable("phase","sum");let u=0;a.update_variable("result",0),l([{t:`groups = [${o(s).join(", ")}]`,c:"cyan"},{t:"   add min of each adjacent pair",c:"muted"}]),a.record("sum_init",`groups = [${o(s).join(", ")}]; sum adjacent mins`);for(let e=0;e<s.length-1;e++){let t=s[e].size,i=s[e+1].size,n=Math.min(t,i);u+=n,a.update_variable("pairIdx",e+1),a.update_variable("pairMin",n),a.update_variable("result",u),a.update_variable("bandStart",s[e].end-n+1),a.update_variable("bandEnd",s[e+1].start+n-1),l([{t:`min(${t}, ${i})`,c:"green"},{t:" = ",c:"muted"},{t:String(n),c:"green"},{t:"  →  result = ",c:"muted"},{t:String(u),c:"green"}]),a.record("pair_min",`min(${t}, ${i}) = ${n}: result = ${u}`),a.delete_variable("bandStart"),a.delete_variable("bandEnd")}return a.delete_variable("pairIdx"),a.delete_variable("pairMin"),a.update_variable("done",!0),l([]),a.record("complete",`Return count = ${u}`),a.getSteps()
}

export function CountBinarySubstringsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountBinarySubstringsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountBinarySubstringsSteps(e) as any[];
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
      title="Count Binary Substrings"
      slug="count-binary-substrings"
      approaches={approaches}
      presets={CountBinarySubstringsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Find All Numbers Disappeared in an Array (find-all-numbers-disappeared-in-an-array)
// ==========================================

const FindAllNumbersDisappearedInAnArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findDisappearedNumbers(nums):\n    for i in range(len(nums)):\n        index = abs(nums[i]) - 1\n        if nums[index] > 0:\n            nums[index] = -nums[index]\n    result = []\n    for i in range(len(nums)):\n        if nums[i] > 0:\n            result.append(i + 1)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        6
      ],
      "scan_loop": [
        7
      ],
      "check_positive": [
        8
      ],
      "add_missing": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "is_positive": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> findDisappearedNumbers(int[] nums) {\n    for (int i = 0; i < nums.length; i++) {\n        int index = Math.abs(nums[i]) - 1;\n        if (nums[index] > 0) {\n            nums[index] = -nums[index];\n        }\n    }\n    List<Integer> result = new ArrayList<>();\n    for (int i = 0; i < nums.length; i++) {\n        if (nums[i] > 0)\n            result.add(i + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        8
      ],
      "scan_loop": [
        9
      ],
      "check_positive": [
        10
      ],
      "add_missing": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_positive": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findDisappearedNumbers(vector<int>& nums) {\n    for (int i = 0; i < nums.size(); i++) {\n        int index = abs(nums[i]) - 1;\n        if (nums[index] > 0) {\n            nums[index] = -nums[index];\n        }\n    }\n    vector<int> result;\n    for (int i = 0; i < nums.size(); i++) {\n        if (nums[i] > 0)\n            result.push_back(i + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        8
      ],
      "scan_loop": [
        9
      ],
      "check_positive": [
        10
      ],
      "add_missing": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_positive": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> FindDisappearedNumbers(int[] nums) {\n    for (int i = 0; i < nums.Length; i++) {\n        int index = Math.Abs(nums[i]) - 1;\n        if (nums[index] > 0) {\n            nums[index] = -nums[index];\n        }\n    }\n    IList<int> result = new List<int>();\n    for (int i = 0; i < nums.Length; i++) {\n        if (nums[i] > 0)\n            result.Add(i + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        8
      ],
      "scan_loop": [
        9
      ],
      "check_positive": [
        10
      ],
      "add_missing": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_positive": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findDisappearedNumbers(nums []int) []int {\n    for i := 0; i < len(nums); i++ {\n        index := nums[i]\n        if index < 0 {\n            index = -index\n        }\n        index--\n        if nums[index] > 0 {\n            nums[index] = -nums[index]\n        }\n    }\n    result := []int{}\n    for i := 0; i < len(nums); i++ {\n        if nums[i] > 0 {\n            result = append(result, i+1)\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "mark": [
        8,
        9
      ],
      "init_result": [
        12
      ],
      "scan_loop": [
        13
      ],
      "check_positive": [
        14
      ],
      "add_missing": [
        15
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "is_positive": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findDisappearedNumbers(nums) {\n    for (let i = 0; i < nums.length; i++) {\n        const index = Math.abs(nums[i]) - 1;\n        if (nums[index] > 0) {\n            nums[index] = -nums[index];\n        }\n    }\n    const result = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] > 0)\n            result.push(i + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        8
      ],
      "scan_loop": [
        9
      ],
      "check_positive": [
        10
      ],
      "add_missing": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_positive": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findDisappearedNumbers(nums: number[]): number[] {\n    for (let i = 0; i < nums.length; i++) {\n        const index = Math.abs(nums[i]) - 1;\n        if (nums[index] > 0) {\n            nums[index] = -nums[index];\n        }\n    }\n    const result: number[] = [];\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] > 0)\n            result.push(i + 1);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_loop": [
        2,
        3
      ],
      "mark": [
        4,
        5
      ],
      "init_result": [
        8
      ],
      "scan_loop": [
        9
      ],
      "check_positive": [
        10
      ],
      "add_missing": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_positive": [
        10
      ]
    }
  }
};

const FindAllNumbersDisappearedInAnArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        4,
        3,
        2,
        7,
        8,
        2,
        3,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "nums": [
        1,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "nums": [
        2,
        2,
        2
      ]
    }
  }
];

function generateFindAllNumbersDisappearedInAnArraySteps(e: any): any[] {
  let t=[...e.nums],n=t.length,s={};for(let e=0;e<n;e++)s[`cell_${e}`]={type:"arrayElement",value:t[e],position:e,state:"standard"};s.ptr_i={type:"pointer",position:0,state:"hidden",label:"i"};let r=new StepRecorder({n,phase:null,i:-1,correct:null,val:null,swapWith:null,result:[],curMissing:null},s),l=e=>{Object.entries(e).forEach(([e,t])=>r.update_variable(e,t))},a=(e,t)=>{r.update_visual("ptr_i",{type:"pointer",position:e,state:t,label:"i"})},o=e=>{r.update_visual(`cell_${e}`,{type:"arrayElement",value:t[e],position:e,state:"standard"})};r.record("-","Sort each value to index value-1, then report the slots left with the wrong number");let c=0;for(;c<n;){let e=t[c],n=e-1;a(c,"active"),l({phase:"sort",i:c,val:e,correct:n,swapWith:null}),r.record("select",`nums[${c}] = ${e} belongs at index ${e} - 1 = ${n}`);let i=t[c]!==t[n];if(r.add_conditional("needs_swap",i),i){l({swapWith:n});let i=t[c];t[c]=t[n],t[n]=i,o(c),o(n),l({swapWith:n}),r.record("swap",`Swap nums[${c}] and nums[${n}] to send ${e} home`)}else l({swapWith:null}),r.record("in_place",n===c?`nums[${c}] = ${e} is already home, move on`:`nums[${n}] already holds ${e}, move on`),c+=1}a(0,"hidden"),l({phase:"scan",i:-1,correct:null,val:null,swapWith:null}),r.record("init_scan","Sorted. Now report indices where nums[i] != i + 1");let u=[];for(let e=0;e<n;e++){a(e,"active"),l({phase:"scan",i:e,val:t[e],curMissing:null}),r.record("scan_loop",`Check index ${e}: nums[${e}] = ${t[e]}`);let n=t[e]===e+1;r.add_conditional("is_correct",n),l({curMissing:!n}),r.record("check_place",n?`nums[${e}] = ${e+1}: present`:`nums[${e}] = ${t[e]} != ${e+1}: ${e+1} is missing`),n||(u.push(e+1),l({result:[...u]}),r.record("add_missing",`${e+1} disappeared → add to result`))}return a(Math.max(0,n-1),"idle"),l({phase:"scan",i:-1,result:[...u]}),r.record("complete",u.length>0?`Missing numbers: [${u.join(", ")}]`:"No numbers are missing: []"),r.getSteps()
}

export function FindAllNumbersDisappearedInAnArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FindAllNumbersDisappearedInAnArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFindAllNumbersDisappearedInAnArraySteps(e) as any[];
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
      title="Find All Numbers Disappeared in an Array"
      slug="find-all-numbers-disappeared-in-an-array"
      approaches={approaches}
      presets={FindAllNumbersDisappearedInAnArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Majority Element II (majority-element-ii)
// ==========================================

const MajorityElementIiTemplates = {
  "python": {
    "language": "python",
    "code": "def majorityElement(nums: list[int]) -> list[int]:\n    n = len(nums)\n    threshold = n // 3\n    count_map = {}\n    result = []\n\n    # Count occurrences of each element\n    for num in nums:\n        count_map[num] = count_map.get(num, 0) + 1\n\n    # Collect elements that appear more than n/3 times\n    for num, count in count_map.items():\n        if count > threshold:\n            result.append(num)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init_map": [
        4
      ],
      "init_result": [
        5
      ],
      "count_element": [
        8
      ],
      "update_count": [
        9
      ],
      "check_count": [
        12
      ],
      "add_result": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_majority": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> majorityElement(int[] nums) {\n        int n = nums.length;\n        int threshold = n / 3;\n        Map<Integer, Integer> countMap = new HashMap<>();\n        List<Integer> result = new ArrayList<>();\n\n        // Count occurrences of each element\n        for (int num : nums) {\n            countMap.put(num, countMap.getOrDefault(num, 0) + 1);\n        }\n\n        // Collect elements that appear more than n/3 times\n        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {\n            if (entry.getValue() > threshold) {\n                result.add(entry.getKey());\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        5
      ],
      "init_result": [
        6
      ],
      "count_element": [
        9
      ],
      "update_count": [
        10
      ],
      "check_count": [
        14
      ],
      "add_result": [
        16
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_majority": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> majorityElement(vector<int>& nums) {\n        int n = nums.size();\n        int threshold = n / 3;\n        unordered_map<int, int> countMap;\n        vector<int> result;\n\n        // Count occurrences of each element\n        for (int num : nums) {\n            countMap[num]++;\n        }\n\n        // Collect elements that appear more than n/3 times\n        for (auto& [num, count] : countMap) {\n            if (count > threshold) {\n                result.push_back(num);\n            }\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init_map": [
        6
      ],
      "init_result": [
        7
      ],
      "count_element": [
        10
      ],
      "update_count": [
        11
      ],
      "check_count": [
        15
      ],
      "add_result": [
        17
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_majority": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> MajorityElement(int[] nums) {\n        int n = nums.Length;\n        int threshold = n / 3;\n        Dictionary<int, int> countMap = new Dictionary<int, int>();\n        List<int> result = new List<int>();\n\n        // Count occurrences of each element\n        foreach (int num in nums) {\n            if (countMap.ContainsKey(num)) {\n                countMap[num]++;\n            } else {\n                countMap[num] = 1;\n            }\n        }\n\n        // Collect elements that appear more than n/3 times\n        foreach (var entry in countMap) {\n            if (entry.Value > threshold) {\n                result.Add(entry.Key);\n            }\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init_map": [
        5
      ],
      "init_result": [
        6
      ],
      "count_element": [
        9
      ],
      "update_count": [
        10
      ],
      "check_count": [
        18
      ],
      "add_result": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_majority": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func majorityElement(nums []int) []int {\n    n := len(nums)\n    threshold := n / 3\n    countMap := make(map[int]int)\n    result := []int{}\n\n    // Count occurrences of each element\n    for _, num := range nums {\n        countMap[num]++\n    }\n\n    // Collect elements that appear more than n/3 times\n    for num, count := range countMap {\n        if count > threshold {\n            result = append(result, num)\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_map": [
        4
      ],
      "init_result": [
        5
      ],
      "count_element": [
        8
      ],
      "update_count": [
        9
      ],
      "check_count": [
        13
      ],
      "add_result": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_majority": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var majorityElement = function(nums) {\n    var n = nums.length;\n    var threshold = Math.floor(n / 3);\n    var countMap = new Map();\n    var result = [];\n\n    // Count occurrences of each element\n    for (var i = 0; i < n; i++) {\n        countMap.set(nums[i], (countMap.get(nums[i]) || 0) + 1);\n    }\n\n    // Collect elements that appear more than n/3 times\n    countMap.forEach(function(count, num) {\n        if (count > threshold) {\n            result.push(num);\n        }\n    });\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_map": [
        4
      ],
      "init_result": [
        5
      ],
      "count_element": [
        8
      ],
      "update_count": [
        9
      ],
      "check_count": [
        13
      ],
      "add_result": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_majority": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function majorityElement(nums: number[]): number[] {\n    const n = nums.length;\n    const threshold = Math.floor(n / 3);\n    const countMap = new Map<number, number>();\n    const result: number[] = [];\n\n    // Count occurrences of each element\n    for (const num of nums) {\n        countMap.set(num, (countMap.get(num) || 0) + 1);\n    }\n\n    // Collect elements that appear more than n/3 times\n    countMap.forEach((count, num) => {\n        if (count > threshold) {\n            result.push(num);\n        }\n    });\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_map": [
        4
      ],
      "init_result": [
        5
      ],
      "count_element": [
        8
      ],
      "update_count": [
        9
      ],
      "check_count": [
        13
      ],
      "add_result": [
        15
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_majority": [
        14
      ]
    }
  }
};

const MajorityElementIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        3,
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
        1,
        2,
        1,
        1,
        3,
        2,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "No Majority",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  }
];

function generateMajorityElementIiSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,i=Math.floor(n/3),l=i+1,r=t.map((e,t)=>({value:e,index:t}));r.sort((e,t)=>e.value===t.value?e.index-t.index:e.value-t.value);let u=Array(n);r.forEach((e,t)=>u[e.index]=t);let o=r.map(e=>e.value),c=new Set,s=new Set,d=[],m=(e,a)=>{let i={};for(let l=0;l<n;l++){let n=e?u[l]:l,r=t[l],o=a[n];!o&&(c.has(r)?o="majority":s.has(r)&&(o="faded")),i[`element_${l}`]={type:"arrayElement",value:r,position:n,...o&&{state:o}}}return i},p=(e,t,n)=>{for(let[a,i]of Object.entries(m(t,n)))e.update_visual(a,i)},_=(e,t,a)=>{let i={};for(let a=e;a<=t&&a<n;a++)i[a]="crown";return null!=a&&a<n&&(i[a]="active"),i},h=new StepRecorder({nums:[...t],n,need:l},{...m(!1,{}),meta_candidate:{type:"metadata",value:""},meta_count:{type:"metadata",value:0},meta_need:{type:"metadata",value:l},meta_result:{type:"metadata",value:"[]"},meta_flash:{type:"metadata",value:null}});h.record("-","Start: the array is unsorted, so equal values are scattered"),h.update_variable("nums",[...o]),p(h,!0,{}),h.record("sort_array","Sort the array so equal values sit together"),h.add_new_variable("result",[]),h.add_new_variable("i",0),h.record("init_result",`Walk block by block; a majority needs more than n/3 = ${i}`);let f=0;for(;f<n;){let e=o[f];h.update_variable("i",f),h.update_visual("i",{type:"pointer",position:f,label:"i"}),h.update_visual("j",{type:"pointer",position:f,label:"j"}),h.update_visual("meta_candidate",{type:"metadata",value:e}),h.update_visual("meta_count",{type:"metadata",value:0}),h.update_visual("meta_flash",{type:"metadata",value:null}),p(h,!0,_(f,f-1,f)),h.record("run_start",`A new block starts at index ${f} with value ${e}`);let t=f;for(;t<n&&o[t]===e;)t++,h.update_variable("j",t),h.update_visual("meta_count",{type:"metadata",value:t-f}),t<n?h.update_visual("j",{type:"pointer",position:t,label:"j"}):h.delete_visual("j"),p(h,!0,_(f,t-1,t)),h.record("extend_run",`nums[${t-1}] is ${e}, so the block is now ${t-f} long`);let a=t-f,l=a>i;h.add_conditional("is_majority",l),p(h,!0,_(f,t-1,null)),h.record("check_run",`The block of ${e} is ${a} long, which is ${l?"more than":"not more than"} ${i}`),l?(c.add(e),d.push(e),h.update_variable("result",[...d]),h.update_visual("meta_result",{type:"metadata",value:`[${d.join(", ")}]`}),h.update_visual("meta_flash",{type:"metadata",value:"result"}),p(h,!0,{}),h.record("add_result",`Add ${e} to the result`)):s.add(e),f=t,h.update_variable("i",f),h.update_visual("meta_flash",{type:"metadata",value:null}),f<n?h.update_visual("i",{type:"pointer",position:f,label:"i"}):h.delete_visual("i"),p(h,!0,{}),h.record("advance",f<n?`Jump i past the block to index ${f}`:"Jump i past the last block")}h.delete_visual("i"),h.delete_visual("j"),h.delete_variable("i"),h.delete_variable("j"),h.update_variable("result",[...d]),h.update_visual("meta_candidate",{type:"metadata",value:""}),h.update_visual("meta_count",{type:"metadata",value:0}),h.update_visual("meta_flash",{type:"metadata",value:"result"});for(let e=0;e<n;e++)h.update_visual(`element_${e}`,{type:"arrayElement",value:t[e],position:u[e],state:c.has(t[e])?"majority":"faded"});return h.record("complete",0===d.length?"Complete: no block is longer than n/3":`Complete: the majority elements are [${d.join(", ")}]`),h.getSteps()
}

export function MajorityElementIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MajorityElementIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMajorityElementIiSteps(e) as any[];
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
      title="Majority Element II"
      slug="majority-element-ii"
      approaches={approaches}
      presets={MajorityElementIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Consecutive Ones (max-consecutive-ones)
// ==========================================

const MaxConsecutiveOnesTemplates = {
  "python": {
    "language": "python",
    "code": "def findMaxConsecutiveOnes(nums: List[int]) -> int:\n    max_count = 0\n    count = 0\n\n    for num in nums:\n        if num == 1:\n            count += 1\n        else:\n            count = 0\n        max_count = max(max_count, count)\n\n    return max_count",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findMaxConsecutiveOnes(int[] nums) {\n    int maxCount = 0;\n    int count = 0;\n\n    for (int num : nums) {\n        if (num == 1) {\n            count++;\n        } else {\n            count = 0;\n        }\n        maxCount = Math.max(maxCount, count);\n    }\n\n    return maxCount;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findMaxConsecutiveOnes(vector<int>& nums) {\n    int maxCount = 0;\n    int count = 0;\n\n    for (int num : nums) {\n        if (num == 1) {\n            count++;\n        } else {\n            count = 0;\n        }\n        maxCount = max(maxCount, count);\n    }\n\n    return maxCount;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindMaxConsecutiveOnes(int[] nums) {\n    int maxCount = 0;\n    int count = 0;\n\n    foreach (int num in nums) {\n        if (num == 1) {\n            count++;\n        } else {\n            count = 0;\n        }\n        maxCount = Math.Max(maxCount, count);\n    }\n\n    return maxCount;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaxConsecutiveOnes(nums []int) int {\n    maxCount := 0\n    count := 0\n\n    for _, num := range nums {\n        if num == 1 {\n            count++\n        } else {\n            count = 0\n        }\n        if count > maxCount {\n            maxCount = count\n        }\n    }\n\n    return maxCount\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11,
        12
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findMaxConsecutiveOnes = function(nums) {\n    let maxCount = 0;\n    let count = 0;\n\n    for (const num of nums) {\n        if (num === 1) {\n            count++;\n        } else {\n            count = 0;\n        }\n        maxCount = Math.max(maxCount, count);\n    }\n\n    return maxCount;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaxConsecutiveOnes(nums: number[]): number {\n    let maxCount = 0;\n    let count = 0;\n\n    for (const num of nums) {\n        if (num === 1) {\n            count++;\n        } else {\n            count = 0;\n        }\n        maxCount = Math.max(maxCount, count);\n    }\n\n    return maxCount;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5
      ],
      "increment_count": [
        7
      ],
      "reset_count": [
        9
      ],
      "update_max": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "is_one": [
        6
      ]
    }
  }
};

const MaxConsecutiveOnesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        1,
        1,
        0,
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        0,
        1,
        1,
        0,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Zeros",
    "value": {
      "nums": [
        0,
        0,
        0,
        0
      ]
    }
  }
];

function generateMaxConsecutiveOnesSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=t.length,i=(e,a,i,o,r,l)=>{let s={};for(let u=0;u<n;u++){let n;u===r?n="blocked":u===a?n="active":i>=0&&u>=i&&u<=o?n="counted":u===e?n="anchor":l&&u>=l.start&&u<=l.end&&(n="best"),s[`elem_${u}`]={type:"arrayElement",value:t[u],position:u,...n&&{state:n}}}return s},o=new StepRecorder({nums:[...t]},{...i(-1,-1,-1,-1,-1),meta_count:{type:"metadata",value:0},meta_maxCount:{type:"metadata",value:0},meta_reads:{type:"metadata",value:0},meta_best:{type:"metadata",value:{start:-1,end:-1,isRecord:!1}}}),r=(e,t,n,a,r,l)=>{for(let[s,u]of Object.entries(i(e,t,n,a,r,l)))o.update_visual(s,u)};o.record("-","Start: try every index as the start of a run of ones");let l=0,s=0,u=-1,c=-1,d=()=>u>=0?{start:u,end:c}:void 0;o.add_new_variable("maxCount",l),o.record("initialize","Initialize maxCount = 0");for(let e=0;e<n;e++){let a=0;o.update_variable("i",e),o.update_variable("count",a),o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.delete_visual("j"),o.update_visual("meta_count",{type:"metadata",value:0}),r(e,-1,-1,-1,-1,d()),o.record("outer_loop",`Start a fresh run at i = ${e}`);for(let i=e;i<n;i++){let n=1===t[i];if(s++,o.update_variable("j",i),o.update_visual("j",{type:"pointer",position:i,label:"j"}),o.update_visual("meta_reads",{type:"metadata",value:s}),o.add_conditional("is_one",n),r(e,i,a>0?e:-1,a>0?e+a-1:-1,-1),o.record("inner_check",`Read nums[${i}] = ${t[i]}`),!n){r(e,-1,a>0?e:-1,a>0?e+a-1:-1,i),o.record("break_run",`nums[${i}] is 0, so the run from ${e} stops at length ${a}`);break}a++,o.update_variable("count",a),o.update_visual("meta_count",{type:"metadata",value:a}),r(e,i,e,e+a-1,-1),o.record("extend",`nums[${i}] is 1, so the run from ${e} is now ${a} long`)}let i=a>l;i&&(l=a,u=e,c=e+a-1),o.update_variable("maxCount",l),o.update_visual("meta_maxCount",{type:"metadata",value:l}),o.update_visual("meta_best",{type:"metadata",value:{start:u,end:c,isRecord:i}}),o.record("update_max",i?`New best: the run starting at ${e} is ${l} long`:`maxCount stays ${l}`)}return o.delete_visual("i"),o.delete_visual("j"),r(-1,-1,-1,-1,-1,d()),o.update_visual("meta_best",{type:"metadata",value:{start:u,end:c,isRecord:!1}}),o.record("complete",`Maximum consecutive ones = ${l}, after ${s} element read${1===s?"":"s"}`),o.getSteps()
}

export function MaxConsecutiveOnesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxConsecutiveOnesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxConsecutiveOnesSteps(e) as any[];
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
      title="Max Consecutive Ones"
      slug="max-consecutive-ones"
      approaches={approaches}
      presets={MaxConsecutiveOnesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Maximum Swap (maximum-swap)
// ==========================================

const MaximumSwapTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maximumSwap(self, num: int) -> int:\n        digits = list(str(num))\n\n        # Record the last position of each digit (0-9)\n        last_index = [0] * 10\n        for i, d in enumerate(digits):\n            last_index[int(d)] = i\n\n        # Scan left to right, find the first digit that can be improved\n        for i, d in enumerate(digits):\n            # Check for a larger digit that appears later\n            for larger in range(9, int(d), -1):\n                if last_index[larger] > i:\n                    # Swap current digit with the last occurrence of larger\n                    j = last_index[larger]\n                    digits[i], digits[j] = digits[j], digits[i]\n                    return int(''.join(digits))\n\n        # No swap improves the number\n        return num",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "init_last": [
        5,
        6
      ],
      "build_last_index": [
        7,
        8
      ],
      "scan_digit": [
        10,
        11
      ],
      "check_larger": [
        12,
        13,
        14
      ],
      "swap": [
        15,
        16,
        17
      ],
      "return_swap": [
        18
      ],
      "return_no_swap": [
        20,
        21
      ]
    },
    "conditionalMap": {
      "swap_found": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maximumSwap(int num) {\n        char[] digits = String.valueOf(num).toCharArray();\n\n        // Record the last position of each digit (0-9)\n        int[] lastIndex = new int[10];\n        for (int i = 0; i < digits.length; i++) {\n            lastIndex[digits[i] - '0'] = i;\n        }\n\n        // Scan left to right, find the first digit that can be improved\n        for (int i = 0; i < digits.length; i++) {\n            // Check for a larger digit that appears later\n            for (int d = 9; d > digits[i] - '0'; d--) {\n                if (lastIndex[d] > i) {\n                    // Swap current digit with the last occurrence of d\n                    char temp = digits[i];\n                    digits[i] = digits[lastIndex[d]];\n                    digits[lastIndex[d]] = temp;\n                    return Integer.parseInt(new String(digits));\n                }\n            }\n        }\n        // No swap improves the number\n        return num;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "init_last": [
        5,
        6
      ],
      "build_last_index": [
        7,
        8,
        9
      ],
      "scan_digit": [
        11,
        12
      ],
      "check_larger": [
        13,
        14,
        15
      ],
      "swap": [
        16,
        17,
        18,
        19
      ],
      "return_swap": [
        20
      ],
      "return_no_swap": [
        24,
        25
      ]
    },
    "conditionalMap": {
      "swap_found": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maximumSwap(int num) {\n        string digits = to_string(num);\n\n        // Record the last position of each digit (0-9)\n        int lastIndex[10] = {};\n        for (int i = 0; i < digits.size(); i++) {\n            lastIndex[digits[i] - '0'] = i;\n        }\n\n        // Scan left to right, find the first digit that can be improved\n        for (int i = 0; i < digits.size(); i++) {\n            // Check for a larger digit that appears later\n            for (int d = 9; d > digits[i] - '0'; d--) {\n                if (lastIndex[d] > i) {\n                    // Swap current digit with the last occurrence of d\n                    swap(digits[i], digits[lastIndex[d]]);\n                    return stoi(digits);\n                }\n            }\n        }\n        // No swap improves the number\n        return num;\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "init_last": [
        6,
        7
      ],
      "build_last_index": [
        8,
        9,
        10
      ],
      "scan_digit": [
        12,
        13
      ],
      "check_larger": [
        14,
        15,
        16
      ],
      "swap": [
        17,
        18
      ],
      "return_swap": [
        19
      ],
      "return_no_swap": [
        23,
        24
      ]
    },
    "conditionalMap": {
      "swap_found": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaximumSwap(int num) {\n        char[] digits = num.ToString().ToCharArray();\n\n        // Record the last position of each digit (0-9)\n        int[] lastIndex = new int[10];\n        for (int i = 0; i < digits.Length; i++) {\n            lastIndex[digits[i] - '0'] = i;\n        }\n\n        // Scan left to right, find the first digit that can be improved\n        for (int i = 0; i < digits.Length; i++) {\n            // Check for a larger digit that appears later\n            for (int d = 9; d > digits[i] - '0'; d--) {\n                if (lastIndex[d] > i) {\n                    // Swap current digit with the last occurrence of d\n                    char temp = digits[i];\n                    digits[i] = digits[lastIndex[d]];\n                    digits[lastIndex[d]] = temp;\n                    return int.Parse(new string(digits));\n                }\n            }\n        }\n        // No swap improves the number\n        return num;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "init_last": [
        5,
        6
      ],
      "build_last_index": [
        7,
        8,
        9
      ],
      "scan_digit": [
        11,
        12
      ],
      "check_larger": [
        13,
        14,
        15
      ],
      "swap": [
        16,
        17,
        18,
        19
      ],
      "return_swap": [
        20
      ],
      "return_no_swap": [
        24,
        25
      ]
    },
    "conditionalMap": {
      "swap_found": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumSwap(num int) int {\n    digits := []byte(strconv.Itoa(num))\n\n    // Record the last position of each digit (0-9)\n    lastIndex := [10]int{}\n    for i, d := range digits {\n        lastIndex[d-'0'] = i\n    }\n\n    // Scan left to right, find the first digit that can be improved\n    for i, d := range digits {\n        // Check for a larger digit that appears later\n        for larger := 9; larger > int(d-'0'); larger-- {\n            if lastIndex[larger] > i {\n                // Swap current digit with the last occurrence of larger\n                j := lastIndex[larger]\n                digits[i], digits[j] = digits[j], digits[i]\n                result, _ := strconv.Atoi(string(digits))\n                return result\n            }\n        }\n    }\n    // No swap improves the number\n    return num\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init_last": [
        4,
        5
      ],
      "build_last_index": [
        6,
        7,
        8
      ],
      "scan_digit": [
        10,
        11
      ],
      "check_larger": [
        12,
        13,
        14
      ],
      "swap": [
        15,
        16,
        17
      ],
      "return_swap": [
        18,
        19
      ],
      "return_no_swap": [
        23,
        24
      ]
    },
    "conditionalMap": {
      "swap_found": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maximumSwap = function (num) {\n  let digits = num.toString().split(\"\");\n\n  // Record the last position of each digit (0-9)\n  let lastIndex = new Array(10).fill(0);\n  for (let i = 0; i < digits.length; i++) {\n    lastIndex[parseInt(digits[i])] = i;\n  }\n\n  // Scan left to right, find the first digit that can be improved\n  for (let i = 0; i < digits.length; i++) {\n    // Check for a larger digit that appears later\n    for (let d = 9; d > parseInt(digits[i]); d--) {\n      if (lastIndex[d] > i) {\n        // Swap current digit with the last occurrence of d\n        let j = lastIndex[d];\n        [digits[i], digits[j]] = [digits[j], digits[i]];\n        return parseInt(digits.join(\"\"));\n      }\n    }\n  }\n  // No swap improves the number\n  return num;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init_last": [
        4,
        5
      ],
      "build_last_index": [
        6,
        7,
        8
      ],
      "scan_digit": [
        10,
        11
      ],
      "check_larger": [
        12,
        13,
        14
      ],
      "swap": [
        15,
        16,
        17
      ],
      "return_swap": [
        18
      ],
      "return_no_swap": [
        22,
        23
      ]
    },
    "conditionalMap": {
      "swap_found": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumSwap(num: number): number {\n    let digits: string[] = num.toString().split(\"\");\n\n    // Record the last position of each digit (0-9)\n    let lastIndex: number[] = new Array(10).fill(0);\n    for (let i = 0; i < digits.length; i++) {\n        lastIndex[parseInt(digits[i])] = i;\n    }\n\n    // Scan left to right, find the first digit that can be improved\n    for (let i = 0; i < digits.length; i++) {\n        // Check for a larger digit that appears later\n        for (let d = 9; d > parseInt(digits[i]); d--) {\n            if (lastIndex[d] > i) {\n                // Swap current digit with the last occurrence of d\n                let j: number = lastIndex[d];\n                [digits[i], digits[j]] = [digits[j], digits[i]];\n                return parseInt(digits.join(\"\"));\n            }\n        }\n    }\n    // No swap improves the number\n    return num;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init_last": [
        4,
        5
      ],
      "build_last_index": [
        6,
        7,
        8
      ],
      "scan_digit": [
        10,
        11
      ],
      "check_larger": [
        12,
        13,
        14
      ],
      "swap": [
        15,
        16,
        17
      ],
      "return_swap": [
        18
      ],
      "return_no_swap": [
        22,
        23
      ]
    },
    "conditionalMap": {
      "swap_found": [
        14
      ]
    }
  }
};

const MaximumSwapPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Swap 2 and 7",
    "value": {
      "num": 2736
    }
  },
  {
    "id": "ex2",
    "label": "No swap needed",
    "value": {
      "num": 9973
    }
  },
  {
    "id": "ex3",
    "label": "Swap 1 and 9",
    "value": {
      "num": 1993
    }
  },
  {
    "id": "ex4",
    "label": "Swap 3 and 8",
    "value": {
      "num": 98368
    }
  }
];

function generateMaximumSwapSteps(i: any): any[] {
  let t=i.num,e=String(t).split("").map(Number),n=e.length,r={};for(let i=0;i<n;i++)r[`digit_${i}`]={type:"arrayElement",value:e[i],position:i};let s=e.map((i,t)=>t),d=new StepRecorder({numStr:String(t)},r),l=(i,t)=>{let a=s[i],n=s[t];d.update_visual(`digit_${a}`,{type:"arrayElement",value:e[i],position:t}),d.update_visual(`digit_${n}`,{type:"arrayElement",value:e[t],position:i}),[s[i],s[t]]=[s[t],s[i]],[e[i],e[t]]=[e[t],e[i]]};d.update_variable("mode","brute"),d.record("-",`Start: Swap at most two digits of ${t} to maximize it`);let o=t,u=-1,p=-1;d.update_variable("maxNum",o),d.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),n>1&&d.add_new_visual("ptr_j",{type:"pointer",position:1,label:"j"}),d.record("init",`digits = ${String(t).split("").join(", ")}, maxNum = ${t}`);for(let i=0;i<n;i++)for(let t=i+1;t<n;t++){let a=e[i],n=e[t];l(i,t),d.update_visual("ptr_i",{type:"pointer",position:i,label:"i"}),d.update_visual("ptr_j",{type:"pointer",position:t,label:"j"}),d.update_variable("i",i),d.update_variable("j",t),d.update_variable("di",a),d.update_variable("dj",n),d.update_variable("numStr",e.join("")),d.delete_variable("candidate"),d.record("swap_pair",`Swap digits[${i}] = ${a} with digits[${t}] = ${n}`);let r=parseInt(e.join(""),10),s=r>o;s&&(o=r,u=i,p=t),d.update_variable("candidate",r),d.update_variable("maxNum",o),d.record("evaluate",s?`candidate = ${r} beats the old best, so maxNum = ${r}`:`candidate = ${r} does not beat maxNum = ${o}`),l(i,t),d.update_variable("numStr",e.join("")),d.record("restore",`Swap back so the next pair starts from ${e.join("")}`)}return u>=0&&l(u,p),d.delete_visual("ptr_i"),n>1&&d.delete_visual("ptr_j"),d.delete_variable("i"),d.delete_variable("j"),d.delete_variable("di"),d.delete_variable("dj"),d.delete_variable("candidate"),d.update_variable("numStr",e.join("")),d.update_variable("swapI",u),d.update_variable("swapJ",p),d.add_new_variable("result",o),d.record("complete",u>=0?`Every pair tried. The best swap gives ${o}`:`Every pair tried. No swap improves ${t}`),d.getSteps()
}

export function MaximumSwapProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumSwapTemplates,
      generateSteps: (i: any) => {
        const recorded = generateMaximumSwapSteps(i) as any[];
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
      title="Maximum Swap"
      slug="maximum-swap"
      approaches={approaches}
      presets={MaximumSwapPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Missing Number (missing-number)
// ==========================================

const MissingNumberTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def missingNumber(self, nums: list[int]) -> int:\n        n = len(nums)\n        xor = 0\n\n        # XOR all indices [1, n] and all array elements\n        for i in range(n):\n            xor ^= (i + 1) ^ nums[i]\n\n        return xor",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "xor_step": [
        7,
        8
      ],
      "complete": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int missingNumber(int[] nums) {\n        int n = nums.length;\n        int xor = 0;\n\n        // XOR all indices [1, n] and all array elements\n        for (int i = 0; i < n; i++) {\n            xor ^= (i + 1) ^ nums[i];\n        }\n\n        return xor;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "xor_step": [
        7,
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        int n = nums.size();\n        int xorVal = 0;\n\n        // XOR all indices [1, n] and all array elements\n        for (int i = 0; i < n; i++) {\n            xorVal ^= (i + 1) ^ nums[i];\n        }\n\n        return xorVal;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5
      ],
      "xor_step": [
        8,
        9
      ],
      "complete": [
        12
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MissingNumber(int[] nums) {\n        int n = nums.Length;\n        int xor = 0;\n\n        // XOR all indices [1, n] and all array elements\n        for (int i = 0; i < n; i++) {\n            xor ^= (i + 1) ^ nums[i];\n        }\n\n        return xor;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4
      ],
      "xor_step": [
        7,
        8
      ],
      "complete": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func missingNumber(nums []int) int {\n    n := len(nums)\n    xor := 0\n\n    // XOR all indices [1, n] and all array elements\n    for i := 0; i < n; i++ {\n        xor ^= (i + 1) ^ nums[i]\n    }\n\n    return xor\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "xor_step": [
        6,
        7
      ],
      "complete": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var missingNumber = function(nums) {\n    var n = nums.length;\n    var xor = 0;\n\n    // XOR all indices [1, n] and all array elements\n    for (var i = 0; i < n; i++) {\n        xor ^= (i + 1) ^ nums[i];\n    }\n\n    return xor;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "xor_step": [
        6,
        7
      ],
      "complete": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function missingNumber(nums: number[]): number {\n    const n = nums.length;\n    let xor = 0;\n\n    // XOR all indices [1, n] and all array elements\n    for (let i = 0; i < n; i++) {\n        xor ^= (i + 1) ^ nums[i];\n    }\n\n    return xor;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "xor_step": [
        6,
        7
      ],
      "complete": [
        10
      ]
    }
  }
};

const MissingNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        3,
        0,
        1
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
        9,
        6,
        4,
        2,
        3,
        5,
        7,
        0,
        1
      ]
    }
  }
];

function generateMissingNumberSteps(e: any): any[] {
  let t=[...e.nums],n=t.length,l={};for(let e=0;e<n;e++)l[`elem_${e}`]={type:"arrayElement",value:t[e],position:e};for(let e=0;e<=n;e++)l[`chip_${e}`]={type:"arrayElement",value:e,position:e};let r=new StepRecorder({},{...l});r.record("-",`nums holds ${n} distinct numbers from 0..${n}, so exactly one is missing. XOR indices and values: everything pairs up except the missing number`);let a=0;r.add_new_variable("xor",a),r.add_new_visual("ptr_i",{type:"pointer",position:0,label:"i"}),r.record("init",`Initialize xor = 0. The expected values are 0..${n}`);for(let e=0;e<n;e++){let i=a,l=e+1,s=t[e];r.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),r.add_new_variable("i",e),r.add_new_variable("indexVal",l),r.add_new_variable("numVal",s),r.add_new_variable("prevXor",i),a^=l^s,r.update_variable("xor",a),s>=0&&s<=n&&r.update_visual(`chip_${s}`,{type:"arrayElement",value:s,position:s,state:"cancelled"}),r.update_visual(`elem_${e}`,{type:"arrayElement",value:s,position:e,state:"done"}),r.record("xor_step",`xor = ${i} ^ ${l} ^ ${s} = ${a}. ${s} is present, check it off`),r.delete_variable("indexVal"),r.delete_variable("numVal"),r.delete_variable("prevXor")}return r.delete_visual("ptr_i"),r.delete_variable("i"),a>=0&&a<=n&&r.update_visual(`chip_${a}`,{type:"arrayElement",value:a,position:a,state:"answer"}),r.record("complete",`The only value never checked off is ${a}. Missing number = ${a}`),r.getSteps()
}

export function MissingNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MissingNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMissingNumberSteps(e) as any[];
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
      title="Missing Number"
      slug="missing-number"
      approaches={approaches}
      presets={MissingNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Missing Ranges (missing-ranges)
// ==========================================

const MissingRangesTemplates = {
  "python": {
    "language": "python",
    "code": "def findMissingRanges(nums: List[int], lower: int, upper: int) -> List[List[int]]:\n    result = []\n    prev = lower - 1\n\n    for i in range(len(nums) + 1):\n        # Use upper + 1 as the virtual element after the array\n        curr = nums[i] if i < len(nums) else upper + 1\n\n        if curr - prev > 1:\n            result.append([prev + 1, curr - 1])\n        prev = curr\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        11
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> findMissingRanges(int[] nums, int lower, int upper) {\n    List<List<Integer>> result = new ArrayList<>();\n    int prev = lower - 1;\n\n    for (int i = 0; i <= nums.length; i++) {\n        // Use upper + 1 as the virtual element after the array\n        int curr = (i < nums.length) ? nums[i] : upper + 1;\n\n        if (curr - prev > 1) {\n            result.add(Arrays.asList(prev + 1, curr - 1));\n        }\n        prev = curr;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        12
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> findMissingRanges(vector<int>& nums, int lower, int upper) {\n    vector<vector<int>> result;\n    int prev = lower - 1;\n\n    for (int i = 0; i <= (int)nums.size(); i++) {\n        // Use upper + 1 as the virtual element after the array\n        int curr = (i < (int)nums.size()) ? nums[i] : upper + 1;\n\n        if (curr - prev > 1) {\n            result.push_back({prev + 1, curr - 1});\n        }\n        prev = curr;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        12
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> FindMissingRanges(int[] nums, int lower, int upper) {\n    IList<IList<int>> result = new List<IList<int>>();\n    int prev = lower - 1;\n\n    for (int i = 0; i <= nums.Length; i++) {\n        // Use upper + 1 as the virtual element after the array\n        int curr = (i < nums.Length) ? nums[i] : upper + 1;\n\n        if (curr - prev > 1) {\n            result.Add(new List<int> { prev + 1, curr - 1 });\n        }\n        prev = curr;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        12
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMissingRanges(nums []int, lower int, upper int) [][]int {\n    result := [][]int{}\n    prev := lower - 1\n\n    for i := 0; i <= len(nums); i++ {\n        // Use upper + 1 as the virtual element after the array\n        curr := upper + 1\n        if i < len(nums) {\n            curr = nums[i]\n        }\n\n        if curr-prev > 1 {\n            result = append(result, []int{prev + 1, curr - 1})\n        }\n        prev = curr\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7,
        8,
        9
      ],
      "found_gap": [
        13
      ],
      "update_prev": [
        15
      ],
      "check_upper": [
        5,
        7,
        8,
        9
      ],
      "found_final_gap": [
        13
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "has_gap": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findMissingRanges = function(nums, lower, upper) {\n    const result = [];\n    let prev = lower - 1;\n\n    for (let i = 0; i <= nums.length; i++) {\n        // Use upper + 1 as the virtual element after the array\n        const curr = (i < nums.length) ? nums[i] : upper + 1;\n\n        if (curr - prev > 1) {\n            result.push([prev + 1, curr - 1]);\n        }\n        prev = curr;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        12
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMissingRanges(nums: number[], lower: number, upper: number): number[][] {\n    const result: number[][] = [];\n    let prev = lower - 1;\n\n    for (let i = 0; i <= nums.length; i++) {\n        // Use upper + 1 as the virtual element after the array\n        const curr = (i < nums.length) ? nums[i] : upper + 1;\n\n        if (curr - prev > 1) {\n            result.push([prev + 1, curr - 1]);\n        }\n        prev = curr;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "check_element": [
        5,
        7
      ],
      "found_gap": [
        10
      ],
      "update_prev": [
        12
      ],
      "check_upper": [
        5,
        7
      ],
      "found_final_gap": [
        10
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "has_gap": [
        9
      ]
    }
  }
};

const MissingRangesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        0,
        1,
        3,
        50,
        75
      ],
      "lower": 0,
      "upper": 99
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        3,
        5
      ],
      "lower": 0,
      "upper": 7
    }
  },
  {
    "id": "ex3",
    "label": "Empty Array",
    "value": {
      "nums": [],
      "lower": 1,
      "upper": 5
    }
  }
];

function generateMissingRangesSteps(e: any): any[] {
  const r = (e, t) => (e === t ? `${e}` : `${e}->${t}`);
let t=[...e.nums],n=e.lower,i=e.upper,l=[],s=[],u={};t.forEach((e,t)=>{u[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let o=new StepRecorder({nums:t,lower:n,upper:i},u),p=e=>{o.update_visual("meta_prev",{type:"metadata",value:e}),o.update_visual("meta_result",{type:"metadata",value:l.length>0?`[${l.join(", ")}]`:"[]"})};o.update_visual("meta_prev",{type:"metadata",value:""}),o.update_visual("meta_result",{type:"metadata",value:"[]"}),o.update_visual("meta_curr",{type:"metadata",value:null}),o.update_visual("meta_gaps",{type:"metadata",value:[]}),o.update_visual("meta_flash",{type:"metadata",value:null}),o.record("-","Start of algorithm");let d=n-1;o.add_new_variable("prev",d),o.add_new_variable("result",[]),p(d),o.record("initialize",`Initialize prev = lower - 1 = ${d}`);for(let e=0;e<t.length;e++){let n=t[e],a=n-d>1;if(o.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"active"}),e>0?o.update_visual("i",{type:"pointer",position:e,label:"i"}):o.add_new_visual("i",{type:"pointer",position:e,label:"i"}),o.add_new_variable("curr",n),o.update_visual("meta_curr",{type:"metadata",value:n}),o.update_visual("meta_flash",{type:"metadata",value:null}),o.add_conditional("has_gap",a),o.record("check_element",`Check nums[${e}] = ${n}, curr - prev = ${n} - ${d} = ${n-d}${a?" > 1, gap found!":" <= 1, no gap"}`),a){let e=r(d+1,n-1);l.push(e),s.push({lo:d+1,hi:n-1}),o.update_variable("result",[...l]),p(d),o.update_visual("meta_result",{type:"metadata",value:`[${l.join(", ")}]`}),o.update_visual("meta_gaps",{type:"metadata",value:[...s]}),o.update_visual("meta_flash",{type:"metadata",value:"gap"}),o.record("found_gap",`Gap found: add range [${d+1}, ${n-1}] -> "${e}"`)}d=n,o.update_variable("prev",d),p(d),o.update_visual("meta_flash",{type:"metadata",value:null}),o.update_visual(`elem_${e}`,{type:"arrayElement",value:n,position:e,state:"checked"}),o.record("update_prev",`Update prev = ${n}`)}let c=i+1,m=c-d>1;if(t.length>0&&o.delete_visual("i"),o.add_new_variable("curr",c),o.update_visual("meta_curr",{type:"metadata",value:c}),o.update_visual("meta_flash",{type:"metadata",value:null}),o.add_conditional("has_gap",m),o.record("check_upper",`Final check: curr = upper + 1 = ${c}, curr - prev = ${c} - ${d} = ${c-d}${m?" > 1, gap found!":" <= 1, no gap"}`),m){let e=r(d+1,i);l.push(e),s.push({lo:d+1,hi:i}),o.update_variable("result",[...l]),o.update_visual("meta_result",{type:"metadata",value:`[${l.join(", ")}]`}),o.update_visual("meta_gaps",{type:"metadata",value:[...s]}),o.update_visual("meta_flash",{type:"metadata",value:"gap"}),o.record("found_final_gap",`Final gap found: add range [${d+1}, ${i}] -> "${e}"`)}return o.delete_variable("curr"),o.delete_variable("prev"),o.update_visual("meta_result",{type:"metadata",value:`[${l.join(", ")}]`}),o.update_visual("meta_curr",{type:"metadata",value:null}),o.update_visual("meta_flash",{type:"metadata",value:"result"}),o.record("complete",`Done. Missing ranges: [${l.join(", ")}]`),o.getSteps()
}

export function MissingRangesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MissingRangesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMissingRangesSteps(e) as any[];
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
      title="Missing Ranges"
      slug="missing-ranges"
      approaches={approaches}
      presets={MissingRangesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Remove Element (remove-element)
// ==========================================

const RemoveElementTemplates = {
  "python": {
    "language": "python",
    "code": "def removeElement(nums: List[int], val: int) -> int:\n    i = 0\n    n = len(nums)\n    while i < n:\n        if nums[i] == val:\n            # Replace with last element and shrink array\n            nums[i] = nums[n - 1]\n            n -= 1\n        else:\n            i += 1\n    return n",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int removeElement(int[] nums, int val) {\n    int i = 0;\n    int n = nums.length;\n    while (i < n) {\n        if (nums[i] == val) {\n            // Replace with last element and shrink array\n            nums[i] = nums[n - 1];\n            n--;\n        } else {\n            i++;\n        }\n    }\n    return n;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int removeElement(vector<int>& nums, int val) {\n    int i = 0;\n    int n = nums.size();\n    while (i < n) {\n        if (nums[i] == val) {\n            // Replace with last element and shrink array\n            nums[i] = nums[n - 1];\n            n--;\n        } else {\n            i++;\n        }\n    }\n    return n;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int RemoveElement(int[] nums, int val) {\n    int i = 0;\n    int n = nums.Length;\n    while (i < n) {\n        if (nums[i] == val) {\n            // Replace with last element and shrink array\n            nums[i] = nums[n - 1];\n            n--;\n        } else {\n            i++;\n        }\n    }\n    return n;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func removeElement(nums []int, val int) int {\n    i := 0\n    n := len(nums)\n    for i < n {\n        if nums[i] == val {\n            // Replace with last element and shrink array\n            nums[i] = nums[n-1]\n            n--\n        } else {\n            i++\n        }\n    }\n    return n\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var removeElement = function(nums, val) {\n    var i = 0;\n    var n = nums.length;\n    while (i < n) {\n        if (nums[i] === val) {\n            // Replace with last element and shrink array\n            nums[i] = nums[n - 1];\n            n--;\n        } else {\n            i++;\n        }\n    }\n    return n;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function removeElement(nums: number[], val: number): number {\n    let i = 0;\n    let n = nums.length;\n    while (i < n) {\n        if (nums[i] === val) {\n            // Replace with last element and shrink array\n            nums[i] = nums[n - 1];\n            n--;\n        } else {\n            i++;\n        }\n    }\n    return n;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "swap_and_shrink": [
        7,
        8
      ],
      "increment_i": [
        10
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "equals_val": [
        5
      ]
    }
  }
};

const RemoveElementPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        0,
        1,
        2,
        2,
        3,
        0,
        4,
        2
      ],
      "val": 2
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        3,
        2,
        2,
        3
      ],
      "val": 3
    }
  },
  {
    "id": "ex3",
    "label": "Single Element",
    "value": {
      "nums": [
        1
      ],
      "val": 1
    }
  }
];

function generateRemoveElementSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],n=Number(e?.val??NaN),a=t.length,l=(e,n,i)=>{let l={};for(let r=0;r<a;r++){let a;i?a=r<e?"placed":"inactive":r===n?a="active":r<e?a="placed":n>=0&&r<n&&(a="skipped"),l[`elem_${r}`]={type:"arrayElement",value:t[r],position:r,...a&&{state:a}}}return l},r=(e,t,n,i)=>{for(let[a,r]of Object.entries(l(t,n,i)))e.update_visual(a,r)},s=new StepRecorder({nums:[...t],val:n},{...l(0,-1,!1)});s.record("-",`Start: drop every ${n} by overwriting from the front`);let o=0;s.add_new_variable("k",o),a>0&&s.update_visual("k",{type:"pointer",position:o,label:"k"}),s.record("initialize","Initialize k to 0, the next slot to write");for(let e=0;e<a;e++){let i=t[e]===n;s.update_variable("i",e),s.update_visual("i",{type:"pointer",position:e,label:"i"}),s.add_conditional("not_val",!i),r(s,o,e,!1),s.record("check_element",`Check nums[${e}] = ${t[e]}`),i||(t[o]=t[e],o++,s.update_variable("nums",[...t]),s.update_variable("k",o),s.update_visual("k",{type:"pointer",position:Math.min(o,Math.max(a-1,0)),label:"k"}),r(s,o,e,!1),s.record("write_element",`Keep it: write to nums[${o-1}], k is now ${o}`))}return s.delete_visual("i"),s.delete_visual("k"),s.add_new_variable("result",o),r(s,o,-1,!0),s.record("complete",`Return k = ${o}. The first ${o} values are the answer.`),s.getSteps()
}

export function RemoveElementProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RemoveElementTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRemoveElementSteps(e) as any[];
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
      title="Remove Element"
      slug="remove-element"
      approaches={approaches}
      presets={RemoveElementPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Set Mismatch (set-mismatch)
// ==========================================

const SetMismatchTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def findErrorNums(self, nums: list[int]) -> list[int]:\n        n = len(nums)\n        duplicate = -1\n        missing = -1\n\n        # Mark visited indices by negating values\n        for i in range(n):\n            target_idx = abs(nums[i]) - 1\n            if nums[target_idx] < 0:\n                # Already visited, this is the duplicate\n                duplicate = abs(nums[i])\n            else:\n                nums[target_idx] = -nums[target_idx]\n\n        # The index with a positive value is the missing number\n        for i in range(n):\n            if nums[i] > 0:\n                missing = i + 1\n\n        return [duplicate, missing]",
    "lineMap": {
      "-": [
        2
      ],
      "compute_target": [
        8,
        9
      ],
      "found_duplicate": [
        12
      ],
      "negate": [
        14
      ],
      "scan_start": [
        17
      ],
      "check_positive": [
        17,
        18
      ],
      "found_missing": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_negative": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] findErrorNums(int[] nums) {\n        int n = nums.length;\n        int duplicate = -1, missing = -1;\n\n        // Mark visited indices by negating values\n        for (int i = 0; i < n; i++) {\n            int targetIdx = Math.abs(nums[i]) - 1;\n            if (nums[targetIdx] < 0) {\n                // Already visited, this is the duplicate\n                duplicate = Math.abs(nums[i]);\n            } else {\n                nums[targetIdx] = -nums[targetIdx];\n            }\n        }\n\n        // The index with a positive value is the missing number\n        for (int i = 0; i < n; i++) {\n            if (nums[i] > 0) {\n                missing = i + 1;\n            }\n        }\n\n        return new int[]{duplicate, missing};\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compute_target": [
        7,
        8
      ],
      "found_duplicate": [
        11
      ],
      "negate": [
        13
      ],
      "scan_start": [
        18
      ],
      "check_positive": [
        18,
        19
      ],
      "found_missing": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_negative": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> findErrorNums(vector<int>& nums) {\n        int n = nums.size();\n        int duplicate = -1, missing = -1;\n\n        // Mark visited indices by negating values\n        for (int i = 0; i < n; i++) {\n            int targetIdx = abs(nums[i]) - 1;\n            if (nums[targetIdx] < 0) {\n                // Already visited, this is the duplicate\n                duplicate = abs(nums[i]);\n            } else {\n                nums[targetIdx] = -nums[targetIdx];\n            }\n        }\n\n        // The index with a positive value is the missing number\n        for (int i = 0; i < n; i++) {\n            if (nums[i] > 0) {\n                missing = i + 1;\n            }\n        }\n\n        return {duplicate, missing};\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "compute_target": [
        8,
        9
      ],
      "found_duplicate": [
        12
      ],
      "negate": [
        14
      ],
      "scan_start": [
        19
      ],
      "check_positive": [
        19,
        20
      ],
      "found_missing": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "is_negative": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] FindErrorNums(int[] nums) {\n        int n = nums.Length;\n        int duplicate = -1, missing = -1;\n\n        // Mark visited indices by negating values\n        for (int i = 0; i < n; i++) {\n            int targetIdx = Math.Abs(nums[i]) - 1;\n            if (nums[targetIdx] < 0) {\n                // Already visited, this is the duplicate\n                duplicate = Math.Abs(nums[i]);\n            } else {\n                nums[targetIdx] = -nums[targetIdx];\n            }\n        }\n\n        // The index with a positive value is the missing number\n        for (int i = 0; i < n; i++) {\n            if (nums[i] > 0) {\n                missing = i + 1;\n            }\n        }\n\n        return new int[]{duplicate, missing};\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "compute_target": [
        7,
        8
      ],
      "found_duplicate": [
        11
      ],
      "negate": [
        13
      ],
      "scan_start": [
        18
      ],
      "check_positive": [
        18,
        19
      ],
      "found_missing": [
        20
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "is_negative": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findErrorNums(nums []int) []int {\n    n := len(nums)\n    duplicate, missing := -1, -1\n\n    // Mark visited indices by negating values\n    for i := 0; i < n; i++ {\n        targetIdx := nums[i]\n        if targetIdx < 0 {\n            targetIdx = -targetIdx\n        }\n        targetIdx-- // Convert to 0-indexed\n\n        if nums[targetIdx] < 0 {\n            // Already visited, this is the duplicate\n            val := nums[i]\n            if val < 0 {\n                val = -val\n            }\n            duplicate = val\n        } else {\n            nums[targetIdx] = -nums[targetIdx]\n        }\n    }\n\n    // The index with a positive value is the missing number\n    for i := 0; i < n; i++ {\n        if nums[i] > 0 {\n            missing = i + 1\n        }\n    }\n\n    return []int{duplicate, missing}\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_target": [
        6,
        7,
        8,
        9,
        10,
        11
      ],
      "found_duplicate": [
        15,
        16,
        17,
        18,
        19
      ],
      "negate": [
        21
      ],
      "scan_start": [
        26
      ],
      "check_positive": [
        26,
        27
      ],
      "found_missing": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "is_negative": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var findErrorNums = function(nums) {\n    var n = nums.length;\n    var duplicate = -1, missing = -1;\n\n    // Mark visited indices by negating values\n    for (var i = 0; i < n; i++) {\n        var targetIdx = Math.abs(nums[i]) - 1;\n        if (nums[targetIdx] < 0) {\n            // Already visited, this is the duplicate\n            duplicate = Math.abs(nums[i]);\n        } else {\n            nums[targetIdx] = -nums[targetIdx];\n        }\n    }\n\n    // The index with a positive value is the missing number\n    for (var i = 0; i < n; i++) {\n        if (nums[i] > 0) {\n            missing = i + 1;\n        }\n    }\n\n    return [duplicate, missing];\n};",
    "lineMap": {
      "-": [
        1
      ],
      "compute_target": [
        6,
        7
      ],
      "found_duplicate": [
        10
      ],
      "negate": [
        12
      ],
      "scan_start": [
        17
      ],
      "check_positive": [
        17,
        18
      ],
      "found_missing": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_negative": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findErrorNums(nums: number[]): number[] {\n    const n = nums.length;\n    let duplicate = -1, missing = -1;\n\n    // Mark visited indices by negating values\n    for (let i = 0; i < n; i++) {\n        const targetIdx = Math.abs(nums[i]) - 1;\n        if (nums[targetIdx] < 0) {\n            // Already visited, this is the duplicate\n            duplicate = Math.abs(nums[i]);\n        } else {\n            nums[targetIdx] = -nums[targetIdx];\n        }\n    }\n\n    // The index with a positive value is the missing number\n    for (let i = 0; i < n; i++) {\n        if (nums[i] > 0) {\n            missing = i + 1;\n        }\n    }\n\n    return [duplicate, missing];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_target": [
        6,
        7
      ],
      "found_duplicate": [
        10
      ],
      "negate": [
        12
      ],
      "scan_start": [
        17
      ],
      "check_positive": [
        17,
        18
      ],
      "found_missing": [
        19
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_negative": [
        8
      ]
    }
  }
};

const SetMismatchPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        2,
        2,
        4
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
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
        3,
        2,
        3,
        4,
        6,
        5
      ]
    }
  }
];

function generateSetMismatchSteps(e: any): any[] {
  let t=[...e.nums],i=t.length,s={};for(let e=0;e<i;e++)s[`elem_${e}`]={type:"arrayElement",value:t[e],position:e};let a=new StepRecorder({},s);a.record("-",`nums holds 1..${i} with one number duplicated and one missing. Pass 1 marks value v as seen by negating nums[v-1]`);let r=-1,l=-1,u=-1;a.add_new_variable("duplicate",r),a.add_new_variable("missing",l);for(let e=0;e<i;e++){let i=Math.abs(t[e]),n=i-1;a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),a.update_visual("ptr_target",{type:"pointer",position:n,label:"target"}),a.add_new_variable("i",e),a.add_new_variable("targetIdx",n),a.record("compute_target",`nums[${e}] holds ${t[e]}, so mark value ${i}: target = |${t[e]}| - 1 = ${n}`),a.add_conditional("is_negative",t[n]<0),t[n]<0?(r=i,u=e,a.update_variable("duplicate",r),a.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"duplicate"}),a.record("found_duplicate",`nums[${n}] is already negative, so ${r} was seen before. duplicate = ${r}`)):(t[n]=-t[n],a.update_visual(`elem_${n}`,{type:"arrayElement",value:t[n],position:n,state:n===u?"duplicate":"marked"}),a.record("negate",`Negate nums[${n}]: ${-t[n]} becomes ${t[n]}. Value ${i} is now marked as seen`))}a.delete_visual("ptr_target"),a.delete_variable("targetIdx"),a.update_visual("ptr_i",{type:"pointer",position:0,label:"i"}),a.update_variable("i",0),a.record("scan_start","Pass 2: scan for a positive value. Its index was never marked, so that number is missing");for(let e=0;e<i;e++)a.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),a.update_variable("i",e),a.record("check_positive",t[e]>0?`nums[${e}] = ${t[e]} is positive, so value ${e+1} was never seen`:`nums[${e}] = ${t[e]} is negative, so value ${e+1} is present`),t[e]>0&&(l=e+1,a.update_variable("missing",l),a.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"missing"}),a.record("found_missing",`nums[${e}] > 0, so missing = ${e} + 1 = ${l}`));return a.delete_visual("ptr_i"),a.delete_variable("i"),a.record("complete",`duplicate = ${r}, missing = ${l}`),a.getSteps()
}

export function SetMismatchProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SetMismatchTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSetMismatchSteps(e) as any[];
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
      title="Set Mismatch"
      slug="set-mismatch"
      approaches={approaches}
      presets={SetMismatchPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Shuffle the Array (shuffle-the-array)
// ==========================================

const ShuffleTheArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def shuffle(nums: List[int], n: int) -> List[int]:\n    result = [0] * (2 * n)\n\n    for i in range(n):\n        # Place element from first half\n        result[2 * i] = nums[i]\n        # Place element from second half\n        result[2 * i + 1] = nums[n + i]\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "public int[] shuffle(int[] nums, int n) {\n    int[] result = new int[2 * n];\n\n    for (int i = 0; i < n; i++) {\n        // Place element from first half\n        result[2 * i] = nums[i];\n        // Place element from second half\n        result[2 * i + 1] = nums[n + i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> shuffle(vector<int>& nums, int n) {\n    vector<int> result(2 * n);\n\n    for (int i = 0; i < n; i++) {\n        // Place element from first half\n        result[2 * i] = nums[i];\n        // Place element from second half\n        result[2 * i + 1] = nums[n + i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] Shuffle(int[] nums, int n) {\n    int[] result = new int[2 * n];\n\n    for (int i = 0; i < n; i++) {\n        // Place element from first half\n        result[2 * i] = nums[i];\n        // Place element from second half\n        result[2 * i + 1] = nums[n + i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "func shuffle(nums []int, n int) []int {\n    result := make([]int, 2*n)\n\n    for i := 0; i < n; i++ {\n        // Place element from first half\n        result[2*i] = nums[i]\n        // Place element from second half\n        result[2*i+1] = nums[n+i]\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var shuffle = function(nums, n) {\n    var result = new Array(2 * n);\n\n    for (var i = 0; i < n; i++) {\n        // Place element from first half\n        result[2 * i] = nums[i];\n        // Place element from second half\n        result[2 * i + 1] = nums[n + i];\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "function shuffle(nums: number[], n: number): number[] {\n    const result = new Array(2 * n);\n\n    for (let i = 0; i < n; i++) {\n        // Place element from first half\n        result[2 * i] = nums[i];\n        // Place element from second half\n        result[2 * i + 1] = nums[n + i];\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "pick_first_half": [
        4
      ],
      "place_first": [
        6
      ],
      "pick_second_half": [
        4
      ],
      "place_second": [
        8
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {}
  }
};

const ShuffleTheArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        2,
        5,
        1,
        3,
        4,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        1,
        1,
        2,
        2
      ]
    }
  }
];

function generateShuffleTheArraySteps(e: any): any[] {
  let t=[...e.nums],n=t.length/2,r=Array(2*n).fill(null),l=e=>{let i={};for(let r=0;r<t.length;r++){let l,a;void 0!==e&&r===e?l="active":a=r<n?"#00CEFF":"#FCB900",i[`src_${r}`]={type:"arrayElement",value:t[r],position:r,...l&&{state:l},...a&&{color:a}}}return i},a=()=>{let e={};for(let t=0;t<r.length;t++)null!==r[t]&&(e[`res_${t}`]={type:"arrayElement",value:r[t],position:t,state:"placed"});return e},s=l(),o=new StepRecorder({nums:t},{...s});o.record("-","Start: show source array"),o.add_new_variable("n",n),o.add_new_variable("result",[...r]),o.record("initialize",`Create empty result array, n = ${n}`);for(let e=0;e<n;e++){let i=l(e),s=a();for(let e of Object.keys(i))o.update_visual(e,i[e]);for(let e of Object.keys(s))o.update_visual(e,s[e]);o.add_new_variable("i",e),o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.record("pick_first_half",`Pick nums[${e}] = ${t[e]} from first half`),r[2*e]=t[e],o.update_variable("result",[...r]);let u=a();for(let e of Object.keys(u))o.update_visual(e,u[e]);let c=l();for(let e of Object.keys(c))o.update_visual(e,c[e]);o.record("place_first",`Place ${t[e]} at result[${2*e}]`);let d=l(n+e);for(let e of Object.keys(d))o.update_visual(e,d[e]);o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.update_visual("ni",{type:"pointer",position:n+e,label:"n+i"}),o.record("pick_second_half",`Pick nums[${n+e}] = ${t[n+e]} from second half`),r[2*e+1]=t[n+e],o.update_variable("result",[...r]);let f=a();for(let e of Object.keys(f))o.update_visual(e,f[e]);let h=l();for(let e of Object.keys(h))o.update_visual(e,h[e]);o.delete_visual("ni"),o.record("place_second",`Place ${t[n+e]} at result[${2*e+1}]`)}return o.delete_visual("i"),o.update_variable("result",[...r]),o.record("complete","Shuffle complete, return result"),o.getSteps()
}

export function ShuffleTheArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ShuffleTheArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateShuffleTheArraySteps(e) as any[];
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
      title="Shuffle the Array"
      slug="shuffle-the-array"
      approaches={approaches}
      presets={ShuffleTheArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Shortest Unsorted Continuous Subarray (shortest-unsorted-continuous-subarray)
// ==========================================

const ShortestUnsortedContinuousSubarrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findUnsortedSubarray(nums):\n    n = len(nums)\n    right = -1\n    left = 0\n    max_val = nums[0]\n    min_val = nums[n - 1]\n\n    for i in range(1, n):\n        if nums[i] < max_val:\n            right = i\n        else:\n            max_val = nums[i]\n\n    if right == -1:\n        return 0\n\n    for i in range(n - 2, -1, -1):\n        if nums[i] > min_val:\n            left = i\n        else:\n            min_val = nums[i]\n\n    return right - left + 1",
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
      "scan_left_start": [
        8
      ],
      "scan_left_check": [
        9
      ],
      "update_right": [
        10
      ],
      "update_max": [
        12
      ],
      "already_sorted": [
        14,
        15
      ],
      "scan_right_start": [
        17
      ],
      "scan_right_check": [
        18
      ],
      "update_left": [
        19
      ],
      "update_min": [
        21
      ],
      "calculate_result": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        9
      ],
      "greater_than_min": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findUnsortedSubarray(int[] nums) {\n    int n = nums.length;\n    int right = -1, left = 0;\n    int max = nums[0], min = nums[n - 1];\n\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < max) {\n            right = i;\n        } else {\n            max = nums[i];\n        }\n    }\n\n    if (right == -1) return 0;\n\n    for (int i = n - 2; i >= 0; i--) {\n        if (nums[i] > min) {\n            left = i;\n        } else {\n            min = nums[i];\n        }\n    }\n\n    return right - left + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_left_start": [
        6
      ],
      "scan_left_check": [
        7
      ],
      "update_right": [
        8
      ],
      "update_max": [
        10
      ],
      "already_sorted": [
        14
      ],
      "scan_right_start": [
        16
      ],
      "scan_right_check": [
        17
      ],
      "update_left": [
        18
      ],
      "update_min": [
        20
      ],
      "calculate_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        7
      ],
      "greater_than_min": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findUnsortedSubarray(vector<int>& nums) {\n    int n = nums.size();\n    int right = -1, left = 0;\n    int maxVal = nums[0], minVal = nums[n - 1];\n\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < maxVal) {\n            right = i;\n        } else {\n            maxVal = nums[i];\n        }\n    }\n\n    if (right == -1) return 0;\n\n    for (int i = n - 2; i >= 0; i--) {\n        if (nums[i] > minVal) {\n            left = i;\n        } else {\n            minVal = nums[i];\n        }\n    }\n\n    return right - left + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_left_start": [
        6
      ],
      "scan_left_check": [
        7
      ],
      "update_right": [
        8
      ],
      "update_max": [
        10
      ],
      "already_sorted": [
        14
      ],
      "scan_right_start": [
        16
      ],
      "scan_right_check": [
        17
      ],
      "update_left": [
        18
      ],
      "update_min": [
        20
      ],
      "calculate_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        7
      ],
      "greater_than_min": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindUnsortedSubarray(int[] nums) {\n    int n = nums.Length;\n    int right = -1, left = 0;\n    int max = nums[0], min = nums[n - 1];\n\n    for (int i = 1; i < n; i++) {\n        if (nums[i] < max) {\n            right = i;\n        } else {\n            max = nums[i];\n        }\n    }\n\n    if (right == -1) return 0;\n\n    for (int i = n - 2; i >= 0; i--) {\n        if (nums[i] > min) {\n            left = i;\n        } else {\n            min = nums[i];\n        }\n    }\n\n    return right - left + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_left_start": [
        6
      ],
      "scan_left_check": [
        7
      ],
      "update_right": [
        8
      ],
      "update_max": [
        10
      ],
      "already_sorted": [
        14
      ],
      "scan_right_start": [
        16
      ],
      "scan_right_check": [
        17
      ],
      "update_left": [
        18
      ],
      "update_min": [
        20
      ],
      "calculate_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        7
      ],
      "greater_than_min": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findUnsortedSubarray(nums []int) int {\n    n := len(nums)\n    right := -1\n    left := 0\n    maxVal := nums[0]\n    minVal := nums[n-1]\n\n    for i := 1; i < n; i++ {\n        if nums[i] < maxVal {\n            right = i\n        } else {\n            maxVal = nums[i]\n        }\n    }\n\n    if right == -1 {\n        return 0\n    }\n\n    for i := n - 2; i >= 0; i-- {\n        if nums[i] > minVal {\n            left = i\n        } else {\n            minVal = nums[i]\n        }\n    }\n\n    return right - left + 1\n}",
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
      "scan_left_start": [
        8
      ],
      "scan_left_check": [
        9
      ],
      "update_right": [
        10
      ],
      "update_max": [
        12
      ],
      "already_sorted": [
        16,
        17
      ],
      "scan_right_start": [
        20
      ],
      "scan_right_check": [
        21
      ],
      "update_left": [
        22
      ],
      "update_min": [
        24
      ],
      "calculate_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        9
      ],
      "greater_than_min": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findUnsortedSubarray(nums) {\n    const n = nums.length;\n    let right = -1, left = 0;\n    let max = nums[0], min = nums[n - 1];\n\n    for (let i = 1; i < n; i++) {\n        if (nums[i] < max) {\n            right = i;\n        } else {\n            max = nums[i];\n        }\n    }\n\n    if (right === -1) return 0;\n\n    for (let i = n - 2; i >= 0; i--) {\n        if (nums[i] > min) {\n            left = i;\n        } else {\n            min = nums[i];\n        }\n    }\n\n    return right - left + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_left_start": [
        6
      ],
      "scan_left_check": [
        7
      ],
      "update_right": [
        8
      ],
      "update_max": [
        10
      ],
      "already_sorted": [
        14
      ],
      "scan_right_start": [
        16
      ],
      "scan_right_check": [
        17
      ],
      "update_left": [
        18
      ],
      "update_min": [
        20
      ],
      "calculate_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        7
      ],
      "greater_than_min": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findUnsortedSubarray(nums: number[]): number {\n    const n = nums.length;\n    let right = -1, left = 0;\n    let max = nums[0], min = nums[n - 1];\n\n    for (let i = 1; i < n; i++) {\n        if (nums[i] < max) {\n            right = i;\n        } else {\n            max = nums[i];\n        }\n    }\n\n    if (right === -1) return 0;\n\n    for (let i = n - 2; i >= 0; i--) {\n        if (nums[i] > min) {\n            left = i;\n        } else {\n            min = nums[i];\n        }\n    }\n\n    return right - left + 1;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3,
        4
      ],
      "scan_left_start": [
        6
      ],
      "scan_left_check": [
        7
      ],
      "update_right": [
        8
      ],
      "update_max": [
        10
      ],
      "already_sorted": [
        14
      ],
      "scan_right_start": [
        16
      ],
      "scan_right_check": [
        17
      ],
      "update_left": [
        18
      ],
      "update_min": [
        20
      ],
      "calculate_result": [
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "less_than_max": [
        7
      ],
      "greater_than_min": [
        17
      ]
    }
  }
};

const ShortestUnsortedContinuousSubarrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        2,
        6,
        4,
        8,
        10,
        9,
        15
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
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
    "id": "ex3",
    "label": "Input 3",
    "value": {
      "nums": [
        1,
        3,
        2,
        2,
        2
      ]
    }
  }
];

function generateShortestUnsortedContinuousSubarraySteps(e: any): any[] {
  let t=e.nums,n=t.length,a=[...t].sort((e,t)=>e-t),i=t.reduce((e,t,n)=>(e[`num_${n}`]={type:"arrayElement",value:t,position:n},e),{}),l=a.reduce((e,t,n)=>(e[`sorted_${n}`]={type:"arrayElement",value:t,position:n},e),{}),s=new StepRecorder({nums:t},{...i,...l});s.update_variable("nums",[...t]),s.update_variable("left",-1),s.update_variable("right",-1),s.update_variable("phase",0),s.record("-","Sort a copy, then compare with the original to find where they differ."),s.record("sort","Sort a copy of the array; matching prefixes and suffixes are already in place."),s.update_variable("phase",1);let o=-1;for(let e=0;e<n;e++)if(s.update_variable("i",e),s.update_variable("phase",1),t[e]===a[e])s.record("left_match",`nums[${e}] = ${t[e]} matches the sorted copy, still in place.`);else{o=e,s.update_variable("left",o),s.record("left_found",`nums[${e}] = ${t[e]} != ${a[e]}: left boundary = ${e}.`);break}if(-1===o)return s.update_variable("result",0),s.update_variable("phase",3),s.delete_variable("i"),s.record("already_sorted","The copy matches everywhere: the array is already sorted."),s.update_variable("return",0),s.record("complete","Already sorted. Shortest unsorted subarray length = 0."),s.getSteps();s.update_variable("phase",2);let u=-1;for(let e=n-1;e>=0;e--)if(s.update_variable("i",e),s.update_variable("phase",2),t[e]===a[e])s.record("right_match",`nums[${e}] = ${t[e]} matches the sorted copy, still in place.`);else{u=e,s.update_variable("right",u),s.record("right_found",`nums[${e}] = ${t[e]} != ${a[e]}: right boundary = ${e}.`);break}let d=u-o+1;return s.update_variable("phase",3),s.update_variable("result",d),s.delete_variable("i"),s.record("calculate",`Unsorted subarray = indices ${o}..${u}. Length = ${u} - ${o} + 1 = ${d}.`),s.update_variable("return",d),s.record("complete",`Done. Shortest unsorted subarray length = ${d}.`),s.getSteps()
}

export function ShortestUnsortedContinuousSubarrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ShortestUnsortedContinuousSubarrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateShortestUnsortedContinuousSubarraySteps(e) as any[];
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
      title="Shortest Unsorted Continuous Subarray"
      slug="shortest-unsorted-continuous-subarray"
      approaches={approaches}
      presets={ShortestUnsortedContinuousSubarrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Summary Ranges (summary-ranges)
// ==========================================

const SummaryRangesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def summaryRanges(self, nums: list[int]) -> list[str]:\n        result = []\n        n = len(nums)\n        i = 0\n\n        while i < n:\n            start = nums[i]\n\n            # Advance while consecutive\n            while i + 1 < n and nums[i + 1] == nums[i] + 1:\n                i += 1\n\n            # Format the range\n            if start == nums[i]:\n                result.append(str(start))\n            else:\n                result.append(f\"{start}->{nums[i]}\")\n\n            i += 1\n\n        return result",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "set_start": [
        8
      ],
      "check_consecutive": [
        11
      ],
      "advance": [
        12
      ],
      "single": [
        16
      ],
      "range": [
        18
      ],
      "next": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        7
      ],
      "check_consecutive": [
        11
      ],
      "is_single": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<String> summaryRanges(int[] nums) {\n        List<String> result = new ArrayList<>();\n        int n = nums.length;\n        int i = 0;\n\n        while (i < n) {\n            int start = nums[i];\n\n            // Advance while consecutive\n            while (i + 1 < n && nums[i + 1] == nums[i] + 1) {\n                i++;\n            }\n\n            // Format the range\n            if (start == nums[i]) {\n                result.add(String.valueOf(start));\n            } else {\n                result.add(start + \"->\" + nums[i]);\n            }\n\n            i++;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "set_start": [
        8
      ],
      "check_consecutive": [
        11
      ],
      "advance": [
        12
      ],
      "single": [
        17
      ],
      "range": [
        19
      ],
      "next": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        7
      ],
      "check_consecutive": [
        11
      ],
      "is_single": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<string> summaryRanges(vector<int>& nums) {\n        vector<string> result;\n        int n = nums.size();\n        int i = 0;\n\n        while (i < n) {\n            int start = nums[i];\n\n            // Advance while consecutive\n            while (i + 1 < n && nums[i + 1] == nums[i] + 1) {\n                i++;\n            }\n\n            // Format the range\n            if (start == nums[i]) {\n                result.push_back(to_string(start));\n            } else {\n                result.push_back(to_string(start) + \"->\" + to_string(nums[i]));\n            }\n\n            i++;\n        }\n\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4,
        5,
        6
      ],
      "set_start": [
        9
      ],
      "check_consecutive": [
        12
      ],
      "advance": [
        13
      ],
      "single": [
        18
      ],
      "range": [
        20
      ],
      "next": [
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        8
      ],
      "check_consecutive": [
        12
      ],
      "is_single": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<string> SummaryRanges(int[] nums) {\n        IList<string> result = new List<string>();\n        int n = nums.Length;\n        int i = 0;\n\n        while (i < n) {\n            int start = nums[i];\n\n            // Advance while consecutive\n            while (i + 1 < n && nums[i + 1] == nums[i] + 1) {\n                i++;\n            }\n\n            // Format the range\n            if (start == nums[i]) {\n                result.Add(start.ToString());\n            } else {\n                result.Add(start + \"->\" + nums[i]);\n            }\n\n            i++;\n        }\n\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "set_start": [
        8
      ],
      "check_consecutive": [
        11
      ],
      "advance": [
        12
      ],
      "single": [
        17
      ],
      "range": [
        19
      ],
      "next": [
        22
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        7
      ],
      "check_consecutive": [
        11
      ],
      "is_single": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func summaryRanges(nums []int) []string {\n    result := []string{}\n    n := len(nums)\n    i := 0\n\n    for i < n {\n        start := nums[i]\n\n        // Advance while consecutive\n        for i+1 < n && nums[i+1] == nums[i]+1 {\n            i++\n        }\n\n        // Format the range\n        if start == nums[i] {\n            result = append(result, strconv.Itoa(start))\n        } else {\n            result = append(result, strconv.Itoa(start)+\"->\"+strconv.Itoa(nums[i]))\n        }\n\n        i++\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "set_start": [
        7
      ],
      "check_consecutive": [
        10
      ],
      "advance": [
        11
      ],
      "single": [
        16
      ],
      "range": [
        18
      ],
      "next": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        6
      ],
      "check_consecutive": [
        10
      ],
      "is_single": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var summaryRanges = function(nums) {\n    const result = [];\n    const n = nums.length;\n    let i = 0;\n\n    while (i < n) {\n        const start = nums[i];\n\n        // Advance while consecutive\n        while (i + 1 < n && nums[i + 1] === nums[i] + 1) {\n            i++;\n        }\n\n        // Format the range\n        if (start === nums[i]) {\n            result.push(String(start));\n        } else {\n            result.push(start + \"->\" + nums[i]);\n        }\n\n        i++;\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "set_start": [
        7
      ],
      "check_consecutive": [
        10
      ],
      "advance": [
        11
      ],
      "single": [
        16
      ],
      "range": [
        18
      ],
      "next": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        6
      ],
      "check_consecutive": [
        10
      ],
      "is_single": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function summaryRanges(nums: number[]): string[] {\n    const result: string[] = [];\n    const n = nums.length;\n    let i = 0;\n\n    while (i < n) {\n        const start = nums[i];\n\n        // Advance while consecutive\n        while (i + 1 < n && nums[i + 1] === nums[i] + 1) {\n            i++;\n        }\n\n        // Format the range\n        if (start === nums[i]) {\n            result.push(String(start));\n        } else {\n            result.push(start + \"->\" + nums[i]);\n        }\n\n        i++;\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "set_start": [
        7
      ],
      "check_consecutive": [
        10
      ],
      "advance": [
        11
      ],
      "single": [
        16
      ],
      "range": [
        18
      ],
      "next": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "while_i_lt_n": [
        6
      ],
      "check_consecutive": [
        10
      ],
      "is_single": [
        15
      ]
    }
  }
};

const SummaryRangesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        0,
        1,
        2,
        4,
        5,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Multiple ranges",
    "value": {
      "nums": [
        0,
        2,
        3,
        4,
        6,
        8,
        9
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All consecutive",
    "value": {
      "nums": [
        0,
        1,
        2,
        3,
        4
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All single",
    "value": {
      "nums": [
        0,
        2,
        4,
        6
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single element",
    "value": {
      "nums": [
        0
      ]
    }
  }
];

function generateSummaryRangesSteps(e: any): any[] {
  let t=[...e.nums],n=t.length,i={};t.forEach((e,t)=>{i[`bar_${t}`]={type:"arrayElement",value:e,position:t}});let a=new StepRecorder({mode:"index",nums:t,i:void 0,start:void 0,result:void 0},{...i,result_display:{type:"metadata",value:[]}}),r=(e,n)=>{a.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:n})},l=e=>{a.update_visual("pointer_i",{type:"pointer",position:e,label:"i"})};if(0===n)return a.record("-","Start: array is empty, return []"),a.record("complete","Result: []"),a.getSteps();a.record("-","Start: merge runs of consecutive numbers into ranges");let u=0,o=[];for(a.update_variable("i",u),a.update_variable("result",o),a.add_new_visual("pointer_i",{type:"pointer",position:u,label:"i"}),a.record("init","Initialize: i = 0, result = []");u<n;){a.add_conditional("while_i_lt_n",!0);let e=u;for(a.update_variable("start",t[e]),a.update_variable("pendingText",`${t[e]}`),r(u,"active"),a.add_new_visual("pointer_start",{type:"pointer",position:e,label:"start"}),l(u),a.record("set_start",`Start a new range at start = nums[${e}] = ${t[e]}`);u+1<n&&t[u+1]===t[u]+1;)a.add_conditional("check_consecutive",!0),a.record("check_consecutive",`nums[${u+1}] = ${t[u+1]} == nums[${u}] + 1 = ${t[u]+1}? Yes, extend the run`),r(u,"run"),u++,a.update_variable("i",u),r(u,"active"),l(u),a.update_variable("pendingText",`${t[e]}->${t[u]}`),a.record("advance",`Advance i to ${u}, the run is now ${t[e]}..${t[u]}`);if(u+1<n?(a.add_conditional("check_consecutive",!1),a.record("check_consecutive",`nums[${u+1}] = ${t[u+1]} != nums[${u}] + 1 = ${t[u]+1}? Not consecutive, close the run`)):(a.add_conditional("check_consecutive",!1),a.record("check_consecutive",`i + 1 = ${u+1} >= n = ${n}, end of array, close the run`)),a.delete_variable("pendingText"),e===u){a.add_conditional("is_single",!0);let n=String(t[e]);o.push(n),a.update_variable("result",[...o]),r(u,"captured"),a.update_visual("result_display",{type:"metadata",value:[...o]}),a.record("single",`start == nums[i], the run has a single value, add "${n}" to result`)}else{a.add_conditional("is_single",!1);let n=`${t[e]}->${t[u]}`;o.push(n),a.update_variable("result",[...o]);for(let t=e;t<=u;t++)r(t,"captured");a.update_visual("result_display",{type:"metadata",value:[...o]}),a.record("range",`start != nums[i], the run spans ${t[e]}..${t[u]}, add "${n}" to result`)}let s=u;u++,a.update_variable("i",u),a.delete_visual("pointer_start");for(let t=e;t<=s;t++)r(t,"done");u<n?(l(u),a.record("next",`Move i to ${u}, the next unprocessed element`)):(a.delete_visual("pointer_i"),a.record("next",`i = ${u} >= n = ${n}, all elements processed`))}return a.add_conditional("while_i_lt_n",!1),a.record("complete",`Done! result = [${o.map(e=>`"${e}"`).join(", ")}]`),a.getSteps()
}

export function SummaryRangesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SummaryRangesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSummaryRangesSteps(e) as any[];
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
      title="Summary Ranges"
      slug="summary-ranges"
      approaches={approaches}
      presets={SummaryRangesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Third Maximum Number (third-maximum-number)
// ==========================================

const ThirdMaximumNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def thirdMax(nums: List[int]) -> int:\n    # Use float('-inf') as sentinel (outside 32-bit integer range)\n    first = second = third = float('-inf')\n\n    for num in nums:\n        # Skip duplicates\n        if num == first or num == second or num == third:\n            continue\n        if num > first:\n            # New largest: shift everything down\n            third = second\n            second = first\n            first = num\n        elif num > second:\n            # New second largest: shift third down\n            third = second\n            second = num\n        elif num > third:\n            # New third largest\n            third = num\n\n    # If third was never assigned, return the maximum\n    return third if third != float('-inf') else first",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3
      ],
      "check_element": [
        5
      ],
      "skip_duplicate": [
        8
      ],
      "update_first": [
        11,
        12,
        13
      ],
      "update_second": [
        16,
        17
      ],
      "update_third": [
        20
      ],
      "no_update": [
        18
      ],
      "return_result": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ],
      "gt_first": [
        9
      ],
      "gt_second": [
        14
      ],
      "gt_third": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int thirdMax(int[] nums) {\n    // Use long to avoid sentinel collision with Integer.MIN_VALUE\n    long first = Long.MIN_VALUE;\n    long second = Long.MIN_VALUE;\n    long third = Long.MIN_VALUE;\n\n    for (int num : nums) {\n        // Skip duplicates\n        if (num == first || num == second || num == third) {\n            continue;\n        }\n        if (num > first) {\n            // New largest: shift everything down\n            third = second;\n            second = first;\n            first = num;\n        } else if (num > second) {\n            // New second largest: shift third down\n            third = second;\n            second = num;\n        } else if (num > third) {\n            // New third largest\n            third = num;\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    return (int) (third == Long.MIN_VALUE ? first : third);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int thirdMax(vector<int>& nums) {\n    // Use long long to avoid sentinel collision with INT_MIN\n    long long first = LLONG_MIN;\n    long long second = LLONG_MIN;\n    long long third = LLONG_MIN;\n\n    for (int num : nums) {\n        // Skip duplicates\n        if (num == first || num == second || num == third) {\n            continue;\n        }\n        if (num > first) {\n            // New largest: shift everything down\n            third = second;\n            second = first;\n            first = num;\n        } else if (num > second) {\n            // New second largest: shift third down\n            third = second;\n            second = num;\n        } else if (num > third) {\n            // New third largest\n            third = num;\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    return (int)(third == LLONG_MIN ? first : third);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int ThirdMax(int[] nums) {\n    // Use long to avoid sentinel collision with int.MinValue\n    long first = long.MinValue;\n    long second = long.MinValue;\n    long third = long.MinValue;\n\n    foreach (int num in nums) {\n        // Skip duplicates\n        if (num == first || num == second || num == third) {\n            continue;\n        }\n        if (num > first) {\n            // New largest: shift everything down\n            third = second;\n            second = first;\n            first = num;\n        } else if (num > second) {\n            // New second largest: shift third down\n            third = second;\n            second = num;\n        } else if (num > third) {\n            // New third largest\n            third = num;\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    return (int)(third == long.MinValue ? first : third);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func thirdMax(nums []int) int {\n    // Use math.MinInt64 as sentinel (outside 32-bit range)\n    first := math.MinInt64\n    second := math.MinInt64\n    third := math.MinInt64\n\n    for _, num := range nums {\n        // Skip duplicates\n        if num == first || num == second || num == third {\n            continue\n        }\n        if num > first {\n            // New largest: shift everything down\n            third = second\n            second = first\n            first = num\n        } else if num > second {\n            // New second largest: shift third down\n            third = second\n            second = num\n        } else if num > third {\n            // New third largest\n            third = num\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    if third == math.MinInt64 {\n        return first\n    }\n    return third\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28,
        29,
        30,
        31
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var thirdMax = function(nums) {\n    // Use -Infinity as sentinel (outside 32-bit integer range)\n    let first = -Infinity;\n    let second = -Infinity;\n    let third = -Infinity;\n\n    for (const num of nums) {\n        // Skip duplicates\n        if (num === first || num === second || num === third) {\n            continue;\n        }\n        if (num > first) {\n            // New largest: shift everything down\n            third = second;\n            second = first;\n            first = num;\n        } else if (num > second) {\n            // New second largest: shift third down\n            third = second;\n            second = num;\n        } else if (num > third) {\n            // New third largest\n            third = num;\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    return third === -Infinity ? first : third;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function thirdMax(nums: number[]): number {\n    // Use -Infinity as sentinel (outside 32-bit integer range)\n    let first = -Infinity;\n    let second = -Infinity;\n    let third = -Infinity;\n\n    for (const num of nums) {\n        // Skip duplicates\n        if (num === first || num === second || num === third) {\n            continue;\n        }\n        if (num > first) {\n            // New largest: shift everything down\n            third = second;\n            second = first;\n            first = num;\n        } else if (num > second) {\n            // New second largest: shift third down\n            third = second;\n            second = num;\n        } else if (num > third) {\n            // New third largest\n            third = num;\n        }\n    }\n\n    // If third was never assigned, return the maximum\n    return third === -Infinity ? first : third;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        3,
        4,
        5
      ],
      "check_element": [
        7
      ],
      "skip_duplicate": [
        10
      ],
      "update_first": [
        14,
        15,
        16
      ],
      "update_second": [
        19,
        20
      ],
      "update_third": [
        23
      ],
      "no_update": [
        24
      ],
      "return_result": [
        28
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        9
      ],
      "gt_first": [
        12
      ],
      "gt_second": [
        17
      ],
      "gt_third": [
        21
      ]
    }
  }
};

const ThirdMaximumNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Input 1",
    "value": {
      "nums": [
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Input 2",
    "value": {
      "nums": [
        1,
        2,
        2,
        1,
        2,
        1,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "With Duplicates",
    "value": {
      "nums": [
        2,
        2,
        3,
        1
      ]
    }
  }
];

function generateThirdMaximumNumberSteps(e: any): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],i=t.length,a=t.map((e,t)=>({value:e,index:t}));a.sort((e,t)=>e.value===t.value?e.index-t.index:e.value-t.value);let r=Array(i);a.forEach((e,t)=>r[e.index]=t);let l=a.map(e=>e.value),s={},u=(e,n={})=>{let a={};for(let l=0;l<i;l++){let i=e?r[l]:l,u=n[i]??s[i];a[`elem_${l}`]={type:"arrayElement",value:t[l],position:i,...u&&{state:u}}}return a},d=(e,t,i={})=>{for(let[n,a]of Object.entries(u(t,i)))e.update_visual(n,a)},o=new StepRecorder({nums:[...t]},{...u(!1),meta_count:{type:"metadata",value:0},meta_flash:{type:"metadata",value:[]},meta_compare:{type:"metadata",value:null}});if(o.record("-","Start of algorithm"),0===i)return o.getSteps();o.update_variable("nums",l),d(o,!0),o.record("sort_array","Sort the array so equal values sit together and the maximums land on the right");let c=1;s[i-1]="rank1",o.add_new_variable("count",c),o.update_visual("meta_count",{type:"metadata",value:c}),o.update_visual("meta_flash",{type:"metadata",value:["count"]}),d(o,!0),o.record("initialize",`count = 1: nums[${i-1}] = ${l[i-1]} is the largest distinct value`);let m=null,h="first";for(let e=i-2;e>=0;e--){if(o.update_variable("i",e),o.update_visual("i",{type:"pointer",position:e,label:"i"}),o.update_visual("meta_flash",{type:"metadata",value:[]}),o.update_visual("meta_compare",{type:"metadata",value:e+1}),d(o,!0,{[e]:"active"}),o.record("check_element",`Compare nums[${e}] = ${l[e]} with nums[${e+1}] = ${l[e+1]}`),l[e]===l[e+1]){s[e]="duplicate",o.add_conditional("is_duplicate",!0),d(o,!0),o.record("skip_duplicate",`${l[e]} repeats the value on its right, skip it`);continue}if(c++,s[e]=`rank${c}`,o.add_conditional("is_duplicate",!1),o.add_conditional("is_third",3===c),o.update_variable("count",c),o.update_visual("meta_count",{type:"metadata",value:c}),o.update_visual("meta_flash",{type:"metadata",value:["count"]}),d(o,!0),o.record("new_distinct",`${l[e]} is a new distinct value, count = ${c}`),3===c){m=l[e],h="third";break}}return null===m&&(m=l[i-1],h="first"),o.delete_visual("i"),o.add_new_variable("result",m),o.update_visual("meta_compare",{type:"metadata",value:null}),o.update_visual("meta_flash",{type:"metadata",value:["answer"]}),o.update_visual("meta_result",{type:"metadata",value:{slot:h,value:m}}),d(o,!0),o.record("third"===h?"return_third":"return_max","third"===h?`count reached 3, so the third maximum is ${m}`:`Only ${c} distinct value${1===c?"":"s"}, so return the maximum ${m}`),o.getSteps()
}

export function ThirdMaximumNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ThirdMaximumNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateThirdMaximumNumberSteps(e) as any[];
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
      title="Third Maximum Number"
      slug="third-maximum-number"
      approaches={approaches}
      presets={ThirdMaximumNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Mo's Algorithm (mos-algorithm)
// ==========================================

const MosAlgorithmTemplates = {
  "python": {
    "language": "python",
    "code": "def mos_algorithm(arr, queries):\n    n = len(arr)\n    block = int(n ** 0.5)\n\n    # Assign block number to each query\n    indexed = [(l, r, i) for i, (l, r) in enumerate(queries)]\n\n    # Sort by (block(l), r)\n    indexed.sort(key=lambda q: (q[0] // block, q[1]))\n\n    cur_l, cur_r = 0, -1\n    freq = defaultdict(int)\n    distinct = 0\n    answers = [0] * len(queries)\n\n    for l, r, idx in indexed:\n        while cur_r < r:\n            cur_r += 1\n            freq[arr[cur_r]] += 1\n            if freq[arr[cur_r]] == 1: distinct += 1\n        while cur_r > r:\n            freq[arr[cur_r]] -= 1\n            if freq[arr[cur_r]] == 0: distinct -= 1\n            cur_r -= 1\n        while cur_l > l:\n            cur_l -= 1\n            freq[arr[cur_l]] += 1\n            if freq[arr[cur_l]] == 1: distinct += 1\n        while cur_l < l:\n            freq[arr[cur_l]] -= 1\n            if freq[arr[cur_l]] == 0: distinct -= 1\n            cur_l += 1\n        answers[idx] = distinct\n\n    return answers",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6
      ],
      "sort_queries": [
        9
      ],
      "init_window": [
        11,
        12,
        13,
        14
      ],
      "pick_query": [
        16
      ],
      "expand_right": [
        17,
        18,
        19,
        20
      ],
      "shrink_right": [
        21,
        22,
        23,
        24
      ],
      "expand_left": [
        25,
        26,
        27,
        28
      ],
      "shrink_left": [
        29,
        30,
        31,
        32
      ],
      "answer_query": [
        33
      ],
      "complete": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "int[] mosAlgorithm(int[] arr, int[][] queries) {\n    int n = arr.length;\n    int block = (int) Math.sqrt(n);\n\n    // Create indexed queries and compute blocks\n    int[][] indexed = new int[queries.length][3];\n    for (int i = 0; i < queries.length; i++) {\n        indexed[i] = new int[]{queries[i][0], queries[i][1], i};\n    }\n\n    // Sort by (block(l), r)\n    Arrays.sort(indexed, (a, b) ->\n        a[0]/block != b[0]/block ? a[0]/block - b[0]/block : a[1] - b[1]);\n\n    int curL = 0, curR = -1, distinct = 0;\n    Map<Integer, Integer> freq = new HashMap<>();\n    int[] answers = new int[queries.length];\n\n    for (int[] q : indexed) {\n        int l = q[0], r = q[1], idx = q[2];\n        while (curR < r) { curR++; add(arr[curR], freq); }\n        while (curR > r) { remove(arr[curR], freq); curR--; }\n        while (curL > l) { curL--; add(arr[curL], freq); }\n        while (curL < l) { remove(arr[curL], freq); curL++; }\n        answers[idx] = freq.size();\n    }\n\n    return answers;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6,
        7,
        8,
        9
      ],
      "sort_queries": [
        12,
        13
      ],
      "init_window": [
        15,
        16,
        17
      ],
      "pick_query": [
        19,
        20
      ],
      "expand_right": [
        21
      ],
      "shrink_right": [
        22
      ],
      "expand_left": [
        23
      ],
      "shrink_left": [
        24
      ],
      "answer_query": [
        25
      ],
      "complete": [
        28
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> mosAlgorithm(vector<int>& arr, vector<pair<int,int>>& queries) {\n    int n = arr.size();\n    int block = (int)sqrt(n);\n\n    // Create indexed queries and compute blocks\n    vector<array<int,3>> indexed(queries.size());\n    for (int i = 0; i < queries.size(); i++) {\n        indexed[i] = {queries[i].first, queries[i].second, i};\n    }\n\n    // Sort by (block(l), r)\n    sort(indexed.begin(), indexed.end(), [&](auto& a, auto& b) {\n        return a[0]/block != b[0]/block ? a[0]/block < b[0]/block : a[1] < b[1];\n    });\n\n    int curL = 0, curR = -1, distinct = 0;\n    unordered_map<int, int> freq;\n    vector<int> answers(queries.size());\n\n    for (auto& q : indexed) {\n        int l = q[0], r = q[1], idx = q[2];\n        while (curR < r) { ++curR; if (++freq[arr[curR]] == 1) distinct++; }\n        while (curR > r) { if (--freq[arr[curR]] == 0) distinct--; curR--; }\n        while (curL > l) { --curL; if (++freq[arr[curL]] == 1) distinct++; }\n        while (curL < l) { if (--freq[arr[curL]] == 0) distinct--; curL++; }\n        answers[idx] = distinct;\n    }\n\n    return answers;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6,
        7,
        8,
        9
      ],
      "sort_queries": [
        12,
        13,
        14
      ],
      "init_window": [
        16,
        17,
        18
      ],
      "pick_query": [
        20,
        21
      ],
      "expand_right": [
        22
      ],
      "shrink_right": [
        23
      ],
      "expand_left": [
        24
      ],
      "shrink_left": [
        25
      ],
      "answer_query": [
        26
      ],
      "complete": [
        29
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "int[] MosAlgorithm(int[] arr, int[][] queries) {\n    int n = arr.Length;\n    int block = (int)Math.Sqrt(n);\n\n    // Create indexed queries and compute blocks\n    var indexed = queries.Select((q, i) => new int[] { q[0], q[1], i }).ToArray();\n\n    // Sort by (block(l), r)\n    Array.Sort(indexed, (a, b) =>\n        a[0]/block != b[0]/block ? a[0]/block - b[0]/block : a[1] - b[1]);\n\n    int curL = 0, curR = -1, distinct = 0;\n    var freq = new Dictionary<int, int>();\n    int[] answers = new int[queries.Length];\n\n    foreach (var q in indexed) {\n        int l = q[0], r = q[1], idx = q[2];\n        while (curR < r) { curR++; Add(arr[curR], freq, ref distinct); }\n        while (curR > r) { Remove(arr[curR], freq, ref distinct); curR--; }\n        while (curL > l) { curL--; Add(arr[curL], freq, ref distinct); }\n        while (curL < l) { Remove(arr[curL], freq, ref distinct); curL++; }\n        answers[idx] = distinct;\n    }\n\n    return answers;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6
      ],
      "sort_queries": [
        9,
        10
      ],
      "init_window": [
        12,
        13,
        14
      ],
      "pick_query": [
        16,
        17
      ],
      "expand_right": [
        18
      ],
      "shrink_right": [
        19
      ],
      "expand_left": [
        20
      ],
      "shrink_left": [
        21
      ],
      "answer_query": [
        22
      ],
      "complete": [
        25
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mosAlgorithm(arr []int, queries [][]int) []int {\n    n := len(arr)\n    block := int(math.Sqrt(float64(n)))\n\n    // Create indexed queries and compute blocks\n    indexed := make([][3]int, len(queries))\n    for i, q := range queries {\n        indexed[i] = [3]int{q[0], q[1], i}\n    }\n\n    // Sort by (block(l), r)\n    sort.Slice(indexed, func(i, j int) bool {\n        if indexed[i][0]/block != indexed[j][0]/block {\n            return indexed[i][0]/block < indexed[j][0]/block\n        }\n        return indexed[i][1] < indexed[j][1]\n    })\n\n    curL, curR, distinct := 0, -1, 0\n    freq := map[int]int{}\n    answers := make([]int, len(queries))\n\n    for _, q := range indexed {\n        l, r, idx := q[0], q[1], q[2]\n        for curR < r { curR++; freq[arr[curR]]++; if freq[arr[curR]] == 1 { distinct++ } }\n        for curR > r { freq[arr[curR]]--; if freq[arr[curR]] == 0 { distinct-- }; curR-- }\n        for curL > l { curL--; freq[arr[curL]]++; if freq[arr[curL]] == 1 { distinct++ } }\n        for curL < l { freq[arr[curL]]--; if freq[arr[curL]] == 0 { distinct-- }; curL++ }\n        answers[idx] = distinct\n    }\n\n    return answers\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6,
        7,
        8,
        9
      ],
      "sort_queries": [
        12,
        13,
        14,
        15,
        16,
        17
      ],
      "init_window": [
        19,
        20,
        21
      ],
      "pick_query": [
        23,
        24
      ],
      "expand_right": [
        25
      ],
      "shrink_right": [
        26
      ],
      "expand_left": [
        27
      ],
      "shrink_left": [
        28
      ],
      "answer_query": [
        29
      ],
      "complete": [
        32
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mosAlgorithm(arr, queries) {\n    const n = arr.length;\n    const block = Math.floor(Math.sqrt(n));\n\n    // Create indexed queries and compute blocks\n    const indexed = queries.map((q, i) => [q[0], q[1], i]);\n\n    // Sort by (block(l), r)\n    indexed.sort((a, b) =>\n        Math.floor(a[0]/block) !== Math.floor(b[0]/block)\n            ? Math.floor(a[0]/block) - Math.floor(b[0]/block) : a[1] - b[1]);\n\n    let curL = 0, curR = -1, distinct = 0;\n    const freq = new Map();\n    const answers = new Array(queries.length).fill(0);\n\n    for (const [l, r, idx] of indexed) {\n        while (curR < r) { curR++; freq.set(arr[curR], (freq.get(arr[curR])||0)+1); if (freq.get(arr[curR])===1) distinct++; }\n        while (curR > r) { freq.set(arr[curR], freq.get(arr[curR])-1); if (freq.get(arr[curR])===0) distinct--; curR--; }\n        while (curL > l) { curL--; freq.set(arr[curL], (freq.get(arr[curL])||0)+1); if (freq.get(arr[curL])===1) distinct++; }\n        while (curL < l) { freq.set(arr[curL], freq.get(arr[curL])-1); if (freq.get(arr[curL])===0) distinct--; curL++; }\n        answers[idx] = distinct;\n    }\n\n    return answers;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6
      ],
      "sort_queries": [
        9,
        10,
        11
      ],
      "init_window": [
        13,
        14,
        15
      ],
      "pick_query": [
        17
      ],
      "expand_right": [
        18
      ],
      "shrink_right": [
        19
      ],
      "expand_left": [
        20
      ],
      "shrink_left": [
        21
      ],
      "answer_query": [
        22
      ],
      "complete": [
        25
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mosAlgorithm(arr: number[], queries: number[][]): number[] {\n    const n = arr.length;\n    const block = Math.floor(Math.sqrt(n));\n\n    // Create indexed queries and compute blocks\n    const indexed = queries.map((q, i) => [q[0], q[1], i]);\n\n    // Sort by (block(l), r)\n    indexed.sort((a, b) =>\n        Math.floor(a[0]/block) !== Math.floor(b[0]/block)\n            ? Math.floor(a[0]/block) - Math.floor(b[0]/block) : a[1] - b[1]);\n\n    let curL = 0, curR = -1, distinct = 0;\n    const freq = new Map<number, number>();\n    const answers: number[] = new Array(queries.length).fill(0);\n\n    for (const [l, r, idx] of indexed) {\n        while (curR < r) { curR++; freq.set(arr[curR], (freq.get(arr[curR])||0)+1); if (freq.get(arr[curR])===1) distinct++; }\n        while (curR > r) { freq.set(arr[curR], freq.get(arr[curR])!-1); if (freq.get(arr[curR])===0) distinct--; curR--; }\n        while (curL > l) { curL--; freq.set(arr[curL], (freq.get(arr[curL])||0)+1); if (freq.get(arr[curL])===1) distinct++; }\n        while (curL < l) { freq.set(arr[curL], freq.get(arr[curL])!-1); if (freq.get(arr[curL])===0) distinct--; curL++; }\n        answers[idx] = distinct;\n    }\n\n    return answers;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "compute_blocks": [
        3,
        6
      ],
      "sort_queries": [
        9,
        10,
        11
      ],
      "init_window": [
        13,
        14,
        15
      ],
      "pick_query": [
        17
      ],
      "expand_right": [
        18
      ],
      "shrink_right": [
        19
      ],
      "expand_left": [
        20
      ],
      "shrink_left": [
        21
      ],
      "answer_query": [
        22
      ],
      "complete": [
        25
      ]
    }
  }
};

const MosAlgorithmPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        2,
        1,
        3,
        2,
        1
      ],
      "queries": [
        [
          0,
          3
        ],
        [
          1,
          5
        ],
        [
          2,
          6
        ],
        [
          0,
          6
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Distinct",
    "value": {
      "arr": [
        1,
        2,
        3,
        4,
        5
      ],
      "queries": [
        [
          0,
          2
        ],
        [
          1,
          4
        ],
        [
          0,
          4
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "arr": [
        2,
        2,
        2,
        2,
        2,
        2
      ],
      "queries": [
        [
          0,
          2
        ],
        [
          1,
          4
        ],
        [
          0,
          5
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Large",
    "value": {
      "arr": [
        4,
        1,
        3,
        1,
        2,
        4,
        3,
        2
      ],
      "queries": [
        [
          0,
          3
        ],
        [
          4,
          7
        ],
        [
          1,
          6
        ],
        [
          0,
          7
        ],
        [
          2,
          5
        ]
      ]
    }
  }
];

function generateMosAlgorithmSteps(e: any): any[] {
  let r=[...e.arr],t=e.queries.map(e=>[...e]),n=r.length,a=Math.max(1,Math.floor(Math.sqrt(n))),l=t.length,s={};for(let e=0;e<n;e++)s[`bar_${e}`]={type:"arrayElement",value:r[e],position:e};for(let e=0;e<l;e++)s[`query_${e}`]={type:"stateElement",value:`Q${e}: [${t[e][0]}, ${t[e][1]}]`,index:e};s.meta_blockSize={type:"metadata",value:a,label:"Block Size"};let o=new StepRecorder({blockSize:a,currentL:void 0,currentR:void 0,distinct:void 0,queryIndex:void 0},s);o.record("-",`Start: Mo's Algorithm, answer ${l} range queries on array of size ${n}. Block size = floor(sqrt(${n})) = ${a}.`);let u=t.map((e,r)=>({l:e[0],r:e[1],idx:r}));for(let e=0;e<l;e++)o.update_visual(`query_${e}`,{type:"stateElement",value:`Q${u[e].idx}: [${u[e].l}, ${u[e].r}]  (block ${Math.floor(u[e].l/a)})`,index:e,state:"active"});o.record("compute_blocks",`Compute block number for each query: block = L / ${a}. Queries in the same block will be processed together.`),u.sort((e,r)=>{let t=Math.floor(e.l/a),i=Math.floor(r.l/a);return t!==i?t-i:t%2==0?e.r-r.r:r.r-e.r});for(let e=0;e<l;e++)o.update_visual(`query_${e}`,{type:"stateElement",value:`Q${u[e].idx}: [${u[e].l}, ${u[e].r}]  (block ${Math.floor(u[e].l/a)})`,index:e,state:"highlight"});o.record("sort_queries","Sort queries by Mo's ordering: primary key = block(L), secondary key = R (with even-odd optimization).");for(let e=0;e<l;e++)o.update_visual(`query_${e}`,{type:"stateElement",value:`Q${u[e].idx}: [${u[e].l}, ${u[e].r}]`,index:e});let c=0,d=-1,h=new Map,f=0,p=Array(l).fill(void 0);function m(e){let t=r[e],i=h.get(t)||0;0===i&&f++,h.set(t,i+1),o.update_visual(`bar_${e}`,{type:"arrayElement",value:t,position:e,state:"active"})}function g(e){let t=r[e],i=h.get(t)||0;h.set(t,i-1),i-1==0&&(f--,h.delete(t)),o.update_visual(`bar_${e}`,{type:"arrayElement",value:t,position:e,state:"muted"})}o.update_variable("currentL",c),o.update_variable("currentR",d),o.update_variable("distinct",f),o.add_new_visual("range_window",{type:"range",start:0,end:-1,label:"window",state:"active"}),o.record("init_window","Initialize empty window: currentL = 0, currentR = -1. Frequency map is empty, distinct count = 0.");for(let e=0;e<l;e++){let{l:t,r:i,idx:a}=u[e];o.update_variable("queryIndex",e);for(let r=0;r<l;r++)o.update_visual(`query_${r}`,{type:"stateElement",value:void 0!==p[r]?`Q${u[r].idx}: [${u[r].l}, ${u[r].r}] → ${p[r]}`:`Q${u[r].idx}: [${u[r].l}, ${u[r].r}]`,index:r,state:r===e?"active":r<e?"visited":void 0});for(o.record("pick_query",`Process query Q${a}: find distinct elements in range [${t}, ${i}].`);d<i;)m(++d),o.update_variable("currentR",d),o.update_variable("distinct",f),o.update_visual("range_window",{type:"range",start:c,end:d,label:"window",state:"active"}),o.record("expand_right",`Expand right: add arr[${d}] = ${r[d]}. Window = [${c}, ${d}], distinct = ${f}.`);for(;d>i;)g(d),d--,o.update_variable("currentR",d),o.update_variable("distinct",f),o.update_visual("range_window",{type:"range",start:c,end:d,label:"window",state:"active"}),o.record("shrink_right",`Shrink right: remove arr[${d+1}] = ${r[d+1]}. Window = [${c}, ${d}], distinct = ${f}.`);for(;c>t;)m(--c),o.update_variable("currentL",c),o.update_variable("distinct",f),o.update_visual("range_window",{type:"range",start:c,end:d,label:"window",state:"active"}),o.record("expand_left",`Expand left: add arr[${c}] = ${r[c]}. Window = [${c}, ${d}], distinct = ${f}.`);for(;c<t;)g(c),c++,o.update_variable("currentL",c),o.update_variable("distinct",f),o.update_visual("range_window",{type:"range",start:c,end:d,label:"window",state:"active"}),o.record("shrink_left",`Shrink left: remove arr[${c-1}] = ${r[c-1]}. Window = [${c}, ${d}], distinct = ${f}.`);for(let e=0;e<n;e++)e>=c&&e<=d?o.update_visual(`bar_${e}`,{type:"arrayElement",value:r[e],position:e,state:"active"}):o.update_visual(`bar_${e}`,{type:"arrayElement",value:r[e],position:e,state:"muted"});p[e]=f,o.update_visual(`query_${e}`,{type:"stateElement",value:`Q${a}: [${t}, ${i}] → ${f}`,index:e,state:"visited"}),o.record("answer_query",`Answer Q${a}: distinct elements in [${t}, ${i}] = ${f}.`)}for(let e=0;e<n;e++)o.update_visual(`bar_${e}`,{type:"arrayElement",value:r[e],position:e,state:"active"});o.delete_visual("range_window");for(let e=0;e<l;e++)o.update_visual(`query_${e}`,{type:"stateElement",value:`Q${u[e].idx}: [${u[e].l}, ${u[e].r}] → ${p[e]}`,index:e,state:"visited"});return o.record("complete",`Mo's Algorithm complete! All ${l} queries answered. Total complexity: O((N + Q) * sqrt(N)).`),o.getSteps()
}

export function MosAlgorithmProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MosAlgorithmTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMosAlgorithmSteps(e) as any[];
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
      title="Mo's Algorithm"
      slug="mos-algorithm"
      approaches={approaches}
      presets={MosAlgorithmPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
