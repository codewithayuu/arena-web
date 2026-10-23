"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle, RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_PURPLE = "#DDD6FE"; // Solid Pastel Lavender
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

// ============================================================================
// 1. BINARY SEARCH TREE (BST)
// ============================================================================

interface BSTNode {
  id: number;
  val: number;
  x: number;
  y: number;
}

interface BSTFrame {
  nodes: BSTNode[];
  edges: { from: number; to: number }[];
  activeNodeId?: number;
  targetVal?: number;
  visitedIds: number[];
  foundId?: number;
  note: string;
  comparison?: string;
}

const BST_BASE_NODES: BSTNode[] = [
  { id: 50, val: 50, x: 360, y: 50 },
  { id: 30, val: 30, x: 200, y: 120 },
  { id: 70, val: 70, x: 520, y: 120 },
  { id: 20, val: 20, x: 120, y: 190 },
  { id: 35, val: 35, x: 280, y: 190 },
  { id: 60, val: 60, x: 440, y: 190 },
  { id: 85, val: 85, x: 600, y: 190 },
];

const BST_BASE_EDGES = [
  { from: 50, to: 30 },
  { from: 50, to: 70 },
  { from: 30, to: 20 },
  { from: 30, to: 35 },
  { from: 70, to: 60 },
  { from: 70, to: 85 },
];

