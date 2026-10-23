"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { RotateCcw, Shuffle } from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_AMBER = "#FDBA74";  // Solid Pastel Peach
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_TEAL = "#86EFAC";   // Solid Pastel Mint Green

// ==========================================
// COMMON HELPERS & SCENARIOS FOR STRING MATCHING
// ==========================================
const COMMON_SCENARIOS = [
  { id: "repeat", name: "Repeated Pattern", text: "ABABDABACDABABCABAB", pattern: "ABABCABAB" },
  { id: "dna", name: "DNA Sequence", text: "GCATCGCAGAGAGTATACAG", pattern: "GCAGAGAG" },
  { id: "hits", name: "Multiple Hits", text: "AABAACAADAABAABA", pattern: "AABA" },
];

interface StringMatchFrame {
  text: string;
  pattern: string;
  shift: number;
  textStates: Record<number, string>;
  patternStates: Record<number, string>;
  carets: { index: number; label: string; row: "text" | "pattern" }[];
  found: number[];
  metrics: { label: string; value: string }[];
  note: string;
  resultText?: string;
  phaseLabel: string;
  aside?:
    | { kind: "lps"; values: number[]; chars: string; active?: number | null }
    | { kind: "hash"; windowHash: string; patternHash: string; collision: boolean }
    | { kind: "badchar"; char: string; shiftBy: number };
}

