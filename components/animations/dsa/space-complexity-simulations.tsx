"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

// ==========================================
// 1. 2D DP Table Simulation: O(n·m) Space
// ==========================================
const DP_SCENARIOS = [
  { id: "s46", name: "n=4, m=6", n: 4, m: 6 },
  { id: "s57", name: "n=5, m=7", n: 5, m: 7 },
  { id: "s68", name: "n=6, m=8", n: 6, m: 8 },
];

export function DpTableSimulation() {
  const [scenarioId, setScenarioId] = useState(DP_SCENARIOS[1].id);
  const active =
    DP_SCENARIOS.find((s) => s.id === scenarioId) ?? DP_SCENARIOS[1];
  const { n, m } = active;
  const totalCells = n * m;

  const frames = useMemo(() => {
    const list = [];
    for (let r = 0; r < n; r++) {
      list.push({
        row: r,
        cells: (r + 1) * m,
        narration: `Row ${r + 1} allocated: ${m} more cells`,
        status: `Row ${r + 1} of ${n}, ${(r + 1) * m} cells allocated`,
      });
    }
    list.push({
      row: -1,
      cells: totalCells,
      narration: `Full matrix allocated upfront: ${n} × ${m} = ${totalCells} cells`,
      status: `Done: ${n} × ${m} = ${totalCells} cells sit in memory`,
    });
    return list;
  }, [n, m, totalCells]);

  const idleFrame = useMemo(
    () => ({
      row: -1,
      cells: 0,
      narration: "Press Play: allocating 2D table dp[n][m] row by row",
      status: `Ready · Table dimensions ${n} × ${m} (${totalCells} total cells)`,
    }),
    [n, m, totalCells],
  );

  const player = useSimulationPlayback(600, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 600);
  }, [frames, player]);

  const isDone = current.row === -1 && current.cells === totalCells;
  const maxRow = current.row >= 0 ? current.row : isDone ? n - 1 : -1;

  const cellW = Math.min(44, Math.floor(480 / m));
  const cellH = Math.min(34, Math.floor(180 / n));
  const matrixW = m * cellW + (m - 1) * 4;
  const matrixH = n * cellH + (n - 1) * 4;
  const startX = (960 - matrixW) / 2;
  const startY = 80;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            dp[n][m] allocates one cell for every (i, j) pair before any work
            happens: O(n·m) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {DP_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 330"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="dp"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n·m)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Dimension markers */}
          <text
            x={startX + matrixW / 2}
            y={startY - 14}
            textAnchor="middle"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontSize={12}
            fontWeight={700}
          >
            m = {m} columns
          </text>
          <text
            x={startX - 18}
            y={startY + matrixH / 2}
            textAnchor="end"
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontSize={12}
            fontWeight={700}
          >
            n = {n}
          </text>

          {/* Table Grid */}
          {Array.from({ length: n }).map((_, r) =>
            Array.from({ length: m }).map((_, c) => {
              const isAllocated = r <= maxRow;
              const isCurrentRow = r === current.row;
              const x = startX + c * (cellW + 4);
              const y = startY + r * (cellH + 4);

              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={cellW}
                  height={cellH}
                  rx={5}
                  fill={
                    isCurrentRow
                      ? "rgba(0,206,255,0.25)"
                      : isAllocated
                        ? "rgba(105,219,124,0.18)"
                        : "#1f1f22"
                  }
                  stroke={
                    isCurrentRow
                      ? "#00ceff"
                      : isAllocated
                        ? "#69db7c"
                        : "rgba(161,161,170,0.25)"
                  }
                  strokeWidth={isCurrentRow ? 2 : 1.2}
                  style={{ transition: "all 300ms ease" }}
                />
              );
            }),
          )}

          {/* Operations / Cells Counter */}
          <text
            x={28}
            y={278}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            ALLOCATED CELLS
          </text>
          <text
            x={28}
            y={296}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.cells}
          </text>

          {isDone ? (
            <text
              x={480}
              y={290}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              {n} × {m} = {totalCells} cells → O(n·m) Space
            </text>
          ) : (
            <text
              x={160}
              y={300}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Allocating contiguous matrix dp[{n}][{m}]
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 2. BFS Queue Simulation: O(n) Space
// ==========================================
const BFS_SCENARIOS = [
  { id: "d3", name: "depth 3", depth: 3 },
  { id: "d4", name: "depth 4", depth: 4 },
];

export function BfsQueueSimulation() {
  const [scenarioId, setScenarioId] = useState(BFS_SCENARIOS[0].id);
  const active =
    BFS_SCENARIOS.find((s) => s.id === scenarioId) ?? BFS_SCENARIOS[0];
  const depth = active.depth;
  const totalNodes = Math.pow(2, depth) - 1;
  const widestLevel = Math.pow(2, depth - 1);

  const frames = useMemo(() => {
    const list = [];
    for (let l = 0; l < depth; l++) {
      const qSize = Math.pow(2, l);
      list.push({
        level: l,
        queueSize: qSize,
        narration: `Level ${l}: queue holds ${qSize} node${qSize > 1 ? "s" : ""}`,
        status: `Level ${l} of ${depth - 1}, ${qSize} nodes in queue`,
      });
    }
    list.push({
      level: -1,
      queueSize: widestLevel,
      narration: `Widest level reached: holds ${widestLevel} nodes ≈ n/2 → O(n) Space`,
      status: `Done: peak queue size = ${widestLevel} nodes (O(n))`,
    });
    return list;
  }, [depth, widestLevel]);

  const idleFrame = useMemo(
    () => ({
      level: -1,
      queueSize: 0,
      narration: "Press Play: BFS queues one whole tree level at a time",
      status: `Ready · Tree depth = ${depth} (${totalNodes} nodes, widest level = ${widestLevel})`,
    }),
    [depth, totalNodes, widestLevel],
  );

  const player = useSimulationPlayback(900, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 900);
  }, [frames, player]);

  const isDone = current.level === -1 && current.queueSize === widestLevel;
  const activeLevel =
    current.level >= 0 ? current.level : isDone ? depth - 1 : -1;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Level-order traversal queues a whole tree level at once, and the
            widest level is about n/2: O(n) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {BFS_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 400"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="bfs"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Tree Structure */}
          {Array.from({ length: depth }).map((_, lIdx) => {
            const count = Math.pow(2, lIdx);
            const isLevelActive = lIdx === activeLevel;
            const y = 60 + (160 * lIdx) / (depth - 1);

            return (
              <g key={lIdx}>
                {lIdx > 0 &&
                  Array.from({ length: count }).map((_, cIdx) => {
                    const parentX =
                      480 +
                      (720 / Math.pow(2, lIdx - 1)) *
                        (Math.floor(cIdx / 2) -
                          (Math.pow(2, lIdx - 1) - 1) / 2);
                    const childX =
                      480 + (720 / count) * (cIdx - (count - 1) / 2);
                    return (
                      <line
                        key={`edge-${cIdx}`}
                        x1={parentX}
                        y1={60 + (160 * (lIdx - 1)) / (depth - 1)}
                        x2={childX}
                        y2={y}
                        stroke="rgba(161,161,170,0.3)"
                        strokeWidth={1.5}
                      />
                    );
                  })}

                {Array.from({ length: count }).map((_, cIdx) => {
                  const x = 480 + (720 / count) * (cIdx - (count - 1) / 2);
                  return (
                    <circle
                      key={`node-${cIdx}`}
                      cx={x}
                      cy={y}
                      r={14}
                      fill={isLevelActive ? "rgba(0,206,255,0.3)" : "#1f1f22"}
                      stroke={
                        isLevelActive ? "#00ceff" : "rgba(161,161,170,0.4)"
                      }
                      strokeWidth={isLevelActive ? 2.4 : 1.5}
                      style={{ transition: "all 300ms ease" }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* BFS Queue Box at bottom */}
          <g>
            <text
              x={28}
              y={260}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 1 }}
            >
              CURRENT BFS QUEUE MEMORY
            </text>
            <rect
              x={28}
              y={282}
              width={904}
              height={46}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.5}
            />

            {/* Queued items */}
            {Array.from({ length: current.queueSize }).map((_, qIdx) => {
              const itemW = Math.min(
                52,
                Math.floor(860 / current.queueSize) - 8,
              );
              const qStartX =
                48 +
                (904 -
                  (current.queueSize * itemW + (current.queueSize - 1) * 8)) /
                  2;
              const x = qStartX + qIdx * (itemW + 8);

              return (
                <rect
                  key={qIdx}
                  x={x}
                  y={290}
                  width={itemW}
                  height={30}
                  rx={6}
                  fill="rgba(0,206,255,0.25)"
                  stroke="#00ceff"
                  strokeWidth={2}
                />
              );
            })}
          </g>

          {/* Operations / Peak Info */}
          <text
            x={28}
            y={350}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            Queue Size: <tspan fill="#00ceff">{current.queueSize}</tspan> nodes
          </text>
          {isDone ? (
            <text
              x={480}
              y={356}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={15}
            >
              Widest level holds 2^{depth - 1} = {widestLevel} nodes ≈ n/2 →
              O(n) Space
            </text>
          ) : null}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 3. Fixed-Size Counts Simulation: O(1) Space
// ==========================================
const FSC_SCENARIOS = [
  { id: "s10", name: '"Mindflare"', word: "Mindflare" },
  { id: "s14", name: '"datastructures"', word: "datastructures" },
  { id: "s15", name: '"spacecomplexity"', word: "spacecomplexity" },
];

export function FixedSizeCountsSimulation() {
  const [scenarioId, setScenarioId] = useState(FSC_SCENARIOS[0].id);
  const active =
    FSC_SCENARIOS.find((s) => s.id === scenarioId) ?? FSC_SCENARIOS[0];
  const word = active.word;
  const len = word.length;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < len; i++) {
      const ch = word[i];
      const code = ch.charCodeAt(0) - 97;
      list.push({
        charIndex: i,
        char: ch,
        bucket: code,
        narration: `Char ${i + 1}: "${ch}" → bucket ${code} ('${ch}'), same 26 buckets`,
        status: `Counting "${ch}", char ${i + 1} of ${len}`,
      });
    }
    list.push({
      charIndex: -1,
      char: "",
      bucket: -1,
      narration:
        "Every letter landed in the same 26 buckets: O(1) auxiliary space",
      status: `Done: ${len} chars counted, still exactly 26 buckets in memory`,
    });
    return list;
  }, [word, len]);

  const idleFrame = useMemo(
    () => ({
      charIndex: -2,
      char: "",
      bucket: -1,
      narration: "Press Play: every letter lands in one of 26 fixed buckets",
      status: `Ready · String length = ${len}, fixed array size = 26`,
    }),
    [len],
  );

  const player = useSimulationPlayback(550, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 550);
  }, [frames, player]);

  const counts = useMemo(() => {
    const arr = Array(26).fill(0);
    const limit =
      current.charIndex >= 0
        ? current.charIndex + 1
        : current.charIndex === -1
          ? len
          : 0;
    for (let i = 0; i < limit; i++) {
      arr[word.charCodeAt(i) - 97]++;
    }
    return arr;
  }, [word, len, current.charIndex]);

  const isDone = current.charIndex === -1;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Letter counts land in the same 26 buckets no matter how long the
            string gets: O(1) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {FSC_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 340"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="fsc"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#69db7c"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(1)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#69db7c"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* 26 Buckets */}
          {Array.from({ length: 26 }).map((_, bIdx) => {
            const letter = String.fromCharCode(97 + bIdx);
            const count = counts[bIdx];
            const isCurrent = bIdx === current.bucket;
            const x = 50 + bIdx * 34;
            const y = 140;

            return (
              <g key={bIdx}>
                {/* Count bar */}
                {count > 0 && (
                  <rect
                    x={x + 4}
                    y={y - count * 14}
                    width={22}
                    height={count * 14}
                    rx={3}
                    fill={isCurrent ? "#00ceff" : "#69db7c"}
                  />
                )}
                {/* Bucket box */}
                <rect
                  x={x}
                  y={y}
                  width={30}
                  height={38}
                  rx={6}
                  fill={isCurrent ? "rgba(0,206,255,0.3)" : "#1f1f22"}
                  stroke={isCurrent ? "#00ceff" : "rgba(161,161,170,0.3)"}
                  strokeWidth={isCurrent ? 2.4 : 1.5}
                />
                <text
                  x={x + 15}
                  y={y + 19}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCurrent ? "#00ceff" : "#f4f4f5"}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={800}
                  fontSize={12}
                >
                  {letter}
                </text>
              </g>
            );
          })}

          <text
            x={28}
            y={260}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            ARRAY SIZE: 26 INTS FIXED
          </text>
          <text
            x={28}
            y={282}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            26 buckets
          </text>

          {isDone ? (
            <text
              x={480}
              y={290}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              Counted {len} chars using 26 integers regardless of n → O(1) Space
            </text>
          ) : (
            <text
              x={160}
              y={288}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              count[26] = [a..z] constant auxiliary storage
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 4. Hash Set of Seen Simulation: O(n) Space
// ==========================================
const HSS_SCENARIOS = [
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n12", name: "n = 12", n: 12 },
  { id: "n16", name: "n = 16", n: 16 },
];

export function HashSetSeenSimulation() {
  const [scenarioId, setScenarioId] = useState(HSS_SCENARIOS[1].id);
  const active =
    HSS_SCENARIOS.find((s) => s.id === scenarioId) ?? HSS_SCENARIOS[1];
  const n = active.n;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push({
        visit: i,
        size: i + 1,
        narration: `Visit a[${i}], add it to seen-set`,
        status: `a[${i}] added, set size ${i + 1} of ${n}`,
      });
    }
    list.push({
      visit: -1,
      size: n,
      narration: "Every element remembered, the set holds all n entries: O(n)",
      status: `Done: ${n} elements visited, ${n} entries in hash set`,
    });
    return list;
  }, [n]);

  const idleFrame = useMemo(
    () => ({
      visit: -1,
      size: 0,
      narration: "Press Play: every visit stores one entry in the seen-set",
      status: `Ready · Array size n = ${n}`,
    }),
    [n],
  );

  const player = useSimulationPlayback(550, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 550);
  }, [frames, player]);

  const isDone = current.visit === -1 && current.size === n;
  const cellW = Math.min(52, Math.floor(800 / n) - 8);
  const startX = (960 - (n * cellW + (n - 1) * 8)) / 2;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every element you sweep gets remembered, so the seen-set grows to n
            entries: O(n) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {HSS_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 330"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="hss"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Array Input */}
          <text
            x={startX}
            y={64}
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
          >
            INPUT ARRAY
          </text>
          {Array.from({ length: n }).map((_, i) => {
            const isCurrent = i === current.visit;
            const isVisited = current.visit >= 0 ? i < current.visit : isDone;
            const x = startX + i * (cellW + 8);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={80}
                  width={cellW}
                  height={46}
                  rx={8}
                  fill={
                    isCurrent
                      ? "#00ceff"
                      : isVisited
                        ? "rgba(59,201,219,0.2)"
                        : "#1f1f22"
                  }
                  stroke={
                    isCurrent
                      ? "#00ceff"
                      : isVisited
                        ? "#00ceff"
                        : "rgba(161,161,170,0.3)"
                  }
                  strokeWidth={isCurrent ? 2.4 : 1.5}
                />
                <text
                  x={x + cellW / 2}
                  y={103}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={
                    isCurrent ? "#18181b" : isVisited ? "#f4f4f5" : "#a1a1aa"
                  }
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isCurrent ? 800 : 600}
                  fontSize={13}
                >
                  a[{i}]
                </text>
              </g>
            );
          })}

          {/* Seen Hash Set Box */}
          <text
            x={startX}
            y={170}
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
          >
            SEEN SET (AUXILIARY MEMORY)
          </text>
          <rect
            x={startX}
            y={186}
            width={n * cellW + (n - 1) * 8}
            height={52}
            rx={10}
            fill="#18181b"
            stroke="rgba(161,161,170,0.3)"
            strokeWidth={1.5}
          />
          {Array.from({ length: current.size }).map((_, sIdx) => {
            const x = startX + 6 + sIdx * (cellW + 8);
            return (
              <rect
                key={sIdx}
                x={x}
                y={192}
                width={cellW - 4}
                height={40}
                rx={6}
                fill="rgba(105,219,124,0.25)"
                stroke="#69db7c"
                strokeWidth={1.8}
              />
            );
          })}

          {/* Stats */}
          <text
            x={28}
            y={278}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            SET ENTRIES
          </text>
          <text
            x={28}
            y={296}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.size}
          </text>

          {isDone ? (
            <text
              x={480}
              y={290}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              {n} elements stored in set → O(n) Space
            </text>
          ) : (
            <text
              x={160}
              y={300}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              HashSet size scales 1:1 with n
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 5. Linear Recursion Simulation: O(n) Space
// ==========================================
const LR_SCENARIOS = [
  { id: "n6", name: "n = 6", n: 6 },
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n10", name: "n = 10", n: 10 },
];

export function LinearRecursionSimulation() {
  const [scenarioId, setScenarioId] = useState(LR_SCENARIOS[1].id);
  const active =
    LR_SCENARIOS.find((s) => s.id === scenarioId) ?? LR_SCENARIOS[1];
  const n = active.n;

  const frames = useMemo(() => {
    const list = [];
    // Push phase
    for (let d = 1; d <= n; d++) {
      const param = n - d + 1;
      list.push({
        depth: d,
        pushing: true,
        param,
        narration:
          d === 1
            ? `f(${n}) called, frame 1 placed on stack`
            : `f(${param + 1}) calls f(${param}), frame ${d} placed on stack`,
        status: `Depth ${d} of ${n}, pushing frame`,
      });
    }
    // Pop phase
    for (let d = 1; d <= n; d++) {
      const rem = n - d;
      list.push({
        depth: rem,
        pushing: false,
        param: d,
        narration:
          d === n
            ? `f(${n}) returns, call stack empty again`
            : `f(${d}) returns, frame freed`,
        status: `Depth ${rem}, unwinding stack`,
      });
    }
    list.push({
      depth: 0,
      pushing: false,
      param: 0,
      narration: `Peak stack held ${n} frames simultaneously: O(n) Space`,
      status: `Done: peak call stack memory = ${n} frames`,
    });
    return list;
  }, [n]);

  const idleFrame = useMemo(
    () => ({
      depth: 0,
      pushing: false,
      param: 0,
      narration:
        "Press Play: every call adds a frame before the previous returns",
      status: `Ready · Linear recursion for n = ${n}`,
    }),
    [n],
  );

  const player = useSimulationPlayback(500, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 500);
  }, [frames, player]);

  const frameH = Math.min(32, Math.floor(210 / n));
  const isDone = current.narration.includes("Peak stack");

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            f(n) calls f(n-1) all the way down, so n frames sit on the stack at
            once: O(n) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {LR_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 340"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="lr"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Call Stack Tower */}
          <g>
            <line
              x1={320}
              y1={50}
              x2={320}
              y2={260}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />
            <line
              x1={640}
              y1={50}
              x2={640}
              y2={260}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />
            <line
              x1={310}
              y1={260}
              x2={650}
              y2={260}
              stroke="rgba(161,161,170,0.4)"
              strokeWidth={3}
            />
            <text
              x={480}
              y={276}
              textAnchor="middle"
              fill="#71717a"
              fontFamily="var(--font-mono, monospace)"
              fontSize={11}
            >
              CALL STACK BASE
            </text>

            {/* Stack Frames */}
            {Array.from({ length: current.depth }).map((_, fIdx) => {
              const y = 256 - (fIdx + 1) * (frameH + 3);
              const param = n - fIdx;
              const isTop = fIdx === current.depth - 1;

              return (
                <g key={fIdx}>
                  <rect
                    x={328}
                    y={y}
                    width={304}
                    height={frameH}
                    rx={6}
                    fill={isTop ? "#00ceff" : "rgba(59,201,219,0.22)"}
                    stroke={isTop ? "#00ceff" : "#3bc9db"}
                    strokeWidth={1.8}
                  />
                  <text
                    x={480}
                    y={y + frameH / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isTop ? "#18181b" : "#f4f4f5"}
                    fontFamily="var(--font-mono, monospace)"
                    fontWeight={800}
                    fontSize={12}
                  >
                    f({param})
                  </text>
                </g>
              );
            })}
          </g>

          {/* Operations / Peak Info */}
          <text
            x={28}
            y={284}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            CURRENT STACK DEPTH
          </text>
          <text
            x={28}
            y={302}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.depth}
          </text>

          {isDone ? (
            <text
              x={480}
              y={310}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              Peak depth = {n} stack frames → O(n) Space
            </text>
          ) : (
            <text
              x={180}
              y={306}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Each nested recursive call requires stack memory
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 6. New Output Array Simulation: O(n) Space
// ==========================================
const OA_SCENARIOS = [
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n12", name: "n = 12", n: 12 },
  { id: "n16", name: "n = 16", n: 16 },
];

export function OutputArraySimulation() {
  const [scenarioId, setScenarioId] = useState(OA_SCENARIOS[1].id);
  const active =
    OA_SCENARIOS.find((s) => s.id === scenarioId) ?? OA_SCENARIOS[1];
  const n = active.n;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < n; i++) {
      list.push({
        copy: i,
        cells: i + 1,
        narration: `Copy element ${i} into new output array out[${i}]`,
        status: `Element ${i} copied, allocated ${i + 1} of ${n} cells`,
      });
    }
    list.push({
      copy: -1,
      cells: n,
      narration: "A second array of size n was allocated: O(n) extra space",
      status: `Done: new output array has ${n} elements (O(n))`,
    });
    return list;
  }, [n]);

  const idleFrame = useMemo(
    () => ({
      copy: -1,
      cells: 0,
      narration: "Press Play: each input copies into a new output cell",
      status: `Ready · Array size n = ${n}`,
    }),
    [n],
  );

  const player = useSimulationPlayback(500, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 500);
  }, [frames, player]);

  const isDone = current.copy === -1 && current.cells === n;
  const cellW = Math.min(52, Math.floor(800 / n) - 8);
  const startX = (960 - (n * cellW + (n - 1) * 8)) / 2;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Building a transformed copy allocates one output cell for every
            input cell: O(n) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {OA_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 320"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="oa"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Input Array */}
          <text
            x={startX - 16}
            y={84}
            textAnchor="end"
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={12}
          >
            input
          </text>
          {Array.from({ length: n }).map((_, i) => {
            const isCopying = i === current.copy;
            const x = startX + i * (cellW + 8);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={60}
                  width={cellW}
                  height={46}
                  rx={8}
                  fill={isCopying ? "#00ceff" : "#1f1f22"}
                  stroke={isCopying ? "#00ceff" : "rgba(161,161,170,0.3)"}
                  strokeWidth={isCopying ? 2.4 : 1.5}
                />
                <text
                  x={x + cellW / 2}
                  y={83}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isCopying ? "#18181b" : "#f4f4f5"}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isCopying ? 800 : 600}
                  fontSize={13}
                >
                  {i}
                </text>
              </g>
            );
          })}

          {/* Copy arrows */}
          {current.copy >= 0 && (
            <line
              x1={startX + current.copy * (cellW + 8) + cellW / 2}
              y1={112}
              x2={startX + current.copy * (cellW + 8) + cellW / 2}
              y2={164}
              stroke="#00ceff"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {/* Output Array */}
          <text
            x={startX - 16}
            y={194}
            textAnchor="end"
            dominantBaseline="central"
            fill="#69db7c"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={12}
          >
            output
          </text>
          {Array.from({ length: n }).map((_, i) => {
            const isFilled = i < current.cells;
            const isCurrent = i === current.copy;
            const x = startX + i * (cellW + 8);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={170}
                  width={cellW}
                  height={46}
                  rx={8}
                  fill={
                    isCurrent
                      ? "#00ceff"
                      : isFilled
                        ? "rgba(105,219,124,0.22)"
                        : "#1f1f22"
                  }
                  stroke={
                    isCurrent
                      ? "#00ceff"
                      : isFilled
                        ? "#69db7c"
                        : "rgba(161,161,170,0.2)"
                  }
                  strokeWidth={isCurrent ? 2.4 : 1.5}
                />
                <text
                  x={x + cellW / 2}
                  y={193}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={
                    isCurrent ? "#18181b" : isFilled ? "#f4f4f5" : "#71717a"
                  }
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isFilled ? 800 : 600}
                  fontSize={13}
                >
                  {isFilled ? i * 2 : ""}
                </text>
              </g>
            );
          })}

          {/* Stats */}
          <text
            x={28}
            y={268}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            ALLOCATED OUTPUT CELLS
          </text>
          <text
            x={28}
            y={286}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.cells}
          </text>

          {isDone ? (
            <text
              x={480}
              y={280}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              Allocated n = {n} new cells in memory → O(n) Space
            </text>
          ) : (
            <text
              x={180}
              y={290}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Result array takes separate O(n) memory
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 7. Recursive Halving Simulation: O(log n) Space
// ==========================================
const RH_SCENARIOS = [
  { id: "n16", name: "n = 16", n: 16 },
  { id: "n64", name: "n = 64", n: 64 },
  { id: "n256", name: "n = 256", n: 256 },
];

export function RecursiveHalvingSimulation() {
  const [scenarioId, setScenarioId] = useState(RH_SCENARIOS[1].id);
  const active =
    RH_SCENARIOS.find((s) => s.id === scenarioId) ?? RH_SCENARIOS[1];
  const n = active.n;
  const maxDepth = Math.round(Math.log2(n)) + 1;

  const frames = useMemo(() => {
    const list = [];
    for (let i = 0; i < maxDepth; i++) {
      const range = n >> i;
      list.push({
        depth: i + 1,
        range,
        narration: `Call search(${range}): frame ${i + 1} stacked, range halved`,
        status: `Depth ${i + 1} of ${maxDepth}, range = ${range}`,
      });
    }
    list.push({
      depth: 0,
      range: 1,
      narration: `Base case reached: peak stack was only ${maxDepth} frames for n = ${n}`,
      status: `Done: peak depth = ${maxDepth} frames (log₂(n) + 1) → O(log n) Space`,
    });
    return list;
  }, [n, maxDepth]);

  const idleFrame = useMemo(
    () => ({
      depth: 0,
      range: n,
      narration:
        "Press Play: recursive binary search stacks one frame per halving",
      status: `Ready · n = ${n}, max stack depth = log₂(${n}) + 1 = ${maxDepth}`,
    }),
    [n, maxDepth],
  );

  const player = useSimulationPlayback(700, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 700);
  }, [frames, player]);

  const isDone = current.depth === 0 && current.range === 1;
  const frameH = Math.min(32, Math.floor(220 / maxDepth));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Recursive binary search stacks one frame per halving, then unwinds
            them all: O(log n) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {RH_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 352"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="rh"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#00ceff"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#00ceff"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(log n)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#00ceff"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Halving Call Stack */}
          <g>
            <line
              x1={320}
              y1={46}
              x2={320}
              y2={280}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />
            <line
              x1={640}
              y1={46}
              x2={640}
              y2={280}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />
            <line
              x1={310}
              y1={280}
              x2={650}
              y2={280}
              stroke="rgba(161,161,170,0.4)"
              strokeWidth={3}
            />
            <text
              x={480}
              y={296}
              textAnchor="middle"
              fill="#71717a"
              fontFamily="var(--font-mono, monospace)"
              fontSize={11}
            >
              BINARY SEARCH STACK
            </text>

            {Array.from({ length: current.depth }).map((_, fIdx) => {
              const y = 276 - (fIdx + 1) * (frameH + 3);
              const r = n >> fIdx;
              const isTop = fIdx === current.depth - 1;

              return (
                <g key={fIdx}>
                  <rect
                    x={328}
                    y={y}
                    width={304}
                    height={frameH}
                    rx={6}
                    fill={isTop ? "#00ceff" : "rgba(0,206,255,0.22)"}
                    stroke={isTop ? "#00ceff" : "#3bc9db"}
                    strokeWidth={1.8}
                  />
                  <text
                    x={480}
                    y={y + frameH / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isTop ? "#18181b" : "#f4f4f5"}
                    fontFamily="var(--font-mono, monospace)"
                    fontWeight={800}
                    fontSize={12}
                  >
                    search(range = {r})
                  </text>
                </g>
              );
            })}
          </g>

          {/* Stats */}
          <text
            x={28}
            y={300}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            PEAK FRAMES
          </text>
          <text
            x={28}
            y={318}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.depth > 0 ? current.depth : maxDepth}
          </text>

          {isDone ? (
            <text
              x={480}
              y={326}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              log₂({n}) + 1 = {maxDepth} frames peak → O(log n) Space
            </text>
          ) : (
            <text
              x={180}
              y={322}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Stack depth bounded by number of halvings
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 8. Rolling Variables Simulation: O(1) Space
// ==========================================
const RV_SCENARIOS = [
  { id: "f8", name: "8 steps", steps: 8 },
  { id: "f10", name: "10 steps", steps: 10 },
  { id: "f12", name: "12 steps", steps: 12 },
];
const FIB_NUMS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

export function RollingVariablesSimulation() {
  const [scenarioId, setScenarioId] = useState(RV_SCENARIOS[0].id);
  const active =
    RV_SCENARIOS.find((s) => s.id === scenarioId) ?? RV_SCENARIOS[0];
  const steps = active.steps;

  const frames = useMemo(() => {
    const list = [];
    let prev = 1;
    let curr = 1;
    for (let s = 1; s <= steps; s++) {
      const next = prev + curr;
      list.push({
        step: s,
        prev,
        curr,
        next,
        narration: `Step ${s}: prev = ${prev}, curr = ${curr} → next = ${next}`,
        status: `Step ${s} of ${steps}, rolling variables advance`,
      });
      prev = curr;
      curr = next;
    }
    list.push({
      step: steps + 1,
      prev,
      curr,
      next: prev + curr,
      narration:
        "Old Fibonacci numbers discarded: only 2 variables kept in memory",
      status: `Done: ${steps} steps, auxiliary memory stayed O(1)`,
    });
    return list;
  }, [steps]);

  const idleFrame = useMemo(
    () => ({
      step: 0,
      prev: 1,
      curr: 1,
      next: 2,
      narration:
        "Press Play: only the last two values are kept, older ones thrown away",
      status: `Ready · ${steps} Fibonacci steps using 2 rolling variables`,
    }),
    [steps],
  );

  const player = useSimulationPlayback(650, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 650);
  }, [frames, player]);

  const isDone = current.step > steps;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each Fibonacci step needs only the last two values, so older ones
            are thrown away: O(1) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {RV_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 300"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="rv"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#69db7c"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(1)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#69db7c"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Rolling Variables Container */}
          <g>
            <rect
              x={280}
              y={90}
              width={400}
              height={100}
              rx={12}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.5}
            />
            <text
              x={480}
              y={72}
              textAnchor="middle"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontSize={12}
              fontWeight={700}
            >
              ACTIVE ROLLING MEMORY
            </text>

            {/* Variable Prev */}
            <g>
              <rect
                x={320}
                y={110}
                width={130}
                height={60}
                rx={8}
                fill="rgba(0,206,255,0.22)"
                stroke="#00ceff"
                strokeWidth={2}
              />
              <text
                x={385}
                y={130}
                textAnchor="middle"
                fill="#00ceff"
                fontFamily="var(--font-mono, monospace)"
                fontSize={11}
                fontWeight={700}
              >
                prev
              </text>
              <text
                x={385}
                y={154}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f4f4f5"
                fontFamily="var(--font-mono, monospace)"
                fontSize={18}
                fontWeight={800}
              >
                {current.prev}
              </text>
            </g>

            {/* Plus sign */}
            <text
              x={480}
              y={145}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontSize={20}
              fontWeight={800}
            >
              +
            </text>

            {/* Variable Curr */}
            <g>
              <rect
                x={510}
                y={110}
                width={130}
                height={60}
                rx={8}
                fill="rgba(105,219,124,0.22)"
                stroke="#69db7c"
                strokeWidth={2}
              />
              <text
                x={575}
                y={130}
                textAnchor="middle"
                fill="#69db7c"
                fontFamily="var(--font-mono, monospace)"
                fontSize={11}
                fontWeight={700}
              >
                curr
              </text>
              <text
                x={575}
                y={154}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f4f4f5"
                fontFamily="var(--font-mono, monospace)"
                fontSize={18}
                fontWeight={800}
              >
                {current.curr}
              </text>
            </g>
          </g>

          {/* Stats */}
          <text
            x={28}
            y={248}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            MEMORY ALLOCATED
          </text>
          <text
            x={28}
            y={266}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            2 variables
          </text>

          {isDone ? (
            <text
              x={480}
              y={260}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              Only 2 variables held in memory across all {steps} steps → O(1)
              Space
            </text>
          ) : (
            <text
              x={180}
              y={270}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Memory never scales with n
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 9. Storing All Subsets Simulation: O(n·2ⁿ) Space
// ==========================================
const SS_SCENARIOS = [
  { id: "n3", name: "n = 3", n: 3 },
  { id: "n4", name: "n = 4", n: 4 },
];

export function StoringSubsetsSimulation() {
  const [scenarioId, setScenarioId] = useState(SS_SCENARIOS[0].id);
  const active =
    SS_SCENARIOS.find((s) => s.id === scenarioId) ?? SS_SCENARIOS[0];
  const n = active.n;
  const totalSubsets = Math.pow(2, n);

  const frames = useMemo(() => {
    const list = [];
    list.push({
      row: 0,
      subsets: 1,
      narration: "Start: one subset stored, the empty set {}",
      status: `Row 0 of ${n}, 1 subset stored`,
    });
    for (let r = 1; r <= n; r++) {
      const count = Math.pow(2, r);
      list.push({
        row: r,
        subsets: count,
        narration: `Element ${r} considered: every stored subset forks, ${Math.pow(2, r - 1)} → ${count}`,
        status: `Row ${r} of ${n}, ${count} subsets stored`,
      });
    }
    list.push({
      row: -1,
      subsets: totalSubsets,
      narration: `Every subset kept: 2ⁿ = ${totalSubsets} subsets sit in memory at once: O(n·2ⁿ)`,
      status: `Done: ${totalSubsets} subsets stored, up to ${n} items each`,
    });
    return list;
  }, [n, totalSubsets]);

  const idleFrame = useMemo(
    () => ({
      row: 0,
      subsets: 1,
      narration:
        "Press Play: power set doubles storage with each element considered",
      status: `Ready · n = ${n} elements (2ⁿ = ${totalSubsets} subsets)`,
    }),
    [n, totalSubsets],
  );

  const player = useSimulationPlayback(1000, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 1000);
  }, [frames, player]);

  const isDone = current.row === -1 && current.subsets === totalSubsets;
  const activeRow = current.row >= 0 ? current.row : isDone ? n : 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Keeping every subset doubles storage with each element, 2ⁿ subsets
            of up to n items: O(n·2ⁿ) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {SS_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 340"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="ss"
            colors={[
              ["red", "#ff8787"],
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#ff8787"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#ff8787"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(n·2ⁿ)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#ff8787"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Subsets Doubling Rows */}
          {Array.from({ length: n + 1 }).map((_, rIdx) => {
            if (rIdx > activeRow) return null;
            const count = Math.pow(2, rIdx);
            const isCurrent = rIdx === activeRow;
            const y = 60 + rIdx * 46;
            const blockW = Math.min(64, Math.floor(700 / count) - 6);
            const startX = (960 - (count * blockW + (count - 1) * 6)) / 2;

            return (
              <g key={rIdx}>
                <text
                  x={startX - 18}
                  y={y + 16}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill={isCurrent ? "#00ceff" : "#a1a1aa"}
                  fontFamily="var(--font-mono, monospace)"
                  fontSize={12}
                  fontWeight={700}
                >
                  2^{rIdx} = {count}
                </text>
                {Array.from({ length: count }).map((_, bIdx) => (
                  <rect
                    key={bIdx}
                    x={startX + bIdx * (blockW + 6)}
                    y={y}
                    width={blockW}
                    height={32}
                    rx={5}
                    fill={
                      isCurrent
                        ? "rgba(255,135,135,0.25)"
                        : "rgba(255,135,135,0.15)"
                    }
                    stroke={isCurrent ? "#ff8787" : "rgba(255,135,135,0.4)"}
                    strokeWidth={isCurrent ? 2 : 1.2}
                  />
                ))}
              </g>
            );
          })}

          {/* Stats */}
          <text
            x={28}
            y={284}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            TOTAL SUBSETS STORED
          </text>
          <text
            x={28}
            y={302}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {current.subsets}
          </text>

          {isDone ? (
            <text
              x={480}
              y={300}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              2^{n} = {totalSubsets} subsets × {n} items each → O(n·2ⁿ) Space
            </text>
          ) : (
            <text
              x={180}
              y={306}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Storage doubles at every element
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 10. Two Pointers Simulation: O(1) Space
// ==========================================
const TP_SCENARIOS = [
  { id: "n10", name: "n = 10", n: 10 },
  { id: "n12", name: "n = 12", n: 12 },
  { id: "n16", name: "n = 16", n: 16 },
];

export function TwoPointersSpaceSimulation() {
  const [scenarioId, setScenarioId] = useState(TP_SCENARIOS[1].id);
  const active =
    TP_SCENARIOS.find((s) => s.id === scenarioId) ?? TP_SCENARIOS[1];
  const n = active.n;
  const maxSteps = Math.floor(n / 2);

  const frames = useMemo(() => {
    const list = [];
    for (let s = 1; s <= maxSteps; s++) {
      const lo = s - 1;
      const hi = n - s;
      list.push({
        lo,
        hi,
        step: s,
        narration: `Step ${s}: lo = ${lo}, hi = ${hi}, still only two pointer integers`,
        status: `Step ${s} of ${maxSteps}, lo = ${lo}, hi = ${hi}`,
      });
    }
    list.push({
      lo: maxSteps,
      hi: maxSteps,
      step: maxSteps,
      narration:
        "Pointers met: whole array processed in-place using O(1) extra space",
      status: `Done: ${n} elements traversed using 2 pointer variables (O(1))`,
    });
    return list;
  }, [n, maxSteps]);

  const idleFrame = useMemo(
    () => ({
      lo: 0,
      hi: n - 1,
      step: 0,
      narration:
        "Press Play: two indices walk inward, extra memory never grows past two variables",
      status: `Ready · Array size n = ${n}, pointers lo and hi`,
    }),
    [n],
  );

  const player = useSimulationPlayback(600, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 600);
  }, [frames, player]);

  const isDone = current.narration.includes("Pointers met");
  const cellW = Math.min(52, Math.floor(800 / n) - 8);
  const startX = (960 - (n * cellW + (n - 1) * 8)) / 2;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Two indexes walk inward over any input size, so extra memory never
            grows past two variables: O(1) Space.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {TP_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id
                  ? "bg-foreground text-background font-bold"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 320"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="tp"
            colors={[
              ["cyan", "#00ceff"],
              ["green", "#69db7c"],
            ]}
          />

          <g>
            <rect
              x={808}
              y={10}
              width={124}
              height={22}
              rx={5}
              fill="none"
              stroke="#69db7c"
              strokeWidth={1.5}
            />
            <text
              x={870}
              y={21}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={12}
              style={{ letterSpacing: 0.8 }}
            >
              O(1)
            </text>
          </g>

          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill="#69db7c"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={14}
          >
            {current.narration}
          </text>

          {/* Array */}
          {Array.from({ length: n }).map((_, i) => {
            const isLo = i === current.lo;
            const isHi = i === current.hi;
            const isVisited = i < current.lo || i > current.hi;
            const isPointer = isLo || isHi;
            const x = startX + i * (cellW + 8);

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={110}
                  width={cellW}
                  height={46}
                  rx={8}
                  fill={
                    isPointer
                      ? "#00ceff"
                      : isVisited
                        ? "rgba(105,219,124,0.18)"
                        : "#1f1f22"
                  }
                  stroke={
                    isPointer
                      ? "#00ceff"
                      : isVisited
                        ? "#69db7c"
                        : "rgba(161,161,170,0.3)"
                  }
                  strokeWidth={isPointer ? 2.4 : 1.5}
                />
                <text
                  x={x + cellW / 2}
                  y={133}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isPointer ? "#18181b" : "#f4f4f5"}
                  fontFamily="var(--font-mono, monospace)"
                  fontWeight={isPointer ? 800 : 600}
                  fontSize={13}
                >
                  {i}
                </text>
              </g>
            );
          })}

          {/* Pointer Arrows */}
          {current.lo >= 0 && (
            <g>
              <polygon
                points={`${startX + current.lo * (cellW + 8) + cellW / 2},102 ${startX + current.lo * (cellW + 8) + cellW / 2 - 7},86 ${startX + current.lo * (cellW + 8) + cellW / 2 + 7},86`}
                fill="#00ceff"
              />
              <text
                x={startX + current.lo * (cellW + 8) + cellW / 2}
                y={80}
                textAnchor="middle"
                fill="#00ceff"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={800}
                fontSize={12}
              >
                lo
              </text>
            </g>
          )}

          {current.hi >= 0 && (
            <g>
              <polygon
                points={`${startX + current.hi * (cellW + 8) + cellW / 2},102 ${startX + current.hi * (cellW + 8) + cellW / 2 - 7},86 ${startX + current.hi * (cellW + 8) + cellW / 2 + 7},86`}
                fill="#00ceff"
              />
              <text
                x={startX + current.hi * (cellW + 8) + cellW / 2}
                y={80}
                textAnchor="middle"
                fill="#00ceff"
                fontFamily="var(--font-mono, monospace)"
                fontWeight={800}
                fontSize={12}
              >
                hi
              </text>
            </g>
          )}

          {/* Stats */}
          <text
            x={28}
            y={248}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            EXTRA MEMORY
          </text>
          <text
            x={28}
            y={266}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            2 pointers
          </text>

          {isDone ? (
            <text
              x={480}
              y={260}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#69db7c"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={16}
            >
              Array processed in-place with 2 pointer indices → O(1) Space
            </text>
          ) : (
            <text
              x={180}
              y={270}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={600}
              fontSize={12.5}
            >
              Only lo and hi integer registers allocated
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
