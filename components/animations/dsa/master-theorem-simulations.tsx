"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

const FONT_MONO = "'JetBrains Mono', 'Fira Code', monospace";
const COLOR_CYAN = "#00ceff";
const COLOR_GREEN = "#69db7c";
const COLOR_ORANGE = "#ffa94d";
const COLOR_RED = "#ff8787";
const COLOR_TEAL = "#38d9a9";

/* =========================================================================
   1. LEAF COUNT IDENTITY (a^(log_b n) = n^(log_b a))
   ========================================================================= */

const SUPERS = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
const SUBS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
const toSuper = (e: number | string) =>
  String(e)
    .split("")
    .map((c) => SUPERS[Number(c)] ?? c)
    .join("");
const toSub = (e: number | string) =>
  String(e)
    .split("")
    .map((c) => SUBS[Number(c)] ?? c)
    .join("");

function powInt(base: number, exp: number) {
  let res = 1;
  for (let i = 0; i < exp; i++) res *= base;
  return res;
}

function logRound(val: number, base: number) {
  const n = Math.log(val) / Math.log(base);
  const rounded = Math.round(n);
  return Math.abs(n - rounded) < 1e-9 ? rounded : n;
}

function formatPow(base: number, exp: number) {
  return Number.isInteger(exp) && exp >= 0 && exp <= 9
    ? `${base}${toSuper(exp)}`
    : `${base}^${exp.toFixed(3)}`;
}

interface LeafScenario {
  id: string;
  name: string;
  a: number;
  b: number;
  n: number;
}

const LEAF_SCENARIOS: LeafScenario[] = [
  { id: "s1", name: "a=2, b=2, n=16", a: 2, b: 2, n: 16 },
  { id: "s2", name: "a=3, b=2, n=16", a: 3, b: 2, n: 16 },
  { id: "s3", name: "a=4, b=2, n=16", a: 4, b: 2, n: 16 },
  { id: "s4", name: "a=9, b=3, n=27", a: 9, b: 3, n: 27 },
];

