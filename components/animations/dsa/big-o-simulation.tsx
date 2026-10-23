"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

// n values tested in the simulation:
const N_SIZES = [1, 2, 4, 8, 16, 32, 64, 128, 256];

function factorial(n: number): number {
  let t = 1;
  for (let i = 2; i <= n; i++) t *= i;
  return t;
}

interface ComplexityClass {
  id: string;
  label: string;
  example: string;
  color: string;
  ops: (n: number) => number;
  logOps: (n: number) => number;
}

const COMPLEXITY_CLASSES: ComplexityClass[] = [
  {
    id: "constant",
    label: "O(1)",
    example: "Hash table lookup",
    color: "#69db7c",
    ops: () => 1,
    logOps: () => 0,
  },
  {
    id: "log",
    label: "O(log n)",
    example: "Binary search",
    color: "#38d9a9",
    ops: (n) => Math.max(1, Math.ceil(Math.log2(n))),
    logOps: (n) => Math.log10(Math.max(1, Math.log2(n))),
  },
  {
    id: "linear",
    label: "O(n)",
    example: "Linear scan",
    color: "#3bc9db",
    ops: (n) => n,
    logOps: (n) => Math.log10(n),
  },
  {
    id: "linearithmic",
    label: "O(n log n)",
    example: "Merge sort",
    color: "#9775fa",
    ops: (n) => Math.round(n * Math.max(1, Math.log2(n))),
    logOps: (n) => Math.log10(n * Math.max(1, Math.log2(n))),
  },
  {
    id: "quadratic",
    label: "O(n²)",
    example: "Bubble sort",
    color: "#ffa94d",
    ops: (n) => n * n,
    logOps: (n) => 2 * Math.log10(n),
  },
  {
    id: "exponential",
    label: "O(2ⁿ)",
    example: "Recursive subsets",
    color: "#ff8787",
    ops: (n) => Math.pow(2, n),
    logOps: (n) => n * Math.log10(2),
  },
  {
    id: "factorial",
    label: "O(n!)",
    example: "Brute-force TSP",
    color: "#da77f2",
    ops: (n) => factorial(n),
    logOps: (n) =>
      n <= 1
        ? 0
        : (n * Math.log(n) - n + 0.5 * Math.log((2 * Math.PI) / n) + Math.log(n) + 1 / (12 * n)) / Math.LN10,
  },
];

// Human-readable operations counter
function formatOps(ops: number): string {
  if (!Number.isFinite(ops)) return "off the chart";
  if (ops < 1e3) return Math.round(ops).toLocaleString("en-US");
  if (ops < 1e6) return `${(ops / 1e3).toFixed(1)}K`;
  if (ops < 1e9) return `${(ops / 1e6).toFixed(1)}M`;
  if (ops < 1e12) return `${(ops / 1e9).toFixed(1)}B`;
  return ops.toExponential(1).replace("e+", "e");
}

// Human-readable execution time based on a 1 GHz CPU (1 billion ops/sec)
function formatTime(ops: number): string {
  if (!Number.isFinite(ops)) return "longer than the universe";
  const seconds = ops / 1e9;
  if (seconds < 1e-6) return `${(1e9 * seconds).toFixed(0)} ns`;
  if (seconds < 0.001) return `${(1e6 * seconds).toFixed(0)} µs`;
  if (seconds < 1) return `${(1e3 * seconds).toFixed(0)} ms`;
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
  const days = seconds / 86400;
  const years = days / 365.25;
  if (years < 1) return `${days.toFixed(1)} days`;
  if (years < 1e3) return `${years.toFixed(0)} years`;
  if (years < 1e9) return `${(years / 1e3).toFixed(1)}K years`;
  if (years < 1e17) return `${years.toExponential(1).replace("e+", "e")} years`;
  return "longer than the universe";
}

