"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

const INITIAL_ARRAY = [5, 2, 8, 4, 1, 7, 3, 6];

const CODE_LINES = [
  "sort(a):",
  "  if len(a) <= 1: return a",
  "  L = sort(left half)",
  "  R = sort(right half)",
  "  return merge(L, R)",
];

interface TreeNode {
  id: number;
  lo: number;
  hi: number;
  depth: number;
  values: number[];
  sorted: number[];
  sortedSrc: ("L" | "R")[];
  children: number[];
  isLeaf: boolean;
}

class TreeBuilder {
  nodes: TreeNode[] = [];

  add(lo: number, hi: number, depth: number): number {
    const id = this.nodes.length;
    this.nodes.push({
      id,
      lo,
      hi,
      depth,
      values: INITIAL_ARRAY.slice(lo, hi),
      sorted: [],
      sortedSrc: [],
      children: [],
      isLeaf: hi - lo <= 1,
    });
    return id;
  }
}

type Phase = "idle" | "divide" | "base" | "combine" | "done";

interface SimFrame {
  activeId: number;
  visible: number[];
  merged: number[];
  phase: Phase;
  note: string;
  sub: string;
  codeLine: number;
  resultText: string;
}

const IDLE_FRAME: SimFrame = {
  activeId: -1,
  visible: [0],
  merged: [],
  phase: "idle",
  note: `Sort [${INITIAL_ARRAY.join(",")}] by divide and conquer`,
  sub: "split down to single elements, then merge sorted halves back up",
  codeLine: 0,
  resultText: "",
};

const PHASE_LABELS: Record<Phase, string> = {
  idle: "READY",
  divide: "DIVIDE",
  base: "BASE CASE",
  combine: "COMBINE",
  done: "DONE",
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: "#FDE047",
  divide: "#93C5FD",
  base: "#FDE047",
  combine: "#86EFAC",
  done: "#86EFAC",
};

function formatArr(arr: number[]): string {
  return `[${arr.join(",")}]`;
}

// Layout metrics
const DESKTOP_LAYOUT = {
  vbW: 960,
  vbH: 500,
  noteFont: 14,
  subY: 36,
  codeX: 28,
  codeY: 78,
  codeW: 216,
  codeLH: 18.5,
  codeFont: 11.5,
  showCodeLabel: true,
  pyrX: 270,
  pyrW: 662,
  pyrY0: 104,
  rowStep: 92,
  pillH: 34,
  labelY: 60,
  pyrLabelY: 60,
  resultY: 472,
};

const MOBILE_LAYOUT = {
  vbW: 440,
  vbH: 512,
  noteFont: 12,
  subY: 34,
  codeX: 20,
  codeY: 56,
  codeW: 400,
  codeLH: 16,
  codeFont: 10.5,
  showCodeLabel: false,
  pyrX: 20,
  pyrW: 400,
  pyrY0: 188,
  rowStep: 72,
  pillH: 30,
  labelY: 60,
  pyrLabelY: 162,
  resultY: 496,
};

