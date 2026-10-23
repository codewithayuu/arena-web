"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

// ==========================================
// 1. Single Loop Simulation: O(n)
// ==========================================
export function SingleLoopSimulation() {
  const [size, setSize] = useState(12);

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < size; i++) {
      list.push({
        visit: i,
        ops: i + 1,
        narration: `Visit a[${i}], do constant O(1) work, advance pointer`,
        status: `Visiting a[${i}] · Operation ${i + 1} of ${size}`,
      });
    }
    list.push({
      visit: -1,
      ops: size,
      narration: "Every cell touched exactly once. Work scales 1:1 with n.",
      status: `Done: ${size} elements, ${size} operations · O(n)`,
    });
    return list;
  }, [size]);

  const idleFrame = useMemo(() => ({
    visit: -1,
    ops: 0,
    narration: "Press Run: one loop, one visit per element",
    status: `Ready · Array size n = ${size}`,
  }), [size]);

  const player = useSimulationPlayback(500, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 500);
  }, [frames, player]);

  const cellWidth = Math.min(52, Math.floor(800 / size) - 8);
  const totalArrayWidth = size * cellWidth + (size - 1) * 8;
  const startX = (960 - totalArrayWidth) / 2;

  return (
    <div className="w-full space-y-4">
      {/* Scenario controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A single loop sweeps an array from 0 to n-1. Operations grow directly proportional to input size.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {[8, 12, 16].map((n) => (
            <button
              key={n}
              onClick={() => {
                setSize(n);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                size === n ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              n = {n}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 260" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="sl" colors={[["cyan", "#06b6d4"], ["green", "#22c55e"]]} />

          {/* Badge */}
          <g>
            <rect x={810} y={10} width={120} height={22} rx={5} fill="none" stroke="#06b6d4" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#06b6d4" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n)
            </text>
          </g>

          {/* Narration */}
          <text x={28} y={16} dominantBaseline="hanging" fill="#06b6d4" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>
          <text x={28} y={40} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12}>
            {current.status}
          </text>

          {/* Array Cells */}
          {Array.from({ length: size }).map((_, i) => {
            const isCurrent = i === current.visit;
            const isVisited = current.visit >= 0 ? i < current.visit : current.ops === size;
            const x = startX + i * (cellWidth + 8);
            const y = 110;

            return (
              <g key={i} filter={isCurrent ? "url(#sl-glow-cyan)" : isVisited ? "url(#sl-glow-green)" : undefined}>
                <rect
                  x={x}
                  y={y}
                  width={cellWidth}
                  height={cellWidth}
                  rx={8}
                  fill={isCurrent ? "#06b6d4" : isVisited ? "#22c55e" : "#1f1f22"}
                  stroke={isCurrent ? "#06b6d4" : isVisited ? "#22c55e" : "rgba(161,161,170,0.3)"}
                  strokeWidth={isCurrent ? 2.5 : 1.25}
                />
                <text
                  x={x + cellWidth / 2}
                  y={y - 12}
                  textAnchor="middle"
                  fill="#71717a"
                  fontSize={10}
                  fontFamily="var(--font-mono, monospace)"
                >
                  [{i}]
                </text>
                <text
                  x={x + cellWidth / 2}
                  y={y + cellWidth / 2 + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCurrent || isVisited ? "#18181b" : "#a1a1aa"}
                  fontWeight={800}
                  fontSize={13}
                  fontFamily="var(--font-mono, monospace)"
                >
                  a[{i}]
                </text>
              </g>
            );
          })}

          {/* Operations Progress Bar */}
          <g>
            <rect x={startX} y={200} width={totalArrayWidth} height={8} rx={4} fill="#1f1f22" stroke="rgba(161,161,170,0.2)" />
            <rect
              x={startX}
              y={200}
              width={(current.ops / size) * totalArrayWidth}
              height={8}
              rx={4}
              fill="#22c55e"
              style={{ transition: "width 300ms ease" }}
            />
            <text x={startX + totalArrayWidth + 14} y={204} dominantBaseline="central" fill="#f4f4f5" fontWeight={800} fontSize={11} fontFamily="var(--font-mono, monospace)">
              {current.ops} / {size} ops
            </text>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 2. Nested Loop Simulation: O(n²)
// ==========================================
export function NestedLoopSimulation() {
  const [n, setN] = useState(6);
  const total = n * n;

  const frames = useMemo(() => {
    const list = [];
    for (let idx = 0; idx < total; idx++) {
      const i = Math.floor(idx / n);
      const j = idx % n;
      list.push({
        i,
        j,
        idx,
        ops: idx + 1,
        narration: `Row ${i}, Column ${j}: outer i=${i}, inner j=${j}`,
        status: `Cell (${i}, ${j}) · Operation ${idx + 1} of ${total}`,
      });
    }
    list.push({
      i: -1,
      j: -1,
      idx: -1,
      ops: total,
      narration: `Every (i, j) pair visited. Complete ${n} × ${n} matrix filled.`,
      status: `Done: ${n} × ${n} = ${total} operations · O(n²)`,
    });
    return list;
  }, [n, total]);

  const idleFrame = useMemo(() => ({
    i: -1,
    j: -1,
    idx: -1,
    ops: 0,
    narration: "Press Run: a loop inside a loop touches every (i, j) pair",
    status: `Ready · Matrix size ${n} × ${n} (${total} operations)`,
  }), [n, total]);

  const player = useSimulationPlayback(280, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 280);
  }, [frames, player]);

  const cellSize = Math.min(36, Math.floor(220 / n));
  const matrixSize = n * cellSize + (n - 1) * 4;
  const startX = (960 - matrixSize) / 2;
  const startY = 80;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A loop inside a loop touches every (i, j) pair. Work grows quadratically with the square of n.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {[4, 6, 8].map((val) => (
            <button
              key={val}
              onClick={() => {
                setN(val);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                n === val ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              n = {val}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 360" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="nl" colors={[["orange", "#ffa94d"], ["cyan", "#06b6d4"], ["green", "#22c55e"]]} />

          {/* Badge */}
          <g>
            <rect x={810} y={10} width={120} height={22} rx={5} fill="none" stroke="#ffa94d" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n²)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>
          <text x={28} y={40} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12}>
            {current.status}
          </text>

          {/* Matrix Grid */}
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: n }).map((_, c) => {
              const cellIdx = r * n + c;
              const isCurrent = r === current.i && c === current.j;
              const isFilled = current.idx >= 0 ? cellIdx < current.idx : current.ops === total;
              const x = startX + c * (cellSize + 4);
              const y = startY + r * (cellSize + 4);

              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={5}
                  fill={isCurrent ? "#ffa94d" : isFilled ? "#22c55e" : "#1f1f22"}
                  stroke={isCurrent ? "#ffa94d" : isFilled ? "#22c55e" : "rgba(161,161,170,0.25)"}
                  strokeWidth={isCurrent ? 2 : 1}
                />
              );
            })
          )}

          {/* Operations Counter Box */}
          <g>
            <rect x={startX + matrixSize + 40} y={startY + 20} width={200} height={100} rx={8} fill="#18181b" stroke="rgba(161,161,170,0.3)" />
            <text x={startX + matrixSize + 56} y={startY + 46} fill="#a1a1aa" fontSize={11} fontFamily="var(--font-mono, monospace)">
              Outer loop i: <tspan fill="#ffa94d" fontWeight={800}>{current.i >= 0 ? current.i : n}</tspan> / {n}
            </text>
            <text x={startX + matrixSize + 56} y={startY + 70} fill="#a1a1aa" fontSize={11} fontFamily="var(--font-mono, monospace)">
              Inner loop j: <tspan fill="#06b6d4" fontWeight={800}>{current.j >= 0 ? current.j : n}</tspan> / {n}
            </text>
            <text x={startX + matrixSize + 56} y={startY + 94} fill="#f4f4f5" fontWeight={800} fontSize={12} fontFamily="var(--font-mono, monospace)">
              Total Work: <tspan fill="#22c55e">{current.ops}</tspan> / {total}
            </text>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 3. Triangular Loop Simulation: O(n²)
