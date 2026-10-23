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
    if (item.type === "arrayElement") {
      elements.push({
        value: item.value,
        position: item.position ?? 0,
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

// ==========================================
// Bubble Sort (bubble-sort)
// ==========================================

const BubbleSortTemplates = {
  "python": {
    "language": "python",
    "code": "def bubble_sort(arr):\n    n = len(arr)\n\n    for i in range(n - 1):\n        swapped = False\n\n        for j in range(n - 1 - i):\n            if arr[j] > arr[j + 1]:\n                # Swap elements\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n\n        # Early exit if no swaps\n        if not swapped:\n            break\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        14
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void bubbleSort(int[] arr) {\n    int n = arr.length;\n\n    for (int i = 0; i < n - 1; i++) {\n        boolean swapped = false;\n\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n\n        // Early exit if no swaps\n        if (!swapped) {\n            break;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11,
        12,
        13
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        18
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void bubbleSort(vector<int>& arr) {\n    int n = arr.size();\n\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n\n        // Early exit if no swaps\n        if (!swapped) {\n            break;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11,
        12,
        13
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        18
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void BubbleSort(int[] arr) {\n    int n = arr.Length;\n\n    for (int i = 0; i < n - 1; i++) {\n        bool swapped = false;\n\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                int temp = arr[j];\n                arr[j] = arr[j + 1];\n                arr[j + 1] = temp;\n                swapped = true;\n            }\n        }\n\n        // Early exit if no swaps\n        if (!swapped) {\n            break;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11,
        12,
        13
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        18
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func bubbleSort(arr []int) {\n    n := len(arr)\n\n    for i := 0; i < n - 1; i++ {\n        swapped := false\n\n        for j := 0; j < n - 1 - i; j++ {\n            if arr[j] > arr[j + 1] {\n                // Swap elements\n                temp := arr[j]\n                arr[j] = arr[j + 1]\n                arr[j + 1] = temp\n                swapped = true\n            }\n        }\n\n        // Early exit if no swaps\n        if !swapped {\n            break\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11,
        12,
        13
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function bubbleSort(arr) {\n    const n = arr.length;\n\n    for (let i = 0; i < n - 1; i++) {\n        let swapped = false;\n\n        for (let j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n                swapped = true;\n            }\n        }\n\n        // Early exit if no swaps\n        if (!swapped) {\n            break;\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function bubbleSort(arr: number[]): number[] {\n    const n = arr.length;\n\n    for (let i = 0; i < n - 1; i++) {\n        let swapped = false;\n\n        for (let j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1]) {\n                // Swap elements\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n                swapped = true;\n            }\n        }\n\n        // Early exit if no swaps\n        if (!swapped) {\n            break;\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "compare": [
        7,
        8
      ],
      "swap": [
        10,
        11
      ],
      "no_swap": [
        7
      ],
      "pass_complete": [
        4
      ],
      "early_exit": [
        16
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "early_exit": [
        16
      ]
    }
  }
};

const BubbleSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        64,
        34,
        25,
        12,
        22,
        11,
        90
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20,
        10
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        10,
        30,
        20,
        40,
        50
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateBubbleSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],a=t.length,l=t.reduce((e,t,a)=>(e[`bar_${a}`]={type:"arrayElement",value:t,position:a},e),{}),i=t.map((e,t)=>t),n=[...t],s=a,o=new StepRecorder({arr:t,n:a,i:void 0,j:void 0,swapped:void 0,leftVal:void 0,rightVal:void 0,settledVal:void 0,settledIdx:void 0},{...l});if(o.record("-","Start: Sort the array in ascending order with bubble sort"),a<=1)return 1===a&&(o.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),o.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),o.record("complete","Array is already sorted"),o.getSteps();let p=e=>e>=s?"sorted":void 0;for(let e=0;e<a-1;e++){o.update_variable("i",e);let r=!1;o.update_variable("swapped",r),o.record("outer_loop",`Pass ${e+1}: bubble the largest unsorted value to index ${a-1-e}`);for(let l=0;l<a-1-e;l++){o.update_variable("j",l),o.update_variable("leftVal",n[l]),o.update_variable("rightVal",n[l+1]),o.update_visual("ptr_j",{type:"pointer",position:l,label:"j"}),o.update_visual("ptr_j_next",{type:"pointer",position:l+1,label:"j+1"});let e=i.indexOf(l),a=i.indexOf(l+1);if(o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[l],position:l,state:"comparing"}),o.update_visual(`bar_${a}`,{type:"arrayElement",value:n[l+1],position:l+1,state:"comparing"}),o.add_conditional("compare",n[l]>n[l+1]),o.record("compare",`Compare arr[${l}] = ${n[l]} with arr[${l+1}] = ${n[l+1]}`),n[l]>n[l+1]){let s=n[l],p=n[l+1];[t[l],t[l+1]]=[t[l+1],t[l]],[n[l],n[l+1]]=[n[l+1],n[l]],[i[e],i[a]]=[l+1,l],o.update_variable("arr",[...t]),o.update_visual(`bar_${e}`,{type:"arrayElement",value:s,position:l+1,state:"swapping"}),o.update_visual(`bar_${a}`,{type:"arrayElement",value:p,position:l,state:"swapping"}),r=!0,o.update_variable("swapped",r),o.record("swap",`${s} > ${p}: swap them and set swapped = true`)}else o.record("no_swap",`${n[l]} ≤ ${n[l+1]}: already in order, no swap`);let s=i.indexOf(l),d=i.indexOf(l+1);o.update_visual(`bar_${s}`,{type:"arrayElement",value:n[l],position:l,state:p(l)}),o.update_visual(`bar_${d}`,{type:"arrayElement",value:n[l+1],position:l+1,state:p(l+1)})}o.delete_visual("ptr_j"),o.delete_visual("ptr_j_next"),s=a-1-e;let l=i.indexOf(a-1-e);if(o.update_visual(`bar_${l}`,{type:"arrayElement",value:n[a-1-e],position:a-1-e,state:"sorted"}),o.update_visual("range_sorted",{type:"range",start:a-1-e,end:a-1,label:"sorted",state:"sorted"}),o.update_variable("settledVal",n[a-1-e]),o.update_variable("settledIdx",a-1-e),o.add_conditional("early_exit",!r),!r){s=0;for(let t=0;t<a-1-e;t++){let e=i.indexOf(t);o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[t],position:t,state:"sorted"})}o.update_visual("range_sorted",{type:"range",start:0,end:a-1,label:"sorted",state:"sorted"}),o.record("early_exit",`No swaps in pass ${e+1}: the array is already sorted`);break}o.record("pass_complete",`Pass ${e+1} complete: ${n[a-1-e]} is locked in at index ${a-1-e}`)}s=0;for(let e=0;e<a;e++){let t=i.indexOf(e);o.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"sorted"})}return o.update_visual("range_sorted",{type:"range",start:0,end:a-1,label:"sorted",state:"sorted"}),o.record("complete","Bubble sort complete: the array is sorted"),o.getSteps()
}

export function BubbleSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BubbleSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateBubbleSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Bubble Sort"
      slug="bubble-sort"
      approaches={approaches}
      presets={BubbleSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Selection Sort (selection-sort)
// ==========================================

const SelectionSortTemplates = {
  "python": {
    "language": "python",
    "code": "def selection_sort(arr):\n    n = len(arr)\n\n    for i in range(n - 1):\n        # Find minimum in unsorted portion\n        min_idx = i\n\n        for j in range(i + 1, n):\n            if arr[j] < arr[min_idx]:\n                min_idx = j\n\n        # Swap minimum with first unsorted element\n        if min_idx != i:\n            arr[i], arr[min_idx] = arr[min_idx], arr[i]\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        13
      ],
      "swap": [
        13,
        14
      ],
      "no_swap": [
        13
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "swap_check": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void selectionSort(int[] arr) {\n    int n = arr.length;\n\n    for (int i = 0; i < n - 1; i++) {\n        // Find minimum in unsorted portion\n        int minIdx = i;\n\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) {\n                minIdx = j;\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if (minIdx != i) {\n            int temp = arr[i];\n            arr[i] = arr[minIdx];\n            arr[minIdx] = temp;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        16,
        17,
        18
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void selectionSort(vector<int>& arr) {\n    int n = arr.size();\n\n    for (int i = 0; i < n - 1; i++) {\n        // Find minimum in unsorted portion\n        int minIdx = i;\n\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) {\n                minIdx = j;\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if (minIdx != i) {\n            int temp = arr[i];\n            arr[i] = arr[minIdx];\n            arr[minIdx] = temp;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        16,
        17,
        18
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void SelectionSort(int[] arr) {\n    int n = arr.Length;\n\n    for (int i = 0; i < n - 1; i++) {\n        // Find minimum in unsorted portion\n        int minIdx = i;\n\n        for (int j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) {\n                minIdx = j;\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if (minIdx != i) {\n            int temp = arr[i];\n            arr[i] = arr[minIdx];\n            arr[minIdx] = temp;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        16,
        17,
        18
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func selectionSort(arr []int) {\n    n := len(arr)\n\n    for i := 0; i < n - 1; i++ {\n        // Find minimum in unsorted portion\n        minIdx := i\n\n        for j := i + 1; j < n; j++ {\n            if arr[j] < arr[minIdx] {\n                minIdx = j\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if minIdx != i {\n            temp := arr[i]\n            arr[i] = arr[minIdx]\n            arr[minIdx] = temp\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        16,
        17,
        18
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function selectionSort(arr) {\n    const n = arr.length;\n\n    for (let i = 0; i < n - 1; i++) {\n        // Find minimum in unsorted portion\n        let minIdx = i;\n\n        for (let j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) {\n                minIdx = j;\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if (minIdx !== i) {\n            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        15,
        16
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function selectionSort(arr: number[]): number[] {\n    const n = arr.length;\n\n    for (let i = 0; i < n - 1; i++) {\n        // Find minimum in unsorted portion\n        let minIdx = i;\n\n        for (let j = i + 1; j < n; j++) {\n            if (arr[j] < arr[minIdx]) {\n                minIdx = j;\n            }\n        }\n\n        // Swap minimum with first unsorted element\n        if (minIdx !== i) {\n            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "assume_min": [
        6
      ],
      "compare": [
        8,
        9
      ],
      "new_min": [
        9,
        10
      ],
      "keep_min": [
        8
      ],
      "check_swap": [
        15
      ],
      "swap": [
        15,
        16
      ],
      "no_swap": [
        15
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "compare": [
        9
      ],
      "swap_check": [
        15
      ]
    }
  }
};

const SelectionSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Random Array",
    "value": {
      "arr": [
        29,
        10,
        14,
        37,
        13,
        8
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        90,
        80,
        70,
        60,
        50,
        40,
        30
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        10,
        30,
        20,
        40,
        50
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        5,
        5,
        5,
        5
      ]
    }
  }
];

function generateSelectionSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],i=t.length,r=t.reduce((e,t,i)=>(e[`bar_${i}`]={type:"arrayElement",value:t,position:i},e),{}),a=t.map((e,t)=>t),l=[...t],s=new StepRecorder({arr:t,n:i,i:void 0,j:void 0,min_idx:void 0,minVal:void 0,leftVal:void 0,rightVal:void 0,displacedVal:void 0,settledVal:void 0,settledIdx:void 0},{...r});if(s.record("-","Start: sort the array in ascending order with selection sort"),i<=1)return 1===i&&(s.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),s.record("complete","Array is already sorted"),s.getSteps();for(let e=0;e<i-1;e++){s.update_variable("i",e),s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.record("outer_loop",`Pass ${e+1}: find the minimum in arr[${e}..${i-1}]`);let n=e;s.update_variable("min_idx",n),s.update_variable("minVal",l[n]);let r=a.indexOf(e);s.update_visual(`bar_${r}`,{type:"arrayElement",value:l[e],position:e,state:"minimum"}),s.update_visual("ptr_min",{type:"pointer",position:n,label:"min"}),s.record("assume_min",`Assume arr[${e}] = ${l[e]} is the minimum`);for(let t=e+1;t<i;t++){s.update_variable("j",t),s.update_variable("leftVal",l[t]),s.update_variable("rightVal",l[n]),s.update_visual("ptr_j",{type:"pointer",position:t,label:"j"});let e=a.indexOf(t);if(s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[t],position:t,state:"comparing"}),s.add_conditional("compare",l[t]<l[n]),s.record("compare",`Compare arr[${t}] = ${l[t]} with the current minimum ${l[n]}`),l[t]<l[n]){let i=l[n],r=a.indexOf(n);s.update_visual(`bar_${r}`,{type:"arrayElement",value:l[n],position:n}),n=t,s.update_variable("min_idx",n),s.update_variable("minVal",l[n]),s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[t],position:t,state:"minimum"}),s.update_visual("ptr_min",{type:"pointer",position:n,label:"min"}),s.record("new_min",`${l[t]} < ${i}: new minimum at index ${t}`)}else s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[t],position:t}),s.record("keep_min",`${l[t]} is not smaller: keep minimum ${l[n]}`)}if(s.delete_visual("ptr_j"),s.add_conditional("swap_check",n!==e),s.record("check_swap",`Scan done: minimum ${l[n]} is at index ${n}, i = ${e}`),n!==e){let i=l[e];s.update_variable("displacedVal",i),[t[e],t[n]]=[t[n],t[e]],[l[e],l[n]]=[l[n],l[e]];let r=a.indexOf(e),o=a.indexOf(n);[a[r],a[o]]=[n,e],s.update_variable("arr",[...t]),s.update_visual(`bar_${r}`,{type:"arrayElement",value:i,position:n,state:"swapping"}),s.update_visual(`bar_${o}`,{type:"arrayElement",value:l[e],position:e,state:"swapping"}),s.record("swap",`Swap: minimum ${l[e]} moves to index ${e}`),s.update_visual(`bar_${r}`,{type:"arrayElement",value:i,position:n})}else s.record("no_swap",`Minimum is already at index ${e}: no swap needed`);let o=a.indexOf(e);s.update_visual(`bar_${o}`,{type:"arrayElement",value:l[e],position:e,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:e,label:"sorted",state:"sorted"}),s.update_variable("settledVal",l[e]),s.update_variable("settledIdx",e),s.delete_visual("ptr_i"),s.delete_visual("ptr_min"),s.record("pass_complete",`Pass ${e+1} complete: ${l[e]} is locked in at index ${e}`)}let o=a.indexOf(i-1);return s.update_visual(`bar_${o}`,{type:"arrayElement",value:l[i-1],position:i-1,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:i-1,label:"sorted",state:"sorted"}),s.record("complete","Selection sort complete: the array is sorted"),s.getSteps()
}

export function SelectionSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SelectionSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateSelectionSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Selection Sort"
      slug="selection-sort"
      approaches={approaches}
      presets={SelectionSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Insertion Sort (insertion-sort)
// ==========================================

const InsertionSortTemplates = {
  "python": {
    "language": "python",
    "code": "def insertion_sort(arr):\n    n = len(arr)\n\n    for i in range(1, n):\n        key = arr[i]\n        j = i - 1\n\n        while j >= 0 and arr[j] > key:\n            arr[j + 1] = arr[j]\n            j -= 1\n\n        # Insert key at the correct position\n        arr[j + 1] = key\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        13
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void insertionSort(int[] arr) {\n    int n = arr.length;\n\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void insertionSort(vector<int>& arr) {\n    int n = arr.size();\n\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void InsertionSort(int[] arr) {\n    int n = arr.Length;\n\n    for (int i = 1; i < n; i++) {\n        int key = arr[i];\n        int j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func insertionSort(arr []int) {\n    n := len(arr)\n\n    for i := 1; i < n; i++ {\n        key := arr[i]\n        j := i - 1\n\n        for j >= 0 && arr[j] > key {\n            arr[j + 1] = arr[j]\n            j--\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function insertionSort(arr) {\n    const n = arr.length;\n\n    for (let i = 1; i < n; i++) {\n        let key = arr[i];\n        let j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function insertionSort(arr: number[]): number[] {\n    const n = arr.length;\n\n    for (let i = 1; i < n; i++) {\n        let key = arr[i];\n        let j = i - 1;\n\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n\n        // Insert key at the correct position\n        arr[j + 1] = key;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "outer_loop": [
        4
      ],
      "pick_key": [
        5,
        6
      ],
      "compare": [
        8
      ],
      "shift": [
        9
      ],
      "decrement_j": [
        10
      ],
      "stop_shift": [
        8
      ],
      "insert": [
        14
      ],
      "pass_complete": [
        4
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "compare": [
        8
      ],
      "stop_shift": [
        8
      ]
    }
  }
};

const InsertionSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Random Array",
    "value": {
      "arr": [
        31,
        20,
        59,
        26,
        41,
        10
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        90,
        80,
        70,
        60,
        50,
        40,
        30
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Equal",
    "value": {
      "arr": [
        7,
        7,
        7,
        7
      ]
    }
  }
];

function generateInsertionSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],r=t.length,n=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),a=t.map((e,t)=>t),l=[...t],s=new StepRecorder({arr:t,n:r,i:void 0,j:void 0,key:void 0,cmpVal:void 0,gapIdx:void 0,sortedCount:void 0},{...n});if(s.record("-","Start: sort the array in ascending order with insertion sort"),r<=1)return 1===r&&(s.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),s.record("complete","Array is already sorted"),s.getSteps();let o=a.indexOf(0);s.update_visual(`bar_${o}`,{type:"arrayElement",value:l[0],position:0,state:"sorted"});for(let e=1;e<r;e++){s.update_variable("i",e),s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.update_visual("range_sorted",{type:"range",start:0,end:e-1,label:"sorted",state:"sorted"}),s.record("outer_loop",`Pass ${e}: insert arr[${e}] into the sorted prefix arr[0..${e-1}]`);let r=l[e];s.update_variable("key",r);let i=e-1;s.update_variable("j",i),s.update_visual("ptr_j",{type:"pointer",position:i,label:"j"});let n=a.indexOf(e);for(s.update_visual(`bar_${n}`,{type:"arrayElement",value:r,position:e,state:"key"}),s.record("pick_key",`Lift key = arr[${e}] = ${r} out of the row, j = ${i}`);i>=0&&l[i]>r;){s.update_variable("cmpVal",l[i]);let e=a.indexOf(i);s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[i],position:i,state:"comparing"}),s.add_conditional("compare",!0),s.record("compare",`Compare arr[${i}] = ${l[i]} with key = ${r}`),t[i+1]=t[i],l[i+1]=l[i],a[e]=i+1,s.update_variable("arr",[...t]),s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[i+1],position:i+1,state:"shifting"}),s.update_visual(`bar_${n}`,{type:"arrayElement",value:r,position:i,state:"key"}),s.record("shift",`${l[i+1]} > ${r}: shift it right to index ${i+1}`),s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[i+1],position:i+1,state:"sorted"}),i--,s.update_variable("j",i),i>=0?s.update_visual("ptr_j",{type:"pointer",position:i,label:"j"}):s.delete_visual("ptr_j"),s.record("decrement_j",`Move left: j = ${i}`)}let o=i+1;if(s.update_variable("gapIdx",o),i>=0){s.update_variable("cmpVal",l[i]);let e=a.indexOf(i);s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[i],position:i,state:"comparing"}),s.add_conditional("compare",!1),s.record("compare",`Compare arr[${i}] = ${l[i]} with key = ${r}`),s.add_conditional("stop_shift",!1),s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[i],position:i,state:"sorted"}),s.record("stop_shift",`${l[i]} ≤ ${r}: stop, the gap is at index ${o}`)}else s.add_conditional("stop_shift",!1),s.record("stop_shift","Reached the front of the array: the gap is at index 0");t[o]=r,l[o]=r,a[n]=o,s.update_variable("arr",[...t]),s.update_visual(`bar_${n}`,{type:"arrayElement",value:r,position:o,state:"inserting"}),s.record("insert",`Drop key ${r} into the gap at index ${o}`);for(let t=0;t<=e;t++){let e=a.indexOf(t);s.update_visual(`bar_${e}`,{type:"arrayElement",value:l[t],position:t,state:"sorted"})}s.update_visual("range_sorted",{type:"range",start:0,end:e,label:"sorted",state:"sorted"}),s.update_variable("sortedCount",e+1),s.delete_visual("ptr_i"),s.delete_visual("ptr_j"),s.record("pass_complete",`Pass ${e} complete: the first ${e+1} elements are sorted`)}return s.update_visual("range_sorted",{type:"range",start:0,end:r-1,label:"sorted",state:"sorted"}),s.record("complete","Insertion sort complete: the array is sorted"),s.getSteps()
}

export function InsertionSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InsertionSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateInsertionSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Insertion Sort"
      slug="insertion-sort"
      approaches={approaches}
      presets={InsertionSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Shell Sort (shell-sort)
// ==========================================

const ShellSortTemplates = {
  "python": {
    "language": "python",
    "code": "def shell_sort(arr):\n    n = len(arr)\n    gap = n // 2\n\n    while gap > 0:\n        # Insertion sort elements gap apart\n        for i in range(gap, n):\n            key = arr[i]\n            j = i\n\n            while j >= gap and arr[j - gap] > key:\n                arr[j] = arr[j - gap]\n                j -= gap\n\n            arr[j] = key\n\n        gap //= 2\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        15
      ],
      "gap_pass_complete": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void shellSort(int[] arr) {\n    int n = arr.length;\n    int gap = n / 2;\n\n    while (gap > 0) {\n        // Insertion sort elements gap apart\n        for (int i = gap; i < n; i++) {\n            int key = arr[i];\n            int j = i;\n\n            while (j >= gap && arr[j - gap] > key) {\n                arr[j] = arr[j - gap];\n                j -= gap;\n            }\n\n            arr[j] = key;\n        }\n\n        gap /= 2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void shellSort(vector<int>& arr) {\n    int n = arr.size();\n    int gap = n / 2;\n\n    while (gap > 0) {\n        // Insertion sort elements gap apart\n        for (int i = gap; i < n; i++) {\n            int key = arr[i];\n            int j = i;\n\n            while (j >= gap && arr[j - gap] > key) {\n                arr[j] = arr[j - gap];\n                j -= gap;\n            }\n\n            arr[j] = key;\n        }\n\n        gap /= 2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void ShellSort(int[] arr) {\n    int n = arr.Length;\n    int gap = n / 2;\n\n    while (gap > 0) {\n        // Insertion sort elements gap apart\n        for (int i = gap; i < n; i++) {\n            int key = arr[i];\n            int j = i;\n\n            while (j >= gap && arr[j - gap] > key) {\n                arr[j] = arr[j - gap];\n                j -= gap;\n            }\n\n            arr[j] = key;\n        }\n\n        gap /= 2;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func shellSort(arr []int) {\n    n := len(arr)\n    gap := n / 2\n\n    for gap > 0 {\n        // Insertion sort elements gap apart\n        for i := gap; i < n; i++ {\n            key := arr[i]\n            j := i\n\n            for j >= gap && arr[j-gap] > key {\n                arr[j] = arr[j-gap]\n                j -= gap\n            }\n\n            arr[j] = key\n        }\n\n        gap /= 2\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function shellSort(arr) {\n    const n = arr.length;\n    let gap = Math.floor(n / 2);\n\n    while (gap > 0) {\n        // Insertion sort elements gap apart\n        for (let i = gap; i < n; i++) {\n            const key = arr[i];\n            let j = i;\n\n            while (j >= gap && arr[j - gap] > key) {\n                arr[j] = arr[j - gap];\n                j -= gap;\n            }\n\n            arr[j] = key;\n        }\n\n        gap = Math.floor(gap / 2);\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function shellSort(arr: number[]): number[] {\n    const n = arr.length;\n    let gap = Math.floor(n / 2);\n\n    while (gap > 0) {\n        // Insertion sort elements gap apart\n        for (let i = gap; i < n; i++) {\n            const key = arr[i];\n            let j = i;\n\n            while (j >= gap && arr[j - gap] > key) {\n                arr[j] = arr[j - gap];\n                j -= gap;\n            }\n\n            arr[j] = key;\n        }\n\n        gap = Math.floor(gap / 2);\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_gap": [
        3
      ],
      "gap_pass": [
        5
      ],
      "pick_key": [
        8,
        9
      ],
      "compare": [
        11
      ],
      "shift": [
        12
      ],
      "decrement_j": [
        13
      ],
      "insert": [
        16
      ],
      "gap_pass_complete": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "compare": [
        11
      ]
    }
  }
};

const ShellSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        23,
        12,
        42,
        4,
        9,
        30,
        5,
        17
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        10,
        30,
        20,
        50,
        40
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateShellSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],a=t.length,i=t.reduce((e,t,a)=>(e[`bar_${a}`]={type:"arrayElement",value:t,position:a},e),{}),l=t.map((e,t)=>t),n=[...t],s=new StepRecorder({arr:t,n:a,gap:void 0,i:void 0,j:void 0,key:void 0,cmpVal:void 0,prevGap:void 0},{...i});if(s.record("-","Start: sort the array in ascending order with shell sort"),a<=1)return 1===a&&(s.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),s.record("complete","Array is already sorted"),s.getSteps();let o=Math.floor(a/2);for(s.update_variable("gap",o),s.record("init_gap",`Start with gap = ${a} / 2 = ${o}`);o>0;){s.record("gap_pass",`Gap ${o}: insertion sort the elements that are ${o} apart`);for(let e=o;e<a;e++){s.update_variable("i",e);let a=n[e];s.update_variable("key",a);let r=e;s.update_variable("j",r),s.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),s.update_visual("ptr_j",{type:"pointer",position:r,label:"j"});let i=l.indexOf(e);for(s.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:e,state:"key"}),s.record("pick_key",`Lift key = arr[${e}] = ${a}, compare it with arr[${e-o}]`);r>=o&&n[r-o]>a;){s.update_variable("cmpVal",n[r-o]);let e=l.indexOf(r-o);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r-o],position:r-o,state:"comparing"}),s.add_conditional("compare",!0),s.record("compare",`Compare arr[${r-o}] = ${n[r-o]} with key = ${a}`),t[r]=t[r-o],n[r]=n[r-o],l[e]=r,s.update_variable("arr",[...t]),s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r],position:r,state:"shifting"}),s.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:r-o,state:"key"}),s.record("shift",`${n[r]} > ${a}: shift it ${o} slot${o>1?"s":""} right to index ${r}`),s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r],position:r}),r-=o,s.update_variable("j",r),s.update_visual("ptr_j",{type:"pointer",position:r,label:"j"}),s.record("decrement_j",`Jump ${o} left: j = ${r}`)}if(r>=o){s.update_variable("cmpVal",n[r-o]);let e=l.indexOf(r-o);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r-o],position:r-o,state:"comparing"}),s.add_conditional("compare",!1),s.record("compare",`Compare arr[${r-o}] = ${n[r-o]} with key = ${a}`),s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r-o],position:r-o})}t[r]=a,n[r]=a,l[i]=r,s.update_variable("arr",[...t]),s.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:r,state:"inserting"}),s.record("insert",`Drop key ${a} into index ${r}`),s.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:r})}s.delete_visual("ptr_i"),s.delete_visual("ptr_j");let e=o;o=Math.floor(o/2),s.update_variable("prevGap",e),s.update_variable("gap",o),s.record("gap_pass_complete",o>0?`Gap ${e} pass complete: shrink the gap to ${o}`:"Gap 1 pass complete: the array is fully sorted")}for(let e=0;e<a;e++){let t=l.indexOf(e);s.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"sorted"})}return s.update_visual("range_sorted",{type:"range",start:0,end:a-1,label:"sorted",state:"sorted"}),s.record("complete","Shell sort complete: the array is sorted"),s.getSteps()
}