export function LeafCountIdentitySimulation() {
  const [activeId, setActiveId] = useState(LEAF_SCENARIOS[0].id);
  const scenario = LEAF_SCENARIOS.find((s) => s.id === activeId) ?? LEAF_SCENARIOS[0];

  const derived = useMemo(() => {
    const depth = logRound(scenario.n, scenario.b);
    const leaves = powInt(scenario.a, depth);
    const logba = logRound(scenario.a, scenario.b);
    return {
      a: scenario.a,
      b: scenario.b,
      n: scenario.n,
      depth,
      leaves,
      logba,
      expr1: `${scenario.a}^(log${toSub(scenario.b)} ${scenario.n})`,
      expr2: `${scenario.n}^(log${toSub(scenario.b)} ${scenario.a})`,
      seg2row1: `= ${formatPow(scenario.a, depth)}`,
      seg2row2: `= ${formatPow(scenario.n, logba)}`,
      seg3: `= ${leaves}`,
    };
  }, [scenario]);

  const phases = useMemo(() => {
    const { a, b, n, depth, leaves, logba } = derived;
    const p = [];
    for (let l = 0; l <= depth; l++) {
      const count = powInt(a, l);
      const subSize = n / powInt(b, l);
      const nar =
        l === 0
          ? `Level 0: 1 node, the whole input of size ${n}`
          : l < depth
          ? `Level ${l}: ${count} nodes, each of size ${subSize}`
          : `Level ${depth}: the bottom row, ${count} nodes of size 1`;
      p.push({
        newest: l,
        revealed: l,
        counter: count,
        row1: 1,
        row2: l >= 1 ? 1 : 0,
        counting: false,
        narration: nar,
        status: `Level ${l} of ${depth}, ${count} node${count === 1 ? "" : "s"}`,
      });
    }
    p.push({
      newest: -1,
      revealed: depth,
      counter: leaves,
      row1: 3,
      row2: 1,
      counting: true,
      narration: `The bottom level holds ${leaves} leaves`,
      status: `Counting leaves: ${a}${toSuper(depth)} = ${leaves}`,
    });
    p.push({
      newest: -1,
      revealed: depth,
      counter: leaves,
      row1: 3,
      row2: 3,
      counting: true,
      narration: `${formatPow(n, logba)} lands on the same ${leaves}`,
      status: "Same number, counted from the other side",
    });
    p.push({
      newest: -1,
      revealed: depth,
      counter: leaves,
      row1: 3,
      row2: 3,
      counting: true,
      narration: "Both expressions count the very same bottom row",
      status: `Done: watershed = ${leaves} leaves`,
    });
    return p;
  }, [derived]);

  const treeRows = useMemo(() => {
    const { a, b, n, depth } = derived;
    const dy = depth > 0 ? 220 / depth : 0;
    const rows = [];
    for (let l = 0; l <= depth; l++) {
      const count = powInt(a, l);
      const drawn = Math.min(count, 24);
      const gap = drawn > 12 ? 3 : drawn > 6 ? 5 : 8;
      const w = Math.min(108, (438 - (drawn - 1) * gap) / drawn);
      const totalW = drawn * w + (drawn - 1) * gap;
      rows.push({
        level: l,
        count,
        drawn,
        capped: count > 24,
        gap,
        w,
        x0: 102 + (438 - totalW) / 2,
        y: 62 + l * dy,
        size: n / powInt(b, l),
      });
    }
    return rows;
  }, [derived]);

  const idleFrame = useMemo(
    () => ({
      newest: -1,
      revealed: -1,
      counter: 0,
      row1: 0,
      row2: 0,
      counting: false,
      narration: "Press Play: build the tree, then count the bottom row",
      status: "Idle, press Play to begin",
    }),
    []
  );

  const player = useSimulationPlayback(800, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(phases, 800);
  }, [phases, player]);

  const isDone = player.atEnd;
  const revealed = curr ? curr.revealed : -1;
  const newest = curr ? curr.newest : -1;
  const counting = !!curr && curr.counting;
  const row1 = curr ? curr.row1 : 0;
  const row2 = curr ? curr.row2 : 0;
  const counterVal = curr ? curr.counter : 0;
  const narration = curr ? curr.narration : "Press Play: build the tree, then count the bottom row";

  const len1 = 0.6 * Math.max(derived.expr1.length, derived.expr2.length) * 15;
  const len2 = 0.6 * Math.max(derived.seg2row1.length, derived.seg2row2.length) * 15;
  const xCol2 = 592 + len1 + 12;
  const xCol3 = xCol2 + len2 + 12;

  return (
    <div className="w-full space-y-4">
      {/* Top Header & Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The watershed is just the leaf count, counted two different ways.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {LEAF_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                activeId === s.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 400"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >

          {/* Top Banner */}
          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill={COLOR_TEAL}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            {narration}
          </text>
          <rect
            x={782}
            y={10}
            width={150}
            height={22}
            rx={5}
            fill="none"
            stroke={COLOR_TEAL}
            strokeWidth={1.5}
          />
          <text
            x={857}
            y={21}
            textAnchor="middle"
            dominantBaseline="central"
            fill={COLOR_TEAL}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 0.8 }}
          >
            n^(log_b a)
          </text>

          {/* Column 1 Title */}
          <text
            x={28}
            y={40}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            RECURSION TREE
          </text>

          {/* Tree Edges */}
          {treeRows.map((row) => {
            if (row.level === 0 || row.level > revealed || row.capped) return null;
            const parentRow = treeRows[row.level - 1];
            const isNew = row.level === newest;
            return (
              <g key={`edges-${row.level}`}>
                {Array.from({ length: row.drawn }, (_, i) => {
                  const parentIdx = Math.floor(i / derived.a);
                  const x1 = parentRow.x0 + parentIdx * (parentRow.w + parentRow.gap) + parentRow.w / 2;
                  const x2 = row.x0 + i * (row.w + row.gap) + row.w / 2;
                  return (
                    <line
                      key={i}
                      x1={x1}
                      y1={parentRow.y + 24}
                      x2={x2}
                      y2={row.y}
                      stroke={isNew ? COLOR_CYAN : "rgba(161,161,170,0.4)"}
                      strokeWidth={isNew ? 1.8 : 1.4}
                      strokeOpacity={isNew ? 0.9 : 1}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            );
          })}

          {/* Tree Nodes */}
          {treeRows.map((row) => {
            if (row.level > revealed) return null;
            const isLeafRow = row.level === derived.depth;
            const isNew = row.level === newest;

            let fill = "rgba(56,217,169,0.16)";
            let stroke = "rgba(56,217,169,0.65)";
            let textColor = "#f4f4f5";

            if (isLeafRow) {
              fill = COLOR_GREEN;
              stroke = COLOR_GREEN;
              textColor = "#18181b";
            } else if (isNew) {
              fill = COLOR_CYAN;
              stroke = COLOR_CYAN;
              textColor = "#18181b";
            }

            const showText = row.w >= 26;
            const sideLabel =
              isLeafRow && counting
                ? `${row.count} leaves`
                : row.capped
                ? `${row.count} nodes`
                : null;
            const sideColor = isLeafRow ? COLOR_GREEN : isNew ? COLOR_CYAN : "#a1a1aa";

            return (
              <g key={`row-${row.level}`}>
                {sideLabel && (
                  <text
                    x={28}
                    y={row.y + 12}
                    dominantBaseline="central"
                    fill={sideColor}
                    fontFamily={FONT_MONO}
                    fontWeight={800}
                    fontSize={11.5}
                  >
                    {sideLabel}
                  </text>
                )}
                {Array.from({ length: row.drawn }, (_, i) => {
                  const x = row.x0 + i * (row.w + row.gap);
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={row.y}
                        width={row.w}
                        height={24}
                        rx={5}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={(isLeafRow && counting) || isNew ? 2.4 : 1.4}
                      />
                      {showText && (
                        <text
                          x={x + row.w / 2}
                          y={row.y + 12}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={textColor}
                          fontFamily={FONT_MONO}
                          fontWeight={800}
                          fontSize={row.w >= 40 ? 13 : 11.5}
                        >
                          {row.size}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Right Panel: The Identity */}
          <text
            x={572}
            y={40}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            THE IDENTITY
          </text>
          <rect
            x={572}
            y={58}
            width={360}
            height={182}
            rx={10}
            fill="#1f1f22"
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.4}
          />

          {/* Identity Row 1: branching a raised to depth */}
          {row1 >= 1 && (
            <>
              <text
                x={592}
                y={76}
                dominantBaseline="hanging"
                fill="#a1a1aa"
                fontFamily={FONT_MONO}
                fontWeight={700}
                fontSize={11.5}
              >
                branching a, raised to the depth
              </text>
              <text
                x={592}
                y={104}
                dominantBaseline="central"
                fill={COLOR_TEAL}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={15}
              >
                {derived.expr1}
              </text>
            </>
          )}
          {row1 >= 2 && (
            <text
              x={xCol2}
              y={104}
              dominantBaseline="central"
              fill="#f4f4f5"
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={15}
            >
              {derived.seg2row1}
            </text>
          )}
          {row1 >= 3 && (
            <text
              x={xCol3}
              y={104}
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={18}
            >
              {derived.seg3}
            </text>
          )}

          {/* Identity Row 2: watershed */}
          {row2 >= 1 && (
            <>
              <text
                x={592}
                y={132}
                dominantBaseline="hanging"
                fill="#a1a1aa"
                fontFamily={FONT_MONO}
                fontWeight={700}
                fontSize={11.5}
              >
                the Master Theorem watershed
              </text>
              <text
                x={592}
                y={160}
                dominantBaseline="central"
                fill={COLOR_TEAL}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={15}
              >
                {derived.expr2}
              </text>
            </>
          )}
          {row2 >= 2 && (
            <text
              x={xCol2}
              y={160}
              dominantBaseline="central"
              fill="#f4f4f5"
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={15}
            >
              {derived.seg2row2}
            </text>
          )}
          {row2 >= 3 && (
            <text
              x={xCol3}
              y={160}
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={18}
            >
              {derived.seg3}
            </text>
          )}

          {/* Equality line */}
          {row1 >= 3 && row2 >= 3 && (
            <>
              <line
                x1={592}
                y1={192}
                x2={912}
                y2={192}
                stroke={COLOR_GREEN}
                strokeWidth={1.4}
                strokeOpacity={0.7}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={592}
                y={206}
                dominantBaseline="hanging"
                fill={COLOR_GREEN}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={12.5}
              >
                both count the same leaves
              </text>
            </>
          )}

          {/* Bottom Counters */}
          <text
            x={28}
            y={348}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            LEAVES
          </text>
          <text
            x={28}
            y={366}
            dominantBaseline="hanging"
            fill={counting ? COLOR_GREEN : "#f4f4f5"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {counterVal}
          </text>

          {isDone ? (
            <text
              x={480}
              y={360}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={16}
            >
              {`${formatPow(derived.a, derived.depth)} = ${formatPow(
                derived.n,
                derived.logba
              )} = ${derived.leaves} leaves → watershed n^(log_b a)`}
            </text>
          ) : (
            <text
              x={140}
              y={370}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={12.5}
            >
              count the bottom row two different ways
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   2. MASTER THEOREM: THE WATERSHED
   ========================================================================= */

interface WatershedScenario {
  id: string;
  name: string;
  a: number;
  b: number;
  fExpr: string;
  fPow: number;
  watershedPow: number;
  result: string;
}

const WATERSHED_SCENARIOS: WatershedScenario[] = [
  { id: "ms", name: "2T(n/2)+n", a: 2, b: 2, fExpr: "n", fPow: 1, watershedPow: 1, result: "Θ(n log n)" },
  { id: "bs", name: "T(n/2)+1", a: 1, b: 2, fExpr: "1", fPow: 0, watershedPow: 0, result: "Θ(log n)" },
  { id: "c1", name: "8T(n/2)+n²", a: 8, b: 2, fExpr: "n²", fPow: 2, watershedPow: 3, result: "Θ(n³)" },
  { id: "c3", name: "2T(n/2)+n²", a: 2, b: 2, fExpr: "n²", fPow: 2, watershedPow: 1, result: "Θ(n²)" },
  { id: "str", name: "7T(n/2)+n²", a: 7, b: 2, fExpr: "n²", fPow: 2, watershedPow: 2.807, result: "Θ(n^2.807)" },
  { id: "nine", name: "9T(n/3)+n", a: 9, b: 3, fExpr: "n", fPow: 1, watershedPow: 2, result: "Θ(n²)" },
];

const WATERSHED_TICKS = [1, 4, 16, 64, 256, 1024];

export function MasterTheoremWatershedSimulation() {
  const [activeId, setActiveId] = useState(WATERSHED_SCENARIOS[2].id);
  const scenario = WATERSHED_SCENARIOS.find((s) => s.id === activeId) ?? WATERSHED_SCENARIOS[2];

  const analysis = useMemo(() => {
    const { a, b, fExpr, fPow, result } = scenario;
    const r = Math.log(a) / Math.log(b);
    const rRound = Math.round(r);
    const isInt = Math.abs(r - rRound) < 1e-9 && rRound >= 0 && rRound <= 3;
    const wsExpr = isInt ? `n${SUPERS[rRound]}` : `n^${(Math.round(1000 * r) / 1000).toFixed(3)}`;
    const subB = SUBS[b] ?? `_${b}`;
    const caseNo = fPow < r - 0.001 ? 1 : fPow > r + 0.001 ? 3 : 2;
    const coincide = caseNo === 2;

    const cmpText =
      caseNo === 1
        ? `${fExpr} grows slower than ${wsExpr}`
        : caseNo === 3
        ? `${fExpr} grows faster than ${wsExpr}`
        : `${fExpr} matches ${wsExpr}`;

    const narCmp =
      caseNo === 1
        ? `f(n) = ${fExpr} is polynomially smaller than ${wsExpr}, so the leaves dominate`
        : caseNo === 3
        ? `f(n) = ${fExpr} is polynomially larger than ${wsExpr}, so the root dominates`
        : `f(n) = ${fExpr} matches the watershed ${wsExpr}, so every level costs the same`;

    const banner =
      caseNo === 1
        ? `Case 1: f(n) is polynomially smaller → ${result}`
        : caseNo === 3
        ? `Case 3: f(n) is polynomially larger → ${result}`
        : `Case 2: f(n) matches the watershed → ${result}`;

    const phases = [
      {
        line: `a = ${a}, b = ${b}`,
        narration: `${a} subproblem${a === 1 ? "" : "s"} of size n/${b}, plus the combine work`,
        status: "Step 1 of 7, reading a and b",
      },
      {
        line: `log${subB} ${a} = ${isInt ? rRound : (Math.round(1000 * r) / 1000).toFixed(3)}`,
        narration: `log${subB} ${a} = ${isInt ? rRound : (Math.round(1000 * r) / 1000).toFixed(3)}, so the watershed is ${wsExpr}`,
        status: `Step 2 of 7, computing log${subB} ${a}`,
      },
      {
        line: `watershed = ${wsExpr}`,
        narration: `${wsExpr} is the total work sitting at the leaves`,
        status: `Step 3 of 7, drawing the watershed ${wsExpr}`,
      },
      {
        line: `f(n) = ${fExpr}`,
        narration: `Outside the recursive calls, each level combines in f(n) = ${fExpr}`,
        status: `Step 4 of 7, reading f(n) = ${fExpr}`,
      },
      {
        line: `compare ${fExpr} vs ${wsExpr}`,
        narration: `Plot f(n) = ${fExpr} on the same log-log axes`,
        status: `Step 5 of 7, drawing f(n) = ${fExpr}`,
      },
      {
        line: cmpText,
        narration: narCmp,
        status: "Step 6 of 7, comparing the two curves",
      },
      {
        line: caseNo === 1 ? "Case 1: leaves dominate" : caseNo === 3 ? "Case 3: root dominates" : "Case 2: levels tie",
        narration: `Case ${caseNo} applies, so T(n) = ${result}`,
        status: `Step 7 of 7, Case ${caseNo}, ${result}`,
      },
    ];

    return { wsPow: r, wsExpr, caseNo, coincide, banner, phases };
  }, [scenario]);

  const plotData = useMemo(() => {
    const fP = scenario.fPow;
    const maxP = Math.max(analysis.wsPow, fP);
    const maxY = Math.max(10 * maxP, 3);
    const minY = maxP < 1e-9 ? -3 : -(0.08 * maxY);

    const xAt = (logN: number) => 356 + (logN / 10) * 502;
    const yAt = (val: number) => 296 - ((val - minY) / (maxY - minY)) * 210;

    const buildPoints = (slope: number) => {
      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const xVal = (i / 60) * 10;
        pts.push({ x: xAt(xVal), y: yAt(slope * xVal) });
      }
      return pts;
    };

    const wsPts = buildPoints(analysis.wsPow);
    const fPts = buildPoints(fP);
    const formatLine = (pts: { x: number; y: number }[]) =>
      pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

    return {
      xAt,
      wsLine: formatLine(wsPts),
      fLine: formatLine(fPts),
      gap: formatLine(wsPts.concat([...fPts].reverse())),
      wsEndY: wsPts[wsPts.length - 1].y,
      fEndY: fPts[fPts.length - 1].y,
    };
  }, [scenario, analysis.wsPow]);

  const idleFrame = useMemo(
    () => ({
      line: "",
      narration: "Press Play, compare f(n) against the watershed",
      status: "Idle, press Play to begin",
      stepIndex: -1,
    }),
    []
  );

  const player = useSimulationPlayback(900, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(
      analysis.phases.map((p, idx) => ({ ...p, stepIndex: idx })),
      900
    );
  }, [analysis.phases, player]);

  const stepIndex = curr.stepIndex ?? -1;
  const isDone = player.atEnd;

  const showWsLine = stepIndex >= 2;
  const showFLine = stepIndex >= 4;
  const showGap = stepIndex >= 5 && !analysis.coincide;
  const gapColor = analysis.wsPow > scenario.fPow ? COLOR_TEAL : COLOR_ORANGE;
  const hasA = stepIndex >= 1;
  const hasF = stepIndex >= 3;
  const aPrefix = scenario.a === 1 ? "" : String(scenario.a);
  const narration = curr ? curr.narration : "Press Play, compare f(n) against the watershed";
  const badgeText = stepIndex >= 6 ? `Case ${analysis.caseNo}` : "watershed";
  const badgeColor = stepIndex >= 6 ? COLOR_GREEN : COLOR_TEAL;

  return (
    <div className="w-full space-y-4">
      {/* Scenario Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Compare the combine work against the watershed and the case falls out.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {WATERSHED_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                activeId === s.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 400"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >

          {/* Top Banner */}
          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill={COLOR_CYAN}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            {narration}
          </text>
          <rect
            x={782}
            y={10}
            width={150}
            height={22}
            rx={5}
            fill="none"
            stroke={badgeColor}
            strokeWidth={1.5}
          />
          <text
            x={857}
            y={21}
            textAnchor="middle"
            dominantBaseline="central"
            fill={badgeColor}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 0.8 }}
          >
            {badgeText}
          </text>

          {/* Left Column: Derivation */}
          <text
            x={28}
            y={54}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            DERIVATION
          </text>
          <text
            x={28}
            y={72}
            dominantBaseline="hanging"
            fill="#f4f4f5"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            {`T(n) = ${aPrefix}T(n/${scenario.b}) + ${scenario.fExpr}`}
          </text>
          <line
            x1={28}
            y1={94}
            x2={300}
            y2={94}
            stroke="rgba(161,161,170,0.18)"
            strokeWidth={1.2}
          />

          {analysis.phases.map((p, idx) => {
            if (idx > stepIndex) return null;
            const isLatest = idx === stepIndex;
            const y = 106 + 26 * idx;
            const isLast = idx === analysis.phases.length - 1;
            return (
              <g key={idx}>
                {isLatest && (
                  <rect x={16} y={y} width={3} height={15} rx={1.5} fill={COLOR_CYAN} />
                )}
                <text
                  x={28}
                  y={y}
                  dominantBaseline="hanging"
                  fill={isLatest ? COLOR_CYAN : isLast ? COLOR_GREEN : "#f4f4f5"}
                  fontFamily={FONT_MONO}
                  fontWeight={isLatest || isLast ? 800 : 600}
                  fontSize={13.5}
                >
                  {p.line}
                </text>
              </g>
            );
          })}

          {/* Right Column: Log-Log Plot */}
          <text
            x={356}
            y={54}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            LOG-LOG PLOT
          </text>

          {WATERSHED_TICKS.map((tick) => {
            const x = plotData.xAt(Math.log2(tick));
            return (
              <line
                key={`g${tick}`}
                x1={x}
                y1={86}
                x2={x}
                y2={296}
                stroke="rgba(161,161,170,0.18)"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          <line
            x1={356}
            y1={86}
            x2={356}
            y2={296}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1={356}
            y1={296}
            x2={858}
            y2={296}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />

          {showGap && (
            <polygon points={plotData.gap} fill={gapColor} fillOpacity={0.12} />
          )}

          {showWsLine && (
            <>
              <polyline
                points={plotData.wsLine}
                fill="none"
                stroke={COLOR_TEAL}
                strokeWidth={2.4}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={858} cy={plotData.wsEndY} r={3.4} fill={COLOR_TEAL} />
            </>
          )}

          {showFLine && (
            <>
              <polyline
                points={plotData.fLine}
                fill="none"
                stroke={COLOR_ORANGE}
                strokeWidth={analysis.coincide ? 2.6 : 2.4}
                strokeDasharray={analysis.coincide ? "8 6" : undefined}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {!analysis.coincide && (
                <circle cx={858} cy={plotData.fEndY} r={3.4} fill={COLOR_ORANGE} />
              )}
            </>
          )}

          {showWsLine && !(showFLine && analysis.coincide) && (
            <text
              x={866}
              y={plotData.wsEndY}
              dominantBaseline="central"
              fill={COLOR_TEAL}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={12}
            >
              {analysis.wsExpr}
            </text>
          )}
          {showFLine && !analysis.coincide && (
            <text
              x={866}
              y={plotData.fEndY}
              dominantBaseline="central"
              fill={COLOR_ORANGE}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={12}
            >
              {scenario.fExpr}
            </text>
          )}
          {showFLine && analysis.coincide && (
            <>
              <text
                x={866}
                y={plotData.wsEndY - 9}
                dominantBaseline="central"
                fill={COLOR_TEAL}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={12}
              >
                {analysis.wsExpr}
              </text>
              <text
                x={866}
                y={plotData.wsEndY + 9}
                dominantBaseline="central"
                fill={COLOR_ORANGE}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={12}
              >
                same order
              </text>
            </>
          )}

          {WATERSHED_TICKS.map((tick) => (
            <text
              key={`t${tick}`}
              x={plotData.xAt(Math.log2(tick))}
              y={304}
              textAnchor="middle"
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={11.5}
            >
              {tick}
            </text>
          ))}
          <text
            x={607}
            y={322}
            textAnchor="middle"
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={11.5}
          >
            input size n
          </text>
          <text
            x={334}
            y={191}
            textAnchor="middle"
            dominantBaseline="central"
            transform="rotate(-90 334 191)"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={11.5}
          >
            work, log scale
          </text>

          {/* Bottom Footers */}
          <text
            x={28}
            y={348}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            WATERSHED
          </text>
          <text
            x={28}
            y={366}
            dominantBaseline="hanging"
            fill={hasA ? COLOR_TEAL : "#a1a1aa"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {hasA ? analysis.wsExpr : "?"}
          </text>
          <text
            x={148}
            y={370}
            dominantBaseline="hanging"
            fill={hasF ? COLOR_ORANGE : "#a1a1aa"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12.5}
          >
            {hasF ? `f(n) = ${scenario.fExpr}` : "f(n) = ?"}
          </text>

          {isDone ? (
            <text
              x={520}
              y={360}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={16}
            >
              {analysis.banner}
            </text>
          ) : (
            <text
              x={272}
              y={370}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={12.5}
            >
              compare f(n) against the watershed
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   3. REGULARITY CONDITION
   ========================================================================= */

interface RegularityScenario {
  id: string;
  name: string;
  a: number;
  b: number;
  p: number;
  fLabel: string;
  bPowLabel: string;
  note: string;
  connector: string;
  verdict: string;
  verdictNote: string;
  done: string;
}

const REGULARITY_SCENARIOS: RegularityScenario[] = [
  {
    id: "p1",
    name: "f=n², a=2, b=2",
    a: 2,
    b: 2,
    p: 2,
    fLabel: "n²",
    bPowLabel: "2²",
    note: "half the work",
    connector: "and",
    verdict: "Same ratio on every row, so a single c = 0.5 covers all n",
    verdictNote: "Case 3 applies",
    done: "Regularity holds, Case 3 gives T(n) = Θ(n²)",
  },
  {
    id: "p2",
    name: "f=n³, a=2, b=2",
    a: 2,
    b: 2,
    p: 3,
    fLabel: "n³",
    bPowLabel: "2³",
    note: "a quarter of the work",
    connector: "and",
    verdict: "Same ratio on every row, so a single c = 0.25 covers all n",
    verdictNote: "Case 3 applies",
    done: "Regularity holds, Case 3 gives T(n) = Θ(n³)",
  },
  {
    id: "p3",
    name: "f=n, a=2, b=2",
    a: 2,
    b: 2,
    p: 1,
    fLabel: "n",
    bPowLabel: "2¹",
    note: "exactly the same work",
    connector: "and",
    verdict: "No c below 1 exists, and f(n) equals the watershed anyway",
    verdictNote: "f(n) equals the watershed, Case 2",
    done: "f(n) = n matches the watershed, Case 2 gives Θ(n log n)",
  },
  {
    id: "p4",
    name: "f=n², a=8, b=2",
    a: 8,
    b: 2,
    p: 2,
    fLabel: "n²",
    bPowLabel: "2²",
    note: "the level below is bigger",
    connector: "but",
    verdict: "Work grows toward the leaves, so this is Case 1, not Case 3",
    verdictNote: "work grows toward the leaves, Case 1",
    done: "f(n) = n² sits below the watershed n³, Case 1 gives Θ(n³)",
  },
];

const REG_N_VALUES = [8, 16, 32, 64, 128];

function fmtNum(n: number) {
  return n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n > 9999 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

export function RegularityConditionSimulation() {
  const [activeId, setActiveId] = useState(REGULARITY_SCENARIOS[0].id);
  const scenario = REGULARITY_SCENARIOS.find((s) => s.id === activeId) ?? REGULARITY_SCENARIOS[0];

  const rows = useMemo(() => {
    return REG_N_VALUES.map((nVal) => ({
      n: nVal,
      left: scenario.a * Math.pow(nVal / scenario.b, scenario.p),
      right: Math.pow(nVal, scenario.p),
    }));
  }, [scenario]);

  const ratio = scenario.a / Math.pow(scenario.b, scenario.p);
  const isSatisfied = ratio < 1;
  const statusColor = isSatisfied ? COLOR_GREEN : COLOR_RED;

  const phases = useMemo(() => {
    const rStr = ratio.toFixed(2);
    const pList: { kind: string; row: number; narration: string; status: string }[] = rows.map((r, i) => ({
      kind: "row",
      row: i,
      narration: `At n = ${r.n}: ${scenario.a}·f(${r.n / scenario.b}) = ${r.left} ${scenario.connector} f(${r.n}) = ${r.right}, ${scenario.note}`,
      status: `n = ${r.n}, ratio ${rStr}`,
    }));
    pList.push({
      kind: "verdict",
      row: -1,
      narration: scenario.verdict,
      status: isSatisfied ? `Regularity condition holds, c = ${rStr}` : "Regularity condition fails",
    });
    pList.push({
      kind: "done",
      row: -1,
      narration: scenario.done,
      status: `Done, ratio ${ratio.toFixed(2)} at every n`,
    });
    return pList;
  }, [scenario, rows, ratio, isSatisfied]);

  const idleFrame = useMemo(
    () => ({
      kind: "idle",
      row: -1,
      narration: "Press Play: check a·f(n/b) against c·f(n) at each n",
      status: "Idle, press Play to begin",
    }),
    []
  );

  const player = useSimulationPlayback(800, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(phases, 800);
  }, [phases, player]);

  const isDone = player.atEnd;
  const activeRow = curr && curr.kind === "row" ? curr.row : -1;
  const hasVerdict = curr !== null && curr.kind !== "row" && curr.kind !== "idle";
  const maxVisibleRow = curr && curr.kind !== "idle" ? (hasVerdict ? rows.length - 1 : curr.row) : -1;
  const headerColor = hasVerdict ? statusColor : COLOR_CYAN;
  const narration = curr ? curr.narration : "Press Play: check a·f(n/b) against c·f(n) at each n";

  const bannerText = isSatisfied
    ? `ratio ${ratio.toFixed(2)} < 1 for every n → regularity holds, Case 3 applies`
    : `ratio ${ratio.toFixed(2)} ≥ 1 → regularity fails, this is not Case 3`;

  return (
    <div className="w-full space-y-4">
      {/* Header and Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Case 3 also needs the next level down to be a constant fraction cheaper.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {REGULARITY_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                activeId === s.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 400"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >

          {/* Top Banner */}
          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill={headerColor}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            {narration}
          </text>
          <rect
            x={782}
            y={10}
            width={150}
            height={22}
            rx={5}
            fill="none"
            stroke={headerColor}
            strokeWidth={1.5}
          />
          <text
            x={857}
            y={21}
            textAnchor="middle"
            dominantBaseline="central"
            fill={headerColor}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 0.8 }}
          >
            Case 3 check
          </text>

          {/* Table of Rows */}
          {rows.map((r, i) => {
            const y = 58 + 54 * i;
            const isHighlight = i === activeRow;
            const isVisible = i <= maxVisibleRow;
            const maxVal = Math.max(r.left, r.right);
            const wLeft = (r.left / maxVal) * 330;
            const wRight = (r.right / maxVal) * 330;
            const yTop = y + 6;
            const yBot = y + 26;

            return (
              <g key={r.n}>
                {isHighlight && (
                  <rect
                    x={18}
                    y={y - 4}
                    width={572}
                    height={48}
                    rx={7}
                    fill="rgba(0,206,255,0.10)"
                    stroke="rgba(0,206,255,0.5)"
                    strokeWidth={1.2}
                  />
                )}
                <text
                  x={72}
                  y={y + 17}
                  textAnchor="end"
                  dominantBaseline="central"
                  fill={isHighlight ? COLOR_CYAN : isVisible ? "#f4f4f5" : "#a1a1aa"}
                  fontFamily={FONT_MONO}
                  fontWeight={isHighlight ? 800 : 700}
                  fontSize={12}
                  opacity={isVisible ? 1 : 0.5}
                >
                  {`n = ${r.n}`}
                </text>
                <rect x={140} y={yTop} width={330} height={14} rx={3} fill="rgba(161,161,170,0.18)" />
                <rect x={140} y={yBot} width={330} height={14} rx={3} fill="rgba(161,161,170,0.18)" />

                {isVisible && (
                  <g opacity={isHighlight ? 1 : 0.78}>
                    {/* Left bar: a * f(n/b) */}
                    <text
                      x={82}
                      y={yTop + 7}
                      dominantBaseline="central"
                      fill={COLOR_TEAL}
                      fontFamily={FONT_MONO}
                      fontWeight={700}
                      fontSize={11.5}
                    >
                      {`${scenario.a}·f(${r.n / scenario.b})`}
                    </text>
                    <rect x={140} y={yTop} width={wLeft} height={14} rx={3} fill={COLOR_TEAL} />
                    <text
                      x={140 + wLeft + 8}
                      y={yTop + 7}
                      dominantBaseline="central"
                      fill="#f4f4f5"
                      fontFamily={FONT_MONO}
                      fontWeight={700}
                      fontSize={11.5}
                      className="tabular-nums"
                    >
                      {fmtNum(r.left)}
                    </text>

                    {/* Right bar: f(n) */}
                    <text
                      x={82}
                      y={yBot + 7}
                      dominantBaseline="central"
                      fill={COLOR_ORANGE}
                      fontFamily={FONT_MONO}
                      fontWeight={700}
                      fontSize={11.5}
                    >
                      {`f(${r.n})`}
                    </text>
                    <rect x={140} y={yBot} width={wRight} height={14} rx={3} fill={COLOR_ORANGE} />
                    <text
                      x={140 + wRight + 8}
                      y={yBot + 7}
                      dominantBaseline="central"
                      fill="#f4f4f5"
                      fontFamily={FONT_MONO}
                      fontWeight={700}
                      fontSize={11.5}
                      className="tabular-nums"
                    >
                      {fmtNum(r.right)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Right Card: Condition Box */}
          <rect
            x={616}
            y={58}
            width={316}
            height={250}
            rx={10}
            fill="#1f1f22"
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.4}
          />
          <text
            x={634}
            y={76}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            REGULARITY CONDITION
          </text>
          <text
            x={634}
            y={104}
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            <tspan fill={COLOR_TEAL}>a·f(n/b)</tspan>
            <tspan fill="#f4f4f5"> ≤ </tspan>
            <tspan fill={COLOR_ORANGE}>c·f(n)</tspan>
          </text>
          <text
            x={634}
            y={130}
            dominantBaseline="central"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={13}
          >
            <tspan fill={COLOR_TEAL}>{`${scenario.a}·f(n/${scenario.b})`}</tspan>
            <tspan fill="#f4f4f5"> ≤ </tspan>
            <tspan fill={COLOR_ORANGE}>c·f(n)</tspan>
          </text>
          <text
            x={634}
            y={152}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={11.5}
          >
            {`f(n) = ${scenario.fLabel}, a = ${scenario.a}, b = ${scenario.b}`}
          </text>
          <line
            x1={634}
            y1={170}
            x2={914}
            y2={170}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1}
          />
          <text
            x={634}
            y={186}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            ratio
          </text>
          <text
            x={634}
            y={208}
            dominantBaseline="hanging"
            fill={hasVerdict ? statusColor : "#f4f4f5"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {ratio.toFixed(2)}
          </text>
          <text
            x={710}
            y={220}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={11.5}
          >
            {`= ${scenario.a} / ${scenario.bPowLabel}`}
          </text>

          {hasVerdict && (
            <g>
              <text
                x={634}
                y={258}
                dominantBaseline="central"
                fill={statusColor}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={12.5}
              >
                {isSatisfied
                  ? `c = ${ratio.toFixed(2)} < 1, condition holds`
                  : "ratio ≥ 1, condition fails"}
              </text>
              <text
                x={634}
                y={280}
                dominantBaseline="central"
                fill="#a1a1aa"
                fontFamily={FONT_MONO}
                fontWeight={600}
                fontSize={11.5}
              >
                {scenario.verdictNote}
              </text>
            </g>
          )}

          {/* Footer Counters */}
          <text
            x={28}
            y={348}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            RATIO
          </text>
          <text
            x={28}
            y={366}
            dominantBaseline="hanging"
            fill={hasVerdict ? statusColor : "#f4f4f5"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={20}
            className="tabular-nums"
          >
            {ratio.toFixed(2)}
          </text>

          {isDone ? (
            <text
              x={480}
              y={360}
              textAnchor="middle"
              dominantBaseline="central"
              fill={statusColor}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={16}
            >
              {bannerText}
            </text>
          ) : (
            <text
              x={148}
              y={370}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={12.5}
            >
              the ratio stays constant for polynomial f(n)
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   4. WHEN THE MASTER THEOREM FAILS
   ========================================================================= */

interface FailScenario {
  id: string;
  name: string;
  recurrence: { t: string; hot?: boolean }[];
  assumptionLine: string;
  counter: string;
  caption: string;
  idleNarration: string;
  verdictLine: string;
  banner: string;
  phases: { reveal: number; narration: string; status: string }[];
}

const FAIL_SCENARIOS: FailScenario[] = [
  {
    id: "split",
    name: "T(n/2)+T(n/3)+n",
    recurrence: [{ t: "T(n) = " }, { t: "T(n/2) + T(n/3)", hot: true }, { t: " + n" }],
    assumptionLine: "the template a · T(n / b) assumes every subproblem is the same size",
    counter: "equal sizes",
    caption: "checking whether a and b even exist",
    idleNarration: "Press Play, test T(n/2) + T(n/3) + n against the theorem",
    verdictLine: "FAILS: two subproblem sizes, so a and b have no single value",
    banner: "Two different subproblem sizes → use the Akra-Bazzi method",
    phases: [
      { reveal: 0, narration: "Read the recurrence first: two recursive calls, two different sizes", status: "Restating T(n) = T(n/2) + T(n/3) + n" },
      { reveal: 1, narration: "The root splits into a half and a third, not into equal pieces", status: "Level 1: one n/2 child, one n/3 child" },
      { reveal: 2, narration: "Expand once more and the two branches drift further apart", status: "Level 2: n/4, n/6, n/6, n/9" },
      { reveal: 3, narration: "The template a · T(n / b) has one slot for a and one slot for b", status: "Looking for a single a and b" },
      { reveal: 4, narration: "No single b describes both n/2 and n/3, so both slots stay empty", status: "Assumption broken: equal sizes" },
      { reveal: 5, narration: "Unequal splits are exactly what the Akra-Bazzi method was built for", status: "Fallback: the Akra-Bazzi method" },
    ],
  },
  {
    id: "sub",
    name: "T(n-1)+n",
    recurrence: [{ t: "T(n) = T(" }, { t: "n - 1", hot: true }, { t: ") + n" }],
    assumptionLine: "the template a · T(n / b) assumes the input is divided, not decremented",
    counter: "division split",
    caption: "checking for an n / b to plug in",
    idleNarration: "Press Play, test T(n - 1) + n against the theorem",
    verdictLine: "FAILS: the input shrinks by subtraction, so there is no n / b to plug in",
    banner: "The argument is n - 1, not n / b → expand it by hand instead",
    phases: [
      { reveal: 0, narration: "Read the recurrence: the argument is n - 1, not n / b", status: "Restating T(n) = T(n - 1) + n" },
      { reveal: 1, narration: "Each call peels off one element, so the chain shrinks by subtraction", status: "Chain: n, n-1, n-2, n-3" },
      { reveal: 2, narration: "The theorem only accepts a divided argument of the form n / b", status: "Checking the a · T(n / b) template" },
      { reveal: 3, narration: "No constant b turns n into n - 1, so the n / b slot stays empty", status: "No b fits n / b = n - 1" },
      { reveal: 4, narration: "Subtractive recurrences fall outside the theorem entirely", status: "Assumption broken: division split" },
      { reveal: 5, narration: "Expanding the chain by hand gives n + (n-1) + ... + 1 = Θ(n²)", status: "Fallback: expand it by hand" },
    ],
  },
  {
    id: "neg",
    name: "2T(n/2)-n",
    recurrence: [{ t: "T(n) = 2T(n/2) " }, { t: "- n", hot: true }],
    assumptionLine: "all three cases assume a non-negative combine cost f(n)",
    counter: "f(n) >= 0",
    caption: "checking the sign of f(n)",
    idleNarration: "Press Play, test 2T(n/2) - n against the theorem",
    verdictLine: "FAILS: f(n) = -n is negative, and every case assumes f(n) >= 0",
    banner: "f(n) = -n hangs below zero → the theorem assumes f(n) >= 0",
    phases: [
      { reveal: 0, narration: "Read the recurrence: the combine cost is subtracted, so f(n) = -n", status: "Restating T(n) = 2T(n/2) - n" },
      { reveal: 1, narration: "Plot f(n) against a zero baseline for n = 4, 8, 16, 32", status: "Setting up the f(n) baseline" },
      { reveal: 2, narration: "At n = 4 and n = 8 the combine cost already hangs below zero", status: "f(4) = -4, f(8) = -8" },
      { reveal: 3, narration: "Every larger n drops further, and none of them come back up", status: "f(16) = -16, f(32) = -32" },
      { reveal: 4, narration: "All three cases compare a non-negative f(n) to the watershed", status: "Assumption broken: f(n) >= 0" },
      { reveal: 5, narration: "Rewrite the combine cost as a non-negative function before comparing", status: "The theorem assumes f(n) >= 0" },
    ],
  },
  {
    id: "gap",
    name: "2T(n/2)+n log n",
    recurrence: [{ t: "T(n) = 2T(n/2) + " }, { t: "n log n", hot: true }],
    assumptionLine: "a = 2, b = 2, watershed n^(log₂ 2) = n, so the ratio f(n) / n is log n",
    counter: "polynomial gap",
    caption: "checking f(n) against the watershed n^1",
    idleNarration: "Press Play, test 2T(n/2) + n log n against the theorem",
    verdictLine: "FAILS: f(n) sits in the gap, it beats n by a log factor, not by n^ε",
    banner: "n log n beats n by only a log factor → use a recursion tree instead",
    phases: [
      { reveal: 0, narration: "Read the recurrence: a = 2, b = 2, and f(n) = n log n", status: "Restating T(n) = 2T(n/2) + n log n" },
      { reveal: 1, narration: "Case 3 needs f(n) = Ω(n^(1+ε)), so f(n) / n must grow like n^ε", status: "Watershed n^1, ratio f(n)/n = log n" },
      { reveal: 2, narration: "At n = 2^10 the log is 10 and n^0.1 is only 2, so log n leads", status: "n = 2^10: log n = 10, n^0.1 = 2" },
      { reveal: 3, narration: "At n = 2^20 the log is 20 and n^0.1 is 4, log n still leads", status: "n = 2^20: log n = 20, n^0.1 = 4" },
      { reveal: 4, narration: "At n = 2^40 the lead narrows: 40 against 16", status: "n = 2^40: log n = 40, n^0.1 = 16" },
      { reveal: 5, narration: "At n = 2^100 the log is 100 and n^0.1 is 1024, so log n loses", status: "n = 2^100: log n = 100, n^0.1 = 1024" },
      { reveal: 6, narration: "Every ε > 0 overtakes log n eventually, so no ε makes Case 3 fire", status: "Assumption broken: polynomial gap" },
      { reveal: 7, narration: "Drop the extra n and Case 1 applies cleanly, giving Θ(n)", status: "Fallback: use a recursion tree" },
    ],
  },
];

// Sub-renders for the 4 failure cases
const SPLIT_L1 = [
  { label: "n/2", cx: 340, w: 150 },
  { label: "n/3", cx: 620, w: 100 },
];
const SPLIT_L2 = [
  { label: "n/4", cx: 300, w: 75, parent: 0 },
  { label: "n/6", cx: 400, w: 50, parent: 0 },
  { label: "n/6", cx: 595, w: 50, parent: 1 },
  { label: "n/9", cx: 655, w: 33, parent: 1 },
];

function RenderSplit({ rv }: { rv: number }) {
  return (
    <g>
      {[
        { y: 129, label: "level 0", on: true },
        { y: 197, label: "level 1", on: rv >= 1 },
        { y: 261, label: "level 2", on: rv >= 2 },
      ].map((lvl) => (
        <text
          key={lvl.label}
          x={40}
          y={lvl.y}
          dominantBaseline="central"
          fill="#a1a1aa"
          fontFamily={FONT_MONO}
          fontWeight={700}
          fontSize={11.5}
          opacity={lvl.on ? 1 : 0}
        >
          {lvl.label}
        </text>
      ))}
      <rect
        x={330}
        y={112}
        width={300}
        height={34}
        rx={8}
        fill="rgba(0,206,255,0.14)"
        stroke={COLOR_CYAN}
        strokeWidth={1.8}
      />
      <text
        x={480}
        y={129}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f4f4f5"
        fontFamily={FONT_MONO}
        fontWeight={800}
        fontSize={16}
      >
        n
      </text>

      {rv >= 1 &&
        SPLIT_L1.map((node, i) => (
          <g key={`l1-${i}`}>
            <line
              x1={480}
              y1={146}
              x2={node.cx}
              y2={180}
              stroke="rgba(161,161,170,0.4)"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={node.cx - node.w / 2}
              y={180}
              width={node.w}
              height={34}
              rx={8}
              fill="rgba(255,169,77,0.16)"
              stroke={COLOR_ORANGE}
              strokeWidth={1.8}
            />
            <text
              x={node.cx}
              y={197}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_ORANGE}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={15}
            >
              {node.label}
            </text>
          </g>
        ))}

      {rv >= 2 &&
        SPLIT_L2.map((node, i) => {
          const p = SPLIT_L1[node.parent];
          return (
            <g key={`l2-${i}`}>
              <line
                x1={p.cx}
                y1={214}
                x2={node.cx}
                y2={246}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={node.cx - node.w / 2}
                y={246}
                width={node.w}
                height={30}
                rx={7}
                fill="#1f1f22"
                stroke="rgba(255,169,77,0.55)"
                strokeWidth={1.4}
              />
              <text
                x={node.cx}
                y={261}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f4f4f5"
                fontFamily={FONT_MONO}
                fontWeight={700}
                fontSize={12}
              >
                {node.label}
              </text>
            </g>
          );
        })}

      {rv >= 3 && (
        <g>
          <rect
            x={700}
            y={160}
            width={230}
            height={86}
            rx={9}
            fill="rgba(255,135,135,0.08)"
            stroke={COLOR_RED}
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
          <text
            x={716}
            y={182}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={11.5}
          >
            the theorem needs
          </text>
          <text
            x={716}
            y={206}
            dominantBaseline="central"
            fill="#f4f4f5"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={14}
          >
            a · T(n / b)
          </text>
          <text
            x={716}
            y={230}
            dominantBaseline="central"
            fill={COLOR_RED}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={16}
          >
            a = ?   b = ?
          </text>
        </g>
      )}
    </g>
  );
}

const SUB_NODES = [
  { label: "n", cx: 240 },
  { label: "n-1", cx: 400 },
  { label: "n-2", cx: 560 },
  { label: "n-3", cx: 720 },
];

function RenderSub({ rv }: { rv: number }) {
  return (
    <g>
      {rv >= 1 && (
        <g>
          {SUB_NODES.map((node, i) => (
            <g key={node.label}>
              <rect
                x={node.cx - 60}
                y={126}
                width={120}
                height={50}
                rx={9}
                fill={i === 0 ? "rgba(0,206,255,0.14)" : "#1f1f22"}
                stroke={i === 0 ? COLOR_CYAN : "rgba(255,169,77,0.6)"}
                strokeWidth={1.7}
              />
              <text
                x={node.cx}
                y={151}
                textAnchor="middle"
                dominantBaseline="central"
                fill={i === 0 ? "#f4f4f5" : COLOR_ORANGE}
                fontFamily={FONT_MONO}
                fontWeight={800}
                fontSize={16}
              >
                {node.label}
              </text>
            </g>
          ))}
          {SUB_NODES.slice(0, 3).map((node, i) => {
            const x1 = node.cx + 60 + 6;
            const x2 = SUB_NODES[i + 1].cx - 60 - 6;
            return (
              <g key={`arrow-${i}`}>
                <line
                  x1={x1}
                  y1={151}
                  x2={x2 - 8}
                  y2={151}
                  stroke="rgba(161,161,170,0.4)"
                  strokeWidth={1.6}
                  vectorEffect="non-scaling-stroke"
                />
                <polygon
                  points={`${x2},151 ${x2 - 9},146 ${x2 - 9},156`}
                  fill="#a1a1aa"
                />
                <text
                  x={(x1 + x2) / 2}
                  y={112}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={COLOR_ORANGE}
                  fontFamily={FONT_MONO}
                  fontWeight={800}
                  fontSize={11.5}
                >
                  -1
                </text>
              </g>
            );
          })}
          <text
            x={812}
            y={151}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={16}
          >
            ...
          </text>
        </g>
      )}

      {rv >= 2 && (
        <g>
          <text
            x={480}
            y={198}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={12.5}
          >
            the theorem&apos;s template: a · T(n / b) + f(n)
          </text>
          <rect
            x={365}
            y={211}
            width={230}
            height={62}
            rx={9}
            fill={rv >= 3 ? "rgba(255,135,135,0.08)" : "#1f1f22"}
            stroke={rv >= 3 ? COLOR_RED : "rgba(161,161,170,0.4)"}
            strokeWidth={1.8}
            strokeDasharray="6 4"
          />
          <text
            x={480}
            y={242}
            textAnchor="middle"
            dominantBaseline="central"
            fill={rv >= 3 ? COLOR_RED : "#f4f4f5"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={24}
          >
            n / b
          </text>
          {rv >= 3 && (
            <line
              x1={375}
              y1={216}
              x2={585}
              y2={268}
              stroke={COLOR_RED}
              strokeWidth={3}
              strokeLinecap="round"
            />
          )}
        </g>
      )}

      {rv >= 3 && (
        <text
          x={480}
          y={288}
          textAnchor="middle"
          dominantBaseline="central"
          fill={COLOR_RED}
          fontFamily={FONT_MONO}
          fontWeight={700}
          fontSize={13}
        >
          no constant b satisfies n / b = n - 1
        </text>
      )}
    </g>
  );
}

const NEG_ITEMS = [
  { n: 4, cx: 340 },
  { n: 8, cx: 480 },
  { n: 16, cx: 620 },
  { n: 32, cx: 760 },
];

function RenderNeg({ rv }: { rv: number }) {
  const visibleCount = rv >= 3 ? 4 : rv >= 2 ? 2 : 0;
  return (
    <g>
      {rv >= 1 && (
        <g>
          <line
            x1={250}
            y1={146}
            x2={870}
            y2={146}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.8}
            vectorEffect="non-scaling-stroke"
          />
          <text
            x={878}
            y={146}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={12}
          >
            0
          </text>
        </g>
      )}

      {NEG_ITEMS.map((item, idx) => {
        if (idx >= visibleCount) return null;
        const h = (item.n / 32) * 125;
        return (
          <g key={item.n}>
            <text
              x={item.cx}
              y={132}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={700}
              fontSize={12.5}
            >
              {`n = ${item.n}`}
            </text>
            <rect
              x={item.cx - 38}
              y={146}
              width={76}
              height={h}
              rx={4}
              fill="rgba(255,135,135,0.22)"
              stroke={COLOR_RED}
              strokeWidth={1.6}
            />
            <text
              x={item.cx}
              y={146 + h + 15}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_RED}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {`-${item.n}`}
            </text>
          </g>
        );
      })}

      {rv >= 4 && (
        <g>
          <rect
            x={40}
            y={176}
            width={196}
            height={78}
            rx={9}
            fill="rgba(255,135,135,0.08)"
            stroke={COLOR_RED}
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
          <text
            x={56}
            y={204}
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={700}
            fontSize={11.5}
          >
            the theorem assumes
          </text>
          <text
            x={56}
            y={232}
            dominantBaseline="central"
            fill={COLOR_RED}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={18}
          >
            f(n) &gt;= 0
          </text>
        </g>
      )}
    </g>
  );
}

const GAP_ROWS = [
  { n: "2^10", log: "10", eps: "2", winner: "log" },
  { n: "2^20", log: "20", eps: "4", winner: "log" },
  { n: "2^40", log: "40", eps: "16", winner: "log" },
  { n: "2^100", log: "100", eps: "1024", winner: "eps" },
];

const GAP_COLS = [
  { key: "n", label: "n", x: 40, w: 160 },
  { key: "log", label: "log₂ n", x: 200, w: 115 },
  { key: "eps", label: "n^0.1", x: 315, w: 115 },
];

function RenderGap({ rv }: { rv: number }) {
  const isFailed = rv >= 6;
  const visibleRows = Math.max(0, Math.min(4, rv - 1));

  return (
    <g>
      {rv >= 1 && (
        <g>
          {GAP_COLS.map((col) => (
            <text
              key={col.key}
              x={col.x + col.w / 2}
              y={139}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={12.5}
            >
              {col.label}
            </text>
          ))}
          <line
            x1={40}
            y1={152}
            x2={430}
            y2={152}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.4}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      )}

      {GAP_ROWS.map((row, idx) => {
        if (idx >= visibleRows) return null;
        const y = 152 + 33 * idx;
        const cells = [
          { key: "n", value: row.n, hit: false },
          { key: "log", value: row.log, hit: row.winner === "log" },
          { key: "eps", value: row.eps, hit: row.winner === "eps" },
        ];
        return (
          <g key={row.n}>
            {cells.map((cell, ci) => {
              const col = GAP_COLS[ci];
              const hitColor = row.winner === "log" ? COLOR_ORANGE : COLOR_GREEN;
              const hitFill =
                row.winner === "log" ? "rgba(255,169,77,0.18)" : "rgba(105,219,124,0.18)";
              const hitStroke =
                row.winner === "log" ? "rgba(255,169,77,0.75)" : "rgba(105,219,124,0.75)";
              return (
                <g key={cell.key}>
                  {cell.hit && (
                    <rect
                      x={col.x + 6}
                      y={y + 3}
                      width={col.w - 12}
                      height={27}
                      rx={6}
                      fill={hitFill}
                      stroke={hitStroke}
                      strokeWidth={1.4}
                    />
                  )}
                  <text
                    x={col.x + col.w / 2}
                    y={y + 16.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={cell.hit ? hitColor : ci === 0 ? "#a1a1aa" : "#f4f4f5"}
                    fontFamily={FONT_MONO}
                    fontWeight={cell.hit ? 800 : 700}
                    fontSize={13}
                  >
                    {cell.value}
                  </text>
                </g>
              );
            })}
            <line
              x1={40}
              y1={y + 33}
              x2={430}
              y2={y + 33}
              stroke="rgba(161,161,170,0.18)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}

      {rv >= 1 && !isFailed && (
        <g>
          <text
            x={470}
            y={118}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            WHY CASE 3 NEEDS n^ε
          </text>
          {[
            "Case 3 needs f(n) = Ω(n^(1+ε)) for some ε > 0,",
            "so the ratio f(n) / n must grow at least like n^ε.",
            "Here f(n) / n = log n, so race it against n^0.1.",
          ].map((line, li) => (
            <text
              key={li}
              x={470}
              y={148 + 22 * li}
              dominantBaseline="central"
              fill="#f4f4f5"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={12.5}
            >
              {line}
            </text>
          ))}
          {rv >= 5 && (
            <g>
              {[
                "n^0.1 overtakes log n by n = 2^100,",
                "and some n^ε overtakes it for every ε > 0.",
              ].map((line, li) => (
                <text
                  key={li}
                  x={470}
                  y={226 + 22 * li}
                  dominantBaseline="central"
                  fill={li === 0 ? "#f4f4f5" : COLOR_ORANGE}
                  fontFamily={FONT_MONO}
                  fontWeight={700}
                  fontSize={12.5}
                >
                  {line}
                </text>
              ))}
            </g>
          )}
        </g>
      )}

      {isFailed && (
        <g>
          <rect
            x={470}
            y={108}
            width={460}
            height={88}
            rx={10}
            fill="rgba(255,135,135,0.09)"
            stroke={COLOR_RED}
            strokeWidth={1.8}
          />
          <text
            x={488}
            y={134}
            dominantBaseline="central"
            fill={COLOR_RED}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={16}
          >
            2T(n/2) + n log n
          </text>
          <text
            x={912}
            y={134}
            textAnchor="end"
            dominantBaseline="central"
            fill={COLOR_RED}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 1 }}
          >
            FAILS
          </text>
          <text
            x={488}
            y={160}
            dominantBaseline="central"
            fill="#f4f4f5"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={12.5}
          >
            the ratio log n never reaches n^ε,
          </text>
          <text
            x={488}
            y={180}
            dominantBaseline="central"
            fill="#f4f4f5"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={12.5}
          >
            so Case 3 has no ε to work with
          </text>

          <rect
            x={470}
            y={204}
            width={460}
            height={88}
            rx={10}
            fill="rgba(105,219,124,0.1)"
            stroke={COLOR_GREEN}
            strokeWidth={1.8}
          />
          <text
            x={488}
            y={230}
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={16}
          >
            2T(n/2) + log n DOES work
          </text>
          <text
            x={912}
            y={230}
            textAnchor="end"
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 1 }}
          >
            WORKS
          </text>
          <text
            x={488}
            y={256}
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={12.5}
          >
            log n is polynomially smaller than n,
          </text>
          <text
            x={488}
            y={276}
            dominantBaseline="central"
            fill={COLOR_GREEN}
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={12.5}
          >
            so Case 1 gives Θ(n)
          </text>
        </g>
      )}
    </g>
  );
}

function VerdictBanner({ line }: { line: string }) {
  return (
    <g>
      <rect
        x={40}
        y={302}
        width={880}
        height={42}
        rx={10}
        fill="rgba(255,135,135,0.1)"
        stroke={COLOR_RED}
        strokeWidth={1.8}
      />
      <circle cx={66} cy={323} r={11} fill="none" stroke={COLOR_RED} strokeWidth={1.8} />
      <line x1={61} y1={318} x2={71} y2={328} stroke={COLOR_RED} strokeWidth={2} strokeLinecap="round" />
      <line x1={71} y1={318} x2={61} y2={328} stroke={COLOR_RED} strokeWidth={2} strokeLinecap="round" />
      <text
        x={90}
        y={323}
        dominantBaseline="central"
        fill={COLOR_RED}
        fontFamily={FONT_MONO}
        fontWeight={800}
        fontSize={14}
      >
        {line}
      </text>
    </g>
  );
}

export function MasterTheoremFailsSimulation() {
  const [activeId, setActiveId] = useState(FAIL_SCENARIOS[0].id);
  const scenario = FAIL_SCENARIOS.find((s) => s.id === activeId) ?? FAIL_SCENARIOS[0];

  const idleFrame = useMemo(
    () => ({
      reveal: 0,
      narration: scenario.idleNarration,
      status: "Idle, press Play to begin",
      stepIndex: -1,
    }),
    [scenario.idleNarration]
  );

  const player = useSimulationPlayback(1000, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(
      scenario.phases.map((p, idx) => ({ ...p, stepIndex: idx })),
      1000
    );
  }, [scenario.phases, player]);

  const stepIndex = curr.stepIndex ?? -1;
  const isDone = player.atEnd;
  const reveal = curr ? curr.reveal : 0;
  const showVerdict = stepIndex >= scenario.phases.length - 2;
  const narration = curr ? curr.narration : scenario.idleNarration;

  return (
    <div className="w-full space-y-4">
      {/* Header and Scenario Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Four recurrences the theorem cannot touch, and the exact assumption each one breaks.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {FAIL_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                activeId === s.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 960 420"
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >

          {/* Top Banner */}
          <text
            x={28}
            y={16}
            dominantBaseline="hanging"
            fill={showVerdict ? COLOR_RED : COLOR_CYAN}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
          >
            {narration}
          </text>
          <rect
            x={782}
            y={10}
            width={150}
            height={22}
            rx={5}
            fill="none"
            stroke={COLOR_RED}
            strokeWidth={1.5}
          />
          <text
            x={857}
            y={21}
            textAnchor="middle"
            dominantBaseline="central"
            fill={COLOR_RED}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={12}
            style={{ letterSpacing: 0.8 }}
          >
            does not apply
          </text>

          {/* Recurrence Equation */}
          <text
            x={480}
            y={66}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#f4f4f5"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={20}
            xmlSpace="preserve"
          >
            {scenario.recurrence.map((part, pi) => (
              <tspan key={pi} fill={part.hot ? COLOR_ORANGE : "#f4f4f5"}>
                {part.t}
              </tspan>
            ))}
          </text>
          <text
            x={480}
            y={90}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={600}
            fontSize={13}
          >
            {scenario.assumptionLine}
          </text>

          {/* Sub-scene renderer based on active scenario */}
          {scenario.id === "split" && <RenderSplit rv={reveal} />}
          {scenario.id === "sub" && <RenderSub rv={reveal} />}
          {scenario.id === "neg" && <RenderNeg rv={reveal} />}
          {scenario.id === "gap" && <RenderGap rv={reveal} />}

          {/* Verdict Alert */}
          {showVerdict && <VerdictBanner line={scenario.verdictLine} />}

          {/* Footer Counters */}
          <text
            x={28}
            y={368}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={11.5}
            style={{ letterSpacing: 1 }}
          >
            ASSUMPTION
          </text>
          <text
            x={28}
            y={388}
            dominantBaseline="hanging"
            fill={showVerdict ? COLOR_RED : "#a1a1aa"}
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={16}
          >
            {scenario.counter}
          </text>

          {isDone ? (
            <text
              x={575}
              y={380}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_RED}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={16}
            >
              {scenario.banner}
            </text>
          ) : (
            <text
              x={210}
              y={390}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={FONT_MONO}
              fontWeight={600}
              fontSize={12.5}
            >
              {scenario.caption}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}
