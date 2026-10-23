// Auto-generated DSA Animation concepts catalog from Mindflare
export interface AnimationCard {
  slug: string;
  href: string;
  title: string;
  category: string;
}

export interface AnimationSection {
  category: string;
  accent: string;
  count: number;
  cards: AnimationCard[];
}

export const ANIMATIONS_PAGE_META = {
  title: "DSA Concept Animations",
  subtitle:
    "Core data structures and algorithms: arrays, trees, graphs, heaps, sorting, and searching.",
  placeholder: "Search 140 animations...",
  totalAnimations: 140,
};

export const ANIMATION_SECTIONS: AnimationSection[] = [
  {
    category: "Fundamentals",
    accent: "#14b8a6",
    count: 5,
    cards: [
      {
        slug: "big-o",
        href: "/animations/dsa-concepts/big-o",
        title: "Big O Notation",
        category: "Fundamentals",
      },
      {
        slug: "divide-and-conquer",
        href: "/animations/dsa-concepts/divide-and-conquer",
        title: "Divide And Conquer",
        category: "Fundamentals",
      },
      {
        slug: "memoization-vs-tabulation",
        href: "/animations/dsa-concepts/memoization-vs-tabulation",
        title: "Memoization Vs Tabulation",
        category: "Fundamentals",
      },
      {
        slug: "recurrence-relation",
        href: "/animations/dsa-concepts/recurrence-relation",
        title: "Recurrence Relation",
        category: "Fundamentals",
      },
      {
        slug: "recursion-call-stack",
        href: "/animations/dsa-concepts/recursion-call-stack",
        title: "Recursion Call Stack",
        category: "Fundamentals",
      },
    ],
  },
  {
    category: "Time Complexity Patterns",
    accent: "#14b8a6",
    count: 10,
    cards: [
      {
        slug: "branching-recursion",
        href: "/animations/dsa-concepts/branching-recursion",
        title: "Branching Recursion (O(2\u207f))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "divide-conquer-levels",
        href: "/animations/dsa-concepts/divide-conquer-levels",
        title: "Divide & Conquer Levels (O(n log n))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "halving-loop",
        href: "/animations/dsa-concepts/halving-loop",
        title: "Halving Loop (O(log n))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "hash-lookup",
        href: "/animations/dsa-concepts/hash-lookup",
        title: "Hash Lookup (O(1))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "loop-binary-search",
        href: "/animations/dsa-concepts/loop-binary-search",
        title: "Loop + Binary Search (O(n log n))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "nested-loop",
        href: "/animations/dsa-concepts/nested-loop",
        title: "Nested Loops (O(n\u00b2))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "permutation-tree",
        href: "/animations/dsa-concepts/permutation-tree",
        title: "Permutation Tree (O(n!))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "sequential-loops",
        href: "/animations/dsa-concepts/sequential-loops",
        title: "Sequential Loops (O(n + m))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "single-loop",
        href: "/animations/dsa-concepts/single-loop",
        title: "Single Loop (O(n))",
        category: "Time Complexity Patterns",
      },
      {
        slug: "triangular-loop",
        href: "/animations/dsa-concepts/triangular-loop",
        title: "Triangular Loop (O(n\u00b2))",
        category: "Time Complexity Patterns",
      },
    ],
  },
  {
    category: "Space Complexity Patterns",
    accent: "#14b8a6",
    count: 10,
    cards: [
      {
        slug: "dp-table",
        href: "/animations/dsa-concepts/dp-table",
        title: "2D DP Table (O(n\u00b7m) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "bfs-queue",
        href: "/animations/dsa-concepts/bfs-queue",
        title: "BFS Queue (O(n) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "fixed-size-counts",
        href: "/animations/dsa-concepts/fixed-size-counts",
        title: "Fixed-Size Counts (O(1) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "hash-set-seen",
        href: "/animations/dsa-concepts/hash-set-seen",
        title: "Hash Set of Seen (O(n) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "linear-recursion",
        href: "/animations/dsa-concepts/linear-recursion",
        title: "Linear Recursion (O(n) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "output-array",
        href: "/animations/dsa-concepts/output-array",
        title: "New Output Array (O(n) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "recursive-halving",
        href: "/animations/dsa-concepts/recursive-halving",
        title: "Recursive Halving (O(log n) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "rolling-variables",
        href: "/animations/dsa-concepts/rolling-variables",
        title: "Rolling DP Variables (O(1) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "storing-subsets",
        href: "/animations/dsa-concepts/storing-subsets",
        title: "Storing All Subsets (O(n\u00b72\u207f) Space)",
        category: "Space Complexity Patterns",
      },
      {
        slug: "two-pointers-space",
        href: "/animations/dsa-concepts/two-pointers-space",
        title: "Two Pointers (O(1) Space)",
        category: "Space Complexity Patterns",
      },
    ],
  },
  {
    category: "Amortized Analysis",
    accent: "#14b8a6",
    count: 4,
    cards: [
      {
        slug: "accounting-method",
        href: "/animations/dsa-concepts/accounting-method",
        title: "Accounting Method",
        category: "Amortized Analysis",
      },
      {
        slug: "amortized-cost-timeline",
        href: "/animations/dsa-concepts/amortized-cost-timeline",
        title: "Amortized Cost Timeline",
        category: "Amortized Analysis",
      },
      {
        slug: "potential-method",
        href: "/animations/dsa-concepts/potential-method",
        title: "Potential Method",
        category: "Amortized Analysis",
      },
      {
        slug: "resize-cost-series",
        href: "/animations/dsa-concepts/resize-cost-series",
        title: "Resize Cost Series",
        category: "Amortized Analysis",
      },
    ],
  },
  {
    category: "Recurrence Relations",
    accent: "#14b8a6",
    count: 5,
    cards: [
      {
        slug: "balanced-vs-unbalanced-partition",
        href: "/animations/dsa-concepts/balanced-vs-unbalanced-partition",
        title: "Balanced vs Unbalanced Partition",
        category: "Recurrence Relations",
      },
      {
        slug: "iterative-expansion",
        href: "/animations/dsa-concepts/iterative-expansion",
        title: "Iterative Expansion",
        category: "Recurrence Relations",
      },
      {
        slug: "recurrence-shape-explorer",
        href: "/animations/dsa-concepts/recurrence-shape-explorer",
        title: "Recurrence Shape Explorer",
        category: "Recurrence Relations",
      },
      {
        slug: "substitution-method",
        href: "/animations/dsa-concepts/substitution-method",
        title: "Substitution Method",
        category: "Recurrence Relations",
      },
      {
        slug: "hanoi-recurrence",
        href: "/animations/dsa-concepts/hanoi-recurrence",
        title: "Tower of Hanoi Recurrence",
        category: "Recurrence Relations",
      },
    ],
  },
  {
    category: "Master Theorem",
    accent: "#14b8a6",
    count: 4,
    cards: [
      {
        slug: "leaf-count-identity",
        href: "/animations/dsa-concepts/leaf-count-identity",
        title: "Leaf Count Identity",
        category: "Master Theorem",
      },
      {
        slug: "master-theorem-watershed",
        href: "/animations/dsa-concepts/master-theorem-watershed",
        title: "Master Theorem: The Watershed",
        category: "Master Theorem",
      },
      {
        slug: "regularity-condition",
        href: "/animations/dsa-concepts/regularity-condition",
        title: "Regularity Condition",
        category: "Master Theorem",
      },
      {
        slug: "master-theorem-fails",
        href: "/animations/dsa-concepts/master-theorem-fails",
        title: "When the Master Theorem Fails",
        category: "Master Theorem",
      },
    ],
  },
  {
    category: "Bit Manipulation",
    accent: "#14b8a6",
    count: 5,
    cards: [
      {
        slug: "bit-masking",
        href: "/animations/dsa-concepts/bit-masking",
        title: "Bit Masking",
        category: "Bit Manipulation",
      },
      {
        slug: "bitwise-operators",
        href: "/animations/dsa-concepts/bitwise-operators",
        title: "Bitwise Operators",
        category: "Bit Manipulation",
      },
      {
        slug: "count-set-bits",
        href: "/animations/dsa-concepts/count-set-bits",
        title: "Count Set Bits",
        category: "Bit Manipulation",
      },
      {
        slug: "power-of-two",
        href: "/animations/dsa-concepts/power-of-two",
        title: "Power of Two",
        category: "Bit Manipulation",
      },
      {
        slug: "single-number",
        href: "/animations/dsa-concepts/single-number",
        title: "Single Number",
        category: "Bit Manipulation",
      },
    ],
  },
  {
    category: "Arrays & Two Pointers",
    accent: "#14b8a6",
    count: 14,
    cards: [
      {
        slug: "container-most-water",
        href: "/animations/dsa-concepts/container-most-water",
        title: "Container Most Water",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "container-water",
        href: "/animations/dsa-concepts/container-water",
        title: "Container Water",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "dynamic-array",
        href: "/animations/dsa-concepts/dynamic-array",
        title: "Dynamic Array",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "fast-slow-pointers",
        href: "/animations/dsa-concepts/fast-slow-pointers",
        title: "Fast and Slow Pointers",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "gas-station",
        href: "/animations/dsa-concepts/gas-station",
        title: "Gas Station",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "jump-game-ii",
        href: "/animations/dsa-concepts/jump-game-ii",
        title: "Jump Game Ii",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "kadane",
        href: "/animations/dsa-concepts/kadane",
        title: "Kadane's Algorithm",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "move-zeroes",
        href: "/animations/dsa-concepts/move-zeroes",
        title: "Move Zeroes",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "prefix-sum",
        href: "/animations/dsa-concepts/prefix-sum",
        title: "Prefix Sum",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "quickselect",
        href: "/animations/dsa-concepts/quickselect",
        title: "Quickselect",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "sliding-window",
        href: "/animations/dsa-concepts/sliding-window",
        title: "Sliding Window",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "trapping-rain-water",
        href: "/animations/dsa-concepts/trapping-rain-water",
        title: "Trapping Rain Water",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "two-pointers",
        href: "/animations/dsa-concepts/two-pointers",
        title: "Two Pointers",
        category: "Arrays & Two Pointers",
      },
      {
        slug: "two-sum",
        href: "/animations/dsa-concepts/two-sum",
        title: "Two Sum",
        category: "Arrays & Two Pointers",
      },
    ],
  },
  {
    category: "Linked Lists",
    accent: "#14b8a6",
    count: 1,
    cards: [
      {
        slug: "linked-list",
        href: "/animations/dsa-concepts/linked-list",
        title: "Linked List",
        category: "Linked Lists",
      },
    ],
  },
  {
    category: "Stacks & Queues",
    accent: "#14b8a6",
    count: 6,
    cards: [
      {
        slug: "circular-queue",
        href: "/animations/dsa-concepts/circular-queue",
        title: "Circular Queue",
        category: "Stacks & Queues",
      },
      {
        slug: "deque",
        href: "/animations/dsa-concepts/deque",
        title: "Deque",
        category: "Stacks & Queues",
      },
      {
        slug: "monotonic-queue",
        href: "/animations/dsa-concepts/monotonic-queue",
        title: "Monotonic Queue",
        category: "Stacks & Queues",
      },
      {
        slug: "monotonic-stack",
        href: "/animations/dsa-concepts/monotonic-stack",
        title: "Monotonic Stack",
        category: "Stacks & Queues",
      },
      {
        slug: "queue",
        href: "/animations/dsa-concepts/queue",
        title: "Queue",
        category: "Stacks & Queues",
      },
      {
        slug: "stack",
        href: "/animations/dsa-concepts/stack",
        title: "Stack",
        category: "Stacks & Queues",
      },
    ],
  },
  {
    category: "Hashing",
    accent: "#14b8a6",
    count: 2,
    cards: [
      {
        slug: "hash-table-open-addressing",
        href: "/animations/dsa-concepts/hash-table-open-addressing",
        title: "Hash Table Open Addressing",
        category: "Hashing",
      },
      {
        slug: "hash-table-separate-chaining",
        href: "/animations/dsa-concepts/hash-table-separate-chaining",
        title: "Hash Table Separate Chaining",
        category: "Hashing",
      },
    ],
  },
  {
    category: "Sorting",
    accent: "#14b8a6",
    count: 13,
    cards: [
      {
        slug: "bubble-sort",
        href: "/animations/dsa-concepts/bubble-sort",
        title: "Bubble Sort",
        category: "Sorting",
      },
      {
        slug: "bucket-sort",
        href: "/animations/dsa-concepts/bucket-sort",
        title: "Bucket Sort",
        category: "Sorting",
      },
      {
        slug: "counting-sort",
        href: "/animations/dsa-concepts/counting-sort",
        title: "Counting Sort",
        category: "Sorting",
      },
      {
        slug: "cyclic-sort",
        href: "/animations/dsa-concepts/cyclic-sort",
        title: "Cyclic Sort",
        category: "Sorting",
      },
      {
        slug: "external-sort",
        href: "/animations/dsa-concepts/external-sort",
        title: "External Sort",
        category: "Sorting",
      },
      {
        slug: "heap-sort",
        href: "/animations/dsa-concepts/heap-sort",
        title: "Heap Sort",
        category: "Sorting",
      },
      {
        slug: "insertion-sort",
        href: "/animations/dsa-concepts/insertion-sort",
        title: "Insertion Sort",
        category: "Sorting",
      },
      {
        slug: "merge-sort",
        href: "/animations/dsa-concepts/merge-sort",
        title: "Merge Sort",
        category: "Sorting",
      },
      {
        slug: "quick-sort",
        href: "/animations/dsa-concepts/quick-sort",
        title: "Quick Sort",
        category: "Sorting",
      },
      {
        slug: "radix-sort",
        href: "/animations/dsa-concepts/radix-sort",
        title: "Radix Sort",
        category: "Sorting",
      },
      {
        slug: "selection-sort",
        href: "/animations/dsa-concepts/selection-sort",
        title: "Selection Sort",
        category: "Sorting",
      },
      {
        slug: "shell-sort",
        href: "/animations/dsa-concepts/shell-sort",
        title: "Shell Sort",
        category: "Sorting",
      },
      {
        slug: "tim-sort",
        href: "/animations/dsa-concepts/tim-sort",
        title: "Tim Sort",
        category: "Sorting",
      },
    ],
  },
  {
    category: "Searching",
    accent: "#14b8a6",
    count: 2,
    cards: [
      {
        slug: "binary-search",
        href: "/animations/dsa-concepts/binary-search",
        title: "Binary Search",
        category: "Searching",
      },
      {
        slug: "naive-search",
        href: "/animations/dsa-concepts/naive-search",
        title: "Naive Search",
        category: "Searching",
      },
    ],
  },
  {
    category: "Backtracking",
    accent: "#14b8a6",
    count: 9,
    cards: [
      {
        slug: "combination-sum",
        href: "/animations/dsa-concepts/combination-sum",
        title: "Combination Sum",
        category: "Backtracking",
      },
      {
        slug: "generate-parentheses",
        href: "/animations/dsa-concepts/generate-parentheses",
        title: "Generate Parentheses",
        category: "Backtracking",
      },
      {
        slug: "maze-solver",
        href: "/animations/dsa-concepts/maze-solver",
        title: "Maze Solver",
        category: "Backtracking",
      },
      {
        slug: "n-queens",
        href: "/animations/dsa-concepts/n-queens",
        title: "N Queens",
        category: "Backtracking",
      },
      {
        slug: "permutations",
        href: "/animations/dsa-concepts/permutations",
        title: "Permutations",
        category: "Backtracking",
      },
      {
        slug: "subsets",
        href: "/animations/dsa-concepts/subsets",
        title: "Subsets",
        category: "Backtracking",
      },
      {
        slug: "subsets-bitmask",
        href: "/animations/dsa-concepts/subsets-bitmask",
        title: "Subsets via Bitmask",
        category: "Backtracking",
      },
      {
        slug: "sudoku-solver",
        href: "/animations/dsa-concepts/sudoku-solver",
        title: "Sudoku Solver",
        category: "Backtracking",
      },
      {
        slug: "word-search",
        href: "/animations/dsa-concepts/word-search",
        title: "Word Search",
        category: "Backtracking",
      },
    ],
  },
  {
    category: "Trees & Heaps",
    accent: "#14b8a6",
    count: 11,
    cards: [
      {
        slug: "avl-trees",
        href: "/animations/dsa-concepts/avl-trees",
        title: "AVL Trees",
        category: "Trees & Heaps",
      },
      {
        slug: "b-trees",
        href: "/animations/dsa-concepts/b-trees",
        title: "B-Trees",
        category: "Trees & Heaps",
      },
      {
        slug: "binary-heap",
        href: "/animations/dsa-concepts/binary-heap",
        title: "Binary Heap",
        category: "Trees & Heaps",
      },
      {
        slug: "binary-search-tree",
        href: "/animations/dsa-concepts/binary-search-tree",
        title: "Binary Search Tree",
        category: "Trees & Heaps",
      },
      {
        slug: "fenwick-tree",
        href: "/animations/dsa-concepts/fenwick-tree",
        title: "Fenwick Tree",
        category: "Trees & Heaps",
      },
      {
        slug: "morris-traversal",
        href: "/animations/dsa-concepts/morris-traversal",
        title: "Morris Traversal",
        category: "Trees & Heaps",
      },
      {
        slug: "quad-trees",
        href: "/animations/dsa-concepts/quad-trees",
        title: "Quad Trees",
        category: "Trees & Heaps",
      },
      {
        slug: "red-black-trees",
        href: "/animations/dsa-concepts/red-black-trees",
        title: "Red Black Trees",
        category: "Trees & Heaps",
      },
      {
        slug: "segment-tree",
        href: "/animations/dsa-concepts/segment-tree",
        title: "Segment Tree",
        category: "Trees & Heaps",
      },
      {
        slug: "skip-lists",
        href: "/animations/dsa-concepts/skip-lists",
        title: "Skip Lists",
        category: "Trees & Heaps",
      },
      {
        slug: "tree-traversals",
        href: "/animations/dsa-concepts/tree-traversals",
        title: "Tree Traversals",
        category: "Trees & Heaps",
      },
    ],
  },
  {
    category: "Tries",
    accent: "#14b8a6",
    count: 2,
    cards: [
      {
        slug: "trie-autocomplete",
        href: "/animations/dsa-concepts/trie-autocomplete",
        title: "Autocomplete with Trie",
        category: "Tries",
      },
      {
        slug: "trie",
        href: "/animations/dsa-concepts/trie",
        title: "Trie",
        category: "Tries",
      },
    ],
  },
  {
    category: "Dynamic Programming",
    accent: "#14b8a6",
    count: 12,
    cards: [
      {
        slug: "bitmask-dp",
        href: "/animations/dsa-concepts/bitmask-dp",
        title: "Bitmask Dp",
        category: "Dynamic Programming",
      },
      {
        slug: "coin-change",
        href: "/animations/dsa-concepts/coin-change",
        title: "Coin Change",
        category: "Dynamic Programming",
      },
      {
        slug: "dp-on-trees",
        href: "/animations/dsa-concepts/dp-on-trees",
        title: "Dp On Trees",
        category: "Dynamic Programming",
      },
      {
        slug: "edit-distance",
        href: "/animations/dsa-concepts/edit-distance",
        title: "Edit Distance",
        category: "Dynamic Programming",
      },
      {
        slug: "fibonacci",
        href: "/animations/dsa-concepts/fibonacci",
        title: "Fibonacci",
        category: "Dynamic Programming",
      },
      {
        slug: "knapsack",
        href: "/animations/dsa-concepts/knapsack",
        title: "Knapsack",
        category: "Dynamic Programming",
      },
      {
        slug: "lcs",
        href: "/animations/dsa-concepts/lcs",
        title: "LCS",
        category: "Dynamic Programming",
      },
      {
        slug: "longest-increasing-subsequence",
        href: "/animations/dsa-concepts/longest-increasing-subsequence",
        title: "Longest Increasing Subsequence",
        category: "Dynamic Programming",
      },
      {
        slug: "matrix-chain",
        href: "/animations/dsa-concepts/matrix-chain",
        title: "Matrix Chain",
        category: "Dynamic Programming",
      },
      {
        slug: "subset-sum",
        href: "/animations/dsa-concepts/subset-sum",
        title: "Subset Sum",
        category: "Dynamic Programming",
      },
      {
        slug: "unbounded-knapsack",
        href: "/animations/dsa-concepts/unbounded-knapsack",
        title: "Unbounded Knapsack",
        category: "Dynamic Programming",
      },
      {
        slug: "unique-paths",
        href: "/animations/dsa-concepts/unique-paths",
        title: "Unique Paths",
        category: "Dynamic Programming",
      },
    ],
  },
  {
    category: "Graphs",
    accent: "#14b8a6",
    count: 17,
    cards: [
      {
        slug: "a-star",
        href: "/animations/dsa-concepts/a-star",
        title: "A* Search",
        category: "Graphs",
      },
      {
        slug: "articulation-points",
        href: "/animations/dsa-concepts/articulation-points",
        title: "Articulation Points",
        category: "Graphs",
      },
      {
        slug: "bellman-ford",
        href: "/animations/dsa-concepts/bellman-ford",
        title: "Bellman Ford",
        category: "Graphs",
      },
      {
        slug: "bipartite-check",
        href: "/animations/dsa-concepts/bipartite-check",
        title: "Bipartite Check",
        category: "Graphs",
      },
      {
        slug: "bridges",
        href: "/animations/dsa-concepts/bridges",
        title: "Bridges",
        category: "Graphs",
      },
      {
        slug: "cycle-detection",
        href: "/animations/dsa-concepts/cycle-detection",
        title: "Cycle Detection",
        category: "Graphs",
      },
      {
        slug: "dijkstra",
        href: "/animations/dsa-concepts/dijkstra",
        title: "Dijkstra",
        category: "Graphs",
      },
      {
        slug: "floyd-warshall",
        href: "/animations/dsa-concepts/floyd-warshall",
        title: "Floyd-Warshall",
        category: "Graphs",
      },
      {
        slug: "graph-bfs",
        href: "/animations/dsa-concepts/graph-bfs",
        title: "Graph BFS",
        category: "Graphs",
      },
      {
        slug: "graph-dfs",
        href: "/animations/dsa-concepts/graph-dfs",
        title: "Graph DFS",
        category: "Graphs",
      },
      {
        slug: "kosaraju-scc",
        href: "/animations/dsa-concepts/kosaraju-scc",
        title: "Kosaraju's Algorithm",
        category: "Graphs",
      },
      {
        slug: "kruskal",
        href: "/animations/dsa-concepts/kruskal",
        title: "Kruskal",
        category: "Graphs",
      },
      {
        slug: "max-flow",
        href: "/animations/dsa-concepts/max-flow",
        title: "Max-Flow / Min-Cut",
        category: "Graphs",
      },
      {
        slug: "prim",
        href: "/animations/dsa-concepts/prim",
        title: "Prim",
        category: "Graphs",
      },
      {
        slug: "tarjan-scc",
        href: "/animations/dsa-concepts/tarjan-scc",
        title: "Tarjan's Algorithm",
        category: "Graphs",
      },
      {
        slug: "topological-sort",
        href: "/animations/dsa-concepts/topological-sort",
        title: "Topological Sort",
        category: "Graphs",
      },
      {
        slug: "union-find",
        href: "/animations/dsa-concepts/union-find",
        title: "Union Find",
        category: "Graphs",
      },
    ],
  },
  {
    category: "String Matching",
    accent: "#14b8a6",
    count: 8,
    cards: [
      {
        slug: "aho-corasick",
        href: "/animations/dsa-concepts/aho-corasick",
        title: "Aho-Corasick",
        category: "String Matching",
      },
      {
        slug: "boyer-moore",
        href: "/animations/dsa-concepts/boyer-moore",
        title: "Boyer-Moore",
        category: "String Matching",
      },
      {
        slug: "kmp",
        href: "/animations/dsa-concepts/kmp",
        title: "KMP",
        category: "String Matching",
      },
      {
        slug: "manacher",
        href: "/animations/dsa-concepts/manacher",
        title: "Manacher's Algorithm",
        category: "String Matching",
      },
      {
        slug: "rabin-karp",
        href: "/animations/dsa-concepts/rabin-karp",
        title: "Rabin-Karp",
        category: "String Matching",
      },
      {
        slug: "suffix-array",
        href: "/animations/dsa-concepts/suffix-array",
        title: "Suffix Array",
        category: "String Matching",
      },
      {
        slug: "suffix-tree",
        href: "/animations/dsa-concepts/suffix-tree",
        title: "Suffix Tree",
        category: "String Matching",
      },
      {
        slug: "z-algorithm",
        href: "/animations/dsa-concepts/z-algorithm",
        title: "Z-Algorithm",
        category: "String Matching",
      },
    ],
  },
];

export const ALL_ANIMATIONS: AnimationCard[] = ANIMATION_SECTIONS.flatMap(
  (s) => s.cards,
);

export function getAnimationBySlug(slug: string): AnimationCard | undefined {
  return ALL_ANIMATIONS.find((a) => a.slug === slug);
}

export function getAnimationSection(
  slug: string,
): AnimationSection | undefined {
  return ANIMATION_SECTIONS.find((s) => s.cards.some((c) => c.slug === slug));
}
