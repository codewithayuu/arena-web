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
    if (item.type === "arrayElement" || item.type === "element" || item.type === "char" || item.type === "stateElement" || item.type === "cell") {
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
// Spiral Matrix (spiral-matrix)
// ==========================================

const SpiralMatrixTemplates = {
  "python": {
    "language": "python",
    "code": "def spiralOrder(matrix):\n    result = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n\n    while top <= bottom and left <= right:\n        # Traverse top row\n        for col in range(left, right + 1):\n            result.append(matrix[top][col])\n        top += 1\n\n        # Traverse right column\n        for row in range(top, bottom + 1):\n            result.append(matrix[row][right])\n        right -= 1\n\n        # Traverse bottom row (if rows remain)\n        if top <= bottom:\n            for col in range(right, left - 1, -1):\n                result.append(matrix[bottom][col])\n            bottom -= 1\n\n        # Traverse left column (if columns remain)\n        if left <= right:\n            for row in range(bottom, top - 1, -1):\n                result.append(matrix[row][left])\n            left += 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        10
      ],
      "add_down": [
        14
      ],
      "decrement_right": [
        15
      ],
      "add_left": [
        20
      ],
      "decrement_bottom": [
        21
      ],
      "add_up": [
        26
      ],
      "increment_left": [
        27
      ],
      "complete": [
        29
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        13
      ],
      "has_bottom_row": [
        18
      ],
      "traverse_left": [
        19
      ],
      "has_left_column": [
        24
      ],
      "traverse_up": [
        25
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<Integer> spiralOrder(int[][] matrix) {\n    List<Integer> result = new ArrayList<>();\n    int top = 0, bottom = matrix.length - 1;\n    int left = 0, right = matrix[0].length - 1;\n\n    while (top <= bottom && left <= right) {\n        // Traverse top row\n        for (int col = left; col <= right; col++) {\n            result.add(matrix[top][col]);\n        }\n        top++;\n\n        // Traverse right column\n        for (int row = top; row <= bottom; row++) {\n            result.add(matrix[row][right]);\n        }\n        right--;\n\n        // Traverse bottom row (if rows remain)\n        if (top <= bottom) {\n            for (int col = right; col >= left; col--) {\n                result.add(matrix[bottom][col]);\n            }\n            bottom--;\n        }\n\n        // Traverse left column (if columns remain)\n        if (left <= right) {\n            for (int row = bottom; row >= top; row--) {\n                result.add(matrix[row][left]);\n            }\n            left++;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    vector<int> result;\n    int top = 0, bottom = matrix.size() - 1;\n    int left = 0, right = matrix[0].size() - 1;\n\n    while (top <= bottom && left <= right) {\n        // Traverse top row\n        for (int col = left; col <= right; col++) {\n            result.push_back(matrix[top][col]);\n        }\n        top++;\n\n        // Traverse right column\n        for (int row = top; row <= bottom; row++) {\n            result.push_back(matrix[row][right]);\n        }\n        right--;\n\n        // Traverse bottom row (if rows remain)\n        if (top <= bottom) {\n            for (int col = right; col >= left; col--) {\n                result.push_back(matrix[bottom][col]);\n            }\n            bottom--;\n        }\n\n        // Traverse left column (if columns remain)\n        if (left <= right) {\n            for (int row = bottom; row >= top; row--) {\n                result.push_back(matrix[row][left]);\n            }\n            left++;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<int> SpiralOrder(int[][] matrix) {\n    List<int> result = new List<int>();\n    int top = 0, bottom = matrix.Length - 1;\n    int left = 0, right = matrix[0].Length - 1;\n\n    while (top <= bottom && left <= right) {\n        // Traverse top row\n        for (int col = left; col <= right; col++) {\n            result.Add(matrix[top][col]);\n        }\n        top++;\n\n        // Traverse right column\n        for (int row = top; row <= bottom; row++) {\n            result.Add(matrix[row][right]);\n        }\n        right--;\n\n        // Traverse bottom row (if rows remain)\n        if (top <= bottom) {\n            for (int col = right; col >= left; col--) {\n                result.Add(matrix[bottom][col]);\n            }\n            bottom--;\n        }\n\n        // Traverse left column (if columns remain)\n        if (left <= right) {\n            for (int row = bottom; row >= top; row--) {\n                result.Add(matrix[row][left]);\n            }\n            left++;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func spiralOrder(matrix [][]int) []int {\n    result := []int{}\n    top, bottom := 0, len(matrix)-1\n    left, right := 0, len(matrix[0])-1\n\n    for top <= bottom && left <= right {\n        // Traverse top row\n        for col := left; col <= right; col++ {\n            result = append(result, matrix[top][col])\n        }\n        top++\n\n        // Traverse right column\n        for row := top; row <= bottom; row++ {\n            result = append(result, matrix[row][right])\n        }\n        right--\n\n        // Traverse bottom row (if rows remain)\n        if top <= bottom {\n            for col := right; col >= left; col-- {\n                result = append(result, matrix[bottom][col])\n            }\n            bottom--\n        }\n\n        // Traverse left column (if columns remain)\n        if left <= right {\n            for row := bottom; row >= top; row-- {\n                result = append(result, matrix[row][left])\n            }\n            left++\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function spiralOrder(matrix) {\n    const result = [];\n    let top = 0, bottom = matrix.length - 1;\n    let left = 0, right = matrix[0].length - 1;\n\n    while (top <= bottom && left <= right) {\n        // Traverse top row\n        for (let col = left; col <= right; col++) {\n            result.push(matrix[top][col]);\n        }\n        top++;\n\n        // Traverse right column\n        for (let row = top; row <= bottom; row++) {\n            result.push(matrix[row][right]);\n        }\n        right--;\n\n        // Traverse bottom row (if rows remain)\n        if (top <= bottom) {\n            for (let col = right; col >= left; col--) {\n                result.push(matrix[bottom][col]);\n            }\n            bottom--;\n        }\n\n        // Traverse left column (if columns remain)\n        if (left <= right) {\n            for (let row = bottom; row >= top; row--) {\n                result.push(matrix[row][left]);\n            }\n            left++;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function spiralOrder(matrix: number[][]): number[] {\n    const result: number[] = [];\n    let top = 0, bottom = matrix.length - 1;\n    let left = 0, right = matrix[0].length - 1;\n\n    while (top <= bottom && left <= right) {\n        // Traverse top row\n        for (let col = left; col <= right; col++) {\n            result.push(matrix[top][col]);\n        }\n        top++;\n\n        // Traverse right column\n        for (let row = top; row <= bottom; row++) {\n            result.push(matrix[row][right]);\n        }\n        right--;\n\n        // Traverse bottom row (if rows remain)\n        if (top <= bottom) {\n            for (let col = right; col >= left; col--) {\n                result.push(matrix[bottom][col]);\n            }\n            bottom--;\n        }\n\n        // Traverse left column (if columns remain)\n        if (left <= right) {\n            for (let row = bottom; row >= top; row--) {\n                result.push(matrix[row][left]);\n            }\n            left++;\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "initialize_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "add_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "add_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "add_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "add_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "has_bottom_row": [
        20
      ],
      "traverse_left": [
        21
      ],
      "has_left_column": [
        28
      ],
      "traverse_up": [
        29
      ]
    }
  }
};

const SpiralMatrixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3×3 Matrix",
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
      ]
    }
  },
  {
    "id": "ex2",
    "label": "3×4 Matrix",
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
      ]
    }
  },
  {
    "id": "ex3",
    "label": "2×2 Matrix",
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
      ]
    }
  },
  {
    "id": "ex4",
    "label": "4×5 Matrix",
    "value": {
      "matrix": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        [
          6,
          7,
          8,
          9,
          10
        ],
        [
          11,
          12,
          13,
          14,
          15
        ],
        [
          16,
          17,
          18,
          19,
          20
        ]
      ]
    }
  },
  {
    "id": "ex5",
    "label": "Single Row",
    "value": {
      "matrix": [
        [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      ]
    }
  },
  {
    "id": "ex6",
    "label": "Single Column",
    "value": {
      "matrix": [
        [
          1
        ],
        [
          2
        ],
        [
          3
        ],
        [
          4
        ]
      ]
    }
  }
];

function generateSpiralMatrixSteps(t: any): any[] {
  let e=t.matrix.map(t=>[...t]);if(0===e.length)return[];let r=e.length,o=e[0].length,l={};for(let t=0;t<r;t++)for(let r=0;r<o;r++)l[`cell_${t}_${r}`]={type:"matrixElement",value:e[t][r],row:t,col:r};let a=[],n=0,s=r-1,d=0,c=o-1,u=new StepRecorder({matrix:e},{...l});u.record("-","Start: Traverse matrix in spiral order"),u.update_variable("result",[...a]),u.update_variable("top",n),u.update_variable("bottom",s),u.update_variable("left",d),u.update_variable("right",c),u.add_new_visual("boundary_top",{type:"2DPointer",label:"top",row:n,col:-1}),u.add_new_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:s,col:-1}),u.add_new_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:0}),u.add_new_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:o-1}),u.record("initialize_bounds",`Initialize boundaries: top=${n}, bottom=${s}, left=${d}, right=${c}`);let m=null,p=(t,r,i,o)=>{if(m){let[t,r]=m;u.update_visual(`cell_${t}_${r}`,{type:"matrixElement",value:e[t][r],row:t,col:r,state:"visited"})}let l=a.length;l>0&&u.update_visual(`res_${l-1}`,{type:"arrayElement",value:a[l-1],position:l-1,state:"visited"}),a.push(e[t][r]),u.update_variable("result",[...a]),u.update_variable("row",t),u.update_variable("col",r),u.update_visual(`cell_${t}_${r}`,{type:"matrixElement",value:e[t][r],row:t,col:r,state:"active"}),u.add_new_visual(`res_${l}`,{type:"arrayElement",value:e[t][r],position:l,state:"active"}),m=[t,r],u.record(i,`Traverse ${o}: Add matrix[${t}][${r}] = ${e[t][r]} to result`)},h=()=>{if(m){let[t,r]=m;u.update_visual(`cell_${t}_${r}`,{type:"matrixElement",value:e[t][r],row:t,col:r,state:"visited"}),m=null}a.length>0&&u.update_visual(`res_${a.length-1}`,{type:"arrayElement",value:a[a.length-1],position:a.length-1,state:"visited"})};for(;n<=s&&d<=c;){u.add_conditional("while_loop",!0),u.record("loop_start",`Check boundaries: top(${n}) <= bottom(${s}) && left(${d}) <= right(${c})`),u.update_variable("dir","right");for(let t=d;t<=c;t++)u.add_conditional("traverse_right",!0),p(n,t,"add_right","right");u.add_conditional("traverse_right",!1),n++,h(),u.update_variable("top",n),u.update_visual("boundary_top",{type:"2DPointer",label:"top",row:n,col:-1}),u.record("increment_top",`Move top boundary down: top = ${n}`),u.update_variable("dir","down");for(let t=n;t<=s;t++)u.add_conditional("traverse_down",!0),p(t,c,"add_down","down");if(u.add_conditional("traverse_down",!1),c--,h(),u.update_variable("right",c),u.update_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:c}),u.record("decrement_right",`Move right boundary left: right = ${c}`),n<=s){u.add_conditional("has_bottom_row",!0),u.update_variable("dir","left");for(let t=c;t>=d;t--)u.add_conditional("traverse_left",!0),p(s,t,"add_left","left");u.add_conditional("traverse_left",!1),s--,h(),u.update_variable("bottom",s),u.update_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:s,col:-1}),u.record("decrement_bottom",`Move bottom boundary up: bottom = ${s}`)}else u.add_conditional("has_bottom_row",!1);if(d<=c){u.add_conditional("has_left_column",!0),u.update_variable("dir","up");for(let t=s;t>=n;t--)u.add_conditional("traverse_up",!0),p(t,d,"add_up","up");u.add_conditional("traverse_up",!1),d++,h(),u.update_variable("left",d),u.update_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:d}),u.record("increment_left",`Move left boundary right: left = ${d}`)}else u.add_conditional("has_left_column",!1)}u.add_conditional("while_loop",!1),u.delete_variable("dir"),u.delete_visual("boundary_top"),u.delete_visual("boundary_bottom"),u.delete_visual("boundary_left"),u.delete_visual("boundary_right");for(let t=0;t<r;t++)for(let r=0;r<o;r++)u.update_visual(`cell_${t}_${r}`,{type:"matrixElement",value:e[t][r],row:t,col:r,state:"found"});for(let t=0;t<a.length;t++)u.update_visual(`res_${t}`,{type:"arrayElement",value:a[t],position:t,state:"found"});return u.record("complete",`Spiral traversal complete: [${a.join(", ")}]`),u.getSteps()
}

export function SpiralMatrixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SpiralMatrixTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSpiralMatrixSteps(t) as any[];
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
      title="Spiral Matrix"
      slug="spiral-matrix"
      approaches={approaches}
      presets={SpiralMatrixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Rotate Image (rotate-image)
// ==========================================

const RotateImageTemplates = {
  "python": {
    "language": "python",
    "code": "def rotate(matrix):\n    n = len(matrix)\n\n    # Step 1: Transpose the matrix\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n\n    # Step 2: Reverse each row\n    for i in range(n):\n        matrix[i].reverse()",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7
      ],
      "transpose_done": [
        7
      ],
      "transpose_complete": [
        7
      ],
      "reverse_start": [
        10
      ],
      "reverse_row_start": [
        11
      ],
      "reverse_swap": [
        11
      ],
      "reverse_done": [
        11
      ],
      "move_pointers": [
        11
      ],
      "reverse_row_complete": [
        11
      ],
      "complete": [
        11
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        10
      ],
      "reverse_while_loop": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void rotate(int[][] matrix) {\n    int n = matrix.length;\n\n    // Step 1: Transpose the matrix\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            int temp = matrix[i][j];\n            matrix[i][j] = matrix[j][i];\n            matrix[j][i] = temp;\n        }\n    }\n\n    // Step 2: Reverse each row\n    for (int i = 0; i < n; i++) {\n        int left = 0, right = n - 1;\n        while (left < right) {\n            int temp = matrix[i][left];\n            matrix[i][left] = matrix[i][right];\n            matrix[i][right] = temp;\n            left++;\n            right--;\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7,
        8,
        9
      ],
      "transpose_done": [
        9
      ],
      "transpose_complete": [
        11
      ],
      "reverse_start": [
        14
      ],
      "reverse_row_start": [
        15
      ],
      "reverse_swap": [
        17,
        18,
        19
      ],
      "reverse_done": [
        19
      ],
      "move_pointers": [
        20,
        21
      ],
      "reverse_row_complete": [
        22
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        14
      ],
      "reverse_while_loop": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void rotate(vector<vector<int>>& matrix) {\n    int n = matrix.size();\n\n    // Step 1: Transpose the matrix\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            swap(matrix[i][j], matrix[j][i]);\n        }\n    }\n\n    // Step 2: Reverse each row\n    for (int i = 0; i < n; i++) {\n        reverse(matrix[i].begin(), matrix[i].end());\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7
      ],
      "transpose_done": [
        7
      ],
      "transpose_complete": [
        9
      ],
      "reverse_start": [
        12
      ],
      "reverse_row_start": [
        13
      ],
      "reverse_swap": [
        13
      ],
      "reverse_done": [
        13
      ],
      "move_pointers": [
        13
      ],
      "reverse_row_complete": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        12
      ],
      "reverse_while_loop": [
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void Rotate(int[][] matrix) {\n    int n = matrix.Length;\n\n    // Step 1: Transpose the matrix\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            int temp = matrix[i][j];\n            matrix[i][j] = matrix[j][i];\n            matrix[j][i] = temp;\n        }\n    }\n\n    // Step 2: Reverse each row\n    for (int i = 0; i < n; i++) {\n        Array.Reverse(matrix[i]);\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7,
        8,
        9
      ],
      "transpose_done": [
        9
      ],
      "transpose_complete": [
        11
      ],
      "reverse_start": [
        14
      ],
      "reverse_row_start": [
        15
      ],
      "reverse_swap": [
        15
      ],
      "reverse_done": [
        15
      ],
      "move_pointers": [
        15
      ],
      "reverse_row_complete": [
        15
      ],
      "complete": [
        17
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        14
      ],
      "reverse_while_loop": [
        15
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rotate(matrix [][]int) {\n    n := len(matrix)\n\n    // Step 1: Transpose the matrix\n    for i := 0; i < n; i++ {\n        for j := i + 1; j < n; j++ {\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n        }\n    }\n\n    // Step 2: Reverse each row\n    for i := 0; i < n; i++ {\n        left, right := 0, n-1\n        for left < right {\n            matrix[i][left], matrix[i][right] = matrix[i][right], matrix[i][left]\n            left++\n            right--\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7
      ],
      "transpose_done": [
        7
      ],
      "transpose_complete": [
        9
      ],
      "reverse_start": [
        12
      ],
      "reverse_row_start": [
        13
      ],
      "reverse_swap": [
        15
      ],
      "reverse_done": [
        15
      ],
      "move_pointers": [
        16,
        17
      ],
      "reverse_row_complete": [
        18
      ],
      "complete": [
        20
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        12
      ],
      "reverse_while_loop": [
        14
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function rotate(matrix) {\n    const n = matrix.length;\n\n    // Step 1: Transpose the matrix\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n    }\n\n    // Step 2: Reverse each row\n    for (let i = 0; i < n; i++) {\n        matrix[i].reverse();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7
      ],
      "transpose_done": [
        7
      ],
      "transpose_complete": [
        9
      ],
      "reverse_start": [
        12
      ],
      "reverse_row_start": [
        13
      ],
      "reverse_swap": [
        13
      ],
      "reverse_done": [
        13
      ],
      "move_pointers": [
        13
      ],
      "reverse_row_complete": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        12
      ],
      "reverse_while_loop": [
        13
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rotate(matrix: number[][]): void {\n    const n = matrix.length;\n\n    // Step 1: Transpose the matrix\n    for (let i = 0; i < n; i++) {\n        for (let j = i + 1; j < n; j++) {\n            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n        }\n    }\n\n    // Step 2: Reverse each row\n    for (let i = 0; i < n; i++) {\n        matrix[i].reverse();\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "transpose_start": [
        5
      ],
      "transpose_swap": [
        7
      ],
      "transpose_done": [
        7
      ],
      "transpose_complete": [
        9
      ],
      "reverse_start": [
        12
      ],
      "reverse_row_start": [
        13
      ],
      "reverse_swap": [
        13
      ],
      "reverse_done": [
        13
      ],
      "move_pointers": [
        13
      ],
      "reverse_row_complete": [
        13
      ],
      "complete": [
        15
      ]
    },
    "conditionalMap": {
      "outer_loop_transpose": [
        5
      ],
      "inner_loop_transpose": [
        6
      ],
      "reverse_row_loop": [
        12
      ],
      "reverse_while_loop": [
        13
      ]
    }
  }
};

const RotateImagePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
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
      ]
    }
  },
  {
    "id": "ex2",
    "label": "4x4 Matrix",
    "value": {
      "matrix": [
        [
          5,
          1,
          9,
          11
        ],
        [
          2,
          4,
          8,
          10
        ],
        [
          13,
          3,
          6,
          7
        ],
        [
          15,
          14,
          12,
          16
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "2x2 Matrix",
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
      ]
    }
  },
  {
    "id": "ex4",
    "label": "5x5 Matrix",
    "value": {
      "matrix": [
        [
          1,
          2,
          3,
          4,
          5
        ],
        [
          6,
          7,
          8,
          9,
          10
        ],
        [
          11,
          12,
          13,
          14,
          15
        ],
        [
          16,
          17,
          18,
          19,
          20
        ],
        [
          21,
          22,
          23,
          24,
          25
        ]
      ]
    }
  }
];

