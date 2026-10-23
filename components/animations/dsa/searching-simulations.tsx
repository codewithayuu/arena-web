"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle, RotateCcw } from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow

// Deterministic PRNG
function makePrng(seed: number) {
  let s = (0x9e3779b1 * (seed + 11)) % 0x7fffffff;
  if (s <= 0) s += 0x7ffffffe;
  return () => {
    s = (48271 * s) % 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateSortedArray(size: number, seed: number) {
  const prng = makePrng(seed);
  const set = new Set<number>();
  while (set.size < size) {
    set.add(2 + Math.floor(prng() * (2 * size)));
  }
  const values = Array.from(set).sort((a, b) => a - b);
  const target = values[Math.floor(prng() * size)];
  return { values, target };
}

// ==========================================
// 1. BINARY SEARCH SIMULATION
// ==========================================
interface BinarySearchFrame {
  values: number[];
  states: Record<number, string>; // "idle" | "active" | "found" | "dim"
  pointers: { label: string; index: number }[];
  shade?: { lo: number; hi: number; kind: "range" };
  metrics: { label: string; value: string }[];
  note: string;
  resultText?: string;
}

export function BinarySearchSimulation() {
  const [size, setSize] = useState(12);
  const [seed, setSeed] = useState(1);
  const [dataset, setDataset] = useState(() => generateSortedArray(12, 1));

  // Generate all playback frames
  const frames = useMemo<BinarySearchFrame[]>(() => {
    const { values, target } = dataset;
    const n = values.length;
    const list: BinarySearchFrame[] = [];

    const makeStates = (lo: number, hi: number, activeIdx?: number, isFound = false) => {
      const states: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (i < lo || i > hi) {
          states[i] = "dim";
        } else {
          states[i] = "idle";
        }
      }
      if (activeIdx !== undefined) {
        states[activeIdx] = isFound ? "found" : "active";
      }
      return states;
    };

    // Initial frame
    list.push({
      values: [...values],
      states: makeStates(0, n - 1),
      pointers: [
        { label: "lo", index: 0 },
        { label: "mid", index: Math.floor((n - 1) / 2) },
        { label: "hi", index: n - 1 },
      ],
      shade: { lo: 0, hi: n - 1, kind: "range" },
      metrics: [
        { label: "target", value: String(target) },
        { label: "arr[mid]", value: String(values[Math.floor((n - 1) / 2)]) },
      ],
      note: `Search range [0, ${n - 1}]. Target is ${target}.`,
      resultText: "",
    });

    let lo = 0;
    let hi = n - 1;
    let found = false;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const midVal = values[mid];

      if (midVal === target) {
        found = true;
        list.push({
          values: [...values],
          states: makeStates(lo, hi, mid, true),
          pointers: [
            { label: "lo", index: lo },
            { label: "mid", index: mid },
            { label: "hi", index: hi },
          ],
          shade: { lo, hi, kind: "range" },
          metrics: [
            { label: "target", value: String(target) },
            { label: "arr[mid]", value: String(midVal) },
          ],
          note: `arr[mid] = ${target}. Target found!`,
          resultText: `found ${target} at index ${mid}`,
        });
        break;
      }

      if (midVal < target) {
        list.push({
          values: [...values],
          states: makeStates(lo, hi, mid, false),
          pointers: [
            { label: "lo", index: lo },
            { label: "mid", index: mid },
            { label: "hi", index: hi },
          ],
          shade: { lo, hi, kind: "range" },
          metrics: [
            { label: "target", value: String(target) },
            { label: "arr[mid]", value: String(midVal) },
          ],
          note: `arr[mid] ${midVal} < ${target}, search right half`,
          resultText: "",
        });
        lo = mid + 1;
      } else {
        list.push({
          values: [...values],
          states: makeStates(lo, hi, mid, false),
          pointers: [
            { label: "lo", index: lo },
            { label: "mid", index: mid },
            { label: "hi", index: hi },
          ],
          shade: { lo, hi, kind: "range" },
          metrics: [
            { label: "target", value: String(target) },
            { label: "arr[mid]", value: String(midVal) },
          ],
          note: `arr[mid] ${midVal} > ${target}, search left half`,
          resultText: "",
        });
        hi = mid - 1;
      }
    }

    if (!found) {
      const dimAll: Record<number, string> = {};
      for (let i = 0; i < n; i++) dimAll[i] = "dim";
      list.push({
        values: [...values],
        states: dimAll,
        pointers: [],
        metrics: [{ label: "target", value: String(target) }],
        note: `Target ${target} not found in array`,
        resultText: `${target} is not in the array`,
      });
    }

    return list;
  }, [dataset]);

  const initialFrame = frames[0] || {
    values: dataset.values,
    states: {},
    pointers: [],
    metrics: [{ label: "target", value: String(dataset.target) }],
    note: "",
    resultText: "",
  };

  const playback = useSimulationPlayback(350, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 320);
  }, [playback, frames]);

  const handleShuffle = useCallback(() => {
    setSeed((s) => {
      const nextSeed = s + 1;
      const nextData = generateSortedArray(size, nextSeed);
      setDataset(nextData);
      return nextSeed;
    });
    playback.stop();
  }, [size, playback]);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      setSize(newSize);
      setDataset(generateSortedArray(newSize, seed));
      playback.stop();
    },
    [seed, playback]
  );

  // SVG layout metrics (720x344)
  const vbW = 720;
  const vbH = 344;
  const plotX = 24;
  const baseY = 250;
  const maxH = 168;
  const barGap = 6;
  const noteY = 42;
  const resultY = 322;

  const arrLen = currentFrame.values.length;
  const plotW = vbW - 2 * plotX;
  const slotW = plotW / arrLen;
  const barW = slotW - barGap;
  const maxVal = Math.max(1, ...currentFrame.values);

  // Pointer vertical stacking map
  const pointerCounts: Record<number, number> = {};

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header controls */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Binary Search</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Halve the search range each step: compare the middle element to the target and keep one half.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">size</span>
          <input
            type="range"
            min={8}
            max={18}
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            disabled={playback.isPlaying}
            className="h-1.5 w-28 cursor-pointer accent-cyan-400 disabled:opacity-50"
          />
          <span className="text-xs text-muted-foreground tabular-nums w-5 text-right">{size}</span>
          <SimpleTooltip content="Generate new array & target">
            <button
              onClick={handleShuffle}
              disabled={playback.isPlaying}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="w-full h-auto select-none"
          style={{ fontFamily: MONO_FONT }}
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="search"
            colors={[
              ["cyan", COLOR_CYAN],
              ["green", COLOR_GREEN],
              ["red", COLOR_RED],
              ["yellow", COLOR_YELLOW],
            ]}
          />

          {/* Top header & metrics */}
          <text
            x={plotX}
            y={16}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontWeight={800}
            fontSize={13}
          >
            BINARY SEARCH
          </text>
          <text
            x={vbW - plotX}
            y={16}
            textAnchor="end"
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontWeight={800}
            fontSize={13}
          >
            {currentFrame.metrics.map((m) => `${m.label} ${m.value}`).join("  ·  ")}
          </text>

          {/* Central note */}
          {currentFrame.note ? (
            <text
              x={vbW / 2}
              y={noteY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_CYAN}
              fontWeight={800}
              fontSize={13}
            >
              {currentFrame.note}
            </text>
          ) : null}

          {/* Active search range shade */}
          {currentFrame.shade ? (
            <rect
              x={plotX + currentFrame.shade.lo * slotW + 2}
              y={baseY - maxH - 4}
              width={(currentFrame.shade.hi - currentFrame.shade.lo + 1) * slotW - 4}
              height={maxH + 4}
              rx={6}
              fill={COLOR_CYAN}
              opacity={0.1}
            />
          ) : null}

          {/* Array bars */}
          {currentFrame.values.map((val, idx) => {
            const st = currentFrame.states[idx] || "idle";
            const h = (val / maxVal) * maxH;
            const x = plotX + idx * slotW + barGap / 2;
            const y = baseY - h;

            let fill = "#000000";
            let stroke = "rgba(255,255,255,0.2)";
            let isHighlight = false;

            if (st === "active") {
              fill = COLOR_YELLOW;
              stroke = COLOR_YELLOW;
              isHighlight = true;
            } else if (st === "found") {
              fill = COLOR_GREEN;
              stroke = COLOR_GREEN;
              isHighlight = true;
            } else if (st === "dim") {
              fill = "#000000";
              stroke = "rgba(255,255,255,0.08)";
            }

            const opacity = st === "dim" ? 0.3 : 1;

            return (
              <g key={idx} opacity={opacity}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  rx={3}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isHighlight ? 1.5 : 1}
                  filter={st === "active" ? "url(#search-glow-cyan)" : undefined}
                />
                <text
                  x={x + barW / 2}
                  y={baseY + 12}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHighlight ? fill : "#a1a1aa"}
                  fontSize={11}
                  fontWeight={800}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Baseline */}
          <line
            x1={plotX}
            y1={baseY + 0.5}
            x2={plotX + plotW}
            y2={baseY + 0.5}
            stroke="rgba(161,161,170,0.35)"
            strokeWidth={1}
          />

          {/* Pointers lo, mid, hi */}
          {currentFrame.pointers.map((ptr, pIdx) => {
            const stack = pointerCounts[ptr.index] || 0;
            pointerCounts[ptr.index] = stack + 1;

            const px = plotX + ptr.index * slotW + slotW / 2;
            const py = baseY + 24 + stack * 13;

            return (
              <g key={`ptr-${pIdx}`}>
                {stack === 0 ? (
                  <path
                    d={`M ${px} ${baseY + 20} l -4 6 l 8 0 z`}
                    fill="#f4f4f5"
                  />
                ) : null}
                <text
                  x={px}
                  y={py + 6}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#f4f4f5"
                  fontSize={11}
                  fontWeight={800}
                >
                  {ptr.label}
                </text>
              </g>
            );
          })}

          {/* Result text */}
          {currentFrame.resultText ? (
            <text
              x={vbW / 2}
              y={resultY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={currentFrame.resultText.startsWith("found") ? COLOR_GREEN : "#f4f4f5"}
              fontSize={15}
              fontWeight={800}
              style={{ letterSpacing: "0.4px" }}
            >
              {currentFrame.resultText}
            </text>
          ) : null}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 2. NAIVE STRING SEARCH SIMULATION
// ==========================================
interface NaiveSearchFrame {
  text: string;
  pattern: string;
  shift: number;
  textStates: Record<number, string>; // "idle" | "match" | "mismatch" | "found"
  patternStates: Record<number, string>;
  carets: { index: number; label: string; row: "text" | "pattern" }[];
  found: number[];
  metrics: { label: string; value: string }[];
  note: string;
  resultText: string;
}

const NAIVE_SCENARIOS = [
  { id: "repeat", name: "Repeated Pattern", text: "ABABDABACDABABCABAB", pattern: "ABABCABAB" },
  { id: "dna", name: "DNA Sequence", text: "GCATCGCAGAGAGTATACAG", pattern: "GCAGAGAG" },
  { id: "hits", name: "Multiple Hits", text: "AABAACAADAABAABA", pattern: "AABA" },
];

export function NaiveSearchSimulation() {
  const [scenarioId, setScenarioId] = useState("repeat");
  const currentScenario = NAIVE_SCENARIOS.find((s) => s.id === scenarioId) || NAIVE_SCENARIOS[0];
  const [text, setText] = useState(currentScenario.text);
  const [pattern, setPattern] = useState(currentScenario.pattern);

  // Generate frames
  const frames = useMemo<NaiveSearchFrame[]>(() => {
    const list: NaiveSearchFrame[] = [];
    const tLen = text.length;
    const pLen = pattern.length;

    if (!pattern || pLen === 0) {
      return [
        {
          text,
          pattern: "",
          shift: 0,
          textStates: {},
          patternStates: {},
          carets: [],
          found: [],
          metrics: [],
          note: "Enter a pattern to search for",
          resultText: "",
        },
      ];
    }

    if (pLen > tLen) {
      return [
        {
          text,
          pattern,
          shift: 0,
          textStates: {},
          patternStates: {},
          carets: [],
          found: [],
          metrics: [],
          note: "Pattern is longer than text",
          resultText: "Pattern not found",
        },
      ];
    }

    const foundMatches: number[] = [];
    let comparisons = 0;

    const applyFoundStates = (tStates: Record<number, string>) => {
      for (const startIdx of foundMatches) {
        for (let k = 0; k < pLen; k++) {
          tStates[startIdx + k] = "found";
        }
      }
    };

    // Initial frame
    const initTStates: Record<number, string> = {};
    list.push({
      text,
      pattern,
      shift: 0,
      textStates: initTStates,
      patternStates: {},
      carets: [],
      found: [],
      metrics: [
        { label: "shift", value: "0" },
        { label: "comparisons", value: "0" },
      ],
      note: "Ready to start naive sliding window search",
      resultText: "",
    });

    for (let shift = 0; shift + pLen <= tLen; shift++) {
      let j = 0;
      for (; j < pLen; j++) {
        comparisons++;
        const isMatch = text[shift + j] === pattern[j];

        const tStates: Record<number, string> = {};
        const pStates: Record<number, string> = {};
        applyFoundStates(tStates);

        for (let k = 0; k < j; k++) {
          tStates[shift + k] = "match";
          pStates[k] = "match";
        }

        tStates[shift + j] = isMatch ? "match" : "mismatch";
        pStates[j] = isMatch ? "match" : "mismatch";

        list.push({
          text,
          pattern,
          shift,
          textStates: tStates,
          patternStates: pStates,
          carets: [
            { index: shift + j, label: "i", row: "text" },
            { index: j, label: "j", row: "pattern" },
          ],
          found: [...foundMatches],
          metrics: [
            { label: "shift", value: String(shift) },
            { label: "comparisons", value: String(comparisons) },
          ],
          note: isMatch
            ? `text[${shift + j}] = '${text[shift + j]}' equals pattern[${j}], advance`
            : `text[${shift + j}] = '${text[shift + j]}' not pattern[${j}], slide window to ${shift + 1}`,
          resultText: "",
        });

        if (!isMatch) break;
      }

      if (j === pLen) {
        foundMatches.push(shift);
        const tStates: Record<number, string> = {};
        applyFoundStates(tStates);
        const pStates: Record<number, string> = {};
        for (let k = 0; k < pLen; k++) pStates[k] = "found";

        list.push({
          text,
          pattern,
          shift,
          textStates: tStates,
          patternStates: pStates,
          carets: [],
          found: [...foundMatches],
          metrics: [
            { label: "shift", value: String(shift) },
            { label: "comparisons", value: String(comparisons) },
          ],
          note: `Full match at index ${shift}!`,
          resultText: `Found at index ${foundMatches.join(", ")}`,
        });
      }
    }

    // Final summary frame
    const finalTStates: Record<number, string> = {};
    applyFoundStates(finalTStates);
    list.push({
      text,
      pattern,
      shift: 0,
      textStates: finalTStates,
      patternStates: {},
      carets: [],
      found: [...foundMatches],
      metrics: [{ label: "comparisons", value: String(comparisons) }],
      note: foundMatches.length
        ? `Done. ${foundMatches.length} match${foundMatches.length > 1 ? "es" : ""} found.`
        : "Done. Pattern does not occur in text.",
      resultText: foundMatches.length
        ? `Found at index ${foundMatches.join(", ")}`
        : "Pattern not found",
    });

    return list;
  }, [text, pattern]);

  const initialFrame = frames[0] || {
    text,
    pattern,
    shift: 0,
    textStates: {},
    patternStates: {},
    carets: [],
    found: [],
    metrics: [],
    note: "",
    resultText: "",
  };

  const playback = useSimulationPlayback(300, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 280);
  }, [playback, frames]);

  const handleSelectScenario = useCallback(
    (id: string) => {
      setScenarioId(id);
      const sc = NAIVE_SCENARIOS.find((s) => s.id === id) || NAIVE_SCENARIOS[0];
      setText(sc.text);
      setPattern(sc.pattern);
      playback.stop();
    },
    [playback]
  );

  const handleReset = useCallback(() => {
    playback.stop();
  }, [playback]);

  const cellW = 28;
  const tLen = text.length;

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header & Scenarios */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Naive String Search</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-[480px]">
            Slide the pattern one step at a time and compare characters left to right until it fully matches.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {NAIVE_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id)}
                disabled={playback.isPlaying}
                className={`px-2.5 py-1 transition-colors ${
                  scenarioId === sc.id
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:bg-muted"
                } disabled:opacity-50`}
              >
                {sc.name}
              </button>
            ))}
          </div>
          <SimpleTooltip content="Reset simulation">
            <button
              onClick={handleReset}
              disabled={playback.isPlaying}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      {/* Pattern input */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-muted-foreground">pattern</label>
        <input
          value={pattern}
          onChange={(e) => {
            setPattern(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 14));
            playback.stop();
          }}
          disabled={playback.isPlaying}
          maxLength={14}
          className="h-7 w-44 rounded-md border border-border bg-card px-2 text-xs font-mono tracking-widest uppercase outline-none focus:border-cyan-400 disabled:opacity-50"
        />
      </div>

      {/* Interactive Visual Canvas Area */}
      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-x-auto select-none">
        <div className="min-w-fit mx-auto space-y-4" style={{ fontFamily: MONO_FONT }}>
          {/* Top labels */}
          <div className="flex items-baseline justify-between gap-3 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              NAIVE SEARCH
            </span>
            <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
              {currentFrame.metrics.map((m) => `${m.label} ${m.value}`).join("   ·   ")}
            </span>
          </div>

          {/* Grid rows */}
          <div className="space-y-1.5 pt-2">
            {/* 1. Text Index Numbers */}
            <div className="flex">
              {Array.from({ length: tLen }).map((_, idx) => (
                <div
                  key={`idx-${idx}`}
                  style={{ width: cellW }}
                  className="flex items-center justify-center shrink-0 text-[10px] text-muted-foreground tabular-nums"
                >
                  {idx}
                </div>
              ))}
            </div>

            {/* 2. Text Characters */}
            <div className="flex">
              {text.split("").map((ch, idx) => {
                const st = currentFrame.textStates[idx] || "idle";
                let bg = "bg-[#27272a]";
                let textCol = "text-foreground";
                let border = "border-border/60";

                if (st === "match" || st === "found") {
                  bg = "bg-[#86EFAC]";
                  textCol = "text-[#09090b] font-bold";
                  border = "border-[#86EFAC]";
                } else if (st === "mismatch") {
                  bg = "bg-[#FCA5A5]";
                  textCol = "text-[#09090b] font-bold";
                  border = "border-[#FCA5A5]";
                }

                return (
                  <div
                    key={`ch-${idx}`}
                    style={{ width: cellW }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <div
                      className={`w-6 h-7 rounded-[5px] border flex items-center justify-center text-xs font-bold transition-colors ${bg} ${textCol} ${border}`}
                    >
                      {ch}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Text Caret (i) */}
            <div className="flex h-5">
              {Array.from({ length: tLen }).map((_, idx) => {
                const caret = currentFrame.carets.find((c) => c.row === "text" && c.index === idx);
                return (
                  <div
                    key={`t-caret-${idx}`}
                    style={{ width: cellW }}
                    className="flex flex-col items-center justify-center shrink-0 leading-none text-sky-300 font-bold"
                  >
                    {caret ? (
                      <>
                        <span className="text-[8px]">▲</span>
                        <span className="text-[9px]">{caret.label}</span>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* 4. Pattern Characters (Shifted by currentFrame.shift) */}
            {pattern ? (
              <div className="flex">
                {Array.from({ length: tLen }).map((_, idx) => {
                  const pIdx = idx - currentFrame.shift;
                  const inBounds = pIdx >= 0 && pIdx < pattern.length;
                  if (!inBounds) {
                    return <div key={`p-empty-${idx}`} style={{ width: cellW }} className="shrink-0" />;
                  }

                  const st = currentFrame.patternStates[pIdx] || "idle";
                  let bg = "bg-[#27272a]";
                  let textCol = "text-foreground";
                  let border = "border-border/60";

                  if (st === "match" || st === "found") {
                    bg = "bg-[#86EFAC]";
                    textCol = "text-[#09090b] font-bold";
                    border = "border-[#86EFAC]";
                  } else if (st === "mismatch") {
                    bg = "bg-[#FCA5A5]";
                    textCol = "text-[#09090b] font-bold";
                    border = "border-[#FCA5A5]";
                  }

                  return (
                    <div
                      key={`p-ch-${idx}`}
                      style={{ width: cellW }}
                      className="flex items-center justify-center shrink-0"
                    >
                      <div
                        className={`w-6 h-7 rounded-[5px] border flex items-center justify-center text-xs font-bold transition-colors ${bg} ${textCol} ${border}`}
                      >
                        {pattern[pIdx]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* 5. Pattern Caret (j) */}
            {pattern ? (
              <div className="flex h-5">
                {Array.from({ length: tLen }).map((_, idx) => {
                  const pIdx = idx - currentFrame.shift;
                  const caret = currentFrame.carets.find(
                    (c) => c.row === "pattern" && c.index === pIdx
                  );
                  return (
                    <div
                      key={`p-caret-${idx}`}
                      style={{ width: cellW }}
                      className="flex flex-col items-center justify-center shrink-0 leading-none text-cyan-400 font-bold"
                    >
                      {caret ? (
                        <>
                          <span className="text-[8px]">▲</span>
                          <span className="text-[9px]">{caret.label}</span>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Note & Result Message */}
          {currentFrame.note ? (
            <div className="mt-3 text-xs font-semibold text-cyan-400">
              {currentFrame.note}
            </div>
          ) : null}

          {currentFrame.resultText ? (
            <div
              className={`mt-1 text-sm font-bold ${
                currentFrame.resultText.startsWith("Found") ? "text-[#67E8F9]" : "text-muted-foreground"
              }`}
            >
              {currentFrame.resultText}
            </div>
          ) : null}
        </div>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}
