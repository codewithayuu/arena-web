// @ts-nocheck
"use client";

import React from "react";
import {
  ProblemViewerShell,
  ProblemApproach,
  ProblemStep,
} from "../problem-viewer-shell";
import { PresetOption } from "../input-presets-panel";
import { PatternGridVisualizer, PatternCell } from "../pattern-grid-visualizer";
import { StepRecorder } from "../recorder";

function cellsFromVisualState(visualState: Record<string, any>): { cells: PatternCell[]; activeRow: number } {
  const cells: PatternCell[] = [];
  let activeRow = -1;

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;
    if (item.type === "matrixElement") {
      cells.push({
        row: item.row,
        col: item.col,
        value: String(item.value ?? ""),
        state: item.state || "pending",
      });
    } else if (item.type === "2DPointer" && item.label === "i") {
      activeRow = item.row;
    }
  }

  return { cells, activeRow };
}

// ==========================================
// Pyramid of Stars (pyramid-of-stars)
// ==========================================

const PyramidOfStarsTemplates = {
  "python": {
    "language": "python",
    "code": "def pyramid_of_stars(n):\n    result = []\n\n    # Row i: (n - i) spaces, then (2i - 1) stars\n    for i in range(1, n + 1):\n        row = \"\"\n\n        for s in range(n - i):\n            row += \" \"\n\n        for s in range(2 * i - 1):\n            row += \"*\"\n\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        11,
        12
      ],
      "row_done": [
        14
      ],
      "complete": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> pyramidOfStars(int n) {\n    List<String> result = new ArrayList<>();\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int s = 0; s < n - i; s++) {\n            row.append(' ');\n        }\n\n        for (int s = 0; s < 2 * i - 1; s++) {\n            row.append('*');\n        }\n\n        result.add(row.toString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> pyramidOfStars(int n) {\n    vector<string> result;\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for (int i = 1; i <= n; i++) {\n        string row;\n\n        for (int s = 0; s < n - i; s++) {\n            row += ' ';\n        }\n\n        for (int s = 0; s < 2 * i - 1; s++) {\n            row += '*';\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> PyramidOfStars(int n) {\n    List<string> result = new List<string>();\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int s = 0; s < n - i; s++) {\n            row.Append(' ');\n        }\n\n        for (int s = 0; s < 2 * i - 1; s++) {\n            row.Append('*');\n        }\n\n        result.Add(row.ToString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func pyramidOfStars(n int) []string {\n    result := make([]string, 0, n)\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for i := 1; i <= n; i++ {\n        row := \"\"\n\n        for s := 0; s < n-i; s++ {\n            row += \" \"\n        }\n\n        for s := 0; s < 2*i-1; s++ {\n            row += \"*\"\n        }\n\n        result = append(result, row)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var pyramidOfStars = function(n) {\n    const result = [];\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let s = 0; s < n - i; s++) {\n            row += \" \";\n        }\n\n        for (let s = 0; s < 2 * i - 1; s++) {\n            row += \"*\";\n        }\n\n        result.push(row);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function pyramidOfStars(n: number): string[] {\n    const result: string[] = [];\n\n    // Row i: (n - i) spaces, then (2i - 1) stars\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let s = 0; s < n - i; s++) {\n            row += \" \";\n        }\n\n        for (let s = 0; s < 2 * i - 1; s++) {\n            row += \"*\";\n        }\n\n        result.push(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  }
};

const PyramidOfStarsPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  }
];

function generatePyramidOfStarsSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r={};for(let e=0;e<t;e++){let n=t-(e+1),i=2*(e+1)-1;for(let t=0;t<n+i;t++)r[`cell_${e}_${t}`]={type:"matrixElement",value:t<n?"\xb7":"*",row:e,col:t,state:"pending"}}let i=new StepRecorder({n:t,i:void 0,s:void 0,row:void 0},r);i.record("-",`Start: print a pyramid with ${t} rows.`);for(let e=1;e<=t;e++){let r=e-1,n=t-e,s=2*e-1;i.update_variable("i",e),i.update_variable("s",void 0),i.update_variable("row",""),i.update_visual("ptr_i",{type:"2DPointer",row:r,col:-1,label:"i"}),i.record("row_start",`Row ${e}: start with an empty row.`);let a="",l=-1,o=!1;for(let t=0;t<n;t++)a+=" ",i.update_variable("s",t),i.update_variable("row",a),l>=0&&i.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:o?"*":"\xb7",row:r,col:l,state:o?"printed":"space"}),i.update_visual(`cell_${r}_${t}`,{type:"matrixElement",value:"\xb7",row:r,col:t,state:"active"}),l=t,o=!1,i.record("print_space",`Print space ${t+1} of ${n} for row ${e}.`);for(let t=0;t<s;t++){a+="*",i.update_variable("s",t),i.update_variable("row",a),l>=0&&i.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:o?"*":"\xb7",row:r,col:l,state:o?"printed":"space"});let u=n+t;i.update_visual(`cell_${r}_${u}`,{type:"matrixElement",value:"*",row:r,col:u,state:"active"}),l=u,o=!0,i.record("print_star",`Append star ${t+1} of ${s} to row ${e}.`)}for(let e=0;e<n;e++)i.update_visual(`cell_${r}_${e}`,{type:"matrixElement",value:"\xb7",row:r,col:e,state:"space"});for(let e=n;e<n+s;e++)i.update_visual(`cell_${r}_${e}`,{type:"matrixElement",value:"*",row:r,col:e,state:"done"});i.record("row_done",`Row ${e} is complete: add "${a}" to the result.`)}return i.delete_visual("ptr_i"),i.update_variable("s",void 0),i.record("complete",`All ${t} rows printed. The pyramid is complete.`),i.getSteps()
}