function generateRotateImageSteps(t: any): any[] {
  let e=t.matrix.map(t=>[...t]),r=e.length;if(0===r)return[];let o={};for(let t=0;t<r;t++)for(let i=0;i<r;i++)o[`cell_${t}_${i}`]={type:"matrixElement",value:e[t][i],row:t,col:i};let a=new StepRecorder({matrix:e.map(t=>[...t])},{...o});a.update_variable("n",r),a.record("-","Start: Rotate image 90 degrees clockwise using transpose then reverse approach"),a.record("transpose_start","Step 1: Transpose the matrix (swap rows and columns)");for(let t=0;t<r;t++){a.update_variable("i",t),a.add_conditional("outer_loop_transpose",!0),a.update_visual("pointer_i",{type:"2DPointer",label:"i",row:t,col:-1});for(let i=t+1;i<r;i++){a.update_variable("j",i),a.add_conditional("inner_loop_transpose",!0),a.update_visual("pointer_j",{type:"2DPointer",label:"j",row:-1,col:i}),a.update_visual("cell_pointer_1",{type:"2DPointer",label:"[i][j]",row:t,col:i}),a.update_visual("cell_pointer_2",{type:"2DPointer",label:"[j][i]",row:i,col:t}),a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"active"}),a.update_visual(`cell_${i}_${t}`,{type:"matrixElement",value:e[i][t],row:i,col:t,state:"active"}),a.record("transpose_swap",`Transpose: Swap matrix[${t}][${i}]=${e[t][i]} with matrix[${i}][${t}]=${e[i][t]}`);let r=e[t][i];e[t][i]=e[i][t],e[i][t]=r,a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"visited",animating:!0}),a.update_visual(`cell_${i}_${t}`,{type:"matrixElement",value:e[i][t],row:i,col:t,state:"visited",animating:!0}),a.update_variable("matrix",e.map(t=>[...t])),a.record("transpose_done",`After swap: matrix[${t}][${i}]=${e[t][i]}, matrix[${i}][${t}]=${e[i][t]}`),a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i}),a.update_visual(`cell_${i}_${t}`,{type:"matrixElement",value:e[i][t],row:i,col:t}),a.delete_visual("cell_pointer_1"),a.delete_visual("cell_pointer_2")}a.add_conditional("inner_loop_transpose",!1),a.delete_visual("pointer_j")}a.add_conditional("outer_loop_transpose",!1),a.delete_visual("pointer_i"),a.record("transpose_complete","Transpose complete. Matrix rows are now columns."),a.record("reverse_start","Step 2: Reverse each row to complete the 90-degree rotation");for(let t=0;t<r;t++){a.update_variable("i",t),a.add_conditional("reverse_row_loop",!0),a.update_visual("pointer_i",{type:"2DPointer",label:"i",row:t,col:-1});let i=0,o=r-1;a.update_variable("left",i),a.update_variable("right",o);for(let i=0;i<r;i++)a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"active"});a.update_visual("pointer_left",{type:"2DPointer",label:"left",row:-1,col:i}),a.update_visual("pointer_right",{type:"2DPointer",label:"right",row:-1,col:o}),a.record("reverse_row_start",`Reversing row ${t}: [${e[t].join(", ")}]`);for(let i=0;i<r;i++)a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i});for(;i<o;){a.add_conditional("reverse_while_loop",!0),a.update_variable("left",i),a.update_variable("right",o),a.update_visual("pointer_left",{type:"2DPointer",label:"left",row:-1,col:i}),a.update_visual("pointer_right",{type:"2DPointer",label:"right",row:-1,col:o}),a.update_visual("cell_pointer_1",{type:"2DPointer",label:"left",row:t,col:i}),a.update_visual("cell_pointer_2",{type:"2DPointer",label:"right",row:t,col:o}),a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"active"}),a.update_visual(`cell_${t}_${o}`,{type:"matrixElement",value:e[t][o],row:t,col:o,state:"active"}),a.record("reverse_swap",`Reverse row ${t}: Swap matrix[${t}][${i}]=${e[t][i]} with matrix[${t}][${o}]=${e[t][o]}`);let r=e[t][i];e[t][i]=e[t][o],e[t][o]=r,a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"visited",animating:!0}),a.update_visual(`cell_${t}_${o}`,{type:"matrixElement",value:e[t][o],row:t,col:o,state:"visited",animating:!0}),a.update_variable("matrix",e.map(t=>[...t])),a.record("reverse_done",`After swap: matrix[${t}][${i}]=${e[t][i]}, matrix[${t}][${o}]=${e[t][o]}`),a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i}),a.update_visual(`cell_${t}_${o}`,{type:"matrixElement",value:e[t][o],row:t,col:o}),a.delete_visual("cell_pointer_1"),a.delete_visual("cell_pointer_2"),i++,o--,a.update_variable("left",i),a.update_variable("right",o),a.update_visual("pointer_left",{type:"2DPointer",label:"left",row:-1,col:i}),a.update_visual("pointer_right",{type:"2DPointer",label:"right",row:-1,col:o}),a.record("move_pointers",`Move pointers: left++ = ${i}, right-- = ${o}`)}a.add_conditional("reverse_while_loop",!1),a.delete_visual("pointer_left"),a.delete_visual("pointer_right"),a.record("reverse_row_complete",`Row ${t} reversed: [${e[t].join(", ")}]`)}a.add_conditional("reverse_row_loop",!1),a.delete_visual("pointer_i");for(let t=0;t<r;t++)for(let i=0;i<r;i++)a.update_visual(`cell_${t}_${i}`,{type:"matrixElement",value:e[t][i],row:t,col:i,state:"found"});return a.update_variable("matrix",e.map(t=>[...t])),a.delete_variable("i"),a.delete_variable("j"),a.delete_variable("left"),a.delete_variable("right"),a.record("complete","Rotation complete! Matrix rotated 90 degrees clockwise."),a.getSteps()
}

export function RotateImageProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: RotateImageTemplates,
      generateSteps: (t: any) => {
        const recorded = generateRotateImageSteps(t) as any[];
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
      title="Rotate Image"
      slug="rotate-image"
      approaches={approaches}
      presets={RotateImagePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Set Matrix Zeroes (set-matrix-zeroes)
// ==========================================

const SetMatrixZeroesTemplates = {
  "python": {
    "language": "python",
    "code": "def setZeroes(matrix):\n    m, n = len(matrix), len(matrix[0])\n    first_col = False\n    # Phase 1: use first row and first column as markers\n    for i in range(m):\n        if matrix[i][0] == 0:\n            first_col = True\n        for j in range(1, n):\n            if matrix[i][j] == 0:\n                matrix[i][0] = 0\n                matrix[0][j] = 0\n    # Phase 2: zero inner cells based on markers\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][0] == 0 or matrix[0][j] == 0:\n                matrix[i][j] = 0\n    # Phase 3: handle first row\n    if matrix[0][0] == 0:\n        for j in range(n):\n            matrix[0][j] = 0\n    # Phase 4: handle first column\n    if first_col:\n        for i in range(m):\n            matrix[i][0] = 0",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6,
        7
      ],
      "found_zero": [
        9
      ],
      "marked": [
        10,
        11
      ],
      "zero_start": [
        13
      ],
      "check_marker": [
        15
      ],
      "set_zero": [
        16
      ],
      "zero_first_row_start": [
        18
      ],
      "zero_first_row": [
        19,
        20
      ],
      "zero_first_col_start": [
        22
      ],
      "zero_first_col": [
        23,
        24
      ],
      "complete": [
        24
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        8
      ],
      "zero_outer": [
        13
      ],
      "zero_inner": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void setZeroes(int[][] matrix) {\n    int m = matrix.length, n = matrix[0].length;\n    boolean firstCol = false;\n    // Phase 1: use first row and first column as markers\n    for (int i = 0; i < m; i++) {\n        if (matrix[i][0] == 0) firstCol = true;\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][j] == 0) {\n                matrix[i][0] = 0;\n                matrix[0][j] = 0;\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) {\n                matrix[i][j] = 0;\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if (matrix[0][0] == 0) {\n        for (int j = 0; j < n; j++) matrix[0][j] = 0;\n    }\n    // Phase 4: handle first column\n    if (firstCol) {\n        for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6
      ],
      "found_zero": [
        8
      ],
      "marked": [
        9,
        10
      ],
      "zero_start": [
        15
      ],
      "check_marker": [
        17
      ],
      "set_zero": [
        18
      ],
      "zero_first_row_start": [
        23
      ],
      "zero_first_row": [
        24
      ],
      "zero_first_col_start": [
        27
      ],
      "zero_first_col": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        7
      ],
      "zero_outer": [
        15
      ],
      "zero_inner": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void setZeroes(vector<vector<int>>& matrix) {\n    int m = matrix.size(), n = matrix[0].size();\n    bool firstCol = false;\n    // Phase 1: use first row and first column as markers\n    for (int i = 0; i < m; i++) {\n        if (matrix[i][0] == 0) firstCol = true;\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][j] == 0) {\n                matrix[i][0] = 0;\n                matrix[0][j] = 0;\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) {\n                matrix[i][j] = 0;\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if (matrix[0][0] == 0) {\n        for (int j = 0; j < n; j++) matrix[0][j] = 0;\n    }\n    // Phase 4: handle first column\n    if (firstCol) {\n        for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6
      ],
      "found_zero": [
        8
      ],
      "marked": [
        9,
        10
      ],
      "zero_start": [
        15
      ],
      "check_marker": [
        17
      ],
      "set_zero": [
        18
      ],
      "zero_first_row_start": [
        23
      ],
      "zero_first_row": [
        24
      ],
      "zero_first_col_start": [
        27
      ],
      "zero_first_col": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        7
      ],
      "zero_outer": [
        15
      ],
      "zero_inner": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func setZeroes(matrix [][]int) {\n    m, n := len(matrix), len(matrix[0])\n    firstCol := false\n    // Phase 1: use first row and first column as markers\n    for i := 0; i < m; i++ {\n        if matrix[i][0] == 0 {\n            firstCol = true\n        }\n        for j := 1; j < n; j++ {\n            if matrix[i][j] == 0 {\n                matrix[i][0] = 0\n                matrix[0][j] = 0\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for i := 1; i < m; i++ {\n        for j := 1; j < n; j++ {\n            if matrix[i][0] == 0 || matrix[0][j] == 0 {\n                matrix[i][j] = 0\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if matrix[0][0] == 0 {\n        for j := 0; j < n; j++ {\n            matrix[0][j] = 0\n        }\n    }\n    // Phase 4: handle first column\n    if firstCol {\n        for i := 0; i < m; i++ {\n            matrix[i][0] = 0\n        }\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6,
        7
      ],
      "found_zero": [
        10
      ],
      "marked": [
        11,
        12
      ],
      "zero_start": [
        17
      ],
      "check_marker": [
        19
      ],
      "set_zero": [
        20
      ],
      "zero_first_row_start": [
        25
      ],
      "zero_first_row": [
        26,
        27
      ],
      "zero_first_col_start": [
        31
      ],
      "zero_first_col": [
        32,
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        9
      ],
      "zero_outer": [
        17
      ],
      "zero_inner": [
        18
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function setZeroes(matrix) {\n    const m = matrix.length, n = matrix[0].length;\n    let firstCol = false;\n    // Phase 1: use first row and first column as markers\n    for (let i = 0; i < m; i++) {\n        if (matrix[i][0] === 0) firstCol = true;\n        for (let j = 1; j < n; j++) {\n            if (matrix[i][j] === 0) {\n                matrix[i][0] = 0;\n                matrix[0][j] = 0;\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for (let i = 1; i < m; i++) {\n        for (let j = 1; j < n; j++) {\n            if (matrix[i][0] === 0 || matrix[0][j] === 0) {\n                matrix[i][j] = 0;\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if (matrix[0][0] === 0) {\n        for (let j = 0; j < n; j++) matrix[0][j] = 0;\n    }\n    // Phase 4: handle first column\n    if (firstCol) {\n        for (let i = 0; i < m; i++) matrix[i][0] = 0;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6
      ],
      "found_zero": [
        8
      ],
      "marked": [
        9,
        10
      ],
      "zero_start": [
        15
      ],
      "check_marker": [
        17
      ],
      "set_zero": [
        18
      ],
      "zero_first_row_start": [
        23
      ],
      "zero_first_row": [
        24
      ],
      "zero_first_col_start": [
        27
      ],
      "zero_first_col": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        7
      ],
      "zero_outer": [
        15
      ],
      "zero_inner": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function setZeroes(matrix: number[][]): void {\n    const m = matrix.length, n = matrix[0].length;\n    let firstCol = false;\n    // Phase 1: use first row and first column as markers\n    for (let i = 0; i < m; i++) {\n        if (matrix[i][0] === 0) firstCol = true;\n        for (let j = 1; j < n; j++) {\n            if (matrix[i][j] === 0) {\n                matrix[i][0] = 0;\n                matrix[0][j] = 0;\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for (let i = 1; i < m; i++) {\n        for (let j = 1; j < n; j++) {\n            if (matrix[i][0] === 0 || matrix[0][j] === 0) {\n                matrix[i][j] = 0;\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if (matrix[0][0] === 0) {\n        for (let j = 0; j < n; j++) matrix[0][j] = 0;\n    }\n    // Phase 4: handle first column\n    if (firstCol) {\n        for (let i = 0; i < m; i++) matrix[i][0] = 0;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6
      ],
      "found_zero": [
        8
      ],
      "marked": [
        9,
        10
      ],
      "zero_start": [
        15
      ],
      "check_marker": [
        17
      ],
      "set_zero": [
        18
      ],
      "zero_first_row_start": [
        23
      ],
      "zero_first_row": [
        24
      ],
      "zero_first_col_start": [
        27
      ],
      "zero_first_col": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        7
      ],
      "zero_outer": [
        15
      ],
      "zero_inner": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void SetZeroes(int[][] matrix) {\n    int m = matrix.Length, n = matrix[0].Length;\n    bool firstCol = false;\n    // Phase 1: use first row and first column as markers\n    for (int i = 0; i < m; i++) {\n        if (matrix[i][0] == 0) firstCol = true;\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][j] == 0) {\n                matrix[i][0] = 0;\n                matrix[0][j] = 0;\n            }\n        }\n    }\n    // Phase 2: zero inner cells based on markers\n    for (int i = 1; i < m; i++) {\n        for (int j = 1; j < n; j++) {\n            if (matrix[i][0] == 0 || matrix[0][j] == 0) {\n                matrix[i][j] = 0;\n            }\n        }\n    }\n    // Phase 3: handle first row\n    if (matrix[0][0] == 0) {\n        for (int j = 0; j < n; j++) matrix[0][j] = 0;\n    }\n    // Phase 4: handle first column\n    if (firstCol) {\n        for (int i = 0; i < m; i++) matrix[i][0] = 0;\n    }\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_start": [
        5
      ],
      "check_first_col": [
        6
      ],
      "found_zero": [
        8
      ],
      "marked": [
        9,
        10
      ],
      "zero_start": [
        15
      ],
      "check_marker": [
        17
      ],
      "set_zero": [
        18
      ],
      "zero_first_row_start": [
        23
      ],
      "zero_first_row": [
        24
      ],
      "zero_first_col_start": [
        27
      ],
      "zero_first_col": [
        28
      ],
      "complete": [
        30
      ]
    },
    "conditionalMap": {
      "scan_outer": [
        5
      ],
      "scan_inner": [
        7
      ],
      "zero_outer": [
        15
      ],
      "zero_inner": [
        16
      ]
    }
  }
};

const SetMatrixZeroesPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3x3 One Zero",
    "value": {
      "matrix": [
        [
          1,
          1,
          1
        ],
        [
          1,
          0,
          1
        ],
        [
          1,
          1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "3x4 Edge Zeros",
    "value": {
      "matrix": [
        [
          0,
          1,
          2,
          0
        ],
        [
          3,
          4,
          5,
          2
        ],
        [
          1,
          3,
          1,
          5
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3x3 Center Zero",
    "value": {
      "matrix": [
        [
          1,
          2,
          3
        ],
        [
          4,
          0,
          6
        ],
        [
          7,
          8,
          9
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "3x3 Corner Zeros",
    "value": {
      "matrix": [
        [
          1,
          0,
          3
        ],
        [
          0,
          5,
          6
        ],
        [
          7,
          8,
          9
        ]
      ]
    }
  }
];

function generateSetMatrixZeroesSteps(e: any): any[] {
  let r=e.matrix.map(e=>[...e]),t=r.length,o=r[0]?.length||0;if(0===t||0===o)return[];let a={};for(let e=0;e<t;e++)for(let t=0;t<o;t++)a[`cell_${e}_${t}`]={type:"matrixElement",value:r[e][t],row:e,col:t};let n=new StepRecorder({matrix:r.map(e=>[...e])},{...a});n.update_variable("m",t),n.update_variable("n",o),n.record("-","Start: Use the first row and first column as markers, plus one firstCol flag.");let l=!1;n.update_variable("firstCol",!1),n.record("mark_start","Phase 1: Scan every cell and record zeros in the first row and first column.");for(let e=0;e<t;e++){n.update_variable("i",e),n.add_conditional("scan_outer",!0),n.update_visual("pointer_i",{type:"2DPointer",label:"i",row:e,col:-1}),n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:r[e][0],row:e,col:0,state:"active"}),0===r[e][0]?(l=!0,n.update_variable("firstCol",!0),n.record("check_first_col",`matrix[${e}][0] is 0, so the first column must be zeroed at the end. firstCol = true.`)):n.record("check_first_col",`matrix[${e}][0] is ${r[e][0]}, not a zero. firstCol stays ${l}.`),n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:r[e][0],row:e,col:0,state:0===r[e][0]?"visited":void 0});for(let t=1;t<o;t++)n.update_variable("j",t),n.add_conditional("scan_inner",!0),n.update_visual("pointer_j",{type:"2DPointer",label:"j",row:-1,col:t}),n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t,state:"active"}),n.update_visual("cell_pointer",{type:"2DPointer",label:"",row:e,col:t}),0===r[e][t]&&(n.record("found_zero",`Found zero at matrix[${e}][${t}]. Mark matrix[${e}][0] and matrix[0][${t}] as 0.`),r[e][0]=0,n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:0,row:e,col:0,state:"visited"}),r[0][t]=0,n.update_visual(`cell_0_${t}`,{type:"matrixElement",value:0,row:0,col:t,state:"visited"}),n.update_variable("matrix",r.map(e=>[...e])),n.record("marked",`Marked matrix[${e}][0]=0 and matrix[0][${t}]=0 as markers.`)),n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t}),n.delete_visual("cell_pointer");n.add_conditional("scan_inner",!1),n.delete_visual("pointer_j")}n.add_conditional("scan_outer",!1),n.delete_visual("pointer_i"),n.delete_variable("i"),n.delete_variable("j"),n.record("zero_start","Phase 2: Zero the inner cells whose row or column marker is 0.");for(let e=1;e<t;e++){n.update_variable("i",e),n.add_conditional("zero_outer",!0),n.update_visual("pointer_i",{type:"2DPointer",label:"i",row:e,col:-1});for(let t=1;t<o;t++)n.update_variable("j",t),n.add_conditional("zero_inner",!0),n.update_visual("pointer_j",{type:"2DPointer",label:"j",row:-1,col:t}),n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t,state:"active"}),n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:r[e][0],row:e,col:0,state:"active"}),n.update_visual(`cell_0_${t}`,{type:"matrixElement",value:r[0][t],row:0,col:t,state:"active"}),(0===r[e][0]||0===r[0][t])&&(n.record("check_marker",`matrix[${e}][0]=${r[e][0]} or matrix[0][${t}]=${r[0][t]} is 0. Set matrix[${e}][${t}]=0.`),r[e][t]=0,n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:0,row:e,col:t,state:"found"}),n.update_variable("matrix",r.map(e=>[...e])),n.record("set_zero",`Set matrix[${e}][${t}] = 0`)),n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:r[e][0],row:e,col:0}),n.update_visual(`cell_0_${t}`,{type:"matrixElement",value:r[0][t],row:0,col:t}),0!==r[e][t]&&n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t});n.add_conditional("zero_inner",!1),n.delete_visual("pointer_j")}if(n.add_conditional("zero_outer",!1),n.delete_visual("pointer_i"),n.delete_variable("i"),n.delete_variable("j"),0===r[0][0]){n.record("zero_first_row_start","Phase 3: matrix[0][0] is 0, so the first row is zeroed.");for(let e=0;e<o;e++)n.update_visual(`cell_0_${e}`,{type:"matrixElement",value:r[0][e],row:0,col:e,state:"active"});for(let e=0;e<o;e++)r[0][e]=0,n.update_visual(`cell_0_${e}`,{type:"matrixElement",value:0,row:0,col:e,state:"found"});n.update_variable("matrix",r.map(e=>[...e])),n.record("zero_first_row","First row set to zeros.")}if(l){n.record("zero_first_col_start","Phase 4: firstCol is true, so the first column is zeroed.");for(let e=0;e<t;e++)n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:r[e][0],row:e,col:0,state:"active"});for(let e=0;e<t;e++)r[e][0]=0,n.update_visual(`cell_${e}_0`,{type:"matrixElement",value:0,row:e,col:0,state:"found"});n.update_variable("matrix",r.map(e=>[...e])),n.record("zero_first_col","First column set to zeros.")}for(let e=0;e<t;e++)for(let t=0;t<o;t++)n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:r[e][t],row:e,col:t,state:"found"});return n.update_variable("matrix",r.map(e=>[...e])),n.delete_variable("firstCol"),n.record("complete","Complete! Matrix zeroes set using O(1) extra space."),n.getSteps()
}

export function SetMatrixZeroesProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SetMatrixZeroesTemplates,
      generateSteps: (e: any) => {
        const recorded = generateSetMatrixZeroesSteps(e) as any[];
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
      title="Set Matrix Zeroes"
      slug="set-matrix-zeroes"
      approaches={approaches}
      presets={SetMatrixZeroesPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Diagonal Traverse (diagonal-traverse)
// ==========================================

const DiagonalTraverseTemplates = {
  "python": {
    "language": "python",
    "code": "def findDiagonalOrder(mat):\n    m, n = len(mat), len(mat[0])\n    result = [0] * (m * n)\n    row, col = 0, 0\n    # direction: 1 = up-right, -1 = down-left\n    direction = 1\n\n    for i in range(m * n):\n        result[i] = mat[row][col]\n\n        if direction == 1:\n            # Moving up-right\n            if col == n - 1:\n                # Hit right edge, move down one row, switch direction\n                row += 1\n                direction = -1\n            elif row == 0:\n                # Hit top edge, move right one column, switch direction\n                col += 1\n                direction = -1\n            else:\n                # Normal up-right move\n                row -= 1\n                col += 1\n        else:\n            # Moving down-left\n            if row == m - 1:\n                # Hit bottom edge, move right one column, switch direction\n                col += 1\n                direction = 1\n            elif col == 0:\n                # Hit left edge, move down one row, switch direction\n                row += 1\n                direction = 1\n            else:\n                # Normal down-left move\n                row += 1\n                col -= 1\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        27,
        29,
        30
      ],
      "hit_left_edge": [
        31,
        33,
        34
      ],
      "move_down_left": [
        35,
        37,
        38
      ],
      "complete": [
        40
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[] findDiagonalOrder(int[][] mat) {\n    int m = mat.length, n = mat[0].length;\n    int[] result = new int[m * n];\n    int row = 0, col = 0;\n    // direction: 1 = up-right, -1 = down-left\n    int direction = 1;\n\n    for (int i = 0; i < m * n; i++) {\n        result[i] = mat[row][col];\n\n        if (direction == 1) {\n            // Moving up-right\n            if (col == n - 1) {\n                // Hit right edge, move down one row, switch direction\n                row++;\n                direction = -1;\n            } else if (row == 0) {\n                // Hit top edge, move right one column, switch direction\n                col++;\n                direction = -1;\n            } else {\n                // Normal up-right move\n                row--;\n                col++;\n            }\n        } else {\n            // Moving down-left\n            if (row == m - 1) {\n                // Hit bottom edge, move right one column, switch direction\n                col++;\n                direction = 1;\n            } else if (col == 0) {\n                // Hit left edge, move down one row, switch direction\n                row++;\n                direction = 1;\n            } else {\n                // Normal down-left move\n                row++;\n                col--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<int> findDiagonalOrder(vector<vector<int>>& mat) {\n    int m = mat.size(), n = mat[0].size();\n    vector<int> result(m * n);\n    int row = 0, col = 0;\n    // direction: 1 = up-right, -1 = down-left\n    int direction = 1;\n\n    for (int i = 0; i < m * n; i++) {\n        result[i] = mat[row][col];\n\n        if (direction == 1) {\n            // Moving up-right\n            if (col == n - 1) {\n                // Hit right edge, move down one row, switch direction\n                row++;\n                direction = -1;\n            } else if (row == 0) {\n                // Hit top edge, move right one column, switch direction\n                col++;\n                direction = -1;\n            } else {\n                // Normal up-right move\n                row--;\n                col++;\n            }\n        } else {\n            // Moving down-left\n            if (row == m - 1) {\n                // Hit bottom edge, move right one column, switch direction\n                col++;\n                direction = 1;\n            } else if (col == 0) {\n                // Hit left edge, move down one row, switch direction\n                row++;\n                direction = 1;\n            } else {\n                // Normal down-left move\n                row++;\n                col--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[] FindDiagonalOrder(int[][] mat) {\n    int m = mat.Length, n = mat[0].Length;\n    int[] result = new int[m * n];\n    int row = 0, col = 0;\n    // direction: 1 = up-right, -1 = down-left\n    int direction = 1;\n\n    for (int i = 0; i < m * n; i++) {\n        result[i] = mat[row][col];\n\n        if (direction == 1) {\n            // Moving up-right\n            if (col == n - 1) {\n                // Hit right edge, move down one row, switch direction\n                row++;\n                direction = -1;\n            } else if (row == 0) {\n                // Hit top edge, move right one column, switch direction\n                col++;\n                direction = -1;\n            } else {\n                // Normal up-right move\n                row--;\n                col++;\n            }\n        } else {\n            // Moving down-left\n            if (row == m - 1) {\n                // Hit bottom edge, move right one column, switch direction\n                col++;\n                direction = 1;\n            } else if (col == 0) {\n                // Hit left edge, move down one row, switch direction\n                row++;\n                direction = 1;\n            } else {\n                // Normal down-left move\n                row++;\n                col--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func findDiagonalOrder(mat [][]int) []int {\n    m, n := len(mat), len(mat[0])\n    result := make([]int, m*n)\n    row, col := 0, 0\n    // direction: 1 = up-right, -1 = down-left\n    direction := 1\n\n    for i := 0; i < m*n; i++ {\n        result[i] = mat[row][col]\n\n        if direction == 1 {\n            // Moving up-right\n            if col == n-1 {\n                // Hit right edge, move down one row, switch direction\n                row++\n                direction = -1\n            } else if row == 0 {\n                // Hit top edge, move right one column, switch direction\n                col++\n                direction = -1\n            } else {\n                // Normal up-right move\n                row--\n                col++\n            }\n        } else {\n            // Moving down-left\n            if row == m-1 {\n                // Hit bottom edge, move right one column, switch direction\n                col++\n                direction = 1\n            } else if col == 0 {\n                // Hit left edge, move down one row, switch direction\n                row++\n                direction = 1\n            } else {\n                // Normal down-left move\n                row++\n                col--\n            }\n        }\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function findDiagonalOrder(mat) {\n    const m = mat.length, n = mat[0].length;\n    const result = new Array(m * n);\n    let row = 0, col = 0;\n    // direction: 1 = up-right, -1 = down-left\n    let direction = 1;\n\n    for (let i = 0; i < m * n; i++) {\n        result[i] = mat[row][col];\n\n        if (direction === 1) {\n            // Moving up-right\n            if (col === n - 1) {\n                // Hit right edge, move down one row, switch direction\n                row++;\n                direction = -1;\n            } else if (row === 0) {\n                // Hit top edge, move right one column, switch direction\n                col++;\n                direction = -1;\n            } else {\n                // Normal up-right move\n                row--;\n                col++;\n            }\n        } else {\n            // Moving down-left\n            if (row === m - 1) {\n                // Hit bottom edge, move right one column, switch direction\n                col++;\n                direction = 1;\n            } else if (col === 0) {\n                // Hit left edge, move down one row, switch direction\n                row++;\n                direction = 1;\n            } else {\n                // Normal down-left move\n                row++;\n                col--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function findDiagonalOrder(mat: number[][]): number[] {\n    const m = mat.length, n = mat[0].length;\n    const result: number[] = new Array(m * n);\n    let row = 0, col = 0;\n    // direction: 1 = up-right, -1 = down-left\n    let direction = 1;\n\n    for (let i = 0; i < m * n; i++) {\n        result[i] = mat[row][col];\n\n        if (direction === 1) {\n            // Moving up-right\n            if (col === n - 1) {\n                // Hit right edge, move down one row, switch direction\n                row++;\n                direction = -1;\n            } else if (row === 0) {\n                // Hit top edge, move right one column, switch direction\n                col++;\n                direction = -1;\n            } else {\n                // Normal up-right move\n                row--;\n                col++;\n            }\n        } else {\n            // Moving down-left\n            if (row === m - 1) {\n                // Hit bottom edge, move right one column, switch direction\n                col++;\n                direction = 1;\n            } else if (col === 0) {\n                // Hit left edge, move down one row, switch direction\n                row++;\n                direction = 1;\n            } else {\n                // Normal down-left move\n                row++;\n                col--;\n            }\n        }\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4,
        6
      ],
      "collect": [
        9
      ],
      "hit_right_edge": [
        13,
        15,
        16
      ],
      "hit_top_edge": [
        17,
        19,
        20
      ],
      "move_up_right": [
        21,
        23,
        24
      ],
      "hit_bottom_edge": [
        28,
        30,
        31
      ],
      "hit_left_edge": [
        32,
        34,
        35
      ],
      "move_down_left": [
        36,
        38,
        39
      ],
      "complete": [
        44
      ]
    },
    "conditionalMap": {
      "direction_up": [
        11
      ]
    }
  }
};

const DiagonalTraversePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3×3 Matrix",
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
      ]
    }
  },
  {
    "id": "ex2",
    "label": "2×3 Matrix",
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
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3×4 Matrix",
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
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Element",
    "value": {
      "matrix": [
        [
          1
        ]
      ]
    }
  }
];

