"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

interface RecurrenceScenario {
  id: string;
  name: string;
  a: number;
  b: number;
  f: (n: number) => number;
  fLabel: string;
  fExpr: string;
  closedForm: string;
  masterCase: string;
  caseWhy: string;
  sumNote: string;
  color: string;
}

const SCENARIOS: RecurrenceScenario[] = [
  {
    id: "merge-sort",
    name: "Merge Sort",
    a: 2,
    b: 2,
    f: (n) => n,
    fLabel: "Θ(n)",
    fExpr: "n",
    closedForm: "Θ(n log n)",
    masterCase: "Master case 2",
    caseWhy: "every level costs the same: f(n) × log n levels",
    sumNote: "Every level does the same 16 work: equal bars",
    color: "#86EFAC",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    a: 1,
    b: 2,
    f: () => 1,
    fLabel: "Θ(1)",
    fExpr: "1",
    closedForm: "Θ(log n)",
    masterCase: "Master case 2",
    caseWhy: "constant work per level, total = depth log n",
    sumNote: "Constant work per level: the depth is the whole cost",
    color: "#93C5FD",
  },
  {
    id: "karatsuba",
    name: "Karatsuba",
    a: 3,
    b: 2,
    f: (n) => n,
    fLabel: "Θ(n)",
    fExpr: "n",
    closedForm: "Θ(n^1.585)",
    masterCase: "Master case 1",
    caseWhy: "nodes triple, size only halves: leaves dominate",
    sumNote: "Each level does 1.5× the work above it: bars keep growing",
    color: "#FDE047",
  },
  {
    id: "strassen",
    name: "Strassen",
    a: 7,
    b: 2,
    f: (n) => n * n,
    fLabel: "Θ(n²)",
    fExpr: "n²",
    closedForm: "Θ(n^2.807)",
    masterCase: "Master case 1",
    caseWhy: "7 subproblems per split outpace the shrinking work",
    sumNote: "Each level does 1.75× the work above it: leaves dominate",
    color: "#FDBA74",
  },
];

type Phase = "idle" | "expand" | "work" | "sum" | "done";

interface SimFrame {
  phase: Phase;
  level: number;
  revealed: number;
  worked: number;
  note: string;
  sub: string;
  hi: "none" | "split" | "work";
  total: number;
  showResult: boolean;
}

const DESKTOP = {
  vbW: 960,
  vbH: 500,
  noteFont: 14,
  panelX: 28,
  panelY: 96,
  panelW: 216,
  labelX: 270,
  dotsX: 360,
  dotsW: 320,
  rowY0: 120,
  rowStep: 66,
  barX: 700,
  barW: 232,
  colLabelY: 78,
  totalY: 430,
  resultY: 472,
};

const MOBILE = {
  vbW: 440,
  vbH: 524,
  noteFont: 12,
  panelX: 20,
  panelY: 74,
  panelW: 400,
  labelX: 20,
  dotsX: 92,
  dotsW: 176,
  rowY0: 170,
  rowStep: 58,
  barX: 280,
  barW: 140,
  colLabelY: 142,
  totalY: 466,
  resultY: 502,
};

