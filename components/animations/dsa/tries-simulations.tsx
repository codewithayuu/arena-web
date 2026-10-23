"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlowDefs } from "../shared/simulation-defs";
import { useSimulationPlayback } from "../shared/use-simulation-playback";
import { SimulationPlayerBar } from "../shared/simulation-player-bar";
import { RotateCcw, Plus, Search, Type, CheckCircle, XCircle } from "lucide-react";
import { SimpleTooltip } from "@/components/animate-ui/tooltip";

const MONO_FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const COLOR_CYAN = "#93C5FD";   // Solid Pastel Sky Blue
const COLOR_GREEN = "#86EFAC";  // Solid Pastel Mint Green
const COLOR_RED = "#FCA5A5";    // Solid Pastel Rose/Red
const COLOR_YELLOW = "#FDE047"; // Solid Pastel Butter Yellow
const COLOR_TEAL = "#86EFAC";   // Solid Pastel Mint Green

// ==========================================
// 1. TRIE (PREFIX TREE) SIMULATION
// ==========================================

interface TrieNodeData {
  char: string;
  isEndOfWord: boolean;
  children: Map<string, TrieNodeData>;
}

function makeTrieNode(char = ""): TrieNodeData {
  return {
    char,
    isEndOfWord: false,
    children: new Map(),
  };
}

const INITIAL_TRIE_WORDS = ["cat", "car", "card", "care", "dog"];

