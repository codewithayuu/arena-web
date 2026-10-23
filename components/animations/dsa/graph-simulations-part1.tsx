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
// 1. GRAPH BREADTH-FIRST SEARCH (BFS)
// ============================================================================

interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  u: number;
  v: number;
  w?: number;
}

export function GraphBfsSimulation() {
  const nodes: GraphNode[] = [
    { id: 0, label: "0", x: 180, y: 80 },
    { id: 1, label: "1", x: 360, y: 60 },
    { id: 2, label: "2", x: 220, y: 200 },
    { id: 3, label: "3", x: 480, y: 130 },
    { id: 4, label: "4", x: 380, y: 230 },
    { id: 5, label: "5", x: 560, y: 220 },
  ];

  const edges: GraphEdge[] = [
    { u: 0, v: 1 },
    { u: 0, v: 2 },
    { u: 1, v: 3 },
    { u: 1, v: 4 },
    { u: 2, v: 4 },
    { u: 3, v: 5 },
    { u: 4, v: 5 },
  ];

  const frames = useMemo(() => {
    return [
      {
        activeNode: 0,
        queue: [0],
        visited: [0],
        note: "Start BFS at source node 0. Enqueue 0 and mark visited.",
      },
      {
        activeNode: 0,
        queue: [1, 2],
        visited: [0, 1, 2],
        note: "Dequeue 0. Visit unvisited neighbors 1 and 2, enqueue both.",
      },
      {
        activeNode: 1,
        queue: [2, 3, 4],
        visited: [0, 1, 2, 3, 4],
        note: "Dequeue 1. Visit unvisited neighbors 3 and 4, enqueue both.",
      },
      {
        activeNode: 2,
        queue: [3, 4],
        visited: [0, 1, 2, 3, 4],
        note: "Dequeue 2. Neighbor 4 is already visited. No new nodes added.",
      },
      {
        activeNode: 3,
        queue: [4, 5],
        visited: [0, 1, 2, 3, 4, 5],
        note: "Dequeue 3. Visit neighbor 5, enqueue 5.",
      },
      {
        activeNode: 4,
        queue: [5],
        visited: [0, 1, 2, 3, 4, 5],
        note: "Dequeue 4. All neighbors already visited.",
      },
      {
        activeNode: 5,
        queue: [],
        visited: [0, 1, 2, 3, 4, 5],
        note: "Dequeue 5. Queue is now empty. BFS traversal complete!",
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
          <h3 className="text-sm font-medium text-foreground">Graph Breadth-First Search (BFS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Explores graph level-by-level using a FIFO queue. Finds shortest path in unweighted graphs.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bfs" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {/* Edges */}
          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.u)!;
            const v = nodes.find((n) => n.id === e.v)!;
            const isTraversed = f.visited.includes(e.u) && f.visited.includes(e.v);
            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isTraversed ? "rgba(0,208,132,0.6)" : "rgba(161,161,170,0.3)"}
                strokeWidth={isTraversed ? 2.5 : 1.5}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const isActive = f.activeNode === n.id;
            const isVisited = f.visited.includes(n.id);
            let fill = "#000000";
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textColor = "#FFFFFF";

            if (isActive) {
              fill = COLOR_YELLOW; // Solid Butter Yellow
              stroke = COLOR_YELLOW;
              textColor = "#09090b";
            } else if (isVisited) {
              fill = COLOR_GREEN; // Solid Mint Green
              stroke = COLOR_GREEN;
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
                  {n.label}
                </text>
              </g>
            );
          })}

          {/* Queue display */}
          <g transform="translate(140, 270)">
            <text x="-40" y="18" fontSize={12} fill="#a1a1aa" fontWeight={800}>
              Queue:
            </text>
            {f.queue.map((val, idx) => (
              <g key={idx} transform={`translate(${idx * 46}, 0)`}>
                <rect width={36} height={26} rx={6} fill={COLOR_CYAN} stroke={COLOR_CYAN} strokeWidth="1" />
                <text x={18} y={17} textAnchor="middle" fontSize={12} fill="#09090b" fontWeight={800}>
                  {val}
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
// 2. GRAPH DEPTH-FIRST SEARCH (DFS)
// ============================================================================

export function GraphDfsSimulation() {
  const nodes: GraphNode[] = [
    { id: 0, label: "0", x: 180, y: 80 },
    { id: 1, label: "1", x: 360, y: 60 },
    { id: 2, label: "2", x: 220, y: 200 },
    { id: 3, label: "3", x: 480, y: 130 },
    { id: 4, label: "4", x: 380, y: 230 },
    { id: 5, label: "5", x: 560, y: 220 },
  ];

  const edges: GraphEdge[] = [
    { u: 0, v: 1 },
    { u: 0, v: 2 },
    { u: 1, v: 3 },
    { u: 1, v: 4 },
    { u: 2, v: 4 },
    { u: 3, v: 5 },
    { u: 4, v: 5 },
  ];

  const frames = useMemo(() => {
    return [
      {
        activeNode: 0,
        stack: [0],
        visited: [0],
        note: "Start DFS at node 0. Push 0 to call stack.",
      },
      {
        activeNode: 1,
        stack: [0, 1],
        visited: [0, 1],
        note: "Traverse deep: Visit neighbor 1. Push 1.",
      },
      {
        activeNode: 3,
        stack: [0, 1, 3],
        visited: [0, 1, 3],
        note: "Traverse deep: Visit neighbor 3. Push 3.",
      },
      {
        activeNode: 5,
        stack: [0, 1, 3, 5],
        visited: [0, 1, 3, 5],
        note: "Visit neighbor 5. Push 5. Node 5 has no unvisited neighbors.",
      },
      {
        activeNode: 3,
        stack: [0, 1, 3],
        visited: [0, 1, 3, 5],
        note: "Backtrack from 5 to 3. Pop 5.",
      },
      {
        activeNode: 1,
        stack: [0, 1],
        visited: [0, 1, 3, 5],
        note: "Backtrack to 1. Neighbor 4 is unvisited!",
      },
      {
        activeNode: 4,
        stack: [0, 1, 4],
        visited: [0, 1, 3, 5, 4],
        note: "Visit neighbor 4. Push 4.",
      },
      {
        activeNode: 2,
        stack: [0, 1, 4, 2],
        visited: [0, 1, 3, 5, 4, 2],
        note: "Visit neighbor 2. All nodes now reached. DFS complete!",
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
          <h3 className="text-sm font-medium text-foreground">Graph Depth-First Search (DFS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dives deep along each branch using recursion / LIFO stack, backtracking upon reaching dead ends.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="dfs" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.u)!;
            const v = nodes.find((n) => n.id === e.v)!;
            const isTraversed = f.visited.includes(e.u) && f.visited.includes(e.v);
            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke={isTraversed ? "rgba(0,208,132,0.6)" : "rgba(161,161,170,0.3)"}
                strokeWidth={isTraversed ? 2.5 : 1.5}
              />
            );
          })}

          {nodes.map((n) => {
            const isActive = f.activeNode === n.id;
            const isVisited = f.visited.includes(n.id);
            let fill = "#000000";
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textColor = "#FFFFFF";

            if (isActive) {
              fill = COLOR_YELLOW; // Solid Butter Yellow
              stroke = COLOR_YELLOW;
              textColor = "#09090b";
            } else if (isVisited) {
              fill = COLOR_GREEN; // Solid Mint Green
              stroke = COLOR_GREEN;
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
                  {n.label}
                </text>
              </g>
            );
          })}

          <g transform="translate(140, 270)">
            <text x="-40" y="18" fontSize={12} fill="#a1a1aa" fontWeight={800}>
              Stack:
            </text>
            {f.stack.map((val, idx) => (
              <g key={idx} transform={`translate(${idx * 46}, 0)`}>
                <rect width={36} height={26} rx={6} fill={COLOR_PURPLE} stroke={COLOR_PURPLE} strokeWidth="1" />
                <text x={18} y={17} textAnchor="middle" fontSize={12} fill="#09090b" fontWeight={800}>
                  {val}
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
// 3. DIJKSTRA'S ALGORITHM
// ============================================================================

export function DijkstraSimulation() {
  const nodes: GraphNode[] = [
    { id: 0, label: "A", x: 140, y: 130 },
    { id: 1, label: "B", x: 280, y: 60 },
    { id: 2, label: "C", x: 280, y: 200 },
    { id: 3, label: "D", x: 440, y: 60 },
    { id: 4, label: "E", x: 440, y: 200 },
    { id: 5, label: "F", x: 580, y: 130 },
  ];

  const edges: GraphEdge[] = [
    { u: 0, v: 1, w: 4 },
    { u: 0, v: 2, w: 2 },
    { u: 1, v: 2, w: 1 },
    { u: 1, v: 3, w: 5 },
    { u: 2, v: 4, w: 8 },
    { u: 2, v: 3, w: 8 },
    { u: 3, v: 5, w: 6 },
    { u: 4, v: 5, w: 3 },
    { u: 3, v: 4, w: 2 },
  ];

  const frames = useMemo(() => {
    return [
      {
        activeNode: 0,
        dist: [0, Infinity, Infinity, Infinity, Infinity, Infinity],
        relaxedEdge: undefined,
        note: "Initialize dist: dist[A]=0, all other nodes = ∞. Push A to priority queue.",
      },
      {
        activeNode: 0,
        dist: [0, 4, 2, Infinity, Infinity, Infinity],
        relaxedEdge: { u: 0, v: 2 },
        note: "Extract A. Relax neighbors: dist[B]=4, dist[C]=2.",
      },
      {
        activeNode: 2,
        dist: [0, 3, 2, 10, 10, Infinity],
        relaxedEdge: { u: 2, v: 1 },
        note: "Extract min unvisited C (dist=2). Relax B: 2+1=3 < 4 (Updated!). Relax D=10, E=10.",
      },
      {
        activeNode: 1,
        dist: [0, 3, 2, 8, 10, Infinity],
        relaxedEdge: { u: 1, v: 3 },
        note: "Extract B (dist=3). Relax D: 3+5=8 < 10 (Updated!).",
      },
      {
        activeNode: 3,
        dist: [0, 3, 2, 8, 10, 14],
        relaxedEdge: { u: 3, v: 5 },
        note: "Extract D (dist=8). Relax E: 8+2=10. Relax F: 8+6=14.",
      },
      {
        activeNode: 4,
        dist: [0, 3, 2, 8, 10, 13],
        relaxedEdge: { u: 4, v: 5 },
        note: "Extract E (dist=10). Relax F: 10+3=13 < 14 (Updated!).",
      },
      {
        activeNode: 5,
        dist: [0, 3, 2, 8, 10, 13],
        relaxedEdge: undefined,
        note: "Extract destination F (dist=13). Shortest path A -> C -> B -> D -> E -> F is 13!",
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
          <h3 className="text-sm font-medium text-foreground">Dijkstra&apos;s Shortest Path</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Greedy single-source shortest path for non-negative weights using priority queue edge relaxation.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="dijk" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.u)!;
            const v = nodes.find((n) => n.id === e.v)!;
            const isRelaxed = f.relaxedEdge && f.relaxedEdge.u === e.u && f.relaxedEdge.v === e.v;

            return (
              <g key={idx}>
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={isRelaxed ? COLOR_CYAN : "rgba(161,161,170,0.3)"}
                  strokeWidth={isRelaxed ? 2.5 : 1.5}
                />
                <rect
                  x={(u.x + v.x) / 2 - 10}
                  y={(u.y + v.y) / 2 - 9}
                  width={20}
                  height={18}
                  rx={4}
                  fill="#1f1f23"
                />
                <text
                  x={(u.x + v.x) / 2}
                  y={(u.y + v.y) / 2 + 4}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#a1a1aa"
                  fontWeight="bold"
                >
                  {e.w}
                </text>
              </g>
            );
          })}

          {nodes.map((n) => {
            const isActive = f.activeNode === n.id;
            const dist = f.dist[n.id];
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={20}
                  fill={isActive ? COLOR_YELLOW : "#000000"}
                  stroke={isActive ? COLOR_YELLOW : "rgba(255, 255, 255, 0.2)"}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={800} fill={isActive ? "#09090b" : "#FFFFFF"}>
                  {n.label}
                </text>
                <text x="0" y="32" textAnchor="middle" fontSize={11} fill={COLOR_GREEN} fontWeight={800}>
                  {dist === Infinity ? "∞" : dist}
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
// 4. BELLMAN-FORD ALGORITHM
// ============================================================================

export function BellmanFordSimulation() {
  const frames = useMemo(() => {
    return [
      {
        pass: 0,
        dist: [0, Infinity, Infinity, Infinity],
        note: "Initialization: dist[0] = 0, all others = ∞. Will perform V-1 = 3 relaxation passes.",
      },
      {
        pass: 1,
        dist: [0, 4, 3, Infinity],
        note: "Pass 1: Relax edges from 0. dist[1]=4, dist[2]=3.",
      },
      {
        pass: 2,
        dist: [0, 4, 3, 1],
        note: "Pass 2: Edge (2 -> 3, w=-2) relaxes dist[3] = 3 + (-2) = 1 (Negative edge handled!).",
      },
      {
        pass: 3,
        dist: [0, 4, 3, 1],
        note: "Pass 3: No distances changed. Graph has no negative weight cycles! Bellman-Ford terminates.",
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
          <h3 className="text-sm font-medium text-foreground">Bellman-Ford Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Single-source shortest path supporting negative edge weights and detecting negative cycles in O(V · E).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bf" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(140, 50)">
            <text x="0" y="20" fill="#a1a1aa" fontSize={12} fontWeight="bold">
              Relaxation Pass: {f.pass} / 3
            </text>

            <g transform="translate(0, 50)">
              {f.dist.map((d, i) => (
                <g key={i} transform={`translate(${i * 110}, 0)`}>
                  <rect width={90} height={46} rx={8} fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth={1.5} />
                  <text x={45} y={28} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#f4f4f5">
                    {d === Infinity ? "∞" : d}
                  </text>
                  <text x={45} y={65} textAnchor="middle" fontSize={11} fill="#a1a1aa">
                    Node {i}
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
// 5. FLOYD-WARSHALL ALGORITHM
// ============================================================================

export function FloydWarshallSimulation() {
  const frames = useMemo(() => {
    return [
      {
        k: -1,
        matrix: [
          [0, 3, Infinity, 7],
          [8, 0, 2, Infinity],
          [5, Infinity, 0, 1],
          [2, Infinity, Infinity, 0],
        ],
        note: "Initial Adjacency Matrix D: D[i][j] stores direct edge weights (∞ if no direct edge).",
      },
      {
        k: 0,
        matrix: [
          [0, 3, Infinity, 7],
          [8, 0, 2, 15],
          [5, 8, 0, 1],
          [2, 5, Infinity, 0],
        ],
        note: "Pivot k = 0 (Allow paths through Node 0): D[1][3] = min(∞, 8+7) = 15.",
      },
      {
        k: 1,
        matrix: [
          [0, 3, 5, 7],
          [8, 0, 2, 15],
          [5, 8, 0, 1],
          [2, 5, 7, 0],
        ],
        note: "Pivot k = 1: D[0][2] = min(∞, 3+2) = 5.",
      },
      {
        k: 2,
        matrix: [
          [0, 3, 5, 6],
          [7, 0, 2, 3],
          [5, 8, 0, 1],
          [2, 5, 7, 0],
        ],
        note: "Pivot k = 2: D[0][3] = min(7, 5+1) = 6. D[1][3] = min(15, 2+1) = 3.",
      },
      {
        k: 3,
        matrix: [
          [0, 3, 5, 6],
          [5, 0, 2, 3],
          [3, 6, 0, 1],
          [2, 5, 7, 0],
        ],
        note: "Pivot k = 3: All-pairs shortest path matrix fully computed in O(V³)!",
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
          <h3 className="text-sm font-medium text-foreground">Floyd-Warshall All-Pairs Shortest Path</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dynamic Programming over intermediate pivots k: D[i][j] = min(D[i][j], D[i][k] + D[k][j]).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="fw" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="24" textAnchor="middle" fill={COLOR_AMBER} fontSize={12} fontWeight="bold">
            {f.k >= 0 ? `Intermediate Pivot Node: k = ${f.k}` : "Initial Distance Matrix"}
          </text>

          <g transform="translate(200, 50)">
            {f.matrix.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 44})`}>
                <text x="-30" y="26" fontSize={12} fill="#a1a1aa" fontWeight="bold">
                  {i}
                </text>
                {row.map((val, j) => {
                  const isPivot = f.k === i || f.k === j;
                  return (
                    <g key={j} transform={`translate(${j * 80}, 0)`}>
                      <rect
                        width={65}
                        height={36}
                        rx={6}
                        fill="#1f1f23"
                        stroke={isPivot ? COLOR_CYAN : "rgba(161,161,170,0.3)"}
                        strokeWidth={isPivot ? 2 : 1}
                      />
                      <text x={32} y={23} textAnchor="middle" fontSize={13} fontWeight="bold" fill={isPivot ? COLOR_CYAN : "#f4f4f5"}>
                        {val === Infinity ? "∞" : val}
                      </text>
                    </g>
                  );
                })}
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
// 6. A* SEARCH ALGORITHM
// ============================================================================

export function AStarSimulation() {
  const frames = useMemo(() => {
    return [
      {
        active: "S",
        fCost: "f = 0 + 6 = 6",
        note: "Start at S (0,0). Target is G (3,3). Initial f(S) = g(S) + h(S) = 0 + 6 = 6.",
      },
      {
        active: "A",
        fCost: "f = 2 + 4 = 6",
        note: "Explore neighbor A: g=2, h=4 => f=6 (Tied lowest f-score in open set).",
      },
      {
        active: "C",
        fCost: "f = 4 + 2 = 6",
        note: "Explore neighbor C: g=4, h=2 => f=6. Directed heuristic drives search straight towards Goal G.",
      },
      {
        active: "G",
        fCost: "f = 6 + 0 = 6",
        note: "Target G reached! A* explored optimal path without scanning irrelevant nodes.",
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
          <h3 className="text-sm font-medium text-foreground">A* Search Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Heuristic search minimizing f(n) = g(n) + h(n), where g is path cost and h is estimated distance to goal.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="astar" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="30" textAnchor="middle" fill={COLOR_CYAN} fontSize={13} fontWeight="bold">
            Current Node: {f.active} ({f.fCost})
          </text>

          <g transform="translate(180, 80)">
            {["S", "A", "C", "G"].map((node, i) => {
              const isActive = f.active === node;
              return (
                <React.Fragment key={node}>
                  {i > 0 && (
                    <line
                      x1={(i - 1) * 110 + 40}
                      y1={25}
                      x2={i * 110}
                      y2={25}
                      stroke={COLOR_GREEN}
                      strokeWidth={2}
                    />
                  )}
                  <g transform={`translate(${i * 110}, 0)`}>
                    <circle
                      cx={20}
                      cy={25}
                      r={20}
                      fill="#1f1f23"
                      stroke={isActive ? COLOR_CYAN : COLOR_GREEN}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      filter={isActive ? "url(#astar-glow-cyan)" : undefined}
                    />
                    <text x={20} y={30} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#f4f4f5">
                      {node}
                    </text>
                  </g>
                </React.Fragment>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 7. TOPOLOGICAL SORT (KAHN'S ALGORITHM)
// ============================================================================

export function TopologicalSortSimulation() {
  const frames = useMemo(() => {
    return [
      {
        inDegrees: [0, 1, 1, 2, 1],
        queue: [0],
        sorted: [],
        note: "Kahn's Algorithm: Compute in-degrees. Node 0 has in-degree 0 => Add 0 to Queue.",
      },
      {
        inDegrees: [0, 0, 0, 2, 1],
        queue: [1, 2],
        sorted: [0],
        note: "Pop 0. Append 0 to sorted output. Decrement neighbors 1 and 2 => Both now have in-degree 0!",
      },
      {
        inDegrees: [0, 0, 0, 1, 1],
        queue: [2],
        sorted: [0, 1],
        note: "Pop 1. Append 1 to sorted. Decrement neighbor 3 (in-degree becomes 1).",
      },
      {
        inDegrees: [0, 0, 0, 0, 1],
        queue: [3],
        sorted: [0, 1, 2],
        note: "Pop 2. Decrement neighbor 3 => in-degree becomes 0! Push 3 to queue.",
      },
      {
        inDegrees: [0, 0, 0, 0, 0],
        queue: [4],
        sorted: [0, 1, 2, 3],
        note: "Pop 3. Decrement neighbor 4 => in-degree becomes 0. Push 4.",
      },
      {
        inDegrees: [0, 0, 0, 0, 0],
        queue: [],
        sorted: [0, 1, 2, 3, 4],
        note: "Pop 4. Queue empty! Topological order: [0, 1, 2, 3, 4].",
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
          <h3 className="text-sm font-medium text-foreground">Topological Sort (Kahn&apos;s BFS Algorithm)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Linear ordering of DAG vertices such that for every directed edge u &rarr; v, u appears before v.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="topo" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {/* In-degree array */}
          <g transform="translate(140, 40)">
            <text x="-40" y="25" fill="#a1a1aa" fontSize={11} fontWeight="bold">
              In-Degree:
            </text>
            {f.inDegrees.map((deg, idx) => (
              <g key={idx} transform={`translate(${idx * 75}, 0)`}>
                <rect width={55} height={40} rx={6} fill="#1f1f23" stroke="rgba(161,161,170,0.3)" strokeWidth={1} />
                <text x={27} y={25} textAnchor="middle" fontSize={13} fill="#f4f4f5" fontWeight="bold">
                  {deg}
                </text>
                <text x={27} y={55} textAnchor="middle" fontSize={10} fill="#71717a">
                  Node {idx}
                </text>
              </g>
            ))}
          </g>

          {/* Sorted Output list */}
          <g transform="translate(140, 160)">
            <text x="-40" y="22" fill="#a1a1aa" fontSize={11} fontWeight="bold">
              Sorted:
            </text>
            {f.sorted.map((val, idx) => (
              <g key={idx} transform={`translate(${idx * 60}, 0)`}>
                <rect width={45} height={32} rx={6} fill="rgba(0,208,132,0.15)" stroke={COLOR_GREEN} strokeWidth={1.5} />
                <text x={22} y={21} textAnchor="middle" fontSize={13} fill={COLOR_GREEN} fontWeight="bold">
                  {val}
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
// 8. KRUSKAL'S ALGORITHM
// ============================================================================

export function KruskalSimulation() {
  const frames = useMemo(() => {
    return [
      {
        edgeIdx: 0,
        accepted: true,
        edgeDesc: "(0 - 1, w = 1)",
        note: "Inspect edge (0-1, w=1). Components {0} and {1} are disjoint => Accept edge into MST!",
      },
      {
        edgeIdx: 1,
        accepted: true,
        edgeDesc: "(2 - 3, w = 2)",
        note: "Inspect edge (2-3, w=2). Components {2} and {3} disjoint => Accept edge into MST!",
      },
      {
        edgeIdx: 2,
        accepted: true,
        edgeDesc: "(1 - 2, w = 3)",
        note: "Inspect edge (1-2, w=3). Merges component {0,1} and {2,3} => Accept edge!",
      },
      {
        edgeIdx: 3,
        accepted: false,
        edgeDesc: "(0 - 2, w = 4)",
        note: "Inspect edge (0-2, w=4). 0 and 2 already in same component {0,1,2,3} => Cycle detected! Discard.",
      },
      {
        edgeIdx: 4,
        accepted: true,
        edgeDesc: "(3 - 4, w = 5)",
        note: "Inspect edge (3-4, w=5). Disjoint set merge => Accept edge. MST spanning all 5 vertices complete!",
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
          <h3 className="text-sm font-medium text-foreground">Kruskal&apos;s Minimum Spanning Tree</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sorts edges by weight, adding to MST if endpoints are in different components (via Union-Find).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="krus" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["red", COLOR_RED]]} />

          <text x="360" y="30" textAnchor="middle" fill={f.accepted ? COLOR_GREEN : COLOR_RED} fontSize={13} fontWeight="bold">
            {f.edgeDesc} &mdash; {f.accepted ? "Accepted (No Cycle)" : "Rejected (Creates Cycle)"}
          </text>

          <g transform="translate(100, 80)">
            {["(0-1: 1)", "(2-3: 2)", "(1-2: 3)", "(0-2: 4)", "(3-4: 5)"].map((ed, idx) => {
              const isCurrent = f.edgeIdx === idx;
              const isDone = idx <= f.edgeIdx;

              return (
                <g key={idx} transform={`translate(${idx * 105}, 0)`}>
                  <rect
                    width={95}
                    height={40}
                    rx={6}
                    fill="#1f1f23"
                    stroke={isCurrent ? COLOR_CYAN : isDone ? "rgba(161,161,170,0.5)" : "rgba(161,161,170,0.2)"}
                    strokeWidth={isCurrent ? 2 : 1}
                  />
                  <text x={47} y={25} textAnchor="middle" fontSize={11} fill="#f4f4f5" fontWeight="bold">
                    {ed}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 9. PRIM'S ALGORITHM
// ============================================================================

export function PrimSimulation() {
  const frames = useMemo(() => {
    return [
      {
        visited: [0],
        addedEdge: undefined,
        note: "Start Prim's algorithm at root node 0. Add cut edges (0-1: 2), (0-2: 4) to priority queue.",
      },
      {
        visited: [0, 1],
        addedEdge: "(0 - 1, w = 2)",
        note: "Pick cheapest crossing edge (0-1, w=2). Add node 1 to MST. Add cut edge (1-2: 1).",
      },
      {
        visited: [0, 1, 2],
        addedEdge: "(1 - 2, w = 1)",
        note: "Pick cheapest edge (1-2, w=1). Add node 2 to MST. Add cut edge (2-3: 3).",
      },
      {
        visited: [0, 1, 2, 3],
        addedEdge: "(2 - 3, w = 3)",
        note: "Pick cheapest edge (2-3, w=3). All nodes connected! Total MST weight = 2 + 1 + 3 = 6.",
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
          <h3 className="text-sm font-medium text-foreground">Prim&apos;s Minimum Spanning Tree</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Greedy MST growth: expands a connected component by repeatedly adding the minimum-weight crossing cut edge.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="prim" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {f.addedEdge && (
            <text x="360" y="30" textAnchor="middle" fill={COLOR_GREEN} fontSize={13} fontWeight="bold">
              Added to MST: {f.addedEdge}
            </text>
          )}

          <g transform="translate(180, 70)">
            {[0, 1, 2, 3].map((nodeId, idx) => {
              const inMst = f.visited.includes(nodeId);
              return (
                <g key={nodeId} transform={`translate(${idx * 90}, 0)`}>
                  <circle
                    cx={25}
                    cy={25}
                    r={22}
                    fill="#1f1f23"
                    stroke={inMst ? COLOR_GREEN : "rgba(161,161,170,0.3)"}
                    strokeWidth={inMst ? 2.5 : 1.5}
                    filter={inMst ? "url(#prim-glow-green)" : undefined}
                  />
                  <text x={25} y={30} textAnchor="middle" fontSize={13} fontWeight="bold" fill={inMst ? COLOR_GREEN : "#71717a"}>
                    {nodeId}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}