// ==========================================
// 1. KMP (KNUTH-MORRIS-PRATT) SIMULATION
// ==========================================
export function KmpSimulation() {
  const [scenarioId, setScenarioId] = useState("repeat");
  const sc = COMMON_SCENARIOS.find((s) => s.id === scenarioId) || COMMON_SCENARIOS[0];
  const [pattern, setPattern] = useState(sc.pattern);
  const text = sc.text;

  const frames = useMemo<StringMatchFrame[]>(() => {
    const list: StringMatchFrame[] = [];
    const tLen = text.length;
    const pLen = pattern.length;

    if (!pattern || pLen === 0) return [];

    // Phase 1: Build LPS Table
    const lps = Array(pLen).fill(0);
    let comps = 0;

    const pushLpsFrame = (iIdx: number, lenIdx: number, activeIdx: number | null, note: string) => {
      const tStates: Record<number, string> = {};
      if (lenIdx >= 0 && lenIdx < pLen) tStates[lenIdx] = "match";
      if (iIdx >= 0 && iIdx < pLen) tStates[iIdx] = "compare";

      const carets: { index: number; label: string; row: "text" | "pattern" }[] = [];
      if (lenIdx >= 0 && lenIdx < pLen) carets.push({ index: lenIdx, label: "len", row: "text" });
      if (iIdx >= 0 && iIdx < pLen) carets.push({ index: iIdx, label: "i", row: "text" });

      list.push({
        text: pattern,
        pattern: "",
        shift: 0,
        textStates: tStates,
        patternStates: {},
        carets,
        found: [],
        metrics: [{ label: "comparisons", value: String(comps) }],
        note,
        phaseLabel: "Build LPS table",
        aside: { kind: "lps", values: [...lps], chars: pattern, active: activeIdx },
      });
    };

    pushLpsFrame(-1, -1, 0, "lps[0] = 0 (single character has no proper prefix)");
    let len = 0;
    let i = 1;

    while (i < pLen) {
      comps++;
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        pushLpsFrame(i, len - 1, i, `pattern[${i}] = '${pattern[i]}' extends prefix, lps[${i}] = ${len}`);
        i++;
      } else if (len > 0) {
        const prev = lps[len - 1];
        pushLpsFrame(i, len, null, `Mismatch, fall back len = lps[${len - 1}] = ${prev}`);
        len = prev;
      } else {
        lps[i] = 0;
        pushLpsFrame(i, 0, i, `pattern[${i}] = '${pattern[i]}' breaks prefix, lps[${i}] = 0`);
        i++;
      }
    }

    // Phase 2: Search with LPS
    const matches: number[] = [];
    const applyFound = (states: Record<number, string>) => {
      for (const m of matches) {
        for (let k = 0; k < pLen; k++) states[m + k] = "found";
      }
    };

    let tIdx = 0;
    let pIdx = 0;

    while (tIdx < tLen) {
      comps++;
      const isMatch = text[tIdx] === pattern[pIdx];
      const shift = tIdx - pIdx;

      const tStates: Record<number, string> = {};
      const pStates: Record<number, string> = {};
      applyFound(tStates);

      for (let k = 0; k < pIdx; k++) {
        tStates[shift + k] = "match";
        pStates[k] = "match";
      }

      tStates[tIdx] = isMatch ? "match" : "mismatch";
      pStates[pIdx] = isMatch ? "match" : "mismatch";

      const note = isMatch
        ? `text[${tIdx}] = '${text[tIdx]}' matches pattern[${pIdx}]`
        : pIdx > 0
        ? `Mismatch: jump j to lps[${pIdx - 1}] = ${lps[pIdx - 1]}, i stays at ${tIdx}`
        : `Mismatch at pattern[0]: advance i to ${tIdx + 1}`;

      list.push({
        text,
        pattern,
        shift,
        textStates: tStates,
        patternStates: pStates,
        carets: [
          { index: tIdx, label: "i", row: "text" },
          { index: pIdx, label: "j", row: "pattern" },
        ],
        found: [...matches],
        metrics: [
          { label: "comparisons", value: String(comps) },
          { label: "matches", value: String(matches.length) },
        ],
        note,
        phaseLabel: "Search with LPS",
        aside: { kind: "lps", values: lps, chars: pattern, active: pIdx },
      });

      if (isMatch) {
        tIdx++;
        pIdx++;
        if (pIdx === pLen) {
          const mIdx = tIdx - pIdx;
          matches.push(mIdx);

          const fullT: Record<number, string> = {};
          applyFound(fullT);
          const fullP: Record<number, string> = {};
          for (let k = 0; k < pLen; k++) fullP[k] = "found";

          list.push({
            text,
            pattern,
            shift: mIdx,
            textStates: fullT,
            patternStates: fullP,
            carets: [],
            found: [...matches],
            metrics: [
              { label: "comparisons", value: String(comps) },
              { label: "matches", value: String(matches.length) },
            ],
            note: `Full match at index ${mIdx}! Continue with j = lps[${pLen - 1}] = ${lps[pLen - 1]}`,
            resultText: `Found at index ${matches.join(", ")}`,
            phaseLabel: "Search with LPS",
            aside: { kind: "lps", values: lps, chars: pattern, active: lps[pLen - 1] },
          });

          pIdx = lps[pLen - 1];
        }
      } else {
        if (pIdx > 0) {
          pIdx = lps[pIdx - 1];
        } else {
          tIdx++;
        }
      }
    }

    // Done frame
    const finalT: Record<number, string> = {};
    applyFound(finalT);
    list.push({
      text,
      pattern,
      shift: 0,
      textStates: finalT,
      patternStates: {},
      carets: [],
      found: [...matches],
      metrics: [{ label: "comparisons", value: String(comps) }],
      note: matches.length
        ? `Done. Found ${matches.length} match${matches.length > 1 ? "es" : ""}.`
        : "Done. Pattern does not occur in text.",
      resultText: matches.length ? `Found at index ${matches.join(", ")}` : "Pattern not found",
      phaseLabel: "Search with LPS",
    });

    return list;
  }, [text, pattern]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(260, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 260);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Knuth-Morris-Pratt (KMP)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Precompute the LPS table, then on a mismatch jump the pattern forward without backing up the text pointer.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {COMMON_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setScenarioId(s.id);
                  setPattern(s.pattern);
                  playback.stop();
                }}
                disabled={playback.isPlaying}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                } disabled:opacity-50`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <SimpleTooltip content="Reset">
            <button
              onClick={() => playback.stop()}
              disabled={playback.isPlaying}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      <StringMatchingVisualizer frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 2. RABIN-KARP (ROLLING HASH) SIMULATION
// ==========================================
export function RabinKarpSimulation() {
  const [scenarioId, setScenarioId] = useState("repeat");
  const sc = COMMON_SCENARIOS.find((s) => s.id === scenarioId) || COMMON_SCENARIOS[0];
  const [pattern, setPattern] = useState(sc.pattern);
  const text = sc.text;

  const frames = useMemo<StringMatchFrame[]>(() => {
    const list: StringMatchFrame[] = [];
    const tLen = text.length;
    const pLen = pattern.length;
    if (!pattern || pLen === 0 || pLen > tLen) return [];

    const charVal = (ch: string) => ch.charCodeAt(0);
    const mod = 101;
    const base = 256;

    let pHash = 0;
    for (let i = 0; i < pLen; i++) pHash = (base * pHash + charVal(pattern[i])) % mod;

    let hMult = 1;
    for (let i = 0; i < pLen - 1; i++) hMult = (base * hMult) % mod;

    let wHash = 0;
    for (let i = 0; i < pLen; i++) wHash = (base * wHash + charVal(text[i])) % mod;

    const matches: number[] = [];
    let comparisons = 0;

    const applyFound = (st: Record<number, string>) => {
      for (const m of matches) {
        for (let k = 0; k < pLen; k++) st[m + k] = "found";
      }
    };

    for (let shift = 0; shift + pLen <= tLen; shift++) {
      const isCollision = wHash === pHash;

      // Window hash comparison frame
      const tStates: Record<number, string> = {};
      applyFound(tStates);
      for (let k = 0; k < pLen; k++) {
        if (!tStates[shift + k]) tStates[shift + k] = "window";
      }

      const pStates: Record<number, string> = {};
      for (let k = 0; k < pLen; k++) pStates[k] = "window";

      list.push({
        text,
        pattern,
        shift,
        textStates: tStates,
        patternStates: pStates,
        carets: [],
        found: [...matches],
        metrics: [
          { label: "comparisons", value: String(comparisons) },
          { label: "matches", value: String(matches.length) },
        ],
        note: isCollision
          ? `Hash ${wHash} matches pattern hash ${pHash}! Verify characters one by one.`
          : `Hash ${wHash} ≠ ${pHash}, skip this window.`,
        phaseLabel: "Rolling Hash",
        aside: { kind: "hash", windowHash: String(wHash), patternHash: String(pHash), collision: isCollision },
      });

      if (isCollision) {
        let matchFull = true;
        for (let c = 0; c < pLen; c++) {
          comparisons++;
          const charEqual = text[shift + c] === pattern[c];

          const vTStates: Record<number, string> = {};
          const vPStates: Record<number, string> = {};
          applyFound(vTStates);
          for (let k = 0; k < c; k++) {
            vTStates[shift + k] = "match";
            vPStates[k] = "match";
          }
          vTStates[shift + c] = charEqual ? "match" : "mismatch";
          vPStates[c] = charEqual ? "match" : "mismatch";

          list.push({
            text,
            pattern,
            shift,
            textStates: vTStates,
            patternStates: vPStates,
            carets: [
              { index: shift + c, label: "i", row: "text" },
              { index: c, label: "j", row: "pattern" },
            ],
            found: [...matches],
            metrics: [
              { label: "comparisons", value: String(comparisons) },
              { label: "matches", value: String(matches.length) },
            ],
            note: charEqual
              ? `Verify: text[${shift + c}] = '${text[shift + c]}' equals pattern[${c}]`
              : `Hash collision! text[${shift + c}] ≠ pattern[${c}], false alarm.`,
            phaseLabel: "Verify Match",
            aside: { kind: "hash", windowHash: String(wHash), patternHash: String(pHash), collision: true },
          });

          if (!charEqual) {
            matchFull = false;
            break;
          }
        }

        if (matchFull) {
          matches.push(shift);
          const fullT: Record<number, string> = {};
          applyFound(fullT);
          const fullP: Record<number, string> = {};
          for (let k = 0; k < pLen; k++) fullP[k] = "found";

          list.push({
            text,
            pattern,
            shift,
            textStates: fullT,
            patternStates: fullP,
            carets: [],
            found: [...matches],
            metrics: [
              { label: "comparisons", value: String(comparisons) },
              { label: "matches", value: String(matches.length) },
            ],
            note: `Full match at index ${shift}!`,
            resultText: `Found at index ${matches.join(", ")}`,
            phaseLabel: "Verify Match",
            aside: { kind: "hash", windowHash: String(wHash), patternHash: String(pHash), collision: true },
          });
        }
      }

      // Roll hash to next character
      if (shift + pLen < tLen) {
        const dropCh = text[shift];
        const addCh = text[shift + pLen];
        wHash = ((((wHash - charVal(dropCh) * hMult) % mod) * base + charVal(addCh)) % mod + mod) % mod;
      }
    }

    return list;
  }, [text, pattern]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(260, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 260);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Rabin-Karp (Rolling Hash)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare rolling hash of each window to the pattern hash, verifying characters only on a hash match.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {COMMON_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setScenarioId(s.id);
                  setPattern(s.pattern);
                  playback.stop();
                }}
                disabled={playback.isPlaying}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                } disabled:opacity-50`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <SimpleTooltip content="Reset">
            <button
              onClick={() => playback.stop()}
              disabled={playback.isPlaying}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      <StringMatchingVisualizer frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// ==========================================
