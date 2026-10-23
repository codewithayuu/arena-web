"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { RotateCcw } from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

// ==========================================
// A. GRID-BASED BACKTRACKING SIMULATIONS
// ==========================================

interface GridCell {
  text: string;
  state:
    | "empty"
    | "current"
    | "placed"
    | "conflict"
    | "backtrack"
    | "match"
    | "path"
    | "visited"
    | "wall"
    | "given"
    | "start"
    | "goal";
}

interface GridFrame {
  rows: number;
  cols: number;
  cells: GridCell[];
  regionLines?: boolean; // For 9x9 sudoku
  note: string;
  metrics: { label: string; value: string }[];
  resultText?: string;
}

// 1. N-QUEENS
export function NQueensSimulation() {
  const [n, setN] = useState<number>(6);
  const sizes = [5, 6, 7];

  const frames = useMemo<GridFrame[]>(() => {
    const list: GridFrame[] = [];
    const board = Array(n).fill(-1);
    let placed = 0;
    let backtracks = 0;
    let isSolved = false;

    const pushFrame = (note: string, active?: { r: number; c: number; state: GridCell["state"] }, resultText = "") => {
      const cells: GridCell[] = [];
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          let state: GridCell["state"] = "empty";
          let text = "";
          if (board[r] === c) {
            state = isSolved ? "match" : "placed";
            text = "♛";
          }
          if (active && active.r === r && active.c === c) {
            state = active.state;
            if (active.state === "current" || active.state === "conflict" || active.state === "placed") {
              text = "♛";
            }
          }
          cells.push({ text, state });
        }
      }
      list.push({
        rows: n,
        cols: n,
        cells,
        note,
        metrics: [
          { label: "placed", value: String(placed) },
          { label: "backtracks", value: String(backtracks) },
        ],
        resultText,
      });
    };

    const isSafe = (row: number, col: number) => {
      for (let r = 0; r < row; r++) {
        const c = board[r];
        if (c === col || Math.abs(c - col) === row - r) {
          return false;
        }
      }
      return true;
    };

    // Initial frame
    pushFrame("Ready to place queens row by row", undefined, "");

    const solve = (row: number): boolean => {
      if (row === n) return true;

      for (let col = 0; col < n; col++) {
        pushFrame(`row ${row}: try column ${col}`, { r: row, c: col, state: "current" });

        if (isSafe(row, col)) {
          board[row] = col;
          placed++;
          pushFrame(`place queen at (${row}, ${col})`, { r: row, c: col, state: "placed" });

          if (solve(row + 1)) return true;

          board[row] = -1;
          backtracks++;
          pushFrame(`backtrack from (${row}, ${col})`, { r: row, c: col, state: "backtrack" });
        } else {
          pushFrame(`(${row}, ${col}) is attacked`, { r: row, c: col, state: "conflict" });
        }
      }
      return false;
    };

    solve(0);
    isSolved = true;
    pushFrame("Solution found!", undefined, `solution found in ${placed} placements, ${backtracks} backtracks`);

    return list;
  }, [n]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-foreground">N-Queens</h3>
            <div className="flex rounded-md border border-border overflow-hidden text-xs">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setN(s);
                    playback.stop();
                  }}
                  disabled={playback.isPlaying}
                  className={`px-2 py-0.5 transition-colors ${
                    n === s ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
                  } disabled:opacity-50`}
                >
                  {s}×{s}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Place one queen per row; if attacked, try the next column, and backtrack when a row has no safe square.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <GridRenderer title="N QUEENS" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 2. SUDOKU SOLVER
const SOLVED_SUDOKU = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];
const SUDOKU_HOLES = [2, 8, 13, 24, 27, 40, 53, 55, 66, 73, 77];

