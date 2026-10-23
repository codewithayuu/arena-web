"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

// ==========================================
// 1. Balanced vs Unbalanced Partition Simulation
// ==========================================
const BUP_SCENARIOS = [
  { id: "n16", name: "n = 16", n: 16 },
  { id: "n8", name: "n = 8", n: 8 },
];

function calcUnbalancedSum(n: number, steps: number): number {
  let s = 0;
  for (let i = 0; i < steps; i++) s += n - i;
  return s;
}

export function BalancedVsUnbalancedPartitionSimulation() {
  const [scenarioId, setScenarioId] = useState(BUP_SCENARIOS[0].id);
  const active = BUP_SCENARIOS.find((s) => s.id === scenarioId) ?? BUP_SCENARIOS[0];
  const n = active.n;
  const numBalancedLevels = Math.round(Math.log2(n)) + 1;
  const maxDisplaySteps = Math.min(n, 10);
  const totalBalancedWork = numBalancedLevels * n;
  const totalUnbalancedWork = (n * (n + 1)) / 2;

  const frames = useMemo(() => {
    const list = [];
    for (let s = 0; s < maxDisplaySteps; s++) {
      const balLevel = Math.min(s + 1, numBalancedLevels);
      const balWork = balLevel * n;
      const unbWork = calcUnbalancedSum(n, s + 1);
      const isResize = s === 0;

      list.push({
        step: s,
        balLevel,
        balWork,
        unbWork,
        narration: isResize
          ? `Level 0: both do n = ${n} work at root`
          : `Step ${s + 1}: balanced branches 2×, unbalanced peels 1 element`,
        status: `Level ${s + 1}: balanced work = ${balWork}, unbalanced work = ${unbWork}`,
      });
    }
    list.push({
      step: maxDisplaySteps,
      balLevel: numBalancedLevels,
      balWork: totalBalancedWork,
      unbWork: totalUnbalancedWork,
      narration: `Balanced: ${numBalancedLevels} levels, O(n log n). Unbalanced: ${n} levels, O(n²)!`,
      status: `Done: O(n log n) = ${totalBalancedWork} vs O(n²) = ${totalUnbalancedWork}`,
    });
    return list;
  }, [n, numBalancedLevels, maxDisplaySteps, totalBalancedWork, totalUnbalancedWork]);

  const idleFrame = useMemo(() => ({
    step: -1,
    balLevel: 0,
    balWork: 0,
    unbWork: 0,
    narration: "Press Play: compare pivot partitions side-by-side (balanced vs worst-case)",
    status: `Ready · Array size n = ${n}`,
  }), [n]);

  const player = useSimulationPlayback(750, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 750);
  }, [frames, player]);

  const isDone = current.step >= maxDisplaySteps;
  const currentStep = current.step;
  const unitW = Math.max(2, 380 / n);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            The pivot, not the algorithm, decides whether quicksort costs n log n or n squared.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {BUP_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 420" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="bup" colors={[["cyan", "#00ceff"], ["orange", "#ffa94d"], ["green", "#69db7c"]]} />

          {/* Badge */}
          <g>
            <rect x={784} y={10} width={148} height={22} rx={5} fill="none" stroke="#69db7c" strokeWidth={1.5} />
            <text x={858} y={21} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              n log n vs n²
            </text>
          </g>

          <text x={24} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Column Titles */}
          <text x={24} y={46} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12.5}>
            BALANCED, T(n) = 2T(n/2) + n
          </text>
          <text x={500} y={46} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12.5}>
            UNBALANCED, T(n) = T(n-1) + n
          </text>

          {/* Center Divider */}
          <line x1={480} y1={42} x2={480} y2={352} stroke="rgba(161,161,170,0.3)" strokeWidth={2} />

          {/* Left Side: Balanced Tree Levels */}
          {Array.from({ length: numBalancedLevels }).map((_, lIdx) => {
            if (currentStep >= 0 && lIdx > current.balLevel - 1 && !isDone) return null;
            if (currentStep < 0) return null;

            const isCurrent = lIdx === current.balLevel - 1;
            const pieces = Math.pow(2, lIdx);
            const pieceW = (380 - (pieces - 1) * 4) / pieces;
            const y = 78 + 24 * lIdx;

            return (
              <g key={`bal-${lIdx}`}>
                <text x={60} y={y + 8.5} textAnchor="end" dominantBaseline="central" fill={isCurrent ? "#00ceff" : "#a1a1aa"} fontFamily="var(--font-mono, monospace)" fontWeight={isCurrent ? 800 : 600} fontSize={11} className="tabular-nums">
                  {pieces}×{n / pieces}
                </text>
                {Array.from({ length: pieces }).map((_, pIdx) => (
                  <rect
                    key={pIdx}
                    x={68 + pIdx * (pieceW + 4)}
                    y={y}
                    width={pieceW}
                    height={17}
                    rx={4}
                    fill={isCurrent ? "#00ceff" : "rgba(59,201,219,0.22)"}
                    stroke="#00ceff"
                    strokeWidth={isCurrent ? 2.2 : 1.4}
                  />
                ))}
              </g>
            );
          })}

          {isDone && (
            <text x={68} y={78 + 24 * numBalancedLevels + 6} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5}>
              done, {numBalancedLevels} levels, {totalBalancedWork} total work → O(n log n)
            </text>
          )}

          {/* Right Side: Unbalanced Tree Levels */}
          {Array.from({ length: maxDisplaySteps }).map((_, sIdx) => {
            if (currentStep >= 0 && sIdx > currentStep && !isDone) return null;
            if (currentStep < 0) return null;

            const isCurrent = sIdx === currentStep;
            const rem = n - sIdx;
            const y = 78 + 24 * sIdx;

            return (
              <g key={`unb-${sIdx}`}>
                <text x={546} y={y + 8.5} textAnchor="end" dominantBaseline="central" fill={isCurrent ? "#ffa94d" : "#a1a1aa"} fontFamily="var(--font-mono, monospace)" fontWeight={isCurrent ? 800 : 600} fontSize={11} className="tabular-nums">
                  1×{rem}
                </text>
                <rect
                  x={554}
                  y={y}
                  width={rem * unitW - 4}
                  height={17}
                  rx={4}
                  fill={isCurrent ? "#ffa94d" : "rgba(255,169,77,0.22)"}
                  stroke="#ffa94d"
                  strokeWidth={isCurrent ? 2.2 : 1.4}
                />
              </g>
            );
          })}

          {/* Stats bottom */}
          <text x={28} y={368} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            BALANCED WORK
          </text>
          <text x={28} y={386} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.balWork}
          </text>

          <text x={200} y={368} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            UNBALANCED WORK
          </text>
          <text x={200} y={386} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.unbWork}
          </text>

          {isDone ? (
            <text x={610} y={380} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              O(n log n) = {totalBalancedWork} vs O(n²) = {totalUnbalancedWork}
            </text>
          ) : (
            <text x={380} y={390} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              same algorithm, different recurrence shape
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 2. Iterative Expansion Simulation: O(n²)
// ==========================================
const IE_SCENARIOS = [
  { id: "n6", name: "n = 6", n: 6 },
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n10", name: "n = 10", n: 10 },
];

export function IterativeExpansionSimulation() {
  const [scenarioId, setScenarioId] = useState(IE_SCENARIOS[1].id);
  const active = IE_SCENARIOS.find((s) => s.id === scenarioId) ?? IE_SCENARIOS[1];
  const n = active.n;
  const totalSum = (n * (n + 1)) / 2;

  const frames = useMemo(() => {
    const list = [];
    let acc = 0;
    for (let i = 0; i < n; i++) {
      const term = n - i;
      acc += term;
      list.push({
        line: i,
        peeled: i + 1,
        sum: acc,
        narration: `Substitute T(${term - 1}): peel off + ${term}, term banked`,
        status: `Substitution ${i + 1} of ${n}, banked sum = ${acc}`,
      });
    }
    list.push({
      line: n - 1,
      peeled: n,
      sum: totalSum,
      narration: `Chain bottoms out at T(0), every term is banked: ${totalSum}`,
      status: `T(0) = 0, all ${n} terms banked, total = ${totalSum}`,
    });
    list.push({
      line: n - 1,
      peeled: n,
      sum: totalSum,
      narration: `Sum the leftovers: n(n+1)/2 = ${totalSum} ≈ n²/2 → O(n²)`,
      status: `Done: 1 + 2 + ... + ${n} = ${totalSum} (O(n²))`,
    });
    return list;
  }, [n, totalSum]);

  const idleFrame = useMemo(() => ({
    line: -1,
    peeled: 0,
    sum: 0,
    narration: "Press Play: repeatedly substitute T(n-1) to unpack the recurrence",
    status: `Ready · Recurrence T(n) = T(n-1) + n for n = ${n}`,
  }), [n]);

  const player = useSimulationPlayback(800, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 800);
  }, [frames, player]);

  const isDone = current.peeled === n && current.sum === totalSum;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Expanding a subtract-and-conquer recurrence leaves an arithmetic series behind: O(n²).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {IE_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 380" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="ie" colors={[["orange", "#ffa94d"], ["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#ffa94d" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(n²)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#ffa94d" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Expansion steps */}
          {Array.from({ length: n }).map((_, stepIdx) => {
            if (current.peeled < stepIdx + 1 && !isDone) return null;
            const term = n - stepIdx;
            const isCurrent = stepIdx === current.line;
            const y = 60 + stepIdx * 26;

            return (
              <g key={stepIdx}>
                <text x={60} y={y + 10} fill={isCurrent ? "#00ceff" : "#a1a1aa"} fontFamily="var(--font-mono, monospace)" fontSize={12} fontWeight={700}>
                  Step {stepIdx + 1}:
                </text>
                <text x={140} y={y + 10} fill={isCurrent ? "#f4f4f5" : "#71717a"} fontFamily="var(--font-mono, monospace)" fontSize={13}>
                  T({term}) = T({term - 1}) + <tspan fill={isCurrent ? "#ffa94d" : "#00ceff"} fontWeight={800}>{term}</tspan>
                </text>
              </g>
            );
          })}

          {/* Sum bar */}
          <text x={28} y={328} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            BANKED ARITHMETIC SUM
          </text>
          <text x={28} y={346} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.sum}
          </text>

          {isDone ? (
            <text x={480} y={340} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              n(n + 1) / 2 = {totalSum} operations → O(n²)
            </text>
          ) : (
            <text x={180} y={350} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              Arithmetic series unrolls from recursive substitution
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 3. Recurrence Shape Explorer Simulation
// ==========================================
export function RecurrenceShapeExplorerSimulation() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(2);
  const [fType, setFType] = useState<"1" | "n" | "n2">("n");

  const logba = useMemo(() => Math.log(a) / Math.log(b), [a, b]);
  const cVal = fType === "1" ? 0 : fType === "n" ? 1 : 2;

  const classification = useMemo(() => {
    if (Math.abs(cVal - logba) < 1e-5) return { caseNo: 2, label: "Case 2: Balanced", note: "Work distributed evenly across all levels" };
    if (cVal < logba) return { caseNo: 1, label: "Case 1: Leaf-Heavy", note: "Leaves dominate total runtime" };
    return { caseNo: 3, label: "Case 3: Root-Heavy", note: "Root problem dominates total runtime" };
  }, [cVal, logba]);

  const treeLevels = useMemo(() => {
    const depth = Math.floor(Math.log(16) / Math.log(b) + 1e-9);
    const list = [];
    for (let l = 0; l <= depth; l++) {
      const subproblems = Math.pow(a, l);
      const subSize = 16 / Math.pow(b, l);
      const workPerNode = fType === "1" ? 1 : fType === "n" ? subSize : subSize * subSize;
      const totalWork = subproblems * workPerNode;
      list.push({ level: l, subproblems, subSize, totalWork });
    }
    return list;
  }, [a, b, fType]);

  const totalTreeWork = useMemo(() => treeLevels.reduce((acc, l) => acc + l.totalWork, 0), [treeLevels]);

  return (
    <div className="w-full space-y-4">
      {/* Parameter Knobs */}
      <div className="flex items-center justify-between gap-4 flex-wrap rounded-xl border border-border/60 bg-muted/20 p-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground">a (branches):</span>
          {[1, 2, 3, 4].map((val) => (
            <button
              key={val}
              onClick={() => setA(val)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                a === val ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground">b (scale):</span>
          {[2, 3, 4].map((val) => (
            <button
              key={val}
              onClick={() => setB(val)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                b === val ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-foreground">f(n):</span>
          {(["1", "n", "n2"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFType(t)}
              className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-colors ${
                fType === t ? "bg-foreground text-background" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {t === "n2" ? "n²" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 400" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="rse" colors={[["cyan", "#00ceff"], ["green", "#69db7c"], ["orange", "#ffa94d"]]} />

          <g>
            <rect x={794} y={8} width={132} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={860} y={19} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
              {classification.label}
            </text>
          </g>

          <text x={34} y={14} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            T(n) = {a}T(n/{b}) + {fType === "n2" ? "n²" : fType} (log_{b}({a}) ≈ {logba.toFixed(2)} vs c = {cVal})
          </text>
          <text x={34} y={38} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12}>
            {classification.note}
          </text>

          {/* Tree Level Work Bars */}
          {treeLevels.map((lvl, idx) => {
            const y = 80 + idx * 60;
            const maxWork = Math.max(1, ...treeLevels.map((l) => l.totalWork));
            const barW = Math.max(8, (lvl.totalWork / maxWork) * 620);

            return (
              <g key={idx}>
                <text x={34} y={y + 12} fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={12}>
                  Level {lvl.level}: {lvl.subproblems} × {lvl.subSize.toFixed(1)}
                </text>
                <rect x={180} y={y} width={barW} height={24} rx={6} fill="rgba(0,206,255,0.22)" stroke="#00ceff" strokeWidth={1.8} />
                <text x={190 + barW} y={y + 12} dominantBaseline="central" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
                  {lvl.totalWork.toFixed(1)} work
                </text>
              </g>
            );
          })}

          <text x={34} y={350} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            TOTAL WORK SUM
          </text>
          <text x={34} y={368} dominantBaseline="hanging" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {totalTreeWork.toFixed(1)}
          </text>
          <text x={220} y={370} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={13}>
            {classification.caseNo === 2 ? "All levels do equal work → T(n) = Θ(n^c log n)" : classification.caseNo === 1 ? "Leaf level dominates → T(n) = Θ(n^(log_b a))" : "Root level dominates → T(n) = Θ(f(n))"}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 4. Substitution Method Simulation
// ==========================================
const SUB_SCENARIOS = [
  { id: "ms", name: "Merge Sort", badge: "O(n log n)", target: "T(n) ≤ c·n·log n" },
  { id: "bs", name: "Binary Search", badge: "O(log n)", target: "T(n) ≤ c·log n" },
];

export function SubstitutionMethodSimulation() {
  const [scenarioId, setScenarioId] = useState(SUB_SCENARIOS[0].id);
  const active = SUB_SCENARIOS.find((s) => s.id === scenarioId) ?? SUB_SCENARIOS[0];

  const steps = useMemo(() => {
    if (active.id === "ms") {
      return [
        { title: "1. The Guess", math: "T(n) = 2T(n/2) + n  ==>  Guess T(n) ≤ c·n·log₂ n", note: "Pick a trial bound based on recursion tree shape." },
        { title: "2. Inductive Hypothesis", math: "Assume T(k) ≤ c·k·log₂ k holds for all k < n", note: "Specifically for k = n/2." },
        { title: "3. Substitute & Expand", math: "T(n) ≤ 2(c·(n/2)·log₂(n/2)) + n = c·n·(log₂ n - 1) + n", note: "Algebraically simplify using log laws." },
        { title: "4. Constant Selection", math: "= c·n·log₂ n - c·n + n ≤ c·n·log₂ n  (holds whenever c ≥ 1)", note: "Subtracting c·n cancels +n as long as c ≥ 1. Q.E.D.!" },
      ];
    }
    return [
      { title: "1. The Guess", math: "T(n) = T(n/2) + 1  ==>  Guess T(n) ≤ c·log₂ n", note: "Halving range with constant combine work." },
      { title: "2. Inductive Hypothesis", math: "Assume T(k) ≤ c·log₂ k holds for all k < n", note: "Specifically for k = n/2." },
      { title: "3. Substitute & Expand", math: "T(n) ≤ c·log₂(n/2) + 1 = c·(log₂ n - 1) + 1", note: "log₂(n/2) = log₂ n - 1." },
      { title: "4. Constant Selection", math: "= c·log₂ n - c + 1 ≤ c·log₂ n  (holds whenever c ≥ 1)", note: "The constant -c cancels +1 for any c ≥ 1. Q.E.D.!" },
    ];
  }, [active.id]);

  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Guess a bound, then prove it holds by induction, one algebra step at a time.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {SUB_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                setActiveStep(0);
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 440" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="sub" colors={[["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              {active.badge}
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            Proof: {active.target}
          </text>

          {/* 4 Proof Step Cards */}
          {steps.map((st, idx) => {
            const y = 54 + idx * 88;
            const isCurrent = idx === activeStep;

            return (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => setActiveStep(idx)}
              >
                <rect
                  x={28}
                  y={y}
                  width={904}
                  height={76}
                  rx={10}
                  fill={isCurrent ? "rgba(0,206,255,0.12)" : "#18181b"}
                  stroke={isCurrent ? "#00ceff" : "rgba(161,161,170,0.25)"}
                  strokeWidth={isCurrent ? 2 : 1.2}
                />
                <text x={48} y={y + 16} fill={isCurrent ? "#00ceff" : "#a1a1aa"} fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
                  {st.title}
                </text>
                <text x={48} y={y + 42} fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={14}>
                  {st.math}
                </text>
                <text x={48} y={y + 62} fill="#71717a" fontFamily="var(--font-mono, monospace)" fontSize={11}>
                  {st.note}
                </text>
              </g>
            );
          })}

          <text x={28} y={414} fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={13}>
            Click any step to inspect the inductive derivation.
          </text>
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 5. Tower of Hanoi Recurrence Simulation: O(2ⁿ)
// ==========================================
const TH_SCENARIOS = [
  { id: "n3", name: "n = 3 disks", n: 3 },
  { id: "n4", name: "n = 4 disks", n: 4 },
];

export function HanoiRecurrenceSimulation() {
  const [scenarioId, setScenarioId] = useState(TH_SCENARIOS[0].id);
  const active = TH_SCENARIOS.find((s) => s.id === scenarioId) ?? TH_SCENARIOS[0];
  const n = active.n;
  const totalMoves = Math.pow(2, n) - 1;

  const frames = useMemo(() => {
    const list = [];
    for (let l = 0; l < n; l++) {
      const callsAtL = Math.pow(2, l);
      const acc = Math.pow(2, l + 1) - 1;
      list.push({
        level: l,
        moves: acc,
        narration: l === 0 ? `Level 0: 1 call to solve tower of size ${n}` : `Level ${l}: ${callsAtL} calls to solve sub-towers of size ${n - l}`,
        status: `Level ${l} of ${n - 1}, accumulated moves = ${acc}`,
      });
    }
    list.push({
      level: n - 1,
      moves: totalMoves,
      narration: `Tower of Hanoi bottoms out: 2ⁿ - 1 = ${totalMoves} moves → O(2ⁿ)`,
      status: `Done: T(${n}) = 2T(${n - 1}) + 1 = ${totalMoves} moves`,
    });
    return list;
  }, [n, totalMoves]);

  const idleFrame = useMemo(() => ({
    level: -1,
    moves: 0,
    narration: "Press Play: T(n) = 2T(n-1) + 1 doubles calls at each disk level",
    status: `Ready · Hanoi recurrence for n = ${n} disks (2ⁿ - 1 = ${totalMoves} moves)`,
  }), [n, totalMoves]);

  const player = useSimulationPlayback(850, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 850);
  }, [frames, player]);

  const isDone = current.moves === totalMoves;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Shrinking by one instead of halving keeps the tree n levels deep while it still doubles: O(2ⁿ).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {TH_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setScenarioId(s.id);
                player.showIdle();
              }}
              className={`px-3 py-1.5 font-medium transition-colors ${
                scenarioId === s.id ? "bg-foreground text-background font-bold" : "hover:bg-muted text-muted-foreground"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full rounded-2xl border border-white/10 bg-black p-4 overflow-hidden shadow-2xl">
        <svg viewBox="0 0 960 400" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="th" colors={[["cyan", "#00ceff"], ["red", "#ff8787"], ["green", "#69db7c"]]} />

          <g>
            <rect x={808} y={10} width={124} height={22} rx={5} fill="none" stroke="#ff8787" strokeWidth={1.5} />
            <text x={870} y={21} textAnchor="middle" dominantBaseline="central" fill="#ff8787" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(2ⁿ)
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Tree Structure */}
          {Array.from({ length: n }).map((_, lIdx) => {
            if (current.level >= 0 && lIdx > current.level && !isDone) return null;
            if (current.level < 0) return null;

            const count = Math.pow(2, lIdx);
            const isCurrent = lIdx === current.level;
            const y = 70 + (220 * lIdx) / (n - 1);

            return (
              <g key={lIdx}>
                {lIdx > 0 &&
                  Array.from({ length: count }).map((_, cIdx) => {
                    const pCount = Math.pow(2, lIdx - 1);
                    const parentX = 480 + (720 / pCount) * (Math.floor(cIdx / 2) - (pCount - 1) / 2);
                    const childX = 480 + (720 / count) * (cIdx - (count - 1) / 2);
                    return (
                      <line
                        key={`edge-${cIdx}`}
                        x1={parentX}
                        y1={70 + (220 * (lIdx - 1)) / (n - 1)}
                        x2={childX}
                        y2={y}
                        stroke="rgba(255,135,135,0.4)"
                        strokeWidth={1.5}
                      />
                    );
                  })}

                {Array.from({ length: count }).map((_, cIdx) => {
                  const x = 480 + (720 / count) * (cIdx - (count - 1) / 2);
                  return (
                    <g key={`node-${cIdx}`}>
                      <circle
                        cx={x}
                        cy={y}
                        r={15}
                        fill={isCurrent ? "#ff8787" : "rgba(255,135,135,0.22)"}
                        stroke="#ff8787"
                        strokeWidth={isCurrent ? 2.4 : 1.5}
                      />
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isCurrent ? "#18181b" : "#f4f4f5"}
                        fontFamily="var(--font-mono, monospace)"
                        fontWeight={800}
                        fontSize={11}
                      >
                        {n - lIdx}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <text x={28} y={348} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            TOTAL MOVES
          </text>
          <text x={28} y={366} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.moves}
          </text>

          {isDone ? (
            <text x={480} y={360} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              2^{n} - 1 = {totalMoves} moves → O(2ⁿ)
            </text>
          ) : (
            <text x={180} y={370} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              Each disk requires moving the entire tower above it twice
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
