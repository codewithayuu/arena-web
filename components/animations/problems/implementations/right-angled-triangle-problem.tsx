"use client";

import React from "react";
import {
  ProblemViewerShell,
  ProblemApproach,
  ProblemStep,
} from "../problem-viewer-shell";
import { PresetOption } from "../input-presets-panel";
import { PatternGridVisualizer, PatternCell } from "../pattern-grid-visualizer";

const CODE_TEMPLATES = {
  python: {
    language: "python",
    code: `def right_angled_triangle(n):
    result = []

    # Row i is made of exactly i stars
    for i in range(1, n + 1):
        row = ""

        for j in range(i):
            row += "*"

        result.append(row)

    return result`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [11], complete: [13] },
  },
  java: {
    language: "java",
    code: `public List<String> rightAngledTriangle(int n) {
    List<String> result = new ArrayList<>();

    // Row i is made of exactly i stars
    for (int i = 1; i <= n; i++) {
        StringBuilder row = new StringBuilder();

        for (int j = 0; j < i; j++) {
            row.append('*');
        }

        result.add(row.toString());
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
  cpp: {
    language: "cpp",
    code: `vector<string> rightAngledTriangle(int n) {
    vector<string> result;

    // Row i is made of exactly i stars
    for (int i = 1; i <= n; i++) {
        string row;

        for (int j = 0; j < i; j++) {
            row += '*';
        }

        result.push_back(row);
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
  csharp: {
    language: "csharp",
    code: `public IList<string> RightAngledTriangle(int n) {
    List<string> result = new List<string>();

    // Row i is made of exactly i stars
    for (int i = 1; i <= n; i++) {
        StringBuilder row = new StringBuilder();

        for (int j = 0; j < i; j++) {
            row.Append('*');
        }

        result.Add(row.ToString());
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
  go: {
    language: "go",
    code: `func rightAngledTriangle(n int) []string {
    result := make([]string, 0, n)

    // Row i is made of exactly i stars
    for i := 1; i <= n; i++ {
        row := ""

        for j := 0; j < i; j++ {
            row += "*"
        }

        result = append(result, row)
    }

    return result
}`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
  javascript: {
    language: "javascript",
    code: `var rightAngledTriangle = function(n) {
    const result = [];

    // Row i is made of exactly i stars
    for (let i = 1; i <= n; i++) {
        let row = "";

        for (let j = 0; j < i; j++) {
            row += "*";
        }

        result.push(row);
    }

    return result;
};`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
  typescript: {
    language: "typescript",
    code: `function rightAngledTriangle(n: number): string[] {
    const result: string[] = [];

    // Row i is made of exactly i stars
    for (let i = 1; i <= n; i++) {
        let row = "";

        for (let j = 0; j < i; j++) {
            row += "*";
        }

        result.push(row);
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6], print_star: [8, 9], row_done: [12], complete: [15] },
  },
};

interface TriangleInput {
  n: number;
}

const PRESETS: PresetOption<TriangleInput>[] = [
  { id: "ex1", label: "Example 1", value: { n: 4 } },
  { id: "ex2", label: "Example 2", value: { n: 5 } },
  { id: "ex3", label: "Example 3", value: { n: 3 } },
];

function generateSteps(input: TriangleInput): ProblemStep[] {
  const n = input.n;
  const steps: ProblemStep[] = [];

  const initialCells: PatternCell[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= r; c++) {
      initialCells.push({ row: r, col: c, value: "*", state: "pending" });
    }
  }

  steps.push({
    id: "-",
    explanation: `Start: print a right-angled triangle with ${n} rows.`,
    variables: { i: 0, j: -1, row: "" },
    data: { cells: JSON.parse(JSON.stringify(initialCells)), activeRow: -1 },
  });

  const cells = JSON.parse(JSON.stringify(initialCells)) as PatternCell[];

  for (let i = 1; i <= n; i++) {
    steps.push({
      id: "row_start",
      explanation: `Row ${i}: start with an empty row.`,
      variables: { i, j: -1, row: "" },
      data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
    });

    let rowStr = "";
    for (let j = 0; j < i; j++) {
      rowStr += "*";

      // Mark previous cells in this row as printed
      for (let prev = 0; prev < j; prev++) {
        const c = cells.find((cell) => cell.row === i - 1 && cell.col === prev);
        if (c) c.state = "printed";
      }

      // Mark current cell as active
      const current = cells.find((cell) => cell.row === i - 1 && cell.col === j);
      if (current) current.state = "active";

      steps.push({
        id: "print_star",
        explanation: `Append star ${j + 1} of ${i} to row ${i}.`,
        variables: { i, j, row: rowStr },
        data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
      });
    }

    // Mark all cells in this row as done
    for (let c = 0; c < i; c++) {
      const cell = cells.find((cl) => cl.row === i - 1 && cl.col === c);
      if (cell) cell.state = "done";
    }

    steps.push({
      id: "row_done",
      explanation: `Row ${i} is complete: add "${rowStr}" to the result.`,
      variables: { i, j: i - 1, row: rowStr },
      data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
    });
  }

  steps.push({
    id: "complete",
    explanation: `All ${n} rows printed. The triangle is complete.`,
    variables: { i: n, j: -1 },
    data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: -1 },
  });

  return steps;
}

export function RightAngledTriangleProblemSimulation() {
  const approaches: ProblemApproach[] = [
    {
      id: "nested_loops",
      label: "Nested Loops",
      templates: CODE_TEMPLATES,
      generateSteps: generateSteps,
      renderVisual: (step: ProblemStep, input: TriangleInput) => {
        const cells: PatternCell[] = step.data?.cells || [];
        const activeRow: number = step.data?.activeRow ?? -1;

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
      title="Right-Angled Triangle of Stars"
      slug="right-angled-triangle"
      approaches={approaches}
      presets={PRESETS}
      formatInputDisplay={(input: TriangleInput) => `n = ${input.n}`}
    />
  );
}
