"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

interface Scenario {
  id: "factorial" | "fibonacci";
  name: string;
  n: number;
  lines: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "factorial",
    name: "Factorial(4)",
    n: 4,
    lines: [
      "function factorial(n):",
      "  if n <= 1:",
      "    return 1",
      "  r = factorial(n - 1)",
      "  return n * r",
    ],
  },
  {
    id: "fibonacci",
    name: "Fibonacci(4)",
    n: 4,
    lines: [
      "function fib(n):",
      "  if n <= 1:",
      "    return n",
      "  a = fib(n - 1)",
      "  b = fib(n - 2)",
      "  return a + b",
    ],
  },
];

interface StackFrame {
  id: number;
  name: string;
  n: number;
  vars: Record<string, number | string>;
  isBase?: boolean;
}

interface TreeNode {
  id: number;
  label: string;
  depth: number;
  x: number;
  children: number[];
}

type Phase = "idle" | "call" | "base" | "return" | "done" | "combine";

interface SimFrame {
  phase: Phase;
  activeId: number;
  codeLine: number;
  stack: StackFrame[];
  returned: number[];
  note: string;
  sub: string;
  resultText: string;
}

const DESKTOP = {
  vbW: 960,
  vbH: 500,
  noteFont: 14,
  codeX: 28,
  codeY: 96,
  codeW: 216,
  codeLH: 23,
  treeX: 268,
  treeW: 396,
  treeY: 120,
  treeH: 280,
  stackX: 688,
  stackW: 244,
  stackBaseY: 440,
  resultY: 462,
};

const MOBILE = {
  vbW: 440,
  vbH: 720,
  noteFont: 12,
  codeX: 20,
  codeY: 86,
  codeW: 204,
  codeLH: 20,
  treeX: 20,
  treeW: 400,
  treeY: 450,
  treeH: 200,
  stackX: 240,
  stackW: 180,
  stackBaseY: 380,
  resultY: 690,
};