// ==========================================
export function TriangularLoopSimulation() {
  const [n, setN] = useState(6);
  const total = (n * (n - 1)) / 2;

  const frames = useMemo(() => {
    const list = [];
    let count = 0;
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        count++;
        list.push({
          i,
          j,
          count,
          narration: `Row ${i}: inner loop runs only while j < i (${i} times)`,
          status: `i = ${i}, j = ${j} · Pair ${count} of ${total}`,
        });
      }
    }
    list.push({
      i: -1,
      j: -1,
      count: total,
      narration: `Half the grid filled: n(n-1)/2 = 1/2 n² - 1/2 n. Half of n² is still O(n²)!`,
      status: `Done: ${total} pairs visited · O(n²)`,
    });
    return list;
  }, [n, total]);

  const idleFrame = useMemo(() => ({
    i: -1,
    j: -1,
    count: 0,
    narration: "Press Run: the inner loop only runs while j < i",
    status: `Ready · Triangular pairs = ${total}`,
  }), [total]);

  const player = useSimulationPlayback(300, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 300);
  }, [frames, player]);

  const cellSize = Math.min(36, Math.floor(220 / n));
  const matrixSize = n * cellSize + (n - 1) * 4;
  const startX = (960 - matrixSize) / 2;
  const startY = 80;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The inner loop only runs while j &lt; i, filling half the matrix. But constant factor 1/2 drops in asymptotic notation: still O(n²).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {[5, 6, 8].map((val) => (
            <button
              key={val}
              onClick={() => {
                setN(val);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                n === val ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              n = {val}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 360" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="tl" colors={[["orange", "#ffa94d"], ["green", "#22c55e"]]} />

          <g>
            <rect x={810} y={10} width={120} height={22} rx={5} fill="none" stroke="#ffa94d" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n²)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>
          <text x={28} y={40} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12}>
            {current.status}
          </text>

          {/* Triangular Grid */}
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: n }).map((_, c) => {
              const inTriangle = c < r;
              const isCurrent = r === current.i && c === current.j;
              const isFilled = inTriangle && (current.i > r || (current.i === r && current.j >= c) || current.count === total);
              const x = startX + c * (cellSize + 4);
              const y = startY + r * (cellSize + 4);

              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={5}
                  fill={isCurrent ? "#ffa94d" : isFilled ? "#22c55e" : inTriangle ? "#1f1f22" : "rgba(161,161,170,0.06)"}
                  stroke={isCurrent ? "#ffa94d" : isFilled ? "#22c55e" : inTriangle ? "rgba(161,161,170,0.25)" : "transparent"}
                  strokeWidth={isCurrent ? 2 : 1}
                />
              );
            })
          )}

          {/* Formula Breakdown Box */}
          <g>
            <rect x={startX + matrixSize + 40} y={startY + 20} width={220} height={110} rx={8} fill="#18181b" stroke="rgba(161,161,170,0.3)" />
            <text x={startX + matrixSize + 56} y={startY + 46} fill="#f4f4f5" fontWeight={800} fontSize={12} fontFamily="var(--font-mono, monospace)">
              Sum = 1 + 2 + ... + (n-1)
            </text>
            <text x={startX + matrixSize + 56} y={startY + 70} fill="#a1a1aa" fontSize={11} fontFamily="var(--font-mono, monospace)">
              Formula: n(n - 1) / 2
            </text>
            <text x={startX + matrixSize + 56} y={startY + 94} fill="#22c55e" fontWeight={800} fontSize={12} fontFamily="var(--font-mono, monospace)">
              Visited: {current.count} / {total} pairs
            </text>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 4. Halving Loop Simulation: O(log n)
