"use client";

import React from "react";
import { GlowDefs } from "../shared/simulation-defs";

interface BinaryTreeNodeItem {
  id: string;
  type: string;
  value: any;
  parent?: string;
  isLeftChild?: boolean;
  state?: string;
  label?: string;
  leftId?: string | null;
  rightId?: string | null;
  depth: number;
  order: number;
  x: number;
  y: number;
}

interface TreeVisualizerProps {
  visualState: Record<string, any>;
  height?: number;
  className?: string;
}

export function TreeVisualizer({
  visualState,
  height = 280,
  className = "",
}: TreeVisualizerProps) {
  const vbW = 720;
  const vbH = height;

  // 1. Collect tree nodes, graph edges, and queue elements
  const nodesMap = new Map<string, BinaryTreeNodeItem>();
  const graphEdges: any[] = [];
  const queueElements: any[] = [];

  for (const key in visualState) {
    const item = visualState[key];
    if (!item) continue;

    if (
      item.type === "binaryTreeNode" ||
      item.type === "treeNode" ||
      item.type === "naryTreeNode"
    ) {
      nodesMap.set(key, {
        id: key,
        type: item.type,
        value: item.value ?? item.val ?? "",
        parent: item.parent ? String(item.parent) : undefined,
        isLeftChild: item.isLeftChild,
        state: item.state,
        label: item.label,
        leftId: null,
        rightId: null,
        depth: 0,
        order: 0,
        x: 0,
        y: 0,
      });
    } else if (item.type === "graphEdge") {
      graphEdges.push({ id: key, ...item });
    } else if (item.type === "queueElement") {
      queueElements.push({ id: key, ...item });
    }
  }

  if (nodesMap.size === 0) {
    return null;
  }

  // 2. Link parents & children
  const roots: string[] = [];
  for (const [id, node] of nodesMap.entries()) {
    if (!node.parent || !nodesMap.has(node.parent)) {
      roots.push(id);
    } else {
      const parent = nodesMap.get(node.parent)!;
      if (node.isLeftChild === true) {
        parent.leftId = id;
      } else if (node.isLeftChild === false) {
        parent.rightId = id;
      } else {
        if (!parent.leftId) parent.leftId = id;
        else parent.rightId = id;
      }
    }
  }

  // Fallback: if cycle or missing root, pick first
  const primaryRoot = roots.length > 0 ? roots[0] : Array.from(nodesMap.keys())[0];

  // 3. Compute depths
  function setDepth(nodeId: string, d: number) {
    const node = nodesMap.get(nodeId);
    if (!node) return;
    node.depth = d;
    if (node.leftId) setDepth(node.leftId, d + 1);
    if (node.rightId) setDepth(node.rightId, d + 1);
  }
  setDepth(primaryRoot, 0);

  // 4. In-order traversal to compute horizontal ordering without overlaps
  let inOrderIndex = 0;
  function assignOrder(nodeId: string) {
    const node = nodesMap.get(nodeId);
    if (!node) return;
    if (node.leftId) assignOrder(node.leftId);
    node.order = inOrderIndex++;
    if (node.rightId) assignOrder(node.rightId);
  }
  assignOrder(primaryRoot);

  // Any detached nodes
  for (const [id, node] of nodesMap.entries()) {
    if (node.depth === 0 && id !== primaryRoot) {
      setDepth(id, 0);
      assignOrder(id);
    }
  }

  // 5. Layout coordinates
  const totalNodes = Math.max(1, inOrderIndex);
  const maxDepth = Math.max(0, ...Array.from(nodesMap.values()).map((n) => n.depth));
  const hasQueue = queueElements.length > 0;
  const availH = hasQueue ? vbH - 60 : vbH - 24;

  const slotW = Math.min(84, Math.max(34, Math.floor(580 / totalNodes)));
  const startX = (vbW - (totalNodes - 1) * slotW) / 2;
  const levelH = Math.min(62, Math.max(36, Math.floor((availH - 64) / Math.max(1, maxDepth))));
  const startY = 40;

  for (const node of nodesMap.values()) {
    node.x = startX + node.order * slotW;
    node.y = startY + node.depth * levelH;
  }

  // Adjust: center parents between direct children if both exist
  function centerParents(nodeId: string) {
    const node = nodesMap.get(nodeId);
    if (!node) return;
    if (node.leftId) centerParents(node.leftId);
    if (node.rightId) centerParents(node.rightId);
    if (node.leftId && node.rightId) {
      const leftChild = nodesMap.get(node.leftId);
      const rightChild = nodesMap.get(node.rightId);
      if (leftChild && rightChild) {
        node.x = (leftChild.x + rightChild.x) / 2;
      }
    }
  }
  centerParents(primaryRoot);

  queueElements.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto select-none overflow-visible"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Tree Edges */}
        <g>
          {Array.from(nodesMap.values()).map((node) => {
            if (!node.parent || !nodesMap.has(node.parent)) return null;
            const parent = nodesMap.get(node.parent)!;

            const isCurrent = node.state === "current" || parent.state === "current";
            const isPath = node.state === "path" || parent.state === "path";
            const isError = node.state === "error" || parent.state === "error";
            const isDone = node.state === "done" && parent.state === "done";

            let stroke = "rgba(255, 255, 255, 0.18)";
            let strokeWidth = 1.8;
            if (isError) {
              stroke = "#FCA5A5"; // Solid Pastel Red
              strokeWidth = 2.4;
            } else if (isCurrent) {
              stroke = "#FDE047"; // Solid Butter Yellow
              strokeWidth = 2.4;
            } else if (isPath) {
              stroke = "#FDBA74"; // Solid Peach
              strokeWidth = 2.2;
            } else if (isDone) {
              stroke = "#86EFAC"; // Solid Mint Green
              strokeWidth = 2;
            }

            return (
              <line
                key={`edge-${parent.id}-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Graph Edges / Morris Threads */}
        <g>
          {graphEdges.map((ge) => {
            const fromId = typeof ge.from === "number" ? `node_${ge.from}` : String(ge.from);
            const toId = typeof ge.to === "number" ? `node_${ge.to}` : String(ge.to);
            const fromNode = nodesMap.get(fromId);
            const toNode = nodesMap.get(toId);
            if (!fromNode || !toNode) return null;

            const midX = (fromNode.x + toNode.x) / 2 + (fromNode.x < toNode.x ? 30 : -30);
            const midY = Math.min(fromNode.y, toNode.y) - 20;

            return (
              <path
                key={ge.id}
                d={`M ${fromNode.x} ${fromNode.y} Q ${midX} ${midY} ${toNode.x} ${toNode.y}`}
                fill="none"
                stroke="#93C5FD"
                strokeWidth={2}
                strokeDasharray="4 4"
              />
            );
          })}
        </g>

        {/* Tree Nodes */}
        <g>
          {Array.from(nodesMap.values()).map((node) => {
            const s = node.state;
            let fill = "#000000"; // Pitch-black AMOLED base
            let stroke = "rgba(255, 255, 255, 0.2)";
            let textFill = "#FFFFFF";

            if (s === "current" || s === "visiting" || s === "active") {
              fill = "#FDE047"; // Solid Butter Yellow
              stroke = "#FDE047";
              textFill = "#09090b"; // High-contrast Jet Black Text
            } else if (s === "done" || s === "visited" || s === "counted" || s === "sorted" || s === "kept" || s === "covered") {
              fill = "#86EFAC"; // Solid Mint Green
              stroke = "#86EFAC";
              textFill = "#09090b"; // High-contrast Jet Black Text
            } else if (s === "path" || s === "onpath") {
              fill = "#FDBA74"; // Solid Peach
              stroke = "#FDBA74";
              textFill = "#09090b";
            } else if (s === "checking") {
              fill = "#93C5FD"; // Solid Soft Sky Blue
              stroke = "#93C5FD";
              textFill = "#09090b";
            } else if (s === "error" || s === "unbalanced" || s === "removed" || s === "mismatch" || s === "not_covered") {
              fill = "#FCA5A5"; // Solid Pastel Red
              stroke = "#FCA5A5";
              textFill = "#09090b";
            } else if (s === "camera" || s === "cam") {
              fill = "#DDD6FE"; // Solid Pastel Lavender
              stroke = "#DDD6FE";
              textFill = "#09090b";
            }

            const r = totalNodes > 12 ? 15 : totalNodes > 8 ? 17 : 19;

            return (
              <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                {/* Node Circle */}
                <circle
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />

                {/* Node Value */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={r < 17 ? 11 : 13}
                  fontWeight={800}
                  fill={textFill}
                >
                  {node.value}
                </text>

                {/* Node Label Badge (e.g. h=2, -1, cam, diff) */}
                {node.label && (
                  <g transform={`translate(0, ${-r - 11})`}>
                    <rect
                      x={-(node.label.length * 4 + 7)}
                      y={-8}
                      width={node.label.length * 8 + 14}
                      height={16}
                      rx={5}
                      fill="#000000"
                      stroke={stroke}
                      strokeWidth={1.5}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={9}
                      fontWeight={800}
                      fill={fill !== "#000000" ? "#09090b" : "#FFFFFF"}
                    >
                      {node.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Bottom Queue / Stack Strip if present */}
        {hasQueue && (
          <g transform={`translate(${vbW / 2}, ${vbH - 24})`}>
            <text
              x={-(queueElements.length * 28 + 35)}
              y={0}
              dominantBaseline="central"
              fontSize={11}
              fontWeight={800}
              fill="#a1a1aa"
            >
              Queue:
            </text>
            {queueElements.map((qe, idx) => {
              const qx = -(queueElements.length * 15) + idx * 30;
              return (
                <g key={qe.id} transform={`translate(${qx}, 0)`}>
                  <rect
                    x={-12}
                    y={-10}
                    width={24}
                    height={20}
                    rx={5}
                    fill="#93C5FD"
                    stroke="#93C5FD"
                    strokeWidth={1.5}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={11}
                    fontWeight={800}
                    fill="#09090b"
                  >
                    {qe.value}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