export function PyramidOfStarsProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: PyramidOfStarsTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generatePyramidOfStarsSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Pyramid of Stars"
      slug="pyramid-of-stars"
      approaches={approaches}
      presets={PyramidOfStarsPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Inverted Pyramid (inverted-pyramid)
// ==========================================

const InvertedPyramidTemplates = {
  "python": {
    "language": "python",
    "code": "def inverted_pyramid(n):\n    result = []\n\n    # Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for i in range(1, n + 1):\n        row = \"\"\n\n        for s in range(i - 1):\n            row += \" \"\n\n        for s in range(2 * (n - i) + 1):\n            row += \"*\"\n\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        11,
        12
      ],
      "row_done": [
        14
      ],
      "complete": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> invertedPyramid(int n) {\n    List<String> result = new ArrayList<>();\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int s = 0; s < i - 1; s++) {\n            row.append(' ');\n        }\n\n        for (int s = 0; s < 2 * (n - i) + 1; s++) {\n            row.append('*');\n        }\n\n        result.add(row.toString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> invertedPyramid(int n) {\n    vector<string> result;\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for (int i = 1; i <= n; i++) {\n        string row;\n\n        for (int s = 0; s < i - 1; s++) {\n            row += ' ';\n        }\n\n        for (int s = 0; s < 2 * (n - i) + 1; s++) {\n            row += '*';\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> InvertedPyramid(int n) {\n    List<string> result = new List<string>();\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int s = 0; s < i - 1; s++) {\n            row.Append(' ');\n        }\n\n        for (int s = 0; s < 2 * (n - i) + 1; s++) {\n            row.Append('*');\n        }\n\n        result.Add(row.ToString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func invertedPyramid(n int) []string {\n    result := make([]string, 0, n)\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for i := 1; i <= n; i++ {\n        row := \"\"\n\n        for s := 0; s < i-1; s++ {\n            row += \" \"\n        }\n\n        for s := 0; s < 2*(n-i)+1; s++ {\n            row += \"*\"\n        }\n\n        result = append(result, row)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var invertedPyramid = function(n) {\n    const result = [];\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let s = 0; s < i - 1; s++) {\n            row += \" \";\n        }\n\n        for (let s = 0; s < 2 * (n - i) + 1; s++) {\n            row += \"*\";\n        }\n\n        result.push(row);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function invertedPyramid(n: number): string[] {\n    const result: string[] = [];\n\n    // Row i: (i - 1) spaces, then 2(n - i) + 1 stars\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let s = 0; s < i - 1; s++) {\n            row += \" \";\n        }\n\n        for (let s = 0; s < 2 * (n - i) + 1; s++) {\n            row += \"*\";\n        }\n\n        result.push(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_space": [
        8,
        9
      ],
      "print_star": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  }
};

const InvertedPyramidPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  }
];

function generateInvertedPyramidSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r={};for(let e=0;e<t;e++){let n=e,i=2*(t-(e+1))+1;for(let t=0;t<n+i;t++)r[`cell_${e}_${t}`]={type:"matrixElement",value:t<n?"\xb7":"*",row:e,col:t,state:"pending"}}let i=new StepRecorder({n:t,i:void 0,s:void 0,row:void 0},r);i.record("-",`Start: print an inverted pyramid with ${t} rows.`);for(let e=1;e<=t;e++){let r=e-1,n=e-1,s=2*(t-e)+1;i.update_variable("i",e),i.update_variable("s",void 0),i.update_variable("row",""),i.update_visual("ptr_i",{type:"2DPointer",row:r,col:-1,label:"i"}),i.record("row_start",`Row ${e}: start with an empty row.`);let a="",l=-1,o=!1;for(let t=0;t<n;t++)a+=" ",i.update_variable("s",t),i.update_variable("row",a),l>=0&&i.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:o?"*":"\xb7",row:r,col:l,state:o?"printed":"space"}),i.update_visual(`cell_${r}_${t}`,{type:"matrixElement",value:"\xb7",row:r,col:t,state:"active"}),l=t,o=!1,i.record("print_space",`Print space ${t+1} of ${n} for row ${e}.`);for(let t=0;t<s;t++){a+="*",i.update_variable("s",t),i.update_variable("row",a),l>=0&&i.update_visual(`cell_${r}_${l}`,{type:"matrixElement",value:o?"*":"\xb7",row:r,col:l,state:o?"printed":"space"});let u=n+t;i.update_visual(`cell_${r}_${u}`,{type:"matrixElement",value:"*",row:r,col:u,state:"active"}),l=u,o=!0,i.record("print_star",`Append star ${t+1} of ${s} to row ${e}.`)}for(let e=0;e<n;e++)i.update_visual(`cell_${r}_${e}`,{type:"matrixElement",value:"\xb7",row:r,col:e,state:"space"});for(let e=n;e<n+s;e++)i.update_visual(`cell_${r}_${e}`,{type:"matrixElement",value:"*",row:r,col:e,state:"done"});i.record("row_done",`Row ${e} is complete: add "${a}" to the result.`)}return i.delete_visual("ptr_i"),i.update_variable("s",void 0),i.record("complete",`All ${t} rows printed. The inverted pyramid is complete.`),i.getSteps()
}

export function InvertedPyramidProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: InvertedPyramidTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateInvertedPyramidSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Inverted Pyramid"
      slug="inverted-pyramid"
      approaches={approaches}
      presets={InvertedPyramidPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Hollow Square (hollow-square)
// ==========================================

const HollowSquareTemplates = {
  "python": {
    "language": "python",
    "code": "def hollow_square(n):\n    result = []\n\n    for row in range(n):\n        line = []\n\n        for col in range(n):\n            # A cell is a star only on the outer frame\n            if row == 0 or row == n - 1 or col == 0 or col == n - 1:\n                line.append('*')\n            else:\n                line.append(' ')\n\n        result.append(''.join(line))\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> hollowSquare(int n) {\n    List<String> result = new ArrayList<>();\n\n    for (int row = 0; row < n; row++) {\n        StringBuilder line = new StringBuilder();\n\n        for (int col = 0; col < n; col++) {\n            // A cell is a star only on the outer frame\n            if (row == 0 || row == n - 1 || col == 0 || col == n - 1) {\n                line.append('*');\n            } else {\n                line.append(' ');\n            }\n        }\n\n        result.add(line.toString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> hollowSquare(int n) {\n    vector<string> result;\n\n    for (int row = 0; row < n; row++) {\n        string line;\n\n        for (int col = 0; col < n; col++) {\n            // A cell is a star only on the outer frame\n            if (row == 0 || row == n - 1 || col == 0 || col == n - 1) {\n                line += '*';\n            } else {\n                line += ' ';\n            }\n        }\n\n        result.push_back(line);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> HollowSquare(int n) {\n    List<string> result = new List<string>();\n\n    for (int row = 0; row < n; row++) {\n        StringBuilder line = new StringBuilder();\n\n        for (int col = 0; col < n; col++) {\n            // A cell is a star only on the outer frame\n            if (row == 0 || row == n - 1 || col == 0 || col == n - 1) {\n                line.Append('*');\n            } else {\n                line.Append(' ');\n            }\n        }\n\n        result.Add(line.ToString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func hollowSquare(n int) []string {\n    result := make([]string, 0, n)\n\n    for row := 0; row < n; row++ {\n        line := make([]byte, 0, n)\n\n        for col := 0; col < n; col++ {\n            // A cell is a star only on the outer frame\n            if row == 0 || row == n-1 || col == 0 || col == n-1 {\n                line = append(line, '*')\n            } else {\n                line = append(line, ' ')\n            }\n        }\n\n        result = append(result, string(line))\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var hollowSquare = function(n) {\n    const result = [];\n\n    for (let row = 0; row < n; row++) {\n        let line = \"\";\n\n        for (let col = 0; col < n; col++) {\n            // A cell is a star only on the outer frame\n            if (row === 0 || row === n - 1 || col === 0 || col === n - 1) {\n                line += \"*\";\n            } else {\n                line += \" \";\n            }\n        }\n\n        result.push(line);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function hollowSquare(n: number): string[] {\n    const result: string[] = [];\n\n    for (let row = 0; row < n; row++) {\n        let line = \"\";\n\n        for (let col = 0; col < n; col++) {\n            // A cell is a star only on the outer frame\n            if (row === 0 || row === n - 1 || col === 0 || col === n - 1) {\n                line += \"*\";\n            } else {\n                line += \" \";\n            }\n        }\n\n        result.push(line);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_border": [
        9
      ]
    }
  }
};

const HollowSquarePresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex2",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex3",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  },
  {
    "id": "ex4",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  }
];

function generateHollowSquareSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=(e,r)=>0===e||e===t-1||0===r||r===t-1,l={};for(let e=0;e<t;e++)for(let n=0;n<t;n++)l[`cell_${e}_${n}`]={type:"matrixElement",value:r(e,n)?"*":"\xb7",row:e,col:n,state:"pending"};let i=new StepRecorder({n:t,row:void 0,col:void 0,line:void 0},l);i.record("-",`Start: print a hollow square with ${t} rows and ${t} columns.`);for(let e=0;e<t;e++){i.update_variable("row",e),i.update_variable("col",void 0),i.update_variable("line",""),i.update_visual("ptr_i",{type:"2DPointer",row:e,col:-1,label:"row"}),i.record("row_start",`Row ${e+1}: start with an empty line.`);let n="";for(let l=0;l<t;l++){let t=r(e,l);if(n+=t?"*":" ",i.update_variable("col",l),i.update_variable("line",n),l>0){let t=r(e,l-1);i.update_visual(`cell_${e}_${l-1}`,{type:"matrixElement",value:t?"*":"\xb7",row:e,col:l-1,state:t?"printed":"space"})}i.update_visual(`cell_${e}_${l}`,{type:"matrixElement",value:t?"*":"\xb7",row:e,col:l,state:"active"}),i.add_conditional("is_border",t),t?i.record("print_star",`Cell (row ${e}, col ${l}) is on the outer frame: append a star.`):i.record("print_space",`Cell (row ${e}, col ${l}) is inside the frame: append a space.`)}for(let n=0;n<t;n++){let t=r(e,n);i.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:t?"*":"\xb7",row:e,col:n,state:t?"done":"space"})}i.record("row_done",`Row ${e+1} is complete: add "${n}" to the result.`)}return i.delete_visual("ptr_i"),i.update_variable("col",void 0),i.record("complete",`All ${t} rows printed. The hollow square is complete.`),i.getSteps()
}