function formatNum(n: number): string {
  if (n < 1000) return Math.round(n).toString();
  if (n < 1000000) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1000000).toFixed(1)}M`;
}

export function RecurrenceRelationSimulation() {
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
    const N = 16;
    const a = scenario.a;
    const b = scenario.b;
    const depthLevels = Math.round(Math.log(N) / Math.log(b));

    const levels = [];
    let currentSize = N;
    let nodeCount = 1;
    let maxWork = 0;

    for (let d = 0; d <= depthLevels; d++) {
      const nodeCost = scenario.f(currentSize);
      const levelTotalWork = nodeCount * nodeCost;
      maxWork = Math.max(maxWork, levelTotalWork);
      levels.push({
        depth: d,
        count: nodeCount,
        size: currentSize,
        nodeCost,
        work: levelTotalWork,
      });
      currentSize = Math.max(1, Math.round(currentSize / b));
      nodeCount *= a;
    }

    const frames: SimFrame[] = [];
    frames.push({
      phase: "idle",
      level: -1,
      revealed: 0,
      worked: 0,
      note: `Unroll ${scenario.name}: T(n) = ${scenario.a === 1 ? `T(n/${scenario.b})` : `${scenario.a}T(n/${scenario.b})`} + ${scenario.fLabel}`,
      sub: "expand the recurrence tree level by level and total the work across all levels",
      hi: "none",
      total: 0,
      showResult: false,
    });

    // Expand levels
    for (let d = 0; d < levels.length; d++) {
      const lvl = levels[d];
      frames.push({
        phase: "expand",
        level: d,
        revealed: d + 1,
        worked: d,
        note: `Level ${d}: ${lvl.count} subproblem${lvl.count > 1 ? "s" : ""} of size n/${b}^${d} = ${lvl.size}`,
        sub: d === 0 ? "root problem" : `each node splits into a=${a} children`,
        hi: "split",
        total: 0,
        showResult: false,
      });

      frames.push({
        phase: "work",
        level: d,
        revealed: d + 1,
        worked: d + 1,
        note: `Level ${d} work: ${lvl.count} × f(${lvl.size}) = ${lvl.count} × ${lvl.nodeCost} = ${lvl.work}`,
        sub: scenario.sumNote,
        hi: "work",
        total: 0,
        showResult: false,
      });
    }

    // Sum levels
    let cumulative = 0;
    for (let d = 0; d < levels.length; d++) {
      cumulative += levels[d].work;
      frames.push({
        phase: "sum",
        level: d,
        revealed: levels.length,
        worked: levels.length,
        note: `Summing up levels: total through level ${d} = ${cumulative}`,
        sub: `${scenario.masterCase}: ${scenario.caseWhy}`,
        hi: "none",
        total: cumulative,
        showResult: false,
      });
    }

    frames.push({
      phase: "done",
      level: levels.length - 1,
      revealed: levels.length,
      worked: levels.length,
      note: `Total work: ${cumulative} across ${levels.length} levels`,
      sub: `Closed form: ${scenario.closedForm} · ${scenario.caseWhy}`,
      hi: "none",
      total: cumulative,
      showResult: true,
    });

    return {
      scenario,
      levels,
      maxWork,
      frames,
    };
  }, [scenario]);

  const idleFrame = useMemo<SimFrame>(() => {
    return {
      phase: "idle",
      level: -1,
      revealed: 0,
      worked: 0,
      note: `Recurrence Tree for ${scenario.name}: T(n) = ${scenario.a === 1 ? `T(n/${scenario.b})` : `${scenario.a}T(n/${scenario.b})`} + ${scenario.fLabel}`,
      sub: "expand the recurrence tree level by level and total the work across all levels",
      hi: "none",
      total: 0,
      showResult: false,
    };
  }, [scenario]);

  const player = useSimulationPlayback<SimFrame>(650, idleFrame);
  const currentFrame = player.view;

  const handleRun = useCallback(() => {
    const stepDuration = Math.max(400, Math.min(750, Math.round(15000 / data.frames.length)));
    player.play(data.frames, stepDuration);
  }, [data.frames, player]);

  const P = isCompact ? MOBILE : DESKTOP;
  const levels = data.levels;
  const maxWork = Math.max(1, data.maxWork);

  return (
    <div className="w-full space-y-4">
      {/* Scenario Buttons */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A recurrence relation expresses runtime in terms of smaller subproblems. The
            recurrence tree visualizes the work at each level to determine closed-form complexity.
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
            prefix="rec"
            colors={[
              ["cyan", "#06b6d4"],
              ["green", "#22c55e"],
              ["yellow", "#ffa94d"],
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
              stroke={scenario.color}
              strokeWidth={1.5}
              opacity={0.95}
            />
            <text
              x={P.vbW - 79}
              y={20}
              textAnchor="middle"
              dominantBaseline="central"
              fill={scenario.color}
              fontFamily="var(--font-mono, monospace)"
              fontWeight={800}
              fontSize={11.5}
              style={{ letterSpacing: 0.8 }}
            >
              {currentFrame.phase.toUpperCase()}
            </text>
          </g>

          {/* Top Note */}
          <text
            x={P.panelX}
            y={12}
            dominantBaseline="hanging"
            fill={scenario.color}
            fontFamily="var(--font-mono, monospace)"
            fontWeight={800}
            fontSize={P.noteFont}
          >
            {currentFrame.note}
          </text>
          <text
            x={P.panelX}
            y={36}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily="var(--font-mono, monospace)"
            fontWeight={600}
            fontSize={isCompact ? 10.5 : 11.5}
          >
            {currentFrame.sub}
          </text>

          {/* Recurrence Equation Panel */}
          <g>
            <rect
              x={P.panelX}
              y={P.panelY}
              width={P.panelW}
              height={140}
              rx={8}
              fill="#18181b"
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={1.25}
            />
            <text
              x={P.panelX + 14}
              y={P.panelY + 24}
              fill="#f4f4f5"
              fontWeight={800}
              fontSize={13}
              fontFamily="var(--font-mono, monospace)"
            >
              T(n) = {scenario.a === 1 ? `T(n/${scenario.b})` : `${scenario.a}T(n/${scenario.b})`} + {scenario.fLabel}
            </text>
            <text
              x={P.panelX + 14}
              y={P.panelY + 54}
              fill="#a1a1aa"
              fontSize={10.5}
              fontFamily="var(--font-mono, monospace)"
            >
              a = {scenario.a} · branches per split
            </text>
            <text
              x={P.panelX + 14}
              y={P.panelY + 76}
              fill="#a1a1aa"
              fontSize={10.5}
              fontFamily="var(--font-mono, monospace)"
            >
              b = {scenario.b} · size shrinks ÷{scenario.b}
            </text>
            <text
              x={P.panelX + 14}
              y={P.panelY + 98}
              fill="#a1a1aa"
              fontSize={10.5}
              fontFamily="var(--font-mono, monospace)"
            >
              f(n) = {scenario.fExpr} · cost per node
            </text>
            <text
              x={P.panelX + 14}
              y={P.panelY + 120}
              fill={scenario.color}
              fontWeight={800}
              fontSize={11}
              fontFamily="var(--font-mono, monospace)"
            >
              Closed Form: {scenario.closedForm}
            </text>
          </g>

          {/* Level Rows */}
          {levels.map((lvl, d) => {
            const isRevealed = d < currentFrame.revealed;
            const isWorked = d < currentFrame.worked;
            const isCurrent = d === currentFrame.level;
            const y = P.rowY0 + d * P.rowStep;

            return (
              <g key={d} opacity={isRevealed ? 1 : 0.2}>
                {/* Level Tag */}
                <text
                  x={P.labelX}
                  y={y + 12}
                  fill={isCurrent ? scenario.color : "#a1a1aa"}
                  fontWeight={800}
                  fontSize={11}
                  fontFamily="var(--font-mono, monospace)"
                >
                  L{d}: {lvl.count} node{lvl.count > 1 ? "s" : ""}
                </text>

                {/* Nodes representation (dots / pill) */}
                <g>
                  {lvl.count <= 16 ? (
                    Array.from({ length: lvl.count }).map((_, idx) => {
                      const spacing = P.dotsW / lvl.count;
                      const cx = P.dotsX + (idx + 0.5) * spacing;
                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={y + 12}
                          r={Math.min(7, Math.max(3, 16 / lvl.count))}
                          fill={isCurrent ? scenario.color : "#000000"}
                          stroke={isCurrent ? scenario.color : "rgba(255,255,255,0.2)"}
                          strokeWidth={1.5}
                        />
                      );
                    })
                  ) : (
                    <rect
                      x={P.dotsX}
                      y={y + 4}
                      width={P.dotsW}
                      height={16}
                      rx={8}
                      fill={isCurrent ? scenario.color : "#000000"}
                      stroke={isCurrent ? scenario.color : "rgba(255,255,255,0.2)"}
                      strokeWidth={1}
                    />
                  )}
                </g>

                {/* Work Bar per Level */}
                {isWorked && (
                  <g>
                    <rect
                      x={P.barX}
                      y={y}
                      width={(lvl.work / maxWork) * P.barW}
                      height={24}
                      rx={6}
                      fill={scenario.color}
                    />
                    <text
                      x={P.barX + (lvl.work / maxWork) * P.barW + 8}
                      y={y + 12}
                      dominantBaseline="central"
                      fill="#FFFFFF"
                      fontWeight={800}
                      fontSize={11}
                      fontFamily="'Inter', -apple-system, sans-serif"
                    >
                      {formatNum(lvl.work)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Total Cumulative Sum Indicator */}
          {currentFrame.total > 0 && (
            <g>
              <line
                x1={P.barX}
                y1={P.totalY - 14}
                x2={P.barX + P.barW + 40}
                y2={P.totalY - 14}
                stroke="rgba(161,161,170,0.4)"
                strokeDasharray="4 4"
              />
              <text
                x={P.barX}
                y={P.totalY + 4}
                fill="#f4f4f5"
                fontWeight={800}
                fontSize={13}
                fontFamily="var(--font-mono, monospace)"
              >
                TOTAL WORK = <tspan fill={scenario.color}>{formatNum(currentFrame.total)}</tspan>
              </text>
            </g>
          )}

          {/* Bottom Completion Text */}
          {currentFrame.showResult && (
            <g filter="url(#rec-glow-green)">
              <text
                x={P.vbW / 2}
                y={P.resultY}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#22c55e"
                fontSize={15}
                fontWeight={800}
                fontFamily="var(--font-mono, monospace)"
                style={{ letterSpacing: 0.5 }}
              >
                {scenario.masterCase}: {scenario.closedForm}
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
