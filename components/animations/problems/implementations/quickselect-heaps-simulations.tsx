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
// Sort Colors (sort-colors)
// ==========================================

const SortColorsTemplates = {
  "python": {
    "language": "python",
    "code": "def sortColors(nums):\n    low, mid, high = 0, 0, len(nums) - 1\n\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1\n            mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6
      ],
      "swap_two": [
        12
      ],
      "no_swap": [
        6
      ],
      "move_zero": [
        7,
        8
      ],
      "keep_one": [
        10
      ],
      "move_two": [
        13
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void sortColors(int[] nums) {\n    int low = 0, mid = 0, high = nums.length - 1;\n\n    while (mid <= high) {\n        if (nums[mid] == 0) {\n            int temp = nums[low];\n            nums[low] = nums[mid];\n            nums[mid] = temp;\n            low++;\n            mid++;\n        } else if (nums[mid] == 1) {\n            mid++;\n        } else {\n            int temp = nums[mid];\n            nums[mid] = nums[high];\n            nums[high] = temp;\n            high--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6,
        7,
        8
      ],
      "swap_two": [
        14,
        15,
        16
      ],
      "no_swap": [
        6,
        7,
        8
      ],
      "move_zero": [
        9,
        10
      ],
      "keep_one": [
        12
      ],
      "move_two": [
        17
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void sortColors(vector<int>& nums) {\n    int low = 0, mid = 0, high = nums.size() - 1;\n\n    while (mid <= high) {\n        if (nums[mid] == 0) {\n            swap(nums[low], nums[mid]);\n            low++;\n            mid++;\n        } else if (nums[mid] == 1) {\n            mid++;\n        } else {\n            swap(nums[mid], nums[high]);\n            high--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6
      ],
      "swap_two": [
        12
      ],
      "no_swap": [
        6
      ],
      "move_zero": [
        7,
        8
      ],
      "keep_one": [
        10
      ],
      "move_two": [
        13
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void SortColors(int[] nums) {\n    int low = 0, mid = 0, high = nums.Length - 1;\n\n    while (mid <= high) {\n        if (nums[mid] == 0) {\n            int temp = nums[low];\n            nums[low] = nums[mid];\n            nums[mid] = temp;\n            low++;\n            mid++;\n        } else if (nums[mid] == 1) {\n            mid++;\n        } else {\n            int temp = nums[mid];\n            nums[mid] = nums[high];\n            nums[high] = temp;\n            high--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6,
        7,
        8
      ],
      "swap_two": [
        15,
        16,
        17
      ],
      "no_swap": [
        6,
        7,
        8
      ],
      "move_zero": [
        9,
        10
      ],
      "keep_one": [
        12
      ],
      "move_two": [
        17
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func sortColors(nums []int) {\n    low, mid, high := 0, 0, len(nums) - 1\n\n    for mid <= high {\n        if nums[mid] == 0 {\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low++\n            mid++\n        } else if nums[mid] == 1 {\n            mid++\n        } else {\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high--\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6
      ],
      "swap_two": [
        12
      ],
      "no_swap": [
        6
      ],
      "move_zero": [
        7,
        8
      ],
      "keep_one": [
        10
      ],
      "move_two": [
        13
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function sortColors(nums) {\n    let low = 0, mid = 0, high = nums.length - 1;\n\n    while (mid <= high) {\n        if (nums[mid] === 0) {\n            [nums[low], nums[mid]] = [nums[mid], nums[low]];\n            low++;\n            mid++;\n        } else if (nums[mid] === 1) {\n            mid++;\n        } else {\n            [nums[mid], nums[high]] = [nums[high], nums[mid]];\n            high--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6
      ],
      "swap_two": [
        12
      ],
      "no_swap": [
        6
      ],
      "move_zero": [
        7,
        8
      ],
      "keep_one": [
        10
      ],
      "move_two": [
        13
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sortColors(nums: number[]): void {\n    let low = 0, mid = 0, high = nums.length - 1;\n\n    while (mid <= high) {\n        if (nums[mid] === 0) {\n            [nums[low], nums[mid]] = [nums[mid], nums[low]];\n            low++;\n            mid++;\n        } else if (nums[mid] === 1) {\n            mid++;\n        } else {\n            [nums[mid], nums[high]] = [nums[high], nums[mid]];\n            high--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2
      ],
      "check": [
        4
      ],
      "swap_zero": [
        6
      ],
      "swap_two": [
        12
      ],
      "no_swap": [
        6
      ],
      "move_zero": [
        7,
        8
      ],
      "keep_one": [
        10
      ],
      "move_two": [
        13
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {
      "while_loop": [
        4
      ],
      "check_value": [
        5
      ],
      "is_zero": [
        5
      ],
      "is_one": [
        9
      ]
    }
  }
};

const SortColorsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        2,
        0,
        2,
        1,
        1,
        0
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        2,
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
        0,
        1,
        2,
        0,
        1,
        2
      ]
    }
  }
];

function generateSortColorsSteps(e: any): any[] {
  

let t=[...e.nums],i=t.length,r=t.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i,fontSize:22},e),{}),l=t.map((e,t)=>t),o=[...t],s=new StepRecorder({nums:[...t],n:i},{...r});s.record("-","Start: Sort colors using Dutch National Flag algorithm");let a=0,u=0,d=i-1;for(s.add_new_variable("low",a),s.add_new_variable("mid",u),s.add_new_variable("high",d),s.update_visual("ptr_low",{type:"pointer",position:a,label:"low"}),s.update_visual("ptr_mid",{type:"pointer",position:u,label:"mid"}),s.update_visual("ptr_high",{type:"pointer",position:d,label:"high"}),s.record("initialize",`Initialize low=0, mid=0, high=${i-1}`);u<=d;){s.add_conditional("while_loop",!0);for(let e=0;e<i;e++){let t=l.indexOf(e);s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[e],position:e,fontSize:22})}for(let e=0;e<a;e++){let t=l.indexOf(e);s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[e],position:e,state:"complete",fontSize:22})}if(s.add_conditional("check_value",o[u]),s.record("check",`Check nums[mid=${u}] = ${o[u]}`),0===o[u]){if(s.add_conditional("is_zero",!0),a!==u){let e=l.indexOf(a),i=l.indexOf(u);[t[a],t[u]]=[t[u],t[a]],[o[a],o[u]]=[o[u],o[a]],[l[e],l[i]]=[u,a],s.update_variable("nums",[...t]),s.update_visual(`elem_${e}`,{type:"arrayElement",value:o[u],position:u,state:"swapping",fontSize:22}),s.update_visual(`elem_${i}`,{type:"arrayElement",value:o[a],position:a,state:"swapping",fontSize:22}),s.record("swap_zero",`Swap nums[low=${a}] ↔ nums[mid=${u}]`)}else s.record("no_swap","low == mid, no swap needed");a++,u++,s.update_variable("low",a),s.update_variable("mid",u),s.update_visual("ptr_low",{type:"pointer",position:a,label:"low"}),s.update_visual("ptr_mid",{type:"pointer",position:u,label:"mid"}),s.record("move_zero",`Moved 0 to sorted region, low=${a}, mid=${u}`)}else if(1===o[u])s.add_conditional("is_zero",!1),s.add_conditional("is_one",!0),u++,s.update_variable("mid",u),s.update_visual("ptr_mid",{type:"pointer",position:u,label:"mid"}),s.record("keep_one",`1 is in correct region, mid=${u}`);else{s.add_conditional("is_zero",!1),s.add_conditional("is_one",!1);let e=l.indexOf(u),i=l.indexOf(d);[t[u],t[d]]=[t[d],t[u]],[o[u],o[d]]=[o[d],o[u]],[l[e],l[i]]=[d,u],s.update_variable("nums",[...t]),s.update_visual(`elem_${e}`,{type:"arrayElement",value:o[d],position:d,state:"swapping",fontSize:22}),s.update_visual(`elem_${i}`,{type:"arrayElement",value:o[u],position:u,state:"swapping",fontSize:22}),s.record("swap_two",`Swap nums[mid=${u}] ↔ nums[high=${d}]`),d--,s.update_variable("high",d),s.update_visual("ptr_high",{type:"pointer",position:d,label:"high"}),s.record("move_two",`Moved 2 to sorted region, high=${d} (mid stays at ${u})`)}}s.add_conditional("while_loop",!1),s.delete_visual("ptr_low"),s.delete_visual("ptr_mid"),s.delete_visual("ptr_high"),s.delete_variable("low"),s.delete_variable("mid"),s.delete_variable("high");for(let e=0;e<i;e++){let t=l.indexOf(e);s.update_visual(`elem_${t}`,{type:"arrayElement",value:o[e],position:e,state:"complete",fontSize:22})}return s.record("complete",`Array sorted: [${t.join(", ")}]`),s.getSteps()
}

export function SortColorsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SortColorsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSortColorsSteps(e) as any[];
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
      title="Sort Colors"
      slug="sort-colors"
      approaches={approaches}
      presets={SortColorsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Kth Largest Element in an Array (kth-largest-element-in-an-array)
// ==========================================

const KthLargestElementInAnArrayTemplates = {
  "python": {
    "language": "python",
    "code": "def findKthLargest(nums, k):\n    min_heap = []\n\n    for num in nums:\n        heappush(min_heap, num)\n\n        if len(min_heap) > k:\n            heappop(min_heap)\n\n    return min_heap[0]",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        10
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);\n\n    for (int num : nums) {\n        minHeap.add(num);\n\n        if (minHeap.size() > k) {\n            minHeap.poll();\n        }\n    }\n\n    return minHeap.peek();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        12
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n\n    for (int num : nums) {\n        minHeap.push(num);\n\n        if (minHeap.size() > k) {\n            minHeap.pop();\n        }\n    }\n\n    return minHeap.top();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        12
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindKthLargest(int[] nums, int k) {\n    PriorityQueue<int, int> minHeap = new PriorityQueue<int, int>();\n\n    foreach (int num in nums) {\n        minHeap.Enqueue(num, num);\n\n        if (minHeap.Count > k) {\n            minHeap.Dequeue();\n        }\n    }\n\n    return minHeap.Peek();\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        12
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findKthLargest(nums []int, k int) int {\n    minHeap := &IntHeap{}\n    heap.Init(minHeap)\n\n    for _, num := range nums {\n        heap.Push(minHeap, num)\n\n        if minHeap.Len() > k {\n            heap.Pop(minHeap)\n        }\n    }\n\n    return (*minHeap)[0]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        5
      ],
      "add_to_heap": [
        6
      ],
      "remove_min": [
        9
      ],
      "result": [
        13
      ]
    },
    "conditionalMap": {
      "check_size": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findKthLargest(nums, k) {\n    const minHeap = new MinPriorityQueue();\n\n    for (const num of nums) {\n        minHeap.enqueue(num);\n\n        if (minHeap.size() > k) {\n            minHeap.dequeue();\n        }\n    }\n\n    return minHeap.front().element;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        12
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findKthLargest(nums: number[], k: number): number {\n    const minHeap = new MinPriorityQueue<number>();\n\n    for (const num of nums) {\n        minHeap.enqueue(num);\n\n        if (minHeap.size() > k) {\n            minHeap.dequeue();\n        }\n    }\n\n    return minHeap.front().element;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "check_element": [
        4
      ],
      "add_to_heap": [
        5
      ],
      "remove_min": [
        8
      ],
      "result": [
        12
      ]
    },
    "conditionalMap": {
      "check_size": [
        7
      ]
    }
  }
};

const KthLargestElementInAnArrayPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        3,
        2,
        1,
        5,
        6,
        4
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "nums": [
        3,
        2,
        3,
        1,
        2,
        4,
        5,
        5,
        6
      ],
      "k": 4
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        7,
        6,
        5,
        4,
        3,
        2,
        1
      ],
      "k": 3
    }
  }
];

function generateKthLargestElementInAnArraySteps(e: any): any[] {
  class a{push(e,t){this.heap.push([e,t]),this.bubbleUp(this.heap.length-1)}pop(){if(0===this.heap.length)return;if(1===this.heap.length)return this.heap.pop();let e=this.heap[0];return this.heap[0]=this.heap.pop(),this.bubbleDown(0),e}size(){return this.heap.length}raw(){return this.heap}bubbleUp(e){for(;e>0;){let t=Math.floor((e-1)/2);if(this.heap[e][0]>=this.heap[t][0])break;[this.heap[e],this.heap[t]]=[this.heap[t],this.heap[e]],e=t}}bubbleDown(e){let t=this.heap.length;for(;;){let n=e,i=2*e+1,a=2*e+2;if(i<t&&this.heap[i][0]<this.heap[n][0]&&(n=i),a<t&&this.heap[a][0]<this.heap[n][0]&&(n=a),n===e)break;[this.heap[e],this.heap[n]]=[this.heap[n],this.heap[e]],e=n}}constructor(){this.heap=[]}}

let t=[...e.nums],n=e.k,r=t.length,s={};t.forEach((e,t)=>{s[`elem_${t}`]={type:"arrayElement",value:e,position:t}});let o=new StepRecorder({nums:[...t],k:n,n:r,phase:"scan",evictedList:[]},s);o.record("-",`Find the ${n}${l(n)} largest element with a size-${n} min-heap`);let u=new a,d=0,h=[],c=()=>{u.raw().forEach(([e,t],n)=>{o.update_visual(`heap_${t}`,{type:"arrayElement",value:e,position:n,slot:n,state:"sorted"})})},p=()=>u.size()>0?u.raw()[0][0]:void 0;for(let e=0;e<r;e++){o.delete_variable("addedIdx"),o.delete_variable("addedId"),o.delete_variable("evictedVal"),o.delete_variable("evictedId"),o.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),o.update_visual("curr",{type:"pointer",position:e,label:"curr",state:"active"}),o.update_variable("i",e),o.update_variable("curVal",t[e]),o.update_variable("heapSize",u.size()),o.update_variable("rootVal",p()),o.record("check_element",`Look at nums[${e}] = ${t[e]}`);let i=`${d++}`;if(u.push(t[e],i),c(),o.update_variable("addedIdx",e),o.update_variable("addedId",i),o.update_variable("heapSize",u.size()),o.update_variable("rootVal",p()),o.record("add_to_heap",`Push ${t[e]} onto the min-heap (size ${u.size()})`),u.size()>n){o.add_conditional("check_size",!0);let[e,t]=u.pop();o.delete_visual(`heap_${t}`),c(),h.push(e),o.update_variable("evictedVal",e),o.update_variable("evictedId",t),o.update_variable("evictedList",[...h]),o.update_variable("heapSize",u.size()),o.update_variable("rootVal",p()),o.record("remove_min",`size ${u.size()+1} > ${n} → evict the smallest, ${e} (too small for the top ${n})`)}else o.add_conditional("check_size",!1);o.update_visual(`elem_${e}`,{type:"arrayElement",value:t[e],position:e,done:!0})}o.delete_visual("curr"),o.delete_variable("i"),o.delete_variable("curVal"),o.delete_variable("addedIdx"),o.delete_variable("addedId"),o.delete_variable("evictedVal"),o.delete_variable("evictedId");let m=p();return o.update_variable("result",m),o.update_variable("phase","done"),o.record("result",`The heap root is the ${n}${l(n)} largest = ${m}`),o.getSteps()
}

export function KthLargestElementInAnArrayProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: KthLargestElementInAnArrayTemplates,
      generateSteps: (e: any) => {
        const recorded = generateKthLargestElementInAnArraySteps(e) as any[];
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
      title="Kth Largest Element in an Array"
      slug="kth-largest-element-in-an-array"
      approaches={approaches}
      presets={KthLargestElementInAnArrayPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