export function HollowSquareProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HollowSquareTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateHollowSquareSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Hollow Square"
      slug="hollow-square"
      approaches={approaches}
      presets={HollowSquarePresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Hollow Triangle (hollow-triangle)
// ==========================================

const HollowTriangleTemplates = {
  "python": {
    "language": "python",
    "code": "def hollow_triangle(n):\n    result = []\n\n    for i in range(1, n + 1):\n        line = []\n\n        for j in range(i):\n            # Stars on the left edge, the slant, and the base\n            if j == 0 or j == i - 1 or i == n:\n                line.append('*')\n            else:\n                line.append(' ')\n\n        result.append(''.join(line))\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        14
      ],
      "complete": [
        16
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> hollowTriangle(int n) {\n    List<String> result = new ArrayList<>();\n\n    for (int i = 1; i <= n; i++) {\n        StringBuilder line = new StringBuilder();\n\n        for (int j = 0; j < i; j++) {\n            // Stars on the left edge, the slant, and the base\n            if (j == 0 || j == i - 1 || i == n) {\n                line.append('*');\n            } else {\n                line.append(' ');\n            }\n        }\n\n        result.add(line.toString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> hollowTriangle(int n) {\n    vector<string> result;\n\n    for (int i = 1; i <= n; i++) {\n        string line;\n\n        for (int j = 0; j < i; j++) {\n            // Stars on the left edge, the slant, and the base\n            if (j == 0 || j == i - 1 || i == n) {\n                line += '*';\n            } else {\n                line += ' ';\n            }\n        }\n\n        result.push_back(line);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> HollowTriangle(int n) {\n    List<string> result = new List<string>();\n\n    for (int i = 1; i <= n; i++) {\n        StringBuilder line = new StringBuilder();\n\n        for (int j = 0; j < i; j++) {\n            // Stars on the left edge, the slant, and the base\n            if (j == 0 || j == i - 1 || i == n) {\n                line.Append('*');\n            } else {\n                line.Append(' ');\n            }\n        }\n\n        result.Add(line.ToString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func hollowTriangle(n int) []string {\n    result := make([]string, 0, n)\n\n    for i := 1; i <= n; i++ {\n        line := make([]byte, 0, i)\n\n        for j := 0; j < i; j++ {\n            // Stars on the left edge, the slant, and the base\n            if j == 0 || j == i-1 || i == n {\n                line = append(line, '*')\n            } else {\n                line = append(line, ' ')\n            }\n        }\n\n        result = append(result, string(line))\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var hollowTriangle = function(n) {\n    const result = [];\n\n    for (let i = 1; i <= n; i++) {\n        let line = \"\";\n\n        for (let j = 0; j < i; j++) {\n            // Stars on the left edge, the slant, and the base\n            if (j === 0 || j === i - 1 || i === n) {\n                line += \"*\";\n            } else {\n                line += \" \";\n            }\n        }\n\n        result.push(line);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function hollowTriangle(n: number): string[] {\n    const result: string[] = [];\n\n    for (let i = 1; i <= n; i++) {\n        let line = \"\";\n\n        for (let j = 0; j < i; j++) {\n            // Stars on the left edge, the slant, and the base\n            if (j === 0 || j === i - 1 || i === n) {\n                line += \"*\";\n            } else {\n                line += \" \";\n            }\n        }\n\n        result.push(line);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        4,
        5
      ],
      "print_star": [
        10
      ],
      "print_space": [
        12
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    },
    "conditionalMap": {
      "is_edge": [
        9
      ]
    }
  }
};

const HollowTrianglePresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex2",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  },
  {
    "id": "ex3",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  }
];

function generateHollowTriangleSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,n=(e,n)=>0===n||n===e-1||e===t,i={};for(let e=1;e<=t;e++)for(let t=0;t<e;t++)i[`cell_${e-1}_${t}`]={type:"matrixElement",value:n(e,t)?"*":"\xb7",row:e-1,col:t,state:"pending"};let l=new StepRecorder({n:t,i:void 0,j:void 0,line:void 0},i);l.record("-",`Start: print a hollow triangle with ${t} rows.`);for(let e=1;e<=t;e++){l.update_variable("i",e),l.update_variable("j",void 0),l.update_variable("line",""),l.update_visual("ptr_i",{type:"2DPointer",row:e-1,col:-1,label:"i"}),l.record("row_start",`Row ${e}: start with an empty line.`);let t="";for(let r=0;r<e;r++){let i=n(e,r);if(t+=i?"*":" ",l.update_variable("j",r),l.update_variable("line",t),r>0){let t=n(e,r-1);l.update_visual(`cell_${e-1}_${r-1}`,{type:"matrixElement",value:t?"*":"\xb7",row:e-1,col:r-1,state:t?"printed":"space"})}l.update_visual(`cell_${e-1}_${r}`,{type:"matrixElement",value:i?"*":"\xb7",row:e-1,col:r,state:"active"}),l.add_conditional("is_edge",i),i?l.record("print_star",`Position j = ${r} in row ${e} is on an edge: append a star.`):l.record("print_space",`Position j = ${r} in row ${e} is interior: append a space.`)}for(let t=0;t<e;t++){let r=n(e,t);l.update_visual(`cell_${e-1}_${t}`,{type:"matrixElement",value:r?"*":"\xb7",row:e-1,col:t,state:r?"done":"space"})}l.record("row_done",`Row ${e} is complete: add "${t}" to the result.`)}return l.delete_visual("ptr_i"),l.update_variable("j",void 0),l.record("complete",`All ${t} rows printed. The hollow triangle is complete.`),l.getSteps()
}

export function HollowTriangleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HollowTriangleTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateHollowTriangleSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Hollow Triangle"
      slug="hollow-triangle"
      approaches={approaches}
      presets={HollowTrianglePresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Diamond Pattern (diamond-pattern)
// ==========================================

const DiamondPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def diamond_pattern(n):\n    result = []\n    # Top half: tip down to the widest row\n    for k in range(1, n + 1):\n        result.append(' ' * (n - k) + '*' * (2 * k - 1))\n    # Bottom half: mirror the upper rows in reverse\n    for k in range(n - 1, 0, -1):\n        result.append(' ' * (n - k) + '*' * (2 * k - 1))\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        7,
        8
      ],
      "complete": [
        9
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> diamondPattern(int n) {\n    List<String> result = new ArrayList<>();\n    // Top half: tip down to the widest row\n    for (int k = 1; k <= n; k++) {\n        result.add(\" \".repeat(n - k) + \"*\".repeat(2 * k - 1));\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for (int k = n - 1; k >= 1; k--) {\n        result.add(\" \".repeat(n - k) + \"*\".repeat(2 * k - 1));\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> diamondPattern(int n) {\n    vector<string> result;\n    // Top half: tip down to the widest row\n    for (int k = 1; k <= n; k++) {\n        result.push_back(string(n - k, ' ') + string(2 * k - 1, '*'));\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for (int k = n - 1; k >= 1; k--) {\n        result.push_back(string(n - k, ' ') + string(2 * k - 1, '*'));\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> DiamondPattern(int n) {\n    List<string> result = new List<string>();\n    // Top half: tip down to the widest row\n    for (int k = 1; k <= n; k++) {\n        result.Add(new string(' ', n - k) + new string('*', 2 * k - 1));\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for (int k = n - 1; k >= 1; k--) {\n        result.Add(new string(' ', n - k) + new string('*', 2 * k - 1));\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func diamondPattern(n int) []string {\n    result := make([]string, 0, 2*n-1)\n    // Top half: tip down to the widest row\n    for k := 1; k <= n; k++ {\n        result = append(result, strings.Repeat(\" \", n-k)+strings.Repeat(\"*\", 2*k-1))\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for k := n - 1; k >= 1; k-- {\n        result = append(result, strings.Repeat(\" \", n-k)+strings.Repeat(\"*\", 2*k-1))\n    }\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var diamondPattern = function(n) {\n    const result = [];\n    // Top half: tip down to the widest row\n    for (let k = 1; k <= n; k++) {\n        result.push(' '.repeat(n - k) + '*'.repeat(2 * k - 1));\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for (let k = n - 1; k >= 1; k--) {\n        result.push(' '.repeat(n - k) + '*'.repeat(2 * k - 1));\n    }\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function diamondPattern(n: number): string[] {\n    const result: string[] = [];\n    // Top half: tip down to the widest row\n    for (let k = 1; k <= n; k++) {\n        result.push(' '.repeat(n - k) + '*'.repeat(2 * k - 1));\n    }\n    // Bottom half: mirror the upper rows in reverse\n    for (let k = n - 1; k >= 1; k--) {\n        result.push(' '.repeat(n - k) + '*'.repeat(2 * k - 1));\n    }\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        4,
        5
      ],
      "row_bottom": [
        8,
        9
      ],
      "complete": [
        11
      ]
    }
  }
};

const DiamondPatternPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex4",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  }
];

function generateDiamondPatternSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=2*t-1,i=e=>e<t?e+1:r-e,a={};for(let e=0;e<r;e++){let r=i(e);for(let n=0;n<t-r;n++)a[`cell_${e}_${n}`]={type:"matrixElement",value:"\xb7",row:e,col:n,state:"pending"};for(let n=t-r;n<=t+r-2;n++)a[`cell_${e}_${n}`]={type:"matrixElement",value:"*",row:e,col:n,state:"pending"}}let l=new StepRecorder({n:t,k:void 0,row:void 0},a);l.record("-",`Start: print a diamond with ${r} rows.`);let s=e=>{let r=i(e);for(let n=t-r;n<=t+r-2;n++)l.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:"*",row:e,col:n,state:"done"})},o=(e,r,n)=>{e>0&&s(e-1);for(let n=0;n<t-r;n++)l.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:"\xb7",row:e,col:n,state:"space"});for(let n=t-r;n<=t+r-2;n++)l.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:"*",row:e,col:n,state:"active"});let i=t-r,a=2*r-1;l.update_variable("k",r),l.update_variable("row"," ".repeat(i)+"*".repeat(a)),l.update_visual("ptr_i",{type:"2DPointer",row:e,col:-1,label:"k"});let o=1===i?"1 space":`${i} spaces`,u=1===a?"1 star":`${a} stars`,d=i>0?`Row ${e+1}: print ${o} then ${u}.`:`Row ${e+1}: print ${u}.`;l.record(n,d)};for(let e=1;e<=t;e++)o(e-1,e,"row_top");for(let e=t-1;e>=1;e--)o(r-e,e,"row_bottom");return s(r-1),l.delete_visual("ptr_i"),l.record("complete",`All ${r} rows printed. The diamond is complete.`),l.getSteps()
}

export function DiamondPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: DiamondPatternTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateDiamondPatternSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Diamond Pattern"
      slug="diamond-pattern"
      approaches={approaches}
      presets={DiamondPatternPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Floyd's Triangle (floyds-triangle)
// ==========================================

const FloydsTriangleTemplates = {
  "python": {
    "language": "python",
    "code": "def floyds_triangle(n):\n    triangle = []\n    num = 1\n\n    # One counter flows across every row\n    for i in range(1, n + 1):\n        row = []\n\n        for j in range(i):\n            row.append(num)\n            num += 1\n\n        triangle.append(row)\n\n    return triangle",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        13
      ],
      "complete": [
        15
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] floydsTriangle(int n) {\n    int[][] triangle = new int[n][];\n    int num = 1;\n\n    // One counter flows across every row\n    for (int i = 1; i <= n; i++) {\n        int[] row = new int[i];\n\n        for (int j = 0; j < i; j++) {\n            row[j] = num;\n            num++;\n        }\n\n        triangle[i - 1] = row;\n    }\n\n    return triangle;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> floydsTriangle(int n) {\n    vector<vector<int>> triangle;\n    int num = 1;\n\n    // One counter flows across every row\n    for (int i = 1; i <= n; i++) {\n        vector<int> row;\n\n        for (int j = 0; j < i; j++) {\n            row.push_back(num);\n            num++;\n        }\n\n        triangle.push_back(row);\n    }\n\n    return triangle;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] FloydsTriangle(int n) {\n    int[][] triangle = new int[n][];\n    int num = 1;\n\n    // One counter flows across every row\n    for (int i = 1; i <= n; i++) {\n        int[] row = new int[i];\n\n        for (int j = 0; j < i; j++) {\n            row[j] = num;\n            num++;\n        }\n\n        triangle[i - 1] = row;\n    }\n\n    return triangle;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func floydsTriangle(n int) [][]int {\n    triangle := make([][]int, 0, n)\n    num := 1\n\n    // One counter flows across every row\n    for i := 1; i <= n; i++ {\n        row := make([]int, 0, i)\n\n        for j := 0; j < i; j++ {\n            row = append(row, num)\n            num++\n        }\n\n        triangle = append(triangle, row)\n    }\n\n    return triangle\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var floydsTriangle = function(n) {\n    const triangle = [];\n    let num = 1;\n\n    // One counter flows across every row\n    for (let i = 1; i <= n; i++) {\n        const row = [];\n\n        for (let j = 0; j < i; j++) {\n            row.push(num);\n            num++;\n        }\n\n        triangle.push(row);\n    }\n\n    return triangle;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function floydsTriangle(n: number): number[][] {\n    const triangle: number[][] = [];\n    let num = 1;\n\n    // One counter flows across every row\n    for (let i = 1; i <= n; i++) {\n        const row: number[] = [];\n\n        for (let j = 0; j < i; j++) {\n            row.push(num);\n            num++;\n        }\n\n        triangle.push(row);\n    }\n\n    return triangle;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        6,
        7
      ],
      "print_num": [
        9,
        10,
        11
      ],
      "row_done": [
        14
      ],
      "complete": [
        17
      ]
    }
  }
};

const FloydsTrianglePresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex4",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  }
];

function generateFloydsTriangleSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=(e,t)=>e*(e+1)/2+t+1,i={};for(let e=0;e<t;e++)for(let t=0;t<=e;t++)i[`cell_${e}_${t}`]={type:"matrixElement",value:r(e,t),row:e,col:t,state:"pending"};let l=new StepRecorder({n:t,num:1,i:void 0,j:void 0},i);l.record("-",`Start: print Floyd's Triangle with ${t} rows using a running counter.`);let a=1;for(let e=1;e<=t;e++){l.update_variable("i",e),l.update_variable("j",void 0),l.update_visual("ptr_i",{type:"2DPointer",row:e-1,col:-1,label:"i"}),l.record("row_start",`Row ${e}: create an empty row that will hold ${e} numbers.`);for(let t=0;t<e;t++){let n=a;a++,l.update_variable("j",t),l.update_variable("num",a),t>0&&l.update_visual(`cell_${e-1}_${t-1}`,{type:"matrixElement",value:r(e-1,t-1),row:e-1,col:t-1,state:"printed"}),l.update_visual(`cell_${e-1}_${t}`,{type:"matrixElement",value:n,row:e-1,col:t,state:"active"}),l.record("print_num",`Place ${n} at position ${t+1} of row ${e}, then advance num to ${a}.`)}for(let t=0;t<e;t++)l.update_visual(`cell_${e-1}_${t}`,{type:"matrixElement",value:r(e-1,t),row:e-1,col:t,state:"done"});l.record("row_done",`Row ${e} is complete: add it to the triangle.`)}return l.delete_visual("ptr_i"),l.update_variable("j",void 0),l.record("complete",`All ${t} rows printed. Floyd's Triangle is complete.`),l.getSteps()
}