export function TrieSimulation() {
  const [root, setRoot] = useState<TrieNodeData>(() => makeTrieNode());
  const [words, setWords] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [activeOp, setActiveOp] = useState<"insert" | "search" | "prefix">("insert");
  const [feedback, setFeedback] = useState<{
    success: boolean;
    message: string;
    matches?: string[];
  } | null>(null);
  const [highlightedKeys, setHighlightedKeys] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setHighlightedKeys(new Set());
  };

  const wait = (ms: number) =>
    new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      timerRef.current.push(t);
    });

  // Initialize trie with default words
  const initTrie = useCallback(() => {
    clearTimers();
    const newRoot = makeTrieNode();
    INITIAL_TRIE_WORDS.forEach((w) => {
      let cur = newRoot;
      for (const ch of w.toLowerCase()) {
        if (!cur.children.has(ch)) {
          cur.children.set(ch, makeTrieNode(ch));
        }
        cur = cur.children.get(ch)!;
      }
      cur.isEndOfWord = true;
    });
    setRoot(newRoot);
    setWords([...INITIAL_TRIE_WORDS]);
    setInputVal("");
    setFeedback(null);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    initTrie();
    return () => clearTimers();
  }, [initTrie]);

  // Collect all words from a node
  const collectWords = useCallback((node: TrieNodeData, prefix: string): string[] => {
    const res: string[] = [];
    if (node.isEndOfWord) res.push(prefix);
    node.children.forEach((child, ch) => {
      res.push(...collectWords(child, prefix + ch));
    });
    return res;
  }, []);

  const handleInsert = useCallback(async () => {
    const w = inputVal.trim().toLowerCase();
    if (!w || isProcessing || !/^[a-z]+$/.test(w)) {
      if (w && !/^[a-z]+$/.test(w)) {
        setFeedback({ success: false, message: "Only lowercase letters (a-z) allowed" });
      }
      return;
    }
    if (words.includes(w)) {
      setFeedback({ success: false, message: `"${w}" already exists in trie` });
      setInputVal("");
      return;
    }

    setIsProcessing(true);
    clearTimers();

    const keys: string[] = ["root"];
    let path = "root";
    for (let i = 0; i < w.length; i++) {
      path += `-${w[i]}`;
      keys.push(path);
      setHighlightedKeys(new Set(keys));
      await wait(440);
    }

    setRoot((prev) => {
      const clone = makeTrieNode();
      const copyTree = (src: TrieNodeData, dst: TrieNodeData) => {
        dst.char = src.char;
        dst.isEndOfWord = src.isEndOfWord;
        src.children.forEach((child, ch) => {
          const childClone = makeTrieNode(ch);
          dst.children.set(ch, childClone);
          copyTree(child, childClone);
        });
      };
      copyTree(prev, clone);

      let cur = clone;
      for (const ch of w) {
        if (!cur.children.has(ch)) {
          cur.children.set(ch, makeTrieNode(ch));
        }
        cur = cur.children.get(ch)!;
      }
      cur.isEndOfWord = true;
      return clone;
    });

    setWords((prev) => [...prev, w]);
    setFeedback({ success: true, message: `Inserted "${w}" into trie` });
    await wait(600);
    setHighlightedKeys(new Set());
    setInputVal("");
    setIsProcessing(false);
  }, [inputVal, isProcessing, words]);

  const handleSearch = useCallback(async () => {
    const w = inputVal.trim().toLowerCase();
    if (!w || isProcessing) return;

    setIsProcessing(true);
    clearTimers();

    const keys: string[] = ["root"];
    let path = "root";
    let cur = root;
    let found = true;

    for (const ch of w) {
      path += `-${ch}`;
      if (!cur.children.has(ch)) {
        found = false;
        break;
      }
      cur = cur.children.get(ch)!;
      keys.push(path);
      setHighlightedKeys(new Set(keys));
      await wait(440);
    }

    if (found && !cur.isEndOfWord) {
      found = false;
    }

    await wait(600);
    setFeedback({
      success: found,
      message: found ? `"${w}" found in trie` : `"${w}" not found in trie`,
    });
    await wait(800);
    setHighlightedKeys(new Set());
    setInputVal("");
    setIsProcessing(false);
  }, [inputVal, isProcessing, root]);

  const handlePrefix = useCallback(async () => {
    const w = inputVal.trim().toLowerCase();
    if (!w || isProcessing) return;

    setIsProcessing(true);
    clearTimers();

    const keys: string[] = ["root"];
    let path = "root";
    let cur = root;
    let found = true;

    for (const ch of w) {
      path += `-${ch}`;
      if (!cur.children.has(ch)) {
        found = false;
        break;
      }
      cur = cur.children.get(ch)!;
      keys.push(path);
      setHighlightedKeys(new Set(keys));
      await wait(440);
    }

    let matches: string[] = [];
    if (found) {
      matches = collectWords(cur, w);
    }

    await wait(600);
    setFeedback({
      success: matches.length > 0,
      matches,
      message:
        matches.length > 0
          ? `Found ${matches.length} word${matches.length > 1 ? "s" : ""} with prefix "${w}"`
          : `No words found with prefix "${w}"`,
    });
    await wait(800);
    setHighlightedKeys(new Set());
    setInputVal("");
    setIsProcessing(false);
  }, [inputVal, isProcessing, root, collectWords]);

  const handleSubmit = () => {
    if (activeOp === "insert") handleInsert();
    else if (activeOp === "search") handleSearch();
    else handlePrefix();
  };

  // Layout calculation
  interface SvgNodeItem {
    node: TrieNodeData;
    x: number;
    y: number;
    parentX?: number;
    parentY?: number;
    pathKey: string;
  }

  const getSubtreeWidth = useCallback((node: TrieNodeData): number => {
    const children = Array.from(node.children.values());
    if (children.length === 0) return 1;
    return children.reduce((acc, c) => acc + getSubtreeWidth(c), 0);
  }, []);

  const layoutTree = useCallback(
    (node: TrieNodeData, x: number, y: number, pathKey = "root"): SvgNodeItem[] => {
      const items: SvgNodeItem[] = [];
      const children = Array.from(node.children.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      if (children.length === 0) return items;

      const widths = children.map(([, c]) => getSubtreeWidth(c));
      const totalWidth = widths.reduce((acc, w) => acc + w, 0);
      let curX = x - (46 * totalWidth) / 2 + (46 * widths[0]) / 2;

      children.forEach(([ch, child], idx) => {
        const childKey = `${pathKey}-${ch}`;
        const childY = y + 66;
        items.push({
          node: child,
          x: curX,
          y: childY,
          parentX: x,
          parentY: y,
          pathKey: childKey,
        });
        const sub = layoutTree(child, curX, childY, childKey);
        items.push(...sub);
        if (idx < children.length - 1) {
          curX += (46 * widths[idx]) / 2 + (46 * widths[idx + 1]) / 2;
        }
      });
      return items;
    },
    [getSubtreeWidth]
  );

  const treeNodes = useMemo(() => layoutTree(root, 0, 0), [root, layoutTree]);

  // Compute SVG viewBox
  let minX = 0;
  let maxX = 0;
  treeNodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x);
  });
  const svgW = Math.max(380, maxX - minX + 100);
  const maxY = treeNodes.length ? Math.max(...treeNodes.map((n) => n.y)) : 0;
  const svgH = Math.max(220, maxY + 80);
  const offsetX = -minX + 50;

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-medium text-foreground">Trie (Prefix Tree)</h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {words.length} word{words.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tree data structure for fast prefix lookups, autocomplete, and dictionary storage.
          </p>
        </div>
        <SimpleTooltip content="Reset to initial words">
          <button
            onClick={initTrie}
            disabled={isProcessing}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </SimpleTooltip>
      </div>

      {/* Operation selector pills */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { op: "insert" as const, icon: Plus, label: "Insert" },
          { op: "search" as const, icon: Search, label: "Search" },
          { op: "prefix" as const, icon: Type, label: "Prefix Search" },
        ].map(({ op, icon: Icon, label }) => (
          <button
            key={op}
            onClick={() => {
              setActiveOp(op);
              setFeedback(null);
            }}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeOp === op
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2 max-w-md">
        <input
          type="text"
          placeholder={
            activeOp === "insert"
              ? "Enter lowercase word to insert..."
              : activeOp === "search"
              ? "Enter word to search..."
              : "Enter prefix to find matches..."
          }
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setFeedback(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isProcessing}
          className="h-8 text-xs font-mono px-3 flex-1 rounded-md border border-border bg-card outline-none focus:border-cyan-400 disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={!inputVal.trim() || isProcessing}
          className="px-3.5 h-8 text-xs font-medium rounded-md bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors disabled:opacity-50"
        >
          {activeOp === "insert" ? "Insert" : activeOp === "search" ? "Search" : "Find"}
        </button>
      </div>

      {/* Feedback banner */}
      {feedback ? (
        <div
          className={`flex items-start gap-2 px-3 py-2 rounded-md text-xs font-medium ${
            feedback.success
              ? "bg-[#67E8F9]/10 text-[#67E8F9] border border-[#67E8F9]/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {feedback.success ? (
            <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <div className="space-y-1">
            <div>{feedback.message}</div>
            {feedback.matches && feedback.matches.length > 0 ? (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {feedback.matches.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 text-[11px] rounded bg-[#67E8F9]/20 text-[#67E8F9] font-mono"
                  >
                    {m}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* SVG Canvas Area */}
      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-auto"
          style={{ fontFamily: MONO_FONT }}
          textRendering="geometricPrecision"
        >
          <GlowDefs
            prefix="trie"
            colors={[
              ["cyan", COLOR_CYAN],
              ["green", COLOR_GREEN],
            ]}
          />

          {/* Root node */}
          <g transform={`translate(${offsetX}, 26)`}>
            <circle
              r={16}
              fill={highlightedKeys.has("root") ? "rgba(0, 206, 255, 0.2)" : "#27272a"}
              stroke={highlightedKeys.has("root") ? COLOR_CYAN : "rgba(161,161,170,0.4)"}
              strokeWidth={highlightedKeys.has("root") ? 2.5 : 1.5}
              filter={highlightedKeys.has("root") ? "url(#trie-glow-cyan)" : undefined}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="#a1a1aa"
              fontSize={10}
              fontWeight={700}
            >
              root
            </text>
          </g>

          {/* Tree nodes and edges */}
          {treeNodes.map((item, idx) => {
            const isHigh = highlightedKeys.has(item.pathKey);
            const isWord = item.node.isEndOfWord;

            return (
              <g key={`tn-${idx}`}>
                {/* Edge line from parent */}
                {item.parentX !== undefined && item.parentY !== undefined ? (
                  <line
                    x1={item.parentX + offsetX}
                    y1={item.parentY + 26 + 16}
                    x2={item.x + offsetX}
                    y2={item.y + 26 - 16}
                    stroke={isHigh ? COLOR_CYAN : "rgba(161,161,170,0.35)"}
                    strokeWidth={isHigh ? 2.5 : 1.5}
                    style={{ transition: "stroke 200ms, stroke-width 200ms" }}
                  />
                ) : null}

                {/* Node circle */}
                <g transform={`translate(${item.x + offsetX}, ${item.y + 26})`}>
                  <circle
                    r={16}
                    fill={isHigh ? COLOR_YELLOW : isWord ? COLOR_GREEN : "#000000"}
                    stroke={isHigh ? COLOR_YELLOW : isWord ? COLOR_GREEN : "rgba(255,255,255,0.2)"}
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHigh || isWord ? "#09090b" : "#FFFFFF"}
                    fontSize={14}
                    fontWeight={800}
                  >
                    {item.node.char}
                  </text>
                  {/* End of word indicator dot */}
                  {isWord ? (
                    <circle cx={12} cy={-12} r={4} fill={COLOR_GREEN} stroke="#000000" strokeWidth={1} />
                  ) : null}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dictionary pills */}
      <div className="space-y-1.5">
        <div className="text-xs text-muted-foreground">Words in trie:</div>
        <div className="flex flex-wrap gap-1.5">
          {words.sort().map((w) => (
            <span
              key={w}
              className="px-2 py-0.5 text-xs rounded bg-muted/60 text-foreground font-mono font-medium border border-border/50"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. TRIE AUTOCOMPLETE SIMULATION
// ==========================================

const AUTO_DICT = [
  { word: "cat", freq: 12 },
  { word: "car", freq: 9 },
  { word: "card", freq: 5 },
  { word: "care", freq: 7 },
  { word: "cap", freq: 6 },
  { word: "do", freq: 8 },
  { word: "dog", freq: 11 },
  { word: "dot", freq: 4 },
  { word: "down", freq: 3 },
];

const AUTO_SCENARIOS = [
  { id: "ca", name: "type: ca", target: "ca" },
  { id: "car", name: "type: car", target: "car" },
  { id: "do", name: "type: do", target: "do" },
];

export function TrieAutocompleteSimulation() {
  const [prefix, setPrefix] = useState("");
  const [targetQuery, setTargetQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Build trie data
  const trieData = useMemo(() => {
    const childrenArr: Record<string, number>[] = [{}];
    const parentArr: number[] = [-1];
    const charArr: string[] = [""];
    const depthArr: number[] = [0];
    const wordArr: (string | null)[] = [null];
    const freqArr: number[] = [0];

    const addNode = (parent: number, ch: string) => {
      const id = childrenArr.length;
      childrenArr.push({});
      parentArr.push(parent);
      charArr.push(ch);
      depthArr.push(depthArr[parent] + 1);
      wordArr.push(null);
      freqArr.push(0);
      return id;
    };

    for (const { word, freq } of AUTO_DICT) {
      let cur = 0;
      for (const ch of word) {
        if (childrenArr[cur][ch] === undefined) {
          childrenArr[cur][ch] = addNode(cur, ch);
        }
        cur = childrenArr[cur][ch];
      }
      wordArr[cur] = word;
      freqArr[cur] = freq;
    }

    const nodes = childrenArr.map((_, i) => ({
      id: i,
      parent: parentArr[i],
      char: charArr[i],
      depth: depthArr[i],
      word: wordArr[i],
      freq: freqArr[i],
    }));

    const edges: { parent: number; child: number; char: string }[] = [];
    for (let i = 1; i < childrenArr.length; i++) {
      edges.push({ parent: parentArr[i], child: i, char: charArr[i] });
    }

    return { nodes, edges, children: childrenArr };
  }, []);

  // Compute node 2D positions
  const layout = useMemo(() => {
    const adj = new Map<number, typeof trieData.nodes>();
    for (const n of trieData.nodes) {
      if (n.id !== 0) {
        if (!adj.has(n.parent)) adj.set(n.parent, []);
        adj.get(n.parent)!.push(n);
      }
    }
    adj.forEach((list) => list.sort((a, b) => a.char.localeCompare(b.char)));

    const xMap = new Map<number, number>();
    let leafX = 0;
    let maxDepth = 0;

    const dfs = (u: number, d: number): number => {
      maxDepth = Math.max(maxDepth, d);
      const kids = adj.get(u) || [];
      if (kids.length === 0) {
        const x = leafX++;
        xMap.set(u, x);
        return x;
      }
      const coords = kids.map((k) => dfs(k.id, d + 1));
      const mid = (Math.min(...coords) + Math.max(...coords)) / 2;
      xMap.set(u, mid);
      return mid;
    };

    dfs(0, 0);

    const pos = new Map<number, { x: number; y: number }>();
    for (const n of trieData.nodes) {
      pos.set(n.id, {
        x: 32 + (xMap.get(n.id) ?? 0) * 52,
        y: 28 + 58 * n.depth,
      });
    }

    return {
      pos,
      width: 64 + 52 * Math.max(0, leafX - 1),
      height: 56 + 58 * maxDepth,
    };
  }, [trieData]);

  // Prefix matching
  const { pathNodes, prefixNode } = useMemo(() => {
    const path: number[] = [0];
    let cur = 0;
    for (const ch of prefix) {
      const next = trieData.children[cur][ch];
      if (next === undefined) return { pathNodes: path, prefixNode: null };
      cur = next;
      path.push(cur);
    }
    return { pathNodes: path, prefixNode: cur };
  }, [prefix, trieData]);

  const { subtreeSet, suggestions } = useMemo(() => {
    const sub = new Set<number>();
    const list: { word: string; freq: number }[] = [];
    if (prefixNode === null) return { subtreeSet: sub, suggestions: list };

    const stack = [prefixNode];
    while (stack.length) {
      const u = stack.pop()!;
      sub.add(u);
      const node = trieData.nodes[u];
      if (node.word) list.push({ word: node.word, freq: node.freq });
      for (const ch in trieData.children[u]) {
        stack.push(trieData.children[u][ch]);
      }
    }

    list.sort((a, b) => b.freq - a.freq || a.word.localeCompare(b.word));
    return { subtreeSet: sub, suggestions: list.slice(0, 6) };
  }, [prefixNode, trieData]);

  // Autoplay character typing
  useEffect(() => {
    if (isPlaying) {
      if (prefix.length >= targetQuery.length || !targetQuery.startsWith(prefix)) {
        setIsPlaying(false);
      } else {
        timerRef.current = setTimeout(() => {
          setPrefix((p) => targetQuery.slice(0, p.length + 1));
        }, 1100);
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }
    }
  }, [isPlaying, prefix, targetQuery]);

  const handleScenario = (target: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTargetQuery(target);
    setPrefix("");
    setIsPlaying(true);
  };

  const handleReset = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPrefix("");
    setTargetQuery("");
    setIsPlaying(false);
  };

  const pathSet = new Set(pathNodes);
  const maxFreq = suggestions.length > 0 ? suggestions[0].freq : 1;

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header & Scenarios */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-medium text-foreground">Autocomplete with Trie</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Walk down the prefix path, then gather every word below it as ranked suggestion completions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {AUTO_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleScenario(sc.target)}
                className="px-2.5 py-1 font-mono transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {sc.name}
              </button>
            ))}
          </div>
          <SimpleTooltip content="Reset">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </SimpleTooltip>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-border px-2.5 h-8 w-60 bg-card focus-within:border-cyan-400 transition-colors">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={prefix}
            onChange={(e) => {
              setIsPlaying(false);
              setPrefix(e.target.value.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8));
            }}
            placeholder="type a prefix..."
            spellCheck={false}
            className="bg-transparent outline-none text-xs font-mono tracking-wide w-full"
          />
        </div>
        {suggestions.length > 0 && prefixNode !== null ? (
          <span className="text-xs text-muted-foreground tabular-nums">
            {suggestions.length} suggestion{suggestions.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {/* Main Canvas & Suggestions layout */}
      <div className="rounded-2xl border border-white/10 bg-black shadow-2xl p-4 sm:p-6 overflow-hidden">
        <div className="flex gap-6 flex-wrap lg:flex-nowrap">
          {/* SVG Trie Area */}
          <div className="flex-1 min-w-[280px] overflow-x-auto select-none">
            <svg
              viewBox={`0 0 ${Math.max(layout.width, 240)} ${Math.max(layout.height, 140)}`}
              className="block w-full h-auto"
              style={{ fontFamily: MONO_FONT, maxWidth: Math.max(layout.width, 240) }}
              textRendering="geometricPrecision"
            >
              <GlowDefs
                prefix="auto"
                colors={[
                  ["cyan", COLOR_CYAN],
                  ["green", COLOR_GREEN],
                  ["teal", COLOR_TEAL],
                ]}
              />

              {/* Edges */}
              {trieData.edges.map((e) => {
                const p = layout.pos.get(e.parent)!;
                const c = layout.pos.get(e.child)!;
                const isOnPath = pathSet.has(e.child) && pathSet.has(e.parent);
                const isInSub = subtreeSet.has(e.child) && subtreeSet.has(e.parent);
                const midX = (p.x + c.x) / 2;
                const midY = (p.y + c.y) / 2;

                return (
                  <g key={`edge-${e.child}`}>
                    <line
                      x1={p.x}
                      y1={p.y}
                      x2={c.x}
                      y2={c.y}
                      stroke={isOnPath ? COLOR_CYAN : isInSub ? COLOR_TEAL : "rgba(161,161,170,0.35)"}
                      strokeWidth={isOnPath || isInSub ? 2.4 : 1.5}
                    />
                    <circle cx={midX} cy={midY} r={7.5} fill="#000000" />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={isOnPath ? COLOR_CYAN : "#f4f4f5"}
                    >
                      {e.char}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {trieData.nodes.map((n) => {
                const pt = layout.pos.get(n.id)!;
                const isOnPath = pathSet.has(n.id);
                const isSub = subtreeSet.has(n.id) && !isOnPath;
                const isWord = n.word !== null;
                const isRoot = n.id === 0;

                let fill = "#a1a1aa";
                if (isOnPath && n.id === prefixNode) fill = COLOR_CYAN;
                else if (isOnPath) fill = "#3bc9db";
                else if (isSub) fill = isWord ? COLOR_GREEN : COLOR_TEAL;

                return (
                  <g key={`node-${n.id}`}>
                    {isWord ? (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSub || isOnPath ? 10 : 8}
                        fill="none"
                        stroke={isSub ? COLOR_GREEN : "rgba(161,161,170,0.4)"}
                        strokeWidth={1.6}
                      />
                    ) : null}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isRoot ? 6.5 : 5.5}
                      fill={fill}
                      stroke="#000000"
                      strokeWidth={1.5}
                    />
                    {isRoot ? (
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        fill="#a1a1aa"
                      >
                        root
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Suggestions List Panel */}
          <div className="w-56 shrink-0 space-y-2 border-l border-gray-800 pl-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Suggestions
            </div>

            {prefix.length > 0 && prefixNode === null ? (
              <div className="text-xs text-muted-foreground py-2">
                No word begins with "{prefix}"
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-xs text-muted-foreground py-2">Type a prefix to search</div>
            ) : (
              <div className="space-y-1.5">
                {suggestions.map((sug, idx) => (
                  <div
                    key={sug.word}
                    className="rounded-lg border px-3 py-2 bg-card/50"
                    style={{ borderColor: idx === 0 ? COLOR_GREEN : "rgba(161,161,170,0.25)" }}
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>
                        <span style={{ color: COLOR_CYAN }} className="font-bold">
                          {prefix}
                        </span>
                        <span>{sug.word.slice(prefix.length)}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {sug.freq}
                      </span>
                    </div>
                    {/* Frequency bar */}
                    <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(sug.freq / maxFreq) * 100}%`,
                          backgroundColor: COLOR_GREEN,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
