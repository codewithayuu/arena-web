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
      item.type === "graphNode" ||
      item.type === "dpCell" ||
      item.type === "treeNode"
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
// Range Sum Query - Mutable (range-sum-query-mutable)
// ==========================================

const RangeSumQueryMutableTemplates = {
  "python": {
    "language": "python",
    "code": "class NumArray:\n    def __init__(self, nums: list[int]):\n        self.nums = nums[:]\n        self.n = len(nums)\n        self.prefix = [0] * (self.n + 1)\n        for i in range(self.n):\n            self.prefix[i + 1] = self.prefix[i] + nums[i]\n\n    def update(self, index: int, val: int) -> None:\n        delta = val - self.nums[index]\n        self.nums[index] = val\n        # Update all prefix sums from index+1 onward\n        for i in range(index + 1, self.n + 1):\n            self.prefix[i] += delta\n\n    def sumRange(self, left: int, right: int) -> int:\n        return self.prefix[right + 1] - self.prefix[left]",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        4,
        5
      ],
      "build_prefix": [
        6,
        7
      ],
      "update_start": [
        9
      ],
      "update_delta": [
        10,
        11
      ],
      "update_rebuild": [
        13,
        14
      ],
      "query_start": [
        16
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class NumArray {\n    private int[] nums;\n    private int[] prefix;\n\n    public NumArray(int[] nums) {\n        this.nums = nums;\n        int n = nums.length;\n        prefix = new int[n + 1];\n        for (int i = 0; i < n; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    public void update(int index, int val) {\n        int delta = val - nums[index];\n        nums[index] = val;\n        // Update all prefix sums from index+1 onward\n        for (int i = index + 1; i < prefix.length; i++) {\n            prefix[i] += delta;\n        }\n    }\n\n    public int sumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        7,
        8
      ],
      "build_prefix": [
        9,
        10
      ],
      "update_start": [
        14
      ],
      "update_delta": [
        15,
        16
      ],
      "update_rebuild": [
        18,
        19
      ],
      "query_start": [
        23
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class NumArray {\n    vector<int> nums;\n    vector<int> prefix;\n\npublic:\n    NumArray(vector<int>& nums) : nums(nums) {\n        int n = nums.size();\n        prefix.resize(n + 1, 0);\n        for (int i = 0; i < n; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    void update(int index, int val) {\n        int delta = val - nums[index];\n        nums[index] = val;\n        // Update all prefix sums from index+1 onward\n        for (int i = index + 1; i < (int)prefix.size(); i++) {\n            prefix[i] += delta;\n        }\n    }\n\n    int sumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        7,
        8
      ],
      "build_prefix": [
        9,
        10
      ],
      "update_start": [
        14
      ],
      "update_delta": [
        15,
        16
      ],
      "update_rebuild": [
        18,
        19
      ],
      "query_start": [
        23
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class NumArray {\n    private int[] nums;\n    private int[] prefix;\n\n    public NumArray(int[] nums) {\n        this.nums = nums;\n        int n = nums.Length;\n        prefix = new int[n + 1];\n        for (int i = 0; i < n; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    public void Update(int index, int val) {\n        int delta = val - nums[index];\n        nums[index] = val;\n        // Update all prefix sums from index+1 onward\n        for (int i = index + 1; i < prefix.Length; i++) {\n            prefix[i] += delta;\n        }\n    }\n\n    public int SumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        7,
        8
      ],
      "build_prefix": [
        9,
        10
      ],
      "update_start": [
        14
      ],
      "update_delta": [
        15,
        16
      ],
      "update_rebuild": [
        18,
        19
      ],
      "query_start": [
        23
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type NumArray struct {\n    nums   []int\n    prefix []int\n}\n\nfunc Constructor(nums []int) NumArray {\n    n := len(nums)\n    prefix := make([]int, n+1)\n    for i := 0; i < n; i++ {\n        prefix[i+1] = prefix[i] + nums[i]\n    }\n    copyNums := make([]int, n)\n    copy(copyNums, nums)\n    return NumArray{nums: copyNums, prefix: prefix}\n}\n\nfunc (na *NumArray) Update(index int, val int) {\n    delta := val - na.nums[index]\n    na.nums[index] = val\n    // Update all prefix sums from index+1 onward\n    for i := index + 1; i < len(na.prefix); i++ {\n        na.prefix[i] += delta\n    }\n}\n\nfunc (na *NumArray) SumRange(left int, right int) int {\n    return na.prefix[right+1] - na.prefix[left]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        7,
        8
      ],
      "build_prefix": [
        9,
        10
      ],
      "update_start": [
        17
      ],
      "update_delta": [
        18,
        19
      ],
      "update_rebuild": [
        21,
        22
      ],
      "query_start": [
        26
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var NumArray = function(nums) {\n    this.nums = nums.slice();\n    var n = nums.length;\n    this.prefix = new Array(n + 1).fill(0);\n    for (var i = 0; i < n; i++) {\n        this.prefix[i + 1] = this.prefix[i] + nums[i];\n    }\n};\n\nNumArray.prototype.update = function(index, val) {\n    var delta = val - this.nums[index];\n    this.nums[index] = val;\n    // Update all prefix sums from index+1 onward\n    for (var i = index + 1; i < this.prefix.length; i++) {\n        this.prefix[i] += delta;\n    }\n};\n\nNumArray.prototype.sumRange = function(left, right) {\n    return this.prefix[right + 1] - this.prefix[left];\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        1,
        3,
        4
      ],
      "build_prefix": [
        5,
        6
      ],
      "update_start": [
        10
      ],
      "update_delta": [
        11,
        12
      ],
      "update_rebuild": [
        14,
        15
      ],
      "query_start": [
        19
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "class NumArray {\n    private nums: number[];\n    private prefix: number[];\n\n    constructor(nums: number[]) {\n        this.nums = nums.slice();\n        const n = nums.length;\n        this.prefix = new Array(n + 1).fill(0);\n        for (let i = 0; i < n; i++) {\n            this.prefix[i + 1] = this.prefix[i] + nums[i];\n        }\n    }\n\n    update(index: number, val: number): void {\n        const delta = val - this.nums[index];\n        this.nums[index] = val;\n        // Update all prefix sums from index+1 onward\n        for (let i = index + 1; i < this.prefix.length; i++) {\n            this.prefix[i] += delta;\n        }\n    }\n\n    sumRange(left: number, right: number): number {\n        return this.prefix[right + 1] - this.prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_prefix": [
        2,
        7,
        8
      ],
      "build_prefix": [
        9,
        10
      ],
      "update_start": [
        14
      ],
      "update_delta": [
        15,
        16
      ],
      "update_rebuild": [
        18,
        19
      ],
      "query_start": [
        23
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {}
  }
};

const RangeSumQueryMutablePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        1,
        3,
        5,
        7,
        9,
        11
      ],
      "operations": [
        {
          "type": "update",
          "index": 2,
          "val": 10
        },
        {
          "type": "sumRange",
          "left": 1,
          "right": 4
        }
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "nums": [
        2,
        4,
        6,
        8
      ],
      "operations": [
        {
          "type": "sumRange",
          "left": 0,
          "right": 3
        },
        {
          "type": "update",
          "index": 1,
          "val": 5
        }
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Update",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "operations": [
        {
          "type": "update",
          "index": 0,
          "val": 9
        }
      ]
    }
  }
];

function generateRangeSumQueryMutableSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],i=e.operations||[],r=t.length,a=i.map(e=>"update"===e.type?`update(${e.index}, ${e.val})`:`sumRange(${e.left}, ${e.right})`),l=(()=>{let e=Array(r+1).fill(0),n=Array(r).fill(0),a=(t,i)=>{for(let n=t+1;n<=r;n+=n&-n)e[n]+=i},l=t=>{let i=0;for(let n=t+1;n>0;n-=n&-n)i+=e[n];return i};for(let e=0;e<r;e++)a(e,t[e]-n[e]),n[e]=t[e];return i.map(e=>"update"===e.type?(a(e.index,e.val-n[e.index]),n[e.index]=e.val,null):l(e.right)-(e.left>0?l(e.left-1):0))})(),u=Array(r+1).fill(0),s=Array(r).fill(0),d={};for(let e=0;e<r;e++)d[`num_${e}`]={type:"arrayElement",value:0,position:e,label:`nums[${e}]`};for(let e=1;e<=r;e++)d[`bit_${e}`]={type:"arrayElement",value:0,position:e-1,label:`bit[${e}]`};let o=new StepRecorder({n:r,numsInit:[...t],ops:a,opResults:l,opIdx:-2,phase:"build"},d),p=(e,t,i=!1)=>o.update_visual(`bit_${e}`,{type:"arrayElement",value:u[e],position:e-1,label:`bit[${e}]`,state:i?"updated":t?"active":void 0});o.record("-","Fenwick tree: each cell stores a partial sum."),o.update_variable("phase","build"),o.update_variable("opIdx",-1),o.record("init_bit",`Initialize bit[] of size ${r+1} with zeros.`);for(let e=0;e<r;e++){let i=t[e],n=i-s[e];o.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:`nums[${e}]`,state:"active"}),o.update_variable("index",e),o.update_variable("val",i),o.update_variable("delta",n),o.update_variable("i",void 0),o.record("build_start",`Insert nums[${e}] = ${i} into the tree (delta = ${n}).`);let a=e+1;for(;a<=r;){let e=a&-a,t=a+e;o.update_visual("ptr_i",{type:"pointer",position:a-1,label:"i"}),o.update_variable("i",a),o.update_variable("lowbit",e),o.update_variable("nextI",t),u[a]+=n,p(a,!1,!0),o.record("build_propagate",`bit[${a}] += ${n} → ${u[a]}. Next: i += (${a} & -${a}) = ${t}.`),p(a,!1,!1),a=t}s[e]=i,o.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:`nums[${e}]`}),o.delete_visual("ptr_i")}o.update_variable("i",void 0),o.record("build_done",`Tree built for ${i.length} operation(s).`);for(let e=0;e<i.length;e++){let t=i[e];if(o.update_variable("opIdx",e),"update"===t.type&&void 0!==t.index&&void 0!==t.val){let e=t.index,i=t.val,n=s[e],a=i-n;o.update_variable("phase","update"),o.update_variable("index",e),o.update_variable("val",i),o.update_variable("oldVal",n),o.update_variable("delta",a),o.update_variable("i",void 0),o.update_visual(`num_${e}`,{type:"arrayElement",value:n,position:e,label:`nums[${e}]`,state:"active"}),o.record("update_start",`update(${e}, ${i}): change nums[${e}] from ${n} to ${i}.`),s[e]=i,o.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:`nums[${e}]`,state:"updated"}),o.record("update_delta",`delta = ${i} - ${n} = ${a}. Propagate delta up the tree.`);let l=e+1;for(;l<=r;){let e=l&-l,t=l+e;o.update_visual("ptr_i",{type:"pointer",position:l-1,label:"i"}),o.update_variable("i",l),o.update_variable("lowbit",e),o.update_variable("nextI",t),u[l]+=a,p(l,!1,!0),o.record("update_propagate",`bit[${l}] += ${a} → ${u[l]}. Next: i += (${l} & -${l}) = ${t}.`),p(l,!1,!1),l=t}o.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:`nums[${e}]`}),o.delete_visual("ptr_i"),o.update_variable("i",void 0)}else if("sumRange"===t.type&&void 0!==t.left&&void 0!==t.right){let e=t.left,i=t.right;o.update_variable("phase","query"),o.update_variable("left",e),o.update_variable("right",i),o.update_variable("rightSum",void 0),o.update_variable("leftSum",void 0),o.update_variable("result",void 0),o.update_variable("i",void 0);for(let t=e;t<=i;t++)o.update_visual(`num_${t}`,{type:"arrayElement",value:s[t],position:t,label:`nums[${t}]`,state:"queried"});o.record("query_start",`sumRange(${e}, ${i}) = prefix(${i}) - prefix(${e-1}).`);let n=0;o.update_variable("queryPhase","right"),o.update_variable("rightSum",0);let r=i+1;for(;r>0;){let e=r&-r,t=r-e;o.update_visual("ptr_i",{type:"pointer",position:r-1,label:"i"}),p(r,!0,!1),o.update_variable("i",r),o.update_variable("lowbit",e),o.update_variable("nextI",t),n+=u[r],o.update_variable("rightSum",n),o.record("query_accumulate",`prefix(${i}): sum += bit[${r}] = ${u[r]} → ${n}. Next: i -= (${r} & -${r}) = ${t}.`),p(r,!1,!1),r=t}o.delete_visual("ptr_i");let a=0;if(o.update_variable("leftSum",0),e>0){for(o.update_variable("queryPhase","left"),r=e;r>0;){let t=r&-r,i=r-t;o.update_visual("ptr_i",{type:"pointer",position:r-1,label:"i"}),p(r,!0,!1),o.update_variable("i",r),o.update_variable("lowbit",t),o.update_variable("nextI",i),a+=u[r],o.update_variable("leftSum",a),o.record("query_accumulate",`prefix(${e-1}): sum += bit[${r}] = ${u[r]} → ${a}. Next: i -= (${r} & -${r}) = ${i}.`),p(r,!1,!1),r=i}o.delete_visual("ptr_i")}let l=n-a;o.update_variable("queryPhase",void 0),o.update_variable("i",void 0),o.update_variable("result",l);for(let t=e;t<=i;t++)o.update_visual(`num_${t}`,{type:"arrayElement",value:s[t],position:t,label:`nums[${t}]`});o.record("query_done",`sumRange(${e}, ${i}) = ${n} - ${a} = ${l}.`)}}return o.update_variable("opIdx",i.length),o.update_variable("phase","done"),o.update_variable("i",void 0),o.record("complete","All operations processed."),o.getSteps()
  })(__inputArg);
}

export function RangeSumQueryMutableProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeSumQueryMutableTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeSumQueryMutableSteps(e) as any[];
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
      title="Range Sum Query - Mutable"
      slug="range-sum-query-mutable"
      approaches={approaches}
      presets={RangeSumQueryMutablePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Sum Query 2D - Mutable (range-sum-query-2d-mutable)
// ==========================================

const RangeSumQuery2dMutableTemplates = {
  "python": {
    "language": "python",
    "code": "class NumMatrix:\n    def __init__(self, matrix: list[list[int]]):\n        self.matrix = matrix\n\n    def update(self, row: int, col: int, val: int) -> None:\n        self.matrix[row][col] = val\n\n    def sumRegion(self, row1: int, col1: int, row2: int, col2: int) -> int:\n        total = 0\n        for r in range(row1, row2 + 1):\n            for c in range(col1, col2 + 1):\n                total += self.matrix[r][c]\n        return total",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "update_cell": [
        6
      ],
      "sum_start": [
        8,
        9
      ],
      "scan_cell": [
        10,
        11,
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {}
  },
  "java": {
    "language": "java",
    "code": "class NumMatrix {\n    private int[][] matrix;\n\n    public NumMatrix(int[][] matrix) {\n        this.matrix = matrix;\n    }\n\n    public void update(int row, int col, int val) {\n        matrix[row][col] = val;\n    }\n\n    public int sumRegion(int row1, int col1, int row2, int col2) {\n        int sum = 0;\n        for (int r = row1; r <= row2; r++) {\n            for (int c = col1; c <= col2; c++) {\n                sum += matrix[r][c];\n            }\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5
      ],
      "update_cell": [
        9
      ],
      "sum_start": [
        12,
        13
      ],
      "scan_cell": [
        14,
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  },
  "cpp": {
    "language": "cpp",
    "code": "class NumMatrix {\n    vector<vector<int>> matrix;\npublic:\n    NumMatrix(vector<vector<int>>& matrix) {\n        this->matrix = matrix;\n    }\n\n    void update(int row, int col, int val) {\n        matrix[row][col] = val;\n    }\n\n    int sumRegion(int row1, int col1, int row2, int col2) {\n        int sum = 0;\n        for (int r = row1; r <= row2; r++) {\n            for (int c = col1; c <= col2; c++) {\n                sum += matrix[r][c];\n            }\n        }\n        return sum;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5
      ],
      "update_cell": [
        9
      ],
      "sum_start": [
        12,
        13
      ],
      "scan_cell": [
        14,
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  },
  "csharp": {
    "language": "csharp",
    "code": "public class NumMatrix {\n    private int[][] matrix;\n\n    public NumMatrix(int[][] matrix) {\n        this.matrix = matrix;\n    }\n\n    public void Update(int row, int col, int val) {\n        matrix[row][col] = val;\n    }\n\n    public int SumRegion(int row1, int col1, int row2, int col2) {\n        int sum = 0;\n        for (int r = row1; r <= row2; r++) {\n            for (int c = col1; c <= col2; c++) {\n                sum += matrix[r][c];\n            }\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        5
      ],
      "update_cell": [
        9
      ],
      "sum_start": [
        12,
        13
      ],
      "scan_cell": [
        14,
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  },
  "go": {
    "language": "go",
    "code": "type NumMatrix struct {\n    matrix [][]int\n}\n\nfunc Constructor(matrix [][]int) NumMatrix {\n    return NumMatrix{matrix: matrix}\n}\n\nfunc (nm *NumMatrix) Update(row int, col int, val int) {\n    nm.matrix[row][col] = val\n}\n\nfunc (nm *NumMatrix) SumRegion(row1 int, col1 int, row2 int, col2 int) int {\n    sum := 0\n    for r := row1; r <= row2; r++ {\n        for c := col1; c <= col2; c++ {\n            sum += nm.matrix[r][c]\n        }\n    }\n    return sum\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        6
      ],
      "update_cell": [
        10
      ],
      "sum_start": [
        13,
        14
      ],
      "scan_cell": [
        15,
        16,
        17
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {}
  },
  "javascript": {
    "language": "javascript",
    "code": "var NumMatrix = function (matrix) {\n  this.matrix = matrix;\n};\n\nNumMatrix.prototype.update = function (row, col, val) {\n  this.matrix[row][col] = val;\n};\n\nNumMatrix.prototype.sumRegion = function (row1, col1, row2, col2) {\n  let sum = 0;\n  for (let r = row1; r <= row2; r++) {\n    for (let c = col1; c <= col2; c++) {\n      sum += this.matrix[r][c];\n    }\n  }\n  return sum;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "update_cell": [
        6
      ],
      "sum_start": [
        9,
        10
      ],
      "scan_cell": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {}
  },
  "typescript": {
    "language": "typescript",
    "code": "class NumMatrix {\n    private matrix: number[][];\n\n    constructor(matrix: number[][]) {\n        this.matrix = matrix;\n    }\n\n    update(row: number, col: number, val: number): void {\n        this.matrix[row][col] = val;\n    }\n\n    sumRegion(row1: number, col1: number, row2: number, col2: number): number {\n        let sum = 0;\n        for (let r = row1; r <= row2; r++) {\n            for (let c = col1; c <= col2; c++) {\n                sum += this.matrix[r][c];\n            }\n        }\n        return sum;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "update_cell": [
        9
      ],
      "sum_start": [
        12,
        13
      ],
      "scan_cell": [
        14,
        15,
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {}
  }
};

const RangeSumQuery2dMutablePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "matrix": [
        [
          3,
          0,
          1
        ],
        [
          5,
          6,
          3
        ],
        [
          1,
          2,
          0
        ]
      ],
      "operations": [
        {
          "type": "update",
          "row": 1,
          "col": 1,
          "val": 10
        },
        {
          "type": "sumRegion",
          "row1": 1,
          "col1": 1,
          "row2": 2,
          "col2": 2
        }
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Simple",
    "value": {
      "matrix": [
        [
          1,
          2
        ],
        [
          3,
          4
        ]
      ],
      "operations": [
        {
          "type": "sumRegion",
          "row1": 0,
          "col1": 0,
          "row2": 1,
          "col2": 1
        }
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Update Only",
    "value": {
      "matrix": [
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          1
        ]
      ],
      "operations": [
        {
          "type": "update",
          "row": 0,
          "col": 0,
          "val": 5
        }
      ]
    }
  }
];

function generateRangeSumQuery2dMutableSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let r=e.matrix.map(e=>[...e]),t=e.operations,a=r.length,l=r[0].length,o=Array.from({length:a},()=>Array(l+1).fill(0)),n={};for(let e=0;e<a;e++){for(let t=0;t<l;t++)n[`cell_${e}_${t}`]={type:"matrixElement",value:r[e][t],row:e,col:t,label:"matrix"};for(let r=0;r<=l;r++)n[`tree_${e}_${r}`]={type:"matrixElement",value:0,row:e,col:r,label:"rowPrefix"}}let c=new StepRecorder({m:a,n:l,mode:"rowPrefix",hasTree:!0,auxLabel:"rowPrefix",operations:t.map(e=>({...e})),phase:"build",opIdx:-1,row:void 0,col:void 0,total:void 0,results:[]},n),u=[],s=(e,t,i)=>c.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t,label:"matrix",state:i}),m=(e,r,t)=>c.update_visual(`tree_${e}_${r}`,{type:"matrixElement",value:o[e][r],row:e,col:r,label:"rowPrefix",state:t}),p=(e,r,t)=>{for(let i=0;i<a;i++){for(let a=0;a<l;a++){let l=void 0!==e&&i>=e.row1&&i<=e.row2&&a>=e.col1&&a<=e.col2;s(i,a,i===r&&a===t?"updated":l?"active":void 0)}for(let e=0;e<=l;e++)m(i,e,i===r?"active":void 0)}},d=(e,r,t,i,a)=>{c.update_variable("row",t),c.update_variable("col",i),c.update_variable("total",a),c.update_variable("results",[...u]),c.record(e,r)};d("-","Give every row its own prefix sums so a query costs one row scan."),d("init",`${a} row prefix arrays of ${l+1} slots each, all zero.`);for(let e=0;e<a;e++){for(let t=0;t<l;t++)o[e][t+1]=o[e][t]+r[e][t];p(void 0,e),d("build_row",`Row ${e} prefix: [${o[e].join(", ")}]`,e)}return c.update_variable("phase","ops"),t.forEach((e,t)=>{if(c.update_variable("opIdx",t),"update"===e.type){r[e.row][e.col]=e.val,p(void 0,e.row,e.col),d("update_cell",`update(${e.row}, ${e.col}, ${e.val}): write the cell.`,e.row,e.col);for(let t=0;t<l;t++)o[e.row][t+1]=o[e.row][t]+r[e.row][t];p(void 0,e.row),d("rebuild_row",`Rebuild row ${e.row}: [${o[e.row].join(", ")}]`,e.row);return}let i=0;p(e),d("sum_start",`sumRegion(${e.row1}, ${e.col1}, ${e.row2}, ${e.col2}): total = 0.`,void 0,void 0,0);for(let r=e.row1;r<=e.row2;r++){let t=o[r][e.col2+1]-o[r][e.col1];i+=t,p(e,r),d("add_row",`Row ${r}: ${o[r][e.col2+1]} - ${o[r][e.col1]} = ${t}, total = ${i}.`,r,void 0,i)}u.push(i),p(e),d("complete",`sumRegion = ${i}`,void 0,void 0,i)}),c.update_variable("phase","done"),c.update_variable("opIdx",-1),p(),d("complete",`Done! ${u.length} query result${1===u.length?"":"s"}: [${u.join(", ")}]`),c.getSteps()
  })(__inputArg);
}