export function FloydsTriangleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: FloydsTriangleTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateFloydsTriangleSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Floyd's Triangle"
      slug="floyds-triangle"
      approaches={approaches}
      presets={FloydsTrianglePresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Mirror Number Pattern (mirror-number-pattern)
// ==========================================

const MirrorNumberPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def mirror_number_pattern(n):\n    result = []\n\n    # Count up to i, then count back down to 1\n    for i in range(1, n + 1):\n        row = \"\"\n\n        for j in range(1, i + 1):\n            row += str(j)\n\n        for j in range(i - 1, 0, -1):\n            row += str(j)\n\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        11,
        12
      ],
      "row_done": [
        14
      ],
      "complete": [
        16
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> mirrorNumberPattern(int n) {\n    List<String> result = new ArrayList<>();\n\n    // Count up to i, then count back down to 1\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int j = 1; j <= i; j++) {\n            row.append(j);\n        }\n\n        for (int j = i - 1; j >= 1; j--) {\n            row.append(j);\n        }\n\n        result.add(row.toString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> mirrorNumberPattern(int n) {\n    vector<string> result;\n\n    // Count up to i, then count back down to 1\n    for (int i = 1; i <= n; i++) {\n        string row;\n\n        for (int j = 1; j <= i; j++) {\n            row += to_string(j);\n        }\n\n        for (int j = i - 1; j >= 1; j--) {\n            row += to_string(j);\n        }\n\n        result.push_back(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> MirrorNumberPattern(int n) {\n    List<string> result = new List<string>();\n\n    // Count up to i, then count back down to 1\n    for (int i = 1; i <= n; i++) {\n        StringBuilder row = new StringBuilder();\n\n        for (int j = 1; j <= i; j++) {\n            row.Append(j);\n        }\n\n        for (int j = i - 1; j >= 1; j--) {\n            row.Append(j);\n        }\n\n        result.Add(row.ToString());\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func mirrorNumberPattern(n int) []string {\n    result := make([]string, 0, n)\n\n    // Count up to i, then count back down to 1\n    for i := 1; i <= n; i++ {\n        row := \"\"\n\n        for j := 1; j <= i; j++ {\n            row += strconv.Itoa(j)\n        }\n\n        for j := i - 1; j >= 1; j-- {\n            row += strconv.Itoa(j)\n        }\n\n        result = append(result, row)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var mirrorNumberPattern = function(n) {\n    const result = [];\n\n    // Count up to i, then count back down to 1\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let j = 1; j <= i; j++) {\n            row += j;\n        }\n\n        for (let j = i - 1; j >= 1; j--) {\n            row += j;\n        }\n\n        result.push(row);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function mirrorNumberPattern(n: number): string[] {\n    const result: string[] = [];\n\n    // Count up to i, then count back down to 1\n    for (let i = 1; i <= n; i++) {\n        let row = \"\";\n\n        for (let j = 1; j <= i; j++) {\n            row += j;\n        }\n\n        for (let j = i - 1; j >= 1; j--) {\n            row += j;\n        }\n\n        result.push(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_start": [
        5,
        6
      ],
      "print_up": [
        8,
        9
      ],
      "print_down": [
        12,
        13
      ],
      "row_done": [
        16
      ],
      "complete": [
        19
      ]
    }
  }
};

const MirrorNumberPatternPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  }
];

function generateMirrorNumberPatternSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=(e,t)=>t<=e?t+1:2*(e+1)-1-t,i={};for(let e=0;e<t;e++){let t=2*(e+1)-1;for(let n=0;n<t;n++)i[`cell_${e}_${n}`]={type:"matrixElement",value:r(e,n),row:e,col:n,state:"pending"}}let o=new StepRecorder({n:t,i:void 0,j:void 0,row:void 0},i);o.record("-",`Start: print a mirror number pattern with ${t} rows.`);for(let e=1;e<=t;e++){o.update_variable("i",e),o.update_variable("j",void 0),o.update_variable("row",""),o.update_visual("ptr_i",{type:"2DPointer",row:e-1,col:-1,label:"i"}),o.record("row_start",`Row ${e}: start with an empty row, the peak will be ${e}.`);let t="",n=-1;for(let i=1;i<=e;i++){let a=i-1;t+=String(i),o.update_variable("j",i),o.update_variable("row",t),n>=0&&o.update_visual(`cell_${e-1}_${n}`,{type:"matrixElement",value:r(e-1,n),row:e-1,col:n,state:"printed"}),o.update_visual(`cell_${e-1}_${a}`,{type:"matrixElement",value:i,row:e-1,col:a,state:"active"}),o.record("print_up",`Append ${i} on the way up in row ${e}.`),n=a}for(let i=e-1;i>=1;i--){let a=2*e-1-i;t+=String(i),o.update_variable("j",i),o.update_variable("row",t),o.update_visual(`cell_${e-1}_${n}`,{type:"matrixElement",value:r(e-1,n),row:e-1,col:n,state:"printed"}),o.update_visual(`cell_${e-1}_${a}`,{type:"matrixElement",value:i,row:e-1,col:a,state:"active"}),o.record("print_down",`Append ${i} on the way back down in row ${e}.`),n=a}let i=2*e-1;for(let t=0;t<i;t++)o.update_visual(`cell_${e-1}_${t}`,{type:"matrixElement",value:r(e-1,t),row:e-1,col:t,state:"done"});o.record("row_done",`Row ${e} is complete: add "${t}" to the result.`)}return o.delete_visual("ptr_i"),o.update_variable("j",void 0),o.record("complete",`All ${t} rows printed. The mirror pattern is complete.`),o.getSteps()
}

export function MirrorNumberPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: MirrorNumberPatternTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateMirrorNumberPatternSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Mirror Number Pattern"
      slug="mirror-number-pattern"
      approaches={approaches}
      presets={MirrorNumberPatternPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Butterfly Pattern (butterfly-pattern)
// ==========================================

const ButterflyPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def butterfly_pattern(n):\n    result = []\n\n    # Top half: wings grow from 1 star up to n stars\n    for i in range(1, n + 1):\n        row = \"*\" * i + \" \" * (2 * (n - i)) + \"*\" * i\n        result.append(row)\n\n    # Bottom half: mirror rows n-1 down to 1\n    for i in range(n - 1, 0, -1):\n        row = \"*\" * i + \" \" * (2 * (n - i)) + \"*\" * i\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        10,
        11,
        12
      ],
      "complete": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> butterflyPattern(int n) {\n    List<String> result = new ArrayList<>();\n\n    // Top half: wings grow from 1 star up to n stars\n    for (int i = 1; i <= n; i++) {\n        String row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.add(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        String row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.add(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> butterflyPattern(int n) {\n    vector<string> result;\n\n    // Top half: wings grow from 1 star up to n stars\n    for (int i = 1; i <= n; i++) {\n        string row = string(i, '*') + string(2 * (n - i), ' ') + string(i, '*');\n        result.push_back(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        string row = string(i, '*') + string(2 * (n - i), ' ') + string(i, '*');\n        result.push_back(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> ButterflyPattern(int n) {\n    List<string> result = new List<string>();\n\n    // Top half: wings grow from 1 star up to n stars\n    for (int i = 1; i <= n; i++) {\n        string row = new string('*', i) + new string(' ', 2 * (n - i)) + new string('*', i);\n        result.Add(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        string row = new string('*', i) + new string(' ', 2 * (n - i)) + new string('*', i);\n        result.Add(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func butterflyPattern(n int) []string {\n    result := []string{}\n\n    // Top half: wings grow from 1 star up to n stars\n    for i := 1; i <= n; i++ {\n        row := strings.Repeat(\"*\", i) + strings.Repeat(\" \", 2*(n-i)) + strings.Repeat(\"*\", i)\n        result = append(result, row)\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for i := n - 1; i >= 1; i-- {\n        row := strings.Repeat(\"*\", i) + strings.Repeat(\" \", 2*(n-i)) + strings.Repeat(\"*\", i)\n        result = append(result, row)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var butterflyPattern = function(n) {\n    const result = [];\n\n    // Top half: wings grow from 1 star up to n stars\n    for (let i = 1; i <= n; i++) {\n        const row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.push(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (let i = n - 1; i >= 1; i--) {\n        const row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.push(row);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function butterflyPattern(n: number): string[] {\n    const result: string[] = [];\n\n    // Top half: wings grow from 1 star up to n stars\n    for (let i = 1; i <= n; i++) {\n        const row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.push(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (let i = n - 1; i >= 1; i--) {\n        const row = \"*\".repeat(i) + \" \".repeat(2 * (n - i)) + \"*\".repeat(i);\n        result.push(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  }
};

const ButterflyPatternPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex4",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  }
];

function generateButterflyPatternSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=2*t-1,i=2*t,s=e=>e<t?e+1:r-e,a={};for(let e=0;e<r;e++){let t=s(e);for(let r=0;r<i;r++){let n=r<t||r>=i-t;a[`cell_${e}_${r}`]={type:"matrixElement",value:n?"*":"\xb7",row:e,col:r,state:"pending"}}}let o=new StepRecorder({n:t,i:void 0,row:void 0},a);o.record("-",`Start: print a butterfly with ${r} rows.`);let l=e=>{let t=s(e);for(let r=0;r<i;r++)(r<t||r>=i-t)&&o.update_visual(`cell_${e}_${r}`,{type:"matrixElement",value:"*",row:e,col:r,state:"done"})},u=(e,r,n)=>{e>0&&l(e-1);for(let t=0;t<i;t++){let n=t<r||t>=i-r;o.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:n?"*":"\xb7",row:e,col:t,state:n?"active":"space"})}let s=2*(t-r);o.update_variable("i",r),o.update_variable("row","*".repeat(r)+" ".repeat(s)+"*".repeat(r)),o.update_visual("ptr_i",{type:"2DPointer",row:e,col:-1,label:"i"});let a=1===r?"1 star":`${r} stars`,u=s>0?`Row ${e+1}: print ${a}, ${s} spaces, then ${a} again.`:`Row ${e+1}: print ${i} stars across the full width.`;o.record(n,u)};for(let e=1;e<=t;e++)u(e-1,e,"row_top");for(let e=t-1;e>=1;e--)u(r-e,e,"row_bottom");return l(r-1),o.delete_visual("ptr_i"),o.record("complete",`All ${r} rows printed. The butterfly is complete.`),o.getSteps()
}

export function ButterflyPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: ButterflyPatternTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateButterflyPatternSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Butterfly Pattern"
      slug="butterfly-pattern"
      approaches={approaches}
      presets={ButterflyPatternPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Hourglass Pattern (hourglass-pattern)
// ==========================================

const HourglassPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def hourglass_pattern(n):\n    result = []\n\n    # Top half: inverted pyramid from widest down to a single star\n    for i in range(1, n + 1):\n        row = \" \" * (i - 1) + \"*\" * (2 * (n - i) + 1)\n        result.append(row)\n\n    # Bottom half: mirror rows n-1 down to 1\n    for i in range(n - 1, 0, -1):\n        row = \" \" * (i - 1) + \"*\" * (2 * (n - i) + 1)\n        result.append(row)\n\n    return result",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        10,
        11,
        12
      ],
      "complete": [
        14
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public List<String> hourglassPattern(int n) {\n    List<String> result = new ArrayList<>();\n\n    // Top half: inverted pyramid from widest down to a single star\n    for (int i = 1; i <= n; i++) {\n        String row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.add(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        String row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.add(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<string> hourglassPattern(int n) {\n    vector<string> result;\n\n    // Top half: inverted pyramid from widest down to a single star\n    for (int i = 1; i <= n; i++) {\n        string row = string(i - 1, ' ') + string(2 * (n - i) + 1, '*');\n        result.push_back(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        string row = string(i - 1, ' ') + string(2 * (n - i) + 1, '*');\n        result.push_back(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public IList<string> HourglassPattern(int n) {\n    List<string> result = new List<string>();\n\n    // Top half: inverted pyramid from widest down to a single star\n    for (int i = 1; i <= n; i++) {\n        string row = new string(' ', i - 1) + new string('*', 2 * (n - i) + 1);\n        result.Add(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (int i = n - 1; i >= 1; i--) {\n        string row = new string(' ', i - 1) + new string('*', 2 * (n - i) + 1);\n        result.Add(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func hourglassPattern(n int) []string {\n    result := []string{}\n\n    // Top half: inverted pyramid from widest down to a single star\n    for i := 1; i <= n; i++ {\n        row := strings.Repeat(\" \", i-1) + strings.Repeat(\"*\", 2*(n-i)+1)\n        result = append(result, row)\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for i := n - 1; i >= 1; i-- {\n        row := strings.Repeat(\" \", i-1) + strings.Repeat(\"*\", 2*(n-i)+1)\n        result = append(result, row)\n    }\n\n    return result\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var hourglassPattern = function(n) {\n    const result = [];\n\n    // Top half: inverted pyramid from widest down to a single star\n    for (let i = 1; i <= n; i++) {\n        const row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.push(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (let i = n - 1; i >= 1; i--) {\n        const row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.push(row);\n    }\n\n    return result;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function hourglassPattern(n: number): string[] {\n    const result: string[] = [];\n\n    // Top half: inverted pyramid from widest down to a single star\n    for (let i = 1; i <= n; i++) {\n        const row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.push(row);\n    }\n\n    // Bottom half: mirror rows n-1 down to 1\n    for (let i = n - 1; i >= 1; i--) {\n        const row = \" \".repeat(i - 1) + \"*\".repeat(2 * (n - i) + 1);\n        result.push(row);\n    }\n\n    return result;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "row_top": [
        5,
        6,
        7
      ],
      "row_bottom": [
        11,
        12,
        13
      ],
      "complete": [
        16
      ]
    }
  }
};

const HourglassPatternPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "n = 4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "n = 5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "n = 3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex4",
    "label": "n = 6",
    "value": {
      "n": 6
    }
  }
];

function generateHourglassPatternSteps(e: { n: number }): ProblemStep[] {
  let t=e.n,r=2*t-1,i=e=>e<t?e+1:r-e,s={};for(let e=0;e<r;e++){let r=i(e);for(let t=0;t<r-1;t++)s[`cell_${e}_${t}`]={type:"matrixElement",value:"\xb7",row:e,col:t,state:"pending"};for(let n=r-1;n<=2*t-r-1;n++)s[`cell_${e}_${n}`]={type:"matrixElement",value:"*",row:e,col:n,state:"pending"}}let a=new StepRecorder({n:t,i:void 0,row:void 0},s);a.record("-",`Start: print an hourglass with ${r} rows.`);let o=e=>{let r=i(e);for(let n=r-1;n<=2*t-r-1;n++)a.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:"*",row:e,col:n,state:"done"})},l=(e,r,n)=>{e>0&&o(e-1);for(let t=0;t<r-1;t++)a.update_visual(`cell_${e}_${t}`,{type:"matrixElement",value:"\xb7",row:e,col:t,state:"space"});for(let n=r-1;n<=2*t-r-1;n++)a.update_visual(`cell_${e}_${n}`,{type:"matrixElement",value:"*",row:e,col:n,state:"active"});let i=r-1,s=2*(t-r)+1;a.update_variable("i",r),a.update_variable("row"," ".repeat(i)+"*".repeat(s)),a.update_visual("ptr_i",{type:"2DPointer",row:e,col:-1,label:"i"});let l=1===i?"1 space":`${i} spaces`,u=1===s?"1 star":`${s} stars`,c=i>0?`Row ${e+1}: print ${l} then ${u}.`:`Row ${e+1}: print ${u}.`;a.record(n,c)};for(let e=1;e<=t;e++)l(e-1,e,"row_top");for(let e=t-1;e>=1;e--)l(r-e,e,"row_bottom");return o(r-1),a.delete_visual("ptr_i"),a.record("complete",`All ${r} rows printed. The hourglass is complete.`),a.getSteps()
}

