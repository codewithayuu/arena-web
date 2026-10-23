"use client";

import React from "react";
import { GlowDefs } from "../shared/simulation-defs";

export interface VisualArrayElement {
  value: number | string;
  position: number;
  state?:
    | "idle"
    | "active"
    | "compare"
    | "comparing"
    | "found"
    | "mismatch"
    | "sorted"
    | "done"
    | "swapping"
    | "swap"
    | "dim"
    | "minimum"
    | string;
}

export interface VisualPointer {
  position: number;
  label: string;
  color?: string; // hex
}

interface ArrayVisualizerProps {
  elements: VisualArrayElement[];
  pointers?: VisualPointer[];
  connectingArc?: [number, number]; // [idxA, idxB]
  hudLeft?: React.ReactNode;
  hudRight?: React.ReactNode;
  centerEquation?: React.ReactNode;
  height?: number;
  variant?: "boxes" | "bars";
  className?: string;
}

export function ArrayVisualizer({
  elements,
  pointers = [],
  connectingArc,
  hudLeft,
  hudRight,
  centerEquation,
  height = 320,
  variant = "boxes",
  className = "",
}: ArrayVisualizerProps) {
  const count = elements.length;
  const vbW = 720;
  const vbH = height;

  // -------------------------------------------------------------
  // BARS VARIANT (for Sorting algorithms matching Mindflare 1:1)
  // -------------------------------------------------------------
  if (variant === "bars") {
    const k = Math.max(1, count);
    const maxVal = Math.max(...elements.map((e) => Number(e.value) || 1), 1);
    const slotW = Math.min(648 / k, 66);
    const barW = Math.min(56, slotW - 10);
    const totalW = (k - 1) * slotW + barW;
    const startX = (vbW - totalW) / 2;
    const getBarX = (pos: number) => startX + pos * slotW + barW / 2;
    const baselineY = 214;

    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
      >
        <svg
          viewBox={`0 0 ${vbW} ${vbH}`}
          className="w-full h-auto select-none overflow-visible"
          style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
        >
          {/* Top HUD */}
          {hudLeft && (
            <g
              transform="translate(36, 18)"
              className="text-xs font-bold font-mono"
            >
              {hudLeft}
            </g>
          )}
          {hudRight && (
            <g
              transform={`translate(${vbW - 36}, 18)`}
              textAnchor="end"
              className="text-xs font-bold font-mono"
            >
              {hudRight}
            </g>
          )}

          {/* Baseline */}
          <line
            x1={startX - 10}
            y1={baselineY}
            x2={startX + totalW + 10}
            y2={baselineY}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Indices underneath baseline */}
          {elements.map((el, i) => (
            <text
              key={`ix-${i}`}
              x={getBarX(el.position)}
              y={baselineY + 14}
              textAnchor="middle"
              fill="#71717a"
              fontSize={10}
              fontWeight={700}
            >
              {el.position}
            </text>
          ))}

          {/* Vertical Bars */}
          {elements.map((el, idx) => {
            const bx = getBarX(el.position);
            const valNum = Number(el.value) || 1;
            const barH = Math.max(12, (valNum / maxVal) * 148);
            const barY = baselineY - barH;

            let fill = "#000000";
            let stroke = "rgba(255,255,255,0.2)";
            let labelColor = "#ffffff";

            if (el.state === "sorted" || el.state === "done") {
              fill = "#86EFAC"; // Solid Mint Green
              stroke = "#86EFAC";
              labelColor = "#86EFAC";
            } else if (
              el.state === "swapping" ||
              el.state === "swap" ||
              el.state === "minimum"
            ) {
              fill = "#FDBA74"; // Solid Peach
              stroke = "#FDBA74";
              labelColor = "#FDBA74";
            } else if (
              el.state === "comparing" ||
              el.state === "compare" ||
              el.state === "active"
            ) {
              fill = "#FDE047"; // Solid Butter Yellow
              stroke = "#FDE047";
              labelColor = "#FDE047";
            }

            return (
              <g key={`bar-${idx}`}>
                <rect
                  x={bx - barW / 2}
                  y={barY}
                  width={barW}
                  height={barH}
                  rx={Math.min(8, 0.22 * barW)}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={bx}
                  y={barY - 8}
                  textAnchor="middle"
                  fill={labelColor}
                  fontSize={barW < 42 ? 11 : 13}
                  fontWeight={800}
                >
                  {el.value}
                </text>
              </g>
            );
          })}

          {/* Pointer Lines & Pills */}
          {pointers.map((ptr, idx) => {
            const px = getBarX(ptr.position);
            const isMin = ptr.label.toLowerCase() === "min";
            const isJ =
              ptr.label.toLowerCase() === "j" ||
              ptr.label.toLowerCase() === "j+1";
            const targetY = isMin ? 276 : 246;

            let pillFill = "#93C5FD"; // Solid Pastel Sky Blue
            let pillStroke = "#93C5FD";
            let pillText = "#09090b";

            if (isMin) {
              pillFill = "#FDBA74"; // Solid Peach
              pillStroke = "#FDBA74";
              pillText = "#09090b";
            } else if (isJ) {
              pillFill = "#FDE047"; // Solid Butter Yellow
              pillStroke = "#FDE047";
              pillText = "#09090b";
            }

            const pillW = Math.max(26, ptr.label.length * 8 + 14);

            return (
              <g key={`ptr-${idx}`}>
                <line
                  x1={px}
                  y1={baselineY}
                  x2={px}
                  y2={targetY}
                  stroke={pillStroke}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
                <rect
                  x={px - pillW / 2}
                  y={targetY}
                  width={pillW}
                  height={22}
                  rx={7}
                  fill={pillFill}
                  stroke={pillStroke}
                  strokeWidth={1.5}
                />
                <text
                  x={px}
                  y={targetY + 11.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={pillText}
                  fontSize={11}
                  fontWeight={800}
                >
                  {ptr.label}
                </text>
              </g>
            );
          })}

          {/* Bottom Center Comparison / Status */}
          {centerEquation && (
            <g transform={`translate(${vbW / 2}, 318)`} textAnchor="middle">
              {centerEquation}
            </g>
          )}
        </svg>
      </div>
    );
  }

  // -------------------------------------------------------------
  // BOXES VARIANT (for Arrays, Strings, Stacks, Queues, etc.)
  // -------------------------------------------------------------
  const cellW = Math.min(
    56,
    Math.max(38, Math.floor(580 / Math.max(1, count))),
  );
  const cellH = cellW;
  const cellGap = Math.min(
    14,
    Math.max(6, Math.floor((640 - count * cellW) / Math.max(1, count - 1))),
  );
  const totalArrayW = count * cellW + (count - 1) * cellGap;
  const startX = (vbW - totalArrayW) / 2;
  const centerY = 100;

  const getCellX = (pos: number) =>
    startX + pos * (cellW + cellGap) + cellW / 2;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto select-none overflow-visible"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >

        {/* Top HUD */}
        {hudLeft && (
          <g
            transform="translate(32, 24)"
            className="text-xs font-bold font-mono"
          >
            {hudLeft}
          </g>
        )}
        {hudRight && (
          <g
            transform={`translate(${vbW - 32}, 24)`}
            textAnchor="end"
            className="text-xs font-bold font-mono"
          >
            {hudRight}
          </g>
        )}

        {/* Connecting Arc */}
        {connectingArc && (
          <g>
            {(() => {
              const x1 = getCellX(connectingArc[0]);
              const x2 = getCellX(connectingArc[1]);
              const midX = (x1 + x2) / 2;
              const arcH = Math.min(36, Math.abs(x2 - x1) * 0.25);
              return (
                <path
                  d={`M ${x1} ${centerY - cellH / 2} Q ${midX} ${centerY - cellH / 2 - arcH * 2} ${x2} ${centerY - cellH / 2}`}
                  fill="none"
                  stroke="#86EFAC"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                />
              );
            })()}
          </g>
        )}

        {/* Array Elements */}
        {elements.map((el, i) => {
          const cx = getCellX(el.position);
          const cy = centerY;

          let fill = "#000000"; // Pure AMOLED pitch black
          let stroke = "rgba(255,255,255,0.12)";
          let textColor = "#f4f4f5";
          let glow: string | undefined = undefined;

          if (
            el.state === "active" ||
            el.state === "compare" ||
            el.state === "comparing"
          ) {
            fill = "#FDE047"; // Solid Butter Yellow
            stroke = "#FDE047";
            textColor = "#09090b"; // Crisp Jet Black Text
          } else if (
            el.state === "found" ||
            el.state === "sorted" ||
            el.state === "done"
          ) {
            fill = "#86EFAC"; // Solid Mint Green
            stroke = "#86EFAC";
            textColor = "#09090b"; // Crisp Jet Black Text
          } else if (el.state === "swapping" || el.state === "swap") {
            fill = "#FDBA74"; // Solid Peach
            stroke = "#FDBA74";
            textColor = "#09090b";
          } else if (el.state === "mismatch") {
            fill = "#FF1018"; // Crimson Red
            stroke = "#FF1018";
            textColor = "#ffffff";
          } else if (el.state === "dim") {
            textColor = "#52525b";
          }

          return (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              {/* Box */}
              <rect
                x={-cellW / 2}
                y={-cellH / 2}
                width={cellW}
                height={cellH}
                rx={Math.min(14, cellW * 0.28)}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                filter={glow}
              />
              {/* Value */}
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={cellW < 44 ? 14 : 17}
                fontWeight={800}
              >
                {el.value}
              </text>
              {/* Index label underneath */}
              <text
                y={cellH / 2 + 16}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#7c7c85"
                fontSize={10}
                fontWeight={700}
              >
                {el.position}
              </text>
            </g>
          );
        })}

        {/* Pointers */}
        {pointers.map((ptr, idx) => {
          const cx = getCellX(ptr.position);
          const color = ptr.color || (idx === 0 ? "#93C5FD" : "#FDBA74");
          const ptrY = centerY + cellH / 2 + 32;

          return (
            <g key={idx} transform={`translate(${cx}, ${ptrY})`}>
              {/* Up Arrow */}
              <path d="M 0 -8 L -4 0 L 4 0 Z" fill={color} />
              {/* Pointer Tag Pill */}
              <rect x={-14} y={2} width={28} height={20} rx={6} fill={color} />
              <text
                y={12}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#09090b"
                fontSize={11}
                fontWeight={800}
              >
                {ptr.label}
              </text>
            </g>
          );
        })}

        {/* Center Equation / Metrics */}
        {centerEquation && (
          <g
            transform={`translate(${vbW / 2}, ${vbH - 32})`}
            textAnchor="middle"
          >
            {centerEquation}
          </g>
        )}
      </svg>
    </div>
  );
}