export function RangeSumQuery2dMutableProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeSumQuery2dMutableTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeSumQuery2dMutableSteps(e) as any[];
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
      title="Range Sum Query 2D - Mutable"
      slug="range-sum-query-2d-mutable"
      approaches={approaches}
      presets={RangeSumQuery2dMutablePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Count of Smaller Numbers After Self (count-of-smaller-numbers-after-self)
// ==========================================

const CountOfSmallerNumbersAfterSelfTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def countSmaller(self, nums: list[int]) -> list[int]:\n        n = len(nums)\n        result = []\n\n        for i in range(n):\n            count = 0\n            # Count elements to the right that are smaller\n            for j in range(i + 1, n):\n                if nums[j] < nums[i]:\n                    count += 1\n            result.append(count)\n        return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "scan_element": [
        6
      ],
      "compare": [
        9,
        10
      ],
      "count_up": [
        11
      ],
      "set_result": [
        12
      ],
      "complete": [
        13
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        10
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> countSmaller(int[] nums) {\n        int n = nums.length;\n        List<Integer> result = new ArrayList<>();\n\n        for (int i = 0; i < n; i++) {\n            int count = 0;\n            // Count elements to the right that are smaller\n            for (int j = i + 1; j < n; j++) {\n                if (nums[j] < nums[i]) {\n                    count++;\n                }\n            }\n            result.add(count);\n        }\n        return result;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "scan_element": [
        6
      ],
      "compare": [
        9,
        10
      ],
      "count_up": [
        11
      ],
      "set_result": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        10
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> countSmaller(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> result(n, 0);\n\n        for (int i = 0; i < n; i++) {\n            int count = 0;\n            // Count elements to the right that are smaller\n            for (int j = i + 1; j < n; j++) {\n                if (nums[j] < nums[i]) {\n                    count++;\n                }\n            }\n            result[i] = count;\n        }\n        return result;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        4
      ],
      "scan_element": [
        7
      ],
      "compare": [
        10,
        11
      ],
      "count_up": [
        12
      ],
      "set_result": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> CountSmaller(int[] nums) {\n        int n = nums.Length;\n        int[] result = new int[n];\n\n        for (int i = 0; i < n; i++) {\n            int count = 0;\n            // Count elements to the right that are smaller\n            for (int j = i + 1; j < n; j++) {\n                if (nums[j] < nums[i]) {\n                    count++;\n                }\n            }\n            result[i] = count;\n        }\n        return result.ToList();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        3
      ],
      "scan_element": [
        6
      ],
      "compare": [
        9,
        10
      ],
      "count_up": [
        11
      ],
      "set_result": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        10
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func countSmaller(nums []int) []int {\n    n := len(nums)\n    result := make([]int, n)\n\n    for i := 0; i < n; i++ {\n        count := 0\n        // Count elements to the right that are smaller\n        for j := i + 1; j < n; j++ {\n            if nums[j] < nums[i] {\n                count++\n            }\n        }\n        result[i] = count\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "scan_element": [
        5
      ],
      "compare": [
        8,
        9
      ],
      "count_up": [
        10
      ],
      "set_result": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var countSmaller = function(nums) {\n    var n = nums.length;\n    var result = new Array(n).fill(0);\n\n    for (var i = 0; i < n; i++) {\n        var count = 0;\n        // Count elements to the right that are smaller\n        for (var j = i + 1; j < n; j++) {\n            if (nums[j] < nums[i]) {\n                count++;\n            }\n        }\n        result[i] = count;\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "scan_element": [
        5
      ],
      "compare": [
        8,
        9
      ],
      "count_up": [
        10
      ],
      "set_result": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function countSmaller(nums: number[]): number[] {\n    const n = nums.length;\n    const result = new Array(n).fill(0);\n\n    for (let i = 0; i < n; i++) {\n        let count = 0;\n        // Count elements to the right that are smaller\n        for (let j = i + 1; j < n; j++) {\n            if (nums[j] < nums[i]) {\n                count++;\n            }\n        }\n        result[i] = count;\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "scan_element": [
        5
      ],
      "compare": [
        8,
        9
      ],
      "count_up": [
        10
      ],
      "set_result": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "is_smaller": [
        9
      ]
    }
  }
};

const CountOfSmallerNumbersAfterSelfPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        5,
        2,
        6,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Sorted Desc",
    "value": {
      "nums": [
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
    "id": "ex3",
    "label": "With Duplicates",
    "value": {
      "nums": [
        3,
        2,
        2,
        6,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Sorted",
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

function generateCountOfSmallerNumbersAfterSelfSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],i=t.length,r=Math.min(...t),l=1-r,a=Math.max(...t)+l+1,s=Array(a).fill(0),u=Array(i).fill(null),o={};for(let e=0;e<i;e++)o[`num_${e}`]={type:"arrayElement",value:t[e],position:e,label:"nums"},o[`res_${e}`]={type:"arrayElement",value:"-",position:e,label:"result"};for(let e=1;e<a;e++)o[`bit_${e}`]={type:"arrayElement",value:0,position:e-1,label:"BIT"};let d=new StepRecorder({nums:t,n:i,offset:l,bitSize:a,result:[...u]},o),p=e=>{null!==e&&e>=1&&e<a?d.update_visual("ptr_bit",{type:"pointer",position:e-1,label:"idx"}):d.delete_visual("ptr_bit")};d.record("-",`Initialize BIT of size ${a-1}. Offset = ${l} (so min value ${r} maps to index 1). Traverse nums right to left.`);for(let e=i-1;e>=0;e--){let i=t[e],n=i+l;d.update_variable("i",e),d.update_variable("x",i),d.update_variable("sv",n),d.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:"nums",state:"active"}),d.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),d.record("scan_element",`Process nums[${e}] = ${i} (BIT index ${n}). Query BIT for count of smaller elements.`);let r=function(e){let t=0,i=e;for(d.update_variable("qSum",0),d.record("query_start",`Query BIT for prefix sum [1..${e}] to count seen values smaller than the current one`);i>0;){t+=s[i];let e=i-(i&-i);d.update_variable("qIdx",i),d.update_variable("qBit",s[i]),d.update_variable("qSum",t),d.update_variable("qNext",e),p(i),d.update_visual(`bit_${i}`,{type:"arrayElement",value:s[i],position:i-1,label:"BIT",state:"active"}),d.record("query_traverse",`Read BIT[${i}] = ${s[i]}, sum = ${t}. Next index = ${i} - (idx & -idx) = ${e}`),d.update_visual(`bit_${i}`,{type:"arrayElement",value:s[i],position:i-1,label:"BIT"}),i=e}return p(null),d.record("query_done",`Query complete: ${t} smaller elements found`),t}(n-1);u[e]=r,d.update_variable("count",r),d.update_variable("result",[...u]),d.update_visual(`res_${e}`,{type:"arrayElement",value:r,position:e,label:"result",state:"active"}),d.record("set_result",`result[${e}] = ${r} (there are ${r} smaller elements after index ${e})`),d.update_visual(`res_${e}`,{type:"arrayElement",value:r,position:e,label:"result"}),function(e){let t=e;for(d.record("update_start",`Update BIT: increment from index ${e} upward`);t<a;){s[t]++;let e=t+(t&-t);d.update_variable("uIdx",t),d.update_variable("uVal",s[t]),d.update_variable("uNext",e),p(t),d.update_visual(`bit_${t}`,{type:"arrayElement",value:s[t],position:t-1,label:"BIT",state:"highlight"}),d.record("update_traverse",`Increment BIT[${t}] to ${s[t]}. Next index = ${t} + (idx & -idx) = ${e}`),d.update_visual(`bit_${t}`,{type:"arrayElement",value:s[t],position:t-1,label:"BIT"}),t=e}p(null)}(n),d.update_visual(`num_${e}`,{type:"arrayElement",value:i,position:e,label:"nums",state:"sorted"})}d.delete_visual("ptr_i");for(let e=0;e<i;e++)d.update_visual(`res_${e}`,{type:"arrayElement",value:u[e],position:e,label:"result",state:"sorted"});return d.record("complete",`Done! Result: [${u.join(", ")}]`),d.getSteps()
  })(__inputArg);
}

export function CountOfSmallerNumbersAfterSelfProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CountOfSmallerNumbersAfterSelfTemplates,
      generateSteps: (e: any) => {
        const recorded = generateCountOfSmallerNumbersAfterSelfSteps(e) as any[];
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
      title="Count of Smaller Numbers After Self"
      slug="count-of-smaller-numbers-after-self"
      approaches={approaches}
      presets={CountOfSmallerNumbersAfterSelfPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Falling Squares (falling-squares)
// ==========================================

const FallingSquaresTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def fallingSquares(self, positions: list[list[int]]) -> list[int]:\n        ans = []\n        placed = []  # (left, right, height)\n        max_height = 0\n\n        for left, side in positions:\n            right = left + side\n            base = 0\n\n            # Find the max height among overlapping squares\n            for sl, sr, sh in placed:\n                # Intervals overlap if left < sr and sl < right\n                if left < sr and sl < right:\n                    base = max(base, sh)\n\n            top = base + side\n            placed.append((left, right, top))\n            max_height = max(max_height, top)\n            ans.append(max_height)\n\n        return ans",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "drop_start": [
        7,
        8,
        9
      ],
      "scan_square": [
        11,
        12,
        13
      ],
      "overlap": [
        15
      ],
      "calc_height": [
        17
      ],
      "place_square": [
        18
      ],
      "update_max": [
        19,
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_pos": [
        7
      ],
      "for_placed": [
        12
      ],
      "overlaps": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Integer> fallingSquares(int[][] positions) {\n        List<Integer> ans = new ArrayList<>();\n        List<int[]> placed = new ArrayList<>(); // [left, right, height]\n        int maxHeight = 0;\n\n        for (int[] pos : positions) {\n            int left = pos[0];\n            int side = pos[1];\n            int right = left + side;\n            int base = 0;\n\n            // Find the max height among overlapping squares\n            for (int[] sq : placed) {\n                // Intervals overlap if left < sq[1] and sq[0] < right\n                if (left < sq[1] && sq[0] < right) {\n                    base = Math.max(base, sq[2]);\n                }\n            }\n\n            int top = base + side;\n            placed.add(new int[]{left, right, top});\n            maxHeight = Math.max(maxHeight, top);\n            ans.add(maxHeight);\n        }\n\n        return ans;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "drop_start": [
        7,
        8,
        9,
        10,
        11
      ],
      "scan_square": [
        13,
        14,
        15
      ],
      "overlap": [
        17
      ],
      "calc_height": [
        21
      ],
      "place_square": [
        22
      ],
      "update_max": [
        23,
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_pos": [
        7
      ],
      "for_placed": [
        14
      ],
      "overlaps": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<int> fallingSquares(vector<vector<int>>& positions) {\n        vector<int> ans;\n        vector<array<int, 3>> placed; // {left, right, height}\n        int maxHeight = 0;\n\n        for (auto& pos : positions) {\n            int left = pos[0];\n            int side = pos[1];\n            int right = left + side;\n            int base = 0;\n\n            // Find the max height among overlapping squares\n            for (auto& sq : placed) {\n                if (left < sq[1] && sq[0] < right) {\n                    base = max(base, sq[2]);\n                }\n            }\n\n            int top = base + side;\n            placed.push_back({left, right, top});\n            maxHeight = max(maxHeight, top);\n            ans.push_back(maxHeight);\n        }\n\n        return ans;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5,
        6
      ],
      "drop_start": [
        8,
        9,
        10,
        11,
        12
      ],
      "scan_square": [
        14,
        15
      ],
      "overlap": [
        17
      ],
      "calc_height": [
        21
      ],
      "place_square": [
        22
      ],
      "update_max": [
        23,
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_pos": [
        8
      ],
      "for_placed": [
        15
      ],
      "overlaps": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<int> FallingSquares(int[][] positions) {\n        List<int> ans = new List<int>();\n        List<int[]> placed = new List<int[]>(); // [left, right, height]\n        int maxHeight = 0;\n\n        foreach (var pos in positions) {\n            int left = pos[0];\n            int side = pos[1];\n            int right = left + side;\n            int baseHeight = 0;\n\n            // Find the max height among overlapping squares\n            foreach (var sq in placed) {\n                if (left < sq[1] && sq[0] < right) {\n                    baseHeight = Math.Max(baseHeight, sq[2]);\n                }\n            }\n\n            int top = baseHeight + side;\n            placed.Add(new int[] { left, right, top });\n            maxHeight = Math.Max(maxHeight, top);\n            ans.Add(maxHeight);\n        }\n\n        return ans;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "drop_start": [
        7,
        8,
        9,
        10,
        11
      ],
      "scan_square": [
        13,
        14
      ],
      "overlap": [
        16
      ],
      "calc_height": [
        20
      ],
      "place_square": [
        21
      ],
      "update_max": [
        22,
        23
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_pos": [
        7
      ],
      "for_placed": [
        14
      ],
      "overlaps": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func fallingSquares(positions [][]int) []int {\n    ans := []int{}\n    placed := [][]int{} // [left, right, height]\n    maxHeight := 0\n\n    for _, pos := range positions {\n        left := pos[0]\n        side := pos[1]\n        right := left + side\n        base := 0\n\n        // Find the max height among overlapping squares\n        for _, sq := range placed {\n            if left < sq[1] && sq[0] < right {\n                if sq[2] > base {\n                    base = sq[2]\n                }\n            }\n        }\n\n        top := base + side\n        placed = append(placed, []int{left, right, top})\n        if top > maxHeight {\n            maxHeight = top\n        }\n        ans = append(ans, maxHeight)\n    }\n\n    return ans\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "drop_start": [
        6,
        7,
        8,
        9,
        10
      ],
      "scan_square": [
        12,
        13
      ],
      "overlap": [
        15,
        16
      ],
      "calc_height": [
        21
      ],
      "place_square": [
        22
      ],
      "update_max": [
        23,
        24,
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "for_pos": [
        6
      ],
      "for_placed": [
        13
      ],
      "overlaps": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var fallingSquares = function (positions) {\n  const ans = [];\n  const placed = []; // [left, right, height]\n  let maxHeight = 0;\n\n  for (const [left, side] of positions) {\n    const right = left + side;\n    let base = 0;\n\n    // Find the max height among overlapping squares\n    for (const [sl, sr, sh] of placed) {\n      if (left < sr && sl < right) {\n        base = Math.max(base, sh);\n      }\n    }\n\n    const top = base + side;\n    placed.push([left, right, top]);\n    maxHeight = Math.max(maxHeight, top);\n    ans.push(maxHeight);\n  }\n\n  return ans;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "drop_start": [
        6,
        7,
        8
      ],
      "scan_square": [
        10,
        11
      ],
      "overlap": [
        13
      ],
      "calc_height": [
        17
      ],
      "place_square": [
        18
      ],
      "update_max": [
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_pos": [
        6
      ],
      "for_placed": [
        11
      ],
      "overlaps": [
        12
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function fallingSquares(positions: number[][]): number[] {\n    const ans: number[] = [];\n    const placed: number[][] = []; // [left, right, height]\n    let maxHeight = 0;\n\n    for (const [left, side] of positions) {\n        const right = left + side;\n        let base = 0;\n\n        // Find the max height among overlapping squares\n        for (const [sl, sr, sh] of placed) {\n            if (left < sr && sl < right) {\n                base = Math.max(base, sh);\n            }\n        }\n\n        const top = base + side;\n        placed.push([left, right, top]);\n        maxHeight = Math.max(maxHeight, top);\n        ans.push(maxHeight);\n    }\n\n    return ans;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "drop_start": [
        6,
        7,
        8
      ],
      "scan_square": [
        10,
        11
      ],
      "overlap": [
        13
      ],
      "calc_height": [
        17
      ],
      "place_square": [
        18
      ],
      "update_max": [
        19,
        20
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "for_pos": [
        6
      ],
      "for_placed": [
        11
      ],
      "overlaps": [
        12
      ]
    }
  }
};

const FallingSquaresPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "positions": [
        [
          1,
          2
        ],
        [
          2,
          3
        ],
        [
          6,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Stacking",
    "value": {
      "positions": [
        [
          1,
          2
        ],
        [
          1,
          2
        ],
        [
          1,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Adjacent",
    "value": {
      "positions": [
        [
          1,
          3
        ],
        [
          4,
          2
        ],
        [
          6,
          2
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Overlapping",
    "value": {
      "positions": [
        [
          1,
          5
        ],
        [
          2,
          2
        ],
        [
          7,
          3
        ]
      ]
    }
  }
];

function generateFallingSquaresSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.positions.map(e=>[...e]),a=t.length,r=new Set;for(let e of t)r.add(e[0]),r.add(e[0]+e[1]);let i=Array.from(r).sort((e,t)=>e-t),s=new Map;for(let e=0;e<i.length;e++)s.set(i[e],e);let o=i.length,l=Array(4*o).fill(0),d=Array(4*o).fill(0);function p(e){0!==d[e]&&(l[2*e]=Math.max(l[2*e],d[e]),d[2*e]=Math.max(d[2*e],d[e]),l[2*e+1]=Math.max(l[2*e+1],d[e]),d[2*e+1]=Math.max(d[2*e+1],d[e]),d[e]=0)}let c=0;{let e=[];for(let a of t){let t=a[0],n=a[0]+a[1],r=0;for(let a of e)a.l<n&&t<a.r&&(r=Math.max(r,a.top));let i=r+a[1];e.push({l:t,r:n,top:i}),c=Math.max(c,i)}}let h=Math.max(...t.map(e=>e[1])),u=Math.min(...t.map(e=>e[0])),f=Math.max(...t.map(e=>e[0]+e[1])),m=c+h+1,g=new StepRecorder({positionsList:t.map(e=>[...e]),n:a,coords:[...i],sceneMinX:u,sceneMaxX:f,sceneTop:m,ans:[],maxHeight:0,i:null},{});g.record("-","Start: Process falling squares and track the maximum stack height after each drop."),g.record("compress",`Coordinate compress: unique x-values are [${i.join(", ")}], mapped to indices 0..${o-1}.`);let x=0,v=[];for(let e=0;e<a;e++){let a=t[e],n=a[0],r=a[1],i=n+r,c=s.get(n),h=s.get(i)-1;g.update_variable("i",e),g.update_variable("sqLeft",n),g.update_variable("side",r),g.update_variable("sqRight",i),g.update_variable("cl",c),g.update_variable("cr",h),g.add_conditional("for_pos",!0),g.record("drop_start",`Square ${e+1}: Drop [left=${n}, side=${r}] covering compressed range [${c}..${h}].`);let u=function e(t,a,n,r,i){if(i<a||n<r)return 0;if(r<=a&&n<=i)return l[t];p(t);let s=Math.floor((a+n)/2);return Math.max(e(2*t,a,s,r,i),e(2*t+1,s+1,n,r,i))}(1,0,o-1,c,h);g.update_variable("base",u),g.record("query_range",`Query segment tree for max height in x-range [${n}, ${i}): base = ${u}.`);let f=u+r;g.update_variable("top",f),g.record("calc_height",`New top = base(${u}) + side(${r}) = ${f}.`),function e(t,a,n,r,i,s){if(i<a||n<r)return;if(r<=a&&n<=i){l[t]=Math.max(l[t],s),d[t]=Math.max(d[t],s);return}p(t);let o=Math.floor((a+n)/2);e(2*t,a,o,r,i,s),e(2*t+1,o+1,n,r,i,s),l[t]=Math.max(l[2*t],l[2*t+1])}(1,0,o-1,c,h,f),g.add_new_visual(`square_${e}`,{type:"stateElement",value:{left:n,right:i,base:u,height:r},index:e,state:"placed"}),g.record("place_square",`Place square ${e+1} at base=${u}, reaching top=${f}. Update the tree so range [${c}..${h}] now has height ${f}.`);let m=x;x=Math.max(x,f),v.push(x),g.update_variable("prevMax",m),g.update_variable("maxHeight",x),g.update_variable("ans",[...v]),g.record("update_max",`maxHeight = max(${m}, ${f}) = ${x}. ans = [${v.join(", ")}].`)}return g.update_variable("i",null),g.update_variable("result",[...v]),g.add_conditional("for_pos",!1),g.record("complete",`Done! The maximum heights after each drop are [${v.join(", ")}].`),g.getSteps()
  })(__inputArg);
}

export function FallingSquaresProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FallingSquaresTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFallingSquaresSteps(e) as any[];
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
      title="Falling Squares"
      slug="falling-squares"
      approaches={approaches}
      presets={FallingSquaresPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Block Placement Queries (block-placement-queries)
// ==========================================

const BlockPlacementQueriesTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def getResults(self, queries: list[list[int]]) -> list[bool]:\n        from sortedcontainers import SortedList\n        obstacles = SortedList([0])\n        results = []\n\n        for query in queries:\n            if query[0] == 1:\n                # Type 1: place obstacle at query[1]\n                obstacles.add(query[1])\n            else:\n                # Type 2: check if block of size query[2] fits in [0, query[1]]\n                x, sz = query[1], query[2]\n                can_place = False\n                prev = 0\n                idx = obstacles.bisect_right(x)\n                for i in range(1, idx):\n                    if obstacles[i] - obstacles[i - 1] >= sz:\n                        can_place = True\n                        break\n                if not can_place:\n                    last_obs = obstacles[idx - 1]\n                    if x - last_obs >= sz:\n                        can_place = True\n                results.append(can_place)\n\n        return results",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "init": [
        4,
        5
      ],
      "process_query": [
        7,
        8
      ],
      "add_obstacle": [
        9,
        10
      ],
      "check_block": [
        12,
        13,
        14,
        15,
        16
      ],
      "scan_gap": [
        17,
        18
      ],
      "gap_fits": [
        19,
        20
      ],
      "calc_trailing": [
        21,
        22,
        23,
        24
      ],
      "record_result": [
        25
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_query": [
        7
      ],
      "is_add": [
        8
      ],
      "for_obs": [
        17
      ],
      "gap_fits": [
        18
      ],
      "trailing_fits": [
        23
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public List<Boolean> getResults(int[][] queries) {\n        TreeSet<Integer> obstacles = new TreeSet<>();\n        obstacles.add(0);\n        List<Boolean> results = new ArrayList<>();\n\n        for (int[] query : queries) {\n            if (query[0] == 1) {\n                // Type 1: place obstacle at query[1]\n                obstacles.add(query[1]);\n            } else {\n                // Type 2: check if block of size query[2] fits in [0, query[1]]\n                int x = query[1];\n                int sz = query[2];\n                boolean canPlace = false;\n                int prev = 0;\n                for (int obs : obstacles) {\n                    if (obs > x) break;\n                    if (obs - prev >= sz) {\n                        canPlace = true;\n                        break;\n                    }\n                    prev = obs;\n                }\n                // Check gap from last obstacle to x\n                if (!canPlace && x - prev >= sz) {\n                    canPlace = true;\n                }\n                results.add(canPlace);\n            }\n        }\n        return results;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4,
        5
      ],
      "process_query": [
        7,
        8
      ],
      "add_obstacle": [
        9,
        10
      ],
      "check_block": [
        12,
        13,
        14,
        15,
        16
      ],
      "scan_gap": [
        17,
        18,
        23
      ],
      "gap_fits": [
        19,
        20,
        21
      ],
      "calc_trailing": [
        25,
        26,
        27
      ],
      "record_result": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "for_query": [
        7
      ],
      "is_add": [
        8
      ],
      "for_obs": [
        17
      ],
      "gap_fits": [
        19
      ],
      "trailing_fits": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    vector<bool> getResults(vector<vector<int>>& queries) {\n        set<int> obstacles;\n        obstacles.insert(0);\n        vector<bool> results;\n\n        for (auto& query : queries) {\n            if (query[0] == 1) {\n                obstacles.insert(query[1]);\n            } else {\n                int x = query[1], sz = query[2];\n                bool canPlace = false;\n                int prev = 0;\n                for (int obs : obstacles) {\n                    if (obs > x) break;\n                    if (obs - prev >= sz) {\n                        canPlace = true;\n                        break;\n                    }\n                    prev = obs;\n                }\n                if (!canPlace && x - prev >= sz) {\n                    canPlace = true;\n                }\n                results.push_back(canPlace);\n            }\n        }\n        return results;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5,
        6
      ],
      "process_query": [
        8,
        9
      ],
      "add_obstacle": [
        10
      ],
      "check_block": [
        12,
        13,
        14
      ],
      "scan_gap": [
        15,
        16,
        21
      ],
      "gap_fits": [
        17,
        18,
        19
      ],
      "calc_trailing": [
        23,
        24
      ],
      "record_result": [
        26
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "for_query": [
        8
      ],
      "is_add": [
        9
      ],
      "for_obs": [
        15
      ],
      "gap_fits": [
        17
      ],
      "trailing_fits": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public IList<bool> GetResults(int[][] queries) {\n        SortedSet<int> obstacles = new SortedSet<int> { 0 };\n        List<bool> results = new List<bool>();\n\n        foreach (var query in queries) {\n            if (query[0] == 1) {\n                obstacles.Add(query[1]);\n            } else {\n                int x = query[1], sz = query[2];\n                bool canPlace = false;\n                int prev = 0;\n                foreach (int obs in obstacles) {\n                    if (obs > x) break;\n                    if (obs - prev >= sz) {\n                        canPlace = true;\n                        break;\n                    }\n                    prev = obs;\n                }\n                if (!canPlace && x - prev >= sz) {\n                    canPlace = true;\n                }\n                results.Add(canPlace);\n            }\n        }\n        return results;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "process_query": [
        6,
        7
      ],
      "add_obstacle": [
        8
      ],
      "check_block": [
        10,
        11,
        12
      ],
      "scan_gap": [
        13,
        14,
        19
      ],
      "gap_fits": [
        15,
        16,
        17
      ],
      "calc_trailing": [
        21,
        22
      ],
      "record_result": [
        24
      ],
      "complete": [
        27
      ]
    },
    "conditionalMap": {
      "for_query": [
        6
      ],
      "is_add": [
        7
      ],
      "for_obs": [
        13
      ],
      "gap_fits": [
        15
      ],
      "trailing_fits": [
        21
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func getResults(queries [][]int) []bool {\n    obstacles := []int{0}\n    results := []bool{}\n\n    insertSorted := func(arr []int, val int) []int {\n        idx := sort.SearchInts(arr, val)\n        arr = append(arr, 0)\n        copy(arr[idx+1:], arr[idx:])\n        arr[idx] = val\n        return arr\n    }\n\n    for _, query := range queries {\n        if query[0] == 1 {\n            obstacles = insertSorted(obstacles, query[1])\n        } else {\n            x, sz := query[1], query[2]\n            canPlace := false\n            prev := 0\n            for _, obs := range obstacles {\n                if obs > x {\n                    break\n                }\n                if obs - prev >= sz {\n                    canPlace = true\n                    break\n                }\n                prev = obs\n            }\n            if !canPlace && x - prev >= sz {\n                canPlace = true\n            }\n            results = append(results, canPlace)\n        }\n    }\n    return results\n}",
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
        9,
        10
      ],
      "process_query": [
        13,
        14
      ],
      "add_obstacle": [
        15
      ],
      "check_block": [
        17,
        18,
        19
      ],
      "scan_gap": [
        20,
        21,
        28
      ],
      "gap_fits": [
        24,
        25,
        26
      ],
      "calc_trailing": [
        30,
        31
      ],
      "record_result": [
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "for_query": [
        13
      ],
      "is_add": [
        14
      ],
      "for_obs": [
        20
      ],
      "gap_fits": [
        24
      ],
      "trailing_fits": [
        30
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var getResults = function(queries) {\n    const obstacles = [0];\n    const results = [];\n\n    const insertSorted = (arr, val) => {\n        let lo = 0, hi = arr.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (arr[mid] < val) lo = mid + 1;\n            else hi = mid;\n        }\n        arr.splice(lo, 0, val);\n    };\n\n    for (const query of queries) {\n        if (query[0] === 1) {\n            insertSorted(obstacles, query[1]);\n        } else {\n            const x = query[1], sz = query[2];\n            let canPlace = false;\n            let prev = 0;\n            for (const obs of obstacles) {\n                if (obs > x) break;\n                if (obs - prev >= sz) {\n                    canPlace = true;\n                    break;\n                }\n                prev = obs;\n            }\n            if (!canPlace && x - prev >= sz) {\n                canPlace = true;\n            }\n            results.push(canPlace);\n        }\n    }\n    return results;\n};",
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
        9,
        10,
        12
      ],
      "process_query": [
        15,
        16
      ],
      "add_obstacle": [
        17
      ],
      "check_block": [
        19,
        20,
        21
      ],
      "scan_gap": [
        22,
        23,
        28
      ],
      "gap_fits": [
        24,
        25,
        26
      ],
      "calc_trailing": [
        30,
        31
      ],
      "record_result": [
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "for_query": [
        15
      ],
      "is_add": [
        16
      ],
      "for_obs": [
        22
      ],
      "gap_fits": [
        24
      ],
      "trailing_fits": [
        30
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function getResults(queries: number[][]): boolean[] {\n    const obstacles: number[] = [0];\n    const results: boolean[] = [];\n\n    const insertSorted = (arr: number[], val: number): void => {\n        let lo = 0, hi = arr.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (arr[mid] < val) lo = mid + 1;\n            else hi = mid;\n        }\n        arr.splice(lo, 0, val);\n    };\n\n    for (const query of queries) {\n        if (query[0] === 1) {\n            insertSorted(obstacles, query[1]);\n        } else {\n            const x = query[1], sz = query[2];\n            let canPlace = false;\n            let prev = 0;\n            for (const obs of obstacles) {\n                if (obs > x) break;\n                if (obs - prev >= sz) {\n                    canPlace = true;\n                    break;\n                }\n                prev = obs;\n            }\n            if (!canPlace && x - prev >= sz) {\n                canPlace = true;\n            }\n            results.push(canPlace);\n        }\n    }\n    return results;\n}",
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
        9,
        10,
        12
      ],
      "process_query": [
        15,
        16
      ],
      "add_obstacle": [
        17
      ],
      "check_block": [
        19,
        20,
        21
      ],
      "scan_gap": [
        22,
        23,
        28
      ],
      "gap_fits": [
        24,
        25,
        26
      ],
      "calc_trailing": [
        30,
        31
      ],
      "record_result": [
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "for_query": [
        15
      ],
      "is_add": [
        16
      ],
      "for_obs": [
        22
      ],
      "gap_fits": [
        24
      ],
      "trailing_fits": [
        30
      ]
    }
  }
};

const BlockPlacementQueriesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "queries": [
        [
          1,
          2
        ],
        [
          2,
          5,
          3
        ],
        [
          1,
          4
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
    "id": "ex2",
    "label": "All Checks",
    "value": {
      "queries": [
        [
          1,
          3
        ],
        [
          1,
          6
        ],
        [
          2,
          8,
          4
        ],
        [
          2,
          8,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Tight Gaps",
    "value": {
      "queries": [
        [
          1,
          2
        ],
        [
          1,
          4
        ],
        [
          1,
          6
        ],
        [
          2,
          7,
          3
        ],
        [
          2,
          7,
          1
        ]
      ]
    }
  }
];

function generateBlockPlacementQueriesSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.queries.map(e=>[...e]),a=0;for(let e of t)a=Math.max(a,e[1]),3===e.length&&(a=Math.max(a,e[2]));let s=Array(4*(a+=2)).fill(0);function l(e,t,a,r,i){if(t===a){s[e]=i;return}let n=Math.floor((t+a)/2);r<=n?l(2*e,t,n,r,i):l(2*e+1,n+1,a,r,i),s[e]=Math.max(s[2*e],s[2*e+1])}let i=[0],n=[],o=Math.min(a-2,12),d=new StepRecorder({queriesList:t.map(e=>[...e]),m:o,obstacles:[0],results:[],qi:null,qType:null},{});d.record("-","Start: Process block placement queries using a segment tree (max gap per obstacle) + sorted set. Sentinel obstacle at position 0.");for(let e=0;e<t.length;e++){let r=t[e];if(d.update_variable("qi",e),1===r[0]){let t=r[1];d.update_variable("qType","add"),d.update_variable("p",t),d.add_conditional("for_query",!0),d.add_conditional("is_add",!0),d.record("process_query",`Query ${e+1}: Type 1 - Add obstacle at position ${t}`);let s=function(e){let t=null;for(let a of i)a<e&&(null===t||a>t)&&(t=a);return t}(t),n=function(e){let t=null;for(let a of i)a>e&&(null===t||a<t)&&(t=a);return t}(t);d.update_variable("prev",s),d.update_variable("next",n),d.record("find_neighbors",`Found neighbors: prev=${s}${null!==n?`, next=${n}`:", no next obstacle"}`),function(e){let t=0;for(;t<i.length&&i[t]<e;)t++;i.splice(t,0,e)}(t),d.update_variable("obstacles",[...i]),d.record("add_obstacle",`Obstacle placed at position ${t}. Obstacles: [${i.join(", ")}]`);let o=t-(null!==s?s:0);l(1,0,a-1,t,o);let c=null;null!==n&&(c=n-t,l(1,0,a-1,n,c)),d.update_variable("gapAtP",o),d.update_variable("gapAtNext",c),d.record("update_gaps",`Updated segment tree: gap[${t}]=${o}${null!==n?`, gap[${n}]=${n-t}`:""}`)}else{let t=r[1],l=r[2];d.update_variable("qType","check"),d.update_variable("x",t),d.update_variable("sz",l),d.add_conditional("for_query",!0),d.add_conditional("is_add",!1),d.record("process_query",`Query ${e+1}: Type 2 - Can a block of size ${l} fit in [0, ${t}]?`),d.record("check_block",`Checking if block of size ${l} fits in range [0, ${t}]`);let o=function e(t,a,r,l,i){if(i<a||r<l)return 0;if(l<=a&&r<=i)return s[t];let n=Math.floor((a+r)/2);return Math.max(e(2*t,a,n,l,i),e(2*t+1,n+1,r,l,i))}(1,0,a-1,0,t);d.update_variable("maxGap",o),d.record("query_max_gap",`Segment tree query: max gap in [0, ${t}] = ${o}`);let c=function(e){let t=null;for(let a of i)a<=e&&(null===t||a>t)&&(t=a);return t}(t),u=t-(null!==c?c:0);d.update_variable("last",c),d.update_variable("trailing",u),d.record("calc_trailing",`Trailing gap: ${t} - ${c} = ${u} (last obstacle at ${c})`);let p=Math.max(o,u)>=l;n.push(p);let x=null;for(let e=0;e+1<i.length;e++){let a=i[e],r=i[e+1];if(r<=t&&r-a>=l){x=a;break}}if(null===x&&u>=l&&(x=c),null===x)if(o>=u){let e=-1;for(let a=0;a+1<i.length;a++){let r=i[a],s=i[a+1];s<=t&&s-r>e&&(e=s-r,x=r)}null===x&&(x=c)}else x=c;d.update_variable("fits",p),d.update_variable("bestStart",x),d.update_variable("results",[...n]),d.record("check_result",`max(maxGap=${o}, trailing=${u}) = ${Math.max(o,u)} ${p?">=":"<"} ${l}: ${p?o>=u?`fits in the widest gap between obstacles (${o})`:`fits in the trailing space before ${t} (${u})`:"no gap is wide enough, block does not fit"}`)}}return d.update_variable("qi",null),d.update_variable("qType",null),d.update_variable("result",[...n]),d.add_conditional("for_query",!1),d.record("complete",`All queries processed. Results: [${n.map(e=>e?"true":"false").join(", ")}]`),d.getSteps()
  })(__inputArg);
}

export function BlockPlacementQueriesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: BlockPlacementQueriesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateBlockPlacementQueriesSteps(e) as any[];
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
      title="Block Placement Queries"
      slug="block-placement-queries"
      approaches={approaches}
      presets={BlockPlacementQueriesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Longest Balanced Subarray II (longest-balanced-subarray-ii)
// ==========================================

const LongestBalancedSubarrayIiTemplates = {
  "python": {
    "language": "python",
    "code": "from typing import List\n\nclass Solution:\n    def longestBalanced(self, nums: List[int]) -> int:\n        n = len(nums)\n        answer = 0\n\n        for left in range(n):\n            for right in range(left, n):\n                evens = set()\n                odds = set()\n\n                for k in range(left, right + 1):\n                    if nums[k] % 2 == 0:\n                        evens.add(nums[k])\n                    else:\n                        odds.add(nums[k])\n\n                if len(evens) == len(odds):\n                    answer = max(answer, right - left + 1)\n\n        return answer",
    "lineMap": {
      "-": [
        1,
        3,
        4
      ],
      "init": [
        5,
        6
      ],
      "pick_left": [
        8
      ],
      "pick_right": [
        9,
        10,
        11
      ],
      "count_element": [
        13,
        14
      ],
      "add_even": [
        15
      ],
      "add_odd": [
        17
      ],
      "check_balance": [
        19
      ],
      "update_answer": [
        20
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "for_left": [
        8
      ],
      "for_right": [
        9
      ],
      "for_k": [
        13
      ],
      "is_even": [
        14
      ],
      "balanced": [
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int longestBalanced(int[] nums) {\n        int n = nums.length;\n        int answer = 0;\n\n        for (int left = 0; left < n; left++) {\n            for (int right = left; right < n; right++) {\n                Set<Integer> evens = new HashSet<>();\n                Set<Integer> odds = new HashSet<>();\n\n                for (int k = left; k <= right; k++) {\n                    if ((nums[k] & 1) == 0) {\n                        evens.add(nums[k]);\n                    } else {\n                        odds.add(nums[k]);\n                    }\n                }\n\n                if (evens.size() == odds.size()) {\n                    answer = Math.max(answer, right - left + 1);\n                }\n            }\n        }\n\n        return answer;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init": [
        3,
        4
      ],
      "pick_left": [
        6
      ],
      "pick_right": [
        7,
        8,
        9
      ],
      "count_element": [
        11,
        12
      ],
      "add_even": [
        13
      ],
      "add_odd": [
        15
      ],
      "check_balance": [
        19
      ],
      "update_answer": [
        20
      ],
      "complete": [
        25
      ]
    },
    "conditionalMap": {
      "for_left": [
        6
      ],
      "for_right": [
        7
      ],
      "for_k": [
        11
      ],
      "is_even": [
        12
      ],
      "balanced": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int longestBalanced(vector<int>& nums) {\n        int n = nums.size();\n        int answer = 0;\n\n        for (int left = 0; left < n; ++left) {\n            for (int right = left; right < n; ++right) {\n                unordered_set<int> evens;\n                unordered_set<int> odds;\n\n                for (int k = left; k <= right; ++k) {\n                    if ((nums[k] & 1) == 0) {\n                        evens.insert(nums[k]);\n                    } else {\n                        odds.insert(nums[k]);\n                    }\n                }\n\n                if (evens.size() == odds.size()) {\n                    answer = max(answer, right - left + 1);\n                }\n            }\n        }\n\n        return answer;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        3
      ],
      "init": [
        4,
        5
      ],
      "pick_left": [
        7
      ],
      "pick_right": [
        8,
        9,
        10
      ],
      "count_element": [
        12,
        13
      ],
      "add_even": [
        14
      ],
      "add_odd": [
        16
      ],
      "check_balance": [
        20
      ],
      "update_answer": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_left": [
        7
      ],
      "for_right": [
        8
      ],
      "for_k": [
        12
      ],
      "is_even": [
        13
      ],
      "balanced": [
        20
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "\npublic class Solution {\n    public int LongestBalanced(int[] nums) {\n        int n = nums.Length;\n        int answer = 0;\n\n        for (int left = 0; left < n; left++) {\n            for (int right = left; right < n; right++) {\n                var evens = new HashSet<int>();\n                var odds = new HashSet<int>();\n\n                for (int k = left; k <= right; k++) {\n                    if ((nums[k] & 1) == 0) {\n                        evens.Add(nums[k]);\n                    } else {\n                        odds.Add(nums[k]);\n                    }\n                }\n\n                if (evens.Count == odds.Count) {\n                    answer = Math.Max(answer, right - left + 1);\n                }\n            }\n        }\n\n        return answer;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "init": [
        4,
        5
      ],
      "pick_left": [
        7
      ],
      "pick_right": [
        8,
        9,
        10
      ],
      "count_element": [
        12,
        13
      ],
      "add_even": [
        14
      ],
      "add_odd": [
        16
      ],
      "check_balance": [
        20
      ],
      "update_answer": [
        21
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_left": [
        7
      ],
      "for_right": [
        8
      ],
      "for_k": [
        12
      ],
      "is_even": [
        13
      ],
      "balanced": [
        20
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func longestBalanced(nums []int) int {\n\tn := len(nums)\n\tanswer := 0\n\n\tfor left := 0; left < n; left++ {\n\t\tfor right := left; right < n; right++ {\n\t\t\tevens := map[int]bool{}\n\t\t\todds := map[int]bool{}\n\n\t\t\tfor k := left; k <= right; k++ {\n\t\t\t\tif nums[k]%2 == 0 {\n\t\t\t\t\tevens[nums[k]] = true\n\t\t\t\t} else {\n\t\t\t\t\todds[nums[k]] = true\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif len(evens) == len(odds) {\n\t\t\t\tif right-left+1 > answer {\n\t\t\t\t\tanswer = right - left + 1\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n\n\treturn answer\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "pick_left": [
        5
      ],
      "pick_right": [
        6,
        7,
        8
      ],
      "count_element": [
        10,
        11
      ],
      "add_even": [
        12
      ],
      "add_odd": [
        14
      ],
      "check_balance": [
        18
      ],
      "update_answer": [
        19,
        20
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "for_left": [
        5
      ],
      "for_right": [
        6
      ],
      "for_k": [
        10
      ],
      "is_even": [
        11
      ],
      "balanced": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var longestBalanced = function(nums) {\n    const n = nums.length;\n    let answer = 0;\n\n    for (let left = 0; left < n; left++) {\n        for (let right = left; right < n; right++) {\n            const evens = new Set();\n            const odds = new Set();\n\n            for (let k = left; k <= right; k++) {\n                if (nums[k] % 2 === 0) {\n                    evens.add(nums[k]);\n                } else {\n                    odds.add(nums[k]);\n                }\n            }\n\n            if (evens.size === odds.size) {\n                answer = Math.max(answer, right - left + 1);\n            }\n        }\n    }\n\n    return answer;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "pick_left": [
        5
      ],
      "pick_right": [
        6,
        7,
        8
      ],
      "count_element": [
        10,
        11
      ],
      "add_even": [
        12
      ],
      "add_odd": [
        14
      ],
      "check_balance": [
        18
      ],
      "update_answer": [
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_left": [
        5
      ],
      "for_right": [
        6
      ],
      "for_k": [
        10
      ],
      "is_even": [
        11
      ],
      "balanced": [
        18
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function longestBalanced(nums: number[]): number {\n    const n = nums.length;\n    let answer = 0;\n\n    for (let left = 0; left < n; left++) {\n        for (let right = left; right < n; right++) {\n            const evens = new Set<number>();\n            const odds = new Set<number>();\n\n            for (let k = left; k <= right; k++) {\n                if (nums[k] % 2 === 0) {\n                    evens.add(nums[k]);\n                } else {\n                    odds.add(nums[k]);\n                }\n            }\n\n            if (evens.size === odds.size) {\n                answer = Math.max(answer, right - left + 1);\n            }\n        }\n    }\n\n    return answer;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3
      ],
      "pick_left": [
        5
      ],
      "pick_right": [
        6,
        7,
        8
      ],
      "count_element": [
        10,
        11
      ],
      "add_even": [
        12
      ],
      "add_odd": [
        14
      ],
      "check_balance": [
        18
      ],
      "update_answer": [
        19
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "for_left": [
        5
      ],
      "for_right": [
        6
      ],
      "for_k": [
        10
      ],
      "is_even": [
        11
      ],
      "balanced": [
        18
      ]
    }
  }
};

const LongestBalancedSubarrayIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums": [
        1,
        2,
        3,
        2,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "All Same",
    "value": {
      "nums": [
        2,
        2,
        2,
        2
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Alternating",
    "value": {
      "nums": [
        1,
        2,
        1,
        2,
        1,
        2
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Mixed",
    "value": {
      "nums": [
        3,
        4,
        1,
        2,
        5,
        6
      ]
    }
  }
];

function generateLongestBalancedSubarrayIiSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],n=t.length,i={};for(let e=0;e<n;e++)i[`arr_${e}`]={type:"arrayElement",value:t[e],position:e,label:"nums"};let a=new StepRecorder({nums:t,n,answer:0,evens:[],odds:[]},i);if(a.record("-","Start: Find the longest subarray holding as many distinct odd values as distinct even ones."),0===n)return a.update_variable("result",0),a.record("complete","Empty array. Answer is 0."),a.getSteps();a.record("init",`n = ${n}, answer = 0. Fix left, then grow right and carry both sets forward.`);let l=0,s=0,d=-1,o=(e,r,i)=>{for(let l=0;l<n;l++){let n=l>=e&&l<=r,s=l===i?"active":n?"window":void 0;a.update_visual(`arr_${l}`,{type:"arrayElement",value:t[l],position:l,label:"nums",...s&&{state:s}})}a.update_visual("ptr_left",{type:"pointer",position:e,label:"left"}),a.update_visual("ptr_right",{type:"pointer",position:r,label:"right"}),a.update_visual("range_window",{type:"range",start:e,end:r,label:"window"})};for(let e=0;e<n;e++){let r=new Set,i=new Set;a.update_variable("left",e),a.update_variable("right",e),a.update_variable("evens",[]),a.update_variable("odds",[]),o(e,e,null),a.add_conditional("for_left",!0),a.record("pick_left",`Fix left = ${e} (nums[${e}] = ${t[e]}).`),a.record("reset_sets","Start this left with empty sets, then extend right one element at a time.");for(let u=e;u<n;u++){let n=t[u],c=n%2==0;a.update_variable("right",u),a.update_variable("cur",n),o(e,u,u),a.add_conditional("for_right",!0),a.add_conditional("is_even",c),a.record("extend_right",`Extend to [${e}..${u}]: nums[${u}] = ${n} is ${c?"even":"odd"}.`);let p=c?r.has(n):i.has(n);c?r.add(n):i.add(n),a.update_variable("evens",[...r]),a.update_variable("odds",[...i]),a.record(c?"add_even":"add_odd",p?`${n} is already in ${c?"evens":"odds"}: sizes stay ${r.size} / ${i.size}.`:`Add ${n} to ${c?"evens":"odds"}: sizes are now ${r.size} / ${i.size}.`);let f=r.size===i.size;if(o(e,u,null),a.add_conditional("balanced",f),a.record("check_balance",`|evens| = ${r.size}, |odds| = ${i.size}: ${f?"balanced":"not balanced"}.`),f){let t=u-e+1,n=l;t>l&&(l=t,s=e,d=u),a.update_variable("span",t),a.update_variable("answer",l),a.update_visual("range_best",{type:"range",start:s,end:d,label:`best: length ${l}`,state:"best"}),a.record("update_answer",`answer = max(${n}, ${t}) = ${l}.`)}}}a.delete_visual("ptr_left"),a.delete_visual("ptr_right"),a.delete_visual("range_window");for(let e=0;e<n;e++){let n=l>0&&e>=s&&e<=d;a.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:"nums",...n&&{state:"result"}})}return a.update_variable("answer",l),a.update_variable("result",l),a.add_conditional("for_left",!1),a.add_conditional("for_right",!1),a.record("complete",`Complete! The longest balanced subarray has length ${l}.`),a.getSteps()
  })(__inputArg);
}

export function LongestBalancedSubarrayIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: LongestBalancedSubarrayIiTemplates,
      generateSteps: (e: any) => {
        const recorded = generateLongestBalancedSubarrayIiSteps(e) as any[];
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
      title="Longest Balanced Subarray II"
      slug="longest-balanced-subarray-ii"
      approaches={approaches}
      presets={LongestBalancedSubarrayIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Number of Pairs Satisfying Inequality (number-of-pairs-satisfying-inequality)
// ==========================================

const NumberOfPairsSatisfyingInequalityTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def numberOfPairs(self, nums1: list[int], nums2: list[int], diff: int) -> int:\n        n = len(nums1)\n\n        # Simplify the inequality into a single array\n        arr = [nums1[i] - nums2[i] for i in range(n)]\n\n        count = 0\n\n        # Check every pair (i, j) with i < j\n        for i in range(n):\n            for j in range(i + 1, n):\n                if arr[i] - arr[j] <= diff:\n                    count += 1\n\n        return count",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "compute_arr": [
        5,
        6
      ],
      "scan_pair": [
        10,
        11,
        12
      ],
      "count_pair": [
        13,
        14
      ],
      "skip_pair": [
        13
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "i_loop": [
        11
      ],
      "j_loop": [
        12
      ],
      "if_valid": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public long numberOfPairs(int[] nums1, int[] nums2, int diff) {\n        int n = nums1.length;\n        int[] arr = new int[n];\n\n        // Simplify the inequality into a single array\n        for (int i = 0; i < n; i++) {\n            arr[i] = nums1[i] - nums2[i];\n        }\n\n        long count = 0;\n\n        // Check every pair (i, j) with i < j\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] - arr[j] <= diff) {\n                    count++;\n                }\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3,
        4
      ],
      "compute_arr": [
        6,
        7,
        8,
        9
      ],
      "scan_pair": [
        13,
        14,
        15
      ],
      "count_pair": [
        16,
        17,
        18
      ],
      "skip_pair": [
        16
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "i_loop": [
        14
      ],
      "j_loop": [
        15
      ],
      "if_valid": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    long long numberOfPairs(vector<int>& nums1, vector<int>& nums2, int diff) {\n        int n = nums1.size();\n        vector<int> arr(n);\n\n        // Simplify the inequality into a single array\n        for (int i = 0; i < n; i++) {\n            arr[i] = nums1[i] - nums2[i];\n        }\n\n        long long count = 0;\n\n        // Check every pair (i, j) with i < j\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] - arr[j] <= diff) {\n                    count++;\n                }\n            }\n        }\n\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3,
        4,
        5
      ],
      "compute_arr": [
        7,
        8,
        9,
        10
      ],
      "scan_pair": [
        14,
        15,
        16
      ],
      "count_pair": [
        17,
        18,
        19
      ],
      "skip_pair": [
        17
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "i_loop": [
        15
      ],
      "j_loop": [
        16
      ],
      "if_valid": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public long NumberOfPairs(int[] nums1, int[] nums2, int diff) {\n        int n = nums1.Length;\n        int[] arr = new int[n];\n\n        // Simplify the inequality into a single array\n        for (int i = 0; i < n; i++) {\n            arr[i] = nums1[i] - nums2[i];\n        }\n\n        long count = 0;\n\n        // Check every pair (i, j) with i < j\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] - arr[j] <= diff) {\n                    count++;\n                }\n            }\n        }\n\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2,
        3,
        4
      ],
      "compute_arr": [
        6,
        7,
        8,
        9
      ],
      "scan_pair": [
        13,
        14,
        15
      ],
      "count_pair": [
        16,
        17,
        18
      ],
      "skip_pair": [
        16
      ],
      "complete": [
        22
      ]
    },
    "conditionalMap": {
      "i_loop": [
        14
      ],
      "j_loop": [
        15
      ],
      "if_valid": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func numberOfPairs(nums1 []int, nums2 []int, diff int) int64 {\n    n := len(nums1)\n    arr := make([]int, n)\n\n    // Simplify the inequality into a single array\n    for i := 0; i < n; i++ {\n        arr[i] = nums1[i] - nums2[i]\n    }\n\n    var count int64\n\n    // Check every pair (i, j) with i < j\n    for i := 0; i < n; i++ {\n        for j := i + 1; j < n; j++ {\n            if arr[i]-arr[j] <= diff {\n                count++\n            }\n        }\n    }\n\n    return count\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compute_arr": [
        5,
        6,
        7,
        8
      ],
      "scan_pair": [
        12,
        13,
        14
      ],
      "count_pair": [
        15,
        16,
        17
      ],
      "skip_pair": [
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "i_loop": [
        13
      ],
      "j_loop": [
        14
      ],
      "if_valid": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var numberOfPairs = function (nums1, nums2, diff) {\n  const n = nums1.length;\n  const arr = new Array(n);\n\n  // Simplify the inequality into a single array\n  for (let i = 0; i < n; i++) {\n    arr[i] = nums1[i] - nums2[i];\n  }\n\n  let count = 0;\n\n  // Check every pair (i, j) with i < j\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      if (arr[i] - arr[j] <= diff) {\n        count++;\n      }\n    }\n  }\n\n  return count;\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compute_arr": [
        5,
        6,
        7,
        8
      ],
      "scan_pair": [
        12,
        13,
        14
      ],
      "count_pair": [
        15,
        16,
        17
      ],
      "skip_pair": [
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "i_loop": [
        13
      ],
      "j_loop": [
        14
      ],
      "if_valid": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function numberOfPairs(nums1: number[], nums2: number[], diff: number): number {\n    const n = nums1.length;\n    const arr: number[] = new Array(n);\n\n    // Simplify the inequality into a single array\n    for (let i = 0; i < n; i++) {\n        arr[i] = nums1[i] - nums2[i];\n    }\n\n    let count = 0;\n\n    // Check every pair (i, j) with i < j\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            if (arr[i] - arr[j] <= diff) {\n                count++;\n            }\n        }\n    }\n\n    return count;\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3
      ],
      "compute_arr": [
        5,
        6,
        7,
        8
      ],
      "scan_pair": [
        12,
        13,
        14
      ],
      "count_pair": [
        15,
        16,
        17
      ],
      "skip_pair": [
        15
      ],
      "complete": [
        21
      ]
    },
    "conditionalMap": {
      "i_loop": [
        13
      ],
      "j_loop": [
        14
      ],
      "if_valid": [
        15
      ]
    }
  }
};

const NumberOfPairsSatisfyingInequalityPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "nums1": [
        3,
        2,
        5
      ],
      "nums2": [
        2,
        2,
        1
      ],
      "diff": 1
    }
  },
  {
    "id": "ex2",
    "label": "Example",
    "value": {
      "nums1": [
        3,
        -1
      ],
      "nums2": [
        -2,
        2
      ],
      "diff": -1
    }
  },
  {
    "id": "ex3",
    "label": "All Same",
    "value": {
      "nums1": [
        1,
        1,
        1,
        1
      ],
      "nums2": [
        1,
        1,
        1,
        1
      ],
      "diff": 0
    }
  },
  {
    "id": "ex4",
    "label": "Larger",
    "value": {
      "nums1": [
        4,
        2,
        6,
        1,
        3
      ],
      "nums2": [
        1,
        3,
        2,
        4,
        1
      ],
      "diff": 2
    }
  }
];

function generateNumberOfPairsSatisfyingInequalitySteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums1],i=[...e.nums2],n=e.diff,a=t.length,l=Array(a);for(let e=0;e<a;e++)l[e]=t[e]-i[e];let s=Math.min(...l),o=Math.max(...l),u=1-s,d=Math.max(o+n+u,o+u,1),c=Array(d+2).fill(0),p=Math.min(d,20),f={};for(let e=0;e<a;e++)f[`n1_${e}`]={type:"arrayElement",value:t[e],position:e,label:"nums1"},f[`n2_${e}`]={type:"arrayElement",value:i[e],position:e,label:"nums2"};for(let e=1;e<=p;e++)f[`bit_${e}`]={type:"arrayElement",value:0,position:e-1,label:"BIT"};let m=new StepRecorder({nums1:t,nums2:i,diff:n,arr:[],count:0,offset:u,size:d,bitShown:p},f),h=e=>{null!==e&&e>=1&&e<=p?m.update_visual("ptr_bit",{type:"pointer",position:e-1,label:"idx"}):m.delete_visual("ptr_bit")};m.record("-","Start: count pairs (i, j) with i < j and nums1[i] - nums1[j] <= nums2[i] - nums2[j] + diff. Rearranged: arr[i] <= arr[j] + diff, where arr = nums1 - nums2");for(let e=0;e<a;e++)m.update_variable("arr",l.slice(0,e+1)),m.update_variable("i",e),m.update_variable("n1v",t[e]),m.update_variable("n2v",i[e]),m.update_variable("arrv",l[e]),m.update_visual(`n1_${e}`,{type:"arrayElement",value:t[e],position:e,label:"nums1",state:"active"}),m.update_visual(`n2_${e}`,{type:"arrayElement",value:i[e],position:e,label:"nums2",state:"active"}),m.add_new_visual(`arr_${e}`,{type:"arrayElement",value:l[e],position:e,label:"arr",state:"highlight"}),m.record("compute_arr",`arr[${e}] = nums1[${e}] - nums2[${e}] = ${t[e]} - ${i[e]} = ${l[e]}`),m.update_visual(`n1_${e}`,{type:"arrayElement",value:t[e],position:e,label:"nums1"}),m.update_visual(`n2_${e}`,{type:"arrayElement",value:i[e],position:e,label:"nums2"}),m.update_visual(`arr_${e}`,{type:"arrayElement",value:l[e],position:e,label:"arr"});let g=0;for(let e=0;e<a;e++){m.update_variable("j",e),m.update_variable("arrj",l[e]),m.update_visual(`arr_${e}`,{type:"arrayElement",value:l[e],position:e,label:"arr",state:"active"}),m.update_visual("ptr_j",{type:"pointer",position:e,label:"j"}),m.record("scan_element",`Process j = ${e}: arr[${e}] = ${l[e]}`);let t=l[e]+n,i=Math.min(t+u,d);if(m.update_variable("thrVal",t),m.update_variable("thrIdx",i),m.record("calc_threshold",`Threshold = arr[${e}] + diff = ${l[e]} + (${n}) = ${t}. Query BIT for values <= ${t} (prefix index ${i})`),i>=1){m.add_conditional("can_query",!0),m.record("query_bit",`Query BIT: how many previously inserted values are <= ${t}? Each one forms a valid pair with j = ${e}`);let r=0,n=i;for(;n>0;){r+=c[n];let e=n-(n&-n);m.update_variable("qIdx",n),m.update_variable("qBit",c[n]),m.update_variable("qSum",r),m.update_variable("qNext",e),h(n),n<=p&&m.update_visual(`bit_${n}`,{type:"arrayElement",value:c[n],position:n-1,label:"BIT",state:"reading"}),m.record("query_traverse",`BIT query: read bit[${n}] = ${c[n]}, running sum = ${r}`),n<=p&&m.update_visual(`bit_${n}`,{type:"arrayElement",value:c[n],position:n-1,label:"BIT"}),n=e}h(null),g+=r,m.update_variable("qRes",r),m.update_variable("count",g),m.record("add_count",`Query result = ${r}. Total count = ${g}`)}else m.add_conditional("can_query",!1),m.record("skip_query",`Threshold index ${i} < 1: no previously inserted value can satisfy the inequality, skip the query`);let r=l[e]+u;m.update_variable("uStart",r),m.record("update_bit",`Insert arr[${e}] = ${l[e]} into BIT at mapped index ${r}`);let a=r;for(;a<=d;){c[a]++;let e=a+(a&-a);m.update_variable("uIdx",a),m.update_variable("uVal",c[a]),m.update_variable("uNext",e),h(a),a<=p&&m.update_visual(`bit_${a}`,{type:"arrayElement",value:c[a],position:a-1,label:"BIT",state:"highlight"}),m.record("update_traverse",`BIT update: increment bit[${a}] to ${c[a]}`),a<=p&&m.update_visual(`bit_${a}`,{type:"arrayElement",value:c[a],position:a-1,label:"BIT"}),a=e}h(null),m.update_visual(`arr_${e}`,{type:"arrayElement",value:l[e],position:e,label:"arr",state:"sorted"})}return m.delete_visual("ptr_j"),m.update_variable("count",g),m.record("complete",`Complete! Total number of valid pairs = ${g}`),m.getSteps()
  })(__inputArg);
}

export function NumberOfPairsSatisfyingInequalityProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: NumberOfPairsSatisfyingInequalityTemplates,
      generateSteps: (e: any) => {
        const recorded = generateNumberOfPairsSatisfyingInequalitySteps(e) as any[];
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
      title="Number of Pairs Satisfying Inequality"
      slug="number-of-pairs-satisfying-inequality"
      approaches={approaches}
      presets={NumberOfPairsSatisfyingInequalityPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Fenwick Tree (Binary Indexed Tree) (fenwick-tree)
// ==========================================

const FenwickTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class FenwickTree:\n    def __init__(self, arr):\n        n = len(arr)\n        self.bit = [0] * (n + 1)\n        for i in range(n):\n            self._add(i + 1, arr[i])\n\n    def _add(self, i, delta):\n        while i < len(self.bit):\n            self.bit[i] += delta\n            i += i & (-i)\n\n    def update(self, i, val):\n        delta = val - self.query_single(i)\n        self._add(i + 1, delta)\n\n    def query(self, i):\n        s = 0\n        i = i + 1\n        while i > 0:\n            s += self.bit[i]\n            i -= i & (-i)\n        return s",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        5,
        6
      ],
      "build_update": [
        9,
        10,
        11
      ],
      "build_done": [
        1,
        2
      ],
      "update_start": [
        13,
        14
      ],
      "update_bit": [
        9,
        10,
        11
      ],
      "update_done": [
        15
      ],
      "query_start": [
        17,
        18,
        19
      ],
      "query_add": [
        20,
        21,
        22
      ],
      "query_done": [
        23
      ],
      "complete": [
        1
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class FenwickTree {\n    int[] bit;\n\n    FenwickTree(int[] arr) {\n        int n = arr.length;\n        bit = new int[n + 1];\n        for (int i = 0; i < n; i++)\n            add(i + 1, arr[i]);\n    }\n\n    void add(int i, int delta) {\n        while (i < bit.length) {\n            bit[i] += delta;\n            i += i & (-i);\n        }\n    }\n\n    void update(int i, int val) {\n        int delta = val - query(i) + query(i - 1);\n        add(i + 1, delta);\n    }\n\n    int query(int i) {\n        int s = 0;\n        i = i + 1;\n        while (i > 0) {\n            s += bit[i];\n            i -= i & (-i);\n        }\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        7,
        8
      ],
      "build_update": [
        12,
        13,
        14
      ],
      "build_done": [
        1,
        4
      ],
      "update_start": [
        18,
        19
      ],
      "update_bit": [
        12,
        13,
        14
      ],
      "update_done": [
        20
      ],
      "query_start": [
        23,
        24,
        25
      ],
      "query_add": [
        26,
        27,
        28
      ],
      "query_done": [
        30
      ],
      "complete": [
        1
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class FenwickTree {\n    vector<int> bit;\n\n    FenwickTree(vector<int>& arr) {\n        int n = arr.size();\n        bit.assign(n + 1, 0);\n        for (int i = 0; i < n; i++)\n            add(i + 1, arr[i]);\n    }\n\n    void add(int i, int delta) {\n        while (i < bit.size()) {\n            bit[i] += delta;\n            i += i & (-i);\n        }\n    }\n\n    void update(int i, int val) {\n        int delta = val - query(i) + query(i - 1);\n        add(i + 1, delta);\n    }\n\n    int query(int i) {\n        int s = 0;\n        i = i + 1;\n        while (i > 0) {\n            s += bit[i];\n            i -= i & (-i);\n        }\n        return s;\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        7,
        8
      ],
      "build_update": [
        12,
        13,
        14
      ],
      "build_done": [
        1,
        4
      ],
      "update_start": [
        18,
        19
      ],
      "update_bit": [
        12,
        13,
        14
      ],
      "update_done": [
        20
      ],
      "query_start": [
        23,
        24,
        25
      ],
      "query_add": [
        26,
        27,
        28
      ],
      "query_done": [
        30
      ],
      "complete": [
        1
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class FenwickTree {\n    int[] bit;\n\n    public FenwickTree(int[] arr) {\n        int n = arr.Length;\n        bit = new int[n + 1];\n        for (int i = 0; i < n; i++)\n            Add(i + 1, arr[i]);\n    }\n\n    void Add(int i, int delta) {\n        while (i < bit.Length) {\n            bit[i] += delta;\n            i += i & (-i);\n        }\n    }\n\n    public void Update(int i, int val) {\n        int delta = val - Query(i) + Query(i - 1);\n        Add(i + 1, delta);\n    }\n\n    public int Query(int i) {\n        int s = 0;\n        i = i + 1;\n        while (i > 0) {\n            s += bit[i];\n            i -= i & (-i);\n        }\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        7,
        8
      ],
      "build_update": [
        12,
        13,
        14
      ],
      "build_done": [
        1,
        4
      ],
      "update_start": [
        18,
        19
      ],
      "update_bit": [
        12,
        13,
        14
      ],
      "update_done": [
        20
      ],
      "query_start": [
        23,
        24,
        25
      ],
      "query_add": [
        26,
        27,
        28
      ],
      "query_done": [
        30
      ],
      "complete": [
        1
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type FenwickTree struct {\n    bit []int\n}\n\nfunc NewFenwickTree(arr []int) *FenwickTree {\n    n := len(arr)\n    ft := &FenwickTree{bit: make([]int, n+1)}\n    for i := 0; i < n; i++ {\n        ft.add(i+1, arr[i])\n    }\n    return ft\n}\n\nfunc (ft *FenwickTree) add(i, delta int) {\n    for i < len(ft.bit) {\n        ft.bit[i] += delta\n        i += i & (-i)\n    }\n}\n\nfunc (ft *FenwickTree) Update(i, val int) {\n    delta := val - ft.Query(i) + ft.Query(i-1)\n    ft.add(i+1, delta)\n}\n\nfunc (ft *FenwickTree) Query(i int) int {\n    s := 0\n    i = i + 1\n    for i > 0 {\n        s += ft.bit[i]\n        i -= i & (-i)\n    }\n    return s\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        8,
        9
      ],
      "build_update": [
        15,
        16,
        17
      ],
      "build_done": [
        1,
        5
      ],
      "update_start": [
        21,
        22
      ],
      "update_bit": [
        15,
        16,
        17
      ],
      "update_done": [
        23
      ],
      "query_start": [
        26,
        27,
        28
      ],
      "query_add": [
        29,
        30,
        31
      ],
      "query_done": [
        33
      ],
      "complete": [
        1
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class FenwickTree {\n    constructor(arr) {\n        const n = arr.length;\n        this.bit = new Array(n + 1).fill(0);\n        for (let i = 0; i < n; i++)\n            this._add(i + 1, arr[i]);\n    }\n\n    _add(i, delta) {\n        while (i < this.bit.length) {\n            this.bit[i] += delta;\n            i += i & (-i);\n        }\n    }\n\n    update(i, val) {\n        const delta = val - this.query(i) + this.query(i - 1);\n        this._add(i + 1, delta);\n    }\n\n    query(i) {\n        let s = 0;\n        i = i + 1;\n        while (i > 0) {\n            s += this.bit[i];\n            i -= i & (-i);\n        }\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        5,
        6
      ],
      "build_update": [
        10,
        11,
        12
      ],
      "build_done": [
        1,
        2
      ],
      "update_start": [
        16,
        17
      ],
      "update_bit": [
        10,
        11,
        12
      ],
      "update_done": [
        18
      ],
      "query_start": [
        21,
        22,
        23
      ],
      "query_add": [
        24,
        25,
        26
      ],
      "query_done": [
        28
      ],
      "complete": [
        1
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class FenwickTree {\n    private bit: number[];\n\n    constructor(arr: number[]) {\n        const n = arr.length;\n        this.bit = new Array(n + 1).fill(0);\n        for (let i = 0; i < n; i++)\n            this._add(i + 1, arr[i]);\n    }\n\n    private _add(i: number, delta: number): void {\n        while (i < this.bit.length) {\n            this.bit[i] += delta;\n            i += i & (-i);\n        }\n    }\n\n    update(i: number, val: number): void {\n        const delta = val - this.query(i) + this.query(i - 1);\n        this._add(i + 1, delta);\n    }\n\n    query(i: number): number {\n        let s = 0;\n        i = i + 1;\n        while (i > 0) {\n            s += this.bit[i];\n            i -= i & (-i);\n        }\n        return s;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_pick": [
        7,
        8
      ],
      "build_update": [
        12,
        13,
        14
      ],
      "build_done": [
        1,
        4
      ],
      "update_start": [
        18,
        19
      ],
      "update_bit": [
        12,
        13,
        14
      ],
      "update_done": [
        20
      ],
      "query_start": [
        23,
        24,
        25
      ],
      "query_add": [
        26,
        27,
        28
      ],
      "query_done": [
        30
      ],
      "complete": [
        1
      ]
    }
  }
};

const FenwickTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        9,
        2
      ],
      "updateIndex": 2,
      "updateValue": 10,
      "queryIndex": 4
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        2,
        4,
        6,
        8
      ],
      "updateIndex": 1,
      "updateValue": 7,
      "queryIndex": 3
    }
  },
  {
    "id": "ex3",
    "label": "Larger",
    "value": {
      "arr": [
        5,
        1,
        3,
        2,
        8,
        6,
        4,
        7
      ],
      "updateIndex": 3,
      "updateValue": 9,
      "queryIndex": 5
    }
  },
  {
    "id": "ex4",
    "label": "Multiples of 10",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ],
      "updateIndex": 0,
      "updateValue": 15,
      "queryIndex": 2
    }
  }
];

function generateFenwickTreeSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.arr],i=e.updateIndex,r=e.updateValue,l=e.queryIndex,n=t.length,s=Array(n+1).fill(0),d={};for(let e=0;e<n;e++)d[`bar_${e}`]={type:"arrayElement",value:t[e],position:e,label:`${e}`};for(let e=1;e<=n;e++)d[`bit_${e}`]={type:"arrayElement",value:0,position:e-1,label:`${e}`};d.meta_phase={type:"metadata",value:"build"};let u=new StepRecorder({phase:"Build",i:void 0,j:void 0,sum:void 0},d);u.record("-","Start: Demonstrate Fenwick Tree (Binary Indexed Tree) operations, build, point update, and prefix sum query."),u.update_variable("phase","Build");for(let e=0;e<n;e++){let i=t[e];u.update_variable("i",e),u.update_visual(`bar_${e}`,{type:"arrayElement",value:i,position:e,label:`${e}`,state:"active"}),u.record("build_pick",`Build: Adding arr[${e}] = ${i} to the BIT.`);let a=e+1;for(;a<=n;)u.update_variable("j",a),u.update_visual(`bit_${a}`,{type:"arrayElement",value:s[a],position:a-1,label:`${a}`,state:"highlight"}),u.record("build_update",`BIT[${a}] += ${i}  (${s[a]} + ${i} = ${s[a]+i}). Next index: ${a} + (${a} & -${a}) = ${a+(a&-a)}.`),s[a]+=i,u.update_visual(`bit_${a}`,{type:"arrayElement",value:s[a],position:a-1,label:`${a}`,state:"active"}),a+=a&-a;u.update_variable("j",void 0),u.update_visual(`bar_${e}`,{type:"arrayElement",value:i,position:e,label:`${e}`,state:"complete"});for(let e=1;e<=n;e++)u.update_visual(`bit_${e}`,{type:"arrayElement",value:s[e],position:e-1,label:`${e}`,state:void 0})}for(let e=0;e<n;e++)u.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"complete"});u.update_variable("i",void 0),u.record("build_done",`Build complete. BIT constructed from array [${t.join(", ")}].`),u.update_visual("meta_phase",{type:"metadata",value:"update"}),u.update_variable("phase","Update"),u.update_variable("i",i);let o=r-t[i],p=t[i];t[i]=r,u.update_visual(`bar_${i}`,{type:"arrayElement",value:r,position:i,label:`${i}`,state:"highlight"}),u.record("update_start",`Update: Change arr[${i}] from ${p} to ${r}. Delta = ${r} - ${p} = ${o}.`);let c=i+1;for(;c<=n;)u.update_variable("j",c),u.update_visual(`bit_${c}`,{type:"arrayElement",value:s[c],position:c-1,label:`${c}`,state:"highlight"}),u.record("update_bit",`BIT[${c}] += ${o}  (${s[c]} + ${o} = ${s[c]+o}). Next: ${c} + (${c} & -${c}) = ${c+(c&-c)}.`),s[c]+=o,u.update_visual(`bit_${c}`,{type:"arrayElement",value:s[c],position:c-1,label:`${c}`,state:"active"}),c+=c&-c;u.update_variable("j",void 0),u.update_visual(`bar_${i}`,{type:"arrayElement",value:r,position:i,label:`${i}`,state:"complete"});for(let e=1;e<=n;e++)u.update_visual(`bit_${e}`,{type:"arrayElement",value:s[e],position:e-1,label:`${e}`,state:void 0});u.record("update_done",`Update complete. arr[${i}] is now ${r}.`),u.update_visual("meta_phase",{type:"metadata",value:"query"}),u.update_variable("phase","Query"),u.update_variable("i",l);let h=0;for(u.update_variable("sum",h),u.record("query_start",`Query: Compute prefix sum from index 0 to ${l} (BIT index ${l+1}).`),c=l+1;c>0;){u.update_variable("j",c),u.update_visual(`bit_${c}`,{type:"arrayElement",value:s[c],position:c-1,label:`${c}`,state:"highlight"}),u.record("query_add",`sum += BIT[${c}] = ${s[c]}  (sum = ${h} + ${s[c]} = ${h+s[c]}). Next: ${c} - (${c} & -${c}) = ${c-(c&-c)}.`),h+=s[c],u.update_variable("sum",h),u.update_visual(`bit_${c}`,{type:"arrayElement",value:s[c],position:c-1,label:`${c}`,state:"active"});for(let e=0;e<=l;e++)u.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"active"});c-=c&-c}u.update_variable("j",void 0);for(let e=1;e<=n;e++)u.update_visual(`bit_${e}`,{type:"arrayElement",value:s[e],position:e-1,label:`${e}`,state:void 0});return u.record("query_done",`Query complete. Prefix sum arr[0..${l}] = ${h}.`),u.update_visual("meta_phase",{type:"metadata",value:"done"}),u.record("complete",`Done! Built Fenwick Tree, updated index ${i} to ${r}, and queried prefix sum [0..${l}] = ${h}.`),u.getSteps()
  })(__inputArg);
}

export function FenwickTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FenwickTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateFenwickTreeSteps(e) as any[];
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
      title="Fenwick Tree (Binary Indexed Tree)"
      slug="fenwick-tree"
      approaches={approaches}
      presets={FenwickTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Module (range-module)
// ==========================================

const RangeModuleTemplates = {
  "python": {
    "language": "python",
    "code": "from sortedcontainers import SortedDict\n\nclass RangeModule:\n    def __init__(self):\n        self.map = SortedDict()\n\n    def addRange(self, left: int, right: int) -> None:\n        # Find intervals that overlap with [left, right)\n        idx = self.map.bisect_right(left)\n        if idx > 0:\n            prev_start = self.map.keys()[idx - 1]\n            if self.map[prev_start] >= left:\n                left = prev_start\n\n        idx = self.map.bisect_right(right)\n        if idx > 0:\n            prev_start = self.map.keys()[idx - 1]\n            if self.map[prev_start] > left:\n                right = max(right, self.map[prev_start])\n\n        # Remove all overlapping intervals\n        keys_to_remove = list(self.map.irange(left, right, (True, False)))\n        for key in keys_to_remove:\n            del self.map[key]\n\n        self.map[left] = right\n\n    def queryRange(self, left: int, right: int) -> bool:\n        idx = self.map.bisect_right(left)\n        if idx == 0:\n            return False\n        prev_start = self.map.keys()[idx - 1]\n        return self.map[prev_start] >= right\n\n    def removeRange(self, left: int, right: int) -> None:\n        # Save portions that extend beyond the removal range\n        idx = self.map.bisect_right(left)\n        if idx > 0:\n            prev_start = self.map.keys()[idx - 1]\n            prev_end = self.map[prev_start]\n            if prev_end > left:\n                self.map[prev_start] = left  # Keep [prev_start, left)\n                if prev_end > right:\n                    self.map[right] = prev_end  # Keep [right, prev_end)\n\n        idx = self.map.bisect_right(right)\n        if idx > 0:\n            prev_start = self.map.keys()[idx - 1]\n            if prev_start >= left and self.map[prev_start] > right:\n                self.map[right] = self.map[prev_start]\n\n        # Remove all intervals starting in [left, right)\n        keys_to_remove = list(self.map.irange(left, right, (True, False)))\n        for key in keys_to_remove:\n            del self.map[key]",
    "lineMap": {
      "-": [
        5
      ],
      "start_add": [
        7
      ],
      "find_overlaps_add": [
        9,
        10,
        11,
        12
      ],
      "merge_intervals": [
        13,
        15,
        16,
        17,
        18,
        19
      ],
      "insert_merged": [
        22,
        23,
        24
      ],
      "add_done": [
        26
      ],
      "start_query": [
        28
      ],
      "find_overlaps_query": [
        29,
        30,
        31,
        32
      ],
      "check_coverage": [
        33
      ],
      "query_result": [
        33
      ],
      "query_done": [
        33
      ],
      "start_remove": [
        35
      ],
      "find_overlaps_remove": [
        37,
        38,
        39,
        40,
        41
      ],
      "split_intervals": [
        42,
        43,
        44
      ],
      "remove_covered": [
        46,
        47,
        48,
        49,
        50
      ],
      "remove_done": [
        53,
        54,
        55
      ],
      "complete": [
        55
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        33
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class RangeModule {\n    TreeMap<Integer, Integer> map;\n\n    public RangeModule() {\n        map = new TreeMap<>();\n    }\n\n    public void addRange(int left, int right) {\n        // Check if an interval starting at or before 'left' extends into our range\n        Integer start = map.floorKey(left);\n        if (start != null && map.get(start) >= left) {\n            left = start;\n        }\n        // Check if an interval starting at or before 'right' extends past our range\n        Integer end = map.floorKey(right);\n        if (end != null && map.get(end) > left) {\n            right = Math.max(right, map.get(end));\n        }\n        // Remove all intervals that are fully covered by [left, right)\n        map.subMap(left, right).clear();\n        map.put(left, right);\n    }\n\n    public boolean queryRange(int left, int right) {\n        Integer start = map.floorKey(left);\n        return start != null && map.get(start) >= right;\n    }\n\n    public void removeRange(int left, int right) {\n        // Check if an interval starting at or before 'left' needs its left portion saved\n        Integer start = map.floorKey(left);\n        if (start != null && map.get(start) > left) {\n            int originalEnd = map.get(start);\n            map.put(start, left);  // Keep the left portion [start, left)\n            if (originalEnd > right) {\n                map.put(right, originalEnd);  // Keep the right portion [right, originalEnd)\n            }\n        }\n        // Check if an interval starting at or before 'right' needs its right portion saved\n        Integer end = map.floorKey(right);\n        if (end != null && end >= left && map.get(end) > right) {\n            map.put(right, map.get(end));  // Keep [right, end_value)\n        }\n        // Remove all intervals fully within [left, right)\n        map.subMap(left, right).clear();\n    }\n}",
    "lineMap": {
      "-": [
        5
      ],
      "start_add": [
        8
      ],
      "find_overlaps_add": [
        10,
        11
      ],
      "merge_intervals": [
        12,
        15,
        16,
        17
      ],
      "insert_merged": [
        20
      ],
      "add_done": [
        21
      ],
      "start_query": [
        24
      ],
      "find_overlaps_query": [
        25
      ],
      "check_coverage": [
        26
      ],
      "query_result": [
        26
      ],
      "query_done": [
        26
      ],
      "start_remove": [
        29
      ],
      "find_overlaps_remove": [
        31,
        32
      ],
      "split_intervals": [
        33,
        34,
        35,
        36
      ],
      "remove_covered": [
        40,
        41,
        42
      ],
      "remove_done": [
        45
      ],
      "complete": [
        46
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class RangeModule {\n    map<int, int> intervals; // start -> end\n\npublic:\n    RangeModule() {}\n\n    void addRange(int left, int right) {\n        // Find all overlapping intervals and merge\n        auto it = intervals.upper_bound(left);\n        if (it != intervals.begin()) {\n            --it;\n            if (it->second >= left) {\n                left = it->first;\n            } else {\n                ++it;\n            }\n        }\n        // Extend right to cover all overlapping intervals\n        while (it != intervals.end() && it->first <= right) {\n            right = max(right, it->second);\n            it = intervals.erase(it);\n        }\n        intervals[left] = right;\n    }\n\n    bool queryRange(int left, int right) {\n        auto it = intervals.upper_bound(left);\n        if (it == intervals.begin()) return false;\n        --it;\n        return it->second >= right;\n    }\n\n    void removeRange(int left, int right) {\n        auto it = intervals.upper_bound(left);\n        if (it != intervals.begin()) {\n            --it;\n            if (it->second > left) {\n                int origStart = it->first;\n                int origEnd = it->second;\n                if (origEnd > right) {\n                    intervals[right] = origEnd; // Keep [right, origEnd)\n                }\n                if (origStart < left) {\n                    it->second = left; // Keep [origStart, left)\n                    ++it;\n                } else {\n                    // origStart == left: this interval is fully inside [left, right)\n                    it = intervals.erase(it);\n                }\n            } else {\n                ++it;\n            }\n        }\n        // Remove intervals starting in [left, right) and handle the last one\n        while (it != intervals.end() && it->first < right) {\n            if (it->second > right) {\n                intervals[right] = it->second; // Keep [right, it->second)\n                it = intervals.erase(it);\n                break;\n            }\n            it = intervals.erase(it);\n        }\n    }\n};",
    "lineMap": {
      "-": [
        2
      ],
      "start_add": [
        7
      ],
      "find_overlaps_add": [
        9,
        10,
        11,
        12
      ],
      "merge_intervals": [
        13,
        15,
        16
      ],
      "insert_merged": [
        19,
        20,
        21
      ],
      "add_done": [
        23
      ],
      "start_query": [
        26
      ],
      "find_overlaps_query": [
        27,
        28,
        29
      ],
      "check_coverage": [
        30
      ],
      "query_result": [
        30
      ],
      "query_done": [
        30
      ],
      "start_remove": [
        33
      ],
      "find_overlaps_remove": [
        34,
        35,
        36,
        37
      ],
      "split_intervals": [
        38,
        39,
        40,
        41,
        43,
        44
      ],
      "remove_covered": [
        48,
        55,
        56,
        57,
        58
      ],
      "remove_done": [
        61
      ],
      "complete": [
        63
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        30
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class RangeModule {\n    SortedDictionary<int, int> map;\n\n    public RangeModule() {\n        map = new SortedDictionary<int, int>();\n    }\n\n    public void AddRange(int left, int right) {\n        // Find and merge overlapping intervals\n        var toRemove = new List<int>();\n\n        foreach (var kvp in map) {\n            if (kvp.Key > right) break;\n            if (kvp.Value < left) continue;\n            // Overlapping interval\n            left = Math.Min(left, kvp.Key);\n            right = Math.Max(right, kvp.Value);\n            toRemove.Add(kvp.Key);\n        }\n\n        foreach (var key in toRemove) {\n            map.Remove(key);\n        }\n        map[left] = right;\n    }\n\n    public bool QueryRange(int left, int right) {\n        // Find the interval that could contain [left, right)\n        foreach (var kvp in map) {\n            if (kvp.Key > left) return false;\n            if (kvp.Key <= left && kvp.Value >= right) return true;\n        }\n        return false;\n    }\n\n    public void RemoveRange(int left, int right) {\n        var toRemove = new List<int>();\n        var toAdd = new List<int[]>();\n\n        foreach (var kvp in map) {\n            if (kvp.Key >= right) break;\n            if (kvp.Value <= left) continue;\n            // Overlapping interval\n            toRemove.Add(kvp.Key);\n            if (kvp.Key < left) toAdd.Add(new int[]{kvp.Key, left});\n            if (kvp.Value > right) toAdd.Add(new int[]{right, kvp.Value});\n        }\n\n        foreach (var key in toRemove) map.Remove(key);\n        foreach (var interval in toAdd) map[interval[0]] = interval[1];\n    }\n}",
    "lineMap": {
      "-": [
        5
      ],
      "start_add": [
        8
      ],
      "find_overlaps_add": [
        10,
        12,
        13,
        14
      ],
      "merge_intervals": [
        16,
        17,
        18
      ],
      "insert_merged": [
        21,
        22,
        23
      ],
      "add_done": [
        24
      ],
      "start_query": [
        27
      ],
      "find_overlaps_query": [
        29,
        30
      ],
      "check_coverage": [
        31
      ],
      "query_result": [
        31
      ],
      "query_done": [
        33
      ],
      "start_remove": [
        36
      ],
      "find_overlaps_remove": [
        37,
        38,
        40,
        41,
        42
      ],
      "split_intervals": [
        44,
        45,
        46
      ],
      "remove_covered": [
        49
      ],
      "remove_done": [
        50
      ],
      "complete": [
        51
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        31
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type RangeModule struct {\n    starts []int\n    ends   []int\n}\n\nfunc Constructor() RangeModule {\n    return RangeModule{}\n}\n\nfunc (rm *RangeModule) AddRange(left int, right int) {\n    newStarts := []int{}\n    newEnds := []int{}\n    inserted := false\n\n    for i := 0; i < len(rm.starts); i++ {\n        if rm.ends[i] < left {\n            newStarts = append(newStarts, rm.starts[i])\n            newEnds = append(newEnds, rm.ends[i])\n        } else if rm.starts[i] > right {\n            if !inserted {\n                newStarts = append(newStarts, left)\n                newEnds = append(newEnds, right)\n                inserted = true\n            }\n            newStarts = append(newStarts, rm.starts[i])\n            newEnds = append(newEnds, rm.ends[i])\n        } else {\n            if rm.starts[i] < left {\n                left = rm.starts[i]\n            }\n            if rm.ends[i] > right {\n                right = rm.ends[i]\n            }\n        }\n    }\n\n    if !inserted {\n        newStarts = append(newStarts, left)\n        newEnds = append(newEnds, right)\n    }\n    rm.starts = newStarts\n    rm.ends = newEnds\n}\n\nfunc (rm *RangeModule) QueryRange(left int, right int) bool {\n    lo, hi := 0, len(rm.starts)-1\n    for lo <= hi {\n        mid := lo + (hi-lo)/2\n        if rm.starts[mid] <= left {\n            lo = mid + 1\n        } else {\n            hi = mid - 1\n        }\n    }\n    if hi < 0 {\n        return false\n    }\n    return rm.ends[hi] >= right\n}\n\nfunc (rm *RangeModule) RemoveRange(left int, right int) {\n    newStarts := []int{}\n    newEnds := []int{}\n\n    for i := 0; i < len(rm.starts); i++ {\n        if rm.ends[i] <= left || rm.starts[i] >= right {\n            newStarts = append(newStarts, rm.starts[i])\n            newEnds = append(newEnds, rm.ends[i])\n        } else {\n            if rm.starts[i] < left {\n                newStarts = append(newStarts, rm.starts[i])\n                newEnds = append(newEnds, left)\n            }\n            if rm.ends[i] > right {\n                newStarts = append(newStarts, right)\n                newEnds = append(newEnds, rm.ends[i])\n            }\n        }\n    }\n    rm.starts = newStarts\n    rm.ends = newEnds\n}",
    "lineMap": {
      "-": [
        7
      ],
      "start_add": [
        10
      ],
      "find_overlaps_add": [
        11,
        12,
        13,
        15,
        16
      ],
      "insert_merged": [
        20,
        21,
        22,
        23
      ],
      "merge_intervals": [
        27,
        28,
        29,
        31,
        32
      ],
      "add_done": [
        37,
        38,
        39,
        41,
        42
      ],
      "start_query": [
        45
      ],
      "find_overlaps_query": [
        46,
        47,
        48,
        49
      ],
      "check_coverage": [
        58
      ],
      "query_result": [
        55,
        56
      ],
      "query_done": [
        58
      ],
      "start_remove": [
        61
      ],
      "find_overlaps_remove": [
        62,
        63,
        65,
        66
      ],
      "remove_covered": [
        67,
        68
      ],
      "split_intervals": [
        70,
        71,
        72,
        74,
        75,
        76
      ],
      "remove_done": [
        80,
        81
      ],
      "complete": [
        81
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        58
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var RangeModule = function() {\n    this.map = new Map();\n    this.keys = []; // Sorted array of start keys\n};\n\nRangeModule.prototype._bisectRight = function(arr, val) {\n    let lo = 0, hi = arr.length;\n    while (lo < hi) {\n        const mid = (lo + hi) >> 1;\n        if (arr[mid] <= val) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n};\n\nRangeModule.prototype.addRange = function(left, right) {\n    const newKeys = [];\n    const newMap = new Map();\n    let inserted = false;\n\n    for (const start of this.keys) {\n        const end = this.map.get(start);\n        if (end < left) {\n            newKeys.push(start);\n            newMap.set(start, end);\n        } else if (start > right) {\n            if (!inserted) {\n                newKeys.push(left);\n                newMap.set(left, right);\n                inserted = true;\n            }\n            newKeys.push(start);\n            newMap.set(start, end);\n        } else {\n            left = Math.min(left, start);\n            right = Math.max(right, end);\n        }\n    }\n\n    if (!inserted) {\n        newKeys.push(left);\n        newMap.set(left, right);\n    }\n    this.keys = newKeys;\n    this.map = newMap;\n};\n\nRangeModule.prototype.queryRange = function(left, right) {\n    const idx = this._bisectRight(this.keys, left);\n    if (idx === 0) return false;\n    const start = this.keys[idx - 1];\n    return this.map.get(start) >= right;\n};\n\nRangeModule.prototype.removeRange = function(left, right) {\n    const newKeys = [];\n    const newMap = new Map();\n\n    for (const start of this.keys) {\n        const end = this.map.get(start);\n        if (end <= left || start >= right) {\n            newKeys.push(start);\n            newMap.set(start, end);\n        } else {\n            if (start < left) {\n                newKeys.push(start);\n                newMap.set(start, left);\n            }\n            if (end > right) {\n                newKeys.push(right);\n                newMap.set(right, end);\n            }\n        }\n    }\n    this.keys = newKeys;\n    this.map = newMap;\n};",
    "lineMap": {
      "-": [
        2,
        3
      ],
      "start_add": [
        16
      ],
      "find_overlaps_add": [
        17,
        18,
        21,
        22,
        23
      ],
      "insert_merged": [
        27,
        28,
        29,
        30
      ],
      "merge_intervals": [
        34,
        35,
        36
      ],
      "add_done": [
        40,
        41,
        42,
        44,
        45
      ],
      "start_query": [
        48
      ],
      "find_overlaps_query": [
        49,
        50,
        51
      ],
      "check_coverage": [
        52
      ],
      "query_result": [
        52
      ],
      "query_done": [
        52
      ],
      "start_remove": [
        55
      ],
      "find_overlaps_remove": [
        56,
        57,
        59,
        60,
        61
      ],
      "remove_covered": [
        62,
        63
      ],
      "split_intervals": [
        65,
        66,
        67,
        69,
        70,
        71
      ],
      "remove_done": [
        75,
        76
      ],
      "complete": [
        76
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        52
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class RangeModule {\n    private map: Map<number, number>;\n    private keys: number[];\n\n    constructor() {\n        this.map = new Map();\n        this.keys = [];\n    }\n\n    private bisectRight(arr: number[], val: number): number {\n        let lo = 0, hi = arr.length;\n        while (lo < hi) {\n            const mid = (lo + hi) >> 1;\n            if (arr[mid] <= val) lo = mid + 1;\n            else hi = mid;\n        }\n        return lo;\n    }\n\n    addRange(left: number, right: number): void {\n        const newKeys: number[] = [];\n        const newMap = new Map<number, number>();\n        let inserted = false;\n\n        for (const start of this.keys) {\n            const end = this.map.get(start)!;\n            if (end < left) {\n                newKeys.push(start);\n                newMap.set(start, end);\n            } else if (start > right) {\n                if (!inserted) {\n                    newKeys.push(left);\n                    newMap.set(left, right);\n                    inserted = true;\n                }\n                newKeys.push(start);\n                newMap.set(start, end);\n            } else {\n                left = Math.min(left, start);\n                right = Math.max(right, end);\n            }\n        }\n\n        if (!inserted) {\n            newKeys.push(left);\n            newMap.set(left, right);\n        }\n        this.keys = newKeys;\n        this.map = newMap;\n    }\n\n    queryRange(left: number, right: number): boolean {\n        const idx = this.bisectRight(this.keys, left);\n        if (idx === 0) return false;\n        const start = this.keys[idx - 1];\n        return this.map.get(start)! >= right;\n    }\n\n    removeRange(left: number, right: number): void {\n        const newKeys: number[] = [];\n        const newMap = new Map<number, number>();\n\n        for (const start of this.keys) {\n            const end = this.map.get(start)!;\n            if (end <= left || start >= right) {\n                newKeys.push(start);\n                newMap.set(start, end);\n            } else {\n                if (start < left) {\n                    newKeys.push(start);\n                    newMap.set(start, left);\n                }\n                if (end > right) {\n                    newKeys.push(right);\n                    newMap.set(right, end);\n                }\n            }\n        }\n        this.keys = newKeys;\n        this.map = newMap;\n    }\n}",
    "lineMap": {
      "-": [
        6,
        7
      ],
      "start_add": [
        20
      ],
      "find_overlaps_add": [
        21,
        22,
        25,
        26,
        27
      ],
      "insert_merged": [
        31,
        32,
        33,
        34
      ],
      "merge_intervals": [
        38,
        39,
        40
      ],
      "add_done": [
        44,
        45,
        46,
        48,
        49
      ],
      "start_query": [
        52
      ],
      "find_overlaps_query": [
        53,
        54,
        55
      ],
      "check_coverage": [
        56
      ],
      "query_result": [
        56
      ],
      "query_done": [
        56
      ],
      "start_remove": [
        59
      ],
      "find_overlaps_remove": [
        60,
        61,
        63,
        64,
        65
      ],
      "remove_covered": [
        66,
        67
      ],
      "split_intervals": [
        69,
        70,
        71,
        73,
        74,
        75
      ],
      "remove_done": [
        79,
        80
      ],
      "complete": [
        81
      ]
    },
    "conditionalMap": {
      "check_coverage": [
        56
      ]
    }
  }
};

const RangeModulePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "LeetCode Example",
    "value": {
      "operations": [
        "RangeModule",
        "addRange",
        "addRange",
        "queryRange",
        "queryRange",
        "removeRange",
        "queryRange"
      ],
      "values": [
        null,
        [
          10,
          20
        ],
        [
          14,
          16
        ],
        [
          10,
          14
        ],
        [
          13,
          15
        ],
        [
          14,
          16
        ],
        [
          10,
          14
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Merge & Remove",
    "value": {
      "operations": [
        "RangeModule",
        "addRange",
        "addRange",
        "addRange",
        "queryRange",
        "removeRange",
        "queryRange"
      ],
      "values": [
        null,
        [
          1,
          5
        ],
        [
          6,
          10
        ],
        [
          3,
          8
        ],
        [
          2,
          9
        ],
        [
          4,
          7
        ],
        [
          2,
          9
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Large Range",
    "value": {
      "operations": [
        "RangeModule",
        "addRange",
        "queryRange",
        "removeRange",
        "addRange",
        "queryRange"
      ],
      "values": [
        null,
        [
          1,
          100
        ],
        [
          50,
          60
        ],
        [
          25,
          75
        ],
        [
          40,
          60
        ],
        [
          30,
          70
        ]
      ]
    }
  }
];

function generateRangeModuleSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.operations||[],r=e.values||[],a=new StepRecorder({operation:"",result:""},{}),i=[];function l(e,t,r){for(let e of Object.keys(a.getCurrentVisuals()))e.startsWith("meta_interval_")&&a.delete_visual(e);for(let e=0;e<i.length;e++)a.add_new_visual(`meta_interval_${e}`,{type:"metadata",value:{left:i[e][0],right:i[e][1],state:"tracked"}});a.update_visual("meta_intervals_data",{type:"metadata",value:i.map(([e,t])=>[e,t])}),void 0!==e&&void 0!==t?a.update_visual("meta_op_range",{type:"metadata",value:{left:e,right:t,state:r||"highlight"}}):a.getCurrentVisuals().meta_op_range&&a.delete_visual("meta_op_range")}a.add_new_visual("meta_intervals_data",{type:"metadata",value:[]}),a.add_new_visual("meta_result",{type:"metadata",value:""}),a.record("-","Initialize RangeModule with empty interval set");for(let e=0;e<t.length;e++){let n=t[e],o=r[e];if("RangeModule"===n)continue;let s=o[0],d=o[1];if(a.update_variable("operation",`${n}(${s}, ${d})`),a.update_variable("result",""),a.update_visual("meta_result",{type:"metadata",value:""}),"addRange"===n){l(s,d,"add"),a.record("start_add",`addRange(${s}, ${d}): Add range [${s}, ${d}) to tracked set`);let e=s,t=d,r=[];for(let e=0;e<i.length;e++)i[e][1]>=s&&i[e][0]<=d&&r.push(e);if(l(s,d,"add"),r.length>0?a.record("find_overlaps_add",`Found ${r.length} overlapping interval(s) with [${s}, ${d})`):a.record("find_overlaps_add",`No overlapping intervals found for [${s}, ${d})`),r.length>0){for(let n of r)e=Math.min(e,i[n][0]),t=Math.max(t,i[n][1]);a.record("merge_intervals",`Merge: new interval becomes [${e}, ${t})`)}else a.record("merge_intervals",`No merge needed, inserting [${e}, ${t}) directly`);let n=[],o=!1;for(let a=0;a<i.length;a++)r.includes(a)?o||(n.push([e,t]),o=!0):(!o&&i[a][0]>t&&(n.push([e,t]),o=!0),n.push(i[a]));o||n.push([e,t]),i=n,l(e,t,"added"),a.record("insert_merged",`Inserted merged interval [${e}, ${t})`),l(),a.record("add_done",`addRange complete. Tracked: ${i.map(([e,t])=>`[${e},${t})`).join(", ")||"none"}`)}else if("removeRange"===n){l(s,d,"remove"),a.record("start_remove",`removeRange(${s}, ${d}): Remove range [${s}, ${d}) from tracked set`);let e=[];for(let t=0;t<i.length;t++)i[t][1]>s&&i[t][0]<d&&e.push(t);l(s,d,"remove"),e.length>0?a.record("find_overlaps_remove",`Found ${e.length} overlapping interval(s) with [${s}, ${d})`):a.record("find_overlaps_remove",`No overlapping intervals found for [${s}, ${d})`);let t=[];for(let r=0;r<i.length;r++)e.includes(r)?(i[r][0]<s&&t.push([i[r][0],s]),i[r][1]>d&&t.push([d,i[r][1]])):t.push(i[r]);i=t,l(s,d,"removed"),a.record("split_intervals",`Split/trimmed overlapping intervals around [${s}, ${d})`),l(s,d,"removed"),a.record("remove_covered","Removed covered portions of intervals"),l(),a.record("remove_done",`removeRange complete. Tracked: ${i.map(([e,t])=>`[${e},${t})`).join(", ")||"none"}`)}else if("queryRange"===n){l(s,d,"query"),a.record("start_query",`queryRange(${s}, ${d}): Check if [${s}, ${d}) is fully tracked`);let e=null;for(let t=0;t<i.length;t++)if(i[t][0]<=s&&i[t][1]>=d){e=i[t];break}l(s,d,"query"),a.record("find_overlaps_query",e?`Found covering interval [${e[0]}, ${e[1]})`:`No single interval fully covers [${s}, ${d})`);let t=null!==e;a.add_conditional("check_coverage",t),l(s,d,t?"covered":"not_covered"),a.record("check_coverage",`Check coverage: ${t?"fully covered":"not fully covered"}`);let r=t?"true":"false";a.update_variable("result",r),a.update_visual("meta_result",{type:"metadata",value:r}),l(s,d,t?"covered":"not_covered"),a.record("query_result",`queryRange(${s}, ${d}) returns ${r}`),l(),a.record("query_done",`queryRange complete. Result: ${r}`)}}return l(),a.record("complete",`All operations completed. Final tracked: ${i.map(([e,t])=>`[${e},${t})`).join(", ")||"none"}`),a.getSteps()
  })(__inputArg);
}

export function RangeModuleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeModuleTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeModuleSteps(e) as any[];
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
      title="Range Module"
      slug="range-module"
      approaches={approaches}
      presets={RangeModulePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Sum Query 2D - Immutable (range-sum-query-2d-immutable)
// ==========================================

const RangeSumQuery2dImmutableTemplates = {
  "python": {
    "language": "python",
    "code": "class NumMatrix:\n    def __init__(self, matrix):\n        m, n = len(matrix), len(matrix[0])\n        self.prefix = [[0] * (n + 1) for _ in range(m + 1)]\n\n        # Build 2D prefix sum with inclusion-exclusion\n        for i in range(m):\n            for j in range(n):\n                self.prefix[i + 1][j + 1] = (matrix[i][j]\n                    + self.prefix[i][j + 1]\n                    + self.prefix[i + 1][j]\n                    - self.prefix[i][j])\n\n    def sumRegion(self, row1, col1, row2, col2):\n        # Inclusion-exclusion on prefix sums\n        return (self.prefix[row2 + 1][col2 + 1]\n            - self.prefix[row1][col2 + 1]\n            - self.prefix[row2 + 1][col1]\n            + self.prefix[row1][col1])",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        9,
        10,
        11,
        12
      ],
      "query_setup": [
        14
      ],
      "query_add": [
        16
      ],
      "query_sub1": [
        17
      ],
      "query_sub2": [
        18
      ],
      "query_add_back": [
        19
      ],
      "complete": [
        16,
        17,
        18,
        19
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class NumMatrix {\n    private int[][] prefix;\n\n    public NumMatrix(int[][] matrix) {\n        int m = matrix.length;\n        int n = matrix[0].length;\n        prefix = new int[m + 1][n + 1];\n\n        // Build 2D prefix sum with inclusion-exclusion\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                prefix[i + 1][j + 1] = matrix[i][j]\n                    + prefix[i][j + 1]\n                    + prefix[i + 1][j]\n                    - prefix[i][j];\n            }\n        }\n    }\n\n    public int sumRegion(int row1, int col1, int row2, int col2) {\n        // Inclusion-exclusion on prefix sums\n        return prefix[row2 + 1][col2 + 1]\n            - prefix[row1][col2 + 1]\n            - prefix[row2 + 1][col1]\n            + prefix[row1][col1];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        12,
        13,
        14,
        15
      ],
      "query_setup": [
        20
      ],
      "query_add": [
        22
      ],
      "query_sub1": [
        23
      ],
      "query_sub2": [
        24
      ],
      "query_add_back": [
        25
      ],
      "complete": [
        22,
        23,
        24,
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class NumMatrix {\n    vector<vector<int>> prefix;\n\n    NumMatrix(vector<vector<int>>& matrix) {\n        int m = matrix.size();\n        int n = matrix[0].size();\n        prefix.assign(m + 1, vector<int>(n + 1, 0));\n\n        // Build 2D prefix sum with inclusion-exclusion\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                prefix[i + 1][j + 1] = matrix[i][j]\n                    + prefix[i][j + 1]\n                    + prefix[i + 1][j]\n                    - prefix[i][j];\n            }\n        }\n    }\n\n    int sumRegion(int row1, int col1, int row2, int col2) {\n        // Inclusion-exclusion on prefix sums\n        return prefix[row2 + 1][col2 + 1]\n            - prefix[row1][col2 + 1]\n            - prefix[row2 + 1][col1]\n            + prefix[row1][col1];\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        12,
        13,
        14,
        15
      ],
      "query_setup": [
        20
      ],
      "query_add": [
        22
      ],
      "query_sub1": [
        23
      ],
      "query_sub2": [
        24
      ],
      "query_add_back": [
        25
      ],
      "complete": [
        22,
        23,
        24,
        25
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class NumMatrix {\n    private int[,] prefix;\n\n    public NumMatrix(int[][] matrix) {\n        int m = matrix.Length;\n        int n = matrix[0].Length;\n        prefix = new int[m + 1, n + 1];\n\n        // Build 2D prefix sum with inclusion-exclusion\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                prefix[i + 1, j + 1] = matrix[i][j]\n                    + prefix[i, j + 1]\n                    + prefix[i + 1, j]\n                    - prefix[i, j];\n            }\n        }\n    }\n\n    public int SumRegion(int row1, int col1, int row2, int col2) {\n        // Inclusion-exclusion on prefix sums\n        return prefix[row2 + 1, col2 + 1]\n            - prefix[row1, col2 + 1]\n            - prefix[row2 + 1, col1]\n            + prefix[row1, col1];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        12,
        13,
        14,
        15
      ],
      "query_setup": [
        20
      ],
      "query_add": [
        22
      ],
      "query_sub1": [
        23
      ],
      "query_sub2": [
        24
      ],
      "query_add_back": [
        25
      ],
      "complete": [
        22,
        23,
        24,
        25
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type NumMatrix struct {\n    prefix [][]int\n}\n\nfunc Constructor(matrix [][]int) NumMatrix {\n    m := len(matrix)\n    n := len(matrix[0])\n    prefix := make([][]int, m+1)\n    for i := 0; i <= m; i++ {\n        prefix[i] = make([]int, n+1)\n    }\n\n    // Build 2D prefix sum with inclusion-exclusion\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            prefix[i+1][j+1] = matrix[i][j] +\n                prefix[i][j+1] +\n                prefix[i+1][j] -\n                prefix[i][j]\n        }\n    }\n\n    return NumMatrix{prefix: prefix}\n}\n\nfunc (nm *NumMatrix) SumRegion(row1 int, col1 int, row2 int, col2 int) int {\n    // Inclusion-exclusion on prefix sums\n    return nm.prefix[row2+1][col2+1] -\n        nm.prefix[row1][col2+1] -\n        nm.prefix[row2+1][col1] +\n        nm.prefix[row1][col1]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        16,
        17,
        18,
        19
      ],
      "query_setup": [
        26
      ],
      "query_add": [
        28
      ],
      "query_sub1": [
        29
      ],
      "query_sub2": [
        30
      ],
      "query_add_back": [
        31
      ],
      "complete": [
        28,
        29,
        30,
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function NumMatrix(matrix) {\n    var m = matrix.length;\n    var n = matrix[0].length;\n    this.prefix = [];\n\n    for (var i = 0; i <= m; i++) {\n        this.prefix[i] = new Array(n + 1).fill(0);\n    }\n\n    // Build 2D prefix sum with inclusion-exclusion\n    for (var i = 0; i < m; i++) {\n        for (var j = 0; j < n; j++) {\n            this.prefix[i + 1][j + 1] = matrix[i][j]\n                + this.prefix[i][j + 1]\n                + this.prefix[i + 1][j]\n                - this.prefix[i][j];\n        }\n    }\n}\nNumMatrix.prototype.sumRegion = function(row1, col1, row2, col2) {\n    // Inclusion-exclusion on prefix sums\n    return this.prefix[row2 + 1][col2 + 1]\n        - this.prefix[row1][col2 + 1]\n        - this.prefix[row2 + 1][col1]\n        + this.prefix[row1][col1];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        13,
        14,
        15,
        16
      ],
      "query_setup": [
        20
      ],
      "query_add": [
        22
      ],
      "query_sub1": [
        23
      ],
      "query_sub2": [
        24
      ],
      "query_add_back": [
        25
      ],
      "complete": [
        22,
        23,
        24,
        25
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class NumMatrix {\n    private prefix: number[][];\n\n    constructor(matrix: number[][]) {\n        const m = matrix.length;\n        const n = matrix[0].length;\n        this.prefix = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n\n        // Build 2D prefix sum with inclusion-exclusion\n        for (let i = 0; i < m; i++) {\n            for (let j = 0; j < n; j++) {\n                this.prefix[i + 1][j + 1] = matrix[i][j]\n                    + this.prefix[i][j + 1]\n                    + this.prefix[i + 1][j]\n                    - this.prefix[i][j];\n            }\n        }\n    }\n\n    sumRegion(row1: number, col1: number, row2: number, col2: number): number {\n        // Inclusion-exclusion on prefix sums\n        return this.prefix[row2 + 1][col2 + 1]\n            - this.prefix[row1][col2 + 1]\n            - this.prefix[row2 + 1][col1]\n            + this.prefix[row1][col1];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        12,
        13,
        14,
        15
      ],
      "query_setup": [
        20
      ],
      "query_add": [
        22
      ],
      "query_sub1": [
        23
      ],
      "query_sub2": [
        24
      ],
      "query_add_back": [
        25
      ],
      "complete": [
        22,
        23,
        24,
        25
      ]
    }
  }
};

const RangeSumQuery2dImmutablePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "5x5 Matrix",
    "value": {
      "matrix": [
        [
          3,
          0,
          1,
          4,
          2
        ],
        [
          5,
          6,
          3,
          2,
          1
        ],
        [
          1,
          2,
          0,
          1,
          5
        ],
        [
          4,
          1,
          0,
          1,
          7
        ],
        [
          1,
          0,
          3,
          0,
          5
        ]
      ],
      "row1": 2,
      "col1": 1,
      "row2": 4,
      "col2": 3
    }
  },
  {
    "id": "ex2",
    "label": "3x3 Matrix",
    "value": {
      "matrix": [
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
      "row1": 0,
      "col1": 0,
      "row2": 1,
      "col2": 1
    }
  },
  {
    "id": "ex3",
    "label": "All Ones",
    "value": {
      "matrix": [
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          1
        ],
        [
          1,
          1,
          1
        ]
      ],
      "row1": 0,
      "col1": 0,
      "row2": 2,
      "col2": 2
    }
  }
];

function generateRangeSumQuery2dImmutableSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.matrix.map(e=>[...e]),r=e.row1,l=e.col1,n=e.row2,a=e.col2,o=t.length,s=t[0].length,u=Array.from({length:o+1},()=>Array(s+1).fill(0)),c={};for(let e=0;e<o;e++)for(let r=0;r<s;r++)c[`mat_${e}_${r}`]={type:"matrixElement",value:t[e][r],row:e,col:r};for(let e=0;e<=o;e++)for(let t=0;t<=s;t++)c[`pfx_${e}_${t}`]={type:"matrixElement",value:0===e||0===t?0:"",row:e,col:t};let x=new StepRecorder({phase:"start",i:-1,j:-1,matVal:0,top:0,left:0,corner:0,newVal:0,row1:r,col1:l,row2:n,col2:a,a:0,b:0,c:0,d:0,result:0},c);x.record("-","Start: build the 2D prefix matrix, then answer the query with inclusion-exclusion");for(let e=0;e<o;e++)for(let r=0;r<s;r++){let i=u[e][r+1],l=u[e+1][r],n=u[e][r];u[e+1][r+1]=t[e][r]+i+l-n,x.update_variable("phase","build"),x.update_variable("i",e),x.update_variable("j",r),x.update_variable("matVal",t[e][r]),x.update_variable("top",i),x.update_variable("left",l),x.update_variable("corner",n),x.update_variable("newVal",u[e+1][r+1]),x.update_visual(`pfx_${e+1}_${r+1}`,{type:"matrixElement",value:u[e+1][r+1],row:e+1,col:r+1}),x.record("build_prefix",`prefix[${e+1}][${r+1}] = ${t[e][r]} + ${i} + ${l} - ${n} = ${u[e+1][r+1]}`)}let m=u[n+1][a+1],d=u[r][a+1],f=u[n+1][l],h=u[r][l],p=m-d-f+h;return x.update_variable("phase","query"),x.update_variable("a",m),x.update_variable("b",d),x.update_variable("c",f),x.update_variable("d",h),x.update_variable("result",p),x.record("query_setup",`Query sumRegion(${r}, ${l}, ${n}, ${a}): sum of the highlighted block`),x.record("query_add",`Add prefix[${n+1}][${a+1}] = ${m}: everything above and left of the block's bottom-right corner`),x.record("query_sub1",`Subtract prefix[${r}][${a+1}] = ${d}: the rows above the block`),x.record("query_sub2",`Subtract prefix[${n+1}][${l}] = ${f}: the columns left of the block, the corner is now subtracted twice`),x.record("query_add_back",`Add back prefix[${r}][${l}] = ${h}: the corner counts once again, sum = ${p}`),x.update_variable("phase","done"),x.record("complete",`sumRegion(${r}, ${l}, ${n}, ${a}) = ${m} - ${d} - ${f} + ${h} = ${p}`),x.getSteps()
  })(__inputArg);
}

export function RangeSumQuery2dImmutableProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeSumQuery2dImmutableTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeSumQuery2dImmutableSteps(e) as any[];
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
      title="Range Sum Query 2D - Immutable"
      slug="range-sum-query-2d-immutable"
      approaches={approaches}
      presets={RangeSumQuery2dImmutablePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Range Sum Query - Immutable (range-sum-query-immutable)
// ==========================================

const RangeSumQueryImmutableTemplates = {
  "python": {
    "language": "python",
    "code": "class NumArray:\n    def __init__(self, nums):\n        # Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n        self.prefix = [0] * (len(nums) + 1)\n        for i in range(len(nums)):\n            self.prefix[i + 1] = self.prefix[i] + nums[i]\n\n    def sumRange(self, left, right):\n        return self.prefix[right + 1] - self.prefix[left]",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        5,
        6
      ],
      "query_setup": [
        8
      ],
      "query_right": [
        9
      ],
      "query_left": [
        9
      ],
      "complete": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class NumArray {\n    private int[] prefix;\n\n    public NumArray(int[] nums) {\n        // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n        prefix = new int[nums.length + 1];\n        for (int i = 0; i < nums.length; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    public int sumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        7,
        8
      ],
      "query_setup": [
        12
      ],
      "query_right": [
        13
      ],
      "query_left": [
        13
      ],
      "complete": [
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class NumArray {\n    vector<int> prefix;\n\n    NumArray(vector<int>& nums) {\n        // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n        prefix.resize(nums.size() + 1, 0);\n        for (int i = 0; i < (int)nums.size(); i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    int sumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n};",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        7,
        8
      ],
      "query_setup": [
        12
      ],
      "query_right": [
        13
      ],
      "query_left": [
        13
      ],
      "complete": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class NumArray {\n    private int[] prefix;\n\n    public NumArray(int[] nums) {\n        // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n        prefix = new int[nums.Length + 1];\n        for (int i = 0; i < nums.Length; i++) {\n            prefix[i + 1] = prefix[i] + nums[i];\n        }\n    }\n\n    public int SumRange(int left, int right) {\n        return prefix[right + 1] - prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        7,
        8
      ],
      "query_setup": [
        12
      ],
      "query_right": [
        13
      ],
      "query_left": [
        13
      ],
      "complete": [
        13
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type NumArray struct {\n    prefix []int\n}\n\nfunc Constructor(nums []int) NumArray {\n    // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n    prefix := make([]int, len(nums)+1)\n    for i := 0; i < len(nums); i++ {\n        prefix[i+1] = prefix[i] + nums[i]\n    }\n    return NumArray{prefix: prefix}\n}\n\nfunc (na *NumArray) SumRange(left int, right int) int {\n    return na.prefix[right+1] - na.prefix[left]\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        8,
        9
      ],
      "query_setup": [
        14
      ],
      "query_right": [
        15
      ],
      "query_left": [
        15
      ],
      "complete": [
        15
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function NumArray(nums) {\n  // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n  this.prefix = new Array(nums.length + 1).fill(0);\n  for (let i = 0; i < nums.length; i++) {\n    this.prefix[i + 1] = this.prefix[i] + nums[i];\n  }\n}\nNumArray.prototype.sumRange = function (left, right) {\n  return this.prefix[right + 1] - this.prefix[left];\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        4,
        5
      ],
      "query_setup": [
        8
      ],
      "query_right": [
        9
      ],
      "query_left": [
        9
      ],
      "complete": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class NumArray {\n    private prefix: number[];\n\n    constructor(nums: number[]) {\n        // Build prefix sum array where prefix[i] = sum of nums[0..i-1]\n        this.prefix = new Array(nums.length + 1).fill(0);\n        for (let i = 0; i < nums.length; i++) {\n            this.prefix[i + 1] = this.prefix[i] + nums[i];\n        }\n    }\n\n    sumRange(left: number, right: number): number {\n        return this.prefix[right + 1] - this.prefix[left];\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "build_prefix": [
        7,
        8
      ],
      "query_setup": [
        12
      ],
      "query_right": [
        13
      ],
      "query_left": [
        13
      ],
      "complete": [
        13
      ]
    }
  }
};

const RangeSumQueryImmutablePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Classic",
    "value": {
      "nums": [
        -2,
        0,
        3,
        -5,
        2,
        -1
      ],
      "left": 0,
      "right": 2
    }
  },
  {
    "id": "ex2",
    "label": "Tail Range",
    "value": {
      "nums": [
        -2,
        0,
        3,
        -5,
        2,
        -1
      ],
      "left": 2,
      "right": 5
    }
  },
  {
    "id": "ex3",
    "label": "Middle Range",
    "value": {
      "nums": [
        1,
        2,
        3,
        4,
        5
      ],
      "left": 1,
      "right": 3
    }
  },
  {
    "id": "ex4",
    "label": "Full Range",
    "value": {
      "nums": [
        5,
        10,
        15,
        20,
        25
      ],
      "left": 0,
      "right": 4
    }
  }
];

function generateRangeSumQueryImmutableSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.nums],i=e.left,n=e.right,l=t.length,s=Array(l+1).fill(0);for(let e=0;e<l;e++)s[e+1]=s[e]+t[e];let a=s[n+1]-s[i],u={};t.forEach((e,t)=>{u[`nums_${t}`]={type:"arrayElement",value:e,position:t,state:"readonly"}}),u.prefix_0={type:"arrayElement",value:0,position:0};for(let e=1;e<=l;e++)u[`prefix_${e}`]={type:"arrayElement",value:"",position:e};let o=new StepRecorder({phase:"start",i:-1,prevSum:0,addVal:0,newSum:0,left:i,right:n,sumRight:s[n+1],sumLeft:s[i],result:a},u);o.record("-","Start: prefix[0] = 0, then build the prefix sum array left to right");for(let e=0;e<l;e++)o.update_variable("phase","build"),o.update_variable("i",e),o.update_variable("prevSum",s[e]),o.update_variable("addVal",t[e]),o.update_variable("newSum",s[e+1]),o.update_visual("ptr_i",{type:"pointer",position:e,label:"i"}),o.update_visual(`prefix_${e+1}`,{type:"arrayElement",value:s[e+1],position:e+1}),o.record("build_prefix",`prefix[${e+1}] = prefix[${e}] + nums[${e}] = ${s[e]} + ${t[e]} = ${s[e+1]}`);return o.update_variable("phase","qsetup"),o.delete_visual("ptr_i"),o.record("query_setup",`Query sumRange(${i}, ${n}): sum of nums[${i}..${n}]`),o.update_variable("phase","qright"),o.record("query_right",`prefix[${n+1}] = ${s[n+1]} holds the sum of nums[0..${n}]`),o.update_variable("phase","qleft"),o.record("query_left",i>0?`Subtract prefix[${i}] = ${s[i]}, the sum of nums[0..${i-1}]`:"Subtract prefix[0] = 0, nothing lies before the range"),o.update_variable("phase","done"),o.record("complete",`sumRange(${i}, ${n}) = ${s[n+1]} - ${s[i]} = ${a}`),o.getSteps()
  })(__inputArg);
}

export function RangeSumQueryImmutableProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RangeSumQueryImmutableTemplates,
      generateSteps: (e: any) => {
        const recorded = generateRangeSumQueryImmutableSteps(e) as any[];
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
      title="Range Sum Query - Immutable"
      slug="range-sum-query-immutable"
      approaches={approaches}
      presets={RangeSumQueryImmutablePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Reverse Pairs (reverse-pairs)
// ==========================================

const ReversePairsTemplates = {
  "python": {
    "language": "python",
    "code": "class Solution:\n    def reversePairs(self, nums: list[int]) -> int:\n        return self.merge_sort(nums, 0, len(nums) - 1)\n\n    def merge_sort(self, nums, left, right):\n        if left >= right:\n            return 0\n\n        mid = left + (right - left) // 2\n        count = self.merge_sort(nums, left, mid) + self.merge_sort(nums, mid + 1, right)\n\n        # Count phase: count reverse pairs between two sorted halves\n        j = mid + 1\n        for i in range(left, mid + 1):\n            # Advance j while left[i] > 2 * right[j]\n            while j <= right and nums[i] > 2 * nums[j]:\n                j += 1\n            # All elements from mid+1 to j-1 form valid pairs with i\n            count += (j - (mid + 1))\n\n        # Merge phase: standard merge sort merge\n        temp = []\n        p1, p2 = left, mid + 1\n        while p1 <= mid and p2 <= right:\n            if nums[p1] <= nums[p2]:\n                temp.append(nums[p1])\n                p1 += 1\n            else:\n                temp.append(nums[p2])\n                p2 += 1\n        while p1 <= mid:\n            temp.append(nums[p1])\n            p1 += 1\n        while p2 <= right:\n            temp.append(nums[p2])\n            p2 += 1\n\n        nums[left:right + 1] = temp\n        return count",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        6,
        7
      ],
      "calc_mid": [
        9
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        10
      ],
      "count_start": [
        13,
        14
      ],
      "count_check": [
        16
      ],
      "count_advance_j": [
        17
      ],
      "count_add": [
        19
      ],
      "merge_start": [
        22,
        23
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
        31,
        32,
        33,
        34,
        35,
        36
      ],
      "copy_back": [
        38
      ],
      "merge_complete": [
        38
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "count_check": [
        16
      ],
      "compare": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class Solution {\n    public int reversePairs(int[] nums) {\n        return mergeSort(nums, 0, nums.length - 1);\n    }\n\n    private int mergeSort(int[] nums, int left, int right) {\n        if (left >= right) return 0;\n\n        int mid = left + (right - left) / 2;\n        int count = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);\n\n        // Count phase: count reverse pairs between two sorted halves\n        int j = mid + 1;\n        for (int i = left; i <= mid; i++) {\n            // Advance j while left[i] > 2 * right[j]\n            while (j <= right && nums[i] > 2L * nums[j]) {\n                j++;\n            }\n            // All elements from mid+1 to j-1 form valid pairs with i\n            count += (j - (mid + 1));\n        }\n\n        // Merge phase: standard merge sort merge\n        int[] temp = new int[right - left + 1];\n        int p1 = left, p2 = mid + 1, k = 0;\n        while (p1 <= mid && p2 <= right) {\n            if (nums[p1] <= nums[p2]) {\n                temp[k++] = nums[p1++];\n            } else {\n                temp[k++] = nums[p2++];\n            }\n        }\n        while (p1 <= mid) temp[k++] = nums[p1++];\n        while (p2 <= right) temp[k++] = nums[p2++];\n\n        for (int i = 0; i < temp.length; i++) {\n            nums[left + i] = temp[i];\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        7
      ],
      "calc_mid": [
        9
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        10
      ],
      "count_start": [
        13,
        14
      ],
      "count_check": [
        16
      ],
      "count_advance_j": [
        17
      ],
      "count_add": [
        20
      ],
      "merge_start": [
        24,
        25
      ],
      "compare": [
        26,
        27
      ],
      "pick_left": [
        28
      ],
      "pick_right": [
        30
      ],
      "copy_remaining": [
        33,
        34
      ],
      "copy_back": [
        36,
        37
      ],
      "merge_complete": [
        36,
        37
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "count_check": [
        16
      ],
      "compare": [
        27
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class Solution {\npublic:\n    int reversePairs(vector<int>& nums) {\n        return mergeSort(nums, 0, nums.size() - 1);\n    }\n\nprivate:\n    int mergeSort(vector<int>& nums, int left, int right) {\n        if (left >= right) return 0;\n\n        int mid = left + (right - left) / 2;\n        int count = mergeSort(nums, left, mid) + mergeSort(nums, mid + 1, right);\n\n        // Count phase: count reverse pairs between two sorted halves\n        int j = mid + 1;\n        for (int i = left; i <= mid; i++) {\n            // Advance j while left[i] > 2 * right[j]\n            while (j <= right && nums[i] > 2LL * nums[j]) {\n                j++;\n            }\n            // All elements from mid+1 to j-1 form valid pairs with i\n            count += (j - (mid + 1));\n        }\n\n        // Merge phase: standard merge sort merge\n        vector<int> temp(right - left + 1);\n        int p1 = left, p2 = mid + 1, k = 0;\n        while (p1 <= mid && p2 <= right) {\n            if (nums[p1] <= nums[p2]) {\n                temp[k++] = nums[p1++];\n            } else {\n                temp[k++] = nums[p2++];\n            }\n        }\n        while (p1 <= mid) temp[k++] = nums[p1++];\n        while (p2 <= right) temp[k++] = nums[p2++];\n\n        for (int i = 0; i < (int)temp.size(); i++) {\n            nums[left + i] = temp[i];\n        }\n        return count;\n    }\n};",
    "lineMap": {
      "-": [
        3
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
        12
      ],
      "count_start": [
        15,
        16
      ],
      "count_check": [
        18
      ],
      "count_advance_j": [
        19
      ],
      "count_add": [
        22
      ],
      "merge_start": [
        26,
        27
      ],
      "compare": [
        28,
        29
      ],
      "pick_left": [
        30
      ],
      "pick_right": [
        32
      ],
      "copy_remaining": [
        35,
        36
      ],
      "copy_back": [
        38,
        39
      ],
      "merge_complete": [
        38,
        39
      ],
      "complete": [
        41
      ]
    },
    "conditionalMap": {
      "count_check": [
        18
      ],
      "compare": [
        29
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public class Solution {\n    public int ReversePairs(int[] nums) {\n        return MergeSort(nums, 0, nums.Length - 1);\n    }\n\n    private int MergeSort(int[] nums, int left, int right) {\n        if (left >= right) return 0;\n\n        int mid = left + (right - left) / 2;\n        int count = MergeSort(nums, left, mid) + MergeSort(nums, mid + 1, right);\n\n        // Count phase: count reverse pairs between two sorted halves\n        int j = mid + 1;\n        for (int i = left; i <= mid; i++) {\n            // Advance j while left[i] > 2 * right[j]\n            while (j <= right && nums[i] > 2L * nums[j]) {\n                j++;\n            }\n            // All elements from mid+1 to j-1 form valid pairs with i\n            count += (j - (mid + 1));\n        }\n\n        // Merge phase: standard merge sort merge\n        int[] temp = new int[right - left + 1];\n        int p1 = left, p2 = mid + 1, k = 0;\n        while (p1 <= mid && p2 <= right) {\n            if (nums[p1] <= nums[p2]) {\n                temp[k++] = nums[p1++];\n            } else {\n                temp[k++] = nums[p2++];\n            }\n        }\n        while (p1 <= mid) temp[k++] = nums[p1++];\n        while (p2 <= right) temp[k++] = nums[p2++];\n\n        for (int i = 0; i < temp.Length; i++) {\n            nums[left + i] = temp[i];\n        }\n        return count;\n    }\n}",
    "lineMap": {
      "-": [
        2
      ],
      "base_case": [
        7
      ],
      "calc_mid": [
        9
      ],
      "recurse_left": [
        10
      ],
      "recurse_right": [
        10
      ],
      "count_start": [
        13,
        14
      ],
      "count_check": [
        16
      ],
      "count_advance_j": [
        17
      ],
      "count_add": [
        20
      ],
      "merge_start": [
        24,
        25
      ],
      "compare": [
        26,
        27
      ],
      "pick_left": [
        28
      ],
      "pick_right": [
        30
      ],
      "copy_remaining": [
        33,
        34
      ],
      "copy_back": [
        36,
        37
      ],
      "merge_complete": [
        36,
        37
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "count_check": [
        16
      ],
      "compare": [
        27
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func reversePairs(nums []int) int {\n    return mergeSort(nums, 0, len(nums)-1)\n}\n\nfunc mergeSort(nums []int, left, right int) int {\n    if left >= right {\n        return 0\n    }\n\n    mid := left + (right-left)/2\n    count := mergeSort(nums, left, mid) + mergeSort(nums, mid+1, right)\n\n    // Count phase: count reverse pairs between two sorted halves\n    j := mid + 1\n    for i := left; i <= mid; i++ {\n        // Advance j while left[i] > 2 * right[j]\n        for j <= right && nums[i] > 2*nums[j] {\n            j++\n        }\n        // All elements from mid+1 to j-1 form valid pairs with i\n        count += (j - (mid + 1))\n    }\n\n    // Merge phase: standard merge sort merge\n    temp := make([]int, right-left+1)\n    p1, p2, k := left, mid+1, 0\n    for p1 <= mid && p2 <= right {\n        if nums[p1] <= nums[p2] {\n            temp[k] = nums[p1]\n            p1++\n        } else {\n            temp[k] = nums[p2]\n            p2++\n        }\n        k++\n    }\n    for p1 <= mid {\n        temp[k] = nums[p1]\n        p1++\n        k++\n    }\n    for p2 <= right {\n        temp[k] = nums[p2]\n        p2++\n        k++\n    }\n\n    copy(nums[left:right+1], temp)\n    return count\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        6,
        7
      ],
      "calc_mid": [
        10
      ],
      "recurse_left": [
        11
      ],
      "recurse_right": [
        11
      ],
      "count_start": [
        14,
        15
      ],
      "count_check": [
        17
      ],
      "count_advance_j": [
        18
      ],
      "count_add": [
        21
      ],
      "merge_start": [
        25,
        26
      ],
      "compare": [
        27,
        28
      ],
      "pick_left": [
        29,
        30
      ],
      "pick_right": [
        32,
        33
      ],
      "copy_remaining": [
        37,
        38,
        39,
        40,
        42,
        43,
        44,
        45
      ],
      "copy_back": [
        48
      ],
      "merge_complete": [
        48
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "count_check": [
        17
      ],
      "compare": [
        28
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var reversePairs = function(nums) {\n    return mergeSortHelper(nums, 0, nums.length - 1);\n};\n\nfunction mergeSortHelper(nums, left, right) {\n    if (left >= right) return 0;\n\n    var mid = left + Math.floor((right - left) / 2);\n    var count = mergeSortHelper(nums, left, mid) + mergeSortHelper(nums, mid + 1, right);\n\n    // Count phase: count reverse pairs between two sorted halves\n    var j = mid + 1;\n    for (var i = left; i <= mid; i++) {\n        // Advance j while left[i] > 2 * right[j]\n        while (j <= right && nums[i] > 2 * nums[j]) {\n            j++;\n        }\n        // All elements from mid+1 to j-1 form valid pairs with i\n        count += (j - (mid + 1));\n    }\n\n    // Merge phase: standard merge sort merge\n    var temp = [];\n    var p1 = left, p2 = mid + 1;\n    while (p1 <= mid && p2 <= right) {\n        if (nums[p1] <= nums[p2]) {\n            temp.push(nums[p1++]);\n        } else {\n            temp.push(nums[p2++]);\n        }\n    }\n    while (p1 <= mid) temp.push(nums[p1++]);\n    while (p2 <= right) temp.push(nums[p2++]);\n\n    for (var k = 0; k < temp.length; k++) {\n        nums[left + k] = temp[k];\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        6
      ],
      "calc_mid": [
        8
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        9
      ],
      "count_start": [
        12,
        13
      ],
      "count_check": [
        15
      ],
      "count_advance_j": [
        16
      ],
      "count_add": [
        19
      ],
      "merge_start": [
        23,
        24
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
        32,
        33
      ],
      "copy_back": [
        35,
        36
      ],
      "merge_complete": [
        35,
        36
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "count_check": [
        15
      ],
      "compare": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function reversePairs(nums: number[]): number {\n    return mergeSortCount(nums, 0, nums.length - 1);\n}\n\nfunction mergeSortCount(nums: number[], left: number, right: number): number {\n    if (left >= right) return 0;\n\n    const mid = left + Math.floor((right - left) / 2);\n    let count = mergeSortCount(nums, left, mid) + mergeSortCount(nums, mid + 1, right);\n\n    // Count phase: count reverse pairs between two sorted halves\n    let j = mid + 1;\n    for (let i = left; i <= mid; i++) {\n        // Advance j while left[i] > 2 * right[j]\n        while (j <= right && nums[i] > 2 * nums[j]) {\n            j++;\n        }\n        // All elements from mid+1 to j-1 form valid pairs with i\n        count += (j - (mid + 1));\n    }\n\n    // Merge phase: standard merge sort merge\n    const temp: number[] = [];\n    let p1 = left, p2 = mid + 1;\n    while (p1 <= mid && p2 <= right) {\n        if (nums[p1] <= nums[p2]) {\n            temp.push(nums[p1++]);\n        } else {\n            temp.push(nums[p2++]);\n        }\n    }\n    while (p1 <= mid) temp.push(nums[p1++]);\n    while (p2 <= right) temp.push(nums[p2++]);\n\n    for (let k = 0; k < temp.length; k++) {\n        nums[left + k] = temp[k];\n    }\n    return count;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "base_case": [
        6
      ],
      "calc_mid": [
        8
      ],
      "recurse_left": [
        9
      ],
      "recurse_right": [
        9
      ],
      "count_start": [
        12,
        13
      ],
      "count_check": [
        15
      ],
      "count_advance_j": [
        16
      ],
      "count_add": [
        19
      ],
      "merge_start": [
        23,
        24
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
        32,
        33
      ],
      "copy_back": [
        35,
        36
      ],
      "merge_complete": [
        35,
        36
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "count_check": [
        15
      ],
      "compare": [
        26
      ]
    }
  }
};

const ReversePairsPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        2,
        3,
        1
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Medium",
    "value": {
      "arr": [
        2,
        4,
        3,
        5,
        1
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Small",
    "value": {
      "arr": [
        3,
        1
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Large",
    "value": {
      "arr": [
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
    "label": "No Pairs",
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
    "id": "ex6",
    "label": "All Same",
    "value": {
      "arr": [
        2,
        2,
        2,
        2
      ]
    }
  }
];

function generateReversePairsSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.arr],r=t.length,a=t.reduce((e,t,r)=>(e[`bar_${r}`]={type:"arrayElement",value:t,position:r},e),{}),l=t.map((e,t)=>t),n=new RecursiveStepRecorder({arr:[...t],count:0},{...a,meta_count:{type:"metadata",value:0}});if(n.pushCallFrame({arr:"[...]"},"reversePairs"),n.record("-","Start: Count reverse pairs using modified merge sort"),r<=1)return n.record("complete","No reverse pairs possible. Count = 0"),n.popCallFrame(),n.getSteps();let s=function e(t,r,i,a,l){if(a.pushCallFrame({left:r,right:i},"mergeSort"),r>=i)return a.record("base_case",`Base case: subarray [${r}..${i}] has ${r===i?"1 element":"0 elements"}`),a.popCallFrame(),0;let n=r+Math.floor((i-r)/2);a.update_frame_variable("mid",n),a.update_visual("range_left",{type:"range",start:r,end:n,label:"left",state:"left"}),a.update_visual("range_right",{type:"range",start:n+1,end:i,label:"right",state:"right"});for(let e=r;e<=n;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"left"})}for(let e=n+1;e<=i;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"right"})}a.record("calc_mid",`Calculate mid = ${n}. Split [${r}..${i}] into [${r}..${n}] and [${n+1}..${i}]`),a.delete_visual("range_left"),a.delete_visual("range_right");for(let e=r;e<=i;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e})}a.record("recurse_left",`Recurse on left half: mergeSort(${r}, ${n})`);let s=e(t,r,n,a,l);a.record("recurse_right",`Recurse on right half: mergeSort(${n+1}, ${i})`),s+=e(t,n+1,i,a,l),a.update_visual("range_left",{type:"range",start:r,end:n,label:"left",state:"left"}),a.update_visual("range_right",{type:"range",start:n+1,end:i,label:"right",state:"right"});for(let e=r;e<=n;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"left"})}for(let e=n+1;e<=i;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"right"})}a.record("count_start",`Count reverse pairs between sorted halves [${t.slice(r,n+1).join(", ")}] and [${t.slice(n+1,i+1).join(", ")}]`);let o=n+1;a.update_visual("ptr_i",{type:"pointer",position:r,label:"i",state:"counting"}),a.update_visual("ptr_j",{type:"pointer",position:o,label:"j",state:"counting"});for(let e=r;e<=n;e++){a.update_visual("ptr_i",{type:"pointer",position:e,label:"i",state:"counting"});let r=l.indexOf(e);for(a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"comparing"});o<=i&&t[e]>2*t[o];){let r=l.indexOf(o);a.update_visual("ptr_j",{type:"pointer",position:o,label:"j",state:"counting"}),a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[o],position:o,state:"comparing"}),a.add_conditional("count_check",!0),a.record("count_check",`arr[${e}] = ${t[e]} > 2 \xd7 arr[${o}] = ${2*t[o]}? Yes → advance j`),a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[o],position:o,state:"right"}),o++,a.update_visual("ptr_j",{type:"pointer",position:Math.min(o,i),label:"j",state:"counting"}),a.record("count_advance_j",`Advance j to ${o}`)}if(o<=i){let r=l.indexOf(o);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[o],position:o,state:"comparing"}),a.add_conditional("count_check",!1),a.record("count_check",`arr[${e}] = ${t[e]} > 2 \xd7 arr[${o}] = ${2*t[o]}? No → stop`),a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[o],position:o,state:"right"})}let u=o-(n+1);s+=u,a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"left"}),a.update_global_variable("count",s),a.update_visual("meta_count",{type:"metadata",value:s}),a.record("count_add",`Add ${u} pairs for i=${e}. Total count = ${s}`)}a.delete_visual("ptr_i"),a.delete_visual("ptr_j"),a.record("merge_start",`Merge sorted halves [${t.slice(r,n+1).join(", ")}] and [${t.slice(n+1,i+1).join(", ")}]`),function(e,t,r,i,a,l){let n=[],s=[],o=t,u=r+1,c=0;for(;o<=r&&u<=i;){let t=l.indexOf(o),p=l.indexOf(u);if(a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"comparing"}),a.update_visual(`bar_${p}`,{type:"arrayElement",value:e[u],position:u,state:"comparing"}),a.add_conditional("compare",e[o]<=e[u]),a.record("compare",`Compare arr[${o}] = ${e[o]} with arr[${u}] = ${e[u]}`),e[o]<=e[u]?(n.push(e[o]),s.push(t),a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"merged"}),a.update_visual(`temp_${c}`,{type:"tempElement",value:e[o],position:c}),c++,a.record("pick_left",`Pick ${e[o]} from left subarray → temp[${c-1}]`),o++):(n.push(e[u]),s.push(p),a.update_visual(`bar_${p}`,{type:"arrayElement",value:e[u],position:u,state:"merged"}),a.update_visual(`temp_${c}`,{type:"tempElement",value:e[u],position:c}),c++,a.record("pick_right",`Pick ${e[u]} from right subarray → temp[${c-1}]`),u++),o<=r){let t=l.indexOf(o);a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"left"})}if(u<=i){let t=l.indexOf(u);a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[u],position:u,state:"right"})}}for(;o<=r;){let t=l.indexOf(o);n.push(e[o]),s.push(t),a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[o],position:o,state:"merged"}),a.update_visual(`temp_${c}`,{type:"tempElement",value:e[o],position:c}),c++,a.record("copy_remaining",`Copy remaining ${e[o]} from left → temp[${c-1}]`),o++}for(;u<=i;){let t=l.indexOf(u);n.push(e[u]),s.push(t),a.update_visual(`bar_${t}`,{type:"arrayElement",value:e[u],position:u,state:"merged"}),a.update_visual(`temp_${c}`,{type:"tempElement",value:e[u],position:c}),c++,a.record("copy_remaining",`Copy remaining ${e[u]} from right → temp[${c-1}]`),u++}for(let r=0;r<n.length;r++){let i=t+r;e[i]=n[r],l[s[r]]=i,a.update_visual(`bar_${s[r]}`,{type:"arrayElement",value:n[r],position:i,state:"merged"}),a.delete_visual(`temp_${r}`)}a.record("copy_back",`Copy temp back to arr[${t}..${i}]: [${n.join(", ")}]`)}(t,r,n,i,a,l),a.delete_visual("range_left"),a.delete_visual("range_right");for(let e=r;e<=i;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"merged"})}a.update_global_variable("arr",[...t]),a.record("merge_complete",`Merge complete: [${t.slice(r,i+1).join(", ")}]`);for(let e=r;e<=i;e++){let r=l.indexOf(e);a.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e})}return a.popCallFrame(),s}(t,0,r-1,n,l);for(let e=0;e<r;e++){let r=l.indexOf(e);n.update_visual(`bar_${r}`,{type:"arrayElement",value:t[e],position:e,state:"sorted"})}return n.update_global_variable("arr",[...t]),n.update_global_variable("count",s),n.update_visual("meta_count",{type:"metadata",value:s}),n.record("complete",`Merge sort complete! Total reverse pairs = ${s}`),n.popCallFrame(),n.getSteps()
  })(__inputArg);
}

export function ReversePairsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ReversePairsTemplates,
      generateSteps: (e: any) => {
        const recorded = generateReversePairsSteps(e) as any[];
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
      title="Reverse Pairs"
      slug="reverse-pairs"
      approaches={approaches}
      presets={ReversePairsPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Segment Tree (segment-tree)
// ==========================================

const SegmentTreeTemplates = {
  "python": {
    "language": "python",
    "code": "class SegmentTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self.build(arr, 1, 0, self.n - 1)\n\n    def build(self, arr, node, lo, hi):\n        if lo == hi:\n            self.tree[node] = arr[lo]\n            return\n        mid = (lo + hi) // 2\n        self.build(arr, 2*node, lo, mid)\n        self.build(arr, 2*node+1, mid+1, hi)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def query(self, node, lo, hi, l, r):\n        if l <= lo and hi <= r:\n            return self.tree[node]\n        if hi < l or lo > r:\n            return 0\n        mid = (lo + hi) // 2\n        left = self.query(2*node, lo, mid, l, r)\n        right = self.query(2*node+1, mid+1, hi, l, r)\n        return left + right\n\n    def update(self, node, lo, hi, idx, val):\n        if lo == hi:\n            self.tree[node] = val\n            return\n        mid = (lo + hi) // 2\n        if idx <= mid:\n            self.update(2*node, lo, mid, idx, val)\n        else:\n            self.update(2*node+1, mid+1, hi, idx, val)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_start": [
        5
      ],
      "build_leaf": [
        8,
        9
      ],
      "build_split": [
        11
      ],
      "build_merge": [
        14
      ],
      "build_done": [
        7
      ],
      "query_start": [
        16
      ],
      "query_visit": [
        16
      ],
      "query_total": [
        17,
        18
      ],
      "query_none": [
        19,
        20
      ],
      "query_partial": [
        21,
        22,
        23
      ],
      "query_combine": [
        24
      ],
      "query_done": [
        16
      ],
      "update_start": [
        26
      ],
      "update_visit": [
        26
      ],
      "update_leaf": [
        27,
        28
      ],
      "update_go": [
        30,
        31,
        32,
        34
      ],
      "update_merge": [
        35
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        17
      ],
      "query_no_overlap": [
        19
      ],
      "update_go_left": [
        31
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class SegmentTree {\n    int[] tree;\n    int n;\n\n    SegmentTree(int[] arr) {\n        n = arr.length;\n        tree = new int[4 * n];\n        build(arr, 1, 0, n - 1);\n    }\n\n    void build(int[] arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        build(arr, 2*node, lo, mid);\n        build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    int query(int node, int lo, int hi, int l, int r) {\n        if (l <= lo && hi <= r)\n            return tree[node];\n        if (hi < l || lo > r)\n            return 0;\n        int mid = (lo + hi) / 2;\n        int left = query(2*node, lo, mid, l, r);\n        int right = query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n\n    void update(int node, int lo, int hi, int idx, int val) {\n        if (lo == hi) {\n            tree[node] = val;\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        if (idx <= mid)\n            update(2*node, lo, mid, idx, val);\n        else\n            update(2*node+1, mid+1, hi, idx, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        5,
        6,
        7
      ],
      "build_start": [
        8
      ],
      "build_leaf": [
        12,
        13
      ],
      "build_split": [
        16
      ],
      "build_merge": [
        19
      ],
      "build_done": [
        11
      ],
      "query_start": [
        22
      ],
      "query_visit": [
        22
      ],
      "query_total": [
        23,
        24
      ],
      "query_none": [
        25,
        26
      ],
      "query_partial": [
        27,
        28,
        29
      ],
      "query_combine": [
        30
      ],
      "query_done": [
        22
      ],
      "update_start": [
        33
      ],
      "update_visit": [
        33
      ],
      "update_leaf": [
        34,
        35
      ],
      "update_go": [
        38,
        39,
        40,
        42
      ],
      "update_merge": [
        43
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        23
      ],
      "query_no_overlap": [
        25
      ],
      "update_go_left": [
        39
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class SegmentTree {\n    vector<int> tree;\n    int n;\npublic:\n    SegmentTree(vector<int>& arr) {\n        n = arr.size();\n        tree.resize(4 * n, 0);\n        build(arr, 1, 0, n - 1);\n    }\n\n    void build(vector<int>& arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        build(arr, 2*node, lo, mid);\n        build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    int query(int node, int lo, int hi, int l, int r) {\n        if (l <= lo && hi <= r)\n            return tree[node];\n        if (hi < l || lo > r)\n            return 0;\n        int mid = (lo + hi) / 2;\n        int left = query(2*node, lo, mid, l, r);\n        int right = query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n\n    void update(int node, int lo, int hi, int idx, int val) {\n        if (lo == hi) {\n            tree[node] = val;\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        if (idx <= mid)\n            update(2*node, lo, mid, idx, val);\n        else\n            update(2*node+1, mid+1, hi, idx, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n};",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        5,
        6,
        7
      ],
      "build_start": [
        8
      ],
      "build_leaf": [
        12,
        13
      ],
      "build_split": [
        16
      ],
      "build_merge": [
        19
      ],
      "build_done": [
        11
      ],
      "query_start": [
        22
      ],
      "query_visit": [
        22
      ],
      "query_total": [
        23,
        24
      ],
      "query_none": [
        25,
        26
      ],
      "query_partial": [
        27,
        28,
        29
      ],
      "query_combine": [
        30
      ],
      "query_done": [
        22
      ],
      "update_start": [
        33
      ],
      "update_visit": [
        33
      ],
      "update_leaf": [
        34,
        35
      ],
      "update_go": [
        38,
        39,
        40,
        42
      ],
      "update_merge": [
        43
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        23
      ],
      "query_no_overlap": [
        25
      ],
      "update_go_left": [
        39
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class SegmentTree {\n    int[] tree;\n    int n;\n\n    public SegmentTree(int[] arr) {\n        n = arr.Length;\n        tree = new int[4 * n];\n        Build(arr, 1, 0, n - 1);\n    }\n\n    void Build(int[] arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        Build(arr, 2*node, lo, mid);\n        Build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    public int Query(int node, int lo, int hi, int l, int r) {\n        if (l <= lo && hi <= r)\n            return tree[node];\n        if (hi < l || lo > r)\n            return 0;\n        int mid = (lo + hi) / 2;\n        int left = Query(2*node, lo, mid, l, r);\n        int right = Query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n\n    public void Update(int node, int lo, int hi, int idx, int val) {\n        if (lo == hi) {\n            tree[node] = val;\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        if (idx <= mid)\n            Update(2*node, lo, mid, idx, val);\n        else\n            Update(2*node+1, mid+1, hi, idx, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        5,
        6,
        7
      ],
      "build_start": [
        8
      ],
      "build_leaf": [
        12,
        13
      ],
      "build_split": [
        16
      ],
      "build_merge": [
        19
      ],
      "build_done": [
        11
      ],
      "query_start": [
        22
      ],
      "query_visit": [
        22
      ],
      "query_total": [
        23,
        24
      ],
      "query_none": [
        25,
        26
      ],
      "query_partial": [
        27,
        28,
        29
      ],
      "query_combine": [
        30
      ],
      "query_done": [
        22
      ],
      "update_start": [
        33
      ],
      "update_visit": [
        33
      ],
      "update_leaf": [
        34,
        35
      ],
      "update_go": [
        38,
        39,
        40,
        42
      ],
      "update_merge": [
        43
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        23
      ],
      "query_no_overlap": [
        25
      ],
      "update_go_left": [
        39
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type SegmentTree struct {\n    tree []int\n    n    int\n}\n\nfunc NewSegmentTree(arr []int) *SegmentTree {\n    st := &SegmentTree{n: len(arr), tree: make([]int, 4*len(arr))}\n    st.build(arr, 1, 0, st.n-1)\n    return st\n}\n\nfunc (st *SegmentTree) build(arr []int, node, lo, hi int) {\n    if lo == hi {\n        st.tree[node] = arr[lo]\n        return\n    }\n    mid := (lo + hi) / 2\n    st.build(arr, 2*node, lo, mid)\n    st.build(arr, 2*node+1, mid+1, hi)\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}\n\nfunc (st *SegmentTree) query(node, lo, hi, l, r int) int {\n    if l <= lo && hi <= r {\n        return st.tree[node]\n    }\n    if hi < l || lo > r {\n        return 0\n    }\n    mid := (lo + hi) / 2\n    left := st.query(2*node, lo, mid, l, r)\n    right := st.query(2*node+1, mid+1, hi, l, r)\n    return left + right\n}\n\nfunc (st *SegmentTree) update(node, lo, hi, idx, val int) {\n    if lo == hi {\n        st.tree[node] = val\n        return\n    }\n    mid := (lo + hi) / 2\n    if idx <= mid {\n        st.update(2*node, lo, mid, idx, val)\n    } else {\n        st.update(2*node+1, mid+1, hi, idx, val)\n    }\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        6,
        7
      ],
      "build_start": [
        8
      ],
      "build_leaf": [
        13,
        14
      ],
      "build_split": [
        17
      ],
      "build_merge": [
        20
      ],
      "build_done": [
        12
      ],
      "query_start": [
        23
      ],
      "query_visit": [
        23
      ],
      "query_total": [
        24,
        25
      ],
      "query_none": [
        27,
        28
      ],
      "query_partial": [
        30,
        31,
        32
      ],
      "query_combine": [
        33
      ],
      "query_done": [
        23
      ],
      "update_start": [
        36
      ],
      "update_visit": [
        36
      ],
      "update_leaf": [
        37,
        38
      ],
      "update_go": [
        41,
        42,
        43,
        45
      ],
      "update_merge": [
        47
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        24
      ],
      "query_no_overlap": [
        27
      ],
      "update_go_left": [
        42
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class SegmentTree {\n    constructor(arr) {\n        this.n = arr.length;\n        this.tree = new Array(4 * this.n).fill(0);\n        this.build(arr, 1, 0, this.n - 1);\n    }\n\n    build(arr, node, lo, hi) {\n        if (lo === hi) {\n            this.tree[node] = arr[lo];\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        this.build(arr, 2*node, lo, mid);\n        this.build(arr, 2*node+1, mid+1, hi);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    query(node, lo, hi, l, r) {\n        if (l <= lo && hi <= r)\n            return this.tree[node];\n        if (hi < l || lo > r)\n            return 0;\n        const mid = Math.floor((lo + hi) / 2);\n        const left = this.query(2*node, lo, mid, l, r);\n        const right = this.query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n\n    update(node, lo, hi, idx, val) {\n        if (lo === hi) {\n            this.tree[node] = val;\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        if (idx <= mid)\n            this.update(2*node, lo, mid, idx, val);\n        else\n            this.update(2*node+1, mid+1, hi, idx, val);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4
      ],
      "build_start": [
        5
      ],
      "build_leaf": [
        9,
        10
      ],
      "build_split": [
        13
      ],
      "build_merge": [
        16
      ],
      "build_done": [
        8
      ],
      "query_start": [
        19
      ],
      "query_visit": [
        19
      ],
      "query_total": [
        20,
        21
      ],
      "query_none": [
        22,
        23
      ],
      "query_partial": [
        24,
        25,
        26
      ],
      "query_combine": [
        27
      ],
      "query_done": [
        19
      ],
      "update_start": [
        30
      ],
      "update_visit": [
        30
      ],
      "update_leaf": [
        31,
        32
      ],
      "update_go": [
        35,
        36,
        37,
        39
      ],
      "update_merge": [
        40
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        20
      ],
      "query_no_overlap": [
        22
      ],
      "update_go_left": [
        36
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class SegmentTree {\n    private tree: number[];\n    private n: number;\n\n    constructor(arr: number[]) {\n        this.n = arr.length;\n        this.tree = new Array(4 * this.n).fill(0);\n        this.build(arr, 1, 0, this.n - 1);\n    }\n\n    build(arr: number[], node: number, lo: number, hi: number): void {\n        if (lo === hi) {\n            this.tree[node] = arr[lo];\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        this.build(arr, 2*node, lo, mid);\n        this.build(arr, 2*node+1, mid+1, hi);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    query(node: number, lo: number, hi: number, l: number, r: number): number {\n        if (l <= lo && hi <= r)\n            return this.tree[node];\n        if (hi < l || lo > r)\n            return 0;\n        const mid = Math.floor((lo + hi) / 2);\n        const left = this.query(2*node, lo, mid, l, r);\n        const right = this.query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n\n    update(node: number, lo: number, hi: number, idx: number, val: number): void {\n        if (lo === hi) {\n            this.tree[node] = val;\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        if (idx <= mid)\n            this.update(2*node, lo, mid, idx, val);\n        else\n            this.update(2*node+1, mid+1, hi, idx, val);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        5,
        6,
        7
      ],
      "build_start": [
        8
      ],
      "build_leaf": [
        12,
        13
      ],
      "build_split": [
        16
      ],
      "build_merge": [
        19
      ],
      "build_done": [
        11
      ],
      "query_start": [
        22
      ],
      "query_visit": [
        22
      ],
      "query_total": [
        23,
        24
      ],
      "query_none": [
        25,
        26
      ],
      "query_partial": [
        27,
        28,
        29
      ],
      "query_combine": [
        30
      ],
      "query_done": [
        22
      ],
      "update_start": [
        33
      ],
      "update_visit": [
        33
      ],
      "update_leaf": [
        34,
        35
      ],
      "update_go": [
        38,
        39,
        40,
        42
      ],
      "update_merge": [
        43
      ],
      "complete": [
        1
      ]
    },
    "conditionalMap": {
      "query_total_overlap": [
        23
      ],
      "query_no_overlap": [
        25
      ],
      "update_go_left": [
        39
      ]
    }
  }
};

const SegmentTreePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        9,
        11
      ],
      "queryL": 1,
      "queryR": 4,
      "updateIdx": 2,
      "updateVal": 10
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        2,
        4,
        6,
        8
      ],
      "queryL": 0,
      "queryR": 3,
      "updateIdx": 1,
      "updateVal": 7
    }
  },
  {
    "id": "ex3",
    "label": "Large",
    "value": {
      "arr": [
        5,
        8,
        2,
        6,
        3,
        7,
        1,
        4
      ],
      "queryL": 2,
      "queryR": 6,
      "updateIdx": 4,
      "updateVal": 15
    }
  },
  {
    "id": "ex4",
    "label": "Tens",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ],
      "queryL": 0,
      "queryR": 2,
      "updateIdx": 3,
      "updateVal": 5
    }
  }
];

function generateSegmentTreeSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.arr.slice(),r=e.queryL,n=e.queryR,a=e.updateIdx,l=e.updateVal,o=t.length,d=Array(4*o).fill(0),u=new StepRecorder({},{});for(let e=0;e<o;e++)u.add_new_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:void 0});function s(e,t,r,i,n){let a=1===e?void 0:`seg_${Math.floor(e/2)}`;u.add_new_visual(`seg_${e}`,{type:"binaryTreeNode",value:i,parent:a,isLeftChild:1===e?void 0:e%2==0,label:t===r?`[${t}]`:`[${t},${r}]`,state:n||void 0})}function h(e,t,r,i,n){let a=1===e?void 0:`seg_${Math.floor(e/2)}`;u.update_visual(`seg_${e}`,{type:"binaryTreeNode",value:i,parent:a,isLeftChild:1===e?void 0:e%2==0,label:t===r?`[${t}]`:`[${t},${r}]`,state:n||void 0})}function c(e,t,r){if(h(e,t,r,d[e],void 0),t<r){let i=Math.floor((t+r)/2);c(2*e,t,i),c(2*e+1,i+1,r)}}u.record("-",`Start: Build a Segment Tree from array [${t.join(", ")}], then query sum of range [${r}, ${n}] and update index ${a} to ${l}.`),u.add_new_variable("phase","Build"),u.record("build_start","Phase 1: Build the segment tree from the input array using bottom-up recursion."),!function e(r,i,n){if(i===n){d[r]=t[i],s(r,i,n,d[r],"active"),u.update_visual(`arr_${i}`,{type:"arrayElement",value:t[i],position:i,label:`${i}`,state:"active"}),u.record("build_leaf",`Leaf node ${r}: tree[${r}] = arr[${i}] = ${t[i]}. Range [${i}, ${n}].`),u.update_visual(`arr_${i}`,{type:"arrayElement",value:t[i],position:i,label:`${i}`,state:"visited"}),h(r,i,n,d[r],"visited");return}let a=Math.floor((i+n)/2);s(r,i,n,0,"highlight"),u.record("build_split",`Node ${r}: Split range [${i}, ${n}] at mid = ${a}. Recurse left [${i}, ${a}] and right [${a+1}, ${n}].`),e(2*r,i,a),e(2*r+1,a+1,n),d[r]=d[2*r]+d[2*r+1],h(r,i,n,d[r],"active"),u.record("build_merge",`Node ${r}: Merge children. tree[${r}] = ${d[2*r]} + ${d[2*r+1]} = ${d[r]}. Range [${i}, ${n}].`),h(r,i,n,d[r],"visited")}(1,0,o-1),c(1,0,o-1);for(let e=0;e<o;e++)u.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:void 0});u.record("build_done",`Build complete. The root node holds the total sum = ${d[1]}.`),u.update_variable("phase","Query"),u.add_new_variable("queryResult","?"),u.record("query_start",`Phase 2: Query the sum of range [${r}, ${n}].`),u.add_new_visual("query_range",{type:"range",start:r,end:n,label:"query",state:"highlight"});let p=function e(t,r,i,n,a){if(h(t,r,i,d[t],"highlight"),u.record("query_visit",`Visit node ${t} [${r}, ${i}]. Query range [${n}, ${a}].`),n<=r&&i<=a)return h(t,r,i,d[t],"active"),u.add_conditional("query_total_overlap",!0),u.record("query_total",`Node ${t} [${r}, ${i}] is fully within query [${n}, ${a}]. Return ${d[t]}.`),d[t];if(i<n||r>a)return h(t,r,i,d[t],"muted"),u.add_conditional("query_no_overlap",!0),u.record("query_none",`Node ${t} [${r}, ${i}] is outside query [${n}, ${a}]. Return 0.`),0;u.add_conditional("query_total_overlap",!1),u.add_conditional("query_no_overlap",!1),u.record("query_partial",`Node ${t} [${r}, ${i}] partially overlaps query [${n}, ${a}]. Recurse into children.`);let l=Math.floor((r+i)/2),o=e(2*t,r,l,n,a),s=e(2*t+1,l+1,i,n,a),c=o+s;return h(t,r,i,d[t],"active"),u.record("query_combine",`Node ${t}: Combined result = ${o} + ${s} = ${c}.`),c}(1,0,o-1,r,n);u.update_variable("queryResult",p),c(1,0,o-1),u.delete_visual("query_range"),u.record("query_done",`Query complete. Sum of range [${r}, ${n}] = ${p}.`),u.update_variable("phase","Update"),u.delete_variable("queryResult"),u.record("update_start",`Phase 3: Update index ${a} from ${t[a]} to ${l}.`),u.update_visual(`arr_${a}`,{type:"arrayElement",value:t[a],position:a,label:`${a}`,state:"highlight"}),!function e(t,r,i,n,a){if(h(t,r,i,d[t],"highlight"),u.record("update_visit",`Visit node ${t} [${r}, ${i}] to update index ${n}.`),r===i){d[t]=a,h(t,r,i,d[t],"active"),u.update_visual(`arr_${n}`,{type:"arrayElement",value:a,position:n,label:`${n}`,state:"active"}),u.record("update_leaf",`Leaf node ${t}: Update tree[${t}] = ${a}. Range [${r}, ${i}].`);return}let l=Math.floor((r+i)/2);u.add_conditional("update_go_left",n<=l),n<=l?(u.record("update_go",`Index ${n} <= mid ${l}. Go left to node ${2*t}.`),e(2*t,r,l,n,a)):(u.record("update_go",`Index ${n} > mid ${l}. Go right to node ${2*t+1}.`),e(2*t+1,l+1,i,n,a)),d[t]=d[2*t]+d[2*t+1],h(t,r,i,d[t],"active"),u.record("update_merge",`Node ${t}: Recalculate tree[${t}] = ${d[2*t]} + ${d[2*t+1]} = ${d[t]}.`)}(1,0,o-1,a,l),t[a]=l,!function e(t,r,i){if(h(t,r,i,d[t],"visited"),r<i){let n=Math.floor((r+i)/2);e(2*t,r,n),e(2*t+1,n+1,i)}}(1,0,o-1);for(let e=0;e<o;e++)u.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"visited"});return u.record("complete",`Done! Segment tree updated. New root sum = ${d[1]}. Array: [${t.join(", ")}].`),u.getSteps()
  })(__inputArg);
}

export function SegmentTreeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SegmentTreeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSegmentTreeSteps(e) as any[];
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
      title="Segment Tree"
      slug="segment-tree"
      approaches={approaches}
      presets={SegmentTreePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Segment Tree with Lazy Propagation (segment-tree-lazy)
// ==========================================

const SegmentTreeLazyTemplates = {
  "python": {
    "language": "python",
    "code": "class SegmentTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self.lazy = [0] * (4 * self.n)\n        self.build(arr, 1, 0, self.n - 1)\n\n    def build(self, arr, node, lo, hi):\n        if lo == hi:\n            self.tree[node] = arr[lo]\n            return\n        mid = (lo + hi) // 2\n        self.build(arr, 2*node, lo, mid)\n        self.build(arr, 2*node+1, mid+1, hi)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def push_down(self, node, lo, hi):\n        if self.lazy[node] != 0:\n            mid = (lo + hi) // 2\n            self.apply(2*node, lo, mid, self.lazy[node])\n            self.apply(2*node+1, mid+1, hi, self.lazy[node])\n            self.lazy[node] = 0\n\n    def apply(self, node, lo, hi, val):\n        self.tree[node] += val * (hi - lo + 1)\n        self.lazy[node] += val\n\n    def update(self, node, lo, hi, l, r, val):\n        if r < lo or hi < l:\n            return\n        if l <= lo and hi <= r:\n            self.apply(node, lo, hi, val)\n            return\n        self.push_down(node, lo, hi)\n        mid = (lo + hi) // 2\n        self.update(2*node, lo, mid, l, r, val)\n        self.update(2*node+1, mid+1, hi, l, r, val)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def query(self, node, lo, hi, l, r):\n        if r < lo or hi < l:\n            return 0\n        if l <= lo and hi <= r:\n            return self.tree[node]\n        self.push_down(node, lo, hi)\n        mid = (lo + hi) // 2\n        left = self.query(2*node, lo, mid, l, r)\n        right = self.query(2*node+1, mid+1, hi, l, r)\n        return left + right",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "build_leaf": [
        9,
        10
      ],
      "build_split": [
        12
      ],
      "build_merge": [
        15
      ],
      "build_done": [
        6
      ],
      "update_start": [
        28
      ],
      "update_out_of_range": [
        29,
        30
      ],
      "update_lazy": [
        31,
        32,
        33
      ],
      "update_partial": [
        34,
        35
      ],
      "push_down": [
        17,
        18,
        19,
        20,
        21,
        22
      ],
      "update_merge": [
        38
      ],
      "update_done": [
        28
      ],
      "query_start": [
        40
      ],
      "query_out_of_range": [
        41,
        42
      ],
      "query_covered": [
        43,
        44
      ],
      "query_partial": [
        45,
        46
      ],
      "query_merge": [
        49
      ],
      "complete": [
        49
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        29
      ],
      "fully_covered": [
        31
      ],
      "query_out_of_range": [
        41
      ],
      "query_fully_covered": [
        43
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class SegmentTree {\n    int[] tree, lazy;\n    int n;\n\n    SegmentTree(int[] arr) {\n        n = arr.length;\n        tree = new int[4 * n];\n        lazy = new int[4 * n];\n        build(arr, 1, 0, n - 1);\n    }\n\n    void build(int[] arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        build(arr, 2*node, lo, mid);\n        build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    void pushDown(int node, int lo, int hi) {\n        if (lazy[node] != 0) {\n            int mid = (lo + hi) / 2;\n            apply(2*node, lo, mid, lazy[node]);\n            apply(2*node+1, mid+1, hi, lazy[node]);\n            lazy[node] = 0;\n        }\n    }\n\n    void apply(int node, int lo, int hi, int val) {\n        tree[node] += val * (hi - lo + 1);\n        lazy[node] += val;\n    }\n\n    void update(int node, int lo, int hi, int l, int r, int val) {\n        if (r < lo || hi < l) return;\n        if (l <= lo && hi <= r) {\n            apply(node, lo, hi, val);\n            return;\n        }\n        pushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        update(2*node, lo, mid, l, r, val);\n        update(2*node+1, mid+1, hi, l, r, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    int query(int node, int lo, int hi, int l, int r) {\n        if (r < lo || hi < l) return 0;\n        if (l <= lo && hi <= r) return tree[node];\n        pushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        int left = query(2*node, lo, mid, l, r);\n        int right = query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        5,
        6,
        7,
        8,
        9
      ],
      "build_leaf": [
        13,
        14
      ],
      "build_split": [
        17
      ],
      "build_merge": [
        20
      ],
      "build_done": [
        9
      ],
      "update_start": [
        37
      ],
      "update_out_of_range": [
        38
      ],
      "update_lazy": [
        39,
        40,
        41
      ],
      "update_partial": [
        43,
        44
      ],
      "push_down": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "update_merge": [
        47
      ],
      "update_done": [
        37
      ],
      "query_start": [
        50
      ],
      "query_out_of_range": [
        51
      ],
      "query_covered": [
        52
      ],
      "query_partial": [
        53,
        54
      ],
      "query_merge": [
        57
      ],
      "complete": [
        57
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        38
      ],
      "fully_covered": [
        39
      ],
      "query_out_of_range": [
        51
      ],
      "query_fully_covered": [
        52
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class SegmentTree {\n    vector<int> tree, lazy;\n    int n;\npublic:\n    SegmentTree(vector<int>& arr) {\n        n = arr.size();\n        tree.assign(4 * n, 0);\n        lazy.assign(4 * n, 0);\n        build(arr, 1, 0, n - 1);\n    }\n\n    void build(vector<int>& arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        build(arr, 2*node, lo, mid);\n        build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    void pushDown(int node, int lo, int hi) {\n        if (lazy[node] != 0) {\n            int mid = (lo + hi) / 2;\n            apply(2*node, lo, mid, lazy[node]);\n            apply(2*node+1, mid+1, hi, lazy[node]);\n            lazy[node] = 0;\n        }\n    }\n\n    void apply(int node, int lo, int hi, int val) {\n        tree[node] += val * (hi - lo + 1);\n        lazy[node] += val;\n    }\n\n    void update(int node, int lo, int hi, int l, int r, int val) {\n        if (r < lo || hi < l) return;\n        if (l <= lo && hi <= r) {\n            apply(node, lo, hi, val);\n            return;\n        }\n        pushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        update(2*node, lo, mid, l, r, val);\n        update(2*node+1, mid+1, hi, l, r, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    int query(int node, int lo, int hi, int l, int r) {\n        if (r < lo || hi < l) return 0;\n        if (l <= lo && hi <= r) return tree[node];\n        pushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        int left = query(2*node, lo, mid, l, r);\n        int right = query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        5,
        6,
        7,
        8,
        9
      ],
      "build_leaf": [
        13,
        14
      ],
      "build_split": [
        17
      ],
      "build_merge": [
        20
      ],
      "build_done": [
        9
      ],
      "update_start": [
        37
      ],
      "update_out_of_range": [
        38
      ],
      "update_lazy": [
        39,
        40,
        41
      ],
      "update_partial": [
        43,
        44
      ],
      "push_down": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "update_merge": [
        47
      ],
      "update_done": [
        37
      ],
      "query_start": [
        50
      ],
      "query_out_of_range": [
        51
      ],
      "query_covered": [
        52
      ],
      "query_partial": [
        53,
        54
      ],
      "query_merge": [
        57
      ],
      "complete": [
        57
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        38
      ],
      "fully_covered": [
        39
      ],
      "query_out_of_range": [
        51
      ],
      "query_fully_covered": [
        52
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class SegmentTree {\n    int[] tree, lazy;\n    int n;\n\n    public SegmentTree(int[] arr) {\n        n = arr.Length;\n        tree = new int[4 * n];\n        lazy = new int[4 * n];\n        Build(arr, 1, 0, n - 1);\n    }\n\n    void Build(int[] arr, int node, int lo, int hi) {\n        if (lo == hi) {\n            tree[node] = arr[lo];\n            return;\n        }\n        int mid = (lo + hi) / 2;\n        Build(arr, 2*node, lo, mid);\n        Build(arr, 2*node+1, mid+1, hi);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    void PushDown(int node, int lo, int hi) {\n        if (lazy[node] != 0) {\n            int mid = (lo + hi) / 2;\n            Apply(2*node, lo, mid, lazy[node]);\n            Apply(2*node+1, mid+1, hi, lazy[node]);\n            lazy[node] = 0;\n        }\n    }\n\n    void Apply(int node, int lo, int hi, int val) {\n        tree[node] += val * (hi - lo + 1);\n        lazy[node] += val;\n    }\n\n    public void Update(int node, int lo, int hi, int l, int r, int val) {\n        if (r < lo || hi < l) return;\n        if (l <= lo && hi <= r) {\n            Apply(node, lo, hi, val);\n            return;\n        }\n        PushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        Update(2*node, lo, mid, l, r, val);\n        Update(2*node+1, mid+1, hi, l, r, val);\n        tree[node] = tree[2*node] + tree[2*node+1];\n    }\n\n    public int Query(int node, int lo, int hi, int l, int r) {\n        if (r < lo || hi < l) return 0;\n        if (l <= lo && hi <= r) return tree[node];\n        PushDown(node, lo, hi);\n        int mid = (lo + hi) / 2;\n        int left = Query(2*node, lo, mid, l, r);\n        int right = Query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        5,
        6,
        7,
        8,
        9
      ],
      "build_leaf": [
        13,
        14
      ],
      "build_split": [
        17
      ],
      "build_merge": [
        20
      ],
      "build_done": [
        9
      ],
      "update_start": [
        37
      ],
      "update_out_of_range": [
        38
      ],
      "update_lazy": [
        39,
        40,
        41
      ],
      "update_partial": [
        43,
        44
      ],
      "push_down": [
        23,
        24,
        25,
        26,
        27,
        28
      ],
      "update_merge": [
        47
      ],
      "update_done": [
        37
      ],
      "query_start": [
        50
      ],
      "query_out_of_range": [
        51
      ],
      "query_covered": [
        52
      ],
      "query_partial": [
        53,
        54
      ],
      "query_merge": [
        57
      ],
      "complete": [
        57
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        38
      ],
      "fully_covered": [
        39
      ],
      "query_out_of_range": [
        51
      ],
      "query_fully_covered": [
        52
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type SegmentTree struct {\n    tree, lazy []int\n    n          int\n}\n\nfunc NewSegmentTree(arr []int) *SegmentTree {\n    n := len(arr)\n    st := &SegmentTree{\n        tree: make([]int, 4*n),\n        lazy: make([]int, 4*n),\n        n:    n,\n    }\n    st.build(arr, 1, 0, n-1)\n    return st\n}\n\nfunc (st *SegmentTree) build(arr []int, node, lo, hi int) {\n    if lo == hi {\n        st.tree[node] = arr[lo]\n        return\n    }\n    mid := (lo + hi) / 2\n    st.build(arr, 2*node, lo, mid)\n    st.build(arr, 2*node+1, mid+1, hi)\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}\n\nfunc (st *SegmentTree) pushDown(node, lo, hi int) {\n    if st.lazy[node] != 0 {\n        mid := (lo + hi) / 2\n        st.apply(2*node, lo, mid, st.lazy[node])\n        st.apply(2*node+1, mid+1, hi, st.lazy[node])\n        st.lazy[node] = 0\n    }\n}\n\nfunc (st *SegmentTree) apply(node, lo, hi, val int) {\n    st.tree[node] += val * (hi - lo + 1)\n    st.lazy[node] += val\n}\n\nfunc (st *SegmentTree) Update(node, lo, hi, l, r, val int) {\n    if r < lo || hi < l {\n        return\n    }\n    if l <= lo && hi <= r {\n        st.apply(node, lo, hi, val)\n        return\n    }\n    st.pushDown(node, lo, hi)\n    mid := (lo + hi) / 2\n    st.Update(2*node, lo, mid, l, r, val)\n    st.Update(2*node+1, mid+1, hi, l, r, val)\n    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]\n}\n\nfunc (st *SegmentTree) Query(node, lo, hi, l, r int) int {\n    if r < lo || hi < l {\n        return 0\n    }\n    if l <= lo && hi <= r {\n        return st.tree[node]\n    }\n    st.pushDown(node, lo, hi)\n    mid := (lo + hi) / 2\n    left := st.Query(2*node, lo, mid, l, r)\n    right := st.Query(2*node+1, mid+1, hi, l, r)\n    return left + right\n}",
    "lineMap": {
      "-": [
        1,
        6,
        7,
        8,
        9,
        10,
        11,
        13
      ],
      "build_leaf": [
        18,
        19
      ],
      "build_split": [
        22
      ],
      "build_merge": [
        25
      ],
      "build_done": [
        13
      ],
      "update_start": [
        42
      ],
      "update_out_of_range": [
        43,
        44
      ],
      "update_lazy": [
        46,
        47,
        48
      ],
      "update_partial": [
        50,
        51
      ],
      "push_down": [
        28,
        29,
        30,
        31,
        32,
        33
      ],
      "update_merge": [
        54
      ],
      "update_done": [
        42
      ],
      "query_start": [
        57
      ],
      "query_out_of_range": [
        58,
        59
      ],
      "query_covered": [
        61,
        62
      ],
      "query_partial": [
        64,
        65
      ],
      "query_merge": [
        68
      ],
      "complete": [
        68
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        43
      ],
      "fully_covered": [
        46
      ],
      "query_out_of_range": [
        58
      ],
      "query_fully_covered": [
        61
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class SegmentTree {\n    constructor(arr) {\n        this.n = arr.length;\n        this.tree = new Array(4 * this.n).fill(0);\n        this.lazy = new Array(4 * this.n).fill(0);\n        this.build(arr, 1, 0, this.n - 1);\n    }\n\n    build(arr, node, lo, hi) {\n        if (lo === hi) {\n            this.tree[node] = arr[lo];\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        this.build(arr, 2*node, lo, mid);\n        this.build(arr, 2*node+1, mid+1, hi);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    pushDown(node, lo, hi) {\n        if (this.lazy[node] !== 0) {\n            const mid = Math.floor((lo + hi) / 2);\n            this.apply(2*node, lo, mid, this.lazy[node]);\n            this.apply(2*node+1, mid+1, hi, this.lazy[node]);\n            this.lazy[node] = 0;\n        }\n    }\n\n    apply(node, lo, hi, val) {\n        this.tree[node] += val * (hi - lo + 1);\n        this.lazy[node] += val;\n    }\n\n    update(node, lo, hi, l, r, val) {\n        if (r < lo || hi < l) return;\n        if (l <= lo && hi <= r) {\n            this.apply(node, lo, hi, val);\n            return;\n        }\n        this.pushDown(node, lo, hi);\n        const mid = Math.floor((lo + hi) / 2);\n        this.update(2*node, lo, mid, l, r, val);\n        this.update(2*node+1, mid+1, hi, l, r, val);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    query(node, lo, hi, l, r) {\n        if (r < lo || hi < l) return 0;\n        if (l <= lo && hi <= r) return this.tree[node];\n        this.pushDown(node, lo, hi);\n        const mid = Math.floor((lo + hi) / 2);\n        const left = this.query(2*node, lo, mid, l, r);\n        const right = this.query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2,
        3,
        4,
        5,
        6
      ],
      "build_leaf": [
        10,
        11
      ],
      "build_split": [
        14
      ],
      "build_merge": [
        17
      ],
      "build_done": [
        6
      ],
      "update_start": [
        34
      ],
      "update_out_of_range": [
        35
      ],
      "update_lazy": [
        36,
        37,
        38
      ],
      "update_partial": [
        40,
        41
      ],
      "push_down": [
        20,
        21,
        22,
        23,
        24,
        25
      ],
      "update_merge": [
        44
      ],
      "update_done": [
        34
      ],
      "query_start": [
        47
      ],
      "query_out_of_range": [
        48
      ],
      "query_covered": [
        49
      ],
      "query_partial": [
        50,
        51
      ],
      "query_merge": [
        54
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        35
      ],
      "fully_covered": [
        36
      ],
      "query_out_of_range": [
        48
      ],
      "query_fully_covered": [
        49
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class SegmentTree {\n    private tree: number[];\n    private lazy: number[];\n    private n: number;\n\n    constructor(arr: number[]) {\n        this.n = arr.length;\n        this.tree = new Array(4 * this.n).fill(0);\n        this.lazy = new Array(4 * this.n).fill(0);\n        this.build(arr, 1, 0, this.n - 1);\n    }\n\n    build(arr: number[], node: number, lo: number, hi: number): void {\n        if (lo === hi) {\n            this.tree[node] = arr[lo];\n            return;\n        }\n        const mid = Math.floor((lo + hi) / 2);\n        this.build(arr, 2*node, lo, mid);\n        this.build(arr, 2*node+1, mid+1, hi);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    pushDown(node: number, lo: number, hi: number): void {\n        if (this.lazy[node] !== 0) {\n            const mid = Math.floor((lo + hi) / 2);\n            this.apply(2*node, lo, mid, this.lazy[node]);\n            this.apply(2*node+1, mid+1, hi, this.lazy[node]);\n            this.lazy[node] = 0;\n        }\n    }\n\n    apply(node: number, lo: number, hi: number, val: number): void {\n        this.tree[node] += val * (hi - lo + 1);\n        this.lazy[node] += val;\n    }\n\n    update(node: number, lo: number, hi: number, l: number, r: number, val: number): void {\n        if (r < lo || hi < l) return;\n        if (l <= lo && hi <= r) {\n            this.apply(node, lo, hi, val);\n            return;\n        }\n        this.pushDown(node, lo, hi);\n        const mid = Math.floor((lo + hi) / 2);\n        this.update(2*node, lo, mid, l, r, val);\n        this.update(2*node+1, mid+1, hi, l, r, val);\n        this.tree[node] = this.tree[2*node] + this.tree[2*node+1];\n    }\n\n    query(node: number, lo: number, hi: number, l: number, r: number): number {\n        if (r < lo || hi < l) return 0;\n        if (l <= lo && hi <= r) return this.tree[node];\n        this.pushDown(node, lo, hi);\n        const mid = Math.floor((lo + hi) / 2);\n        const left = this.query(2*node, lo, mid, l, r);\n        const right = this.query(2*node+1, mid+1, hi, l, r);\n        return left + right;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        6,
        7,
        8,
        9,
        10
      ],
      "build_leaf": [
        14,
        15
      ],
      "build_split": [
        18
      ],
      "build_merge": [
        21
      ],
      "build_done": [
        10
      ],
      "update_start": [
        38
      ],
      "update_out_of_range": [
        39
      ],
      "update_lazy": [
        40,
        41,
        42
      ],
      "update_partial": [
        44,
        45
      ],
      "push_down": [
        24,
        25,
        26,
        27,
        28,
        29
      ],
      "update_merge": [
        48
      ],
      "update_done": [
        38
      ],
      "query_start": [
        51
      ],
      "query_out_of_range": [
        52
      ],
      "query_covered": [
        53
      ],
      "query_partial": [
        54,
        55
      ],
      "query_merge": [
        58
      ],
      "complete": [
        58
      ]
    },
    "conditionalMap": {
      "out_of_range": [
        39
      ],
      "fully_covered": [
        40
      ],
      "query_out_of_range": [
        52
      ],
      "query_fully_covered": [
        53
      ]
    }
  }
};

const SegmentTreeLazyPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        5,
        7,
        9,
        11
      ],
      "updateL": 1,
      "updateR": 4,
      "updateVal": 3,
      "queryL": 2,
      "queryR": 5
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        2,
        4,
        6,
        8
      ],
      "updateL": 0,
      "updateR": 2,
      "updateVal": 5,
      "queryL": 1,
      "queryR": 3
    }
  },
  {
    "id": "ex3",
    "label": "Full Range Query",
    "value": {
      "arr": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8
      ],
      "updateL": 2,
      "updateR": 6,
      "updateVal": 2,
      "queryL": 0,
      "queryR": 7
    }
  },
  {
    "id": "ex4",
    "label": "Update All",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ],
      "updateL": 0,
      "updateR": 4,
      "updateVal": 10,
      "queryL": 0,
      "queryR": 2
    }
  }
];

function generateSegmentTreeLazySteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.arr,r=e.updateL,l=e.updateR,i=e.updateVal,a=e.queryL,o=e.queryR,d=t.length,u=4*d,s=Array(u).fill(0),h=Array(u).fill(0),p=new StepRecorder({},{});function c(e,t,r,n,l,i){let a=`node_${e}`,o=t===r?`[${t}]`:`[${t},${r}]`;p.update_visual(a,{type:"binaryTreeNode",value:s[e],label:o,state:n,parent:l,isLeftChild:i})}function f(e){let t=`lazy_${e}`;p.update_visual(t,{type:"metadata",value:h[e],label:`lazy[${e}]`,state:0!==h[e]?"pending":void 0})}function m(e,t,r,n){p.update_visual(`range_${e}`,{type:"range",start:t,end:r,label:e,state:n})}function y(e){p.delete_visual(`range_${e}`)}for(let e=0;e<d;e++)p.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:void 0});function g(e,t,r){if(0!==h[e]){let n=Math.floor((t+r)/2);s[2*e]+=h[e]*(n-t+1),h[2*e]+=h[e],s[2*e+1]+=h[e]*(r-n),h[2*e+1]+=h[e],h[e]=0,function t(r,n,l,i,a){let o=r===e?"active":void 0;if(c(r,n,l,o,i,a),f(r),n<l){let e=Math.floor((n+l)/2);t(2*r,n,e,`node_${r}`,!0),t(2*r+1,e+1,l,`node_${r}`,!1)}}(1,0,d-1),p.record("push_down",`Push down lazy value from node ${e}. Left child gets +${0!==h[2*e]?"accumulated":"propagated"} value, right child gets propagated value. Clear lazy[${e}].`)}}p.record("-",`Start: Build a segment tree from array [${t.join(", ")}], then perform range update and range query with lazy propagation.`),!function e(r,n,l,i,a){let o=`node_${r}`;if(n===l){s[r]=t[n],c(r,n,l,"active",i,a),f(r),p.update_visual(`arr_${n}`,{type:"arrayElement",value:t[n],position:n,label:`${n}`,state:"active"}),p.record("build_leaf",`Leaf node ${r}: range [${n}] = arr[${n}] = ${t[n]}`),p.update_visual(`arr_${n}`,{type:"arrayElement",value:t[n],position:n,label:`${n}`,state:void 0}),c(r,n,l,void 0,i,a);return}let d=Math.floor((n+l)/2);s[r]=0,c(r,n,l,"visiting",i,a),f(r),p.record("build_split",`Building node ${r} for range [${n}, ${l}]. Split at mid = ${d}.`),e(2*r,n,d,o,!0),e(2*r+1,d+1,l,o,!1),s[r]=s[2*r]+s[2*r+1],c(r,n,l,"active",i,a),p.record("build_merge",`Node ${r}: sum of children = ${s[2*r]} + ${s[2*r+1]} = ${s[r]}`),c(r,n,l,void 0,i,a)}(1,0,d-1),p.record("build_done",`Segment tree built. Root stores total sum = ${s[1]}.`),m("update",r,l,"highlight"),p.record("update_start",`Range Update: Add ${i} to every element in range [${r}, ${l}].`),!function e(t,r,n,l,i,a,o,d){if(i<r||n<l){c(t,r,n,"muted",o,d),f(t),p.add_conditional("out_of_range",!0),p.record("update_out_of_range",`Node ${t} range [${r}, ${n}] is outside update range [${l}, ${i}]. Skip.`),c(t,r,n,void 0,o,d),f(t);return}if(l<=r&&n<=i){let e=n-r+1;s[t]+=a*e,h[t]+=a,c(t,r,n,"highlight",o,d),f(t),p.add_conditional("fully_covered",!0),p.record("update_lazy",`Node ${t} range [${r}, ${n}] fully within [${l}, ${i}]. Add lazy = ${a}. New sum = ${s[t]}.`),c(t,r,n,void 0,o,d),f(t);return}let u=`node_${t}`;c(t,r,n,"visiting",o,d),f(t),p.record("update_partial",`Node ${t} range [${r}, ${n}] partially overlaps [${l}, ${i}]. Push down lazy and recurse.`),g(t,r,n);let m=Math.floor((r+n)/2);e(2*t,r,m,l,i,a,u,!0),e(2*t+1,m+1,n,l,i,a,u,!1),s[t]=s[2*t]+s[2*t+1],c(t,r,n,"active",o,d),f(t),p.record("update_merge",`Node ${t}: recalculate sum = ${s[2*t]} + ${s[2*t+1]} = ${s[t]}`),c(t,r,n,void 0,o,d),f(t)}(1,0,d-1,r,l,i);for(let e=0;e<d;e++)e>=r&&e<=l&&(t[e]+=i),p.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:e>=r&&e<=l?"highlight":void 0});p.record("update_done",`Range update complete. Elements in [${r}, ${l}] increased by ${i}.`);for(let e=0;e<d;e++)p.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:void 0});y("update"),m("query",a,o,"active"),p.record("query_start",`Range Query: Find the sum of elements in range [${a}, ${o}].`);let _=0;_=function e(t,r,n,l,i,a,o){if(i<r||n<l)return c(t,r,n,"muted",a,o),f(t),p.add_conditional("query_out_of_range",!0),p.record("query_out_of_range",`Node ${t} range [${r}, ${n}] outside query range [${l}, ${i}]. Return 0.`),c(t,r,n,void 0,a,o),f(t),0;if(l<=r&&n<=i)return c(t,r,n,"active",a,o),f(t),p.add_conditional("query_fully_covered",!0),p.record("query_covered",`Node ${t} range [${r}, ${n}] fully within [${l}, ${i}]. Return sum = ${s[t]}.`),c(t,r,n,void 0,a,o),f(t),s[t];let d=`node_${t}`;c(t,r,n,"visiting",a,o),f(t),p.record("query_partial",`Node ${t} range [${r}, ${n}] partially overlaps [${l}, ${i}]. Push down lazy and recurse.`),g(t,r,n);let u=Math.floor((r+n)/2),h=e(2*t,r,u,l,i,d,!0),m=e(2*t+1,u+1,n,l,i,d,!1);return c(t,r,n,"active",a,o),f(t),p.record("query_merge",`Node ${t}: left sum (${h}) + right sum (${m}) = ${h+m}`),c(t,r,n,void 0,a,o),f(t),h+m}(1,0,d-1,a,o);for(let e=0;e<d;e++)p.update_visual(`arr_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:e>=a&&e<=o?"active":void 0});return y("query"),p.record("complete",`Done! Range query sum for [${a}, ${o}] = ${_}.`),p.getSteps()
  })(__inputArg);
}

export function SegmentTreeLazyProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SegmentTreeLazyTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSegmentTreeLazySteps(e) as any[];
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
      title="Segment Tree with Lazy Propagation"
      slug="segment-tree-lazy"
      approaches={approaches}
      presets={SegmentTreeLazyPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sparse Table (sparse-table)
// ==========================================

const SparseTableTemplates = {
  "python": {
    "language": "python",
    "code": "def sparse_table_rmq(arr, query_l, query_r):\n    n = len(arr)\n    LOG = [0] * (n + 1)\n    for i in range(2, n + 1):\n        LOG[i] = LOG[i // 2] + 1\n    K = LOG[n] + 1\n\n    # Build sparse table\n    table = [[0] * n for _ in range(K)]\n    for i in range(n):\n        table[0][i] = arr[i]\n\n    for j in range(1, K):\n        for i in range(n - (1 << j) + 1):\n            if table[j-1][i] <= table[j-1][i + (1 << (j-1))]:\n                table[j][i] = table[j-1][i]\n            else:\n                table[j][i] = table[j-1][i + (1 << (j-1))]\n\n    # Query\n    length = query_r - query_l + 1\n    k = LOG[length]\n    return min(table[k][query_l], table[k][query_r - (1 << k) + 1])",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        21,
        22
      ],
      "query_block1": [
        23
      ],
      "query_block2": [
        23
      ],
      "complete": [
        23
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "int sparseTableRMQ(int[] arr, int queryL, int queryR) {\n    int n = arr.length;\n    int[] LOG = new int[n + 1];\n    for (int i = 2; i <= n; i++)\n        LOG[i] = LOG[i / 2] + 1;\n    int K = LOG[n] + 1;\n\n    // Build sparse table\n    int[][] table = new int[K][n];\n    for (int i = 0; i < n; i++)\n        table[0][i] = arr[i];\n\n    for (int j = 1; j < K; j++) {\n        for (int i = 0; i + (1 << j) - 1 < n; i++) {\n            if (table[j-1][i] <= table[j-1][i + (1 << (j-1))]) {\n                table[j][i] = table[j-1][i];\n            } else {\n                table[j][i] = table[j-1][i + (1 << (j-1))];\n            }\n        }\n    }\n\n    // Query\n    int length = queryR - queryL + 1;\n    int k = LOG[length];\n    return Math.min(table[k][queryL], table[k][queryR - (1 << k) + 1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        24,
        25
      ],
      "query_block1": [
        26
      ],
      "query_block2": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "int sparseTableRMQ(vector<int>& arr, int queryL, int queryR) {\n    int n = arr.size();\n    vector<int> LOG(n + 1, 0);\n    for (int i = 2; i <= n; i++)\n        LOG[i] = LOG[i / 2] + 1;\n    int K = LOG[n] + 1;\n\n    // Build sparse table\n    vector<vector<int>> table(K, vector<int>(n, 0));\n    for (int i = 0; i < n; i++)\n        table[0][i] = arr[i];\n\n    for (int j = 1; j < K; j++) {\n        for (int i = 0; i + (1 << j) - 1 < n; i++) {\n            if (table[j-1][i] <= table[j-1][i + (1 << (j-1))]) {\n                table[j][i] = table[j-1][i];\n            } else {\n                table[j][i] = table[j-1][i + (1 << (j-1))];\n            }\n        }\n    }\n\n    // Query\n    int length = queryR - queryL + 1;\n    int k = LOG[length];\n    return min(table[k][queryL], table[k][queryR - (1 << k) + 1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        24,
        25
      ],
      "query_block1": [
        26
      ],
      "query_block2": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "int SparseTableRMQ(int[] arr, int queryL, int queryR) {\n    int n = arr.Length;\n    int[] LOG = new int[n + 1];\n    for (int i = 2; i <= n; i++)\n        LOG[i] = LOG[i / 2] + 1;\n    int K = LOG[n] + 1;\n\n    // Build sparse table\n    int[,] table = new int[K, n];\n    for (int i = 0; i < n; i++)\n        table[0, i] = arr[i];\n\n    for (int j = 1; j < K; j++) {\n        for (int i = 0; i + (1 << j) - 1 < n; i++) {\n            if (table[j-1, i] <= table[j-1, i + (1 << (j-1))]) {\n                table[j, i] = table[j-1, i];\n            } else {\n                table[j, i] = table[j-1, i + (1 << (j-1))];\n            }\n        }\n    }\n\n    // Query\n    int length = queryR - queryL + 1;\n    int k = LOG[length];\n    return Math.Min(table[k, queryL], table[k, queryR - (1 << k) + 1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        24,
        25
      ],
      "query_block1": [
        26
      ],
      "query_block2": [
        26
      ],
      "complete": [
        26
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
    "code": "func sparseTableRMQ(arr []int, queryL, queryR int) int {\n    n := len(arr)\n    LOG := make([]int, n+1)\n    for i := 2; i <= n; i++ {\n        LOG[i] = LOG[i/2] + 1\n    }\n    K := LOG[n] + 1\n\n    // Build sparse table\n    table := make([][]int, K)\n    for j := range table {\n        table[j] = make([]int, n)\n    }\n    for i := 0; i < n; i++ {\n        table[0][i] = arr[i]\n    }\n\n    for j := 1; j < K; j++ {\n        for i := 0; i+(1<<j)-1 < n; i++ {\n            if table[j-1][i] <= table[j-1][i+(1<<(j-1))] {\n                table[j][i] = table[j-1][i]\n            } else {\n                table[j][i] = table[j-1][i+(1<<(j-1))]\n            }\n        }\n    }\n\n    // Query\n    length := queryR - queryL + 1\n    k := LOG[length]\n    return min(table[k][queryL], table[k][queryR-(1<<k)+1])\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        14,
        15
      ],
      "outer_loop": [
        18
      ],
      "compare": [
        19,
        20
      ],
      "fill_cell": [
        21,
        23
      ],
      "build_done": [
        10
      ],
      "query_start": [
        29,
        30
      ],
      "query_block1": [
        31
      ],
      "query_block2": [
        31
      ],
      "complete": [
        31
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
    "code": "function sparseTableRMQ(arr, queryL, queryR) {\n    const n = arr.length;\n    const LOG = new Array(n + 1).fill(0);\n    for (let i = 2; i <= n; i++)\n        LOG[i] = LOG[Math.floor(i / 2)] + 1;\n    const K = LOG[n] + 1;\n\n    // Build sparse table\n    const table = Array.from({length: K}, () => new Array(n).fill(0));\n    for (let i = 0; i < n; i++)\n        table[0][i] = arr[i];\n\n    for (let j = 1; j < K; j++) {\n        for (let i = 0; i + (1 << j) - 1 < n; i++) {\n            if (table[j-1][i] <= table[j-1][i + (1 << (j-1))]) {\n                table[j][i] = table[j-1][i];\n            } else {\n                table[j][i] = table[j-1][i + (1 << (j-1))];\n            }\n        }\n    }\n\n    // Query\n    const length = queryR - queryL + 1;\n    const k = LOG[length];\n    return Math.min(table[k][queryL], table[k][queryR - (1 << k) + 1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        24,
        25
      ],
      "query_block1": [
        26
      ],
      "query_block2": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function sparseTableRMQ(arr: number[], queryL: number, queryR: number): number {\n    const n = arr.length;\n    const LOG = new Array(n + 1).fill(0);\n    for (let i = 2; i <= n; i++)\n        LOG[i] = LOG[Math.floor(i / 2)] + 1;\n    const K = LOG[n] + 1;\n\n    // Build sparse table\n    const table = Array.from({length: K}, () => new Array(n).fill(0));\n    for (let i = 0; i < n; i++)\n        table[0][i] = arr[i];\n\n    for (let j = 1; j < K; j++) {\n        for (let i = 0; i + (1 << j) - 1 < n; i++) {\n            if (table[j-1][i] <= table[j-1][i + (1 << (j-1))]) {\n                table[j][i] = table[j-1][i];\n            } else {\n                table[j][i] = table[j-1][i + (1 << (j-1))];\n            }\n        }\n    }\n\n    // Query\n    const length = queryR - queryL + 1;\n    const k = LOG[length];\n    return Math.min(table[k][queryL], table[k][queryR - (1 << k) + 1]);\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_row0": [
        10,
        11
      ],
      "outer_loop": [
        13
      ],
      "compare": [
        14,
        15
      ],
      "fill_cell": [
        16,
        18
      ],
      "build_done": [
        9
      ],
      "query_start": [
        24,
        25
      ],
      "query_block1": [
        26
      ],
      "query_block2": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "compare": [
        15
      ]
    }
  }
};

const SparseTablePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard",
    "value": {
      "arr": [
        1,
        3,
        4,
        8,
        6,
        1,
        4,
        2
      ],
      "queryL": 2,
      "queryR": 6
    }
  },
  {
    "id": "ex2",
    "label": "Small",
    "value": {
      "arr": [
        5,
        2,
        4,
        7,
        1,
        3
      ],
      "queryL": 1,
      "queryR": 4
    }
  },
  {
    "id": "ex3",
    "label": "Large",
    "value": {
      "arr": [
        9,
        3,
        7,
        1,
        8,
        12,
        10,
        20,
        15,
        6
      ],
      "queryL": 3,
      "queryR": 8
    }
  },
  {
    "id": "ex4",
    "label": "Left Range",
    "value": {
      "arr": [
        4,
        6,
        2,
        5,
        3,
        8,
        1
      ],
      "queryL": 0,
      "queryR": 3
    }
  },
  {
    "id": "ex5",
    "label": "Full Range",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50
      ],
      "queryL": 0,
      "queryR": 4
    }
  }
];

function generateSparseTableSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=e.arr,r=e.queryL,a=e.queryR,i=t.length,n=new StepRecorder({},{});for(let e=0;e<i;e++)n.add_new_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`});n.record("-",`Start: Build a Sparse Table for array of size ${i}, then answer RMQ(${r}, ${a}).`);let o=Array(i+1).fill(0);for(let e=2;e<=i;e++)o[e]=o[Math.floor(e/2)]+1;let s=o[i]+1,u=[];for(let e=0;e<s;e++)u.push(Array(i).fill(0));for(let e=0;e<i;e++)u[0][e]=t[e];for(let e=0;e<i;e++)n.add_new_visual(`cell_0_${e}`,{type:"matrixElement",value:t[e],row:0,col:e,state:"active"});n.record("init_row0","Initialize row j=0: table[0][i] = arr[i] for each index. Each cell covers a range of length 2^0 = 1.");for(let e=0;e<i;e++)n.update_visual(`cell_0_${e}`,{type:"matrixElement",value:t[e],row:0,col:e});for(let e=1;e<s;e++){let r=1<<e;n.record("outer_loop",`Begin filling row j=${e}: each cell covers a range of length 2^${e} = ${r}.`);for(let l=0;l+r-1<i;l++){let a=u[e-1][l],o=u[e-1][l+(1<<e-1)],s=l+(1<<e-1);n.update_visual(`cell_${e-1}_${l}`,{type:"matrixElement",value:a,row:e-1,col:l,state:"highlight"}),n.update_visual(`cell_${e-1}_${s}`,{type:"matrixElement",value:o,row:e-1,col:s,state:"highlight"});for(let e=l;e<l+r&&e<i;e++)n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"highlight"});n.add_conditional("compare",a<=o),n.record("compare",`Compare table[${e-1}][${l}] = ${a} and table[${e-1}][${s}] = ${o}.`),u[e][l]=Math.min(a,o),n.add_new_visual(`cell_${e}_${l}`,{type:"matrixElement",value:u[e][l],row:e,col:l,state:"active"}),n.record("fill_cell",`table[${e}][${l}] = min(${a}, ${o}) = ${u[e][l]}. This covers arr[${l}..${l+r-1}].`),n.update_visual(`cell_${e-1}_${l}`,{type:"matrixElement",value:a,row:e-1,col:l}),n.update_visual(`cell_${e-1}_${s}`,{type:"matrixElement",value:o,row:e-1,col:s}),n.update_visual(`cell_${e}_${l}`,{type:"matrixElement",value:u[e][l],row:e,col:l});for(let e=l;e<l+r&&e<i;e++)n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`})}}n.record("build_done",`Sparse Table built. Preprocessing complete in O(n log n). Now answering RMQ(${r}, ${a}).`);let c=a-r+1,d=o[c],p=r+(1<<d)-1,b=a-(1<<d)+1;for(let e=r;e<=a;e++)n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"highlight"});n.record("query_start",`Query RMQ(${r}, ${a}): range length = ${c}, k = floor(log2(${c})) = ${d}. We use two overlapping blocks of size 2^${d} = ${1<<d}.`);let h=u[d][r],m=u[d][b];n.update_visual(`cell_${d}_${r}`,{type:"matrixElement",value:h,row:d,col:r,state:"highlight"});for(let e=0;e<i;e++)e>=r&&e<=p?n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"active"}):e>=r&&e<=a&&n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"highlight"});n.record("query_block1",`Block 1: table[${d}][${r}] = ${h}, covers arr[${r}..${p}].`),n.update_visual(`cell_${d}_${b}`,{type:"matrixElement",value:m,row:d,col:b,state:"highlight"});for(let e=r;e<=a;e++)e>=b&&e<=a?n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"active"}):n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"highlight"});n.record("query_block2",`Block 2: table[${d}][${b}] = ${m}, covers arr[${b}..${a}].`);let y=Math.min(h,m);n.update_visual(`cell_${d}_${r}`,{type:"matrixElement",value:h,row:d,col:r,state:h===y?"active":void 0}),n.update_visual(`cell_${d}_${b}`,{type:"matrixElement",value:m,row:d,col:b,state:m===y?"active":void 0});for(let e=r;e<=a;e++)n.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,label:`${e}`,state:"active"});return n.add_new_visual("meta_answer",{type:"metadata",value:y}),n.record("complete",`Done! RMQ(${r}, ${a}) = min(${h}, ${m}) = ${y}. Query answered in O(1).`),n.getSteps()
  })(__inputArg);
}

export function SparseTableProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SparseTableTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSparseTableSteps(e) as any[];
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
      title="Sparse Table"
      slug="sparse-table"
      approaches={approaches}
      presets={SparseTablePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Sqrt Decomposition (sqrt-decomposition)
// ==========================================

const SqrtDecompositionTemplates = {
  "python": {
    "language": "python",
    "code": "import math\n\nclass SqrtDecomposition:\n    def __init__(self, arr):\n        self.arr = arr[:]\n        self.n = len(arr)\n        self.block_size = math.ceil(math.sqrt(self.n))\n        self.blocks = [0] * math.ceil(self.n / self.block_size)\n        for i in range(self.n):\n            self.blocks[i // self.block_size] += arr[i]\n\n    def query(self, l, r):\n        total = 0\n        i = l\n        while i <= r:\n            if i % self.block_size == 0 and i + self.block_size - 1 <= r:\n                total += self.blocks[i // self.block_size]\n                i += self.block_size\n            else:\n                total += self.arr[i]\n                i += 1\n        return total\n\n    def update(self, idx, val):\n        block_idx = idx // self.block_size\n        self.blocks[block_idx] += val - self.arr[idx]\n        self.arr[idx] = val",
    "lineMap": {
      "-": [
        3,
        4
      ],
      "init_blocks": [
        5,
        6,
        7,
        8
      ],
      "build_sum": [
        9,
        10
      ],
      "build_done": [
        8
      ],
      "query_start": [
        12,
        13,
        14
      ],
      "query_partial": [
        19,
        20,
        21
      ],
      "query_full_block": [
        16,
        17,
        18
      ],
      "query_done": [
        22
      ],
      "update_start": [
        24
      ],
      "update_old": [
        25
      ],
      "update_apply": [
        26,
        27
      ],
      "complete": [
        27
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "class SqrtDecomposition {\n    int[] arr, blocks;\n    int blockSize;\n\n    SqrtDecomposition(int[] input) {\n        arr = input.clone();\n        int n = arr.length;\n        blockSize = (int) Math.ceil(Math.sqrt(n));\n        blocks = new int[(int) Math.ceil((double) n / blockSize)];\n        for (int i = 0; i < n; i++)\n            blocks[i / blockSize] += arr[i];\n    }\n\n    int query(int l, int r) {\n        int total = 0;\n        int i = l;\n        while (i <= r) {\n            if (i % blockSize == 0 && i + blockSize - 1 <= r) {\n                total += blocks[i / blockSize];\n                i += blockSize;\n            } else {\n                total += arr[i];\n                i++;\n            }\n        }\n        return total;\n    }\n\n    void update(int idx, int val) {\n        int blockIdx = idx / blockSize;\n        blocks[blockIdx] += val - arr[idx];\n        arr[idx] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        5
      ],
      "init_blocks": [
        6,
        7,
        8,
        9
      ],
      "build_sum": [
        10,
        11
      ],
      "build_done": [
        9
      ],
      "query_start": [
        14,
        15,
        16
      ],
      "query_partial": [
        21,
        22,
        23
      ],
      "query_full_block": [
        18,
        19,
        20
      ],
      "query_done": [
        26
      ],
      "update_start": [
        29
      ],
      "update_old": [
        30
      ],
      "update_apply": [
        31,
        32
      ],
      "complete": [
        34
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "class SqrtDecomposition {\n    vector<int> arr, blocks;\n    int blockSize;\npublic:\n    SqrtDecomposition(vector<int>& input) {\n        arr = input;\n        int n = arr.size();\n        blockSize = ceil(sqrt(n));\n        blocks.assign((n + blockSize - 1) / blockSize, 0);\n        for (int i = 0; i < n; i++)\n            blocks[i / blockSize] += arr[i];\n    }\n\n    int query(int l, int r) {\n        int total = 0;\n        int i = l;\n        while (i <= r) {\n            if (i % blockSize == 0 && i + blockSize - 1 <= r) {\n                total += blocks[i / blockSize];\n                i += blockSize;\n            } else {\n                total += arr[i];\n                i++;\n            }\n        }\n        return total;\n    }\n\n    void update(int idx, int val) {\n        int blockIdx = idx / blockSize;\n        blocks[blockIdx] += val - arr[idx];\n        arr[idx] = val;\n    }\n};",
    "lineMap": {
      "-": [
        1,
        5
      ],
      "init_blocks": [
        6,
        7,
        8,
        9
      ],
      "build_sum": [
        10,
        11
      ],
      "build_done": [
        9
      ],
      "query_start": [
        14,
        15,
        16
      ],
      "query_partial": [
        21,
        22,
        23
      ],
      "query_full_block": [
        18,
        19,
        20
      ],
      "query_done": [
        26
      ],
      "update_start": [
        29
      ],
      "update_old": [
        30
      ],
      "update_apply": [
        31,
        32
      ],
      "complete": [
        34
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "class SqrtDecomposition {\n    int[] arr, blocks;\n    int blockSize;\n\n    public SqrtDecomposition(int[] input) {\n        arr = (int[])input.Clone();\n        int n = arr.Length;\n        blockSize = (int)Math.Ceiling(Math.Sqrt(n));\n        blocks = new int[(int)Math.Ceiling((double)n / blockSize)];\n        for (int i = 0; i < n; i++)\n            blocks[i / blockSize] += arr[i];\n    }\n\n    public int Query(int l, int r) {\n        int total = 0;\n        int i = l;\n        while (i <= r) {\n            if (i % blockSize == 0 && i + blockSize - 1 <= r) {\n                total += blocks[i / blockSize];\n                i += blockSize;\n            } else {\n                total += arr[i];\n                i++;\n            }\n        }\n        return total;\n    }\n\n    public void Update(int idx, int val) {\n        int blockIdx = idx / blockSize;\n        blocks[blockIdx] += val - arr[idx];\n        arr[idx] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        5
      ],
      "init_blocks": [
        6,
        7,
        8,
        9
      ],
      "build_sum": [
        10,
        11
      ],
      "build_done": [
        9
      ],
      "query_start": [
        14,
        15,
        16
      ],
      "query_partial": [
        21,
        22,
        23
      ],
      "query_full_block": [
        18,
        19,
        20
      ],
      "query_done": [
        26
      ],
      "update_start": [
        29
      ],
      "update_old": [
        30
      ],
      "update_apply": [
        31,
        32
      ],
      "complete": [
        34
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "type SqrtDecomposition struct {\n    arr       []int\n    blocks    []int\n    blockSize int\n}\n\nfunc NewSqrtDecomposition(input []int) *SqrtDecomposition {\n    n := len(input)\n    blockSize := int(math.Ceil(math.Sqrt(float64(n))))\n    numBlocks := int(math.Ceil(float64(n) / float64(blockSize)))\n    arr := make([]int, n)\n    copy(arr, input)\n    blocks := make([]int, numBlocks)\n    for i := 0; i < n; i++ {\n        blocks[i/blockSize] += arr[i]\n    }\n    return &SqrtDecomposition{arr, blocks, blockSize}\n}\n\nfunc (s *SqrtDecomposition) Query(l, r int) int {\n    total := 0\n    i := l\n    for i <= r {\n        if i%s.blockSize == 0 && i+s.blockSize-1 <= r {\n            total += s.blocks[i/s.blockSize]\n            i += s.blockSize\n        } else {\n            total += s.arr[i]\n            i++\n        }\n    }\n    return total\n}\n\nfunc (s *SqrtDecomposition) Update(idx, val int) {\n    blockIdx := idx / s.blockSize\n    s.blocks[blockIdx] += val - s.arr[idx]\n    s.arr[idx] = val\n}",
    "lineMap": {
      "-": [
        1,
        7
      ],
      "init_blocks": [
        8,
        9,
        10,
        11,
        12,
        13
      ],
      "build_sum": [
        14,
        15
      ],
      "build_done": [
        17
      ],
      "query_start": [
        20,
        21,
        22
      ],
      "query_partial": [
        27,
        28,
        29
      ],
      "query_full_block": [
        24,
        25,
        26
      ],
      "query_done": [
        32
      ],
      "update_start": [
        35
      ],
      "update_old": [
        36
      ],
      "update_apply": [
        37,
        38
      ],
      "complete": [
        39
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "class SqrtDecomposition {\n    constructor(arr) {\n        this.arr = [...arr];\n        this.n = arr.length;\n        this.blockSize = Math.ceil(Math.sqrt(this.n));\n        this.blocks = new Array(Math.ceil(this.n / this.blockSize)).fill(0);\n        for (let i = 0; i < this.n; i++)\n            this.blocks[Math.floor(i / this.blockSize)] += arr[i];\n    }\n\n    query(l, r) {\n        let total = 0;\n        let i = l;\n        while (i <= r) {\n            if (i % this.blockSize === 0 && i + this.blockSize - 1 <= r) {\n                total += this.blocks[Math.floor(i / this.blockSize)];\n                i += this.blockSize;\n            } else {\n                total += this.arr[i];\n                i++;\n            }\n        }\n        return total;\n    }\n\n    update(idx, val) {\n        const blockIdx = Math.floor(idx / this.blockSize);\n        this.blocks[blockIdx] += val - this.arr[idx];\n        this.arr[idx] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        2
      ],
      "init_blocks": [
        3,
        4,
        5,
        6
      ],
      "build_sum": [
        7,
        8
      ],
      "build_done": [
        6
      ],
      "query_start": [
        11,
        12,
        13
      ],
      "query_partial": [
        18,
        19,
        20
      ],
      "query_full_block": [
        15,
        16,
        17
      ],
      "query_done": [
        23
      ],
      "update_start": [
        26
      ],
      "update_old": [
        27
      ],
      "update_apply": [
        28,
        29
      ],
      "complete": [
        31
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "class SqrtDecomposition {\n    private arr: number[];\n    private blocks: number[];\n    private blockSize: number;\n\n    constructor(arr: number[]) {\n        this.arr = [...arr];\n        const n = arr.length;\n        this.blockSize = Math.ceil(Math.sqrt(n));\n        this.blocks = new Array(Math.ceil(n / this.blockSize)).fill(0);\n        for (let i = 0; i < n; i++)\n            this.blocks[Math.floor(i / this.blockSize)] += arr[i];\n    }\n\n    query(l: number, r: number): number {\n        let total = 0;\n        let i = l;\n        while (i <= r) {\n            if (i % this.blockSize === 0 && i + this.blockSize - 1 <= r) {\n                total += this.blocks[Math.floor(i / this.blockSize)];\n                i += this.blockSize;\n            } else {\n                total += this.arr[i];\n                i++;\n            }\n        }\n        return total;\n    }\n\n    update(idx: number, val: number): void {\n        const blockIdx = Math.floor(idx / this.blockSize);\n        this.blocks[blockIdx] += val - this.arr[idx];\n        this.arr[idx] = val;\n    }\n}",
    "lineMap": {
      "-": [
        1,
        6
      ],
      "init_blocks": [
        7,
        8,
        9,
        10
      ],
      "build_sum": [
        11,
        12
      ],
      "build_done": [
        10
      ],
      "query_start": [
        15,
        16,
        17
      ],
      "query_partial": [
        22,
        23,
        24
      ],
      "query_full_block": [
        19,
        20,
        21
      ],
      "query_done": [
        27
      ],
      "update_start": [
        30
      ],
      "update_old": [
        31
      ],
      "update_apply": [
        32,
        33
      ],
      "complete": [
        35
      ]
    }
  }
};

const SqrtDecompositionPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Standard (9 elements)",
    "value": {
      "arr": [
        1,
        5,
        2,
        4,
        6,
        1,
        3,
        5,
        7
      ],
      "queryL": 2,
      "queryR": 7,
      "updateIdx": 4,
      "updateVal": 10
    }
  },
  {
    "id": "ex2",
    "label": "Small (6 elements)",
    "value": {
      "arr": [
        3,
        7,
        2,
        5,
        8,
        1
      ],
      "queryL": 1,
      "queryR": 4,
      "updateIdx": 2,
      "updateVal": 9
    }
  },
  {
    "id": "ex3",
    "label": "Large (16 elements)",
    "value": {
      "arr": [
        10,
        20,
        30,
        40,
        50,
        60,
        70,
        80,
        90,
        10,
        20,
        30,
        40,
        50,
        60,
        70
      ],
      "queryL": 3,
      "queryR": 13,
      "updateIdx": 7,
      "updateVal": 5
    }
  },
  {
    "id": "ex4",
    "label": "Full range query",
    "value": {
      "arr": [
        4,
        8,
        6,
        2,
        9,
        3,
        1,
        7,
        5
      ],
      "queryL": 0,
      "queryR": 8,
      "updateIdx": 0,
      "updateVal": 50
    }
  }
];

function generateSqrtDecompositionSteps(__inputArg: any): any[] {
  
  return (function(e: any) {
let t=[...e.arr],l=e.queryL,r=e.queryR,a=e.updateIdx,o=e.updateVal,s=t.length,n=Math.ceil(Math.sqrt(s)),u=Math.ceil(s/n),d=Array(u).fill(0),c={};for(let e=0;e<s;e++)c[`bar_${e}`]={type:"arrayElement",value:t[e],position:e};let p=new StepRecorder({},c);p.record("-",`Start: Sqrt Decomposition on array of size ${s}. Block size = ceil(sqrt(${s})) = ${n}`);for(let e=0;e<u;e++)p.add_new_visual(`block_${e}`,{type:"stateElement",value:0,index:e,label:`B${e}`});for(let e=0;e<u;e++){let t=e*n,l=Math.min(t+n-1,s-1);p.add_new_visual(`range_block_${e}`,{type:"range",start:t,end:l,label:`Block ${e}`,state:"default"})}p.record("init_blocks",`Initialize ${u} blocks, each covering up to ${n} elements`);for(let e=0;e<s;e++){let l=Math.floor(e/n);d[l]+=t[e],p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"}),p.update_visual(`block_${l}`,{type:"stateElement",value:d[l],index:l,label:`B${l}`,state:"active"}),p.record("build_sum",`Add arr[${e}] = ${t[e]} to Block ${l}. Block sum = ${d[l]}`),p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"complete"}),p.update_visual(`block_${l}`,{type:"stateElement",value:d[l],index:l,label:`B${l}`})}for(let e=0;e<s;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e});p.record("build_done",`Block structure built. Block sums: [${d.join(", ")}]`),p.add_new_visual("ptr_L",{type:"pointer",position:l,label:"L"}),p.add_new_visual("ptr_R",{type:"pointer",position:r,label:"R"}),p.record("query_start",`Range sum query: sum(arr[${l}..${r}])`);let h=0,b=l,m=Math.min((Math.floor(l/n)+1)*n-1,r);if(l%n!=0)for(;b<=m&&b<=r;)p.update_visual(`bar_${b}`,{type:"arrayElement",value:t[b],position:b,state:"highlight"}),h+=t[b],p.add_new_visual("meta_sum",{type:"metadata",value:h}),p.record("query_partial",`Left partial: add arr[${b}] = ${t[b]}. Running sum = ${h}`),p.update_visual(`bar_${b}`,{type:"arrayElement",value:t[b],position:b,state:"active"}),b++;for(;b+n-1<=r;){let e=Math.floor(b/n),l=b,i=b+n-1;for(let e=l;e<=i;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"highlight"});p.update_visual(`block_${e}`,{type:"stateElement",value:d[e],index:e,label:`B${e}`,state:"highlight"}),h+=d[e],p.update_visual("meta_sum",{type:"metadata",value:h}),p.record("query_full_block",`Full block ${e}: add block sum ${d[e]}. Running sum = ${h}`);for(let e=l;e<=i;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});p.update_visual(`block_${e}`,{type:"stateElement",value:d[e],index:e,label:`B${e}`}),b+=n}for(;b<=r;)p.update_visual(`bar_${b}`,{type:"arrayElement",value:t[b],position:b,state:"highlight"}),h+=t[b],p.update_visual("meta_sum",{type:"metadata",value:h}),p.record("query_partial",`Right partial: add arr[${b}] = ${t[b]}. Running sum = ${h}`),p.update_visual(`bar_${b}`,{type:"arrayElement",value:t[b],position:b,state:"active"}),b++;for(let e=l;e<=r;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e,state:"active"});p.record("query_done",`Query complete: sum(arr[${l}..${r}]) = ${h}`);for(let e=0;e<s;e++)p.update_visual(`bar_${e}`,{type:"arrayElement",value:t[e],position:e});p.delete_visual("ptr_L"),p.delete_visual("ptr_R"),p.delete_visual("meta_sum");let x=t[a],f=Math.floor(a/n);p.add_new_visual("ptr_update",{type:"pointer",position:a,label:"idx"}),p.record("update_start",`Point update: set arr[${a}] from ${x} to ${o}`),p.update_visual(`bar_${a}`,{type:"arrayElement",value:x,position:a,state:"highlight"}),p.update_visual(`block_${f}`,{type:"stateElement",value:d[f],index:f,label:`B${f}`,state:"highlight"}),p.record("update_old",`Current: arr[${a}] = ${x}, Block ${f} sum = ${d[f]}`);let y=o-x;return d[f]+=y,t[a]=o,p.update_visual(`bar_${a}`,{type:"arrayElement",value:o,position:a,state:"active"}),p.update_visual(`block_${f}`,{type:"stateElement",value:d[f],index:f,label:`B${f}`,state:"active"}),p.record("update_apply",`Updated: arr[${a}] = ${o}, Block ${f} sum = ${d[f]} (diff = ${y>=0?"+":""}${y})`),p.update_visual(`bar_${a}`,{type:"arrayElement",value:o,position:a}),p.update_visual(`block_${f}`,{type:"stateElement",value:d[f],index:f,label:`B${f}`}),p.delete_visual("ptr_update"),p.record("complete",`Done! Block sums: [${d.join(", ")}]. Array updated successfully.`),p.getSteps()
  })(__inputArg);
}

export function SqrtDecompositionProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SqrtDecompositionTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSqrtDecompositionSteps(e) as any[];
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
      title="Sqrt Decomposition"
      slug="sqrt-decomposition"
      approaches={approaches}
      presets={SqrtDecompositionPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
