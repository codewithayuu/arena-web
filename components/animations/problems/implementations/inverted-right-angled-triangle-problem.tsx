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
    code: `def inverted_triangle(n):
    result = []

    # Row i holds n - i + 1 stars, shrinking each step
    for i in range(1, n + 1):
        stars = n - i + 1
        row = ""

        for j in range(stars):
            row += "*"

        result.append(row)

    return result`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [12], complete: [14] },
  },
  java: {
    language: "java",
    code: `public List<String> invertedTriangle(int n) {
    List<String> result = new ArrayList<>();

    // Row i holds n - i + 1 stars, shrinking each step
    for (int i = 1; i <= n; i++) {
        int stars = n - i + 1;
        StringBuilder row = new StringBuilder();

        for (int j = 0; j < stars; j++) {
            row.append('*');
        }

        result.add(row.toString());
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
  cpp: {
    language: "cpp",
    code: `vector<string> invertedTriangle(int n) {
    vector<string> result;

    // Row i holds n - i + 1 stars, shrinking each step
    for (int i = 1; i <= n; i++) {
        int stars = n - i + 1;
        string row;

        for (int j = 0; j < stars; j++) {
            row += '*';
        }

        result.push_back(row);
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
  csharp: {
    language: "csharp",
    code: `public IList<string> InvertedTriangle(int n) {
    List<string> result = new List<string>();

    // Row i holds n - i + 1 stars, shrinking each step
    for (int i = 1; i <= n; i++) {
        int stars = n - i + 1;
        StringBuilder row = new StringBuilder();

        for (int j = 0; j < stars; j++) {
            row.Append('*');
        }

        result.Add(row.ToString());
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
  go: {
    language: "go",
    code: `func invertedTriangle(n int) []string {
    result := make([]string, 0, n)

    // Row i holds n - i + 1 stars, shrinking each step
    for i := 1; i <= n; i++ {
        stars := n - i + 1
        row := ""

        for j := 0; j < stars; j++ {
            row += "*"
        }

        result = append(result, row)
    }

    return result
}`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
  javascript: {
    language: "javascript",
    code: `var invertedTriangle = function(n) {
    const result = [];

    // Row i holds n - i + 1 stars, shrinking each step
    for (let i = 1; i <= n; i++) {
        let stars = n - i + 1;
        let row = "";

        for (let j = 0; j < stars; j++) {
            row += "*";
        }

        result.push(row);
    }

    return result;
};`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
  typescript: {
    language: "typescript",
    code: `function invertedTriangle(n: number): string[] {
    const result: string[] = [];

    // Row i holds n - i + 1 stars, shrinking each step
    for (let i = 1; i <= n; i++) {
        let stars = n - i + 1;
        let row = "";

        for (let j = 0; j < stars; j++) {
            row += "*";
        }

        result.push(row);
    }

    return result;
}`,
    lineMap: { "-": [1], row_start: [5, 6, 7], print_star: [9, 10], row_done: [13], complete: [16] },
  },
};

interface TriangleInput {
  n: number;
}

const PRESETS: PresetOption<TriangleInput>[] = [
  { id: "ex1", label: "n = 4", value: { n: 4 } },
  { id: "ex2", label: "n = 5", value: { n: 5 } },
  { id: "ex3", label: "n = 3", value: { n: 3 } },
  { id: "ex4", label: "n = 6", value: { n: 6 } },
];

function generateSteps(input: TriangleInput): ProblemStep[] {
  const n = input.n;
  const steps: ProblemStep[] = [];

  const initialCells: PatternCell[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n - r; c++) {
      initialCells.push({ row: r, col: c, value: "*", state: "pending" });
    }
  }

  steps.push({
    id: "-",
    explanation: `Start: print an inverted right-angled triangle with ${n} rows.`,
    variables: { i: 0, j: -1, stars: n, row: "" },
    data: { cells: JSON.parse(JSON.stringify(initialCells)), activeRow: -1 },
  });

  const cells = JSON.parse(JSON.stringify(initialCells)) as PatternCell[];

  for (let i = 1; i <= n; i++) {
    const stars = n - i + 1;

    steps.push({
      id: "row_start",
      explanation: `Row ${i}: it needs ${stars} stars, start with an empty row.`,
      variables: { i, j: -1, stars, row: "" },
      data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
    });

    let rowStr = "";
    for (let j = 0; j < stars; j++) {
      rowStr += "*";

      for (let prev = 0; prev < j; prev++) {
        const c = cells.find((cell) => cell.row === i - 1 && cell.col === prev);
        if (c) c.state = "printed";
      }

      const current = cells.find((cell) => cell.row === i - 1 && cell.col === j);
      if (current) current.state = "active";

      steps.push({
        id: "print_star",
        explanation: `Append star ${j + 1} of ${stars} to row ${i}.`,
        variables: { i, j, stars, row: rowStr },
        data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
      });
    }

    for (let c = 0; c < stars; c++) {
      const cell = cells.find((cl) => cl.row === i - 1 && cl.col === c);
      if (cell) cell.state = "done";
    }

    steps.push({
      id: "row_done",
      explanation: `Row ${i} is complete: add "${rowStr}" to the result.`,
      variables: { i, j: stars - 1, stars, row: rowStr },
      data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: i - 1 },
    });
  }

  steps.push({
    id: "complete",
    explanation: `All ${n} rows printed. The inverted triangle is complete.`,
    variables: { i: n, j: -1 },
    data: { cells: JSON.parse(JSON.stringify(cells)), activeRow: -1 },
  });

  return steps;
}

export function InvertedRightAngledTriangleProblemSimulation() {
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
      title="Inverted Right-Angled Triangle"
      slug="inverted-right-angled-triangle"
      approaches={approaches}
      presets={PRESETS}
      formatInputDisplay={(input: TriangleInput) => `n = ${input.n}`}
    />
  );
}
