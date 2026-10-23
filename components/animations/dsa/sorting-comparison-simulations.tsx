"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { Shuffle } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_PURPLE = "#DDD6FE"; // Solid Pastel Lavender
const COLOR_PINK = "#FCA5A5";   // Solid Pastel Rose/Red
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

const SCENARIOS = [
  { id: "shuffled", label: "shuffled" },
  { id: "reversed", label: "reversed" },
  { id: "nearly", label: "nearly sorted" },
];

function makePrng(seed: number) {
  let s = (0x9e3779b1 * (seed + 17)) % 0x7fffffff;
  if (s <= 0) s += 0x7ffffffe;
  return () => {
    s = (48271 * s) % 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateInitialArray(scenario: string, seed: number, n: number) {
  const prng = makePrng(seed);
  const arr = Array.from({ length: n }, (_, i) => i + 1);

  if (scenario === "reversed") {
    return arr.reverse();
  }
  if (scenario === "nearly") {
    // swap only 2 pairs
    for (let k = 0; k < 2; k++) {
      const i = Math.floor(prng() * n);
      const j = Math.floor(prng() * n);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  // shuffled
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface SortFrame {
  values: number[];
  states: Record<number, string>;
  comparisons: number;
  swaps: number;
  note: string;
  resultText?: string;
  heapSize?: number;
}

interface CommonSortProps {
  mode:
    | "bubble"
    | "selection"
    | "insertion"
    | "shell"
    | "merge"
    | "quick"
    | "heap"
    | "cyclic"
    | "tim"
    | "cocktail"
    | "comb";
}

const MODE_TITLES: Record<string, string> = {
  bubble: "BUBBLE SORT",
  selection: "SELECTION SORT",
  insertion: "INSERTION SORT",
  shell: "SHELL SORT",
  merge: "MERGE SORT",
  quick: "QUICK SORT",
  heap: "HEAP SORT",
  cyclic: "CYCLIC SORT",
  tim: "TIM SORT",
  cocktail: "COCKTAIL SORT",
  comb: "COMB SORT",
};

const MODE_DESCRIPTIONS: Record<string, string> = {
  bubble: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  selection: "Finds the minimum element from the unsorted part and puts it at the beginning.",
  insertion: "Builds the sorted array one item at a time by sliding each element into its proper position.",
  shell: "Generalization of insertion sort that allows the exchange of far-apart elements using diminishing gaps.",
  merge: "Divide-and-conquer algorithm that recursively splits array in halves, sorts, and merges them.",
  quick: "Picks a pivot and partitions the array around it so smaller items go left and larger go right.",
  heap: "Converts array into a binary max-heap, then repeatedly extracts the maximum to the sorted suffix.",
  cyclic: "Places each number directly into its index (value - 1) in O(n) time for numbers 1 to n.",
  tim: "Hybrid algorithm derived from merge sort and insertion sort, designed to perform well on real-world data.",
  cocktail: "Bidirectional bubble sort that alternates passes forward and backward across the array.",
  comb: "Improves bubble sort by eliminating small values near the end using a shrinking gap sequence factor 1.3.",
};

export function UnifiedComparisonSortSimulation({ mode }: CommonSortProps) {
  const [scenarioId, setScenarioId] = useState("shuffled");
  const [seed, setSeed] = useState(1);
  const [size, setSize] = useState(15);
  const [data, setData] = useState(() => generateInitialArray("shuffled", 1, 15));

  const isHeap = mode === "heap";

  const initialFrame = useMemo<SortFrame>(
    () => ({
      values: [...data],
      states: {},
      comparisons: 0,
      swaps: 0,
      note: "Ready to sort",
      resultText: "",
      heapSize: data.length,
    }),
    [data]
  );

  const player = useSimulationPlayback<SortFrame>(90, initialFrame);

  const frames = useMemo(() => {
    const list: SortFrame[] = [];
    const arr = [...data];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    const push = (states: Record<number, string>, note: string, heapSize?: number) => {
      list.push({
        values: [...arr],
        states: { ...states },
        comparisons,
        swaps,
        note,
        resultText: "",
        heapSize: heapSize ?? n,
      });
    };

    if (mode === "bubble") {
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          comparisons++;
          push({ [j]: "compare", [j + 1]: "compare" }, `compare ${arr[j]} and ${arr[j + 1]}`);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            swaps++;
            swapped = true;
            push({ [j]: "swap", [j + 1]: "swap" }, `swap, ${arr[j]} before ${arr[j + 1]}`);
          }
        }
        if (!swapped) break;
      }
    } else if (mode === "selection") {
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        push({ [i]: "min" }, `find minimum from index ${i}`);
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          push({ [minIdx]: "min", [j]: "compare" }, `compare ${arr[j]} with min ${arr[minIdx]}`);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            push({ [minIdx]: "min" }, `new minimum ${arr[minIdx]}`);
          }
        }
        if (minIdx !== i) {
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          swaps++;
          push({ [i]: "swap", [minIdx]: "swap" }, `swap min ${arr[i]} into place`);
        }
      }
    } else if (mode === "insertion") {
      for (let i = 1; i < n; i++) {
        let j = i;
        push({ [j]: "key" }, `take ${arr[i]}, move it into sorted prefix`);
        while (j > 0) {
          comparisons++;
          push({ [j - 1]: "compare", [j]: "key" }, `compare ${arr[j - 1]} with ${arr[j]}`);
          if (arr[j - 1] > arr[j]) {
            [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
            swaps++;
            push({ [j - 1]: "key", [j]: "swap" }, "swap left");
            j--;
          } else {
            break;
          }
        }
      }
    } else if (mode === "shell") {
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          let j = i;
          while (j >= gap) {
            comparisons++;
            push({ [j - gap]: "compare", [j]: "key" }, `gap ${gap}: compare ${arr[j - gap]} and ${arr[j]}`);
            if (arr[j - gap] > arr[j]) {
              [arr[j - gap], arr[j]] = [arr[j], arr[j - gap]];
              swaps++;
              push({ [j - gap]: "key", [j]: "swap" }, `swap elements with gap ${gap}`);
              j -= gap;
            } else {
              break;
            }
          }
        }
      }
    } else if (mode === "quick") {
      const qsort = (lo: number, hi: number) => {
        if (lo >= hi) return;
        const pivotVal = arr[hi];
        let pIdx = lo;
        push({ [hi]: "pivot", [lo]: "compare" }, `partition [${lo}..${hi}] with pivot ${pivotVal}`);

        for (let j = lo; j < hi; j++) {
          comparisons++;
          push({ [hi]: "pivot", [j]: "compare", [pIdx]: "key" }, `compare ${arr[j]} with pivot ${pivotVal}`);
          if (arr[j] < pivotVal) {
            [arr[pIdx], arr[j]] = [arr[j], arr[pIdx]];
            swaps++;
            push({ [pIdx]: "swap", [j]: "swap" }, `swap ${arr[pIdx]} to left`);
            pIdx++;
          }
        }
        [arr[pIdx], arr[hi]] = [arr[hi], arr[pIdx]];
        swaps++;
        push({ [pIdx]: "sorted" }, `pivot ${pivotVal} settled at index ${pIdx}`);
        qsort(lo, pIdx - 1);
        qsort(pIdx + 1, hi);
      };
      qsort(0, n - 1);
    } else if (mode === "merge") {
      const msort = (l: number, r: number) => {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);
        msort(l, mid);
        msort(mid + 1, r);

        const leftPart = arr.slice(l, mid + 1);
        const rightPart = arr.slice(mid + 1, r + 1);
        let i = 0;
        let j = 0;
        let k = l;

        while (i < leftPart.length && j < rightPart.length) {
          comparisons++;
          if (leftPart[i] <= rightPart[j]) {
            arr[k] = leftPart[i];
            i++;
          } else {
            arr[k] = rightPart[j];
            j++;
          }
          swaps++;
          push({ [k]: "write" }, `merge into index ${k}`);
          k++;
        }
        while (i < leftPart.length) {
          arr[k] = leftPart[i];
          i++;
          k++;
          swaps++;
          push({ [k - 1]: "write" }, `flush left into index ${k - 1}`);
        }
        while (j < rightPart.length) {
          arr[k] = rightPart[j];
          j++;
          k++;
          swaps++;
          push({ [k - 1]: "write" }, `flush right into index ${k - 1}`);
        }
      };
      msort(0, n - 1);
    } else if (mode === "heap") {
      const heapify = (size: number, root: number) => {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size) {
          comparisons++;
          if (arr[left] > arr[largest]) largest = left;
        }
        if (right < size) {
          comparisons++;
          if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== root) {
          [arr[root], arr[largest]] = [arr[largest], arr[root]];
          swaps++;
          push({ [root]: "swap", [largest]: "swap" }, `sift down root ${arr[largest]} with child`, size);
          heapify(size, largest);
        }
      };

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        swaps++;
        push({ [0]: "swap", [i]: "sorted" }, `extract max ${arr[i]} to index ${i}`, i);
        heapify(i, 0);
      }
    } else if (mode === "cyclic") {
      let i = 0;
      while (i < n) {
        const correct = arr[i] - 1;
        if (correct >= 0 && correct < n && arr[i] !== arr[correct]) {
          comparisons++;
          [arr[i], arr[correct]] = [arr[correct], arr[i]];
          swaps++;
          push({ [i]: "swap", [correct]: "swap" }, `place ${arr[correct]} at index ${correct}`);
        } else {
          i++;
          push({ [i - 1]: "sorted" }, `index ${i - 1} is in place`);
        }
      }
    } else if (mode === "cocktail") {
      let start = 0;
      let end = n - 1;
      let swapped = true;
      while (swapped) {
        swapped = false;
        for (let i = start; i < end; i++) {
          comparisons++;
          push({ [i]: "compare", [i + 1]: "compare" }, `forward pass: compare ${arr[i]} and ${arr[i + 1]}`);
          if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swaps++;
            swapped = true;
            push({ [i]: "swap", [i + 1]: "swap" }, `swap ${arr[i]} and ${arr[i + 1]}`);
          }
        }
        if (!swapped) break;
        swapped = false;
        end--;
        for (let i = end - 1; i >= start; i--) {
          comparisons++;
          push({ [i]: "compare", [i + 1]: "compare" }, `backward pass: compare ${arr[i]} and ${arr[i + 1]}`);
          if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
            swaps++;
            swapped = true;
            push({ [i]: "swap", [i + 1]: "swap" }, `swap ${arr[i]} and ${arr[i + 1]}`);
          }
        }
        start++;
      }
    } else if (mode === "comb") {
      let gap = n;
      const shrink = 1.3;
      let sorted = false;
      while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
          gap = 1;
          sorted = true;
        }
        for (let i = 0; i + gap < n; i++) {
          comparisons++;
          push({ [i]: "compare", [i + gap]: "compare" }, `gap ${gap}: compare ${arr[i]} and ${arr[i + gap]}`);
          if (arr[i] > arr[i + gap]) {
            [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
            swaps++;
            sorted = false;
            push({ [i]: "swap", [i + gap]: "swap" }, `swap ${arr[i]} and ${arr[i + gap]}`);
          }
        }
      }
    } else if (mode === "tim") {
      // Tim sort simplified: runs of 4, insertion sort on runs, merge runs
      const runSize = 4;
      for (let i = 0; i < n; i += runSize) {
        const right = Math.min(i + runSize - 1, n - 1);
        for (let j = i + 1; j <= right; j++) {
          let k = j;
          while (k > i && arr[k - 1] > arr[k]) {
            comparisons++;
            [arr[k - 1], arr[k]] = [arr[k], arr[k - 1]];
            swaps++;
            push({ [k - 1]: "key", [k]: "swap" }, `run insertion sort at [${k - 1}, ${k}]`);
            k--;
          }
        }
      }
      for (let size = runSize; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
          const mid = left + size - 1;
          const right = Math.min(left + 2 * size - 1, n - 1);
          if (mid < right) {
            const leftPart = arr.slice(left, mid + 1);
            const rightPart = arr.slice(mid + 1, right + 1);
            let p1 = 0;
            let p2 = 0;
            let dest = left;
            while (p1 < leftPart.length && p2 < rightPart.length) {
              comparisons++;
              if (leftPart[p1] <= rightPart[p2]) {
                arr[dest] = leftPart[p1++];
              } else {
                arr[dest] = rightPart[p2++];
              }
              swaps++;
              push({ [dest]: "write" }, `merge runs into index ${dest}`);
              dest++;
            }
            while (p1 < leftPart.length) {
              arr[dest++] = leftPart[p1++];
              swaps++;
              push({ [dest - 1]: "write" }, `flush left run into ${dest - 1}`);
            }
            while (p2 < rightPart.length) {
              arr[dest++] = rightPart[p2++];
              swaps++;
              push({ [dest - 1]: "write" }, `flush right run into ${dest - 1}`);
            }
          }
        }
      }
    }

    // Final sorted frame
    const allSortedStates: Record<number, string> = {};
    for (let i = 0; i < n; i++) allSortedStates[i] = "sorted";
    list.push({
      values: [...arr],
      states: allSortedStates,
      comparisons,
      swaps,
      note: "Array is completely sorted!",
      resultText: `Sorted in ${comparisons} comparisons and ${swaps} swaps.`,
      heapSize: 0,
    });

    return list;
  }, [mode, data]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(30, Math.min(180, Math.round(8000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleShuffle = useCallback(() => {
    if (player.isPlaying) return;
    const newSeed = seed + 1;
    setSeed(newSeed);
    setData(generateInitialArray(scenarioId, newSeed, size));
    player.stop();
  }, [player, seed, scenarioId, size]);

  const handleScenarioChange = useCallback(
    (id: string) => {
      if (player.isPlaying || id === scenarioId) return;
      setScenarioId(id);
      setData(generateInitialArray(id, seed, size));
      player.stop();
    },
    [player, scenarioId, seed, size]
  );

  const handleSizeChange = useCallback(
    (newSize: number) => {
      if (player.isPlaying || newSize === size) return;
      setSize(newSize);
      setData(generateInitialArray(scenarioId, seed, newSize));
      player.stop();
    },
    [player, size, scenarioId, seed]
  );

  const cfg = isHeap
    ? {
        vbW: 720,
        vbH: 420,
        plotX: 20,
        plotW: 680,
        baseY: 340,
        maxH: 110,
        treeTop: 64,
        treeRowH: 42,
      }
    : {
        vbW: 720,
        vbH: 310,
        plotX: 20,
        plotW: 680,
        baseY: 250,
        maxH: 170,
        treeTop: 0,
        treeRowH: 0,
      };

  const curView = player.view;
  const n = curView.values.length;
  const colW = cfg.plotW / n;
  const barW = Math.max(3, colW - 6);
  const maxVal = Math.max(1, ...curView.values);

  const getBarColor = (idx: number) => {
    const st = curView.states[idx];
    if (st === "compare") return COLOR_CYAN;
    if (st === "swap" || st === "write") return COLOR_AMBER;
    if (st === "sorted") return COLOR_GREEN;
    if (st === "key") return COLOR_YELLOW;
    if (st === "min" || st === "right") return COLOR_PURPLE;
    if (st === "pivot") return COLOR_PINK;
    return "#000000";
  };

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header and Controls */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">{MODE_TITLES[mode]}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{MODE_DESCRIPTIONS[mode]}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Scenario tabs */}
          <div className="flex rounded-md border border-border overflow-hidden">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleScenarioChange(s.id)}
                disabled={player.isPlaying}
                className={`px-2.5 py-1 transition-colors ${
                  scenarioId === s.id ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Size slider */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-muted-foreground">size</span>
            <input
              type="range"
              min={8}
              max={28}
              value={size}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              disabled={player.isPlaying}
              aria-label="Array size"
              className="h-1.5 w-24 cursor-pointer accent-foreground disabled:opacity-50"
            />
            <span className="tabular-nums w-4 text-right text-muted-foreground">{size}</span>
          </div>

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
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs
              prefix="sort"
              colors={[
                ["cyan", COLOR_CYAN],
                ["green", COLOR_GREEN],
                ["amber", COLOR_AMBER],
              ]}
            />

            {/* Title & Metrics */}
            <text
              x={cfg.plotX}
              y={16}
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={MONO_FONT}
              fontWeight={800}
              fontSize={13}
              style={{ letterSpacing: 0.5 }}
            >
              {MODE_TITLES[mode]}
            </text>

            <text
              x={cfg.vbW - cfg.plotX}
              y={16}
              textAnchor="end"
              dominantBaseline="hanging"
              fill="#a1a1aa"
              fontFamily={MONO_FONT}
              fontWeight={800}
              fontSize={12}
            >
              comparisons {curView.comparisons} · swaps {curView.swaps}
            </text>

            {/* Note */}
            {curView.note && (
              <text
                x={cfg.vbW / 2}
                y={isHeap ? 42 : 44}
                textAnchor="middle"
                dominantBaseline="central"
                fill={COLOR_CYAN}
                fontFamily={MONO_FONT}
                fontWeight={800}
                fontSize={13}
              >
                {curView.note}
              </text>
            )}

            {/* Tree visualization if in Heap mode */}
            {isHeap && curView.heapSize && curView.heapSize > 0 && (
              <g>
                {Array.from({ length: Math.min(curView.heapSize, n) }).map((_, i) => {
                  const leftChild = 2 * i + 1;
                  const rightChild = 2 * i + 2;
                  const depth = Math.floor(Math.log2(i + 1));
                  const indexInLevel = i - (Math.pow(2, depth) - 1);
                  const totalInLevel = Math.pow(2, depth);
                  const nx = cfg.plotX + ((indexInLevel + 0.5) / totalInLevel) * cfg.plotW;
                  const ny = cfg.treeTop + depth * cfg.treeRowH;

                  return (
                    <g key={`tree-node-${i}`}>
                      {leftChild < Math.min(curView.heapSize!, n) && (
                        <line
                          x1={nx}
                          y1={ny}
                          x2={
                            cfg.plotX +
                            ((2 * indexInLevel + 0.5) / (2 * totalInLevel)) * cfg.plotW
                          }
                          y2={ny + cfg.treeRowH}
                          stroke="rgba(161,161,170,0.3)"
                          strokeWidth={1.5}
                        />
                      )}
                      {rightChild < Math.min(curView.heapSize!, n) && (
                        <line
                          x1={nx}
                          y1={ny}
                          x2={
                            cfg.plotX +
                            ((2 * indexInLevel + 1.5) / (2 * totalInLevel)) * cfg.plotW
                          }
                          y2={ny + cfg.treeRowH}
                          stroke="rgba(161,161,170,0.3)"
                          strokeWidth={1.5}
                        />
                      )}
                      <circle
                        cx={nx}
                        cy={ny}
                        r={12}
                        fill={getBarColor(i)}
                        stroke={curView.states[i] != null ? getBarColor(i) : "rgba(255,255,255,0.2)"}
                        strokeWidth={1.5}
                      />
                      <text
                        x={nx}
                        y={ny + 0.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={curView.states[i] != null ? "#09090b" : "#FFFFFF"}
                        fontSize={10}
                        fontWeight={800}
                        fontFamily={MONO_FONT}
                      >
                        {curView.values[i]}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Bars */}
            {curView.values.map((v, i) => {
              const h = (v / maxVal) * cfg.maxH;
              const x = cfg.plotX + i * colW + (colW - barW) / 2;
              const y = cfg.baseY - h;
              const fill = getBarColor(i);
              const isHighlight = curView.states[i] != null;

              return (
                <g key={`bar-${i}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barW}
                    height={h}
                    rx={3}
                    fill={fill}
                    stroke={isHighlight ? fill : "rgba(255,255,255,0.18)"}
                    strokeWidth={isHighlight ? 2 : 1}
                  />
                  {n <= 20 && (
                    <text
                      x={x + barW / 2}
                      y={cfg.baseY + 14}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isHighlight ? fill : "#FFFFFF"}
                      fontSize={10}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {v}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Baseline */}
            <line
              x1={cfg.plotX}
              y1={cfg.baseY + 0.5}
              x2={cfg.plotX + cfg.plotW}
              y2={cfg.baseY + 0.5}
              stroke="rgba(161,161,170,0.35)"
              strokeWidth={1}
            />

            {/* Result text */}
            {curView.resultText && (
              <text
                x={cfg.vbW / 2}
                y={cfg.vbH - 16}
                textAnchor="middle"
                dominantBaseline="central"
                fill={COLOR_GREEN}
                fontSize={14}
                fontWeight={800}
                fontFamily={MONO_FONT}
                style={{ letterSpacing: 0.4 }}
              >
                {curView.resultText}
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.resultText || curView.note} />
    </div>
  );
}

// Named Exports for Category 12 (Comparison Sorts)
export function BubbleSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="bubble" />;
}

export function SelectionSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="selection" />;
}

export function InsertionSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="insertion" />;
}

export function ShellSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="shell" />;
}

export function MergeSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="merge" />;
}

export function QuickSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="quick" />;
}

export function HeapSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="heap" />;
}

export function CyclicSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="cyclic" />;
}

export function TimSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="tim" />;
}

export function CocktailSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="cocktail" />;
}

export function CombSortSimulation() {
  return <UnifiedComparisonSortSimulation mode="comb" />;
}
