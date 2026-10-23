"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  PanelLeft,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { AnimationSidebar } from "./animation-sidebar";
import SmoothButton from "@/components/smoothui/smooth-button";
import {
  getAnimationBySlug,
  getAnimationSection,
  ALL_ANIMATIONS,
  AnimationCard,
} from "@/lib/dsa-animations-data";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const SimulationLoadingState = () => (
  <div
    aria-busy="true"
    aria-label="Loading interactive simulation"
    className="min-h-[420px] rounded-2xl border border-white/10 bg-black animate-pulse"
  />
);

const SIMULATION_COMPONENTS = {
  "big-o": dynamic(() => import("./dsa/big-o-simulation").then((module) => module.BigOSimulation), { ssr: false, loading: SimulationLoadingState }),
  "divide-and-conquer": dynamic(() => import("./dsa/divide-conquer-simulation").then((module) => module.DivideConquerSimulation), { ssr: false, loading: SimulationLoadingState }),
  "memoization-vs-tabulation": dynamic(() => import("./dsa/memoization-tabulation-simulation").then((module) => module.MemoizationVsTabulationSimulation), { ssr: false, loading: SimulationLoadingState }),
  "recurrence-relation": dynamic(() => import("./dsa/recurrence-relation-simulation").then((module) => module.RecurrenceRelationSimulation), { ssr: false, loading: SimulationLoadingState }),
  "recursion-call-stack": dynamic(() => import("./dsa/recursion-callstack-simulation").then((module) => module.RecursionCallStackSimulation), { ssr: false, loading: SimulationLoadingState }),
  "single-loop": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.SingleLoopSimulation), { ssr: false, loading: SimulationLoadingState }),
  "nested-loop": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.NestedLoopSimulation), { ssr: false, loading: SimulationLoadingState }),
  "triangular-loop": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.TriangularLoopSimulation), { ssr: false, loading: SimulationLoadingState }),
  "halving-loop": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.HalvingLoopSimulation), { ssr: false, loading: SimulationLoadingState }),
  "sequential-loops": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.SequentialLoopsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "loop-binary-search": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.LoopBinarySearchSimulation), { ssr: false, loading: SimulationLoadingState }),
  "divide-conquer-levels": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.DivideConquerLevelsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "branching-recursion": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.BranchingRecursionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "permutation-tree": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.PermutationTreeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "hash-lookup": dynamic(() => import("./dsa/time-complexity-simulations").then((module) => module.HashLookupSimulation), { ssr: false, loading: SimulationLoadingState }),
  "dp-table": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.DpTableSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bfs-queue": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.BfsQueueSimulation), { ssr: false, loading: SimulationLoadingState }),
  "fixed-size-counts": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.FixedSizeCountsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "hash-set-seen": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.HashSetSeenSimulation), { ssr: false, loading: SimulationLoadingState }),
  "linear-recursion": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.LinearRecursionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "output-array": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.OutputArraySimulation), { ssr: false, loading: SimulationLoadingState }),
  "recursive-halving": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.RecursiveHalvingSimulation), { ssr: false, loading: SimulationLoadingState }),
  "rolling-variables": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.RollingVariablesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "storing-subsets": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.StoringSubsetsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "two-pointers-space": dynamic(() => import("./dsa/space-complexity-simulations").then((module) => module.TwoPointersSpaceSimulation), { ssr: false, loading: SimulationLoadingState }),
  "accounting-method": dynamic(() => import("./dsa/amortized-analysis-simulations").then((module) => module.AccountingMethodSimulation), { ssr: false, loading: SimulationLoadingState }),
  "amortized-cost-timeline": dynamic(() => import("./dsa/amortized-analysis-simulations").then((module) => module.AmortizedCostTimelineSimulation), { ssr: false, loading: SimulationLoadingState }),
  "potential-method": dynamic(() => import("./dsa/amortized-analysis-simulations").then((module) => module.PotentialMethodSimulation), { ssr: false, loading: SimulationLoadingState }),
  "resize-cost-series": dynamic(() => import("./dsa/amortized-analysis-simulations").then((module) => module.ResizeCostSeriesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "balanced-vs-unbalanced-partition": dynamic(() => import("./dsa/recurrence-relations-simulations").then((module) => module.BalancedVsUnbalancedPartitionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "iterative-expansion": dynamic(() => import("./dsa/recurrence-relations-simulations").then((module) => module.IterativeExpansionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "recurrence-shape-explorer": dynamic(() => import("./dsa/recurrence-relations-simulations").then((module) => module.RecurrenceShapeExplorerSimulation), { ssr: false, loading: SimulationLoadingState }),
  "substitution-method": dynamic(() => import("./dsa/recurrence-relations-simulations").then((module) => module.SubstitutionMethodSimulation), { ssr: false, loading: SimulationLoadingState }),
  "hanoi-recurrence": dynamic(() => import("./dsa/recurrence-relations-simulations").then((module) => module.HanoiRecurrenceSimulation), { ssr: false, loading: SimulationLoadingState }),
  "leaf-count-identity": dynamic(() => import("./dsa/master-theorem-simulations").then((module) => module.LeafCountIdentitySimulation), { ssr: false, loading: SimulationLoadingState }),
  "master-theorem-watershed": dynamic(() => import("./dsa/master-theorem-simulations").then((module) => module.MasterTheoremWatershedSimulation), { ssr: false, loading: SimulationLoadingState }),
  "regularity-condition": dynamic(() => import("./dsa/master-theorem-simulations").then((module) => module.RegularityConditionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "master-theorem-fails": dynamic(() => import("./dsa/master-theorem-simulations").then((module) => module.MasterTheoremFailsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bit-masking": dynamic(() => import("./dsa/bit-manipulation-simulations").then((module) => module.BitMaskingSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bitwise-operators": dynamic(() => import("./dsa/bit-manipulation-simulations").then((module) => module.BitwiseOperatorsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "count-set-bits": dynamic(() => import("./dsa/bit-manipulation-simulations").then((module) => module.CountSetBitsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "power-of-two": dynamic(() => import("./dsa/bit-manipulation-simulations").then((module) => module.PowerOfTwoSimulation), { ssr: false, loading: SimulationLoadingState }),
  "single-number": dynamic(() => import("./dsa/bit-manipulation-simulations").then((module) => module.SingleNumberSimulation), { ssr: false, loading: SimulationLoadingState }),
  "two-sum": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.TwoSumSimulation), { ssr: false, loading: SimulationLoadingState }),
  "two-pointers": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.TwoPointersSimulation), { ssr: false, loading: SimulationLoadingState }),
  "fast-slow-pointers": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.FastSlowPointersSimulation), { ssr: false, loading: SimulationLoadingState }),
  "sliding-window": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.SlidingWindowSimulation), { ssr: false, loading: SimulationLoadingState }),
  "container-water": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.ContainerWaterSimulation), { ssr: false, loading: SimulationLoadingState }),
  "container-most-water": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.ContainerMostWaterSimulation), { ssr: false, loading: SimulationLoadingState }),
  "trapping-rain-water": dynamic(() => import("./dsa/array-simulations-part1").then((module) => module.TrappingRainWaterSimulation), { ssr: false, loading: SimulationLoadingState }),
  "prefix-sum": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.PrefixSumSimulation), { ssr: false, loading: SimulationLoadingState }),
  "kadane": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.KadaneSimulation), { ssr: false, loading: SimulationLoadingState }),
  "move-zeroes": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.MoveZeroesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "dynamic-array": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.DynamicArraySimulation), { ssr: false, loading: SimulationLoadingState }),
  "jump-game-ii": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.JumpGameIISimulation), { ssr: false, loading: SimulationLoadingState }),
  "gas-station": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.GasStationSimulation), { ssr: false, loading: SimulationLoadingState }),
  "quickselect": dynamic(() => import("./dsa/array-simulations-part2").then((module) => module.QuickselectSimulation), { ssr: false, loading: SimulationLoadingState }),
  "linked-list": dynamic(() => import("./dsa/linked-list-simulation").then((module) => module.LinkedListSimulation), { ssr: false, loading: SimulationLoadingState }),
  "stack": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.StackSimulation), { ssr: false, loading: SimulationLoadingState }),
  "queue": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.QueueSimulation), { ssr: false, loading: SimulationLoadingState }),
  "deque": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.DequeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "circular-queue": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.CircularQueueSimulation), { ssr: false, loading: SimulationLoadingState }),
  "monotonic-stack": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.MonotonicStackSimulation), { ssr: false, loading: SimulationLoadingState }),
  "monotonic-queue": dynamic(() => import("./dsa/stacks-queues-simulations").then((module) => module.MonotonicQueueSimulation), { ssr: false, loading: SimulationLoadingState }),
  "hash-table-open-addressing": dynamic(() => import("./dsa/hashing-simulations").then((module) => module.HashTableOpenAddressingSimulation), { ssr: false, loading: SimulationLoadingState }),
  "hash-table-separate-chaining": dynamic(() => import("./dsa/hashing-simulations").then((module) => module.HashTableSeparateChainingSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bubble-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.BubbleSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "selection-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.SelectionSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "insertion-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.InsertionSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "shell-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.ShellSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "merge-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.MergeSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "quick-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.QuickSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "heap-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.HeapSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "cyclic-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.CyclicSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "tim-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.TimSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "cocktail-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.CocktailSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "comb-sort": dynamic(() => import("./dsa/sorting-comparison-simulations").then((module) => module.CombSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "counting-sort": dynamic(() => import("./dsa/sorting-distribution-simulations").then((module) => module.CountingSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "radix-sort": dynamic(() => import("./dsa/sorting-distribution-simulations").then((module) => module.RadixSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bucket-sort": dynamic(() => import("./dsa/sorting-distribution-simulations").then((module) => module.BucketSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "external-sort": dynamic(() => import("./dsa/sorting-distribution-simulations").then((module) => module.ExternalSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "binary-search": dynamic(() => import("./dsa/searching-simulations").then((module) => module.BinarySearchSimulation), { ssr: false, loading: SimulationLoadingState }),
  "naive-search": dynamic(() => import("./dsa/searching-simulations").then((module) => module.NaiveSearchSimulation), { ssr: false, loading: SimulationLoadingState }),
  "n-queens": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.NQueensSimulation), { ssr: false, loading: SimulationLoadingState }),
  "sudoku-solver": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.SudokuSolverSimulation), { ssr: false, loading: SimulationLoadingState }),
  "maze-solver": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.MazeSolverSimulation), { ssr: false, loading: SimulationLoadingState }),
  "word-search": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.WordSearchSimulation), { ssr: false, loading: SimulationLoadingState }),
  "subsets": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.SubsetsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "permutations": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.PermutationsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "generate-parentheses": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.GenerateParenthesesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "combination-sum": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.CombinationSumSimulation), { ssr: false, loading: SimulationLoadingState }),
  "subsets-bitmask": dynamic(() => import("./dsa/backtracking-simulations").then((module) => module.SubsetsBitmaskSimulation), { ssr: false, loading: SimulationLoadingState }),
  "binary-search-tree": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.BinarySearchTreeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "avl-trees": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.AvlTreesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "red-black-trees": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.RedBlackTreesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "b-trees": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.BTreesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "binary-heap": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.BinaryHeapSimulation), { ssr: false, loading: SimulationLoadingState }),
  "fenwick-tree": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.FenwickTreeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "segment-tree": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.SegmentTreeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "tree-traversals": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.TreeTraversalsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "morris-traversal": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.MorrisTraversalSimulation), { ssr: false, loading: SimulationLoadingState }),
  "quad-trees": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.QuadTreesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "skip-lists": dynamic(() => import("./dsa/trees-heaps-simulations").then((module) => module.SkipListsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "trie": dynamic(() => import("./dsa/tries-simulations").then((module) => module.TrieSimulation), { ssr: false, loading: SimulationLoadingState }),
  "trie-autocomplete": dynamic(() => import("./dsa/tries-simulations").then((module) => module.TrieAutocompleteSimulation), { ssr: false, loading: SimulationLoadingState }),
  "fibonacci": dynamic(() => import("./dsa/dp-simulations").then((module) => module.FibonacciSimulation), { ssr: false, loading: SimulationLoadingState }),
  "coin-change": dynamic(() => import("./dsa/dp-simulations").then((module) => module.CoinChangeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "knapsack": dynamic(() => import("./dsa/dp-simulations").then((module) => module.KnapsackSimulation), { ssr: false, loading: SimulationLoadingState }),
  "unbounded-knapsack": dynamic(() => import("./dsa/dp-simulations").then((module) => module.UnboundedKnapsackSimulation), { ssr: false, loading: SimulationLoadingState }),
  "lcs": dynamic(() => import("./dsa/dp-simulations").then((module) => module.LcsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "edit-distance": dynamic(() => import("./dsa/dp-simulations").then((module) => module.EditDistanceSimulation), { ssr: false, loading: SimulationLoadingState }),
  "longest-increasing-subsequence": dynamic(() => import("./dsa/dp-simulations").then((module) => module.LongestIncreasingSubsequenceSimulation), { ssr: false, loading: SimulationLoadingState }),
  "matrix-chain": dynamic(() => import("./dsa/dp-simulations").then((module) => module.MatrixChainSimulation), { ssr: false, loading: SimulationLoadingState }),
  "subset-sum": dynamic(() => import("./dsa/dp-simulations").then((module) => module.SubsetSumSimulation), { ssr: false, loading: SimulationLoadingState }),
  "unique-paths": dynamic(() => import("./dsa/dp-simulations").then((module) => module.UniquePathsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bitmask-dp": dynamic(() => import("./dsa/dp-simulations").then((module) => module.BitmaskDpSimulation), { ssr: false, loading: SimulationLoadingState }),
  "dp-on-trees": dynamic(() => import("./dsa/dp-simulations").then((module) => module.DpOnTreesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "graph-bfs": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.GraphBfsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "graph-dfs": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.GraphDfsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "dijkstra": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.DijkstraSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bellman-ford": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.BellmanFordSimulation), { ssr: false, loading: SimulationLoadingState }),
  "floyd-warshall": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.FloydWarshallSimulation), { ssr: false, loading: SimulationLoadingState }),
  "a-star": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.AStarSimulation), { ssr: false, loading: SimulationLoadingState }),
  "topological-sort": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.TopologicalSortSimulation), { ssr: false, loading: SimulationLoadingState }),
  "kruskal": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.KruskalSimulation), { ssr: false, loading: SimulationLoadingState }),
  "prim": dynamic(() => import("./dsa/graph-simulations-part1").then((module) => module.PrimSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bipartite-check": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.BipartiteCheckSimulation), { ssr: false, loading: SimulationLoadingState }),
  "cycle-detection": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.CycleDetectionSimulation), { ssr: false, loading: SimulationLoadingState }),
  "bridges": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.BridgesSimulation), { ssr: false, loading: SimulationLoadingState }),
  "articulation-points": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.ArticulationPointsSimulation), { ssr: false, loading: SimulationLoadingState }),
  "tarjan-scc": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.TarjanSccSimulation), { ssr: false, loading: SimulationLoadingState }),
  "kosaraju-scc": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.KosarajuSccSimulation), { ssr: false, loading: SimulationLoadingState }),
  "max-flow": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.MaxFlowSimulation), { ssr: false, loading: SimulationLoadingState }),
  "union-find": dynamic(() => import("./dsa/graph-simulations-part2").then((module) => module.UnionFindSimulation), { ssr: false, loading: SimulationLoadingState }),
  "kmp": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.KmpSimulation), { ssr: false, loading: SimulationLoadingState }),
  "rabin-karp": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.RabinKarpSimulation), { ssr: false, loading: SimulationLoadingState }),
  "boyer-moore": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.BoyerMooreSimulation), { ssr: false, loading: SimulationLoadingState }),
  "aho-corasick": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.AhoCorasickSimulation), { ssr: false, loading: SimulationLoadingState }),
  "z-algorithm": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.ZAlgorithmSimulation), { ssr: false, loading: SimulationLoadingState }),
  "suffix-array": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.SuffixArraySimulation), { ssr: false, loading: SimulationLoadingState }),
  "suffix-tree": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.SuffixTreeSimulation), { ssr: false, loading: SimulationLoadingState }),
  "manacher": dynamic(() => import("./dsa/string-matching-simulations").then((module) => module.ManacherSimulation), { ssr: false, loading: SimulationLoadingState }),
} as const;




