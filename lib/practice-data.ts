export interface PracticeProblemListItem {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TestCase {
  id: number;
  input: string;
  output: string;
  parsedInput: number[];
  parsedOutput: number[];
}

export interface PracticeProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  companies: string[];
  externalLink: string;
  description: string;
  note: string;
  examples: Array<{
    id: number;
    inputName: string;
    inputValue: string;
    outputValue: string;
    inputArray: number[];
    outputArray: number[];
  }>;
  constraints: string[];
  followUp: string;
  hints: string[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  solution: {
    approach: string;
    intuition: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
    code: Record<string, string>;
  };
}

export const AM_300_PROBLEMS: PracticeProblemListItem[] = [
  {
    "title": "Move Zeroes",
    "slug": "move-zeroes",
    "difficulty": "Easy"
  },
  {
    "title": "Majority Element",
    "slug": "majority-element",
    "difficulty": "Easy"
  },
  {
    "title": "Remove Duplicates from Sorted Array",
    "slug": "remove-duplicates-from-sorted-array",
    "difficulty": "Easy"
  },
  {
    "title": "Best Time to Buy and Sell Stock",
    "slug": "best-time-to-buy-and-sell-stock",
    "difficulty": "Easy"
  },
  {
    "title": "Rotate Array",
    "slug": "rotate-array",
    "difficulty": "Medium"
  },
  {
    "title": "Product of Array Except Self",
    "slug": "product-of-array-except-self",
    "difficulty": "Medium"
  },
  {
    "title": "Best Time to Buy and Sell Stock II",
    "slug": "best-time-to-buy-and-sell-stock-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Zero-Filled Subarrays",
    "slug": "number-of-zero-filled-subarrays",
    "difficulty": "Medium"
  },
  {
    "title": "Increasing Triplet Subsequence",
    "slug": "increasing-triplet-subsequence",
    "difficulty": "Medium"
  },
  {
    "title": "First Missing Positive",
    "slug": "first-missing-positive",
    "difficulty": "Hard"
  },
  {
    "title": "Is Subsequence",
    "slug": "is-subsequence",
    "difficulty": "Easy"
  },
  {
    "title": "Valid Palindrome",
    "slug": "valid-palindrome",
    "difficulty": "Easy"
  },
  {
    "title": "Longest Common Prefix",
    "slug": "longest-common-prefix",
    "difficulty": "Easy"
  },
  {
    "title": "Zigzag Conversion",
    "slug": "zigzag-conversion",
    "difficulty": "Medium"
  },
  {
    "title": "Reverse Words in a String",
    "slug": "reverse-words-in-a-string",
    "difficulty": "Medium"
  },
  {
    "title": "Guess the Word",
    "slug": "guess-the-word",
    "difficulty": "Hard"
  },
  {
    "title": "Single Number",
    "slug": "single-number",
    "difficulty": "Easy"
  },
  {
    "title": "Number of 1 Bits",
    "slug": "number-of-1-bits",
    "difficulty": "Easy"
  },
  {
    "title": "Counting Bits",
    "slug": "counting-bits",
    "difficulty": "Easy"
  },
  {
    "title": "Reverse Bits",
    "slug": "reverse-bits",
    "difficulty": "Easy"
  },
  {
    "title": "Bitwise AND of Numbers Range",
    "slug": "bitwise-and-of-numbers-range",
    "difficulty": "Medium"
  },
  {
    "title": "Single Number III",
    "slug": "single-number-iii",
    "difficulty": "Medium"
  },
  {
    "title": "Sum of Two Integers",
    "slug": "sum-of-two-integers",
    "difficulty": "Medium"
  },
  {
    "title": "Design HashMap",
    "slug": "design-hashmap",
    "difficulty": "Easy"
  },
  {
    "title": "Maximum Number of Balloons",
    "slug": "maximum-number-of-balloons",
    "difficulty": "Easy"
  },
  {
    "title": "Number of Good Pairs",
    "slug": "number-of-good-pairs",
    "difficulty": "Easy"
  },
  {
    "title": "Isomorphic Strings",
    "slug": "isomorphic-strings",
    "difficulty": "Easy"
  },
  {
    "title": "Ransom Note",
    "slug": "ransom-note",
    "difficulty": "Easy"
  },
  {
    "title": "Contains Duplicate II",
    "slug": "contains-duplicate-ii",
    "difficulty": "Easy"
  },
  {
    "title": "Group Anagrams",
    "slug": "group-anagrams",
    "difficulty": "Medium"
  },
  {
    "title": "Encode and Decode TinyURL",
    "slug": "encode-and-decode-tinyurl",
    "difficulty": "Medium"
  },
  {
    "title": "Reorganize String",
    "slug": "reorganize-string",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Consecutive Sequence",
    "slug": "longest-consecutive-sequence",
    "difficulty": "Medium"
  },
  {
    "title": "Split Array into Consecutive Subsequences",
    "slug": "split-array-into-consecutive-subsequences",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Matching Subsequences",
    "slug": "number-of-matching-subsequences",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Good Ways to Split a String",
    "slug": "number-of-good-ways-to-split-a-string",
    "difficulty": "Medium"
  },
  {
    "title": "Merge Sorted Array",
    "slug": "merge-sorted-array",
    "difficulty": "Easy"
  },
  {
    "title": "Two Sum II - Input Array Is Sorted",
    "slug": "two-sum-ii-input-array-is-sorted",
    "difficulty": "Medium"
  },
  {
    "title": "Container With Most Water",
    "slug": "container-with-most-water",
    "difficulty": "Medium"
  },
  {
    "title": "3Sum",
    "slug": "3Sum",
    "difficulty": "Medium"
  },
  {
    "title": "Trapping Rain Water",
    "slug": "trapping-rain-water",
    "difficulty": "Hard"
  },
  {
    "title": "Range Sum Query - Immutable",
    "slug": "range-sum-query-immutable",
    "difficulty": "Easy"
  },
  {
    "title": "Subarray Sum Equals K",
    "slug": "subarray-sum-equals-k",
    "difficulty": "Medium"
  },
  {
    "title": "Subarray Sums Divisible by K",
    "slug": "subarray-sums-divisible-by-k",
    "difficulty": "Medium"
  },
  {
    "title": "Continuous Subarray Sum",
    "slug": "continuous-subarray-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Contiguous Array",
    "slug": "contiguous-array",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Average Subarray I",
    "slug": "maximum-average-subarray-i",
    "difficulty": "Easy"
  },
  {
    "title": "Find All Anagrams in a String",
    "slug": "find-all-anagrams-in-a-string",
    "difficulty": "Medium"
  },
  {
    "title": "Permutation in String",
    "slug": "permutation-in-string",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Sum of Distinct Subarrays With Length K",
    "slug": "maximum-sum-of-distinct-subarrays-with-length-k",
    "difficulty": "Medium"
  },
  {
    "title": "Substring with Concatenation of All Words",
    "slug": "substring-with-concatenation-of-all-words",
    "difficulty": "Hard"
  },
  {
    "title": "Longest Substring Without Repeating Characters",
    "slug": "longest-substring-without-repeating-characters",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Repeating Character Replacement",
    "slug": "longest-repeating-character-replacement",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Size Subarray Sum",
    "slug": "minimum-size-subarray-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Max Consecutive Ones III",
    "slug": "max-consecutive-ones-iii",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Window Substring",
    "slug": "minimum-window-substring",
    "difficulty": "Hard"
  },
  {
    "title": "Maximum Subarray",
    "slug": "maximum-subarray",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Sum Circular Subarray",
    "slug": "maximum-sum-circular-subarray",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Product Subarray",
    "slug": "maximum-product-subarray",
    "difficulty": "Medium"
  },
  {
    "title": "Best Sightseeing Pair",
    "slug": "best-sightseeing-pair",
    "difficulty": "Medium"
  },
  {
    "title": "Spiral Matrix",
    "slug": "spiral-matrix",
    "difficulty": "Medium"
  },
  {
    "title": "Rotate Image",
    "slug": "rotate-image",
    "difficulty": "Medium"
  },
  {
    "title": "Set Matrix Zeroes",
    "slug": "set-matrix-zeroes",
    "difficulty": "Medium"
  },
  {
    "title": "Valid Sudoku",
    "slug": "valid-sudoku",
    "difficulty": "Medium"
  },
  {
    "title": "Game of Life",
    "slug": "game-of-life",
    "difficulty": "Medium"
  },
  {
    "title": "Intersection of Two Linked Lists",
    "slug": "intersection-of-two-linked-lists",
    "difficulty": "Easy"
  },
  {
    "title": "Design Linked List",
    "slug": "design-linked-list",
    "difficulty": "Medium"
  },
  {
    "title": "Remove Nth Node From End of List",
    "slug": "remove-nth-node-from-end-of-list",
    "difficulty": "Medium"
  },
  {
    "title": "Remove Duplicates from Sorted List II",
    "slug": "remove-duplicates-from-sorted-list-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Swap Nodes in Pairs",
    "slug": "swap-nodes-in-pairs",
    "difficulty": "Medium"
  },
  {
    "title": "Copy List with Random Pointer",
    "slug": "copy-list-with-random-pointer",
    "difficulty": "Medium"
  },
  {
    "title": "Partition List",
    "slug": "partition-list",
    "difficulty": "Medium"
  },
  {
    "title": "Rotate List",
    "slug": "rotate-list",
    "difficulty": "Medium"
  },
  {
    "title": "Add Two Numbers",
    "slug": "add-two-numbers",
    "difficulty": "Medium"
  },
  {
    "title": "Flatten a Multilevel Doubly Linked List",
    "slug": "flatten-a-multilevel-doubly-linked-list",
    "difficulty": "Medium"
  },
  {
    "title": "Palindrome Linked List",
    "slug": "palindrome-linked-list",
    "difficulty": "Easy"
  },
  {
    "title": "Reverse Linked List",
    "slug": "reverse-linked-list",
    "difficulty": "Easy"
  },
  {
    "title": "Reverse Linked List II",
    "slug": "reverse-linked-list-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Reverse Nodes in k-Group",
    "slug": "reverse-nodes-in-k-group",
    "difficulty": "Hard"
  },
  {
    "title": "Middle of the Linked List",
    "slug": "middle-of-the-linked-list",
    "difficulty": "Easy"
  },
  {
    "title": "Happy Number",
    "slug": "happy-number",
    "difficulty": "Easy"
  },
  {
    "title": "Linked List Cycle II",
    "slug": "linked-list-cycle-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "difficulty": "Easy"
  },
  {
    "title": "Remove All Adjacent Duplicates In String",
    "slug": "remove-all-adjacent-duplicates-in-string",
    "difficulty": "Easy"
  },
  {
    "title": "Min Stack",
    "slug": "min-stack",
    "difficulty": "Medium"
  },
  {
    "title": "Remove Duplicate Letters",
    "slug": "remove-duplicate-letters",
    "difficulty": "Medium"
  },
  {
    "title": "Removing Stars From a String",
    "slug": "removing-stars-from-a-string",
    "difficulty": "Medium"
  },
  {
    "title": "Evaluate Reverse Polish Notation",
    "slug": "evaluate-reverse-polish-notation",
    "difficulty": "Medium"
  },
  {
    "title": "Basic Calculator II",
    "slug": "basic-calculator-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Valid Parentheses",
    "slug": "longest-valid-parentheses",
    "difficulty": "Hard"
  },
  {
    "title": "Next Greater Element I",
    "slug": "next-greater-element-i",
    "difficulty": "Easy"
  },
  {
    "title": "Daily Temperatures",
    "slug": "daily-temperatures",
    "difficulty": "Medium"
  },
  {
    "title": "Online Stock Span",
    "slug": "online-stock-span",
    "difficulty": "Medium"
  },
  {
    "title": "132 Pattern",
    "slug": "132-pattern",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Visible People in a Queue",
    "slug": "number-of-visible-people-in-a-queue",
    "difficulty": "Hard"
  },
  {
    "title": "Largest Rectangle in Histogram",
    "slug": "largest-rectangle-in-histogram",
    "difficulty": "Hard"
  },
  {
    "title": "Number of Recent Calls",
    "slug": "number-of-recent-calls",
    "difficulty": "Easy"
  },
  {
    "title": "Time Needed to Buy Tickets",
    "slug": "time-needed-to-buy-tickets",
    "difficulty": "Easy"
  },
  {
    "title": "Reveal Cards In Increasing Order",
    "slug": "reveal-cards-in-increasing-order",
    "difficulty": "Medium"
  },
  {
    "title": "Jump Game VI",
    "slug": "jump-game-vi",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit",
    "slug": "longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit",
    "difficulty": "Medium"
  },
  {
    "title": "Sliding Window Maximum",
    "slug": "sliding-window-maximum",
    "difficulty": "Hard"
  },
  {
    "title": "Max Value of Equation",
    "slug": "max-value-of-equation",
    "difficulty": "Hard"
  },
  {
    "title": "Sort Characters By Frequency",
    "slug": "sort-characters-by-frequency",
    "difficulty": "Medium"
  },
  {
    "title": "Top K Frequent Words",
    "slug": "top-k-frequent-words",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Gap",
    "slug": "maximum-gap",
    "difficulty": "Medium"
  },
  {
    "title": "Merge Two Sorted Lists",
    "slug": "merge-two-sorted-lists",
    "difficulty": "Easy"
  },
  {
    "title": "Pow(x, n)",
    "slug": "powx-n",
    "difficulty": "Medium"
  },
  {
    "title": "Decode String",
    "slug": "decode-string",
    "difficulty": "Medium"
  },
  {
    "title": "Convert Sorted List to Binary Search Tree",
    "slug": "convert-sorted-list-to-binary-search-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Construct Quad Tree",
    "slug": "construct-quad-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Binary Tree",
    "slug": "maximum-binary-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Sort List",
    "slug": "sort-list",
    "difficulty": "Medium"
  },
  {
    "title": "Reverse Pairs",
    "slug": "reverse-pairs",
    "difficulty": "Hard"
  },
  {
    "title": "Sort Colors",
    "slug": "sort-colors",
    "difficulty": "Medium"
  },
  {
    "title": "Kth Largest Element in an Array",
    "slug": "kth-largest-element-in-an-array",
    "difficulty": "Medium"
  },
  {
    "title": "Search Insert Position",
    "slug": "search-insert-position",
    "difficulty": "Easy"
  },
  {
    "title": "Find First and Last Position of Element in Sorted Array",
    "slug": "find-first-and-last-position-of-element-in-sorted-array",
    "difficulty": "Medium"
  },
  {
    "title": "Search in Rotated Sorted Array",
    "slug": "search-in-rotated-sorted-array",
    "difficulty": "Medium"
  },
  {
    "title": "Find Peak Element",
    "slug": "find-peak-element",
    "difficulty": "Medium"
  },
  {
    "title": "Random Pick with Weight",
    "slug": "random-pick-with-weight",
    "difficulty": "Medium"
  },
  {
    "title": "Koko Eating Bananas",
    "slug": "koko-eating-bananas",
    "difficulty": "Medium"
  },
  {
    "title": "Find Minimum in Rotated Sorted Array",
    "slug": "find-minimum-in-rotated-sorted-array",
    "difficulty": "Medium"
  },
  {
    "title": "Search a 2D Matrix",
    "slug": "search-a-2d-matrix",
    "difficulty": "Medium"
  },
  {
    "title": "Find in Mountain Array",
    "slug": "find-in-mountain-array",
    "difficulty": "Hard"
  },
  {
    "title": "Median of Two Sorted Arrays",
    "slug": "median-of-two-sorted-arrays",
    "difficulty": "Hard"
  },
  {
    "title": "Generate Parentheses",
    "slug": "generate-parentheses",
    "difficulty": "Medium"
  },
  {
    "title": "Permutations",
    "slug": "permutations",
    "difficulty": "Medium"
  },
  {
    "title": "Subsets",
    "slug": "subsets",
    "difficulty": "Medium"
  },
  {
    "title": "Combination Sum",
    "slug": "combination-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Combination Sum II",
    "slug": "combination-sum-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Letter Combinations of a Phone Number",
    "slug": "letter-combinations-of-a-phone-number",
    "difficulty": "Medium"
  },
  {
    "title": "Palindrome Partitioning",
    "slug": "palindrome-partitioning",
    "difficulty": "Medium"
  },
  {
    "title": "N-Queens",
    "slug": "n-queens",
    "difficulty": "Hard"
  },
  {
    "title": "Binary Tree Level Order Traversal",
    "slug": "binary-tree-level-order-traversal",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Right Side View",
    "slug": "binary-tree-right-side-view",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Zigzag Level Order Traversal",
    "slug": "binary-tree-zigzag-level-order-traversal",
    "difficulty": "Medium"
  },
  {
    "title": "Populating Next Right Pointers in Each Node II",
    "slug": "populating-next-right-pointers-in-each-node-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Width of Binary Tree",
    "slug": "maximum-width-of-binary-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Preorder Traversal",
    "slug": "binary-tree-preorder-traversal",
    "difficulty": "Easy"
  },
  {
    "title": "Same Tree",
    "slug": "same-tree",
    "difficulty": "Easy"
  },
  {
    "title": "Symmetric Tree",
    "slug": "symmetric-tree",
    "difficulty": "Easy"
  },
  {
    "title": "Binary Tree Paths",
    "slug": "binary-tree-paths",
    "difficulty": "Easy"
  },
  {
    "title": "Convert Sorted Array to Binary Search Tree",
    "slug": "convert-sorted-array-to-binary-search-tree",
    "difficulty": "Easy"
  },
  {
    "title": "Count Complete Tree Nodes",
    "slug": "count-complete-tree-nodes",
    "difficulty": "Easy"
  },
  {
    "title": "Path Sum III",
    "slug": "path-sum-iii",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Difference Between Node and Ancestor",
    "slug": "maximum-difference-between-node-and-ancestor",
    "difficulty": "Medium"
  },
  {
    "title": "Construct Binary Tree from Preorder and Inorder Traversal",
    "slug": "construct-binary-tree-from-preorder-and-inorder-traversal",
    "difficulty": "Medium"
  },
  {
    "title": "Construct Binary Tree from Inorder and Postorder Traversal",
    "slug": "construct-binary-tree-from-inorder-and-postorder-traversal",
    "difficulty": "Medium"
  },
  {
    "title": "Serialize and Deserialize Binary Tree",
    "slug": "serialize-and-deserialize-binary-tree",
    "difficulty": "Hard"
  },
  {
    "title": "Binary Tree Inorder Traversal",
    "slug": "binary-tree-inorder-traversal",
    "difficulty": "Easy"
  },
  {
    "title": "Minimum Distance Between BST Nodes",
    "slug": "minimum-distance-between-bst-nodes",
    "difficulty": "Easy"
  },
  {
    "title": "Minimum Absolute Difference in BST",
    "slug": "minimum-absolute-difference-in-bst",
    "difficulty": "Easy"
  },
  {
    "title": "Validate Binary Search Tree",
    "slug": "validate-binary-search-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Kth Smallest Element in a BST",
    "slug": "kth-smallest-element-in-a-bst",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Search Tree Iterator",
    "slug": "binary-search-tree-iterator",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Postorder Traversal",
    "slug": "binary-tree-postorder-traversal",
    "difficulty": "Easy"
  },
  {
    "title": "Invert Binary Tree",
    "slug": "invert-binary-tree",
    "difficulty": "Easy"
  },
  {
    "title": "Diameter of Binary Tree",
    "slug": "diameter-of-binary-tree",
    "difficulty": "Easy"
  },
  {
    "title": "Delete Nodes And Return Forest",
    "slug": "delete-nodes-and-return-forest",
    "difficulty": "Medium"
  },
  {
    "title": "Lowest Common Ancestor of a Binary Tree",
    "slug": "lowest-common-ancestor-of-a-binary-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Find Duplicate Subtrees",
    "slug": "find-duplicate-subtrees",
    "difficulty": "Medium"
  },
  {
    "title": "Flatten Binary Tree to Linked List",
    "slug": "flatten-binary-tree-to-linked-list",
    "difficulty": "Medium"
  },
  {
    "title": "Distribute Coins in Binary Tree",
    "slug": "distribute-coins-in-binary-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Maximum Path Sum",
    "slug": "binary-tree-maximum-path-sum",
    "difficulty": "Hard"
  },
  {
    "title": "Trim a Binary Search Tree",
    "slug": "trim-a-binary-search-tree",
    "difficulty": "Medium"
  },
  {
    "title": "My Calendar I",
    "slug": "my-calendar-i",
    "difficulty": "Medium"
  },
  {
    "title": "My Calendar II",
    "slug": "my-calendar-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Stock Price Fluctuation ",
    "slug": "stock-price-fluctuation",
    "difficulty": "Medium"
  },
  {
    "title": "Implement Trie (Prefix Tree)",
    "slug": "implement-trie-prefix-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Design Add and Search Words Data Structure",
    "slug": "design-add-and-search-words-data-structure",
    "difficulty": "Medium"
  },
  {
    "title": "Search Suggestions System",
    "slug": "search-suggestions-system",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Word in Dictionary",
    "slug": "longest-word-in-dictionary",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum XOR of Two Numbers in an Array",
    "slug": "maximum-xor-of-two-numbers-in-an-array",
    "difficulty": "Medium"
  },
  {
    "title": "Word Search II",
    "slug": "word-search-ii",
    "difficulty": "Hard"
  },
  {
    "title": "Furthest Building You Can Reach",
    "slug": "furthest-building-you-can-reach",
    "difficulty": "Medium"
  },
  {
    "title": "Single-Threaded CPU",
    "slug": "single-threaded-cpu",
    "difficulty": "Medium"
  },
  {
    "title": "Process Tasks Using Servers",
    "slug": "process-tasks-using-servers",
    "difficulty": "Medium"
  },
  {
    "title": "Find Median from Data Stream",
    "slug": "find-median-from-data-stream",
    "difficulty": "Hard"
  },
  {
    "title": "IPO",
    "slug": "ipo",
    "difficulty": "Hard"
  },
  {
    "title": "Sliding Window Median",
    "slug": "sliding-window-median",
    "difficulty": "Hard"
  },
  {
    "title": "Kth Largest Element in a Stream",
    "slug": "kth-largest-element-in-a-stream",
    "difficulty": "Easy"
  },
  {
    "title": "Top K Frequent Elements",
    "slug": "top-k-frequent-elements",
    "difficulty": "Medium"
  },
  {
    "title": "K Closest Points to Origin",
    "slug": "k-closest-points-to-origin",
    "difficulty": "Medium"
  },
  {
    "title": "Merge Intervals",
    "slug": "merge-intervals",
    "difficulty": "Medium"
  },
  {
    "title": "Insert Interval",
    "slug": "insert-interval",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Number of Arrows to Burst Balloons",
    "slug": "minimum-number-of-arrows-to-burst-balloons",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Number of Events That Can Be Attended",
    "slug": "maximum-number-of-events-that-can-be-attended",
    "difficulty": "Medium"
  },
  {
    "title": "Non-overlapping Intervals",
    "slug": "non-overlapping-intervals",
    "difficulty": "Medium"
  },
  {
    "title": "Find K Pairs with Smallest Sums",
    "slug": "find-k-pairs-with-smallest-sums",
    "difficulty": "Medium"
  },
  {
    "title": "Kth Smallest Element in a Sorted Matrix",
    "slug": "kth-smallest-element-in-a-sorted-matrix",
    "difficulty": "Medium"
  },
  {
    "title": "Merge k Sorted Lists",
    "slug": "merge-k-sorted-lists",
    "difficulty": "Hard"
  },
  {
    "title": "Smallest Range Covering Elements from K Lists",
    "slug": "smallest-range-covering-elements-from-k-lists",
    "difficulty": "Hard"
  },
  {
    "title": "Design Browser History",
    "slug": "design-browser-history",
    "difficulty": "Medium"
  },
  {
    "title": "Time Based Key-Value Store",
    "slug": "time-based-key-value-store",
    "difficulty": "Medium"
  },
  {
    "title": "Snapshot Array",
    "slug": "snapshot-array",
    "difficulty": "Medium"
  },
  {
    "title": "Design Twitter",
    "slug": "design-twitter",
    "difficulty": "Medium"
  },
  {
    "title": "LRU Cache",
    "slug": "lru-cache",
    "difficulty": "Medium"
  },
  {
    "title": "Insert Delete GetRandom O(1)",
    "slug": "insert-delete-getrandom-o1",
    "difficulty": "Medium"
  },
  {
    "title": "Design a Food Rating System",
    "slug": "design-a-food-rating-system",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Frequency Stack",
    "slug": "maximum-frequency-stack",
    "difficulty": "Hard"
  },
  {
    "title": "Jump Game II",
    "slug": "jump-game-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Add to Make Parentheses Valid",
    "slug": "minimum-add-to-make-parentheses-valid",
    "difficulty": "Medium"
  },
  {
    "title": "Gas Station",
    "slug": "gas-station",
    "difficulty": "Medium"
  },
  {
    "title": "Task Scheduler",
    "slug": "task-scheduler",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Cost to Hire K Workers",
    "slug": "minimum-cost-to-hire-k-workers",
    "difficulty": "Hard"
  },
  {
    "title": "Candy",
    "slug": "candy",
    "difficulty": "Hard"
  },
  {
    "title": "Minimum Number of Refueling Stops",
    "slug": "minimum-number-of-refueling-stops",
    "difficulty": "Hard"
  },
  {
    "title": "Number of Islands",
    "slug": "number-of-islands",
    "difficulty": "Medium"
  },
  {
    "title": "Time Needed to Inform All Employees",
    "slug": "time-needed-to-inform-all-employees",
    "difficulty": "Medium"
  },
  {
    "title": "All Paths From Source to Target",
    "slug": "all-paths-from-source-to-target",
    "difficulty": "Medium"
  },
  {
    "title": "Clone Graph",
    "slug": "clone-graph",
    "difficulty": "Medium"
  },
  {
    "title": "Is Graph Bipartite?",
    "slug": "is-graph-bipartite",
    "difficulty": "Medium"
  },
  {
    "title": "All Nodes Distance K in Binary Tree",
    "slug": "all-nodes-distance-k-in-binary-tree",
    "difficulty": "Medium"
  },
  {
    "title": "Employee Importance",
    "slug": "employee-importance",
    "difficulty": "Medium"
  },
  {
    "title": "Surrounded Regions",
    "slug": "surrounded-regions",
    "difficulty": "Medium"
  },
  {
    "title": "Pacific Atlantic Water Flow",
    "slug": "pacific-atlantic-water-flow",
    "difficulty": "Medium"
  },
  {
    "title": "Making A Large Island",
    "slug": "making-a-large-island",
    "difficulty": "Hard"
  },
  {
    "title": "Rotting Oranges",
    "slug": "rotting-oranges",
    "difficulty": "Medium"
  },
  {
    "title": "01 Matrix",
    "slug": "01-matrix",
    "difficulty": "Medium"
  },
  {
    "title": "Open the Lock",
    "slug": "open-the-lock",
    "difficulty": "Medium"
  },
  {
    "title": "Shortest Path in a Grid with Obstacles Elimination",
    "slug": "shortest-path-in-a-grid-with-obstacles-elimination",
    "difficulty": "Hard"
  },
  {
    "title": "Bus Routes",
    "slug": "bus-routes",
    "difficulty": "Hard"
  },
  {
    "title": "Word Ladder",
    "slug": "word-ladder",
    "difficulty": "Hard"
  },
  {
    "title": "Course Schedule II",
    "slug": "course-schedule-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Find Eventual Safe States",
    "slug": "find-eventual-safe-states",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Height Trees",
    "slug": "minimum-height-trees",
    "difficulty": "Medium"
  },
  {
    "title": "Sort Items by Groups Respecting Dependencies",
    "slug": "sort-items-by-groups-respecting-dependencies",
    "difficulty": "Hard"
  },
  {
    "title": "Number of Provinces",
    "slug": "number-of-provinces",
    "difficulty": "Medium"
  },
  {
    "title": "Redundant Connection",
    "slug": "redundant-connection",
    "difficulty": "Medium"
  },
  {
    "title": "Accounts Merge",
    "slug": "accounts-merge",
    "difficulty": "Medium"
  },
  {
    "title": "Minimize Malware Spread",
    "slug": "minimize-malware-spread",
    "difficulty": "Hard"
  },
  {
    "title": "Min Cost to Connect All Points",
    "slug": "min-cost-to-connect-all-points",
    "difficulty": "Medium"
  },
  {
    "title": "Network Delay Time",
    "slug": "network-delay-time",
    "difficulty": "Medium"
  },
  {
    "title": "Cheapest Flights Within K Stops",
    "slug": "cheapest-flights-within-k-stops",
    "difficulty": "Medium"
  },
  {
    "title": "Path with Maximum Probability",
    "slug": "path-with-maximum-probability",
    "difficulty": "Medium"
  },
  {
    "title": "Path With Minimum Effort",
    "slug": "path-with-minimum-effort",
    "difficulty": "Medium"
  },
  {
    "title": "Swim in Rising Water",
    "slug": "swim-in-rising-water",
    "difficulty": "Hard"
  },
  {
    "title": "Reconstruct Itinerary",
    "slug": "reconstruct-itinerary",
    "difficulty": "Hard"
  },
  {
    "title": "Cracking the Safe",
    "slug": "cracking-the-safe",
    "difficulty": "Hard"
  },
  {
    "title": "Climbing Stairs",
    "slug": "climbing-stairs",
    "difficulty": "Easy"
  },
  {
    "title": "Min Cost Climbing Stairs",
    "slug": "min-cost-climbing-stairs",
    "difficulty": "Easy"
  },
  {
    "title": "House Robber",
    "slug": "house-robber",
    "difficulty": "Medium"
  },
  {
    "title": "House Robber II",
    "slug": "house-robber-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Partition Equal Subset Sum",
    "slug": "partition-equal-subset-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Target Sum",
    "slug": "target-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Last Stone Weight II",
    "slug": "last-stone-weight-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Coin Change",
    "slug": "coin-change",
    "difficulty": "Medium"
  },
  {
    "title": "Coin Change II",
    "slug": "coin-change-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Perfect Squares",
    "slug": "perfect-squares",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Increasing Subsequence",
    "slug": "longest-increasing-subsequence",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Longest Increasing Subsequence",
    "slug": "number-of-longest-increasing-subsequence",
    "difficulty": "Medium"
  },
  {
    "title": "Russian Doll Envelopes",
    "slug": "russian-doll-envelopes",
    "difficulty": "Hard"
  },
  {
    "title": "Unique Paths II",
    "slug": "unique-paths-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Path Sum",
    "slug": "minimum-path-sum",
    "difficulty": "Medium"
  },
  {
    "title": "Triangle",
    "slug": "triangle",
    "difficulty": "Medium"
  },
  {
    "title": "Count Square Submatrices with All Ones",
    "slug": "count-square-submatrices-with-all-ones",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Number of Points with Cost",
    "slug": "maximum-number-of-points-with-cost",
    "difficulty": "Medium"
  },
  {
    "title": "Maximum Profit in Job Scheduling",
    "slug": "maximum-profit-in-job-scheduling",
    "difficulty": "Hard"
  },
  {
    "title": "Burst Balloons",
    "slug": "burst-balloons",
    "difficulty": "Hard"
  },
  {
    "title": "Cherry Pickup",
    "slug": "cherry-pickup",
    "difficulty": "Hard"
  },
  {
    "title": "Longest Increasing Path in a Matrix",
    "slug": "longest-increasing-path-in-a-matrix",
    "difficulty": "Hard"
  },
  {
    "title": "Longest Common Subsequence",
    "slug": "longest-common-subsequence",
    "difficulty": "Medium"
  },
  {
    "title": "Longest Palindromic Subsequence",
    "slug": "longest-palindromic-subsequence",
    "difficulty": "Medium"
  },
  {
    "title": "Edit Distance",
    "slug": "edit-distance",
    "difficulty": "Medium"
  },
  {
    "title": "Decode Ways",
    "slug": "decode-ways",
    "difficulty": "Medium"
  },
  {
    "title": "Word Break",
    "slug": "word-break",
    "difficulty": "Medium"
  },
  {
    "title": "Interleaving String",
    "slug": "interleaving-string",
    "difficulty": "Medium"
  },
  {
    "title": "Wildcard Matching",
    "slug": "wildcard-matching",
    "difficulty": "Hard"
  },
  {
    "title": "Distinct Subsequences",
    "slug": "distinct-subsequences",
    "difficulty": "Hard"
  },
  {
    "title": "Palindrome Partitioning II",
    "slug": "palindrome-partitioning-ii",
    "difficulty": "Hard"
  },
  {
    "title": "House Robber III",
    "slug": "house-robber-iii",
    "difficulty": "Medium"
  },
  {
    "title": "Unique Binary Search Trees II",
    "slug": "unique-binary-search-trees-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Ways to Arrive at Destination",
    "slug": "number-of-ways-to-arrive-at-destination",
    "difficulty": "Medium"
  },
  {
    "title": "Binary Tree Cameras",
    "slug": "binary-tree-cameras",
    "difficulty": "Hard"
  },
  {
    "title": "Sum of Distances in Tree",
    "slug": "sum-of-distances-in-tree",
    "difficulty": "Hard"
  },
  {
    "title": "Minimum Number of Work Sessions to Finish the Tasks",
    "slug": "minimum-number-of-work-sessions-to-finish-the-tasks",
    "difficulty": "Medium"
  },
  {
    "title": "Fair Distribution of Cookies",
    "slug": "fair-distribution-of-cookies",
    "difficulty": "Medium"
  },
  {
    "title": "Shortest Path Visiting All Nodes",
    "slug": "shortest-path-visiting-all-nodes",
    "difficulty": "Hard"
  },
  {
    "title": "Count Numbers with Unique Digits",
    "slug": "count-numbers-with-unique-digits",
    "difficulty": "Medium"
  },
  {
    "title": "Number of Digit One",
    "slug": "number-of-digit-one",
    "difficulty": "Hard"
  },
  {
    "title": "Numbers At Most N Given Digit Set",
    "slug": "numbers-at-most-n-given-digit-set",
    "difficulty": "Hard"
  },
  {
    "title": "Knight Probability in Chessboard",
    "slug": "knight-probability-in-chessboard",
    "difficulty": "Medium"
  },
  {
    "title": "Soup Servings",
    "slug": "soup-servings",
    "difficulty": "Medium"
  },
  {
    "title": "New 21 Game",
    "slug": "new-21-game",
    "difficulty": "Medium"
  },
  {
    "title": "Best Time to Buy and Sell Stock with Cooldown",
    "slug": "best-time-to-buy-and-sell-stock-with-cooldown",
    "difficulty": "Medium"
  },
  {
    "title": "Best Time to Buy and Sell Stock III",
    "slug": "best-time-to-buy-and-sell-stock-iii",
    "difficulty": "Hard"
  },
  {
    "title": "Palindrome Number",
    "slug": "palindrome-number",
    "difficulty": "Easy"
  },
  {
    "title": "Reverse Integer",
    "slug": "reverse-integer",
    "difficulty": "Medium"
  },
  {
    "title": "Factorial Trailing Zeroes",
    "slug": "factorial-trailing-zeroes",
    "difficulty": "Medium"
  },
  {
    "title": "Valid Square",
    "slug": "valid-square",
    "difficulty": "Medium"
  },
  {
    "title": "Minimum Area Rectangle II",
    "slug": "minimum-area-rectangle-ii",
    "difficulty": "Medium"
  },
  {
    "title": "Max Points on a Line",
    "slug": "max-points-on-a-line",
    "difficulty": "Hard"
  },
  {
    "title": "Repeated String Match",
    "slug": "repeated-string-match",
    "difficulty": "Medium"
  },
  {
    "title": "Shortest Palindrome",
    "slug": "shortest-palindrome",
    "difficulty": "Hard"
  },
  {
    "title": "Longest Duplicate Substring",
    "slug": "longest-duplicate-substring",
    "difficulty": "Hard"
  },
  {
    "title": "Range Sum Query - Mutable",
    "slug": "range-sum-query-mutable",
    "difficulty": "Medium"
  },
  {
    "title": "Count of Smaller Numbers After Self",
    "slug": "count-of-smaller-numbers-after-self",
    "difficulty": "Hard"
  },
  {
    "title": "Minimum Interval to Include Each Query",
    "slug": "minimum-interval-to-include-each-query",
    "difficulty": "Hard"
  },
  {
    "title": "The Skyline Problem",
    "slug": "the-skyline-problem",
    "difficulty": "Hard"
  }
];

export const PRACTICE_PROBLEMS: Record<string, PracticeProblem> = {
  'move-zeroes': {
  "id": "mqv2owojjqi",
  "title": "Move Zeroes",
  "slug": "move-zeroes",
  "difficulty": "easy",
  "topics": [
    "Array",
    "Two Pointers"
  ],
  "companies": [
    "Google",
    "Meta",
    "Microsoft",
    "Amazon",
    "Bloomberg",
    "Apple"
  ],
  "externalLink": "https://leetcode.com/problems/move-zeroes/description/",
  "description": "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
  "note": "Note that you must do this in-place without making a copy of the array.",
  "examples": [
    {
      "id": 1,
      "inputName": "nums",
      "inputValue": "[0,1,0,3,12]",
      "outputValue": "[1,3,12,0,0]",
      "inputArray": [
        0,
        1,
        0,
        3,
        12
      ],
      "outputArray": [
        1,
        3,
        12,
        0,
        0
      ]
    },
    {
      "id": 2,
      "inputName": "nums",
      "inputValue": "[0]",
      "outputValue": "[0]",
      "inputArray": [
        0
      ],
      "outputArray": [
        0
      ]
    }
  ],
  "constraints": [
    "1 <= nums.length <= 10^4",
    "-2^31 <= nums[i] <= 2^31 - 1"
  ],
  "followUp": "Could you minimize the total number of operations done?",
  "hints": [
    "Think about the problem differently: instead of \"moving zeroes to the end,\" what if you focused on \"moving non-zeroes to the front\"?",
    "You can use a pointer to track the position where the next non-zero element should be placed. This pointer only advances when you place a non-zero element.",
    "As you iterate through the array, every time you find a non-zero element, swap it with the element at your insert position. After the loop, all zeroes are at the end."
  ],
  "starterCode": {
    "java": "/**\n * @param {number[]} nums\n * @return {void} Do not return anything, modify nums in-place instead.\n */\nvar moveZeroes = function(nums) {\n    \n};",
    "python": "class Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        \"\"\"\n        Do not return anything, modify nums in-place instead.\n        \"\"\"",
    "cpp": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        \n    }\n};",
    "go": "func moveZeroes(nums []int) {\n    // TODO: implement\n}",
    "csharp": "public class Solution {\n    public void MoveZeroes(int[] nums) {\n        \n    }\n}",
    "typescript": "/**\n Do not return anything, modify nums in-place instead.\n */\nfunction moveZeroes(nums: number[]): void {\n    \n};"
  },
  "testCases": [
    {
      "id": 1,
      "input": "[0,1,0,3,12]",
      "output": "[1,3,12,0,0]",
      "parsedInput": [
        0,
        1,
        0,
        3,
        12
      ],
      "parsedOutput": [
        1,
        3,
        12,
        0,
        0
      ]
    },
    {
      "id": 2,
      "input": "[0]",
      "output": "[0]",
      "parsedInput": [
        0
      ],
      "parsedOutput": [
        0
      ]
    },
    {
      "id": 3,
      "input": "[1]",
      "output": "[1]",
      "parsedInput": [
        1
      ],
      "parsedOutput": [
        1
      ]
    },
    {
      "id": 4,
      "input": "[1,2,3,4,5]",
      "output": "[1,2,3,4,5]",
      "parsedInput": [
        1,
        2,
        3,
        4,
        5
      ],
      "parsedOutput": [
        1,
        2,
        3,
        4,
        5
      ]
    },
    {
      "id": 5,
      "input": "[1,0,0,0,0]",
      "output": "[1,0,0,0,0]",
      "parsedInput": [
        1,
        0,
        0,
        0,
        0
      ],
      "parsedOutput": [
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "id": 6,
      "input": "[0,0,0,0,1]",
      "output": "[1,0,0,0,0]",
      "parsedInput": [
        0,
        0,
        0,
        0,
        1
      ],
      "parsedOutput": [
        1,
        0,
        0,
        0,
        0
      ]
    },
    {
      "id": 7,
      "input": "[4,2,4,0,0,3,0,5,1,0]",
      "output": "[4,2,4,3,5,1,0,0,0,0]",
      "parsedInput": [
        4,
        2,
        4,
        0,
        0,
        3,
        0,
        5,
        1,
        0
      ],
      "parsedOutput": [
        4,
        2,
        4,
        3,
        5,
        1,
        0,
        0,
        0,
        0
      ]
    }
  ],
  "solution": {
    "approach": "Two-Pointer Optimal In-Place Swap",
    "intuition": "Maintain a slow pointer (insertPos) pointing to where the next non-zero element belongs. Iterate through the array with a fast pointer (i). Whenever nums[i] != 0, swap nums[i] and nums[insertPos] and increment insertPos.",
    "explanation": "By swapping non-zero elements into insertPos, all non-zero elements remain in their original relative sequence at the beginning, while zeroes naturally get pushed to the end.",
    "timeComplexity": "O(n) - single pass through the array",
    "spaceComplexity": "O(1) - in-place modification, no extra memory allocated",
    "code": {
      "cpp": "class Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        int insertPos = 0;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            if (nums[i] != 0) {\n                swap(nums[insertPos], nums[i]);\n                insertPos++;\n            }\n        }\n    }\n};",
      "python": "class Solution:\n    def moveZeroes(self, nums: List[int]) -> None:\n        insert_pos = 0\n        for i in range(len(nums)):\n            if nums[i] != 0:\n                nums[insert_pos], nums[i] = nums[i], nums[insert_pos]\n                insert_pos += 1",
      "javascript": "var moveZeroes = function(nums) {\n    let insertPos = 0;\n    for (let i = 0; i < nums.length; i++) {\n        if (nums[i] !== 0) {\n            let temp = nums[insertPos];\n            nums[insertPos] = nums[i];\n            nums[i] = temp;\n            insertPos++;\n        }\n    }\n};"
    }
  }
}
};