// ==========================================
export function HalvingLoopSimulation() {
  const [n, setN] = useState(64);
  const maxSteps = Math.round(Math.log2(n));

  const frames = useMemo(() => {
    const list = [];
    for (let s = 1; s <= maxSteps; s++) {
      const rem = n / Math.pow(2, s);
      list.push({
        step: s,
        remaining: rem,
        narration: `Step ${s}: range halves from ${rem * 2} → ${rem}`,
        status: `Step ${s} of ${maxSteps} · Range = ${rem}`,
      });
    }
    list.push({
      step: maxSteps,
      remaining: 1,
      narration: "Range reduced to 1! Nothing left to divide.",
      status: `Done: ${n} → 1 in ${maxSteps} halving steps · O(log n)`,
    });
    return list;
  }, [n, maxSteps]);

  const idleFrame = useMemo(() => ({
    step: 0,
    remaining: n,
    narration: "Press Run: the search space halves at every single step",
    status: `Ready · Initial range n = ${n} (log₂(${n}) = ${maxSteps} steps)`,
  }), [n, maxSteps]);

  const player = useSimulationPlayback(800, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 800);
  }, [frames, player]);

  const barMaxW = 680;
  const currentW = Math.max(8, (current.remaining / n) * barMaxW);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Repeatedly dividing a search space in half reaches 1 in log₂(n) steps. This is the foundation of Binary Search.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {[16, 64, 256].map((val) => (
            <button
              key={val}
              onClick={() => {
                setN(val);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                n === val ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              n = {val}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 260" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="hl" colors={[["cyan", "#06b6d4"], ["green", "#22c55e"]]} />

          <g>
            <rect x={810} y={10} width={120} height={22} rx={5} fill="none" stroke="#06b6d4" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#06b6d4" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(log n)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#06b6d4" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>
          <text x={28} y={40} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12}>
            {current.status}
          </text>

          {/* Exponential Halving Bar */}
          <g>
            <text x={140} y={90} fill="#a1a1aa" fontSize={11} fontFamily="var(--font-mono, monospace)">
              Remaining Range: {current.remaining}
            </text>
            <rect x={140} y={110} width={barMaxW} height={40} rx={8} fill="#1f1f22" stroke="rgba(161,161,170,0.3)" />
            <rect
              x={140}
              y={110}
              width={currentW}
              height={40}
              rx={8}
              fill="#06b6d4"
              filter="url(#hl-glow-cyan)"
              style={{ transition: "width 500ms ease" }}
            />
          </g>

          {/* Steps Indicator */}
          <g>
            <text x={140} y={190} fill="#f4f4f5" fontWeight={800} fontSize={12} fontFamily="var(--font-mono, monospace)">
              Halving Steps: {current.step} / {maxSteps}
            </text>
            <text x={140} y={212} fill="#22c55e" fontSize={11} fontFamily="var(--font-mono, monospace)">
              2^{current.step} reduction factor = {Math.pow(2, current.step)}× smaller
            </text>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 5. Sequential Loops Simulation: O(n + m)
// ==========================================
const SEQ_SCENARIOS = [
  { id: "s85", name: "n = 8, m = 5", n: 8, m: 5 },
  { id: "s1010", name: "n = 10, m = 10", n: 10, m: 10 },
  { id: "s126", name: "n = 12, m = 6", n: 12, m: 6 },
];

export function SequentialLoopsSimulation() {
  const [scenarioId, setScenarioId] = useState(SEQ_SCENARIOS[1].id);
  const activeScenario = SEQ_SCENARIOS.find((s) => s.id === scenarioId) ?? SEQ_SCENARIOS[1];
  const { n, m } = activeScenario;
  const total = n + m;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push({
        row: 0,
        visit: i,
        ops: i + 1,
        narration: `First loop: visit A[${i}]`,
        status: `Loop 1: A[${i}], operation ${i + 1} of ${total}`,
      });
    }
    for (let j = 0; j < m; j++) {
      list.push({
        row: 1,
        visit: j,
        ops: n + j + 1,
        narration: `Second loop: visit B[${j}]`,
        status: `Loop 2: B[${j}], operation ${n + j + 1} of ${total}`,
      });
    }
    list.push({
      row: -1,
      visit: -1,
      ops: total,
      narration: "Two sweeps back to back: costs add, not multiply",
      status: `Done: ${n} + ${m} = ${total} operations`,
    });
    return list;
  }, [n, m, total]);

  const idleFrame = useMemo(() => ({
    row: -2,
    visit: -1,
    ops: 0,
    narration: "Press Play: sweep A fully, then sweep B",
    status: `Ready · Array A (n = ${n}) + Array B (m = ${m})`,
  }), [n, m]);

  const player = useSimulationPlayback(450, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 450);
  }, [frames, player]);

  const maxLen = Math.max(n, m);
  const cellW = Math.min(52, Math.floor(680 / maxLen) - 8);
  const startX = (960 - (maxLen * cellW + (maxLen - 1) * 8)) / 2 + 40;
  const isDone = current.ops === total && current.row === -1;

  const rows = [
    {
      len: n,
      y: 92,
      accent: "#3bc9db",
      tint: "rgba(59,201,219,0.16)",
      edge: "rgba(59,201,219,0.65)",
      label: `A, n = ${n}`,
      pointerLabel: "i",
      visitedThrough: current.row === 0 ? current.visit - 1 : current.row === 1 || isDone ? n - 1 : -1,
      activeIdx: current.row === 0 ? current.visit : -1,
      started: true,
    },
    {
      len: m,
      y: 188,
      accent: "#38d9a9",
      tint: "rgba(56,217,169,0.16)",
      edge: "rgba(56,217,169,0.65)",
      label: `B, m = ${m}`,
      pointerLabel: "j",
      visitedThrough: current.row === 1 ? current.visit - 1 : isDone ? m - 1 : -1,
      activeIdx: current.row === 1 ? current.visit : -1,
      started: current.row === 1 || isDone,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Two loops run one after the other, so their costs add instead of multiply: O(n + m).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {SEQ_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 336" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="seq" colors={[["cyan", "#00ceff"], ["teal", "#38d9a9"], ["green", "#69db7c"]]} />

          {/* Badge */}
          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#3bc9db" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#3bc9db" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n + m)
            </text>
          </g>

          {/* Narration */}
          <text x={28} y={16} dominantBaseline="hanging" fill="#3bc9db" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Rows */}
          {rows.map((row, rowIdx) => {
            const dimmed = !row.started && !isDone;
            return (
              <g key={rowIdx} opacity={dimmed ? 0.45 : 1} style={{ transition: "opacity 300ms" }}>
                <text x={startX - 18} y={row.y + 23} textAnchor="end" dominantBaseline="central" fill={dimmed ? "#71717a" : row.accent} fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={13}>
                  {row.label}
                </text>
                {Array.from({ length: row.len }).map((_, cIdx) => {
                  const isCurrent = current.row === rowIdx && cIdx === current.visit;
                  const isVisited = cIdx <= row.visitedThrough || isDone;
                  const fill = isCurrent ? "#00ceff" : isVisited ? row.tint : "#1f1f22";
                  const stroke = isCurrent ? "#00ceff" : isVisited ? row.edge : "rgba(161,161,170,0.35)";

                  return (
                    <g key={cIdx}>
                      <rect
                        x={startX + cIdx * (cellW + 8)}
                        y={row.y}
                        width={cellW}
                        height={46}
                        rx={8}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isCurrent ? 2.4 : 1.5}
                      />
                      <text
                        x={startX + cIdx * (cellW + 8) + cellW / 2}
                        y={row.y + 23}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isCurrent ? "#18181b" : isVisited ? "#f4f4f5" : "#a1a1aa"}
                        fontFamily="var(--font-mono, monospace)"
                        fontWeight={isCurrent ? 800 : 600}
                        fontSize={13}
                      >
                        {cIdx}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Pointer Arrow */}
          {current.row >= 0 && current.visit >= 0 && (
            <g>
              <polygon
                points={`${startX + current.visit * (cellW + 8) + cellW / 2},${rows[current.row].y - 8} ${startX + current.visit * (cellW + 8) + cellW / 2 - 8},${rows[current.row].y - 24} ${startX + current.visit * (cellW + 8) + cellW / 2 + 8},${rows[current.row].y - 24}`}
                fill="#00ceff"
              />
              <text
                x={startX + current.visit * (cellW + 8) + cellW / 2}
                y={rows[current.row].y - 30}
                textAnchor="middle"
                fill="#00ceff"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={800}
                fontSize={13}
              >
                {rows[current.row].pointerLabel} = {current.visit}
              </text>
            </g>
          )}

          {/* Bottom Operations Counter */}
          <text x={28} y={284} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            OPERATIONS
          </text>
          <text x={28} y={302} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.ops}
          </text>

          {isDone ? (
            <text x={480} y={296} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n} + {m} = {total} operations, still linear → O(n + m)
            </text>
          ) : (
            <text x={140} y={306} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              n + m operations total
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 6. Loop + Binary Search Simulation: O(n log n)
// ==========================================
const LBS_SCENARIOS = [
  { id: "b8", name: "n = 8", n: 8 },
  { id: "b16", name: "n = 16", n: 16 },
  { id: "b32", name: "n = 32", n: 32 },
];

export function LoopBinarySearchSimulation() {
  const [scenarioId, setScenarioId] = useState(LBS_SCENARIOS[0].id);
  const active = LBS_SCENARIOS.find((s) => s.id === scenarioId) ?? LBS_SCENARIOS[0];
  const n = active.n;
  const logSteps = Math.round(Math.log2(n));

  const frames = useMemo(() => {
    const list = [];
    for (let el = 0; el < n; el++) {
      for (let sub = 1; sub <= logSteps; sub++) {
        list.push({
          el,
          sub,
          found: false,
          ops: el * logSteps + sub,
          narration: `Element ${el}: search range ${n >> (sub - 1)} → ${n >> sub}`,
          status: `Element ${el} of ${n}, search step ${sub} of ${logSteps}`,
        });
      }
      list.push({
        el,
        sub: logSteps,
        found: true,
        ops: (el + 1) * logSteps,
        narration: `Element ${el}: found after ${logSteps} steps`,
        status: `Element ${el} of ${n}, target found`,
      });
    }
    list.push({
      el: -1,
      sub: logSteps,
      found: true,
      ops: n * logSteps,
      narration: `Every element paid ${logSteps} search steps`,
      status: `Done: ${n} × ${logSteps} = ${n * logSteps} search steps`,
    });
    return list;
  }, [n, logSteps]);

  const idleFrame = useMemo(() => ({
    el: -1,
    sub: 0,
    found: false,
    ops: 0,
    narration: "Press Play: each element runs its own binary search",
    status: `Ready · n = ${n} elements, log₂(n) = ${logSteps} steps each`,
  }), [n, logSteps]);

  const player = useSimulationPlayback(260, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 260);
  }, [frames, player]);

  const isDone = current.el === -1 && current.ops === n * logSteps;
  const gap = n > 8 ? 6 : 8;
  const cellW = Math.min(52, Math.floor((720 - (n - 1) * gap) / n));
  const startX = (960 - (n * cellW + (n - 1) * gap)) / 2;
  const activeX = current.el >= 0 ? startX + current.el * (cellW + gap) + cellW / 2 : 0;
  const rangeBarW = isDone || current.ops === 0 ? 640 : 640 / Math.pow(2, current.sub);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every element pays for its own log n binary search, so the costs multiply: O(n log n).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {LBS_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 330" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="lbs" colors={[["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          {/* Badge */}
          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n log n)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Outer Array Elements */}
          {Array.from({ length: n }).map((_, idx) => {
            const isCurrent = current.el === idx;
            const isVisited = current.el >= 0 ? idx < current.el : isDone;
            const fill = isCurrent ? "#00ceff" : isVisited ? "rgba(56,217,169,0.2)" : "#1f1f22";
            const stroke = isCurrent ? "#00ceff" : isVisited ? "#38d9a9" : "rgba(161,161,170,0.3)";

            return (
              <g key={idx}>
                <rect
                  x={startX + idx * (cellW + gap)}
                  y={60}
                  width={cellW}
                  height={46}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCurrent ? 2.4 : 1.5}
                />
                <text
                  x={startX + idx * (cellW + gap) + cellW / 2}
                  y={83}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCurrent ? "#18181b" : isVisited ? "#f4f4f5" : "#a1a1aa"}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isCurrent ? 800 : 600}
                  fontSize={12}
                >
                  {idx}
                </text>
              </g>
            );
          })}

          {/* Connecting line to search bar */}
          {current.el >= 0 && !isDone && (
            <line x1={activeX} y1={108} x2={activeX} y2={170} stroke="#00ceff" strokeWidth={1.6} strokeDasharray="4 4" opacity={0.8} />
          )}

          {/* Binary Search Range Halving Box */}
          <rect x={160} y={178} width={640} height={34} rx={7} fill="#1f1f22" stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <rect
            x={160}
            y={178}
            width={rangeBarW}
            height={34}
            rx={7}
            fill={isDone ? "rgba(105,219,124,0.25)" : "rgba(94,234,212,0.28)"}
            stroke={isDone ? "#69db7c" : "#00ceff"}
            strokeWidth={2}
            style={{ transition: "width 200ms ease" }}
          />

          {/* Subdivisions */}
          {!isDone &&
            Array.from({ length: current.sub }).map((_, stepIdx) => (
              <line
                key={stepIdx}
                x1={160 + 640 / Math.pow(2, stepIdx + 1)}
                y1={173}
                x2={160 + 640 / Math.pow(2, stepIdx + 1)}
                y2={217}
                stroke="#00ceff"
                strokeWidth={1.4}
                strokeDasharray="4 4"
                opacity={0.4}
              />
            ))}

          {/* Checkmark when found */}
          {((current.found && !isDone) || isDone) && (
            <text x={160 + rangeBarW / 2} y={196} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              ✓
            </text>
          )}

          <text x={480} y={228} textAnchor="middle" dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={11.5}>
            {current.el >= 0 && !isDone ? `log₂ n search for element ${current.el}` : "log₂ n search for each element"}
          </text>

          {/* Bottom stats */}
          <text x={28} y={278} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            OPERATIONS
          </text>
          <text x={28} y={296} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.ops}
          </text>

          {isDone ? (
            <text x={480} y={290} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n} × {logSteps} = {n * logSteps} search steps → O(n log n)
            </text>
          ) : (
            <text x={140} y={300} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              n elements × log₂ n steps each
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 7. Divide and Conquer Simulation: O(n log n)
// ==========================================
const DC_SCENARIOS = [
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n16", name: "n = 16", n: 16 },
  { id: "n32", name: "n = 32", n: 32 },
];
const SUPERSCRIPTS = ["⁰", "¹", "²", "³", "⁴", "⁵"];

export function DivideConquerLevelsSimulation() {
  const [scenarioId, setScenarioId] = useState(DC_SCENARIOS[1].id);
  const active = DC_SCENARIOS.find((s) => s.id === scenarioId) ?? DC_SCENARIOS[1];
  const n = active.n;
  const numLevels = Math.round(Math.log2(n)) + 1;

  const frames = useMemo(() => {
    const list = [];
    for (let l = 0; l < numLevels; l++) {
      const pieces = Math.pow(2, l);
      list.push({
        level: l,
        ops: (l + 1) * n,
        narration: l === 0 ? `Level 0: 1 piece, all ${n} work in one block` : `Level ${l}: ${pieces} pieces, still ${n} total work`,
        status: `Level ${l} of ${numLevels - 1}, ${n} work this level`,
      });
    }
    list.push({
      level: -1,
      ops: numLevels * n,
      narration: `Halving makes ${numLevels} levels, each level still costs ${n}`,
      status: `Done: ${numLevels} levels × ${n} = ${numLevels * n} operations`,
    });
    return list;
  }, [n, numLevels]);

  const idleFrame = useMemo(() => ({
    level: -1,
    ops: 0,
    narration: "Press Play: split in half, count the work per level",
    status: `Ready · n = ${n}, log₂(n) + 1 = ${numLevels} levels`,
  }), [n, numLevels]);

  const player = useSimulationPlayback(1000, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 1000);
  }, [frames, player]);

  const activeLevel = current.level >= 0 ? current.level : -1;
  const isDone = current.level === -1 && current.ops === numLevels * n;
  const maxShownLevel = current.level >= 0 ? current.level : isDone ? numLevels - 1 : -1;
  const startY = 48 + (150 - (26 * numLevels - 6)) / 2;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-black px-4 py-2.5 flex-1 shadow-md">
          <p className="text-xs leading-relaxed text-zinc-300">
            Splitting in half makes log n levels, and every single level still does n work: O(n log n).
          </p>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-black p-1 text-xs gap-1 shadow-md">
          {DC_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                scenarioId === s.id
                  ? "bg-[#FF1018] text-white font-bold shadow-md shadow-[#FF1018]/25"
                  : "hover:bg-white/[0.04] text-zinc-400 hover:text-white"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 300" className="w-full h-auto block select-none" textRendering="geometricPrecision" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
          <g>
            <rect x={808} y={10} width={124} height={24} rx={6} fill="rgba(255, 16, 24, 0.12)" stroke="#FF1018" strokeWidth={1} />
            <text x={870} y={22} textAnchor="middle" dominantBaseline="central" fill="#FF3B41" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n log n)
            </text>
          </g>

          <text x={28} y={18} dominantBaseline="hanging" fill="#FFFFFF" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Level Bars */}
          {Array.from({ length: numLevels }).map((_, lIdx) => {
            if (current.ops === 0 && lIdx > 0) return null;
            if (!isDone && lIdx > (current.level >= 0 ? current.level : 0)) return null;

            const isCurrent = lIdx === activeLevel && !isDone;
            const pieces = Math.pow(2, lIdx);
            const pieceW = (700 - (pieces - 1) * 6) / pieces;
            const y = startY + 26 * lIdx;

            // Solid pastel and AMOLED styling: zero translucency
            let stroke = "rgba(255,255,255,0.12)";
            let fill = "#000000";
            let textColor = "#71717a";

            if (isCurrent) {
              fill = "#FDE047"; // Solid Butter Yellow
              stroke = "#FDE047";
              textColor = "#FDE047";
            } else if (isDone || lIdx < activeLevel) {
              fill = "#86EFAC"; // Solid Mint Green
              stroke = "#86EFAC";
              textColor = "#86EFAC";
            }

            return (
              <g key={lIdx}>
                <text x={116} y={y + 10} textAnchor="end" dominantBaseline="central" fill={textColor} fontWeight={isCurrent ? 800 : 600} fontSize={12} className="tabular-nums">
                  2{SUPERSCRIPTS[lIdx] || lIdx} = {pieces}
                </text>
                {Array.from({ length: pieces }).map((_, pIdx) => (
                  <rect
                    key={pIdx}
                    x={130 + pIdx * (pieceW + 6)}
                    y={y}
                    width={pieceW}
                    height={20}
                    rx={5}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCurrent ? 2 : 1.2}
                    style={{ transition: "stroke 200ms, fill 200ms" }}
                  />
                ))}
                <text x={844} y={y + 10} dominantBaseline="central" fill={textColor} fontWeight={isCurrent ? 800 : 600} fontSize={12}>
                  n work
                </text>
              </g>
            );
          })}

          {/* Operations bottom summary */}
          <text x={28} y={248} dominantBaseline="hanging" fill="#71717a" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            OPERATIONS
          </text>
          <text x={28} y={266} dominantBaseline="hanging" fill="#FFFFFF" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.ops}
          </text>

          {isDone ? (
            <text x={480} y={260} textAnchor="middle" dominantBaseline="central" fill="#86EFAC" fontWeight={800} fontSize={16}>
              {numLevels} levels × {n} work = {numLevels * n} → O(n log n)
            </text>
          ) : (
            <text x={140} y={270} dominantBaseline="hanging" fill="#a1a1aa" fontWeight={600} fontSize={12.5}>
              log₂ n + 1 levels × n work each
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} statusText={current.status} />
    </div>
  );
}