export function SudokuSolverSimulation() {
  const frames = useMemo<GridFrame[]>(() => {
    const puzzle = [...SOLVED_SUDOKU];
    for (const hole of SUDOKU_HOLES) puzzle[hole] = 0;
    const isGiven = puzzle.map((v) => v !== 0);

    const list: GridFrame[] = [];
    const board = [...puzzle];
    let placed = 0;
    let backtracks = 0;
    let isSolved = false;

    const pushFrame = (
      note: string,
      active?: { idx: number; state: GridCell["state"]; text?: string },
      resultText = ""
    ) => {
      const cells: GridCell[] = board.map((val, i) => {
        let state: GridCell["state"] = val === 0 ? "empty" : isGiven[i] ? "given" : isSolved ? "match" : "placed";
        let text = val === 0 ? "" : String(val);
        if (active && active.idx === i) {
          state = active.state;
          if (active.text !== undefined) text = active.text;
        }
        return { text, state };
      });

      list.push({
        rows: 9,
        cols: 9,
        cells,
        regionLines: true,
        note,
        metrics: [
          { label: "placed", value: String(placed) },
          { label: "backtracks", value: String(backtracks) },
        ],
        resultText,
      });
    };

    const isValid = (r: number, c: number, digit: number) => {
      for (let i = 0; i < 9; i++) {
        if (board[r * 9 + i] === digit || board[i * 9 + c] === digit) return false;
      }
      const br = 3 * Math.floor(r / 3);
      const bc = 3 * Math.floor(c / 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[(br + i) * 9 + (bc + j)] === digit) return false;
        }
      }
      return true;
    };

    pushFrame("Sudoku puzzle loaded with empty cells to solve", undefined, "");

    const solve = (): boolean => {
      let emptyIdx = -1;
      for (let i = 0; i < 81; i++) {
        if (board[i] === 0) {
          emptyIdx = i;
          break;
        }
      }
      if (emptyIdx === -1) return true;

      const r = Math.floor(emptyIdx / 9);
      const c = emptyIdx % 9;

      for (let d = 1; d <= 9; d++) {
        if (isValid(r, c, d)) {
          board[emptyIdx] = d;
          placed++;
          pushFrame(`place ${d} at (${r}, ${c})`, { idx: emptyIdx, state: "placed", text: String(d) });

          if (solve()) return true;

          board[emptyIdx] = 0;
          backtracks++;
          pushFrame(`backtrack at (${r}, ${c})`, { idx: emptyIdx, state: "backtrack", text: "" });
        } else {
          pushFrame(`${d} clashes at (${r}, ${c})`, { idx: emptyIdx, state: "conflict", text: String(d) });
        }
      }
      return false;
    };

    solve();
    isSolved = true;
    pushFrame("Solved successfully!", undefined, `solved in ${placed} placements, ${backtracks} backtracks`);

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(140, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 140);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Sudoku Solver</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fill each empty cell with a valid digit 1–9; backtrack immediately when no candidate fits.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <GridRenderer title="SUDOKU SOLVER" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 3. MAZE SOLVER
const MAZE_GRID = [
  "S.....",
  ".####.",
  ".####.",
  ".####.",
  ".####.",
  "....#G",
];

export function MazeSolverSimulation() {
  const frames = useMemo<GridFrame[]>(() => {
    const rows = MAZE_GRID.length;
    const cols = MAZE_GRID[0].length;
    const grid = MAZE_GRID.map((r) => r.split(""));

    let start = [0, 0];
    let goal = [rows - 1, cols - 1];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === "S") start = [r, c];
        if (grid[r][c] === "G") goal = [r, c];
      }
    }

    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const path = Array.from({ length: rows }, () => Array(cols).fill(false));
    const list: GridFrame[] = [];
    let steps = 0;
    let backtracks = 0;
    let reached = false;

    const pushFrame = (note: string, active?: [number, number], resultText = "") => {
      const cells: GridCell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let state: GridCell["state"] = "empty";
          if (grid[r][c] === "#") {
            state = "wall";
          } else if (active && active[0] === r && active[1] === c) {
            state = "current";
          } else if (path[r][c]) {
            state = "path";
          } else if (visited[r][c]) {
            state = "visited";
          }

          if (r === start[0] && c === start[1]) {
            state = state === "path" || state === "current" ? state : "start";
          }
          if (r === goal[0] && c === goal[1]) {
            state = reached ? "match" : "goal";
          }

          const text = grid[r][c] === "S" ? "S" : grid[r][c] === "G" ? "G" : "";
          cells.push({ text, state });
        }
      }
      list.push({
        rows,
        cols,
        cells,
        note,
        metrics: [
          { label: "steps", value: String(steps) },
          { label: "backtracks", value: String(backtracks) },
        ],
        resultText,
      });
    };

    pushFrame("Find path from S to G using depth-first search", undefined, "");

    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    const dfs = (r: number, c: number): boolean => {
      visited[r][c] = true;
      path[r][c] = true;
      steps++;
      pushFrame(`visit (${r}, ${c})`, [r, c]);

      if (r === goal[0] && c === goal[1]) return true;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          grid[nr][nc] !== "#" &&
          !visited[nr][nc] &&
          dfs(nr, nc)
        ) {
          return true;
        }
      }

      path[r][c] = false;
      backtracks++;
      pushFrame(`dead end, backtrack from (${r}, ${c})`, undefined);
      return false;
    };

    dfs(start[0], start[1]);
    reached = true;
    pushFrame("Reached the goal!", undefined, `path found in ${steps} steps, ${backtracks} backtracks`);

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Maze Solver</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Depth-first search for a path from start S to goal G; back out of dead ends.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <GridRenderer title="MAZE SOLVER" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 4. WORD SEARCH
const WORD_GRID = ["GRAPH", "RAQVX", "LMNBK", "DWFEJ"];
const TARGET_WORD = "GRAPH";

