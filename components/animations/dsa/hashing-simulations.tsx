"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Pastel Mint Green
const COLOR_YELLOW = "#FDE047"; // Pastel Butter Yellow
const COLOR_RED = "#FCA5A5";    // Pastel Rose
const COLOR_PEACH = "#FDBA74";  // Pastel Peach

// ==========================================
// 1. HASH TABLE: OPEN ADDRESSING (Probing)
// ==========================================
interface OpenEntry {
  kind: "empty" | "full" | "tomb";
  key?: number;
  val?: string;
}

export function HashTableOpenAddressingSimulation() {
  const capacity = 11;
  const [method, setMethod] = useState<"linear" | "quadratic" | "double">("linear");
  const [table, setTable] = useState<OpenEntry[]>(() => {
    const arr: OpenEntry[] = Array.from({ length: 11 }, () => ({ kind: "empty" }));
    arr[2] = { kind: "full", key: 13, val: "A" };
    arr[3] = { kind: "full", key: 24, val: "B" };
    arr[4] = { kind: "full", key: 35, val: "C" };
    return arr;
  });
  const [inputKey, setInputKey] = useState("46");
  const [inputVal, setInputVal] = useState("D");
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const getProbeIdx = useCallback(
    (home: number, probe: number, key: number) => {
      if (method === "linear") return (home + probe) % capacity;
      if (method === "quadratic") return (home + probe * probe) % capacity;
      // double hashing: secondary hash 7 - (key % 7)
      const h2 = 7 - (key % 7);
      return (home + probe * h2) % capacity;
    },
    [method, capacity]
  );

  const handlePut = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const v = inputVal || "X";
    const home = k % capacity;

    let placedSlot = -1;
    let probes = 0;

    for (let i = 0; i < capacity; i++) {
      const idx = getProbeIdx(home, i, k);
      probes++;
      if (table[idx].kind === "empty" || table[idx].kind === "tomb" || table[idx].key === k) {
        placedSlot = idx;
        break;
      }
    }

    if (placedSlot === -1) {
      setStatus(`Table is full! Cannot insert key ${k}`);
      setStatusColor(COLOR_RED);
      return;
    }

    setTable((prev) => {
      const next = [...prev];
      next[placedSlot] = { kind: "full", key: k, val: v };
      return next;
    });
    setActiveSlot(placedSlot);
    setStatus(`put(${k}, "${v}"): home = ${k} % 11 = ${home}, placed at slot ${placedSlot} after ${probes} probe(s)`);
    setStatusColor(COLOR_GREEN);
    setInputKey(String(Math.floor(Math.random() * 80) + 10));
  }, [inputKey, inputVal, capacity, getProbeIdx, table]);

  const handleGet = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const home = k % capacity;

    let foundSlot = -1;
    let probes = 0;

    for (let i = 0; i < capacity; i++) {
      const idx = getProbeIdx(home, i, k);
      probes++;
      if (table[idx].kind === "full" && table[idx].key === k) {
        foundSlot = idx;
        break;
      }
      if (table[idx].kind === "empty") {
        break;
      }
    }

    if (foundSlot !== -1) {
      setActiveSlot(foundSlot);
      setStatus(`get(${k}): found "${table[foundSlot].val}" at slot ${foundSlot} after ${probes} probe(s)`);
      setStatusColor(COLOR_CYAN);
    } else {
      setActiveSlot(null);
      setStatus(`get(${k}): key not found in table after probing`);
      setStatusColor(COLOR_RED);
    }
  }, [inputKey, capacity, getProbeIdx, table]);

  const handleRemove = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const home = k % capacity;

    let slot = -1;
    for (let i = 0; i < capacity; i++) {
      const idx = getProbeIdx(home, i, k);
      if (table[idx].kind === "full" && table[idx].key === k) {
        slot = idx;
        break;
      }
      if (table[idx].kind === "empty") break;
    }

    if (slot !== -1) {
      setTable((prev) => {
        const next = [...prev];
        next[slot] = { kind: "tomb" };
        return next;
      });
      setActiveSlot(slot);
      setStatus(`remove(${k}): marked slot ${slot} as tombstone (keeps probing chain valid)`);
      setStatusColor(COLOR_YELLOW);
    } else {
      setActiveSlot(null);
      setStatus(`remove(${k}): key not in table`);
      setStatusColor(COLOR_RED);
    }
  }, [inputKey, capacity, getProbeIdx, table]);

  const handleReset = useCallback(() => {
    const arr: OpenEntry[] = Array.from({ length: 11 }, () => ({ kind: "empty" }));
    arr[2] = { kind: "full", key: 13, val: "A" };
    arr[3] = { kind: "full", key: 24, val: "B" };
    arr[4] = { kind: "full", key: 35, val: "C" };
    setTable(arr);
    setActiveSlot(null);
    setStatus("Reset table to default");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 720,
    vbH: 220,
    slotW: 56,
    slotH: 52,
    startY: 75,
  };

  const startX = (cfg.vbW - capacity * (cfg.slotW + 6)) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Hash Table (Open Addressing)</h3>
            <div className="flex rounded-md border border-border overflow-hidden text-[11px]">
              <button
                onClick={() => setMethod("linear")}
                className={`px-2 py-0.5 transition-colors ${
                  method === "linear" ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setMethod("quadratic")}
                className={`px-2 py-0.5 transition-colors ${
                  method === "quadratic" ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Quadratic
              </button>
              <button
                onClick={() => setMethod("double")}
                className={`px-2 py-0.5 transition-colors ${
                  method === "double" ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Double Hash
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Collision resolution without pointers: elements occupy open slots in table, tombstones preserve probe sequences.
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

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={handlePut}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          put({inputKey}, &quot;{inputVal}&quot;)
        </button>
        <button
          onClick={handleGet}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          get({inputKey})
        </button>
        <button
          onClick={handleRemove}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          remove({inputKey})
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">key:</span>
          <input
            type="number"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
          <span className="text-muted-foreground ml-1">val:</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-12 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="oa" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Slots */}
            {table.map((entry, idx) => {
              const x = startX + idx * (cfg.slotW + 6);
              const isActive = activeSlot === idx;
              const isTomb = entry.kind === "tomb";
              const isFull = entry.kind === "full";

              const fill = isActive
                ? COLOR_YELLOW
                : isTomb
                ? COLOR_RED
                : isFull
                ? "#000000"
                : "none";
              const stroke = isActive
                ? COLOR_YELLOW
                : isTomb
                ? COLOR_RED
                : isFull
                ? COLOR_GREEN
                : "rgba(255,255,255,0.18)";
              const textColor = isActive || isTomb ? "#09090b" : "#FFFFFF";

              return (
                <g key={`slot-${idx}`}>
                  <rect
                    x={x}
                    y={cfg.startY}
                    width={cfg.slotW}
                    height={cfg.slotH}
                    rx={8}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    strokeDasharray={entry.kind === "empty" ? "4 4" : undefined}
                  />

                  {isFull && (
                    <g>
                      <text
                        x={x + cfg.slotW / 2}
                        y={cfg.startY + cfg.slotH / 2 - 6}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={textColor}
                        fontSize={13}
                        fontWeight={800}
                        fontFamily={MONO_FONT}
                      >
                        {entry.key}
                      </text>
                      <text
                        x={x + cfg.slotW / 2}
                        y={cfg.startY + cfg.slotH / 2 + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={isActive ? "#09090b" : COLOR_CYAN}
                        fontSize={11}
                        fontWeight={700}
                        fontFamily={MONO_FONT}
                      >
                        &quot;{entry.val}&quot;
                      </text>
                    </g>
                  )}

                  {isTomb && (
                    <text
                      x={x + cfg.slotW / 2}
                      y={cfg.startY + cfg.slotH / 2 + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#09090b"
                      fontSize={11}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      TOMB
                    </text>
                  )}

                  {/* Index label below */}
                  <text
                    x={x + cfg.slotW / 2}
                    y={cfg.startY + cfg.slotH + 16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#a1a1aa"
                    fontSize={10.5}
                    fontWeight={600}
                    fontFamily={MONO_FONT}
                  >
                    {idx}
                  </text>
                </g>
              );
            })}

            {/* Status note */}
            <text
              x={cfg.vbW / 2}
              y={cfg.vbH - 24}
              textAnchor="middle"
              dominantBaseline="central"
              fill={statusColor}
              fontSize={13}
              fontWeight={800}
              fontFamily={MONO_FONT}
              style={{ letterSpacing: 0.4 }}
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
// 2. HASH TABLE: SEPARATE CHAINING (Buckets & Chains)
// ==========================================
interface ChainNode {
  key: number;
  val: string;
}

export function HashTableSeparateChainingSimulation() {
  const numBuckets = 7;
  const [buckets, setBuckets] = useState<ChainNode[][]>(() => {
    const b: ChainNode[][] = Array.from({ length: 7 }, () => []);
    b[1] = [
      { key: 8, val: "A" },
      { key: 15, val: "B" },
    ];
    b[3] = [{ key: 3, val: "C" }];
    b[6] = [{ key: 20, val: "D" }];
    return b;
  });

  const [inputKey, setInputKey] = useState("22");
  const [inputVal, setInputVal] = useState("E");
  const [activeBucket, setActiveBucket] = useState<number | null>(null);
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const handlePut = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const v = inputVal || "X";
    const bucketIdx = ((k % numBuckets) + numBuckets) % numBuckets;

    setBuckets((prev) => {
      const next = prev.map((chain, i) => {
        if (i !== bucketIdx) return chain;
        const existing = chain.find((n) => n.key === k);
        if (existing) {
          return chain.map((n) => (n.key === k ? { ...n, val: v } : n));
        }
        return [{ key: k, val: v }, ...chain];
      });
      return next;
    });

    setActiveBucket(bucketIdx);
    setStatus(`put(${k}, "${v}"): hashed to bucket ${k} % 7 = ${bucketIdx}, linked at head of chain`);
    setStatusColor(COLOR_GREEN);
    setInputKey(String(Math.floor(Math.random() * 80) + 10));
  }, [inputKey, inputVal, numBuckets]);

  const handleGet = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const bucketIdx = ((k % numBuckets) + numBuckets) % numBuckets;
    const chain = buckets[bucketIdx];
    const item = chain.find((n) => n.key === k);

    setActiveBucket(bucketIdx);
    if (item) {
      setStatus(`get(${k}): walked chain in bucket ${bucketIdx}, found value "${item.val}"`);
      setStatusColor(COLOR_CYAN);
    } else {
      setStatus(`get(${k}): walked chain in bucket ${bucketIdx}, key not found`);
      setStatusColor(COLOR_RED);
    }
  }, [inputKey, numBuckets, buckets]);

  const handleRemove = useCallback(() => {
    const k = parseInt(inputKey, 10);
    if (isNaN(k)) return;
    const bucketIdx = ((k % numBuckets) + numBuckets) % numBuckets;
    const chain = buckets[bucketIdx];
    const exists = chain.some((n) => n.key === k);

    setActiveBucket(bucketIdx);
    if (exists) {
      setBuckets((prev) => prev.map((c, i) => (i === bucketIdx ? c.filter((n) => n.key !== k) : c)));
      setStatus(`remove(${k}): unlinked node from bucket ${bucketIdx}`);
      setStatusColor(COLOR_YELLOW);
    } else {
      setStatus(`remove(${k}): key not in bucket ${bucketIdx}`);
      setStatusColor(COLOR_RED);
    }
  }, [inputKey, numBuckets, buckets]);

  const handleReset = useCallback(() => {
    const b: ChainNode[][] = Array.from({ length: 7 }, () => []);
    b[1] = [
      { key: 8, val: "A" },
      { key: 15, val: "B" },
    ];
    b[3] = [{ key: 3, val: "C" }];
    b[6] = [{ key: 20, val: "D" }];
    setBuckets(b);
    setActiveBucket(null);
    setStatus("Reset buckets to default");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 720,
    vbH: 340,
    bucketW: 56,
    bucketH: 38,
    startY: 30,
    chainNodeW: 52,
    chainNodeH: 34,
  };

  const startX = (cfg.vbW - numBuckets * (cfg.bucketW + 36)) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Hash Table (Separate Chaining)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Collisions are appended as linked list chains hanging from each fixed hash bucket.
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

      <div className="flex items-center gap-2 flex-wrap text-xs">
        <button
          onClick={handlePut}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          put({inputKey}, &quot;{inputVal}&quot;)
        </button>
        <button
          onClick={handleGet}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          get({inputKey})
        </button>
        <button
          onClick={handleRemove}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          remove({inputKey})
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">key:</span>
          <input
            type="number"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
          <span className="text-muted-foreground ml-1">val:</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-12 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[700px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="sc" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Buckets */}
            {buckets.map((chain, bIdx) => {
              const bx = startX + bIdx * (cfg.bucketW + 36);
              const isActive = activeBucket === bIdx;

              return (
                <g key={`b-${bIdx}`}>
                  {/* Bucket Header */}
                  <rect
                    x={bx}
                    y={cfg.startY}
                    width={cfg.bucketW}
                    height={cfg.bucketH}
                    rx={7}
                    fill={isActive ? COLOR_YELLOW : "#000000"}
                    stroke={isActive ? COLOR_YELLOW : "rgba(255,255,255,0.18)"}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <text
                    x={bx + cfg.bucketW / 2}
                    y={cfg.startY + cfg.bucketH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isActive ? "#09090b" : "#FFFFFF"}
                    fontSize={11.5}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    [{bIdx}]
                  </text>

                  {/* Chain Nodes hanging down */}
                  {chain.map((node, cIdx) => {
                    const ny = cfg.startY + cfg.bucketH + 20 + cIdx * (cfg.chainNodeH + 16);

                    return (
                      <g key={`node-${bIdx}-${cIdx}`}>
                        {/* Downward Arrow */}
                        <line
                          x1={bx + cfg.bucketW / 2}
                          y1={cIdx === 0 ? cfg.startY + cfg.bucketH : ny - 16}
                          x2={bx + cfg.bucketW / 2}
                          y2={ny}
                          stroke="rgba(161,161,170,0.5)"
                          strokeWidth={2}
                        />
                        <polygon
                          points={`${bx + cfg.bucketW / 2},${ny} ${bx + cfg.bucketW / 2 - 3.5},${ny - 6} ${
                            bx + cfg.bucketW / 2 + 3.5
                          },${ny - 6}`}
                          fill="rgba(161,161,170,0.5)"
                        />

                        {/* Node */}
                        <rect
                          x={bx + (cfg.bucketW - cfg.chainNodeW) / 2}
                          y={ny}
                          width={cfg.chainNodeW}
                          height={cfg.chainNodeH}
                          rx={6}
                          fill={isActive ? COLOR_GREEN : "#000000"}
                          stroke={isActive ? COLOR_GREEN : "rgba(255,255,255,0.18)"}
                          strokeWidth={1.5}
                        />
                        <text
                          x={bx + cfg.bucketW / 2}
                          y={ny + cfg.chainNodeH / 2 + 1}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={isActive ? "#09090b" : "#FFFFFF"}
                          fontSize={11.5}
                          fontWeight={800}
                          fontFamily={MONO_FONT}
                        >
                          {node.key}:{node.val}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Status note */}
            <text
              x={cfg.vbW / 2}
              y={cfg.vbH - 16}
              textAnchor="middle"
              dominantBaseline="central"
              fill={statusColor}
              fontSize={13}
              fontWeight={800}
              fontFamily={MONO_FONT}
              style={{ letterSpacing: 0.4 }}
            >
              {status}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