function generateDiagonalTraverseSteps(e: any): any[] {
  let t=e.matrix.map(e=>[...e]);if(0===t.length)return[];let i=t.length,n=t[0].length,l={};for(let e=0;e<i;e++)for(let i=0;i<n;i++)l[`cell_${e}_${i}`]={type:"matrixElement",value:t[e][i],row:e,col:i};let r=[],a=0,d=0,s=1,c=new StepRecorder({matrix:t},{...l});c.record("-","Start: Traverse matrix in diagonal order"),c.update_variable("row",a),c.update_variable("col",d),c.update_variable("direction","up-right"),c.update_variable("result",[...r]),c.record("init","Initialize: row=0, col=0, direction=up-right");for(let e=0;e<i*n;e++)c.update_visual(`cell_${a}_${d}`,{type:"matrixElement",value:t[a][d],row:a,col:d,state:"active"}),r.push(t[a][d]),c.update_variable("result",[...r]),c.update_variable("diag",a+d),c.add_new_visual(`res_${e}`,{type:"arrayElement",value:t[a][d],position:e,state:"active"}),c.record("collect",`Collect mat[${a}][${d}] = ${t[a][d]}, result = [${r.join(", ")}]`),c.update_visual(`cell_${a}_${d}`,{type:"matrixElement",value:t[a][d],row:a,col:d,state:"visited"}),c.update_visual(`res_${e}`,{type:"arrayElement",value:t[a][d],position:e,state:"visited"}),1===s?(c.add_conditional("direction_up",!0),d===n-1?(a++,s=-1,c.update_variable("row",a),c.update_variable("direction","down-left"),c.record("hit_right_edge",`Hit right edge: move down to row=${a}, flip to down-left ↙`)):0===a?(d++,s=-1,c.update_variable("col",d),c.update_variable("direction","down-left"),c.record("hit_top_edge",`Hit top edge: move right to col=${d}, flip to down-left ↙`)):(a--,d++,c.update_variable("row",a),c.update_variable("col",d),c.record("move_up_right",`Move up-right ↗ to (${a}, ${d})`))):(c.add_conditional("direction_up",!1),a===i-1?(d++,s=1,c.update_variable("col",d),c.update_variable("direction","up-right"),c.record("hit_bottom_edge",`Hit bottom edge: move right to col=${d}, flip to up-right ↗`)):0===d?(a++,s=1,c.update_variable("row",a),c.update_variable("direction","up-right"),c.record("hit_left_edge",`Hit left edge: move down to row=${a}, flip to up-right ↗`)):(a++,d--,c.update_variable("row",a),c.update_variable("col",d),c.record("move_down_left",`Move down-left ↙ to (${a}, ${d})`)));c.delete_variable("diag");for(let e=0;e<i;e++)for(let i=0;i<n;i++)c.update_visual(`cell_${e}_${i}`,{type:"matrixElement",value:t[e][i],row:e,col:i,state:"found"});for(let e=0;e<r.length;e++)c.update_visual(`res_${e}`,{type:"arrayElement",value:r[e],position:e,state:"found"});return c.record("complete",`Done! Result: [${r.join(", ")}]`),c.getSteps()
}