export function ShellSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ShellSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateShellSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Shell Sort"
      slug="shell-sort"
      approaches={approaches}
      presets={ShellSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Merge Sort (merge-sort)
// ==========================================

const MergeSortTemplates = {
  "python": {
    "language": "python",
    "code": "def merge_sort(arr):\n    n = len(arr)\n    width = 1\n\n    while width < n:\n        for left in range(0, n, 2 * width):\n            mid = min(left + width, n)\n            right = min(left + 2 * width, n)\n            merge(arr, left, mid, right)\n        width *= 2\n\n    return arr\n\ndef merge(arr, left, mid, right):\n    temp = []\n    i, j = left, mid\n\n    while i < mid and j < right:\n        if arr[i] <= arr[j]:\n            temp.append(arr[i])\n            i += 1\n        else:\n            temp.append(arr[j])\n            j += 1\n\n    while i < mid:\n        temp.append(arr[i])\n        i += 1\n\n    while j < right:\n        temp.append(arr[j])\n        j += 1\n\n    for k, val in enumerate(temp):\n        arr[left + k] = val",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        18,
        19
      ],
      "pick_left": [
        20,
        21
      ],
      "pick_right": [
        23,
        24
      ],
      "copy_remaining": [
        26,
        27,
        28,
        30,
        31,
        32
      ],
      "merge_complete": [
        34,
        35
      ],
      "double_width": [
        10
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "compare": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void mergeSort(int[] arr) {\n    int n = arr.length;\n    int width = 1;\n\n    while (width < n) {\n        for (int left = 0; left < n; left += 2 * width) {\n            int mid = Math.min(left + width, n);\n            int right = Math.min(left + 2 * width, n);\n            merge(arr, left, mid, right);\n        }\n        width *= 2;\n    }\n}\n\nprivate void merge(int[] arr, int left, int mid, int right) {\n    int[] temp = new int[right - left];\n    int i = left, j = mid, k = 0;\n\n    while (i < mid && j < right) {\n        if (arr[i] <= arr[j]) {\n            temp[k++] = arr[i++];\n        } else {\n            temp[k++] = arr[j++];\n        }\n    }\n\n    while (i < mid) {\n        temp[k++] = arr[i++];\n    }\n\n    while (j < right) {\n        temp[k++] = arr[j++];\n    }\n\n    for (k = 0; k < temp.length; k++) {\n        arr[left + k] = temp[k];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        19,
        20
      ],
      "pick_left": [
        21
      ],
      "pick_right": [
        23
      ],
      "copy_remaining": [
        27,
        28,
        31,
        32
      ],
      "merge_complete": [
        35,
        36
      ],
      "double_width": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "compare": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void mergeSort(vector<int>& arr) {\n    int n = arr.size();\n    int width = 1;\n\n    while (width < n) {\n        for (int left = 0; left < n; left += 2 * width) {\n            int mid = min(left + width, n);\n            int right = min(left + 2 * width, n);\n            merge(arr, left, mid, right);\n        }\n        width *= 2;\n    }\n}\n\nvoid merge(vector<int>& arr, int left, int mid, int right) {\n    vector<int> temp;\n    int i = left, j = mid;\n\n    while (i < mid && j < right) {\n        if (arr[i] <= arr[j]) {\n            temp.push_back(arr[i++]);\n        } else {\n            temp.push_back(arr[j++]);\n        }\n    }\n\n    while (i < mid) {\n        temp.push_back(arr[i++]);\n    }\n\n    while (j < right) {\n        temp.push_back(arr[j++]);\n    }\n\n    for (int k = 0; k < temp.size(); k++) {\n        arr[left + k] = temp[k];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        19,
        20
      ],
      "pick_left": [
        21
      ],
      "pick_right": [
        23
      ],
      "copy_remaining": [
        27,
        28,
        31,
        32
      ],
      "merge_complete": [
        35,
        36
      ],
      "double_width": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "compare": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void MergeSort(int[] arr) {\n    int n = arr.Length;\n    int width = 1;\n\n    while (width < n) {\n        for (int left = 0; left < n; left += 2 * width) {\n            int mid = Math.Min(left + width, n);\n            int right = Math.Min(left + 2 * width, n);\n            Merge(arr, left, mid, right);\n        }\n        width *= 2;\n    }\n}\n\nprivate void Merge(int[] arr, int left, int mid, int right) {\n    int[] temp = new int[right - left];\n    int i = left, j = mid, k = 0;\n\n    while (i < mid && j < right) {\n        if (arr[i] <= arr[j]) {\n            temp[k++] = arr[i++];\n        } else {\n            temp[k++] = arr[j++];\n        }\n    }\n\n    while (i < mid) {\n        temp[k++] = arr[i++];\n    }\n\n    while (j < right) {\n        temp[k++] = arr[j++];\n    }\n\n    for (k = 0; k < temp.Length; k++) {\n        arr[left + k] = temp[k];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        19,
        20
      ],
      "pick_left": [
        21
      ],
      "pick_right": [
        23
      ],
      "copy_remaining": [
        27,
        28,
        31,
        32
      ],
      "merge_complete": [
        35,
        36
      ],
      "double_width": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "compare": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mergeSort(arr []int) {\n    n := len(arr)\n    width := 1\n\n    for width < n {\n        for left := 0; left < n; left += 2 * width {\n            mid := min(left+width, n)\n            right := min(left+2*width, n)\n            merge(arr, left, mid, right)\n        }\n        width *= 2\n    }\n}\n\nfunc merge(arr []int, left, mid, right int) {\n    temp := make([]int, 0, right-left)\n    i, j := left, mid\n\n    for i < mid && j < right {\n        if arr[i] <= arr[j] {\n            temp = append(temp, arr[i])\n            i++\n        } else {\n            temp = append(temp, arr[j])\n            j++\n        }\n    }\n\n    for i < mid {\n        temp = append(temp, arr[i])\n        i++\n    }\n\n    for j < right {\n        temp = append(temp, arr[j])\n        j++\n    }\n\n    for k, val := range temp {\n        arr[left+k] = val\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        19,
        20
      ],
      "pick_left": [
        21,
        22
      ],
      "pick_right": [
        24,
        25
      ],
      "copy_remaining": [
        29,
        30,
        31,
        34,
        35,
        36
      ],
      "merge_complete": [
        39,
        40
      ],
      "double_width": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "compare": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function mergeSort(arr) {\n    const n = arr.length;\n    let width = 1;\n\n    while (width < n) {\n        for (let left = 0; left < n; left += 2 * width) {\n            const mid = Math.min(left + width, n);\n            const right = Math.min(left + 2 * width, n);\n            merge(arr, left, mid, right);\n        }\n        width *= 2;\n    }\n\n    return arr;\n}\n\nfunction merge(arr, left, mid, right) {\n    const temp = [];\n    let i = left, j = mid;\n\n    while (i < mid && j < right) {\n        if (arr[i] <= arr[j]) {\n            temp.push(arr[i++]);\n        } else {\n            temp.push(arr[j++]);\n        }\n    }\n\n    while (i < mid) {\n        temp.push(arr[i++]);\n    }\n\n    while (j < right) {\n        temp.push(arr[j++]);\n    }\n\n    for (let k = 0; k < temp.length; k++) {\n        arr[left + k] = temp[k];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        21,
        22
      ],
      "pick_left": [
        23
      ],
      "pick_right": [
        25
      ],
      "copy_remaining": [
        29,
        30,
        33,
        34
      ],
      "merge_complete": [
        37,
        38
      ],
      "double_width": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "compare": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mergeSort(arr: number[]): number[] {\n    const n = arr.length;\n    let width = 1;\n\n    while (width < n) {\n        for (let left = 0; left < n; left += 2 * width) {\n            const mid = Math.min(left + width, n);\n            const right = Math.min(left + 2 * width, n);\n            merge(arr, left, mid, right);\n        }\n        width *= 2;\n    }\n\n    return arr;\n}\n\nfunction merge(arr: number[], left: number, mid: number, right: number): void {\n    const temp: number[] = [];\n    let i = left, j = mid;\n\n    while (i < mid && j < right) {\n        if (arr[i] <= arr[j]) {\n            temp.push(arr[i++]);\n        } else {\n            temp.push(arr[j++]);\n        }\n    }\n\n    while (i < mid) {\n        temp.push(arr[i++]);\n    }\n\n    while (j < right) {\n        temp.push(arr[j++]);\n    }\n\n    for (let k = 0; k < temp.length; k++) {\n        arr[left + k] = temp[k];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_width": [
        3
      ],
      "merge_start": [
        6,
        7,
        8
      ],
      "compare": [
        21,
        22
      ],
      "pick_left": [
        23
      ],
      "pick_right": [
        25
      ],
      "copy_remaining": [
        29,
        30,
        33,
        34
      ],
      "merge_complete": [
        37,
        38
      ],
      "double_width": [
        11
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "compare": [
        22
      ]
    }
  }
};

const MergeSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        38,
        27,
        43,
        3,
        9,
        82,
        10
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
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
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        1,
        3,
        2,
        4,
        5
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateMergeSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],r=t.length,l=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),a=t.map((e,t)=>t),n=[...t],s=new RecursiveStepRecorder({arr:[...t],n:r,left:void 0,mid:void 0,right:void 0,depth:void 0,leftVal:void 0,rightVal:void 0,pickedVal:void 0,pickedSide:void 0,pickedBar:void 0},{...l});if(s.pushCallFrame({arr:"[...]"},"mergeSort"),s.record("-","Start: sort the array with recursive (top-down) merge sort"),r<=1)return 1===r&&(s.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),s.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),s.record("complete","Array is already sorted"),s.popCallFrame(),s.getSteps();let o=(e,t,r,i)=>{s.update_global_variable("left",e),s.update_global_variable("mid",t),s.update_global_variable("right",r),s.update_global_variable("depth",i)},d=(e,t,r)=>{s.update_visual("range_left",{type:"range",start:e,end:t,label:"left",state:"left"}),s.update_visual("range_right",{type:"range",start:t+1,end:r,label:"right",state:"right"});for(let r=e;r<=t;r++){let e=a.indexOf(r);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[r],position:r,state:"left"})}for(let e=t+1;e<=r;e++){let t=a.indexOf(e);s.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"right"})}},p=(e,r)=>{s.pushCallFrame({left:e,right:r},"sort");let i=s.getDepth()-1;if(o(e,void 0,r,i),e>=r){let t=a.indexOf(e);s.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"base"}),s.record("base_case",`arr[${e}] is a single element: already sorted`),s.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e}),s.popCallFrame();return}let l=e+Math.floor((r-e)/2);s.update_frame_variable("mid",l),o(e,l,r,i),d(e,l,r),s.record("calc_mid",`Split arr[${e}..${r}] at mid = ${l}`);for(let t=e;t<=r;t++){let e=a.indexOf(t);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[t],position:t})}s.delete_visual("range_left"),s.delete_visual("range_right"),s.record("recurse_left",`Recurse into the left half: sort(arr, ${e}, ${l})`),p(e,l),o(e,l,r,i),s.record("recurse_right",`Recurse into the right half: sort(arr, ${l+1}, ${r})`),p(l+1,r),o(e,l,r,i),d(e,l,r),s.record("merge_start",`Merge sorted runs arr[${e}..${l}] and arr[${l+1}..${r}]`);let c=n.slice(e,l+1),h=n.slice(l+1,r+1),m=c.map((t,r)=>a.indexOf(e+r)),f=h.map((e,t)=>a.indexOf(l+1+t)),u=0,g=0,x=0,_=(r,i,l,o,d)=>{n[e+x]=i,t[e+x]=i,a[l]=e+x,s.update_global_variable("pickedVal",i),s.update_global_variable("pickedSide",r),s.update_global_variable("pickedBar",`bar_${l}`),s.update_visual(`bar_${l}`,{type:"arrayElement",value:i,position:e+x,state:"left"===r?"temp_left":"temp_right"}),s.record(o,d),x++};for(;u<c.length&&g<h.length;){let t=c[u],r=h[g];s.update_global_variable("leftVal",t),s.update_global_variable("rightVal",r),s.update_visual("ptr_i",{type:"pointer",position:e+u,label:"i"}),s.update_visual("ptr_j",{type:"pointer",position:l+1+g,label:"j"}),s.update_visual(`bar_${m[u]}`,{type:"arrayElement",value:t,position:e+u,state:"cmp_left"}),s.update_visual(`bar_${f[g]}`,{type:"arrayElement",value:r,position:l+1+g,state:"cmp_right"}),s.add_conditional("compare",t<=r),s.record("compare",`Compare left ${t} with right ${r}`),t<=r?(_("left",t,m[u],"pick_left",`Take ${t} from the left run into temp[${x}]`),s.update_visual(`bar_${f[g]}`,{type:"arrayElement",value:r,position:l+1+g,state:"right"}),u++):(_("right",r,f[g],"pick_right",`Take ${r} from the right run into temp[${x}]`),s.update_visual(`bar_${m[u]}`,{type:"arrayElement",value:t,position:e+u,state:"left"}),g++)}for(u>=c.length?s.delete_visual("ptr_i"):s.delete_visual("ptr_j");u<c.length;)s.update_visual("ptr_i",{type:"pointer",position:e+u,label:"i"}),_("left",c[u],m[u],"copy_remaining",`Right run is empty: copy remaining ${c[u]} into temp[${x}]`),u++;for(;g<h.length;)s.update_visual("ptr_j",{type:"pointer",position:l+1+g,label:"j"}),_("right",h[g],f[g],"copy_remaining",`Left run is empty: copy remaining ${h[g]} into temp[${x}]`),g++;s.delete_visual("ptr_i"),s.delete_visual("ptr_j"),s.delete_visual("range_left"),s.delete_visual("range_right"),s.update_global_variable("arr",[...n]);for(let t=e;t<=r;t++){let e=a.indexOf(t);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[t],position:t,state:"merged"})}s.record("merge_complete",`arr[${e}..${r}] is now a single sorted run`);for(let t=e;t<=r;t++){let e=a.indexOf(t);s.update_visual(`bar_${e}`,{type:"arrayElement",value:n[t],position:t})}s.popCallFrame()};p(0,r-1),s.update_global_variable("arr",[...n]);for(let e=0;e<r;e++){let t=a.indexOf(e);s.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"sorted"})}return s.update_visual("range_sorted",{type:"range",start:0,end:r-1,label:"sorted",state:"sorted"}),s.record("complete","Merge sort complete: the array is sorted"),s.popCallFrame(),s.getSteps()
}