function classifySpeed(ops: number): "ok" | "slow" | "impossible" {
  if (!Number.isFinite(ops)) return "impossible";
  const seconds = ops / 1e9;
  if (seconds >= 3600) return "impossible";
  if (seconds >= 1) return "slow";
  return "ok";
}

// Initial idle state
const INITIAL_FRAME = {
  phase: "idle",
  sizeIdx: 0,
  n: 1,
  badge: "READY",
  accent: "yellow" as "cyan" | "yellow" | "green" | "red",
  note: "Big-O Notation: How Algorithms Scale",
  sub: "watch the seven cost curves separate as n doubles",
  resultText: "",
};

// Coordinate layouts
const DESKTOP_LAYOUT = {
  vbW: 960,
  vbH: 500,
  noteFont: 14,
  subY: 40,
  chartLabelY: 64,
  plotX: 70,
  plotW: 540,
  plotY: 88,
  plotH: 330,
  panelX: 660,
  panelW: 272,
  panelLabelY: 64,
  rowY0: 96,
  rowStep: 47,
  resultY: 470,
};

const COMPACT_LAYOUT = {
  vbW: 440,
  vbH: 596,
  noteFont: 12,
  subY: 36,
  chartLabelY: 58,
  plotX: 58,
  plotW: 362,
  plotY: 78,
  plotH: 206,
  panelX: 20,
  panelW: 400,
  panelLabelY: 310,
  rowY0: 330,
  rowStep: 34,
  resultY: 580,
};

const ACCENT_COLORS = {
  cyan: "#00bfff",
  yellow: "#facc15",
  green: "#00d084",
  red: "#f87171",
};

