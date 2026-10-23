"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

const SCENARIOS = [
  { id: "n5", name: "fib(5)", n: 5 },
  { id: "n6", name: "fib(6)", n: 6 },
];

const MEMO_CODE = [
  "memo(n):",
  "  if cached: return cache[n]",
  "  if n <= 1: r = n",
  "  else:",
  "    r = memo(n-1) + memo(n-2)",
  "  cache[n] = r",
  "  return r",
];

const TAB_CODE = [
  "tab(n):",
  "  dp[0] = 0; dp[1] = 1",
  "  for i in 2..n:",
  "    dp[i] = dp[i-1] + dp[i-2]",
  "  return dp[n]",
];

interface TreeNode {
  id: number;
  k: number;
  depth: number;
  children: number[];
  x: number;
  subtreeSize: number;
}

type Phase = "idle" | "memo" | "tab" | "done";
type CellState = "pending" | "active" | "filled" | "hit";
type NodeState = "ghost" | "active" | "hit" | "computed";

interface SimFrame {
  phase: Phase;
  badge: string;
  accent: "cyan" | "yellow" | "green";
  note: string;
  sub: string;
  memoLine: number;
  tabLine: number;
  nodeState: NodeState[];
  activeNode: number;
  path: number[];
  cache: (number | null)[];
  cacheState: CellState[];
  dp: (number | null)[];
  dpState: CellState[];
  fillSrc: [number, number] | null;
  fillDst: number;
  calls: number;
  skipped: number;
  steps: number;
  resultText: string;
}

const DESKTOP = {
  vbW: 960,
  vbH: 500,
  noteFont: 14,
  subY: 60,
  memoPanel: { x: 28, y: 96, w: 216 },
  tabPanel: { x: 28, y: 260, w: 216 },
  codeFont: 11,
  codeLH: 17.5,
  treeX: 270,
  treeW: 370,
  treeY: 104,
  treeH: 240,
  treeLabelY: 78,
  cacheY: 388,
  cacheCell: 30,
  dpX: 670,
  dpW: 262,
  dpY: 140,
  dpLabelY: 78,
  dpCell: 34,
  scoreX: 670,
  scoreW: 262,
  scoreY: 252,
  resultY: 470,
};

const MOBILE = {
  vbW: 440,
  vbH: 594,
  noteFont: 12,
  subY: 56,
  memoPanel: { x: 20, y: 72, w: 208 },
  tabPanel: { x: 236, y: 72, w: 184 },
  codeFont: 9.5,
  codeLH: 14,
  treeX: 20,
  treeW: 400,
  treeY: 208,
  treeH: 160,
  treeLabelY: 190,
  cacheY: 385,
  cacheCell: 24,
  dpX: 60,
  dpW: 320,
  dpY: 462,
  dpLabelY: 428,
  dpCell: 24,
  scoreX: 20,
  scoreW: 400,
  scoreY: 508,
  resultY: 580,
};

const ACCENT_COLORS = {
  cyan: "#06b6d4",
  yellow: "#eab308",
  green: "#22c55e",
};