export function MergeSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MergeSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateMergeSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Merge Sort"
      slug="merge-sort"
      approaches={approaches}
      presets={MergeSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Quick Sort (quick-sort)
// ==========================================

const QuickSortTemplates = {
  "python": {
    "language": "python",
    "code": "def quick_sort(arr):\n    stack = [(0, len(arr) - 1)]\n\n    while stack:\n        low, high = stack.pop()\n\n        if low < high:\n            # Choose pivot (last element)\n            pivot = arr[high]\n            i = low - 1\n\n            # Partition\n            for j in range(low, high):\n                if arr[j] <= pivot:\n                    i += 1\n                    arr[i], arr[j] = arr[j], arr[i]\n\n            # Place pivot in correct position\n            arr[i + 1], arr[high] = arr[high], arr[i + 1]\n            pivot_idx = i + 1\n\n            # Push sub-arrays to stack\n            stack.append((pivot_idx + 1, high))\n            stack.append((low, pivot_idx - 1))\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        9
      ],
      "partition_start": [
        10
      ],
      "compare": [
        13,
        14
      ],
      "swap": [
        15,
        16
      ],
      "place_pivot": [
        19,
        20
      ],
      "recurse_right": [
        23
      ],
      "recurse_left": [
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "compare": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void quickSort(int[] arr) {\n    Stack<int[]> stack = new Stack<>();\n    stack.push(new int[]{0, arr.length - 1});\n\n    while (!stack.isEmpty()) {\n        int[] range = stack.pop();\n        int low = range[0], high = range[1];\n\n        if (low < high) {\n            // Choose pivot (last element)\n            int pivot = arr[high];\n            int i = low - 1;\n\n            // Partition\n            for (int j = low; j < high; j++) {\n                if (arr[j] <= pivot) {\n                    i++;\n                    int temp = arr[i];\n                    arr[i] = arr[j];\n                    arr[j] = temp;\n                }\n            }\n\n            // Place pivot in correct position\n            int temp = arr[i + 1];\n            arr[i + 1] = arr[high];\n            arr[high] = temp;\n            int pivotIdx = i + 1;\n\n            // Push sub-arrays to stack\n            stack.push(new int[]{pivotIdx + 1, high});\n            stack.push(new int[]{low, pivotIdx - 1});\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        11
      ],
      "partition_start": [
        12
      ],
      "compare": [
        15,
        16
      ],
      "swap": [
        17,
        18,
        19,
        20
      ],
      "place_pivot": [
        25,
        26,
        27
      ],
      "recurse_right": [
        31
      ],
      "recurse_left": [
        32
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "compare": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void quickSort(vector<int>& arr) {\n    stack<pair<int, int>> stk;\n    stk.push({0, arr.size() - 1});\n\n    while (!stk.empty()) {\n        auto [low, high] = stk.top();\n        stk.pop();\n\n        if (low < high) {\n            // Choose pivot (last element)\n            int pivot = arr[high];\n            int i = low - 1;\n\n            // Partition\n            for (int j = low; j < high; j++) {\n                if (arr[j] <= pivot) {\n                    i++;\n                    swap(arr[i], arr[j]);\n                }\n            }\n\n            // Place pivot in correct position\n            swap(arr[i + 1], arr[high]);\n            int pivotIdx = i + 1;\n\n            // Push sub-arrays to stack\n            stk.push({pivotIdx + 1, high});\n            stk.push({low, pivotIdx - 1});\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        11
      ],
      "partition_start": [
        12
      ],
      "compare": [
        15,
        16
      ],
      "swap": [
        17,
        18
      ],
      "place_pivot": [
        23
      ],
      "recurse_right": [
        27
      ],
      "recurse_left": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "compare": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void QuickSort(int[] arr) {\n    var stack = new Stack<(int, int)>();\n    stack.Push((0, arr.Length - 1));\n\n    while (stack.Count > 0) {\n        var (low, high) = stack.Pop();\n\n        if (low < high) {\n            // Choose pivot (last element)\n            int pivot = arr[high];\n            int i = low - 1;\n\n            // Partition\n            for (int j = low; j < high; j++) {\n                if (arr[j] <= pivot) {\n                    i++;\n                    (arr[i], arr[j]) = (arr[j], arr[i]);\n                }\n            }\n\n            // Place pivot in correct position\n            (arr[i + 1], arr[high]) = (arr[high], arr[i + 1]);\n            int pivotIdx = i + 1;\n\n            // Push sub-arrays to stack\n            stack.Push((pivotIdx + 1, high));\n            stack.Push((low, pivotIdx - 1));\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        10
      ],
      "partition_start": [
        11
      ],
      "compare": [
        14,
        15
      ],
      "swap": [
        16,
        17
      ],
      "place_pivot": [
        22
      ],
      "recurse_right": [
        26
      ],
      "recurse_left": [
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func quickSort(arr []int) {\n    type pair struct{ low, high int }\n    stack := []pair{{0, len(arr) - 1}}\n\n    for len(stack) > 0 {\n        p := stack[len(stack)-1]\n        stack = stack[:len(stack)-1]\n        low, high := p.low, p.high\n\n        if low < high {\n            // Choose pivot (last element)\n            pivot := arr[high]\n            i := low - 1\n\n            // Partition\n            for j := low; j < high; j++ {\n                if arr[j] <= pivot {\n                    i++\n                    arr[i], arr[j] = arr[j], arr[i]\n                }\n            }\n\n            // Place pivot in correct position\n            arr[i+1], arr[high] = arr[high], arr[i+1]\n            pivotIdx := i + 1\n\n            // Push sub-arrays to stack\n            stack = append(stack, pair{pivotIdx + 1, high})\n            stack = append(stack, pair{low, pivotIdx - 1})\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        12
      ],
      "partition_start": [
        13
      ],
      "compare": [
        16,
        17
      ],
      "swap": [
        18,
        19
      ],
      "place_pivot": [
        24
      ],
      "recurse_right": [
        28
      ],
      "recurse_left": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "compare": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function quickSort(arr) {\n    const stack = [[0, arr.length - 1]];\n\n    while (stack.length > 0) {\n        const [low, high] = stack.pop();\n\n        if (low < high) {\n            // Choose pivot (last element)\n            const pivot = arr[high];\n            let i = low - 1;\n\n            // Partition\n            for (let j = low; j < high; j++) {\n                if (arr[j] <= pivot) {\n                    i++;\n                    [arr[i], arr[j]] = [arr[j], arr[i]];\n                }\n            }\n\n            // Place pivot in correct position\n            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n            const pivotIdx = i + 1;\n\n            // Push sub-arrays to stack\n            stack.push([pivotIdx + 1, high]);\n            stack.push([low, pivotIdx - 1]);\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        9
      ],
      "partition_start": [
        10
      ],
      "compare": [
        13,
        14
      ],
      "swap": [
        15,
        16
      ],
      "place_pivot": [
        21
      ],
      "recurse_right": [
        25
      ],
      "recurse_left": [
        26
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "compare": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function quickSort(arr: number[]): number[] {\n    const stack: [number, number][] = [[0, arr.length - 1]];\n\n    while (stack.length > 0) {\n        const [low, high] = stack.pop()!;\n\n        if (low < high) {\n            // Choose pivot (last element)\n            const pivot = arr[high];\n            let i = low - 1;\n\n            // Partition\n            for (let j = low; j < high; j++) {\n                if (arr[j] <= pivot) {\n                    i++;\n                    [arr[i], arr[j]] = [arr[j], arr[i]];\n                }\n            }\n\n            // Place pivot in correct position\n            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];\n            const pivotIdx = i + 1;\n\n            // Push sub-arrays to stack\n            stack.push([pivotIdx + 1, high]);\n            stack.push([low, pivotIdx - 1]);\n        }\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "choose_pivot": [
        9
      ],
      "partition_start": [
        10
      ],
      "compare": [
        13,
        14
      ],
      "swap": [
        15,
        16
      ],
      "place_pivot": [
        21
      ],
      "recurse_right": [
        25
      ],
      "recurse_left": [
        26
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "compare": [
        14
      ]
    }
  }
};

const QuickSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        33,
        10,
        55,
        26,
        17,
        42,
        24
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        10,
        30,
        20,
        40,
        50
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateQuickSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],i=t.length,a=t.reduce((e,t,i)=>(e[`bar_${i}`]={type:"arrayElement",value:t,position:i},e),{}),l=t.map((e,t)=>t),n=[...t],o=new StepRecorder({arr:t,n:i,low:void 0,high:void 0,pivot:void 0,i:void 0,j:void 0,cmpVal:void 0,swapVal:void 0,didSwap:void 0,pivotIdx:void 0,pivotBar:void 0,single:void 0,pushLow:void 0,pushHigh:void 0},{...a});if(o.record("-","Start: sort the array with quick sort (Lomuto partition)"),i<=1)return 1===i&&(o.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),o.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),o.record("complete","Array is already sorted"),o.getSteps();let s=[[0,i-1]];for(;s.length>0;){let[e,i]=s.pop();if(e>i)continue;if(o.update_variable("low",e),o.update_variable("high",i),o.update_variable("single",e===i),e===i){o.update_variable("pivot",n[e]),o.update_variable("pivotIdx",e);let t=l.indexOf(e);o.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"sorted"}),o.record("place_pivot",`Single element at index ${e}: already in its final position`);continue}let r=n[i];o.update_variable("pivot",r);let a=l.indexOf(i);o.update_variable("pivotBar",`bar_${a}`),o.update_visual(`bar_${a}`,{type:"arrayElement",value:r,position:i,state:"pivot"}),o.record("choose_pivot",`Partition arr[${e}..${i}]: lift pivot arr[${i}] = ${r}`);let p=e-1;o.update_variable("i",p),o.record("partition_start",`i = ${p}: the ≤ pivot zone is empty`);for(let a=e;a<i;a++){o.update_variable("j",a),o.update_variable("cmpVal",n[a]),o.update_visual("ptr_j",{type:"pointer",position:a,label:"j"});let i=l.indexOf(a);if(o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[a],position:a,state:"comparing"}),o.add_conditional("compare",n[a]<=r),o.record("compare",`Compare arr[${a}] = ${n[a]} with pivot = ${r}`),n[a]<=r){p++,o.update_variable("i",p),o.update_visual("ptr_i",{type:"pointer",position:p,label:"i"});let s=p!==a;if(o.update_variable("didSwap",s),s){let s=n[p];o.update_variable("swapVal",s);let c=l.indexOf(p);[n[p],n[a]]=[n[a],n[p]],[t[p],t[a]]=[t[a],t[p]],[l[c],l[i]]=[a,p],o.update_variable("arr",[...t]),o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[p],position:p,state:"swapping"}),o.update_visual(`bar_${c}`,{type:"arrayElement",value:n[a],position:a,state:"swapping"}),o.update_visual("range_le",{type:"range",start:e,end:p,label:"≤ pivot",state:"left"}),o.record("swap",`${n[p]} ≤ ${r}: swap it into the ≤ zone at index ${p}`),o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[p],position:p}),o.update_visual(`bar_${c}`,{type:"arrayElement",value:n[a],position:a})}else o.update_visual("range_le",{type:"range",start:e,end:p,label:"≤ pivot",state:"left"}),o.record("swap",`${n[a]} ≤ ${r}: already at the zone boundary, i = ${p}`),o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[a],position:a})}else o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[a],position:a})}o.delete_visual("ptr_j"),o.delete_visual("ptr_i"),o.delete_visual("range_le");let c=p+1;if(o.update_variable("pivotIdx",c),c!==i){let e=l.indexOf(c),r=l.indexOf(i);[n[c],n[i]]=[n[i],n[c]],[t[c],t[i]]=[t[i],t[c]],[l[e],l[r]]=[i,c],o.update_variable("arr",[...t]),o.update_visual(`bar_${r}`,{type:"arrayElement",value:n[c],position:c,state:"sorted"}),o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[i],position:i})}else{let e=l.indexOf(i);o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[i],position:i,state:"sorted"})}o.record("place_pivot",`Pivot ${n[c]} is locked in at index ${c}`),c+1<=i&&(s.push([c+1,i]),o.update_variable("pushLow",c+1),o.update_variable("pushHigh",i),o.record("recurse_right",`Queue the right partition arr[${c+1}..${i}]`)),e<=c-1&&(s.push([e,c-1]),o.update_variable("pushLow",e),o.update_variable("pushHigh",c-1),o.record("recurse_left",`Queue the left partition arr[${e}..${c-1}]`))}for(let e=0;e<i;e++){let t=l.indexOf(e);o.update_visual(`bar_${t}`,{type:"arrayElement",value:n[e],position:e,state:"sorted"})}return o.update_visual("range_sorted",{type:"range",start:0,end:i-1,label:"sorted",state:"sorted"}),o.record("complete","Quick sort complete: the array is sorted"),o.getSteps()
}