// 3. BOYER-MOORE SIMULATION
// ==========================================
export function BoyerMooreSimulation() {
  const [scenarioId, setScenarioId] = useState("repeat");
  const sc = COMMON_SCENARIOS.find((s) => s.id === scenarioId) || COMMON_SCENARIOS[0];
  const [pattern, setPattern] = useState(sc.pattern);
  const text = sc.text;

  const frames = useMemo<StringMatchFrame[]>(() => {
    const list: StringMatchFrame[] = [];
    const tLen = text.length;
    const pLen = pattern.length;
    if (!pattern || pLen === 0) return [];

    const badChar: Record<string, number> = {};
    for (let i = 0; i < pLen; i++) badChar[pattern[i]] = i;

    const matches: number[] = [];
    let comparisons = 0;
    let shiftCount = 0;

    const applyFound = (st: Record<number, string>) => {
      for (const m of matches) {
        for (let k = 0; k < pLen; k++) st[m + k] = "found";
      }
    };

    let shift = 0;
    while (shift + pLen <= tLen) {
      let j = pLen - 1;
      while (j >= 0) {
        comparisons++;
        const isMatch = text[shift + j] === pattern[j];

        const tStates: Record<number, string> = {};
        const pStates: Record<number, string> = {};
        applyFound(tStates);

        for (let k = j + 1; k < pLen; k++) {
          tStates[shift + k] = "match";
          pStates[k] = "match";
        }

        tStates[shift + j] = isMatch ? "match" : "mismatch";
        pStates[j] = isMatch ? "match" : "mismatch";

        if (isMatch) {
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
            found: [...matches],
            metrics: [
              { label: "comparisons", value: String(comparisons) },
              { label: "shifts", value: String(shiftCount) },
            ],
            note: `Scan right to left: text[${shift + j}] = '${text[shift + j]}' equals pattern[${j}]`,
            phaseLabel: "Bad Character Scan",
          });
          j--;
        } else {
          const bad = text[shift + j];
          const lastIdx = badChar[bad] ?? -1;
          const jump = Math.max(1, j - lastIdx);

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
            found: [...matches],
            metrics: [
              { label: "comparisons", value: String(comparisons) },
              { label: "shifts", value: String(shiftCount) },
            ],
            note:
              lastIdx >= 0
                ? `Bad char '${bad}' is in pattern: shift by ${jump} to align`
                : `Bad char '${bad}' not in pattern: shift past it by ${jump}`,
            phaseLabel: "Bad Character Scan",
            aside: { kind: "badchar", char: bad, shiftBy: jump },
          });

          shift += jump;
          shiftCount++;
          break;
        }
      }

      if (j < 0) {
        matches.push(shift);
        const fullT: Record<number, string> = {};
        applyFound(fullT);
        const fullP: Record<number, string> = {};
        for (let k = 0; k < pLen; k++) fullP[k] = "found";

        list.push({
          text,
          pattern,
          shift,
          textStates: fullT,
          patternStates: fullP,
          carets: [],
          found: [...matches],
          metrics: [
            { label: "comparisons", value: String(comparisons) },
            { label: "shifts", value: String(shiftCount) },
          ],
          note: `Full match at index ${shift}!`,
          resultText: `Found at index ${matches.join(", ")}`,
          phaseLabel: "Bad Character Scan",
        });

        shift += 1;
        shiftCount++;
      }
    }

    return list;
  }, [text, pattern]);

  const initialFrame = frames[0];
  const playback = useSimulationPlayback(260, initialFrame);
  const currentFrame =
    playback.armed && playback.index >= 0 && playback.index < frames.length
      ? frames[playback.index]
      : initialFrame;

  const handleRun = useCallback(() => {
    playback.play(frames, 260);
  }, [playback, frames]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Boyer-Moore</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Scan each window right to left and use the bad character heuristic to skip multiple positions forward.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {COMMON_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setScenarioId(s.id);
                  setPattern(s.pattern);
                  playback.stop();
                }}
                disabled={playback.isPlaying}
                className={`px-2.5 py-1 font-medium transition-colors ${
                  scenarioId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
                } disabled:opacity-50`}
              >
                {s.name}
              </button>
            ))}
          </div>
          <SimpleTooltip content="Reset">
            <button
              onClick={() => playback.stop()}
              disabled={playback.isPlaying}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      <StringMatchingVisualizer frame={currentFrame} />
      <SimulationPlayerBar player={playback} onRun={handleRun} />
    </div>
  );
}

