"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach

function makePrng(seed: number) {
  let s = (0x9e3779b1 * (seed + 19)) % 0x7fffffff;
  if (s <= 0) s += 0x7ffffffe;
  return () => {
    s = (48271 * s) % 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ==========================================
// 1. DISTRIBUTION SORT VIEWER (Counting, Radix, Bucket)
// ==========================================
interface DistroBin {
  label: string;
  count?: number;
  items?: number[];
  active?: boolean;
}

interface DistroSortFrame {
  input: number[];
  inputStates: Record<number, string>;
  output: Array<number | null>;
  outputStates: Record<number, string>;
  binKind: "count" | "bucket";
  bins: DistroBin[];
  note: string;
  ops: number;
  opLabel: string;
  resultText?: string;
}

function DistributionSortViewer({
  mode,
  frame,
}: {
  mode: "counting" | "radix" | "bucket";
  frame: DistroSortFrame;
}) {
  const cfg = {
    vbW: 720,
    vbH: 452,
    plotX: 24,
    plotW: 672,
    inBase: 180,
    maxH: 104,
    binY: 212,
    binH: 70,
    outBase: 408,
    resultY: 440,
    titleFont: 14,
    counterFont: 12.5,
    noteFont: 14,
    zoneFont: 11,
    barLabelFont: 11.5,
    binLabelFont: 10.5,
    binCountFont: 17,
    laneLabelFont: 9.5,
    resultFont: 16,
  };

  const titles = {
    counting: "COUNTING SORT",
    radix: "RADIX SORT (LSD)",
    bucket: "BUCKET SORT",
  };

  const { input, inputStates, output, outputStates, bins, binKind, note, ops, opLabel, resultText } = frame;
  const n = input.length;
  const colW = cfg.plotW / n;
  const barW = colW - 6;
  const maxVal = Math.max(1, ...input, ...output.filter((x): x is number => x != null));
  const numBins = bins.length;
  const binColW = cfg.plotW / numBins;
  const binW = binColW - 6;
  const maxBinCount = Math.max(1, ...bins.map((b) => b.count ?? 0));

  const renderBars = (
    values: Array<number | null>,
    states: Record<number, string>,
    baseY: number
  ) => {
    return values.map((val, idx) => {
      const bx = cfg.plotX + idx * colW + 3;
      if (val == null) {
        return (
          <rect
            key={`null-${idx}`}
            x={bx}
            y={baseY - 18}
            width={barW}
            height={18}
            rx={3}
            fill="none"
            stroke="rgba(161,161,170,0.3)"
            strokeWidth={1}
            strokeDasharray="3 3"
            opacity={0.6}
          />
        );
      }
      const st = states[idx] ?? "idle";
      const bh = (val / maxVal) * cfg.maxH;
      const fill = st === "active" ? COLOR_YELLOW : st === "done" ? COLOR_GREEN : "#000000";
      const isHigh = st === "active" || st === "done";

      return (
        <g key={`bar-${idx}`} opacity={st === "dim" ? 0.32 : 1}>
          <rect
            x={bx}
            y={baseY - bh}
            width={barW}
            height={bh}
            rx={3}
            fill={fill}
            stroke={isHigh ? fill : "rgba(255,255,255,0.18)"}
            strokeWidth={isHigh ? 2 : 1}
          />
          <text
            x={bx + barW / 2}
            y={baseY + 13}
            textAnchor="middle"
            dominantBaseline="central"
            fill={isHigh ? fill : "#FFFFFF"}
            fontSize={cfg.barLabelFont}
            fontWeight={800}
            fontFamily={MONO_FONT}
          >
            {val}
          </text>
        </g>
      );
    });
  };

  return (
    <svg
      viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
      style={{ display: "block", width: "100%", height: "auto" }}
      textRendering="geometricPrecision"
    >
      <GlowDefs prefix="dist" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

      {/* Header Title */}
      <text
        x={cfg.plotX}
        y={16}
        dominantBaseline="hanging"
        fill="#a1a1aa"
        fontFamily={MONO_FONT}
        fontWeight={800}
        fontSize={cfg.titleFont}
        style={{ letterSpacing: 0.5 }}
      >
        {titles[mode]}
      </text>

      {/* Counter */}
      <text
        x={cfg.vbW - cfg.plotX}
        y={16}
        textAnchor="end"
        dominantBaseline="hanging"
        fill="#a1a1aa"
        fontFamily={MONO_FONT}
        fontWeight={800}
        fontSize={cfg.counterFont}
      >
        {opLabel} {ops}
      </text>

      {/* Note */}
      {note && (
        <text
          x={cfg.vbW / 2}
          y={42}
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

      {/* Input zone */}
      <text
        x={cfg.plotX}
        y={cfg.inBase - cfg.maxH - 10}
        dominantBaseline="hanging"
        fill="#71717a"
        fontFamily={MONO_FONT}
        fontWeight={700}
        fontSize={cfg.zoneFont}
        opacity={0.8}
        style={{ letterSpacing: 0.5 }}
      >
        input
      </text>
      {renderBars(input, inputStates, cfg.inBase)}
      <line
        x1={cfg.plotX}
        y1={cfg.inBase + 0.5}
        x2={cfg.plotX + cfg.plotW}
        y2={cfg.inBase + 0.5}
        stroke="rgba(161,161,170,0.35)"
        strokeWidth={1}
      />

      {/* Middle Bins / Counts */}
      {binKind === "count"
        ? bins.map((bin, i) => {
            const bx = cfg.plotX + i * binColW + 3;
            const fillFrac = Math.max(0, (bin.count ?? 0) / maxBinCount);

            return (
              <g key={`bin-${i}`}>
                <rect
                  x={bx}
                  y={cfg.binY}
                  width={binW}
                  height={cfg.binH}
                  rx={6}
                  fill={bin.active ? COLOR_YELLOW : "#000000"}
                  stroke={bin.active ? COLOR_YELLOW : "rgba(255,255,255,0.18)"}
                  strokeWidth={bin.active ? 2 : 1}
                />
                <text
                  x={bx + binW / 2}
                  y={cfg.binY + 13}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={bin.active ? "#09090b" : "#a1a1aa"}
                  fontSize={cfg.binLabelFont}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  {bin.label}
                </text>
                <text
                  x={bx + binW / 2}
                  y={cfg.binY + 36}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={bin.active ? "#09090b" : "#FFFFFF"}
                  fontSize={cfg.binCountFont}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  {bin.count ?? 0}
                </text>
                <rect
                  x={bx + 4}
                  y={cfg.binY + cfg.binH - 9}
                  width={(binW - 8) * fillFrac}
                  height={5}
                  rx={2.5}
                  fill={bin.active ? "#09090b" : COLOR_GREEN}
                />
              </g>
            );
          })
        : bins.map((bin, i) => {
            const bx = cfg.plotX + i * binColW + 3;
            const items = bin.items ?? [];
            const subW = (binW - 6) / Math.max(items.length, 1);

            return (
              <g key={`lane-${i}`}>
                <rect
                  x={bx}
                  y={cfg.binY}
                  width={binW}
                  height={cfg.binH}
                  rx={6}
                  fill={bin.active ? COLOR_YELLOW : "#000000"}
                  stroke={bin.active ? COLOR_YELLOW : "rgba(255,255,255,0.18)"}
                  strokeWidth={bin.active ? 2 : 1}
                />
                {items.map((val, idx) => {
                  const ih = 4 + (val / 99) * (cfg.binH - 26);
                  return (
                    <rect
                      key={`item-${idx}`}
                      x={bx + 3 + idx * subW}
                      y={cfg.binY + cfg.binH - 12 - ih}
                      width={Math.max(3, subW - 2)}
                      height={ih}
                      rx={1.5}
                      fill={bin.active ? "#09090b" : COLOR_GREEN}
                    />
                  );
                })}
                <text
                  x={bx + binW / 2}
                  y={cfg.binY + cfg.binH - 5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={bin.active ? "#09090b" : "#a1a1aa"}
                  fontSize={cfg.laneLabelFont}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  {bin.label}
                </text>
              </g>
            );
          })}

      {/* Output zone */}
      <text
        x={cfg.plotX}
        y={cfg.outBase - cfg.maxH - 10}
        dominantBaseline="hanging"
        fill="#71717a"
        fontFamily={MONO_FONT}
        fontWeight={700}
        fontSize={cfg.zoneFont}
        opacity={0.8}
        style={{ letterSpacing: 0.5 }}
      >
        output
      </text>
      {renderBars(output, outputStates, cfg.outBase)}
      <line
        x1={cfg.plotX}
        y1={cfg.outBase + 0.5}
        x2={cfg.plotX + cfg.plotW}
        y2={cfg.outBase + 0.5}
        stroke="rgba(161,161,170,0.35)"
        strokeWidth={1}
      />

      {/* Result text */}
      {resultText && (
        <text
          x={cfg.vbW / 2}
          y={cfg.resultY}
          textAnchor="middle"
          dominantBaseline="central"
          fill={COLOR_GREEN}
          fontSize={cfg.resultFont}
          fontWeight={800}
          fontFamily={MONO_FONT}
          style={{ letterSpacing: 0.4 }}
        >
          {resultText}
        </text>
      )}
    </svg>
  );
}

// ==========================================
// 2. COUNTING SORT SIMULATION
// ==========================================
export function CountingSortSimulation() {
  const [seed, setSeed] = useState(1);
  const size = 12;

  const initialInput = useMemo(() => {
    const prng = makePrng(seed);
    return Array.from({ length: size }, () => 1 + Math.floor(9 * prng()));
  }, [seed]);

  const initialFrame = useMemo<DistroSortFrame>(() => {
    const bins = Array.from({ length: 9 }, (_, i) => ({
      label: String(i + 1),
      count: 0,
    }));
    return {
      input: [...initialInput],
      inputStates: {},
      output: Array(size).fill(null),
      outputStates: {},
      binKind: "count",
      bins,
      note: "Ready to run counting sort",
      ops: 0,
      opLabel: "writes",
      resultText: "",
    };
  }, [initialInput]);

  const player = useSimulationPlayback<DistroSortFrame>(120, initialFrame);

  const frames = useMemo(() => {
    const list: DistroSortFrame[] = [];
    const arr = [...initialInput];
    const n = arr.length;
    const count = Array(10).fill(0);
    const output: Array<number | null> = Array(n).fill(null);
    let ops = 0;

    const makeBins = (activeVal?: number) => {
      return Array.from({ length: 9 }, (_, i) => {
        const val = i + 1;
        return {
          label: String(val),
          count: count[val],
          active: val === activeVal,
        };
      });
    };

    // Phase 1: Count frequencies
    for (let i = 0; i < n; i++) {
      const v = arr[i];
      count[v]++;
      ops++;
      list.push({
        input: [...arr],
        inputStates: { [i]: "active" },
        output: [...output],
        outputStates: {},
        binKind: "count",
        bins: makeBins(v),
        note: `Tally value ${v}: count[${v}] is now ${count[v]}`,
        ops,
        opLabel: "writes",
      });
    }

    // Phase 2: Prefix sums for cumulative indices
    for (let v = 2; v <= 9; v++) {
      count[v] += count[v - 1];
      ops++;
      list.push({
        input: [...arr],
        inputStates: {},
        output: [...output],
        outputStates: {},
        binKind: "count",
        bins: makeBins(v),
        note: `Prefix sum: count[${v}] += count[${v - 1}] → ${count[v]}`,
        ops,
        opLabel: "writes",
      });
    }

    // Phase 3: Place elements stably backwards
    for (let i = n - 1; i >= 0; i--) {
      const v = arr[i];
      const targetPos = count[v] - 1;
      count[v]--;
      output[targetPos] = v;
      ops++;

      list.push({
        input: [...arr],
        inputStates: { [i]: "active" },
        output: [...output],
        outputStates: { [targetPos]: "done" },
        binKind: "count",
        bins: makeBins(v),
        note: `Place ${v} into output[${targetPos}]`,
        ops,
        opLabel: "writes",
      });
    }

    const finalOutStates: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalOutStates[i] = "done";

    list.push({
      input: [...arr],
      inputStates: {},
      output: [...output],
      outputStates: finalOutStates,
      binKind: "count",
      bins: makeBins(),
      note: "Counting sort completed without any comparisons!",
      ops,
      opLabel: "writes",
      resultText: "Counting sort completed successfully in O(n + k) time.",
    });

    return list;
  }, [initialInput]);

  const handleRun = useCallback(() => {
    player.play(frames, 120);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    setSeed((s) => s + 1);
    player.stop();
  }, [player]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Counting Sort</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tally how many of each value, take prefix sums, then place each into its slot. Zero comparisons!
          </p>
        </div>
        <button
          onClick={handleShuffle}
          disabled={player.isPlaying}
          aria-label="Shuffle"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <DistributionSortViewer mode="counting" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={player.view.resultText || player.view.note} />
    </div>
  );
}

// ==========================================
// 3. RADIX SORT SIMULATION (LSD)
// ==========================================
export function RadixSortSimulation() {
  const [seed, setSeed] = useState(1);
  const size = 12;

  const initialInput = useMemo(() => {
    const prng = makePrng(seed);
    return Array.from({ length: size }, () => Math.floor(100 * prng()));
  }, [seed]);

  const initialFrame = useMemo<DistroSortFrame>(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
      label: String(i),
      count: 0,
    }));
    return {
      input: [...initialInput],
      inputStates: {},
      output: Array(size).fill(null),
      outputStates: {},
      binKind: "count",
      bins,
      note: "Ready to run Radix Sort (LSD)",
      ops: 0,
      opLabel: "writes",
      resultText: "",
    };
  }, [initialInput]);

  const player = useSimulationPlayback<DistroSortFrame>(120, initialFrame);

  const frames = useMemo(() => {
    const framesList: DistroSortFrame[] = [];
    let currentArr = [...initialInput];
    const n = currentArr.length;
    let ops = 0;

    // 2 passes: 1s digit, 10s digit
    for (let exp of [1, 10]) {
      const digitName = exp === 1 ? "ones" : "tens";
      const count = Array(10).fill(0);
      const output: Array<number | null> = Array(n).fill(null);

      const makeBins = (activeDigit?: number) =>
        Array.from({ length: 10 }, (_, i) => ({
          label: String(i),
          count: count[i],
          active: i === activeDigit,
        }));

      for (let i = 0; i < n; i++) {
        const d = Math.floor(currentArr[i] / exp) % 10;
        count[d]++;
        ops++;
        framesList.push({
          input: [...currentArr],
          inputStates: { [i]: "active" },
          output: [...output],
          outputStates: {},
          binKind: "count",
          bins: makeBins(d),
          note: `Pass on ${digitName} digit: tally digit ${d} of ${currentArr[i]}`,
          ops,
          opLabel: "writes",
        });
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
        ops++;
      }

      for (let i = n - 1; i >= 0; i--) {
        const d = Math.floor(currentArr[i] / exp) % 10;
        const targetPos = count[d] - 1;
        count[d]--;
        output[targetPos] = currentArr[i];
        ops++;

        framesList.push({
          input: [...currentArr],
          inputStates: { [i]: "active" },
          output: [...output],
          outputStates: { [targetPos]: "done" },
          binKind: "count",
          bins: makeBins(d),
          note: `Place ${currentArr[i]} into output[${targetPos}]`,
          ops,
          opLabel: "writes",
        });
      }

      currentArr = output.filter((x): x is number => x != null);
    }

    const finalOutStates: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalOutStates[i] = "done";

    framesList.push({
      input: [...currentArr],
      inputStates: {},
      output: [...currentArr],
      outputStates: finalOutStates,
      binKind: "count",
      bins: Array.from({ length: 10 }, (_, i) => ({ label: String(i), count: 0 })),
      note: "Radix sort completed across all digit passes!",
      ops,
      opLabel: "writes",
      resultText: "Radix Sort (LSD) completed in O(d · (n + b)) time.",
    });

    return framesList;
  }, [initialInput]);

  const handleRun = useCallback(() => {
    player.play(frames, 120);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    setSeed((s) => s + 1);
    player.stop();
  }, [player]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Radix Sort (LSD)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Stable counting sort by each digit, least significant first. No comparisons.
          </p>
        </div>
        <button
          onClick={handleShuffle}
          disabled={player.isPlaying}
          aria-label="Shuffle"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <DistributionSortViewer mode="radix" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={player.view.resultText || player.view.note} />
    </div>
  );
}

// ==========================================
// 4. BUCKET SORT SIMULATION
// ==========================================
export function BucketSortSimulation() {
  const [seed, setSeed] = useState(1);
  const size = 12;

  const initialInput = useMemo(() => {
    const prng = makePrng(seed);
    return Array.from({ length: size }, () => Math.floor(100 * prng()));
  }, [seed]);

  const initialFrame = useMemo<DistroSortFrame>(() => {
    const bins = Array.from({ length: 10 }, (_, i) => ({
      label: `${10 * i}-${10 * i + 9}`,
      items: [],
    }));
    return {
      input: [...initialInput],
      inputStates: {},
      output: Array(size).fill(null),
      outputStates: {},
      binKind: "bucket",
      bins,
      note: "Scatter values into 10 range buckets, sort each, concatenate.",
      ops: 0,
      opLabel: "moves",
      resultText: "",
    };
  }, [initialInput]);

  const player = useSimulationPlayback<DistroSortFrame>(140, initialFrame);

  const frames = useMemo(() => {
    const list: DistroSortFrame[] = [];
    const arr = [...initialInput];
    const n = arr.length;
    const buckets: number[][] = Array.from({ length: 10 }, () => []);
    const output: Array<number | null> = Array(n).fill(null);
    let ops = 0;

    const makeBins = (activeBucket?: number) => {
      return buckets.map((items, i) => ({
        label: `${10 * i}-${10 * i + 9}`,
        items: [...items],
        active: i === activeBucket,
      }));
    };

    // Scatter phase
    for (let i = 0; i < n; i++) {
      const v = arr[i];
      const bIdx = Math.min(9, Math.floor(v / 10));
      buckets[bIdx].push(v);
      ops++;

      list.push({
        input: [...arr],
        inputStates: { [i]: "active" },
        output: [...output],
        outputStates: {},
        binKind: "bucket",
        bins: makeBins(bIdx),
        note: `Scatter ${v} into bucket [${10 * bIdx}..${10 * bIdx + 9}]`,
        ops,
        opLabel: "moves",
      });
    }

    // Sort buckets individually
    for (let i = 0; i < 10; i++) {
      buckets[i].sort((a, b) => a - b);
    }

    // Gather phase
    let outIdx = 0;
    for (let bIdx = 0; bIdx < 10; bIdx++) {
      for (const val of buckets[bIdx]) {
        output[outIdx] = val;
        ops++;
        list.push({
          input: [...arr],
          inputStates: {},
          output: [...output],
          outputStates: { [outIdx]: "done" },
          binKind: "bucket",
          bins: makeBins(bIdx),
          note: `Gather ${val} from bucket ${bIdx} to output[${outIdx}]`,
          ops,
          opLabel: "moves",
        });
        outIdx++;
      }
    }

    const finalOutStates: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalOutStates[i] = "done";

    list.push({
      input: [...arr],
      inputStates: {},
      output: [...output],
      outputStates: finalOutStates,
      binKind: "bucket",
      bins: makeBins(),
      note: "Bucket sort complete! Elements are ordered.",
      ops,
      opLabel: "moves",
      resultText: "Bucket sort completed in average O(n + k) time.",
    });

    return list;
  }, [initialInput]);

  const handleRun = useCallback(() => {
    player.play(frames, 140);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    setSeed((s) => s + 1);
    player.stop();
  }, [player]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Bucket Sort</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scatter values into ranged buckets, sort each bucket, then concatenate them in order.
          </p>
        </div>
        <button
          onClick={handleShuffle}
          disabled={player.isPlaying}
          aria-label="Shuffle"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <DistributionSortViewer mode="bucket" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={player.view.resultText || player.view.note} />
    </div>
  );
}

// ==========================================
// 5. EXTERNAL SORT SIMULATION
// ==========================================
interface ExternalSortFrame {
  disk: number[];
  diskStates: Record<number, string>;
  memory: Array<number | null>;
  memStates: Record<number, string>;
  runs: Array<Array<number | null>>;
  output: Array<number | null>;
  outputStates: Record<number, string>;
  note: string;
  reads: number;
  writes: number;
  phase: string;
  resultText?: string;
}

export function ExternalSortSimulation() {
  const [seed, setSeed] = useState(1);
  const n = 12;
  const m = 4; // RAM capacity

  const initialDisk = useMemo(() => {
    const prng = makePrng(seed);
    return Array.from({ length: n }, () => Math.floor(90 * prng()) + 10);
  }, [seed, n]);

  const initialFrame = useMemo<ExternalSortFrame>(() => {
    return {
      disk: [...initialDisk],
      diskStates: {},
      memory: Array(m).fill(null),
      memStates: {},
      runs: [Array(m).fill(null), Array(m).fill(null), Array(m).fill(null)],
      output: Array(n).fill(null),
      outputStates: {},
      note: `Unsorted input file of ${n} records on disk. RAM capacity = ${m}.`,
      reads: 0,
      writes: 0,
      phase: "init",
      resultText: "",
    };
  }, [initialDisk, n, m]);

  const player = useSimulationPlayback<ExternalSortFrame>(350, initialFrame);

  const frames = useMemo(() => {
    const list: ExternalSortFrame[] = [];
    const disk = [...initialDisk];
    const runs: number[][] = [];
    let reads = 0;
    let writes = 0;

    // Pass 0: Create initial sorted runs
    for (let r = 0; r < Math.ceil(n / m); r++) {
      const chunk = disk.slice(r * m, (r + 1) * m);
      reads += chunk.length;

      list.push({
        disk: [...disk],
        diskStates: { [r * m]: "active" },
        memory: [...chunk],
        memStates: {},
        runs: runs.map((rn) => [...rn]),
        output: Array(n).fill(null),
        outputStates: {},
        note: `Pass 0: Read block of ${chunk.length} elements from disk into RAM`,
        reads,
        writes,
        phase: "pass0_read",
      });

      // In-memory sort
      chunk.sort((a, b) => a - b);
      writes += chunk.length;
      runs.push([...chunk]);

      list.push({
        disk: [...disk],
        diskStates: {},
        memory: [...chunk],
        memStates: { 0: "done", 1: "done", 2: "done", 3: "done" },
        runs: runs.map((rn) => [...rn]),
        output: Array(n).fill(null),
        outputStates: {},
        note: `Sort in RAM and write sorted Run ${r} to disk`,
        reads,
        writes,
        phase: "pass0_write",
      });
    }

    // Pass 1: Multiway merge runs into output
    const output: number[] = [];
    const pointers = runs.map(() => 0);

    while (output.length < n) {
      let minVal = Infinity;
      let minRun = -1;

      for (let r = 0; r < runs.length; r++) {
        if (pointers[r] < runs[r].length) {
          if (runs[r][pointers[r]] < minVal) {
            minVal = runs[r][pointers[r]];
            minRun = r;
          }
        }
      }

      if (minRun === -1) break;

      pointers[minRun]++;
      output.push(minVal);
      writes++;

      const outStates: Record<number, string> = {};
      outStates[output.length - 1] = "done";

      list.push({
        disk: [...disk],
        diskStates: {},
        memory: Array(m).fill(null),
        memStates: {},
        runs: runs.map((rn) => [...rn]),
        output: [...output, ...Array(n - output.length).fill(null)],
        outputStates: outStates,
        note: `Merge: smallest among run heads is ${minVal} (Run ${minRun}) → write to output disk`,
        reads,
        writes,
        phase: "merge",
      });
    }

    const finalOutStates: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalOutStates[i] = "done";

    list.push({
      disk: [...disk],
      diskStates: {},
      memory: Array(m).fill(null),
      memStates: {},
      runs: runs.map((rn) => [...rn]),
      output: [...output],
      outputStates: finalOutStates,
      note: "External merge sort complete! File on disk is completely sorted.",
      reads,
      writes,
      phase: "done",
      resultText: `External Sort completed with ${reads} disk reads and ${writes} disk writes.`,
    });

    return list;
  }, [initialDisk, n, m]);

  const handleRun = useCallback(() => {
    player.play(frames, 350);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    setSeed((s) => s + 1);
    player.stop();
  }, [player]);

  const cfg = {
    vbW: 720,
    vbH: 380,
    plotX: 24,
    cellW: 46,
    cellH: 34,
  };

  const curView = player.view;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">External Merge Sort</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sorting massive datasets larger than RAM: stream chunks into memory, write sorted runs, multiway merge.
          </p>
        </div>
        <button
          onClick={handleShuffle}
          disabled={player.isPlaying}
          aria-label="Shuffle"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="ext" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            <text x={cfg.plotX} y={16} dominantBaseline="hanging" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={800} fontSize={13}>
              EXTERNAL MERGE SORT
            </text>
            <text x={cfg.vbW - cfg.plotX} y={16} textAnchor="end" dominantBaseline="hanging" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={800} fontSize={12}>
              reads {curView.reads} · writes {curView.writes}
            </text>

            {curView.note && (
              <text x={cfg.vbW / 2} y={40} textAnchor="middle" dominantBaseline="central" fill={COLOR_CYAN} fontFamily={MONO_FONT} fontWeight={800} fontSize={13}>
                {curView.note}
              </text>
            )}

            {/* Row 1: Disk Input */}
            <text x={cfg.plotX} y={72} dominantBaseline="central" fill="#71717a" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              DISK IN:
            </text>
            {curView.disk.map((v, i) => (
              <g key={`d-${i}`}>
                <rect x={100 + i * 50} y={55} width={cfg.cellW} height={cfg.cellH} rx={6} fill="#27272a" stroke="rgba(161,161,170,0.3)" strokeWidth={1} />
                <text x={100 + i * 50 + cfg.cellW / 2} y={55 + cfg.cellH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontSize={13} fontWeight={800} fontFamily={MONO_FONT}>
                  {v}
                </text>
              </g>
            ))}

            {/* Row 2: RAM Buffer */}
            <text x={cfg.plotX} y={135} dominantBaseline="central" fill="#71717a" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              RAM ({m}):
            </text>
            {curView.memory.map((v, i) => (
              <g key={`m-${i}`}>
                <rect x={100 + i * 50} y={118} width={cfg.cellW} height={cfg.cellH} rx={6} fill={v != null ? "#1f1f22" : "none"} stroke={v != null ? COLOR_CYAN : "rgba(161,161,170,0.25)"} strokeWidth={1.5} strokeDasharray={v == null ? "4 4" : undefined} />
                {v != null && (
                  <text x={100 + i * 50 + cfg.cellW / 2} y={118 + cfg.cellH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={COLOR_CYAN} fontSize={13} fontWeight={800} fontFamily={MONO_FONT}>
                    {v}
                  </text>
                )}
              </g>
            ))}

            {/* Row 3: Runs */}
            <text x={cfg.plotX} y={200} dominantBaseline="central" fill="#71717a" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              RUNS:
            </text>
            {curView.runs.map((rn, rIdx) => (
              <g key={`run-${rIdx}`}>
                {rn.map((v, i) => (
                  <g key={`r-${rIdx}-${i}`}>
                    <rect x={100 + (rIdx * 4 + i) * 50} y={183} width={cfg.cellW} height={cfg.cellH} rx={6} fill={v != null ? "#27272a" : "none"} stroke={v != null ? COLOR_YELLOW : "rgba(161,161,170,0.25)"} strokeWidth={1} strokeDasharray={v == null ? "4 4" : undefined} />
                    {v != null && (
                      <text x={100 + (rIdx * 4 + i) * 50 + cfg.cellW / 2} y={183 + cfg.cellH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="#ffd43b" fontSize={13} fontWeight={800} fontFamily={MONO_FONT}>
                        {v}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            ))}

            {/* Row 4: Output Disk */}
            <text x={cfg.plotX} y={265} dominantBaseline="central" fill="#71717a" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              OUTPUT:
            </text>
            {curView.output.map((v, i) => (
              <g key={`out-${i}`}>
                <rect x={100 + i * 50} y={248} width={cfg.cellW} height={cfg.cellH} rx={6} fill={v != null ? "#27272a" : "none"} stroke={v != null ? COLOR_GREEN : "rgba(161,161,170,0.25)"} strokeWidth={v != null ? 1.5 : 1} strokeDasharray={v == null ? "4 4" : undefined} />
                {v != null && (
                  <text x={100 + i * 50 + cfg.cellW / 2} y={248 + cfg.cellH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill={COLOR_GREEN} fontSize={13} fontWeight={800} fontFamily={MONO_FONT}>
                    {v}
                  </text>
                )}
              </g>
            ))}

            {/* Result text */}
            {curView.resultText && (
              <text x={cfg.vbW / 2} y={340} textAnchor="middle" dominantBaseline="central" fill={COLOR_GREEN} fontSize={14} fontWeight={800} fontFamily={MONO_FONT} style={{ letterSpacing: 0.4 }}>
                {curView.resultText}
              </text>
            )}
          </svg>
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.resultText || curView.note} />
    </div>
  );
}
