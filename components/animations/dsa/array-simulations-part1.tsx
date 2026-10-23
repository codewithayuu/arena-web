"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle, RotateCcw } from "lucide-react";

// ==========================================
// COMMON HELPERS & DESIGN CONSTANTS
// ==========================================
const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Pastel Mint Green
const COLOR_YELLOW = "#FDE047"; // Pastel Butter Yellow
const COLOR_RED = "#FCA5A5";    // Pastel Rose

// Pseudorandom generator with seed
function makePrng(seed: number) {
  let s = (0x9e3779b1 * (seed + 11)) % 0x7fffffff;
  if (s <= 0) s += 0x7ffffffe;
  return () => {
    s = (48271 * s) % 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ==========================================
// 1. ARRAY ROW VIEWER (Used by Two Pointers & Sliding Window)
// ==========================================
interface ArrayRowViewerProps {
  title: string;
  frame: {
    values: number[];
    states: string[];
    window?: { lo: number; hi: number };
    pointers: Array<{ index: number; label: string; color?: "cyan" | "green" | "yellow" }>;
    metrics: Array<{ label: string; value: string }>;
    note?: string;
    resultText?: string;
    resultTone?: "good" | "bad";
  };
  compact?: boolean;
}

export function ArrayRowViewer({ title, frame, compact = false }: ArrayRowViewerProps) {
  const cfg = compact
    ? {
        vbW: 440,
        vbH: 264,
        plotX: 16,
        cellTop: 84,
        cellH: 44,
        resultY: 236,
        noteY: 48,
        headerFont: 11,
        noteFont: 12,
        valueFont: 12.5,
        idxFont: 9.5,
        ptrFont: 10,
        resultFont: 13.5,
        cellGap: 5,
      }
    : {
        vbW: 720,
        vbH: 300,
        plotX: 28,
        cellTop: 96,
        cellH: 52,
        resultY: 268,
        noteY: 52,
        headerFont: 13,
        noteFont: 13,
        valueFont: 14,
        idxFont: 10.5,
        ptrFont: 11,
        resultFont: 15,
        cellGap: 8,
      };

  const colors = {
    text: "#FFFFFF",
    label: "#a1a1aa",
    cell: "#000000",
    cellStroke: "rgba(255,255,255,0.18)",
    ink: "#09090b",
    idxLabel: "#a1a1aa",
  };

  const ptrColorMap = {
    cyan: COLOR_CYAN,
    green: COLOR_GREEN,
    yellow: COLOR_YELLOW,
  };

  const { values, states, window: win, pointers, metrics, note, resultText, resultTone } = frame;
  const n = values.length;
  const colW = (cfg.vbW - 2 * cfg.plotX) / n;
  const cellW = colW - cfg.cellGap;
  const metricsStr = metrics.map((m) => `${m.label} ${m.value}`).join(compact ? "  ·  " : "   ·   ");
  const getX = (idx: number) => cfg.plotX + idx * colW + cfg.cellGap / 2;

  const ptrCountMap: Record<number, number> = {};

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
        style={{ display: "block", width: "100%", height: "auto" }}
        textRendering="geometricPrecision"
      >
        <GlowDefs prefix="row" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["yellow", COLOR_YELLOW]]} />
        {/* Header Title */}
        <text
          x={cfg.plotX}
          y={16}
          dominantBaseline="hanging"
          fill={colors.label}
          fontFamily={MONO_FONT}
          fontWeight={800}
          fontSize={cfg.headerFont}
          style={{ letterSpacing: 0.5 }}
        >
          {title.toUpperCase()}
        </text>

        {/* Metrics */}
        <text
          x={cfg.vbW - cfg.plotX}
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

        {/* Note / Narration */}
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

        {/* Window Outline */}
        {win && win.hi >= win.lo && (
          <rect
            x={getX(win.lo) - 4}
            y={cfg.cellTop - 10}
            width={(win.hi - win.lo) * colW + cellW + 8}
            height={cfg.cellH + 20}
            rx={9}
            fill="none"
            stroke={COLOR_CYAN}
            strokeWidth={2}
          />
        )}

        {/* Cells */}
        {values.map((val, idx) => {
          const st = states[idx] ?? "idle";
          const isSpecial = st === "active" || st === "good" || st === "bad" || st === "best";
          const fill =
            st === "active"
              ? COLOR_CYAN
              : st === "good"
              ? COLOR_GREEN
              : st === "bad"
              ? COLOR_RED
              : st === "best"
              ? COLOR_YELLOW
              : colors.cell;
          const hasInk = isSpecial;
          const x = getX(idx);

          return (
            <g key={idx} opacity={st === "dim" ? 0.32 : 1}>
              <rect
                x={x}
                y={cfg.cellTop}
                width={cellW}
                height={cfg.cellH}
                rx={compact ? 6 : 7}
                fill={fill}
                stroke={isSpecial ? fill : colors.cellStroke}
                strokeWidth={isSpecial ? 2 : 1.25}
                filter={st === "active" ? "url(#row-glow-cyan)" : undefined}
              />
              <text
                x={x + cellW / 2}
                y={cfg.cellTop + cfg.cellH / 2 + 0.5}
                textAnchor="middle"
                dominantBaseline="central"
                fill={hasInk ? colors.ink : colors.text}
                fontSize={cfg.valueFont}
                fontWeight={800}
                fontFamily={MONO_FONT}
              >
                {val}
              </text>
              <text
                x={x + cellW / 2}
                y={cfg.cellTop - (compact ? 11 : 14)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={colors.idxLabel}
                fontSize={cfg.idxFont}
                fontWeight={700}
                fontFamily={MONO_FONT}
              >
                {idx}
              </text>
            </g>
          );
        })}

        {/* Pointers */}
        {pointers.map((ptr, idx) => {
          const level = ptrCountMap[ptr.index] ?? 0;
          ptrCountMap[ptr.index] = level + 1;
          const x = getX(ptr.index) + cellW / 2;
          const col = ptrColorMap[ptr.color ?? "cyan"];
          const y = cfg.cellTop + cfg.cellH + (compact ? 16 : 18) + level * (compact ? 13 : 15);

          return (
            <g key={`p-${idx}`}>
              {level === 0 && (
                <path
                  d={`M ${x} ${cfg.cellTop + cfg.cellH + 6} l -5 7 l 10 0 z`}
                  fill={col}
                />
              )}
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={col}
                fontSize={cfg.ptrFont}
                fontWeight={800}
                fontFamily={MONO_FONT}
              >
                {ptr.label}
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
  );
}

// ==========================================
// 2. BAR POINTER FRAMEWORK (Two Sum & Container Water)
// ==========================================
interface BarPointerFrame {
  values: number[];
  states: string[];
  pointers: Array<{ index: number; label: string }>;
  shade?: { lo: number; hi: number; height?: number; kind: "range" | "area" };
  metrics: Array<{ label: string; value: string }>;
  note?: string;
  resultText?: string;
}

function generateBarPointerData(mode: "two-sum" | "container", seed: number, count: number) {
  const prng = makePrng(seed);
  const n = Math.max(3, Math.round(count));

  if (mode === "container") {
    const values = Array.from({ length: n }, (_, i) => i + 1);
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    return { values, target: null };
  }

  // Two sum: sorted array of unique integers
  const set = new Set<number>();
  while (set.size < n) {
    set.add(2 + Math.floor(prng() * (2 * n)));
  }
  const values = Array.from(set).sort((a, b) => a - b);
  const i = Math.floor(prng() * n);
  let j = Math.floor(prng() * n);
  if (i === j) j = (j + 1) % n;
  const target = values[i] + values[j];
  return { values, target };
}

function BarPointerSvgViewer({
  mode,
  frame,
  compact = false,
}: {
  mode: "two-sum" | "container";
  frame: BarPointerFrame;
  compact?: boolean;
}) {
  const cfg = compact
    ? {
        vbW: 440,
        vbH: 296,
        plotX: 14,
        baseY: 212,
        maxH: 132,
        resultY: 276,
        noteY: 40,
        headerFont: 11,
        noteFont: 12,
        valueFont: 9.5,
        ptrFont: 10,
        resultFont: 13.5,
        barGap: 4,
      }
    : {
        vbW: 720,
        vbH: 344,
        plotX: 24,
        baseY: 250,
        maxH: 168,
        resultY: 322,
        noteY: 42,
        headerFont: 13,
        noteFont: 13,
        valueFont: 11,
        ptrFont: 11,
        resultFont: 15,
        barGap: 6,
      };

  const colors = {
    text: "#FFFFFF",
    label: "#a1a1aa",
    bar: "#000000",
    barStroke: "rgba(255,255,255,0.2)",
  };

  const titles = {
    "two-sum": "TWO SUM",
    container: "CONTAINER WITH MOST WATER",
  };

  const { values, states, pointers, shade, metrics, note, resultText } = frame;
  const n = values.length;
  const plotW = cfg.vbW - 2 * cfg.plotX;
  const colW = plotW / n;
  const barW = colW - cfg.barGap;
  const maxVal = Math.max(1, ...values);
  const metricsStr = metrics.map((m) => `${m.label} ${m.value}`).join("  ·  ");
  const ptrMap: Record<number, number> = {};

  return (
    <svg
      viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
      style={{ display: "block", width: "100%", height: "auto" }}
      textRendering="geometricPrecision"
    >
      <GlowDefs prefix="ptr" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["yellow", COLOR_YELLOW]]} />
      {/* Title */}
      <text
        x={cfg.plotX}
        y={16}
        dominantBaseline="hanging"
        fill={colors.label}
        fontFamily={MONO_FONT}
        fontWeight={800}
        fontSize={cfg.headerFont}
      >
        {titles[mode] ?? "ARRAY"}
      </text>

      {/* Metrics */}
      <text
        x={cfg.vbW - cfg.plotX}
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

      {/* Note */}
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

      {/* Shaded Area between pointers */}
      {shade && (
        (() => {
          const sx = cfg.plotX + shade.lo * colW + 2;
          const sw = (shade.hi - shade.lo + 1) * colW - 4;
          if (shade.kind === "range") {
            return (
              <rect
                x={sx}
                y={cfg.baseY - cfg.maxH - 4}
                width={sw}
                height={cfg.maxH + 4}
                rx={6}
                fill="none"
                stroke={COLOR_CYAN}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
            );
          }
          const sh = ((shade.height ?? 0) / maxVal) * cfg.maxH;
          return (
            <rect
              x={sx}
              y={cfg.baseY - sh}
              width={sw}
              height={sh}
              rx={4}
              fill="none"
              stroke={COLOR_CYAN}
              strokeWidth={2}
            />
          );
        })()
      )}

      {/* Bars */}
      {values.map((v, i) => {
        const st = states[i] ?? "idle";
        const h = (v / maxVal) * cfg.maxH;
        const x = cfg.plotX + i * colW + cfg.barGap / 2;
        const y = cfg.baseY - h;
        const fill =
          st === "active"
            ? COLOR_CYAN
            : st === "found"
            ? COLOR_GREEN
            : st === "best"
            ? COLOR_YELLOW
            : colors.bar;
        const isHighlighted = st !== "idle" && st !== "dim";

        return (
          <g key={i} opacity={st === "dim" ? 0.3 : 1}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={3}
              fill={fill}
              stroke={isHighlighted ? fill : colors.barStroke}
              strokeWidth={isHighlighted ? 1.5 : 1}
              filter={st === "active" ? "url(#ptr-glow-cyan)" : undefined}
            />
            <text
              x={x + barW / 2}
              y={cfg.baseY + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isHighlighted ? fill : colors.label}
              fontSize={cfg.valueFont}
              fontWeight={800}
              fontFamily={MONO_FONT}
            >
              {v}
            </text>
          </g>
        );
      })}

      {/* Baseline */}
      <line
        x1={cfg.plotX}
        y1={cfg.baseY + 0.5}
        x2={cfg.plotX + plotW}
        y2={cfg.baseY + 0.5}
        stroke={colors.barStroke}
        strokeWidth={1}
      />

      {/* Pointers */}
      {pointers.map((p, idx) => {
        const lvl = ptrMap[p.index] ?? 0;
        ptrMap[p.index] = lvl + 1;
        const px = cfg.plotX + p.index * colW + colW / 2;
        const py = cfg.baseY + 24 + lvl * (compact ? 12 : 13);

        return (
          <g key={`p-${idx}`}>
            {lvl === 0 && (
              <path
                d={`M ${px} ${cfg.baseY + 20} l -4 6 l 8 0 z`}
                fill={colors.text}
              />
            )}
            <text
              x={px}
              y={py + 6}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.text}
              fontSize={cfg.ptrFont}
              fontWeight={800}
              fontFamily={MONO_FONT}
            >
              {p.label}
            </text>
          </g>
        );
      })}

      {/* Result */}
      {resultText && (
        <text
          x={cfg.vbW / 2}
          y={cfg.resultY}
          textAnchor="middle"
          dominantBaseline="central"
          fill={resultText.startsWith("found") || resultText.startsWith("max area") ? COLOR_GREEN : colors.text}
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

function BarPointerSimulation({ mode }: { mode: "two-sum" | "container" }) {
  const [size, setSize] = useState(12);
  const [seed, setSeed] = useState(1);
  const [data, setData] = useState(() => generateBarPointerData(mode, 1, 12));
  const [status, setStatus] = useState("");

  const subtitles = {
    "two-sum": "On a sorted array, move two pointers inward: shrink the sum from the right, grow it from the left.",
    container: "Two walls hold water; the area is the shorter wall times the width. Always move the shorter wall.",
  };

  const titles = {
    "two-sum": "Two Sum",
    container: "Container With Most Water",
  };

  const initialFrame = useMemo<BarPointerFrame>(
    () => ({
      values: [...data.values],
      states: data.values.map(() => "idle"),
      pointers: [],
      metrics: data.target != null ? [{ label: "target", value: String(data.target) }] : [],
      note: "",
      resultText: "",
    }),
    [data]
  );

  const player = useSimulationPlayback<BarPointerFrame>(220, initialFrame);

  const handleRun = useCallback(() => {
    const list: BarPointerFrame[] = [];
    const arr = data.values;
    const len = arr.length;

    if (mode === "two-sum") {
      const target = data.target!;
      let l = 0;
      let r = len - 1;

      while (l < r) {
        const sum = arr[l] + arr[r];
        const states = Array(len).fill("idle");
        states[l] = "active";
        states[r] = "active";

        if (sum === target) {
          states[l] = "found";
          states[r] = "found";
          list.push({
            values: [...arr],
            states,
            pointers: [{ index: l, label: "L" }, { index: r, label: "R" }],
            metrics: [{ label: "target", value: String(target) }, { label: "sum", value: String(sum) }],
            note: `${arr[l]} + ${arr[r]} = ${target}`,
            resultText: `found ${arr[l]} + ${arr[r]} = ${target} at indices ${l}, ${r}`,
          });
          break;
        }

        list.push({
          values: [...arr],
          states,
          pointers: [{ index: l, label: "L" }, { index: r, label: "R" }],
          metrics: [{ label: "target", value: String(target) }, { label: "sum", value: String(sum) }],
          note: sum < target ? `sum ${sum} < ${target}, move L right` : `sum ${sum} > ${target}, move R left`,
          resultText: "",
        });

        if (sum < target) {
          l++;
        } else {
          r--;
        }
      }
    } else {
      // container
      let l = 0;
      let r = len - 1;
      let bestArea = 0;
      let bestL = 0;
      let bestR = len - 1;

      while (l < r) {
        const minH = Math.min(arr[l], arr[r]);
        const area = minH * (r - l);
        if (area > bestArea) {
          bestArea = area;
          bestL = l;
          bestR = r;
        }

        const states = Array(len).fill("idle");
        states[l] = "active";
        states[r] = "active";

        list.push({
          values: [...arr],
          states,
          pointers: [{ index: l, label: "L" }, { index: r, label: "R" }],
          shade: { lo: l, hi: r, height: minH, kind: "area" },
          metrics: [{ label: "area", value: String(area) }, { label: "best", value: String(bestArea) }],
          note: `area ${area}, move the shorter wall (${arr[l] < arr[r] ? "L" : "R"})`,
          resultText: "",
        });

        if (arr[l] < arr[r]) {
          l++;
        } else {
          r--;
        }
      }

      const finalStates = Array(len).fill("idle");
      finalStates[bestL] = "best";
      finalStates[bestR] = "best";
      list.push({
        values: [...arr],
        states: finalStates,
        pointers: [{ index: bestL, label: "L" }, { index: bestR, label: "R" }],
        shade: { lo: bestL, hi: bestR, height: Math.min(arr[bestL], arr[bestR]), kind: "area" },
        metrics: [{ label: "best", value: String(bestArea) }],
        note: "best container",
        resultText: `max area = ${bestArea}`,
      });
    }

    const stepMs = Math.max(120, Math.min(320, Math.round(6000 / list.length)));
    player.play(list, stepMs);
    setStatus("");
  }, [mode, data, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    const newSeed = seed + 1;
    setSeed(newSeed);
    setData(generateBarPointerData(mode, newSeed, size));
    player.stop();
    setStatus("New input");
  }, [player, seed, mode, size]);

  const handleSizeChange = useCallback(
    (newSize: number) => {
      if (player.isPlaying || newSize === size) return;
      setSize(newSize);
      setData(generateBarPointerData(mode, seed, newSize));
      player.stop();
      setStatus(`Array size ${newSize}`);
    },
    [player, size, mode, seed]
  );

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{titles[mode]}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitles[mode]}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">size</span>
          <input
            type="range"
            min={8}
            max={18}
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            disabled={player.isPlaying}
            aria-label="Array size"
            className="h-1.5 w-28 cursor-pointer accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <span className="text-xs text-muted-foreground tabular-nums w-5 text-right">{size}</span>
          <button
            onClick={handleShuffle}
            disabled={player.isPlaying}
            aria-label="Shuffle"
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <BarPointerSvgViewer mode={mode} frame={player.view} />
        </div>
      </div>

      {/* Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} status={status} />
    </div>
  );
}

// Export TwoSumSimulation
export function TwoSumSimulation() {
  return <BarPointerSimulation mode="two-sum" />;
}

// Export ContainerWaterSimulation
export function ContainerWaterSimulation() {
  return <BarPointerSimulation mode="container" />;
}

// ==========================================
// 3. TWO POINTERS SIMULATION (Palindrome Check)
// ==========================================
const TP_SCENARIOS = [
  { id: "palindrome", name: "Palindrome", values: [2, 4, 6, 8, 6, 4, 2] },
  { id: "not-palindrome", name: "Not a palindrome", values: [2, 4, 6, 8, 9, 4, 2] },
];

export function TwoPointersSimulation() {
  const [scenarioId, setScenarioId] = useState(TP_SCENARIOS[0].id);
  const activeScenario = TP_SCENARIOS.find((s) => s.id === scenarioId) ?? TP_SCENARIOS[0];
  const arr = activeScenario.values;

  const initialFrame = useMemo(() => ({
    values: [...arr],
    states: Array(arr.length).fill("idle"),
    pointers: [],
    metrics: [],
    note: "",
    resultText: "",
  }), [arr]);

  const player = useSimulationPlayback(620, initialFrame);

  const frames = useMemo(() => {
    const list: Array<any> = [];
    const len = arr.length;
    let l = 0;
    let r = len - 1;

    const pushStep = (note: string, tone?: "good" | "bad", resultText?: string) => {
      const states = Array(len).fill("idle");
      for (let i = 0; i < l; i++) states[i] = "good";
      for (let i = len - 1; i > r; i--) states[i] = "good";

      if (l < r) {
        states[l] = tone ?? "idle";
        states[r] = tone ?? "idle";
      } else if (l === r) {
        states[l] = tone === "bad" ? "bad" : "good";
      }

      list.push({
        values: [...arr],
        states,
        pointers:
          l <= r
            ? [
                { index: l, label: "L", color: "cyan" as const },
                { index: r, label: "R", color: "green" as const },
              ]
            : [],
        metrics: [
          { label: "L", value: l <= r ? String(arr[Math.min(l, len - 1)]) : "-" },
          { label: "R", value: l <= r ? String(arr[Math.max(r, 0)]) : "-" },
        ],
        note,
        resultText: resultText ?? "",
        resultTone: tone,
      });
    };

    while (l < r) {
      if (arr[l] !== arr[r]) {
        pushStep(`${arr[l]} != ${arr[r]}, mismatch`, "bad", "Not a palindrome");
        return list;
      } else {
        pushStep(`${arr[l]} == ${arr[r]}, match, move both inward`, "good");
        l++;
        r--;
      }
    }

    pushStep("Pointers met, every pair matched", "good", "It is a palindrome");
    return list;
  }, [arr]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(380, Math.min(720, Math.round(7000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleScenarioChange = useCallback(
    (id: string) => {
      if (id !== scenarioId) {
        player.stop();
        setScenarioId(id);
      }
    },
    [scenarioId, player]
  );

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header & Scenarios */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Two Pointers</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Walk one pointer from each end toward the middle, comparing a pair at a time. Shown with a palindrome check.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs shrink-0">
          {TP_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              disabled={player.isPlaying}
              className={`px-2.5 py-1 transition-colors disabled:opacity-50 ${
                scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Array Row Viewer */}
      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <ArrayRowViewer title="Two Pointers" frame={player.view} />
        </div>
      </div>

      {/* Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 4. FAST AND SLOW POINTERS (Cycle Detection)
// ==========================================
const FSP_SCENARIOS = [
  { id: "cycle", name: "Has a cycle", count: 8, cycleStart: 3 },
  { id: "no-cycle", name: "No cycle", count: 7, cycleStart: -1 },
];

interface FspFrame {
  slow: number;
  fast: number;
  fastNull: boolean;
  met: boolean;
  note: string;
  resultText: string;
  resultTone?: "good" | "bad";
}

export function FastSlowPointersSimulation() {
  const [scenarioId, setScenarioId] = useState(FSP_SCENARIOS[0].id);
  const activeScenario = FSP_SCENARIOS.find((s) => s.id === scenarioId) ?? FSP_SCENARIOS[0];
  const { count: nodeCount, cycleStart } = activeScenario;

  const nextNode = useCallback(
    (node: number) => {
      if (node === nodeCount - 1) return cycleStart;
      return node + 1;
    },
    [nodeCount, cycleStart]
  );

  const initialFrame = useMemo<FspFrame>(
    () => ({
      slow: 0,
      fast: 0,
      fastNull: false,
      met: false,
      note: "",
      resultText: "",
    }),
    []
  );

  const player = useSimulationPlayback<FspFrame>(720, initialFrame);

  const frames = useMemo(() => {
    const list: FspFrame[] = [];
    let s = 0;
    let f = 0;

    const push = (note: string, opts: { fastNull?: boolean; met?: boolean; result?: string; tone?: "good" | "bad" } = {}) => {
      list.push({
        slow: s,
        fast: opts.fastNull ? -1 : f,
        fastNull: !!opts.fastNull,
        met: !!opts.met,
        note,
        resultText: opts.result ?? "",
        resultTone: opts.tone,
      });
    };

    push("Both pointers start at the head");

    for (let step = 0; step < 50; step++) {
      const nextS = nextNode(s);
      const nextF1 = nextNode(f);
      const nextF2 = nextF1 === -1 ? -1 : nextNode(nextF1);

      if (nextF1 === -1 || nextF2 === -1) {
        f = -1;
        push("Fast reached the end of the list", {
          fastNull: true,
          result: "No cycle: fast hit the end",
          tone: "bad",
        });
        break;
      }

      s = nextS;
      f = nextF2;

      if (s === f) {
        push(`Slow and fast both at node ${s}`, {
          met: true,
          result: "Cycle detected: the pointers met",
          tone: "good",
        });
        break;
      }

      push(`slow -> node ${s}, fast -> node ${f}`);
    }

    return list;
  }, [nextNode]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(520, Math.min(900, Math.round(7000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleScenarioChange = useCallback(
    (id: string) => {
      if (id !== scenarioId) {
        player.stop();
        setScenarioId(id);
      }
    },
    [scenarioId, player]
  );

  // SVG rendering
  const cfg = {
    vbW: 720,
    vbH: 300,
    plotX: 30,
    rowY: 168,
    r: 19,
    arcLift: 96,
    headerFont: 13,
    noteFont: 13,
    nodeFont: 12,
    ptrFont: 11,
    nullFont: 12,
    resultFont: 15,
    noteY: 48,
  };

  const colors = {
    text: "#f4f4f5",
    label: "#a1a1aa",
    node: "#27272a",
    nodeStroke: "rgba(161,161,170,0.45)",
    edge: "#71717a",
    ink: "#18181b",
  };

  const { slow, fast, fastNull, met, note, resultText, resultTone } = player.view;
  const colStep = (cfg.vbW - 2 * cfg.plotX) / (nodeCount + (cycleStart === -1 ? 1 : 0));
  const getCx = (idx: number) => cfg.plotX + idx * colStep + colStep / 2;
  const nullX = getCx(nodeCount);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Fast and Slow Pointers</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Two pointers move at different speeds through a linked list to detect a cycle (Floyd's tortoise and hare).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs shrink-0">
          {FSP_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              disabled={player.isPlaying}
              className={`px-2.5 py-1 transition-colors disabled:opacity-50 ${
                scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="fsp" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["yellow", COLOR_YELLOW]]} />
            <defs>
              <marker id="fsp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={colors.edge} />
              </marker>
            </defs>

            {/* Header */}
            <text
              x={cfg.plotX}
              y={16}
              dominantBaseline="hanging"
              fill={colors.label}
              fontFamily={MONO_FONT}
              fontWeight={800}
              fontSize={cfg.headerFont}
              style={{ letterSpacing: 0.5 }}
            >
              {scenarioId === "cycle" ? "LINKED LIST WITH A CYCLE" : "LINKED LIST, NO CYCLE"}
            </text>

            {/* Note */}
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

            {/* Edges */}
            {Array.from({ length: nodeCount - 1 }).map((_, i) => (
              <line
                key={`e-${i}`}
                x1={getCx(i) + cfg.r}
                y1={cfg.rowY}
                x2={getCx(i + 1) - cfg.r - 3}
                y2={cfg.rowY}
                stroke={colors.edge}
                strokeWidth={1.75}
                markerEnd="url(#fsp-arrow)"
              />
            ))}

            {/* Cycle Arc or Null Pointer */}
            {cycleStart === -1 ? (
              <g>
                <line
                  x1={getCx(nodeCount - 1) + cfg.r}
                  y1={cfg.rowY}
                  x2={nullX - 12}
                  y2={cfg.rowY}
                  stroke={colors.edge}
                  strokeWidth={1.75}
                  markerEnd="url(#fsp-arrow)"
                />
                <text
                  x={nullX}
                  y={cfg.rowY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={fastNull ? COLOR_YELLOW : colors.label}
                  fontFamily={MONO_FONT}
                  fontWeight={800}
                  fontSize={cfg.nullFont}
                >
                  null
                </text>
              </g>
            ) : (
              <path
                d={`M ${getCx(nodeCount - 1)} ${cfg.rowY - cfg.r} C ${getCx(nodeCount - 1)} ${
                  cfg.rowY - cfg.arcLift
                }, ${getCx(cycleStart)} ${cfg.rowY - cfg.arcLift}, ${getCx(cycleStart)} ${cfg.rowY - cfg.r - 4}`}
                fill="none"
                stroke={colors.edge}
                strokeWidth={1.75}
                markerEnd="url(#fsp-arrow)"
                opacity={0.9}
              />
            )}

            {/* Node Circles */}
            {Array.from({ length: nodeCount }).map((_, i) => {
              const isS = i === slow;
              const isF = i === fast && !fastNull;
              const isMet = met && isS;
              const fill = isMet ? COLOR_GREEN : isS ? COLOR_CYAN : isF ? COLOR_YELLOW : colors.node;
              const stroke = isMet ? COLOR_GREEN : isS ? COLOR_CYAN : isF ? COLOR_YELLOW : colors.nodeStroke;
              const isHighlighted = isS || isF;
              const filter = isMet
                ? "url(#fsp-glow-green)"
                : isS
                ? "url(#fsp-glow-cyan)"
                : isF
                ? "url(#fsp-glow-yellow)"
                : undefined;

              return (
                <g key={`n-${i}`}>
                  <circle
                    cx={getCx(i)}
                    cy={cfg.rowY}
                    r={cfg.r}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    filter={filter}
                  />
                  <text
                    x={getCx(i)}
                    y={cfg.rowY + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHighlighted ? colors.ink : colors.text}
                    fontSize={cfg.nodeFont}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {i}
                  </text>
                </g>
              );
            })}

            {/* Pointers Below Nodes */}
            {(() => {
              const ptrOffset = 16;
              const renderPtr = (idx: number, label: string, color: string, level: number) => {
                if (idx < 0) return null;
                const px = getCx(idx);
                const py = cfg.rowY + cfg.r + ptrOffset + level * ptrOffset;
                return (
                  <g key={`${label}-${idx}`}>
                    {level === 0 && (
                      <path
                        d={`M ${px} ${cfg.rowY + cfg.r + 4} l -5 7 l 10 0 z`}
                        fill={color}
                      />
                    )}
                    <text
                      x={px}
                      y={py}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={color}
                      fontSize={cfg.ptrFont}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {label}
                    </text>
                  </g>
                );
              };

              if (slow !== fast || fastNull) {
                return (
                  <g>
                    {renderPtr(slow, "slow", COLOR_CYAN, 0)}
                    {fastNull ? (
                      <g key="fast-null">
                        <path
                          d={`M ${nullX} ${cfg.rowY + cfg.r + 4} l -5 7 l 10 0 z`}
                          fill={COLOR_YELLOW}
                        />
                        <text
                          x={nullX}
                          y={cfg.rowY + cfg.r + ptrOffset}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={COLOR_YELLOW}
                          fontSize={cfg.ptrFont}
                          fontWeight={800}
                          fontFamily={MONO_FONT}
                        >
                          fast
                        </text>
                      </g>
                    ) : (
                      renderPtr(fast, "fast", COLOR_YELLOW, 0)
                    )}
                  </g>
                );
              } else {
                return (
                  <g>
                    {renderPtr(slow, "slow", COLOR_CYAN, 0)}
                    {renderPtr(fast, "fast", COLOR_YELLOW, 1)}
                  </g>
                );
              }
            })()}

            {/* Result text */}
            {resultText && (
              <text
                x={cfg.vbW / 2}
                y={cfg.vbH - 16}
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
// 5. SLIDING WINDOW SIMULATION
// ==========================================
const SW_SCENARIOS = [
  { id: "fixed", name: "Fixed size" },
  { id: "variable", name: "Variable size" },
];

const FIXED_ARR = [2, 1, 5, 1, 3, 2, 4];
const VAR_ARR = [3, 1, 2, 1, 4, 2, 1];

export function SlidingWindowSimulation() {
  const [scenarioId, setScenarioId] = useState(SW_SCENARIOS[0].id);
  const isFixed = scenarioId === "fixed";
  const arr = isFixed ? FIXED_ARR : VAR_ARR;

  const initialFrame = useMemo(() => ({
    values: [...arr],
    states: Array(arr.length).fill("idle"),
    pointers: [],
    metrics: [],
    note: "",
    resultText: "",
  }), [arr]);

  const player = useSimulationPlayback(420, initialFrame);

  const frames = useMemo(() => {
    const list: Array<any> = [];
    const len = arr.length;

    if (isFixed) {
      const k = 3;
      let windowSum = 0;
      let bestSum = -Infinity;
      let bestIdx = 0;

      for (let i = 0; i < k; i++) {
        windowSum += arr[i];
      }

      for (let i = 0; i + k - 1 < len; i++) {
        const j = i + k - 1;
        if (i > 0) {
          windowSum += arr[j] - arr[i - 1];
        }
        if (windowSum > bestSum) {
          bestSum = windowSum;
          bestIdx = i;
        }

        const states = Array(len).fill("idle");
        for (let idx = i; idx <= j; idx++) states[idx] = "active";

        list.push({
          values: [...arr],
          states,
          window: { lo: i, hi: j },
          pointers: [
            { index: i, label: "L" },
            { index: j, label: "R" },
          ],
          metrics: [
            { label: "window", value: String(windowSum) },
            { label: "best", value: bestSum === -Infinity ? "0" : String(bestSum) },
          ],
          note: i === 0 ? `First window, sum = ${windowSum}` : `Slide right, sum = ${windowSum}`,
          resultText: "",
        });
      }

      const finalStates = Array(len).fill("idle");
      for (let idx = bestIdx; idx <= bestIdx + k - 1; idx++) finalStates[idx] = "good";

      list.push({
        values: [...arr],
        states: finalStates,
        window: { lo: bestIdx, hi: bestIdx + k - 1 },
        pointers: [],
        metrics: [{ label: "best", value: String(bestSum) }],
        note: "",
        resultText: `Best window sum = ${bestSum}`,
      });
    } else {
      // Variable size window: max length with sum <= 6
      const limit = 6;
      let l = 0;
      let curSum = 0;
      let bestLen = 0;
      let bestL = 0;
      let bestR = -1;

      const pushStep = (r: number, note: string) => {
        const states = Array(len).fill("idle");
        if (r >= l) {
          for (let idx = l; idx <= r; idx++) states[idx] = "active";
        }
        list.push({
          values: [...arr],
          states,
          window: r >= l ? { lo: l, hi: r } : undefined,
          pointers: [
            { index: l, label: "L" },
            { index: Math.max(l, r), label: "R" },
          ],
          metrics: [
            { label: "sum", value: String(curSum) },
            { label: "limit", value: String(limit) },
            { label: "best len", value: String(bestLen) },
          ],
          note,
          resultText: "",
        });
      };

      for (let r = 0; r < len; r++) {
        curSum += arr[r];
        pushStep(r, `Add ${arr[r]} on the right, sum = ${curSum}`);

        while (curSum > limit && l <= r) {
          curSum -= arr[l];
          l++;
          pushStep(r, `Sum ${curSum + arr[l - 1]} over ${limit}, drop ${arr[l - 1]} on the left`);
        }

        const winLen = r - l + 1;
        if (winLen > bestLen) {
          bestLen = winLen;
          bestL = l;
          bestR = r;
          pushStep(r, `Valid window of length ${winLen}, new best`);
        }
      }

      const finalStates = Array(len).fill("idle");
      if (bestR >= bestL) {
        for (let idx = bestL; idx <= bestR; idx++) finalStates[idx] = "good";
      }

      list.push({
        values: [...arr],
        states: finalStates,
        window: bestR >= bestL ? { lo: bestL, hi: bestR } : undefined,
        pointers: [],
        metrics: [{ label: "best len", value: String(bestLen) }],
        note: "",
        resultText: `Longest window with sum <= 6 has length ${bestLen}`,
      });
    }

    return list;
  }, [arr, isFixed]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(260, Math.min(560, Math.round(9000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleScenarioChange = useCallback(
    (id: string) => {
      if (id !== scenarioId) {
        player.stop();
        setScenarioId(id);
      }
    },
    [scenarioId, player]
  );

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Sliding Window</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Keep a moving window over the array and update its sum in O(1) instead of recomputing from scratch.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs shrink-0">
          {SW_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              disabled={player.isPlaying}
              className={`px-2.5 py-1 transition-colors disabled:opacity-50 ${
                scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <ArrayRowViewer title="Sliding Window" frame={player.view} />
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 6. CONTAINER WITH MOST WATER (Canvas 2D Wave Simulation)
// ==========================================
const CMW_DEFAULT_WALLS = [1, 8, 6, 2, 5, 4, 8, 3, 7];

interface CmwFrame {
  l: number;
  r: number;
  level: number;
  area: number;
  best: number;
  bestL: number;
  bestR: number;
  note: string;
  final?: boolean;
}

export function ContainerMostWaterSimulation() {
  const [seed, setSeed] = useState(0);

  const walls = useMemo(() => {
    if (seed === 0) return CMW_DEFAULT_WALLS;
    const prng = makePrng(seed);
    const res: number[] = [];
    for (let i = 0; i < CMW_DEFAULT_WALLS.length; i++) {
      res.push(1 + Math.floor(9 * prng()));
    }
    if (res.filter((x) => x >= 6).length < 2) {
      res[1] = 8;
      res[7] = 7;
    }
    return res;
  }, [seed]);

  const frames = useMemo(() => {
    const list: CmwFrame[] = [];
    const n = walls.length;
    let l = 0;
    let r = n - 1;
    let best = 0;
    let bestL = 0;
    let bestR = n - 1;

    while (l < r) {
      const width = r - l;
      const h = Math.min(walls[l], walls[r]);
      const area = width * h;
      const isNewBest = area > best;
      if (isNewBest) {
        best = area;
        bestL = l;
        bestR = r;
      }

      const note =
        walls[l] < walls[r]
          ? `left wall ${walls[l]} is shorter, move L right`
          : walls[r] < walls[l]
          ? `right wall ${walls[r]} is shorter, move R left`
          : "walls are equal, move L right";

      list.push({
        l,
        r,
        level: h,
        area,
        best,
        bestL,
        bestR,
        note: `area = min(${walls[l]}, ${walls[r]}) x ${width} = ${area}${isNewBest ? `, new best area ${area}` : ""}; ${note}`,
      });

      if (walls[l] <= walls[r]) {
        l++;
      } else {
        r--;
      }
    }

    list.push({
      l: bestL,
      r: bestR,
      level: Math.min(walls[bestL], walls[bestR]),
      area: best,
      best,
      bestL,
      bestR,
      note: `Done. Max area = ${best}, between the walls at index ${bestL} and ${bestR}.`,
      final: true,
    });

    return list;
  }, [walls]);

  const initialFrame = useMemo<CmwFrame>(() => {
    const n = walls.length;
    const h = Math.min(walls[0], walls[n - 1]);
    return {
      l: 0,
      r: n - 1,
      level: h,
      area: (n - 1) * h,
      best: 0,
      bestL: 0,
      bestR: n - 1,
      note: "",
    };
  }, [walls]);

  const player = useSimulationPlayback<CmwFrame>(1400, initialFrame);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dimRef = useRef({ W: 0, H: 0, dpr: 1 });

  const handleRun = useCallback(() => {
    player.play(frames);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    player.stop();
    setSeed((s) => s + 1);
  }, [player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  // Handle Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth;
      const h = container.clientHeight;
      dimRef.current = { W: w, H: h, dpr };
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Canvas render loop
  const curView = player.view;
  const curFrameIdx = player.index;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { W, H, dpr } = dimRef.current;
    if (W === 0 || H === 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const colors = {
      skyTop: "#0a1020",
      skyBottom: "#16223a",
      wall: "#3f3f46",
      wallTop: "#52525b",
      waterSurface: "#5ad1e6",
      waterDeep: "#0f5fa8",
      waterHi: "#cdefff",
      text: "#a1a1aa",
      numText: "#e4e4e7",
      strong: "#f4f4f5",
    };

    const n = walls.length;
    const maxVal = Math.max(...walls);
    const plotPad = Math.max(22, 0.07 * W);
    const colW = (W - 2 * plotPad) / n;
    const baseY = H - 30;
    const scaleY = (baseY - 34) / (maxVal + 0.5);
    const wallHalfW = 0.2 * colW;

    const getWallX = (idx: number) => plotPad + colW * (idx + 0.5);
    const getWallTopY = (idx: number) => baseY - walls[idx] * scaleY;
    const timeSec = curFrameIdx / 60;
    const wave = (x: number, amp: number) =>
      Math.sin(0.05 * x + 2 * timeSec) * amp * 0.6 + Math.sin(0.12 * x - 1.4 * timeSec) * amp * 0.4;

    ctx.clearRect(0, 0, W, H);

    // Sky Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, colors.skyTop);
    bgGrad.addColorStop(1, colors.skyBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    const leftIdx = curView.l;
    const rightIdx = curView.r;
    const wallColor = curView.final ? COLOR_GREEN : COLOR_CYAN;

    // Draw idle walls
    for (let i = 0; i < n; i++) {
      if (i === leftIdx || i === rightIdx) continue;
      const wx = getWallX(i) - wallHalfW;
      const wy = getWallTopY(i);
      const grad = ctx.createLinearGradient(wx, wy, wx, baseY);
      grad.addColorStop(0, colors.wallTop);
      grad.addColorStop(1, colors.wall);
      ctx.fillStyle = grad;
      ctx.fillRect(wx, wy, 2 * wallHalfW, baseY - wy);
    }

    // Draw water between L and R
    const leftX = getWallX(leftIdx) + wallHalfW;
    const rightX = getWallX(rightIdx) - wallHalfW;
    const waterY = baseY - curView.level * scaleY;

    if (rightX > leftX && baseY - waterY > 1) {
      const waterGrad = ctx.createLinearGradient(0, waterY, 0, baseY);
      waterGrad.addColorStop(0, colors.waterSurface);
      waterGrad.addColorStop(1, colors.waterDeep);
      ctx.globalAlpha = 0.62;
      ctx.fillStyle = waterGrad;
      ctx.beginPath();
      for (let s = 0; s <= 28; s++) {
        const wx = leftX + ((rightX - leftX) * s) / 28;
        const wy = waterY + wave(wx, 3.2);
        if (s === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.lineTo(rightX, baseY);
      ctx.lineTo(leftX, baseY);
      ctx.closePath();
      ctx.fill();

      // Water surface highlight
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = colors.waterHi;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let s = 0; s <= 28; s++) {
        const wx = leftX + ((rightX - leftX) * s) / 28;
        const wy = waterY + wave(wx, 3.2);
        if (s === 0) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw active L and R walls
    for (const idx of [leftIdx, rightIdx]) {
      const wx = getWallX(idx) - wallHalfW;
      const wy = getWallTopY(idx);
      ctx.fillStyle = wallColor;
      ctx.fillRect(wx, wy, 2 * wallHalfW, baseY - wy);

      if (!curView.final) {
        ctx.fillStyle = "#18181b";
        ctx.font = `700 12px ${MONO_FONT}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(idx === leftIdx ? "L" : "R", getWallX(idx), wy + 11);
      }
    }

    // Draw best container box outline
    if (curView.best > 0) {
      const bx1 = getWallX(curView.bestL) + wallHalfW;
      const bx2 = getWallX(curView.bestR) - wallHalfW;
      const by = baseY - Math.min(walls[curView.bestL], walls[curView.bestR]) * scaleY;
      ctx.strokeStyle = curView.final ? COLOR_GREEN : COLOR_YELLOW;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 2;
      if (!curView.final) ctx.setLineDash([6, 4]);
      ctx.strokeRect(bx1, by, bx2 - bx1, baseY - by);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    }

    // Wall values below
    ctx.font = `600 12px ${MONO_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = i === leftIdx || i === rightIdx ? colors.strong : colors.numText;
      ctx.fillText(String(walls[i]), getWallX(i), baseY + 14);
    }

    // Metrics text in top header
    ctx.font = `600 13px ${MONO_FONT}`;
    ctx.textBaseline = "middle";
    if (curView.final) {
      ctx.fillStyle = COLOR_GREEN;
      ctx.textAlign = "center";
      ctx.font = `700 14px ${MONO_FONT}`;
      ctx.fillText(`max area = ${curView.best}`, W / 2, 16);
    } else {
      ctx.fillStyle = colors.text;
      ctx.textAlign = "left";
      ctx.fillText(
        `area = min(${walls[curView.l]}, ${walls[curView.r]}) x ${curView.r - curView.l} = ${curView.area}`,
        plotPad,
        16
      );
      ctx.fillStyle = COLOR_YELLOW;
      ctx.textAlign = "right";
      ctx.fillText(`best = ${curView.best}`, W - plotPad, W < 460 ? 36 : 16);
    }
  }, [curView, curFrameIdx, walls]);

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header & Controls */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Container With Most Water</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Two pointers close in from the ends; the shorter wall always moves. Watch the trapped area change.
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

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-[#0a1020]"
        style={{ height: 340 }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {/* Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.note} />
    </div>
  );
}

// ==========================================
// 7. TRAPPING RAIN WATER (Physics & Continuous Cycle Simulation)
// ==========================================
const TRW_ELEVATIONS = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];

interface RainDrop {
  x: number;
  y: number;
  len: number;
  vy: number;
  vx: number;
}

interface Ripple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
}

interface Splash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

const TRW_PHASE_DURATIONS = { fill: 3600, hold: 1900, drain: 2300, gap: 700 };
const TRW_NEXT_PHASE = { fill: "hold", hold: "drain", drain: "gap", gap: "fill" } as const;

export function TrappingRainWaterSimulation() {
  const heights = TRW_ELEVATIONS;
  const n = heights.length;
  const maxH = Math.max(...heights);

  // Compute trapped water table
  const waterLevels = useMemo(() => {
    const leftMax = Array(n).fill(0);
    const rightMax = Array(n).fill(0);
    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    return heights.map((h, i) => Math.min(leftMax[i], rightMax[i]));
  }, [heights, n]);

  const totalTrapped = useMemo(() => {
    return waterLevels.reduce((acc, lvl, i) => acc + Math.max(0, lvl - heights[i]), 0);
  }, [waterLevels, heights]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stateRef = useRef<{
    phase: "fill" | "hold" | "drain" | "gap";
    phaseElapsed: number;
    p: number;
    drops: RainDrop[];
    ripples: Ripple[];
    splashes: Splash[];
    last: number;
  }>({
    phase: "fill",
    phaseElapsed: 0,
    p: 0,
    drops: [],
    ripples: [],
    splashes: [],
    last: 0,
  });

  const smoothProgress = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = container.clientWidth;
      H = container.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);

    const makeDrop = (): RainDrop => ({
      x: Math.random() * (W + 80) - 40,
      y: -Math.random() * H - 10,
      len: 10 + 16 * Math.random(),
      vy: 620 + 360 * Math.random(),
      vx: 28 + 16 * Math.random(),
    });

    const colors = {
      skyTop: "#0a1020",
      skyBottom: "#16223a",
      barFace: "#3f3f46",
      barTop: "#52525b",
      barEdge: "#71717a",
      waterSurface: "#5ad1e6",
      waterDeep: "#0f5fa8",
      waterHi: "#cdefff",
      rain: "rgba(190, 239, 255, 0.40)",
      splash: "rgba(220, 250, 255, 0.85)",
      text: "#a1a1aa",
      numText: "#e4e4e7",
    };

    const render = (timeMs: number) => {
      const state = stateRef.current;
      if (!state.last) state.last = timeMs;
      let dt = (timeMs - state.last) / 1000;
      state.last = timeMs;
      if (dt > 0.05) dt = 0.05;

      state.phaseElapsed += 1000 * dt;
      if (state.phaseElapsed >= TRW_PHASE_DURATIONS[state.phase]) {
        state.phaseElapsed = 0;
        state.phase = TRW_NEXT_PHASE[state.phase];
      }

      const frac = Math.min(1, state.phaseElapsed / TRW_PHASE_DURATIONS[state.phase]);
      if (state.phase === "fill") state.p = smoothProgress(frac);
      else if (state.phase === "hold") state.p = 1;
      else if (state.phase === "drain") state.p = 1 - smoothProgress(frac);
      else state.p = 0;

      const padX = Math.max(18, 0.06 * W);
      const colW = (W - 2 * padX) / n;
      const baseY = H - 30;
      const scaleY = (baseY - 28) / (maxH + 0.35);

      const getColX = (i: number) => padX + colW * (i + 0.5);
      const getBarTopY = (i: number) => baseY - heights[i] * scaleY;
      const timeSec = timeMs / 1000;
      const wave = (x: number, amp: number) =>
        Math.sin(0.045 * x + 2.2 * timeSec) * amp * 0.6 + Math.sin(0.11 * x - 1.5 * timeSec) * amp * 0.4;
      const getWaterTopY = (i: number) => baseY - waterLevels[i] * scaleY * state.p;
      const hasWater = (i: number) => waterLevels[i] > heights[i] && getWaterTopY(i) < getBarTopY(i) - 0.5;

      const getSurfaceY = (x: number) => {
        const col = Math.floor((x - padX) / colW);
        if (col < 0 || col >= n) return baseY;
        return hasWater(col) ? getWaterTopY(col) + wave(x, 3) : getBarTopY(col);
      };

      const isRaining = state.phase === "fill" || state.phase === "hold";
      if (isRaining) {
        while (state.drops.length < 150) state.drops.push(makeDrop());
      }

      // Update rain drops
      const aliveDrops: RainDrop[] = [];
      for (const d of state.drops) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        const surfY = getSurfaceY(d.x);
        if (d.y < surfY) {
          aliveDrops.push(d);
          continue;
        }

        const col = Math.floor((d.x - padX) / colW);
        const hitWater = col >= 0 && col < n && hasWater(col);
        if (hitWater && state.ripples.length < 60) {
          state.ripples.push({ x: d.x, y: surfY, r: 1, maxR: 8 + 10 * Math.random(), life: 1 });
        }
        if (state.splashes.length < 160) {
          const count = hitWater ? 3 : 2;
          for (let k = 0; k < count; k++) {
            state.splashes.push({
              x: d.x,
              y: surfY,
              vx: (Math.random() - 0.5) * 90,
              vy: -60 - 110 * Math.random(),
              life: 1,
            });
          }
        }
        if (isRaining) {
          Object.assign(d, makeDrop());
          aliveDrops.push(d);
        }
      }
      state.drops = aliveDrops;

      // Update ripples
      for (const r of state.ripples) {
        r.r += 26 * dt;
        r.life -= 1.7 * dt;
      }
      state.ripples = state.ripples.filter((r) => r.life > 0 && r.r < r.maxR);

      // Update splashes
      for (const s of state.splashes) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vy += 420 * dt;
        s.life -= 2.2 * dt;
      }
      state.splashes = state.splashes.filter((s) => s.life > 0);

      // Draw Background
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, colors.skyTop);
      bg.addColorStop(1, colors.skyBottom);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Draw Raindrops
      ctx.strokeStyle = colors.rain;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      for (const d of state.drops) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 0.018 * d.vx, d.y - d.len);
        ctx.stroke();
      }

      // Draw Elevation Bars
      for (let i = 0; i < n; i++) {
        if (heights[i] === 0) continue;
        const bx = padX + colW * i + 1;
        const bw = colW - 2;
        const by = getBarTopY(i);
        const grad = ctx.createLinearGradient(bx, by, bx, baseY);
        grad.addColorStop(0, colors.barTop);
        grad.addColorStop(1, colors.barFace);
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, bw, baseY - by);
        ctx.fillStyle = colors.barEdge;
        ctx.fillRect(bx, by, bw, 2);
      }

      // Draw Water
      for (let i = 0; i < n; i++) {
        if (!hasWater(i)) continue;
        const bx = padX + colW * i + 1;
        const bw = colW - 2;
        const wy = getWaterTopY(i);
        const by = getBarTopY(i);
        const grad = ctx.createLinearGradient(bx, wy, bx, baseY);
        grad.addColorStop(0, colors.waterSurface);
        grad.addColorStop(1, colors.waterDeep);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let s = 0; s <= 8; s++) {
          const wx = bx + (bw * s) / 8;
          const w = wy + wave(wx, 3);
          if (s === 0) ctx.moveTo(wx, w);
          else ctx.lineTo(wx, w);
        }
        ctx.lineTo(bx + bw, by);
        ctx.lineTo(bx, by);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Water surface lines
      ctx.strokeStyle = colors.waterHi;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.4;
      for (let i = 0; i < n; i++) {
        if (!hasWater(i)) continue;
        const bx = padX + colW * i + 1;
        const bw = colW - 2;
        const wy = getWaterTopY(i);
        ctx.beginPath();
        for (let s = 0; s <= 8; s++) {
          const wx = bx + (bw * s) / 8;
          const w = wy + wave(wx, 3);
          if (s === 0) ctx.moveTo(wx, w);
          else ctx.lineTo(wx, w);
        }
        ctx.stroke();
      }

      // Ripples
      ctx.globalAlpha = 1;
      ctx.strokeStyle = colors.waterHi;
      for (const r of state.ripples) {
        ctx.globalAlpha = 0.5 * Math.max(0, r.life);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.r, 0.4 * r.r, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Splashes
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.splash;
      for (const s of state.splashes) {
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Text numbers below bars
      ctx.globalAlpha = 1;
      ctx.font = `600 12px ${MONO_FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < n; i++) {
        const cx = getColX(i);
        ctx.fillStyle = heights[i] === 0 ? colors.text : colors.numText;
        const cy = heights[i] === 0 ? baseY - 9 : getBarTopY(i) + 11;
        ctx.fillText(String(heights[i]), cx, cy);
      }

      // Water trapped counter
      let currentTrapped = 0;
      for (let i = 0; i < n; i++) {
        const diff = waterLevels[i] - heights[i];
        if (diff > 0) {
          currentTrapped += Math.min(diff, Math.max(0, waterLevels[i] * state.p - heights[i]));
        }
      }

      ctx.fillStyle = colors.text;
      ctx.textAlign = "left";
      ctx.font = `600 13px ${MONO_FONT}`;
      ctx.fillText(`water trapped: ${Math.round(currentTrapped)} / ${totalTrapped} units`, padX, 16);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [heights, waterLevels, totalTrapped, n, maxH]);

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium">Trapping Rain Water</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Rain settles into each valley up to min(left max, right max), trapping {totalTrapped} units for heights [
          {heights.join(", ")}].
        </p>
      </div>

      {/* Physics Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-[#0a1020]"
        style={{ height: 380 }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    </div>
  );
}
