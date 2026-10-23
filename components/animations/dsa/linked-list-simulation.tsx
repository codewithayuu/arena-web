"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { ArrowRight, ArrowLeftRight, Plus, Trash2, Search, ArrowDownToLine, RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Pastel Rose
const COLOR_BLUE = "#93C5FD";   // Pastel Sky Blue
const COLOR_YELLOW = "#FDE047"; // Pastel Butter Yellow

const NODE_WIDTH = 76;
const NODE_HEIGHT = 56;
const NODE_GAP = 34;

export function LinkedListSimulation() {
  const [listType, setListType] = useState<"singly" | "doubly">("singly");
  const [values, setValues] = useState<number[]>([10, 20, 30]);
  const [op, setOp] = useState<"prepend" | "append" | "insertAt" | "deleteAt" | "search">("append");
  const [inputVal, setInputVal] = useState("40");
  const [inputIdx, setInputIdx] = useState("1");
  const [highlightIdx, setHighlightIdx] = useState<number | null>(null);
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const isDoubly = listType === "doubly";
  const numNodes = values.length;

  const handlePrepend = useCallback(() => {
    if (values.length >= 7) {
      setStatus("List is full (max 7 nodes for demonstration)");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setValues((prev) => [val, ...prev]);
    setHighlightIdx(0);
    setStatus(`prepend(${val}) added node at head (O(1))`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [values, inputVal]);

  const handleAppend = useCallback(() => {
    if (values.length >= 7) {
      setStatus("List is full (max 7 nodes for demonstration)");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setValues((prev) => [...prev, val]);
    setHighlightIdx(values.length);
    setStatus(
      isDoubly
        ? `append(${val}) added node at tail (O(1) with tail pointer)`
        : `append(${val}) walked to tail and linked new node`
    );
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [values, isDoubly, inputVal]);

  const handleInsertAt = useCallback(() => {
    if (values.length >= 7) {
      setStatus("List is full (max 7 nodes for demonstration)");
      setStatusColor(COLOR_RED);
      return;
    }
    const idx = parseInt(inputIdx, 10);
    const val = parseInt(inputVal, 10) || 5;
    if (isNaN(idx) || idx < 0 || idx > values.length) {
      setStatus(`Index ${inputIdx} out of range (0..${values.length})`);
      setStatusColor(COLOR_RED);
      return;
    }
    setValues((prev) => {
      const next = [...prev];
      next.splice(idx, 0, val);
      return next;
    });
    setHighlightIdx(idx);
    setStatus(`insert(${val}, at=${idx}) traversed to index and updated pointers (O(n))`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [values, inputIdx, inputVal]);

  const handleDeleteAt = useCallback(() => {
    if (values.length === 0) {
      setStatus("List underflow: list is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const idx = parseInt(inputIdx, 10);
    if (isNaN(idx) || idx < 0 || idx >= values.length) {
      setStatus(`Index ${inputIdx} out of range (0..${values.length - 1})`);
      setStatusColor(COLOR_RED);
      return;
    }
    const removedVal = values[idx];
    setValues((prev) => prev.filter((_, i) => i !== idx));
    setHighlightIdx(null);
    setStatus(`deleteAt(${idx}) removed node ${removedVal}`);
    setStatusColor(COLOR_GREEN);
  }, [values, inputIdx]);

  const handleSearch = useCallback(() => {
    if (values.length === 0) {
      setStatus("List is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const target = parseInt(inputVal, 10);
    const idx = values.indexOf(target);
    if (idx !== -1) {
      setHighlightIdx(idx);
      setStatus(`search(${target}) found at index ${idx} (O(n))`);
      setStatusColor(COLOR_CYAN);
    } else {
      setHighlightIdx(null);
      setStatus(`search(${target}): value not found in list`);
      setStatusColor(COLOR_RED);
    }
  }, [values, inputVal]);

  const handleReset = useCallback(() => {
    setValues([10, 20, 30]);
    setHighlightIdx(null);
    setStatus("Reset to default list [10, 20, 30]");
    setStatusColor(COLOR_GREEN);
  }, []);

  const handleExecute = useCallback(() => {
    switch (op) {
      case "prepend":
        return handlePrepend();
      case "append":
        return handleAppend();
      case "insertAt":
        return handleInsertAt();
      case "deleteAt":
        return handleDeleteAt();
      case "search":
        return handleSearch();
    }
  }, [op, handlePrepend, handleAppend, handleInsertAt, handleDeleteAt, handleSearch]);

  const cfg = {
    vbW: 820,
    vbH: 260,
    startX: 40,
    nodeY: 110,
  };

  const getNodeX = (i: number) => cfg.startX + i * (NODE_WIDTH + NODE_GAP);

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header and list type toggle */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Linked List</h3>
            <div className="flex rounded-md border border-border overflow-hidden text-[11px]">
              <button
                onClick={() => setListType("singly")}
                className={`px-2 py-0.5 flex items-center gap-1 transition-colors ${
                  listType === "singly"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ArrowRight className="w-3 h-3" />
                Singly
              </button>
              <button
                onClick={() => setListType("doubly")}
                className={`px-2 py-0.5 flex items-center gap-1 transition-colors ${
                  listType === "doubly"
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <ArrowLeftRight className="w-3 h-3" />
                Doubly
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Nodes linked via memory pointers: {isDoubly ? "both next & prev pointers" : "forward next pointer only"}.
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

      {/* Control bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <div className="flex rounded-md border border-border overflow-hidden">
          <button
            onClick={() => setOp("prepend")}
            className={`px-2.5 py-1 transition-colors ${op === "prepend" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            Prepend
          </button>
          <button
            onClick={() => setOp("append")}
            className={`px-2.5 py-1 transition-colors ${op === "append" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            Append
          </button>
          <button
            onClick={() => setOp("insertAt")}
            className={`px-2.5 py-1 transition-colors ${op === "insertAt" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            Insert At
          </button>
          <button
            onClick={() => setOp("deleteAt")}
            className={`px-2.5 py-1 transition-colors ${op === "deleteAt" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            Delete At
          </button>
          <button
            onClick={() => setOp("search")}
            className={`px-2.5 py-1 transition-colors ${op === "search" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50"}`}
          >
            Search
          </button>
        </div>

        <button
          onClick={handleExecute}
          className="px-3 py-1 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          Run
        </button>

        <div className="flex items-center gap-1.5 ml-auto">
          {op !== "deleteAt" && (
            <>
              <span className="text-muted-foreground">val:</span>
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
              />
            </>
          )}
          {(op === "insertAt" || op === "deleteAt") && (
            <>
              <span className="text-muted-foreground ml-1">idx:</span>
              <input
                type="number"
                value={inputIdx}
                onChange={(e) => setInputIdx(e.target.value)}
                className="w-12 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
              />
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="p-3">
        <div className="mx-auto max-w-[760px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="ll" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Head badge */}
            {numNodes > 0 && (
              <g transform={`translate(${getNodeX(0) + NODE_WIDTH / 2}, ${cfg.nodeY - 32})`}>
                <rect x={-26} y={0} width={52} height={20} rx={10} fill={COLOR_BLUE} />
                <text
                  x={0}
                  y={10.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#09090b"
                  fontSize={10.5}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  HEAD
                </text>
                <line x1={0} y1={20} x2={0} y2={28} stroke={COLOR_BLUE} strokeWidth={2} />
              </g>
            )}

            {/* Tail badge (for doubly or single) */}
            {numNodes > 1 && (
              <g transform={`translate(${getNodeX(numNodes - 1) + NODE_WIDTH / 2}, ${cfg.nodeY - 32})`}>
                <rect x={-24} y={0} width={48} height={20} rx={10} fill={COLOR_GREEN} />
                <text
                  x={0}
                  y={10.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#09090b"
                  fontSize={10.5}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  TAIL
                </text>
                <line x1={0} y1={20} x2={0} y2={28} stroke={COLOR_GREEN} strokeWidth={2} />
              </g>
            )}

            {/* Nodes and Links */}
            {values.map((v, i) => {
              const x = getNodeX(i);
              const isHigh = highlightIdx === i;
              const nodeBg = isHigh ? COLOR_YELLOW : "#000000";
              const border = isHigh ? COLOR_YELLOW : i === 0 ? COLOR_CYAN : "rgba(255,255,255,0.18)";
              const textColor = isHigh ? "#09090b" : "#FFFFFF";

              return (
                <g key={`node-${i}`}>
                  {/* Node Box */}
                  <rect
                    x={x}
                    y={cfg.nodeY}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx={10}
                    fill={nodeBg}
                    stroke={border}
                    strokeWidth={isHigh ? 2.5 : 1.5}
                  />

                  {/* Node inner divider */}
                  <line
                    x1={x + NODE_WIDTH - 24}
                    y1={cfg.nodeY}
                    x2={x + NODE_WIDTH - 24}
                    y2={cfg.nodeY + NODE_HEIGHT}
                    stroke={isHigh ? "rgba(9,9,11,0.2)" : "rgba(255,255,255,0.15)"}
                    strokeWidth={1}
                  />

                  {/* Pointer dot */}
                  <circle
                    cx={x + NODE_WIDTH - 12}
                    cy={cfg.nodeY + NODE_HEIGHT / 2}
                    r={3.5}
                    fill={isHigh ? "rgba(9,9,11,0.6)" : "rgba(255,255,255,0.5)"}
                  />

                  {/* Node Value */}
                  <text
                    x={x + (NODE_WIDTH - 24) / 2}
                    y={cfg.nodeY + NODE_HEIGHT / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize={17}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {v}
                  </text>

                  {/* Index label below */}
                  <text
                    x={x + NODE_WIDTH / 2}
                    y={cfg.nodeY + NODE_HEIGHT + 16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#a1a1aa"
                    fontSize={10.5}
                    fontWeight={600}
                    fontFamily={MONO_FONT}
                  >
                    [{i}]
                  </text>

                  {/* Forward arrow to next node */}
                  {i < numNodes - 1 && (
                    <g>
                      <line
                        x1={x + NODE_WIDTH}
                        y1={isDoubly ? cfg.nodeY + NODE_HEIGHT / 2 - 5 : cfg.nodeY + NODE_HEIGHT / 2}
                        x2={x + NODE_WIDTH + NODE_GAP - 6}
                        y2={isDoubly ? cfg.nodeY + NODE_HEIGHT / 2 - 5 : cfg.nodeY + NODE_HEIGHT / 2}
                        stroke="rgba(161,161,170,0.55)"
                        strokeWidth={2}
                      />
                      <polygon
                        points={`${x + NODE_WIDTH + NODE_GAP},${
                          isDoubly ? cfg.nodeY + NODE_HEIGHT / 2 - 5 : cfg.nodeY + NODE_HEIGHT / 2
                        } ${x + NODE_WIDTH + NODE_GAP - 7},${
                          isDoubly ? cfg.nodeY + NODE_HEIGHT / 2 - 9 : cfg.nodeY + NODE_HEIGHT / 2 - 4
                        } ${x + NODE_WIDTH + NODE_GAP - 7},${
                          isDoubly ? cfg.nodeY + NODE_HEIGHT / 2 - 1 : cfg.nodeY + NODE_HEIGHT / 2 + 4
                        }`}
                        fill="rgba(161,161,170,0.55)"
                      />
                    </g>
                  )}

                  {/* Backward arrow for Doubly */}
                  {isDoubly && i < numNodes - 1 && (
                    <g>
                      <line
                        x1={x + NODE_WIDTH + 6}
                        y1={cfg.nodeY + NODE_HEIGHT / 2 + 5}
                        x2={x + NODE_WIDTH + NODE_GAP}
                        y2={cfg.nodeY + NODE_HEIGHT / 2 + 5}
                        stroke="rgba(161,161,170,0.55)"
                        strokeWidth={2}
                      />
                      <polygon
                        points={`${x + NODE_WIDTH},${cfg.nodeY + NODE_HEIGHT / 2 + 5} ${
                          x + NODE_WIDTH + 7
                        },${cfg.nodeY + NODE_HEIGHT / 2 + 1} ${x + NODE_WIDTH + 7},${
                          cfg.nodeY + NODE_HEIGHT / 2 + 9
                        }`}
                        fill="rgba(161,161,170,0.55)"
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* NULL Terminator */}
            {numNodes > 0 && (
              <g transform={`translate(${getNodeX(numNodes - 1) + NODE_WIDTH + NODE_GAP}, ${cfg.nodeY})`}>
                <line
                  x1={-NODE_GAP + 2}
                  y1={NODE_HEIGHT / 2}
                  x2={-4}
                  y2={NODE_HEIGHT / 2}
                  stroke="rgba(161,161,170,0.55)"
                  strokeWidth={2}
                />
                <rect
                  x={0}
                  y={NODE_HEIGHT / 2 - 16}
                  width={46}
                  height={32}
                  rx={7}
                  fill="#000000"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth={1.5}
                />
                <text
                  x={23}
                  y={NODE_HEIGHT / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FFFFFF"
                  fontSize={11.5}
                  fontWeight={800}
                  fontFamily={MONO_FONT}
                >
                  NULL
                </text>
              </g>
            )}

            {/* Status note */}
            <text
              x={cfg.vbW / 2}
              y={cfg.vbH - 24}
              textAnchor="middle"
              dominantBaseline="central"
              fill={statusColor}
              fontSize={13.5}
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