export function MemoizationVsTabulationSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(960);
  const isCompact = containerWidth > 0 && containerWidth < 720;
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId) || SCENARIOS[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const data = useMemo(() => {
    const N = scenario.n;
    const treeNodes: TreeNode[] = [];

    function buildTree(k: number, depth: number): number {
      const id = treeNodes.length;
      treeNodes.push({ id, k, depth, children: [], x: 0, subtreeSize: 1 });
      if (k >= 2) {
        const left = buildTree(k - 1, depth + 1);
        const right = buildTree(k - 2, depth + 1);
        treeNodes[id].children.push(left, right);
        treeNodes[id].subtreeSize = 1 + treeNodes[left].subtreeSize + treeNodes[right].subtreeSize;
      }
      return id;
    }

    const rootId = buildTree(N, 0);
    let xIndex = 0;
    function layoutX(id: number) {
      const node = treeNodes[id];
      if (node.children.length === 0) {
        node.x = xIndex++;
      } else {
        node.children.forEach(layoutX);
        node.x = (treeNodes[node.children[0]].x + treeNodes[node.children[node.children.length - 1]].x) / 2;
      }
    }
    layoutX(rootId);

    const maxDepth = Math.max(...treeNodes.map((t) => t.depth));
    const maxX = Math.max(...treeNodes.map((t) => t.x));
    const totalCalls = treeNodes[rootId].subtreeSize;

    const nodeState: NodeState[] = Array(treeNodes.length).fill("ghost");
    const path: number[] = [];
    const cache: (number | null)[] = Array(N + 1).fill(null);
    const cacheState: CellState[] = Array(N + 1).fill("pending");
    const dp: (number | null)[] = Array(N + 1).fill(null);
    const dpState: CellState[] = Array(N + 1).fill("pending");

    const frames: SimFrame[] = [];
    let calls = 0;
    let skipped = 0;
    let steps = 0;

    const flushState = (states: CellState[], vals: (number | null)[]) => {
      for (let i = 0; i < states.length; i++) {
        if (states[i] === "active" || states[i] === "hit") {
          states[i] = vals[i] !== null ? "filled" : "pending";
        }
      }
    };

    const pushFrame = (
      phase: Phase,
      badge: string,
      accent: "cyan" | "yellow" | "green",
      note: string,
      sub: string,
      memoLine: number,
      tabLine: number,
      activeNode = -1,
      fillSrc: [number, number] | null = null,
      fillDst = -1,
      resultText = ""
    ) => {
      frames.push({
        phase,
        badge,
        accent,
        note,
        sub,
        memoLine,
        tabLine,
        nodeState: [...nodeState],
        activeNode,
        path: [...path],
        cache: [...cache],
        cacheState: [...cacheState],
        dp: [...dp],
        dpState: [...dpState],
        fillSrc,
        fillDst,
        calls,
        skipped,
        steps,
        resultText,
      });
    };

    pushFrame(
      "memo",
      "TOP-DOWN",
      "cyan",
      `Top-down: recurse from fib(${N}), cache every answer`,
      "the faint tree is every call plain recursion would make",
      0,
      -1
    );

    function simMemo(nodeId: number) {
      const node = treeNodes[nodeId];
      const kVal = node.k;
      calls += 1;
      path.push(nodeId);
      flushState(cacheState, cache);

      if (cache[kVal] !== null) {
        nodeState[nodeId] = "hit";
        cacheState[kVal] = "hit";
        skipped += node.subtreeSize - 1;
        pushFrame(
          "memo",
          "CACHE HIT",
          "yellow",
          `fib(${kVal}) is already cached, reuse ${cache[kVal]}`,
          node.subtreeSize > 1
            ? `its whole subtree stays unexplored: ${node.subtreeSize - 1} calls pruned`
            : "no recomputation needed",
          1,
          -1,
          nodeId
        );
        path.pop();
        return;
      }

      if (kVal <= 1) {
        cache[kVal] = kVal;
        nodeState[nodeId] = "computed";
        cacheState[kVal] = "active";
        pushFrame(
          "memo",
          "BASE CASE",
          "yellow",
          `Base case: fib(${kVal}) = ${kVal}, store it`,
          "",
          2,
          -1,
          nodeId
        );
        path.pop();
        return;
      }

      cacheState[kVal] = "active";
      pushFrame(
        "memo",
        "CALL",
        "cyan",
        `Call fib(${kVal}): not cached, recurse`,
        `fib(${kVal}) needs fib(${kVal - 1}) and fib(${kVal - 2})`,
        1,
        -1,
        nodeId
      );

      node.children.forEach(simMemo);

      const lVal = cache[kVal - 1]!;
      const rVal = cache[kVal - 2]!;
      cache[kVal] = lVal + rVal;
      nodeState[nodeId] = "computed";
      flushState(cacheState, cache);
      cacheState[kVal] = "active";

      pushFrame(
        "memo",
        "STORE",
        "green",
        `Store fib(${kVal}) = ${lVal} + ${rVal} = ${lVal + rVal} in the cache`,
        "",
        5,
        -1,
        nodeId
      );
      path.pop();
    }

    simMemo(rootId);
    flushState(cacheState, cache);

    pushFrame(
      "memo",
      "CACHE FULL",
      "green",
      `Top-down done: ${calls} calls instead of ${totalCalls}`,
      `${skipped} calls pruned by cache hits`,
      6,
      -1
    );

    // Tabulation simulation
    pushFrame(
      "tab",
      "BOTTOM-UP",
      "cyan",
      "Bottom-up: fill dp[] left to right, no recursion",
      "smallest subproblems first, each cell built from earlier cells",
      -1,
      0
    );

    dp[0] = 0;
    dpState[0] = "active";
    if (N >= 1) {
      dp[1] = 1;
      dpState[1] = "active";
    }
    steps += Math.min(2, N + 1);

    pushFrame(
      "tab",
      "BASE CASE",
      "yellow",
      "Base cases first: dp[0] = 0, dp[1] = 1",
      "",
      -1,
      1
    );
    flushState(dpState, dp);

    for (let i = 2; i <= N; i++) {
      dp[i] = dp[i - 1]! + dp[i - 2]!;
      dpState[i] = "active";
      steps += 1;
      pushFrame(
        "tab",
        "FILL",
        "cyan",
        `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        "",
        -1,
        3,
        -1,
        [i - 1, i - 2],
        i
      );
      flushState(dpState, dp);
    }

    pushFrame(
      "tab",
      "TABLE FULL",
      "green",
      `Table full after ${steps} steps: fib(${N}) = ${dp[N]}`,
      "",
      -1,
      4
    );

    pushFrame(
      "done",
      "DONE",
      "green",
      `Same answer both ways: fib(${N}) = ${dp[N]}`,
      `top-down ${calls} calls (${skipped} pruned), bottom-up ${steps} steps, both O(n)`,
      -1,
      -1,
      -1,
      null,
      -1,
      `fib(${N}) = ${dp[N]}`
    );

    return {
      n: N,
      nodes: treeNodes,
      maxDepth,
      maxX,
      totalCalls,
      frames,
    };
  }, [scenario]);

  const idleFrame = useMemo<SimFrame>(() => {
    const N = scenario.n;
    return {
      phase: "idle",
      badge: "READY",
      accent: "yellow",
      note: `Compare Top-Down Memoization vs Bottom-Up Tabulation for fib(${N})`,
      sub: "watch the memoized tree prune redundant subtrees, then watch bottom-up fill the 1D table",
      memoLine: -1,
      tabLine: -1,
      nodeState: Array(data.nodes.length).fill("ghost"),
      activeNode: -1,
      path: [],
      cache: Array(N + 1).fill(null),
      cacheState: Array(N + 1).fill("pending"),
      dp: Array(N + 1).fill(null),
      dpState: Array(N + 1).fill("pending"),
      fillSrc: null,
      fillDst: -1,
      calls: 0,
      skipped: 0,
      steps: 0,
      resultText: "",
    };
  }, [scenario, data.nodes.length]);

  const player = useSimulationPlayback<SimFrame>(600, idleFrame);
  const currentFrame = player.view;

  const handleRun = useCallback(() => {
    const stepDuration = Math.max(380, Math.min(700, Math.round(16000 / data.frames.length)));
    player.play(data.frames, stepDuration);
  }, [data.frames, player]);

  const P = isCompact ? MOBILE : DESKTOP;
  const accentColor = ACCENT_COLORS[currentFrame.accent] || "#eab308";

  const treeSpacingX = P.treeW / (data.maxX + 1);
  const getNodeX = (x: number) => P.treeX + (x + 0.5) * treeSpacingX;
  const getNodeY = (depth: number) => P.treeY + (depth / (data.maxDepth || 1)) * P.treeH;
  const nodeRadius = Math.min(isCompact ? 10 : 11, Math.max(6, 0.4 * treeSpacingX));

  const cacheCellWidth = P.cacheCell;
  const cacheTotalWidth = (scenario.n + 1) * cacheCellWidth;
  const cacheStartX = P.treeX + (P.treeW - cacheTotalWidth) / 2;

  const dpCellWidth = Math.min(P.dpCell, P.dpW / (scenario.n + 1));
  const dpTotalWidth = (scenario.n + 1) * dpCellWidth;
  const dpStartX = P.dpX + (P.dpW - dpTotalWidth) / 2;

  return (
    <div className="w-full space-y-4">
      {/* Top Description & Scenario Selector */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Top-down memoization stores results during recursion to prune branches. Bottom-up
            tabulation builds from base cases up without recursion overhead.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {SCENARIOS.map((s) => (
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

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl border border-white/10 bg-black p-2 sm:p-4 overflow-hidden shadow-2xl"
      >
        <svg
          viewBox={`0 0 ${P.vbW} ${P.vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="mvt"
            colors={[
              ["cyan", "#06b6d4"],
              ["green", "#22c55e"],
              ["yellow", "#eab308"],
            ]}
          />

          {/* Phase Badge */}
          <g>
            <rect
              x={P.vbW - 140}
              y={8}
              width={120}
              height={22}
              rx={5}
              fill="none"
              stroke={accentColor}
              strokeWidth={1.5}
              opacity={0.95}
            />
            <text
              x={P.vbW - 80}
              y={20}
              textAnchor="middle"
              dominantBaseline="central"
              fill={accentColor}
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 0.8 }}
            >
              {currentFrame.badge}
            </text>
          </g>

          {/* Top Note */}
          <text
            x={P.memoPanel.x}
            y={12}
            dominantBaseline="hanging"
            fill={accentColor}
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={P.noteFont}
          >
            {currentFrame.note}
          </text>
          <text
            x={P.memoPanel.x}
            y={P.subY}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={600}
            fontSize={isCompact ? 10.5 : 11.5}
          >
            {currentFrame.sub}
          </text>

          {/* Memoization Code Box */}
          <g opacity={currentFrame.phase === "tab" ? 0.45 : 1}>
            <rect
              x={P.memoPanel.x}
              y={P.memoPanel.y}
              width={P.memoPanel.w}
              height={MEMO_CODE.length * P.codeLH + 12}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            {currentFrame.memoLine >= 0 && (
              <g>
                <rect
                  x={P.memoPanel.x + 1}
                  y={P.memoPanel.y + 6 + currentFrame.memoLine * P.codeLH}
                  width={P.memoPanel.w - 2}
                  height={P.codeLH}
                  fill="#06b6d4"
                  opacity={0.15}
                />
                <rect
                  x={P.memoPanel.x + 1}
                  y={P.memoPanel.y + 6 + currentFrame.memoLine * P.codeLH}
                  width={3}
                  height={P.codeLH}
                  fill="#06b6d4"
                />
              </g>
            )}
            {MEMO_CODE.map((line, idx) => (
              <text
                key={idx}
                x={P.memoPanel.x + 10}
                y={P.memoPanel.y + 6 + idx * P.codeLH + P.codeLH / 2}
                dominantBaseline="central"
                fill={idx === currentFrame.memoLine ? "#f4f4f5" : "#71717a"}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={idx === currentFrame.memoLine ? 800 : 500}
                fontSize={P.codeFont}
                xmlSpace="preserve"
              >
                {line}
              </text>
            ))}
          </g>

          {/* Tabulation Code Box */}
          <g opacity={currentFrame.phase === "memo" ? 0.45 : 1}>
            <rect
              x={P.tabPanel.x}
              y={P.tabPanel.y}
              width={P.tabPanel.w}
              height={TAB_CODE.length * P.codeLH + 12}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            {currentFrame.tabLine >= 0 && (
              <g>
                <rect
                  x={P.tabPanel.x + 1}
                  y={P.tabPanel.y + 6 + currentFrame.tabLine * P.codeLH}
                  width={P.tabPanel.w - 2}
                  height={P.codeLH}
                  fill="#06b6d4"
                  opacity={0.15}
                />
                <rect
                  x={P.tabPanel.x + 1}
                  y={P.tabPanel.y + 6 + currentFrame.tabLine * P.codeLH}
                  width={3}
                  height={P.codeLH}
                  fill="#06b6d4"
                />
              </g>
            )}
            {TAB_CODE.map((line, idx) => (
              <text
                key={idx}
                x={P.tabPanel.x + 10}
                y={P.tabPanel.y + 6 + idx * P.codeLH + P.codeLH / 2}
                dominantBaseline="central"
                fill={idx === currentFrame.tabLine ? "#f4f4f5" : "#71717a"}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={idx === currentFrame.tabLine ? 800 : 500}
                fontSize={P.codeFont}
                xmlSpace="preserve"
              >
                {line}
              </text>
            ))}
          </g>

          {/* Tree Label */}
          <text
            x={P.treeX}
            y={P.treeLabelY}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={isCompact ? 10 : 11.5}
            style={{ letterSpacing: 1 }}
          >
            TOP-DOWN RECURSION TREE
          </text>

          {/* Recursion Tree Edges */}
          {data.nodes.map((parent) =>
            parent.children.map((childId) => {
              const child = data.nodes[childId];
              const x1 = getNodeX(parent.x);
              const y1 = getNodeY(parent.depth);
              const x2 = getNodeX(child.x);
              const y2 = getNodeY(child.depth);

              const childState = currentFrame.nodeState[childId];
              const isHit = childState === "hit";
              const isComputed = childState === "computed";
              const isGhost = childState === "ghost";

              return (
                <line
                  key={`${parent.id}-${childId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHit ? "#eab308" : isComputed ? "#22c55e" : "rgba(161,161,170,0.2)"}
                  strokeWidth={isHit || isComputed ? 1.75 : 1}
                  strokeDasharray={isGhost ? "3 3" : undefined}
                  opacity={isGhost ? 0.35 : 0.85}
                />
              );
            })
          )}

          {/* Recursion Tree Nodes */}
          {data.nodes.map((node) => {
            const cx = getNodeX(node.x);
            const cy = getNodeY(node.depth);
            const state = currentFrame.nodeState[node.id];
            const isActive = node.id === currentFrame.activeNode;
            const isHit = state === "hit";
            const isComputed = state === "computed";
            const isGhost = state === "ghost";

            let fill = "#000000";
            let stroke = "rgba(255,255,255,0.2)";
            let textColor = "#FFFFFF";
            if (isActive) {
              fill = "#93C5FD";
              stroke = "#93C5FD";
              textColor = "#09090b";
            } else if (isHit) {
              fill = "#FDE047";
              stroke = "#FDE047";
              textColor = "#09090b";
            } else if (isComputed) {
              fill = "#86EFAC";
              stroke = "#86EFAC";
              textColor = "#09090b";
            }

            return (
              <g key={node.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={nodeRadius}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
                <text
                  x={cx}
                  y={cy + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textColor}
                  fontFamily="'Inter', -apple-system, sans-serif"
                  fontWeight={800}
                  fontSize={nodeRadius > 9 ? 10 : 8}
                >
                  {node.k}
                </text>
              </g>
            );
          })}

          {/* Cache Table Section */}
          <g>
            <text
              x={cacheStartX}
              y={P.cacheY - 18}
              fill="#a1a1aa"
              fontFamily="'Inter', -apple-system, sans-serif"
              fontWeight={800}
              fontSize={10.5}
              style={{ letterSpacing: 0.8 }}
            >
              MEMO CACHE[]
            </text>
            {currentFrame.cache.map((val, idx) => {
              const x = cacheStartX + idx * cacheCellWidth;
              const state = currentFrame.cacheState[idx];
              const isFilled = val !== null;
              const isAct = state === "active";
              const isH = state === "hit";

              let stroke = isAct ? "#93C5FD" : isH ? "#FDE047" : isFilled ? "#86EFAC" : "rgba(255,255,255,0.18)";
              let fill = isAct ? "#93C5FD" : isH ? "#FDE047" : isFilled ? "#86EFAC" : "#000000";
              let textCol = isAct || isH || isFilled ? "#09090b" : "#FFFFFF";

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={P.cacheY}
                    width={cacheCellWidth}
                    height={cacheCellWidth}
                    rx={5}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isAct || isH ? 2 : 1.25}
                  />
                  <text
                    x={x + cacheCellWidth / 2}
                    y={P.cacheY - 6}
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize={9}
                    fontFamily="'Inter', -apple-system, sans-serif"
                  >
                    {idx}
                  </text>
                  {val !== null && (
                    <text
                      x={x + cacheCellWidth / 2}
                      y={P.cacheY + cacheCellWidth / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textCol}
                      fontWeight={800}
                      fontSize={11}
                      fontFamily="'Inter', -apple-system, sans-serif"
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* DP Table Section (Bottom-up) */}
          <g>
            <text
              x={dpStartX}
              y={P.dpY - 18}
              fill="#a1a1aa"
              fontFamily="'Inter', -apple-system, sans-serif"
              fontWeight={800}
              fontSize={10.5}
              style={{ letterSpacing: 0.8 }}
            >
              BOTTOM-UP DP[] TABLE
            </text>
            {currentFrame.dp.map((val, idx) => {
              const x = dpStartX + idx * dpCellWidth;
              const state = currentFrame.dpState[idx];
              const isFilled = val !== null;
              const isAct = state === "active";

              let stroke = isAct ? "#93C5FD" : isFilled ? "#86EFAC" : "rgba(255,255,255,0.18)";
              let fill = isAct ? "#93C5FD" : isFilled ? "#86EFAC" : "#000000";
              let textCol = isAct || isFilled ? "#09090b" : "#FFFFFF";

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={P.dpY}
                    width={dpCellWidth}
                    height={dpCellWidth}
                    rx={5}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isAct ? 2 : 1.25}
                  />
                  <text
                    x={x + dpCellWidth / 2}
                    y={P.dpY - 6}
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize={9}
                    fontFamily="'Inter', -apple-system, sans-serif"
                  >
                    {idx}
                  </text>
                  {val !== null && (
                    <text
                      x={x + dpCellWidth / 2}
                      y={P.dpY + dpCellWidth / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textCol}
                      fontWeight={800}
                      fontSize={11}
                      fontFamily="'Inter', -apple-system, sans-serif"
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Comparison Score Metrics Box */}
          <g>
            <rect
              x={P.scoreX}
              y={P.scoreY}
              width={P.scoreW}
              height={140}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            <text
              x={P.scoreX + 12}
              y={P.scoreY + 18}
              fill="#a1a1aa"
              fontSize={10.5}
              fontWeight={800}
              fontFamily="var(--font-mono, monospace)"
              style={{ letterSpacing: 0.8 }}
            >
              METRICS COMPARISON
            </text>

            <text
              x={P.scoreX + 12}
              y={P.scoreY + 44}
              fill="#f4f4f5"
              fontSize={11.5}
              fontFamily="var(--font-mono, monospace)"
            >
              Top-Down Calls: <tspan fill="#06b6d4" fontWeight={800}>{currentFrame.calls}</tspan> / {data.totalCalls}
            </text>
            <text
              x={P.scoreX + 12}
              y={P.scoreY + 68}
              fill="#f4f4f5"
              fontSize={11.5}
              fontFamily="var(--font-mono, monospace)"
            >
              Cache Hits Pruned: <tspan fill="#eab308" fontWeight={800}>{currentFrame.skipped}</tspan> calls
            </text>
            <text
              x={P.scoreX + 12}
              y={P.scoreY + 92}
              fill="#f4f4f5"
              fontSize={11.5}
              fontFamily="var(--font-mono, monospace)"
            >
              Bottom-Up Steps: <tspan fill="#22c55e" fontWeight={800}>{currentFrame.steps}</tspan> / {scenario.n + 1}
            </text>
            <text
              x={P.scoreX + 12}
              y={P.scoreY + 116}
              fill="#71717a"
              fontSize={10}
              fontFamily="var(--font-mono, monospace)"
            >
              Both reach O(n) time & O(n) space
            </text>
          </g>

          {/* Bottom Completion Result Text */}
          {currentFrame.resultText && (
            <g filter="url(#mvt-glow-green)">
              <text
                x={P.vbW / 2}
                y={P.resultY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#22c55e"
                fontSize={16}
                fontWeight={800}
                fontFamily="var(--font-mono, monospace)"
                style={{ letterSpacing: 0.4 }}
              >
                {currentFrame.resultText}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
