"use client";

import React from "react";
import { GlowDefs } from "../shared/simulation-defs";

export interface PatternCell {
  row: number;
  col: number;
  value: string;
  state: "pending" | "active" | "printed" | "done" | "space";
}

interface PatternGridVisualizerProps {
  cells: PatternCell[];
  activeRow?: number;
  height?: number;
  className?: string;
}

export function PatternGridVisualizer({
  cells,
  activeRow,
  height = 280,
  className = "",
}: PatternGridVisualizerProps) {
  if (cells.length === 0) return null;

  const maxRow = Math.max(...cells.map((c) => c.row)) + 1;
  const maxCol = Math.max(...cells.map((c) => c.col)) + 1;

  const vbW = 480;
  const vbH = height;

  // Sizing
  const cellSize = Math.min(42, Math.floor((360 - (maxCol - 1) * 4) / maxCol), Math.floor((220 - (maxRow - 1) * 4) / maxRow));
  const cellGap = 4;
  const totalW = maxCol * cellSize + (maxCol - 1) * cellGap;
  const totalH = maxRow * cellSize + (maxRow - 1) * cellGap;

  const startX = (vbW - totalW) / 2;
  const startY = (vbH - totalH) / 2;

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        className="w-full h-auto select-none overflow-visible"
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
      >
        {/* Row Pointer Arrow */}
        {activeRow !== undefined && activeRow >= 0 && activeRow < maxRow && (
          <g transform={`translate(${startX - 24}, ${startY + activeRow * (cellSize + cellGap) + cellSize / 2})`}>
            <text
              x={-8}
              y={0}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={800}
              fill="#FF3B41"
            >
              i = {activeRow + 1}
            </text>
            <path d="M 0 0 L -6 -4 L -6 4 Z" fill="#FF1018" />
          </g>
        )}

        {/* Grid Cells */}
        {cells.map((cell, idx) => {
          const cx = startX + cell.col * (cellSize + cellGap);
          const cy = startY + cell.row * (cellSize + cellGap);

          // Solid pastel and AMOLED styling - zero translucency, maximum contrast
          let fill = "#000000"; // Pitch-black AMOLED
          let stroke = "rgba(255,255,255,0.12)";
          let textColor = "#71717a";
          let opacity = 1;

          if (cell.state === "active") {
            fill = "#FDE047"; // Solid Butter Yellow
            stroke = "#FDE047";
            textColor = "#09090b"; // Crisp Jet Black Text
            opacity = 1;
          } else if (cell.state === "printed") {
            fill = "#86EFAC"; // Solid Mint Green
            stroke = "#86EFAC";
            textColor = "#09090b"; // Crisp Jet Black Text
            opacity = 1;
          } else if (cell.state === "done") {
            fill = "#86EFAC"; // Solid Mint Green
            stroke = "#86EFAC";
            textColor = "#09090b"; // Crisp Jet Black Text
            opacity = 1;
          }

          return (
            <g key={`${cell.row}-${cell.col}-${idx}`} transform={`translate(${cx}, ${cy})`}>
              <rect
                width={cellSize}
                height={cellSize}
                rx={Math.min(8, Math.max(4, cellSize * 0.22))}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.5}
                opacity={opacity}
              />
              {cell.state !== "pending" && cell.state !== "space" && (
                <text
                  x={cellSize / 2}
                  y={cellSize / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={Math.max(13, Math.round(cellSize * 0.48))}
                  fontWeight={800}
                  fill={textColor}
                >
                  {cell.value}
                </text>
              )}
            </g>
          );
        })}

      </svg>
    </div>
  );
}