export function getPracticeProblem(slug: string): PracticeProblem {
  if (PRACTICE_PROBLEMS[slug]) {
    return PRACTICE_PROBLEMS[slug];
  }
  const item = AM_300_PROBLEMS.find((p) => p.slug === slug);
  const title = item ? item.title : slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const difficulty = (item ? item.difficulty.toLowerCase() : 'easy') as 'easy' | 'medium' | 'hard';
  
  // Format function name from slug (e.g. majority-element -> majorityElement)
  const fnName = slug.replace(/-([a-z])/g, (_, g) => g.toUpperCase());

  return {
    id: slug,
    title,
    slug,
    difficulty,
    topics: ["Array", "Two Pointers", "Algorithms"],
    companies: ["Amazon", "Google", "Meta", "Microsoft"],
    externalLink: `https://leetcode.com/problems/${slug}`,
    description: `Given the input parameters for ${title}, implement an efficient algorithm to compute the required output according to the problem specifications.`,
    note: "Optimize for time and space complexity.",
    examples: [
      {
        id: 1,
        inputName: "nums = [2, 7, 11, 15]",
        inputValue: "[2, 7, 11, 15]",
        outputValue: "[0, 1]",
        inputArray: [2, 7, 11, 15],
        outputArray: [0, 1]
      },
      {
        id: 2,
        inputName: "nums = [3, 2, 4]",
        inputValue: "[3, 2, 4]",
        outputValue: "[1, 2]",
        inputArray: [3, 2, 4],
        outputArray: [1, 2]
      }
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9"
    ],
    followUp: "Could you solve this problem with O(n) runtime complexity?",
    hints: [
      "Consider using a hash table or two-pointer approach to optimize searching.",
      "Check if sorting the array first simplifies the solution.",
      "Analyze the problem constraints to choose between linear and logarithmic approaches."
    ],
    starterCode: {
      cpp: `class Solution {\npublic:\n    void ${fnName}(vector<int>& nums) {\n        // Write your solution here\n    }\n};`,
      python: `class Solution:\n    def ${fnName}(self, nums: List[int]) -> None:\n        # Write your solution here\n        pass`,
      java: `class Solution {\n    public void ${fnName}(int[] nums) {\n        // Write your solution here\n    }\n}`,
      javascript: `var ${fnName} = function(nums) {\n    // Write your solution here\n};`,
      typescript: `function ${fnName}(nums: number[]): void {\n    // Write your solution here\n};`,
      go: `func ${fnName}(nums []int) {\n    // Write your solution here\n}`,
      csharp: `public class Solution {\n    public void ${fnName.charAt(0).toUpperCase() + fnName.slice(1)}(int[] nums) {\n        // Write your solution here\n    }\n}`
    },
    testCases: [
      { id: 1, input: "nums = [2, 7, 11, 15]", output: "[0, 1]", parsedInput: [2, 7, 11, 15], parsedOutput: [0, 1] },
      { id: 2, input: "nums = [3, 2, 4]", output: "[1, 2]", parsedInput: [3, 2, 4], parsedOutput: [1, 2] },
      { id: 3, input: "nums = [3, 3]", output: "[0, 1]", parsedInput: [3, 3], parsedOutput: [0, 1] }
    ],
    solution: {
      approach: "Optimal Algorithmic Approach",
      intuition: `Break down ${title} by identifying the optimal data structure and pointer technique.`,
      explanation: `Step-by-step traversal ensuring optimal boundary conditions.`,
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      code: {
        cpp: `class Solution {\npublic:\n    void ${fnName}(vector<int>& nums) {\n        // Optimal C++ Solution\n    }\n};`,
        python: `class Solution:\n    def ${fnName}(self, nums: List[int]) -> None:\n        # Optimal Python Solution\n        pass`
      }
    }
  };
}

export function getAdjacentPracticeProblems(slug: string): { prev: PracticeProblemListItem | null; next: PracticeProblemListItem | null } {
  const idx = AM_300_PROBLEMS.findIndex((p) => p.slug === slug);
  if (idx === -1) return { prev: null, next: AM_300_PROBLEMS[1] || null };
  return {
    prev: idx > 0 ? AM_300_PROBLEMS[idx - 1] : null,
    next: idx < AM_300_PROBLEMS.length - 1 ? AM_300_PROBLEMS[idx + 1] : null
  };
}

