"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";

const FONT_MONO = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Pastel Mint Green
const COLOR_ORANGE = "#FDBA74"; // Pastel Peach
const COLOR_RED = "#FCA5A5";    // Pastel Rose
const COLOR_YELLOW = "#FDE047"; // Pastel Butter Yellow

function toBits(val: number, width = 8): number[] {
  const bits: number[] = [];
  for (let i = width - 1; i >= 0; i--) {
    bits.push((val >> i) & 1);
  }
  return bits;
}

interface BitRowProps {
  bits: number[];
  states?: string[];
  x: number;
  y: number;
  cellW?: number;
  cellH?: number;
  gap?: number;
  indices?: boolean;
  rowLabel?: string;
  valueText?: string;
  valueFill?: string;
  faded?: boolean;
  onCellClick?: (idx: number) => void;
}

function BitRow({
  bits,
  states = [],
  x,
  y,
  cellW = 32,
  cellH = 38,
  gap = 6,
  indices = false,
  rowLabel,
  valueText,
  valueFill,
  faded = false,
  onCellClick,
}: BitRowProps) {
  const len = bits.length;
  const totalW = len * cellW + (len - 1) * gap;

  return (
    <g opacity={faded ? 0.4 : 1}>
      {rowLabel && (
        <text
          x={x - 14}
          y={y + cellH / 2}
          textAnchor="end"
          dominantBaseline="central"
          fill="#a1a1aa"
          fontFamily={FONT_MONO}
          fontWeight={700}
          fontSize={12}
        >
          {rowLabel}
        </text>
      )}

      {valueText && (
        <text
          x={x + totalW + 14}
          y={y + cellH / 2}
          textAnchor="start"
          dominantBaseline="central"
          fill={valueFill ?? "#a1a1aa"}
          fontFamily={FONT_MONO}
          fontWeight={700}
          fontSize={12}
        >
          {valueText}
        </text>
      )}

      {bits.map((bit, idx) => {
        const state = states[idx] ?? "idle";
        let fill = "#000000";
        let stroke = bit === 1 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.18)";
        let textFill = bit === 1 ? "#FFFFFF" : "#71717a";

        if (state === "active") {
          fill = COLOR_CYAN;
          stroke = COLOR_CYAN;
          textFill = "#09090b";
        } else if (state === "result") {
          fill = COLOR_GREEN;
          stroke = COLOR_GREEN;
          textFill = "#09090b";
        } else if (state === "drop") {
          fill = COLOR_RED;
          stroke = COLOR_RED;
          textFill = "#09090b";
        } else if (state === "warn") {
          fill = COLOR_YELLOW;
          stroke = COLOR_YELLOW;
          textFill = "#09090b";
        }

        const cellX = x + idx * (cellW + gap);
        const isInteractive = !!onCellClick;

        return (
          <g
            key={idx}
            onClick={isInteractive ? () => onCellClick(idx) : undefined}
            style={isInteractive ? { cursor: "pointer" } : undefined}
          >
            <rect
              x={cellX}
              y={y}
              width={cellW}
              height={cellH}
              rx={7}
              fill={fill}
              stroke={stroke}
              strokeWidth={state !== "idle" ? 2 : 1.25}
            />
            <text
              x={cellX + cellW / 2}
              y={y + cellH / 2 + 0.5}
              textAnchor="middle"
              dominantBaseline="central"
              fill={textFill}
              fontSize={16}
              fontWeight={800}
              fontFamily={FONT_MONO}
            >
              {bit}
            </text>
            {indices && (
              <text
                x={cellX + cellW / 2}
                y={y + cellH + 12}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#71717a"
                fontSize={10}
                fontWeight={700}
                fontFamily={FONT_MONO}
              >
                {len - 1 - idx}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function ColHighlight({
  x,
  colIndex,
  yTop,
  yBottom,
  cellW = 32,
  gap = 6,
  color = COLOR_CYAN,
}: {
  x: number;
  colIndex: number;
  yTop: number;
  yBottom: number;
  cellW?: number;
  gap?: number;
  color?: string;
}) {
  return (
    <rect
      x={x + colIndex * (cellW + gap) - 4}
      y={yTop - 5}
      width={cellW + 8}
      height={yBottom - yTop + 10}
      rx={10}
      fill={color}
      fillOpacity={0.09}
      stroke={color}
      strokeOpacity={0.45}
      strokeWidth={1.25}
    />
  );
}

/* =========================================================================
   1. BIT MASKING SIMULATION (get, set, clear, toggle)
   ========================================================================= */

const BM_OPERATIONS = [
  { id: "get", label: "Get", pos: 3 },
  { id: "set", label: "Set", pos: 4 },
  { id: "clear", label: "Clear", pos: 5 },
  { id: "toggle", label: "Toggle", pos: 1 },
];

export function BitMaskingSimulation() {
  const [opId, setOpId] = useState("set");
  const currentOp = BM_OPERATIONS.find((o) => o.id === opId) ?? BM_OPERATIONS[1];
  const [targetPos, setTargetPos] = useState(currentOp.pos);

  const N_INIT = 44; // 00101100

  const frames = useMemo(() => {
    const list = [];
    const nIdx = 7 - targetPos;
    const initialBits = toBits(N_INIT, 8);
    const sym =
      currentOp.id === "set" ? "|" : currentOp.id === "toggle" ? "^" : "& ~";

    // Frame 0: Target position
    const states0 = Array(8).fill("idle");
    states0[nIdx] = "active";
    list.push({
      nBits: initialBits,
      nStates: states0,
      maskBits: Array(8).fill(0),
      maskStates: Array(8).fill("idle"),
      showMask: false,
      resultBits: initialBits,
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: nIdx,
      nVal: N_INIT,
      maskVal: null as number | null,
      resultVal: null as number | null,
      expr: `${currentOp.label.toLowerCase()} bit ${targetPos}`,
      status: `Target the bit at position ${targetPos}`,
      resultText: "",
    });

    if (currentOp.id === "get") {
      const bitVal = (N_INIT >> targetPos) & 1;
      const statesGet = Array(8).fill("idle");
      statesGet[nIdx] = bitVal === 1 ? "result" : "drop";
      list.push({
        nBits: initialBits,
        nStates: statesGet,
        maskBits: Array(8).fill(0),
        maskStates: Array(8).fill("idle"),
        showMask: false,
        resultBits: initialBits,
        resultStates: Array(8).fill("idle"),
        showResult: false,
        activeCol: nIdx,
        nVal: N_INIT,
        maskVal: null,
        resultVal: null,
        expr: `(n >> ${targetPos}) & 1 = ${bitVal}`,
        status: `Shift down by ${targetPos} and AND with 1 to read the bit`,
        resultText: `Bit ${targetPos} = ${bitVal}`,
      });
      return list;
    }

    // Frame 1: mask = 1
    const maskInit = toBits(1, 8);
    const maskStates1 = Array(8).fill("idle");
    maskStates1[7] = "active";
    list.push({
      nBits: initialBits,
      nStates: states0,
      maskBits: maskInit,
      maskStates: maskStates1,
      showMask: true,
      maskLabel: `${sym === "& ~" ? "&" : sym} mask`,
      maskVal: 1,
      resultBits: initialBits,
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: nIdx,
      nVal: N_INIT,
      resultVal: null,
      expr: "mask = 1",
      status: "Start the mask as a single 1 at position 0",
      resultText: "",
    });

    // Frame 2: 1 << pos
    const shiftedVal = 1 << targetPos;
    const maskShifted = toBits(shiftedVal, 8);
    const maskStates2 = Array(8).fill("idle");
    maskStates2[nIdx] = "active";
    if (targetPos > 0) {
      list.push({
        nBits: initialBits,
        nStates: states0,
        maskBits: maskShifted,
        maskStates: maskStates2,
        showMask: true,
        maskLabel: `${sym === "& ~" ? "&" : sym} mask`,
        maskVal: shiftedVal,
        resultBits: initialBits,
        resultStates: Array(8).fill("idle"),
        showResult: false,
        activeCol: nIdx,
        nVal: N_INIT,
        resultVal: null,
        expr: `1 << ${targetPos} = ${shiftedVal}`,
        status: `Shift it left ${targetPos} ${
          targetPos === 1 ? "place" : "places"
        }: 1 << ${targetPos}`,
        resultText: "",
      });
    }

    // Frame 3: Invert if clear
    const isClear = currentOp.id === "clear";
    const maskAppliedVal = isClear ? 255 & ~shiftedVal : shiftedVal;
    const maskFinalBits = toBits(maskAppliedVal, 8);
    const maskFinalStates = Array(8).fill("idle");

    if (isClear) {
      for (let i = 0; i < 8; i++) {
        maskFinalStates[i] = i === nIdx ? "drop" : "warn";
      }
      list.push({
        nBits: initialBits,
        nStates: states0,
        maskBits: maskFinalBits,
        maskStates: maskFinalStates,
        showMask: true,
        maskLabel: "& ~mask",
        maskVal: maskAppliedVal,
        resultBits: initialBits,
        resultStates: Array(8).fill("idle"),
        showResult: false,
        activeCol: nIdx,
        nVal: N_INIT,
        resultVal: null,
        expr: `~(1 << ${targetPos}) = ${maskAppliedVal}`,
        status: `Invert it: every bit turns 1 except position ${targetPos}`,
        resultText: "",
      });
    } else {
      maskFinalStates[nIdx] = "active";
    }

    // Frame 4: Final combined result
    const resVal =
      currentOp.id === "set"
        ? N_INIT | shiftedVal
        : currentOp.id === "toggle"
        ? N_INIT ^ shiftedVal
        : N_INIT & maskAppliedVal;

    const resBits = toBits(resVal, 8);
    const bitAfter = (resVal >> targetPos) & 1;
    const resStates = Array(8).fill("idle");
    resStates[nIdx] = bitAfter === 1 ? "result" : "drop";

    list.push({
      nBits: initialBits,
      nStates: states0,
      maskBits: maskFinalBits,
      maskStates: maskFinalStates,
      showMask: true,
      maskLabel: isClear ? "& ~mask" : `${sym} mask`,
      maskVal: maskAppliedVal,
      showResult: true,
      resultBits: resBits,
      resultStates: resStates,
      activeCol: nIdx,
      nVal: N_INIT,
      resultVal: resVal,
      expr: isClear
        ? `${N_INIT} & ~${shiftedVal} = ${resVal}`
        : `${N_INIT} ${sym} ${shiftedVal} = ${resVal}`,
      status: `Bit ${targetPos} goes from ${
        (N_INIT >> targetPos) & 1
      } to ${bitAfter}, n = ${resVal}`,
      resultText: `${currentOp.label} bit ${targetPos}: ${N_INIT} → ${resVal}`,
    });

    return list;
  }, [currentOp, targetPos]);

  const idleFrame = useMemo(
    () => ({
      nBits: toBits(N_INIT, 8),
      nStates: Array(8).fill("idle"),
      maskBits: Array(8).fill(0),
      maskStates: Array(8).fill("idle"),
      showMask: false,
      maskLabel: "mask",
      resultBits: toBits(N_INIT, 8),
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: 7 - targetPos,
      nVal: N_INIT,
      maskVal: null,
      resultVal: null,
      expr: "",
      status: `Click a bit to pick a position, then Run to ${currentOp.label.toLowerCase()} bit ${targetPos}`,
      resultText: "",
    }),
    [targetPos, currentOp]
  );

  const player = useSimulationPlayback<any>(750, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 800);
  }, [frames, player]);

  const plotX = 85;
  const nY = 62;
  const maskY = 110;
  const lineY = 166;
  const resY = 180;
  const bannerY = 246;
  const vbH = curr.resultText ? 275 : 240;

  return (
    <div className="w-full space-y-4">
      {/* Header and Operation Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Get, set, clear and toggle a single bit by building a mask from 1 &lt;&lt; i. Click any bit cell to choose position.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {BM_OPERATIONS.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setOpId(op.id);
                setTargetPos(op.pos);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                opId === op.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox={`0 0 480 ${vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          {/* Top Banner */}
          <text
            x={14}
            y={14}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
            style={{ letterSpacing: 0.5 }}
          >
            {`${currentOp.label.toUpperCase()} BIT`}
          </text>

          {curr.expr && (
            <text
              x={466}
              y={14}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {curr.expr}
            </text>
          )}

          {/* Active column highlight */}
          {curr.activeCol !== null && (
            <ColHighlight
              x={plotX}
              colIndex={curr.activeCol}
              yTop={nY}
              yBottom={curr.showResult ? resY + 38 : curr.showMask ? maskY + 38 : nY + 38}
            />
          )}

          {/* Row 1: n */}
          <BitRow
            bits={curr.nBits}
            states={curr.nStates}
            x={plotX}
            y={nY}
            indices={!curr.showMask}
            rowLabel="n"
            valueText={`= ${curr.nVal}`}
            onCellClick={(idx) => {
              if (!player.isPlaying) {
                setTargetPos(7 - idx);
                player.showIdle();
              }
            }}
          />

          {/* Row 2: mask */}
          {curr.showMask && (
            <BitRow
              bits={curr.maskBits}
              states={curr.maskStates}
              x={plotX}
              y={maskY}
              rowLabel={curr.maskLabel}
              valueText={curr.maskVal !== null ? `= ${curr.maskVal}` : undefined}
            />
          )}

          {/* Divider line & Row 3: result */}
          {curr.showResult && (
            <>
              <line
                x1={plotX}
                y1={lineY}
                x2={plotX + 298}
                y2={lineY}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={1.5}
              />
              <BitRow
                bits={curr.resultBits}
                states={curr.resultStates}
                x={plotX}
                y={resY}
                indices={true}
                rowLabel="="
                valueText={curr.resultVal !== null ? `= ${curr.resultVal}` : undefined}
                valueFill={COLOR_GREEN}
              />
            </>
          )}

          {/* Result Banner */}
          {curr.resultText && (
            <text
              x={plotX + 149}
              y={bannerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontSize={14}
              fontWeight={800}
              fontFamily={FONT_MONO}
              style={{ letterSpacing: 0.3 }}
            >
              {curr.resultText}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   2. BITWISE OPERATORS SIMULATION (AND, OR, XOR, NOT, <<, >>)
   ========================================================================= */

const BW_OPS = [
  { id: "and", label: "AND", symbol: "&", binary: true },
  { id: "or", label: "OR", symbol: "|", binary: true },
  { id: "xor", label: "XOR", symbol: "^", binary: true },
  { id: "not", label: "NOT", symbol: "~", binary: false },
  { id: "shl", label: "Left Shift", symbol: "<<", binary: false },
  { id: "shr", label: "Right Shift", symbol: ">>", binary: false },
];

export function BitwiseOperatorsSimulation() {
  const [opId, setOpId] = useState("and");
  const currentOp = BW_OPS.find((o) => o.id === opId) ?? BW_OPS[0];

  const A_VAL = 202; // 11001010
  const B_VAL = 108; // 01101100

  const frames = useMemo(() => {
    const list = [];
    const aBits = toBits(A_VAL, 8);
    const bBits = toBits(B_VAL, 8);

    if (currentOp.binary) {
      const runningRes = Array(8).fill(null);
      list.push({
        aStates: Array(8).fill("idle"),
        bStates: Array(8).fill("idle"),
        resultBits: Array(8).fill(0),
        resultStates: Array(8).fill("dim"),
        activeCol: null,
        resultValue: null as number | null,
        expr: `${A_VAL} ${currentOp.symbol} ${B_VAL}`,
        status: `Line the operands up, combine each column with ${currentOp.symbol}, right to left`,
        resultText: "",
      });

      for (let i = 0; i < 8; i++) {
        const col = 7 - i;
        const sa = aBits[col];
        const sb = bBits[col];
        const bitRes =
          currentOp.id === "and"
            ? sa & sb
            : currentOp.id === "or"
            ? sa | sb
            : sa ^ sb;
        runningRes[col] = bitRes;

        const aSt = Array(8).fill("idle");
        const bSt = Array(8).fill("idle");
        const rSt = Array(8).fill("idle");
        aSt[col] = "active";
        bSt[col] = "active";
        rSt[col] = "result";

        list.push({
          aStates: aSt,
          bStates: bSt,
          resultBits: runningRes.map((b) => (b === null ? 0 : b)),
          resultStates: rSt,
          activeCol: col,
          resultValue: null,
          expr: `${sa} ${currentOp.symbol} ${sb} = ${bitRes}`,
          status: `Bit ${i}: ${sa} ${currentOp.symbol} ${sb} = ${bitRes}`,
          resultText: "",
        });
      }

      const finalVal =
        currentOp.id === "and"
          ? A_VAL & B_VAL
          : currentOp.id === "or"
          ? A_VAL | B_VAL
          : A_VAL ^ B_VAL;

      list.push({
        aStates: Array(8).fill("idle"),
        bStates: Array(8).fill("idle"),
        resultBits: toBits(finalVal, 8),
        resultStates: Array(8).fill("result"),
        activeCol: null,
        resultValue: finalVal,
        expr: `${A_VAL} ${currentOp.symbol} ${B_VAL} = ${finalVal}`,
        status: "Done, every column combined into the result",
        resultText: `${A_VAL} ${currentOp.symbol} ${B_VAL} = ${finalVal}  (0x${(
          255 & finalVal
        )
          .toString(16)
          .toUpperCase()
          .padStart(2, "0")})`,
      });

      return list;
    }

    if (currentOp.id === "not") {
      const runningRes = Array(8).fill(null);
      list.push({
        aStates: Array(8).fill("idle"),
        bStates: Array(8).fill("idle"),
        resultBits: Array(8).fill(0),
        resultStates: Array(8).fill("dim"),
        activeCol: null,
        resultValue: null,
        expr: `~${A_VAL}`,
        status: "NOT flips every bit of A (within 8 bits), right to left",
        resultText: "",
      });

      for (let i = 0; i < 8; i++) {
        const col = 7 - i;
        const sa = aBits[col];
        const flipped = 1 ^ sa;
        runningRes[col] = flipped;

        const aSt = Array(8).fill("idle");
        const rSt = Array(8).fill("idle");
        aSt[col] = "active";
        rSt[col] = "result";

        list.push({
          aStates: aSt,
          bStates: Array(8).fill("idle"),
          resultBits: runningRes.map((b) => (b === null ? 0 : b)),
          resultStates: rSt,
          activeCol: col,
          resultValue: null,
          expr: `~${sa} = ${flipped}`,
          status: `Bit ${i}: flip ${sa} into ${flipped}`,
          resultText: "",
        });
      }

      const finalVal = 255 & ~A_VAL; // 53
      list.push({
        aStates: Array(8).fill("idle"),
        bStates: Array(8).fill("idle"),
        resultBits: toBits(finalVal, 8),
        resultStates: Array(8).fill("result"),
        activeCol: null,
        resultValue: finalVal,
        expr: `~${A_VAL} = ${finalVal}`,
        status: "Done, all eight bits flipped",
        resultText: `~${A_VAL} = ${finalVal}  (0x${finalVal
          .toString(16)
          .toUpperCase()
          .padStart(2, "0")})`,
      });
      return list;
    }

    // Shifts
    const isLeft = currentOp.id === "shl";
    const dropCol = isLeft ? 0 : 7;
    const aDrop = Array(8).fill("idle");
    aDrop[dropCol] = "drop";

    list.push({
      aStates: aDrop,
      bStates: Array(8).fill("idle"),
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("dim"),
      activeCol: null,
      resultValue: null,
      expr: `${A_VAL} ${currentOp.symbol} 1`,
      status: isLeft
        ? "Shift left by 1: every bit moves one place left, the top bit falls off"
        : "Shift right by 1: every bit moves one place right, the bottom bit falls off",
      resultText: "",
    });

    const shiftedVal = isLeft ? (A_VAL << 1) & 255 : A_VAL >> 1;
    const rStates = Array(8).fill("idle");
    rStates[isLeft ? 7 : 0] = "result";

    list.push({
      aStates: Array(8).fill("idle"),
      bStates: Array(8).fill("idle"),
      resultBits: toBits(shiftedVal, 8),
      resultStates: rStates,
      activeCol: null,
      resultValue: shiftedVal,
      expr: `${A_VAL} ${currentOp.symbol} 1 = ${shiftedVal}`,
      status: isLeft
        ? "Done, shifting left by 1 doubled the value (mod 256)"
        : "Done, shifting right by 1 halved the value (integer division)",
      resultText: `${A_VAL} ${currentOp.symbol} 1 = ${shiftedVal}  (0x${shiftedVal
        .toString(16)
        .toUpperCase()
        .padStart(2, "0")})`,
    });

    return list;
  }, [currentOp]);

  const idleFrame = useMemo(
    () => ({
      aStates: Array(8).fill("idle"),
      bStates: Array(8).fill("idle"),
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("dim"),
      activeCol: null,
      resultValue: null,
      expr: "",
      status: `Ready · Press Play to compute ${currentOp.label.toUpperCase()}`,
      resultText: "",
    }),
    [currentOp]
  );

  const player = useSimulationPlayback<any>(750, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 750);
  }, [frames, player]);

  const plotX = 85;
  const aY = 62;
  const bY = 110;
  const lineY = currentOp.binary ? 166 : 118;
  const resY = currentOp.binary ? 180 : 132;
  const bannerY = currentOp.binary ? 246 : 198;
  const vbH = currentOp.binary ? 275 : 228;

  return (
    <div className="w-full space-y-4">
      {/* Header and Operation Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Apply AND, OR, XOR, NOT and shifts to 8-bit operands, one column at a time.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {BW_OPS.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setOpId(op.id);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                opId === op.id
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {op.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox={`0 0 480 ${vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          {/* Top Banner */}
          <text
            x={14}
            y={14}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
            style={{ letterSpacing: 0.5 }}
          >
            {currentOp.label.toUpperCase()}
          </text>

          {curr.expr && (
            <text
              x={466}
              y={14}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {curr.expr}
            </text>
          )}

          {/* Active column highlight */}
          {curr.activeCol !== null && (
            <ColHighlight
              x={plotX}
              colIndex={curr.activeCol}
              yTop={aY}
              yBottom={resY + 38}
            />
          )}

          {/* Row 1: A */}
          <BitRow
            bits={toBits(A_VAL, 8)}
            states={curr.aStates}
            x={plotX}
            y={aY}
            indices={!currentOp.binary}
            rowLabel="A"
            valueText={`= ${A_VAL}`}
          />

          {/* Row 2: B (if binary) */}
          {currentOp.binary && (
            <BitRow
              bits={toBits(B_VAL, 8)}
              states={curr.bStates}
              x={plotX}
              y={bY}
              rowLabel={`${currentOp.symbol} B`}
              valueText={`= ${B_VAL}`}
            />
          )}

          {/* Line */}
          <line
            x1={plotX}
            y1={lineY}
            x2={plotX + 298}
            y2={lineY}
            stroke="rgba(161,161,170,0.4)"
            strokeWidth={1.5}
          />

          {/* Row 3: Result */}
          <BitRow
            bits={curr.resultBits}
            states={curr.resultStates}
            x={plotX}
            y={resY}
            indices={true}
            rowLabel="="
            valueText={curr.resultValue !== null ? `= ${curr.resultValue}` : undefined}
            valueFill={COLOR_GREEN}
          />

          {/* Banner */}
          {curr.resultText && (
            <text
              x={plotX + 149}
              y={bannerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontSize={14}
              fontWeight={800}
              fontFamily={FONT_MONO}
              style={{ letterSpacing: 0.3 }}
            >
              {curr.resultText}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   3. COUNT SET BITS SIMULATION (Brian Kernighan: n & (n - 1))
   ========================================================================= */

export function CountSetBitsSimulation() {
  const N_INIT = 108; // 01101100 -> set bits at 2, 3, 5, 6 (count = 4)

  const frames = useMemo(() => {
    const list = [];
    let n = N_INIT;
    let count = 0;
    const cleared: number[] = [];

    list.push({
      nBits: toBits(n, 8),
      nStates: Array(8).fill("idle"),
      minusBits: Array(8).fill(0),
      minusStates: Array(8).fill("idle"),
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("idle"),
      showMinus: false,
      nVal: n,
      minusVal: null as number | null,
      resultVal: null as number | null,
      activeCol: null as number | null,
      cleared: [...cleared],
      count,
      expr: `n = ${n}`,
      status: `Start with n = ${n}, count = 0`,
      resultText: "",
    });

    while (n !== 0) {
      // Find lowest set bit
      let pos = 0;
      let mask = n & -n;
      while (mask > 1) {
        mask >>= 1;
        pos++;
      }
      const col = 7 - pos;

      // Frame: Locate lowest set bit
      const nSt = Array(8).fill("idle");
      nSt[col] = "active";
      list.push({
        nBits: toBits(n, 8),
        nStates: nSt,
        minusBits: Array(8).fill(0),
        minusStates: Array(8).fill("idle"),
        resultBits: Array(8).fill(0),
        resultStates: Array(8).fill("idle"),
        showMinus: false,
        nVal: n,
        minusVal: null,
        resultVal: null,
        activeCol: col,
        cleared: [...cleared],
        count,
        expr: `lowest set bit: position ${pos}`,
        status: `Pass ${count + 1}: the lowest set bit sits at position ${pos}`,
        resultText: "",
      });

      // Frame: n - 1 and n & (n - 1)
      const minus = n - 1;
      const nextN = n & minus;
      const minusSt = Array(8).fill("idle");
      for (let i = col; i < 8; i++) minusSt[i] = "warn";
      const resSt = Array(8).fill("idle");
      resSt[col] = "drop";

      count++;
      cleared.push(pos);

      list.push({
        nBits: toBits(n, 8),
        nStates: nSt,
        minusBits: toBits(minus, 8),
        minusStates: minusSt,
        resultBits: toBits(nextN, 8),
        resultStates: resSt,
        showMinus: true,
        nVal: n,
        minusVal: minus,
        resultVal: nextN,
        activeCol: col,
        cleared: [...cleared],
        count,
        expr: `${n} & ${minus} = ${nextN}`,
        status: `Clear bit ${pos}: count is now ${count}`,
        resultText: "",
      });

      n = nextN;
    }

    list.push({
      nBits: toBits(0, 8),
      nStates: Array(8).fill("idle"),
      minusBits: Array(8).fill(0),
      minusStates: Array(8).fill("idle"),
      resultBits: toBits(0, 8),
      resultStates: Array(8).fill("result"),
      showMinus: false,
      nVal: 0,
      minusVal: null,
      resultVal: 0,
      activeCol: null,
      cleared: [...cleared],
      count,
      expr: "n = 0",
      status: `Done: n has exactly ${count} set bits`,
      resultText: `Set bits count = ${count}`,
    });

    return list;
  }, []);

  const idleFrame = useMemo(
    () => ({
      nBits: toBits(N_INIT, 8),
      nStates: Array(8).fill("idle"),
      minusBits: Array(8).fill(0),
      minusStates: Array(8).fill("idle"),
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("idle"),
      showMinus: false,
      nVal: N_INIT,
      minusVal: null,
      resultVal: null,
      activeCol: null,
      cleared: [] as number[],
      count: 0,
      expr: `n = ${N_INIT}`,
      status: `Start with n = ${N_INIT}, count = 0`,
      resultText: "",
    }),
    []
  );

  const player = useSimulationPlayback<any>(800, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 850);
  }, [frames, player]);

  const plotX = 85;
  const chipsY = 40;
  const nY = 78;
  const minusY = 126;
  const lineY = 182;
  const resY = 196;
  const bannerY = 260;
  const vbH = curr.showMinus ? 285 : 225;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Brian Kernighan&apos;s algorithm: clear the lowest set bit in each step with n &amp; (n - 1) until n = 0.
          </p>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox={`0 0 480 ${vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          {/* Top Banner */}
          <text
            x={14}
            y={14}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
            style={{ letterSpacing: 0.5 }}
          >
            COUNT SET BITS
          </text>

          {curr.expr && (
            <text
              x={466}
              y={14}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {curr.expr}
            </text>
          )}

          {/* Chips Bar: count + cleared bits */}
          <g>
            <rect
              x={14}
              y={chipsY}
              width={86}
              height={22}
              rx={6}
              fill="none"
              stroke={COLOR_GREEN}
              strokeWidth={1.5}
            />
            <text
              x={57}
              y={chipsY + 11}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={11.5}
            >
              {`count = ${curr.count}`}
            </text>

            {curr.cleared.map((pos: number, idx: number) => {
              const xPos = 110 + 50 * idx;
              return (
                <g key={idx}>
                  <rect
                    x={xPos}
                    y={chipsY}
                    width={44}
                    height={22}
                    rx={6}
                    fill={COLOR_GREEN}
                    fillOpacity={0.14}
                    stroke={COLOR_GREEN}
                    strokeOpacity={0.55}
                    strokeWidth={1.25}
                  />
                  <text
                    x={xPos + 22}
                    y={chipsY + 11}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={COLOR_GREEN}
                    fontFamily={FONT_MONO}
                    fontWeight={700}
                    fontSize={10.5}
                  >
                    {`bit ${pos}`}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Active column highlight */}
          {curr.activeCol !== null && (
            <ColHighlight
              x={plotX}
              colIndex={curr.activeCol}
              yTop={nY}
              yBottom={curr.showMinus ? resY + 38 : nY + 38}
            />
          )}

          {/* Row 1: n */}
          <BitRow
            bits={curr.nBits}
            states={curr.nStates}
            x={plotX}
            y={nY}
            indices={!curr.showMinus}
            rowLabel="n"
            valueText={`= ${curr.nVal}`}
          />

          {/* Row 2: n - 1 & Row 3: n & (n - 1) */}
          {curr.showMinus && (
            <>
              <BitRow
                bits={curr.minusBits}
                states={curr.minusStates}
                x={plotX}
                y={minusY}
                rowLabel="n - 1"
                valueText={curr.minusVal !== null ? `= ${curr.minusVal}` : undefined}
              />
              <line
                x1={plotX}
                y1={lineY}
                x2={plotX + 298}
                y2={lineY}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={1.5}
              />
              <BitRow
                bits={curr.resultBits}
                states={curr.resultStates}
                x={plotX}
                y={resY}
                indices={true}
                rowLabel="n & (n-1)"
                valueText={curr.resultVal !== null ? `= ${curr.resultVal}` : undefined}
                valueFill={COLOR_GREEN}
              />
            </>
          )}

          {/* Banner */}
          {curr.resultText && (
            <text
              x={plotX + 149}
              y={bannerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontSize={14}
              fontWeight={800}
              fontFamily={FONT_MONO}
              style={{ letterSpacing: 0.3 }}
            >
              {curr.resultText}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   4. POWER OF TWO SIMULATION (n & (n - 1) == 0)
   ========================================================================= */

const P2_SCENARIOS = [
  { value: 8, isPower: true },
  { value: 12, isPower: false },
  { value: 64, isPower: true },
  { value: 100, isPower: false },
];

export function PowerOfTwoSimulation() {
  const [val, setVal] = useState(P2_SCENARIOS[0].value);
  const scenario = P2_SCENARIOS.find((s) => s.value === val) ?? P2_SCENARIOS[0];

  const frames = useMemo(() => {
    const list = [];
    const n = scenario.value;
    const minus = n - 1;
    const result = n & minus;
    const isP2 = n > 0 && result === 0;

    // Find lowest set bit position
    let pos = 0;
    let mask = n & -n;
    while (mask > 1) {
      mask >>= 1;
      pos++;
    }
    const col = 7 - pos;

    // Frame 0: Intro
    list.push({
      nBits: toBits(n, 8),
      nStates: Array(8).fill("idle"),
      minusBits: Array(8).fill(0),
      minusStates: Array(8).fill("idle"),
      showMinus: false,
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: null as number | null,
      nVal: n,
      minusVal: null as number | null,
      resultVal: null as number | null,
      expr: `n = ${n}`,
      status: "A power of two has a single set bit, test n & (n - 1)",
      resultText: "",
      isPower: false,
    });

    // Borrow progression
    for (let t = 0; t <= pos; t++) {
      const bitCol = 7 - t;
      const nSt = Array(8).fill("idle");
      nSt[bitCol] = "active";
      const mSt = Array(8).fill("idle");
      for (let e = 0; e < 8; e++) {
        const cPos = 7 - e;
        if (cPos < t) mSt[e] = "warn";
        else if (cPos > t) mSt[e] = "dim";
      }
      mSt[bitCol] = t === pos ? "drop" : "warn";

      list.push({
        nBits: toBits(n, 8),
        nStates: nSt,
        minusBits: toBits(minus, 8),
        minusStates: mSt,
        showMinus: true,
        resultBits: Array(8).fill(0),
        resultStates: Array(8).fill("idle"),
        showResult: false,
        activeCol: bitCol,
        nVal: n,
        minusVal: null,
        resultVal: null,
        expr: `${n} - 1`,
        status:
          t === pos
            ? `Bit ${t} is 1: it turns 0 and the borrow stops`
            : `Bit ${t} is 0: it borrows and turns 1, keep going up`,
        resultText: "",
        isPower: false,
      });
    }

    // Frame: n - 1 ready
    const minusStates = Array(8).fill("idle");
    for (let e = col; e < 8; e++) minusStates[e] = "warn";
    const nStatesActive = Array(8).fill("idle");
    nStatesActive[col] = "active";

    list.push({
      nBits: toBits(n, 8),
      nStates: nStatesActive,
      minusBits: toBits(minus, 8),
      minusStates: minusStates,
      showMinus: true,
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: col,
      nVal: n,
      minusVal: minus,
      resultVal: null,
      expr: `${n} - 1 = ${minus}`,
      status: "n - 1 flipped the lowest set bit and everything below it",
      resultText: "",
      isPower: false,
    });

    // Frame: result n & (n - 1)
    const resBits = toBits(result, 8);
    const resStates = Array(8).fill("idle");
    for (let e = 0; e < 8; e++) {
      if (resBits[e] === 1) resStates[e] = "warn";
    }
    resStates[col] = "drop";

    list.push({
      nBits: toBits(n, 8),
      nStates: nStatesActive,
      minusBits: toBits(minus, 8),
      minusStates: minusStates,
      showMinus: true,
      resultBits: resBits,
      resultStates: resStates,
      showResult: true,
      activeCol: col,
      nVal: n,
      minusVal: minus,
      resultVal: result,
      expr: `${n} & ${minus} = ${result}`,
      status: isP2
        ? "The only 1 was cleared, result is 0 → Power of Two!"
        : `Higher set bits remain, result is ${result} ≠ 0 → NOT a Power of Two`,
      resultText: isP2
        ? `${n} IS a Power of Two  (2^${pos})`
        : `${n} is NOT a Power of Two`,
      isPower: isP2,
    });

    return list;
  }, [scenario]);

  const idleFrame = useMemo(
    () => ({
      nBits: toBits(val, 8),
      nStates: Array(8).fill("idle"),
      minusBits: Array(8).fill(0),
      minusStates: Array(8).fill("idle"),
      showMinus: false,
      resultBits: Array(8).fill(0),
      resultStates: Array(8).fill("idle"),
      showResult: false,
      activeCol: null,
      nVal: val,
      minusVal: null,
      resultVal: null,
      expr: `n = ${val}`,
      status: `Ready · Test if ${val} is a power of two`,
      resultText: "",
      isPower: false,
    }),
    [val]
  );

  const player = useSimulationPlayback<any>(750, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 750);
  }, [frames, player]);

  const plotX = 85;
  const nY = 62;
  const minusY = 110;
  const lineY = 166;
  const resY = 180;
  const pillY = 244;
  const vbH = curr.showResult ? 285 : 230;

  const pillColor = curr.isPower ? COLOR_GREEN : COLOR_RED;

  return (
    <div className="w-full space-y-4">
      {/* Header and Value Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            A power of two has exactly one set bit. Clearing it via n &amp; (n - 1) must equal 0.
          </p>
        </div>
        <div className="flex rounded-md border border-border overflow-hidden text-xs">
          {P2_SCENARIOS.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setVal(s.value);
                player.showIdle();
              }}
              className={`px-2.5 py-1 transition-colors ${
                val === s.value
                  ? "bg-foreground text-background font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {`n = ${s.value}`}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox={`0 0 480 ${vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          {/* Top Banner */}
          <text
            x={14}
            y={14}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
            style={{ letterSpacing: 0.5 }}
          >
            POWER OF TWO
          </text>

          {curr.expr && (
            <text
              x={466}
              y={14}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {curr.expr}
            </text>
          )}

          {/* Active column highlight */}
          {curr.activeCol !== null && (
            <ColHighlight
              x={plotX}
              colIndex={curr.activeCol}
              yTop={nY}
              yBottom={curr.showResult ? resY + 38 : curr.showMinus ? minusY + 38 : nY + 38}
            />
          )}

          {/* Row 1: n */}
          <BitRow
            bits={curr.nBits}
            states={curr.nStates}
            x={plotX}
            y={nY}
            indices={!curr.showMinus}
            rowLabel="n"
            valueText={`= ${curr.nVal}`}
          />

          {/* Row 2: n - 1 */}
          {curr.showMinus && (
            <BitRow
              bits={curr.minusBits}
              states={curr.minusStates}
              x={plotX}
              y={minusY}
              rowLabel="n - 1"
              valueText={curr.minusVal !== null ? `= ${curr.minusVal}` : undefined}
            />
          )}

          {/* Row 3: Result */}
          {curr.showResult && (
            <>
              <line
                x1={plotX}
                y1={lineY}
                x2={plotX + 298}
                y2={lineY}
                stroke="rgba(161,161,170,0.4)"
                strokeWidth={1.5}
              />
              <BitRow
                bits={curr.resultBits}
                states={curr.resultStates}
                x={plotX}
                y={resY}
                indices={true}
                rowLabel="n & (n-1)"
                valueText={curr.resultVal !== null ? `= ${curr.resultVal}` : undefined}
                valueFill={pillColor}
              />
            </>
          )}

          {/* Result Pill */}
          {curr.resultText && (
            <g>
              <rect
                x={plotX + 149 - 130}
                y={pillY}
                width={260}
                height={28}
                rx={14}
                fill={pillColor}
                fillOpacity={0.14}
                stroke={pillColor}
                strokeOpacity={0.7}
                strokeWidth={1.5}
              />
              <text
                x={plotX + 149}
                y={pillY + 14}
                textAnchor="middle"
                dominantBaseline="central"
                fill={pillColor}
                fontSize={12.5}
                fontWeight={800}
                fontFamily={FONT_MONO}
                style={{ letterSpacing: 0.3 }}
              >
                {curr.resultText}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}

/* =========================================================================
   5. SINGLE NUMBER SIMULATION (array XOR cancellation)
   ========================================================================= */

const SN_ARRAY = [2, 3, 2, 5, 3];
const SN_CHIP_COLORS: Record<number, string> = {
  2: "#ffa94d",
  3: "#38d9a9",
  5: "#f783ac",
};

export function SingleNumberSimulation() {
  const frames = useMemo(() => {
    const list = [];
    let acc = 0;
    const consumed = Array(SN_ARRAY.length).fill(false);
    const seen = new Set<number>();

    list.push({
      i: -1,
      acc: 0,
      accBits: toBits(0, 4),
      accStates: Array(4).fill("idle"),
      curValue: null as number | null,
      curBits: toBits(0, 4),
      curStates: Array(4).fill("idle"),
      consumed: [...consumed],
      reveal: false,
      expr: "acc = 0",
      status: "Accumulator starts at 0, duplicate pairs share the same color",
      resultText: "",
    });

    for (let idx = 0; idx < SN_ARRAY.length; idx++) {
      const val = SN_ARRAY[idx];
      const nextAcc = acc ^ val;
      const isDuplicate = seen.has(val);
      seen.add(val);
      consumed[idx] = true;

      const valBits = toBits(val, 4);
      const accBits = toBits(nextAcc, 4);
      const curStates = Array(4).fill("idle");
      const accStates = Array(4).fill("idle");

      for (let b = 0; b < 4; b++) {
        if (valBits[b] === 1) {
          curStates[b] = "active";
          accStates[b] = "result";
        }
      }

      acc = nextAcc;

      list.push({
        i: idx,
        acc,
        accBits,
        accStates,
        curValue: val,
        curBits: valBits,
        curStates,
        consumed: [...consumed],
        reveal: false,
        expr: `acc ^ ${val} = ${acc}`,
        status: isDuplicate
          ? `Second ${val}: the same columns flip back off, the pair cancels!`
          : `XOR ${val} in, its set columns flip on, acc = ${acc}`,
        resultText: "",
      });
    }

    const finalBits = toBits(acc, 4);
    list.push({
      i: SN_ARRAY.length,
      acc,
      accBits: finalBits,
      accStates: finalBits.map((b) => (b === 1 ? "result" : "idle")),
      curValue: null,
      curBits: toBits(0, 4),
      curStates: Array(4).fill("idle"),
      consumed: [...consumed],
      reveal: true,
      expr: `acc = ${acc}`,
      status: `Every paired value cancelled, only ${acc} remains!`,
      resultText: `Single number = ${acc}`,
    });

    return list;
  }, []);

  const idleFrame = useMemo(
    () => ({
      i: -1,
      acc: 0,
      accBits: toBits(0, 4),
      accStates: Array(4).fill("idle"),
      curValue: null,
      curBits: toBits(0, 4),
      curStates: Array(4).fill("idle"),
      consumed: Array(SN_ARRAY.length).fill(false),
      reveal: false,
      expr: "acc = 0",
      status: "Accumulator starts at 0, pairs share a color",
      resultText: "",
    }),
    []
  );

  const player = useSimulationPlayback<any>(800, idleFrame);
  const curr = player.view;

  const handleRun = useCallback(() => {
    player.play(frames, 850);
  }, [frames, player]);

  const chipY = 44;
  const accY = 118;
  const curY = 166;
  const bannerY = 236;
  const vbH = 265;
  const chipStartX = (480 - (40 * SN_ARRAY.length + 10 * (SN_ARRAY.length - 1))) / 2;
  const rowStartX = (480 - (4 * 40 + 3 * 8)) / 2;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 flex-1">
          <p className="text-xs leading-relaxed text-muted-foreground">
            XOR the whole array together. Every paired duplicate cancels out because x ^ x = 0, leaving only the single number.
          </p>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl p-4 overflow-hidden shadow-2xl">
        <svg
          viewBox={`0 0 480 ${vbH}`}
          className="w-full h-auto block select-none"
          textRendering="geometricPrecision"
        >
          {/* Top Banner */}
          <text
            x={14}
            y={14}
            dominantBaseline="hanging"
            fill="#a1a1aa"
            fontFamily={FONT_MONO}
            fontWeight={800}
            fontSize={14}
            style={{ letterSpacing: 0.5 }}
          >
            SINGLE NUMBER
          </text>

          {curr.expr && (
            <text
              x={466}
              y={14}
              textAnchor="end"
              dominantBaseline="hanging"
              fill={COLOR_CYAN}
              fontFamily={FONT_MONO}
              fontWeight={800}
              fontSize={13}
            >
              {curr.expr}
            </text>
          )}

          {/* Chips Array [2, 3, 2, 5, 3] */}
          {SN_ARRAY.map((num, idx) => {
            const isCurrent = idx === curr.i && !curr.reveal;
            const isConsumed = curr.consumed[idx] && !isCurrent;
            const isWinner = curr.reveal && num === curr.acc;
            const strokeColor = SN_CHIP_COLORS[num] ?? COLOR_CYAN;
            const xPos = chipStartX + 50 * idx;

            let fill = "#27272a";
            let stroke = strokeColor;
            let opacity = 1;
            let textFill = "#f4f4f5";

            if (isCurrent) {
              fill = COLOR_CYAN;
              stroke = COLOR_CYAN;
              textFill = "#18181b";
            } else if (curr.reveal) {
              if (isWinner) {
                fill = COLOR_GREEN;
                stroke = COLOR_GREEN;
                textFill = "#18181b";
              } else {
                opacity = 0.22;
              }
            } else if (isConsumed) {
              opacity = 0.35;
            }

            return (
              <g key={idx} opacity={opacity}>
                <rect
                  x={xPos}
                  y={chipY}
                  width={40}
                  height={40}
                  rx={8}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCurrent || isWinner ? 2 : 1.5}
                />
                <text
                  x={xPos + 20}
                  y={chipY + 20.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={textFill}
                  fontSize={16}
                  fontWeight={800}
                  fontFamily={FONT_MONO}
                >
                  {num}
                </text>
              </g>
            );
          })}

          {/* Row 1: acc */}
          <BitRow
            bits={curr.accBits}
            states={curr.accStates}
            x={rowStartX}
            y={accY}
            cellW={40}
            gap={8}
            rowLabel="acc"
            valueText={`= ${curr.acc}`}
            valueFill={curr.reveal ? COLOR_GREEN : undefined}
          />

          {/* Row 2: cur value */}
          <BitRow
            bits={curr.curBits}
            states={curr.curStates}
            x={rowStartX}
            y={curY}
            cellW={40}
            gap={8}
            indices={true}
            rowLabel={curr.curValue === null ? "value" : `^ ${curr.curValue}`}
            valueText={curr.curValue !== null ? `= ${curr.curValue}` : undefined}
            faded={curr.curValue === null}
          />

          {/* Result Banner */}
          {curr.resultText && (
            <text
              x={240}
              y={bannerY}
              textAnchor="middle"
              dominantBaseline="central"
              fill={COLOR_GREEN}
              fontSize={14}
              fontWeight={800}
              fontFamily={FONT_MONO}
              style={{ letterSpacing: 0.3 }}
            >
              {curr.resultText}
            </text>
          )}
        </svg>
      </div>

      {/* Transport Player Bar */}
      <SimulationPlayerBar player={player} onRun={handleRun} />
    </div>
  );
}