export function BinarySearchTreeSimulation() {
  const [scenario, setScenario] = useState<"search" | "insert">("search");

  const frames = useMemo<BSTFrame[]>(() => {
    const list: BSTFrame[] = [];

    if (scenario === "search") {
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        visitedIds: [],
        note: "Searching for target 35 starting at root (50).",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 50,
        visitedIds: [50],
        targetVal: 35,
        comparison: "35 < 50 => traverse Left to node 30",
        note: "Comparing target 35 with root 50. Since 35 < 50, branch Left.",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 30,
        visitedIds: [50, 30],
        targetVal: 35,
        comparison: "35 > 30 => traverse Right to node 35",
        note: "Comparing target 35 with 30. Since 35 > 30, branch Right.",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 35,
        visitedIds: [50, 30, 35],
        foundId: 35,
        targetVal: 35,
        comparison: "35 == 35 => Match found!",
        note: "Target 35 matches node 35! Search terminates in O(log n) steps.",
      });
    } else {
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        visitedIds: [],
        note: "Starting insertion of value 40 into BST.",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 50,
        visitedIds: [50],
        comparison: "40 < 50 => Branch Left",
        note: "40 < 50: go to left subtree.",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 30,
        visitedIds: [50, 30],
        comparison: "40 > 30 => Branch Right",
        note: "40 > 30: go to right subtree.",
      });
      list.push({
        nodes: BST_BASE_NODES,
        edges: BST_BASE_EDGES,
        activeNodeId: 35,
        visitedIds: [50, 30, 35],
        comparison: "40 > 35 and 35.right is null => Insert here",
        note: "40 > 35 and node 35 has no right child: insert 40 as right child of 35.",
      });

      const newNodes = [...BST_BASE_NODES, { id: 40, val: 40, x: 340, y: 260 }];
      const newEdges = [...BST_BASE_EDGES, { from: 35, to: 40 }];

      list.push({
        nodes: newNodes,
        edges: newEdges,
        activeNodeId: 40,
        foundId: 40,
        visitedIds: [50, 30, 35, 40],
        comparison: "Node 40 inserted successfully",
        note: "Inserted 40 as leaf node. Binary Search Tree invariant preserved.",
      });
    }

    return list;
  }, [scenario]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Binary Search Tree (BST)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Left subtree values &lt; node &lt; right subtree values. Search and insert operate in O(h) time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setScenario("search"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${scenario === "search" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Search (35)
          </button>
          <button
            onClick={() => { setScenario("insert"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${scenario === "insert" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Insert (40)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bst" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["red", COLOR_RED]]} />

          {f.edges.map((e, idx) => {
            const fromNode = f.nodes.find((n) => n.id === e.from);
            const toNode = f.nodes.find((n) => n.id === e.to);
            if (!fromNode || !toNode) return null;
            const isTraversed = f.visitedIds.includes(e.from) && f.visitedIds.includes(e.to);
            return (
              <line
                key={idx}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isTraversed ? COLOR_CYAN : "rgba(161,161,170,0.3)"}
                strokeWidth={isTraversed ? 2.5 : 1.5}
                strokeDasharray={isTraversed ? undefined : "3 3"}
              />
            );
          })}

          {f.nodes.map((node) => {
            const isActive = f.activeNodeId === node.id;
            const isFound = f.foundId === node.id;
            const isVisited = f.visitedIds.includes(node.id);

            let stroke = "rgba(255, 255, 255, 0.2)";
            let fill = "#000000";
            let textColor = "#FFFFFF";

            if (isFound) {
              stroke = COLOR_GREEN;
              fill = COLOR_GREEN; // Solid Mint Green
              textColor = "#09090b"; // High contrast Jet Black
            } else if (isActive) {
              stroke = COLOR_YELLOW;
              fill = COLOR_YELLOW; // Solid Butter Yellow
              textColor = "#09090b";
            } else if (isVisited) {
              stroke = COLOR_CYAN;
              fill = COLOR_CYAN; // Solid Pastel Sky Blue
              textColor = "#09090b";
            }

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <circle
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize={13}
                  fontWeight={800}
                  fill={textColor}
                >
                  {node.val}
                </text>
              </g>
            );
          })}

          {f.comparison && (
            <g transform="translate(360, 300)">
              <rect x="-180" y="-14" width="360" height="28" rx="6" fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth="1" />
              <text textAnchor="middle" dy="0.35em" fontSize={11} fill={COLOR_CYAN} fontWeight="600">
                {f.comparison}
              </text>
            </g>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 2. AVL TREES
// ============================================================================

interface AVLNode {
  id: number;
  val: number;
  x: number;
  y: number;
  bf: number;
}

interface AVLFrame {
  nodes: AVLNode[];
  edges: { from: number; to: number }[];
  highlightNodeId?: number;
  rotationLabel?: string;
  note: string;
}

export function AvlTreesSimulation() {
  const [rotationType, setRotationType] = useState<"LL" | "LR">("LL");

  const frames = useMemo<AVLFrame[]>(() => {
    const list: AVLFrame[] = [];

    if (rotationType === "LL") {
      list.push({
        rotationLabel: "Unbalanced State (BF = +2)",
        nodes: [
          { id: 30, val: 30, x: 440, y: 70, bf: 2 },
          { id: 20, val: 20, x: 340, y: 150, bf: 1 },
          { id: 10, val: 10, x: 250, y: 230, bf: 0 },
        ],
        edges: [
          { from: 30, to: 20 },
          { from: 20, to: 10 },
        ],
        highlightNodeId: 30,
        note: "Node 30 has Balance Factor BF = height(L) - height(R) = +2. Heavy on Left-Left (LL).",
      });

      list.push({
        rotationLabel: "Performing Right Rotation on Node 30",
        nodes: [
          { id: 30, val: 30, x: 430, y: 110, bf: 2 },
          { id: 20, val: 20, x: 360, y: 90, bf: 1 },
          { id: 10, val: 10, x: 270, y: 190, bf: 0 },
        ],
        edges: [
          { from: 20, to: 30 },
          { from: 20, to: 10 },
        ],
        highlightNodeId: 20,
        note: "Node 20 becomes the new local root. Node 30 becomes right child of 20.",
      });

      list.push({
        rotationLabel: "Balanced AVL Tree (All BF in {-1, 0, 1})",
        nodes: [
          { id: 20, val: 20, x: 360, y: 70, bf: 0 },
          { id: 10, val: 10, x: 240, y: 160, bf: 0 },
          { id: 30, val: 30, x: 480, y: 160, bf: 0 },
        ],
        edges: [
          { from: 20, to: 10 },
          { from: 20, to: 30 },
        ],
        highlightNodeId: 20,
        note: "Right Rotation complete! Heights are balanced; BF for every node is now 0.",
      });
    } else {
      list.push({
        rotationLabel: "Left-Right Imbalance (BF = +2, Child BF = -1)",
        nodes: [
          { id: 30, val: 30, x: 440, y: 70, bf: 2 },
          { id: 10, val: 10, x: 280, y: 150, bf: -1 },
          { id: 20, val: 20, x: 360, y: 230, bf: 0 },
        ],
        edges: [
          { from: 30, to: 10 },
          { from: 10, to: 20 },
        ],
        highlightNodeId: 10,
        note: "LR Imbalance: Left child 10 has right child 20. Step 1: Left rotate child 10.",
      });

      list.push({
        rotationLabel: "Step 1: Left Rotate Child (Node 10)",
        nodes: [
          { id: 30, val: 30, x: 440, y: 70, bf: 2 },
          { id: 20, val: 20, x: 320, y: 150, bf: 1 },
          { id: 10, val: 10, x: 240, y: 230, bf: 0 },
        ],
        edges: [
          { from: 30, to: 20 },
          { from: 20, to: 10 },
        ],
        highlightNodeId: 20,
        note: "Child rotation transformed LR into LL imbalance. Step 2: Right rotate root 30.",
      });

      list.push({
        rotationLabel: "Step 2: Right Rotate Root (Node 30) -> Balanced",
        nodes: [
          { id: 20, val: 20, x: 360, y: 70, bf: 0 },
          { id: 10, val: 10, x: 240, y: 160, bf: 0 },
          { id: 30, val: 30, x: 480, y: 160, bf: 0 },
        ],
        edges: [
          { from: 20, to: 10 },
          { from: 20, to: 30 },
        ],
        highlightNodeId: 20,
        note: "Double rotation complete! Tree is fully balanced with O(1) rotation overhead.",
      });
    }

    return list;
  }, [rotationType]);

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
          <h3 className="text-sm font-medium text-foreground">AVL Tree Rotations</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintains strict height balance |height(L) - height(R)| &le; 1 using single and double rotations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRotationType("LL"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${rotationType === "LL" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Right Rotation (LL)
          </button>
          <button
            onClick={() => { setRotationType("LR"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${rotationType === "LR" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Left-Right (LR)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 300" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="avl" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["red", COLOR_RED]]} />

          <text x="360" y="30" textAnchor="middle" fill={COLOR_AMBER} fontSize={12} fontWeight="bold">
            {f.rotationLabel}
          </text>

          {f.edges.map((e, idx) => {
            const u = f.nodes.find((n) => n.id === e.from);
            const v = f.nodes.find((n) => n.id === e.to);
            if (!u || !v) return null;
            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={2}
              />
            );
          })}

          {f.nodes.map((n) => {
            const isHeavy = Math.abs(n.bf) > 1;
            const isHighlight = f.highlightNodeId === n.id;
            let fill = "#000000";
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textColor = "#FFFFFF";

            if (isHeavy) {
              fill = COLOR_RED; // Solid Pastel Rose
              stroke = COLOR_RED;
              textColor = "#09090b";
            } else if (isHighlight) {
              fill = COLOR_YELLOW; // Solid Butter Yellow
              stroke = COLOR_YELLOW;
              textColor = "#09090b";
            }

            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={24}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={14} fontWeight={800} fill={textColor}>
                  {n.val}
                </text>
                <rect
                  x="16"
                  y="-24"
                  width="28"
                  height="16"
                  rx="4"
                  fill={isHeavy ? COLOR_RED : COLOR_GREEN}
                  stroke={isHeavy ? COLOR_RED : COLOR_GREEN}
                  strokeWidth="1"
                />
                <text
                  x="30"
                  y="-12"
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={800}
                  fill="#09090b"
                >
                  {n.bf > 0 ? `+${n.bf}` : n.bf}
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
// 3. RED-BLACK TREES
// ============================================================================

interface RBNode {
  id: number;
  val: number;
  color: "red" | "black";
  x: number;
  y: number;
}

interface RBFrame {
  nodes: RBNode[];
  edges: { from: number; to: number }[];
  violation?: string;
  note: string;
}

export function RedBlackTreesSimulation() {
  const [scenario, setScenario] = useState<"recolor" | "rotate">("recolor");

  const frames = useMemo<RBFrame[]>(() => {
    const list: RBFrame[] = [];

    if (scenario === "recolor") {
      list.push({
        violation: "Red-Red Violation: 30 and 20 are both RED",
        nodes: [
          { id: 50, val: 50, color: "black", x: 360, y: 60 },
          { id: 30, val: 30, color: "red", x: 240, y: 150 },
          { id: 70, val: 70, color: "red", x: 480, y: 150 },
          { id: 20, val: 20, color: "red", x: 160, y: 240 },
        ],
        edges: [
          { from: 50, to: 30 },
          { from: 50, to: 70 },
          { from: 30, to: 20 },
        ],
        note: "Inserted node 20 is RED. Parent 30 is RED and Uncle 70 is RED => Case 1: Recolor parent and uncle to BLACK, grandparent to RED.",
      });

      list.push({
        violation: "Recoloring step: Parent & Uncle -> BLACK",
        nodes: [
          { id: 50, val: 50, color: "red", x: 360, y: 60 },
          { id: 30, val: 30, color: "black", x: 240, y: 150 },
          { id: 70, val: 70, color: "black", x: 480, y: 150 },
          { id: 20, val: 20, color: "red", x: 160, y: 240 },
        ],
        edges: [
          { from: 50, to: 30 },
          { from: 50, to: 70 },
          { from: 30, to: 20 },
        ],
        note: "Parent 30 and Uncle 70 become BLACK. Grandparent 50 becomes RED.",
      });

      list.push({
        violation: "Root Property: Root must always be BLACK",
        nodes: [
          { id: 50, val: 50, color: "black", x: 360, y: 60 },
          { id: 30, val: 30, color: "black", x: 240, y: 150 },
          { id: 70, val: 70, color: "black", x: 480, y: 150 },
          { id: 20, val: 20, color: "red", x: 160, y: 240 },
        ],
        edges: [
          { from: 50, to: 30 },
          { from: 50, to: 70 },
          { from: 30, to: 20 },
        ],
        note: "Since 50 is the tree root, its color is restored to BLACK. Black height along all paths is 2.",
      });
    } else {
      list.push({
        violation: "Red-Red Violation with Black Uncle",
        nodes: [
          { id: 50, val: 50, color: "black", x: 420, y: 60 },
          { id: 30, val: 30, color: "red", x: 280, y: 150 },
          { id: 10, val: 10, color: "red", x: 180, y: 240 },
        ],
        edges: [
          { from: 50, to: 30 },
          { from: 30, to: 10 },
        ],
        note: "Node 10 inserted. Parent 30 is RED, Uncle is null (BLACK). Requires Right Rotation and Recoloring.",
      });

      list.push({
        violation: "Right Rotate on 50 and Swap Colors",
        nodes: [
          { id: 30, val: 30, color: "black", x: 360, y: 70 },
          { id: 10, val: 10, color: "red", x: 220, y: 170 },
          { id: 50, val: 50, color: "red", x: 500, y: 170 },
        ],
        edges: [
          { from: 30, to: 10 },
          { from: 30, to: 50 },
        ],
        note: "Right rotation around 50 makes 30 the new root. 30 recolored to BLACK, 50 recolored to RED. Red-Black properties restored!",
      });
    }

    return list;
  }, [scenario]);

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
          <h3 className="text-sm font-medium text-foreground">Red-Black Tree Properties</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Self-balancing BST guaranteeing O(log n) lookups. No two consecutive RED nodes; equal black height.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setScenario("recolor"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${scenario === "recolor" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Case 1: Recoloring
          </button>
          <button
            onClick={() => { setScenario("rotate"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${scenario === "rotate" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Case 2: Rotation
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 300" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="rb" colors={[["red", COLOR_RED], ["cyan", COLOR_CYAN]]} />

          {f.violation && (
            <text x="360" y="25" textAnchor="middle" fill={COLOR_AMBER} fontSize={12} fontWeight="bold">
              {f.violation}
            </text>
          )}

          {f.edges.map((e, idx) => {
            const u = f.nodes.find((n) => n.id === e.from);
            const v = f.nodes.find((n) => n.id === e.to);
            if (!u || !v) return null;
            return (
              <line
                key={idx}
                x1={u.x}
                y1={u.y}
                x2={v.x}
                y2={v.y}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={2}
              />
            );
          })}

          {f.nodes.map((n) => {
            const isRed = n.color === "red";
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={24}
                  fill={isRed ? COLOR_RED : "#000000"}
                  stroke={isRed ? COLOR_RED : "rgba(255,255,255,0.4)"}
                  strokeWidth={2}
                />
                <text
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize={14}
                  fontWeight={800}
                  fill={isRed ? "#09090b" : "#ffffff"}
                >
                  {n.val}
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
// 4. B-TREES (MULTIWAY SEARCH TREE)
// ============================================================================

interface BTreeNode {
  id: string;
  x: number;
  y: number;
  keys: number[];
}

interface BTreeFrame {
  nodes: BTreeNode[];
  note: string;
  splitAction?: string;
}

export function BTreesSimulation() {
  const frames = useMemo<BTreeFrame[]>(() => {
    return [
      {
        nodes: [
          { id: "root", x: 260, y: 70, keys: [20, 50] },
          { id: "c1", x: 100, y: 180, keys: [5, 10] },
          { id: "c2", x: 260, y: 180, keys: [30, 40] },
          { id: "c3", x: 420, y: 180, keys: [60, 70] },
        ],
        note: "Order-3 B-Tree (max 2 keys per node). All leaves are at the exact same depth.",
      },
      {
        nodes: [
          { id: "root", x: 260, y: 70, keys: [20, 50] },
          { id: "c1", x: 100, y: 180, keys: [5, 10] },
          { id: "c2", x: 240, y: 180, keys: [30, 35, 40] },
          { id: "c3", x: 450, y: 180, keys: [60, 70] },
        ],
        splitAction: "Overflow: Node [30, 35, 40] exceeds max keys (2)",
        note: "Inserting key 35 into middle child. Node now contains 3 keys and must split.",
      },
      {
        nodes: [
          { id: "root", x: 220, y: 70, keys: [20, 35, 50] },
          { id: "c1", x: 80, y: 180, keys: [5, 10] },
          { id: "c2a", x: 200, y: 180, keys: [30] },
          { id: "c2b", x: 320, y: 180, keys: [40] },
          { id: "c3", x: 440, y: 180, keys: [60, 70] },
        ],
        splitAction: "Middle key 35 pushed up to parent root",
        note: "Middle key 35 moves up to parent root. Child splits into two nodes: [30] and [40].",
      },
      {
        nodes: [
          { id: "new_root", x: 280, y: 30, keys: [35] },
          { id: "root_left", x: 160, y: 120, keys: [20] },
          { id: "root_right", x: 400, y: 120, keys: [50] },
          { id: "c1", x: 60, y: 220, keys: [5, 10] },
          { id: "c2a", x: 180, y: 220, keys: [30] },
          { id: "c2b", x: 320, y: 220, keys: [40] },
          { id: "c3", x: 460, y: 220, keys: [60, 70] },
        ],
        splitAction: "Root split: Tree height increases by 1",
        note: "Root node split: key 35 forms new root. B-Tree grows uniformly from the top!",
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
          <h3 className="text-sm font-medium text-foreground">B-Tree Multiway Node Splitting</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Self-balancing search tree used in file systems and databases. Nodes store sorted arrays of keys and split upon overflow.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 300" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="btree" colors={[["cyan", COLOR_CYAN], ["amber", COLOR_AMBER]]} />

          {f.splitAction && (
            <text x="360" y="20" textAnchor="middle" fill={COLOR_AMBER} fontSize={12} fontWeight="bold">
              {f.splitAction}
            </text>
          )}

          {f.nodes.map((node) => {
            const keyWidth = 36;
            const nodeWidth = node.keys.length * keyWidth;
            const nodeHeight = 32;
            const isOverflow = node.keys.length > 2;

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                <rect
                  x={0}
                  y={0}
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={6}
                  fill="#1f1f23"
                  stroke={isOverflow ? COLOR_RED : COLOR_CYAN}
                  strokeWidth={isOverflow ? 2 : 1.5}
                />
                {node.keys.map((k, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <line
                        x1={i * keyWidth}
                        y1={0}
                        x2={i * keyWidth}
                        y2={nodeHeight}
                        stroke="rgba(161,161,170,0.3)"
                      />
                    )}
                    <text
                      x={i * keyWidth + keyWidth / 2}
                      y={nodeHeight / 2}
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize={12}
                      fontWeight="bold"
                      fill={isOverflow && i === 1 ? COLOR_AMBER : "#f4f4f5"}
                    >
                      {k}
                    </text>
                  </React.Fragment>
                ))}
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
// 5. BINARY HEAP (MIN-HEAP / MAX-HEAP)
// ============================================================================

interface HeapFrame {
  arr: number[];
  activeIndices: number[];
  swappingIndices?: [number, number];
  note: string;
}

export function BinaryHeapSimulation() {
  const [heapType, setHeapType] = useState<"insert" | "extract">("insert");

  const frames = useMemo<HeapFrame[]>(() => {
    const list: HeapFrame[] = [];

    if (heapType === "insert") {
      list.push({
        arr: [10, 20, 15, 40, 50, 30, 5],
        activeIndices: [6],
        note: "Insert 5 at next available array slot (index 6, right child of index 2).",
      });
      list.push({
        arr: [10, 20, 15, 40, 50, 30, 5],
        activeIndices: [6, 2],
        note: "Compare 5 with parent 15 at index (6-1)/2 = 2. Since 5 < 15, sift up!",
      });
      list.push({
        arr: [10, 20, 5, 40, 50, 30, 15],
        activeIndices: [2],
        swappingIndices: [6, 2],
        note: "Swapped 5 and 15. Now compare 5 with new parent at index (2-1)/2 = 0 (root 10).",
      });
      list.push({
        arr: [10, 20, 5, 40, 50, 30, 15],
        activeIndices: [2, 0],
        note: "Compare 5 with root 10. Since 5 < 10, sift up to root!",
      });
      list.push({
        arr: [5, 20, 10, 40, 50, 30, 15],
        activeIndices: [0],
        swappingIndices: [2, 0],
        note: "Swapped 5 and 10. 5 is now root! Min-heap property satisfied in O(log n) swaps.",
      });
    } else {
      list.push({
        arr: [5, 20, 10, 40, 50, 30, 15],
        activeIndices: [0],
        note: "Extract Min: Root 5 is removed. Replace root with last element (15).",
      });
      list.push({
        arr: [15, 20, 10, 40, 50, 30],
        activeIndices: [0],
        note: "Root is now 15. Must sift down by comparing with smaller child (min(20, 10) = 10 at index 2).",
      });
      list.push({
        arr: [10, 20, 15, 40, 50, 30],
        activeIndices: [2],
        swappingIndices: [0, 2],
        note: "Swapped 15 with smaller child 10. Now compare 15 with its children (only 30 at index 5).",
      });
      list.push({
        arr: [10, 20, 15, 40, 50, 30],
        activeIndices: [2],
        note: "15 <= 30: Min-heap property restored. Extract Min completed in O(log n).",
      });
    }

    return list;
  }, [heapType]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  const treeCoords = [
    { x: 360, y: 40 },
    { x: 220, y: 110 },
    { x: 500, y: 110 },
    { x: 150, y: 180 },
    { x: 290, y: 180 },
    { x: 430, y: 180 },
    { x: 570, y: 180 },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Binary Min-Heap</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete binary tree stored in a compact array. Root is always the minimum element.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setHeapType("insert"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${heapType === "insert" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Insert (Sift Up)
          </button>
          <button
            onClick={() => { setHeapType("extract"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${heapType === "extract" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Extract Min (Sift Down)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 320" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="heap" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["amber", COLOR_AMBER]]} />

          {f.arr.map((_, i) => {
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            const from = treeCoords[i];
            if (!from) return null;

            return (
              <React.Fragment key={i}>
                {left < f.arr.length && treeCoords[left] && (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={treeCoords[left].x}
                    y2={treeCoords[left].y}
                    stroke="rgba(161,161,170,0.3)"
                    strokeWidth={1.5}
                  />
                )}
                {right < f.arr.length && treeCoords[right] && (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={treeCoords[right].x}
                    y2={treeCoords[right].y}
                    stroke="rgba(161,161,170,0.3)"
                    strokeWidth={1.5}
                  />
                )}
              </React.Fragment>
            );
          })}

          {f.arr.map((val, i) => {
            const pt = treeCoords[i];
            if (!pt) return null;
            const isActive = f.activeIndices.includes(i);
            return (
              <g key={i} transform={`translate(${pt.x}, ${pt.y})`}>
                <circle
                  r={18}
                  fill={isActive ? COLOR_YELLOW : "#000000"}
                  stroke={isActive ? COLOR_YELLOW : "rgba(255, 255, 255, 0.2)"}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={12} fontWeight={800} fill={isActive ? "#09090b" : "#FFFFFF"}>
                  {val}
                </text>
              </g>
            );
          })}

          <g transform="translate(140, 250)">
            <text x="-40" y="20" fontSize={11} fill="#a1a1aa" fontWeight={800}>
              Array:
            </text>
            {f.arr.map((val, i) => {
              const isActive = f.activeIndices.includes(i);
              return (
                <g key={i} transform={`translate(${i * 60}, 0)`}>
                  <rect
                    width={50}
                    height={32}
                    rx={6}
                    fill={isActive ? COLOR_YELLOW : "#000000"}
                    stroke={isActive ? COLOR_YELLOW : "rgba(255, 255, 255, 0.2)"}
                    strokeWidth={2}
                  />
                  <text x={25} y={20} textAnchor="middle" fontSize={12} fontWeight={800} fill={isActive ? "#09090b" : "#FFFFFF"}>
                    {val}
                  </text>
                  <text x={25} y={45} textAnchor="middle" fontSize={10} fill="#71717a">
                    [{i}]
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
// 6. FENWICK TREE (BINARY INDEXED TREE)
// ============================================================================

interface FenwickFrame {
  idx: number;
  highlightIndices: number[];
  sumAccumulator?: number;
  operation: "query" | "update";
  note: string;
}

export function FenwickTreeSimulation() {
  const [op, setOp] = useState<"query" | "update">("query");

  const frames = useMemo<FenwickFrame[]>(() => {
    const list: FenwickFrame[] = [];

    if (op === "query") {
      list.push({
        idx: 7,
        highlightIndices: [7],
        sumAccumulator: 12,
        operation: "query",
        note: "Query prefix sum up to index 7: Add BIT[7] = 12. Next: 7 - (7 & -7) = 7 - 1 = 6.",
      });
      list.push({
        idx: 6,
        highlightIndices: [7, 6],
        sumAccumulator: 12 + 15,
        operation: "query",
        note: "At index 6: Add BIT[6] = 15. Next: 6 - (6 & -6) = 6 - 2 = 4.",
      });
      list.push({
        idx: 4,
        highlightIndices: [7, 6, 4],
        sumAccumulator: 12 + 15 + 34,
        operation: "query",
        note: "At index 4: Add BIT[4] = 34. Next: 4 - (4 & -4) = 4 - 4 = 0 (Terminates).",
      });
      list.push({
        idx: 0,
        highlightIndices: [7, 6, 4],
        sumAccumulator: 61,
        operation: "query",
        note: "Prefix sum for [1..7] = 61 calculated in O(log n) steps using lowbit masks!",
      });
    } else {
      list.push({
        idx: 3,
        highlightIndices: [3],
        operation: "update",
        note: "Update index 3: Update BIT[3]. Next: 3 + (3 & -3) = 3 + 1 = 4.",
      });
      list.push({
        idx: 4,
        highlightIndices: [3, 4],
        operation: "update",
        note: "At index 4: Update BIT[4]. Next: 4 + (4 & -4) = 4 + 4 = 8.",
      });
      list.push({
        idx: 8,
        highlightIndices: [3, 4, 8],
        operation: "update",
        note: "At index 8: Update BIT[8]. 8 + (8 & -8) = 16 > n (Terminates). Point update complete!",
      });
    }

    return list;
  }, [op]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  const bitArray = [0, 4, 9, 3, 34, 7, 15, 12, 68];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Fenwick Tree (Binary Indexed Tree)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Computes prefix sums and point updates in O(log n) time using bitwise lowbit isolation: i &amp; (-i).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setOp("query"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${op === "query" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Prefix Sum Query (idx = 7)
          </button>
          <button
            onClick={() => { setOp("update"); playback.stop(); }}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${op === "update" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
          >
            Point Update (idx = 3)
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="fenwick" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(60, 80)">
            {bitArray.slice(1).map((val, i) => {
              const bitIdx = i + 1;
              const isHighlighted = f.highlightIndices.includes(bitIdx);
              const isCurrent = f.idx === bitIdx;

              return (
                <g key={bitIdx} transform={`translate(${i * 74}, 0)`}>
                  <rect
                    width={64}
                    height={50}
                    rx={8}
                    fill={isCurrent ? COLOR_YELLOW : isHighlighted ? COLOR_GREEN : "#000000"}
                    stroke={isCurrent ? COLOR_YELLOW : isHighlighted ? COLOR_GREEN : "rgba(255,255,255,0.2)"}
                    strokeWidth={2}
                  />
                  <text x={32} y={30} textAnchor="middle" fontSize={14} fontWeight={800} fill={isCurrent || isHighlighted ? "#09090b" : "#FFFFFF"}>
                    {val}
                  </text>
                  <text x={32} y={70} textAnchor="middle" fontSize={11} fill="#a1a1aa">
                    BIT[{bitIdx}]
                  </text>
                  <text x={32} y={85} textAnchor="middle" fontSize={9} fill="#71717a">
                    {bitIdx.toString(2).padStart(4, "0")}₂
                  </text>
                </g>
              );
            })}
          </g>

          {f.sumAccumulator !== undefined && (
            <g transform="translate(360, 230)">
              <rect x="-140" y="-16" width="280" height="32" rx="6" fill="#1f1f23" stroke={COLOR_GREEN} strokeWidth="1" />
              <text textAnchor="middle" dy="0.35em" fontSize={13} fill={COLOR_GREEN} fontWeight="bold">
                Accumulated Sum = {f.sumAccumulator}
              </text>
            </g>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 7. SEGMENT TREE
// ============================================================================

interface SegNode {
  id: number;
  l: number;
  r: number;
  val: number;
  x: number;
  y: number;
}

interface SegFrame {
  activeIds: number[];
  includedIds: number[];
  prunedIds: number[];
  note: string;
}

export function SegmentTreeSimulation() {
  const [queryRange] = useState<[number, number]>([2, 5]);

  const nodes: SegNode[] = [
    { id: 1, l: 0, r: 7, val: 36, x: 360, y: 40 },
    { id: 2, l: 0, r: 3, val: 14, x: 200, y: 110 },
    { id: 3, l: 4, r: 7, val: 22, x: 520, y: 110 },
    { id: 4, l: 0, r: 1, val: 6, x: 120, y: 180 },
    { id: 5, l: 2, r: 3, val: 8, x: 280, y: 180 },
    { id: 6, l: 4, r: 5, val: 11, x: 440, y: 180 },
    { id: 7, l: 6, r: 7, val: 11, x: 600, y: 180 },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
    { from: 3, to: 7 },
  ];

  const frames = useMemo<SegFrame[]>(() => {
    return [
      {
        activeIds: [1],
        includedIds: [],
        prunedIds: [],
        note: `Query range [${queryRange[0]}..${queryRange[1]}]. Start at root [0..7]. Overlaps both halves => Recurse left and right.`,
      },
      {
        activeIds: [2],
        includedIds: [],
        prunedIds: [],
        note: `Visiting left child [0..3]. Partially overlaps [${queryRange[0]}..${queryRange[1]}]. Recurse into [0..1] and [2..3].`,
      },
      {
        activeIds: [4, 5],
        includedIds: [5],
        prunedIds: [4],
        note: `Node [0..1] is disjoint (Pruned). Node [2..3] is fully contained in [${queryRange[0]}..${queryRange[1]}]! Add 8 to total.`,
      },
      {
        activeIds: [3],
        includedIds: [5],
        prunedIds: [4],
        note: `Visiting right child [4..7]. Partially overlaps. Recurse into [4..5] and [6..7].`,
      },
      {
        activeIds: [6, 7],
        includedIds: [5, 6],
        prunedIds: [4, 7],
        note: `Node [4..5] is fully contained! Add 11 to total. Node [6..7] is disjoint (Pruned).`,
      },
      {
        activeIds: [],
        includedIds: [5, 6],
        prunedIds: [4, 7],
        note: `Range query complete! Total sum = Node[2..3](8) + Node[4..5](11) = 19. Done in O(log n).`,
      },
    ];
  }, [queryRange]);

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
          <h3 className="text-sm font-medium text-foreground">Segment Tree Range Sum Query</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interval tree where every node represents a range [L, R]. Answers arbitrary range queries in O(log n).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="seg" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["red", COLOR_RED]]} />

          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.from);
            const v = nodes.find((n) => n.id === e.to);
            if (!u || !v) return null;
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
            const isIncluded = f.includedIds.includes(n.id);
            const isPruned = f.prunedIds.includes(n.id);
            const isActive = f.activeIds.includes(n.id);

            let stroke = "rgba(161,161,170,0.4)";
            let fill = "#1f1f23";
            let glow = "";

            if (isIncluded) {
              stroke = COLOR_GREEN;
              fill = "rgba(0,208,132,0.18)";
              glow = "url(#seg-glow-green)";
            } else if (isPruned) {
              stroke = COLOR_RED;
              fill = "rgba(255,135,135,0.1)";
            } else if (isActive) {
              stroke = COLOR_CYAN;
              fill = "rgba(0,206,255,0.18)";
              glow = "url(#seg-glow-cyan)";
            }

            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  x="-36"
                  y="-20"
                  width="72"
                  height="40"
                  rx="8"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isActive || isIncluded ? 2.5 : 1.5}
                  filter={glow}
                />
                <text textAnchor="middle" dy="-0.1em" fontSize={12} fontWeight="bold" fill="#f4f4f5">
                  [{n.l}..{n.r}]
                </text>
                <text textAnchor="middle" dy="1.1em" fontSize={11} fill={isIncluded ? COLOR_GREEN : isPruned ? COLOR_RED : COLOR_CYAN}>
                  sum={n.val}
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
// 8. TREE TRAVERSALS (PRE, IN, POST, LEVEL ORDER)
// ============================================================================

export function TreeTraversalsSimulation() {
  const [order, setOrder] = useState<"inorder" | "preorder" | "postorder" | "bfs">("inorder");

  const nodes = [
    { id: 1, val: 1, x: 360, y: 50 },
    { id: 2, val: 2, x: 240, y: 130 },
    { id: 3, val: 3, x: 480, y: 130 },
    { id: 4, val: 4, x: 180, y: 210 },
    { id: 5, val: 5, x: 300, y: 210 },
  ];

  const edges = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
  ];

  const traversalSequences = {
    inorder: [4, 2, 5, 1, 3],
    preorder: [1, 2, 4, 5, 3],
    postorder: [4, 5, 2, 3, 1],
    bfs: [1, 2, 3, 4, 5],
  };

  const seq = traversalSequences[order];

  const frames = useMemo(() => {
    const list = [];
    list.push({
      activeId: -1,
      visited: [] as number[],
      note: `Beginning ${order.toUpperCase()} traversal.`,
    });

    for (let i = 0; i < seq.length; i++) {
      const active = seq[i];
      const visitedSoFar = seq.slice(0, i + 1);
      list.push({
        activeId: active,
        visited: visitedSoFar,
        note: `Visited Node ${active}. Accumulated output: [${visitedSoFar.join(", ")}].`,
      });
    }
    return list;
  }, [order, seq]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Binary Tree Traversals</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            DFS (In-order, Pre-order, Post-order) and BFS (Level-order) traversal patterns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(["inorder", "preorder", "postorder", "bfs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setOrder(t); playback.stop(); }}
              className={`px-2.5 py-1 text-xs rounded-md capitalize transition-colors ${order === t ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "border border-border text-muted-foreground hover:bg-muted"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 300" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="trav" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {edges.map((e, idx) => {
            const u = nodes.find((n) => n.id === e.from);
            const v = nodes.find((n) => n.id === e.to);
            if (!u || !v) return null;
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
            const isActive = f.activeId === n.id;
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
                  r={20}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight={800} fill={textColor}>
                  {n.val}
                </text>
              </g>
            );
          })}

          <g transform="translate(160, 260)">
            <text x="-40" y="18" fontSize={12} fill="#a1a1aa" fontWeight={800}>
              Output:
            </text>
            {f.visited.map((val, idx) => (
              <g key={idx} transform={`translate(${idx * 48}, 0)`}>
                <rect width={36} height={26} rx={6} fill={COLOR_GREEN} stroke={COLOR_GREEN} strokeWidth="1" />
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
// 9. MORRIS TRAVERSAL (THREADED BINARY TREE)
// ============================================================================

interface MorrisFrame {
  currentId: number;
  thread?: { from: number; to: number };
  visited: number[];
  note: string;
}

export function MorrisTraversalSimulation() {
  const frames = useMemo<MorrisFrame[]>(() => {
    return [
      {
        currentId: 1,
        visited: [],
        note: "Morris Inorder: Start at root 1. Since node 1 has left child 2, find its inorder predecessor.",
      },
      {
        currentId: 1,
        thread: { from: 5, to: 1 },
        visited: [],
        note: "Predecessor of 1 is node 5 (rightmost of left subtree). Create temporary thread: 5.right = 1.",
      },
      {
        currentId: 2,
        thread: { from: 5, to: 1 },
        visited: [],
        note: "Move current to left child (node 2). Node 2 has left child 4, find predecessor of 2.",
      },
      {
        currentId: 2,
        thread: { from: 4, to: 2 },
        visited: [],
        note: "Create thread: 4.right = 2. Move current to node 4.",
      },
      {
        currentId: 4,
        visited: [4],
        note: "Node 4 has no left child: visit 4! Follow thread back to 2.",
      },
      {
        currentId: 2,
        visited: [4, 2],
        note: "Back at node 2 via thread. Remove thread (4.right = null). Visit node 2! Move to 2.right (node 5).",
      },
      {
        currentId: 5,
        visited: [4, 2, 5],
        note: "Node 5 has no left child: visit 5! Follow thread 5.right back to root 1.",
      },
      {
        currentId: 1,
        visited: [4, 2, 5, 1],
        note: "Back at root 1 via thread. Remove thread (5.right = null). Visit root 1! Move to 1.right (node 3).",
      },
      {
        currentId: 3,
        visited: [4, 2, 5, 1, 3],
        note: "Node 3 has no left child: visit 3! Traversal finished in O(n) time and O(1) auxiliary space!",
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
    { id: 1, val: 1, x: 360, y: 50 },
    { id: 2, val: 2, x: 240, y: 130 },
    { id: 3, val: 3, x: 480, y: 130 },
    { id: 4, val: 4, x: 180, y: 210 },
    { id: 5, val: 5, x: 300, y: 210 },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Morris Traversal (Threaded Binary Tree)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Traverses tree in Inorder without recursion or stack by temporarily pointing rightmost leaf to predecessor.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 300" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="morris" colors={[["cyan", COLOR_CYAN], ["amber", COLOR_AMBER], ["green", COLOR_GREEN]]} />

          <line x1={360} y1={50} x2={240} y2={130} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={360} y1={50} x2={480} y2={130} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={240} y1={130} x2={180} y2={210} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <line x1={240} y1={130} x2={300} y2={210} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />

          {f.thread && (
            <path
              d={`M ${nodes.find((n) => n.id === f.thread!.from)?.x} ${nodes.find((n) => n.id === f.thread!.from)?.y} Q 360 180 ${nodes.find((n) => n.id === f.thread!.to)?.x} ${nodes.find((n) => n.id === f.thread!.to)?.y}`}
              fill="none"
              stroke={COLOR_AMBER}
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {nodes.map((n) => {
            const isCurrent = f.currentId === n.id;
            const isVisited = f.visited.includes(n.id);
            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={20}
                  fill="#1f1f23"
                  stroke={isCurrent ? COLOR_CYAN : isVisited ? COLOR_GREEN : "rgba(161,161,170,0.4)"}
                  strokeWidth={isCurrent || isVisited ? 2.5 : 1.5}
                  filter={isCurrent ? "url(#morris-glow-cyan)" : undefined}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight="bold" fill={isCurrent ? COLOR_CYAN : isVisited ? COLOR_GREEN : "#f4f4f5"}>
                  {n.val}
                </text>
              </g>
            );
          })}

          <g transform="translate(160, 260)">
            <text x="-40" y="18" fontSize={12} fill="#a1a1aa" fontWeight="bold">
              Output:
            </text>
            {f.visited.map((val, idx) => (
              <g key={idx} transform={`translate(${idx * 48}, 0)`}>
                <rect width={36} height={26} rx={6} fill="rgba(0,208,132,0.15)" stroke={COLOR_GREEN} strokeWidth="1" />
                <text x={18} y={17} textAnchor="middle" fontSize={12} fill={COLOR_GREEN} fontWeight="bold">
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
// 10. QUAD TREES (2D SPATIAL PARTITIONING)
// ============================================================================

export function QuadTreesSimulation() {
  const points = [
    { x: 80, y: 60, id: "P1" },
    { x: 120, y: 100, id: "P2" },
    { x: 260, y: 70, id: "P3" },
    { x: 70, y: 240, id: "P4" },
    { x: 280, y: 260, id: "P5" },
    { x: 310, y: 290, id: "P6" },
  ];

  const frames = useMemo(() => {
    return [
      {
        visibleCount: 2,
        subdividedSE: false,
        note: "Initial Root Quadrant [0..360, 0..360]. P1 and P2 inserted within capacity (C=2).",
      },
      {
        visibleCount: 3,
        subdividedSE: false,
        note: "Point P3 inserted into NE quadrant. Capacity limit not yet reached in any quadrant.",
      },
      {
        visibleCount: 4,
        subdividedSE: false,
        note: "Point P4 inserted into SW quadrant. Root space partitioned into 4 quadrants (NW, NE, SW, SE).",
      },
      {
        visibleCount: 5,
        subdividedSE: false,
        note: "Point P5 inserted into SE quadrant.",
      },
      {
        visibleCount: 6,
        subdividedSE: true,
        note: "Point P6 inserted into SE quadrant. SE quadrant exceeds capacity => Subdivides recursively into 4 child quads!",
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
          <h3 className="text-sm font-medium text-foreground">Quadtree (2D Spatial Partitioning)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hierarchical 2D grid partitioning used in collision detection, spatial indexing, and computer graphics.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 360" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="quad" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(40, 20)">
            <rect x={0} y={0} width={320} height={320} fill="#18181b" stroke={COLOR_CYAN} strokeWidth={2} />

            <line x1={160} y1={0} x2={160} y2={320} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <line x1={0} y1={160} x2={320} y2={160} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />

            <text x={80} y={20} fill="#71717a" fontSize={11} textAnchor="middle">NW</text>
            <text x={240} y={20} fill="#71717a" fontSize={11} textAnchor="middle">NE</text>
            <text x={80} y={180} fill="#71717a" fontSize={11} textAnchor="middle">SW</text>
            <text x={240} y={180} fill="#71717a" fontSize={11} textAnchor="middle">SE</text>

            {f.subdividedSE && (
              <>
                <line x1={240} y1={160} x2={240} y2={320} stroke={COLOR_GREEN} strokeWidth={1.5} strokeDasharray="3 3" />
                <line x1={160} y1={240} x2={320} y2={240} stroke={COLOR_GREEN} strokeWidth={1.5} strokeDasharray="3 3" />
              </>
            )}

            {points.slice(0, f.visibleCount).map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={5} fill={COLOR_CYAN} filter="url(#quad-glow-cyan)" />
                <text x={p.x + 8} y={p.y + 4} fill="#f4f4f5" fontSize={10} fontWeight="bold">
                  {p.id}
                </text>
              </g>
            ))}
          </g>

          <g transform="translate(420, 40)">
            <rect x={70} y={0} width={80} height={28} rx={6} fill="#1f1f23" stroke={COLOR_CYAN} strokeWidth={1.5} />
            <text x={110} y={18} textAnchor="middle" fontSize={12} fill="#f4f4f5" fontWeight="bold">Root</text>

            <line x1={110} y1={28} x2={30} y2={80} stroke="rgba(161,161,170,0.3)" />
            <line x1={110} y1={28} x2={90} y2={80} stroke="rgba(161,161,170,0.3)" />
            <line x1={110} y1={28} x2={150} y2={80} stroke="rgba(161,161,170,0.3)" />
            <line x1={110} y1={28} x2={210} y2={80} stroke="rgba(161,161,170,0.3)" />

            {["NW", "NE", "SW", "SE"].map((q, idx) => (
              <g key={q} transform={`translate(${idx * 60}, 80)`}>
                <rect width={45} height={24} rx={4} fill="#1f1f23" stroke={q === "SE" && f.subdividedSE ? COLOR_GREEN : "rgba(161,161,170,0.4)"} strokeWidth={1.5} />
                <text x={22} y={16} textAnchor="middle" fontSize={10} fill="#f4f4f5">{q}</text>
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
// 11. SKIP LISTS (PROBABILISTIC MULTI-LEVEL LIST)
// ============================================================================

export function SkipListsSimulation() {
  const frames = useMemo(() => {
    return [
      {
        activeLevel: 2,
        activeVal: -Infinity,
        found: false,
        note: "Start at top level L2 (Express lane) at -Infinity.",
      },
      {
        activeLevel: 2,
        activeVal: 10,
        found: false,
        note: "L2: 10 < 25. Forward link is 30. Since 30 > 25, drop down to Level 1.",
      },
      {
        activeLevel: 1,
        activeVal: 10,
        found: false,
        note: "L1: At node 10. Forward link is 20. Since 20 < 25, step forward to 20.",
      },
      {
        activeLevel: 1,
        activeVal: 20,
        found: false,
        note: "L1: At node 20. Next node is 30 (> 25). Drop down to base Level 0.",
      },
      {
        activeLevel: 0,
        activeVal: 25,
        found: true,
        note: "L0: Step forward to 25. Match found! Lookup finished in O(log n) expected steps.",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  const levels = [
    { level: 2, nodes: [-Infinity, 10, 30, Infinity] },
    { level: 1, nodes: [-Infinity, 10, 20, 30, Infinity] },
    { level: 0, nodes: [-Infinity, 5, 10, 18, 20, 25, 30, Infinity] },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Skip List (Probabilistic Express Lanes)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Multi-level linked lists offering O(log n) average search, insertion, and deletion without complex rebalancing.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="skiplist" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {levels.map((lvl, lIdx) => {
            const y = 60 + lIdx * 65;
            return (
              <g key={lvl.level}>
                <text x={40} y={y + 14} fontSize={12} fill="#a1a1aa" fontWeight="bold">
                  L{lvl.level}
                </text>

                {lvl.nodes.map((nodeVal, nIdx) => {
                  const x = 110 + nIdx * 70;
                  const isActive = f.activeLevel === lvl.level && f.activeVal === nodeVal;
                  const isFound = f.found && nodeVal === 25;

                  return (
                    <React.Fragment key={nIdx}>
                      {nIdx < lvl.nodes.length - 1 && (
                        <line
                          x1={x + 36}
                          y1={y + 14}
                          x2={x + 70}
                          y2={y + 14}
                          stroke="rgba(161,161,170,0.3)"
                          strokeWidth={2}
                        />
                      )}
                      <rect
                        x={x}
                        y={y}
                        width={36}
                        height={28}
                        rx={6}
                        fill="#1f1f23"
                        stroke={isFound ? COLOR_GREEN : isActive ? COLOR_CYAN : "rgba(161,161,170,0.4)"}
                        strokeWidth={isActive || isFound ? 2.5 : 1.5}
                        filter={isFound ? "url(#skiplist-glow-green)" : isActive ? "url(#skiplist-glow-cyan)" : undefined}
                      />
                      <text
                        x={x + 18}
                        y={y + 18}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight="bold"
                        fill={isFound ? COLOR_GREEN : isActive ? COLOR_CYAN : "#f4f4f5"}
                      >
                        {nodeVal === -Infinity ? "-INF" : nodeVal === Infinity ? "+INF" : nodeVal}
                      </text>
                    </React.Fragment>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}
