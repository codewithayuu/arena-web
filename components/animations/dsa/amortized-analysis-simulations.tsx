"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

// ==========================================
// 1. Accounting Method: Banker's Credits
// ==========================================
const ACCT_SCENARIOS = [
  { id: "n8", name: "n = 8", n: 8 },
  { id: "n12", name: "n = 12", n: 12 },
  { id: "n16", name: "n = 16", n: 16 },
];

export function AccountingMethodSimulation() {
  const [scenarioId, setScenarioId] = useState(ACCT_SCENARIOS[2].id);
  const active = ACCT_SCENARIOS.find((s) => s.id === scenarioId) ?? ACCT_SCENARIOS[2];
  const n = active.n;

  const frames = useMemo(() => {
    const list = [];
    let bank = 0;
    let cap = 4;
    for (let i = 1; i <= n; i++) {
      if (i - 1 === cap) {
        bank -= cap;
        list.push({
          kind: "resize",
          size: i - 1,
          capacity: 2 * cap,
          bank,
          active: -1,
          copied: cap,
          delta: -cap,
          narration: `Full at ${cap}: bank pays ${cap} credits to copy into capacity ${2 * cap}`,
          status: `Resize at capacity ${cap}, ${cap} credits paid from bank`,
        });
        cap *= 2;
      }
      bank += 2;
      list.push({
        kind: "insert",
        size: i,
        capacity: cap,
        bank,
        active: i - 1,
        copied: 0,
        delta: 2,
        narration: `Insert element ${i}: pay 3 credits (1 spent on write, 2 saved to bank)`,
        status: `Insert ${i} of ${n}, bank holds ${bank} credits`,
      });
    }
    list.push({
      kind: "done",
      size: n,
      capacity: cap,
      bank,
      active: -1,
      copied: 0,
      delta: 0,
      narration: "Every copy paid in advance: bank never went negative → O(1) amortized",
      status: `Done: ${n} inserts at 3 credits each covered every copy`,
    });
    return list;
  }, [n]);

  const idleFrame = useMemo(() => ({
    kind: "done" as "done" | "resize" | "insert",
    size: 0,
    capacity: 4,
    bank: 0,
    active: -1,
    copied: 0,
    delta: 0,
    narration: "Press Play: every insert pays 3 credits (1 spent, 2 banked for resizes)",
    status: `Ready · Dynamic array n = ${n}, initial capacity = 4`,
  }), [n]);

  const player = useSimulationPlayback<any>(600, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 600);
  }, [frames, player]);

  const isDone = current.kind === "done" && current.size === n;
  const cap = current.capacity;
  const cellW = Math.min(38, Math.floor(480 / cap) - 4);
  const startX = 60;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every insert pays 3 credits, one spent now and two banked to cover the next resize: O(1) amortized.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {ACCT_SCENARIOS.map((s) => (
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
        <svg viewBox="0 0 960 360" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="acct" colors={[["cyan", "#00ceff"], ["green", "#69db7c"], ["yellow", "#ffd43b"]]} />

          <g>
            <rect x={782} y={10} width={150} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={857} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(1) amortized
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Dynamic Array Cells */}
          {Array.from({ length: cap }).map((_, cIdx) => {
            const isFilled = cIdx < current.size;
            const isCurrent = cIdx === current.active;
            const x = startX + cIdx * (cellW + 6);
            const y = 170;

            return (
              <g key={cIdx}>
                <rect
                  x={x}
                  y={y}
                  width={cellW}
                  height={52}
                  rx={7}
                  fill={isCurrent ? "#00ceff" : isFilled ? "rgba(105,219,124,0.18)" : "#1f1f22"}
                  stroke={isCurrent ? "#00ceff" : isFilled ? "#69db7c" : "rgba(161,161,170,0.3)"}
                  strokeWidth={isCurrent ? 2.4 : 1.5}
                  strokeDasharray={isFilled ? undefined : "5 4"}
                />
                {isFilled && (
                  <text
                    x={x + cellW / 2}
                    y={y + 26}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isCurrent ? "#18181b" : "#f4f4f5"}
                    fontFamily="var(--font-mono, monospace)"
                    fontWeight={isCurrent ? 800 : 600}
                    fontSize={12}
                  >
                    {(cIdx + 1) * 10}
                  </text>
                )}
              </g>
            );
          })}

          <text x={startX + (cap * (cellW + 6)) / 2} y={238} textAnchor="middle" dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={11.5}>
            size {current.size} / capacity {cap}
          </text>

          {/* Bank Credit Safe Box */}
          <g>
            <rect x={648} y={70} width={276} height={204} rx={14} fill="#18181b" stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
            <text x={786} y={84} textAnchor="middle" dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1.2 }}>
              BANK CREDITS
            </text>
            <text x={786} y={118} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={22} className="tabular-nums">
              {current.bank}
            </text>

            {/* Delta pill */}
            {current.delta !== 0 && (
              <g>
                <rect x={814} y={107} width={40} height={21} rx={5} fill={current.delta > 0 ? "#00ceff" : "#69db7c"} />
                <text x={834} y={117.5} textAnchor="middle" dominantBaseline="central" fill="#18181b" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
                  {current.delta > 0 ? `+${current.delta}` : `${current.delta}`}
                </text>
              </g>
            )}

            {/* Bank Coins */}
            {Array.from({ length: Math.min(24, Math.max(0, current.bank)) }).map((_, coinIdx) => {
              const r = Math.floor(coinIdx / 8);
              const c = coinIdx % 8;
              return (
                <circle
                  key={coinIdx}
                  cx={680 + 30 * c}
                  cy={240 - 20 * r}
                  r={6.5}
                  fill="#ffd43b"
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth={1}
                />
              );
            })}
          </g>

          {/* Stats bottom */}
          <text x={28} y={308} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            BANK BALANCE
          </text>
          <text x={28} y={326} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.bank} credits
          </text>

          {isDone ? (
            <text x={540} y={336} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n} inserts at 3 credits each covered every copy → O(1) amortized
            </text>
          ) : (
            <text x={180} y={330} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              charge: 3 credits / insert (1 write, 2 banked for future resizes)
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 2. Amortized Cost Timeline: Dynamic Array
// ==========================================
const ACT_SCENARIOS = [
  { id: "n16", name: "n = 16", n: 16 },
  { id: "n32", name: "n = 32", n: 32 },
  { id: "n64", name: "n = 64", n: 64 },
];

export function AmortizedCostTimelineSimulation() {
  const [scenarioId, setScenarioId] = useState(ACT_SCENARIOS[1].id);
  const active = ACT_SCENARIOS.find((s) => s.id === scenarioId) ?? ACT_SCENARIOS[1];
  const n = active.n;

  const data = useMemo(() => {
    const costs = [];
    const resizes = [];
    const avgs = [];
    let cap = 4;
    let size = 0;
    let totalCost = 0;
    for (let i = 1; i <= n; i++) {
      const isResize = size === cap;
      const cost = isResize ? size + 1 : 1;
      if (isResize) cap *= 2;
      size++;
      totalCost += cost;
      costs.push(cost);
      resizes.push(isResize);
      avgs.push(totalCost / i);
    }
    return { costs, resizes, avgs, grandTotal: totalCost };
  }, [n]);

  const frames = useMemo(() => {
    const list = [];
    for (let i = 1; i <= n; i++) {
      const cost = data.costs[i - 1];
      const isResize = data.resizes[i - 1];
      const avg = data.avgs[i - 1];
      list.push({
        insert: i,
        cost,
        isResize,
        avg,
        narration: isResize ? `Insert ${i}: RESIZE! Array doubled, cost spiked to ${cost}` : `Insert ${i}: normal insert, cost 1`,
        status: `Insert ${i} of ${n}, running average = ${avg.toFixed(2)}`,
      });
    }
    list.push({
      insert: n + 1,
      cost: 0,
      isResize: false,
      avg: data.avgs[n - 1],
      narration: `Timeline flattened: average cost = ${data.avgs[n - 1].toFixed(2)} ≤ 3 → O(1) amortized`,
      status: `Done: ${n} inserts, total cost ${data.grandTotal} < 3 × ${n}`,
    });
    return list;
  }, [n, data]);

  const idleFrame = useMemo(() => ({
    insert: 0,
    cost: 0,
    isResize: false,
    avg: 0,
    narration: "Press Play: observe cost spikes during resizes vs flat running average",
    status: `Ready · ${n} inserts on dynamic array`,
  }), [n]);

  const player = useSimulationPlayback(300, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 300);
  }, [frames, player]);

  const isDone = current.insert > n;
  const numBars = current.insert > 0 ? Math.min(n, current.insert) : 0;
  const barW = Math.max(3, Math.floor(780 / n) - 2);
  const maxCost = Math.max(...data.costs);
  const scaleY = 170 / maxCost;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Insert costs spike at every resize, yet the running average flattens to a constant: O(1) amortized.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {ACT_SCENARIOS.map((s) => (
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
        <svg viewBox="0 0 960 360" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="act" colors={[["cyan", "#00ceff"], ["red", "#ff8787"], ["green", "#69db7c"]]} />

          <g>
            <rect x={782} y={10} width={150} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={857} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(1) amortized
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Baseline axis */}
          <line x1={70} y1={258} x2={890} y2={258} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
          <text x={72} y={266} fill="#71717a" fontFamily="var(--font-mono, monospace)" fontSize={11}>
            insert 1
          </text>
          <text x={888} y={266} textAnchor="end" fill="#71717a" fontFamily="var(--font-mono, monospace)" fontSize={11}>
            insert {n}
          </text>

          {/* 3 units ceiling guideline */}
          <line x1={70} y1={258 - 3 * scaleY} x2={890} y2={258 - 3 * scaleY} stroke="#00ceff" strokeWidth={1.5} strokeDasharray="6 5" strokeOpacity={0.8} />
          <text x={898} y={258 - 3 * scaleY} dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={11.5}>
            3 units bound
          </text>

          {/* Cost Bars */}
          {Array.from({ length: numBars }).map((_, i) => {
            const cost = data.costs[i];
            const isResize = data.resizes[i];
            const barH = Math.max(cost * scaleY, 3);
            const x = 70 + (i * (820 - barW)) / (n - 1);
            const y = 258 - barH;
            const isCurrent = i === current.insert - 1;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={2}
                  fill={isCurrent ? "#00ceff" : isResize ? "#ff8787" : "#69db7c"}
                />
              </g>
            );
          })}

          {/* Running Average Line */}
          {numBars >= 2 && (
            <polyline
              points={Array.from({ length: numBars })
                .map((_, i) => {
                  const x = 70 + (i * (820 - barW)) / (n - 1) + barW / 2;
                  const y = 258 - data.avgs[i] * scaleY;
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="#00ceff"
              strokeWidth={2}
              strokeLinecap="round"
            />
          )}

          {/* Stats bottom */}
          <text x={28} y={296} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            RUNNING AVERAGE COST
          </text>
          <text x={28} y={314} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.avg > 0 ? current.avg.toFixed(2) : "0.00"} units / op
          </text>

          {isDone ? (
            <text x={480} y={326} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n} inserts, grand total {data.grandTotal} &lt; 3 × {n} → O(1) amortized
            </text>
          ) : (
            <text x={300} y={319} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              Cost spikes double in size, but double in rarity just as fast
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 3. Potential Method: Stored Energy
// ==========================================
const POT_SCENARIOS = [
  { id: "n10", name: "10 inserts", n: 10 },
  { id: "n14", name: "14 inserts", n: 14 },
];

export function PotentialMethodSimulation() {
  const [scenarioId, setScenarioId] = useState(POT_SCENARIOS[0].id);
  const active = POT_SCENARIOS.find((s) => s.id === scenarioId) ?? POT_SCENARIOS[0];
  const n = active.n;

  const frames = useMemo(() => {
    const list = [];
    let size = 0;
    let cap = 4;
    let phi = 0;

    for (let r = 1; r <= n; r++) {
      const isResize = size === cap;
      const oldCap = cap;
      const actualCost = isResize ? size + 1 : 1;
      if (isResize) cap *= 2;
      size++;
      const oldPhi = phi;
      phi = 2 * size - cap;
      const deltaPhi = phi - oldPhi;

      list.push({
        k: r,
        size,
        cap,
        phi,
        actual: actualCost,
        dPhi: deltaPhi,
        resize: isResize,
        narration: isResize
          ? `Insert ${r}: full at ${oldCap}, copy ${oldCap} + write, Φ pays back ${-deltaPhi}`
          : `Insert ${r}: write, actual cost 1, Φ charges up to ${phi}`,
        status: `Insert ${r} of ${n}, Φ = ${phi}`,
      });
    }

    list.push({
      k: n + 1,
      size,
      cap,
      phi,
      actual: 0,
      dPhi: 0,
      resize: false,
      narration: "Every insert amortized to exactly 3, Φ never went negative: O(1)",
      status: `Done: ${n} inserts, amortized cost consistently 3`,
    });
    return list;
  }, [n]);

  const idleFrame = useMemo(() => ({
    k: 0,
    size: 0,
    cap: 4,
    phi: 0,
    actual: 0,
    dPhi: 0,
    resize: false,
    narration: "Press Play: potential function Φ = 2·size - capacity tracks stored energy",
    status: `Ready · Potential method simulation for ${n} inserts`,
  }), [n]);

  const player = useSimulationPlayback(650, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 650);
  }, [frames, player]);

  const isDone = current.k > n;
  const maxPhi = Math.max(1, ...frames.map((f) => f.phi));
  const gaugeW = Math.max(0, (Math.max(0, current.phi) / maxPhi) * 516);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A potential gauge charges up on cheap inserts and pays down each resize, so every insert nets 3: O(1) amortized.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {POT_SCENARIOS.map((s) => (
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
          <GlowDefs prefix="pot" colors={[["teal", "#38d9a9"], ["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={782} y={10} width={150} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={857} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(1) amortized
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          {/* Size / Cap info */}
          <text x={932} y={52} textAnchor="end" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={12.5}>
            size {current.size} / cap {current.cap}
          </text>

          {/* Potential Energy Gauge */}
          <g>
            <text x={200} y={120} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={12}>
              POTENTIAL FUNCTION: Φ = 2 × size − capacity
            </text>
            <rect x={200} y={142} width={520} height={26} rx={6} fill="#1f1f22" stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />
            {gaugeW > 0 && (
              <rect
                x={202}
                y={144}
                width={gaugeW}
                height={22}
                rx={4}
                fill="#38d9a9"
                style={{ transition: "width 350ms ease" }}
              />
            )}
            <text x={742} y={155} dominantBaseline="central" fill="#38d9a9" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
              Φ = {current.phi}
            </text>
          </g>

          {/* Amortized Formula Equation */}
          <g>
            <text x={480} y={230} textAnchor="middle" dominantBaseline="central" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={13}>
              amortized cost = actual cost + ΔΦ
            </text>
            {current.k > 0 && (
              <text x={480} y={260} textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={18}>
                <tspan fill="#69db7c">3</tspan>
                <tspan fill="#f4f4f5"> = {current.actual} + ({current.dPhi})</tspan>
              </text>
            )}
          </g>

          {/* Stats bottom */}
          <text x={28} y={328} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            POTENTIAL STORED
          </text>
          <text x={28} y={346} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.phi}
          </text>

          {isDone ? (
            <text x={480} y={340} textAnchor="middle" dominantBaseline="central" fill="#69db7c" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {n} inserts, every one charged exactly 3 → O(1) amortized
            </text>
          ) : (
            <text x={168} y={350} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              amortized = actual + ΔΦ, constantly 3
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}

// ==========================================
// 4. Resize Cost Series: Aggregate Method
// ==========================================
function calcResizeSeries(n: number): number[] {
  const series = [];
  let cap = 4;
  while (cap <= n) {
    series.push(cap);
    cap *= 2;
  }
  return series;
}

const RCS_SCENARIOS = [
  { id: "n32", name: "n = 32", n: 32 },
  { id: "n64", name: "n = 64", n: 64 },
  { id: "n128", name: "n = 128", n: 128 },
];

export function ResizeCostSeriesSimulation() {
  const [scenarioId, setScenarioId] = useState(RCS_SCENARIOS[1].id);
  const active = RCS_SCENARIOS.find((s) => s.id === scenarioId) ?? RCS_SCENARIOS[1];
  const n = active.n;
  const series = useMemo(() => calcResizeSeries(n), [n]);
  const totalCopies = useMemo(() => series.reduce((a, b) => a + b, 0), [series]);
  const upperBound = 2 * n;

  const frames = useMemo(() => {
    const list = [];
    let running = 0;
    for (let i = 0; i < series.length; i++) {
      running += series[i];
      list.push({
        visibleResizes: i + 1,
        copies: running,
        activeResize: series[i],
        narration: `Resize cap ${series[i]} → ${2 * series[i]}: copied ${series[i]} elements`,
        status: `Resize ${i + 1} of ${series.length}, running copy sum = ${running}`,
      });
    }
    list.push({
      visibleResizes: series.length,
      copies: totalCopies,
      activeResize: 0,
      narration: `Geometric series sum: ${series.join(" + ")} = ${totalCopies} < 2n = ${upperBound}`,
      status: `Done: sum of all resize copies stays under 2n → O(1) amortized`,
    });
    return list;
  }, [series, totalCopies, upperBound]);

  const idleFrame = useMemo(() => ({
    visibleResizes: 0,
    copies: 0,
    activeResize: 0,
    narration: "Press Play: each resize copies twice as many, but the total stays under 2n",
    status: `Ready · Aggregate analysis for n = ${n}`,
  }), [n]);

  const player = useSimulationPlayback(750, idleFrame);
  const current = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 750);
  }, [frames, player]);

  const isDone = current.copies === totalCopies && current.activeResize === 0;
  const scale = 180 / upperBound;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Each resize copies twice as many elements, yet all the copies together stay under 2n: O(1) amortized.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {RCS_SCENARIOS.map((s) => (
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
        <svg viewBox="0 0 960 360" className="w-full h-auto block select-none" textRendering="geometricPrecision">
          <GlowDefs prefix="rcs" colors={[["cyan", "#00ceff"], ["green", "#69db7c"]]} />

          <g>
            <rect x={782} y={10} width={150} height={22} rx={5} fill="none" stroke="#00ceff" strokeWidth={1.5} />
            <text x={857} y={21} textAnchor="middle" dominantBaseline="central" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12} style={{ letterSpacing: 0.8 }}>
              O(1) amortized
            </text>
          </g>

          <text x={28} y={16} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={14}>
            {current.narration}
          </text>

          <text x={60} y={56} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            INDIVIDUAL RESIZE COSTS
          </text>
          <text x={620} y={56} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            STACKED TOTAL
          </text>

          {/* Baseline */}
          <line x1={60} y1={268} x2={890} y2={268} stroke="rgba(161,161,170,0.3)" strokeWidth={1.5} />

          {/* Individual resize bars */}
          {series.map((val, idx) => {
            const visible = idx < current.visibleResizes;
            const isActive = val === current.activeResize;
            const barH = visible ? val * scale : 0;
            const x = 70 + idx * 88;
            const y = 268 - barH;

            return (
              <g key={idx}>
                <rect
                  x={x}
                  y={y}
                  width={56}
                  height={barH}
                  rx={3}
                  fill={isActive ? "#00ceff" : "#69db7c"}
                  style={{ transition: "all 300ms ease" }}
                />
                {visible && (
                  <text x={x + 28} y={y - 8} textAnchor="middle" fill={isActive ? "#00ceff" : "#f4f4f5"} fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={12}>
                    {val}
                  </text>
                )}
                <text x={x + 28} y={276} textAnchor="middle" dominantBaseline="hanging" fill="#71717a" fontFamily="var(--font-mono, monospace)" fontSize={11}>
                  {val} → {2 * val}
                </text>
              </g>
            );
          })}

          {/* Stacked total bar */}
          {series.map((val, idx) => {
            const visible = idx < current.visibleResizes;
            const prevSum = series.slice(0, idx).reduce((a, b) => a + b, 0);
            const h = visible ? val * scale : 0;
            const y = 268 - (prevSum + val) * scale;

            return (
              <rect
                key={`stacked-${idx}`}
                x={630}
                y={y}
                width={96}
                height={h}
                fill={idx % 2 === 0 ? "#69db7c" : "#38d9a9"}
                stroke="#000000"
                strokeWidth={1}
                style={{ transition: "all 300ms ease" }}
              />
            );
          })}

          <text x={678} y={276} textAnchor="middle" dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={11}>
            copies
          </text>

          {/* 2n Upper Bound Box */}
          <rect x={780} y={268 - upperBound * scale} width={96} height={upperBound * scale} rx={3} fill="none" stroke="#00ceff" strokeWidth={1.8} />
          <text x={828} y={268 - upperBound * scale - 12} textAnchor="middle" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={12}>
            2n = {upperBound}
          </text>
          <text x={828} y={276} textAnchor="middle" dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={11}>
            bound
          </text>

          {/* Stats bottom */}
          <text x={28} y={308} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={11.5} style={{ letterSpacing: 1 }}>
            TOTAL COPIES
          </text>
          <text x={28} y={326} dominantBaseline="hanging" fill="#f4f4f5" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={20} className="tabular-nums">
            {current.copies}
          </text>
          <text x={104} y={330} dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={700} fontSize={12.5} className="tabular-nums">
            vs 2n = {upperBound}
          </text>

          {isDone ? (
            <text x={480} y={326} textAnchor="middle" dominantBaseline="hanging" fill="#00ceff" fontFamily="var(--font-mono, monospace)" fontWeight={800} fontSize={16}>
              {series.join(" + ")} = {totalCopies} &lt; 2n = {upperBound} → O(1) amortized
            </text>
          ) : (
            <text x={300} y={330} dominantBaseline="hanging" fill="#a1a1aa" fontFamily="var(--font-mono, monospace)" fontWeight={600} fontSize={12.5}>
              a doubling series is dominated by its last term
            </text>
          )}
        </svg>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} runLabel="Run" />
    </div>
  );
}
