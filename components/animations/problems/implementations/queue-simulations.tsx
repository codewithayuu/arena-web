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
// Reveal Cards In Increasing Order (reveal-cards-in-increasing-order)
// ==========================================

const RevealCardsInIncreasingOrderTemplates = {
  "python": {
    "language": "python",
    "code": "def deckRevealedIncreasing(deck):\n    n = len(deck)\n    deck.sort()\n\n    # Queue of indices to simulate the reveal process\n    queue = deque(range(n))\n\n    result = [0] * n\n    for i in range(n):\n        # The front of the queue is the next position to be revealed\n        result[queue.popleft()] = deck[i]\n        # Move the next position to the bottom of the deck\n        if queue:\n            queue.append(queue.popleft())\n\n    return result",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6
      ],
      "loop_start": [
        9
      ],
      "pop_from_front": [
        11
      ],
      "update_result": [
        11
      ],
      "move_to_back": [
        13,
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] deckRevealedIncreasing(int[] deck) {\n    int n = deck.length;\n    Arrays.sort(deck);\n\n    // Queue of indices to simulate the reveal process\n    Queue<Integer> queue = new LinkedList<>();\n    for (int i = 0; i < n; i++) {\n        queue.add(i);\n    }\n\n    int[] result = new int[n];\n    for (int i = 0; i < n; i++) {\n        // The front of the queue is the next position to be revealed\n        result[queue.poll()] = deck[i];\n        // Move the next position to the bottom of the deck\n        if (!queue.isEmpty()) {\n            queue.add(queue.poll());\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "loop_start": [
        12
      ],
      "pop_from_front": [
        14
      ],
      "update_result": [
        14
      ],
      "move_to_back": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> deckRevealedIncreasing(vector<int>& deck) {\n    int n = deck.size();\n    sort(deck.begin(), deck.end());\n\n    // Queue of indices to simulate the reveal process\n    queue<int> q;\n    for (int i = 0; i < n; i++) {\n        q.push(i);\n    }\n\n    vector<int> result(n);\n    for (int i = 0; i < n; i++) {\n        // The front of the queue is the next position to be revealed\n        result[q.front()] = deck[i];\n        q.pop();\n        // Move the next position to the bottom of the deck\n        if (!q.empty()) {\n            q.push(q.front());\n            q.pop();\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "loop_start": [
        12
      ],
      "pop_from_front": [
        14
      ],
      "update_result": [
        14
      ],
      "move_to_back": [
        17,
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] DeckRevealedIncreasing(int[] deck) {\n    int n = deck.Length;\n    Array.Sort(deck);\n\n    // Queue of indices to simulate the reveal process\n    Queue<int> queue = new Queue<int>();\n    for (int i = 0; i < n; i++) {\n        queue.Enqueue(i);\n    }\n\n    int[] result = new int[n];\n    for (int i = 0; i < n; i++) {\n        // The front of the queue is the next position to be revealed\n        result[queue.Dequeue()] = deck[i];\n        // Move the next position to the bottom of the deck\n        if (queue.Count > 0) {\n            queue.Enqueue(queue.Dequeue());\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "loop_start": [
        12
      ],
      "pop_from_front": [
        14
      ],
      "update_result": [
        14
      ],
      "move_to_back": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func deckRevealedIncreasing(deck []int) []int {\n    n := len(deck)\n    sort.Ints(deck)\n\n    // Queue of indices to simulate the reveal process\n    queue := make([]int, n)\n    for i := 0; i < n; i++ {\n        queue[i] = i\n    }\n\n    result := make([]int, n)\n    for i := 0; i < n; i++ {\n        // The front of the queue is the next position to be revealed\n        result[queue[0]] = deck[i]\n        queue = queue[1:]\n        // Move the next position to the bottom of the deck\n        if len(queue) > 0 {\n            queue = append(queue, queue[0])\n            queue = queue[1:]\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "loop_start": [
        12
      ],
      "pop_from_front": [
        14
      ],
      "update_result": [
        14
      ],
      "move_to_back": [
        17,
        18
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var deckRevealedIncreasing = function (deck) {\n    var n = deck.length;\n    deck.sort(function (a, b) {\n        return a - b;\n    });\n\n    // Queue of indices to simulate the reveal process\n    var queue = [];\n    for (var i = 0; i < n; i++) {\n        queue.push(i);\n    }\n\n    var result = new Array(n);\n    for (var i = 0; i < n; i++) {\n        // The front of the queue is the next position to be revealed\n        result[queue.shift()] = deck[i];\n        // Move the next position to the bottom of the deck\n        if (queue.length > 0) {\n            queue.push(queue.shift());\n        }\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        8,
        9,
        10
      ],
      "loop_start": [
        14
      ],
      "pop_from_front": [
        16
      ],
      "update_result": [
        16
      ],
      "move_to_back": [
        18,
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function deckRevealedIncreasing(deck: number[]): number[] {\n    const n = deck.length;\n    deck.sort((a, b) => a - b);\n\n    // Queue of indices to simulate the reveal process\n    const queue: number[] = [];\n    for (let i = 0; i < n; i++) {\n        queue.push(i);\n    }\n\n    const result: number[] = new Array(n);\n    for (let i = 0; i < n; i++) {\n        // The front of the queue is the next position to be revealed\n        result[queue.shift()!] = deck[i];\n        // Move the next position to the bottom of the deck\n        if (queue.length > 0) {\n            queue.push(queue.shift()!);\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "initialize": [
        3
      ],
      "init_queue": [
        6,
        7,
        8
      ],
      "loop_start": [
        12
      ],
      "pop_from_front": [
        14
      ],
      "update_result": [
        14
      ],
      "move_to_back": [
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "queue_not_empty": [
        16
      ]
    }
  }
};

const RevealCardsInIncreasingOrderPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "deck": [
        17,
        13,
        11,
        2,
        3,
        5,
        7
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Sequential",
    "value": {
      "deck": [
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
    "label": "Two Cards",
    "value": {
      "deck": [
        1,
        1000
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Reverse Order",
    "value": {
      "deck": [
        5,
        4,
        3,
        2,
        1
      ]
    }
  }
];

function generateRevealCardsInIncreasingOrderSteps(e: any): any[] {
  

let t=e.deck,r=t.length,i=[...[...t].sort((e,t)=>e-t)].reverse(),l=new StepRecorder({}),a=[],o=(e,r,n)=>{l.update_variable("deck",t),l.update_variable("sortedDesc",i),l.update_variable("cardIdx",n.cardIdx??-1),l.update_variable("x",n.x??null),l.update_variable("deque",[...a]),l.update_variable("movedVal",n.movedVal??null),l.update_variable("result",n.result??null),l.record(e,r)};o("-","Reverse the reveal process: place cards from largest to smallest.",{}),o("sort",`Sort the deck, then walk it largest → smallest: [${i.join(", ")}].`,{x:null});for(let e=0;e<r;e++){let t=i[e];if(a.length>0){let r=a.pop();a.unshift(r),o("rotate",`Deque not empty: move the bottom card ${r} to the top.`,{cardIdx:e,x:t,movedVal:r})}a.unshift(t),o("place",`Place ${t} on top of the deque.`,{cardIdx:e,x:t})}return o("complete",`Done! The deck order is [${a.join(", ")}].`,{result:[...a]}),l.getSteps()
}

export function RevealCardsInIncreasingOrderProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RevealCardsInIncreasingOrderTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRevealCardsInIncreasingOrderSteps(e) as any[];
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
      title="Reveal Cards In Increasing Order"
      slug="reveal-cards-in-increasing-order"
      approaches={approaches}
      presets={RevealCardsInIncreasingOrderPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Jump Game VI (jump-game-vi)
// ==========================================

const JumpGameViTemplates = {
  "python": {
    "language": "python",
    "code": "def maxResult(nums, k):\n    n = len(nums)\n    dp = [0] * n\n    dp[0] = nums[0]\n    deque = [0]\n\n    for i in range(1, n):\n        while deque and deque[0] < i - k:\n            deque.pop(0)\n\n        dp[i] = nums[i] + dp[deque[0]]\n\n        while deque and dp[i] >= dp[deque[-1]]:\n            deque.pop()\n\n        deque.append(i)\n\n    return dp[n - 1]",
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
      "process_index": [
        7
      ],
      "remove_outdated": [
        8
      ],
      "removed_outdated": [
        9
      ],
      "calculate_dp": [
        11
      ],
      "remove_smaller": [
        13
      ],
      "removed_smaller": [
        14
      ],
      "add_to_deque": [
        16
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "window_check": [
        8
      ],
      "is_outdated": [
        8
      ],
      "deque_not_empty": [
        13
      ],
      "is_smaller": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int maxResult(int[] nums, int k) {\n    int n = nums.length;\n    int[] dp = new int[n];\n    dp[0] = nums[0];\n    Deque<Integer> deque = new LinkedList<>();\n    deque.offer(0);\n\n    for (int i = 1; i < n; i++) {\n        while (!deque.isEmpty() && deque.peek() < i - k) {\n            deque.poll();\n        }\n\n        dp[i] = nums[i] + dp[deque.peek()];\n\n        while (!deque.isEmpty() && dp[i] >= dp[deque.peekLast()]) {\n            deque.pollLast();\n        }\n\n        deque.offer(i);\n    }\n\n    return dp[n - 1];\n}",
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
      "process_index": [
        8
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_dp": [
        13
      ],
      "remove_smaller": [
        15
      ],
      "removed_smaller": [
        16
      ],
      "add_to_deque": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "window_check": [
        9
      ],
      "is_outdated": [
        9
      ],
      "deque_not_empty": [
        15
      ],
      "is_smaller": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int maxResult(vector<int>& nums, int k) {\n    int n = nums.size();\n    vector<int> dp(n, 0);\n    dp[0] = nums[0];\n    deque<int> dq;\n    dq.push_back(0);\n\n    for (int i = 1; i < n; i++) {\n        while (!dq.empty() && dq.front() < i - k) {\n            dq.pop_front();\n        }\n\n        dp[i] = nums[i] + dp[dq.front()];\n\n        while (!dq.empty() && dp[i] >= dp[dq.back()]) {\n            dq.pop_back();\n        }\n\n        dq.push_back(i);\n    }\n\n    return dp[n - 1];\n}",
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
      "process_index": [
        8
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_dp": [
        13
      ],
      "remove_smaller": [
        15
      ],
      "removed_smaller": [
        16
      ],
      "add_to_deque": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "window_check": [
        9
      ],
      "is_outdated": [
        9
      ],
      "deque_not_empty": [
        15
      ],
      "is_smaller": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int MaxResult(int[] nums, int k) {\n    int n = nums.Length;\n    int[] dp = new int[n];\n    dp[0] = nums[0];\n    LinkedList<int> deque = new LinkedList<int>();\n    deque.AddLast(0);\n\n    for (int i = 1; i < n; i++) {\n        while (deque.Count > 0 && deque.First.Value < i - k) {\n            deque.RemoveFirst();\n        }\n\n        dp[i] = nums[i] + dp[deque.First.Value];\n\n        while (deque.Count > 0 && dp[i] >= dp[deque.Last.Value]) {\n            deque.RemoveLast();\n        }\n\n        deque.AddLast(i);\n    }\n\n    return dp[n - 1];\n}",
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
      "process_index": [
        8
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_dp": [
        13
      ],
      "remove_smaller": [
        15
      ],
      "removed_smaller": [
        16
      ],
      "add_to_deque": [
        19
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_loop": [
        8
      ],
      "window_check": [
        9
      ],
      "is_outdated": [
        9
      ],
      "deque_not_empty": [
        15
      ],
      "is_smaller": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxResult(nums []int, k int) int {\n    n := len(nums)\n    dp := make([]int, n)\n    dp[0] = nums[0]\n    deque := []int{0}\n\n    for i := 1; i < n; i++ {\n        for len(deque) > 0 && deque[0] < i - k {\n            deque = deque[1:]\n        }\n\n        dp[i] = nums[i] + dp[deque[0]]\n\n        for len(deque) > 0 && dp[i] >= dp[deque[len(deque)-1]] {\n            deque = deque[:len(deque)-1]\n        }\n\n        deque = append(deque, i)\n    }\n\n    return dp[n-1]\n}",
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
      "process_index": [
        7
      ],
      "remove_outdated": [
        8
      ],
      "removed_outdated": [
        9
      ],
      "calculate_dp": [
        12
      ],
      "remove_smaller": [
        14
      ],
      "removed_smaller": [
        15
      ],
      "add_to_deque": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "window_check": [
        8
      ],
      "is_outdated": [
        8
      ],
      "deque_not_empty": [
        14
      ],
      "is_smaller": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxResult(nums, k) {\n    const n = nums.length;\n    const dp = new Array(n).fill(0);\n    dp[0] = nums[0];\n    const deque = [0];\n\n    for (let i = 1; i < n; i++) {\n        while (deque.length > 0 && deque[0] < i - k) {\n            deque.shift();\n        }\n\n        dp[i] = nums[i] + dp[deque[0]];\n\n        while (deque.length > 0 && dp[i] >= dp[deque[deque.length - 1]]) {\n            deque.pop();\n        }\n\n        deque.push(i);\n    }\n\n    return dp[n - 1];\n}",
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
      "process_index": [
        7
      ],
      "remove_outdated": [
        8
      ],
      "removed_outdated": [
        9
      ],
      "calculate_dp": [
        12
      ],
      "remove_smaller": [
        14
      ],
      "removed_smaller": [
        15
      ],
      "add_to_deque": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "window_check": [
        8
      ],
      "is_outdated": [
        8
      ],
      "deque_not_empty": [
        14
      ],
      "is_smaller": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxResult(nums: number[], k: number): number {\n    const n = nums.length;\n    const dp: number[] = new Array(n).fill(0);\n    dp[0] = nums[0];\n    const deque: number[] = [0];\n\n    for (let i = 1; i < n; i++) {\n        while (deque.length > 0 && deque[0] < i - k) {\n            deque.shift();\n        }\n\n        dp[i] = nums[i] + dp[deque[0]];\n\n        while (deque.length > 0 && dp[i] >= dp[deque[deque.length - 1]]) {\n            deque.pop();\n        }\n\n        deque.push(i);\n    }\n\n    return dp[n - 1];\n}",
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
      "process_index": [
        7
      ],
      "remove_outdated": [
        8
      ],
      "removed_outdated": [
        9
      ],
      "calculate_dp": [
        12
      ],
      "remove_smaller": [
        14
      ],
      "removed_smaller": [
        15
      ],
      "add_to_deque": [
        18
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        7
      ],
      "window_check": [
        8
      ],
      "is_outdated": [
        8
      ],
      "deque_not_empty": [
        14
      ],
      "is_smaller": [
        14
      ]
    }
  }
};

const JumpGameViPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        -1,
        -2,
        4,
        -7,
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
        10,
        -5,
        -2,
        4,
        0,
        3
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "nums": [
        1,
        -5,
        -20,
        4,
        -1,
        3,
        -6,
        -3
      ],
      "k": 2
    }
  }
];

function generateJumpGameViSteps(e: any): any[] {
  

let t=e.nums??[],n=e.k,l=t.length,r=Array(l).fill(null);r[0]=t[0];let a=[],d=new StepRecorder({}),s=(e,i,l)=>{for(let[e,i]of(d.update_variable("nums",t),d.update_variable("k",n),d.update_variable("dp",[...r]),d.update_variable("deque",[...l.dequeSnapshot??a]),d.update_variable("i",l.i??-1),d.update_variable("frontIdx",l.frontIdx??-1),d.update_variable("removedFrontIdx",l.removedFrontIdx??-1),d.update_variable("removedBackIdx",l.removedBackIdx??-1),d.update_variable("pushIdx",l.pushIdx??-1),d.update_variable("windowLo",l.windowLo??-1),d.update_variable("windowHi",l.windowHi??-1),d.update_variable("result",l.result??null),l.conds??[]))d.add_conditional(e,i);d.record(e,i)};s("-","Start: dp[i] = nums[i] + max(dp[i-k .. i-1]). A deque keeps the window's max at its front.",{}),a.push(0),s("initialize",`Initialize dp[0] = ${t[0]}, deque = [0].`,{frontIdx:0});for(let e=1;e<l;e++){let i=Math.max(0,e-n),l=e-1;for(s("process_index",`Process index ${e}: nums[${e}] = ${t[e]}. Window covers dp[${e-n} .. ${e-1}].`,{i:e,windowLo:i,windowHi:l,frontIdx:a.length?a[0]:-1,conds:[["for_loop",!0]]});a.length>0&&a[0]<e-n;){let t=a[0];s("remove_outdated",`Index ${t} is outside the window (${t} < ${e} − ${n}). Remove it from the front.`,{i:e,windowLo:i,windowHi:l,removedFrontIdx:t,dequeSnapshot:[...a],conds:[["window_check",!0],["is_outdated",!0]]}),a.shift(),s("removed_outdated",`Removed from the front. Deque size = ${a.length}.`,{i:e,windowLo:i,windowHi:l,removedFrontIdx:t,frontIdx:a.length?a[0]:-1})}let d=a[0];for(r[e]=t[e]+r[d],s("calculate_dp",`dp[${e}] = nums[${e}] + dp[${d}] = ${t[e]} + ${r[d]} = ${r[e]}.`,{i:e,windowLo:i,windowHi:l,frontIdx:d,conds:0===a.length?[["window_check",!1]]:[["window_check",!0],["is_outdated",!1]]});a.length>0&&r[e]>=r[a[a.length-1]];){let t=a[a.length-1];s("remove_smaller",`dp[${e}] = ${r[e]} ≥ dp[${t}] = ${r[t]}. Remove index ${t} from the back.`,{i:e,windowLo:i,windowHi:l,frontIdx:a.length?a[0]:-1,removedBackIdx:t,dequeSnapshot:[...a],conds:[["deque_not_empty",!0],["is_smaller",!0]]}),a.pop(),s("removed_smaller",`Removed from the back. Deque size = ${a.length}.`,{i:e,windowLo:i,windowHi:l,frontIdx:a.length?a[0]:-1,removedBackIdx:t})}a.push(e),s("add_to_deque",`Add index ${e} to the back. Deque = [${a.join(", ")}].`,{i:e,windowLo:i,windowHi:l,frontIdx:a[0],pushIdx:e,conds:1===a.length?[["deque_not_empty",!1]]:[["deque_not_empty",!0],["is_smaller",!1]]})}return s("complete",`Return dp[${l-1}] = ${r[l-1]}.`,{result:r[l-1],frontIdx:a.length?a[0]:-1,conds:[["for_loop",!1]]}),d.getSteps()
}

export function JumpGameViProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: JumpGameViTemplates,
      generateSteps: (e: any) => {
        const recorded = generateJumpGameViSteps(e) as any[];
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
      title="Jump Game VI"
      slug="jump-game-vi"
      approaches={approaches}
      presets={JumpGameViPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sliding Window Maximum (sliding-window-maximum)
// ==========================================

const SlidingWindowMaximumTemplates = {
  "python": {
    "language": "python",
    "code": "def maxSlidingWindow(nums, k):\n    deque = []  # stores indices\n    result = []\n\n    for i in range(len(nums)):\n        # Remove elements outside window\n        if deque and deque[0] <= i - k:\n            deque.pop(0)\n\n        # Remove smaller elements from back\n        while deque and nums[deque[-1]] <= nums[i]:\n            deque.pop()\n\n        # Add current index\n        deque.append(i)\n\n        # Add to result if window complete\n        if i >= k - 1:\n            result.append(nums[deque[0]])\n\n    return result",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        15
      ],
      "add_result": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        11
      ],
      "window_complete": [
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] maxSlidingWindow(int[] nums, int k) {\n    Deque<Integer> deque = new ArrayDeque<>();\n    List<Integer> resultList = new ArrayList<>();\n\n    for (int i = 0; i < nums.length; i++) {\n        // Remove elements outside window\n        if (!deque.isEmpty() && deque.peekFirst() <= i - k) {\n            deque.pollFirst();\n        }\n\n        // Remove smaller elements from back\n        while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {\n            deque.pollLast();\n        }\n\n        // Add current index\n        deque.offerLast(i);\n\n        // Add to result if window complete\n        if (i >= k - 1) {\n            resultList.add(nums[deque.peekFirst()]);\n        }\n    }\n\n    return resultList.stream().mapToInt(Integer::intValue).toArray();\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    deque<int> dq;\n    vector<int> result;\n\n    for (int i = 0; i < nums.size(); i++) {\n        // Remove elements outside window\n        if (!dq.empty() && dq.front() <= i - k) {\n            dq.pop_front();\n        }\n\n        // Remove smaller elements from back\n        while (!dq.empty() && nums[dq.back()] <= nums[i]) {\n            dq.pop_back();\n        }\n\n        // Add current index\n        dq.push_back(i);\n\n        // Add to result if window complete\n        if (i >= k - 1) {\n            result.push_back(nums[dq.front()]);\n        }\n    }\n\n    return result;\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] MaxSlidingWindow(int[] nums, int k) {\n    LinkedList<int> deque = new LinkedList<int>();\n    List<int> result = new List<int>();\n\n    for (int i = 0; i < nums.Length; i++) {\n        // Remove elements outside window\n        if (deque.Count > 0 && deque.First.Value <= i - k) {\n            deque.RemoveFirst();\n        }\n\n        // Remove smaller elements from back\n        while (deque.Count > 0 && nums[deque.Last.Value] <= nums[i]) {\n            deque.RemoveLast();\n        }\n\n        // Add current index\n        deque.AddLast(i);\n\n        // Add to result if window complete\n        if (i >= k - 1) {\n            result.Add(nums[deque.First.Value]);\n        }\n    }\n\n    return result.ToArray();\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func maxSlidingWindow(nums []int, k int) []int {\n    deque := []int{}\n    result := []int{}\n\n    for i := 0; i < len(nums); i++ {\n        // Remove elements outside window\n        if len(deque) > 0 && deque[0] <= i-k {\n            deque = deque[1:]\n        }\n\n        // Remove smaller elements from back\n        for len(deque) > 0 && nums[deque[len(deque)-1]] <= nums[i] {\n            deque = deque[:len(deque)-1]\n        }\n\n        // Add current index\n        deque = append(deque, i)\n\n        // Add to result if window complete\n        if i >= k-1 {\n            result = append(result, nums[deque[0]])\n        }\n    }\n\n    return result\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function maxSlidingWindow(nums, k) {\n    const deque = [];\n    const result = [];\n\n    for (let i = 0; i < nums.length; i++) {\n        // Remove elements outside window\n        if (deque.length > 0 && deque[0] <= i - k) {\n            deque.shift();\n        }\n\n        // Remove smaller elements from back\n        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {\n            deque.pop();\n        }\n\n        // Add current index\n        deque.push(i);\n\n        // Add to result if window complete\n        if (i >= k - 1) {\n            result.push(nums[deque[0]]);\n        }\n    }\n\n    return result;\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function maxSlidingWindow(nums: number[], k: number): number[] {\n    const deque: number[] = [];\n    const result: number[] = [];\n\n    for (let i = 0; i < nums.length; i++) {\n        // Remove elements outside window\n        if (deque.length > 0 && deque[0] <= i - k) {\n            deque.shift();\n        }\n\n        // Remove smaller elements from back\n        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {\n            deque.pop();\n        }\n\n        // Add current index\n        deque.push(i);\n\n        // Add to result if window complete\n        if (i >= k - 1) {\n            result.push(nums[deque[0]]);\n        }\n    }\n\n    return result;\n}",
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
      "remove_front": [
        8
      ],
      "remove_back": [
        12
      ],
      "add_to_deque": [
        17
      ],
      "add_result": [
        21
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "out_of_window": [
        7
      ],
      "while_remove_smaller": [
        12
      ],
      "window_complete": [
        20
      ]
    }
  }
};

const SlidingWindowMaximumPresets: PresetOption<any>[] = [
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
    "label": "Single Element",
    "value": {
      "nums": [
        1
      ],
      "k": 1
    }
  },
  {
    "id": "ex3",
    "label": "k = 1",
    "value": {
      "nums": [
        1,
        -1
      ],
      "k": 1
    }
  },
  {
    "id": "ex4",
    "label": "Example 2",
    "value": {
      "nums": [
        9,
        11,
        8,
        5,
        7,
        10
      ],
      "k": 3
    }
  }
];

function generateSlidingWindowMaximumSteps(e: any): any[] {
  class n{record(e,t,i,n={},r){let l=this.cloneState(i),a=this.cloneVisualState(n);this.steps.push({id:e,description:t,variables:l,visualState:a,conditionals:r?JSON.parse(JSON.stringify(r)):void 0})}cloneState(e){return JSON.parse(JSON.stringify(e))}cloneVisualState(e){return JSON.parse(JSON.stringify(e))}getSteps(){return this.steps}reset(){this.steps=[]}constructor(){this.steps=[]}}

let t=e.nums,i=e.k,r=new n,l=e=>e.reduce((e,t,i)=>(e[`elem_${i}`]={type:"arrayElement",value:t,position:i},e),{}),a=e=>e.reduce((e,t,i)=>(e[`deque_${t}`]={type:"queueElement",value:t,position:i,label:`i=${t}`},e),{}),o=e=>e.reduce((e,t,i)=>(e[`result_${i}`]={type:"arrayElement",value:t,position:i},e),{});r.record("-","Start of algorithm",{nums:[...t],k:i,deque:[],result:[],i:0},{...l(t)},[]);let s=[],d=[];r.record("initialize",`Initialize: Find maximum in each window of size ${i}`,{nums:[...t],k:i,deque:[],result:[],i:0},{...l(t)},[]);let u=[];for(let e=0;e<t.length;e++){if(r.record("loop_start",`Process element at index ${e}: value = ${t[e]}`,{nums:[...t],k:i,deque:[...s],result:[...d],i:e},{...l(t),...a(s),...o(d),curr:{type:"pointer",position:e,label:"i"},...e>=i-1&&{window:{type:"range",start:e-i+1,end:e,label:"window"}}},[...u]),u=[],s.length>0&&s[0]<=e-i){let n=s.shift();r.record("remove_front",`Remove index ${n} (outside window)`,{nums:[...t],k:i,deque:[...s],result:[...d],i:e},{...l(t),...a(s),...o(d),curr:{type:"pointer",position:e,label:"i"},...e>=i-1&&{window:{type:"range",start:e-i+1,end:e,label:"window"}}},[{key:"out_of_window",result:!0}])}else u.push({key:"out_of_window",result:!1});let n=!1;for(;s.length>0&&t[s[s.length-1]]<=t[e];){let c=s.pop();n=!0,r.record("remove_back",`Remove index ${c} from back (nums[${c}]=${t[c]} <= nums[${e}]=${t[e]})`,{nums:[...t],k:i,deque:[...s],result:[...d],i:e},{...l(t),...a(s),...o(d),curr:{type:"pointer",position:e,label:"i"},...e>=i-1&&{window:{type:"range",start:e-i+1,end:e,label:"window"}}},[...u,{key:"while_remove_smaller",result:!0}]),u=[]}u=n?[{key:"while_remove_smaller",result:!1}]:[...u,{key:"while_remove_smaller",result:!1}],s.push(e),r.record("add_to_deque",`Add index ${e} to deque`,{nums:[...t],k:i,deque:[...s],result:[...d],i:e},{...l(t),...a(s),...o(d),curr:{type:"pointer",position:e,label:"i"},...e>=i-1&&{window:{type:"range",start:e-i+1,end:e,label:"window"}}},[...u]),u=[],e>=i-1?(d.push(t[s[0]]),r.record("add_result",`Window complete! Maximum is nums[${s[0]}] = ${t[s[0]]}`,{nums:[...t],k:i,deque:[...s],result:[...d],i:e},{...l(t),...a(s),...o(d),curr:{type:"pointer",position:e,label:"i"},window:{type:"range",start:e-i+1,end:e,label:"window"},maxPointer:{type:"pointer",position:s[0],label:"max"}},[{key:"window_complete",result:!0}])):u.push({key:"window_complete",result:!1})}return u.push({key:"for_loop",result:!1}),r.record("complete",`Complete! Result: [${d.join(", ")}]`,{nums:[...t],k:i,deque:[...s],result:[...d]},{...o(d)},[...u]),r.getSteps()
}

export function SlidingWindowMaximumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SlidingWindowMaximumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSlidingWindowMaximumSteps(e) as any[];
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
      title="Sliding Window Maximum"
      slug="sliding-window-maximum"
      approaches={approaches}
      presets={SlidingWindowMaximumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Max Value of Equation (max-value-of-equation)
// ==========================================

const MaxValueOfEquationTemplates = {
  "python": {
    "language": "python",
    "code": "def findMaxValueOfEquation(points, k):\n    max_value = float('-inf')\n    deque = []\n\n    for j in range(len(points)):\n        xj, yj = points[j]\n\n        while deque and xj - deque[0][1] > k:\n            deque.pop(0)\n\n        if deque:\n            max_value = max(max_value, yj + xj + deque[0][0])\n\n        while deque and yj - xj >= deque[-1][0]:\n            deque.pop()\n\n        deque.append((yj - xj, xj))\n\n    return max_value",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6
      ],
      "remove_outdated": [
        8
      ],
      "removed_outdated": [
        9
      ],
      "calculate_max": [
        11,
        12
      ],
      "update_max": [
        12
      ],
      "no_update": [
        12
      ],
      "skip_calculate": [
        11
      ],
      "remove_smaller": [
        14
      ],
      "removed_smaller": [
        15
      ],
      "add_to_deque": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        8,
        11
      ],
      "is_outdated": [
        8
      ],
      "can_calculate": [
        11
      ],
      "deque_not_empty_back": [
        14
      ],
      "is_smaller": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int findMaxValueOfEquation(int[][] points, int k) {\n    int maxValue = Integer.MIN_VALUE;\n    Deque<int[]> deque = new ArrayDeque<>();\n\n    for (int j = 0; j < points.length; j++) {\n        int xj = points[j][0];\n        int yj = points[j][1];\n\n        while (!deque.isEmpty() && xj - deque.peekFirst()[1] > k) {\n            deque.pollFirst();\n        }\n\n        if (!deque.isEmpty()) {\n            maxValue = Math.max(maxValue, yj + xj + deque.peekFirst()[0]);\n        }\n\n        while (!deque.isEmpty() && yj - xj >= deque.peekLast()[0]) {\n            deque.pollLast();\n        }\n\n        deque.offerLast(new int[]{yj - xj, xj});\n    }\n\n    return maxValue;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int findMaxValueOfEquation(vector<vector<int>>& points, int k) {\n    int maxValue = INT_MIN;\n    deque<pair<int, int>> dq;\n\n    for (int j = 0; j < points.size(); j++) {\n        int xj = points[j][0];\n        int yj = points[j][1];\n\n        while (!dq.empty() && xj - dq.front().second > k) {\n            dq.pop_front();\n        }\n\n        if (!dq.empty()) {\n            maxValue = max(maxValue, yj + xj + dq.front().first);\n        }\n\n        while (!dq.empty() && yj - xj >= dq.back().first) {\n            dq.pop_back();\n        }\n\n        dq.push_back({yj - xj, xj});\n    }\n\n    return maxValue;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int FindMaxValueOfEquation(int[][] points, int k) {\n    int maxValue = int.MinValue;\n    LinkedList<(int value, int x)> deque = new LinkedList<(int, int)>();\n\n    for (int j = 0; j < points.Length; j++) {\n        int xj = points[j][0];\n        int yj = points[j][1];\n\n        while (deque.Count > 0 && xj - deque.First.Value.x > k) {\n            deque.RemoveFirst();\n        }\n\n        if (deque.Count > 0) {\n            maxValue = Math.Max(maxValue, yj + xj + deque.First.Value.value);\n        }\n\n        while (deque.Count > 0 && yj - xj >= deque.Last.Value.value) {\n            deque.RemoveLast();\n        }\n\n        deque.AddLast((yj - xj, xj));\n    }\n\n    return maxValue;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findMaxValueOfEquation(points [][]int, k int) int {\n    maxValue := math.MinInt32\n    deque := [][2]int{}\n\n    for j := 0; j < len(points); j++ {\n        xj := points[j][0]\n        yj := points[j][1]\n\n        for len(deque) > 0 && xj - deque[0][1] > k {\n            deque = deque[1:]\n        }\n\n        if len(deque) > 0 {\n            maxValue = max(maxValue, yj + xj + deque[0][0])\n        }\n\n        for len(deque) > 0 && yj - xj >= deque[len(deque)-1][0] {\n            deque = deque[:len(deque)-1]\n        }\n\n        deque = append(deque, [2]int{yj - xj, xj})\n    }\n\n    return maxValue\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findMaxValueOfEquation(points, k) {\n    let maxValue = -Infinity;\n    const deque = [];\n\n    for (let j = 0; j < points.length; j++) {\n        const xj = points[j][0];\n        const yj = points[j][1];\n\n        while (deque.length > 0 && xj - deque[0].x > k) {\n            deque.shift();\n        }\n\n        if (deque.length > 0) {\n            maxValue = Math.max(maxValue, yj + xj + deque[0].value);\n        }\n\n        while (deque.length > 0 && yj - xj >= deque[deque.length - 1].value) {\n            deque.pop();\n        }\n\n        deque.push({ value: yj - xj, x: xj });\n    }\n\n    return maxValue;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findMaxValueOfEquation(points: number[][], k: number): number {\n    let maxValue = -Infinity;\n    const deque: { value: number; x: number }[] = [];\n\n    for (let j = 0; j < points.length; j++) {\n        const xj = points[j][0];\n        const yj = points[j][1];\n\n        while (deque.length > 0 && xj - deque[0].x > k) {\n            deque.shift();\n        }\n\n        if (deque.length > 0) {\n            maxValue = Math.max(maxValue, yj + xj + deque[0].value);\n        }\n\n        while (deque.length > 0 && yj - xj >= deque[deque.length - 1].value) {\n            deque.pop();\n        }\n\n        deque.push({ value: yj - xj, x: xj });\n    }\n\n    return maxValue;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize": [
        2,
        3
      ],
      "process_point": [
        5,
        6,
        7
      ],
      "remove_outdated": [
        9
      ],
      "removed_outdated": [
        10
      ],
      "calculate_max": [
        13,
        14
      ],
      "update_max": [
        14
      ],
      "no_update": [
        14
      ],
      "skip_calculate": [
        13
      ],
      "remove_smaller": [
        17
      ],
      "removed_smaller": [
        18
      ],
      "add_to_deque": [
        21
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_loop": [
        5
      ],
      "deque_not_empty": [
        9,
        13
      ],
      "is_outdated": [
        9
      ],
      "can_calculate": [
        13
      ],
      "deque_not_empty_back": [
        17
      ],
      "is_smaller": [
        17
      ]
    }
  }
};

const MaxValueOfEquationPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "points": [
        [
          1,
          3
        ],
        [
          2,
          0
        ],
        [
          5,
          10
        ],
        [
          6,
          -10
        ]
      ],
      "k": 1
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "points": [
        [
          0,
          0
        ],
        [
          3,
          0
        ],
        [
          9,
          2
        ]
      ],
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Example 3",
    "value": {
      "points": [
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
          1
        ],
        [
          4,
          5
        ]
      ],
      "k": 2
    }
  }
];

function generateMaxValueOfEquationSteps(e: any): any[] {
  

let t=e.points,a=e.k,n=t.length,l=t.reduce((e,t,a)=>(e[`point_${a}`]={type:"arrayElement",value:`[${t[0]},${t[1]}]`,position:a},e),{}),r=[],o=-1/0,s=e=>{let t={};return e.forEach((e,a)=>{t[`deque_${a}`]={type:"queueElement",value:`(${e.value},${e.x})`,position:a,state:0===a?"active":void 0}}),t},u=new StepRecorder({points:t,k:a},{...l});u.record("-","Start of algorithm"),u.add_new_variable("deque",[...r]),u.add_new_variable("maxValue",o===-1/0?"-∞":o),u.record("initialize","Initialize deque=[], maxValue=-∞");for(let e=0;e<n;e++){let i=t[e][0],l=t[e][1];for(let[t,a]of(u.add_conditional("for_loop",!0),u.update_variable("j",e),u.update_variable("xj",i),u.update_variable("yj",l),u.update_visual("curr",{type:"pointer",position:e,label:"j"}),Object.entries(s(r))))u.update_visual(t,a);for(u.record("process_point",`Process point [${i}, ${l}] at index ${e}`);r.length>0&&i-r[0].x>a;){u.add_conditional("deque_not_empty",!0),u.add_conditional("is_outdated",!0);let e=r[0];u.record("remove_outdated",`Remove outdated point: x=${e.x} (distance ${i-e.x} > ${a})`),r.shift(),u.update_variable("deque",r.map(e=>`(${e.value}, ${e.x})`));let t=s(r);for(let e=0;e<=n;e++)u.delete_visual(`deque_${e}`);for(let[e,a]of Object.entries(t))u.update_visual(e,a);u.record("removed_outdated",`Removed from front, deque size = ${r.length}`)}if(0===r.length?u.add_conditional("deque_not_empty",!1):(u.add_conditional("deque_not_empty",!0),u.add_conditional("is_outdated",!1)),r.length>0){u.add_conditional("can_calculate",!0);let e=l+i+r[0].value;u.update_variable("currentValue",e),u.record("calculate_max",`Calculate: yj + xj + deque[0].value = ${l} + ${i} + ${r[0].value} = ${e}`),e>o?(o=e,u.update_variable("maxValue",o),u.record("update_max",`Update maxValue = ${o}`)):u.record("no_update",`currentValue ${e} ≤ maxValue ${o}, no update`)}else u.add_conditional("can_calculate",!1),u.record("skip_calculate","Deque empty, skip calculation");for(;r.length>0&&l-i>=r[r.length-1].value;){u.add_conditional("deque_not_empty_back",!0),u.add_conditional("is_smaller",!0);let e=r[r.length-1];u.record("remove_smaller",`Remove smaller value from back: ${e.value} ≤ ${l-i}`),r.pop(),u.update_variable("deque",r.map(e=>`(${e.value}, ${e.x})`));let t=s(r);for(let e=0;e<=n;e++)u.delete_visual(`deque_${e}`);for(let[e,a]of Object.entries(t))u.update_visual(e,a);u.record("removed_smaller",`Removed from back, deque size = ${r.length}`)}0===r.length?u.add_conditional("deque_not_empty_back",!1):(u.add_conditional("deque_not_empty_back",!0),u.add_conditional("is_smaller",!1));let d={value:l-i,x:i};r.push(d),u.update_variable("deque",r.map(e=>`(${e.value}, ${e.x})`)),u.delete_variable("currentValue");let p=s(r);for(let e=0;e<=n;e++)u.delete_visual(`deque_${e}`);for(let[e,t]of Object.entries(p))u.update_visual(e,t);u.record("add_to_deque",`Add (${l-i}, ${i}) to deque, size = ${r.length}`)}u.add_conditional("for_loop",!1),u.delete_variable("j"),u.delete_variable("xj"),u.delete_variable("yj"),u.delete_visual("curr");let d=s(r);for(let e=0;e<=n;e++)u.delete_visual(`deque_${e}`);for(let[e,t]of Object.entries(d))u.update_visual(e,t);return u.record("complete",`Return maxValue: ${o}`),u.getSteps()
}

export function MaxValueOfEquationProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MaxValueOfEquationTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMaxValueOfEquationSteps(e) as any[];
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
      title="Max Value of Equation"
      slug="max-value-of-equation"
      approaches={approaches}
      presets={MaxValueOfEquationPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Circular Deque (design-circular-deque)
// ==========================================

const DesignCircularDequeTemplates = {
  "python": {
    "language": "python",
    "code": "class MyCircularDeque:\n    class Node:\n        def __init__(self, val: int):\n            self.val = val\n            self.prev = None\n            self.next = None\n\n    def __init__(self, k: int):\n        self.capacity = k\n        self.size = 0\n        self.head = None\n        self.tail = None\n\n    def insertFront(self, value: int) -> bool:\n        if self.isFull():\n            return False\n        node = self.Node(value)\n        if self.isEmpty():\n            self.head = self.tail = node\n        else:\n            # Link new node before current head\n            node.next = self.head\n            self.head.prev = node\n            self.head = node\n        self.size += 1\n        return True\n\n    def insertLast(self, value: int) -> bool:\n        if self.isFull():\n            return False\n        node = self.Node(value)\n        if self.isEmpty():\n            self.head = self.tail = node\n        else:\n            # Link new node after current tail\n            self.tail.next = node\n            node.prev = self.tail\n            self.tail = node\n        self.size += 1\n        return True\n\n    def deleteFront(self) -> bool:\n        if self.isEmpty():\n            return False\n        if self.size == 1:\n            # Only one element, clear both pointers\n            self.head = self.tail = None\n        else:\n            self.head = self.head.next\n            self.head.prev = None\n        self.size -= 1\n        return True\n\n    def deleteLast(self) -> bool:\n        if self.isEmpty():\n            return False\n        if self.size == 1:\n            # Only one element, clear both pointers\n            self.head = self.tail = None\n        else:\n            self.tail = self.tail.prev\n            self.tail.next = None\n        self.size -= 1\n        return True\n\n    def getFront(self) -> int:\n        if self.isEmpty():\n            return -1\n        return self.head.val\n\n    def getRear(self) -> int:\n        if self.isEmpty():\n            return -1\n        return self.tail.val\n\n    def isEmpty(self) -> bool:\n        return self.size == 0\n\n    def isFull(self) -> bool:\n        return self.size == self.capacity",
    "lineMap": {
      "-": [
        9,
        10,
        11,
        12
      ],
      "fr_check": [
        15
      ],
      "fr_reject": [
        16
      ],
      "fr_create": [
        17
      ],
      "fr_link": [
        19,
        22,
        23,
        24
      ],
      "fr_return": [
        25,
        26
      ],
      "bk_check": [
        29
      ],
      "bk_reject": [
        30
      ],
      "bk_create": [
        31
      ],
      "bk_link": [
        33,
        36,
        37,
        38
      ],
      "bk_return": [
        39,
        40
      ],
      "df_check": [
        43
      ],
      "df_reject": [
        44
      ],
      "df_unlink_single": [
        47
      ],
      "df_unlink": [
        49,
        50
      ],
      "df_return": [
        51,
        52
      ],
      "dl_check": [
        55
      ],
      "dl_reject": [
        56
      ],
      "dl_unlink_single": [
        59
      ],
      "dl_unlink": [
        61,
        62
      ],
      "dl_return": [
        63,
        64
      ],
      "gf_return": [
        67,
        68,
        69
      ],
      "gr_return": [
        72,
        73,
        74
      ],
      "ie_return": [
        77
      ],
      "fu_return": [
        80
      ],
      "complete": [
        80
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        15
      ],
      "fr_is_empty": [
        18
      ],
      "bk_is_full": [
        29
      ],
      "bk_is_empty": [
        32
      ],
      "df_is_empty": [
        43
      ],
      "df_single": [
        45
      ],
      "dl_is_empty": [
        55
      ],
      "dl_single": [
        57
      ],
      "gf_is_empty": [
        67
      ],
      "gr_is_empty": [
        72
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyCircularDeque {\n    private class Node {\n        int val;\n        Node prev, next;\n        Node(int val) { this.val = val; }\n    }\n\n    private Node head, tail;\n    private int size, capacity;\n\n    public MyCircularDeque(int k) {\n        capacity = k;\n        size = 0;\n        head = null;\n        tail = null;\n    }\n\n    public boolean insertFront(int value) {\n        if (isFull()) return false;\n        Node node = new Node(value);\n        if (isEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node before current head\n            node.next = head;\n            head.prev = node;\n            head = node;\n        }\n        size++;\n        return true;\n    }\n\n    public boolean insertLast(int value) {\n        if (isFull()) return false;\n        Node node = new Node(value);\n        if (isEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node after current tail\n            tail.next = node;\n            node.prev = tail;\n            tail = node;\n        }\n        size++;\n        return true;\n    }\n\n    public boolean deleteFront() {\n        if (isEmpty()) return false;\n        if (size == 1) {\n            // Only one element, clear both pointers\n            head = tail = null;\n        } else {\n            head = head.next;\n            head.prev = null;\n        }\n        size--;\n        return true;\n    }\n\n    public boolean deleteLast() {\n        if (isEmpty()) return false;\n        if (size == 1) {\n            // Only one element, clear both pointers\n            head = tail = null;\n        } else {\n            tail = tail.prev;\n            tail.next = null;\n        }\n        size--;\n        return true;\n    }\n\n    public int getFront() {\n        if (isEmpty()) return -1;\n        return head.val;\n    }\n\n    public int getRear() {\n        if (isEmpty()) return -1;\n        return tail.val;\n    }\n\n    public boolean isEmpty() {\n        return size == 0;\n    }\n\n    public boolean isFull() {\n        return size == capacity;\n    }\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14,
        15
      ],
      "fr_check": [
        19
      ],
      "fr_reject": [
        19
      ],
      "fr_create": [
        20
      ],
      "fr_link": [
        22,
        25,
        26,
        27
      ],
      "fr_return": [
        29,
        30
      ],
      "bk_check": [
        34
      ],
      "bk_reject": [
        34
      ],
      "bk_create": [
        35
      ],
      "bk_link": [
        37,
        40,
        41,
        42
      ],
      "bk_return": [
        44,
        45
      ],
      "df_check": [
        49
      ],
      "df_reject": [
        49
      ],
      "df_unlink_single": [
        52
      ],
      "df_unlink": [
        54,
        55
      ],
      "df_return": [
        57,
        58
      ],
      "dl_check": [
        62
      ],
      "dl_reject": [
        62
      ],
      "dl_unlink_single": [
        65
      ],
      "dl_unlink": [
        67,
        68
      ],
      "dl_return": [
        70,
        71
      ],
      "gf_return": [
        75,
        76
      ],
      "gr_return": [
        80,
        81
      ],
      "ie_return": [
        85
      ],
      "fu_return": [
        89
      ],
      "complete": [
        90
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        19
      ],
      "fr_is_empty": [
        21
      ],
      "bk_is_full": [
        34
      ],
      "bk_is_empty": [
        36
      ],
      "df_is_empty": [
        49
      ],
      "df_single": [
        50
      ],
      "dl_is_empty": [
        62
      ],
      "dl_single": [
        63
      ],
      "gf_is_empty": [
        75
      ],
      "gr_is_empty": [
        80
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyCircularDeque {\n    struct Node {\n        int val;\n        Node* prev;\n        Node* next;\n        Node(int v) : val(v), prev(nullptr), next(nullptr) {}\n    };\n\n    Node* head;\n    Node* tail;\n    int size, capacity;\n\npublic:\n    MyCircularDeque(int k) : head(nullptr), tail(nullptr), size(0), capacity(k) {}\n\n    bool insertFront(int value) {\n        if (isFull()) return false;\n        Node* node = new Node(value);\n        if (isEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node before current head\n            node->next = head;\n            head->prev = node;\n            head = node;\n        }\n        size++;\n        return true;\n    }\n\n    bool insertLast(int value) {\n        if (isFull()) return false;\n        Node* node = new Node(value);\n        if (isEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node after current tail\n            tail->next = node;\n            node->prev = tail;\n            tail = node;\n        }\n        size++;\n        return true;\n    }\n\n    bool deleteFront() {\n        if (isEmpty()) return false;\n        Node* temp = head;\n        if (size == 1) {\n            head = tail = nullptr;\n        } else {\n            head = head->next;\n            head->prev = nullptr;\n        }\n        delete temp;\n        size--;\n        return true;\n    }\n\n    bool deleteLast() {\n        if (isEmpty()) return false;\n        Node* temp = tail;\n        if (size == 1) {\n            head = tail = nullptr;\n        } else {\n            tail = tail->prev;\n            tail->next = nullptr;\n        }\n        delete temp;\n        size--;\n        return true;\n    }\n\n    int getFront() {\n        if (isEmpty()) return -1;\n        return head->val;\n    }\n\n    int getRear() {\n        if (isEmpty()) return -1;\n        return tail->val;\n    }\n\n    bool isEmpty() {\n        return size == 0;\n    }\n\n    bool isFull() {\n        return size == capacity;\n    }\n};",
    "lineMap": {
      "-": [
        14
      ],
      "fr_check": [
        17
      ],
      "fr_reject": [
        17
      ],
      "fr_create": [
        18
      ],
      "fr_link": [
        20,
        23,
        24,
        25
      ],
      "fr_return": [
        27,
        28
      ],
      "bk_check": [
        32
      ],
      "bk_reject": [
        32
      ],
      "bk_create": [
        33
      ],
      "bk_link": [
        35,
        38,
        39,
        40
      ],
      "bk_return": [
        42,
        43
      ],
      "df_check": [
        47
      ],
      "df_reject": [
        47
      ],
      "df_unlink_single": [
        50
      ],
      "df_unlink": [
        52,
        53
      ],
      "df_return": [
        55,
        56,
        57
      ],
      "dl_check": [
        61
      ],
      "dl_reject": [
        61
      ],
      "dl_unlink_single": [
        64
      ],
      "dl_unlink": [
        66,
        67
      ],
      "dl_return": [
        69,
        70,
        71
      ],
      "gf_return": [
        75,
        76
      ],
      "gr_return": [
        80,
        81
      ],
      "ie_return": [
        85
      ],
      "fu_return": [
        89
      ],
      "complete": [
        90
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        17
      ],
      "fr_is_empty": [
        19
      ],
      "bk_is_full": [
        32
      ],
      "bk_is_empty": [
        34
      ],
      "df_is_empty": [
        47
      ],
      "df_single": [
        49
      ],
      "dl_is_empty": [
        61
      ],
      "dl_single": [
        63
      ],
      "gf_is_empty": [
        75
      ],
      "gr_is_empty": [
        80
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyCircularDeque {\n    private class Node {\n        public int Val;\n        public Node Prev, Next;\n        public Node(int val) { Val = val; }\n    }\n\n    private Node head, tail;\n    private int size, capacity;\n\n    public MyCircularDeque(int k) {\n        capacity = k;\n        size = 0;\n        head = null;\n        tail = null;\n    }\n\n    public bool InsertFront(int value) {\n        if (IsFull()) return false;\n        Node node = new Node(value);\n        if (IsEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node before current head\n            node.Next = head;\n            head.Prev = node;\n            head = node;\n        }\n        size++;\n        return true;\n    }\n\n    public bool InsertLast(int value) {\n        if (IsFull()) return false;\n        Node node = new Node(value);\n        if (IsEmpty()) {\n            head = tail = node;\n        } else {\n            // Link new node after current tail\n            tail.Next = node;\n            node.Prev = tail;\n            tail = node;\n        }\n        size++;\n        return true;\n    }\n\n    public bool DeleteFront() {\n        if (IsEmpty()) return false;\n        if (size == 1) {\n            // Only one element, clear both pointers\n            head = tail = null;\n        } else {\n            head = head.Next;\n            head.Prev = null;\n        }\n        size--;\n        return true;\n    }\n\n    public bool DeleteLast() {\n        if (IsEmpty()) return false;\n        if (size == 1) {\n            // Only one element, clear both pointers\n            head = tail = null;\n        } else {\n            tail = tail.Prev;\n            tail.Next = null;\n        }\n        size--;\n        return true;\n    }\n\n    public int GetFront() {\n        if (IsEmpty()) return -1;\n        return head.Val;\n    }\n\n    public int GetRear() {\n        if (IsEmpty()) return -1;\n        return tail.Val;\n    }\n\n    public bool IsEmpty() {\n        return size == 0;\n    }\n\n    public bool IsFull() {\n        return size == capacity;\n    }\n}",
    "lineMap": {
      "-": [
        12,
        13,
        14,
        15
      ],
      "fr_check": [
        19
      ],
      "fr_reject": [
        19
      ],
      "fr_create": [
        20
      ],
      "fr_link": [
        22,
        25,
        26,
        27
      ],
      "fr_return": [
        29,
        30
      ],
      "bk_check": [
        34
      ],
      "bk_reject": [
        34
      ],
      "bk_create": [
        35
      ],
      "bk_link": [
        37,
        40,
        41,
        42
      ],
      "bk_return": [
        44,
        45
      ],
      "df_check": [
        49
      ],
      "df_reject": [
        49
      ],
      "df_unlink_single": [
        52
      ],
      "df_unlink": [
        54,
        55
      ],
      "df_return": [
        57,
        58
      ],
      "dl_check": [
        62
      ],
      "dl_reject": [
        62
      ],
      "dl_unlink_single": [
        65
      ],
      "dl_unlink": [
        67,
        68
      ],
      "dl_return": [
        70,
        71
      ],
      "gf_return": [
        75,
        76
      ],
      "gr_return": [
        80,
        81
      ],
      "ie_return": [
        85
      ],
      "fu_return": [
        89
      ],
      "complete": [
        90
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        19
      ],
      "fr_is_empty": [
        21
      ],
      "bk_is_full": [
        34
      ],
      "bk_is_empty": [
        36
      ],
      "df_is_empty": [
        49
      ],
      "df_single": [
        50
      ],
      "dl_is_empty": [
        62
      ],
      "dl_single": [
        63
      ],
      "gf_is_empty": [
        75
      ],
      "gr_is_empty": [
        80
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type node struct {\n    val  int\n    prev *node\n    next *node\n}\n\ntype MyCircularDeque struct {\n    head     *node\n    tail     *node\n    size     int\n    capacity int\n}\n\nfunc Constructor(k int) MyCircularDeque {\n    return MyCircularDeque{capacity: k}\n}\n\nfunc (d *MyCircularDeque) InsertFront(value int) bool {\n    if d.IsFull() {\n        return false\n    }\n    n := &node{val: value}\n    if d.IsEmpty() {\n        d.head = n\n        d.tail = n\n    } else {\n        // Link new node before current head\n        n.next = d.head\n        d.head.prev = n\n        d.head = n\n    }\n    d.size++\n    return true\n}\n\nfunc (d *MyCircularDeque) InsertLast(value int) bool {\n    if d.IsFull() {\n        return false\n    }\n    n := &node{val: value}\n    if d.IsEmpty() {\n        d.head = n\n        d.tail = n\n    } else {\n        // Link new node after current tail\n        d.tail.next = n\n        n.prev = d.tail\n        d.tail = n\n    }\n    d.size++\n    return true\n}\n\nfunc (d *MyCircularDeque) DeleteFront() bool {\n    if d.IsEmpty() {\n        return false\n    }\n    if d.size == 1 {\n        d.head = nil\n        d.tail = nil\n    } else {\n        d.head = d.head.next\n        d.head.prev = nil\n    }\n    d.size--\n    return true\n}\n\nfunc (d *MyCircularDeque) DeleteLast() bool {\n    if d.IsEmpty() {\n        return false\n    }\n    if d.size == 1 {\n        d.head = nil\n        d.tail = nil\n    } else {\n        d.tail = d.tail.prev\n        d.tail.next = nil\n    }\n    d.size--\n    return true\n}\n\nfunc (d *MyCircularDeque) GetFront() int {\n    if d.IsEmpty() {\n        return -1\n    }\n    return d.head.val\n}\n\nfunc (d *MyCircularDeque) GetRear() int {\n    if d.IsEmpty() {\n        return -1\n    }\n    return d.tail.val\n}\n\nfunc (d *MyCircularDeque) IsEmpty() bool {\n    return d.size == 0\n}\n\nfunc (d *MyCircularDeque) IsFull() bool {\n    return d.size == d.capacity\n}",
    "lineMap": {
      "-": [
        15
      ],
      "fr_check": [
        19
      ],
      "fr_reject": [
        21
      ],
      "fr_create": [
        22
      ],
      "fr_link": [
        24,
        25,
        28,
        29,
        30
      ],
      "fr_return": [
        32,
        33
      ],
      "bk_check": [
        37
      ],
      "bk_reject": [
        38
      ],
      "bk_create": [
        40
      ],
      "bk_link": [
        42,
        43,
        46,
        47,
        48
      ],
      "bk_return": [
        50,
        51
      ],
      "df_check": [
        55
      ],
      "df_reject": [
        56
      ],
      "df_unlink_single": [
        59,
        60
      ],
      "df_unlink": [
        62,
        63
      ],
      "df_return": [
        65,
        66
      ],
      "dl_check": [
        70
      ],
      "dl_reject": [
        71
      ],
      "dl_unlink_single": [
        74,
        75
      ],
      "dl_unlink": [
        77,
        78
      ],
      "dl_return": [
        80,
        81
      ],
      "gf_return": [
        85,
        86,
        88
      ],
      "gr_return": [
        92,
        93,
        95
      ],
      "ie_return": [
        99
      ],
      "fu_return": [
        103
      ],
      "complete": [
        103
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        19
      ],
      "fr_is_empty": [
        23
      ],
      "bk_is_full": [
        37
      ],
      "bk_is_empty": [
        41
      ],
      "df_is_empty": [
        55
      ],
      "df_single": [
        58
      ],
      "dl_is_empty": [
        70
      ],
      "dl_single": [
        73
      ],
      "gf_is_empty": [
        85
      ],
      "gr_is_empty": [
        92
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyCircularDeque = function (k) {\n  this.capacity = k;\n  this.size = 0;\n  this.head = null;\n  this.tail = null;\n};\n\nfunction ListNode(val) {\n  this.val = val;\n  this.prev = null;\n  this.next = null;\n}\n\nMyCircularDeque.prototype.insertFront = function (value) {\n  if (this.isFull()) return false;\n  var node = new ListNode(value);\n  if (this.isEmpty()) {\n    this.head = this.tail = node;\n  } else {\n    // Link new node before current head\n    node.next = this.head;\n    this.head.prev = node;\n    this.head = node;\n  }\n  this.size++;\n  return true;\n};\n\nMyCircularDeque.prototype.insertLast = function (value) {\n  if (this.isFull()) return false;\n  var node = new ListNode(value);\n  if (this.isEmpty()) {\n    this.head = this.tail = node;\n  } else {\n    // Link new node after current tail\n    this.tail.next = node;\n    node.prev = this.tail;\n    this.tail = node;\n  }\n  this.size++;\n  return true;\n};\n\nMyCircularDeque.prototype.deleteFront = function () {\n  if (this.isEmpty()) return false;\n  if (this.size === 1) {\n    this.head = this.tail = null;\n  } else {\n    this.head = this.head.next;\n    this.head.prev = null;\n  }\n  this.size--;\n  return true;\n};\n\nMyCircularDeque.prototype.deleteLast = function () {\n  if (this.isEmpty()) return false;\n  if (this.size === 1) {\n    this.head = this.tail = null;\n  } else {\n    this.tail = this.tail.prev;\n    this.tail.next = null;\n  }\n  this.size--;\n  return true;\n};\n\nMyCircularDeque.prototype.getFront = function () {\n  if (this.isEmpty()) return -1;\n  return this.head.val;\n};\n\nMyCircularDeque.prototype.getRear = function () {\n  if (this.isEmpty()) return -1;\n  return this.tail.val;\n};\n\nMyCircularDeque.prototype.isEmpty = function () {\n  return this.size === 0;\n};\n\nMyCircularDeque.prototype.isFull = function () {\n  return this.size === this.capacity;\n};",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5
      ],
      "fr_check": [
        15
      ],
      "fr_reject": [
        15
      ],
      "fr_create": [
        16
      ],
      "fr_link": [
        18,
        21,
        22,
        23
      ],
      "fr_return": [
        25,
        26
      ],
      "bk_check": [
        30
      ],
      "bk_reject": [
        30
      ],
      "bk_create": [
        31
      ],
      "bk_link": [
        33,
        36,
        37,
        38
      ],
      "bk_return": [
        40,
        41
      ],
      "df_check": [
        45
      ],
      "df_reject": [
        45
      ],
      "df_unlink_single": [
        47
      ],
      "df_unlink": [
        49,
        50
      ],
      "df_return": [
        52,
        53
      ],
      "dl_check": [
        57
      ],
      "dl_reject": [
        57
      ],
      "dl_unlink_single": [
        59
      ],
      "dl_unlink": [
        61,
        62
      ],
      "dl_return": [
        64,
        65
      ],
      "gf_return": [
        69,
        70
      ],
      "gr_return": [
        74,
        75
      ],
      "ie_return": [
        79
      ],
      "fu_return": [
        83
      ],
      "complete": [
        84
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        15
      ],
      "fr_is_empty": [
        17
      ],
      "bk_is_full": [
        30
      ],
      "bk_is_empty": [
        32
      ],
      "df_is_empty": [
        45
      ],
      "df_single": [
        46
      ],
      "dl_is_empty": [
        57
      ],
      "dl_single": [
        58
      ],
      "gf_is_empty": [
        69
      ],
      "gr_is_empty": [
        74
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class ListNode {\n    val: number;\n    prev: ListNode | null;\n    next: ListNode | null;\n    constructor(val: number) {\n        this.val = val;\n        this.prev = null;\n        this.next = null;\n    }\n}\n\nclass MyCircularDeque {\n    private head: ListNode | null;\n    private tail: ListNode | null;\n    private size: number;\n    private capacity: number;\n\n    constructor(k: number) {\n        this.capacity = k;\n        this.size = 0;\n        this.head = null;\n        this.tail = null;\n    }\n\n    insertFront(value: number): boolean {\n        if (this.isFull()) return false;\n        const node = new ListNode(value);\n        if (this.isEmpty()) {\n            this.head = this.tail = node;\n        } else {\n            // Link new node before current head\n            node.next = this.head;\n            this.head!.prev = node;\n            this.head = node;\n        }\n        this.size++;\n        return true;\n    }\n\n    insertLast(value: number): boolean {\n        if (this.isFull()) return false;\n        const node = new ListNode(value);\n        if (this.isEmpty()) {\n            this.head = this.tail = node;\n        } else {\n            // Link new node after current tail\n            this.tail!.next = node;\n            node.prev = this.tail;\n            this.tail = node;\n        }\n        this.size++;\n        return true;\n    }\n\n    deleteFront(): boolean {\n        if (this.isEmpty()) return false;\n        if (this.size === 1) {\n            this.head = this.tail = null;\n        } else {\n            this.head = this.head!.next;\n            this.head!.prev = null;\n        }\n        this.size--;\n        return true;\n    }\n\n    deleteLast(): boolean {\n        if (this.isEmpty()) return false;\n        if (this.size === 1) {\n            this.head = this.tail = null;\n        } else {\n            this.tail = this.tail!.prev;\n            this.tail!.next = null;\n        }\n        this.size--;\n        return true;\n    }\n\n    getFront(): number {\n        if (this.isEmpty()) return -1;\n        return this.head!.val;\n    }\n\n    getRear(): number {\n        if (this.isEmpty()) return -1;\n        return this.tail!.val;\n    }\n\n    isEmpty(): boolean {\n        return this.size === 0;\n    }\n\n    isFull(): boolean {\n        return this.size === this.capacity;\n    }\n}",
    "lineMap": {
      "-": [
        19,
        20,
        21,
        22
      ],
      "fr_check": [
        26
      ],
      "fr_reject": [
        26
      ],
      "fr_create": [
        27
      ],
      "fr_link": [
        29,
        32,
        33,
        34
      ],
      "fr_return": [
        36,
        37
      ],
      "bk_check": [
        41
      ],
      "bk_reject": [
        41
      ],
      "bk_create": [
        42
      ],
      "bk_link": [
        44,
        47,
        48,
        49
      ],
      "bk_return": [
        51,
        52
      ],
      "df_check": [
        56
      ],
      "df_reject": [
        56
      ],
      "df_unlink_single": [
        58
      ],
      "df_unlink": [
        60,
        61
      ],
      "df_return": [
        63,
        64
      ],
      "dl_check": [
        68
      ],
      "dl_reject": [
        68
      ],
      "dl_unlink_single": [
        70
      ],
      "dl_unlink": [
        72,
        73
      ],
      "dl_return": [
        75,
        76
      ],
      "gf_return": [
        80,
        81
      ],
      "gr_return": [
        85,
        86
      ],
      "ie_return": [
        90
      ],
      "fu_return": [
        94
      ],
      "complete": [
        95
      ]
    },
    "conditionalMap": {
      "fr_is_full": [
        26
      ],
      "fr_is_empty": [
        28
      ],
      "bk_is_full": [
        41
      ],
      "bk_is_empty": [
        43
      ],
      "df_is_empty": [
        56
      ],
      "df_single": [
        57
      ],
      "dl_is_empty": [
        68
      ],
      "dl_single": [
        69
      ],
      "gf_is_empty": [
        80
      ],
      "gr_is_empty": [
        85
      ]
    }
  }
};

const DesignCircularDequePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Mixed Operations",
    "value": {
      "k": 4,
      "operations": [
        "insertFront(1)",
        "insertLast(2)",
        "insertFront(3)",
        "insertLast(4)",
        "isFull()",
        "deleteFront()",
        "getRear()",
        "insertLast(5)",
        "getFront()"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Front Only",
    "value": {
      "k": 3,
      "operations": [
        "insertFront(1)",
        "insertFront(2)",
        "insertFront(3)",
        "deleteFront()",
        "deleteFront()",
        "insertFront(4)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Back Only",
    "value": {
      "k": 3,
      "operations": [
        "insertLast(1)",
        "insertLast(2)",
        "insertLast(3)",
        "deleteLast()",
        "deleteLast()",
        "insertLast(4)"
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Edge Cases",
    "value": {
      "k": 2,
      "operations": [
        "getFront()",
        "insertLast(1)",
        "insertLast(2)",
        "insertFront(3)",
        "isFull()",
        "deleteLast()",
        "insertFront(3)",
        "getRear()"
      ]
    }
  }
];

function generateDesignCircularDequeSteps(e: any): any[] {
  

let t=e.k||4,r=e.operations||[],n=new StepRecorder({},{}),l=Array(t).fill(null),a=0,s=0,u=0;n.add_new_visual("meta_mode",{type:"metadata",value:"array"}),n.add_new_visual("meta_operation",{type:"metadata",value:"MyCircularDeque("+t+")"}),n.add_new_visual("meta_return",{type:"metadata",value:""}),n.add_new_visual("meta_size",{type:"metadata",value:"0/"+t});let o=e=>(e-a+t)%t<u;function d(e,r,i){for(let a=0;a<t;a++){let t=o(a),s=t?i:"empty";a===e&&r&&(s=r),n.update_visual(`bar_${a}`,{type:"arrayElement",value:t&&null!==l[a]?l[a]:"",position:a,state:s})}n.update_visual("ptr_head",{type:"pointer",position:a,label:"front"}),n.update_visual("ptr_tail",{type:"pointer",position:s,label:"rear"}),n.update_visual("meta_size",{type:"metadata",value:u+"/"+t})}let c=e=>{n.update_visual("meta_return",{type:"metadata",value:e})},f=e=>{n.update_visual("meta_operation",{type:"metadata",value:e}),c(""),d(null,"")},p=e=>{let t=e.match(/^(\w+)\((-?\d*)\)$/);return{name:t?t[1]:e,arg:t&&""!==t[2]?parseInt(t[2],10):null}};d(null,""),n.record("-",`Initialize an empty deque: ${t} slots, front and rear both at 0`);for(let e=0;e<r.length;e++){let{name:i,arg:o}=p(r[e]);if(f(r[e]),"insertFront"===i&&null!==o){let e=u===t;if(n.add_conditional("fr_is_full",e),n.record("fr_check",`insertFront(${o}): is the deque full? size = ${u}, capacity = ${t}`),e){c("false"),n.record("fr_reject",`Deque is full, insertFront(${o}) returns false`);continue}d(a=(a-1+t)%t,"new"),n.record("fr_move",`Move front back one slot (wrapping): front = ${a}`),l[a]=o,u++,d(a,"placed"),n.record("fr_write",`Write ${o} at slot ${a}, size is now ${u}`),c("true"),d(null,""),n.record("fr_return",`insertFront(${o}) returns true`)}else if("insertLast"===i&&null!==o){let e=u===t;if(n.add_conditional("bk_is_full",e),n.record("bk_check",`insertLast(${o}): is the deque full? size = ${u}, capacity = ${t}`),e){c("false"),n.record("bk_reject",`Deque is full, insertLast(${o}) returns false`);continue}let r=s;l[r]=o,u++,d(r,"placed"),n.record("bk_write",`Write ${o} at slot ${r}, the slot rear points to`),s=(s+1)%t,d(r,"placed"),n.record("bk_move",`Move rear forward one slot (wrapping): rear = ${s}, size is now ${u}`),c("true"),d(null,""),n.record("bk_return",`insertLast(${o}) returns true`)}else if("deleteFront"===i){let e=0===u;if(n.add_conditional("df_is_empty",e),n.record("df_check",`deleteFront(): is the deque empty? size = ${u}`),e){c("false"),n.record("df_reject","Deque is empty, deleteFront() returns false");continue}let r=a;d(r,"removing"),a=(a+1)%t,u--,n.record("df_move",`Move front forward to ${a}, dropping ${l[r]}. The value stays in memory but is outside the deque`),c("true"),d(null,""),n.record("df_return",`deleteFront() returns true, size is now ${u}`)}else if("deleteLast"===i){let e=0===u;if(n.add_conditional("dl_is_empty",e),n.record("dl_check",`deleteLast(): is the deque empty? size = ${u}`),e){c("false"),n.record("dl_reject","Deque is empty, deleteLast() returns false");continue}let r=(s-1+t)%t;d(r,"removing"),s=r,u--,n.record("dl_move",`Move rear back to ${s}, dropping ${l[r]}. The value stays in memory but is outside the deque`),c("true"),d(null,""),n.record("dl_return",`deleteLast() returns true, size is now ${u}`)}else if("getFront"===i){let e=0===u;if(n.add_conditional("gf_is_empty",e),e)c("-1"),n.record("gf_return","Deque is empty, getFront() returns -1");else{let e=l[a];d(a,"read"),c(String(e)),n.record("gf_return",`Read slot ${a}, the front: getFront() returns ${e}`)}}else if("getRear"===i){let e=0===u;if(n.add_conditional("gr_is_empty",e),e)c("-1"),n.record("gr_return","Deque is empty, getRear() returns -1");else{let e=(s-1+t)%t,r=l[e];d(e,"read"),c(String(r)),n.record("gr_return",`rear points one past the end, so read slot ${e}: getRear() returns ${r}`)}}else if("isEmpty"===i){let e=0===u;c(String(e)),n.record("ie_return",`isEmpty() returns ${e}: size is ${u}`)}else if("isFull"===i){let e=u===t;c(String(e)),n.record("fu_return",`isFull() returns ${e}: size = ${u}, capacity = ${t}`)}}return d(null,"","done"),n.record("complete","All operations complete. Every deque operation is O(1): only front, rear and size change"),n.getSteps()
}

export function DesignCircularDequeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignCircularDequeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignCircularDequeSteps(e) as any[];
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
      title="Design Circular Deque"
      slug="design-circular-deque"
      approaches={approaches}
      presets={DesignCircularDequePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Circular Queue (design-circular-queue)
// ==========================================

const DesignCircularQueueTemplates = {
  "python": {
    "language": "python",
    "code": "class MyCircularQueue:\n    def __init__(self, k: int):\n        self.size = k + 1\n        self.data = [0] * self.size\n        self.front = 0\n        self.rear = 0\n\n    def enQueue(self, value: int) -> bool:\n        if self.isFull():\n            return False\n        self.data[self.rear] = value\n        self.rear = (self.rear + 1) % self.size\n        return True\n\n    def deQueue(self) -> bool:\n        if self.isEmpty():\n            return False\n        self.front = (self.front + 1) % self.size\n        return True\n\n    def Front(self) -> int:\n        if self.isEmpty():\n            return -1\n        return self.data[self.front]\n\n    def Rear(self) -> int:\n        if self.isEmpty():\n            return -1\n        return self.data[(self.rear - 1 + self.size) % self.size]\n\n    def isEmpty(self) -> bool:\n        return self.front == self.rear\n\n    def isFull(self) -> bool:\n        return (self.rear + 1) % self.size == self.front",
    "lineMap": {
      "-": [
        2,
        3,
        4,
        5,
        6
      ],
      "enqueue_start": [
        8
      ],
      "check_full": [
        9
      ],
      "enqueue_reject": [
        10
      ],
      "enqueue_place": [
        11
      ],
      "enqueue_advance": [
        12,
        13
      ],
      "dequeue_start": [
        15
      ],
      "check_empty": [
        16
      ],
      "dequeue_reject": [
        17
      ],
      "dequeue_take": [
        18
      ],
      "dequeue_advance": [
        18,
        19
      ],
      "front_start": [
        21
      ],
      "get_front_empty": [
        22,
        23
      ],
      "get_front": [
        24
      ],
      "rear_start": [
        26
      ],
      "get_rear_empty": [
        27,
        28
      ],
      "get_rear": [
        29
      ],
      "is_empty_start": [
        31
      ],
      "check_is_empty": [
        32
      ],
      "is_full_start": [
        34
      ],
      "check_is_full": [
        35
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        9
      ],
      "is_empty": [
        16
      ],
      "is_empty_front": [
        22
      ],
      "is_empty_rear": [
        27
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MyCircularQueue {\n    private int[] data;\n    private int front;\n    private int rear;\n    private int size; // array size = k + 1\n\n    public MyCircularQueue(int k) {\n        size = k + 1;\n        data = new int[size];\n        front = 0;\n        rear = 0;\n    }\n\n    public boolean enQueue(int value) {\n        if (isFull()) return false;\n        data[rear] = value;\n        rear = (rear + 1) % size;\n        return true;\n    }\n\n    public boolean deQueue() {\n        if (isEmpty()) return false;\n        front = (front + 1) % size;\n        return true;\n    }\n\n    public int Front() {\n        if (isEmpty()) return -1;\n        return data[front];\n    }\n\n    public int Rear() {\n        if (isEmpty()) return -1;\n        return data[(rear - 1 + size) % size];\n    }\n\n    public boolean isEmpty() {\n        return front == rear;\n    }\n\n    public boolean isFull() {\n        return (rear + 1) % size == front;\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11
      ],
      "enqueue_start": [
        14
      ],
      "check_full": [
        15
      ],
      "enqueue_reject": [
        15
      ],
      "enqueue_place": [
        16
      ],
      "enqueue_advance": [
        17,
        18
      ],
      "dequeue_start": [
        21
      ],
      "check_empty": [
        22
      ],
      "dequeue_reject": [
        22
      ],
      "dequeue_take": [
        23
      ],
      "dequeue_advance": [
        23,
        24
      ],
      "front_start": [
        27
      ],
      "get_front_empty": [
        28
      ],
      "get_front": [
        29
      ],
      "rear_start": [
        32
      ],
      "get_rear_empty": [
        33
      ],
      "get_rear": [
        34
      ],
      "is_empty_start": [
        37
      ],
      "check_is_empty": [
        38
      ],
      "is_full_start": [
        41
      ],
      "check_is_full": [
        42
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        15
      ],
      "is_empty": [
        22
      ],
      "is_empty_front": [
        28
      ],
      "is_empty_rear": [
        33
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MyCircularQueue {\n    vector<int> data;\n    int front, rear, size;\n\npublic:\n    MyCircularQueue(int k) : data(k + 1), front(0), rear(0), size(k + 1) {}\n\n    bool enQueue(int value) {\n        if (isFull()) return false;\n        data[rear] = value;\n        rear = (rear + 1) % size;\n        return true;\n    }\n\n    bool deQueue() {\n        if (isEmpty()) return false;\n        front = (front + 1) % size;\n        return true;\n    }\n\n    int Front() {\n        if (isEmpty()) return -1;\n        return data[front];\n    }\n\n    int Rear() {\n        if (isEmpty()) return -1;\n        return data[(rear - 1 + size) % size];\n    }\n\n    bool isEmpty() {\n        return front == rear;\n    }\n\n    bool isFull() {\n        return (rear + 1) % size == front;\n    }\n};",
    "lineMap": {
      "-": [
        6
      ],
      "enqueue_start": [
        8
      ],
      "check_full": [
        9
      ],
      "enqueue_reject": [
        9
      ],
      "enqueue_place": [
        10
      ],
      "enqueue_advance": [
        11,
        12
      ],
      "dequeue_start": [
        15
      ],
      "check_empty": [
        16
      ],
      "dequeue_reject": [
        16
      ],
      "dequeue_take": [
        17
      ],
      "dequeue_advance": [
        17,
        18
      ],
      "front_start": [
        21
      ],
      "get_front_empty": [
        22
      ],
      "get_front": [
        23
      ],
      "rear_start": [
        26
      ],
      "get_rear_empty": [
        27
      ],
      "get_rear": [
        28
      ],
      "is_empty_start": [
        31
      ],
      "check_is_empty": [
        32
      ],
      "is_full_start": [
        35
      ],
      "check_is_full": [
        36
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        9
      ],
      "is_empty": [
        16
      ],
      "is_empty_front": [
        22
      ],
      "is_empty_rear": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MyCircularQueue {\n    private int[] data;\n    private int front;\n    private int rear;\n    private int size;\n\n    public MyCircularQueue(int k) {\n        size = k + 1;\n        data = new int[size];\n        front = 0;\n        rear = 0;\n    }\n\n    public bool EnQueue(int value) {\n        if (IsFull()) return false;\n        data[rear] = value;\n        rear = (rear + 1) % size;\n        return true;\n    }\n\n    public bool DeQueue() {\n        if (IsEmpty()) return false;\n        front = (front + 1) % size;\n        return true;\n    }\n\n    public int Front() {\n        if (IsEmpty()) return -1;\n        return data[front];\n    }\n\n    public int Rear() {\n        if (IsEmpty()) return -1;\n        return data[(rear - 1 + size) % size];\n    }\n\n    public bool IsEmpty() {\n        return front == rear;\n    }\n\n    public bool IsFull() {\n        return (rear + 1) % size == front;\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11
      ],
      "enqueue_start": [
        14
      ],
      "check_full": [
        15
      ],
      "enqueue_reject": [
        15
      ],
      "enqueue_place": [
        16
      ],
      "enqueue_advance": [
        17,
        18
      ],
      "dequeue_start": [
        21
      ],
      "check_empty": [
        22
      ],
      "dequeue_reject": [
        22
      ],
      "dequeue_take": [
        23
      ],
      "dequeue_advance": [
        23,
        24
      ],
      "front_start": [
        27
      ],
      "get_front_empty": [
        28
      ],
      "get_front": [
        29
      ],
      "rear_start": [
        32
      ],
      "get_rear_empty": [
        33
      ],
      "get_rear": [
        34
      ],
      "is_empty_start": [
        37
      ],
      "check_is_empty": [
        38
      ],
      "is_full_start": [
        41
      ],
      "check_is_full": [
        42
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        15
      ],
      "is_empty": [
        22
      ],
      "is_empty_front": [
        28
      ],
      "is_empty_rear": [
        33
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MyCircularQueue struct {\n    data  []int\n    front int\n    rear  int\n    size  int\n}\n\nfunc Constructor(k int) MyCircularQueue {\n    return MyCircularQueue{\n        data: make([]int, k+1),\n        size: k + 1,\n    }\n}\n\nfunc (q *MyCircularQueue) EnQueue(value int) bool {\n    if q.IsFull() {\n        return false\n    }\n    q.data[q.rear] = value\n    q.rear = (q.rear + 1) % q.size\n    return true\n}\n\nfunc (q *MyCircularQueue) DeQueue() bool {\n    if q.IsEmpty() {\n        return false\n    }\n    q.front = (q.front + 1) % q.size\n    return true\n}\n\nfunc (q *MyCircularQueue) Front() int {\n    if q.IsEmpty() {\n        return -1\n    }\n    return q.data[q.front]\n}\n\nfunc (q *MyCircularQueue) Rear() int {\n    if q.IsEmpty() {\n        return -1\n    }\n    return q.data[(q.rear-1+q.size)%q.size]\n}\n\nfunc (q *MyCircularQueue) IsEmpty() bool {\n    return q.front == q.rear\n}\n\nfunc (q *MyCircularQueue) IsFull() bool {\n    return (q.rear+1)%q.size == q.front\n}",
    "lineMap": {
      "-": [
        8,
        9,
        10,
        11,
        12
      ],
      "enqueue_start": [
        15
      ],
      "check_full": [
        16
      ],
      "enqueue_reject": [
        17
      ],
      "enqueue_place": [
        19
      ],
      "enqueue_advance": [
        20,
        21
      ],
      "dequeue_start": [
        24
      ],
      "check_empty": [
        25
      ],
      "dequeue_reject": [
        26
      ],
      "dequeue_take": [
        28
      ],
      "dequeue_advance": [
        28,
        29
      ],
      "front_start": [
        32
      ],
      "get_front_empty": [
        33,
        34
      ],
      "get_front": [
        36
      ],
      "rear_start": [
        39
      ],
      "get_rear_empty": [
        40,
        41
      ],
      "get_rear": [
        43
      ],
      "is_empty_start": [
        46
      ],
      "check_is_empty": [
        47
      ],
      "is_full_start": [
        50
      ],
      "check_is_full": [
        51
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        16
      ],
      "is_empty": [
        25
      ],
      "is_empty_front": [
        33
      ],
      "is_empty_rear": [
        40
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MyCircularQueue = function(k) {\n    this.size = k + 1;\n    this.data = new Array(this.size);\n    this.front = 0;\n    this.rear = 0;\n};\n\nMyCircularQueue.prototype.enQueue = function(value) {\n    if (this.isFull()) return false;\n    this.data[this.rear] = value;\n    this.rear = (this.rear + 1) % this.size;\n    return true;\n};\n\nMyCircularQueue.prototype.deQueue = function() {\n    if (this.isEmpty()) return false;\n    this.front = (this.front + 1) % this.size;\n    return true;\n};\n\nMyCircularQueue.prototype.Front = function() {\n    if (this.isEmpty()) return -1;\n    return this.data[this.front];\n};\n\nMyCircularQueue.prototype.Rear = function() {\n    if (this.isEmpty()) return -1;\n    return this.data[(this.rear - 1 + this.size) % this.size];\n};\n\nMyCircularQueue.prototype.isEmpty = function() {\n    return this.front === this.rear;\n};\n\nMyCircularQueue.prototype.isFull = function() {\n    return (this.rear + 1) % this.size === this.front;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "enqueue_start": [
        8
      ],
      "check_full": [
        9
      ],
      "enqueue_reject": [
        9
      ],
      "enqueue_place": [
        10
      ],
      "enqueue_advance": [
        11,
        12
      ],
      "dequeue_start": [
        15
      ],
      "check_empty": [
        16
      ],
      "dequeue_reject": [
        16
      ],
      "dequeue_take": [
        17
      ],
      "dequeue_advance": [
        17,
        18
      ],
      "front_start": [
        21
      ],
      "get_front_empty": [
        22
      ],
      "get_front": [
        23
      ],
      "rear_start": [
        26
      ],
      "get_rear_empty": [
        27
      ],
      "get_rear": [
        28
      ],
      "is_empty_start": [
        31
      ],
      "check_is_empty": [
        32
      ],
      "is_full_start": [
        35
      ],
      "check_is_full": [
        36
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        9
      ],
      "is_empty": [
        16
      ],
      "is_empty_front": [
        22
      ],
      "is_empty_rear": [
        27
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MyCircularQueue {\n    private data: number[];\n    private front: number;\n    private rear: number;\n    private size: number;\n\n    constructor(k: number) {\n        this.size = k + 1;\n        this.data = new Array(this.size);\n        this.front = 0;\n        this.rear = 0;\n    }\n\n    enQueue(value: number): boolean {\n        if (this.isFull()) return false;\n        this.data[this.rear] = value;\n        this.rear = (this.rear + 1) % this.size;\n        return true;\n    }\n\n    deQueue(): boolean {\n        if (this.isEmpty()) return false;\n        this.front = (this.front + 1) % this.size;\n        return true;\n    }\n\n    Front(): number {\n        if (this.isEmpty()) return -1;\n        return this.data[this.front];\n    }\n\n    Rear(): number {\n        if (this.isEmpty()) return -1;\n        return this.data[(this.rear - 1 + this.size) % this.size];\n    }\n\n    isEmpty(): boolean {\n        return this.front === this.rear;\n    }\n\n    isFull(): boolean {\n        return (this.rear + 1) % this.size === this.front;\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10,
        11
      ],
      "enqueue_start": [
        14
      ],
      "check_full": [
        15
      ],
      "enqueue_reject": [
        15
      ],
      "enqueue_place": [
        16
      ],
      "enqueue_advance": [
        17,
        18
      ],
      "dequeue_start": [
        21
      ],
      "check_empty": [
        22
      ],
      "dequeue_reject": [
        22
      ],
      "dequeue_take": [
        23
      ],
      "dequeue_advance": [
        23,
        24
      ],
      "front_start": [
        27
      ],
      "get_front_empty": [
        28
      ],
      "get_front": [
        29
      ],
      "rear_start": [
        32
      ],
      "get_rear_empty": [
        33
      ],
      "get_rear": [
        34
      ],
      "is_empty_start": [
        37
      ],
      "check_is_empty": [
        38
      ],
      "is_full_start": [
        41
      ],
      "check_is_full": [
        42
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "is_full": [
        15
      ],
      "is_empty": [
        22
      ],
      "is_empty_front": [
        28
      ],
      "is_empty_rear": [
        33
      ]
    }
  }
};

const DesignCircularQueuePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "k": 3,
      "operations": [
        "enQueue(1)",
        "enQueue(2)",
        "enQueue(3)",
        "enQueue(4)",
        "Rear()",
        "isFull()",
        "deQueue()",
        "enQueue(4)",
        "Rear()"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Wrap Around",
    "value": {
      "k": 3,
      "operations": [
        "enQueue(1)",
        "enQueue(2)",
        "deQueue()",
        "enQueue(3)",
        "deQueue()",
        "enQueue(4)",
        "Front()",
        "Rear()"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Full Cycle",
    "value": {
      "k": 2,
      "operations": [
        "enQueue(1)",
        "enQueue(2)",
        "isFull()",
        "deQueue()",
        "deQueue()",
        "isEmpty()",
        "enQueue(5)"
      ]
    }
  }
];

function generateDesignCircularQueueSteps(e: any): any[] {
  

let t=e.k,r=e.operations,n=Array(t).fill(null),i=0,u=0,l=0,s={};for(let e=0;e<t;e++)s[`bar_${e}`]={type:"arrayElement",value:"",position:e,state:"empty"};s.ptr_front={type:"pointer",position:i,label:"front"},s.ptr_rear={type:"pointer",position:u,label:"rear"},s.meta_operation={type:"metadata",value:""},s.meta_result={type:"metadata",value:""},s.meta_mode={type:"metadata",value:"count"},s.meta_count={type:"metadata",value:0};let o=new StepRecorder({},s);function c(){for(let e=0;e<t;e++){let r=function(e){if(0===l)return!1;for(let r=0;r<l;r++)if((i+r)%t===e)return!0;return!1}(e);o.update_visual(`bar_${e}`,{type:"arrayElement",value:r&&null!==n[e]?n[e]:"",position:e,state:r?"occupied":"empty"})}}function p(){o.update_visual("meta_count",{type:"metadata",value:l})}function f(e,t){o.update_variable("opIndex",t),o.update_visual("meta_operation",{type:"metadata",value:e}),o.update_visual("meta_result",{type:"metadata",value:""})}function d(e){o.update_visual("meta_result",{type:"metadata",value:e})}return o.update_variable("opIndex",-1),o.record("-",`Start: circular queue with capacity ${t}. The array has exactly ${t} slots, front = 0, rear = 0, count = 0.`),r.forEach((e,r)=>{let a=e.match(/^enQueue\((\d+)\)$/);if(a){let i=parseInt(a[1]);f(e,r),o.record("enqueue_start",`Operation: ${e}`);let s=l===t;if(o.add_conditional("is_full",s),o.record("check_full",`Check isFull(): count == capacity, so ${l} == ${t} is ${s}.`),s)d("false"),o.record("enqueue_reject",`All ${t} slots are in use, so the queue is full. Return false.`);else{n[u]=i,o.update_visual(`bar_${u}`,{type:"arrayElement",value:i,position:u,state:"highlight"}),o.record("enqueue_place",`Write ${i} into data[${u}].`);let e=u;u=(u+1)%t,l++,c(),o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[e],position:e,state:"active"}),o.update_visual("ptr_rear",{type:"pointer",position:u,label:"rear"}),p(),d("true"),o.record("enqueue_advance",`Advance rear: (${e} + 1) % ${t} = ${u}, count = ${l}. Return true.`),c()}}else if("deQueue()"===e){f(e,r),o.record("dequeue_start",`Operation: ${e}`);let a=0===l;if(o.add_conditional("is_empty",a),o.record("check_empty",`Check isEmpty(): count == 0, so ${l} == 0 is ${a}.`),a)d("false"),o.record("dequeue_reject","count is 0, so the queue is empty. Return false.");else{o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[i],position:i,state:"highlight"}),o.record("dequeue_take",`Remove data[${i}] = ${n[i]} from the front.`);let e=i;n[e]=null,i=(i+1)%t,l--,c(),o.update_visual("ptr_front",{type:"pointer",position:i,label:"front"}),p(),d("true"),o.record("dequeue_advance",`Advance front: (${e} + 1) % ${t} = ${i}, count = ${l}. Return true.`)}}else if("Front()"===e){f("Front()",r),o.record("front_start","Operation: Front()");let e=0===l;o.add_conditional("is_empty_front",e),e?(d("-1"),o.record("get_front_empty","isEmpty() is true, there is no front element. Return -1.")):(o.update_visual(`bar_${i}`,{type:"arrayElement",value:n[i],position:i,state:"highlight"}),d(String(n[i])),o.record("get_front",`The front element is data[${i}] = ${n[i]}.`),c())}else if("Rear()"===e){f("Rear()",r),o.record("rear_start","Operation: Rear()");let e=0===l;if(o.add_conditional("is_empty_rear",e),e)d("-1"),o.record("get_rear_empty","isEmpty() is true, there is no rear element. Return -1.");else{let e=(u-1+t)%t;o.update_visual(`bar_${e}`,{type:"arrayElement",value:n[e],position:e,state:"highlight"}),d(String(n[e])),o.record("get_rear",`The rear element is data[(${u} - 1 + ${t}) % ${t}] = data[${e}] = ${n[e]}.`),c()}}else if("isEmpty()"===e){f("isEmpty()",r),o.record("is_empty_start","Operation: isEmpty()");let e=0===l;d(String(e)),o.record("check_is_empty",`isEmpty(): count == 0, so ${l} == 0 is ${e}.`)}else if("isFull()"===e){f("isFull()",r),o.record("is_full_start","Operation: isFull()");let e=l===t;d(String(e)),o.record("check_is_full",`isFull(): count == capacity, so ${l} == ${t} is ${e}.`)}}),o.update_variable("opIndex",r.length),o.update_visual("meta_operation",{type:"metadata",value:""}),o.update_visual("meta_result",{type:"metadata",value:""}),o.record("complete","All operations complete."),o.getSteps()
}

export function DesignCircularQueueProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignCircularQueueTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDesignCircularQueueSteps(e) as any[];
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
      title="Design Circular Queue"
      slug="design-circular-queue"
      approaches={approaches}
      presets={DesignCircularQueuePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Design Hit Counter (design-hit-counter)
// ==========================================

const DesignHitCounterTemplates = {
  "python": {
    "language": "python",
    "code": "class HitCounter:\n    def __init__(self):\n        self.timestamps = [0] * 300\n        self.counts = [0] * 300\n\n    def hit(self, timestamp: int) -> None:\n        index = timestamp % 300\n        if self.timestamps[index] == timestamp:\n            # Same second, increment count\n            self.counts[index] += 1\n        else:\n            # New second at this slot, reset\n            self.timestamps[index] = timestamp\n            self.counts[index] = 1\n\n    def getHits(self, timestamp: int) -> int:\n        total = 0\n        for i in range(300):\n            # Only count slots within the 300-second window\n            if timestamp - self.timestamps[i] < 300:\n                total += self.counts[i]\n        return total",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        6,
        7
      ],
      "check_timestamp": [
        8
      ],
      "increment_count": [
        10
      ],
      "reset_slot": [
        13,
        14
      ],
      "scan_start": [
        16,
        17,
        18
      ],
      "scan_slot": [
        20,
        21
      ],
      "scan_skip": [
        20
      ],
      "return_result": [
        22
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        8
      ],
      "within_window": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class HitCounter {\n    private int[] timestamps;\n    private int[] counts;\n\n    public HitCounter() {\n        timestamps = new int[300];\n        counts = new int[300];\n    }\n\n    public void hit(int timestamp) {\n        int index = timestamp % 300;\n        if (timestamps[index] == timestamp) {\n            // Same second, increment count\n            counts[index]++;\n        } else {\n            // New second at this slot, reset\n            timestamps[index] = timestamp;\n            counts[index] = 1;\n        }\n    }\n\n    public int getHits(int timestamp) {\n        int total = 0;\n        for (int i = 0; i < 300; i++) {\n            // Only count slots within the 300-second window\n            if (timestamp - timestamps[i] < 300) {\n                total += counts[i];\n            }\n        }\n        return total;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        10,
        11
      ],
      "check_timestamp": [
        12
      ],
      "increment_count": [
        14
      ],
      "reset_slot": [
        17,
        18
      ],
      "scan_start": [
        22,
        23,
        24
      ],
      "scan_slot": [
        26,
        27
      ],
      "scan_skip": [
        26
      ],
      "return_result": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        12
      ],
      "within_window": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class HitCounter {\n    int timestamps[300];\n    int counts[300];\n\npublic:\n    HitCounter() {\n        memset(timestamps, 0, sizeof(timestamps));\n        memset(counts, 0, sizeof(counts));\n    }\n\n    void hit(int timestamp) {\n        int index = timestamp % 300;\n        if (timestamps[index] == timestamp) {\n            // Same second, increment count\n            counts[index]++;\n        } else {\n            // New second at this slot, reset\n            timestamps[index] = timestamp;\n            counts[index] = 1;\n        }\n    }\n\n    int getHits(int timestamp) {\n        int total = 0;\n        for (int i = 0; i < 300; i++) {\n            // Only count slots within the 300-second window\n            if (timestamp - timestamps[i] < 300) {\n                total += counts[i];\n            }\n        }\n        return total;\n    }\n};",
    "lineMap": {
      "-": [
        7,
        8
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        11,
        12
      ],
      "check_timestamp": [
        13
      ],
      "increment_count": [
        15
      ],
      "reset_slot": [
        18,
        19
      ],
      "scan_start": [
        23,
        24,
        25
      ],
      "scan_slot": [
        27,
        28
      ],
      "scan_skip": [
        27
      ],
      "return_result": [
        31
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        13
      ],
      "within_window": [
        27
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class HitCounter {\n    private int[] timestamps;\n    private int[] counts;\n\n    public HitCounter() {\n        timestamps = new int[300];\n        counts = new int[300];\n    }\n\n    public void Hit(int timestamp) {\n        int index = timestamp % 300;\n        if (timestamps[index] == timestamp) {\n            // Same second, increment count\n            counts[index]++;\n        } else {\n            // New second at this slot, reset\n            timestamps[index] = timestamp;\n            counts[index] = 1;\n        }\n    }\n\n    public int GetHits(int timestamp) {\n        int total = 0;\n        for (int i = 0; i < 300; i++) {\n            // Only count slots within the 300-second window\n            if (timestamp - timestamps[i] < 300) {\n                total += counts[i];\n            }\n        }\n        return total;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        10,
        11
      ],
      "check_timestamp": [
        12
      ],
      "increment_count": [
        14
      ],
      "reset_slot": [
        17,
        18
      ],
      "scan_start": [
        22,
        23,
        24
      ],
      "scan_slot": [
        26,
        27
      ],
      "scan_skip": [
        26
      ],
      "return_result": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        12
      ],
      "within_window": [
        26
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type HitCounter struct {\n    timestamps [300]int\n    counts     [300]int\n}\n\nfunc Constructor() HitCounter {\n    return HitCounter{}\n}\n\nfunc (hc *HitCounter) Hit(timestamp int) {\n    index := timestamp % 300\n    if hc.timestamps[index] == timestamp {\n        // Same second, increment count\n        hc.counts[index]++\n    } else {\n        // New second at this slot, reset\n        hc.timestamps[index] = timestamp\n        hc.counts[index] = 1\n    }\n}\n\nfunc (hc *HitCounter) GetHits(timestamp int) int {\n    total := 0\n    for i := 0; i < 300; i++ {\n        // Only count slots within the 300-second window\n        if timestamp - hc.timestamps[i] < 300 {\n            total += hc.counts[i]\n        }\n    }\n    return total\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        10,
        11
      ],
      "check_timestamp": [
        12
      ],
      "increment_count": [
        14
      ],
      "reset_slot": [
        17,
        18
      ],
      "scan_start": [
        22,
        23,
        24
      ],
      "scan_slot": [
        26,
        27
      ],
      "scan_skip": [
        26
      ],
      "return_result": [
        30
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        12
      ],
      "within_window": [
        26
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var HitCounter = function() {\n    this.timestamps = new Array(300).fill(0);\n    this.counts = new Array(300).fill(0);\n};\n\nHitCounter.prototype.hit = function(timestamp) {\n    var index = timestamp % 300;\n    if (this.timestamps[index] === timestamp) {\n        // Same second, increment count\n        this.counts[index]++;\n    } else {\n        // New second at this slot, reset\n        this.timestamps[index] = timestamp;\n        this.counts[index] = 1;\n    }\n};\n\nHitCounter.prototype.getHits = function(timestamp) {\n    var total = 0;\n    for (var i = 0; i < 300; i++) {\n        // Only count slots within the 300-second window\n        if (timestamp - this.timestamps[i] < 300) {\n            total += this.counts[i];\n        }\n    }\n    return total;\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        6,
        7
      ],
      "check_timestamp": [
        8
      ],
      "increment_count": [
        10
      ],
      "reset_slot": [
        13,
        14
      ],
      "scan_start": [
        18,
        19,
        20
      ],
      "scan_slot": [
        22,
        23
      ],
      "scan_skip": [
        22
      ],
      "return_result": [
        26
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        8
      ],
      "within_window": [
        22
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class HitCounter {\n    private timestamps: number[];\n    private counts: number[];\n\n    constructor() {\n        this.timestamps = new Array(300).fill(0);\n        this.counts = new Array(300).fill(0);\n    }\n\n    hit(timestamp: number): void {\n        const index = timestamp % 300;\n        if (this.timestamps[index] === timestamp) {\n            // Same second, increment count\n            this.counts[index]++;\n        } else {\n            // New second at this slot, reset\n            this.timestamps[index] = timestamp;\n            this.counts[index] = 1;\n        }\n    }\n\n    getHits(timestamp: number): number {\n        let total = 0;\n        for (let i = 0; i < 300; i++) {\n            // Only count slots within the 300-second window\n            if (timestamp - this.timestamps[i] < 300) {\n                total += this.counts[i];\n            }\n        }\n        return total;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "operation_start": [
        1
      ],
      "compute_index": [
        10,
        11
      ],
      "check_timestamp": [
        12
      ],
      "increment_count": [
        14
      ],
      "reset_slot": [
        17,
        18
      ],
      "scan_start": [
        22,
        23,
        24
      ],
      "scan_slot": [
        26,
        27
      ],
      "scan_skip": [
        26
      ],
      "return_result": [
        30
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "same_timestamp": [
        12
      ],
      "within_window": [
        26
      ]
    }
  }
};

const DesignHitCounterPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        "hit(1)",
        "hit(2)",
        "hit(3)",
        "getHits(4)",
        "hit(300)",
        "getHits(300)",
        "getHits(301)"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Same Timestamp",
    "value": {
      "operations": [
        "hit(1)",
        "hit(1)",
        "hit(1)",
        "getHits(2)",
        "hit(2)",
        "getHits(3)"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Expiry",
    "value": {
      "operations": [
        "hit(1)",
        "hit(2)",
        "hit(300)",
        "getHits(300)",
        "getHits(301)",
        "getHits(302)"
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Bucket Reuse",
    "value": {
      "operations": [
        "hit(5)",
        "getHits(6)",
        "hit(305)",
        "getHits(305)"
      ]
    }
  }
];

function generateDesignHitCounterSteps(t: any): any[] {
  

let e=t.operations||[],i=e.map(t=>{let e=t.match(/\d+/);return e?{type:t.startsWith("hit")?"hit":"getHits",ts:parseInt(e[0])}:null}),s=[];for(let t of i){if(!t)continue;let e=t.ts%300;s.includes(e)||s.push(e)}s.sort((t,e)=>t-e);let a=Array(300).fill(0),r=Array(300).fill(0),l=i.map(t=>{if(!t)return null;let e=t.ts%300;if("hit"===t.type)return a[e]===t.ts?r[e]++:(a[e]=t.ts,r[e]=1),null;let i=0;for(let e of s)t.ts-a[e]<300&&(i+=r[e]);return i}),o=Array(300).fill(0),u=Array(300).fill(0),c={};for(let t=0;t<s.length;t++){let e=s[t];c[`ts_${t}`]={type:"arrayElement",value:0,position:t,label:`ts[${e}]`},c[`cnt_${t}`]={type:"arrayElement",value:0,position:t,label:`cnt[${e}]`}}let p=new StepRecorder({ops:e,opResults:l,phase:"start"},c);p.record("-","Start: timestamps[300] and counts[300] initialized to all zeros.");for(let t=0;t<e.length;t++){let n=i[t];if(!n)continue;let a=n.ts;for(let t of["index","vi","prevTs","match","newCnt","slotIdx","tsVal","cntVal","diff","within","decisions","total","result"])p.delete_variable(t);if(p.update_variable("opIdx",t),p.update_variable("opType",n.type),p.update_variable("ts",a),p.update_variable("phase","op_start"),p.record("operation_start",`Operation ${t+1}: ${e[t]}`),"hit"===n.type){let t=a%300,e=s.indexOf(t);p.add_new_visual("ptr_index",{type:"pointer",position:e,label:"index"}),p.update_variable("index",t),p.update_variable("vi",e),p.update_variable("phase","index"),p.record("compute_index",`index = ${a} % 300 = ${t}.`);let i=o[t],n=i===a;p.add_conditional("same_timestamp",n),p.update_variable("prevTs",i),p.update_variable("match",n),p.update_variable("phase","check"),p.record("check_timestamp",n?`timestamps[${t}] == ${a}: same second, add to its count.`:0===i?`timestamps[${t}] = 0 ≠ ${a}: empty slot, claim it.`:`timestamps[${t}] = ${i} ≠ ${a}: stale slot, overwrite it.`),n?(u[t]++,p.update_visual(`cnt_${e}`,{type:"arrayElement",value:u[t],position:e,label:`cnt[${t}]`}),p.update_variable("newCnt",u[t]),p.update_variable("phase","increment"),p.record("increment_count",`Increment counts[${t}] to ${u[t]}.`)):(o[t]=a,u[t]=1,p.update_visual(`ts_${e}`,{type:"arrayElement",value:a,position:e,label:`ts[${t}]`}),p.update_visual(`cnt_${e}`,{type:"arrayElement",value:1,position:e,label:`cnt[${t}]`}),p.update_variable("phase","reset"),p.record("reset_slot",`Reset slot ${t}: timestamps[${t}] = ${a}, counts[${t}] = 1.`)),p.delete_visual("ptr_index")}else{let t=s.map(()=>null),e=0;p.add_new_visual("ptr_scan",{type:"pointer",position:0,label:"i"}),p.update_variable("total",e),p.update_variable("decisions",t),p.update_variable("phase","scan_start"),p.record("scan_start",`Scan the buckets: keep counts where ${a} - timestamps[i] < 300.`);for(let i=0;i<s.length;i++){let n=s[i],r=o[n],l=u[n],c=a-r,d=c<300,h=0===r&&0===l;p.update_visual("ptr_scan",{type:"pointer",position:i,label:"i"}),p.add_conditional("within_window",d),p.update_variable("vi",i),p.update_variable("slotIdx",n),p.update_variable("tsVal",r),p.update_variable("cntVal",l),p.update_variable("diff",c),p.update_variable("within",d),p.update_variable("phase","scan"),d?(e+=l,t[i]=h?"empty":"add",p.update_variable("total",e),p.update_variable("decisions",t),p.record("scan_slot",h?`Slot ${n}: still empty, adds 0. Total = ${e}.`:`Slot ${n}: ${a} - ${r} = ${c} < 300, add counts[${n}] = ${l}. Total = ${e}.`)):(t[i]=h?"empty":"expired",p.update_variable("decisions",t),p.record("scan_skip",h?`Slot ${n}: empty, skip.`:`Slot ${n}: ${a} - ${r} = ${c} ≥ 300, expired, skip.`))}p.delete_visual("ptr_scan"),p.update_variable("result",e),p.update_variable("phase","return"),p.record("return_result",`getHits(${a}) returns ${e}.`)}}for(let t of["index","vi","prevTs","match","newCnt","slotIdx","tsVal","cntVal","diff","within","decisions","total","result","ts","opType"])p.delete_variable(t);return p.update_variable("opIdx",e.length),p.update_variable("phase","done"),p.record("complete","Done! All operations have been processed."),p.getSteps()
}

export function DesignHitCounterProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DesignHitCounterTemplates,
      generateSteps: (t: any) => {
        const recorded = generateDesignHitCounterSteps(t) as any[];
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
      title="Design Hit Counter"
      slug="design-hit-counter"
      approaches={approaches}
      presets={DesignHitCounterPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// First Unique Number (first-unique-number)
// ==========================================

const FirstUniqueNumberTemplates = {
  "python": {
    "language": "python",
    "code": "class FirstUnique:\n    def __init__(self, nums):\n        # Only enqueue a value the first time it appears\n        self.queue = deque()\n        self.count = {}\n        for num in nums:\n            self.add(num)\n\n    # Pop stale entries (duplicates) from the front, return the first unique\n    def showFirstUnique(self):\n        while self.queue and self.count[self.queue[0]] > 1:\n            self.queue.popleft()\n        return self.queue[0] if self.queue else -1\n\n    # Increment count; only enqueue on first occurrence\n    def add(self, value):\n        self.count[value] = self.count.get(value, 0) + 1\n        if self.count[value] == 1:\n            self.queue.append(value)",
    "lineMap": {
      "-": [
        1,
        2,
        4,
        5,
        6,
        7
      ],
      "init_add": [
        16
      ],
      "increment_count": [
        17
      ],
      "check_first_time": [
        18
      ],
      "enqueue": [
        19
      ],
      "show_unique": [
        10
      ],
      "check_front": [
        11
      ],
      "remove_duplicate": [
        12
      ],
      "return_result": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        18
      ],
      "check_front": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class FirstUnique {\n    private Queue<Integer> queue;\n    private Map<Integer, Integer> count;\n\n    // Only enqueue a value the first time it appears\n    public FirstUnique(int[] nums) {\n        queue = new LinkedList<>();\n        count = new HashMap<>();\n        for (int num : nums) {\n            add(num);\n        }\n    }\n\n    // Pop stale entries (duplicates) from the front, return the first unique\n    public int showFirstUnique() {\n        while (!queue.isEmpty() && count.get(queue.peek()) > 1) {\n            queue.poll();\n        }\n        return queue.isEmpty() ? -1 : queue.peek();\n    }\n\n    // Increment count; only enqueue on first occurrence\n    public void add(int value) {\n        count.put(value, count.getOrDefault(value, 0) + 1);\n        if (count.get(value) == 1) {\n            queue.offer(value);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        6,
        7,
        8,
        9,
        10
      ],
      "init_add": [
        23
      ],
      "increment_count": [
        24
      ],
      "check_first_time": [
        25
      ],
      "enqueue": [
        26
      ],
      "show_unique": [
        15
      ],
      "check_front": [
        16
      ],
      "remove_duplicate": [
        17
      ],
      "return_result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        25
      ],
      "check_front": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class FirstUnique {\n    queue<int> q;\n    unordered_map<int, int> count;\n\npublic:\n    // Only enqueue a value the first time it appears\n    FirstUnique(vector<int>& nums) {\n        for (int num : nums) {\n            add(num);\n        }\n    }\n\n    // Pop stale entries (duplicates) from the front, return the first unique\n    int showFirstUnique() {\n        while (!q.empty() && count[q.front()] > 1) {\n            q.pop();\n        }\n        return q.empty() ? -1 : q.front();\n    }\n\n    // Increment count; only enqueue on first occurrence\n    void add(int value) {\n        count[value]++;\n        if (count[value] == 1) {\n            q.push(value);\n        }\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        5,
        7,
        8,
        9
      ],
      "init_add": [
        22
      ],
      "increment_count": [
        23
      ],
      "check_first_time": [
        24
      ],
      "enqueue": [
        25
      ],
      "show_unique": [
        14
      ],
      "check_front": [
        15
      ],
      "remove_duplicate": [
        16
      ],
      "return_result": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        24
      ],
      "check_front": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class FirstUnique {\n    private Queue<int> queue;\n    private Dictionary<int, int> count;\n\n    // Only enqueue a value the first time it appears\n    public FirstUnique(int[] nums) {\n        queue = new Queue<int>();\n        count = new Dictionary<int, int>();\n        foreach (int num in nums) {\n            Add(num);\n        }\n    }\n\n    // Pop stale entries (duplicates) from the front, return the first unique\n    public int ShowFirstUnique() {\n        while (queue.Count > 0 && count[queue.Peek()] > 1) {\n            queue.Dequeue();\n        }\n        return queue.Count == 0 ? -1 : queue.Peek();\n    }\n\n    // Increment count; only enqueue on first occurrence\n    public void Add(int value) {\n        if (!count.ContainsKey(value)) count[value] = 0;\n        count[value]++;\n        if (count[value] == 1) {\n            queue.Enqueue(value);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        6,
        7,
        8,
        9,
        10
      ],
      "init_add": [
        23
      ],
      "increment_count": [
        24,
        25
      ],
      "check_first_time": [
        26
      ],
      "enqueue": [
        27
      ],
      "show_unique": [
        15
      ],
      "check_front": [
        16
      ],
      "remove_duplicate": [
        17
      ],
      "return_result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        26
      ],
      "check_front": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type FirstUnique struct {\n    queue []int\n    count map[int]int\n}\n\n// Only enqueue a value the first time it appears\nfunc Constructor(nums []int) FirstUnique {\n    fu := FirstUnique{queue: []int{}, count: map[int]int{}}\n    for _, num := range nums {\n        fu.Add(num)\n    }\n    return fu\n}\n\n// Pop stale entries (duplicates) from the front, return the first unique\nfunc (fu *FirstUnique) ShowFirstUnique() int {\n    for len(fu.queue) > 0 && fu.count[fu.queue[0]] > 1 {\n        fu.queue = fu.queue[1:]\n    }\n    if len(fu.queue) == 0 {\n        return -1\n    }\n    return fu.queue[0]\n}\n\n// Increment count; only enqueue on first occurrence\nfunc (fu *FirstUnique) Add(value int) {\n    fu.count[value]++\n    if fu.count[value] == 1 {\n        fu.queue = append(fu.queue, value)\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        7,
        8,
        9,
        10,
        12
      ],
      "init_add": [
        27
      ],
      "increment_count": [
        28
      ],
      "check_first_time": [
        29
      ],
      "enqueue": [
        30
      ],
      "show_unique": [
        16
      ],
      "check_front": [
        17
      ],
      "remove_duplicate": [
        18
      ],
      "return_result": [
        21,
        23
      ],
      "complete": [
        21,
        23
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        29
      ],
      "check_front": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var FirstUnique = function(nums) {\n    // Only enqueue a value the first time it appears\n    this.queue = [];\n    this.count = new Map();\n    for (var num of nums) {\n        this.add(num);\n    }\n};\n\n// Pop stale entries (duplicates) from the front, return the first unique\nFirstUnique.prototype.showFirstUnique = function() {\n    while (this.queue.length > 0 && this.count.get(this.queue[0]) > 1) {\n        this.queue.shift();\n    }\n    return this.queue.length === 0 ? -1 : this.queue[0];\n};\n\n// Increment count; only enqueue on first occurrence\nFirstUnique.prototype.add = function(value) {\n    this.count.set(value, (this.count.get(value) || 0) + 1);\n    if (this.count.get(value) === 1) {\n        this.queue.push(value);\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3,
        4,
        5,
        6
      ],
      "init_add": [
        19
      ],
      "increment_count": [
        20
      ],
      "check_first_time": [
        21
      ],
      "enqueue": [
        22
      ],
      "show_unique": [
        11
      ],
      "check_front": [
        12
      ],
      "remove_duplicate": [
        13
      ],
      "return_result": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        21
      ],
      "check_front": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class FirstUnique {\n    private queue: number[];\n    private count: Map<number, number>;\n\n    // Only enqueue a value the first time it appears\n    constructor(nums: number[]) {\n        this.queue = [];\n        this.count = new Map();\n        for (const num of nums) {\n            this.add(num);\n        }\n    }\n\n    // Pop stale entries (duplicates) from the front, return the first unique\n    showFirstUnique(): number {\n        while (this.queue.length > 0 && this.count.get(this.queue[0])! > 1) {\n            this.queue.shift();\n        }\n        return this.queue.length === 0 ? -1 : this.queue[0];\n    }\n\n    // Increment count; only enqueue on first occurrence\n    add(value: number): void {\n        this.count.set(value, (this.count.get(value) || 0) + 1);\n        if (this.count.get(value) === 1) {\n            this.queue.push(value);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        6,
        7,
        8,
        9,
        10
      ],
      "init_add": [
        23
      ],
      "increment_count": [
        24
      ],
      "check_first_time": [
        25
      ],
      "enqueue": [
        26
      ],
      "show_unique": [
        15
      ],
      "check_front": [
        16
      ],
      "remove_duplicate": [
        17
      ],
      "return_result": [
        19
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "check_first_time": [
        25
      ],
      "check_front": [
        16
      ]
    }
  }
};

const FirstUniqueNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        2,
        3,
        5
      ],
      "operations": [
        "showFirstUnique()",
        "add(5)",
        "showFirstUnique()",
        "add(2)",
        "showFirstUnique()"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Duplicates",
    "value": {
      "nums": [
        2,
        2,
        3,
        3
      ],
      "operations": [
        "showFirstUnique()",
        "add(4)",
        "showFirstUnique()"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Simple",
    "value": {
      "nums": [
        1,
        2,
        3
      ],
      "operations": [
        "showFirstUnique()",
        "add(1)",
        "showFirstUnique()"
      ]
    }
  }
];

function generateFirstUniqueNumberSteps(e: any): any[] {
  function r(e){let t=e.match(/^add\((-?\d+)\)$/);return t?{type:"add",val:parseInt(t[1])}:/^showFirstUnique\(\)$/.test(e)?{type:"show"}:null}

let t=e.nums,n=e.operations,u=n.map(r),a=[],l=new Map,s=0,o=e=>{l.set(e,(l.get(e)||0)+1),1===l.get(e)&&(a.push(e),s=Math.max(s,a.length))};t.forEach(o);let c=u.map(e=>{if(!e)return null;if("add"===e.type)return o(e.val),null;for(;a.length>0&&(l.get(a[0])||0)>1;)a.shift();return a.length>0?a[0]:-1}),d=[],p=new Map,h=new StepRecorder({nums:t,ops:n,opResults:c,maxQueueLen:s,opIdx:-2},{});h.record("-","Start: FirstUnique keeps a queue of candidates and a count map.");let f=()=>{d.forEach((e,t)=>{h.update_visual(`queue_${e}`,{type:"queueElement",value:e,position:t})})},m=(e,t)=>{for(let n of(h.update_variable("opIdx",t),h.update_variable("val",e),["prevCount","newCount","frontVal","frontCount","isDup","result","removedVal"]))h.delete_variable(n);h.record("init_add",t<0?`Constructor: add(${e}).`:`Operation: add(${e}).`);let n=p.get(e)||0;p.set(e,n+1),h.update_variable("prevCount",n),h.update_variable("newCount",n+1),h.update_variable("counts",Array.from(p.entries())),h.record("increment_count",`count[${e}] = ${n} + 1 = ${n+1}.`);let i=1===p.get(e);h.add_conditional("check_first_time",i),h.record("check_first_time",i?`count[${e}] == 1: first sighting, enqueue it.`:`count[${e}] = ${n+1} ≠ 1: already seen, the queue copy just went stale.`),i&&(d.push(e),h.add_new_visual(`queue_${e}`,{type:"queueElement",value:e,position:d.length-1}),h.record("enqueue",`queue.push(${e}).`))};for(let e of t)m(e,-1);for(let e=0;e<n.length;e++){let t=u[e];if(!t)continue;if("add"===t.type){m(t.val,e);continue}for(let t of(h.update_variable("opIdx",e),["val","prevCount","newCount","frontVal","frontCount","isDup","result","removedVal"]))h.delete_variable(t);for(h.record("show_unique","Operation: showFirstUnique().");d.length>0;){let e=d[0],t=p.get(e)||0,n=t>1;if(h.add_conditional("check_front",n),h.update_variable("frontVal",e),h.update_variable("frontCount",t),h.update_variable("isDup",n),h.record("check_front",n?`Front ${e}: count = ${t} > 1, stale duplicate.`:`Front ${e}: count = 1, still unique.`),!n)break;d.shift(),h.delete_visual(`queue_${e}`),f(),h.update_variable("removedVal",e),h.record("remove_duplicate",`Lazy delete: dequeue the stale ${e}.`)}let n=d.length>0?d[0]:-1;h.update_variable("result",n),h.update_variable("frontVal",d.length>0?d[0]:void 0),h.record("return_result",-1===n?"Queue is empty: no unique number, return -1.":`Front of the queue is unique: return ${n}.`)}for(let e of["val","prevCount","newCount","frontVal","frontCount","isDup","result","removedVal"])h.delete_variable(e);return h.update_variable("opIdx",n.length),h.record("complete","Done! All operations have been processed."),h.getSteps()
}

export function FirstUniqueNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FirstUniqueNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFirstUniqueNumberSteps(e) as any[];
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
      title="First Unique Number"
      slug="first-unique-number"
      approaches={approaches}
      presets={FirstUniqueNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Logger Rate Limiter (logger-rate-limiter)
// ==========================================

const LoggerRateLimiterTemplates = {
  "python": {
    "language": "python",
    "code": "class Logger:\n    def __init__(self):\n        self.next_allowed = {}\n\n    def shouldPrintMessage(self, timestamp: int, message: str) -> bool:\n        # Check if message is still in cooldown\n        if message in self.next_allowed and timestamp < self.next_allowed[message]:\n            return False\n        # Allow the message and set the next allowed time\n        self.next_allowed[message] = timestamp + 10\n        return True",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "lookup": [
        5,
        6,
        7
      ],
      "cooldown": [
        8
      ],
      "update_map": [
        9,
        10,
        11
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        7
      ],
      "in_cooldown": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Logger {\n    private Map<String, Integer> nextAllowed;\n\n    public Logger() {\n        nextAllowed = new HashMap<>();\n    }\n\n    public boolean shouldPrintMessage(int timestamp, String message) {\n        // Check if message is still in cooldown\n        if (nextAllowed.containsKey(message) && timestamp < nextAllowed.get(message)) {\n            return false;\n        }\n        // Allow the message and set the next allowed time\n        nextAllowed.put(message, timestamp + 10);\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5,
        6
      ],
      "lookup": [
        8,
        9,
        10
      ],
      "cooldown": [
        11
      ],
      "update_map": [
        13,
        14,
        15
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        10
      ],
      "in_cooldown": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Logger {\n    unordered_map<string, int> nextAllowed;\n\npublic:\n    Logger() {}\n\n    bool shouldPrintMessage(int timestamp, string message) {\n        // Check if message is still in cooldown\n        if (nextAllowed.count(message) && timestamp < nextAllowed[message]) {\n            return false;\n        }\n        // Allow the message and set the next allowed time\n        nextAllowed[message] = timestamp + 10;\n        return true;\n    }\n};",
    "lineMap": {
      "-": [
        2
      ],
      "lookup": [
        7,
        8,
        9
      ],
      "cooldown": [
        10
      ],
      "update_map": [
        12,
        13,
        14
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        9
      ],
      "in_cooldown": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Logger {\n    private Dictionary<string, int> nextAllowed;\n\n    public Logger() {\n        nextAllowed = new Dictionary<string, int>();\n    }\n\n    public bool ShouldPrintMessage(int timestamp, string message) {\n        // Check if message is still in cooldown\n        if (nextAllowed.ContainsKey(message) && timestamp < nextAllowed[message]) {\n            return false;\n        }\n        // Allow the message and set the next allowed time\n        nextAllowed[message] = timestamp + 10;\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5,
        6
      ],
      "lookup": [
        8,
        9,
        10
      ],
      "cooldown": [
        11
      ],
      "update_map": [
        13,
        14,
        15
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        10
      ],
      "in_cooldown": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type Logger struct {\n    nextAllowed map[string]int\n}\n\nfunc Constructor() Logger {\n    return Logger{nextAllowed: make(map[string]int)}\n}\n\nfunc (l *Logger) ShouldPrintMessage(timestamp int, message string) bool {\n    // Check if message is still in cooldown\n    if next, exists := l.nextAllowed[message]; exists && timestamp < next {\n        return false\n    }\n    // Allow the message and set the next allowed time\n    l.nextAllowed[message] = timestamp + 10\n    return true\n}",
    "lineMap": {
      "-": [
        5,
        6,
        7
      ],
      "lookup": [
        9,
        10,
        11
      ],
      "cooldown": [
        12
      ],
      "update_map": [
        14,
        15,
        16
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        11
      ],
      "in_cooldown": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var Logger = function() {\n    this.nextAllowed = new Map();\n};\n\nLogger.prototype.shouldPrintMessage = function(timestamp, message) {\n    // Check if message is still in cooldown\n    if (this.nextAllowed.has(message) && timestamp < this.nextAllowed.get(message)) {\n        return false;\n    }\n    // Allow the message and set the next allowed time\n    this.nextAllowed.set(message, timestamp + 10);\n    return true;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "lookup": [
        5,
        6,
        7
      ],
      "cooldown": [
        8
      ],
      "update_map": [
        10,
        11,
        12
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        7
      ],
      "in_cooldown": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class Logger {\n    private nextAllowed: Map<string, number>;\n\n    constructor() {\n        this.nextAllowed = new Map();\n    }\n\n    shouldPrintMessage(timestamp: number, message: string): boolean {\n        // Check if message is still in cooldown\n        if (this.nextAllowed.has(message) && timestamp < this.nextAllowed.get(message)!) {\n            return false;\n        }\n        // Allow the message and set the next allowed time\n        this.nextAllowed.set(message, timestamp + 10);\n        return true;\n    }\n}",
    "lineMap": {
      "-": [
        4,
        5,
        6
      ],
      "lookup": [
        8,
        9,
        10
      ],
      "cooldown": [
        11
      ],
      "update_map": [
        13,
        14,
        15
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "in_map": [
        10
      ],
      "in_cooldown": [
        10
      ]
    }
  }
};

const LoggerRateLimiterPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "operations": [
        {
          "timestamp": 1,
          "message": "foo"
        },
        {
          "timestamp": 2,
          "message": "bar"
        },
        {
          "timestamp": 3,
          "message": "foo"
        },
        {
          "timestamp": 8,
          "message": "bar"
        },
        {
          "timestamp": 10,
          "message": "foo"
        },
        {
          "timestamp": 11,
          "message": "foo"
        }
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Unique",
    "value": {
      "operations": [
        {
          "timestamp": 1,
          "message": "a"
        },
        {
          "timestamp": 2,
          "message": "b"
        },
        {
          "timestamp": 3,
          "message": "c"
        },
        {
          "timestamp": 4,
          "message": "d"
        }
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Rapid Same Message",
    "value": {
      "operations": [
        {
          "timestamp": 1,
          "message": "hello"
        },
        {
          "timestamp": 2,
          "message": "hello"
        },
        {
          "timestamp": 11,
          "message": "hello"
        },
        {
          "timestamp": 12,
          "message": "hello"
        }
      ]
    }
  }
];

function generateLoggerRateLimiterSteps(e: any): any[] {
  

let t=e.operations||[],a=t.length,i={};t.forEach((e,t)=>{i[`op_${t}`]={type:"arrayElement",value:e.message,position:t,label:String(e.timestamp)}}),i.ptr_op={type:"pointer",position:0,label:"op"},i.ptr_time={type:"pointer",position:0,label:"t"};let n=new StepRecorder({},i),o=new Map,l=Array(a).fill(null),r=0,d=0;n.update_variable("mode","map"),n.update_variable("map",{}),n.update_variable("verdicts",l),n.update_variable("printed",r),n.update_variable("blocked",d),n.record("-","Start: track each message's nextAllowed time in a hash map. A message may print again only when timestamp >= nextAllowed.");for(let e=0;e<a;e++){let{timestamp:a,message:s}=t[e],i=o.has(s),p=i?o.get(s):null;if(n.update_visual("ptr_op",{type:"pointer",position:e,label:"op"}),n.update_visual("ptr_time",{type:"pointer",position:a,label:"t"}),n.update_variable("i",e),n.update_variable("t",a),n.update_variable("msg",s),n.update_variable("found",i),n.update_variable("na",p),n.add_conditional("in_map",i),i&&n.add_conditional("in_cooldown",a<p),n.record("lookup",i?`Operation ${e+1}: shouldPrintMessage(${a}, "${s}"). "${s}" is in the map with nextAllowed = ${p}.`:`Operation ${e+1}: shouldPrintMessage(${a}, "${s}"). "${s}" is not in the map, so it has no active cooldown.`),i&&a<p){l[e]="blocked",d++;let t=n.get_visual(`op_${e}`);t&&"arrayElement"===t.type&&n.update_visual(`op_${e}`,{...t,state:"blocked"}),n.update_variable("verdicts",l),n.update_variable("blocked",d),n.record("cooldown",`timestamp ${a} < nextAllowed ${p}, so "${s}" is still in its 10 second cooldown. Return false.`)}else{let t=a+10;o.set(s,t),l[e]="printed",r++;let d=n.get_visual(`op_${e}`);d&&"arrayElement"===d.type&&n.update_visual(`op_${e}`,{...d,state:"printed"}),n.update_variable("map",Object.fromEntries(o)),n.update_variable("verdicts",l),n.update_variable("printed",r),n.update_variable("oldNa",p),n.record("update_map",i?`timestamp ${a} >= nextAllowed ${p}, the cooldown expired. Set map["${s}"] = ${a} + 10 = ${t} and return true.`:`Set map["${s}"] = ${a} + 10 = ${t} and return true. "${s}" is printed.`)}}return n.delete_variable("msg"),n.delete_variable("found"),n.delete_variable("na"),n.delete_variable("oldNa"),n.record("complete",`Done! ${r} message${1===r?" was":"s were"} printed and ${d} ${1===d?"was":"were"} blocked by the 10 second cooldown.`),n.getSteps()
}

export function LoggerRateLimiterProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LoggerRateLimiterTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLoggerRateLimiterSteps(e) as any[];
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
      title="Logger Rate Limiter"
      slug="logger-rate-limiter"
      approaches={approaches}
      presets={LoggerRateLimiterPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Moving Average from Data Stream (moving-average-from-data-stream)
// ==========================================

const MovingAverageFromDataStreamTemplates = {
  "python": {
    "language": "python",
    "code": "class MovingAverage:\n    def __init__(self, size: int):\n        self.queue = deque()\n        self.window_size = size\n        self.sum = 0\n\n    def next(self, val: int) -> float:\n        self.queue.append(val)\n        self.sum += val\n\n        # If window is full, remove the oldest value\n        if len(self.queue) > self.window_size:\n            self.sum -= self.queue.popleft()\n        return self.sum / len(self.queue)",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5
      ],
      "next_val": [
        7
      ],
      "add_to_queue": [
        8
      ],
      "add_to_sum": [
        9
      ],
      "check_size": [
        12
      ],
      "remove_oldest": [
        13
      ],
      "subtract_from_sum": [
        13
      ],
      "calc_average": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_size": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class MovingAverage {\n    private Queue<Integer> queue;\n    private int windowSize;\n    private double sum;\n\n    public MovingAverage(int size) {\n        queue = new LinkedList<>();\n        windowSize = size;\n        sum = 0;\n    }\n\n    public double next(int val) {\n        queue.offer(val);\n        sum += val;\n\n        // If window is full, remove the oldest value\n        if (queue.size() > windowSize) {\n            sum -= queue.poll();\n        }\n        return sum / queue.size();\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        6,
        7,
        8,
        9
      ],
      "next_val": [
        12
      ],
      "add_to_queue": [
        13
      ],
      "add_to_sum": [
        14
      ],
      "check_size": [
        17
      ],
      "remove_oldest": [
        18
      ],
      "subtract_from_sum": [
        18
      ],
      "calc_average": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_size": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class MovingAverage {\n    queue<int> q;\n    int windowSize;\n    double sum;\n\npublic:\n    MovingAverage(int size) : windowSize(size), sum(0) {}\n\n    double next(int val) {\n        q.push(val);\n        sum += val;\n\n        // If window is full, remove the oldest value\n        if (q.size() > windowSize) {\n            sum -= q.front();\n            q.pop();\n        }\n        return sum / q.size();\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        6,
        7
      ],
      "next_val": [
        9
      ],
      "add_to_queue": [
        10
      ],
      "add_to_sum": [
        11
      ],
      "check_size": [
        14
      ],
      "remove_oldest": [
        16
      ],
      "subtract_from_sum": [
        15
      ],
      "calc_average": [
        18
      ],
      "complete": [
        18
      ]
    },
    "conditionalMap": {
      "check_size": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class MovingAverage {\n    private Queue<int> queue;\n    private int windowSize;\n    private double sum;\n\n    public MovingAverage(int size) {\n        queue = new Queue<int>();\n        windowSize = size;\n        sum = 0;\n    }\n\n    public double Next(int val) {\n        queue.Enqueue(val);\n        sum += val;\n\n        // If window is full, remove the oldest value\n        if (queue.Count > windowSize) {\n            sum -= queue.Dequeue();\n        }\n        return sum / queue.Count;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        6,
        7,
        8,
        9
      ],
      "next_val": [
        12
      ],
      "add_to_queue": [
        13
      ],
      "add_to_sum": [
        14
      ],
      "check_size": [
        17
      ],
      "remove_oldest": [
        18
      ],
      "subtract_from_sum": [
        18
      ],
      "calc_average": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_size": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type MovingAverage struct {\n    queue      []int\n    windowSize int\n    sum        float64\n}\n\nfunc Constructor(size int) MovingAverage {\n    return MovingAverage{windowSize: size}\n}\n\nfunc (ma *MovingAverage) Next(val int) float64 {\n    ma.queue = append(ma.queue, val)\n    ma.sum += float64(val)\n\n    // If window is full, remove the oldest value\n    if len(ma.queue) > ma.windowSize {\n        ma.sum -= float64(ma.queue[0])\n        ma.queue = ma.queue[1:]\n    }\n    return ma.sum / float64(len(ma.queue))\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        7,
        8
      ],
      "next_val": [
        11
      ],
      "add_to_queue": [
        12
      ],
      "add_to_sum": [
        13
      ],
      "check_size": [
        16
      ],
      "remove_oldest": [
        18
      ],
      "subtract_from_sum": [
        17
      ],
      "calc_average": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_size": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var MovingAverage = function(size) {\n    this.queue = [];\n    this.windowSize = size;\n    this.sum = 0;\n};\n\nMovingAverage.prototype.next = function(val) {\n    this.queue.push(val);\n    this.sum += val;\n\n    // If window is full, remove the oldest value\n    if (this.queue.length > this.windowSize) {\n        this.sum -= this.queue.shift();\n    }\n    return this.sum / this.queue.length;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "next_val": [
        7
      ],
      "add_to_queue": [
        8
      ],
      "add_to_sum": [
        9
      ],
      "check_size": [
        12
      ],
      "remove_oldest": [
        13
      ],
      "subtract_from_sum": [
        13
      ],
      "calc_average": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_size": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class MovingAverage {\n    private queue: number[];\n    private windowSize: number;\n    private sum: number;\n\n    constructor(size: number) {\n        this.queue = [];\n        this.windowSize = size;\n        this.sum = 0;\n    }\n\n    next(val: number): number {\n        this.queue.push(val);\n        this.sum += val;\n\n        // If window is full, remove the oldest value\n        if (this.queue.length > this.windowSize) {\n            this.sum -= this.queue.shift()!;\n        }\n        return this.sum / this.queue.length;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        6,
        7,
        8,
        9
      ],
      "next_val": [
        12
      ],
      "add_to_queue": [
        13
      ],
      "add_to_sum": [
        14
      ],
      "check_size": [
        17
      ],
      "remove_oldest": [
        18
      ],
      "subtract_from_sum": [
        18
      ],
      "calc_average": [
        20
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "check_size": [
        17
      ]
    }
  }
};

const MovingAverageFromDataStreamPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "windowSize": 3,
      "values": [
        1,
        10,
        3,
        5
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Larger Window",
    "value": {
      "windowSize": 4,
      "values": [
        2,
        8,
        3,
        5,
        7,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small Window",
    "value": {
      "windowSize": 2,
      "values": [
        5,
        10,
        15,
        20,
        25
      ]
    }
  }
];

function generateMovingAverageFromDataStreamSteps(e: any): any[] {
  

let t=e.windowSize,i=e.values??[],n=i.length,a=new StepRecorder({}),r=Array(t).fill(null),s=[],u=e=>Number.isInteger(e)?e:parseFloat(e.toFixed(2)),o=0,d=0,c=0,h=(e,l,n)=>{a.update_variable("values",i),a.update_variable("windowSize",t),a.update_variable("buffer",[...r]),a.update_variable("v",n.v??-1),a.update_variable("val",n.val??null),a.update_variable("writeSlot",n.writeSlot??-1),a.update_variable("ptr",n.idx),a.update_variable("oldVal",n.oldVal??null),a.update_variable("sum",n.sum),a.update_variable("prevSum",n.prevSum??null),a.update_variable("count",n.count),a.update_variable("avg",n.avg??null),a.update_variable("avgs",s),a.record(e,l)};h("-",`Initialize a circular buffer of size ${t}, sum = 0.`,{idx:0,sum:0,count:0});for(let e=0;e<n;e++){let l=i[e],n=o;h("next_val",`Call next(${l}). Write slot = ${n}.`,{v:e,val:l,writeSlot:n,idx:o,sum:c,count:d});let a=r[n],m=a??0,f=c;c-=m,h("subtract_old",null===a?`Slot ${n} is empty, so subtract 0. sum stays ${c}.`:`sum = ${f} − ${m} = ${c} (drop the old value in slot ${n}).`,{v:e,val:l,writeSlot:n,idx:o,oldVal:a,sum:c,prevSum:f,count:d}),r[n]=l,h("write",`buffer[${n}] = ${l}.`,{v:e,val:l,writeSlot:n,idx:o,oldVal:a,sum:c,count:d});let v=c;c+=l,h("add_new",`sum = ${v} + ${l} = ${c}.`,{v:e,val:l,writeSlot:n,idx:o,oldVal:a,sum:c,prevSum:v,count:d}),o=(n+1)%t,d=Math.min(d+1,t),h("advance",`ptr → ${o} (wraps at ${t}), count = ${d}.`,{v:e,val:l,writeSlot:n,idx:o,sum:c,count:d});let p=u(c/d);s.push(p),h("calc_average",`Return ${c} / ${d} = ${p}.`,{v:e,val:l,writeSlot:n,idx:o,sum:c,count:d,avg:p})}return h("complete","Done! All stream values processed.",{idx:o,sum:c,count:d}),a.getSteps()
}

export function MovingAverageFromDataStreamProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MovingAverageFromDataStreamTemplates,
      generateSteps: (e: any) => {
        const recorded = generateMovingAverageFromDataStreamSteps(e) as any[];
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
      title="Moving Average from Data Stream"
      slug="moving-average-from-data-stream"
      approaches={approaches}
      presets={MovingAverageFromDataStreamPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Recent Calls (number-of-recent-calls)
// ==========================================

const NumberOfRecentCallsTemplates = {
  "python": {
    "language": "python",
    "code": "class RecentCounter:\n    def __init__(self):\n        self.queue = deque()\n\n    def ping(self, t: int) -> int:\n        self.queue.append(t)\n        # Remove all pings outside the 3000ms window\n        while self.queue[0] < t - 3000:\n            self.queue.popleft()\n        return len(self.queue)",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "ping": [
        5
      ],
      "add_to_queue": [
        6
      ],
      "check_front": [
        8
      ],
      "remove_front": [
        9
      ],
      "return_size": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "check_front": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class RecentCounter {\n    Queue<Integer> queue;\n\n    public RecentCounter() {\n        queue = new LinkedList<>();\n    }\n\n    public int ping(int t) {\n        queue.add(t);\n        // Remove all pings outside the 3000ms window\n        while (queue.peek() < t - 3000) {\n            queue.poll();\n        }\n        return queue.size();\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        4,
        5
      ],
      "ping": [
        8
      ],
      "add_to_queue": [
        9
      ],
      "check_front": [
        11
      ],
      "remove_front": [
        12
      ],
      "return_size": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_front": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class RecentCounter {\n    queue<int> q;\n\npublic:\n    RecentCounter() {}\n\n    int ping(int t) {\n        q.push(t);\n        // Remove all pings outside the 3000ms window\n        while (q.front() < t - 3000) {\n            q.pop();\n        }\n        return q.size();\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        4,
        5
      ],
      "ping": [
        7
      ],
      "add_to_queue": [
        8
      ],
      "check_front": [
        10
      ],
      "remove_front": [
        11
      ],
      "return_size": [
        13
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "check_front": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class RecentCounter {\n    Queue<int> queue;\n\n    public RecentCounter() {\n        queue = new Queue<int>();\n    }\n\n    public int Ping(int t) {\n        queue.Enqueue(t);\n        // Remove all pings outside the 3000ms window\n        while (queue.Peek() < t - 3000) {\n            queue.Dequeue();\n        }\n        return queue.Count;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        4,
        5
      ],
      "ping": [
        8
      ],
      "add_to_queue": [
        9
      ],
      "check_front": [
        11
      ],
      "remove_front": [
        12
      ],
      "return_size": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_front": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type RecentCounter struct {\n    queue []int\n}\n\nfunc Constructor() RecentCounter {\n    return RecentCounter{queue: []int{}}\n}\n\nfunc (rc *RecentCounter) Ping(t int) int {\n    rc.queue = append(rc.queue, t)\n    // Remove all pings outside the 3000ms window\n    for rc.queue[0] < t-3000 {\n        rc.queue = rc.queue[1:]\n    }\n    return len(rc.queue)\n}",
    "lineMap": {
      "-": [
        1,
        2,
        5,
        6
      ],
      "ping": [
        9
      ],
      "add_to_queue": [
        10
      ],
      "check_front": [
        12
      ],
      "remove_front": [
        13
      ],
      "return_size": [
        15
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "check_front": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var RecentCounter = function () {\n    this.queue = [];\n};\n\nRecentCounter.prototype.ping = function (t) {\n    this.queue.push(t);\n    // Remove all pings outside the 3000ms window\n    while (this.queue[0] < t - 3000) {\n        this.queue.shift();\n    }\n    return this.queue.length;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "ping": [
        5
      ],
      "add_to_queue": [
        6
      ],
      "check_front": [
        8
      ],
      "remove_front": [
        9
      ],
      "return_size": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "check_front": [
        8
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class RecentCounter {\n    queue: number[];\n\n    constructor() {\n        this.queue = [];\n    }\n\n    ping(t: number): number {\n        this.queue.push(t);\n        // Remove all pings outside the 3000ms window\n        while (this.queue[0] < t - 3000) {\n            this.queue.shift();\n        }\n        return this.queue.length;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        4,
        5
      ],
      "ping": [
        8
      ],
      "add_to_queue": [
        9
      ],
      "check_front": [
        11
      ],
      "remove_front": [
        12
      ],
      "return_size": [
        14
      ],
      "complete": [
        14
      ]
    },
    "conditionalMap": {
      "check_front": [
        11
      ]
    }
  }
};

const NumberOfRecentCallsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "pings": [
        1,
        100,
        3001,
        3002
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Spread Out",
    "value": {
      "pings": [
        1,
        1000,
        2000,
        3000,
        3001,
        5000
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Rapid",
    "value": {
      "pings": [
        1,
        2,
        3,
        4,
        5,
        3001,
        3002,
        3003
      ]
    }
  }
];

function generateNumberOfRecentCallsSteps(e: any): any[] {
  

let t=e.pings??[],n=new StepRecorder({}),r=(e,i,r)=>{n.update_variable("pings",t),n.update_variable("p",r.p),n.update_variable("t",r.t),n.update_variable("windowStart",r.windowStart),n.update_variable("left",r.left??-1),n.update_variable("right",r.right??-1),n.update_variable("mid",r.mid??-1),n.update_variable("count",r.count??0),n.update_variable("result",r.result??null),n.record(e,i)};r("-","Start: keep the pings in a sorted list and binary-search the window edge.",{p:-1,t:0,windowStart:0});for(let e=0;e<t.length;e++){let n=t[e],i=n-3e3;r("ping",`Call ping(${n}). Window is [${i}, ${n}].`,{p:e,t:n,windowStart:i}),r("store",`Append ${n}. The list stays sorted: length ${e+1}.`,{p:e,t:n,windowStart:i});let l=e+1,s=0,a=l-1;for(;s<a;){let l=s+Math.floor((a-s)/2),o=t[l]<i;r("search",o?`mid = ${l}: ${t[l]} < ${i}, the edge is right of mid.`:`mid = ${l}: ${t[l]} >= ${i}, the edge is at or left of mid.`,{p:e,t:n,windowStart:i,left:s,right:a,mid:l}),o?s=l+1:a=l}let o=l-s;r("found",`First in-window ping is index ${s} (${t[s]}).`,{p:e,t:n,windowStart:i,left:s,right:a}),r("return_size",`Return pings.size() - left = ${l} - ${s} = ${o}.`,{p:e,t:n,windowStart:i,left:s,right:a,count:o,result:o})}let l=t.length-1,s=(t[l]??0)-3e3,a=0,o=l;for(;a<o;){let e=a+Math.floor((o-a)/2);t[e]<s?a=e+1:o=e}return r("complete","All ping operations complete.",{p:l,t:t[l]??0,windowStart:s,left:a,right:o,result:l+1-a}),n.getSteps()
}

export function NumberOfRecentCallsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfRecentCallsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfRecentCallsSteps(e) as any[];
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
      title="Number of Recent Calls"
      slug="number-of-recent-calls"
      approaches={approaches}
      presets={NumberOfRecentCallsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Time Needed to Buy Tickets (time-needed-to-buy-tickets)
// ==========================================

const TimeNeededToBuyTicketsTemplates = {
  "python": {
    "language": "python",
    "code": "def timeRequiredToBuy(tickets, k):\n    time = 0\n    for i in range(len(tickets)):\n        # People at or before k participate in all of k's rounds\n        # People after k miss the final round\n        if i <= k:\n            time += min(tickets[i], tickets[k])\n        else:\n            time += min(tickets[i], tickets[k] - 1)\n    return time",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int timeRequiredToBuy(int[] tickets, int k) {\n    int time = 0;\n    for (int i = 0; i < tickets.length; i++) {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if (i <= k) {\n            time += Math.min(tickets[i], tickets[k]);\n        } else {\n            time += Math.min(tickets[i], tickets[k] - 1);\n        }\n    }\n    return time;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int timeRequiredToBuy(vector<int>& tickets, int k) {\n    int time = 0;\n    for (int i = 0; i < tickets.size(); i++) {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if (i <= k) {\n            time += min(tickets[i], tickets[k]);\n        } else {\n            time += min(tickets[i], tickets[k] - 1);\n        }\n    }\n    return time;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int TimeRequiredToBuy(int[] tickets, int k) {\n    int time = 0;\n    for (int i = 0; i < tickets.Length; i++) {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if (i <= k) {\n            time += Math.Min(tickets[i], tickets[k]);\n        } else {\n            time += Math.Min(tickets[i], tickets[k] - 1);\n        }\n    }\n    return time;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func timeRequiredToBuy(tickets []int, k int) int {\n    time := 0\n    for i := 0; i < len(tickets); i++ {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if i <= k {\n            time += min(tickets[i], tickets[k])\n        } else {\n            time += min(tickets[i], tickets[k]-1)\n        }\n    }\n    return time\n}\n\nfunc min(a, b int) int {\n    if a < b {\n        return a\n    }\n    return b\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var timeRequiredToBuy = function(tickets, k) {\n    let time = 0;\n    for (let i = 0; i < tickets.length; i++) {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if (i <= k) {\n            time += Math.min(tickets[i], tickets[k]);\n        } else {\n            time += Math.min(tickets[i], tickets[k] - 1);\n        }\n    }\n    return time;\n};",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function timeRequiredToBuy(tickets: number[], k: number): number {\n    let time = 0;\n    for (let i = 0; i < tickets.length; i++) {\n        // People at or before k participate in all of k's rounds\n        // People after k miss the final round\n        if (i <= k) {\n            time += Math.min(tickets[i], tickets[k]);\n        } else {\n            time += Math.min(tickets[i], tickets[k] - 1);\n        }\n    }\n    return time;\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "loop": [
        3
      ],
      "check_position": [
        6
      ],
      "add_before_k": [
        7
      ],
      "add_after_k": [
        9
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "check_position": [
        6
      ]
    }
  }
};

const TimeNeededToBuyTicketsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "tickets": [
        2,
        3,
        2
      ],
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "tickets": [
        5,
        1,
        1,
        1
      ],
      "k": 0
    }
  },
  {
    "id": "ex3",
    "label": "Larger",
    "value": {
      "tickets": [
        2,
        6,
        3,
        4,
        5
      ],
      "k": 2
    }
  }
];

function generateTimeNeededToBuyTicketsSteps(e: any): any[] {
  

let t=[...e.tickets??[]],i=e.k,r=t.length,a=[...t],l=Array.from({length:r},(e,t)=>t),s=0,o=new StepRecorder({}),u=(e,n,r)=>{o.update_variable("tickets",t),o.update_variable("k",i),o.update_variable("queue",[...l]),o.update_variable("remaining",[...a]),o.update_variable("front",r.front??-1),o.update_variable("action",r.action??null),o.update_variable("time",r.time),o.update_variable("result",r.result??null),o.record(e,n)};for(u("-",`Start: run the queue until person ${i} buys all ${t[i]} ticket(s).`,{time:0});l.length>0;){let e=l[0];if(a[e]-=1,s+=1,u("serve",`Person ${e} buys a ticket (time = ${s}). ${a[e]} left for them.`,{front:e,action:"serve",time:s}),e===i&&0===a[e])return u("complete",`Person ${i} bought their last ticket. Total time = ${s}.`,{front:e,time:s,result:s}),o.getSteps();a[e]>0?(l.shift(),l.push(e),u("requeue",`Person ${e} still needs ${a[e]} more, so they go to the back.`,{front:e,action:"requeue",time:s})):(u("leave",`Person ${e} has no tickets left and leaves the queue.`,{front:e,action:"leave",time:s}),l.shift())}return u("complete",`Queue empty. Total time = ${s}.`,{time:s,result:s}),o.getSteps()
}

export function TimeNeededToBuyTicketsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TimeNeededToBuyTicketsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTimeNeededToBuyTicketsSteps(e) as any[];
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
      title="Time Needed to Buy Tickets"
      slug="time-needed-to-buy-tickets"
      approaches={approaches}
      presets={TimeNeededToBuyTicketsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
