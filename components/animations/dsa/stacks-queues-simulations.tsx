"use client";

import React, { useState, useMemo, useCallback } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { RotateCcw } from "lucide-react";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_BLUE = "#93C5FD";   // Solid Pastel Sky Blue

// ==========================================
// 1. STACK SIMULATION (LIFO)
// ==========================================
export function StackSimulation() {
  const [items, setItems] = useState<number[]>([10, 20, 30]);
  const [inputVal, setInputVal] = useState("40");
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const handlePush = useCallback(() => {
    if (items.length >= 6) {
      setStatus("Stack Overflow: demo max capacity 6");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setItems((prev) => [...prev, val]);
    setStatus(`push(${val}) onto the top of the stack (O(1))`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [items, inputVal]);

  const handlePop = useCallback(() => {
    if (items.length === 0) {
      setStatus("Stack Underflow: stack is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const popped = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    setStatus(`pop() removed ${popped} from the top (O(1))`);
    setStatusColor(COLOR_GREEN);
  }, [items]);

  const handlePeek = useCallback(() => {
    if (items.length === 0) {
      setStatus("Stack is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const top = items[items.length - 1];
    setStatus(`peek() → top element is ${top} (O(1))`);
    setStatusColor(COLOR_CYAN);
  }, [items]);

  const handleReset = useCallback(() => {
    setItems([10, 20, 30]);
    setStatus("Reset stack to [10, 20, 30]");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 460,
    vbH: 340,
    stackW: 130,
    stackH: 260,
    itemH: 38,
    bottomY: 280,
  };

  const stackX = (cfg.vbW - cfg.stackW) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Stack (LIFO)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Last-In, First-Out: elements are pushed and popped exclusively from the top.
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
          onClick={handlePush}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          push({inputVal})
        </button>
        <button
          onClick={handlePop}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          pop()
        </button>
        <button
          onClick={handlePeek}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          peek()
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">val:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[500px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="stk" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Stack Tube Outline */}
            <path
              d={`M ${stackX} ${cfg.bottomY - cfg.stackH} L ${stackX} ${cfg.bottomY} L ${stackX + cfg.stackW} ${
                cfg.bottomY
              } L ${stackX + cfg.stackW} ${cfg.bottomY - cfg.stackH}`}
              fill="none"
              stroke="rgba(161,161,170,0.35)"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Stack Elements */}
            {items.map((val, i) => {
              const itemY = cfg.bottomY - (i + 1) * (cfg.itemH + 6) + 2;
              const isTop = i === items.length - 1;

              return (
                <g key={`item-${i}`}>
                  <rect
                    x={stackX + 6}
                    y={itemY}
                    width={cfg.stackW - 12}
                    height={cfg.itemH}
                    rx={7}
                    fill={isTop ? COLOR_YELLOW : "#000000"}
                    stroke={isTop ? COLOR_YELLOW : "rgba(255,255,255,0.2)"}
                    strokeWidth={isTop ? 2 : 1.5}
                  />
                  <text
                    x={stackX + cfg.stackW / 2}
                    y={itemY + cfg.itemH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isTop ? "#09090b" : "#FFFFFF"}
                    fontSize={15}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
                  </text>

                  {/* TOP pointer indicator */}
                  {isTop && (
                    <g transform={`translate(${stackX + cfg.stackW + 16}, ${itemY + cfg.itemH / 2})`}>
                      <path d="M 0 0 L 10 -5 L 10 5 Z" fill={COLOR_YELLOW} />
                      <rect x={12} y={-10} width={42} height={20} rx={10} fill={COLOR_YELLOW} />
                      <text
                        x={33}
                        y={0.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#09090b"
                        fontSize={10.5}
                        fontWeight={800}
                        fontFamily={MONO_FONT}
                      >
                        TOP
                      </text>
                    </g>
                  )}
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

// ==========================================
// 2. QUEUE SIMULATION (FIFO)
// ==========================================
export function QueueSimulation() {
  const [items, setItems] = useState<number[]>([10, 20, 30]);
  const [inputVal, setInputVal] = useState("40");
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const handleEnqueue = useCallback(() => {
    if (items.length >= 6) {
      setStatus("Queue Full: demo max capacity 6");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setItems((prev) => [...prev, val]);
    setStatus(`enqueue(${val}) added to the back (O(1))`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [items, inputVal]);

  const handleDequeue = useCallback(() => {
    if (items.length === 0) {
      setStatus("Queue Underflow: queue is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = items[0];
    setItems((prev) => prev.slice(1));
    setStatus(`dequeue() removed ${val} from the front (O(1))`);
    setStatusColor(COLOR_GREEN);
  }, [items]);

  const handlePeek = useCallback(() => {
    if (items.length === 0) {
      setStatus("Queue is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    setStatus(`peek() → front element is ${items[0]} (O(1))`);
    setStatusColor(COLOR_CYAN);
  }, [items]);

  const handleReset = useCallback(() => {
    setItems([10, 20, 30]);
    setStatus("Reset queue to [10, 20, 30]");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 640,
    vbH: 220,
    itemW: 64,
    itemH: 48,
    gap: 12,
    startY: 85,
  };

  const totalW = items.length * cfg.itemW + Math.max(0, items.length - 1) * cfg.gap;
  const startX = (cfg.vbW - totalW) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Queue (FIFO)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            First-In, First-Out: enqueue at the rear, dequeue from the front.
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
          onClick={handleEnqueue}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          enqueue({inputVal})
        </button>
        <button
          onClick={handleDequeue}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          dequeue()
        </button>
        <button
          onClick={handlePeek}
          className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          peek()
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">val:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[620px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="que" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Queue tube bounds */}
            <line x1={40} y1={cfg.startY - 8} x2={cfg.vbW - 40} y2={cfg.startY - 8} stroke="rgba(161,161,170,0.3)" strokeWidth={2} />
            <line
              x1={40}
              y1={cfg.startY + cfg.itemH + 8}
              x2={cfg.vbW - 40}
              y2={cfg.startY + cfg.itemH + 8}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />

            {/* Direction labels */}
            <text x={50} y={cfg.startY + cfg.itemH / 2} dominantBaseline="central" fill="#71717a" fontSize={11} fontWeight={700} fontFamily={MONO_FONT}>
              FRONT ←
            </text>
            <text
              x={cfg.vbW - 50}
              y={cfg.startY + cfg.itemH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="#71717a"
              fontSize={11}
              fontWeight={700}
              fontFamily={MONO_FONT}
            >
              ← REAR
            </text>

            {/* Queue items */}
            {items.map((val, i) => {
              const x = startX + i * (cfg.itemW + cfg.gap);
              const isFront = i === 0;
              const isRear = i === items.length - 1;

              return (
                <g key={`q-${i}`}>
                  <rect
                    x={x}
                    y={cfg.startY}
                    width={cfg.itemW}
                    height={cfg.itemH}
                    rx={8}
                    fill={isFront ? COLOR_YELLOW : isRear ? COLOR_GREEN : "#000000"}
                    stroke={isFront ? COLOR_YELLOW : isRear ? COLOR_GREEN : "rgba(255,255,255,0.2)"}
                    strokeWidth={isFront || isRear ? 2 : 1.5}
                  />
                  <text
                    x={x + cfg.itemW / 2}
                    y={cfg.startY + cfg.itemH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isFront || isRear ? "#09090b" : "#FFFFFF"}
                    fontSize={16}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
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
// 3. DEQUE SIMULATION (Double-Ended Queue)
// ==========================================
export function DequeSimulation() {
  const [items, setItems] = useState<number[]>([20, 30]);
  const [inputVal, setInputVal] = useState("10");
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const handlePushFront = useCallback(() => {
    if (items.length >= 6) {
      setStatus("Deque Full: max capacity 6");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setItems((prev) => [val, ...prev]);
    setStatus(`pushFront(${val}) at the front`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [items, inputVal]);

  const handlePushBack = useCallback(() => {
    if (items.length >= 6) {
      setStatus("Deque Full: max capacity 6");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    setItems((prev) => [...prev, val]);
    setStatus(`pushBack(${val}) at the back`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [items, inputVal]);

  const handlePopFront = useCallback(() => {
    if (items.length === 0) {
      setStatus("Deque is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = items[0];
    setItems((prev) => prev.slice(1));
    setStatus(`popFront() removed ${val}`);
    setStatusColor(COLOR_GREEN);
  }, [items]);

  const handlePopBack = useCallback(() => {
    if (items.length === 0) {
      setStatus("Deque is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = items[items.length - 1];
    setItems((prev) => prev.slice(0, -1));
    setStatus(`popBack() removed ${val}`);
    setStatusColor(COLOR_GREEN);
  }, [items]);

  const handleReset = useCallback(() => {
    setItems([20, 30]);
    setStatus("Reset deque to [20, 30]");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 640,
    vbH: 220,
    itemW: 64,
    itemH: 48,
    gap: 12,
    startY: 85,
  };

  const totalW = items.length * cfg.itemW + Math.max(0, items.length - 1) * cfg.gap;
  const startX = (cfg.vbW - totalW) / 2;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Deque (Double-Ended Queue)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Insert and remove from both ends in O(1) time.
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
          onClick={handlePushFront}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          pushFront({inputVal})
        </button>
        <button
          onClick={handlePushBack}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          pushBack({inputVal})
        </button>
        <button
          onClick={handlePopFront}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          popFront()
        </button>
        <button
          onClick={handlePopBack}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          popBack()
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">val:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[620px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="deq" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            <line x1={40} y1={cfg.startY - 8} x2={cfg.vbW - 40} y2={cfg.startY - 8} stroke="rgba(161,161,170,0.3)" strokeWidth={2} />
            <line
              x1={40}
              y1={cfg.startY + cfg.itemH + 8}
              x2={cfg.vbW - 40}
              y2={cfg.startY + cfg.itemH + 8}
              stroke="rgba(161,161,170,0.3)"
              strokeWidth={2}
            />

            <text x={50} y={cfg.startY + cfg.itemH / 2} dominantBaseline="central" fill="#71717a" fontSize={11} fontWeight={700} fontFamily={MONO_FONT}>
              FRONT ⇄
            </text>
            <text
              x={cfg.vbW - 50}
              y={cfg.startY + cfg.itemH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="#71717a"
              fontSize={11}
              fontWeight={700}
              fontFamily={MONO_FONT}
            >
              ⇄ BACK
            </text>

            {items.map((val, i) => {
              const x = startX + i * (cfg.itemW + cfg.gap);
              const isFront = i === 0;
              const isBack = i === items.length - 1;

              return (
                <g key={`d-${i}`}>
                  <rect
                    x={x}
                    y={cfg.startY}
                    width={cfg.itemW}
                    height={cfg.itemH}
                    rx={8}
                    fill={isFront ? COLOR_YELLOW : isBack ? COLOR_GREEN : "#000000"}
                    stroke={isFront ? COLOR_YELLOW : isBack ? COLOR_GREEN : "rgba(255,255,255,0.2)"}
                    strokeWidth={isFront || isBack ? 2 : 1.5}
                  />
                  <text
                    x={x + cfg.itemW / 2}
                    y={cfg.startY + cfg.itemH / 2 + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isFront || isBack ? "#09090b" : "#FFFFFF"}
                    fontSize={16}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

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
// 4. CIRCULAR QUEUE SIMULATION (Modular Ring)
// ==========================================
export function CircularQueueSimulation() {
  const capacity = 8;
  const [backing, setBacking] = useState<Array<number | null>>([10, 20, 30, null, null, null, null, null]);
  const [front, setFront] = useState(0);
  const [count, setCount] = useState(3);
  const [inputVal, setInputVal] = useState("40");
  const [status, setStatus] = useState("Idle, choose an operation");
  const [statusColor, setStatusColor] = useState(COLOR_GREEN);

  const handleEnqueue = useCallback(() => {
    if (count >= capacity) {
      setStatus("Circular Queue is full (count = capacity)");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = parseInt(inputVal, 10) || 5;
    const rear = (front + count) % capacity;
    setBacking((prev) => {
      const next = [...prev];
      next[rear] = val;
      return next;
    });
    setCount((c) => c + 1);
    setStatus(`enqueue(${val}) at index ${rear} (rear = (front + count) % 8)`);
    setStatusColor(COLOR_GREEN);
    setInputVal(String(Math.floor(Math.random() * 90) + 10));
  }, [count, capacity, front, inputVal]);

  const handleDequeue = useCallback(() => {
    if (count === 0) {
      setStatus("Circular Queue is empty");
      setStatusColor(COLOR_RED);
      return;
    }
    const val = backing[front];
    setBacking((prev) => {
      const next = [...prev];
      next[front] = null;
      return next;
    });
    setFront((f) => (f + 1) % capacity);
    setCount((c) => c - 1);
    setStatus(`dequeue() removed ${val} from index ${front}, front moves to ${(front + 1) % capacity}`);
    setStatusColor(COLOR_GREEN);
  }, [count, backing, front, capacity]);

  const handleReset = useCallback(() => {
    setBacking([10, 20, 30, null, null, null, null, null]);
    setFront(0);
    setCount(3);
    setStatus("Reset circular queue to default");
    setStatusColor(COLOR_GREEN);
  }, []);

  const cfg = {
    vbW: 480,
    vbH: 340,
    cx: 240,
    cy: 165,
    r: 105,
    nodeR: 20,
  };

  const getAngle = (i: number) => -Math.PI / 2 + (2 * i * Math.PI) / capacity;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Circular Queue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fixed ring buffer where rear and front wrap around modulo capacity without array shifting.
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
          onClick={handleEnqueue}
          className="px-3 py-1.5 rounded bg-[#F87157] hover:bg-[#E24A2B] text-white font-medium transition-colors"
        >
          enqueue({inputVal})
        </button>
        <button
          onClick={handleDequeue}
          className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
        >
          dequeue()
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-muted-foreground">val:</span>
          <input
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-14 px-1.5 py-0.5 rounded border border-border bg-muted text-foreground text-xs text-center"
          />
        </div>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[480px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="cq" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN]]} />

            {/* Circular Ring Path */}
            <circle cx={cfg.cx} cy={cfg.cy} r={cfg.r} fill="none" stroke="rgba(161,161,170,0.25)" strokeWidth={4} />

            {/* Center Info */}
            <text x={cfg.cx} y={cfg.cy - 12} textAnchor="middle" fill="#a1a1aa" fontSize={11} fontWeight={700} fontFamily={MONO_FONT}>
              count: {count} / {capacity}
            </text>
            <text x={cfg.cx} y={cfg.cy + 10} textAnchor="middle" fill={COLOR_CYAN} fontSize={12} fontWeight={800} fontFamily={MONO_FONT}>
              front: {front}
            </text>

            {/* Slots */}
            {Array.from({ length: capacity }).map((_, i) => {
              const angle = getAngle(i);
              const sx = cfg.cx + cfg.r * Math.cos(angle);
              const sy = cfg.cy + cfg.r * Math.sin(angle);
              const val = backing[i];
              const isFront = i === front && count > 0;
              const rearIdx = (front + count - 1 + capacity) % capacity;
              const isRear = i === rearIdx && count > 0;

              return (
                <g key={`slot-${i}`}>
                  <circle
                    cx={sx}
                    cy={sy}
                    r={cfg.nodeR}
                    fill={isFront ? COLOR_YELLOW : isRear ? COLOR_GREEN : val != null ? "#000000" : "#09090b"}
                    stroke={isFront ? COLOR_YELLOW : isRear ? COLOR_GREEN : "rgba(255,255,255,0.2)"}
                    strokeWidth={isFront || isRear ? 2.5 : 1.5}
                  />
                  {val != null && (
                    <text
                      x={sx}
                      y={sy + 1}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isFront || isRear ? "#09090b" : "#FFFFFF"}
                      fontSize={13.5}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {val}
                    </text>
                  )}
                  {/* Slot index outside */}
                  <text
                    x={sx + (cfg.nodeR + 13) * Math.cos(angle)}
                    y={sy + (cfg.nodeR + 13) * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#71717a"
                    fontSize={10.5}
                    fontWeight={600}
                    fontFamily={MONO_FONT}
                  >
                    {i}
                  </text>
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

// ==========================================
// 5. MONOTONIC STACK SIMULATION (Next Greater Element)
// ==========================================
const MONO_STACK_ARR = [2, 1, 4, 3, 5];

interface MonoStackFrame {
  i: number;
  stack: number[];
  nge: Array<number | null>;
  arrStates: string[];
  note: string;
  resultText?: string;
}

export function MonotonicStackSimulation() {
  const arr = MONO_STACK_ARR;
  const len = arr.length;

  const initialFrame = useMemo<MonoStackFrame>(
    () => ({
      i: -1,
      stack: [],
      nge: Array(len).fill(null),
      arrStates: Array(len).fill("idle"),
      note: "Find the Next Greater Element for each index using a decreasing monotonic stack.",
      resultText: "",
    }),
    [len]
  );

  const player = useSimulationPlayback<MonoStackFrame>(560, initialFrame);

  const frames = useMemo(() => {
    const list: MonoStackFrame[] = [];
    const stack: number[] = [];
    const nge: Array<number | null> = Array(len).fill(null);

    const makeStates = (curI: number) => {
      const s: string[] = arr.map((_, idx) => (nge[idx] != null ? "good" : "idle"));
      for (const idx of stack) s[idx] = "best";
      if (curI >= 0) s[curI] = "active";
      return s;
    };

    for (let t = 0; t < len; t++) {
      list.push({
        i: t,
        stack: [...stack],
        nge: [...nge],
        arrStates: makeStates(t),
        note: `Look at index ${t} (value ${arr[t]})`,
      });

      while (stack.length > 0 && arr[t] > arr[stack[stack.length - 1]]) {
        const popped = stack.pop()!;
        nge[popped] = arr[t];
        list.push({
          i: t,
          stack: [...stack],
          nge: [...nge],
          arrStates: makeStates(t),
          note: `${arr[t]} > ${arr[popped]}, so next greater of index ${popped} is ${arr[t]}! Pop it.`,
        });
      }

      stack.push(t);
      list.push({
        i: t,
        stack: [...stack],
        nge: [...nge],
        arrStates: makeStates(t),
        note: `Push index ${t}; stack stays strictly decreasing.`,
      });
    }

    for (const remaining of stack) {
      if (nge[remaining] == null) nge[remaining] = -1;
    }

    list.push({
      i: -1,
      stack: [],
      nge: [...nge],
      arrStates: arr.map((_, idx) => (nge[idx]! >= 0 ? "good" : "bad")),
      note: "Leftover stack elements have no greater element to their right; mark them -1.",
      resultText: "Next greater element found for every index!",
    });

    return list;
  }, [arr, len]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(360, Math.min(640, Math.round(9000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  const cfg = {
    vbW: 460,
    vbH: 240,
    plotX: 68,
    cellW: 48,
    cellH: 42,
    gap: 8,
  };

  const getCellX = (i: number) => cfg.plotX + i * (cfg.cellW + cfg.gap);
  const curView = player.view;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Monotonic Stack</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A stack kept in decreasing order so each element is processed in O(1) amortized time. Shown with Next Greater Element.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={player.isPlaying}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[500px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="mst" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["yellow", COLOR_YELLOW]]} />

            {/* Row Labels */}
            <text x={8} y={48} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              array
            </text>
            <text x={8} y={116} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              stack
            </text>
            <text x={8} y={184} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              answer
            </text>

            {/* Array Row */}
            {arr.map((val, idx) => {
              const x = getCellX(idx);
              const st = curView.arrStates[idx] ?? "idle";
              const isCur = idx === curView.i;
              const fill = isCur ? COLOR_CYAN : st === "good" ? COLOR_GREEN : st === "best" ? COLOR_YELLOW : "#27272a";

              return (
                <g key={`arr-${idx}`}>
                  <rect
                    x={x}
                    y={28}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={fill}
                    stroke={isCur || st !== "idle" ? fill : "rgba(161,161,170,0.4)"}
                    strokeWidth={isCur ? 2 : 1.25}
                    filter={isCur ? "url(#mst-glow-cyan)" : undefined}
                  />
                  <text
                    x={x + cfg.cellW / 2}
                    y={28 + cfg.cellH / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isCur || st !== "idle" ? "#18181b" : "#f4f4f5"}
                    fontSize={15}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
                  </text>
                  <text
                    x={x + cfg.cellW / 2}
                    y={16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#71717a"
                    fontSize={9.5}
                    fontWeight={700}
                    fontFamily={MONO_FONT}
                  >
                    {idx}
                  </text>
                </g>
              );
            })}

            {/* Stack Row */}
            {arr.map((_, idx) => {
              const x = getCellX(idx);
              const stackVal = idx < curView.stack.length ? arr[curView.stack[idx]] : null;

              return (
                <g key={`stk-${idx}`}>
                  <rect
                    x={x}
                    y={96}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={stackVal != null ? COLOR_YELLOW : "none"}
                    stroke={stackVal != null ? COLOR_YELLOW : "rgba(255,255,255,0.2)"}
                    strokeWidth={stackVal != null ? 1.5 : 1}
                    strokeDasharray={stackVal == null ? "4 4" : undefined}
                  />
                  {stackVal != null && (
                    <text
                      x={x + cfg.cellW / 2}
                      y={96 + cfg.cellH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#09090b"
                      fontSize={15}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {stackVal}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Answer NGE Row */}
            {arr.map((_, idx) => {
              const x = getCellX(idx);
              const ansVal = curView.nge[idx];

              return (
                <g key={`ans-${idx}`}>
                  <rect
                    x={x}
                    y={164}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={ansVal != null ? (ansVal >= 0 ? COLOR_GREEN : COLOR_RED) : "none"}
                    stroke={ansVal != null ? (ansVal >= 0 ? COLOR_GREEN : COLOR_RED) : "rgba(255,255,255,0.2)"}
                    strokeWidth={ansVal != null ? 1.5 : 1}
                    strokeDasharray={ansVal == null ? "4 4" : undefined}
                  />
                  {ansVal != null && (
                    <text
                      x={x + cfg.cellW / 2}
                      y={164 + cfg.cellH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#09090b"
                      fontSize={15}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {ansVal}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.resultText || curView.note} />
    </div>
  );
}

// ==========================================
// 6. MONOTONIC QUEUE SIMULATION (Sliding Window Maximum)
// ==========================================
const MONO_QUEUE_ARR = [8, 5, 7, 2, 4, 9, 1, 3];

interface MonoQueueFrame {
  i: number;
  deque: number[];
  windowLo: number;
  windowHi: number;
  arrStates: string[];
  maxima: Array<{ index: number; value: number }>;
  note: string;
  resultText?: string;
}

export function MonotonicQueueSimulation() {
  const arr = MONO_QUEUE_ARR;
  const len = arr.length;
  const k = 3;

  const initialFrame = useMemo<MonoQueueFrame>(
    () => ({
      i: -1,
      deque: [],
      windowLo: 0,
      windowHi: 2,
      arrStates: Array(len).fill("idle"),
      maxima: [],
      note: "Sliding window maximum of size 3 maintained in O(1) via monotonic deque.",
      resultText: "",
    }),
    [len]
  );

  const player = useSimulationPlayback<MonoQueueFrame>(560, initialFrame);

  const frames = useMemo(() => {
    const list: MonoQueueFrame[] = [];
    const deque: number[] = [];
    const maxima: Array<{ index: number; value: number }> = [];

    const makeStates = (curI: number) => {
      const s = arr.map(() => "idle");
      for (const idx of deque) s[idx] = "best";
      if (deque.length > 0) s[deque[0]] = "good";
      if (curI >= 0) s[curI] = "active";
      return s;
    };

    for (let t = 0; t < len; t++) {
      const wLo = Math.max(0, t - k + 1);
      const wHi = t;

      list.push({
        i: t,
        deque: [...deque],
        windowLo: wLo,
        windowHi: wHi,
        arrStates: makeStates(t),
        maxima: [...maxima],
        note: `Slide to index ${t} (value ${arr[t]})`,
      });

      while (deque.length > 0 && arr[deque[deque.length - 1]] <= arr[t]) {
        const popped = deque.pop()!;
        list.push({
          i: t,
          deque: [...deque],
          windowLo: wLo,
          windowHi: wHi,
          arrStates: makeStates(t),
          maxima: [...maxima],
          note: `${arr[t]} >= ${arr[popped]}, pop index ${popped} from the back of deque`,
        });
      }

      deque.push(t);
      list.push({
        i: t,
        deque: [...deque],
        windowLo: wLo,
        windowHi: wHi,
        arrStates: makeStates(t),
        maxima: [...maxima],
        note: `Push index ${t} to the back of deque`,
      });

      if (deque[0] <= t - k) {
        const expired = deque.shift()!;
        list.push({
          i: t,
          deque: [...deque],
          windowLo: wLo,
          windowHi: wHi,
          arrStates: makeStates(t),
          maxima: [...maxima],
          note: `Index ${expired} fell out of window, pop it from front`,
        });
      }

      if (t >= k - 1) {
        const maxVal = arr[deque[0]];
        maxima.push({ index: t, value: maxVal });
        list.push({
          i: t,
          deque: [...deque],
          windowLo: wLo,
          windowHi: wHi,
          arrStates: makeStates(t),
          maxima: [...maxima],
          note: `Window [${t - k + 1}..${t}] maximum is the front: ${maxVal}`,
        });
      }
    }

    list.push({
      i: -1,
      deque: [],
      windowLo: 0,
      windowHi: len - 1,
      arrStates: arr.map(() => "idle"),
      maxima: [...maxima],
      note: "Every sliding window maximum found in a single pass!",
      resultText: `Window Maxima: [${maxima.map((m) => m.value).join(", ")}]`,
    });

    return list;
  }, [arr, len]);

  const handleRun = useCallback(() => {
    const stepMs = Math.max(340, Math.min(620, Math.round(11000 / frames.length)));
    player.play(frames, stepMs);
  }, [frames, player]);

  const handleReset = useCallback(() => {
    player.stop();
  }, [player]);

  const cfg = {
    vbW: 540,
    vbH: 240,
    plotX: 68,
    cellW: 46,
    cellH: 42,
    gap: 8,
  };

  const getCellX = (i: number) => cfg.plotX + i * (cfg.cellW + cfg.gap);
  const curView = player.view;

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium">Monotonic Queue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            A double-ended queue kept in sorted order so each sliding window maximum is available in O(1) time.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={player.isPlaying}
          aria-label="Reset"
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3">
        <div className="mx-auto max-w-[560px]">
          <svg
            viewBox={`0 0 ${cfg.vbW} ${cfg.vbH}`}
            style={{ display: "block", width: "100%", height: "auto" }}
            textRendering="geometricPrecision"
          >
            <GlowDefs prefix="mq" colors={[["cyan", COLOR_CYAN], ["green", COLOR_GREEN], ["yellow", COLOR_YELLOW]]} />

            <text x={8} y={48} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              array
            </text>
            <text x={8} y={116} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              deque
            </text>
            <text x={8} y={184} dominantBaseline="central" fill="#a1a1aa" fontFamily={MONO_FONT} fontWeight={700} fontSize={11}>
              maxima
            </text>

            {/* Window Highlight box */}
            {curView.i >= 0 && (
              <rect
                x={getCellX(curView.windowLo) - 4}
                y={20}
                width={(curView.windowHi - curView.windowLo) * (cfg.cellW + cfg.gap) + cfg.cellW + 8}
                height={58}
                rx={9}
                fill={COLOR_CYAN}
                opacity={0.1}
                stroke={COLOR_CYAN}
                strokeWidth={1.5}
                strokeOpacity={0.45}
              />
            )}

            {/* Array Cells */}
            {arr.map((val, idx) => {
              const x = getCellX(idx);
              const st = curView.arrStates[idx] ?? "idle";
              const isCur = idx === curView.i;
              const fill = isCur ? COLOR_CYAN : st === "good" ? COLOR_GREEN : st === "best" ? COLOR_YELLOW : "#27272a";

              return (
                <g key={`arr-${idx}`}>
                  <rect
                    x={x}
                    y={28}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={fill}
                    stroke={isCur || st !== "idle" ? fill : "rgba(161,161,170,0.4)"}
                    strokeWidth={isCur ? 2 : 1.25}
                    filter={isCur ? "url(#mq-glow-cyan)" : undefined}
                  />
                  <text
                    x={x + cfg.cellW / 2}
                    y={28 + cfg.cellH / 2 + 0.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isCur || st !== "idle" ? "#18181b" : "#f4f4f5"}
                    fontSize={15}
                    fontWeight={800}
                    fontFamily={MONO_FONT}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Deque Cells */}
            {arr.map((_, idx) => {
              const x = getCellX(idx);
              const dequeVal = idx < curView.deque.length ? arr[curView.deque[idx]] : null;

              return (
                <g key={`deq-${idx}`}>
                  <rect
                    x={x}
                    y={96}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={dequeVal != null ? "#27272a" : "none"}
                    stroke={dequeVal != null ? (idx === 0 ? COLOR_GREEN : COLOR_YELLOW) : "rgba(161,161,170,0.3)"}
                    strokeWidth={dequeVal != null ? 1.5 : 1}
                    strokeDasharray={dequeVal == null ? "4 4" : undefined}
                  />
                  {dequeVal != null && (
                    <text
                      x={x + cfg.cellW / 2}
                      y={96 + cfg.cellH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={idx === 0 ? COLOR_GREEN : COLOR_YELLOW}
                      fontSize={15}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {dequeVal}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Maxima Output */}
            {arr.map((_, idx) => {
              const x = getCellX(idx);
              const maxItem = curView.maxima.find((m) => m.index === idx);

              return (
                <g key={`max-${idx}`}>
                  <rect
                    x={x}
                    y={164}
                    width={cfg.cellW}
                    height={cfg.cellH}
                    rx={7}
                    fill={maxItem ? COLOR_GREEN : "none"}
                    stroke={maxItem ? COLOR_GREEN : "rgba(161,161,170,0.3)"}
                    strokeWidth={maxItem ? 1.5 : 1}
                    strokeDasharray={maxItem ? undefined : "4 4"}
                  />
                  {maxItem && (
                    <text
                      x={x + cfg.cellW / 2}
                      y={164 + cfg.cellH / 2 + 0.5}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#18181b"
                      fontSize={15}
                      fontWeight={800}
                      fontFamily={MONO_FONT}
                    >
                      {maxItem.value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <SimulationPlayerBar player={player} onRun={handleRun} status={curView.resultText || curView.note} />
    </div>
  );
}