const Y_AXIS_TICKS = [
  { log: 0, label: "1" },
  { log: 3, label: "1K" },
  { log: 6, label: "1M" },
  { log: 9, label: "1B" },
  { log: 12, label: "1T" },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function clamp(v: number): number {
  return Math.min(1, Math.max(0, v));
}

function ChartCanvas({
  frame,
  progress,
  dark,
  compact,
}: {
  frame: typeof INITIAL_FRAME;
  progress: number;
  dark: boolean;
  compact: boolean;
}) {
  const layout = compact ? COMPACT_LAYOUT : DESKTOP_LAYOUT;
  const theme = dark
    ? {
        text: "#f4f4f5",
        label: "#a1a1aa",
        grid: "rgba(161,161,170,0.18)",
        cell: "#1f1f22",
        shadowOpacity: 0.5,
      }
    : {
        text: "#18181b",
        label: "#71717a",
        grid: "rgba(113,113,122,0.18)",
        cell: "#fafafa",
        shadowOpacity: 0.16,
      };

  const { phase, sizeIdx, n: currentN, badge, accent, note, sub, resultText } = frame;
  const clampedProgress = clamp(progress);
  const accentColor = ACCENT_COLORS[accent];
  const baselineY = layout.plotY + layout.plotH;
  const totalSteps = N_SIZES.length - 1;

  const isDone = phase === "done";
  const isIdle = phase === "idle";
  const eased = easeOutCubic(clampedProgress);

  // Smooth continuous progress from n=1 to n=256
  const effectiveProgress = isDone
    ? 1
    : isIdle
    ? 0
    : Math.min(1, (sizeIdx + eased) / totalSteps);

  const cursorX = layout.plotX + effectiveProgress * layout.plotW;

  const curves = COMPLEXITY_CLASSES.map((cls) => {
    const pointCount = Math.max(1, Math.ceil(96 * effectiveProgress));
    const pts = Array.from({ length: pointCount + 1 }, (_, stepIdx) => {
      const stepRatio = (stepIdx / pointCount) * effectiveProgress;
      const x = layout.plotX + stepRatio * layout.plotW;
      const nVal = Math.pow(2, totalSteps * stepRatio);
      const logVal = cls.logOps(nVal);
      const normalizedLog = Math.min(1, Math.max(0, logVal / 12));
      const y = baselineY - normalizedLog * layout.plotH;
      return { x, y };
    });

    const end = pts[pts.length - 1];
    const val = cls.ops(currentN);
    const atCeiling = cls.logOps(Math.pow(2, totalSteps * effectiveProgress)) > 12;

    return { cls, pts, end, value: val, atCeiling };
  });

  return (
    <svg
      viewBox={`0 0 ${layout.vbW} ${layout.vbH}`}
      className="block w-full h-auto select-none"
      textRendering="geometricPrecision"
    >
      <GlowDefs
        prefix="bo"
        colors={[
          ["cyan", "#00bfff"],
          ["green", "#00d084"],
        ]}
        shadowOpacity={theme.shadowOpacity}
      />

      {/* Top Right Badge: READY / n = X / DONE */}
      <g>
        <rect
          x={layout.vbW - 128}
          y={8}
          width={108}
          height={22}
          rx={5}
          fill="none"
          stroke={accentColor}
          strokeWidth={1.5}
          opacity={0.95}
        />
        <text
          x={layout.vbW - 74}
          y={20}
          textAnchor="middle"
          dominantBaseline="central"
          fill={accentColor}
          fontFamily="monospace"
          fontWeight={800}
          fontSize={12}
          style={{ letterSpacing: 0.8 }}
        >
          {badge}
        </text>
      </g>

      {/* Title & Subtitle inside SVG */}
      <text
        x={compact ? 20 : 28}
        y={12}
        dominantBaseline="hanging"
        fill={accentColor}
        fontFamily="monospace"
        fontWeight={800}
        fontSize={layout.noteFont}
      >
        {note}
      </text>
      <text
        x={compact ? 20 : 28}
        y={layout.subY}
        dominantBaseline="hanging"
        fill={theme.label}
        fontFamily="monospace"
        fontWeight={600}
        fontSize={compact ? 10.5 : 11.5}
      >
        {sub}
      </text>

      {/* Chart Section Header */}
      <text
        x={compact ? 20 : 28}
        y={layout.chartLabelY}
        dominantBaseline="hanging"
        fill={theme.label}
        fontFamily="monospace"
        fontWeight={800}
        fontSize={compact ? 10 : 11.5}
        style={{ letterSpacing: 1 }}
      >
        OPERATIONS VS N · LOG SCALE
      </text>

      {/* Y-axis Horizontal Grid lines & Labels */}
      {Y_AXIS_TICKS.map(({ log, label }) => {
        const y = baselineY - (log / 12) * layout.plotH;
        return (
          <g key={log}>
            <line
              x1={layout.plotX}
              y1={y}
              x2={layout.plotX + layout.plotW}
              y2={y}
              stroke={theme.grid}
              strokeWidth={1}
            />
            <text
              x={layout.plotX - 6}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fill={theme.label}
              fontFamily="monospace"
              fontWeight={600}
              fontSize={compact ? 9 : 10.5}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* X-axis ticks (n = 1, 2, 4, ... 256) */}
      {N_SIZES.map((nVal, idx) => {
        const isCurrent = idx === sizeIdx && phase !== "idle";
        return (
          <text
            key={nVal}
            x={layout.plotX + (idx / totalSteps) * layout.plotW}
            y={baselineY + (compact ? 8 : 10)}
            textAnchor="middle"
            dominantBaseline="hanging"
            fill={isCurrent ? "#00bfff" : theme.label}
            fontFamily="monospace"
            fontWeight={isCurrent ? 800 : 600}
            fontSize={compact ? 9 : 10.5}
          >
            {nVal}
          </text>
        );
      })}

      {/* Vertical Animated Cursor Line */}
      {phase !== "idle" && (
        <line
          x1={cursorX}
          y1={layout.plotY}
          x2={cursorX}
          y2={baselineY}
          stroke="#00bfff"
          strokeWidth={1.25}
          opacity={0.35}
          strokeDasharray="3 3"
        />
      )}

      {/* Complexity Curves */}
      {curves.map(({ cls, pts, end, atCeiling }) => (
        <g key={cls.id}>
          {pts.length >= 2 && (
            <polyline
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke={cls.color}
              strokeWidth={2.25}
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity={0.92}
            />
          )}
          {atCeiling ? (
            <polygon
              points={`${end.x - 5},${layout.plotY + 9} ${end.x + 5},${layout.plotY + 9} ${end.x},${layout.plotY}`}
              fill={cls.color}
            />
          ) : (
            <circle
              cx={end.x}
              cy={end.y}
              r={3.75}
              fill={cls.color}
              stroke={theme.cell}
              strokeWidth={1.25}
            />
          )}
        </g>
      ))}

      {/* Right Legend Panel: Header */}
      <text
        x={layout.panelX}
        y={layout.panelLabelY}
        dominantBaseline="hanging"
        fill={theme.label}
        fontFamily="monospace"
        fontWeight={800}
        fontSize={compact ? 10 : 11.5}
        style={{ letterSpacing: 1 }}
      >
        AT n = {currentN}
      </text>

      {/* Right Legend Panel: Rows */}
      {curves.map(({ cls, value }, idx) => {
        const rowY = layout.rowY0 + idx * layout.rowStep;
        const speedTag = classifySpeed(value);
        const timeColor =
          speedTag === "impossible"
            ? "#f87171"
            : speedTag === "slow"
            ? "#facc15"
            : theme.label;

        return (
          <g key={`row-${cls.id}`}>
            {/* Color Swatch */}
            <rect
              x={layout.panelX}
              y={rowY + 1}
              width={11}
              height={11}
              rx={3}
              fill={cls.color}
            />
            {/* Label O(...) */}
            <text
              x={layout.panelX + 19}
              y={rowY + 7}
              dominantBaseline="central"
              fill={cls.color}
              fontFamily="monospace"
              fontWeight={800}
              fontSize={compact ? 11 : 13}
            >
              {cls.label}
            </text>
            {/* Example Description */}
            <text
              x={layout.panelX + 19}
              y={rowY + (compact ? 20 : 23)}
              dominantBaseline="central"
              fill={theme.label}
              fontFamily="monospace"
              fontWeight={600}
              fontSize={compact ? 8.5 : 10}
            >
              {cls.example}
            </text>
            {/* Real-time Operation count */}
            <text
              x={layout.panelX + layout.panelW}
              y={rowY + 7}
              textAnchor="end"
              dominantBaseline="central"
              fill={theme.text}
              fontFamily="monospace"
              fontWeight={700}
              fontSize={compact ? 11 : 13}
              className="tabular-nums"
            >
              {formatOps(value)}
            </text>
            {/* Real-time Execution Time */}
            <text
              x={layout.panelX + layout.panelW}
              y={rowY + (compact ? 20 : 23)}
              textAnchor="end"
              dominantBaseline="central"
              fill={timeColor}
              fontFamily="monospace"
              fontWeight={speedTag === "ok" ? 600 : 700}
              fontSize={compact ? 8.5 : 10}
            >
              {formatTime(value)}
            </text>
          </g>
        );
      })}

      {/* Done Banner / Summary result at bottom */}
      {resultText && (
        <g opacity={phase === "done" && clampedProgress < 1 ? clampedProgress : 1}>
          <text
            x={layout.vbW / 2}
            y={layout.resultY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#00d084"
            fontSize={compact ? 13 : 16}
            fontWeight={800}
            fontFamily="monospace"
            style={{ letterSpacing: 0.3 }}
          >
            {resultText}
          </text>
        </g>
      )}
    </svg>
  );
}

export function BigOSimulation() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(960);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      const isDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isDarkClass || prefersDark);
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // ResizeObserver for responsive compact mode (< 720px)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateWidth = () => setContainerWidth(el.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isCompact = containerWidth > 0 && containerWidth < 720;

  // Build the playback frames:
  const frames = useMemo(() => {
    const list: Array<{
      phase: string;
      sizeIdx: number;
      n: number;
      badge: string;
      accent: "cyan" | "yellow" | "green" | "red";
      note: string;
      sub: string;
      resultText: string;
    }> = N_SIZES.map((nVal, idx) => {
      let note = "";
      let sub = "";

      if (nVal <= 4) {
        note = `At n = ${nVal} every class is still cheap`;
        sub = "growth rates only separate as n grows";
      } else if (nVal === 8) {
        note = `At n = 8, even O(n!) is only ${formatOps(factorial(8))} ops, ${formatTime(factorial(8))}`;
        sub = "but it is multiplying by n with every step";
      } else if (nVal === 16) {
        note = `At n = 16, O(n!) already needs ${formatOps(factorial(16))} ops, ${formatTime(factorial(16))}`;
        sub = "every polynomial class still finishes in under a microsecond";
      } else if (nVal === 32) {
        note = `At n = 32, O(2ⁿ) needs ${formatOps(0x100000000)} ops, ${formatTime(0x100000000)}`;
        sub = `O(n!) is now ${formatTime(factorial(32))}`;
      } else if (nVal === 64) {
        note = `At n = 64, O(2ⁿ) takes ${formatTime(0xffffffffffffffff)}`;
        sub = `O(n²) is still just ${formatOps(4096)} ops, ${formatTime(4096)}`;
      } else if (nVal === 128) {
        note = `At n = 128, O(2ⁿ) takes ${formatTime(3.402823669209385e38)}`;
        sub = "doubling n squared the cost of the exponential class";
      } else {
        note = `At n = 256, O(n log n) still finishes in ${formatTime(2048)}`;
        sub = "O(2ⁿ) and O(n!) left the practical range long ago";
      }

      const factorialOps = COMPLEXITY_CLASSES[COMPLEXITY_CLASSES.length - 1].ops(nVal);
      const speedStatus = classifySpeed(factorialOps);
      const accent: "cyan" | "yellow" | "green" | "red" =
        speedStatus === "impossible" ? "red" : speedStatus === "slow" ? "yellow" : "cyan";

      return {
        phase: "grow",
        sizeIdx: idx,
        n: nVal,
        badge: `n = ${nVal}`,
        accent,
        note,
        sub,
        resultText: "",
      };
    });

    list.push({
      phase: "done",
      sizeIdx: N_SIZES.length - 1,
      n: 256,
      badge: "DONE",
      accent: "green",
      note: "n grew 256×; only the curve shape decided the outcome",
      sub: "hardware moves the ceiling, algorithms move the curve",
      resultText: `O(n log n): ${formatTime(2048)} · O(n!): longer than the universe`,
    });

    return list;
  }, []);

  const player = useSimulationPlayback(900, INITIAL_FRAME);
  const { play, showIdle } = player;

  // Arm player with frames on mount
  useEffect(() => {
    play(frames, 900);
    showIdle();
  }, [frames, play, showIdle]);

  const handleRun = useCallback(() => {
    player.start();
  }, [player]);

  return (
    <div className="w-full my-6 rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap border-b border-border/50 pb-3">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold tracking-tight text-foreground flex items-center gap-2">
            <span>Big-O Notation: How Algorithms Scale</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Grow the input size and watch the cost of each complexity class diverge.
          </p>
        </div>
      </div>

      {/* Interactive Chart Canvas */}
      <div ref={containerRef} className="w-full overflow-hidden">
        <div
          className="mx-auto"
          style={{ maxWidth: isCompact ? "480px" : "960px" }}
        >
          <ChartCanvas
            frame={player.view as typeof INITIAL_FRAME}
            progress={player.progress}
            dark={isDark}
            compact={isCompact}
          />
        </div>
      </div>

      {/* Playback Transport Bar */}
      <SimulationPlayerBar
        player={player}
        onRun={handleRun}
        runLabel={player.isPlaying ? "Playing..." : player.index > 0 ? "Replay" : "Run"}
      />
    </div>
  );
}

export default BigOSimulation;