export function HourglassPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: HourglassPatternTemplates,
      generateSteps: (e: { n: number }) => {
        const recorded = generateHourglassPatternSteps(e) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Hourglass Pattern"
      slug="hourglass-pattern"
      approaches={approaches}
      presets={HourglassPatternPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}

// ==========================================
// Spiral Number Pattern (spiral-number-pattern)
// ==========================================

const SpiralNumberPatternTemplates = {
  "python": {
    "language": "python",
    "code": "def spiral_number_pattern(n):\n    grid = [[0] * n for _ in range(n)]\n    top, bottom, left, right = 0, n - 1, 0, n - 1\n    num = 1\n    while top <= bottom and left <= right:\n        # Top row, left to right\n        for c in range(left, right + 1):\n            grid[top][c] = num\n            num += 1\n        top += 1\n        # Right column, top to bottom\n        for r in range(top, bottom + 1):\n            grid[r][right] = num\n            num += 1\n        right -= 1\n        # Bottom row, right to left\n        if top <= bottom:\n            for c in range(right, left - 1, -1):\n                grid[bottom][c] = num\n                num += 1\n            bottom -= 1\n        # Left column, bottom to top\n        if left <= right:\n            for r in range(bottom, top - 1, -1):\n                grid[r][left] = num\n                num += 1\n            left += 1\n    return grid",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "loop_start": [
        5
      ],
      "fill_right": [
        8,
        9
      ],
      "increment_top": [
        10
      ],
      "fill_down": [
        13,
        14
      ],
      "decrement_right": [
        15
      ],
      "fill_left": [
        19,
        20
      ],
      "decrement_bottom": [
        21
      ],
      "fill_up": [
        25,
        26
      ],
      "increment_left": [
        27
      ],
      "complete": [
        28
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "traverse_right": [
        7
      ],
      "traverse_down": [
        12
      ],
      "bottom_check": [
        17
      ],
      "traverse_left": [
        18
      ],
      "left_check": [
        23
      ],
      "traverse_up": [
        24
      ]
    }
  },
  "java": {
    "language": "java",
    "code": "public int[][] spiralNumberPattern(int n) {\n    int[][] grid = new int[n][n];\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n    while (top <= bottom && left <= right) {\n        // Top row, left to right\n        for (int c = left; c <= right; c++) {\n            grid[top][c] = num++;\n        }\n        top++;\n        // Right column, top to bottom\n        for (int r = top; r <= bottom; r++) {\n            grid[r][right] = num++;\n        }\n        right--;\n        // Bottom row, right to left\n        if (top <= bottom) {\n            for (int c = right; c >= left; c--) {\n                grid[bottom][c] = num++;\n            }\n            bottom--;\n        }\n        // Left column, bottom to top\n        if (left <= right) {\n            for (int r = bottom; r >= top; r--) {\n                grid[r][left] = num++;\n            }\n            left++;\n        }\n    }\n    return grid;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "loop_start": [
        5
      ],
      "fill_right": [
        8
      ],
      "increment_top": [
        10
      ],
      "fill_down": [
        13
      ],
      "decrement_right": [
        15
      ],
      "fill_left": [
        19
      ],
      "decrement_bottom": [
        21
      ],
      "fill_up": [
        26
      ],
      "increment_left": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "traverse_right": [
        7
      ],
      "traverse_down": [
        12
      ],
      "bottom_check": [
        17
      ],
      "traverse_left": [
        18
      ],
      "left_check": [
        24
      ],
      "traverse_up": [
        25
      ]
    }
  },
  "cpp": {
    "language": "cpp",
    "code": "vector<vector<int>> spiralNumberPattern(int n) {\n    vector<vector<int>> grid(n, vector<int>(n, 0));\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n    while (top <= bottom && left <= right) {\n        // Top row, left to right\n        for (int c = left; c <= right; c++) {\n            grid[top][c] = num++;\n        }\n        top++;\n        // Right column, top to bottom\n        for (int r = top; r <= bottom; r++) {\n            grid[r][right] = num++;\n        }\n        right--;\n        // Bottom row, right to left\n        if (top <= bottom) {\n            for (int c = right; c >= left; c--) {\n                grid[bottom][c] = num++;\n            }\n            bottom--;\n        }\n        // Left column, bottom to top\n        if (left <= right) {\n            for (int r = bottom; r >= top; r--) {\n                grid[r][left] = num++;\n            }\n            left++;\n        }\n    }\n    return grid;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "loop_start": [
        5
      ],
      "fill_right": [
        8
      ],
      "increment_top": [
        10
      ],
      "fill_down": [
        13
      ],
      "decrement_right": [
        15
      ],
      "fill_left": [
        19
      ],
      "decrement_bottom": [
        21
      ],
      "fill_up": [
        26
      ],
      "increment_left": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "traverse_right": [
        7
      ],
      "traverse_down": [
        12
      ],
      "bottom_check": [
        17
      ],
      "traverse_left": [
        18
      ],
      "left_check": [
        24
      ],
      "traverse_up": [
        25
      ]
    }
  },
  "csharp": {
    "language": "csharp",
    "code": "public int[][] SpiralNumberPattern(int n) {\n    int[][] grid = new int[n][];\n    for (int i = 0; i < n; i++) {\n        grid[i] = new int[n];\n    }\n    int top = 0, bottom = n - 1, left = 0, right = n - 1;\n    int num = 1;\n    while (top <= bottom && left <= right) {\n        // Top row, left to right\n        for (int c = left; c <= right; c++) {\n            grid[top][c] = num++;\n        }\n        top++;\n        // Right column, top to bottom\n        for (int r = top; r <= bottom; r++) {\n            grid[r][right] = num++;\n        }\n        right--;\n        // Bottom row, right to left\n        if (top <= bottom) {\n            for (int c = right; c >= left; c--) {\n                grid[bottom][c] = num++;\n            }\n            bottom--;\n        }\n        // Left column, bottom to top\n        if (left <= right) {\n            for (int r = bottom; r >= top; r--) {\n                grid[r][left] = num++;\n            }\n            left++;\n        }\n    }\n    return grid;\n}",
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
        7
      ],
      "loop_start": [
        8
      ],
      "fill_right": [
        11
      ],
      "increment_top": [
        13
      ],
      "fill_down": [
        16
      ],
      "decrement_right": [
        18
      ],
      "fill_left": [
        22
      ],
      "decrement_bottom": [
        24
      ],
      "fill_up": [
        29
      ],
      "increment_left": [
        31
      ],
      "complete": [
        34
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "traverse_right": [
        10
      ],
      "traverse_down": [
        15
      ],
      "bottom_check": [
        20
      ],
      "traverse_left": [
        21
      ],
      "left_check": [
        27
      ],
      "traverse_up": [
        28
      ]
    }
  },
  "go": {
    "language": "go",
    "code": "func spiralNumberPattern(n int) [][]int {\n    grid := make([][]int, n)\n    for i := range grid {\n        grid[i] = make([]int, n)\n    }\n    top, bottom, left, right := 0, n-1, 0, n-1\n    num := 1\n    for top <= bottom && left <= right {\n        // Top row, left to right\n        for c := left; c <= right; c++ {\n            grid[top][c] = num\n            num++\n        }\n        top++\n        // Right column, top to bottom\n        for r := top; r <= bottom; r++ {\n            grid[r][right] = num\n            num++\n        }\n        right--\n        // Bottom row, right to left\n        if top <= bottom {\n            for c := right; c >= left; c-- {\n                grid[bottom][c] = num\n                num++\n            }\n            bottom--\n        }\n        // Left column, bottom to top\n        if left <= right {\n            for r := bottom; r >= top; r-- {\n                grid[r][left] = num\n                num++\n            }\n            left++\n        }\n    }\n    return grid\n}",
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
        7
      ],
      "loop_start": [
        8
      ],
      "fill_right": [
        11,
        12
      ],
      "increment_top": [
        14
      ],
      "fill_down": [
        17,
        18
      ],
      "decrement_right": [
        20
      ],
      "fill_left": [
        24,
        25
      ],
      "decrement_bottom": [
        27
      ],
      "fill_up": [
        32,
        33
      ],
      "increment_left": [
        35
      ],
      "complete": [
        38
      ]
    },
    "conditionalMap": {
      "while_loop": [
        8
      ],
      "traverse_right": [
        10
      ],
      "traverse_down": [
        16
      ],
      "bottom_check": [
        22
      ],
      "traverse_left": [
        23
      ],
      "left_check": [
        30
      ],
      "traverse_up": [
        31
      ]
    }
  },
  "javascript": {
    "language": "javascript",
    "code": "var spiralNumberPattern = function(n) {\n    const grid = Array.from({ length: n }, () => new Array(n).fill(0));\n    let top = 0, bottom = n - 1, left = 0, right = n - 1;\n    let num = 1;\n    while (top <= bottom && left <= right) {\n        // Top row, left to right\n        for (let c = left; c <= right; c++) {\n            grid[top][c] = num++;\n        }\n        top++;\n        // Right column, top to bottom\n        for (let r = top; r <= bottom; r++) {\n            grid[r][right] = num++;\n        }\n        right--;\n        // Bottom row, right to left\n        if (top <= bottom) {\n            for (let c = right; c >= left; c--) {\n                grid[bottom][c] = num++;\n            }\n            bottom--;\n        }\n        // Left column, bottom to top\n        if (left <= right) {\n            for (let r = bottom; r >= top; r--) {\n                grid[r][left] = num++;\n            }\n            left++;\n        }\n    }\n    return grid;\n};",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "loop_start": [
        5
      ],
      "fill_right": [
        8
      ],
      "increment_top": [
        10
      ],
      "fill_down": [
        13
      ],
      "decrement_right": [
        15
      ],
      "fill_left": [
        19
      ],
      "decrement_bottom": [
        21
      ],
      "fill_up": [
        26
      ],
      "increment_left": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "traverse_right": [
        7
      ],
      "traverse_down": [
        12
      ],
      "bottom_check": [
        17
      ],
      "traverse_left": [
        18
      ],
      "left_check": [
        24
      ],
      "traverse_up": [
        25
      ]
    }
  },
  "typescript": {
    "language": "typescript",
    "code": "function spiralNumberPattern(n: number): number[][] {\n    const grid: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));\n    let top = 0, bottom = n - 1, left = 0, right = n - 1;\n    let num = 1;\n    while (top <= bottom && left <= right) {\n        // Top row, left to right\n        for (let c = left; c <= right; c++) {\n            grid[top][c] = num++;\n        }\n        top++;\n        // Right column, top to bottom\n        for (let r = top; r <= bottom; r++) {\n            grid[r][right] = num++;\n        }\n        right--;\n        // Bottom row, right to left\n        if (top <= bottom) {\n            for (let c = right; c >= left; c--) {\n                grid[bottom][c] = num++;\n            }\n            bottom--;\n        }\n        // Left column, bottom to top\n        if (left <= right) {\n            for (let r = bottom; r >= top; r--) {\n                grid[r][left] = num++;\n            }\n            left++;\n        }\n    }\n    return grid;\n}",
    "lineMap": {
      "-": [
        1
      ],
      "init": [
        2,
        3,
        4
      ],
      "loop_start": [
        5
      ],
      "fill_right": [
        8
      ],
      "increment_top": [
        10
      ],
      "fill_down": [
        13
      ],
      "decrement_right": [
        15
      ],
      "fill_left": [
        19
      ],
      "decrement_bottom": [
        21
      ],
      "fill_up": [
        26
      ],
      "increment_left": [
        28
      ],
      "complete": [
        31
      ]
    },
    "conditionalMap": {
      "while_loop": [
        5
      ],
      "traverse_right": [
        7
      ],
      "traverse_down": [
        12
      ],
      "bottom_check": [
        17
      ],
      "traverse_left": [
        18
      ],
      "left_check": [
        24
      ],
      "traverse_up": [
        25
      ]
    }
  }
};