// ==========================================
// 8. Branching Recursion Simulation: O(2ⁿ)
// ==========================================
const BR_SCENARIOS = [
  { id: "d3", name: "depth 3", depth: 3 },
  { id: "d4", name: "depth 4", depth: 4 },
  { id: "d5", name: "depth 5", depth: 5 },
];

function calcNodeX(level: number, index: number): number {
  const count = Math.pow(2, level);
  return 480 + (768 / count) * (index - (count - 1) / 2);
}

function calcNodeY(level: number, depth: number): number {
  return depth <= 1 ? 78 : 78 + (174 * level) / (depth - 1);
}

export function BranchingRecursionSimulation() {
  const [scenarioId, setScenarioId] = useState(BR_SCENARIOS[0].id);
  const active = BR_SCENARIOS.find((s) => s.id === scenarioId) ?? BR_SCENARIOS[0];
  const depth = active.depth;
  const totalCalls = Math.pow(2, depth) - 1;

  const frames = useMemo(() => {
    const list = [];
    for (let d = 0; d < depth; d++) {
      const callsAtLevel = Math.pow(2, d);
      const runningOps = Math.pow(2, d + 1) - 1;
      list.push({
        level: d,
        ops: runningOps,
        narration: d === 0 ? "Level 0: 1 call, the root call fib(n)" : `Level ${d}: ${callsAtLevel} calls, double the level above`,
        status: `Level ${d} of ${depth - 1}, ${callsAtLevel} calls this level`,
      });
    }
    list.push({
      level: -1,
      ops: totalCalls,
      narration: "Every call spawned two more, the tree doubled each level",
      status: `Done: ${depth} levels, ${totalCalls} calls`,
    });
    return list;
  }, [depth, totalCalls]);

  const idleFrame = useMemo(() => ({
    level: -1,
    ops: 0,
    narration: "Press Play: each call spawns two more calls",
    status: `Ready · Tree depth = ${depth} (${totalCalls} total calls)`,
  }), [depth, totalCalls]);

  const player = useSimulationPlayback(1000, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 1000);
  }, [frames, player]);

  const activeLevel = current.level >= 0 ? current.level : -1;
  const isDone = current.level === -1 && current.ops === totalCalls;
  const maxLevel = current.level >= 0 ? current.level : isDone ? depth - 1 : 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each call spawns two more, so the call tree doubles at every level: O(2ⁿ).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {BR_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 344" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="br" colors={[["red", "#ff8787"], ["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#ff8787" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(2ⁿ)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Tree Levels */}
          {Array.from({ length: depth }).map((_, lIdx) => {
            if (lIdx > maxLevel) return null;
            const count = Math.pow(2, lIdx);
            const isCurrent = lIdx === activeLevel;
            const y = calcNodeY(lIdx, depth);
            const radius = depth <= 1 ? 12.5 : 12.5 - ((12.5 - (depth >= 5 ? 5.5 : 7.5)) * lIdx) / (depth - 1);
            const stroke = isCurrent ? "#00ceff" : "#ff8787";

            return (
              <g key={lIdx} className="animate-in fade-in duration-300">
                {/* Branches from parent */}
                {lIdx > 0 &&
                  Array.from({ length: count }).map((_, cIdx) => (
                    <line
                      key={`edge-${cIdx}`}
                      x1={calcNodeX(lIdx - 1, Math.floor(cIdx / 2))}
                      y1={calcNodeY(lIdx - 1, depth)}
                      x2={calcNodeX(lIdx, cIdx)}
                      y2={y}
                      stroke="rgba(255,135,135,0.5)"
                      strokeWidth={1.6}
                    />
                  ))}

                {/* Node Circles */}
                {Array.from({ length: count }).map((_, cIdx) => (
                  <circle
                    key={`node-${cIdx}`}
                    cx={calcNodeX(lIdx, cIdx)}
                    cy={y}
                    r={radius}
                    fill="rgba(255,135,135,0.22)"
                    stroke={stroke}
                    strokeWidth={isCurrent ? 2.2 : 1.8}
                    style={{ transition: "stroke 300ms ease" }}
                  />
                ))}

                {/* Count badge on left */}
                <text x={34} y={y} textAnchor="middle" dominantBaseline="central" fill={isCurrent ? "#00ceff" : "#a1a1aa"} fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={13} className="tabular-nums">
                  {count}
                </text>
              </g>
            );
          })}

          <text x={28} y={292} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            OPERATIONS
          </text>
          <text x={28} y={310} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.ops}
          </text>

          {isDone ? (
            <text x={480} y={304} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              depth {depth} → {totalCalls} calls and doubling → O(2ⁿ)
            </text>
          ) : (
            <text x={140} y={314} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              calls double every level
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 9. Permutation Tree Simulation: O(n!)
// ==========================================
const PERM_SCENARIOS = [
  { id: "n3", name: "n = 3", n: 3 },
  { id: "n4", name: "n = 4", n: 4 },
];
const ORDINAL_PICKS = ["First", "Second", "Third"];

export function PermutationTreeSimulation() {
  const [scenarioId, setScenarioId] = useState(PERM_SCENARIOS[0].id);
  const active = PERM_SCENARIOS.find((s) => s.id === scenarioId) ?? PERM_SCENARIOS[0];
  const n = active.n;

  const factorial = useMemo(() => {
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }, [n]);

  const treeLayout = useMemo(() => {
    const depth = n - 1;
    const counts = [1];
    for (let l = 1; l <= depth; l++) counts.push(counts[l - 1] * (n - l + 1));
    const leafCount = counts[depth];
    const xs: number[][] = [];
    xs[depth] = Array.from({ length: leafCount }, (_, idx) =>
      leafCount === 1 ? 510 : 90 + (840 * idx) / (leafCount - 1)
    );
    for (let l = depth - 1; l >= 0; l--) {
      const branchFactor = n - l;
      xs[l] = Array.from({ length: counts[l] }, (_, nodeIdx) => {
        const slice = xs[l + 1].slice(nodeIdx * branchFactor, nodeIdx * branchFactor + branchFactor);
        return slice.reduce((acc, v) => acc + v, 0) / slice.length;
      });
    }
    const ys = Array.from({ length: depth + 1 }, (_, idx) => 76 + (180 * idx) / depth);
    const radii = Array.from({ length: depth + 1 }, (_, idx) =>
      idx === 0 ? 8 : idx === depth ? (counts[depth] > 10 ? 4 : 6) : 6.5
    );
    return { depth, counts, xs, ys, radii, leafCount };
  }, [n]);

  const frames = useMemo(() => {
    const list = [];
    const depth = n - 1;
    let paths = 1;
    for (let l = 1; l <= depth; l++) {
      const choicesLeft = n - l + 1;
      paths *= choicesLeft;
      const narration =
        l === 1
          ? `First pick: ${choicesLeft} choices, ${paths} paths`
          : l < depth
          ? `${ORDINAL_PICKS[l - 1]} pick: only ${choicesLeft} choices left, ${paths} paths so far`
          : `${ORDINAL_PICKS[l - 1]} pick: ${choicesLeft} choices left, then 1 forced, ${paths} paths`;
      list.push({
        level: l,
        paths,
        narration,
        status: `Level ${l} of ${depth}, ${paths} paths`,
      });
    }
    list.push({
      level: -1,
      paths: factorial,
      narration: `Every ordering is one root-to-leaf path: ${n}! of them`,
      status: `Done: ${n}! = ${factorial} paths`,
    });
    return list;
  }, [n, factorial]);

  const idleFrame = useMemo(() => ({
    level: -1,
    paths: 1,
    narration: "Press Play: each pick removes one choice",
    status: `Ready · Permutation tree for n = ${n} (${factorial} paths)`,
  }), [n, factorial]);

  const player = useSimulationPlayback(1100, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 1100);
  }, [frames, player]);

  const isDone = current.level === -1 && current.paths === factorial;
  const currentLevel = current.level >= 0 ? current.level : isDone ? treeLayout.depth : 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each level has one fewer choice, n then n-1 then n-2, and the paths multiply to n!: O(n!).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {PERM_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 340" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="pt" colors={[["red", "#ff8787"], ["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#ff8787" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n!)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {isDone && (
            <text x={932} y={44} textAnchor="end" dominantBaseline="hanging" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={13}>
              {n}! = {treeLayout.leafCount} paths
            </text>
          )}

          {/* Tree Edges */}
          {Array.from({ length: treeLayout.depth }).map((_, lIdx) => {
            const childLevel = lIdx + 1;
            const branchFactor = n - childLevel + 1;
            const visible = childLevel <= currentLevel;

            return (
              <g key={`edges-${childLevel}`} opacity={visible ? 1 : 0} style={{ transition: "opacity 350ms" }}>
                {treeLayout.xs[childLevel].map((xChild, childIdx) => {
                  const parentIdx = Math.floor(childIdx / branchFactor);
                  return (
                    <line
                      key={childIdx}
                      x1={treeLayout.xs[childLevel - 1][parentIdx]}
                      y1={treeLayout.ys[childLevel - 1]}
                      x2={xChild}
                      y2={treeLayout.ys[childLevel]}
                      stroke="rgba(255,135,135,0.45)"
                      strokeWidth={1.4}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Tree Nodes */}
          {Array.from({ length: treeLayout.depth + 1 }).map((_, lIdx) => {
            const visible = lIdx === 0 || lIdx <= currentLevel;
            const isCurrent = lIdx === current.level;
            const isLeaf = lIdx === treeLayout.depth;
            const fill = isDone && isLeaf ? "rgba(255,135,135,0.55)" : "rgba(255,135,135,0.18)";

            return (
              <g key={`nodes-${lIdx}`} opacity={visible ? 1 : 0} style={{ transition: "opacity 350ms" }}>
                {treeLayout.xs[lIdx].map((x, nIdx) => (
                  <circle
                    key={nIdx}
                    cx={x}
                    cy={treeLayout.ys[lIdx]}
                    r={treeLayout.radii[lIdx]}
                    fill={fill}
                    stroke={isCurrent ? "#00ceff" : "#ff8787"}
                    strokeWidth={isCurrent ? 2 : 1.6}
                    style={{ transition: "stroke 350ms, fill 350ms" }}
                  />
                ))}
              </g>
            );
          })}

          {/* Multiplier Labels */}
          {Array.from({ length: treeLayout.depth }).map((_, lIdx) => {
            const childLevel = lIdx + 1;
            const visible = childLevel <= currentLevel;
            const isCurrent = childLevel === current.level;

            return (
              <text
                key={`mult-${childLevel}`}
                x={44}
                y={treeLayout.ys[childLevel]}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isCurrent ? "#00ceff" : "#a1a1aa"}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={800}
                fontSize={14}
                opacity={visible ? 1 : 0}
                style={{ transition: "opacity 350ms, fill 350ms" }}
              >
                ×{n - childLevel + 1}
              </text>
            );
          })}

          <text x={28} y={288} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            PATHS
          </text>
          <text x={28} y={306} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.paths}
          </text>

          {isDone ? (
            <text x={480} y={300} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n}! = {treeLayout.leafCount} orderings → O(n!)
            </text>
          ) : (
            <text x={140} y={310} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              n × (n-1) × (n-2) × ... × 1
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 10. Hash Lookup Simulation: O(1)
// ==========================================
const HASH_SCENARIOS = [
  { id: "b8", name: "8 buckets", n: 8 },
  { id: "b16", name: "16 buckets", n: 16 },
  { id: "b32", name: "32 buckets", n: 32 },
];

const HASH_KEYS = [
  { key: "user:1042", hash: 40971 },
  { key: "cart:88", hash: 20824 },
  { key: "session:9f3", hash: 63311 },
  { key: "order:511", hash: 90355 },
  { key: "email:ada", hash: 12746 },
];

export function HashLookupSimulation() {
  const [scenarioId, setScenarioId] = useState(HASH_SCENARIOS[1].id);
  const active = HASH_SCENARIOS.find((s) => s.id === scenarioId) ?? HASH_SCENARIOS[1];
  const numBuckets = active.n;

  const frames = useMemo(() => {
    const list: Array<{
      kind: "hash" | "hit" | "done";
      li: number;
      bucket: number;
      ops: number;
      hitBuckets: number[];
      narration: string;
      status: string;
    }> = [];
    const hits: number[] = [];

    HASH_KEYS.forEach((item, idx) => {
      const b = item.hash % numBuckets;
      list.push({
        kind: "hash",
        li: idx,
        bucket: b,
        ops: idx,
        hitBuckets: [...hits],
        narration: `hash("${item.key}") mod ${numBuckets} = ${b}`,
        status: `Hashing "${item.key}"`,
      });
      hits.push(b);
      list.push({
        kind: "hit",
        li: idx,
        bucket: b,
        ops: idx + 1,
        hitBuckets: [...hits],
        narration: `One jump to bucket ${b}, one operation`,
        status: `Hit bucket ${b}, operation ${idx + 1} of ${HASH_KEYS.length}`,
      });
    });

    list.push({
      kind: "done",
      li: -1,
      bucket: -1,
      ops: HASH_KEYS.length,
      hitBuckets: [...hits],
      narration: "Table size never mattered",
      status: `Done: ${HASH_KEYS.length} lookups, ${HASH_KEYS.length} operations`,
    });
    return list;
  }, [numBuckets]);

  const idleFrame = useMemo(() => ({
    kind: "done" as "done" | "hash" | "hit",
    li: -1,
    bucket: -1,
    ops: 0,
    hitBuckets: [] as number[],
    narration: "Press Play: each key hashes straight to its bucket",
    status: `Ready · ${numBuckets} buckets, direct address hashing`,
  }), [numBuckets]);

  const player = useSimulationPlayback(700, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 700);
  }, [frames, player]);

  const isDone = current.kind === "done" && current.ops === HASH_KEYS.length;
  const currentKeyItem = current.li >= 0 ? HASH_KEYS[current.li] : null;

  const bucketW = Math.min(52, Math.floor(800 / numBuckets) - 8);
  const startX = (960 - (numBuckets * bucketW + (numBuckets - 1) * 8)) / 2;
  const bucketCenterX = current.bucket >= 0 ? startX + current.bucket * (bucketW + 8) + bucketW / 2 : 0;
  const badgeW = currentKeyItem ? Math.max(84, 7.4 * currentKeyItem.key.length + 26) : 0;
  const badgeX = currentKeyItem ? Math.min(Math.max(bucketCenterX, badgeW / 2 + 10), 960 - badgeW / 2 - 10) : 0;
  const badgeY = current.kind === "hit" ? 112 : 48;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A key hashes straight to its bucket, so a lookup costs one step at any table size: O(1).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {HASH_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 300" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="hlk" colors={[["green", "#69db7c"], ["cyan", "#00ceff"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#69db7c" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(1)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Buckets */}
          {Array.from({ length: numBuckets }).map((_, bIdx) => {
            const isHit = current.kind === "hit" && bIdx === current.bucket;
            const isHashing = current.kind === "hash" && bIdx === current.bucket;
            const previouslyHit = current.hitBuckets.includes(bIdx) && !isHit;
            const fill = isHit ? "#69db7c" : previouslyHit ? "rgba(105,219,124,0.16)" : "#1f1f22";
            const stroke = isHit ? "#69db7c" : isHashing ? "#00ceff" : previouslyHit ? "rgba(105,219,124,0.6)" : "rgba(161,161,170,0.3)";

            return (
              <g key={bIdx}>
                {isHit && (
                  <rect
                    x={startX + bIdx * (bucketW + 8) - 4}
                    y={136}
                    width={bucketW + 8}
                    height={62}
                    rx={11}
                    fill="none"
                    stroke="#69db7c"
                    strokeWidth={2}
                    opacity={0.7}
                  />
                )}
                <rect
                  x={startX + bIdx * (bucketW + 8)}
                  y={140}
                  width={bucketW}
                  height={54}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isHit || isHashing ? 2.4 : 1.5}
                  strokeDasharray={isHashing ? "5 4" : undefined}
                />
                <text
                  x={startX + bIdx * (bucketW + 8) + bucketW / 2}
                  y={167}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHit ? "#18181b" : previouslyHit ? "#f4f4f5" : "#a1a1aa"}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isHit ? 800 : 600}
                  fontSize={bucketW >= 40 ? 14 : 11}
                >
                  {bIdx}
                </text>
              </g>
            );
          })}

          {/* Hashing arrow pointing into bucket */}
          {current.kind === "hash" && currentKeyItem && (
            <g>
              <line x1={badgeX} y1={badgeY + 24 + 4} x2={bucketCenterX} y2={126} stroke="#00ceff" strokeWidth={2} strokeDasharray="6 5" />
              <polygon points={`${bucketCenterX},136 ${bucketCenterX - 6},126 ${bucketCenterX + 6},126`} fill="#00ceff" />
            </g>
          )}

          {/* Floating Key Pill */}
          {currentKeyItem && (
            <g style={{ transition: "transform 300ms ease" }} transform={`translate(${current.kind === "hit" ? bucketCenterX : badgeX}, ${badgeY})`}>
              <rect x={-badgeW / 2} y={0} width={badgeW} height={24} rx={12} fill="#00ceff" stroke="#00ceff" strokeWidth={1.5} />
              <text x={0} y={12} textAnchor="middle" dominantBaseline="central" fill="#18181b" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
                {currentKeyItem.key}
              </text>
            </g>
          )}

          {/* Operations bottom summary */}
          <text x={28} y={248} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            OPERATIONS
          </text>
          <text x={28} y={266} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.ops}
          </text>

          {isDone ? (
            <text x={480} y={260} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              5 lookups, 5 operations at any size → O(1)
            </text>
          ) : (
            <text x={140} y={270} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              1 operation per lookup, {numBuckets} buckets
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