export function QuickSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: QuickSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateQuickSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Quick Sort"
      slug="quick-sort"
      approaches={approaches}
      presets={QuickSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Bucket Sort (bucket-sort)
// ==========================================

const BucketSortTemplates = {
  "python": {
    "language": "python",
    "code": "def bucket_sort(arr):\n    n = len(arr)\n    min_val = min(arr)\n    max_val = max(arr)\n    k = max(1, n // 2)\n    bucket_size = max(1, (max_val - min_val) // k + 1)\n\n    # Create buckets\n    buckets = [[] for _ in range(k)]\n\n    # Distribute elements\n    for num in arr:\n        idx = min(k - 1, (num - min_val) // bucket_size)\n        buckets[idx].append(num)\n\n    # Sort each bucket (insertion sort)\n    result = []\n    for bucket in buckets:\n        for i in range(1, len(bucket)):\n            key = bucket[i]\n            j = i - 1\n            while j >= 0 and bucket[j] > key:\n                bucket[j + 1] = bucket[j]\n                j -= 1\n            bucket[j + 1] = key\n        result.extend(bucket)\n\n    # Copy back\n    for i in range(n):\n        arr[i] = result[i]\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        12,
        13,
        14
      ],
      "bucket_sort_start": [
        18
      ],
      "bucket_compare": [
        22
      ],
      "bucket_shift": [
        23,
        24
      ],
      "bucket_insert": [
        25
      ],
      "merge": [
        29,
        30
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        22
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void bucketSort(int[] arr) {\n    int n = arr.length;\n    int minVal = Arrays.stream(arr).min().getAsInt();\n    int maxVal = Arrays.stream(arr).max().getAsInt();\n    int k = Math.max(1, n / 2);\n    int bucketSize = Math.max(1, (maxVal - minVal) / k + 1);\n\n    // Create buckets\n    List<List<Integer>> buckets = new ArrayList<>();\n    for (int i = 0; i < k; i++) buckets.add(new ArrayList<>());\n\n    // Distribute elements\n    for (int num : arr) {\n        int idx = Math.min(k - 1, (num - minVal) / bucketSize);\n        buckets.get(idx).add(num);\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    int pos = 0;\n    for (List<Integer> bucket : buckets) {\n        for (int i = 1; i < bucket.size(); i++) {\n            int key = bucket.get(i);\n            int j = i - 1;\n            while (j >= 0 && bucket.get(j) > key) {\n                bucket.set(j + 1, bucket.get(j));\n                j--;\n            }\n            bucket.set(j + 1, key);\n        }\n        for (int val : bucket) arr[pos++] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        13,
        14,
        15
      ],
      "bucket_sort_start": [
        20
      ],
      "bucket_compare": [
        24
      ],
      "bucket_shift": [
        25,
        26
      ],
      "bucket_insert": [
        27
      ],
      "merge": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void bucketSort(vector<int>& arr) {\n    int n = arr.size();\n    int minVal = *min_element(arr.begin(), arr.end());\n    int maxVal = *max_element(arr.begin(), arr.end());\n    int k = max(1, n / 2);\n    int bucketSize = max(1, (maxVal - minVal) / k + 1);\n\n    // Create buckets\n    vector<vector<int>> buckets(k);\n\n    // Distribute elements\n    for (int num : arr) {\n        int idx = min(k - 1, (num - minVal) / bucketSize);\n        buckets[idx].push_back(num);\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    int pos = 0;\n    for (auto& bucket : buckets) {\n        for (int i = 1; i < (int)bucket.size(); i++) {\n            int key = bucket[i];\n            int j = i - 1;\n            while (j >= 0 && bucket[j] > key) {\n                bucket[j + 1] = bucket[j];\n                j--;\n            }\n            bucket[j + 1] = key;\n        }\n        for (int val : bucket) arr[pos++] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        12,
        13,
        14
      ],
      "bucket_sort_start": [
        19
      ],
      "bucket_compare": [
        23
      ],
      "bucket_shift": [
        24,
        25
      ],
      "bucket_insert": [
        26
      ],
      "merge": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void BucketSort(int[] arr) {\n    int n = arr.Length;\n    int minVal = arr.Min();\n    int maxVal = arr.Max();\n    int k = Math.Max(1, n / 2);\n    int bucketSize = Math.Max(1, (maxVal - minVal) / k + 1);\n\n    // Create buckets\n    var buckets = new List<List<int>>();\n    for (int i = 0; i < k; i++) buckets.Add(new List<int>());\n\n    // Distribute elements\n    foreach (int num in arr) {\n        int idx = Math.Min(k - 1, (num - minVal) / bucketSize);\n        buckets[idx].Add(num);\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    int pos = 0;\n    foreach (var bucket in buckets) {\n        for (int i = 1; i < bucket.Count; i++) {\n            int key = bucket[i];\n            int j = i - 1;\n            while (j >= 0 && bucket[j] > key) {\n                bucket[j + 1] = bucket[j];\n                j--;\n            }\n            bucket[j + 1] = key;\n        }\n        foreach (int val in bucket) arr[pos++] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        13,
        14,
        15
      ],
      "bucket_sort_start": [
        20
      ],
      "bucket_compare": [
        24
      ],
      "bucket_shift": [
        25,
        26
      ],
      "bucket_insert": [
        27
      ],
      "merge": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func bucketSort(arr []int) {\n    n := len(arr)\n    minVal, maxVal := arr[0], arr[0]\n    for _, v := range arr {\n        if v < minVal { minVal = v }\n        if v > maxVal { maxVal = v }\n    }\n    k := max(1, n/2)\n    bucketSize := max(1, (maxVal-minVal)/k+1)\n\n    // Create buckets\n    buckets := make([][]int, k)\n\n    // Distribute elements\n    for _, num := range arr {\n        idx := min(k-1, (num-minVal)/bucketSize)\n        buckets[idx] = append(buckets[idx], num)\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    pos := 0\n    for _, bucket := range buckets {\n        for i := 1; i < len(bucket); i++ {\n            key := bucket[i]\n            j := i - 1\n            for j >= 0 && bucket[j] > key {\n                bucket[j+1] = bucket[j]\n                j--\n            }\n            bucket[j+1] = key\n        }\n        for _, val := range bucket {\n            arr[pos] = val\n            pos++\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        15,
        16,
        17
      ],
      "bucket_sort_start": [
        22
      ],
      "bucket_compare": [
        26
      ],
      "bucket_shift": [
        27,
        28
      ],
      "bucket_insert": [
        29
      ],
      "merge": [
        31,
        32,
        33
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function bucketSort(arr) {\n    const n = arr.length;\n    const minVal = Math.min(...arr);\n    const maxVal = Math.max(...arr);\n    const k = Math.max(1, Math.floor(n / 2));\n    const bucketSize = Math.max(1, Math.floor((maxVal - minVal) / k) + 1);\n\n    // Create buckets\n    const buckets = Array.from({ length: k }, () => []);\n\n    // Distribute elements\n    for (const num of arr) {\n        const idx = Math.min(k - 1, Math.floor((num - minVal) / bucketSize));\n        buckets[idx].push(num);\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    let pos = 0;\n    for (const bucket of buckets) {\n        for (let i = 1; i < bucket.length; i++) {\n            const key = bucket[i];\n            let j = i - 1;\n            while (j >= 0 && bucket[j] > key) {\n                bucket[j + 1] = bucket[j];\n                j--;\n            }\n            bucket[j + 1] = key;\n        }\n        for (const val of bucket) arr[pos++] = val;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        12,
        13,
        14
      ],
      "bucket_sort_start": [
        19
      ],
      "bucket_compare": [
        23
      ],
      "bucket_shift": [
        24,
        25
      ],
      "bucket_insert": [
        26
      ],
      "merge": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function bucketSort(arr: number[]): number[] {\n    const n = arr.length;\n    const minVal = Math.min(...arr);\n    const maxVal = Math.max(...arr);\n    const k = Math.max(1, Math.floor(n / 2));\n    const bucketSize = Math.max(1, Math.floor((maxVal - minVal) / k) + 1);\n\n    // Create buckets\n    const buckets: number[][] = Array.from({ length: k }, () => []);\n\n    // Distribute elements\n    for (const num of arr) {\n        const idx = Math.min(k - 1, Math.floor((num - minVal) / bucketSize));\n        buckets[idx].push(num);\n    }\n\n    // Sort each bucket (insertion sort) and merge\n    let pos = 0;\n    for (const bucket of buckets) {\n        for (let i = 1; i < bucket.length; i++) {\n            const key = bucket[i];\n            let j = i - 1;\n            while (j >= 0 && bucket[j] > key) {\n                bucket[j + 1] = bucket[j];\n                j--;\n            }\n            bucket[j + 1] = key;\n        }\n        for (const val of bucket) arr[pos++] = val;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "distribute": [
        12,
        13,
        14
      ],
      "bucket_sort_start": [
        19
      ],
      "bucket_compare": [
        23
      ],
      "bucket_shift": [
        24,
        25
      ],
      "bucket_insert": [
        26
      ],
      "merge": [
        28
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "bucket_compare": [
        23
      ]
    }
  }
};

const BucketSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        64,
        34,
        25,
        12,
        22,
        11,
        90
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Clustered",
    "value": {
      "arr": [
        15,
        12,
        18,
        45,
        42,
        48,
        75,
        72,
        78
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateBucketSortSteps(e: { arr: number[] }): any[] {
  const i = (e, t) => 100 * e + t;
let t=[...e.arr],r=t.length,n=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=new StepRecorder({arr:[...t],n:r,k:void 0,bucketSize:void 0,minVal:void 0,maxVal:void 0,phase:"distribute",i:void 0,curVal:void 0,bIdx:void 0,bLo:void 0,bHi:void 0,moveFrom:void 0,moveToB:void 0,moveToLocal:void 0,movedBar:void 0,sortB:void 0,keyVal:void 0,cmpVal:void 0,insPos:void 0,mergeFromB:void 0,mergeFromLocal:void 0,mergeTo:void 0,mergeVal:void 0},{...n});if(l.record("-","Start: sort the array with bucket sort"),r<=1)return 1===r&&(l.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),l.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),l.record("complete","Array is already sorted"),l.getSteps();let s=Math.min(...t),o=Math.max(...t),c=Math.max(1,Math.floor(r/2)),u=Math.max(1,Math.floor((o-s)/c)+1);l.update_variable("minVal",s),l.update_variable("maxVal",o),l.update_variable("k",c),l.update_variable("bucketSize",u);let d=Array.from({length:c},()=>[]),m=Array.from({length:c},()=>[]),b=(e,t,r,a="in_bucket")=>{l.update_visual(`bar_${e}`,{type:"arrayElement",value:d[t][r],position:i(t,r),state:a})};for(let e=0;e<r;e++){let r=t[e],a=Math.min(c-1,Math.floor((r-s)/u)),i=d[a].length;d[a].push(r),m[a].push(e),l.update_variable("i",e),l.update_variable("curVal",r),l.update_variable("bIdx",a),l.update_variable("bLo",s+a*u),l.update_variable("bHi",Math.min(o,s+(a+1)*u-1)),l.update_variable("moveFrom",e),l.update_variable("moveToB",a),l.update_variable("moveToLocal",i),l.update_variable("movedBar",`bar_${e}`),b(e,a,i,"b_active"),l.record("distribute",`arr[${e}] = ${r} falls in [${s+a*u}..${Math.min(o,s+(a+1)*u-1)}]: drop it into bucket ${a}`),b(e,a,i)}l.update_variable("phase","sort");for(let e=0;e<c;e++){let t=d[e].length;if(!(t<=1)){l.update_variable("sortB",e),l.record("bucket_sort_start",`Insertion sort bucket ${e}: [${d[e].join(", ")}]`);for(let r=1;r<t;r++){let t=d[e][r],a=m[e][r];l.update_variable("keyVal",t),l.update_visual(`bar_${a}`,{type:"arrayElement",value:t,position:i(e,r),state:"b_key"});let n=r-1;for(;n>=0&&d[e][n]>t;){l.update_variable("cmpVal",d[e][n]);let r=m[e][n];b(r,e,n,"b_cmp"),l.add_conditional("bucket_compare",!0),l.record("bucket_compare",`Bucket ${e}: compare ${d[e][n]} with key ${t}`),d[e][n+1]=d[e][n],m[e][n+1]=r,b(r,e,n+1,"b_shift"),l.update_visual(`bar_${a}`,{type:"arrayElement",value:t,position:i(e,n),state:"b_key"}),l.record("bucket_shift",`Bucket ${e}: ${d[e][n+1]} > ${t}, shift it right`),b(r,e,n+1),n--}if(n>=0){l.update_variable("cmpVal",d[e][n]);let r=m[e][n];b(r,e,n,"b_cmp"),l.add_conditional("bucket_compare",!1),l.record("bucket_compare",`Bucket ${e}: compare ${d[e][n]} with key ${t}`),b(r,e,n)}d[e][n+1]=t,m[e][n+1]=a,l.update_variable("insPos",n+1),l.update_visual(`bar_${a}`,{type:"arrayElement",value:t,position:i(e,n+1),state:"b_key"}),l.record("bucket_insert",`Bucket ${e}: key ${t} settles at slot ${n+1}`),b(a,e,n+1)}}}l.update_variable("phase","merge");let p=0;for(let e=0;e<c;e++)for(let r=0;r<d[e].length;r++){let a=d[e][r],i=m[e][r];t[p]=a,l.update_variable("i",p),l.update_variable("arr",[...t]),l.update_variable("bIdx",e),l.update_variable("mergeVal",a),l.update_variable("mergeFromB",e),l.update_variable("mergeFromLocal",r),l.update_variable("mergeTo",p),l.update_variable("movedBar",`bar_${i}`),l.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:p,state:"sorted"}),l.update_visual("range_sorted",{type:"range",start:0,end:p,label:"sorted",state:"sorted"}),l.record("merge",`Bucket ${e} → arr[${p}] = ${a}`),p++}return l.update_variable("phase","done"),l.record("complete","Bucket sort complete: the array is sorted"),l.getSteps()
}

export function BucketSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BucketSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateBucketSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Bucket Sort"
      slug="bucket-sort"
      approaches={approaches}
      presets={BucketSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Counting Sort (counting-sort)
// ==========================================

const CountingSortTemplates = {
  "python": {
    "language": "python",
    "code": "def counting_sort(arr):\n    min_val = min(arr)\n    max_val = max(arr)\n    count_range = max_val - min_val + 1\n    count = [0] * count_range\n\n    # Phase 1: Count occurrences\n    for num in arr:\n        count[num - min_val] += 1\n\n    # Phase 2: Cumulative counts\n    for i in range(1, count_range):\n        count[i] += count[i - 1]\n\n    # Phase 3: Build output\n    output = [0] * len(arr)\n    for i in range(len(arr) - 1, -1, -1):\n        output[count[arr[i] - min_val] - 1] = arr[i]\n        count[arr[i] - min_val] -= 1\n\n    # Copy back\n    for i in range(len(arr)):\n        arr[i] = output[i]\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5
      ],
      "count_element": [
        8,
        9
      ],
      "make_cumulative": [
        12,
        13
      ],
      "place_element": [
        17,
        18,
        19
      ],
      "copy_back": [
        22,
        23
      ],
      "complete": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void countingSort(int[] arr) {\n    int n = arr.length;\n    int minVal = Arrays.stream(arr).min().getAsInt();\n    int maxVal = Arrays.stream(arr).max().getAsInt();\n    int countRange = maxVal - minVal + 1;\n    int[] count = new int[countRange];\n\n    // Phase 1: Count occurrences\n    for (int num : arr) {\n        count[num - minVal]++;\n    }\n\n    // Phase 2: Cumulative counts\n    for (int i = 1; i < countRange; i++) {\n        count[i] += count[i - 1];\n    }\n\n    // Phase 3: Build output\n    int[] output = new int[n];\n    for (int i = n - 1; i >= 0; i--) {\n        output[count[arr[i] - minVal] - 1] = arr[i];\n        count[arr[i] - minVal]--;\n    }\n\n    // Copy back\n    System.arraycopy(output, 0, arr, 0, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6
      ],
      "count_element": [
        9,
        10
      ],
      "make_cumulative": [
        14,
        15
      ],
      "place_element": [
        20,
        21,
        22
      ],
      "copy_back": [
        26
      ],
      "complete": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void countingSort(vector<int>& arr) {\n    int n = arr.size();\n    int minVal = *min_element(arr.begin(), arr.end());\n    int maxVal = *max_element(arr.begin(), arr.end());\n    int countRange = maxVal - minVal + 1;\n    vector<int> count(countRange, 0);\n\n    // Phase 1: Count occurrences\n    for (int num : arr) {\n        count[num - minVal]++;\n    }\n\n    // Phase 2: Cumulative counts\n    for (int i = 1; i < countRange; i++) {\n        count[i] += count[i - 1];\n    }\n\n    // Phase 3: Build output\n    vector<int> output(n);\n    for (int i = n - 1; i >= 0; i--) {\n        output[count[arr[i] - minVal] - 1] = arr[i];\n        count[arr[i] - minVal]--;\n    }\n\n    // Copy back\n    arr = output;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6
      ],
      "count_element": [
        9,
        10
      ],
      "make_cumulative": [
        14,
        15
      ],
      "place_element": [
        20,
        21,
        22
      ],
      "copy_back": [
        26
      ],
      "complete": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void CountingSort(int[] arr) {\n    int n = arr.Length;\n    int minVal = arr.Min();\n    int maxVal = arr.Max();\n    int countRange = maxVal - minVal + 1;\n    int[] count = new int[countRange];\n\n    // Phase 1: Count occurrences\n    foreach (int num in arr) {\n        count[num - minVal]++;\n    }\n\n    // Phase 2: Cumulative counts\n    for (int i = 1; i < countRange; i++) {\n        count[i] += count[i - 1];\n    }\n\n    // Phase 3: Build output\n    int[] output = new int[n];\n    for (int i = n - 1; i >= 0; i--) {\n        output[count[arr[i] - minVal] - 1] = arr[i];\n        count[arr[i] - minVal]--;\n    }\n\n    // Copy back\n    Array.Copy(output, arr, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6
      ],
      "count_element": [
        9,
        10
      ],
      "make_cumulative": [
        14,
        15
      ],
      "place_element": [
        20,
        21,
        22
      ],
      "copy_back": [
        26
      ],
      "complete": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countingSort(arr []int) {\n    n := len(arr)\n    minVal, maxVal := arr[0], arr[0]\n    for _, v := range arr {\n        if v < minVal { minVal = v }\n        if v > maxVal { maxVal = v }\n    }\n    countRange := maxVal - minVal + 1\n    count := make([]int, countRange)\n\n    // Phase 1: Count occurrences\n    for _, num := range arr {\n        count[num-minVal]++\n    }\n\n    // Phase 2: Cumulative counts\n    for i := 1; i < countRange; i++ {\n        count[i] += count[i-1]\n    }\n\n    // Phase 3: Build output\n    output := make([]int, n)\n    for i := n - 1; i >= 0; i-- {\n        output[count[arr[i]-minVal]-1] = arr[i]\n        count[arr[i]-minVal]--\n    }\n\n    // Copy back\n    copy(arr, output)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "count_element": [
        12,
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        23,
        24,
        25
      ],
      "copy_back": [
        29
      ],
      "complete": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function countingSort(arr) {\n    const n = arr.length;\n    const minVal = Math.min(...arr);\n    const maxVal = Math.max(...arr);\n    const countRange = maxVal - minVal + 1;\n    const count = new Array(countRange).fill(0);\n\n    // Phase 1: Count occurrences\n    for (const num of arr) {\n        count[num - minVal]++;\n    }\n\n    // Phase 2: Cumulative counts\n    for (let i = 1; i < countRange; i++) {\n        count[i] += count[i - 1];\n    }\n\n    // Phase 3: Build output\n    const output = new Array(n).fill(0);\n    for (let i = n - 1; i >= 0; i--) {\n        output[count[arr[i] - minVal] - 1] = arr[i];\n        count[arr[i] - minVal]--;\n    }\n\n    // Copy back\n    for (let i = 0; i < n; i++) {\n        arr[i] = output[i];\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6
      ],
      "count_element": [
        9,
        10
      ],
      "make_cumulative": [
        14,
        15
      ],
      "place_element": [
        20,
        21,
        22
      ],
      "copy_back": [
        26,
        27
      ],
      "complete": [
        30
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countingSort(arr: number[]): number[] {\n    const n = arr.length;\n    const minVal = Math.min(...arr);\n    const maxVal = Math.max(...arr);\n    const countRange = maxVal - minVal + 1;\n    const count: number[] = new Array(countRange).fill(0);\n\n    // Phase 1: Count occurrences\n    for (const num of arr) {\n        count[num - minVal]++;\n    }\n\n    // Phase 2: Cumulative counts\n    for (let i = 1; i < countRange; i++) {\n        count[i] += count[i - 1];\n    }\n\n    // Phase 3: Build output\n    const output: number[] = new Array(n).fill(0);\n    for (let i = n - 1; i >= 0; i--) {\n        output[count[arr[i] - minVal] - 1] = arr[i];\n        count[arr[i] - minVal]--;\n    }\n\n    // Copy back\n    for (let i = 0; i < n; i++) {\n        arr[i] = output[i];\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_count": [
        2,
        3,
        4,
        5,
        6
      ],
      "count_element": [
        9,
        10
      ],
      "make_cumulative": [
        14,
        15
      ],
      "place_element": [
        20,
        21,
        22
      ],
      "copy_back": [
        26,
        27
      ],
      "complete": [
        30
      ]
    }
  }
};

const CountingSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        4,
        2,
        2,
        8,
        3,
        3,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        3,
        1,
        2,
        1,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Digit",
    "value": {
      "arr": [
        9,
        3,
        7,
        1,
        5,
        2,
        8,
        4,
        6
      ]
    }
  },
  {
    "id": "ex4",
    "label": "All Same",
    "value": {
      "arr": [
        5,
        5,
        5,
        5,
        5
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Sorted",
    "value": {
      "arr": [
        1,
        2,
        3,
        4,
        5
      ]
    }
  }
];

function generateCountingSortSteps(t: { arr: number[] }): any[] {
  let e=[...t.arr],n=e.length,r={};for(let t=0;t<n;t++)r[`bar_${t}`]={type:"arrayElement",value:e[t],position:t};let i=Math.min(...e),l=Math.max(...e),o=l-i+1;for(let t=0;t<o;t++)r[`count_${t}`]={type:"arrayElement",value:0,position:t,label:String(t+i)};let u=new StepRecorder({arr:[...e],n,minVal:i,maxVal:l,countRange:o,phase:"count",i:void 0,curVal:void 0,countVal:void 0,cumIdxVal:void 0,cumPrevVal:void 0,cumA:void 0,cumB:void 0,cumSum:void 0,outPos:void 0,countAfter:void 0,copyVal:void 0},r);if(u.record("-","Start: sort the array with counting sort"),n<=1)return 1===n&&(u.update_visual("bar_0",{type:"arrayElement",value:e[0],position:0,state:"sorted"}),u.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),u.record("complete","Array is already sorted"),u.getSteps();let s=Array(o).fill(0),c=(t,e)=>{u.update_visual(`count_${t}`,{type:"arrayElement",value:s[t],position:t,label:String(t+i),...e?{state:e}:{}})},d=(t,e,n)=>{u.update_visual(`bar_${t}`,{type:"arrayElement",value:e,position:t,...n?{state:n}:{}})};u.record("init_count",`Values span ${i}..${l}: create a count array of size ${o}, all zeros`);for(let t=0;t<n;t++){let n=e[t],a=n-i;u.update_variable("i",t),u.update_variable("curVal",n),s[a]++,u.update_variable("countVal",s[a]),d(t,n,"active"),c(a,"hot"),u.record("count_element",`arr[${t}] = ${n}: count[${n}] becomes ${s[a]}`),d(t,n),c(a)}u.update_variable("phase","prefix");for(let t=1;t<o;t++)u.update_variable("i",t),u.update_variable("cumIdxVal",t+i),u.update_variable("cumPrevVal",t-1+i),u.update_variable("cumA",s[t-1]),u.update_variable("cumB",s[t]),s[t]+=s[t-1],u.update_variable("cumSum",s[t]),c(t-1,"src"),c(t,"dst"),u.record("make_cumulative",`count[${t+i}] = ${s[t]-s[t-1]} + ${s[t-1]} = ${s[t]}: elements ≤ ${t+i}`),c(t-1),c(t);u.update_variable("phase","place");let p=Array(n).fill(0);for(let t=n-1;t>=0;t--){let n=e[t],a=n-i,r=s[a]-1;u.update_variable("i",t),u.update_variable("curVal",n),u.update_variable("outPos",r),p[r]=n,s[a]--,u.update_variable("countAfter",s[a]),d(t,n,"active"),c(a,"hot"),u.update_visual(`output_${r}`,{type:"arrayElement",value:n,position:r,state:"sorted"}),u.record("place_element",`arr[${t}] = ${n} goes to output[${r}]; count[${n}] drops to ${s[a]}`),d(t,n),c(a)}u.update_variable("phase","copy");for(let t=0;t<n;t++)e[t]=p[t],u.update_variable("i",t),u.update_variable("copyVal",p[t]),u.update_variable("arr",[...e]),d(t,p[t],"sorted"),u.update_visual("range_sorted",{type:"range",start:0,end:t,label:"sorted",state:"sorted"}),u.record("copy_back",`arr[${t}] = output[${t}] = ${p[t]}`);return u.update_variable("phase","done"),u.record("complete","Counting sort complete: the array is sorted"),u.getSteps()
}

export function CountingSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountingSortTemplates,
      generateSteps: (t: { arr: number[] }) => {
        const recorded = generateCountingSortSteps(t) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Counting Sort"
      slug="counting-sort"
      approaches={approaches}
      presets={CountingSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Heap Sort (heap-sort)
// ==========================================

const HeapSortTemplates = {
  "python": {
    "language": "python",
    "code": "def heap_sort(arr):\n    n = len(arr)\n\n    def heapify(arr, n, root):\n        while True:\n            largest = root\n            left = 2 * root + 1\n            right = 2 * root + 2\n\n            if left < n and arr[left] > arr[largest]:\n                largest = left\n            if right < n and arr[right] > arr[largest]:\n                largest = right\n\n            if largest == root:\n                break\n\n            arr[root], arr[largest] = arr[largest], arr[root]\n            root = largest\n\n    # Build max heap\n    for i in range(n // 2 - 1, -1, -1):\n        heapify(arr, n, i)\n\n    # Extract elements\n    for i in range(n - 1, 0, -1):\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        22,
        23
      ],
      "heapify_start": [
        4
      ],
      "compare_children": [
        10,
        12
      ],
      "heapify_swap": [
        18,
        19
      ],
      "heap_built": [
        22
      ],
      "extract_start": [
        26,
        27
      ],
      "extract_swap": [
        27
      ],
      "heapify_root": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "compare_left": [
        10
      ],
      "compare_right": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void heapSort(int[] arr) {\n    int n = arr.length;\n\n    // Build max heap\n    for (int i = n / 2 - 1; i >= 0; i--) {\n        heapify(arr, n, i);\n    }\n\n    // Extract elements\n    for (int i = n - 1; i > 0; i--) {\n        int temp = arr[0];\n        arr[0] = arr[i];\n        arr[i] = temp;\n        heapify(arr, i, 0);\n    }\n}\n\nprivate void heapify(int[] arr, int n, int root) {\n    while (true) {\n        int largest = root;\n        int left = 2 * root + 1;\n        int right = 2 * root + 2;\n\n        if (left < n && arr[left] > arr[largest])\n            largest = left;\n        if (right < n && arr[right] > arr[largest])\n            largest = right;\n\n        if (largest == root) break;\n\n        int temp = arr[root];\n        arr[root] = arr[largest];\n        arr[largest] = temp;\n        root = largest;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        5,
        6
      ],
      "heapify_start": [
        18
      ],
      "compare_children": [
        24,
        26
      ],
      "heapify_swap": [
        31,
        32,
        33,
        34
      ],
      "heap_built": [
        5
      ],
      "extract_start": [
        10,
        11
      ],
      "extract_swap": [
        11,
        12,
        13
      ],
      "heapify_root": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "compare_left": [
        24
      ],
      "compare_right": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void heapify(vector<int>& arr, int n, int root) {\n    while (true) {\n        int largest = root;\n        int left = 2 * root + 1;\n        int right = 2 * root + 2;\n\n        if (left < n && arr[left] > arr[largest])\n            largest = left;\n        if (right < n && arr[right] > arr[largest])\n            largest = right;\n\n        if (largest == root) break;\n\n        swap(arr[root], arr[largest]);\n        root = largest;\n    }\n}\n\nvoid heapSort(vector<int>& arr) {\n    int n = arr.size();\n\n    // Build max heap\n    for (int i = n / 2 - 1; i >= 0; i--)\n        heapify(arr, n, i);\n\n    // Extract elements\n    for (int i = n - 1; i > 0; i--) {\n        swap(arr[0], arr[i]);\n        heapify(arr, i, 0);\n    }\n}",
    "lineMap": {
      "-": [
        19
      ],
      "build_heap": [
        23,
        24
      ],
      "heapify_start": [
        1
      ],
      "compare_children": [
        7,
        9
      ],
      "heapify_swap": [
        14,
        15
      ],
      "heap_built": [
        23
      ],
      "extract_start": [
        27,
        28
      ],
      "extract_swap": [
        28
      ],
      "heapify_root": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "compare_left": [
        7
      ],
      "compare_right": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void HeapSort(int[] arr) {\n    int n = arr.Length;\n\n    // Build max heap\n    for (int i = n / 2 - 1; i >= 0; i--)\n        Heapify(arr, n, i);\n\n    // Extract elements\n    for (int i = n - 1; i > 0; i--) {\n        (arr[0], arr[i]) = (arr[i], arr[0]);\n        Heapify(arr, i, 0);\n    }\n}\n\nprivate void Heapify(int[] arr, int n, int root) {\n    while (true) {\n        int largest = root;\n        int left = 2 * root + 1;\n        int right = 2 * root + 2;\n\n        if (left < n && arr[left] > arr[largest])\n            largest = left;\n        if (right < n && arr[right] > arr[largest])\n            largest = right;\n\n        if (largest == root) break;\n\n        (arr[root], arr[largest]) = (arr[largest], arr[root]);\n        root = largest;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        5,
        6
      ],
      "heapify_start": [
        15
      ],
      "compare_children": [
        21,
        23
      ],
      "heapify_swap": [
        28,
        29
      ],
      "heap_built": [
        5
      ],
      "extract_start": [
        9,
        10
      ],
      "extract_swap": [
        10
      ],
      "heapify_root": [
        11
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "compare_left": [
        21
      ],
      "compare_right": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func heapSort(arr []int) {\n    n := len(arr)\n\n    // Build max heap\n    for i := n/2 - 1; i >= 0; i-- {\n        heapify(arr, n, i)\n    }\n\n    // Extract elements\n    for i := n - 1; i > 0; i-- {\n        arr[0], arr[i] = arr[i], arr[0]\n        heapify(arr, i, 0)\n    }\n}\n\nfunc heapify(arr []int, n, root int) {\n    for {\n        largest := root\n        left := 2*root + 1\n        right := 2*root + 2\n\n        if left < n && arr[left] > arr[largest] {\n            largest = left\n        }\n        if right < n && arr[right] > arr[largest] {\n            largest = right\n        }\n\n        if largest == root {\n            break\n        }\n\n        arr[root], arr[largest] = arr[largest], arr[root]\n        root = largest\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        5,
        6
      ],
      "heapify_start": [
        16
      ],
      "compare_children": [
        22,
        25
      ],
      "heapify_swap": [
        33,
        34
      ],
      "heap_built": [
        5
      ],
      "extract_start": [
        10,
        11
      ],
      "extract_swap": [
        11
      ],
      "heapify_root": [
        12
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "compare_left": [
        22
      ],
      "compare_right": [
        25
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function heapSort(arr) {\n    const n = arr.length;\n\n    function heapify(arr, n, root) {\n        while (true) {\n            let largest = root;\n            const left = 2 * root + 1;\n            const right = 2 * root + 2;\n\n            if (left < n && arr[left] > arr[largest])\n                largest = left;\n            if (right < n && arr[right] > arr[largest])\n                largest = right;\n\n            if (largest === root) break;\n\n            [arr[root], arr[largest]] = [arr[largest], arr[root]];\n            root = largest;\n        }\n    }\n\n    // Build max heap\n    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)\n        heapify(arr, n, i);\n\n    // Extract elements\n    for (let i = n - 1; i > 0; i--) {\n        [arr[0], arr[i]] = [arr[i], arr[0]];\n        heapify(arr, i, 0);\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        23,
        24
      ],
      "heapify_start": [
        4
      ],
      "compare_children": [
        10,
        12
      ],
      "heapify_swap": [
        17,
        18
      ],
      "heap_built": [
        23
      ],
      "extract_start": [
        27,
        28
      ],
      "extract_swap": [
        28
      ],
      "heapify_root": [
        29
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "compare_left": [
        10
      ],
      "compare_right": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function heapSort(arr: number[]): number[] {\n    const n = arr.length;\n\n    function heapify(arr: number[], n: number, root: number): void {\n        while (true) {\n            let largest = root;\n            const left = 2 * root + 1;\n            const right = 2 * root + 2;\n\n            if (left < n && arr[left] > arr[largest])\n                largest = left;\n            if (right < n && arr[right] > arr[largest])\n                largest = right;\n\n            if (largest === root) break;\n\n            [arr[root], arr[largest]] = [arr[largest], arr[root]];\n            root = largest;\n        }\n    }\n\n    // Build max heap\n    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)\n        heapify(arr, n, i);\n\n    // Extract elements\n    for (let i = n - 1; i > 0; i--) {\n        [arr[0], arr[i]] = [arr[i], arr[0]];\n        heapify(arr, i, 0);\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_heap": [
        23,
        24
      ],
      "heapify_start": [
        4
      ],
      "compare_children": [
        10,
        12
      ],
      "heapify_swap": [
        17,
        18
      ],
      "heap_built": [
        23
      ],
      "extract_start": [
        27,
        28
      ],
      "extract_swap": [
        28
      ],
      "heapify_root": [
        29
      ],
      "complete": [
        33
      ]
    },
    "conditionalMap": {
      "compare_left": [
        10
      ],
      "compare_right": [
        12
      ]
    }
  }
};

const HeapSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        64,
        34,
        25,
        12,
        22,
        11,
        90
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  },
  {
    "id": "ex5",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateHeapSortSteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],r=t.length,i=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=t.map((e,t)=>t),n=[...t],o=new StepRecorder({arr:t,n:r,heapSize:r,phase:"build",i:void 0,root:void 0,largest:void 0,rootVal:void 0,leftIdx:void 0,rightIdx:void 0,leftVal:void 0,rightVal:void 0,largestVal:void 0,swapFrom:void 0,swapTo:void 0,swapDownBar:void 0,swapUpBar:void 0,extractedVal:void 0,extractedIdx:void 0},{...i});if(o.record("-","Start: sort the array with heap sort"),r<=1)return 1===r&&(o.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),o.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),o.record("complete","Array is already sorted"),o.getSteps();let s=(e,t)=>{let r=l.indexOf(e);o.update_visual(`bar_${r}`,{type:"arrayElement",value:n[e],position:e,...t?{state:t}:{}})},p=(e,r)=>{let a=e;for(;;){let e=2*a+1,i=2*a+2;if(o.update_variable("root",a),o.update_variable("rootVal",n[a]),o.update_variable("leftIdx",e<r?e:void 0),o.update_variable("rightIdx",i<r?i:void 0),o.update_variable("leftVal",e<r?n[e]:void 0),o.update_variable("rightVal",i<r?n[i]:void 0),e>=r)break;let p=n[e]>n[a],d=p?e:a,h=i<r&&n[i]>n[d],c=h?i:d;if(o.update_variable("largest",c),o.update_variable("largestVal",n[c]),s(a,"active"),s(e,"comparing"),i<r&&s(i,"comparing"),o.add_conditional("compare_left",p),o.add_conditional("compare_right",h),o.record("compare_children",`Largest of parent ${n[a]}${e<r?`, left ${n[e]}`:""}${i<r?`, right ${n[i]}`:""} is ${n[c]}`),c===a){s(a),s(e),i<r&&s(i);break}e!==c&&s(e),i<r&&i!==c&&s(i);let f=l.indexOf(a),u=l.indexOf(c),g=n[a],x=n[c];[n[a],n[c]]=[n[c],n[a]],[t[a],t[c]]=[t[c],t[a]],[l[f],l[u]]=[c,a],o.update_variable("arr",[...t]),o.update_variable("swapFrom",a),o.update_variable("swapTo",c),o.update_variable("swapDownBar",`bar_${f}`),o.update_variable("swapUpBar",`bar_${u}`),o.update_visual(`bar_${f}`,{type:"arrayElement",value:g,position:c,state:"swapping"}),o.update_visual(`bar_${u}`,{type:"arrayElement",value:x,position:a,state:"swapping"}),o.record("heapify_swap",`${g} < ${x}: swap them and keep sifting down`),s(a),s(c),a=c}};o.update_variable("phase","build"),o.record("build_heap","Phase 1: build a max heap from the array");for(let e=Math.floor(r/2)-1;e>=0;e--)o.update_variable("i",e),o.update_variable("root",e),o.update_variable("rootVal",n[e]),s(e,"active"),o.record("heapify_start",`Heapify the subtree rooted at index ${e} (value ${n[e]})`),p(e,r),s(e);o.record("heap_built",`Max heap built: the root ${n[0]} is the maximum`),o.update_variable("phase","extract"),o.record("extract_start","Phase 2: swap the root with the last heap element, shrink the heap, sift down");for(let e=r-1;e>0;e--){o.update_variable("i",e);let a=l.indexOf(0),i=l.indexOf(e),d=n[0],h=n[e];[n[0],n[e]]=[n[e],n[0]],[t[0],t[e]]=[t[e],t[0]],[l[a],l[i]]=[e,0],o.update_variable("arr",[...t]),o.update_variable("heapSize",e),o.update_variable("extractedVal",d),o.update_variable("extractedIdx",e),o.update_variable("swapFrom",0),o.update_variable("swapTo",e),o.update_variable("swapDownBar",`bar_${a}`),o.update_variable("swapUpBar",`bar_${i}`),o.update_visual(`bar_${a}`,{type:"arrayElement",value:d,position:e,state:"sorted"}),o.update_visual(`bar_${i}`,{type:"arrayElement",value:h,position:0,state:"swapping"}),o.update_visual("range_sorted",{type:"range",start:e,end:r-1,label:"sorted",state:"sorted"}),o.record("extract_swap",`Extract max ${d}: it locks in at index ${e}, heap size shrinks to ${e}`),s(0,"active"),o.update_variable("root",0),o.update_variable("rootVal",n[0]),e>1&&(o.record("heapify_root",`Sift the new root ${n[0]} down to restore the max heap`),p(0,e)),s(0)}let d=l.indexOf(0);return o.update_visual(`bar_${d}`,{type:"arrayElement",value:n[0],position:0,state:"sorted"}),o.update_variable("heapSize",0),o.update_visual("range_sorted",{type:"range",start:0,end:r-1,label:"sorted",state:"sorted"}),o.record("complete","Heap sort complete: the array is sorted"),o.getSteps()
}

export function HeapSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HeapSortTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateHeapSortSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Heap Sort"
      slug="heap-sort"
      approaches={approaches}
      presets={HeapSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Maximum Gap (maximum-gap)
// ==========================================

const MaximumGapTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def maximumGap(self, nums: list[int]) -> int:\n        n = len(nums)\n        if n < 2:\n            return 0\n\n        lo, hi = min(nums), max(nums)\n        if lo == hi:\n            return 0\n\n        # Bucket width: at least 1 to avoid division by zero\n        bucket_size = max(1, (hi - lo) // (n - 1))\n        bucket_count = (hi - lo) // bucket_size + 1\n\n        # Track min and max for each bucket\n        bucket_min = [float('inf')] * bucket_count\n        bucket_max = [float('-inf')] * bucket_count\n        used = [False] * bucket_count\n\n        # Place each element into its bucket\n        for num in nums:\n            idx = (num - lo) // bucket_size\n            used[idx] = True\n            bucket_min[idx] = min(bucket_min[idx], num)\n            bucket_max[idx] = max(bucket_max[idx], num)\n\n        # Scan buckets to find maximum gap\n        max_gap = 0\n        prev_max = lo\n        for i in range(bucket_count):\n            if not used[i]:\n                continue\n            max_gap = max(max_gap, bucket_min[i] - prev_max)\n            prev_max = bucket_max[i]\n        return max_gap",
    "lineMap": {
      "-": [
        2
      ],
      "find_min_max": [
        7
      ],
      "compute_buckets": [
        12,
        13
      ],
      "init_buckets": [
        16,
        17,
        18
      ],
      "place_element": [
        21,
        22,
        23,
        24,
        25
      ],
      "start_scan": [
        28,
        29
      ],
      "skip_bucket": [
        31,
        32
      ],
      "check_gap": [
        33,
        34
      ],
      "complete": [
        35
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int maximumGap(int[] nums) {\n        int n = nums.length;\n        if (n < 2) return 0;\n\n        int min = nums[0], max = nums[0];\n        for (int num : nums) {\n            min = Math.min(min, num);\n            max = Math.max(max, num);\n        }\n        if (min == max) return 0;\n\n        // Bucket width: at least 1 to avoid division by zero\n        int bucketSize = Math.max(1, (max - min) / (n - 1));\n        int bucketCount = (max - min) / bucketSize + 1;\n\n        // Track min and max for each bucket\n        int[] bucketMin = new int[bucketCount];\n        int[] bucketMax = new int[bucketCount];\n        boolean[] used = new boolean[bucketCount];\n        Arrays.fill(bucketMin, Integer.MAX_VALUE);\n        Arrays.fill(bucketMax, Integer.MIN_VALUE);\n\n        // Place each element into its bucket\n        for (int num : nums) {\n            int idx = (num - min) / bucketSize;\n            used[idx] = true;\n            bucketMin[idx] = Math.min(bucketMin[idx], num);\n            bucketMax[idx] = Math.max(bucketMax[idx], num);\n        }\n\n        // Scan buckets to find maximum gap\n        int maxGap = 0;\n        int prevMax = min;\n        for (int i = 0; i < bucketCount; i++) {\n            if (!used[i]) continue;\n            maxGap = Math.max(maxGap, bucketMin[i] - prevMax);\n            prevMax = bucketMax[i];\n        }\n        return maxGap;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "find_min_max": [
        6,
        7,
        8,
        9,
        10
      ],
      "compute_buckets": [
        14,
        15
      ],
      "init_buckets": [
        18,
        19,
        20,
        21,
        22
      ],
      "place_element": [
        25,
        26,
        27,
        28,
        29
      ],
      "start_scan": [
        33,
        34
      ],
      "skip_bucket": [
        36
      ],
      "check_gap": [
        37,
        38
      ],
      "complete": [
        40
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int maximumGap(vector<int>& nums) {\n        int n = nums.size();\n        if (n < 2) return 0;\n\n        int lo = *min_element(nums.begin(), nums.end());\n        int hi = *max_element(nums.begin(), nums.end());\n        if (lo == hi) return 0;\n\n        // Bucket width: at least 1 to avoid division by zero\n        int bucketSize = max(1, (hi - lo) / (n - 1));\n        int bucketCount = (hi - lo) / bucketSize + 1;\n\n        // Track min and max for each bucket\n        vector<int> bucketMin(bucketCount, INT_MAX);\n        vector<int> bucketMax(bucketCount, INT_MIN);\n        vector<bool> used(bucketCount, false);\n\n        // Place each element into its bucket\n        for (int num : nums) {\n            int idx = (num - lo) / bucketSize;\n            used[idx] = true;\n            bucketMin[idx] = min(bucketMin[idx], num);\n            bucketMax[idx] = max(bucketMax[idx], num);\n        }\n\n        // Scan buckets to find maximum gap\n        int maxGap = 0;\n        int prevMax = lo;\n        for (int i = 0; i < bucketCount; i++) {\n            if (!used[i]) continue;\n            maxGap = max(maxGap, bucketMin[i] - prevMax);\n            prevMax = bucketMax[i];\n        }\n        return maxGap;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "find_min_max": [
        7,
        8
      ],
      "compute_buckets": [
        12,
        13
      ],
      "init_buckets": [
        16,
        17,
        18
      ],
      "place_element": [
        21,
        22,
        23,
        24,
        25
      ],
      "start_scan": [
        29,
        30
      ],
      "skip_bucket": [
        32
      ],
      "check_gap": [
        33,
        34
      ],
      "complete": [
        36
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var maximumGap = function(nums) {\n    var n = nums.length;\n    if (n < 2) return 0;\n\n    var lo = nums[0], hi = nums[0];\n    for (var k = 0; k < n; k++) {\n        if (nums[k] < lo) lo = nums[k];\n        if (nums[k] > hi) hi = nums[k];\n    }\n    if (lo === hi) return 0;\n\n    // Bucket width: at least 1 to avoid division by zero\n    var bucketSize = Math.max(1, Math.floor((hi - lo) / (n - 1)));\n    var bucketCount = Math.floor((hi - lo) / bucketSize) + 1;\n\n    // Track min and max for each bucket\n    var bucketMin = new Array(bucketCount).fill(Infinity);\n    var bucketMax = new Array(bucketCount).fill(-Infinity);\n    var used = new Array(bucketCount).fill(false);\n\n    // Place each element into its bucket\n    for (var i = 0; i < n; i++) {\n        var idx = Math.floor((nums[i] - lo) / bucketSize);\n        used[idx] = true;\n        bucketMin[idx] = Math.min(bucketMin[idx], nums[i]);\n        bucketMax[idx] = Math.max(bucketMax[idx], nums[i]);\n    }\n\n    // Scan buckets to find maximum gap\n    var maxGap = 0;\n    var prevMax = lo;\n    for (var j = 0; j < bucketCount; j++) {\n        if (!used[j]) continue;\n        maxGap = Math.max(maxGap, bucketMin[j] - prevMax);\n        prevMax = bucketMax[j];\n    }\n    return maxGap;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "find_min_max": [
        5,
        6,
        7,
        8,
        9
      ],
      "compute_buckets": [
        13,
        14
      ],
      "init_buckets": [
        17,
        18,
        19
      ],
      "place_element": [
        22,
        23,
        24,
        25,
        26
      ],
      "start_scan": [
        30,
        31
      ],
      "skip_bucket": [
        33
      ],
      "check_gap": [
        34,
        35
      ],
      "complete": [
        37
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maximumGap(nums: number[]): number {\n    const n = nums.length;\n    if (n < 2) return 0;\n\n    let lo = nums[0], hi = nums[0];\n    for (let k = 0; k < n; k++) {\n        if (nums[k] < lo) lo = nums[k];\n        if (nums[k] > hi) hi = nums[k];\n    }\n    if (lo === hi) return 0;\n\n    // Bucket width: at least 1 to avoid division by zero\n    const bucketSize = Math.max(1, Math.floor((hi - lo) / (n - 1)));\n    const bucketCount = Math.floor((hi - lo) / bucketSize) + 1;\n\n    // Track min and max for each bucket\n    const bucketMin = new Array(bucketCount).fill(Infinity);\n    const bucketMax = new Array(bucketCount).fill(-Infinity);\n    const used = new Array(bucketCount).fill(false);\n\n    // Place each element into its bucket\n    for (let i = 0; i < n; i++) {\n        const idx = Math.floor((nums[i] - lo) / bucketSize);\n        used[idx] = true;\n        bucketMin[idx] = Math.min(bucketMin[idx], nums[i]);\n        bucketMax[idx] = Math.max(bucketMax[idx], nums[i]);\n    }\n\n    // Scan buckets to find maximum gap\n    let maxGap = 0;\n    let prevMax = lo;\n    for (let j = 0; j < bucketCount; j++) {\n        if (!used[j]) continue;\n        maxGap = Math.max(maxGap, bucketMin[j] - prevMax);\n        prevMax = bucketMax[j];\n    }\n    return maxGap;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_min_max": [
        5,
        6,
        7,
        8,
        9
      ],
      "compute_buckets": [
        13,
        14
      ],
      "init_buckets": [
        17,
        18,
        19
      ],
      "place_element": [
        22,
        23,
        24,
        25,
        26
      ],
      "start_scan": [
        30,
        31
      ],
      "skip_bucket": [
        33
      ],
      "check_gap": [
        34,
        35
      ],
      "complete": [
        37
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maximumGap(nums []int) int {\n    n := len(nums)\n    if n < 2 {\n        return 0\n    }\n\n    lo, hi := nums[0], nums[0]\n    for _, num := range nums {\n        if num < lo {\n            lo = num\n        }\n        if num > hi {\n            hi = num\n        }\n    }\n    if lo == hi {\n        return 0\n    }\n\n    // Bucket width: at least 1 to avoid division by zero\n    bucketSize := (hi - lo) / (n - 1)\n    if bucketSize < 1 {\n        bucketSize = 1\n    }\n    bucketCount := (hi-lo)/bucketSize + 1\n\n    // Track min and max for each bucket\n    bucketMin := make([]int, bucketCount)\n    bucketMax := make([]int, bucketCount)\n    used := make([]bool, bucketCount)\n    for i := range bucketMin {\n        bucketMin[i] = 1<<63 - 1\n        bucketMax[i] = -1 << 63\n    }\n\n    // Place each element into its bucket\n    for _, num := range nums {\n        idx := (num - lo) / bucketSize\n        used[idx] = true\n        if num < bucketMin[idx] {\n            bucketMin[idx] = num\n        }\n        if num > bucketMax[idx] {\n            bucketMax[idx] = num\n        }\n    }\n\n    // Scan buckets to find maximum gap\n    maxGap := 0\n    prevMax := lo\n    for i := 0; i < bucketCount; i++ {\n        if !used[i] {\n            continue\n        }\n        gap := bucketMin[i] - prevMax\n        if gap > maxGap {\n            maxGap = gap\n        }\n        prevMax = bucketMax[i]\n    }\n    return maxGap\n}",
    "lineMap": {
      "-": [
        1
      ],
      "find_min_max": [
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15
      ],
      "compute_buckets": [
        21,
        22,
        23,
        24,
        25
      ],
      "init_buckets": [
        28,
        29,
        30,
        31,
        32,
        33,
        34
      ],
      "place_element": [
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45
      ],
      "start_scan": [
        49,
        50
      ],
      "skip_bucket": [
        52,
        53
      ],
      "check_gap": [
        55,
        56,
        57,
        58,
        59
      ],
      "complete": [
        61
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int MaximumGap(int[] nums) {\n        int n = nums.Length;\n        if (n < 2) return 0;\n\n        int lo = nums.Min();\n        int hi = nums.Max();\n        if (lo == hi) return 0;\n\n        // Bucket width: at least 1 to avoid division by zero\n        int bucketSize = Math.Max(1, (hi - lo) / (n - 1));\n        int bucketCount = (hi - lo) / bucketSize + 1;\n\n        // Track min and max for each bucket\n        int[] bucketMin = new int[bucketCount];\n        int[] bucketMax = new int[bucketCount];\n        bool[] used = new bool[bucketCount];\n        Array.Fill(bucketMin, int.MaxValue);\n        Array.Fill(bucketMax, int.MinValue);\n\n        // Place each element into its bucket\n        foreach (int num in nums) {\n            int idx = (num - lo) / bucketSize;\n            used[idx] = true;\n            bucketMin[idx] = Math.Min(bucketMin[idx], num);\n            bucketMax[idx] = Math.Max(bucketMax[idx], num);\n        }\n\n        // Scan buckets to find maximum gap\n        int maxGap = 0;\n        int prevMax = lo;\n        for (int i = 0; i < bucketCount; i++) {\n            if (!used[i]) continue;\n            maxGap = Math.Max(maxGap, bucketMin[i] - prevMax);\n            prevMax = bucketMax[i];\n        }\n        return maxGap;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "find_min_max": [
        6,
        7
      ],
      "compute_buckets": [
        11,
        12
      ],
      "init_buckets": [
        15,
        16,
        17,
        18,
        19
      ],
      "place_element": [
        22,
        23,
        24,
        25,
        26
      ],
      "start_scan": [
        30,
        31
      ],
      "skip_bucket": [
        33
      ],
      "check_gap": [
        34,
        35
      ],
      "complete": [
        37
      ]
    }
  }
};

const MaximumGapPresets: PresetOption<{ nums: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        3,
        6,
        9,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Large Gap",
    "value": {
      "nums": [
        1,
        3,
        100,
        10,
        9
      ]
    }
  }
];

function generateMaximumGapSteps(e: { nums: number[] }): any[] {
  let t=Array.isArray(e?.nums)?e.nums.map(Number):[],a=t.length,n={};t.forEach((e,t)=>{n[`elem_${t}`]={type:"arrayElement",value:e,position:t,state:"standard"}});let r=new StepRecorder({nums:[...t],n:a,phase:"start",exp:null,counts:null,i:-1,gap:null,maxGap:null,best:null},n);if(r.record("-","Sort with LSD radix sort, then take the largest adjacent difference"),a<2)return r.update_variable("maxGap",0),r.update_variable("phase","done"),r.record("complete","Fewer than 2 elements → maximum gap is 0"),r.getSteps();let l=[...t],s=Math.max(...l);r.update_variable("phase","findMax"),r.update_variable("maxVal",s),r.record("find_max",`Largest value is ${s}, so ${String(s).length} digit pass${1===String(s).length?"":"es"} are needed`);let u=(e,t,a)=>{e.forEach((e,i)=>{r.update_visual(`elem_${i}`,{type:"arrayElement",value:e,position:i,digit:t?t(e):void 0,state:a===i?"active":"standard"})})},o=(e,t)=>{e.forEach((e,a)=>{r.update_visual(`count_${a}`,{type:"arrayElement",value:e,position:a,state:t===a?"active":"standard"})})},c=1,m=0;for(;Math.floor(s/c)>0;){m++;let e=e=>Math.floor(e/c)%10;r.update_variable("phase","pass"),r.update_variable("exp",c),r.update_variable("pass",m),u(l,e),o(Array(10).fill(0)),r.update_variable("counts",Array(10).fill(0)),r.record("pass_start",`Pass ${m}: sort by the ${1===c?"ones":10===c?"tens":`${c}s`} digit`);let t=Array(10).fill(0);for(let a of l){let i=e(a);t[i]++,o(t,i),r.update_variable("counts",[...t]),r.update_variable("activeValue",a),r.update_variable("activeDigit",i),r.record("count_digits",`${a} has digit ${i} here → count[${i}] = ${t[i]}`)}r.delete_variable("activeValue"),r.delete_variable("activeDigit");for(let e=1;e<10;e++)t[e]+=t[e-1];o(t),r.update_variable("counts",[...t]),r.record("prefix_sums","Running totals: count[d] is now where digit d's block ends");let i=Array(a);for(let n=a-1;n>=0;n--){let a=e(l[n]);t[a]--,i[t[a]]=l[n],o(t,a),r.update_variable("counts",[...t]),r.update_variable("activeValue",l[n]),r.update_variable("activeDigit",a),r.update_variable("placedAt",t[a]),r.record("place_element",`${l[n]} (digit ${a}) → slot ${t[a]}`)}r.delete_variable("activeValue"),r.delete_variable("activeDigit"),r.delete_variable("placedAt");for(let e=0;e<a;e++)l[e]=i[e];u(l,e),r.update_variable("nums",[...l]),r.record("copy_back",`After this pass: [${l.join(", ")}]`),c*=10}r.update_variable("phase","scan"),r.update_variable("exp",null),r.update_variable("counts",null),r.update_variable("maxGap",0),l.forEach((e,t)=>{r.update_visual(`elem_${t}`,{type:"arrayElement",value:e,position:t,state:"sorted"})});let p=0,d=null;for(let e=1;e<a;e++){let t=l[e]-l[e-1],a=t>p;a&&(p=t,d={from:e-1,to:e,value:t}),r.update_variable("i",e),r.update_variable("gap",t),r.update_variable("maxGap",p),r.update_variable("improved",a),r.update_variable("best",d?{...d}:null),r.record("scan_gap",`${l[e]} − ${l[e-1]} = ${t}${a?"  → new best":`  (best is still ${p})`}`)}return r.update_variable("i",-1),r.update_variable("gap",null),r.update_variable("improved",!1),r.update_variable("phase","done"),r.record("complete",`Maximum gap = ${p}`),r.getSteps()
}

export function MaximumGapProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaximumGapTemplates,
      generateSteps: (e: { nums: number[] }) => {
        const recorded = generateMaximumGapSteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Maximum Gap"
      slug="maximum-gap"
      approaches={approaches}
      presets={MaximumGapPresets}
      formatInputDisplay={(input: { nums: number[] }) => `nums = [${input.nums ? input.nums.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Radix Sort (radix-sort)
// ==========================================

const RadixSortTemplates = {
  "python": {
    "language": "python",
    "code": "def radix_sort(arr):\n    max_val = max(arr)\n    exp = 1\n\n    while max_val // exp > 0:\n        n = len(arr)\n        count = [0] * 10\n        output = [0] * n\n\n        # Count digits\n        for num in arr:\n            digit = (num // exp) % 10\n            count[digit] += 1\n\n        # Make cumulative\n        for i in range(1, 10):\n            count[i] += count[i - 1]\n\n        # Build output\n        for i in range(n - 1, -1, -1):\n            digit = (arr[i] // exp) % 10\n            output[count[digit] - 1] = arr[i]\n            count[digit] -= 1\n\n        # Copy back\n        for i in range(n):\n            arr[i] = output[i]\n\n        exp *= 10\n\n    return arr",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        16,
        17
      ],
      "place_element": [
        20,
        21,
        22,
        23
      ],
      "copy_back": [
        26,
        27,
        29
      ],
      "complete": [
        31
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void radixSort(int[] arr) {\n    int maxVal = Arrays.stream(arr).max().getAsInt();\n    int exp = 1;\n\n    while (maxVal / exp > 0) {\n        int n = arr.length;\n        int[] count = new int[10];\n        int[] output = new int[n];\n\n        // Count digits\n        for (int num : arr) {\n            int digit = (num / exp) % 10;\n            count[digit]++;\n        }\n\n        // Make cumulative\n        for (int i = 1; i < 10; i++) {\n            count[i] += count[i - 1];\n        }\n\n        // Build output\n        for (int i = n - 1; i >= 0; i--) {\n            int digit = (arr[i] / exp) % 10;\n            output[count[digit] - 1] = arr[i];\n            count[digit]--;\n        }\n\n        // Copy back\n        System.arraycopy(output, 0, arr, 0, n);\n        exp *= 10;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        22,
        23,
        24,
        25
      ],
      "copy_back": [
        29,
        30
      ],
      "complete": [
        32
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void radixSort(vector<int>& arr) {\n    int maxVal = *max_element(arr.begin(), arr.end());\n    int exp = 1;\n\n    while (maxVal / exp > 0) {\n        int n = arr.size();\n        vector<int> count(10, 0);\n        vector<int> output(n);\n\n        // Count digits\n        for (int num : arr) {\n            int digit = (num / exp) % 10;\n            count[digit]++;\n        }\n\n        // Make cumulative\n        for (int i = 1; i < 10; i++) {\n            count[i] += count[i - 1];\n        }\n\n        // Build output\n        for (int i = n - 1; i >= 0; i--) {\n            int digit = (arr[i] / exp) % 10;\n            output[count[digit] - 1] = arr[i];\n            count[digit]--;\n        }\n\n        // Copy back\n        arr = output;\n        exp *= 10;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        22,
        23,
        24,
        25
      ],
      "copy_back": [
        29,
        30
      ],
      "complete": [
        32
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void RadixSort(int[] arr) {\n    int maxVal = arr.Max();\n    int exp = 1;\n\n    while (maxVal / exp > 0) {\n        int n = arr.Length;\n        int[] count = new int[10];\n        int[] output = new int[n];\n\n        // Count digits\n        foreach (int num in arr) {\n            int digit = (num / exp) % 10;\n            count[digit]++;\n        }\n\n        // Make cumulative\n        for (int i = 1; i < 10; i++) {\n            count[i] += count[i - 1];\n        }\n\n        // Build output\n        for (int i = n - 1; i >= 0; i--) {\n            int digit = (arr[i] / exp) % 10;\n            output[count[digit] - 1] = arr[i];\n            count[digit]--;\n        }\n\n        // Copy back\n        Array.Copy(output, arr, n);\n        exp *= 10;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        22,
        23,
        24,
        25
      ],
      "copy_back": [
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
    "code": "func radixSort(arr []int) {\n    maxVal := arr[0]\n    for _, v := range arr {\n        if v > maxVal { maxVal = v }\n    }\n    exp := 1\n\n    for maxVal/exp > 0 {\n        n := len(arr)\n        count := make([]int, 10)\n        output := make([]int, n)\n\n        // Count digits\n        for _, num := range arr {\n            digit := (num / exp) % 10\n            count[digit]++\n        }\n\n        // Make cumulative\n        for i := 1; i < 10; i++ {\n            count[i] += count[i-1]\n        }\n\n        // Build output\n        for i := n - 1; i >= 0; i-- {\n            digit := (arr[i] / exp) % 10\n            output[count[digit]-1] = arr[i]\n            count[digit]--\n        }\n\n        // Copy back\n        copy(arr, output)\n        exp *= 10\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        8
      ],
      "extract_digit": [
        14,
        15
      ],
      "count_digit": [
        16
      ],
      "make_cumulative": [
        20,
        21
      ],
      "place_element": [
        25,
        26,
        27,
        28
      ],
      "copy_back": [
        32,
        33
      ],
      "complete": [
        35
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function radixSort(arr) {\n    const maxVal = Math.max(...arr);\n    let exp = 1;\n\n    while (Math.floor(maxVal / exp) > 0) {\n        const n = arr.length;\n        const count = new Array(10).fill(0);\n        const output = new Array(n).fill(0);\n\n        // Count digits\n        for (const num of arr) {\n            const digit = Math.floor(num / exp) % 10;\n            count[digit]++;\n        }\n\n        // Make cumulative\n        for (let i = 1; i < 10; i++) {\n            count[i] += count[i - 1];\n        }\n\n        // Build output\n        for (let i = n - 1; i >= 0; i--) {\n            const digit = Math.floor(arr[i] / exp) % 10;\n            output[count[digit] - 1] = arr[i];\n            count[digit]--;\n        }\n\n        // Copy back\n        for (let i = 0; i < n; i++) arr[i] = output[i];\n        exp *= 10;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        22,
        23,
        24,
        25
      ],
      "copy_back": [
        29,
        30
      ],
      "complete": [
        33
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function radixSort(arr: number[]): number[] {\n    const maxVal = Math.max(...arr);\n    let exp = 1;\n\n    while (Math.floor(maxVal / exp) > 0) {\n        const n = arr.length;\n        const count: number[] = new Array(10).fill(0);\n        const output: number[] = new Array(n).fill(0);\n\n        // Count digits\n        for (const num of arr) {\n            const digit = Math.floor(num / exp) % 10;\n            count[digit]++;\n        }\n\n        // Make cumulative\n        for (let i = 1; i < 10; i++) {\n            count[i] += count[i - 1];\n        }\n\n        // Build output\n        for (let i = n - 1; i >= 0; i--) {\n            const digit = Math.floor(arr[i] / exp) % 10;\n            output[count[digit] - 1] = arr[i];\n            count[digit]--;\n        }\n\n        // Copy back\n        for (let i = 0; i < n; i++) arr[i] = output[i];\n        exp *= 10;\n    }\n\n    return arr;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "new_digit": [
        5
      ],
      "extract_digit": [
        11,
        12
      ],
      "count_digit": [
        13
      ],
      "make_cumulative": [
        17,
        18
      ],
      "place_element": [
        22,
        23,
        24,
        25
      ],
      "copy_back": [
        29,
        30
      ],
      "complete": [
        33
      ]
    }
  }
};

const RadixSortPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        170,
        45,
        75,
        90,
        802,
        24,
        2,
        66
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        64,
        25,
        12,
        22,
        11
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Three Digits",
    "value": {
      "arr": [
        329,
        457,
        657,
        839,
        436,
        720,
        355
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Same Number of Digits",
    "value": {
      "arr": [
        15,
        42,
        37,
        98,
        71,
        56
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Already Sorted",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ]
    }
  }
];

function generateRadixSortSteps(t: { arr: number[] }): any[] {
  let e=[...t.arr],i=e.length,a={};for(let t=0;t<i;t++)a[`bar_${t}`]={type:"arrayElement",value:e[t],position:t};for(let t=0;t<10;t++)a[`count_${t}`]={type:"arrayElement",value:0,position:t,label:String(t)};let n=new StepRecorder({arr:[...e],n:i,exp:void 0,digitName:void 0,pass:void 0,i:void 0,curVal:void 0,digit:void 0,countVal:void 0,cumIdx:void 0,cumA:void 0,cumB:void 0,cumSum:void 0,outPos:void 0,countAfter:void 0,movedBar:void 0,moveFrom:void 0,moveTo:void 0},a);if(n.record("-","Start: sort the array with LSD radix sort"),i<=1)return 1===i&&(n.update_visual("bar_0",{type:"arrayElement",value:e[0],position:0,state:"sorted"}),n.update_visual("range_sorted",{type:"range",start:0,end:0,label:"sorted",state:"sorted"})),n.record("complete","Array is already sorted"),n.getSteps();let l=Math.max(...e),o=["ones","tens","hundreds","thousands"],s=e.map((t,e)=>e),u=[...e],d=(t,e,i)=>{n.update_visual(`count_${t}`,{type:"arrayElement",value:e,position:t,label:String(t),...i?{state:i}:{}})},c=1,p=0;for(;Math.floor(l/c)>0;){let t=++p-1<o.length?o[p-1]:`10^${p-1}`;n.update_variable("exp",c),n.update_variable("digitName",t),n.update_variable("pass",p);let r=Array(10).fill(0);for(let t=0;t<10;t++)d(t,0);n.record("new_digit",`Pass ${p}: counting sort the array by the ${t} digit (exp = ${c})`);for(let e=0;e<i;e++){let i=s[e],a=u[i],l=Math.floor(a/c)%10;n.update_variable("i",e),n.update_variable("curVal",a),n.update_variable("digit",l),n.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:e,state:"active"}),d(l,r[l],"hot"),n.record("extract_digit",`(${a} / ${c}) % 10 = ${l}: the ${t} digit of ${a} is ${l}`),r[l]++,n.update_variable("countVal",r[l]),d(l,r[l],"hot"),n.record("count_digit",`count[${l}] becomes ${r[l]}`),n.update_visual(`bar_${i}`,{type:"arrayElement",value:a,position:e}),d(l,r[l])}for(let t=1;t<10;t++){let e=r[t];r[t]+=r[t-1],r[t-1]>0&&(n.update_variable("cumIdx",t),n.update_variable("cumA",r[t-1]),n.update_variable("cumB",e),n.update_variable("cumSum",r[t]),d(t-1,r[t-1],"src"),d(t,r[t],"dst"),n.record("make_cumulative",`count[${t}] = ${e} + ${r[t-1]} = ${r[t]}`),d(t-1,r[t-1]),d(t,r[t]))}let a=Array(i).fill(-1);for(let t=i-1;t>=0;t--){let e=s[t],i=u[e],l=Math.floor(i/c)%10,o=r[l]-1;r[l]--,a[o]=e,n.update_variable("i",t),n.update_variable("curVal",i),n.update_variable("digit",l),n.update_variable("outPos",o),n.update_variable("countAfter",r[l]),n.update_variable("movedBar",`bar_${e}`),n.update_variable("moveFrom",t),n.update_variable("moveTo",o),n.update_visual(`bar_${e}`,{type:"arrayElement",value:i,position:o,state:"placed"}),d(l,r[l],"hot"),n.record("place_element",`${i} (digit ${l}) goes to output[${o}]; count[${l}] drops to ${r[l]}`),d(l,r[l])}let l=(s=a).map(t=>u[t]);for(let t=0;t<i;t++)e[t]=l[t],n.update_visual(`bar_${s[t]}`,{type:"arrayElement",value:l[t],position:t,state:"rising"});n.update_variable("arr",[...e]),n.record("copy_back",`Pass ${p} done: the output becomes the array, now ordered by the ${t} digit`);for(let t=0;t<i;t++)n.update_visual(`bar_${s[t]}`,{type:"arrayElement",value:l[t],position:t});c*=10}for(let t=0;t<i;t++)n.update_visual(`bar_${s[t]}`,{type:"arrayElement",value:u[s[t]],position:t,state:"sorted"});return n.update_visual("range_sorted",{type:"range",start:0,end:i-1,label:"sorted",state:"sorted"}),n.record("complete","Radix sort complete: the array is sorted"),n.getSteps()
}

export function RadixSortProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RadixSortTemplates,
      generateSteps: (t: { arr: number[] }) => {
        const recorded = generateRadixSortSteps(t) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Radix Sort"
      slug="radix-sort"
      approaches={approaches}
      presets={RadixSortPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}

// ==========================================
// Sort an Array (sort-an-array)
// ==========================================

const SortAnArrayTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def sortArray(self, nums: list[int]) -> list[int]:\n        if len(nums) <= 1:\n            return nums\n\n        self._merge_sort(nums, 0, len(nums) - 1)\n        return nums\n\n    def _merge_sort(self, nums: list[int], left: int, right: int) -> None:\n        if left >= right:\n            return\n\n        mid = left + (right - left) // 2\n        self._merge_sort(nums, left, mid)\n        self._merge_sort(nums, mid + 1, right)\n        self._merge(nums, left, mid, right)\n\n    def _merge(self, nums: list[int], left: int, mid: int, right: int) -> None:\n        # Create temp array for the merged result\n        temp = []\n        i, j = left, mid + 1\n\n        # Compare elements from both halves and pick the smaller one\n        while i <= mid and j <= right:\n            if nums[i] <= nums[j]:\n                temp.append(nums[i])\n                i += 1\n            else:\n                temp.append(nums[j])\n                j += 1\n\n        # Copy remaining elements from left half\n        while i <= mid:\n            temp.append(nums[i])\n            i += 1\n\n        # Copy remaining elements from right half\n        while j <= right:\n            temp.append(nums[j])\n            j += 1\n\n        # Copy merged result back to original array\n        for p in range(len(temp)):\n            nums[left + p] = temp[p]",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        10,
        11
      ],
      "calc_mid": [
        13
      ],
      "recurse_left": [
        14
      ],
      "recurse_right": [
        15
      ],
      "merge_start": [
        16
      ],
      "compare": [
        24,
        25
      ],
      "pick_left": [
        26,
        27
      ],
      "pick_right": [
        29,
        30
      ],
      "copy_remaining": [
        33,
        34,
        35,
        38,
        39,
        40
      ],
      "copy_back": [
        43,
        44
      ],
      "merge_complete": [
        16
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {
      "compare": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int[] sortArray(int[] nums) {\n        if (nums.length <= 1) return nums;\n        mergeSort(nums, 0, nums.length - 1);\n        return nums;\n    }\n\n    private void mergeSort(int[] nums, int left, int right) {\n        if (left >= right) return;\n\n        int mid = left + (right - left) / 2;\n        mergeSort(nums, left, mid);\n        mergeSort(nums, mid + 1, right);\n        merge(nums, left, mid, right);\n    }\n\n    private void merge(int[] nums, int left, int mid, int right) {\n        // Create temp array for the merged result\n        int[] temp = new int[right - left + 1];\n        int i = left, j = mid + 1, k = 0;\n\n        // Compare elements from both halves and pick the smaller one\n        while (i <= mid && j <= right) {\n            if (nums[i] <= nums[j]) {\n                temp[k++] = nums[i++];\n            } else {\n                temp[k++] = nums[j++];\n            }\n        }\n\n        // Copy remaining elements from left half\n        while (i <= mid) temp[k++] = nums[i++];\n\n        // Copy remaining elements from right half\n        while (j <= right) temp[k++] = nums[j++];\n\n        // Copy merged result back to original array\n        for (int p = 0; p < temp.length; p++) {\n            nums[left + p] = temp[p];\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        9
      ],
      "calc_mid": [
        11
      ],
      "recurse_left": [
        12
      ],
      "recurse_right": [
        13
      ],
      "merge_start": [
        14
      ],
      "compare": [
        23,
        24
      ],
      "pick_left": [
        25
      ],
      "pick_right": [
        27
      ],
      "copy_remaining": [
        32,
        35
      ],
      "copy_back": [
        38,
        39
      ],
      "merge_complete": [
        14
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "compare": [
        24
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> sortArray(vector<int>& nums) {\n        if (nums.size() <= 1) return nums;\n        mergeSort(nums, 0, nums.size() - 1);\n        return nums;\n    }\n\nprivate:\n    void mergeSort(vector<int>& nums, int left, int right) {\n        if (left >= right) return;\n\n        int mid = left + (right - left) / 2;\n        mergeSort(nums, left, mid);\n        mergeSort(nums, mid + 1, right);\n        merge(nums, left, mid, right);\n    }\n\n    void merge(vector<int>& nums, int left, int mid, int right) {\n        // Create temp array for the merged result\n        vector<int> temp;\n        int i = left, j = mid + 1;\n\n        // Compare elements from both halves and pick the smaller one\n        while (i <= mid && j <= right) {\n            if (nums[i] <= nums[j]) {\n                temp.push_back(nums[i++]);\n            } else {\n                temp.push_back(nums[j++]);\n            }\n        }\n\n        // Copy remaining elements from left half\n        while (i <= mid) temp.push_back(nums[i++]);\n\n        // Copy remaining elements from right half\n        while (j <= right) temp.push_back(nums[j++]);\n\n        // Copy merged result back to original array\n        for (int p = 0; p < temp.size(); p++) {\n            nums[left + p] = temp[p];\n        }\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "base_case": [
        11
      ],
      "calc_mid": [
        13
      ],
      "recurse_left": [
        14
      ],
      "recurse_right": [
        15
      ],
      "merge_start": [
        16
      ],
      "compare": [
        25,
        26
      ],
      "pick_left": [
        27
      ],
      "pick_right": [
        29
      ],
      "copy_remaining": [
        34,
        37
      ],
      "copy_back": [
        40,
        41
      ],
      "merge_complete": [
        16
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "compare": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int[] SortArray(int[] nums) {\n        if (nums.Length <= 1) return nums;\n        MergeSort(nums, 0, nums.Length - 1);\n        return nums;\n    }\n\n    private void MergeSort(int[] nums, int left, int right) {\n        if (left >= right) return;\n\n        int mid = left + (right - left) / 2;\n        MergeSort(nums, left, mid);\n        MergeSort(nums, mid + 1, right);\n        Merge(nums, left, mid, right);\n    }\n\n    private void Merge(int[] nums, int left, int mid, int right) {\n        // Create temp array for the merged result\n        int[] temp = new int[right - left + 1];\n        int i = left, j = mid + 1, k = 0;\n\n        // Compare elements from both halves and pick the smaller one\n        while (i <= mid && j <= right) {\n            if (nums[i] <= nums[j]) {\n                temp[k++] = nums[i++];\n            } else {\n                temp[k++] = nums[j++];\n            }\n        }\n\n        // Copy remaining elements from left half\n        while (i <= mid) temp[k++] = nums[i++];\n\n        // Copy remaining elements from right half\n        while (j <= right) temp[k++] = nums[j++];\n\n        // Copy merged result back to original array\n        for (int p = 0; p < temp.Length; p++) {\n            nums[left + p] = temp[p];\n        }\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        9
      ],
      "calc_mid": [
        11
      ],
      "recurse_left": [
        12
      ],
      "recurse_right": [
        13
      ],
      "merge_start": [
        14
      ],
      "compare": [
        23,
        24
      ],
      "pick_left": [
        25
      ],
      "pick_right": [
        27
      ],
      "copy_remaining": [
        32,
        35
      ],
      "copy_back": [
        38,
        39
      ],
      "merge_complete": [
        14
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {
      "compare": [
        24
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sortArray(nums []int) []int {\n    if len(nums) <= 1 {\n        return nums\n    }\n    mergeSort(nums, 0, len(nums)-1)\n    return nums\n}\n\nfunc mergeSort(nums []int, left, right int) {\n    if left >= right {\n        return\n    }\n\n    mid := left + (right-left)/2\n    mergeSort(nums, left, mid)\n    mergeSort(nums, mid+1, right)\n    mergeParts(nums, left, mid, right)\n}\n\nfunc mergeParts(nums []int, left, mid, right int) {\n    // Create temp slice for the merged result\n    temp := make([]int, 0, right-left+1)\n    i, j := left, mid+1\n\n    // Compare elements from both halves and pick the smaller one\n    for i <= mid && j <= right {\n        if nums[i] <= nums[j] {\n            temp = append(temp, nums[i])\n            i++\n        } else {\n            temp = append(temp, nums[j])\n            j++\n        }\n    }\n\n    // Copy remaining elements from left half\n    for i <= mid {\n        temp = append(temp, nums[i])\n        i++\n    }\n\n    // Copy remaining elements from right half\n    for j <= right {\n        temp = append(temp, nums[j])\n        j++\n    }\n\n    // Copy merged result back to original array\n    for p := 0; p < len(temp); p++ {\n        nums[left+p] = temp[p]\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        10,
        11
      ],
      "calc_mid": [
        14
      ],
      "recurse_left": [
        15
      ],
      "recurse_right": [
        16
      ],
      "merge_start": [
        17
      ],
      "compare": [
        26,
        27
      ],
      "pick_left": [
        28,
        29
      ],
      "pick_right": [
        31,
        32
      ],
      "copy_remaining": [
        37,
        38,
        39,
        43,
        44,
        45
      ],
      "copy_back": [
        49,
        50
      ],
      "merge_complete": [
        17
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {
      "compare": [
        27
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var sortArray = function(nums) {\n    if (nums.length <= 1) return nums;\n    mergeSort(nums, 0, nums.length - 1);\n    return nums;\n};\n\nfunction mergeSort(nums, left, right) {\n    if (left >= right) return;\n\n    var mid = left + Math.floor((right - left) / 2);\n    mergeSort(nums, left, mid);\n    mergeSort(nums, mid + 1, right);\n    merge(nums, left, mid, right);\n}\n\nfunction merge(nums, left, mid, right) {\n    // Create temp array for the merged result\n    var temp = [];\n    var i = left, j = mid + 1;\n\n    // Compare elements from both halves and pick the smaller one\n    while (i <= mid && j <= right) {\n        if (nums[i] <= nums[j]) {\n            temp.push(nums[i++]);\n        } else {\n            temp.push(nums[j++]);\n        }\n    }\n\n    // Copy remaining elements from left half\n    while (i <= mid) temp.push(nums[i++]);\n\n    // Copy remaining elements from right half\n    while (j <= right) temp.push(nums[j++]);\n\n    // Copy merged result back to original array\n    for (var p = 0; p < temp.length; p++) {\n        nums[left + p] = temp[p];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        8
      ],
      "calc_mid": [
        10
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        12
      ],
      "merge_start": [
        13
      ],
      "compare": [
        22,
        23
      ],
      "pick_left": [
        24
      ],
      "pick_right": [
        26
      ],
      "copy_remaining": [
        31,
        34
      ],
      "copy_back": [
        37,
        38
      ],
      "merge_complete": [
        13
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "compare": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortArray(nums: number[]): number[] {\n    if (nums.length <= 1) return nums;\n    mergeSort(nums, 0, nums.length - 1);\n    return nums;\n}\n\nfunction mergeSort(nums: number[], left: number, right: number): void {\n    if (left >= right) return;\n\n    const mid = left + Math.floor((right - left) / 2);\n    mergeSort(nums, left, mid);\n    mergeSort(nums, mid + 1, right);\n    merge(nums, left, mid, right);\n}\n\nfunction merge(nums: number[], left: number, mid: number, right: number): void {\n    // Create temp array for the merged result\n    const temp: number[] = [];\n    let i = left, j = mid + 1;\n\n    // Compare elements from both halves and pick the smaller one\n    while (i <= mid && j <= right) {\n        if (nums[i] <= nums[j]) {\n            temp.push(nums[i++]);\n        } else {\n            temp.push(nums[j++]);\n        }\n    }\n\n    // Copy remaining elements from left half\n    while (i <= mid) temp.push(nums[i++]);\n\n    // Copy remaining elements from right half\n    while (j <= right) temp.push(nums[j++]);\n\n    // Copy merged result back to original array\n    for (let p = 0; p < temp.length; p++) {\n        nums[left + p] = temp[p];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        8
      ],
      "calc_mid": [
        10
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        12
      ],
      "merge_start": [
        13
      ],
      "compare": [
        22,
        23
      ],
      "pick_left": [
        24
      ],
      "pick_right": [
        26
      ],
      "copy_remaining": [
        31,
        34
      ],
      "copy_back": [
        37,
        38
      ],
      "merge_complete": [
        13
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {
      "compare": [
        23
      ]
    }
  }
};

const SortAnArrayPresets: PresetOption<{ arr: number[] }>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        38,
        27,
        43,
        3,
        9,
        82,
        10
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        8,
        1,
        9,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Reverse Sorted",
    "value": {
      "arr": [
        9,
        8,
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
    "value": {
      "arr": [
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
    "label": "Nearly Sorted",
    "value": {
      "arr": [
        1,
        3,
        2,
        4,
        5
      ]
    }
  },
  {
    "id": "ex6",
    "label": "All Equal",
    "value": {
      "arr": [
        42,
        42,
        42,
        42
      ]
    }
  }
];

function generateSortAnArraySteps(e: { arr: number[] }): any[] {
  let t=[...e.arr],r=t.length,i=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=t.map((e,t)=>t),n=new RecursiveStepRecorder({arr:[...t]},{...i});if(n.pushCallFrame({arr:"[...]"},"sortArray"),n.record("-","Start: Sort array using recursive merge sort"),r<=1)return 1===r&&n.update_visual("bar_0",{type:"arrayElement",value:t[0],position:0,state:"sorted"}),n.record("complete","Array already sorted"),n.popCallFrame(),n.getSteps();!function e(t,r,a,i,l){if(i.pushCallFrame({left:r,right:a},"mergeSort"),r>=a){i.record("base_case",`Base case: subarray [${r}..${a}] has ${r===a?"1 element":"0 elements"}, already sorted`),i.popCallFrame();return}let n=r+Math.floor((a-r)/2);i.update_frame_variable("mid",n),i.update_visual("range_left",{type:"range",start:r,end:n,label:"left",state:"left"}),i.update_visual("range_right",{type:"range",start:n+1,end:a,label:"right",state:"right"});for(let e=r;e<=n;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"left"})}for(let e=n+1;e<=a;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"right"})}i.record("calc_mid",`Calculate mid = ${r} + (${a} - ${r}) / 2 = ${n}. Split [${r}..${a}] into [${r}..${n}] and [${n+1}..${a}]`),i.delete_visual("range_left"),i.delete_visual("range_right");for(let e=r;e<=a;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e})}i.record("recurse_left",`Recurse on left half: mergeSort(${r}, ${n})`),e(t,r,n,i,l),i.record("recurse_right",`Recurse on right half: mergeSort(${n+1}, ${a})`),e(t,n+1,a,i,l),i.update_visual("range_left",{type:"range",start:r,end:n,label:"left",state:"left"}),i.update_visual("range_right",{type:"range",start:n+1,end:a,label:"right",state:"right"});for(let e=r;e<=n;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"left"})}for(let e=n+1;e<=a;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"right"})}i.record("merge_start",`Merge sorted halves [${t.slice(r,n+1).join(", ")}] and [${t.slice(n+1,a+1).join(", ")}]`),function(e,t,r,a,i,l){let n=[],s=[],m=t,o=r+1,u=0;for(;m<=r&&o<=a;){let t=l.indexOf(m),p=l.indexOf(o);if(i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[m],position:m,state:"comparing"}),i.update_visual(`bar_${p}`,{type:"arrayElement",value:e[o],position:o,state:"comparing"}),i.add_conditional("compare",e[m]<=e[o]),i.record("compare",`Compare arr[${m}] = ${e[m]} with arr[${o}] = ${e[o]}`),e[m]<=e[o]?(n.push(e[m]),s.push(t),i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[m],position:m,state:"merged"}),i.update_visual(`temp_${u}`,{type:"tempElement",value:e[m],position:u}),u++,i.record("pick_left",`Pick ${e[m]} from left subarray → temp[${u-1}]`),m++):(n.push(e[o]),s.push(p),i.update_visual(`bar_${p}`,{type:"arrayElement",value:e[o],position:o,state:"merged"}),i.update_visual(`temp_${u}`,{type:"tempElement",value:e[o],position:u}),u++,i.record("pick_right",`Pick ${e[o]} from right subarray → temp[${u-1}]`),o++),m<=r){let t=l.indexOf(m);i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[m],position:m,state:"left"})}if(o<=a){let t=l.indexOf(o);i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"right"})}}for(;m<=r;){let t=l.indexOf(m);n.push(e[m]),s.push(t),i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[m],position:m,state:"merged"}),i.update_visual(`temp_${u}`,{type:"tempElement",value:e[m],position:u}),u++,i.record("copy_remaining",`Copy remaining ${e[m]} from left → temp[${u-1}]`),m++}for(;o<=a;){let t=l.indexOf(o);n.push(e[o]),s.push(t),i.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"merged"}),i.update_visual(`temp_${u}`,{type:"tempElement",value:e[o],position:u}),u++,i.record("copy_remaining",`Copy remaining ${e[o]} from right → temp[${u-1}]`),o++}for(let r=0;r<n.length;r++){let a=t+r;e[a]=n[r],l[s[r]]=a,i.update_visual(`bar_${s[r]}`,{type:"arrayElement",value:n[r],position:a,state:"merged"}),i.delete_visual(`temp_${r}`)}i.record("copy_back",`Copy temp back to arr[${t}..${a}]: [${n.join(", ")}]`)}(t,r,n,a,i,l),i.delete_visual("range_left"),i.delete_visual("range_right");for(let e=r;e<=a;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"merged"})}i.update_global_variable("arr",[...t]),i.record("merge_complete",`Merge complete: [${t.slice(r,a+1).join(", ")}]`);for(let e=r;e<=a;e++){let r=l.indexOf(e);i.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e})}i.popCallFrame()}(t,0,r-1,n,l);for(let e=0;e<r;e++){let r=l.indexOf(e);n.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"sorted"})}return n.update_global_variable("arr",[...t]),n.record("complete","Merge sort complete! Array is sorted."),n.popCallFrame(),n.getSteps()
}

export function SortAnArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SortAnArrayTemplates,
      generateSteps: (e: { arr: number[] }) => {
        const recorded = generateSortAnArraySteps(e) as any[];
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
            <ArrayVisualizer
              variant="bars"
              elements={elements}
              pointers={pointers}
              height={320}
              hudLeft={typeof (step.variables||{}).i === "number" ? <text fill="#8b8b93">pass = <tspan fill="#00ceff">{(step.variables||{}).i + 1}</tspan></text> : undefined}
              hudRight={typeof (step.variables||{}).min_idx === "number" ? <text fill="#8b8b93">min_idx = <tspan fill="#ffa94d">{(step.variables||{}).min_idx}</tspan></text> : undefined}
              centerEquation={(step.variables||{}).leftVal != null && (step.variables||{}).rightVal != null ? <text fill="#f4f4f5" fontSize={15} fontWeight={800}><tspan fill="#00ceff">{(step.variables||{}).leftVal}</tspan> <tspan fill="#8b8b93">{typeof (step.variables||{}).min_idx === "number" ? "<" : ">"}</tspan> <tspan fill="#ffa94d">{(step.variables||{}).rightVal}</tspan> <tspan fill="#8b8b93">?</tspan></text> : undefined}
            />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Sort an Array"
      slug="sort-an-array"
      approaches={approaches}
      presets={SortAnArrayPresets}
      formatInputDisplay={(input: { arr: number[] }) => `arr = [${input.arr ? input.arr.join(", ") : ""}]`}
    />
  );
}
