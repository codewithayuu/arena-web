"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_PURPLE = "#DDD6FE"; // Solid Pastel Lavender
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

// ============================================================================
// 10. BIPARTITE GRAPH CHECK (2-COLORING)
// ============================================================================

export function BipartiteCheckSimulation() {
  const nodes = [
    { id: 0, x: 220, y: 70 },
    { id: 1, x: 500, y: 70 },
    { id: 2, x: 500, y: 190 },
    { id: 3, x: 220, y: 190 },
  ];

  const edges = [
    { u: 0, v: 1 },
    { u: 1, v: 2 },
    { u: 2, v: 3 },
    { u: 3, v: 0 },
  ];

  const frames = useMemo(() => {
    return [
      {
        colors: { 0: "cyan" },
        activeNode: 0,
        note: "Start 2-coloring at node 0. Assign Color A (Cyan).",
      },
      {
        colors: { 0: "cyan", 1: "amber", 3: "amber" },
        activeNode: 1,
        note: "Neighbors 1 and 3 receive opposite Color B (Amber).",
      },
      {
        colors: { 0: "cyan", 1: "amber", 3: "amber", 2: "cyan" },
        activeNode: 2,
        note: "Node 2 receives Color A (Cyan). Check neighbor 3: Color B != Color A (Valid!).",
      },
      {
        colors: { 0: "cyan", 1: "amber", 3: "amber", 2: "cyan" },
        activeNode: 2,
        isBipartite: true,
        note: "Graph is Bipartite! No adjacent vertices share the same color (No odd-length cycles).",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Bipartite Graph Check (2-Coloring)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A graph is bipartite if vertices can be partitioned into two independent sets with no intra-set edges.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bip" colors={[["cyan", COLOR_CYAN], ["amber", COLOR_AMBER]]} />

          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.u)!;
            const v = nodes.find((n) => n.id === e.v)!;
            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="rgba(161,161,170,0.3)"
                strokeWidth={1.5}
              />
            );
          })}

          {nodes.map((n) => {
            const col = (f.colors as Record<number, string>)[n.id];
            let fill = "#000000";
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textColor = "#FFFFFF";

            if (col === "cyan") {
              fill = COLOR_CYAN; // Solid Pastel Sky Blue
              stroke = COLOR_CYAN;
              textColor = "#09090b";
            } else if (col === "amber") {
              fill = COLOR_AMBER; // Solid Pastel Peach
              stroke = COLOR_AMBER;
              textColor = "#09090b";
            }

            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={800} fill={textColor}>
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 11. CYCLE DETECTION (DIRECTED GRAPH 3-COLOR DFS)
// ============================================================================

export function CycleDetectionSimulation() {
  const frames = useMemo(() => {
    return [
      {
        colors: { 0: "gray" },
        note: "Start DFS at Node 0. Color 0 GRAY (currently exploring in recursion stack).",
      },
      {
        colors: { 0: "gray", 1: "gray" },
        note: "Follow edge 0 -> 1. Color 1 GRAY.",
      },
      {
        colors: { 0: "gray", 1: "gray", 2: "gray" },
        note: "Follow edge 1 -> 2. Color 2 GRAY.",
      },
      {
        colors: { 0: "gray", 1: "gray", 2: "gray" },
        backEdge: { from: 2, to: 0 },
        hasCycle: true,
        note: "Edge 2 -> 0 points to ancestor 0 which is currently GRAY! Back Edge confirmed: CYCLE DETECTED!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  const nodes = [
    { id: 0, x: 260, y: 70 },
    { id: 1, x: 460, y: 70 },
    { id: 2, x: 360, y: 190 },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Cycle Detection (3-Color DFS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            White (unvisited), Gray (in DFS stack), Black (fully processed). Reaching a Gray node indicates a cycle.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="cycle" colors={[["cyan", COLOR_CYAN], ["red", COLOR_RED]]} />

          {f.hasCycle && (
            <text x="360" y="25" textAnchor="middle" fill={COLOR_RED} fontSize={13} fontWeight="bold">
              CYCLE DETECTED (Back Edge 2 &rarr; 0)
            </text>
          )}

          <line x1={260} y1={70} x2={460} y2={70} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={460} y1={70} x2={360} y2={190} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line
            x1={360}
            y1={190}
            x2={260}
            y2={70}
            stroke={f.backEdge ? COLOR_RED : "rgba(161,161,170,0.3)"}
            strokeWidth={f.backEdge ? 2.5 : 1.5}
          />

          {nodes.map((n) => {
            const col = (f.colors as Record<number, string>)[n.id];
            const isCycle = f.hasCycle && (n.id === 0 || n.id === 2);
            let fill = "#000000";
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textColor = "#FFFFFF";

            if (isCycle) {
              fill = COLOR_RED; // Solid Pastel Rose
              stroke = COLOR_RED;
              textColor = "#09090b";
            } else if (col === "gray") {
              fill = COLOR_AMBER; // Solid Pastel Peach
              stroke = COLOR_AMBER;
              textColor = "#09090b";
            }

            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={800} fill={textColor}>
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 12. BRIDGES (CRITICAL EDGES)
// ============================================================================

export function BridgesSimulation() {
  const frames = useMemo(() => {
    return [
      {
        tin: { 0: 1, 1: 2, 2: 3, 3: 4 },
        low: { 0: 1, 1: 1, 2: 1, 3: 4 },
        bridgeEdge: undefined,
        note: "DFS computes discovery time tin[u] and lowest reachable ancestor low[u].",
      },
      {
        tin: { 0: 1, 1: 2, 2: 3, 3: 4 },
        low: { 0: 1, 1: 1, 2: 1, 3: 4 },
        bridgeEdge: { u: 2, v: 3 },
        note: "Edge (2, 3): low[3] = 4 > tin[2] = 3. Node 3 has no back-edge to earlier ancestors => Edge (2, 3) is a BRIDGE!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Bridge-Finding Algorithm (Tarjan&apos;s DFS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            An edge (u, v) is a bridge iff low[v] &gt; tin[u], meaning v has no back edges to u or ancestors of u.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bridge" colors={[["cyan", COLOR_CYAN], ["red", COLOR_RED]]} />

          {f.bridgeEdge && (
            <text x="360" y="25" textAnchor="middle" fill={COLOR_RED} fontSize={13} fontWeight="bold">
              BRIDGE FOUND: Edge (2, 3)
            </text>
          )}

          {/* Cycle 0-1-2 */}
          <line x1={200} y1={80} x2={340} y2={60} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={340} y1={60} x2={270} y2={180} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={270} y1={180} x2={200} y2={80} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />

          {/* Bridge 2-3 */}
          <line
            x1={270}
            y1={180}
            x2={480}
            y2={180}
            stroke={f.bridgeEdge ? COLOR_RED : "rgba(161,161,170,0.3)"}
            strokeWidth={f.bridgeEdge ? 3 : 1.5}
            strokeDasharray={f.bridgeEdge ? "4 4" : undefined}
          />

          {[
            { id: 0, x: 200, y: 80 },
            { id: 1, x: 340, y: 60 },
            { id: 2, x: 270, y: 180 },
            { id: 3, x: 480, y: 180 },
          ].map((n) => (
            <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
              <circle r={22} fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth={2} />
              <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight="bold" fill="#f4f4f5">
                {n.id}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 13. ARTICULATION POINTS (CUT VERTICES)
// ============================================================================

export function ArticulationPointsSimulation() {
  const frames = useMemo(() => {
    return [
      {
        cutVertex: undefined,
        note: "Articulation Point: A vertex whose removal disconnects the graph into two or more parts.",
      },
      {
        cutVertex: 2,
        note: "Node 2 is an Articulation Point! Removing node 2 separates {0, 1} from {3, 4}.",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Articulation Points (Cut Vertices)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Vertices whose deletion increases the number of connected components. Found in O(V + E) via low-link values.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="ap" colors={[["cyan", COLOR_CYAN], ["amber", COLOR_AMBER]]} />

          <line x1={180} y1={80} x2={260} y2={160} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={180} y1={80} x2={360} y2={120} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={260} y1={160} x2={360} y2={120} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />

          <line x1={360} y1={120} x2={460} y2={80} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={360} y1={120} x2={460} y2={160} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={460} y1={80} x2={460} y2={160} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />

          {[
            { id: 0, x: 180, y: 80 },
            { id: 1, x: 260, y: 160 },
            { id: 2, x: 360, y: 120 },
            { id: 3, x: 460, y: 80 },
            { id: 4, x: 460, y: 160 },
          ].map((n) => {
            const isCut = f.cutVertex === n.id;
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={22}
                  fill="#1f1f23"
                  stroke={isCut ? COLOR_AMBER : COLOR_CYAN}
                  strokeWidth={isCut ? 3 : 1.5}
                  filter={isCut ? "url(#ap-glow-amber)" : undefined}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight="bold" fill="#f4f4f5">
                  {n.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 14. TARJAN'S STRONGLY CONNECTED COMPONENTS (SCC)
// ============================================================================

export function TarjanSccSimulation() {
  const frames = useMemo(() => {
    return [
      {
        sccs: [],
        note: "Tarjan's algorithm uses DFS stack and low-link values to isolate SCCs in O(V + E).",
      },
      {
        sccs: [[2]],
        note: "Node 2: low[2] == dfn[2]. Pop 2 => SCC 1: {2}.",
      },
      {
        sccs: [[2], [0, 1]],
        note: "Cycle 0 <-> 1: low[0] == dfn[0]. Pop 1, 0 => SCC 2: {0, 1}.",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Tarjan&apos;s Strongly Connected Components</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Single-pass DFS partitioning directed graph into maximal subgraphs where every vertex is reachable from every other.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="tarj" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(140, 50)">
            <text x="0" y="25" fill="#a1a1aa" fontSize={13} fontWeight="bold">
              Identified SCCs:
            </text>
            <g transform="translate(180, 0)">
              {f.sccs.map((scc, i) => (
                <g key={i} transform={`translate(${i * 120}, 0)`}>
                  <rect width={100} height={40} rx={6} fill="rgba(0,208,132,0.15)" stroke={COLOR_GREEN} strokeWidth={1.5} />
                  <text x={50} y={25} textAnchor="middle" fill={COLOR_GREEN} fontSize={12} fontWeight="bold">
                    &#123;{scc.join(", ")}&#125;
                  </text>
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 15. KOSARAJU'S SCC ALGORITHM
// ============================================================================

export function KosarajuSccSimulation() {
  const frames = useMemo(() => {
    return [
      {
        phase: "Pass 1: Forward DFS",
        note: "Run standard DFS on original directed graph to record finish times on a stack.",
      },
      {
        phase: "Pass 2: Transpose Graph",
        note: "Reverse all directed graph edges to build transpose graph G^T.",
      },
      {
        phase: "Pass 3: Reverse DFS Extraction",
        note: "Run DFS on G^T in stack order: extracts Strongly Connected Components sequentially!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Kosaraju&apos;s SCC Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Two-pass algorithm: 1. Order vertices by finish time, 2. DFS on transposed graph Gᵀ.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 200" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="kosa" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="70" textAnchor="middle" fill={COLOR_CYAN} fontSize={16} fontWeight="bold">
            {f.phase}
          </text>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 16. MAX FLOW (EDMONDS-KARP / FORD-FULKERSON)
// ============================================================================

export function MaxFlowSimulation() {
  const frames = useMemo(() => {
    return [
      {
        flow: 0,
        path: undefined,
        note: "Start Edmonds-Karp Max Flow. Source S -> Sink T. Initial Flow = 0.",
      },
      {
        flow: 5,
        path: "S -> A -> T (Bottleneck = 5)",
        note: "Augmenting path found via BFS: S -> A -> T with capacity 5. Total flow = 5.",
      },
      {
        flow: 9,
        path: "S -> B -> T (Bottleneck = 4)",
        note: "Augmenting path: S -> B -> T with capacity 4. Total flow = 5 + 4 = 9.",
      },
      {
        flow: 9,
        path: "No augmenting path remains in residual graph",
        note: "Residual network has no paths from S to T. Max Flow = 9 (matches Min Cut capacity)!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Edmonds-Karp Max Flow Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Computes maximum network flow from Source to Sink by repeatedly finding shortest augmenting paths via BFS.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="mf" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="30" textAnchor="middle" fill={COLOR_GREEN} fontSize={14} fontWeight="bold">
            Total Flow: {f.flow}
          </text>
          {f.path && (
            <text x="360" y="60" textAnchor="middle" fill={COLOR_CYAN} fontSize={12} fontWeight="bold">
              {f.path}
            </text>
          )}

          <g transform="translate(180, 100)">
            {["S", "A", "B", "T"].map((node, i) => (
              <g key={node} transform={`translate(${i * 120}, 0)`}>
                <circle r={22} fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth={2} />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight="bold" fill="#f4f4f5">
                  {node}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 17. UNION-FIND (DISJOINT SET UNION - DSU)
// ============================================================================

export function UnionFindSimulation() {
  const frames = useMemo(() => {
    return [
      {
        parent: [0, 1, 2, 3, 4],
        action: "Initial State",
        note: "Initialize DSU: Each of the 5 elements is its own parent (5 singleton sets).",
      },
      {
        parent: [0, 0, 2, 3, 4],
        action: "union(0, 1)",
        note: "union(0, 1): Set parent[1] = 0. Elements 0 and 1 are now connected.",
      },
      {
        parent: [0, 0, 2, 2, 4],
        action: "union(2, 3)",
        note: "union(2, 3): Set parent[3] = 2. Elements 2 and 3 are now connected.",
      },
      {
        parent: [0, 0, 0, 2, 4],
        action: "union(1, 3) with Path Compression",
        note: "union(1, 3): Find root of 1 (0) and root of 3 (2). Merge sets: parent[2] = 0. All in {0, 1, 2, 3}!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Union-Find (Disjoint Set Union)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Near O(1) amortized Find and Union operations using path compression and union by rank.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="uf" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="25" textAnchor="middle" fill={COLOR_CYAN} fontSize={13} fontWeight="bold">
            Operation: {f.action}
          </text>

          <g transform="translate(130, 60)">
            <text x="-40" y="26" fill="#a1a1aa" fontSize={11} fontWeight="bold">
              Parent:
            </text>
            {f.parent.map((p, i) => (
              <g key={i} transform={`translate(${i * 90}, 0)`}>
                <rect width={70} height={44} rx={8} fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth={1.5} />
                <text x={35} y={28} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#f4f4f5">
                  {p}
                </text>
                <text x={35} y={65} textAnchor="middle" fontSize={11} fill="#71717a">
                  Node {i}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}