interface SimulationViewerShellProps {
  slug: string;
}

export function SimulationViewerShell({ slug }: SimulationViewerShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarToggleRef = useRef<HTMLButtonElement>(null);

  const card = getAnimationBySlug(slug);
  const section = getAnimationSection(slug);

  // Find previous and next animation
  const currentIndex = ALL_ANIMATIONS.findIndex((a) => a.slug === slug);
  const prevAnim: AnimationCard | null =
    currentIndex > 0 ? ALL_ANIMATIONS[currentIndex - 1] : null;
  const nextAnim: AnimationCard | null =
    currentIndex < ALL_ANIMATIONS.length - 1 ? ALL_ANIMATIONS[currentIndex + 1] : null;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Keyboard navigation (Escape, [ for prev, ] for next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
        sidebarToggleRef.current?.focus();
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "[") {
        if (prevAnim) window.location.href = prevAnim.href;
      } else if (e.key === "]") {
        if (nextAnim) window.location.href = nextAnim.href;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen, prevAnim, nextAnim]);

  // Load only the selected simulation chunk to keep the animation route light.
  const renderSimulation = () => {
    const Simulation = SIMULATION_COMPONENTS[slug as keyof typeof SIMULATION_COMPONENTS];
    if (Simulation) return <Simulation />;

    return (
      <div className="rounded-2xl border border-white/10 bg-black p-8 sm:p-16 text-center space-y-4 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF1018]/15 text-[#FF3B41] border border-[#FF1018]/30">
          <Sparkles className="h-7 w-7 animate-pulse text-[#FF1018]" />
        </div>
        <h3 className="text-xl font-bold text-white">
          {card?.title || slug} Simulation
        </h3>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Category: <strong className="text-white">{section?.category || "DSA Concepts"}</strong>.
          Interactive step-by-step vector simulation loaded.
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <SmoothButton
            asChild
            size="sm"
            variant="solid"
            color="accent"
            className="bg-[#FF1018] text-white hover:bg-[#E00C14]"
          >
            <Link
              href="/animations/dsa-concepts/big-o"
              className="gap-2 font-semibold text-xs"
            >
              View Big-O Simulation
            </Link>
          </SmoothButton>
          <SmoothButton
            asChild
            size="sm"
            variant="outline"
            className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.04]"
          >
            <Link
              href="/animations/dsa-concepts/divide-and-conquer"
              className="gap-2 font-semibold text-xs"
            >
              View Divide & Conquer
            </Link>
          </SmoothButton>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground flex flex-col relative z-10">
      <Navbar />

      <div className="flex-1 flex min-h-0 pt-20 sm:pt-24">
        {/* Sidebar */}
        <AnimationSidebar
          currentSlug={slug}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 flex flex-col pb-16">
          <main
            ref={containerRef}
            className={`flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 md:px-6 ${
              isFullscreen ? "bg-black p-4 sm:p-8" : ""
            }`}
          >
            {/* Top Bar: Back & Sidebar Toggle */}
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                href="/animations/dsa-concepts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                All DSA Concept Animations
              </Link>

              <SmoothButton
                ref={sidebarToggleRef}
                type="button"
                size="xs"
                variant="outline"
                aria-expanded={isSidebarOpen}
                aria-controls="animation-index"
                aria-label={isSidebarOpen ? "Hide animation index" : "Show animation index"}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="gap-1.5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.04] font-medium"
              >
                <PanelLeft className="h-3.5 w-3.5" />
                <span>{isSidebarOpen ? "Hide Index" : "Show Index"}</span>
              </SmoothButton>
            </div>

            {/* Heading Row */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                {section && (
                  <div className="mb-1.5 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: section.accent || "#67E8F9" }}
                    />
                    <span className="text-xs font-semibold tracking-wide text-zinc-400 uppercase font-mono">
                      {section.category}
                    </span>
                  </div>
                )}
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {card?.title || slug.replace(/-/g, " ")}
                </h1>
              </div>

              <SmoothButton
                type="button"
                size="sm"
                variant="outline"
                onClick={toggleFullscreen}
                className="gap-1.5 border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.04] shrink-0"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </>
                )}
              </SmoothButton>
            </div>

          {/* Simulation Component */}
          <div className="mb-8">{renderSimulation()}</div>

          {/* Bottom Next / Prev Controls */}
          {!isFullscreen && (
            <div className="flex min-w-0 items-center justify-between gap-3 border-t border-border/50 pt-6 mt-8">
              {prevAnim ? (
                <Link
                  href={prevAnim.href}
                  className="group inline-flex min-w-0 max-w-[calc(50%-0.375rem)] items-center gap-2 rounded-xl border border-white/10 bg-black px-3.5 py-2 text-xs font-medium text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/[0.02] transition-all"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <div className="min-w-0 text-left">
                    <div className="text-[10px] text-zinc-500">Previous</div>
                    <div className="max-w-full truncate font-semibold text-white">
                      {prevAnim.title}
                    </div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextAnim ? (
                <Link
                  href={nextAnim.href}
                  className="group ml-auto inline-flex min-w-0 max-w-[calc(50%-0.375rem)] items-center gap-2 rounded-xl border border-white/10 bg-black px-3.5 py-2 text-xs font-medium text-zinc-400 hover:border-white/20 hover:text-white hover:bg-white/[0.02] transition-all text-right"
                >
                  <div className="min-w-0">
                    <div className="text-[10px] text-zinc-500">Next</div>
                    <div className="max-w-full truncate font-semibold text-white">
                      {nextAnim.title}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