export function DiagonalTraverseProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DiagonalTraverseTemplates,
      generateSteps: (e: any) => {
        const recorded = generateDiagonalTraverseSteps(e) as any[];
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
      title="Diagonal Traverse"
      slug="diagonal-traverse"
      approaches={approaches}
      presets={DiagonalTraversePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Transpose Matrix (transpose-matrix)
// ==========================================

const TransposeMatrixTemplates = {
  "python": {
    "language": "python",
    "code": "def transpose(matrix):\n    m = len(matrix)\n    n = len(matrix[0])\n\n    # Each column of the original becomes a row of the result\n    result = []\n    for j in range(n):\n        row = []\n        for i in range(m):\n            row.append(matrix[i][j])\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        6
      ],
      "outer_loop": [
        7
      ],
      "inner_loop": [
        9
      ],
      "copy": [
        10
      ],
      "complete": [
        13
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] transpose(int[][] matrix) {\n    int m = matrix.length;\n    int n = matrix[0].length;\n    int[][] result = new int[n][m];\n\n    // Each column of the original becomes a row of the result\n    for (int j = 0; j < n; j++) {\n        for (int i = 0; i < m; i++) {\n            result[j][i] = matrix[i][j];\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "outer_loop": [
        7
      ],
      "inner_loop": [
        8
      ],
      "copy": [
        9
      ],
      "complete": [
        12,
        13
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> transpose(vector<vector<int>>& matrix) {\n    int m = matrix.size();\n    int n = matrix[0].size();\n    vector<vector<int>> result(n, vector<int>(m));\n\n    // Each column of the original becomes a row of the result\n    for (int j = 0; j < n; j++) {\n        for (int i = 0; i < m; i++) {\n            result[j][i] = matrix[i][j];\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "outer_loop": [
        7
      ],
      "inner_loop": [
        8
      ],
      "copy": [
        9
      ],
      "complete": [
        12,
        13
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] Transpose(int[][] matrix) {\n    int m = matrix.Length;\n    int n = matrix[0].Length;\n\n    int[][] result = new int[n][];\n    for (int j = 0; j < n; j++) {\n        result[j] = new int[m];\n    }\n\n    // Each column of the original becomes a row of the result\n    for (int j = 0; j < n; j++) {\n        for (int i = 0; i < m; i++) {\n            result[j][i] = matrix[i][j];\n        }\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7
      ],
      "outer_loop": [
        11
      ],
      "inner_loop": [
        12
      ],
      "copy": [
        13
      ],
      "complete": [
        16,
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func transpose(matrix [][]int) [][]int {\n    m := len(matrix)\n    n := len(matrix[0])\n\n    result := make([][]int, n)\n    for j := range result {\n        result[j] = make([]int, m)\n    }\n\n    // Each column of the original becomes a row of the result\n    for j := 0; j < n; j++ {\n        for i := 0; i < m; i++ {\n            result[j][i] = matrix[i][j]\n        }\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5,
        6,
        7
      ],
      "outer_loop": [
        11
      ],
      "inner_loop": [
        12
      ],
      "copy": [
        13
      ],
      "complete": [
        16,
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function transpose(matrix) {\n    const m = matrix.length;\n    const n = matrix[0].length;\n\n    const result = [];\n    // Each column of the original becomes a row of the result\n    for (let j = 0; j < n; j++) {\n        const row = [];\n        for (let i = 0; i < m; i++) {\n            row.push(matrix[i][j]);\n        }\n        result.push(row);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "outer_loop": [
        7
      ],
      "inner_loop": [
        9
      ],
      "copy": [
        10
      ],
      "complete": [
        14,
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function transpose(matrix: number[][]): number[][] {\n    const m = matrix.length;\n    const n = matrix[0].length;\n\n    const result: number[][] = [];\n    // Each column of the original becomes a row of the result\n    for (let j = 0; j < n; j++) {\n        const row: number[] = [];\n        for (let i = 0; i < m; i++) {\n            row.push(matrix[i][j]);\n        }\n        result.push(row);\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "outer_loop": [
        7
      ],
      "inner_loop": [
        9
      ],
      "copy": [
        10
      ],
      "complete": [
        14,
        15
      ]
    }
  }
};

const TransposeMatrixPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3×3 Matrix",
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
      ]
    }
  },
  {
    "id": "ex2",
    "label": "2×3 Matrix",
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
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3×2 Matrix",
    "value": {
      "matrix": [
        [
          1,
          2
        ],
        [
          3,
          4
        ],
        [
          5,
          6
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Single Row",
    "value": {
      "matrix": [
        [
          1,
          2,
          3
        ]
      ]
    }
  }
];

function generateTransposeMatrixSteps(e: any): any[] {
  let t=e.matrix.map(e=>[...e]);if(0===t.length)return[];let r=t.length,n=t[0].length,a={};for(let e=0;e<r;e++)for(let r=0;r<n;r++)a[`src_${e}_${r}`]={type:"matrixElement",value:t[e][r],row:e,col:r};let l=new StepRecorder({},a);l.record("-","Start: Transpose the matrix");for(let e=0;e<n;e++)for(let t=0;t<r;t++)l.add_new_visual(`dst_${e}_${t}`,{type:"matrixElement",value:"",row:e,col:t,state:"muted"});l.record("init",`Initialize ${n}x${r} result matrix`);for(let e=0;e<n;e++){l.record("outer_loop",`Process column j=${e} of source matrix`);for(let i=0;i<r;i++)l.update_visual(`src_${i}_${e}`,{type:"matrixElement",value:t[i][e],row:i,col:e,state:"active"}),l.update_visual(`dst_${e}_${i}`,{type:"matrixElement",value:t[i][e],row:e,col:i,state:"active"}),l.record("copy",`Copy matrix[${i}][${e}] = ${t[i][e]} to result[${e}][${i}]`),l.update_visual(`src_${i}_${e}`,{type:"matrixElement",value:t[i][e],row:i,col:e,state:"visited"}),l.update_visual(`dst_${e}_${i}`,{type:"matrixElement",value:t[i][e],row:e,col:i,state:"visited"}),l.record("inner_loop",`Copied matrix[${i}][${e}] to result[${e}][${i}]`)}for(let e=0;e<r;e++)for(let r=0;r<n;r++)l.update_visual(`src_${e}_${r}`,{type:"matrixElement",value:t[e][r],row:e,col:r,state:"found"});for(let e=0;e<n;e++)for(let i=0;i<r;i++)l.update_visual(`dst_${e}_${i}`,{type:"matrixElement",value:t[i][e],row:e,col:i,state:"found"});return l.record("complete","Done! Matrix transposed successfully."),l.getSteps()
}

export function TransposeMatrixProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: TransposeMatrixTemplates,
      generateSteps: (e: any) => {
        const recorded = generateTransposeMatrixSteps(e) as any[];
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
      title="Transpose Matrix"
      slug="transpose-matrix"
      approaches={approaches}
      presets={TransposeMatrixPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Valid Sudoku (valid-sudoku)
// ==========================================

const ValidSudokuTemplates = {
  "python": {
    "language": "python",
    "code": "def isValidSudoku(board):\n    rows = [0] * 9\n    cols = [0] * 9\n    boxes = [0] * 9\n\n    for r in range(9):\n        for c in range(9):\n            if board[r][c] == '.':\n                continue\n\n            # Bitmask for the current digit\n            mask = 1 << (int(board[r][c]) - 1)\n            box_idx = (r // 3) * 3 + (c // 3)\n\n            # If bit is already set in any group, it's a duplicate\n            if (rows[r] & mask or\n                cols[c] & mask or\n                boxes[box_idx] & mask):\n                return False\n\n            # Mark the digit as seen\n            rows[r] |= mask\n            cols[c] |= mask\n            boxes[box_idx] |= mask\n\n    return True",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8,
        9
      ],
      "compute_mask": [
        12,
        13
      ],
      "check_duplicate": [
        16,
        17,
        18
      ],
      "invalid": [
        19
      ],
      "mark_seen": [
        22,
        23,
        24
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        16,
        17,
        18
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public boolean isValidSudoku(char[][] board) {\n    int[] rows = new int[9];\n    int[] cols = new int[9];\n    int[] boxes = new int[9];\n\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') continue;\n\n            // Bitmask for the current digit\n            int mask = 1 << (board[r][c] - '1');\n            int boxIdx = (r / 3) * 3 + (c / 3);\n\n            // If bit is already set in any group, it's a duplicate\n            if ((rows[r] & mask) != 0 ||\n                (cols[c] & mask) != 0 ||\n                (boxes[boxIdx] & mask) != 0) {\n                return false;\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask;\n            cols[c] |= mask;\n            boxes[boxIdx] |= mask;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8
      ],
      "compute_mask": [
        11,
        12
      ],
      "check_duplicate": [
        15,
        16,
        17
      ],
      "invalid": [
        18
      ],
      "mark_seen": [
        22,
        23,
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        15,
        16,
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "bool isValidSudoku(vector<vector<char>>& board) {\n    int rows[9] = {0}, cols[9] = {0}, boxes[9] = {0};\n\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') continue;\n\n            // Bitmask for the current digit\n            int mask = 1 << (board[r][c] - '1');\n            int boxIdx = (r / 3) * 3 + (c / 3);\n\n            // If bit is already set in any group, it's a duplicate\n            if ((rows[r] & mask) ||\n                (cols[c] & mask) ||\n                (boxes[boxIdx] & mask)) {\n                return false;\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask;\n            cols[c] |= mask;\n            boxes[boxIdx] |= mask;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2
      ],
      "skip_empty": [
        6
      ],
      "compute_mask": [
        9,
        10
      ],
      "check_duplicate": [
        13,
        14,
        15
      ],
      "invalid": [
        16
      ],
      "mark_seen": [
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        6
      ],
      "check_duplicate": [
        13,
        14,
        15
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public bool IsValidSudoku(char[][] board) {\n    int[] rows = new int[9];\n    int[] cols = new int[9];\n    int[] boxes = new int[9];\n\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') continue;\n\n            // Bitmask for the current digit\n            int mask = 1 << (board[r][c] - '1');\n            int boxIdx = (r / 3) * 3 + (c / 3);\n\n            // If bit is already set in any group, it's a duplicate\n            if ((rows[r] & mask) != 0 ||\n                (cols[c] & mask) != 0 ||\n                (boxes[boxIdx] & mask) != 0) {\n                return false;\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask;\n            cols[c] |= mask;\n            boxes[boxIdx] |= mask;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8
      ],
      "compute_mask": [
        11,
        12
      ],
      "check_duplicate": [
        15,
        16,
        17
      ],
      "invalid": [
        18
      ],
      "mark_seen": [
        22,
        23,
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        15,
        16,
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func isValidSudoku(board [][]byte) bool {\n    rows := [9]int{}\n    cols := [9]int{}\n    boxes := [9]int{}\n\n    for r := 0; r < 9; r++ {\n        for c := 0; c < 9; c++ {\n            if board[r][c] == '.' {\n                continue\n            }\n\n            // Bitmask for the current digit\n            mask := 1 << (board[r][c] - '1')\n            boxIdx := (r/3)*3 + (c / 3)\n\n            // If bit is already set in any group, it's a duplicate\n            if rows[r]&mask != 0 || cols[c]&mask != 0 || boxes[boxIdx]&mask != 0 {\n                return false\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask\n            cols[c] |= mask\n            boxes[boxIdx] |= mask\n        }\n    }\n\n    return true\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8,
        9
      ],
      "compute_mask": [
        13,
        14
      ],
      "check_duplicate": [
        17
      ],
      "invalid": [
        18
      ],
      "mark_seen": [
        22,
        23,
        24
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function isValidSudoku(board) {\n    const rows = new Array(9).fill(0);\n    const cols = new Array(9).fill(0);\n    const boxes = new Array(9).fill(0);\n\n    for (let r = 0; r < 9; r++) {\n        for (let c = 0; c < 9; c++) {\n            if (board[r][c] === '.') continue;\n\n            // Bitmask for the current digit\n            const mask = 1 << (board[r][c].charCodeAt(0) - '1'.charCodeAt(0));\n            const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);\n\n            // If bit is already set in any group, it's a duplicate\n            if ((rows[r] & mask) !== 0 || (cols[c] & mask) !== 0 || (boxes[boxIdx] & mask) !== 0) {\n                return false;\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask;\n            cols[c] |= mask;\n            boxes[boxIdx] |= mask;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8
      ],
      "compute_mask": [
        11,
        12
      ],
      "check_duplicate": [
        15
      ],
      "invalid": [
        16
      ],
      "mark_seen": [
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        15
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function isValidSudoku(board: string[][]): boolean {\n    const rows: number[] = new Array(9).fill(0);\n    const cols: number[] = new Array(9).fill(0);\n    const boxes: number[] = new Array(9).fill(0);\n\n    for (let r = 0; r < 9; r++) {\n        for (let c = 0; c < 9; c++) {\n            if (board[r][c] === '.') continue;\n\n            // Bitmask for the current digit\n            const mask = 1 << (board[r][c].charCodeAt(0) - '1'.charCodeAt(0));\n            const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);\n\n            // If bit is already set in any group, it's a duplicate\n            if ((rows[r] & mask) !== 0 || (cols[c] & mask) !== 0 || (boxes[boxIdx] & mask) !== 0) {\n                return false;\n            }\n\n            // Mark the digit as seen\n            rows[r] |= mask;\n            cols[c] |= mask;\n            boxes[boxIdx] |= mask;\n        }\n    }\n\n    return true;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "skip_empty": [
        8
      ],
      "compute_mask": [
        11,
        12
      ],
      "check_duplicate": [
        15
      ],
      "invalid": [
        16
      ],
      "mark_seen": [
        20,
        21,
        22
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_empty": [
        8
      ],
      "check_duplicate": [
        15
      ]
    }
  }
};

const ValidSudokuPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Valid Board",
    "value": {
      "board": [
        [
          "5",
          "3",
          ".",
          ".",
          "7",
          ".",
          ".",
          ".",
          "."
        ],
        [
          "6",
          ".",
          ".",
          "1",
          "9",
          "5",
          ".",
          ".",
          "."
        ],
        [
          ".",
          "9",
          "8",
          ".",
          ".",
          ".",
          ".",
          "6",
          "."
        ],
        [
          "8",
          ".",
          ".",
          ".",
          "6",
          ".",
          ".",
          ".",
          "3"
        ],
        [
          "4",
          ".",
          ".",
          "8",
          ".",
          "3",
          ".",
          ".",
          "1"
        ],
        [
          "7",
          ".",
          ".",
          ".",
          "2",
          ".",
          ".",
          ".",
          "6"
        ],
        [
          ".",
          "6",
          ".",
          ".",
          ".",
          ".",
          "2",
          "8",
          "."
        ],
        [
          ".",
          ".",
          ".",
          "4",
          "1",
          "9",
          ".",
          ".",
          "5"
        ],
        [
          ".",
          ".",
          ".",
          ".",
          "8",
          ".",
          ".",
          "7",
          "9"
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Invalid (Row Duplicate)",
    "value": {
      "board": [
        [
          "5",
          "3",
          ".",
          ".",
          "7",
          "3",
          ".",
          ".",
          "."
        ],
        [
          "6",
          ".",
          ".",
          "1",
          "9",
          "5",
          ".",
          ".",
          "."
        ],
        [
          ".",
          "9",
          "8",
          ".",
          ".",
          ".",
          ".",
          "6",
          "."
        ],
        [
          "8",
          ".",
          ".",
          ".",
          "6",
          ".",
          ".",
          ".",
          "3"
        ],
        [
          "4",
          ".",
          ".",
          "8",
          ".",
          "3",
          ".",
          ".",
          "1"
        ],
        [
          "7",
          ".",
          ".",
          ".",
          "2",
          ".",
          ".",
          ".",
          "6"
        ],
        [
          ".",
          "6",
          ".",
          ".",
          ".",
          ".",
          "2",
          "8",
          "."
        ],
        [
          ".",
          ".",
          ".",
          "4",
          "1",
          "9",
          ".",
          ".",
          "5"
        ],
        [
          ".",
          ".",
          ".",
          ".",
          "8",
          ".",
          ".",
          "7",
          "9"
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Invalid (Box Duplicate)",
    "value": {
      "board": [
        [
          "5",
          "3",
          ".",
          ".",
          "7",
          ".",
          ".",
          ".",
          "."
        ],
        [
          "6",
          "5",
          ".",
          "1",
          "9",
          "5",
          ".",
          ".",
          "."
        ],
        [
          ".",
          "9",
          "8",
          ".",
          ".",
          ".",
          ".",
          "6",
          "."
        ],
        [
          "8",
          ".",
          ".",
          ".",
          "6",
          ".",
          ".",
          ".",
          "3"
        ],
        [
          "4",
          ".",
          ".",
          "8",
          ".",
          "3",
          ".",
          ".",
          "1"
        ],
        [
          "7",
          ".",
          ".",
          ".",
          "2",
          ".",
          ".",
          ".",
          "6"
        ],
        [
          ".",
          "6",
          ".",
          ".",
          ".",
          ".",
          "2",
          "8",
          "."
        ],
        [
          ".",
          ".",
          ".",
          "4",
          "1",
          "9",
          ".",
          ".",
          "5"
        ],
        [
          ".",
          ".",
          ".",
          ".",
          "8",
          ".",
          ".",
          "7",
          "9"
        ]
      ]
    }
  }
];

function generateValidSudokuSteps(e: any): any[] {
  function o(e){let t=[];for(let r=0;r<9;r++)e&1<<r&&t.push(String(r+1));return t}
let t=e.board.map(e=>[...e]),r={};for(let e=0;e<9;e++)for(let a=0;a<9;a++)r[`cell_${e}_${a}`]={type:"matrixElement",value:t[e][a],row:e,col:a,state:"."===t[e][a]?"eliminated":void 0};let i=Array(9).fill(0),n=Array(9).fill(0),l=Array(9).fill(0),c=new StepRecorder({board:t},{...r});c.record("-","Start: Validate the Sudoku board"),c.update_variable("rows",[...i]),c.update_variable("cols",[...n]),c.update_variable("boxes",[...l]),c.record("init","Initialize rows, cols, and boxes bitmask arrays to all zeros");let s=(e,t,r)=>{c.update_variable("rowSeen",o(i[e])),c.update_variable("colSeen",o(n[t])),c.update_variable("boxSeen",o(l[r]))};for(let e=0;e<9;e++)for(let r=0;r<9;r++){let a=3*Math.floor(e/3)+Math.floor(r/3);if(c.update_variable("r",e),c.update_variable("c",r),c.update_variable("boxIdx",a),"."===t[e][r]){c.update_variable("digit",""),s(e,r,a),c.add_conditional("is_empty",!0),c.record("skip_empty",`Cell [${e}][${r}] is empty, skip`);continue}c.add_conditional("is_empty",!1),c.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:t[e][r],row:e,col:r,state:"active"});let o=t[e][r],d=1<<o.charCodeAt(0)-49;c.update_variable("digit",o),c.update_variable("mask",d),s(e,r,a),c.record("compute_mask",`Cell [${e}][${r}] = '${o}', mask = ${d}, boxIdx = ${a}`);let u=(i[e]&d)!=0,p=(n[r]&d)!=0,b=(l[a]&d)!=0,f=u||p||b;if(c.add_conditional("check_duplicate",f),f){c.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:t[e][r],row:e,col:r,state:"found"});let i=[];for(let n=0;n<9;n++)for(let l=0;l<9&&!(n>e)&&(n!==e||!(l>=r));l++){if(t[n][l]!==o)continue;let s=n===e&&u,d=l===r&&p,f=3*Math.floor(n/3)+Math.floor(l/3)===a&&b;(s||d||f)&&(i.push([n,l]),c.update_visual(`cell_${n}_${l}`,{type:"matrixElement",value:t[n][l],row:n,col:l,state:"found"}))}let n=u?`row ${e}`:p?`column ${r}`:`box ${a}`;return c.update_variable("dupRow",u),c.update_variable("dupCol",p),c.update_variable("dupBox",b),c.update_variable("conflicts",i),c.update_variable("verdict","invalid"),c.record("invalid",`Duplicate '${o}' in ${n}! Board is invalid.`),c.getSteps()}i[e]|=d,n[r]|=d,l[a]|=d,c.update_variable("rows",[...i]),c.update_variable("cols",[...n]),c.update_variable("boxes",[...l]),s(e,r,a),c.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:t[e][r],row:e,col:r,state:"visited"}),c.record("mark_seen",`'${o}' is unique in row ${e}, col ${r}, box ${a}. Mark as seen.`)}return c.update_variable("digit",""),c.update_variable("verdict","valid"),c.record("complete","All cells checked. Board is valid!"),c.getSteps()
}

export function ValidSudokuProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ValidSudokuTemplates,
      generateSteps: (e: any) => {
        const recorded = generateValidSudokuSteps(e) as any[];
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
      title="Valid Sudoku"
      slug="valid-sudoku"
      approaches={approaches}
      presets={ValidSudokuPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Game of Life (game-of-life)
// ==========================================

const GameOfLifeTemplates = {
  "python": {
    "language": "python",
    "code": "def gameOfLife(board):\n    m = len(board)\n    n = len(board[0])\n    directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1),\n                  (0, 1), (1, -1), (1, 0), (1, 1)]\n\n    for i in range(m):\n        for j in range(n):\n            live_neighbors = 0\n            for dr, dc in directions:\n                ni, nj = i + dr, j + dc\n                # Bit 0 holds the original state\n                if 0 <= ni < m and 0 <= nj < n and (board[ni][nj] & 1) == 1:\n                    live_neighbors += 1\n\n            current_state = board[i][j] & 1\n            # Determine next state and store in bit 1\n            if current_state == 1 and live_neighbors in (2, 3):\n                board[i][j] |= 2\n            elif current_state == 0 and live_neighbors == 3:\n                board[i][j] |= 2\n\n    # Right-shift to make next state the current state\n    for i in range(m):\n        for j in range(n):\n            board[i][j] >>= 1",
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
      "count_neighbor": [
        9,
        10,
        11,
        13,
        14
      ],
      "apply_rule_survive": [
        18,
        19
      ],
      "apply_rule_birth": [
        20,
        21
      ],
      "apply_rule_death": [
        16,
        18
      ],
      "shift_cell": [
        26
      ],
      "complete": [
        26
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        13
      ],
      "survive_rule": [
        18
      ],
      "birth_rule": [
        20
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public void gameOfLife(int[][] board) {\n    int m = board.length;\n    int n = board[0].length;\n    int[] dr = {-1, -1, -1, 0, 0, 1, 1, 1};\n    int[] dc = {-1, 0, 1, -1, 1, -1, 0, 1};\n\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            int liveNeighbors = 0;\n            for (int d = 0; d < 8; d++) {\n                int ni = i + dr[d];\n                int nj = j + dc[d];\n                // Bit 0 holds the original state\n                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) == 1) {\n                    liveNeighbors++;\n                }\n            }\n\n            int currentState = board[i][j] & 1;\n            // Determine next state and store in bit 1\n            if (currentState == 1 && (liveNeighbors == 2 || liveNeighbors == 3)) {\n                board[i][j] |= 2; // next state alive\n            } else if (currentState == 0 && liveNeighbors == 3) {\n                board[i][j] |= 2; // next state alive\n            }\n            // If next state is dead, bit 1 stays 0 (default)\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            board[i][j] >>= 1;\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        33
      ],
      "complete": [
        36
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "void gameOfLife(vector<vector<int>>& board) {\n    int m = board.size();\n    int n = board[0].size();\n    int dr[] = {-1, -1, -1, 0, 0, 1, 1, 1};\n    int dc[] = {-1, 0, 1, -1, 1, -1, 0, 1};\n\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            int liveNeighbors = 0;\n            for (int d = 0; d < 8; d++) {\n                int ni = i + dr[d];\n                int nj = j + dc[d];\n                // Bit 0 holds the original state\n                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) == 1) {\n                    liveNeighbors++;\n                }\n            }\n\n            int currentState = board[i][j] & 1;\n            // Determine next state and store in bit 1\n            if (currentState == 1 && (liveNeighbors == 2 || liveNeighbors == 3)) {\n                board[i][j] |= 2;\n            } else if (currentState == 0 && liveNeighbors == 3) {\n                board[i][j] |= 2;\n            }\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            board[i][j] >>= 1;\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public void GameOfLife(int[][] board) {\n    int m = board.Length;\n    int n = board[0].Length;\n    int[] dr = {-1, -1, -1, 0, 0, 1, 1, 1};\n    int[] dc = {-1, 0, 1, -1, 1, -1, 0, 1};\n\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            int liveNeighbors = 0;\n            for (int d = 0; d < 8; d++) {\n                int ni = i + dr[d];\n                int nj = j + dc[d];\n                // Bit 0 holds the original state\n                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) == 1) {\n                    liveNeighbors++;\n                }\n            }\n\n            int currentState = board[i][j] & 1;\n            // Determine next state and store in bit 1\n            if (currentState == 1 && (liveNeighbors == 2 || liveNeighbors == 3)) {\n                board[i][j] |= 2;\n            } else if (currentState == 0 && liveNeighbors == 3) {\n                board[i][j] |= 2;\n            }\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for (int i = 0; i < m; i++) {\n        for (int j = 0; j < n; j++) {\n            board[i][j] >>= 1;\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func gameOfLife(board [][]int) {\n    m := len(board)\n    n := len(board[0])\n    dr := []int{-1, -1, -1, 0, 0, 1, 1, 1}\n    dc := []int{-1, 0, 1, -1, 1, -1, 0, 1}\n\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            liveNeighbors := 0\n            for d := 0; d < 8; d++ {\n                ni := i + dr[d]\n                nj := j + dc[d]\n                // Bit 0 holds the original state\n                if ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj]&1) == 1 {\n                    liveNeighbors++\n                }\n            }\n\n            currentState := board[i][j] & 1\n            // Determine next state and store in bit 1\n            if currentState == 1 && (liveNeighbors == 2 || liveNeighbors == 3) {\n                board[i][j] |= 2\n            } else if currentState == 0 && liveNeighbors == 3 {\n                board[i][j] |= 2\n            }\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for i := 0; i < m; i++ {\n        for j := 0; j < n; j++ {\n            board[i][j] >>= 1\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function gameOfLife(board) {\n    const m = board.length;\n    const n = board[0].length;\n    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];\n    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];\n\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            let liveNeighbors = 0;\n            for (let d = 0; d < 8; d++) {\n                const ni = i + dr[d];\n                const nj = j + dc[d];\n                // Bit 0 holds the original state\n                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) === 1) {\n                    liveNeighbors++;\n                }\n            }\n\n            const currentState = board[i][j] & 1;\n            // Determine next state and store in bit 1\n            if (currentState === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {\n                board[i][j] |= 2;\n            } else if (currentState === 0 && liveNeighbors === 3) {\n                board[i][j] |= 2;\n            }\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            board[i][j] >>= 1;\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function gameOfLife(board: number[][]): void {\n    const m = board.length;\n    const n = board[0].length;\n    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];\n    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];\n\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            let liveNeighbors = 0;\n            for (let d = 0; d < 8; d++) {\n                const ni = i + dr[d];\n                const nj = j + dc[d];\n                // Bit 0 holds the original state\n                if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) === 1) {\n                    liveNeighbors++;\n                }\n            }\n\n            const currentState = board[i][j] & 1;\n            // Determine next state and store in bit 1\n            if (currentState === 1 && (liveNeighbors === 2 || liveNeighbors === 3)) {\n                board[i][j] |= 2;\n            } else if (currentState === 0 && liveNeighbors === 3) {\n                board[i][j] |= 2;\n            }\n        }\n    }\n\n    // Right-shift to make next state the current state\n    for (let i = 0; i < m; i++) {\n        for (let j = 0; j < n; j++) {\n            board[i][j] >>= 1;\n        }\n    }\n}",
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
      "count_neighbor": [
        9,
        10,
        11,
        12,
        14,
        15
      ],
      "apply_rule_survive": [
        21,
        22
      ],
      "apply_rule_birth": [
        23,
        24
      ],
      "apply_rule_death": [
        19,
        21
      ],
      "shift_cell": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "is_live_neighbor": [
        14
      ],
      "survive_rule": [
        21
      ],
      "birth_rule": [
        23
      ]
    }
  }
};

const GameOfLifePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Glider",
    "value": {
      "board": [
        [
          0,
          1,
          0
        ],
        [
          0,
          0,
          1
        ],
        [
          1,
          1,
          1
        ],
        [
          0,
          0,
          0
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Blinker",
    "value": {
      "board": [
        [
          0,
          0,
          0
        ],
        [
          1,
          1,
          1
        ],
        [
          0,
          0,
          0
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Block (Still Life)",
    "value": {
      "board": [
        [
          1,
          1
        ],
        [
          1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Beacon",
    "value": {
      "board": [
        [
          1,
          1,
          0,
          0
        ],
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
          1
        ],
        [
          0,
          0,
          1,
          1
        ]
      ]
    }
  }
];

function generateGameOfLifeSteps(e: any): any[] {
  let i=e.board.map(e=>[...e]);if(0===i.length)return[];let t=i.length,a=i[0].length,l={};for(let e=0;e<t;e++)for(let t=0;t<a;t++)l[`cell_${e}_${t}`]={type:"matrixElement",value:i[e][t],row:e,col:t,state:1===i[e][t]?"alive":"dead"};let n=new StepRecorder({board:i},{...l});n.record("-","Start: Apply Game of Life rules in-place using bit manipulation");let o=[-1,-1,-1,0,0,1,1,1],d=[-1,0,1,-1,1,-1,0,1];n.update_variable("dr",o),n.update_variable("dc",d),n.update_variable("phase","scan"),n.record("init","Initialize direction arrays for 8 neighbors");for(let e=0;e<t;e++)for(let r=0;r<a;r++){let l=0,s=[];for(let n=0;n<8;n++){let c=e+o[n],h=r+d[n];if(c>=0&&c<t&&h>=0&&h<a){let e=1&i[c][h];s.push([c,h,e]),1===e&&l++}}let c=1&i[e][r];n.update_variable("i",e),n.update_variable("j",r),n.update_variable("liveNeighbors",l),n.update_variable("neighbors",s),n.update_variable("value",i[e][r]),n.update_variable("rule",""),n.add_conditional("is_live_neighbor",l>0),n.record("count_neighbor",`Cell [${e}][${r}]: counted ${l} live neighbor${1!==l?"s":""}`),1===c&&(2===l||3===l)?(i[e][r]|=2,n.add_conditional("survive_rule",!0),n.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:i[e][r],row:e,col:r,state:"will_live"}),n.update_variable("rule","survive"),n.update_variable("value",i[e][r]),n.update_variable("board",i.map(e=>[...e])),n.record("apply_rule_survive",`Cell [${e}][${r}] is alive with ${l} neighbors, survives (set bit 1: ${i[e][r]})`)):0===c&&3===l?(i[e][r]|=2,n.add_conditional("survive_rule",!1),n.add_conditional("birth_rule",!0),n.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:i[e][r],row:e,col:r,state:"will_live"}),n.update_variable("rule","birth"),n.update_variable("value",i[e][r]),n.update_variable("board",i.map(e=>[...e])),n.record("apply_rule_birth",`Cell [${e}][${r}] is dead with exactly 3 neighbors, becomes alive (set bit 1: ${i[e][r]})`)):(n.add_conditional("survive_rule",!1),n.add_conditional("birth_rule",!1),1===c&&n.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:i[e][r],row:e,col:r,state:"will_die"}),n.update_variable("rule",1===c?"death":"stay_dead"),n.record("apply_rule_death",1===c?`Cell [${e}][${r}] is alive with ${l} neighbors, dies`:`Cell [${e}][${r}] is dead with ${l} neighbors, stays dead`))}n.update_variable("phase","shift"),n.update_variable("rule","");for(let e=0;e<t;e++)for(let t=0;t<a;t++){let r=i[e][t];i[e][t]>>=1,n.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:i[e][t],row:e,col:t,state:1===i[e][t]?"alive":"dead"}),n.update_variable("i",e),n.update_variable("j",t),n.update_variable("before",r),n.update_variable("value",i[e][t]),n.update_variable("board",i.map(e=>[...e])),n.record("shift_cell",`Right-shift cell [${e}][${t}]: ${r} >> 1 = ${i[e][t]}`)}return n.update_variable("phase","done"),n.update_variable("verdict","done"),n.record("complete","Done! Board updated to next generation"),n.getSteps()
}

export function GameOfLifeProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: GameOfLifeTemplates,
      generateSteps: (e: any) => {
        const recorded = generateGameOfLifeSteps(e) as any[];
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
      title="Game of Life"
      slug="game-of-life"
      approaches={approaches}
      presets={GameOfLifePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Candy Crush (candy-crush)
// ==========================================

const CandyCrushTemplates = {
  "python": {
    "language": "python",
    "code": "def candyCrush(board):\n    m = len(board)\n    n = len(board[0])\n\n    should_continue = True\n    while should_continue:\n        should_continue = False\n\n        # Mark horizontal runs by negating values\n        for i in range(m):\n            for j in range(n - 2):\n                val = abs(board[i][j])\n                if val != 0 and val == abs(board[i][j + 1]) == abs(board[i][j + 2]):\n                    board[i][j] = board[i][j + 1] = board[i][j + 2] = -val\n                    should_continue = True\n\n        # Mark vertical runs by negating values\n        for i in range(m - 2):\n            for j in range(n):\n                val = abs(board[i][j])\n                if val != 0 and val == abs(board[i + 1][j]) == abs(board[i + 2][j]):\n                    board[i][j] = board[i + 1][j] = board[i + 2][j] = -val\n                    should_continue = True\n\n        # Crush and apply gravity\n        for j in range(n):\n            write_pos = m - 1\n            for i in range(m - 1, -1, -1):\n                if board[i][j] > 0:\n                    board[write_pos][j] = board[i][j]\n                    if write_pos != i:\n                        board[i][j] = 0\n                    write_pos -= 1\n            while write_pos >= 0:\n                board[write_pos][j] = 0\n                write_pos -= 1\n\n    return board",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15
      ],
      "scan_cols": [
        18,
        19,
        20
      ],
      "mark_col": [
        22,
        23
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        29
      ],
      "drop_col": [
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        21
      ],
      "stable_check": [
        6
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] candyCrush(int[][] board) {\n    int m = board.length;\n    int n = board[0].length;\n\n    boolean shouldContinue = true;\n    while (shouldContinue) {\n        shouldContinue = false;\n\n        // Mark horizontal runs by negating values\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n - 2; j++) {\n                int val = Math.abs(board[i][j]);\n                if (val != 0 && val == Math.abs(board[i][j + 1]) && val == Math.abs(board[i][j + 2])) {\n                    board[i][j] = -val;\n                    board[i][j + 1] = -val;\n                    board[i][j + 2] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for (int i = 0; i < m - 2; i++) {\n            for (int j = 0; j < n; j++) {\n                int val = Math.abs(board[i][j]);\n                if (val != 0 && val == Math.abs(board[i + 1][j]) && val == Math.abs(board[i + 2][j])) {\n                    board[i][j] = -val;\n                    board[i + 1][j] = -val;\n                    board[i + 2][j] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Crush and apply gravity in one pass\n        for (int j = 0; j < n; j++) {\n            int writePos = m - 1;\n            // Move positive (unmarked) values down\n            for (int i = m - 1; i >= 0; i--) {\n                if (board[i][j] > 0) {\n                    board[writePos][j] = board[i][j];\n                    if (writePos != i) {\n                        board[i][j] = 0;\n                    }\n                    writePos--;\n                }\n            }\n            // Fill remaining top cells with zero\n            while (writePos >= 0) {\n                board[writePos][j] = 0;\n                writePos--;\n            }\n        }\n    }\n\n    return board;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15,
        16,
        17
      ],
      "scan_cols": [
        23,
        24,
        25
      ],
      "mark_col": [
        27,
        28,
        29,
        30
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        40
      ],
      "drop_col": [
        36,
        37,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        49,
        50,
        51
      ],
      "complete": [
        56
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        26
      ],
      "stable_check": [
        6
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> candyCrush(vector<vector<int>>& board) {\n    int m = board.size();\n    int n = board[0].size();\n\n    bool shouldContinue = true;\n    while (shouldContinue) {\n        shouldContinue = false;\n\n        // Mark horizontal runs by negating values\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n - 2; j++) {\n                int val = abs(board[i][j]);\n                if (val != 0 && val == abs(board[i][j + 1]) && val == abs(board[i][j + 2])) {\n                    board[i][j] = -val;\n                    board[i][j + 1] = -val;\n                    board[i][j + 2] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for (int i = 0; i < m - 2; i++) {\n            for (int j = 0; j < n; j++) {\n                int val = abs(board[i][j]);\n                if (val != 0 && val == abs(board[i + 1][j]) && val == abs(board[i + 2][j])) {\n                    board[i][j] = -val;\n                    board[i + 1][j] = -val;\n                    board[i + 2][j] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Crush and apply gravity\n        for (int j = 0; j < n; j++) {\n            int writePos = m - 1;\n            for (int i = m - 1; i >= 0; i--) {\n                if (board[i][j] > 0) {\n                    board[writePos][j] = board[i][j];\n                    if (writePos != i) {\n                        board[i][j] = 0;\n                    }\n                    writePos--;\n                }\n            }\n            while (writePos >= 0) {\n                board[writePos][j] = 0;\n                writePos--;\n            }\n        }\n    }\n\n    return board;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15,
        16,
        17
      ],
      "scan_cols": [
        23,
        24,
        25
      ],
      "mark_col": [
        27,
        28,
        29,
        30
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        39
      ],
      "drop_col": [
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        47,
        48,
        49
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        26
      ],
      "stable_check": [
        6
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] CandyCrush(int[][] board) {\n    int m = board.Length;\n    int n = board[0].Length;\n\n    bool shouldContinue = true;\n    while (shouldContinue) {\n        shouldContinue = false;\n\n        // Mark horizontal runs by negating values\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n - 2; j++) {\n                int val = Math.Abs(board[i][j]);\n                if (val != 0 && val == Math.Abs(board[i][j + 1]) && val == Math.Abs(board[i][j + 2])) {\n                    board[i][j] = -val;\n                    board[i][j + 1] = -val;\n                    board[i][j + 2] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for (int i = 0; i < m - 2; i++) {\n            for (int j = 0; j < n; j++) {\n                int val = Math.Abs(board[i][j]);\n                if (val != 0 && val == Math.Abs(board[i + 1][j]) && val == Math.Abs(board[i + 2][j])) {\n                    board[i][j] = -val;\n                    board[i + 1][j] = -val;\n                    board[i + 2][j] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Crush and apply gravity\n        for (int j = 0; j < n; j++) {\n            int writePos = m - 1;\n            for (int i = m - 1; i >= 0; i--) {\n                if (board[i][j] > 0) {\n                    board[writePos][j] = board[i][j];\n                    if (writePos != i) {\n                        board[i][j] = 0;\n                    }\n                    writePos--;\n                }\n            }\n            while (writePos >= 0) {\n                board[writePos][j] = 0;\n                writePos--;\n            }\n        }\n    }\n\n    return board;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15,
        16,
        17
      ],
      "scan_cols": [
        23,
        24,
        25
      ],
      "mark_col": [
        27,
        28,
        29,
        30
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        39
      ],
      "drop_col": [
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        47,
        48,
        49
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        26
      ],
      "stable_check": [
        6
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func candyCrush(board [][]int) [][]int {\n    m := len(board)\n    n := len(board[0])\n\n    abs := func(x int) int {\n        if x < 0 {\n            return -x\n        }\n        return x\n    }\n\n    shouldContinue := true\n    for shouldContinue {\n        shouldContinue = false\n\n        // Mark horizontal runs by negating values\n        for i := 0; i < m; i++ {\n            for j := 0; j < n-2; j++ {\n                val := abs(board[i][j])\n                if val != 0 && val == abs(board[i][j+1]) && val == abs(board[i][j+2]) {\n                    board[i][j] = -val\n                    board[i][j+1] = -val\n                    board[i][j+2] = -val\n                    shouldContinue = true\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for i := 0; i < m-2; i++ {\n            for j := 0; j < n; j++ {\n                val := abs(board[i][j])\n                if val != 0 && val == abs(board[i+1][j]) && val == abs(board[i+2][j]) {\n                    board[i][j] = -val\n                    board[i+1][j] = -val\n                    board[i+2][j] = -val\n                    shouldContinue = true\n                }\n            }\n        }\n\n        // Crush and apply gravity\n        for j := 0; j < n; j++ {\n            writePos := m - 1\n            for i := m - 1; i >= 0; i-- {\n                if board[i][j] > 0 {\n                    board[writePos][j] = board[i][j]\n                    if writePos != i {\n                        board[i][j] = 0\n                    }\n                    writePos--\n                }\n            }\n            for writePos >= 0 {\n                board[writePos][j] = 0\n                writePos--\n            }\n        }\n    }\n\n    return board\n}",
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
        9,
        10,
        12
      ],
      "scan_rows": [
        17,
        18,
        19
      ],
      "mark_row": [
        21,
        22,
        23,
        24
      ],
      "scan_cols": [
        30,
        31,
        32
      ],
      "mark_col": [
        34,
        35,
        36,
        37
      ],
      "stable": [
        13
      ],
      "crush_cells": [
        46
      ],
      "drop_col": [
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        54,
        55,
        56
      ],
      "complete": [
        61
      ]
    },
    "conditionalMap": {
      "match_row": [
        20
      ],
      "match_col": [
        33
      ],
      "stable_check": [
        13
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function candyCrush(board) {\n    const m = board.length;\n    const n = board[0].length;\n\n    let shouldContinue = true;\n    while (shouldContinue) {\n        shouldContinue = false;\n\n        // Mark horizontal runs by negating values\n        for (let i = 0; i < m; i++) {\n            for (let j = 0; j < n - 2; j++) {\n                const val = Math.abs(board[i][j]);\n                if (val !== 0 && val === Math.abs(board[i][j + 1]) && val === Math.abs(board[i][j + 2])) {\n                    board[i][j] = -val;\n                    board[i][j + 1] = -val;\n                    board[i][j + 2] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for (let i = 0; i < m - 2; i++) {\n            for (let j = 0; j < n; j++) {\n                const val = Math.abs(board[i][j]);\n                if (val !== 0 && val === Math.abs(board[i + 1][j]) && val === Math.abs(board[i + 2][j])) {\n                    board[i][j] = -val;\n                    board[i + 1][j] = -val;\n                    board[i + 2][j] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Crush and apply gravity\n        for (let j = 0; j < n; j++) {\n            let writePos = m - 1;\n            for (let i = m - 1; i >= 0; i--) {\n                if (board[i][j] > 0) {\n                    board[writePos][j] = board[i][j];\n                    if (writePos !== i) {\n                        board[i][j] = 0;\n                    }\n                    writePos--;\n                }\n            }\n            while (writePos >= 0) {\n                board[writePos][j] = 0;\n                writePos--;\n            }\n        }\n    }\n\n    return board;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15,
        16,
        17
      ],
      "scan_cols": [
        23,
        24,
        25
      ],
      "mark_col": [
        27,
        28,
        29,
        30
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        39
      ],
      "drop_col": [
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        47,
        48,
        49
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        26
      ],
      "stable_check": [
        6
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function candyCrush(board: number[][]): number[][] {\n    const m = board.length;\n    const n = board[0].length;\n\n    let shouldContinue = true;\n    while (shouldContinue) {\n        shouldContinue = false;\n\n        // Mark horizontal runs by negating values\n        for (let i = 0; i < m; i++) {\n            for (let j = 0; j < n - 2; j++) {\n                const val = Math.abs(board[i][j]);\n                if (val !== 0 && val === Math.abs(board[i][j + 1]) && val === Math.abs(board[i][j + 2])) {\n                    board[i][j] = -val;\n                    board[i][j + 1] = -val;\n                    board[i][j + 2] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Mark vertical runs by negating values\n        for (let i = 0; i < m - 2; i++) {\n            for (let j = 0; j < n; j++) {\n                const val = Math.abs(board[i][j]);\n                if (val !== 0 && val === Math.abs(board[i + 1][j]) && val === Math.abs(board[i + 2][j])) {\n                    board[i][j] = -val;\n                    board[i + 1][j] = -val;\n                    board[i + 2][j] = -val;\n                    shouldContinue = true;\n                }\n            }\n        }\n\n        // Crush and apply gravity\n        for (let j = 0; j < n; j++) {\n            let writePos = m - 1;\n            for (let i = m - 1; i >= 0; i--) {\n                if (board[i][j] > 0) {\n                    board[writePos][j] = board[i][j];\n                    if (writePos !== i) {\n                        board[i][j] = 0;\n                    }\n                    writePos--;\n                }\n            }\n            while (writePos >= 0) {\n                board[writePos][j] = 0;\n                writePos--;\n            }\n        }\n    }\n\n    return board;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        5
      ],
      "scan_rows": [
        10,
        11,
        12
      ],
      "mark_row": [
        14,
        15,
        16,
        17
      ],
      "scan_cols": [
        23,
        24,
        25
      ],
      "mark_col": [
        27,
        28,
        29,
        30
      ],
      "stable": [
        6
      ],
      "crush_cells": [
        39
      ],
      "drop_col": [
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        47,
        48,
        49
      ],
      "complete": [
        54
      ]
    },
    "conditionalMap": {
      "match_row": [
        13
      ],
      "match_col": [
        26
      ],
      "stable_check": [
        6
      ]
    }
  }
};

const CandyCrushPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "Cascade",
    "value": {
      "board": [
        [
          1,
          5,
          2
        ],
        [
          2,
          1,
          3
        ],
        [
          3,
          1,
          3
        ],
        [
          4,
          1,
          2
        ],
        [
          4,
          2,
          2
        ],
        [
          4,
          3,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "Run of 4 + T Shape",
    "value": {
      "board": [
        [
          3,
          3,
          3,
          3
        ],
        [
          1,
          3,
          2,
          4
        ],
        [
          2,
          3,
          1,
          2
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "Single Crush",
    "value": {
      "board": [
        [
          2,
          4,
          2
        ],
        [
          1,
          1,
          1
        ],
        [
          3,
          2,
          4
        ]
      ]
    }
  },
  {
    "id": "ex4",
    "label": "Already Stable",
    "value": {
      "board": [
        [
          1,
          2,
          3
        ],
        [
          3,
          1,
          2
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

function generateCandyCrushSteps(a: any): any[] {
  let e=a.board.map(a=>[...a]);if(0===e.length||0===e[0].length)return[];let r=e.length,i=e[0].length,o=[],l=0,n={};for(let a=0;a<r;a++){o.push([]);for(let r=0;r<i;r++)if(0!==e[a][r]){let t=l++;o[a][r]=t,n[`candy_${t}`]={type:"matrixElement",value:e[a][r],row:a,col:r}}else o[a][r]=-1}let s=new StepRecorder({},n);s.update_variable("m",r),s.update_variable("n",i),s.update_variable("round",0),s.update_variable("marks",0),s.update_variable("crushedTotal",0),s.update_variable("phase","start"),s.record("-","Start: crush all candies until the board is stable"),s.record("init",`${r} x ${i} board. Loop: mark matches by negating, then crush and drop`);let d=(a,r)=>{a.forEach(([a,t])=>{e[a][t]=-r,s.update_visual(`candy_${o[a][t]}`,{type:"matrixElement",value:-r,row:a,col:t,state:"marked"})})},c=0,u=0;for(;;){c++;let a=!1,t=0;s.update_variable("round",c),s.update_variable("marks",0),s.update_variable("phase","rows"),s.record("scan_rows",`Round ${c}: scan every row, comparing absolute values`);for(let o=0;o<r;o++)for(let r=0;r+2<i;r++){let i=Math.abs(e[o][r]);if(0!==i&&i===Math.abs(e[o][r+1])&&i===Math.abs(e[o][r+2])){let l=[e[o][r],e[o][r+1],e[o][r+2]];d([[o,r],[o,r+1],[o,r+2]],i),a=!0,t++,s.update_variable("marks",t),s.update_variable("wr",o),s.update_variable("wc",r),s.update_variable("wdir","row"),s.update_variable("wval",i),s.update_variable("wvals",l),s.add_conditional("match_row",!0),s.record("mark_row",`Row ${o}: |${i}| three times at columns ${r}..${r+2}, negate to ${-i}`)}}s.update_variable("phase","cols"),s.record("scan_cols",`Round ${c}: scan every column, comparing absolute values`);for(let o=0;o+2<r;o++)for(let r=0;r<i;r++){let i=Math.abs(e[o][r]);if(0!==i&&i===Math.abs(e[o+1][r])&&i===Math.abs(e[o+2][r])){let l=[e[o][r],e[o+1][r],e[o+2][r]];d([[o,r],[o+1,r],[o+2,r]],i),a=!0,t++,s.update_variable("marks",t),s.update_variable("wr",o),s.update_variable("wc",r),s.update_variable("wdir","col"),s.update_variable("wval",i),s.update_variable("wvals",l),s.add_conditional("match_col",!0),s.record("mark_col",`Column ${r}: |${i}| three times at rows ${o}..${o+2}, negate to ${-i}`)}}if(!a){s.update_variable("phase","stable"),s.add_conditional("stable_check",!0),s.record("stable",`Round ${c}: no matches found, the board is stable`);break}s.update_variable("phase","drop");for(let a=0;a<i;a++){let t=0,i=[];for(let l=r-1;l>=0;l--)e[l][a]>0?i.push({id:o[l][a],val:e[l][a]}):e[l][a]<0&&(t++,s.delete_visual(`candy_${o[l][a]}`));if(0===t)continue;let l=r-1;for(i.forEach(r=>{e[l][a]=r.val,o[l][a]=r.id,s.update_visual(`candy_${r.id}`,{type:"matrixElement",value:r.val,row:l,col:a}),l--});l>=0;)e[l][a]=0,o[l][a]=-1,l--;u+=t,s.update_variable("crushedTotal",u),s.update_variable("dropColJ",a),s.update_variable("crushed",t),s.add_conditional("stable_check",!1),s.record("drop_col",`Column ${a}: crush ${t} marked cell${1!==t?"s":""}, positives fall down`)}}return s.update_variable("phase","done"),s.update_variable("verdict","stable"),s.record("complete","Done! No more matches, the board is stable"),s.getSteps()
}

export function CandyCrushProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: CandyCrushTemplates,
      generateSteps: (a: any) => {
        const recorded = generateCandyCrushSteps(a) as any[];
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
      title="Candy Crush"
      slug="candy-crush"
      approaches={approaches}
      presets={CandyCrushPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Increment Submatrices by One (increment-submatrices-by-one)
// ==========================================

const IncrementSubmatricesByOneTemplates = {
  "python": {
    "language": "python",
    "code": "def rangeAddQueries(n, queries):\n    # Use (n+1) x (n+1) to avoid boundary checks\n    diff = [[0] * (n + 1) for _ in range(n + 1)]\n\n    # Mark four corners for each query\n    for r1, c1, r2, c2 in queries:\n        diff[r1][c1] += 1\n        diff[r1][c2 + 1] -= 1\n        diff[r2 + 1][c1] -= 1\n        diff[r2 + 1][c2 + 1] += 1\n\n    # Row-wise prefix sum\n    for r in range(n):\n        for c in range(1, n):\n            diff[r][c] += diff[r][c - 1]\n\n    # Column-wise prefix sum\n    for c in range(n):\n        for r in range(1, n):\n            diff[r][c] += diff[r - 1][c]\n\n    # Extract the n x n result\n    return [row[:n] for row in diff[:n]]",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        7,
        8,
        9,
        10
      ],
      "row_prefix": [
        15
      ],
      "col_prefix": [
        20
      ],
      "complete": [
        23
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] rangeAddQueries(int n, int[][] queries) {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    int[][] diff = new int[n + 1][n + 1];\n\n    // Mark four corners for each query\n    for (int[] q : queries) {\n        diff[q[0]][q[1]]++;\n        diff[q[0]][q[3] + 1]--;\n        diff[q[2] + 1][q[1]]--;\n        diff[q[2] + 1][q[3] + 1]++;\n    }\n\n    // Row-wise prefix sum\n    for (int r = 0; r < n; r++) {\n        for (int c = 1; c < n; c++) {\n            diff[r][c] += diff[r][c - 1];\n        }\n    }\n\n    // Column-wise prefix sum\n    for (int c = 0; c < n; c++) {\n        for (int r = 1; r < n; r++) {\n            diff[r][c] += diff[r - 1][c];\n        }\n    }\n\n    // Extract the n x n result\n    int[][] mat = new int[n][n];\n    for (int r = 0; r < n; r++) {\n        for (int c = 0; c < n; c++) {\n            mat[r][c] = diff[r][c];\n        }\n    }\n\n    return mat;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        7,
        8,
        9,
        10
      ],
      "row_prefix": [
        16
      ],
      "col_prefix": [
        23
      ],
      "complete": [
        35
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> rangeAddQueries(int n, vector<vector<int>>& queries) {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    vector<vector<int>> diff(n + 1, vector<int>(n + 1, 0));\n\n    // Mark four corners for each query\n    for (auto& q : queries) {\n        diff[q[0]][q[1]]++;\n        diff[q[0]][q[3] + 1]--;\n        diff[q[2] + 1][q[1]]--;\n        diff[q[2] + 1][q[3] + 1]++;\n    }\n\n    // Row-wise prefix sum\n    for (int r = 0; r < n; r++) {\n        for (int c = 1; c < n; c++) {\n            diff[r][c] += diff[r][c - 1];\n        }\n    }\n\n    // Column-wise prefix sum\n    for (int c = 0; c < n; c++) {\n        for (int r = 1; r < n; r++) {\n            diff[r][c] += diff[r - 1][c];\n        }\n    }\n\n    // Extract the n x n result\n    vector<vector<int>> mat(n, vector<int>(n));\n    for (int r = 0; r < n; r++) {\n        for (int c = 0; c < n; c++) {\n            mat[r][c] = diff[r][c];\n        }\n    }\n\n    return mat;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        7,
        8,
        9,
        10
      ],
      "row_prefix": [
        16
      ],
      "col_prefix": [
        23
      ],
      "complete": [
        35
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] RangeAddQueries(int n, int[][] queries) {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    int[][] diff = new int[n + 1][];\n    for (int i = 0; i <= n; i++) {\n        diff[i] = new int[n + 1];\n    }\n\n    // Mark four corners for each query\n    foreach (int[] q in queries) {\n        diff[q[0]][q[1]]++;\n        diff[q[0]][q[3] + 1]--;\n        diff[q[2] + 1][q[1]]--;\n        diff[q[2] + 1][q[3] + 1]++;\n    }\n\n    // Row-wise prefix sum\n    for (int r = 0; r < n; r++) {\n        for (int c = 1; c < n; c++) {\n            diff[r][c] += diff[r][c - 1];\n        }\n    }\n\n    // Column-wise prefix sum\n    for (int c = 0; c < n; c++) {\n        for (int r = 1; r < n; r++) {\n            diff[r][c] += diff[r - 1][c];\n        }\n    }\n\n    // Extract the n x n result\n    int[][] mat = new int[n][];\n    for (int r = 0; r < n; r++) {\n        mat[r] = new int[n];\n        for (int c = 0; c < n; c++) {\n            mat[r][c] = diff[r][c];\n        }\n    }\n\n    return mat;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        10,
        11,
        12,
        13
      ],
      "row_prefix": [
        19
      ],
      "col_prefix": [
        26
      ],
      "complete": [
        39
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func rangeAddQueries(n int, queries [][]int) [][]int {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    diff := make([][]int, n+1)\n    for i := range diff {\n        diff[i] = make([]int, n+1)\n    }\n\n    // Mark four corners for each query\n    for _, q := range queries {\n        diff[q[0]][q[1]]++\n        diff[q[0]][q[3]+1]--\n        diff[q[2]+1][q[1]]--\n        diff[q[2]+1][q[3]+1]++\n    }\n\n    // Row-wise prefix sum\n    for r := 0; r < n; r++ {\n        for c := 1; c < n; c++ {\n            diff[r][c] += diff[r][c-1]\n        }\n    }\n\n    // Column-wise prefix sum\n    for c := 0; c < n; c++ {\n        for r := 1; r < n; r++ {\n            diff[r][c] += diff[r-1][c]\n        }\n    }\n\n    // Extract the n x n result\n    mat := make([][]int, n)\n    for r := 0; r < n; r++ {\n        mat[r] = make([]int, n)\n        for c := 0; c < n; c++ {\n            mat[r][c] = diff[r][c]\n        }\n    }\n\n    return mat\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        10,
        11,
        12,
        13
      ],
      "row_prefix": [
        19
      ],
      "col_prefix": [
        26
      ],
      "complete": [
        39
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function rangeAddQueries(n, queries) {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    var diff = Array.from({length: n + 1}, () => new Array(n + 1).fill(0));\n\n    // Mark four corners for each query\n    for (var q of queries) {\n        diff[q[0]][q[1]]++;\n        diff[q[0]][q[3] + 1]--;\n        diff[q[2] + 1][q[1]]--;\n        diff[q[2] + 1][q[3] + 1]++;\n    }\n\n    // Row-wise prefix sum\n    for (var r = 0; r < n; r++) {\n        for (var c = 1; c < n; c++) {\n            diff[r][c] += diff[r][c - 1];\n        }\n    }\n\n    // Column-wise prefix sum\n    for (var c = 0; c < n; c++) {\n        for (var r = 1; r < n; r++) {\n            diff[r][c] += diff[r - 1][c];\n        }\n    }\n\n    // Extract the n x n result\n    var mat = Array.from({length: n}, () => new Array(n));\n    for (var r = 0; r < n; r++) {\n        for (var c = 0; c < n; c++) {\n            mat[r][c] = diff[r][c];\n        }\n    }\n\n    return mat;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        7,
        8,
        9,
        10
      ],
      "row_prefix": [
        16
      ],
      "col_prefix": [
        23
      ],
      "complete": [
        35
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function rangeAddQueries(n: number, queries: number[][]): number[][] {\n    // Use (n+1) x (n+1) to avoid boundary checks\n    const diff: number[][] = Array.from({length: n + 1}, () => new Array(n + 1).fill(0));\n\n    // Mark four corners for each query\n    for (const q of queries) {\n        diff[q[0]][q[1]]++;\n        diff[q[0]][q[3] + 1]--;\n        diff[q[2] + 1][q[1]]--;\n        diff[q[2] + 1][q[3] + 1]++;\n    }\n\n    // Row-wise prefix sum\n    for (let r = 0; r < n; r++) {\n        for (let c = 1; c < n; c++) {\n            diff[r][c] += diff[r][c - 1];\n        }\n    }\n\n    // Column-wise prefix sum\n    for (let c = 0; c < n; c++) {\n        for (let r = 1; r < n; r++) {\n            diff[r][c] += diff[r - 1][c];\n        }\n    }\n\n    // Extract the n x n result\n    const mat: number[][] = Array.from({length: n}, () => new Array(n));\n    for (let r = 0; r < n; r++) {\n        for (let c = 0; c < n; c++) {\n            mat[r][c] = diff[r][c];\n        }\n    }\n\n    return mat;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "mark_corners": [
        7,
        8,
        9,
        10
      ],
      "row_prefix": [
        16
      ],
      "col_prefix": [
        23
      ],
      "complete": [
        35
      ]
    }
  }
};

const IncrementSubmatricesByOnePresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3×3, 2 queries",
    "value": {
      "n": 3,
      "queries": [
        [
          1,
          1,
          2,
          2
        ],
        [
          0,
          0,
          1,
          1
        ]
      ]
    }
  },
  {
    "id": "ex2",
    "label": "4×4, 3 queries",
    "value": {
      "n": 4,
      "queries": [
        [
          0,
          0,
          2,
          2
        ],
        [
          1,
          1,
          3,
          3
        ],
        [
          0,
          0,
          3,
          3
        ]
      ]
    }
  },
  {
    "id": "ex3",
    "label": "3×3, same query",
    "value": {
      "n": 3,
      "queries": [
        [
          0,
          0,
          2,
          2
        ],
        [
          0,
          0,
          2,
          2
        ]
      ]
    }
  }
];

function generateIncrementSubmatricesByOneSteps(e: any): any[] {
  let r=e.n,t=e.queries.map(e=>[...e]),i=Array.from({length:r+1},()=>Array(r+1).fill(0)),a={};for(let e=0;e<=r;e++)for(let t=0;t<=r;t++)a[`cell_${e}_${t}`]={type:"matrixElement",value:0,row:e,col:t};let l=new StepRecorder({phase:"start",n:r,queries:t,qi:-1,r1:0,c1:0,r2:0,c2:0,rowIdx:-1,colIdx:-1},a);l.record("-",`Start: ${r} x ${r} grid of zeros, ${t.length} ${1===t.length?"query":"queries"} to apply via a 2D difference array`);let o=(e,r)=>{l.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:i[e][r],row:e,col:r})};for(let e=0;e<t.length;e++){let[r,n,a,c]=t[e];i[r][n]++,i[r][c+1]--,i[a+1][n]--,i[a+1][c+1]++,l.update_variable("phase","mark"),l.update_variable("qi",e),l.update_variable("r1",r),l.update_variable("c1",n),l.update_variable("r2",a),l.update_variable("c2",c),o(r,n),o(r,c+1),o(a+1,n),o(a+1,c+1),l.record("mark_corners",`Query ${e+1} [${r},${n},${a},${c}]: +1 at (${r},${n}) and (${a+1},${c+1}), -1 at (${r},${c+1}) and (${a+1},${n})`)}for(let e=0;e<r;e++){for(let t=1;t<r;t++)i[e][t]+=i[e][t-1],o(e,t);l.update_variable("phase","row"),l.update_variable("rowIdx",e),l.record("row_prefix",`Row ${e}: running sum left to right spreads each +1/-1 across the row`)}for(let e=0;e<r;e++){for(let t=1;t<r;t++)i[t][e]+=i[t-1][e],o(t,e);l.update_variable("phase","col"),l.update_variable("colIdx",e),l.record("col_prefix",`Column ${e}: running sum top to bottom completes the rectangle fills`)}return l.update_variable("phase","done"),l.record("complete","Done: each cell counts exactly the queries whose rectangle covers it"),l.getSteps()
}

export function IncrementSubmatricesByOneProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: IncrementSubmatricesByOneTemplates,
      generateSteps: (e: any) => {
        const recorded = generateIncrementSubmatricesByOneSteps(e) as any[];
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
      title="Increment Submatrices by One"
      slug="increment-submatrices-by-one"
      approaches={approaches}
      presets={IncrementSubmatricesByOnePresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}

// ==========================================
// Spiral Matrix II (spiral-matrix-ii)
// ==========================================

const SpiralMatrixIiTemplates = {
  "python": {
    "language": "python",
    "code": "def generateMatrix(n):\n    matrix = [[0] * n for _ in range(n)]\n    top, bottom, left, right = 0, n - 1, 0, n - 1\n    num = 1\n\n    while num <= n * n:\n        # Fill top row: left to right\n        for col in range(left, right + 1):\n            matrix[top][col] = num\n            num += 1\n        top += 1\n\n        # Fill right column: top to bottom\n        for row in range(top, bottom + 1):\n            matrix[row][right] = num\n            num += 1\n        right -= 1\n\n        # Fill bottom row: right to left\n        for col in range(right, left - 1, -1):\n            matrix[bottom][col] = num\n            num += 1\n        bottom -= 1\n\n        # Fill left column: bottom to top\n        for row in range(bottom, top - 1, -1):\n            matrix[row][left] = num\n            num += 1\n        left += 1\n\n    return matrix",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "fill_right": [
        9,
        10
      ],
      "increment_top": [
        11
      ],
      "fill_down": [
        15,
        16
      ],
      "decrement_right": [
        17
      ],
      "fill_left": [
        21,
        22
      ],
      "decrement_bottom": [
        23
      ],
      "fill_up": [
        27,
        28
      ],
      "increment_left": [
        29
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "traverse_left": [
        20
      ],
      "traverse_up": [
        26
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] generateMatrix(int n) {\n    int[][] matrix = new int[n][n];\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n\n    while (num <= n * n) {\n        // Fill top row: left to right\n        for (int col = left; col <= right; col++) {\n            matrix[top][col] = num++;\n        }\n        top++;\n\n        // Fill right column: top to bottom\n        for (int row = top; row <= bottom; row++) {\n            matrix[row][right] = num++;\n        }\n        right--;\n\n        // Fill bottom row: right to left\n        for (int col = right; col >= left; col--) {\n            matrix[bottom][col] = num++;\n        }\n        bottom--;\n\n        // Fill left column: bottom to top\n        for (int row = bottom; row >= top; row--) {\n            matrix[row][left] = num++;\n        }\n        left++;\n    }\n\n    return matrix;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "fill_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "fill_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "fill_left": [
        21
      ],
      "decrement_bottom": [
        23
      ],
      "fill_up": [
        27
      ],
      "increment_left": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "traverse_left": [
        20
      ],
      "traverse_up": [
        26
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> generateMatrix(int n) {\n    vector<vector<int>> matrix(n, vector<int>(n, 0));\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n\n    while (num <= n * n) {\n        // Fill top row: left to right\n        for (int col = left; col <= right; col++) {\n            matrix[top][col] = num++;\n        }\n        top++;\n\n        // Fill right column: top to bottom\n        for (int row = top; row <= bottom; row++) {\n            matrix[row][right] = num++;\n        }\n        right--;\n\n        // Fill bottom row: right to left\n        for (int col = right; col >= left; col--) {\n            matrix[bottom][col] = num++;\n        }\n        bottom--;\n\n        // Fill left column: bottom to top\n        for (int row = bottom; row >= top; row--) {\n            matrix[row][left] = num++;\n        }\n        left++;\n    }\n\n    return matrix;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "fill_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "fill_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "fill_left": [
        21
      ],
      "decrement_bottom": [
        23
      ],
      "fill_up": [
        27
      ],
      "increment_left": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "traverse_left": [
        20
      ],
      "traverse_up": [
        26
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] GenerateMatrix(int n) {\n    int[][] matrix = new int[n][];\n    for (int i = 0; i < n; i++) {\n        matrix[i] = new int[n];\n    }\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n\n    while (num <= n * n) {\n        // Fill top row: left to right\n        for (int col = left; col <= right; col++) {\n            matrix[top][col] = num++;\n        }\n        top++;\n\n        // Fill right column: top to bottom\n        for (int row = top; row <= bottom; row++) {\n            matrix[row][right] = num++;\n        }\n        right--;\n\n        // Fill bottom row: right to left\n        for (int col = right; col >= left; col--) {\n            matrix[bottom][col] = num++;\n        }\n        bottom--;\n\n        // Fill left column: bottom to top\n        for (int row = bottom; row >= top; row--) {\n            matrix[row][left] = num++;\n        }\n        left++;\n    }\n\n    return matrix;\n}",
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
      "loop_start": [
        9
      ],
      "fill_right": [
        12
      ],
      "increment_top": [
        14
      ],
      "fill_down": [
        18
      ],
      "decrement_right": [
        20
      ],
      "fill_left": [
        24
      ],
      "decrement_bottom": [
        26
      ],
      "fill_up": [
        30
      ],
      "increment_left": [
        32
      ],
      "complete": [
        35
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "traverse_right": [
        11
      ],
      "traverse_down": [
        17
      ],
      "traverse_left": [
        23
      ],
      "traverse_up": [
        29
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func generateMatrix(n int) [][]int {\n    matrix := make([][]int, n)\n    for i := range matrix {\n        matrix[i] = make([]int, n)\n    }\n    top, bottom, left, right := 0, n-1, 0, n-1\n    num := 1\n\n    for num <= n*n {\n        // Fill top row: left to right\n        for col := left; col <= right; col++ {\n            matrix[top][col] = num\n            num++\n        }\n        top++\n\n        // Fill right column: top to bottom\n        for row := top; row <= bottom; row++ {\n            matrix[row][right] = num\n            num++\n        }\n        right--\n\n        // Fill bottom row: right to left\n        for col := right; col >= left; col-- {\n            matrix[bottom][col] = num\n            num++\n        }\n        bottom--\n\n        // Fill left column: bottom to top\n        for row := bottom; row >= top; row-- {\n            matrix[row][left] = num\n            num++\n        }\n        left++\n    }\n\n    return matrix\n}",
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
      "loop_start": [
        9
      ],
      "fill_right": [
        12,
        13
      ],
      "increment_top": [
        15
      ],
      "fill_down": [
        19,
        20
      ],
      "decrement_right": [
        22
      ],
      "fill_left": [
        26,
        27
      ],
      "decrement_bottom": [
        29
      ],
      "fill_up": [
        33,
        34
      ],
      "increment_left": [
        36
      ],
      "complete": [
        39
      ]
    },
    "conditionalMap": {
      "while_loop": [
        9
      ],
      "traverse_right": [
        11
      ],
      "traverse_down": [
        18
      ],
      "traverse_left": [
        25
      ],
      "traverse_up": [
        32
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "function generateMatrix(n) {\n    const matrix = Array.from({length: n}, function() { return new Array(n).fill(0); });\n    let top = 0, bottom = n - 1, left = 0, right = n - 1;\n    let num = 1;\n\n    while (num <= n * n) {\n        // Fill top row: left to right\n        for (let col = left; col <= right; col++) {\n            matrix[top][col] = num++;\n        }\n        top++;\n\n        // Fill right column: top to bottom\n        for (let row = top; row <= bottom; row++) {\n            matrix[row][right] = num++;\n        }\n        right--;\n\n        // Fill bottom row: right to left\n        for (let col = right; col >= left; col--) {\n            matrix[bottom][col] = num++;\n        }\n        bottom--;\n\n        // Fill left column: bottom to top\n        for (let row = bottom; row >= top; row--) {\n            matrix[row][left] = num++;\n        }\n        left++;\n    }\n\n    return matrix;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "fill_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "fill_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "fill_left": [
        21
      ],
      "decrement_bottom": [
        23
      ],
      "fill_up": [
        27
      ],
      "increment_left": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "traverse_left": [
        20
      ],
      "traverse_up": [
        26
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function generateMatrix(n: number): number[][] {\n    const matrix: number[][] = Array.from({length: n}, () => new Array(n).fill(0));\n    let top = 0, bottom = n - 1, left = 0, right = n - 1;\n    let num = 1;\n\n    while (num <= n * n) {\n        // Fill top row: left to right\n        for (let col = left; col <= right; col++) {\n            matrix[top][col] = num++;\n        }\n        top++;\n\n        // Fill right column: top to bottom\n        for (let row = top; row <= bottom; row++) {\n            matrix[row][right] = num++;\n        }\n        right--;\n\n        // Fill bottom row: right to left\n        for (let col = right; col >= left; col--) {\n            matrix[bottom][col] = num++;\n        }\n        bottom--;\n\n        // Fill left column: bottom to top\n        for (let row = bottom; row >= top; row--) {\n            matrix[row][left] = num++;\n        }\n        left++;\n    }\n\n    return matrix;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init_bounds": [
        2,
        3,
        4
      ],
      "loop_start": [
        6
      ],
      "fill_right": [
        9
      ],
      "increment_top": [
        11
      ],
      "fill_down": [
        15
      ],
      "decrement_right": [
        17
      ],
      "fill_left": [
        21
      ],
      "decrement_bottom": [
        23
      ],
      "fill_up": [
        27
      ],
      "increment_left": [
        29
      ],
      "complete": [
        32
      ]
    },
    "conditionalMap": {
      "while_loop": [
        6
      ],
      "traverse_right": [
        8
      ],
      "traverse_down": [
        14
      ],
      "traverse_left": [
        20
      ],
      "traverse_up": [
        26
      ]
    }
  }
};

const SpiralMatrixIiPresets: PresetOption<any>[] = [
  {
    "id": "ex1",
    "label": "3×3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex2",
    "label": "4×4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex3",
    "label": "5×5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex4",
    "label": "1×1",
    "value": {
      "n": 1
    }
  },
  {
    "id": "ex5",
    "label": "2×2",
    "value": {
      "n": 2
    }
  }
];

function generateSpiralMatrixIiSteps(t: any): any[] {
  let e=t.n;if(e<=0)return[];let r={};for(let t=0;t<e;t++)for(let i=0;i<e;i++)r[`cell_${t}_${i}`]={type:"matrixElement",value:"",row:t,col:i,state:"muted"};let n=0,l=e-1,o=0,a=e-1,c=1,s=new StepRecorder({n:e},{...r});s.record("-",`Generate ${e}\xd7${e} spiral matrix`),s.update_variable("top",n),s.update_variable("bottom",l),s.update_variable("left",o),s.update_variable("right",a),s.update_variable("num",c),s.add_new_visual("boundary_top",{type:"2DPointer",label:"top",row:n,col:-1}),s.add_new_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:l,col:-1}),s.add_new_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:0}),s.add_new_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:e-1}),s.record("init_bounds",`Initialize boundaries: top=${n}, bottom=${l}, left=${o}, right=${a}, num=${c}`);let d=Array.from({length:e},()=>Array(e).fill(0)),u=null,f=()=>{if(u){let[t,e,r]=u;s.update_visual(`cell_${t}_${e}`,{type:"matrixElement",value:r,row:t,col:e,state:"visited"}),u=null}},m=(t,e,r,i)=>{f();let n=c;d[t][e]=n,s.update_visual(`cell_${t}_${e}`,{type:"matrixElement",value:n,row:t,col:e,state:"active"}),c++,s.update_variable("num",c),u=[t,e,n],s.record(r,`Fill ${i}: matrix[${t}][${e}] = ${n}`)};for(;c<=e*e;){s.add_conditional("while_loop",!0),s.record("loop_start",`Check: num(${c}) <= n*n(${e*e})`),s.update_variable("dir","right");for(let t=o;t<=a;t++)s.add_conditional("traverse_right",!0),m(n,t,"fill_right","right");s.add_conditional("traverse_right",!1),n++,f(),s.update_variable("top",n),s.update_visual("boundary_top",{type:"2DPointer",label:"top",row:n,col:-1}),s.record("increment_top",`Move top boundary down: top = ${n}`),s.update_variable("dir","down");for(let t=n;t<=l;t++)s.add_conditional("traverse_down",!0),m(t,a,"fill_down","down");s.add_conditional("traverse_down",!1),a--,f(),s.update_variable("right",a),s.update_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:a}),s.record("decrement_right",`Move right boundary left: right = ${a}`),s.update_variable("dir","left");for(let t=a;t>=o;t--)s.add_conditional("traverse_left",!0),m(l,t,"fill_left","left");s.add_conditional("traverse_left",!1),l--,f(),s.update_variable("bottom",l),s.update_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:l,col:-1}),s.record("decrement_bottom",`Move bottom boundary up: bottom = ${l}`),s.update_variable("dir","up");for(let t=l;t>=n;t--)s.add_conditional("traverse_up",!0),m(t,o,"fill_up","up");s.add_conditional("traverse_up",!1),o++,f(),s.update_variable("left",o),s.update_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:o}),s.record("increment_left",`Move left boundary right: left = ${o}`)}s.add_conditional("while_loop",!1),s.delete_variable("dir"),s.delete_visual("boundary_top"),s.delete_visual("boundary_bottom"),s.delete_visual("boundary_left"),s.delete_visual("boundary_right");for(let t=0;t<e;t++)for(let r=0;r<e;r++)s.update_visual(`cell_${t}_${r}`,{type:"matrixElement",value:d[t][r],row:t,col:r,state:"found"});return s.record("complete",`Spiral matrix generation complete: filled 1..${e*e}`),s.getSteps()
}

export function SpiralMatrixIiProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SpiralMatrixIiTemplates,
      generateSteps: (t: any) => {
        const recorded = generateSpiralMatrixIiSteps(t) as any[];
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
      title="Spiral Matrix II"
      slug="spiral-matrix-ii"
      approaches={approaches}
      presets={SpiralMatrixIiPresets}
      formatInputDisplay={formatGenericInput}
    />
  );
}
