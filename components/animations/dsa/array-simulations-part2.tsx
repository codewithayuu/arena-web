"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { ArrayRowViewer } from "./array-simulations-part1";
import { Shuffle, RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Pastel Mint Green
const COLOR_YELLOW = "#FDE047"; // Pastel Butter Yellow
const COLOR_RED = "#FCA5A5";    // Pastel Rose

function makePrng(seed: number) {
  let s = (0x9e3779b1 * (seed + 11)) % 0x7fffffff;
  if (s <= 0) s += 0x7ffffffe;
  return () => {
    s = (48271 * s) % 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ==========================================
// 8. PREFIX SUM SIMULATION
// ==========================================
const DEFAULT_PREFIX_ARR = [3, 1, 4, 1, 5, 9, 2];

interface PrefixFrame {
  arrValues: number[];
  arrStates: string[];
  prefixStates: string[];
  prefixValues: Array<number | null>;
  query: { l: number; r: number } | null;
  metrics: Array<{ label: string; value: string }>;
  note: string;
  resultText: string;
  resultTone?: "good" | "bad";
}

export function PrefixSumSimulation() {
  const [seed, setSeed] = useState(0);

  const data = useMemo(() => {
    if (seed === 0) return { arr: DEFAULT_PREFIX_ARR, l: 2, r: 5 };
    const prng = makePrng(seed);
    const len = DEFAULT_PREFIX_ARR.length;
    const arr = Array.from({ length: len }, () => 1 + Math.floor(9 * prng()));
    const l = Math.floor(prng() * (len - 3));
    const r = Math.min(l + 2 + Math.floor(prng() * (len - l - 3)), len - 1);
    return { arr, l, r };
  }, [seed]);

  const { arr, l: qL, r: qR } = data;
  const n = arr.length;

  const initialFrame = useMemo<PrefixFrame>(
    () => ({
      arrValues: [...arr],
      arrStates: Array(n).fill("idle"),
      prefixStates: Array(n + 1).fill("idle"),
      prefixValues: Array(n + 1).fill(null),
      query: null,
      metrics: [],
      note: "",
      resultText: "",
    }),
    [arr, n]
  );

  const player = useSimulationPlayback<PrefixFrame>(620, initialFrame);

  const frames = useMemo(() => {
    const list: PrefixFrame[] = [];
    const pfx: Array<number | null> = Array(n + 1).fill(null);
    pfx[0] = 0;

    // Step 0: Base prefix
    const pStates0 = Array(n + 1).fill("idle");
    pStates0[0] = "good";
    list.push({
      arrValues: [...arr],
      arrStates: Array(n).fill("idle"),
      prefixStates: pStates0,
      prefixValues: [...pfx],
      query: null,
      metrics: [{ label: "running sum", value: "0" }],
      note: "prefix[0] = 0, the sum of zero elements",
      resultText: "",
    });

    // Build Prefix Steps
    for (let i = 0; i < n; i++) {
      pfx[i + 1] = (pfx[i] ?? 0) + arr[i];
      const aStates = Array(n).fill("idle");
      aStates[i] = "active";
      const pStates = Array(n + 1).fill("idle");
      for (let k = 0; k <= i; k++) pStates[k] = "good";
      pStates[i] = "active";
      pStates[i + 1] = "active";

      list.push({
        arrValues: [...arr],
        arrStates: aStates,
        prefixStates: pStates,
        prefixValues: [...pfx],
        query: null,
        metrics: [{ label: "running sum", value: String(pfx[i + 1]) }],
        note: `prefix[${i + 1}] = prefix[${i}] + arr[${i}] = ${pfx[i]} + ${arr[i]} = ${pfx[i + 1]}`,
        resultText: "",
      });
    }

    // Done building
    const pStatesDone = Array(n + 1).fill("good");
    list.push({
      arrValues: [...arr],
      arrStates: Array(n).fill("idle"),
      prefixStates: pStatesDone,
      prefixValues: [...pfx],
      query: null,
      metrics: [{ label: "built", value: `${n + 1} prefixes` }],
      note: "Prefix array is built. Any range sum is now one subtraction.",
      resultText: "",
    });

    // Query Demo Steps
    const actualPrefix = [0];
    for (let i = 0; i < n; i++) actualPrefix.push(actualPrefix[i] + arr[i]);

    // Query: highlighting range
    const qStates1 = Array(n).fill("idle");
    for (let i = qL; i <= qR; i++) qStates1[i] = "active";
    list.push({
      arrValues: [...arr],
      arrStates: qStates1,
      prefixStates: Array(n + 1).fill("dim"),
      prefixValues: [...actualPrefix],
      query: { l: qL, r: qR },
      metrics: [{ label: "range", value: `[${qL}, ${qR}]` }],
      note: `Query: sum of arr[${qL}..${qR}]`,
      resultText: "",
    });

    // Query: showing subtraction
    const pStatesQ2 = Array(n + 1).fill("dim");
    pStatesQ2[qR + 1] = "good";
    pStatesQ2[qL] = "bad";
    list.push({
      arrValues: [...arr],
      arrStates: qStates1,
      prefixStates: pStatesQ2,
      prefixValues: [...actualPrefix],
      query: { l: qL, r: qR },
      metrics: [
        { label: `prefix[${qR + 1}]`, value: String(actualPrefix[qR + 1]) },
        { label: `prefix[${qL}]`, value: String(actualPrefix[qL]) },
      ],
      note: `sum = prefix[${qR + 1}] - prefix[${qL}]`,
      resultText: "",
    });

    // Query: Final Answer
    const ans = actualPrefix[qR + 1] - actualPrefix[qL];
    const qStatesAns = Array(n).fill("idle");
    for (let i = qL; i <= qR; i++) qStatesAns[i] = "good";
    const pStatesAns = Array(n + 1).fill("dim");
    pStatesAns[qR + 1] = "good";
    pStatesAns[qL] = "bad";
    list.push({
      arrValues: [...arr],
      arrStates: qStatesAns,
      prefixStates: pStatesAns,
      prefixValues: [...actualPrefix],
      query: { l: qL, r: qR },
      metrics: [{ label: "answer", value: String(ans) }],
      note: `${actualPrefix[qR + 1]} - ${actualPrefix[qL]} = ${ans}`,
      resultText: `sum(arr[${qL}..${qR}]) = ${ans}`,
      resultTone: "good",
    });

    return list;
  }, [arr, n, qL, qR]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(420, Math.min(720, Math.round(11000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    player.stop();
    setSeed((s) => s + 1);
  }, [player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  // SVG rendering
  const cfg = {
    vbW: 720,
    vbH: 312,
    labelX: 12,
    plotX: 84,
    arrY: 92,
    prefixY: 196,
    cellH: 46,
    resultY: 290,
    noteY: 52,
    headerFont: 13,
    noteFont: 13,
    valueFont: 14,
    idxFont: 10.5,
    rowLabelFont: 11.5,
    resultFont: 15,
    arrPad: 12,
    prefixPad: 8,
  };

  const colors = {
    text: "#FFFFFF",
    label: "#a1a1aa",
    cell: "#000000",
    cellStroke: "rgba(255,255,255,0.18)",
    empty: "rgba(255,255,255,0.12)",
    ink: "#09090b",
    idx: "#a1a1aa",
  };

  const cellColor = (st: string) =>
    st === "active"
      ? { fill: COLOR_CYAN, ink: true }
      : st === "good"
      ? { fill: COLOR_GREEN, ink: true }
      : st === "bad"
      ? { fill: COLOR_RED, ink: true }
      : { fill: colors.cell, ink: false };

  const { arrValues, arrStates, prefixStates, prefixValues, query, metrics, note, resultText, resultTone } =
    player.view;
  const colW = (cfg.vbW - cfg.plotX - 24) / (n + 1);
  const arrCellX = (i: number) => cfg.plotX + (i + 1) * colW;
  const pfxCellX = (i: number) => cfg.plotX + (i + 0.5) * colW;
  const arrCellW = colW - cfg.arrPad;
  const pfxCellW = colW - cfg.prefixPad;
  const metricsStr = metrics.map((m) => `${m.label} ${m.value}`).join("   ·   ");

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Prefix Sum</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Precompute cumulative sums so every range-sum query becomes a single subtraction.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleShuffle}
            disabled={player.isPlaying}
            aria-label="New input"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            disabled={player.isPlaying}
            aria-label="Reset"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="pfx" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            <text
              x={cfg.labelX}
              y={16}
              dominantBaseline="hanging"
              fill={colors.label}
              fontFamily={MONO_FONT}
              fontWeight={800}
              fontSize={cfg.headerFont}
              style={{ letterSpacing: 0.5 }}
            >
              PREFIX SUM
            </text>

            <text
              x={cfg.vbW - 16}
              y={16}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={colors.label}
              fontFamily={MONO_FONT}
              fontWeight={800}
              fontSize={cfg.headerFont}
            >
              {metricsStr}
            </text>

            {note && (
              <text
                x={cfg.vbW / 2}
                y={cfg.noteY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={COLOR_CYAN}
                fontFamily={MONO_FONT}
                fontWeight={800}
                fontSize={cfg.noteFont}
              >
                {note}
              </text>
            )}

            {/* Row Labels */}
            <text
              x={cfg.labelX}
              y={cfg.arrY + cfg.cellH / 2}
              dominantBaseline="central"
              fill={colors.label}
              fontFamily={MONO_FONT}
              fontWeight={700}
              fontSize={cfg.rowLabelFont}
            >
              array
            </text>
            <text
              x={cfg.labelX}
              y={cfg.prefixY + cfg.cellH / 2}
              dominantBaseline="central"
              fill={colors.label}
              fontFamily={MONO_FONT}
              fontWeight={700}
              fontSize={cfg.rowLabelFont}
            >
              prefix
            </text>

            {/* Query range highlight */}
            {query && (
              <rect
                x={arrCellX(query.l) - arrCellW / 2 - 4}
                y={cfg.arrY - 8}
                width={(query.r - query.l) * colW + arrCellW + 8}
                height={cfg.cellH + 16}
                rx={9}
                fill="none"
                stroke={COLOR_CYAN}
                strokeWidth={2}
              />
            )}

            {/* Array Cells */}
            {arrValues.map((v, i) => {
              const st = arrStates[i] ?? "idle";
              const c = cellColor(st);
              const isHighlight = st === "active" || st === "good" || st === "bad";
              const cx = arrCellX(i);
              const x = cx - arrCellW / 2;

              return (
                <g key={`a-${i}`} opacity={st === "dim" ? 0.32 : 1}>
                  <rect
                    x={x}
                    y={cfg.arrY}
                    width={arrCellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={c.fill}
                    stroke={isHighlight ? c.fill : colors.cellStroke}
                    strokeWidth={isHighlight ? 2 : 1.25}
                    filter={st === "active" ? "url(#pfx-glow-cyan)" : undefined}
                  />
                  <text
                    x={cx}
                    y={cfg.arrY + cfg.cellH / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={c.ink ? colors.ink : colors.text}
                    fontSize={cfg.valueFont}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {v}
                  </text>
                  <text
                    x={cx}
                    y={cfg.arrY - 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={colors.idx}
                    fontSize={cfg.idxFont}
                    fontWeight={700}
                    fontFamily={MONO_FONT}
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Prefix Cells */}
            {prefixValues.map((v, i) => {
              const st = prefixStates[i] ?? "idle";
              const c = cellColor(st);
              const isHighlight = st === "active" || st === "good" || st === "bad";
              const cx = pfxCellX(i);
              const x = cx - pfxCellW / 2;
              const isEmpty = v == null;

              return (
                <g key={`p-${i}`} opacity={st === "dim" ? 0.4 : 1}>
                  <rect
                    x={x}
                    y={cfg.prefixY}
                    width={pfxCellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={isEmpty ? "none" : c.fill}
                    stroke={isEmpty ? colors.empty : isHighlight ? c.fill : colors.cellStroke}
                    strokeWidth={isHighlight ? 2 : 1.25}
                    strokeDasharray={isEmpty ? "4 4" : undefined}
                    filter={st === "active" ? "url(#pfx-glow-cyan)" : undefined}
                  />
                  {!isEmpty && (
                    <text
                      x={cx}
                      y={cfg.prefixY + cfg.cellH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={c.ink ? colors.ink : colors.text}
                      fontSize={cfg.valueFont}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {v}
                    </text>
                  )}
                  <text
                    x={cx}
                    y={cfg.prefixY + cfg.cellH + 12}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={colors.idx}
                    fontSize={cfg.idxFont}
                    fontWeight={700}
                    fontFamily={MONO_FONT}
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Result text */}
            {resultText && (
              <text
                x={cfg.vbW / 2}
                y={cfg.resultY}
                textAnchor="middle"
                dominantBaseline="central"
                fill={resultTone === "bad" ? COLOR_RED : COLOR_GREEN}
                fontSize={cfg.resultFont}
                fontWeight={800}
                fontFamily={MONO_FONT}
                style={{ letterSpacing: 0.4 }}
              >
                {resultText}
              </text>
            )}
          </svg>
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 9. KADANE'S ALGORITHM SIMULATION
// ==========================================
const DEFAULT_KADANE_ARR = [-2, 1, -3, 4, -1, 2, 1, -5, 4];

export function KadaneSimulation() {
  const [seed, setSeed] = useState(0);

  const arr = useMemo(() => {
    if (seed === 0) return DEFAULT_KADANE_ARR;
    const prng = makePrng(seed);
    const n: number[] = [];
    for (let i = 0; i < DEFAULT_KADANE_ARR.length; i++) {
      const val = 1 + Math.floor(6 * prng());
      n.push(prng() < 0.45 ? -val : val);
    }
    if (n.filter((x) => x > 0).length < 2) {
      n[0] = 3;
      n[4] = 5;
    }
    if (n.filter((x) => x < 0).length < 2) {
      n[2] = -4;
      n[6] = -2;
    }
    return n;
  }, [seed]);

  const initialFrame = useMemo(() => ({
    values: [...arr],
    states: Array(arr.length).fill("idle"),
    pointers: [],
    metrics: [],
    note: "",
    resultText: "",
  }), [arr]);

  const player = useSimulationPlayback(560, initialFrame);

  const frames = useMemo(() => {
    const list: Array<any> = [];
    const len = arr.length;
    let cur = arr[0];
    let startIdx = 0;
    let best = arr[0];
    let bestL = 0;
    let bestR = 0;

    const pushStep = (idx: number, note: string, isDone = false) => {
      const states = Array(len).fill("idle");
      for (let i = bestL; i <= bestR; i++) states[i] = isDone ? "good" : "best";
      if (!isDone) {
        for (let i = startIdx; i <= idx; i++) states[i] = "active";
      }

      list.push({
        values: [...arr],
        states,
        window: isDone ? { lo: bestL, hi: bestR } : { lo: startIdx, hi: idx },
        pointers: isDone ? [] : [{ index: idx, label: "i" }],
        metrics: [
          { label: "current", value: String(cur) },
          { label: "best", value: String(best) },
        ],
        note,
        resultText: isDone ? `Max subarray sum = ${best}` : "",
      });
    };

    pushStep(0, `Start: current = ${cur}`);

    for (let i = 1; i < len; i++) {
      const prev = cur;
      if (prev + arr[i] < arr[i]) {
        cur = arr[i];
        startIdx = i;
        if (cur > best) {
          best = cur;
          bestL = startIdx;
          bestR = i;
        }
        pushStep(i, `${arr[i]} alone beats ${prev} + ${arr[i]}, restart the subarray here`);
      } else {
        cur = prev + arr[i];
        if (cur > best) {
          best = cur;
          bestL = startIdx;
          bestR = i;
        }
        pushStep(i, `Extend: ${prev} + ${arr[i]} = ${cur}`);
      }
    }

    pushStep(len - 1, "", true);
    return list;
  }, [arr]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(360, Math.min(640, Math.round(8000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    player.stop();
    setSeed((s) => s + 1);
  }, [player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Kadane's Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Find the contiguous subarray with the largest sum in one pass. Cyan is the current run, yellow is the best so far.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleShuffle}
            disabled={player.isPlaying}
            aria-label="New input"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            disabled={player.isPlaying}
            aria-label="Reset"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <ArrayRowViewer title="Maximum Subarray" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 10. MOVE ZEROES SIMULATION
// ==========================================
const DEFAULT_MOVE_ZEROES = [0, 1, 0, 3, 12, 0, 7, 4];

interface MoveZeroesFrame {
  order: number[];
  i: number;
  insertPos: number;
  phase: string;
  note: string;
}

export function MoveZeroesSimulation() {
  const initialFrame = useMemo<MoveZeroesFrame>(
    () => ({
      order: DEFAULT_MOVE_ZEROES.map((_, i) => i),
      i: -1,
      insertPos: 0,
      phase: "init",
      note: "insertPos starts at 0, scan from the left",
    }),
    []
  );

  const player = useSimulationPlayback<MoveZeroesFrame>(900, initialFrame);

  const frames = useMemo(() => {
    const arr = [...DEFAULT_MOVE_ZEROES];
    const len = arr.length;
    const order = Array.from({ length: len }, (_, i) => i);
    const getVal = (idx: number) => arr[order[idx]];
    const list: MoveZeroesFrame[] = [
      {
        order: [...order],
        i: -1,
        insertPos: 0,
        phase: "init",
        note: "insertPos starts at 0, scan from the left",
      },
    ];

    let insertPos = 0;
    for (let i = 0; i < len; i++) {
      const v = getVal(i);
      if (v === 0) {
        list.push({
          order: [...order],
          i,
          insertPos,
          phase: "scanZero",
          note: `i=${i}: nums[i] is 0, skip and leave it for the back`,
        });
        continue;
      }

      if (i !== insertPos) {
        list.push({
          order: [...order],
          i,
          insertPos,
          phase: "scanSwap",
          note: `i=${i}: nums[i] = ${v} is non-zero, swap it into index ${insertPos}`,
        });

        const temp = order[i];
        order[i] = order[insertPos];
        order[insertPos] = temp;

        const prevPos = insertPos;
        insertPos++;

        list.push({
          order: [...order],
          i,
          insertPos,
          phase: "swapped",
          note: `Placed ${v} at index ${prevPos}, insertPos advances to ${insertPos}`,
        });
      } else {
        list.push({
          order: [...order],
          i,
          insertPos,
          phase: "scanInPlace",
          note: `i=${i}: nums[i] = ${v} is non-zero and already at insertPos`,
        });
        insertPos++;
        list.push({
          order: [...order],
          i,
          insertPos,
          phase: "advance",
          note: `Already in place, insertPos advances to ${insertPos}`,
        });
      }
    }

    list.push({
      order: [...order],
      i: -1,
      insertPos,
      phase: "done",
      note: "All zeroes moved to the end, order of non-zeroes preserved",
    });

    return list;
  }, []);

  const handleRun = useCallback(() => {
    player.play(frames, 900);
  }, [frames, player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  const cfg = {
    vbW: 780,
    vbH: 172,
    pitch: 72,
    cellW: 62,
    cellH: 58,
    cellTop: 56,
    arc: 44,
    pillH: 22,
    iPillTop: 6,
    ipGap: 30,
    valueFs: 20,
    idxFs: 10.5,
    pillFs: 12,
    charW: 7.6,
    pillPad: 18,
    rx: 14,
    ring: 2.5,
  };

  const colors = {
    cell: "#1b1b1f",
    ghostCell: "#151517",
    bright: "#f4f4f5",
    muted: "#8b8b93",
    neutralRing: "rgba(161,161,170,0.32)",
    ghostRing: "rgba(140,140,150,0.42)",
    ink: "#09090b",
    idx: "#7c7c85",
  };

  const curView = player.view;
  const prevView = player.previous ?? curView;
  const numItems = DEFAULT_MOVE_ZEROES.length;

  const getColLeft = (idx: number) => (cfg.vbW - ((numItems - 1) * cfg.pitch + cfg.cellW)) / 2 + idx * cfg.pitch;
  const getColCenter = (idx: number) => getColLeft(idx) + cfg.cellW / 2;
  const getPillCenter = (idx: number) => (idx < numItems ? getColCenter(idx) : getColLeft(numItems - 1) + cfg.cellW + (cfg.pitch - cfg.cellW) / 2);

  const curI = curView.i;
  const curInsertPos = curView.insertPos;
  const iPosCenter = curI >= 0 ? getPillCenter(curI) : getPillCenter(0);
  const insertPosCenter = getPillCenter(curInsertPos);

  const pillWidth = (label: string) => Math.max(24, label.length * cfg.charW + cfg.pillPad);
  const wI = pillWidth("i");
  const wInsertPos = pillWidth("insertPos");
  const ipPillY = cfg.cellTop + cfg.cellH + cfg.ipGap;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Move Zeroes</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Two pointers pack non-zero values to the front while zeroes drift to the back in order.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={player.isPlaying}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-3 min-h-[1.25rem]">
          <span
            className="text-xs font-semibold"
            style={{ fontFamily: MONO_FONT, color: curView.phase === "done" ? COLOR_GREEN : COLOR_CYAN }}
          >
            {curView.note}
          </span>
          <span className="hidden sm:inline text-[11px] font-bold shrink-0 text-muted-foreground" style={{ fontFamily: MONO_FONT }}>
            insertPos={curView.insertPos} {curView.i >= 0 ? `  i=${curView.i}` : ""}
          </span>
        </div>

        <div>
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="mz" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["amber", COLOR_YELLOW]]} />

            {/* Indices */}
            {DEFAULT_MOVE_ZEROES.map((_, idx) => (
              <text
                key={`ix-${idx}`}
                x={getColCenter(idx)}
                y={cfg.cellTop + cfg.cellH + 14}
                textAnchor="middle"
                fill={colors.idx}
                fontSize={cfg.idxFs}
                fontWeight={700}
                fontFamily={MONO_FONT}
              >
                {idx}
              </text>
            ))}

            {/* Cells */}
            {DEFAULT_MOVE_ZEROES.map((_, originalIdx) => {
              const curSlot = curView.order.indexOf(originalIdx);
              const val = DEFAULT_MOVE_ZEROES[originalIdx];
              const isSettled = curSlot < curView.insertPos;
              const isI = curSlot === curView.i;
              const isInsert = curSlot === curView.insertPos && curView.i >= 0;
              const isZero = val === 0;

              let fill = colors.cell;
              let ring = colors.neutralRing;
              let numColor = colors.bright;
              let glow: string | undefined = undefined;
              let dash: string | undefined = undefined;

              if (isI) {
                ring = COLOR_CYAN;
                glow = "url(#mz-glow-cyan)";
              } else if (isSettled) {
                fill = COLOR_GREEN;
                ring = COLOR_GREEN;
                numColor = colors.ink;
                glow = "url(#mz-glow-green)";
              } else if (isInsert) {
                ring = COLOR_GREEN;
                glow = "url(#mz-glow-green)";
              } else if (isZero) {
                ring = colors.ghostRing;
                fill = colors.ghostCell;
                dash = "5 4";
                numColor = colors.muted;
              }

              const cx = getColCenter(curSlot);
              const cy = cfg.cellTop + cfg.cellH / 2;

              return (
                <g key={`c-${originalIdx}`} transform={`translate(${cx}, ${cy})`}>
                  <rect
                    x={-cfg.cellW / 2}
                    y={-cfg.cellH / 2}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={cfg.rx}
                    fill={fill}
                    stroke={ring}
                    strokeWidth={cfg.ring}
                    strokeDasharray={dash}
                    filter={glow}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={numColor}
                    fontSize={cfg.valueFs}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* i Pointer pill */}
            {curView.i >= 0 && (
              <g>
                <line
                  x1={iPosCenter}
                  y1={cfg.iPillTop + cfg.pillH}
                  x2={iPosCenter}
                  y2={cfg.cellTop}
                  stroke={COLOR_CYAN}
                  strokeWidth={cfg.ring}
                  strokeLinecap="round"
                />
                <rect
                  x={iPosCenter - wI / 2}
                  y={cfg.iPillTop}
                  width={wI}
                  height={cfg.pillH}
                  rx={7}
                  fill={COLOR_CYAN}
                  filter="url(#mz-glow-cyan)"
                />
                <text
                  x={iPosCenter}
                  y={cfg.iPillTop + cfg.pillH / 2 + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.ink}
                  fontSize={cfg.pillFs}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  i
                </text>
              </g>
            )}

            {/* insertPos pointer pill */}
            <g>
              <line
                x1={insertPosCenter}
                y1={cfg.cellTop + cfg.cellH}
                x2={insertPosCenter}
                y2={ipPillY}
                stroke={COLOR_GREEN}
                strokeWidth={cfg.ring}
                strokeLinecap="round"
              />
              <rect
                x={insertPosCenter - wInsertPos / 2}
                y={ipPillY}
                width={wInsertPos}
                height={cfg.pillH}
                rx={7}
                fill={COLOR_GREEN}
                filter="url(#mz-glow-green)"
              />
              <text
                x={insertPosCenter}
                y={ipPillY + cfg.pillH / 2 + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.ink}
                fontSize={cfg.pillFs}
                fontWeight={800}
                fontFamily={MONO_FONT}
              >
                insertPos
              </text>
            </g>
          </svg>
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 11. DYNAMIC ARRAY SIMULATION
// ==========================================
export function DynamicArraySimulation() {
  const [cells, setCells] = useState<number[]>([3, 7, 1]);
  const [capacity, setCapacity] = useState<number>(4);
  const [inputVal, setInputVal] = useState("9");
  const [insertIdx, setInsertIdx] = useState("1");
  const [status, setStatus] = useState("Idle, choose an operation");
  const [resultColor, setResultColor] = useState(COLOR_GREEN);

  const handlePush = useCallback(() => {
    const val = parseInt(inputVal, 10) || 5;
    if (cells.length < capacity) {
      setCells((prev) => [...prev, val]);
      setStatus(`push_back(${val}) at index ${cells.length}`);
      setResultColor(COLOR_GREEN);
    } else {
      const newCap = capacity * 2;
      setCapacity(newCap);
      setCells((prev) => [...prev, val]);
      setStatus(`Capacity full! Doubled buffer to ${newCap}, added ${val}`);
      setResultColor(COLOR_YELLOW);
    }
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [cells, capacity, inputVal]);

  const handlePop = useCallback(() => {
    if (cells.length === 0) {
      setStatus("Array is empty, nothing to pop");
      setResultColor(COLOR_RED);
      return;
    }
    const val = cells[cells.length - 1];
    setCells((prev) => prev.slice(0, -1));
    setStatus(`pop_back() removed ${val}`);
    setResultColor(COLOR_GREEN);
  }, [cells]);

  const handleInsert = useCallback(() => {
    const idx = parseInt(insertIdx, 10);
    const val = parseInt(inputVal, 10) || 5;
    if (isNaN(idx) || idx < 0 || idx > cells.length) {
      setStatus(`Index ${insertIdx} out of bounds (0..${cells.length})`);
      setResultColor(COLOR_RED);
      return;
    }

    if (cells.length < capacity) {
      setCells((prev) => {
        const next = [...prev];
        next.splice(idx, 0, val);
        return next;
      });
      setStatus(`insert(${idx}, ${val})`);
      setResultColor(COLOR_GREEN);
    } else {
      const newCap = capacity * 2;
      setCapacity(newCap);
      setCells((prev) => {
        const next = [...prev];
        next.splice(idx, 0, val);
        return next;
      });
      setStatus(`Buffer full: doubled to ${newCap}, inserted ${val} at ${idx}`);
      setResultColor(COLOR_YELLOW);
    }
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [cells, capacity, inputVal, insertIdx]);

  const handleReset = useCallback(() => {
    setCells([3, 7, 1]);
    setCapacity(4);
    setStatus("Reset to initial state");
    setResultColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 720,
    vbH: 260,
    cellW: 46,
    cellH: 48,
    cellGap: 8,
    mainY: 130,
    pillW: 108,
  };

  const totalBufferW = capacity * cfg.cellW + (capacity - 1) * cfg.cellGap;
  const startX = (cfg.vbW - totalBufferW) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Dynamic Array</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-resizing contiguous memory: doubles capacity when full to achieve O(1) amortized insertion.
          </p>
        </div>
        <button
          onClick={handleReset}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={handlePush}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          push_back({inputVal})
        </button>
        <button
          onClick={handlePop}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          pop_back()
        </button>
        <button
          onClick={handleInsert}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          insert(at={insertIdx}, val={inputVal})
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">val:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
          <span className="text-muted-foreground ml-1">idx:</span>
          <input
            type="number"
            value={insertIdx}
            onChange={(e) => setInsertIdx(e.target.value)}
            className="w-12 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="da" colors={[["green", COLOR_GREEN], ["blue", COLOR_CYAN], ["amber", COLOR_YELLOW]]} />

            {/* Badges: size and capacity */}
            <g transform="translate(40, 20)">
              <rect x={0} y={0} width={cfg.pillW} height={26} rx={13} fill={COLOR_GREEN} />
              <text
                x={cfg.pillW / 2}
                y={13.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#18181b"
                fontSize={12}
                fontWeight={800}
                fontFamily={MONO_FONT}
              >
                size = {cells.length}
              </text>
            </g>
            <g transform="translate(160, 20)">
              <rect x={0} y={0} width={cfg.pillW} height={26} rx={13} fill={COLOR_CYAN} />
              <text
                x={cfg.pillW / 2}
                y={13.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#18181b"
                fontSize={12}
                fontWeight={800}
                fontFamily={MONO_FONT}
              >
                capacity = {capacity}
              </text>
            </g>

            {/* Memory slots outline */}
            {Array.from({ length: capacity }).map((_, i) => {
              const x = startX + i * (cfg.cellW + cfg.cellGap);
              const isFilled = i < cells.length;
              const val = isFilled ? cells[i] : null;

              return (
                <g key={`slot-${i}`}>
                  <rect
                    x={x}
                    y={cfg.mainY}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={8}
                    fill={isFilled ? "#27272a" : "none"}
                    stroke={isFilled ? "rgba(161,161,170,0.5)" : "rgba(161,161,170,0.3)"}
                    strokeWidth={1.5}
                    strokeDasharray={isFilled ? undefined : "5 5"}
                  />
                  {isFilled && (
                    <text
                      x={x + cfg.cellW / 2}
                      y={cfg.mainY + cfg.cellH / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#f4f4f5"
                      fontSize={16}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {val}
                    </text>
                  )}
                  <text
                    x={x + cfg.cellW / 2}
                    y={cfg.mainY + cfg.cellH + 16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#71717a"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily={MONO_FONT}
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Status note */}
            <text
              x={cfg.vbW / 2}
              y={cfg.vbH - 30}
              textAnchor="middle"
              dominantBaseline="central"
              fill={resultColor}
              fontSize={14}
              fontWeight={800}
              fontFamily={MONO_FONT}
              style={{ letterSpacing: 0.5 }}
            >
              {status}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 12. JUMP GAME II (Canvas Runner Simulation)
// ==========================================
const DEFAULT_JUMP_GAME_ARR = [2, 3, 1, 1, 4, 2, 1];

interface JumpFrame {
  kind: string;
  pos: number;
  target: number;
  windowLo: number;
  windowHi: number;
  candidate: number;
  reach: number;
  bestJ: number;
  jumps: number;
  visited: number[];
  note: string;
}

export function JumpGameIISimulation() {
  const arr = DEFAULT_JUMP_GAME_ARR;
  const n = arr.length;
  const targetIdx = n - 1;

  const initialFrame = useMemo<JumpFrame>(
    () => ({
      kind: "idle",
      pos: 0,
      target: -1,
      windowLo: -1,
      windowHi: -1,
      candidate: -1,
      reach: -1,
      bestJ: -1,
      jumps: 0,
      visited: [],
      note: `Start at index 0 (value ${arr[0]}), jumps = 0`,
    }),
    [arr]
  );

  const player = useSimulationPlayback<JumpFrame>(900, initialFrame);

  const frames = useMemo(() => {
    const list: JumpFrame[] = [];
    const visited: number[] = [];
    let cur = 0;
    let jumps = 0;

    const makeStep = (kind: string, note: string): JumpFrame => ({
      kind,
      pos: cur,
      target: -1,
      windowLo: -1,
      windowHi: -1,
      candidate: -1,
      reach: -1,
      bestJ: -1,
      jumps,
      visited: [...visited],
      note,
    });

    list.push(makeStep("start", `Start at index 0 (value ${arr[0]}), jumps = 0`));

    while (cur < targetIdx) {
      const lo = cur + 1;
      const hi = Math.min(targetIdx, cur + arr[cur]);

      if (cur + arr[cur] >= targetIdx) {
        const step = makeStep("window", `From index ${cur} the window is [${lo}..${hi}], the end is in reach`);
        step.windowLo = lo;
        step.windowHi = hi;
        step.bestJ = targetIdx;
        list.push(step);

        jumps++;
        const jStep = makeStep("jump", `Jump ${jumps}: move to index ${targetIdx}`);
        jStep.target = targetIdx;
        jStep.jumps = jumps;
        list.push(jStep);

        visited.push(cur);
        cur = targetIdx;
        break;
      }

      const wStep = makeStep("window", `From index ${cur} the window is [${lo}..${hi}], scan for farthest reach`);
      wStep.windowLo = lo;
      wStep.windowHi = hi;
      list.push(wStep);

      let maxReach = -1;
      let bestPos = lo;

      for (let j = lo; j <= hi; j++) {
        const reach = j + arr[j];
        const isBetter = reach > maxReach;
        if (isBetter) {
          maxReach = reach;
          bestPos = j;
        }

        const scanStep = makeStep(
          "scan",
          isBetter
            ? `Index ${j} reaches ${j} + ${arr[j]} = ${reach}, farthest so far`
            : `Index ${j} reaches ${j} + ${arr[j]} = ${reach}, no improvement`
        );
        scanStep.windowLo = lo;
        scanStep.windowHi = hi;
        scanStep.candidate = j;
        scanStep.reach = reach;
        scanStep.bestJ = bestPos;
        list.push(scanStep);
      }

      jumps++;
      const jumpStep = makeStep("jump", `Jump ${jumps}: move to index ${bestPos}, extends reach to ${maxReach}`);
      jumpStep.target = bestPos;
      jumpStep.jumps = jumps;
      list.push(jumpStep);

      visited.push(cur);
      cur = bestPos;
    }

    const finalStep = makeStep("done", `Reached the end in ${jumps} jumps!`);
    finalStep.pos = targetIdx;
    list.push(finalStep);

    return list;
  }, [arr, targetIdx]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRun = useCallback(() => {
    player.play(frames, 900);
  }, [frames, player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  const curView = player.view;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = {
      skyTop: "#1b1b1f",
      skyBottom: "#232329",
      ground: "#2e2e33",
      platform: "#3f3f46",
      platformTop: "#52525b",
      current: COLOR_CYAN,
      window: COLOR_CYAN,
      chosen: COLOR_YELLOW,
      goal: COLOR_GREEN,
      ball: "#ffa94d",
      ballEdge: "#ff922b",
      visited: "#3bc9db",
      text: "#a1a1aa",
      numText: "#e4e4e7",
      strong: "#f4f4f5",
    };

    const padX = Math.max(24, 0.06 * W);
    const colW = (W - 2 * padX) / n;
    const platW = 0.62 * colW;
    const groundY = H - 48;
    const platTopY = groundY - 18;
    const getPlatX = (idx: number) => padX + colW * (idx + 0.5);
    const ballR = Math.min(14, 0.22 * colW);

    ctx.clearRect(0, 0, W, H);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, colors.skyTop);
    sky.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Ground
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, W, H - groundY);

    // Window shade
    const inWindow = curView.windowLo >= 0 && curView.windowHi >= curView.windowLo;
    if (inWindow) {
      const x1 = getPlatX(curView.windowLo) - platW / 2 - 6;
      const x2 = getPlatX(curView.windowHi) + platW / 2 + 6;
      ctx.fillStyle = colors.window;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(x1, 66, x2 - x1, groundY - 66);
      ctx.globalAlpha = 1;
    }

    // Platforms
    for (let i = 0; i < n; i++) {
      const px = getPlatX(i) - platW / 2;
      const isWindowPlat = inWindow && i >= curView.windowLo && i <= curView.windowHi;
      const isCur = i === curView.pos && curView.kind !== "done";
      const isCandidate = i === curView.candidate;
      const isGoal = i === targetIdx;

      let topCol = colors.platformTop;
      if (isGoal) topCol = colors.goal;
      else if (isCandidate) topCol = colors.chosen;
      else if (isCur) topCol = colors.current;
      else if (isWindowPlat) topCol = colors.window;

      const grad = ctx.createLinearGradient(px, platTopY, px, groundY);
      grad.addColorStop(0, topCol);
      grad.addColorStop(1, colors.platform);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(px, platTopY, platW, 18, 5);
      ctx.fill();

      // Number on platform
      ctx.fillStyle = isCur || isCandidate ? colors.strong : colors.numText;
      ctx.font = `700 15px ${MONO_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(arr[i]), getPlatX(i), platTopY + 10);

      // Index label below ground
      ctx.fillStyle = colors.text;
      ctx.font = `500 12px ${MONO_FONT}`;
      ctx.fillText(String(i), getPlatX(i), groundY + 17);
    }

    // Ball / Avatar
    let ballX = getPlatX(curView.pos);
    let ballY = platTopY - ballR;

    if (curView.kind === "jump" && curView.target >= 0) {
      ballX = getPlatX(curView.target);
    } else if (curView.kind === "done") {
      ballX = getPlatX(targetIdx);
    }

    const ballGrad = ctx.createRadialGradient(ballX - 0.3 * ballR, ballY - 0.3 * ballR, 0.2 * ballR, ballX, ballY, ballR);
    ballGrad.addColorStop(0, colors.ball);
    ballGrad.addColorStop(1, colors.ballEdge);
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballR, 0, 2 * Math.PI);
    ctx.fill();

    // Jumps counter & Note
    ctx.font = `600 13px ${MONO_FONT}`;
    ctx.textAlign = "right";
    ctx.fillStyle = curView.kind === "done" ? colors.goal : colors.current;
    ctx.fillText(`jumps: ${curView.jumps}`, W - padX, 24);

    ctx.textAlign = "left";
    ctx.fillText(curView.note, padX, 24);
  }, [curView, n, arr, targetIdx]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Jump Game II</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Greedy jumps: scan the reachable window, always jump to the spot that extends reach the most.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={player.isPlaying}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-[#1b1b1f]"
        style={{ height: 320 }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.note} />
    </div>
  );
}

// ==========================================
// 13. GAS STATION SIMULATION (Circular Track & Fuel Gauge)
// ==========================================
const DEFAULT_GAS = [2, 5, 2, 3, 5, 4];
const DEFAULT_COST = [4, 3, 4, 5, 2, 3];

interface GasFrame {
  kind: string;
  states: string[];
  start: number;
  scanIdx: number | null;
  carPos: number | null;
  tank: number;
  note: string;
}

export function GasStationSimulation() {
  const gas = DEFAULT_GAS;
  const cost = DEFAULT_COST;
  const n = gas.length;

  const initialFrame = useMemo<GasFrame>(
    () => ({
      kind: "idle",
      states: Array(n).fill("idle"),
      start: 0,
      scanIdx: null,
      carPos: null,
      tank: 0,
      note: "Candidate start S0, tank 0.",
    }),
    [n]
  );

  const player = useSimulationPlayback<GasFrame>(950, initialFrame);

  const { frames, gaugeMax } = useMemo(() => {
    const list: GasFrame[] = [];
    const failedSet = new Set<number>();
    let start = 0;
    let tank = 0;
    let maxTankSeen = 1;

    const makeStates = () => {
      const s = Array(n).fill("idle");
      failedSet.forEach((i) => (s[i] = "failed"));
      if (start < n && !failedSet.has(start)) s[start] = "start";
      return s;
    };

    list.push({
      kind: "scan",
      states: makeStates(),
      start,
      scanIdx: null,
      carPos: null,
      tank: 0,
      note: "Act 1: greedy scan. Candidate start S0, tank 0.",
    });

    for (let i = 0; i < n; i++) {
      const prevTank = tank;
      const diff = gas[i] - cost[i];
      tank += diff;
      maxTankSeen = Math.max(maxTankSeen, tank);

      const st = makeStates();
      st[i] = tank < 0 ? "fail" : "scan";

      list.push({
        kind: "scan",
        states: st,
        start,
        scanIdx: i,
        carPos: null,
        tank,
        note: `S${i}: tank ${prevTank} + ${gas[i]} - ${cost[i]} = ${tank}`,
      });

      if (tank < 0) {
        for (let k = start; k <= i; k++) failedSet.add(k);
        start = i + 1;
        tank = 0;
        list.push({
          kind: "restart",
          states: makeStates(),
          start,
          scanIdx: null,
          carPos: null,
          tank: 0,
          note: `Tank negative at station ${i}, restart candidate at S${start}. Tank resets to 0.`,
        });
      }
    }

    list.push({
      kind: "found",
      states: makeStates(),
      start,
      scanIdx: null,
      carPos: start,
      tank: 0,
      note: `Scan done! Candidate start S${start} can finish the lap. Act 2: drive it!`,
    });

    // Act 2: drive the lap
    const fueled = new Set<number>();
    const makeDriveStates = () => {
      const s = Array(n).fill("idle");
      fueled.forEach((i) => (s[i] = "fueled"));
      if (!fueled.has(start)) s[start] = "start";
      return s;
    };

    let driveTank = 0;
    for (let step = 0; step < n; step++) {
      const s = (start + step) % n;
      const prev = driveTank;
      driveTank += gas[s];
      maxTankSeen = Math.max(maxTankSeen, driveTank);
      fueled.add(s);

      list.push({
        kind: "refuel",
        states: makeDriveStates(),
        start,
        scanIdx: null,
        carPos: start + step,
        tank: driveTank,
        note: `Refuel at S${s}: tank ${prev} + ${gas[s]} = ${driveTank}`,
      });

      driveTank -= cost[s];
      list.push({
        kind: "drive",
        states: makeDriveStates(),
        start,
        scanIdx: null,
        carPos: start + step + 1,
        tank: driveTank,
        note: `Drive S${s} to S${(s + 1) % n}: tank ${driveTank + cost[s]} - ${cost[s]} = ${driveTank}`,
      });
    }

    list.push({
      kind: "win",
      states: Array(n).fill("done"),
      start,
      scanIdx: null,
      carPos: start + n,
      tank: driveTank,
      note: `Start at station S${start}, full lap completed! Tank never dropped below 0.`,
    });

    return { frames: list, gaugeMax: maxTankSeen + 1 };
  }, [gas, cost, n]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleRun = useCallback(() => {
    player.play(frames, 950);
  }, [frames, player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  const curView = player.view;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = container.clientWidth;
    const H = container.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = {
      road: "rgba(161,161,170,0.35)",
      node: "#3f3f46",
      nodeTop: "#52525b",
      ringIdle: "#52525b",
      cyan: COLOR_CYAN,
      green: COLOR_GREEN,
      red: COLOR_RED,
      yellow: COLOR_YELLOW,
      orange: "#ffa94d",
      gaugeBg: "#27272a",
      text: "#a1a1aa",
      strong: "#f4f4f5",
    };

    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 10;
    const r = Math.max(65, Math.min(W / 2, H / 2) - 50);
    const nodeR = 18;
    const getAngle = (i: number) => -Math.PI / 2 + (2 * i * Math.PI) / n;

    // Draw circular road
    ctx.strokeStyle = colors.road;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.stroke();

    // Cost tags between stations
    for (let i = 0; i < n; i++) {
      const midAngle = getAngle(i) + Math.PI / n;
      const tx = cx + (r + nodeR + 15) * Math.cos(midAngle);
      const ty = cy + (r + nodeR + 15) * Math.sin(midAngle);
      ctx.fillStyle = colors.orange;
      ctx.font = `600 12px ${MONO_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`-${cost[i]}`, tx, ty);
    }

    // Stations
    for (let i = 0; i < n; i++) {
      const angle = getAngle(i);
      const sx = cx + r * Math.cos(angle);
      const sy = cy + r * Math.sin(angle);
      const st = curView.states[i];

      let ringCol = colors.ringIdle;
      if (st === "scan") ringCol = colors.cyan;
      else if (st === "fail" || st === "failed") ringCol = colors.red;
      else if (st === "start") ringCol = colors.cyan;
      else if (st === "fueled" || st === "done") ringCol = colors.green;

      // Circle
      const grad = ctx.createRadialGradient(sx - 5, sy - 5, 3, sx, sy, nodeR);
      grad.addColorStop(0, colors.nodeTop);
      grad.addColorStop(1, colors.node);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = ringCol;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sx, sy, nodeR, 0, 2 * Math.PI);
      ctx.stroke();

      // Gas amount inside node
      ctx.fillStyle = colors.strong;
      ctx.font = `700 13px ${MONO_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`+${gas[i]}`, sx, sy);

      // Station label S_i
      const lx = sx + (nodeR + 14) * Math.cos(angle);
      const ly = sy + (nodeR + 14) * Math.sin(angle);
      ctx.fillStyle = ringCol === colors.ringIdle ? colors.text : ringCol;
      ctx.font = `600 12px ${MONO_FONT}`;
      ctx.fillText(`S${i}`, lx, ly);
    }

    // Fuel Tank Gauge in center
    const gW = 32;
    const gH = 64;
    const gx = cx - gW / 2;
    const gy = cy - gH / 2;

    ctx.fillStyle = colors.gaugeBg;
    ctx.beginPath();
    ctx.roundRect(gx, gy, gW, gH, 6);
    ctx.fill();

    const tankFrac = Math.max(0, Math.min(1, curView.tank / gaugeMax));
    const fillH = gH * tankFrac;

    if (fillH > 0) {
      ctx.fillStyle = curView.tank < 0 ? colors.red : colors.yellow;
      ctx.beginPath();
      ctx.roundRect(gx, gy + gH - fillH, gW, fillH, 6);
      ctx.fill();
    }

    ctx.fillStyle = colors.text;
    ctx.font = `600 11px ${MONO_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("tank", cx, gy - 4);

    ctx.fillStyle = curView.tank < 0 ? colors.red : colors.strong;
    ctx.font = `700 15px ${MONO_FONT}`;
    ctx.textBaseline = "top";
    ctx.fillText(`${curView.tank}`, cx, gy + gH + 4);

    // Car position avatar
    if (curView.carPos != null) {
      const carAngle = getAngle(curView.carPos % n);
      const carX = cx + r * Math.cos(carAngle);
      const carY = cy + r * Math.sin(carAngle);

      ctx.fillStyle = curView.kind === "win" ? colors.green : colors.cyan;
      ctx.beginPath();
      ctx.arc(carX, carY, 11, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#18181b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(carX, carY, 11, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [curView, n, gas, cost, gaugeMax]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Gas Station</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Greedy circular search: find the unique starting station to complete a clockwise lap without running dry.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={player.isPlaying}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
        style={{ height: 350 }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.note} />
    </div>
  );
}

// ==========================================
// 14. QUICKSELECT SIMULATION (k-th Smallest Element)
// ==========================================
const DEFAULT_QUICKSELECT_ARR = [7, 2, 9, 4, 1, 8, 5, 3];

export function QuickselectSimulation() {
  const [seed, setSeed] = useState(0);

  const arr = useMemo(() => {
    if (seed === 0) return DEFAULT_QUICKSELECT_ARR;
    const prng = makePrng(seed);
    const set = new Set<number>();
    while (set.size < DEFAULT_QUICKSELECT_ARR.length) {
      set.add(1 + Math.floor(12 * prng()));
    }
    const res = Array.from(set);
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }, [seed]);

  const initialFrame = useMemo(() => ({
    values: [...arr],
    states: Array(arr.length).fill("idle"),
    pointers: [],
    metrics: [{ label: "k", value: "4" }],
    note: "",
    resultText: "",
  }), [arr]);

  const player = useSimulationPlayback(520, initialFrame);

  const frames = useMemo(() => {
    const list: Array<any> = [];
    const t = [...arr];
    const len = t.length;
    let l = 0;
    let r = len - 1;
    const targetRank = 3; // 4th smallest (0-indexed 3)

    const pushStep = (
      note: string,
      opts: { pivot?: number; i?: number; j?: number; goodTo?: number; settled?: number; result?: string } = {}
    ) => {
      const states = Array(len).fill("idle");
      for (let idx = 0; idx < len; idx++) {
        if (idx < l || idx > r) states[idx] = "dim";
      }
      if (opts.goodTo != null) {
        for (let idx = l; idx < opts.goodTo; idx++) states[idx] = "good";
      }
      if (opts.pivot != null) states[opts.pivot] = "best";
      if (opts.j != null) states[opts.j] = "active";
      if (opts.settled != null) {
        for (let idx = 0; idx < len; idx++) {
          if (idx !== opts.settled && (idx < l || idx > r)) states[idx] = "dim";
        }
        states[opts.settled] = "good";
      }

      const pointers: Array<any> = [];
      if (opts.i != null) pointers.push({ index: opts.i, label: "i", color: "green" });
      if (opts.j != null) pointers.push({ index: opts.j, label: "j", color: "cyan" });
      if (opts.pivot != null) pointers.push({ index: opts.pivot, label: "pivot", color: "yellow" });

      list.push({
        values: [...t],
        states,
        window: { lo: l, hi: r },
        pointers,
        metrics: [
          { label: "k", value: "4" },
          { label: "range", value: `[${l}, ${r}]` },
        ],
        note,
        resultText: opts.result ?? "",
        resultTone: opts.result ? "good" : undefined,
      });
    };

    while (l <= r) {
      if (l === r) {
        pushStep("Range has one element, it is the answer", {
          settled: l,
          result: `4th smallest = ${t[l]}`,
        });
        break;
      }

      const pivotIdx = r;
      const pivotVal = t[r];
      let i = l;

      pushStep(`Partition [${l}, ${r}] around pivot ${pivotVal}`, {
        pivot: pivotIdx,
        i,
        j: l,
      });

      for (let j = l; j < r; j++) {
        const isSmaller = t[j] < pivotVal;
        pushStep(isSmaller ? `${t[j]} < ${pivotVal}, send it to left side` : `${t[j]} >= ${pivotVal}, leave it`, {
          pivot: pivotIdx,
          j,
          i,
          goodTo: i,
        });

        if (isSmaller) {
          [t[i], t[j]] = [t[j], t[i]];
          i++;
        }
      }

      [t[i], t[r]] = [t[r], t[i]];
      pushStep(`Pivot ${pivotVal} settles at index ${i}`, { settled: i });

      if (i === targetRank) {
        pushStep(`Index ${i} is rank 4, done!`, {
          settled: i,
          result: `4th smallest = ${t[i]}`,
        });
        break;
      }

      if (i < targetRank) {
        l = i + 1;
        pushStep(`Pivot index ${i} < 3, recurse right into [${l}, ${r}]`);
      } else {
        r = i - 1;
        pushStep(`Pivot index ${i} > 3, recurse left into [${l}, ${r}]`);
      }
    }

    return list;
  }, [arr]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(300, Math.min(560, Math.round(9000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    player.stop();
    setSeed((s) => s + 1);
  }, [player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Quickselect</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Find the kth smallest element in average linear time by partitioning and recursing into one side only.
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleShuffle}
            disabled={player.isPlaying}
            aria-label="New input"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            disabled={player.isPlaying}
            aria-label="Reset"
            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <ArrayRowViewer title="Quickselect" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}