// Shared String Matching Visualizer (Text/Pattern Grid + LPS/Hash/Badchar aside)
function StringMatchingVisualizer({ frame }: { frame: StringMatchFrame }) {
  if (!frame) return null;
  const { text, pattern, shift, textStates, patternStates, carets, metrics, note, resultText, phaseLabel, aside } = frame;
  const tLen = text.length;
  const cellW = 28;

  return (
    <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-x-auto select-none">
      <div className="min-w-fit mx-auto space-y-4" style={{ fontFamily: MONO_FONT }}>
        {/* Phase label & Metrics */}
        <div className="flex items-baseline justify-between gap-3 px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            {phaseLabel}
          </span>
          <span className="text-[11px] font-bold text-muted-foreground tabular-nums">
            {metrics.map((m) => `${m.label} ${m.value}`).join("   ·   ")}
          </span>
        </div>

        {/* Character Grid */}
        <div className="space-y-1.5 pt-1">
          {/* Index row */}
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

          {/* Text row */}
          <div className="flex">
            {text.split("").map((ch, idx) => {
              const st = textStates[idx] || "idle";
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
              } else if (st === "compare") {
                bg = "bg-[#FDE047]";
                textCol = "text-[#09090b] font-bold";
                border = "border-[#FDE047]";
              } else if (st === "window") {
                bg = "bg-[#93C5FD]";
                textCol = "text-[#09090b] font-bold";
                border = "border-[#93C5FD]";
              }

              return (
                <div
                  key={`tch-${idx}`}
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

          {/* Text Caret (i) */}
          <div className="flex h-5">
            {Array.from({ length: tLen }).map((_, idx) => {
              const caret = carets.find((c) => c.row === "text" && c.index === idx);
              return (
                <div
                  key={`tc-${idx}`}
                  style={{ width: cellW }}
                  className="flex flex-col items-center justify-center shrink-0 leading-none text-[#93C5FD] font-bold"
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

          {/* Pattern row */}
          {pattern ? (
            <div className="flex">
              {Array.from({ length: tLen }).map((_, idx) => {
                const pIdx = idx - shift;
                const inBounds = pIdx >= 0 && pIdx < pattern.length;
                if (!inBounds) {
                  return <div key={`pe-${idx}`} style={{ width: cellW }} className="shrink-0" />;
                }

                const st = patternStates[pIdx] || "idle";
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
                } else if (st === "window") {
                  bg = "bg-[#93C5FD]";
                  textCol = "text-[#09090b] font-bold";
                  border = "border-[#93C5FD]";
                }

                return (
                  <div
                    key={`pch-${idx}`}
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

          {/* Pattern Caret (j) */}
          {pattern ? (
            <div className="flex h-5">
              {Array.from({ length: tLen }).map((_, idx) => {
                const pIdx = idx - shift;
                const caret = carets.find((c) => c.row === "pattern" && c.index === pIdx);
                return (
                  <div
                    key={`pc-${idx}`}
                    style={{ width: cellW }}
                    className="flex flex-col items-center justify-center shrink-0 leading-none text-[#93C5FD] font-bold"
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

        {/* Aside Panels (LPS table, Hash values, or Bad character jump) */}
        {aside?.kind === "lps" ? (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              LPS Table
            </div>
            <div className="flex flex-wrap gap-1">
              {aside.values.map((val, idx) => {
                const isActive = aside.active === idx;
                return (
                  <div
                    key={`lps-${idx}`}
                    className={`flex flex-col items-center rounded-[5px] border px-2 py-1 ${
                      isActive ? "bg-[#93C5FD] text-[#09090b] border-[#93C5FD] font-bold" : "bg-card border-border text-foreground"
                    }`}
                  >
                    <span className="text-[9px] opacity-70">{aside.chars[idx]}</span>
                    <span className="text-xs font-bold tabular-nums">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : aside?.kind === "hash" ? (
          <div className="mt-3 pt-3 border-t border-gray-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="border border-border rounded px-2 py-1 bg-card">
              window hash: <strong className="text-[#93C5FD]">{aside.windowHash}</strong>
            </span>
            <span className="text-muted-foreground font-bold">{aside.collision ? "=" : "≠"}</span>
            <span className="border border-border rounded px-2 py-1 bg-card">
              pattern hash: <strong className="text-[#93C5FD]">{aside.patternHash}</strong>
            </span>
            {aside.collision ? (
              <span className="font-bold text-[#86EFAC]">Match! Verify characters</span>
            ) : (
              <span className="text-muted-foreground">No match, skip window</span>
            )}
          </div>
        ) : aside?.kind === "badchar" ? (
          <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">bad character:</span>
            <span className="w-6 h-6 rounded bg-[#FCA5A5] text-[#09090b] font-bold flex items-center justify-center">
              {aside.char}
            </span>
            <span className="text-muted-foreground">shift pattern by:</span>
            <span className="font-bold text-[#93C5FD] tabular-nums">{aside.shiftBy}</span>
          </div>
        ) : null}

        {/* Note & Result */}
        {note ? <div className="text-xs font-semibold text-[#93C5FD]">{note}</div> : null}
        {resultText ? (
          <div
            className={`text-sm font-bold ${
              resultText.startsWith("Found") ? "text-[#86EFAC]" : "text-muted-foreground"
            }`}
          >
            {resultText}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ==========================================
// 4. AHO-CORASICK SIMULATION
// ==========================================
const AC_SCENARIOS = [
  { id: "hers", name: "he · she · his · hers", patterns: ["he", "she", "his", "hers"], text: "ushers" },
  { id: "aba", name: "ab · ba · aba", patterns: ["ab", "ba", "aba"], text: "ababa" },
];

export function AhoCorasickSimulation() {
  const [scId, setScId] = useState(AC_SCENARIOS[0].id);
  const activeSc = AC_SCENARIOS.find((s) => s.id === scId) || AC_SCENARIOS[0];

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Aho-Corasick Multi-Pattern Search</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Match many patterns simultaneously in O(n + m) time using a trie augmented with suffix failure links.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {AC_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScId(s.id)}
              className={`px-2.5 py-1 font-medium transition-colors ${
                scId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-6 space-y-4">
        {/* Pattern chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Patterns:</span>
          {activeSc.patterns.map((p) => (
            <span key={p} className="px-2 py-0.5 rounded bg-muted font-mono text-xs text-foreground font-semibold">
              {p}
            </span>
          ))}
          <span className="text-xs text-muted-foreground ml-4">Text:</span>
          <span className="px-2 py-0.5 rounded bg-[#93C5FD] text-[#09090b] font-mono text-xs font-bold">
            {activeSc.text}
          </span>
        </div>

        {/* Tree and failure links overview SVG */}
        <div className="overflow-x-auto py-2">
          <svg viewBox="0 0 540 280" className="w-full max-w-[540px] mx-auto h-auto select-none" style={{ fontFamily: MONO_FONT }}>
            <GlowDefs prefix="ac" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["amber", COLOR_AMBER]]} />

            {/* Root */}
            <circle cx={270} cy={36} r={18} fill="#27272a" stroke="rgba(161,161,170,0.5)" strokeWidth={2} />
            <text x={270} y={37} textAnchor="middle" dominantBaseline="central" fill="#a1a1aa" fontSize={11} fontWeight={700}>
              root
            </text>

            {/* Level 1 Nodes */}
            <line x1={270} y1={54} x2={160} y2={100} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={160} cy={100} r={16} fill="#27272a" stroke={COLOR_CYAN} strokeWidth={2} />
            <text x={160} y={101} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontSize={13} fontWeight={800}>
              h
            </text>

            <line x1={270} y1={54} x2={380} y2={100} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={380} cy={100} r={16} fill="#27272a" stroke={COLOR_CYAN} strokeWidth={2} />
            <text x={380} y={101} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontSize={13} fontWeight={800}>
              s
            </text>

            {/* Level 2 Nodes */}
            <line x1={160} y1={116} x2={110} y2={170} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={110} cy={170} r={16} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
            <text x={110} y={171} textAnchor="middle" dominantBaseline="central" fill="#09090b" fontSize={13} fontWeight={800}>
              e
            </text>
            <text x={110} y={198} textAnchor="middle" fill={COLOR_GREEN} fontSize={10} fontWeight={700}>
              "he"
            </text>

            <line x1={160} y1={116} x2={210} y2={170} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={210} cy={170} r={16} fill="#27272a" stroke="rgba(161,161,170,0.5)" strokeWidth={1.5} />
            <text x={210} y={171} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontSize={13} fontWeight={800}>
              i
            </text>

            <line x1={380} y1={116} x2={380} y2={170} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={380} cy={170} r={16} fill="#27272a" stroke={COLOR_CYAN} strokeWidth={2} />
            <text x={380} y={171} textAnchor="middle" dominantBaseline="central" fill="#f4f4f5" fontSize={13} fontWeight={800}>
              h
            </text>

            {/* Level 3 Nodes */}
            <line x1={210} y1={186} x2={210} y2={236} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={210} cy={236} r={16} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
            <text x={210} y={237} textAnchor="middle" dominantBaseline="central" fill="#09090b" fontSize={13} fontWeight={800}>
              s
            </text>
            <text x={210} y={262} textAnchor="middle" fill={COLOR_GREEN} fontSize={10} fontWeight={700}>
              "his"
            </text>

            <line x1={380} y1={186} x2={380} y2={236} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
            <circle cx={380} cy={236} r={16} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
            <text x={380} y={237} textAnchor="middle" dominantBaseline="central" fill="#09090b" fontSize={13} fontWeight={800}>
              e
            </text>
            <text x={380} y={262} textAnchor="middle" fill={COLOR_GREEN} fontSize={10} fontWeight={700}>
              "she"
            </text>

            {/* Failure link curved dashed path: from "she" to "he" */}
            <path
              d="M 364 236 Q 240 270 128 174"
              fill="none"
              stroke={COLOR_AMBER}
              strokeWidth={2}
              strokeDasharray="4 3"
            />
            <text x={246} y={252} textAnchor="middle" fill={COLOR_AMBER} fontSize={9} fontWeight={700}>
              fail: suffix "he"
            </text>
          </svg>
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed">
          Matches found in text <code className="text-[#93C5FD] font-mono">"{activeSc.text}"</code>:{" "}
          <strong className="text-[#86EFAC] font-mono">"she" @ 1, "he" @ 2, "hers" @ 2</strong> in a single linear pass!
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. Z-ALGORITHM SIMULATION
// ==========================================
const Z_SCENARIOS = [
  { id: "mixed", name: "aabxaabxcaabxaabxay", text: "aabxaabxcaabxaabxay" },
  { id: "repeat", name: "ababab", text: "ababab" },
  { id: "runs", name: "aaaaa", text: "aaaaa" },
];

export function ZAlgorithmSimulation() {
  const [scId, setScId] = useState("mixed");
  const text = Z_SCENARIOS.find((s) => s.id === scId)?.text || Z_SCENARIOS[0].text;
  const n = text.length;

  // Compute Z-array
  const zArray = useMemo(() => {
    const Z = Array(n).fill(0);
    let l = 0;
    let r = 0;

    for (let i = 1; i < n; i++) {
      if (i < r) {
        Z[i] = Math.min(r - i, Z[i - l]);
      }
      while (i + Z[i] < n && text[Z[i]] === text[i + Z[i]]) {
        Z[i]++;
      }
      if (i + Z[i] > r) {
        l = i;
        r = i + Z[i];
      }
    }
    return Z;
  }, [text, n]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Z-Algorithm (Prefix Matching)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Construct the Z-array in O(n) time where Z[i] stores the length of the longest prefix match starting at position i.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {Z_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScId(s.id)}
              className={`px-2.5 py-1 font-mono transition-colors ${
                scId === s.id ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-6 space-y-4 overflow-x-auto select-none">
        <div className="min-w-fit space-y-2" style={{ fontFamily: MONO_FONT }}>
          {/* Index row */}
          <div className="flex">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0">i</span>
            {text.split("").map((_, i) => (
              <div key={`zi-${i}`} className="w-8 text-center text-[10px] text-muted-foreground tabular-nums">
                {i}
              </div>
            ))}
          </div>

          {/* Characters row */}
          <div className="flex items-center">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0">char</span>
            {text.split("").map((ch, i) => (
              <div
                key={`zc-${i}`}
                className="w-8 h-8 rounded border border-border/60 bg-[#27272a] text-foreground font-bold flex items-center justify-center text-xs"
              >
                {ch}
              </div>
            ))}
          </div>

          {/* Z values row */}
          <div className="flex items-center pt-2">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0 font-bold">Z[i]</span>
            {zArray.map((val, i) => (
              <div
                key={`zv-${i}`}
                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold tabular-nums ${
                  i === 0
                    ? "bg-card text-muted-foreground border-border/40"
                    : val > 0
                    ? "bg-[#86EFAC] border-[#86EFAC] text-[#09090b] font-bold"
                    : "bg-[#27272a] text-muted-foreground border-border/60"
                }`}
              >
                {i === 0 ? "-" : val}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          Longest prefix matches: indices with Z[i] &gt; 0 indicate exact matches of prefix substrings.
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. SUFFIX ARRAY SIMULATION
// ==========================================
const SA_SCENARIOS = [
  { id: "banana", text: "banana" },
  { id: "abaaba", text: "abaaba" },
  { id: "mississ", text: "mississ" },
];

export function SuffixArraySimulation() {
  const [scId, setScId] = useState("banana");
  const text = SA_SCENARIOS.find((s) => s.id === scId)?.text || SA_SCENARIOS[0].text;
  const n = text.length;

  const sortedSuffixes = useMemo(() => {
    const list = Array.from({ length: n }, (_, i) => ({
      index: i,
      suffix: text.slice(i),
    }));
    list.sort((a, b) => a.suffix.localeCompare(b.suffix));
    return list;
  }, [text, n]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Suffix Array</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sort every suffix of the string lexicographically; the resulting start indices form the Suffix Array (SA).
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {SA_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScId(s.id)}
              className={`px-2.5 py-1 font-mono transition-colors ${
                scId === s.id ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-6 space-y-4 select-none">
        <div className="space-y-1.5 max-w-lg mx-auto" style={{ fontFamily: MONO_FONT }}>
          {sortedSuffixes.map((item, rank) => (
            <div
              key={`sa-${rank}`}
              className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-1.5 bg-[#27272a]/50 text-xs"
            >
              <span className="w-12 text-[10px] text-muted-foreground">SA[{rank}]</span>
              <span className="w-6 h-6 rounded bg-[#93C5FD] text-[#09090b] font-bold flex items-center justify-center shrink-0">
                {item.index}
              </span>
              <span className="font-mono text-sm tracking-wide text-foreground font-semibold">
                {item.suffix}
              </span>
            </div>
          ))}
        </div>

        {/* Summary array */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-800 max-w-lg mx-auto" style={{ fontFamily: MONO_FONT }}>
          <span className="text-xs font-bold text-muted-foreground">SA:</span>
          <div className="flex gap-1.5 flex-wrap">
            {sortedSuffixes.map((item) => (
              <span key={item.index} className="w-7 h-7 rounded border border-[#93C5FD] bg-[#93C5FD] text-[#09090b] font-bold text-xs flex items-center justify-center">
                {item.index}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. SUFFIX TREE SIMULATION
// ==========================================
export function SuffixTreeSimulation() {
  return (
    <div className="w-full p-4 space-y-4">
      <div>
        <h3 className="text-sm font-medium text-foreground">Suffix Tree</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Compressed trie of all suffixes of "banana$" with terminal delimiter $, enabling O(m) substring search.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-6 overflow-x-auto select-none">
        <svg viewBox="0 0 560 300" className="w-full max-w-[560px] mx-auto h-auto" style={{ fontFamily: MONO_FONT }}>
          <GlowDefs prefix="st" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

          {/* Root */}
          <circle cx={280} cy={30} r={7} fill="#a1a1aa" />
          <text x={280} y={16} textAnchor="middle" fontSize={10} fill="#a1a1aa" fontWeight={700}>
            root
          </text>

          {/* Edge 1: $ */}
          <line x1={280} y1={30} x2={60} y2={180} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={170} y={100} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            $
          </text>
          <circle cx={60} cy={180} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={60} y={184} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            6
          </text>

          {/* Edge 2: a */}
          <line x1={280} y1={30} x2={200} y2={130} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={245} y={75} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            a
          </text>
          <circle cx={200} cy={130} r={6} fill="#a1a1aa" />

          {/* a -> $ (5) */}
          <line x1={200} y1={130} x2={140} y2={230} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={165} y={175} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            $
          </text>
          <circle cx={140} cy={230} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={140} y={234} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            5
          </text>

          {/* a -> na */}
          <line x1={200} y1={130} x2={240} y2={200} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={226} y={160} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            na
          </text>
          <circle cx={240} cy={200} r={6} fill="#a1a1aa" />

          {/* a -> na -> $ (3) */}
          <line x1={240} y1={200} x2={210} y2={270} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={220} y={240} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            $
          </text>
          <circle cx={210} cy={270} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={210} y={274} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            3
          </text>

          {/* a -> na -> na$ (1) */}
          <line x1={240} y1={200} x2={270} y2={270} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={260} y={240} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            na$
          </text>
          <circle cx={270} cy={270} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={270} y={274} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            1
          </text>

          {/* Edge 3: banana$ (0) */}
          <line x1={280} y1={30} x2={380} y2={180} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={340} y={100} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            banana$
          </text>
          <circle cx={380} cy={180} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={380} y={184} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            0
          </text>

          {/* Edge 4: na */}
          <line x1={280} y1={30} x2={470} y2={130} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={386} y={75} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            na
          </text>
          <circle cx={470} cy={130} r={6} fill="#a1a1aa" />

          {/* na -> $ (4) */}
          <line x1={470} y1={130} x2={440} y2={230} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={450} y={175} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            $
          </text>
          <circle cx={440} cy={230} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={440} y={234} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            4
          </text>

          {/* na -> na$ (2) */}
          <line x1={470} y1={130} x2={510} y2={230} stroke="rgba(161,161,170,0.4)" strokeWidth={1.5} />
          <text x={500} y={175} textAnchor="middle" fontSize={11} fill={COLOR_CYAN} fontWeight={700}>
            na$
          </text>
          <circle cx={510} cy={230} r={12} fill={COLOR_GREEN} stroke="#000000" strokeWidth={2} />
          <text x={510} y={234} textAnchor="middle" fontSize={11} fontWeight={800} fill="#000">
            2
          </text>
        </svg>
      </div>
    </div>
  );
}

// ==========================================
// 8. MANACHER'S ALGORITHM SIMULATION
// ==========================================
const MANACHER_SCENARIOS = [
  { id: "babad", text: "babad" },
  { id: "abacabad", text: "abacabad" },
  { id: "aaaa", text: "aaaa" },
];

export function ManacherSimulation() {
  const [scId, setScId] = useState("babad");
  const rawText = MANACHER_SCENARIOS.find((s) => s.id === scId)?.text || MANACHER_SCENARIOS[0].text;

  // Transform: e.g. "babad" -> "#b#a#b#a#d#"
  const transformed = "#" + rawText.split("").join("#") + "#";
  const n = transformed.length;

  const { pArr, bestSub } = useMemo(() => {
    const P = Array(n).fill(0);
    let c = 0;
    let r = 0;

    for (let i = 1; i < n - 1; i++) {
      const mirror = 2 * c - i;
      if (i < r) {
        P[i] = Math.min(r - i, P[mirror]);
      }
      while (
        i + P[i] + 1 < n &&
        i - P[i] - 1 >= 0 &&
        transformed[i + P[i] + 1] === transformed[i - P[i] - 1]
      ) {
        P[i]++;
      }
      if (i + P[i] > r) {
        c = i;
        r = i + P[i];
      }
    }

    let maxLen = 0;
    let centerIdx = 0;
    for (let i = 1; i < n - 1; i++) {
      if (P[i] > maxLen) {
        maxLen = P[i];
        centerIdx = i;
      }
    }
    const start = Math.floor((centerIdx - maxLen) / 2);
    const best = rawText.slice(start, start + maxLen);

    return { pArr: P, bestSub: best };
  }, [transformed, rawText, n]);

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Manacher's Algorithm</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Find the longest palindromic substring in linear time O(n) using mirror center symmetry.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {MANACHER_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScId(s.id)}
              className={`px-2.5 py-1 font-mono transition-colors ${
                scId === s.id ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.text}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-6 space-y-4 overflow-x-auto select-none">
        <div className="min-w-fit space-y-2" style={{ fontFamily: MONO_FONT }}>
          {/* Index row */}
          <div className="flex">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0">i</span>
            {transformed.split("").map((_, i) => (
              <div key={`mi-${i}`} className="w-8 text-center text-[10px] text-muted-foreground tabular-nums">
                {i}
              </div>
            ))}
          </div>

          {/* Transformed string row */}
          <div className="flex items-center">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0">T[i]</span>
            {transformed.split("").map((ch, i) => (
              <div
                key={`mt-${i}`}
                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${
                  ch === "#"
                    ? "bg-[#27272a]/50 text-muted-foreground/60 border-border/40"
                    : "bg-[#27272a] text-foreground border-border/80"
                }`}
              >
                {ch}
              </div>
            ))}
          </div>

          {/* P radius array row */}
          <div className="flex items-center pt-2">
            <span className="w-12 text-[10px] text-muted-foreground shrink-0 font-bold">P[i]</span>
            {pArr.map((rad, i) => (
              <div
                key={`mp-${i}`}
                className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold tabular-nums ${
                  rad > 0
                    ? "bg-[#FDE047] border-[#FDE047] text-[#09090b] font-bold"
                    : "bg-[#27272a] text-muted-foreground border-border/60"
                }`}
              >
                {rad}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2">
          Longest palindromic substring: <strong className="text-[#86EFAC] font-mono text-sm">"{bestSub}"</strong> (length {bestSub.length}).
        </div>
      </div>
    </div>
  );
}
