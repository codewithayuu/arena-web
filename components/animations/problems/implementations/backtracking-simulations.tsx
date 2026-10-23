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
// Subsets (subsets)
// ==========================================

const SubsetsTemplates = {
  "python": {
    "language": "python",
    "code": "def subsets(nums):\n  result = []\n  backtrack(0, [])\n  return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(index, current):\n  # Base case: reached end\n  if index == len(nums):\n    result.append(current[:])\n    return\n\n  # Include nums[index]\n  current.append(nums[index])\n  backtrack(index + 1, current)\n\n  # Backtrack: exclude nums[index]\n  current.pop()\n  backtrack(index + 1, current)",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        8
      ],
      "backtrack_include": [
        9
      ],
      "exclude_decision": [
        12
      ],
      "backtrack_exclude": [
        13
      ],
      "exit_backtrack": [
        13
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        8
      ],
      "exclude": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> subsets(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(0, new ArrayList<>(), nums, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(int index, List<Integer> current, int[] nums, List<List<Integer>> result) {\n    // Base case: reached end\n    if (index == nums.length) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n\n    // Include nums[index]\n    current.add(nums[index]);\n    backtrack(index + 1, current, nums, result);\n\n    // Backtrack: exclude nums[index]\n    current.remove(current.size() - 1);\n    backtrack(index + 1, current, nums, result);\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        9
      ],
      "backtrack_include": [
        10
      ],
      "exclude_decision": [
        13
      ],
      "backtrack_exclude": [
        14
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        9
      ],
      "exclude": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> subsets(vector<int>& nums) {\n    vector<vector<int>> result;\n    vector<int> current;\n    backtrack(0, current, nums, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int index, vector<int>& current, vector<int>& nums, vector<vector<int>>& result) {\n    // Base case: reached end\n    if (index == nums.size()) {\n        result.push_back(current);\n        return;\n    }\n\n    // Include nums[index]\n    current.push_back(nums[index]);\n    backtrack(index + 1, current, nums, result);\n\n    // Backtrack: exclude nums[index]\n    current.pop_back();\n    backtrack(index + 1, current, nums, result);\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        9
      ],
      "backtrack_include": [
        10
      ],
      "exclude_decision": [
        13
      ],
      "backtrack_exclude": [
        14
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        9
      ],
      "exclude": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> Subsets(int[] nums) {\n    var result = new List<IList<int>>();\n    Backtrack(0, new List<int>(), nums, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(int index, List<int> current, int[] nums, List<IList<int>> result) {\n    // Base case: reached end\n    if (index == nums.Length) {\n        result.Add(new List<int>(current));\n        return;\n    }\n\n    // Include nums[index]\n    current.Add(nums[index]);\n    Backtrack(index + 1, current, nums, result);\n\n    // Backtrack: exclude nums[index]\n    current.RemoveAt(current.Count - 1);\n    Backtrack(index + 1, current, nums, result);\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        9
      ],
      "backtrack_include": [
        10
      ],
      "exclude_decision": [
        13
      ],
      "backtrack_exclude": [
        14
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        9
      ],
      "exclude": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subsets(nums []int) [][]int {\n    result := [][]int{}\n    current := []int{}\n    backtrack(0, current, nums, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(index int, current []int, nums []int, result *[][]int) {\n    // Base case: reached end\n    if index == len(nums) {\n        subset := make([]int, len(current))\n        copy(subset, current)\n        *result = append(*result, subset)\n        return\n    }\n\n    // Include nums[index]\n    current = append(current, nums[index])\n    backtrack(index+1, current, nums, result)\n\n    // Backtrack: exclude nums[index]\n    current = current[:len(current)-1]\n    backtrack(index+1, current, nums, result)\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5,
        6,
        7
      ],
      "base_case_return": [
        7
      ],
      "include_decision": [
        11
      ],
      "backtrack_include": [
        12
      ],
      "exclude_decision": [
        15
      ],
      "backtrack_exclude": [
        16
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        11
      ],
      "exclude": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function subsets(nums) {\n    const result = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(index, current) {\n    // Base case: reached end\n    if (index === nums.length) {\n        result.push([...current]);\n        return;\n    }\n\n    // Include nums[index]\n    current.push(nums[index]);\n    backtrack(index + 1, current);\n\n    // Backtrack: exclude nums[index]\n    current.pop();\n    backtrack(index + 1, current);\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        9
      ],
      "backtrack_include": [
        10
      ],
      "exclude_decision": [
        13
      ],
      "backtrack_exclude": [
        14
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        9
      ],
      "exclude": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subsets(nums: number[]): number[][] {\n    const result: number[][] = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(index: number, current: number[]): void {\n    // Base case: reached end\n    if (index === nums.length) {\n        result.push([...current]);\n        return;\n    }\n\n    // Include nums[index]\n    current.push(nums[index]);\n    backtrack(index + 1, current);\n\n    // Backtrack: exclude nums[index]\n    current.pop();\n    backtrack(index + 1, current);\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_subset": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "include_decision": [
        9
      ],
      "backtrack_include": [
        10
      ],
      "exclude_decision": [
        13
      ],
      "backtrack_exclude": [
        14
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "at_end": [
        3
      ],
      "include": [
        9
      ],
      "exclude": [
        13
      ]
    }
  }
};

const SubsetsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: [1,2,3]",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: [0]",
    "value": {
      "nums": [
        0
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small: [1,2]",
    "value": {
      "nums": [
        1,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Three elements",
    "value": {
      "nums": [
        5,
        4,
        3
      ]
    }
  }
];

function generateSubsetsSteps(e: any): any[] {
  
let t=e.nums||[],n=new RecursiveStepRecorder({},{});n.pushCallFrame({nums:t,result:void 0},"subsets"),n.record("start","Start: Generate all subsets using backtracking");let s=[];function a(e){let t=n.getCurrentVisuals();Object.keys(t).forEach(r=>{let s=t[r];if("binaryTreeNode"===s.type){let t=r===e,a=s.state;t&&"active"!==a?n.update_visual(r,{...s,state:"active"}):t||"active"!==a||n.update_visual(r,{...s,state:void 0})}})}return n.update_global_variable("result",s),n.update_global_variable("nums",t),n.record("init",`Initialize result = [], nums = [${t.join(", ")}]`),n.record("before_backtrack","Before backtrack"),!function e(r,i,l){let u=l.length>1?l.slice(0,-1):void 0,c=l.length>1?"L"===l[l.length-1]:void 0,o=`[${i.join(",")}]`;if(n.add_new_visual(l,{type:"binaryTreeNode",value:o,parent:u,isLeftChild:c}),n.pushCallFrame({index:r,current:[...i]},"backtrack"),a(l),n.record("enter_backtrack",`Enter backtrack(index=${r}, current=[${i.join(", ")}])`),r===t.length){n.add_conditional("at_end",!0),s.push([...i]),n.update_global_variable("result",s.map(e=>[...e])),n.update_visual(l,{type:"binaryTreeNode",value:o,parent:u,isLeftChild:c,state:"active"}),n.record("add_subset",`Add subset [${i.join(", ")}] to result`),n.popCallFrame();return}n.add_conditional("at_end",!1),n.add_conditional("include",!0),i.push(t[r]),n.update_frame_variable("current",[...i]),n.record("include_decision",`Include ${t[r]} in current subset`),e(r+1,i,l+"L"),a(l),i.pop(),n.update_frame_variable("current",[...i]),n.record("backtrack_include",`Backtrack: remove ${t[r]} from current subset`),n.add_conditional("exclude",!0),n.record("exclude_decision",`Exclude ${t[r]} from current subset`),e(r+1,i,l+"R"),n.add_conditional("exclude",!1),n.update_visual(l,{type:"binaryTreeNode",value:o,parent:u||void 0,isLeftChild:c,state:"active"}),n.record("exit_backtrack",`Exit backtrack(index=${r})`),n.popCallFrame()}(0,[],"0"),n.update_global_variable("result",s.map(e=>[...e])),n.record("complete",`Generated ${s.length} subsets: ${JSON.stringify(s)}`),n.getSteps()
}

export function SubsetsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubsetsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSubsetsSteps(e) as any[];
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
      title="Subsets"
      slug="subsets"
      approaches={approaches}
      presets={SubsetsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Permutations (permutations)
// ==========================================

const PermutationsTemplates = {
  "python": {
    "language": "python",
    "code": "def permute(nums):\n  result = []\n\n  def backtrack(current, used):\n    # Base case: permutation complete\n    if len(current) == len(nums):\n      result.append(current[:])\n      return\n\n    # Try each unused number\n    for i in range(len(nums)):\n      if i in used:\n        continue\n\n      # Choose nums[i]\n      current.append(nums[i])\n      used.add(i)\n      backtrack(current, used)\n\n      # Backtrack\n      current.pop()\n      used.remove(i)\n\n  backtrack([], set())\n  return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        24
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(current, used):\n  # Base case: permutation complete\n  if len(current) == len(nums):\n    result.append(current[:])\n    return\n\n  # Try each unused number\n  for i in range(len(nums)):\n    if i in used:\n      continue\n\n    # Choose nums[i]\n    current.append(nums[i])\n    used.add(i)\n    backtrack(current, used)\n\n    # Backtrack\n    current.pop()\n    used.remove(i)",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        8
      ],
      "add_nums": [
        13,
        14,
        15
      ],
      "skip_used": [
        10
      ],
      "choose": [
        13
      ],
      "backtrack_choice": [
        18,
        19
      ],
      "undo_choose": [
        18
      ],
      "exit_backtrack": [
        19
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        8
      ],
      "is_used": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> permute(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(new ArrayList<>(), new HashSet<>(), nums, result);\n    return result;\n}\n\nprivate void backtrack(List<Integer> current, Set<Integer> used, int[] nums, List<List<Integer>> result) {\n    // Base case: permutation complete\n    if (current.size() == nums.length) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.length; i++) {\n        if (used.contains(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.add(nums[i]);\n        used.add(i);\n        backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.remove(current.size() - 1);\n        used.remove(i);\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(List<Integer> current, Set<Integer> used, int[] nums, List<List<Integer>> result) {\n    // Base case: permutation complete\n    if (current.size() == nums.length) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.length; i++) {\n        if (used.contains(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.add(nums[i]);\n        used.add(i);\n        backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.remove(current.size() - 1);\n        used.remove(i);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        9
      ],
      "add_nums": [
        15,
        16,
        17
      ],
      "skip_used": [
        11
      ],
      "choose": [
        15
      ],
      "backtrack_choice": [
        20,
        21
      ],
      "undo_choose": [
        20
      ],
      "exit_backtrack": [
        23
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        9
      ],
      "is_used": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> permute(vector<int>& nums) {\n    vector<vector<int>> result;\n    vector<int> current;\n    unordered_set<int> used;\n    backtrack(current, used, nums, result);\n    return result;\n}\n\nvoid backtrack(vector<int>& current, unordered_set<int>& used, vector<int>& nums, vector<vector<int>>& result) {\n    // Base case: permutation complete\n    if (current.size() == nums.size()) {\n        result.push_back(current);\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.size(); i++) {\n        if (used.count(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.push_back(nums[i]);\n        used.insert(i);\n        backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.pop_back();\n        used.erase(i);\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(vector<int>& current, unordered_set<int>& used, vector<int>& nums, vector<vector<int>>& result) {\n    // Base case: permutation complete\n    if (current.size() == nums.size()) {\n        result.push_back(current);\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.size(); i++) {\n        if (used.count(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.push_back(nums[i]);\n        used.insert(i);\n        backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.pop_back();\n        used.erase(i);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        9
      ],
      "add_nums": [
        15,
        16,
        17
      ],
      "skip_used": [
        11
      ],
      "choose": [
        15
      ],
      "backtrack_choice": [
        20,
        21
      ],
      "undo_choose": [
        20
      ],
      "exit_backtrack": [
        23
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        9
      ],
      "is_used": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> Permute(int[] nums) {\n    var result = new List<IList<int>>();\n    Backtrack(new List<int>(), new HashSet<int>(), nums, result);\n    return result;\n}\n\nprivate void Backtrack(List<int> current, HashSet<int> used, int[] nums, List<IList<int>> result) {\n    // Base case: permutation complete\n    if (current.Count == nums.Length) {\n        result.Add(new List<int>(current));\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.Length; i++) {\n        if (used.Contains(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.Add(nums[i]);\n        used.Add(i);\n        Backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.RemoveAt(current.Count - 1);\n        used.Remove(i);\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(List<int> current, HashSet<int> used, int[] nums, List<IList<int>> result) {\n    // Base case: permutation complete\n    if (current.Count == nums.Length) {\n        result.Add(new List<int>(current));\n        return;\n    }\n\n    // Try each unused number\n    for (int i = 0; i < nums.Length; i++) {\n        if (used.Contains(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.Add(nums[i]);\n        used.Add(i);\n        Backtrack(current, used, nums, result);\n\n        // Backtrack\n        current.RemoveAt(current.Count - 1);\n        used.Remove(i);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        9
      ],
      "add_nums": [
        15,
        16,
        17
      ],
      "skip_used": [
        11
      ],
      "choose": [
        15
      ],
      "backtrack_choice": [
        20,
        21
      ],
      "undo_choose": [
        20
      ],
      "exit_backtrack": [
        23
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        9
      ],
      "is_used": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func permute(nums []int) [][]int {\n    result := [][]int{}\n    current := []int{}\n    used := make(map[int]bool)\n    backtrack(current, used, nums, &result)\n    return result\n}\n\nfunc backtrack(current []int, used map[int]bool, nums []int, result *[][]int) {\n    // Base case: permutation complete\n    if len(current) == len(nums) {\n        perm := make([]int, len(current))\n        copy(perm, current)\n        *result = append(*result, perm)\n        return\n    }\n\n    // Try each unused number\n    for i := 0; i < len(nums); i++ {\n        if used[i] {\n            continue\n        }\n\n        // Choose nums[i]\n        current = append(current, nums[i])\n        used[i] = true\n        backtrack(current, used, nums, result)\n\n        // Backtrack\n        current = current[:len(current)-1]\n        used[i] = false\n    }\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(current []int, used map[int]bool, nums []int, result *[][]int) {\n    // Base case: permutation complete\n    if len(current) == len(nums) {\n        perm := make([]int, len(current))\n        copy(perm, current)\n        *result = append(*result, perm)\n        return\n    }\n\n    // Try each unused number\n    for i := 0; i < len(nums); i++ {\n        if used[i] {\n            continue\n        }\n\n        // Choose nums[i]\n        current = append(current, nums[i])\n        used[i] = true\n        backtrack(current, used, nums, result)\n\n        // Backtrack\n        current = current[:len(current)-1]\n        used[i] = false\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5,
        6,
        7
      ],
      "base_case_return": [
        7
      ],
      "for_loop": [
        11
      ],
      "add_nums": [
        17,
        18,
        19
      ],
      "skip_used": [
        13
      ],
      "choose": [
        17
      ],
      "backtrack_choice": [
        22,
        23
      ],
      "undo_choose": [
        22
      ],
      "exit_backtrack": [
        25
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        11
      ],
      "is_used": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function permute(nums) {\n    const result = [];\n\n    function backtrack(current, used) {\n        // Base case: permutation complete\n        if (current.length === nums.length) {\n            result.push([...current]);\n            return;\n        }\n\n        // Try each unused number\n        for (let i = 0; i < nums.length; i++) {\n            if (used.has(i)) {\n                continue;\n            }\n\n            // Choose nums[i]\n            current.push(nums[i]);\n            used.add(i);\n            backtrack(current, used);\n\n            // Backtrack\n            current.pop();\n            used.delete(i);\n        }\n    }\n\n    backtrack([], new Set());\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        28
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(current, used) {\n    // Base case: permutation complete\n    if (current.length === nums.length) {\n        result.push([...current]);\n        return;\n    }\n\n    // Try each unused number\n    for (let i = 0; i < nums.length; i++) {\n        if (used.has(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.push(nums[i]);\n        used.add(i);\n        backtrack(current, used);\n\n        // Backtrack\n        current.pop();\n        used.delete(i);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        9
      ],
      "add_nums": [
        15,
        16,
        17
      ],
      "skip_used": [
        11
      ],
      "choose": [
        15
      ],
      "backtrack_choice": [
        20,
        21
      ],
      "undo_choose": [
        20
      ],
      "exit_backtrack": [
        23
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        9
      ],
      "is_used": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function permute(nums: number[]): number[][] {\n    const result: number[][] = [];\n\n    function backtrack(current: number[], used: Set<number>): void {\n        // Base case: permutation complete\n        if (current.length === nums.length) {\n            result.push([...current]);\n            return;\n        }\n\n        // Try each unused number\n        for (let i = 0; i < nums.length; i++) {\n            if (used.has(i)) {\n                continue;\n            }\n\n            // Choose nums[i]\n            current.push(nums[i]);\n            used.add(i);\n            backtrack(current, used);\n\n            // Backtrack\n            current.pop();\n            used.delete(i);\n        }\n    }\n\n    backtrack([], new Set());\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        28
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(current: number[], used: Set<number>): void {\n    // Base case: permutation complete\n    if (current.length === nums.length) {\n        result.push([...current]);\n        return;\n    }\n\n    // Try each unused number\n    for (let i = 0; i < nums.length; i++) {\n        if (used.has(i)) {\n            continue;\n        }\n\n        // Choose nums[i]\n        current.push(nums[i]);\n        used.add(i);\n        backtrack(current, used);\n\n        // Backtrack\n        current.pop();\n        used.delete(i);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "base_case_check": [
        3
      ],
      "add_permutation": [
        4,
        5
      ],
      "base_case_return": [
        5
      ],
      "for_loop": [
        9
      ],
      "add_nums": [
        15,
        16,
        17
      ],
      "skip_used": [
        11
      ],
      "choose": [
        15
      ],
      "backtrack_choice": [
        20,
        21
      ],
      "undo_choose": [
        20
      ],
      "exit_backtrack": [
        23
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_nums": [
        9
      ],
      "is_used": [
        10
      ]
    }
  }
};

const PermutationsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: [1,2,3]",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: [0,1]",
    "value": {
      "nums": [
        0,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single element",
    "value": {
      "nums": [
        1
      ]
    }
  }
];

function generatePermutationsSteps(e: any): any[] {
  
let t=e.nums||[],r=new RecursiveStepRecorder({},{});r.pushCallFrame({nums:t},"permute"),r.record("start","Start: Generate all permutations using backtracking");let a=[];function i(e){let t=r.getCurrentVisuals();Object.keys(t).forEach(n=>{let a=t[n];if("naryTreeNode"===a.type){let t=n===e,i=a.state;t&&"active"!==i?r.update_visual(n,{...a,state:"active"}):t||"active"!==i||r.update_visual(n,{...a,state:void 0})}})}return r.update_global_variable("result",a),r.update_global_variable("nums",t),r.record("init",`Initialize result = [], nums = [${t.join(", ")}]`),r.record("before_backtrack","Before backtrack"),!function e(n,s,l){let u=l.lastIndexOf("-"),c=u>0?l.substring(0,u):null,o=u>0?parseInt(l.substring(u+1),10):void 0,d=`[${n.join(",")}]`;if(r.add_new_visual(l,{type:"naryTreeNode",value:d,parent:c||void 0,childIndex:o}),r.pushCallFrame({current:[...n],used:Array.from(s)},"backtrack"),i(l),r.record("enter_backtrack",`Enter backtrack(current=[${n.join(", ")}], used=${Array.from(s).length}/${t.length})`),n.length===t.length){r.add_conditional("is_complete",!0),a.push([...n]),r.update_global_variable("result",a.map(e=>[...e])),r.update_visual(l,{type:"naryTreeNode",value:`[${n.join(",")}]`,parent:c||void 0,childIndex:o,state:"active"}),r.record("add_permutation",`Add permutation [${n.join(", ")}] to result`),r.popCallFrame();return}r.add_conditional("is_complete",!1);for(let a=0;a<t.length;a++){if(r.add_conditional("for_nums",!0),r.update_frame_variable("i",a),s.has(a)){r.add_conditional("is_used",!0),r.record("skip_used",`Skip nums[${a}]=${t[a]} (already used)`);continue}r.add_conditional("is_used",!1),n.push(t[a]),s.add(a),r.update_frame_variable("current",[...n]),r.update_frame_variable("used",Array.from(s)),r.record("add_nums",`Add nums[${a}]=${t[a]} to current`),e(n,s,l+"-"+a),i(l),n.pop(),s.delete(a),r.update_frame_variable("current",[...n]),r.update_frame_variable("used",Array.from(s)),r.record("backtrack_choice",`Backtrack: remove nums[${a}]=${t[a]}`)}r.add_conditional("for_nums",!1),r.update_visual(l,{type:"naryTreeNode",value:d,parent:c||void 0,childIndex:o,state:"active"}),r.record("exit_backtrack",`Exit backtrack(depth=${n.length})`),r.popCallFrame()}([],new Set,"0"),r.update_global_variable("result",a.map(e=>[...e])),r.record("complete",`Generated ${a.length} permutations`),r.getSteps()
}

export function PermutationsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PermutationsTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePermutationsSteps(e) as any[];
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
      title="Permutations"
      slug="permutations"
      approaches={approaches}
      presets={PermutationsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Combination Sum (combination-sum)
// ==========================================

const CombinationSumTemplates = {
  "python": {
    "language": "python",
    "code": "def combinationSum(candidates, target):\n  result = []\n  backtrack(0, [], target)\n  return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(start, current, remaining):\n  # Base case: found valid combination\n  if remaining == 0:\n    result.append(current[:])\n    return\n\n  # Base case: prune invalid branches\n  if remaining < 0 or start >= len(candidates):\n    return\n\n  # Try each candidate from start onwards\n  for i in range(start, len(candidates)):\n    # Choose candidates[i]\n    current.append(candidates[i])\n\n    # Recurse: can reuse same element\n    backtrack(i, current, remaining - candidates[i])\n\n    # Backtrack: undo choice\n    current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        9
      ],
      "add_candidate": [
        14
      ],
      "backtrack_choice": [
        20
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        8
      ],
      "for_candidates": [
        12
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(candidates, 0, target, new ArrayList<>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(int[] candidates, int start, int remaining, List<Integer> current, List<List<Integer>> result) {\n    // Base case: found valid combination\n    if (remaining == 0) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n\n    // Base case: prune invalid branches\n    if (remaining < 0 || start >= candidates.length) {\n        return;\n    }\n\n    // Try each candidate from start onwards\n    for (int i = start; i < candidates.length; i++) {\n        // Choose candidates[i]\n        current.add(candidates[i]);\n\n        // Recurse: can reuse same element\n        backtrack(candidates, i, remaining - candidates[i], current, result);\n\n        // Backtrack: undo choice\n        current.remove(current.size() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        10
      ],
      "add_candidate": [
        16
      ],
      "backtrack_choice": [
        22
      ],
      "exit_backtrack": [
        24
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        9
      ],
      "for_candidates": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> result;\n    vector<int> current;\n    backtrack(candidates, 0, target, current, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(vector<int>& candidates, int start, int remaining, vector<int>& current, vector<vector<int>>& result) {\n    // Base case: found valid combination\n    if (remaining == 0) {\n        result.push_back(current);\n        return;\n    }\n\n    // Base case: prune invalid branches\n    if (remaining < 0 || start >= (int)candidates.size()) {\n        return;\n    }\n\n    // Try each candidate from start onwards\n    for (int i = start; i < candidates.size(); i++) {\n        // Choose candidates[i]\n        current.push_back(candidates[i]);\n\n        // Recurse: can reuse same element\n        backtrack(candidates, i, remaining - candidates[i], current, result);\n\n        // Backtrack: undo choice\n        current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        10
      ],
      "add_candidate": [
        16
      ],
      "backtrack_choice": [
        22
      ],
      "exit_backtrack": [
        24
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        9
      ],
      "for_candidates": [
        14
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> CombinationSum(int[] candidates, int target) {\n    var result = new List<IList<int>>();\n    Backtrack(candidates, 0, target, new List<int>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(int[] candidates, int start, int remaining, List<int> current, List<IList<int>> result) {\n    // Base case: found valid combination\n    if (remaining == 0) {\n        result.Add(new List<int>(current));\n        return;\n    }\n\n    // Base case: prune invalid branches\n    if (remaining < 0 || start >= candidates.Length) {\n        return;\n    }\n\n    // Try each candidate from start onwards\n    for (int i = start; i < candidates.Length; i++) {\n        // Choose candidates[i]\n        current.Add(candidates[i]);\n\n        // Recurse: can reuse same element\n        Backtrack(candidates, i, remaining - candidates[i], current, result);\n\n        // Backtrack: undo choice\n        current.RemoveAt(current.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        10
      ],
      "add_candidate": [
        16
      ],
      "backtrack_choice": [
        22
      ],
      "exit_backtrack": [
        24
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        9
      ],
      "for_candidates": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func combinationSum(candidates []int, target int) [][]int {\n    result := [][]int{}\n    current := []int{}\n    backtrack(candidates, 0, target, current, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(candidates []int, start int, remaining int, current []int, result *[][]int) {\n    // Base case: found valid combination\n    if remaining == 0 {\n        combo := make([]int, len(current))\n        copy(combo, current)\n        *result = append(*result, combo)\n        return\n    }\n\n    // Base case: prune invalid branches\n    if remaining < 0 || start >= len(candidates) {\n        return\n    }\n\n    // Try each candidate from start onwards\n    for i := start; i < len(candidates); i++ {\n        // Choose candidates[i]\n        current = append(current, candidates[i])\n\n        // Recurse: can reuse same element\n        backtrack(candidates, i, remaining-candidates[i], current, result)\n\n        // Backtrack: undo choice\n        current = current[:len(current)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5,
        6,
        7
      ],
      "prune": [
        12
      ],
      "add_candidate": [
        18
      ],
      "backtrack_choice": [
        24
      ],
      "exit_backtrack": [
        26
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        11
      ],
      "for_candidates": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function combinationSum(candidates, target) {\n    const result = [];\n    backtrack(0, [], target);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start, current, remaining) {\n    // Base case: found valid combination\n    if (remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n\n    // Base case: prune invalid branches\n    if (remaining < 0 || start >= candidates.length) {\n        return;\n    }\n\n    // Try each candidate from start onwards\n    for (let i = start; i < candidates.length; i++) {\n        // Choose candidates[i]\n        current.push(candidates[i]);\n\n        // Recurse: can reuse same element\n        backtrack(i, current, remaining - candidates[i]);\n\n        // Backtrack: undo choice\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        10
      ],
      "add_candidate": [
        16
      ],
      "backtrack_choice": [
        22
      ],
      "exit_backtrack": [
        24
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        9
      ],
      "for_candidates": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function combinationSum(candidates: number[], target: number): number[][] {\n    const result: number[][] = [];\n    backtrack(0, [], target);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start: number, current: number[], remaining: number): void {\n    // Base case: found valid combination\n    if (remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n\n    // Base case: prune invalid branches\n    if (remaining < 0 || start >= candidates.length) {\n        return;\n    }\n\n    // Try each candidate from start onwards\n    for (let i = start; i < candidates.length; i++) {\n        // Choose candidates[i]\n        current.push(candidates[i]);\n\n        // Recurse: can reuse same element\n        backtrack(i, current, remaining - candidates[i]);\n\n        // Backtrack: undo choice\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        4,
        5
      ],
      "prune": [
        10
      ],
      "add_candidate": [
        16
      ],
      "backtrack_choice": [
        22
      ],
      "exit_backtrack": [
        24
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        3
      ],
      "out_of_bounds": [
        9
      ],
      "for_candidates": [
        14
      ]
    }
  }
};

const CombinationSumPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "candidates": [
        2,
        3,
        6,
        7
      ],
      "target": 7
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Solutions",
    "value": {
      "candidates": [
        2,
        3,
        5
      ],
      "target": 8
    }
  },
  {
    "id": "ex3",
    "label": "No Solution",
    "value": {
      "candidates": [
        2
      ],
      "target": 1
    }
  },
  {
    "id": "ex4",
    "label": "Reuse Elements",
    "value": {
      "candidates": [
        3,
        5,
        8
      ],
      "target": 11
    }
  },
  {
    "id": "ex5",
    "label": "Many Candidates",
    "value": {
      "candidates": [
        2,
        7,
        6,
        3,
        5,
        1
      ],
      "target": 9
    }
  }
];

function generateCombinationSumSteps(e: any): any[] {
  
let t=e.candidates||[],a=e.target||0,n=new RecursiveStepRecorder({},{}),i={};t.forEach((e,t)=>{i[`elem_${t}`]={type:"arrayElement",value:e,position:t}}),Object.keys(i).forEach(e=>{n.add_new_visual(e,i[e])}),n.pushCallFrame({candidates:t,target:a},"combinationSum"),n.record("start","Start: Find combinations that sum to target");let c=[];function s(e){let t=n.getCurrentVisuals();Object.keys(t).forEach(a=>{let r=t[a];if("naryTreeNode"===r.type){let t=a===e,i=r.state;t&&"active"!==i?n.update_visual(a,{...r,state:"active"}):t||"active"!==i||n.update_visual(a,{...r,state:void 0})}})}return n.update_global_variable("result",c),n.update_global_variable("candidates",t),n.update_global_variable("target",a),n.record("init",`Initialize: candidates = [${t.join(", ")}], target = ${a}`),n.record("before_backtrack","Start backtracking"),!function e(a,r,i,d){let o=d.lastIndexOf("-"),l=o>0?d.substring(0,o):null,u=o>0?parseInt(d.substring(o+1),10):void 0,m=`[${r.join(",")}]
${i}`;if(n.add_new_visual(d,{type:"naryTreeNode",value:m,parent:l||void 0,childIndex:u}),n.pushCallFrame({start:a,current:[...r],remaining:i},"backtrack"),a<t.length?n.add_new_visual("ptr_start",{type:"pointer",position:a,label:"start"}):n.get_visual("ptr_start")&&n.delete_visual("ptr_start"),s(d),n.record("enter_backtrack",`Enter backtrack(start=${a}, current=[${r.join(", ")}], remaining=${i})`),0===i){n.add_conditional("remaining_zero",!0),c.push([...r]),n.update_global_variable("result",c.map(e=>[...e])),n.update_visual(d,{type:"naryTreeNode",value:`[${r.join(",")}]`,parent:l||void 0,childIndex:u,state:"visited"}),n.record("add_combination",`Found valid combination: [${r.join(", ")}]`),n.popCallFrame();return}if(n.add_conditional("remaining_zero",!1),i<0||a>=t.length){n.add_conditional("out_of_bounds",!0),n.record("prune",`Prune: remaining=${i}, start=${a}`),n.popCallFrame();return}n.add_conditional("out_of_bounds",!1);for(let c=a;c<t.length;c++)n.add_conditional("for_candidates",!0),n.update_frame_variable("i",c),n.update_visual("ptr_start",{type:"pointer",position:c,label:"start"}),r.push(t[c]),n.update_frame_variable("current",[...r]),n.update_frame_variable("remaining",i-t[c]),n.record("add_candidate",`Choose candidates[${c}]=${t[c]}, new remaining=${i-t[c]}`),e(c,r,i-t[c],d+"-"+c),s(d),r.pop(),n.update_frame_variable("current",[...r]),n.update_frame_variable("remaining",i),n.update_visual("ptr_start",{type:"pointer",position:c,label:"start"}),n.record("backtrack_choice",`Backtrack: remove candidates[${c}]=${t[c]}`);n.add_conditional("for_candidates",!1),n.update_visual(d,{type:"naryTreeNode",value:m,parent:l||void 0,childIndex:u,state:"active"}),n.record("exit_backtrack",`Exit backtrack(start=${a})`),n.popCallFrame()}(0,[],a,"0"),n.get_visual("ptr_start")&&n.delete_visual("ptr_start"),n.update_global_variable("result",c.map(e=>[...e])),n.record("complete",`Found ${c.length} valid combinations`),n.getSteps()
}

export function CombinationSumProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CombinationSumTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCombinationSumSteps(e) as any[];
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
      title="Combination Sum"
      slug="combination-sum"
      approaches={approaches}
      presets={CombinationSumPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Combination Sum II (combination-sum-ii)
// ==========================================

const CombinationSumIiTemplates = {
  "python": {
    "language": "python",
    "code": "def combinationSum2(candidates, target):\n    freq = {}\n    for c in sorted(candidates):\n        freq[c] = freq.get(c, 0) + 1\n    pairs = list(freq.items())\n    result = []\n    backtrack(pairs, 0, target, [], result)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(pairs, index, remaining, current, result):\n    if remaining == 0:\n        result.append(current[:])\n        return\n    if index == len(pairs):\n        return\n    value, count = pairs[index]\n    for copies in range(count + 1):\n        if value * copies > remaining:\n            break\n        for j in range(copies):\n            current.append(value)\n        backtrack(pairs, index + 1, remaining - value * copies, current, result)\n        for j in range(copies):\n            current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        12
      ],
      "backtrack_copies": [
        14,
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        5
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> combinationSum2(int[] candidates, int target) {\n    Map<Integer, Integer> freq = new TreeMap<>();\n    for (int c : candidates) freq.merge(c, 1, Integer::sum);\n    int[][] pairs = freq.entrySet().stream()\n        .map(e -> new int[]{e.getKey(), e.getValue()}).toArray(int[][]::new);\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(pairs, 0, target, new ArrayList<>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int[][] pairs, int index, int remaining, List<Integer> current, List<List<Integer>> result) {\n    if (remaining == 0) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n    if (index == pairs.length) return;\n    int value = pairs[index][0], count = pairs[index][1];\n    for (int copies = 0; copies <= count; copies++) {\n        if (value * copies > remaining) break;\n        for (int j = 0; j < copies; j++) current.add(value);\n        backtrack(pairs, index + 1, remaining - value * copies, current, result);\n        for (int j = 0; j < copies; j++) current.remove(current.size() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        11
      ],
      "backtrack_copies": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {\n    map<int, int> freq;\n    for (int c : candidates) freq[c]++;\n    vector<pair<int,int>> pairs(freq.begin(), freq.end());\n    vector<vector<int>> result;\n    vector<int> current;\n    backtrack(pairs, 0, target, current, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(vector<pair<int,int>>& pairs, int index, int remaining, vector<int>& current, vector<vector<int>>& result) {\n    if (remaining == 0) {\n        result.push_back(current);\n        return;\n    }\n    if (index == pairs.size()) return;\n    auto [value, count] = pairs[index];\n    for (int copies = 0; copies <= count; copies++) {\n        if (value * copies > remaining) break;\n        for (int j = 0; j < copies; j++) current.push_back(value);\n        backtrack(pairs, index + 1, remaining - value * copies, current, result);\n        for (int j = 0; j < copies; j++) current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        11
      ],
      "backtrack_copies": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> CombinationSum2(int[] candidates, int target) {\n    var freq = new SortedDictionary<int, int>();\n    foreach (int c in candidates)\n        freq[c] = freq.GetValueOrDefault(c) + 1;\n    var pairs = freq.Select(p => (p.Key, p.Value)).ToList();\n    var result = new List<IList<int>>();\n    Backtrack(pairs, 0, target, new List<int>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void Backtrack(List<(int val, int cnt)> pairs, int index, int remaining, List<int> current, List<IList<int>> result) {\n    if (remaining == 0) {\n        result.Add(new List<int>(current));\n        return;\n    }\n    if (index == pairs.Count) return;\n    var (value, count) = pairs[index];\n    for (int copies = 0; copies <= count; copies++) {\n        if (value * copies > remaining) break;\n        for (int j = 0; j < copies; j++) current.Add(value);\n        Backtrack(pairs, index + 1, remaining - value * copies, current, result);\n        for (int j = 0; j < copies; j++) current.RemoveAt(current.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        11
      ],
      "backtrack_copies": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func combinationSum2(candidates []int, target int) [][]int {\n    sort.Ints(candidates)\n    freq := map[int]int{}\n    for _, c := range candidates { freq[c]++ }\n    pairs := [][2]int{}\n    for v, c := range freq { pairs = append(pairs, [2]int{v, c}) }\n    sort.Slice(pairs, func(i, j int) bool { return pairs[i][0] < pairs[j][0] })\n    result := [][]int{}\n    backtrack(pairs, 0, target, []int{}, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "before_backtrack": [
        9
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(pairs [][2]int, index int, remaining int, current []int, result *[][]int) {\n    if remaining == 0 {\n        combo := make([]int, len(current))\n        copy(combo, current)\n        *result = append(*result, combo)\n        return\n    }\n    if index == len(pairs) { return }\n    value, count := pairs[index][0], pairs[index][1]\n    for copies := 0; copies <= count; copies++ {\n        if value*copies > remaining { break }\n        for j := 0; j < copies; j++ { current = append(current, value) }\n        backtrack(pairs, index+1, remaining-value*copies, current, result)\n        current = current[:len(current)-copies]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4,
        5,
        6
      ],
      "prune": [
        8
      ],
      "try_copies": [
        10
      ],
      "before_backtrack": [
        13
      ],
      "backtrack_copies": [
        14
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        8
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function combinationSum2(candidates, target) {\n    candidates.sort((a, b) => a - b);\n    const freq = new Map();\n    for (const c of candidates) freq.set(c, (freq.get(c) || 0) + 1);\n    const pairs = [...freq.entries()];\n    const result = [];\n    backtrack(pairs, 0, target, [], result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(pairs, index, remaining, current, result) {\n    if (remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n    if (index === pairs.length) return;\n    const [value, count] = pairs[index];\n    for (let copies = 0; copies <= count; copies++) {\n        if (value * copies > remaining) break;\n        for (let j = 0; j < copies; j++) current.push(value);\n        backtrack(pairs, index + 1, remaining - value * copies, current, result);\n        for (let j = 0; j < copies; j++) current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        11
      ],
      "backtrack_copies": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function combinationSum2(candidates: number[], target: number): number[][] {\n    candidates.sort((a, b) => a - b);\n    const freq = new Map<number, number>();\n    for (const c of candidates) freq.set(c, (freq.get(c) || 0) + 1);\n    const pairs = [...freq.entries()];\n    const result: number[][] = [];\n    backtrack(pairs, 0, target, [], result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(pairs: [number, number][], index: number, remaining: number, current: number[], result: number[][]): void {\n    if (remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n    if (index === pairs.length) return;\n    const [value, count] = pairs[index];\n    for (let copies = 0; copies <= count; copies++) {\n        if (value * copies > remaining) break;\n        for (let j = 0; j < copies; j++) current.push(value);\n        backtrack(pairs, index + 1, remaining - value * copies, current, result);\n        for (let j = 0; j < copies; j++) current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "try_copies": [
        8
      ],
      "before_backtrack": [
        11
      ],
      "backtrack_copies": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "remaining_zero": [
        2
      ],
      "index_end": [
        6
      ]
    }
  }
};

const CombinationSumIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "candidates": [
        1,
        1,
        2,
        5,
        6,
        7,
        10
      ],
      "target": 8
    }
  },
  {
    "id": "ex2",
    "label": "Multiple Dupes",
    "value": {
      "candidates": [
        2,
        5,
        2,
        1,
        2
      ],
      "target": 5
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "candidates": [
        1,
        1
      ],
      "target": 2
    }
  }
];

function generateCombinationSumIiSteps(e: any): any[] {
  
let t=e.candidates||[],n=e.target||0,r=new RecursiveStepRecorder({},{});r.pushCallFrame({candidates:t,target:n},"combinationSum2"),r.record("start","Start: Find combinations that sum to target (each candidate used at most once)");let a=[...t].sort((e,t)=>e-t),s=new Map;for(let e of a)s.set(e,(s.get(e)||0)+1);let c=Array.from(s.entries()),o=[];function l(e){let t=r.getCurrentVisuals();Object.keys(t).forEach(n=>{let i=t[n];if("naryTreeNode"===i.type){let t=n===e,a=i.state;t&&"active"!==a?r.update_visual(n,{...i,state:"active"}):t||"active"!==a||r.update_visual(n,{...i,state:void 0})}})}return r.update_global_variable("pairs",c.map(([e,t])=>`(${e},${t})`)),r.update_global_variable("target",n),r.update_global_variable("result",o),c.forEach(([e,t],n)=>{r.add_new_visual(`pair_${n}`,{type:"arrayElement",value:`(${e},${t})`,position:n,label:`pairs[${n}]`})}),r.record("init",`Build freq pairs: [${c.map(([e,t])=>`(${e},${t})`).join(", ")}], target = ${n}`),r.record("before_backtrack","Start backtracking"),!function e(t,n,i,a){let s=a.lastIndexOf("-"),d=s>0?a.substring(0,s):null,u=s>0?parseInt(a.substring(s+1),10):void 0,p=`[${n.join(",")}]
${i}`;if(r.add_new_visual(a,{type:"naryTreeNode",value:p,parent:d||void 0,childIndex:u}),r.pushCallFrame({index:t,current:[...n],remaining:i},"backtrack"),l(a),r.record("enter_backtrack",`Enter backtrack(index=${t}, current=[${n.join(", ")}], remaining=${i})`),0===i){r.add_conditional("remaining_zero",!0),o.push([...n]),r.update_global_variable("result",o.map(e=>[...e])),r.update_visual(a,{type:"naryTreeNode",value:`[${n.join(",")}]`,parent:d||void 0,childIndex:u,state:"visited"}),r.record("add_combination",`Found valid combination: [${n.join(", ")}]`),r.popCallFrame();return}if(r.add_conditional("remaining_zero",!1),t===c.length){r.add_conditional("index_end",!0),r.record("prune",`No more pairs to try (index=${t})`),r.popCallFrame();return}r.add_conditional("index_end",!1);let[m,f]=c[t];for(let s=0;s<=f&&!(m*s>i);s++){r.update_frame_variable("copies",s),r.record("try_copies",`Try ${s} copies of value ${m} (cost = ${m*s})`);for(let e=0;e<s;e++)n.push(m);r.update_frame_variable("current",[...n]),r.record("before_backtrack",`Recurse with current=[${n.join(", ")}], remaining=${i-m*s}`),e(t+1,n,i-m*s,a+"-"+s),l(a);for(let e=0;e<s;e++)n.pop();r.update_frame_variable("current",[...n]),r.update_frame_variable("remaining",i),r.record("backtrack_copies",`Backtrack: remove ${s} copies of ${m}`)}r.update_visual(a,{type:"naryTreeNode",value:p,parent:d||void 0,childIndex:u,state:"active"}),r.record("exit_backtrack",`Exit backtrack(index=${t})`),r.popCallFrame()}(0,[],n,"0"),r.update_global_variable("result",o.map(e=>[...e])),r.record("complete",`Found ${o.length} valid combinations`),r.getSteps()
}

export function CombinationSumIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CombinationSumIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCombinationSumIiSteps(e) as any[];
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
      title="Combination Sum II"
      slug="combination-sum-ii"
      approaches={approaches}
      presets={CombinationSumIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Combination Sum III (combination-sum-iii)
// ==========================================

const CombinationSumIiiTemplates = {
  "python": {
    "language": "python",
    "code": "def combinationSum3(k, n):\n    result = []\n    backtrack(1, k, n, [], result)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(start, k, remaining, current, result):\n    if k == 0 and remaining == 0:\n        result.append(current[:])\n        return\n    if k == 0 or remaining < 0:\n        return\n    for num in range(start, 10):\n        if num > remaining:\n            break\n        current.append(num)\n        backtrack(num + 1, k - 1, remaining - num, current, result)\n        current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        6
      ],
      "choose_num": [
        10
      ],
      "backtrack_num": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        5
      ],
      "num_exceeds": [
        8
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> combinationSum3(int k, int n) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(1, k, n, new ArrayList<>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(int start, int k, int remaining, List<Integer> current, List<List<Integer>> result) {\n    if (k == 0 && remaining == 0) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n    if (k == 0 || remaining < 0) {\n        return;\n    }\n    for (int num = start; num <= 9; num++) {\n        if (num > remaining) {\n            break;\n        }\n        current.add(num);\n        backtrack(num + 1, k - 1, remaining - num, current, result);\n        current.remove(current.size() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        7
      ],
      "choose_num": [
        13
      ],
      "backtrack_num": [
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        6
      ],
      "num_exceeds": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> combinationSum3(int k, int n) {\n    vector<vector<int>> result;\n    vector<int> current;\n    backtrack(1, k, n, current, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int start, int k, int remaining, vector<int>& current, vector<vector<int>>& result) {\n    if (k == 0 && remaining == 0) {\n        result.push_back(current);\n        return;\n    }\n    if (k == 0 || remaining < 0) {\n        return;\n    }\n    for (int num = start; num <= 9; num++) {\n        if (num > remaining) {\n            break;\n        }\n        current.push_back(num);\n        backtrack(num + 1, k - 1, remaining - num, current, result);\n        current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        7
      ],
      "choose_num": [
        13
      ],
      "backtrack_num": [
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        6
      ],
      "num_exceeds": [
        10
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> CombinationSum3(int k, int n) {\n    var result = new List<IList<int>>();\n    Backtrack(1, k, n, new List<int>(), result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(int start, int k, int remaining, List<int> current, List<IList<int>> result) {\n    if (k == 0 && remaining == 0) {\n        result.Add(new List<int>(current));\n        return;\n    }\n    if (k == 0 || remaining < 0) {\n        return;\n    }\n    for (int num = start; num <= 9; num++) {\n        if (num > remaining) {\n            break;\n        }\n        current.Add(num);\n        Backtrack(num + 1, k - 1, remaining - num, current, result);\n        current.RemoveAt(current.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        7
      ],
      "choose_num": [
        13
      ],
      "backtrack_num": [
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        6
      ],
      "num_exceeds": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func combinationSum3(k int, n int) [][]int {\n    result := [][]int{}\n    current := []int{}\n    backtrack(1, k, n, current, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(start, k, remaining int, current []int, result *[][]int) {\n    if k == 0 && remaining == 0 {\n        combo := make([]int, len(current))\n        copy(combo, current)\n        *result = append(*result, combo)\n        return\n    }\n    if k == 0 || remaining < 0 {\n        return\n    }\n    for num := start; num <= 9; num++ {\n        if num > remaining {\n            break\n        }\n        current = append(current, num)\n        backtrack(num+1, k-1, remaining-num, current, result)\n        current = current[:len(current)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4,
        5,
        6
      ],
      "prune": [
        9
      ],
      "choose_num": [
        15
      ],
      "backtrack_num": [
        17
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        8
      ],
      "num_exceeds": [
        12
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function combinationSum3(k, n) {\n    const result = [];\n    backtrack(1, k, n, []);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start, k, remaining, current) {\n    if (k === 0 && remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n    if (k === 0 || remaining < 0) {\n        return;\n    }\n    for (let num = start; num <= 9; num++) {\n        if (num > remaining) {\n            break;\n        }\n        current.push(num);\n        backtrack(num + 1, k - 1, remaining - num, current);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        7
      ],
      "choose_num": [
        13
      ],
      "backtrack_num": [
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        6
      ],
      "num_exceeds": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function combinationSum3(k: number, n: number): number[][] {\n    const result: number[][] = [];\n    backtrack(1, k, n, []);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start: number, k: number, remaining: number, current: number[]): void {\n    if (k === 0 && remaining === 0) {\n        result.push([...current]);\n        return;\n    }\n    if (k === 0 || remaining < 0) {\n        return;\n    }\n    for (let num = start; num <= 9; num++) {\n        if (num > remaining) {\n            break;\n        }\n        current.push(num);\n        backtrack(num + 1, k - 1, remaining - num, current);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "prune": [
        7
      ],
      "choose_num": [
        13
      ],
      "backtrack_num": [
        15
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "found_valid": [
        2
      ],
      "prune_invalid": [
        6
      ],
      "num_exceeds": [
        10
      ]
    }
  }
};

const CombinationSumIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: k=3, n=7",
    "value": {
      "k": 3,
      "n": 7
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: k=3, n=9",
    "value": {
      "k": 3,
      "n": 9
    }
  },
  {
    "id": "ex3",
    "label": "Small: k=2, n=5",
    "value": {
      "k": 2,
      "n": 5
    }
  },
  {
    "id": "ex4",
    "label": "Larger: k=4, n=10",
    "value": {
      "k": 4,
      "n": 10
    }
  }
];

function generateCombinationSumIiiSteps(e: any): any[] {
  
let t=e.k||0,n=e.n||0,r=new RecursiveStepRecorder({},{});r.pushCallFrame({k:t,n:n},"combinationSum3"),r.record("start","Start: Find k numbers from 1-9 that sum to n");let a=[];function o(e){let t=r.getCurrentVisuals();Object.keys(t).forEach(n=>{let i=t[n];if("naryTreeNode"===i.type){let t=n===e,a=i.state;t&&"active"!==a?r.update_visual(n,{...i,state:"active"}):t||"active"!==a||r.update_visual(n,{...i,state:void 0})}})}return r.update_global_variable("k",t),r.update_global_variable("n",n),r.update_global_variable("result",a),r.record("init",`Initialize: k = ${t}, n = ${n}`),r.record("before_backtrack","Start backtracking"),!function e(t,n,i,s,l){let c=l.lastIndexOf("-"),u=c>0?l.substring(0,c):null,m=c>0?parseInt(l.substring(c+1),10):void 0,d=`[${s.join(",")}]
${i}`;if(r.add_new_visual(l,{type:"naryTreeNode",value:d,parent:u||void 0,childIndex:m}),r.pushCallFrame({start:t,k_remaining:n,remaining:i,current:[...s]},"backtrack"),o(l),r.record("enter_backtrack",`Enter backtrack(start=${t}, k=${n}, remaining=${i}, current=[${s.join(", ")}])`),0===n&&0===i){r.add_conditional("found_valid",!0),a.push([...s]),r.update_global_variable("result",a.map(e=>[...e])),r.update_visual(l,{type:"naryTreeNode",value:`[${s.join(",")}]`,parent:u||void 0,childIndex:m,state:"visited"}),r.record("add_combination",`Found valid combination: [${s.join(", ")}]`),r.popCallFrame();return}if(r.add_conditional("found_valid",!1),0===n||i<0){r.add_conditional("prune_invalid",!0),r.record("prune",`Prune: k_remaining=${n}, remaining=${i}`),r.popCallFrame();return}r.add_conditional("prune_invalid",!1);for(let a=t;a<=9;a++){if(a>i){r.add_conditional("num_exceeds",!0),r.update_frame_variable("num",a),r.record("prune",`Prune: num=${a} > remaining=${i}, break`);break}r.add_conditional("num_exceeds",!1),r.update_frame_variable("num",a),s.push(a),r.update_frame_variable("current",[...s]),r.update_frame_variable("remaining",i-a),r.record("choose_num",`Choose num=${a}, new remaining=${i-a}`);let c=a-t;e(a+1,n-1,i-a,s,l+"-"+c),o(l),s.pop(),r.update_frame_variable("current",[...s]),r.update_frame_variable("remaining",i),r.record("backtrack_num",`Backtrack: remove num=${a}`)}r.update_visual(l,{type:"naryTreeNode",value:d,parent:u||void 0,childIndex:m,state:"active"}),r.record("exit_backtrack",`Exit backtrack(start=${t})`),r.popCallFrame()}(1,t,n,[],"0"),r.update_global_variable("result",a.map(e=>[...e])),r.record("complete",`Found ${a.length} valid combinations`),r.getSteps()
}

export function CombinationSumIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CombinationSumIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCombinationSumIiiSteps(e) as any[];
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
      title="Combination Sum III"
      slug="combination-sum-iii"
      approaches={approaches}
      presets={CombinationSumIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Combinations (combinations)
// ==========================================

const CombinationsTemplates = {
  "python": {
    "language": "python",
    "code": "def combine(n, k):\n    result = []\n    backtrack(result, [], 1, n, k)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(result, current, start, n, k):\n    if len(current) == k:\n        result.append(current[:])\n        return\n    remaining = k - len(current)\n    for i in range(start, n - remaining + 2):\n        current.append(i)\n        backtrack(result, current, i + 1, n, k)\n        current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        7
      ],
      "backtrack_num": [
        9
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> combine(int n, int k) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(result, new ArrayList<>(), 1, n, k);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(List<List<Integer>> result, List<Integer> current, int start, int n, int k) {\n    if (current.size() == k) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n    int remaining = k - current.size();\n    for (int i = start; i <= n - remaining + 1; i++) {\n        current.add(i);\n        backtrack(result, current, i + 1, n, k);\n        current.remove(current.size() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        8
      ],
      "backtrack_num": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> combine(int n, int k) {\n    vector<vector<int>> result;\n    vector<int> current;\n    backtrack(result, current, 1, n, k);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(vector<vector<int>>& result, vector<int>& current, int start, int n, int k) {\n    if (current.size() == k) {\n        result.push_back(current);\n        return;\n    }\n    int remaining = k - current.size();\n    for (int i = start; i <= n - remaining + 1; i++) {\n        current.push_back(i);\n        backtrack(result, current, i + 1, n, k);\n        current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        8
      ],
      "backtrack_num": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> Combine(int n, int k) {\n    var result = new List<IList<int>>();\n    Backtrack(result, new List<int>(), 1, n, k);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(List<IList<int>> result, List<int> current, int start, int n, int k) {\n    if (current.Count == k) {\n        result.Add(new List<int>(current));\n        return;\n    }\n    int remaining = k - current.Count;\n    for (int i = start; i <= n - remaining + 1; i++) {\n        current.Add(i);\n        Backtrack(result, current, i + 1, n, k);\n        current.RemoveAt(current.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        8
      ],
      "backtrack_num": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func combine(n int, k int) [][]int {\n    result := [][]int{}\n    current := []int{}\n    backtrack(&result, current, 1, n, k)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(result *[][]int, current []int, start, n, k int) {\n    if len(current) == k {\n        combo := make([]int, len(current))\n        copy(combo, current)\n        *result = append(*result, combo)\n        return\n    }\n    remaining := k - len(current)\n    for i := start; i <= n-remaining+1; i++ {\n        current = append(current, i)\n        backtrack(result, current, i+1, n, k)\n        current = current[:len(current)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4,
        5,
        6
      ],
      "choose_num": [
        10
      ],
      "backtrack_num": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function combine(n, k) {\n    const result = [];\n    backtrack([], 1);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(current, start) {\n    if (current.length === k) {\n        result.push([...current]);\n        return;\n    }\n    const remaining = k - current.length;\n    for (let i = start; i <= n - remaining + 1; i++) {\n        current.push(i);\n        backtrack(current, i + 1);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        8
      ],
      "backtrack_num": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function combine(n: number, k: number): number[][] {\n    const result: number[][] = [];\n    backtrack([], 1);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(current: number[], start: number): void {\n    if (current.length === k) {\n        result.push([...current]);\n        return;\n    }\n    const remaining = k - current.length;\n    for (let i = start; i <= n - remaining + 1; i++) {\n        current.push(i);\n        backtrack(current, i + 1);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_combination": [
        3,
        4
      ],
      "choose_num": [
        8
      ],
      "backtrack_num": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  }
};

const CombinationsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: n=4, k=2",
    "value": {
      "n": 4,
      "k": 2
    }
  },
  {
    "id": "ex2",
    "label": "Larger: n=5, k=3",
    "value": {
      "n": 5,
      "k": 3
    }
  },
  {
    "id": "ex3",
    "label": "Small: n=3, k=1",
    "value": {
      "n": 3,
      "k": 1
    }
  },
  {
    "id": "ex4",
    "label": "Three of Four: n=4, k=3",
    "value": {
      "n": 4,
      "k": 3
    }
  }
];

function generateCombinationsSteps(e: any): any[] {
  
let t=e.n||0,r=e.k||0,a=new RecursiveStepRecorder({},{});a.pushCallFrame({n:t,k:r},"combine"),a.record("start","Start: Find all combinations of k numbers from 1 to n");let i=[];function c(e){let t=a.getCurrentVisuals();Object.keys(t).forEach(r=>{let n=t[r];if("naryTreeNode"===n.type){let t=r===e,i=n.state;t&&"active"!==i?a.update_visual(r,{...n,state:"active"}):t||"active"!==i||a.update_visual(r,{...n,state:void 0})}})}return a.update_global_variable("n",t),a.update_global_variable("k",r),a.update_global_variable("result",i),a.record("init",`Initialize: n = ${t}, k = ${r}`),a.record("before_backtrack","Start backtracking"),!function e(n,l,o){let s=o.lastIndexOf("-"),u=s>0?o.substring(0,s):null,d=s>0?parseInt(o.substring(s+1),10):void 0,m=`[${l.join(",")}]`;if(a.add_new_visual(o,{type:"naryTreeNode",value:m,parent:u||void 0,childIndex:d}),a.pushCallFrame({start:n,current:[...l]},"backtrack"),c(o),a.record("enter_backtrack",`Enter backtrack(start=${n}, current=[${l.join(", ")}])`),l.length===r){a.add_conditional("is_complete",!0),i.push([...l]),a.update_global_variable("result",i.map(e=>[...e])),a.update_visual(o,{type:"naryTreeNode",value:`[${l.join(",")}]`,parent:u||void 0,childIndex:d,state:"visited"}),a.record("add_combination",`Found combination: [${l.join(", ")}]`),a.popCallFrame();return}a.add_conditional("is_complete",!1);let k=r-l.length;for(let r=n;r<=t-k+1;r++){a.update_frame_variable("i",r),l.push(r),a.update_frame_variable("current",[...l]),a.record("choose_num",`Choose i=${r}, current=[${l.join(", ")}]`);let t=r-n;e(r+1,l,o+"-"+t),c(o),l.pop(),a.update_frame_variable("current",[...l]),a.record("backtrack_num",`Backtrack: remove i=${r}`)}a.update_visual(o,{type:"naryTreeNode",value:m,parent:u||void 0,childIndex:d,state:"active"}),a.record("exit_backtrack",`Exit backtrack(start=${n})`),a.popCallFrame()}(1,[],"0"),a.update_global_variable("result",i.map(e=>[...e])),a.record("complete",`Found ${i.length} combinations`),a.getSteps()
}

export function CombinationsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CombinationsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCombinationsSteps(e) as any[];
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
      title="Combinations"
      slug="combinations"
      approaches={approaches}
      presets={CombinationsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Generate Parentheses (generate-parentheses)
// ==========================================

const GenerateParenthesesTemplates = {
  "python": {
    "language": "python",
    "code": "def generateParenthesis(n):\n    result = []\n    backtrack(result, [], 0, 0, n)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(result, current, open, close, n):\n    if len(current) == 2 * n:\n        result.append(\"\".join(current))\n        return\n    if open < n:\n        current.append(\"(\")\n        backtrack(result, current, open + 1, close, n)\n        current.pop()\n    if close < open:\n        current.append(\")\")\n        backtrack(result, current, open, close + 1, n)\n        current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        6,
        7
      ],
      "backtrack_open": [
        8
      ],
      "add_close": [
        10,
        11
      ],
      "backtrack_close": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        5
      ],
      "can_close": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> generateParenthesis(int n) {\n    List<String> result = new ArrayList<>();\n    backtrack(result, new StringBuilder(), 0, 0, n);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(List<String> result, StringBuilder current, int open, int close, int n) {\n    if (current.length() == 2 * n) {\n        result.add(current.toString());\n        return;\n    }\n    if (open < n) {\n        current.append(\"(\");\n        backtrack(result, current, open + 1, close, n);\n        current.deleteCharAt(current.length() - 1);\n    }\n    if (close < open) {\n        current.append(\")\");\n        backtrack(result, current, open, close + 1, n);\n        current.deleteCharAt(current.length() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        9
      ],
      "add_close": [
        12,
        13
      ],
      "backtrack_close": [
        14
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> generateParenthesis(int n) {\n    vector<string> result;\n    string current;\n    backtrack(result, current, 0, 0, n);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(vector<string>& result, string& current, int open, int close, int n) {\n    if (current.size() == 2 * n) {\n        result.push_back(current);\n        return;\n    }\n    if (open < n) {\n        current.push_back('(');\n        backtrack(result, current, open + 1, close, n);\n        current.pop_back();\n    }\n    if (close < open) {\n        current.push_back(')');\n        backtrack(result, current, open, close + 1, n);\n        current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        9
      ],
      "add_close": [
        12,
        13
      ],
      "backtrack_close": [
        14
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> GenerateParenthesis(int n) {\n    var result = new List<string>();\n    Backtrack(result, new char[2 * n], 0, 0, 0, n);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(IList<string> result, char[] current, int pos, int open, int close, int n) {\n    if (pos == 2 * n) {\n        result.Add(new string(current));\n        return;\n    }\n    if (open < n) {\n        current[pos] = '(';\n        Backtrack(result, current, pos + 1, open + 1, close, n);\n    }\n    if (close < open) {\n        current[pos] = ')';\n        Backtrack(result, current, pos + 1, open, close + 1, n);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        8
      ],
      "add_close": [
        11,
        12
      ],
      "backtrack_close": [
        12
      ],
      "exit_backtrack": [
        14
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func generateParenthesis(n int) []string {\n    result := []string{}\n    backtrack(&result, []byte{}, 0, 0, n)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(result *[]string, current []byte, open int, close int, n int) {\n    if len(current) == 2*n {\n        *result = append(*result, string(current))\n        return\n    }\n    if open < n {\n        current = append(current, '(')\n        backtrack(result, current, open+1, close, n)\n        current = current[:len(current)-1]\n    }\n    if close < open {\n        current = append(current, ')')\n        backtrack(result, current, open, close+1, n)\n        current = current[:len(current)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        9
      ],
      "add_close": [
        12,
        13
      ],
      "backtrack_close": [
        14
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function generateParenthesis(n) {\n    const result = [];\n    backtrack(result, [], 0, 0, n);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(result, current, open, close, n) {\n    if (current.length === 2 * n) {\n        result.push(current.join(\"\"));\n        return;\n    }\n    if (open < n) {\n        current.push(\"(\");\n        backtrack(result, current, open + 1, close, n);\n        current.pop();\n    }\n    if (close < open) {\n        current.push(\")\");\n        backtrack(result, current, open, close + 1, n);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        9
      ],
      "add_close": [
        12,
        13
      ],
      "backtrack_close": [
        14
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function generateParenthesis(n: number): string[] {\n    const result: string[] = [];\n    backtrack(result, [], 0, 0, n);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(result: string[], current: string[], open: number, close: number, n: number): void {\n    if (current.length === 2 * n) {\n        result.push(current.join(\"\"));\n        return;\n    }\n    if (open < n) {\n        current.push(\"(\");\n        backtrack(result, current, open + 1, close, n);\n        current.pop();\n    }\n    if (close < open) {\n        current.push(\")\");\n        backtrack(result, current, open, close + 1, n);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "add_open": [
        7,
        8
      ],
      "backtrack_open": [
        9
      ],
      "add_close": [
        12,
        13
      ],
      "backtrack_close": [
        14
      ],
      "exit_backtrack": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "can_open": [
        6
      ],
      "can_close": [
        11
      ]
    }
  }
};

const GenerateParenthesesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Small",
    "value": {
      "n": 2
    }
  },
  {
    "id": "ex2",
    "label": "Standard",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex3",
    "label": "Minimal",
    "value": {
      "n": 1
    }
  }
];

function generateGenerateParenthesesSteps(e: any): any[] {
  
let t=e.n||0,n=new RecursiveStepRecorder({},{});n.pushCallFrame({n:t,result:void 0},"generateParenthesis"),n.record("start","Start: Generate all valid parentheses combinations");let a=[];function i(e){let t=n.getCurrentVisuals();Object.keys(t).forEach(r=>{let a=t[r];if("naryTreeNode"===a.type){let t=r===e,i=a.state;t&&"active"!==i?n.update_visual(r,{...a,state:"active"}):t||"active"!==i||n.update_visual(r,{...a,state:void 0})}})}return n.update_global_variable("n",t),n.update_global_variable("result",a),n.record("init",`Initialize result = [], n = ${t}`),n.record("before_backtrack","Start backtracking"),!function e(r,l,s,c){let o=c.lastIndexOf("-"),d=o>0?c.substring(0,o):null,u=o>0?parseInt(c.substring(o+1),10):void 0,h=r.length>0?`"${r.join("")}"`:'""';if(n.add_new_visual(c,{type:"naryTreeNode",value:h,parent:d||void 0,childIndex:u}),n.pushCallFrame({current:r.join(""),open:l,close:s},"backtrack"),i(c),n.record("enter_backtrack",`Enter backtrack(current="${r.join("")}", open=${l}, close=${s})`),r.length===2*t){n.add_conditional("is_complete",!0),a.push(r.join("")),n.update_global_variable("result",[...a]),n.update_visual(c,{type:"naryTreeNode",value:h,parent:d||void 0,childIndex:u,state:"visited"}),n.record("add_result",`Add "${r.join("")}" to result`),n.popCallFrame();return}if((n.add_conditional("is_complete",!1),l<t)?(n.add_conditional("can_open",!0),r.push("("),n.update_frame_variable("current",r.join("")),n.record("add_open",`Append "(", current="${r.join("")}"`),e(r,l+1,s,c+"-0"),i(c),r.pop(),n.update_frame_variable("current",r.join("")),n.record("backtrack_open",`Backtrack: remove "(", current="${r.join("")}"`)):n.add_conditional("can_open",!1),s<l){n.add_conditional("can_close",!0),r.push(")"),n.update_frame_variable("current",r.join(""));let a=+(l<t);n.record("add_close",`Append ")", current="${r.join("")}"`),e(r,l,s+1,c+"-"+a),i(c),r.pop(),n.update_frame_variable("current",r.join("")),n.record("backtrack_close",`Backtrack: remove ")", current="${r.join("")}"`)}else n.add_conditional("can_close",!1);n.update_visual(c,{type:"naryTreeNode",value:h,parent:d||void 0,childIndex:u,state:"active"}),n.record("exit_backtrack",`Exit backtrack(current="${r.join("")}")`),n.popCallFrame()}([],0,0,"0"),n.update_global_variable("result",[...a]),n.record("complete",`Generated ${a.length} valid combinations: ${JSON.stringify(a)}`),n.getSteps()
}

export function GenerateParenthesesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GenerateParenthesesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGenerateParenthesesSteps(e) as any[];
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
      title="Generate Parentheses"
      slug="generate-parentheses"
      approaches={approaches}
      presets={GenerateParenthesesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Letter Combinations of a Phone Number (letter-combinations-of-a-phone-number)
// ==========================================

const LetterCombinationsOfAPhoneNumberTemplates = {
  "python": {
    "language": "python",
    "code": "def letterCombinations(digits):\n    if not digits:\n        return []\n    mapping = [\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"]\n    result = []\n    backtrack(digits, 0, [], mapping, result)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        4,
        5
      ],
      "before_backtrack": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(digits, index, current, mapping, result):\n    if index == len(digits):\n        result.append(\"\".join(current))\n        return\n\n    letters = mapping[int(digits[index])]\n    for letter in letters:\n        current.append(letter)\n        backtrack(digits, index + 1, current, mapping, result)\n        current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> letterCombinations(String digits) {\n    List<String> result = new ArrayList<>();\n    if (digits.isEmpty()) return result;\n    String[] mapping = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n    backtrack(digits, 0, new StringBuilder(), mapping, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(String digits, int index, StringBuilder current, String[] mapping, List<String> result) {\n    if (index == digits.length()) {\n        result.add(current.toString());\n        return;\n    }\n    String letters = mapping[digits.charAt(index) - '0'];\n    for (char letter : letters.toCharArray()) {\n        current.append(letter);\n        backtrack(digits, index + 1, current, mapping, result);\n        current.deleteCharAt(current.length() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> letterCombinations(string digits) {\n    vector<string> result;\n    if (digits.empty()) return result;\n    string mapping[] = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n    backtrack(digits, 0, \"\", mapping, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(string& digits, int index, string current, string mapping[], vector<string>& result) {\n    if (index == digits.size()) {\n        result.push_back(current);\n        return;\n    }\n    string letters = mapping[digits[index] - '0'];\n    for (char letter : letters) {\n        current.push_back(letter);\n        backtrack(digits, index + 1, current, mapping, result);\n        current.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> LetterCombinations(string digits) {\n    var result = new List<string>();\n    if (digits.Length == 0) return result;\n    string[] mapping = {\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"};\n    Backtrack(digits, 0, new List<char>(), mapping, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(string digits, int index, List<char> current, string[] mapping, List<string> result) {\n    if (index == digits.Length) {\n        result.Add(new string(current.ToArray()));\n        return;\n    }\n    string letters = mapping[digits[index] - '0'];\n    foreach (char letter in letters) {\n        current.Add(letter);\n        Backtrack(digits, index + 1, current, mapping, result);\n        current.RemoveAt(current.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func letterCombinations(digits string) []string {\n    result := []string{}\n    if len(digits) == 0 {\n        return result\n    }\n    mapping := []string{\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"}\n    backtrack(digits, 0, []byte{}, mapping, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        6
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(digits string, index int, current []byte, mapping []string, result *[]string) {\n    if index == len(digits) {\n        *result = append(*result, string(current))\n        return\n    }\n    letters := mapping[digits[index]-'0']\n    for _, letter := range letters {\n        current = append(current, byte(letter))\n        backtrack(digits, index+1, current, mapping, result)\n        current = current[:len(current)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function letterCombinations(digits) {\n    if (!digits) return [];\n    const mapping = [\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"];\n    const result = [];\n    backtrack(digits, 0, [], mapping, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        3,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(digits, index, current, mapping, result) {\n    if (index === digits.length) {\n        result.push(current.join(\"\"));\n        return;\n    }\n    const letters = mapping[parseInt(digits[index])];\n    for (const letter of letters) {\n        current.push(letter);\n        backtrack(digits, index + 1, current, mapping, result);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function letterCombinations(digits: string): string[] {\n    if (!digits) return [];\n    const mapping: string[] = [\"\", \"\", \"abc\", \"def\", \"ghi\", \"jkl\", \"mno\", \"pqrs\", \"tuv\", \"wxyz\"];\n    const result: string[] = [];\n    backtrack(digits, 0, [], mapping, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        3,
        4
      ],
      "before_backtrack": [
        5
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(digits: string, index: number, current: string[], mapping: string[], result: string[]): void {\n    if (index === digits.length) {\n        result.push(current.join(\"\"));\n        return;\n    }\n    const letters: string = mapping[parseInt(digits[index])];\n    for (const letter of letters) {\n        current.push(letter);\n        backtrack(digits, index + 1, current, mapping, result);\n        current.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "choose_letter": [
        7,
        8
      ],
      "backtrack_letter": [
        10
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ]
    }
  }
};

const LetterCombinationsOfAPhoneNumberPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: \"23\"",
    "value": {
      "digits": "23"
    }
  },
  {
    "id": "ex2",
    "label": "Single Digit: \"2\"",
    "value": {
      "digits": "2"
    }
  },
  {
    "id": "ex3",
    "label": "With 4-letter keys: \"79\"",
    "value": {
      "digits": "79"
    }
  },
  {
    "id": "ex4",
    "label": "Three Digits: \"234\"",
    "value": {
      "digits": "234"
    }
  }
];

function generateLetterCombinationsOfAPhoneNumberSteps(e: any): any[] {
  let n={2:"abc",3:"def",4:"ghi",5:"jkl",6:"mno",7:"pqrs",8:"tuv",9:"wxyz"};
let t=e.digits||"",i=new RecursiveStepRecorder({},{});i.pushCallFrame({digits:t,mapping:n},"letterCombinations"),i.record("start","Start: Find all letter combinations for digits");let a=[];function s(e){let t=i.getCurrentVisuals();Object.keys(t).forEach(r=>{let n=t[r];if("naryTreeNode"===n.type){let t=r===e,a=n.state;t&&"active"!==a?i.update_visual(r,{...n,state:"active"}):t||"active"!==a||i.update_visual(r,{...n,state:void 0})}})}return i.update_global_variable("digits",t),i.update_global_variable("mapping",n),i.update_global_variable("result",a),i.record("init",`Initialize: digits = "${t}", mapping defined`),i.record("before_backtrack","Start backtracking"),!function e(r,l,o){let c=o.lastIndexOf("-"),d=c>0?o.substring(0,c):null,g=c>0?parseInt(o.substring(c+1),10):void 0,u=l.length>0?`"${l.join("")}"`:'""';if(i.add_new_visual(o,{type:"naryTreeNode",value:u,parent:d||void 0,childIndex:g}),i.pushCallFrame({index:r,current:l.join("")},"backtrack"),s(o),i.record("enter_backtrack",`Enter backtrack(index=${r}, current="${l.join("")}")`),r===t.length){i.add_conditional("is_complete",!0);let e=l.join("");a.push(e),i.update_global_variable("result",[...a]),i.update_visual(o,{type:"naryTreeNode",value:u,parent:d||void 0,childIndex:g,state:"visited"}),i.record("add_result",`Complete combination: "${e}", add to result`),i.popCallFrame();return}i.add_conditional("is_complete",!1);let p=n[t[r]];for(let n=0;n<p.length;n++){let a=p[n];i.update_frame_variable("letter",a),l.push(a),i.update_frame_variable("current",l.join("")),i.record("choose_letter",`Choose letter '${a}' for digit '${t[r]}'`),e(r+1,l,o+"-"+n),s(o),l.pop(),i.update_frame_variable("current",l.join("")),i.update_frame_variable("letter",a),i.record("backtrack_letter",`Backtrack: remove '${a}'`)}i.update_visual(o,{type:"naryTreeNode",value:u,parent:d||void 0,childIndex:g,state:"active"}),i.record("exit_backtrack",`Exit backtrack(index=${r})`),i.popCallFrame()}(0,[],"0"),i.update_global_variable("result",[...a]),i.record("complete",`Found ${a.length} letter combinations`),i.getSteps()
}

export function LetterCombinationsOfAPhoneNumberProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LetterCombinationsOfAPhoneNumberTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLetterCombinationsOfAPhoneNumberSteps(e) as any[];
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
      title="Letter Combinations of a Phone Number"
      slug="letter-combinations-of-a-phone-number"
      approaches={approaches}
      presets={LetterCombinationsOfAPhoneNumberPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// N-Queens (n-queens)
// ==========================================

const NQueensTemplates = {
  "python": {
    "language": "python",
    "code": "def solveNQueens(n):\n    result = []\n    queens = [-1] * n\n    cols, diags, anti_diags = set(), set(), set()\n    backtrack(0)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(row):\n    if row == n:\n        result.append(build_board())\n        return\n    for col in range(n):\n        if col in cols or (row-col) in diags or (row+col) in anti_diags:\n            continue\n        queens[row] = col\n        cols.add(col)\n        diags.add(row - col)\n        anti_diags.add(row + col)\n        backtrack(row + 1)\n        queens[row] = -1\n        cols.remove(col)\n        diags.remove(row - col)\n        anti_diags.remove(row + col)",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        5
      ],
      "check_safe": [
        6
      ],
      "is_safe": [
        6
      ],
      "not_safe": [
        7
      ],
      "place_queen": [
        8,
        9,
        10,
        11
      ],
      "recurse": [
        12
      ],
      "remove_queen": [
        13,
        14,
        15,
        16
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "List<List<String>> solveNQueens(int n) {\n    List<List<String>> result = new ArrayList<>();\n    int[] queens = new int[n];\n    Arrays.fill(queens, -1);\n    Set<Integer> cols = new HashSet<>();\n    Set<Integer> diags = new HashSet<>();\n    Set<Integer> antiDiags = new HashSet<>();\n    backtrack(0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int row) {\n    if (row == n) {\n        result.add(buildBoard());\n        return;\n    }\n    for (int col = 0; col < n; col++) {\n        if (cols.contains(col) || diags.contains(row-col) || antiDiags.contains(row+col)) {\n            continue;\n        }\n        queens[row] = col;\n        cols.add(col);\n        diags.add(row - col);\n        antiDiags.add(row + col);\n        backtrack(row + 1);\n        queens[row] = -1;\n        cols.remove(col);\n        diags.remove(row - col);\n        antiDiags.remove(row + col);\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> result;\n    vector<int> queens(n, -1);\n    unordered_set<int> cols, diags, antiDiags;\n    backtrack(0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        6
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int row) {\n    if (row == n) {\n        result.push_back(buildBoard());\n        return;\n    }\n    for (int col = 0; col < n; col++) {\n        if (cols.count(col) || diags.count(row-col) || antiDiags.count(row+col)) {\n            continue;\n        }\n        queens[row] = col;\n        cols.insert(col);\n        diags.insert(row - col);\n        antiDiags.insert(row + col);\n        backtrack(row + 1);\n        queens[row] = -1;\n        cols.erase(col);\n        diags.erase(row - col);\n        antiDiags.erase(row + col);\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "IList<IList<string>> SolveNQueens(int n) {\n    var result = new List<IList<string>>();\n    var queens = new int[n];\n    Array.Fill(queens, -1);\n    var cols = new HashSet<int>();\n    var diags = new HashSet<int>();\n    var antiDiags = new HashSet<int>();\n    Backtrack(0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void Backtrack(int row) {\n    if (row == n) {\n        result.Add(BuildBoard());\n        return;\n    }\n    for (int col = 0; col < n; col++) {\n        if (cols.Contains(col) || diags.Contains(row-col) || antiDiags.Contains(row+col)) {\n            continue;\n        }\n        queens[row] = col;\n        cols.Add(col);\n        diags.Add(row - col);\n        antiDiags.Add(row + col);\n        Backtrack(row + 1);\n        queens[row] = -1;\n        cols.Remove(col);\n        diags.Remove(row - col);\n        antiDiags.Remove(row + col);\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func solveNQueens(n int) [][]string {\n    result := [][]string{}\n    queens := make([]int, n)\n    for i := range queens { queens[i] = -1 }\n    cols := map[int]bool{}\n    diags := map[int]bool{}\n    antiDiags := map[int]bool{}\n    backtrack(0)\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(row int) {\n    if row == n {\n        result = append(result, buildBoard())\n        return\n    }\n    for col := 0; col < n; col++ {\n        if cols[col] || diags[row-col] || antiDiags[row+col] {\n            continue\n        }\n        queens[row] = col\n        cols[col] = true\n        diags[row-col] = true\n        antiDiags[row+col] = true\n        backtrack(row + 1)\n        queens[row] = -1\n        delete(cols, col)\n        delete(diags, row-col)\n        delete(antiDiags, row+col)\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function solveNQueens(n) {\n    const result = [];\n    const queens = new Array(n).fill(-1);\n    const cols = new Set();\n    const diags = new Set();\n    const antiDiags = new Set();\n    backtrack(0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(row) {\n    if (row === n) {\n        result.push(buildBoard());\n        return;\n    }\n    for (let col = 0; col < n; col++) {\n        if (cols.has(col) || diags.has(row-col) || antiDiags.has(row+col)) {\n            continue;\n        }\n        queens[row] = col;\n        cols.add(col);\n        diags.add(row - col);\n        antiDiags.add(row + col);\n        backtrack(row + 1);\n        queens[row] = -1;\n        cols.delete(col);\n        diags.delete(row - col);\n        antiDiags.delete(row + col);\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function solveNQueens(n: number): string[][] {\n    const result: string[][] = [];\n    const queens: number[] = new Array(n).fill(-1);\n    const cols = new Set<number>();\n    const diags = new Set<number>();\n    const antiDiags = new Set<number>();\n    backtrack(0);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(row: number): void {\n    if (row === n) {\n        result.push(buildBoard());\n        return;\n    }\n    for (let col = 0; col < n; col++) {\n        if (cols.has(col) || diags.has(row-col) || antiDiags.has(row+col)) {\n            continue;\n        }\n        queens[row] = col;\n        cols.add(col);\n        diags.add(row - col);\n        antiDiags.add(row + col);\n        backtrack(row + 1);\n        queens[row] = -1;\n        cols.delete(col);\n        diags.delete(row - col);\n        antiDiags.delete(row + col);\n    }\n}",
    "recursiveLineMap": {
      "-": [
        1
      ],
      "check_row": [
        2
      ],
      "found_solution": [
        3,
        4
      ],
      "try_col": [
        6
      ],
      "check_safe": [
        7
      ],
      "is_safe": [
        7
      ],
      "not_safe": [
        8
      ],
      "place_queen": [
        10,
        11,
        12,
        13
      ],
      "recurse": [
        14
      ],
      "remove_queen": [
        15,
        16,
        17,
        18
      ],
      "backtrack": [
        1
      ],
      "complete": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_base_case": [
        2
      ],
      "is_safe_check": [
        7
      ]
    }
  }
};

const NQueensPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (4×4)",
    "value": {
      "n": 4
    }
  }
];

function generateNQueensSteps(e: any): any[] {
  
let t=e.n||4,n=new RecursiveStepRecorder({},{});for(let e=0;e<t;e++)for(let r=0;r<t;r++)n.add_new_visual(`cell_${e}_${r}`,{type:"matrixElement",value:".",row:e,col:r,state:"empty"});n.add_new_global_variable("n",t),n.add_new_global_variable("result",[]),n.record("-",`Start: Solve ${t}-Queens using backtracking`);let l=[],a=Array(t).fill(-1),i=new Set,o=new Set,s=new Set;if(!function e(r){if(n.pushCallFrame({row:r},"backtrack"),n.update_frame_variable("row",r),n.add_conditional("is_base_case",r===t),n.record("check_row",`Check row=${r}, n=${t}`),r===t){let e=a.slice();l.push(e),n.update_global_variable("result",l.map(e=>[...e]));for(let e=0;e<t;e++)for(let r=0;r<t;r++)n.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:a[e]===r?"Q":".",row:e,col:r,state:a[e]===r?"found":"empty"});n.record("found_solution",`Found solution #${l.length}!`),n.popCallFrame();return}for(let l=0;l<t;l++){n.update_frame_variable("col",l),n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:".",row:r,col:l,state:"trying"}),n.record("try_col",`Try queen at (${r}, ${l})`);let t=!i.has(l)&&!o.has(r-l)&&!s.has(r+l);if(n.add_conditional("is_safe_check",t),!t){n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:".",row:r,col:l,state:"conflict"}),n.record("not_safe",`(${r}, ${l}) conflicts, skip`),n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:".",row:r,col:l,state:"empty"});continue}n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:".",row:r,col:l,state:"safe"}),n.record("check_safe",`(${r}, ${l}) is safe`),a[r]=l,i.add(l),o.add(r-l),s.add(r+l),n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:"Q",row:r,col:l,state:"queen"}),n.record("place_queen",`Place queen at (${r}, ${l})`),n.record("recurse",`Recurse to row ${r+1}`),e(r+1),a[r]=-1,i.delete(l),o.delete(r-l),s.delete(r+l),n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:".",row:r,col:l,state:"empty"}),n.record("remove_queen",`Remove queen from (${r}, ${l})`)}n.record("backtrack",`Backtrack from row ${r}`),n.popCallFrame()}(0),n.update_global_variable("result",l.map(e=>[...e])),l.length>0){let e=l[0];for(let r=0;r<t;r++)for(let l=0;l<t;l++)n.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:e[r]===l?"Q":".",row:r,col:l,state:e[r]===l?"found":"empty"})}return n.record("complete",`Done! Found ${l.length} solution(s) for ${t}-Queens`),n.getSteps()
}

export function NQueensProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NQueensTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNQueensSteps(e) as any[];
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
      title="N-Queens"
      slug="n-queens"
      approaches={approaches}
      presets={NQueensPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Palindrome Partitioning (palindrome-partitioning)
// ==========================================

const PalindromePartitioningTemplates = {
  "python": {
    "language": "python",
    "code": "def partition(s):\n    result = []\n    backtrack(0, [])\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(start, current):\n    # Base case\n    if start == len(s):\n        result.append(current[:])\n        return\n\n    for end in range(start, len(s)):\n        substring = s[start:end + 1]\n        if is_palindrome(s, start, end):\n            current.append(substring)\n            backtrack(end + 1, current)\n            current.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        7,
        8
      ],
      "is_palindrome": [
        9
      ],
      "not_palindrome": [
        9
      ],
      "add_substring": [
        10
      ],
      "backtrack_choice": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        7
      ],
      "is_palindrome": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<String>> partition(String s) {\n    List<List<String>> result = new ArrayList<>();\n    backtrack(s, 0, new ArrayList<>(), result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(String s, int start, List<String> current, List<List<String>> result) {\n    // Base case\n    if (start == s.length()) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n\n    for (int end = start; end < s.length(); end++) {\n        if (isPalindrome(s, start, end)) {\n            current.add(s.substring(start, end + 1));\n            backtrack(s, end + 1, current, result);\n            current.remove(current.size() - 1);\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        8
      ],
      "is_palindrome": [
        9
      ],
      "not_palindrome": [
        9
      ],
      "add_substring": [
        10
      ],
      "backtrack_choice": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        8
      ],
      "is_palindrome": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<string>> partition(string s) {\n    vector<vector<string>> result;\n    vector<string> current;\n    backtrack(s, 0, current, result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(string& s, int start, vector<string>& current, vector<vector<string>>& result) {\n    // Base case\n    if (start == s.size()) {\n        result.push_back(current);\n        return;\n    }\n\n    for (int end = start; end < s.size(); end++) {\n        if (isPalindrome(s, start, end)) {\n            current.push_back(s.substr(start, end - start + 1));\n            backtrack(s, end + 1, current, result);\n            current.pop_back();\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        8
      ],
      "is_palindrome": [
        9
      ],
      "not_palindrome": [
        9
      ],
      "add_substring": [
        10
      ],
      "backtrack_choice": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        8
      ],
      "is_palindrome": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<string>> Partition(string s) {\n    var result = new List<IList<string>>();\n    Backtrack(s, 0, new List<string>(), result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(string s, int start, List<string> current, IList<IList<string>> result) {\n    // Base case\n    if (start == s.Length) {\n        result.Add(new List<string>(current));\n        return;\n    }\n\n    for (int end = start; end < s.Length; end++) {\n        if (IsPalindrome(s, start, end)) {\n            current.Add(s.Substring(start, end - start + 1));\n            Backtrack(s, end + 1, current, result);\n            current.RemoveAt(current.Count - 1);\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        8
      ],
      "is_palindrome": [
        9
      ],
      "not_palindrome": [
        9
      ],
      "add_substring": [
        10
      ],
      "backtrack_choice": [
        12
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        8
      ],
      "is_palindrome": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func partition(s string) [][]string {\n    result := [][]string{}\n    current := []string{}\n    backtrack(s, 0, current, &result)\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(s string, start int, current []string, result *[][]string) {\n    // Base case\n    if start == len(s) {\n        partition := make([]string, len(current))\n        copy(partition, current)\n        *result = append(*result, partition)\n        return\n    }\n\n    for end := start; end < len(s); end++ {\n        if isPalindrome(s, start, end) {\n            current = append(current, s[start:end+1])\n            backtrack(s, end+1, current, result)\n            current = current[:len(current)-1]\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5,
        6,
        7
      ],
      "try_end": [
        10
      ],
      "is_palindrome": [
        11
      ],
      "not_palindrome": [
        11
      ],
      "add_substring": [
        12
      ],
      "backtrack_choice": [
        14
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        10
      ],
      "is_palindrome": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function partition(s) {\n    const result = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start, current) {\n    // Base case\n    if (start === s.length) {\n        result.push([...current]);\n        return;\n    }\n\n    for (let end = start; end < s.length; end++) {\n        const substring = s.slice(start, end + 1);\n        if (isPalindrome(s, start, end)) {\n            current.push(substring);\n            backtrack(end + 1, current);\n            current.pop();\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        8,
        9
      ],
      "is_palindrome": [
        10
      ],
      "not_palindrome": [
        10
      ],
      "add_substring": [
        11
      ],
      "backtrack_choice": [
        13
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        8
      ],
      "is_palindrome": [
        10
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function partition(s: string): string[][] {\n    const result: string[][] = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start: number, current: string[]): void {\n    // Base case\n    if (start === s.length) {\n        result.push([...current]);\n        return;\n    }\n\n    for (let end = start; end < s.length; end++) {\n        const substring = s.slice(start, end + 1);\n        if (isPalindrome(s, start, end)) {\n            current.push(substring);\n            backtrack(end + 1, current);\n            current.pop();\n        }\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_partition": [
        4,
        5
      ],
      "try_end": [
        8,
        9
      ],
      "is_palindrome": [
        10
      ],
      "not_palindrome": [
        10
      ],
      "add_substring": [
        11
      ],
      "backtrack_choice": [
        13
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        3
      ],
      "for_end": [
        8
      ],
      "is_palindrome": [
        10
      ]
    }
  }
};

const PalindromePartitioningPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "aab"
    }
  },
  {
    "id": "ex2",
    "label": "Palindrome Center",
    "value": {
      "s": "aba"
    }
  },
  {
    "id": "ex3",
    "label": "Repeated",
    "value": {
      "s": "aabb"
    }
  },
  {
    "id": "ex4",
    "label": "No Palindromes > 1",
    "value": {
      "s": "abc"
    }
  }
];

function generatePalindromePartitioningSteps(t: any): any[] {
  
let e=t.s||"",r=new RecursiveStepRecorder({},{});for(let t=0;t<e.length;t++)r.add_new_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,label:`${t}`});r.pushCallFrame({s:e},"partition"),r.record("-","Start: Partition string into palindrome substrings");let i=[];function a(t){let e=r.getCurrentVisuals();Object.keys(e).forEach(n=>{let i=e[n];if("naryTreeNode"===i.type){let e=n===t,a=i.state;e&&"active"!==a?r.update_visual(n,{...i,state:"active"}):e||"active"!==a||r.update_visual(n,{...i,state:void 0})}})}function s(){for(let t=0;t<e.length;t++)r.update_visual(`char_${t}`,{type:"arrayElement",value:e[t],position:t,label:`${t}`})}function l(t,n,i){for(let a=t;a<=n;a++)r.update_visual(`char_${a}`,{type:"arrayElement",value:e[a],position:a,label:`${a}`,state:i})}return r.update_global_variable("result",i),r.update_global_variable("s",e),r.record("init",`Initialize result = [], s = "${e}"`),r.record("before_backtrack","Start backtracking"),!function t(n,o,c){let d=c.lastIndexOf("-"),u=d>0?c.substring(0,d):null,p=d>0?parseInt(c.substring(d+1),10):void 0,f=o.length>0?`[${o.map(t=>`"${t}"`).join(",")}]`:"[]";if(r.add_new_visual(c,{type:"naryTreeNode",value:f,parent:u||void 0,childIndex:p}),r.pushCallFrame({start:n,current:[...o]},"backtrack"),a(c),r.record("enter_backtrack",`Enter backtrack(start=${n}, current=[${o.map(t=>`"${t}"`).join(", ")}])`),n===e.length){r.add_conditional("is_complete",!0),i.push([...o]),r.update_global_variable("result",i.map(t=>[...t])),r.update_visual(c,{type:"naryTreeNode",value:f,parent:u||void 0,childIndex:p,state:"visited"}),r.record("found_partition",`Found partition: [${o.map(t=>`"${t}"`).join(", ")}]`),r.popCallFrame();return}r.add_conditional("is_complete",!1);let h=0;for(let i=n;i<e.length;i++){r.add_conditional("for_end",!0),r.update_frame_variable("end",i);let d=e.substring(n,i+1);s(),l(n,i,"highlight"),r.record("try_end",`Try substring s[${n}..${i}] = "${d}"`),function(t,r){for(;t<r;){if(e[t]!==e[r])return!1;t++,r--}return!0}(n,i)?(r.add_conditional("is_palindrome",!0),l(n,i,"active"),r.record("is_palindrome",`"${d}" is a palindrome`),o.push(d),r.update_frame_variable("current",[...o]),r.record("add_substring",`Add "${d}" to current partition`),t(i+1,o,c+"-"+h),a(c),o.pop(),r.update_frame_variable("current",[...o]),s(),r.record("backtrack_choice",`Backtrack: remove "${d}"`),h++):(r.add_conditional("is_palindrome",!1),l(n,i,"muted"),r.record("not_palindrome",`"${d}" is not a palindrome, skip`))}r.add_conditional("for_end",!1),r.update_visual(c,{type:"naryTreeNode",value:f,parent:u||void 0,childIndex:p,state:"active"}),r.record("exit_backtrack",`Exit backtrack(start=${n})`),r.popCallFrame()}(0,[],"0"),s(),r.update_global_variable("result",i.map(t=>[...t])),r.record("complete",`Found ${i.length} palindrome partitions`),r.getSteps()
}

export function PalindromePartitioningProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PalindromePartitioningTemplates,
      generateSteps: (t: any) => {
        const recorded = generatePalindromePartitioningSteps(t) as any[];
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
      title="Palindrome Partitioning"
      slug="palindrome-partitioning"
      approaches={approaches}
      presets={PalindromePartitioningPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Permutations II (permutations-ii)
// ==========================================

const PermutationsIiTemplates = {
  "python": {
    "language": "python",
    "code": "def permuteUnique(nums):\n    result = []\n    freq = {}\n    for num in nums:\n        freq[num] = freq.get(num, 0) + 1\n    backtrack(len(nums), [], freq, result)\n    return result",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        6
      ],
      "complete": [
        7
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(n, current, freq, result):\n    if len(current) == n:\n        result.append(current[:])\n        return\n    for key in sorted(freq.keys()):\n        if freq[key] == 0:\n            continue\n        freq[key] -= 1\n        current.append(key)\n        backtrack(n, current, freq, result)\n        current.pop()\n        freq[key] += 1",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        6,
        7
      ],
      "choose_key": [
        8,
        9
      ],
      "backtrack_key": [
        11,
        12
      ],
      "exit_backtrack": [
        5
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> permuteUnique(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    Map<Integer, Integer> freq = new HashMap<>();\n    for (int num : nums) {\n        freq.put(num, freq.getOrDefault(num, 0) + 1);\n    }\n    backtrack(nums.length, new ArrayList<>(), freq, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(int n, List<Integer> current, Map<Integer, Integer> freq, List<List<Integer>> result) {\n    if (current.size() == n) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n    for (int key : new TreeSet<>(freq.keySet())) {\n        if (freq.get(key) == 0) {\n            continue;\n        }\n        freq.put(key, freq.get(key) - 1);\n        current.add(key);\n        backtrack(n, current, freq, result);\n        current.remove(current.size() - 1);\n        freq.put(key, freq.get(key) + 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        7,
        8
      ],
      "choose_key": [
        10,
        11
      ],
      "backtrack_key": [
        13,
        14
      ],
      "exit_backtrack": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        7
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> permuteUnique(vector<int>& nums) {\n    vector<vector<int>> result;\n    map<int, int> freq;\n    for (int num : nums) {\n        freq[num]++;\n    }\n    backtrack(nums.size(), {}, freq, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(int n, vector<int> current, map<int, int>& freq, vector<vector<int>>& result) {\n    if (current.size() == n) {\n        result.push_back(current);\n        return;\n    }\n    for (auto& [key, count] : freq) {\n        if (count == 0) {\n            continue;\n        }\n        count--;\n        current.push_back(key);\n        backtrack(n, current, freq, result);\n        current.pop_back();\n        count++;\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        7,
        8
      ],
      "choose_key": [
        10,
        11
      ],
      "backtrack_key": [
        13,
        14
      ],
      "exit_backtrack": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> PermuteUnique(int[] nums) {\n    var result = new List<IList<int>>();\n    var freq = new SortedDictionary<int, int>();\n    foreach (int num in nums) {\n        freq[num] = freq.GetValueOrDefault(num, 0) + 1;\n    }\n    Backtrack(nums.Length, new List<int>(), freq, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(int n, List<int> current, SortedDictionary<int, int> freq, List<IList<int>> result) {\n    if (current.Count == n) {\n        result.Add(new List<int>(current));\n        return;\n    }\n    foreach (int key in new List<int>(freq.Keys)) {\n        if (freq[key] == 0) {\n            continue;\n        }\n        freq[key]--;\n        current.Add(key);\n        Backtrack(n, current, freq, result);\n        current.RemoveAt(current.Count - 1);\n        freq[key]++;\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        7,
        8
      ],
      "choose_key": [
        10,
        11
      ],
      "backtrack_key": [
        13,
        14
      ],
      "exit_backtrack": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        7
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func permuteUnique(nums []int) [][]int {\n    result := [][]int{}\n    freq := map[int]int{}\n    for _, num := range nums {\n        freq[num]++\n    }\n    backtrack(len(nums), []int{}, freq, &result)\n    return result\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(n int, current []int, freq map[int]int, result *[][]int) {\n    if len(current) == n {\n        perm := make([]int, len(current))\n        copy(perm, current)\n        *result = append(*result, perm)\n        return\n    }\n    keys := sortedKeys(freq)\n    for _, key := range keys {\n        if freq[key] == 0 {\n            continue\n        }\n        freq[key]--\n        current = append(current, key)\n        backtrack(n, current, freq, result)\n        current = current[:len(current)-1]\n        freq[key]++\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4,
        5,
        6
      ],
      "skip_zero": [
        10,
        11
      ],
      "choose_key": [
        13,
        14
      ],
      "backtrack_key": [
        16,
        17
      ],
      "exit_backtrack": [
        9
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        10
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function permuteUnique(nums) {\n    const result = [];\n    const freq = {};\n    for (const num of nums) {\n        freq[num] = (freq[num] || 0) + 1;\n    }\n    backtrack(nums.length, [], freq, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(n, current, freq, result) {\n    if (current.length === n) {\n        result.push([...current]);\n        return;\n    }\n    for (const key of Object.keys(freq).map(Number).sort((a, b) => a - b)) {\n        if (freq[key] === 0) {\n            continue;\n        }\n        freq[key]--;\n        current.push(key);\n        backtrack(n, current, freq, result);\n        current.pop();\n        freq[key]++;\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        7,
        8
      ],
      "choose_key": [
        10,
        11
      ],
      "backtrack_key": [
        13,
        14
      ],
      "exit_backtrack": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function permuteUnique(nums: number[]): number[][] {\n    const result: number[][] = [];\n    const freq: Record<number, number> = {};\n    for (const num of nums) {\n        freq[num] = (freq[num] || 0) + 1;\n    }\n    backtrack(nums.length, [], freq, result);\n    return result;\n}",
    "lineMap": {
      "start": [
        1
      ],
      "init": [
        2,
        3,
        4,
        5
      ],
      "before_backtrack": [
        7
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(n: number, current: number[], freq: Record<number, number>, result: number[][]): void {\n    if (current.length === n) {\n        result.push([...current]);\n        return;\n    }\n    for (const key of Object.keys(freq).map(Number).sort((a, b) => a - b)) {\n        if (freq[key] === 0) {\n            continue;\n        }\n        freq[key]--;\n        current.push(key);\n        backtrack(n, current, freq, result);\n        current.pop();\n        freq[key]++;\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "add_result": [
        3,
        4
      ],
      "skip_zero": [
        7,
        8
      ],
      "choose_key": [
        10,
        11
      ],
      "backtrack_key": [
        13,
        14
      ],
      "exit_backtrack": [
        6
      ]
    },
    "recursiveConditionalMap": {
      "is_complete": [
        2
      ],
      "count_zero": [
        7
      ]
    }
  }
};

const PermutationsIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "nums": [
        1,
        1,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Distinct",
    "value": {
      "nums": [
        1,
        2,
        3
      ]
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "nums": [
        1,
        1,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Two Duplicates",
    "value": {
      "nums": [
        2,
        1,
        1
      ]
    }
  }
];

function generatePermutationsIiSteps(e: any): any[] {
  
let t=e.nums||[],n=t.length,i=new RecursiveStepRecorder({},{}),a={};t.forEach((e,t)=>{a[`elem_${t}`]={type:"arrayElement",value:e,position:t}}),Object.keys(a).forEach(e=>{i.add_new_visual(e,a[e])}),i.pushCallFrame({nums:t},"permuteUnique"),i.record("start","Start: Find all unique permutations");let s=[],l={};for(let e of t)l[e]=(l[e]||0)+1;function u(e){let t=i.getCurrentVisuals();Object.keys(t).forEach(n=>{let r=t[n];if("naryTreeNode"===r.type){let t=n===e,a=r.state;t&&"active"!==a?i.update_visual(n,{...r,state:"active"}):t||"active"!==a||i.update_visual(n,{...r,state:void 0})}})}i.update_global_variable("nums",t),i.update_global_variable("result",s),i.update_global_variable("freq",{...l}),i.record("init",`Initialize: nums = [${t.join(", ")}], freq = {${Object.entries(l).map(([e,t])=>`${e}:${t}`).join(", ")}}`);let o=Object.keys(l).map(Number).sort((e,t)=>e-t);return i.record("before_backtrack","Start backtracking"),!function e(t,r){let a=r.lastIndexOf("-"),c=a>0?r.substring(0,a):null,d=a>0?parseInt(r.substring(a+1),10):void 0,p=0===t.length?"[]":`[${t.join(",")}]`;if(i.add_new_visual(r,{type:"naryTreeNode",value:p,parent:c||void 0,childIndex:d}),i.pushCallFrame({current:[...t]},"backtrack"),u(r),i.record("enter_backtrack",`Enter backtrack(current=[${t.join(", ")}])`),t.length===n){i.add_conditional("is_complete",!0),s.push([...t]),i.update_global_variable("result",s.map(e=>[...e])),i.update_visual(r,{type:"naryTreeNode",value:`[${t.join(",")}]`,parent:c||void 0,childIndex:d,state:"visited"}),i.record("add_result",`Found valid permutation: [${t.join(", ")}]`),i.popCallFrame();return}i.add_conditional("is_complete",!1);let m=0;for(let n of o){if(0===l[n]){i.add_conditional("count_zero",!0),i.update_frame_variable("key",n),i.record("skip_zero",`Skip key=${n}: count is 0`);continue}i.add_conditional("count_zero",!1),l[n]-=1,t.push(n),i.update_frame_variable("key",n),i.update_frame_variable("current",[...t]),i.update_global_variable("freq",{...l}),i.record("choose_key",`Choose key=${n}, freq[${n}]=${l[n]}, current=[${t.join(", ")}]`),e(t,r+"-"+m),u(r),t.pop(),l[n]+=1,i.update_frame_variable("current",[...t]),i.update_global_variable("freq",{...l}),i.record("backtrack_key",`Backtrack: remove key=${n}, freq[${n}]=${l[n]}`),m++}i.update_visual(r,{type:"naryTreeNode",value:p,parent:c||void 0,childIndex:d,state:"active"}),i.record("exit_backtrack",`Exit backtrack(current=[${t.join(", ")}])`),i.popCallFrame()}([],"0"),i.update_global_variable("result",s.map(e=>[...e])),i.record("complete",`Found ${s.length} unique permutations`),i.getSteps()
}

export function PermutationsIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PermutationsIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generatePermutationsIiSteps(e) as any[];
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
      title="Permutations II"
      slug="permutations-ii"
      approaches={approaches}
      presets={PermutationsIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Restore IP Addresses (restore-ip-addresses)
// ==========================================

const RestoreIpAddressesTemplates = {
  "python": {
    "language": "python",
    "code": "def restoreIpAddresses(s):\n    result = []\n    backtrack(s, 0, [], result)\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def backtrack(s, start, segments, result):\n    if len(segments) == 4:\n        if start == len(s):\n            result.append(\".\".join(segments))\n        return\n\n    for length in range(1, 4):\n        if start + length > len(s):\n            break\n        segment = s[start:start + length]\n\n        if len(segment) > 1 and segment[0] == '0':\n            continue\n        if int(segment) > 255:\n            continue\n\n        segments.append(segment)\n        backtrack(s, start + length, segments, result)\n        segments.pop()",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        5
      ],
      "try_segment": [
        10
      ],
      "skip_leading_zero": [
        13
      ],
      "skip_too_large": [
        15
      ],
      "add_segment": [
        17
      ],
      "backtrack_segment": [
        19
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        7
      ],
      "has_leading_zero": [
        12
      ],
      "exceeds_255": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> restoreIpAddresses(String s) {\n    List<String> result = new ArrayList<>();\n    backtrack(s, 0, new ArrayList<>(), result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void backtrack(String s, int start, List<String> segments, List<String> result) {\n    if (segments.size() == 4) {\n        if (start == s.length()) {\n            result.add(String.join(\".\", segments));\n        }\n        return;\n    }\n\n    for (int len = 1; len <= 3; len++) {\n        if (start + len > s.length()) break;\n        String segment = s.substring(start, start + len);\n\n        if (segment.length() > 1 && segment.charAt(0) == '0') continue;\n        if (Integer.parseInt(segment) > 255) continue;\n\n        segments.add(segment);\n        backtrack(s, start + len, segments, result);\n        segments.remove(segments.size() - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        6
      ],
      "try_segment": [
        11
      ],
      "skip_leading_zero": [
        13
      ],
      "skip_too_large": [
        14
      ],
      "add_segment": [
        16
      ],
      "backtrack_segment": [
        18
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        9
      ],
      "has_leading_zero": [
        13
      ],
      "exceeds_255": [
        14
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> restoreIpAddresses(string s) {\n    vector<string> result;\n    vector<string> segments;\n    backtrack(s, 0, segments, result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "before_backtrack": [
        4
      ],
      "complete": [
        5
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "void backtrack(string& s, int start, vector<string>& segments, vector<string>& result) {\n    if (segments.size() == 4) {\n        if (start == s.length()) {\n            string ip = segments[0];\n            for (int i = 1; i < 4; i++) ip += \".\" + segments[i];\n            result.push_back(ip);\n        }\n        return;\n    }\n\n    for (int len = 1; len <= 3; len++) {\n        if (start + len > s.length()) break;\n        string segment = s.substr(start, len);\n\n        if (segment.length() > 1 && segment[0] == '0') continue;\n        if (stoi(segment) > 255) continue;\n\n        segments.push_back(segment);\n        backtrack(s, start + len, segments, result);\n        segments.pop_back();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4,
        5,
        6
      ],
      "not_all_used": [
        8
      ],
      "try_segment": [
        13
      ],
      "skip_leading_zero": [
        15
      ],
      "skip_too_large": [
        16
      ],
      "add_segment": [
        18
      ],
      "backtrack_segment": [
        20
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        11
      ],
      "has_leading_zero": [
        15
      ],
      "exceeds_255": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> RestoreIpAddresses(string s) {\n    var result = new List<string>();\n    Backtrack(s, 0, new List<string>(), result);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private void Backtrack(string s, int start, List<string> segments, List<string> result) {\n    if (segments.Count == 4) {\n        if (start == s.Length) {\n            result.Add(string.Join(\".\", segments));\n        }\n        return;\n    }\n\n    for (int len = 1; len <= 3; len++) {\n        if (start + len > s.Length) break;\n        string segment = s.Substring(start, len);\n\n        if (segment.Length > 1 && segment[0] == '0') continue;\n        if (int.Parse(segment) > 255) continue;\n\n        segments.Add(segment);\n        Backtrack(s, start + len, segments, result);\n        segments.RemoveAt(segments.Count - 1);\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        6
      ],
      "try_segment": [
        11
      ],
      "skip_leading_zero": [
        13
      ],
      "skip_too_large": [
        14
      ],
      "add_segment": [
        16
      ],
      "backtrack_segment": [
        18
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        9
      ],
      "has_leading_zero": [
        13
      ],
      "exceeds_255": [
        14
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func restoreIpAddresses(s string) []string {\n    result := []string{}\n    backtrack(s, 0, []string{}, &result)\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func backtrack(s string, start int, segments []string, result *[]string) {\n    if len(segments) == 4 {\n        if start == len(s) {\n            *result = append(*result, strings.Join(segments, \".\"))\n        }\n        return\n    }\n\n    for length := 1; length <= 3; length++ {\n        if start + length > len(s) {\n            break\n        }\n        segment := s[start : start+length]\n\n        if len(segment) > 1 && segment[0] == '0' {\n            continue\n        }\n        val, _ := strconv.Atoi(segment)\n        if val > 255 {\n            continue\n        }\n\n        segments = append(segments, segment)\n        backtrack(s, start+length, segments, result)\n        segments = segments[:len(segments)-1]\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        6
      ],
      "try_segment": [
        13
      ],
      "skip_leading_zero": [
        16
      ],
      "skip_too_large": [
        20
      ],
      "add_segment": [
        23
      ],
      "backtrack_segment": [
        25
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        9
      ],
      "has_leading_zero": [
        15
      ],
      "exceeds_255": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function restoreIpAddresses(s) {\n    const result = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start, segments) {\n    if (segments.length === 4) {\n        if (start === s.length) {\n            result.push(segments.join(\".\"));\n        }\n        return;\n    }\n\n    for (let len = 1; len <= 3; len++) {\n        if (start + len > s.length) break;\n        const segment = s.substring(start, start + len);\n\n        if (segment.length > 1 && segment[0] === '0') continue;\n        if (parseInt(segment) > 255) continue;\n\n        segments.push(segment);\n        backtrack(start + len, segments);\n        segments.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        6
      ],
      "try_segment": [
        11
      ],
      "skip_leading_zero": [
        13
      ],
      "skip_too_large": [
        14
      ],
      "add_segment": [
        16
      ],
      "backtrack_segment": [
        18
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        9
      ],
      "has_leading_zero": [
        13
      ],
      "exceeds_255": [
        14
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function restoreIpAddresses(s: string): string[] {\n    const result: string[] = [];\n    backtrack(0, []);\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "before_backtrack": [
        3
      ],
      "complete": [
        4
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function backtrack(start: number, segments: string[]): void {\n    if (segments.length === 4) {\n        if (start === s.length) {\n            result.push(segments.join(\".\"));\n        }\n        return;\n    }\n\n    for (let len = 1; len <= 3; len++) {\n        if (start + len > s.length) break;\n        const segment = s.substring(start, start + len);\n\n        if (segment.length > 1 && segment[0] === '0') continue;\n        if (parseInt(segment) > 255) continue;\n\n        segments.push(segment);\n        backtrack(start + len, segments);\n        segments.pop();\n    }\n}",
    "recursiveLineMap": {
      "enter_backtrack": [
        1
      ],
      "found_ip": [
        4
      ],
      "not_all_used": [
        6
      ],
      "try_segment": [
        11
      ],
      "skip_leading_zero": [
        13
      ],
      "skip_too_large": [
        14
      ],
      "add_segment": [
        16
      ],
      "backtrack_segment": [
        18
      ],
      "exit_backtrack": [
        1
      ]
    },
    "recursiveConditionalMap": {
      "has_four_segments": [
        2
      ],
      "all_chars_used": [
        3
      ],
      "for_len": [
        9
      ],
      "has_leading_zero": [
        13
      ],
      "exceeds_255": [
        14
      ]
    }
  }
};

const RestoreIpAddressesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "s": "25525511135"
    }
  },
  {
    "id": "ex2",
    "label": "All Zeros",
    "value": {
      "s": "0000"
    }
  },
  {
    "id": "ex3",
    "label": "All Ones",
    "value": {
      "s": "1111"
    }
  },
  {
    "id": "ex4",
    "label": "Leading Zeros",
    "value": {
      "s": "010010"
    }
  }
];

function generateRestoreIpAddressesSteps(e: any): any[] {
  
let t=e.s||"",s=new RecursiveStepRecorder({},{});for(let e=0;e<t.length;e++)s.add_new_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`});s.pushCallFrame({s:t},"restoreIpAddresses"),s.record("-","Start: Restore valid IP addresses from digit string");let r=[];function a(e){let t=s.getCurrentVisuals();Object.keys(t).forEach(n=>{let r=t[n];if("naryTreeNode"===r.type){let t=n===e,a=r.state;t&&"active"!==a?s.update_visual(n,{...r,state:"active"}):t||"active"!==a||s.update_visual(n,{...r,state:void 0})}})}function i(e,n){for(let r=0;r<t.length;r++){let a=r>=e&&r<n?"active":void 0;s.update_visual(`char_${r}`,{type:"arrayElement",value:t[r],position:r,label:`${r}`,state:a})}}function l(){for(let e=0;e<t.length;e++)s.update_visual(`char_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:void 0})}return s.update_global_variable("result",r),s.update_global_variable("s",t),s.record("init",`Initialize result = [], s = "${t}"`),s.record("before_backtrack","Call backtrack(0, [])"),!function e(n,o,c){let d=c.lastIndexOf("-"),g=d>0?c.substring(0,d):null,u=d>0?parseInt(c.substring(d+1),10):void 0,f=o.length>0?o.join("."):"[]";if(s.add_new_visual(c,{type:"naryTreeNode",value:f,parent:g||void 0,childIndex:u}),s.pushCallFrame({start:n,segments:[...o]},"backtrack"),a(c),s.record("enter_backtrack",`Enter backtrack(start=${n}, segments=[${o.join(".")}])`),4===o.length){if(s.add_conditional("has_four_segments",!0),n===t.length){s.add_conditional("all_chars_used",!0);let e=o.join(".");r.push(e),s.update_global_variable("result",[...r]),s.update_visual(c,{type:"naryTreeNode",value:e,parent:g||void 0,childIndex:u,state:"active"}),s.record("found_ip",`Found valid IP: ${e}`),s.popCallFrame();return}s.add_conditional("all_chars_used",!1),s.update_visual(c,{type:"naryTreeNode",value:f+"...",parent:g||void 0,childIndex:u,state:"visited"}),s.record("not_all_used",`4 segments but ${t.length-n} chars remaining, backtrack`),s.popCallFrame();return}s.add_conditional("has_four_segments",!1);let p=0;for(let r=1;r<=3&&!(n+r>t.length);r++){let l=t.substring(n,n+r);if(s.add_conditional("for_len",!0),s.update_frame_variable("len",r),s.update_frame_variable("segment",l),i(n,n+r),s.record("try_segment",`Try segment "${l}" (chars ${n}..${n+r-1})`),l.length>1&&"0"===l[0]){s.add_conditional("has_leading_zero",!0),s.record("skip_leading_zero",`Skip "${l}", has leading zero`);continue}if(s.add_conditional("has_leading_zero",!1),parseInt(l)>255){s.add_conditional("exceeds_255",!0),s.record("skip_too_large",`Skip "${l}", exceeds 255`);continue}s.add_conditional("exceeds_255",!1),o.push(l),s.update_frame_variable("segments",[...o]),s.record("add_segment",`Add segment "${l}", segments=[${o.join(".")}]`),e(n+r,o,c+"-"+p),a(c),o.pop(),s.update_frame_variable("segments",[...o]),i(n,n+r),s.record("backtrack_segment",`Backtrack: remove "${l}"`),p++}s.add_conditional("for_len",!1),l(),s.update_visual(c,{type:"naryTreeNode",value:f,parent:g||void 0,childIndex:u,state:"visited"}),s.record("exit_backtrack",`Exit backtrack(start=${n})`),s.popCallFrame()}(0,[],"0"),l(),s.update_global_variable("result",[...r]),s.record("complete",`Found ${r.length} valid IP address${1!==r.length?"es":""}`),s.getSteps()
}

export function RestoreIpAddressesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RestoreIpAddressesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRestoreIpAddressesSteps(e) as any[];
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
      title="Restore IP Addresses"
      slug="restore-ip-addresses"
      approaches={approaches}
      presets={RestoreIpAddressesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Subsets II (subsets-ii)
// ==========================================

const SubsetsIiTemplates = {
  "python": {
    "language": "python",
    "code": "def subsetsWithDup(nums):\n    nums.sort()\n    result = [[]]\n    prev_new_count = 0\n    for i in range(len(nums)):\n        start_index = 0\n        if i > 0 and nums[i] == nums[i - 1]:\n            start_index = len(result) - prev_new_count\n        new_count = 0\n        current_size = len(result)\n        for j in range(start_index, current_size):\n            new_subset = result[j] + [nums[i]]\n            result.append(new_subset)\n            new_count += 1\n        prev_new_count = new_count\n    return result",
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
      "outer_loop": [
        5
      ],
      "check_duplicate": [
        7
      ],
      "set_start_dup": [
        8
      ],
      "set_start_all": [
        6
      ],
      "inner_loop": [
        11
      ],
      "create_subset": [
        12
      ],
      "add_to_result": [
        13,
        14
      ],
      "update_count": [
        15
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<List<Integer>> subsetsWithDup(int[] nums) {\n    Arrays.sort(nums);\n    List<List<Integer>> result = new ArrayList<>();\n    result.add(new ArrayList<>());\n    int prevNewCount = 0;\n    for (int i = 0; i < nums.length; i++) {\n        int startIndex = 0;\n        if (i > 0 && nums[i] == nums[i - 1]) {\n            startIndex = result.size() - prevNewCount;\n        }\n        int newCount = 0;\n        int currentSize = result.size();\n        for (int j = startIndex; j < currentSize; j++) {\n            List<Integer> newSubset = new ArrayList<>(result.get(j));\n            newSubset.add(nums[i]);\n            result.add(newSubset);\n            newCount++;\n        }\n        prevNewCount = newCount;\n    }\n    return result;\n}",
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
      "outer_loop": [
        6
      ],
      "check_duplicate": [
        8
      ],
      "set_start_dup": [
        9
      ],
      "set_start_all": [
        7
      ],
      "inner_loop": [
        13
      ],
      "create_subset": [
        14,
        15
      ],
      "add_to_result": [
        16,
        17
      ],
      "update_count": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        8
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> subsetsWithDup(vector<int>& nums) {\n    sort(nums.begin(), nums.end());\n    vector<vector<int>> result = {{}};\n    int prevNewCount = 0;\n    for (int i = 0; i < nums.size(); i++) {\n        int startIndex = 0;\n        if (i > 0 && nums[i] == nums[i - 1]) {\n            startIndex = result.size() - prevNewCount;\n        }\n        int newCount = 0;\n        int currentSize = result.size();\n        for (int j = startIndex; j < currentSize; j++) {\n            vector<int> newSubset = result[j];\n            newSubset.push_back(nums[i]);\n            result.push_back(newSubset);\n            newCount++;\n        }\n        prevNewCount = newCount;\n    }\n    return result;\n}",
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
      "outer_loop": [
        5
      ],
      "check_duplicate": [
        7
      ],
      "set_start_dup": [
        8
      ],
      "set_start_all": [
        6
      ],
      "inner_loop": [
        12
      ],
      "create_subset": [
        13,
        14
      ],
      "add_to_result": [
        15,
        16
      ],
      "update_count": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<IList<int>> SubsetsWithDup(int[] nums) {\n    Array.Sort(nums);\n    var result = new List<IList<int>>();\n    result.Add(new List<int>());\n    int prevNewCount = 0;\n    for (int i = 0; i < nums.Length; i++) {\n        int startIndex = 0;\n        if (i > 0 && nums[i] == nums[i - 1]) {\n            startIndex = result.Count - prevNewCount;\n        }\n        int newCount = 0;\n        int currentSize = result.Count;\n        for (int j = startIndex; j < currentSize; j++) {\n            var newSubset = new List<int>(result[j]);\n            newSubset.Add(nums[i]);\n            result.Add(newSubset);\n            newCount++;\n        }\n        prevNewCount = newCount;\n    }\n    return result;\n}",
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
      "outer_loop": [
        6
      ],
      "check_duplicate": [
        8
      ],
      "set_start_dup": [
        9
      ],
      "set_start_all": [
        7
      ],
      "inner_loop": [
        13
      ],
      "create_subset": [
        14,
        15
      ],
      "add_to_result": [
        16,
        17
      ],
      "update_count": [
        19
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        8
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func subsetsWithDup(nums []int) [][]int {\n    sort.Ints(nums)\n    result := [][]int{{}}\n    prevNewCount := 0\n    for i := 0; i < len(nums); i++ {\n        startIndex := 0\n        if i > 0 && nums[i] == nums[i-1] {\n            startIndex = len(result) - prevNewCount\n        }\n        newCount := 0\n        currentSize := len(result)\n        for j := startIndex; j < currentSize; j++ {\n            newSubset := append([]int{}, result[j]...)\n            newSubset = append(newSubset, nums[i])\n            result = append(result, newSubset)\n            newCount++\n        }\n        prevNewCount = newCount\n    }\n    return result\n}",
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
      "outer_loop": [
        5
      ],
      "check_duplicate": [
        7
      ],
      "set_start_dup": [
        8
      ],
      "set_start_all": [
        6
      ],
      "inner_loop": [
        12
      ],
      "create_subset": [
        13,
        14
      ],
      "add_to_result": [
        15,
        16
      ],
      "update_count": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function subsetsWithDup(nums) {\n    nums.sort((a, b) => a - b);\n    const result = [[]];\n    let prevNewCount = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let startIndex = 0;\n        if (i > 0 && nums[i] === nums[i - 1]) {\n            startIndex = result.length - prevNewCount;\n        }\n        let newCount = 0;\n        const currentSize = result.length;\n        for (let j = startIndex; j < currentSize; j++) {\n            const newSubset = [...result[j], nums[i]];\n            result.push(newSubset);\n            newCount++;\n        }\n        prevNewCount = newCount;\n    }\n    return result;\n}",
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
      "outer_loop": [
        5
      ],
      "check_duplicate": [
        7
      ],
      "set_start_dup": [
        8
      ],
      "set_start_all": [
        6
      ],
      "inner_loop": [
        12
      ],
      "create_subset": [
        13
      ],
      "add_to_result": [
        14,
        15
      ],
      "update_count": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function subsetsWithDup(nums: number[]): number[][] {\n    nums.sort((a, b) => a - b);\n    const result: number[][] = [[]];\n    let prevNewCount = 0;\n    for (let i = 0; i < nums.length; i++) {\n        let startIndex = 0;\n        if (i > 0 && nums[i] === nums[i - 1]) {\n            startIndex = result.length - prevNewCount;\n        }\n        let newCount = 0;\n        const currentSize = result.length;\n        for (let j = startIndex; j < currentSize; j++) {\n            const newSubset = [...result[j], nums[i]];\n            result.push(newSubset);\n            newCount++;\n        }\n        prevNewCount = newCount;\n    }\n    return result;\n}",
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
      "outer_loop": [
        5
      ],
      "check_duplicate": [
        7
      ],
      "set_start_dup": [
        8
      ],
      "set_start_all": [
        6
      ],
      "inner_loop": [
        12
      ],
      "create_subset": [
        13
      ],
      "add_to_result": [
        14,
        15
      ],
      "update_count": [
        17
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_duplicate": [
        7
      ]
    }
  }
};

const SubsetsIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: [1,2,2]",
    "value": {
      "nums": [
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex2",
    "label": "More Duplicates",
    "value": {
      "nums": [
        1,
        1,
        2,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Element",
    "value": {
      "nums": [
        0
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Many Dupes",
    "value": {
      "nums": [
        4,
        4,
        4,
        1,
        4
      ]
    }
  }
];

function generateSubsetsIiSteps(e: any): any[] {
  
let t=e.nums||[],n=new StepRecorder({});n.record("-","Start: Generate all subsets (with duplicates) using iterative approach");let r=[...t].sort((e,t)=>e-t);r.forEach((e,t)=>{n.add_new_visual(`elem_${t}`,{type:"arrayElement",value:e,position:t})}),n.update_variable("nums",r),n.record("sort",`Sort nums: [${r.join(", ")}]`);let i=[[]];n.add_new_visual("result_0",{type:"stateElement",value:"[]",index:0,state:"standard"}),n.update_variable("result",i.map(e=>[...e])),n.update_variable("prevNewCount",0),n.record("init","Initialize result = [[]], prevNewCount = 0");let a=0;for(let e=0;e<r.length;e++){let t;n.add_new_visual("ptr_i",{type:"pointer",position:e,label:"i"}),n.update_variable("i",e),n.record("outer_loop",`Process nums[${e}] = ${r[e]}`);let s=e>0&&r[e]===r[e-1];if(n.add_conditional("is_duplicate",s),n.record("check_duplicate",s?`nums[${e}] == nums[${e-1}] (${r[e]} == ${r[e-1]}): duplicate`:0===e?"First element, not a duplicate":`nums[${e}] != nums[${e-1}] (${r[e]} != ${r[e-1]}): not a duplicate`),s){t=i.length-a;for(let e=0;e<i.length;e++){let s=e>=t?"highlight":"standard";n.update_visual(`result_${e}`,{type:"stateElement",value:`[${i[e].join(",")}]`,index:e,state:s})}n.update_variable("startIndex",t),n.record("set_start_dup",`Duplicate: only extend last ${a} subsets (startIndex = ${t})`)}else{t=0;for(let e=0;e<i.length;e++)n.update_visual(`result_${e}`,{type:"stateElement",value:`[${i[e].join(",")}]`,index:e,state:"highlight"});n.update_variable("startIndex",t),n.record("set_start_all","Not duplicate: extend all subsets (startIndex = 0)")}let l=0,u=i.length;for(let s=t;s<u;s++){n.update_variable("j",s),n.record("inner_loop",`Extend subset result[${s}] = [${i[s].join(", ")}]`);let t=[...i[s],r[e]];n.record("create_subset",`Create new subset: [${i[s].join(", ")}] + [${r[e]}] = [${t.join(", ")}]`),i.push(t),l++,n.add_new_visual(`result_${i.length-1}`,{type:"stateElement",value:`[${t.join(",")}]`,index:i.length-1,state:"active"}),n.update_variable("result",i.map(e=>[...e])),n.record("add_to_result",`Add [${t.join(", ")}] to result (size = ${i.length})`)}for(let e=0;e<i.length;e++)n.update_visual(`result_${e}`,{type:"stateElement",value:`[${i[e].join(",")}]`,index:e,state:"standard"});a=l,n.update_variable("prevNewCount",a),n.delete_variable("j"),n.delete_variable("startIndex"),n.record("update_count",`Update prevNewCount = ${a}`)}return r.length>0&&n.delete_visual("ptr_i"),n.delete_variable("i"),n.delete_variable("prevNewCount"),n.update_variable("result",i.map(e=>[...e])),n.record("complete",`Generated ${i.length} subsets: ${JSON.stringify(i)}`),n.getSteps()
}

export function SubsetsIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SubsetsIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSubsetsIiSteps(e) as any[];
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
      title="Subsets II"
      slug="subsets-ii"
      approaches={approaches}
      presets={SubsetsIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sudoku Solver (sudoku-solver)
// ==========================================

const SudokuSolverTemplates = {
  "python": {
    "language": "python",
    "code": "def solveSudoku(board):\n    solve(board)",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def solve(board):\n    for i in range(9):\n        for j in range(9):\n            if board[i][j] == '.':\n                for d in '123456789':\n                    if is_valid(board, i, j, d):\n                        board[i][j] = d\n                        if solve(board):\n                            return True\n                        board[i][j] = '.'\n                return False\n    return True",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8,
        9
      ],
      "backtrack_digit": [
        10
      ],
      "no_valid_digit": [
        11
      ],
      "solved": [
        12
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void solveSudoku(char[][] board) {\n    solve(board);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private boolean solve(char[][] board) {\n    for (int i = 0; i < 9; i++) {\n        for (int j = 0; j < 9; j++) {\n            if (board[i][j] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (isValid(board, i, j, d)) {\n                        board[i][j] = d;\n                        if (solve(board)) return true;\n                        board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8
      ],
      "backtrack_digit": [
        9
      ],
      "no_valid_digit": [
        12
      ],
      "solved": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void solveSudoku(vector<vector<char>>& board) {\n    solve(board);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "bool solve(vector<vector<char>>& board) {\n    for (int i = 0; i < 9; i++) {\n        for (int j = 0; j < 9; j++) {\n            if (board[i][j] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (isValid(board, i, j, d)) {\n                        board[i][j] = d;\n                        if (solve(board)) return true;\n                        board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8
      ],
      "backtrack_digit": [
        9
      ],
      "no_valid_digit": [
        12
      ],
      "solved": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void SolveSudoku(char[][] board) {\n    Solve(board);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private bool Solve(char[][] board) {\n    for (int i = 0; i < 9; i++) {\n        for (int j = 0; j < 9; j++) {\n            if (board[i][j] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (IsValid(board, i, j, d)) {\n                        board[i][j] = d;\n                        if (Solve(board)) return true;\n                        board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8
      ],
      "backtrack_digit": [
        9
      ],
      "no_valid_digit": [
        12
      ],
      "solved": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func solveSudoku(board [][]byte) {\n    solve(board)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func solve(board [][]byte) bool {\n    for i := 0; i < 9; i++ {\n        for j := 0; j < 9; j++ {\n            if board[i][j] == '.' {\n                for d := byte('1'); d <= '9'; d++ {\n                    if isValid(board, i, j, d) {\n                        board[i][j] = d\n                        if solve(board) {\n                            return true\n                        }\n                        board[i][j] = '.'\n                    }\n                }\n                return false\n            }\n        }\n    }\n    return true\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8,
        9,
        10
      ],
      "backtrack_digit": [
        11
      ],
      "no_valid_digit": [
        14
      ],
      "solved": [
        18
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function solveSudoku(board) {\n    solve(board);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function solve(board) {\n    for (let i = 0; i < 9; i++) {\n        for (let j = 0; j < 9; j++) {\n            if (board[i][j] === '.') {\n                for (let d = 1; d <= 9; d++) {\n                    if (isValid(board, i, j, String(d))) {\n                        board[i][j] = String(d);\n                        if (solve(board)) return true;\n                        board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8
      ],
      "backtrack_digit": [
        9
      ],
      "no_valid_digit": [
        12
      ],
      "solved": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function solveSudoku(board: string[][]): void {\n    solve(board);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "complete": [
        2
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function solve(board: string[][]): boolean {\n    for (let i = 0; i < 9; i++) {\n        for (let j = 0; j < 9; j++) {\n            if (board[i][j] === '.') {\n                for (let d = 1; d <= 9; d++) {\n                    if (isValid(board, i, j, String(d))) {\n                        board[i][j] = String(d);\n                        if (solve(board)) return true;\n                        board[i][j] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}",
    "recursiveLineMap": {
      "find_empty": [
        2,
        3,
        4
      ],
      "try_digit": [
        5
      ],
      "is_valid": [
        6,
        7
      ],
      "not_valid": [
        6
      ],
      "place_digit": [
        7
      ],
      "recurse": [
        8
      ],
      "backtrack_digit": [
        9
      ],
      "no_valid_digit": [
        12
      ],
      "solved": [
        16
      ]
    },
    "recursiveConditionalMap": {
      "is_valid_check": [
        6
      ]
    }
  }
};

const SudokuSolverPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Almost Solved (2 empty)",
    "value": {
      "board": [
        [
          "5",
          "3",
          "4",
          "6",
          "7",
          "8",
          "9",
          "1",
          "2"
        ],
        [
          "6",
          "7",
          "2",
          "1",
          "9",
          "5",
          "3",
          "4",
          "8"
        ],
        [
          "1",
          "9",
          "8",
          "3",
          "4",
          "2",
          "5",
          "6",
          "7"
        ],
        [
          "8",
          "5",
          "9",
          "7",
          "6",
          "1",
          "4",
          "2",
          "3"
        ],
        [
          "4",
          "2",
          "6",
          "8",
          "5",
          "3",
          "7",
          "9",
          "1"
        ],
        [
          "7",
          "1",
          "3",
          "9",
          "2",
          "4",
          "8",
          "5",
          "6"
        ],
        [
          "9",
          "6",
          "1",
          "5",
          "3",
          "7",
          "2",
          "8",
          "4"
        ],
        [
          "2",
          "8",
          "7",
          "4",
          "1",
          "9",
          "6",
          "3",
          "5"
        ],
        [
          "3",
          "4",
          "5",
          "2",
          "8",
          "6",
          "1",
          ".",
          "."
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Easy (8 empty)",
    "value": {
      "board": [
        [
          "5",
          "3",
          ".",
          "6",
          "7",
          "8",
          "9",
          "1",
          "2"
        ],
        [
          "6",
          "7",
          "2",
          "1",
          "9",
          "5",
          "3",
          "4",
          "8"
        ],
        [
          "1",
          "9",
          "8",
          "3",
          "4",
          "2",
          "5",
          "6",
          "7"
        ],
        [
          "8",
          "5",
          "9",
          ".",
          "6",
          "1",
          "4",
          "2",
          "3"
        ],
        [
          "4",
          "2",
          "6",
          "8",
          ".",
          "3",
          "7",
          "9",
          "1"
        ],
        [
          "7",
          "1",
          "3",
          "9",
          "2",
          ".",
          "8",
          "5",
          "6"
        ],
        [
          "9",
          "6",
          "1",
          "5",
          "3",
          "7",
          ".",
          "8",
          "4"
        ],
        [
          "2",
          "8",
          ".",
          "4",
          "1",
          "9",
          "6",
          "3",
          "5"
        ],
        [
          "3",
          "4",
          "5",
          "2",
          "8",
          "6",
          "1",
          ".",
          "."
        ]
      ]
    }
  }
];

function generateSudokuSolverSteps(e: any): any[] {
  
let t=e.board.map(e=>[...e]),r=new RecursiveStepRecorder({},{});for(let e=0;e<9;e++)for(let o=0;o<9;o++){let i=t[e][o],a="."!==i;r.add_new_visual(`cell_${e}_${o}`,{type:"matrixElement",value:a?i:"",row:e,col:o,state:a?"prefilled":"empty"})}function i(e,t){return`cell_${e}_${t}`}return r.pushCallFrame({board:"9x9"},"solveSudoku"),r.record("-","Start: Solve the Sudoku puzzle using backtracking"),!function e(){for(let o=0;o<9;o++)for(let a=0;a<9;a++)if("."===t[o][a]){r.update_visual(i(o,a),{type:"matrixElement",value:"",row:o,col:a,state:"trying"}),r.pushCallFrame({row:o,col:a},"solve"),r.record("find_empty",`Found empty cell at (${o}, ${a})`);for(let l=1;l<=9;l++){let s=String(l);if(r.update_visual(i(o,a),{type:"matrixElement",value:s,row:o,col:a,state:"trying"}),r.update_frame_variable("digit",s),r.record("try_digit",`Try digit ${s} at (${o}, ${a})`),function(e,r,o){for(let i=0;i<9;i++){if(t[e][i]===o||t[i][r]===o)return!1;let a=3*Math.floor(e/3)+Math.floor(i/3),l=3*Math.floor(r/3)+i%3;if(t[a][l]===o)return!1}return!0}(o,a,s)){if(r.add_conditional("is_valid_check",!0),r.record("is_valid",`Digit ${s} is valid at (${o}, ${a})`),t[o][a]=s,r.update_visual(i(o,a),{type:"matrixElement",value:s,row:o,col:a,state:"placed"}),r.record("place_digit",`Place ${s} at (${o}, ${a})`),r.record("recurse","Recurse to solve remaining cells"),e())return r.popCallFrame(),!0;t[o][a]=".",r.update_visual(i(o,a),{type:"matrixElement",value:"",row:o,col:a,state:"trying"}),r.record("backtrack_digit",`Backtrack: remove ${s} from (${o}, ${a})`)}else{r.add_conditional("is_valid_check",!1),function(e,o,a){for(let l=0;l<9;l++){if(l!==o&&t[e][l]===a){let t=r.get_visual(i(e,l));t&&r.update_visual(i(e,l),{...t,state:"conflict"})}if(l!==e&&t[l][o]===a){let e=r.get_visual(i(l,o));e&&r.update_visual(i(l,o),{...e,state:"conflict"})}let s=3*Math.floor(e/3)+Math.floor(l/3),n=3*Math.floor(o/3)+l%3;if((s!==e||n!==o)&&t[s][n]===a){let e=r.get_visual(i(s,n));e&&r.update_visual(i(s,n),{...e,state:"conflict"})}}}(o,a,s),r.record("not_valid",`Digit ${s} conflicts at (${o}, ${a})`);for(let e=0;e<9;e++)for(let o=0;o<9;o++){let a=r.get_visual(i(e,o));if(a&&"conflict"===a.state){let l=t[e][o];r.update_visual(i(e,o),{...a,state:"."===l?"empty":"prefilled"})}}}}return r.update_visual(i(o,a),{type:"matrixElement",value:"",row:o,col:a,state:"empty"}),r.record("no_valid_digit",`No valid digit for (${o}, ${a}), backtrack`),r.popCallFrame(),!1}for(let e=0;e<9;e++)for(let t=0;t<9;t++){let o=r.get_visual(i(e,t));o&&"prefilled"!==o.state&&r.update_visual(i(e,t),{...o,state:"placed"})}return r.record("solved","Puzzle solved! All cells filled."),!0}(),r.record("complete","Sudoku solved successfully!"),r.getSteps()
}

export function SudokuSolverProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SudokuSolverTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSudokuSolverSteps(e) as any[];
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
      title="Sudoku Solver"
      slug="sudoku-solver"
      approaches={approaches}
      presets={SudokuSolverPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Unique Paths III (unique-paths-iii)
// ==========================================

const UniquePathsIiiTemplates = {
  "python": {
    "language": "python",
    "code": "def uniquePathsIII(grid):\n    m, n = len(grid), len(grid[0])\n    start_r, start_c, empty = 0, 0, 0\n    for i in range(m):\n        for j in range(n):\n            if grid[i][j] == 1: start_r, start_c = i, j\n            if grid[i][j] != -1: empty += 1\n    return dfs(grid, start_r, start_c, empty, m, n)",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        8
      ],
      "complete": [
        8
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "def dfs(grid, r, c, remaining, m, n):\n    if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] == -1:\n        return 0\n    if grid[r][c] == 2:\n        return 1 if remaining == 1 else 0\n    grid[r][c] = -1  # mark visited\n    paths = (dfs(grid, r+1, c, remaining-1, m, n)\n           + dfs(grid, r-1, c, remaining-1, m, n)\n           + dfs(grid, r, c+1, remaining-1, m, n)\n           + dfs(grid, r, c-1, remaining-1, m, n))\n    grid[r][c] = 0  # backtrack\n    return paths",
    "recursiveLineMap": {
      "check_bounds": [
        2,
        3
      ],
      "visit_cell": [
        6
      ],
      "explore_direction": [
        7,
        8,
        9,
        10
      ],
      "found_path": [
        5
      ],
      "not_all_visited": [
        5
      ],
      "backtrack": [
        11,
        12
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        4
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int uniquePathsIII(int[][] grid) {\n    int m = grid.length, n = grid[0].length;\n    int startR = 0, startC = 0, empty = 0;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++) {\n            if (grid[i][j] == 1) { startR = i; startC = j; }\n            if (grid[i][j] != -1) empty++;\n        }\n    return dfs(grid, startR, startC, empty, m, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private int dfs(int[][] grid, int r, int c, int remaining, int m, int n) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == -1) return 0;\n    if (grid[r][c] == 2) return remaining == 1 ? 1 : 0;\n    grid[r][c] = -1; // mark visited\n    int paths = dfs(grid, r+1, c, remaining-1, m, n)\n             + dfs(grid, r-1, c, remaining-1, m, n)\n             + dfs(grid, r, c+1, remaining-1, m, n)\n             + dfs(grid, r, c-1, remaining-1, m, n);\n    grid[r][c] = 0; // backtrack\n    return paths;\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2
      ],
      "visit_cell": [
        4
      ],
      "explore_direction": [
        5,
        6,
        7,
        8
      ],
      "found_path": [
        3
      ],
      "not_all_visited": [
        3
      ],
      "backtrack": [
        9,
        10
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        3
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int uniquePathsIII(vector<vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size();\n    int startR = 0, startC = 0, empty = 0;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++) {\n            if (grid[i][j] == 1) { startR = i; startC = j; }\n            if (grid[i][j] != -1) empty++;\n        }\n    return dfs(grid, startR, startC, empty, m, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "int dfs(vector<vector<int>>& grid, int r, int c, int remaining, int m, int n) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == -1) return 0;\n    if (grid[r][c] == 2) return remaining == 1 ? 1 : 0;\n    grid[r][c] = -1; // mark visited\n    int paths = dfs(grid, r+1, c, remaining-1, m, n)\n             + dfs(grid, r-1, c, remaining-1, m, n)\n             + dfs(grid, r, c+1, remaining-1, m, n)\n             + dfs(grid, r, c-1, remaining-1, m, n);\n    grid[r][c] = 0; // backtrack\n    return paths;\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2
      ],
      "visit_cell": [
        4
      ],
      "explore_direction": [
        5,
        6,
        7,
        8
      ],
      "found_path": [
        3
      ],
      "not_all_visited": [
        3
      ],
      "backtrack": [
        9,
        10
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        3
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int UniquePathsIII(int[][] grid) {\n    int m = grid.Length, n = grid[0].Length;\n    int startR = 0, startC = 0, empty = 0;\n    for (int i = 0; i < m; i++)\n        for (int j = 0; j < n; j++) {\n            if (grid[i][j] == 1) { startR = i; startC = j; }\n            if (grid[i][j] != -1) empty++;\n        }\n    return Dfs(grid, startR, startC, empty, m, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "private int Dfs(int[][] grid, int r, int c, int remaining, int m, int n) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == -1) return 0;\n    if (grid[r][c] == 2) return remaining == 1 ? 1 : 0;\n    grid[r][c] = -1; // mark visited\n    int paths = Dfs(grid, r+1, c, remaining-1, m, n)\n             + Dfs(grid, r-1, c, remaining-1, m, n)\n             + Dfs(grid, r, c+1, remaining-1, m, n)\n             + Dfs(grid, r, c-1, remaining-1, m, n);\n    grid[r][c] = 0; // backtrack\n    return paths;\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2
      ],
      "visit_cell": [
        4
      ],
      "explore_direction": [
        5,
        6,
        7,
        8
      ],
      "found_path": [
        3
      ],
      "not_all_visited": [
        3
      ],
      "backtrack": [
        9,
        10
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        3
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func uniquePathsIII(grid [][]int) int {\n    m, n := len(grid), len(grid[0])\n    startR, startC, empty := 0, 0, 0\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            if grid[i][j] == 1 { startR, startC = i, j }\n            if grid[i][j] != -1 { empty++ }\n        }\n    }\n    return dfs(grid, startR, startC, empty, m, n)\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        10
      ],
      "complete": [
        10
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "func dfs(grid [][]int, r, c, remaining, m, n int) int {\n    if r < 0 || r >= m || c < 0 || c >= n || grid[r][c] == -1 {\n        return 0\n    }\n    if grid[r][c] == 2 {\n        if remaining == 1 { return 1 }\n        return 0\n    }\n    grid[r][c] = -1 // mark visited\n    paths := dfs(grid, r+1, c, remaining-1, m, n) +\n             dfs(grid, r-1, c, remaining-1, m, n) +\n             dfs(grid, r, c+1, remaining-1, m, n) +\n             dfs(grid, r, c-1, remaining-1, m, n)\n    grid[r][c] = 0 // backtrack\n    return paths\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2,
        3
      ],
      "visit_cell": [
        9
      ],
      "explore_direction": [
        10,
        11,
        12,
        13
      ],
      "found_path": [
        5,
        6
      ],
      "not_all_visited": [
        5,
        7
      ],
      "backtrack": [
        14,
        15
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        5
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function uniquePathsIII(grid) {\n    const m = grid.length, n = grid[0].length;\n    let startR = 0, startC = 0, empty = 0;\n    for (let i = 0; i < m; i++)\n        for (let j = 0; j < n; j++) {\n            if (grid[i][j] === 1) { startR = i; startC = j; }\n            if (grid[i][j] !== -1) empty++;\n        }\n    return dfs(grid, startR, startC, empty, m, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(grid, r, c, remaining, m, n) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === -1) return 0;\n    if (grid[r][c] === 2) return remaining === 1 ? 1 : 0;\n    grid[r][c] = -1; // mark visited\n    const paths = dfs(grid, r+1, c, remaining-1, m, n)\n                + dfs(grid, r-1, c, remaining-1, m, n)\n                + dfs(grid, r, c+1, remaining-1, m, n)\n                + dfs(grid, r, c-1, remaining-1, m, n);\n    grid[r][c] = 0; // backtrack\n    return paths;\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2
      ],
      "visit_cell": [
        4
      ],
      "explore_direction": [
        5,
        6,
        7,
        8
      ],
      "found_path": [
        3
      ],
      "not_all_visited": [
        3
      ],
      "backtrack": [
        9,
        10
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        3
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function uniquePathsIII(grid: number[][]): number {\n    const m = grid.length, n = grid[0].length;\n    let startR = 0, startC = 0, empty = 0;\n    for (let i = 0; i < m; i++)\n        for (let j = 0; j < n; j++) {\n            if (grid[i][j] === 1) { startR = i; startC = j; }\n            if (grid[i][j] !== -1) empty++;\n        }\n    return dfs(grid, startR, startC, empty, m, n);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "start_dfs": [
        9
      ],
      "complete": [
        9
      ]
    },
    "conditionalMap": {},
    "recursiveCode": "function dfs(grid: number[][], r: number, c: number, remaining: number, m: number, n: number): number {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === -1) return 0;\n    if (grid[r][c] === 2) return remaining === 1 ? 1 : 0;\n    grid[r][c] = -1; // mark visited\n    const paths = dfs(grid, r+1, c, remaining-1, m, n)\n                + dfs(grid, r-1, c, remaining-1, m, n)\n                + dfs(grid, r, c+1, remaining-1, m, n)\n                + dfs(grid, r, c-1, remaining-1, m, n);\n    grid[r][c] = 0; // backtrack\n    return paths;\n}",
    "recursiveLineMap": {
      "check_bounds": [
        2
      ],
      "visit_cell": [
        4
      ],
      "explore_direction": [
        5,
        6,
        7,
        8
      ],
      "found_path": [
        3
      ],
      "not_all_visited": [
        3
      ],
      "backtrack": [
        9,
        10
      ]
    },
    "recursiveConditionalMap": {
      "check_bounds": [
        2
      ],
      "check_end": [
        3
      ]
    }
  }
};

const UniquePathsIiiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3x3 Simple",
    "value": {
      "grid": [
        [
          1,
          0,
          0
        ],
        [
          0,
          0,
          0
        ],
        [
          0,
          0,
          2
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "3x3 With Obstacle",
    "value": {
      "grid": [
        [
          1,
          0,
          0
        ],
        [
          0,
          -1,
          0
        ],
        [
          0,
          0,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3x4 Grid",
    "value": {
      "grid": [
        [
          1,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          0
        ],
        [
          0,
          0,
          0,
          2
        ]
      ]
    }
  }
];

function generateUniquePathsIiiSteps(e: any): any[] {
  
let t=e.grid||[[1,0,0],[0,0,0],[0,0,2]],r=t.length,n=t[0].length,a=0,s=0,l=0;for(let e=0;e<r;e++)for(let r=0;r<n;r++)1===t[e][r]&&(a=e,s=r),-1!==t[e][r]&&l++;let d={};for(let e=0;e<r;e++)for(let r=0;r<n;r++){let i="empty",n="";1===t[e][r]?(i="start",n="S"):2===t[e][r]?(i="end",n="E"):-1===t[e][r]&&(i="obstacle",n="X"),d[`cell_${e}_${r}`]={type:"matrixElement",value:n||"",row:e,col:r,state:i}}d.meta_paths={type:"metadata",value:0};let c=new RecursiveStepRecorder({paths:0},d);c.pushCallFrame({grid:"grid",startR:a,startC:s,empty:l},"uniquePathsIII"),c.record("-",`Start: Find all paths from S to E visiting every empty cell. Grid is ${r}x${n}, ${l} non-obstacle cells to visit.`);let o=Array.from({length:r},()=>Array(n).fill(!1)),m=0,f=[[1,0],[-1,0],[0,1],[0,-1]],u=["down","up","right","left"];function g(e,r,i){let n=t[e][r],a="";1===n?a="S":2===n?a="E":-1===n&&(a="X"),c.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:a,row:e,col:r,state:i})}return c.record("start_dfs",`Start DFS from (${a}, ${s}) with ${l} cells to visit`),!function e(i,a,s){if(c.pushCallFrame({r:i,c:a,remaining:s},"dfs"),i<0||i>=r||a<0||a>=n){c.add_conditional("check_bounds",!1),c.record("check_bounds",`Out of bounds: (${i}, ${a})`),c.popCallFrame();return}if(-1===t[i][a]||o[i][a]){c.add_conditional("check_bounds",!1),c.record("check_bounds",`Cell (${i}, ${a}) is ${-1===t[i][a]?"an obstacle":"already visited"}`),c.popCallFrame();return}if(c.add_conditional("check_bounds",!0),2===t[i][a])if(1===s){c.add_conditional("check_end",!0),m++,c.update_global_variable("paths",m),c.update_visual("meta_paths",{type:"metadata",value:m});for(let e=0;e<r;e++)for(let t=0;t<n;t++)o[e][t]&&g(e,t,"path_found");g(i,a,"path_found"),c.record("found_path",`Found valid path #${m}! All ${l} cells visited.`);for(let e=0;e<r;e++)for(let r=0;r<n;r++)o[e][r]&&(1===t[e][r]?g(e,r,"visiting"):g(e,r,"visited"));g(i,a,"end"),c.popCallFrame();return}else{c.add_conditional("check_end",!1),c.record("not_all_visited",`Reached end (${i}, ${a}) but ${s-1} cells still unvisited`),c.popCallFrame();return}c.add_conditional("check_end",!1),o[i][a]=!0,g(i,a,"visiting"),c.update_frame_variable("remaining",s),c.record("visit_cell",`Visit cell (${i}, ${a}), ${s-1} cells remaining`);for(let t=0;t<4;t++){let r=i+f[t][0],n=a+f[t][1];c.record("explore_direction",`Explore ${u[t]} from (${i}, ${a}) to (${r}, ${n})`),e(r,n,s-1)}o[i][a]=!1,1===t[i][a]?g(i,a,"start"):g(i,a,"empty"),c.record("backtrack",`Backtrack from (${i}, ${a})`),c.popCallFrame()}(a,s,l),c.update_global_variable("paths",m),c.record("complete",`Complete: Found ${m} unique path(s) visiting all cells`),c.getSteps()
}

export function UniquePathsIiiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: UniquePathsIiiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateUniquePathsIiiSteps(e) as any[];
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
      title="Unique Paths III"
      slug="unique-paths-iii"
      approaches={approaches}
      presets={UniquePathsIiiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Word Search (word-search)
// ==========================================

const WordSearchTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def exist(self, board: list[list[str]], word: str) -> bool:\n        m, n = len(board), len(board[0])\n\n        def backtrack(i: int, j: int, index: int) -> bool:\n            # All characters matched\n            if index == len(word):\n                return True\n            # Boundary check, visited check, and character match check\n            if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[index]:\n                return False\n\n            # Mark as visited by replacing with a sentinel character\n            temp = board[i][j]\n            board[i][j] = '#'\n\n            # Explore all four directions\n            found = (backtrack(i + 1, j, index + 1)\n                     or backtrack(i - 1, j, index + 1)\n                     or backtrack(i, j + 1, index + 1)\n                     or backtrack(i, j - 1, index + 1))\n\n            # Restore the original character (backtrack)\n            board[i][j] = temp\n\n            return found\n\n        for i in range(m):\n            for j in range(n):\n                if backtrack(i, j, 0):\n                    return True\n        return False",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "try_start": [
        28,
        29,
        30
      ],
      "check_matched": [
        6,
        7,
        8
      ],
      "check_cell": [
        9,
        10,
        11
      ],
      "mark_cell": [
        13,
        14,
        15
      ],
      "explore": [
        17,
        18,
        19,
        20,
        21
      ],
      "restore": [
        23,
        24
      ],
      "return_found": [
        26
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "all_matched": [
        7
      ],
      "cell_invalid": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public boolean exist(char[][] board, String word) {\n        int m = board.length, n = board[0].length;\n\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (backtrack(board, word, i, j, 0)) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n\n    private boolean backtrack(char[][] board, String word, int i, int j, int index) {\n        // All characters matched\n        if (index == word.length()) {\n            return true;\n        }\n        // Boundary check, visited check, and character match check\n        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length\n                || board[i][j] != word.charAt(index)) {\n            return false;\n        }\n\n        // Mark as visited by replacing with a sentinel character\n        char temp = board[i][j];\n        board[i][j] = '#';\n\n        // Explore all four directions\n        boolean found = backtrack(board, word, i + 1, j, index + 1)\n                      || backtrack(board, word, i - 1, j, index + 1)\n                      || backtrack(board, word, i, j + 1, index + 1)\n                      || backtrack(board, word, i, j - 1, index + 1);\n\n        // Restore the original character (backtrack)\n        board[i][j] = temp;\n\n        return found;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "try_start": [
        5,
        6,
        7
      ],
      "check_matched": [
        16,
        17,
        18,
        19
      ],
      "check_cell": [
        20,
        21,
        22,
        23,
        24
      ],
      "mark_cell": [
        26,
        27,
        28
      ],
      "explore": [
        30,
        31,
        32,
        33,
        34
      ],
      "restore": [
        36,
        37
      ],
      "return_found": [
        39
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "all_matched": [
        17
      ],
      "cell_invalid": [
        21
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        int m = board.size(), n = board[0].size();\n\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (backtrack(board, word, i, j, 0)) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n\nprivate:\n    bool backtrack(vector<vector<char>>& board, string& word, int i, int j, int index) {\n        // All characters matched\n        if (index == (int)word.length()) {\n            return true;\n        }\n        // Boundary check, visited check, and character match check\n        if (i < 0 || i >= (int)board.size() || j < 0 || j >= (int)board[0].size()\n                || board[i][j] != word[index]) {\n            return false;\n        }\n\n        // Mark as visited by replacing with a sentinel character\n        char temp = board[i][j];\n        board[i][j] = '#';\n\n        // Explore all four directions\n        bool found = backtrack(board, word, i + 1, j, index + 1)\n                   || backtrack(board, word, i - 1, j, index + 1)\n                   || backtrack(board, word, i, j + 1, index + 1)\n                   || backtrack(board, word, i, j - 1, index + 1);\n\n        // Restore the original character (backtrack)\n        board[i][j] = temp;\n\n        return found;\n    }\n};",
    "lineMap": {
      "-": [
        3
      ],
      "init": [
        4
      ],
      "try_start": [
        6,
        7,
        8
      ],
      "check_matched": [
        18,
        19,
        20,
        21
      ],
      "check_cell": [
        22,
        23,
        24,
        25,
        26
      ],
      "mark_cell": [
        28,
        29,
        30
      ],
      "explore": [
        32,
        33,
        34,
        35,
        36
      ],
      "restore": [
        38,
        39
      ],
      "return_found": [
        41
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "all_matched": [
        19
      ],
      "cell_invalid": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public bool Exist(char[][] board, string word) {\n        int m = board.Length, n = board[0].Length;\n\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (Backtrack(board, word, i, j, 0)) {\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n\n    private bool Backtrack(char[][] board, string word, int i, int j, int index) {\n        // All characters matched\n        if (index == word.Length) {\n            return true;\n        }\n        // Boundary check, visited check, and character match check\n        if (i < 0 || i >= board.Length || j < 0 || j >= board[0].Length\n                || board[i][j] != word[index]) {\n            return false;\n        }\n\n        // Mark as visited by replacing with a sentinel character\n        char temp = board[i][j];\n        board[i][j] = '#';\n\n        // Explore all four directions\n        bool found = Backtrack(board, word, i + 1, j, index + 1)\n                   || Backtrack(board, word, i - 1, j, index + 1)\n                   || Backtrack(board, word, i, j + 1, index + 1)\n                   || Backtrack(board, word, i, j - 1, index + 1);\n\n        // Restore the original character (backtrack)\n        board[i][j] = temp;\n\n        return found;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "init": [
        3
      ],
      "try_start": [
        5,
        6,
        7
      ],
      "check_matched": [
        16,
        17,
        18,
        19
      ],
      "check_cell": [
        20,
        21,
        22,
        23,
        24
      ],
      "mark_cell": [
        26,
        27,
        28
      ],
      "explore": [
        30,
        31,
        32,
        33,
        34
      ],
      "restore": [
        36,
        37
      ],
      "return_found": [
        39
      ],
      "complete": [
        12
      ]
    },
    "conditionalMap": {
      "all_matched": [
        17
      ],
      "cell_invalid": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func exist(board [][]byte, word string) bool {\n    m, n := len(board), len(board[0])\n\n    var backtrack func(i, j, index int) bool\n    backtrack = func(i, j, index int) bool {\n        // All characters matched\n        if index == len(word) {\n            return true\n        }\n        // Boundary check, visited check, and character match check\n        if i < 0 || i >= m || j < 0 || j >= n || board[i][j] != word[index] {\n            return false\n        }\n\n        // Mark as visited by replacing with a sentinel character\n        temp := board[i][j]\n        board[i][j] = '#'\n\n        // Explore all four directions\n        found := backtrack(i+1, j, index+1) ||\n                 backtrack(i-1, j, index+1) ||\n                 backtrack(i, j+1, index+1) ||\n                 backtrack(i, j-1, index+1)\n\n        // Restore the original character (backtrack)\n        board[i][j] = temp\n\n        return found\n    }\n\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            if backtrack(i, j, 0) {\n                return true\n            }\n        }\n    }\n    return false\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "try_start": [
        31,
        32,
        33
      ],
      "check_matched": [
        6,
        7,
        8,
        9
      ],
      "check_cell": [
        10,
        11,
        12,
        13
      ],
      "mark_cell": [
        15,
        16,
        17
      ],
      "explore": [
        19,
        20,
        21,
        22,
        23
      ],
      "restore": [
        25,
        26
      ],
      "return_found": [
        28
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "all_matched": [
        7
      ],
      "cell_invalid": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var exist = function (board, word) {\n  const m = board.length,\n    n = board[0].length;\n\n  const backtrack = (i, j, index) => {\n    // All characters matched\n    if (index === word.length) {\n      return true;\n    }\n    // Boundary check, visited check, and character match check\n    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[index]) {\n      return false;\n    }\n\n    // Mark as visited by replacing with a sentinel character\n    const temp = board[i][j];\n    board[i][j] = \"#\";\n\n    // Explore all four directions\n    const found =\n      backtrack(i + 1, j, index + 1) ||\n      backtrack(i - 1, j, index + 1) ||\n      backtrack(i, j + 1, index + 1) ||\n      backtrack(i, j - 1, index + 1);\n\n    // Restore the original character (backtrack)\n    board[i][j] = temp;\n\n    return found;\n  };\n\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (backtrack(i, j, 0)) {\n        return true;\n      }\n    }\n  }\n  return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "try_start": [
        32,
        33,
        34
      ],
      "check_matched": [
        6,
        7,
        8,
        9
      ],
      "check_cell": [
        10,
        11,
        12,
        13
      ],
      "mark_cell": [
        15,
        16,
        17
      ],
      "explore": [
        19,
        20,
        21,
        22,
        23,
        24
      ],
      "restore": [
        26,
        27
      ],
      "return_found": [
        29
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "all_matched": [
        7
      ],
      "cell_invalid": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function exist(board: string[][], word: string): boolean {\n    const m = board.length, n = board[0].length;\n\n    const backtrack = (i: number, j: number, index: number): boolean => {\n        // All characters matched\n        if (index === word.length) {\n            return true;\n        }\n        // Boundary check, visited check, and character match check\n        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[index]) {\n            return false;\n        }\n\n        // Mark as visited by replacing with a sentinel character\n        const temp = board[i][j];\n        board[i][j] = '#';\n\n        // Explore all four directions\n        const found = backtrack(i + 1, j, index + 1)\n                    || backtrack(i - 1, j, index + 1)\n                    || backtrack(i, j + 1, index + 1)\n                    || backtrack(i, j - 1, index + 1);\n\n        // Restore the original character (backtrack)\n        board[i][j] = temp;\n\n        return found;\n    };\n\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            if (backtrack(i, j, 0)) {\n                return true;\n            }\n        }\n    }\n    return false;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "try_start": [
        30,
        31,
        32
      ],
      "check_matched": [
        5,
        6,
        7,
        8
      ],
      "check_cell": [
        9,
        10,
        11,
        12
      ],
      "mark_cell": [
        14,
        15,
        16
      ],
      "explore": [
        18,
        19,
        20,
        21,
        22
      ],
      "restore": [
        24,
        25
      ],
      "return_found": [
        27
      ],
      "complete": [
        37
      ]
    },
    "conditionalMap": {
      "all_matched": [
        6
      ],
      "cell_invalid": [
        10
      ]
    }
  }
};

const WordSearchPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1",
    "value": {
      "board": [
        [
          "A",
          "B",
          "C",
          "E"
        ],
        [
          "S",
          "F",
          "C",
          "S"
        ],
        [
          "A",
          "D",
          "E",
          "E"
        ]
      ],
      "word": "ABCCED"
    }
  },
  {
    "id": "ex2",
    "label": "Example 2",
    "value": {
      "board": [
        [
          "A",
          "B",
          "C",
          "E"
        ],
        [
          "S",
          "F",
          "C",
          "S"
        ],
        [
          "A",
          "D",
          "E",
          "E"
        ]
      ],
      "word": "SEE"
    }
  },
  {
    "id": "ex3",
    "label": "Not Found",
    "value": {
      "board": [
        [
          "A",
          "B",
          "C",
          "E"
        ],
        [
          "S",
          "F",
          "C",
          "S"
        ],
        [
          "A",
          "D",
          "E",
          "E"
        ]
      ],
      "word": "ABCB"
    }
  },
  {
    "id": "ex4",
    "label": "Small Grid",
    "value": {
      "board": [
        [
          "A",
          "B"
        ],
        [
          "C",
          "D"
        ]
      ],
      "word": "ABDC"
    }
  }
];

function generateWordSearchSteps(e: any): any[] {
  
let r=(e.board||[]).map(e=>[...e]),t=e.word||"",i=r.length,o=i>0?r[0].length:0,n=r.map(e=>[...e]),d={};for(let e=0;e<i;e++)for(let t=0;t<o;t++)d[`cell_${e}_${t}`]={type:"matrixElement",value:r[e][t],row:e,col:t};for(let e=0;e<t.length;e++)d[`word_${e}`]={type:"arrayElement",value:t[e],position:e};let c=new StepRecorder({word:t,found:!1},d);c.update_variable("mode","backtrack"),c.record("-",`Search the ${i}x${o} board for "${t}"`),c.update_variable("m",i),c.update_variable("n",o),c.record("init",`The board is ${i} rows by ${o} columns`);let l=(e,r,t)=>{c.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:n[e][r],row:e,col:r,...t?{state:t}:{}})},s=(e,r)=>{c.update_visual(`word_${e}`,{type:"arrayElement",value:t[e],position:e,...r?{state:r}:{}})},h=(e,a,n)=>{let d=n===t.length;if(c.update_variable("i",e),c.update_variable("j",a),c.update_variable("index",n),c.add_conditional("all_matched",d),c.record("check_matched",d?`index ${n} has reached the end of "${t}", every character matched`:`index ${n} still needs '${t[n]}'`),d)return!0;let u=e<0||e>=i||a<0||a>=o,b=u||r[e][a]!==t[n];if(u||l(e,a,"active"),c.add_conditional("cell_invalid",b),c.record("check_cell",u?`(${e}, ${a}) falls off the board, so this path ends`:r[e][a]!==t[n]?`(${e}, ${a}) holds '${r[e][a]}', not the '${t[n]}' this path needs`:`(${e}, ${a}) holds '${r[e][a]}', which matches word[${n}]`),b)return u||l(e,a,void 0),!1;let f=r[e][a];r[e][a]="#",l(e,a,"matched"),s(n,"matched"),c.update_variable("temp",f),c.record("mark_cell",`Take (${e}, ${a}) onto the path and blank it out so it cannot be reused`),c.delete_variable("temp"),c.record("explore",`From (${e}, ${a}), try down, up, right then left for word[${n+1}]`);let p=h(e+1,a,n+1)||h(e-1,a,n+1)||h(e,a+1,n+1)||h(e,a-1,n+1);return r[e][a]=f,c.update_variable("i",e),c.update_variable("j",a),c.update_variable("index",n),l(e,a,p?"matched":"backtrack"),p||s(n,void 0),c.record("restore",p?`(${e}, ${a}) stays on the winning path, put '${f}' back`:`No direction from (${e}, ${a}) worked, put '${f}' back and give the cell up`),p||l(e,a,void 0),c.update_variable("found",p),c.record("return_found",p?`(${e}, ${a}) reports success back to its caller`:`(${e}, ${a}) reports failure back to its caller`),p},u=!1;for(let e=0;e<i&&!u;e++)for(let r=0;r<o&&!u;r++)c.update_variable("i",e),c.update_variable("j",r),c.delete_variable("index"),c.record("try_start",`Try (${e}, ${r}) as the first letter of "${t}"`),u=h(e,r,0);return c.delete_variable("i"),c.delete_variable("j"),c.delete_variable("index"),c.update_variable("found",u),c.add_new_variable("result",u),c.record("complete",u?`"${t}" is on the board`:`"${t}" is not on the board`),c.getSteps()
}

export function WordSearchProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: WordSearchTemplates,
      generateSteps: (e: any) => {
        const recorded = generateWordSearchSteps(e) as any[];
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
      title="Word Search"
      slug="word-search"
      approaches={approaches}
      presets={WordSearchPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Word Squares (word-squares)
// ==========================================

const WordSquaresTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def wordSquares(self, words: List[str]) -> List[List[str]]:\n        length = len(words[0])\n        result = []\n\n        # Build trie using nested dictionaries\n        trie = {\"children\": {}, \"indices\": list(range(len(words)))}\n        for idx, word in enumerate(words):\n            node = trie\n            for ch in word:\n                if ch not in node[\"children\"]:\n                    node[\"children\"][ch] = {\"children\": {}, \"indices\": []}\n                node = node[\"children\"][ch]\n                node[\"indices\"].append(idx)\n\n        def get_candidates(prefix):\n            \"\"\"Walk trie to find all word indices matching prefix.\"\"\"\n            node = trie\n            for ch in prefix:\n                if ch not in node[\"children\"]:\n                    return []\n                node = node[\"children\"][ch]\n            return node[\"indices\"]\n\n        def backtrack(square):\n            if len(square) == length:\n                result.append(square[:])\n                return\n\n            row = len(square)\n            prefix = \"\".join(square[i][row] for i in range(row))\n\n            for idx in get_candidates(prefix):\n                square.append(words[idx])\n                backtrack(square)\n                square.pop()\n\n        for word in words:\n            backtrack([word])\n\n        return result",
    "lineMap": {
      "-": [
        3,
        4,
        7
      ],
      "insert_word": [
        8,
        9
      ],
      "create_node": [
        11,
        12,
        13
      ],
      "insert_char": [
        13,
        14
      ],
      "start_backtrack": [
        38
      ],
      "start_word": [
        39
      ],
      "compute_prefix": [
        30,
        31
      ],
      "follow_prefix": [
        18,
        19,
        22,
        23
      ],
      "prefix_fail": [
        20,
        21
      ],
      "try_candidate": [
        33
      ],
      "place_word": [
        34
      ],
      "square_complete": [
        26,
        27,
        28
      ],
      "backtrack_remove": [
        36
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "char_missing": [
        11
      ],
      "prefix_missing": [
        20
      ],
      "is_square_complete": [
        26
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    private int[][] trie;\n    private List<Integer>[] wordIndices;\n    private int trieSize;\n\n    public List<List<String>> wordSquares(String[] words) {\n        int len = words[0].length();\n        int maxNodes = words.length * len + 1;\n        trie = new int[maxNodes][26];\n        wordIndices = new List[maxNodes];\n        for (int i = 0; i < maxNodes; i++) {\n            wordIndices[i] = new ArrayList<>();\n            for (int j = 0; j < 26; j++) trie[i][j] = -1;\n        }\n        trieSize = 1;\n\n        // Build trie\n        for (int idx = 0; idx < words.length; idx++) {\n            int node = 0;\n            wordIndices[0].add(idx);\n            for (char c : words[idx].toCharArray()) {\n                int ci = c - 'a';\n                if (trie[node][ci] == -1) {\n                    trie[node][ci] = trieSize++;\n                }\n                node = trie[node][ci];\n                wordIndices[node].add(idx);\n            }\n        }\n\n        List<List<String>> result = new ArrayList<>();\n        List<String> square = new ArrayList<>();\n        for (String word : words) {\n            square.add(word);\n            backtrack(square, len, words, result);\n            square.remove(square.size() - 1);\n        }\n        return result;\n    }\n\n    private void backtrack(List<String> square, int len, String[] words, List<List<String>> result) {\n        if (square.size() == len) {\n            result.add(new ArrayList<>(square));\n            return;\n        }\n\n        int row = square.size();\n        // Walk the trie following the prefix derived from columns\n        int node = 0;\n        for (int i = 0; i < row; i++) {\n            int ci = square.get(i).charAt(row) - 'a';\n            if (trie[node][ci] == -1) return;\n            node = trie[node][ci];\n        }\n\n        for (int idx : wordIndices[node]) {\n            square.add(words[idx]);\n            backtrack(square, len, words, result);\n            square.remove(square.size() - 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        10
      ],
      "insert_word": [
        18,
        19,
        20
      ],
      "create_node": [
        23,
        24,
        26
      ],
      "insert_char": [
        26,
        27
      ],
      "start_backtrack": [
        33
      ],
      "start_word": [
        34,
        35
      ],
      "compute_prefix": [
        47,
        50,
        51
      ],
      "follow_prefix": [
        53,
        56
      ],
      "prefix_fail": [
        52
      ],
      "try_candidate": [
        56
      ],
      "place_word": [
        57
      ],
      "square_complete": [
        42,
        43,
        44
      ],
      "backtrack_remove": [
        59
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "char_missing": [
        23
      ],
      "prefix_missing": [
        52
      ],
      "is_square_complete": [
        42
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\n    struct TrieNode {\n        int children[26];\n        vector<int> indices;\n        TrieNode() {\n            fill(children, children + 26, -1);\n        }\n    };\n\n    vector<TrieNode> nodes;\n\npublic:\n    vector<vector<string>> wordSquares(vector<string>& words) {\n        int len = words[0].size();\n\n        // Build trie\n        nodes.push_back(TrieNode());\n        for (int idx = 0; idx < words.size(); idx++) {\n            int node = 0;\n            nodes[0].indices.push_back(idx);\n            for (char c : words[idx]) {\n                int ci = c - 'a';\n                if (nodes[node].children[ci] == -1) {\n                    nodes[node].children[ci] = nodes.size();\n                    nodes.push_back(TrieNode());\n                }\n                node = nodes[node].children[ci];\n                nodes[node].indices.push_back(idx);\n            }\n        }\n\n        vector<vector<string>> result;\n        vector<string> square;\n        for (auto& word : words) {\n            square.push_back(word);\n            backtrack(square, len, words, result);\n            square.pop_back();\n        }\n        return result;\n    }\n\nprivate:\n    void backtrack(vector<string>& square, int len, vector<string>& words, vector<vector<string>>& result) {\n        if (square.size() == len) {\n            result.push_back(square);\n            return;\n        }\n\n        int row = square.size();\n        int node = 0;\n        for (int i = 0; i < row; i++) {\n            int ci = square[i][row] - 'a';\n            if (nodes[node].children[ci] == -1) return;\n            node = nodes[node].children[ci];\n        }\n\n        for (int idx : nodes[node].indices) {\n            square.push_back(words[idx]);\n            backtrack(square, len, words, result);\n            square.pop_back();\n        }\n    }\n};",
    "lineMap": {
      "-": [
        13,
        14,
        17
      ],
      "insert_word": [
        18,
        19,
        20
      ],
      "create_node": [
        23,
        24,
        25,
        27
      ],
      "insert_char": [
        27,
        28
      ],
      "start_backtrack": [
        34
      ],
      "start_word": [
        35,
        36
      ],
      "compute_prefix": [
        49,
        51,
        52
      ],
      "follow_prefix": [
        54,
        57
      ],
      "prefix_fail": [
        53
      ],
      "try_candidate": [
        57
      ],
      "place_word": [
        58
      ],
      "square_complete": [
        44,
        45,
        46
      ],
      "backtrack_remove": [
        60
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "char_missing": [
        23
      ],
      "prefix_missing": [
        53
      ],
      "is_square_complete": [
        44
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    private int[][] trie;\n    private List<int>[] wordIndices;\n    private int trieSize;\n\n    public IList<IList<string>> WordSquares(string[] words) {\n        int len = words[0].Length;\n        int maxNodes = words.Length * len + 1;\n        trie = new int[maxNodes][];\n        wordIndices = new List<int>[maxNodes];\n        for (int i = 0; i < maxNodes; i++) {\n            trie[i] = new int[26];\n            Array.Fill(trie[i], -1);\n            wordIndices[i] = new List<int>();\n        }\n        trieSize = 1;\n\n        // Build trie\n        for (int idx = 0; idx < words.Length; idx++) {\n            int node = 0;\n            wordIndices[0].Add(idx);\n            foreach (char c in words[idx]) {\n                int ci = c - 'a';\n                if (trie[node][ci] == -1) {\n                    trie[node][ci] = trieSize++;\n                }\n                node = trie[node][ci];\n                wordIndices[node].Add(idx);\n            }\n        }\n\n        IList<IList<string>> result = new List<IList<string>>();\n        List<string> square = new List<string>();\n        foreach (string word in words) {\n            square.Add(word);\n            Backtrack(square, len, words, result);\n            square.RemoveAt(square.Count - 1);\n        }\n        return result;\n    }\n\n    private void Backtrack(List<string> square, int len, string[] words, IList<IList<string>> result) {\n        if (square.Count == len) {\n            result.Add(new List<string>(square));\n            return;\n        }\n\n        int row = square.Count;\n        int node = 0;\n        for (int i = 0; i < row; i++) {\n            int ci = square[i][row] - 'a';\n            if (trie[node][ci] == -1) return;\n            node = trie[node][ci];\n        }\n\n        foreach (int idx in wordIndices[node]) {\n            square.Add(words[idx]);\n            Backtrack(square, len, words, result);\n            square.RemoveAt(square.Count - 1);\n        }\n    }\n}",
    "lineMap": {
      "-": [
        7,
        8,
        9,
        16
      ],
      "insert_word": [
        19,
        20,
        21
      ],
      "create_node": [
        24,
        25,
        27
      ],
      "insert_char": [
        27,
        28
      ],
      "start_backtrack": [
        34
      ],
      "start_word": [
        35,
        36
      ],
      "compute_prefix": [
        48,
        50,
        51
      ],
      "follow_prefix": [
        53,
        56
      ],
      "prefix_fail": [
        52
      ],
      "try_candidate": [
        56
      ],
      "place_word": [
        57
      ],
      "square_complete": [
        43,
        44,
        45
      ],
      "backtrack_remove": [
        59
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "char_missing": [
        24
      ],
      "prefix_missing": [
        52
      ],
      "is_square_complete": [
        43
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type trieNode struct {\n    children [26]int\n    indices  []int\n}\n\nfunc wordSquares(words []string) [][]string {\n    length := len(words[0])\n\n    // Build trie\n    nodes := []trieNode{{}}\n    for i := range nodes[0].children {\n        nodes[0].children[i] = -1\n    }\n\n    for idx, word := range words {\n        node := 0\n        nodes[0].indices = append(nodes[0].indices, idx)\n        for _, c := range word {\n            ci := int(c - 'a')\n            if nodes[node].children[ci] == -1 {\n                nodes[node].children[ci] = len(nodes)\n                newNode := trieNode{}\n                for i := range newNode.children {\n                    newNode.children[i] = -1\n                }\n                nodes = append(nodes, newNode)\n            }\n            node = nodes[node].children[ci]\n            nodes[node].indices = append(nodes[node].indices, idx)\n        }\n    }\n\n    result := [][]string{}\n\n    var backtrack func(square []string)\n    backtrack = func(square []string) {\n        if len(square) == length {\n            combo := make([]string, len(square))\n            copy(combo, square)\n            result = append(result, combo)\n            return\n        }\n\n        row := len(square)\n        node := 0\n        for i := 0; i < row; i++ {\n            ci := int(square[i][row] - 'a')\n            if nodes[node].children[ci] == -1 {\n                return\n            }\n            node = nodes[node].children[ci]\n        }\n\n        for _, idx := range nodes[node].indices {\n            square = append(square, words[idx])\n            backtrack(square)\n            square = square[:len(square)-1]\n        }\n    }\n\n    for _, word := range words {\n        backtrack([]string{word})\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        7,
        10
      ],
      "insert_word": [
        15,
        16,
        17
      ],
      "create_node": [
        20,
        21,
        26,
        28
      ],
      "insert_char": [
        28,
        29
      ],
      "start_backtrack": [
        61
      ],
      "start_word": [
        62
      ],
      "compute_prefix": [
        44,
        45,
        46,
        47
      ],
      "follow_prefix": [
        51,
        54
      ],
      "prefix_fail": [
        48,
        49
      ],
      "try_candidate": [
        54
      ],
      "place_word": [
        55
      ],
      "square_complete": [
        37,
        38,
        39,
        40
      ],
      "backtrack_remove": [
        57
      ],
      "complete": [
        64
      ]
    },
    "conditionalMap": {
      "char_missing": [
        20
      ],
      "prefix_missing": [
        48
      ],
      "is_square_complete": [
        37
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var wordSquares = function (words) {\n  const len = words[0].length;\n  const result = [];\n\n  // Build trie as array of objects\n  const nodes = [{ children: new Array(26).fill(-1), indices: [] }];\n\n  for (let idx = 0; idx < words.length; idx++) {\n    let node = 0;\n    nodes[0].indices.push(idx);\n    for (const ch of words[idx]) {\n      const ci = ch.charCodeAt(0) - 97;\n      if (nodes[node].children[ci] === -1) {\n        nodes[node].children[ci] = nodes.length;\n        nodes.push({ children: new Array(26).fill(-1), indices: [] });\n      }\n      node = nodes[node].children[ci];\n      nodes[node].indices.push(idx);\n    }\n  }\n\n  const backtrack = (square) => {\n    if (square.length === len) {\n      result.push([...square]);\n      return;\n    }\n\n    const row = square.length;\n    let node = 0;\n    for (let i = 0; i < row; i++) {\n      const ci = square[i].charCodeAt(row) - 97;\n      if (nodes[node].children[ci] === -1) return;\n      node = nodes[node].children[ci];\n    }\n\n    for (const idx of nodes[node].indices) {\n      square.push(words[idx]);\n      backtrack(square);\n      square.pop();\n    }\n  };\n\n  for (const word of words) {\n    backtrack([word]);\n  }\n  return result;\n};",
    "lineMap": {
      "-": [
        2,
        3,
        6
      ],
      "insert_word": [
        8,
        9,
        10
      ],
      "create_node": [
        13,
        14,
        15,
        17
      ],
      "insert_char": [
        17,
        18
      ],
      "start_backtrack": [
        43
      ],
      "start_word": [
        44
      ],
      "compute_prefix": [
        28,
        29,
        30,
        31
      ],
      "follow_prefix": [
        33,
        36
      ],
      "prefix_fail": [
        32
      ],
      "try_candidate": [
        36
      ],
      "place_word": [
        37
      ],
      "square_complete": [
        23,
        24,
        25
      ],
      "backtrack_remove": [
        39
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "char_missing": [
        13
      ],
      "prefix_missing": [
        32
      ],
      "is_square_complete": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function wordSquares(words: string[]): string[][] {\n    const len: number = words[0].length;\n    const result: string[][] = [];\n\n    // Build trie as array of objects\n    const nodes: { children: number[]; indices: number[] }[] = [\n        { children: new Array(26).fill(-1), indices: [] }\n    ];\n\n    for (let idx = 0; idx < words.length; idx++) {\n        let node = 0;\n        nodes[0].indices.push(idx);\n        for (const ch of words[idx]) {\n            const ci = ch.charCodeAt(0) - 97;\n            if (nodes[node].children[ci] === -1) {\n                nodes[node].children[ci] = nodes.length;\n                nodes.push({ children: new Array(26).fill(-1), indices: [] });\n            }\n            node = nodes[node].children[ci];\n            nodes[node].indices.push(idx);\n        }\n    }\n\n    const backtrack = (square: string[]): void => {\n        if (square.length === len) {\n            result.push([...square]);\n            return;\n        }\n\n        const row = square.length;\n        let node = 0;\n        for (let i = 0; i < row; i++) {\n            const ci = square[i].charCodeAt(row) - 97;\n            if (nodes[node].children[ci] === -1) return;\n            node = nodes[node].children[ci];\n        }\n\n        for (const idx of nodes[node].indices) {\n            square.push(words[idx]);\n            backtrack(square);\n            square.pop();\n        }\n    };\n\n    for (const word of words) {\n        backtrack([word]);\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        2,
        3,
        6
      ],
      "insert_word": [
        10,
        11,
        12
      ],
      "create_node": [
        15,
        16,
        17,
        19
      ],
      "insert_char": [
        19,
        20
      ],
      "start_backtrack": [
        45
      ],
      "start_word": [
        46
      ],
      "compute_prefix": [
        30,
        31,
        32,
        33
      ],
      "follow_prefix": [
        35,
        38
      ],
      "prefix_fail": [
        34
      ],
      "try_candidate": [
        38
      ],
      "place_word": [
        39
      ],
      "square_complete": [
        25,
        26,
        27
      ],
      "backtrack_remove": [
        41
      ],
      "complete": [
        48
      ]
    },
    "conditionalMap": {
      "char_missing": [
        15
      ],
      "prefix_missing": [
        34
      ],
      "is_square_complete": [
        25
      ]
    }
  }
};

const WordSquaresPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Example 1: [\"area\",\"lead\",\"wall\",\"lady\",\"ball\"]",
    "value": {
      "words": [
        "area",
        "lead",
        "wall",
        "lady",
        "ball"
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Example 2: [\"abat\",\"baba\",\"atan\",\"atal\"]",
    "value": {
      "words": [
        "abat",
        "baba",
        "atan",
        "atal"
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Example 3: [\"ab\",\"ba\"]",
    "value": {
      "words": [
        "ab",
        "ba"
      ]
    }
  }
];

function generateWordSquaresSteps(e: any): any[] {
  
let r=e.words||[],t=new RecursiveStepRecorder({},{});if(0===r.length)return t.record("-","Start: No words provided"),t.record("complete","Done: No words to form squares"),t.getSteps();let i=r[0].length;t.add_new_visual("meta_result_count",{type:"metadata",value:0}),t.add_new_visual("meta_phase",{type:"metadata",value:"Build Trie"}),t.add_new_visual("meta_prefix",{type:"metadata",value:""}),t.add_new_visual("meta_candidates",{type:"metadata",value:""});for(let e=0;e<i;e++)for(let r=0;r<i;r++)t.add_new_visual(`cell_${e}_${r}`,{type:"matrixElement",value:"",row:e,col:r,state:"default"});t.update_global_variable("words",r),t.update_global_variable("squaresFound",0),t.record("-",`Start: Build word squares from [${r.join(", ")}]`);let s={children:new Map,wordIndices:[],key:"trie_root"};t.add_new_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"});let o=0,n=new Map;n.set("","trie_root");for(let e=0;e<r.length;e++){let a=r[e],i=s;i.wordIndices.push(e);let l="";t.update_visual("meta_phase",{type:"metadata",value:"Build Trie"}),t.record("insert_word",`Insert word "${a}" (index ${e}) into trie`);for(let r=0;r<a.length;r++){let s=a[r],d=l+s;if(i.children.has(s))t.add_conditional("char_missing",!1),t.record("insert_char",`Traverse to existing node '${s}'`);else{o++;let e=`trie_${o}`,r={children:new Map,wordIndices:[],key:e};i.children.set(s,r),n.set(d,e);let a=n.get(l);t.add_new_visual(e,{type:"trieNode",char:s,isEndOfWord:!1,parent:a,edgeLabel:s,state:"highlight"}),t.add_conditional("char_missing",!0),t.record("create_node",`Create trie node for '${s}' (path: "${d}")`),t.update_visual(e,{type:"trieNode",char:s,isEndOfWord:!1,parent:a,edgeLabel:s,state:"standard"})}(i=i.children.get(s)).wordIndices.push(e),l=d}}t.update_visual("meta_phase",{type:"metadata",value:"Backtrack"});let l=[],d=[];function c(){for(let e=0;e<i;e++)for(let r=0;r<i;r++)t.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:"",row:e,col:r,state:"default"})}function u(e){for(let r=0;r<i;r++)for(let a=0;a<i;a++){let i=r<d.length?d[r][a]:"",s="default";r<d.length&&(s=r===e?"active":"visited"),t.update_visual(`cell_${r}_${a}`,{type:"matrixElement",value:i,row:r,col:a,state:s})}}function p(){t.update_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"standard"});for(let e=1;e<=o;e++){let r=`trie_${e}`,a=t.get_visual(r);a&&t.update_visual(r,{...a,state:"standard"})}}t.record("start_backtrack","Start backtracking to find word squares");for(let e=0;e<r.length;e++)d.push(r[e]),u(0),t.record("start_word",`Start a square with "${r[e]}" at row 0`),function e(){if(d.length===i){l.push([...d]),t.update_global_variable("squaresFound",l.length),t.update_visual("meta_result_count",{type:"metadata",value:l.length});for(let e=0;e<i;e++)for(let r=0;r<i;r++)t.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:d[e][r],row:e,col:r,state:"result"});t.add_conditional("is_square_complete",!0),t.record("square_complete",`Found word square #${l.length}: [${d.join(", ")}]`);return}let a=d.length;t.add_conditional("is_square_complete",!1),u();let o="";a>0&&(o=function(e){let r="";for(let a=0;a<e;a++)r+=d[a][e],t.update_visual(`cell_${a}_${e}`,{type:"matrixElement",value:d[a][e],row:a,col:e,state:"highlight"});return r}(a)),t.update_visual("meta_prefix",{type:"metadata",value:o||"(empty)"}),t.record("compute_prefix",`Row ${a}: Compute prefix = "${o}" from column ${a}`);var f=o;p();let h="";for(let e of(t.update_visual("trie_root",{type:"trieNode",char:"*",isEndOfWord:!1,state:"active"}),f)){h+=e;let r=n.get(h);if(r){let e=t.get_visual(r);t.update_visual(r,{...e,state:"active"})}}let m=function(e){let r=s;for(let t of e){if(!r.children.has(t))return[];r=r.children.get(t)}return r.wordIndices}(o);if(0===m.length){t.add_conditional("prefix_missing",!0),t.record("prefix_fail",`No words with prefix "${o}", backtrack`),t.update_visual("meta_candidates",{type:"metadata",value:""}),p();return}for(let s of(t.add_conditional("prefix_missing",!1),t.update_visual("meta_candidates",{type:"metadata",value:m.map(e=>r[e]).join(", ")}),t.record("follow_prefix",`Found ${m.length} word(s) with prefix "${o}": [${m.map(e=>r[e]).join(", ")}]`),m)){let o=r[s];d.push(o),u(a),t.update_visual("meta_prefix",{type:"metadata",value:""}),t.update_visual("meta_candidates",{type:"metadata",value:""}),t.record("try_candidate",`Try word "${o}" at row ${a}`);for(let e=0;e<i;e++)t.update_visual(`cell_${a}_${e}`,{type:"matrixElement",value:o[e],row:a,col:e,state:"active"});t.record("place_word",`Placed "${o}" at row ${a}`),e(),d.pop(),d.length>0?u():c(),p(),t.record("backtrack_remove",`Backtrack: removed "${o}" from row ${a}`)}}(),d.pop(),c(),p(),t.record("backtrack_remove",`Backtrack: removed "${r[e]}" from row 0`);return t.update_visual("meta_phase",{type:"metadata",value:"Complete"}),t.update_visual("meta_candidates",{type:"metadata",value:""}),t.record("complete",`Done! Found ${l.length} word square(s)`),t.getSteps()
}

export function WordSquaresProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: WordSquaresTemplates,
      generateSteps: (e: any) => {
        const recorded = generateWordSquaresSteps(e) as any[];
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
      title="Word Squares"
      slug="word-squares"
      approaches={approaches}
      presets={WordSquaresPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