export function DivideConquerSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(960);
  const isCompact = containerWidth > 0 && containerWidth < 720;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Precompute the division tree and frames once
  const { nodes, frames } = useMemo(() => {
    const builder = new TreeBuilder();
    let maxDepth = 0;

    function build(lo: number, hi: number, depth: number): number {
      maxDepth = Math.max(maxDepth, depth);
      const id = builder.add(lo, hi, depth);
      if (hi - lo > 1) {
        const mid = Math.floor((lo + hi) / 2);
        builder.nodes[id].children.push(build(lo, mid, depth + 1), build(mid, hi, depth + 1));
      }
      return id;
    }

    const rootId = build(0, INITIAL_ARRAY.length, 0);

    const generatedFrames: SimFrame[] = [];
    const visibleSet = new Set<number>([rootId]);
    const mergedSet = new Set<number>();

    const pushFrame = (
      activeId: number,
      phase: Phase,
      note: string,
      sub: string,
      codeLine: number,
      resultText = ""
    ) => {
      generatedFrames.push({
        activeId,
        visible: [...visibleSet],
        merged: [...mergedSet],
        phase,
        note,
        sub,
        codeLine,
        resultText,
      });
    };

    function simulate(id: number) {
      const node = builder.nodes[id];
      if (node.isLeaf) {
        node.sorted = [...node.values];
        mergedSet.add(id);
        pushFrame(
          id,
          "base",
          `Base case: [${node.values[0]}] is a single element, already sorted`,
          "the recursion stops here",
          1
        );
        return;
      }

      const [leftId, rightId] = node.children;
      visibleSet.add(leftId);
      visibleSet.add(rightId);

      pushFrame(
        id,
        "divide",
        `Divide ${formatArr(node.values)} into ${formatArr(builder.nodes[leftId].values)} and ${formatArr(builder.nodes[rightId].values)}`,
        "each half is a smaller instance of the same problem",
        2
      );

      simulate(leftId);
      simulate(rightId);

      // Merge step
      const leftSorted = builder.nodes[leftId].sorted;
      const rightSorted = builder.nodes[rightId].sorted;

      const out: number[] = [];
      const src: ("L" | "R")[] = [];
      let l = 0;
      let r = 0;

      while (l < leftSorted.length && r < rightSorted.length) {
        if (leftSorted[l] <= rightSorted[r]) {
          out.push(leftSorted[l++]);
          src.push("L");
        } else {
          out.push(rightSorted[r++]);
          src.push("R");
        }
      }
      while (l < leftSorted.length) {
        out.push(leftSorted[l++]);
        src.push("L");
      }
      while (r < rightSorted.length) {
        out.push(rightSorted[r++]);
        src.push("R");
      }

      node.sorted = out;
      node.sortedSrc = src;
      mergedSet.add(id);

      pushFrame(
        id,
        "combine",
        `Combine ${formatArr(leftSorted)} + ${formatArr(rightSorted)} → ${formatArr(out)}`,
        "walk both halves, always take the smaller front element",
        4
      );
    }

    pushFrame(
      -1,
      "idle",
      `Sort ${formatArr(builder.nodes[rootId].values)} by divide and conquer`,
      "split down to single elements, then merge sorted halves back up",
      0
    );

    simulate(rootId);

    pushFrame(
      -1,
      "done",
      `Done: ${formatArr(builder.nodes[rootId].sorted)} is fully sorted`,
      "log n levels of splitting, n work to merge each level: O(n log n)",
      -1,
      `Sorted ${formatArr(builder.nodes[rootId].sorted)}`
    );

    return { nodes: builder.nodes, frames: generatedFrames };
  }, []);

  const player = useSimulationPlayback<SimFrame>(600, IDLE_FRAME);
  const currentFrame = player.view;
  const progress = player.progress;

  const handleRun = useCallback(() => {
    const stepDuration = Math.max(420, Math.min(760, Math.round(15000 / frames.length)));
    player.play(frames, stepDuration);
  }, [frames, player]);

  // Layout calculations
  const L = isCompact ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
  const phase = currentFrame.phase;
  const phaseColor = PHASE_COLORS[phase];
  const activeId = currentFrame.activeId;
  const visibleSet = new Set(currentFrame.visible);
  const mergedSet = new Set(currentFrame.merged);

  const activeNode = activeId >= 0 ? nodes[activeId] : null;
  const dividingChildren =
    phase === "divide" && activeNode ? new Set(activeNode.children) : new Set<number>();

  const totalN = INITIAL_ARRAY.length;
  const getX = (lo: number) => L.pyrX + (lo / totalN) * L.pyrW;
  const getY = (depth: number) => L.pyrY0 + depth * L.rowStep;

  const getNodeCenter = (node: TreeNode) => ({
    x: (getX(node.lo) + getX(node.hi)) / 2,
    y: getY(node.depth),
  });

  return (
    <div className="w-full space-y-4">
      {/* Title & Description Box */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Break a problem into smaller subproblems, solve each, then combine the results.
              Shown with merge sort on 8 elements.
            </p>
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div
        ref={containerRef}
        className="w-full rounded-2xl border border-white/10 bg-black p-2 sm:p-4 overflow-hidden shadow-2xl"
      >
        <svg
          viewBox={`0 0 ${L.vbW} ${L.vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="dac"
            colors={[
              ["cyan", "#06b6d4"],
              ["green", "#22c55e"],
              ["yellow", "#eab308"],
            ]}
          />

          {/* Phase Badge */}
          <g>
            <rect
              x={L.vbW - 128}
              y={8}
              width={108}
              height={22}
              rx={5}
              fill="none"
              stroke={phaseColor}
              strokeWidth={1.5}
              opacity={0.95}
            />
            <text
              x={L.vbW - 74}
              y={20}
              textAnchor="middle"
              dominantBaseline="central"
              fill={phaseColor}
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 0.8 }}
            >
              {PHASE_LABELS[phase]}
            </text>
          </g>

          {/* Top Note / Status Message */}
          <text
            x={L.codeX}
            y={12}
            dominantBaseline="hanging"
            fill={phaseColor}
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={L.noteFont}
          >
            {currentFrame.note}
          </text>
          <text
            x={L.codeX}
            y={L.subY}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={600}
            fontSize={isCompact ? 10.5 : 11.5}
          >
            {currentFrame.sub}
          </text>

          {/* Code Section */}
          {L.showCodeLabel && (
            <text
              x={L.codeX}
              y={L.labelY}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 1 }}
            >
              CODE
            </text>
          )}

          <g>
            <rect
              x={L.codeX}
              y={L.codeY}
              width={L.codeW}
              height={CODE_LINES.length * L.codeLH + 12}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            {currentFrame.codeLine >= 0 && (
              <g>
                <rect
                  x={L.codeX + 1}
                  y={L.codeY + 6 + currentFrame.codeLine * L.codeLH}
                  width={L.codeW - 2}
                  height={L.codeLH}
                  fill="#06b6d4"
                  opacity={0.15}
                />
                <rect
                  x={L.codeX + 1}
                  y={L.codeY + 6 + currentFrame.codeLine * L.codeLH}
                  width={3}
                  height={L.codeLH}
                  fill="#06b6d4"
                />
              </g>
            )}
            {CODE_LINES.map((line, idx) => (
              <text
                key={idx}
                x={L.codeX + 12}
                y={L.codeY + 6 + idx * L.codeLH + L.codeLH / 2}
                dominantBaseline="central"
                fill={idx === currentFrame.codeLine ? "#f4f4f5" : "#71717a"}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={idx === currentFrame.codeLine ? 800 : 500}
                fontSize={L.codeFont}
                xmlSpace="preserve"
              >
                {line}
              </text>
            ))}
          </g>

          {/* Tree Section Title */}
          <text
            x={L.pyrX}
            y={L.pyrLabelY}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={isCompact ? 10 : 11.5}
            style={{ letterSpacing: 1 }}
          >
            SPLIT DOWN · MERGE UP
          </text>

          {/* Tree Edges */}
          {nodes.map((parent) =>
            parent.children.map((childId) => {
              if (!visibleSet.has(parent.id) || !visibleSet.has(childId)) return null;
              const pCenter = getNodeCenter(parent);
              const cCenter = getNodeCenter(nodes[childId]);
              const isDividing = dividingChildren.has(childId);
              const isHighlight =
                parent.id === activeId && (phase === "divide" || phase === "combine");
              const strokeColor = phase === "combine" ? "#86EFAC" : "#93C5FD";

              const x1 = pCenter.x;
              const y1 = pCenter.y + L.pillH / 2;
              const x2 = cCenter.x;
              const y2 = cCenter.y - L.pillH / 2;
              const dist = Math.hypot(x2 - x1, y2 - y1);

              return (
                <line
                  key={`${parent.id}-${childId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isHighlight ? strokeColor : "rgba(255,255,255,0.2)"}
                  strokeWidth={isHighlight ? 2.25 : 1.25}
                  opacity={isHighlight ? 0.95 : 0.5}
                  strokeDasharray={isDividing && progress < 1 ? dist : undefined}
                  strokeDashoffset={isDividing && progress < 1 ? (1 - progress) * dist : undefined}
                />
              );
            })
          )}

          {/* Tree Nodes (Arrays) */}
          {nodes.map((node) => {
            if (!visibleSet.has(node.id)) return null;

            const x = getX(node.lo) + 3;
            const w = getX(node.hi) - getX(node.lo) - 6;
            const isActive = node.id === activeId;
            const isMerged = mergedSet.has(node.id);
            const isBase = isActive && phase === "base";
            const isCombine = isActive && phase === "combine";
            const isDividing = dividingChildren.has(node.id);

            const yAnim = isDividing && progress < 1 ? -14 * (1 - progress) : 0;
            const y = getY(node.depth) - L.pillH / 2 + yAnim;
            const opacity = isDividing && progress < 1 ? 0.25 + 0.75 * progress : 1;

            const values = isMerged ? node.sorted : node.values;
            const valLen = values.length;
            const visibleValuesCount =
              isCombine && progress < 1 ? Math.max(1, Math.ceil(progress * valLen)) : valLen;
            const cellW = w / valLen;

            let bgColor = isBase ? "#FDE047" : isCombine ? "#000000" : isActive ? "#93C5FD" : isMerged ? "#86EFAC" : "#000000";
            let strokeColor = isBase ? "#FDE047" : isCombine ? "#86EFAC" : isActive ? "#93C5FD" : isMerged ? "#86EFAC" : "rgba(255,255,255,0.2)";
            const isDarkText = (isActive && !isCombine) || (isMerged && !isCombine) || isBase;

            return (
              <g
                key={node.id}
                opacity={opacity}
              >
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={L.pillH}
                  rx={7}
                  fill={bgColor}
                  stroke={strokeColor}
                  strokeWidth={isActive ? 2.5 : isMerged ? 2 : 1.25}
                />
                {values.map((val, i) => {
                  if (i >= visibleValuesCount) return null;
                  let textColor = isDarkText ? "#09090b" : "#FFFFFF";
                  if (isCombine && node.sortedSrc[i]) {
                    textColor = node.sortedSrc[i] === "L" ? "#93C5FD" : "#FDE047";
                  }

                  return (
                    <text
                      key={i}
                      x={x + (i + 0.5) * cellW}
                      y={y + L.pillH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={textColor}
                      fontFamily="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                      fontWeight={800}
                      fontSize={isCompact ? 12 : 14}
                    >
                      {val}
                    </text>
                  );
                })}
              </g>
            );
          })}

          {/* Bottom Completion Result Message */}
          {currentFrame.resultText && (
            <g
              opacity={phase === "done" && progress < 1 ? progress : 1}
              filter="url(#dac-glow-green)"
            >
              <text
                x={L.pyrX + L.pyrW / 2}
                y={L.resultY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#22c55e"
                fontSize={isCompact ? 14 : 16}
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