export function RecursionCallStackSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(960);
  const isCompact = containerWidth > 0 && containerWidth < 720;
  const [scenarioId, setScenarioId] = useState<"factorial" | "fibonacci">("factorial");
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
    const treeNodes: TreeNode[] = [];
    const frames: SimFrame[] = [];
    const returnedSet = new Set<number>();
    const stack: StackFrame[] = [];

    let currentStack: StackFrame[] = [];

    const pushFrame = (
      phase: Phase,
      activeId: number,
      codeLine: number,
      note: string,
      sub: string,
      resultText = ""
    ) => {
      frames.push({
        phase,
        activeId,
        codeLine,
        stack: JSON.parse(JSON.stringify(currentStack)),
        returned: [...returnedSet],
        note,
        sub,
        resultText,
      });
    };

    if (scenario.id === "factorial") {
      let xIdx = 0;
      function buildFact(n: number, depth: number): number {
        const id = treeNodes.length;
        treeNodes.push({ id, label: `fact(${n})`, depth, x: xIdx++, children: [] });
        if (n > 1) {
          const child = buildFact(n - 1, depth + 1);
          treeNodes[id].children.push(child);
        }
        return id;
      }
      buildFact(scenario.n, 0);

      pushFrame(
        "idle",
        -1,
        0,
        `Trace call stack for factorial(${scenario.n})`,
        "watch stack frames push on call and pop on return"
      );

      function runFact(id: number, n: number): number {
        const frameObj: StackFrame = {
          id,
          name: `factorial(${n})`,
          n,
          vars: { r: "?" },
        };
        currentStack.push(frameObj);

        pushFrame(
          "call",
          id,
          1,
          `Call factorial(${n}): push stack frame`,
          `frame allocated at top of call stack (depth ${currentStack.length})`
        );

        if (n <= 1) {
          frameObj.isBase = true;
          pushFrame(
            "base",
            id,
            2,
            `Base case: n <= 1 returns 1`,
            "stops recursion and begins unwinding the stack"
          );
          currentStack.pop();
          returnedSet.add(id);
          pushFrame(
            "return",
            id,
            2,
            `Return 1 from factorial(1): pop stack frame`,
            "stack frame destroyed, value returns to caller"
          );
          return 1;
        }

        pushFrame(
          "call",
          id,
          3,
          `factorial(${n}) calls factorial(${n - 1})`,
          `pause current frame and push factorial(${n - 1})`
        );

        const rVal = runFact(treeNodes[id].children[0], n - 1);
        frameObj.vars.r = rVal;

        pushFrame(
          "combine",
          id,
          4,
          `Resume factorial(${n}): r = ${rVal}, compute ${n} * ${rVal} = ${n * rVal}`,
          "multiply n by returned subproblem answer"
        );

        currentStack.pop();
        returnedSet.add(id);
        const ans = n * rVal;

        pushFrame(
          "return",
          id,
          4,
          `Return ${ans} from factorial(${n}): pop stack frame`,
          `stack depth is now ${currentStack.length}`
        );
        return ans;
      }

      const total = runFact(0, scenario.n);

      pushFrame(
        "done",
        -1,
        -1,
        `Done: factorial(${scenario.n}) = ${total}`,
        "call stack empty, execution complete",
        `factorial(${scenario.n}) = ${total}`
      );
    } else {
      // Fibonacci(4)
      let xIdx = 0;
      function buildFib(n: number, depth: number): number {
        const id = treeNodes.length;
        treeNodes.push({ id, label: `fib(${n})`, depth, x: 0, children: [] });
        if (n > 1) {
          const l = buildFib(n - 1, depth + 1);
          const r = buildFib(n - 2, depth + 1);
          treeNodes[id].children.push(l, r);
        }
        return id;
      }
      buildFib(scenario.n, 0);

      let leafX = 0;
      function layoutTree(id: number) {
        const node = treeNodes[id];
        if (node.children.length === 0) {
          node.x = leafX++;
        } else {
          node.children.forEach(layoutTree);
          node.x = (treeNodes[node.children[0]].x + treeNodes[node.children[node.children.length - 1]].x) / 2;
        }
      }
      layoutTree(0);

      pushFrame(
        "idle",
        -1,
        0,
        `Trace call stack for fib(${scenario.n})`,
        "branching recursion pushes and pops stack frames depth-first"
      );

      function runFib(id: number, n: number): number {
        const frameObj: StackFrame = {
          id,
          name: `fib(${n})`,
          n,
          vars: { a: "?", b: "?" },
        };
        currentStack.push(frameObj);

        pushFrame("call", id, 1, `Call fib(${n}): push stack frame`, `depth ${currentStack.length}`);

        if (n <= 1) {
          frameObj.isBase = true;
          pushFrame("base", id, 2, `Base case: fib(${n}) = ${n}`, "return n immediately");
          currentStack.pop();
          returnedSet.add(id);
          pushFrame("return", id, 2, `Return ${n} from fib(${n}): pop frame`, "");
          return n;
        }

        const aVal = runFib(treeNodes[id].children[0], n - 1);
        frameObj.vars.a = aVal;
        pushFrame("combine", id, 4, `fib(${n}) got a = ${aVal}, now call fib(${n - 2})`, "");

        const bVal = runFib(treeNodes[id].children[1], n - 2);
        frameObj.vars.b = bVal;
        pushFrame("combine", id, 5, `fib(${n}): a = ${aVal}, b = ${bVal} → return ${aVal + bVal}`, "");

        currentStack.pop();
        returnedSet.add(id);
        const ans = aVal + bVal;
        pushFrame("return", id, 5, `Return ${ans} from fib(${n}): pop frame`, "");
        return ans;
      }

      const total = runFib(0, scenario.n);

      pushFrame(
        "done",
        -1,
        -1,
        `Done: fib(${scenario.n}) = ${total}`,
        "call stack empty, execution complete",
        `fib(${scenario.n}) = ${total}`
      );
    }

    const maxX = Math.max(...treeNodes.map((t) => t.x));
    const maxDepth = Math.max(...treeNodes.map((t) => t.depth));

    return {
      nodes: treeNodes,
      maxX,
      maxDepth,
      frames,
    };
  }, [scenario]);

  const idleFrame = useMemo<SimFrame>(() => {
    return {
      phase: "idle",
      activeId: -1,
      codeLine: 0,
      stack: [],
      returned: [],
      note: `Call stack trace for ${scenario.name}`,
      sub: "watch frames push on invocation and pop on return",
      resultText: "",
    };
  }, [scenario]);

  const player = useSimulationPlayback<SimFrame>(600, idleFrame);
  const currentFrame = player.view;

  const handleRun = useCallback(() => {
    const stepDuration = Math.max(380, Math.min(700, Math.round(15000 / data.frames.length)));
    player.play(data.frames, stepDuration);
  }, [data.frames, player]);

  const P = isCompact ? MOBILE : DESKTOP;
  const phase = currentFrame.phase;
  const phaseColor =
    phase === "call" ? "#06b6d4" : phase === "base" ? "#eab308" : phase === "return" ? "#22c55e" : "#06b6d4";

  const returnedSet = new Set(currentFrame.returned);

  const getTreeX = (x: number) =>
    data.maxX === 0 ? P.treeX + P.treeW / 2 : P.treeX + 30 + (x / data.maxX) * (P.treeW - 60);
  const getTreeY = (d: number) => P.treeY + (d / (data.maxDepth || 1)) * P.treeH;

  return (
    <div className="w-full space-y-4">
      {/* Scenario Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The call stack stores active function frames. Every recursive call pushes a new frame;
            reaching the base case unwinds the stack in Last-In First-Out (LIFO) order.
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
            prefix="rcs"
            colors={[
              ["cyan", "#06b6d4"],
              ["green", "#22c55e"],
              ["yellow", "#eab308"],
            ]}
          />

          {/* Phase Badge */}
          <g>
            <rect
              x={P.vbW - 138}
              y={8}
              width={118}
              height={22}
              rx={5}
              fill="none"
              stroke={phaseColor}
              strokeWidth={1.5}
              opacity={0.95}
            />
            <text
              x={P.vbW - 79}
              y={20}
              textAnchor="middle"
              dominantBaseline="central"
              fill={phaseColor}
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 0.8 }}
            >
              {phase.toUpperCase()}
            </text>
          </g>

          {/* Top Note */}
          <text
            x={P.codeX}
            y={12}
            dominantBaseline="hanging"
            fill={phaseColor}
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={P.noteFont}
          >
            {currentFrame.note}
          </text>
          <text
            x={P.codeX}
            y={36}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={600}
            fontSize={isCompact ? 10.5 : 11.5}
          >
            {currentFrame.sub}
          </text>

          {/* Code Box */}
          <g>
            <rect
              x={P.codeX}
              y={P.codeY}
              width={P.codeW}
              height={scenario.lines.length * P.codeLH + 14}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            {currentFrame.codeLine >= 0 && (
              <g>
                <rect
                  x={P.codeX + 1}
                  y={P.codeY + 6 + currentFrame.codeLine * P.codeLH}
                  width={P.codeW - 2}
                  height={P.codeLH}
                  fill="#93C5FD"
                  opacity={0.2}
                />
                <rect
                  x={P.codeX + 1}
                  y={P.codeY + 6 + currentFrame.codeLine * P.codeLH}
                  width={3}
                  height={P.codeLH}
                  fill="#93C5FD"
                />
              </g>
            )}
            {scenario.lines.map((line, idx) => (
              <text
                key={idx}
                x={P.codeX + 10}
                y={P.codeY + 6 + idx * P.codeLH + P.codeLH / 2}
                dominantBaseline="central"
                fill={idx === currentFrame.codeLine ? "#f4f4f5" : "#71717a"}
                fontFamily="var(--font-mono, monospace)"
                fontWeight={idx === currentFrame.codeLine ? 800 : 500}
                fontSize={isCompact ? 9.5 : 11}
                xmlSpace="preserve"
              >
                {line}
              </text>
            ))}
          </g>

          {/* Tree Section Label */}
          <text
            x={P.treeX}
            y={P.treeY - 24}
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={11}
            style={{ letterSpacing: 0.8 }}
          >
            RECURSION TREE
          </text>

          {/* Tree Edges */}
          {data.nodes.map((parent) =>
            parent.children.map((childId) => {
              const child = data.nodes[childId];
              const x1 = getTreeX(parent.x);
              const y1 = getTreeY(parent.depth);
              const x2 = getTreeX(child.x);
              const y2 = getTreeY(child.depth);

              const isChildActive = childId === currentFrame.activeId;
              const isChildReturned = returnedSet.has(childId);

              return (
                <line
                  key={`${parent.id}-${childId}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isChildActive ? "#FDE047" : isChildReturned ? "#86EFAC" : "rgba(255,255,255,0.2)"}
                  strokeWidth={isChildActive || isChildReturned ? 2 : 1.25}
                />
              );
            })
          )}

          {/* Tree Nodes */}
          {data.nodes.map((node) => {
            const cx = getTreeX(node.x);
            const cy = getTreeY(node.depth);
            const isActive = node.id === currentFrame.activeId;
            const isReturned = returnedSet.has(node.id);

            let fill = "#000000";
            let stroke = "rgba(255,255,255,0.2)";
            let textColor = "#FFFFFF";
            if (isActive) {
              fill = "#FDE047";
              stroke = "#FDE047";
              textColor = "#09090b";
            } else if (isReturned) {
              fill = "#86EFAC";
              stroke = "#86EFAC";
              textColor = "#09090b";
            }

            return (
              <g key={node.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCompact ? 12 : 15}
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
                  fontSize={isCompact ? 9 : 10.5}
                >
                  {node.label.replace(/[^0-9]/g, "") || node.id}
                </text>
              </g>
            );
          })}

          {/* Stack Visualizer Section (Right) */}
          <g>
            <text
              x={P.stackX}
              y={P.codeY - 18}
              fill="#a1a1aa"
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11}
              style={{ letterSpacing: 0.8 }}
            >
              CALL STACK (DEPTH: {currentFrame.stack.length})
            </text>

            {/* Stack Frame Box Floor */}
            <line
              x1={P.stackX}
              y1={P.stackBaseY}
              x2={P.stackX + P.stackW}
              y2={P.stackBaseY}
              stroke="rgba(161,161,170,0.5)"
              strokeWidth={2}
            />

            {/* Stack Frames (Bottom up) */}
            {currentFrame.stack.map((frame, idx) => {
              const frameH = 46;
              const y = P.stackBaseY - (idx + 1) * (frameH + 6);
              const isTop = idx === currentFrame.stack.length - 1;

              return (
                <g key={frame.id}>
                  <rect
                    x={P.stackX}
                    y={y}
                    width={P.stackW}
                    height={frameH}
                    rx={7}
                    fill="#000000"
                    stroke={isTop ? "#FDE047" : "rgba(255,255,255,0.18)"}
                    strokeWidth={isTop ? 2 : 1.25}
                  />
                  {/* Top indicator badge */}
                  {isTop && (
                    <rect
                      x={P.stackX + 2}
                      y={y + 2}
                      width={4}
                      height={frameH - 4}
                      rx={2}
                      fill="#FDE047"
                    />
                  )}
                  <text
                    x={P.stackX + 14}
                    y={y + 16}
                    fill="#FFFFFF"
                    fontWeight={800}
                    fontSize={11.5}
                    fontFamily="'Inter', -apple-system, sans-serif"
                  >
                    {frame.name}
                  </text>
                  <text
                    x={P.stackX + 14}
                    y={y + 34}
                    fill="#a1a1aa"
                    fontSize={10}
                    fontFamily="'Inter', -apple-system, sans-serif"
                  >
                    vars: {Object.entries(frame.vars).map(([k, v]) => `${k}=${v}`).join(", ")}
                  </text>
                  {isTop && (
                    <text
                      x={P.stackX + P.stackW - 12}
                      y={y + 16}
                      textAnchor="end"
                      fill="#FDE047"
                      fontWeight={800}
                      fontSize={9.5}
                      fontFamily="'Inter', -apple-system, sans-serif"
                    >
                      TOP
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Bottom Completion Result Message */}
          {currentFrame.resultText && (
            <text
              x={P.vbW / 2}
              y={P.resultY}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#86EFAC"
              fontSize={16}
              fontWeight={800}
              fontFamily="'Inter', -apple-system, sans-serif"
              style={{ letterSpacing: 0.4 }}
            >
              {currentFrame.resultText}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
