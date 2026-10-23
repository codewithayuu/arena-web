"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle, RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_PURPLE = "#DDD6FE"; // Solid Pastel Lavender
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

// ============================================================================
// 1. FIBONACCI (TABULATION VS MEMOIZATION)
// ============================================================================

interface FibFrame {
  dp: (number | null)[];
  activeIdx: number;
  formula: string;
  note: string;
}

export function FibonacciSimulation() {
  const n = 7;
  const frames = useMemo<FibFrame[]>(() => {
    const list: FibFrame[] = [];
    const dpArr: (number | null)[] = new Array(n + 1).fill(null);

    dpArr[0] = 0;
    list.push({
      dp: [...dpArr],
      activeIdx: 0,
      formula: "dp[0] = 0",
      note: "Base Case: F(0) = 0.",
    });

    dpArr[1] = 1;
    list.push({
      dp: [...dpArr],
      activeIdx: 1,
      formula: "dp[1] = 1",
      note: "Base Case: F(1) = 1.",
    });

    for (let i = 2; i <= n; i++) {
      dpArr[i] = (dpArr[i - 1] as number) + (dpArr[i - 2] as number);
      list.push({
        dp: [...dpArr],
        activeIdx: i,
        formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dpArr[i - 1]} + ${dpArr[i - 2]} = ${dpArr[i]}`,
        note: `Compute F(${i}): Sum of previous two tabulated values F(${i - 1}) and F(${i - 2}).`,
      });
    }
    return list;
  }, [n]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Fibonacci Numbers (Bottom-Up Tabulation)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Eliminates exponential O(2ⁿ) recursion by caching subproblem solutions in an O(n) table.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="fib" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="30" textAnchor="middle" fill={COLOR_CYAN} fontSize={13} fontWeight="bold">
            {f.formula}
          </text>

          {/* 1D DP Array */}
          <g transform="translate(60, 80)">
            {f.dp.map((val, idx) => {
              const isActive = f.activeIdx === idx;
              const isPrev = f.activeIdx - 1 === idx || f.activeIdx - 2 === idx;
              const fill = isActive ? COLOR_YELLOW : isPrev ? COLOR_AMBER : "#000000";
              const stroke = isActive ? COLOR_YELLOW : isPrev ? COLOR_AMBER : "rgba(255,255,255,0.18)";
              const textFill = isActive || isPrev ? "#09090b" : val !== null ? "#FFFFFF" : "#52525b";

              return (
                <g key={idx} transform={`translate(${idx * 72}, 0)`}>
                  <rect
                    width={60}
                    height={50}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isActive || isPrev ? 2 : 1.5}
                  />
                  <text
                    x={30}
                    y={30}
                    textAnchor="middle"
                    fontSize={15}
                    fontWeight="800"
                    fill={textFill}
                  >
                    {val !== null ? val : "·"}
                  </text>
                  <text x={30} y={70} textAnchor="middle" fontSize={11} fill="#a1a1aa" fontWeight="600">
                    dp[{idx}]
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 2. COIN CHANGE (FEWEST COINS)
// ============================================================================

interface CoinChangeFrame {
  dp: number[];
  currentAmt: number;
  coinUsed?: number;
  note: string;
}

const COIN_CHANGE_COINS = [1, 2, 5];
const COIN_CHANGE_TARGET = 7;

export function CoinChangeSimulation() {
  const frames = useMemo<CoinChangeFrame[]>(() => {
    const list: CoinChangeFrame[] = [];
    const dp = new Array(COIN_CHANGE_TARGET + 1).fill(Infinity);
    dp[0] = 0;

    list.push({
      dp: [...dp],
      currentAmt: 0,
      note: "Base Case: 0 coins needed to make amount 0. Initialize dp[1..7] = ∞.",
    });

    for (let a = 1; a <= COIN_CHANGE_TARGET; a++) {
      for (const c of COIN_CHANGE_COINS) {
        if (a - c >= 0 && dp[a - c] !== Infinity) {
          const candidate = dp[a - c] + 1;
          if (candidate < dp[a]) {
            dp[a] = candidate;
            list.push({
              dp: [...dp],
              currentAmt: a,
              coinUsed: c,
              note: `Amount ${a}: Using coin ${c} => dp[${a}] = min(dp[${a}], dp[${a - c}] + 1) = ${dp[a]}.`,
            });
          }
        }
      }
    }

    list.push({
      dp: [...dp],
      currentAmt: COIN_CHANGE_TARGET,
      note: `Optimal Coin Change complete! Minimum coins to make amount ${COIN_CHANGE_TARGET} is ${dp[COIN_CHANGE_TARGET]} (e.g. 5 + 2).`,
    });

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Coin Change Problem</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Coins = [1, 2, 5], Target = 7. dp[i] represents fewest coins required to make amount i.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="coin" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(60, 70)">
            {f.dp.map((val, a) => {
              const isCurrent = f.currentAmt === a;
              const isInfinite = val === Infinity;
              const fill = isCurrent ? COLOR_YELLOW : "#000000";
              const stroke = isCurrent ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
              const textFill = isCurrent ? "#09090b" : isInfinite ? "#52525b" : "#FFFFFF";

              return (
                <g key={a} transform={`translate(${a * 70}, 0)`}>
                  <rect
                    width={58}
                    height={50}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCurrent ? 2 : 1.5}
                  />
                  <text
                    x={29}
                    y={30}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight="800"
                    fill={textFill}
                  >
                    {isInfinite ? "∞" : val}
                  </text>
                  <text x={29} y={70} textAnchor="middle" fontSize={11} fill="#a1a1aa" fontWeight="600">
                    ${a}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 3. 0/1 KNAPSACK
// ============================================================================

interface KnapsackFrame {
  table: number[][];
  activeI: number;
  activeW: number;
  decision: string;
  note: string;
}

const KNAPSACK_ITEMS = [
  { name: "A", w: 1, v: 2 },
  { name: "B", w: 2, v: 5 },
  { name: "C", w: 3, v: 6 },
];
const KNAPSACK_MAX_CAP = 4;

export function KnapsackSimulation() {
  const frames = useMemo<KnapsackFrame[]>(() => {
    const list: KnapsackFrame[] = [];
    const n = KNAPSACK_ITEMS.length;
    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(KNAPSACK_MAX_CAP + 1).fill(0));

    list.push({
      table: dp.map((r) => [...r]),
      activeI: 0,
      activeW: 0,
      decision: "Initialize 0-capacity and 0-item boundaries with 0 value.",
      note: "0/1 Knapsack: Items [A:(1kg, $2), B:(2kg, $5), C:(3kg, $6)]. Max Capacity = 4kg.",
    });

    for (let i = 1; i <= n; i++) {
      const item = KNAPSACK_ITEMS[i - 1];
      for (let w = 1; w <= KNAPSACK_MAX_CAP; w++) {
        if (item.w <= w) {
          const includeVal = dp[i - 1][w - item.w] + item.v;
          const excludeVal = dp[i - 1][w];
          dp[i][w] = Math.max(includeVal, excludeVal);
          list.push({
            table: dp.map((r) => [...r]),
            activeI: i,
            activeW: w,
            decision: `Item ${item.name}: max(exclude=${excludeVal}, include=${includeVal}) => ${dp[i][w]}`,
            note: `Item ${item.name} (w=${item.w}, v=${item.v}) fits at capacity ${w}. Optimal value is ${dp[i][w]}.`,
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          list.push({
            table: dp.map((r) => [...r]),
            activeI: i,
            activeW: w,
            decision: `Item ${item.name} exceeds capacity ${w} => Exclude: ${dp[i][w]}`,
            note: `Item ${item.name} (w=${item.w}) too heavy for capacity ${w}. Inherit previous value ${dp[i][w]}.`,
          });
        }
      }
    }

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">0/1 Knapsack Dynamic Programming Table</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            2D DP table: dp[i][w] stores maximum value achievable using subset of first i items with capacity w.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="ks" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <text x="360" y="24" textAnchor="middle" fill={COLOR_CYAN} fontSize={12} fontWeight="bold">
            {f.decision}
          </text>

          {/* Table headers */}
          <g transform="translate(140, 50)">
            {Array.from({ length: KNAPSACK_MAX_CAP + 1 }).map((_, w) => (
              <text key={w} x={w * 80 + 35} y="15" textAnchor="middle" fontSize={11} fill="#a1a1aa">
                w = {w}
              </text>
            ))}

            {f.table.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 45 + 30})`}>
                <text x="-40" y="24" fontSize={11} fill="#a1a1aa" fontWeight="bold">
                  {i === 0 ? "0" : KNAPSACK_ITEMS[i - 1].name}
                </text>
                {row.map((val, w) => {
                  const isActive = f.activeI === i && f.activeW === w;
                  const fill = isActive ? COLOR_YELLOW : "#000000";
                  const stroke = isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
                  const textFill = isActive ? "#09090b" : "#FFFFFF";
                  return (
                    <g key={w} transform={`translate(${w * 80}, 0)`}>
                      <rect
                        width={70}
                        height={36}
                        rx={6}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <text
                        x={35}
                        y={22}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight="800"
                        fill={textFill}
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 4. UNBOUNDED KNAPSACK
// ============================================================================

const UNBOUNDED_ITEMS = [
  { name: "A", w: 2, v: 4 },
  { name: "B", w: 3, v: 7 },
];
const UNBOUNDED_MAX_CAP = 6;

export function UnboundedKnapsackSimulation() {
  const frames = useMemo(() => {
    const list = [];
    const dp = new Array(UNBOUNDED_MAX_CAP + 1).fill(0);

    list.push({
      dp: [...dp],
      activeW: 0,
      note: "Unbounded Knapsack: Items can be chosen multiple times. Initial dp[0..6] = 0.",
    });

    for (let w = 1; w <= UNBOUNDED_MAX_CAP; w++) {
      for (const it of UNBOUNDED_ITEMS) {
        if (it.w <= w) {
          const cand = dp[w - it.w] + it.v;
          if (cand > dp[w]) {
            dp[w] = cand;
            list.push({
              dp: [...dp],
              activeW: w,
              note: `At cap ${w}: Use Item ${it.name} (w=${it.w}, v=${it.v}) => dp[${w}] = dp[${w - it.w}] + ${it.v} = ${dp[w]}.`,
            });
          }
        }
      }
    }

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Unbounded Knapsack (1D Optimization)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Items may be reused indefinitely. dp[w] = max(dp[w], dp[w - weight[i]] + value[i]).
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 220" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="unb" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(60, 70)">
            {f.dp.map((val, w) => {
              const isActive = f.activeW === w;
              const fill = isActive ? COLOR_YELLOW : "#000000";
              const stroke = isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
              const textFill = isActive ? "#09090b" : "#FFFFFF";
              return (
                <g key={w} transform={`translate(${w * 80}, 0)`}>
                  <rect
                    width={68}
                    height={50}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  <text x={34} y={30} textAnchor="middle" fontSize={14} fontWeight="800" fill={textFill}>
                    {val}
                  </text>
                  <text x={34} y={70} textAnchor="middle" fontSize={11} fill="#a1a1aa" fontWeight="600">
                    w = {w}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 5. LONGEST COMMON SUBSEQUENCE (LCS)
// ============================================================================

export function LcsSimulation() {
  const s1 = "ABCDE";
  const s2 = "ACE";

  const frames = useMemo(() => {
    const list = [];
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    list.push({
      dp: dp.map((r) => [...r]),
      activeI: 0,
      activeJ: 0,
      match: false,
      note: `LCS between "${s1}" and "${s2}". Initialize 0th row and column with 0.`,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const isMatch = s1[i - 1] === s2[j - 1];
        if (isMatch) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
        list.push({
          dp: dp.map((r) => [...r]),
          activeI: i,
          activeJ: j,
          match: isMatch,
          note: isMatch
            ? `'${s1[i - 1]}' == '${s2[j - 1]}': Diagonal match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`
            : `'${s1[i - 1]}' != '${s2[j - 1]}': Mismatch. max(top, left) => ${dp[i][j]}.`,
        });
      }
    }

    return list;
  }, [s1, s2]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Longest Common Subsequence (LCS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            S1 = &quot;ABCDE&quot;, S2 = &quot;ACE&quot;. Diagonal step on character match (+1), or max(up, left) on mismatch.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="lcs" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {/* S2 headers */}
          <g transform="translate(180, 40)">
            {s2.split("").map((ch, j) => (
              <text key={j} x={j * 60 + 85} y="15" textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLOR_AMBER}>
                {ch}
              </text>
            ))}

            {f.dp.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 36 + 25})`}>
                <text x="0" y="22" fontSize={13} fontWeight="bold" fill={i > 0 ? COLOR_CYAN : "#71717a"}>
                  {i === 0 ? "ε" : s1[i - 1]}
                </text>
                {row.map((val, j) => {
                  const isActive = f.activeI === i && f.activeJ === j;
                  const isMatch = isActive && f.match;
                  const fill = isMatch ? COLOR_GREEN : isActive ? COLOR_YELLOW : "#000000";
                  const stroke = isMatch ? COLOR_GREEN : isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
                  const textFill = isMatch || isActive ? "#09090b" : "#FFFFFF";

                  return (
                    <g key={j} transform={`translate(${j * 60 + 55}, 0)`}>
                      <rect
                        width={50}
                        height={30}
                        rx={6}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <text x={25} y={19} textAnchor="middle" fontSize={12} fontWeight="800" fill={textFill}>
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 6. EDIT DISTANCE (LEVENSHTEIN)
// ============================================================================

export function EditDistanceSimulation() {
  const w1 = "CAT";
  const w2 = "CUT";

  const frames = useMemo(() => {
    const list = [];
    const m = w1.length;
    const n = w2.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    list.push({
      dp: dp.map((r) => [...r]),
      activeI: 0,
      activeJ: 0,
      note: `Transforming "${w1}" to "${w2}". Base case: deletions from w1, insertions into w2.`,
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (w1[i - 1] === w2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          list.push({
            dp: dp.map((r) => [...r]),
            activeI: i,
            activeJ: j,
            note: `'${w1[i - 1]}' == '${w2[j - 1]}': Match! No operation needed: dp[${i}][${j}] = ${dp[i][j]}.`,
          });
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          list.push({
            dp: dp.map((r) => [...r]),
            activeI: i,
            activeJ: j,
            note: `'${w1[i - 1]}' != '${w2[j - 1]}': Substitute / Insert / Delete => 1 + min(...) = ${dp[i][j]}.`,
          });
        }
      }
    }

    return list;
  }, [w1, w2]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Edit Distance (Levenshtein Distance)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Minimum edits (Insert, Delete, Replace) to convert &quot;CAT&quot; into &quot;CUT&quot;.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="edit" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(200, 40)">
            {w2.split("").map((ch, j) => (
              <text key={j} x={j * 65 + 95} y="15" textAnchor="middle" fontSize={13} fontWeight="bold" fill={COLOR_AMBER}>
                {ch}
              </text>
            ))}

            {f.dp.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 42 + 25})`}>
                <text x="0" y="24" fontSize={13} fontWeight="bold" fill={i > 0 ? COLOR_CYAN : "#71717a"}>
                  {i === 0 ? "ε" : w1[i - 1]}
                </text>
                {row.map((val, j) => {
                  const isActive = f.activeI === i && f.activeJ === j;
                  const fill = isActive ? COLOR_YELLOW : "#000000";
                  const stroke = isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
                  const textFill = isActive ? "#09090b" : "#FFFFFF";
                  return (
                    <g key={j} transform={`translate(${j * 65 + 65}, 0)`}>
                      <rect
                        width={55}
                        height={34}
                        rx={6}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <text x={27} y={22} textAnchor="middle" fontSize={13} fontWeight="800" fill={textFill}>
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 7. LONGEST INCREASING SUBSEQUENCE (LIS)
// ============================================================================

const LIS_ARR = [10, 9, 2, 5, 3, 7];

export function LongestIncreasingSubsequenceSimulation() {
  const frames = useMemo(() => {
    const list = [];
    const n = LIS_ARR.length;
    const dp = new Array(n).fill(1);

    list.push({
      dp: [...dp],
      activeI: -1,
      activeJ: -1,
      note: "Initialize dp array with 1 (each single element is an increasing subsequence of length 1).",
    });

    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (LIS_ARR[j] < LIS_ARR[i]) {
          dp[i] = Math.max(dp[i], dp[j] + 1);
          list.push({
            dp: [...dp],
            activeI: i,
            activeJ: j,
            note: `arr[${j}] (${LIS_ARR[j]}) < arr[${i}] (${LIS_ARR[i]}): Extend LIS ending at ${j}. dp[${i}] = ${dp[i]}.`,
          });
        }
      }
    }

    list.push({
      dp: [...dp],
      activeI: n - 1,
      activeJ: -1,
      note: `LIS complete! Max length in dp array is ${Math.max(...dp)} (e.g. [2, 5, 7] or [2, 3, 7]).`,
    });

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Longest Increasing Subsequence (LIS)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            O(n²) Dynamic Programming: dp[i] = max(dp[j] + 1) for all j &lt; i where arr[j] &lt; arr[i].
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="lis" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["amber", COLOR_AMBER]]} />

          <g transform="translate(80, 50)">
            {LIS_ARR.map((val, idx) => {
              const isI = f.activeI === idx;
              const isJ = f.activeJ === idx;
              const fill = isI ? COLOR_YELLOW : isJ ? COLOR_AMBER : "#000000";
              const stroke = isI ? COLOR_YELLOW : isJ ? COLOR_AMBER : "rgba(255,255,255,0.18)";
              const textFill = isI || isJ ? "#09090b" : "#FFFFFF";

              return (
                <g key={idx} transform={`translate(${idx * 90}, 0)`}>
                  <rect
                    width={72}
                    height={48}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isI || isJ ? 2 : 1.5}
                  />
                  <text x={36} y={28} textAnchor="middle" fontSize={14} fontWeight="800" fill={textFill}>
                    {val}
                  </text>
                  <text x={36} y={75} textAnchor="middle" fontSize={11} fill="#a1a1aa" fontWeight="600">
                    dp[{idx}] = {f.dp[idx]}
                  </text>
                  {isI && <text x={36} y={95} textAnchor="middle" fontSize={10} fill={COLOR_YELLOW} fontWeight="800">i</text>}
                  {isJ && <text x={36} y={95} textAnchor="middle" fontSize={10} fill={COLOR_AMBER} fontWeight="800">j</text>}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 8. MATRIX CHAIN MULTIPLICATION
// ============================================================================

export function MatrixChainSimulation() {
  const p = [10, 20, 30, 40]; // 3 matrices: A1(10x20), A2(20x30), A3(30x40)

  const frames = useMemo(() => {
    return [
      {
        table: [
          [0, 6000, 18000],
          [0, 0, 24000],
          [0, 0, 0],
        ],
        activeCell: [0, 0],
        note: "Base Case: Cost of multiplying a single matrix A_i is 0. Diagonal dp[i][i] = 0.",
      },
      {
        table: [
          [0, 6000, 18000],
          [0, 0, 24000],
          [0, 0, 0],
        ],
        activeCell: [0, 1],
        note: "Chain len 2: Cost(A1 * A2) = 10 * 20 * 30 = 6,000 multiplications.",
      },
      {
        table: [
          [0, 6000, 18000],
          [0, 0, 24000],
          [0, 0, 0],
        ],
        activeCell: [1, 2],
        note: "Chain len 2: Cost(A2 * A3) = 20 * 30 * 40 = 24,000 multiplications.",
      },
      {
        table: [
          [0, 6000, 18000],
          [0, 0, 24000],
          [0, 0, 0],
        ],
        activeCell: [0, 2],
        note: "Chain len 3: (A1*A2)*A3 = 6000 + 10*30*40 = 18,000 vs A1*(A2*A3) = 24000 + 10*20*40 = 32,000. Optimal = 18,000!",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Matrix Chain Multiplication (MCM)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interval DP table filled diagonally: minimizes total scalar multiplications by finding optimal parenthesization.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="mcm" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(180, 40)">
            {f.table.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 50})`}>
                <text x="-40" y="30" fontSize={12} fill="#a1a1aa" fontWeight="bold">
                  A{i + 1}
                </text>
                {row.map((val, j) => {
                  const isActive = f.activeCell[0] === i && f.activeCell[1] === j;
                  const isUpper = j >= i;
                  const fill = isActive ? COLOR_YELLOW : isUpper ? "#000000" : "transparent";
                  const stroke = isActive ? COLOR_YELLOW : isUpper ? "rgba(255,255,255,0.18)" : "transparent";
                  const textFill = isActive ? "#09090b" : "#FFFFFF";

                  return (
                    <g key={j} transform={`translate(${j * 110}, 0)`}>
                      <rect
                        width={90}
                        height={40}
                        rx={6}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {isUpper && (
                        <text
                          x={45}
                          y={25}
                          textAnchor="middle"
                          fontSize={12}
                          fontWeight="800"
                          fill={textFill}
                        >
                          {val}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 9. SUBSET SUM
// ============================================================================

const SUBSET_SUM_NUMS = [2, 3, 5];
const SUBSET_SUM_TARGET = 7;

export function SubsetSumSimulation() {
  const frames = useMemo(() => {
    const list = [];
    const n = SUBSET_SUM_NUMS.length;
    const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(SUBSET_SUM_TARGET + 1).fill(false));

    for (let i = 0; i <= n; i++) dp[i][0] = true;

    list.push({
      dp: dp.map((r) => [...r]),
      activeI: 0,
      activeS: 0,
      note: "Base Case: A sum of 0 is always possible using the empty subset. dp[i][0] = true.",
    });

    for (let i = 1; i <= n; i++) {
      const num = SUBSET_SUM_NUMS[i - 1];
      for (let s = 1; s <= SUBSET_SUM_TARGET; s++) {
        if (s >= num) {
          dp[i][s] = dp[i - 1][s] || dp[i - 1][s - num];
        } else {
          dp[i][s] = dp[i - 1][s];
        }
        list.push({
          dp: dp.map((r) => [...r]),
          activeI: i,
          activeS: s,
          note: `Num ${num}, sum ${s}: ${dp[i][s] ? "Achievable!" : "Cannot form sum yet."}`,
        });
      }
    }

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(500, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 500);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Subset Sum Problem</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nums = [2, 3, 5], Target = 7. dp[i][s] indicates whether sum s can be formed using a subset of first i numbers.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="ss" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(100, 40)">
            {Array.from({ length: SUBSET_SUM_TARGET + 1 }).map((_, s) => (
              <text key={s} x={s * 65 + 32} y="15" textAnchor="middle" fontSize={11} fill="#a1a1aa">
                s={s}
              </text>
            ))}

            {f.dp.map((row, i) => (
              <g key={i} transform={`translate(0, ${i * 44 + 30})`}>
                <text x="-35" y="24" fontSize={11} fill="#a1a1aa" fontWeight="bold">
                  {i === 0 ? "Ø" : SUBSET_SUM_NUMS[i - 1]}
                </text>
                {row.map((achievable, s) => {
                  const isActive = f.activeI === i && f.activeS === s;
                  const fill = isActive ? COLOR_YELLOW : achievable ? COLOR_GREEN : "#000000";
                  const stroke = isActive ? COLOR_YELLOW : achievable ? COLOR_GREEN : "rgba(255,255,255,0.18)";
                  const textFill = isActive || achievable ? "#09090b" : "#52525b";
                  return (
                    <g key={s} transform={`translate(${s * 65}, 0)`}>
                      <rect
                        width={55}
                        height={34}
                        rx={6}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <text
                        x={27}
                        y={21}
                        textAnchor="middle"
                        fontSize={11}
                        fontWeight="800"
                        fill={textFill}
                      >
                        {achievable ? "T" : "F"}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 10. UNIQUE PATHS
// ============================================================================

export function UniquePathsSimulation() {
  const rows = 3;
  const cols = 4;

  const frames = useMemo(() => {
    const list = [];
    const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

    for (let r = 0; r < rows; r++) dp[r][0] = 1;
    for (let c = 0; c < cols; c++) dp[0][c] = 1;

    list.push({
      dp: dp.map((row) => [...row]),
      activeR: 0,
      activeC: 0,
      note: "Top row and leftmost column have only 1 unique path (moving strictly Right or strictly Down).",
    });

    for (let r = 1; r < rows; r++) {
      for (let c = 1; c < cols; c++) {
        dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
        list.push({
          dp: dp.map((row) => [...row]),
          activeR: r,
          activeC: c,
          note: `Cell (${r}, ${c}): Paths from Top (${dp[r - 1][c]}) + Left (${dp[r][c - 1]}) = ${dp[r][c]}.`,
        });
      }
    }

    return list;
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Unique Paths in a Grid</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Robot moves only Right or Down. dp[r][c] = dp[r-1][c] + dp[r][c-1].
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 260" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="up" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(160, 50)">
            {f.dp.map((row, r) => (
              <g key={r} transform={`translate(0, ${r * 60})`}>
                {row.map((val, c) => {
                  const isActive = f.activeR === r && f.activeC === c;
                  const fill = isActive ? COLOR_YELLOW : "#000000";
                  const stroke = isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)";
                  const textFill = isActive ? "#09090b" : "#FFFFFF";
                  return (
                    <g key={c} transform={`translate(${c * 95}, 0)`}>
                      <rect
                        width={80}
                        height={46}
                        rx={8}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      <text x={40} y={28} textAnchor="middle" fontSize={14} fontWeight="800" fill={textFill}>
                        {val}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 11. BITMASK DP (TRAVELING SALESPERSON / SUBSET ASSIGNMENT)
// ============================================================================

export function BitmaskDpSimulation() {
  const frames = useMemo(() => {
    return [
      {
        mask: 1, // 0001₂ (visited node 0)
        maskStr: "0001₂ (node 0)",
        cost: 0,
        activeNode: 0,
        note: "Base Case: Start at node 0. Mask = 1 (Node 0 visited). Distance = 0.",
      },
      {
        mask: 3, // 0011₂ (visited 0, 1)
        maskStr: "0011₂ (nodes 0, 1)",
        cost: 10,
        activeNode: 1,
        note: "Transition to node 1: New mask = mask | (1 << 1) = 0011₂. Cost = dist(0, 1) = 10.",
      },
      {
        mask: 7, // 0111₂ (visited 0, 1, 2)
        maskStr: "0111₂ (nodes 0, 1, 2)",
        cost: 25,
        activeNode: 2,
        note: "Transition to node 2: mask | (1 << 2) = 0111₂. Cost = 10 + dist(1, 2) = 25.",
      },
      {
        mask: 15, // 1111₂ (visited all 4 nodes)
        maskStr: "1111₂ (all visited)",
        cost: 45,
        activeNode: 3,
        note: "Final node 3: All 4 cities visited! Mask = (1<<4)-1 = 15. Min Hamiltonian tour found.",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Bitmask Dynamic Programming</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Integer bits represent visited subsets. Solves NP-hard problems (like TSP) in O(n² · 2ⁿ) time.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 240" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="bmdp" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <g transform="translate(120, 50)">
            <text x="0" y="25" fill="#a1a1aa" fontSize={13} fontWeight="bold">
              Current Subset Mask:
            </text>
            <rect x="200" y="5" width="220" height="34" rx={6} fill={COLOR_YELLOW} stroke={COLOR_YELLOW} strokeWidth={1.5} />
            <text x="310" y="27" textAnchor="middle" fill="#09090b" fontSize={13} fontWeight="800">
              {f.maskStr}
            </text>

            <text x="0" y="85" fill="#a1a1aa" fontSize={13} fontWeight="bold">
              Accumulated Path Cost:
            </text>
            <rect x="200" y="65" width="100" height="34" rx={6} fill={COLOR_GREEN} stroke={COLOR_GREEN} strokeWidth={1.5} />
            <text x="250" y="87" textAnchor="middle" fill="#09090b" fontSize={13} fontWeight="800">
              {f.cost}
            </text>
          </g>
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}

// ============================================================================
// 12. DP ON TREES (MAXIMUM WEIGHT INDEPENDENT SET)
// ============================================================================

export function DpOnTreesSimulation() {
  const frames = useMemo(() => {
    return [
      {
        activeNode: 4,
        dpValues: { 4: [0, 4] },
        note: "Leaf Node 4: dp[4][0]=0 (skip), dp[4][1]=4 (include).",
      },
      {
        activeNode: 5,
        dpValues: { 4: [0, 4], 5: [0, 7] },
        note: "Leaf Node 5: dp[5][0]=0, dp[5][1]=7.",
      },
      {
        activeNode: 2,
        dpValues: { 4: [0, 4], 5: [0, 7], 2: [11, 3] },
        note: "Subtree Node 2: If include 2, skip children (cost 3). If skip 2, take max of children (4+7=11).",
      },
      {
        activeNode: 3,
        dpValues: { 4: [0, 4], 5: [0, 7], 2: [11, 3], 3: [0, 6] },
        note: "Leaf Node 3: dp[3][0]=0, dp[3][1]=6.",
      },
      {
        activeNode: 1,
        dpValues: { 4: [0, 4], 5: [0, 7], 2: [11, 3], 3: [0, 6], 1: [17, 12] },
        note: "Root Node 1: Optimal Independent Set weight = max(17, 12) = 17 (select nodes 3, 4, 5).",
      },
    ];
  }, []);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(600, initialFrame);
  const f = playback.armed && playback.index >= 0 && playback.index < frames.length ? frames[playback.index] : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 600);
  }, [playback, frames]);

  const treeNodes = [
    { id: 1, val: 5, x: 360, y: 50 },
    { id: 2, val: 3, x: 260, y: 120 },
    { id: 3, val: 6, x: 460, y: 120 },
    { id: 4, val: 4, x: 210, y: 190 },
    { id: 5, val: 7, x: 310, y: 190 },
  ];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Dynamic Programming on Trees</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maximum Weight Independent Set: no two selected nodes may share an edge. Solved via bottom-up tree DP.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black p-4 sm:p-6 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 720 280" className="w-full h-auto select-none" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="dptree" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          <line x1={360} y1={50} x2={260} y2={120} stroke="rgba(255,255,255,0.2)" strokeWidth={1.8} />
          <line x1={360} y1={50} x2={460} y2={120} stroke="rgba(255,255,255,0.2)" strokeWidth={1.8} />
          <line x1={260} y1={120} x2={210} y2={190} stroke="rgba(255,255,255,0.2)" strokeWidth={1.8} />
          <line x1={260} y1={120} x2={310} y2={190} stroke="rgba(255,255,255,0.2)" strokeWidth={1.8} />

          {treeNodes.map((n) => {
            const isActive = f.activeNode === n.id;
            const dp = (f.dpValues as unknown as Record<number, [number, number]>)[n.id];
            const fill = isActive ? COLOR_YELLOW : dp ? COLOR_GREEN : "#000000";
            const stroke = isActive ? COLOR_YELLOW : dp ? COLOR_GREEN : "rgba(255, 255, 255, 0.2)";
            const textFill = (isActive || dp) ? "#09090b" : "#FFFFFF";

            return (
              <g key={n.id} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text textAnchor="middle" dy="0.35em" fontSize={13} fontWeight="800" fill={textFill}>
                  {n.val}
                </text>
                {dp && (
                  <g transform="translate(32, -6)">
                    <rect x={-4} y={-4} width={50} height={18} rx={4} fill="#000000" stroke={COLOR_GREEN} strokeWidth={1.2} />
                    <text x={21} y={8} textAnchor="middle" fontSize={10} fill={COLOR_GREEN} fontWeight="800">
                      [{dp[0]}, {dp[1]}]
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <SimulationPlayerBar player={playback} onRun={handleRun} statusText={f.note} />
    </div>
  );
}