export function WordSearchSimulation() {
  const frames = useMemo<GridFrame[]>(() => {
    const rows = WORD_GRID.length;
    const cols = WORD_GRID[0].length;
    const grid = WORD_GRID.map((r) => r.split(""));
    const inPath = Array.from({ length: rows }, () => Array(cols).fill(false));
    const list: GridFrame[] = [];
    let matchedLen = 0;
    let backtracks = 0;
    let isFound = false;

    const pushFrame = (note: string, active?: [number, number], resultText = "") => {
      const cells: GridCell[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let state: GridCell["state"] = "empty";
          if (active && active[0] === r && active[1] === c) {
            state = "current";
          } else if (inPath[r][c]) {
            state = isFound ? "match" : "path";
          }
          cells.push({ text: grid[r][c], state });
        }
      }
      list.push({
        rows,
        cols,
        cells,
        note,
        metrics: [
          { label: "matched", value: String(matchedLen) },
          { label: "backtracks", value: String(backtracks) },
        ],
        resultText,
      });
    };

    pushFrame(`Search grid for word "${TARGET_WORD}"`, undefined, "");

    const dirs = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ];

    const dfs = (r: number, c: number, depth: number): boolean => {
      inPath[r][c] = true;
      matchedLen = depth + 1;
      pushFrame(`match ${TARGET_WORD[depth]} at (${r}, ${c})`, [r, c]);

      if (depth === TARGET_WORD.length - 1) return true;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !inPath[nr][nc] &&
          grid[nr][nc] === TARGET_WORD[depth + 1] &&
          dfs(nr, nc, depth + 1)
        ) {
          return true;
        }
      }

      inPath[r][c] = false;
      matchedLen = depth;
      backtracks++;
      pushFrame(`mismatch, backtrack from (${r}, ${c})`, undefined);
      return false;
    };

    let found = false;
    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols && !found; c++) {
        if (grid[r][c] === TARGET_WORD[0]) {
          found = dfs(r, c, 0);
        }
      }
    }

    isFound = true;
    pushFrame(`found "${TARGET_WORD}"!`, undefined, `matched "${TARGET_WORD}" in ${backtracks} backtracks`);

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(220, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 220);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Word Search</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Depth-first search the grid for the target word "{TARGET_WORD}", backtracking on any mismatch.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <GridRenderer title="WORD SEARCH" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// Shared Grid SVG Renderer
function GridRenderer({ title, frame }: { title: string; frame: GridFrame }) {
  const vbW = 720;
  const vbH = 540;
  const maxCell = 54;
  const top = 70;
  const budgetW = 460;
  const budgetH = 380;
  const headerY = 16;
  const noteY = 44;

  const { rows, cols, cells, regionLines, note, metrics, resultText } = frame;
  const cellSize = Math.min(maxCell, Math.floor(budgetW / cols), Math.floor(budgetH / rows));
  const gridW = cellSize * cols;
  const gridH = cellSize * rows;
  const startX = (vbW - gridW) / 2;
  const startY = top;

  const fontSize = title.includes("QUEENS") ? 0.55 * cellSize : 0.46 * cellSize;

  return (
    <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto select-none"
        style={{ fontFamily: MONO_FONT }}
        textRendering="geometricPrecision"
      >
        <GlowDefs
          prefix="bt"
          colors={[
            ["cyan", COLOR_CYAN],
            ["green", COLOR_GREEN],
            ["red", COLOR_RED],
            ["yellow", COLOR_YELLOW],
          ]}
        />

        {/* Header & Metrics */}
        <text
          x={startX}
          y={headerY}
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={800}
          fontSize={13}
        >
          {title}
        </text>
        <text
          x={startX + gridW}
          y={headerY}
          textAnchor="end"
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={800}
          fontSize={13}
        >
          {metrics.map((m) => `${m.label} ${m.value}`).join("  ·  ")}
        </text>

        {/* Note */}
        {note ? (
          <text
            x={vbW / 2}
            y={noteY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={COLOR_CYAN}
            fontWeight={800}
            fontSize={13}
          >
            {note}
          </text>
        ) : null}

        {/* Cells */}
        {cells.map((cell, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const cx = startX + c * cellSize;
          const cy = startY + r * cellSize;

          let fill = "#000000";
          let stroke = "rgba(255,255,255,0.18)";
          let inkDark = false;

          switch (cell.state) {
            case "current":
              fill = COLOR_YELLOW;
              stroke = COLOR_YELLOW;
              inkDark = true;
              break;
            case "placed":
            case "match":
              fill = COLOR_GREEN;
              stroke = COLOR_GREEN;
              inkDark = true;
              break;
            case "conflict":
              fill = COLOR_RED;
              stroke = COLOR_RED;
              inkDark = true;
              break;
            case "backtrack":
              fill = "#FDBA74"; // Solid Peach
              stroke = "#FDBA74";
              inkDark = true;
              break;
            case "path":
              fill = COLOR_CYAN;
              stroke = COLOR_CYAN;
              inkDark = true;
              break;
            case "visited":
              fill = "#18181b";
              stroke = "rgba(255,255,255,0.15)";
              break;
            case "wall":
              fill = "#09090b";
              stroke = "rgba(255,255,255,0.08)";
              break;
            case "given":
              fill = "#000000";
              stroke = "rgba(255,255,255,0.25)";
              break;
            case "start":
              fill = COLOR_GREEN;
              stroke = COLOR_GREEN;
              inkDark = true;
              break;
            case "goal":
              fill = COLOR_YELLOW;
              stroke = COLOR_YELLOW;
              inkDark = true;
              break;
          }

          return (
            <g key={`cell-${idx}`}>
              <rect
                x={cx + 1}
                y={cy + 1}
                width={cellSize - 2}
                height={cellSize - 2}
                rx={cellSize > 40 ? 6 : 4}
                fill={fill}
                stroke={stroke}
                strokeWidth={inkDark ? 2 : 1}
              />
              {cell.text ? (
                <text
                  x={cx + cellSize / 2}
                  y={cy + cellSize / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={inkDark ? "#09090b" : "#FFFFFF"}
                  fontSize={fontSize}
                  fontWeight={800}
                >
                  {cell.text}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Subgrid region lines (for Sudoku) */}
        {regionLines
          ? [0, 3, 6, 9].map((k) => (
              <g key={`rl-${k}`}>
                <line
                  x1={startX + k * cellSize}
                  y1={startY}
                  x2={startX + k * cellSize}
                  y2={startY + gridH}
                  stroke="#f4f4f5"
                  strokeWidth={2}
                  opacity={0.5}
                />
                <line
                  x1={startX}
                  y1={startY + k * cellSize}
                  x2={startX + gridW}
                  y2={startY + k * cellSize}
                  stroke="#f4f4f5"
                  strokeWidth={2}
                  opacity={0.5}
                />
              </g>
            ))
          : null}

        {/* Result text */}
        {resultText ? (
          <text
            x={vbW / 2}
            y={startY + gridH + 28}
            textAnchor="middle"
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontSize={15}
            fontWeight={800}
            style={{ letterSpacing: "0.4px" }}
          >
            {resultText}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

// ==========================================
// B. TREE-BASED BACKTRACKING SIMULATIONS
// ==========================================

interface TreeNode {
  id: number;
  label: string;
  depth: number;
  children: number[];
  isSolution: boolean;
  pruned: boolean;
  result?: string;
  x: number;
  y: number;
  state: "idle" | "current" | "solution" | "pruned" | "path" | "done";
}

interface TreeFrame {
  nodes: TreeNode[];
  edges: { from: number; to: number; onPath: boolean }[];
  maxX: number;
  maxDepth: number;
  partial: string;
  results: string[];
  note: string;
  metrics: { label: string; value: string }[];
  resultText?: string;
}

class TreeLayoutBuilder {
  nodes: Omit<TreeNode, "state">[] = [];

  add(
    label: string,
    depth: number,
    opts: { isSolution?: boolean; pruned?: boolean; result?: string } = {}
  ): number {
    const id = this.nodes.length;
    this.nodes.push({
      id,
      label,
      depth,
      children: [],
      isSolution: !!opts.isSolution,
      pruned: !!opts.pruned,
      result: opts.result,
      x: 0,
      y: 0,
    });
    return id;
  }

  layout(root: number) {
    let nextX = 0;
    const compute = (u: number) => {
      const node = this.nodes[u];
      node.y = node.depth;
      if (node.children.length === 0) {
        node.x = nextX;
        nextX += 1;
      } else {
        node.children.forEach(compute);
        node.x =
          (this.nodes[node.children[0]].x +
            this.nodes[node.children[node.children.length - 1]].x) /
          2;
      }
    };
    compute(root);
  }
}

function simulateTreeTraversal(
  tree: TreeLayoutBuilder,
  root: number,
  labelFn: (n: Omit<TreeNode, "state">) => string
): { frames: TreeFrame[] } {
  const maxX = Math.max(...tree.nodes.map((n) => n.x));
  const maxDepth = Math.max(...tree.nodes.map((n) => n.depth));

  const allEdges: { from: number; to: number }[] = [];
  for (const n of tree.nodes) {
    for (const ch of n.children) {
      allEdges.push({ from: n.id, to: ch });
    }
  }

  const frames: TreeFrame[] = [];
  const currentStack: number[] = [];
  const visitedDone = new Set<number>();
  const solutions = new Set<number>();
  const prunedSet = new Set<number>();
  const resultsAccum: string[] = [];
  let exploredCount = 0;

  const pushFrame = (note: string, activeId: number, resultText = "") => {
    const stackSet = new Set(currentStack);
    const nodeSnapshots: TreeNode[] = tree.nodes.map((n) => {
      let st: TreeNode["state"] = "idle";
      if (n.id === activeId) st = "current";
      else if (solutions.has(n.id)) st = "solution";
      else if (prunedSet.has(n.id)) st = "pruned";
      else if (stackSet.has(n.id)) st = "path";
      else if (visitedDone.has(n.id)) st = "done";

      return { ...n, state: st };
    });

    const edgeSnapshots = allEdges.map((e) => ({
      ...e,
      onPath: stackSet.has(e.from) && stackSet.has(e.to),
    }));

    frames.push({
      nodes: nodeSnapshots,
      edges: edgeSnapshots,
      maxX,
      maxDepth,
      partial: activeId >= 0 ? labelFn(tree.nodes[activeId]) : "",
      results: [...resultsAccum],
      note,
      metrics: [
        { label: "explored", value: String(exploredCount) },
        { label: "solutions", value: String(resultsAccum.length) },
      ],
      resultText,
    });
  };

  const dfs = (u: number) => {
    const node = tree.nodes[u];
    currentStack.push(u);
    exploredCount++;
    pushFrame(`explore ${labelFn(node)}`, u);

    if (node.pruned) {
      prunedSet.add(u);
      pushFrame(`prune ${labelFn(node)}`, u);
      currentStack.pop();
      return;
    }

    if (node.isSolution) {
      solutions.add(u);
      if (node.result) resultsAccum.push(node.result);
      pushFrame(`solution ${labelFn(node)}`, u);
    }

    for (const ch of node.children) {
      dfs(ch);
      pushFrame(`back to ${labelFn(node)}`, u);
    }

    visitedDone.add(u);
    currentStack.pop();
  };

  dfs(root);
  pushFrame("done", -1, `found ${resultsAccum.length} results`);

  return { frames };
}

// 5. SUBSETS
const SUBSETS_ELEMENTS = [1, 2, 3];

export function SubsetsSimulation() {
  const frames = useMemo<TreeFrame[]>(() => {
    const tree = new TreeLayoutBuilder();
    const format = (arr: number[]) => (arr.length ? `{${arr.join(",")}}` : "{}");

    const build = (start: number, curr: number[], depth: number): number => {
      const id = tree.add(format(curr), depth, {
        isSolution: true,
        result: format(curr),
      });
      for (let i = start; i < SUBSETS_ELEMENTS.length; i++) {
        tree.nodes[id].children.push(build(i + 1, [...curr, SUBSETS_ELEMENTS[i]], depth + 1));
      }
      return id;
    };

    const root = build(0, [], 0);
    tree.layout(root);
    return simulateTreeTraversal(tree, root, (n) => n.label).frames;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Subsets</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            At each element choose to include it or not; every node in the recursion tree forms a valid subset.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <TreeRenderer title="SUBSETS" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 6. PERMUTATIONS
const PERMUTATIONS_ELEMENTS = [1, 2, 3];

export function PermutationsSimulation() {
  const frames = useMemo<TreeFrame[]>(() => {
    const tree = new TreeLayoutBuilder();
    const n = PERMUTATIONS_ELEMENTS.length;
    const used = Array(n).fill(false);

    const build = (curr: number[], depth: number): number => {
      const isSol = curr.length === n;
      const label = curr.length ? curr.join(" ") : "·";
      const id = tree.add(label, depth, {
        isSolution: isSol,
        result: isSol ? curr.join(" ") : undefined,
      });

      if (!isSol) {
        for (let i = 0; i < n; i++) {
          if (!used[i]) {
            used[i] = true;
            tree.nodes[id].children.push(build([...curr, PERMUTATIONS_ELEMENTS[i]], depth + 1));
            used[i] = false;
          }
        }
      }
      return id;
    };

    const root = build([], 0);
    tree.layout(root);
    return simulateTreeTraversal(tree, root, (n) => n.label).frames;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Permutations</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick an unused element at each level; every complete path down to a leaf is a full ordering.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <TreeRenderer title="PERMUTATIONS" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 7. GENERATE PARENTHESES
export function GenerateParenthesesSimulation() {
  const frames = useMemo<TreeFrame[]>(() => {
    const tree = new TreeLayoutBuilder();

    const build = (s: string, open: number, close: number, depth: number): number => {
      const isSol = s.length === 6;
      const id = tree.add(s || "ε", depth, {
        isSolution: isSol,
        result: isSol ? s : undefined,
      });

      if (!isSol) {
        if (open < 3) {
          tree.nodes[id].children.push(build(s + "(", open + 1, close, depth + 1));
        }
        if (close < open) {
          tree.nodes[id].children.push(build(s + ")", open, close + 1, depth + 1));
        }
      }
      return id;
    };

    const root = build("", 0, 0, 0);
    tree.layout(root);
    return simulateTreeTraversal(tree, root, (n) => n.label).frames;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Generate Parentheses</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add '(' while open brackets remain, and ')' while valid; complete balanced strings of length 6 are solutions.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <TreeRenderer title="GENERATE PARENTHESES" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// 8. COMBINATION SUM
const COMBINATION_CANDIDATES = [2, 3, 5];
const COMBINATION_TARGET = 8;

export function CombinationSumSimulation() {
  const frames = useMemo<TreeFrame[]>(() => {
    const tree = new TreeLayoutBuilder();
    const format = (curr: number[], sum: number) => `${curr.length ? curr.join("+") : "0"}=${sum}`;

    const build = (start: number, curr: number[], sum: number, depth: number): number => {
      if (sum > COMBINATION_TARGET) {
        return tree.add(format(curr, sum), depth, { pruned: true });
      }
      const isSol = sum === COMBINATION_TARGET;
      const id = tree.add(format(curr, sum), depth, {
        isSolution: isSol,
        result: isSol ? curr.join("+") : undefined,
      });

      if (!isSol) {
        for (let i = start; i < COMBINATION_CANDIDATES.length; i++) {
          tree.nodes[id].children.push(build(i, [...curr, COMBINATION_CANDIDATES[i]], sum + COMBINATION_CANDIDATES[i], depth + 1));
        }
      }
      return id;
    };

    const root = build(0, [], 0, 0);
    tree.layout(root);
    return simulateTreeTraversal(tree, root, (n) => n.label).frames;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(180, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 180);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Combination Sum</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pick candidates [2, 3, 5] toward target 8; prune a branch as soon as the running sum overshoots.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <TreeRenderer title="COMBINATION SUM" frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// Shared Tree SVG Renderer
function TreeRenderer({ title, frame }: { title: string; frame: TreeFrame }) {
  const vbW = 760;
  const vbH = 432;
  const treeX = 40;
  const treeW = 500;
  const treeY = 84;
  const treeH = 268;
  const nodeH = 22;

  const { nodes, edges, maxX, maxDepth, partial, results, note, metrics, resultText } = frame;

  const scaleX = (x: number) => treeX + (maxX > 0 ? (x / maxX) * treeW : treeW / 2);
  const scaleY = (depth: number) => treeY + (maxDepth > 0 ? (depth / maxDepth) * treeH : 0);

  const coords = new Map<number, { x: number; y: number }>();
  for (const n of nodes) {
    coords.set(n.id, { x: scaleX(n.x), y: scaleY(n.y) });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto select-none"
        style={{ fontFamily: MONO_FONT }}
        textRendering="geometricPrecision"
      >
        <GlowDefs
          prefix="rec"
          colors={[
            ["cyan", COLOR_CYAN],
            ["green", COLOR_GREEN],
            ["red", COLOR_RED],
            ["yellow", COLOR_YELLOW],
          ]}
        />

        {/* Header & Metrics */}
        <text
          x={treeX}
          y={16}
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={800}
          fontSize={13}
        >
          {title}
        </text>
        <text
          x={vbW - 20}
          y={16}
          textAnchor="end"
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={800}
          fontSize={13}
        >
          {metrics.map((m) => `${m.label} ${m.value}`).join("  ·  ")}
        </text>

        {/* Note */}
        {note ? (
          <text
            x={treeX}
            y={40}
            dominantBaseline="hanging"
            fill={COLOR_CYAN}
            fontWeight={800}
            fontSize={12}
          >
            {note}
          </text>
        ) : null}

        {/* Building status */}
        <text
          x={treeX}
          y={60}
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={700}
          fontSize={11}
        >
          building:{" "}
          <tspan fill="#f4f4f5" fontWeight={800}>
            {partial || "·"}
          </tspan>
        </text>

        {/* Edges */}
        {edges.map((e, idx) => {
          const from = coords.get(e.from)!;
          const to = coords.get(e.to)!;
          return (
            <line
              key={`edge-${idx}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={e.onPath ? COLOR_YELLOW : "rgba(255,255,255,0.2)"}
              strokeWidth={e.onPath ? 2.5 : 1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pt = coords.get(node.id)!;
          const w = Math.max(26, node.label.length * 6.8 + 16);

          let fill = "#000000";
          let stroke = "rgba(255,255,255,0.2)";
          let inkDark = false;

          switch (node.state) {
            case "current":
              fill = COLOR_YELLOW;
              stroke = COLOR_YELLOW;
              inkDark = true;
              break;
            case "solution":
              fill = COLOR_GREEN;
              stroke = COLOR_GREEN;
              inkDark = true;
              break;
            case "pruned":
              fill = COLOR_RED;
              stroke = COLOR_RED;
              inkDark = true;
              break;
            case "path":
              fill = "#FDBA74"; // Solid Peach
              stroke = "#FDBA74";
              inkDark = true;
              break;
            case "done":
              fill = "#000000";
              stroke = "rgba(255,255,255,0.2)";
              break;
          }

          return (
            <g key={`node-${node.id}`}>
              <rect
                x={pt.x - w / 2}
                y={pt.y - nodeH / 2}
                width={w}
                height={nodeH}
                rx={Math.min(9, nodeH / 2)}
                fill={fill}
                stroke={stroke}
                strokeWidth={inkDark ? 2 : 1.25}
              />
              <text
                x={pt.x}
                y={pt.y + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={inkDark ? "#09090b" : "#FFFFFF"}
                fontSize={12}
                fontWeight={800}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {/* Results Sidebar Panel */}
        <text
          x={566}
          y={treeY - 22}
          dominantBaseline="hanging"
          fill="#a1a1aa"
          fontWeight={800}
          fontSize={11}
          style={{ letterSpacing: "0.5px" }}
        >
          RESULTS ({results.length})
        </text>
        {results.slice(0, 11).map((res, idx) => {
          const ry = treeY - 4 + 23 * idx;
          return (
            <g key={`res-${idx}`}>
              <rect
                x={566}
                y={ry}
                width={170}
                height={18}
                rx={5}
                fill="#1f1f22"
                stroke={COLOR_GREEN}
                strokeWidth={1}
                opacity={0.95}
              />
              <text
                x={575}
                y={ry + 9.5}
                dominantBaseline="central"
                fill="#f4f4f5"
                fontSize={10}
                fontWeight={800}
              >
                {res}
              </text>
            </g>
          );
        })}

        {/* Result summary text at bottom */}
        {resultText ? (
          <text
            x={vbW / 2}
            y={vbH - 16}
            textAnchor="middle"
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontSize={14}
            fontWeight={800}
            style={{ letterSpacing: "0.4px" }}
          >
            {resultText}
          </text>
        ) : null}
      </svg>
    </div>
  );
}

// ==========================================
// C. SUBSETS VIA BITMASK SIMULATION
// ==========================================

const BITMASK_ELEMENTS = ["a", "b", "c"];
const BITMASK_COUNT = 1 << BITMASK_ELEMENTS.length; // 8

function formatSubsetBitmask(mask: number) {
  const chosen = BITMASK_ELEMENTS.filter((_, idx) => (mask >> idx) & 1);
  return "{" + chosen.join(", ") + "}";
}

interface BitmaskFrame {
  mask: number;
  bits: number[];
  revealed: number;
  expr: string;
  note: string;
  resultText?: string;
}

export function SubsetsBitmaskSimulation() {
  const frames = useMemo<BitmaskFrame[]>(() => {
    const list: BitmaskFrame[] = [];
    const n = BITMASK_ELEMENTS.length;

    for (let m = 0; m < BITMASK_COUNT; m++) {
      const bits = Array.from({ length: n }, (_, idx) => (m >> idx) & 1);
      const binStr = m.toString(2).padStart(n, "0");
      list.push({
        mask: m,
        bits,
        revealed: m + 1,
        expr: `mask ${m} = ${binStr}`,
        note: `Mask ${m} (${binStr}) selects subset ${formatSubsetBitmask(m)}`,
        resultText: "",
      });
    }

    list.push({
      mask: BITMASK_COUNT,
      bits: Array(n).fill(0),
      revealed: BITMASK_COUNT,
      expr: `2^${n} = ${BITMASK_COUNT}`,
      note: `All ${BITMASK_COUNT} subsets generated (one per integer mask)`,
      resultText: `${BITMASK_COUNT} subsets from ${n} elements (2^${n})`,
    });

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(700, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 700);
  }, [playback, frames]);

  const vbW = 420;
  const vbH = 296;
  const n = BITMASK_ELEMENTS.length;
  const cellW = 32;
  const cellH = 38;
  const cellGap = 6;
  const totalBitW = n * cellW + (n - 1) * cellGap;
  const startBitX = (vbW - totalBitW) / 2;

  const cards = Array.from({ length: BITMASK_COUNT }, (_, idx) => ({
    mask: idx,
    binary: idx.toString(2).padStart(n, "0"),
    subset: formatSubsetBitmask(idx),
  }));

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Subsets via Bitmask</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Count from 0 to 2^n - 1; bit i of each mask decides whether element i joins the subset.
          </p>
        </div>
        <SimpleTooltip content="Reset">
          <button
            onClick={() => playback.stop()}
            disabled={playback.isPlaying}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="w-full h-auto select-none"
          style={{ fontFamily: MONO_FONT }}
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="sb"
            colors={[
              ["cyan", COLOR_CYAN],
              ["green", COLOR_GREEN],
              ["yellow", COLOR_YELLOW],
            ]}
          />

          {/* Header */}
          <text
            x={16}
            y={16}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontWeight={800}
            fontSize={13}
            style={{ letterSpacing: "0.5px" }}
          >
            SUBSETS
          </text>
          {currentFrame.expr ? (
            <text
              x={404}
              y={16}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontWeight={800}
              fontSize={13}
            >
              {currentFrame.expr}
            </text>
          ) : null}

          {/* Element labels above bits */}
          {BITMASK_ELEMENTS.map((el, idx) => (
            <text
              key={`el-${idx}`}
              x={startBitX + idx * (cellW + cellGap) + cellW / 2}
              y={50}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#a1a1aa"
              fontWeight={800}
              fontSize={12}
            >
              {el}
            </text>
          ))}

          {/* Bit cells row */}
          {currentFrame.bits.map((bit, idx) => {
            const bx = startBitX + idx * (cellW + cellGap);
            const isOne = bit === 1;
            const fill = isOne ? COLOR_GREEN : "#27272a";
            const stroke = isOne ? COLOR_GREEN : "rgba(161,161,170,0.4)";
            const textFill = isOne ? "#18181b" : "#a1a1aa";

            return (
              <g key={`bit-${idx}`}>
                <rect
                  x={bx}
                  y={62}
                  width={cellW}
                  height={cellH}
                  rx={7}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isOne ? 2 : 1.25}
                />
                <text
                  x={bx + cellW / 2}
                  y={62 + cellH / 2 + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textFill}
                  fontSize={16}
                  fontWeight={800}
                >
                  {bit}
                </text>
                {/* Index label below */}
                <text
                  x={bx + cellW / 2}
                  y={62 + cellH + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#71717a"
                  fontSize={10}
                  fontWeight={700}
                >
                  {idx}
                </text>
              </g>
            );
          })}

          {/* Subsets 8 cards grid (2 cols x 4 rows) */}
          {cards.map((card, idx) => {
            const col = idx < 4 ? 0 : 1;
            const row = idx % 4;
            const cx = 28 + col * 190;
            const cy = 132 + row * 30;
            const isCurrent = card.mask === currentFrame.mask;
            const isRevealed = idx < currentFrame.revealed;

            const cardFill = isCurrent ? COLOR_CYAN : "#27272a";
            const cardStroke = isCurrent ? COLOR_CYAN : "rgba(161,161,170,0.4)";

            return (
              <g key={`card-${idx}`} opacity={isRevealed ? 1 : 0.22}>
                <rect
                  x={cx}
                  y={cy}
                  width={166}
                  height={24}
                  rx={6}
                  fill={cardFill}
                  stroke={cardStroke}
                  strokeWidth={isCurrent ? 2 : 1.25}
                  filter={isCurrent ? "url(#sb-glow-cyan)" : undefined}
                />
                <text
                  x={cx + 10}
                  y={cy + 12}
                  dominantBaseline="central"
                  fill={isCurrent ? "#18181b" : "#a1a1aa"}
                  fontWeight={700}
                  fontSize={11}
                >
                  {card.binary}
                </text>
                <text
                  x={cx + 48}
                  y={cy + 12}
                  dominantBaseline="central"
                  fill={isCurrent ? "#18181b" : "#f4f4f5"}
                  fontWeight={800}
                  fontSize={11.5}
                >
                  {card.subset}
                </text>
              </g>
            );
          })}

          {/* Result text */}
          {currentFrame.resultText ? (
            <text
              x={210}
              y={276}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontSize={14}
              fontWeight={800}
              style={{ letterSpacing: "0.3px" }}
            >
              {currentFrame.resultText}
            </text>
          ) : null}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}