const SpiralNumberPatternPresets: PresetOption<{ n: number }>[] = [
  {
    "id": "ex1",
    "label": "4×4",
    "value": {
      "n": 4
    }
  },
  {
    "id": "ex2",
    "label": "5×5",
    "value": {
      "n": 5
    }
  },
  {
    "id": "ex3",
    "label": "3×3",
    "value": {
      "n": 3
    }
  },
  {
    "id": "ex4",
    "label": "6×6",
    "value": {
      "n": 6
    }
  }
];

function generateSpiralNumberPatternSteps(t: { n: number }): ProblemStep[] {
  let e=t.n;if(!e||e<=0)return[];let r={};for(let t=0;t<e;t++)for(let i=0;i<e;i++)r[`cell_${t}_${i}`]={type:"matrixElement",value:"",row:t,col:i,state:"default"};let o=0,n=e-1,l=0,a=e-1,s=1,c=new StepRecorder({n:e},{...r});for(c.record("-",`Fill a ${e}x${e} grid with numbers 1 to ${e*e} in a clockwise spiral`),c.update_variable("top",o),c.update_variable("bottom",n),c.update_variable("left",l),c.update_variable("right",a),c.update_variable("num",s),c.add_new_visual("boundary_top",{type:"2DPointer",label:"top",row:o,col:-1}),c.add_new_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:n,col:-1}),c.add_new_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:l}),c.add_new_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:a}),c.record("init",`Create an empty ${e}x${e} grid and initialize boundaries: top=${o}, bottom=${n}, left=${l}, right=${a}, num=${s}`);;){let t=o<=n&&l<=a;if(c.add_conditional("while_loop",t),!t)break;c.record("loop_start",`Check: top(${o}) <= bottom(${n}) and left(${l}) <= right(${a}), so fill the next ring`);for(let t=l;t<=a;t++)c.add_conditional("traverse_right",!0),c.update_visual(`cell_${o}_${t}`,{type:"matrixElement",value:s,row:o,col:t,state:"visited"}),c.update_variable("num",s+1),c.record("fill_right",`Fill the top row: grid[${o}][${t}] = ${s}`),s++;c.add_conditional("traverse_right",!1),o++,c.update_variable("top",o),c.update_visual("boundary_top",{type:"2DPointer",label:"top",row:o,col:-1}),c.record("increment_top",`Move the top boundary down: top = ${o}`);for(let t=o;t<=n;t++)c.add_conditional("traverse_down",!0),c.update_visual(`cell_${t}_${a}`,{type:"matrixElement",value:s,row:t,col:a,state:"visited"}),c.update_variable("num",s+1),c.record("fill_down",`Fill the right column: grid[${t}][${a}] = ${s}`),s++;if(c.add_conditional("traverse_down",!1),a--,c.update_variable("right",a),c.update_visual("boundary_right",{type:"2DPointer",label:"right",row:-1,col:a}),c.record("decrement_right",`Move the right boundary left: right = ${a}`),o<=n){for(let t=a;t>=l;t--)c.add_conditional("bottom_check",!0),c.add_conditional("traverse_left",!0),c.update_visual(`cell_${n}_${t}`,{type:"matrixElement",value:s,row:n,col:t,state:"visited"}),c.update_variable("num",s+1),c.record("fill_left",`Fill the bottom row: grid[${n}][${t}] = ${s}`),s++;c.add_conditional("bottom_check",!0),c.add_conditional("traverse_left",!1),n--,c.update_variable("bottom",n),c.update_visual("boundary_bottom",{type:"2DPointer",label:"bottom",row:n,col:-1}),c.record("decrement_bottom",`Move the bottom boundary up: bottom = ${n}`)}else c.add_conditional("bottom_check",!1);if(l<=a){for(let t=n;t>=o;t--)c.add_conditional("left_check",!0),c.add_conditional("traverse_up",!0),c.update_visual(`cell_${t}_${l}`,{type:"matrixElement",value:s,row:t,col:l,state:"visited"}),c.update_variable("num",s+1),c.record("fill_up",`Fill the left column: grid[${t}][${l}] = ${s}`),s++;c.add_conditional("left_check",!0),c.add_conditional("traverse_up",!1),l++,c.update_variable("left",l),c.update_visual("boundary_left",{type:"2DPointer",label:"left",row:-1,col:l}),c.record("increment_left",`Move the left boundary right: left = ${l}`)}else c.add_conditional("left_check",!1)}return c.delete_visual("boundary_top"),c.delete_visual("boundary_bottom"),c.delete_visual("boundary_left"),c.delete_visual("boundary_right"),c.record("complete","The boundaries have crossed, so every cell is filled. The spiral is complete"),c.getSteps()
}

export function SpiralNumberPatternProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "solution",
      label: "Solution",
      templates: SpiralNumberPatternTemplates,
      generateSteps: (t: { n: number }) => {
        const recorded = generateSpiralNumberPatternSteps(t) as any[];
        return recorded.map((r) => ({
          id: r.id,
          explanation: r.description,
          variables: r.variables,
          data: r.visualState,
        }));
      },
      renderVisual: (step: ProblemStep) => {
        const visualState = step.data || {};
        const { cells, activeRow } = cellsFromVisualState(visualState);
        return (
          <div className="w-full flex flex-col items-center justify-center">
            <PatternGridVisualizer cells={cells} activeRow={activeRow} height={260} />
          </div>
        );
      },
    },
  ];

  return (
    <ProblemViewerShell
      title="Spiral Number Pattern"
      slug="spiral-number-pattern"
      approaches={approaches}
      presets={SpiralNumberPatternPresets}
      formatInputDisplay={(input: { n: number }) => `n = ${input.n}`}
    />
  );
}
